import { SKEL_META, Sparks, THREE, V3, __set_rnd, envTex, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, makeControls, mulberry, rand, randUnit, rnd, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, blobGeo, loadSkeletonStatic } from './kit.js';
Object.assign(BIO_MOL, {"methotrexate":{"name":"Methotrexate","el":"C N C C C N C N C N N C N C N C C C C C C C O N C C C C O O C O O H H H H H H H H H H H H H H H H H H H H H H","xyz":"1QBE/tr/ygC+/ioAPwHq/nYAgwFd/y0AvwFH/7f//wGw/3P//wEmAKX/PAKSAGb/OwIIAZz/fQJ2AVX//QEiARYAwQHHAFsAggHoANsAvQE+ACcAgwHe/2UATQAJ/ywAQAB5/3UAwf/E/3YAWP+Z/y4AZv8e/9//2v/a/t7/1P7n/zAAyv5NAHMAYP67/+P/4/0DAOT/8P11AH3/of3nALn/8/0tASYAy/0uAZkAbv5rAQUAbf2r/7n/B/2p//v/d/1c/0P/rQBX/nb/PgEo/tL/nQD1/QkAhQGX/oAAIAEL/9kAvwHj/oz/fQLSAX3/qgJkAfz+UwGgABABhQFHAf4AkwCg/7AAvf8eALMAFP/4/qP/4P+A/qL/Zv5m/6v/zf0uAEYAxv1VAB7/Wf6PAHL/RP3BAOX/iP0wAWz/vf5IATAAnf2I//X+","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwALAAwACwANAAYADQANAA4AAwAOAAEADwAPABAAEAARABEAEgASABMAEwAUAA8AFAASABUAFQAWABUAFwAXABgAGAAZABkAGgAaABsAGwAcABsAHQAYAB4AHgAfAB4AIAAAACEAAAAiAAAAIwACACQAAgAlAAQAJgAJACcACQAoAAwAKQAMACoAEAArABEALAATAC0AFAAuABcALwAYADAAGQAxABkAMgAaADMAGgA0AB0ANQAgADYA","o":"111212121121112112121211211111211211111111111111111111111"},"urate":{"name":"Uric acid","el":"O C N C O C N C O N C N H H H H","xyz":"wP6AAAAALP9GAAAAMP+6/wAArP94/wAAsf/+/gAAJADK/wAAqACk/wAA9QAZAAAAbAEfAAAAnACEAAAAHABPAAAAo/+RAAAA2v6E/wAAzQBI/wAAtQDkAAAAnf/2AAAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAHAAkACQAKAAUACgAKAAsAAQALAAIADAAGAA0ACQAOAAsADwA=","o":"21121112112111111"}});


// @scene joints makeJoints | Кости и суставы | @body Опора и движение
/* =========================================================
   ТЕЛО · КОСТИ И СУСТАВЫ: строение трубчатой кости (компактное и губчатое вещество, костный мозг,
   надкостница, хрящ, остеон), строение синовиального сустава и его болезни, семь типов суставов на скелете
   по атласу Неттера (BP 4–7)
   ========================================================= */
