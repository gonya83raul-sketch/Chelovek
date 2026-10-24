import { Sparks, THREE, V3, __set_rnd, bodyShell, branchTree, button, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ЛИМФАТИЧЕСКАЯ И ИММУННАЯ СИСТЕМА
   ========================================================= */
const IM_PARTS = [
  { id: 'lv', name: 'Лимфатические сосуды', color: '#9FE8C0', text: '<b>Лимфатические сосуды</b> собирают из тканей жидкость, вышедшую из капилляров (около 2–3 л в сутки), вместе с белками, жирами из кишечника и микробами. Лимфа течёт медленно, только к сердцу: её толкают сокращения мышц, а клапаны не дают вернуться. Грудной проток впадает в левую подключичную вену.' },
  { id: 'ln', name: 'Лимфоузлы', color: '#7FD6FF', text: '<b>Лимфатические узлы</b> (500–700 штук) — фильтры на пути лимфы и места встречи лимфоцитов с чужаками. Самые крупные группы — шейные, подмышечные, паховые, брыжеечные. При инфекции узел увеличивается и болит: в нём размножаются лимфоциты.' },
  { id: 'spl', name: 'Селезёнка', color: '#B0506A', text: '<b>Селезёнка</b> (около 150 г) фильтрует кровь, а не лимфу: удаляет старые эритроциты, хранит запас тромбоцитов и моноцитов, в её белой пульпе встречаются лимфоциты и антигены из крови.' },
  { id: 'thym', name: 'Тимус', color: '#7FD6C8', text: '<b>Тимус</b> — центральный орган иммунитета: здесь T-лимфоциты «учатся». Выживают только те, что распознают чужое и не нападают на своё — до 95% погибают в отборе.' },
  { id: 'bm', name: 'Костный мозг', color: '#E06A6A', text: '<b>Красный костный мозг</b> (в плоских костях, позвонках, концах трубчатых костей) — фабрика всех клеток крови: эритроцитов, тромбоцитов и лейкоцитов. Здесь созревают B-лимфоциты.' },
  { id: 'ton', name: 'Миндалины', color: '#F2A0B0', text: '<b>Миндалины</b> образуют кольцо вокруг входа в глотку и встречают микробов, приходящих с воздухом и пищей.' },
];
function makeImmune() {
  __set_rnd(mulberry(1717));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06080a); scene.environment = envTex;
  labLights(scene, 0x7fd6ff);
  const VIEW = { sys: flyTarget(V3(0.0, 0.45, 0), V3(2.6, 1.3, 13.6)), node: flyTarget(V3(30, -0.8, 0), V3(31.6, 0.6, 8.0)), resp: flyTarget(V3(30, -0.8, 0), V3(28.4, 0.7, 8.0)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.sys.pos);
  const controls = makeControls(camera, VIEW.sys.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  const body = new THREE.Group(); scene.add(body);
  bodyShell(body, { rim: 0.2 });
  const PART = Object.fromEntries(IM_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = body) => { const m = organMat(PART[id].color, o.k ?? 0.45, { emissiveIntensity: 0.1, ...(o.mat || {}) }); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- лимфатическая сеть ---------- */
  const DUCT_L = V3(0.32, 2.88, 0.08), DUCT_R = V3(-0.32, 2.88, 0.08);
  const THOR = new THREE.CatmullRomCurve3([V3(0.05, 0.9, -0.28), V3(0.02, 1.6, -0.36), V3(0.0, 2.4, -0.34), V3(0.12, 2.95, -0.1), DUCT_L]);
  const LYM = [THOR];
  const branch = (pts) => LYM.push(new THREE.CatmullRomCurve3(pts));
  [1, -1].forEach((s) => {
    branch([V3(0.48 * s, -2.0, 0.08), V3(0.48 * s, -0.9, 0.12), V3(0.36 * s, -0.15, 0.2), V3(0.15 * s, 0.4, -0.1), V3(0.05, 0.9, -0.28)]);         // нога → пах → цистерна
    branch([V3(1.45 * s, 1.2, 0.05), V3(1.36 * s, 1.9, 0.0), V3(1.0 * s, 2.55, 0.0), V3(0.6 * s, 2.8, 0.05), s > 0 ? DUCT_L : DUCT_R]);              // рука → подмышка
    branch([V3(0.18 * s, 4.0, 0.05), V3(0.2 * s, 3.55, 0.08), V3(0.22 * s, 3.2, 0.06), s > 0 ? DUCT_L : DUCT_R]);                                    // голова → шея
  });
  branch([V3(0.0, 0.75, 0.2), V3(0.0, 0.8, 0.0), V3(0.05, 0.9, -0.28)]);
  const lvG = []; LYM.forEach((c, i) => { lvG.push(taperTube(c, () => (i === 0 ? 0.03 : 0.018), 80, 6)); for (let k = 0; k < 6; k++) { const arr = []; branchTree(arr, c.getPointAt(0.1 + k * 0.14), randUnit(), 0.22, 0.008, 1, { segs: 6, rad: 4 }); lvG.push(...arr); } });
  add('lv', mergeGeometries(lvG), { k: 0.4, mat: { transparent: true, opacity: 0.75 } });
  const NODES = [];
  const cluster = (c, n, r) => { for (let i = 0; i < n; i++) { const p = c.clone().add(randUnit().multiplyScalar(r * rnd())); const g = ell3(0.035 + rnd() * 0.02, 0.025 + rnd() * 0.015, 0.03, p, 14); add('ln', g, { k: 0.5 }); NODES.push(p); } };
  [1, -1].forEach((s) => { cluster(V3(0.2 * s, 3.4, 0.08), 6, 0.12); cluster(V3(0.85 * s, 2.6, 0.0), 6, 0.12); cluster(V3(0.34 * s, -0.12, 0.2), 6, 0.1); });
  cluster(V3(0.0, 0.8, 0.1), 9, 0.18); cluster(V3(0.0, 2.35, -0.05), 5, 0.12);
  const splG = displaceGeo(new THREE.SphereGeometry(1, 32, 24), (v) => { v.set(v.x * 0.1, v.y * 0.18, v.z * 0.07); if (v.x < 0) v.x *= 0.5; }); splG.rotateZ(-0.4); splG.translate(0.68, 1.38, -0.18); add('spl', splG, { k: 0.45 });
  [1, -1].forEach((s) => add('thym', ell3(0.08, 0.16, 0.05, V3(0.06 * s, 2.72, 0.3))));
  [1, -1].forEach((s) => add('ton', ell3(0.03, 0.05, 0.025, V3(0.07 * s, 3.78, 0.1))));
  [1, -1].forEach((s) => { add('bm', tube([V3(0.48 * s, -0.25, 0.0), V3(0.5 * s, -1.2, 0.02), V3(0.48 * s, -2.0, 0.03)], 0.055, 20, 10), { k: 0.35, mat: { transparent: true, opacity: 0.5 } }); add('bm', ell3(0.08, 0.1, 0.08, V3(0.48 * s, -0.3, 0.0)), { k: 0.5 }); });
  add('bm', (() => { const g = new THREE.TorusGeometry(0.75, 0.05, 8, 40, Math.PI); g.rotateX(Math.PI / 2); g.scale(1, 1, 0.5); g.translate(0, 0.15, -0.05); return g; })(), { k: 0.35, mat: { transparent: true, opacity: 0.5 } });
  /* ---------- лимфоузел крупно ---------- */
  const node = new THREE.Group(); node.position.set(30, 0, 0); scene.add(node); node.visible = false;
  const nodeG = displaceGeo(new THREE.SphereGeometry(1, 64, 48), (v) => { let x = v.x * 1.5, y = v.y, z = v.z * 0.8; if (x < -0.6) x += 0.45 * Math.exp(-((y / 0.35) ** 2)) * smooth(-0.6, -1.4, x); v.set(x, y, z); });
  node.add(new THREE.Mesh(nodeG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xc8e8d8).multiplyScalar(0.35), roughness: 0.4, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, clearcoat: 0.6 })), new THREE.Mesh(nodeG, glassMat(0xb8f0d8, { rim: 0.45, base: 0.01, pow: 2 })));
  // фолликулы (B-зоны) по периферии, паракортекс (T-зона), мозговые тяжи
  const FOL = []; for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.3 + rand(-0.05, 0.05), r = 0.78; const p = V3(Math.cos(a) * r * 1.45, Math.sin(a) * r, rand(-0.25, 0.25)); if (p.x < -0.5) continue;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 18), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x5e8fef).multiplyScalar(0.45), emissive: 0x1a3a8a, emissiveIntensity: 0.4, roughness: 0.4, transparent: true, opacity: 0.75 })); m.position.copy(p); node.add(m);
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
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(IM_PARTS.map((p) => PART[p.id]), st.sel); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; body.visible = m === 'sys'; node.visible = m !== 'sys'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  function infect() { if (st.mode !== 'resp') setMode('resp'); st.second = st.mem; st.infT = st.t; st.titre = []; BAC.length = 0; AB.length = 0; for (let i = 0; i < 60; i++) BAC.push({ c: AFF[i % 4], u: -rnd() * 1.5, alive: 1, p: V3(0, 0, 0), q: new THREE.Quaternion().setFromAxisAngle(randUnit(), rnd() * 6) }); st.msg = st.second ? TXT.second : TXT.first; refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'sys') select(id); });
  const DAY = 0.6; // секунд на «сутки»
  const titreAt = (d, second) => second ? 9 * Math.max(0, 1 - Math.exp(-Math.max(0, d - 1.5) / 1.4)) * Math.exp(-Math.max(0, d - 8) / 18) : 1.0 * Math.max(0, 1 - Math.exp(-Math.max(0, d - 5) / 2.6)) * Math.exp(-Math.max(0, d - 14) / 8);
  const mtx = new THREE.Matrix4(), C_L = new THREE.Color(0xc8ffe0), C_B = new THREE.Color(0x8fb8ff), C_T = new THREE.Color(0x7fe0a0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    if (st.mode === 'sys') { for (let j = 0; j < 4; j++) { const c = LYM[Math.floor(rnd() * LYM.length)]; fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_L, 0.5, 0, 1.2); } if (st.sel === 'bm' && rnd() < 0.5) fx.spawn(V3(0.48 * (rnd() < 0.5 ? 1 : -1), -0.3 - rnd() * 1.6, 0.0), randUnit().multiplyScalar(0.1), new THREE.Color(0xff6a6a), 0.8, 1, 1.2); }
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
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '500 9px JetBrains Mono, monospace'; [0, 10, 20, 30, 40].forEach((d) => ctx.fillText(d + ' дн', x(d) - 8, hgt - 2));
    ctx.strokeStyle = '#FFD34A'; ctx.lineWidth = 2; ctx.beginPath(); st.titre.forEach(([d, v], i) => (i ? ctx.lineTo(x(d), Y(v)) : ctx.moveTo(x(d), Y(v)))); ctx.stroke();
    ctx.fillStyle = '#FFD34A'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText(st.second ? 'антитела · вторичный ответ' : 'антитела · первичный ответ', 10, 13);
  }
  const TXT = {
    sys: '<b>Лимфатическая и иммунная система.</b> Центральные органы — <b>костный мозг</b> и <b>тимус</b>, где рождаются и созревают лимфоциты. Периферические — <b>лимфоузлы</b>, <b>селезёнка</b>, миндалины, лимфоидная ткань кишечника: здесь лимфоциты встречают чужаков. Лимфатические сосуды (зелёные частицы) возвращают тканевую жидкость в кровь. Нажмите на орган.',
    node: '<b>Лимфатический узел.</b> Лимфа входит по нескольким приносящим сосудам (выпуклая сторона), просачивается через узел и выходит по выносящему в воротах. В корковом слое — шаровидные <b>фолликулы с B-лимфоцитами</b> (синие), глубже — <b>T-зона</b> (зелёная), в центре — мозговые тяжи с плазматическими клетками. Макрофаги (фиолетовый) поедают всё лишнее.',
    resp: '<b>Иммунный ответ.</b> Нажмите «Инфекция», чтобы увидеть первую встречу с микробом, а потом повторите — это будет уже вторичный ответ.',
    first: '<b>Первая встреча.</b> Бактерии (зелёные палочки) приносятся лимфой. Неспецифическая защита — макрофаги — уже работает, но микробов много.',
    present: '<b>Предъявление антигена.</b> Дендритная клетка (оранжевая звезда) захватила кусочки бактерий и принесла их в T-зону. T-хелперы, узнавшие антиген, активируют подходящие B-лимфоциты — в фолликулах вспыхивают герминативные центры.',
    ab: '<b>Антитела.</b> B-лимфоциты размножаются и превращаются в плазматические клетки, выпускающие тысячи антител в секунду (жёлтые Y). Антитела склеивают бактерии и метят их для макрофагов. При первой встрече на это уходит 1–2 недели — поэтому мы болеем. Часть клеток остаётся клетками памяти.',
    second: '<b>Повторная встреча (или после прививки).</b> Клетки памяти узнают тот же антиген сразу.',
    ab2: '<b>Вторичный ответ</b> — быстрее (2–4 дня) и в разы сильнее, антитела более точные (IgG). Микроб уничтожается раньше, чем успевает вызвать болезнь. На этом основаны прививки: вакцина знакомит иммунитет с безопасной частью возбудителя.',
  };
  const labels = [
    { text: 'шейные узлы', pos: V3(0.35, 3.45, 0.12), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'подмышечные', pos: V3(1.05, 2.7, 0.05), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'паховые', pos: V3(0.55, -0.1, 0.25), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'брыжеечные', pos: V3(0.25, 0.75, 0.25), color: '#7FD6FF', show: () => st.labels && st.mode === 'sys' },
    { text: 'грудной проток', pos: V3(0.1, 1.8, -0.35), color: '#9FE8C0', show: () => st.labels && st.mode === 'sys' },
    { text: 'селезёнка', pos: V3(0.85, 1.4, -0.15), color: '#D0708A', show: () => st.labels && st.mode === 'sys' },
    { text: 'тимус', pos: V3(0.2, 2.75, 0.35), color: '#7FD6C8', show: () => st.labels && st.mode === 'sys' },
    { text: 'миндалины', pos: V3(0.15, 3.82, 0.12), color: '#F2A0B0', show: () => st.labels && st.mode === 'sys' },
    { text: 'костный мозг', pos: V3(0.62, -1.1, 0.05), color: '#E06A6A', show: () => st.labels && st.mode === 'sys' },
    { text: 'фолликул (B-клетки)', pos: V3(31.0, 0.8, 0.3), color: '#8FB8FF', show: () => st.labels && st.mode !== 'sys' },
    { text: 'T-зона', pos: V3(30.4, -0.1, 0.5), color: '#7FE0A0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'приносящие сосуды', pos: V3(31.9, 1.05, 0.2), color: '#9FE8C0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'выносящий сосуд', pos: V3(28.0, -0.5, 0.2), color: '#9FE8C0', show: () => st.labels && st.mode !== 'sys' },
    { text: 'макрофаг', pos: V3(29.5, 0.55, 0.45), color: '#E0A0FF', show: () => st.labels && st.mode !== 'sys' },
    { text: 'мозговые тяжи', pos: V3(29.4, -0.25, 0.1), color: '#E8B0C0', show: () => st.labels && st.mode !== 'sys' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'sys' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'sys', label: 'Органы' }, { id: 'node', label: 'Лимфоузел' }, { id: 'resp', label: 'Иммунный ответ' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...IM_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'sys') setMode('sys'); select(v); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 480px' }, h('div', { class: 'glabel' }, 'Органы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Опыт', 'I · M', button('Инфекция', infect, true), button('Сбросить память', () => { st.mem = false; st.msg = '<b>Память сброшена:</b> следующая инфекция снова вызовет первичный ответ.'; refs.setInfo(); })), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['sys', 'node', 'resp'][n - 1]); return true; }
    if (k === 'i' || k === 'ш') { infect(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'resp' && st.titre.length ? [['День', Math.min(40, Math.floor(st.days)), ''], ['Память', st.mem || st.second ? 'есть' : 'нет', '']] : [['Лимфоузлов', '500–700', ''], ['Лимфы', '2–3', 'л/сут']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Тело · иммунитет', title: 'Лимфа и иммунитет',
    lede: 'Сеть сосудов и узлов, где триллион лимфоцитов патрулирует тело, узнаёт чужое и запоминает его на годы вперёд.',
    notes: `
      <div><h2>Два уровня защиты</h2>
        <p><b>Врождённый иммунитет</b> работает сразу и одинаково против всех: кожа и слизистые, фагоциты (нейтрофилы, макрофаги), воспаление, интерфероны. <b>Приобретённый</b> — специфичный и с памятью: B-лимфоциты выпускают антитела, T-киллеры убивают заражённые клетки, T-хелперы координируют ответ.</p>
        <h3>Вакцинация</h3><p>Вакцина создаёт клетки памяти без болезни. Первую вакцину (от оспы) предложил Эдвард Дженнер в 1796 году, теорию фагоцитоза — И. И. Мечников (Нобелевская премия 1908 г.).</p></div>
      <div><h2>Условности</h2><ul><li>Узел увеличен примерно в 500 раз, бактерии и антитела — ещё сильнее.</li><li>Сутки сжаты до долей секунды; кривая антител — схема.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик: орган</li><li><code>I</code> инфекция</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeImmune };
