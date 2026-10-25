// @scene antibiotics makeAntibiotics | Антибиотики и синтез белка | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · АНТИБИОТИКИ: мишени на настоящей рибосоме 70S (PDB 1VY4), какой шаг элонгации
   блокирует каждый препарат, избирательность и устойчивость бактерий (недолеченный курс)
   ========================================================= */
function makeAntibiotics() {
  rnd = mulberry(7301);
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { ribo: [V3(-2.0, -2.3, 0), V3(-1.4, -0.6, 20.5)], cycle: [V3(38.2, -1.5, 0), V3(38.8, 0.3, 17.5)], resist: [V3(78.9, -2.6, 1.7), V3(78.9, 7.4, 10.8)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.ribo[1]);
  const controls = makeControls(camera, VIEW.ribo[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };

  /* ---------- общая геометрия рибосомы 1VY4: 30S внизу, 50S сверху, тРНК лицом к зрителю ---------- */
  const RB = PDB('ribo70'), SC = 0.021;
  const chPts = (c) => { const a = c.k === 'p' ? c.ca : c.p; const out = []; for (let i = 0; i < a.length; i += 3) out.push(V3(a[i], a[i + 1], a[i + 2])); return out; };
  const byId = Object.fromEntries(RB.chains.map((c) => [c.id, c]));
  const cen = (pts) => pts.reduce((s, p) => s.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length);
  const c30 = cen(chPts(byId.AA)), c50 = cen(chPts(byId.BA));
  const TR = ['AW', 'AX', 'AY'].filter((k) => byId[k]);
  const tC = cen(TR.flatMap((k) => chPts(byId[k])));
  const Q1 = new THREE.Quaternion().setFromUnitVectors(c50.clone().sub(c30).normalize(), V3(0, 1, 0));
  const tv = tC.clone().sub(c30.clone().lerp(c50, 0.5)).applyQuaternion(Q1); tv.y = 0; tv.normalize();
  const Q = new THREE.Quaternion().setFromUnitVectors(tv, V3(0.35, 0, 0.94).normalize()).multiply(Q1);
  const RC = c30.clone().lerp(c50, 0.5);
  const toW = (p) => p.clone().sub(RC).applyQuaternion(Q).multiplyScalar(SC);
  const site = (k) => toW(V3(...RB.sites[k]));

  /* ---------- 1. мишени на рибосоме ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const SUBCOL = { s30: { rna: '#E8C772', prot: '#D98A4E' }, s50: { rna: '#8FB4E6', prot: '#6E7FC4' } };
  const MATS = { s30: [], s50: [] };
  const trace = (pts, r, color, sub, seg = 3) => {
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(8, pts.length * seg), r, 6, false), organMat(color, 0.5, { emissiveIntensity: 0.06, transparent: true }));
    if (sub) MATS[sub].push(m.material); G1.add(m); return m;
  };
  RB.chains.forEach((c) => {
    if (c.id === 'AV' || TR.includes(c.id)) return;
    const sub = c.id[0] === 'A' ? 's30' : 's50', pts = chPts(c).map(toW);
    if (pts.length < 4) return;
    trace(pts, c.k === 'n' ? 0.034 : 0.024, c.k === 'n' ? SUBCOL[sub].rna : SUBCOL[sub].prot, sub, c.k === 'n' ? 3 : 2);
  });
  // тРНК (по расстоянию до места A — где садится тетрациклин) и мРНК
  const tSite = site('tet');
  const trOrd = TR.map((k) => ({ k, c: cen(chPts(byId[k]).map(toW)) })).sort((a, b) => a.c.distanceTo(tSite) - b.c.distanceTo(tSite));
  const TCOL = ['#7FE0A0', '#C77DFF', '#C8C8D0'];
  trOrd.forEach((o, i) => { o.mesh = trace(chPts(byId[o.k]).map(toW), 0.07, TCOL[i], null, 4); o.name = ['тРНК в A-участке', 'тРНК в P-участке', 'тРНК в E-участке'][i]; });
  const mrna = byId.AV ? trace(chPts(byId.AV).map(toW), 0.085, '#FF6FA8', null, 6) : null;
  // антибиотики в своих местах
  const ABX = [
    { id: 'tet', mol: 'tetracycline', site: 'tet', sub: 's30', col: '#F2C14E', name: 'Тетрациклин', step: 'aa' },
    { id: 'amg', mol: 'gentamicin', site: 'amg', sub: 's30', col: '#7FD6FF', name: 'Аминогликозиды', step: 'err' },
    { id: 'str', mol: 'streptomycin', site: 'str', sub: 's30', col: '#E6E08A', name: 'Стрептомицин', step: 'err' },
    { id: 'cam', mol: 'chloramphenicol', site: 'cam', sub: 's50', col: '#FF8AB0', name: 'Левомицетин', step: 'ptc' },
    { id: 'ery', mol: 'erythromycin', site: 'ery', sub: 's50', col: '#FF9A5C', name: 'Эритромицин', step: 'exit' },
  ];
  ABX.forEach((a) => { a.p = site(a.site); a.g = fit(a.mol, 0.48, { tint: a.col }); a.g.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.depthTest = false; o.material.transparent = true; o.renderOrder = 10; } }); a.g.position.copy(a.p); G1.add(a.g); a.glow = glowNucleus(G1, a.p, a.col, 0.07, 11); });
  const PTC = site('ptc'), EXIT = site('exit');

  /* ---------- 2. цикл элонгации (схема) ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const small = new THREE.Mesh(blobGeo(2.5, 0.72, 1.35, 3, 0.1), glassMat('#E8C772', { rim: 0.9, base: 0.07, keep: true })); small.position.set(0, -1.55, 0); G2.add(small);
  const large = new THREE.Mesh(blobGeo(2.8, 1.35, 1.65, 5, 0.1), glassMat('#8FB4E6', { rim: 0.9, base: 0.06, keep: true })); large.position.set(0, 0.85, 0); G2.add(large);
  // туннель выхода и пептидилтрансферазный центр
  const TUN = new THREE.CatmullRomCurve3([V3(0.15, 0.25, 0.1), V3(0.0, 0.9, 0.0), V3(-0.35, 1.6, -0.1), V3(-0.8, 2.35, 0.0), V3(-1.3, 3.0, 0.2)]);
  const tunM = new THREE.Mesh(new THREE.TubeGeometry(TUN, 40, 0.16, 10, false), glassMat('#C8D8FF', { rim: 0.6, base: 0.03, keep: true })); G2.add(tunM);
  const ptcG = glowNucleus(G2, V3(0.15, 0.22, 0.25), '#FF8AB0', 0.06, 10);
  // мРНК: кодоны-плитки, едет влево на один кодон за цикл
  const COD = ['#FF6A6A', '#F2C14E', '#5CC48A', '#5B8CFF'];
  const mG = new THREE.Group(); mG.position.set(0, -0.98, 0.15); G2.add(mG);
  const NCOD = 18, DX = 1.0;
  const codons = Array.from({ length: NCOD }, (_, i) => { const g = new THREE.Group(); for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.16), organMat(COD[(i * 3 + k * 7) % 4], 0.6, { emissiveIntensity: 0.12 })); b.position.x = (k - 1) * 0.31; g.add(b); } g.position.x = (i - 4) * DX; mG.add(g); return g; });
  const mBack = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, NCOD * DX, 8), organMat('#FF6FA8', 0.6)); mBack.rotation.z = Math.PI / 2; mBack.position.set((NCOD / 2 - 4.5) * DX, -0.1, 0); mG.add(mBack);
  // тРНК: настоящая форма (цепь из 1VY4), антикодоном вниз
  const trProto = (() => { const c = byId[trOrd[1].k]; const pts = chPts(c).map((p) => p.clone().sub(RC).applyQuaternion(Q)); const cc = cen(pts); const P = pts.map((p) => p.sub(cc).multiplyScalar(0.022)); return { P, acc: P[P.length - 1].clone(), anti: P[Math.min(P.length - 1, 34)].clone() }; })();
  const trGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trProto.P), trProto.P.length * 4, 0.075, 8, false);
  const SLOT = { in: V3(4.2, 0.4, 2.2), A: V3(0.8, 0, 0), P: V3(-0.2, 0, 0), E: V3(-1.2, 0, 0), out: V3(-4.0, 0.9, 1.8), drop: V3(-1.6, 3.6, 1.6) };
  const anchorY = -0.82 - trProto.anti.y;   // антикодон над кодоном
  const okMat = organMat('#F2E6C8', 0.7, { emissiveIntensity: 0.1 }), errMat = organMat('#FF5A4A', 0.7, { emissiveIntensity: 0.25 });
  const RCOL = { inc: '#7FE0A0', A: '#7FE0A0', P: '#C77DFF', E: '#C8C8D0', bad: '#FF8A5C' };
  const mkT = () => { const g = new THREE.Group(); const m = new THREE.Mesh(trGeo, organMat('#7FE0A0', 0.55, { emissiveIntensity: 0.1, transparent: true })); g.add(m); const aa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), okMat); aa.position.copy(trProto.acc); g.add(aa); G2.add(g); return { g, m, aa, role: 'off' }; };
  const tpool = [mkT(), mkT(), mkT(), mkT()];
  const tPos = (slot) => SLOT[slot].clone().add(V3(0, anchorY, 0));
  function setRole(T, role, bad = false) { T.role = role; T.g.visible = role !== 'off'; T.m.material.color.set(bad ? RCOL.bad : RCOL[role] || '#7FE0A0').multiplyScalar(0.55); T.m.material.opacity = 1; T.aa.visible = role === 'inc' || role === 'A'; T.aa.material = bad ? errMat : okMat; }
  const efTu = new THREE.Mesh(blobGeo(0.38, 0.3, 0.3, 7, 0.15), protMat('#4FC8C8', 0.5)); G2.add(efTu);
  const efG = new THREE.Mesh(blobGeo(0.45, 0.32, 0.32, 9, 0.15), protMat('#F2A040', 0.5)); efG.visible = false; G2.add(efG);
  // пептид: бусины по туннелю и дальше наружу
  const NP = 18;
  const beads = Array.from({ length: NP }, () => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), okMat); b.visible = false; G2.add(b); return b; });
  const TEND = TUN.getPoint(1), TDIR = TUN.getTangent(1);
  const ABX2 = { tet: { p: V3(0.95, -0.42, 0.75), block: 'блок: вход в участок A' }, amg: { p: V3(0.7, -1.08, 0.85), block: 'ошибки чтения кодонов' }, cam: { p: V3(0.45, 0.32, 0.75), block: 'блок: пептидная связь' }, ery: { p: V3(-0.35, 1.6, 0.45), block: 'блок: туннель выхода' } };
  ABX.forEach((a) => { const o = ABX2[a.id]; if (!o) return; o.g = fit(a.mol, a.id === 'ery' ? 0.55 : 0.45, { tint: a.col }); o.g.position.copy(o.p); o.g.visible = false; G2.add(o.g); o.glow = glowNucleus(G2, o.p.clone().add(V3(0, 0, -0.15)), a.col, 0.09, 13); o.glow.core.visible = false; o.glow.spr.material.opacity = 0; o.col = a.col; o.name = a.name; });

  /* ---------- 3. устойчивость: колония в чашке ---------- */
  const G3 = new THREE.Group(); G3.position.set(80.6, -2.2, 0); G3.scale.setScalar(0.8); scene.add(G3);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.12, 72), new THREE.MeshStandardMaterial({ color: 0x1c1826, roughness: 0.9, metalness: 0, emissive: 0x9f7bff, emissiveIntensity: 0.0, envMapIntensity: 0.15 })); dish.position.y = -0.08; G3.add(dish);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.05, 10, 96), glassMat('#C8D8FF', { rim: 0.8, base: 0.1, keep: true })); rim.rotation.x = Math.PI / 2; G3.add(rim);
  const NB = 190, cap = new THREE.CapsuleGeometry(0.055, 0.2, 4, 10); cap.rotateZ(Math.PI / 2);
  const bacM = new THREE.MeshPhysicalMaterial({ roughness: 0.45, clearcoat: 0.3, emissive: 0xffffff, emissiveIntensity: 0.12 });
  const bacI = new THREE.InstancedMesh(cap, bacM, NB); G3.add(bacI);
  const BAC = Array.from({ length: NB }, () => ({ p: V3(0, 0.06, 0), a: 0, kind: 's', s: 0, live: false, v: 0 }));
  const dummy = new THREE.Object3D();
  const randIn = () => { const r = 2.7 * Math.sqrt(rnd()), a = rnd() * Math.PI * 2; return V3(Math.cos(a) * r, 0.07, Math.sin(a) * r); };

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'ribo', labels: true, rot: false, fly: null, msg: null, abx: 'tet', abx2: 'none', ph: 0, cyc: 0, nAA: 0, nErr: 0, stall: 0, plen: 0, holder: null, course: 'stop', day: 0, run: false, S: 0.5, R: 0.0005, Cd: 0, nextDose: 0, hist: [], cured: false };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['ribo', 'cycle', 'resist'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setAbx(id) { st.abx = id; const a = ABX.find((x) => x.id === id); const c = a.p.clone().lerp(V3(0, 0, 0), 0.5); const tg = V3(c.x - 1.9, -2.2, c.z * 0.5); st.fly = flyTarget(tg, tg.clone().add(V3(0.5, 1.6, 17))); refs.setInfo && refs.setInfo(); }
  function resetCycle() {
    st.ph = 0; st.cyc = 0; st.nAA = 0; st.nErr = 0; st.bounce = 0; st.stallT = 0; st.drop = 0; st.plen = 1; st.bonded = false; st.picked = false; st.wrong = false; st.flash = false;
    setRole(tpool[0], 'P'); tpool[0].g.position.copy(tPos('P')); setRole(tpool[1], 'E'); tpool[1].g.position.copy(tPos('E'));
    setRole(tpool[2], 'inc'); tpool[2].g.position.copy(tPos('in')); setRole(tpool[3], 'off');
    st.T = { P: tpool[0], E: tpool[1], A: null, inc: tpool[2] }; st.holder = tpool[0];
    efG.visible = false; efTu.visible = true; mG.position.x = 0; st.errBeads = new Set(); beads.forEach((b) => { b.material = okMat; });
  }
  function resetCourse() { st.day = 0; st.run = false; st.S = 0.5; st.R = 0.0005; st.Cd = 0; st.nextDose = 0; st.hist = []; st.cured = false; st.relapse = false; BAC.forEach((b) => { b.live = false; b.s = 0; }); }
  resetCycle(); resetCourse();

  /* шаг цикла: 0 — подход аа-тРНК (0..1), 1 — пептидная связь (1..1.6), 2 — транслокация (1.6..2.5), 3 — выход из E (2.5..3) */
  function cycleUpdate(dt, t) {
    const ab = st.abx2, speed = 0.55, T = st.T;
    Object.entries(ABX2).forEach(([k, o]) => { const on = k === ab; o.g.visible = on; o.g.rotation.y += dt * 0.6; o.glow.spr.material.opacity = on ? 0.35 + 0.15 * Math.sin(t * 3) : 0; });
    // эритромицин: застрявшая пептидил-тРНК отваливается вместе с коротким пептидом
    if (st.drop > 0) {
      st.drop += dt * 0.55; const u = smooth(0, 1, st.drop), H = st.holder;
      H.g.position.copy(tPos('A').lerp(SLOT.drop, u)); H.m.material.opacity = 1 - u; efG.visible = false;
      if (st.drop >= 1) resetCycle();
      return;
    }
    st.ph += dt * speed; const ph = st.ph, inc = T.inc;
    if (ph < 1) {
      if (!st.picked) { st.picked = true; st.wrong = ab === 'amg' && rnd() < 0.3; setRole(inc, 'inc', st.wrong); }
      let k;
      if (ab === 'tet') { k = ph < 0.55 ? 0.82 * smooth(0, 0.55, ph) : 0.82 * (1 - smooth(0.55, 1, ph)); if (ph > 0.55 && !st.flash) { st.flash = true; fx.spawn(SLOT.A.clone().add(V3(40.3, 0.1, 0.5)), V3(0.5, 0.3, 0.3), C.set('#F2C14E'), 0.7, 0.6, 1.2); } }
      else k = smooth(0, 1, ph);
      const pos = tPos('in').lerp(tPos('A'), k); inc.g.position.copy(pos); efTu.visible = true; efTu.position.copy(pos).add(trProto.acc).add(V3(0.25, 0.05, 0.25));
      if (ab === 'tet' && st.ph + dt * speed >= 1) { st.ph = 0; st.bounce += 1; st.flash = false; st.picked = false; }
      return;
    }
    if (ph < 1.6) {
      efTu.visible = false; inc.g.position.copy(tPos('A')); if (inc.role !== 'A') { inc.role = 'A'; T.A = inc; }
      if (ab === 'cam') { ptcG.spr.material.opacity = 0.55 + 0.35 * Math.sin(t * 10); ptcG.spr.scale.setScalar(1.6); if (ph > 1.55) st.ph = 1.0; return; }
      if (!st.bonded && ph > 1.3) { st.bonded = true; st.plen = Math.min(NP, st.plen + 1); st.nAA += 1; if (st.wrong) { st.nErr += 1; st.errBeads.add(st.nAA); } inc.aa.visible = false; st.holder = inc; fx.spawn(V3(40.15, 0.25, 0.3), V3(0, 0.4, 0.2), C.set('#FF8AB0'), 0.7, 0.7, 1.1); }
      return;
    }
    if (ph < 2.5) {
      if (ab === 'ery' && st.plen >= 7) { st.ph = 1.6; st.stallT += dt; if (st.stallT > 1.8) { st.drop = 0.001; st.stallT = 0; } return; }
      const u = smooth(1.6, 2.5, ph); efG.visible = true; efG.position.set(0.75 - u * 0.4, -0.35, 0.8);
      T.A.g.position.copy(tPos('A').lerp(tPos('P'), u)); T.P.g.position.copy(tPos('P').lerp(tPos('E'), u)); if (T.E) T.E.g.position.copy(tPos('E').lerp(tPos('out'), u * 0.35));
      mG.position.x = -((st.cyc + u) % 4) * DX;
      return;
    }
    efG.visible = false; const u = smooth(2.5, 3, ph);
    if (T.E) { T.E.g.position.copy(tPos('E').lerp(tPos('out'), 0.35 + 0.65 * u)); T.E.m.material.opacity = 1 - u; }
    if (ph >= 3) {
      const old = T.E; if (old) setRole(old, 'off');
      setRole(T.P, 'E'); setRole(T.A, 'P', st.wrong); T.A.m.material.color.set(RCOL.P).multiplyScalar(0.55);
      const next = old || tpool.find((x) => x.role === 'off');
      st.T = { E: T.P, P: T.A, A: null, inc: next }; setRole(next, 'inc'); next.g.position.copy(tPos('in'));
      st.ph = 0; st.cyc += 1; st.bonded = false; st.picked = false;
    }
  }
  function beadUpdate() {
    // цепь растёт от акцепторного конца тРНК-держателя по туннелю и выходит наружу
    const base = st.holder.g.position.clone().add(trProto.acc);
    for (let i = 0; i < NP; i++) {
      const b = beads[i]; b.visible = i < st.plen && G2.visible;
      if (!b.visible) continue;
      const k = st.plen - 1 - i;   // 0 — последняя присоединённая
      if (k === 0) b.position.copy(base);
      else if (k === 1) b.position.copy(base.clone().lerp(st.drop > 0 ? base.clone().add(V3(-0.2, 0.25, 0)) : TUN.getPoint(0.06), 0.65));
      else { const u = (k - 0.3) / 9; b.position.copy(st.drop > 0 ? base.clone().add(V3(-0.15 * k, 0.22 * k, 0.05 * k)) : u <= 1 ? TUN.getPoint(u) : TEND.clone().addScaledVector(TDIR, (u - 1) * 2.0).add(V3(0.12 * Math.sin(k * 1.7), 0, 0.12 * Math.cos(k * 1.3)))); }
      b.material = st.errBeads.has(st.nAA - k) ? errMat : okMat;
    }
    if (st.abx2 !== 'cam') { ptcG.spr.material.opacity = 0.2; ptcG.spr.scale.setScalar(1); }
  }
  function courseUpdate(dt, t) {
    if (st.run) {
      const ddt = Math.min(dt, 0.05) * 0.7; // сутки в секунду ×0.7
      const nsub = 10, h = ddt / nsub;
      for (let s = 0; s < nsub; s++) {
        const len = st.course === 'full' ? 7 : st.course === 'stop' ? 3 : 0;
        if (len && st.day < len && st.day >= st.nextDose - 1e-9) { st.Cd += 1; st.nextDose += 0.5; }
        st.Cd -= st.Cd * h * 4.6;
        const N = st.S + st.R, imm = 1.6 * 0.004 / (N + 0.004), g = 1.1 * (1 - N);
        st.S += st.S * h * (g - imm - 2.6 * st.Cd / (st.Cd + 0.15));
        st.R += st.R * h * (g * 0.85 - imm - 2.6 * st.Cd / (st.Cd + 0.9)) + 2e-4 * st.S * h * g;
        if (st.S < 2e-5) st.S = 0; if (st.R < 2e-5) st.R = 0;
        st.day += h;
      }
      if (st.hist.length === 0 || st.day - st.hist[st.hist.length - 1][0] > 0.05) st.hist.push([st.day, st.S, st.R, st.Cd]);
      if (st.course === 'stop' && st.day > 4 && st.S > 0.1 && !st.relapse) { st.relapse = true; refs.setInfo && refs.setInfo(); }
      if (st.S + st.R === 0) st.cured = true;
      if (st.day >= 16) st.run = false;
    }
    dish.material.emissiveIntensity = 0.01 + 0.1 * clamp(st.Cd, 0, 1.2) / 1.2;
    // сколько бактерий показать: чувствительные — пропорционально, устойчивые — с увеличением (иначе их не видно)
    const tgtS = Math.round(150 * st.S), tgtR = Math.min(40, Math.round(1500 * st.R));
    const live = { s: BAC.filter((b) => b.live && b.kind === 's'), r: BAC.filter((b) => b.live && b.kind === 'r') };
    for (const [kind, tgt] of [['s', tgtS], ['r', tgtR]]) {
      const L = live[kind];
      if (L.length < tgt) { const free = BAC.find((b) => !b.live && b.s < 0.01); if (free) { const par = L.length && rnd() < 0.75 ? L[(rnd() * L.length) | 0] : null; free.live = true; free.kind = kind; free.p.copy(par ? par.p.clone().add(V3(rand(-0.45, 0.45), 0, rand(-0.45, 0.45))) : randIn()); if (free.p.length() > 2.75) free.p.setLength(2.6); free.p.y = 0.07; free.a = rnd() * Math.PI; free.s = 0.05; } }
      else if (L.length > tgt) { const b = L[(rnd() * L.length) | 0]; b.live = false; fx.spawn(b.p.clone().multiplyScalar(0.8).add(G3.position), V3(0, 0.5, 0), C.set(kind === 's' ? '#7FE0A0' : '#FF9A5C'), 0.5, 0.6, 1); }
    }
    BAC.forEach((b, i) => {
      b.s += ((b.live ? 1 : 0) - b.s) * Math.min(1, dt * (b.live ? 4 : 6));
      b.a += dt * 0.2 * Math.sin(t + i); b.p.x += Math.cos(b.a) * dt * 0.02; b.p.z += Math.sin(b.a) * dt * 0.02; if (b.p.length() > 2.8) b.p.multiplyScalar(0.99);
      dummy.position.copy(b.p); dummy.rotation.set(0, b.a, 0); dummy.scale.setScalar(Math.max(0.001, b.s) * (b.kind === 'r' ? 1.12 : 1)); dummy.updateMatrix(); bacI.setMatrixAt(i, dummy.matrix);
      bacI.setColorAt(i, C.set(b.kind === 'r' ? '#FF9A5C' : '#7FE0A0').multiplyScalar(b.live ? 0.75 : 0.35));
    });
    bacI.instanceMatrix.needsUpdate = true; if (bacI.instanceColor) bacI.instanceColor.needsUpdate = true;
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'ribo') {
      const a = ABX.find((x) => x.id === st.abx);
      ABX.forEach((x) => { const on = x === a; x.g.visible = on; x.glow.spr.material.opacity = on ? 0.55 + 0.25 * Math.sin(t * 3) : 0; x.glow.spr.scale.setScalar(1.5); x.glow.core.visible = false; if (on) x.g.rotation.y += dt * 0.5; });
      ['s30', 's50'].forEach((s) => { const on = !a || a.sub === s; MATS[s].forEach((m) => { m.opacity += ((!a ? 1 : on ? 0.55 : 0.1) - m.opacity) * Math.min(1, dt * 3); m.depthWrite = m.opacity > 0.9; }); });
      if (rnd() < 0.2) fx.spawn(a.p.clone().add(randUnit().multiplyScalar(0.3)), randUnit().multiplyScalar(0.15), C.set(a.col), 0.6, 0.7, 1);
    }
    if (st.mode === 'cycle') { cycleUpdate(dt, t); beadUpdate(); codons.forEach((g) => { g.visible = true; }); }
    if (st.mode === 'resist') courseUpdate(dt, t);
    fx.update(dt);
  }

  function drawScope(ctx, w, h) {
    if (st.mode !== 'resist') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'бактерии, лог. шкала', xl: 'сутки →' });
    const X = (d) => A.X(d / 16), Y = (v) => A.Y(clamp((Math.log10(Math.max(v, 1e-5)) + 5) / 5, 0, 1));
    const len = st.course === 'full' ? 7 : st.course === 'stop' ? 3 : 0;
    if (len) { ctx.fillStyle = 'rgba(159,123,255,.14)'; ctx.fillRect(X(0), A.Y(1), X(len) - X(0), A.Y(0) - A.Y(1)); }
    const line = (k, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = Y(r[k]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
    line(1, '#7FE0A0'); line(2, '#FF9A5C');
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.font = '500 9px JetBrains Mono, monospace'; if (len) ctx.fillText('курс', X(0) + 3, A.Y(0) - 4); [[1, '100%'], [1e-2, '1%'], [1e-4, '0,01%']].forEach(([v, s]) => { ctx.fillText(s, A.X(1) - ctx.measureText(s).width - 2, Y(v) + 3); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(A.X(0), Y(v), A.X(1) - A.X(0), 1); ctx.fillStyle = 'rgba(255,255,255,.45)'; });
  }

  const TXT = {
    ribo: '<b>Рибосома бактерии 70S</b> (Thermus thermophilus, PDB 1VY4): малая субъединица 30S (жёлтая — 16S рРНК, оранжевые — белки) и большая 50S (голубые 23S и 5S рРНК, синие белки). Розовая нить — мРНК, зелёная, фиолетовая и серая — тРНК в участках A, P и E. Многие антибиотики садятся именно сюда: рибосомы бактерий (70S) отличаются от наших (80S), поэтому лекарство бьёт по микробу. Молекулы антибиотиков увеличены примерно втрое.',
    cycle: '<b>Элонгация</b> — повторяющийся цикл. 1) Фактор EF-Tu·ГТФ (бирюзовый) приносит аминоацил-тРНК в участок <b>A</b>, антикодон спаривается с кодоном мРНК. 2) В <b>пептидилтрансферазном центре</b> (это рРНК — рибозим) растущая цепь переносится на новую аминокислоту. 3) Фактор EF-G (оранжевый) за счёт ГТФ сдвигает рибосому на один кодон: тРНК переходят A → P → E. 4) Пустая тРНК уходит из E. Цепь выходит через <b>туннель</b> большой субъединицы. Включите антибиотик — увидите, какой шаг он ломает.',
    resist: '<b>Устойчивость к антибиотикам.</b> В огромной колонии почти всегда есть редкие мутанты, которые переносят лекарство лучше (оранжевые; зелёные — чувствительные). Препарат быстро убивает чувствительных — через 2–3 дня бактерий так мало, что человеку уже лучше. Если самовольно бросить лечение тяжёлой инфекции, оставшиеся бактерии размножаются снова — и устойчивых среди них уже в разы больше. Выберите сценарий и нажмите «Запустить».',
  };
  const ABTXT = {
    tet: '<b>Тетрациклины</b> (тетрациклин, доксициклин) садятся на малую субъединицу 30S рядом с участком A и не пускают туда аминоацил-тРНК — цепь не удлиняется. Действуют бактериостатически, широкий спектр (хламидии, микоплазмы, риккетсии). Связывают кальций: откладываются в растущих зубах и костях, поэтому детям до 8 лет и беременным их избегают (короткие курсы доксициклина допустимы, при риккетсиозах — в любом возрасте); молоко и антациды снижают всасывание, возможна фотосенсибилизация.',
    amg: '<b>Аминогликозиды</b> (гентамицин, амикацин) связываются с декодирующим центром 30S — спиралью h44 16S рРНК у нуклеотидов A1492–A1493. Проверка пары кодон–антикодон ослабевает: рибосома принимает «почти подходящие» тРНК, и в белки встраиваются не те аминокислоты; неправильные белки повреждают мембрану. Действуют бактерицидно, на анаэробов не действуют (в клетку их закачивает кислородзависимый транспорт). Ототоксичны — митохондриальные рибосомы похожи на бактериальные (особенно у носителей мутации m.1555A>G); нефротоксичны — копятся в клетках проксимальных канальцев.',
    str: '<b>Стрептомицин</b> — первый аминогликозид (1943) и первое лекарство от туберкулёза. Садится на 30S между 16S рРНК и белком S12 и фиксирует рибосому в «неточном» состоянии — растут ошибки чтения. Устойчивость часто возникает из-за одной мутации в гене белка S12.',
    cam: '<b>Левомицетин</b> (хлорамфеникол) садится в <b>пептидилтрансферазный центр</b> большой субъединицы 50S и мешает аминокислоте в участке A занять место — пептидная связь не образуется. Сюда же садится линезолид (резервный препарат против устойчивых стафилококков). Левомицетин тормозит и митохондриальные рибосомы — отсюда обратимое, зависящее от дозы угнетение костного мозга. Отдельно и редко (около 1 на 25–40 тысяч) бывает необратимая апластическая анемия, не зависящая от дозы. У новорождённых печень плохо связывает препарат с глюкуроновой кислотой — «серый синдром». Поэтому применяется ограниченно.',
    ery: '<b>Макролиды</b> (эритромицин, азитромицин, кларитромицин) садятся в <b>туннель выхода</b> 50S чуть дальше пептидилтрансферазного центра. Синтез начинается, но цепь из нескольких аминокислот упирается в антибиотик — пептидил-тРНК отваливается. Применяются при аллергии на пенициллины, при атипичных пневмониях. Побочные эффекты: удлинение интервала QT, торможение CYP3A4 печени (эритро- и кларитромицин — опасные сочетания лекарств), понос и спазмы (эритромицин возбуждает рецепторы мотилина). Устойчивость — метилирование 23S рРНК в месте связывания (ген erm).',
  };
  const AB2TXT = {
    none: TXT.cycle,
    tet: '<b>Тетрациклин</b> (жёлтый) занимает участок A: аминоацил-тРНК подлетает и отскакивает. Цепь стоит, но рибосома не разрушена — когда препарат уходит, синтез продолжается (бактериостатическое действие).',
    amg: '<b>Аминогликозид</b> (голубой) искажает декодирующий центр: рибосома принимает «почти подходящую» тРНК (оранжевая) с чужой аминокислотой — в цепи появляются красные бусины. Белки собираются с ошибками. Частота ошибок здесь сильно преувеличена, чтобы их было видно.',
    cam: '<b>Левомицетин</b> (розовый) сидит в пептидилтрансферазном центре: тРНК в участке A есть, а пептидная связь не образуется — центр мигает, цикл не идёт дальше.',
    ery: '<b>Эритромицин</b> (оранжевый) перекрывает туннель: первые 6–8 аминокислот присоединяются, затем цепь упирается в препарат, рибосома стоит, и пептидил-тРНК с коротким пептидом отваливается — синтез начинается заново и снова застревает.',
  };
  const labels = [
    { text: 'малая субъединица 30S', pos: toW(c30).add(V3(1.6, -1.1, 0.6)), color: '#E8C772', show: () => st.labels && st.mode === 'ribo' },
    { text: 'большая субъединица 50S', pos: toW(c50).add(V3(1.7, 1.2, 0.6)), color: '#8FB4E6', show: () => st.labels && st.mode === 'ribo' },
    ...trOrd.map((o, i) => ({ text: o.name, pos: o.c.clone().add(V3(i === 0 ? 0.35 : -0.35, i === 0 ? 0.35 : 0.6, 0.45)), color: TCOL[i], show: () => st.labels && st.mode === 'ribo' && i < 2 })),
    { text: 'мРНК', pos: mrna ? cen(chPts(byId.AV).map(toW)).add(V3(0.4, -0.25, 0.3)) : V3(0, -1, 0), color: '#FF6FA8', show: () => st.labels && st.mode === 'ribo' },
    ...ABX.map((a) => ({ text: a.name, pos: a.p.clone().add(V3(0.3, 0.3, 0.3)), color: a.col, show: () => st.labels && st.mode === 'ribo' && st.abx === a.id })),
    { text: 'пептидилтрансферазный центр', pos: PTC.clone().add(V3(0.5, -0.5, 0.4)), color: '#FF8AB0', show: () => st.labels && st.mode === 'ribo' && st.abx === 'cam' },
    { text: 'выход туннеля', pos: EXIT.clone().add(V3(0.3, 0.3, 0.3)), color: '#C8D8FF', show: () => st.labels && st.mode === 'ribo' && st.abx === 'ery' },
    { text: 'A', pos: V3(40 + 0.8, -1.3, 1.5), color: '#7FE0A0', show: () => st.labels && st.mode === 'cycle' },
    { text: 'P', pos: V3(40 - 0.2, -1.3, 1.5), color: '#C77DFF', show: () => st.labels && st.mode === 'cycle' },
    { text: 'E', pos: V3(40 - 1.2, -1.3, 1.5), color: '#C8C8D0', show: () => st.labels && st.mode === 'cycle' },
    ...Object.entries(ABX2).map(([k, o]) => ({ text: o.block, pos: o.p.clone().add(V3(40.35, 0.35, 0.4)), color: o.col, show: () => st.labels && st.mode === 'cycle' && st.abx2 === k })),
    { text: 'мРНК 5′ → 3′', pos: V3(40 + 2.4, -1.35, 0.4), color: '#FF6FA8', show: () => st.labels && st.mode === 'cycle' },
    { text: 'туннель выхода', pos: V3(40 - 1.25, 3.25, 0.3), color: '#C8D8FF', show: () => st.labels && st.mode === 'cycle' },
    { text: 'EF-Tu', pos: () => efTu.position.clone().add(V3(40.3, 0.35, 0)), color: '#4FC8C8', show: () => st.labels && st.mode === 'cycle' && efTu.visible },
    { text: 'EF-G', pos: () => efG.position.clone().add(V3(40.35, -0.4, 0)), color: '#F2A040', show: () => st.labels && st.mode === 'cycle' && efG.visible },
    { text: 'малая субъединица', pos: V3(40 + 2.0, -2.15, 0.6), color: '#E8C772', show: () => st.labels && st.mode === 'cycle' },
    { text: 'большая субъединица', pos: V3(40 + 2.1, 1.95, 0.6), color: '#8FB4E6', show: () => st.labels && st.mode === 'cycle' },
  ];
  // подписи с функцией вместо точки — пересчитываем позицию каждый кадр
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = l.fn(); });
  const upd0 = update;
  function update2(dt) { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    const CTXT = { stop: TXT.resist, full: '<b>Курс, назначенный врачом</b> (здесь 7 дней). Препарат подавляет и чувствительных, и умеренно устойчивых, а последних добивает иммунитет — к концу курса колония исчезает. Длительность курса подбирают под инфекцию; сейчас курсы стараются делать короче: каждый лишний день антибиотика отбирает устойчивых в нашей собственной флоре. Поэтому главное правило — принимать столько, сколько назначено, и не пить антибиотики «на всякий случай».', none: '<b>Без лечения.</b> Колония растёт до предела, который задают питание и иммунитет. Многие лёгкие инфекции (особенно вирусные — на них антибиотики вообще не действуют) проходят сами; бактериальные инфекции посерьёзнее — нет.' };
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'ribo' ? ABTXT[st.abx] : st.mode === 'cycle' ? AB2TXT[st.abx2] : (st.course === 'stop' && st.relapse ? '<b>Рецидив.</b> Лечение брошено на 3-й день, когда бактерий осталось мало и симптомы стихли. Выжившие размножились снова, и устойчивых среди них теперь примерно в 15 раз больше, чем было: следующий курс того же препарата сработает хуже. Так, шаг за шагом, отбираются устойчивые штаммы — особенно когда антибиотики пьют «на всякий случай» или от вирусных инфекций.' : CTXT[st.course]);
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'ribo', label: 'Мишени на рибосоме' }, { id: 'cycle', label: 'Цикл элонгации' }, { id: 'resist', label: 'Устойчивость' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'ribo') box.append(h('div', { class: 'glabel' }, 'Антибиотик'), h('div', { class: 'gctl' }, seg(ABX.map((a) => ({ id: a.id, label: a.name, color: a.col })), () => st.abx, (v) => setAbx(v))));
      else if (st.mode === 'cycle') box.append(h('div', { class: 'glabel' }, 'Антибиотик'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Нет' }, ...ABX.filter((a) => a.id !== 'str').map((a) => ({ id: a.id, label: a.name, color: a.col }))], () => st.abx2, (v) => { st.abx2 = v; resetCycle(); refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Сценарий'), h('div', { class: 'gctl' }, seg([{ id: 'stop', label: 'Бросить на 3-й день' }, { id: 'full', label: 'Полный курс' }, { id: 'none', label: 'Без лечения' }], () => st.course, (v) => { const was = st.run; st.course = v; resetCourse(); st.run = was; refs.setInfo(); }), button('Запустить', () => { resetCourse(); st.run = true; refs.setInfo(); }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['ribo', 'cycle', 'resist'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'cycle') return [['Аминокислот', st.nAA, ''], ['Ошибок', st.nErr, ''], ['Синтез', st.abx2 === 'tet' || st.abx2 === 'cam' || (st.abx2 === 'ery' && (st.plen >= 7 || st.drop > 0)) ? 'стоит' : 'идёт', '']];
    if (st.mode === 'resist') { const N = st.S + st.R, few = N < 1e-3; return [['Сутки', Math.floor(st.day), ''], ['Бактерий', few ? (N === 0 ? '0' : '<0,1') : Math.round(N * 100) + '', '% от максимума'], ['Устойчивых', few ? '—' : (100 * st.R / N).toFixed(st.R / N < 0.1 ? 1 : 0).replace('.', ','), few ? '' : '%']]; }
    const a = ABX.find((x) => x.id === st.abx); return [['Субъединица', a.sub === 's30' ? '30S' : '50S', ''], ['Шаг', { aa: 'вход тРНК', err: 'точность', ptc: 'пептидная связь', exit: 'туннель' }[a.step], '']];
  }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Биохимия · синтез белка', title: 'Антибиотики и синтез белка',
    lede: 'Рибосома бактерий чуть отличается от нашей — и этого хватает, чтобы маленькая молекула остановила микроба, не тронув человека.',
    notes: `
      <div><h2>Как работают антибиотики</h2>
        <p>Антибиотики бьют по тому, что есть у бактерий и чего нет (или что устроено иначе) у человека. Синтез белка: рибосома 70S вместо 80S — тетрациклины, аминогликозиды (30S), макролиды, левомицетин, линезолид (50S). Клеточная стенка из пептидогликана — β-лактамы (пенициллины, цефалоспорины) и ванкомицин. ДНК-гираза — фторхинолоны (ципрофлоксацин). Бактериальная РНК-полимераза — рифампицин. Синтез фолата — сульфаниламиды и триметоприм.</p>
        <h3>Бактерицидные и бактериостатические</h3><p>Бактерицидные убивают (β-лактамы, аминогликозиды, фторхинолоны), бактериостатические останавливают рост, а добивает иммунитет (тетрациклины, макролиды, левомицетин).</p>
        <h3>Механизмы устойчивости</h3><ul><li>Ферменты, разрушающие препарат (β-лактамазы, ферменты, модифицирующие аминогликозиды).</li><li>Изменение мишени (метилирование 23S рРНК — макролиды; мутации белка S12 — стрептомицин).</li><li>Насосы, выкачивающие препарат (тетрациклины), и снижение проницаемости.</li><li>Защита рибосомы: белки TetM и TetO снимают тетрациклин с рибосомы.</li><li>Гены устойчивости передаются между бактериями на плазмидах.</li></ul>
        <p>Антибиотики не действуют на вирусы: у вирусов нет своих рибосом и клеточной стенки.</p></div>
      <div><h2>Условности</h2><ul><li>Рибосома — настоящая структура 70S (PDB 1VY4): рРНК и белки показаны трубками по остову; места антибиотиков — центры соответствующих нуклеотидов из кристаллических структур комплексов. Молекулы препаратов увеличены примерно втрое.</li><li>Цикл элонгации — схема: субъединицы условные, форма тРНК настоящая; скорости и размеры не в масштабе.</li><li>Колония — простая модель роста, иммунитета и действия препарата, а не прогноз для конкретной болезни; число устойчивых бактерий на экране преувеличено, чтобы их было видно.</li><li>Частота ошибок при аминогликозидах преувеличена (на деле — доли процента).</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('ribo'); st.fly = null; setAbx('tet'); st.fly = null;
  return self;
}
