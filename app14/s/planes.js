import { SKEL_META, THREE, V3, __set_rnd, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mulberry, organMat, rnd, seg, smooth, taperTube, toggle } from '../core.js';
import { blobGeo, loadSkeletonStatic, skelShell } from './kit.js';

function makePlanes() {
  __set_rnd(mulberry(1001));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const VIEW = { planes: [V3(-1.6, 4.2, 0), V3(40, 7, 22)], dirs: [V3(-2.0, 4.2, 0), V3(5, 7, 46)], cav: [V3(-1.2, 11.0, 0), V3(5, 13.2, 24)], cavSide: [V3(0, 11.6, -1.8), V3(26, 12.5, 4)] };
  const VIEWM = { planes: [V3(0, 8.0, 0), V3(26, 10, 26)], dirs: [V3(0, 8.0, 0), V3(4, 9, 44)], cav: [V3(0, 12.4, 0), V3(5, 14, 26)], reg: [V3(0, 10.4, 0), V3(1.2, 10.9, 10.5)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300);
  const controls = makeControls(camera, VIEW.planes[0]); controls.minDistance = 4; controls.maxDistance = 70;
  const C = new THREE.Color();
  const CLIP = new THREE.Plane(V3(-1, 0, 0), 0), CMATS = [];
  const cm = (m) => { CMATS.push(m); return m; };
  const G = new THREE.Group(); scene.add(G);
  // скелет и силуэт
  const boneMat = cm(new THREE.MeshPhysicalMaterial({ color: 0xe8d8bb, roughness: 0.62, clearcoat: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, side: THREE.DoubleSide }));
  const skel = new THREE.Group(); G.add(skel);
  const st = { t: 0, mode: 'planes', labels: true, rot: false, fly: null, msg: null, loaded: false, err: null,
    plane: 'all', cut: true, sweep: false, pos: 0, ph: 0, dir: 'sup', cav: 'all', reg: 'r9', sel: null };
  loadSkeletonStatic(skel, boneMat).then(() => { st.loaded = true; refs.setInfo && refs.setInfo(); }).catch((e) => { st.err = e.message; refs.setInfo && refs.setInfo(); });
  const shellMat = cm(glassMat('#BFD8FF', { rim: 0.55, base: 0.025, keep: true }));
  const shell = skelShell(G, shellMat);
  // органы
  const ORG = {};
  const org = (id, geo, col, p, o = {}) => { const m = new THREE.Mesh(geo, cm(organMat(col, o.k ?? 0.5, { emissiveIntensity: 0.06, side: THREE.DoubleSide, ...(o.mat || {}) }))); m.position.copy(p); if (o.rz) m.rotation.z = o.rz; G.add(m); ORG[id] = m; m.userData.col = col; return m; };
  org('brain', blobGeo(0.62, 0.52, 0.74, 3, 0.08), '#E8A8B8', V3(0.08, 16.4, 0.05));
  const CANAL = [V3(0.04, 15.4, -0.03), V3(0.04, 14.5, -0.1), V3(0.03, 13.5, -0.28), V3(0.03, 12.5, -0.17), V3(0.03, 11.25, -0.12), V3(0.03, 10.4, -0.2), V3(0.03, 9.8, -0.35), V3(0.03, 9.3, -0.5)];
  org('cord', taperTube(new THREE.CatmullRomCurve3(CANAL.slice(0, 5)), (u) => 0.065 - 0.03 * smooth(0.85, 1, u), 60, 10), '#F2E6C8', V3(0, 0, 0));
  org('cauda', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(CANAL.slice(4)), 30, 0.025, 6), '#F2E6C8', V3(0, 0, 0));
  org('lungR', blobGeo(0.55, 1.1, 0.52, 5, 0.08), '#E8909C', V3(-0.72, 13.25, 0.28));
  org('lungL', blobGeo(0.5, 1.05, 0.5, 6, 0.08), '#E8909C', V3(0.82, 13.25, 0.28));
  org('heart', blobGeo(0.4, 0.46, 0.36, 7, 0.1), '#C84A50', V3(0.28, 12.65, 0.62), { rz: 0.5 });
  org('diaph', (() => { const g = new THREE.SphereGeometry(1, 36, 12, 0, Math.PI * 2, 0, 1.15); g.scale(1.15, 0.5, 0.78); return g; })(), '#FF9A5C', V3(0.05, 12.05, 0.2), { k: 0.4, mat: { transparent: true, opacity: 0.55, depthWrite: false } });
  org('liver', blobGeo(0.95, 0.62, 0.6, 9, 0.08), '#9A4A3A', V3(-0.42, 11.7, 0.45), { rz: 0.18 });
  org('gall', ell3(0.1, 0.17, 0.1), '#7FB050', V3(-0.55, 11.15, 0.95));
  org('stomach', blobGeo(0.5, 0.42, 0.32, 11, 0.12), '#E8A070', V3(0.52, 11.4, 0.62), { rz: 0.5 });
  org('spleen', ell3(0.22, 0.38, 0.18), '#8A3A60', V3(1.05, 11.65, -0.15));
  org('pancreas', ell3(0.62, 0.11, 0.13), '#E8C080', V3(0.15, 11.25, 0.22), { rz: 0.15 });
  org('kidR', ell3(0.2, 0.36, 0.17), '#B04A40', V3(-0.55, 11.05, -0.32));
  org('kidL', ell3(0.2, 0.36, 0.17), '#B04A40', V3(0.6, 11.2, -0.32));
  const ct = (pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.15, 12);
  org('colAsc', ct([V3(-0.72, 9.75, 0.5), V3(-0.8, 10.45, 0.48), V3(-0.72, 10.95, 0.55)]), '#D8A890', V3(0, 0, 0));
  org('colTr', ct([V3(-0.72, 10.95, 0.55), V3(0, 10.85, 0.78), V3(0.78, 11.0, 0.6)]), '#D8A890', V3(0, 0, 0));
  org('colDesc', ct([V3(0.78, 11.0, 0.6), V3(0.88, 10.3, 0.42), V3(0.8, 9.7, 0.5)]), '#D8A890', V3(0, 0, 0));
  org('sigm', ct([V3(0.8, 9.7, 0.5), V3(0.45, 9.3, 0.55), V3(0.1, 9.15, 0.2)]), '#D8A890', V3(0, 0, 0));
  org('cecum', ell3(0.2, 0.2, 0.18), '#D8A890', V3(-0.72, 9.68, 0.52));
  org('appendix', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-0.7, 9.52, 0.6), V3(-0.6, 9.36, 0.68), V3(-0.5, 9.3, 0.62)]), 16, 0.045, 8), '#E07A6A', V3(0, 0, 0));
  { const pts = []; for (let i = 0; i < 140; i++) { const a = i * 0.55; pts.push(V3(Math.cos(a) * (0.15 + 0.4 * ((i * 37) % 11) / 11), 10.25 - i * 0.0065 + 0.08 * Math.sin(a * 0.7), 0.6 + Math.sin(a) * 0.22)); } org('small', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 500, 0.07, 6), '#E0A0A0', V3(0, 0, 0)); }
  org('bladder', ell3(0.26, 0.22, 0.24), '#E8D070', V3(0.03, 9.2, 0.3));
  const ORGNAME = { brain: 'головной мозг', cord: 'спинной мозг', lungR: 'правое лёгкое', lungL: 'левое лёгкое', heart: 'сердце', diaph: 'диафрагма', liver: 'печень', gall: 'желчный пузырь', stomach: 'желудок', spleen: 'селезёнка', pancreas: 'поджелудочная железа', kidR: 'правая почка', kidL: 'левая почка', colAsc: 'восходящая ободочная кишка', colTr: 'поперечная ободочная кишка', colDesc: 'нисходящая ободочная кишка', sigm: 'сигмовидная кишка', cecum: 'слепая кишка', appendix: 'червеобразный отросток', cauda: 'конский хвост', small: 'тонкая кишка', bladder: 'мочевой пузырь' };

  /* ---------- 1. плоскости ---------- */
  const PL = new THREE.Group(); G.add(PL);
  const planeMesh = (w, h, col) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })); const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.8 })); g.add(m, e); PL.add(g); return g; };
  const PLN = { sag: planeMesh(5.5, 18.6, '#7FE0A0'), front: planeMesh(5.5, 18.6, '#7FD6FF'), trans: planeMesh(5.5, 4.5, '#FF8AB0') };
  PLN.sag.rotation.y = Math.PI / 2; PLN.sag.position.set(0, 9.1, 0.2); PLN.front.position.set(0, 9.1, 0.2); PLN.trans.rotation.x = -Math.PI / 2; PLN.trans.position.set(0, 12, 0.2);
  const PRANGE = { all: [0, 0, 0], sag: [-1.4, 1.4, 0.03], front: [-0.7, 0.9, 0.2], trans: [1.0, 17.0, 12.6] };
  const PVIEW = { all: [V3(-2.0, 5.3, 0), V3(18, 11, 41)], sag: [V3(-1.6, 4.2, 0), V3(40, 7, 22)], front: [V3(-2.0, 4.2, 0), V3(10, 8, 46)], trans: [V3(-1.4, 5.0, 0), V3(10, 30, 28)] };

  /* ---------- 2. направления ---------- */
  const DG = new THREE.Group(); G.add(DG);
  const arrowMat = (col) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 1 });
  function darrow(a, b, col, both = true) {
    const g = new THREE.Group(); const d = b.clone().sub(a), L = d.length(), mat = arrowMat(col);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, L - 0.5, 10), mat); shaft.position.copy(a).lerp(b, 0.5); shaft.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); g.add(shaft);
    const cone = (p, dir) => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 14), mat); c.position.copy(p); c.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); g.add(c); };
    cone(b.clone().addScaledVector(d.clone().normalize(), -0.19), d.clone().normalize()); if (both) cone(a.clone().addScaledVector(d.clone().normalize(), 0.19), d.clone().normalize().negate());
    DG.add(g); g.userData.mat = mat; return g;
  }
  const J = Object.fromEntries(Object.entries(SKEL_META.joints).map(([k, v]) => [k, V3(...v)]));
  const DIRS = {
    sup: { g: (() => { const g = new THREE.Group(); g.add(darrow(V3(-3.0, 0.6, 0.3), V3(-3.0, 17.5, 0.3), '#F2C14E'), darrow(V3(2.4, 9.2, 0.6), V3(2.4, 15.0, 0.6), '#FFB86A')); DG.add(g); return g; })(), view: [V3(-1.2, 4.2, 0), V3(5, 7, 46)] },
    ant: { g: darrow(V3(0, 12.4, -2.3), V3(0, 12.4, 2.6), '#7FD6FF'), view: [V3(0, 9.6, 0), V3(25, 11.5, 6)] },
    med: { g: (() => { const g = new THREE.Group(); g.add(darrow(V3(0.05, 13.0, 1.6), V3(2.6, 13.0, 1.6), '#7FE0A0', false), darrow(V3(-0.05, 13.0, 1.6), V3(-2.6, 13.0, 1.6), '#7FE0A0', false)); const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 17.5, 8), arrowMat('#7FE0A0')); mid.position.set(0.05, 9.3, 1.25); g.add(mid); DG.add(g); return g; })(), view: [V3(-0.4, 9.4, 0), V3(2, 11, 25)] },
    prox: { g: (() => { const g = new THREE.Group(); g.add(darrow(J.shL.clone().add(V3(0.55, 0, 0.5)), J.hdL.clone().add(V3(0.45, -0.6, 0.5)), '#FF8AB0', false), darrow(J.hpL.clone().add(V3(0.7, -0.2, 0.6)), J.anL.clone().add(V3(0.6, -0.5, 0.6)), '#FF8AB0', false)); DG.add(g); return g; })(), view: [V3(-0.6, 4.2, 0), V3(12, 7, 45)] },
    deep: { g: darrow(V3(J.knL.x + 0.1, 7.2, 1.6), V3(J.knL.x + 0.1, 7.2, 0.05), '#C77DFF', true), view: [V3(0.9, 6.0, 0), V3(13, 8, 12)] },
    ipsi: { g: (() => { const g = new THREE.Group(); const mk = (a, b, col) => { const c = new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(V3(a.x > 0 && b.x > 0 ? 1.6 : 0, 0, 1.4)), b); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.05, 8), arrowMat(col)); g.add(m); }; mk(J.hdL.clone().add(V3(0.2, -0.4, 0.3)), J.anL.clone().add(V3(0.2, -0.5, 0.5)), '#7FE0A0'); mk(J.hdL.clone().add(V3(0.1, -0.4, 0.3)), J.anR.clone().add(V3(-0.1, -0.5, 0.5)), '#FF9A5C'); DG.add(g); return g; })(), view: [V3(-1.0, 4.2, 0), V3(4, 7, 46)] },
  };
  const DIRNAME = { sup: 'Верхний ↔ нижний', ant: 'Передний ↔ задний', med: 'Медиальный ↔ латеральный', prox: 'Проксимальный ↔ дистальный', deep: 'Поверхностный ↔ глубокий', ipsi: 'Ипси- и контралатеральный' };

  /* ---------- 3. полости и области живота ---------- */
  const CG = new THREE.Group(); G.add(CG);
  const CAV = {};
  const cav = (id, geo, col, p) => { const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(0.6), emissive: col, emissiveIntensity: 0.3, roughness: 0.4, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide })); m.renderOrder = 4; m.position.copy(p); CG.add(m); CAV[id] = m; m.userData.col = col; return m; };
  cav('cranial', ell3(0.64, 0.56, 0.78), '#9FB4FF', V3(0.08, 16.4, 0.05));
  cav('vert', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(CANAL), 80, 0.12, 12), '#7FE0A0', V3(0, 0, 0));
  cav('pleuR', ell3(0.62, 1.18, 0.6), '#7FD6FF', V3(-0.74, 13.25, 0.28)); cav('pleuL', ell3(0.58, 1.12, 0.58), '#7FD6FF', V3(0.84, 13.25, 0.28));
  cav('peri', ell3(0.5, 0.54, 0.44), '#FF8AB0', V3(0.26, 12.66, 0.6));
  cav('medi', ell3(0.3, 0.62, 0.42), '#F2C14E', V3(0.05, 14.0, 0.32));
  cav('abd', ell3(1.1, 1.22, 0.72), '#F2D27A', V3(0.02, 10.8, 0.38));
  cav('pelv', ell3(0.62, 0.5, 0.55), '#C77DFF', V3(0.03, 9.1, -0.05)); CAV.pelv.rotation.x = -0.45;
  const CAVSET = { all: Object.keys(CAV), dorsal: ['cranial', 'vert'], thor: ['pleuR', 'pleuL', 'peri', 'medi'], abd: ['abd', 'pelv'] };
  // области живота на передней стенке
  const RG = new THREE.Group(); G.add(RG);
  const zf = (x) => 0.16 + 0.66 * Math.sqrt(Math.max(0, 1 - (x / 1.2) ** 2)) + 0.06;
  const patch = (x0, x1, y0, y1, col) => { const g = new THREE.PlaneGeometry(x1 - x0, y1 - y0, 12, 6); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i) + (x0 + x1) / 2, y = p.getY(i) + (y0 + y1) / 2; p.setXYZ(i, x, y, zf(x)); } g.computeVertexNormals(); const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, depthTest: false })); m.renderOrder = 5; RG.add(m); return m; };
  const line = (pts, col) => { const c = new THREE.CatmullRomCurve3(pts); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.022, 6), new THREE.MeshBasicMaterial({ color: col, depthTest: false, transparent: true })); m.renderOrder = 6; RG.add(m); return m; };
  const XB = [-1.15, -0.6, 0.66, 1.2], YB = [12.0, 11.1, 10.25, 8.95];
  const R9 = [
    ['rhyp', 'правая подреберная', ['liver', 'gall'], 0, 0], ['epi', 'надчревная', ['stomach', 'liver', 'pancreas'], 1, 0], ['lhyp', 'левая подреберная', ['spleen', 'stomach'], 2, 0],
    ['rlat', 'правая боковая', ['colAsc', 'kidR'], 0, 1], ['umb', 'пупочная', ['small', 'colTr'], 1, 1], ['llat', 'левая боковая', ['colDesc', 'kidL'], 2, 1],
    ['ring', 'правая паховая', ['cecum', 'appendix'], 0, 2], ['hypo', 'лобковая', ['bladder', 'small'], 1, 2], ['ling', 'левая паховая', ['sigm'], 2, 2],
  ].map(([id, name, organs, c, r]) => ({ id, name, organs, m: patch(XB[c], XB[c + 1], YB[r + 1], YB[r], '#F2C14E'), c: V3((XB[c] + XB[c + 1]) / 2, (YB[r] + YB[r + 1]) / 2, zf((XB[c] + XB[c + 1]) / 2) + 0.05) }));
  const lines9 = [...XB.slice(1, 3).map((x) => line([V3(x, YB[0] + 0.2, zf(x) + 0.01), V3(x, YB[3] - 0.15, zf(x) + 0.01)], '#F2C14E')), ...YB.slice(1, 3).map((y) => line(Array.from({ length: 9 }, (_, i) => { const x = -1.15 + i * 0.2875; return V3(x, y, zf(x) + 0.01); }), '#F2C14E'))];
  const UMB = V3(0.03, 10.65, zf(0) + 0.02), ASIS_R = V3(-1.23, 9.75, 0.48);
  const Q4 = [['ruq', 'правый верхний квадрант', ['liver', 'gall', 'colAsc', 'kidR'], -1, 1], ['luq', 'левый верхний квадрант', ['stomach', 'spleen', 'pancreas', 'kidL'], 1, 1], ['rlq', 'правый нижний квадрант', ['cecum', 'appendix', 'small'], -1, 0], ['llq', 'левый нижний квадрант', ['colDesc', 'sigm', 'small'], 1, 0]]
    .map(([id, name, organs, sx, sy]) => ({ id, name, organs, m: patch(sx < 0 ? -1.15 : UMB.x, sx < 0 ? UMB.x : 1.2, sy ? UMB.y : 8.95, sy ? 12.0 : UMB.y, '#7FD6FF'), c: V3(sx * 0.55, sy ? 11.3 : 9.8, zf(sx * 0.55) + 0.05) }));
  const lines4 = [line([V3(UMB.x, 12.2, zf(0) + 0.01), V3(UMB.x, 8.8, zf(0) + 0.01)], '#7FD6FF'), line(Array.from({ length: 9 }, (_, i) => { const x = -1.15 + i * 0.2875; return V3(x, UMB.y, zf(x) + 0.01); }), '#7FD6FF')];
  const tpy = line(Array.from({ length: 9 }, (_, i) => { const x = -1.15 + i * 0.2875; return V3(x, 11.3, zf(x) + 0.01); }), '#FFFFFF'); tpy.material.opacity = 0.45;
  const umb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: '#FFFFFF' })); umb.position.copy(UMB); RG.add(umb);
  const mcb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: '#FF5A5A' })); mcb.position.copy(UMB).lerp(ASIS_R, 2 / 3); mcb.position.z = zf(mcb.position.x) + 0.03; RG.add(mcb);

  /* ---------- состояние и обновление ---------- */
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; st.sel = null; flyFor(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function flyFor() {
    let v = VV(st.mode);
    if (st.mode === 'planes' && !mqm.matches) v = PVIEW[st.plane];
    if (st.mode === 'planes' && mqm.matches) v = [V3(0, 8.6, 0), PVIEW[st.plane][1].clone().setX(PVIEW[st.plane][1].x * 0.62).setZ(PVIEW[st.plane][1].z * 0.62)];
    if (st.mode === 'cav' && (st.cav === 'all' || st.cav === 'dorsal')) v = mqm.matches ? [V3(0, 12.0, -1.5), V3(24, 12.5, 4)] : VIEW.cavSide;
    if (st.mode === 'cav' && st.cav === 'reg') v = mqm.matches ? VIEWM.reg : [V3(-1.7, 8.9, 0), V3(-0.4, 9.8, 14)];
    if (st.mode === 'dirs') v = mqm.matches ? [DIRS[st.dir].view[0].clone().setX(0).setY(Math.max(8.6, DIRS[st.dir].view[0].y)), DIRS[st.dir].view[1].clone().multiplyScalar(0.75)] : [DIRS[st.dir].view[0].clone().add(V3(-0.9, 0, 0)), DIRS[st.dir].view[1]];
    st.fly = flyTarget(v[0], v[1]);
  }
  let clipOn = null;
  function setClip(on) {
    if (on === clipOn) return; clipOn = on;
    CMATS.forEach((m) => { m.clippingPlanes = on ? [CLIP] : []; m.needsUpdate = true; });
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    const M = st.mode;
    PL.visible = M === 'planes'; DG.visible = M === 'dirs'; CG.visible = M === 'cav' && st.cav !== 'reg'; RG.visible = M === 'cav' && st.cav === 'reg';
    // плоскость и срез
    if (M === 'planes') {
      const [a, b, c0] = PRANGE[st.plane];
      if (st.sweep && st.plane !== 'all') { st.ph += dt * 0.25; st.pos = a + (b - a) * (Math.sin(st.ph - Math.PI / 2) * 0.5 + 0.5); } else st.pos = c0;
      Object.entries(PLN).forEach(([k, g]) => { g.visible = k === st.plane || st.plane === 'all'; });
      if (st.plane === 'all') { PLN.sag.position.x = 0.03; PLN.front.position.z = 0.2; PLN.trans.position.y = 12.6; }
      const g = PLN[st.plane] || PLN.sag;
      if (st.plane === 'sag') { g.position.x = st.pos; CLIP.normal.set(-1, 0, 0); CLIP.constant = st.pos; }
      if (st.plane === 'front') { g.position.z = st.pos; CLIP.normal.set(0, 0, -1); CLIP.constant = st.pos; }
      if (st.plane === 'trans') { g.position.y = st.pos; CLIP.normal.set(0, -1, 0); CLIP.constant = st.pos; }
      setClip(st.cut && st.plane !== 'all');
    } else if (M === 'cav' && st.cav !== 'reg' && (st.cav === 'all' || st.cav === 'dorsal')) { CLIP.normal.set(-1, 0, 0); CLIP.constant = 0.03; setClip(true); } else setClip(false);
    // подсветка органов
    const regList = st.reg === 'r9' ? R9 : Q4, selReg = M === 'cav' && st.cav === 'reg' ? regList.find((r) => r.id === st.sel) : null;
    Object.entries(ORG).forEach(([id, m]) => {
      const hot = selReg && selReg.organs.includes(id);
      const dim = M === 'cav' && st.cav !== 'reg' ? 0.35 : 1;
      m.material.emissiveIntensity = hot ? 0.35 + 0.2 * Math.sin(t * 5) : 0.06 * dim;
      if (selReg !== st._selReg0 && !(M === 'cav' && st.cav !== 'reg')) { const fade = !!selReg && !hot; m.material.transparent = fade; m.material.opacity = fade ? 0.25 : 1; m.material.depthWrite = !fade; m.material.needsUpdate = true; }
      m.visible = M !== 'dirs' || ['brain', 'heart', 'lungR', 'lungL', 'liver', 'stomach'].includes(id);
      if (m.material.opacity !== undefined && !m.material.transparent) { /* непрозрачные */ }
    });
    st._selReg0 = selReg;
    shellMat.uniforms.uRim.value = M === 'dirs' ? 0.8 : M === 'cav' && st.cav === 'reg' ? 0.7 : 0.55;
    if (M === 'dirs') Object.entries(DIRS).forEach(([k, d]) => { d.g.visible = k === st.dir; d.g.traverse((o) => { if (o.material) o.material.opacity = 0.75 + 0.25 * Math.sin(t * 3); }); });
    const ghost = M === 'cav' && st.cav !== 'reg';
    if (ghost !== st._ghost) { st._ghost = ghost; boneMat.transparent = ghost; boneMat.opacity = ghost ? 0.18 : 1; boneMat.depthWrite = !ghost; boneMat.needsUpdate = true; Object.values(ORG).forEach((m) => { if (m === ORG.diaph) return; m.material.transparent = ghost; m.material.opacity = ghost ? 0.22 : 1; m.material.depthWrite = !ghost; m.material.needsUpdate = true; }); }
    if (ghost) { const set = CAVSET[st.cav]; Object.entries(CAV).forEach(([k, m]) => { const on = set.includes(k); m.visible = true; m.material.opacity = on ? 0.42 + 0.08 * Math.sin(t * 3) : 0.05; m.material.emissiveIntensity = on ? 0.35 : 0.05; }); }
    if (M === 'cav' && st.cav === 'reg') {
      R9.forEach((r) => { r.m.visible = st.reg === 'r9'; r.m.material.opacity = r.id === st.sel ? 0.45 + 0.1 * Math.sin(t * 4) : 0.08; });
      Q4.forEach((r) => { r.m.visible = st.reg === 'q4'; r.m.material.opacity = r.id === st.sel ? 0.45 + 0.1 * Math.sin(t * 4) : 0.08; }); tpy.visible = st.reg === 'r9';
      lines9.forEach((m) => { m.visible = st.reg === 'r9'; }); lines4.forEach((m) => { m.visible = st.reg === 'q4'; }); mcb.visible = st.reg === 'q4' || st.sel === 'ring';
    }
  }

  const PNAME = { all: 'Все три', sag: 'Сагиттальная', front: 'Фронтальная', trans: 'Поперечная' };
  const PTXTALL = '<b>Анатомическая позиция</b> — все описания в анатомии ведутся так, будто человек стоит прямо, смотрит вперёд, руки опущены вдоль тела <b>ладонями вперёд</b>, стопы вместе. «Правое» и «левое» — всегда стороны самого человека, а не зрителя (поэтому на картинке спереди правая сторона тела — слева). Через тело проводят три взаимно перпендикулярные плоскости: <b>сагиттальную</b> (зелёная), <b>фронтальную</b> (голубая) и <b>поперечную</b> (розовая). Выберите любую, чтобы разрезать по ней тело.';
  const PTXT = {
    base: '<b>Анатомическая позиция</b> — все описания в анатомии ведутся так, будто человек стоит прямо, смотрит вперёд, руки опущены вдоль тела <b>ладонями вперёд</b>, стопы вместе. «Правое» и «левое» — всегда стороны самого человека, а не зрителя (поэтому на картинке спереди правая сторона тела — слева). Через тело проводят три взаимно перпендикулярные плоскости.',
    all: PTXTALL,
    sag: '<b>Сагиттальная плоскость</b> (от лат. sagitta — стрела) идёт спереди назад и делит тело на правую и левую части. Единственная сагиттальная плоскость точно посередине — <b>срединная</b> (медианная); остальные — парасагиттальные. Включите «Двигать» — плоскость пойдёт через тело, и станет видно, какие органы она пересекает. На МРТ сагиттальные срезы показывают, например, позвоночник и спинной мозг по всей длине.',
    front: '<b>Фронтальная плоскость</b> (корональная, от лат. corona — венец: идёт как ободок венка через голову) параллельна лбу и делит тело на <b>переднюю</b> и <b>заднюю</b> части. На обычной рентгенограмме грудной клетки в прямой проекции всё тело как бы «сплющено» во фронтальную плоскость.',
    trans: '<b>Поперечная плоскость</b> (горизонтальная, на КТ и МРТ — <b>аксиальная</b>) перпендикулярна длинной оси тела и делит его на <b>верхнюю</b> и <b>нижнюю</b> части. Почти все снимки КТ — серии поперечных срезов; их принято смотреть «снизу», со стороны ног пациента, поэтому правая сторона тела на снимке слева.',
  };
  const DTXT = {
    sup: '<b>Верхний</b> (краниальный — ближе к голове) и <b>нижний</b> (каудальный — ближе к «хвосту», к копчику). Сердце расположено выше диафрагмы, мочевой пузырь — ниже пупка. Для конечностей «верхний/нижний» стараются не использовать — там есть проксимальный и дистальный. В мозге и у эмбриона вместо этого часто говорят «ростральный» (к носу).',
    ant: '<b>Передний</b> (вентральный — со стороны живота) и <b>задний</b> (дорсальный — со стороны спины). Грудина лежит кпереди от сердца, позвоночник — кзади. На кисти вместо этого — ладонный и тыльный, на стопе — подошвенный и тыльный.',
    med: '<b>Медиальный</b> — ближе к срединной линии тела (зелёная вертикаль), <b>латеральный</b> — дальше от неё, в сторону. В анатомической позиции большой палец руки лежит латерально, мизинец — медиально; локтевая кость медиальнее лучевой. Лёгкие расположены латеральнее сердца.',
    prox: '<b>Проксимальный</b> — ближе к месту прикрепления конечности к туловищу (или к началу структуры), <b>дистальный</b> — дальше от него. Локоть проксимальнее кисти, колено дистальнее бедра. Так же говорят и о сосудах, нервах, кишке: проксимальный отдел тонкой кишки ближе к желудку.',
    deep: '<b>Поверхностный</b> — ближе к поверхности тела, <b>глубокий</b> — дальше от неё. Кожа поверхностнее мышц, а бедренная кость — глубже всех тканей бедра. Отсюда «поверхностные» и «глубокие» вены ног: тромб в глубоких венах опаснее.',
    ipsi: '<b>Ипсилатеральный</b> — на той же стороне тела (левая кисть и левая стопа — зелёная дуга), <b>контралатеральный</b> — на противоположной (левая кисть и правая стопа — оранжевая). Важно в неврологии: левое полушарие управляет мышцами правой половины тела — инсульт слева даёт контралатеральный паралич справа. <b>Билатеральный</b> — с обеих сторон.',
  };
  const CAVTXT = {
    all: '<b>Полости тела</b> — замкнутые пространства, где лежат органы. <b>Дорсальная</b> (задняя) полость — <b>полость черепа</b> и <b>позвоночный канал</b>: в них головной и спинной мозг под защитой кости и оболочек. <b>Вентральная</b> (передняя) делится <b>диафрагмой</b> на <b>грудную</b> полость (две плевральные полости с лёгкими и средостение с сердцем в перикарде) и <b>брюшно-тазовую</b> — брюшную полость и полость малого таза. Выберите группу.',
    dorsal: '<b>Дорсальная полость</b>: полость черепа (голубая) продолжается через большое затылочное отверстие в <b>позвоночный канал</b> (зелёный) — общая система, заполненная спинномозговой жидкостью. Поэтому пункцию для анализа ликвора делают в пояснице, ниже конца спинного мозга (уровень L3–L4).',
    thor: '<b>Грудная полость</b>: две <b>плевральные</b> полости (голубые) вокруг лёгких — щель между листками плевры с каплей жидкости; если туда попадает воздух (пневмоторакс), лёгкое спадается. Посередине — <b>средостение</b> (жёлтое — его верхняя часть): трахея, пищевод, крупные сосуды и <b>сердце</b> в своей полости — <b>перикардиальной</b> (розовая). Скопление жидкости в перикарде (тампонада) сдавливает сердце.',
    abd: '<b>Брюшно-тазовая полость</b>: <b>брюшная</b> (жёлтая) с желудком, печенью, кишечником, селезёнкой, почками (они лежат позади брюшины) и <b>тазовая</b> (фиолетовая) с мочевым пузырём, прямой кишкой и половыми органами. Сверху её отделяет диафрагма, внутри выстилает брюшина; между её листками — брюшинная полость (воспаление — перитонит).',
    reg: '<b>Области живота</b> помогают врачу описать, где болит и что там прощупывается. По Неттеру живот делят две горизонтальные плоскости — <b>подрёберная</b> (через нижние точки X рёбер, уровень L3) и <b>межбугорковая</b> (через бугорки подвздошных гребней, L5), — и две вертикальные <b>среднеключичные</b> линии, проходящие через середины паховых связок: получается <b>9 областей</b>. (В отечественных учебниках нижнюю линию часто проводят между передними верхними подвздошными остями, а вертикали — по наружным краям прямых мышц.) Белый пунктир — <b>транспилорическая плоскость</b> (L1): привратник, головка поджелудочной, ворота почек. Проще — <b>4 квадранта</b>: вертикаль и горизонталь через пупок. Выберите область: подсветятся органы, которые в неё проецируются.',
  };
  const REGTXT = {
    rhyp: '<b>Правая подреберная область</b>: печень и желчный пузырь. Боль здесь после жирной еды — типичный признак желчной колики; при холецистите боль усиливается на вдохе при нажатии под рёберной дугой (симптом Мёрфи).',
    epi: '<b>Надчревная (эпигастральная) область</b>: желудок, левая доля печени, поджелудочная железа, двенадцатиперстная кишка. Боль «под ложечкой» — гастрит, язва; но также может начинаться инфаркт миокарда нижней (диафрагмальной) стенки — гастралгическая форма — и аппендицит.',
    lhyp: '<b>Левая подреберная область</b>: селезёнка, дно желудка, левый (селезёночный) изгиб ободочной кишки. Увеличенная селезёнка (при мононуклеозе) прощупывается из-под рёберной дуги и легко рвётся при травме.',
    rlat: '<b>Правая боковая область</b>: восходящая ободочная кишка, сзади — правая почка (почки лежат забрюшинно, у задней стенки).',
    umb: '<b>Пупочная область</b>: петли тонкой кишки, поперечная ободочная кишка. Здесь начинается боль при аппендиците — потом она смещается в правую паховую область.',
    llat: '<b>Левая боковая область</b>: нисходящая ободочная кишка, сзади — левая почка.',
    ring: '<b>Правая паховая (подвздошная) область</b>: слепая кишка и <b>червеобразный отросток</b> (аппендикс). Точка Мак-Бёрни (красная) — на границе наружной и средней трети линии от пупка к передней верхней подвздошной ости: здесь при аппендиците максимальная болезненность.',
    hypo: '<b>Лобковая (надлобковая) область</b>: мочевой пузырь (растянутый — прощупывается над лобком), у женщин — матка, петли тонкой кишки.',
    ling: '<b>Левая паховая область</b>: сигмовидная кишка. Боль здесь у пожилых — частый признак дивертикулита.',
    ruq: '<b>Правый верхний квадрант</b>: печень, желчный пузырь, двенадцатиперстная кишка, правый изгиб ободочной кишки, правая почка.',
    luq: '<b>Левый верхний квадрант</b>: желудок, селезёнка, тело и хвост поджелудочной железы, левая почка.',
    rlq: '<b>Правый нижний квадрант</b>: слепая кишка, червеобразный отросток (точка Мак-Бёрни — красная), конец тонкой кишки, у женщин — правый яичник.',
    llq: '<b>Левый нижний квадрант</b>: сигмовидная и нисходящая кишка, петли тонкой кишки, у женщин — левый яичник.',
  };
  const L1 = () => st.labels && st.mode === 'planes', L2 = () => st.labels && st.mode === 'dirs', L3 = () => st.labels && st.mode === 'cav' && st.cav !== 'reg', L4 = () => st.labels && st.mode === 'cav' && st.cav === 'reg';
  const labels = [
    { text: 'срединная (медианная) плоскость', pos: () => V3(st.plane === 'all' ? 0.03 : st.pos, 18.0, 0.2), color: '#7FE0A0', show: () => L1() && (st.plane === 'all' || (st.plane === 'sag' && Math.abs(st.pos - 0.03) < 0.1)) },
    { text: 'парасагиттальная плоскость', pos: () => V3(st.pos, 18.0, 0.2), color: '#7FE0A0', show: () => L1() && st.plane === 'sag' && Math.abs(st.pos - 0.03) >= 0.1 },
    { text: 'фронтальная (корональная)', pos: () => V3(2.4, 18.0, st.plane === 'all' ? 0.2 : st.pos), color: '#7FD6FF', show: () => L1() && (st.plane === 'front' || st.plane === 'all') },
    { text: 'поперечная (аксиальная)', pos: () => V3(2.6, (st.plane === 'all' ? 12.6 : st.pos) + 0.2, 2.4), color: '#FF8AB0', show: () => L1() && (st.plane === 'trans' || st.plane === 'all') },
    { text: 'справа', pos: V3(-2.2, 15.8, 0.4), color: '#B8C4D8', show: () => (L1() || L2()) && Math.abs(camera.position.x - controls.target.x) < Math.abs(camera.position.z - controls.target.z) },
    { text: 'слева', pos: V3(2.0, 15.8, 0.4), color: '#B8C4D8', show: () => (L1() || L2()) && Math.abs(camera.position.x - controls.target.x) < Math.abs(camera.position.z - controls.target.z) },
    { text: 'верхний', pos: V3(-3.0, 18.0, 0.3), color: '#F2C14E', show: () => L2() && st.dir === 'sup' },
    { text: 'нижний', pos: V3(-3.0, 0.1, 0.3), color: '#F2C14E', show: () => L2() && st.dir === 'sup' },
    { text: 'краниальный', pos: V3(2.5, 15.4, 0.6), color: '#FFB86A', show: () => L2() && st.dir === 'sup' },
    { text: 'каудальный', pos: V3(2.5, 8.8, 0.6), color: '#FFB86A', show: () => L2() && st.dir === 'sup' },
    { text: 'передний (вентральный)', pos: V3(0, 13.0, 2.8), color: '#7FD6FF', show: () => L2() && st.dir === 'ant' },
    { text: 'задний (дорсальный)', pos: V3(0, 13.0, -2.6), color: '#7FD6FF', show: () => L2() && st.dir === 'ant' },
    { text: 'латеральный', pos: V3(2.7, 13.4, 1.6), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'медиальный', pos: V3(0.25, 13.5, 1.6), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'срединная линия', pos: V3(0.1, 8.8, 1.3), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'плечо — проксимально', pos: J.shL.clone().add(V3(0.75, 0.3, 0.5)), color: '#FF8AB0', show: () => L2() && st.dir === 'prox' },
    { text: 'кисть — дистально', pos: J.hdL.clone().add(V3(0.6, -0.9, 0.5)), color: '#FF8AB0', show: () => L2() && st.dir === 'prox' },
    { text: 'бедро — проксимально', pos: J.hpL.clone().add(V3(0.85, 0, 0.6)), color: '#FFB0D0', show: () => L2() && st.dir === 'prox' },
    { text: 'стопа — дистально', pos: J.anL.clone().add(V3(0.75, -0.7, 0.6)), color: '#FFB0D0', show: () => L2() && st.dir === 'prox' },
    { text: 'поверхностный: кожа', pos: V3(J.knL.x + 0.2, 7.55, 1.65), color: '#C77DFF', show: () => L2() && st.dir === 'deep' },
    { text: 'глубокий: кость', pos: V3(J.knL.x + 0.3, 6.75, 0.1), color: '#C77DFF', show: () => L2() && st.dir === 'deep' },
    { text: 'ипсилатерально', pos: J.hdL.clone().lerp(J.anL, 0.5).add(V3(1.3, 0, 1.0)), color: '#7FE0A0', show: () => L2() && st.dir === 'ipsi' },
    { text: 'контралатерально', pos: J.hdL.clone().lerp(J.anR, 0.5).add(V3(-0.6, 0, 1.2)), color: '#FF9A5C', show: () => L2() && st.dir === 'ipsi' },
    { text: 'полость черепа', pos: V3(0.6, 16.9, 0.3), color: '#9FB4FF', show: () => L3() && CAVSET[st.cav].includes('cranial') },
    { text: 'позвоночный канал', pos: V3(0.6, 12.5, -0.6), color: '#7FE0A0', show: () => L3() && CAVSET[st.cav].includes('vert') },
    { text: 'плевральная полость', pos: V3(-1.95, 13.6, 0.3), color: '#7FD6FF', show: () => L3() && CAVSET[st.cav].includes('pleuR') },
    { text: 'перикардиальная полость', pos: V3(0.8, 12.35, 0.9), color: '#FF8AB0', show: () => L3() && CAVSET[st.cav].includes('peri') },
    { text: 'верхнее средостение', pos: V3(0.4, 14.55, 0.5), color: '#F2C14E', show: () => L3() && CAVSET[st.cav].includes('medi') },
    { text: 'диафрагма', pos: V3(1.25, 12.2, 0.5), color: '#FF9A5C', show: () => L3() && st.cav !== 'dorsal' },
    { text: 'брюшная полость', pos: V3(1.15, 10.7, 0.6), color: '#F2D27A', show: () => L3() && CAVSET[st.cav].includes('abd') },
    { text: 'полость таза', pos: V3(0.75, 9.0, 0.4), color: '#C77DFF', show: () => L3() && CAVSET[st.cav].includes('pelv') },
    ...['r9', 'q4'].flatMap((rg) => (rg === 'r9' ? R9 : Q4).map((r) => ({ text: r.name, pos: r.c.clone().add(V3(-0.25, 0, 0)), color: rg === 'r9' ? '#F2C14E' : '#7FD6FF', show: () => L4() && st.reg === rg && (!st.sel || st.sel === r.id) }))),
    { text: 'пупок', pos: UMB.clone().add(V3(0.05, 0, 0.03)), color: '#FFFFFF', show: () => L4() && !st.sel },
    { text: 'подрёберная (L3)', pos: V3(1.25, YB[1], zf(1.15) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'межбугорковая (L5)', pos: V3(1.25, YB[2], zf(1.15) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'среднеключичная', pos: V3(XB[2] + 0.05, YB[0] + 0.25, zf(XB[2]) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'транспилорическая (L1)', pos: V3(1.25, 11.3, zf(1.15) + 0.05), color: '#FFFFFF', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'точка Мак-Бёрни', pos: mcb.position.clone().add(V3(-1.3, -0.15, 0.1)), color: '#FF5A5A', show: () => L4() && mcb.visible },
    ...Object.keys(ORG).map((id) => ({ text: ORGNAME[id], pos: () => ORG[id].getWorldPosition(V3(0, 0, 0)).add(V3(id.endsWith('R') ? -0.6 : 0.4, 0, 0.6)), color: '#' + new THREE.Color(ORG[id].userData.col).lerp(new THREE.Color('#ffffff'), 0.55).getHexString(), show: () => L4() && !!st.sel && (st.reg === 'r9' ? R9 : Q4).find((r) => r.id === st.sel)?.organs.includes(id) })),
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'planes' ? PTXT[st.plane] + (st.plane === 'all' ? '' : '<br><br>' + PTXT.base) : st.mode === 'dirs' ? DTXT[st.dir] : st.cav === 'reg' ? (st.sel ? REGTXT[st.sel] : CAVTXT.reg) : CAVTXT[st.cav];
      if (st.err) s += '<br><br><i>Модель скелета не загрузилась: ' + st.err + '</i>';
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'planes', label: 'Плоскости' }, { id: 'dirs', label: 'Направления' }, { id: 'cav', label: 'Полости и области' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'planes') box.append(h('div', { class: 'glabel' }, 'Плоскость'), h('div', { class: 'gctl' }, seg(Object.entries(PNAME).map(([id, label]) => ({ id, label })), () => st.plane, (v) => { st.plane = v; st.ph = 0; flyFor(); refs.setInfo(); }), toggle('Разрезать', () => st.cut, (v) => { st.cut = v; }), toggle('Двигать', () => st.sweep, (v) => { st.sweep = v; })));
      else if (st.mode === 'dirs') box.append(h('div', { class: 'glabel' }, 'Термины'), h('div', { class: 'gctl' }, seg(Object.entries(DIRNAME).map(([id, label]) => ({ id, label })), () => st.dir, (v) => { st.dir = v; flyFor(); refs.setInfo(); })));
      else {
        const top = seg([{ id: 'all', label: 'Все полости' }, { id: 'dorsal', label: 'Дорсальная' }, { id: 'thor', label: 'Грудная' }, { id: 'abd', label: 'Брюшно-тазовая' }, { id: 'reg', label: 'Области живота' }], () => st.cav, (v) => { st.cav = v; st.sel = null; flyFor(); refs.rebuild(); refs.setInfo(); });
        const kids = [top];
        if (st.cav === 'reg') { kids.push(seg([{ id: 'r9', label: '9 областей' }, { id: 'q4', label: '4 квадранта' }], () => st.reg, (v) => { st.reg = v; st.sel = null; refs.rebuild(); refs.setInfo(); })); kids.push(seg((st.reg === 'r9' ? R9 : Q4).map((r) => ({ id: r.id, label: r.name })), () => st.sel, (v) => { st.sel = st.sel === v ? null : v; refs.setInfo(); })); }
        box.append(h('div', { class: 'glabel' }, 'Что показать'), h('div', { class: 'gctl' }, ...kids));
      }
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['planes', 'dirs', 'cav'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'planes' && st.plane === 'all') return [['Плоскость', PNAME.all, '']];
    if (st.mode === 'planes') { const p = st.plane === 'trans' ? Math.round(st.pos * 10) : Math.round(st.pos * 10); return [['Плоскость', PNAME[st.plane], ''], [st.plane === 'trans' ? 'Высота от пола' : st.plane === 'sag' ? 'От срединной линии' : 'От центра тела', st.plane === 'trans' ? p : (p > 0 ? '+' : '') + p, 'см']]; }
    if (st.mode === 'cav' && st.cav === 'reg') { const r = (st.reg === 'r9' ? R9 : Q4).find((x) => x.id === st.sel); return [['Областей', st.reg === 'r9' ? 9 : 4, ''], ['Органов в области', r ? r.organs.length : '—', '']]; }
    return [['Рост модели', '≈ 172', 'см']];
  }
  const self = {
    mobZoom: 0.5, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Тело · основы', title: 'Плоскости, направления и полости',
    lede: 'Прежде чем изучать органы, анатомы договорились, как описывать их положение: из какой позы смотреть, как резать и куда показывать.',
    notes: `
      <div><h2>Язык анатомии</h2>
        <p>Все термины положения отсчитываются от <b>анатомической позиции</b>: человек стоит, лицо и ладони обращены вперёд, стопы вместе. Плоскости: <b>сагиттальные</b> (одна из них — срединная), <b>фронтальные</b> (корональные), <b>поперечные</b> (горизонтальные, аксиальные). Оси: вертикальная, сагиттальная (переднезадняя), фронтальная (поперечная) — вокруг них идут движения в суставах.</p>
        <h3>Пары терминов</h3><ul><li>верхний (краниальный) — нижний (каудальный);</li><li>передний (вентральный) — задний (дорсальный); ладонный — тыльный; подошвенный — тыльный;</li><li>медиальный — латеральный; промежуточный;</li><li>проксимальный — дистальный;</li><li>поверхностный — глубокий; наружный — внутренний (для стенок полостей);</li><li>ипсилатеральный — контралатеральный; билатеральный.</li></ul>
        <h3>Полости</h3><p>Дорсальная: полость черепа и позвоночный канал. Вентральная: грудная (плевральные полости, средостение, перикардиальная полость) и брюшно-тазовая (брюшная полость и полость малого таза), разделены диафрагмой.</p></div>
      <div><h2>Условности</h2><ul><li>Скелет — настоящая 3D-модель (Sketchfab, CC BY); силуэт тела и органы — схемы, размеры и положение органов примерные.</li><li>Границы 9 областей проведены по упрощённым ориентирам.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('planes'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
export { makePlanes };
