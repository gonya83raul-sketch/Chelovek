// @scene liver makeLiver | Печень: обезвреживание, алкоголь, парацетамол | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ПЕЧЕНЬ: печёночная долька (зоны, кровоток, желчь; жировая инфильтрация, цирроз),
   микросомальное окисление (НАДФН → ФП → b5 → P450) и конъюгация, обмен этанола (АДГ, АльДГ, МЭОС),
   парацетамол → NAPQI → глутатион, антидот ацетилцистеин
   ========================================================= */
function makeLiver() {
  rnd = mulberry(2701);
  const scene = bioStage({ bg: 0x0a0807, rim: 0xc87a4a });
  const VIEW = { lob: flyTarget(V3(0.6, -2.0, 0), V3(1.0, 2.6, 18.5)), detox: flyTarget(V3(40.4, -2.3, 0), V3(40.9, -0.4, 17)), alc: flyTarget(V3(79.0, -2.4, 0), V3(79.5, -0.7, 17)), para: flyTarget(V3(119.1, -2.4, 0), V3(119.6, -0.7, 17)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.lob.pos);
  const controls = makeControls(camera, VIEW.lob.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);
  const molAt = (parent, m, pos, R, o = {}) => { const s = molFit(m, R); const g = molMesh(m, { scale: s, hideH: true, ...o }); const w = new THREE.Group(); w.add(g); w.position.copy(pos); parent.add(w); return w; };
  const dm = new THREE.Object3D();

  /* ---------- 1. печёночная долька ---------- */
  const G1 = new THREE.Group(); G1.position.set(1.2, 0.3, 0); G1.rotation.x = -0.55; scene.add(G1);
  const R = 3.0, NR = 24, NC = 8;
  const cv = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.9, 32, 1, true), organMat('#4A5AA0', 0.5, { side: THREE.DoubleSide })); cv.rotation.x = Math.PI / 2; G1.add(cv);
  const hexR = (a) => R * Math.cos(Math.PI / 6) / Math.cos(((a % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3) - Math.PI / 6);
  const cells = []; for (let i = 0; i < NR; i++) { const a = (i + 0.5) / NR * Math.PI * 2; const L = hexR(a); for (let j = 0; j < NC; j++) { const r = 0.55 + (L - 0.75) * (j + 0.5) / NC; cells.push({ a, r, i, j, L }); } }
  const cellMesh = new THREE.InstancedMesh((() => { const g = smoothIco(1, 2); g.computeVertexNormals(); return g; })(), new THREE.MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.3, envMapIntensity: 0.4 }), cells.length); G1.add(cellMesh);
  const fatMesh = new THREE.InstancedMesh(SPH, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F2D06A').multiplyScalar(0.5), roughness: 0.25, clearcoat: 0.8, emissive: 0xf2c14e, emissiveIntensity: 0.08 }), cells.length); G1.add(fatMesh);
  const tri = []; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const p = V3(Math.cos(a) * R, Math.sin(a) * R, 0); const g = new THREE.Group(); g.position.copy(p); G1.add(g);
    [['#8A4AB0', 0.2, V3(0, 0, 0)], ['#E04A4A', 0.1, V3(0.24, 0.16, 0)], ['#5CC48A', 0.09, V3(-0.22, 0.18, 0)]].forEach(([c, r, o]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.95, 20), organMat(c, 0.5, { emissiveIntensity: 0.1 })); m.rotation.x = Math.PI / 2; m.position.copy(o); g.add(m); }); tri.push(p); }
  const septa = new THREE.Group(); G1.add(septa); for (let k = 0; k < 6; k++) { const a = tri[k], b = tri[(k + 1) % 6]; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, a.distanceTo(b), 10), organMat('#D8D0C8', 0.45)); m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize()); septa.add(m); }
  for (let k = 0; k < 3; k++) { const a = tri[k], b = tri[k + 3]; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, a.distanceTo(b) * 0.82, 8), organMat('#D8D0C8', 0.4)); m.position.set(0, 0, 0.1); m.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize()); septa.add(m); }
  const NB = 220; const blood = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), NB); G1.add(blood);
  const bp = Array.from({ length: NB }, (_, i) => ({ a: (Math.floor(rnd() * NR)) / NR * Math.PI * 2, u: rnd(), bile: i < 50, z: rand(-0.3, 0.3) }));
  const zoneRing = [1, 2, 3].map((z) => { const m = new THREE.Mesh(new THREE.RingGeometry(0.55 + (z - 1) * 0.83, 0.57 + (z - 1) * 0.83 + 0.02, 6, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, side: THREE.DoubleSide })); m.position.z = 0.5; G1.add(m); return m; });

  /* ---------- 2. обезвреживание: микросомальное окисление ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const er = schemBilayer({ w: 11, d: 3.2, thick: 0.75, step: 0.22, head: '#C8A0E0', tail: '#9A86B0', seed: 5 }); er.position.set(0.6, -1.2, -0.6); G2.add(er);
  const blob = (c, rx, ry, rz, p, seed) => { const m = new THREE.Mesh(blobGeo(rx, ry, rz, seed, 0.12, 4), protMat(c, 0.45)); m.position.copy(p); G2.add(m); return m; };
  const FP = blob('#F2C14E', 0.55, 0.45, 0.45, V3(-2.9, -0.35, 0), 2), B5 = blob('#FF9A5C', 0.32, 0.5, 0.3, V3(-1.35, -0.35, 0), 3), P450 = blob('#E05A6A', 0.85, 0.7, 0.6, V3(0.6, -0.15, 0), 4), UGT = blob('#7FE0A0', 0.7, 0.6, 0.55, V3(3.3, -0.2, 0), 6);
  const hem = PDB('hbo').ligm.find((l) => l.name === 'HEM'); const hS = 0.07; const hemM = molMesh(hem, { scale: hS }); { const c = V3(0, 0, 0); for (let i = 0; i < hem.n; i++) c.add(V3(hem.xyz[i * 3], hem.xyz[i * 3 + 1], hem.xyz[i * 3 + 2])); c.multiplyScalar(-hS / hem.n); hemM.position.copy(c); }
  const hemW = new THREE.Group(); hemW.add(hemM); hemW.position.set(0.6, 0.3, 0.6); hemW.rotation.x = 1.2; G2.add(hemW); P450.material.transparent = true; P450.material.opacity = 0.75;
  const nadph = molAt(G2, MOL('nad'), V3(-3.9, 1.0, 0.2), 0.75, { tint: '#9FB4FF' });
  const eTok = Array.from({ length: 6 }, () => glowNucleus(G2, V3(0, 0, 0), '#7FD6FF', 0.04, 5));
  const ePath = new THREE.CatmullRomCurve3([V3(-4.0, 0.5, 0.3), V3(-2.9, 0.25, 0.5), V3(-1.35, 0.3, 0.45), V3(0.2, 0.35, 0.6)]);
  const sub = { benz: molAt(G2, MOL('benzene'), V3(0, 0, 0), 0.5), phen: molAt(G2, MOL('phenol'), V3(0, 0, 0), 0.55), gluc: molAt(G2, MOL('glucuronic'), V3(0, 0, 0), 0.55, { tint: '#7FE0A0' }) };
  const o2 = molAt(G2, MOL('o2'), V3(0, 0, 0), 0.3), h2o = molAt(G2, MOL('h2o'), V3(0, 0, 0), 0.3, { hideH: false });
  const PATH = new THREE.CatmullRomCurve3([V3(-3.4, 2.9, 0.3), V3(-1.6, 2.0, 0.6), V3(0.6, 1.05, 0.7), V3(1.9, 1.5, 0.7), V3(3.3, 0.95, 0.7), V3(4.8, 2.0, 0.5), V3(6.0, 2.8, 0.3)]);
  const P2 = 4; const cyp = [P450]; for (let i = 0; i < P2; i++) { const m = P450.clone(); m.material = P450.material.clone(); m.scale.setScalar(0.55); m.position.set(-3.8 + i * 2.6 + 1.3, -0.25, -1.2); m.visible = false; G2.add(m); cyp.push(m); }

  /* ---------- 3. алкоголь ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const AX = [V3(-4.6, 0.3, 0), V3(-1.4, 0.3, 0), V3(1.8, 0.3, 0), V3(4.8, 0.3, 0)];
  const am = [molAt(G3, MOL('ethanol'), AX[0], 0.55), molAt(G3, MOL('acetaldehyde'), AX[1], 0.55), molAt(G3, MOL('acetate'), AX[2], 0.55), molAt(G3, MOL('acetylcoa'), AX[3], 1.1)];
  const aArr = [0, 1, 2].map((i) => flowArrow(G3, AX[i].clone().add(V3(0.8, 0, 0)), AX[i + 1].clone().add(V3(i === 2 ? -1.35 : -0.8, 0, 0)), '#F2C14E', { bend: 0.1, r: 0.026 }));
  const meos = flowArrow(G3, AX[0].clone().add(V3(0.4, -0.7, 0)), AX[1].clone().add(V3(-0.4, -0.7, 0)), '#C77DFF', { bend: -0.35, r: 0.018 });
  const nadT = [0, 1].map((i) => { const g = new THREE.Group(); g.position.copy(AX[i].clone().lerp(AX[i + 1], 0.5)).add(V3(0, 1.25, 0)); G3.add(g); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 8, 40), new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.6 })); g.add(ring); const tok = glowNucleus(g, V3(0.32, 0, 0), '#9FB4FF', 0.05, 5); return { g, tok }; });
  const blk = [0, 1].map((i) => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: 0xff3a4a }); [0.8, -0.8].forEach((r) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.07), m); b.rotation.z = r; g.add(b); }); g.position.copy(AX[i].clone().lerp(AX[i + 1], 0.5)).add(V3(0, 0.05, 0.3)); g.visible = false; G3.add(g); return g; });
  const BARS = [['НАДН / НАД⁺', '#9FB4FF'], ['лактат', '#FF6A6A'], ['синтез жира', '#F2D06A'], ['глюконеогенез', '#7FE0A0']];
  const barM = BARS.map(([, c], i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1, 0.4), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.45), emissive: new THREE.Color(c), emissiveIntensity: 0.05, roughness: 0.35, clearcoat: 0.6 })); m.position.set(-2.4 + i * 1.6, -2.3, 0); G3.add(m); return m; });
  const barBase = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.04, 0.8), new THREE.MeshBasicMaterial({ color: 0x3a3a46 })); barBase.position.set(0, -2.3, 0); G3.add(barBase);

  /* ---------- 4. парацетамол ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const PX = { apap: V3(-1.4, 0.15, 0), glu: V3(-4.2, 1.15, 0), sul: V3(-4.2, -1.1, 0), napqi: V3(1.6, 0.15, 0), safe: V3(4.6, 1.2, 0), tox: V3(4.6, -1.1, 0) };
  const pm = { apap: molAt(G4, MOL('paracetamol'), PX.apap, 0.75), napqi: molAt(G4, MOL('napqi'), PX.napqi, 0.72) };
  { const g = new THREE.Group(); g.position.copy(PX.glu); G4.add(g); molAt(g, MOL('paracetamol'), V3(-0.4, 0, 0), 0.6); molAt(g, MOL('glucuronic'), V3(0.55, -0.15, 0.2), 0.5, { tint: '#7FE0A0' }); pm.glu = g; }
  { const g = new THREE.Group(); g.position.copy(PX.sul); G4.add(g); molAt(g, MOL('paracetamol'), V3(-0.3, 0, 0), 0.6); molAt(g, MOL('sulfate'), V3(0.55, -0.1, 0.2), 0.35); pm.sul = g; }
  { const g = new THREE.Group(); g.position.copy(PX.safe); G4.add(g); molAt(g, MOL('napqi'), V3(-0.45, 0, 0), 0.55); molAt(g, MOL('gsh'), V3(0.5, -0.1, 0.2), 0.75, { tint: '#7FD6FF' }); pm.safe = g; }
  const toxP = new THREE.Mesh(blobGeo(0.7, 0.55, 0.5, 11, 0.14, 4), protMat('#B07A6A', 0.4)); toxP.position.copy(PX.tox); G4.add(toxP); const toxN = molAt(G4, MOL('napqi'), PX.tox.clone().add(V3(-0.5, 0.45, 0.45)), 0.4);
  const pArr = [['apap', 'glu', '#7FE0A0'], ['apap', 'sul', '#F2CC3A'], ['apap', 'napqi', '#FF6A6A'], ['napqi', 'safe', '#7FD6FF'], ['napqi', 'tox', '#FF3A4A']].map(([a, b, c]) => { const pa = PX[a], pb = PX[b]; const d = pb.clone().sub(pa).normalize(); return { a, b, A: flowArrow(G4, pa.clone().addScaledVector(d, 0.85), pb.clone().addScaledVector(d, -0.9), c, { bend: 0.1, r: 0.024 }) }; });
  const gshTube = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.8, 32, 1, true), glassMat(0x7fd6ff, { rim: 0.35, base: 0.01 })); gshTube.position.set(1.6, -1.55, 0); G4.add(gshTube);
  const gshFill = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1, 32), new THREE.MeshPhysicalMaterial({ color: 0x2a6a8a, emissive: 0x7fd6ff, emissiveIntensity: 0.25, transparent: true, opacity: 0.85, roughness: 0.2 })); G4.add(gshFill);
  const nacM = molAt(G4, MOL('nac'), V3(0.2, -1.7, 0.3), 0.5); const nacArr = flowArrow(G4, V3(0.65, -1.7, 0.3), V3(1.15, -1.6, 0.3), '#7FD6FF', { bend: 0.0, r: 0.02 });
  const hep = new THREE.Mesh(blobGeo(6.8, 3.0, 0.6, 13, 0.05, 4), new THREE.MeshPhysicalMaterial({ color: 0x3a2018, roughness: 0.7, transparent: true, opacity: 0.16, depthWrite: false })); hep.position.set(0.1, 0.1, -1.4); G4.add(hep);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'lob', labels: true, rot: false, fly: null, msg: null, lob: 'norm', zones: false, ind: false, inh: false, dc: 0, drinks: 4, ah: 0, play: true, bac: 0, ald: 0, disulf: false, fome: false, dose: 4, ph: 0, gsh: 1, dmg: 0, nac: false, chron: false, hist: [], phist: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['lob', 'detox', 'alc', 'para'][k] === m; }); st.fly = VIEW[m]; st.msg = null; if (m === 'alc') resetAlc(); if (m === 'para') resetPara(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function resetAlc() { st.ah = 0; st.bac = 0; st.ald = 0; st.gut = st.drinks * 14; st.hist = []; }
  function resetPara() { st.ph = 0; st.gsh = st.chron ? 0.6 : 1; st.dmg = 0; st.phist = []; st.pgut = st.dose; }
  const col = new THREE.Color();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'lob') {
      const fat = st.lob === 'fat', cir = st.lob === 'cir';
      cells.forEach((c, k) => {
        const n = noise3(c.a * 3, c.r * 2, 0.3); const rr = c.r * (cir ? 0.92 + 0.08 * Math.sin(c.a * 6) : 1);
        const w = (c.L - 0.75) / NC * 0.5, s = cir ? 0.6 + 0.4 * (0.5 + 0.5 * n) : 1;
        dm.position.set(Math.cos(c.a) * rr, Math.sin(c.a) * rr, 0); dm.rotation.set(0, 0, c.a); dm.scale.set(w * 0.95 * s, Math.max(0.05, rr * Math.PI * 2 / NR * 0.36) * s, 0.36 * s); dm.updateMatrix(); cellMesh.setMatrixAt(k, dm.matrix);
        const zone = c.j / NC; col.set(st.zones ? (zone < 0.33 ? '#C0603A' : zone < 0.66 ? '#B07A50' : '#8A5A7A') : '#B0603F').multiplyScalar(0.45 + 0.05 * n);
        if (cir) col.lerp(new THREE.Color('#5A4A40'), 0.25 + 0.25 * n); cellMesh.setColorAt(k, col);
        const fs = fat ? (0.3 + 0.7 * (1 - zone * 0.6)) * (0.5 + 0.5 * Math.abs(n * 2)) : 0; dm.scale.setScalar(Math.max(0.0001, fs * w * 0.95)); dm.position.z = 0.24; dm.updateMatrix(); fatMesh.setMatrixAt(k, dm.matrix);
      });
      cellMesh.instanceMatrix.needsUpdate = true; if (cellMesh.instanceColor) cellMesh.instanceColor.needsUpdate = true; fatMesh.instanceMatrix.needsUpdate = true;
      septa.visible = cir;
      bp.forEach((q, i) => { q.u += dt * (cir ? 0.06 : 0.15) * (q.bile ? 0.8 : 1); if (q.u > 1) { q.u = 0; q.a = (Math.floor(rnd() * NR)) / NR * Math.PI * 2; } const L = hexR(q.a); const r = q.bile ? 0.5 + q.u * (L - 0.5) : L - q.u * (L - 0.4); dm.position.set(Math.cos(q.a) * r, Math.sin(q.a) * r, q.z * 0.6 + 0.25); dm.rotation.set(0, 0, 0); dm.scale.setScalar(q.bile ? 0.03 : 0.034); dm.updateMatrix(); blood.setMatrixAt(i, dm.matrix); blood.setColorAt(i, col.set(q.bile ? '#3A9A60' : '#B03030').lerp(new THREE.Color('#5A3A90'), q.bile ? 0 : q.u * 0.8)); });
      blood.instanceMatrix.needsUpdate = true; if (blood.instanceColor) blood.instanceColor.needsUpdate = true;
      zoneRing.forEach((m) => { m.material.opacity = st.zones ? 0.22 : 0; });
    }
    if (st.mode === 'detox') {
      const sp = (st.ind ? 1.8 : 1) * (st.inh ? 0.25 : 1); st.dc = (st.dc + dt * 0.12 * sp) % 1; const u = st.dc;
      const p = PATH.getPoint(u);
      sub.benz.visible = u < 0.36; sub.phen.visible = u >= 0.36; sub.gluc.visible = true;
      [sub.benz, sub.phen].forEach((m) => { m.position.copy(p); m.rotation.y = t; });
      sub.gluc.position.lerp(u < 0.62 ? V3(3.9, 0.45, 0.85) : p.clone().add(V3(0.75, -0.15, 0)), u < 0.62 ? 0.05 : 0.3); sub.gluc.rotation.y = -t * 0.8;
      const near = Math.exp(-(((u - 0.33) / 0.06) ** 2)); molGlow(sub.benz, 0.4 * near);
      o2.position.copy(V3(0.6, 1.0, 0.7).lerp(V3(1.2, 3.0, 0.4), 1 - smooth(0.18, 0.33, u))); o2.visible = u > 0.12 && u < 0.36;
      h2o.position.copy(V3(0.9, 0.9, 0.7).lerp(V3(2.2, 2.9, 0.4), smooth(0.36, 0.55, u))); h2o.visible = u > 0.36 && u < 0.55;
      P450.material.emissiveIntensity = 0.03 + 0.35 * near; UGT.material.emissiveIntensity = 0.03 + 0.3 * Math.exp(-(((u - 0.64) / 0.05) ** 2));
      eTok.forEach((e, i) => { const q = (t * 0.35 * sp + i / eTok.length) % 1; e.spr.position.copy(ePath.getPoint(q)); e.core.position.copy(e.spr.position); });
      nadph.rotation.y = t * 0.3; hemW.rotation.z = t * 0.2;
      cyp.forEach((m, i) => { if (i) m.visible = st.ind; });
    }
    if (st.mode === 'alc') {
      if (st.play) st.ah += dt * 0.6; // 1 с = 0,6 ч
      const h = st.ah; const step = dt * 0.6 * (st.play ? 1 : 0);
      const abs = st.gut * (1 - Math.exp(-step * 2.2)); st.gut -= abs; // всасывание, г этанола
      const Vd = 70 * 0.68; // л (масса 70 кг)
      const adh = st.fome ? 0.15 : 1; const elim = Math.min(st.bac * Vd, (7.5 + (st.bac > 0.8 ? 1.5 : 0)) * adh * step); // ~7–9 г/ч
      st.bac = Math.max(0, st.bac + (abs - elim) / Vd); // г/л ≈ промилле
      st.ald = Math.max(0, st.ald + (elim * 0.4 - st.ald * (st.disulf ? 0.25 : 3.0) * step * 4) * 0.25);
      if (st.play && (st.hist.length === 0 || h - st.hist[st.hist.length - 1][0] > 0.1)) st.hist.push([h, st.bac, st.ald]);
      if (h > 14) resetAlc();
      const act = clamp(st.bac / 0.8, 0, 1) * adh;
      aArr.forEach((A, i) => { A.mat.uniforms.uTime.value = t; A.mat.uniforms.uOn.value = 0.1 + 0.55 * (i === 0 ? act : i === 1 ? (st.disulf ? 0.05 : act) : act * 0.8); });
      meos.mat.uniforms.uTime.value = t; meos.mat.uniforms.uOn.value = st.bac > 0.8 ? 0.6 : 0.05;
      am.forEach((m, i) => { m.rotation.y = t * 0.4 + i; });
      molGlow(am[1], clamp(st.ald * (st.disulf ? 1.5 : 0.6), 0, 0.6)); am[1].scale.setScalar(1 + clamp(st.ald, 0, 1) * 0.3);
      nadT.forEach((n, i) => { n.tok.spr.position.set(Math.cos(t * 3 * act + i) * 0.32, Math.sin(t * 3 * act + i) * 0.32, 0); n.tok.core.position.copy(n.tok.spr.position); });
      blk[0].visible = st.fome; blk[1].visible = st.disulf;
      const r = act; const vals = [0.25 + 0.75 * r, 0.2 + 0.7 * r, 0.25 + 0.6 * r, 0.9 - 0.65 * r];
      barM.forEach((m, i) => { const v = vals[i] * 1.5; m.scale.y += (v - m.scale.y) * Math.min(1, dt * 2); m.position.y = -2.3 + m.scale.y / 2; });
    }
    if (st.mode === 'para') {
      if (st.play) st.ph += dt * 0.8; const step = dt * 0.8 * (st.play ? 1 : 0); const h = st.ph;
      const absb = st.pgut * (1 - Math.exp(-step * 1.5)); st.pgut -= absb; st.pl = (st.pl || 0) + absb - (st.pl || 0) * step * 0.35;
      const conjCap = 1.2; const load = st.pl || 0; const conj = Math.min(load, conjCap) * 0.9; const cypFrac = (st.chron ? 0.14 : 0.07) + (load > conjCap ? 0.12 * (load - conjCap) / load : 0);
      const napqi = load * cypFrac * step * 0.24;
      const useG = Math.min(st.gsh, napqi * 0.9); st.gsh = clamp(st.gsh - useG + step * (st.nac ? 0.3 : 0.012) * (1 - st.gsh), 0, 1);
      const free = napqi - useG + (st.gsh < 0.3 ? napqi * (0.3 - st.gsh) * 3 : 0); st.dmg = clamp(st.dmg + free * 1.3, 0, 1); st.napqiRate = napqi / Math.max(step, 1e-6);
      if (st.play && (st.phist.length === 0 || h - st.phist[st.phist.length - 1][0] > 0.15)) st.phist.push([h, st.gsh, st.dmg, load]);
      if (h > 48) resetPara();
      const on = [conj > 0.01 ? 0.55 : 0.08, conj > 0.01 ? 0.4 : 0.06, clamp(cypFrac * 4 * Math.min(1, load), 0.06, 0.8), st.gsh > 0.3 ? clamp(load, 0.06, 0.6) : 0.08, st.gsh < 0.3 ? 0.7 : 0.03];
      pArr.forEach((A, i) => { A.A.mat.uniforms.uTime.value = t; A.A.mat.uniforms.uOn.value = on[i]; });
      gshFill.scale.y = Math.max(0.01, st.gsh * 1.7); gshFill.position.set(1.6, -1.55 - 0.9 + gshFill.scale.y / 2 + 0.02, 0); gshFill.material.emissiveIntensity = 0.1 + 0.25 * st.gsh;
      molGlow(pm.napqi, clamp(cypFrac * 2, 0, 0.5)); toxN.visible = st.gsh < 0.3 || st.dmg > 0.05; molGlow(toxN, 0.4);
      hep.material.color.set(new THREE.Color('#3a2018').lerp(new THREE.Color('#141010'), st.dmg)); toxP.material.emissiveIntensity = 0.02 + 0.3 * st.dmg;
      nacM.visible = st.nac; nacArr.mesh.visible = st.nac; if (nacArr.cone) nacArr.cone.visible = st.nac; nacArr.mat.uniforms.uTime.value = t;
      Object.values(pm).forEach((m, i) => { m.rotation.y = Math.sin(t * 0.5 + i) * 0.5; });
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, hh) {
    if (st.mode === 'alc') {
      scopeShow(true); const A = plotAxes(ctx, w, hh, { title: 'алкоголь в крови, ‰ · ацетальдегид', xl: '0–14 ч', yl: '' });
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; [0.5, 1, 2].forEach((v) => { ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(v / 2.5)); ctx.lineTo(A.X(1), A.Y(v / 2.5)); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText(v + '‰', A.X(0) + 2, A.Y(v / 2.5) - 2); });
      const H = st.hist; const line = (k, c, sc) => { if (H.length < 2) return; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); H.forEach((p, i) => { const x = A.X(p[0] / 14), y = A.Y(clamp(p[k] / sc, 0, 1)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      line(1, '#F2C14E', 2.5); line(2, '#FF6A6A', 1.2);
    } else if (st.mode === 'para') {
      scopeShow(true); const A = plotAxes(ctx, w, hh, { title: 'глутатион печени · повреждение', xl: '0–48 ч', yl: '' });
      const H = st.phist; const line = (k, c) => { if (H.length < 2) return; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); H.forEach((p, i) => { const x = A.X(p[0] / 48), y = A.Y(clamp(p[k], 0, 1)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      ctx.fillStyle = 'rgba(255,90,90,.1)'; ctx.fillRect(A.X(0), A.Y(0.3), A.X(1) - A.X(0), A.Y(0) - A.Y(0.3));
      line(1, '#7FD6FF'); line(2, '#FF5A5A');
      ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillStyle = '#7FD6FF'; ctx.fillText('GSH', A.X(0.02), A.Y(0.92)); ctx.fillStyle = '#FF5A5A'; ctx.fillText('некроз', A.X(0.85), A.Y(0.08)); ctx.fillStyle = 'rgba(255,120,120,.6)'; ctx.fillText('GSH < 30%', A.X(0.6), A.Y(0.24));
    } else scopeShow(false);
  }
  const TXT = {
    lob: '<b>Печёночная долька</b> — шестигранная призма ~1 мм: в центре — центральная вена, по углам — <b>портальные тракты</b> (ветвь воротной вены — фиолетовая, печёночной артерии — красная, желчный проток — зелёный). Кровь из кишечника и артерии течёт по синусоидам между тяжами <b>гепатоцитов</b> к центральной вене, а желчь — навстречу, по желчным канальцам к протокам. Все вещества из кишечника сначала проходят через печень. Около 60% клеток печени — гепатоциты, «прототип» всех клеток по набору ферментов.',
    detox: '<b>Фаза I — микросомальное окисление.</b> В мембранах ЭПР гепатоцитов работает короткая цепь переноса электронов: <b>НАДФН → флавопротеин (ФАД) → цитохром b5 → цитохром P450</b>. P450 — гемовый белок-монооксигеназа: один атом O₂ встраивает в субстрат (RH → R–OH), второй уходит в воду. Гидрофобное вещество (здесь бензол) получает гидроксильную группу (фенол). <b>Фаза II — конъюгация</b>: к OH-группе присоединяется глюкуроновая кислота (от УДФ-глюкуроната), сульфат (от ФАФС), глутатион, ацетил или метил — получается водорастворимый конъюгат, который уходит с мочой или желчью.',
    alc: '<b>Обмен этанола.</b> 90–98% алкоголя окисляется в печени: <b>алкогольдегидрогеназа</b> (цитозоль) → ацетальдегид → <b>альдегиддегидрогеназа</b> (митохондрии) → ацетат → ацетил-КоА. Обе реакции восстанавливают НАД⁺ в НАДН. При больших дозах подключается <b>МЭОС</b> — цитохром P450 2E1, который индуцируется у пьющих (отсюда «толерантность» и повышенная чувствительность печени к ядам). Печень окисляет лишь ~7–9 г этанола в час (≈ 0,1–0,15 ‰ в час), независимо от концентрации. Сдвиг <b>НАДН/НАД⁺</b> тормозит глюконеогенез (гипогликемия), повышает лактат и синтез жира (жировая печень).',
    para: '<b>Парацетамол</b> в обычной дозе на 90% конъюгируется с глюкуроновой кислотой и сульфатом. 5–10% окисляет цитохром P450 2E1 в реактивный <b>NAPQI</b> — его сразу обезвреживает <b>глутатион</b> (GSH). При передозировке (более 7–10 г у взрослого) конъюгация насыщается, больше уходит в NAPQI, запас глутатиона исчерпывается — NAPQI связывается с белками гепатоцитов (центролобулярный некроз, через 2–4 дня — печёночная недостаточность). Антидот — <b>N-ацетилцистеин</b>, источник цистеина для синтеза глутатиона: лучше всего в первые 8–10 часов.',
  };
  const LTXT = { norm: null, fat: '<b>Жировая инфильтрация</b> (стеатоз): триацилглицериды копятся каплями в гепатоцитах, когда их приток (липолиз при диабете, голодании, избыток углеводов) превышает вывоз в ЛПОНП. Вывозу нужны фосфолипиды — нехватка <b>липотропных факторов</b> (метионин, холин) и белка, алкоголь, яды нарушают синтез ЛПОНП.', cir: '<b>Цирроз</b> — финал хронического повреждения (алкоголь, вирусные гепатиты, стеатогепатит): гибнущие гепатоциты замещаются соединительной тканью, перегородки рассекают дольки на узлы, нарушают кровоток (портальная гипертензия, асцит) и все функции печени: падают альбумин и факторы свёртывания, растёт аммиак крови (энцефалопатия) и билирубин.' };
  const labels = [
    { text: 'центральная вена', get pos() { return G1.localToWorld(V3(0.4, 0.45, 0.6)); }, color: '#7F8AE0', show: () => st.labels && st.mode === 'lob' },
    { text: 'воротная вена', get pos() { return G1.localToWorld(tri[0].clone().add(V3(0.3, -0.35, 0.6))); }, color: '#B07AE0', show: () => st.labels && st.mode === 'lob' },
    { text: 'печёночная артерия', get pos() { return G1.localToWorld(tri[1].clone().add(V3(0.45, 0.3, 0.6))); }, color: '#FF6A6A', show: () => st.labels && st.mode === 'lob' },
    { text: 'желчный проток', get pos() { return G1.localToWorld(tri[2].clone().add(V3(-0.3, 0.4, 0.6))); }, color: '#5CC48A', show: () => st.labels && st.mode === 'lob' },
    { text: 'гепатоциты', get pos() { return G1.localToWorld(V3(1.5, -1.6, 0.5)); }, color: '#E09070', show: () => st.labels && st.mode === 'lob' },
    { text: 'зона 1 · перипортальная', get pos() { return G1.localToWorld(V3(-2.0, -1.55, 0.6)); }, color: '#E0805A', show: () => st.labels && st.mode === 'lob' && st.zones },
    { text: 'зона 3 · у центральной вены', get pos() { return G1.localToWorld(V3(-0.35, -0.8, 0.6)); }, color: '#C08AD0', show: () => st.labels && st.mode === 'lob' && st.zones },
    ...[['НАДФН', V3(-3.9, 1.9, 0.3), '#9FB4FF'], ['флавопротеин (ФАД)', V3(-2.9, -1.15, 0.6), '#F2C14E'], ['цит. b5', V3(-1.35, -1.15, 0.6), '#FF9A5C'], ['цитохром P450 · гем', V3(0.6, -1.2, 0.7), '#FF6A7A'], ['УДФ-глюкуронилтрансфераза', V3(3.3, -1.15, 0.7), '#7FE0A0'], ['мембрана ЭПР', V3(-4.6, -2.15, 0.5), '#C8A0E0'], ['бензол (гидрофобный)', V3(-3.4, 3.5, 0.3), '#EFEAE6'], ['в кровь → почки, в желчь', V3(5.6, 3.35, 0.3), '#7FE0A0']].map(([n, p, c]) => ({ text: n, pos: p.clone().add(V3(40, 0, 0)), color: c, show: () => st.labels && st.mode === 'detox' })),
    { text: 'O₂', get pos() { return G2.localToWorld(o2.position.clone().add(V3(0.35, 0.1, 0))); }, color: '#F04848', show: () => st.labels && st.mode === 'detox' && o2.visible },
    { text: 'фенол + глюкуроновая кислота', get pos() { return G2.localToWorld(sub.phen.position.clone().add(V3(0, 0.7, 0))); }, color: '#7FE0A0', show: () => st.labels && st.mode === 'detox' && st.dc > 0.68 && st.dc < 0.95 },
    { text: 'индукция: больше P450', pos: V3(40 + 0.6, -2.35, -1.0), color: '#FF6A7A', show: () => st.labels && st.mode === 'detox' && st.ind },
    ...[['этанол', 0], ['ацетальдегид', 1], ['ацетат', 2], ['ацетил-КоА', 3]].map(([n, i]) => ({ text: n, pos: AX[i].clone().add(V3(80, i === 3 ? -1.35 : -0.85, 0.3)), color: i === 1 ? '#FF8A6A' : '#EFEAE6', show: () => st.labels && st.mode === 'alc' })),
    { text: 'алкогольдегидрогеназа', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, 0.42, 0.3)), color: '#F2C14E', show: () => st.labels && st.mode === 'alc' }, { text: 'альдегиддегидрогеназа', pos: AX[1].clone().lerp(AX[2], 0.5).add(V3(80, 0.42, 0.3)), color: '#F2C14E', show: () => st.labels && st.mode === 'alc' },
    { text: 'НАД⁺ → НАДН', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, 1.75, 0)), color: '#9FB4FF', show: () => st.labels && st.mode === 'alc' }, { text: 'НАД⁺ → НАДН', pos: AX[1].clone().lerp(AX[2], 0.5).add(V3(80, 1.75, 0)), color: '#9FB4FF', show: () => st.labels && st.mode === 'alc' },
    { text: 'МЭОС (P450 2E1)', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, -1.55, 0.3)), color: '#C77DFF', show: () => st.labels && st.mode === 'alc' },
    ...BARS.map(([n, c], i) => ({ text: n, pos: V3(80 - 2.4 + i * 1.6, -2.65, 0.4), color: c, show: () => st.labels && st.mode === 'alc' })),
    ...[['парацетамол', 'apap', -0.95, '#EFEAE6'], ['глюкуронид ~55%', 'glu', -0.9, '#7FE0A0'], ['сульфат ~35%', 'sul', -0.85, '#F2CC3A'], ['NAPQI', 'napqi', 0.95, '#FF6A6A'], ['конъюгат с глутатионом', 'safe', -0.95, '#7FD6FF'], ['NAPQI + белки клетки → некроз', 'tox', -0.95, '#FF5A5A']].map(([n, k, dy, c]) => ({ text: n, pos: PX[k].clone().add(V3(120, dy, 0.3)), color: c, show: () => st.labels && st.mode === 'para' })),
    { text: 'P450 2E1 · 5–10%', pos: PX.apap.clone().lerp(PX.napqi, 0.5).add(V3(120, 0.4, 0.3)), color: '#FF8A8A', show: () => st.labels && st.mode === 'para' },
    { text: 'запас глутатиона', pos: V3(120 + 2.6, -2.55, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'para' }, { text: 'ацетилцистеин', pos: V3(120 + 0.0, -2.3, 0.4), color: '#7FD6FF', show: () => st.labels && st.mode === 'para' && st.nac },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'lob' && LTXT[st.lob]) || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'lob', label: 'Долька печени' }, { id: 'detox', label: 'Обезвреживание' }, { id: 'alc', label: 'Алкоголь' }, { id: 'para', label: 'Парацетамол' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 560px' });
    const msg = (m) => { st.msg = m; refs.setInfo(); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'lob') box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' },
        seg([{ id: 'norm', label: 'Норма' }, { id: 'fat', label: 'Жировая инфильтрация' }, { id: 'cir', label: 'Цирроз' }], () => st.lob, (v) => { st.lob = v; st.msg = null; refs.setInfo(); }),
        toggle('Зоны дольки', () => st.zones, (v) => { st.zones = v; msg(v ? '<b>Зоны дольки</b> различаются по кислороду и ферментам. <b>Зона 1</b> (у портальных трактов) получает больше O₂ — здесь идут глюконеогенез, β-окисление, синтез мочевины. <b>Зона 3</b> (у центральной вены) бедна кислородом, богата цитохромом P450 и ферментами гликолиза и липогенеза — поэтому именно она первой страдает при отравлении парацетамолом и алкоголем.' : null); })));
      else if (st.mode === 'detox') box.append(h('div', { class: 'glabel' }, 'Активность P450'), h('div', { class: 'gctl' },
        toggle('Индукторы (фенобарбитал, алкоголь)', () => st.ind, (v) => { st.ind = v; if (v) st.inh = false; refs.rebuild(); msg(v ? '<b>Индукция.</b> Фенобарбитал, рифампицин, хроническое употребление алкоголя, курение усиливают синтез P450 — ЭПР разрастается. Лекарства разрушаются быстрее (нужна большая доза), а некоторые вещества быстрее превращаются в токсичные метаболиты.' : null); }),
        toggle('Ингибиторы (грейпфрутовый сок)', () => st.inh, (v) => { st.inh = v; if (v) st.ind = false; refs.rebuild(); msg(v ? '<b>Ингибирование.</b> Фуранокумарины грейпфрута, кетоконазол, кларитромицин блокируют P450 3A4 — лекарства, которые им разрушаются (статины, некоторые блокаторы кальциевых каналов), накапливаются до токсических концентраций.' : null); })));
      else if (st.mode === 'alc') box.append(h('div', { class: 'glabel' }, 'Выпито (порции по 14 г этанола) · 1 с = 36 мин'), h('div', { class: 'gctl' },
        range('lvD', 1, 12, 1, () => st.drinks, (v) => { st.drinks = v; resetAlc(); }, (v) => `${v} порц.`),
        button('Заново', () => resetAlc(), true),
        toggle('Дисульфирам', () => st.disulf, (v) => { st.disulf = v; resetAlc(); msg(v ? '<b>Дисульфирам</b> (тетурам) блокирует альдегиддегидрогеназу — ацетальдегид копится: покраснение, сердцебиение, тошнота, падение давления. Так же реагируют люди с неактивным вариантом ALDH2*2 (до 40% жителей Восточной Азии).' : null); }),
        toggle('Фомепизол', () => st.fome, (v) => { st.fome = v; resetAlc(); msg(v ? '<b>Фомепизол</b> блокирует алкогольдегидрогеназу. Применяют как антидот при отравлении <b>метанолом</b> и этиленгликолем: АДГ превращает их в ядовитые формальдегид/муравьиную кислоту и оксалат. Тот же эффект даёт сам этанол — он конкурирует за фермент.' : null); })));
      else box.append(h('div', { class: 'glabel' }, 'Доза парацетамола · 1 с = 48 мин'), h('div', { class: 'gctl' },
        range('lvP', 1, 20, 1, () => st.dose, (v) => { st.dose = v; resetPara(); }, (v) => `${v} г`),
        button('Заново', () => resetPara(), true),
        toggle('Ацетилцистеин', () => st.nac, (v) => { st.nac = v; msg(v ? '<b>N-ацетилцистеин</b> поставляет цистеин — лимитирующую аминокислоту для синтеза глутатиона (γ-Глу-Цис-Гли), и сам связывает NAPQI. Включите его до того, как глутатион упадёт ниже 30%, — повреждения печени не будет.' : null); }),
        toggle('Хронический алкоголизм', () => st.chron, (v) => { st.chron = v; resetPara(); msg(v ? '<b>Алкоголь и парацетамол</b> — опасное сочетание: P450 2E1 индуцирован (больше NAPQI), а глутатиона мало из-за плохого питания и окислительного стресса. Токсичной становится уже доза 4–6 г.' : null); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['lob', 'detox', 'alc', 'para'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'lob') return [['Масса печени', '~1,5', 'кг'], ['Кровоток', '~1,5', 'л/мин']];
    if (st.mode === 'detox') return [['Скорость обезвреживания', st.ind ? '↑ ×2' : st.inh ? '↓ ×4' : 'норма', '']];
    if (st.mode === 'alc') return [['Время', st.ah.toFixed(1), 'ч'], ['Алкоголь в крови', st.bac.toFixed(2), '‰'], ['Ацетальдегид', st.ald > 0.6 ? 'высокий' : st.ald > 0.2 ? 'есть' : 'мало', '']];
    return [['Время', st.ph.toFixed(0), 'ч'], ['Глутатион', Math.round(st.gsh * 100), '%'], ['Повреждение', Math.round(st.dmg * 100), '%']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E07A4A',
    kicker: 'Биохимия · печень', title: 'Печень: обезвреживание',
    lede: 'Главная химическая фабрика тела: всё, что всосалось в кишечнике, сначала проходит через неё — и лекарства, и алкоголь, и яды.',
    notes: `
      <div><h2>Функции печени</h2><ul><li><b>Регуляторно-гомеостатическая</b>: держит постоянный состав крови — глюкозу, белки, липопротеины.</li><li><b>Депонирующая</b>: гликоген, жирорастворимые витамины, B₁₂, железо.</li><li><b>Обезвреживающая</b>: окисление, восстановление, метилирование, ацетилирование, конъюгация, синтез мочевины.</li><li><b>Экскреторная</b>: желчь (холестерин, желчные кислоты, билирубин).</li><li><b>Метаболическая</b>: синтез 50% белков тела, всех альбуминов и большинства факторов свёртывания, кетоновых тел, креатина, холина, мочевой кислоты.</li></ul>
        <h3>Печёночные пробы</h3><p>АЛТ, АСТ (повреждение гепатоцитов), ГГТ и щелочная фосфатаза (холестаз), билирубин, альбумин и протромбиновое время (синтетическая функция), аммиак.</p></div>
      <div><h2>Модели</h2><ul><li>Гем цитохрома P450 показан по реальным координатам гема (1GZX); сами белки ЭПР — схематичные «капли».</li><li>Кинетика алкоголя: всасывание первого порядка, окисление нулевого порядка ~7,5 г/ч, объём распределения 0,68 л/кг для человека 70 кг.</li><li>Модель парацетамола — качественная: насыщение конъюгации, расход и восстановление глутатиона.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('lob'); st.fly = null;
  return self;
}
