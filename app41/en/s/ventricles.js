import { GLOW, Sparks, THREE, V3, __set_rnd, brainKit, brainShell, clamp, displaceGeo, envTex, flyStep, flyTarget, glassMat, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, rand, randUnit, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 2 · ЖЕЛУДОЧКИ, ЛИКВОР, ОБОЛОЧКИ
   ========================================================= */
function makeVentricles() {
  __set_rnd(mulberry(202));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0x6fc3ff);
  const VDK = !matchMedia('(max-width:700px)').matches, VT0 = VDK ? V3(-0.62, -0.22, 0.17) : V3(-0.15, -0.35, 0), VP0 = VDK ? V3(1.97, 1.93, 7.21) : V3(2.2, 1.6, 6.4);   // компьютер: мозг правее и чуть дальше — не под заголовком
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VP0);
  const controls = makeControls(camera, VT0); controls.minDistance = 1.2; controls.maxDistance = 14;
  const shell = brainShell(scene, { opacity: 0.05, rim: 0.5 });
  const HOME = flyTarget(VT0, VP0);

  /* ---------- система желудочков ---------- */
  const csf = new THREE.MeshPhysicalMaterial({ color: 0x2f7fc0, roughness: 0.15, clearcoat: 1, transmission: 0, transparent: true, opacity: 0.55, emissive: 0x06204a, emissiveIntensity: 0.5, envMapIntensity: 0.9, depthWrite: false });
  const csfGlass = glassMat(0x8fd4ff, { rim: 0.6, base: 0.015, pow: 2.0 });
  const upper = new THREE.Group(); upper.position.set(0.1, 0.05, 0); scene.add(upper);   // боковые + III (раздуваются при гидроцефалии)
  const lower = new THREE.Group(); scene.add(lower);
  const U = (p) => p.clone().sub(upper.position);
  const meshCSF = (g, parent) => { parent.add(new THREE.Mesh(g, csf), new THREE.Mesh(g, csfGlass)); };
  const latCurves = [];
  [1, -1].forEach((s) => {
    const body = new THREE.CatmullRomCurve3([V3(0.78, 0.02, 0.17 * s), V3(0.55, 0.22, 0.2 * s), V3(0.2, 0.32, 0.21 * s), V3(-0.25, 0.3, 0.24 * s), V3(-0.58, 0.14, 0.31 * s), V3(-0.9, 0.12, 0.27 * s), V3(-1.08, 0.13, 0.2 * s)]);
    meshCSF(taperTube(new THREE.CatmullRomCurve3(body.points.map(U)), (u) => { const w = u < 0.08 ? 0.03 + u * 1.0 : u < 0.62 ? 0.11 : 0.11 - (u - 0.62) * 0.26; return w; }, 90, 18), upper);
    const inf = new THREE.CatmullRomCurve3([V3(-0.58, 0.14, 0.31 * s), V3(-0.62, -0.08, 0.42 * s), V3(-0.42, -0.3, 0.5 * s), V3(-0.1, -0.4, 0.5 * s), V3(0.12, -0.42, 0.46 * s)]);
    meshCSF(taperTube(new THREE.CatmullRomCurve3(inf.points.map(U)), (u) => 0.085 - u * 0.05, 60, 14), upper);
    const foramen = new THREE.CatmullRomCurve3([V3(0.33, 0.16, 0.19 * s), V3(0.32, 0.08, 0.09 * s), V3(0.3, 0.04, 0)]);
    meshCSF(taperTube(new THREE.CatmullRomCurve3(foramen.points.map(U)), () => 0.03, 16, 10), upper);
    latCurves.push({ body, inf, foramen, s });
  });
  // III желудочек — узкая щель между таламусами
  { const sh = new THREE.Shape();
    // карманы: шишковидный (сзади), воронковый и зрительный (внизу спереди); отверстие — межталамическое сращение
    sh.moveTo(0.42, 0.06); sh.bezierCurveTo(0.2, 0.16, -0.05, 0.14, -0.14, 0.06); sh.lineTo(-0.24, 0.03); sh.lineTo(-0.17, -0.02); sh.bezierCurveTo(-0.2, -0.12, -0.15, -0.26, -0.1, -0.3);
    sh.bezierCurveTo(0.05, -0.42, 0.2, -0.5, 0.3, -0.6); sh.lineTo(0.33, -0.72); sh.lineTo(0.38, -0.56); sh.bezierCurveTo(0.42, -0.52, 0.44, -0.5, 0.46, -0.5); sh.lineTo(0.53, -0.48); sh.lineTo(0.48, -0.4); sh.bezierCurveTo(0.5, -0.2, 0.47, -0.05, 0.42, 0.06);
    { const hole = new THREE.Path(); hole.absellipse(0.12, -0.1, 0.07, 0.06, 0, Math.PI * 2, false, 0); sh.holes.push(hole); }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 24 });
    g.translate(0, 0, -0.0175); g.translate(-upper.position.x, -upper.position.y, 0); meshCSF(g, upper); }
  // водопровод, IV желудочек, центральный канал
  const aq = new THREE.CatmullRomCurve3([V3(-0.1, -0.28, 0), V3(-0.18, -0.5, 0), V3(-0.28, -0.74, 0)]);
  const aqMesh = taperTube(aq, () => 0.022, 30, 10); meshCSF(aqMesh, lower);
  const V4C = V3(-0.4, -0.98, 0);
  const v4 = displaceGeo(new THREE.SphereGeometry(1, 48, 32), (v) => {
    const tent = Math.max(0, -v.x) * 0.9; v.set(v.x * 0.07 - tent * 0.1, v.y * 0.26, v.z * 0.2 * (1 - 0.55 * Math.abs(v.y))); v.applyAxisAngle(V3(0, 0, 1), -0.32); v.add(V4C);
  });
  meshCSF(v4, lower);
  const canal = new THREE.CatmullRomCurve3([V3(-0.47, -1.22, 0), V3(-0.48, -1.6, 0), V3(-0.49, -2.0, 0), V3(-0.5, -2.28, 0)]);
  meshCSF(taperTube(canal, () => 0.012, 40, 8), lower);
  const MAG = V3(-0.53, -1.17, 0), LUS = [V3(-0.42, -1.02, 0.21), V3(-0.42, -1.02, -0.21)];

  /* ---------- сосудистые сплетения ---------- */
  const plexPts = [];
  latCurves.forEach(({ body, inf }) => {
    // сплетение начинается от межжелудочкового отверстия (u≈0.27) и идёт назад; в переднем роге его нет
    for (let k = 0; k < 90; k++) { const u = rand(0.28, 0.75), p = body.getPointAt(u); plexPts.push(p.add(V3(rand(-0.03, 0.03), -0.06 + rand(-0.02, 0.02), rand(-0.03, 0.03)))); }
    for (let k = 0; k < 50; k++) { const u = rand(0.0, 0.7), p = inf.getPointAt(u), a = (0.085 - u * 0.05) * 0.4; plexPts.push(p.add(V3(rand(-a, a), rand(-a, a) * 0.8, rand(-a, a)))); }
  });
  for (let k = 0; k < 40; k++) plexPts.push(V3(rand(-0.05, 0.3), 0.1 + rand(-0.02, 0.02), rand(-0.02, 0.02)));
  for (let k = 0; k < 40; k++) plexPts.push(V4C.clone().add(V3(-0.07 + rand(-0.02, 0.02), rand(-0.16, 0.05), rand(-0.12, 0.12))));
  const plexMat = new THREE.MeshPhysicalMaterial({ color: 0xc8404f, roughness: 0.5, clearcoat: 0.6, emissive: 0x3a0610, emissiveIntensity: 1 });
  const plex = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.018, 1), plexMat, plexPts.length);
  { const d = new THREE.Object3D(); plexPts.forEach((p, i) => { d.position.copy(p); d.scale.setScalar(rand(0.7, 1.4)); d.updateMatrix(); plex.setMatrixAt(i, d.matrix); }); }
  scene.add(plex);

  /* ---------- синус и грануляции ---------- */
  const sinusMat = new THREE.MeshPhysicalMaterial({ color: 0x4a3ad0, roughness: 0.35, clearcoat: 0.7, emissive: 0x120a40, emissiveIntensity: 1 });
  const sinus = new THREE.CatmullRomCurve3([V3(1.35, 0.55, 0), V3(1.0, 0.9, 0), V3(0.2, 1.16, 0), V3(-0.7, 1.0, 0), V3(-1.4, 0.5, 0), V3(-1.62, 0.0, 0), V3(-1.55, -0.4, 0)]);
  scene.add(new THREE.Mesh(taperTube(sinus, (u) => 0.018 + u * 0.03, 90, 12), sinusMat));
  // сток синусов → поперечные → сигмовидные синусы → яремные вены
  { const conf = sinus.getPointAt(1);
    [1, -1].forEach((sd) => scene.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([conf.clone(), V3(-1.5, -0.55, 0.45 * sd), V3(-1.1, -0.7, 0.85 * sd), V3(-0.75, -1.05, 0.8 * sd), V3(-0.65, -1.5, 0.65 * sd)]), (u) => 0.045 + 0.008 * u, 60, 12), sinusMat)));
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.062, 20, 14), sinusMat); c.position.copy(conf); scene.add(c); }
  const gran = [];
  for (let k = 0; k < 16; k++) { const u = rand(0.12, 0.55), p = sinus.getPointAt(u); const sd = rnd() < 0.5 ? 1 : -1; const g = new THREE.Mesh(new THREE.SphereGeometry(rand(0.015, 0.028), 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x9fb8ff, roughness: 0.4, emissive: 0x1a2a50 })); g.position.copy(p).add(V3(0, -0.02, sd * rand(0.03, 0.06))); scene.add(g); gran.push(g); }

  /* ---------- серп и намёт (твёрдая оболочка) ---------- */
  const duraMat = new THREE.MeshPhysicalMaterial({ color: 0xe9e2d6, roughness: 0.6, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false, emissive: 0x15120e });
  const falx = new THREE.Group(); scene.add(falx);
  { const sh = new THREE.Shape(); const top = sinus.getPoints(40).slice(2, 34);
    sh.moveTo(top[0].x, top[0].y); top.forEach((p) => sh.lineTo(p.x, p.y));
    sh.bezierCurveTo(-1.0, 0.45, -0.6, 0.52, 0.0, 0.5); sh.bezierCurveTo(0.6, 0.45, 1.0, 0.3, top[0].x, top[0].y);
    falx.add(new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), duraMat)); }
  { // шов сферы спереди, чтобы вырезка намёта (сквозь неё проходит средний мозг) не затягивалась треугольниками
    const g = new THREE.SphereGeometry(1, 40, 20, Math.PI, Math.PI * 2, 0, Math.PI * 0.5);
    displaceGeo(g, (v, i) => {
      v.set(v.x * 0.75, v.y * 0.22, v.z * 1.15); v.add(V3(-1.15, -0.62, 0));
      const w = 0.3 * smooth(-0.95, -0.62, v.x); if (Math.abs(v.z) < w) v.z = (i % 41 <= 20 ? -1 : 1) * w;
    });
    const t = new THREE.Mesh(g, duraMat); falx.add(t); }
  falx.visible = false;

  /* ---------- оболочки: объёмный блок-разрез рядом с мозгом ---------- */
  const MC = V3(0, -0.1, 0);
  const men = new THREE.Group(); men.position.set(0.15, 1.95, 0.0); men.rotation.y = -0.35; scene.add(men); men.visible = false;
  const W = 1.5, D = 0.9;
  const LAY = [
    { id: 'skin', t: 0.07, c: 0xb57a66, name: 'skin' },
    { id: 'bone', t: 0.2, c: 0xd8ccb0, name: 'skull bone' },
    { id: 'dura', t: 0.06, c: 0xe2ddd2, name: 'dura mater' },
    { id: 'arach', t: 0.018, c: 0xaecbe6, name: 'arachnoid mater' },
    { id: 'sas', t: 0.11, c: 0x2a6fa8, name: 'subarachnoid space' },
    { id: 'pia', t: 0.014, c: 0xe07890, name: 'pia mater' },
    { id: 'grey', t: 0.2, c: 0x8c7a88, name: 'cortex (gray matter)' },
    { id: 'white', t: 0.14, c: 0xd9d0c8, name: 'white matter' },
  ];
  let yTop = 0;
  LAY.forEach((L, i) => {
    const w = W - (i < 6 ? (6 - i) * 0.13 : 0);   // ступеньки: верхние слои короче
    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(L.c).multiplyScalar(0.36), roughness: L.id === 'bone' ? 0.9 : 0.6, clearcoat: L.id === 'dura' ? 0.3 : 0, transparent: L.id === 'sas' || L.id === 'arach', opacity: L.id === 'sas' ? 0.28 : L.id === 'arach' ? 0.7 : 1, depthWrite: L.id !== 'sas' });
    const g = new THREE.BoxGeometry(w, L.t, D); g.translate(W / 2 - w / 2, -yTop - L.t / 2, 0);
    const m = new THREE.Mesh(g, mat); men.add(m); L.y = -yTop - L.t / 2; L.w = w; yTop += L.t;
  });
  // губчатое вещество кости (диплоэ) на срезе, трабекулы паутинной, сосуды, ликвор
  { const bone = LAY[1], arr = [];
    for (let k = 0; k < 120; k++) { const s = new THREE.SphereGeometry(rand(0.01, 0.025), 6, 5); s.translate(rand(W / 2 - bone.w + 0.03, W / 2 - 0.03), bone.y + rand(-0.04, 0.04), D / 2 + 0.001); arr.push(s); }
    men.add(new THREE.Mesh(mergeGeometries(arr), new THREE.MeshBasicMaterial({ color: 0x5a4636 })));
    const sas = LAY[4], tr = [];
    for (let k = 0; k < 90; k++) { const x = rand(W / 2 - sas.w + 0.02, W / 2 - 0.02), z = rand(-D / 2 + 0.03, D / 2 - 0.03), a = V3(x, sas.y + sas.t / 2, z), b = V3(x + rand(-0.03, 0.03), sas.y - sas.t / 2, z + rand(-0.03, 0.03)); tr.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.5).add(randUnit().multiplyScalar(0.015)), b]), 5, 0.0035, 4)); }
    men.add(new THREE.Mesh(mergeGeometries(tr), new THREE.MeshPhysicalMaterial({ color: 0x9fb4c8, roughness: 0.5 })));
    const vs = new THREE.CatmullRomCurve3([V3(-W / 2 + 0.1, sas.y, -D / 2 + 0.1), V3(0, sas.y + 0.01, 0.05), V3(W / 2 - 0.05, sas.y - 0.01, D / 2 - 0.15)]);
    men.add(new THREE.Mesh(new THREE.TubeGeometry(vs, 40, 0.025, 10), new THREE.MeshPhysicalMaterial({ color: 0x9a1a28, roughness: 0.35, clearcoat: 0.6, emissive: 0x2a0408 })));
    const pia = LAY[5], pv = [];
    for (let k = 0; k < 6; k++) { const z = rand(-D / 2 + 0.1, D / 2 - 0.1); pv.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(W / 2 - pia.w + 0.05, pia.y + 0.008, z), V3(rand(-0.3, 0.3), pia.y + 0.008, z + rand(-0.1, 0.1)), V3(W / 2 - 0.05, pia.y + 0.008, z + rand(-0.15, 0.15))]), 20, 0.008, 5)); }
    men.add(new THREE.Mesh(mergeGeometries(pv), new THREE.MeshPhysicalMaterial({ color: 0xb02030, roughness: 0.4, emissive: 0x200306 })));
    // нейроны в коре
    const grey = LAY[6], na = [];
    for (let k = 0; k < 60; k++) { const s = new THREE.ConeGeometry(0.012, 0.03, 5); s.translate(rand(-W / 2 + 0.05, W / 2 - 0.05), grey.y + rand(-0.08, 0.08), D / 2 + 0.003); na.push(s); }
    men.add(new THREE.Mesh(mergeGeometries(na), new THREE.MeshBasicMaterial({ color: 0x5a3a60 }))); }
  const menCSF = new Sparks(160, 0.05); men.add(menCSF.obj);
  const MEN_POS = men.position.clone().add(V3(0.1, -0.62, 0));
  const menLbl = (L) => men.localToWorld(V3(W / 2 - L.w + 0.03, L.y + L.t / 2 + 0.01, D / 2));

  /* ---------- ток ликвора ---------- */
  const paths = [];
  latCurves.forEach(({ body, foramen }) => {
    const pts = [];
    for (let k = 0; k <= 8; k++) pts.push(body.getPointAt(0.65 - k * 0.055));
    foramen.points.forEach((p) => pts.push(p.clone()));
    pts.push(V3(0.2, -0.05, 0), V3(-0.02, -0.18, 0), ...aq.points.map((p) => p.clone()), V3(-0.34, -0.86, 0), V4C.clone().add(V3(-0.02, -0.06, 0)));
    paths.push({ inner: new THREE.CatmullRomCurve3(pts), w: 1 });
  });
  const exits = [MAG, ...LUS];
  const outer = [];
  const surfPt = (x, y, side) => { // точка над поверхностью полушария
    const d = V3(x, y, side * 0.95).sub(MC).normalize(); let r = 0; const pos = brainKit().hemi[side > 0 ? 0 : 1].attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 7) { v.fromBufferAttribute(pos, i).sub(MC); const l = v.length(); if (v.dot(d) / l > 0.993) r = Math.max(r, l); }
    return MC.clone().addScaledVector(d, (r || 1.2) + 0.035);
  };
  [[-1.2, 0.2, 1], [-0.6, 0.6, 1], [0.1, 0.75, 1], [0.7, 0.55, 1], [-1.2, 0.2, -1], [-0.4, 0.7, -1], [0.4, 0.7, -1], [0.9, 0.4, -1]].forEach(([x, y, s], i) => {
    const e = exits[i % 3];
    const p1 = V3(-0.95, -1.35, 0.25 * s), p2 = V3(-1.75, -0.6, 0.45 * s), p3 = surfPt(x - 0.3, y - 0.35, s), p4 = surfPt(x, y, s), top = sinus.getPointAt(clamp(0.5 - x * 0.28, 0.1, 0.6));
    outer.push(new THREE.CatmullRomCurve3([e.clone(), p1, p2, p3, p4, top.clone().add(V3(0, -0.03, 0.05 * s)), top]));
  });
  const NP = 520, pp = new Float32Array(NP * 3), pc = new Float32Array(NP * 3);
  const part = Array.from({ length: NP }, () => ({ stage: 0, path: 0, u: rand(0, 1), out: 0, v: rand(0.06, 0.11) }));
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pc, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.045, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts3 = new THREE.Points(pGeo, pMat); pts3.frustumCulled = false; scene.add(pts3);
  part.forEach((q, i) => { q.path = i % paths.length; q.out = Math.floor(rnd() * outer.length); q.stage = rnd() < 0.55 ? 0 : 1; });
  const CC = new THREE.Color(0x9fdcff), CC2 = new THREE.Color(0x7f8cff);
  const block = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff4a3a })); block.position.copy(aq.getPointAt(0.55)); block.visible = false; scene.add(block);
  const blockGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xff4a3a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); blockGlow.scale.setScalar(0.3); blockGlow.position.copy(block.position); blockGlow.visible = false; scene.add(blockGlow);

  const st = { t: 0, mode: 'vent', flow: true, hydro: false, swell: 0, labels: true, rot: true, fly: null, press: 10 };
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); refs.setInfo && refs.setInfo();
    falx.visible = m === 'men'; men.visible = m === 'men';
    shell.solid.opacity = 0.05;
    if (m === 'men') { st.rot = false; refs.rot && refs.rot.sync(); men.updateMatrixWorld(true); st.fly = flyTarget(MEN_POS, MEN_POS.clone().add(V3(1.5, 0.9, 3.1))); }
    else st.fly = HOME;
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    // гидроцефалия
    st.swell = clamp(st.swell + (st.hydro ? dt / 10 : -dt / 4), 0, 1);
    const s = 1 + 0.75 * smooth(0, 1, st.swell); upper.scale.set(s, 1 + 0.55 * smooth(0, 1, st.swell), s);
    st.press = 10 + 25 * smooth(0, 1, st.swell);
    block.visible = blockGlow.visible = st.hydro; blockGlow.material.opacity = 0.6 + 0.4 * Math.sin(t * 6);
    // частицы
    pts3.visible = st.flow;
    if (st.flow) {
      for (let i = 0; i < NP; i++) {
        const q = part[i]; let p;
        if (q.stage === 0) {
          const lim = st.hydro ? 0.62 + 0.04 * Math.sin(i) : 1.0;
          q.u = Math.min(lim, q.u + q.v * dt * 0.9);
          p = paths[q.path].inner.getPointAt(q.u);
          if (q.u < 0.42 && st.swell > 0) { p.sub(upper.position).multiply(upper.scale).add(upper.position); }
          if (q.u >= 1) { q.stage = 1; q.u = 0; q.out = Math.floor(rnd() * outer.length); }
          pc.set([CC.r, CC.g, CC.b], i * 3);
        } else {
          q.u += q.v * dt * 0.55; p = outer[q.out].getPointAt(Math.min(q.u, 1));
          const fade = q.u > 0.9 ? 1 - (q.u - 0.9) / 0.1 : 1; const c = CC.clone().lerp(CC2, smooth(0.75, 1, q.u)).multiplyScalar(Math.max(0, fade));
          pc.set([c.r, c.g, c.b], i * 3);
          if (q.u >= 1) { q.stage = 0; q.u = 0; q.path = Math.floor(rnd() * paths.length); }
        }
        pp.set([p.x, p.y, p.z], i * 3);
      }
      pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
    }
    plexMat.emissiveIntensity = 0.8 + 0.4 * Math.sin(t * 2);
    gran.forEach((g, i) => g.scale.setScalar(1 + 0.15 * Math.sin(t * 2 + i)));
    if (men.visible) { const sas = LAY[4]; if (rnd() < dt * 40) menCSF.spawn(V3(-W / 2 + 0.1, sas.y + rand(-0.04, 0.04), rand(-D / 2 + 0.05, D / 2 - 0.05)), V3(rand(0.15, 0.3), 0, rand(-0.03, 0.03)), CC, 6, 0, 1.4); menCSF.update(dt); men.updateMatrixWorld(true); labels.forEach((l) => { if (l.L) l.pos.copy(menLbl(l.L)); }); }
  }
  const MEN_TEXT = 'The <b>meninges</b> are the transition from hard bone to delicate nervous tissue. Outermost is the <b>dura mater</b>: as tough as flexible plastic; between the hemispheres it forms the <b>falx cerebri</b>, and above the cerebellum the <b>tentorium</b>. Beneath it lies the <b>arachnoid mater</b>: a sponge of connective-tissue cells that cushions blows. Deeper still are the subarachnoid space with CSF and the <b>pia mater</b> with its blood vessels, fused to the surface of the brain.';
  const TXT = {
    vent: 'The <b>ventricles</b> developed from the canal of the neural tube. The telencephalon has two lateral ventricles (I and II), the diencephalon the narrow third ventricle, and the hindbrain the fourth ventricle, shaped like a four-sided pyramid with a rhomboid floor. The third and fourth ventricles are connected by the narrow <b>cerebral aqueduct</b> of the midbrain. The red beads are the <b>choroid plexuses</b>, which secrete CSF.',
    flow: '<b>CSF flow</b>: choroid plexuses of the lateral ventricles → interventricular foramina → third ventricle → cerebral aqueduct → fourth ventricle. From there, through the foramina of <b>Magendie</b> and <b>Luschka</b>, CSF passes into the subarachnoid space, bathes the outside of the brain and is absorbed into a venous sinus through the arachnoid granulations. It carries ions, nutrients and regulatory molecules.',
    men: MEN_TEXT,
  };
  const labels = [
    { text: 'lateral ventricle', pos: V3(0.25, 0.42, 0.3), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'inferior horn', pos: V3(0.15, -0.5, 0.6), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: 'interventricular foramen', pos: V3(0.34, 0.1, 0.1), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: 'third ventricle', pos: V3(0.32, -0.3, 0.05), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'cerebral aqueduct', pos: V3(-0.2, -0.52, 0.04), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'fourth ventricle', pos: V3(-0.38, -0.95, 0.22), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'central canal', pos: V3(-0.49, -1.85, 0.04), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: 'choroid plexus', pos: V3(-0.2, 0.23, 0.33), color: '#ff8090', show: () => st.labels && st.mode === 'vent' },
    { text: 'foramina of Magendie and Luschka', pos: MAG.clone().add(V3(-0.05, -0.04, 0.05)), color: '#9fdcff', show: () => st.labels && st.mode === 'flow' },
    { text: 'sinus and granulations', pos: sinus.getPointAt(0.32).add(V3(0, 0.08, 0)), color: '#a8a0ff', show: () => st.labels && st.mode !== 'vent' },
    { text: 'aqueduct blockage', pos: aq.getPointAt(0.55).add(V3(0.06, 0, 0.06)), color: '#ff7a6a', show: () => st.labels && st.hydro },
    { text: 'falx cerebri', pos: V3(0.2, 0.9, 0.02), color: '#efe8dc', show: () => st.labels && st.mode === 'men' },
    { text: 'tentorium cerebelli', pos: V3(-1.3, -0.5, 0.6), color: '#efe8dc', show: () => st.labels && st.mode === 'men' },
    ...LAY.map((L) => ({ text: L.name, pos: V3(0, 0, 0), L, color: '#' + new THREE.Color(L.c).getHexString(), show: () => st.labels && st.mode === 'men' })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox();
    refs.setInfo = () => { ib.info.innerHTML = st.hydro ? '<b>Hydrocephalus.</b> The cerebral aqueduct is blocked (this can happen with birth injury, a tumor or inflammation). CSF is still being secreted but cannot drain: the lateral and third ventricles swell and press on the brain from the inside, and intracranial pressure rises. It is treated with a shunt that drains the CSF away.' : TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'vent', label: 'Ventricles' }, { id: 'flow', label: 'CSF flow' }, { id: 'men', label: 'Meninges' }], () => st.mode, (v) => setMode(v));
    const hy = toggle('Hydrocephalus', () => st.hydro, (v) => { st.hydro = v; if (v && st.mode === 'men') setMode('flow'); refs.setInfo(); });
    const fl = toggle('Particles', () => st.flow, (v) => { st.flow = v; });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { hy, fl, lab });
    el.append(group('What to show', '1 · 2 · 3', refs.modeSeg), group('Experiment', 'H', hy), group('View', 'P · R · N', fl, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('vent'); return true; } if (k === '2') { setMode('flow'); return true; } if (k === '3') { setMode('men'); return true; }
    if (k === 'h' || k === 'р') { refs.hy.click(); return true; }
    if (k === 'p' || k === 'з') { refs.fl.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['CSF', '≈150', 'mL'], ['Pressure', Math.round(st.press), 'mmHg'], ['Ventricles', 4, '']]; }
  const self = {
    mobZoom: 0.66, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#6FC3FF',
    kicker: 'Brain · supporting structures', title: 'Ventricles and meninges',
    lede: 'Inside the brain is a system of cavities filled with CSF; outside are three membranes. They nourish and protect the brain and serve as convenient landmarks in anatomy.',
    notes: `
      <div><h2>The ventricles of the brain</h2>
        <p>It all starts with the canal of the neural tube: in the hindbrain it widens into the <b>fourth ventricle</b>, in the diencephalon into the <b>third</b>, and in the hemispheres into the <b>lateral</b> ventricles (I and II), with extensions into the frontal and temporal lobes. The third ventricle is narrow and slit-like and reaches almost to the pituitary gland. Between the third and fourth ventricles runs the <b>cerebral aqueduct</b> of the midbrain, similar in size to the central canal of the spinal cord. The floor of the fourth ventricle is the rhomboid fossa, with the cerebellum lying above it.</p>
        <h3>CSF</h3>
        <p>The total volume of the system is about 150 mL. CSF flows slowly from the lateral ventricles to the fourth and emerges onto the surface of the brain. If the flow is disrupted, for example by a birth injury, intracranial pressure rises and hydrocephalus may develop.</p>
        <h3>Meninges</h3>
        <p>The dura, arachnoid and pia mater cover both the brain and the spinal cord. In the spine, between the dura and the bone, there is the epidural space: this is where anesthetic is injected during epidural anesthesia.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The shape and connections of the ventricles: the lateral ventricles with their inferior horns, the foramina, the slit of the third ventricle, the aqueduct, the pyramid of the fourth ventricle, the central canal.</li><li>The route of CSF and the site of its absorption into the sinus.</li><li>The order of the meninges and the folds of the dura: the falx and the tentorium.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The thickness of the meninges is greatly exaggerated.</li><li>CSF flow is sped up: in reality CSF is renewed 3–4 times a day.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>H</code> hydrocephalus</li><li><code>P</code> particles</li><li><code>R</code> rotate</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeVentricles };
