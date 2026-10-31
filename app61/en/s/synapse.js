import { GLOW, Sparks, THREE, V3, __set_rnd, accentSet, addLights, button, clamp, displaceGeo, envTex, gauss, glassMat, group, h, lerp, makeControls, mulberry, noise3, rand, randUnit, range, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   SCENE 2 · СИНАПС
   ========================================================= */
const MEDIATORS = {
  glu: { name: 'Glutamate', color: '#F2545B', rec: 'iono', ion: 'na', recName: 'AMPA / NMDA', inact: 'astro', effect: 'excitation', where: '~80% of cortical neurons',
    drugs: [{ id: 'ket', name: 'Ketamine', antag: 0.55, text: '<b>Ketamine</b> plugs NMDA receptors: some of the receptors fail to respond. Anesthesia that “switches off” consciousness.' },
            { id: 'mem', name: 'Memantine', antag: 0.25, text: '<b>Memantine</b> gently blocks NMDA receptors and protects neurons from excess Ca²⁺ in Alzheimer’s disease.' }] },
  gaba: { name: 'GABA', color: '#5B8CFF', rec: 'iono', ion: 'cl', recName: 'GABA-A, Cl⁻ channel', inact: 'uptake', effect: 'inhibition', where: '~20% of cortical neurons',
    drugs: [{ id: 'bzd', name: 'Phenazepam', gain: 1.9, text: '<b>Benzodiazepines</b> bind to their own site on the GABA-A receptor and strengthen every response: more chloride flows in.' },
            { id: 'alc', name: 'Alcohol', gain: 1.45, text: '<b>Alcohol</b>, among other things, also enhances GABA-A: relaxation, drowsiness.' },
            { id: 'val', name: 'Valproate', rel: 1.6, text: '<b>Valproates</b> slow the breakdown of GABA: vesicles hold more of it, and inhibition is stronger.' }] },
  ach: { name: 'Acetylcholine', color: '#3FC1B0', rec: 'iono', ion: 'na', recName: 'nicotinic (N)', inact: 'enzyme', effect: 'excitation', where: 'motor neurons and nuclei of the brainstem and forebrain',
    drugs: [{ id: 'nic', name: 'Nicotine', ago: 0.4, text: '<b>Nicotine</b> is an N-receptor agonist: it opens them by itself, without the neurotransmitter.' },
            { id: 'cur', name: 'Tubocurarine', antag: 0.8, text: '<b>Tubocurarine</b> is a “broken key”: it occupies N receptors, and the muscle never gets the command.' },
            { id: 'pro', name: 'Neostigmine', enz: 0.92, text: '<b>Neostigmine</b> inhibits acetylcholinesterase: the neurotransmitter lingers longer in the cleft.' }] },
  da: { name: 'Dopamine', color: '#F4C542', rec: 'metabo', recName: 'D1 / D2', inact: 'uptake', effect: 'modulation', where: '~0.5 million midbrain neurons',
    drugs: [{ id: 'coc', name: 'Cocaine', block: 0.93, text: '<b>Cocaine</b> plugs the DAT transporters: dopamine gets stuck in the cleft.' },
            { id: 'amp', name: 'Amphetamine', block: 0.6, rev: 1, text: '<b>Amphetamine</b> reverses the transporters: they push dopamine out even without an impulse.' },
            { id: 'hal', name: 'Haloperidol', antag: 0.7, text: '<b>Haloperidol</b> blocks D2 receptors. This is how antipsychotics suppress delusions and hallucinations.' },
            { id: 'ldo', name: 'L-DOPA', rel: 1.8, text: '<b>L-DOPA</b> is the raw material for dopamine. Vesicles are fuller, release is larger. A drug for Parkinson’s disease.' }] },
  ht: { name: 'Serotonin', color: '#C77DFF', rec: 'metabo', recName: '5-HT1 … 5-HT7', inact: 'uptake', effect: 'modulation', where: '~0.3 million raphe neurons',
    drugs: [{ id: 'flx', name: 'Fluoxetine', block: 0.9, text: '<b>Fluoxetine</b> (an SSRI) blocks the SERT transporter. An antidepressant.' },
            { id: 'mao', name: 'MAO inhibitor', rel: 1.6, text: '<b>MAO inhibitors</b> prevent serotonin from being broken down inside the terminal: vesicles hold more of it.' },
            { id: 'lsd', name: 'LSD', ago: 0.35, text: '<b>LSD</b> is a 5-HT2A agonist in the cortex: it distorts perception.' }] },
  na: { name: 'Norepinephrine', color: '#F08A3C', rec: 'metabo', recName: 'α and β', inact: 'uptake', effect: 'modulation', where: 'tens of thousands of locus coeruleus neurons',
    drugs: [{ id: 'coc2', name: 'Cocaine', block: 0.85, text: '<b>Cocaine</b> also blocks norepinephrine reuptake: heart rate and blood pressure rise.' },
            { id: 'ate', name: 'Atenolol', antag: 0.65, text: '<b>Atenolol</b> blocks cardiac β1 receptors: the heart rate slows.' },
            { id: 'naf', name: 'Naphazoline', ago: 0.35, text: '<b>Naphazoline</b> is an α1 agonist: the blood vessels of the nose constrict.' }] },
};
const MED_ORDER = ['glu', 'gaba', 'ach', 'da', 'ht', 'na'];

function makeSynapse() {
  __set_rnd(mulberry(23));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.fog = new THREE.FogExp2(0x07060a, 0.035); scene.environment = envTex;
  addLights(scene, 0xff7aa8);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200); camera.position.set(9.5, 3.9, 13.9);
  const controls = makeControls(camera, V3(-1.2, 0.8, 1.0)); controls.minDistance = 2.5; controls.maxDistance = 24;

  // активная зона: пре- и постсинаптическая мембраны идут параллельно на диаметре ≈4, щель узкая
  const PRE_B = 0.62, POST_T = -0.03, CY = 3.0, CLEFT_Y = (PRE_B + POST_T) / 2;
  const preGeo = displaceGeo(new THREE.SphereGeometry(1, 120, 90), (v) => {
    v.set(v.x * 3.4, v.y * 2.9 + CY, v.z * 3.4);
    if (v.y < 0.645) v.y = 0.645 - (0.645 - v.y) * 0.04;
    const n = noise3(v.x * 0.6, v.y * 0.6, v.z * 0.6); v.x *= 1 + 0.04 * n; v.z *= 1 + 0.04 * n;
  });
  const preSolid = new THREE.Mesh(preGeo, new THREE.MeshPhysicalMaterial({ color: 0xd9a9b8, roughness: 0.4, clearcoat: 0.6, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.6 }));
  const preGlass = new THREE.Mesh(preGeo, glassMat(0xffb0c8, { rim: 0.85, base: 0.02, pow: 2.2 }));
  scene.add(preSolid, preGlass);
  const axonStub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 3, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xd9a9b8, roughness: 0.4, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
  axonStub.position.set(0, 6.9, 0); scene.add(axonStub);

  const postGeo = displaceGeo(new THREE.SphereGeometry(1, 120, 90), (v) => {
    v.set(v.x * 5.4, v.y * 4.1 - 3.7, v.z * 5.4);
    if (v.y > -0.0674) v.y = -0.0674 + (v.y + 0.0674) * 0.08;
  });
  const postSolid = new THREE.Mesh(postGeo, new THREE.MeshPhysicalMaterial({ color: 0x9fb0d9, roughness: 0.45, clearcoat: 0.5, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.6 }));
  const postGlass = new THREE.Mesh(postGeo, glassMat(0x9cb6ff, { rim: 0.75, base: 0.02, pow: 2.2 }));
  scene.add(postSolid, postGlass);
  // постсинаптическое уплотнение (PSD) под рецепторами
  const psd = new THREE.Mesh(new THREE.CylinderGeometry(1.88, 1.95, 0.12, 64), new THREE.MeshStandardMaterial({ color: 0x3a2a40, roughness: 0.85, transparent: true, opacity: 0.85 }));
  psd.position.y = POST_T - 0.08; scene.add(psd);

  // астроцит: три отростка подходят к синапсу и расплющиваются в пластинки, охватывающие щель с трёх сторон (спереди, к камере, щель открыта);
  // едва заметная муфта по кругу; переносчики сидят во внутренней стенке пластинок
  const SHEATH = [2.5, 4.3, 6.1], SH_ARC = 1.4;
  const astroMatA = new THREE.MeshPhysicalMaterial({ color: 0x5fc49a, roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.4, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
  const astroMatB = glassMat(0x7fe0a6, { rim: 0.8, base: 0.03 });
  const astroAll = new THREE.Group(), astro = new THREE.Group();
  astro.add(new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.42, 20, 120), glassMat(0x7fe0a6, { rim: 0.2, base: 0.0 })));
  SHEATH.forEach((c) => {
    const g = new THREE.TorusGeometry(3.6, 0.42, 28, 60, SH_ARC); g.rotateZ(c - SH_ARC / 2);
    astro.add(new THREE.Mesh(g, astroMatA), new THREE.Mesh(g, astroMatB));
  });
  astro.rotation.x = Math.PI / 2; astro.scale.set(1, 1, 0.45); astro.position.y = CLEFT_Y; astroAll.add(astro);
  SHEATH.forEach((c, i) => {
    const d = V3(Math.cos(c), 0, Math.sin(c)), up = i === 2 ? 1 : -1;   /* левый отросток вниз — не режет заголовок */
    const curve = new THREE.CatmullRomCurve3([d.clone().multiplyScalar(3.9).setY(CLEFT_Y), d.clone().multiplyScalar(5.4).setY(CLEFT_Y + 0.5 * up), d.clone().multiplyScalar(7.4).setY(CLEFT_Y + 2.2 * up), d.clone().multiplyScalar(9.5).setY(CLEFT_Y + 3.6 * up)]);
    const g = taperTube(curve, (u) => 0.3 - 0.16 * Math.sin(Math.min(1, u * 1.6) * Math.PI / 2) + 0.18 * u * u, 48, 12);
    astroAll.add(new THREE.Mesh(g, astroMatA), new THREE.Mesh(g, astroMatB));
  });
  scene.add(astroAll);

  // Ca channels
  const caMat = new THREE.MeshStandardMaterial({ color: 0xcfc6cf, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.4 });
  const caPos = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; caPos.push(V3(Math.cos(a) * 1.05, PRE_B + 0.04, Math.sin(a) * 1.05)); }
  caPos.forEach((p) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.24, 12), caMat); m.position.copy(p); scene.add(m); });
  // плотные выступы активной зоны — между ними причаливают пузырьки
  const dpMat = new THREE.MeshStandardMaterial({ color: 0x4a3046, roughness: 0.8 });
  [V3(0.36, 0, 0.15), V3(-0.3, 0, 0.22), V3(0.05, 0, -0.38), V3(0.95, 0, -0.25), V3(-0.95, 0, -0.05), V3(0.45, 0, 0.78), V3(-0.25, 0, 0.95), V3(-0.6, 0, -0.85), V3(0.62, 0, -0.85)].forEach((q) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.2, 10), dpMat); m.position.set(q.x, PRE_B + 0.1, q.z); scene.add(m);
  });
  // митохондрии бутона
  const moMat = new THREE.MeshPhysicalMaterial({ color: 0xd9663a, roughness: 0.3, clearcoat: 1, transparent: true, opacity: 0.72, depthWrite: false });
  const crMat = new THREE.MeshStandardMaterial({ color: 0xffb07a, roughness: 0.45, emissive: 0x2a0e00 });
  const MITO = [[V3(-1.4, 3.6, 0.6), V3(0.6, 0.2, 0.8)], [V3(1.2, 4.4, -0.8), V3(-0.7, 0.5, 0.3)]];
  MITO.forEach(([p, d]) => {
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); const len = 0.7;
    g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.22, len, 8, 16), moMat));
    for (let k = 0; k < 7; k++) { const c = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 6), crMat); c.scale.set(0.17, 0.016, 0.15); c.position.y = -len / 2 + (k + 0.5) * len / 7; c.rotation.z = k % 2 ? 0.3 : -0.3; g.add(c); }
    scene.add(g);
  });

  // vesicles
  const vesGeo = new THREE.SphereGeometry(0.36, 32, 20);
  const dotGeo = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 14; i++) { const d = randUnit().multiplyScalar(rand(0, 0.24)); a.push(d.x, d.y, d.z); } dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
  const dotMat = new THREE.PointsMaterial({ size: 0.13, map: GLOW, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const docks = [V3(0, 1.0, 0), V3(0.72, 1.0, 0.3), V3(-0.62, 1.0, 0.45), V3(0.2, 1.0, -0.72), V3(-0.5, 1.0, -0.52)];
  const vesicles = [];
  // место для пузырька: внутри окончания, не в митохондрии и не внутри соседних пузырьков
  function interior(self) {
    for (let n = 0; ; n++) {
      const p = V3(rand(-2.5, 2.5), rand(1.6, 5.2), rand(-2.5, 2.5));
      if ((p.x / 2.6) ** 2 + ((p.y - 3.3) / 2.1) ** 2 + (p.z / 2.6) ** 2 >= 1 || MITO.some(([m]) => m.distanceTo(p) < 1.0)) continue;
      if (n > 400 || vesicles.every((v) => v === self || !v.g.visible || v.g.position.distanceTo(p) > 0.95)) return p;
    }
  }
  for (let i = 0; i < 20; i++) {
    const g = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xf2e6ee, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.32, depthWrite: false, envMapIntensity: 1 });
    g.add(new THREE.Mesh(vesGeo, mat)); const dots = new THREE.Points(dotGeo, dotMat); g.add(dots);
    const v = { g, mat, state: 'free', home: null, phase: rand(0, 6.28), dock: -1, t: 0 };
    if (i < docks.length) { v.state = 'docked'; v.dock = i; g.position.copy(docks[i]); } else { v.home = interior(v); g.position.copy(v.home); }
    scene.add(g); vesicles.push(v);
  }
  const dockFree = docks.map((_, i) => i >= vesicles.length);

  // molecules
  const NM = 900;
  const mol = { pos: new Float32Array(NM * 3), vel: new Float32Array(NM * 3), alive: new Uint8Array(NM), bound: new Int16Array(NM).fill(-1), n: 0 };
  const molMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const molMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 10, 8), molMat, NM); molMesh.frustumCulled = false; scene.add(molMesh);
  const dummy = new THREE.Object3D();
  function addMol(p, v) { for (let i = 0; i < NM; i++) { const j = (mol.n + i) % NM; if (!mol.alive[j]) { mol.alive[j] = 1; mol.bound[j] = -1; mol.pos.set([p.x, p.y, p.z], j * 3); mol.vel.set([v.x, v.y, v.z], j * 3); mol.n = j + 1; return j; } } return -1; }

  // receptors
  const recPos = [V3(0, POST_T, 0)]; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; recPos.push(V3(Math.cos(a) * 0.8, POST_T, Math.sin(a) * 0.8)); } for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283 + 0.35; recPos.push(V3(Math.cos(a) * 1.6, POST_T, Math.sin(a) * 1.6)); }
  const NR = recPos.length;
  const recMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.8 });
  const ionoMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.075, 0.5, 12), recMat, NR * 5); // пентамеры: nAChR, ГАМК-А
  const ionoMesh4 = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.082, 0.087, 0.5, 12), recMat, NR * 4); // тетрамеры: AMPA, NMDA
  const metaMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.042, 0.042, 0.52, 8), recMat, NR * 7);
  recPos.forEach((p, r) => {
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; dummy.position.set(p.x + Math.cos(a) * 0.12, p.y + 0.02, p.z + Math.sin(a) * 0.12); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); ionoMesh.setMatrixAt(r * 5 + k, dummy.matrix); }
    for (let k = 0; k < 4; k++) { const a = (k + 0.5) / 4 * 6.283; dummy.position.set(p.x + Math.cos(a) * 0.12, p.y + 0.02, p.z + Math.sin(a) * 0.12); dummy.updateMatrix(); ionoMesh4.setMatrixAt(r * 4 + k, dummy.matrix); }
    for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; dummy.position.set(p.x + Math.cos(a) * 0.13, p.y, p.z + Math.sin(a) * 0.13); dummy.rotation.set((k % 2 ? 0.25 : -0.25) * Math.sin(a), 0, (k % 2 ? 0.25 : -0.25) * Math.cos(a)); dummy.updateMatrix(); metaMesh.setMatrixAt(r * 7 + k, dummy.matrix); }
  });
  scene.add(ionoMesh, ionoMesh4, metaMesh);
  const capMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }), NR); capMesh.frustumCulled = false; scene.add(capMesh);
  const gMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), NR); gMesh.frustumCulled = false; scene.add(gMesh);
  const drugMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.11, 1), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 1 }), NR); drugMesh.frustumCulled = false; scene.add(drugMesh);
  for (let i = 0; i < NR; i++) drugMesh.setColorAt(i, new THREE.Color(0xffffff));
  for (let i = 0; i < NM; i++) molMesh.setColorAt(i, new THREE.Color(0xffffff));
  const order = [...Array(NR).keys()].sort(() => rnd() - 0.5);
  const rec = recPos.map(() => ({ until: -1, mol: -1, act: 0 }));

  // transporters & enzymes
  const transGeo = new THREE.CapsuleGeometry(0.1, 0.24, 6, 14);
  const transMat = new THREE.MeshPhysicalMaterial({ color: 0xd7d0e0, roughness: 0.3, clearcoat: 0.8, emissive: 0x000000 });
  const blockMat = new THREE.MeshStandardMaterial({ color: 0x8a8390, roughness: 0.7 });
  const trans = []; const transGroup = new THREE.Group(); scene.add(transGroup);
  function buildTransporters(astroMode) {
    transGroup.clear(); trans.length = 0;
    const n = astroMode ? 10 : 8;
    for (let i = 0; i < n; i++) {
      const a = astroMode ? SHEATH[i % 3] + ((i / 3 | 0) - 1.5) * 0.36 : i / n * 6.283 + 0.2, r = astroMode ? 3.1 : 1.95, y = astroMode ? CLEFT_Y : PRE_B + 0.06;
      const p = V3(Math.cos(a) * r, y, Math.sin(a) * r);
      const m = new THREE.Mesh(transGeo, transMat); m.position.copy(p); if (astroMode) { m.rotation.z = Math.PI / 2; m.rotation.y = -a; }
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), blockMat); b.position.copy(p).add(astroMode ? V3(-Math.cos(a) * 0.18, 0, -Math.sin(a) * 0.18) : V3(0, -0.2, 0)); b.visible = false;
      transGroup.add(m, b); trans.push({ p: astroMode ? p.clone().add(V3(-Math.cos(a) * 0.2, 0, -Math.sin(a) * 0.2)) : p.clone().add(V3(0, -0.12, 0)), block: b });
    }
  }
  const enzGroup = new THREE.Group(); scene.add(enzGroup);
  const enzMat = new THREE.MeshPhysicalMaterial({ color: 0x8fd6c8, roughness: 0.45, clearcoat: 0.5, emissive: 0x0b2a24 });
  const enz = [];
  for (let i = 0; i < 12; i++) {
    const a = rand(0, 6.283), r = Math.sqrt(rnd()) * 2.4;
    const p = V3(Math.cos(a) * r, rand(-0.05, 0.4), Math.sin(a) * r);
    const m = new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(0.15, 2), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.25 * noise3(n.x * 3 + i, n.y * 3, n.z * 3)); }), enzMat);
    m.position.copy(p); enzGroup.add(m); enz.push(p);
  }

  const sparks = new Sparks(2600, 0.12); scene.add(sparks.obj);
  const apRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 10, 80), new THREE.MeshBasicMaterial({ color: 0xffc48a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  apRing.rotation.x = Math.PI / 2; apRing.visible = false; scene.add(apRing);

  const C_NA = new THREE.Color(0xff9f5a), C_CL = new THREE.Color(0x8fd16a), C_CA = new THREE.Color(0xffffff), C_CAMP = new THREE.Color(0xd9c2ff), C_FR = new THREE.Color(0x9fe0d4);
  const st = { med: 'glu', drugs: new Set(), rate: 1.2, t: 0, nextAP: 0.4, ap: [], resp: 0, trace: [], cleft: 0, occ: 0 };
  let M = MEDIATORS.glu, molColor = new THREE.Color(), recColor = new THREE.Color();

  function eff() {
    const e = { antag: 0, ago: 0, gain: 1, rel: 1, block: 0, rev: 0, enz: 0 };
    for (const d of M.drugs) if (st.drugs.has(d.id)) {
      if (d.antag) e.antag = Math.max(e.antag, d.antag); if (d.ago) e.ago = Math.max(e.ago, d.ago);
      if (d.gain) e.gain *= d.gain; if (d.rel) e.rel *= d.rel; if (d.block) e.block = Math.max(e.block, d.block);
      if (d.rev) e.rev = 1; if (d.enz) e.enz = Math.max(e.enz, d.enz);
    }
    return e;
  }
  let E = eff();
  function applyMediator() {
    M = MEDIATORS[st.med]; st.drugs.clear(); E = eff();
    molColor.set(M.color).multiplyScalar(1.7); dotMat.color.set(M.color).multiplyScalar(1.5);
    recColor.set(M.color).lerp(new THREE.Color(0xffffff), 0.45);
    for (let i = 0; i < NR * 5; i++) ionoMesh.setColorAt(i, recColor); for (let i = 0; i < NR * 4; i++) ionoMesh4.setColorAt(i, recColor); for (let i = 0; i < NR * 7; i++) metaMesh.setColorAt(i, recColor);
    ionoMesh.instanceColor.needsUpdate = true; ionoMesh4.instanceColor.needsUpdate = true; metaMesh.instanceColor.needsUpdate = true;
    ionoMesh.visible = M.rec === 'iono' && st.med !== 'glu'; ionoMesh4.visible = M.rec === 'iono' && st.med === 'glu'; metaMesh.visible = M.rec === 'metabo'; gMesh.visible = M.rec === 'metabo';
    for (let i = 0; i < NR; i++) { capMesh.setColorAt(i, new THREE.Color(M.rec === 'iono' ? (M.ion === 'cl' ? 0x8fd16a : 0xffa060) : M.color)); gMesh.setColorAt(i, new THREE.Color(M.color)); }
    capMesh.instanceColor.needsUpdate = true; gMesh.instanceColor.needsUpdate = true;
    astroAll.visible = M.inact === 'astro'; enzGroup.visible = M.inact === 'enzyme';
    buildTransporters(M.inact === 'astro'); transGroup.visible = M.inact !== 'enzyme';
    mol.alive.fill(0); rec.forEach((r) => { r.until = -1; r.mol = -1; r.act = 0; }); sparks.clear(); st.trace = [];
    accentSet(M.color);
  }
  function refreshDrugs() {
    E = eff();
    trans.forEach((t) => (t.block.visible = E.block > 0.5 && !E.rev));
    enzMat.color.set(E.enz ? 0x4d5a57 : 0x8fd6c8); enzMat.emissive.set(E.enz ? 0x000000 : 0x0b2a24);
    transMat.emissive.set(E.rev ? 0x553300 : 0x000000);
  }

  function ap() { st.ap.push({ t0: st.t, stage: 0 }); }
  function release(n) {
    const docked = vesicles.filter((v) => v.state === 'docked').sort(() => rnd() - 0.5).slice(0, n);
    docked.forEach((v) => { v.state = 'fusing'; v.t = 0; dockFree[v.dock] = true; });
  }

  const rTop = (r) => V3(recPos[r].x, POST_T + 0.2, recPos[r].z);
  function update(dt) {
    st.t += dt;
    if (st.rate > 0 && st.t > st.nextAP) { ap(); st.nextAP = st.t + (1 / st.rate) * rand(0.75, 1.25); }
    // AP wave
    let ringOn = false;
    for (const a of st.ap) {
      const tau = st.t - a.t0;
      if (tau < 0.22) { ringOn = true; const y = lerp(6.6, PRE_B + 0.25, tau / 0.22); const r = y > 5.6 ? 0.6 : 3.4 * Math.sqrt(Math.max(0.02, 1 - ((y - CY) / 2.9) ** 2)); apRing.position.y = y; apRing.scale.setScalar(Math.max(r, 0.6)); }
      if (a.stage === 0 && tau >= 0.22) { a.stage = 1; caMat.emissiveIntensity = 2.5; caPos.forEach((p) => { for (let k = 0; k < 6; k++) sparks.spawn(p.clone().add(V3(rand(-0.1, 0.1), -0.15, rand(-0.1, 0.1))), V3(rand(-0.3, 0.3), rand(1.2, 2), rand(-0.3, 0.3)), C_CA, 0.45, 2, 1.2); }); }
      if (a.stage === 1 && tau >= 0.3) { a.stage = 2; release(rnd() < 0.55 ? 1 : 2); }
    }
    st.ap = st.ap.filter((a) => st.t - a.t0 < 0.5);
    apRing.visible = ringOn; caMat.emissiveIntensity *= Math.exp(-dt / 0.15);

    // vesicles
    vesicles.forEach((v) => {
      v.t += dt;
      if (v.state === 'free') { v.g.position.set(v.home.x + 0.07 * Math.sin(st.t * 0.7 + v.phase), v.home.y + 0.06 * Math.sin(st.t * 0.9 + v.phase * 2), v.home.z + 0.07 * Math.cos(st.t * 0.6 + v.phase)); }
      else if (v.state === 'moving') { const k = smooth(0, 1, v.t / 0.9); v.g.position.lerpVectors(v.from, docks[v.dock], k); if (v.t >= 0.9) v.state = 'docked'; }
      else if (v.state === 'docked') { v.g.position.copy(docks[v.dock]); v.g.position.y += 0.02 * Math.sin(st.t * 3 + v.phase); }
      else if (v.state === 'fusing') {
        const k = clamp(v.t / 0.2, 0, 1); v.g.position.y = lerp(1.0, PRE_B - 0.05, k); v.g.scale.set(1 + 0.4 * k, 1 - 0.6 * k, 1 + 0.4 * k); v.mat.opacity = 0.32 * (1 - k);
        if (v.t >= 0.2) {
          const n = Math.round(42 * E.rel), p = v.g.position;
          for (let i = 0; i < n; i++) addMol(V3(p.x + rand(-0.15, 0.15), PRE_B - 0.08, p.z + rand(-0.15, 0.15)), V3(rand(-1.4, 1.4), -rand(1.5, 3.2), rand(-1.4, 1.4)));
          v.state = 'gone'; v.t = 0; v.g.visible = false;
        }
      } else if (v.state === 'gone' && v.t > 1.2) { v.home = interior(v); v.g.position.copy(v.home); v.g.scale.setScalar(1); v.mat.opacity = 0.32; v.g.visible = true; v.state = 'free'; }
    });
    dockFree.forEach((free, i) => {
      if (!free) return; const cand = vesicles.find((v) => v.state === 'free');
      if (cand && rnd() < dt * 1.8) { cand.state = 'moving'; cand.dock = i; cand.t = 0; cand.from = cand.g.position.clone(); dockFree[i] = false; }
    });

    // reverse transport
    if (E.rev) trans.forEach((t) => { if (rnd() < dt * 2.2) addMol(t.p.clone().add(V3(0, -0.05, 0)), V3(rand(-0.6, 0.6), -rand(0.6, 1.4), rand(-0.6, 0.6))); });

    // molecules
    const sig = 1.05 * Math.sqrt(dt), pU = 1 - Math.exp(-22 * dt * (1 - E.block)), pE = 1 - Math.exp(-30 * dt * (1 - E.enz)), pB = 1 - Math.exp(-28 * dt);
    let cleft = 0;
    for (let i = 0; i < NM; i++) {
      if (!mol.alive[i]) continue; const k = i * 3;
      if (mol.bound[i] >= 0) continue;
      cleft++;
      const d = Math.exp(-5 * dt); mol.vel[k] *= d; mol.vel[k + 1] *= d; mol.vel[k + 2] *= d;
      let x = mol.pos[k] + mol.vel[k] * dt + gauss() * sig, y = mol.pos[k + 1] + mol.vel[k + 1] * dt + gauss() * sig * 0.6, z = mol.pos[k + 2] + mol.vel[k + 2] * dt + gauss() * sig;
      const r = Math.hypot(x, z);
      const yMin = POST_T + 0.04 - (r > 2.4 ? (r - 2.4) * 0.6 : 0), yMax = PRE_B - 0.04 + (r > 2.0 ? (r - 2.0) * 0.8 : 0);
      if (y < yMin) { y = 2 * yMin - y; mol.vel[k + 1] = Math.abs(mol.vel[k + 1]) * 0.3; } if (y > yMax) { y = 2 * yMax - y; mol.vel[k + 1] = -Math.abs(mol.vel[k + 1]) * 0.3; }
      mol.pos[k] = x; mol.pos[k + 1] = y; mol.pos[k + 2] = z;
      if (r > (M.inact === 'astro' ? 3.25 : 3.7)) { mol.alive[i] = 0; continue; }
      // uptake
      if (M.inact !== 'enzyme' && !E.rev) for (const t of trans) { const dx = x - t.p.x, dy = y - t.p.y, dz = z - t.p.z; if (dx * dx + dy * dy + dz * dz < 0.16 && rnd() < pU) { mol.alive[i] = 0; sparks.spawn(t.p, V3(0, M.inact === 'astro' ? 0 : 0.8, 0), molColor, 0.3, 3, 0.7); break; } }
      if (E.rev) for (const t of trans) { const dx = x - t.p.x, dy = y - t.p.y, dz = z - t.p.z; if (dx * dx + dy * dy + dz * dz < 0.16 && rnd() < pU * 0.4) { mol.alive[i] = 0; break; } }
      if (!mol.alive[i]) continue;
      if (M.inact === 'enzyme') for (const p of enz) { const dx = x - p.x, dy = y - p.y, dz = z - p.z; if (dx * dx + dy * dy + dz * dz < 0.1 && rnd() < pE) { mol.alive[i] = 0; const q = V3(x, y, z); sparks.spawn(q, randUnit().multiplyScalar(0.7), C_FR, 0.5, 2, 0.9); sparks.spawn(q, randUnit().multiplyScalar(0.7), C_FR, 0.5, 2, 0.6); break; } }
      if (!mol.alive[i]) continue;
      // binding
      if (y < POST_T + 0.4) for (let rI = 0; rI < NR; rI++) {
        const R = rec[rI]; if (R.mol >= 0 || order.indexOf(rI) < Math.round(E.antag * NR)) continue;
        const p = recPos[rI]; const dx = x - p.x, dz = z - p.z;
        if (dx * dx + dz * dz < 0.07 && rnd() < pB) { R.mol = i; R.until = st.t + rand(0.35, 0.8); mol.bound[i] = rI; mol.pos.set([p.x, POST_T + 0.27, p.z], k); break; }
      }
    }
    st.cleft = cleft;
    // receptors
    const nAnt = Math.round(E.antag * NR), nAgo = Math.round(E.ago * NR);
    let active = 0, drugN = 0;
    for (let rI = 0; rI < NR; rI++) {
      const R = rec[rI], idx = order.indexOf(rI);
      if (R.mol >= 0 && st.t > R.until) { const i = R.mol; mol.bound[i] = -1; mol.vel.set([rand(-0.5, 0.5), rand(0.6, 1.4), rand(-0.5, 0.5)], i * 3); R.mol = -1; }
      const isAnt = idx < nAnt, isAgo = !isAnt && idx >= NR - nAgo;
      const on = R.mol >= 0 || (isAgo && Math.sin(st.t * 5 + rI * 1.7) > -0.4);
      R.act += ((on ? 1 : 0) - R.act) * (1 - Math.exp(-dt / 0.06));
      active += R.act;
      // visuals
      const p = recPos[rI];
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(p.x, POST_T + 0.08, p.z); dummy.scale.setScalar(0.25 + 0.95 * R.act * Math.min(E.gain, 1.6)); dummy.updateMatrix(); capMesh.setMatrixAt(rI, dummy.matrix);
      dummy.position.set(p.x, POST_T - 0.42, p.z); dummy.scale.setScalar(0.3 + 1.1 * R.act); dummy.updateMatrix(); gMesh.setMatrixAt(rI, dummy.matrix);
      if (isAnt || isAgo) { dummy.position.set(p.x, POST_T + 0.33, p.z); dummy.scale.setScalar(1); dummy.rotation.set(st.t, st.t * 0.7, 0); drugMesh.setColorAt(drugN, new THREE.Color(isAnt ? 0x7d7784 : 0xffffff)); dummy.updateMatrix(); drugMesh.setMatrixAt(drugN++, dummy.matrix); }
      if (R.act > 0.3) {
        if (M.rec === 'iono') { if (rnd() < dt * 14 * E.gain * R.act) sparks.spawn(V3(p.x + rand(-0.03, 0.03), POST_T + 0.3, p.z + rand(-0.03, 0.03)), V3(0, -rand(1.6, 2.4), 0), M.ion === 'cl' ? C_CL : C_NA, 0.7, 0.5, 1.4); }
        else if (rnd() < dt * 7 * R.act) sparks.spawn(V3(p.x, POST_T - 0.45, p.z), V3(rand(-0.5, 0.5), -rand(0.4, 1.0), rand(-0.5, 0.5)), C_CAMP, 1.1, 1, 1.1);
      }
    }
    drugMesh.count = drugN; drugMesh.instanceMatrix.needsUpdate = true; if (drugMesh.instanceColor) drugMesh.instanceColor.needsUpdate = true;
    capMesh.instanceMatrix.needsUpdate = true; gMesh.instanceMatrix.needsUpdate = true;
    st.occ = active / NR;
    const target = active / NR * E.gain; st.resp += (target - st.resp) * (1 - Math.exp(-dt / 0.12));
    st.trace.push([st.t, st.resp, cleft]); while (st.trace.length && st.trace[0][0] < st.t - 6) st.trace.shift();
    // draw molecules
    for (let i = 0; i < NM; i++) {
      if (mol.alive[i]) { dummy.position.set(mol.pos[i * 3], mol.pos[i * 3 + 1], mol.pos[i * 3 + 2]); dummy.scale.setScalar(1); }
      else dummy.scale.setScalar(0);
      dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); molMesh.setMatrixAt(i, dummy.matrix); molMesh.setColorAt(i, molColor);
    }
    molMesh.instanceMatrix.needsUpdate = true; molMesh.instanceColor.needsUpdate = true;
    sparks.update(dt);
  }

  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt);
    const x = (t) => 8 + (1 - (st.t - t) / 6) * (w - 16), yR = (v) => hgt - 14 - clamp(v / 1.4, 0, 1) * (hgt - 32), yC = (c) => hgt - 14 - clamp(c / 260, 0, 1) * (hgt - 32);
    ctx.strokeStyle = '#2A2630'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(8, hgt - 14); ctx.lineTo(w - 8, hgt - 14); ctx.stroke();
    ctx.strokeStyle = 'rgba(239,234,230,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); st.trace.forEach(([t, , c], i) => (i ? ctx.lineTo(x(t), yC(c)) : ctx.moveTo(x(t), yC(c)))); ctx.stroke();
    ctx.strokeStyle = M.color; ctx.lineWidth = 2; ctx.beginPath(); st.trace.forEach(([t, r], i) => (i ? ctx.lineTo(x(t), yR(r)) : ctx.moveTo(x(t), yR(r)))); ctx.stroke();
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = M.color; ctx.fillText('cell response', 10, 14); ctx.fillStyle = '#A49DA8'; ctx.fillText('neurotransmitter in the cleft', 96, 14);
  }

  const labels = [
    { text: 'presynaptic terminal', pos: V3(-3.0, 3.6, 1.0) },
    { text: 'neurotransmitter vesicles', pos: V3(1.9, 2.6, 1.6) },
    { text: 'cleft ≈ 20 nm', pos: V3(2.6, CLEFT_Y, 1.4) },
    { text: 'receptors', pos: V3(0.9, POST_T - 0.6, 2.0) },
    { text: 'Ca²⁺ channels', pos: caPos[3].clone().add(V3(-0.15, 0.55, 0.1)) },
    { text: 'transporters', pos: V3(-1.95, PRE_B + 0.4, 0.5), show: () => M.inact === 'uptake' },
    { text: 'AChE enzyme', pos: V3(1.6, 0.6, -1.6), show: () => M.inact === 'enzyme' },
    { text: 'astrocyte', pos: V3(Math.cos(2.5) * 6, CLEFT_Y - 1.0, Math.sin(2.5) * 6), show: () => M.inact === 'astro' },
    { text: 'postsynaptic cell', pos: V3(-2.6, -2.4, 2.6) },
  ];

  let refs = {};
  function ui(el) {
    const medSeg = seg(MED_ORDER.map((id) => ({ id, label: MEDIATORS[id].name, color: MEDIATORS[id].color })), () => st.med, (v) => { st.med = v; applyMediator(); buildDrugs(); });
    const drugsBox = h('div', { class: 'gctl' }); const info = h('div', { class: 'info' });
    function buildDrugs() {
      drugsBox.innerHTML = '';
      M.drugs.forEach((d) => drugsBox.append(toggle(d.name, () => st.drugs.has(d.id), (v) => { v ? st.drugs.add(d.id) : st.drugs.delete(d.id); refreshDrugs(); info.innerHTML = v ? d.text : baseInfo(); })));
      info.innerHTML = baseInfo();
    }
    function baseInfo() { const ina = { uptake: 'reuptake into the terminal', enzyme: 'the enzyme acetylcholinesterase right in the cleft', astro: 'uptake by astrocytes' }[M.inact]; return `<b>${M.name}</b>: ${M.where}, ${M.effect}. Receptors: ${M.recName} (${M.rec === 'iono' ? 'ionotropic' : 'metabotropic'}). Inactivation: ${ina}.`; }
    refs = { medSeg, buildDrugs };
    el.append(
      group('Neurotransmitter', '1–6', medSeg),
      group('Impulses', 'Space', button('Impulse', ap, true), range('rate', 0, 5, 0.1, () => st.rate, (v) => { st.rate = v; st.nextAP = st.t + 0.2; }, (v) => (v === 0 ? 'off' : `${v.toFixed(1)}/s`))),
      h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'Drugs'), drugsBox, info),
    );
    buildDrugs();
  }
  function onKey(e) {
    if (e.code === 'Space') { ap(); return true; }
    const n = parseInt(e.key, 10); if (n >= 1 && n <= 6) { st.med = MED_ORDER[n - 1]; applyMediator(); refs.medSeg.sync(); refs.buildDrugs(); return true; }
    return false;
  }
  function stats() { return [['In the cleft', st.cleft, 'molec.'], ['Receptors', Math.round(st.occ * 100), '%'], ['Response', Math.round(st.resp * 100), '%']]; }
  applyMediator();
  return {
    labelBg: true, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, get accent() { return M.color; },
    kicker: 'Brain · synapse and neurotransmitters', title: 'Synapse and neurotransmitters',
    lede: 'An impulse opens calcium channels, vesicles release the neurotransmitter, molecules find their receptors, and the signal is switched off by enzymes or transporters.',
    notes: `
      <div><h2>How it works</h2>
        <p><b>Synthesis.</b> Enzymes in the terminal make the neurotransmitter, and it is packed into vesicles.</p>
        <p><b>Release.</b> The impulse (bright ring) arrives at the terminal and opens <b>Ca²⁺ channels</b>. Calcium makes docked vesicles fuse with the membrane.</p>
        <p><b>Receptor.</b> The molecules cross the cleft and bind to receptors. Ionotropic receptors are channels themselves: Na⁺ (orange) or Cl⁻ (green) passes through them. Metabotropic receptors activate a G protein beneath the membrane and second messengers.</p>
        <p><b>Inactivation.</b> Glutamate is taken up by astrocytes, acetylcholine is cleaved by an enzyme in the cleft, and monoamines and GABA are returned to the terminal by transporters.</p>
        <h3>Drugs</h3>
        <p>Switch drugs on and watch the graph: an agonist opens receptors by itself, an antagonist (gray balls) occupies them and keeps the neurotransmitter out, a reuptake blocker keeps molecules in the cleft, and an enhancer makes each response stronger.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The order of events and the role of calcium.</li><li>The receptor type and the inactivation route for each neurotransmitter.</li><li>The mechanisms of the drugs from the course.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul>
        <li>One ball stands for many molecules: a vesicle holds thousands.</li><li>The cleft is enlarged and time is slowed: in reality it all takes milliseconds.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>Space</code> impulse</li><li><code>1</code>–<code>6</code> neurotransmitter</li><li>mouse: rotate, wheel: zoom</li></ul></div>`,
  };
}
export { makeSynapse };
