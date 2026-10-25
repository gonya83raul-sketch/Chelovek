// @scene antibiotics makeAntibiotics | Антибиотики и синтез белка | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · АНТИБИОТИКИ: мишени на настоящей рибосоме 70S (PDB 1VY4), какой шаг элонгации
   блокирует каждый препарат, избирательность и устойчивость бактерий (недолеченный курс)
   ========================================================= */
function makeAntibiotics() {
  rnd = mulberry(7301);
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { ribo: [V3(-1.2, -2.3, 0), V3(-0.6, -0.6, 20)], cycle: [V3(39.0, -1.6, 0), V3(39.6, 0.2, 17)], resist: [V3(79.6, -2.6, 1.7), V3(79.6, 7.4, 10.6)] };
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
    { id: 'str', mol: 'streptomycin', site: 'str', sub: 's30', col: '#7FE0A0', name: 'Стрептомицин', step: 'err' },
    { id: 'cam', mol: 'chloramphenicol', site: 'cam', sub: 's50', col: '#FF8AB0', name: 'Левомицетин', step: 'ptc' },
    { id: 'ery', mol: 'erythromycin', site: 'ery', sub: 's50', col: '#FF9A5C', name: 'Эритромицин', step: 'exit' },
  ];
  ABX.forEach((a) => { a.p = site(a.site); a.g = fit(a.mol, 0.42); a.g.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.depthTest = false; o.renderOrder = 5; } }); a.g.position.copy(a.p); G1.add(a.g); a.glow = glowNucleus(G1, a.p, a.col, 0.07, 11); });
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
  const SLOT = { in: V3(4.2, 0.4, 2.2), A: V3(0.8, 0, 0), P: V3(-0.2, 0, 0), E: V3(-1.2, 0, 0), out: V3(-4.0, 0.9, 1.8) };
  const anchorY = -0.82 - trProto.anti.y;   // антикодон над кодоном
  const mkT = (col) => { const g = new THREE.Group(); const m = new THREE.Mesh(trGeo, organMat(col, 0.55, { emissiveIntensity: 0.1, transparent: true })); g.add(m); const aa = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), organMat('#F2E6C8', 0.7, { emissiveIntensity: 0.12 })); aa.position.copy(trProto.acc); g.add(aa); g.userData = { m, aa }; G2.add(g); return g; };
  const tpool = [mkT('#7FE0A0'), mkT('#C77DFF'), mkT('#C8C8D0'), mkT('#7FE0A0')];
  const tPos = (slot) => SLOT[slot].clone().add(V3(0, anchorY, 0));
  const efTu = new THREE.Mesh(blobGeo(0.38, 0.3, 0.3, 7, 0.15), protMat('#5CC48A', 0.5)); G2.add(efTu);
  const efG = new THREE.Mesh(blobGeo(0.45, 0.32, 0.32, 9, 0.15), protMat('#F2A040', 0.5)); efG.visible = false; G2.add(efG);
  // пептид: бусины по туннелю
  const NP = 16;
  const beads = Array.from({ length: NP }, () => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), organMat('#F2E6C8', 0.7, { emissiveIntensity: 0.1 })); b.visible = false; G2.add(b); return b; });
  const abx2 = {}; ABX.forEach((a) => { if (a.id === 'str') return; const g = fit(a.mol, 0.32); g.visible = false; G2.add(g); abx2[a.id] = g; });
  abx2.tet.position.set(0.95, -0.45, 0.75); abx2.amg.position.set(0.55, -1.3, 0.8); abx2.cam.position.set(0.55, 0.45, 0.7); abx2.ery.position.set(-0.3, 1.45, 0.45);

  /* ---------- 3. устойчивость: колония в чашке ---------- */
  const G3 = new THREE.Group(); G3.position.set(80.6, -2.2, 0); G3.scale.setScalar(0.8); scene.add(G3);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.12, 72), new THREE.MeshPhysicalMaterial({ color: 0x2a2236, roughness: 0.35, clearcoat: 0.7, emissive: 0x9f7bff, emissiveIntensity: 0.0 })); dish.position.y = -0.08; G3.add(dish);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.05, 10, 96), glassMat('#C8D8FF', { rim: 0.8, base: 0.1, keep: true })); rim.rotation.x = Math.PI / 2; G3.add(rim);
  const NB = 190, cap = new THREE.CapsuleGeometry(0.055, 0.2, 4, 10); cap.rotateZ(Math.PI / 2);
  const bacM = new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, emissive: 0xffffff, emissiveIntensity: 0.06 });
  const bacI = new THREE.InstancedMesh(cap, bacM, NB); G3.add(bacI);
  const BAC = Array.from({ length: NB }, () => ({ p: V3(0, 0.06, 0), a: 0, kind: 's', s: 0, live: false, v: 0 }));
  const dummy = new THREE.Object3D();
  const randIn = () => { const r = 2.7 * Math.sqrt(rnd()), a = rnd() * Math.PI * 2; return V3(Math.cos(a) * r, 0.07, Math.sin(a) * r); };

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'ribo', labels: true, rot: false, fly: null, msg: null, abx: 'tet', abx2: 'none', ph: 0, cyc: 0, nAA: 0, nErr: 0, stall: 0, plen: 0, holder: null, course: 'stop', day: 0, run: false, S: 0.5, R: 0.0005, Cd: 0, nextDose: 0, hist: [], cured: false };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['ribo', 'cycle', 'resist'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setAbx(id) { st.abx = id; const a = ABX.find((x) => x.id === id); const c = a.p.clone().lerp(V3(0, 0, 0), 0.5); st.fly = flyTarget(c.clone().add(V3(-1.1, -1.8, 0)), c.clone().add(V3(-0.5, -0.1, 15))); refs.setInfo && refs.setInfo(); }
  function resetCycle() { st.ph = 0; st.cyc = 0; st.nAA = 0; st.nErr = 0; st.stall = 0; st.plen = 3; st.slots = { P: tpool[1], E: tpool[2], A: null }; st.inc = tpool[0]; st.spare = tpool[3]; beads.forEach((b, i) => { b.visible = i < st.plen; b.material = beads[0].material; }); st.errBeads = new Set(); }
  function resetCourse() { st.day = 0; st.run = false; st.S = 0.5; st.R = 0.0005; st.Cd = 0; st.nextDose = 0; st.hist = []; st.cured = false; st.relapse = false; BAC.forEach((b) => { b.live = false; b.s = 0; }); }
  resetCycle(); resetCourse();
  const errMat = organMat('#FF5A4A', 0.7, { emissiveIntensity: 0.25 });

  /* шаг цикла: 0 — подход аа-тРНК (0..1), 1 — пептидная связь (1..1.6), 2 — транслокация (1.6..2.5), 3 — выход из E (2.5..3) */
  function cycleUpdate(dt, t) {
    const ab = st.abx2; const speed = 0.55; st.ph += dt * speed;
    const ph = st.ph, { P, E } = st.slots, inc = st.inc;
    const blockA = ab === 'tet', blockPTC = ab === 'cam', blockExit = ab === 'ery' && st.plen >= 6;
    Object.entries(abx2).forEach(([k, g]) => { g.visible = k === ab; g.rotation.y += dt * 0.6; });
    // EF-Tu несёт тРНК
    if (ph < 1) {
      const u = smooth(0, 1, ph), back = blockA && ph > 0.55;
      const pos = back ? SLOT.in.clone().lerp(SLOT.A, 1 - smooth(0.55, 1, ph) * 1.0 + 0.15).add(V3(0, anchorY, 0)) : SLOT.in.clone().lerp(SLOT.A, blockA ? Math.min(u, 0.82) : u).add(V3(0, anchorY, 0));
      inc.visible = true; inc.position.copy(pos); efTu.visible = true; efTu.position.copy(pos).add(trProto.acc).add(V3(0.25, 0.05, 0.25));
      if (!st.wrongPicked) { st.wrong = (ab === 'amg' && rnd() < 0.45); st.wrongPicked = true; inc.userData.aa.material = st.wrong ? errMat : beads[0].material; }
      if (blockA && ph > 0.8 && ph < 0.83) fx.spawn(SLOT.A.clone().add(V3(40.3, 0.1, 0.4)), V3(0.4, 0.3, 0.3), C.set('#F2C14E'), 0.6, 0.6, 1);
      if (ph + dt * speed >= 1 && blockA) { st.ph = 0; st.wrongPicked = false; st.stall += 1; inc.position.copy(tPos('in')); return; }
    } else if (ph < 1.6) {
      efTu.visible = false; inc.position.copy(tPos('A')); st.slots.A = inc;
      if (blockPTC) { ptcG.spr.material.opacity = 0.5 + 0.3 * Math.sin(t * 10); if (ph + dt * speed >= 1.6) { st.ph = 1.0; st.stall += 0.25; } return; }
      if (!st.bonded && ph > 1.3) { st.bonded = true; st.plen = Math.min(NP, st.plen + 1); st.nAA += 1; if (st.wrong) { st.nErr += 1; st.errBeads.add(st.nAA); } fx.spawn(V3(40.15, 0.25, 0.3), V3(0, 0.4, 0.2), C.set('#FF8AB0'), 0.7, 0.7, 1.1); st.holder = 'A'; }
    } else if (ph < 2.5) {
      if (blockExit) { st.ph = 1.6; st.stall += dt; if (st.stall > 2.0) { st.plen = 2; st.stall = 0; st.msgDrop = 2; } return; }
      const u = smooth(1.6, 2.5, ph); efG.visible = true; efG.position.set(0.7 - u * 0.4, -0.35, 0.75);
      if (st.slots.A) st.slots.A.position.copy(tPos('A').lerp(tPos('P'), u)); P.position.copy(tPos('P').lerp(tPos('E'), u)); if (E) E.position.copy(tPos('E').lerp(SLOT.out.clone().add(V3(0, anchorY, 0)), u * 0.35));
      mG.position.x = -((st.cyc + u) % 4) * DX;
    } else {
      efG.visible = false; const u = smooth(2.5, 3, ph);
      if (E) { E.position.copy(tPos('E').lerp(SLOT.out.clone().add(V3(0, anchorY, 0)), 0.35 + 0.65 * u)); E.userData.m.material.opacity = 1 - u; }
      if (ph >= 3) {
        // сдвиг ролей
        if (E) { E.visible = false; E.userData.m.material.opacity = 1; }
        const oldE = E; st.slots = { E: P, P: st.slots.A || inc, A: null }; st.inc = oldE || st.spare; st.inc.visible = true; st.inc.userData.m.material.color.copy(new THREE.Color('#7FE0A0').multiplyScalar(0.55)); st.slots.P.userData.m.material.color.copy(new THREE.Color('#C77DFF').multiplyScalar(0.55)); st.slots.E.userData.m.material.color.copy(new THREE.Color('#C8C8D0').multiplyScalar(0.55));
        st.inc.position.copy(tPos('in')); st.ph = 0; st.cyc += 1; st.bonded = false; st.wrongPicked = false; st.holder = 'P';
      }
    }
    ptcG.spr.material.opacity = blockPTC ? ptcG.spr.material.opacity : 0.2;
  }
  function beadUpdate() {
    // цепь растёт от акцепторного конца тРНК-держателя по туннелю
    const hold = st.slots.A && st.holder === 'A' ? st.slots.A : st.slots.P;
    const base = hold.position.clone().add(trProto.acc);
    for (let i = 0; i < NP; i++) {
      const b = beads[i]; b.visible = i < st.plen && G2.visible;
      if (!b.visible) continue;
      const k = st.plen - 1 - i;   // 0 — последняя присоединённая
      const p = k === 0 ? base : TUN.getPoint(Math.min(1, (k - 0.3) / 11));
      b.position.copy(k === 1 ? base.clone().lerp(TUN.getPoint(0.06), 0.65) : p);
      const idx = st.nAA - k; b.material = st.errBeads.has(idx) ? errMat : beads[NP - 1].material;
    }
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
        st.R += st.R * h * (g * 0.85 - imm - 2.6 * st.Cd / (st.Cd + 2.5)) + 2e-4 * st.S * h * g;
        if (st.S < 2e-5) st.S = 0; if (st.R < 2e-5) st.R = 0;
        st.day += h;
      }
      if (st.hist.length === 0 || st.day - st.hist[st.hist.length - 1][0] > 0.05) st.hist.push([st.day, st.S, st.R, st.Cd]);
      if (st.course === 'stop' && st.day > 4 && st.S > 0.1 && !st.relapse) { st.relapse = true; refs.setInfo && refs.setInfo(); }
      if (st.S + st.R === 0) st.cured = true;
      if (st.day >= 16) st.run = false;
    }
    dish.material.emissiveIntensity = 0.02 + 0.3 * clamp(st.Cd, 0, 1.2) / 1.2;
    // сколько бактерий показать: чувствительные — пропорционально, устойчивые — с увеличением (иначе их не видно)
    const tgtS = Math.round(150 * st.S), tgtR = Math.min(40, Math.round(800 * st.R));
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
      ABX.forEach((x) => { const on = x === a; x.g.visible = on; x.glow.spr.material.opacity = on ? 0.45 + 0.2 * Math.sin(t * 3) : 0; x.glow.core.visible = false; if (on) x.g.rotation.y += dt * 0.5; });
      ['s30', 's50'].forEach((s) => { const on = !a || a.sub === s; MATS[s].forEach((m) => { m.opacity += ((!a ? 1 : on ? 0.55 : 0.1) - m.opacity) * Math.min(1, dt * 3); m.depthWrite = m.opacity > 0.9; }); });
      if (rnd() < 0.2) fx.spawn(a.p.clone().add(randUnit().multiplyScalar(0.3)), randUnit().multiplyScalar(0.15), C.set(a.col), 0.6, 0.7, 1);
    }
    if (st.mode === 'cycle') { cycleUpdate(dt, t); beadUpdate(); codons.forEach((g) => { g.visible = true; }); }
    if (st.mode === 'resist') courseUpdate(dt, t);
    fx.update(dt);
  }

  function drawScope(ctx, w, h) {
    if (st.mode !== 'resist') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'бактерии (лог. шкала) · сутки', xl: 'сутки →' });
    const X = (d) => A.X(d / 16), Y = (v) => A.Y(clamp((Math.log10(Math.max(v, 1e-5)) + 5) / 5, 0, 1));
    const len = st.course === 'full' ? 7 : st.course === 'stop' ? 3 : 0;
    if (len) { ctx.fillStyle = 'rgba(159,123,255,.14)'; ctx.fillRect(X(0), A.Y(1), X(len) - X(0), A.Y(0) - A.Y(1)); }
    const line = (k, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = Y(r[k]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
    line(1, '#7FE0A0'); line(2, '#FF9A5C');
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('курс', X(0) + 3, A.Y(1) + 10);
  }

  const TXT = {
    ribo: '<b>Рибосома бактерии 70S</b> (Thermus thermophilus, PDB 1VY4): малая субъединица 30S (жёлтая — 16S рРНК, оранжевые — белки) и большая 50S (голубые 23S и 5S рРНК, синие белки). Розовая нить — мРНК, зелёная, фиолетовая и серая — тРНК в участках A, P и E. Многие антибиотики садятся именно сюда: рибосомы бактерий (70S) отличаются от наших (80S), поэтому лекарство бьёт по микробу. Молекулы антибиотиков увеличены примерно втрое.',
    cycle: '<b>Элонгация</b> — повторяющийся цикл. 1) Фактор EF-Tu (зелёный) приносит аминоацил-тРНК в участок <b>A</b>, антикодон спаривается с кодоном мРНК. 2) В <b>пептидилтрансферазном центре</b> (это рРНК — рибозим) растущая цепь переносится на новую аминокислоту. 3) Фактор EF-G (оранжевый) за счёт ГТФ сдвигает рибосому на один кодон: тРНК переходят A → P → E. 4) Пустая тРНК уходит из E. Цепь выходит через <b>туннель</b> большой субъединицы. Включите антибиотик — увидите, какой шаг он ломает.',
    resist: '<b>Устойчивость к антибиотикам.</b> В огромной колонии почти всегда есть редкие мутанты, которые переносят лекарство лучше (оранжевые). Препарат быстро убивает чувствительных — через 2–3 дня бактерий так мало, что человеку уже лучше. Если на этом бросить, оставшихся не добивают, колония восстанавливается — и доля устойчивых в ней уже в десятки раз выше. Полный курс доводит число бактерий до уровня, который иммунитет добивает сам. Выберите сценарий и нажмите «Запустить».',
  };
  const ABTXT = {
    tet: '<b>Тетрациклины</b> (тетрациклин, доксициклин) садятся на малую субъединицу 30S рядом с участком A и не пускают туда аминоацил-тРНК — цепь не удлиняется. Действуют бактериостатически, широкий спектр (хламидии, микоплазмы, риккетсии). Связывают кальций: откладываются в растущих зубах и костях, поэтому не назначаются детям до 8 лет и беременным; молоко и антациды снижают всасывание.',
    amg: '<b>Аминогликозиды</b> (гентамицин, амикацин) связываются с декодирующим центром 30S — спиралью h44 16S рРНК у нуклеотидов A1492–A1493. Рибосома перестаёт проверять пары кодон–антикодон и ошибается: в белки встраиваются не те аминокислоты, неправильные белки повреждают мембрану. Действуют бактерицидно. Опасны для почек и внутреннего уха (глухота): митохондриальные рибосомы похожи на бактериальные.',
    str: '<b>Стрептомицин</b> — первый аминогликозид (1943) и первое лекарство от туберкулёза. Садится на 30S между 16S рРНК и белком S12 и фиксирует рибосому в «неточном» состоянии — растут ошибки чтения. Устойчивость часто возникает из-за одной мутации в гене белка S12.',
    cam: '<b>Левомицетин</b> (хлорамфеникол) садится в <b>пептидилтрансферазный центр</b> большой субъединицы 50S и мешает аминокислоте в участке A занять место — пептидная связь не образуется. Сюда же садится линезолид (резервный препарат против устойчивых стафилококков). Левомицетин подавляет и митохондриальные рибосомы клеток костного мозга — возможна апластическая анемия, поэтому применяется ограниченно.',
    ery: '<b>Макролиды</b> (эритромицин, азитромицин, кларитромицин) садятся в <b>туннель выхода</b> 50S чуть дальше пептидилтрансферазного центра. Синтез начинается, но цепь из нескольких аминокислот упирается в антибиотик — пептидил-тРНК отваливается. Применяются при аллергии на пенициллины, при атипичных пневмониях. Устойчивость — метилирование 23S рРНК в месте связывания (ген erm).',
  };
  const AB2TXT = {
    none: TXT.cycle,
    tet: '<b>Тетрациклин</b> (жёлтый) занимает участок A: аминоацил-тРНК подлетает и отскакивает. Цепь стоит, но рибосома не разрушена — когда препарат уходит, синтез продолжается (бактериостатическое действие).',
    amg: '<b>Аминогликозид</b> (голубой) искажает декодирующий центр: тРНК с «неправильной» аминокислотой (красные бусины) принимается почти так же охотно, как правильная. Белки собираются с ошибками.',
    cam: '<b>Левомицетин</b> (розовый) сидит в пептидилтрансферазном центре: тРНК в участке A есть, а пептидная связь не образуется — центр мигает, цикл не идёт дальше.',
    ery: '<b>Эритромицин</b> (оранжевый) перекрывает туннель: первые 4–5 аминокислот присоединяются, затем цепь упирается в препарат, рибосома стоит, и короткий пептид с тРНК отваливается — синтез начинается заново и снова застревает.',
  };
  const labels = [
    { text: 'малая субъединица 30S', pos: toW(c30).add(V3(1.6, -1.1, 0.6)), color: '#E8C772', show: () => st.labels && st.mode === 'ribo' },
    { text: 'большая субъединица 50S', pos: toW(c50).add(V3(1.7, 1.2, 0.6)), color: '#8FB4E6', show: () => st.labels && st.mode === 'ribo' },
    ...trOrd.map((o, i) => ({ text: o.name, pos: o.c.clone().add(V3(-0.2 - 0.25 * i, 0.15 + 0.35 * i, 0.4)), color: TCOL[i], show: () => st.labels && st.mode === 'ribo' && i < 2 })),
    { text: 'мРНК', pos: mrna ? cen(chPts(byId.AV).map(toW)).add(V3(0.4, -0.25, 0.3)) : V3(0, -1, 0), color: '#FF6FA8', show: () => st.labels && st.mode === 'ribo' },
    ...ABX.map((a) => ({ text: a.name, pos: a.p.clone().add(V3(0.45, 0.35, 0.3)), color: a.col, show: () => st.labels && st.mode === 'ribo' && st.abx === a.id })),
    { text: 'пептидилтрансферазный центр', pos: PTC.clone().add(V3(0.5, -0.5, 0.4)), color: '#FF8AB0', show: () => st.labels && st.mode === 'ribo' && st.abx === 'cam' },
    { text: 'выход туннеля', pos: EXIT.clone().add(V3(0.3, 0.3, 0.3)), color: '#C8D8FF', show: () => st.labels && st.mode === 'ribo' && st.abx === 'ery' },
    { text: 'A', pos: V3(40 + 0.8, -2.55, 0.9), color: '#7FE0A0', show: () => st.labels && st.mode === 'cycle' },
    { text: 'P', pos: V3(40 - 0.2, -2.55, 0.9), color: '#C77DFF', show: () => st.labels && st.mode === 'cycle' },
    { text: 'E', pos: V3(40 - 1.2, -2.55, 0.9), color: '#C8C8D0', show: () => st.labels && st.mode === 'cycle' },
    { text: 'мРНК 5′ → 3′', pos: V3(40 + 2.4, -1.35, 0.4), color: '#FF6FA8', show: () => st.labels && st.mode === 'cycle' },
    { text: 'туннель выхода', pos: V3(40 - 1.25, 3.25, 0.3), color: '#C8D8FF', show: () => st.labels && st.mode === 'cycle' },
    { text: 'EF-Tu', pos: () => efTu.position.clone().add(V3(40.3, 0.35, 0)), color: '#5CC48A', show: () => st.labels && st.mode === 'cycle' && efTu.visible },
    { text: 'EF-G', pos: () => efG.position.clone().add(V3(40.35, -0.4, 0)), color: '#F2A040', show: () => st.labels && st.mode === 'cycle' && efG.visible },
    { text: 'малая субъединица', pos: V3(40 + 2.0, -2.15, 0.6), color: '#E8C772', show: () => st.labels && st.mode === 'cycle' },
    { text: 'большая субъединица', pos: V3(40 + 2.1, 1.95, 0.6), color: '#8FB4E6', show: () => st.labels && st.mode === 'cycle' },
    { text: 'чувствительные', pos: V3(80.6 - 2.3, -2.1, -2.35), color: '#7FE0A0', show: () => st.labels && st.mode === 'resist' },
    { text: 'устойчивые', pos: V3(80.6 + 0.9, -2.1, -2.55), color: '#FF9A5C', show: () => st.labels && st.mode === 'resist' },
  ];
  // подписи с функцией вместо точки — пересчитываем позицию каждый кадр
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = l.fn(); });
  const upd0 = update;
  function update2(dt) { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    const CTXT = { stop: TXT.resist, full: '<b>Полный курс</b> (7 дней). Чувствительные бактерии исчезают за несколько дней, а немногие устойчивые, у которых нет помощи соседей, добивает иммунитет: к концу курса колония пропадает. Поэтому курс не бросают, как только стало легче.', none: '<b>Без лечения.</b> Колония растёт до предела, который задают питание и иммунитет. Многие лёгкие инфекции (особенно вирусные — на них антибиотики вообще не действуют) проходят сами; бактериальные инфекции посерьёзнее — нет.' };
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'ribo' ? ABTXT[st.abx] : st.mode === 'cycle' ? AB2TXT[st.abx2] : (st.course === 'stop' && st.relapse ? '<b>Рецидив.</b> Курс брошен на 3-й день, когда бактерий осталось мало и симптомы стихли. Выжившие размножились снова, и устойчивых среди них теперь в десятки раз больше, чем было: следующий курс того же препарата сработает хуже. Так, шаг за шагом, отбираются устойчивые штаммы — особенно когда антибиотики пьют «на всякий случай» или от вирусных инфекций.' : CTXT[st.course]);
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'ribo', label: 'Мишени на рибосоме' }, { id: 'cycle', label: 'Цикл элонгации' }, { id: 'resist', label: 'Устойчивость' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'ribo') box.append(h('div', { class: 'glabel' }, 'Антибиотик'), h('div', { class: 'gctl' }, seg(ABX.map((a) => ({ id: a.id, label: a.name, color: a.col })), () => st.abx, (v) => setAbx(v))));
      else if (st.mode === 'cycle') box.append(h('div', { class: 'glabel' }, 'Антибиотик'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Нет' }, ...ABX.filter((a) => a.id !== 'str').map((a) => ({ id: a.id, label: a.name, color: a.col }))], () => st.abx2, (v) => { st.abx2 = v; resetCycle(); refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Сценарий'), h('div', { class: 'gctl' }, seg([{ id: 'stop', label: 'Бросить на 3-й день' }, { id: 'full', label: 'Полный курс' }, { id: 'none', label: 'Без лечения' }], () => st.course, (v) => { st.course = v; resetCourse(); refs.setInfo(); }), button('Запустить', () => { resetCourse(); st.run = true; refs.setInfo(); }, true)));
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
    if (st.mode === 'cycle') return [['Аминокислот', st.nAA, ''], ['Ошибок', st.nErr, ''], ['Синтез', st.abx2 === 'tet' || st.abx2 === 'cam' || (st.abx2 === 'ery' && st.plen >= 6) ? 'стоит' : 'идёт', '']];
    if (st.mode === 'resist') { const N = st.S + st.R; return [['Сутки', Math.floor(st.day), ''], ['Бактерий', N === 0 ? '0' : Math.round(N * 100) + '', N === 0 ? '' : '% от максимума'], ['Устойчивых', N === 0 ? '—' : (100 * st.R / N).toFixed(st.R / N < 0.01 ? 2 : 0).replace('.', ','), N === 0 ? '' : '%']]; }
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
        <h3>Механизмы устойчивости</h3><ul><li>Ферменты, разрушающие препарат (β-лактамазы, ферменты, модифицирующие аминогликозиды).</li><li>Изменение мишени (метилирование 23S рРНК — макролиды; мутации белка S12 — стрептомицин).</li><li>Насосы, выкачивающие препарат (тетрациклины), и снижение проницаемости.</li><li>Гены устойчивости передаются между бактериями на плазмидах.</li></ul>
        <p>Антибиотики не действуют на вирусы: у вирусов нет своих рибосом и клеточной стенки.</p></div>
      <div><h2>Условности</h2><ul><li>Рибосома — настоящая структура 70S (PDB 1VY4): рРНК и белки показаны трубками по остову; места антибиотиков — центры соответствующих нуклеотидов из кристаллических структур комплексов. Молекулы препаратов увеличены примерно втрое.</li><li>Цикл элонгации — схема: субъединицы условные, форма тРНК настоящая; скорости и размеры не в масштабе.</li><li>Колония — простая модель роста, иммунитета и действия препарата; число устойчивых бактерий на экране преувеличено, чтобы их было видно.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('ribo'); st.fly = null; setAbx('tet'); st.fly = null;
  return self;
}
