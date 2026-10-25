// @scene sexhorm makeSexhorm | Половые гормоны и беременность | Гормоны
/* =========================================================
   БИОХИМИЯ · ПОЛОВЫЕ ГОРМОНЫ: синтез андрогенов и эстрогенов (CYP11A1, 3β-ГСД, CYP17, 17β-ГСД, ароматаза, 5α-редуктаза;
   летрозол, финастерид), ось гипоталамус — гипофиз — гонады (анаболические стероиды, контрацептивы, менопауза),
   ХГЧ и тест на беременность (иммунохроматография с настоящей структурой IgG)
   ========================================================= */
function makeSexhorm() {
  rnd = mulberry(8701);
  const scene = bioStage({ rim: 0xff6fa8 });
  const VIEW = { synth: [V3(-0.75, 0.45, 0), V3(-0.35, 1.45, 23)], axis: [V3(39.2, 0.3, 0), V3(39.8, 1.6, 17.5)], preg: [V3(80.3, 0.75, 0), V3(80.3, 4.3, 11.8)] };
  const VIEWM = { synth: [V3(1.3, 0.45, 0), V3(1.7, 1.45, 25)], preg: [V3(80.3, 0.75, 0), V3(80.3, 4.6, 12.8)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.synth[1]);
  const controls = makeControls(camera, VIEW.synth[0]); controls.minDistance = 3; controls.maxDistance = 45;
  const fx = new Sparks(1800, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ball = (r, col, parent) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true })); s.visible = false; parent.add(s); return s; };
  const ANDR = '#5B8CFF', ESTR = '#FF6FA8', PROG = '#F2C14E';

  /* ---------- 1. синтез ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const NODE = {
    chol: { m: 'cholesterol', p: V3(-5.0, 0.35, 0), name: 'холестерин', col: '#E8E0C8' },
    preg: { m: 'pregnenolone', p: V3(-2.55, 1.45, 0), name: 'прегненолон', col: PROG },
    prog: { m: 'progesterone', p: V3(-2.55, -0.95, 0), name: 'прогестерон', col: PROG },
    dhea: { m: 'dhea', p: V3(0, 1.45, 0), name: 'ДГЭА', col: '#9FB4FF' },
    ohp: { m: 'ohprog', p: V3(0, -0.95, 0), name: '17-OH-прогестерон', col: PROG },
    andro: { m: 'androstenedione', p: V3(2.5, 0.25, 0), name: 'андростендион', col: '#9FB4FF' },
    testo: { m: 'testosterone', p: V3(5.0, 1.45, 0), name: 'тестостерон', col: ANDR },
    estrone: { m: 'estrone', p: V3(5.0, -0.95, 0), name: 'эстрон', col: ESTR },
    dht: { m: 'dht', p: V3(7.5, 2.15, 0), name: 'дигидротестостерон', col: '#3A6CFF' },
    e2: { m: 'estradiol', p: V3(7.5, -0.15, 0), name: 'эстрадиол', col: ESTR },
  };
  Object.values(NODE).forEach((n) => { n.g = fit(n.m, 0.62); n.g.position.copy(n.p); G1.add(n.g); n.glow = glowNucleus(G1, n.p.clone().add(V3(0, 0, -0.3)), n.col, 0.08, 14); n.glow.core.visible = false; n.lvl = 0.5; });
  const EDGES = [
    ['chol', 'preg', 'CYP11A1', 'both'], ['preg', 'prog', '3β-ГСД', 'both'], ['preg', 'dhea', 'CYP17', 'both'], ['prog', 'ohp', 'CYP17', 'both'],
    ['dhea', 'andro', '3β-ГСД', 'both'], ['ohp', 'andro', 'CYP17', 'both'], ['andro', 'testo', '17β-ГСД', 'both'],
    ['testo', 'dht', '5α-редуктаза', 'fin'], ['andro', 'estrone', 'ароматаза', 'aro'], ['testo', 'e2', 'ароматаза', 'aro'], ['estrone', 'e2', '17β-ГСД', 'both'],
  ].map(([a, b, enz, tag]) => { const A = NODE[a].p, B = NODE[b].p, d = B.clone().sub(A).normalize(); const f = flowArrow(G1, A.clone().addScaledVector(d, 0.72), B.clone().addScaledVector(d, -0.72), NODE[b].col, { bend: 0.06, r: 0.024 }); return { a, b, enz, tag, f, mid: f.curve.getPoint(0.5), k: 1 }; });
  const xMat = new THREE.MeshBasicMaterial({ color: '#FF3A3A' });
  EDGES.forEach((e) => { if (e.tag === 'both') return; const g = new THREE.Group(); [1, -1].forEach((s) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), xMat); c.rotation.z = s * Math.PI / 4; g.add(c); }); g.position.copy(e.mid).add(V3(0, 0, 0.2)); g.visible = false; G1.add(g); e.cross = g; });
  const drugM = { aro: fit('letrozole', 0.5), fin: fit('finasteride', 0.55) };
  drugM.aro.position.copy(EDGES[8].mid.clone().lerp(EDGES[9].mid, 0.5)).add(V3(-0.6, -0.15, 0.5)); drugM.fin.position.copy(EDGES[7].mid).add(V3(-0.9, 0.55, 0.4));
  Object.values(drugM).forEach((m) => { m.visible = false; G1.add(m); });
  const P1 = Array.from({ length: 60 }, () => ({ s: ball(0.06, '#fff', G1), on: false, t: 0, e: null }));

  /* ---------- 2. ось гипоталамус — гипофиз — гонады ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.16, keep: true });
  const HYP = V3(0, 4.12, 0.08), PIT = V3(0, 3.98, 0.16);
  const brainM = new THREE.Mesh(ell3(0.34, 0.27, 0.36, V3(0, 4.3, 0.02)), glassMat('#C8B8FF', { rim: 0.7, base: 0.04, keep: true })); G2.add(brainM);
  const hypG = glowNucleus(G2, HYP, '#9F7BFF', 0.05, 9), pitG = glowNucleus(G2, PIT, '#7FD6FF', 0.05, 9);
  const TES = [V3(0.1, -0.42, 0.3), V3(-0.1, -0.44, 0.3)], OVA = [V3(0.34, 0.38, 0.05), V3(-0.34, 0.38, 0.05)];
  const gonM = organMat('#E8A0B8', 0.55, { emissiveIntensity: 0.08 });
  const tes = TES.map((p) => { const m = new THREE.Mesh(ell3(0.07, 0.1, 0.07), gonM); m.position.copy(p); G2.add(m); return m; });
  const ova = OVA.map((p) => { const m = new THREE.Mesh(ell3(0.09, 0.06, 0.06), gonM); m.position.copy(p); G2.add(m); return m; });
  const uter = new THREE.Mesh(blobGeo(0.14, 0.17, 0.1, 91, 0.06, 3), organMat('#D86A8A', 0.5)); uter.position.set(0, 0.32, 0.12); G2.add(uter);
  const prost = new THREE.Mesh(ell3(0.08, 0.06, 0.07, V3(0, -0.12, 0.12)), organMat('#C890A0', 0.5)); G2.add(prost);
  const BREAST = [V3(0.45, 2.3, 0.42), V3(-0.45, 2.3, 0.42)];
  const brs = BREAST.map((p) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), organMat('#F2C0C8', 0.5, { transparent: true, opacity: 0.55, depthWrite: false })); m.position.copy(p); m.scale.set(1, 1, 0.55); G2.add(m); return m; });
  const MUSA = V3(1.33, 1.95, 0.02), BONE = V3(0.5, -1.15, 0.05);
  const gonGlow = glowNucleus(G2, V3(0, 0, 0), '#FF8AB0', 0.04, 10);
  const injG = glowNucleus(G2, V3(-1.3, 2.25, 0.12), '#5BE0FF', 0.04, 12), pillG = glowNucleus(G2, V3(0.1, 1.6, 0.35), '#F2C14E', 0.04, 12);
  const mkAx = (gon) => ({
    gnrh: flowArrow(G2, HYP.clone().add(V3(0.04, -0.02, 0.06)), PIT.clone().add(V3(0.04, 0.03, 0.06)), '#9F7BFF', { bend: 1.2, r: 0.008 }),
    lh: flowArrow(G2, PIT.clone().add(V3(0.06, -0.05, 0.05)), gon[0].clone().add(V3(0.05, 0.1, 0.05)), '#7FD6FF', { bend: 0.12, r: 0.013 }),
    fsh: flowArrow(G2, PIT.clone().add(V3(-0.06, -0.05, 0.05)), gon[1].clone().add(V3(-0.05, 0.1, 0.05)), '#7FE0A0', { bend: -0.12, r: 0.013 }),
    fb: flowArrow(G2, gon[0].clone().add(V3(0.14, 0.05, 0.05)), PIT.clone().add(V3(0.1, -0.02, 0.0)), '#FF6A5A', { bend: -0.28, r: 0.011 }),
    tgt1: flowArrow(G2, gon[0].clone().add(V3(0.1, 0, 0.05)), MUSA.clone().add(V3(-0.05, -0.1, 0.1)), ANDR, { bend: -0.2, r: 0.013 }),
    tgt2: flowArrow(G2, gon[1].clone().add(V3(-0.1, 0, 0.05)), BREAST[1].clone().add(V3(0, -0.1, 0.05)), ESTR, { bend: 0.2, r: 0.013 }),
    tgt3: flowArrow(G2, gon[0].clone().add(V3(0.05, -0.05, 0.05)), BONE.clone().add(V3(0, 0.15, 0.1)), '#E8E0C8', { bend: 0.15, r: 0.013 }),
  });
  const AXM = mkAx(TES), AXF = mkAx(OVA);
  const setAx = (A, vis) => Object.values(A).forEach((a) => { a.mesh.visible = vis; if (a.cone) a.cone.visible = vis; });

  /* ---------- 3. ХГЧ и тест на беременность ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const SL = 9.5, SW = 1.5;
  const strip = new THREE.Mesh(new THREE.BoxGeometry(SL, 0.08, SW), new THREE.MeshPhysicalMaterial({ color: 0xd8d6d0, roughness: 0.85, emissive: 0x302c28, emissiveIntensity: 0.3 })); strip.position.set(0.3, -0.04, 0); G3.add(strip);
  const pad = (x, w, col, h = 0.12) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, SW + 0.02), new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.9, emissive: col, emissiveIntensity: 0.06 })); m.position.set(x, h / 2 - 0.02, 0); G3.add(m); return m; };
  pad(-3.85, 1.5, '#C8C0B0', 0.16); const conjPad = pad(-2.45, 1.1, '#8A3A5A', 0.13); pad(4.3, 1.4, '#B8B0A0', 0.18);
  const lineMat = (col) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.05, depthWrite: false });
  const TX = 0.6, CX = 2.4;
  const tLine = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, SW), lineMat('#C0306A')); tLine.position.set(TX, 0.007, 0); G3.add(tLine);
  const cLine = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, SW), lineMat('#C0306A')); cLine.position.set(CX, 0.007, 0); G3.add(cLine);
  // настоящие антитела IgG (PDB 1IGT) — общая геометрия, копии
  const IGS = 0.0042;
  const iggProto = proteinMesh('igg', { scale: IGS, palette: ['#FF8AB0', '#7FD6FF', '#FF8AB0', '#7FD6FF'], cart: { k: 0.5, sub: 2 } });
  const iggHero = proteinMesh('igg', { scale: IGS, palette: ['#FF8AB0', '#7FD6FF', '#FF8AB0', '#7FD6FF'], cart: { k: 0.5 } });
  const iggC = (() => { const p = caPoints('igg', IGS); return p.reduce((a, q) => a.add(q), V3(0, 0, 0)).multiplyScalar(1 / p.length); })();
  const mkIgG = (pal, src = iggProto) => { const w = new THREE.Group(); const g = src.clone(true); g.position.copy(iggC).negate(); w.add(g); if (pal) g.children.forEach((m) => { m.material = m.material.clone(); m.material.color = new THREE.Color(pal).multiplyScalar(0.6); m.material.vertexColors = false; }); return w; };
  const fixedT = Array.from({ length: 5 }, (_, i) => { const a = mkIgG('#9FB4FF'); a.position.set(TX + rand(-0.06, 0.06), 0.33, -0.56 + i * 0.28); a.rotation.set(0, rand(0, 6), Math.PI); G3.add(a); return a; });
  const fixedC = Array.from({ length: 5 }, (_, i) => { const a = mkIgG('#9FE0B0'); a.position.set(CX + rand(-0.06, 0.06), 0.33, -0.56 + i * 0.28); a.rotation.set(0, rand(0, 6), Math.PI); G3.add(a); return a; });
  const hero = mkIgG(null, iggHero); hero.scale.setScalar(2.6); hero.position.set(2.3, 2.0, -0.7); G3.add(hero);
  // ХГЧ (α + β) и конъюгаты (антитело + золото)
  const mkHCG = () => { const g = new THREE.Group(); const a = new THREE.Mesh(blobGeo(0.09, 0.07, 0.07, 101, 0.15, 2), protMat('#FF8AB0', 0.6, { emissiveIntensity: 0.2 })); a.position.x = -0.06; const b = new THREE.Mesh(blobGeo(0.1, 0.08, 0.08, 103, 0.15, 2), protMat('#F2C14E', 0.6, { emissiveIntensity: 0.2 })); b.position.x = 0.07; g.add(a, b); g.visible = false; G3.add(g); return g; };
  const HCG = Array.from({ length: 30 }, () => ({ g: mkHCG(), on: false, x: 0, z: 0, st: 0, conj: null }));
  const goldMat = new THREE.MeshPhysicalMaterial({ color: 0x8a2050, metalness: 0.6, roughness: 0.3, emissive: 0xc0306a, emissiveIntensity: 0.25 });
  const CONJ = Array.from({ length: 26 }, () => { const g = new THREE.Group(); const ab = mkIgG('#C890FF'); ab.scale.setScalar(0.75); const au = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), goldMat); au.position.y = -0.22; g.add(ab, au); g.visible = false; G3.add(g); return { g, on: false, x: 0, z: 0, st: 0, hcg: null }; });
  const URI = Array.from({ length: 40 }, () => ({ s: ball(0.03, '#F2E08A', G3), on: false, x: 0, z: 0 }));
  const hcgBig = new THREE.Group(); { const a = new THREE.Mesh(blobGeo(0.35, 0.28, 0.28, 101, 0.12, 4), protMat('#FF8AB0', 0.55, { emissiveIntensity: 0.12 })); a.position.x = -0.25; const b = new THREE.Mesh(blobGeo(0.4, 0.3, 0.3, 103, 0.12, 4), protMat('#F2C14E', 0.55, { emissiveIntensity: 0.12 })); b.position.x = 0.28; hcgBig.add(a, b); } hcgBig.position.set(4.1, 2.0, -0.7); hcgBig.scale.setScalar(0.75); G3.add(hcgBig);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'synth', labels: true, rot: false, fly: null, msg: null,
    sex: 'm', aro: false, fin: false, lv: { T: 100, E2: 100, DHT: 100 },
    asex: 'm', astate: 'norm', LH: 5, FSH: 5, T: 18, E2: 90, cyc: 0, gsize: 1, sperm: 100, ovul: true,
    preg: 'no', hcg: 2, cap: 0, capC: 0, flowT: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['synth', 'axis', 'preg'][k] === m; }); st.fly = flyTarget(VV(m)[0], VV(m)[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); if (m === 'preg') resetStrip(); }

  // --- синтез
  const RATE = { m: { 'testo>dht': 1, 'andro>estrone': 0.12, 'testo>e2': 0.15, 'estrone>e2': 0.2, 'preg>prog': 0.5 }, f: { 'testo>dht': 0.08, 'andro>estrone': 1, 'testo>e2': 1, 'estrone>e2': 1, 'andro>testo': 0.6, 'preg>prog': 1 } };
  function synthUpdate(dt, t) {
    const R = RATE[st.sex];
    EDGES.forEach((e) => { const key = `${e.a}>${e.b}`; let k = R[key] ?? 1; const blocked = (e.tag === 'aro' && st.aro) || (e.tag === 'fin' && st.fin); e.k = k; e.blocked = blocked; e.f.mat.uniforms.uOn.value = blocked ? 0.08 : 0.25 + 0.8 * k; e.f.mat.uniforms.uTime.value = t; if (e.cross) e.cross.visible = blocked; if (rnd() < dt * 1.6 * k) { const p = P1.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.e = e; p.s.material.color.set(NODE[e.b].col); p.s.visible = true; } } });
    P1.forEach((p) => { if (!p.on) return; p.t += dt * 0.45; const lim = p.e.blocked ? 0.45 : 1; if (p.t >= lim) { p.on = false; p.s.visible = false; if (p.e.blocked) fx.spawn(p.s.position.clone(), V3(0, 0.3, 0.2), C.set('#FF3A3A'), 0.5, 0.5, 1); return; } p.s.position.copy(p.e.f.curve.getPoint(p.t)); });
    // уровни: относительно нормы для пола
    const L = st.sex === 'm' ? { T: st.aro ? 135 : st.fin ? 110 : 100, E2: st.aro ? 15 : 100, DHT: st.fin ? 30 : st.aro ? 125 : 100 } : { T: st.aro ? 125 : 100, E2: st.aro ? 8 : 100, DHT: st.fin ? 30 : 100 };
    Object.keys(L).forEach((k) => { st.lv[k] += (L[k] - st.lv[k]) * Math.min(1, dt * 1.5); });
    const lvlOf = { testo: st.lv.T / 100 * (st.sex === 'm' ? 1 : 0.35), e2: st.lv.E2 / 100 * (st.sex === 'f' ? 1 : 0.3), estrone: st.lv.E2 / 100 * (st.sex === 'f' ? 0.7 : 0.25), dht: st.lv.DHT / 100 * (st.sex === 'm' ? 0.9 : 0.15), prog: st.sex === 'f' ? 0.8 : 0.3 };
    Object.entries(NODE).forEach(([id, n]) => { const v = lvlOf[id] ?? 0.45; n.glow.spr.material.opacity = 0.12 + 0.55 * clamp(v, 0, 1.4) * (0.85 + 0.15 * Math.sin(t * 3 + n.p.x)); n.glow.spr.scale.setScalar(0.6 + 0.7 * clamp(v, 0, 1.4)); n.g.rotation.y += dt * 0.25; });
    drugM.aro.visible = st.aro; drugM.fin.visible = st.fin; Object.values(drugM).forEach((m) => { m.rotation.y += dt * 0.5; });
  }

  // --- ось
  const AX = {
    m: { norm: { LH: 5, FSH: 5, T: 18, E2: 90, g: 1, sp: 100 }, ster: { LH: 0.3, FSH: 0.3, T: 70, E2: 260, g: 0.62, sp: 4 }, hypo: { LH: 0.5, FSH: 0.6, T: 3, E2: 30, g: 0.7, sp: 5 } },
    f: { norm: null, pill: { LH: 2.5, FSH: 2.5, T: 1.0, E2: 110, g: 0.85 }, meno: { LH: 35, FSH: 75, T: 0.7, E2: 40, g: 0.55 } },
  };
  function cycleVals(d) {   // день цикла 0..28
    const fol = Math.exp(-(((d - 12.5) / 2.2) ** 2)), lut = Math.exp(-(((d - 21) / 3.5) ** 2));
    const E2 = 150 + 900 * fol + 450 * lut, LH = 5 + 45 * Math.exp(-(((d - 14) / 0.8) ** 2)), FSH = 5 + 8 * Math.exp(-(((d - 14) / 0.9) ** 2)) + 2.5 * Math.exp(-(((d - 1) / 3) ** 2));
    return { LH, FSH, T: 1.2, E2, g: 1 };
  }
  function axisUpdate(dt, t) {
    const S = st.asex, X = S === 'f' && st.astate === 'norm' ? (st.cyc = (st.cyc + dt * 1.0) % 28, cycleVals(st.cyc)) : AX[S][st.astate];
    const k = Math.min(1, dt * (S === 'f' && st.astate === 'norm' ? 6 : 1.2));
    ['LH', 'FSH', 'T', 'E2'].forEach((q) => { st[q] += (X[q] - st[q]) * k; }); st.gsize += (X.g - st.gsize) * Math.min(1, dt * 0.6);
    if (S === 'm') st.sperm += ((X.sp ?? 100) - st.sperm) * Math.min(1, dt * 0.5);
    st.ovul = S === 'f' && st.astate === 'norm';
    tes.forEach((m) => { m.visible = S === 'm'; m.scale.setScalar(st.gsize); }); ova.forEach((m) => { m.visible = S === 'f'; m.scale.setScalar(st.gsize); }); uter.visible = S === 'f'; prost.visible = S === 'm';
    brs.forEach((m) => { m.visible = S === 'f' || (st.astate === 'ster' && S === 'm'); m.scale.set(S === 'f' ? 1 : 0.7, S === 'f' ? 1 : 0.7, 0.55); });
    setAx(AXM, S === 'm'); setAx(AXF, S === 'f');
    const A = S === 'm' ? AXM : AXF, lv = (v) => clamp(v, 0.04, 1.3);
    const gnrhPulse = st.astate === 'ster' || st.astate === 'hypo' || st.astate === 'pill' ? 0.1 : 0.3 + 0.7 * (Math.sin(t * 2.2) > 0.3 ? 1 : 0.15);
    A.gnrh.mat.uniforms.uOn.value = lv(st.astate === 'meno' ? 1 : gnrhPulse);
    A.lh.mat.uniforms.uOn.value = lv(st.LH / 12); A.fsh.mat.uniforms.uOn.value = lv(st.FSH / 12);
    const sex = S === 'm' ? st.T / 25 : st.E2 / 700;
    A.fb.mat.uniforms.uOn.value = lv(sex * (S === 'f' && st.cyc > 12 && st.cyc < 14.2 && st.astate === 'norm' ? 0.15 : 1) * 0.9);
    A.tgt1.mat.uniforms.uOn.value = lv(S === 'm' ? st.T / 25 : st.T / 3); A.tgt2.mat.uniforms.uOn.value = lv(S === 'm' ? st.E2 / 300 : st.E2 / 600); A.tgt3.mat.uniforms.uOn.value = lv(S === 'm' ? st.T / 25 : st.E2 / 500);
    Object.values(A).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    hypG.spr.material.opacity = 0.2 + 0.5 * A.gnrh.mat.uniforms.uOn.value; pitG.spr.material.opacity = 0.2 + 0.5 * clamp((st.LH + st.FSH) / 40, 0, 1);
    gonGlow.spr.position.copy(S === 'm' ? TES[0].clone().lerp(TES[1], 0.5) : OVA[0].clone().lerp(OVA[1], 0.5)); gonGlow.core.position.copy(gonGlow.spr.position); gonGlow.spr.material.opacity = 0.2 + 0.5 * clamp(S === 'm' ? st.T / 30 : st.E2 / 900, 0, 1);
    injG.spr.material.opacity = st.astate === 'ster' && S === 'm' ? 0.6 + 0.2 * Math.sin(t * 3) : 0; injG.core.visible = st.astate === 'ster' && S === 'm';
    pillG.spr.material.opacity = st.astate === 'pill' && S === 'f' ? 0.6 + 0.2 * Math.sin(t * 3) : 0; pillG.core.visible = st.astate === 'pill' && S === 'f';
    if (S === 'f' && st.astate === 'norm' && Math.abs(st.cyc - 14.3) < 0.05) fx.spawn(G2.localToWorld(OVA[0].clone()), V3(0.2, 0.3, 0.3), C.set('#FFE08A'), 1.2, 0.4, 2);
  }

  // --- тест на беременность
  const HCGL = { no: 2, early: 60, w8: 90000 };
  function resetStrip() { st.flowT = 0; st.cap = 0; st.capC = 0; HCG.forEach((p) => { p.on = false; p.g.visible = false; p.st = 0; p.conj = null; }); CONJ.forEach((c) => { c.on = false; c.g.visible = false; c.st = 0; c.hcg = null; }); URI.forEach((u) => { u.on = false; u.s.visible = false; }); }
  function pregUpdate(dt, t) {
    st.hcg = HCGL[st.preg]; st.flowT += dt;
    const front = Math.min(4.6, -4.4 + st.flowT * 0.9);   // фронт жидкости
    if (rnd() < dt * 10 && st.flowT < 14) { const u = URI.find((x) => !x.on); if (u) { u.on = true; u.x = -4.4; u.z = rand(-0.65, 0.65); u.s.visible = true; } }
    URI.forEach((u) => { if (!u.on) return; u.x += dt * 0.9; if (u.x > front || u.x > 4.6) { u.on = false; u.s.visible = false; return; } u.s.position.set(u.x, 0.06, u.z); });
    // ХГЧ входит с мочой
    const hRate = st.preg === 'no' ? 0 : st.preg === 'early' ? 1.6 : 4;
    if (st.flowT < 9 && rnd() < dt * hRate) { const p = HCG.find((x) => !x.on); if (p) { p.on = true; p.x = -4.4; p.z = rand(-0.6, 0.6); p.st = 0; p.g.visible = true; } }
    // конъюгаты срываются с пада, когда до него дошла жидкость
    if (front > -2.9 && st.flowT < 10 && rnd() < dt * 4) { const c = CONJ.find((x) => !x.on); if (c) { c.on = true; c.x = rand(-2.9, -2.0); c.z = rand(-0.6, 0.6); c.st = 0; c.g.visible = true; } }
    conjPad.material.emissiveIntensity = 0.06 + 0.1 * clamp(1 - st.flowT / 10, 0, 1);
    HCG.forEach((p) => {
      if (!p.on || p.st === 2) return;
      if (p.st === 0) { p.x += dt * 0.75; const c = CONJ.find((c) => c.on && !c.hcg && c.st === 0 && Math.abs(c.x - p.x) < 0.25 && Math.abs(c.z - p.z) < 0.35); if (c) { c.hcg = p; p.st = 1; p.conj = c; fx.spawn(p.g.position.clone().add(G3.position), V3(0, 0.3, 0), C.set('#F2C14E'), 0.5, 0.5, 1); } }
      if (p.st === 1) { p.g.position.copy(p.conj.g.position).add(V3(0.0, -0.4, 0)); return; }
      if (p.x > 4.6) { p.on = false; p.g.visible = false; return; }
      p.g.position.set(p.x, 0.12, p.z); p.g.rotation.y += dt;
    });
    CONJ.forEach((c) => {
      if (!c.on || c.st === 2) return;
      c.x += dt * 0.7;
      if (c.hcg && Math.abs(c.x - TX) < 0.08) { c.st = 2; c.x = TX; st.cap += 1; fx.spawn(V3(80 + TX, 0.6, c.z), V3(0, 0.4, 0), C.set('#C0306A'), 0.6, 0.5, 1.4); c.hcg.st = 2; c.hcg.g.position.set(TX, 0.75, c.z); }
      else if (!c.hcg && Math.abs(c.x - CX) < 0.08 && rnd() < 0.6) { c.st = 2; c.x = CX; st.capC += 1; }
      if (c.x > 4.6) { c.on = false; c.g.visible = false; return; }
      c.g.position.set(c.x, c.st === 2 ? 1.05 : 0.42, c.z); c.g.rotation.y = c.st === 2 ? 0 : c.g.rotation.y + dt * 0.8;
    });
    tLine.material.opacity = 0.04 + 0.9 * clamp(st.cap / 10, 0, 1); cLine.material.opacity = 0.04 + 0.9 * clamp(st.capC / 8, 0, 1);
    if (st.flowT > 20) resetStrip();
    hero.rotation.y += dt * 0.3; hcgBig.rotation.y += dt * 0.4;
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'synth') synthUpdate(dt, t);
    if (st.mode === 'axis') axisUpdate(dt, t);
    if (st.mode === 'preg') pregUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'axis') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: st.asex === 'm' ? 'ЛГ, ФСГ, тестостерон; серое — норма' : 'ЛГ, ФСГ, эстрадиол; серое — норма', x0: 10 });
      const bar = (y, v, max, lo, hi, col, name) => { const X = (u) => A.X(clamp(u / max, 0, 1)); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(X(lo), y - 6, X(hi) - X(lo), 12); ctx.fillStyle = col; ctx.fillRect(A.X(0), y - 3, X(v) - A.X(0), 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(name, A.X(0) + 2, y - 8); };
      bar(h * 0.36, st.LH, 80, 2, 10, '#7FD6FF', 'ЛГ'); bar(h * 0.58, st.FSH, 80, 2, 10, '#7FE0A0', 'ФСГ');
      if (st.asex === 'm') bar(h * 0.8, st.T, 80, 10, 30, ANDR, 'тестостерон'); else bar(h * 0.8, st.E2, 1600, 100, 1300, ESTR, 'эстрадиол');
      return;
    }
    if (st.mode === 'preg') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'ХГЧ, мЕд/мл (лог.); пунктир — порог теста', xl: 'недели от зачатия, 0–20' });
      const hc = (wk) => wk < 1.3 ? 1 : Math.min(10 ** (1 + (wk - 1.3) * 0.9), 1e5 * Math.exp(-(((wk - 9) / 6) ** 2)) + 2e4 * smooth(9, 14, wk));
      const Y = (v) => A.Y(clamp(Math.log10(Math.max(v, 1)) / 5.2, 0, 1)), X = (wk) => A.X(wk / 20);
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(0), Y(25)); ctx.lineTo(A.X(1), Y(25)); ctx.stroke(); ctx.setLineDash([]);
      plotLine(ctx, A, (u) => clamp(Math.log10(Math.max(hc(u * 20), 1)) / 5.2, 0, 1), '#F2C14E');
      const wk = st.preg === 'early' ? 2.0 : st.preg === 'w8' ? 8 : -1; if (wk > 0) { ctx.fillStyle = '#FF6FA8'; ctx.beginPath(); ctx.arc(X(wk), Y(hc(wk)), 4, 0, 7); ctx.fill(); }
      return;
    }
    scopeShow(false);
  }

  const STXT = {
    m: '<b>Половые стероиды</b> делаются из холестерина. <b>CYP11A1</b> в митохондриях отрезает боковую цепь — получается прегненолон; дальше <b>CYP17</b> (17α-гидроксилаза и 17,20-лиаза) убирает ещё два углерода, <b>3β-ГСД</b> и <b>17β-ГСД</b> доводят до <b>тестостерона</b>. У мужчин 95% тестостерона делают <b>клетки Лейдига</b> в яичке по сигналу ЛГ. В тканях-мишенях (простата, кожа, волосяные луковицы) <b>5α-редуктаза</b> превращает его в в 2–3 раза более сильный <b>дигидротестостерон</b> (ДГТ); небольшая часть превращается <b>ароматазой</b> (в жировой ткани) в эстрадиол — он нужен мужчинам для костей и закрытия зон роста.',
    f: 'В яичнике работают <b>две клетки, два гормона</b>. Клетки теки по сигналу ЛГ делают из холестерина андростендион (у них нет ароматазы); он переходит в соседние клетки гранулёзы, где по сигналу ФСГ <b>ароматаза</b> (CYP19) превращает андрогены в эстрогены: андростендион → эстрон, тестостерон → <b>эстрадиол</b> (главный эстроген). После овуляции жёлтое тело делает много <b>прогестерона</b>. Ароматаза отщепляет углерод C19 и делает кольцо A ароматическим — поэтому у эстрогенов кольцо как у фенола (с OH-группой).',
    aro: '<b>Летрозол</b> (и анастрозол) блокируют ароматазу: эстрогены почти исчезают. Так лечат гормонозависимый рак молочной железы у женщин после менопаузы, когда эстрогены образуются только ароматазой в жировой ткани. Андрогены накапливаются, кости теряют кальций (нужен контроль остеопороза).',
    fin: '<b>Финастерид</b> блокирует 5α-редуктазу (тип 2): ДГТ падает примерно на 70%, а тестостерон даже немного растёт. Простата уменьшается — им лечат доброкачественную гиперплазию простаты; в малой дозе — облысение по мужскому типу. Мальчики с врождённым дефицитом 5α-редуктазы рождаются с недоразвитыми наружными половыми органами — их формированию нужен именно ДГТ.',
  };
  const ASTATE = { m: { norm: 'Норма', ster: 'Анаболические стероиды', hypo: 'Гипогонадизм' }, f: { norm: 'Норма (цикл)', pill: 'Комбинированные контрацептивы', meno: 'Менопауза' } };
  const ATXT = {
    m: { norm: '<b>Ось гипоталамус — гипофиз — яички.</b> Гипоталамус выпускает <b>гонадолиберин</b> импульсами (поток мигает), гипофиз отвечает <b>ЛГ</b> и <b>ФСГ</b>. ЛГ включает синтез тестостерона в клетках Лейдига, ФСГ вместе с высоким тестостероном внутри яичка поддерживает созревание сперматозоидов в клетках Сертоли (они же делают ингибин, который тормозит ФСГ). Тестостерон по обратной связи тормозит гипоталамус и гипофиз (красная стрелка), строит мышцы и кости, ведёт рост волос и голос.',
      ster: '<b>Анаболические стероиды</b> (тестостерон и его производные в больших дозах): в крови андрогенов в несколько раз больше нормы — мышцы растут быстрее. Но обратная связь глушит гипоталамус и гипофиз: <b>ЛГ и ФСГ почти ноль</b>, собственный тестостерон в яичках не делается, <b>яички уменьшаются</b>, сперматогенез останавливается — бесплодие, иногда на годы. Избыток андрогенов ароматизируется в эстрадиол — растёт грудная железа (гинекомастия). Ещё: угри, облысение, повышение гематокрита, давления и холестерина ЛПНП, поражение печени (у таблетированных форм), перепады настроения.',
      hypo: '<b>Вторичный гипогонадизм</b>: гипоталамус или гипофиз не выпускает гонадотропины (опухоль, травма, синдром Каллмана — нейроны ГнРГ не мигрировали в гипоталамус, обычно вместе с потерей обоняния). ЛГ и ФСГ низкие, тестостерон низкий, яички маленькие, нет полового созревания. Лечат тестостероном (для признаков пола) или гонадотропинами/импульсным ГнРГ (если нужна фертильность).' },
    f: { norm: '<b>Ось гипоталамус — гипофиз — яичники.</b> ФСГ растит фолликул, гранулёза делает всё больше эстрадиола. Обычно эстрадиол тормозит гипофиз, но когда он держится высоким около двух суток, обратная связь переключается на <b>положительную</b> — <b>пик ЛГ</b> на 14-й день запускает овуляцию (вспышка). Жёлтое тело делает прогестерон и эстрадиол, затем без беременности распадается. Подробнее — тема «Менструальный цикл» в разделе «Тело».',
      pill: '<b>Комбинированные контрацептивы</b> — этинилэстрадиол (устойчивый к распаду в печени эстроген) + прогестин (например, левоноргестрел). Постоянный уровень гормонов держит обратную связь отрицательной: ФСГ не растит фолликул, <b>пика ЛГ нет — овуляции нет</b>. Прогестин ещё сгущает слизь шейки матки. Собственный эстрадиол низкий, но его работу выполняет этинилэстрадиол из таблетки.',
      meno: '<b>Менопауза</b> (в среднем в 51 год): фолликулы в яичниках закончились, эстрадиол и ингибин падают — тормоза нет, и <b>ФСГ и ЛГ очень высокие</b> (высокий ФСГ подтверждает менопаузу). Без эстрогенов — приливы, сухость слизистых, потеря костной массы (остеопороз), рост риска атеросклероза. Заместительная гормональная терапия снимает симптомы, её назначают индивидуально.' },
  };
  const PREG = { no: 'Не беременна', early: '2 недели после зачатия', w8: '8 недель' };
  const PTXT = {
    no: '<b>Тест на беременность</b> — иммунохроматографическая полоска. Моча впитывается и течёт вправо. В конъюгатной зоне лежат <b>антитела к β-субъединице ХГЧ</b> (фиолетовые), помеченные наночастицами золота (они красно-фиолетовые). На <b>тест-линии</b> закреплены антитела к α-субъединице, на <b>контрольной</b> — антитела против самих антител-конъюгатов. Без ХГЧ конъюгатам не за что зацепиться на тест-линии — они проходят дальше и окрашивают только <b>контрольную</b> полоску: тест сработал, результат отрицательный. Вверху — настоящая структура антитела IgG (PDB 1IGT) и схема ХГЧ.',
    early: '<b>ХГЧ</b> (хорионический гонадотропин) начинает делать трофобласт зародыша после имплантации — на 6–10-й день после зачатия. Он похож на ЛГ (общая α-субъединица) и действует на тот же рецептор: не даёт жёлтому телу распасться, и оно продолжает делать прогестерон, пока через 8–10 недель эту работу не возьмёт плацента. Уровень ХГЧ удваивается каждые 2–3 дня. Молекула ХГЧ с прицепившимся конъюгатом (бутерброд «антитело — ХГЧ — антитело») задерживается на тест-линии — появляется вторая полоска. При 25 мЕд/мл линия ещё бледная.',
    w8: 'На 8–10-й неделе ХГЧ на пике — до 100 000 мЕд/мл и выше: тест-линия яркая сразу. Аналогично работают экспресс-тесты на ковид, грипп и другие антигены. Анализ крови на β-ХГЧ точнее и показывает количество: по скорости роста ХГЧ врач отличает нормальную беременность от внематочной или замершей. Очень высокий ХГЧ бывает при многоплодной беременности и пузырном заносе; ХГЧ также — маркер некоторых опухолей яичка.',
  };
  const L1 = () => st.labels && st.mode === 'synth', L2 = () => st.labels && st.mode === 'axis', L3 = () => st.labels && st.mode === 'preg';
  const labels = [
    ...Object.values(NODE).map((n) => ({ text: n.name, pos: n.p.clone().add(V3(-0.35, -0.82, 0.3)), color: n.col, show: L1 })),
    ...EDGES.map((e) => ({ text: (e.tag === 'both' ? '' : '') + e.enz, pos: e.mid.clone().add(V3(-0.25, 0.22, 0.3)), color: e.tag === 'aro' ? ESTR : e.tag === 'fin' ? '#3A6CFF' : '#B8C4D8', show: () => L1() && (e.tag !== 'both' || st.sex === 'm' ? true : true) })),
    { text: 'летрозол', pos: drugM.aro.position.clone().add(V3(-0.2, -0.65, 0.3)), color: '#FF6A5A', show: () => L1() && st.aro },
    { text: 'финастерид', pos: drugM.fin.position.clone().add(V3(-0.3, 0.6, 0.3)), color: '#FF6A5A', show: () => L1() && st.fin },
    { text: 'гипоталамус (ГнРГ)', pos: HYP.clone().add(V3(40.25, 0.22, 0.1)), color: '#9F7BFF', show: L2 },
    { text: 'гипофиз (ЛГ, ФСГ)', pos: PIT.clone().add(V3(40.3, -0.1, 0.1)), color: '#7FD6FF', show: L2 },
    { text: 'яички', pos: TES[0].clone().add(V3(40.3, -0.05, 0.1)), color: '#E8A0B8', show: () => L2() && st.asex === 'm' },
    { text: 'яичники', pos: OVA[0].clone().add(V3(40.3, 0.05, 0.1)), color: '#E8A0B8', show: () => L2() && st.asex === 'f' },
    { text: 'матка', pos: V3(40 - 0.55, 0.12, 0.3), color: '#D86A8A', show: () => L2() && st.asex === 'f' },
    { text: 'мышцы', pos: MUSA.clone().add(V3(40.25, 0.1, 0.1)), color: ANDR, show: L2 },
    { text: 'кости', pos: BONE.clone().add(V3(40.3, 0, 0.1)), color: '#E8E0C8', show: L2 },
    { text: 'молочные железы', pos: BREAST[1].clone().add(V3(39.1, 0.2, 0.1)), color: ESTR, show: () => L2() && (st.asex === 'f' || st.astate === 'ster') },
    { text: 'обратная связь', pos: V3(40 + 0.75, 2.9, 0.2), color: '#FF6A5A', show: L2 },
    { text: 'инъекции', pos: V3(40 - 1.75, 2.45, 0.2), color: '#5BE0FF', show: () => L2() && st.asex === 'm' && st.astate === 'ster' },
    { text: 'таблетка', pos: V3(40 + 0.35, 1.75, 0.4), color: '#F2C14E', show: () => L2() && st.asex === 'f' && st.astate === 'pill' },
    { text: 'впитывающая зона', pos: V3(80 - 4.4, 0.45, 0.85), color: '#C8C0B0', show: L3 },
    { text: 'конъюгат: антитело + золото', pos: V3(80 - 3.0, 0.55, 0.95), color: '#C890FF', show: L3 },
    { text: 'тест-линия', pos: V3(80 + TX - 0.3, -0.35, 0.95), color: '#C0306A', show: L3 },
    { text: 'контроль', pos: V3(80 + CX - 0.2, -0.35, 0.95), color: '#9FE0B0', show: L3 },
    { text: 'антитело IgG', pos: V3(80 + 1.7, 2.95, -0.5), color: '#7FD6FF', show: L3 },
    { text: 'ХГЧ: α + β', pos: V3(80 + 3.75, 2.65, -0.5), color: '#F2C14E', show: L3 },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'synth' ? (st.aro ? STXT.aro : st.fin ? STXT.fin : STXT[st.sex]) : st.mode === 'axis' ? ATXT[st.asex][st.astate] : PTXT[st.preg];
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'synth', label: 'Синтез' }, { id: 'axis', label: 'Ось и регуляция' }, { id: 'preg', label: 'ХГЧ и тест' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'Железа и лекарства'), h('div', { class: 'gctl' }, seg([{ id: 'm', label: 'Яичко' }, { id: 'f', label: 'Яичник' }], () => st.sex, (v) => { st.sex = v; refs.setInfo(); }), toggle('Летрозол', () => st.aro, (v) => { st.aro = v; refs.setInfo(); }), toggle('Финастерид', () => st.fin, (v) => { st.fin = v; refs.setInfo(); })));
      else if (st.mode === 'axis') box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg([{ id: 'm', label: 'Мужчина' }, { id: 'f', label: 'Женщина' }], () => st.asex, (v) => { st.asex = v; st.astate = 'norm'; refs.rebuild(); refs.setInfo(); }), seg(Object.entries(ASTATE[st.asex]).map(([id, label]) => ({ id, label })), () => st.astate, (v) => { st.astate = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Моча'), h('div', { class: 'gctl' }, seg(Object.entries(PREG).map(([id, label]) => ({ id, label })), () => st.preg, (v) => { st.preg = v; resetStrip(); refs.setInfo(); }), button('Новый тест', () => resetStrip())));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['synth', 'axis', 'preg'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'axis') {
      const base = [['ЛГ', f1(st.LH), 'мЕд/мл'], ['ФСГ', f1(st.FSH), 'мЕд/мл']];
      return st.asex === 'm' ? [...base, ['Тестостерон', Math.round(st.T), 'нмоль/л'], ['Сперматогенез', Math.round(st.sperm), '%']] : [...base, ['Эстрадиол', Math.round(st.E2), 'пмоль/л'], st.astate === 'norm' ? ['День цикла', Math.floor(st.cyc) + 1, ''] : ['Овуляция', 'нет', '']];
    }
    if (st.mode === 'preg') return [['ХГЧ', st.hcg >= 1000 ? Math.round(st.hcg).toLocaleString('ru-RU') : Math.round(st.hcg), 'мЕд/мл'], ['Тест-линия', st.cap >= 3 ? 'есть' : 'нет', ''], ['Контроль', st.capC >= 2 ? 'есть' : '…', '']];
    return [['Тестостерон', Math.round(st.lv.T), '% нормы'], ['Эстрадиол', Math.round(st.lv.E2), '% нормы'], ['ДГТ', Math.round(st.lv.DHT), '% нормы']];
  }
  const self = {
    mobZoom: 0.95, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF6FA8',
    kicker: 'Биохимия · гормоны', title: 'Половые гормоны и беременность',
    lede: 'Тестостерон и эстрадиол отличаются всего одним углеродом и кольцом — а определяют, как растёт тело; и одна молекула ХГЧ в моче даёт вторую полоску на тесте.',
    notes: `
      <div><h2>Половые гормоны</h2>
        <p><b>Андрогены</b> (C19): тестостерон, дигидротестостерон, андростендион, ДГЭА (в основном из надпочечников). <b>Эстрогены</b> (C18, ароматическое кольцо A): эстрадиол, эстрон, эстриол (при беременности — из плаценты). <b>Прогестины</b> (C21): прогестерон. Все — из холестерина; ключевой регулируемый этап — доставка холестерина в митохондрию белком StAR.</p>
        <h3>Транспорт и действие</h3><p>В крови связаны с глобулином, связывающим половые гормоны (ГСПГ), и альбумином. Действуют через ядерные рецепторы (AR, ERα/β, PR): гормон-рецепторный комплекс садится на ДНК и меняет транскрипцию. При мутации рецептора андрогенов развивается синдром нечувствительности к андрогенам.</p>
        <h3>Регуляция</h3><ul><li>Импульсный ГнРГ → ЛГ, ФСГ; постоянный — подавляет (аналоги ГнРГ при раке простаты, эндометриозе, преждевременном половом созревании).</li><li>Отрицательная обратная связь стероидами и ингибином; у женщин в середине цикла — положительная (пик ЛГ).</li></ul>
        <h3>ХГЧ</h3><p>Гликопротеин из α-субъединицы (общей с ЛГ, ФСГ, ТТГ) и β-субъединицы (своей — по ней и определяют). Поддерживает жёлтое тело, у плода мужского пола стимулирует клетки Лейдига.</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы стероидов и лекарств — по химическим формулам; антитела — настоящая структура IgG (PDB 1IGT), ХГЧ — схема из двух субъединиц.</li><li>Уровни гормонов — типичные значения, а не нормы конкретной лаборатории; время ускорено (1 с ≈ 1 день цикла).</li><li>Полоска теста, тело и органы — схемы, не в масштабе.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('synth'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
