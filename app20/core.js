
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ---------- helpers ---------- */
/* 3D-модели лежат в models/ сжатыми gzip; распаковка встроенным DecompressionStream */
const MODEL_EXT = 'bin';   // gzip-архив модели (раньше — base64-текст 'txt', на треть тяжелее)
/* GLB со сжатой геометрией (Draco): декодер three.js подгружается только когда нужна модель */
// на сайте importmap ведёт декодер в models/draco-r160/ (tools/build.py); без import.meta.resolve (старые браузеры) — туда же
const DRACO_PATH = (() => { try { return import.meta.resolve('three/addons/libs/draco/gltf/'); } catch (e) { return new URL('models/draco-r160/', document.baseURI).href; } })();
let dracoP = null;
let dracoBusy = 0;
function parseGLB(buf, onLoad, onErr) {
  // декодер: один поток; после разбора всех моделей он выгружается (воркер с wasm не висит в памяти); при сбое сети — повторная попытка в следующий раз
  (dracoP ||= import('three/addons/loaders/DRACOLoader.js').then(({ DRACOLoader }) => { const d = new DRACOLoader(); d.setDecoderPath(DRACO_PATH); d.setWorkerLimit(1); return d; }).catch((e) => { dracoP = null; throw e; }))
    .then((d) => new Promise((res, rej) => { dracoBusy++; const l = new GLTFLoader(); l.setDRACOLoader(d); l.parse(buf, '', res, rej); })
      .finally(() => { if (--dracoBusy === 0) { d.dispose(); dracoP = null; } }))
    .then(onLoad).catch(onErr);
}
const MODEL_SIZE = {"skeleton": 2622908, "muscles": 5411333, "vision": 2407019, "digest": 2677972, "repro": 1548263};
/* загрузка модели: прогресс по байтам (плашка в окне сцены); если данных нет 60 с или сеть оборвалась — «Повторить»
   (обещание ждёт повтора, сцена так и показывает «Загружаю…»); слишком старый браузер — сразу ошибка сцене */
function fetchModel(name) {
  const owner = buildingId || curId;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const ac = typeof AbortController === 'function' ? new AbortController() : null; let tm = 0;
      const arm = () => { clearTimeout(tm); if (ac) tm = setTimeout(() => ac.abort(), 60000); };
      arm(); modelUi(name, owner, { got: 0, total: MODEL_SIZE[name] || 0 });
      fetch('models/' + name + '.' + MODEL_EXT, ac ? { signal: ac.signal } : undefined).then(async (r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const total = MODEL_SIZE[name] || +r.headers.get('Content-Length') || 0;
        let blob;
        if (r.body && r.body.getReader) {
          const rd = r.body.getReader(), parts = []; let got = 0;
          for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; arm(); modelUi(name, owner, { got, total }); }
          blob = new Blob(parts);
        } else blob = await r.blob();
        clearTimeout(tm);
        if (typeof DecompressionStream === 'undefined') { const e = new Error('браузер слишком старый для распаковки модели'); e.fatal = true; throw e; }
        return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
      }).then((buf) => { modelUi(name, owner, null); resolve(buf); }, (e) => {
        clearTimeout(tm);
        if (e && e.fatal) { modelUi(name, owner, null); reject(e); return; }
        modelUi(name, owner, { err: e && e.name === 'AbortError' ? 'сеть не отвечает' : String(e && e.message || e), retry: attempt });
      });
    };
    attempt();
  });
}
const $ = (s) => document.querySelector(s);
/* язык сборки: английская сборка (tools/i18n.mjs) меняет 'ru' на 'en' и все русские строки — по словарю data/i18n/en.json */
const LANG = 'ru';
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rnd = mulberry(7);
const rand = (a = 0, b = 1) => a + (b - a) * rnd();
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * v); };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const randUnit = () => { const v = V3(gauss(), gauss(), gauss()); return v.normalize(); };

/* Perlin 3D noise */
const perm = new Uint8Array(512); { const p = [...Array(256).keys()]; const r = mulberry(1337); for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
function grad(hh, x, y, z) { const hv = hh & 15, u = hv < 8 ? x : y, v = hv < 4 ? y : (hv === 12 || hv === 14 ? x : z); return ((hv & 1) ? -u : u) + ((hv & 2) ? -v : v); }
function noise3(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z, B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
  return lerp(lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u), lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
    lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u), lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v), w);
}