function makeJoints() {
  __set_rnd(mulberry(1101));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0xffc89f);
  const VIEW = { bone: [V3(-2.2, -2.6, 0), V3(1.8, -0.4, 24)], osteon: [V3(8.4, -1.0, -0.2), V3(10.6, 4.0, 7.5)], joint: [V3(38.9, -1.2, 0), V3(40.6, 0.6, 17.5)], types: [V3(82.0, 4.8, 0), V3(85, 7.2, 47)] };
  const VIEWM = { bone: [V3(0.5, -0.8, 0), V3(3.0, 0.8, 24)], osteon: [V3(9.0, -0.2, -0.2), V3(11.2, 4.4, 8.5)], joint: [V3(40, 0.2, 0), V3(41.2, 1.4, 14)], types: [V3(84.6, 8.6, 0), V3(87, 10.5, 52)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
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
  // губчатое вещество: трабекулы на плоскости распила (в эпифизах и метафизах)
  const NTR = 1100, TRB = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5), flat(IVORY, { k: 0.8, e: 0.08 }), NTR);
  const trbData = []; const dmy = new THREE.Object3D();
  for (let i = 0; i < NTR; i++) { const s = i % 2 ? 1 : -1; const y = s * rand(2.2, TOP - 0.12); const r = Math.max(0.05, rOut(y) - 0.09); const x = rand(-r, r); const a = rand(0, Math.PI); trbData.push({ p: V3(x, y, rand(0.012, 0.03)), q: new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), a + (Math.abs(x) < 0.3 ? 0 : Math.sign(x) * 0.4)), len: rand(0.14, 0.3) }); }
  const setTrb = (op) => { trbData.forEach((d, i) => { const keep = !op || i % 5 < 2; dmy.position.copy(d.p); dmy.quaternion.copy(d.q); dmy.scale.set(keep ? (op ? 0.009 : 0.02) : 0, keep ? d.len : 0, keep ? (op ? 0.009 : 0.02) : 0); dmy.updateMatrix(); TRB.setMatrixAt(i, dmy.matrix); }); TRB.instanceMatrix.needsUpdate = true; };
  setTrb(false); G1.add(TRB);
  const artC = new THREE.CatmullRomCurve3([V3(1.6, 0.9, 0.3), V3(0.8, 0.55, -0.1), V3(0.42, 0.35, -0.2), V3(0.15, 0.1, -0.15), V3(0.0, -0.6, -0.12)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(artC, 50, 0.035, 8), flat('#D84A50', { e: 0.15 })));
  // рамка: откуда взят блок остеонов
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.16, 0.4, 0.16)), new THREE.LineBasicMaterial({ color: '#FFF4D8' })); frame.position.set(0.36, -1.0, 0.04); G1.add(frame);
  // остеоны (вставка справа): блок компактного вещества
  const OS = new THREE.Group(); OS.position.set(9.0, -0.6, 0); G1.add(OS);
  const LAMC = ['#EDE0C4', '#DCCBA6'];
  const OSP = [[0, 0], [1.1, 0.25], [-1.0, 0.35], [0.4, -1.0], [-0.6, -1.0], [1.3, -0.85]];
  const canals = [];
  OSP.forEach(([x, z], k) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); OS.add(g);
    for (let j = 0; j < 5; j++) { const r = 0.12 + j * 0.09; const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.4, 32, 1, true, 0, Math.PI * 1.55), flat(LAMC[j % 2], { k: 0.55 + j * 0.03, e: 0.04 })); m.rotation.y = 0.3 + k; g.add(m); const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.045, r + 0.045, 36), flat(LAMC[j % 2], { k: 0.7, e: 0.06 })); ring.rotation.x = -Math.PI / 2; ring.position.y = 1.2; g.add(ring); }
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 2.4, 14, 1, true), flat('#3A1A18', { k: 1, e: 0.02 })); g.add(can); canals.push(can);
    [['#D84A50', 0.022, -0.03], ['#5B6CFF', 0.025, 0.03], ['#F2E08A', 0.012, 0.0]].forEach(([col, r, dx]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.4, 8), flat(col, { e: 0.2 })); m.position.set(dx, 0, dx * 0.5); g.add(m); });
    for (let j = 0; j < 14; j++) { const a = rand(0, Math.PI * 1.5) + 0.3 + k, r = 0.16 + Math.floor(rand(0, 4)) * 0.09 + 0.045; const c = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), flat('#7A5CC8', { e: 0.25 })); c.scale.set(1.6, 0.6, 0.7); c.position.set(Math.sin(a) * r, rand(-1.0, 1.0), Math.cos(a) * r); c.rotation.y = a; g.add(c);
      const ln = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.09, 4), flat('#9F7BFF', { e: 0.3 })); ln.position.copy(c.position).multiplyScalar(0.88); ln.position.y = c.position.y; ln.rotation.set(Math.PI / 2, 0, 0); ln.rotation.y = a; g.add(ln); }
  });
  const volk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.15, 10), flat('#D84A50', { e: 0.15 })); volk.rotation.z = Math.PI / 2 - 0.22; volk.position.set(0.55, 0.4, 0.12); OS.add(volk);
  const blk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 2.4), glassMat('#FFE8C0', { rim: 0.5, base: 0.03, keep: true })); blk.position.set(0.15, 0, -0.3); OS.add(blk);
  // наружные окружные пластинки и надкостница по одной стороне блока
  for (let j = 0; j < 3; j++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.4, 2.4), flat(LAMC[j % 2], { k: 0.6 })); m.position.set(1.98 + j * 0.08, 0, -0.3); OS.add(m); }
  const peri = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 2.4), flat('#E8A0A8', { k: 0.5, m: { transparent: true, opacity: 0.75 } })); peri.position.set(2.28, 0, -0.3); OS.add(peri);

  /* ---------- 2. синовиальный сустав (срез): конгруэнтные поверхности ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const EXT = { depth: 1.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2, curveSegments: 64 };
  const exGeo = (shape, depth = 1.1, z = 0) => { const g = new THREE.ExtrudeGeometry(shape, { ...EXT, depth }); g.translate(0, 0, z - depth / 2); return g; };
  const exMesh = (shape, mat, depth, z, parent) => { const m = new THREE.Mesh(exGeo(shape, depth, z), mat); parent.add(m); return m; };
  const UPC = V3(0, 1.6, 0), RB = 0.88;   // центр головки и радиус кости под хрящом
  const bandShape = (R0, R1, a0, a1) => { const s = new THREE.Shape(); s.absarc(0, 0, R1, a0, a1, false); s.absarc(0, 0, R0, a1, a0, true); s.closePath(); return s; };
  const ribbon = (pts, th) => { const s = new THREE.Shape(); const L = pts.length, nrm = (i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(L - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; }; pts.forEach((p, i) => { const n = nrm(i); (i ? s.lineTo.bind(s) : s.moveTo.bind(s))(p[0] + n[0] * th / 2, p[1] + n[1] * th / 2); }); for (let i = L - 1; i >= 0; i--) { const n = nrm(i); s.lineTo(pts[i][0] - n[0] * th / 2, pts[i][1] - n[1] * th / 2); } s.closePath(); return s; };
  const bez = (a, c, b, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]; });
  const MAT = { bone: flat(IVORY, { k: 0.6 }), sub: flat('#FFF6E0', { k: 0.75, e: 0.08 }), mar: flat('#C87078', { k: 0.45, e: 0.05 }), cart: flat(CART, { e: 0.14 }), fluid: new THREE.MeshPhysicalMaterial({ color: 0x3060a0, emissive: 0x7fd6ff, emissiveIntensity: 0.18, transparent: true, opacity: 0.5, depthWrite: false, roughness: 0.1 }), syn: flat('#E87A8A', { k: 0.55, e: 0.1 }), cap: flat('#F0EEE6', { k: 0.6, e: 0.04 }), lig: flat('#D8D4C8', { k: 0.5, e: 0.03 }), ero: flat('#2A1414', { k: 1, e: 0 }) };
  // верхняя кость (вращается вокруг центра головки)
  const upper = new THREE.Group(); upper.position.copy(UPC); G2.add(upper);
  const upShape = (R, top = 2.6) => { const s = new THREE.Shape(); s.moveTo(-R, top); s.lineTo(-R, 0); s.absarc(0, 0, R, Math.PI, 2 * Math.PI, false); s.lineTo(R, top); s.closePath(); return s; };
  exMesh(upShape(RB), MAT.bone, 1.1, 0, upper);
  const upMar = exMesh(upShape(0.68), MAT.mar, 1.0, 0.07, upper);
  let upSub = null, upCart = null, loBone = null, loSub = null, loMar = null, loCart = null, fluid = null, capL = [], synL = [], ligL = [];
  const lower = new THREE.Group(); G2.add(lower);
  const A0 = Math.PI + 0.62, A1 = 2 * Math.PI - 0.62;   // дуга суставной впадины
  function buildJoint(cu, cl, g, sub) {
    const dispose = (m) => { if (m) { m.parent && m.parent.remove(m); m.geometry.dispose(); } };
    [upSub, upCart, loBone, loSub, loMar, loCart, fluid, ...capL, ...synL, ...ligL].forEach(dispose); capL = []; synL = []; ligL = [];
    upSub = exMesh(bandShape(RB - sub, RB, Math.PI, 2 * Math.PI), MAT.sub, 1.1, 0.01, upper);
    upCart = exMesh(bandShape(RB, RB + cu, Math.PI + 0.08, 2 * Math.PI - 0.08), MAT.cart, 1.1, 0, upper);
    const r1 = RB + cu + g, r2 = r1 + cl;   // поверхность хряща впадины и кость под ним
    const ex = r2 * Math.cos(A0), ey = UPC.y + r2 * Math.sin(A0);   // край впадины (x<0)
    const loShape = (r) => { const s = new THREE.Shape(); s.moveTo(-1.35, -2.6); s.lineTo(1.35, -2.6); s.lineTo(1.35, ey); s.lineTo(-ex, ey); for (let i = 0; i <= 48; i++) { const a = A1 - (A1 - A0) * i / 48; s.lineTo(r * Math.cos(a), UPC.y + r * Math.sin(a)); } s.lineTo(-1.35, ey); s.closePath(); return s; };
    loBone = exMesh(loShape(r2), MAT.bone, 1.1, 0, lower);
    const sh = new THREE.Shape(); for (let i = 0; i <= 48; i++) { const a = A0 + (A1 - A0) * i / 48; (i ? sh.lineTo.bind(sh) : sh.moveTo.bind(sh))(r2 * Math.cos(a), UPC.y + r2 * Math.sin(a)); } for (let i = 48; i >= 0; i--) { const a = A0 + (A1 - A0) * i / 48; sh.lineTo((r2 + sub) * Math.cos(a), UPC.y + (r2 + sub) * Math.sin(a)); } sh.closePath();
    loSub = exMesh(sh, MAT.sub, 1.1, 0.01, lower);
    const ms = new THREE.Shape(); ms.moveTo(-1.15, -2.5); ms.lineTo(1.15, -2.5); ms.lineTo(1.15, ey - 0.15); for (let i = 0; i <= 48; i++) { const a = A1 - (A1 - A0) * i / 48; ms.lineTo((r2 + sub + 0.04) * Math.cos(a), UPC.y + (r2 + sub + 0.04) * Math.sin(a)); } ms.lineTo(-1.15, ey - 0.15); ms.closePath();
    loMar = exMesh(ms, MAT.mar, 1.0, 0.07, lower);
    loCart = exMesh(bandShape(r1, r2, A0 + 0.04, A1 - 0.04), MAT.cart, 1.1, 0, lower); loCart.position.copy(UPC);
    // полость: узкая щель + завороты у краёв
    const fs = new THREE.Shape(); fs.absarc(0, 0, r1 + 0.005, A0 - 0.06, A1 + 0.06, false); fs.absarc(0, 0, RB + cu - 0.005, A1 + 0.06, A0 - 0.06, true); fs.closePath();
    fluid = exMesh(fs, MAT.fluid, 0.95, 0, G2); fluid.position.copy(UPC);
    const ex2 = -ex;   // правый край впадины
    // синовиальная оболочка и капсула: от края хряща головки к краю хряща впадины, с заворотом
    [-1, 1].forEach((s) => {
      const top = [s * (RB + 0.02), UPC.y + 0.45], bot = [s * (ex2 + 0.04), ey], bulge = [s * (ex2 + 0.42 + g * 2), (top[1] + bot[1]) / 2];
      const recess = new THREE.Shape(); const rp = bez(top, bulge, bot); recess.moveTo(top[0], top[1]); rp.forEach(([x, y]) => recess.lineTo(x, y)); recess.lineTo(s * (ex2 - 0.02), ey + 0.02); recess.lineTo(s * (RB + 0.01), UPC.y); recess.closePath();
      const rm = exMesh(recess, MAT.fluid, 0.95, 0, G2); synL.push(rm);
      synL.push(exMesh(ribbon(bez(top, bulge, bot), 0.05), MAT.syn, 1.12, 0, G2));
      const ct = [s * (RB + 0.0), UPC.y + 0.75], cb = [s * (ex2 + 0.18), ey - 0.25], cbul = [s * (ex2 + 0.62 + g * 2), (ct[1] + cb[1]) / 2];
      capL.push(exMesh(ribbon(bez(ct, cbul, cb), 0.11), MAT.cap, 1.12, 0, G2));
      ligL.push(exMesh(ribbon(bez([s * RB, UPC.y + 1.35], [s * (ex2 + 0.85), UPC.y - 0.2], [s * 1.35, ey - 0.85]), 0.12), MAT.lig, 0.5, 0.35, G2));
    });
    return { ex: ex2, ey };
  }
  let JG = buildJoint(0.12, 0.12, 0.04, 0.05);
  // болезни: остеофиты, паннус, эрозии, кристаллы
  const OST = []; [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([s, up]) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 10), flat(IVORY, { k: 0.75 })); m.visible = false; m.userData = { s, up }; G2.add(m); OST.push(m); });
  const PAN = []; [-1, 1].forEach((s) => { for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(blobGeo(0.13, 0.11, 0.38, 40 + k, 0.25, 3), flat('#D8404A', { k: 0.6, e: 0.25 })); m.visible = false; m.userData = { s, k }; G2.add(m); PAN.push(m); } });
  const ERO = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), MAT.ero); m.visible = false; m.userData.s = s; G2.add(m); return m; });
  const XT = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 5), new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), 60); G2.add(XT); XT.visible = false;
  function placeExtras() {
    const { ex, ey } = JG;
    OST.forEach((m) => { const s = m.userData.s; if (m.userData.up) { m.position.set(s * (RB + 0.05), UPC.y + 0.25, 0.2); m.rotation.z = -s * 1.9; } else { m.position.set(s * (ex + 0.1), ey + 0.05, 0.2); m.rotation.z = -s * 0.9; } });
    PAN.forEach((m) => { const { s, k } = m.userData; m.position.set(s * (ex + 0.1 - k * 0.02), ey + 0.05 + k * 0.17, 0.1); });
    ERO.forEach((m) => { m.position.set(m.userData.s * (ex - 0.02), ey - 0.06, 0.45); });
    for (let i = 0; i < 60; i++) { const a = A0 + rand(0.1, A1 - A0 - 0.1); const r = RB + rand(0.09, 0.2); dmy.position.set(r * Math.cos(a), UPC.y + r * Math.sin(a), rand(-0.4, 0.4)); if (i % 3 === 0) dmy.position.set((i % 2 ? 1 : -1) * (ex + rand(0.05, 0.3)), ey + rand(0.05, 0.4), rand(-0.4, 0.4)); dmy.quaternion.setFromUnitVectors(V3(0, 1, 0), randUnit()); dmy.scale.setScalar(1); dmy.updateMatrix(); XT.setMatrixAt(i, dmy.matrix); }
    XT.instanceMatrix.needsUpdate = true;
  }
  placeExtras();

  /* ---------- 3. типы суставов ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const skelMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d8bb, roughness: 0.62, clearcoat: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, transparent: true, opacity: 0.55, depthWrite: false });
  const skel = new THREE.Group(); G3.add(skel);
  const st = { t: 0, mode: 'bone', labels: true, rot: false, fly: null, msg: null, err: null, view: 'bone', op: false, jd: 'norm', typ: 'ball' };
  loadSkeletonStatic(skel, skelMat).catch((e) => { st.err = e.message; refs.setInfo && refs.setInfo(); });
  const J = Object.fromEntries(Object.entries(SKEL_META.joints).map(([k, v]) => [k, V3(...v)]));
  const TYPES = {
    ball: { name: 'Ball-and-socket', col: '#FF8A5C', ax: 3, at: [[J.shL, 'shoulder'], [J.shR, ''], [J.hpL, 'hip'], [J.hpR, '']] },
    hinge: { name: 'Hinge', col: '#7FD6FF', ax: 1, at: [[J.elL, 'humeroulnar'], [J.elR, ''], [J.anL, 'ankle'], [J.anR, ''], [J.hdL.clone().add(V3(0.05, -0.75, 0.15)), 'interphalangeal']] },
    cond: { name: 'Condylar', col: '#FFD86A', ax: 2, at: [[J.knL, 'knee'], [J.knR, '']] },
    pivot: { name: 'Pivot', col: '#F2C14E', ax: 1, at: [[J.C1.clone().add(V3(0, -0.08, 0.1)), 'atlantoaxial'], [J.elL.clone().add(V3(0.18, -0.3, 0.05)), 'radioulnar'], [J.elR.clone().add(V3(-0.18, -0.3, 0.05)), ''], [J.wrL.clone().add(V3(-0.08, 0.12, 0)), ''], [J.wrR.clone().add(V3(0.08, 0.12, 0)), '']] },
    ellip: { name: 'Ellipsoid', col: '#7FE0A0', ax: 2, at: [[J.wrL, 'radiocarpal (wrist)'], [J.wrR, ''], [J.hdL.clone().add(V3(0.0, -0.25, 0.15)), 'metacarpophalangeal'], [J.C1.clone().add(V3(0.12, 0.1, 0.05)), 'atlanto-occipital']] },
    saddle: { name: 'Saddle', col: '#C77DFF', ax: 2, at: [[J.wrL.clone().add(V3(0.2, -0.4, 0.2)), 'carpometacarpal joint of the thumb'], [J.wrR.clone().add(V3(-0.2, -0.4, 0.2)), '']] },
    plane: { name: 'Plane', col: '#FF8AB0', ax: 0, at: [[J.wrL.clone().add(V3(0.0, -0.22, 0.05)), 'intercarpal'], [V3(0.3, 12.6, -0.55), 'vertebral facet joints'], [V3(-0.2, 12.6, -0.55), ''], [J.shL.clone().add(V3(-0.25, 0.38, 0.1)), 'acromioclavicular']] },
  };
  Object.values(TYPES).forEach((T) => { T.marks = T.at.map(([p]) => glowNucleus(G3, p, T.col, 0.07, 9)); });
  // механические модели (крупнее, сеткой 2×4 справа от скелета)
  const MOD = new THREE.Group(); G3.add(MOD);
  const mm = (col, o = {}) => flat(col, { k: 0.6, e: 0.08, ...o });
  const cartOn = (geo, parent, s = 1.03) => { const m = new THREE.Mesh(geo, flat(CART, { k: 0.6, e: 0.12, m: { transparent: true, opacity: 0.55 } })); m.scale.setScalar(s); parent.add(m); return m; };
  const slot = { ball: V3(5.8, 15.6, 0), hinge: V3(9.8, 15.6, 0), cond: V3(5.8, 11.6, 0), pivot: V3(9.8, 11.6, 0), ellip: V3(5.8, 7.6, 0), saddle: V3(9.8, 7.6, 0), plane: V3(7.8, 3.8, 0) };
  const M = {};
  Object.entries(slot).forEach(([k, p]) => { const g = new THREE.Group(); g.position.copy(p); MOD.add(g); M[k] = { g, mov: new THREE.Group() }; g.add(M[k].mov); });
  const axisLine = (g, dir, col) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8 })); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize()); g.add(m); return m; };
  const shaft = (len, col, r = 0.16) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20), mm(col)); m.position.y = len / 2; return m; };
  { const T = M.ball; const cupG = new THREE.SphereGeometry(0.62, 32, 16, 0, Math.PI * 2, Math.PI / 2 - 0.2, Math.PI / 2 + 0.2); T.g.add(new THREE.Mesh(cupG, mm(IVORY))); const base = shaft(1.0, IVORY, 0.3); base.position.y = -1.05; T.g.add(base);
    const bG = new THREE.SphereGeometry(0.55, 32, 20); T.mov.add(new THREE.Mesh(bG, mm('#FFB08A')), shaft(1.6, '#FFB08A')); cartOn(bG, T.mov);
    ['#FF5A5A', '#7FE0A0', '#5B8CFF'].forEach((c, i) => axisLine(T.g, [V3(1, 0, 0), V3(0, 1, 0), V3(0, 0, 1)][i], c)); }
  { const T = M.hinge; const fork = new THREE.Group(); [-0.5, 0.5].forEach((x) => { const pl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.9), mm(IVORY)); pl.position.set(x, -0.2, 0); fork.add(pl); }); const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.16, 0.9), mm(IVORY)); bridge.position.y = -0.62; fork.add(bridge); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.15; fork.add(bs); T.g.add(fork);
    const tG = new THREE.CylinderGeometry(0.34, 0.34, 0.84, 28); const tro = new THREE.Mesh(tG, mm('#9FE0FF')); tro.rotation.z = Math.PI / 2; T.mov.add(tro, shaft(1.7, '#9FE0FF')); const tc = cartOn(tG, T.mov); tc.rotation.z = Math.PI / 2;
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); }
  { const T = M.cond; const plat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.9), mm(IVORY)); plat.position.y = -0.62; T.g.add(plat); const bs = shaft(1.0, IVORY, 0.35); bs.position.y = -1.7; T.g.add(bs);
    [-0.33, 0.33].forEach((x) => { const cG = new THREE.SphereGeometry(0.34, 24, 16); const c = new THREE.Mesh(cG, mm('#FFE8A0')); c.scale.set(0.9, 1, 1.25); c.position.set(x, -0.15, 0); T.mov.add(c); const cc = cartOn(cG, T.mov); cc.scale.set(0.93, 1.03, 1.29); cc.position.copy(c.position); });
    const sh2 = shaft(1.5, '#FFE8A0', 0.32); sh2.position.y = 0.6; T.mov.add(sh2);
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); axisLine(T.g, V3(0, 1, 0), '#5B8CFF'); }
  { const T = M.pivot; const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 14, 36), mm(IVORY)); ring.rotation.x = Math.PI / 2; T.g.add(ring); const bs = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.0, 0.26), mm(IVORY)); bs.position.set(0.55, -0.55, 0); T.g.add(bs);
    const pG = new THREE.CylinderGeometry(0.28, 0.28, 2.0, 24); const peg = new THREE.Mesh(pG, mm('#FFE08A')); peg.position.y = 0.2; const key = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.5), mm('#FF8A5C')); key.position.set(0, 1.05, 0.3); T.mov.add(peg, key); const pc = cartOn(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 24), T.mov); pc.position.y = 0;
    axisLine(T.g, V3(0, 1, 0), '#5B8CFF'); }
  { const T = M.ellip; const cup = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 16, 0, Math.PI * 2, Math.PI / 2 - 0.15, Math.PI / 2 + 0.15), mm(IVORY)); cup.scale.set(1.5, 0.6, 1); T.g.add(cup); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.0; T.g.add(bs);
    const eG = new THREE.SphereGeometry(0.55, 32, 20); const el = new THREE.Mesh(eG, mm('#9FF0B8')); el.scale.set(1.45, 0.62, 0.9); T.mov.add(el, shaft(1.6, '#9FF0B8')); const ec = cartOn(eG, T.mov); ec.scale.set(1.49, 0.66, 0.94);
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); axisLine(T.g, V3(0, 0, 1), '#7FE0A0'); }
  { const T = M.saddle;   // два конгруэнтных седла: верхнее — та же поверхность z = k(x²−y²), сдвинутая вверх, толщина 0.12
    const sadSolid = (top) => { const n = 18, S = 0.7, f = (x, y) => 0.35 * (x * x - y * y); const g = new THREE.BufferGeometry(), pos = [], idx = []; for (const lay of [0, 1]) for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) { const x = -S + 2 * S * i / n, z = -S + 2 * S * j / n; pos.push(x, f(x, z) + (top ? 0.02 + lay * 0.14 : -lay * 0.14 - 0.02), z); } const N = (n + 1) * (n + 1), id = (l, i, j) => l * N + i * (n + 1) + j; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (const l of [0, 1]) { const a = id(l, i, j), b = id(l, i + 1, j), c = id(l, i, j + 1), d = id(l, i + 1, j + 1); if (l) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c); } for (let i = 0; i < n; i++) for (const [ia, ja, ib, jb] of [[i, 0, i + 1, 0], [i, n, i + 1, n], [0, i, 0, i + 1], [n, i, n, i + 1]]) { const a = id(0, ia, ja), b = id(0, ib, jb), c = id(1, ia, ja), d = id(1, ib, jb); idx.push(a, b, c, b, d, c); } g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    T.g.add(new THREE.Mesh(sadSolid(false), mm(IVORY))); const bs = shaft(1.0, IVORY, 0.3); bs.position.y = -1.2; T.g.add(bs);
    T.mov.add(new THREE.Mesh(sadSolid(true), mm('#E0B0FF'))); const us = shaft(1.4, '#E0B0FF'); us.position.y = 0.35; T.mov.add(us);
    axisLine(T.g, V3(1, 0, 0), '#FF5A5A'); axisLine(T.g, V3(0, 0, 1), '#7FE0A0'); }
  { const T = M.plane; const low = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.2), mm(IVORY)); low.position.y = -0.17; T.g.add(low);
    const up = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.0), mm('#FFB0C8')); up.position.y = 0.17; T.mov.add(up); }
  Object.values(M).forEach((m) => { m.g.userData.s0 = 1.25; });

  /* ---------- состояние ---------- */
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['bone', 'joint', 'types'][k] === m; }); OS.visible = st.view === 'osteon'; const v = VV(m === 'bone' ? st.view : m); st.fly = flyTarget(v[0], v[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const JD = { norm: [0.12, 0.12, 0.04, 0.05], oa: [0.05, 0.04, 0.015, 0.14], ra: [0.09, 0.09, 0.14, 0.04], gout: [0.11, 0.11, 0.09, 0.05] };
  function setJd(v) {
    st.jd = v; JG = buildJoint(...JD[v]); placeExtras();
    const oa = v === 'oa', ra = v === 'ra', gout = v === 'gout';
    OST.forEach((m) => { m.visible = oa; }); PAN.forEach((m) => { m.visible = ra; }); ERO.forEach((m) => { m.visible = ra; }); XT.visible = gout;
    MAT.fluid.emissive.set(ra || gout ? '#FFB0A0' : '#7FD6FF');
    MAT.syn.color.set(ra || gout ? '#D8404A' : '#E87A8A').multiplyScalar(0.55); MAT.syn.emissiveIntensity = ra || gout ? 0.3 : 0.1;
    MAT.sub.color.set(oa ? '#FFFFFF' : '#FFF6E0').multiplyScalar(oa ? 0.95 : 0.75);
  }
  function setOp(v) {
    st.op = v; setTrb(v);
    marrowY.geometry.dispose(); marrowY.geometry = new THREE.ShapeGeometry(shapeOf(contour((y) => { const a = Math.abs(y); return a < 2.35 ? (v ? 0.34 : 0.27) : Math.max(0, (v ? 0.34 : 0.27) * (1 - (a - 2.35) / 0.4)); }, -2.7, 2.7)));
    canals.forEach((c) => { c.scale.set(v ? 2.4 : 1, 1, v ? 2.4 : 1); });
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'joint') {
      const amp = st.jd === 'oa' ? 0.18 : st.jd === 'ra' || st.jd === 'gout' ? 0.12 : 0.45;
      upper.rotation.z = amp * Math.sin(t * 1.2);
      if (st.jd === 'oa' && Math.abs(Math.cos(t * 1.2)) > 0.97 && rnd() < 0.3) fx.spawn(G2.localToWorld(V3(rand(-0.6, 0.6), UPC.y - RB - 0.05, 0.6)), V3(0, 0.3, 0.3), C.set('#FFE0A0'), 0.4, 0.5, 1);
      PAN.forEach((m, i) => { m.scale.setScalar(1 + 0.08 * Math.sin(t * 3 + i)); });
    }
    if (st.mode === 'types') {
      const s = Math.sin(t * 1.4), c = Math.cos(t * 1.4);
      M.ball.mov.rotation.set(0.45 * s, t * 0.8, 0.45 * c);
      M.hinge.mov.rotation.x = 0.9 * (s * 0.5 + 0.5) - 0.2;
      M.cond.mov.rotation.set(0.7 * (s * 0.5 + 0.5) - 0.1, 0.25 * Math.max(0, s) * Math.sin(t * 0.7), 0);
      M.pivot.mov.rotation.y = 1.2 * s;
      M.ellip.mov.rotation.set(0.4 * s, 0, 0.35 * Math.sin(t * 0.9));
      M.saddle.mov.rotation.set(0.25 * s, 0, 0.25 * Math.sin(t * 0.8));
      M.plane.mov.position.set(0.18 * s, 0, 0.12 * Math.sin(t * 0.9));
      Object.entries(TYPES).forEach(([k, T]) => { const on = k === st.typ; M[k].g.scale.setScalar(on ? 1.45 : 1.0); M[k].g.traverse((o) => { if (o.material && o.material.emissiveIntensity !== undefined) o.material.emissiveIntensity = on ? 0.22 : 0.04; }); T.marks.forEach((g, i) => { g.spr.material.opacity = on ? 0.7 + 0.3 * Math.sin(t * 4 + i) : 0.12; g.spr.scale.setScalar(on ? 0.9 : 0.45); g.core.visible = on; }); });
    }
    fx.update(dt);
  }

  const TXT = {
    bone: 'A <b>long bone</b> (here a schematic femur) cut lengthwise. The shaft — the <b>diaphysis</b> — has a thick wall of <b>compact bone</b>, with a marrow cavity of <b>yellow (fatty) marrow</b> inside. The ends — the <b>epiphyses</b> — have a thin layer of compact bone and inside <b>spongy bone</b>: a network of struts (trabeculae) aligned with lines of stress, with <b>red marrow</b> between them. In adults blood-forming marrow remains in flat and short bones (sternum, ribs, pelvis, vertebral bodies) and in the proximal epiphyses of the femur and humerus. The articular surfaces are covered with <b>hyaline cartilage</b>, the rest with <b>periosteum</b> (through it bone grows in thickness and heals after a fracture). The white line is a trace of the <b>growth plate</b> (epiphyseal line). A <b>nutrient artery</b> enters through the wall. The frame on the diaphysis marks where the block of osteons comes from.',
    osteon: 'An <b>osteon</b> (Haversian system) is the unit of compact bone: 4–20 concentric <b>lamellae</b> of collagen and hydroxyapatite crystals around a <b>central (Haversian) canal</b> with capillaries and a nerve fiber. Between the lamellae, in elongated lacunae, sit <b>osteocytes</b> (purple) — former osteoblasts walled into bone; their processes run through fine canaliculi connecting the cells to each other and to the canal — this is how they sense load. Transverse <b>Volkmann’s canals</b> bring vessels from the periosteum. On the outside, beneath the <b>periosteum</b>, lie the <b>outer circumferential lamellae</b>. Bone is 2/3 mineral (compressive strength) and 1/3 organic matrix, mainly type I collagen (flexibility).',
    op: '<b>Osteoporosis</b>: bone breakdown (osteoclasts) outpaces bone building (osteoblasts) — especially after menopause, when estrogens disappear, with glucocorticoid therapy, and with immobility. There are fewer trabeculae, they are thinner and lose connections, the compact layer thins (the marrow cavity widens), and the canals in osteons enlarge into resorption cavities. Typical fractures — femoral neck, vertebrae (compression), distal radius at the wrist. Diagnosis — densitometry; treatment — calcium with vitamin D, bisphosphonates, denosumab. See the “Calcium: parathyroid hormone and vitamin D” topic.',
    norm: 'A <b>synovial joint</b> in section. The articular surfaces are <b>congruent</b> — they match each other, with only a slit holding a thin layer of <b>synovial fluid</b> between them. The bone ends are covered with smooth <b>hyaline cartilage</b> (blue) — it has no vessels or nerves and is nourished by the fluid; beneath it lies the dense <b>subchondral plate</b>, and deeper, spongy bone with red marrow. The fluid (hyaluronic acid + lubricin) is a lubricant: friction in a joint is lower than ice on ice. It is produced by the <b>synovial membrane</b> (pink), which lines the capsule up to the edge of the cartilage and forms recesses. The <b>fibrous capsule</b> attaches at the edge of the cartilage and continues into the periosteum; outside are the <b>ligaments</b>. Some joints contain intra-articular discs and menisci (knee, temporomandibular).',
    oa: '<b>Osteoarthritis</b> is the most common joint disease: cartilage wears and thins (with age, after injuries, with excess weight), the <b>joint space narrows</b>, bone beneath the cartilage becomes denser (subchondral sclerosis — a thicker white band), and bony spurs — <b>osteophytes</b> — grow at the margins. Movement is limited, there is crepitus (sparks), pain on loading, and brief morning stiffness. Treatment — exercise and weight loss, painkillers, and joint replacement when the joint is destroyed.',
    ra: '<b>Rheumatoid arthritis</b> is autoimmune inflammation of the synovial membrane: it thickens and grows into aggressive tissue — <b>pannus</b> (red) — which creeps over the cartilage and eats into the bone at the margins (<b>erosions</b> — dark notches). There is more fluid (effusion), the joint space is widened, the joint is swollen and hot, morning stiffness lasts more than an hour; small joints of the hands and feet are affected symmetrically. Treatment — methotrexate and biologic drugs (TNF-α inhibitors and others).',
    gout: '<b>Gout</b>: when blood urate exceeds about 420 µmol/L (≈7 mg/dL, the solubility limit of urate), needle-shaped crystals of <b>sodium urate</b> (white) precipitate in the joint fluid. Neutrophils attack the crystals, and overnight an attack of intense inflammation develops — most often in the joint of the big toe. Under a polarizing microscope the crystals show negative birefringence; in chronic gout nodules (tophi) form. In detail — the “Nucleotides and gout” topic.',
  };
  const TYTXT = {
    ball: 'A <b>ball-and-socket joint</b> — a spherical head in a socket: movement around <b>three axes</b> (flexion–extension, abduction–adduction, rotation) and circumduction. The <b>shoulder</b> joint is the most mobile in the body (the socket is shallow), and so it dislocates most often. The <b>hip</b> has its head deep in the acetabulum: it is stronger and more stable, but less mobile.',
    hinge: 'A <b>hinge joint</b> — a roller (trochlea) in a notch: movement around <b>one axis</b> — flexion and extension. Examples: humeroulnar, interphalangeal joints of the fingers, ankle.',
    cond: 'A <b>condylar joint</b> — two rounded condyles on almost flat facets: the main movement is flexion–extension, and when flexed some rotation is possible (<b>two axes</b>). The main example is the <b>knee</b>, the largest joint in the body; its surfaces do not match, so cartilaginous <b>menisci</b> lie between them, and cruciate ligaments inside. The temporomandibular joint is also condylar.',
    pivot: 'A <b>pivot joint</b> — rotation around <b>one longitudinal axis</b>. The dens of the second cervical vertebra rotates in the ring of the atlas — that is how we turn the head to say “no”. The proximal and distal radioulnar joints rotate the forearm: palm down (pronation) and up (supination).',
    ellip: 'An <b>ellipsoid joint</b> — an oval head in an oval socket: <b>two axes</b> — flexion–extension and abduction–adduction, no rotation. Examples: the wrist (radiocarpal), the metacarpophalangeal joints of the fingers, the atlanto-occipital joint (the “yes” nod).',
    saddle: 'A <b>saddle joint</b> — two “saddles” turned to each other at a right angle: <b>two axes</b>, and combined, circumduction. The main example is the carpometacarpal joint of the thumb: it lets the thumb oppose the other fingers — the basis of the human grasping hand. Osteoarthritis often starts here.',
    plane: 'A <b>plane joint</b> — almost flat surfaces allowing only small gliding movements in different directions. Examples: joints between the carpal and tarsal bones, facet joints of the vertebrae, the acromioclavicular joint. Each moves little, but together they make the hand, foot and spine flexible.',
  };
  const L1 = () => st.labels && st.mode === 'bone' && st.view === 'bone', L1o = () => st.labels && st.mode === 'bone' && st.view === 'osteon', L2 = () => st.labels && st.mode === 'joint', L3 = () => st.labels && st.mode === 'types';
  const labels = [
    { text: 'articular cartilage', pos: V3(0.55, 4.18, 0.3), color: CART, show: L1 },
    { text: 'spongy bone', pos: V3(0.35, 3.25, 0.3), color: IVORY, show: L1 },
    { text: 'red marrow', pos: V3(-0.3, 3.55, 0.3), color: '#E07080', show: L1 },
    { text: 'epiphyseal line', pos: V3(0.62, 2.75, 0.3), color: '#FFF4D8', show: L1 },
    { text: 'compact bone', pos: V3(0.38, 1.6, 0.3), color: IVORY, show: L1 },
    { text: 'yellow marrow', pos: V3(0.0, -0.6, 0.3), color: YEL, show: L1 },
    { text: 'nutrient artery', pos: V3(1.55, 0.9, 0.4), color: '#FF6A6A', show: L1 },
    { text: 'periosteum', pos: V3(0.47, -1.7, 0.3), color: '#E8A0A8', show: L1 },
    { text: 'osteons (frame)', pos: V3(0.5, -1.0, 0.3), color: '#FFF4D8', show: L1 },
    { text: 'lamellae', pos: V3(9.0 + 0.4, -0.6 + 1.25, 0.2), color: IVORY, show: L1o },
    { text: 'Haversian canal: capillaries, nerve', pos: V3(9.0, -0.6 + 1.3, 0.05), color: '#FF6A6A', show: L1o },
    { text: 'osteocytes in lacunae', pos: V3(9.0 - 1.05, -0.6 + 0.2, 0.7), color: '#9F7BFF', show: L1o },
    { text: 'Volkmann’s canal', pos: V3(9.0 + 0.6, -0.6 + 0.45, 0.3), color: '#FF6A6A', show: L1o },
    { text: 'periosteum, circumferential lamellae', pos: V3(9.0 + 2.3, -0.6 - 0.9, 0.9), color: '#E8A0A8', show: L1o },
    { text: 'hyaline cartilage', pos: () => V3(40 + 0.0, UPC.y - RB - 0.06, 0.62), color: CART, show: L2 },
    { text: 'subchondral bone', pos: () => V3(40 - 0.35, UPC.y - RB + 0.14, 0.62), color: '#FFF6E0', show: L2 },
    { text: 'synovial fluid', pos: () => V3(40 + JG.ex + 0.2, JG.ey + 0.3, 0.62), color: '#7FD6FF', show: L2 },
    { text: 'synovial membrane', pos: () => V3(40 - JG.ex - 0.42, UPC.y + 0.05, 0.62), color: '#E87A8A', show: L2 },
    { text: 'fibrous capsule', pos: () => V3(40 + JG.ex + 0.6, UPC.y + 0.45, 0.62), color: '#F0EEE6', show: L2 },
    { text: 'ligament', pos: () => V3(40 + JG.ex + 0.8, JG.ey - 0.6, 0.62), color: '#D8D4C8', show: L2 },
    { text: 'spongy bone, red marrow', pos: V3(40 - 0.2, 3.3, 0.62), color: '#E07080', show: L2 },
    { text: 'osteophytes', pos: () => V3(40 - JG.ex - 0.2, JG.ey + 0.05, 0.62), color: IVORY, show: () => L2() && st.jd === 'oa' },
    { text: 'pannus', pos: () => V3(40 - JG.ex - 0.1, JG.ey + 0.5, 0.62), color: '#FF6A6A', show: () => L2() && st.jd === 'ra' },
    { text: 'erosions', pos: () => V3(40 + JG.ex, JG.ey - 0.12, 0.62), color: '#FFB0A0', show: () => L2() && st.jd === 'ra' },
    { text: 'urate crystals', pos: () => V3(40 + 0.2, UPC.y - RB - 0.12, 0.62), color: '#FFFFFF', show: () => L2() && st.jd === 'gout' },
    ...Object.entries(TYPES).map(([k, T]) => ({ text: T.name + (T.ax ? ` · axes: ${T.ax}` : ' · gliding'), pos: slot[k].clone().add(V3(80 - 1.0, -2.25, 0.6)), color: T.col, show: L3 })),
    ...Object.entries(TYPES).flatMap(([k, T]) => T.at.filter(([, n]) => n).map(([p, n]) => ({ text: n, pos: p.clone().add(V3(80 + (p.x >= 0 ? 0.35 : -0.35), 0.05, 0.3)), color: T.col, show: () => L3() && st.typ === k }))),
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'bone' ? (st.op ? TXT.op : TXT[st.view]) : st.mode === 'joint' ? TXT[st.jd] : TYTXT[st.typ];
      if (st.err && st.mode === 'types') s += '<br><br><i>The skeleton model failed to load: ' + st.err + '</i>';
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'bone', label: 'Bone structure' }, { id: 'joint', label: 'Joint' }, { id: 'types', label: 'Joint types' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'bone') box.append(h('div', { class: 'glabel' }, 'Show'), h('div', { class: 'gctl' }, seg([{ id: 'bone', label: 'Whole bone' }, { id: 'osteon', label: 'Osteons' }], () => st.view, (v) => { st.view = v; OS.visible = v === 'osteon'; const vv = VV(v); st.fly = flyTarget(vv[0], vv[1]); refs.setInfo(); }), toggle('Osteoporosis', () => st.op, (v) => { setOp(v); refs.setInfo(); })));
      else if (st.mode === 'joint') box.append(h('div', { class: 'glabel' }, 'State'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Normal' }, { id: 'oa', label: 'Osteoarthritis' }, { id: 'ra', label: 'Rheumatoid arthritis' }, { id: 'gout', label: 'Gout' }], () => st.jd, (v) => { setJd(v); refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Joint type'), h('div', { class: 'gctl' }, seg(Object.entries(TYPES).map(([id, T]) => ({ id, label: T.name, color: T.col })), () => st.typ, (v) => { st.typ = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['bone', 'joint', 'types'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'bone') return st.view === 'osteon' ? [['Osteon diameter', '0.1–0.4', 'mm'], ['Mineral / organic', '65 / 35', '%']] : [['Bones in an adult', 206, ''], ['Trabeculae', st.op ? 'few, thin' : 'normal', '']];
    if (st.mode === 'joint') return [['Joint space', st.jd === 'oa' ? 'narrowed' : st.jd === 'ra' || st.jd === 'gout' ? 'effusion' : 'normal', ''], ['Movement', st.jd === 'oa' ? 'limited, crepitus' : st.jd === 'norm' ? 'free' : 'painful', '']];
    const T = TYPES[st.typ]; return [['Axes of movement', T.ax || 'gliding', ''], ['Marks on skeleton', T.at.length, '']];
  }
  const self = {
    mobZoom: 0.55, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#F2D27A',
    kicker: 'Body · support and movement', title: 'Bones and joints',
    lede: 'Bone is living tissue stronger than concrete in compression and lighter than steel, and a joint glides with less friction than ice on ice.',
    notes: `
      <div><h2>Bones</h2>
        <p>An adult has 206 bones: the axial skeleton (skull, spine, ribs, sternum) and the appendicular skeleton (girdles and free limbs). By shape — long, short (spongy), flat, irregular; sesamoid bones lie in tendons (patella).</p>
        <ul><li><b>Cells</b>: osteoblasts build, osteocytes monitor, osteoclasts resorb; bone is remodeled throughout life (≈10% of the skeleton a year).</li><li><b>Growth in length</b> — at the epiphyseal plate (cartilage), in thickness — from the periosteum.</li><li><b>Bone marrow</b>: red — blood-forming, yellow — fatty.</li></ul>
        <h3>Joints between bones</h3><ul><li><b>Fibrous</b>: skull sutures, syndesmoses, gomphoses (teeth).</li><li><b>Cartilaginous</b>: intervertebral discs, pubic symphysis, growth plates.</li><li><b>Synovial</b> (joints proper): cartilage, cavity with fluid, synovial membrane, capsule, ligaments; sometimes discs and menisci.</li></ul>
        <h3>Joint types by shape</h3><p>Uniaxial — hinge, pivot; biaxial — ellipsoid, saddle, condylar; multiaxial — ball-and-socket; plane — small gliding movements in different directions.</p></div>
      <div><h2>Simplifications</h2><ul><li>The bone and joint models are diagrams, not to scale; trabeculae are placed randomly rather than along lines of stress.</li><li>The skeleton is a real 3D model (Sketchfab, CC BY); joint marks are placed approximately.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('bone'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
export { makeJoints };
