import { GLOW, Sparks, THREE, V3, __set_rnd, button, clamp, displaceGeo, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, lerp, makeControls, mergeGeometries, mulberry, noise3, pickOn, rand, randUnit, rnd, seg, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 1 · СТРОЕНИЕ НЕРВНОЙ КЛЕТКИ (рис. 1.4)
   ========================================================= */
const SOMA_PARTS = [
  { id: 'dend', name: 'Dendrites', color: '#C9A6E8', text: '<b>Dendrites</b> are the branching inputs of the neuron. They receive most of its synapses. Dendrites also contain Nissl substance and mitochondria: proteins are made right on the spot.' },
  { id: 'spine', name: 'Spines', color: '#F0C8FF', text: '<b>Dendritic spines</b> are protrusions up to 3 µm long, each with a single synapse on its head. Spines grow, change shape and disappear during learning: this is synaptic plasticity you can actually see.' },
  { id: 'nuc', name: 'Nucleus', color: '#9F7BFF', text: 'The <b>nucleus</b> stores DNA. RNA molecules leave through its large pores and travel to the ribosomes. A neuron’s nucleus is large and pale because its genes are very active.' },
  { id: 'nucl', name: 'Nucleolus', color: '#D36FB6', text: 'The <b>nucleolus</b> is a dark region of the nucleus where ribosomes are assembled. In neurons it is especially prominent.' },
  { id: 'nissl', name: 'Nissl substance', color: '#5FB6E6', text: '<b>Nissl substance</b> (tigroid substance) consists of stacks of rough ER packed with ribosomes. A neuron is constantly making proteins: channels, receptors, enzymes for transmitter synthesis. Franz Nissl saw these clumps by staining tissue with methylene blue. There is no Nissl substance in the axon hillock.' },
  { id: 'golgi', name: 'Golgi apparatus', color: '#E9A94C', text: 'The <b>Golgi apparatus</b> finishes processing proteins from the ER and buds off vesicles, including the transmitter-filled vesicles for synapses.' },
  { id: 'mito', name: 'Mitochondria', color: '#E0703F', text: '<b>Mitochondria</b> oxidize glucose and produce ATP. A neuron depends heavily on them: without oxygen it survives only a few minutes.' },
  { id: 'lyso', name: 'Lysosomes', color: '#9B6BE0', text: '<b>Lysosomes</b> digest worn-out proteins and membranes. A neuron lives as long as the person does, so clearing out waste is especially important for it.' },
  { id: 'fil', name: 'Neurofilaments and microtubules', color: '#8FE0C4', text: '<b>Neurofilaments and microtubules</b> hold the shape of the neuron’s processes and act as rails: motor proteins carry vesicles and mitochondria along them in both directions through the axon (bright dots).' },
  { id: 'hill', name: 'Axon hillock', color: '#FFB070', text: 'The <b>axon hillock</b> is where the action potential arises. It has the highest density of sodium channels and the lowest threshold. All signals from the dendrites and the cell body are summed right here.' },
  { id: 'myel', name: 'Myelin sheath', color: '#F1E7D6', text: 'The <b>myelin sheath</b> is a layered wrapping made from the membrane of a glial cell (a Schwann cell in the periphery, an oligodendrocyte in the brain). Between the wrappings are the nodes of Ranvier, and the impulse jumps from node to node.' },
  { id: 'syn', name: 'Synapses', color: '#FFC07A', text: '<b>Synapses</b> are the endings of other neurons’ axons on the dendrites, spines and cell body. Orange ones excite, blue ones inhibit. A single cortical neuron has thousands of them.' },
];

function makeSoma() {
  __set_rnd(mulberry(77));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex; scene.fog = new THREE.FogExp2(0x07060a, 0.012);
  labLights(scene, 0xc9a6ff);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 300); camera.position.set(7, 6.5, 27);
  const controls = makeControls(camera, V3(3, -1.8, 0)); controls.minDistance = 2.5; controls.maxDistance = 60;

  const PART = Object.fromEntries(SOMA_PARTS.map((p) => [p.id, { ...p, mats: [], anchor: V3(0, 0, 0), dist: 9 }]));
  const pickables = [];
  const tag = (mesh, id, track = true) => { mesh.userData.pick = id; pickables.push(mesh); if (track && mesh.material && mesh.material.emissive) PART[id].mats.push(mesh.material); return mesh; };
  const cut = [new THREE.Plane(V3(-1, 0, 0), 0), new THREE.Plane(V3(0, 0, -1), 0)];
  const clipped = [];
  const clip = (m) => { m.clippingPlanes = cut; m.clipIntersection = true; clipped.push(m); return m; };
  const dummy = new THREE.Object3D(), Y = V3(0, 1, 0);

  /* ---------- тело (сома) ---------- */
  const SR = 3.0, YS = 0.86;
  const DDIR = [V3(-0.75, 0.62, 0.2), V3(-0.4, 0.9, -0.45), V3(0.15, 0.95, 0.35), V3(-0.95, -0.25, 0.4), V3(-0.55, -0.7, -0.55), V3(0.1, -0.85, 0.5)].map((d) => d.normalize());
  const AXD = V3(1, -0.18, 0).normalize();
  const bump = (n) => { let b = 0; DDIR.forEach((d) => { b += 0.55 * Math.pow(Math.max(0, n.dot(d)), 7); }); b += 0.7 * Math.pow(Math.max(0, n.dot(AXD)), 5); return b; };
  const somaGeo = displaceGeo(new THREE.SphereGeometry(SR, 140, 100), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + bump(n) + 0.03 * noise3(n.x * 3, n.y * 3, n.z * 3)); v.y *= YS; });
  const memMat = clip(tissue(0xa996d8, { transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, roughness: 0.35 }));
  scene.add(new THREE.Mesh(somaGeo, memMat));
  const memGlass = glassMat(0xc9b6ff, { rim: 0.75, base: 0.012, pow: 2.2 }); clip(memGlass);
  scene.add(new THREE.Mesh(somaGeo, memGlass));
  const cytoGeo = somaGeo.clone(); cytoGeo.scale(0.97, 0.97, 0.97);
  scene.add(new THREE.Mesh(cytoGeo, clip(tissue(0x3a2f5a, { transparent: true, opacity: 0.32, depthWrite: false, side: THREE.BackSide }))));

  /* ---------- дендриты, шипики ---------- */
  const dendArr = [], spineSpots = [], dendCurves = [];
  // дерево как branchTree, но в точке ветвления сфера-узел, а дочерние ветви начинаются чуть раньше конца — без изломов и щелей
  function soTree(arr, start, dir, len, r, depth, o) {
    const { spread, wob, shrink, segs, rad, leaf } = o;
    const pts = [start.clone()]; let p = start.clone(); const d = dir.clone().normalize();
    for (let k = 1; k <= 3; k++) { d.add(randUnit().multiplyScalar(wob)).normalize(); p = p.clone().addScaledVector(d, len / 3); pts.push(p); }
    const r1 = depth > 0 ? r * 0.68 : r * 0.45;
    const c = new THREE.CatmullRomCurve3(pts); arr.push(taperTube(c, (u) => r + (r1 - r) * u, segs, rad));
    if (depth === 0 && leaf) leaf(p, d, c);
    if (depth > 0) {
      const j = new THREE.SphereGeometry(r1 * 1.02, rad * 2, rad); j.translate(p.x, p.y, p.z); arr.push(j);
      const q = p.clone().addScaledVector(d, -0.05 * len);
      for (let k = 0; k < 2; k++) soTree(arr, q, d.clone().add(randUnit().multiplyScalar(spread)).normalize(), len * shrink, r1, depth - 1, o);
    }
    return c;
  }
  DDIR.forEach((d, i) => {
    const base = d.clone().multiplyScalar(SR * 1.15); base.y *= YS;
    const c = soTree(dendArr, base, d, 4.2 + (i % 3) * 0.6, 0.62, 2, { spread: 0.75, wob: 0.22, shrink: 0.78, segs: 22, rad: 10, leaf: (p, dd, cc) => dendCurves.push(cc) });
    dendCurves.push(c);
  });
  const dendMat = tissue(0x9f86cf, { roughness: 0.4 });
  const dendMesh = tag(new THREE.Mesh(mergeGeometries(dendArr), dendMat), 'dend'); scene.add(dendMesh);
  // шипики вдоль дальних ветвей
  const spineArr = [];
  dendCurves.forEach((c, ci) => {
    // на стволах шипиков мало (только дистальнее), основание шипика — на фактической поверхности ветви
    const prim = ci < DDIR.length, nS = prim ? 3 : 14;
    for (let k = 0; k < nS; k++) {
      const u = prim ? rand(0.6, 0.95) : rand(0.25, 0.95), p = c.getPointAt(u), t = c.getTangentAt(u);
      const out = randUnit().cross(t).normalize(), rr = prim ? 0.62 * (1 - 0.32 * u) : 0.287 - 0.158 * u;
      const a = p.clone().addScaledVector(out, rr * 0.8), b = p.clone().addScaledVector(out, rr + 0.32);
      spineArr.push(taperTube(new THREE.CatmullRomCurve3([a, b]), () => 0.035, 3, 5));
      const head = new THREE.SphereGeometry(0.095, 10, 8); head.translate(b.x, b.y, b.z); spineArr.push(head);
      spineSpots.push({ p: b.clone(), out: out.clone(), c, u });
    }
  });
  scene.add(tag(new THREE.Mesh(mergeGeometries(spineArr), tissue(0xd9b8f2, { roughness: 0.35 })), 'spine'));
  PART.dend.anchor = dendCurves[0].getPointAt(0.6); PART.dend.dist = 9;
  PART.spine.anchor = spineSpots[spineSpots.length - 3].p.clone(); PART.spine.dist = 3.2;

  /* ---------- аксонный холмик, начальный сегмент, миелин ---------- */
  const H0 = AXD.clone().multiplyScalar(SR * 1.1); H0.y *= YS;
  const axCurve = new THREE.CatmullRomCurve3([H0.clone().addScaledVector(AXD, -0.6), H0, H0.clone().addScaledVector(AXD, 2.4), V3(H0.x + 5.5, H0.y - 0.5, 0.1), V3(H0.x + 11, H0.y - 0.3, -0.2), V3(H0.x + 17, H0.y + 0.2, 0), V3(H0.x + 23, H0.y + 0.1, 0.2)]);
  const AXL = axCurve.getLength();
  const uOf = (dist) => dist / AXL;
  const axR = (u) => { const d = u * AXL; return d < 0.6 ? 1.15 : d < 3.0 ? 1.15 - (d - 0.6) / 2.4 * 0.85 : 0.3; };
  const axGeo = taperTube(axCurve, axR, 240, 16);
  const axMat = clip(tissue(0xb59ad8, { roughness: 0.38 }));
  const axMesh = tag(new THREE.Mesh(axGeo, axMat), 'hill'); scene.add(axMesh);
  const hillGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.0 }));
  hillGlow.position.copy(axCurve.getPointAt(uOf(1.6))); hillGlow.scale.setScalar(2.4); scene.add(hillGlow);
  PART.hill.anchor = axCurve.getPointAt(uOf(1.5)); PART.hill.dist = 6;
  // миелиновые муфты со слоями (видны в разрезе)
  const myeMat = clip(tissue(0xb8ab96, { roughness: 0.25, clearcoat: 1, sheen: 0.4, sheenColor: new THREE.Color(0xffffff) }));
  const layMat = clip(tissue(0x8f8270, { roughness: 0.5, side: THREE.DoubleSide }));
  const nodesU = [];
  let d0 = 6.0; const SEGL = 5.5, GAP = 0.32;   // начальный сегмент голый; межузловые сегменты длинные, g ≈ 0.6
  while (d0 + SEGL < AXL - 0.4) {
    const ua = uOf(d0), ub = uOf(d0 + SEGL); nodesU.push(uOf(d0 - GAP / 2));
    const sub = new THREE.CatmullRomCurve3(Array.from({ length: 8 }, (_, k) => axCurve.getPointAt(ua + (ub - ua) * k / 7)));
    const prof = (u) => { const e = Math.min(u, 1 - u) * SEGL; return Math.min(1, e / 0.35); };
    scene.add(tag(new THREE.Mesh(taperTube(sub, (u) => 0.3 + 0.2 * Math.sqrt(prof(u)), 40, 22), myeMat), 'myel', nodesU.length === 1));
    for (let L = 1; L <= 5; L++) { const g = taperTube(sub, (u) => 0.3 + L * 0.035 * Math.sqrt(prof(u)), 30, 22); scene.add(tag(new THREE.Mesh(g, L % 2 ? layMat : myeMat), 'myel', false)); }
    d0 += SEGL + GAP;
  }
  nodesU.push(uOf(d0 - GAP / 2));
  PART.myel.anchor = axCurve.getPointAt(uOf(8.5)).add(V3(0, 0.5, 0)); PART.myel.dist = 6;

  /* ---------- ядро и ядрышко ---------- */
  const NUC = V3(-0.35, 0.25, 0), NR = 1.25;
  const nucGeo = displaceGeo(new THREE.SphereGeometry(NR, 96, 72), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.04 * noise3(n.x * 2, n.y * 2, n.z * 2)); v.add(NUC); });
  scene.add(tag(new THREE.Mesh(nucGeo, clip(tissue(0x6a46b0, { transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }))), 'nuc'));
  scene.add(new THREE.Mesh(nucGeo, clip(glassMat(0xb79bff, { rim: 0.8, base: 0.02, pow: 2.2 }))));
  { const chrom = clip(tissue(0xc27ad0, { roughness: 0.6, emissive: 0x1a0620 }));
    for (let c = 0; c < 22; c++) { let p = randUnit().multiplyScalar(rand(0.2, 0.9)); const d = randUnit(); const pts = [p.clone().add(NUC)];
      for (let k = 0; k < 9; k++) { d.add(randUnit().multiplyScalar(0.7)).normalize(); p = p.clone().addScaledVector(d, 0.22); if (p.length() > 1.05) { p.multiplyScalar(1.0 / p.length()); d.negate(); } pts.push(p.clone().add(NUC)); }
      scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.028, 5), chrom), 'nuc', c === 0)); } }
  const NO = NUC.clone().add(V3(0.25, 0.15, 0.1));
  scene.add(tag(new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(0.4, 4), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.12 * noise3(n.x * 4, n.y * 4, n.z * 4)); v.add(NO); }), clip(tissue(0x4a1a48, { roughness: 0.75, emissive: 0x1a0616 }))), 'nucl'));
  PART.nuc.anchor = NUC.clone().add(V3(-0.9, 1.1, 0.6)); PART.nuc.dist = 7;
  PART.nucl.anchor = NO.clone(); PART.nucl.dist = 3.5;

  const inSoma = (p, m = 0) => { const q = V3(p.x, p.y / YS, p.z); const n = q.clone().normalize(); return q.length() < SR * (1 + bump(n) * 0.6) - m; };
  const sample = (test) => { for (let i = 0; i < 5000; i++) { const p = V3(rand(-3.4, 3.4), rand(-3, 3), rand(-3.4, 3.4)); if (test(p)) return p; } return V3(0, -2, 1.5); };
  const nearHill = (p) => p.distanceTo(H0) < 2.2;

  /* ---------- субстанция Ниссля: стопки шероховатой ЭПС ---------- */
  const nisMat = clip(tissue(0x4fa9dc, { transparent: true, opacity: 0.85, side: THREE.DoubleSide, roughness: 0.3, emissive: 0x06263a }));
  const riboPts = [], nisSpots = [];
  for (let i = 0; i < 17; i++) {
    const p = sample((q) => inSoma(q, 0.55) && q.distanceTo(NUC) > NR + 0.45 && !nearHill(q) && nisSpots.every((s) => s.distanceTo(q) > 0.95)); nisSpots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(Y, p.clone().sub(NUC).normalize()); scene.add(g);
    const w = rand(0.45, 0.7);
    for (let k = 0; k < 5; k++) {
      const sh = displaceGeo(new THREE.SphereGeometry(1, 30, 12), (v) => { v.set(v.x * w, v.y * 0.035 + (k - 2) * 0.1, v.z * w * 0.6); v.y += 0.18 * (v.x * v.x); });
      const m = new THREE.Mesh(sh, nisMat); g.add(tag(m, 'nissl', i === 0 && k === 0));
      for (let r = 0; r < 26; r++) { const a = rand(0, 6.28), rr = Math.sqrt(rnd()); const lp = V3(Math.cos(a) * rr * w, (k - 2) * 0.1 + 0.045 * (rnd() < 0.5 ? 1 : -1), Math.sin(a) * rr * w * 0.6); lp.y += 0.18 * lp.x * lp.x; riboPts.push(lp.applyQuaternion(g.quaternion).add(p)); }
    }
  }
  // глыбки и в основаниях дендритов
  DDIR.forEach((d) => { for (let k = 0; k < 2; k++) { const p = d.clone().multiplyScalar(SR * (1.05 + k * 0.28)); p.y *= YS; for (let r = 0; r < 60; r++) riboPts.push(p.clone().add(randUnit().multiplyScalar(rand(0, 0.32)))); } });
  { const rm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 6, 5), clip(tissue(0xe06a6a, { roughness: 0.6, emissive: 0x200404 })), riboPts.length);
    riboPts.forEach((p, i) => { dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(1); dummy.updateMatrix(); rm.setMatrixAt(i, dummy.matrix); });
    scene.add(tag(rm, 'nissl', false)); }
  { const t0 = V3(-1.5, -1.2, 1.5); PART.nissl.anchor = nisSpots.reduce((a, b) => (a.distanceTo(t0) < b.distanceTo(t0) ? a : b)).clone(); } PART.nissl.dist = 4;

  /* ---------- аппарат Гольджи вокруг ядра ---------- */
  const golMat = clip(tissue(0xe9a94c, { roughness: 0.3, clearcoat: 0.9, emissive: 0x1a0d00 }));
  const golSpots = [];
  [V3(0.2, 1, 0.5), V3(-0.9, 0.2, -0.7), V3(0.4, -0.7, -0.6), V3(-0.5, -0.6, 0.9)].forEach((dir, gi) => {
    const nd = dir.normalize(), p = NUC.clone().addScaledVector(nd, NR + 0.4); golSpots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(Y, nd.clone().negate()); scene.add(g);
    for (let i = 0; i < 5; i++) { const w = 0.62 - Math.abs(i - 2) * 0.07, off = (i - 2) * 0.09;
      const sh = displaceGeo(new THREE.SphereGeometry(1, 36, 14), (v) => { v.set(v.x * w, v.y * 0.03 + off, v.z * w * 0.5); v.y += 0.35 * (v.x * v.x + v.z * v.z); });
      g.add(tag(new THREE.Mesh(sh, golMat), 'golgi', gi === 0 && i === 0));
      for (let k = 0; k < 4; k++) { const a = rand(0, 6.28); const b = new THREE.Mesh(new THREE.SphereGeometry(rand(0.04, 0.06), 10, 8), golMat); const x = Math.cos(a) * w * 1.05, z = Math.sin(a) * w * 0.53; b.position.set(x, off + 0.35 * (x * x + z * z), z); g.add(tag(b, 'golgi', false)); } }
  });
  PART.golgi.anchor = golSpots[0].clone(); PART.golgi.dist = 3.6;

  /* ---------- митохондрии, лизосомы ---------- */
  const spots = [...nisSpots, ...golSpots];
  const free = (p, d) => spots.every((s) => s.distanceTo(p) > d);
  const moMat = clip(tissue(0xd9663a, { transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.3, clearcoat: 1 }));
  const crMat = clip(tissue(0xffb07a, { roughness: 0.45, emissive: 0x2a0e00 }));
  const mitos = [];
  for (let i = 0; i < 11; i++) {
    const p = sample((q) => inSoma(q, 0.5) && q.distanceTo(NUC) > NR + 0.35 && free(q, 0.75)); spots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(Y, randUnit()); const len = rand(0.35, 0.7);
    g.add(tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.17, len, 8, 16), moMat), 'mito', i === 0));
    const nC = Math.round(len / 0.1); for (let k = 0; k < nC; k++) { const c = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), crMat); c.scale.set(0.13, 0.014, 0.12); c.position.y = -len / 2 + (k + 0.5) * len / nC; c.rotation.z = k % 2 ? 0.3 : -0.3; g.add(tag(c, 'mito', false)); }
    scene.add(g); mitos.push({ g, base: p.clone(), ph: rand(0, 6) });
  }
  PART.mito.anchor = mitos[0].base.clone(); PART.mito.dist = 2.8;
  const lyMat = clip(tissue(0x9b6be0, { roughness: 0.35, emissive: 0x1c0b33 })), lysos = [];
  for (let i = 0; i < 7; i++) { const p = sample((q) => inSoma(q, 0.5) && q.distanceTo(NUC) > NR + 0.3 && free(q, 0.55)); spots.push(p);
    const m = new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(rand(0.12, 0.2), 3), (v) => v.multiplyScalar(1 + 0.1 * noise3(v.x * 9 + i, v.y * 9, v.z * 9))), lyMat); m.position.copy(p); scene.add(tag(m, 'lyso', i === 0)); lysos.push({ m, base: p.clone(), ph: rand(0, 6) }); }
  PART.lyso.anchor = lysos.reduce((a, b) => (a.base.y > b.base.y ? a : b)).base.clone(); PART.lyso.dist = 2.4;

  /* ---------- нейрофиламенты и микротрубочки ---------- */
  const filMat = clip(tissue(0x8fe0c4, { emissive: 0x04140e, roughness: 0.4, transparent: true, opacity: 0.75 }));
  const filArr = [], filCurves = [];
  const axIn = (k) => { const off = randUnit().multiplyScalar(0.12 * k); return off; };
  for (let k = 0; k < 16; k++) {
    // из глубины тела — в аксон (сходятся в холмике)
    const s0 = sample((q) => inSoma(q, 0.9) && q.distanceTo(NUC) > NR + 0.2);
    const o = randUnit().multiplyScalar(rand(0.02, 0.22));
    const pts = [s0, s0.clone().lerp(H0, 0.35).add(randUnit().multiplyScalar(0.45)), s0.clone().lerp(H0, 0.7).add(randUnit().multiplyScalar(0.3)), H0.clone().add(o.clone().multiplyScalar(2.2)), axCurve.getPointAt(uOf(2.4)).add(o), axCurve.getPointAt(uOf(4.4)).add(o.clone().multiplyScalar(0.8))];
    const c = new THREE.CatmullRomCurve3(pts); filCurves.push(c); filArr.push(new THREE.TubeGeometry(c, 60, 0.012, 4));
  }
  DDIR.forEach((d) => { for (let k = 0; k < 4; k++) { const s0 = NUC.clone().add(randUnit().multiplyScalar(NR + 0.3)); const e = d.clone().multiplyScalar(SR * 1.2); e.y *= YS; const c = new THREE.CatmullRomCurve3([s0, s0.clone().lerp(e, 0.5).add(randUnit().multiplyScalar(0.25)), e.add(randUnit().multiplyScalar(0.2))]); filCurves.push(c); filArr.push(new THREE.TubeGeometry(c, 30, 0.016, 4)); } });
  scene.add(tag(new THREE.Mesh(mergeGeometries(filArr), filMat), 'fil'));
  PART.fil.anchor = H0.clone().addScaledVector(AXD, -0.9).add(V3(0, -0.6, 0)); PART.fil.dist = 4;
  // транспорт по аксону
  const cargo = new Sparks(600, 0.16); scene.add(cargo.obj);
  const C_ANT = new THREE.Color(0xd9fff0), C_RET = new THREE.Color(0xffb0d0);

  /* ---------- синапсы на нейроне ---------- */
  const synExc = tissue(0xffb070, { roughness: 0.35, emissive: 0xffb070, emissiveIntensity: 0.12 });
  const synInh = tissue(0x6fb4ff, { roughness: 0.35, emissive: 0x6fb4ff, emissiveIntensity: 0.12 });
  const fibMat = tissue(0x8a7a90, { roughness: 0.55 });
  const syns = [];
  function addSyn(p, out, kind, where, path) {
    const m = (kind === 'inh' ? synInh : synExc).clone(); m.userData.e0 = m.emissiveIntensity;
    const b = new THREE.Mesh(new THREE.SphereGeometry(where === 'spine' ? 0.15 : 0.24, 16, 12), m); b.position.copy(p).addScaledVector(out, where === 'spine' ? 0.12 : 0.2); scene.add(tag(b, 'syn', false)); PART.syn.mats.push(m);
    const far = b.position.clone().addScaledVector(out, 2.8).add(randUnit().multiplyScalar(0.8));   // чужой аксон сужается и уходит в туман
    scene.add(tag(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([b.position.clone(), b.position.clone().lerp(far, 0.5).add(randUnit().multiplyScalar(0.3)), far]), (u) => 0.05 * (0.25 + 0.75 * (1 - u)), 12, 5), fibMat), 'syn', false));
    syns.push({ b, m, kind, where, path, last: -9 });
  }
  // на шипиках и дендритах (возбуждающие)
  spineSpots.filter((_, i) => i % 3 === 0).slice(0, 14).forEach((s) => addSyn(s.p, s.out, 'exc', 'spine', s));
  dendCurves.slice(0, DDIR.length).forEach((c, i) => { const u = 0.55, p = c.getPointAt(u), t = c.getTangentAt(u), out = randUnit().cross(t).normalize(); addSyn(p.clone().addScaledVector(out, 0.42), out, 'exc', 'dend', { c, u }); });
  // на теле (оранжевые) и тормозные у холмика (голубые)
  for (let i = 0; i < 7; i++) { const n = randUnit(); if (n.dot(AXD) > 0.3) n.addScaledVector(AXD, -1).normalize(); const p = n.clone().multiplyScalar(SR * (1 + bump(n))); p.y *= YS; addSyn(p, n, 'exc', 'soma', null); }
  for (let i = 0; i < 3; i++) { const n = AXD.clone().add(randUnit().multiplyScalar(0.55)).normalize(); const p = n.clone().multiplyScalar(SR * (1 + bump(n)) * 0.98); p.y *= YS; addSyn(p, n, 'inh', 'soma', null); }
  PART.syn.anchor = syns[syns.length - 5].b.position.clone(); PART.syn.dist = 5;

  /* ---------- суммация и потенциал действия ---------- */
  const st = { t: 0, cut: true, rot: false, labels: true, sel: null, mode: 'none', vm: -70, psp: [], trace: [], spikeT: -9, refr: 0, waves: [], aps: [], fly: null, focusT: 0, nextAuto: 1.5, auto: true, msg: null, inhOn: false };
  const waveFx = new Sparks(900, 0.42); scene.add(waveFx.obj);
  const C_E = new THREE.Color(0xffb070), C_I = new THREE.Color(0x6fb4ff), C_AP = new THREE.Color(0xfff0c0);
  const HILL = axCurve.getPointAt(uOf(1.4));
  // путь волны: от синапса к холмику
  function wavePath(s) {
    const pts = [s.b.position.clone()];
    if (s.path && s.path.c) { for (let k = 1; k <= 4; k++) pts.push(s.path.c.getPointAt(Math.max(0, s.path.u * (1 - k / 4)))); }
    pts.push(V3(0, 0, 0).lerp(HILL, 0.3), HILL.clone());
    return new THREE.CatmullRomCurve3(pts);
  }
  function fire(s, delayMs = 0) {
    const dist = s.where === 'soma' ? 3 : s.where === 'dend' ? 6 : 9;
    const amp = s.kind === 'inh' ? -8 : s.where === 'soma' ? 5.5 : s.where === 'dend' ? 4.2 : 3.2;
    const tFire = st.t + delayMs / 1000 * 50;
    st.waves.push({ s, c: wavePath(s), t0: tFire, dur: dist * 0.12, kind: s.kind, arrived: false, amp });
  }
  const somaExc = () => syns.filter((s) => s.kind === 'exc');
  function single() { const s = syns.find((q) => q.where === 'dend'); fire(s); say('<b>A single synapse.</b> The transmitter has opened channels, and a small wave of depolarization (an EPSP, orange) runs along the dendrite toward the hillock. It fades on the way: only +3–5 mV reaches the hillock, far from threshold. A single synapse usually cannot trigger an impulse.'); }
  function spatial() { somaExc().filter((_, i) => i % 3 === 0).slice(0, 8).forEach((s) => fire(s, rand(0, 1))); say('<b>Spatial summation.</b> Eight synapses in different places fire almost simultaneously. Their waves add up at the hillock and cross the threshold (about −55…−50 mV): an action potential is born and travels down the axon, jumping between the nodes of Ranvier.'); }
  function temporal() { const s = syns.find((q) => q.where === 'soma' && q.kind === 'exc'); for (let k = 0; k < 6; k++) fire(s, k * 3.2); say('<b>Temporal summation.</b> The same synapse fires six times in a row. Each new wave arrives before the previous one has faded, and they add up to threshold.'); }
  function inhibit() { somaExc().filter((_, i) => i % 3 === 0).slice(0, 8).forEach((s) => fire(s, rand(0, 1))); syns.filter((s) => s.kind === 'inh').forEach((s) => { fire(s, 11); fire(s, 18); }); say('<b>Inhibition.</b> The same volley from eight synapses, but at the same moment inhibitory synapses right at the hillock fire too (blue, GABA). The inhibitory current cancels the excitation exactly where the fate of the impulse is decided, and no action potential arises.'); }
  function say(html) { st.msg = html; refs.setInfo && refs.setInfo(); }

  function select(id) {
    if (st.sel) PART[st.sel].mats.forEach((m) => { if (m.userData.e0s) { m.emissive.copy(m.userData.e0s.c); m.emissiveIntensity = m.userData.e0s.i; } });
    st.sel = id === 'all' ? null : id; st.msg = null;
    if (st.sel) { st.fly = flyTarget(PART[st.sel].anchor, PART[st.sel].anchor.clone().add(camera.position.clone().sub(controls.target).normalize().multiplyScalar(PART[st.sel].dist))); }
    else st.fly = flyTarget(V3(3, -1.8, 0), V3(7, 6.5, 27));
    refs.setInfo && refs.setInfo(); refs.seg && refs.seg.sync();
  }
  SOMA_PARTS.forEach((p) => PART[p.id].mats.forEach((m) => { if (!m.userData.e0s) m.userData.e0s = { c: m.emissive.clone(), i: m.emissiveIntensity }; }));
  const C_SEL = new THREE.Color();

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    // разрез повёрнут к камере
    const dx = camera.position.x - controls.target.x, dz = camera.position.z - controls.target.z, a = Math.atan2(dz, dx);
    cut[0].normal.set(-Math.cos(a + Math.PI / 4), 0, -Math.sin(a + Math.PI / 4)); cut[1].normal.set(-Math.cos(a - Math.PI / 4), 0, -Math.sin(a - Math.PI / 4));
    cut.forEach((p) => (p.constant = st.cut ? 0 : 1000));
    flyStep(st, camera, controls, dt);
    if (st.sel) { C_SEL.set(PART[st.sel].color); const pulse = 0.35 + 0.25 * Math.sin(t * 4); PART[st.sel].mats.forEach((m) => { m.emissive.copy(C_SEL); m.emissiveIntensity = pulse; }); }
    mitos.forEach((m) => { m.g.position.set(m.base.x + 0.06 * Math.sin(t * 0.5 + m.ph), m.base.y + 0.05 * Math.sin(t * 0.4 + m.ph * 2), m.base.z + 0.06 * Math.cos(t * 0.45 + m.ph)); });
    lysos.forEach((l) => l.m.position.set(l.base.x + 0.07 * Math.sin(t * 0.6 + l.ph), l.base.y + 0.06 * Math.cos(t * 0.5 + l.ph), l.base.z + 0.07 * Math.sin(t * 0.4 + l.ph)));
    // аксонный транспорт
    if (rnd() < dt * 26) { const out = rnd() < 0.6, u = out ? uOf(rand(1.5, 3)) : uOf(rand(8, 20)); const p = axCurve.getPointAt(u); const tg = axCurve.getTangentAt(u).multiplyScalar(out ? 1.1 : -0.8); cargo.spawn(p.add(randUnit().multiplyScalar(0.1)), tg, out ? C_ANT : C_RET, out ? 9 : 4, 0, 1.2); }
    cargo.update(dt);
    // авто-режим: редкие одиночные синапсы
    if (st.auto && t > st.nextAuto) { st.nextAuto = t + rand(0.5, 1.4); const s = syns[Math.floor(rnd() * syns.length)]; if (s.kind === 'exc') fire(s); }
    // волны → потенциал холмика
    let inh = 0;
    for (let i = st.waves.length - 1; i >= 0; i--) {
      const w = st.waves[i]; const k = (t - w.t0) / w.dur;
      if (k < 0) continue;
      if (!w.lit) { w.lit = true; w.s.last = t; }
      if (k < 1) { const p = w.c.getPointAt(k); waveFx.spawn(p, V3(0, 0, 0), w.kind === 'inh' ? C_I : C_E, 0.35, 0, 1.6 - k * 0.6); }
      else if (!w.arrived) { w.arrived = true; st.psp.push({ t0: t, amp: w.amp }); st.waves.splice(i, 1); }
    }
    syns.forEach((s) => { s.m.emissiveIntensity = 0.12 + 2.2 * Math.exp(-(t - s.last) / 0.12); });
    // ПСП: альфа-функция, τ ≈ 0.35 с (сцена замедлена в ~50 раз)
    let v = -70;
    for (let i = st.psp.length - 1; i >= 0; i--) { const q = st.psp[i], tt = (t - q.t0) / 0.32; if (tt > 8) { st.psp.splice(i, 1); continue; } const f = tt * Math.exp(1 - tt); v += q.amp * f; if (q.amp < 0) inh += -q.amp * f; }
    if (t - st.spikeT < 0.25) v = lerp(30, -78, (t - st.spikeT) / 0.25);
    else if (t - st.spikeT < 0.7) v = Math.min(v, lerp(-78, -70, (t - st.spikeT - 0.25) / 0.45));
    if (v > -55 && t - st.spikeT > 0.8) { st.spikeT = t; st.psp.length = 0; st.aps.push({ t0: t }); v = 30; }
    st.vm = v;
    hillGlow.material.opacity = clamp((v + 70) / 20, 0, 1) * 0.6 + (t - st.spikeT < 0.4 ? 1 : 0);
    st.trace.push([t, v]); while (st.trace.length && st.trace[0][0] < t - 4.5) st.trace.shift();
    // потенциал действия бежит по аксону сальтаторно
    for (let i = st.aps.length - 1; i >= 0; i--) {
      const ap = st.aps[i], k = (t - ap.t0) / 0.13;
      const ni = Math.floor(k);
      if (ni < nodesU.length) { const p = axCurve.getPointAt(nodesU[ni]); for (let j = 0; j < 5; j++) waveFx.spawn(p.clone().add(randUnit().multiplyScalar(0.25)), randUnit().multiplyScalar(0.6), C_AP, 0.45, 2, 2.2); }
      else st.aps.splice(i, 1);
    }
    waveFx.update(dt);
  }

  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt);
    const y = (v) => 12 + (35 - v) / 120 * (hgt - 24), x = (tt) => 8 + (1 - (st.t - tt) / 4.5) * (w - 16);
    ctx.lineWidth = 1; ctx.strokeStyle = '#2A2630';
    [30, -70].forEach((v) => { ctx.beginPath(); ctx.moveTo(8, y(v)); ctx.lineTo(w - 8, y(v)); ctx.stroke(); });
    ctx.setLineDash([4, 4]); ctx.strokeStyle = '#8f7a3a'; ctx.beginPath(); ctx.moveTo(8, y(-55)); ctx.lineTo(w - 8, y(-55)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#FFB070'; ctx.lineWidth = 2; ctx.beginPath();
    st.trace.forEach(([tt, v], i) => (i ? ctx.lineTo(x(tt), y(v)) : ctx.moveTo(x(tt), y(v)))); ctx.stroke();
    ctx.fillStyle = '#A49DA8'; ctx.font = '500 10px JetBrains Mono, monospace';
    ctx.fillText('hillock, mV', 10, 12); ctx.fillText('−70', w - 30, y(-70) - 3); ctx.fillStyle = '#c9a74a'; ctx.fillText('threshold −55', w - 70, y(-55) - 3);
  }

  { const seen = new Set(); scene.traverse((o) => { const m = o.material; if (m && m.isMeshPhysicalMaterial && !seen.has(m)) { seen.add(m); m.color.multiplyScalar(0.55); m.sheen = Math.min(m.sheen, 0.3); } }); }
  SOMA_PARTS.forEach((p) => PART[p.id].mats.forEach((m) => { m.userData.e0s = { c: m.emissive.clone(), i: m.emissiveIntensity }; }));
  pickOn(() => self, camera, pickables, (id) => select(id));
  const labels = SOMA_PARTS.map((p) => ({ text: p.name, pos: PART[p.id].anchor, color: p.color, show: () => st.labels && (!st.sel || st.sel === p.id) }));
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.sel ? PART[st.sel].text : 'A neuron in section. Click any part of the cell or choose it from the list. Bottom right is the axon hillock potential: try summation.'); };
    refs.seg = seg([{ id: 'all', label: 'Overview' }, ...SOMA_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => select(v));
    const cutB = toggle('Cutaway', () => st.cut, (v) => { st.cut = v; });
    const rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    const auto = toggle('Background', () => st.auto, (v) => { st.auto = v; });
    Object.assign(refs, { cutB, rot, lab, auto });
    el.append(
      h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Parts of the neuron', h('kbd', {}, 'click the cell')), h('div', { class: 'gctl' }, refs.seg)),
      group('Summation at the hillock', '1 · 2 · 3 · 4', button('Single synapse', single), button('Spatial', spatial, true), button('Temporal', temporal), button('Inhibition', inhibit), auto),
      group('View', 'C · R · N', cutB, rot, lab),
      ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { single(); return true; } if (k === '2') { spatial(); return true; } if (k === '3') { temporal(); return true; } if (k === '4') { inhibit(); return true; }
    if (k === 'c' || k === 'с') { refs.cutB.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return [['Hillock', Math.round(st.vm), 'mV'], ['Synapses', syns.length, ''], ['Cell body', '20–30', 'µm']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, get accent() { return st.sel ? PART[st.sel].color : '#C9A6E8'; },
    kicker: 'Brain · neuron', title: 'Structure of the nerve cell',
    lede: 'The neuron cell body in section: nucleus, Nissl substance, Golgi apparatus, mitochondria and cytoskeletal filaments. Signals from synapses converge on the axon hillock, where it is decided whether an impulse will fire.',
    notes: `
      <div><h2>What is inside a neuron</h2>
        <p>Inside, a neuron is built like a typical cell: a nucleus with DNA, from whose large pores RNA emerges; ribosomes on the channels of the ER; a Golgi apparatus that buds off transmitter-filled vesicles; mitochondria that oxidize glucose and produce ATP.</p>
        <h3>What makes a neuron special</h3>
        <p>There are a great many ribosomes: a neuron synthesizes proteins all the time, so its rough ER is gathered into clumps, the <b>Nissl substance</b> (tigroid). In glial cells it is barely visible. The myelin around the axon is the layered membrane of a glial cell. Thousands of synaptic contacts reach the dendrites and cell body.</p>
        <h3>How an impulse is born</h3>
        <p>Each synapse produces a small shift in potential that fades along the way. An impulse arises only if the sum of these shifts at the axon hillock crosses the threshold: this is how <b>spatial</b> and <b>temporal summation</b> work. Inhibitory synapses sit closest to the hillock and can cancel even strong excitation.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>There is no Nissl substance in the axon hillock, and the cytoskeletal filaments converge into the axon.</li><li>Excitatory synapses on spines, dendrites and the cell body; inhibitory ones at the hillock.</li><li>The EPSP fades with distance, and the threshold is about −55 mV.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Time is slowed down about 50-fold.</li><li>Organelles and ribosomes are larger than to scale; there are hundreds of times fewer synapses than on a real neuron.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li>click a part of the cell: select</li><li><code>1</code>–<code>4</code> summation experiments</li><li><code>C</code> cutaway</li><li><code>R</code> rotate</li><li><code>N</code> labels</li><li><code>Esc</code> overview</li></ul></div>`,
  };
  return self;
}
export { makeSoma };