/* ---------- renderer ---------- */
const stageEl = $('#stage'), canvas = $('#gl');
/* без WebGL (старый браузер, сбой драйвера) оболочка всё равно строится: навигация, язык, поиск и текст темы работают, вместо сцены — объяснение */
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }
const NOGL = !renderer;
let envTex = null, composer = null, renderPass = null, bloom = null;
function makeEnv() { const pm = new THREE.PMREMGenerator(renderer), t = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); return t; }
if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer:coarse)').matches ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  envTex = makeEnv();
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
  composer.addPass(renderPass);
  bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.85, 0.55, 0.18);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
} else {
  stageEl.append(h('div', { class: 'fallback', role: 'note' }, h('p', {}, 'Этому браузеру не удалось запустить 3D-графику (WebGL). Попробуйте открыть страницу в свежем Chrome, Safari или Firefox.'),
    h('p', {}, 'Текст темы — под окном сцены; другие темы открываются из оглавления и поиска.')));
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.22, 'rgba(255,255,255,.65)'); gr.addColorStop(0.55, 'rgba(255,255,255,.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const GLOW = glowTexture();

/* яркость: оболочки и свечение, запоминаются в браузере */
const LOOK = { shell: 0, bloom: 0 }; // оболочки и свечение выключены (пользователь убрал эти настройки)
const GLASS = [];
function applyLook() {
  GLASS.forEach((m) => { m.uniforms.uRim.value = m.userData.rim0 * LOOK.shell; m.uniforms.uBase.value = m.userData.base0 * LOOK.shell; m.uniforms.uGain.value = 0.35 + 0.65 * LOOK.shell; });
  if (bloom) { bloom.strength = 1.1 * LOOK.bloom; bloom.enabled = LOOK.bloom > 0; }
}

// keep: оболочка видна всегда (клетка, митохондрия, колба — без неё сцена непонятна), не зависит от LOOK.shell
function glassMat(color, { rim = 1.0, base = 0.05, pow = 2.4, additive = true, keep = false } = {}) {
  const m = makeGlass(color, rim, base, pow, additive);
  m.userData.rim0 = rim; m.userData.base0 = base;
  const k = keep ? 1 : LOOK.shell;
  m.uniforms.uRim.value = rim * k; m.uniforms.uBase.value = base * k; m.uniforms.uGain.value = 0.35 + 0.65 * k;
  if (!keep) GLASS.push(m);
  return m;
}
function makeGlass(color, rim, base, pow, additive) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uRim: { value: rim }, uBase: { value: base }, uPow: { value: pow }, uFlash: { value: 0 }, uGain: { value: 1 } },
    clipping: true,
    vertexShader: `#include <clipping_planes_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mvPosition = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mvPosition.xyz); gl_Position = projectionMatrix*mvPosition;
      #include <clipping_planes_vertex>
      }`,
    fragmentShader: `#include <clipping_planes_pars_fragment>
      uniform vec3 uColor; uniform float uRim,uBase,uPow,uFlash,uGain; varying vec3 vN; varying vec3 vV;
      void main(){
      #include <clipping_planes_fragment>
      float f = pow(1.0-abs(dot(normalize(vN),normalize(vV))), uPow); float a = uBase + f*uRim + uFlash*0.25; vec3 c = (uColor*(0.25+f*1.35) + uColor*uFlash)*uGain; gl_FragColor = vec4(c, clamp(a,0.0,1.0)); }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
}

class Sparks {
  constructor(n, size) {
    this.n = n; this.i = 0;
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3); this.vel = new Float32Array(n * 3);
    this.base = new Float32Array(n * 3); this.life = new Float32Array(n); this.max = new Float32Array(n); this.drag = new Float32Array(n);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.mat = new THREE.PointsMaterial({ size, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.obj = new THREE.Points(this.geo, this.mat); this.obj.frustumCulled = false;
  }
  spawn(p, v, color, life, drag = 0, boost = 1) {
    const i = this.i; this.i = (this.i + 1) % this.n; const k = i * 3;
    this.pos[k] = p.x; this.pos[k + 1] = p.y; this.pos[k + 2] = p.z;
    this.vel[k] = v.x; this.vel[k + 1] = v.y; this.vel[k + 2] = v.z;
    this.base[k] = color.r * boost; this.base[k + 1] = color.g * boost; this.base[k + 2] = color.b * boost;
    this.life[i] = life; this.max[i] = life; this.drag[i] = drag;
  }
  clear() { this.life.fill(0); this.col.fill(0); this.geo.attributes.color.needsUpdate = true; }
  update(dt) {
    for (let i = 0; i < this.n; i++) {
      const k = i * 3;
      if (this.life[i] > 0) {
        this.life[i] -= dt;
        const d = Math.exp(-this.drag[i] * dt);
        this.vel[k] *= d; this.vel[k + 1] *= d; this.vel[k + 2] *= d;
        this.pos[k] += this.vel[k] * dt; this.pos[k + 1] += this.vel[k + 1] * dt; this.pos[k + 2] += this.vel[k + 2] * dt;
        const q = clamp(this.life[i] / this.max[i], 0, 1), f = Math.min(1, q / 0.35) * Math.min(1, (1 - q) / 0.08 + 0.2);
        this.col[k] = this.base[k] * f; this.col[k + 1] = this.base[k + 1] * f; this.col[k + 2] = this.base[k + 2] * f;
      } else if (this.col[k] || this.col[k + 1] || this.col[k + 2]) { this.col[k] = this.col[k + 1] = this.col[k + 2] = 0; }
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.attributes.color.needsUpdate = true;
  }
}

function taperTube(curve, rFn, seg = 32, rad = 10) {
  const g = new THREE.TubeGeometry(curve, seg, 1, rad, false);
  const pos = g.attributes.position, uv = g.attributes.uv, c = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const u = Math.min(uv.getX(i), 1); curve.getPointAt(u, c);
    p.fromBufferAttribute(pos, i).sub(c).multiplyScalar(rFn(u)).add(c); pos.setXYZ(i, p.x, p.y, p.z);
  }
  g.computeVertexNormals(); return g;
}
function displaceGeo(g, fn) {
  const pos = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); fn(v, i); pos.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
}
function addLights(scene, rim = 0xff6f9a) {
  scene.add(new THREE.HemisphereLight(0x9fb0ff, 0x1a0e12, 0.55));
  const key = new THREE.DirectionalLight(0xfff1e6, 1.6); key.position.set(6, 9, 7); scene.add(key);
  const r = new THREE.PointLight(rim, 40, 40, 1.6); r.position.set(-7, 3, -6); scene.add(r);
  const f = new THREE.PointLight(0x6f8cff, 25, 40, 1.6); f.position.set(8, -4, 6); scene.add(f);
}
/* «Уменьшить движение» в системе и кнопка паузы: камера сама не вращается, время сцены стоит (перелёты камеры идут — их запускает человек) */
const RMOTION = matchMedia('(prefers-reduced-motion:reduce)');
const ANIM = { paused: false, dt: 0 };
function makeControls(camera, target) {
  const c = new OrbitControls(camera, canvas); c.target.copy(target); c.enableDamping = true; c.dampingFactor = 0.08; c.enabled = false;
  // сцены сами включают автовращение (controls.autoRotate = true / st.rot) — здесь оно гасится, сцены переписывать не нужно
  let ar = false; Object.defineProperty(c, 'autoRotate', { configurable: true, enumerable: true, get: () => ar && !RMOTION.matches && !ANIM.paused, set: (v) => { ar = !!v; } });
  c.update(); return c;
}

/* ---------- UI helpers ---------- */
function group(label, key, ...kids) { return h('div', { class: 'grp' }, h('div', { class: 'glabel' }, label, key ? h('kbd', {}, key) : null), h('div', { class: 'gctl' }, ...kids)); }
function button(text, onclick, primary) { return h('button', { class: 'btn' + (primary ? ' primary' : ''), type: 'button', onclick }, text); }
function toggle(text, get, set) {
  const b = h('button', { class: 'btn', type: 'button', 'aria-pressed': String(!!get()) }, text);
  b.addEventListener('click', () => { set(!get()); b.setAttribute('aria-pressed', String(!!get())); });
  b.sync = () => b.setAttribute('aria-pressed', String(!!get()));
  return b;
}
function seg(opts, get, set, id) {
  const wrap = h('div', { class: 'seg', role: 'group', id });
  const btns = opts.map((o) => {
    const b = h('button', { type: 'button', 'aria-pressed': String(get() === o.id) }, o.color ? h('span', { class: 'dot', style: `background:${o.color}` }) : null, o.label);
    b.addEventListener('click', () => { set(o.id); sync(); });
    return b;
  });
  function sync() { btns.forEach((b, i) => b.setAttribute('aria-pressed', String(get() === opts[i].id))); }
  wrap.append(...btns); wrap.sync = sync; return wrap;
}
function range(id, min, max, step, get, set, fmt) {
  const inp = h('input', { type: 'range', id, min, max, step, value: get(), 'aria-label': id });
  const out = h('output', { for: id }, fmt(get()));
  inp.addEventListener('input', () => { set(+inp.value); out.textContent = fmt(+inp.value); });
  return h('div', { class: 'rng' }, inp, out);
}

const SKEL_META = {"joints": {"C1": [0.04, 15.01, 0.03], "shR": [-1.46, 14.09, 0.77], "shL": [1.61, 14.06, 0.28], "elR": [-1.23, 11.14, 0.88], "elL": [1.71, 11.14, 0.3], "wrR": [-1.12, 8.79, 0.62], "wrL": [1.69, 8.78, 0.44], "hdR": [-1.11, 7.92, 0.75], "hdL": [1.36, 7.96, 0.25], "hpR": [-0.8, 9.06, 0.15], "hpL": [0.8, 9.07, -0.09], "knR": [-0.67, 5.25, 0.15], "knL": [0.88, 5.24, 0.11], "anR": [-0.64, 1.56, -0.29], "anL": [0.92, 1.57, -0.32]}, "anchors": {"skull": [0.0958, 17.2394, 0.2332], "spine": [0.0321, 12.3478, -0.1587], "ribs": [0.0193, 12.9503, 0.5524], "girdle": [0.3873, 13.8778, -0.0364], "arm": [1.6753, 11.4727, 0.357], "hand": [1.5832, 8.2046, 0.4446], "pelvis": [0.048, 9.5687, 0.0343], "femur": [0.9704, 7.0797, 0.02], "leg": [0.8487, 3.4671, -0.0481], "foot": [0.7932, 0.8177, 0.1181]}};

/* =========================================================
   ОБЩИЙ НАБОР: модель мозга для сцен лекций 2–4
   x — вперёд (лоб), y — вверх, z — вбок (правая тройка: z>0 — ПРАВОЕ полушарие, hemi[0]; z<0 — левое, hemi[1])
   ========================================================= */
const LOBES = [
  { id: 'front', name: 'Лобная', color: '#E9785F' },
  { id: 'par', name: 'Теменная', color: '#5E8FEF' },
  { id: 'temp', name: 'Височная', color: '#5CC48A' },
  { id: 'occ', name: 'Затылочная', color: '#F2C14E' },
  { id: 'limb', name: 'Лимбическая', color: '#E58FC4' },
];
const BKP = {   // опорные точки глубоких структур (в координатах модели)
  thal: [V3(0.0, -0.05, 0.2), V3(0.0, -0.05, -0.2)], thalR: V3(0.32, 0.2, 0.2),
  pit: V3(0.38, -0.78, 0), chiasm: V3(0.45, -0.58, 0), mam: V3(0.12, -0.58, 0),
  cc: [V3(0.95, -0.05, 0), V3(0.7, 0.32, 0), V3(0, 0.42, 0), V3(-0.65, 0.3, 0), V3(-0.8, 0.12, 0)],
  stem: [V3(0.05, -0.35, 0), V3(-0.2, -0.85, 0), V3(-0.38, -1.35, 0), V3(-0.48, -2.3, 0)],
  cere: V3(-1.2, -1.0, 0), cereS: V3(0.72, 0.46, 1.05),
};
const bkLs = (x) => -0.2 + (0.75 - x) * 0.28 + 0.05 * smooth(-0.3, -0.8, x);   // боковая (сильвиева) борозда: y(x), сзади — восходящая ветвь
const bkCs = (y) => 0.35 - (y + 0.08) * 0.36 + 0.035 * Math.sin(y * 9);        // центральная борозда: x(y), два колена
const bkPo = (y) => -1.08 - 0.08 * y;                    // теменно-затылочная граница: x(y)
function bkLobe(x, y, u) {
  // u — «латеральность»: < -0.38 медиальная стенка
  if (u < -0.38 && ((x / 0.98) ** 2 + ((y - 0.12) / 0.58) ** 2) < 1) return 4;
  if (x < bkPo(y)) return 3;
  if (u > -0.38 && y < bkLs(x) && x > -1.02 && x < 0.95 && y < 0.3) return 2;
  if (x > bkCs(y)) return 0;
  return 1;
}
let BK = null;
function brainKit() {
  if (BK) return BK;
  const cols = LOBES.map((l) => new THREE.Color(l.color));
  function hemi(side) {
    const g = new THREE.SphereGeometry(1, 230, 170);
    const pos = g.attributes.position, n = pos.count;
    const lobe = new Float32Array(n), col = new Float32Array(n * 3), sulc = new Float32Array(n);
    const v = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(pos, i);
      let x = v.x * 1.62, y = v.y * (v.y > 0 ? 1.18 : 0.86), z = v.z * 0.8 * side;
      if (y > 0) y *= 1 - 0.08 * Math.max(0, -x);
      if (z < -0.48) z = -0.48 - (-0.48 - z) * 0.2;
      if (y < -0.1 && x > -0.7 && x < 1.0 && z > 0.15) y -= 0.22 * smooth(-0.1, -0.6, y) * smooth(0.15, 0.6, z) * (1 - Math.abs(x - 0.15) / 0.85);
      const u = z;
      const L = bkLobe(x, y, u); lobe[i] = L; col.set([cols[L].r, cols[L].g, cols[L].b], i * 3);
      const p = V3(x, y, z * side);
      const n1 = noise3(p.x * 2.4 + side * 7, p.y * 2.4, p.z * 2.4), n2 = noise3(p.x * 5.2 + 3, p.y * 5.2, p.z * 5.2 + side * 3);
      // извилины широкие и скруглённые, борозды узкие: борозда идёт по нулевой линии шума (вторичные — мельче и мельче)
      const s1 = Math.exp(-((n1 / 0.11) ** 2)), s2 = Math.exp(-((n2 / 0.09) ** 2));
      let d = 0.028 - 0.085 * s1 - 0.03 * s2 * (1 - s1);
      // главные борозды
      if (u > -0.3) {
        if (x > -0.85 && x < 0.8) d -= 0.11 * Math.exp(-(((y - bkLs(x)) / 0.05) ** 2));
        if (y > bkLs(x) + 0.02) d -= 0.08 * Math.exp(-(((x - bkCs(y)) / 0.04) ** 2));
        // височный полюс отделён от лобной доли передним краем боковой щели
        if (y < bkLs(x) + 0.03) d -= 0.075 * Math.exp(-(((x - 0.98) / 0.07) ** 2)) * smooth(-0.85, -0.45, y) ** 0.5;
      }
      if (y > -0.2) d -= 0.05 * Math.exp(-(((x - bkPo(y)) / 0.04) ** 2)) * smooth(-0.1, -0.45, u);
      sulc[i] = d;
      c.set(0, -0.1, 0); const dir = p.clone().sub(c).normalize();
      p.addScaledVector(dir, d); p.z += side * 0.55;
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    g.setAttribute('lobe', new THREE.BufferAttribute(lobe, 1)); g.setAttribute('sulc', new THREE.BufferAttribute(sulc, 1));   // sulc: < 0 — дно борозды, > 0 — гребень извилины
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals(); return g;
  }
  const cere = mergeGeometries([displaceGeo(new THREE.SphereGeometry(1, 160, 110), (v) => {
    // листки: узкие борозды дугами вокруг ворот у ножек (спереди), между ними широкие листки; глубокая горизонтальная щель;
    // у латеральных полюсов борозды мельче; червь — неглубокая выемка по средней линии
    const az = Math.abs(v.z), fade = smooth(0.98, 0.7, az);
    const ph = 34 * Math.hypot(v.x - 1.05, v.y * 1.15) + 2.4 * noise3(v.z * 2.2, v.x * 1.5, v.y), groove = Math.pow(0.5 + 0.5 * Math.cos(ph), 5);
    const hfis = Math.exp(-(((v.y + 0.06 - 0.05 * v.x) / 0.05) ** 2)) * smooth(0.5, -0.3, v.x);   // горизонтальная щель
    const fol = 1 + (-0.045 * groove + 0.012 * noise3(v.x * 4, v.y * 4, v.z * 4)) * (0.4 + 0.6 * fade) - 0.06 * hfis;
    const notch = 1 - 0.1 * Math.exp(-((v.z / 0.12) ** 2)) * smooth(-0.2, 0.5, -v.x);
    v.set(v.x * 0.72 * fol * notch, v.y * 0.46 * fol, v.z * 1.05 * fol * (1 - 0.1 * smooth(0.8, 1, az))); v.add(BKP.cere);
  }),
  // средние ножки мозжечка — к мосту
  ...[1, -1].map((s) => taperTube(new THREE.CatmullRomCurve3([V3(-0.95, -0.98, 0.42 * s), V3(-0.62, -1.02, 0.3 * s), V3(-0.3, -1.0, 0.14 * s)]), (u) => 0.13 - 0.03 * u, 24, 12))]);
  const stemCurve = new THREE.CatmullRomCurve3(BKP.stem);
  const stem = taperTube(stemCurve, (u) => (u < 0.45 ? 0.26 + 0.1 * Math.sin(u / 0.45 * Math.PI) : 0.2 - 0.06 * (u - 0.45)), 80, 24);
  { // мост выпячен вперёд, в продолговатом мозге — пирамиды и оливы
    const pos = stem.attributes.position, uv = stem.attributes.uv, c = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const u = Math.min(uv.getX(i), 1); stemCurve.getPointAt(u, c); p.fromBufferAttribute(pos, i);
      const dx = p.x - c.x, dz = p.z - c.z, r = Math.hypot(dx, dz) || 1, fwd = Math.max(0, dx / r);
      p.x += 0.13 * fwd * fwd * Math.sin(Math.PI * smooth(0.12, 0.45, u));                     // мост
      const med = Math.exp(-(((u - 0.62) / 0.12) ** 2));
      p.x += 0.035 * med * fwd * Math.exp(-(((Math.abs(dz / r) - 0.35) / 0.25) ** 2));          // пирамиды
      p.addScaledVector(V3(dx / r, 0, dz / r), 0.05 * med * Math.exp(-(((Math.abs(dz / r) - 0.85) / 0.2) ** 2)) * smooth(-0.3, 0.2, dx / r));   // оливы
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    stem.computeVertexNormals();
  }
  BK = { hemi: [hemi(1), hemi(-1)], cere, stem, stemCurve };
  return BK;
}
/* стекло-мозг: полупрозрачная оболочка + светящийся контур, как в «Системах мозга» */
function brainShell(scene, { opacity = 0.1, rim = 0.62, cere = true, stem = true, color = 0xe0b8c6, glass = 0xf2c7d6 } = {}) {
  const K = brainKit();
  const solid = new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, clearcoat: 0.35, transparent: true, opacity, depthWrite: false, envMapIntensity: 0.5 });
  const gl = glassMat(glass, { rim, base: 0.012, pow: 2.0 });
  const out = { solid, glass: gl, meshes: [] };
  const addG = (g, gm) => { const a = new THREE.Mesh(g, solid), b = new THREE.Mesh(g, gm || gl); scene.add(a, b); out.meshes.push(a, b); };
  K.hemi.forEach((g) => addG(g));
  if (cere) addG(K.cere, glassMat(0xffc9b8, { rim: rim * 0.95, base: 0.012, pow: 2 }));
  if (stem) addG(K.stem, glassMat(0xe8c0d0, { rim: rim * 0.95, base: 0.015, pow: 2 }));
  return out;
}
/* светящийся поток по трубке (как пути медиаторов) */
function flowTubeMat(color, speed = 0.45, dens = 1.6) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOn: { value: 1 }, uPhase: { value: Math.random() * 10 }, uSpeed: { value: speed }, uDens: { value: dens } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime,uOn,uPhase,uSpeed,uDens; varying vec2 vUv;
      void main(){ float s = fract(vUv.x*uDens - uTime*uSpeed + uPhase); float p = smoothstep(0.0,0.06,s)*(1.0-smoothstep(0.06,0.32,s)); float a = (0.16 + 1.1*p)*uOn; gl_FragColor = vec4(uColor*(0.7+2.2*p), a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}
/* ядро: светящаяся сфера с ореолом */
function glowNucleus(parent, p, color, size = 0.05, halo = 9) {
  const core = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.6), transparent: true }));
  core.position.copy(p); parent.add(core);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  spr.scale.setScalar(size * halo); spr.position.copy(p); parent.add(spr);
  return { core, spr };
}
/* общий «перелёт» камеры: st.fly = {target,pos,t} */
function flyStep(st, camera, controls, dt, rate = 2.6, dur = 2.4) {
  if (!st.fly) return;
  if (ANIM.paused) dt = ANIM.dt;   // пауза анимации: перелёт камеры, запрошенный человеком, всё равно доводится
  if (st._fly !== st.fly) { st._fly = st.fly; st.fly.t = 0; }   // повторный перелёт в тот же режим — заново
  st.fly.t += dt; const k = 1 - Math.exp(-dt * rate);
  controls.target.lerp(st.fly.target, k); camera.position.lerp(st.fly.pos, k);
  if (st.fly.t > dur || (st.fly.t > 0.5 && camera.position.distanceTo(st.fly.pos) < 0.01)) { st.fly = null; st._fly = null; }
}
const flyTarget = (target, pos) => ({ target: target.clone(), pos: pos.clone(), t: 0 });
/* «Что видно» + кнопки: стандартная панель сцены */
function infoBox(flex = '1 1 320px') { const info = h('div', { class: 'info' }); return { info, el: h('div', { class: 'grp', style: `flex:${flex}` }, h('div', { class: 'glabel' }, 'Что видно'), info) }; }
/* клик по объектам сцены */
function pickOn(selfRef, camera, objects, onHit) {
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (cur !== selfRef() || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); ray.params.Line = { threshold: 0.05 };
    const list = typeof objects === 'function' ? objects() : objects;
    const vis = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };   // скрытая группа-родитель тоже скрывает
    const hit = ray.intersectObjects(list, false).find((hh) => vis(hh.object) && hh.object.userData.pick !== undefined);
    if (hit) onHit(hit.object.userData.pick, hit);
  });
}
/* материал «живой ткани» */
const tissue = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.4, sheen: 0.3, sheenColor: new THREE.Color(0xffd0e0), sheenRoughness: 0.5, envMapIntensity: 0.35, emissive: 0x000000, ...o });
/* освещение для сцен лекций 2–4: направленные источники не пересвечивают близкие объекты */
function labLights(scene, rim = 0xff7aa8) {
  scene.add(new THREE.HemisphereLight(0x9fb0ff, 0x1a0e12, 0.5));
  const key = new THREE.DirectionalLight(0xfff1e6, 1.3); key.position.set(6, 9, 7); scene.add(key);
  const r = new THREE.DirectionalLight(rim, 0.7); r.position.set(-7, 3, -6); scene.add(r);
  const f = new THREE.DirectionalLight(0x6f8cff, 0.45); f.position.set(8, -4, 6); scene.add(f);
}
/* дерево отростков: массив геометрий */
function branchTree(arr, start, dir, len, r, depth, o = {}) {
  const { spread = 0.8, wob = 0.3, kids = 2, shrink = 0.72, leaf, segs = 14, rad = 7 } = o;
  const pts = [start.clone()]; let p = start.clone(); const d = dir.clone().normalize();
  for (let k = 1; k <= 3; k++) { d.add(randUnit().multiplyScalar(wob)).normalize(); p = p.clone().addScaledVector(d, len / 3); pts.push(p); }
  const r1 = depth > 0 ? r * 0.68 : r * 0.45;
  const c = new THREE.CatmullRomCurve3(pts); arr.push(taperTube(c, (u) => r + (r1 - r) * u, segs, rad));
  if (depth === 0 && leaf) leaf(p, d, c);
  if (depth > 0) for (let j = 0; j < kids; j++) branchTree(arr, p, d.clone().add(randUnit().multiplyScalar(spread)).normalize(), len * shrink, r1, depth - 1, o);
  return c;
}
/* осциллограф показывается только в нужном режиме */
function scopeShow(vis) {
  if (scopeEl.hidden === !vis) return;
  scopeEl.hidden = !vis;
  if (vis) { const dpr = Math.min(window.devicePixelRatio || 1, 2); scopeEl.width = scopeEl.clientWidth * dpr; scopeEl.height = scopeEl.clientHeight * dpr; sctx.setTransform(dpr, 0, 0, dpr, 0, 0); placeScope(); }
}

/* =========================================================
   ОБЩИЙ НАБОР ДЛЯ СИСТЕМ ОРГАНОВ
   y — вверх, z — вперёд (живот), x > 0 — левая сторона человека
   (вид спереди — как на анатомическом атласе: левое справа)
   таз y≈0, плечи y≈2.9, голова y≈4.15
   ========================================================= */
const BODY = { heart: V3(0.18, 2.05, 0.18), neck: 3.45, head: V3(0, 4.15, 0.02) };
function bodyShell(scene, { rim = 0.3, base = 0.012, opacity = 0.025, arms = true, legs = true, head = true, color = 0xe2c0b0, glass = 0xbfd8ff, keep = false } = {}) {
  const prof = [[0.0, -0.7], [0.9, -0.62], [1.0, -0.2], [0.98, 0.15], [0.86, 0.75], [0.84, 1.15], [0.92, 1.7], [1.02, 2.3], [1.12, 2.75], [1.06, 3.0], [0.72, 3.17], [0.3, 3.3], [0.27, 3.55], [0.3, 3.7], [0.0, 3.72]].map(([r, y]) => new THREE.Vector2(r, y));
  const torso = new THREE.LatheGeometry(prof, 64); torso.scale(1, 1, 0.6);
  displaceGeo(torso, (v) => { if (v.z > 0 && v.y > 1.9 && v.y < 2.7) v.z += 0.05 * Math.exp(-(((Math.abs(v.x) - 0.5) / 0.3) ** 2)); if (v.z < 0) v.z *= 1 + 0.08 * Math.exp(-(((v.y - 2.4) / 0.5) ** 2)); });
  const geos = [torso];
  if (head) { const hd = displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { v.set(v.x * 0.4, v.y * 0.5, v.z * 0.47); if (v.y < -0.1) { v.x *= 0.85 + 0.15 * (1 + v.y); } if (v.z > 0.3 && Math.abs(v.y) < 0.12) v.z += 0.06 * Math.exp(-((v.x / 0.06) ** 2)); }); hd.translate(BODY.head.x, BODY.head.y, BODY.head.z); geos.push(hd); }
  if (arms) [1, -1].forEach((s) => { const c = new THREE.CatmullRomCurve3([V3(0.98 * s, 2.82, -0.02), V3(1.22 * s, 2.45, -0.04), V3(1.36 * s, 1.75, -0.06), V3(1.45 * s, 1.15, 0.02)]); geos.push(taperTube(c, (u) => 0.27 - 0.08 * u, 40, 20)); });
  if (legs) [1, -1].forEach((s) => { const c = new THREE.CatmullRomCurve3([V3(0.47 * s, -0.25, 0.0), V3(0.5 * s, -1.2, 0.02), V3(0.48 * s, -2.1, 0.03)]); geos.push(taperTube(c, (u) => 0.46 - 0.16 * u, 40, 22)); });
  const solid = new THREE.MeshPhysicalMaterial({ color, roughness: 0.6, transparent: true, opacity, depthWrite: false, envMapIntensity: 0.4 });
  const gl = glassMat(glass, { rim, base, pow: 2.2, keep });
  const out = { solid, glass: gl, meshes: [] };
  geos.forEach((g) => { const a = new THREE.Mesh(g, solid), b = new THREE.Mesh(g, gl); a.renderOrder = -1; scene.add(a, b); out.meshes.push(a, b); });
  return out;
}
/* орган из ткани; цвет приглушается, чтобы не пересвечивать */
function organMat(color, k = 0.42, o = {}) { return tissue(new THREE.Color(color).multiplyScalar(k), { emissive: new THREE.Color(color), emissiveIntensity: 0.04, ...o }); }
const ell3 = (rx, ry, rz, p, seg = 32) => { const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)); g.scale(rx, ry, rz); if (p) g.translate(p.x, p.y, p.z); return g; };
const tube = (pts, r, seg = 60, rad = 12) => taperTube(new THREE.CatmullRomCurve3(pts), typeof r === 'function' ? r : () => r, seg, rad);
/* частицы, бегущие по кривой: [{c, d}] → позиция на общем пути */
function pathRunner(segs) { const total = segs.reduce((a, s) => a + s.d, 0); return { total, at(t) { let x = ((t % total) + total) % total; for (const s of segs) { if (x <= s.d) return { p: s.c.getPointAt(Math.min(1, x / s.d)), s }; x -= s.d; } const l = segs[segs.length - 1]; return { p: l.c.getPointAt(1), s: l }; } }; }
/* общий выбор органа: подсветка и затемнение остальных */
function dimOthers(parts, sel, base = 1) { parts.forEach((p) => p.mats.forEach((m) => { const on = !sel || sel === p.id; m.transparent = !on || base < 1; m.opacity = on ? base : 0.14; m.depthWrite = on; m.emissiveIntensity = sel === p.id ? 0.35 : 0.04; m.needsUpdate = true; })); }
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// @scene glycolysis makeGlycolysis | Гликолиз, глюконеогенез, ПФП | Углеводы
/* =========================================================
   БИОХИМИЯ · ГЛИКОЛИЗ: 10 реакций с молекулами, анаэробный и аэробный путь,
   спиртовое брожение, глюконеогенез (4 обходные реакции), пентозофосфатный путь
   ========================================================= */
const GL_N = {
  glucose: [-2.4, 2.7], g6p: [0.2, 2.7], f6p: [2.8, 2.7], f16bp: [5.4, 2.7], dhap: [8.0, 3.6], gap: [8.0, 1.3],
  bpg13: [7.0, -0.4], pg3: [4.4, -0.4], pg2: [1.8, -0.4], pep: [-0.8, -0.4], pyruvate: [-3.4, -0.4],
  lactate: [-6.2, -0.4], acetyl: [-3.4, -2.5], acetaldehyde: [-6.2, -2.5], ethanol: [-8.8, -2.5], oaa: [-5.6, 1.4], ribose5p: [-0.8, 1.15],
};
for (const k in GL_N) GL_N[k][0] = +(GL_N[k][0] * 0.92).toFixed(2);

/* ---------- app shell ---------- */
const BUILDERS = { cell: ['cell', 'makeCell'], skeleton: ['skeleton', 'makeSkeleton'], neuron: ['neuron', 'makeNeuron'], synapse: ['synapse', 'makeSynapse'], brain: ['brain', 'makeBrain'], types: ['types', 'makeTypes'], glia: ['glia', 'makeGlia'], develop: ['develop', 'makeDevelop'], vision: ['vision', 'makeVision'], soma: ['soma', 'makeSoma'], ventricles: ['ventricles', 'makeVentricles'], spinal: ['spinal', 'makeSpinal'], cranial: ['cranial', 'makeCranial'], stem: ['stem', 'makeStem'], dien: ['dien', 'makeDien'], hemis: ['hemis', 'makeHemis'], cortex: ['cortex', 'makeCortex'], hippo: ['hippo', 'makeHippo'], cereb: ['cereb', 'makeCereb'], heart: ['heart', 'makeHeart'], lungs: ['lungs', 'makeLungs'], digest: ['digest', 'makeDigest'], kidney: ['kidney', 'makeKidney'], endo: ['endo', 'makeEndo'], immune: ['immune', 'makeImmune'], ear: ['ear', 'makeEar'], skin: ['skin', 'makeSkin'], blood: ['blood', 'makeBlood'], repro: ['repro', 'makeRepro'], chemo: ['chemo', 'makeChemo'], chest: ['chest', 'makeChest'], sresp: ['sresp', 'makeSresp'], menses: ['repro', 'makeMenses'], shealth: ['shealth', 'makeShealth'], enzyme: ['enzyme', 'makeEnzyme'], kinetics: ['kinetics', 'makeKinetics'], enzmed: ['enzmed', 'makeEnzmed'], vitamins: ['vitamins', 'makeVitamins'], atp: ['atp', 'makeAtp'], krebs: ['krebs', 'makeKrebs'], etc: ['etc', 'makeEtc'], radicals: ['radicals', 'makeRadicals'], glycolysis: ['glycolysis', 'makeGlycolysis'], glycogen: ['glycogen', 'makeGlycogen'], carbdig: ['carbdig', 'makeCarbdig'], membrane: ['membrane', 'makeMembrane'], betaox: ['betaox', 'makeBetaox'], lipoprot: ['lipoprot', 'makeLipoprot'], lipogen: ['lipogen', 'makeLipogen'], eicosanoids: ['eicosanoids', 'makeEicosanoids'], protein: ['protein', 'makeProtein'], aminoacid: ['aminoacid', 'makeAminoacid'], amines: ['amines', 'makeAmines'], dna: ['dna', 'makeDna'], express: ['express', 'makeExpress'], purine: ['purine', 'makePurine'], antibiotics: ['antibiotics', 'makeAntibiotics'], mutations: ['mutations', 'makeMutations'], hormsig: ['hormsig', 'makeHormsig'], fedfast: ['fedfast', 'makeFedfast'], thyroid: ['thyroid', 'makeThyroid'], adrenal: ['adrenal', 'makeAdrenal'], calcium: ['calcium', 'makeCalcium'], pituitary: ['pituitary', 'makePituitary'], diabetes: ['diabetes', 'makeDiabetes'], sexhorm: ['sexhorm', 'makeSexhorm'], hemoglobin: ['hemoglobin', 'makeHemoglobin'], heme: ['heme', 'makeHeme'], bloodchem: ['bloodchem', 'makeBloodchem'], liver: ['liver', 'makeLiver'], nitrogen: ['nitrogen', 'makeNitrogen'], planes: ['planes', 'makePlanes'], joints: ['joints', 'makeJoints'], referred: ['referred', 'makeReferred'] };
const built = {};
let cur = null, curId = null, buildingId = null;
const statsEl = $('#stats'), consoleEl = $('#console'), labelsEl = $('#labels'), scopeEl = $('#scope'), notesEl = $('#notes'), hudTtl = $('.ttl');
const sctx = scopeEl.getContext('2d');
let labelEls = [];

function accentSet(c) { document.documentElement.style.setProperty('--accent', c); }

// разделы, где кадр на компьютере отодвигается от пульта и заголовка (у биохимии ракурсы частично уже учитывают пульт — сдвиг вполсилы; сцена уточняет deskShift)
const DESK_SHIFT = { body: 1, cell: 1, brain: 1, bio: 0.5 };
function layout() {
  if (!renderer) return;
  const w = stageEl.clientWidth, hgt = stageEl.clientHeight;
  renderer.setSize(w, hgt, false); composer.setSize(w, hgt); bloom.setSize(w, hgt);
  // режим съёмки: кадр рисуется в 1920 пикселей по высоте при любом размере окна
  if (REC) { const pr = 1920 / Math.max(1, hgt); renderer.setPixelRatio(pr); composer.setPixelRatio(pr); recFit(hgt); }
  // на узком (портретном) экране расширяем угол обзора, чтобы сцена помещалась по ширине
  // в режиме съёмки по ширине влезает меньше: вертикальный ролик обрезает края, а объект крупнее
  const asp = w / Math.max(1, hgt), A0 = REC ? 0.9 : 1.5;
  // ракурсы сцен биохимии рассчитаны на компьютер: цель камеры смещена, чтобы объект не прятался под заголовком и пультом.
  // На телефоне пульт вынесен под сцену — возвращаем объект к центру сдвигом кадра (вниз и влево).
  const bioMob = mqMob.matches && !REC;   // в режиме съёмки объект ставится в центр иначе — recCenter()
  Object.entries(built).forEach(([id, s]) => { const c = s.camera; if (c.userData.fov0 === undefined) c.userData.fov0 = c.fov; c.fov = asp < A0 ? 2 * Math.atan(Math.tan(c.userData.fov0 * Math.PI / 360) * A0 / asp) * 180 / Math.PI : c.userData.fov0; c.aspect = asp;
    const sec = (secOf(id) || {}).id;
    if (bioMob && sec === 'bio') { const z = s.mobZoom || 0.7; c.setViewOffset(w, hgt, (1 - z) / 2 * w + 0.05 * w, (1 - z) / 2 * hgt - Math.min(0.2, 0.13 * asp) * hgt, z * w, z * hgt); }
    // телефон, «Тело» и «Клетка»: объект крупнее (по умолчанию 0,8; сцена задаёт mobZoom), чуть ниже — под цифрами
    else if (bioMob && DESK_SHIFT[sec] !== undefined) { const z = s.mobZoom || 0.8; c.setViewOffset(w, hgt, (1 - z) / 2 * w, (1 - z) / 2 * hgt - 0.04 * hgt, z * w, z * hgt); }
    // компьютер: пульт лежит поверх низа сцены, заголовок — слева сверху; центр кадра переносим в свободную область (сцена может ослабить: deskShift)
    else if (!bioMob && DESK_SHIFT[sec] && consoleEl.parentNode === stageEl) {
      // кадр чуть отдаляется (z) и его середина встаёт в середину свободной области над пультом, немного правее (от заголовка)
      // отдаление тем больше, чем выше пульт (свободная высота F), но не больше 1,35
      const k = DESK_SHIFT[sec] * (s.deskShift ?? 1), F = Math.max(0.3 * hgt, hgt - k * (0.95 * consoleEl.offsetHeight + 0.05 * hgt));
      const z = 1 + (Math.min(1.35, Math.sqrt(hgt / F)) - 1) * k, cy = 0.05 * k * hgt + F / 2, cx = w / 2 + 0.05 * k * w;
      c.setViewOffset(w, hgt, w / 2 - z * cx, hgt / 2 - z * cy, z * w, z * hgt);
    }
    else c.clearViewOffset();
    c.updateProjectionMatrix(); });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  scopeEl.width = scopeEl.clientWidth * dpr; scopeEl.height = scopeEl.clientHeight * dpr; sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  placeScope();
}
/* режим съёмки роликов (адрес с ?rec): кадр 9:16 без интерфейса, пульт — справа от кадра */
const REC = new URLSearchParams(location.search).has('rec');
function placeScope() { scopeEl.style.bottom = (consoleEl.parentNode === stageEl ? consoleEl.offsetHeight + 28 : 12) + 'px'; }
/* телефон: панель управления уходит под сцену, яркость — за кнопкой */
const mqMob = matchMedia('(max-width:700px)');
function placeConsole() {
  if (REC) { placeScope(); return; }   // пульт живёт в боковой панели съёмки
  if (mqMob.matches) { if (consoleEl.parentNode === stageEl) { stageEl.after(consoleEl); consoleEl.classList.add('out'); } }
  else if (consoleEl.parentNode !== stageEl) { stageEl.append(consoleEl); consoleEl.classList.remove('out'); }
  placeScope();
}
mqMob.addEventListener('change', placeConsole); placeConsole();
/* тексты разметки страницы: в английской сборке эти строки переводятся словарём */
if (LANG !== 'ru') {
  document.documentElement.lang = LANG;
  const T = (sel, txt, attr) => { const e = $(sel); if (!e) return; if (attr) e.setAttribute(attr, txt); else e.innerHTML = txt; };
  document.title = 'Кто мы? — от молекулы до мысли';
  T('.brand .bt', 'Кто мы?'); T('.brand .bs', 'от молекулы до мысли');
  T('#sections', 'Разделы атласа по масштабу', 'aria-label'); T('#subtabs', 'Темы раздела', 'aria-label'); T('#stage', 'Трёхмерная сцена', 'aria-label');
  T('#inst', 'Установить'); T('#donate', 'Поддержать проект', 'aria-label'); T('#donate .dtxt', 'Поддержать'); T('#cfg', 'Настройки');
  T('.dclose button', 'Закрыть', 'aria-label'); T('#donateTitle', 'Поддержать проект');
  T('.dlead', '«Кто мы?» бесплатный и без рекламы. Новые темы, 3D-модели и приложение делаются на энтузиазме — если атлас вам полезен, вы можете помочь его развитию.');
  T('#dcopy', 'Скопировать адрес'); T('#toast', 'Скопировано!'); T('.dcrypto summary', 'Криптовалюта: USDT (TRC-20)');
  T('.dopt:nth-child(1) .dsub', 'картой или по СБП, разово или подпиской'); T('.dopt:nth-child(2) .dsub', 'чаевые картой — по ссылке или QR-коду');
  T('.dh3', 'Обратная связь');
  T('.dopt img', 'QR-код tips.tips', 'alt'); T('.dqr img', 'QR-код адреса USDT', 'alt'); T('.dcontact img', 'QR-код Telegram-канала', 'alt');
  T('#srch', 'Поиск по темам (/)', 'title'); T('#srch .stxt', 'Поиск');
  T('#share', 'Поделиться темой', 'aria-label'); T('#share', 'Поделиться темой', 'title');
  T('#recam', 'Сбросить вид камеры', 'aria-label'); T('#recam', 'Сбросить вид камеры (Home)', 'title');
  T('#anim', 'Пауза анимации', 'aria-label'); T('#anim', 'Пауза анимации', 'title'); T('.skip', 'К тексту темы');
  T('#finder', 'Поиск по темам', 'aria-label'); T('#fq', 'Найти тему…', 'placeholder'); T('#fq', 'Найти тему', 'aria-label');
  T('.fesc .vh', 'Закрыть поиск'); T('#fres', 'Темы', 'aria-label'); T('.fkeys', '<kbd>↑</kbd><kbd>↓</kbd> выбрать · <kbd>Enter</kbd> открыть');
  T('.dctxt', 'Новости, новые темы и обсуждение — в Telegram-канале <a href="https://t.me/KTOMY_ATLAS" target="_blank" rel="noopener">@KTOMY_ATLAS</a>. Ошибки и предложения пишите на <a href="mailto:gonya83raul@gmail.com">gonya83raul@gmail.com</a>.');
  T('.fcontact', 'Обратная связь: Telegram-канал <a href="https://t.me/KTOMY_ATLAS" target="_blank" rel="noopener">@KTOMY_ATLAS</a> · почта <a href="mailto:gonya83raul@gmail.com">gonya83raul@gmail.com</a> · <a href="https://boosty.to/chelovek3d/donate" target="_blank" rel="noopener">поддержать на Boosty</a>');
  T('.dwarn', 'Отправляйте только <b>USDT в сети TRON (TRC-20)</b>. Перевод другой монеты или в другой сети потеряется.');
  T('.foot .fcredit', '3D-модели: зрительная система — Sergey Burov, мышцы — Diego Luján García, органы малого таза и пищеварения — Education Resource Fund (Sketchfab, лицензия CC BY 4.0).');
}
/* логотип ведёт на главную своего языка; посетителю с нерусским браузером на русской главной — ненавязчивое предложение английской версии */
if (LANG === 'en') $('.brand').setAttribute('href', 'index.en.html');
if (window.__LANGNOTE && LANG === 'ru') { let off = false; try { off = localStorage.getItem('langnote') === '0'; } catch (e) { /* без памяти */ }
  if (!off) { const n = h('div', { class: 'langnote', lang: 'en', role: 'note' }, 'This atlas is also available in English. ', h('a', { href: 'index.en.html' }, 'Open the English version'),
      h('button', { type: 'button', 'aria-label': 'Dismiss', onclick: () => { n.remove(); try { localStorage.setItem('langnote', '0'); } catch (e) { /* без памяти */ } } }, '✕'));
    $('.top').after(n); } }
/* переключатель языка: запоминается, ссылка ?lang=en|ru */
{ const lb = $('#lang'), other = LANG === 'ru' ? 'en' : 'ru';
  lb.textContent = other.toUpperCase(); lb.lang = other; lb.title = other === 'en' ? 'English' : 'Русский';
  lb.addEventListener('click', () => { try { localStorage.setItem('lang', other); } catch (e) { /* без памяти — через ссылку */ }
    // «Назад» с другой версии должен вернуть на эту: у главной язык выбирается по памяти браузера, поэтому в истории оставляем явный ?lang=
    if (isRootUrl() && new URLSearchParams(location.search).get('lang') !== LANG) { try { history.replaceState(history.state, '', location.pathname + '?lang=' + LANG + location.hash); } catch (e) { /* не критично */ } }
    location.href = PAGES && curId ? (isRootUrl() ? (other === 'en' ? 'index.en.html' : './?lang=ru') : pageUrl(curId, other)) : location.pathname + '?lang=' + other + location.hash; });
}
{ const dlg = $('#donatebox'), btn = $('#donate'), cp = $('#dcopy');
  btn.addEventListener('click', () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  const toast = $('#toast'); let tt = 0;
  const showToast = () => { toast.hidden = false; clearTimeout(tt); tt = setTimeout(() => { toast.hidden = true; }, 1800); };
  cp.addEventListener('click', () => { const a = $('#daddr').textContent.trim();
    const sel = () => { getSelection().selectAllChildren($('#daddr')); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(a).then(showToast, () => { sel(); try { document.execCommand('copy'); showToast(); } catch (e) { /* адрес выделен — скопируйте вручную */ } });
    else { sel(); try { document.execCommand('copy'); showToast(); } catch (e) { /* адрес выделен */ } } });
}
{ const cfg = $('#cfg'), top = $('.top'); cfg.addEventListener('click', () => { const o = top.classList.toggle('open'); cfg.setAttribute('aria-expanded', String(o)); }); }
new ResizeObserver(layout).observe(stageEl);
new ResizeObserver(layout).observe(consoleEl);   // высота пульта меняется с режимом — кадр следует за ней

/* адреса тем: на сайте у каждой темы своя страница (krebs.html, krebs.en.html — их делает tools/build.py), в офлайн-файле — #krebs */
const PAGES = !!document.querySelector('meta[name="atlas-pages"]');
const pageUrl = (id, lang = LANG) => id + (lang === 'en' ? '.en' : '') + '.html';
const isRootUrl = () => !/\.html$/.test(location.pathname) || /\/index(\.en)?\.html$/.test(location.pathname);
let fromPop = false;
const idFromUrl = () => { const hs = location.hash.slice(1); if (BUILDERS[hs]) return hs; const m = location.pathname.match(/\/([a-z0-9]+)(?:\.en)?\.html$/i); return m && BUILDERS[m[1]] ? m[1] : ''; };
let navigated = false;
/* темы и разделы: новая система человека = одна строка здесь */
const TOPIC_LEDE = { cell: 'Ядро, ЭПС, Гольджи, митохондрии и цитоскелет в разрезе. Пузырьки везут белки к мембране, по микротрубочкам едут грузы, митохондрии выдают АТФ.', skeleton: 'Трёхмерный скан настоящего скелета с кровеносной системой поверх него. Вращайте его, приближайте и нажимайте на кости; в рентгене видно, как они соединяются в суставах.', neuron: 'Дендриты собирают сигналы, у аксонного холмика рождается потенциал действия, и импульс скачками бежит по миелину к окончаниям.', synapse: 'Импульс открывает кальциевые каналы, пузырьки выплёскивают медиатор, молекулы находят рецепторы, и сигнал выключают ферменты или переносчики.', brain: 'Маленькие ядра в стволе и основании мозга раскидывают отростки по огромной территории. Поэтому одно вещество меняет состояние всего мозга сразу.', types: 'Семь форм нервных клеток и маленькая нейросеть. Можно покрасить их так, как это делали Гольджи и Ниссль, или раскрасить методом Brainbow.', glia: 'Glia по-гречески «клей». Глия упаковывает нейроны, изолирует их, охраняет вход из крови и убирает мусор.', develop: 'От плоской нервной пластинки к трубке, пузырям и полушариям. Перетащите срок или запустите развитие целиком.', vision: 'Путь сигнала от сетчатки до затылочной коры и оптика глаза. Выберите повреждение и посмотрите, какая часть поля зрения пропадёт.', soma: 'Тело нейрона в разрезе: ядро, субстанция Ниссля, аппарат Гольджи, митохондрии и нити цитоскелета. Сигналы с синапсов сходятся к аксонному холмику, где решается, будет ли импульс.', ventricles: 'Внутри мозга — система полостей с ликвором, снаружи — три оболочки. Они питают, защищают и служат удобными ориентирами в анатомии.', spinal: 'Трубка из нервной ткани в позвоночном канале: 31 сегмент, рефлекторные дуги и проводящие пути между телом и головным мозгом.', cranial: 'Двенадцать пар нервов головного мозга. Каждый уникален: одни только чувствуют, другие только управляют мышцами, третьи делают и то и другое.', stem: 'Продолговатый и средний мозг — древние отделы, общие для всех позвоночных; мост как отдельный отдел есть только у млекопитающих. Здесь центры дыхания и сердца, сна и бодрствования, и все пути между мозгом и телом.', dien: 'Таламус решает, какая информация попадёт в кору. Гипоталамус следит за потребностями тела и через гипофиз управляет гормонами.', hemis: 'Под корой — белое вещество и ядра базальных ганглиев. Они собирают отдельные движения в программы и вместе с лимбической системой решают, что нам нужно.', cortex: 'Пять долей, 52 поля Бродмана, шесть слоёв и колонки-процессоры. Посмотрите, где говорит, видит и двигается кора и как сигнал проходит через её слои.', hippo: 'Гиппокамп держит память текущего дня: сигнал бегает по кругу Пейпеза и по трисинаптической петле, а частая стимуляция усиливает синапсы — так рождается память.', cereb: 'Больше половины нейронов мозга — в мозжечке. На дендритах клеток Пуркинье записывается двигательная память: как быстро и точно сделать каждое движение.', heart: 'Четыре камеры, четыре клапана и собственный водитель ритма. За жизнь сердце сокращается около 3 миллиардов раз и перекачивает 5 литров крови каждую минуту.', lungs: 'Около 20 000 вдохов в сутки. Воздух проходит по ветвящемуся дереву бронхов к сотням миллионов альвеол, где кислород за доли секунды переходит в кровь.', digest: 'От бутерброда до глюкозы в крови — около суток пути по трубке длиной 8–10 метров, с кислотой, ферментами, желчью и триллионами бактерий.', kidney: 'Каждые сутки почки пропускают через себя всю кровь около 300 раз, отфильтровывают 180 литров жидкости и возвращают обратно в кровь 99% её.', endo: 'Крошечные железы управляют ростом, обменом веществ, сном, стрессом и сахаром крови, рассылая по кровотоку химические письма — гормоны.', immune: 'Сеть сосудов и узлов, где триллион лимфоцитов патрулирует тело, узнаёт чужое и запоминает его на годы вперёд.', ear: 'Три крошечные косточки, улитка с жидкостью и 15 000 волосковых клеток превращают колебания воздуха в звуки, а соседние каналы следят за каждым поворотом головы.', skin: 'Кусочек кожи в разрезе: три слоя, волос, железы, сосуды и пять видов рецепторов, каждый из которых отвечает на своё — касание, давление, вибрацию, растяжение или боль.', blood: 'Пять литров жидкой ткани: 25 триллионов эритроцитов, армия лейкоцитов и тромбоциты, которые за минуты закрывают любую ранку.', repro: 'Как устроены половые системы, как гормоны гипофиза и яичников задают 28-дневный цикл и что происходит с новой жизнью в первую неделю.', chemo: 'Два химических чувства: нос различает тысячи запахов по узору сотен рецепторов, язык — пять базовых вкусов. Вместе они дают то, что мы называем вкусом еды.', chest: 'Костный каркас, который защищает сердце и лёгкие и помогает дышать, и устройство молочной железы — от долек до протоков и гормонов кормления.', sresp: 'Как мозг, вегетативная нервная система, сосуды и гормоны согласованно проводят тело через четыре фазы полового ответа — от возбуждения до разрешения.', menses: 'Около 28 дней, за которые гипофиз и яичники готовят яйцеклетку и слизистую матки к возможной беременности, — по дням, с гормонами, фолликулом и эндометрием.', shealth: 'Откуда берётся половое влечение, какие системы мозга и гормоны им управляют, и как сделать сексуальные контакты безопасными: инфекции, контрацепция и согласие.', enzyme: 'Белок-катализатор узнаёт свою молекулу, обнимает её активным центром и ускоряет реакцию в миллионы раз. Модели построены по реальным атомным структурам.', kinetics: 'Живая модель раствора: 14 молекул фермента ловят субстрат. Меняйте концентрацию, температуру, pH и добавляйте ингибиторы — график Михаэлиса — Ментен меняется вместе с моделью.', enzmed: 'Как клетка включает и выключает ферменты — эффекторами, фосфатом, отрезанием куска цепи — и как врачи используют ферменты для диагностики и лечения.', vitamins: 'Тринадцать веществ, которые организм не умеет делать сам. Большинство из них — детали ферментов: без витамина фермент не работает.', atp: 'Клетка не может напрямую «сжечь» сахар для работы: энергия пищи сначала переводится в универсальную валюту — АТФ. Человек за сутки синтезирует и тратит её примерно столько, сколько весит сам.', krebs: 'Восемь реакций в матриксе митохондрии разбирают «активную уксусную кислоту» на два CO₂ и снимают с неё водород для дыхательной цепи.', etc: 'Внутренняя мембрана митохондрии: электроны бегут к кислороду, протоны выкачиваются наружу, а потом крутят молекулярную турбину, собирающую АТФ.', radicals: 'Кислород даёт клетке энергию, но один неспаренный электрон превращает его в радикал, способный разрушать мембраны, белки и ДНК. Против этого у клетки целая система защиты.', glycolysis: 'Десять реакций цитоплазмы разрезают глюкозу на два пирувата. Дальше — лактат, спирт или митохондрия; а печень умеет пройти этот путь обратно.', glycogen: 'Глюкоза — быстрое топливо, но хранить её в свободном виде нельзя: вода хлынула бы в клетку. Поэтому печень и мышцы запасают её в ветвистых гранулах гликогена.', carbdig: 'Хлеб, сахар и молоко превращаются в три простых сахара — глюкозу, фруктозу и галактозу. Как они проходят через стенку кишки и что бывает, когда одного фермента не хватает.', membrane: 'Жиры — самый плотный запас энергии и основа всех клеточных мембран. Их объединяет одно: они не дружат с водой.', betaox: 'Как жир из жировой клетки превращается в энергию: липолиз, челнок карнитина, спираль β-окисления — и запасной «бензин» для мозга при голоде.', lipoprot: 'Жир и холестерин не растворяются в крови, поэтому путешествуют в белково-липидных частицах. От их баланса зависит здоровье артерий.', lipogen: 'Как из глюкозы и жирных кислот собирается жир и фосфолипиды мембран, почему печень может «ожиреть» и что происходит с жировой тканью, когда калорий слишком много.', eicosanoids: 'Из одной жирной кислоты мембраны клетка за секунды делает сигналы боли, жара, тромба и спазма — а аспирин и ибупрофен выключают один фермент на этом пути.', protein: 'Цепочка из двадцати видов «бусин» сама сворачивается в точную трёхмерную машину. Здесь — аминокислоты, четыре уровня структуры гемоглобина и шаперон, который помогает белкам укладываться.', aminoacid: 'Белки пищи разбираются на аминокислоты; их азот снимается, превращается в ядовитый аммиак — и печень упаковывает его в безопасную мочевину.', amines: 'Отщепив всего одну молекулу CO₂, клетка превращает обычную аминокислоту в мощный сигнал: гистамин, серотонин, дофамин, адреналин, ГАМК.', dna: 'Два метра ДНК в каждой клетке хранят инструкцию для всего организма. Как она устроена, как копируется перед делением и как чинится.', express: 'Центральная догма: ДНК → РНК → белок. Ген переписывается в мРНК, мРНК созревает и уходит к рибосоме, где кодоны превращаются в аминокислоты.', purine: 'Из чего строятся буквы генетического кода, во что они превращаются при распаде и почему избыток мочевой кислоты оборачивается болью в суставах.', antibiotics: 'Рибосома бактерий чуть отличается от нашей — и этого хватает, чтобы маленькая молекула остановила микроба, не тронув человека.', mutations: 'Одна буква в ДНК может ничего не изменить — или превратить эритроцит в серп. А после сборки белок ещё дорабатывают: метят, режут и отправляют на уничтожение.', hormsig: 'Гормон — это письмо, а не работник: он лишь передаёт команду. Как клетка читает это письмо через рецептор на мембране или в ядре и многократно усиливает его.', fedfast: 'Органы делят топливо как слаженная команда: после еды — запасают, натощак — делятся, при голоде — перестраиваются так, чтобы мозг не остался без питания.', thyroid: 'Два гормона из аминокислоты тирозина и йода задают скорость обмена веществ во всех клетках тела — от сердца до растущего мозга.', adrenal: 'Две железы в одной: кора из холестерина делает стероиды — альдостерон, кортизол, андрогены, а мозговое вещество выбрасывает адреналин за секунды.', calcium: 'Килограмм кальция лежит в костях, а в крови — меньше грамма. Паратгормон и витамин D следят, чтобы этот грамм не сдвинулся больше чем на несколько процентов.', pituitary: 'Участок мозга размером с ноготь и железа с горошину управляют ростом, водой, стрессом, обменом веществ, размножением и молоком.', diabetes: 'Одна клетка поджелудочной меряет сахар крови с точностью до долей миллимоля — и полмиллиарда людей живут с диабетом, когда этот датчик ломается.', sexhorm: 'Тестостерон и эстрадиол отличаются всего одним углеродом и кольцом — но определяют, как растёт тело; а несколько миллиардов молекул ХГЧ в капле мочи дают вторую полоску на тесте.', hemoglobin: 'Около 270 миллионов молекул гемоглобина в каждом эритроците. Как этот белок забирает кислород в лёгких и вовремя отдаёт его тканям.', heme: 'Как клетка собирает гем из глицина и сукцинил-КоА — и во что он превращается, когда эритроцит отслужил свои 120 дней.', bloodchem: 'Как кровь держит pH с точностью до сотых, что переносят белки плазмы и как за минуты затягивается рана.', liver: 'Главная химическая фабрика тела: всё, что всосалось в кишечнике, сначала проходит через неё — и лекарства, и алкоголь, и яды.', nitrogen: 'По нескольким числам из пробирки — мочевине, креатинину, pH и CO₂ — врач видит, как работают почки, печень и лёгкие.', planes: 'Прежде чем изучать органы, анатомы договорились, как описывать их положение: из какой позы смотреть, как резать и куда показывать.', joints: 'Кость — живая ткань прочнее бетона на сжатие и легче стали, а сустав скользит с трением меньше, чем лёд по льду.', referred: 'Почему при инфаркте болит левая рука, а при аппендиците сначала живот вокруг пупка: органы «жалуются» на коже своих сегментов спинного мозга.' };
const SECTIONS = [
  { id: 'body', name: 'Тело', scenes: [['#', 'Как устроено тело'], ['planes', 'Плоскости, направления и полости'], ['referred', 'Отражённая боль'], ['#', 'Опора и движение'], ['skeleton', 'Скелет, мышцы и сосуды'], ['joints', 'Кости и суставы'], ['#', 'Системы органов'], ['heart', 'Сердце и кровообращение'], ['lungs', 'Дыхание'], ['digest', 'Пищеварение'], ['kidney', 'Почки'], ['blood', 'Кровь'], ['endo', 'Эндокринная система'], ['immune', 'Лимфа и иммунитет'], ['repro', 'Размножение и развитие'], ['menses', 'Менструальный цикл'], ['shealth', 'Влечение и сексуальное здоровье'], ['sresp', 'Цикл полового ответа'], ['chest', 'Грудная клетка и молочная железа']] },
  { id: 'cell', name: 'Клетка', scenes: [['cell', 'Живая клетка']] },
  { id: 'bio', name: 'Биохимия', scenes: [['#', 'Ферменты'], ['enzyme', 'Как работает фермент'], ['kinetics', 'Скорость реакции и ингибиторы'], ['enzmed', 'Регуляция и ферменты в медицине'], ['#', 'Витамины'], ['vitamins', 'Витамины и коферменты'], ['#', 'Энергия'], ['atp', 'АТФ и стадии катаболизма'], ['krebs', 'Пируватдегидрогеназа и цикл Кребса'], ['etc', 'Дыхательная цепь и АТФ-синтаза'], ['radicals', 'Свободные радикалы и антиоксиданты'], ['#', 'Углеводы'], ['glycolysis', 'Гликолиз, глюконеогенез, ПФП'], ['glycogen', 'Гликоген и сахар крови'], ['carbdig', 'Переваривание сахаров, лактоза, фруктоза'], ['#', 'Липиды'], ['membrane', 'Липиды и мембраны'], ['betaox', 'Окисление жиров и кетоновые тела'], ['lipoprot', 'Холестерин и липопротеины'], ['lipogen', 'Синтез жиров, фосфолипиды, ожирение'], ['eicosanoids', 'Эйкозаноиды и обезболивающие'], ['#', 'Белки и аминокислоты'], ['protein', 'Белки: аминокислоты и укладка'], ['aminoacid', 'Обмен аминокислот и мочевина'], ['amines', 'Биогенные амины, глицин и серин'], ['#', 'Нуклеотиды и гены'], ['dna', 'ДНК: строение, репликация, репарация'], ['express', 'Транскрипция и трансляция'], ['purine', 'Нуклеотиды и подагра'], ['antibiotics', 'Антибиотики и синтез белка'], ['mutations', 'Мутации и модификация белков'], ['#', 'Гормоны'], ['hormsig', 'Как гормоны действуют на клетку'], ['fedfast', 'Обмен веществ: сытость и голод'], ['thyroid', 'Гормоны щитовидной железы'], ['adrenal', 'Надпочечники: стероиды и стресс'], ['calcium', 'Кальций: паратгормон и витамин D'], ['pituitary', 'Гипоталамус и гипофиз'], ['diabetes', 'Инсулин и сахарный диабет'], ['sexhorm', 'Половые гормоны и беременность'], ['#', 'Кровь и печень'], ['hemoglobin', 'Гемоглобин и перенос кислорода'], ['heme', 'Обмен гема и желтухи'], ['bloodchem', 'Кровь: pH, белки плазмы, свёртывание'], ['liver', 'Печень: обезвреживание, алкоголь, парацетамол'], ['nitrogen', 'Азот крови, буферы и кислотно-основное состояние']] },
  { id: 'brain', name: 'Мозг', scenes: [
    ['#', 'Нейроны'], ['soma', 'Строение нейрона'], ['types', 'Типы нейронов'], ['neuron', 'Нейрон и импульс'], ['synapse', 'Синапс и медиаторы'], ['glia', 'Нейроглия'],
    ['#', 'Устройство'], ['develop', 'Развитие мозга'], ['ventricles', 'Желудочки и оболочки'], ['spinal', 'Спинной мозг'], ['cranial', 'Черепные нервы'], ['stem', 'Ствол мозга'], ['dien', 'Таламус и гипоталамус'],
    ['hemis', 'Полушария и базальные ганглии'], ['cortex', 'Кора больших полушарий'], ['hippo', 'Гиппокамп и память'], ['cereb', 'Мозжечок и двигательные навыки'],
    ['#', 'Химия'], ['brain', 'Системы медиаторов'],
    ['#', 'Органы чувств'], ['vision', 'Зрение'], ['ear', 'Слух и равновесие'], ['skin', 'Кожа и осязание'], ['chemo', 'Обоняние и вкус'],
  ] },
].map((s) => ({ ...s, scenes: s.scenes.filter(([sid]) => sid === '#' || BUILDERS[sid]) }));
const secOf = (id) => SECTIONS.find((s) => s.scenes.some(([sid]) => sid === id));
/* список всех тем под сценой (в разметке он статичный, по-русски, — для поисковиков); в другой языковой версии пересобираем его из переведённых названий */
{ const at = document.querySelector('.alltopics');
  if (at && LANG !== 'ru') {
    const ord = { bio: 0, cell: 1, body: 2, brain: 3 }, n = SECTIONS.reduce((k, s) => k + s.scenes.filter(([i]) => i !== '#').length, 0);
    at.querySelector('summary').textContent = 'Все темы атласа' + ' (' + n + ')';
    const g = at.querySelector('.atgrid'); g.innerHTML = '';
    [...SECTIONS].sort((a, b) => (ord[a.id] ?? 9) - (ord[b.id] ?? 9)).forEach((s) => {
      const sec = h('section', {}, h('h3', {}, s.name)); let ul = null;
      s.scenes.forEach(([i, nm]) => { if (i === '#') { sec.append(h('h4', {}, nm)); ul = null; return; } if (!ul) { ul = h('ul'); sec.append(ul); } ul.append(h('li', { 'data-id': i }, h('a', { href: PAGES ? pageUrl(i) : '#' + i }, nm))); });
      g.append(sec);
    });
  }
}
const firstOf = (s) => s.scenes.find(([sid]) => sid !== '#')[0];
const lastIn = {}, secNav = $('#sections'), subNav = $('#subtabs');
// вкладки стоят на шкале масштаба — «от молекулы до мысли»
const SCALE = { bio: ['10⁻⁹ м', 'молекулы, нанометры'], cell: ['10⁻⁵ м', 'клетки, микрометры'], body: ['1 м', 'органы и тело, метры'], brain: ['мысль', 'от нейрона до мысли'] };
const byScale = (s) => { const i = Object.keys(SCALE).indexOf(s.id); return i < 0 ? 99 : i; };
[...SECTIONS].sort((a, b) => byScale(a) - byScale(b)).forEach((s) => {
  const sc = SCALE[s.id];
  const first = lastIn[s.id] || firstOf(s);
  secNav.append(h('a', { class: 'tab', href: topicHref(first), 'data-sec': s.id, title: sc ? 'Масштаб: ' + sc[1] : null, onclick: (e) => navClick(e, () => lastIn[s.id] || firstOf(s)) },
    h('span', { class: 'tsc', 'aria-hidden': 'true' }, sc ? sc[0] : ''), h('span', { class: 'tdot', 'aria-hidden': 'true' }), h('span', { class: 'tn' }, s.name)));
});
/* разделы и темы — настоящие ссылки (открываются в новой вкладке, видны поисковикам); обычный клик — переход без перезагрузки */
function topicHref(id) { return PAGES ? pageUrl(id) : '#' + id; }
function navClick(e, idf) {
  if (e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  const id = idf(); if (!BUILDERS[id] || (NOGL && PAGES)) return;   // без 3D на сайте — обычный переход на страницу темы (её текст в HTML)
  e.preventDefault(); show(id);
}
function renderNav(id) {
  const s = secOf(id); lastIn[s.id] = id;
  secNav.querySelectorAll('.tab').forEach((b) => { const on = b.dataset.sec === s.id; if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    const sx = SECTIONS.find((x) => x.id === b.dataset.sec); if (sx) b.setAttribute('href', topicHref(lastIn[sx.id] || firstOf(sx))); });
  const hadF = subNav.contains(document.activeElement);
  const st = subNav.scrollTop; subNav.innerHTML = '';
  s.scenes.forEach(([sid, name]) => subNav.append(sid === '#' ? h('h3', { class: 'subhead' }, name) : h('a', { class: 'sub', href: topicHref(sid), 'data-id': sid, 'aria-current': sid === id ? 'page' : null, onclick: (e) => navClick(e, () => sid) }, name)));
  // оглавление слева прокручивается само, чтобы текущая тема была видна
  subNav.scrollTop = st;
  const act = subNav.querySelector('.sub[aria-current="page"]');
  if (act && subNav.scrollHeight > subNav.clientHeight && (act.offsetTop < st || act.offsetTop + act.offsetHeight > st + subNav.clientHeight)) subNav.scrollTop = act.offsetTop - subNav.clientHeight / 3;
  // на телефоне вместо длинного ряда — выпадающий список с группами
  const sel = h('select', { class: 'subsel', 'aria-label': 'Тема раздела «' + s.name + '»', onchange: (e) => show(e.target.value) }); let og = sel;
  s.scenes.forEach(([sid, name]) => { if (sid === '#') { og = h('optgroup', { label: name }); sel.append(og); } else { const o = h('option', { value: sid, 'data-n': name }, name); if (sid === id) o.selected = true; og.append(o); } });
  subNav.append(sel);
  if (typeof decorateNav === 'function') decorateNav();
  if (hadF) { const a = subNav.querySelector('.sub[aria-current="page"]'); (a && a.offsetParent ? a : sel).focus({ preventScroll: true }); }
}
/* каждая вкладка — отдельный файл: грузится при первом открытии, старые сцены выгружаются */
const chunkP = {};
function loadBuilder(id) { const [file, fn] = BUILDERS[id]; return (chunkP[file] ||= import('./s/' + file + '.js')).then((m) => m[fn]); }
let building = null;
{ const ael = canvas.addEventListener.bind(canvas); canvas.addEventListener = (t, f, o) => { if (building) building.push([t, f, o]); ael(t, f, o); }; }
const loadEl = h('div', { class: 'loading', role: 'status', 'aria-live': 'polite' }); loadEl.hidden = true; stageEl.append(loadEl);
const KEEP = 2, recent = [];
let showSeq = 0;
function disposeScene(sc) {
  const mats = new Set(), geos = new Set(), texs = new Set();
  sc.scene.traverse((o) => { if (o.geometry) geos.add(o.geometry); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x)); });
  mats.forEach((m) => { Object.values(m).forEach((v) => { if (v && v.isTexture) texs.add(v); }); if (m.uniforms) Object.values(m.uniforms).forEach((u) => { if (u && u.value && u.value.isTexture) texs.add(u.value); }); });
  texs.delete(GLOW); texs.delete(envTex);
  geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); texs.forEach((t) => t.dispose());
  for (let i = GLASS.length - 1; i >= 0; i--) if (mats.has(GLASS[i])) GLASS.splice(i, 1);
  (sc.__listen || []).forEach(([t, f, o]) => canvas.removeEventListener(t, f, o));
  if (sc.controls.dispose) sc.controls.dispose();
}
function evict() {
  while (recent.length > KEEP) { const old = recent.shift(); const sc = built[old]; if (!sc || sc === cur) continue; delete built[old]; try { disposeScene(sc); } catch (e) { /* выгрузка не критична */ } }
}
function show(id) {
  if (NOGL) { noglShow(id); return; }
  const seq = ++showSeq;
  if (built[id]) { activate(id); return; }
  renderNav(id);
  const item = (secOf(id) || { scenes: [] }).scenes.find(([s]) => s === id);
  loadEl.textContent = 'Загружаю «' + (item ? item[1] : id) + '»…'; loadEl.hidden = false;
  loadBuilder(id).then((mk) => {
    if (seq !== showSeq) return;
    const L = []; building = L; buildingId = id; let sc;
    try { sc = mk(); } finally { building = null; buildingId = null; }
    sc.__listen = L; built[id] = sc; loadEl.hidden = true; activate(id);
  }).catch((e) => { if (seq !== showSeq) return; delete chunkP[BUILDERS[id][0]];
    loadEl.textContent = 'Не удалось загрузить раздел: ' + (e && e.message || e) + '. ' + (navigator.onLine === false ? 'Нет сети — эта тема ещё не сохранена для офлайна.' : 'Возможно, сайт обновился — обновите страницу.');
    loadEl.append(h('div', {}, button('Обновить', () => location.reload(), true))); console.error(e); });
}
/* без WebGL: только навигация и текст. На сайте у каждой темы своя страница с текстом в HTML — переход на неё обычный */
const STATIC_ID = (window.__PAGE && window.__PAGE.id) || 'skeleton';
let noglFirst = true;
function noglShow(id) {
  if (PAGES && !noglFirst && id !== curId) { location.href = pageUrl(id); return; }
  noglFirst = false; curId = id;
  renderNav(id);
  if (id !== STATIC_ID) {   // текст в HTML — от другой темы (офлайн-копия главной под адресом темы)
    const t = TOPIC[id];
    $('#kicker').textContent = t ? t.sec + (t.grp ? ' · ' + t.grp : '') : ''; $('#title').textContent = t ? t.name : id; $('#lede').textContent = TOPIC_LEDE[id] || '';
    notesEl.innerHTML = ''; document.title = pageTitle(t ? t.name : id);
  }
  ['#recam', '#anim'].forEach((q) => { const b = $(q); if (b) b.hidden = true; });
  consoleEl.style.display = 'none'; scopeEl.hidden = true;
  loadEl.hidden = true; refreshSeen();
  window.__ready = id;
}
function activate(id) {
  loadEl.hidden = true;
  const i = recent.indexOf(id); if (i >= 0) recent.splice(i, 1); recent.push(id);
  if (cur) cur.controls.enabled = false;
  cur = built[id]; curId = id; cur.controls.enabled = true;
  renderPass.scene = cur.scene; renderPass.camera = cur.camera;
  bloom.strength = 1.1 * LOOK.bloom;
  renderNav(id);
  $('#kicker').textContent = cur.kicker; $('#title').textContent = cur.title; $('#lede').textContent = cur.lede;
  consoleEl.innerHTML = ''; cur.ui(consoleEl);
  notesEl.innerHTML = cur.notes;
  labelsEl.innerHTML = ''; labelEls = cur.labels.map((l) => { const e = h('div', { class: 'lbl' }, l.text); if (l.color) e.style.color = l.color; labelsEl.append(e); return e; });
  scopeEl.hidden = !cur.drawScope;
  accentSet(cur.accent);
  try {
    if (PAGES) {   // адрес страницы темы; главная остаётся главной, пока человек не перешёл на другую тему
      const u = pageUrl(id), root = isRootUrl();
      if (!fromPop && (!location.pathname.endsWith('/' + u) || location.hash) && !(root && !location.hash && !navigated)) (navigated ? history.pushState : history.replaceState).call(history, { id }, '', u + (REC ? '?rec' : ''));
      navigated = true;
    } else if (location.hash.slice(1) !== id) (location.hash ? history.pushState : history.replaceState).call(history, null, '', '#' + id);
  } catch (e) { /* ignore */ }
  fromPop = false;
  layout();
  evict();
  uxActivate(id);
  modelUi();
  animSync(true);
  window.__ready = id;
}
/* кнопка «Назад» (в том числе на Android) возвращает к предыдущей теме */
window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (BUILDERS[id] && id !== curId) show(id); });
// «Назад»/«Вперёд»: тема берётся из адреса, сам адрес не трогаем (на главной — стартовая тема)
window.addEventListener('popstate', () => { const id = idFromUrl() || 'skeleton'; if (id === curId) return; fromPop = true; show(id); });
window.addEventListener('keydown', (e) => {
  if (!cur || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target instanceof Element ? e.target : document.body;
  if (t.closest('input, textarea, dialog[open]')) return;
  // пробел и Enter на кнопке, выбранной с клавиатуры, нажимают её, а не уходят сцене
  if ((e.key === ' ' || e.key === 'Enter') && t.closest('button, a, summary, select, [role=tab]') && t.matches(':focus-visible')) return;
  if (cur.onKey(e)) { e.preventDefault(); animResume(); }
});

/* ---------- навигация: поиск по темам, прогресс изучения, «поделиться», сброс камеры ---------- */
const BRAND = 'Кто мы?', TITLE_TAIL = ' — ' + 'Кто мы? 3D-атлас человека';
const pageTitle = (t) => ((t + TITLE_TAIL).length > 60 ? t + ' — ' + BRAND : t + TITLE_TAIL);   // как в tools/build.py: заголовок не длиннее 60 знаков
const HEAD_SEL = [['link[rel="canonical"]', 'href'], ['link[hreflang="ru"]', 'href'], ['link[hreflang="en"]', 'href'], ['link[hreflang="x-default"]', 'href'], ['meta[name="description"]', 'content'], ['meta[property="og:description"]', 'content'], ['meta[property="og:title"]', 'content'], ['meta[property="og:url"]', 'content']];
const HEAD0 = { title: document.title, v: HEAD_SEL.map(([q, a]) => { const e = document.head.querySelector(q); return e && e.getAttribute(a); }) };   // главная: вернуть при «Назад»
// бытовые слова, по которым ищут тему (в английской сборке строки заменяются английскими по словарю)
const TOPIC_ALIAS = {
  lungs: 'лёгкие легкие вдох выдох альвеолы бронхи', ear: 'ухо уши улитка вестибулярный аппарат', vision: 'глаз глаза сетчатка хрусталик',
  heart: 'ЭКГ пульс давление клапаны сосуды', skeleton: 'кости мышцы артерии вены пульс', kidney: 'почка моча нефрон',
  digest: 'желудок кишечник кишка пищевод', diabetes: 'сахар глюкоза', glycogen: 'глюкоза', blood: 'эритроциты лейкоциты тромбоциты',
  immune: 'иммунитет антитела лимфоциты лимфоузлы', cell: 'органоиды митохондрии ядро', cortex: 'мышление речь',
  synapse: 'нейромедиаторы дофамин серотонин', brain: 'дофамин серотонин норадреналин ацетилхолин', skin: 'прикосновение боль температура',
  chemo: 'нос запах язык', repro: 'беременность эмбрион плод сперматозоид яйцеклетка', menses: 'месячные овуляция', endo: 'гормоны железы',
  dna: 'гены хромосомы', radicals: 'кислород окисление', eicosanoids: 'аспирин ибупрофен воспаление', lipoprot: 'атеросклероз ЛПНП',
  referred: 'инфаркт аппендицит', spinal: 'рефлекс', cereb: 'координация равновесие', joints: 'сустав колено', chest: 'рёбра грудная железа',
  etc: 'митохондрии кислород', develop: 'эмбрион нервная трубка',
};
const YO = new RegExp(String.fromCharCode(1105), 'g'), YE = String.fromCharCode(1077);   // ё → е (без однобуквенных строк: их не переводят)
const normT = (t) => String(t).toLowerCase().replace(YO, YE);
const TOPICS = [];
{ const have = new Set();
  [...SECTIONS].sort((a, b) => byScale(a) - byScale(b)).forEach((s) => { let g = '';
    s.scenes.forEach(([sid, nm]) => { if (sid === '#') { g = nm; return; } if (have.has(sid)) return; have.add(sid);
      const lede = TOPIC_LEDE[sid] || '';
      TOPICS.push({ id: sid, name: nm, grp: g, sec: s.name, lede, nN: normT(nm), nG: normT(g + ' ' + s.name), nA: normT(TOPIC_ALIAS[sid] || ''), nL: normT(lede) }); }); }); }
const TOPIC = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
const LETTER = /[\p{L}\d]/u, CYR = new RegExp('[' + String.fromCharCode(1072) + '-' + String.fromCharCode(1103) + ']');
const wordAt = (hay, v) => { let i = hay.indexOf(v); while (i >= 0) { if (i === 0 || !LETTER.test(hay[i - 1])) return i; i = hay.indexOf(v, i + 1); } return -1; };
// оценка: начало названия > слово в названии > бытовое слово > группа > подзаголовок; -1 — не подходит.
// Совпадение засчитывается только с начала слова. Русским словам прощаем окончание («сердца» найдёт «Сердце»).
function scoreTopic(t, toks) {
  let sum = 0;
  for (const k of toks) {
    let best = -1;
    const vars = [k]; if (CYR.test(k)) { if (k.length >= 5) vars.push(k.slice(0, -1)); if (k.length >= 6) vars.push(k.slice(0, -2)); }
    vars.forEach((v, j) => {
      const pen = j ? 0.6 : 1, n = wordAt(t.nN, v);
      let sc = n === 0 ? 8 : n > 0 ? 6 : wordAt(t.nA, v) >= 0 ? 5 : wordAt(t.nG, v) >= 0 ? 3 : wordAt(t.nL, v) >= 0 ? 1.5 : -1;
      if (sc > 0) best = Math.max(best, sc * pen);
    });
    if (best < 0) return -1;
    sum += best;
  }
  return sum;
}
const tokensOf = (q) => normT(q).split(/[\s,.;:!?«»"()]+/).filter(Boolean);
const srlive = $('#srlive'); let srT = 0;
const say = (msg, ms = 0) => { clearTimeout(srT); srT = setTimeout(() => { srlive.textContent = ''; setTimeout(() => { srlive.textContent = msg; }, 60); }, ms); };

/* прогресс: тема изучена, если сцену смотрели 10 секунд (вкладка активна, сцена на экране, человек уже что-то нажимал или крутил),
   нажали кнопку в её панели или, посмотрев сцену, дочитали до текста под ней */
const SEEN_KEY = 'seen-topics';
const readSeen = () => { try { return new Set((JSON.parse(localStorage.getItem(SEEN_KEY) || '[]') || []).filter((x) => TOPIC[x])); } catch (e) { return null; } };
let seen = readSeen() || new Set();
function markSeen(id) {
  if (!id || !TOPIC[id] || seen.has(id)) return;
  const s = readSeen() || seen; s.add(id); seen = s;   // другие вкладки тоже пишут — объединяем
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch (e) { /* без памяти браузера — прогресс только на эту вкладку */ }
  refreshSeen();
}
window.addEventListener('storage', (e) => { if (e.key === SEEN_KEY) { seen = readSeen() || new Set(); refreshSeen(); } });
const progText = (k, n) => 'Изучено: ' + k + ' из ' + n;
function decorateNav() {
  subNav.querySelectorAll('.sub[data-id]').forEach((b) => {
    const on = seen.has(b.dataset.id); b.classList.toggle('seen', on);
    const v = b.querySelector('.vh'); if (on && !v) b.append(h('span', { class: 'vh' }, ', изучено')); else if (!on && v) v.remove();
  });
  subNav.querySelectorAll('option[data-n]').forEach((o) => { o.textContent = (seen.has(o.value) ? '✓ ' : '') + o.dataset.n; });
  const s = curId && secOf(curId);
  if (s) { const ids = s.scenes.filter(([i]) => i !== '#').map(([i]) => i), k = ids.filter((i) => seen.has(i)).length;
    let p = subNav.querySelector('.subprog'); if (!p) { p = h('div', { class: 'subprog', 'aria-hidden': 'true' }); subNav.append(p); }
    p.textContent = k ? progText(k, ids.length) : ''; p.hidden = !k; }
}
function refreshSeen() {
  decorateNav();
  document.querySelectorAll('.alltopics li[data-id]').forEach((li) => {
    const on = seen.has(li.dataset.id); li.classList.toggle('seen', on);
    const a = li.querySelector('a'), v = a && a.querySelector('.vh'); if (a && on && !v) a.append(h('span', { class: 'vh' }, ', изучено')); else if (v && !on) v.remove();
  });
  if (atProg) atProg.textContent = progText(seen.size, TOPICS.length);
  if (atReset) { if (!seen.size && document.activeElement === atReset) atFilter.focus(); atReset.hidden = !seen.size; }
  if (fprog) fprog.textContent = progText(seen.size, TOPICS.length);
  secNav.querySelectorAll('.tab').forEach((b) => { const s = SECTIONS.find((x) => x.id === b.dataset.sec); if (!s) return;
    const ids = s.scenes.filter(([i]) => i !== '#').map(([i]) => i), sc = SCALE[s.id];
    b.title = (sc ? 'Масштаб: ' + sc[1] + '. ' : '') + progText(ids.filter((i) => seen.has(i)).length, ids.length); });
}
let dwellId = null, dwell = 0, engaged = false, stageVis = true;
['pointerdown', 'keydown', 'wheel'].forEach((t) => window.addEventListener(t, () => { engaged = true; }, { passive: true, capture: true }));
if ('IntersectionObserver' in window) new IntersectionObserver((es) => { stageVis = es[es.length - 1].intersectionRatio >= 0.3; }, { threshold: [0, 0.3, 0.6] }).observe(stageEl);
setInterval(() => {
  if (document.hidden || !dwellId || dwellId !== curId || !stageVis || finder.open || !engaged || !document.hasFocus()) return;
  if (++dwell >= 10) markSeen(dwellId);
}, 1000);
consoleEl.addEventListener('click', (e) => { if (e.target.closest('button, input, select, label')) markSeen(curId); });
// дочитал до текста: считается, только если перед этим хотя бы 3 секунды смотрел саму сцену
{ let sT = 0; window.addEventListener('scroll', () => { if (sT) return; sT = setTimeout(() => { sT = 0; if (dwell >= 3 && notesEl.getBoundingClientRect().top < innerHeight * 0.55) markSeen(curId); }, 300); }, { passive: true }); }

/* список «Все темы атласа»: фильтр, счётчик, сброс прогресса; клик по теме — к сцене */
let atProg = null, atReset = null, atFilter = null;
{ const at = document.querySelector('.alltopics');
  if (at) {
    const g = at.querySelector('.atgrid');
    atFilter = h('input', { class: 'atfilter', type: 'search', placeholder: 'Фильтр тем…', 'aria-label': 'Фильтр тем', autocomplete: 'off', spellcheck: 'false' });
    atProg = h('span', { class: 'atprog' });
    atReset = h('button', { class: 'atreset', type: 'button' }, 'Сбросить прогресс');
    const none = h('p', { class: 'atnone', hidden: '' }, 'Ничего не нашлось. Попробуйте другое слово.');
    at.querySelector('summary').after(h('div', { class: 'atbar' }, atFilter, atProg, atReset));
    g.after(none);
    let armed = 0;
    atReset.addEventListener('click', () => {
      if (Date.now() - armed > 3000) { armed = Date.now(); atReset.textContent = 'Точно сбросить? Нажмите ещё раз'; say('Точно сбросить? Нажмите ещё раз'); setTimeout(() => { atReset.textContent = 'Сбросить прогресс'; }, 3000); return; }
      armed = 0; seen = new Set(); dwell = 0;
      try { localStorage.setItem(SEEN_KEY, '[]'); } catch (e) { /* без памяти */ }
      atReset.textContent = 'Сбросить прогресс'; refreshSeen(); toast('Прогресс сброшен');
    });
    atFilter.addEventListener('input', () => {
      const toks = tokensOf(atFilter.value); let n = 0;
      g.querySelectorAll('section').forEach((sec) => {
        let secAny = false;
        sec.querySelectorAll('ul').forEach((ul) => {
          let ulAny = false;
          ul.querySelectorAll('li[data-id]').forEach((li) => { const t = TOPIC[li.dataset.id]; const ok = !toks.length || (t && scoreTopic(t, toks) >= 0); li.hidden = !ok; if (ok) { ulAny = true; n++; } });
          ul.hidden = !ulAny; const hd = ul.previousElementSibling; if (hd && hd.tagName === 'H4') hd.hidden = !ulAny; secAny ||= ulAny;
        });
        sec.hidden = !secAny;
      });
      none.hidden = n > 0;
      say(toks.length ? (n ? 'Найдено тем: ' + n : 'Ничего не нашлось. Попробуйте другое слово.') : '', 500);
    });
    g.addEventListener('click', (e) => { const li = e.target.closest('a') && e.target.closest('li[data-id]'); if (!li || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return; const id = li.dataset.id; if (!BUILDERS[id]) return; e.preventDefault(); fgo(id); });
  }
}

/* всплывающее уведомление (role="status" — его зачитывают экранные дикторы; область всегда на странице) */
const gtoast = $('#gtoast'); let gtT = 0;
function toast(msg, ms = 2400) { clearTimeout(gtT); gtoast.textContent = ''; setTimeout(() => { gtoast.textContent = msg; }, 60); gtT = setTimeout(() => { gtoast.textContent = ''; }, ms); }

/* поиск: кнопка в шапке, клавиши «/» и Ctrl+K */
const finder = $('#finder'), fq = $('#fq'), fres = $('#fres'), fprog = $('#fprog');
let fopts = [], fact = -1;
function fsetAct(i, scroll) {
  if (fact >= 0 && fopts[fact]) fopts[fact].setAttribute('aria-selected', 'false');
  fact = i;
  if (i >= 0 && fopts[i]) { fopts[i].setAttribute('aria-selected', 'true'); fq.setAttribute('aria-activedescendant', fopts[i].id); if (scroll) fopts[i].scrollIntoView({ block: 'nearest' }); }
  else fq.removeAttribute('aria-activedescendant');
}
function hiName(name, toks) {   // подсветка найденного в названии (с начала слова)
  const n = normT(name); let best = null;
  toks.forEach((k) => { [k, k.slice(0, -1), k.slice(0, -2)].filter((v, j) => !j || (CYR.test(k) && v.length >= 4)).some((v) => { const i = wordAt(n, v); if (i >= 0 && (!best || v.length > best[1])) { best = [i, v.length]; return true; } return false; }); });
  if (!best) return [name];
  return [name.slice(0, best[0]), h('mark', {}, name.slice(best[0], best[0] + best[1])), name.slice(best[0] + best[1])];
}
function frender() {
  const toks = tokensOf(fq.value); fres.innerHTML = ''; fopts = []; fact = -1;
  const add = (t, meta) => {
    const on = seen.has(t.id);
    const li = h('li', { role: 'option', id: 'fo-' + t.id, 'aria-selected': 'false', class: on ? 'seen' : '' },
      h('span', { class: 'fn' }, ...hiName(t.name, toks), on ? h('span', { class: 'vh' }, ', изучено') : ''), h('span', { class: 'fm' }, meta));
    const k = fopts.length;
    li.addEventListener('click', () => fgo(t.id)); li.addEventListener('pointermove', () => { if (fact !== k) fsetAct(k, false); });
    fopts.push(li); fres.append(li);
  };
  if (!toks.length) {
    let last = null;
    TOPICS.forEach((t) => { if (t.sec !== last) { last = t.sec; fres.append(h('li', { class: 'fh', role: 'presentation', 'aria-hidden': 'true' }, t.sec)); } add(t, t.grp || t.sec); });
    fsetAct(TOPICS.findIndex((t) => t.id === curId), true);
  } else {
    const r = TOPICS.map((t) => [scoreTopic(t, toks), t]).filter(([sc]) => sc >= 0).sort((a, b) => b[0] - a[0]);
    if (!r.length) fres.append(h('li', { class: 'fempty', role: 'presentation' }, 'Ничего не нашлось. Попробуйте другое слово.'));
    r.forEach(([sc, t]) => add(t, sc >= 3 * toks.length || !t.lede ? t.sec + (t.grp ? ' · ' + t.grp : '') : t.lede));
    fsetAct(r.length ? 0 : -1, true);
    say(r.length ? 'Найдено тем: ' + r.length : 'Ничего не нашлось. Попробуйте другое слово.', 500);
  }
}
const fitFinder = () => { if (window.visualViewport && finder.open) finder.style.maxHeight = Math.max(240, visualViewport.height - 24) + 'px'; };
if (window.visualViewport) visualViewport.addEventListener('resize', fitFinder);
function fopen() {
  if (finder.open) return;
  const dl = $('#donatebox'); if (dl && dl.open) return;
  fq.value = ''; fprog.textContent = progText(seen.size, TOPICS.length);
  if (finder.showModal) finder.showModal(); else finder.setAttribute('open', '');
  fitFinder(); frender(); fq.focus();
}
function fgo(id) {
  const wasOpen = finder.open; if (wasOpen) finder.close();
  if (id !== curId) show(id);
  const r = stageEl.getBoundingClientRect(); if (r.top < -r.height / 3 || r.top > innerHeight * 0.6) stageEl.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  const tt = $('#title'); tt.tabIndex = -1; tt.focus({ preventScroll: true });
  say('Открыта тема: ' + TOPIC[id].name, 400);
}
fq.addEventListener('input', frender);
fq.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (fopts.length) fsetAct((fact + (e.key === 'ArrowDown' ? 1 : -1) + fopts.length) % fopts.length, true); }
  else if (e.key === 'Enter') { e.preventDefault(); if (fopts[fact]) fgo(fopts[fact].id.slice(3)); }
});
// Esc закрывает поиск с любого места диалога (и не стирает сначала текст поля)
finder.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finder.close(); } });
finder.addEventListener('click', (e) => { if (e.target === finder) finder.close(); });
$('#srch').addEventListener('click', fopen);

/* «Поделиться»: на телефоне — системное меню, на компьютере — ссылка в буфер обмена */
function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt).catch(() => copyOld(txt));
  return copyOld(txt);
}
function copyOld(txt) {
  const ta = h('textarea', { readonly: '', style: 'position:fixed;top:0;left:0;opacity:0' }); ta.value = txt; document.body.append(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) { /* нет доступа */ }
  ta.remove(); return ok ? Promise.resolve() : Promise.reject(new Error('copy'));
}
$('#share').addEventListener('click', async () => {
  if (!curId) return;
  const url = PAGES ? new URL(pageUrl(curId), location.href).href : location.origin + location.pathname + '?lang=' + LANG + '#' + curId, title = $('#title').textContent + ' — ' + BRAND;
  if (navigator.share && matchMedia('(pointer:coarse)').matches) { try { await navigator.share({ title, text: $('#lede').textContent, url }); } catch (e) { /* пользователь передумал */ } return; }
  copyText(url).then(() => toast('Ссылка на тему скопирована'), () => toast(url, 8000));
});

/* «Сбросить вид»: камера плавно возвращается туда, откуда тема начиналась (через 2 с после открытия, если её ещё не трогали) */
let camFly = null;
function uxActivate(id) {
  dwellId = id; dwell = 0;
  if (PAGES && isRootUrl()) { document.title = HEAD0.title; HEAD_SEL.forEach(([q, a], k) => { const e = document.head.querySelector(q); if (e && HEAD0.v[k] != null) e.setAttribute(a, HEAD0.v[k]); }); }   // главная сохраняет свой заголовок и описание
  else document.title = pageTitle(cur.title);
  if (PAGES && location.pathname.endsWith('/' + pageUrl(id))) {   // описание и адреса в <head> — под открытую тему (как в статических страницах)
    const abs = (l) => new URL(id === 'skeleton' ? (l === 'en' ? 'index.en.html' : './') : pageUrl(id, l), location.href).href, set = (sel, attr, v) => { const e = document.head.querySelector(sel); if (e) e.setAttribute(attr, v); };
    const desc = TOPIC_LEDE[id] || cur.lede || '';
    set('link[rel="canonical"]', 'href', abs(LANG)); set('link[hreflang="ru"]', 'href', abs('ru')); set('link[hreflang="en"]', 'href', abs('en')); set('link[hreflang="x-default"]', 'href', abs('ru'));
    set('meta[name="description"]', 'content', desc); set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:title"]', 'content', document.title); set('meta[property="og:url"]', 'content', abs(LANG));
  }
  const sc = cur;
  if (!sc.__home) {
    const snap = () => { sc.__home = { p: sc.camera.position.clone(), t: sc.controls.target.clone() }; };
    snap(); sc.controls.addEventListener('start', () => { sc.__touched = true; if (camFly && camFly.sc === sc) camFly = null; });
    setTimeout(() => { if (!sc.__touched) snap(); }, 2000);
  }
  refreshSeen();
}
function resetCam() {
  if (!cur || !cur.__home) return;
  camFly = { sc: cur, p0: cur.camera.position.clone(), t0: cur.controls.target.clone(), k: matchMedia('(prefers-reduced-motion:reduce)').matches ? 0.999 : 0 };
}
function camStep(dt) {
  if (!camFly) return;
  if (camFly.sc !== cur) { camFly = null; return; }
  camFly.k = Math.min(1, camFly.k + dt / 0.7); const e = 1 - Math.pow(1 - camFly.k, 3), hm = cur.__home;
  cur.camera.position.lerpVectors(camFly.p0, hm.p, e); cur.controls.target.lerpVectors(camFly.t0, hm.t, e);
  if (camFly.k >= 1) camFly = null;
}
$('#recam').addEventListener('click', resetCam);
// клавиши поиска работают раньше сцены (capture); в полях ввода текста — нет
window.addEventListener('keydown', (e) => {
  if (e.altKey || finder.open) return;
  const t = e.target instanceof Element ? e.target : document.body, typing = t.closest('input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=button]), textarea, [contenteditable]');
  const anyDlg = document.querySelector('dialog[open]');
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK' && !e.shiftKey) { if (!anyDlg) { e.preventDefault(); e.stopPropagation(); fopen(); } return; }
  if (typing || anyDlg || e.ctrlKey || e.metaKey) return;
  if (e.key === '/' || (e.code === 'Slash' && !e.shiftKey)) { e.preventDefault(); e.stopPropagation(); fopen(); return; }
  // Home — сброс камеры, только когда фокус не на элементе страницы и сцена видна (иначе Home листает страницу вверх)
  if (e.key === 'Home' && !e.shiftKey && (t === document.body || t === canvas || t === stageEl) && stageVis) { e.preventDefault(); e.stopPropagation(); resetCam(); }
}, true);
refreshSeen();

const tmp = new THREE.Vector3();
function updateLabels() {
  const w = stageEl.clientWidth, hgt = stageEl.clientHeight;
  // подписи не налезают друг на друга (на компьютере и на телефоне): налезающая сдвигается вверх/вниз на строку-две,
  // а если места нет — прячется. Сначала ставятся те, что были видны в прошлом кадре, — при вращении не мигают.
  const thin = REC ? rec.lh : mqMob.matches, lh = REC ? rec.lh : thin ? 12 : 15, items = [], placed = [];
  cur.labels.forEach((l, i) => {
    const el = labelEls[i]; if (!el) return;
    const vis = !l.show || l.show();
    tmp.copy(l.pos).project(cur.camera);
    if (!vis || tmp.z > 1 || Math.abs(tmp.x) > 1.1 || Math.abs(tmp.y) > 1.1) { if (el._on !== false) { el.style.opacity = '0'; el._on = false; } return; }
    if (el._wk !== thin || !el._w) { el._w = el.offsetWidth || 60; el._wk = thin; }   // ширина текста (шрифт на телефоне мельче)
    items.push({ el, x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * hgt, op: l.fade ? l.fade() : 1 });   // fade(): сцена может приглушить подпись (точка за телом)
  });
  items.sort((a, b) => b.op - a.op || (b.el._on ? 1 : 0) - (a.el._on ? 1 : 0));
  const sr = stageEl.getBoundingClientRect();
  [hudTtl, statsEl, scopeEl.hidden ? null : scopeEl, consoleEl.parentNode === stageEl ? consoleEl : null].forEach((e) => {
    if (!e || !e.offsetWidth) return; const r = e.getBoundingClientRect(); placed.push([r.left - sr.left - 4, r.top - sr.top - 2, r.right - sr.left + 4, r.bottom - sr.top + 2]);
  });
  const free = (r) => !placed.some((q) => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
  items.forEach(({ el, x, y, op }) => {
    const left = x + el._w > w - 6;   // не помещается справа — подпись слева от точки
    const x0 = left ? x + 2 - el._w : x - 4, x1 = left ? x + 4 : x - 2 + el._w;
    let dy = null;
    for (const d of [0, el._on ? el._dy || 0 : 0, -lh, lh, -2 * lh, 2 * lh]) { const r = [x0, y + d - lh / 2, x1, y + d + lh / 2]; if (free(r)) { dy = d; placed.push(r); break; } }
    if (dy === null) { if (el._on !== false) { el.style.opacity = '0'; el._on = false; } return; }
    el._on = true; el._dy = dy; el.style.opacity = String(op); el._x = x; el._y = y + dy; el._op = op;   // _x/_y/_op — для записи видео
    if (el._left !== left) { el.classList.toggle('l-left', left); el._left = left; }
    el.style.transform = left ? `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(calc(3px - 100%),-50%)` : `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(-3px,-50%)`;
  });
}
let lastStats = 0;
function updateStats(now) {
  if (now - lastStats < 150) return; lastStats = now;
  statsEl.innerHTML = '';
  cur.stats().forEach(([k, v, u]) => statsEl.append(h('div', { class: 'stat' }, h('i', {}, k), h('b', {}, String(v), u ? h('small', {}, u) : null))));
}

const clock = new THREE.Clock();
let visible = true;
document.addEventListener('visibilitychange', () => { visible = !document.hidden; clock.getDelta(); });
// сцена не рисуется, когда её не видно (прокрутили к тексту) или страницу закрывает окно (поиск, «Поддержать»): меньше нагрев и расход батареи
let onScreen = true;
if ('IntersectionObserver' in window) new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; clock.getDelta(); }).observe(stageEl);
/* пауза анимации: кнопка у заголовка темы. При «уменьшить движение» в системе сцена открывается на паузе;
   нажатие кнопки в её панели или клавиши сцены (человек сам запускает процесс) паузу снимает */
const animBtn = $('#anim'); let animUser = false;
function animSet(p) { ANIM.paused = p; animBtn.setAttribute('aria-pressed', String(p)); }
function animSync() { if (!animUser) animSet(RMOTION.matches); }
function animResume() { if (ANIM.paused && !animUser) animSet(false); }
animBtn.addEventListener('click', () => { animUser = true; animSet(!ANIM.paused); say(ANIM.paused ? 'Анимация на паузе' : 'Анимация идёт'); });
consoleEl.addEventListener('click', (e) => { if (e.target.closest('button, input, select, label')) animResume(); });
if (RMOTION.addEventListener) RMOTION.addEventListener('change', animSync);

/* прогресс загрузки 3D-модели и «Повторить» (fetchModel); показывается в окне той темы, которая модель запросила */
const MODEL_ST = {};
const mloadEl = h('div', { class: 'loading mload' }); mloadEl.hidden = true; stageEl.append(mloadEl);
const fmtMB = (b) => { const s = (b / 1048576).toFixed(1); return (LANG === 'ru' ? s.replace('.', ',') : s) + ' МБ'; };
function modelUi(name, owner, st) {
  if (name) { if (st) MODEL_ST[name] = { owner, ...st }; else delete MODEL_ST[name]; }
  const k = Object.keys(MODEL_ST).find((n) => MODEL_ST[n].owner === curId), m = k && MODEL_ST[k];
  if (!m) { mloadEl.hidden = true; mloadEl.dataset.k = ''; return; }
  mloadEl.hidden = false;
  if (m.err) {
    if (mloadEl.dataset.k === 'err' + k) return;
    mloadEl.dataset.k = 'err' + k; const msg = 'Не удалось загрузить 3D-модель (' + m.err + ').';
    mloadEl.textContent = msg; mloadEl.append(h('div', {}, button('Повторить', () => m.retry(), true))); say(msg);
    return;
  }
  const txt = 'Загружаю 3D-модель: ' + (m.total ? Math.min(99, Math.floor(m.got / m.total * 100)) + ' % из ' + fmtMB(m.total) : fmtMB(m.got));
  if (mloadEl.dataset.k !== txt) { mloadEl.dataset.k = txt; mloadEl.textContent = txt; }
}

/* потеря WebGL-контекста (телефон освободил видеопамять): не чернеть навсегда — дождаться восстановления, карту окружения сделать заново */
let ctxLost = false;
if (renderer) {
  const lostEl = h('div', { class: 'fallback', role: 'status', hidden: '' }, h('p', {}, '3D-графика временно отключилась: браузер освободил видеопамять. Восстанавливаю…'), button('Обновить страницу', () => location.reload(), true));
  stageEl.append(lostEl);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); ctxLost = true; lostEl.hidden = false; });
  canvas.addEventListener('webglcontextrestored', () => {
    const old = envTex; envTex = makeEnv();
    Object.values(built).forEach((sc) => { if (sc.scene.environment === old) sc.scene.environment = envTex;
      sc.scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { if (m.envMap === old) { m.envMap = envTex; m.needsUpdate = true; } }); }); });
    if (old) old.dispose();
    ctxLost = false; lostEl.hidden = true; clock.getDelta(); layout();
  });
}

function frame(now) {
  requestAnimationFrame(frame);
  if (!visible || !cur || !onScreen || ctxLost || document.querySelector('dialog[open]')) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  ANIM.dt = dt;
  cur.update(ANIM.paused ? 0 : dt);
  camStep(dt);
  if (REC) recStep(dt);
  cur.controls.update(dt);
  composer.render();
  updateLabels();
  if (REC) recDraw();
  if (cur.drawScope) cur.drawScope(sctx, scopeEl.clientWidth, scopeEl.clientHeight);
  updateStats(now);
}
applyLook();
/* приложение для телефона (PWA): работает только на собственном сайте, где подключён manifest */
{
  const inst = $('#inst'); let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; inst.hidden = false; });
  inst.addEventListener('click', () => { if (!deferred) return; deferred.prompt(); deferred.userChoice.finally(() => { deferred = null; inst.hidden = true; }); });
  window.addEventListener('appinstalled', () => { inst.hidden = true; });
  if ('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]')) {
    // новая версия сайта ставится в фоне и ждёт: плашка «Доступно обновление», перезагрузка — только по нажатию
    let upAsked = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (upAsked) { upAsked = false; location.reload(); } });
    const offerUpdate = (w) => {
      if (!w || document.querySelector('.upd')) return;
      const bar = h('div', { class: 'upd', role: 'status' }, h('span', {}, 'Доступно обновление атласа'),
        h('button', { class: 'btn primary', type: 'button', onclick: () => { upAsked = true; w.postMessage('skipWaiting'); setTimeout(() => { if (upAsked) location.reload(); }, 4000); } }, 'Обновить'),
        h('button', { class: 'x', type: 'button', 'aria-label': 'Позже', title: 'Позже', onclick: () => bar.remove() }, '✕'));
      document.body.append(bar);
    };
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const watch = (w) => { if (w) w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(w); }); };
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      watch(reg.installing); reg.addEventListener('updatefound', () => watch(reg.installing));
      /* «Сохранить для офлайна»: обе языковые версии, three.js, все темы, 3D-модели и декодер — по списку сборки (offline.json, с размерами);
         прогресс — по байтам, файл считается сохранённым, только когда он лёг в кэш */
      if (!window.caches) return;
      const OFF = new URL(LANG === 'ru' ? './offline.json' : '../offline.json', import.meta.url), ROOT = new URL('../', OFF), FLAG = new URL('offline-flag', ROOT).href;
      let plan = null;
      const getPlan = () => (plan ||= fetch(OFF).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).catch((e) => { plan = null; throw e; }));
      const btn = h('button', { class: 'pill ghost', type: 'button', title: 'Скачать все темы (на русском и английском) и 3D-модели, чтобы атлас работал без интернета' }, 'Сохранить для офлайна');
      const label = (p) => 'Сохранить для офлайна (≈ ' + fmtMB(p.files.reduce((a, f) => a + f[1], 0)).replace(/[.,]\d /, ' ') + ')';
      Promise.all([getPlan(), caches.open('chv-meta').then((c) => c.match(FLAG)).then((r) => r && r.text())]).then(([p, fl]) => { btn.textContent = fl === p.cache ? 'Сохранено для офлайна ✓' : label(p); }).catch(() => { /* подпись без объёма */ });
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          const p = await getPlan(), need = p.files.reduce((a, f) => a + f[1], 0) || 1;
          try { if (navigator.storage && navigator.storage.estimate) { const est = await navigator.storage.estimate(); if (est.quota && est.quota - (est.usage || 0) < need * 1.1) { btn.textContent = 'Не хватает места на устройстве'; btn.disabled = false; return; } } } catch (e) { /* оценки нет — пробуем */ }
          try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { /* не критично */ }
          const cApp = await caches.open(p.cache), cMod = await caches.open(p.models);
          let done = 0, bad = 0;
          const step = () => { btn.textContent = 'Сохраняю… ' + Math.floor(done / need * 100) + ' %'; };
          const one = async ([path, size]) => {
            const u = new URL(path, ROOT).href, c = path.startsWith('models/') ? cMod : cApp;
            if (!(await c.match(u))) {
              let ok = false;
              for (let k = 0; k < 2 && !ok; k++) { try { const r = await fetch(u, { cache: 'no-cache' }); if (!r.ok) throw new Error('HTTP ' + r.status); await c.put(u, r); ok = true; } catch (e) { /* ещё попытка */ } }
              if (!ok) { bad++; return; }
            }
            done += size; step();
          };
          step();
          const q = [...p.files];
          await Promise.all([0, 1, 2, 3].map(async () => { while (q.length) await one(q.shift()); }));   // по 4 файла одновременно
          if (!bad) await (await caches.open('chv-meta')).put(FLAG, new Response(p.cache));   // новая версия сайта докачает всё сама (sw.js)
          btn.textContent = bad ? 'Сохранено не всё (' + bad + ') — повторить' : 'Сохранено для офлайна ✓';
        } catch (e) { btn.textContent = 'Не удалось сохранить — повторить'; }
        btn.disabled = false;
      });
      $('#knobs').append(btn); $('#cfg').hidden = false;
    }).catch(() => { /* без офлайна */ });
  }
}
/* ---------- режим съёмки роликов (?rec) ----------
   кадр 9:16 во всю высоту окна (рисуется в 1080×1920), без заголовков и пульта; подписи крупнее; камера плавно облетает сцену.
   «Записать» сохраняет ролик прямо из страницы — вместе с подписями; можно и снимать экран, захватив только кадр. */
const rec = { orbit: true, speed: 1, spd: 0, dolly: 0, fs: 0.018, px: 16, lh: 22, mark: true, mr: null, t0: 0, tt: 0, ctx: null, font: 'sans-serif', sc: null, cf: null, cw: 0 };
const RT = LANG === 'en'
  ? { title: 'Recording mode', hint: 'The frame on the left is 9:16 and renders at 1080×1920. Record it with the button below (labels included), or screen-capture just that area.', topic: 'Topic', cam: 'Camera', orbit: 'Orbit', sec: 's per turn', move: 'Move', in: 'Zoom in', stop: 'Hold', out: 'Zoom out', center: 'Center', home: 'Reset view', labels: 'Label size', frame: 'Frame', mark: 'Atlas caption', safe: 'Instagram safe zones', record: 'Recording', start: '● Record', stopRec: '■ Stop', saved: 'Saved: ', noRec: 'This browser cannot record video here — use screen capture.', scene: 'Scene controls', exit: 'Exit recording mode', brand: 'Who are we? · 3D human atlas' }
  : { title: 'Режим съёмки', hint: 'Кадр слева — 9:16, рисуется в 1080×1920. Запишите его кнопкой ниже (вместе с подписями) или снимайте с экрана только эту область.', topic: 'Тема', cam: 'Камера', orbit: 'Облёт', sec: 'с на оборот', move: 'Движение', in: 'Наезд', stop: 'Стоп', out: 'Отъезд', center: 'По центру', home: 'Исходный ракурс', labels: 'Размер подписей', frame: 'Кадр', mark: 'Надпись атласа', safe: 'Безопасные зоны Instagram', record: 'Запись', start: '● Записать', stopRec: '■ Стоп', saved: 'Сохранено: ', noRec: 'Этот браузер не умеет записывать видео — снимайте экран.', scene: 'Пульт темы', exit: 'Выйти из режима съёмки', brand: 'Кто мы? · 3D-атлас человека' };
let recPick = null, recMark = null, recBtn = null, recOut = null;
// подписи — доля высоты кадра: в ролике на телефоне читаются так же, как в превью
function recFit(hgt) { rec.px = Math.round(rec.fs * hgt); rec.lh = Math.round(rec.px * 1.35); stageEl.style.setProperty('--rec-fs', rec.px + 'px'); }
const recOff = new THREE.Vector3();
/* камера — на центр объекта: на компьютере цель сдвинута, чтобы объект не прятался под заголовком, а в кадре съёмки заголовка нет.
   Центр — медиана центров видимых объектов (большая оболочка или фон не перетягивают); камера переезжает вместе с целью за 0,8 с,
   ракурс и расстояние те же */
function recCenter() {
  const xs = [], ys = [], zs = [], v = new THREE.Vector3();
  cur.scene.updateMatrixWorld();
  cur.scene.traverseVisible((o) => {
    if (!(o.isMesh || o.isPoints) || !o.geometry) return;
    const src = o.isInstancedMesh ? o : o.geometry; if (!src.boundingSphere) src.computeBoundingSphere();
    const s = src.boundingSphere; if (!s || !Number.isFinite(s.radius)) return;
    v.copy(s.center).applyMatrix4(o.matrixWorld); xs.push(v.x); ys.push(v.y); zs.push(v.z);
  });
  if (!xs.length) return;
  const med = (a) => a.sort((p, q) => p - q)[a.length >> 1], to = V3(med(xs), med(ys), med(zs));
  rec.cf = { sc: cur, t0: cur.controls.target.clone(), p0: cur.camera.position.clone(), to, k: 0 };
}
function recStep(dt) {
  const c = cur.controls;
  if (recPick && recPick.value !== curId) recPick.value = curId;
  // новая тема — сразу в центр и ещё раз через 2 с: 3D-модели (скелет, органы) догружаются не сразу
  if (rec.sc !== cur) { rec.sc = cur; rec.cw = 2; recCenter(); }
  if (rec.cw > 0 && (rec.cw -= dt) <= 0) recCenter();
  if (rec.cf && rec.cf.sc === cur && !camFly) {
    const f = rec.cf; f.k = Math.min(1, f.k + dt / 0.8); const e = 1 - Math.pow(1 - f.k, 3);
    c.target.lerpVectors(f.t0, f.to, e); recOff.subVectors(c.target, f.t0); cur.camera.position.copy(f.p0).add(recOff);
    if (f.k >= 1) rec.cf = null;
  }
  // облёт разгоняется и тормозит плавно, без рывка; пока камеру тянут мышью, OrbitControls его сами приостанавливают
  rec.spd += ((rec.orbit ? rec.speed : 0) - rec.spd) * Math.min(1, dt * 1.5);
  c.autoRotate = Math.abs(rec.spd) > 0.002; c.autoRotateSpeed = rec.spd;
  // наезд / отъезд: расстояние до цели меняется на ~6% в секунду
  if (rec.dolly && !camFly) {
    recOff.copy(cur.camera.position).sub(c.target);
    const d = recOff.length(), nd = clamp(d * Math.exp(rec.dolly * 0.06 * dt), Math.max(c.minDistance, 0.01), c.maxDistance);
    if (d > 0) cur.camera.position.copy(c.target).addScaledVector(recOff, nd / d);
  }
}
/* кадр ролика: 3D-сцена + осциллограф + подписи + надпись атласа на холсте 1080×1920 */
function recDraw() {
  if (!rec.mr) return;
  const g = rec.ctx, W = g.canvas.width, H = g.canvas.height, k = W / stageEl.clientWidth, fs = rec.px * k;
  g.drawImage(canvas, 0, 0, W, H);
  if (!scopeEl.hidden) { const sr = stageEl.getBoundingClientRect(), r = scopeEl.getBoundingClientRect(); g.drawImage(scopeEl, (r.left - sr.left) * k, (r.top - sr.top) * k, r.width * k, r.height * k); }
  g.save(); g.textBaseline = 'middle'; g.shadowColor = '#000'; g.shadowBlur = fs * 0.5; g.font = `500 ${fs}px ${rec.font}`;
  labelEls.forEach((el) => {
    if (!el._on || !el._op) return;
    const y = el._y * k, r = fs * 0.2;   // как в разметке: точка .4em, отступ .45em
    g.globalAlpha = el._op; g.fillStyle = el.style.color || '#E2DCE0';
    if (el._left) { const x = (el._x + 3) * k; g.textAlign = 'right'; g.beginPath(); g.arc(x - r, y, r, 0, Math.PI * 2); g.fill(); g.fillText(el.textContent, x - fs * 0.85, y); g.textAlign = 'left'; return; }   // подпись слева от точки
    const x = (el._x - 3) * k;
    g.beginPath(); g.arc(x + r, y, r, 0, Math.PI * 2); g.fill();
    g.fillText(el.textContent, x + fs * 0.85, y);
  });
  if (rec.mark) { g.globalAlpha = 0.72; g.fillStyle = '#fff'; g.textBaseline = 'top'; g.font = `600 ${H * 0.019}px ${rec.font}`; g.fillText(RT.brand, W * 0.06, H * 0.125); }
  g.restore();
  const now = performance.now();
  if (now - rec.tt > 250) { rec.tt = now; const s = Math.floor((now - rec.t0) / 1000); recBtn.textContent = `${RT.stopRec} ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
}
function recToggle() {
  if (rec.mr) { rec.mr.stop(); return; }
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920; rec.ctx = cv.getContext('2d');
  const type = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((t) => MediaRecorder.isTypeSupported(t));
  let mr;
  try { mr = new MediaRecorder(cv.captureStream(60), type ? { mimeType: type, videoBitsPerSecond: 16e6 } : { videoBitsPerSecond: 16e6 }); } catch (e) { recOut.textContent = RT.noRec; return; }
  const parts = [];
  mr.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
  mr.onstop = () => {
    rec.mr = null; recBtn.textContent = RT.start;
    const ext = /mp4/.test(mr.mimeType) ? 'mp4' : 'webm', name = `kto-my-${curId}-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.${ext}`;
    const a = h('a', { href: URL.createObjectURL(new Blob(parts, { type: mr.mimeType })), download: name });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    recOut.textContent = RT.saved + name;
  };
  mr.start(1000); rec.mr = mr; rec.t0 = performance.now(); recOut.textContent = '';
}
if (REC) {
  document.body.classList.add('rec');
  document.head.append(h('style', {}, `
body.rec{overflow:hidden}
body.rec *{visibility:hidden}
body.rec #stage,body.rec #stage *,body.rec #recside,body.rec #recside *{visibility:visible}
body.rec #stage .hud,body.rec #stage [hidden]{display:none}
body.rec #stage{position:fixed;left:0;top:0;width:calc(100vh*9/16);height:100vh;min-height:0;max-height:none;border-radius:0;box-shadow:none;z-index:60}
#recside{position:fixed;left:calc(100vh*9/16);right:0;top:0;bottom:0;overflow-y:auto;padding:18px 22px 40px;background:var(--bg);border-left:1px solid var(--line);z-index:60}
#recside h2{font:600 22px/1.2 var(--f-serif);margin:0 0 6px}
#recside h3{font:600 15px/1.2 var(--f-body);margin:22px 0 0}
#recside .recnote{color:var(--mute);font-size:13px;margin:0;max-width:60ch}
#recside > .btn{margin-top:18px}
body.rec .console{position:static;margin-top:12px;display:flex;flex-wrap:wrap;gap:14px 20px;background:var(--panel-solid);backdrop-filter:none;-webkit-backdrop-filter:none;border:1px solid var(--line);border-radius:14px;padding:14px 16px}
.recsel{font:500 14px var(--f-body);color:var(--fg);background:var(--panel-solid);border:1px solid var(--line-2);border-radius:9px;padding:7px 10px;max-width:100%}
body.rec .lbl{font-size:var(--rec-fs);gap:.45em}
body.rec .lbl::before{width:.4em;height:.4em}
#recmark{position:absolute;left:6%;top:12.5%;font:600 calc(100vh*.019)/1 var(--f-body);color:#fff;opacity:.72;text-shadow:0 1px 6px #000;pointer-events:none;white-space:nowrap}
#recsafe{position:absolute;inset:0;pointer-events:none}
#recsafe i{position:absolute;background:rgba(255,70,70,.14);border:1px dashed rgba(255,130,130,.55)}`));
  recMark = h('div', { id: 'recmark' }, RT.brand);
  // поверх кадра (в ролик не попадает): сверху и снизу Instagram кладёт свои надписи, справа — кнопки
  const safe = h('div', { id: 'recsafe', hidden: true }, h('i', { style: 'left:0;right:0;top:0;height:11%' }), h('i', { style: 'left:0;right:0;bottom:0;height:21%' }), h('i', { style: 'right:0;width:14%;top:50%;bottom:21%' }));
  stageEl.append(recMark, safe);
  recPick = h('select', { class: 'recsel', 'aria-label': RT.topic, onchange: (e) => show(e.target.value) },
    SECTIONS.map((s) => h('optgroup', { label: s.name }, s.scenes.filter(([id]) => id !== '#').map(([id, name]) => h('option', { value: id }, name)))));
  recBtn = button(RT.start, recToggle, true); recOut = h('div', { class: 'recnote', role: 'status' });
  if (!('MediaRecorder' in window) || !HTMLCanvasElement.prototype.captureStream) { recBtn.disabled = true; recOut.textContent = RT.noRec; }
  const dSeg = seg([{ id: -1, label: RT.in }, { id: 0, label: RT.stop }, { id: 1, label: RT.out }], () => rec.dolly, (v) => { rec.dolly = v; });
  const side = h('aside', { id: 'recside', 'aria-label': RT.title },
    h('h2', {}, RT.title), h('p', { class: 'recnote' }, RT.hint),
    h('div', { class: 'console' },
      group(RT.topic, null, recPick),
      group(RT.cam, null, toggle(RT.orbit, () => rec.orbit, (v) => { rec.orbit = v; }), range('recspd', 0.2, 3, 0.1, () => rec.speed, (v) => { rec.speed = v; }, (v) => Math.round(60 / v) + ' ' + RT.sec)),
      group(RT.move, null, dSeg, button(RT.center, recCenter), button(RT.home, () => { rec.dolly = 0; dSeg.sync(); rec.cf = null; resetCam(); })),
      group(RT.labels, null, range('recfs', 0.012, 0.035, 0.001, () => rec.fs, (v) => { rec.fs = v; recFit(stageEl.clientHeight); }, (v) => Math.round(v * 1920) + ' px')),
      group(RT.frame, null, toggle(RT.mark, () => rec.mark, (v) => { rec.mark = v; recMark.hidden = !v; }), toggle(RT.safe, () => !safe.hidden, (v) => { safe.hidden = !v; })),
      group(RT.record, null, recBtn, recOut)),
    h('h3', {}, RT.scene), consoleEl,
    button(RT.exit, () => { location.href = location.pathname; }));
  document.body.append(side);
  rec.font = getComputedStyle(document.body).fontFamily;
  placeScope(); layout();
}
/* «К тексту темы» — без смены адреса */
$('.skip').addEventListener('click', (e) => { e.preventDefault(); notesEl.tabIndex = -1; notesEl.focus({ preventScroll: true }); notesEl.scrollIntoView({ block: 'start' }); });
const start = idFromUrl();
show(BUILDERS[start] ? start : 'skeleton');
if (renderer) requestAnimationFrame(frame);
// ярлык приложения «Поиск по темам» (manifest shortcuts): ?find
if (new URLSearchParams(location.search).has('find')) setTimeout(fopen, 0);
function __set_rnd(x) { return (rnd = x); }
export { BKP, BODY, GLASS, GLOW, GL_N, LOBES, LOOK, SKEL_META, Sparks, THREE, V3, __set_rnd, accentSet, addLights, applyLook, bkCs, bkLs, bkPo, bloom, bodyShell, brainKit, brainShell, branchTree, button, canvas, clamp, cur, dimOthers, displaceGeo, ell3, envTex, fetchModel, flowTubeMat, flyStep, flyTarget, gauss, glassMat, glowNucleus, group, h, infoBox, labLights, lerp, makeControls, mergeGeometries, mergeVertices, mqMob, mulberry, noise3, organMat, parseGLB, pathRunner, pickOn, rand, randUnit, range, renderer, rnd, scopeShow, seg, smooth, stageEl, taperTube, tissue, toggle, tube };
