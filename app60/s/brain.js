import { GLOW, THREE, V3, __set_rnd, accentSet, addLights, brainKit, brainShell, displaceGeo, envTex, glassMat, group, h, makeControls, mergeGeometries, mqMob, mulberry, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   SCENE 3 · МОЗГ
   ========================================================= */
const SYSTEMS = [
  { id: 'da', name: 'Дофамин', color: '#F4C542', src: 'чёрная субстанция и вентральная покрышка', share: '~0,5 млн', text: '<b>Дофамин.</b> Нигростриатный путь управляет движением (гибель — Паркинсон). Мезолимбический — удовольствие и мотивация. Мезокортикальный — внимание. Короткий путь к гипофизу сдерживает пролактин.' },
  { id: 'na', name: 'Норадреналин', color: '#F08A3C', src: 'голубое пятно', share: '~30–50 тыс.', text: '<b>Норадреналин.</b> Из голубого пятна в стволе по всей коре, в мозжечок и спинной мозг. Бодрствование, внимание, реакция на стресс.' },
  { id: 'ht', name: 'Серотонин', color: '#C77DFF', src: 'ядра шва', share: '~0,3 млн', text: '<b>Серотонин.</b> Ядра шва посылают отростки вверх, в кору и таламус, и вниз, в спинной мозг. Настроение, сон, аппетит, контроль боли.' },
  { id: 'ach', name: 'Ацетилхолин', color: '#3FC1B0', src: 'базальное ядро', share: 'сотни тысяч', text: '<b>Ацетилхолин.</b> Базальное ядро переднего мозга питает кору и гиппокамп: внимание и память. При Альцгеймере эти клетки гибнут.' },
  { id: 'his', name: 'Гистамин', color: '#FF7FB0', src: 'задний гипоталамус', share: '~60 тыс.', text: '<b>Гистамин.</b> Из заднего гипоталамуса по всей коре. Держит в бодрствовании; антигистаминные первого поколения усыпляют.' },
];

function makeBrain() {
  __set_rnd(mulberry(5));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  addLights(scene, 0xff7aa8);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 100); camera.position.set(4.6, 1.5, 5.4);
  const controls = makeControls(camera, V3(0, -0.35, 0)); controls.minDistance = 2.2; controls.maxDistance = 14; controls.autoRotate = true; controls.autoRotateSpeed = 0.6;

  // оболочка — общая модель brainKit (борозды, мозжечок с листками и ножками, ствол с мостом)
  brainShell(scene, { opacity: 0.1, rim: 0.62 });
  const hemiGeos = brainKit().hemi;
  const innerMat = glassMat(0xb9a4ff, { rim: 0.35, base: 0.01, pow: 1.8 });
  const innerFill = new THREE.MeshPhysicalMaterial({ color: 0xb9a4ff, roughness: 0.5, transparent: true, opacity: 0.15, depthWrite: false });   // таламус и гипофиз видны, но не закрывают ядра
  // таламусы — два яйца (узкий передний конец, толстая подушка сзади) с щелью III желудочка между ними
  [1, -1].forEach((sd) => { const g = displaceGeo(new THREE.SphereGeometry(1, 40, 28), (v) => { const back = smooth(0.2, -1, v.x); v.set(v.x * 0.36, v.y * (0.15 + 0.06 * back), v.z * (0.13 + 0.06 * back)); v.add(V3(0.0, -0.05, 0.19 * sd)); });
    [innerFill, innerMat].forEach((mt) => scene.add(new THREE.Mesh(g, mt))); });
  // мозолистое тело — плоская дуга-лента с утолщениями спереди (колено) и сзади (валик)
  { const c = new THREE.CatmullRomCurve3([V3(0.72, -0.12, 0), V3(0.86, 0.1, 0), V3(0.7, 0.32, 0), V3(0, 0.42, 0), V3(-0.65, 0.3, 0), V3(-0.8, 0.12, 0)]);
    const g = taperTube(c, (u) => 0.035 + 0.03 * Math.exp(-(((u - 0.2) / 0.12) ** 2)) + 0.045 * smooth(0.75, 1, u), 80, 16); g.scale(1, 1, 4.2); scene.add(new THREE.Mesh(g, innerMat)); }
  [innerFill, innerMat].forEach((mt) => { const pit = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), mt); pit.position.set(0.38, -0.8, 0); scene.add(pit); });
  scene.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(0.27, -0.55, 0), V3(0.33, -0.66, 0), V3(0.37, -0.75, 0)]), (u) => 0.03 - 0.012 * u, 16, 10), innerMat));   // воронка (ножка гипофиза)

  // cortex target points
  const cortexPts = [];
  hemiGeos.forEach((g, gi) => { const pos = g.attributes.position; for (let i = 0; i < pos.count; i += 37) { const p = V3(pos.getX(i), pos.getY(i), pos.getZ(i)); const side = gi ? -1 : 1; if (p.y > -0.15 && p.z * side > 0.5) cortexPts.push(p.multiplyScalar(0.94)); } });
  const pick = (n, filter = () => true) => { const a = cortexPts.filter(filter); const out = []; for (let i = 0; i < n; i++) out.push(a[Math.floor(rnd() * a.length)]); return out; };

  /* все пути одной системы — одна геометрия и один материал (было 76 мешей со своими шейдерами); фаза бегущей волны — атрибут вершин */
  const flowMat = (color) => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOn: { value: 1 } },
    vertexShader: `attribute float aPhase; varying vec2 vUv; varying float vPh; void main(){ vUv = uv; vPh = aPhase; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime,uOn; varying vec2 vUv; varying float vPh;
      void main(){ float s = fract(vUv.x*1.6 - uTime*0.45 + vPh); float p = smoothstep(0.0,0.06,s)*(1.0-smoothstep(0.06,0.32,s)); float a = (0.16 + 1.1*p)*uOn*smoothstep(0.0,0.04,vUv.x); gl_FragColor = vec4(uColor*(0.7+2.2*p), a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const groups = {}, nucleiLabels = [];
  // MFB: восходящие пути ствола к передней коре идут сперва вперёд в медиальном пучке переднего мозга (гипоталамус, перегородка), затем веером
  const MFB = { da: 1, na: 1, ht: 1, his: 1 };
  function path(sys, a, b, lift = 0.25, r = 0.011) {
    const via = MFB[sys.id] && b.y > -0.2 && b.x > -0.3 && a.x < 0.3 ? V3(0.5, -0.25, 0.1 * Math.sign(b.z || 1)) : null;
    const a2 = via || a, mid = a2.clone().lerp(b, 0.5); mid.y += lift; mid.x += (b.x - a2.x) * 0.08;
    const c = new THREE.CatmullRomCurve3(via ? [a, a.clone().lerp(via, 0.5).add(V3(0, 0.05, 0)), via, mid, b] : [a, a.clone().lerp(mid, 0.5).add(V3(0, lift * 0.3, 0)), mid, b]);
    const g = new THREE.TubeGeometry(c, 60, r, 6); g.setAttribute('aPhase', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count).fill(rnd() * 10), 1));
    (PATHS[sys.id] = PATHS[sys.id] || []).push(g);
  }
  const PATHS = {};
  function nucleus(sys, p, name, size = 0.05, lp = null) {
    const g = groups[sys.id];
    const core = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(sys.color).multiplyScalar(2) })); core.position.copy(p); g.add(core);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: sys.color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); spr.scale.setScalar(size * 6); spr.position.copy(p); g.add(spr);
    if (name) nucleiLabels.push({ text: name, pos: lp || p.clone().add(V3(0, 0.1, 0.12)), sys: sys.id });   // lp — своё место подписи: ядра лежат тесно
  }
  SYSTEMS.forEach((s) => { groups[s.id] = new THREE.Group(); scene.add(groups[s.id]); });
  const S = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]));
  // DA
  const SN = [V3(-0.05, -0.55, 0.22), V3(-0.05, -0.55, -0.22)], VTA = [V3(0.0, -0.56, 0.07), V3(0.0, -0.56, -0.07)];
  SN.forEach((p, i) => { nucleus(S.da, p, i ? null : 'чёрная субстанция', 0.05, V3(-0.05, -0.64, 0.36)); const sgn = i ? -1 : 1; path(S.da, p, V3(0.38, 0.08, 0.38 * sgn), 0.2, 0.016); path(S.da, p, V3(0.6, 0.0, 0.32 * sgn), 0.25, 0.012); });
  VTA.forEach((p, i) => { nucleus(S.da, p, i ? null : 'вентральная покрышка', 0.05, V3(0.06, -0.46, 0.16)); const sgn = i ? -1 : 1; path(S.da, p, V3(0.6, -0.3, 0.18 * sgn), 0.1, 0.016); path(S.da, p, V3(1.38, 0.25, 0.32 * sgn), 0.35); path(S.da, p, V3(1.3, -0.05, 0.42 * sgn), 0.3); });
  nucleus(S.da, V3(0.25, -0.5, 0), null, 0.035); path(S.da, V3(0.25, -0.5, 0), V3(0.38, -0.76, 0), 0.0, 0.014);
  // NA
  const LC = [V3(-0.42, -0.98, 0.09), V3(-0.42, -0.98, -0.09)];
  LC.forEach((p, i) => { nucleus(S.na, p, i ? null : 'голубое пятно', 0.05, V3(-0.6, -1.1, 0.2)); });
  pick(16).forEach((t, j) => path(S.na, LC[t.z > 0 ? 0 : 1], t, 0.5));
  path(S.na, LC[0], V3(-1.25, -0.8, 0.5), 0.1); path(S.na, LC[1], V3(-1.25, -0.8, -0.5), 0.1); path(S.na, LC[0], V3(-0.48, -2.25, 0.03), -0.05); path(S.na, LC[0], V3(-0.25, -0.32, 0.6), 0.2);
  // 5-HT
  const RA = [V3(-0.25, -0.78, 0), V3(-0.33, -1.05, 0), V3(-0.4, -1.32, 0)];
  RA.forEach((p, i) => nucleus(S.ht, p, i === 1 ? 'ядра шва' : null, 0.04, V3(-0.12, -0.86, 0.12)));
  pick(14).forEach((t, j) => path(S.ht, RA[j % 2], t, 0.42));
  path(S.ht, RA[0], V3(0.05, -0.05, 0.2), 0.1); path(S.ht, RA[0], V3(0.05, -0.05, -0.2), 0.1); path(S.ht, RA[2], V3(-0.47, -2.25, -0.03), -0.05);
  // ACh
  const MY = [V3(0.45, -0.38, 0.26), V3(0.45, -0.38, -0.26)];
  MY.forEach((p, i) => nucleus(S.ach, p, i ? null : 'базальное ядро', 0.05, V3(0.52, -0.12, 0.38)));
  pick(14, (p) => p.x > -0.9).forEach((t) => path(S.ach, MY[t.z > 0 ? 0 : 1], t, 0.3));
  path(S.ach, MY[0], V3(-0.25, -0.32, 0.58), 0.05); path(S.ach, MY[1], V3(-0.25, -0.32, -0.58), 0.05);
  // His
  const TM = [V3(0.12, -0.5, 0.09), V3(0.12, -0.5, -0.09)];
  TM.forEach((p, i) => nucleus(S.his, p, i ? null : 'задний гипоталамус', 0.04, V3(0.28, -0.3, 0.12)));
  pick(12).forEach((t) => path(S.his, TM[t.z > 0 ? 0 : 1], t, 0.35, 0.009));
  Object.entries(PATHS).forEach(([id, gs]) => { groups[id].add(new THREE.Mesh(mergeGeometries(gs), flowMat(S[id].color))); gs.forEach((g) => g.dispose()); });

  const st = { sys: 'all', rot: true, labels: true, t: 0 };
  function apply() {
    SYSTEMS.forEach((s) => {
      const on = st.sys === 'all' || st.sys === s.id;
      groups[s.id].children.forEach((m) => { if (m.material.uniforms) m.material.uniforms.uOn.value = on ? (st.sys === 'all' ? 0.2 : 1.2) : 0.04; else m.visible = on; });
    });
    accentSet(st.sys === 'all' ? '#EFEAE6' : S[st.sys].color);
  }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot;
    SYSTEMS.forEach((s) => groups[s.id].children.forEach((m) => { if (m.material.uniforms) m.material.uniforms.uTime.value = st.t; }));
  }
  const anat = [
    { text: 'лобная кора', pos: V3(1.55, 0.35, 0.75) }, { text: 'затылочная кора', pos: V3(-1.65, 0.35, 0.7) },
    { text: 'мозжечок', pos: V3(-1.5, -1.2, 0.95) }, { text: 'ствол', pos: V3(-0.25, -1.45, 0.3) }, { text: 'спинной мозг', pos: V3(-0.5, -2.25, 0.2) },
    { text: 'таламус', pos: V3(0.05, 0.12, 0.3) }, { text: 'гипофиз', pos: V3(0.48, -0.86, 0.05) },
  ];
  // в обзоре — по одному ядру на систему; на телефоне анатомические подписи только при выбранной системе
  const labels = [...anat.map((l) => ({ ...l, show: () => st.labels && !(mqMob.matches && (st.sys === 'all' || l.text === 'таламус')) })), ...nucleiLabels.map((l) => ({ text: l.text, pos: l.pos, color: S[l.sys].color, show: () => st.labels && (st.sys === l.sys || (st.sys === 'all' && l.text !== 'чёрная субстанция')) }))];
  let refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    const setInfo = () => { info.innerHTML = st.sys === 'all' ? 'Пять систем, у каждой своё маленькое ядро в глубине мозга. Выберите одну, чтобы увидеть её пути отдельно.' : S[st.sys].text; };
    const sysSeg = seg([{ id: 'all', label: 'Все' }, ...SYSTEMS.map((s) => ({ id: s.id, label: s.name, color: s.color }))], () => st.sys, (v) => { st.sys = v; apply(); setInfo(); });
    const rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    refs = { sysSeg, rot, lab, setInfo };
    el.append(group('Система', '0–5', sysSeg), group('Вид', 'R · N', rot, lab), h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'Что видно'), info));
    setInfo();
  }
  function onKey(e) {
    const n = parseInt(e.key, 10);
    if (n >= 0 && n <= 5) { st.sys = n === 0 ? 'all' : SYSTEMS[n - 1].id; apply(); refs.sysSeg.sync(); refs.setInfo(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { if (st.sys === 'all') return [['Систем', 5, ''], ['Медиаторов', 5, '']]; const s = S[st.sys]; return [['Нейронов', s.share, '']]; }
  apply();
  return {
    deskShift: 1.3, mobZoom: 0.62, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sys === 'all' ? '#EFEAE6' : S[st.sys].color; },
    kicker: 'Медиаторы · где они в мозге', title: 'Системы медиаторов',
    lede: 'Маленькие ядра в стволе и основании мозга раскидывают отростки по огромной территории. Поэтому одно вещество меняет состояние всего мозга сразу.',
    notes: `
      <div><h2>Как это устроено</h2>
        <p>Глутамат и ГАМК есть почти везде и передают сам сигнал. Пять систем на этой модели работают иначе: от десятков до сотен тысяч клеток в нескольких ядрах (доли процента от ~86 млрд нейронов) управляют настроением, вниманием, сном и движением всего мозга.</p>
        <h3>Пути дофамина</h3>
        <p><b>Нигростриатный</b>: из чёрной субстанции в стриатум, движения. <b>Мезолимбический</b>: из покрышки в прилежащее ядро, удовольствие и мотивация. <b>Мезокортикальный</b>: в лобную кору, внимание и планирование. <b>Тубероинфундибулярный</b>: к гипофизу, сдерживает пролактин.</p>
        <h3>Почему это важно</h3>
        <p>Антидепрессанты, нейролептики, стимуляторы и снотворные действуют на эти системы. Поэтому у них такие широкие эффекты: они меняют работу сразу всей коры.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Положение ядер-источников: ствол, средний мозг, гипоталамус, основание переднего мозга.</li><li>Куда идут отростки каждой системы.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Мозг — упрощённая модель с извилинами, а не скан.</li><li>Реальных отростков миллионы, здесь по десятку на систему.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>0</code>–<code>5</code> система</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li><li>мышь: вращать, колесо: приблизить</li></ul></div>`,
  };
}
export { makeBrain };
