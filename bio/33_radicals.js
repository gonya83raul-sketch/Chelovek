// @scene radicals makeRadicals | Свободные радикалы и антиоксиданты | Энергия
/* =========================================================
   БИОХИМИЯ · КИСЛОРОД: пути потребления O₂, активные формы кислорода,
   перекисное окисление липидов, антиоксидантная защита, респираторный взрыв фагоцита
   ========================================================= */
function makeRadicals() {
  rnd = mulberry(3301);
  const scene = bioStage({ rim: 0xff8a5c });
  const VIEW = { paths: [V3(0.4, -1.5, 0), V3(1.0, 0.3, 17)], ros: [V3(40.4, -1.55, 0), V3(41.0, 0.45, 18.5)], burst: [V3(80.3, -1.3, 0), V3(80.9, 0.6, 15.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.paths[1]);
  const controls = makeControls(camera, VIEW.paths[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2600, 0.09); scene.add(fx.obj);
  const C = { o2: '#7FD6FF', sup: '#FF6A5A', h2o2: '#F2C14E', oh: '#FF3A8A', h2o: '#7FE0A0', e: '#C77DFF', ocl: '#9FE870' };
  // радикал: пара атомов кислорода с ореолом (супероксид / гидроксил)
  function radical(kind) {
    const g = new THREE.Group(); const om = atomMat('O'), hm = atomMat('H');
    if (kind === 'oh') { const o = new THREE.Mesh(SPH, om); o.scale.setScalar(0.17); g.add(o); const hh = new THREE.Mesh(SPH, hm); hh.scale.setScalar(0.11); hh.position.set(0.17, 0.1, 0); g.add(hh); }
    else [-1, 1].forEach((s) => { const o = new THREE.Mesh(SPH, om); o.scale.setScalar(0.17); o.position.x = s * 0.12; g.add(o); });
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: kind === 'oh' ? C.oh : C.sup, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.75 })); spr.scale.setScalar(0.9); g.add(spr); g.userData.spr = spr;
    return g;
  }
  const mol = (id, s = 0.09) => molMesh(MOL(id), { scale: s, hideH: false });

  /* ---------- 1. пути потребления кислорода ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.5, 0, 0); scene.add(G1);
  const O2C = V3(0, 0.55, 0);
  const o2big = mol('o2', 0.55); o2big.position.copy(O2C); G1.add(o2big);
  glowNucleus(G1, O2C, C.o2, 0.12, 10).core.visible = false;
  const PATHS = [
    { id: 'ox', name: 'оксидазный', share: 0.9, pos: V3(-2.9, 2.2, 0), col: '#7FE0A0', prod: 'h2o', text: '<b>Оксидазный путь (~90% O₂).</b> Цитохромоксидаза — последний комплекс дыхательной цепи — передаёт кислороду сразу <b>4 электрона</b> и 4 протона: O₂ + 4e⁻ + 4H⁺ → 2H₂O. Четыре электрона за раз — поэтому промежуточные радикалы не вылетают. Энергия идёт на синтез АТФ.' },
    { id: 'mono', name: 'монооксигеназный', share: 0.05, pos: V3(3.0, 2.2, 0), col: '#7FD6FF', prod: 'phenol', text: '<b>Оксигеназный путь.</b> <b>Монооксигеназы</b> (цитохром P450 печени и надпочечников) встраивают один атом кислорода в вещество, второй уходит в воду: RH + O₂ + НАДФН → ROH + H₂O. Так обезвреживаются лекарства и яды, синтезируются стероидные гормоны, желчные кислоты, активный витамин D. <b>Диоксигеназы</b> встраивают оба атома (например, при распаде триптофана, в синтезе простагландинов).' },
    { id: 'perox', name: 'оксидазы → H₂O₂', share: 0.03, pos: V3(-2.9, -1.0, 0), col: '#F2C14E', prod: 'h2o2', text: '<b>Оксидазы с образованием пероксида.</b> Флавиновые оксидазы (оксидаза аминокислот, ксантиноксидаза, моноаминоксидаза) передают O₂ <b>2 электрона</b>: получается <b>H₂O₂</b>. В пероксисомах его тут же разлагает каталаза, а часть используется полезно — например, щитовидная железа йодирует тиреоглобулин с помощью H₂O₂ и тиреопероксидазы.' },
    { id: 'rad', name: 'радикалы', share: 0.02, pos: V3(3.0, -1.0, 0), col: '#FF6A5A', prod: null, text: '<b>Свободнорадикальный путь (1–3% O₂).</b> Если кислород получает <b>один</b> электрон (утечка из комплексов I и III дыхательной цепи, НАДФН-оксидаза), образуется <b>супероксид-анион O₂•⁻</b> — частица с неспаренным электроном. Из него рождаются H₂O₂ и самый агрессивный <b>гидроксильный радикал •OH</b>. Это и называют активными формами кислорода (АФК).' },
  ];
  const PP = PATHS.map((p, i) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.06, 48), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(p.col).multiplyScalar(0.12), roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false })); plate.rotation.x = Math.PI / 2; plate.position.copy(p.pos).add(V3(0, 0, -0.4)); G1.add(plate);
    let prod; if (p.prod) { prod = mol(p.prod, p.prod === 'phenol' ? 0.2 : 0.45); } else { prod = radical('sup'); prod.scale.setScalar(1.4); }
    prod.position.copy(p.pos); G1.add(prod);
    const a = flowArrow(G1, O2C.clone().add(p.pos.clone().sub(O2C).normalize().multiplyScalar(0.7)), p.pos.clone().add(O2C.clone().sub(p.pos).normalize().multiplyScalar(1.1)), p.col, { bend: i % 2 ? 0.15 : -0.15, r: 0.02 + 0.06 * Math.sqrt(p.share) });
    // столбик доли
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.22), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.col).multiplyScalar(0.32), transparent: true, opacity: 0.9 })); const h = 0.08 + 1.5 * Math.sqrt(p.share);
    bar.scale.y = h; bar.position.copy(p.pos).add(V3(1.25, -0.75 + h / 2, 0)); G1.add(bar);
    return { ...p, prod, a, plate };
  });
  // субстрат монооксигеназы: бензол → фенол рядом
  const benz = mol('benzene', 0.13); benz.position.copy(PATHS[1].pos).add(V3(-1.25, 0.5, 0.2)); G1.add(benz);

  /* ---------- 2. АФК и защита ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const N = { o2: V3(-2.6, 2.3, 0), sup: V3(-0.9, 2.3, 0), h2o2: V3(0.9, 2.3, 0), h2o: V3(3.2, 3.0, 0), oh: V3(1.0, 0.7, 0.2) };
  const nO2 = mol('o2', 0.4); nO2.position.copy(N.o2); G2.add(nO2);
  const nSup = radical('sup'); nSup.position.copy(N.sup); nSup.scale.setScalar(1.3); G2.add(nSup);
  const nH2O2 = mol('h2o2', 0.32); nH2O2.position.copy(N.h2o2); G2.add(nH2O2);
  const nH2O = mol('h2o', 0.32); nH2O.position.copy(N.h2o); G2.add(nH2O);
  const nOH = radical('oh'); nOH.position.copy(N.oh); nOH.scale.setScalar(1.3); G2.add(nOH);
  const FE = V3(-0.1, 1.25, 0.2); const fe = glowNucleus(G2, FE, '#E0773A', 0.09, 7);
  // ферменты-защитники
  const ENZ = {
    sod: { name: 'СОД', pos: V3(0.0, 3.05, -0.2), col: '#7FD6FF', metal: '#D9905A' },
    cat: { name: 'каталаза', pos: V3(2.1, 3.55, -0.2), col: '#FF8AB0', metal: '#E0773A' },
    gpx: { name: 'глутатионпероксидаза', pos: V3(2.4, 1.6, -0.2), col: '#7FE0A0', metal: '#E0A040' },
  };
  Object.values(ENZ).forEach((E, i) => { E.m = new THREE.Mesh(blobGeo(0.45, 0.38, 0.4, 7 + i, 0.14, 4), protMat(E.col, 0.35)); E.m.geometry.computeVertexNormals(); E.m.position.copy(E.pos); G2.add(E.m); E.g = glowNucleus(G2, E.pos.clone().add(V3(0.1, 0.1, 0.38)), E.metal, 0.06, 6); });
  const gsh = mol('gsh', 0.07); gsh.position.set(3.6, 1.15, 0.3); G2.add(gsh);
  const gssg = mol('gssg', 0.06); gssg.position.set(4.3, 1.95, 0.2); G2.add(gssg);
  const A2 = {
    e1: flowArrow(G2, N.o2.clone().add(V3(0.6, 0, 0)), N.sup.clone().add(V3(-0.5, 0, 0)), C.sup, { bend: 0.2 }),
    sod: flowArrow(G2, N.sup.clone().add(V3(0.5, 0, 0)), N.h2o2.clone().add(V3(-0.5, 0, 0)), C.h2o2, { bend: 0.25 }),
    cat: flowArrow(G2, N.h2o2.clone().add(V3(0.45, 0.2, 0)), N.h2o.clone().add(V3(-0.45, -0.1, 0)), C.h2o, { bend: 0.15 }),
    gpx: flowArrow(G2, N.h2o2.clone().add(V3(0.4, -0.25, 0)), N.h2o.clone().add(V3(-0.2, -0.45, 0)), C.h2o, { bend: -0.5 }),
    fen: flowArrow(G2, N.h2o2.clone().add(V3(-0.1, -0.4, 0)), N.oh.clone().add(V3(0, 0.4, 0)), C.oh, { bend: -0.3 }),
  };
  // мембрана с липидами
  const MEMY = -0.75;
  const mem = schemBilayer({ w: 9.0, d: 2.4, thick: 0.75, step: 0.2, seed: 33 }); mem.position.set(0, MEMY, 0); G2.add(mem);
  rnd = mulberry(3302);
  const HEADS = []; for (let x = -4.4; x <= 4.4; x += 0.2) for (let z = -1.2; z <= 1.2; z += 0.2) HEADS.push({ p: V3(x, MEMY + 0.38, z), d: 0, t: 0 });
  const dmgI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3a5a, transparent: true, opacity: 0.85 }), HEADS.length); dmgI.count = 0; G2.add(dmgI);
  const vitE = []; for (let i = 0; i < 9; i++) { const m = mol('tocopherol', 0.045); m.rotation.z = Math.PI / 2; m.position.set(-3.9 + i * 0.97 + rand(-0.2, 0.2), MEMY + 0.05, rand(-0.8, 0.8)); G2.add(m); vitE.push(m); }
  const vitC = []; for (let i = 0; i < 5; i++) { const m = mol('ascorbic', 0.07); m.position.set(-3.4 + i * 1.7, MEMY - 0.85, 0.6); G2.add(m); vitC.push(m); }
  const mdaM = []; for (let i = 0; i < 6; i++) { const m = mol('mda', 0.09); m.visible = false; G2.add(m); mdaM.push({ m, age: 9, v: V3(0, 0, 0) }); }

  /* ---------- 3. респираторный взрыв ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const cellG = blobGeo(3.1, 2.3, 1.6, 21, 0.06, 5); cellG.computeVertexNormals();
  G3.add(new THREE.Mesh(cellG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe0d0ff).multiplyScalar(0.18), roughness: 0.4, transparent: true, opacity: 0.18, depthWrite: false })), new THREE.Mesh(cellG, glassMat(0xd8c8ff, { rim: 0.45, base: 0.01, pow: 2 })));
  // сегментированное ядро нейтрофила
  [V3(-1.6, 0.6, -0.3), V3(-1.9, -0.3, -0.2), V3(-1.2, -0.9, -0.3), V3(-0.8, 1.1, -0.4)].forEach((p, i) => { const m = new THREE.Mesh(blobGeo(0.45, 0.35, 0.35, 30 + i, 0.1, 3), protMat('#9F7BFF', 0.35)); m.geometry.computeVertexNormals(); m.position.copy(p); G3.add(m); });
  const PH = V3(0.8, 0.1, 0.2), PHR = 1.05;
  const phago = new THREE.Mesh(new THREE.SphereGeometry(PHR, 40, 30), new THREE.MeshPhysicalMaterial({ color: 0x2a1a20, roughness: 0.3, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide })); phago.position.copy(PH); G3.add(phago);
  const phagoRim = new THREE.Mesh(new THREE.SphereGeometry(PHR, 40, 30), glassMat(0xffb0a0, { rim: 0.6, base: 0.02, pow: 2 })); phagoRim.position.copy(PH); G3.add(phagoRim);
  const NOX = []; for (let i = 0; i < 14; i++) { const d = randUnit(); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8), protMat('#FF9A5C', 0.6)); m.position.copy(PH).addScaledVector(d, PHR); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d); G3.add(m); NOX.push({ m, d }); }
  const mpo = []; for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), protMat('#9FE870', 0.6)); m.position.copy(PH).addScaledVector(randUnit(), 1.5 + rnd() * 0.6); G3.add(m); mpo.push(m); }
  const bacG = new THREE.CapsuleGeometry(0.16, 0.42, 6, 12), bacMat = new THREE.MeshPhysicalMaterial({ color: 0x8ad04a, emissive: 0x2a4a08, emissiveIntensity: 0.35, roughness: 0.4, transparent: true });
  const BACS = [0, 1, 2].map((i) => { const m = new THREE.Mesh(bacG, bacMat.clone()); G3.add(m); return { m, home: V3(4.6 + i * 0.25, 1.2 - i * 0.9, 0.3), inside: PH.clone().add(V3(-0.25 + i * 0.25, 0.2 - i * 0.2, 0.1)), hp: 1 }; });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'paths', labels: true, rot: false, fly: null, msg: null, sel: null,
    stress: 0.25, sod: true, cat: true, ve: true, vc: true, S: 0, P: 0, OH: 0, D: 0, hist: [],
    eatT: -99, cgd: false, kill: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'paths'; G2.visible = m === 'ros'; G3.visible = m === 'burst'; st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function eat() { if (st.mode !== 'burst') setMode('burst'); st.eatT = st.t; BACS.forEach((b) => { b.hp = 1; b.m.material.opacity = 1; }); st.kill = 0; st.msg = st.cgd ? TXT.cgd : TXT.eat; refs.setInfo(); }
  pickOn(() => self, camera, PP.map((p) => p.plate), (id) => { const p = PP.find((q) => q.plate.uuid === id); if (p) { st.sel = p.id; refs.setInfo(); } });
  PP.forEach((p) => { p.plate.userData.pick = p.plate.uuid; });
  const cc = new THREE.Color(), m4 = new THREE.Matrix4();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'paths') {
      o2big.rotation.y += dt * 0.6;
      PP.forEach((p, i) => { p.a.mat.uniforms.uTime.value = t; p.a.mat.uniforms.uOn.value = 0.25 + 0.75 * Math.sqrt(p.share) + (st.sel === p.id ? 0.5 : 0); p.prod.rotation.y += dt * (0.4 + i * 0.1); if (rnd() < p.share * 1.4 + 0.02) fx.spawn(p.a.curve.getPoint(rnd() * 0.3).add(G1.position), V3(0, 0, 0), cc.set(p.col), 0.6, 0, 1.2); });
      if (PP[3].prod.userData.spr) PP[3].prod.userData.spr.scale.setScalar(0.8 + 0.25 * Math.sin(t * 7));
    }
    if (st.mode === 'ros') {
      // кинетика (качественная): супероксид → H₂O₂ → вода / •OH → повреждение липидов
      const gen = 0.25 + 2.2 * st.stress, kSod = st.sod ? 3.0 : 0.25, kCat = st.cat ? 2.2 : 0.12;
      st.S += (gen - kSod * st.S) * dt; st.P += (kSod * st.S * 0.5 - kCat * st.P - 0.35 * st.P) * dt;
      st.OH = 0.35 * st.P * 1.4; const prop = st.ve ? (st.vc ? 0.06 : 0.25) : 1.0;
      st.D = clamp(st.D + (st.OH * 0.05 * (1 + 6 * prop) - (st.ve ? 0.03 : 0.006)) * dt, 0, 1);
      st.hist.push([t, st.D, clamp(st.P / 2, 0, 1)]); while (st.hist.length && st.hist[0][0] < t - 30) st.hist.shift();
      Object.entries(A2).forEach(([k, a]) => { a.mat.uniforms.uTime.value = t; });
      A2.e1.mat.uniforms.uOn.value = clamp(gen / 2, 0.15, 1.2); A2.sod.mat.uniforms.uOn.value = st.sod ? clamp(st.S * 1.2, 0.1, 1.2) : 0.04;
      A2.cat.mat.uniforms.uOn.value = st.cat ? clamp(st.P, 0.1, 1.2) : 0.03; A2.gpx.mat.uniforms.uOn.value = st.cat ? clamp(st.P * 0.8, 0.08, 1) : 0.03; A2.fen.mat.uniforms.uOn.value = clamp(st.OH, 0.05, 1.3);
      ENZ.sod.m.visible = ENZ.sod.g.core.visible = ENZ.sod.g.spr.visible = st.sod; [ENZ.cat, ENZ.gpx].forEach((E) => { E.m.visible = E.g.core.visible = E.g.spr.visible = st.cat; }); gsh.visible = gssg.visible = st.cat;
      vitE.forEach((m) => { m.visible = st.ve; }); vitC.forEach((m, i) => { m.visible = st.vc; m.rotation.y += dt * 0.5; m.position.y = MEMY - 0.85 + 0.06 * Math.sin(t * 1.3 + i); });
      nSup.userData.spr.scale.setScalar(0.6 + 0.8 * clamp(st.S, 0, 1.5)); nOH.userData.spr.scale.setScalar(0.4 + 1.2 * clamp(st.OH, 0, 1.5)); fe.spr.scale.setScalar(0.5 + 0.4 * Math.sin(t * 5) ** 2);
      [nO2, nH2O2, nH2O].forEach((m, i) => { m.rotation.y += dt * (0.5 + i * 0.2); });
      // частицы
      if (rnd() < gen * 0.5) fx.spawn(A2.e1.curve.getPoint(rnd()).add(G2.position), V3(0, 0, 0), cc.set(C.sup), 0.6, 0, 1.3);
      if (rnd() < st.OH * 0.9) { const h = HEADS[Math.floor(rnd() * HEADS.length)]; const p0 = N.oh.clone().add(G2.position); fx.spawn(p0, h.p.clone().add(G2.position).sub(p0).multiplyScalar(1.6), cc.set(C.oh), 0.6, 0, 1.4); if (h.d < 1 && rnd() < 0.5) { h.d = 1; h.t = t; } }
      // цепная реакция перекисного окисления: повреждение передаётся соседям
      const pChain = (st.ve ? (st.vc ? 0.02 : 0.08) : 0.55) * dt;
      let n = 0; HEADS.forEach((h, i) => {
        if (h.d > 0) {
          if (rnd() < pChain) { const j = clamp(i + [1, -1, 13, -13][Math.floor(rnd() * 4)], 0, HEADS.length - 1); if (HEADS[j].d === 0) { HEADS[j].d = 1; HEADS[j].t = t; } }
          if (rnd() < (st.ve ? 0.12 : 0.008) * dt) h.d = 0;   // восстановление (витамин E обрывает цепь, ферменты репарации)
          if (rnd() < 0.002) { const q = mdaM.find((x) => x.age > 3); if (q) { q.age = 0; q.m.visible = true; q.m.position.copy(h.p).add(V3(0, 0.2, 0)); q.v.set(rand(-0.2, 0.2), 0.5, rand(-0.1, 0.3)); } }
          const s = 0.7 + 0.3 * Math.sin(t * 6 + i); m4.makeScale(s, s, s).setPosition(h.p); dmgI.setMatrixAt(n++, m4);
        }
      });
      dmgI.count = n; dmgI.instanceMatrix.needsUpdate = true; st.dmgShare = n / HEADS.length;
      mdaM.forEach((q) => { if (q.age < 3) { q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
    }
    if (st.mode === 'burst') {
      const k = t - st.eatT;
      BACS.forEach((b, i) => {
        const u = smooth(0.3 + i * 0.3, 2.2 + i * 0.3, k);
        b.m.position.copy(b.home).lerp(b.inside, u); b.m.rotation.z = 0.8 * i + t * 0.3 * (1 - u) + Math.sin(t * 2 + i) * 0.1;
        if (k > 2.6 && !st.cgd) b.hp = Math.max(0, b.hp - dt * 0.25);
        b.m.material.opacity = 0.15 + 0.85 * b.hp; b.m.material.emissiveIntensity = 0.35 * b.hp; b.m.scale.setScalar(0.6 + 0.4 * b.hp);
      });
      st.kill = 1 - BACS.reduce((a, b) => a + b.hp, 0) / 3;
      const burst = k > 2.4 && k < 14 && !st.cgd;
      NOX.forEach((x, i) => { x.m.material.emissiveIntensity = burst ? 0.6 + 0.4 * Math.sin(t * 8 + i) : 0.05; if (burst && rnd() < 0.25) fx.spawn(x.m.position.clone().add(G3.position), x.d.clone().multiplyScalar(-0.6), cc.set(C.sup), 0.8, 1.5, 1.3); });
      if (burst && rnd() < 0.35) fx.spawn(PH.clone().add(randUnit().multiplyScalar(0.5)).add(G3.position), randUnit().multiplyScalar(0.15), cc.set(rnd() < 0.5 ? C.h2o2 : C.ocl), 1.0, 0.8, 1.3);
      mpo.forEach((m, i) => { const r = PH.clone().addScaledVector(m.position.clone().sub(PH).normalize(), burst ? 1.15 : 1.6 + 0.3 * Math.sin(i)); m.position.lerp(r, dt * 0.8); });
      phagoRim.material.uniforms.uRim.value = (burst ? 1.0 : 0.6) * LOOK.shell;
      if (k > 0 && k < 2.6 && rnd() < 0.3) fx.spawn(V3(80 + 3.0, rand(-1, 1.5), 0.3), V3(-0.8, 0, 0), cc.set('#8ad04a'), 0.6, 0.5, 1);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'paths') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'куда уходит кислород клетки', x0: 10 });
      PP.forEach((p, i) => { const y = 24 + i * ((h - 34) / 4), L = (w - 150) * Math.sqrt(p.share); ctx.fillStyle = p.col; ctx.globalAlpha = 0.85; ctx.fillRect(110, y, Math.max(3, L), 10); ctx.globalAlpha = 1; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(p.name, 12, y + 9); ctx.fillText(Math.round(p.share * 100) + '%', 116 + Math.max(3, L), y + 9); });
      return;
    }
    if (st.mode !== 'ros') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'повреждение мембраны · H₂O₂ · 30 с', xl: 'время →' });
    const t0 = st.t - 30;
    [[1, '#FF3A5A'], [2, '#F2C14E']].forEach(([k, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = A.X((r[0] - t0) / 30), y = A.Y(r[k]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); });
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#FF3A5A'; ctx.fillText('повреждение', A.X(0.02), A.Y(0.92)); ctx.fillStyle = '#F2C14E'; ctx.fillText('H₂O₂', A.X(0.3), A.Y(0.92));
  }
  const TXT = {
    paths: '<b>Кислород — главный окислитель клетки.</b> Почти весь O₂ превращается в воду в митохондриях, но небольшая часть идёт другими путями: встраивается в молекулы (оксигеназы), превращается в пероксид водорода (оксидазы) или — по одному электрону — в <b>свободные радикалы</b>. Толщина стрелок и столбики показывают доли. Нажмите на путь.',
    ros: '<b>Активные формы кислорода и защита от них.</b> Супероксид O₂•⁻ (красный) превращает в H₂O₂ фермент <b>супероксиддисмутаза</b> (СОД, медь/цинк или марганец). H₂O₂ разлагают <b>каталаза</b> (железо гема) и <b>глутатионпероксидаза</b> (селен; восстановленный глутатион GSH → GSSG). Если H₂O₂ встречает Fe²⁺, образуется <b>•OH</b> (реакция Фентона) — он атакует липиды мембраны, запуская <b>цепное перекисное окисление</b>; продукт распада — <b>малоновый диальдегид</b>. <b>Витамин E</b> в мембране обрывает цепь, <b>витамин C</b> восстанавливает витамин E. Выключайте защиту и добавляйте стресс.',
    burst: '<b>Радикалы как оружие.</b> Нейтрофилы и макрофаги убивают захваченных микробов «кислородным взрывом»: <b>НАДФН-оксидаза</b> мембраны фагосомы (оранжевая) производит супероксид, из него получается H₂O₂, а <b>миелопероксидаза</b> (зелёные гранулы) делает из H₂O₂ и хлорида <b>хлорноватистую кислоту HOCl</b> — то же вещество, что в отбеливателе. Нажмите «Захватить бактерию».',
    eat: '<b>Фагоцитоз и респираторный взрыв.</b> Бактерии окружены мембраной и оказываются в фагосоме. Потребление кислорода клеткой возрастает в 50–100 раз — но не для дыхания, а для производства АФК. Супероксид, H₂O₂ и HOCl разрушают мембраны и белки бактерий.',
    cgd: '<b>Хроническая гранулематозная болезнь</b> — наследственный дефект НАДФН-оксидазы. Фагоциты захватывают бактерии, но убить не могут: взрыва нет, микробы живут внутри клеток. Больные с детства страдают тяжёлыми повторными инфекциями.',
  };
  const labels = [
    ...PATHS.map((p) => ({ text: p.name, pos: p.pos.clone().add(V3(-0.75, 1.15, 0)).add(V3(0.5, 0, 0)), color: p.col, show: () => st.labels && st.mode === 'paths' })),
    { text: 'O₂', pos: V3(1.15, 0.85, 0.3), color: C.o2, show: () => st.labels && st.mode === 'paths' },
    { text: 'H₂O', pos: V3(-1.9, 1.75, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'paths' },
    { text: 'RH → ROH', pos: V3(4.0, 2.0, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'paths' },
    { text: 'H₂O₂', pos: V3(-1.9, -1.2, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'paths' },
    { text: 'O₂•⁻', pos: V3(4.0, -1.2, 0.3), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'O₂', pos: N.o2.clone().add(V3(40 - 0.2, 0.5, 0)), color: C.o2, show: () => st.labels && st.mode === 'ros' },
    { text: 'супероксид O₂•⁻', pos: N.sup.clone().add(V3(40 - 0.6, 0.55, 0)), color: C.sup, show: () => st.labels && st.mode === 'ros' },
    { text: 'H₂O₂', pos: N.h2o2.clone().add(V3(40 - 0.2, 0.55, 0)), color: C.h2o2, show: () => st.labels && st.mode === 'ros' },
    { text: 'H₂O', pos: N.h2o.clone().add(V3(40 + 0.3, 0.45, 0)), color: C.h2o, show: () => st.labels && st.mode === 'ros' },
    { text: '•OH', pos: N.oh.clone().add(V3(40 + 0.35, -0.1, 0.1)), color: C.oh, show: () => st.labels && st.mode === 'ros' },
    { text: 'Fe²⁺ (Фентон)', pos: FE.clone().add(V3(40 - 1.6, 0, 0)), color: '#E0773A', show: () => st.labels && st.mode === 'ros' },
    { text: 'СОД', pos: V3(40 + 0.0, 3.6, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'ros' && st.sod },
    { text: 'каталаза', pos: V3(40 + 2.6, 4.0, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: 'глутатионпероксидаза', pos: V3(40 + 2.9, 1.55, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: '2GSH → GSSG', pos: V3(40 + 3.7, 0.7, 0.3), color: '#C8E8A0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: 'мембрана: перекисное окисление', pos: V3(40 + 1.2, MEMY + 0.7, 1.2), color: '#FF6A7A', show: () => st.labels && st.mode === 'ros' },
    { text: 'витамин E', pos: V3(40 - 3.8, MEMY + 0.15, 1.2), color: '#E8C060', show: () => st.labels && st.mode === 'ros' && st.ve },
    { text: 'витамин C', pos: V3(40 - 3.0, MEMY - 0.85, 0.8), color: '#F2E08A', show: () => st.labels && st.mode === 'ros' && st.vc },
    { text: 'фагосома', pos: V3(80 + 1.9, 0.9, 0.4), color: '#FFB0A0', show: () => st.labels && st.mode === 'burst' },
    { text: 'НАДФН-оксидаза', pos: V3(80 + 1.4, -1.05, 0.6), color: '#FF9A5C', show: () => st.labels && st.mode === 'burst' },
    { text: 'миелопероксидаза', pos: V3(80 - 0.3, 1.8, 0.5), color: '#9FE870', show: () => st.labels && st.mode === 'burst' },
    { text: 'ядро нейтрофила', pos: V3(80 - 2.2, 1.3, 0.2), color: '#9F7BFF', show: () => st.labels && st.mode === 'burst' },
    { text: 'бактерии', pos: V3(80 + 4.4, 1.7, 0.4), color: '#8AD04A', show: () => st.labels && st.mode === 'burst' && st.t - st.eatT > 3 },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = PP.find((q) => q.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'paths' && p ? p.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'paths', label: 'Пути кислорода' }, { id: 'ros', label: 'АФК и защита' }, { id: 'burst', label: 'Кислородный взрыв' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 380px' });
    const MSG = { sod: '<b>Без супероксиддисмутазы</b> супероксид накапливается. Мыши без митохондриальной СОД (MnSOD) погибают вскоре после рождения; мутации Cu/Zn-СОД — одна из наследственных причин бокового амиотрофического склероза.', cat: '<b>Без каталазы и глутатионпероксидазы</b> H₂O₂ копится и с железом превращается в •OH. Глутатионпероксидазе нужен <b>селен</b>, а восстанавливать глутатион помогает НАДФН из пентозофосфатного пути — поэтому при дефиците глюкозо-6-фосфатдегидрогеназы эритроциты разрушаются от окислительного стресса (например, после бобов или некоторых лекарств).', ve: '<b>Без витамина E</b> некому обрывать цепь: один радикал липида отнимает водород у соседа, тот — у следующего, и повреждение расползается по мембране.', vc: '<b>Без витамина C</b> окисленный витамин E (токофероксильный радикал) не восстанавливается — защита мембраны быстро истощается.' };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'ros') {
        box.append(h('div', { class: 'glabel' }, 'Защита'), h('div', { class: 'gctl' }, ...[['sod', 'СОД'], ['cat', 'Каталаза и ГПО'], ['ve', 'Витамин E'], ['vc', 'Витамин C']].map(([k, n]) => toggle(n, () => st[k], (v) => { st[k] = v; st.msg = v ? null : MSG[k]; refs.setInfo(); }))),
          h('div', { class: 'glabel', style: 'margin-top:6px' }, 'Окислительный стресс'), h('div', { class: 'gctl' }, range('roxS', 0, 1, 0.01, () => st.stress, (v) => { st.stress = v; }, (v) => (v < 0.3 ? 'покой' : v < 0.65 ? 'нагрузка, курение' : 'облучение, воспаление')), button('Сброс', () => { st.D = 0; HEADS.forEach((h) => { h.d = 0; }); st.hist = []; })));
      } else if (st.mode === 'burst') {
        box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, button('Захватить бактерию', eat, true), toggle('Дефект НАДФН-оксидазы', () => st.cgd, (v) => { st.cgd = v; eat(); })));
      } else box.append(h('div', { class: 'glabel' }, 'Пути'), h('div', { class: 'gctl' }, seg(PATHS.map((p) => ({ id: p.id, label: p.name, color: p.col })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['paths', 'ros', 'burst'][n - 1]); return true; }
    if (k === 'e' || k === 'у') { eat(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'ros') return [['Повреждено липидов', Math.round((st.dmgShare || 0) * 100), '%'], ['H₂O₂', st.P.toFixed(2), 'усл.'], ['•OH', st.OH > 0.6 ? 'много' : st.OH > 0.2 ? 'есть' : 'мало', '']];
    if (st.mode === 'burst') return [['Бактерий убито', Math.round(st.kill * 100), '%'], ['НАДФН-оксидаза', st.cgd ? 'нет' : 'есть', '']];
    return [['В воду', '≈90', '%'], ['В радикалы', '1–3', '%']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8A5C',
    kicker: 'Биохимия · биологическое окисление', title: 'Свободные радикалы и антиоксиданты',
    lede: 'Кислород даёт клетке энергию, но один неспаренный электрон превращает его в радикал, способный разрушать мембраны, белки и ДНК. Против этого у клетки целая система защиты.',
    notes: `
      <div><h2>Активные формы кислорода</h2>
        <p>Супероксид O₂•⁻, пероксид водорода H₂O₂, гидроксильный радикал •OH, синглетный кислород, а также оксид азота NO• и пероксинитрит. •OH живёт наносекунды и реагирует с первой встречной молекулой — поэтому от него нет специального фермента, только предотвращение его образования.</p>
        <h3>Что повреждают</h3><p><b>Липиды</b> — цепное перекисное окисление ненасыщенных жирных кислот (мембраны теряют целостность, малоновый диальдегид сшивает белки). <b>Белки</b> — окисление SH-групп и остатков аминокислот. <b>ДНК</b> — окисление оснований (8-оксогуанин), разрывы.</p>
        <h3>Защита</h3><ul><li><b>Ферменты:</b> СОД (Cu, Zn, Mn), каталаза (Fe), глутатионпероксидаза (Se), глутатионредуктаза (НАДФН).</li><li><b>Неферментные антиоксиданты:</b> витамины E и C, каротиноиды, глутатион, мочевая кислота, билирубин, церулоплазмин и трансферрин (связывают ионы металлов).</li></ul>
        <h3>Польза</h3><p>АФК — оружие фагоцитов, сигнальные молекулы (H₂O₂ регулирует фосфатазы), участники синтеза гормонов щитовидной железы. Вред возникает при дисбалансе — <b>окислительном стрессе</b>: воспаление, ишемия и реперфузия, облучение, курение, диабет, старение.</p></div>
      <div><h2>Условности</h2><ul><li>Кинетика качественная; скорости и концентрации условны.</li><li>Ферменты показаны каплями; молекулы — по химическим формулам.</li><li>Супероксид и гидроксил нарисованы атомами с ореолом.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>E</code> захватить бактерию</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('paths'); st.fly = null;
  return self;
}
