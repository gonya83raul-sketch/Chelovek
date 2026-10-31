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
    { id: 'skin', t: 0.07, c: 0xb57a66, name: 'кожа' },
    { id: 'bone', t: 0.2, c: 0xd8ccb0, name: 'кость черепа' },
    { id: 'dura', t: 0.06, c: 0xe2ddd2, name: 'твёрдая оболочка' },
    { id: 'arach', t: 0.018, c: 0xaecbe6, name: 'паутинная оболочка' },
    { id: 'sas', t: 0.11, c: 0x2a6fa8, name: 'подпаутинное пространство' },
    { id: 'pia', t: 0.014, c: 0xe07890, name: 'мягкая оболочка' },
    { id: 'grey', t: 0.2, c: 0x8c7a88, name: 'кора (серое вещество)' },
    { id: 'white', t: 0.14, c: 0xd9d0c8, name: 'белое вещество' },
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
    if (m === 'men') { st.rot = false; refs.rot && refs.rot.sync(); men.updateMatrixWorld(true); st.fly = VDK ? flyTarget(MEN_POS.clone().add(V3(-0.25, 0, 0.12)), MEN_POS.clone().add(V3(1.25, 0.9, 3.22))) : flyTarget(MEN_POS, MEN_POS.clone().add(V3(1.5, 0.9, 3.1))); }
    else st.fly = HOME;
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    // гидроцефалия
    st.swell = clamp(st.swell + (st.hydro ? dt / 10 : -dt / 4), 0, 1);
    const s = 1 + 0.5 * smooth(0, 1, st.swell); upper.scale.set(s, 1 + 0.45 * smooth(0, 1, st.swell), s);
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
  const MEN_TEXT = '<b>Оболочки мозга</b> — переход от твёрдой кости к нежной нервной ткани. Снаружи <b>твёрдая</b> (dura mater): прочная, как гибкий пластик; между полушариями она образует <b>серп мозга</b>, над мозжечком — <b>намёт</b>. Под ней <b>паутинная</b>: губка из соединительнотканных ячеек, гасит удары. Ещё глубже подпаутинное пространство с ликвором и <b>мягкая</b> оболочка с сосудами, сросшаяся с поверхностью мозга.';
  const TXT = {
    vent: '<b>Желудочки</b> выросли из канала нервной трубки. В конечном мозге — два боковых (I и II), в промежуточном — узкий III, в заднем — IV, похожий на четырёхгранную пирамиду с ромбовидным дном. III и IV соединяет узкий <b>водопровод</b> среднего мозга. Красные бусины — <b>сосудистые сплетения</b>, они выделяют ликвор.',
    flow: '<b>Ток ликвора</b>: сплетения боковых желудочков → межжелудочковые отверстия → III желудочек → водопровод → IV желудочек. Из него через отверстия <b>Мажанди</b> и <b>Люшки</b> ликвор выходит в подпаутинное пространство, омывает мозг снаружи и всасывается в венозный синус через грануляции паутинной оболочки. Он несёт ионы, питательные и регуляторные молекулы.',
    men: MEN_TEXT,
  };
  const labels = [
    { text: 'боковой желудочек', pos: V3(0.25, 0.42, 0.3), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'нижний рог', pos: V3(0.15, -0.5, 0.6), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: matchMedia('(max-width:700px)').matches ? 'отверстие Монро' : 'межжелудочковое отверстие', pos: V3(0.34, 0.1, 0.1), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: 'III желудочек', pos: V3(0.32, -0.3, 0.05), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'водопровод', pos: V3(-0.2, -0.52, 0.04), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'IV желудочек', pos: V3(-0.38, -0.95, 0.22), color: '#8fd4ff', show: () => st.labels && st.mode !== 'men' },
    { text: 'центральный канал', pos: V3(-0.49, -1.85, 0.04), color: '#8fd4ff', show: () => st.labels && st.mode === 'vent' },
    { text: 'сосудистое сплетение', pos: V3(-0.2, 0.23, 0.33), color: '#ff8090', show: () => st.labels && st.mode === 'vent' },
    { text: 'отверстия Мажанди и Люшки', pos: MAG.clone().add(V3(-0.05, -0.04, 0.05)), color: '#9fdcff', show: () => st.labels && st.mode === 'flow' },
    { text: 'синус и грануляции', pos: sinus.getPointAt(0.32).add(V3(0, 0.08, 0)), color: '#a8a0ff', show: () => st.labels && st.mode !== 'vent' },
    { text: 'закупорка водопровода', pos: aq.getPointAt(0.55).add(V3(0.06, 0, 0.06)), color: '#ff7a6a', show: () => st.labels && st.hydro },
    { text: 'серп мозга', pos: V3(0.2, 0.9, 0.02), color: '#efe8dc', show: () => st.labels && st.mode === 'men' },
    { text: 'намёт мозжечка', pos: V3(-1.3, -0.5, 0.6), color: '#efe8dc', show: () => st.labels && st.mode === 'men' },
    ...LAY.map((L) => ({ text: L.name, pos: V3(0, 0, 0), L, color: '#' + new THREE.Color(L.c).getHexString(), show: () => st.labels && st.mode === 'men' })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox();
    refs.setInfo = () => { ib.info.innerHTML = st.hydro ? '<b>Гидроцефалия.</b> Водопровод перекрыт (бывает при родовой травме, опухоли, воспалении). Ликвор продолжает выделяться, но уйти не может: боковые и III желудочки раздуваются и давят на мозг изнутри, растёт внутричерепное давление. Лечат шунтом, отводящим ликвор.' : TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'vent', label: 'Желудочки' }, { id: 'flow', label: 'Ток ликвора' }, { id: 'men', label: 'Оболочки' }], () => st.mode, (v) => setMode(v));
    const hy = toggle('Гидроцефалия', () => st.hydro, (v) => { st.hydro = v; if (v && st.mode === 'men') setMode('flow'); refs.setInfo(); });
    const fl = toggle('Частицы', () => st.flow, (v) => { st.flow = v; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { hy, fl, lab });
    el.append(group('Что показать', '1 · 2 · 3', refs.modeSeg), group('Опыт', 'H', hy), group('Вид', 'P · R · N', fl, refs.rot, lab), ib.el);
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
  function stats() { return [['Ликвора', '≈150', 'мл'], ['Давление', Math.round(st.press), 'мм рт. ст.'], ['Желудочков', 4, '']]; }
  const self = {
    mobZoom: 0.66, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#6FC3FF',
    kicker: 'Мозг · вспомогательные структуры', title: 'Желудочки и оболочки',
    lede: 'Внутри мозга — система полостей с ликвором, снаружи — три оболочки. Они питают, защищают и служат удобными ориентирами в анатомии.',
    notes: `
      <div><h2>Желудочки мозга</h2>
        <p>Всё начинается с канала нервной трубки: в заднем мозге он расширяется в <b>IV желудочек</b>, в промежуточном — в <b>III</b>, в полушариях — в <b>боковые</b> (I и II) с выростами в лобные и височные доли. III желудочек узкий, щелевидный, доходит почти до гипофиза. Между III и IV идёт <b>водопровод</b> среднего мозга, по размеру похожий на спинномозговой канал. Дно IV желудочка — ромбовидная ямка, над ним лежит мозжечок.</p>
        <h3>Ликвор</h3>
        <p>Общий объём системы — около 150 мл. Ликвор неспешно течёт от боковых желудочков к IV и выходит на поверхность мозга. Если ток нарушается, например при родовой травме, растёт внутричерепное давление и может развиться гидроцефалия.</p>
        <h3>Оболочки</h3>
        <p>Твёрдая, паутинная и мягкая оболочки одевают и головной, и спинной мозг. В позвоночнике между твёрдой оболочкой и костью есть эпидуральное пространство — туда вводят обезболивающее при эпидуральной анестезии.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Форма и связи желудочков: боковые с нижними рогами, отверстия, щель III, водопровод, пирамида IV, центральный канал.</li><li>Маршрут ликвора и место всасывания в синус.</li><li>Порядок оболочек и складки твёрдой: серп и намёт.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Толщина оболочек сильно увеличена.</li><li>Ток ликвора ускорен: на деле он обновляется 3–4 раза в сутки.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>H</code> гидроцефалия</li><li><code>P</code> частицы</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeVentricles };
