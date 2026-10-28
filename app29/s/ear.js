import { Sparks, THREE, V3, __set_rnd, button, clamp, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, makeControls, mulberry, noise3, organMat, pickOn, range, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ОРГАНЫ ЧУВСТВ · СЛУХ И РАВНОВЕСИЕ
   ========================================================= */
const EAR_PARTS = [
  { id: 'outer', name: 'Наружное ухо', color: '#E8B8A0', text: '<b>Наружное ухо</b> — ушная раковина и слуховой проход (~2,5 см). Раковина собирает звук и помогает понять, откуда он идёт (сверху, снизу, сзади) по тому, как её складки искажают спектр. Проход резонирует на 2–4 кГц — частотах речи.' },
  { id: 'drum', name: 'Барабанная перепонка', color: '#F2D8C0', text: '<b>Барабанная перепонка</b> — тонкая (0,1 мм) мембрана, которая колеблется вместе с давлением звуковой волны. Она отделяет наружное ухо от среднего.' },
  { id: 'oss', name: 'Слуховые косточки', color: '#F2E6C8', text: '<b>Молоточек, наковальня и стремечко</b> — самые маленькие кости тела (стремечко ~3 мм). Это рычаг: они передают колебания с большой перепонки на маленькое овальное окно улитки и усиливают давление примерно в 20 раз — иначе звук отразился бы от жидкости внутреннего уха. Мышцы косточек гасят слишком громкие звуки.' },
  { id: 'eust', name: 'Слуховая труба', color: '#D8A8B0', text: '<b>Слуховая (евстахиева) труба</b> соединяет среднее ухо с носоглоткой и выравнивает давление по обе стороны перепонки — поэтому в самолёте помогает глотать или зевать.' },
  { id: 'coch', name: 'Улитка', color: '#7FD6FF', text: '<b>Улитка</b> — костный канал в 2,75 витка, заполненный жидкостью. Вдоль него натянута <b>основная мембрана</b> с кортиевым органом: ~3500 внутренних и ~12 000 наружных волосковых клеток. Высокие звуки раскачивают мембрану у основания, низкие — у вершины (тонотопия).' },
  { id: 'vest', name: 'Вестибулярный аппарат', color: '#C77DFF', text: '<b>Вестибулярный аппарат</b>: три полукружных канала в трёх взаимно перпендикулярных плоскостях чувствуют вращение головы, а мешочки преддверия с кристаллами-отолитами — наклон и линейное ускорение (гравитацию).' },
  { id: 'nerve', name: 'Слуховой нерв', color: '#F4C542', text: '<b>Преддверно-улитковый нерв</b> (VIII пара) несёт сигналы в ствол мозга. Слуховой путь идёт через кохлеарные ядра, оливы, нижние холмики четверохолмия и медиальное коленчатое тело таламуса в слуховую кору височной доли (поле 41).' },
];
function makeEar() {
  __set_rnd(mulberry(1818));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070a); scene.environment = envTex;
  labLights(scene, 0x7fd6ff);
  const VIEW = { anat: flyTarget(V3(-1.5, -0.55, 0), V3(-1.8, 1.15, 8.8)), coch: flyTarget(V3(30, -0.1, 0), V3(30.6, 2.2, 6.6)), vest: flyTarget(V3(0.1, -0.15, 0), V3(1.9, 1.5, 4.4)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.anat.pos);
  const controls = makeControls(camera, VIEW.anat.target); controls.minDistance = 1; controls.maxDistance = 18;
  const ear = new THREE.Group(); scene.add(ear);
  const PART = Object.fromEntries(EAR_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = ear) => { const m = organMat(o.color || PART[id].color, o.k ?? 0.45, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  // височная кость (стекло)
  const bone = displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { v.set(v.x * 1.6, v.y * 1.25, v.z * 1.0).multiplyScalar(1 + 0.04 * noise3(v.x * 3, v.y * 3, v.z * 3)); }); bone.translate(-0.15, -0.05, 0);
  ear.add(new THREE.Mesh(bone, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.4), roughness: 0.6, transparent: true, opacity: 0.06, depthWrite: false })), new THREE.Mesh(bone, glassMat(0xf2e6c8, { rim: 0.28, base: 0.008, pow: 2.2 })));
  /* ---------- наружное ухо ---------- */
  // ушная раковина — почти плоская пластина в плоскости yz (+z — вперёд, +x — медиально): задний край отстоит от головы,
  // противозавиток и ладьевидная ямка — мягкие складки, раковинка (concha) — чаша вокруг входа в слуховой проход
  const PC = V3(-2.45, 0.2, -0.12), PRY = 0.8, PRZ = 0.5;
  const pinnaX = (a, b) => { const rr = Math.hypot(a, b), dc = Math.hypot(a - 0.25, b + 0.22);
    return PC.x - 0.28 * smooth(0.2, -1, a) - 0.05 * Math.exp(-(((rr - 0.68) / 0.09) ** 2)) + 0.035 * Math.exp(-(((rr - 0.86) / 0.06) ** 2)) + (dc < 0.4 ? 0.22 * (1 - (dc / 0.4) ** 2) : 0); };
  const pinna = displaceGeo(new THREE.RingGeometry(0.001, 1, 72, 24), (v) => { const a = v.x, b = v.y; v.set(pinnaX(a, b), PC.y + b * PRY, PC.z + a * PRZ); });
  add('outer', pinna, { k: 0.3, mat: { side: THREE.DoubleSide } });
  // завиток: от ножки в раковинке вверх, по переднему и верхнему краю, вниз по заднему — к мочке
  const helix = new THREE.CatmullRomCurve3(Array.from({ length: 28 }, (_, i) => { const t2 = -0.15 + i / 27 * 4.35, k = i < 3 ? 0.55 + 0.15 * i : 0.98, a = Math.cos(t2) * k, b = Math.sin(t2) * k; return V3(pinnaX(a, b) - 0.03, PC.y + b * PRY, PC.z + a * PRZ); }));
  add('outer', taperTube(helix, (u) => 0.055 * Math.sin(Math.min(1, u * 1.15) * Math.PI) + 0.02, 90, 10));
  add('outer', ell3(0.07, 0.2, 0.15, V3(pinnaX(-0.1, -0.95), PC.y - 0.86, PC.z - 0.04)));   // мочка — продолжает нижний край
  const CANAL = new THREE.CatmullRomCurve3([V3(-2.4, 0.0, 0.05), V3(-1.9, 0.08, 0.0), V3(-1.4, -0.02, -0.02), V3(-0.95, 0.02, 0.0)]);
  add('outer', taperTube(CANAL, (u) => 0.17 - 0.04 * u, 50, 18), { k: 0.4, mat: { transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide } });
  // перепонка
  const drumG = displaceGeo(new THREE.CircleGeometry(0.22, 32), (v) => { v.z = -0.06 * (1 - Math.hypot(v.x, v.y) / 0.22); });
  const drum = add('drum', drumG, { k: 0.6, mat: { side: THREE.DoubleSide, transparent: true, opacity: 0.85 } }); drum.position.set(-0.93, 0.02, 0); drum.rotation.y = Math.PI / 2 + 0.3; drum.rotation.x = 0.25;
  // среднее ухо: полость и косточки
  ear.add(new THREE.Mesh(ell3(0.38, 0.4, 0.3, V3(-0.62, 0.08, 0)), new THREE.MeshPhysicalMaterial({ color: 0x402830, roughness: 0.5, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.BackSide })));
  const oss = new THREE.Group(); ear.add(oss);
  const mall = new THREE.Group(); mall.position.set(-0.86, 0.22, 0); oss.add(mall);
  add('oss', ell3(0.06, 0.07, 0.06, V3(0, 0.1, 0)), {}, mall); add('oss', tube([V3(0, 0.05, 0), V3(-0.03, -0.12, 0.01), V3(-0.05, -0.22, 0.02)], (u) => 0.025 - 0.01 * u, 10, 8), {}, mall);
  const inc = new THREE.Group(); inc.position.set(-0.72, 0.3, 0); oss.add(inc);
  add('oss', ell3(0.07, 0.06, 0.06, V3(0, 0, 0)), {}, inc); add('oss', tube([V3(0.02, -0.02, 0), V3(0.06, -0.15, 0.02), V3(0.1, -0.22, 0.02)], 0.018, 10, 6), {}, inc);
  const stap = new THREE.Group(); stap.position.set(-0.6, 0.08, 0.02); oss.add(stap);
  add('oss', tube([V3(0, 0, 0), V3(0.1, 0.04, 0.04), V3(0.22, 0.0, 0.05)], 0.01, 10, 6), {}, stap); add('oss', tube([V3(0, 0, 0), V3(0.1, -0.04, -0.03), V3(0.22, 0.0, -0.04)], 0.01, 10, 6), {}, stap);
  add('oss', ell3(0.015, 0.05, 0.06, V3(0.23, 0, 0)), {}, stap);   // подножная пластинка — в овальном окне
  add('eust', tube([V3(-0.6, -0.25, 0.05), V3(-0.45, -0.7, 0.35), V3(-0.25, -1.3, 0.75)], (u) => 0.05 + 0.04 * u, 30, 10), { k: 0.4, mat: { transparent: true, opacity: 0.7 } });
  /* ---------- внутреннее ухо ---------- */
  // улитка: широкое основание (базальный завиток) обращено медиально, к внутреннему слуховому проходу, где из модиолюса выходит улитковый нерв;
  // купол смотрит латерально и вперёд. Базальный завиток начинается у преддверия (овальное и круглое окна)
  const COC = V3(0.02, -0.2, 0.05), TURNS = 2.75;
  const cochCurve = new THREE.CatmullRomCurve3([V3(-0.06, 0.1, 0.06), ...Array.from({ length: 120 }, (_, i) => { const u = i / 119, a = u * TURNS * Math.PI * 2, r = 0.5 * (1 - 0.78 * u); return V3(COC.x + 0.42 * (1 - u) - 0.12 * u, COC.y + Math.cos(a) * r, COC.z + 0.25 * u + Math.sin(a) * r); })]);
  const cochG = taperTube(cochCurve, (u) => 0.12 * (1 - 0.55 * u), 400, 16);
  { const pos = cochG.attributes.position, uv = cochG.attributes.uv, col = new Float32Array(pos.count * 3), c = new THREE.Color(); for (let i = 0; i < pos.count; i++) { c.setHSL(0.72 - 0.72 * uv.getX(i) * 0 - 0.62 * (1 - uv.getX(i)), 0.6, 0.6); c.setHSL(0.02 + 0.68 * (1 - uv.getX(i)), 0.65, 0.58); col.set([c.r, c.g, c.b], i * 3); } cochG.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  const cochMesh = add('coch', cochG, { k: 0.5, mat: { vertexColors: true, color: new THREE.Color(0x777777), transparent: true, opacity: 0.9 } });
  const glowSpot = glowNucleus(ear, COC.clone(), '#ffffff', 0.05, 8);
  add('vest', ell3(0.2, 0.14, 0.13, V3(-0.16, 0.12, 0.0)), { k: 0.4, mat: { transparent: true, opacity: 0.75 } });   // латеральная стенка — у подножной пластинки стремечка
  const CAN = [
    { c: V3(0.0, 0.55, -0.05), n: V3(0, 0, 1), name: 'передний' }, { c: V3(0.05, 0.42, -0.35), n: V3(1, 0, 0), name: 'задний' }, { c: V3(-0.25, 0.25, 0.05), n: V3(0, 1, 0.15), name: 'латеральный' },
  ].map((k) => { const g = new THREE.TorusGeometry(0.28, 0.03, 10, 48); g.lookAt(k.n); g.translate(k.c.x, k.c.y, k.c.z); const m = add('vest', g, { k: 0.5, mat: { transparent: true, opacity: 0.85 } }); return { ...k, m }; });
  // ампула — на самом кольце, в точке, ближайшей к преддверию
  const VC = V3(-0.16, 0.12, 0.0), AMP = [];
  CAN.forEach((k) => { const d = VC.clone().sub(k.c), n = k.n.clone().normalize(); d.addScaledVector(n, -d.dot(n)).setLength(0.28); AMP.push(k.c.clone().add(d)); add('vest', ell3(0.055, 0.055, 0.055, AMP[AMP.length - 1]), { k: 0.55 }); });
  add('nerve', tube([V3(0.4, -0.2, 0.05), V3(0.8, -0.05, -0.1), V3(1.5, 0.15, -0.2), V3(2.2, 0.2, -0.3)], 0.06, 30, 10), { k: 0.5, mat: { emissiveIntensity: 0.15 } });   // из основания модиолюса
  add('nerve', tube([V3(0.05, 0.2, -0.05), V3(0.6, 0.15, -0.1), V3(0.9, 0.05, -0.12)], 0.04, 20, 8), { k: 0.5 });
  const NERVE = new THREE.CatmullRomCurve3([V3(0.4, -0.2, 0.05), V3(0.8, -0.05, -0.1), V3(1.5, 0.15, -0.2), V3(2.2, 0.2, -0.3)]);
  /* ---------- развёрнутая улитка ---------- */
  const coch2 = new THREE.Group(); coch2.position.set(30, 0, 0); scene.add(coch2); coch2.visible = false;
  const BL = 4.2, BW0 = 0.12, BW1 = 0.26;   // у вершины мембрана шире, но не шире протока
  const bmG = new THREE.PlaneGeometry(BL, 1, 200, 12); bmG.rotateX(-Math.PI / 2);
  const bmBase = bmG.attributes.position.array.slice();
  const bmMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, side: THREE.DoubleSide, transparent: true, opacity: 0.95, emissive: 0x101820, emissiveIntensity: 0.4 });
  { const col = new Float32Array(bmG.attributes.position.count * 3); bmG.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  const bm = new THREE.Mesh(bmG, bmMat); coch2.add(bm);
  const ductG = new THREE.CylinderGeometry(0.42, 0.28, BL + 0.2, 32, 1, true); ductG.rotateZ(Math.PI / 2);
  coch2.add(new THREE.Mesh(ductG, new THREE.MeshPhysicalMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide })), new THREE.Mesh(ductG, glassMat(0x9fd0ff, { rim: 0.35, base: 0.01, pow: 2 })));
  // волосковые клетки: 1 ряд внутренних, 3 ряда наружных
  const HC = []; const hcG = new THREE.CylinderGeometry(0.012, 0.012, 0.06, 6); hcG.translate(0, 0.03, 0);
  const hcI = new THREE.InstancedMesh(hcG, new THREE.MeshBasicMaterial({ color: 0xffffff }), 4 * 70); coch2.add(hcI);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 70; i++) { const x = -BL / 2 + (i + 0.5) / 70 * BL, w = BW0 + (BW1 - BW0) * ((x + BL / 2) / BL); HC.push({ x, z: (row === 0 ? -0.35 : -0.05 + row * 0.18) * w, row }); }
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);
  const rings = []; for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.008, 6, 64, Math.PI * 1.2), new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); r.rotation.y = Math.PI / 2; r.rotation.z = Math.PI * 0.4; ear.add(r); rings.push({ r, ph: i / 6 }); }
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'anat', sel: null, labels: true, rot: false, fly: null, logf: Math.log10(1000), vol: 0.7, spin: false, spinT: -99, omega: 0, endo: 0, msg: null };
  const freq = () => Math.pow(10, st.logf);
  const place = (f) => clamp(Math.log10(f / 165.4 + 0.88) / 2.1, 0, 1); // 0 — вершина, 1 — основание (Гринвуд)
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(EAR_PARTS.map((p) => PART[p.id]), st.sel); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; ear.visible = m !== 'coch'; coch2.visible = m === 'coch'; st.fly = VIEW[m]; if (m === 'vest') select('vest'); else if (st.sel === 'vest') select('all'); refs.setInfo && refs.setInfo(); }
  function spin() { st.spinT = st.t; if (st.mode !== 'vest') setMode('vest'); st.msg = TXT.spin; refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'coch') select(id); });
  const C_N = new THREE.Color(0xf4c542), C_E = new THREE.Color(0xc77dff);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const f = freq(), A = st.vol, vis = Math.min(28, 2 + Math.log10(f) * 4), ph = Math.sin(t * vis * 2);
    // звуковые волны к уху
    rings.forEach((rg) => { const k = (t * 0.45 + rg.ph) % 1; rg.r.position.set(-4.4 + k * 1.9, 0.0, 0.05); rg.r.scale.setScalar(0.9 - k * 0.65); rg.r.material.opacity = A * 0.5 * Math.sin(k * Math.PI); });
    drum.position.x = -0.93 + 0.012 * A * ph; drum.scale.setScalar(1);
    mall.rotation.z = 0.12 * A * ph; inc.rotation.z = 0.1 * A * ph; stap.position.x = -0.6 + 0.014 * A * ph;
    // место максимума на улитке
    const x = place(f), u = 1 - x; const sp = cochCurve.getPointAt(Math.max(0.01, Math.min(0.99, u)));
    glowSpot.core.position.copy(sp); glowSpot.spr.position.copy(sp); glowSpot.spr.material.color.setHSL(0.02 + 0.68 * (1 - u), 0.8, 0.6); glowSpot.spr.scale.setScalar((0.25 + 0.25 * A) * (0.8 + 0.2 * Math.abs(ph)));
    if (st.mode === 'anat' && rnd() < A * 0.8) fx.spawn(NERVE.getPointAt(rnd()), V3(0.2, 0, 0), C_N, 0.5, 0, 1.3);
    // развёрнутая мембрана: бегущая волна
    if (st.mode === 'coch') {
      const pos = bmG.attributes.position, col = bmG.attributes.color, c = new THREE.Color(); let amax = 0;
      for (let i = 0; i < pos.count; i++) {
        const bx = bmBase[i * 3], bz = bmBase[i * 3 + 2]; const xn = (bx + BL / 2) / BL;   // 0 — основание (слева), 1 — вершина
        const w = BW0 + (BW1 - BW0) * xn; const z = bz * w * 2; const xp = 1 - xn;          // xp: 1 — основание
        const env = Math.exp(-(((xp - x) / 0.06) ** 2) * (xp < x ? 1 : 4)) * A;            // круто спадает за максимумом
        const y = env * 0.18 * Math.sin(t * 6 - xn * 60) * Math.cos(bz * Math.PI);
        pos.setXYZ(i, bx, y, z); c.setHSL(0.02 + 0.68 * xn, 0.55, 0.22 + 0.33 * env); col.setXYZ(i, c.r, c.g, c.b); amax = Math.max(amax, env);
      }
      pos.needsUpdate = true; col.needsUpdate = true; bmG.computeVertexNormals();
      const m4 = new THREE.Matrix4(), cc = new THREE.Color();
      HC.forEach((hc, i) => { const xn = (hc.x + BL / 2) / BL, xp = 1 - xn; const env = Math.exp(-(((xp - x) / 0.06) ** 2) * (xp < x ? 1 : 4)) * A; const y = env * 0.18 * Math.sin(t * 6 - xn * 60); m4.makeRotationZ(env * 0.6 * Math.sin(t * 6 - xn * 60)); m4.setPosition(hc.x, y + 0.01, hc.z); hcI.setMatrixAt(i, m4); cc.setHSL(hc.row ? 0.33 : 0.12, 0.8, 0.35 + 0.6 * env); hcI.setColorAt(i, cc); if (hc.row === 0 && env > 0.4 && rnd() < 0.15) fx.spawn(V3(30 + hc.x, y + 0.08, hc.z), V3(0, 0.6, 0), C_N, 0.6, 0.2, 1.2); });
      hcI.instanceMatrix.needsUpdate = true; if (hcI.instanceColor) hcI.instanceColor.needsUpdate = true;
    }
    // вращение головы: эндолимфа отстаёт, купула отклоняется
    const k = t - st.spinT; const spinning = k > 0 && k < 6; st.omega += ((spinning ? 2.2 : 0) - st.omega) * Math.min(1, dt * 3);
    st.endo += (st.omega - st.endo) * Math.min(1, dt * 0.35); const rel = st.omega - st.endo;
    ear.rotation.y = st.mode === 'vest' ? ear.rotation.y + st.omega * dt * 0.5 : 0;
    if (st.mode === 'vest') { CAN[2].m.material.emissiveIntensity = 0.04 + Math.min(0.45, Math.abs(rel) * 0.3); if (Math.abs(rel) > 0.15) for (let j = 0; j < 3; j++) { const a = rnd() * Math.PI * 2; const p = V3(Math.cos(a) * 0.28, 0, Math.sin(a) * 0.28).add(CAN[2].c); p.applyEuler(ear.rotation); fx.spawn(p, V3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(-Math.sign(rel) * 0.4).applyEuler(ear.rotation), C_E, 0.4, 0, 1.4); } }
    st.rel = rel;
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode !== 'vest'; scopeShow(on); if (!on) return;
    const f = freq(), cyc = Math.min(40, Math.max(1.5, Math.log10(f) * 6 - 6)); ctx.strokeStyle = '#9FD0FF'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const xx = 8 + i / 200 * (w - 16), yy = hgt / 2 + 8 - Math.sin(i / 200 * cyc * Math.PI * 2 - st.t * 8) * st.vol * (hgt * 0.32); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke(); ctx.fillStyle = '#9FD0FF'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('звук · ' + (f >= 1000 ? (f / 1000).toFixed(1) + ' кГц' : Math.round(f) + ' Гц'), 10, 13);
  }
  const TXT = {
    anat: '<b>Ухо</b> — три отдела. Наружное собирает звук, среднее (перепонка и косточки) переводит колебания воздуха в колебания жидкости, внутреннее (улитка) превращает их в нервные импульсы. Меняйте частоту: светящееся пятно на улитке показывает, где сильнее всего колеблется мембрана. Человек слышит от ~20 Гц до ~20 кГц.',
    coch: '<b>Улитка в развёрнутом виде.</b> Основная мембрана узкая и жёсткая у основания (слева), широкая и мягкая у вершины (справа). Звук рождает бегущую волну, которая нарастает и затухает в точке, настроенной на эту частоту. Там сгибаются стереоцилии волосковых клеток: внутренние (жёлтые) передают сигнал в нерв, наружные (зелёные) подстраивают мембрану и усиливают слабые звуки. Так ухо раскладывает звук на частоты, как призма — свет.',
    vest: '<b>Вестибулярный аппарат.</b> Каждый полукружный канал заполнен эндолимфой; в его расширении — ампуле — студенистая купула с волосковыми клетками. Нажмите «Покружиться».',
    spin: '<b>Вращение.</b> Голова поворачивается, а жидкость в канале по инерции отстаёт и отклоняет купулу (фиолетовые частицы идут навстречу) — мозг узнаёт о вращении. При долгом равномерном вращении жидкость догоняет стенки, и ощущение пропадает. А после резкой остановки она продолжает течь — кажется, что мир кружится в обратную сторону: это головокружение.',
  };
  const labels = [
    { text: 'ушная раковина', pos: V3(-2.6, 0.95, -0.1), color: '#E8B8A0', show: () => st.labels && st.mode === 'anat' },
    { text: 'слуховой проход', pos: V3(-1.7, 0.28, 0.1), color: '#E8B8A0', show: () => st.labels && st.mode === 'anat' },
    { text: 'барабанная перепонка', pos: V3(-0.95, -0.3, 0.2), color: '#F2D8C0', show: () => st.labels && st.mode === 'anat' },
    { text: 'молоточек · наковальня · стремечко', pos: V3(-0.75, 0.55, 0.1), color: '#F2E6C8', show: () => st.labels && st.mode === 'anat' },
    { text: 'слуховая труба', pos: V3(-0.35, -1.1, 0.7), color: '#D8A8B0', show: () => st.labels && st.mode === 'anat' },
    { text: 'улитка', pos: V3(0.25, -0.75, 0.35), color: '#7FD6FF', show: () => st.labels && st.mode === 'anat' },
    { text: 'полукружные каналы', pos: V3(0.25, 0.92, 0.0), color: '#C77DFF', show: () => st.labels && st.mode !== 'coch' },
    { text: 'слуховой нерв → ствол мозга', pos: V3(1.3, 0.4, -0.2), color: '#F4C542', show: () => st.labels && st.mode === 'anat' },
    { text: 'основание · 20 кГц', pos: V3(27.8, 0.35, 0.3), color: '#E07070', show: () => st.labels && st.mode === 'coch' },
    { text: 'вершина · 20 Гц', pos: V3(31.9, 0.35, 0.4), color: '#B08AFF', show: () => st.labels && st.mode === 'coch' },
    { text: 'основная мембрана', pos: V3(29.4, -0.15, 0.5), color: '#c8d8f0', show: () => st.labels && st.mode === 'coch' },
    { text: 'ампула с купулой', pos: AMP[2].clone().add(V3(0, 0.06, 0.1)), color: '#C77DFF', show: () => st.labels && st.mode === 'vest' },
    { text: 'преддверие (отолиты)', pos: V3(-0.15, 0.0, 0.2), color: '#C77DFF', show: () => st.labels && st.mode === 'vest' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'anat' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'anat', label: 'Строение уха' }, { id: 'coch', label: 'Улитка изнутри' }, { id: 'vest', label: 'Равновесие' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...EAR_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'coch') setMode('anat'); select(v); });
    const fr = range('freq', Math.log10(20), Math.log10(20000), 0.01, () => st.logf, (v) => { st.logf = v; }, (v) => { const f = Math.pow(10, v); return f >= 1000 ? (f / 1000).toFixed(1) + ' кГц' : Math.round(f) + ' Гц'; });
    const vo = range('vol', 0, 1, 0.01, () => st.vol, (v) => { st.vol = v; }, (v) => Math.round(v * 100) + '%');
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 500px' }, h('div', { class: 'glabel' }, 'Части', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Звук', 'частота · громкость', fr, vo), group('Опыт', 'S', button('Покружиться', spin, true)), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['anat', 'coch', 'vest'][n - 1]); return true; }
    if (k === 's' || k === 'ы') { spin(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { const f = freq(); return st.mode === 'vest' ? [['Вращение', st.omega.toFixed(1), 'рад/с'], ['Сигнал купулы', Math.abs(st.rel || 0).toFixed(2), '']] : [['Частота', f >= 1000 ? (f / 1000).toFixed(1) : Math.round(f), f >= 1000 ? 'кГц' : 'Гц'], ['Место на улитке', Math.round((1 - place(f)) * 100), '% от основания']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Органы чувств · слух', title: 'Слух и равновесие',
    lede: 'Три крошечные косточки, улитка с жидкостью и 15 000 волосковых клеток превращают колебания воздуха в звуки, а соседние каналы следят за каждым поворотом головы.',
    notes: `
      <div><h2>Громкость и частота</h2>
        <p>Частоту ухо кодирует местом на мембране (высокие — у основания) и для низких звуков — ритмом импульсов. Громкость — числом и частотой разрядов волокон. Диапазон громкости огромен: от 0 дБ (порог) до 120–130 дБ (болевой порог).</p>
        <h3>Почему портится слух</h3><p>Волосковые клетки не восстанавливаются. Громкая музыка и шум повреждают их, первыми страдают клетки основания — пропадают высокие частоты.</p></div>
      <div><h2>Условности</h2><ul><li>Размеры отделов уха искажены: среднее и внутреннее ухо увеличены.</li><li>Колебания показаны в миллионы раз сильнее и медленнее реальных.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик: часть уха</li><li><code>S</code> покружиться</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeEar };
