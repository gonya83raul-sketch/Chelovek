import { BKP, LOBES, Sparks, THREE, V3, __set_rnd, bkCs, bkLs, bkPo, brainKit, branchTree, button, envTex, flowTubeMat, flyStep, flyTarget, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rand, randUnit, rnd, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 4 · КОРА: ДОЛИ, ПОЛЯ БРОДМАНА, СЛОИ, ЛАТЕРАЛИЗАЦИЯ
   ========================================================= */
const CX_ZONES = {
  motor: '#E9573F', motor2: '#F08A4B', pref: '#F4B860', speech: '#E65CB8', sens: '#4F8FEF', sens2: '#86B6FF',
  assoc: '#3FC1B0', vis: '#F2D14E', vis2: '#D9B23E', aud: '#5CC48A', aud2: '#9BDDB0', temp: '#8BB870', taste: '#C77DFF', limb: '#E58FC4', pole: '#9AA0B0',
};
const CX_FIELDS = [
  { id: '4', z: 'motor', name: 'Area 4 · primary motor cortex', text: '<b>Area 4</b> is the precentral gyrus, the primary motor cortex. It contains the giant Betz pyramidal cells, whose axons form the pyramidal tract. It has a precise topography: each part controls its own muscles.' },
  { id: '6', z: 'motor2', name: 'Area 6 · premotor cortex', text: '<b>Area 6</b> is the premotor area, a secondary motor field. Here the overall program is broken down into individual movements.' },
  { id: '8', z: 'motor2', name: 'Area 8 · eye movements', text: '<b>Area 8</b>, in the superior frontal gyrus, controls eye movements.' },
  { id: '9', z: 'pref', name: 'Area 9 · prefrontal cortex', text: 'The <b>prefrontal cortex</b> (area 9 and neighboring areas) holds the most general motor program: goals, plans, decisions. The flow runs “top-down”: prefrontal cortex → areas 6 and 8 → area 4 → muscles.' },
  { id: '44', z: 'speech', name: 'Area 44 · Broca’s area', text: '<b>Broca’s area</b> (areas 44 and 45, inferior frontal gyrus) is the motor center of speech: it drives the motor side of speaking. In right-handers it is in the left hemisphere.' },
  { id: '45', z: 'speech', name: 'Area 45 · Broca’s area', text: '<b>Broca’s area</b> (areas 44 and 45) is the motor center of speech. When it is damaged, a person understands speech but speaks with difficulty.' },
  { id: '47', z: 'speech', name: 'Area 47 · singing', text: '<b>Area 47</b> is linked to singing in the classical scheme.' },
  { id: '3', z: 'sens', name: 'Areas 3, 1, 2 · somatosensory cortex', text: '<b>Areas 3, 1, 2</b> form the postcentral gyrus: skin, muscle and pain sensation. Area 3 is primary: it receives almost unprocessed signals from the thalamic projection nuclei.' },
  { id: '43', z: 'taste', name: 'Area 43 · taste', text: '<b>Area 43</b> is the gustatory cortex, next to the insula.' },
  { id: '5', z: 'sens2', name: 'Area 5 · secondary', text: '<b>Areas 5 and 7</b> are the secondary sensory fields of the superior parietal lobule: individual sensations are combined into an image.' },
  { id: '7', z: 'sens2', name: 'Area 7 · secondary', text: '<b>Area 7</b> is the superior parietal lobule, a secondary area with partly association functions: the body in space.' },
  { id: '40', z: 'assoc', name: 'Area 40 · supramarginal gyrus', text: 'The <b>supramarginal gyrus</b> (40) is parietal association cortex: it combines streams from different senses. Damage to tertiary fields impairs complex recognition.' },
  { id: '39', z: 'assoc', name: 'Area 39 · angular gyrus', text: 'The <b>angular gyrus</b> (39) handles the visual images of words and reading. It is part of the occipito-temporo-parietal association area.' },
  { id: '17', z: 'vis', name: 'Area 17 · primary visual', text: '<b>Area 17</b> is the primary visual cortex, mostly on the medial surface along the banks of the calcarine sulcus. Neighboring columns respond to lines of different orientations.' },
  { id: '18', z: 'vis2', name: 'Area 18 · secondary visual', text: '<b>Area 18</b> is secondary visual cortex: lines are assembled into an image; in the classical scheme, written language.' },
  { id: '19', z: 'vis2', name: 'Area 19 · secondary visual', text: '<b>Area 19</b> is secondary visual cortex, memory for images.' },
  { id: '41', z: 'aud', name: 'Area 41 · primary auditory', text: '<b>Area 41</b> is the primary auditory cortex (the transverse gyri deep in the lateral sulcus): auditory perception.' },
  { id: '42', z: 'aud2', name: 'Area 42 · sound discrimination', text: '<b>Area 42</b> is secondary auditory cortex: sound discrimination.' },
  { id: '22', z: 'speech', name: 'Area 22 · Wernicke’s area', text: '<b>Wernicke’s area</b> (the posterior part of area 22, superior temporal gyrus) is the sensory center of speech: the auditory images of words. Area 22 is also involved in orienting to sound and in musical hearing.' },
  { id: '21', z: 'temp', name: 'Areas 21, 20 · temporal cortex', text: 'The <b>middle and inferior temporal gyri</b>: recognition of objects and faces, temporal association cortex.' },
  { id: '37', z: 'assoc', name: 'Area 37', text: '<b>Area 37</b> is the occipitotemporal region; in the classical scheme it is linked to voluntary speech.' },
  { id: '38', z: 'pole', name: 'Area 38 · temporal pole', text: 'The <b>temporal pole</b> (38) is connected with the limbic system and emotional memory.' },
  { id: '24', z: 'limb', name: 'Areas 24, 25 · cingulate cortex', text: 'The <b>cingulate gyrus</b> (areas 24, 25 and neighboring areas) detects mismatches and errors; it is part of the limbic lobe.' },
];
const CX_F = Object.fromEntries(CX_FIELDS.map((f, i) => [f.id, { ...f, i }]));
function cxField(x, y, u, lobe) {
  if (u < -0.38) { if (lobe === 4) return y > -0.05 && x > -0.75 ? '24' : null; if (x < bkPo(y) - 0.05) return y > -0.25 && y < 0.35 ? '17' : '18'; return null; }
  const dLs = y - bkLs(x), dCs = x - bkCs(y);
  if (x < bkPo(y)) return x < -1.5 ? '17' : x < -1.34 ? '18' : '19';
  if (lobe === 2) {
    if (x > 0.62) return '38';
    if (dLs > -0.13) { if (x > -0.05 && x < 0.38) return dLs > -0.065 ? '41' : '42'; return '22'; }
    if (x < -0.55) return '37';
    return '21';
  }
  if (dLs < 0.11 && dCs > -0.16 && dCs < 0.1) return '43';
  if (dCs > 0) {
    if (dCs < 0.13) return '4';
    if (dLs < 0.3 && x > 0.2) return dCs < 0.36 ? '44' : dCs < 0.58 ? '45' : dCs < 0.78 ? '47' : '9';
    if (dCs < 0.36) return '6';
    if (y > 0.5 && dCs < 0.62) return '8';
    return '9';
  }
  if (dCs > -0.17) return '3';
  if (y > 0.52) return x > -0.62 ? '5' : '7';
  return x > -0.58 ? '40' : '39';
}
const CX_LAYERS = [
  { n: 'I', name: 'Molecular', f: 0.08, color: '#3a2c3c', text: 'fibers of neurons from deeper layers, tips of apical dendrites' },
  { n: 'II', name: 'External granular', f: 0.09, color: '#2b3550', text: 'small stellate cells; input from other cortical areas' },
  { n: 'III', name: 'External pyramidal', f: 0.27, color: '#40263a', text: 'small and medium pyramidal cells; output to other cortical areas and through the corpus callosum' },
  { n: 'IV', name: 'Internal granular', f: 0.1, color: '#2b3a50', text: 'small neurons of all shapes; input from the thalamus' },
  { n: 'V', name: 'Internal pyramidal', f: 0.23, color: '#4a2a32', text: 'giant Betz pyramidal cells: output to the striatum, brainstem and spinal cord' },
  { n: 'VI', name: 'Multiform', f: 0.23, color: '#33293f', text: 'mostly spindle-shaped neurons' },
];
function makeCortex() {
  __set_rnd(mulberry(808));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xe58fc4);
  { const k2 = new THREE.DirectionalLight(0xfff1e6, 1.15); k2.position.set(5, 8, -7); scene.add(k2); }   // ключевой свет и для левого полушария (z<0)
  const VIEWS = {
    lat: flyTarget(V3(0.8, -0.3, -0.55), V3(0.52, 0.75, -8.2)),   // левое полушарие (z<0) снаружи
    med: flyTarget(V3(-0.22, -0.3, -0.3), V3(-0.5, 0.55, 8.4)),      // его медиальная стенка, правое скрыто
    top: flyTarget(V3(-0.6, -0.1, -0.2), V3(-3.85, 7.78, -0.19)),   /* правее описания, мозжечок над пультом */
    col: flyTarget(V3(0.2, -0.95, 0), V3(4.82, 0.87, 8.8)),
  };
  const VIEWSM = {   // телефон: кадр выше и ниже — модель крупнее (mobZoom)
    lat: flyTarget(V3(-0.22, -0.25, -0.55), V3(-0.45, 0.6, -8.4)),   /* телефон: мозг крупнее */ med: flyTarget(V3(-0.22, -0.25, -0.3), V3(-0.5, 0.6, 9.2)),
    top: flyTarget(V3(-0.3, -0.1, 0), V3(-3.6, 8.2, 0.01)), col: flyTarget(V3(0.15, -0.6, 0), V3(5.4, 1.1, 9.8)),
  };
  const mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches ? VIEWSM : VIEWS)[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VV('lat').pos);
  const controls = makeControls(camera, VV('lat').target); controls.minDistance = 2; controls.maxDistance = 16;
  const K = brainKit();
  const brain = new THREE.Group(); scene.add(brain);
  /* ---------- полушария с собственной раскраской ---------- */
  // рельеф: борозды из brainKit (атрибут sulc) углублены в 1,5 раза, цвет доли/поля приглушён и затенён по глубине борозды —
  // извилины читаются сквозь раскраску, как на окрашенном препарате
  const TIS = new THREE.Color(0xb39497);
  const H = K.hemi.map((g0, hi) => {
    const g = g0.clone(); const pos = g.attributes.position, n = pos.count, lobeA = g.attributes.lobe, sul = g.attributes.sulc;
    const field = new Int16Array(n), lobeCol = new Float32Array(n * 3), zoneCol = new Float32Array(n * 3), shade = new Float32Array(n);
    const side = hi === 0 ? 1 : -1, v = new THREE.Vector3(), c = new THREE.Color(), C0 = V3(0, -0.1, side * 0.55);
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55, L = lobeA.getX(i), d = sul.getX(i);
      const f = cxField(v.x, v.y, u, L); field[i] = f ? CX_F[f].i : -1;
      const sh = shade[i] = 0.5 + 0.5 * smooth(-0.075, 0.02, d);
      c.set(LOBES[L].color).lerp(TIS, 0.42).multiplyScalar(sh); lobeCol.set([c.r, c.g, c.b], i * 3);
      if (f) c.set(CX_ZONES[CX_F[f].z]).lerp(TIS, 0.25); else c.set(LOBES[L].color).lerp(TIS, 0.6).multiplyScalar(0.4);
      c.multiplyScalar(sh); zoneCol.set([c.r, c.g, c.b], i * 3);
      v.addScaledVector(v.clone().sub(C0).normalize(), 0.5 * d); pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const col = new THREE.BufferAttribute(new Float32Array(lobeCol), 3); g.setAttribute('color', col);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xa0a0a0, vertexColors: true, roughness: 0.62, clearcoat: 0.18, clearcoatRoughness: 0.6, sheen: 0.25, sheenColor: new THREE.Color(0xffd6e4), envMapIntensity: 0.35, transparent: true });
    const mesh = new THREE.Mesh(g, mat); mesh.userData.pick = 'h' + hi; brain.add(mesh);
    return { g, mesh, mat, field, lobeCol, zoneCol, col, side, lobe: lobeA, shade };
  });
  const cere = new THREE.Mesh(K.cere, tissue(new THREE.Color(0xc9a2a8).multiplyScalar(0.42), { roughness: 0.6 })); brain.add(cere);
  // ствол укорочен до продолговатого мозга (спинной мозг здесь не нужен — он тянул кадр вниз)
  const stemG = K.stem.clone(); { const ix = stemG.index.array, py = stemG.attributes.position, keep = [];
    for (let t = 0; t < ix.length; t += 3) if (Math.min(py.getY(ix[t]), py.getY(ix[t + 1]), py.getY(ix[t + 2])) > -1.72) keep.push(ix[t], ix[t + 1], ix[t + 2]);
    stemG.setIndex(keep); }
  const stem = new THREE.Mesh(stemG, tissue(new THREE.Color(0xd8b2b8).multiplyScalar(0.42), { side: THREE.DoubleSide })); brain.add(stem);
  // мозолистое тело (для латерализации)
  const ccCurve = new THREE.CatmullRomCurve3(BKP.cc.map((p) => p.clone()));
  const ccFlow = [];
  for (let k = 0; k < 12; k++) {
    const p = ccCurve.getPointAt(0.08 + k / 12 * 0.84); const f = flowTubeMat(k % 2 ? '#4FA3FF' : '#9fd0ff', 0.5, 1.2); f.uniforms.uOn.value = 0;
    ccFlow.push(f); brain.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p.clone().add(V3(0, 0.25, 0.75)), p.clone().add(V3(0, 0.05, 0.3)), p.clone(), p.clone().add(V3(0, 0.05, -0.3)), p.clone().add(V3(0, 0.25, -0.75))]), 30, 0.018, 6), f));
  }
  // поверхность: ближайшая вершина латеральной (или медиальной) стороны
  function surfAt(hi, x, y, medial = false) {
    const { g, side } = H[hi], pos = g.attributes.position, v = new THREE.Vector3(); let best = null, bd = 1e9;
    for (let i = 0; i < pos.count; i += 3) { v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55; if (medial ? u > -0.4 : u < 0.15) continue; const d = (v.x - x) ** 2 + (v.y - y) ** 2 - (medial ? 0 : 0.02 * u); if (d < bd) { bd = d; best = v.clone(); } }
    return best.add(V3(0, 0, side * (medial ? -0.04 : 0.06)));
  }
  // центры полей (на левом полушарии: H[1], z < 0)
  const fieldPos = CX_FIELDS.map(() => ({ s: V3(0, 0, 0), n: 0, m: V3(0, 0, 0), mn: 0 }));
  { const { g, field, side } = H[1], pos = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { const f = field[i]; if (f < 0) continue; v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55; if (u > 0.25) { fieldPos[f].s.add(v); fieldPos[f].n++; } else if (u < -0.4) { fieldPos[f].m.add(v); fieldPos[f].mn++; } } }
  const FPOS = fieldPos.map((p) => (p.n > 30 ? p.s.divideScalar(p.n).add(V3(0, 0, -0.32)) : null));
  const FPOSM = fieldPos.map((p) => (p.mn > 30 ? p.m.divideScalar(p.mn).add(V3(0, 0, 0.1)) : null));

  /* ---------- шестислойная колонка ---------- */
  const col = new THREE.Group(); scene.add(col); col.visible = false;
  const CW = 3.2, CD = 1.3, TOP = 1.25, THK = 2.7, WM = 0.55;
  const LY = []; { let y = TOP; CX_LAYERS.forEach((l) => { const h2 = l.f * THK; LY.push({ ...l, top: y, bot: y - h2, mid: y - h2 / 2 }); y -= h2; }); }
  const BOT = TOP - THK;
  LY.forEach((l, i) => {
    const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(l.color).multiplyScalar(1.1), roughness: 0.7, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.2 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(CW, l.top - l.bot - 0.006, CD), m); b.position.y = l.mid; col.add(b); l.mat = m;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: 0x7a6a86, transparent: true, opacity: 0.35 })); e.position.y = l.mid; col.add(e);
  });
  const wm = new THREE.Mesh(new THREE.BoxGeometry(CW, WM, CD), new THREE.MeshPhysicalMaterial({ color: 0xb8aea0, roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false })); wm.position.y = BOT - WM / 2; col.add(wm);
  const pia = new THREE.Mesh(new THREE.BoxGeometry(CW + 0.04, 0.025, CD + 0.04), new THREE.MeshPhysicalMaterial({ color: 0xc86a7a, roughness: 0.4, transparent: true, opacity: 0.6 })); pia.position.y = TOP + 0.012; col.add(pia);
  // нейроны
  const N = { pyr: [], betz: [], stel: [], spin: [] }, cells = [];
  const rx = () => rand(-CW / 2 + 0.2, CW / 2 - 0.2), rz = () => rand(-CD / 2 + 0.15, CD / 2 - 0.15);
  function pyramid(arr, p, size, axonEnd) {
    const cone = new THREE.ConeGeometry(size, size * 2.4, 16); cone.translate(p.x, p.y + size * 0.5, p.z); arr.push(cone);
    const apTop = V3(p.x + rand(-0.08, 0.08), TOP - 0.06, p.z + rand(-0.06, 0.06));
    const ap = new THREE.CatmullRomCurve3([V3(p.x, p.y + size * 1.6, p.z), V3(p.x + rand(-0.05, 0.05), (p.y + apTop.y) / 2, p.z), apTop]);
    arr.push(taperTube(ap, (u) => size * 0.32 * (1 - u * 0.75), 28, 6));
    for (let j = 0; j < 4; j++) branchTree(arr, apTop, V3(rand(-1, 1), rand(-0.1, 0.4), rand(-1, 1)), 0.22, size * 0.09, 1, { spread: 0.9, wob: 0.4, segs: 8, rad: 4 });
    for (let j = 0; j < 3; j++) { const ob = ap.getPointAt(0.3 + j * 0.2); branchTree(arr, ob, V3(rand(-1, 1), 0.4, rand(-1, 1)), 0.2, size * 0.1, 1, { spread: 0.7, segs: 8, rad: 4 }); }
    for (let j = 0; j < 5; j++) branchTree(arr, p.clone().add(V3(0, -size * 0.4, 0)), V3(Math.cos(j * 1.3) * 1.2, -0.6, Math.sin(j * 1.3)), size * 3.2, size * 0.18, 1, { spread: 0.8, wob: 0.35, segs: 10, rad: 5 });
    const ax = new THREE.CatmullRomCurve3([p.clone().add(V3(0, -size * 0.6, 0)), ...axonEnd]);
    arr.push(taperTube(ax, () => size * 0.07, 40, 5));
    return ax;
  }
  function stellate(arr, p, size) {
    const s = new THREE.SphereGeometry(size, 10, 8); s.translate(p.x, p.y, p.z); arr.push(s);
    for (let j = 0; j < 6; j++) branchTree(arr, p, randUnit(), size * 4, size * 0.22, 1, { spread: 1, wob: 0.5, segs: 6, rad: 4 });
  }
  function spindle(arr, p, size) {
    const s = new THREE.SphereGeometry(size, 12, 10); s.scale(0.55, 2.2, 0.55); s.translate(p.x, p.y, p.z); arr.push(s);
    arr.push(taperTube(new THREE.CatmullRomCurve3([p.clone().add(V3(0, size * 2, 0)), p.clone().add(V3(rand(-0.05, 0.05), 0.45, 0)), p.clone().add(V3(rand(-0.1, 0.1), 0.9, rand(-0.05, 0.05)))]), (u) => size * 0.3 * (1 - u * 0.7), 20, 5));
    arr.push(taperTube(new THREE.CatmullRomCurve3([p.clone().add(V3(0, -size * 2, 0)), p.clone().add(V3(0, -0.4, 0)), V3(p.x, BOT - WM + 0.02, p.z)]), () => size * 0.12, 20, 4));
  }
  const L = (n) => LY.find((l) => l.n === n);
  const CENTER = { betz: V3(0.15, L('V').mid - 0.05, 0), III: V3(-0.55, L('III').mid - 0.05, 0.1), IV: V3(-0.25, L('IV').mid, 0.05) };
  // пирамиды III слоя: аксон уходит вбок (мозолистое тело / другие зоны)
  const axIII = [];
  for (let k = 0; k < 9; k++) { const p = k === 0 ? CENTER.III : V3(rx(), rand(L('III').bot + 0.12, L('III').top - 0.15), rz()); axIII.push(pyramid(N.pyr, p, 0.05 + rnd() * 0.02, [V3(p.x, BOT - 0.1, p.z), V3(p.x + 0.4, BOT - WM * 0.55, p.z), V3(CW / 2 + 0.6, BOT - WM * 0.6, p.z * 0.5)])); }
  // V слой: пирамиды и одна гигантская пирамида Беца
  let axBetz = null;
  for (let k = 0; k < 6; k++) { const big = k === 0, p = big ? CENTER.betz : V3(rx(), rand(L('V').bot + 0.15, L('V').top - 0.15), rz()); const ax = pyramid(big ? N.betz : N.pyr, p, big ? 0.13 : 0.07 + rnd() * 0.02, [V3(p.x, BOT - WM * 0.5, p.z), V3(p.x - 0.05, BOT - WM - 0.7, p.z)]); if (big) axBetz = ax; }
  for (let k = 0; k < 12; k++) stellate(N.stel, k === 0 ? CENTER.IV : V3(rx(), rand(L('IV').bot + 0.05, L('IV').top - 0.05), rz()), 0.035);
  for (let k = 0; k < 10; k++) stellate(N.stel, V3(rx(), rand(L('II').bot + 0.04, L('II').top - 0.04), rz()), 0.03);
  for (let k = 0; k < 7; k++) spindle(N.spin, V3(rx(), rand(L('VI').bot + 0.15, L('VI').top - 0.2), rz()), 0.05);
  const CELLM = {
    pyr: tissue(new THREE.Color(0xe28a9a).multiplyScalar(0.5), { emissive: 0x3a0c18, emissiveIntensity: 0.6 }),
    betz: tissue(new THREE.Color(0xff6a5a).multiplyScalar(0.55), { emissive: 0x5a1008, emissiveIntensity: 0.8 }),
    stel: tissue(new THREE.Color(0x6fb4ff).multiplyScalar(0.5), { emissive: 0x0c2448, emissiveIntensity: 0.7 }),
    spin: tissue(new THREE.Color(0xc77dff).multiplyScalar(0.5), { emissive: 0x2a0c48, emissiveIntensity: 0.7 }),
  };
  Object.keys(N).forEach((k) => { const m = new THREE.Mesh(mergeGeometries(N[k]), CELLM[k]); col.add(m); cells.push(m); });
  // волокна I слоя
  { const arr = []; for (let k = 0; k < 14; k++) { const y = rand(L('I').bot + 0.03, L('I').top - 0.03), z = rz(); arr.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-CW / 2, y, z), V3(-0.5, y + rand(-0.03, 0.03), z + rand(-0.1, 0.1)), V3(0.6, y, z), V3(CW / 2, y + rand(-0.03, 0.03), z)]), 30, 0.008, 4)); }
    col.add(new THREE.Mesh(mergeGeometries(arr), tissue(new THREE.Color(0xd8c8a8).multiplyScalar(0.45)))); }
  // таламический вход в IV слой
  const thalIn = [];
  for (let k = 0; k < 5; k++) { const x = -0.25 + (k - 2) * 0.32, z = (k % 2 ? 0.2 : -0.15); const c = new THREE.CatmullRomCurve3([V3(x - 0.3, BOT - WM - 0.7, z), V3(x - 0.1, BOT - WM * 0.4, z), V3(x, L('VI').mid, z), V3(x, L('IV').mid, z)]); thalIn.push(c); const f = flowTubeMat('#F4C542', 0.6, 1.2); f.uniforms.uOn.value = 0.5; ccFlow.push(f); col.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.012, 5), f)); }
  { const arr = []; thalIn.forEach((c) => { for (let j = 0; j < 5; j++) branchTree(arr, c.getPointAt(1), V3(rand(-1, 1), rand(-0.3, 0.3), rand(-1, 1)), 0.18, 0.007, 1, { segs: 6, rad: 3 }); });
    col.add(new THREE.Mesh(mergeGeometries(arr), new THREE.MeshBasicMaterial({ color: 0x8a6a20 }))); }
  // микроколонка
  const mc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, THK, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x7fd6c8, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  mc.position.set(-0.25, TOP - THK / 2, 0.05); col.add(mc); mc.visible = false;
  const mcRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.006, 6, 48), new THREE.MeshBasicMaterial({ color: 0x7fd6c8 })); mcRing.rotation.x = Math.PI / 2; mcRing.position.set(-0.25, TOP + 0.02, 0.05); col.add(mcRing); mcRing.visible = false;
  // пути сигнала
  const CHAIN = [
    { c: thalIn[2], col: 0xf4c542, d: 1.0 },
    { c: new THREE.CatmullRomCurve3([CENTER.IV, CENTER.IV.clone().add(V3(-0.15, 0.25, 0.02)), CENTER.III]), col: 0x6fb4ff, d: 0.7 },
    { c: new THREE.CatmullRomCurve3([CENTER.III, V3(-0.2, L('IV').bot, 0.05), CENTER.betz.clone().add(V3(0, 0.25, 0))]), col: 0xe28a9a, d: 0.8 },
    { c: axBetz, col: 0xff6a5a, d: 1.1, out: 'down: pyramidal tract, striatum, brainstem' },
  ];
  const fx = new Sparks(1200, 0.06); scene.add(fx.obj);

  const st = { t: 0, mode: 'lobes', view: 'lat', sel: null, labels: true, rot: false, fly: VV('lat'), sigT: -9, split: false, msg: null, mc: false };
  function paint() {
    H.forEach((hh) => {
      const a = hh.col.array, src = st.mode === 'lobes' || st.mode === 'lat' ? hh.lobeCol : hh.zoneCol, tint = new THREE.Color(hh.side < 0 ? '#86B6FF' : '#F4B860');
      const si = st.sel != null ? CX_F[st.sel].i : -1;
      for (let i = 0; i < hh.field.length; i++) {
        let k = 1;
        if (st.mode === 'lat') k = 0.55;
        if (st.mode === 'zones' && si >= 0) k = hh.field[i] === si ? 1.25 : 0.3;
        if (st.mode === 'lobes' && st.selLobe != null) k = hh.lobe.getX(i) === st.selLobe ? 1.2 : 0.3;
        if (st.mode === 'lat') { const q = 0.8 * hh.shade[i]; a[i * 3] = tint.r * q; a[i * 3 + 1] = tint.g * q; a[i * 3 + 2] = tint.b * q; continue; }
        a[i * 3] = src[i * 3] * k; a[i * 3 + 1] = src[i * 3 + 1] * k; a[i * 3 + 2] = src[i * 3 + 2] * k;
      }
      hh.col.needsUpdate = true;
    });
  }
  function setView(v) {
    st.view = v; refs.viewSeg && refs.viewSeg.sync();
    H[0].mesh.visible = v !== 'med'; st.fly = VV(v);
  }
  function setMode(m) {
    st.mode = m; st.sel = null; st.selLobe = null; st.msg = null; refs.modeSeg && refs.modeSeg.sync();
    brain.visible = m !== 'layers'; col.visible = m === 'layers';
    ccFlow.forEach((f, i) => { if (i < 12) f.uniforms.uOn.value = m === 'lat' && !st.split ? 0.9 : 0; });
    H.forEach((hh) => { hh.mat.opacity = m === 'lat' ? 0.55 : 1; hh.mat.depthWrite = m !== 'lat'; });
    if (m === 'layers') st.fly = VV('col'); else if (m === 'lat') { H[0].mesh.visible = true; st.fly = VV('top'); st.view = 'top'; } else setView(st.view === 'top' && m !== 'lat' ? 'lat' : st.view);
    refs.viewSeg && refs.viewSeg.sync(); paint(); refs.setInfo && refs.setInfo();
  }
  function signal() { if (st.mode !== 'layers') setMode('layers'); st.sigT = st.t; st.msg = TXT.signal; refs.setInfo(); }
  pickOn(() => self, camera, () => H.map((x) => x.mesh), (id, hit) => {
    const hh = H[id === 'h0' ? 0 : 1], vi = hit.face.a;
    if (st.mode === 'zones') { const f = hh.field[vi]; st.sel = f >= 0 ? CX_FIELDS[f].id : null; st.msg = null; paint(); refs.setInfo(); }
    else if (st.mode === 'lobes') { st.selLobe = hh.lobe.getX(vi); paint(); refs.setInfo(); }
  });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    ccFlow.forEach((f) => { f.uniforms.uTime.value = t; });
    mc.visible = mcRing.visible = st.mc && st.mode === 'layers';
    const k = t - st.sigT; let acc = 0;
    if (k > 0 && k < 5) CHAIN.forEach((s) => { const u = (k - acc) / s.d; acc += s.d; if (u > 0 && u < 1) for (let j = 0; j < 4; j++) fx.spawn(s.c.getPointAt(u).add(randUnit().multiplyScalar(0.012)), randUnit().multiplyScalar(0.04), new THREE.Color(s.col), 0.6, 2, 2); });
    // III → мозолистое тело
    if (k > 1.7 && k < 3.2) { const u = (k - 1.7) / 1.5; fx.spawn(axIII[0].getPointAt(u), V3(0, 0, 0), new THREE.Color(0x4fa3ff), 0.6, 0, 2); }
    CELLM.betz.emissiveIntensity = k > 2.5 && k < 3.4 ? 2.2 : 0.8; CELLM.stel.emissiveIntensity = k > 1.0 && k < 1.8 ? 1.8 : 0.7;
    fx.update(dt);
  }
  const TXT = {
    lobes: '<b>Cortical lobes.</b> The central (Rolandic) sulcus separates the frontal lobe (red) from the parietal lobe (blue); the lateral (Sylvian) sulcus sets off the temporal lobe (green), and the parieto-occipital sulcus the occipital lobe (yellow). The limbic lobe (pink) is visible on the medial surface: cingulate gyrus, hippocampus, olfactory cortex. The small insular lobe is hidden at the bottom of the lateral sulcus. Primary sulci appear from the 5th month; tertiary sulci (individual, like fingerprints) by the end of the 7th.',
    zones: '<b>Brodmann areas.</b> In 1909 Korbinian Brodmann used Nissl staining to divide the cortex into 52 cytoarchitectonic areas. Primary areas (3, 4, 17, 41) receive input directly from the thalamic relay nuclei and have a precise topographic map; secondary areas (1, 2, 6, 18, 19, 42) assemble features into images; tertiary (association) areas combine streams from different senses. Click an area.',
    layers: '<b>Six layers of the neocortex.</b> 3/4 of cortical neurons are pyramidal cells. The granular layers II and IV are the input (from other cortical areas and from the thalamus), the pyramidal layers III and V are the output (III to other areas and across the corpus callosum, V to the striatum, brainstem and spinal cord), and layers I and VI handle integration; the nonspecific thalamic nuclei project here. Red is a giant Betz cell; purple are spindle-shaped (fusiform) neurons.',
    lat: '<b>Lateralization.</b> Left hemisphere: analysis of the right visual field, touch with the right hand, vocabulary and semantics of speech, writing, full-fledged speech. Right: the left visual field, touch with the left hand, the emotional tone of speech, spatial imagination, music. The hemispheres constantly exchange signals through the corpus callosum (blue streams). Dividing functions pays off: less time is spent on transmission.',
    split: '<b>Split brain.</b> In the 1970s, to relieve severe epileptic seizures, surgeons cut patients’ corpus callosum. Michael Gazzaniga found that the hemispheres then work almost independently: an object shown in the left visual field (right hemisphere) is recognized but cannot be named, because speech is in the left. Later the idea of a strict division of functions was softened.',
    signal: '<b>Signal path through a column.</b> A fiber from the thalamus (yellow) arrives in layer IV → stellate cells pass the signal to layer III pyramidal cells → layer III sends it to other cortical areas and across the corpus callosum (blue) and excites a Betz cell in layer V → its axon leaves the cortex downward into the pyramidal tract.',
    mc: '<b>Column.</b> Vernon Mountcastle advanced an electrode vertically through a cat’s somatosensory cortex — and every cell he encountered responded to the same stimulus. A column runs through all six layers and works as a separate processor. In the primary visual cortex, neighboring minicolumns respond to lines of different orientations.',
  };
  const LOBE_LBL = [[0, 0.5, 0.28], [1, -0.55, 0.85], [2, -0.1, -0.5], [3, -1.35, 0.25]].map(([li, x, y]) => ({ li, x, y }));
  const latLbl = (t2, x, y, c, cond) => ({ text: t2, pos: V3(x, y, 0), color: c, show: () => st.labels && cond() && camera.position.z < -1, _surf: [x, y] });
  const labels = [
    ...LOBE_LBL.map((l) => latLbl(LOBES[l.li].name + ' lobe', l.x, l.y, LOBES[l.li].color, () => st.mode === 'lobes' && st.view !== 'med')),
    latLbl('central sulcus', bkCs(0.95) + 0.02, 0.95, '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'),
    latLbl('lateral sulcus', -0.1, bkLs(-0.1), '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'),
    latLbl('parieto-occipital', bkPo(0.75) - 0.02, 0.75, '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'), { text: 'cerebellum', pos: V3(-1.2, -0.95, -0.95), color: '#c8b0c0', show: () => st.labels && st.mode === 'lobes' && st.view === 'lat' && camera.position.z < -1 && !mqm.matches },
    { text: 'Limbic lobe', pos: V3(0, 0, 0), color: LOBES[4].color, show: () => st.labels && st.mode === 'lobes' && st.view === 'med', _med: [-0.2, 0.42] },
    { text: 'corpus callosum', pos: V3(0.0, 0.32, 0.15), color: '#efe8dc', show: () => st.labels && st.mode === 'lobes' && st.view === 'med' },
    { text: 'calcarine sulcus', pos: V3(0, 0, 0), color: '#F2D14E', show: () => st.labels && st.mode === 'lobes' && st.view === 'med', _med: [-1.35, 0.1] },
    // номера мелких полей 41 и 42 (в глубине боковой борозды) — только когда поле выбрано, иначе они сбиваются в кучу с 22 и 43
    ...CX_FIELDS.map((f, i) => ({ text: f.id, pos: FPOS[i] ? FPOS[i].clone() : V3(0, -9, 0), color: '#ffffff', cls: 'num', show: () => st.labels && st.mode === 'zones' && !!FPOS[i] && st.view !== 'med' && camera.position.z < -1 && (!(f.id === '41' || f.id === '42') || st.sel === f.id) })),
    ...CX_FIELDS.map((f, i) => ({ text: f.id, pos: FPOSM[i] || V3(0, -9, 0), color: '#ffffff', show: () => st.labels && st.mode === 'zones' && !!FPOSM[i] && st.view === 'med' })),
    { text: 'Broca', pos: V3(0, 0, 0), color: CX_ZONES.speech, show: () => st.labels && st.mode === 'zones' && st.view === 'lat', _surf: [0.62, -0.02], dy: -0.16 },
    { text: 'Wernicke', pos: V3(0, 0, 0), color: CX_ZONES.speech, show: () => st.labels && st.mode === 'zones' && st.view === 'lat', _surf: [-0.35, -0.02], dy: -0.14 },
    ...LY.map((l) => ({ text: l.n + ' · ' + l.name, pos: V3(-CW / 2 - 0.08, l.mid, CD / 2), color: '#d8c8e8', show: () => st.labels && st.mode === 'layers' })),
    { text: 'white matter', pos: V3(-CW / 2 - 0.08, BOT - WM / 2, CD / 2), color: '#c8c0b0', show: () => st.labels && st.mode === 'layers' },
    { text: 'Betz cell', pos: CENTER.betz.clone().add(V3(0.2, 0, 0.1)), color: '#FF8A7A', show: () => st.labels && st.mode === 'layers' },
    { text: 'from the thalamus', pos: V3(-0.6, BOT - WM - 0.55, 0), color: '#F4C542', show: () => st.labels && st.mode === 'layers' },
    { text: 'to the corpus callosum', pos: V3(CW / 2 + 0.25, BOT - WM * 0.6 + 0.12, 0), color: '#4FA3FF', show: () => st.labels && st.mode === 'layers' },
    { text: 'to the spinal cord', pos: V3(0.2, BOT - WM - 0.6, 0), color: '#FF6A5A', show: () => st.labels && st.mode === 'layers' },
    { text: 'left: speech, writing, logic', pos: V3(0.2, 1.3, -0.75), left: true, color: '#86B6FF', show: () => st.labels && st.mode === 'lat' },
    { text: 'right: images, space, music', pos: V3(-0.2, 1.3, 0.75), color: '#F4B860', show: () => st.labels && st.mode === 'lat' },
    { text: 'corpus callosum', pos: V3(0.0, 0.62, 0), color: '#9fd0ff', show: () => st.labels && st.mode === 'lat' },
  ];
  labels.forEach((l) => { if (l._surf) l.pos.copy(surfAt(1, l._surf[0], l._surf[1])).add(V3(0, l.dy || 0, -0.12)); if (l._med) l.pos.copy(surfAt(1, l._med[0], l._med[1], true)).add(V3(0, 0, 0.1)); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'zones' && st.sel ? CX_F[st.sel].text : st.mode === 'lobes' && st.selLobe != null ? `<b>${LOBES[st.selLobe].name} lobe.</b> ` + LOBE_TXT[st.selLobe] : st.mode === 'lat' && st.split ? TXT.split : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'lobes', label: 'Lobes and sulci' }, { id: 'zones', label: 'Brodmann areas' }, { id: 'layers', label: 'Cortical layers' }, { id: 'lat', label: 'Lateralization' }], () => st.mode, (v) => setMode(v));
    refs.viewSeg = seg([{ id: 'lat', label: 'Lateral' }, { id: 'med', label: 'Medial' }, { id: 'top', label: 'Top' }], () => st.view, (v) => { if (st.mode === 'layers') setMode('lobes'); setView(v); });
    const sp = toggle('Cut the corpus callosum', () => st.split, (v) => { st.split = v; if (st.mode !== 'lat') setMode('lat'); ccFlow.forEach((f, i) => { if (i < 12) f.uniforms.uOn.value = v ? 0 : 0.9; }); refs.setInfo(); });
    const mcT = toggle('Column', () => st.mc, (v) => { st.mc = v; if (st.mode !== 'layers') setMode('layers'); st.msg = v ? TXT.mc : null; refs.setInfo(); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { sp, mcT, lab });
    el.append(group('Mode', '1–4', refs.modeSeg), group('View', 'V', refs.viewSeg), group('Experiment', 'S · C · X', button('Signal from the thalamus', signal, true), mcT, sp), group('Display', 'R · N', refs.rot, lab), ib.el);
    paint(); refs.setInfo();
  }
  const LOBE_TXT = [
    'In front of the central sulcus. Its posterior part is the motor cortex (area 4) and premotor cortex (6); below lies Broca’s area; in front, the prefrontal cortex: plans and decisions.',
    'Between the central and parieto-occipital sulci. The anterior part handles skin, muscle and pain sensation (areas 3, 1, 2); the posterior part is the parietal association cortex.',
    'Below the lateral sulcus. Auditory cortex (41, 42), Wernicke’s area (22), object recognition; deep inside lie the hippocampus and amygdala.',
    'Behind the parieto-occipital sulcus. Visual cortex: primary area 17 along the banks of the calcarine sulcus, secondary areas 18 and 19.',
    'On the medial surface, encircling the place where the hemisphere joins the diencephalon: the cingulate and parahippocampal gyri, hippocampus, olfactory cortex. Emotion and memory.',
  ];
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['lobes', 'zones', 'layers', 'lat'][n - 1]); return true; }
    if (k === 'v' || k === 'м') { const o = ['lat', 'med', 'top']; if (st.mode === 'layers') setMode('lobes'); setView(o[(o.indexOf(st.view) + 1) % 3]); return true; }
    if (k === 's' || k === 'ы') { signal(); return true; } if (k === 'c' || k === 'с') { refs.mcT.click(); return true; } if (k === 'x' || k === 'ч') { refs.sp.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { st.sel = null; st.selLobe = null; st.msg = null; paint(); refs.setInfo(); return true; }
    return false;
  }
  function stats() { return st.mode === 'zones' ? [['Brodmann areas', 52, ''], ['Year of the map', 1909, '']] : st.mode === 'layers' ? [['Layers', 6, ''], ['Pyramidal cells', '≈75', '%']] : [['Lobes', 5, ''], ['Main sulci', 3, '']]; }
  const self = {
    labelBg: true, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#E9785F', mobZoom: 0.58,
    kicker: 'Brain · neocortex', title: 'Cerebral cortex',
    lede: 'Five lobes, 52 Brodmann areas, six layers and processor columns. See where the cortex speaks, sees and moves, and how a signal passes through its layers.',
    notes: `
      <div><h2>Sulci and gyri</h2>
        <p>The primary sulci (central, lateral, parieto-occipital) appear from the 5th month of fetal development and are present in everyone. Secondary sulci come later. Tertiary sulci produce fine furrowing, and their pattern is individual.</p>
        <h3>Cortical areas are not equal</h3>
        <p><b>Primary</b> areas are the cortical stations of the sensory systems, with direct input from the thalamic relay nuclei and a precise topographic map. <b>Secondary</b> areas lie next to the primary ones, are connected with the association nuclei and assemble features into images. <b>Tertiary</b> areas — the inferior parietal lobule and the occipito-temporo-parietal region — combine different streams.</p>
        <p>In sensory systems an image is assembled from elements; in motor systems the flow runs the other way: overall program (prefrontal cortex) → individual movements (6, 8) → signals to the muscles (4).</p></div>
      <div><h2>Cortical cells</h2><ul>
        <li><b>Pyramidal cells</b> — 3/4 of cortical neurons, with many dendritic spines (a sign of learning).</li>
        <li><b>Betz cells</b> — the largest neurons in the brain (V. A. Betz, 1874), in layer V of the precentral gyrus; their axons go into the pyramidal tract.</li>
        <li><b>Von Economo neurons</b> — large spindle-shaped cells found only in humans, great apes, elephants and cetaceans: fast communication between the frontal, parietal and cingulate cortex.</li>
        <li>Long-axon Golgi type I cells project beyond the cortex; short-axon Golgi type II cells form local networks.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Area boundaries on the model are simplified and follow the classical map.</li><li>Layer thickness and cell size in the column are exaggerated.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> mode</li><li><code>V</code> view</li><li>click: lobe or area</li><li><code>S</code> signal</li><li><code>C</code> column</li><li><code>X</code> corpus callosum</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeCortex };
