import { GLOW, Sparks, THREE, V3, __set_rnd, button, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, lerp, makeControls, mulberry, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 3 · СТВОЛ МОЗГА: ПРОДОЛГОВАТЫЙ МОЗГ, МОСТ, СРЕДНИЙ МОЗГ
   ========================================================= */
const STEM_MODES = [
  { id: 'floors', label: 'Three levels' },
  { id: 'rf', label: 'Vital centers' },
  { id: 'nuclei', label: 'Transmitter nuclei' },
  { id: 'paths', label: 'Tracts and decussations' },
  { id: 'orient', label: 'Orienting reflex' },
];
function makeStem() {
  __set_rnd(mulberry(505));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0x9fb0ff);
  const HOME = flyTarget(V3(0, -0.85, 0), V3(-7.7, 3.1, 9.6));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 2.5; controls.maxDistance = 30;
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- оболочка ствола: профиль по высоте ---------- */
  const W = (y) => y > 2.0 ? 0.8 : y > 1.0 ? 0.78 : y > -0.6 ? 0.78 + 0.45 * Math.sin((y + 0.6) / 1.6 * Math.PI) : y > -2.6 ? 0.7 - (-0.6 - y) * 0.13 : 0.42;
  const A = (y) => y > 1.0 ? 0.62 : y > -0.6 ? 0.62 + 0.5 * Math.sin((y + 0.6) / 1.6 * Math.PI) : y > -2.6 ? 0.55 - (-0.6 - y) * 0.06 : 0.38;   // вентральная глубина
  const B = (y) => y > 1.0 ? 0.62 : y > -2.6 ? 0.55 - Math.max(0, -1.0 - y) * 0.05 : 0.38;   // дорзальная
  const gau = (v, sg) => Math.exp(-(v / sg) * (v / sg));
  const NY = 140, NT = 72, Y0 = 2.3, Y1 = -3.0;
  const pos = [], idx = [];
  for (let i = 0; i <= NY; i++) {
    const y = Y0 + (Y1 - Y0) * i / NY;
    for (let j = 0; j <= NT; j++) {
      const th = j / NT * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
      let x = (c > 0 ? A(y) : B(y)) * c, z = W(y) * s;
      // пирамиды и оливы (продолговатый мозг)
      if (y < -0.7 && y > -2.6) { x += 0.08 * gau(th - 0.18, 0.1) + 0.08 * gau(th - (Math.PI * 2 - 0.18), 0.1); const ol = gau(y + 1.35, 0.35); x += 0.1 * ol * (gau(th - 0.75, 0.18) + gau(th - (Math.PI * 2 - 0.75), 0.18)); }
      // ножки мозга (средний мозг)
      if (y > 1.0) { const pd = smooth(1.0, 1.3, y); x += 0.16 * pd * (gau(th - 0.6, 0.3) + gau(th - (Math.PI * 2 - 0.6), 0.3)); }
      // ромбовидная ямка (дно IV желудочка)
      if (c < 0 && y < 0.9 && y > -1.7) { const half = 0.5 * (1 - Math.abs((y + 0.4) / 1.3)) * 1.2; if (Math.abs(z) < half) x += 0.18 * smooth(half, half * 0.5, Math.abs(z)); }
      // четверохолмие
      if (c < 0 && y > 1.1) { [1.3, 1.72].forEach((yc) => [0.24, -0.24].forEach((zc) => { x -= 0.14 * gau(y - yc, 0.16) * gau(z - zc, 0.16) * (-c); })); }
      pos.push(x, y, z);
    }
  }
  for (let i = 0; i < NY; i++) for (let j = 0; j < NT; j++) { const a = i * (NT + 1) + j, b = a + NT + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  // торцы ствола закрыты (срез сверху и снизу)
  [[0, Y0], [NY, Y1]].forEach(([i, y]) => { const c = pos.length / 3; pos.push((A(y) - B(y)) / 2, y, 0); for (let j = 0; j < NT; j++) { const a = i * (NT + 1) + j; idx.push(c, a, a + 1); } });
  const stemGeo = new THREE.BufferGeometry(); stemGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); stemGeo.setIndex(idx); stemGeo.computeVertexNormals();
  const stemMat = mat(0xd8b8c4, { transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
  scene.add(new THREE.Mesh(stemGeo, stemMat), new THREE.Mesh(stemGeo, glassMat(0xf0c8d8, { rim: 0.6, base: 0.01, pow: 2 })));
  // таламусы сверху (контекст), мозжечок (переключатель)
  [1, -1].forEach((s) => { const g = new THREE.SphereGeometry(1, 32, 24); g.scale(0.7, 0.42, 0.45); g.translate(-0.2, 2.75, 0.5 * s); scene.add(new THREE.Mesh(g, glassMat(0xb9a4ff, { rim: 0.5, base: 0.012, pow: 1.8 }))); });
  const cereG = displaceGeo(new THREE.SphereGeometry(1, 120, 80), (v) => { const fol = 1 + 0.03 * Math.sin(v.y * 40 + v.z * 3); v.set(v.x * 1.1 * fol, v.y * 0.9 * fol, v.z * 2.0 * fol); v.add(V3(-1.6, -0.6, 0)); });
  const cere = new THREE.Group(); scene.add(cere);
  cere.add(new THREE.Mesh(cereG, mat(0xd0a898, { transparent: true, opacity: 0.25, depthWrite: false })), new THREE.Mesh(cereG, glassMat(0xffc9b8, { rim: 0.55, base: 0.01, pow: 2 })));
  cere.visible = false;
  // ножки мозжечка (срез)
  // культи ножек: верхняя тонкая у среднего мозга, средняя самая толстая от моста, нижняя от продолговатого; срез — белое вещество
  { const pm = mat(0xc8a8b0), cutM = tissue(new THREE.Color(0xe8dcc8).multiplyScalar(0.5), { emissive: 0x6a6058, emissiveIntensity: 0.2, side: THREE.DoubleSide }), rimM = new THREE.MeshBasicMaterial({ color: 0x8a6a6a, side: THREE.DoubleSide });
    [1, -1].forEach((s) => { [[0.95, -0.5, 0.12], [0.0, -0.08, 0.26], [-0.9, -0.45, 0.15]].forEach(([y, x, r]) => {
      const zs = W(y) * Math.sqrt(Math.max(0.05, 1 - (x / B(y)) ** 2)), d = V3(-0.5, 0, s).normalize(), c = V3(x, y, s * zs * 0.94);
      const len = 0.34 + r * 0.6, bend = V3(-0.1 - 0.25 * r, -0.12 * Math.sign(y) * (Math.abs(y) > 0.5 ? 1 : 0), 0);
      const pc = new THREE.QuadraticBezierCurve3(c.clone().addScaledVector(d, -0.14), c.clone().addScaledVector(d, len * 0.5), c.clone().addScaledVector(d, len).add(bend));
      scene.add(new THREE.Mesh(taperTube(pc, (u) => r * (0.92 + 0.32 * u * u), 24, 28), pm));
      const tip = pc.getPoint(1), cq = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), pc.getTangent(1).normalize()); r *= 1.0;
      const face = new THREE.Mesh(new THREE.CircleGeometry(r, 32), cutM); face.position.copy(tip); face.quaternion.copy(cq); scene.add(face);
      const rim = new THREE.Mesh(new THREE.RingGeometry(r * 0.9, r * 1.02, 32), rimM); rim.position.copy(tip).addScaledVector(d, 0.003); rim.quaternion.copy(cq); scene.add(rim);
    }); }); }

  /* ---------- этажи: основание, покрышка, крыша ---------- */
  const floors = new THREE.Group(); scene.add(floors);
    // этаж точки (x — вперёд, y — вверх): основание спереди, крыша — только сзади в среднем мозге, остальное покрышка; границы размыты
  const C_BAS = new THREE.Color('#FF7A6A'), C_TEG = new THREE.Color('#5CC48A'), C_TEC = new THREE.Color('#F2C14E');
  const floorCol = (x, y, out) => {
    const kb = smooth(0.12, 0.42, x), kt = smooth(0.85, 1.2, y) * smooth(-0.22, -0.48, x);
    return out.copy(C_TEG).lerp(C_BAS, kb).lerp(C_TEC, kt);
  };
  { // окраска поверхности (чуть снаружи оболочки), только в пределах этажей по высоте
    const g = stemGeo.clone(), P = g.attributes.position, col = new Float32Array(P.count * 3), cc = new THREE.Color();
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i); floorCol(x, y, cc); const k = smooth(2.45, 2.2, y) * smooth(-2.85, -2.5, y); col.set([cc.r * k, cc.g * k, cc.b * k], i * 3); P.setXYZ(i, x * 1.006, y, P.getZ(i) * 1.006); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    floors.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide })));
  }
  { // срединный срез: три этажа как на сагиттальном разрезе атласа
    const NYs = 90, NXs = 30, P = [], C = [], I = [], cc = new THREE.Color();
    for (let i = 0; i <= NYs; i++) { const y = 2.2 + (-2.5 - 2.2) * i / NYs, x0 = -B(y) * 0.97, x1 = A(y) * 0.97;
      for (let j = 0; j <= NXs; j++) { const x = x0 + (x1 - x0) * j / NXs; P.push(x, y, 0); floorCol(x, y, cc); C.push(cc.r, cc.g, cc.b); } }
    for (let i = 0; i < NYs; i++) for (let j = 0; j < NXs; j++) { const a = i * (NXs + 1) + j, b = a + NXs + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setIndex(I);
    floors.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide })));
  }
  // водопровод и IV желудочек
  const csfM = new THREE.MeshPhysicalMaterial({ color: 0x2f7fc0, transparent: true, opacity: 0.6, emissive: 0x06204a, emissiveIntensity: 0.6, depthWrite: false });
  scene.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(-0.4, 2.2, 0), V3(-0.38, 1.5, 0), V3(-0.42, 0.95, 0)]), () => 0.05, 24, 10), csfM));
  { const g = new THREE.SphereGeometry(1, 32, 24); g.scale(0.14, 1.25, 0.5); g.translate(-0.48, -0.4, 0); scene.add(new THREE.Mesh(g, csfM)); }

  /* ---------- ретикулярная формация и жизненные центры ---------- */
  const rf = new THREE.Group(); scene.add(rf);
  const RFN = [];
  for (let i = 0; i < 260; i++) { const y = rand(-2.4, 1.9); RFN.push(V3(rand(-0.3, 0.22), y, rand(-0.42, 0.42) * W(y) / 0.8)); }
  const rfPts = new THREE.BufferGeometry().setFromPoints(RFN);
  const rfMat = new THREE.PointsMaterial({ size: 0.09, map: GLOW, color: 0x9fe0c0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  rf.add(new THREE.Points(rfPts, rfMat));
  { const seg2 = []; RFN.forEach((p, i) => { const near = RFN.map((q, j) => [q.distanceTo(p), j]).filter(([d, j]) => j > i && d < 0.42).slice(0, 3); near.forEach(([, j]) => seg2.push(p, RFN[j])); });
    rf.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg2), new THREE.LineBasicMaterial({ color: 0x4fa08a, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }))); }
  const centers = {
    resp: [V3(-0.05, -1.75, 0.3), V3(-0.05, -1.75, -0.3), V3(-0.1, 0.35, 0.32), V3(-0.1, 0.35, -0.32)].map((p) => glowNucleus(rf, p, '#6FC3FF', 0.08, 10)),
    vaso: [V3(0.0, -1.25, 0.22), V3(0.0, -1.25, -0.22)].map((p) => glowNucleus(rf, p, '#FF6A5A', 0.08, 10)),
  };
  const rfFx = new Sparks(800, 0.16); scene.add(rfFx.obj);
  const cordPath = new THREE.CatmullRomCurve3([V3(0, -1.6, 0), V3(0, -2.6, 0), V3(0, -3.85, 0)]);

  /* ---------- ядра-медиаторы ---------- */
  const nuc = new THREE.Group(); scene.add(nuc);
  const NUC = {
    lc: { name: 'locus coeruleus', color: '#4FA3FF', med: 'norepinephrine', pts: [V3(-0.45, 0.55, 0.26), V3(-0.45, 0.55, -0.26)], to: [V3(-1.2, 4.2, 1.4), V3(-1.2, 4.2, -1.4), V3(0.6, 4.2, 1.0), V3(-1.8, -0.6, 1.4)] },
    raphe: { name: 'raphe nuclei', color: '#C77DFF', med: 'serotonin', pts: [V3(-0.08, -1.9, 0), V3(-0.08, -1.2, 0), V3(-0.1, -0.4, 0), V3(-0.12, 0.4, 0), V3(-0.1, 1.2, 0)], to: [V3(0.8, 4.3, 0.9), V3(-0.8, 4.3, -0.9), V3(0, -3.85, 0.1), V3(0.4, 4.3, -1.3)] },
    sn: { name: 'substantia nigra', color: '#F4C542', med: 'dopamine → striatum', pts: [V3(0.38, 1.4, 0.42), V3(0.38, 1.4, -0.42)], to: [V3(0.2, 4.0, 1.25), V3(0.2, 4.0, -1.25)] },
    vta: { name: 'ventral tegmental area', color: '#FFB070', med: 'dopamine → nucleus accumbens, cortex', pts: [V3(0.32, 1.45, 0.1), V3(0.32, 1.45, -0.1)], to: [V3(1.4, 4.0, 0.4), V3(1.4, 4.0, -0.4), V3(1.8, 4.3, 0.1)] },
    red: { name: 'red nucleus', color: '#FF7FB0', med: 'movement (rubrospinal tract)', pts: [V3(0.05, 1.5, 0.24), V3(0.05, 1.5, -0.24)], to: [V3(-0.05, -3.85, -0.3), V3(-0.05, -3.85, 0.3)] },
  };
  const nucObjs = {};
  Object.entries(NUC).forEach(([id, N]) => {
    const g = new THREE.Group(); nuc.add(g); nucObjs[id] = { g, glows: N.pts.map((p) => glowNucleus(g, p, N.color, id === 'sn' ? 0.09 : 0.07, 9)), flows: [] };
    if (id === 'sn') N.pts.forEach((p) => { const band = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.45, 6, 12).rotateX(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x1a1410, roughness: 0.6 })); band.position.copy(p); g.add(band); });
    N.pts.forEach((p, i) => N.to.forEach((t, j) => { if (N.pts.length > 2 && j % N.pts.length !== i % N.to.length && i > 1) return;
      if (id === 'red') { // руброспинальный путь: перекрёст сразу в покрышке среднего мозга, дальше по противоположной стороне
        if (i !== j) return; const f = flowTubeMat(N.color, 0.4, 1.4); nucObjs[id].flows.push(f);
        g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p, V3(0.1, 1.15, 0), V3(0.05, -0.6, t.z * 0.8), t]), 60, 0.022, 6), f)); return; }
      const mid = p.clone().lerp(t, 0.5).add(V3(0.2, 0, 0)); const f = flowTubeMat(N.color, 0.4, 1.4); nucObjs[id].flows.push(f); g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p, mid, t]), 50, 0.022, 6), f)); }));
  });
  // ядра черепных нервов на дне IV желудочка: двигательные медиально, чувствительные латерально
  const cnn = new THREE.Group(); scene.add(cnn);
  [1, -1].forEach((s) => {
    [[0.1, -1.6, 0.6, '#FF6A5A'], [0.24, -1.4, 0.4, '#FFA040'], [0.42, -1.2, 0.7, '#4FA3FF']].forEach(([z, y0, y1, c]) => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, y1 - y0, 6, 10), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.5), emissive: new THREE.Color(c), emissiveIntensity: 0.5, roughness: 0.4 }));
      m.position.set(-0.38, (y0 + y1) / 2, z * s); cnn.add(m);
    });
  });

  /* ---------- пути: пирамидный и медиальная петля ---------- */
  const paths = new THREE.Group(); scene.add(paths);
  const PATHF = [];
  const pathTube = (pts, color, r = 0.035, sp = 0.45) => { const f = flowTubeMat(color, sp, 2.0); PATHF.push(f); paths.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, r, 7), f)); paths.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, r * 0.6, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(0.35) }))); };
  [1, -1].forEach((s) => {
    pathTube([V3(0.55, 2.3, 0.4 * s), V3(0.6, 1.6, 0.34 * s), V3(0.7, 0.6, 0.3 * s), V3(0.62, -0.6, 0.18 * s), V3(0.55, -1.6, 0.13 * s), V3(0.45, -2.35, 0.1 * s), V3(0.2, -2.6, 0), V3(-0.05, -2.85, -0.22 * s), V3(-0.08, -3.85, -0.28 * s)], '#FF6A5A');
    pathTube([V3(-0.38, -3.85, 0.08 * s), V3(-0.38, -2.4, 0.12 * s), V3(-0.35, -2.2, 0.15 * s), V3(-0.05, -2.05, 0.05 * s), V3(0.12, -1.95, -0.06 * s), V3(0.15, -1.2, -0.1 * s), V3(0.1, 0.2, -0.16 * s), V3(0.0, 1.5, -0.22 * s), V3(-0.15, 2.7, -0.48 * s)], '#4FA3FF', 0.03);
  });

  /* ---------- ориентировочный рефлекс ---------- */
  const orient = new THREE.Group(); scene.add(orient);
  const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xfff0b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); lamp.position.set(-2.4, 2.6, 3.4); lamp.scale.setScalar(1.6); orient.add(lamp);
  const SC = [V3(-0.68, 1.72, 0.24), V3(-0.68, 1.72, -0.24)], IC = [V3(-0.66, 1.3, 0.24), V3(-0.66, 1.3, -0.24)];
  const scG = SC.map((p) => glowNucleus(orient, p, '#F2C14E', 0.08, 10)), icG = IC.map((p) => glowNucleus(orient, p, '#7FD6C8', 0.07, 9));
  const retina = new THREE.CatmullRomCurve3([lamp.position.clone(), V3(-1.4, 2.4, 1.6), V3(-0.9, 2.0, 0.6), SC[0].clone()]);
  const tecto = new THREE.CatmullRomCurve3([SC[0].clone(), V3(-0.3, 1.2, 0.1), V3(0.05, 0.0, -0.08), V3(0.1, -1.6, -0.1), V3(0.0, -3.85, -0.12)]);
  orient.add(new THREE.Mesh(new THREE.TubeGeometry(tecto, 60, 0.02, 6), new THREE.MeshBasicMaterial({ color: 0x6a5a20 })));
  const head = new THREE.Group(); head.position.set(2.6, -3.2, 0); orient.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 20), mat(0xd8b8a8)), new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 12).rotateZ(-Math.PI / 2).translate(0.48, 0, 0), mat(0xd8b8a8)));
  const orFx = new Sparks(500, 0.18); scene.add(orFx.obj);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'floors', labels: true, cere: false, park: false, fly: null, rot: true, breath: 0, beat: 0, trace: [], orT: -9, headYaw: 0, msg: null };
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; refs.setInfo && refs.setInfo();
    floors.visible = m === 'floors'; rf.visible = m === 'rf'; nuc.visible = m === 'nuclei'; paths.visible = m === 'paths'; orient.visible = m === 'orient'; cnn.visible = m === 'floors' || m === 'rf';
    if (m === 'orient') { st.rot = false; refs.rot && refs.rot.sync(); st.fly = flyTarget(V3(0, -0.4, 0.5), V3(-8.5, 4.5, 11.5)); } else st.fly = HOME;
  }
  function orientGo() { if (st.mode !== 'orient') setMode('orient'); st.orT = st.t; }
  const C_RESP = new THREE.Color(0x6fc3ff), C_VASO = new THREE.Color(0xff6a5a), C_OR = new THREE.Color(0xf2c14e);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4;
    flyStep(st, camera, controls, dt);
    [...PATHF, ...Object.values(nucObjs).flatMap((o) => o.flows)].forEach((f) => { f.uniforms.uTime.value = t; });
    // ритмы: дыхание ~15/мин, сердце ~70/мин (ускорены ×2)
    const br = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 0.5), hb = Math.exp(-((t * 2.3) % 1) * 8);
    if (rf.visible) {
      centers.resp.forEach((c) => { c.spr.material.opacity = 0.35 + 0.65 * br; c.core.scale.setScalar(0.8 + 0.5 * br); });
      centers.vaso.forEach((c) => { c.spr.material.opacity = 0.3 + 0.7 * hb; c.core.scale.setScalar(0.8 + 0.5 * hb); });
      if (br > 0.97 && t - st.breath > 1) { st.breath = t; for (let k = 0; k < 30; k++) rfFx.spawn(cordPath.getPointAt(0).add(randUnit().multiplyScalar(0.1)), V3(0, -1.6, 0).add(randUnit().multiplyScalar(0.2)), C_RESP, 1.6, 0, 1.6); }
      if (hb > 0.95 && t - st.beat > 0.3) { st.beat = t; for (let k = 0; k < 14; k++) rfFx.spawn(V3(0, -1.25, 0).add(randUnit().multiplyScalar(0.1)), V3(0, -1.9, 0).add(randUnit().multiplyScalar(0.2)), C_VASO, 1.3, 0, 1.6); }
      rfMat.opacity = 0.6 + 0.3 * Math.sin(t * 3);
    }
    st.trace.push([t, br, hb]); while (st.trace.length && st.trace[0][0] < t - 6) st.trace.shift();
    rfFx.update(dt);
    // Паркинсон
    if (nuc.visible) { const k = st.park ? 0.12 : 1; nucObjs.sn.glows.forEach((g) => { g.spr.material.opacity = k; g.core.material.opacity = 0.2 + 0.8 * k; }); nucObjs.sn.flows.forEach((f) => { f.uniforms.uOn.value = k; }); }
    // ориентировочный рефлекс
    if (orient.visible) {
      const k = t - st.orT;
      lamp.material.opacity = k < 0.6 ? 1 - k / 0.6 : 0.15 + 0.1 * Math.sin(t * 2);
      if (k > 0 && k < 1.0) orFx.spawn(retina.getPointAt(k), V3(0, 0, 0), C_OR, 0.5, 0, 2);
      const scOn = k > 1.0 && k < 2.0; scG.forEach((g) => { g.spr.material.opacity = scOn ? 1 : 0.4; });
      if (k > 1.2 && k < 3.0) orFx.spawn(tecto.getPointAt((k - 1.2) / 1.8), V3(0, 0, 0), C_OR, 0.5, 0, 2);
      const goal = k > 3.0 && k < 7 ? 0.9 : 0; st.headYaw = lerp(st.headYaw, goal, 1 - Math.exp(-dt * 3)); head.rotation.y = st.headYaw;
      orFx.update(dt);
    }
  }
  function drawScope(ctx, w, hgt) {
    scopeShow(st.mode === 'rf'); if (st.mode !== 'rf') { ctx.clearRect(0, 0, w, hgt); return; }
    ctx.clearRect(0, 0, w, hgt);
    const x = (tt) => 8 + (1 - (st.t - tt) / 6) * (w - 16);
    ctx.lineWidth = 2; ctx.strokeStyle = '#6FC3FF'; ctx.beginPath(); st.trace.forEach(([tt, b], i) => { const yy = hgt * 0.45 - b * hgt * 0.28; i ? ctx.lineTo(x(tt), yy) : ctx.moveTo(x(tt), yy); }); ctx.stroke();
    ctx.strokeStyle = '#FF6A5A'; ctx.beginPath(); st.trace.forEach(([tt, , c], i) => { const yy = hgt * 0.88 - c * hgt * 0.3; i ? ctx.lineTo(x(tt), yy) : ctx.moveTo(x(tt), yy); }); ctx.stroke();
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#6FC3FF'; ctx.fillText('respiratory center', 10, 13); ctx.fillStyle = '#FF6A5A'; ctx.fillText('vasomotor', 10, hgt - 6);
  }
  const TXT = {
    floors: 'The brainstem is divided into three levels. The <b>basis</b> (red) is white matter: the pyramids of the medulla, the bulge of the pons, the cerebral peduncles of the midbrain, the tracts running up and down. The <b>tegmentum</b> (green) lies beneath the floor of the fourth ventricle and the aqueduct: the cranial nerve nuclei, the reticular formation, the ascending lemnisci. The <b>tectum</b> (yellow) is developed only in the midbrain: this is the corpora quadrigemina. Click “Cerebellum” to cover the rhomboid fossa, as in life.',
    rf: 'The <b>reticular formation</b> is a mix of gray and white matter, a “network” of neurons from the medulla to the midbrain. It holds the vital centers: the <b>respiratory</b> center (every breath is started here; blue waves travel to the diaphragm) and the <b>vasomotor</b> center (the rate and force of the heartbeat, the diameter of blood vessels). Here too are the centers for swallowing, coughing, sneezing, vomiting and blinking, and the system that wakes up the cortex. Bottom right: the rhythms of the centers.',
    nuclei: '<b>Transmitter nuclei of the brainstem.</b> The <b>locus coeruleus</b> in the pons sends norepinephrine throughout the brain: arousal and stress. The <b>raphe nuclei</b> along the midline release serotonin: control of pain and of “noise” in the cortex. In the midbrain are the <b>substantia nigra</b> (dopamine to the striatum, movement), the <b>ventral tegmental area</b> (dopamine to the nucleus accumbens and cortex: the reward system) and the <b>red nucleus</b> (limb movements). Turn on “Parkinson’s”.',
    paths: 'The <b>pyramidal tract</b> (red) descends from the cortex through the basis of the brainstem and crosses at the border with the spinal cord: the “braid” of the pyramidal decussation. The <b>medial lemniscus</b> (blue) carries skin and muscle sensation: the first synapse is in the nuclei of the gracile and cuneate fasciculi, then it crosses and ascends to the thalamus. That is why the left hemisphere controls the right half of the body and feels it.',
    orient: 'The <b>orienting reflex</b> is Pavlov’s “what is it?” reflex. Novelty-detector neurons in the superior colliculi compare the picture with the one from 0.3 s ago. A flash at the edge of the visual field → superior colliculi → <b>tectospinal tract</b> → neck motor neurons: the head turns toward the source before we are even aware of what happened. The inferior colliculi respond to new sounds in the same way.',
    park: '<b>Parkinson’s disease.</b> The dopamine neurons of the substantia nigra die, and almost no dopamine reaches the striatum anymore. The result is tremor, stiffness (rigidity) and difficulty starting a movement (akinesia). The black color of the substantia nigra comes from melanin; in the disease it turns pale.',
  };
  const labels = [
    { text: 'midbrain', pos: V3(0.9, 1.6, 0.8), show: () => st.labels },
    { text: 'pons', pos: V3(1.3, 0.2, 0.6), show: () => st.labels },
    { text: 'medulla oblongata', pos: V3(0.8, -1.6, 0.6), show: () => st.labels },
    { text: 'spinal cord', pos: V3(0.5, -2.85, 0.3), show: () => st.labels },
    { text: 'thalamus', pos: V3(-0.2, 3.05, 0.75), color: '#b9a4ff', show: () => st.labels },
    { text: 'corpora quadrigemina', pos: V3(-0.9, 1.5, 0.45), color: '#F2C14E', show: () => st.labels && (st.mode === 'floors' || st.mode === 'orient') },
    { text: 'rhomboid fossa', pos: V3(-0.7, -0.4, 0.2), color: '#6fc3ff', show: () => st.labels && st.mode === 'floors' && !st.cere },
    { text: 'basis', pos: V3(1.05, -1.6, 0.3), color: '#FF7A6A', show: () => st.labels && st.mode === 'floors' },
    { text: 'tegmentum', pos: V3(0.0, -2.0, 0.75), color: '#5CC48A', show: () => st.labels && st.mode === 'floors' },
    { text: 'tectum', pos: V3(-0.9, 2.0, -0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'floors' },
    { text: 'cerebellar peduncles', pos: V3(-0.45, 0.1, -1.35), color: '#e8d8c8', show: () => st.labels && st.mode === 'floors' && !st.cere },
    { text: 'respiratory center', pos: V3(-0.05, -1.75, 0.45), color: '#6FC3FF', show: () => st.labels && st.mode === 'rf' },
    { text: 'vasomotor center', pos: V3(0.05, -1.25, -0.4), color: '#FF6A5A', show: () => st.labels && st.mode === 'rf' },
    { text: 'reticular formation', pos: V3(0.1, 0.9, 0.5), color: '#9fe0c0', show: () => st.labels && st.mode === 'rf' },
    { text: 'cranial nerve nuclei', pos: V3(-0.4, -1.3, 0.24), color: '#FFA040', show: () => st.labels && (st.mode === 'floors' || st.mode === 'rf') },
    ...Object.entries(NUC).map(([id, N]) => ({ text: N.name, pos: N.pts[0].clone().add({ sn: V3(0.3, -0.25, 0.45), vta: V3(0.35, 0.3, 0.1), red: V3(-0.15, 0.3, 0.35), lc: V3(-0.2, 0.2, 0.4) }[id] || V3(0.05, 0.1, 0.15)), color: N.color, show: () => st.labels && st.mode === 'nuclei' })),
    { text: 'pyramidal tract', pos: V3(0.75, 0.6, 0.45), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'pyramidal decussation', pos: V3(0.25, -2.6, 0.2), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'medial lemniscus', pos: V3(0.15, -0.6, -0.4), color: '#4FA3FF', show: () => st.labels && st.mode === 'paths' },
    { text: 'superior colliculi', pos: SC[0].clone().add(V3(-0.1, 0.12, 0.15)), color: '#F2C14E', show: () => st.labels && st.mode === 'orient' },
    { text: 'inferior colliculi', pos: IC[0].clone().add(V3(-0.1, -0.12, 0.15)), color: '#7FD6C8', show: () => st.labels && st.mode === 'orient' },
    { text: 'tectospinal tract', pos: V3(0.15, -1.0, -0.25), color: '#F2C14E', show: () => st.labels && st.mode === 'orient' },
    { text: 'head turn', pos: V3(2.6, -2.6, 0), show: () => st.labels && st.mode === 'orient' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'nuclei' && st.park ? TXT.park : TXT[st.mode]); };
    refs.modeSeg = seg(STEM_MODES, () => st.mode, (v) => setMode(v));
    const cb = toggle('Cerebellum', () => st.cere, (v) => { st.cere = v; cere.visible = v; });
    const pk = toggle('Parkinson’s', () => st.park, (v) => { st.park = v; if (v && st.mode !== 'nuclei') setMode('nuclei'); refs.setInfo(); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { cb, pk, lab });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 460px' }, h('div', { class: 'glabel' }, 'What to show', h('kbd', {}, '1–5')), h('div', { class: 'gctl' }, refs.modeSeg)),
      group('Experiment', 'F · P · C', button('Flash to the side', orientGo, true), pk, cb), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const n = parseInt(e.key, 10); if (n >= 1 && n <= 5) { setMode(STEM_MODES[n - 1].id); return true; }
    const k = e.key.toLowerCase();
    if (k === 'f' || k === 'а') { orientGo(); return true; } if (k === 'p' || k === 'з') { refs.pk.click(); return true; } if (k === 'c' || k === 'с') { refs.cb.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { if (st.mode === 'rf') return [['Breathing', 15, '/min'], ['Pulse', 70, 'bpm']]; return [['Medulla', '≈4', 'cm'], ['Pons', '2.5–3', 'cm']]; }
  setMode('floors');
  const self = {
    labelBg: true, mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#9FE0C0',
    kicker: 'Brain · brainstem structures', title: 'Brainstem',
    lede: 'The medulla oblongata and midbrain are ancient parts of the brain shared by all vertebrates; the pons stands out as a separate part only in mammals. They hold the centers of breathing and heartbeat, sleep and wakefulness, and all the pathways between the brain and the body.',
    notes: `
      <div><h2>What the brainstem is made of</h2>
        <p>The <b>medulla oblongata</b> resembles a truncated cone about 4 cm long (from 1.5 to 2.5 cm wide). In front are the pyramids and olives; behind is the floor of the fourth ventricle, the rhomboid fossa. The <b>pons</b> is almost square, 2.5–3 cm; it becomes a separate structure only in mammals, together with the cortex and cerebellum: through the pontine nuclei the cortex sends copies of motor programs to the cerebellum. The <b>midbrain</b> is small but important: the corpora quadrigemina, the aqueduct with the periaqueductal gray, the red nucleus and the substantia nigra.</p>
        <h3>Genes</h3>
        <p>The parts of the brainstem are laid down by homeotic genes: Pax, Otx2, Wnt1, Gbx2, Fgf8, Shh, Hox. In a newer classification, the medulla and pons are assembled from 11 stereotyped units.</p>
        <h3>Evolution</h3>
        <p>In fish the main integrative center is the midbrain. In humans the brainstem is far lighter than the cerebellum and the hemispheres, but without it breathing, the heartbeat and wakefulness itself are impossible.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The shape of the brainstem: pyramids, olives, the bulge of the pons, peduncles, corpora quadrigemina, rhomboid fossa.</li><li>The division into basis, tegmentum and tectum.</li><li>The positions of the locus coeruleus, raphe nuclei, substantia nigra, ventral tegmental area and red nucleus.</li><li>The decussation of the pyramids and of the medial lemniscus.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The brainstem is enlarged and taken out of the brain; the cerebellar peduncles are shown cut.</li><li>The rhythms of breathing and heartbeat are sped up.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>5</code> mode</li><li><code>F</code> flash</li><li><code>P</code> Parkinson’s</li><li><code>C</code> cerebellum</li><li><code>R</code> rotate</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeStem };
