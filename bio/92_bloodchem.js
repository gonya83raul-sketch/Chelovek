// @scene bloodchem makeBloodchem | Кровь: pH, белки плазмы, свёртывание | Кровь и печень
/* =========================================================
   БИОХИМИЯ · КРОВЬ: бикарбонатный буфер и кислотно-основное состояние (уравнение Гендерсона — Хассельбаха),
   белки плазмы и электрофорез (реальное антитело IgG 1IGY), каскад свёртывания с реальным фактором Xa (1IQJ),
   тромб в ране, антикоагулянты, фибринолиз
   ========================================================= */
function makeBloodchem() {
  rnd = mulberry(2601);
  const scene = bioStage({ bg: 0x0a0709, rim: 0xff6a6a });
  const VIEW = { ph: flyTarget(V3(0.3, -2.3, 0), V3(0.8, -0.6, 17)), prot: flyTarget(V3(40.4, -2.6, 0), V3(40.9, -0.8, 19)), coag: flyTarget(V3(79.6, -2.3, 0), V3(80.2, -0.5, 18.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.ph.pos);
  const controls = makeControls(camera, VIEW.ph.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);
  const molAt = (parent, m, pos, R, o = {}) => { const s = molFit(m, R); const g = molMesh(m, { scale: s, ...o }); const w = new THREE.Group(); w.add(g); w.position.copy(pos); parent.add(w); return w; };

  /* ---------- 1. кислотно-основное состояние ---------- */
  const G1 = new THREE.Group(); G1.position.set(1.0, 0, 0); scene.add(G1);
  const EQ = [['co2', -3.9, 'CO₂'], ['h2o', -2.7, 'H₂O'], ['h2co3', -0.6, 'H₂CO₃'], ['hp', 1.6, 'H⁺'], ['hco3', 3.2, 'HCO₃⁻']];
  const eqY = 1.25;
  const eqM = EQ.map(([id, x]) => {
    if (id === 'hp') { const g = new THREE.Group(); g.position.set(x, eqY, 0); G1.add(g); glowNucleus(g, V3(0, 0, 0), '#FFE070', 0.12, 6); return g; }
    if (id === 'hco3') { const m = MOL('h2co3'); return molAt(G1, m, V3(x, eqY, 0), 0.62, { idx: new Set([0, 1, 2, 3, 4]) }); }
    return molAt(G1, MOL(id), V3(x, eqY, 0), id === 'h2o' ? 0.36 : 0.55);
  });
  const eqArrows = [[-2.15, -1.25], [0.15, 1.15]].map(([a, b]) => [flowArrow(G1, V3(a, eqY + 0.12, 0), V3(b, eqY + 0.12, 0), '#9FB4FF', { bend: 0, r: 0.02 }), flowArrow(G1, V3(b, eqY - 0.12, 0), V3(a, eqY - 0.12, 0), '#9FB4FF', { bend: 0, r: 0.02 })]);
  // «пробирка крови» с частицами: CO₂ (серые), H⁺ (жёлтые), HCO₃⁻ (голубые)
  const tubeM = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 2.3, 48, 1, true), glassMat(0xff8a8a, { rim: 0.25, base: 0.01 })); tubeM.rotation.z = Math.PI / 2; tubeM.position.set(-1.0, -1.15, 0); tubeM.scale.set(1, 1.7, 0.75); G1.add(tubeM);
  const NPa = 240; const pts = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), NPa); G1.add(pts);
  const pp = Array.from({ length: NPa }, () => ({ p: V3(rand(-2.8, 0.8), rand(-1.9, -0.4), rand(-0.6, 0.6)), v: randUnit().multiplyScalar(0.3), k: 0 }));
  // шкала pH
  const gauge = new THREE.Group(); gauge.position.set(3.1, -1.3, 0); G1.add(gauge);
  for (let i = 0; i < 40; i++) { const u = i / 39, a = Math.PI * (0.95 - 0.9 * u); const c = new THREE.Color().setHSL(0.0 + 0.62 * u, 0.75, 0.5); const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: (u > 0.5 && u < 0.6) ? 1 : 0.55 })); s.position.set(Math.cos(a) * 1.3, Math.sin(a) * 1.3, 0); s.rotation.z = a - Math.PI / 2; gauge.add(s); }
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.15, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff })); needle.geometry.translate(0, 0.57, 0); gauge.add(needle);
  glowNucleus(gauge, V3(0, 0, 0), '#FFFFFF', 0.06, 4);
  const lung = new THREE.Mesh(blobGeo(0.45, 0.6, 0.35, 3, 0.1, 4), organMat('#E8A0A8', 0.45)); lung.position.set(-4.6, -1.1, 0); G1.add(lung);
  const kid = new THREE.Mesh(blobGeo(0.32, 0.5, 0.28, 9, 0.06, 4), organMat('#A04A3A', 0.5)); kid.position.set(0.95, -2.35, 0.3); kid.visible = false;
  const lungFlow = flowArrow(G1, V3(-3.3, -0.9, 0.2), V3(-4.2, -0.9, 0.2), '#B8C4D8', { bend: 0.4, r: 0.025 });
  const COND = [
    { id: 'n', name: 'Норма', c: 40, b: 24, cc: 40, cb: 24 },
    { id: 'ra', name: 'Дых. ацидоз', c: 70, b: 26, cc: 70, cb: 34 },
    { id: 'rl', name: 'Дых. алкалоз', c: 24, b: 22, cc: 24, cb: 17 },
    { id: 'ma', name: 'Метаб. ацидоз', c: 40, b: 12, cc: 26, cb: 12 },
    { id: 'ml', name: 'Метаб. алкалоз', c: 41, b: 36, cc: 50, cb: 36 },
  ];
  const pH = (c, b) => 6.1 + Math.log10(b / (0.0307 * c));

  /* ---------- 2. белки плазмы ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const gel = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.0, 0.25), new THREE.MeshPhysicalMaterial({ color: 0x1a2030, roughness: 0.25, clearcoat: 1, transmission: 0, transparent: true, opacity: 0.85 })); gel.position.set(0.6, -1.25, 0); G2.add(gel);
  const well = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.3), new THREE.MeshBasicMaterial({ color: 0x050508 })); well.position.set(4.9, -1.25, 0.02); G2.add(well);
  const BANDS = [['альбумин', -3.0, '#7FD6FF'], ['α₁', -1.6, '#7FE0A0'], ['α₂', -0.5, '#F2C14E'], ['β', 0.7, '#FF9A5C'], ['γ', 2.6, '#FF6AA0']];
  const bandM = BANDS.map(([, x, c]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.78, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })); m.position.set(x + 0.6, -1.25, 0.02); G2.add(m); return m; });
  const plus = glowNucleus(G2, V3(-4.4 + 0.6, -1.25, 0.2), '#FF6A6A', 0.05, 5), minus = glowNucleus(G2, V3(4.6 + 0.6, -1.25, 0.2), '#6A9AFF', 0.05, 5);
  const PROT = [
    { n: 'норма', f: [60, 4, 9, 10, 17] },
    { n: 'острое воспаление', f: [52, 7, 14, 10, 17] },
    { n: 'нефротический синдром', f: [38, 6, 25, 15, 16] },
    { n: 'цирроз печени', f: [40, 3, 7, 13, 37] },
    { n: 'миеломная болезнь', f: [42, 3, 8, 9, 38], m: true },
  ];
  const igg = proteinMesh('igg', { scale: 0.018, palette: ['#FF8AB0', '#7FD6FF', '#FF8AB0', '#7FD6FF'], cart: { k: 0.5 } }); const iggC = (() => { const pts2 = caPoints('igg', 0.018); return pts2.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts2.length); })();
  const iggW = new THREE.Group(); igg.position.copy(iggC).negate(); iggW.add(igg); iggW.position.set(3.0, 0.85, 0); G2.add(iggW);
  const alb = new THREE.Mesh(blobGeo(0.95, 0.75, 0.42, 4, 0.12, 5), protMat('#7FD6FF', 0.45)); alb.position.set(-2.6, 0.85, 0); G2.add(alb);
  const albL = [0, 1, 2, 3, 4, 5].map((i) => { const m = molAt(G2, MOL(['palmitic', 'bilirubin', 'warfarin', 'thyroxine', 'oleic', 'aspirin'][i]), V3(-2.6 + Math.cos(i * 1.05) * 1.4, 0.85 + Math.sin(i * 1.05) * 0.9, 0.4), 0.38, { hideH: true }); return m; });
  const trf = new THREE.Mesh(blobGeo(0.6, 0.55, 0.42, 8, 0.1, 5), protMat('#FF9A5C', 0.45)); trf.position.set(0.25, 0.9, 0); G2.add(trf);
  const trfFe = [V3(-0.25, 0.1, 0.4), V3(0.3, -0.05, 0.4)].map((p) => glowNucleus(trf, p, '#E0773A', 0.05, 5));

  /* ---------- 3. свёртывание ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const NOD = {
    XII: { p: V3(-4.0, 1.2, 0), n: 'XII → XIIa', c: '#9FB4FF' }, XI: { p: V3(-3.3, 0.5, 0), n: 'XI → XIa', c: '#9FB4FF' }, IX: { p: V3(-2.6, -0.2, 0), n: 'IXa + VIIIa', c: '#9FB4FF' },
    TF: { p: V3(0.1, 1.3, 0), n: 'тканевый фактор + VIIa', c: '#7FE0A0' }, X: { p: V3(-1.4, -0.8, 0), n: 'Xa + Va', c: '#F2C14E' }, II: { p: V3(-0.2, -1.6, 0), n: 'протромбин → тромбин', c: '#FF6A6A' }, FB: { p: V3(1.2, -2.05, 0), n: 'фибриноген → фибрин', c: '#FFB070' },
  };
  const nodeM = {};
  Object.entries(NOD).forEach(([k, d]) => { if (k === 'X') return; const m = new THREE.Mesh(blobGeo(0.32, 0.26, 0.22, k.length * 3 + 1, 0.12, 4), protMat(d.c, 0.45)); m.position.copy(d.p); G3.add(m); nodeM[k] = m; });
  const fxa = proteinMesh('fxa', { scale: 0.034, palette: ['#F2C14E', '#FF9A5C'], cart: { k: 0.5 } }); const fxaC = caPoints('fxa', 0.034).reduce((a, p, i, arr) => a.add(p.clone().multiplyScalar(1 / arr.length)), V3(0, 0, 0));
  const fxaW = new THREE.Group(); fxa.position.copy(fxaC).negate(); fxaW.add(fxa); fxaW.position.copy(NOD.X.p); G3.add(fxaW); nodeM.X = fxaW;
  const CE = [['XII', 'XI'], ['XI', 'IX'], ['IX', 'X'], ['TF', 'X'], ['X', 'II'], ['II', 'FB']].map(([a, b]) => { const pa = NOD[a].p, pb = NOD[b].p; const d = pb.clone().sub(pa).normalize(); return { a, b, A: flowArrow(G3, pa.clone().addScaledVector(d, a === 'X' ? 0.75 : 0.42), pb.clone().addScaledVector(d, b === 'X' ? -0.75 : -0.42), '#F2C14E', { bend: 0.12, r: 0.022 }) }; });
  const toClot = flowArrow(G3, NOD.FB.p.clone().add(V3(0.45, 0.05, 0)), V3(3.0, -1.2, 0.2), '#FFB070', { bend: -0.2, r: 0.022 });
  const fbk = flowArrow(G3, NOD.II.p.clone().add(V3(-0.2, 0.35, 0.3)), NOD.IX.p.clone().add(V3(0.35, -0.1, 0.3)), '#FF6A6A', { bend: -0.35, r: 0.015, head: true });
  // сосуд с раной
  const wallMat = organMat('#B04A50', 0.45, { emissiveIntensity: 0.05 });
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 2.2), wallMat); wallL.position.set(2.7, -2.2, 0); G3.add(wallL);
  const wallR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 2.2), wallMat); wallR.position.set(6.3, -2.2, 0); G3.add(wallR);
  const coll = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 2.2), organMat('#E0D0B0', 0.4)); coll.position.set(4.5, -2.32, 0); G3.add(coll);
  const vesselTop = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.06, 2.2), glassMat(0xff8a8a, { rim: 0.2, base: 0.01 })); vesselTop.position.set(4.5, 0.9, 0); G3.add(vesselTop);
  const RBC = Array.from({ length: 26 }, (_, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.085, 10, 20), organMat('#E03A3A', 0.5, { emissiveIntensity: 0.12 })); G3.add(m); return { m, x: rand(1.5, 7.5), y: rand(-1.5, 0.6), z: rand(-0.8, 0.8), s: rand(0.7, 1.2), trap: 0, r: rand(0, 6) }; });
  const NPL = 34; const PLT = Array.from({ length: NPL }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), organMat('#F2D06A', 0.5, { emissiveIntensity: 0.15 })); m.scale.set(1, 0.45, 1); G3.add(m); const a = rand(0, Math.PI * 2), r = Math.sqrt(rnd()) * 0.7; return { m, home: V3(4.5 + Math.cos(a) * r * 1.1, -1.9 + Math.abs(Math.sin(a)) * r * 0.9 + rnd() * 0.2, rand(-0.7, 0.7)), x: rand(1.5, 7.5), y: rand(-1.4, 0.6), z: rand(-0.8, 0.8), k: i / NPL }; });
  const FIBN = 70; const fibMat = new THREE.MeshBasicMaterial({ color: 0x9a7a48, transparent: true, opacity: 0.75 });
  const FIB = Array.from({ length: FIBN }, () => { const a = V3(rand(3.1, 5.9), rand(-2.0, -0.1), rand(-0.9, 0.9)), b = a.clone().add(randUnit().multiplyScalar(rand(0.6, 1.3))); b.y = Math.max(-2.0, b.y); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 5), fibMat); const d = b.clone().sub(a); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); m.userData.L = d.length(); m.scale.set(1, 0.001, 1); G3.add(m); return { m, th: rnd() }; });
  const warfM = molAt(G3, MOL('warfarin'), V3(-3.6, -1.6, 0.3), 0.55, { hideH: true }), vitK = molAt(G3, MOL('phylloquinone'), V3(-2.4, -2.3, 0.3), 0.75, { hideH: true });
  const glaM = molAt(G3, MOL('gla'), V3(-4.5, -2.3, 0.3), 0.45, { hideH: true });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'ph', labels: true, rot: false, fly: null, msg: null, cond: 0, comp: false, pc: 40, hb: 24, prot: 0, inj: 0, fib: 0, plug: 0, thr: 0, hep: false, warf: false, hemo: false, asp: false, lysis: false, txa: false, sel: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['ph', 'prot', 'coag'][k] === m; }); st.fly = VIEW[m]; st.msg = null; if (m === 'coag') injure(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function injure() { st.inj = 0; st.fib = 0; st.plug = 0; RBC.forEach((r) => { r.trap = 0; }); }
  function setCond(i) { st.cond = i; const C = COND[i]; st.pc = st.comp ? C.cc : C.c; st.hb = st.comp ? C.cb : C.b; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D();
  const act = (t0, t) => smooth(t0, t0 + 2.0, t);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'ph') {
      const ph = pH(st.pc, st.hb); st.ph = ph;
      const hN = Math.round(Math.min(90, 24 * Math.pow(10, -(ph - 7.4) * 2.2))), cN = Math.round(Math.min(90, st.pc * 0.9)), bN = Math.round(Math.min(90, st.hb * 2.4));
      pp.forEach((q, i) => { q.k = i < hN ? 1 : i < hN + cN ? 2 : i < hN + cN + bN ? 3 : 0; q.p.addScaledVector(q.v, dt); if (q.p.x < -2.9 || q.p.x > 0.9) q.v.x *= -1; if (q.p.y < -2.0 || q.p.y > -0.35) q.v.y *= -1; if (Math.abs(q.p.z) > 0.65) q.v.z *= -1; dm.position.copy(q.p).add(V3(0, 0, 0)); dm.scale.setScalar(q.k === 0 ? 0.0001 : q.k === 1 ? 0.045 : 0.06); dm.updateMatrix(); pts.setMatrixAt(i, dm.matrix); pts.setColorAt(i, new THREE.Color(q.k === 1 ? '#FFE070' : q.k === 2 ? '#8A8A9A' : '#7FD6FF')); });
      pts.instanceMatrix.needsUpdate = true; if (pts.instanceColor) pts.instanceColor.needsUpdate = true;
      const u = clamp((ph - 6.9) / 0.9, 0, 1); const ang = Math.PI * (0.95 - 0.9 * u) - Math.PI / 2; needle.rotation.z += (ang - needle.rotation.z) * Math.min(1, dt * 3);
      const dir = Math.sign(st.pc - 40) * 0.5 + Math.sign(24 - st.hb) * 0.5; // сдвиг равновесия
      eqArrows.forEach(([f, b]) => { f.mat.uniforms.uTime.value = t; b.mat.uniforms.uTime.value = t; f.mat.uniforms.uOn.value = 0.35 + 0.3 * Math.max(0, dir); b.mat.uniforms.uOn.value = 0.35 + 0.3 * Math.max(0, -dir); });
      eqM.forEach((g, i) => { g.rotation.y = t * 0.4 + i; });
      eqM[3].scale.setScalar(0.8 + 0.6 * clamp((7.6 - ph) / 0.6, 0, 1));
      lungFlow.mat.uniforms.uTime.value = t; lungFlow.mat.uniforms.uOn.value = clamp(0.7 * 40 / st.pc, 0.15, 1.2); lung.scale.setScalar(1 + 0.06 * Math.sin(t * (st.pc < 35 ? 5 : st.pc > 55 ? 1.2 : 2.5)));
    }
    if (st.mode === 'prot') {
      const f = PROT[st.prot].f;
      bandM.forEach((m, i) => { const w = 0.25 + f[i] / 60 * 0.9; m.scale.x += (w * (PROT[st.prot].m && i === 4 ? 0.45 : 1) - m.scale.x) * Math.min(1, dt * 3); m.material.opacity = 0.25 + Math.min(0.75, f[i] / 40) + (PROT[st.prot].m && i === 4 ? 0.2 : 0); });
      iggW.rotation.y = t * 0.3; alb.rotation.y = Math.sin(t * 0.4) * 0.4; trf.rotation.y = t * 0.25;
      albL.forEach((m, i) => { m.rotation.y = t * 0.5 + i; m.position.y = 0.85 + Math.sin(i * 1.05) * 0.9 + Math.sin(t + i) * 0.04; });
      alb.scale.setScalar(st.prot === 2 || st.prot === 3 ? 0.85 : 1);
    }
    if (st.mode === 'coag') {
      st.inj += dt; const T = st.inj;
      const w = { VII: st.warf ? 0.3 : 1, IX: st.warf ? 0.3 : 1, X: st.warf ? 0.3 : 1, II: st.warf ? 0.3 : 1, VIII: st.hemo ? 0.1 : 1 };
      const ext = act(0.3, T) * w.VII, intr = act(1.2, T) * Math.min(w.VIII, w.IX);
      const xa = clamp(0.55 * ext + 0.7 * intr, 0, 1) * w.X * (st.hep ? 0.2 : 1);
      const thr = xa * w.II * (st.hep ? 0.25 : 1) * act(0.8, T); st.thr = thr;
      st.plug += dt * 0.5 * (st.asp ? 0.35 : 1) * (1 - st.plug) * (T > 0.2 ? 1 : 0);
      const lyse = st.lysis && !st.txa && T > 12;
      st.fib += dt * (0.22 * thr * (1 - st.fib)) - (lyse ? dt * 0.18 * st.fib : 0); st.fib = clamp(st.fib, 0, 1);
      const nodeAct = { XII: act(1.2, T) * (st.hemo ? 1 : 1), XI: act(1.6, T), IX: intr, TF: ext, X: xa, II: thr, FB: st.fib };
      Object.entries(nodeM).forEach(([k, m]) => { m.traverse((o) => { if (o.material && o.material.emissiveIntensity !== undefined && !o.material.vertexColors) o.material.emissiveIntensity = 0.02 + 0.12 * nodeAct[k]; }); if (k !== 'X') m.scale.setScalar(1 + 0.12 * nodeAct[k] * (0.6 + 0.4 * Math.sin(t * 4))); });
      fxaW.rotation.y = t * 0.3;
      CE.forEach((E) => { E.A.mat.uniforms.uTime.value = t; E.A.mat.uniforms.uOn.value = 0.08 + 0.55 * nodeAct[E.a]; });
      toClot.mat.uniforms.uTime.value = t; toClot.mat.uniforms.uOn.value = 0.08 + 0.55 * thr; fbk.mat.uniforms.uTime.value = t; fbk.mat.uniforms.uOn.value = 0.4 * thr;
      FIB.forEach((F) => { const s = smooth(F.th * 0.85, F.th * 0.85 + 0.15, st.fib); F.m.scale.set(1, Math.max(0.001, s * F.m.userData.L), 1); F.m.visible = s > 0.01; });
      PLT.forEach((P) => { const stuck = st.plug > P.k; if (stuck) { P.m.position.lerp(P.home, 1 - Math.exp(-dt * 2.5)); } else { P.x += dt * 1.6; if (P.x > 7.6) P.x = 1.4; P.m.position.set(P.x, P.y + Math.sin(t * 2 + P.k * 9) * 0.05, P.z); } P.m.material.emissiveIntensity = stuck ? 0.16 : 0.06; });
      RBC.forEach((r) => { const inNet = r.x > 3.3 && r.x < 5.7 && r.y < -0.3; if (inNet && st.fib > 0.45 && rnd() < dt * 0.6) r.trap = 1; if (st.fib < 0.2) r.trap = 0; if (!r.trap) { r.x += dt * 1.5 * r.s; if (r.x > 7.6) { r.x = 1.4; r.y = rand(-1.5, 0.6); } } r.m.position.set(r.x, r.y + Math.sin(t * 1.3 + r.r) * 0.06, r.z); r.m.rotation.set(r.r + t * (r.trap ? 0 : 0.8), r.r, 0); });
      warfM.visible = vitK.visible = glaM.visible = st.warf; if (st.warf) { warfM.rotation.y = t * 0.6; vitK.rotation.y = -t * 0.4; glaM.rotation.y = t * 0.5; }
      coll.material.emissiveIntensity = 0.05 + 0.2 * (1 - st.plug);
      if (T > 26) injure();
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, hh) {
    if (st.mode === 'coag') { scopeShow(false); return; } scopeShow(true);
    if (st.mode === 'ph') {
      const A = plotAxes(ctx, w, hh, { title: `pH при HCO₃⁻ = ${Math.round(st.hb)} ммоль/л`, xl: 'pCO₂ 15–90 мм рт. ст.', yl: 'pH 6,9–7,8' });
      const Y = (p) => clamp((p - 6.9) / 0.9, 0, 1);
      ctx.fillStyle = 'rgba(127,224,160,.12)'; ctx.fillRect(A.X(0), A.Y(Y(7.45)), A.X(1) - A.X(0), A.Y(Y(7.35)) - A.Y(Y(7.45)));
      plotLine(ctx, A, (u) => Y(pH(15 + u * 75, 24)), 'rgba(255,255,255,.3)', { lw: 1.2, dash: [3, 3] });
      plotLine(ctx, A, (u) => Y(pH(15 + u * 75, st.hb)), '#7FD6FF');
      ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X((st.pc - 15) / 75), A.Y(Y(st.ph)), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(127,224,160,.8)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText('норма 7,35–7,45', A.X(0.68), A.Y(Y(7.47)));
    } else {
      const A = plotAxes(ctx, w, hh, { title: 'электрофореграмма: ' + PROT[st.prot].n, xl: '+   альб  α1  α2  β   γ   −', yl: '' });
      const f = PROT[st.prot].f, pos = [0.14, 0.32, 0.45, 0.6, 0.82], wid = [0.035, 0.03, 0.035, 0.04, st.prot === 4 ? 0.018 : 0.07];
      const g = (u) => f.reduce((s, v, i) => s + v / 60 * Math.exp(-(((u - pos[i]) / wid[i]) ** 2)) * (i === 4 && st.prot !== 4 ? 0.55 : i === 4 ? 1.1 : 1), 0);
      plotLine(ctx, A, (u) => clamp(g(u) * 0.95, 0, 1), '#FF8AB0', { n: 160 });
      const f0 = PROT[0].f; plotLine(ctx, A, (u) => clamp(f0.reduce((s, v, i) => s + v / 60 * Math.exp(-(((u - pos[i]) / (i === 4 ? 0.07 : wid[i])) ** 2)) * (i === 4 ? 0.55 : 1), 0) * 0.95, 0, 1), 'rgba(255,255,255,.3)', { lw: 1.1, dash: [3, 3], n: 160 });
    }
  }
  const TXT = {
    ph: '<b>pH крови</b> держится в узких пределах 7,35–7,45; ниже — <b>ацидоз</b>, выше — <b>алкалоз</b>. Главный буфер плазмы — <b>бикарбонатный</b>: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ (в эритроцитах реакцию ускоряет карбоангидраза). Его сила в том, что обе части регулируются: <b>CO₂</b> выдыхают лёгкие (за минуты), а <b>HCO₃⁻</b> удерживают или выводят почки (за дни). pH задаёт их отношение: pH = 6,1 + lg([HCO₃⁻] / 0,03·pCO₂); норма — 24 ммоль/л к 40 мм рт. ст., то есть 20 : 1. Другие буферы — гемоглобиновый, белковый, фосфатный.',
    prot: '<b>Белки плазмы</b>: 65–85 г/л. При <b>электрофорезе</b> на бумаге или в геле белки движутся в электрическом поле к аноду (+) с разной скоростью и разделяются на 5 фракций: <b>альбумины</b> (55–65%) — держат онкотическое давление (воду в сосудах) и переносят жирные кислоты, билирубин, гормоны, лекарства; <b>α₁</b> (антитрипсин, ЛПВП), <b>α₂</b> (гаптоглобин, церулоплазмин, макроглобулин), <b>β</b> (трансферрин с железом, ЛПНП, компоненты комплемента), <b>γ-глобулины</b> — антитела (реальная структура IgG, PDB 1IGY).',
    coag: '<b>Свёртывание крови</b> — каскад протеолиза: каждый активированный фактор (сериновая протеаза) активирует много молекул следующего — сигнал усиливается в тысячи раз. <b>Внешний путь</b> запускает тканевый фактор из повреждённой стенки (VIIa), <b>внутренний</b> — контакт с коллагеном (XII → XI → IX + VIII). Оба сходятся на <b>факторе Xa</b> (реальная структура 1IQJ), который с Va превращает протромбин в <b>тромбин</b>. Тромбин режет фибриноген — нити <b>фибрина</b> сплетаются в сеть, укрепляют тромбоцитарную пробку и ловят эритроциты. Тромбин по обратной связи ускоряет каскад (красная стрелка).',
  };
  const CTXT = [null,
    '<b>Дыхательный ацидоз</b>: CO₂ копится из-за плохой вентиляции (ХОБЛ, угнетение дыхательного центра опиоидами, тяжёлая астма). pH падает. <b>Компенсация</b> почками: они выводят больше H⁺ и сохраняют HCO₃⁻ — за 3–5 дней pH возвращается к норме.',
    '<b>Дыхательный алкалоз</b>: гипервентиляция (паника, высокогорье, лихорадка) «выдувает» CO₂ — pH растёт, могут быть судороги и онемение (падает ионизированный кальций). Почки компенсируют, теряя HCO₃⁻.',
    '<b>Метаболический ацидоз</b>: накопление кислот (кетоацидоз при диабете, лактат при шоке, почечная недостаточность) или потеря HCO₃⁻ (диарея). <b>Компенсация</b> лёгкими — глубокое шумное дыхание Куссмауля снижает pCO₂.',
    '<b>Метаболический алкалоз</b>: потеря кислоты (многократная рвота желудочным соком) или избыток щелочей и диуретиков. Компенсация — дыхание замедляется, pCO₂ растёт (но не сильно: мешает нехватка кислорода).',
  ];
  const PTXT = [null,
    '<b>Острое воспаление</b>: печень в ответ на интерлейкин-6 вырабатывает <b>белки острой фазы</b> — растут α₁ (антитрипсин) и α₂ (гаптоглобин, церулоплазмин), а также С-реактивный белок и фибриноген. Альбумин немного падает («негативный белок острой фазы»).',
    '<b>Нефротический синдром</b>: повреждённые почечные клубочки пропускают альбумин в мочу (более 3 г в сутки). Альбумин крови резко падает — вода уходит из сосудов в ткани: <b>отёки</b>. Крупные α₂-макроглобулин и липопротеины остаются — их доля растёт.',
    '<b>Цирроз печени</b>: печень почти не синтезирует <b>альбумин</b> (отёки, асцит), зато растут γ-глобулины (поликлональная реакция на антигены из кишки, которые больше не фильтрует печень) — характерный «мост» β-γ.',
    '<b>Миеломная болезнь</b>: опухолевый клон плазматических клеток производит огромное количество <b>одинаковых</b> антител — на электрофореграмме узкий высокий пик, <b>М-градиент</b>. Лёгкие цепи (белок Бенс-Джонса) выходят с мочой и повреждают почки.',
  ];
  const labels = [
    ...EQ.map(([, x, n]) => ({ text: n, pos: V3(x + 1.0, eqY - 0.8, 0.3), color: n === 'H⁺' ? '#FFE070' : n === 'HCO₃⁻' ? '#7FD6FF' : '#EFEAE6', show: () => st.labels && st.mode === 'ph' })),
    { text: 'карбоангидраза', pos: V3(-1.7 + 1.0, eqY + 0.55, 0.3), color: 'rgba(239,234,230,.6)', show: () => st.labels && st.mode === 'ph' },
    { text: 'кровь: H⁺ · CO₂ · HCO₃⁻', pos: V3(-1.0 + 1.0, -2.35, 0.3), color: 'rgba(239,234,230,.6)', show: () => st.labels && st.mode === 'ph' },
    { text: 'лёгкие выдыхают CO₂', pos: V3(-4.6 + 1.0, -1.95, 0.2), color: '#E8A0A8', show: () => st.labels && st.mode === 'ph' },
    { text: 'ацидоз', pos: V3(3.1 - 1.2 + 1.0, -1.5, 0.2), color: '#FF5A5A', show: () => st.labels && st.mode === 'ph' }, { text: 'алкалоз', pos: V3(3.1 + 1.25 + 1.0, -1.5, 0.2), color: '#6A9AFF', show: () => st.labels && st.mode === 'ph' },
    ...BANDS.map(([n, x, c]) => ({ text: n, pos: V3(40 + x + 1.0, -2.05, 0.2), color: c, show: () => st.labels && st.mode === 'prot' })),
    { text: 'альбумин + лиганды', pos: V3(40 - 2.6, 2.2, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'prot' }, { text: 'трансферрин · Fe³⁺', pos: V3(40 + 0.25, 1.8, 0), color: '#FF9A5C', show: () => st.labels && st.mode === 'prot' }, { text: 'антитело IgG', pos: V3(40 + 3.0, 2.6, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'prot' },
    { text: '+', pos: V3(40 - 3.8, -0.55, 0.2), color: '#FF6A6A', show: () => st.labels && st.mode === 'prot' }, { text: '−  старт', pos: V3(40 + 5.2, -0.55, 0.2), color: '#6A9AFF', show: () => st.labels && st.mode === 'prot' },
    ...Object.entries(NOD).map(([k, d]) => ({ text: d.n, pos: d.p.clone().add(V3(80, k === 'X' ? -0.95 : -0.5, 0.3)), color: d.c, show: () => st.labels && st.mode === 'coag' })),
    { text: 'внутренний путь', pos: V3(80 - 4.3, -0.75, 0.3), color: '#9FB4FF', show: () => st.labels && st.mode === 'coag' }, { text: 'внешний путь', pos: V3(80 + 0.1, 2.0, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'coag' },
    { text: 'рана: коллаген', pos: V3(80 + 4.5, -2.75, 0.8), color: '#E0D0B0', show: () => st.labels && st.mode === 'coag' }, { text: 'тромбоциты', pos: V3(80 + 6.4, -1.1, 0.8), color: '#F2D06A', show: () => st.labels && st.mode === 'coag' }, { text: 'нити фибрина', get pos() { return V3(80 + 4.6, 0.25, 0.9); }, color: '#FFD090', show: () => st.labels && st.mode === 'coag' && st.fib > 0.3 },
    { text: 'варфарин', pos: V3(80 - 3.6, -1.0, 0.3), color: '#EFEAE6', show: () => st.labels && st.mode === 'coag' && st.warf }, { text: 'витамин K', pos: V3(80 - 2.0, -2.9, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'coag' && st.warf }, { text: 'Gla', pos: V3(80 - 4.5, -2.85, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'coag' && st.warf },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'ph' && CTXT[st.cond]) || (st.mode === 'prot' && PTXT[st.prot]) || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'ph', label: 'pH и буферы' }, { id: 'prot', label: 'Белки плазмы' }, { id: 'coag', label: 'Свёртывание' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 560px' });
    const msg = (m) => { st.msg = m; refs.setInfo(); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'ph') {
        const pc = range('bcC', 15, 90, 1, () => st.pc, (v) => { st.pc = v; }, (v) => `pCO₂ ${v}`), hb = range('bcH', 8, 40, 1, () => st.hb, (v) => { st.hb = v; }, (v) => `HCO₃⁻ ${v}`);
        box.append(h('div', { class: 'glabel' }, 'Кислотно-основное состояние'), h('div', { class: 'gctl' },
          seg(COND.map((c, i) => ({ id: i, label: c.name })), () => st.cond, (v) => { st.msg = null; setCond(v); }),
          toggle('Компенсация', () => st.comp, (v) => { st.comp = v; setCond(st.cond); }), pc, hb));
      } else if (st.mode === 'prot') box.append(h('div', { class: 'glabel' }, 'Электрофорез сыворотки'), h('div', { class: 'gctl' }, seg(PROT.map((p, i) => ({ id: i, label: p.n[0].toUpperCase() + p.n.slice(1) })), () => st.prot, (v) => { st.prot = v; st.msg = null; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Лекарства и нарушения'), h('div', { class: 'gctl' },
        button('Новая рана', () => injure(), true),
        toggle('Гепарин', () => st.hep, (v) => { st.hep = v; injure(); msg(v ? '<b>Гепарин</b> — сульфатированный полисахарид (его делают тучные клетки). Сам не действует: он в 1000 раз ускоряет природный ингибитор <b>антитромбин III</b>, который выключает тромбин и фактор Xa. Работает сразу, в том числе в пробирке; антидот — протамин.' : null); }),
        toggle('Варфарин', () => st.warf, (v) => { st.warf = v; injure(); msg(v ? '<b>Варфарин</b> — антагонист <b>витамина K</b>. Витамин K нужен ферменту, который карбоксилирует остатки глутамата в факторах II, VII, IX, X: получается <b>γ-карбоксиглутамат (Gla)</b>, связывающий Ca²⁺ и закрепляющий фактор на мембране тромбоцита. Без Gla факторы не работают. Действует через 2–3 дня, контроль — МНО. Антидот — витамин K.' : null); }),
        toggle('Гемофилия A', () => st.hemo, (v) => { st.hemo = v; injure(); msg(v ? '<b>Гемофилия A</b> — наследственный (сцепленный с X-хромосомой) дефицит <b>фактора VIII</b>. Внутренний путь почти не работает, тромбина мало, фибриновая сеть рыхлая — кровотечения в суставы и мышцы. Лечение — введение фактора VIII (в том числе рекомбинантного). Гемофилия B — дефицит фактора IX.' : null); }),
        toggle('Аспирин', () => st.asp, (v) => { st.asp = v; injure(); msg(v ? '<b>Аспирин</b> необратимо ацетилирует циклооксигеназу тромбоцитов — они не синтезируют <b>тромбоксан A₂</b> и хуже склеиваются. Тромбоцит без ядра не может сделать новый фермент — эффект длится весь его срок жизни (7–10 дней).' : null); }),
        toggle('Фибринолиз', () => st.lysis, (v) => { st.lysis = v; msg(v ? '<b>Фибринолиз.</b> Когда рана зажила, тканевый активатор плазминогена (tPA) превращает плазминоген в <b>плазмин</b>, который режет фибрин на фрагменты (D-димеры). Препараты tPA растворяют тромбы при инфаркте и инсульте.' : null); }),
        toggle('Транексамовая к-та', () => st.txa, (v) => { st.txa = v; msg(v ? '<b>Транексамовая кислота</b> — аналог лизина: занимает лизин-связывающие участки плазминогена, и он не садится на фибрин — сгусток не растворяется. Применяют при кровотечениях.' : null); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['ph', 'prot', 'coag'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'ph') return [['pH', (st.ph || 7.4).toFixed(2), ''], ['pCO₂', Math.round(st.pc), 'мм рт. ст.'], ['HCO₃⁻', Math.round(st.hb), 'ммоль/л']];
    if (st.mode === 'prot') return [['Альбумин', PROT[st.prot].f[0], '%'], ['γ-глобулины', PROT[st.prot].f[4], '%']];
    return [['Тромбин', Math.round(st.thr * 100), '%'], ['Фибрин', Math.round(st.fib * 100), '%'], ['Время', st.inj.toFixed(0), 'с']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF6A6A',
    kicker: 'Биохимия · кровь', title: 'Кровь: pH, белки, свёртывание',
    lede: 'Как кровь держит pH с точностью до сотых, что переносят белки плазмы и как за минуты затягивается рана.',
    notes: `
      <div><h2>Кислотно-основное состояние</h2><ul><li>pH артериальной крови 7,35–7,45; pCO₂ 35–45 мм рт. ст.; HCO₃⁻ 22–26 ммоль/л.</li><li>Буферная ёмкость крови: гемоглобиновый буфер ~75%, бикарбонатный ~10% (но он «открытый» — регулируется лёгкими и почками), белки плазмы, фосфаты.</li></ul>
        <h3>Белки плазмы</h3><ul><li>Общий белок 65–85 г/л; альбумин 35–50 г/л.</li><li>Онкотическое давление ~25 мм рт. ст., 80% его создаёт альбумин.</li><li>Почти все белки плазмы синтезирует печень, кроме иммуноглобулинов (плазматические клетки).</li></ul>
        <h3>Свёртывание</h3><ul><li>Время свёртывания по Ли — Уайту 5–10 мин; протромбиновое время, МНО (внешний путь), АЧТВ (внутренний).</li><li>Ca²⁺ (фактор IV) нужен на многих стадиях — поэтому цитрат и ЭДТА предотвращают свёртывание донорской крови в пробирке.</li><li>Естественные антикоагулянты: антитромбин III, протеины C и S, ингибитор пути тканевого фактора.</li></ul></div>
      <div><h2>Модели</h2><ul><li>Антитело IgG — PDB 1IGY, фактор Xa — 1IQJ (реальные атомные структуры).</li><li>Альбумин, трансферрин, другие факторы каскада — схематичные «капли».</li><li>Каскад упрощён до основных стадий; модель скорости — качественная.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('ph'); st.fly = null;
  return self;
}
