import { GLOW, LOOK, Sparks, THREE, V3, __set_rnd, addLights, bloom, button, canvas, clamp, displaceGeo, envTex, glassMat, group, h, lerp, makeControls, mergeGeometries, mergeVertices, mulberry, noise3, rand, randUnit, rnd, seg, taperTube, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 1 · ТИПЫ НЕЙРОНОВ И НЕЙРОСЕТЬ
   ========================================================= */
const NTYPES = [
  { id: 'multi', short: 'Multi', name: 'Multipolar', tiles: [['Dendrites', 'many', ''], ['Axon', 1, '']],
    text: '<b>Multipolar neuron</b>: one axon and several dendrites, the most common type in the brain. Shown here is a spinal cord motor neuron. Its myelinated axon reaches a muscle of the arm or leg and is sometimes longer than a meter. A collateral branches off at a right angle and copies the signal to a second target.' },
  { id: 'bi', short: 'Bi', name: 'Bipolar', tiles: [['Dendrites', 1, ''], ['Axon', 1, '']],
    text: '<b>Bipolar neuron</b>: one dendrite and one axon at opposite poles of the cell body. It is a rare form, found in sensory systems. The dendrite here can be myelinated.' },
  { id: 'pseudo', short: 'Pseudouni', name: 'Pseudounipolar', tiles: [['Processes', 1, ''], ['Branches', 2, '']],
    text: '<b>Pseudounipolar neuron</b>: a single process leaves the cell body (by origin it is an axon) and splits in the shape of a T. One branch works as a dendrite and senses touch on the skin. The other works as an axon and goes into the CNS. Both are myelinated, and the signal bypasses the cell body. This is how the pain and touch neurons of the spinal ganglia are built.' },
  { id: 'pyr', short: 'Pyramidal', name: 'Pyramidal', tiles: [['Cell body', 'up to 100', 'µm'], ['Spines', 'yes', '']],
    text: '<b>Pyramidal neuron</b> of the cerebral cortex: a pyramid-shaped cell body up to 100 µm, an apical dendrite going up and basal dendrites going down. The dendrites are covered in <b>spines</b>, the receiving side of synapses. The more spines, the more streams of information the cell collects.' },
  { id: 'purk', short: 'Purkinje', name: 'Purkinje cell', tiles: [['Cell body', '60–70', 'µm'], ['Main dendrites', '2–3', '']],
    text: '<b>Purkinje cell</b> of the cerebellum: neurocytology began with it in 1836. 2–3 thick dendrites leave the cell body and branch into a huge tree lying <b>in a single plane</b>. Motor memory is stored at the synapses of this tree. Turn the scene sideways, and the tree becomes a thin strip.' },
  { id: 'star', short: 'Stellate', name: 'Stellate', tiles: [['Dendrites', 'many', ''], ['Axon', 'short', '']],
    text: '<b>Stellate neuron</b>: a small cell body with dendrites radiating in all directions. The axon is short and branches nearby, meaning the cell works within a local network.' },
  { id: 'fusi', short: 'Spindle', name: 'Fusiform', tiles: [['Dendrites', '2 tufts', ''], ['Axon', 1, '']],
    text: '<b>Fusiform neuron</b>: an elongated cell body, with dendrites leaving in tufts from its two poles. It is one of the shapes by which neurons are classified by cell body form, along with pyramidal, stellate and Purkinje cells.' },
];
const NET_TEXT = 'A network of five neurons. The <b>sensory</b> neuron (input) detects a touch on the skin. Two <b>interneurons</b> pass the signal to each other in a loop, so the muscle twitches several times. The <b>motor neuron</b> (output) controls the muscle. Inside a cell the signal is electrical, at synapses it is chemical: usually <b style="color:#9ee66a">glutamate</b> at central synapses and <b style="color:#3FC1B0">acetylcholine</b> at neuromuscular ones.';
const STAIN_TEXT = {
  live: '',
  golgi: '<b>Golgi stain</b>: first potassium dichromate gives an orange background, then silver nitrate is added. Silver chromate forms, and the whole cell turns black, down to the finest dendritic twigs.',
  nissl: '<b>Nissl stain</b> with methylene blue. It reveals clusters of ribosomes, the <b>Nissl substance</b> (tigroid): clumps in the cell body and at the bases of the dendrites. There is no Nissl substance in the axon.',
  bb: '<b>Brainbow</b>: random variants of a jellyfish fluorescent protein produce about 100 hues, so each cell can be traced through the tangle.',
};

function makeTypes() {
  __set_rnd(mulberry(21));
  const BG = 0x07060a, GOLGI_BG = 0x8a5420;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(BG); scene.fog = new THREE.FogExp2(BG, 0.011); scene.environment = envTex;
  addLights(scene);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400); camera.position.set(-8.5, 2.5, 55);
  const controls = makeControls(camera, V3(-8.5, 0.5, 0)); controls.minDistance = 3; controls.maxDistance = 90;

  const baseMat = new THREE.MeshPhysicalMaterial({ color: 0xcdb0c4, roughness: 0.46, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 1, sheenColor: new THREE.Color(0x8f6dff), sheenRoughness: 0.5, emissive: 0x12081a, envMapIntensity: 0.6 });
  const myelinMat = new THREE.MeshPhysicalMaterial({ color: 0xf1e7d6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 0.9 });
  const nisslMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.42, 0.48, 1.25) });
  const nucMat = glassMat(0xc9d2ff, { rim: 0.8, base: 0.03 });
  const myelins = [], cells = [], byId = {};
  const HUES = [0.02, 0.33, 0.58, 0.12, 0.8, 0.47, 0.92, 0.66, 0.2, 0.05, 0.38];

  function newCell(def, origin) {
    const c = { def, origin, g: new THREE.Group(), dg: [], ag: [], prim: [], spines: [], flash: -9, somaBase: 0, hue: HUES[cells.length % HUES.length] };
    c.g.position.copy(origin); scene.add(c.g);
    c.mat = baseMat.clone(); c.axMat = baseMat.clone(); c.somaMat = baseMat.clone();
    c.somaMat.emissive = new THREE.Color(0xff8a3c); c.somaMat.emissiveIntensity = 0;
    cells.push(c); if (def) byId[def.id] = c; return c;
  }
  function addTube(c, pts, r0, r1, axon = false, segs = 24) {
    const curve = new THREE.CatmullRomCurve3(pts);
    (axon ? c.ag : c.dg).push(taperTube(curve, (u) => r0 + (r1 - r0) * u, segs, 8));
    const e = pts[pts.length - 1], cap = new THREE.SphereGeometry(Math.max(r1, 0.02), 8, 6); cap.translate(e.x, e.y, e.z); (axon ? c.ag : c.dg).push(cap);
    return curve;
  }
  function spinesOn(c, curve, r0, r1, dens = 12) {
    const n = Math.floor(curve.getLength() * dens), t = V3(0, 0, 0);
    for (let i = 0; i < n; i++) {
      const u = rand(0.08, 0.97), p = curve.getPointAt(u); curve.getTangentAt(u, t);
      const d = randUnit(); d.addScaledVector(t, -d.dot(t)).normalize();
      c.spines.push(p.addScaledVector(d, lerp(r0, r1, u) + 0.04));
    }
  }
  function tree(c, start, dir, len, r, depth, o = {}) {
    const { spread = 0.75, wob = 0.28, planar = false, kids = 2, shrink = 0.72, nodes = 3, axon = false, spines = 0, spineDepth = 99 } = o;
    const pts = [start.clone()]; let p = start.clone(); const d = dir.clone().normalize();
    for (let k = 1; k <= nodes; k++) { const w = randUnit().multiplyScalar(wob); if (planar) w.z *= 0.06; d.add(w).normalize(); p = p.clone().addScaledVector(d, len / nodes); pts.push(p); }
    const r1 = depth > 0 ? r * 0.64 : r * 0.5;
    const curve = addTube(c, pts, r, r1, axon, 6 + nodes * 4);
    if (spines && depth <= spineDepth) spinesOn(c, curve, r, r1, spines);
    if (o.leaf && depth === 0) o.leaf(p);
    if (depth > 0) for (let j = 0; j < kids; j++) { const nd = d.clone().add(randUnit().multiplyScalar(spread)); if (planar) nd.z *= 0.06; nd.normalize(); tree(c, p, nd, len * shrink, r1, depth - 1, o); }
    return curve;
  }
  function blob(r, sx = 1, sy = 1, sz = 1, seed = 0) {
    const g = new THREE.IcosahedronGeometry(r, 14); g.deleteAttribute('normal'); g.deleteAttribute('uv'); // индексированная сетка: гладкие нормали
    return displaceGeo(mergeVertices(g), (v) => { const n = v.clone().normalize(); const s = 1 + 0.12 * noise3(n.x * 1.8 + seed, n.y * 1.8, n.z * 1.8); v.copy(n.multiplyScalar(r * s)); v.x *= sx; v.y *= sy; v.z *= sz; });
  }
  function soma(c, geo, pos = V3(0, 0, 0)) { const m = new THREE.Mesh(geo, c.somaMat); m.position.copy(pos); c.g.add(m); c.somaMesh = m; c.somaPos = pos.clone(); return m; }
  function myelinate(c, curve, u0, u1, n, rad) {
    const step = (u1 - u0) / n;
    for (let i = 0; i < n; i++) {
      const a = curve.getPointAt(u0 + step * i + step * 0.07), b = curve.getPointAt(u0 + step * (i + 1) - step * 0.07);
      const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(rad, Math.max(0.05, len - 2 * rad), 6, 16), myelinMat);
      m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); c.g.add(m); myelins.push(m);
    }
  }
  const unitSph = new THREE.SphereGeometry(1, 7, 5);
  function finish(c, somaR, sc = V3(1, 1, 1)) {
    if (c.dg.length) { const m = new THREE.Mesh(mergeGeometries(c.dg), c.mat); c.g.add(m); c.pick = [m]; } else c.pick = [];
    if (c.ag.length) { const m = new THREE.Mesh(mergeGeometries(c.ag), c.axMat); c.g.add(m); c.pick.push(m); }
    c.pick.push(c.somaMesh); c.dg = c.ag = null;
    const M = new THREE.Matrix4(), pts = [];
    for (let i = 0; i < 260 && pts.length < 120; i++) { const p = randUnit().multiplyScalar(somaR * Math.cbrt(rand(0.1, 0.72))); if (p.length() < somaR * 0.4) continue; pts.push(p.multiply(sc).add(c.somaPos)); }
    c.prim.forEach((cv) => { for (let i = 0; i < 9; i++) pts.push(cv.getPointAt(rand(0.02, 0.2)).add(randUnit().multiplyScalar(0.035))); });
    const im = new THREE.InstancedMesh(unitSph, nisslMat, pts.length);
    pts.forEach((p, i) => { const s = rand(0.035, 0.065); M.makeScale(s, s * 0.6, s).setPosition(p); im.setMatrixAt(i, M); });
    im.visible = false; c.g.add(im); c.nissl = im;
    c.nuc = new THREE.Mesh(new THREE.SphereGeometry(somaR * 0.34, 20, 14), nucMat); c.nuc.position.copy(c.somaPos); c.nuc.visible = false; c.g.add(c.nuc);
    if (c.spines.length) {
      const sm = new THREE.InstancedMesh(unitSph, c.mat, c.spines.length);
      c.spines.forEach((p, i) => { M.makeScale(0.05, 0.05, 0.05).setPosition(p); sm.setMatrixAt(i, M); }); c.g.add(sm);
    }
  }
  const sg = (c, curve, rev = false) => ({ c: curve, o: c.origin, rev });
  const AP = new THREE.Color(0xffb070), INP = new THREE.Color(0xffe3a8), GLU = new THREE.Color(0x9ee66a), ACH = new THREE.Color(0x3fc1b0);
  function S(segs, v, col, end) { return { segs, dur: Math.max(...segs.map((s) => s.c.getLength())) / v, col, end }; }

  /* ---------- галерея ---------- */
  // два ряда: 4 клетки сверху, 3 снизу
  const SP = 9;
  const org = (i) => (i < 4 ? V3((i - 1.5) * SP, 6.3, 0) : V3((i - 5) * SP, -6.6, 0));
  // 1 мультиполярный (мотонейрон)
  { const c = newCell(NTYPES[0], org(0)); soma(c, blob(0.85, 1, 1, 0.9, 1));
    [V3(-1, 0.45, 0.2), V3(-0.6, 1, -0.4), V3(0.05, 1, 0.35), V3(0.7, 1, -0.2), V3(1, 0.3, 0.4), V3(-0.9, -0.45, -0.5), V3(0.95, -0.5, -0.3)]
      .forEach((d) => { d.normalize(); c.prim.push(tree(c, d.clone().multiplyScalar(0.72), d, 1.7, 0.2, 2, { spread: 0.7 })); });
    const ax1 = addTube(c, [V3(0, -0.7, 0), V3(0, -1.3, 0), V3(0.05, -1.9, 0.05)], 0.34, 0.11, true, 16);
    const ax2 = addTube(c, [V3(0.05, -1.9, 0.05), V3(-0.1, -3, 0), V3(0.1, -4.2, 0), V3(0, -5, 0)], 0.11, 0.11, true, 30);
    const col = addTube(c, [V3(0.05, -1.9, 0.05), V3(0.8, -1.95, 0), V3(1.7, -1.85, 0.1)], 0.07, 0.06, true, 14);
    const terms = [V3(-0.9, -5.7, 0.3), V3(-0.3, -5.9, -0.3), V3(0.35, -5.85, 0.35), V3(0.95, -5.6, -0.2)].map((t) => addTube(c, [V3(0, -5, 0), V3(0, -5, 0).lerp(t, 0.5).add(V3(0, 0.1, 0)), t], 0.07, 0.05, true, 12));
    terms.forEach((cv) => { const e = cv.getPointAt(1), b = new THREE.SphereGeometry(0.17, 12, 8); b.translate(e.x, e.y, e.z); c.ag.push(b); });
    myelinate(c, ax2, 0.06, 0.94, 4, 0.24);
    finish(c, 0.85, V3(1, 1, 0.9));
    c.route = () => [S(c.prim.slice(0, 4).map((cv) => sg(c, cv, true)), 4, INP, () => { c.flash = st.t; }), S([sg(c, ax1)], 5, AP), S([sg(c, ax2), sg(c, col)], 9, AP), S(terms.map((cv) => sg(c, cv)), 6, AP, () => terms.forEach((cv) => burst(cv.getPointAt(1).add(c.origin), ACH)))];
    c.lbl = [['dendrites', V3(-2.6, 2.4, 0)], ['cell body (soma)', V3(1.0, 0.7, 0.6)], ['axon hillock', V3(0.45, -1.2, 0.2)], ['collateral', V3(1.8, -1.6, 0.1)], ['myelin', V3(0.4, -3.4, 0.2)], ['axon terminals', V3(1.1, -5.9, 0)]];
  }
  // 2 биполярный
  { const c = newCell(NTYPES[1], org(1)); soma(c, blob(0.45, 1, 1.7, 1, 2));
    const d = addTube(c, [V3(0, 0.7, 0), V3(0.1, 1.6, 0), V3(-0.1, 2.6, 0.1), V3(0, 3.4, 0)], 0.15, 0.08, false, 30); c.prim.push(d);
    [V3(-0.6, 1, 0.2), V3(0.1, 1, -0.3), V3(0.6, 1, 0.1)].forEach((dd) => tree(c, V3(0, 3.4, 0), dd, 0.7, 0.07, 1, { spread: 0.5 }));
    const ax = addTube(c, [V3(0, -0.7, 0), V3(0, -1.8, 0.1), V3(0.1, -3.0, 0), V3(0, -4.2, 0)], 0.11, 0.08, true, 30);
    const terms = [V3(-0.6, -4.9, 0.2), V3(0.1, -5.1, -0.2), V3(0.6, -4.8, 0.1)].map((t) => addTube(c, [V3(0, -4.2, 0), t], 0.06, 0.05, true, 8));
    terms.forEach((cv) => { const e = cv.getPointAt(1), b = new THREE.SphereGeometry(0.15, 12, 8); b.translate(e.x, e.y, e.z); c.ag.push(b); });
    finish(c, 0.5, V3(0.9, 1.6, 0.9));
    c.route = () => [S([sg(c, d, true)], 4, INP, () => { c.flash = st.t; }), S([sg(c, ax)], 6, AP), S(terms.map((cv) => sg(c, cv)), 4, AP)];
    c.lbl = [['dendrite', V3(0.3, 2.4, 0)], ['cell body', V3(0.6, 0.2, 0.3)], ['axon', V3(0.3, -2.6, 0)]];
  }
  // 3 псевдоуниполярный
  { const c = newCell(NTYPES[2], org(2)); soma(c, blob(0.65, 1, 1, 1, 3), V3(0, 1.1, 0));
    const stalk = addTube(c, [V3(0, 0.5, 0), V3(0.25, 0.2, 0.1), V3(-0.2, -0.15, 0), V3(0.15, -0.45, -0.1), V3(0, -0.8, 0)], 0.13, 0.1, true, 30);
    const T = V3(0, -0.8, 0);
    const per = addTube(c, [T, V3(-1, -1.05, 0), V3(-2.2, -1.6, 0.1), V3(-3.0, -2.8, 0), V3(-3.2, -4.4, 0)], 0.1, 0.09, true, 44);
    const cen = addTube(c, [T, V3(1, -1.05, 0), V3(2.2, -1.5, -0.1), V3(3.0, -2.6, 0), V3(3.1, -4.0, 0)], 0.1, 0.09, true, 44);
    [V3(-0.5, -1, 0.3), V3(0.1, -1, -0.3), V3(0.5, -1, 0.2)].forEach((dd) => tree(c, V3(-3.2, -4.4, 0), dd, 0.5, 0.04, 1, { spread: 0.6, axon: true }));
    const terms = [V3(2.6, -4.7, 0.2), V3(3.2, -4.9, -0.2), V3(3.8, -4.6, 0.1)].map((t) => addTube(c, [V3(3.1, -4.0, 0), t], 0.06, 0.05, true, 8));
    terms.forEach((cv) => { const e = cv.getPointAt(1), b = new THREE.SphereGeometry(0.15, 12, 8); b.translate(e.x, e.y, e.z); c.ag.push(b); });
    myelinate(c, per, 0.1, 0.92, 4, 0.2); myelinate(c, cen, 0.1, 0.92, 4, 0.2);
    finish(c, 0.65);
    c.route = () => [S([sg(c, per, true)], 7, AP, () => { c.flash = st.t - 0.15; }), S([sg(c, cen)], 7, AP), S(terms.map((cv) => sg(c, cv)), 4, AP)];
    c.lbl = [['cell body in the ganglion', V3(0.75, 1.6, 0.3)], ['T-shaped branching', V3(0.3, -0.7, 0.3)], ['to the skin: works as a dendrite', V3(-3.0, -2.0, 0.3)], ['to the CNS: works as an axon', V3(3.0, -2.1, 0.3)], ['free nerve endings', V3(-3.0, -4.9, 0.3)]];
  }
  // 4 пирамидный
  { const c = newCell(NTYPES[3], org(3));
    // тело — скруглённая «капля»-пирамида, вершина плавно переходит в апикальный дендрит
    soma(c, displaceGeo(new THREE.SphereGeometry(1, 48, 32), (v) => {
      const t = (v.y + 1) / 2, r = 0.78 * Math.pow(1 - t, 0.85) + 0.1; v.x *= r; v.z *= r; v.y *= 0.8;
      const n = v.clone().normalize(); v.addScaledVector(n, 0.04 * noise3(v.x * 2, v.y * 2, v.z * 2));
    }));
    const sp = 14;
    const apical = addTube(c, [V3(0, 0.7, 0), V3(0.05, 1.8, 0), V3(-0.1, 3.0, 0.1), V3(0.08, 4.2, 0), V3(0, 5.0, 0)], 0.2, 0.08, false, 44); c.prim.push(apical); spinesOn(c, apical, 0.2, 0.08, sp);
    for (let k = 0; k < 6; k++) { const p = apical.getPointAt(0.18 + 0.12 * k), s = k % 2 ? 1 : -1; tree(c, p, V3(s, 0.55, rand(-0.4, 0.4)), 1.0 - k * 0.06, 0.07, 1, { spread: 0.5, spines: sp }); }
    [V3(-0.7, 1, 0.2), V3(0.1, 1, -0.4), V3(0.7, 1, 0.3)].forEach((dd) => tree(c, V3(0, 5, 0), dd, 0.9, 0.07, 1, { spread: 0.5, spines: sp }));
    [V3(-1, -0.5, 0.3), V3(-0.4, -0.8, -0.8), V3(0.5, -0.7, 0.8), V3(1, -0.45, -0.3), V3(0.1, -0.6, 1)].forEach((dd) => { dd.normalize(); c.prim.push(tree(c, V3(dd.x * 0.5, -0.6, dd.z * 0.5), dd, 1.4, 0.12, 2, { spread: 0.6, spines: sp })); });
    const a1 = addTube(c, [V3(0, -0.75, 0), V3(0, -1.4, 0), V3(0, -2.0, 0)], 0.22, 0.09, true, 14);
    const a2 = addTube(c, [V3(0, -2.0, 0), V3(0.05, -2.7, 0), V3(0, -3.4, 0)], 0.09, 0.09, true, 14);
    const a3 = addTube(c, [V3(0, -3.4, 0), V3(-0.05, -4.3, 0), V3(0, -5.3, 0)], 0.09, 0.08, true, 14);
    const cA = addTube(c, [V3(0, -2.0, 0), V3(0.8, -2.05, 0), V3(1.5, -1.8, 0.2)], 0.06, 0.05, true, 10);
    const cB = addTube(c, [V3(0, -3.4, 0), V3(-0.8, -3.45, 0), V3(-1.5, -3.2, -0.2)], 0.06, 0.05, true, 10);
    finish(c, 0.6, V3(1, 1.1, 1));
    c.route = () => [S([sg(c, apical, true), ...c.prim.slice(1, 4).map((cv) => sg(c, cv, true))], 6, INP, () => { c.flash = st.t; }), S([sg(c, a1)], 5, AP), S([sg(c, a2), sg(c, cA)], 5, AP), S([sg(c, a3), sg(c, cB)], 5, AP)];
    c.lbl = [['apical dendrite', V3(0.3, 3.4, 0)], ['spines', V3(-1.3, 2.4, 0)], ['pyramid-shaped body', V3(0.8, 0.1, 0.4)], ['basal dendrites', V3(-2.0, -1.5, 0)], ['collaterals', V3(1.5, -1.6, 0.2)], ['axon', V3(0.25, -4.6, 0)]];
  }
  // 5 клетка Пуркинье
  { const c = newCell(NTYPES[4], org(4)); soma(c, blob(0.8, 0.95, 1.15, 0.9, 5));
    // один толстый первичный дендрит, от него плоское дерево с шипиковыми веточками
    const trunk = addTube(c, [V3(0, 0.7, 0), V3(0.03, 1.25, 0), V3(0, 1.8, 0)], 0.3, 0.2, false, 12);
    const trees = [V3(-0.75, 1, 0), V3(0.05, 1, 0), V3(0.8, 1, 0)].map((d) => tree(c, V3(0, 1.8, 0), d, 1.05, 0.17, 4, { planar: true, spread: 0.85, shrink: 0.8, wob: 0.22, spines: 9, spineDepth: 1 }));
    c.prim.push(trunk, ...trees);
    const a1 = addTube(c, [V3(0, -0.9, 0), V3(0, -1.6, 0), V3(0, -2.2, 0)], 0.26, 0.1, true, 14);
    const a2 = addTube(c, [V3(0, -2.2, 0), V3(0.1, -3.5, 0.05), V3(0, -5.2, 0)], 0.1, 0.1, true, 24);
    const col = addTube(c, [V3(0, -2.2, 0), V3(0.9, -2.25, 0), V3(1.3, -1.5, 0)], 0.06, 0.05, true, 12);
    myelinate(c, a2, 0.08, 0.95, 3, 0.22);
    finish(c, 0.8, V3(0.95, 1.15, 0.9));
    c.route = () => [S(trees.map((cv) => sg(c, cv, true)), 3, INP), S([sg(c, trunk, true)], 3, INP, () => { c.flash = st.t; }), S([sg(c, a1)], 5, AP), S([sg(c, a2), sg(c, col)], 8, AP)];
    c.lbl = [['dendritic tree in a single plane', V3(1.4, 4.4, 0)], ['cell body 60–70 µm', V3(0.95, 0.2, 0.4)], ['axon to the cerebellar nuclei', V3(0.4, -4.4, 0)], ['recurrent collateral', V3(1.4, -1.4, 0)]];
  }
  // 6 звездчатый
  { const c = newCell(NTYPES[5], org(5)); soma(c, blob(0.5, 1, 1, 1, 6));
    for (let i = 0; i < 10; i++) { const y = 1 - (i + 0.5) / 10 * 2, r = Math.sqrt(1 - y * y), th = i * 2.4; const d = V3(Math.cos(th) * r, y * 0.9 + 0.15, Math.sin(th) * r).normalize(); if (d.y < -0.75) continue; c.prim.push(tree(c, d.clone().multiplyScalar(0.45), d, 1.5, 0.1, 2, { spread: 0.6 })); }
    const ax = addTube(c, [V3(0, -0.45, 0), V3(0.1, -1.1, 0.1), V3(0.2, -1.9, 0)], 0.1, 0.06, true, 14);
    const terms = [V3(-0.9, -2.6, 0.3), V3(0.2, -2.9, -0.4), V3(1.2, -2.5, 0.2), V3(0.6, -2.2, 0.8)].map((t) => addTube(c, [V3(0.2, -1.9, 0), V3(0.2, -1.9, 0).lerp(t, 0.5).add(V3(0, 0.15, 0)), t], 0.05, 0.04, true, 10));
    terms.forEach((cv) => { const e = cv.getPointAt(1), b = new THREE.SphereGeometry(0.12, 10, 8); b.translate(e.x, e.y, e.z); c.ag.push(b); });
    finish(c, 0.5);
    c.route = () => [S(c.prim.slice(0, 5).map((cv) => sg(c, cv, true)), 4, INP, () => { c.flash = st.t; }), S([sg(c, ax)], 4, AP), S(terms.map((cv) => sg(c, cv)), 4, AP)];
    c.lbl = [['dendrites in all directions', V3(1.2, 2.0, 0)], ['cell body', V3(0.6, 0.3, 0.3)], ['short axon branches nearby', V3(1.2, -2.3, 0)]];
  }
  // 7 веретеновидный
  { const c = newCell(NTYPES[6], org(6)); soma(c, blob(0.42, 1, 2.3, 1, 7));
    const up = addTube(c, [V3(0, 0.9, 0), V3(0.05, 1.7, 0), V3(0, 2.5, 0)], 0.15, 0.1, false, 16); c.prim.push(up);
    const dn = addTube(c, [V3(0, -0.9, 0), V3(-0.05, -1.6, 0), V3(0, -2.3, 0)], 0.15, 0.1, false, 16); c.prim.push(dn);
    [V3(-0.6, 1, 0.2), V3(0.1, 1, -0.4), V3(0.6, 1, 0.2)].forEach((d) => tree(c, V3(0, 2.5, 0), d, 1.0, 0.09, 2, { spread: 0.55 }));
    [V3(-0.6, -1, 0.2), V3(0.1, -1, -0.4), V3(0.6, -1, 0.2)].forEach((d) => tree(c, V3(0, -2.3, 0), d, 0.9, 0.09, 2, { spread: 0.55 }));
    const ax = addTube(c, [V3(0.35, 0.1, 0), V3(1.0, -0.4, 0.1), V3(1.5, -1.8, 0), V3(1.6, -3.4, 0), V3(1.4, -5.0, 0)], 0.12, 0.08, true, 40);
    finish(c, 0.42, V3(1, 2.2, 1));
    c.route = () => [S([sg(c, up, true), sg(c, dn, true)], 3, INP, () => { c.flash = st.t; }), S([sg(c, ax)], 6, AP)];
    c.lbl = [['elongated cell body', V3(0.5, 0.5, 0.3)], ['dendrite tuft', V3(0.8, 3.0, 0)], ['second tuft', V3(-1.9, -2.6, 0)], ['axon', V3(1.7, -3.6, 0)]];
  }

  /* ---------- сеть из пяти нейронов ---------- */
  const NET = V3(0, -48, 0), NC = V3(4.2, 0, 0);
  const at = (x, y, z = 0) => V3(x, y, z);
  // оболочки: кожа, ганглий, серое вещество спинного мозга
  const skin = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.6, 3.2), new THREE.MeshPhysicalMaterial({ color: 0xe7a98f, roughness: 0.7, transparent: true, opacity: 0.55, depthWrite: false, sheen: 1, sheenColor: new THREE.Color(0xffd0c0) }));
  skin.position.copy(NET).add(at(-10, -3.55)); scene.add(skin);
  const gang = new THREE.Mesh(new THREE.SphereGeometry(1.35, 32, 20), glassMat(0xffd08a, { rim: 0.55, base: 0.02 })); gang.position.copy(NET).add(at(-4.5, 3.4)); scene.add(gang);
  const cord = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), glassMat(0x9fb0ff, { rim: 0.45, base: 0.012, pow: 2 })); cord.scale.set(3.9, 4.3, 2.2); cord.position.copy(NET).add(at(4.6, 0.3)); scene.add(cord);
  const fibMat = new THREE.MeshPhysicalMaterial({ color: 0xb8343c, roughness: 0.5, clearcoat: 0.4, sheen: 1, sheenColor: new THREE.Color(0xff9a8a), emissive: 0x3a0508, emissiveIntensity: 1 });
  const fibers = [-2.0, -2.9, -3.8].map((y) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 4.6, 8, 20), fibMat); m.rotation.z = Math.PI / 2; m.position.copy(NET).add(at(19.4, y)); scene.add(m); return m; });

  const sens = newCell(null, NET.clone()); soma(sens, blob(0.55, 1, 1, 1, 8), at(-4.5, 3.6));
  const sStalk = addTube(sens, [at(-4.5, 3.1), at(-4.3, 2.8), at(-4.6, 2.5), at(-4.5, 2.2)], 0.11, 0.1, true, 14);
  const sPer = addTube(sens, [at(-4.5, 2.2), at(-6.6, 1.6), at(-8.8, -0.2), at(-9.8, -2.2), at(-10, -3.2)], 0.1, 0.09, true, 50);
  const sCen = addTube(sens, [at(-4.5, 2.2), at(-2.6, 1.7, 0.2), at(-0.6, 1.25), at(0.85, 0.95)], 0.1, 0.09, true, 40);
  [V3(-0.6, -1, 0.3), V3(0.1, -1, -0.3), V3(0.6, -1, 0.2)].forEach((dd) => tree(sens, at(-10, -3.2), dd, 0.45, 0.04, 1, { spread: 0.6, axon: true }));
  myelinate(sens, sPer, 0.08, 0.9, 4, 0.2); myelinate(sens, sCen, 0.12, 0.85, 2, 0.2);
  finish(sens, 0.55);

  const int1 = newCell(null, NET.clone()); soma(int1, blob(0.5, 1, 1, 1, 9), at(2.6, 0.2));
  const i1Dend = addTube(int1, [at(2.2, 0.5), at(1.6, 0.8), at(1.05, 0.95)], 0.12, 0.07, false, 12); int1.prim.push(i1Dend);
  [V3(0.3, 1, 0.3), V3(-0.4, -1, 0.4), V3(0.2, -1, -0.5)].forEach((d) => int1.prim.push(tree(int1, at(2.6, 0.2).addScaledVector(d.normalize(), 0.45), d, 1.0, 0.09, 1, { spread: 0.6 })));
  const i1Ax0 = addTube(int1, [at(2.95, -0.15), at(3.1, -0.4), at(3.25, -0.7)], 0.13, 0.08, true, 10);
  const i1AxA = addTube(int1, [at(3.25, -0.7), at(3.9, 0.4), at(4.4, 1.6), at(4.85, 2.25)], 0.07, 0.06, true, 24);
  const i1Col = addTube(int1, [at(3.25, -0.7), at(4.2, -1.3), at(5.2, -1.7), at(6.0, -1.85)], 0.07, 0.06, true, 24);
  finish(int1, 0.5);

  const int2 = newCell(null, NET.clone()); soma(int2, blob(0.5, 1, 1, 1, 10), at(5.7, 3.1, 0.3));
  const i2Dend = addTube(int2, [at(5.3, 2.8, 0.3), at(5.05, 2.45, 0.1), at(4.95, 2.3)], 0.12, 0.07, false, 10); int2.prim.push(i2Dend);
  [V3(0.4, 1, 0.3), V3(-0.3, 1, -0.4), V3(1, 0.4, 0.2)].forEach((d) => int2.prim.push(tree(int2, at(5.7, 3.1, 0.3).addScaledVector(d.normalize(), 0.45), d, 1.0, 0.09, 1, { spread: 0.6 })));
  const i2Ax = addTube(int2, [at(6.15, 2.8, 0.3), at(6.5, 1.9, 0.2), at(5.4, 0.9, 0.1), at(3.25, 0.45)], 0.09, 0.06, true, 30);
  finish(int2, 0.5);

  const mot = newCell(null, NET.clone()); soma(mot, blob(0.75, 1, 1, 0.9, 11), at(7.4, -2.6));
  const mDend = addTube(mot, [at(6.85, -2.25), at(6.4, -2.0), at(6.1, -1.9)], 0.17, 0.08, false, 10); mot.prim.push(mDend);
  [V3(0.3, 1, 0.4), V3(-0.4, -1, 0.5), V3(0.9, 0.6, -0.4), V3(0.1, -1, -0.6)].forEach((d) => mot.prim.push(tree(mot, at(7.4, -2.6).addScaledVector(d.normalize(), 0.65), d, 1.3, 0.14, 1, { spread: 0.6 })));
  const mAx = addTube(mot, [at(8.0, -3.0), at(9.5, -3.3), at(12, -3.2), at(14.5, -2.9), at(16.2, -2.9)], 0.13, 0.11, true, 60);
  const mTerms = [at(17.5, -1.6), at(17.6, -2.5), at(17.5, -3.4)].map((t) => addTube(mot, [at(16.2, -2.9), at(16.2, -2.9).lerp(t, 0.5).add(at(0, 0.15)), t], 0.07, 0.06, true, 12));
  mTerms.forEach((cv) => { const e = cv.getPointAt(1), b = new THREE.SphereGeometry(0.2, 12, 8); b.scale(1, 0.45, 1); b.translate(e.x, e.y, e.z); mot.ag.push(b); });
  myelinate(mot, mAx, 0.1, 0.88, 4, 0.24);
  finish(mot, 0.75);
  const netCells = [sens, int1, int2, mot];
  const synPts = { a: NET.clone().add(at(0.95, 0.95)), b: NET.clone().add(at(4.9, 2.3)), c: NET.clone().add(at(6.05, -1.88)), d: NET.clone().add(at(3.2, 0.45)) };
  [synPts.a, synPts.b, synPts.c, synPts.d].forEach((p) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffb070 })); b.position.copy(p); scene.add(b); });

  /* ---------- импульсы ---------- */
  const heads = []; for (let i = 0; i < 64; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.scale.setScalar(1.1); s.visible = false; scene.add(s); heads.push(s); }
  const trail = new Sparks(5000, 0.2); scene.add(trail.obj);
  let pulses = []; const tp = V3(0, 0, 0);
  function emit(route) { pulses.push({ route, i: 0, t: 0 }); }
  function burst(p, col) { for (let k = 0; k < 26; k++) trail.spawn(p, randUnit().multiplyScalar(rand(0.4, 1.3)), col, rand(0.5, 0.9), 2.5, 1.6); }
  function runPulses(dt) {
    let hi = 0;
    for (const p of pulses) {
      const g = p.route[p.i]; if (!g) { p.done = true; continue; }
      p.t += dt; const u = clamp(p.t / g.dur, 0, 1);
      for (const s of g.segs) {
        s.c.getPointAt(s.rev ? 1 - u : u, tp).add(s.o);
        const hd = heads[hi++]; if (hd) { hd.visible = true; hd.position.copy(tp); hd.material.color.copy(g.col); }
        trail.spawn(tp, randUnit().multiplyScalar(0.12), g.col, 0.35, 2, 0.9);
      }
      if (u >= 1) { p.i++; p.t = 0; g.end && g.end(); }
    }
    pulses = pulses.filter((p) => !p.done);
    for (; hi < heads.length; hi++) heads[hi].visible = false;
  }
  // сеть: событийная цепочка
  function int1Fire(gen) {
    emit([S([sg(int1, i1Ax0)], 4, AP), S([sg(int1, i1AxA), sg(int1, i1Col)], 5, AP, () => {
      burst(synPts.b, GLU); burst(synPts.c, GLU);
      if (gen < 2) emit([S([sg(int2, i2Dend, true)], 3, INP, () => { int2.flash = st.t; emit([S([sg(int2, i2Ax)], 5, AP, () => { burst(synPts.d, GLU); int1.flash = st.t; int1Fire(gen + 1); })]); })]);
      emit([S([sg(mot, mDend, true)], 3, INP, () => { mot.flash = st.t; emit([S([sg(mot, mAx)], 9, AP), S(mTerms.map((cv) => sg(mot, cv)), 5, AP, () => { mTerms.forEach((cv) => burst(cv.getPointAt(1).add(NET), ACH)); st.twitchT = st.t; st.twitch++; })]); })]);
    })]);
  }
  function netFire() {
    st.touchT = st.t;
    emit([S([sg(sens, sPer, true)], 7, AP, () => { sens.flash = st.t - 0.15; }), S([sg(sens, sCen)], 7, AP, () => { burst(synPts.a, GLU); emit([S([sg(int1, i1Dend, true)], 3, INP, () => { int1.flash = st.t; int1Fire(0); })]); })]);
  }
  let rr = 0;
  function fireNow() {
    if (st.view === 'net') { netFire(); return; }
    if (st.view === 'all') { const c = cells[rr++ % 7]; emit(c.route()); return; }
    emit(byId[st.view].route());
  }

  /* ---------- окраски ---------- */
  function applyStain() {
    const s = st.stain, bg = s === 'golgi' ? GOLGI_BG : BG;
    scene.background.set(bg); scene.fog.color.set(bg); scene.fog.density = s === 'golgi' ? 0.004 : 0.011;
    cells.forEach((c) => {
      const hue = new THREE.Color().setHSL(c.hue, 0.85, 0.55);
      [c.mat, c.axMat, c.somaMat].forEach((m) => {
        const isSoma = m === c.somaMat;
        m.transparent = s === 'nissl'; m.depthWrite = s !== 'nissl';
        m.opacity = s === 'nissl' ? (m === c.axMat ? 0.1 : 0.2) : 1;
        if (s === 'live') { m.color.set(0xcdb0c4); m.roughness = 0.46; m.clearcoat = 0.55; m.sheen = 1; m.emissive.set(isSoma ? 0xff8a3c : 0x12081a); m.emissiveIntensity = 1; }
        else if (s === 'golgi') { m.color.set(0x060403); m.roughness = 1; m.clearcoat = 0; m.sheen = 0; m.emissive.set(isSoma ? 0xffb070 : 0x000000); m.emissiveIntensity = 1; }
        else if (s === 'nissl') { m.color.set(0x9aa8e8); m.roughness = 0.6; m.clearcoat = 0; m.sheen = 0; m.emissive.set(isSoma ? 0x8fa0ff : 0x000000); m.emissiveIntensity = 1; }
        else { m.color.copy(hue); m.roughness = 0.4; m.clearcoat = 0.4; m.sheen = 0; m.emissive.copy(hue); m.emissiveIntensity = 0.35; }
        m.needsUpdate = true;
      });
      c.somaBase = s === 'bb' ? 0.35 : 0;
      c.nissl.visible = s === 'nissl'; c.nuc.visible = s === 'nissl';
    });
    myelins.forEach((m) => { m.visible = s === 'live'; });
  }

  /* ---------- камера ---------- */
  const views = { all: { tgt: V3(-8.5, 0.5, 0), pos: V3(-8.5, 2.5, 55) }, net: { tgt: NET.clone().add(NC).add(V3(0, -3, 0)), pos: NET.clone().add(NC).add(V3(0, 1, 40)) } };
  cells.slice(0, 7).forEach((c) => { views[c.def.id] = { tgt: c.origin.clone().add(V3(0, -2.6, 0)), pos: c.origin.clone().add(V3(4.5, 0.5, 24)) }; });
  views.purk.pos = byId.purk.origin.clone().add(V3(13, 1.5, 20));
  const st = { view: 'all', stain: 'live', auto: true, labels: true, t: 0, next: 0.8, fly: 1, twitch: 0, twitchT: -9, touchT: -9 };
  function go(id) { st.view = id; st.fly = 1; st.next = st.t + 1.2; pulses = []; }

  /* ---------- клик по клетке ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!controls.enabled || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(cells.flatMap((c) => c.pick), false)[0]; if (!hit) return;
    const c = cells.find((cc) => cc.pick.includes(hit.object));
    if (c && c.def && st.view !== c.def.id) { go(c.def.id); refs.viewSeg && refs.viewSeg.sync(); refs.setInfo && refs.setInfo(); }
    else if (c) fireNow();
  });

  function update(dt) {
    st.t += dt;
    bloom.strength = (st.stain === 'golgi' ? 0.12 : 1.1) * LOOK.bloom;
    if (st.fly > 0) {
      const v = views[st.view], k = 1 - Math.exp(-dt * 2.6);
      camera.position.lerp(v.pos, k); controls.target.lerp(v.tgt, k);
      if (camera.position.distanceTo(v.pos) < 0.05) st.fly = 0;
    }
    if (st.auto && st.t > st.next) { fireNow(); st.next = st.t + (st.view === 'net' ? 5.5 : st.view === 'all' ? 0.55 : 2.2); }
    runPulses(dt); trail.update(dt);
    const fk = st.stain === 'live' ? 1.6 : st.stain === 'bb' ? 1.2 : 0.5;
    cells.forEach((c) => { c.somaMat.emissiveIntensity = c.somaBase + fk * Math.exp(-(st.t - c.flash) / 0.22); });
    const tw = Math.exp(-(st.t - st.twitchT) / 0.18);
    fibers.forEach((f) => { f.scale.y = 1 - 0.14 * tw; }); fibMat.emissiveIntensity = 1 + 3 * tw;
    skin.material.emissive.setRGB(0.6 * Math.exp(-(st.t - st.touchT) / 0.3), 0.25 * Math.exp(-(st.t - st.touchT) / 0.3), 0);
  }

  const labels = [];
  cells.slice(0, 7).forEach((c) => {
    labels.push({ text: c.def.name, pos: c.somaPos.clone().add(c.origin).add(V3(1.1, -0.9, 0.3)), show: () => st.labels && st.view === 'all' });   // под сомой справа: не на дендритах и не под описанием
    c.lbl.forEach(([t, p]) => labels.push({ text: t, pos: c.origin.clone().add(p), show: () => st.labels && st.view === c.def.id }));
  });
  [['skin', at(-11.2, -4.3)], ['sensory neuron', at(-4.0, 4.5)], ['spinal ganglion', at(-3.6, 2.2)], ['interneuron 1', at(2.4, -0.8)], ['interneuron 2', at(6.3, 3.9, 0.3)],
    ['spinal cord gray matter', at(2.2, 4.9)], ['motor neuron', at(7.9, -3.7)], ['muscle fibers', at(19.6, -4.7)], ['synapse: glutamate', at(0.6, 1.6)], ['neuromuscular junction', at(16.4, -0.9)]]
    .forEach(([t, p]) => labels.push({ text: t, pos: NET.clone().add(p), show: () => st.labels && st.view === 'net' }));

  let refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    const setInfo = () => {
      const base = st.view === 'all' ? 'Seven shapes of nerve cells. Click a cell or select it above. The impulse always travels from the dendrites (input) through the cell body to the axon (output).' : st.view === 'net' ? NET_TEXT : NTYPES.find((d) => d.id === st.view).text;
      info.innerHTML = base + (STAIN_TEXT[st.stain] ? '<br><br>' + STAIN_TEXT[st.stain] : '');
    };
    const viewSeg = seg([{ id: 'all', label: 'All' }, ...NTYPES.map((d) => ({ id: d.id, label: d.short })), { id: 'net', label: 'Network' }], () => st.view, (v) => { go(v); setInfo(); });
    const stSeg = seg([{ id: 'live', label: 'Live' }, { id: 'golgi', label: 'Golgi', color: '#c9793a' }, { id: 'nissl', label: 'Nissl', color: '#6b7bff' }, { id: 'bb', label: 'Brainbow', color: '#c77dff' }], () => st.stain, (v) => { st.stain = v; applyStain(); setInfo(); });
    const auto = toggle('Auto', () => st.auto, (v) => { st.auto = v; st.next = st.t + 0.3; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    refs = { viewSeg, stSeg, auto, lab, setInfo };
    el.append(group('Cell', '0–8', viewSeg), group('Stain', 'G', stSeg), group('Signal', 'Space · A · N', button('Impulse', fireNow, true), auto, lab),
      h('div', { class: 'grp', style: 'flex:1 1 320px' }, h('div', { class: 'glabel' }, 'What you see'), info));
    setInfo();
  }
  const VIEW_KEYS = ['all', ...NTYPES.map((d) => d.id), 'net'];
  function onKey(e) {
    const n = parseInt(e.key, 10);
    if (n >= 0 && n <= 8) { go(VIEW_KEYS[n]); refs.viewSeg.sync(); refs.setInfo(); return true; }
    if (e.code === 'Space') { fireNow(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'g' || k === 'п') { const o = ['live', 'golgi', 'nissl', 'bb']; st.stain = o[(o.indexOf(st.stain) + 1) % 4]; applyStain(); refs.stSeg.sync(); refs.setInfo(); return true; }
    if (k === 'a' || k === 'ф') { refs.auto.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.view === 'all') return [['Shapes', 7, ''], ['Cell body', '5–100', 'µm']];
    if (st.view === 'net') return [['Neurons', 5, ''], ['Twitches', st.twitch, '']];
    return NTYPES.find((d) => d.id === st.view).tiles;
  }
  applyStain();
  return {
    mobZoom: 0.66, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F5C26B',
    kicker: 'Brain · neurons', title: 'Neuron types',
    lede: 'Seven shapes of nerve cells and a small neural network. You can stain them the way Golgi and Nissl did, or color them with the Brainbow method.',
    notes: `
      <div><h2>How a neuron is built</h2>
        <p>A neuron has a <b>cell body (soma)</b> with a nucleus and ribosomes, where proteins are synthesized, and two kinds of processes. <b>Dendrites</b> receive signals and carry them to the cell body. The cell body sums excitatory and inhibitory inputs and decides whether to fire a response. The <b>axon</b> carries the impulse away to other cells. The axon leaves the cell body at a site called the <b>axon hillock</b>.</p>
        <h3>Dendrite and axon</h3>
        <p>A dendrite is shorter (about 0.5–1 mm), branches at acute angles and tapers like a tree branch. An axon is from centimeters to a meter or more long. It keeps a constant diameter of 0.5–1.5 µm and branches at right angles: collaterals copy the signal to several targets. Dendrites in the CNS are usually unmyelinated, axons are often myelinated. Nissl substance is present in dendrites but absent from the axon.</p>
        <h3>Three functional classes</h3>
        <p><b>Sensory</b> (afferent) neurons sit at the input, <b>interneurons</b> link input to output, and in a complex nervous system they are the most numerous. <b>Effector</b> (efferent) neurons sit at the output: motor neurons control muscles, autonomic neurons control organs.</p>
        <h3>How cells were first seen</h3>
        <p>In 1836 Purkinje fixed the soft tissue of the cerebellum and made out large cells. <b>Golgi</b> invented silver staining, <b>Ramón y Cajal</b> drew the finest branchings and synapses, and both received the 1906 Nobel Prize. <b>Nissl</b> stained ribosomes with methylene blue.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The number and arrangement of processes in each shape.</li><li>Acute branching angles in dendrites, right angles in axon collaterals.</li><li>The flat tree of the Purkinje cell, the spines of the pyramidal neuron, the T-shaped process of the sensory neuron.</li><li>The look of the stains: a black silhouette on orange, Nissl substance only in the cell body and dendrite bases.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Cell sizes are equalized, and axons are greatly shortened.</li><li>The impulse is slowed roughly a thousandfold.</li><li>The Golgi method stains only some cells; here all of them are stained.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>0</code>–<code>8</code> cell, <code>8</code> network</li><li>click a cell: select</li><li><code>G</code> stain</li><li><code>Space</code> impulse</li><li><code>A</code> auto</li><li><code>N</code> labels</li></ul></div>`,
  };
}
export { makeTypes };
