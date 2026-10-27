import { GLOW, Sparks, THREE, V3, __set_rnd, button, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, lerp, makeControls, mulberry, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 3 · СТВОЛ МОЗГА: ПРОДОЛГОВАТЫЙ МОЗГ, МОСТ, СРЕДНИЙ МОЗГ
   ========================================================= */
const STEM_MODES = [
  { id: 'floors', label: 'Три этажа' },
  { id: 'rf', label: 'Жизненные центры' },
  { id: 'nuclei', label: 'Ядра-медиаторы' },
  { id: 'paths', label: 'Пути и перекрёсты' },
  { id: 'orient', label: 'Ориентировочный рефлекс' },
];
function makeStem() {
  __set_rnd(mulberry(505));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0x9fb0ff);
  const HOME = flyTarget(V3(0, -0.7, 0), V3(-10.5, 4.5, 13));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 2.5; controls.maxDistance = 30;
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- оболочка ствола: профиль по высоте ---------- */
  const W = (y) => y > 2.0 ? 0.8 : y > 1.0 ? 0.78 : y > -0.6 ? 0.78 + 0.45 * Math.sin((y + 0.6) / 1.6 * Math.PI) : y > -2.6 ? 0.7 - (-0.6 - y) * 0.13 : 0.42;
  const A = (y) => y > 1.0 ? 0.62 : y > -0.6 ? 0.62 + 0.5 * Math.sin((y + 0.6) / 1.6 * Math.PI) : y > -2.6 ? 0.55 - (-0.6 - y) * 0.06 : 0.38;   // вентральная глубина
  const B = (y) => y > 1.0 ? 0.62 : y > -2.6 ? 0.55 - Math.max(0, -1.0 - y) * 0.05 : 0.38;   // дорзальная
  const gau = (v, sg) => Math.exp(-(v / sg) * (v / sg));
  const NY = 140, NT = 72, Y0 = 2.3, Y1 = -3.9;
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
  { const thMat = mat(0xb9a4ff, { transparent: true, opacity: 0.22, depthWrite: false });
    [1, -1].forEach((s) => { const g = new THREE.SphereGeometry(1, 32, 24); g.scale(0.7, 0.42, 0.45); g.translate(-0.2, 2.75, 0.5 * s); scene.add(new THREE.Mesh(g, thMat), new THREE.Mesh(g, glassMat(0xb9a4ff, { rim: 0.4, base: 0.01, pow: 1.8 }))); }); }
  const cereG = displaceGeo(new THREE.SphereGeometry(1, 120, 80), (v) => { const fol = 1 + 0.03 * Math.sin(v.y * 40 + v.z * 3); v.set(v.x * 1.1 * fol, v.y * 0.9 * fol, v.z * 2.0 * fol); v.add(V3(-1.6, -0.6, 0)); });
  const cere = new THREE.Group(); scene.add(cere);
  cere.add(new THREE.Mesh(cereG, mat(0xd0a898, { transparent: true, opacity: 0.25, depthWrite: false })), new THREE.Mesh(cereG, glassMat(0xffc9b8, { rim: 0.55, base: 0.01, pow: 2 })));
  cere.visible = false;
  // ножки мозжечка (срез)
  // культи ножек: верхняя тонкая у среднего мозга, средняя самая толстая от моста, нижняя от продолговатого; срез — белое вещество
  { const pm = mat(0xc8a8b0), cutM = mat(0xd8c8b8, { emissive: 0x2a2420 }), rimM = new THREE.MeshBasicMaterial({ color: 0x3a2a2a, side: THREE.DoubleSide });
    [1, -1].forEach((s) => { [[0.95, -0.5, 0.12], [0.0, -0.08, 0.32], [-0.9, -0.45, 0.15]].forEach(([y, x, r]) => {
      const zs = W(y) * Math.sqrt(Math.max(0.05, 1 - (x / B(y)) ** 2)), d = V3(-0.5, 0, s).normalize(), c = V3(x, y, s * zs * 0.94);
      const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d), len = 0.28 + r * 0.5;
      const stump = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.08, len, 32, 1, true), pm); stump.quaternion.copy(q); stump.position.copy(c).addScaledVector(d, len / 2 - 0.12); scene.add(stump);
      const tip = c.clone().addScaledVector(d, len - 0.12), cq = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), d);
      const face = new THREE.Mesh(new THREE.CircleGeometry(r, 32), cutM); face.position.copy(tip); face.quaternion.copy(cq); scene.add(face);
      const rim = new THREE.Mesh(new THREE.RingGeometry(r * 0.9, r * 1.02, 32), rimM); rim.position.copy(tip).addScaledVector(d, 0.003); rim.quaternion.copy(cq); scene.add(rim);
    }); }); }

  /* ---------- этажи: основание, покрышка, крыша ---------- */
  const floors = new THREE.Group(); scene.add(floors);
  const floorMat = (c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.5), roughness: 0.5, transparent: true, opacity: 0.24, depthWrite: false, emissive: new THREE.Color(c), emissiveIntensity: 0.2, side: THREE.DoubleSide });
  // границы этажа по x зависят от высоты и повторяют контур ствола; по z слой не выходит за поверхность
  const slab = (x0, x1, y0, y1, c, wk = 0.84) => {
    const box = new THREE.CylinderGeometry(1, 1, y0 - y1, 40, 48, true); box.translate(0, (y0 + y1) / 2, 0);
    displaceGeo(box, (v) => {
      const yy = v.y, ang = Math.atan2(v.z, v.x), a0 = x0(yy), a1 = x1(yy);
      const xx = (a0 + a1) / 2 + Math.cos(ang) * (a1 - a0) / 2, ax = xx > 0 ? A(yy) : B(yy);
      const zm = 0.96 * W(yy) * Math.sqrt(Math.max(0, 1 - (xx / (ax + 0.04)) ** 2)), zz = Math.sign(Math.sin(ang)) * Math.min(Math.abs(Math.sin(ang) * W(yy) * wk), zm);
      v.set(xx, yy, zz);
    });
    floors.add(new THREE.Mesh(box, floorMat(c)));
  };
  slab(() => 0.28, (y) => A(y) * 0.96, 2.2, -2.5, '#FF7A6A');   // основание
  slab((y) => -B(y) * 0.72, () => 0.3, 2.2, -2.5, '#5CC48A');   // покрышка
  slab((y) => -B(y) - 0.08, () => -0.36, 2.2, 1.0, '#F2C14E');  // крыша (четверохолмие)
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
    lc: { name: 'голубое пятно', color: '#4FA3FF', med: 'норадреналин', pts: [V3(-0.45, 0.55, 0.26), V3(-0.45, 0.55, -0.26)], to: [V3(-1.2, 4.2, 1.4), V3(-1.2, 4.2, -1.4), V3(0.6, 4.2, 1.0), V3(-1.8, -0.6, 1.4)] },
    raphe: { name: 'ядра шва', color: '#C77DFF', med: 'серотонин', pts: [V3(-0.08, -1.9, 0), V3(-0.08, -1.2, 0), V3(-0.1, -0.4, 0), V3(-0.12, 0.4, 0), V3(-0.1, 1.2, 0)], to: [V3(0.8, 4.3, 0.9), V3(-0.8, 4.3, -0.9), V3(0, -3.85, 0.1), V3(0.4, 4.3, -1.3)] },
    sn: { name: 'чёрная субстанция', color: '#F4C542', med: 'дофамин → стриатум', pts: [V3(0.38, 1.4, 0.42), V3(0.38, 1.4, -0.42)], to: [V3(0.2, 4.0, 1.25), V3(0.2, 4.0, -1.25)] },
    vta: { name: 'вентральная покрышка', color: '#FFB070', med: 'дофамин → прилежащее ядро, кора', pts: [V3(0.32, 1.45, 0.1), V3(0.32, 1.45, -0.1)], to: [V3(1.4, 4.0, 0.4), V3(1.4, 4.0, -0.4), V3(1.8, 4.3, 0.1)] },
    red: { name: 'красное ядро', color: '#FF7FB0', med: 'движения (руброспинальный путь)', pts: [V3(0.05, 1.5, 0.24), V3(0.05, 1.5, -0.24)], to: [V3(-0.05, -3.85, -0.3), V3(-0.05, -3.85, 0.3)] },
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
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#6FC3FF'; ctx.fillText('дыхательный центр', 10, 13); ctx.fillStyle = '#FF6A5A'; ctx.fillText('сосудодвигательный', 10, hgt - 6);
  }
  const TXT = {
    floors: 'Ствол делится на три этажа. <b>Основание</b> (красное) — белое вещество: пирамиды продолговатого мозга, валик моста, ножки среднего мозга, пути вверх и вниз. <b>Покрышка</b> (зелёная) лежит под дном IV желудочка и водопроводом: ядра черепных нервов, ретикулярная формация, восходящие петли. <b>Крыша</b> (жёлтая) развита только в среднем мозге — это четверохолмие. Нажмите «Мозжечок», чтобы закрыть ромбовидную ямку, как в жизни.',
    rf: '<b>Ретикулярная формация</b> — смесь серого и белого вещества, «сеть» нейронов от продолговатого до среднего мозга. Здесь жизненно важные центры: <b>дыхательный</b> (каждый вдох запускается отсюда, голубые волны уходят к диафрагме) и <b>сосудодвигательный</b> (частота и сила сердца, диаметр сосудов). Тут же центры глотания, кашля, чихания, рвоты, мигания и система пробуждения коры. Справа внизу — ритмы центров.',
    nuclei: '<b>Ядра-медиаторы ствола.</b> <b>Голубое пятно</b> в мосту рассылает норадреналин по всему мозгу — активация и стресс. <b>Ядра шва</b> по средней линии — серотонин, контроль боли и «шума» в коре. В среднем мозге <b>чёрная субстанция</b> (дофамин в стриатум, движения), <b>вентральная покрышка</b> (дофамин в прилежащее ядро и кору — система вознаграждения) и <b>красное ядро</b> (движения конечностей). Включите «Паркинсон».',
    paths: '<b>Пирамидный путь</b> (красный) спускается из коры по основанию ствола и на границе со спинным мозгом перекрещивается — «косичка» перекрёста пирамид. <b>Медиальная петля</b> (синяя) несёт кожную и мышечную чувствительность: первый синапс в ядрах тонкого и клиновидного пучков, затем перекрёст и подъём к таламусу. Поэтому левое полушарие управляет правой половиной тела и чувствует её.',
    orient: '<b>Ориентировочный рефлекс</b> — «рефлекс «что такое?»» по Павлову. Нейроны-детекторы новизны в верхних холмиках сравнивают картинку с той, что была 0,3 с назад. Вспышка на краю поля зрения → верхние холмики → <b>текто-спинальный путь</b> → мотонейроны шеи: голова поворачивается к источнику ещё до того, как мы осознали, что произошло. Нижние холмики так же реагируют на новые звуки.',
    park: '<b>Болезнь Паркинсона.</b> Дофаминовые нейроны чёрной субстанции гибнут, и в стриатум почти перестаёт поступать дофамин. Возникают тремор, скованность (ригидность) и трудность начать движение (акинезия). Чёрный цвет субстанции даёт меланин — при болезни она бледнеет.',
  };
  const labels = [
    { text: 'средний мозг', pos: V3(0.9, 1.6, 0.8), show: () => st.labels },
    { text: 'мост', pos: V3(1.3, 0.2, 0.6), show: () => st.labels },
    { text: 'продолговатый мозг', pos: V3(0.8, -1.6, 0.6), show: () => st.labels },
    { text: 'спинной мозг', pos: V3(0.5, -3.4, 0.3), show: () => st.labels },
    { text: 'таламус', pos: V3(-0.2, 3.05, 0.75), color: '#b9a4ff', show: () => st.labels },
    { text: 'четверохолмие', pos: V3(-0.9, 1.5, 0.45), color: '#F2C14E', show: () => st.labels && (st.mode === 'floors' || st.mode === 'orient') },
    { text: 'ромбовидная ямка', pos: V3(-0.7, -0.4, 0.2), color: '#6fc3ff', show: () => st.labels && st.mode === 'floors' && !st.cere },
    { text: 'основание', pos: V3(1.05, -1.6, 0.3), color: '#FF7A6A', show: () => st.labels && st.mode === 'floors' },
    { text: 'покрышка', pos: V3(0.0, -2.0, 0.75), color: '#5CC48A', show: () => st.labels && st.mode === 'floors' },
    { text: 'крыша', pos: V3(-0.9, 2.0, -0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'floors' },
    { text: 'ножки мозжечка', pos: V3(-0.45, 0.1, -1.35), color: '#e8d8c8', show: () => st.labels && st.mode === 'floors' && !st.cere },
    { text: 'дыхательный центр', pos: V3(-0.05, -1.75, 0.45), color: '#6FC3FF', show: () => st.labels && st.mode === 'rf' },
    { text: 'сосудодвигательный центр', pos: V3(0.05, -1.25, -0.4), color: '#FF6A5A', show: () => st.labels && st.mode === 'rf' },
    { text: 'ретикулярная формация', pos: V3(0.1, 0.9, 0.5), color: '#9fe0c0', show: () => st.labels && st.mode === 'rf' },
    { text: 'ядра черепных нервов', pos: V3(-0.45, -1.0, -0.6), color: '#FFA040', show: () => st.labels && (st.mode === 'floors' || st.mode === 'rf') },
    ...Object.entries(NUC).map(([id, N]) => ({ text: N.name, pos: N.pts[0].clone().add({ sn: V3(0.3, -0.25, 0.45), vta: V3(0.35, 0.3, 0.1), red: V3(-0.15, 0.3, 0.35), lc: V3(-0.2, 0.2, 0.4) }[id] || V3(0.05, 0.1, 0.15)), color: N.color, show: () => st.labels && st.mode === 'nuclei' })),
    { text: 'пирамидный путь', pos: V3(0.75, 0.6, 0.45), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'перекрёст пирамид', pos: V3(0.25, -2.6, 0.2), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'медиальная петля', pos: V3(0.15, -0.6, -0.4), color: '#4FA3FF', show: () => st.labels && st.mode === 'paths' },
    { text: 'верхние холмики', pos: SC[0].clone().add(V3(-0.1, 0.12, 0.15)), color: '#F2C14E', show: () => st.labels && st.mode === 'orient' },
    { text: 'нижние холмики', pos: IC[0].clone().add(V3(-0.1, -0.12, 0.15)), color: '#7FD6C8', show: () => st.labels && st.mode === 'orient' },
    { text: 'текто-спинальный путь', pos: V3(0.15, -1.0, -0.25), color: '#F2C14E', show: () => st.labels && st.mode === 'orient' },
    { text: 'поворот головы', pos: V3(2.6, -2.6, 0), show: () => st.labels && st.mode === 'orient' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'nuclei' && st.park ? TXT.park : TXT[st.mode]); };
    refs.modeSeg = seg(STEM_MODES, () => st.mode, (v) => setMode(v));
    const cb = toggle('Мозжечок', () => st.cere, (v) => { st.cere = v; cere.visible = v; });
    const pk = toggle('Паркинсон', () => st.park, (v) => { st.park = v; if (v && st.mode !== 'nuclei') setMode('nuclei'); refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { cb, pk, lab });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 460px' }, h('div', { class: 'glabel' }, 'Что показать', h('kbd', {}, '1–5')), h('div', { class: 'gctl' }, refs.modeSeg)),
      group('Опыт', 'F · P · C', button('Вспышка сбоку', orientGo, true), pk, cb), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const n = parseInt(e.key, 10); if (n >= 1 && n <= 5) { setMode(STEM_MODES[n - 1].id); return true; }
    const k = e.key.toLowerCase();
    if (k === 'f' || k === 'а') { orientGo(); return true; } if (k === 'p' || k === 'з') { refs.pk.click(); return true; } if (k === 'c' || k === 'с') { refs.cb.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { if (st.mode === 'rf') return [['Дыхание', 15, 'в мин'], ['Пульс', 70, 'уд/мин']]; return [['Продолговатый', '≈4', 'см'], ['Мост', '2,5–3', 'см']]; }
  setMode('floors');
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#9FE0C0',
    kicker: 'Мозг · стволовые структуры', title: 'Ствол мозга',
    lede: 'Продолговатый и средний мозг — древние отделы, общие для всех позвоночных; мост как отдельный отдел есть только у млекопитающих. Здесь центры дыхания и сердца, сна и бодрствования, и все пути между мозгом и телом.',
    notes: `
      <div><h2>Из чего состоит ствол</h2>
        <p><b>Продолговатый мозг</b> похож на усечённый конус длиной около 4 см (ширина от 1,5 до 2,5 см). Спереди — пирамиды и оливы, сзади — дно IV желудочка, ромбовидная ямка. <b>Мост</b> почти квадратный, 2,5–3 см; он обособляется только у млекопитающих вместе с корой и мозжечком: через собственные ядра моста кора сбрасывает в мозжечок копии двигательных программ. <b>Средний мозг</b> невелик, но важен: четверохолмие, водопровод с центральным серым веществом, красное ядро и чёрная субстанция.</p>
        <h3>Гены</h3>
        <p>Отделы ствола закладывают гомеозисные гены: Pax, Otx2, Wnt1, Gbx2, Fgf8, Shh, Hox. По новой классификации продолговатый мозг и мост собираются из 11 стереотипных блоков.</p>
        <h3>Эволюция</h3>
        <p>У рыб главный интегративный центр — средний мозг. У человека ствол по массе сильно уступает мозжечку и полушариям, но без него невозможны дыхание, работа сердца и само бодрствование.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Форма ствола: пирамиды, оливы, валик моста, ножки, четверохолмие, ромбовидная ямка.</li><li>Деление на основание, покрышку и крышу.</li><li>Положение голубого пятна, ядер шва, чёрной субстанции, вентральной покрышки и красного ядра.</li><li>Перекрёст пирамид и медиальной петли.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Ствол увеличен и вынут из мозга, ножки мозжечка показаны срезом.</li><li>Ритмы дыхания и сердца ускорены.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>5</code> режим</li><li><code>F</code> вспышка</li><li><code>P</code> Паркинсон</li><li><code>C</code> мозжечок</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeStem };
