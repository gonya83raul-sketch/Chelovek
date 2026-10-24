// @scene carbdig makeCarbdig | Переваривание сахаров, лактоза, фруктоза | Углеводы
/* =========================================================
   БИОХИМИЯ · ПЕРЕВАРИВАНИЕ УГЛЕВОДОВ: амилаза, ферменты щёточной каймы, транспортёры SGLT1/GLUT5/GLUT2,
   лактазная недостаточность; обмен галактозы и фруктозы в печени, галактоземия, непереносимость фруктозы
   ========================================================= */
function makeCarbdig() {
  rnd = mulberry(4201);
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { dig: [V3(0.6, -1.95, 0), V3(1.2, 0.2, 19.5)], met: [V3(41.0, -1.5, 0), V3(41.6, 0.3, 17.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.dig[1]);
  const controls = makeControls(camera, VIEW.dig[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const SC = { glc: '#F2C14E', fru: '#FF9A5C', gal: '#7FE0A0' };
  const ENZC = { amy: '#7FD6FF', malt: '#F2C14E', suc: '#FF9A5C', lac: '#7FE0A0' };

  /* ---------- 1. переваривание и всасывание ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const YT = 0.55, YB = -1.25, XL = -3.3, XR = 3.3;
  // клетки эпителия (энтероциты) и микроворсинки
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(2.1, YT - YB, 1.5, 6, 6, 4); displaceGeo(g, (v) => { v.x *= 1 - 0.04 * Math.cos(v.y * 2); v.z += 0.04 * noise3(v.x, v.y, i); });
    g.translate(XL + 1.1 + i * 2.2, (YT + YB) / 2, 0); g.computeVertexNormals();
    G1.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8A0A0').multiplyScalar(0.22), roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false })));
    const nuc = new THREE.Mesh(ell3(0.32, 0.42, 0.3, V3(XL + 1.1 + i * 2.2, YB + 0.55, 0)), protMat('#9F7BFF', 0.3)); G1.add(nuc);
  }
  const MV = []; for (let x = XL + 0.08; x < XR; x += 0.14) for (let z = -0.6; z <= 0.6; z += 0.3) MV.push(V3(x + rand(-0.02, 0.02), YT + 0.17, z + rand(-0.04, 0.04)));
  const mvI = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.035, 0.3, 3, 6), organMat('#F2B0B0', 0.4), MV.length); const dm = new THREE.Object3D();
  MV.forEach((p, i) => { dm.position.copy(p); dm.rotation.set(rand(-0.08, 0.08), 0, rand(-0.08, 0.08)); dm.updateMatrix(); mvI.setMatrixAt(i, dm.matrix); }); G1.add(mvI);
  // капилляр
  const CAP = new THREE.CatmullRomCurve3([V3(XL - 0.6, YB - 0.6, 0.2), V3(-1, YB - 0.5, 0.25), V3(1, YB - 0.62, 0.2), V3(XR + 0.6, YB - 0.55, 0.2)]);
  G1.add(new THREE.Mesh(taperTube(CAP, () => 0.22, 60, 14), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C0404A').multiplyScalar(0.35), roughness: 0.4, transparent: true, opacity: 0.55, depthWrite: false })));
  // ферменты щёточной каймы и амилаза
  const BB = [];
  [['malt', -2.6], ['suc', -1.3], ['lac', 0.0], ['malt', 1.2], ['suc', 2.4], ['lac', 2.95]].forEach(([k, x], i) => { const m = new THREE.Mesh(blobGeo(0.2, 0.15, 0.18, 40 + i, 0.15, 3), protMat(ENZC[k], 0.55)); m.geometry.computeVertexNormals(); m.position.set(x, YT + 0.42, 0.45); G1.add(m); BB.push({ k, m, x }); });
  const AMY = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(blobGeo(0.26, 0.22, 0.22, 50 + i, 0.15, 3), protMat(ENZC.amy, 0.5)); m.geometry.computeVertexNormals(); G1.add(m); AMY.push({ m, ph: i * 2.1 }); }
  // транспортёры
  const TR = [];
  [[-2.2, 'sglt'], [-1.75, 'glut5'], [0.0, 'sglt'], [0.45, 'glut5'], [2.2, 'sglt'], [2.65, 'glut5']].forEach(([x, k]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12), protMat(k === 'sglt' ? '#7FD6FF' : '#FF9A5C', 0.6)); m.position.set(x, YT, 0.55); G1.add(m); TR.push({ x, k, m, y: YT }); });
  [-2.0, 0.2, 2.4].forEach((x) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12), protMat('#C77DFF', 0.6)); m.position.set(x, YB, 0.55); G1.add(m); TR.push({ x, k: 'glut2', m, y: YB }); });
  // сахара: шестиугольники (глюкоза, галактоза) и пятиугольник (фруктоза)
  const hexG = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 6), penG = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 5);
  const POOL = []; const MAXS = 260;
  const glyph = (k) => { const m = new THREE.Mesh(k === 'fru' ? penG : hexG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(SC[k]).multiplyScalar(0.55), emissive: new THREE.Color(SC[k]), emissiveIntensity: 0.25, roughness: 0.35, clearcoat: 0.6 })); m.rotation.x = Math.PI / 2; G1.add(m); return m; };
  // объект пищи: цепочка остатков
  const ITEMS = [];
  function spawn(kind) {
    const units = kind === 'starch' ? Array(6 + Math.floor(rnd() * 4)).fill('glc') : kind === 'sucrose' ? ['glc', 'fru'] : kind === 'lactose' ? ['gal', 'glc'] : kind === 'maltose' ? ['glc', 'glc'] : [kind];
    const p = V3(rand(XL + 0.3, XR - 0.6), 3.0 + rnd() * 0.4, rand(-0.3, 0.6));
    const it = { kind, units, meshes: units.map((u) => glyph(u)), p, v: V3(rand(-0.05, 0.12), -0.35 - rnd() * 0.15, 0), ang: rnd() * 6, spin: rand(-0.5, 0.5), stage: 'lumen', age: 0 };
    ITEMS.push(it); return it;
  }
  function splitItem(it, parts) { // parts: массивы индексов
    const out = parts.map((idx) => { const u = idx.map((i) => it.units[i]); const ms = idx.map((i) => it.meshes[i]); const kind = u.length === 1 ? u[0] : u.length === 2 ? (u.includes('fru') ? 'sucrose' : u.includes('gal') ? 'lactose' : 'maltose') : 'starch'; return { kind, units: u, meshes: ms, p: it.p.clone().add(V3(rand(-0.15, 0.15), rand(-0.1, 0.1), 0)), v: V3(rand(-0.15, 0.15), -0.25, 0), ang: it.ang, spin: rand(-1, 1), stage: 'lumen', age: 0 }; });
    ITEMS.splice(ITEMS.indexOf(it), 1, ...out); return out;
  }
  function killItem(it) { it.meshes.forEach((m) => { G1.remove(m); }); ITEMS.splice(ITEMS.indexOf(it), 1); }
  // толстая кишка: пузырьки при лактазной недостаточности
  const colon = new THREE.Mesh(ell3(0.7, 1.0, 0.7, V3(XR + 1.3, 1.6, 0)), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C8A090').multiplyScalar(0.25), roughness: 0.5, transparent: true, opacity: 0.45, depthWrite: false })); G1.add(colon);

  /* ---------- 2. галактоза и фруктоза в печени ---------- */
  const OX = 41.3; const G2 = new THREE.Group(); G2.position.set(OX, 0, 0); scene.add(G2);
  const NODES = {
    gal: { m: 'galactose', p: V3(-3.6, 2.2, 0) }, gal1p: { m: 'gal1p', p: V3(-1.5, 2.2, 0) }, udpgal: { m: 'gal1p', p: V3(0.6, 2.9, 0), name: 'УДФ-галактоза' }, g1p: { m: 'g1p', p: V3(0.6, 1.4, 0) }, g6p: { m: 'g6p', p: V3(2.6, 1.4, 0) },
    fru: { m: 'fructose', p: V3(-3.6, -0.2, 0) }, f1p: { m: 'f1p', p: V3(-1.5, -0.2, 0) }, dhap: { m: 'dhap', p: V3(0.6, 0.15, 0) }, gald: { m: 'gap', p: V3(0.6, -0.75, 0), name: 'глицеральдегид' }, gly: { m: 'pyruvate', p: V3(3.3, -0.3, 0), name: 'гликолиз' },
  };
  Object.values(NODES).forEach((n) => { n.g = molMesh(MOL(n.m), { scale: 0.11, hideH: true }); n.g.position.copy(n.p); G2.add(n.g); n.glow = glowNucleus(G2, n.p, '#FF6A5A', 0.1, 9); n.glow.core.visible = false; n.glow.spr.material.opacity = 0; });
  const STEP = [
    ['gal', 'gal1p', 'галактокиназа', '#7FE0A0', 'gk'], ['gal1p', 'g1p', 'ГАЛТ (уридилтрансфераза)', '#7FE0A0', 'galt'], ['udpgal', 'g1p', '', '#9FB4FF', 'epi'], ['g1p', 'g6p', 'фосфоглюкомутаза', '#F2C14E', 'pgm'],
    ['fru', 'f1p', 'фруктокиназа', '#FF9A5C', 'fk'], ['f1p', 'dhap', 'альдолаза B', '#FF9A5C', 'aldB'], ['f1p', 'gald', '', '#FF9A5C', 'aldB2'], ['dhap', 'gly', '', '#F2C14E', 'g1'], ['gald', 'gly', '', '#F2C14E', 'g2'], ['g6p', 'gly', '', '#F2C14E', 'g3'],
  ];
  const AR = STEP.map(([a, b, name, col, id]) => ({ id, name, a, b, f: flowArrow(G2, NODES[a].p.clone().add(NODES[b].p.clone().sub(NODES[a].p).normalize().multiplyScalar(0.6)), NODES[b].p.clone().add(NODES[a].p.clone().sub(NODES[b].p).normalize().multiplyScalar(0.6)), col, { bend: id === 'epi' ? 0.4 : 0.12 }) }));
  const glyc = new THREE.Mesh(blobGeo(0.55, 0.55, 0.55, 61, 0.2, 3), protMat('#F2C14E', 0.35)); glyc.geometry.computeVertexNormals(); glyc.position.set(2.7, 2.55, 0); G2.add(glyc);
  const fG = flowArrow(G2, NODES.g6p.p.clone().add(V3(0, 0.4, 0)), V3(2.7, 2.0, 0), '#F2C14E', { bend: -0.2 });
  // хрусталик глаза (галактитол → катаракта) и «батарейка» АТФ (непереносимость фруктозы)
  const lens = new THREE.Mesh(ell3(0.55, 0.55, 0.22, V3(-3.6, -2.0, 0.2), 40), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8f0ff).multiplyScalar(0.3), roughness: 0.1, transparent: true, opacity: 0.4, clearcoat: 1, depthWrite: false })); G2.add(lens);
  const lensFog = new THREE.Mesh(ell3(0.5, 0.5, 0.18, V3(-3.6, -2.0, 0.2), 32), new THREE.MeshBasicMaterial({ color: 0xf8f4ec, transparent: true, opacity: 0 })); G2.add(lensFog);
  const atpBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), new THREE.MeshBasicMaterial({ color: 0x7fe0a0, transparent: true, opacity: 0.45 })); atpBar.position.set(-1.5, -1.9, 0.2); G2.add(atpBar);
  const atpFrame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.12, 0.42), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 })); atpFrame.position.set(-1.5, -1.9, 0.2); G2.add(atpFrame);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'dig', labels: true, rot: false, fly: null, msg: null, food: 'mix', lacDef: false, absorbed: { glc: 0, fru: 0, gal: 0 }, toColon: 0, gas: 0, defect: 'none', acc: { gal1p: 0, f1p: 0 }, atp: 1, lensO: 0, sugar: 1, auto: true, nextT: 0, queue: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'dig'; G2.visible = m === 'met'; st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function meal() { const kinds = st.food === 'bread' ? ['starch', 'starch', 'starch'] : st.food === 'sugar' ? ['sucrose', 'sucrose', 'sucrose', 'sucrose'] : st.food === 'milk' ? ['lactose', 'lactose', 'lactose', 'lactose'] : ['starch', 'sucrose', 'lactose', 'sucrose']; kinds.forEach((k, i) => st.queue.push([k, st.t + i * 0.3])); }
  const ENZ_OF = { maltose: 'malt', sucrose: 'suc', lactose: 'lac' };
  const tmpV = V3(0, 0, 0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'dig') {
      if (st.auto && t > st.nextT) { st.nextT = t + 2.6; meal(); }
      st.queue = st.queue.filter(([k, at]) => { if (t >= at) { if (ITEMS.length < 70) spawn(k); return false; } return true; });
      AMY.forEach((a, i) => { a.m.position.set(Math.sin(t * 0.3 + a.ph) * 2.6, 2.4 + 0.5 * Math.sin(t * 0.5 + a.ph * 1.7), 0.3); a.m.rotation.y += dt; });
      BB.forEach((b) => { b.m.material.emissiveIntensity = 0.02; if (b.k === 'lac') { b.m.visible = !st.lacDef; } });
      [...ITEMS].forEach((it) => {
        it.age += dt;
        if (it.stage === 'lumen') {
          it.p.addScaledVector(it.v, dt); it.ang += it.spin * dt;
          // крахмал: амилаза режет до мальтозы
          if (it.kind === 'starch' && it.p.y < 3.1) { const a = AMY.find((x) => x.m.position.distanceTo(it.p) < 1.0); if (a || it.p.y < 1.6) { const parts = []; for (let i = 0; i < it.units.length; i += 2) parts.push(i + 1 < it.units.length ? [i, i + 1] : [i]); splitItem(it, parts); a && (a.m.material.emissiveIntensity = 0.6); fx.spawn(it.p.clone(), V3(0, 0, 0), new THREE.Color(ENZC.amy), 0.5, 0, 1.6); return; } }
          if (it.units.length === 2 && it.p.y < YT + 0.55) {
            const ek = ENZ_OF[it.kind]; const ok = !(ek === 'lac' && st.lacDef);
            if (ok) { const b = BB.filter((x) => x.k === ek).sort((p, q) => Math.abs(p.x - it.p.x) - Math.abs(q.x - it.p.x))[0]; b.m.material.emissiveIntensity = 0.8; fx.spawn(it.p.clone(), V3(0, 0, 0), new THREE.Color(ENZC[ek]), 0.5, 0, 1.6); splitItem(it, [[0], [1]]).forEach((o) => { o.v.set(rand(-0.1, 0.1), -0.2, 0); }); return; }
            // лактоза без лактазы — течёт дальше по просвету в толстую кишку
            it.stage = 'colon'; it.v.set(0.9, 0.15, 0);
          }
          if (it.units.length === 1 && it.p.y < YT + 0.35) {
            const k = it.units[0], want = k === 'fru' ? 'glut5' : 'sglt';
            const tr = TR.filter((x) => x.k === want).sort((p, q) => Math.abs(p.x - it.p.x) - Math.abs(q.x - it.p.x))[0];
            it.stage = 'in'; it.tr = tr; it.out = TR.filter((x) => x.k === 'glut2').sort((p, q) => Math.abs(p.x - tr.x) - Math.abs(q.x - tr.x))[0]; it.u = 0;
            if (want === 'sglt') fx.spawn(V3(tr.x + 0.1, YT + 0.3, 0.6), V3(0, -0.6, 0), new THREE.Color('#C8C8FF'), 0.6, 0, 1.2);   // Na⁺ вместе с сахаром
            tr.m.material.emissiveIntensity = 0.6;
          }
          if (it.p.y < YT + 0.3 && it.units.length > 2) it.p.y = YT + 0.3;
        } else if (it.stage === 'in') {
          it.u += dt * 0.55; const a = V3(it.tr.x, YT + 0.25, 0.55), b = V3(it.tr.x, YT - 0.1, 0.55), c = V3(it.out.x, YB + 0.1, 0.55), d = V3(it.out.x, YB - 0.45, 0.4);
          const u = it.u; it.p.copy(u < 0.25 ? a.clone().lerp(b, u / 0.25) : u < 0.85 ? b.clone().lerp(c, (u - 0.25) / 0.6) : c.clone().lerp(d, (u - 0.85) / 0.15));
          if (u > 0.8) it.out.m.material.emissiveIntensity = 0.6;
          if (u >= 1) { it.stage = 'blood'; it.u = CAP.getUtoTmapping ? 0 : 0; it.cu = clamp((it.p.x - XL + 0.6) / (XR - XL + 1.2), 0, 1); st.absorbed[it.units[0]]++; }
        } else if (it.stage === 'blood') {
          it.cu += dt * 0.35; it.p.copy(CAP.getPoint(Math.min(1, it.cu))); if (it.cu >= 1) { killItem(it); return; }
        } else if (it.stage === 'colon') {
          it.p.addScaledVector(it.v, dt); it.v.y += dt * 0.15;
          if (it.p.x > XR + 1.0) { st.toColon++; st.gas += 1; killItem(it); for (let k = 0; k < 6; k++) fx.spawn(V3(XR + 1.3 + rand(-0.4, 0.4), 1.4 + rand(-0.5, 0.5), 0.3), V3(rand(-0.1, 0.1), 0.5 + rnd() * 0.4, 0), new THREE.Color(0xd8f0ff), 1.4, 0.4, 0.9); return; }
        }
        // отрисовка цепочки
        const n = it.meshes.length; const dir = V3(Math.cos(it.ang), Math.sin(it.ang) * 0.35, 0);
        it.meshes.forEach((m, i) => { m.position.copy(it.p).addScaledVector(dir, (i - (n - 1) / 2) * 0.24); m.rotation.z = it.ang + i * 0.3; });
      });
      [...TR, ...BB].forEach((x) => { x.m.material.emissiveIntensity = Math.max(0.03, x.m.material.emissiveIntensity - dt * 1.5); });
      AMY.forEach((a) => { a.m.material.emissiveIntensity = Math.max(0.03, a.m.material.emissiveIntensity - dt); });
      st.gas = Math.max(0, st.gas - dt * 0.25); colon.material.opacity = 0.45 + 0.3 * clamp(st.gas / 8, 0, 1); colon.scale.setScalar(1 + 0.12 * clamp(st.gas / 8, 0, 1) + 0.02 * Math.sin(t * 6) * (st.gas > 2 ? 1 : 0));
    }
    if (st.mode === 'met') {
      const gk = st.defect !== 'gk', galt = st.defect !== 'galt', fk = st.defect !== 'fk', aldB = st.defect !== 'aldB';
      const on = { gk, galt, epi: galt, pgm: true, fk, aldB, aldB2: aldB, g1: true, g2: aldB, g3: true };
      AR.forEach((a) => { a.f.mat.uniforms.uTime.value = t; a.f.mat.uniforms.uOn.value = on[a.id] ? 0.9 : 0.04; });
      fG.mat.uniforms.uTime.value = t;
      // накопление промежуточных продуктов при блоке
      st.acc.gal1p += ((st.defect === 'galt' ? 1 : 0) - st.acc.gal1p) * dt * 0.4; st.acc.f1p += ((st.defect === 'aldB' ? 1 : 0) - st.acc.f1p) * dt * 0.4;
      st.acc.gal = ((st.defect === 'gk' || st.defect === 'galt') ? 1 : 0); st.acc.fru = st.defect === 'fk' ? 1 : 0;
      const glow = (n, k) => { n.glow.spr.material.opacity = k * (0.6 + 0.3 * Math.sin(t * 4)); n.glow.spr.scale.setScalar(0.6 + 0.8 * k); };
      glow(NODES.gal1p, st.acc.gal1p); glow(NODES.f1p, st.acc.f1p); glow(NODES.gal, st.acc.gal * 0.6); glow(NODES.fru, st.acc.fru * 0.5);
      st.lensO += (((st.defect === 'galt' || st.defect === 'gk') ? 0.75 : 0) - st.lensO) * dt * 0.25; lensFog.material.opacity = st.lensO;
      st.atp += ((st.defect === 'aldB' ? 0.35 : 1) - st.atp) * dt * 0.4; atpBar.scale.y = Math.max(0.02, st.atp); atpBar.position.y = -1.9 - 0.5 + st.atp / 2; atpBar.material.color.set(st.atp < 0.6 ? 0xc04a40 : 0x4fa070);
      st.sugar += ((st.defect === 'aldB' || st.defect === 'galt' ? 0.55 : 1) - st.sugar) * dt * 0.3;
      Object.values(NODES).forEach((n, i) => { n.g.rotation.y += dt * (0.3 + 0.05 * i); });
      glyc.rotation.y += dt * 0.2;
      if (rnd() < 0.4) { const a = AR[Math.floor(rnd() * AR.length)]; if (on[a.id]) fx.spawn(a.f.curve.getPoint(rnd()).add(G2.position), V3(0, 0, 0), new THREE.Color(a.id.startsWith('g') && a.id.length === 2 ? '#F2C14E' : a.id === 'gk' || a.id === 'galt' || a.id === 'epi' ? '#7FE0A0' : '#FF9A5C'), 0.5, 0, 1.2); }
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'dig') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'всосалось в кровь · дошло до толстой кишки', x0: 10 });
    const rows = [['глюкоза', st.absorbed.glc, SC.glc], ['фруктоза', st.absorbed.fru, SC.fru], ['галактоза', st.absorbed.gal, SC.gal], ['лактоза → кишка', st.toColon, '#D8F0FF']];
    const mx = Math.max(10, ...rows.map((r) => r[1]));
    rows.forEach(([n, v, c], i) => { const y = 24 + i * ((h - 34) / 4); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(120, y, (w - 170) * v / mx, 10); ctx.globalAlpha = 1; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(n, 12, y + 9); ctx.fillText(String(v), 126 + (w - 170) * v / mx, y + 9); });
  }
  const TXT = {
    dig: '<b>Переваривание углеводов.</b> Крахмал (цепочки глюкозы) начинает резать <b>амилаза</b> слюны, а главную работу делает <b>амилаза поджелудочной железы</b> (голубые капли) — получаются мальтоза и короткие обрывки. Дисахариды расщепляют ферменты <b>щёточной каймы</b> на микроворсинках: <b>мальтаза</b>, <b>сахараза-изомальтаза</b> (сахароза → глюкоза + фруктоза), <b>лактаза</b> (лактоза → галактоза + глюкоза). Глюкоза и галактоза входят в клетку вместе с Na⁺ через <b>SGLT1</b> (голубые каналы), фруктоза — через <b>GLUT5</b> (оранжевые), а в кровь все выходят через <b>GLUT2</b> (фиолетовые). Клетчатка (целлюлоза) не переваривается: у человека нет ферментов для β-1,4-связей.',
    lac: '<b>Лактазная недостаточность.</b> У большинства взрослых людей в мире активность лактазы после отлучения от груди снижается (у народов Северной Европы чаще сохраняется — это мутация, закрепившаяся вместе с молочным животноводством). Нерасщеплённая лактоза идёт в толстую кишку: удерживает воду (осмотическая диарея), а бактерии сбраживают её до газов (H₂, CO₂, метан) и кислот — вздутие и боль. Помогают кисломолочные продукты, безлактозное молоко, таблетки лактазы.',
    met: '<b>Галактоза и фруктоза в печени</b> превращаются в метаболиты глюкозы. <b>Галактоза</b>: галактокиназа → галактозо-1-фосфат → <b>ГАЛТ</b> (галактозо-1-фосфат-уридилтрансфераза) обменивает его на глюкозо-1-фосфат, отбирая УДФ у УДФ-глюкозы; эпимераза превращает УДФ-галактозу обратно в УДФ-глюкозу. <b>Фруктоза</b>: фруктокиназа → фруктозо-1-фосфат → <b>альдолаза B</b> → дигидроксиацетонфосфат и глицеральдегид → гликолиз. Фруктоза обходит главный регуляторный шаг гликолиза (фосфофруктокиназу), поэтому её избыток быстро превращается в жир. Выберите дефект фермента.',
  };
  const DEF = {
    galt: '<b>Галактоземия</b> (дефект ГАЛТ, ~1 : 50 000). После первых кормлений молоком у младенца рвота, желтуха, увеличение печени, гипогликемия. Галактозо-1-фосфат копится и токсичен для печени, почек и мозга; галактоза превращается альдозоредуктазой в <b>галактитол</b>, который накапливается в хрусталике — <b>катаракта</b> (хрусталик мутнеет). Лечение — исключить молоко и лактозу пожизненно; входит в неонатальный скрининг.',
    gk: '<b>Дефект галактокиназы</b> — более мягкая форма: галактоза не фосфорилируется, копится в крови и превращается в галактитол — главное проявление катаракта; печень не страдает.',
    aldB: '<b>Наследственная непереносимость фруктозы</b> (дефект альдолазы B). Фруктозо-1-фосфат копится и «запирает» фосфат — падает АТФ (столбик), тормозятся гликогенолиз и глюконеогенез: после сладкого, фруктов, мёда — тяжёлая <b>гипогликемия</b>, рвота, поражение печени и почек. Дети сами начинают избегать сладкого. Лечение — исключить фруктозу, сахарозу и сорбит.',
    fk: '<b>Эссенциальная фруктозурия</b> (дефект фруктокиназы) — безобидное состояние: фруктоза не фосфорилируется в печени и выводится с мочой, обнаруживается случайно.',
  };
  const labels = [
    { text: 'просвет тонкой кишки', pos: V3(-2.2, 3.55, 0), color: '#C8B8A8', show: () => st.labels && st.mode === 'dig' },
    { text: 'щёточная кайма', pos: V3(-3.2, YT + 0.75, 0.6), color: '#F2B0B0', show: () => st.labels && st.mode === 'dig' },
    { text: 'лактаза', pos: V3(0.25, YT + 0.62, 0.6), color: ENZC.lac, show: () => st.labels && st.mode === 'dig' && !st.lacDef },
    { text: 'сахараза', pos: V3(-1.05, YT + 0.62, 0.6), color: ENZC.suc, show: () => st.labels && st.mode === 'dig' },
    { text: 'мальтаза', pos: V3(-2.4, YT + 0.62, 0.6), color: ENZC.malt, show: () => st.labels && st.mode === 'dig' },
    { text: 'SGLT1 + Na⁺', pos: V3(-2.2, YT - 0.3, 0.6), color: '#7FD6FF', show: () => st.labels && st.mode === 'dig' },
    { text: 'GLUT5', pos: V3(0.6, YT - 0.3, 0.6), color: '#FF9A5C', show: () => st.labels && st.mode === 'dig' },
    { text: 'GLUT2', pos: V3(2.55, YB + 0.25, 0.6), color: '#C77DFF', show: () => st.labels && st.mode === 'dig' },
    { text: 'энтероцит', pos: V3(-1.0, YB + 1.1, 0.8), color: '#E8A0A0', show: () => st.labels && st.mode === 'dig' },
    { text: 'капилляр → воротная вена', pos: V3(1.1, YB - 0.95, 0.3), color: '#E06A6A', show: () => st.labels && st.mode === 'dig' },
    { text: 'толстая кишка', pos: V3(XR + 0.9, 2.75, 0), color: '#C8A090', show: () => st.labels && st.mode === 'dig' },
    { text: 'глюкоза', pos: V3(3.75, 0.25, 0.6), color: SC.glc, show: () => st.labels && st.mode === 'dig' },
    { text: 'фруктоза', pos: V3(3.75, -0.1, 0.6), color: SC.fru, show: () => st.labels && st.mode === 'dig' },
    { text: 'галактоза', pos: V3(3.75, -0.45, 0.6), color: SC.gal, show: () => st.labels && st.mode === 'dig' },
    ...Object.entries(NODES).map(([k, n]) => ({ text: n.name || MOL(n.m).name, pos: n.p.clone().add(V3(OX - 0.55, -0.6, 0.2)), color: k === 'gly' || k === 'g6p' || k === 'g1p' ? '#F2C14E' : ['gal', 'gal1p', 'udpgal'].includes(k) ? '#7FE0A0' : '#FF9A5C', show: () => st.labels && st.mode === 'met' })),
    ...AR.filter((a) => a.name).map((a) => ({ text: a.name, pos: NODES[a.a].p.clone().lerp(NODES[a.b].p, 0.5).add(V3(OX - 0.6, 0.35, 0.3)), color: '#C8C8D0', show: () => st.labels && st.mode === 'met' })),
    { text: 'гликоген', pos: V3(OX + 3.35, 2.6, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'met' },
    { text: 'хрусталик (галактитол)', pos: V3(OX - 3.0, -1.5, 0.4), color: '#E8F0FF', show: () => st.labels && st.mode === 'met' },
    { text: 'АТФ печени', pos: V3(OX - 1.25, -1.2, 0.4), color: '#7FE0A0', show: () => st.labels && st.mode === 'met' },
  ].filter((l) => !l.dyn);
  const amyLab = { text: 'амилаза', pos: V3(0, 0, 0), color: ENZC.amy, show: () => st.labels && st.mode === 'dig' }; labels.push(amyLab);
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'met' && st.defect !== 'none' ? DEF[st.defect] : st.mode === 'dig' && st.lacDef ? TXT.lac : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'dig', label: 'Переваривание и всасывание' }, { id: 'met', label: 'Галактоза и фруктоза' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'dig') box.append(h('div', { class: 'glabel' }, 'Еда'), h('div', { class: 'gctl' }, seg([{ id: 'mix', label: 'Всё' }, { id: 'bread', label: 'Хлеб (крахмал)' }, { id: 'sugar', label: 'Сахар' }, { id: 'milk', label: 'Молоко' }], () => st.food, (v) => { st.food = v; meal(); }), button('Поесть', meal, true), toggle('Сам', () => st.auto, (v) => { st.auto = v; })),
        h('div', { class: 'gctl', style: 'margin-top:6px' }, toggle('Лактазная недостаточность', () => st.lacDef, (v) => { st.lacDef = v; if (v) { st.food = 'milk'; meal(); } refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Дефект фермента'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Норма' }, { id: 'galt', label: 'Галактоземия', color: '#7FE0A0' }, { id: 'gk', label: 'Галактокиназа', color: '#7FE0A0' }, { id: 'aldB', label: 'Непереносимость фруктозы', color: '#FF9A5C' }, { id: 'fk', label: 'Фруктозурия', color: '#FF9A5C' }], () => st.defect, (v) => { st.defect = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–2', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  const _upd = update; function update2(dt) { _upd(dt); const a = AMY[0].m.position; amyLab.pos.set(a.x + 0.3, a.y + 0.3, 0.4); }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 2) { setMode(['dig', 'met'][n - 1]); return true; }
    if (k === 'e' || k === 'у') { meal(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'met') return [['АТФ печени', Math.round(st.atp * 100), '%'], ['Сахар крови', (5 * st.sugar).toFixed(1), 'ммоль/л'], ['Хрусталик', st.lensO > 0.3 ? 'мутнеет' : 'прозрачен', '']];
    return [['Всосалось', st.absorbed.glc + st.absorbed.fru + st.absorbed.gal, 'молекул'], ['Лактоза в толстую кишку', st.toColon, '']];
  }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · обмен углеводов', title: 'Переваривание сахаров',
    lede: 'Хлеб, сахар и молоко превращаются в три простых сахара — глюкозу, фруктозу и галактозу. Как они проходят через стенку кишки и что бывает, когда одного фермента не хватает.',
    notes: `
      <div><h2>Углеводы пищи</h2>
        <p>В сутки человек съедает 300–400 г углеводов: около 60% — крахмал (хлеб, крупы, картофель), около 30% — сахароза, до 10% — лактоза. Всасываются только <b>моносахариды</b>. Глюкоза и галактоза входят в клетку активно, вместе с Na⁺ (SGLT1), — поэтому растворы для лечения обезвоживания содержат и соль, и глюкозу. Фруктоза всасывается медленнее, облегчённой диффузией (GLUT5).</p>
        <h3>Ферменты</h3><ul><li><b>α-Амилаза</b> слюны и поджелудочной — α-1,4-связи крахмала.</li><li><b>Изомальтаза</b> — α-1,6-связи в точках ветвления.</li><li><b>Сахараза</b>, <b>мальтаза</b>, <b>лактаза</b> — на мембране щёточной каймы.</li></ul>
        <h3>После всасывания</h3><p>Все моносахариды по воротной вене попадают в печень. Галактоза и фруктоза почти полностью превращаются в печени в глюкозу, гликоген или жир.</p></div>
      <div><h2>Условности</h2><ul><li>Сахара показаны значками: шестиугольник — глюкоза и галактоза, пятиугольник — фруктоза.</li><li>Цепочка крахмала укорочена до нескольких остатков, время сжато.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>2</code> режим</li><li><code>E</code> поесть</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('dig'); st.fly = null;
  return self;
}
