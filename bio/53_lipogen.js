// @scene lipogen makeLipogen | Синтез жиров, фосфолипиды, ожирение | Липиды
/* =========================================================
   БИОХИМИЯ · СИНТЕЗ ТРИАЦИЛГЛИЦЕРОЛОВ И ФОСФОЛИПИДОВ: глицерол-3-фосфат → фосфатидная кислота → ДАГ → ТАГ;
   ДАГ + ЦДФ-холин → фосфатидилхолин, липотропные факторы и жировая печень; жировая ткань и ожирение
   ========================================================= */
function makeLipogen() {
  rnd = mulberry(5301);
  const scene = bioStage({ rim: 0xe8c060 });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { tag: DK ? [V3(-1.4, -0.95, 0), V3(-0.8, 0.95, 17)] : [V3(0.8, -1.9, 0), V3(1.4, 0.0, 18.5)], pl: DK ? [V3(40.2, -1.6, 0), V3(40.8, 0.3, 21)] : [V3(41.2, -1.8, 0), V3(41.8, 0.1, 18.5)], fat: DK ? [V3(79.9, -1.4, 0), V3(80.5, 0.9, 19)] : [V3(80.8, -1.7, 0), V3(81.4, 0.6, 17.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.tag[1]);
  const controls = makeControls(camera, VIEW.tag[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  // липид вертикально: голова (глицерин, фосфат) вверху, ацильные хвосты вниз; группа-обёртка, чтобы вращать вокруг вертикали
  const fitV = (id, R, o = {}) => { const m = typeof id === 'string' ? MOL(id) : id; const sc = o.scale || molFit(m, R); const g = molMesh(m, { scale: sc, hideH: true, ...o }); const X = (i) => V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2]).multiplyScalar(sc);
    const ax = pcaAxis(Array.from({ length: m.n }, (_, i) => X(i))); const hd = m.el.indexOf('P') >= 0 ? m.el.indexOf('P') : m.el.indexOf('O'); if (X(hd).sub(ax.c).dot(ax.v) < 0) ax.v.negate();
    g.quaternion.setFromUnitVectors(ax.v, V3(0, 1, 0)); g.position.copy(ax.c.clone().applyQuaternion(g.quaternion).negate()); const w = new THREE.Group(); w.add(g); return w; };
  const COL = { acyl: '#E8C060', g3p: '#FF9A30', pa: '#FF8A5C', dag: '#F2C14E', tag: '#E8D27A', pc: '#7FD6FF', pe: '#9FE870', pi: '#C77DFF', ch: '#FF8AB0' };

  /* ---------- 1. сборка ТАГ ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.6, 0, 0); scene.add(G1);
  const ST = [
    { id: 'g3p', x: -3.4, R: 0.55, name: 'глицерол-3-фосфат' }, { id: 'pa', x: -1.0, R: 1.25, name: 'фосфатидная кислота' },
    { id: 'dag', x: 1.4, R: 1.2, name: 'диацилглицерол' }, { id: 'tag', x: 3.8, R: 1.25, name: 'триацилглицерол (жир)' },
  ];
  const Y1 = 1.3;
  ST.forEach((s, i) => { s.g = s.id === 'g3p' ? fit(s.id, s.R) : fitV(s.id, s.R); s.g.position.set(s.x, Y1, 0); G1.add(s.g); s.glow = glowNucleus(G1, V3(s.x, Y1, -0.3), COL[s.id], 0.1, 14); s.glow.core.visible = false; s.glow.spr.material.opacity = 0.08; });
  const ARR1 = [0, 1, 2].map((i) => flowArrow(G1, V3(ST[i].x + (i ? 0.45 : ST[i].R * 0.75), Y1 - 0.15, 0), V3(ST[i + 1].x - 0.45, Y1 - 0.15, 0), '#E8C060', { bend: 0.12 }));
  const ENZ1 = ['ацилтрансферазы (+2 ацил-КоА)', 'фосфатаза (−Pi)', 'ацилтрансфераза (+ацил-КоА)'];
  // ацил-КоА: «хвосты» пальмитата, прилетающие сверху
  const ACYL = []; for (let i = 0; i < 4; i++) { const m = fit('palmitic', 0.75); m.visible = false; G1.add(m); ACYL.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
  const piM = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), atomMat('P')); piM.visible = false; G1.add(piM);
  // источники глицерол-3-фосфата
  const SRC = [{ id: 'glucose', x: -4.4, y: -1.2, name: 'глюкоза → ДГАФ' }, { id: 'glycerol', x: -2.3, y: -1.2, name: 'глицерол (только печень)' }];
  SRC.forEach((s) => { s.g = fit(s.id, 0.5); s.g.position.set(s.x, s.y, 0); G1.add(s.g); s.a = flowArrow(G1, V3(s.x, s.y + 0.5, 0), V3(ST[0].x + (s.x < ST[0].x ? -0.25 : 0.25), Y1 - 0.55, 0), COL.g3p, { bend: s.x < ST[0].x ? -0.2 : 0.2 }); });
  // куда идёт жир: ЛПОНП (печень) или капля (жировая ткань)
  const vldl = new THREE.Group(); vldl.position.set(3.8, -1.5, 0); G1.add(vldl);
  vldl.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), protMat(COL.tag, 0.35)));
  { const shell = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), glassMat(0x7fd6ff, { rim: 0.6, base: 0.02, pow: 2 })); vldl.add(shell); const apo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 8, 48), protMat('#FF8AB0', 0.6)); apo.rotation.x = 1.1; vldl.add(apo); }
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 24), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.28), roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.4, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.015, envMapIntensity: 0.4 })); drop.position.set(3.8, -1.5, 0); G1.add(drop);
  const aOut = flowArrow(G1, V3(3.8, Y1 - 1.35, 0), V3(3.8, -0.7, 0), COL.tag, { bend: 0 });

  /* ---------- 2. фосфолипиды и печень ---------- */
  const OX2 = 41.3; const G2 = new THREE.Group(); G2.position.set(OX2, 0, 0); scene.add(G2);
  const P2 = { pa: V3(-4.0, 1.9, 0), dag: V3(-1.9, 1.9, 0), pc: V3(0.4, 2.8, 0), pe: V3(0.4, 0.6, 0), cdpdag: V3(-4.0, -0.7, 0), pi: V3(-1.9, -0.7, 0) };
  const n2 = { pa: fitV('pa', 0, { scale: 0.058, bondR: 0.2 }), dag: fitV('dag', 0, { scale: 0.058, bondR: 0.2 }), pc: fitV(lipidMol(68), 0, { scale: 0.058, bondR: 0.2 }), pe: fitV('pe', 0, { scale: 0.058, bondR: 0.2 }), cdpdag: fitV('cdpdag', 0, { scale: 0.058, bondR: 0.2 }), pi: fitV('ptdins', 0, { scale: 0.058, bondR: 0.2 }) }; // ФЭ, ЦДФ-ДАГ и ФИ — свои молекулы (этаноламин, цитидин, инозитол)
  Object.entries(n2).forEach(([k, g]) => { g.position.copy(P2[k]); G2.add(g); });
  const cho = fit('choline', 0.35); cho.position.set(-1.2, 3.05, 0.2); G2.add(cho);
  const A2 = {
    pd: flowArrow(G2, P2.pa.clone().add(V3(0.75, 0, 0)), P2.dag.clone().add(V3(-0.75, 0, 0)), COL.dag, { bend: 0.15 }),
    pc: flowArrow(G2, P2.dag.clone().add(V3(0.6, 0.3, 0)), P2.pc.clone().add(V3(-0.75, -0.1, 0)), COL.pc, { bend: 0.15 }),
    pe: flowArrow(G2, P2.dag.clone().add(V3(0.6, -0.3, 0)), P2.pe.clone().add(V3(-0.75, 0.1, 0)), COL.pe, { bend: -0.15 }),
    meth: flowArrow(G2, P2.pe.clone().add(V3(0.55, 0.45, 0)), P2.pc.clone().add(V3(0.55, -0.5, 0)), '#FF8AB0', { bend: -0.35 }),
    cdp: flowArrow(G2, P2.pa.clone().add(V3(0, -0.85, 0)), P2.cdpdag.clone().add(V3(0, 0.95, 0)), '#C8A0FF', { bend: 0.15 }),
    pi: flowArrow(G2, P2.cdpdag.clone().add(V3(0.7, 0, 0)), P2.pi.clone().add(V3(-0.7, 0, 0)), COL.pi, { bend: 0.15 }),
    cho: flowArrow(G2, V3(-1.0, 2.8, 0.2), P2.pc.clone().add(V3(-0.6, 0.35, 0)), COL.ch, { bend: 0.25, r: 0.018 }),
  };
  // гепатоцит
  const HEP = V3(3.7, 0.9, 0);
  const hepG = blobGeo(1.7, 1.55, 1.0, 71, 0.05, 4); hepG.computeVertexNormals();
  const hep = new THREE.Mesh(hepG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#B0523A').multiplyScalar(0.3), roughness: 0.5, transparent: true, opacity: 0.45, depthWrite: false })); hep.position.copy(HEP); G2.add(hep);
  { const hg = new THREE.Mesh(hepG, glassMat(0xffb090, { rim: 0.35, base: 0.01, pow: 2 })); hg.position.copy(HEP); G2.add(hg); }
  const hnuc = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 18), protMat('#9F7BFF', 0.35)); hnuc.position.copy(HEP).add(V3(-0.6, 0.55, 0.1)); G2.add(hnuc);
  const DROPS = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.5), roughness: 0.15, clearcoat: 1, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.06 })); const p = HEP.clone().add(V3(rand(-1.0, 1.1), rand(-1.0, 0.9), rand(-0.4, 0.4))); if (p.distanceTo(hnuc.position) < 0.6) p.x += 0.8; m.position.copy(p); G2.add(m); DROPS.push({ m, w: 0.6 + rnd() * 0.6 }); }
  const VL = []; for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.6), emissive: new THREE.Color(COL.pc), emissiveIntensity: 0.25, roughness: 0.3 })); m.visible = false; G2.add(m); VL.push({ m, age: 9 }); }

  /* ---------- 3. жировая ткань и ожирение ---------- */
  const G3 = new THREE.Group(); G3.position.set(80.7, 0, 0); scene.add(G3);
  const ADI = [];
  const adiMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.26), roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.45, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.012, envMapIntensity: 0.35 });
  const cytMat = glassMat(0xffd8a0, { rim: 0.6, base: 0.015, pow: 2.4, keep: true });
  function addAdipocyte(p, born = 0) { const g = new THREE.Group(); g.position.copy(p); const d = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), adiMat); const sh = new THREE.Mesh(new THREE.SphereGeometry(1.06, 32, 24), cytMat); const nu = new THREE.Mesh(ell3(0.18, 0.1, 0.14), protMat('#9F7BFF', 0.4)); g.add(d, sh, nu); G3.add(g); const a = { g, d, sh, nu, born, dir: randUnit() }; ADI.push(a); return a; }
  [[-1.6, 0.6], [0.2, 1.0], [1.9, 0.4], [-0.8, -0.9], [1.0, -0.9], [-2.6, -0.6], [2.8, -0.8]].forEach(([x, y]) => addAdipocyte(V3(x, y, rand(-0.3, 0.3))));
  const SPARE = [[-3.4, 1.0], [3.4, 1.2], [0.0, -2.1], [-1.9, -2.0], [2.2, -2.0], [-0.6, 2.3]];
  const CAP3 = new THREE.CatmullRomCurve3([V3(-3.6, 0.2, 0.75), V3(-1.2, -0.05, 0.95), V3(1.3, 0.0, 0.9), V3(4.2, 0.25, 0.75)]); // капилляр в щели между клетками
  G3.add(new THREE.Mesh(taperTube(CAP3, () => 0.16, 60, 12), organMat('#C0404A', 0.45, { transparent: true, opacity: 0.7 })));
  const MAC = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(blobGeo(0.3, 0.26, 0.26, 80 + i, 0.25, 3), protMat('#C77DFF', 0.45)); m.geometry.computeVertexNormals(); m.visible = false; G3.add(m); MAC.push(m); }

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'tag', labels: true, rot: false, fly: null, msg: null, tissue: 'adipose', cyc: 0, made: 0, lipo: true, alc: false, liverFat: 0.15, vldlOut: 0,
    bal: 0, years: 0, fatKg: 15, run: true, hormone: 'none', hT: -99 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['tag', 'pl', 'fat'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const BASE = 70 - 15; // масса без жира, кг (рост 1,75 м)
  const bmi = () => (BASE + st.fatKg) / (1.75 * 1.75);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'tag') {
      const P = 7; st.cyc += dt; if (st.cyc > P) { st.cyc = 0; st.made++; }
      const c = st.cyc, step = c < 2.2 ? 0 : c < 3.8 ? 1 : c < 5.6 ? 2 : 3;
      ST.forEach((s, i) => { s.g.rotation.y += dt * 0.35; const on = i === step; s.glow.spr.material.opacity = on ? 0.28 : 0.06; s.glow.spr.scale.setScalar((on ? 1.8 : 1.2) * (1 + 0.05 * Math.sin(t * 4))); });
      ARR1.forEach((a, i) => { a.mat.uniforms.uTime.value = t; a.mat.uniforms.uOn.value = i === step - 1 || (i === step && c % 2 > 1.3) ? 1.1 : 0.25; });
      SRC.forEach((s) => { s.a.mat.uniforms.uTime.value = t; s.a.mat.uniforms.uOn.value = s.id === 'glycerol' && st.tissue === 'adipose' ? 0.03 : step === 0 ? 0.9 : 0.25; s.g.rotation.y += dt * 0.4; });
      SRC[1].g.visible = SRC[1].a.mesh.visible = SRC[1].a.cone.visible = st.tissue === 'liver';
      // ацил-КоА прилетают на шагах 1 (два) и 3 (один)
      const fire = (k, at, x) => { const q = ACYL[k]; if (c >= at && c < at + dt * 1.5) { q.age = 0; q.m.visible = true; q.a.set(x - 0.6, Y1 + 2.4, 0.4); q.b.set(x - 0.2, Y1 + 0.2, 0.2); } };
      fire(0, 1.0, ST[1].x); fire(1, 1.4, ST[1].x); fire(2, 4.4, ST[3].x);
      ACYL.forEach((q) => { if (q.age < 1.2) { q.age += dt; q.m.position.copy(q.a).lerp(q.b, smooth(0, 1.1, q.age)); q.m.rotation.z = -0.6 + q.age; } else q.m.visible = false; });
      const pk = c - 3.0; piM.visible = pk > 0 && pk < 1.4; if (piM.visible) piM.position.set(ST[1].x + 1.2 + pk * 0.4, Y1 - 0.2 - pk * 1.0, 0.3);
      vldl.visible = st.tissue === 'liver'; drop.visible = st.tissue === 'adipose'; aOut.mat.uniforms.uTime.value = t; aOut.mat.uniforms.uOn.value = step === 3 ? 1 : 0.2;
      vldl.rotation.y += dt * 0.5; drop.scale.setScalar(1 + Math.min(0.35, st.made * 0.03));
    }
    if (st.mode === 'pl') {
      const pcRate = st.lipo ? 1 : 0.15, tagIn = st.alc ? 1.6 : 1;
      Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
      A2.pc.mat.uniforms.uOn.value = 0.2 + 0.8 * pcRate; A2.meth.mat.uniforms.uOn.value = st.lipo ? 0.8 : 0.1; A2.cho.mat.uniforms.uOn.value = st.lipo ? 0.9 : 0.05; cho.visible = st.lipo;
      ['pd', 'pe', 'cdp', 'pi'].forEach((k) => { A2[k].mat.uniforms.uOn.value = 0.7; });
      // без фосфатидилхолина ЛПОНП не собираются — жир остаётся в печени
      const out = 0.9 * pcRate; st.vldlOut = out;
      st.liverFat = clamp(st.liverFat + (0.05 * tagIn - 0.07 * out) * dt, 0.1, 1);
      DROPS.forEach((d, i) => { const r = 0.12 + 0.42 * st.liverFat * d.w; d.m.scale.setScalar(r); });
      VL.forEach((v) => { if (v.age > 2.4 && rnd() < out * dt * 1.5) { v.age = 0; v.m.visible = true; } if (v.age < 2.4) { v.age += dt; v.m.position.copy(HEP).add(V3(0.9 + v.age * 1.1, -0.4 + Math.sin(v.age * 3) * 0.1, 0.4)); v.m.material.opacity = 1; } else v.m.visible = false; });
      Object.values(n2).forEach((g, i) => { g.rotation.y += dt * (0.25 + 0.04 * i); });
    }
    if (st.mode === 'fat') {
      if (st.run) { st.years += dt * 0.5; st.fatKg = clamp(st.fatKg + st.bal * 365 / 7700 * dt * 0.5, 4, 75); }
      const k = t - st.hT; const H = k < 6 ? st.hormone : 'none';
      // объём жировой клетки растёт с массой жира; при большом объёме появляются новые клетки
      const need = st.fatKg > 32 ? Math.min(SPARE.length, Math.floor((st.fatKg - 32) / 6) + 1) : 0;
      while (ADI.length - 7 < need) { const p = SPARE[ADI.length - 7]; addAdipocyte(V3(p[0], p[1], 0), t); }
      const R = clamp(0.84 * Math.cbrt(st.fatKg / 15) / Math.cbrt(ADI.length / 7), 0.35, 1.25);
      ADI.forEach((a, i) => { const grow = smooth(0, 2, t - a.born); const r = R * (a.born ? grow : 1) * (1 + 0.03 * Math.sin(t + i)); a.d.scale.setScalar(Math.max(0.01, r)); a.sh.scale.setScalar(Math.max(0.01, r)); a.nu.position.copy(a.dir).multiplyScalar(r * 1.0); a.d.material.emissiveIntensity = H === 'ins' ? 0.05 : 0.012; });
      const b = bmi(); const inflam = clamp((b - 30) / 8, 0, 1);
      MAC.forEach((m, i) => { m.visible = i < Math.round(inflam * MAC.length); if (m.visible) { const a = ADI[i % ADI.length]; m.position.copy(a.g.position).add(V3(Math.cos(i * 2.1 + t * 0.2), Math.sin(i * 1.3), 0.6).multiplyScalar(R * 1.1)); } });
      if (H === 'ins' && rnd() < 0.6) { const u = rnd(); const a = ADI[Math.floor(rnd() * ADI.length)]; const p0 = CAP3.getPoint(u).add(G3.position); fx.spawn(p0, a.g.position.clone().add(G3.position).sub(p0).multiplyScalar(0.9), new THREE.Color(COL.acyl), 1.1, 0, 1.3); }
      if (H === 'adr' && rnd() < 0.6) { const a = ADI[Math.floor(rnd() * ADI.length)]; const p0 = a.g.position.clone().add(G3.position); fx.spawn(p0, CAP3.getPoint(rnd()).add(G3.position).sub(p0).multiplyScalar(0.9), new THREE.Color('#FFB070'), 1.1, 0, 1.3); }
      if (H === 'adr') st.fatKg = Math.max(4, st.fatKg - dt * 0.05); if (H === 'ins') st.fatKg = Math.min(75, st.fatKg + dt * 0.04);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'pl') { scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'печень: жир и выход ЛПОНП', x0: 10 });
      [['жир в печени', st.liverFat, '#E8D27A'], ['выход ЛПОНП', st.vldlOut, '#7FD6FF']].forEach(([n, v, c], i) => { const y = 30 + i * 30; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(110, y, (w - 140) * clamp(v, 0, 1), 12); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 12, y + 10); }); return; }
    if (st.mode !== 'fat') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'индекс массы тела', xl: 'ИМТ 15 → 45', x0: 10 });
    const zones = [[15, 18.5, 'rgba(127,214,255,.15)'], [18.5, 25, 'rgba(127,224,160,.18)'], [25, 30, 'rgba(242,193,78,.18)'], [30, 45, 'rgba(255,106,90,.18)']];
    zones.forEach(([a, b, c]) => { ctx.fillStyle = c; ctx.fillRect(A.X((a - 15) / 30), A.Y(1), A.X((b - 15) / 30) - A.X((a - 15) / 30), A.Y(0) - A.Y(1)); });
    const x = A.X(clamp((bmi() - 15) / 30, 0, 1)); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, A.Y(0)); ctx.lineTo(x, A.Y(1)); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; [['дефицит', 15.5], ['норма', 19.5], ['избыток', 25.5], ['ожирение', 33]].forEach(([n, v]) => { ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fillText(n, A.X((v - 15) / 30), A.Y(0.85)); });
  }
  const TXT = {
    tag: '<b>Синтез триацилглицеролов</b> (жиров) идёт в печени, жировой ткани и стенке кишки. Основа — <b>глицерол-3-фосфат</b>: в жировой ткани он получается только из глюкозы (через дигидроксиацетонфосфат), а в печени ещё и из глицерина (глицеролкиназа). К нему по очереди пришиваются два остатка жирных кислот в виде <b>ацил-КоА</b> → <b>фосфатидная кислота</b>; фосфатаза снимает фосфат → <b>диацилглицерол</b>; третий ацил-КоА → <b>триацилглицерол</b>. Печень упаковывает жир в <b>ЛПОНП</b> и отправляет в кровь, жировая ткань хранит его в капле. Синтез включает <b>инсулин</b>.',
    pl: '<b>Фосфолипиды</b> строятся из тех же предшественников. <b>Диацилглицерол</b> + ЦДФ-холин → <b>фосфатидилхолин</b> (лецитин), + ЦДФ-этаноламин → <b>фосфатидилэтаноламин</b>; в печени ФЭ может превратиться в ФХ, получив три метильные группы от S-аденозилметионина. Из фосфатидной кислоты через ЦДФ-диацилглицерол получаются <b>фосфатидилинозитол</b> (источник сигнальных ИФ₃ и ДАГ) и кардиолипин. Фосфатидилхолин нужен печени, чтобы собрать оболочку ЛПОНП и вывести жир. Поэтому холин, метионин, витамины B12 и фолат называют <b>липотропными факторами</b>.',
    fat: '<b>Жировая ткань</b> — главное хранилище энергии: в 1 кг жира около 7700 ккал. После еды <b>инсулин</b> включает липопротеинлипазу капилляров (жирные кислоты из ЛПОНП и хиломикронов уходят в клетки) и синтез жира; при голоде и нагрузке <b>адреналин</b> и глюкагон запускают липолиз. Если долго есть больше, чем тратить, адипоциты растут (гипертрофия), а затем появляются новые (гиперплазия). Перегруженные клетки воспаляются: в ткань приходят макрофаги (фиолетовые), выделяются воспалительные цитокины, развивается <b>инсулинорезистентность</b>. Двигайте баланс калорий.',
  };
  const labels = [
    ...ST.map((s) => ({ text: s.name, pos: V3(s.x + 0.6 - Math.min(1.0, s.name.length * 0.05), Y1 + s.R + 0.2, 0), color: COL[s.id], show: () => st.labels && st.mode === 'tag' })),
    ...ENZ1.map((n, i) => ({ text: n, pos: V3((ST[i].x + ST[i + 1].x) / 2 - n.length * 0.034, Y1 - 1.05, 0.3),   /* под стрелкой, ниже хвостов молекул */ color: '#C8C8D0', show: () => st.labels && st.mode === 'tag' })),
    { text: 'ацил-КоА', pos: V3(-0.9 + 0.6, Y1 + 2.0, 0.4), color: COL.acyl, show: () => st.labels && st.mode === 'tag' && st.cyc > 0.8 && st.cyc < 2.4 },
    { text: 'глюкоза → ДГАФ', pos: V3(-4.4 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' },
    { text: 'глицерол (печень)', pos: V3(-2.3 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'ЛПОНП → кровь', pos: V3(3.5, -2.5, 0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'жировая капля', pos: V3(3.5, -2.5, 0.2), color: COL.tag, show: () => st.labels && st.mode === 'tag' && st.tissue === 'adipose' },
    { text: 'фосфатидная кислота', pos: P2.pa.clone().add(V3(OX2 - 0.5, 0.75, 0)), color: COL.pa, show: () => st.labels && st.mode === 'pl' },
    { text: 'ДАГ', pos: P2.dag.clone().add(V3(OX2 - 0.1, 0.75, 0)), color: COL.dag, show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилхолин', pos: P2.pc.clone().add(V3(OX2 + 0.2, 0.75, 0)), color: COL.pc, show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилэтаноламин', pos: P2.pe.clone().add(V3(OX2 + 0.2, -0.8, 0)), color: COL.pe, show: () => st.labels && st.mode === 'pl' },
    { text: 'ЦДФ-ДАГ', pos: P2.cdpdag.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: '#C8A0FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилинозитол', pos: P2.pi.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: COL.pi, show: () => st.labels && st.mode === 'pl' },
    { text: 'холин', pos: V3(OX2 - 1.2 + 0.4, 3.65, 0.2), color: COL.ch, show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: '3 SAM', pos: P2.pe.clone().lerp(P2.pc, 0.5).add(V3(OX2 + 1.15, 0, 0.2)), color: '#FF8AB0', show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: 'гепатоцит', pos: HEP.clone().add(V3(OX2 + 0.2, 1.75, 0)), color: '#E08060', show: () => st.labels && st.mode === 'pl' },
    { text: 'ЛПОНП → кровь', pos: HEP.clone().add(V3(OX2 + 1.8, -0.15, 0.4)), color: '#7FD6FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'адипоциты', pos: V3(80 + 0.6, 2.6, 0.5), color: COL.tag, show: () => st.labels && st.mode === 'fat' },
    { text: 'капилляр', pos: V3(80.7 + 3.3, 0.55, 0.9), color: '#E06A6A', show: () => st.labels && st.mode === 'fat' },
    { text: 'макрофаги', pos: V3(80 + 3.4, -1.9, 0.8), color: '#C77DFF', show: () => st.labels && st.mode === 'fat' && bmi() > 31 },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'tag', label: 'Синтез жира' }, { id: 'pl', label: 'Фосфолипиды и печень' }, { id: 'fat', label: 'Жировая ткань' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'tag') box.append(h('div', { class: 'glabel' }, 'Где идёт синтез'), h('div', { class: 'gctl' }, seg([{ id: 'adipose', label: 'Жировая ткань' }, { id: 'liver', label: 'Печень' }], () => st.tissue, (v) => { st.tissue = v; })));
      else if (st.mode === 'pl') box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' },
        toggle('Холин и метионин', () => st.lipo, (v) => { st.lipo = v; st.msg = v ? null : '<b>Дефицит липотропных факторов.</b> Без холина (и метионина как донора метильных групп) печень не может сделать достаточно фосфатидилхолина для оболочек ЛПОНП. Жир продолжает синтезироваться, но не выводится — развивается <b>жировая дистрофия печени</b> (капли растут). Так бывает при белковом голодании, у животных на бесхолиновой диете.'; refs.setInfo(); }),
        toggle('Алкоголь', () => st.alc, (v) => { st.alc = v; st.msg = v ? '<b>Алкоголь</b> перегружает печень НАДН: тормозится β-окисление и усиливается синтез глицерол-3-фосфата и жира. Печень наполняется жиром даже при нормальном питании — первая стадия алкогольной болезни печени (обратимая при отказе от спиртного).' : null; refs.setInfo(); }),
        button('Сброс', () => { st.liverFat = 0.15; })));
      else box.append(h('div', { class: 'glabel' }, 'Баланс калорий в день'), h('div', { class: 'gctl' }, range('lgBal', -600, 600, 10, () => st.bal, (v) => { st.bal = v; }, (v) => (v > 0 ? '+' : '') + v + ' ккал'), toggle('Идут годы', () => st.run, (v) => { st.run = v; })),
        h('div', { class: 'gctl', style: 'margin-top:6px' }, button('Поесть (инсулин)', () => { st.hormone = 'ins'; st.hT = st.t; st.msg = '<b>После еды</b> инсулин включает липопротеинлипазу на стенке капилляров: она расщепляет жиры ЛПОНП и хиломикронов, жирные кислоты (жёлтые) уходят в адипоциты и снова собираются в ТАГ. Одновременно инсулин тормозит липолиз.'; refs.setInfo(); }), button('Голод, нагрузка (адреналин)', () => { st.hormone = 'adr'; st.hT = st.t; st.msg = '<b>Голод, холод, нагрузка, стресс:</b> адреналин и глюкагон через цАМФ включают гормон-чувствительную липазу. Жиры распадаются до жирных кислот (оранжевые) и глицерина и уходят в кровь — топливо для мышц и сердца.'; refs.setInfo(); }), button('Сброс', () => { st.fatKg = 15; st.years = 0; st.bal = 0; while (ADI.length > 7) { const a = ADI.pop(); G3.remove(a.g); } refs.rebuild(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['tag', 'pl', 'fat'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'fat') { const b = bmi(); return [['ИМТ', b.toFixed(1), ''], ['Жир', Math.round(st.fatKg), 'кг'], ['Лептин', Math.round(st.fatKg * 0.6), 'нг/мл'], ['Прошло', Math.floor(st.years), 'лет']]; }
    if (st.mode === 'pl') return [['Жир в печени', Math.round(st.liverFat * 30), '%'], ['Выход ЛПОНП', Math.round(st.vldlOut * 100), '%']];
    return [['Собрано молекул жира', st.made, ''], ['Ацил-КоА на молекулу', 3, '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E8C060',
    kicker: 'Биохимия · обмен липидов', title: 'Синтез жиров и ожирение',
    lede: 'Как из глюкозы и жирных кислот собирается жир и фосфолипиды мембран, почему печень может «ожиреть» и что происходит с жировой тканью, когда калорий слишком много.',
    notes: `
      <div><h2>Липогенез</h2>
        <p>Жирные кислоты для жира берутся из пищи или синтезируются из ацетил-КоА (избыток углеводов) в печени и жировой ткани. Синтез включают инсулин и избыток глюкозы, тормозят глюкагон и адреналин.</p>
        <h3>Ожирение</h3><p>Индекс массы тела = масса (кг) / рост² (м²): 18,5–25 — норма, 25–30 — избыточная масса, ≥ 30 — ожирение. Важна и локализация жира: висцеральный (вокруг органов) опаснее подкожного. Жировая ткань — эндокринный орган: <b>лептин</b> сообщает мозгу о запасах (при ожирении его много, но мозг становится к нему нечувствителен), <b>адипонектин</b> повышает чувствительность к инсулину (при ожирении его мало).</p>
        <h3>Жировая печень</h3><p>Неалкогольная жировая болезнь печени (НАЖБП; с 2023 г. — метаболически ассоциированная стеатотическая болезнь печени, МАЖБП / MASLD) — самое частое заболевание печени в мире; связана с ожирением и инсулинорезистентностью.</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы — по формулам; фосфатидилхолин — из реального бислоя (молекулярная динамика), остальные фосфолипиды показаны условно окрашенными.</li><li>Модель массы тела упрощена: 7700 ккал на кг жира, без адаптации обмена.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('tag'); st.fly = null;
  return self;
}
