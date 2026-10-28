import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, branchTree, button, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, pickOn, rand, randUnit, rnd, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ГРУДНАЯ КЛЕТКА И МОЛОЧНАЯ ЖЕЛЕЗА (учебная схема)
   ========================================================= */
const CH_PARTS = [
  { id: 'rib', name: 'Ribs', color: '#E8D8BB', text: '<b>Ribs</b> — 12 pairs. The first 7 pairs (true ribs) attach by cartilage directly to the sternum, pairs 8–10 (false ribs) attach to the cartilage of the rib above, and pairs 11–12 (floating ribs) end freely in the abdominal muscles. At the back, each rib articulates with a thoracic vertebra and rotates upward during inhalation, like a bucket handle.' },
  { id: 'stern', name: 'Sternum and clavicles', color: '#F2E6C8', text: '<b>The sternum</b> is a flat bone at the front: the manubrium, the body and the xiphoid process. The <b>clavicles</b> attach to the manubrium and connect the arm to the axial skeleton. The sternum contains red bone marrow — it is used for marrow biopsies.' },
  { id: 'spine', name: 'Thoracic spine', color: '#D8C8A8', text: '<b>The thoracic spine</b> consists of 12 vertebrae with articular facets for the ribs. Together with the ribs and sternum it forms the rib cage — a protective frame for the heart and lungs.' },
  { id: 'mus', name: 'Intercostal muscles and diaphragm', color: '#C86A6A', text: '<b>The intercostal muscles</b>: the external ones raise the ribs (inhalation), the internal ones lower them (forced exhalation). From below, the thoracic cavity is closed by the dome of the <b>diaphragm</b>. On the outside, the chest is covered by the pectoralis major and minor.' },
  { id: 'med', name: 'Mediastinal organs', color: '#E0605A', text: '<b>The mediastinum</b> is the space between the lungs: the heart in its pericardial sac, the aorta and the venae cavae, the trachea and main bronchi, the esophagus, the thymus, nerves and the thoracic duct. Each lung lies in its own pleural sac.' },
];
const BR_PARTS = [
  { id: 'lob', name: 'Lobes and lobules', color: '#F2B0C8', text: '<b>The glandular tissue</b> consists of 15–20 lobes radiating from the nipple like the spokes of a wheel. Each lobe is divided into lobules, and the lobules into tiny sacs (alveoli), where milk is produced during breastfeeding.' },
  { id: 'duct', name: 'Milk ducts', color: '#F2D88A', text: '<b>The milk ducts</b> collect milk from the lobules and open onto the nipple through 15–20 openings. Just before the nipple they widen slightly.' },
  { id: 'nip', name: 'Nipple and areola', color: '#C88070', text: '<b>The nipple</b> and the pigmented <b>areola</b> around it contain smooth muscle fibers and Montgomery glands, which secrete a protective fluid.' },
  { id: 'fat', name: 'Adipose tissue and ligaments', color: '#F2E0A0', text: '<b>Adipose tissue</b> determines the shape and size of the breast — which is why size has nothing to do with the amount of milk. <b>Cooper’s ligaments</b> — thin connective-tissue bands running from the skin to the fascia of the pectoral muscle — support the gland. The breast has no muscles of its own: it lies on the pectoralis major.' },
  { id: 'lymph', name: 'Lymph nodes', color: '#7FD6FF', text: '<b>Lymph</b> from the breast drains mainly (~75%) to the axillary lymph nodes, and also to the nodes along the sternum. That is why a doctor always checks the armpit during an examination.' },
];
function makeChest() {
  __set_rnd(mulberry(2323));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xf2b0c8);
  const VIEW = { chest: flyTarget(V3(0, 1.75, 0), V3(2.4, 2.8, 7.4)), breast: flyTarget(V3(30.0, -0.5, 0), V3(33.4, 0.5, 5.6)), lact: flyTarget(V3(30.0, -0.8, 0), V3(30.8, 0.4, 6.6)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.chest.pos);
  const controls = makeControls(camera, VIEW.chest.target); controls.minDistance = 1; controls.maxDistance = 18;
  const body = new THREE.Group(); scene.add(body);
  bodyShell(body, { rim: 0.18 });
  const PART = Object.fromEntries([...CH_PARTS, ...BR_PARTS].map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, parent, o = {}) => { const m = organMat(PART[id].color, o.k ?? 0.42, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- грудная клетка ---------- */
  const ribG = [], cartG = [], musG = [], cartC = { 1: [], [-1]: [] };
  for (let i = 0; i < 12; i++) {
    const y = 2.92 - i * 0.15, w = 0.5 + 0.48 * Math.sin(Math.min(1, (i + 1) / 6) * Math.PI / 2) - (i > 7 ? (i - 7) * 0.05 : 0), drop = 0.32 + i * 0.03;
    [1, -1].forEach((s) => {
      const front = i < 10 ? 1 : 0.55;
      const pts = [V3(0.07 * s, y, -0.42), V3(w * 0.72 * s, y - 0.04, -0.38), V3(w * s, y - 0.16, 0.0), V3(w * 0.82 * s, y - drop * 0.75, 0.42 * front)];
      if (i < 10) pts.push(V3(w * 0.45 * s, y - drop, 0.56));
      const c = new THREE.CatmullRomCurve3(pts); ribG.push(taperTube(c, () => 0.026, 40, 6));
      if (i < 7) { const cc = new THREE.CatmullRomCurve3([pts[pts.length - 1], V3(0.06 * s, 2.82 - i * 0.12, 0.58)]); cartC[s][i] = cc; cartG.push(taperTube(cc, () => 0.02, 10, 6)); }
      else if (i < 10) {   // 8–10 рёбра: хрящ сливается с хрящом вышележащего ребра — сплошная рёберная дуга
        const a = pts[pts.length - 1], b = cartC[s][i - 1].getPointAt(0.45), cc = new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.5).add(V3(0, 0.05, 0.02)), b]);
        cartC[s][i] = cc; cartG.push(taperTube(cc, () => 0.018, 14, 6));
      }
      if (i < 11) { const c2 = new THREE.CatmullRomCurve3(pts.slice(0, 4).map((p) => p.clone().add(V3(0, -0.075, 0)))); musG.push(taperTube(c2, () => 0.04, 30, 4)); }
    });
  }
  add('rib', mergeGeometries(ribG), body, { k: 0.3 });
  add('stern', mergeGeometries(cartG), body, { k: 0.5, mat: { color: new THREE.Color('#c8d8e0').multiplyScalar(0.45) } });
  add('mus', mergeGeometries(musG), body, { k: 0.35, mat: { transparent: true, opacity: 0.45, depthWrite: false } });
  const stG = new THREE.BoxGeometry(0.16, 0.95, 0.06, 4, 16, 2); displaceGeo(stG, (v) => { v.x *= v.y > 0.3 ? 1.5 : 1 - 0.4 * smooth(-0.2, -0.5, v.y); }); stG.translate(0, 2.4, 0.6); add('stern', stG, body, { k: 0.45 });
  [1, -1].forEach((s) => add('stern', tube([V3(0.08 * s, 2.92, 0.55), V3(0.45 * s, 3.02, 0.45), V3(0.85 * s, 3.05, 0.1), V3(1.0 * s, 3.0, -0.05)], 0.03, 30, 8), body, { k: 0.45 }));
  const vert = []; for (let i = 0; i < 12; i++) { const g = new THREE.CylinderGeometry(0.075, 0.075, 0.1, 16); g.translate(0, 2.95 - i * 0.15, -0.46); vert.push(g); const sp = new THREE.BoxGeometry(0.03, 0.06, 0.18); sp.rotateX(0.5); sp.translate(0, 2.92 - i * 0.15, -0.6); vert.push(sp); }
  add('spine', mergeGeometries(vert), body, { k: 0.45 });
  const dia = add('mus', displaceGeo(new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2), (v) => { const r = Math.hypot(v.x, v.z); v.y = 0.4 * (1 - r * r); v.x *= 0.92; v.z *= 0.52; }), body, { k: 0.38, mat: { transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false } }); dia.position.y = 1.32;
  // средостение
  add('med', ell3(0.27, 0.32, 0.24, BODY.heart), body, { k: 0.45 });
  add('med', tube([V3(0.0, 2.2, 0.0), V3(0.05, 2.55, 0.05), V3(0.2, 2.62, -0.15), V3(0.12, 2.3, -0.38), V3(0.1, 1.3, -0.38)], 0.06, 40, 10), body, { k: 0.5 });
  add('med', tube([V3(0, 3.35, 0.12), V3(0, 2.62, 0.02)], 0.05, 10, 10), body, { k: 0.5, mat: { color: new THREE.Color('#E8DCC8').multiplyScalar(0.45) } });
  const lungMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe89aa8).multiplyScalar(0.4), roughness: 0.6, transparent: true, opacity: 0.16, depthWrite: false });
  [1, -1].forEach((s) => body.add(new THREE.Mesh(ell3(0.4, 0.68, 0.4, V3(0.5 * s, 2.25, -0.04)), lungMat)));
  // грудные мышцы и железы (на силуэте, полупрозрачно)
  // большая грудная мышца — веер: начало от грудины (y 2.0–2.9) и медиальной половины ключицы, сходится к плечевой кости
  const pecG = []; [1, -1].forEach((s) => {
    const NT = 18, NU = 22, P = [], idx = [], O = (t) => (t < 0.7 ? V3(0.1 * s, 2.0 + t / 0.7 * 0.9, 0.64) : V3((0.1 + (t - 0.7) / 0.3 * 0.4) * s, 2.9 + (t - 0.7) / 0.3 * 0.1, 0.62 - (t - 0.7) / 0.3 * 0.1));
    for (let i = 0; i <= NT; i++) { const t = i / NT, o = O(t), ins = V3(1.02 * s, 2.7 + 0.1 * t, 0.28), m = o.clone().lerp(ins, 0.45).add(V3(0, 0, 0.14 - 0.06 * t));
      const c = new THREE.QuadraticBezierCurve3(o, m, ins); for (let j = 0; j <= NU; j++) { const q = c.getPoint(j / NU); P.push(q.x, q.y, q.z); } }
    for (let i = 0; i < NT; i++) for (let j = 0; j < NU; j++) { const a = i * (NU + 1) + j, b2 = a + NU + 1; idx.push(a, b2, a + 1, b2, b2 + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(idx); g.computeVertexNormals(); pecG.push(g.toNonIndexed());
  });
  const pec = add('mus', mergeGeometries(pecG), body, { k: 0.38, mat: { transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide } });
  /* ---------- молочная железа (сагиттальный разрез) ---------- */
  const br = new THREE.Group(); br.position.set(30, 0, 0); scene.add(br); br.visible = false;
  // грудная стенка: рёбра и мышца, вид сбоку (железа выступает вперёд по +x)
  // только половина за плоскостью разреза (z<0), как и сама железа
  const wallG = []; for (let i = 0; i < 5; i++) { const g = new THREE.CylinderGeometry(0.11, 0.11, 1.3, 16); g.rotateX(Math.PI / 2); g.translate(-1.0, 0.9 - i * 0.55, -0.65); wallG.push(g); }
  br.add(new THREE.Mesh(mergeGeometries(wallG), organMat('#E8D8BB', 0.28)));
  const pm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.8, 1.2), organMat('#B85050', 0.36, { transparent: true, opacity: 0.6, depthWrite: false })); pm.position.set(-0.72, -0.2, -0.6); br.add(pm);
  // форма груди: полусфера, разрезанная по сагиттальной плоскости (видна половина z<0)
  const BR_C = V3(-0.58, -0.35, 0);
  const brShape = displaceGeo(new THREE.SphereGeometry(1, 64, 48, Math.PI, Math.PI, 0, Math.PI), (v) => { let x = v.x, y = v.y, z = v.z; if (x < 0) x *= 0.08; else { x *= 1.05; if (y < 0) y *= 1 + 0.15 * x; } v.set(x * 1.0, y * 1.05 - 0.1 * x * x, z * 1.0); });
  // половина сферы со стороной z<=0; поворачиваем, чтобы разрез смотрел на камеру (+z)
  brShape.translate(BR_C.x, BR_C.y, BR_C.z);
  const skinMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8b8a0).multiplyScalar(0.45), roughness: 0.5, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide, sheen: 0.5, sheenColor: new THREE.Color(0xffd8c8), envMapIntensity: 0.35 });
  br.add(new THREE.Mesh(brShape, skinMat), new THREE.Mesh(brShape, glassMat(0xffd0c0, { rim: 0.3, base: 0.008, pow: 2 })));
  // плоскость разреза — жир
  const cutG = new THREE.CircleGeometry(1, 64); displaceGeo(cutG, (v) => { const x = v.x; v.x = x < 0 ? x * 0.08 : x * 1.05; v.y = v.y * 1.05 - 0.1 * v.x * v.x; }); cutG.translate(BR_C.x, BR_C.y, 0.001);
  add('fat', cutG, br, { k: 0.4, mat: { transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false } });
  const NIP = V3(BR_C.x + 1.08, BR_C.y - 0.1, 0);
  add('nip', (() => { const g = new THREE.CylinderGeometry(0.07, 0.09, 0.14, 20); g.rotateZ(Math.PI / 2); g.translate(NIP.x + 0.05, NIP.y, 0); return g; })(), br, { k: 0.5 });
  // ареола — пигментированный участок кожи (сферический сегмент на поверхности груди, половина z<0)
  add('nip', (() => { const g = new THREE.SphereGeometry(1.065, 32, 8, Math.PI, Math.PI, 0, 0.22); g.rotateZ(-Math.PI / 2); g.translate(BR_C.x + 0.02, BR_C.y - 0.1, 0); return g; })(), br, { k: 0.5, mat: { color: new THREE.Color('#a86a5a').multiplyScalar(0.55), side: THREE.DoubleSide } });
  // доли: протоки от соска веером, дольки — гроздья на концах
  const DUCTS = [], LOBS = [];
  const ductG = [], lobG = [];
  for (let i = 0; i < 9; i++) {
    const a = -1.15 + i / 8 * 2.3, end = V3(BR_C.x + 0.18 + 0.3 * Math.cos(a), BR_C.y + Math.sin(a) * 0.75, -0.25 - rnd() * 0.3);
    const c = new THREE.CatmullRomCurve3([NIP.clone().add(V3(-0.02, 0, -0.02)), NIP.clone().add(V3(-0.2, Math.sin(a) * 0.05, -0.05)), NIP.clone().lerp(end, 0.55).add(V3(0, 0, -0.05)), end]);
    DUCTS.push(c); ductG.push(taperTube(c, (u) => 0.022 - 0.01 * u + (u > 0.05 && u < 0.18 ? 0.012 : 0), 30, 6));
    for (let k = 0; k < 3; k++) { const b0 = c.getPointAt(0.55 + k * 0.2), dir = end.clone().sub(NIP).normalize().add(randUnit().multiplyScalar(0.6)).normalize(); const arr = []; branchTree(arr, b0, dir, 0.18, 0.009, 1, { segs: 6, rad: 4, leaf: (p) => { for (let j = 0; j < 7; j++) { const g = new THREE.SphereGeometry(0.03, 8, 6); const q = p.clone().add(randUnit().multiplyScalar(0.05)); g.translate(q.x, q.y, q.z); lobG.push(g); LOBS.push(q); } } }); ductG.push(...arr); }
  }
  add('duct', mergeGeometries(ductG), br, { k: 0.5 });
  const lobMesh = add('lob', mergeGeometries(lobG), br, { k: 0.5, mat: { emissiveIntensity: 0.08 } });
  // связки Купера
  const coop = []; for (let i = 0; i < 7; i++) { const a = -1.2 + i / 6 * 2.4; const p0 = V3(-0.66, BR_C.y + Math.sin(a) * 0.9, -0.1 - rnd() * 0.3); const p1 = V3(BR_C.x + Math.max(0.1, Math.cos(a)) * 1.0, BR_C.y + Math.sin(a) * 1.0 - 0.1, -0.15 - rnd() * 0.3); coop.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p0, p0.clone().lerp(p1, 0.5).add(randUnit().multiplyScalar(0.05)), p1]), 12, 0.006, 4)); }
  add('fat', mergeGeometries(coop), br, { k: 0.6, mat: { color: new THREE.Color('#f0f0e8').multiplyScalar(0.5) } });
  // жировые дольки
  { const arr = []; for (let i = 0; i < 40; i++) { const a = rand(-1.3, 1.3), sz = 0.07 + rnd() * 0.05, r = rand(0.3, 0.85 - sz); const p = V3(BR_C.x + Math.max(0.05, Math.cos(a)) * r, BR_C.y + Math.sin(a) * r, -rand(0.1, 0.7)); const g = new THREE.SphereGeometry(sz, 10, 8); g.translate(p.x, p.y, p.z); arr.push(g); } add('fat', mergeGeometries(arr), br, { k: 0.38, mat: { transparent: true, opacity: 0.45, depthWrite: false } }); }
  // лимфоузлы и сосуды к подмышке
  const LYM = new THREE.CatmullRomCurve3([V3(BR_C.x + 0.5, BR_C.y + 0.6, -0.3), V3(-0.3, 0.85, -0.5), V3(-0.4, 1.1, -0.75), V3(-0.5, 1.25, -0.9)]);
  add('lymph', taperTube(LYM, () => 0.015, 30, 6), br, { k: 0.5 });
  [0.55, 0.75, 0.95].forEach((u) => add('lymph', ell3(0.06, 0.045, 0.05, LYM.getPointAt(u)), br, { k: 0.5 }));
  const fx = new Sparks(1800, 0.04); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'chest', sel: null, labels: true, rot: false, fly: null, msg: null, prl: 0, oxy: 0, suckT: -99 };
  const list = () => (st.mode === 'chest' ? CH_PARTS : BR_PARTS);
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(list().map((p) => PART[p.id]), st.sel); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; st.sel = null; body.visible = m === 'chest'; br.visible = m !== 'chest'; st.fly = VIEW[m]; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function suckle() { if (st.mode !== 'lact') setMode('lact'); st.suckT = st.t; st.msg = TXT.suck; refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (list().some((p) => p.id === id)) select(id); });
  const C_M = new THREE.Color(0xfff6e0), C_H = new THREE.Color(0xc77dff);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    const lact = st.mode === 'lact', k = t - st.suckT, suck = lact && k > 0 && k < 7;
    st.prl += ((lact ? 1 : 0) - st.prl) * Math.min(1, dt * 0.6); st.oxy += ((suck && k > 1 ? 1 : 0) - st.oxy) * Math.min(1, dt * 1.5);
    PART.lob.mats.forEach((m) => { m.emissiveIntensity = 0.08 + 0.5 * st.prl; });
    lobMesh.scale.setScalar(1);
    if (lact && rnd() < st.prl * 0.8) { const q = LOBS[Math.floor(rnd() * LOBS.length)]; fx.spawn(q.clone().add(br.position), randUnit().multiplyScalar(0.02), C_M, 0.6, 1, 1); }
    if (st.oxy > 0.2) for (let j = 0; j < 3; j++) { const c = DUCTS[Math.floor(rnd() * DUCTS.length)]; const u = 1 - ((t * 0.5 + j * 0.33) % 1); fx.spawn(c.getPointAt(u).add(br.position), V3(0, 0, 0), C_M, 0.4, 0, 1.2); if (u < 0.08) fx.spawn(NIP.clone().add(br.position).add(V3(0.12, 0, 0)), V3(0.4, rand(-0.1, 0.1), rand(-0.1, 0.1)), C_M, 0.5, 0.5, 1); }
    if (suck && k < 1.5) fx.spawn(NIP.clone().add(br.position).add(V3(0, 0.05, 0)), V3(-0.3, 1.2, 0.1), C_H, 1.0, 0, 1.2);
    fx.update(dt);
  }
  const TXT = {
    chest: '<b>The rib cage</b> is a frame of 12 pairs of ribs, the sternum and 12 thoracic vertebrae. It protects the heart, lungs and great vessels, supports the muscles of the shoulder girdle and, together with the diaphragm, works as a pump for breathing. Click a part.',
    breast: '<b>The breast</b> (side section). It lies on the pectoralis major and consists of glandular tissue (15–20 lobes with ducts), adipose tissue and connective-tissue ligaments. People of both sexes have mammary glands, but in women they develop at puberty under the influence of estrogens and progesterone. Click a part.',
    lact: '<b>Lactation.</b> After childbirth the pituitary hormone <b>prolactin</b> makes the alveolar cells produce milk (glowing lobules). Click “Nursing”.',
    suck: '<b>The milk ejection reflex.</b> Suckling stimulates receptors in the nipple → a signal travels along nerves to the hypothalamus → the posterior pituitary releases <b>oxytocin</b> → the muscle cells around the alveoli contract, and milk flows along the ducts to the nipple. Suckling also sustains prolactin production. The first milk — colostrum — is especially rich in antibodies.',
  };
  const labels = [
    { text: 'sternum', pos: V3(0.12, 2.5, 0.68), color: '#F2E6C8', show: () => st.labels && st.mode === 'chest' },
    { text: 'clavicle', pos: V3(0.65, 3.12, 0.35), color: '#F2E6C8', show: () => st.labels && st.mode === 'chest' },
    { text: 'ribs', pos: V3(1.05, 2.3, 0.2), color: '#E8D8BB', show: () => st.labels && st.mode === 'chest' },
    { text: 'costal cartilages', pos: V3(0.42, 1.85, 0.62), color: '#c8d8e0', show: () => st.labels && st.mode === 'chest' },
    { text: 'spine', pos: V3(0.0, 1.55, -0.6), color: '#D8C8A8', show: () => st.labels && st.mode === 'chest' },
    { text: 'diaphragm', pos: V3(0.7, 1.45, 0.45), color: '#C86A6A', show: () => st.labels && st.mode === 'chest' },
    { text: 'heart', pos: BODY.heart.clone().add(V3(0.15, -0.05, 0.3)), color: '#FF8A7A', show: () => st.labels && st.mode === 'chest' },
    { text: 'pectoralis major', pos: V3(29.25, 0.95, 0.2), color: '#D07070', show: () => st.labels && st.mode !== 'chest' },
    { text: 'ribs', pos: V3(28.9, 1.05, 0.4), color: '#E8D8BB', show: () => st.labels && st.mode !== 'chest' },
    { text: 'lobes and lobules', pos: V3(30.1, 0.35, 0.1), color: '#F2B0C8', show: () => st.labels && st.mode !== 'chest' },
    { text: 'milk ducts', pos: V3(30.25, -0.2, 0.15), color: '#F2D88A', show: () => st.labels && st.mode !== 'chest' },
    { text: 'nipple and areola', pos: V3(30.65, -0.6, 0.15), color: '#E09080', show: () => st.labels && st.mode !== 'chest' },
    { text: 'adipose tissue', pos: V3(29.9, -1.05, 0.1), color: '#F2E0A0', show: () => st.labels && st.mode !== 'chest' },
    { text: 'to the axillary lymph nodes', pos: V3(29.45, 1.38, -0.9), color: '#7FD6FF', show: () => st.labels && st.mode !== 'chest' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.sel && st.mode !== 'lact' ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'chest', label: 'Chest' }, { id: 'breast', label: 'Breast' }, { id: 'lact', label: 'Lactation' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'gctl' });
    refs.rebuild = () => { box.innerHTML = ''; refs.seg = seg([{ id: 'all', label: 'All' }, ...list().map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'lact') setMode('breast'); select(v); }); box.append(refs.seg); };
    refs.rebuild();
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 480px' }, h('div', { class: 'glabel' }, 'Parts', h('kbd', {}, 'click')), box), group('Experiment', 'F', button('Nursing', suckle, true)), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['chest', 'breast', 'lact'][n - 1]); return true; }
    if (k === 'f' || k === 'а') { suckle(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'chest' ? [['Pairs of ribs', 12, ''], ['Thoracic vertebrae', 12, '']] : st.mode === 'lact' ? [['Prolactin', Math.round(st.prl * 100), '%'], ['Oxytocin', Math.round(st.oxy * 100), '%']] : [['Lobes', '15–20', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F2B0C8',
    kicker: 'Body · chest', title: 'Chest and breast',
    lede: 'The bony frame that protects the heart and lungs and helps us breathe, and how the breast is built — from lobules to ducts and the hormones of breastfeeding.',
    notes: `
      <div><h2>Breast health</h2><p>Monthly self-examination and check-ups with a doctor help detect lumps in time. Breast cancer is the most common cancer in women (it also occurs in men); at an early stage it responds well to treatment. After age 40, regular mammography — an X-ray examination of the breast — is recommended.</p>
        <h3>Hormones</h3><p>Estrogens are responsible for the growth of the ducts, progesterone for the development of the lobules, prolactin for milk production and oxytocin for milk ejection.</p></div>
      <div><h2>Simplifications</h2><ul><li>The structure is shown schematically, like a textbook drawing; the number of lobes is reduced.</li><li>Ribs and cartilages are simplified.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: part</li><li><code>F</code> feeding</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeChest };
