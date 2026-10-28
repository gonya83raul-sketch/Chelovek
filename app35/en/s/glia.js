import { GLOW, Sparks, THREE, V3, __set_rnd, addLights, button, clamp, displaceGeo, envTex, glassMat, group, h, lerp, makeControls, mergeGeometries, mergeVertices, mulberry, noise3, rand, randUnit, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 1 · НЕЙРОГЛИЯ
   ========================================================= */
const GLIA = [
  { id: 'astro', name: 'Astrocytes', color: '#7FD6C8', text: '<b>Astrocytes</b> are the largest and most numerous glial cells. They pack the fine web of axons and dendrites so that the brain can withstand concussions. Their <b>end feet</b> sheathe almost the entire capillary surface and support the blood–brain barrier (the barrier itself is the tight junctions of the endothelium). Astrocytes take up and break down neurotransmitters after the synapse, regulate ions and water, and form a scar after injury.' },
  { id: 'oligo', name: 'Oligodendrocytes', color: '#B9A4FF', text: '<b>An oligodendrocyte</b> (“cell with few processes”) insulates neurons from one another. Each process wraps around its own axon, up to 100 layers of membrane, forming a <b>myelin sheath</b> about 1 mm long. Bare <b>nodes of Ranvier</b> remain between the sheaths, and the impulse jumps from node to node: 100–120 m/s instead of 1–5. In the periphery the same job is done by Schwann cells, which have one process per sheath.' },
  { id: 'micro', name: 'Microglia', color: '#FFCF6B', text: '<b>Microglia</b> are the smallest glial cells, the resident macrophages of the brain. Unlike the rest of the glia, they come from the mesoderm. At rest their thin processes “listen” to synapses, and microglia can tear down a weak synapse: this is <b>pruning</b>, trimming of the network. After injury or during inflammation the cells enlarge, divide, move to the lesion and devour the debris.' },
  { id: 'epen', name: 'Ependyma', color: '#8FB4FF', text: '<b>Ependymal cells</b> line the cavities of the brain in a single layer: the four ventricles, the cerebral aqueduct and the central canal of the spinal cord. In early stages their cilia drive the CSF; in adults they remain only in places. The ependyma takes part in exchange between the blood, the CSF and the brain.' },
  { id: 'neu', name: 'Neurons', color: '#CDB0C4', text: '<b>Neurons</b> transmit information, and glia help them work. After birth neurons almost never divide (exceptions: the hippocampus and the olfactory centers), while glia divide throughout life. Across the brain, glia and neurons are roughly equal in number; the cortex has more glia, the brainstem up to ten per neuron, the cerebellum far fewer.' },
];

function makeGlia() {
  __set_rnd(mulberry(31));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.fog = new THREE.FogExp2(0x07060a, 0.022); scene.environment = envTex;
  addLights(scene, 0x7fd6c8);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200); camera.position.set(10.1, 6.6, 34);
  const controls = makeControls(camera, V3(-2.9, -0.4, 0)); controls.minDistance = 4; controls.maxDistance = 50;

  const TY = Object.fromEntries(GLIA.map((g) => [g.id, { ...g, mats: [], objs: [] }]));
  function mat(type, extra = {}) {
    const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(TY[type].color), roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.35, sheen: 0.8, sheenColor: new THREE.Color(0x8f6dff), sheenRoughness: 0.5, envMapIntensity: 0.6, emissive: 0x000000, ...extra });
    m.userData.op = m.opacity; m.userData.tr = m.transparent; TY[type].mats.push(m); return m;
  }
  function tubeG(arr, pts, r0, r1, segs = 18, rad = 7) {
    const c = new THREE.CatmullRomCurve3(pts); arr.push(taperTube(c, (u) => r0 + (r1 - r0) * u, segs, rad));
    const e = pts[pts.length - 1], cap = new THREE.SphereGeometry(Math.max(r1, 0.015), 7, 5); cap.translate(e.x, e.y, e.z); arr.push(cap); return c;
  }
  function treeG(arr, start, dir, len, r, depth, o = {}) {
    const { spread = 0.8, wob = 0.35, kids = 2, shrink = 0.7, leaf } = o;
    const pts = [start.clone()]; let p = start.clone(); const d = dir.clone().normalize();
    for (let k = 1; k <= 3; k++) { d.add(randUnit().multiplyScalar(wob)).normalize(); p = p.clone().addScaledVector(d, len / 3); pts.push(p); }
    const r1 = depth > 0 ? r * 0.65 : r * 0.5; tubeG(arr, pts, r, r1, 12, 6);
    if (depth === 0 && leaf) leaf(p, d);
    if (depth > 0) for (let j = 0; j < kids; j++) treeG(arr, p, d.clone().add(randUnit().multiplyScalar(spread)).normalize(), len * shrink, r1, depth - 1, o);
  }
  function blob(r, sx = 1, sy = 1, sz = 1, seed = 0) {
    const g = new THREE.IcosahedronGeometry(r, 14); g.deleteAttribute('normal'); g.deleteAttribute('uv'); // индексированная сетка: гладкие нормали
    return displaceGeo(mergeVertices(g), (v) => { const n = v.clone().normalize(); const s = 1 + 0.16 * noise3(n.x * 2 + seed, n.y * 2, n.z * 2); v.copy(n.multiplyScalar(r * s)); v.x *= sx; v.y *= sy; v.z *= sz; });
  }
  const add = (type, obj, parent = scene) => { parent.add(obj); TY[type].objs.push(obj); return obj; };

  /* ---------- капилляр и кровь ---------- */
  const CY = -2.4, CR = 0.85, CX = 11;
  const capWall = new THREE.Mesh(new THREE.CylinderGeometry(CR, CR, CX * 2, 40, 1, true).rotateZ(Math.PI / 2).translate(0, CY, 0), new THREE.MeshPhysicalMaterial({ color: 0xc0404a, roughness: 0.5, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }));
  scene.add(capWall);
  scene.add(new THREE.Mesh(capWall.geometry, glassMat(0xff6a6a, { rim: 0.7, base: 0.02 })));
  // эритроциты почти с просвет капилляра: идут гуськом, «монетками» поперёк тока
  const NRBC = 20, rbc = new THREE.InstancedMesh(new THREE.SphereGeometry(0.55, 20, 12).scale(1, 0.36, 1), new THREE.MeshPhysicalMaterial({ color: 0xd23a3a, roughness: 0.4, clearcoat: 0.6, emissive: 0x3a0505 }), NRBC);
  const rb = Array.from({ length: NRBC }, (_, i) => ({ x: -CX + (i + 0.5) * (2 * CX / NRBC) + rand(-0.2, 0.2), r: rand(0, 0.12), a: rand(0, 6.28), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(-0.35, 0.35), rand(-0.3, 0.3), Math.PI / 2 + rand(-0.35, 0.35))), v: 1.55 }));
  scene.add(rbc);
  // эндотелий: вытянутые ядра клеток стенки (плотные контакты эндотелия — основа ГЭБ)
  const endoMat = new THREE.MeshPhysicalMaterial({ color: 0xd27a80, roughness: 0.5, clearcoat: 0.3, emissive: 0x2a0508 });
  [[-8.6, 1.9], [-4.4, -0.6], [-0.3, 2.4], [3.6, 0.3], [7.8, 2.9]].forEach(([x, th]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), endoMat); m.scale.set(0.45, 0.12, 0.25);
    m.position.set(x, CY + (CR - 0.04) * Math.sin(th), (CR - 0.04) * Math.cos(th)); m.rotation.x = Math.PI / 2 - th; scene.add(m);
  });
  // перицит: тело на стенке и два отростка-обхвата
  { const pc = new THREE.Group(), pcMat = new THREE.MeshPhysicalMaterial({ color: 0xc98aa0, roughness: 0.45, clearcoat: 0.4, emissive: 0x200810 });
    const b = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), pcMat); b.scale.set(0.42, 0.16, 0.3); b.position.set(0, CR + 0.1, 0); pc.add(b);
    [-0.45, 0.5].forEach((dx) => { const a = new THREE.Mesh(new THREE.TorusGeometry(CR + 0.06, 0.045, 6, 40, 3.6), pcMat); a.rotation.y = Math.PI / 2; a.rotation.x = -0.25; a.position.x = dx; pc.add(a); });
    pc.position.set(-1.9, CY, 0); pc.rotation.x = -0.7; scene.add(pc); }

  /* ---------- нейроны и синапсы ---------- */
  const neuMat = mat('neu', { sheen: 1, emissive: 0xff5a2a, emissiveIntensity: 0 });
  const neuArr = [], somas = [V3(-6.2, 4.4, -1.4), V3(6.4, 4.6, 1.0)], leaves = [];
  somas.forEach((p, i) => {
    const m = add('neu', new THREE.Mesh(blob(0.85, 1, 1, 0.9, i * 3), neuMat)); m.position.copy(p);
    for (let k = 0; k < 6; k++) { const d = randUnit(); if (d.y < -0.3) d.y *= -0.5; treeG(neuArr, p.clone().addScaledVector(d.normalize(), 0.75), d, 1.9, 0.16, 2, { spread: 0.7, leaf: (q) => leaves.push(q) }); }
  });
  // аксоны, которые обматывает олигодендроцит, идут вдоль z
  const AXP = [[-1.8, 6.4], [0.5, 7.3], [2.8, 6.3], [2.2, 2.9]];
  AXP.forEach(([x, y]) => tubeG(neuArr, [V3(x, y, -9), V3(x, y, 0), V3(x, y, 9)], 0.09, 0.09, 8, 8));
  add('neu', new THREE.Mesh(mergeGeometries(neuArr), neuMat));
  // синапсы: бутоны на кончиках дендритов
  const syn = [];
  const pickLeaves = leaves.filter((p) => p.y > 1 && p.y < 7).sort(() => rnd() - 0.5).slice(0, 8);
  pickLeaves.forEach((p, i) => {
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffb070, roughness: 0.4, emissive: 0xffb070, emissiveIntensity: 0 }); m.userData.op = 1; m.userData.tr = false; TY.neu.mats.push(m);
    const b = add('neu', new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), m)); b.position.copy(p);
    const fib = new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([p, p.clone().add(randUnit().multiplyScalar(1.6))]), () => 0.045, 8, 6), neuMat); add('neu', fib);
    syn.push({ p, b, m, fib, rate: i < 2 ? 0.08 : rand(0.6, 1.4), last: -9, alive: true, weak: i < 2 });
  });

  /* ---------- астроциты и ГЭБ ---------- */
  const astroMat = mat('astro', { emissive: 0x0a2a26, emissiveIntensity: 1 });
  const footMat = mat('astro', { transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide, emissive: 0x0a2a26, emissiveIntensity: 1 });
  const astroArr = [], feet = [];
  const ASTRO = [{ p: V3(-3.4, 1.4, 0.9), fx: [-5.6, -4.3, -3.0, -1.7] }, { p: V3(3.9, 0.9, -1.1), fx: [-0.4, 0.9, 2.2, 3.5, 4.8] }, { p: V3(-8.2, 1.0, -1.8), fx: [-9.5, -8.2, -6.9] }, { p: V3(8.4, 1.1, 1.4), fx: [6.1, 7.4, 8.7, 10] }];
  ASTRO.forEach((A, ai) => {
    add('astro', new THREE.Mesh(blob(0.6, 1, 1, 1, 10 + ai), astroMat)).position.copy(A.p);
    for (let k = 0; k < 16; k++) { const d = randUnit(); if (d.y < -0.2) d.y = -d.y * 0.4; treeG(astroArr, A.p.clone().addScaledVector(d, 0.5), d, 1.3, 0.08, 2, { spread: 0.9, kids: 3, shrink: 0.65 }); }
    A.fx.forEach((x, j) => {
      [0, 1].forEach((half) => {
        const th0 = half ? 2.2 + (j % 2) * 0.6 : -1.0 + (j % 2) * 0.5, thl = 3.4;
        // ножка внахлёст с соседними, края скруглены (толще в середине)
        const g = displaceGeo(new THREE.CylinderGeometry(1, 1, 1.34, 24, 8, true, th0, thl).rotateZ(Math.PI / 2), (v) => {
          const rr = CR + 0.035 + 0.05 * smooth(0.67, 0.35, Math.abs(v.x)), k = rr / Math.hypot(v.y, v.z); v.y *= k; v.z *= k;
        }).translate(x, CY, 0);
        const f = add('astro', new THREE.Mesh(g, footMat)); feet.push(f);
        if (half === 0 || j % 2 === 0) {
          const thc = th0 + thl / 2, tip = V3(x, CY + (CR + 0.08) * Math.sin(thc), (CR + 0.08) * Math.cos(thc));
          if (tip.y > CY - 0.4 && (tip.z * A.p.z >= 0 || tip.y > CY + 0.6)) tubeG(astroArr, [A.p.clone(), A.p.clone().lerp(tip, 0.5).add(V3(0, 0.3, 0)), tip], 0.14, 0.06, 18, 7);
        }
      });
    });
  });
  add('astro', new THREE.Mesh(mergeGeometries(astroArr), astroMat));

  /* ---------- олигодендроцит и миелин ---------- */
  const oliMat = mat('oligo', { emissive: 0x1a0f3a, emissiveIntensity: 1 });
  const myeMat = mat('oligo', { color: 0xf1e7d6, roughness: 0.28, clearcoat: 1, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) });
  const O = V3(0.6, 4.6, 0.3), oliArr = [];
  add('oligo', new THREE.Mesh(blob(0.55, 1, 1, 1, 20), oliMat)).position.copy(O);
  const growing = [];
  AXP.forEach(([x, y]) => {
    const tgt = V3(x, y, 0); tubeG(oliArr, [O.clone(), O.clone().lerp(tgt, 0.5).add(randUnit().multiplyScalar(0.35)), tgt], 0.1, 0.07, 18, 7);
    [-2.75, 0, 2.75].forEach((z) => {
      const m = add('oligo', new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 2.3, 6, 18).rotateX(Math.PI / 2), myeMat)); m.position.set(x, y, z);
      if (z === 0) growing.push(m);
    });
    [-5.5, 5.5].forEach((z) => { const m = add('oligo', new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 2.3, 6, 18).rotateX(Math.PI / 2), myeMat)); m.position.set(x, y, z); });
  });
  add('oligo', new THREE.Mesh(mergeGeometries(oliArr), oliMat));
  const NODES = [-6.875, -4.125, -1.375, 1.375, 4.125, 6.875];
  const hop = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); hop.scale.setScalar(1.2); scene.add(hop);

  /* ---------- микроглия ---------- */
  const micMat = mat('micro', { emissive: 0x3a2400, emissiveIntensity: 1 });
  function microglia(seed) {
    const g = new THREE.Group(), arr = [];
    g.add(new THREE.Mesh(blob(0.3, 1.3, 0.8, 1, seed), micMat));
    for (let k = 0; k < 7; k++) { const d = randUnit(); treeG(arr, d.clone().multiplyScalar(0.22), d, 0.8, 0.05, 3, { spread: 0.9, shrink: 0.75, wob: 0.5 }); }
    g.add(new THREE.Mesh(mergeGeometries(arr), micMat)); TY.micro.objs.push(g); scene.add(g); return g;
  }
  const MG = [{ g: microglia(1), home: V3(-1.4, 1.6, 2.6), ph: 0 }, { g: microglia(2), home: V3(5.2, 2.4, 2.8), ph: 2 }, { g: microglia(3), home: V3(2.2, 0.8, 3.6), ph: 4, born: true }];
  MG.forEach((m) => { m.pos = m.home.clone(); m.g.position.copy(m.home); m.scale = m.born ? 0 : 1; });
  const LES = V3(2.2, 0.8, 3.6);
  const lesion = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xff3a2a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); lesion.position.copy(LES); lesion.scale.setScalar(3.4); scene.add(lesion);
  const NDEB = 40, debris = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.09, 0), new THREE.MeshPhysicalMaterial({ color: 0x8a6a5a, roughness: 0.8 }), NDEB);
  const deb = Array.from({ length: NDEB }, () => ({ p: LES.clone().add(randUnit().multiplyScalar(rand(0.2, 1.3))), life: 1 })); scene.add(debris);
  let prune = null;
  const pruneMat = mat('micro', { emissive: 0x6a4400, emissiveIntensity: 1 });

  /* ---------- эпендима и ликвор ---------- */
  // эпендима: однослойный кубический эпителий из шестигранных призм; верх прилегает к нейропилю, реснички смотрят в желудочек
  const EY = -4.9, NXE = 8, NZE = 6, epN = NXE * NZE, EH = 0.75;
  const epMat = mat('epen', { emissive: 0x0a1430, emissiveIntensity: 1 });
  const epen = add('epen', new THREE.InstancedMesh(new THREE.CylinderGeometry(0.485, 0.485, EH, 6), epMat, epN));
  const M4 = new THREE.Matrix4(), ciliaBase = [], epArr = [];
  for (let i = 0; i < NXE; i++) for (let j = 0; j < NZE; j++) {
    const x = -0.6 + i * 0.866 + (j % 2) * 0.433, z = -4.8 + j * 0.75; M4.makeTranslation(x, EY, z); epen.setMatrixAt(i * NZE + j, M4);
    for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283 + rand(0, 0.6), rr = rand(0.06, 0.3); ciliaBase.push(V3(x + Math.cos(a) * rr, EY - EH / 2, z + Math.sin(a) * rr)); }
    if ((i * NZE + j) % 3 === 0) tubeG(epArr, [V3(x, EY + EH / 2 - 0.05, z), V3(x + rand(-0.15, 0.15), EY + EH / 2 + 0.6, z + rand(-0.15, 0.15)), V3(x + rand(-0.3, 0.3), EY + EH / 2 + 1.2, z + rand(-0.3, 0.3))], 0.06, 0.03, 8, 5);
  }
  add('epen', new THREE.Mesh(mergeGeometries(epArr), epMat)); // базальные отростки
  const ciliaPos = new Float32Array(ciliaBase.length * 6), ciliaGeo = new THREE.BufferGeometry(); ciliaGeo.setAttribute('position', new THREE.BufferAttribute(ciliaPos, 3));
  const ciliaMat = new THREE.LineBasicMaterial({ color: 0xbcd2ff, transparent: true, opacity: 0.85 }); ciliaMat.userData.op = 0.85; ciliaMat.userData.tr = true; TY.epen.mats.push(ciliaMat);
  const cilia = add('epen', new THREE.LineSegments(ciliaGeo, ciliaMat)); cilia.frustumCulled = false;
  const NL = 220, liq = new Float32Array(NL * 3); for (let i = 0; i < NL; i++) liq.set([rand(-1.5, 7.5), rand(-7.6, EY - 1.0), rand(-5.2, -0.4)], i * 3);
  const liqGeo = new THREE.BufferGeometry(); liqGeo.setAttribute('position', new THREE.BufferAttribute(liq, 3));
  const liqMat = new THREE.PointsMaterial({ size: 0.12, map: GLOW, color: 0x9fc4ff, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }); liqMat.userData.op = 0.7; liqMat.userData.tr = true; TY.epen.mats.push(liqMat);
  add('epen', new THREE.Points(liqGeo, liqMat));

  /* ---------- глутамат из пищи ---------- */
  const NG = 220, glu = Array.from({ length: NG }, () => ({ s: 0, p: V3(0, 0, 0), v: V3(0, 0, 0), x: 0, r: 0, a: 0, life: 0 }));
  const gluFx = new Sparks(NG * 6, 0.24); scene.add(gluFx.obj);
  const GLU_C = new THREE.Color(0x9ee66a);
  function feed() { let n = 0; for (const g of glu) { if (g.s) continue; g.s = 1; g.x = -CX - rand(0, 6); g.r = rand(0, 0.6); g.a = rand(0, 6.28); g.v.set(rand(1.6, 2.2), 0, 0); if (++n >= 140) break; } }

  const st = { focus: 'all', bbb: true, trauma: false, labels: true, t: 0, glu: 0, flash: [-9, -9], wrap: 1, nextFeed: 2.5, auto: true, fly: null, msg: null };
  const HOME = { target: V3(-2.9, -0.4, 0), pos: V3(10.1, 6.6, 34) };
  function flyTo(target, dist, dir) {
    const d = dir ? dir.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
    st.fly = { target: target.clone(), pos: target.clone().addScaledVector(d, dist), t: 0 };
  }
  function flyHome() { st.fly = { target: HOME.target.clone(), pos: HOME.pos.clone(), t: 0 }; }
  function say(html) { st.msg = html; refs.setInfo && refs.setInfo(); }
  function setFocusAll() { if (st.focus !== 'all') { st.focus = 'all'; applyFocus(); refs.fSeg && refs.fSeg.sync(); } }

  /* миелинизация: язычок олигодендроцита наматывается спиралью на голый аксон */
  const WRAP_TURNS = 7, WRAP_SEG = 56, WRAP_L = 2.0, AX_R = 0.09;
  const wrapAx = AXP[0], wrapGeo = new THREE.BufferGeometry();
  { const n = WRAP_TURNS * WRAP_SEG + 1, pos = new Float32Array(n * 2 * 3), idx = [];
    for (let i = 0; i < n; i++) {
      const th = i / WRAP_SEG * Math.PI * 2, r = AX_R + 0.012 + (i / WRAP_SEG) * 0.011;
      const x = wrapAx[0] + Math.cos(th) * r, y = wrapAx[1] + Math.sin(th) * r;
      pos.set([x, y, -WRAP_L / 2, x, y, WRAP_L / 2], i * 6);
      if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    wrapGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); wrapGeo.setIndex(idx); wrapGeo.computeVertexNormals(); }
  const wrapMat = mat('oligo', { color: 0xf1e7d6, roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide, transparent: true, opacity: 0.88, emissive: 0x3a2a60, emissiveIntensity: 0.6 });
  const wrapMesh = add('oligo', new THREE.Mesh(wrapGeo, wrapMat)); wrapMesh.visible = false;
  const wrapTip = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xc9b6ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); wrapTip.scale.setScalar(0.5); wrapTip.visible = false; scene.add(wrapTip);
  const nakedAx = growing[0];
  function myelinate() {
    if (st.wrap < 1) return;
    setFocusAll(); st.wrap = 0; st.wrapT = 0;
    flyTo(V3(wrapAx[0], wrapAx[1], 0), 4.2, V3(0.9, 0.35, 0.55));
    say('<b>Myelination.</b> A process of the oligodendrocyte flattens into a thin tongue and wraps around a bare axon again and again. The membrane layers stick together, the cytoplasm is squeezed out of them, and a dense white sleeve forms. In the CNS this is done by the oligodendrocyte (one cell serves many axons), in the periphery by the Schwann cell.');
  }
  /* прунинг: микроглия «съедает» слабый синапс */
  function startPrune() {
    if (prune) return;
    const s = syn.find((q) => q.alive && q.weak) || syn.filter((q) => q.alive).sort((a, b) => a.rate - b.rate)[0];
    if (!s) { say('No weak synapses are left: microglia have already removed them. Reload the scene to start over.'); return; }
    setFocusAll();
    const m = MG.filter((q) => !q.born).reduce((a, b) => (a.pos.distanceTo(s.p) < b.pos.distanceTo(s.p) ? a : b));
    const park = s.p.clone().add(V3(0.9, -0.7, 0.8));
    const mid = park.clone().lerp(s.p, 0.5).add(V3(0, 0.35, 0.2));
    const curve = new THREE.CatmullRomCurve3([park, mid, s.p]);
    const geo = new THREE.TubeGeometry(curve, 48, 0.085, 8);
    const mesh = new THREE.Mesh(geo, pruneMat); mesh.visible = false; scene.add(mesh); TY.micro.objs.push(mesh);
    const cup = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), pruneMat); cup.visible = false; scene.add(cup); TY.micro.objs.push(cup);
    const tagS = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xff4a3a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); tagS.position.copy(s.p); tagS.scale.setScalar(1.1); scene.add(tagS);
    prune = { s, m, mesh, cup, tagS, curve, park, t: 0, n: geo.index.count, home: m.home.clone() };
    flyTo(s.p, 5.5, V3(0.6, 0.25, 1));
    say('<b>Pruning</b> (“trimming”). This synapse barely works: only occasional flashes. Weak contacts are tagged with complement proteins (red glow), and microglia recognize them by this tag.');
  }
  function applyFocus() {
    Object.values(TY).forEach((T) => {
      const on = st.focus === 'all' || st.focus === T.id;
      T.mats.forEach((m) => { m.transparent = on ? m.userData.tr : true; m.opacity = on ? m.userData.op : 0.07; m.depthWrite = on && !m.userData.tr; m.needsUpdate = true; });
    });
  }

  function update(dt) {
    st.t += dt; const t = st.t;
    // кровь
    rb.forEach((b, i) => { b.x += b.v * dt; if (b.x > CX) b.x -= CX * 2; M4.makeRotationFromQuaternion(b.q).setPosition(b.x, CY + b.r * Math.sin(b.a), b.r * Math.cos(b.a)); rbc.setMatrixAt(i, M4); });
    rbc.instanceMatrix.needsUpdate = true;
    // ГЭБ
    feet.forEach((f, i) => { f.visible = st.bbb || i % 3 === 0; });
    footMat.emissive.setHex(st.bbb ? 0x0a2a26 : 0x3a0a0a);
    if (st.auto && t > st.nextFeed) { feed(); st.nextFeed = t + 9; }
    for (const g of glu) {
      if (!g.s) continue;
      if (g.s === 1) {
        g.x += g.v.x * dt; g.p.set(g.x, CY + g.r * Math.sin(g.a), g.r * Math.cos(g.a));
        if (g.x > CX) { g.s = 0; continue; }
        if (!st.bbb && Math.abs(g.x) < CX - 1 && rnd() < dt * 0.5) { g.s = 2; const tgt = somas[g.p.x < 0 ? 0 : 1]; g.v.copy(tgt).sub(g.p).normalize().multiplyScalar(rand(1.4, 2.2)); g.tgt = tgt; }
      } else if (g.s === 2) {
        g.p.addScaledVector(g.v, dt); g.v.add(randUnit().multiplyScalar(0.6 * dt));
        if (g.p.distanceTo(g.tgt) < 1.0) { g.s = 0; st.glu++; st.flash[g.tgt === somas[0] ? 0 : 1] = t; continue; }
        if (g.p.length() > 18) { g.s = 0; continue; }
      }
      if (g.x > -CX) gluFx.spawn(g.p, V3(0, 0, 0), GLU_C, 0.12, 0, 1.2);
    }
    gluFx.update(dt);
    neuMat.emissiveIntensity = 1.2 * Math.max(Math.exp(-(t - st.flash[0]) / 0.25), Math.exp(-(t - st.flash[1]) / 0.25));
    // синапсы
    syn.forEach((s) => { if (!s.alive) return; if (rnd() < dt * s.rate) s.last = t; s.m.emissiveIntensity = (s.weak ? 0.1 : 0.3) + 2.2 * Math.exp(-(t - s.last) / 0.15); });
    // импульс прыгает по перехватам второго аксона
    const k = Math.floor(t / 0.16) % (NODES.length + 6);
    hop.visible = k < NODES.length && (st.focus === 'all' || st.focus === 'oligo' || st.focus === 'neu');
    if (hop.visible) hop.position.set(AXP[1][0], AXP[1][1], NODES[k]);
    // перелёт камеры
    if (st.fly) {
      st.fly.t += dt; const k = 1 - Math.exp(-dt * 2.6);
      controls.target.lerp(st.fly.target, k); camera.position.lerp(st.fly.pos, k);
      if (st.fly.t > 2.2) st.fly = null;
    }
    // миелинизация
    if (st.wrap < 1) {
      st.wrapT += dt; const w = clamp((st.wrapT - 1.0) / 7, 0, 1); st.wrap = st.wrapT > 9.5 ? 1 : 0.5 * w;
      nakedAx.visible = false; wrapMesh.visible = true;
      const n = Math.floor(w * WRAP_TURNS * WRAP_SEG); wrapGeo.setDrawRange(0, Math.max(0, n) * 6);
      const th = n / WRAP_SEG * Math.PI * 2, r = AX_R + 0.012 + (n / WRAP_SEG) * 0.011 + 0.03;
      wrapTip.visible = w > 0 && w < 1; wrapTip.position.set(wrapAx[0] + Math.cos(th) * r, wrapAx[1] + Math.sin(th) * r, 0);
      if (st.wrapT > 8.2 && !st.wrapSaid) { st.wrapSaid = true; say('<b>Done: 7 layers of membrane.</b> Now current no longer leaks through the membrane, and the impulse jumps from one node of Ranvier to the next (yellow spark on the neighboring axon). Speed rises from 0.5–2 m/s in a bare fiber to 100 m/s and more. In humans myelination goes on for about 20 years: the spinal cord first, the frontal cortex last of all.'); }
      if (st.wrap >= 1) { wrapTip.visible = false; st.wrapSaid = false; }
    } else if (wrapMesh.visible) { nakedAx.visible = true; nakedAx.scale.setScalar(1); }
    // микроглия
    MG.forEach((m, i) => {
      const goal = st.trauma ? LES.clone().add(V3(Math.cos(i * 2.1) * 1.1, 0.2 * i - 0.2, Math.sin(i * 2.1) * 0.9)) : m.home;
      m.pos.lerp(goal, 1 - Math.exp(-dt * 0.9));
      const sGoal = m.born ? (st.trauma && t - st.traumaT > 2.5 ? 1.5 : 0) : (st.trauma ? 1.7 : 1);
      m.scale = lerp(m.scale, sGoal, 1 - Math.exp(-dt * 1.5));
      m.g.position.copy(m.pos); m.g.scale.setScalar(Math.max(0.001, m.scale)); m.g.visible = m.scale > 0.02;
      m.g.rotation.set(0.25 * Math.sin(t * 0.6 + m.ph), 0.35 * Math.sin(t * 0.45 + m.ph), 0.2 * Math.cos(t * 0.5 + m.ph));
    });
    lesion.material.opacity = lerp(lesion.material.opacity, st.trauma ? 0.55 + 0.25 * Math.sin(t * 4) : 0, 1 - Math.exp(-dt * 3));
    deb.forEach((d, i) => {
      if (st.trauma && t - st.traumaT > 3) { const near = MG.some((m) => m.scale > 0.5 && m.pos.distanceTo(d.p) < 1.6); if (near) d.life = Math.max(0, d.life - dt * rand(0.05, 0.3)); }
      if (!st.trauma) d.life = 1;
      const s = st.trauma ? d.life : 0; M4.makeScale(s, s, s).setPosition(d.p); debris.setMatrixAt(i, M4);
    });
    debris.instanceMatrix.needsUpdate = true;
    // прунинг: метка → микроглия подходит → отросток → охват → поглощение → уход
    if (prune) {
      prune.t += dt; const p = prune.t, s = prune.s, P = prune;
      P.tagS.material.opacity = p < 1.2 ? smooth(0, 1.2, p) * (0.6 + 0.3 * Math.sin(t * 8)) : p < 7 ? 0.7 + 0.3 * Math.sin(t * 8) : Math.max(0, 1 - (p - 7));
      if (p < 3.0) P.m.home.lerp(P.park, 1 - Math.exp(-dt * 2.2));
      const ext = smooth(2.4, 4.0, p) * (1 - smooth(7.4, 8.8, p));
      P.mesh.visible = ext > 0.01; P.mesh.geometry.setDrawRange(0, Math.floor(P.n * ext / 3) * 3);
      const cupOn = smooth(3.8, 4.6, p) * (1 - smooth(6.8, 7.4, p));
      P.cup.visible = cupOn > 0.01; P.cup.position.copy(s.p); P.cup.scale.setScalar(0.6 + 0.5 * cupOn); P.cup.lookAt(P.park); P.cup.rotateX(-Math.PI / 2);
      if (p > 5.0 && p < 7.6) { const q = 1 - smooth(5.0, 7.4, p); const pos = P.curve.getPointAt(1 - 0.85 * (1 - q)); s.b.position.copy(pos); s.b.scale.setScalar(Math.max(0.01, 0.4 + 0.6 * q)); s.fib.scale.setScalar(Math.max(0.01, q)); s.m.color.setRGB(0.6 + 0.4 * q, 0.35 + 0.3 * q, 0.3); P.tagS.position.copy(pos); }
      if (p >= 7.6 && s.alive) { s.alive = false; s.b.visible = false; s.fib.visible = false; say('<b>Synapse eaten.</b> The microglial cell digested the bouton in its lysosomes and returned to its place. Strong, frequently used contacts remain. In childhood and adolescence up to half of all cortical synapses are removed this way: the brain keeps the connections it needs and saves energy. Pruning defects have been linked to autism and schizophrenia.'); }
      if (p > 7.6) P.m.home.lerp(P.home, 1 - Math.exp(-dt * 1.5));
      if (p > 10) { [P.mesh, P.cup, P.tagS].forEach((o) => { scene.remove(o); if (o.geometry) o.geometry.dispose(); }); P.m.home.copy(P.home); prune = null; }
    }
    // реснички и ликвор
    for (let i = 0; i < ciliaBase.length; i++) {
      const b = ciliaBase[i], ph = t * 7 - b.x * 0.9, sw = 0.28 * Math.sin(ph);
      ciliaPos.set([b.x, b.y, b.z, b.x + sw, b.y - 0.6 + 0.06 * Math.abs(sw), b.z], i * 6);
    }
    ciliaGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < NL; i++) { liq[i * 3] += dt * (0.7 + 0.4 * Math.sin(i)); if (liq[i * 3] > 8) liq[i * 3] -= 16; }
    liqGeo.attributes.position.needsUpdate = true;
  }

  { const seen = new Set(); scene.traverse((o) => { const m = o.material; if (m && m.isMeshPhysicalMaterial && !seen.has(m)) { seen.add(m); m.color.multiplyScalar(0.6); } }); }
  const fp = feet[2].geometry.boundingSphere || (feet[2].geometry.computeBoundingSphere(), feet[2].geometry.boundingSphere);
  const show = (type) => () => st.labels && (st.focus === 'all' || st.focus === type);
  const micLbl = { text: 'microglia', pos: V3(0, 0, 0), color: '#FFCF6B', show: show('micro') };
  const labels = [
    { text: 'astrocyte', pos: ASTRO[0].p.clone().add(V3(-0.6, 1.1, 0.3)), color: '#7FD6C8', show: show('astro') },
    { text: 'end feet · BBB', pos: fp.center.clone().add(V3(0, 1.1, 0.5)), color: '#7FD6C8', show: show('astro') },
    { text: 'capillary', pos: V3(-9.4, CY + 1.2, 0.4), color: '#ff8d7f', show: () => st.labels },
    { text: 'oligodendrocyte', pos: O.clone().add(V3(0.5, -0.7, 0.4)), color: '#B9A4FF', show: show('oligo') },
    { text: 'myelin', pos: V3(AXP[0][0], AXP[0][1] + 0.45, 2.75), color: '#F1E7D6', show: show('oligo') },
    { text: 'node of Ranvier', pos: V3(AXP[2][0] + 0.2, AXP[2][1] + 0.4, 4.125), color: '#F1E7D6', show: show('oligo') },
    micLbl,
    { text: 'ependyma', pos: V3(-0.9, EY, -0.9), color: '#8FB4FF', show: show('epen') },
    { text: 'CSF in the ventricle', pos: V3(6.4, EY - 1.4, -1.5), color: '#9fc4ff', show: show('epen') },
    { text: 'neuron', pos: somas[0].clone().add(V3(0.6, 1.0, 0.3)), show: show('neu') },
    { text: 'synapse', pos: syn[3] ? syn[3].p.clone().add(V3(0.25, 0.2, 0)) : V3(0, 0, 0), color: '#ffb070', show: show('neu') },
    { text: 'injury', pos: LES.clone().add(V3(0.4, -0.9, 0)), color: '#ff6a5a', show: () => st.labels && st.trauma },
  ];
  const _u = update; const update2 = (dt) => { _u(dt); micLbl.pos.copy(MG[0].pos).add(V3(0.4, -0.6, 0.3)); };

  let refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    const setInfo = () => { if (st.msg) { info.innerHTML = st.msg; return; } info.innerHTML = st.focus === 'all' ? 'Four types of glia around two neurons. Select a cell to make the others transparent. Every few seconds plasma <b style="color:#9ee66a">glutamate</b> floats by in the blood: with the BBB closed, it passes the brain by.' : TY[st.focus].text; };
    const fSeg = seg([{ id: 'all', label: 'All' }, ...GLIA.map((g) => ({ id: g.id, label: g.name, color: g.color }))], () => st.focus, (v) => { st.focus = v; st.msg = null; applyFocus(); setInfo(); });
    const bbb = toggle('BBB', () => st.bbb, (v) => { st.bbb = v; });
    const tr = toggle('Injury', () => st.trauma, (v) => { st.trauma = v; st.traumaT = st.t; if (v) { setFocusAll(); flyTo(LES, 9, V3(0.5, 0.3, 1)); say('<b>Injury.</b> Microglia sense the breakdown products of cells, grow, divide and crawl to the lesion. There they engulf the debris (phagocytosis) and release inflammatory signaling molecules.'); } else { st.msg = null; refs.setInfo(); } });
    refs = { fSeg, bbb, tr, setInfo };
    el.append(group('Cells', '0–5', fSeg),
      group('Experiment', 'F · B · P · T · M', button('Protein meal', feed, true), bbb, button('Pruning', startPrune), tr, button('Myelination', myelinate), button('Overview', () => { st.msg = null; setInfo(); flyHome(); })),
      h('div', { class: 'grp', style: 'flex:1 1 320px' }, h('div', { class: 'glabel' }, 'What you see'), info));
    setInfo();
  }
  function onKey(e) {
    const n = parseInt(e.key, 10);
    if (n >= 0 && n <= 5) { st.focus = n === 0 ? 'all' : GLIA[n - 1].id; applyFocus(); refs.fSeg.sync(); refs.setInfo(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'f' || k === 'а') { feed(); return true; }
    if (k === 'b' || k === 'и') { refs.bbb.click(); return true; }
    if (k === 'p' || k === 'з') { startPrune(); return true; }
    if (k === 't' || k === 'е') { refs.tr.click(); return true; }
    if (k === 'm' || k === 'ь') { myelinate(); return true; }
    if (k === 'n' || k === 'т') { st.labels = !st.labels; return true; }
    if (e.key === 'Escape') { st.msg = null; refs.setInfo(); flyHome(); return true; }
    return false;
  }
  function stats() { return [['BBB', st.bbb ? 'closed' : 'open', ''], ['Glutamate in the brain', st.glu, ''], ['Synapses', syn.filter((s) => s.alive).length, '']]; }
  return {
    labelBg: true, mobZoom: 0.62, scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope: null, accent: '#7FD6C8',
    kicker: 'Brain · supporting cells', title: 'Neuroglia',
    lede: 'Glia is Greek for “glue”. Glia wrap and support neurons, insulate them, guard the entry from the blood and clear away debris.',
    notes: `
      <div><h2>Why neurons need glia</h2>
        <p>Glia were described and named “neuroglia” by Rudolf Virchow (1856); the shapes of glial cells were revealed by Golgi and Ramón y Cajal. Glia fill all the space between neurons. Across the whole brain there are roughly as many glial cells as neurons (~1:1). In the cortical gray matter there are about 1.5 glial cells per neuron, in the brainstem up to ten, while in the cerebellum, packed with tiny granule cells, glia are several times fewer than neurons. Gliocytes are 3–4 times smaller than neurons, contain little Nissl substance, form no synapses and do not transmit signals electrically.</p>
        <h3>Blood–brain barrier</h3>
        <p>The barrier itself is the capillary endothelium: its cells are sealed by tight junctions, and substances from the blood enter the brain only through transporters. Astrocyte end feet sheathe almost the entire capillary and support the barrier. Glutamate is the main excitatory neurotransmitter and one of the most common amino acids in food, but gut cells burn almost all dietary glutamate, and plasma glutamate crosses the barrier poorly. That is why a protein meal does not overexcite the brain. Turn off “BBB” and see what happens to the neurons.</p>
        <h3>White and gray matter</h3>
        <p>Myelin is 75% lipid, with a lot of cholesterol, and is therefore white. Bundles of myelinated axons form the <b>white matter</b>, the “wiring”. The cell bodies and dendrites of neurons form the <b>gray matter</b>. In multiple sclerosis the immune system attacks myelin protein. Myelination proceeds over the first 20 years of life, from the spinal cord to the cortex, and the corpus callosum begins it only in the second month after birth.</p>
        <h3>Where glia come from</h3>
        <p>Astrocytes, oligodendrocytes and ependymal cells develop from the neuroectoderm. Microglia are mesodermal: during embryogenesis phagocyte precursor cells enter the brain and stay there.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The four types of glia and where they sit: end feet on the capillary, sheaths on different axons from a single oligodendrocyte, branching microglia near synapses, a single-layered ciliated ependyma.</li>
        <li>Nodes of Ranvier between the sheaths and the jumping impulse.</li><li>The microglial response to injury: growth, division, movement to the lesion, phagocytosis.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Scales are brought closer together: in reality the capillary is narrower than a neuron’s cell body, and a sheath is about 1 mm long.</li><li>Glutamate is drawn as large dots.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>0</code>–<code>5</code> cell type</li><li><code>F</code> protein meal</li><li><code>B</code> BBB</li><li><code>P</code> pruning</li><li><code>T</code> injury</li><li><code>M</code> myelination</li><li><code>N</code> labels</li></ul></div>`,
  };
}
export { makeGlia };
