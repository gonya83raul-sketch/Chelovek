// @scene joints makeJoints | Кости и суставы | @body Опора и движение
/* =========================================================
   ТЕЛО · КОСТИ И СУСТАВЫ: строение трубчатой кости (компактное и губчатое вещество, костный мозг,
   надкостница, хрящ, остеон), строение синовиального сустава и его болезни, шесть типов суставов на скелете
   по атласу Неттера (BP 4–7)
   ========================================================= */
function makeJoints() {
  rnd = mulberry(1101);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0xffc89f);
  const VIEW = { bone: [V3(-2.2, -2.6, 0), V3(1.8, -0.4, 24)], osteon: [V3(8.2, -1.4, 0), V3(10.6, 1.0, 10)], joint: [V3(38.9, -1.2, 0), V3(40.6, 0.6, 17.5)], types: [V3(81.5, 4.6, 0), V3(84.5, 7.0, 40)] };
  const VIEWM = { bone: [V3(0.5, -0.8, 0), V3(3.0, 0.8, 24)], osteon: [V3(9.0, -0.4, 0), V3(11, 1.4, 10.5)], joint: [V3(40, 0.2, 0), V3(41.2, 1.4, 14)], types: [V3(85.5, 9.0, 0), V3(88, 10.5, 42)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300);
  const controls = makeControls(camera, VIEW.bone[0]); controls.minDistance = 2; controls.maxDistance = 70;
  const fx = new Sparks(800, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const flat = (col, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.6), roughness: 0.55, emissive: col, emissiveIntensity: o.e ?? 0.05, side: THREE.DoubleSide, ...o.m });
  const IVORY = '#EDE0C4', CART = '#9FD8E8', RED = '#C8485A', YEL = '#F2D27A';

  /* ---------- 1. трубчатая кость (продольный распил) ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const TOP = 4.15, rOut = (y) => { const a = Math.abs(y); if (a > 3.4) return Math.sqrt(Math.max(0, 1 - ((a - 3.4) / 0.75) ** 2)) * 1.0; return 0.42 + 0.58 * smooth(2.2, 3.4, a); };
  const rIn = (y) => { const a = Math.abs(y); return a < 2.35 ? 0.27 : Math.max(0, 0.27 * (1 - (a - 2.35) / 0.4)); };
  const NY = 120, YS = Array.from({ length: NY + 1 }, (_, i) => -TOP + (2 * TOP * i) / NY);
  const lathe = (fn, y0, y1, mat, dr = 0) => { const pts = YS.filter((y) => y >= y0 - 1e-6 && y <= y1 + 1e-6).map((y) => new THREE.Vector2(Math.max(0.001, fn(y) + dr), y)); const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 48, Math.PI / 2, Math.PI), mat); G1.add(m); return m; };
  const outerM = lathe(rOut, -TOP, TOP, flat(IVORY, { k: 0.55 }));
  const perioM = lathe(rOut, -3.45, 3.45, flat('#E8A0A8', { k: 0.5, m: { transparent: true, opacity: 0.35, depthWrite: false } }), 0.035);
  const cartM = [lathe(rOut, 3.55, TOP, flat(CART, { k: 0.55, e: 0.1, m: { transparent: true, opacity: 0.85 } }), 0.04), lathe(rOut, -TOP, -3.55, flat(CART, { k: 0.55, e: 0.1, m: { transparent: true, opacity: 0.85 } }), 0.04)];
  // поверхность распила
  const shapeOf = (pts) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); return s; };
  const face = (pts, col, z, o = {}) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(shapeOf(pts)), flat(col, { k: o.k ?? 0.6, e: o.e ?? 0.06, m: { polygonOffset: true, polygonOffsetFactor: -z * 4, polygonOffsetUnits: -z * 4 } })); m.position.z = z * 0.002; G1.add(m); return m; };
  const contour = (fn, y0, y1, d = 0) => { const R = YS.filter((y) => y >= y0 && y <= y1).map((y) => [fn(y) + d, y]); return [...R, ...R.slice().reverse().map(([x, y]) => [-x, y])]; };
  const faceBone = face(contour(rOut, -TOP, TOP), IVORY, 1, { k: 0.62 });
  const marrowR = [contour((y) => Math.max(0, rOut(y) - 0.07), 2.35, TOP - 0.06), contour((y) => Math.max(0, rOut(y) - 0.07), -TOP + 0.06, -2.35)].map((p) => face(p, '#B8485A', 2, { k: 0.45, e: 0.08 }));
  const marrowY = face(contour(rIn, -2.7, 2.7), YEL, 3, { k: 0.55, e: 0.08 });
  const cartF = [face([...YS.filter((y) => y >= 3.55).map((y) => [rOut(y) + 0.045, y]), ...YS.filter((y) => y >= 3.55).reverse().map((y) => [rOut(y) - 0.01, y])], CART, 4, { e: 0.15 }), face([...YS.filter((y) => y >= 3.55).map((y) => [-(rOut(y) + 0.045), y]), ...YS.filter((y) => y >= 3.55).reverse().map((y) => [-(rOut(y) - 0.01), y])], CART, 4, { e: 0.15 })];
  [1, -1].forEach((s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2 * rOut(2.75) - 0.12, 0.04), new THREE.MeshBasicMaterial({ color: '#FFF4D8', transparent: true, opacity: 0.7 })); m.position.set(0, s * 2.75, 0.012); G1.add(m); });
  // губчатое вещество: трабекулы
  const TRB = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5), flat(IVORY, { k: 0.7, e: 0.05 }), 900);
  const trbData = []; const dmy = new THREE.Object3D();
  for (let i = 0; i < 900; i++) { const s = i % 2 ? 1 : -1; let y, x, z; do { y = s * rand(2.4, TOP - 0.1); const r = rOut(y) - 0.08; x = rand(-r, r); z = -rand(0.02, Math.sqrt(Math.max(0, r * r - x * x))); } while (!isFinite(z)); const len = rand(0.18, 0.38); trbData.push({ p: V3(x, y, z), q: new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), randUnit()), len }); }
  const setTrb = (op) => { trbData.forEach((d, i) => { const keep = !op || i % 5 < 2; dmy.position.copy(d.p); dmy.quaternion.copy(d.q); dmy.scale.set(keep ? (op ? 0.011 : 0.022) : 0, keep ? d.len : 0, keep ? (op ? 0.011 : 0.022) : 0); dmy.updateMatrix(); TRB.setMatrixAt(i, dmy.matrix); }); TRB.instanceMatrix.needsUpdate = true; };
  setTrb(false); G1.add(TRB);
  const artC = new THREE.CatmullRomCurve3([V3(1.6, 0.9, 0.3), V3(0.8, 0.55, -0.1), V3(0.42, 0.35, -0.2), V3(0.15, 0.1, -0.15), V3(0.0, -0.6, -0.12)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(artC, 50, 0.035, 8), flat('#D84A50', { e: 0.15 })));
  // остеон (вставка справа)
  const OS = new THREE.Group(); OS.position.set(9.0, -0.6, 0); G1.add(OS);
  const LAM = ['#EDE0C4', '#E2D2B0', '#EDE0C4', '#E2D2B0', '#EDE0C4'];
  const OSP = [[0, 0], [1.1, 0.25], [-1.0, 0.35], [0.4, -1.0], [-0.6, -1.0], [1.3, -0.85]];
  OSP.forEach(([x, z], k) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); OS.add(g);
    LAM.forEach((col, j) => { const r = 0.12 + j * 0.09; const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.4 - j * 0.12, 32, 1, true, 0, Math.PI * 1.55), flat(col, { k: 0.55 + j * 0.03, e: 0.04 })); m.rotation.y = 0.3 + k; g.add(m); });
    [['#D84A50', 0.035, -0.04], ['#5B6CFF', 0.04, 0.05], ['#F2E08A', 0.02, 0.0]].forEach(([col, r, dx]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.7, 10), flat(col, { e: 0.2 })); m.position.set(dx, 0, dx * 0.5); g.add(m); });
    for (let j = 0; j < 14; j++) { const a = rand(0, Math.PI * 1.5) + 0.3 + k, r = 0.16 + Math.floor(rand(0, 4)) * 0.09 + 0.045; const c = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), flat('#7A5CC8', { e: 0.25 })); c.scale.set(1, 0.6, 1.6); c.position.set(Math.sin(a) * r, rand(-1.0, 1.0), Math.cos(a) * r); g.add(c); }
  });
  const volk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 10), flat('#D84A50', { e: 0.15 })); volk.rotation.z = Math.PI / 2 - 0.22; volk.position.set(0.55, 0.4, 0.12); OS.add(volk);
  const blk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 2.4), glassMat('#FFE8C0', { rim: 0.5, base: 0.03, keep: true })); blk.position.set(0.15, 0, -0.3); OS.add(blk);

  /* ---------- 2. синовиальный сустав (срез) ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const ext = (shape, col, depth, z, o = {}) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 48 }); g.translate(0, 0, z - depth / 2); const m = new THREE.Mesh(g, o.mat || flat(col, { k: o.k ?? 0.55, e: o.e ?? 0.05, m: o.m })); return m; };
  const UPC = V3(0, 1.6, 0);   // центр вращения верхней кости
  const upper = new THREE.Group(); upper.position.copy(UPC); G2.add(upper);
  const upShape = (R) => { const s = new THREE.Shape(); s.moveTo(-R, 2.6); s.lineTo(-R, 0); s.absarc(0, 0, R, Math.PI, 2 * Math.PI, false); s.lineTo(R, 2.6); s.closePath(); return s; };
  const bandShape = (R0, R1, a0, a1) => { const s = new THREE.Shape(); s.absarc(0, 0, R1, a0, a1, false); s.absarc(0, 0, R0, a1, a0, true); s.closePath(); return s; };
  const upBone = ext(upShape(0.88), IVORY, 1.1, 0, { k: 0.6 }); upper.add(upBone);
  const upMarrow = ext((() => { const s = new THREE.Shape(); s.moveTo(-0.7, 2.6); s.lineTo(-0.7, 0); s.absarc(0, 0, 0.7, Math.PI, 2 * Math.PI, false); s.lineTo(0.7, 2.6); s.closePath(); return s; })(), '#B8485A', 1.0, 0.07, { k: 0.4, e: 0.06 }); upper.add(upMarrow);
  const upCart = ext(bandShape(0.86, 1.0, Math.PI + 0.12, 2 * Math.PI - 0.12), CART, 1.1, 0, { e: 0.12 }); upper.add(upCart);
  const LR = 3.25, LCY = -0.25 + LR;   // нижняя кость: вогнутая площадка
  const lowY = (x) => LCY - Math.sqrt(LR * LR - x * x);
  const loShape = (top) => { const s = new THREE.Shape(); s.moveTo(-1.3, -2.6); s.lineTo(1.3, -2.6); for (let i = 0; i <= 40; i++) { const x = 1.3 - 2.6 * i / 40; s.lineTo(x, lowY(x) + top); } s.closePath(); return s; };
  const lower = new THREE.Group(); G2.add(lower);
  const loBone = ext(loShape(0), IVORY, 1.1, 0, { k: 0.6 }); lower.add(loBone);
  const loCartShape = (th) => { const s = new THREE.Shape(); for (let i = 0; i <= 40; i++) { const x = -1.2 + 2.4 * i / 40; i ? s.lineTo(x, lowY(x) + th) : s.moveTo(x, lowY(x) + th); } for (let i = 40; i >= 0; i--) { const x = -1.2 + 2.4 * i / 40; s.lineTo(x, lowY(x) - 0.01); } s.closePath(); return s; };
  let loCart = ext(loCartShape(0.14), CART, 1.1, 0, { e: 0.12 }); lower.add(loCart);
  // жидкость, синовиальная оболочка, капсула, связки
  const fluidMat = new THREE.MeshPhysicalMaterial({ color: 0x3060a0, emissive: 0x7fd6ff, emissiveIntensity: 0.12, transparent: true, opacity: 0.38, depthWrite: false, roughness: 0.1 });
  const fluidShape = (bulge) => { const s = new THREE.Shape(); const w = 1.42 + bulge; s.moveTo(-w, -0.05); for (let i = 0; i <= 30; i++) { const x = -1.2 + 2.4 * i / 30; s.lineTo(x, lowY(x) + 0.12); } s.lineTo(w, -0.05); s.quadraticCurveTo(w + bulge * 0.6, 1.0, w, 2.0); s.lineTo(0.95, 2.0); s.lineTo(0.95, 1.6); for (let i = 0; i <= 30; i++) { const a = -0.0 - Math.PI * i / 30; s.lineTo(Math.cos(a) * 1.0, 1.6 + Math.sin(a) * 1.0); } s.lineTo(-0.95, 2.0); s.lineTo(-w, 2.0); s.quadraticCurveTo(-w - bulge * 0.6, 1.0, -w, -0.05); return s; };
  let fluid = ext(fluidShape(0), null, 0.95, 0, { mat: fluidMat }); G2.add(fluid);
  const synMat = flat('#E87A8A', { k: 0.55, e: 0.1 });
  const sideStrip = (x0, x1, y0, y1, mat) => { const s = new THREE.Shape(); s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1); s.closePath(); const m = ext(s, null, 1.1, 0, { mat }); G2.add(m); return m; };
  const syn = [sideStrip(-1.5, -1.42, -0.15, 2.05, synMat), sideStrip(1.42, 1.5, -0.15, 2.05, synMat)];
  const synRA = [sideStrip(-1.5, -1.26, -0.15, 2.05, synMat), sideStrip(1.26, 1.5, -0.15, 2.05, synMat)]; synRA.forEach((m) => { m.visible = false; });
  const capMat = flat('#F0EEE6', { k: 0.6, e: 0.04 });
  const cap = [sideStrip(-1.64, -1.5, -0.6, 2.45, capMat), sideStrip(1.5, 1.64, -0.6, 2.45, capMat)];
  const ligMat = flat('#D8D4C8', { k: 0.5, e: 0.03 });
  const lig = [sideStrip(-1.82, -1.68, -1.3, 2.8, ligMat), sideStrip(1.68, 1.82, -1.3, 2.8, ligMat)];
  // болезни
  const OST = []; [[-1.28, 0.05, 2.4], [1.28, 0.05, -2.4], [-0.9, 1.0, 2.0], [0.9, 1.0, -2.0]].forEach(([x, y, rz], k) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.32, 10), flat(IVORY, { k: 0.7 })); m.position.set(x, y, 0.2); m.rotation.z = rz; (k < 2 ? lower : upper).add(m); if (k >= 2) m.position.sub(UPC); OST.push(m); });
  const PAN = []; [-1, 1].forEach((s) => { for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(blobGeo(0.16, 0.13, 0.4, 40 + k, 0.25, 3), flat('#D8404A', { k: 0.6, e: 0.25 })); m.position.set(s * (1.32 - k * 0.07), -0.05 + k * 0.42, 0.1); m.visible = false; G2.add(m); PAN.push(m); } });
  const XT = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 5), new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), 70); const xtd = [];
  for (let i = 0; i < 70; i++) { const side = i % 3; const p = side === 0 ? V3(rand(-0.8, 0.8), rand(0.05, 0.3), rand(-0.4, 0.4)) : V3((side === 1 ? -1 : 1) * rand(1.1, 1.38), rand(0.1, 1.8), rand(-0.4, 0.4)); xtd.push({ p, q: new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), randUnit()) }); }
  G2.add(XT); XT.visible = false;
  xtd.forEach((d, i) => { dmy.position.copy(d.p); dmy.quaternion.copy(d.q); dmy.scale.setScalar(1); dmy.updateMatrix(); XT.setMatrixAt(i, dmy.matrix); });

  /* ---------- 3. типы суставов ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const skelMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d8bb, roughness: 0.62, clearcoat: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, transparent: true, opacity: 0.55, depthWrite: false });
  const skel = new THREE.Group(); G3.add(skel);
  const st = { t: 0, mode: 'bone', labels: true, rot: false, fly: null, msg: null, err: null, view: 'bone', op: false, jd: 'norm', flex: 0, typ: 'ball' };
  loadSkeletonStatic(skel, skelMat).catch((e) => { st.err = e.message; refs.setInfo && refs.setInfo(); });
  const J = Object.fromEntries(Object.entries(SKEL_META.joints).map(([k, v]) => [k, V3(...v)]));
  const TYPES = {
    ball: { name: 'Шаровидный', col: '#FF8A5C', ax: 3, at: [J.shL, J.shR, J.hpL, J.hpR] },
    hinge: { name: 'Блоковидный', col: '#7FD6FF', ax: 1, at: [J.elL, J.elR, J.knL, J.knR, J.anL, J.anR, J.hdL.clone().add(V3(0.05, -0.75, 0.15))] },
    pivot: { name: 'Цилиндрический', col: '#F2C14E', ax: 1, at: [J.C1.clone().add(V3(0, -0.3, -0.1)), J.elL.clone().add(V3(0.18, -0.3, 0.05)), J.elR.clone().add(V3(-0.18, -0.3, 0.05))] },
    ellip: { name: 'Эллипсовидный', col: '#7FE0A0', ax: 2, at: [J.wrL, J.wrR, J.hdL.clone().add(V3(0.0, -0.25, 0.15))] },
    saddle: { name: 'Седловидный', col: '#C77DFF', ax: 2, at: [J.wrL.clone().add(V3(0.2, -0.4, 0.2)), J.wrR.clone().add(V3(-0.2, -0.4, 0.2))] },
    plane: { name: 'Плоский', col: '#FF8AB0', ax: 0, at: [J.wrL.clone().add(V3(0.0, -0.22, 0.05)), V3(0.3, 12.6, -0.55), V3(-0.2, 12.6, -0.55), J.shL.clone().add(V3(-0.25, 0.38, 0.1))] },
  };
  Object.values(TYPES).forEach((T) => { T.marks = T.at.map((p) => glowNucleus(G3, p, T.col, 0.07, 9)); });
  // механические модели
  const MOD = new THREE.Group(); G3.add(MOD);
  const mm = (col, o = {}) => flat(col, { k: 0.6, e: 0.08, ...o });
  const slot = { ball: V3(6.6, 15.2, 0), hinge: V3(10.4, 15.2, 0), pivot: V3(6.6, 11.0, 0), ellip: V3(10.4, 11.0, 0), saddle: V3(6.6, 6.8, 0), plane: V3(10.4, 6.8, 0) };
  const M = {};
  Object.entries(slot).forEach(([k, p]) => { const g = new THREE.Group(); g.position.copy(p); MOD.add(g); M[k] = { g, mov: new THREE.Group() }; g.add(M[k].mov); });
  const axisLine = (g, dir, col) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8 })); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize()); g.add(m); return m; };
  const shaft = (len, col, r = 0.16) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20), mm(col)); m.position.y = len / 2; return m; };
  { // шаровидный
    const T = M.ball; const cup = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 16, 0, Math.PI * 2, Math.PI / 2 - 0.2, Math.PI / 2 + 0.2), mm(IVORY)); T.g.add(cup); const base = shaft(1.0, IVORY, 0.3); base.position.y = -1.05; T.g.add(base);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 20), mm('#FFB08A')); T.mov.add(ball, shaft(1.6, '#FFB08A'));
    ['#FF5A5A', '#7FE0A0', '#5B8CFF'].forEach((c, i) => axisLine(T.g, [V3(1, 0, 0), V3(0, 1, 0), V3(0, 0, 1)][i], c));
  }
  { // блоковидный
    const T = M.hinge; const fork = new THREE.Group(); [-0.5, 0.5].forEach((x) => { const pl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.9), mm(IVORY)); pl.position.set(x, -0.2, 0); fork.add(pl); }); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.6; fork.add(bs); T.g.add(fork);
    const tro = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.84, 28), mm('#9FE0FF')); tro.rotation.z = Math.PI / 2; T.mov.add(tro, shaft(1.7, '#9FE0FF'));
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A');
  }
  { // цилиндрический
    const T = M.pivot; const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 14, 36), mm(IVORY)); ring.rotation.x = Math.PI / 2; T.g.add(ring); const bs = shaft(1.0, IVORY, 0.25); bs.position.set(0.55, -1.0, 0); T.g.add(bs);
    const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.0, 24), mm('#FFE08A')); peg.position.y = 0.2; const key = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.5), mm('#FF8A5C')); key.position.set(0, 1.05, 0.3); T.mov.add(peg, key);
    axisLine(T.g, V3(0, 1, 0), '#5B8CFF');
  }
  { // эллипсовидный
    const T = M.ellip; const cup = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 16, 0, Math.PI * 2, Math.PI / 2 - 0.15, Math.PI / 2 + 0.15), mm(IVORY)); cup.scale.set(1.5, 0.6, 1); T.g.add(cup); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.0; T.g.add(bs);
    const el = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 20), mm('#9FF0B8')); el.scale.set(1.45, 0.62, 0.9); T.mov.add(el, shaft(1.6, '#9FF0B8'));
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); axisLine(T.g, V3(0, 0, 1), '#7FE0A0');
  }
  { // седловидный
    const T = M.saddle; const sad = (k) => { const g = new THREE.PlaneGeometry(1.4, 1.4, 20, 20); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, k * 0.35 * (x * x - y * y)); } g.rotateX(-Math.PI / 2); g.computeVertexNormals(); return g; };
    const low = new THREE.Mesh(sad(1), mm(IVORY)); T.g.add(low); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.1; T.g.add(bs);
    const up = new THREE.Mesh(sad(1), mm('#E0B0FF')); up.rotation.y = Math.PI / 2; up.position.y = 0.04; const us = shaft(1.6, '#E0B0FF'); us.position.y = 0.95; T.mov.add(up, us);
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); axisLine(T.g, V3(0, 0, 1), '#7FE0A0');
  }
  { // плоский
    const T = M.plane; const low = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.2), mm(IVORY)); low.position.y = -0.17; T.g.add(low);
    const up = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.0), mm('#FFB0C8')); up.position.y = 0.17; T.mov.add(up);
  }

  /* ---------- состояние ---------- */
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['bone', 'joint', 'types'][k] === m; }); const v = VV(m === 'bone' ? st.view : m); st.fly = flyTarget(v[0], v[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setJd(v) {
    st.jd = v;
    const oa = v === 'oa', ra = v === 'ra', gout = v === 'gout';
    lower.remove(loCart); loCart = ext(loCartShape(oa ? 0.05 : ra ? 0.09 : 0.14), CART, 1.1, 0, { e: 0.12 }); lower.add(loCart);
    upCart.scale.setScalar(1); upCart.geometry.dispose(); upCart.geometry = ext(bandShape(0.86, oa ? 0.92 : ra ? 0.96 : 1.0, Math.PI + 0.12, 2 * Math.PI - 0.12), CART, 1.1, 0).geometry;
    OST.forEach((m) => { m.visible = oa; });
    PAN.forEach((m) => { m.visible = ra; });
    G2.remove(fluid); fluid = ext(fluidShape(ra || gout ? 0.18 : 0), null, 0.95, 0, { mat: fluidMat }); G2.add(fluid);
    fluidMat.emissive.set(ra || gout ? '#FFB0A0' : '#7FD6FF');
    synMat.color.set(ra || gout ? '#D8404A' : '#E87A8A').multiplyScalar(0.55); synMat.emissiveIntensity = ra || gout ? 0.3 : 0.1; syn.forEach((m) => { m.visible = !ra; }); synRA.forEach((m) => { m.visible = ra; });
    XT.visible = gout;
    loBone.material.color.set(oa ? '#D8C8A0' : IVORY).multiplyScalar(0.6);
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'joint') {
      const amp = st.jd === 'oa' ? 0.18 : st.jd === 'ra' || st.jd === 'gout' ? 0.12 : 0.45;
      const a = amp * Math.sin(t * 1.2); upper.rotation.z = a;
      if (st.jd === 'oa' && Math.abs(Math.cos(t * 1.2)) > 0.97 && rnd() < 0.3) fx.spawn(G2.localToWorld(V3(rand(-0.6, 0.6), 0.25, 0.6)), V3(0, 0.3, 0.3), C.set('#FFE0A0'), 0.4, 0.5, 1);
      PAN.forEach((m, i) => { m.scale.setScalar(1 + 0.08 * Math.sin(t * 3 + i)); });
    }
    if (st.mode === 'types') {
      const s = Math.sin(t * 1.4), c = Math.cos(t * 1.4);
      M.ball.mov.rotation.set(0.45 * s, t * 0.8, 0.45 * c);
      M.hinge.mov.rotation.x = 0.9 * (s * 0.5 + 0.5) - 0.2;
      M.pivot.mov.rotation.y = 1.2 * s;
      M.ellip.mov.rotation.set(0.4 * s, 0, 0.35 * Math.sin(t * 0.9));
      M.saddle.mov.rotation.set(0.3 * s, 0, 0.3 * Math.sin(t * 0.8));
      M.plane.mov.position.set(0.18 * s, 0, 0.12 * Math.sin(t * 0.9));
      Object.entries(TYPES).forEach(([k, T]) => { const on = k === st.typ; M[k].g.scale.setScalar(on ? 1.18 : 0.88); M[k].g.traverse((o) => { if (o.material && o.material.emissiveIntensity !== undefined) o.material.emissiveIntensity = on ? 0.2 : 0.04; }); T.marks.forEach((g, i) => { g.spr.material.opacity = on ? 0.7 + 0.3 * Math.sin(t * 4 + i) : 0.12; g.spr.scale.setScalar(on ? 0.9 : 0.45); g.core.visible = on; }); });
    }
    fx.update(dt);
  }

  const TXT = {
    bone: '<b>Трубчатая кость</b> (здесь — схема бедренной) на продольном распиле. Стержень — <b>диафиз</b>: толстая стенка из <b>компактного вещества</b>, внутри — костномозговой канал с <b>жёлтым (жировым) костным мозгом</b>. Концы — <b>эпифизы</b>: тонкий слой компактного вещества, внутри — <b>губчатое</b>: сеть перекладин-трабекул, выстроенных вдоль линий нагрузки, между ними — <b>красный костный мозг</b>, где у взрослых делаются клетки крови (ещё — в плоских костях: грудине, тазе, позвонках). Суставные поверхности покрыты <b>гиалиновым хрящом</b>, остальное — <b>надкостницей</b> (по ней кость растёт в толщину и срастается после перелома). Белая линия — след <b>пластинки роста</b> (эпифизарная линия). Сквозь стенку входит <b>питательная артерия</b>.',
    osteon: '<b>Остеон</b> (гаверсова система) — единица компактного вещества: 4–20 концентрических <b>пластинок</b> из коллагена и кристаллов гидроксиапатита вокруг <b>центрального канала</b> с артерией, веной и нервом. Между пластинками в лакунах сидят <b>остеоциты</b> (фиолетовые) — бывшие остеобласты, замурованные в кость; они связаны отростками в тонких канальцах и чувствуют нагрузку. Поперечные <b>фолькмановы каналы</b> соединяют соседние остеоны. Кость на 2/3 — минерал (прочность на сжатие), на 1/3 — коллаген I типа (гибкость).',
    op: '<b>Остеопороз</b>: разрушение кости (остеокласты) обгоняет построение (остеобласты) — особенно после менопаузы, когда исчезают эстрогены, при лечении глюкокортикоидами, малоподвижности. Трабекул меньше, они тоньше и теряют связи, компактный слой истончается. Типичные переломы — шейка бедра, позвонки (компрессионные), лучевая кость у запястья. Диагноз — денситометрия; лечат кальцием с витамином D, бисфосфонатами, деносумабом. См. тему «Кальций: паратгормон и витамин D».',
    norm: '<b>Синовиальный сустав</b> на срезе. Концы костей покрыты гладким <b>гиалиновым хрящом</b> (голубой) — в нём нет сосудов и нервов, питание идёт из <b>синовиальной жидкости</b>. Жидкость (гиалуроновая кислота + лубрицин) — смазка: коэффициент трения в суставе меньше, чем у льда по льду. Её выделяет <b>синовиальная оболочка</b> (розовая), выстилающая полость. Снаружи — плотная <b>фиброзная капсула</b> и <b>связки</b>, ограничивающие лишние движения. Кость сгибается — хрящи скользят друг по другу.',
    oa: '<b>Остеоартроз</b> — самая частая болезнь суставов: хрящ изнашивается и истончается (с возрастом, после травм, при лишнем весе), суставная щель сужается, под хрящом кость уплотняется, по краям вырастают костные шипы — <b>остеофиты</b>. Движения ограничены, хруст (искры), боль при нагрузке, утренняя скованность короткая. Лечат движением и снижением веса, обезболивающими, при разрушении — эндопротезированием.',
    ra: '<b>Ревматоидный артрит</b> — аутоиммунное воспаление синовиальной оболочки: она утолщается и разрастается в агрессивную ткань — <b>паннус</b> (красный), который наползает на хрящ и разъедает кость по краям (эрозии). Жидкости больше (выпот), сустав опухший, горячий, утренняя скованность больше часа; поражаются симметрично мелкие суставы кистей и стоп. Лечат метотрексатом и биологическими препаратами (ингибиторы ФНО-α и др.).',
    gout: '<b>Подагра</b>: при избытке мочевой кислоты в суставной жидкости выпадают иглы кристаллов <b>урата натрия</b> (белые). Нейтрофилы атакуют кристаллы, и за ночь развивается приступ острейшего воспаления — чаще всего в суставе большого пальца стопы. Под микроскопом в поляризованном свете кристаллы светятся. Подробно о мочевой кислоте — тема «Нуклеотиды и подагра».',
  };
  const TYTXT = {
    ball: '<b>Шаровидный сустав</b> — шаровидная головка во впадине: движения вокруг <b>трёх осей</b> (сгибание-разгибание, отведение-приведение, вращение) и круговые. <b>Плечевой</b> сустав — самый подвижный в теле (впадина мелкая), зато и вывихивается чаще всех. <b>Тазобедренный</b> — головка глубоко во впадине (вертлужной), он прочнее и устойчивее, но подвижен меньше.',
    hinge: '<b>Блоковидный сустав</b> — валик (блок) в вырезке: движения вокруг <b>одной оси</b> — сгибание и разгибание. Примеры: плечелоктевой, межфаланговые суставы пальцев, голеностопный. <b>Коленный</b> — самый крупный сустав, мыщелковый: в согнутом положении в нём возможно и небольшое вращение; внутри — мениски и крестообразные связки.',
    pivot: '<b>Цилиндрический (вращательный) сустав</b> — вращение вокруг <b>одной продольной оси</b>. Зуб второго шейного позвонка вращается в кольце атланта — так мы поворачиваем голову «нет». Проксимальный и дистальный лучелоктевые суставы вращают предплечье: ладонь вниз (пронация) и вверх (супинация).',
    ellip: '<b>Эллипсовидный (мыщелковый) сустав</b> — овальная головка в овальной ямке: <b>две оси</b> — сгибание-разгибание и отведение-приведение, вращения нет. Примеры: лучезапястный сустав, пястно-фаланговые суставы пальцев.',
    saddle: '<b>Седловидный сустав</b> — две «сёдла», повёрнутые друг к другу под прямым углом: <b>две оси</b>, и при их сочетании — круговое движение. Главный пример — запястно-пястный сустав большого пальца: благодаря ему большой палец противопоставляется остальным — основа хватательной кисти человека. Здесь же часто начинается артроз.',
    plane: '<b>Плоский сустав</b> — почти плоские поверхности, возможны лишь небольшие скольжения. Примеры: суставы между костями запястья и предплюсны, дугоотростчатые (фасеточные) суставы позвонков, акромиально-ключичный. Каждый двигается мало, но вместе они дают гибкость кисти, стопе и позвоночнику.',
  };
  const L1 = () => st.labels && st.mode === 'bone' && st.view === 'bone', L1o = () => st.labels && st.mode === 'bone' && st.view === 'osteon', L2 = () => st.labels && st.mode === 'joint', L3 = () => st.labels && st.mode === 'types';
  const labels = [
    { text: 'суставной хрящ', pos: V3(0.7, 4.25, 0.3), color: CART, show: L1 },
    { text: 'эпифиз: губчатое вещество', pos: V3(1.1, 3.3, 0.3), color: IVORY, show: L1 },
    { text: 'красный костный мозг', pos: V3(-2.6, 3.0, 0.3), color: '#E07080', show: L1 },
    { text: 'эпифизарная линия', pos: V3(1.0, 2.75, 0.3), color: '#FFF4D8', show: L1 },
    { text: 'диафиз: компактное вещество', pos: V3(0.55, 1.6, 0.3), color: IVORY, show: L1 },
    { text: 'жёлтый костный мозг', pos: V3(-2.4, -0.6, 0.3), color: YEL, show: L1 },
    { text: 'питательная артерия', pos: V3(1.65, 0.95, 0.4), color: '#FF6A6A', show: L1 },
    { text: 'надкостница', pos: V3(0.6, -1.6, 0.3), color: '#E8A0A8', show: L1 },
    { text: 'остеон →', pos: V3(5.4, 0.4, 0.3), color: '#EDE0C4', show: L1 },
    { text: 'пластинки', pos: V3(9.0 + 0.55, -0.6 + 1.35, 0.2), color: IVORY, show: L1o },
    { text: 'центральный канал: артерия, вена, нерв', pos: V3(9.0 - 0.1, -0.6 + 1.6, 0.3), color: '#FF6A6A', show: L1o },
    { text: 'остеоциты', pos: V3(9.0 - 1.3, -0.6 + 0.2, 0.6), color: '#9F7BFF', show: L1o },
    { text: 'фолькманов канал', pos: V3(9.0 + 0.9, -0.6 + 0.75, 0.4), color: '#FF6A6A', show: L1o },
    { text: 'гиалиновый хрящ', pos: V3(40 - 2.9, 0.75, 0.6), color: CART, show: L2 },
    { text: 'синовиальная жидкость', pos: V3(40 + 0.15, 0.15, 0.7), color: '#7FD6FF', show: L2 },
    { text: 'синовиальная оболочка', pos: V3(40 - 3.5, 1.6, 0.6), color: '#E87A8A', show: L2 },
    { text: 'фиброзная капсула', pos: V3(40 + 1.75, 2.2, 0.6), color: '#F0EEE6', show: L2 },
    { text: 'связка', pos: V3(40 + 1.9, -1.0, 0.6), color: '#D8D4C8', show: L2 },
    { text: 'кость', pos: V3(40 - 0.25, 3.6, 0.7), color: IVORY, show: L2 },
    { text: 'остеофиты', pos: V3(40 - 2.2, -0.35, 0.6), color: IVORY, show: () => L2() && st.jd === 'oa' },
    { text: 'паннус', pos: V3(40 - 2.4, 0.4, 0.6), color: '#FF6A6A', show: () => L2() && st.jd === 'ra' },
    { text: 'кристаллы урата', pos: V3(40 - 0.6, 0.45, 0.7), color: '#FFFFFF', show: () => L2() && st.jd === 'gout' },
    ...Object.entries(TYPES).map(([k, T]) => ({ text: T.name + (T.ax ? ` · осей: ${T.ax}` : ' · скольжение'), pos: slot[k].clone().add(V3(80 - 1.0, -1.55, 0.6)), color: T.col, show: L3 })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'bone' ? (st.op ? TXT.op : TXT[st.view]) : st.mode === 'joint' ? TXT[st.jd] : TYTXT[st.typ];
      if (st.err && st.mode === 'types') s += '<br><br><i>Модель скелета не загрузилась: ' + st.err + '</i>';
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'bone', label: 'Строение кости' }, { id: 'joint', label: 'Сустав' }, { id: 'types', label: 'Типы суставов' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'bone') box.append(h('div', { class: 'glabel' }, 'Показать'), h('div', { class: 'gctl' }, seg([{ id: 'bone', label: 'Кость целиком' }, { id: 'osteon', label: 'Остеон' }], () => st.view, (v) => { st.view = v; const vv = VV(v); st.fly = flyTarget(vv[0], vv[1]); refs.setInfo(); }), toggle('Остеопороз', () => st.op, (v) => { st.op = v; setTrb(v); faceBone.material.color.set(v ? '#C8B898' : IVORY).multiplyScalar(0.62); refs.setInfo(); })));
      else if (st.mode === 'joint') box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Норма' }, { id: 'oa', label: 'Остеоартроз' }, { id: 'ra', label: 'Ревматоидный артрит' }, { id: 'gout', label: 'Подагра' }], () => st.jd, (v) => { setJd(v); refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Тип сустава'), h('div', { class: 'gctl' }, seg(Object.entries(TYPES).map(([id, T]) => ({ id, label: T.name, color: T.col })), () => st.typ, (v) => { st.typ = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['bone', 'joint', 'types'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'bone') return st.view === 'osteon' ? [['Диаметр остеона', '0,1–0,4', 'мм'], ['Минерал / коллаген', '65 / 35', '%']] : [['Костей у взрослого', 206, ''], ['Плотность трабекул', st.op ? 40 : 100, '%']];
    if (st.mode === 'joint') return [['Суставная щель', st.jd === 'oa' ? 'сужена' : st.jd === 'ra' || st.jd === 'gout' ? 'выпот' : 'норма', ''], ['Объём движения', st.jd === 'oa' ? 40 : st.jd === 'norm' ? 100 : 30, '%']];
    const T = TYPES[st.typ]; return [['Осей движения', T.ax || '—', ''], ['Примеров на скелете', T.at.length, '']];
  }
  const self = {
    mobZoom: 0.75, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F2D27A',
    kicker: 'Тело · опора и движение', title: 'Кости и суставы',
    lede: 'Кость — живая ткань прочнее бетона на сжатие и легче стали, а сустав скользит с трением меньше, чем лёд по льду.',
    notes: `
      <div><h2>Кости</h2>
        <p>У взрослого 206 костей: осевой скелет (череп, позвоночник, рёбра, грудина) и добавочный (пояса и свободные конечности). По форме — трубчатые, губчатые (короткие), плоские, смешанные; сесамовидные лежат в сухожилиях (надколенник).</p>
        <ul><li><b>Клетки</b>: остеобласты строят, остеоциты контролируют, остеокласты разрушают; кость перестраивается всю жизнь (≈10% скелета в год).</li><li><b>Рост в длину</b> — в эпифизарной пластинке (хрящ), в толщину — от надкостницы.</li><li><b>Костный мозг</b>: красный — кроветворный, жёлтый — жировой.</li></ul>
        <h3>Соединения костей</h3><ul><li><b>Фиброзные</b>: швы черепа, синдесмозы, вколачивания (зубы).</li><li><b>Хрящевые</b>: межпозвонковые диски, лобковый симфиз, пластинки роста.</li><li><b>Синовиальные</b> (суставы): хрящ, полость с жидкостью, синовиальная оболочка, капсула, связки; бывают диски и мениски.</li></ul>
        <h3>Типы суставов по форме</h3><p>Одноосные — блоковидный, цилиндрический; двуосные — эллипсовидный, седловидный, мыщелковый; многоосные — шаровидный, плоский (скольжение).</p></div>
      <div><h2>Условности</h2><ul><li>Кость, сустав и модели суставов — схемы, не в масштабе; трабекулы расположены случайно, а не по линиям нагрузки.</li><li>Скелет — настоящая 3D-модель (Sketchfab, CC BY); точки суставов поставлены приблизительно.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('bone'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
