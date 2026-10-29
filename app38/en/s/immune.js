import { Sparks, THREE, V3, __set_rnd, bodyShell, branchTree, button, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ЛИМФАТИЧЕСКАЯ И ИММУННАЯ СИСТЕМА
   ========================================================= */
const IM_PARTS = [
  { id: 'lv', name: 'Lymphatic vessels', color: '#9FE8C0', text: '<b>Lymphatic vessels</b> collect the fluid that has leaked out of capillaries into the tissues (about 2–3 L per day), along with proteins, fats from the intestine and microbes. Lymph flows slowly and only toward the heart: it is pushed by muscle contractions, and valves prevent backflow. The thoracic duct empties into the left subclavian vein.' },
  { id: 'ln', name: 'Lymph nodes', color: '#7FD6FF', text: '<b>Lymph nodes</b> (500–700 of them) are filters along the lymph route and meeting places where lymphocytes encounter invaders. The largest groups are the cervical, axillary, inguinal and mesenteric nodes. During an infection a node swells and becomes tender: lymphocytes are multiplying inside it.' },
  { id: 'spl', name: 'Spleen', color: '#B0506A', text: '<b>The spleen</b> (about 150 g) filters blood, not lymph: it removes old red blood cells, stores a reserve of platelets and monocytes, and in its white pulp lymphocytes meet antigens from the blood.' },
  { id: 'thym', name: 'Thymus', color: '#7FD6C8', text: '<b>The thymus</b> is a central organ of immunity: this is where T lymphocytes are “trained”. Only those that recognize foreign antigens and do not attack the body’s own survive — up to 95% die during selection.' },
  { id: 'bm', name: 'Bone marrow', color: '#E06A6A', text: '<b>Red bone marrow</b> (in flat bones, vertebrae and the ends of long bones) is the factory of all blood cells: red blood cells, platelets and white blood cells. B lymphocytes mature here.' },
  { id: 'galt', name: 'Gut lymphoid tissue', color: '#E8C070', text: '<b>Gut lymphoid tissue</b> is the largest part of the immune system: the intestinal wall holds more lymphocytes than all lymph nodes together. Clusters of follicles in the ileum are called <b>Peyer\'s patches</b>: special M cells above them let samples of gut contents in, and the immune system learns to tell food and friendly bacteria from pathogens. Plasma cells that secrete IgA antibodies into the gut lumen also come from here.' },
  { id: 'ton', name: 'Tonsils', color: '#F2A0B0', text: '<b>The tonsils</b> form a ring around the entrance to the pharynx and meet microbes arriving with air and food.' },
];
function makeImmune() {
  const MOBI = matchMedia('(max-width:700px)').matches;
  __set_rnd(mulberry(1717));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06080a); scene.environment = envTex;
  labLights(scene, 0x7fd6ff);
  const VIEW = { sys: MOBI ? flyTarget(V3(0.0, 0.8, 0), V3(2.75, 1.7, 14.6)) : flyTarget(V3(-0.9, 0.8, 0), V3(1.85, 1.7, 14.6)), node: flyTarget(V3(30, -0.8, 0), V3(31.6, 0.6, 8.0)), resp: flyTarget(V3(30, -0.8, 0), V3(28.4, 0.7, 8.0)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.sys.pos);
  const controls = makeControls(camera, VIEW.sys.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  const body = new THREE.Group(); scene.add(body);
  const shell = bodyShell(body, { rim: 0.34 });
  // зоны оттока: правый лимфатический проток (правая половина головы, шеи, груди и правая рука) и грудной проток (всё остальное)
  const zoneM = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.13, depthWrite: false });
  const zones = new THREE.Group(); zones.visible = false; body.add(zones);
  const Z_R = new THREE.Color(0x4ab8ff), Z_T = new THREE.Color(0xffb040);
  shell.meshes.filter((m, i) => i % 2 === 0).forEach((m) => { const g = m.geometry.clone(), P = g.attributes.position, col = new Float32Array(P.count * 3);
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), c = x < 0 && (y > 1.5 || (x < -0.95 && y > 0.9)) ? Z_R : Z_T; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); zones.add(new THREE.Mesh(g, zoneM)); });
  const PART = Object.fromEntries(IM_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = body) => { const m = organMat(PART[id].color, o.k ?? 0.45, { emissiveIntensity: 0.1, ...(o.mat || {}) }); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- лимфатическая сеть ---------- */
  const DUCT_L = V3(0.32, 2.88, 0.08), DUCT_R = V3(-0.32, 2.88, 0.08);
  const THOR = new THREE.CatmullRomCurve3([V3(0.05, 0.9, -0.28), V3(0.02, 1.6, -0.36), V3(0.0, 2.4, -0.34), V3(0.12, 2.95, -0.1), DUCT_L]);
  const LYM = [THOR];
  const branch = (pts) => LYM.push(new THREE.CatmullRomCurve3(pts));
  [1, -1].forEach((s) => {
    branch([V3(0.36 * s, -2.0, 0.18), V3(0.38 * s, -0.9, 0.2), V3(0.36 * s, -0.15, 0.2), V3(0.15 * s, 0.4, -0.1), V3(0.05, 0.9, -0.28)]);         // нога → пах → цистерна
    branch([V3(1.45 * s, 1.2, 0.05), V3(1.36 * s, 1.9, 0.0), V3(1.0 * s, 2.55, 0.0), V3(0.6 * s, 2.8, 0.05), s > 0 ? DUCT_L : DUCT_R]);              // рука → подмышка
    branch([V3(0.18 * s, 4.0, 0.05), V3(0.2 * s, 3.55, 0.08), V3(0.22 * s, 3.2, 0.06), s > 0 ? DUCT_L : DUCT_R]);                                    // голова → шея
  });
  branch([V3(0.0, 0.75, 0.2), V3(0.0, 0.8, 0.0), V3(0.05, 0.9, -0.28)]);
  const lvG = []; LYM.forEach((c, i) => { lvG.push(taperTube(c, () => (i === 0 ? 0.04 : 0.026), 80, 6)); for (let k = 0; k < 6; k++) { const arr = []; branchTree(arr, c.getPointAt(0.1 + k * 0.14), randUnit(), 0.22, 0.008, 1, { segs: 6, rad: 4 }); lvG.push(...arr); } });
  add('lv', mergeGeometries(lvG), { k: 0.4, mat: { transparent: true, opacity: 0.75 } });
  add('lv', ell3(0.055, 0.13, 0.05, V3(0.05, 0.98, -0.28)), { k: 0.5 });   // цистерна грудного протока (L1–L2)
  // венозные углы: внутренняя яремная + подключичная → плечеголовная → верхняя полая вена
  const VEN_ANG = (() => { const g = []; [1, -1].forEach((s) => { const ang = V3(0.33 * s, 2.86, 0.06);
    g.push(tube([V3(0.24 * s, 3.5, 0.1), V3(0.27 * s, 3.15, 0.1), ang], 0.04, 16, 8), tube([V3(0.95 * s, 2.82, 0.0), V3(0.62 * s, 2.9, 0.04), ang], 0.035, 16, 8),
      tube([ang, V3(0.12 * s - 0.02, 2.74, 0.12), V3(-0.1, 2.62, 0.14)], 0.045, 16, 8)); });
    g.push(tube([V3(-0.1, 2.62, 0.14), V3(-0.1, 2.38, 0.14), V3(-0.08, 2.15, 0.1)], 0.055, 12, 8)); return mergeGeometries(g); })();
  body.add(new THREE.Mesh(VEN_ANG, organMat('#5C7CE8', 0.5, { transparent: true, opacity: 0.8 })));
  const NODES = [];
  const cluster = (c, n, r) => { for (let i = 0; i < n; i++) { const p = c.clone().add(randUnit().multiplyScalar(r * rnd())); const g = ell3(0.05 + rnd() * 0.025, 0.034 + rnd() * 0.02, 0.04, p, 14); add('ln', g, { k: 0.6, mat: { emissiveIntensity: 0.3 } }); NODES.push(p); } };
  [1, -1].forEach((s) => { cluster(V3(0.2 * s, 3.4, 0.08), 6, 0.12); cluster(V3(0.85 * s, 2.6, 0.0), 6, 0.12); cluster(V3(0.34 * s, -0.12, 0.2), 6, 0.1); });
  cluster(V3(0.0, 0.8, 0.1), 9, 0.18); cluster(V3(0.0, 2.35, -0.05), 5, 0.12);
  [1, -1].forEach((s) => { cluster(V3(0.13 * s, 0.6, -0.2), 5, 0.1); cluster(V3(0.25 * s, 0.2, 0.0), 4, 0.08); });   // поясничные и подвздошные
  // конец подвздошной кишки (призрак) с пейеровыми бляшками
  const ILE = new THREE.CatmullRomCurve3([V3(0.15, 0.55, 0.32), V3(-0.05, 0.45, 0.36), V3(-0.2, 0.32, 0.34), V3(-0.33, 0.3, 0.3), V3(-0.42, 0.4, 0.26)]);
  body.add(new THREE.Mesh(taperTube(ILE, () => 0.06, 40, 12), new THREE.MeshPhysicalMaterial({ color: 0xe8b0a0, roughness: 0.5, transparent: true, opacity: 0.16, depthWrite: false })));
  for (let i = 0; i < 5; i++) { const u = 0.1 + i * 0.19, p = ILE.getPointAt(u), tg = ILE.getTangentAt(u), q = new THREE.Quaternion().setFromUnitVectors(V3(1, 0, 0), tg); const g = ell3(0.05, 0.03, 0.014); g.applyQuaternion(q); g.translate(p.x, p.y, p.z + 0.055); add('galt', g, { k: 0.5 }); }
  const splG = displaceGeo(new THREE.SphereGeometry(1, 32, 24), (v) => { v.set(v.x * 0.1, v.y * 0.18, v.z * 0.07); if (v.x < 0) v.x *= 0.5; }); splG.rotateZ(-0.4); splG.translate(0.68, 1.38, -0.18); add('spl', splG, { k: 0.45 });
  [1, -1].forEach((s) => add('thym', ell3(0.08, 0.16, 0.05, V3(0.06 * s, 2.72, 0.3))));
  [1, -1].forEach((s) => add('ton', ell3(0.03, 0.05, 0.025, V3(0.07 * s, 3.78, 0.1))));
  // красный костный мозг взрослого: плоские кости (таз, грудина, позвонки) и верхние концы бёдер
  [1, -1].forEach((s) => { add('bm', tube([V3(0.48 * s, -0.25, 0.0), V3(0.49 * s, -0.55, 0.01), V3(0.5 * s, -0.8, 0.02)], (u) => 0.055 * (1 - 0.5 * u), 12, 10), { k: 0.35, mat: { transparent: true, opacity: 0.5 } }); add('bm', ell3(0.08, 0.1, 0.08, V3(0.48 * s, -0.3, 0.0)), { k: 0.5 });
    const wing = ell3(0.28, 0.2, 0.025); wing.rotateZ(0.3 * s); wing.rotateY(-0.75 * s); wing.translate(0.42 * s, 0.3, -0.08); add('bm', wing, { k: 0.35, mat: { transparent: true, opacity: 0.22 } }); });   // крылья подвздошных костей
  const BMP = [V3(0.48, -0.4, 0), V3(-0.48, -0.4, 0), V3(0.42, 0.3, -0.12), V3(-0.42, 0.3, -0.12), V3(0, 2.5, 0.5), V3(0, 1.2, -0.48), V3(0, 2.2, -0.48)];   // где рождаются клетки крови
  add('bm', tube([V3(0, 2.85, 0.5), V3(0, 2.2, 0.52)], 0.04, 10, 8), { k: 0.35, mat: { transparent: true, opacity: 0.5 } });   // грудина
  add('bm', mergeGeometries(Array.from({ length: 14 }, (_, i) => { const g = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10); g.translate(0, 0.45 + i * 0.18, -0.48); return g; })), { k: 0.35, mat: { transparent: true, opacity: 0.45 } });   // тела позвонков
  /* ---------- лимфоузел крупно ---------- */
  const node = new THREE.Group(); node.position.set(30, 0, 0); scene.add(node); node.visible = false;
  const nodeG = displaceGeo(new THREE.SphereGeometry(1, 64, 48), (v) => { let x = v.x * 1.5, y = v.y, z = v.z * 0.8; if (x < -0.6) x += 0.45 * Math.exp(-((y / 0.35) ** 2)) * smooth(-0.6, -1.4, x); v.set(x, y, z); });
  node.add(new THREE.Mesh(nodeG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xc8e8d8).multiplyScalar(0.35), roughness: 0.4, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, clearcoat: 0.6 })), new THREE.Mesh(nodeG, glassMat(0xb8f0d8, { rim: 0.45, base: 0.01, pow: 2 })));
  // фолликулы (B-зоны) по периферии, паракортекс (T-зона), мозговые тяжи
  const FOL = []; for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.3 + rand(-0.05, 0.05), r = 0.68; const p = V3(Math.cos(a) * r * 1.45, Math.sin(a) * r, rand(-0.25, 0.25)); if (p.x < -0.5) continue;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x5e8fef).multiplyScalar(0.45), emissive: 0x1a3a8a, emissiveIntensity: 0.4, roughness: 0.4, transparent: true, opacity: 0.75 })); m.position.copy(p); node.add(m);
    const gc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.35 })); gc.position.copy(p); node.add(gc); FOL.push({ m, gc, p }); }
  const para = new THREE.Mesh(ell3(0.75, 0.45, 0.45, V3(0.25, 0, 0)), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x5cc48a).multiplyScalar(0.35), emissive: 0x0c3a1c, emissiveIntensity: 0.35, transparent: true, opacity: 0.35, depthWrite: false })); node.add(para);
  const cordG = []; for (let i = 0; i < 7; i++) cordG.push(tube([V3(0.0, (i - 3) * 0.12, 0), V3(-0.45, (i - 3) * 0.08, rand(-0.1, 0.1)), V3(-0.85, (i - 3) * 0.03, 0)], 0.035, 20, 6));
  node.add(new THREE.Mesh(mergeGeometries(cordG), organMat('#E8B0C0', 0.4, { transparent: true, opacity: 0.6 })));
  const AFF = [0.9, 0.3, -0.3, -0.9].map((a) => new THREE.CatmullRomCurve3([V3(Math.cos(a) * 2.4, Math.sin(a) * 1.6, 0.2), V3(Math.cos(a) * 1.75, Math.sin(a) * 1.15, 0.1), V3(Math.cos(a) * 1.45, Math.sin(a) * 0.98, 0.0)]));
  const EFF = new THREE.CatmullRomCurve3([V3(-1.0, 0.0, 0), V3(-1.7, -0.15, 0.1), V3(-2.5, -0.4, 0.2)]);
  AFF.forEach((c) => node.add(new THREE.Mesh(taperTube(c, () => 0.05, 20, 8), organMat('#9FE8C0', 0.5, { transparent: true, opacity: 0.8 }))));
  node.add(new THREE.Mesh(taperTube(EFF, () => 0.07, 20, 8), organMat('#9FE8C0', 0.5, { transparent: true, opacity: 0.8 })));
  node.add(new THREE.Mesh(tube([V3(-2.4, 0.35, -0.2), V3(-1.5, 0.2, -0.1), V3(-0.95, 0.12, 0)], 0.05, 20, 8), organMat('#E0605A', 0.5)));
  node.add(new THREE.Mesh(tube([V3(-0.95, -0.12, -0.05), V3(-1.5, -0.3, -0.2), V3(-2.4, -0.55, -0.3)], 0.06, 20, 8), organMat('#6C86E0', 0.5)));
  // клетки: бактерии, антитела, макрофаги
  const bacG = new THREE.CapsuleGeometry(0.035, 0.09, 4, 8), bacM = new THREE.MeshPhysicalMaterial({ color: 0x9ad04a, emissive: 0x2a4a08, emissiveIntensity: 0.6, roughness: 0.4 });
  const BAC = []; const bacI = new THREE.InstancedMesh(bacG, bacM, 120); bacI.count = 0; node.add(bacI);
  const abG = (() => { const a = []; [[0, -0.05, 0, 0.05], [0.03, 0.03, 0.6, 0.04], [-0.03, 0.03, -0.6, 0.04]].forEach(([x, y, r, l]) => { const g = new THREE.CylinderGeometry(0.008, 0.008, l * 2, 5); g.rotateZ(r); g.translate(x, y, 0); a.push(g); }); return mergeGeometries(a); })();
  const abI = new THREE.InstancedMesh(abG, new THREE.MeshBasicMaterial({ color: 0xffd34a }), 260); abI.count = 0; node.add(abI); const AB = [];
  const mac = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(0.16, 32, 24), (v) => v.multiplyScalar(1 + 0.25 * noise3(v.x * 18, v.y * 18, v.z * 18))), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe0a0ff).multiplyScalar(0.5), emissive: 0x30104a, emissiveIntensity: 0.5, roughness: 0.4, transparent: true, opacity: 0.85 })); mac.position.set(-0.5, 0.35, 0.3); node.add(mac);
  const dc = new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(0.1, 3), (v) => { const n = v.clone().normalize(); v.addScaledVector(n, 0.08 * Math.max(0, Math.sin(n.x * 9) * Math.sin(n.y * 9))); }), new THREE.MeshPhysicalMaterial({ color: 0xffb070, emissive: 0x5a2a08, emissiveIntensity: 0.6, roughness: 0.4 })); dc.visible = false; node.add(dc);
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'sys', sel: null, labels: true, rot: false, fly: null, msg: null, infT: -99, mem: false, second: false, titre: [], days: 0, phase: '' };
  function select(id) { const was = st.sel; st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(IM_PARTS.map((p) => PART[p.id]), st.sel); st.msg = null; if (st.sel === 'galt') st.fly = flyTarget(V3(-0.2, 0.15, 0.35), V3(-0.75, 0.75, 3.6)); else if (was === 'galt') st.fly = VIEW.sys; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; body.visible = m === 'sys'; node.visible = m !== 'sys'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  function infect() { if (st.mode !== 'resp') setMode('resp'); st.second = st.mem; st.infT = st.t; st.titre = []; BAC.length = 0; AB.length = 0; for (let i = 0; i < 60; i++) BAC.push({ c: AFF[i % 4], u: -rnd() * 1.5, alive: 1, p: V3(0, 0, 0), q: new THREE.Quaternion().setFromAxisAngle(randUnit(), rnd() * 6) }); st.msg = st.second ? TXT.second : TXT.first; refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'sys') select(id); });
  const DAY = 0.6; // секунд на «сутки»
  const titreAt = (d, second) => second ? 9 * Math.max(0, 1 - Math.exp(-Math.max(0, d - 1.5) / 1.4)) * Math.exp(-Math.max(0, d - 8) / 18) : 1.0 * Math.max(0, 1 - Math.exp(-Math.max(0, d - 5) / 2.6)) * Math.exp(-Math.max(0, d - 14) / 8);
  const mtx = new THREE.Matrix4(), C_L = new THREE.Color(0xc8ffe0), C_B = new THREE.Color(0x8fb8ff), C_T = new THREE.Color(0x7fe0a0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    if (st.mode === 'sys') { for (let j = 0; j < 4; j++) { const c = LYM[Math.floor(rnd() * LYM.length)]; fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_L, 0.5, 0, 1.2); } if (st.sel === 'bm' && rnd() < 0.5) fx.spawn(BMP[Math.floor(rnd() * BMP.length)].clone().add(randUnit().multiplyScalar(0.12)), randUnit().multiplyScalar(0.1), new THREE.Color(0xff6a6a), 0.8, 1, 1.2); }
    if (st.mode !== 'sys') {
      AFF.forEach((c) => { if (rnd() < 0.3) fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_L, 0.4, 0, 1); }); if (rnd() < 0.4) fx.spawn(EFF.getPointAt(rnd()), V3(0, 0, 0), C_L, 0.4, 0, 1);
      if (rnd() < 0.3) { const f = FOL[Math.floor(rnd() * FOL.length)]; fx.spawn(f.p.clone().add(randUnit().multiplyScalar(0.2)), randUnit().multiplyScalar(0.05), C_B, 0.6, 1, 0.9); }
      if (rnd() < 0.3) fx.spawn(V3(0.25, 0, 0).add(randUnit().multiplyScalar(0.4)), randUnit().multiplyScalar(0.05), C_T, 0.6, 1, 0.9);
    }
    // иммунный ответ
    const d = (t - st.infT) / DAY; st.days = d;
    if (d >= 0 && d < 40) {
      const tit = titreAt(d, st.second); st.titre.push([d, tit]);
      const phase = d < 2 ? 'bac' : d < (st.second ? 2.5 : 5) ? 'present' : 'ab';
      if (phase !== st.phase) { st.phase = phase; if (st.mode === 'resp') { st.msg = phase === 'bac' ? (st.second ? TXT.second : TXT.first) : phase === 'present' ? TXT.present : (st.second ? TXT.ab2 : TXT.ab); refs.setInfo(); } }
      dc.visible = d > 1 && d < 6; if (dc.visible) { const u = Math.min(1, (d - 1) / 1.5); dc.position.copy(AFF[0].getPointAt(Math.min(1, u))).lerp(V3(0.25, 0.1, 0.2), smooth(0.6, 1, u)); dc.rotation.y += dt; }
      FOL.forEach((f) => { const g = Math.min(1, tit / (st.second ? 9 : 1)); f.gc.scale.setScalar(1 + 1.2 * g); f.gc.material.opacity = 0.35 + 0.5 * g; f.m.material.emissiveIntensity = 0.4 + 1.2 * g; });
      const abRate = tit * (st.second ? 2.5 : 6) * dt; for (let k = 0; k < abRate * 3 && AB.length < 260; k++) { const f = FOL[Math.floor(rnd() * FOL.length)]; AB.push({ p: f.p.clone(), v: randUnit().multiplyScalar(0.25).add(V3(-0.15, 0, 0)), r: randUnit(), a: rnd() * 6, life: 3 }); }
      if (d > 38) { st.mem = true; }
    }
    // бактерии
    let n = 0; BAC.forEach((b) => { if (b.alive <= 0) return; b.u += dt * 0.25; const u = Math.min(1, Math.max(0, b.u)); if (b.u < 0) return; if (u < 1) b.p.copy(b.c.getPointAt(u)); else b.p.add(randUnit().multiplyScalar(dt * 0.15)).lerp(V3(0.2, 0, 0), dt * 0.05);
      const tit = titreAt(d, st.second); if (d > 0 && tit > 0.15 && rnd() < tit * dt * 0.25) b.alive -= 0.34; if (b.p.distanceTo(mac.position) < 0.35 && rnd() < dt) b.alive = 0;
      mtx.compose(b.p, b.q, V3(1, 1, 1).multiplyScalar(Math.max(0.2, b.alive))); bacI.setMatrixAt(n++, mtx); });
    bacI.count = n; bacI.instanceMatrix.needsUpdate = true;
    let m = 0; for (let i = AB.length - 1; i >= 0; i--) { const a = AB[i]; a.life -= dt; if (a.life <= 0) { AB.splice(i, 1); continue; } a.p.addScaledVector(a.v, dt); a.a += dt * 2; mtx.compose(a.p, new THREE.Quaternion().setFromAxisAngle(a.r, a.a), V3(1.6, 1.6, 1.6)); abI.setMatrixAt(m++, mtx); }
    abI.count = m; abI.instanceMatrix.needsUpdate = true;
    mac.rotation.y += dt * 0.3; mac.position.x = 30 * 0 - 0.5 + 0.15 * Math.sin(t * 0.4);
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode === 'resp' && st.titre.length > 0; scopeShow(on); if (!on) return;
    const x = (d) => 10 + d / 40 * (w - 20), Y = (v) => hgt - 12 - Math.min(1, v / 9.5) * (hgt - 28);
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '500 9px JetBrains Mono, monospace'; [0, 10, 20, 30, 40].forEach((d) => ctx.fillText(d + ' d', x(d) - 8, hgt - 2));
    ctx.strokeStyle = '#FFD34A'; ctx.lineWidth = 2; ctx.beginPath(); st.titre.forEach(([d, v], i) => (i ? ctx.lineTo(x(d), Y(v)) : ctx.moveTo(x(d), Y(v)))); ctx.stroke();
    ctx.fillStyle = '#FFD34A'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText(st.second ? 'antibodies · secondary response' : 'antibodies · primary response', 10, 13);
  }
  const TXT = {
    sys: '<b>The lymphatic and immune system.</b> The central organs are the <b>bone marrow</b> and <b>thymus</b>, where lymphocytes are born and mature. The peripheral organs are the <b>lymph nodes</b>, <b>spleen</b>, tonsils and gut-associated lymphoid tissue: here lymphocytes meet invaders. Lymphatic vessels (green particles) return tissue fluid to the blood. Click an organ.',
    node: '<b>A lymph node.</b> Lymph enters through several afferent vessels (on the convex side), seeps through the node and leaves through the efferent vessel at the hilum. The cortex contains round <b>follicles with B lymphocytes</b> (blue); deeper lies the <b>T zone</b> (green), and in the center are the medullary cords with plasma cells. Macrophages (purple) eat up everything unwanted.',
    resp: '<b>The immune response.</b> Click “Infection” to see the first encounter with a microbe, then repeat it — this time it will be a secondary response.',
    first: '<b>First encounter.</b> Bacteria (green rods) are carried in with the lymph. Nonspecific defense — macrophages — is already at work, but there are many microbes.',
    present: '<b>Antigen presentation.</b> A dendritic cell (orange star) has captured bits of bacteria and brought them to the T zone. Helper T cells that recognize the antigen activate matching B lymphocytes — germinal centers light up in the follicles.',
    ab: '<b>Antibodies.</b> B lymphocytes multiply and turn into plasma cells that release thousands of antibodies per second (yellow Ys). Antibodies clump bacteria together and tag them for macrophages. On first encounter this takes 1–2 weeks — that is why we get sick. Some cells remain as memory cells.',
    zones: '<b>Where lymph drains.</b> <span style="color:#4ab8ff">The right lymphatic duct</span> drains the right half of the head, neck and chest and the right arm. <span style="color:#ffb040">The thoracic duct</span> drains about ¾ of the body: it starts as the cisterna chyli at L1–L2 and empties into the left venous angle, where the jugular and subclavian veins join.',
    second: '<b>Second encounter (or after vaccination).</b> Memory cells recognize the same antigen immediately.',
    ab2: '<b>The secondary response</b> is faster (2–4 days) and many times stronger, and the antibodies are more precise (IgG). The microbe is destroyed before it can cause disease. Vaccination is based on this: a vaccine introduces the immune system to a harmless part of the pathogen.',
  };
  const labels = [
    { text: 'cervical nodes', pos: V3(0.35, 3.45, 0.12), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'axillary', pos: V3(1.05, 2.7, 0.05), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'inguinal', pos: V3(0.55, -0.1, 0.25), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'mesenteric', pos: V3(0.25, 0.75, 0.25), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' && !MOBI },
    { text: 'thoracic duct', pos: V3(0.1, 1.8, -0.35), color: '#9FE8C0', show: () => st.labels && st.mode === 'sys' },
    { text: 'spleen', pos: V3(0.85, 1.4, -0.15), color: '#D0708A', show: () => st.labels && st.mode === 'sys' },
    { text: 'thymus', pos: V3(0.2, 2.75, 0.35), color: '#7FD6C8', show: () => st.labels && st.mode === 'sys' },
    { text: 'tonsils', pos: V3(0.15, 3.82, 0.12), color: '#F2A0B0', show: () => st.labels && st.mode === 'sys' },
    { text: 'bone marrow', pos: V3(0.62, -0.6, 0.05), color: '#E06A6A', show: () => st.labels && st.mode === 'sys' },
    { text: 'mediastinal', pos: V3(0.2, 2.4, -0.05), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' && !MOBI },
    { text: 'lumbar', pos: V3(-0.3, 0.62, -0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' && !MOBI },
    { text: 'iliac', pos: V3(-0.42, 0.18, 0.0), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'cisterna chyli', pos: V3(0.16, 0.98, -0.3), color: '#9FE8C0', show: () => st.labels && st.mode === 'sys' },
    { text: 'left venous angle', pos: V3(0.42, 2.92, 0.08), color: '#8AA6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'right lymphatic duct', pos: V3(-0.55, 3.1, 0.1), color: '#9FE8C0', show: () => st.labels && st.mode === 'sys' && (!st.sel || st.sel === 'lv') },
    { text: 'Peyer\'s patches', pos: V3(-0.25, 0.3, 0.42), color: '#E8C070', show: () => st.labels && st.mode === 'sys' && st.sel === 'galt' },
    { text: 'follicle (B cells)', pos: V3(31.0, 0.8, 0.3), color: '#8FB8FF', show: () => st.labels && st.mode !== 'sys' },
    { text: 'T zone', pos: V3(30.4, -0.1, 0.5), color: '#7FE0A0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'afferent vessels', pos: AFF[0].getPointAt(0.4).add(V3(30.1, 0.1, 0)), color: '#9FE8C0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'efferent vessel', pos: V3(28.0, -0.5, 0.2), color: '#9FE8C0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'macrophage', pos: V3(29.5, 0.55, 0.45), color: '#E0A0FF', show: () => st.labels && st.mode !== 'sys' },
    { text: 'medullary cords', pos: V3(29.4, -0.25, 0.1), color: '#E8B0C0', show: () => st.labels && st.mode !== 'sys' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'sys' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'sys', label: 'Organs' }, { id: 'node', label: 'Lymph node' }, { id: 'resp', label: 'Immune response' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'All' }, ...IM_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'sys') setMode('sys'); select(v); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    const zt = toggle('Drainage zones', () => zones.visible, (v) => { zones.visible = v; if (v && st.mode !== 'sys') setMode('sys'); st.msg = v ? TXT.zones : null; refs.setInfo(); });
    Object.assign(refs, { lab, zt });
    el.append(group('Mode', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 480px' }, h('div', { class: 'glabel' }, 'Organs', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg)),
      group('Experiment', 'I · M', button('Infection', infect, true), button('Reset memory', () => { st.mem = false; st.msg = '<b>Memory reset:</b> the next infection will trigger a primary response again.'; refs.setInfo(); })), group('View', 'Z · R · N', zt, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['sys', 'node', 'resp'][n - 1]); return true; }
    if (k === 'i' || k === 'ш') { infect(); return true; }
    if (k === 'z' || k === 'я') { refs.zt.click(); return true; }
    if (k === 'm' || k === 'ь') { st.mem = false; st.msg = '<b>Memory reset:</b> the next infection will trigger a primary response again.'; refs.setInfo(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'resp' && st.titre.length ? [['Day', Math.min(40, Math.floor(st.days)), ''], ['Memory', st.mem || st.second ? 'yes' : 'no', '']] : [['Lymph nodes', '500–700', ''], ['Lymph', '2–3', 'L/day']]; }
  const self = {
    labelBg: true, mobZoom: 0.6, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Body · immunity', title: 'Lymph and immunity',
    lede: 'A network of vessels and nodes where a trillion lymphocytes patrol the body, recognize what is foreign and remember it for years to come.',
    notes: `
      <div><h2>Two levels of defense</h2>
        <p><b>Innate immunity</b> works immediately and in the same way against everything: skin and mucous membranes, phagocytes (neutrophils, macrophages), inflammation, interferons. <b>Adaptive immunity</b> is specific and has memory: B lymphocytes release antibodies, killer T cells destroy infected cells, helper T cells coordinate the response.</p>
        <h3>Vaccination</h3><p>A vaccine creates memory cells without the disease. The first vaccine (against smallpox) was introduced by Edward Jenner in 1796; the theory of phagocytosis was proposed by Ilya Mechnikov (Nobel Prize, 1908).</p></div>
      <div><h2>Simplifications</h2><ul><li>The node is magnified about 500 times, and the bacteria and antibodies even more.</li><li>Days are compressed into fractions of a second; the antibody curve is schematic.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: organ</li><li><code>I</code> infection · <code>M</code> reset memory</li><li><code>Z</code> drainage zones</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeImmune };
