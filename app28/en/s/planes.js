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
  const ORGNAME = { brain: 'brain', cord: 'spinal cord', lungR: 'right lung', lungL: 'left lung', heart: 'heart', diaph: 'diaphragm', liver: 'liver', gall: 'gallbladder', stomach: 'stomach', spleen: 'spleen', pancreas: 'pancreas', kidR: 'right kidney', kidL: 'left kidney', colAsc: 'ascending colon', colTr: 'transverse colon', colDesc: 'descending colon', sigm: 'sigmoid colon', cecum: 'cecum', appendix: 'vermiform appendix', cauda: 'cauda equina', small: 'small intestine', bladder: 'urinary bladder' };

  /* ---------- 1. плоскости ---------- */
  const PL = new THREE.Group(); G.add(PL);
  const planeMesh = (w, h, col) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })); const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.8 })); g.add(m, e); PL.add(g); return g; };
  const PLN = { sag: planeMesh(5.5, 18.6, '#7FE0A0'), front: planeMesh(5.5, 18.6, '#9A8CFF'), trans: planeMesh(5.5, 4.5, '#FF8AB0') };
  PLN.sag.rotation.y = Math.PI / 2; PLN.sag.position.set(0, 9.1, 0.2); PLN.front.position.set(0, 9.1, 0.2); PLN.trans.rotation.x = -Math.PI / 2; PLN.trans.position.set(0, 12, 0.2);
  const PRANGE = { all: [0, 0, 0], sag: [-1.4, 1.4, 0.03], front: [-0.7, 0.9, 0.2], trans: [1.0, 17.0, 12.6] };
  // «все три» — ракурс 3/4 сверху (азимут ~35°, возвышение ~20°): каждая плоскость читается как плоскость, а не ребро
  const PVIEW = { all: [V3(0, 8.7, 0), V3(24.5, 24.0, 35.0)], sag: [V3(0, 8.7, 0), V3(38, 13, 25)], front: [V3(0, 8.7, 0), V3(13, 13, 44)], trans: [V3(0, 9.4, 0), V3(15, 34, 31)] };

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
  const DIRNAME = { sup: 'Superior ↔ inferior', ant: 'Anterior ↔ posterior', med: 'Medial ↔ lateral', prox: 'Proximal ↔ distal', deep: 'Superficial ↔ deep', ipsi: 'Ipsi- and contralateral' };

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
    ['rhyp', 'right hypochondriac', ['liver', 'gall'], 0, 0], ['epi', 'epigastric', ['stomach', 'liver', 'pancreas'], 1, 0], ['lhyp', 'left hypochondriac', ['spleen', 'stomach'], 2, 0],
    ['rlat', 'right lateral (lumbar)', ['colAsc', 'kidR'], 0, 1], ['umb', 'umbilical', ['small', 'colTr'], 1, 1], ['llat', 'left lateral (lumbar)', ['colDesc', 'kidL'], 2, 1],
    ['ring', 'right inguinal', ['cecum', 'appendix'], 0, 2], ['hypo', 'pubic', ['bladder', 'small'], 1, 2], ['ling', 'left inguinal', ['sigm'], 2, 2],
  ].map(([id, name, organs, c, r]) => ({ id, name, organs, m: patch(XB[c], XB[c + 1], YB[r + 1], YB[r], '#F2C14E'), c: V3((XB[c] + XB[c + 1]) / 2, (YB[r] + YB[r + 1]) / 2, zf((XB[c] + XB[c + 1]) / 2) + 0.05) }));
  const lines9 = [...XB.slice(1, 3).map((x) => line([V3(x, YB[0] + 0.2, zf(x) + 0.01), V3(x, YB[3] - 0.15, zf(x) + 0.01)], '#F2C14E')), ...YB.slice(1, 3).map((y) => line(Array.from({ length: 9 }, (_, i) => { const x = -1.15 + i * 0.2875; return V3(x, y, zf(x) + 0.01); }), '#F2C14E'))];
  const UMB = V3(0.03, 10.65, zf(0) + 0.02), ASIS_R = V3(-1.23, 9.75, 0.48);
  const Q4 = [['ruq', 'right upper quadrant', ['liver', 'gall', 'colAsc', 'kidR'], -1, 1], ['luq', 'left upper quadrant', ['stomach', 'spleen', 'pancreas', 'kidL'], 1, 1], ['rlq', 'right lower quadrant', ['cecum', 'appendix', 'small'], -1, 0], ['llq', 'left lower quadrant', ['colDesc', 'sigm', 'small'], 1, 0]]
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
    if (st.mode === 'planes' && mqm.matches) v = [V3(0, 10.2, 0), PVIEW[st.plane][1].clone().sub(PVIEW[st.plane][0]).multiplyScalar(0.98).add(V3(0, 10.2, 0))];
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

  const PNAME = { all: 'All three', sag: 'Sagittal', front: 'Frontal', trans: 'Transverse' };
  const PTXTALL = '<b>Anatomical position</b> — all anatomical descriptions assume the person stands upright, looking forward, arms at the sides with <b>palms facing forward</b>, feet together. “Right” and “left” always mean the person’s own sides, not the viewer’s (so in a front view the right side of the body is on the left). Three mutually perpendicular planes pass through the body: <b>sagittal</b> (green), <b>frontal</b> (blue) and <b>transverse</b> (pink). Choose one to cut the body along it.';
  const PTXT = {
    base: '<b>Anatomical position</b> — all anatomical descriptions assume the person stands upright, looking forward, arms at the sides with <b>palms facing forward</b>, feet together. “Right” and “left” always mean the person’s own sides, not the viewer’s (so in a front view the right side of the body is on the left). Three mutually perpendicular planes pass through the body.',
    all: PTXTALL,
    sag: 'The <b>sagittal plane</b> (Latin sagitta — arrow) runs front to back and divides the body into right and left parts. The only sagittal plane exactly in the middle is the <b>median</b> (midsagittal) plane; the others are parasagittal. Turn on “Move” — the plane will sweep through the body and you will see which organs it cuts. On MRI, sagittal sections show, for example, the whole length of the spine and spinal cord.',
    front: 'The <b>frontal plane</b> (coronal, from Latin corona — crown: it runs like the band of a crown over the head) is parallel to the forehead and divides the body into <b>anterior</b> and <b>posterior</b> parts. On an ordinary frontal chest X-ray the whole body is, as it were, “flattened” into the frontal plane.',
    trans: 'The <b>transverse plane</b> (horizontal; on CT and MRI — <b>axial</b>) is perpendicular to the long axis of the body and divides it into <b>upper</b> and <b>lower</b> parts. Almost all CT images are series of transverse sections; by convention they are viewed “from below”, from the patient’s feet, so the right side of the body is on the left of the image.',
  };
  const DTXT = {
    sup: '<b>Superior</b> (cranial — toward the head) and <b>inferior</b> (caudal — toward the “tail”, the coccyx). The heart lies above the diaphragm, the bladder below the navel. For limbs “superior/inferior” are avoided — proximal and distal are used instead. In the brain and the embryo “rostral” (toward the nose) is often used.',
    ant: '<b>Anterior</b> (ventral — on the belly side) and <b>posterior</b> (dorsal — on the back side). The sternum lies anterior to the heart, the spine posterior. On the hand the terms are palmar and dorsal, on the foot plantar and dorsal.',
    med: '<b>Medial</b> — closer to the midline of the body (green vertical), <b>lateral</b> — farther from it, to the side. In the anatomical position the thumb is lateral and the little finger medial; the ulna is medial to the radius. The lungs lie lateral to the heart.',
    prox: '<b>Proximal</b> — closer to where the limb attaches to the trunk (or to the start of a structure), <b>distal</b> — farther from it. The elbow is proximal to the hand, the knee distal to the thigh. The same words are used for vessels, nerves and the gut: the proximal small intestine is closer to the stomach.',
    deep: '<b>Superficial</b> — closer to the body surface, <b>deep</b> — farther from it. Skin is superficial to muscle, and the femur is the deepest tissue of the thigh. Hence “superficial” and “deep” veins of the legs: a clot in the deep veins is more dangerous.',
    ipsi: '<b>Ipsilateral</b> — on the same side of the body (left hand and left foot — green arc), <b>contralateral</b> — on the opposite side (left hand and right foot — orange). Important in neurology: the left hemisphere controls the muscles of the right half of the body — a left-sided stroke causes contralateral paralysis on the right. <b>Bilateral</b> — on both sides.',
  };
  const CAVTXT = {
    all: '<b>Body cavities</b> are enclosed spaces that hold the organs. The <b>dorsal</b> (posterior) cavity is the <b>cranial cavity</b> and the <b>vertebral canal</b>: they hold the brain and spinal cord, protected by bone and meninges. The <b>ventral</b> (anterior) cavity is divided by the <b>diaphragm</b> into the <b>thoracic</b> cavity (two pleural cavities with the lungs and the mediastinum with the heart in the pericardium) and the <b>abdominopelvic</b> cavity — the abdominal cavity and the cavity of the lesser pelvis. Choose a group.',
    dorsal: '<b>Dorsal cavity</b>: the cranial cavity (blue) continues through the foramen magnum into the <b>vertebral canal</b> (green) — one system filled with cerebrospinal fluid. That is why a lumbar puncture for CSF is done in the lower back, below the end of the spinal cord (L3–L4 level).',
    thor: '<b>Thoracic cavity</b>: two <b>pleural</b> cavities (blue) around the lungs — a slit between the pleural layers with a drop of fluid; if air gets in (pneumothorax), the lung collapses. In the middle is the <b>mediastinum</b> (yellow — its superior part): trachea, esophagus, great vessels and the <b>heart</b> in its own cavity — the <b>pericardial</b> cavity (pink). Fluid accumulating in the pericardium (tamponade) compresses the heart.',
    abd: '<b>Abdominopelvic cavity</b>: the <b>abdominal</b> (yellow), with the stomach, liver, intestines, spleen and kidneys (which lie behind the peritoneum), and the <b>pelvic</b> (purple), with the bladder, rectum and reproductive organs. Above it is bounded by the diaphragm, inside it is lined by peritoneum; between its layers is the peritoneal cavity (inflammation — peritonitis).',
    reg: '<b>Abdominal regions</b> help a doctor describe where it hurts and what can be felt. Following Netter, the abdomen is divided by two horizontal planes — the <b>subcostal</b> (through the lowest points of the 10th ribs, level L3) and the <b>intertubercular</b> (through the tubercles of the iliac crests, L5) — and two vertical <b>midclavicular</b> lines passing through the midpoints of the inguinal ligaments: this gives <b>9 regions</b>. (Russian textbooks often draw the lower line between the anterior superior iliac spines and the verticals along the lateral edges of the rectus muscles.) The white dashed line is the <b>transpyloric plane</b> (L1): pylorus, head of the pancreas, renal hila. Simpler — <b>4 quadrants</b>: a vertical and a horizontal line through the navel. Choose a region to highlight the organs that project into it.',
  };
  const REGTXT = {
    rhyp: '<b>Right hypochondriac region</b>: liver and gallbladder. Pain here after fatty food is a typical sign of biliary colic; in cholecystitis the pain increases on inspiration while pressing under the costal margin (Murphy’s sign).',
    epi: '<b>Epigastric region</b>: stomach, left lobe of the liver, pancreas, duodenum. Pain “in the pit of the stomach” — gastritis, ulcer; but a myocardial infarction of the inferior (diaphragmatic) wall — the gastralgic form — and appendicitis can also start here.',
    lhyp: '<b>Left hypochondriac region</b>: spleen, fundus of the stomach, left (splenic) flexure of the colon. An enlarged spleen (in mononucleosis) can be felt below the costal margin and ruptures easily with trauma.',
    rlat: '<b>Right lateral (lumbar) region</b>: ascending colon; behind it the right kidney (the kidneys are retroperitoneal, on the posterior wall).',
    umb: '<b>Umbilical region</b>: loops of small intestine, transverse colon. Appendicitis pain starts here and later moves to the right inguinal region.',
    llat: '<b>Left lateral (lumbar) region</b>: descending colon; behind it the left kidney.',
    ring: '<b>Right inguinal (iliac) region</b>: cecum and the <b>vermiform appendix</b>. McBurney’s point (red) lies at the junction of the outer and middle thirds of the line from the navel to the anterior superior iliac spine: tenderness is greatest here in appendicitis.',
    hypo: '<b>Pubic (suprapubic) region</b>: bladder (when distended it can be felt above the pubis), in women the uterus, loops of small intestine.',
    ling: '<b>Left inguinal region</b>: sigmoid colon. Pain here in older people is a common sign of diverticulitis.',
    ruq: '<b>Right upper quadrant</b>: liver, gallbladder, duodenum, right flexure of the colon, right kidney.',
    luq: '<b>Left upper quadrant</b>: stomach, spleen, body and tail of the pancreas, left kidney.',
    rlq: '<b>Right lower quadrant</b>: cecum, vermiform appendix (McBurney’s point — red), end of the small intestine, in women the right ovary.',
    llq: '<b>Left lower quadrant</b>: sigmoid and descending colon, loops of small intestine, in women the left ovary.',
  };
  const L1 = () => st.labels && st.mode === 'planes', L2 = () => st.labels && st.mode === 'dirs', L3 = () => st.labels && st.mode === 'cav' && st.cav !== 'reg', L4 = () => st.labels && st.mode === 'cav' && st.cav === 'reg';
  const labels = [
    { text: 'median (midsagittal) plane', pos: () => V3(st.plane === 'all' ? 0.03 : st.pos, 18.0, 0.2), color: '#7FE0A0', show: () => L1() && (st.plane === 'all' || (st.plane === 'sag' && Math.abs(st.pos - 0.03) < 0.1)) },
    { text: 'parasagittal plane', pos: () => V3(st.pos, 18.0, 0.2), color: '#7FE0A0', show: () => L1() && st.plane === 'sag' && Math.abs(st.pos - 0.03) >= 0.1 },
    { text: 'frontal (coronal)', pos: () => V3(2.4, 18.0, st.plane === 'all' ? 0.2 : st.pos), color: '#9A8CFF', show: () => L1() && (st.plane === 'front' || st.plane === 'all') },
    { text: 'transverse (axial)', pos: () => V3(2.6, (st.plane === 'all' ? 12.6 : st.pos) + 0.2, 2.4), color: '#FF8AB0', show: () => L1() && (st.plane === 'trans' || st.plane === 'all') },
    { text: 'right', pos: V3(-2.2, 15.8, 0.4), color: '#B8C4D8', show: () => (L1() || L2()) && Math.abs(camera.position.x - controls.target.x) < Math.abs(camera.position.z - controls.target.z) },
    { text: 'left', pos: V3(2.0, 15.8, 0.4), color: '#B8C4D8', show: () => (L1() || L2()) && Math.abs(camera.position.x - controls.target.x) < Math.abs(camera.position.z - controls.target.z) },
    { text: 'superior', pos: V3(-3.0, 18.0, 0.3), color: '#F2C14E', show: () => L2() && st.dir === 'sup' },
    { text: 'inferior', pos: V3(-3.0, 0.1, 0.3), color: '#F2C14E', show: () => L2() && st.dir === 'sup' },
    { text: 'cranial', pos: V3(2.5, 15.4, 0.6), color: '#FFB86A', show: () => L2() && st.dir === 'sup' },
    { text: 'caudal', pos: V3(2.5, 8.8, 0.6), color: '#FFB86A', show: () => L2() && st.dir === 'sup' },
    { text: 'anterior (ventral)', pos: V3(0, 13.0, 2.8), color: '#7FD6FF', show: () => L2() && st.dir === 'ant' },
    { text: 'posterior (dorsal)', pos: V3(0, 13.0, -2.6), color: '#7FD6FF', show: () => L2() && st.dir === 'ant' },
    { text: 'lateral', pos: V3(2.7, 13.4, 1.6), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'medial', pos: V3(0.25, 13.5, 1.6), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'midline', pos: V3(0.1, 8.8, 1.3), color: '#7FE0A0', show: () => L2() && st.dir === 'med' },
    { text: 'shoulder — proximal', pos: J.shL.clone().add(V3(0.75, 0.3, 0.5)), color: '#FF8AB0', show: () => L2() && st.dir === 'prox' },
    { text: 'hand — distal', pos: J.hdL.clone().add(V3(0.6, -0.9, 0.5)), color: '#FF8AB0', show: () => L2() && st.dir === 'prox' },
    { text: 'thigh — proximal', pos: J.hpL.clone().add(V3(0.85, 0, 0.6)), color: '#FFB0D0', show: () => L2() && st.dir === 'prox' },
    { text: 'foot — distal', pos: J.anL.clone().add(V3(0.75, -0.7, 0.6)), color: '#FFB0D0', show: () => L2() && st.dir === 'prox' },
    { text: 'superficial: skin', pos: V3(J.knL.x + 0.2, 7.55, 1.65), color: '#C77DFF', show: () => L2() && st.dir === 'deep' },
    { text: 'deep: bone', pos: V3(J.knL.x + 0.3, 6.75, 0.1), color: '#C77DFF', show: () => L2() && st.dir === 'deep' },
    { text: 'ipsilateral', pos: J.hdL.clone().lerp(J.anL, 0.5).add(V3(1.3, 0, 1.0)), color: '#7FE0A0', show: () => L2() && st.dir === 'ipsi' },
    { text: 'contralateral', pos: J.hdL.clone().lerp(J.anR, 0.5).add(V3(-0.6, 0, 1.2)), color: '#FF9A5C', show: () => L2() && st.dir === 'ipsi' },
    { text: 'cranial cavity', pos: V3(0.6, 16.9, 0.3), color: '#9FB4FF', show: () => L3() && CAVSET[st.cav].includes('cranial') },
    { text: 'vertebral canal', pos: V3(0.6, 12.5, -0.6), color: '#7FE0A0', show: () => L3() && CAVSET[st.cav].includes('vert') },
    { text: 'pleural cavity', pos: V3(-1.95, 13.6, 0.3), color: '#7FD6FF', show: () => L3() && CAVSET[st.cav].includes('pleuR') },
    { text: 'pericardial cavity', pos: V3(0.8, 12.35, 0.9), color: '#FF8AB0', show: () => L3() && CAVSET[st.cav].includes('peri') },
    { text: 'superior mediastinum', pos: V3(0.4, 14.55, 0.5), color: '#F2C14E', show: () => L3() && CAVSET[st.cav].includes('medi') },
    { text: 'diaphragm', pos: V3(1.25, 12.2, 0.5), color: '#FF9A5C', show: () => L3() && st.cav !== 'dorsal' },
    { text: 'abdominal cavity', pos: V3(1.15, 10.7, 0.6), color: '#F2D27A', show: () => L3() && CAVSET[st.cav].includes('abd') },
    { text: 'pelvic cavity', pos: V3(0.75, 9.0, 0.4), color: '#C77DFF', show: () => L3() && CAVSET[st.cav].includes('pelv') },
    ...['r9', 'q4'].flatMap((rg) => (rg === 'r9' ? R9 : Q4).map((r) => ({ text: r.name, pos: r.c.clone().add(V3(-0.25, 0, 0)), color: rg === 'r9' ? '#F2C14E' : '#7FD6FF', show: () => L4() && st.reg === rg && (!st.sel || st.sel === r.id) }))),
    { text: 'navel', pos: UMB.clone().add(V3(0.05, 0, 0.03)), color: '#FFFFFF', show: () => L4() && !st.sel },
    { text: 'subcostal (L3)', pos: V3(1.25, YB[1], zf(1.15) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'intertubercular (L5)', pos: V3(1.25, YB[2], zf(1.15) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'midclavicular', pos: V3(XB[2] + 0.05, YB[0] + 0.25, zf(XB[2]) + 0.05), color: '#F2C14E', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'transpyloric (L1)', pos: V3(1.25, 11.3, zf(1.15) + 0.05), color: '#FFFFFF', show: () => L4() && st.reg === 'r9' && !st.sel },
    { text: 'McBurney’s point', pos: mcb.position.clone().add(V3(-1.3, -0.15, 0.1)), color: '#FF5A5A', show: () => L4() && mcb.visible },
    ...Object.keys(ORG).map((id) => ({ text: ORGNAME[id], pos: () => ORG[id].getWorldPosition(V3(0, 0, 0)).add(V3(id.endsWith('R') ? -0.6 : 0.4, 0, 0.6)), color: '#' + new THREE.Color(ORG[id].userData.col).lerp(new THREE.Color('#ffffff'), 0.55).getHexString(), show: () => L4() && !!st.sel && (st.reg === 'r9' ? R9 : Q4).find((r) => r.id === st.sel)?.organs.includes(id) })),
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'planes' ? PTXT[st.plane] + (st.plane === 'all' ? '' : '<br><br>' + PTXT.base) : st.mode === 'dirs' ? DTXT[st.dir] : st.cav === 'reg' ? (st.sel ? REGTXT[st.sel] : CAVTXT.reg) : CAVTXT[st.cav];
      if (st.err) s += '<br><br><i>The skeleton model failed to load: ' + st.err + '</i>';
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'planes', label: 'Planes' }, { id: 'dirs', label: 'Directions' }, { id: 'cav', label: 'Cavities and regions' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'planes') box.append(h('div', { class: 'glabel' }, 'Plane'), h('div', { class: 'gctl' }, seg(Object.entries(PNAME).map(([id, label]) => ({ id, label })), () => st.plane, (v) => { st.plane = v; st.ph = 0; flyFor(); refs.setInfo(); }), toggle('Cut', () => st.cut, (v) => { st.cut = v; }), toggle('Move', () => st.sweep, (v) => { st.sweep = v; })));
      else if (st.mode === 'dirs') box.append(h('div', { class: 'glabel' }, 'Terms'), h('div', { class: 'gctl' }, seg(Object.entries(DIRNAME).map(([id, label]) => ({ id, label })), () => st.dir, (v) => { st.dir = v; flyFor(); refs.setInfo(); })));
      else {
        const top = seg([{ id: 'all', label: 'All cavities' }, { id: 'dorsal', label: 'Dorsal' }, { id: 'thor', label: 'Thoracic' }, { id: 'abd', label: 'Abdominopelvic' }, { id: 'reg', label: 'Abdominal regions' }], () => st.cav, (v) => { st.cav = v; st.sel = null; flyFor(); refs.rebuild(); refs.setInfo(); });
        const kids = [top];
        if (st.cav === 'reg') { kids.push(seg([{ id: 'r9', label: '9 regions' }, { id: 'q4', label: '4 quadrants' }], () => st.reg, (v) => { st.reg = v; st.sel = null; refs.rebuild(); refs.setInfo(); })); kids.push(seg((st.reg === 'r9' ? R9 : Q4).map((r) => ({ id: r.id, label: r.name })), () => st.sel, (v) => { st.sel = st.sel === v ? null : v; refs.setInfo(); })); }
        box.append(h('div', { class: 'glabel' }, 'What to show'), h('div', { class: 'gctl' }, ...kids));
      }
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['planes', 'dirs', 'cav'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'planes' && st.plane === 'all') return [['Plane', PNAME.all, '']];
    if (st.mode === 'planes') { const p = st.plane === 'trans' ? Math.round(st.pos * 10) : Math.round(st.pos * 10); return [['Plane', PNAME[st.plane], ''], [st.plane === 'trans' ? 'Height above floor' : st.plane === 'sag' ? 'From midline' : 'From body center', st.plane === 'trans' ? p : (p > 0 ? '+' : '') + p, 'cm']]; }
    if (st.mode === 'cav' && st.cav === 'reg') { const r = (st.reg === 'r9' ? R9 : Q4).find((x) => x.id === st.sel); return [['Regions', st.reg === 'r9' ? 9 : 4, ''], ['Organs in region', r ? r.organs.length : '—', '']]; }
    return [['Model height', '≈ 172', 'cm']];
  }
  const self = {
    mobZoom: 0.5, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Body · basics', title: 'Planes, directions and cavities',
    lede: 'Before studying the organs, anatomists agreed on how to describe their position: from which pose to look, how to cut and where to point.',
    notes: `
      <div><h2>The language of anatomy</h2>
        <p>All terms of position are measured from the <b>anatomical position</b>: the person stands, face and palms forward, feet together. Planes: <b>sagittal</b> (one of them is the median plane), <b>frontal</b> (coronal), <b>transverse</b> (horizontal, axial). Axes: vertical, sagittal (anteroposterior), frontal (transverse) — joint movements take place around them.</p>
        <h3>Paired terms</h3><ul><li>superior (cranial) — inferior (caudal);</li><li>anterior (ventral) — posterior (dorsal); palmar — dorsal; plantar — dorsal;</li><li>medial — lateral; intermediate;</li><li>proximal — distal;</li><li>superficial — deep; external — internal (for walls of cavities);</li><li>ipsilateral — contralateral; bilateral.</li></ul>
        <h3>Cavities</h3><p>Dorsal: cranial cavity and vertebral canal. Ventral: thoracic (pleural cavities, mediastinum, pericardial cavity) and abdominopelvic (abdominal cavity and lesser pelvic cavity), separated by the diaphragm.</p></div>
      <div><h2>Simplifications</h2><ul><li>The skeleton is a real 3D model (Sketchfab, CC BY); the body silhouette and organs are diagrams, organ sizes and positions approximate.</li><li>The boundaries of the 9 regions use simplified landmarks.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('planes'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
export { makePlanes };
