// @scene thyroid makeThyroid | Гормоны щитовидной железы | Гормоны
/* =========================================================
   БИОХИМИЯ · ЩИТОВИДНАЯ ЖЕЛЕЗА: синтез T₄/T₃ в фолликуле (NIS, пендрин, ТПО, тиреоглобулин, МИТ/ДИТ),
   ось гипоталамус — гипофиз — щитовидная железа с обратной связью и болезнями, действие T₃ на клетку
   ========================================================= */
function makeThyroid() {
  rnd = mulberry(8201);
  const scene = bioStage({ rim: 0xc77dff });
  const VIEW = { synth: [V3(-1.2, -1.6, 0), V3(-0.8, 0.4, 14.5)], axis: [V3(39.6, 2.1, 0), V3(40.1, 3.2, 13.5)], cell: [V3(78.3, -1.9, 0), V3(78.7, 0.2, 17.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.synth[1]);
  const controls = makeControls(camera, VIEW.synth[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ICOL = '#B07BFF';   // йод

  /* ---------- 1. фолликул: разрез ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const FR = 2.2;   // радиус фолликула
  const colloid = new THREE.Mesh(new THREE.SphereGeometry(FR - 0.32, 48, 32), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8B85A').multiplyScalar(0.35), roughness: 0.25, clearcoat: 0.8, transparent: true, opacity: 0.55, depthWrite: false, emissive: 0xe8b85a, emissiveIntensity: 0.04 }));
  G1.add(colloid);
  // клетки-тироциты по сфере (передняя часть срезана)
  const cellGeo = new THREE.BoxGeometry(0.44, 0.44, 0.5); cellGeo.translate(0, 0, 0);
  const NCELL = 260, cells = [];
  for (let i = 0; i < NCELL; i++) { const y = 1 - (i + 0.5) / NCELL * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; const n = V3(Math.cos(a) * r, y, Math.sin(a) * r); if (n.z > -0.05) continue; cells.push(n); }
  const cellI = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), organMat('#E890B0', 0.5, { emissiveIntensity: 0.05 }), cells.length);
  const nucI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 12, 8), organMat('#7A5CC8', 0.7, { emissiveIntensity: 0.08 }), cells.length);
  const dmy = new THREE.Object3D();
  cells.forEach((n, i) => { dmy.position.copy(n).multiplyScalar(FR - 0.05); dmy.lookAt(0, 0, 0); dmy.scale.set(0.4, 0.4, 0.46); dmy.updateMatrix(); cellI.setMatrixAt(i, dmy.matrix); dmy.position.copy(n).multiplyScalar(FR + 0.08); dmy.scale.setScalar(1); dmy.updateMatrix(); nucI.setMatrixAt(i, dmy.matrix); });
  G1.add(cellI, nucI);
  // капилляры снаружи
  const capM = organMat('#D84A50', 0.55, { emissiveIntensity: 0.08 });
  [[3.35, 1.0], [3.7, -0.6], [4.3, 0.4], [4.7, -1.1]].forEach(([a0, tilt], k) => { const pts = []; for (let j = 0; j <= 24; j++) { const a = a0 + (j / 24) * 1.5; pts.push(V3(Math.cos(a) * (FR + 0.42), Math.sin(a) * 0.9 * tilt + (k - 1.5) * 0.7, Math.sin(a) * (FR + 0.42) - 0.4).normalize().multiplyScalar(FR + 0.42)); } G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.07, 8), capM)); });
  // «главная» клетка на срезе справа — крупнее, с транспортёрами
  const FOC = V3(1, 0.12, -0.04).normalize();   // направление на клетку
  const fc = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.66), organMat('#F0A0C0', 0.55, { emissiveIntensity: 0.1, transparent: true, opacity: 0.85 }));
  fc.position.copy(FOC).multiplyScalar(FR - 0.02); fc.lookAt(0, 0, 0); G1.add(fc);
  const BAS = FOC.clone().multiplyScalar(FR + 0.3), API = FOC.clone().multiplyScalar(FR - 0.33);
  const capF = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([BAS.clone().add(V3(0.1, -1.2, -0.3)), BAS.clone().add(V3(0.28, 0, -0.1)), BAS.clone().add(V3(0.1, 1.2, -0.4))]), 30, 0.11, 10), capM); G1.add(capF);
  const marker = (p, col, r = 0.08) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(0.6), emissive: col, emissiveIntensity: 0.35, roughness: 0.3 })); m.position.copy(p); G1.add(m); return m; };
  const nis = marker(BAS.clone().lerp(API, 0.05).add(V3(0, 0.12, 0.3)), '#5B8CFF', 0.14), pend = marker(API.clone().lerp(BAS, 0.05).add(V3(0, 0.24, 0.3)), '#7FE0A0', 0.13), tpo = marker(API.clone().lerp(BAS, 0.05).add(V3(0, -0.2, 0.3)), '#FF9A5C', 0.14);
  const xMat = new THREE.MeshBasicMaterial({ color: '#FF3A3A' }); const cross = new THREE.Group(); [1, -1].forEach((s) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), xMat); c.rotation.z = s * Math.PI / 4; cross.add(c); }); cross.position.copy(tpo.position).add(V3(0, 0, 0.12)); cross.visible = false; G1.add(cross);
  // тиреоглобулин в коллоиде: клубок с тирозинами
  const TGP = []; { let p = V3(0.2, 0.3, 0.2); for (let i = 0; i < 46; i++) { TGP.push(p.clone()); p.add(randUnit().multiplyScalar(0.36)); if (p.length() > 1.3) p.multiplyScalar(0.85); } }
  const tgCurve = new THREE.CatmullRomCurve3(TGP);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(tgCurve, 200, 0.045, 8), organMat('#F2D27A', 0.55, { emissiveIntensity: 0.08 })));
  const TYR = Array.from({ length: 12 }, (_, i) => { const p = tgCurve.getPoint((i + 0.5) / 12); const m = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0x999999, emissive: 0xffffff, emissiveIntensity: 0.05, roughness: 0.3 })); m.position.copy(p); G1.add(m); const io = [0, 1].map((k) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: ICOL })); s.position.copy(p).add(V3(k ? 0.08 : -0.08, 0.07, 0.03)); s.visible = false; G1.add(s); return s; }); return { p, m, io, n: 0, hormone: null }; });
  // готовые гормоны справа: настоящие молекулы
  const t4m = fit('thyroxine', 0.62), t3m = fit('t3', 0.58); t4m.position.set(4.1, 0.95, 0); t3m.position.set(4.1, -0.65, 0); G1.add(t4m, t3m);
  // частицы йодида и гормонов
  const iodI = Array.from({ length: 26 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshBasicMaterial({ color: ICOL })); s.visible = false; G1.add(s); return { s, t: 0, on: false, path: null }; });
  const horI = Array.from({ length: 10 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshBasicMaterial({ color: '#F2C14E' })); s.visible = false; G1.add(s); return { s, t: 0, on: false, path: null }; });
  const pIod = new THREE.CatmullRomCurve3([BAS.clone().add(V3(0.28, -0.6, -0.1)), nis.position.clone(), BAS.clone().lerp(API, 0.5).add(V3(0, 0.15, 0.3)), pend.position.clone(), API.clone().multiplyScalar(0.7)]);
  const pHor = new THREE.CatmullRomCurve3([API.clone().multiplyScalar(0.72), API.clone(), BAS.clone().lerp(API, 0.5).add(V3(0, -0.1, 0)), BAS.clone(), BAS.clone().add(V3(0.15, 0.7, -0.2))]);
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8B85A').multiplyScalar(0.5), emissive: 0xe8b85a, emissiveIntensity: 0.15, transparent: true, opacity: 0.85 })); drop.visible = false; G1.add(drop);

  /* ---------- 2. ось гипоталамус — гипофиз — щитовидная железа ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.14, keep: true, legs: false });
  const HYP = V3(0, 4.12, 0.08), PIT = V3(0, 3.98, 0.16), THY = V3(0, 3.28, 0.24), HRT = BODY.heart.clone(), LIV = V3(-0.35, 1.5, 0.18);
  const brainM = new THREE.Mesh(ell3(0.34, 0.27, 0.36, V3(0, 4.3, 0.02)), glassMat('#C8B8FF', { rim: 0.7, base: 0.04, keep: true })); G2.add(brainM);
  const hypG = glowNucleus(G2, HYP, '#9F7BFF', 0.05, 9), pitG = glowNucleus(G2, PIT, '#7FD6FF', 0.05, 9);
  const thy = new THREE.Group(); thy.position.copy(THY); G2.add(thy);
  const thyMat = organMat('#D86A8A', 0.55, { emissiveIntensity: 0.08 });
  [-1, 1].forEach((s) => { const l = new THREE.Mesh(blobGeo(0.075, 0.15, 0.06, 2 + s, 0.08), thyMat); l.position.set(s * 0.085, 0.01, 0); l.rotation.z = -s * 0.25; thy.add(l); });
  const isth = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 10), thyMat); isth.rotation.z = Math.PI / 2; isth.position.set(0, -0.06, 0.03); thy.add(isth);
  const thyG = glowNucleus(G2, THY.clone().add(V3(0, 0, 0.05)), '#F2C14E', 0.04, 10);
  const heartM = new THREE.Mesh(ell3(0.22, 0.27, 0.2, HRT), organMat('#C84A50', 0.45)); G2.add(heartM);
  const livM = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV), organMat('#9A4A3A', 0.5)); G2.add(livM);
  const A2 = {
    trh: flowArrow(G2, HYP.clone().add(V3(0.04, -0.02, 0.06)), PIT.clone().add(V3(0.04, 0.03, 0.06)), '#9F7BFF', { bend: 1.2, r: 0.008 }),
    tsh: flowArrow(G2, PIT.clone().add(V3(0.06, -0.04, 0.05)), THY.clone().add(V3(0.08, 0.14, 0.05)), '#7FD6FF', { bend: 0.4, r: 0.012 }),
    t4: flowArrow(G2, THY.clone().add(V3(0.1, -0.12, 0.05)), HRT.clone().add(V3(0.12, 0.22, 0.12)), '#F2C14E', { bend: -0.25, r: 0.014 }),
    t4l: flowArrow(G2, THY.clone().add(V3(-0.1, -0.12, 0.05)), LIV.clone().add(V3(0.05, 0.2, 0.15)), '#F2C14E', { bend: 0.2, r: 0.014 }),
    fb1: flowArrow(G2, THY.clone().add(V3(-0.12, 0.08, 0.02)), PIT.clone().add(V3(-0.05, -0.02, 0.02)), '#FF6A5A', { bend: -0.6, r: 0.012 }),
    fb2: flowArrow(G2, THY.clone().add(V3(-0.16, 0.1, 0.0)), HYP.clone().add(V3(-0.07, 0.0, 0.0)), '#FF6A5A', { bend: -0.7, r: 0.011 }),
  };
  // антитела при болезни Грейвса (стимулируют рецептор ТТГ)
  const abG = new THREE.Group(); G2.add(abG);
  const abMat = new THREE.MeshPhysicalMaterial({ color: 0x8060d0, emissive: 0xb090ff, emissiveIntensity: 0.25, roughness: 0.4 });
  const lymG = new THREE.Group(); G2.add(lymG); const LYM = Array.from({ length: 12 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x5b8cff, emissive: 0x7fd6ff, emissiveIntensity: 0.3, roughness: 0.4 })); m.userData.a = i / 12 * Math.PI * 2; lymG.add(m); return m; });
  const AB = Array.from({ length: 9 }, (_, i) => { const y = new THREE.Group(); const st0 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6), abMat); st0.position.y = -0.025; y.add(st0); [-1, 1].forEach((s) => { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.045, 6), abMat); arm.position.set(s * 0.016, 0.017, 0); arm.rotation.z = -s * 0.6; y.add(arm); }); y.userData.a = i / 9 * Math.PI * 2; abG.add(y); return y; });

  /* ---------- 3. действие T₃ на клетку ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const cellM = new THREE.Mesh(blobGeo(3.3, 2.3, 1.6, 4, 0.06), glassMat('#FFC8A8', { rim: 0.8, base: 0.04, keep: true })); G3.add(cellM);
  const nucM = new THREE.Mesh(new THREE.SphereGeometry(1.05, 40, 28), glassMat('#9F7BFF', { rim: 0.9, base: 0.06, keep: true })); nucM.position.set(-0.9, 0.2, 0); G3.add(nucM);
  const dna = proteinMesh('bna', { scale: 0.05, nucColor: '#F2E6C8' }); dna.position.set(-0.9, 0.1, 0.2); dna.rotation.y = Math.PI / 2; G3.add(dna);
  const tr = new THREE.Mesh(blobGeo(0.26, 0.22, 0.22, 11, 0.12), protMat('#F2C14E', 0.5)); tr.position.set(-0.72, 0.42, 0.35); G3.add(tr);
  const rxr = new THREE.Mesh(blobGeo(0.24, 0.21, 0.21, 13, 0.12), protMat('#7FD6FF', 0.5)); rxr.position.set(-1.18, 0.42, 0.35); G3.add(rxr);
  const mct = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 14), protMat('#7FE0A0', 0.5)); mct.position.set(3.05, 0.6, 0.3); mct.rotation.z = Math.PI / 2 - 0.35; G3.add(mct);
  const d2 = new THREE.Mesh(blobGeo(0.22, 0.18, 0.18, 17, 0.12), protMat('#FF9A5C', 0.5)); d2.position.set(1.85, 0.55, 0.35); G3.add(d2);
  const MITO = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.38, 6, 12), organMat('#FF8A5C', 0.55, { emissiveIntensity: 0.1 })); const a = i / 8 * Math.PI * 2; m.position.set(1.35 + Math.cos(a) * 1.2, Math.sin(a) * 1.2 - 0.1, -0.3 + 0.4 * Math.sin(a * 3)); m.rotation.z = a; G3.add(m); return m; });
  const PUMPS = Array.from({ length: 14 }, (_, i) => { const a = -1.1 + i / 13 * 2.2 + (i % 2 ? Math.PI : 0); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 10), protMat('#5B8CFF', 0.6)); const p = V3(Math.cos(a) * 3.15, Math.sin(a) * 2.15, 0.3); m.position.copy(p); m.lookAt(p.clone().multiplyScalar(2)); m.rotateX(Math.PI / 2); m.visible = false; G3.add(m); return m; });
  const t3p = Array.from({ length: 6 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: '#F2C14E' })); s.visible = false; G3.add(s); return { s, t: 0, on: false }; });
  const mrna = Array.from({ length: 5 }, () => { const s = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 16, Math.PI * 1.4), new THREE.MeshBasicMaterial({ color: '#FF6FA8' })); s.visible = false; G3.add(s); return { s, t: 0, on: false }; });
  const pT3 = new THREE.CatmullRomCurve3([V3(4.0, 0.95, 0.3), V3(3.05, 0.6, 0.3), V3(1.85, 0.55, 0.35), V3(0.4, 0.5, 0.4), V3(-0.72, 0.5, 0.4)]);
  const pRna = new THREE.CatmullRomCurve3([V3(-0.9, 0.2, 0.4), V3(0.1, -0.3, 0.5), V3(1.0, -0.9, 0.4), V3(1.8, -1.2, 0.3)]);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'synth', labels: true, rot: false, fly: null, msg: null, iod: 'norm', block: false, iodIn: 0, made: 0, tgIod: 0, ph: 0,
    dis: 'norm', treat: false, T4: 15, TSH: 1.8, size: 1, hr: 70, t3lvl: 'norm', pumps: 4, bmr: 100 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['synth', 'axis', 'cell'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const launch = (pool, path, extra = {}) => { const p = pool.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.path = path; Object.assign(p, extra); p.s.visible = true; } };

  function synthUpdate(dt, t) {
    const iodK = st.iod === 'norm' ? 1 : 0.25;
    if (rnd() < dt * 6 * iodK) launch(iodI, pIod);
    iodI.forEach((p) => { if (!p.on) return; p.t += dt * 0.32; if (p.t >= 1) { p.on = false; p.s.visible = false; st.iodIn = Math.min(st.iodIn + 1, 3); return; } p.s.position.copy(p.path.getPoint(p.t)); });
    nis.material.emissiveIntensity = 0.25 + 0.2 * Math.sin(t * 6) * iodK;
    tpo.material.emissiveIntensity = st.block ? 0.05 : 0.3 + 0.2 * Math.sin(t * 4); cross.visible = st.block;
    // йодирование тирозинов тиреоглобулина (ТПО) — нужен йод, поступивший в коллоид
    if (!st.block && st.iodIn > 0 && rnd() < dt * 3) { const c = TYR.filter((y) => y.n < 2 && !y.hormone); if (c.length) { const y = c[(rnd() * c.length) | 0]; y.n += 1; st.iodIn -= 1; fx.spawn(y.p.clone(), V3(0, 0.3, 0), C.set(ICOL), 0.5, 0.6, 1); } }
    // конденсация: ДИТ + ДИТ → T₄, МИТ + ДИТ → T₃
    if (!st.block && rnd() < dt * 0.9) { const d = TYR.filter((y) => y.n === 2 && !y.hormone), m = TYR.filter((y) => y.n >= 1 && !y.hormone); if (d.length && m.length > 1) { const a = d[0], b = m.find((y) => y !== a); a.hormone = b.n === 2 ? 'T4' : 'T3'; b.n = 0; fx.spawn(a.p.clone(), V3(0, 0.4, 0), C.set('#F2C14E'), 0.7, 0.6, 1.2); } }
    TYR.forEach((y) => { y.io[0].visible = y.n >= 1 || !!y.hormone; y.io[1].visible = y.n >= 2 || y.hormone === 'T4'; y.m.material.color.set(y.hormone ? '#F2C14E' : y.n ? '#C8A0FF' : '#999999').multiplyScalar(0.6); y.m.material.emissiveIntensity = y.hormone ? 0.4 + 0.15 * Math.sin(t * 5) : 0.05; });
    // эндоцитоз коллоида и выход гормонов
    st.ph += dt * 0.35 * (st.iod === 'norm' ? 1 : 0.45);
    if (st.ph > 1) { st.ph = 0; const h0 = TYR.find((y) => y.hormone); if (h0) { const kind = h0.hormone; h0.hormone = null; h0.n = 0; launch(horI, pHor, { kind }); st.made += 1; st.lastKind = kind; } }
    horI.forEach((p) => { if (!p.on) return; p.t += dt * 0.28; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.path.getPoint(p.t)); p.s.material.color.set(p.kind === 'T3' ? '#FFD98A' : '#F2C14E'); p.s.scale.setScalar(p.t < 0.35 ? 2.2 - p.t * 3 : 1); });
    const dp = horI.find((p) => p.on && p.t < 0.35); drop.visible = !!dp; if (dp) drop.position.copy(dp.s.position);
    st.tgIod = TYR.reduce((s, y) => s + (y.hormone ? 2 : y.n), 0) / (TYR.length * 2);
    [t4m, t3m].forEach((g, i) => { g.rotation.y += dt * (0.4 + 0.1 * i); });
  }
  function axisUpdate(dt, t) {
    const D = st.dis, tr = st.treat;
    let cap = D === 'hashi' ? 0.3 : 1, iod = D === 'iod' && !tr ? 0.35 : 1, tsi = D === 'graves' ? 0.9 : 0, block = D === 'graves' && tr ? 0.35 : 1, exo = D === 'hashi' && tr ? 9 : 0;
    if (D === 'hashi') cap = 0.22; else cap *= Math.sqrt(st.size);   // зоб частично компенсирует нехватку йода
    for (let i = 0; i < 8; i++) {
      const h = Math.min(dt, 0.05) / 8 * 2.5;
      const tshT = 40 / (1 + (st.T4 / 9) ** 6); st.TSH += (tshT - st.TSH) * h * 3;
      const E = st.TSH / (st.TSH + 2), P = 31.8 * cap * iod * block * (E + tsi) + exo;
      st.T4 += (P - st.T4) * h;
    }
    const sizeT = D === 'hashi' ? 0.85 : clamp(1 + 0.06 * Math.max(0, st.TSH - 4) + (D === 'graves' && !tr ? 0.45 : 0), 0.8, 2.1);
    st.size += (sizeT - st.size) * Math.min(1, dt * 0.25);
    thy.scale.setScalar(st.size);
    st.hr = Math.round(70 * Math.pow(st.T4 / 15, 0.45));
    heartM.scale.setScalar(1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 2 * st.hr / 60)) ** 6);
    const lv = (v) => clamp(v, 0.04, 1.2);
    A2.trh.mat.uniforms.uOn.value = lv(0.25 + st.TSH / 16); A2.tsh.mat.uniforms.uOn.value = lv(0.15 + st.TSH / 10); A2.t4.mat.uniforms.uOn.value = lv(st.T4 / 22); A2.t4l.mat.uniforms.uOn.value = lv(st.T4 / 26);
    A2.fb1.mat.uniforms.uOn.value = lv(st.T4 / 30); A2.fb2.mat.uniforms.uOn.value = lv(st.T4 / 36);
    Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    hypG.spr.material.opacity = 0.2 + 0.5 * clamp(st.TSH / 20, 0, 1); pitG.spr.material.opacity = 0.2 + 0.6 * clamp(st.TSH / 20, 0, 1);
    thyG.spr.material.opacity = 0.15 + 0.6 * clamp(st.T4 / 35, 0, 1); thyG.spr.scale.setScalar((0.5 + st.size * 0.35) * (1 + 0.06 * Math.sin(t * 4)));
    abG.visible = D === 'graves'; AB.forEach((y, i) => { const a = y.userData.a + t * 0.4; y.position.copy(THY).add(V3(Math.cos(a) * 0.32, 0.1 * Math.sin(a * 2 + i), 0.12 + Math.sin(a) * 0.12)); y.rotation.z = a; y.scale.setScalar(2.4); });
    lymG.visible = D === 'hashi' && !tr; LYM.forEach((m, i) => { const a = m.userData.a - t * 0.3; m.position.copy(THY).add(V3(Math.cos(a) * 0.2, 0.08 * Math.sin(a * 3 + i), 0.08 + Math.sin(a) * 0.08)); });
  }
  function cellUpdate(dt, t) {
    const L = st.t3lvl === 'low' ? 0.3 : st.t3lvl === 'high' ? 2.2 : 1;
    if (rnd() < dt * 1.2 * L) launch(t3p, pT3);
    t3p.forEach((p) => { if (!p.on) return; const pt = p.t; p.t += dt * 0.3; if (pt < 0.5 && p.t >= 0.5) fx.spawn(d2.position.clone().add(G3.position), V3(0, 0.5, 0.2), C.set(ICOL), 0.6, 0.6, 1); if (p.t >= 1) { p.on = false; p.s.visible = false; launch(mrna, pRna); return; } p.s.position.copy(pT3.getPoint(p.t)); p.s.material.color.set(p.t < 0.5 ? '#E8C060' : '#FFD98A'); });
    mrna.forEach((p) => { if (!p.on) return; p.t += dt * 0.35; if (p.t >= 1) { p.on = false; p.s.visible = false; st.pumps = Math.min(PUMPS.length, st.pumps + 0.1); return; } p.s.position.copy(pRna.getPoint(p.t)); p.s.rotation.z += dt * 3; });
    const tgt = 3 + 5 * L; st.pumps += (tgt - st.pumps) * dt * 0.3; PUMPS.forEach((m, i) => { m.visible = i < Math.round(st.pumps); m.material.emissiveIntensity = 0.05 + 0.1 * Math.sin(t * 6 + i); });
    MITO.forEach((m, i) => { const s = 0.75 + 0.25 * Math.min(L, 2); m.scale.setScalar(s); m.material.emissiveIntensity = 0.06 + 0.08 * L * (0.6 + 0.4 * Math.sin(t * 3 + i)); if (rnd() < dt * 0.4 * L) fx.spawn(m.position.clone().add(G3.position), V3(0, 0.3, 0), C.set('#FF9A5C'), 0.6, 0.5, 1); });
    tr.material.emissiveIntensity = 0.04 + 0.2 * Math.min(L, 2) * (0.5 + 0.5 * Math.sin(t * 4));
    st.bmr = Math.round(100 * (L < 1 ? 0.5 + 0.5 * L : 0.62 + 0.38 * L));
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'synth') synthUpdate(dt, t);
    if (st.mode === 'axis') axisUpdate(dt, t);
    if (st.mode === 'cell') cellUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'axis') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'ТТГ (лог.), св. T₄; серое — норма', x0: 10 });
    const bar = (y, v, max, lo, hi, col, name) => { const X = (u) => A.X(clamp(u / max, 0, 1)); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(X(lo), y - 7, X(hi) - X(lo), 14); ctx.fillStyle = col; ctx.fillRect(A.X(0), y - 3, X(v) - A.X(0), 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(name, A.X(0) + 2, y - 9); };
    const L = (v) => (Math.log10(Math.max(v, 0.01)) + 2) / 4 * 25; bar(h * 0.42, L(st.TSH), 25, L(0.4), L(4.0), '#7FD6FF', 'ТТГ 0,01 … 100');
    bar(h * 0.78, st.T4, 45, 10, 22, '#F2C14E', 'св. T₄');
  }

  const TXT = {
    synth: '<b>Фолликул щитовидной железы</b> — пузырёк из одного слоя клеток-тироцитов, внутри коллоид с белком <b>тиреоглобулином</b>. 1) Йодид из крови закачивается в клетку <b>Na⁺/I⁻-симпортёром</b> (NIS, синий) и уходит в коллоид через <b>пендрин</b> (зелёный). 2) <b>Тиреопероксидаза</b> (ТПО, оранжевая) окисляет йод и пришивает его к тирозинам тиреоглобулина: получаются <b>МИТ</b> (один йод) и <b>ДИТ</b> (два). 3) Та же ТПО сшивает ДИТ + ДИТ → <b>T₄</b> (тироксин), МИТ + ДИТ → <b>T₃</b>. 4) По сигналу ТТГ клетка захватывает каплю коллоида, лизосомы расщепляют тиреоглобулин, и T₄ (≈90%) и T₃ уходят в кровь.',
    axis: '<b>Ось гипоталамус — гипофиз — щитовидная железа.</b> Гипоталамус выделяет <b>тиреолиберин</b> (ТРГ), он заставляет гипофиз выделять <b>тиреотропный гормон</b> (ТТГ), а ТТГ — щитовидную железу делать T₄ и T₃. Гормоны щитовидной железы тормозят гипоталамус и гипофиз (красные стрелки) — так их уровень держится постоянным. Поэтому главный анализ — ТТГ: он первым чувствует сдвиг. В печени и тканях T₄ превращается в активный T₃. Выберите болезнь.',
    cell: '<b>Как T₃ действует на клетку.</b> T₄ входит через транспортёр MCT8 (зелёный), дейодиназа D2 (оранжевая) отщепляет один йод — получается активный <b>T₃</b>. Он проходит в ядро и садится на <b>рецептор тиреоидных гормонов</b> (TR, жёлтый), который в паре с RXR (голубой) сидит на ДНК. Включаются гены: больше <b>Na⁺/K⁺-АТФазы</b> (синие насосы в мембране), митохондрий и ферментов окисления — клетка тратит больше энергии и выделяет больше тепла. Ещё T₃ усиливает действие адреналина на сердце и нужен для созревания мозга плода и ребёнка.',
  };
  const DIS = { norm: 'Норма', hashi: 'Гипотиреоз (Хашимото)', graves: 'Гипертиреоз (Грейвс)', iod: 'Нехватка йода' };
  const DISTXT = {
    norm: TXT.axis,
    hashi: '<b>Аутоиммунный тиреоидит Хашимото</b> — самая частая причина гипотиреоза. Лимфоциты разрушают железу, T₄ падает, обратная связь ослабевает, и гипофиз выделяет всё больше ТТГ — <b>ТТГ высокий, T₄ низкий</b>. Обмен замедляется: усталость, зябкость, прибавка веса, сухая кожа, отёки, медленный пульс, запоры, депрессия. (Врождённый гипотиреоз — чаще недоразвитие железы — без лечения ведёт к кретинизму, поэтому всех новорождённых проверяют на ТТГ.)',
    graves: '<b>Болезнь Грейвса</b> (диффузный токсический зоб). Иммунная система делает <b>антитела к рецептору ТТГ</b> (фиолетовые), которые включают его без всякого ТТГ. Железа увеличивается и работает без остановки, обратная связь глушит гипофиз — <b>ТТГ почти ноль, T₄ высокий</b>. Сердцебиение, потливость, дрожь, похудание при хорошем аппетите, раздражительность; в отличие от других форм тиреотоксикоза — ещё и пучеглазие (эндокринная офтальмопатия).',
    iod: '<b>Нехватка йода</b> — в мире главная причина зоба. Без йода T₄ делать не из чего, ТТГ растёт и заставляет железу разрастаться: <b>эндемический зоб</b>. Увеличенная железа отчасти компенсирует недостаток. Беременным и детям дефицит особенно опасен — страдает развитие мозга. Профилактика — йодированная соль.',
  };
  const TREAT = { norm: '', hashi: 'Левотироксин', graves: 'Тиамазол', iod: 'Йодированная соль' };
  const TREATTXT = {
    hashi: '<b>Лечение гипотиреоза</b> — таблетки <b>левотироксина</b> (синтетический T₄) каждый день пожизненно. Дозу подбирают по ТТГ: когда он возвращается в норму, значит, гормона хватает.',
    graves: '<b>Тиамазол</b> и пропилтиоурацил блокируют тиреопероксидазу — йод перестаёт пришиваться к тиреоглобулину, T₄ падает к норме (ТТГ после долгого подавления восстанавливается месяцами). Другие варианты — радиоактивный йод (железа сама его захватывает и разрушается) или операция; пульс сбивают β-блокаторами.',
    iod: '<b>Йодированная соль</b> возвращает железе сырьё: T₄ растёт, ТТГ падает, и зоб за месяцы может уменьшиться (большой давний зоб — уже нет). Суточная потребность взрослого — около 150 мкг йода, у беременных — 250 мкг.',
  };
  const labels = [
    { text: 'коллоид', pos: V3(-0.6, 1.05, 0.9), color: '#E8B85A', show: () => st.labels && st.mode === 'synth' },
    { text: 'тиреоглобулин', pos: TGP[20].clone().add(V3(-0.3, -0.25, 0.3)), color: '#F2D27A', show: () => st.labels && st.mode === 'synth' },
    { text: 'тироциты', pos: V3(-1.85, -1.35, 0.1), color: '#E890B0', show: () => st.labels && st.mode === 'synth' },
    { text: 'капилляр', pos: BAS.clone().add(V3(0.35, -1.0, 0.45)), color: '#D84A50', show: () => st.labels && st.mode === 'synth' },
    { text: 'NIS (Na⁺/I⁻)', pos: nis.position.clone().add(V3(0.35, 0.05, 0.2)), color: '#5B8CFF', show: () => st.labels && st.mode === 'synth' },
    { text: 'пендрин', pos: pend.position.clone().add(V3(-0.15, 0.35, 0.25)), color: '#7FE0A0', show: () => st.labels && st.mode === 'synth' },
    { text: 'ТПО', pos: tpo.position.clone().add(V3(-0.1, -0.38, 0.25)), color: '#FF9A5C', show: () => st.labels && st.mode === 'synth' },
    { text: 'тироксин T₄', pos: V3(4.1 - 0.55, 0.25, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'synth' },
    { text: 'трийодтиронин T₃', pos: V3(4.1 - 0.75, -1.35, 0.3), color: '#FFD98A', show: () => st.labels && st.mode === 'synth' },
    { text: 'гипоталамус (ТРГ)', pos: HYP.clone().add(V3(40.25, 0.22, 0.1)), color: '#9F7BFF', show: () => st.labels && st.mode === 'axis' },
    { text: 'гипофиз (ТТГ)', pos: PIT.clone().add(V3(40.3, -0.08, 0.1)), color: '#7FD6FF', show: () => st.labels && st.mode === 'axis' },
    { text: 'щитовидная железа', pos: THY.clone().add(V3(40.28, -0.1, 0.1)), color: '#F2C14E', show: () => st.labels && st.mode === 'axis' },
    { text: 'печень: T₄ → T₃', pos: LIV.clone().add(V3(39.5, -0.35, 0.2)), color: '#C8C8D0', show: () => st.labels && st.mode === 'axis' },
    { text: 'сердце', pos: HRT.clone().add(V3(40.3, -0.1, 0.2)), color: '#FF6A5A', show: () => st.labels && st.mode === 'axis' },
    { text: 'обратная связь', pos: V3(40 - 0.62, 3.6, 0.2), color: '#FF6A5A', show: () => st.labels && st.mode === 'axis' },
    { text: 'антитела к рецептору ТТГ', pos: THY.clone().add(V3(40 - 1.3, -0.12, 0.2)), color: '#B090FF', show: () => st.labels && st.mode === 'axis' && st.dis === 'graves' },
    { text: 'MCT8', pos: V3(80 + 3.2, 0.95, 0.4), color: '#7FE0A0', show: () => st.labels && st.mode === 'cell' },
    { text: 'D2: T₄ → T₃', pos: V3(80 + 1.6, 0.15, 0.4), color: '#FF9A5C', show: () => st.labels && st.mode === 'cell' },
    { text: 'TR', pos: V3(80 - 0.55, 0.8, 0.5), color: '#F2C14E', show: () => st.labels && st.mode === 'cell' },
    { text: 'RXR', pos: V3(80 - 1.45, 0.8, 0.5), color: '#7FD6FF', show: () => st.labels && st.mode === 'cell' },
    { text: 'ДНК', pos: V3(80 - 1.95, -0.25, 0.5), color: '#F2E6C8', show: () => st.labels && st.mode === 'cell' },
    { text: 'ядро', pos: V3(80 - 1.6, 1.35, 0.4), color: '#9F7BFF', show: () => st.labels && st.mode === 'cell' },
    { text: 'мРНК', pos: V3(80 + 0.6, -0.95, 0.5), color: '#FF6FA8', show: () => st.labels && st.mode === 'cell' },
    { text: 'Na⁺/K⁺-АТФаза', pos: V3(80 + 2.6, -1.9, 0.4), color: '#5B8CFF', show: () => st.labels && st.mode === 'cell' },
    { text: 'митохондрии', pos: V3(80 + 2.2, 1.45, 0.2), color: '#FF8A5C', show: () => st.labels && st.mode === 'cell' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'synth' ? (st.block ? '<b>Тиамазол / пропилтиоурацил</b> блокируют тиреопероксидазу: йод продолжает поступать в коллоид, но к тирозинам не пришивается — новые T₄ и T₃ не образуются. Запас гормонов в коллоиде расходуется за несколько недель, поэтому эффект лечения наступает не сразу.' : st.iod === 'low' ? '<b>Мало йода в пище</b>: йодида в крови мало — NIS (под действием ТТГ его даже становится больше) захватывает меньше, тирозины йодируются медленнее, растёт доля МИТ и T₃ — железа экономит йод. Гормонов выходит меньше, и гипофиз отвечает ростом ТТГ (режим «Ось и болезни»).' : TXT.synth)
        : st.mode === 'axis' ? (st.treat && st.dis !== 'norm' ? TREATTXT[st.dis] : DISTXT[st.dis])
        : st.t3lvl === 'low' ? '<b>Мало T₃</b> (гипотиреоз): гены почти не включаются, насосов и митохондрий меньше, основной обмен падает на 30–40% — человеку холодно, он вял и медлителен.' : st.t3lvl === 'high' ? '<b>Много T₃</b> (тиреотоксикоз): клетки сжигают топливо вхолостую, много тепла, обмен вырастает в полтора-два раза; сердце бьётся чаще — в том числе потому, что T₃ добавляет β-адренорецепторов и прямо включает гены сердечной мышцы.' : TXT.cell;
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'synth', label: 'Синтез в фолликуле' }, { id: 'axis', label: 'Ось и болезни' }, { id: 'cell', label: 'Действие на клетку' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'Условия'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Йода достаточно' }, { id: 'low', label: 'Мало йода' }], () => st.iod, (v) => { st.iod = v; refs.setInfo(); }), toggle('Тиамазол', () => st.block, (v) => { st.block = v; refs.setInfo(); })));
      else if (st.mode === 'axis') { const tb = toggle(TREAT[st.dis] || 'Лечение', () => st.treat, (v) => { st.treat = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; st.treat = false; refs.rebuild(); refs.setInfo(); }), st.dis !== 'norm' ? tb : null)); }
      else box.append(h('div', { class: 'glabel' }, 'Уровень T₃'), h('div', { class: 'gctl' }, seg([{ id: 'low', label: 'Низкий' }, { id: 'norm', label: 'Норма' }, { id: 'high', label: 'Высокий' }], () => st.t3lvl, (v) => { st.t3lvl = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['synth', 'axis', 'cell'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'axis') return [['ТТГ', st.TSH < 0.1 ? '<0,1' : f1(st.TSH), 'мЕд/л'], ['св. T₄', Math.round(st.T4), 'пмоль/л'], ['Пульс', st.hr, 'уд/мин']];
    if (st.mode === 'cell') return [['Основной обмен', st.bmr, '%'], ['Насосов', Math.round(st.pumps), '']];
    return [['Готовых T₄/T₃ в коллоиде', TYR.filter((y) => y.hormone).length, ''], ['Выпущено гормонов', st.made, '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#C77DFF',
    kicker: 'Биохимия · гормоны', title: 'Щитовидная железа',
    lede: 'Два гормона из аминокислоты тирозина и йода задают скорость обмена веществ во всех клетках тела — от сердца до растущего мозга.',
    notes: `
      <div><h2>Гормоны щитовидной железы</h2>
        <p><b>T₄</b> (тироксин, 3,5,3′,5′-тетрайодтиронин) и <b>T₃</b> (3,5,3′-трийодтиронин) — йодированные производные тирозина. Железа выделяет в основном T₄; около 80% T₃ образуется в тканях дейодиназами D1 и D2. Дейодиназа D3 даёт неактивный реверсивный T₃ (rT₃). В крови более 99% гормонов связаны с белками (тироксинсвязывающий глобулин, транстиретин, альбумин); действует свободная фракция.</p>
        <h3>Синтез</h3><ul><li>Захват йодида: Na⁺/I⁻-симпортёр (NIS), вторично-активный транспорт.</li><li>Окисление йода и йодирование тирозиновых остатков тиреоглобулина — тиреопероксидаза (ТПО), нужна H₂O₂.</li><li>Конденсация: ДИТ + ДИТ → T₄; МИТ + ДИТ → T₃.</li><li>Протеолиз тиреоглобулина в лизосомах, освобождение T₄ и T₃; йод из МИТ и ДИТ используется повторно.</li></ul>
        <h3>Действие</h3><p>Ядерные рецепторы TRα и TRβ в паре с RXR связываются с участками ДНК (TRE) и меняют транскрипцию генов. Эффекты: рост основного обмена и теплопродукции, усиление липолиза и глюконеогенеза, снижение холестерина, рост и созревание костей и мозга, усиление эффектов катехоламинов на сердце.</p>
        <h3>Анализы</h3><p>ТТГ (норма около 0,4–4,0 мЕд/л), свободный T₄ (около 10–22 пмоль/л), антитела к ТПО (Хашимото) и к рецептору ТТГ (Грейвс).</p></div>
      <div><h2>Условности</h2><ul><li>T₄ и T₃ справа — молекулы по химическим формулам; остальное (клетки, белки, транспортёры) — схемы, не в масштабе.</li><li>ДНК в ядре — настоящая структура B-ДНК (PDB 1BNA), рецепторы TR и RXR — условные капли.</li><li>Ось — простая модель с обратной связью; числа ТТГ и T₄ — типичные, а не диагностические границы.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('synth'); st.fly = null;
  return self;
}
