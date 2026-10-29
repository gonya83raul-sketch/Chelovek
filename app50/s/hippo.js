import { BKP, Sparks, THREE, V3, __set_rnd, brainShell, button, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 4 · ГИППОКАМП И КРУГ ПЕЙПЕЗА
   ========================================================= */
const PZ_PARTS = [
  { id: 'hip', name: 'Гиппокамп', color: '#FF8A5C', text: '<b>Гиппокамп</b> («морской конёк», описан Джулио Аранци в XVI веке) — ключевая структура старой коры, лежит в глубине височной доли на дне нижнего рога бокового желудочка. Память текущего дня, пространственное обучение, «каталог» долговременной памяти. Сохраняет способность к нейрогенезу и может расти при тренировке: он увеличен у таксистов и официантов.' },
  { id: 'fx', name: 'Свод', color: '#FFE08A', text: '<b>Свод</b> — пучок белого вещества, выходящий из гиппокампа. Он прокручивается вокруг таламуса навстречу хвостатому ядру, проходит по стенке III желудочка и заканчивается в мамиллярных телах.' },
  { id: 'mam', name: 'Мамиллярные тела', color: '#F2C14E', text: '<b>Мамиллярные тела</b> — выступы на нижней стороне промежуточного мозга. От них мамиллоталамический тракт идёт в передние ядра таламуса.' },
  { id: 'ant', name: 'Передние ядра таламуса', color: '#B9A4FF', text: '<b>Передние ядра таламуса</b> — лимбическая часть таламуса, переключают сигнал круга Пейпеза в поясную извилину.' },
  { id: 'cing', name: 'Поясная извилина', color: '#E58FC4', text: '<b>Поясная извилина</b> лежит над мозолистым телом. Через неё гиппокамп связан со множеством отделов новой коры; её поля 24–26 распознают несовпадения и ошибки.' },
  { id: 'ent', name: 'Энторинальная кора', color: '#5CC48A', text: '<b>Парагиппокампальная извилина и энторинальная кора</b> — вход в гиппокамп: отсюда начинается перфорантный путь к зубчатой извилине. Круг замыкается.' },
  { id: 'amy', name: 'Миндалина', color: '#FF6A9A', text: '<b>Миндалина</b> — у переднего конца гиппокампа. Придаёт воспоминаниям эмоциональную окраску.' },
  { id: 'olf', name: 'Обонятельный мозг', color: '#7FD6C8', text: '<b>Древняя кора (палеокортекс)</b>: обонятельные луковицы, тракты, обонятельные треугольники и бугорки, крючок парагиппокампальной извилины. Здесь из отдельных молекул-одорантов собираются целостные запахи. Новая кора у человека — почти 96% всей коры.' },
];
function makeHippo() {
  __set_rnd(mulberry(909));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xff8a5c);
  const VIEW = { papez: flyTarget(V3(-0.1, -0.35, 0.2), V3(1.25, 1.2, 6.15)), sec: flyTarget(V3(0.45, -0.6, 0), V3(0.5, 0.1, 7.6)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.papez.pos);
  const controls = makeControls(camera, VIEW.papez.target); controls.minDistance = 1.5; controls.maxDistance = 14;
  const brain = new THREE.Group(); scene.add(brain);
  const shell = brainShell(brain, { opacity: 0.035, rim: 0.24 });
  const PART = Object.fromEntries(PZ_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}) => { const m = tissue(new THREE.Color(PART[id].color).multiplyScalar(0.36), { emissive: new THREE.Color(PART[id].color), emissiveIntensity: 0.05, transparent: true, ...o }); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); brain.add(me); return me; };
  const HC = [], FX = [];
  // открытые концы трубок закрываем сферами — без «чёрных дыр»
  const capped = (g, c, r0, r1) => { const a = new THREE.SphereGeometry(r0, 16, 12), b = new THREE.SphereGeometry(r1, 16, 12); a.translate(...c.getPointAt(0).toArray()); b.translate(...c.getPointAt(1).toArray()); return mergeGeometries([g, a, b]); };
  [1, -1].forEach((s) => {
    const hc = new THREE.CatmullRomCurve3([V3(0.22, -0.46, 0.5 * s), V3(0.0, -0.42, 0.52 * s), V3(-0.3, -0.33, 0.5 * s), V3(-0.55, -0.15, 0.43 * s), V3(-0.66, 0.02, 0.33 * s)]); HC.push(hc);
    add('hip', capped(displaceGeo(taperTube(hc, (u) => (u < 0.25 ? 0.1 + 0.04 * Math.sin(u / 0.25 * Math.PI) : 0.1 * (1 - (u - 0.25) * 0.7)), 90, 18), (v) => { v.y += 0.012 * Math.sin(v.x * 60) * smooth(0.05, 0.25, v.x); }), hc, 0.1, 0.1 * (1 - 0.75 * 0.7)));
    const dg = new THREE.CatmullRomCurve3(hc.getPoints(10).map((p) => p.clone().add(V3(0, 0.03, -0.085 * s))));
    add('hip', taperTube(dg, (u) => 0.025 * (1 - u * 0.5), 60, 8), { color: new THREE.Color('#ff6a5a').multiplyScalar(0.45) });
    const fx = new THREE.CatmullRomCurve3([V3(-0.66, 0.02, 0.33 * s), V3(-0.62, 0.17, 0.2 * s), V3(-0.35, 0.27, 0.1 * s), V3(0.05, 0.28, 0.05 * s), V3(0.3, 0.16, 0.035 * s), V3(0.36, -0.08, 0.04 * s), V3(0.22, -0.4, 0.05 * s), V3(0.13, -0.56, 0.055 * s)]); FX.push(fx);
    add('fx', capped(taperTube(fx, (u) => 0.04 - 0.012 * u, 90, 10), fx, 0.04, 0.028));
    const mb = new THREE.SphereGeometry(0.05, 20, 14); mb.translate(0.12, -0.59, 0.06 * s); add('mam', mb);
    const ant = new THREE.SphereGeometry(1, 20, 14); ant.scale(0.09, 0.07, 0.06); ant.translate(0.27, 0.08, 0.15 * s); add('ant', ant);
    const th = new THREE.SphereGeometry(1, 30, 20); th.scale(0.32, 0.19, 0.18); th.translate(0.0, -0.06, 0.2 * s);
    brain.add(new THREE.Mesh(th, tissue(new THREE.Color('#B9A4FF').multiplyScalar(0.3), { transparent: true, opacity: 0.35, depthWrite: false })));
    const amy = new THREE.SphereGeometry(0.085, 20, 14); amy.translate(0.42, -0.34, 0.5 * s); add('amy', amy);   // впереди и выше головки гиппокампа
    // энторинальная кора / парагиппокампальная извилина — медиальнее и ниже гиппокампа
    const ent = new THREE.CatmullRomCurve3([V3(0.3, -0.62, 0.4 * s), V3(0.0, -0.62, 0.42 * s), V3(-0.35, -0.55, 0.42 * s), V3(-0.7, -0.38, 0.4 * s)]);
    add('ent', capped(taperTube(ent, () => 0.055, 50, 10), ent, 0.055, 0.055));
    // поясная извилина над мозолистым телом
    const cg = new THREE.CatmullRomCurve3([V3(0.95, 0.12, 0.09 * s), V3(0.75, 0.52, 0.09 * s), V3(0.0, 0.64, 0.09 * s), V3(-0.7, 0.5, 0.09 * s), V3(-0.95, 0.2, 0.1 * s), V3(-0.85, -0.12, 0.28 * s), V3(-0.7, -0.38, 0.4 * s)]);
    add('cing', capped(taperTube(cg, (u) => 0.07 * (1 - 0.35 * smooth(0.7, 1, u)), 120, 12), cg, 0.07, 0.07 * 0.65));
    // обонятельный мозг
    const ob = new THREE.SphereGeometry(1, 20, 14); ob.scale(0.13, 0.05, 0.05); ob.translate(1.22, -0.6, 0.13 * s); add('olf', ob);
    add('olf', taperTube(new THREE.CatmullRomCurve3([V3(1.1, -0.6, 0.13 * s), V3(0.8, -0.58, 0.15 * s), V3(0.55, -0.55, 0.2 * s), V3(0.42, -0.5, 0.35 * s), V3(0.35, -0.48, 0.45 * s)]), () => 0.018, 40, 6));
  });
  // мозолистое тело
  const cc = taperTube(new THREE.CatmullRomCurve3(BKP.cc.map((p) => p.clone().add(V3(0, 0.04, 0)))), (u) => 0.07 + 0.05 * smooth(0.8, 1, u), 80, 12); cc.scale(1, 1, 3.4);   // утолщение — валик
  brain.add(new THREE.Mesh(cc, tissue(new THREE.Color(0xefe8dc).multiplyScalar(0.4), { transparent: true, opacity: 0.6, depthWrite: false })));
  // круг Пейпеза (одна сторона, z > 0)
  const CIRC = [
    { id: 'hip', c: new THREE.CatmullRomCurve3(HC[0].getPoints(8)), d: 1.0 },
    { id: 'fx', c: FX[0], d: 1.6 },
    { id: 'mam', c: new THREE.CatmullRomCurve3([V3(0.12, -0.56, 0.07), V3(0.2, -0.3, 0.1), V3(0.25, -0.05, 0.13), V3(0.27, 0.07, 0.15)]), d: 0.8 },
    { id: 'ant', c: new THREE.CatmullRomCurve3([V3(0.27, 0.1, 0.15), V3(0.3, 0.35, 0.12), V3(0.4, 0.58, 0.1)]), d: 0.6 },
    { id: 'cing', c: new THREE.CatmullRomCurve3([V3(0.4, 0.62, 0.1), V3(0.0, 0.66, 0.1), V3(-0.7, 0.52, 0.1), V3(-0.95, 0.2, 0.11), V3(-0.85, -0.12, 0.28), V3(-0.7, -0.38, 0.4)]), d: 1.6 },
    { id: 'ent', c: new THREE.CatmullRomCurve3([V3(-0.7, -0.38, 0.4), V3(-0.3, -0.55, 0.42), V3(0.05, -0.62, 0.42), V3(0.22, -0.46, 0.5)]), d: 1.0 },
  ];
  const flows = CIRC.map((s) => { const f = flowTubeMat(PART[s.id].color, 0.45, 1.6); f.uniforms.uOn.value = 0; brain.add(new THREE.Mesh(new THREE.TubeGeometry(s.c, 50, 0.016, 6), f)); return f; });
  const CIRC_T = CIRC.reduce((a, s) => a + s.d, 0);

  /* ---------- поперечный срез гиппокампа (рис. 4.6) ---------- */
  const sec = new THREE.Group(); scene.add(sec); sec.visible = false;
  const P2 = (x, y, z = 0) => V3(x, y, z);
  const plateShape = new THREE.Shape(); plateShape.moveTo(-1.6, -1.0); plateShape.bezierCurveTo(-1.9, 0.6, -0.6, 1.55, 0.7, 1.35); plateShape.bezierCurveTo(1.9, 1.2, 2.2, 0.2, 2.0, -0.6);
  plateShape.bezierCurveTo(2.6, -0.9, 3.0, -1.2, 3.0, -1.6); plateShape.lineTo(-0.4, -1.6); plateShape.bezierCurveTo(-1.2, -1.6, -1.5, -1.3, -1.6, -1.0);
  const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(plateShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 40 }), tissue(new THREE.Color(0xc8a0a8).multiplyScalar(0.2), { roughness: 0.75, sheen: 0.1 }));
  plate.position.z = -0.6; sec.add(plate);
  // нижний рог бокового желудочка над гиппокампом
  const vent = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.05, 8, 60, Math.PI * 0.85), new THREE.MeshPhysicalMaterial({ color: 0x1f5f9a, roughness: 0.2, emissive: 0x0a2a4a, emissiveIntensity: 0.6 }));
  vent.position.set(0.35, 0.05, 0); vent.rotation.z = 0.25; sec.add(vent);
  const CA = new THREE.CatmullRomCurve3([P2(1.85, -0.85), P2(1.55, 0.1), P2(0.9, 0.85), P2(0.0, 0.95), P2(-0.75, 0.55), P2(-0.85, 0.05), P2(-0.4, -0.18)]);
  const caBand = new THREE.Mesh(taperTube(CA, () => 0.11, 140, 14), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x4f8fef).multiplyScalar(0.35), roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false, emissive: 0x0c2448, emissiveIntensity: 0.5 }));
  sec.add(caBand);
  const alv = new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3(CA.getPoints(20).slice(0, 18).map((p) => { const c = V3(0.35, 0.05, 0); return p.clone().sub(c).multiplyScalar(1.18).add(c); })), () => 0.04, 120, 8), tissue(new THREE.Color(0xf0e8d8).multiplyScalar(0.45)));
  sec.add(alv);
  const DGc = V3(-0.42, -0.2, 0), DGR = 0.5;
  const DG = new THREE.CatmullRomCurve3(Array.from({ length: 13 }, (_, i) => { const a = (200 + i / 12 * 230) * Math.PI / 180; return V3(DGc.x + Math.cos(a) * DGR, DGc.y + Math.sin(a) * DGR * 0.85, 0); }));
  sec.add(new THREE.Mesh(taperTube(DG, () => 0.075, 100, 12), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xff6a5a).multiplyScalar(0.3), roughness: 0.5, transparent: true, opacity: 0.5, depthWrite: false, emissive: 0x3a0c08, emissiveIntensity: 0.5 })));
  const EC = new THREE.CatmullRomCurve3([P2(1.85, -0.85), P2(2.3, -1.15), P2(2.85, -1.35)]);
  sec.add(new THREE.Mesh(taperTube(EC, () => 0.14, 40, 12), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x5cc48a).multiplyScalar(0.35), roughness: 0.5, transparent: true, opacity: 0.6, depthWrite: false, emissive: 0x0c3a1c, emissiveIntensity: 0.5 })));
  // клетки: пирамиды (синие) в аммоновом роге, зёрна (красные) в зубчатой извилине
  const pyrArr = [], grArr = [], cenC = V3(0.35, 0.05, 0);
  const CAP = [];
  for (let i = 0; i < 46; i++) {
    const u = 0.03 + i / 46 * 0.94, p = CA.getPointAt(u).add(V3(0, 0, rand(-0.06, 0.06))), dir = cenC.clone().sub(p).setZ(0).normalize();
    const big = u > 0.62; const s = big ? 0.055 : 0.04;
    const cone = new THREE.ConeGeometry(s, s * 2.6, 8); cone.translate(0, s * 1.3, 0); cone.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), dir)); cone.translate(p.x, p.y, p.z); pyrArr.push(cone);
    pyrArr.push(taperTube(new THREE.CatmullRomCurve3([p.clone().addScaledVector(dir, s * 2.4), p.clone().addScaledVector(dir, 0.22).add(randUnit().multiplyScalar(0.03)), p.clone().addScaledVector(dir, 0.36).add(randUnit().multiplyScalar(0.05))]), (uu) => s * 0.25 * (1 - uu * 0.7), 10, 4));
    CAP.push({ u, p, dir });
  }
  for (let i = 0; i < 80; i++) { const u = rnd(), p = DG.getPointAt(u).add(V3(rand(-0.04, 0.04), rand(-0.04, 0.04), rand(-0.07, 0.07))); const g = new THREE.SphereGeometry(0.026, 8, 6); g.translate(p.x, p.y, p.z); grArr.push(g); }
  const pyrMat = tissue(new THREE.Color(0x6fa8ff).multiplyScalar(0.55), { emissive: 0x0c2a60, emissiveIntensity: 0.7 });
  const grMat = tissue(new THREE.Color(0xff6a5a).multiplyScalar(0.6), { emissive: 0x501008, emissiveIntensity: 0.8 });
  sec.add(new THREE.Mesh(mergeGeometries(pyrArr), pyrMat), new THREE.Mesh(mergeGeometries(grArr), grMat));
  // пути трисинаптической петли
  const caAt = (u) => CA.getPointAt(u);
  const PATHS = {
    perf: { color: '#5CC48A', curves: [0, 1, 2, 3, 4].map((k) => new THREE.CatmullRomCurve3([EC.getPointAt(0.5 + k * 0.1).add(V3(0, 0, k * 0.04 - 0.08)), P2(1.4, -0.75 + k * 0.03), P2(0.6, -0.55), DG.getPointAt(0.55 + k * 0.08).add(V3(0.05, 0.12, 0))])) },
    mossy: { color: '#FF8A5C', curves: [0, 1, 2, 3].map((k) => new THREE.CatmullRomCurve3([DG.getPointAt(0.2 + k * 0.2), DGc.clone().add(V3(-0.05 + k * 0.03, 0.05, 0)), caAt(0.86 - k * 0.04).addScaledVector(cenC.clone().sub(caAt(0.86 - k * 0.04)).normalize(), 0.12)])) },
    schaf: { color: '#F4C542', curves: [0, 1, 2, 3].map((k) => { const a = caAt(0.72 + k * 0.03), b = caAt(0.12 + k * 0.05); return new THREE.CatmullRomCurve3([a, a.clone().lerp(cenC, 0.35), P2(0.45, 0.42 - k * 0.04), b.clone().lerp(cenC, 0.3), b.clone().lerp(cenC, 0.12)]); }) },
    out: { color: '#C77DFF', curves: [new THREE.CatmullRomCurve3([caAt(0.15), caAt(0.05), P2(1.85, -0.85), EC.getPointAt(0.6)])] },
  };
  const pathMats = {};
  Object.entries(PATHS).forEach(([k, p]) => { const f = flowTubeMat(p.color, 0.6, 1.4); f.uniforms.uOn.value = 0.35; pathMats[k] = f; p.curves.forEach((c) => sec.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, k === 'mossy' ? 0.018 : 0.011, 5), f))); });
  // синапсы Шаффера на CA1 (растут при ДВП)
  const boutons = PATHS.schaf.curves.map((c) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), new THREE.MeshBasicMaterial({ color: 0xf4c542 })); m.position.copy(c.getPointAt(1)); sec.add(m); return m; });
  const fx = new Sparks(1400, 0.07); scene.add(fx.obj);

  const st = { t: 0, mode: 'papez', sel: null, labels: true, rot: false, fly: null, circT: -99, loopT: -99, w: 1, tet: -99, pulses: [], trace: [], msg: null, olf: false, nPulse: 0 };
  function select(id) {
    st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); st.msg = null;
    PZ_PARTS.forEach((p) => PART[p.id].mats.forEach((m) => { m.opacity = !st.sel || st.sel === p.id ? 1 : 0.15; m.depthWrite = !st.sel || st.sel === p.id; m.emissiveIntensity = st.sel === p.id ? 0.45 : 0.05; m.needsUpdate = true; }));
    refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null;
    brain.visible = m === 'papez'; sec.visible = m === 'sec'; st.fly = VIEW[m];
    refs.setInfo && refs.setInfo();
  }
  function circuit() { if (st.mode !== 'papez') setMode('papez'); select('all'); st.circT = st.t; st.msg = TXT.circ; refs.setInfo(); }
  function stim() { if (st.mode !== 'sec') setMode('sec'); st.loopT = st.t; st.pulses.push({ t: st.t + 0.9 + 0.55 + 0.55, w: st.w }); st.nPulse++; st.msg = st.w > 1.2 ? TXT.after : TXT.stim; refs.setInfo(); }
  function tetanus() { if (st.mode !== 'sec') setMode('sec'); st.tet = st.t; st.msg = TXT.ltp; refs.setInfo(); }
  const CA1i = CAP.filter((c) => c.u < 0.4), CA3i = CAP.filter((c) => c.u > 0.65);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    flows.forEach((f) => { f.uniforms.uTime.value = t; }); Object.values(pathMats).forEach((f) => { f.uniforms.uTime.value = t; });
    // круг Пейпеза
    const kc = t - st.circT;
    if (kc > 0 && kc < CIRC_T * 2) {
      const lap = kc % CIRC_T; let acc = 0;
      CIRC.forEach((s, i) => { const u = (lap - acc) / s.d; acc += s.d; const on = u > 0 && u < 1; flows[i].uniforms.uOn.value = Math.max(flows[i].uniforms.uOn.value * 0.97, on ? 1 : 0.25);
        PART[s.id].mats.forEach((m) => { m.emissiveIntensity = on ? 0.7 : (st.sel === s.id ? 0.45 : 0.05); });
        if (on) for (let j = 0; j < 3; j++) fx.spawn(s.c.getPointAt(u).add(randUnit().multiplyScalar(0.015)), randUnit().multiplyScalar(0.03), new THREE.Color(PART[s.id].color), 0.6, 2, 2); });
    } else if (kc > CIRC_T * 2 && kc < CIRC_T * 2 + 0.1) flows.forEach((f) => { f.uniforms.uOn.value = 0.25; });
    // тетанус: 8 залпов
    const kt = t - st.tet;
    if (kt > 0 && kt < 2.4) { const n = Math.floor(kt / 0.15); if (n !== st.lastTet && n < 14) { st.lastTet = n; st.loopT = t - 0.9 - 0.55; st.pulses.push({ t: t + 0.55, w: st.w, tet: true }); } }
    if (st.tet > 0 && kt > 2.4 && st.w < 2.2) { st.w = Math.min(2.2, st.w + dt * 0.8); }
    boutons.forEach((b) => { b.scale.setScalar(0.8 + (st.w - 1) * 0.9); b.material.color.setHSL(0.12, 1, 0.45 + (st.w - 1) * 0.2); });
    pathMats.schaf.uniforms.uOn.value = 0.35 + (st.w - 1) * 0.4;
    // трисинаптическая петля
    const kl = t - st.loopT, seq = [['perf', 0.9], ['mossy', 0.55], ['schaf', 0.55], ['out', 0.6]];
    let acc = 0; if (kl > 0 && kl < 3) seq.forEach(([k, d]) => { const u = (kl - acc) / d; acc += d; if (u > 0 && u < 1) PATHS[k].curves.forEach((c) => fx.spawn(c.getPointAt(u), V3(0, 0, 0), new THREE.Color(PATHS[k].color), 0.45, 0, k === 'schaf' ? 1 + (st.w - 1) * 1.2 : 1.6)); });
    grMat.emissiveIntensity = kl > 0.85 && kl < 1.2 ? 2.4 : 0.8; pyrMat.emissiveIntensity = kl > 1.4 && kl < 2.2 ? 1.8 : 0.7;
    // ВПСП в CA1
    let v = 0; st.pulses = st.pulses.filter((p) => t - p.t < 1.5); st.pulses.forEach((p) => { const x = t - p.t; if (x > 0) v += p.w * (x / 0.06) * Math.exp(1 - x / 0.06); });
    st.trace.push([t, v]); while (st.trace.length && t - st.trace[0][0] > 6) st.trace.shift();
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); scopeShow(st.mode === 'sec'); if (st.mode !== 'sec') return;
    const x = (tt) => 8 + (1 - (st.t - tt) / 6) * (w - 16), y0 = hgt - 14, sc = (hgt - 30) / 2.6;
    ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(8, y0 - sc); ctx.lineTo(w - 8, y0 - sc); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineWidth = 2; ctx.strokeStyle = '#F4C542'; ctx.beginPath(); st.trace.forEach(([tt, vv], i) => { const yy = y0 - Math.min(vv, 3.2) * sc; i ? ctx.lineTo(x(tt), yy) : ctx.moveTo(x(tt), yy); }); ctx.stroke();
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#F4C542'; ctx.fillText('ВПСП в CA1', 10, 13); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText('до ДВП', w - 52, y0 - sc - 4);
  }
  const TXT = {
    papez: '<b>Круг Пейпеза</b> — замкнутая петля: гиппокамп → свод → мамиллярные тела → мамиллоталамический тракт → передние ядра таламуса → поясная извилина → парагиппокампальная (энторинальная) кора → снова гиппокамп. Петля позволяет удерживать информацию и перезаписывать кратковременную память в долговременную (работают NMDA-рецепторы). Нажмите на структуру или запустите круг.',
    circ: '<b>Сигнал идёт по кругу Пейпеза.</b> Обход повторяется: так информация «зацикливается» и удерживается часами — гиппокамп хранит память текущего дня, пока она не будет переписана в нейросети новой коры. При двустороннем повреждении гиппокампа новое почти не запоминается.',
    sec: '<b>Поперечный срез гиппокампа</b>. Синие треугольники — пирамидные клетки аммонова рога (поля CA1–CA3), красные точки — зернистые клетки зубчатой извилины. Трисинаптическая петля: <b>перфорантный путь</b> (зелёный) из энторинальной коры → зёрна зубчатой извилины → <b>мшистые волокна</b> (оранжевые) → пирамиды CA3 → <b>коллатерали Шаффера</b> (жёлтые) → пирамиды CA1 → субикулум и энторинальная кора (фиолетовый). Нажмите «Стимул».',
    stim: '<b>Одиночный стимул.</b> Залп проходит три синапса подряд. Справа — возбуждающий постсинаптический потенциал (ВПСП) в CA1: столько отвечает CA1 до обучения. Теперь подайте «Тетанус».',
    ltp: '<b>Тетанус</b> — короткая серия частых залпов. Пирамиды CA1 сильно деполяризуются, NMDA-рецепторы открываются, кальций входит в шипики — синапсы Шаффера усиливаются (жёлтые бутоны растут). Это <b>долговременная потенциация</b>, клеточная основа памяти. Подайте ещё один одиночный стимул.',
    after: '<b>После ДВП</b> тот же одиночный стимул вызывает в CA1 заметно больший ответ: синапс «запомнил» тренировку. Так в гиппокампе прописываются карты знакомых мест и события дня.',
  };
  const labels = [
    ...PZ_PARTS.map((p) => ({ text: p.name, pos: { hip: V3(-0.32, -0.2, 0.62), fx: V3(-0.2, 0.36, 0.12), mam: V3(0.12, -0.7, 0.12), ant: V3(0.32, 0.18, 0.22), cing: V3(0.1, 0.78, 0.12), ent: V3(-0.1, -0.74, 0.5), amy: V3(0.55, -0.28, 0.6), olf: V3(1.24, -0.62, 0.2) }[p.id], color: p.color, show: () => st.labels && st.mode === 'papez' && (!st.sel || st.sel === p.id) })),
    { text: 'мозолистое тело', pos: V3(-0.2, 0.5, 0.0), color: '#efe8dc', show: () => st.labels && st.mode === 'papez' && !st.sel },
    { text: 'таламус', pos: V3(-0.1, -0.05, 0.4), color: '#B9A4FF', show: () => st.labels && st.mode === 'papez' && !st.sel },
    { text: 'CA1', pos: CA.getPointAt(0.2).add(V3(0.2, 0, 0.1)), color: '#86B6FF', show: () => st.labels && st.mode === 'sec' },
    { text: 'CA2', pos: CA.getPointAt(0.5).add(V3(0, 0.18, 0.1)), color: '#86B6FF', show: () => st.labels && st.mode === 'sec' },
    { text: 'CA3', pos: CA.getPointAt(0.76).add(V3(-0.2, 0.05, 0.1)), color: '#86B6FF', show: () => st.labels && st.mode === 'sec' },
    { text: 'зубчатая извилина', pos: DG.getPointAt(0.5).add(V3(-0.1, -0.12, 0.1)), color: '#FF8A7A', show: () => st.labels && st.mode === 'sec' },
    { text: 'субикулум', pos: V3(1.95, -0.6, 0.1), color: '#C77DFF', show: () => st.labels && st.mode === 'sec' },
    { text: 'энторинальная кора', pos: V3(2.5, -1.0, 0.15), color: '#5CC48A', show: () => st.labels && st.mode === 'sec' },
    { text: 'перфорантный путь', pos: V3(1.0, -0.55, 0.12), color: '#5CC48A', show: () => st.labels && st.mode === 'sec' },
    { text: 'мшистые волокна', pos: DGc.clone().add(V3(-0.35, 0.22, 0.1)), color: '#FF8A5C', show: () => st.labels && st.mode === 'sec' },
    { text: 'коллатерали Шаффера', pos: V3(0.25, 0.48, 0.12), color: '#F4C542', show: () => st.labels && st.mode === 'sec' },
    { text: 'нижний рог желудочка', pos: V3(-0.2, 1.4, 0.1), color: '#6fb4ff', show: () => st.labels && st.mode === 'sec' },
  ];
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'papez') select(id); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'papez' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'papez', label: 'Круг Пейпеза' }, { id: 'sec', label: 'Срез гиппокампа' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...PZ_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'papez') setMode('papez'); select(v); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    const reset = button('Сброс ДВП', () => { st.w = 1; st.tet = -99; st.msg = null; refs.setInfo(); });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1 · 2', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 460px' }, h('div', { class: 'glabel' }, 'Структуры', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Опыт', 'C · S · T', button('Круг Пейпеза', circuit, true), button('Стимул', stim), button('Тетанус (ДВП)', tetanus), reset), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('papez'); return true; } if (k === '2') { setMode('sec'); return true; }
    if (k === 'c' || k === 'с') { circuit(); return true; } if (k === 's' || k === 'ы') { stim(); return true; } if (k === 't' || k === 'е') { tetanus(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'sec' ? [['Сила синапсов Шаффера', '×' + st.w.toFixed(1), ''], ['Синапсов в петле', 3, '']] : [['Звеньев круга', 6, ''], ['Новая кора', '≈96', '% коры']]; }
  const self = {
    labelBg: true, mobZoom: 0.6, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8A5C',
    kicker: 'Мозг · старая кора', title: 'Гиппокамп и память',
    lede: 'Гиппокамп держит память текущего дня: сигнал бегает по кругу Пейпеза и по трисинаптической петле, а частая стимуляция усиливает синапсы — так рождается память.',
    notes: `
      <div><h2>Три вида коры</h2>
        <p><b>Неокортекс</b> — почти 96% коры у человека, шесть слоёв. <b>Палеокортекс</b> (древняя кора) — обонятельный мозг: луковицы, тракты, обонятельные треугольники и бугорки, периамигдалярная область. <b>Архикортекс</b> (старая кора) — гиппокамп, зубчатая извилина, субикулум, часть поясной и парагиппокампальной извилин.</p>
        <h3>Пространственная память</h3>
        <p>У крыс, осваивающих лабиринт, его структура буквально «прописывается» в гиппокампе. Человек благодаря гиппокампу обходит яму на незнакомой дороге: гиппокамп по ходу движения извлекает знания из долговременной памяти и корректирует путь.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Положение гиппокампа в височной доле, свод вокруг таламуса, мамиллярные тела.</li><li>Порядок звеньев круга Пейпеза.</li><li>Трисинаптическая петля и долговременная потенциация в CA1.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Структуры упрощены, круг показан для одного полушария.</li><li>Масштаб времени ДВП сжат: в жизни потенциация держится часы и дни.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code> · <code>2</code> режим</li><li><code>C</code> круг Пейпеза</li><li><code>S</code> стимул</li><li><code>T</code> тетанус</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeHippo };
