import { GLOW, Sparks, THREE, V3, __set_rnd, accentSet, addLights, canvas, clamp, cur, displaceGeo, envTex, glassMat, group, h, makeControls, mulberry, noise3, rand, randUnit, rnd, seg, smooth, toggle } from '../core.js';


/* =========================================================
   SCENE 0 · ЖИВАЯ КЛЕТКА
   ========================================================= */
const ORGANELLES = [
  { id: 'membrane', name: 'Membrane', color: '#9CC8FF', size: '7–10 nm thick', text: '<b>The plasma membrane</b> is a lipid bilayer with embedded proteins: channels, pumps, receptors. It does not let just anything in. It is across this membrane that a neuron holds its −70 mV charge.' },
  { id: 'nucleus', name: 'Nucleus', color: '#B48CFF', size: '≈ 6 µm', text: '<b>The nucleus</b> stores DNA. It is surrounded by a double envelope with pores. Inside is chromatin: DNA strands wound around proteins.' },
  { id: 'nucleolus', name: 'Nucleolus', color: '#D36FB6', size: '1–2 µm', text: '<b>The nucleolus</b> is a dense region of the nucleus where ribosomal subunits are assembled.' },
  { id: 'pores', name: 'Nuclear pores', color: '#E7D4FF', size: '≈ 120 nm', text: '<b>Nuclear pores</b> are gates in the nuclear envelope. mRNAs (bright sparks) leave through them, and proteins come in.' },
  { id: 'rer', name: 'Rough ER', color: '#5FB0D6', size: 'cisternae ≈ 50 nm', text: '<b>Rough ER</b> is stacks of membrane sacs studded with ribosomes. This is where proteins for the membrane and for export are made: receptors, channels, enzymes that synthesize neurotransmitters.' },
  { id: 'ser', name: 'Smooth ER', color: '#7FD8C4', size: 'tubules ≈ 50 nm', text: '<b>Smooth ER</b> is a network of tubules without ribosomes. It synthesizes lipids and stores Ca²⁺.' },
  { id: 'golgi', name: 'Golgi apparatus', color: '#E6A84E', size: 'stack 1–3 µm', text: '<b>The Golgi apparatus</b> receives proteins from the ER (on its convex side), modifies and sorts them, and ships them in vesicles to the membrane and lysosomes.' },
  { id: 'mito', name: 'Mitochondria', color: '#E0703F', size: '0.5–2 µm', text: '<b>Mitochondria</b> produce ATP (yellow sparks). The inner membrane is folded into cristae to fit more respiratory enzymes. They have their own DNA.' },
  { id: 'lyso', name: 'Lysosomes', color: '#9B6BE0', size: '0.1–1 µm', text: '<b>Lysosomes</b> are vesicles filled with digestive enzymes. They digest worn-out parts of the cell and material taken in from the surface.' },
  { id: 'perox', name: 'Peroxisomes', color: '#8FD16A', size: '0.1–1 µm', text: '<b>Peroxisomes</b> oxidize fatty acids and detoxify hydrogen peroxide with the enzyme catalase (the crystalline core inside).' },
  { id: 'centro', name: 'Centrosome', color: '#B8F0D0', size: 'centriole ≈ 0.2 × 0.5 µm', text: '<b>The centrosome</b> is a pair of centrioles at right angles to each other, each made of 9 microtubule triplets. The microtubules of the cytoskeleton grow from here.' },
  { id: 'cyto', name: 'Cytoskeleton', color: '#9BE8C6', size: 'microtubule 25 nm', text: '<b>Microtubules</b> are the cell’s rails. The motor proteins kinesin and dynein carry cargo along them: this is how vesicles travel down a neuron’s axon to the synapse.' },
  { id: 'ribo', name: 'Ribosomes', color: '#E06A6A', size: '≈ 25 nm', text: '<b>Ribosomes</b> read mRNA and assemble proteins. Free ribosomes make proteins for the cytoplasm itself.' },
  { id: 'ves', name: 'Vesicles', color: '#FFD08A', size: '50–100 nm', text: '<b>Transport vesicles</b> carry cargo: ER → Golgi → membrane. At the membrane a vesicle fuses with it and releases its contents (exocytosis). This is how a neuron releases a neurotransmitter.' },
];

function makeCell() {
  __set_rnd(mulberry(31));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070a); scene.environment = envTex; scene.fog = new THREE.FogExp2(0x06070a, 0.016);
  addLights(scene, 0x7aa8ff);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200); camera.position.set(11, 6.5, 13.5);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 1.5; controls.maxDistance = 40; controls.autoRotate = true; controls.autoRotateSpeed = 0.3;

  const CELL_R = 6, YS = 0.82, NUC = V3(0.3, 0, 0.2), NUC_R = 2.0;
  const G = V3(-2.9, 2.2, -1.2), C = NUC.clone().add(V3(0.1, 2.75, 0));
  const cut = [new THREE.Plane(V3(-1, 0, 0), 0), new THREE.Plane(V3(0, 0, -1), 0)];
  const ORG = Object.fromEntries(ORGANELLES.map((o) => [o.id, { ...o, mats: [], anchor: V3(0, 0, 0), dist: 7 }]));
  const pickables = [];
  const tag = (mesh, id, mat = true) => { mesh.userData.org = id; pickables.push(mesh); if (mat && mesh.material && mesh.material.emissive) ORG[id].mats.push(mesh.material); return mesh; };
  const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color(0xffffff), envMapIntensity: 0.7, emissive: 0x000000, ...o });
  const inCell = (p, m = 0) => p.x * p.x + (p.y / YS) ** 2 + p.z * p.z < (CELL_R - m) ** 2;
  const sample = (test) => { for (let i = 0; i < 4000; i++) { const p = V3(rand(-5.6, 5.6), rand(-4.7, 4.7), rand(-5.6, 5.6)); if (test(p)) return p; } return V3(0, -3.5, 3); };
  const fib = (n) => { const out = []; const g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y); out.push(V3(Math.cos(g * i) * r, y, Math.sin(g * i) * r)); } return out; };
  const dummy = new THREE.Object3D(), Y = V3(0, 1, 0), Z = V3(0, 0, 1);

  /* membrane */
  const memGeo = displaceGeo(new THREE.SphereGeometry(CELL_R, 160, 120), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.045 * noise3(n.x * 1.4, n.y * 1.4, n.z * 1.4) + 0.012 * noise3(n.x * 6, n.y * 6, n.z * 6)); v.y *= YS; });
  const memSolid = phys(0xbcd6f2, { transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
  scene.add(tag(new THREE.Mesh(memGeo, memSolid), 'membrane'));
  scene.add(new THREE.Mesh(memGeo, glassMat(0x9cc8ff, { rim: 0.85, base: 0.015, pow: 2.3 })));
  const memIn = new THREE.Mesh(memGeo, glassMat(0x9cc8ff, { rim: 0.35, base: 0.0, pow: 2.6 })); memIn.scale.setScalar(0.985); scene.add(memIn);
  { const pos = memGeo.attributes.position, nor = memGeo.attributes.normal, N = 900;
    const prot = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 8), phys(0xffffff, { roughness: 0.5 }), N);
    for (let i = 0; i < N; i++) { const k = Math.floor(rnd() * pos.count); const p = V3(pos.getX(k), pos.getY(k), pos.getZ(k)), n = V3(nor.getX(k), nor.getY(k), nor.getZ(k));
      dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(Y, n); dummy.scale.set(1, rand(1.2, 2.2), 1); dummy.updateMatrix(); prot.setMatrixAt(i, dummy.matrix); prot.setColorAt(i, new THREE.Color(rnd() < 0.18 ? 0xffc77a : 0xd9e7ff)); }
    scene.add(tag(prot, 'membrane')); }
  ORG.membrane.anchor = V3(-3.1, 3.55, 3.0); ORG.membrane.dist = 17;

  /* nucleus */
  const nucGeo = displaceGeo(new THREE.SphereGeometry(NUC_R, 128, 96), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.03 * noise3(n.x * 2, n.y * 2, n.z * 2)); v.add(NUC); });
  const nucMat = phys(0x7d4fb8, { transparent: true, opacity: 0.34, depthWrite: false, side: THREE.DoubleSide });
  scene.add(tag(new THREE.Mesh(nucGeo, nucMat), 'nucleus'));
  scene.add(new THREE.Mesh(nucGeo, glassMat(0xc79bff, { rim: 0.8, base: 0.02, pow: 2.2 })));
  const nucIn = new THREE.Mesh(nucGeo, glassMat(0xc79bff, { rim: 0.3, base: 0, pow: 2.4 })); nucIn.position.copy(NUC).multiplyScalar(0.05); nucIn.scale.setScalar(0.95); scene.add(nucIn);
  const poreDirs = fib(240), porePts = [];
  { const pm = new THREE.InstancedMesh(new THREE.TorusGeometry(0.075, 0.026, 6, 16), phys(0xe7d4ff, { emissive: 0x2a1840 }), poreDirs.length);
    poreDirs.forEach((d, i) => { const p = NUC.clone().addScaledVector(d, NUC_R * 1.01); porePts.push({ p, d }); dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(Z, d); dummy.scale.setScalar(1); dummy.updateMatrix(); pm.setMatrixAt(i, dummy.matrix); });
    scene.add(tag(pm, 'pores')); }
  ORG.nucleus.anchor = NUC.clone().add(V3(-1.2, 1.25, 1.05)); ORG.nucleus.dist = 9;
  ORG.pores.anchor = NUC.clone().addScaledVector(V3(1, 1.2, -0.4).normalize(), NUC_R); ORG.pores.dist = 4.5;
  const chromMat = phys(0xd27ac0, { roughness: 0.5, emissive: 0x2a0b25 });
  for (let c = 0; c < 30; c++) {
    let p = randUnit().multiplyScalar(rand(0.3, 1.5)); const d = randUnit(); const pts = [p.clone().add(NUC)];
    for (let k = 0; k < 11; k++) { d.add(randUnit().multiplyScalar(0.7)).normalize(); p = p.clone().addScaledVector(d, 0.32); if (p.length() > 1.72) { p.multiplyScalar(1.6 / p.length()); d.negate(); } pts.push(p.clone().add(NUC)); }
    scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.038, 6), chromMat), 'nucleus', c === 0));
  }
  const NO = NUC.clone().add(V3(0.35, 0.3, -0.25));
  scene.add(tag(new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(0.58, 5), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.12 * noise3(n.x * 4, n.y * 4, n.z * 4)); v.add(NO); }), phys(0x6e2c64, { roughness: 0.75, clearcoat: 0.2, emissive: 0x1a0616 })), 'nucleolus'));
  ORG.nucleolus.anchor = NO.clone(); ORG.nucleolus.dist = 4;

  /* rough ER */
  const rerMat = phys(0x5fb0d6, { transparent: true, opacity: 0.62, side: THREE.DoubleSide, roughness: 0.32 });
  const rerVerts = [];
  for (let k = 0; k < 5; k++) {
    const r = 2.38 + k * 0.27;
    const g = displaceGeo(new THREE.SphereGeometry(r, 90, 44, 0.3, 4.3, 0.55, 1.95), (v) => {
      const n = v.clone().normalize(), ph = Math.atan2(n.z, n.x), th = Math.acos(clamp(n.y, -1, 1));
      v.multiplyScalar(1 + 0.035 * Math.sin(ph * 9 + k * 1.3) * Math.sin(th * 7 + k) + 0.015 * noise3(n.x * 4 + k, n.y * 4, n.z * 4)); v.add(NUC);
    });
    const pos = g.attributes.position; for (let i = 0; i < pos.count; i += 3) rerVerts.push(V3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    scene.add(tag(new THREE.Mesh(g, rerMat), 'rer', k === 0));
  }
  { const N = 2600, rm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.034, 8, 6), phys(0xe06a6a, { roughness: 0.6, emissive: 0x200404 }), N);
    for (let i = 0; i < N; i++) { const p = rerVerts[Math.floor(rnd() * rerVerts.length)]; const out = p.clone().sub(NUC).normalize(); dummy.position.copy(p).addScaledVector(out, rnd() < 0.5 ? 0.04 : -0.04); dummy.quaternion.identity(); dummy.scale.setScalar(1); dummy.updateMatrix(); rm.setMatrixAt(i, dummy.matrix); }
    scene.add(tag(rm, 'rer', false)); }
  const sph = (r, ph, th) => V3(-r * Math.cos(ph) * Math.sin(th), r * Math.cos(th), r * Math.sin(ph) * Math.sin(th)).add(NUC);
  ORG.rer.anchor = sph(3.3, 1.9, 1.35); ORG.rer.dist = 6;

  /* smooth ER */
  const serMat = phys(0x7fd8c4, { transparent: true, opacity: 0.85, roughness: 0.3 });
  const S0 = V3(0.8, -3.4, -1.9);
  for (let c = 0; c < 16; c++) {
    let p = S0.clone().add(randUnit().multiplyScalar(rand(0, 1.1))); const d = randUnit(); const pts = [p.clone()];
    for (let k = 0; k < 10; k++) { d.add(randUnit().multiplyScalar(0.6)).normalize(); const q = p.clone().addScaledVector(d, 0.32); if (!inCell(q, 0.8) || q.distanceTo(NUC) < 2.5) { d.negate(); continue; } p = q; pts.push(p.clone()); }
    if (pts.length > 3) scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 50, 0.07, 8), serMat), 'ser', c === 0));
  }
  ORG.ser.anchor = S0.clone(); ORG.ser.dist = 5.5;

  /* Golgi */
  const nG = NUC.clone().sub(G).normalize();
  const golgi = new THREE.Group(); golgi.position.copy(G); golgi.quaternion.setFromUnitVectors(Y, nG.clone().negate()); scene.add(golgi);
  const golMat = phys(0xe6a84e, { roughness: 0.3, clearcoat: 0.9, emissive: 0x1a0d00 });
  for (let i = 0; i < 6; i++) {
    const w = 1.25 - Math.abs(i - 2.5) * 0.12, off = (i - 2.5) * 0.2;
    const g = displaceGeo(new THREE.SphereGeometry(1, 56, 22), (v) => { v.set(v.x * w, v.y * 0.065 + off, v.z * w * 0.55); v.y += 0.3 * (v.x * v.x + v.z * v.z); });
    golgi.add(tag(new THREE.Mesh(g, golMat), 'golgi', i === 0));
    for (let k = 0; k < 7; k++) { const a = rand(0, 6.283); const b = new THREE.Mesh(new THREE.SphereGeometry(rand(0.06, 0.1), 12, 8), golMat); const x = Math.cos(a) * w * 1.05, z = Math.sin(a) * w * 0.58; b.position.set(x, off + 0.3 * (x * x + z * z) + rand(-0.05, 0.05), z); golgi.add(tag(b, 'golgi', false)); }
  }
  const cisFace = G.clone().addScaledVector(nG, 0.85), transFace = G.clone().addScaledVector(nG, -0.95);
  ORG.golgi.anchor = G.clone(); ORG.golgi.dist = 5;

  /* centrosome & microtubules */
  const cg = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 6), phys(0xb8f0d0, { emissive: 0x0c2a1c }), 54);
  let ci = 0;
  [[new THREE.Euler(0, 0, 0)], [new THREE.Euler(Math.PI / 2, 0, 0.4)]].forEach(([e], c) => {
    const q = new THREE.Quaternion().setFromEuler(e); const base = C.clone().add(V3(c * 0.28, 0, 0));
    for (let k = 0; k < 9; k++) for (let j = 0; j < 3; j++) {
      const a = k / 9 * 6.283 + j * 0.12, r = 0.1 + j * 0.022;
      dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r).applyQuaternion(q).add(base); dummy.quaternion.copy(q); dummy.scale.setScalar(1); dummy.updateMatrix(); cg.setMatrixAt(ci++, dummy.matrix);
    }
  });
  scene.add(tag(cg, 'centro'));
  const pcm = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0x7fe0b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 })); pcm.position.copy(C); pcm.scale.setScalar(1.1); scene.add(pcm);
  ORG.centro.anchor = C.clone(); ORG.centro.dist = 2.6;
  const mtMat = phys(0x9be8c6, { transparent: true, opacity: 0.8, emissive: 0x0e3a2a, roughness: 0.3 });
  const mtCurves = [];
  const segDist = (p, a, b) => { const ab = b.clone().sub(a), t = clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1); return a.clone().addScaledVector(ab, t).distanceTo(p); };
  fib(140).forEach((d) => {
    const end = V3(d.x * 5.55, d.y * 5.55 * YS, d.z * 5.55);
    if (segDist(NUC, C, end) < 2.35 || mtCurves.length > 48 || rnd() < 0.35) return;
    const mid = C.clone().lerp(end, 0.5).add(randUnit().multiplyScalar(0.35));
    const curve = new THREE.CatmullRomCurve3([C.clone(), mid, end]); mtCurves.push(curve);
    scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.022, 5), mtMat), 'cyto', mtCurves.length === 1));
  });
  ORG.cyto.anchor = mtCurves[0] ? mtCurves[0].getPointAt(0.6) : C.clone(); ORG.cyto.dist = 5;

  /* mitochondria */
  const mitos = [], spots = [];
  const free = (p, d) => spots.every((s) => s.distanceTo(p) > d);
  const outMat = phys(0xd9663a, { transparent: true, opacity: 0.5, depthWrite: false, roughness: 0.3, clearcoat: 1 });
  const matMat = phys(0x7a2a18, { transparent: true, opacity: 0.85, roughness: 0.6 });
  const crMat = phys(0xffb07a, { roughness: 0.45, emissive: 0x2a0e00 });
  for (let i = 0; i < 12; i++) {
    const p = sample((q) => inCell(q, 1.0) && q.distanceTo(NUC) > 3.75 && q.distanceTo(G) > 2.0 && q.distanceTo(C) > 1.2 && free(q, 1.5)); spots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(Y, randUnit());
    const len = rand(0.8, 1.4);
    g.add(tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.36, len, 10, 24), outMat), 'mito', i === 0));
    g.add(tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.29, len - 0.05, 8, 20), matMat), 'mito', false));
    const nC = Math.round(len / 0.16);
    for (let k = 0; k < nC; k++) { const c = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), crMat); c.scale.set(0.27, 0.025, 0.25); c.position.y = -len / 2 + (k + 0.5) * len / nC; c.rotation.z = k % 2 ? 0.28 : -0.28; c.rotation.y = rand(0, 3); g.add(tag(c, 'mito', false)); }
    scene.add(g); mitos.push({ g, base: p.clone(), ph: rand(0, 6.28), q0: g.quaternion.clone() });
  }
  ORG.mito.anchor = mitos[0].base.clone(); ORG.mito.dist = 3.6;

  /* lysosomes & peroxisomes */
  const lysMat = phys(0x9b6be0, { roughness: 0.35, emissive: 0x1c0b33 }), lysos = [];
  for (let i = 0; i < 9; i++) { const p = sample((q) => inCell(q, 0.9) && q.distanceTo(NUC) > 3.55 && q.distanceTo(G) > 1.6 && free(q, 0.9)); spots.push(p);
    const m = new THREE.Mesh(displaceGeo(new THREE.IcosahedronGeometry(rand(0.2, 0.32), 3), (v) => v.multiplyScalar(1 + 0.08 * noise3(v.x * 8 + i, v.y * 8, v.z * 8))), lysMat); m.position.copy(p); scene.add(tag(m, 'lyso', i === 0)); lysos.push({ m, base: p.clone(), ph: rand(0, 6) }); }
  ORG.lyso.anchor = lysos[0].base.clone(); ORG.lyso.dist = 2.6;
  const perMat = phys(0x8fd16a, { transparent: true, opacity: 0.5, depthWrite: false }), perCore = phys(0x3f7a2a, { roughness: 0.2, emissive: 0x0c1f06 }), peros = [];
  for (let i = 0; i < 6; i++) { const p = sample((q) => inCell(q, 0.9) && q.distanceTo(NUC) > 3.55 && q.distanceTo(G) > 1.6 && free(q, 0.9)); spots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.add(tag(new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), perMat), 'perox', i === 0)); const core = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), perCore); core.rotation.set(rand(0, 3), rand(0, 3), 0); g.add(tag(core, 'perox', false)); scene.add(g); peros.push(g); }
  ORG.perox.anchor = peros[0].position.clone(); ORG.perox.dist = 2.2;

  /* free ribosomes */
  { const N = 1300, fm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.032, 8, 6), phys(0xe06a6a, { roughness: 0.6, emissive: 0x200404 }), N); let first = null;
    for (let i = 0; i < N; i++) { const p = sample((q) => inCell(q, 0.3) && q.distanceTo(NUC) > 2.15); if (!first && q2(p)) first = p.clone(); dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(1); dummy.updateMatrix(); fm.setMatrixAt(i, dummy.matrix); }
    scene.add(tag(fm, 'ribo')); ORG.ribo.anchor = first || V3(2, -2, 3); ORG.ribo.dist = 2.4;
    function q2(p) { return p.distanceTo(NUC) > 3.6 && p.y < -1; } }

  /* cytosol */
  const DN = 2200, dust = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) { const p = sample((q) => inCell(q, 0.2)); dust.set([p.x, p.y, p.z], i * 3); }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.05, map: GLOW, color: 0x6d86b8, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* vesicle traffic */
  const VN = 200;
  const vesMat = phys(0xffffff, { roughness: 0.18, clearcoat: 1, emissive: 0xffffff, emissiveIntensity: 0.12 });
  const vesMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 16, 12), vesMat, VN); vesMesh.frustumCulled = false; scene.add(tag(vesMesh, 'ves', false)); ORG.ves.mats.push(vesMat);
  for (let i = 0; i < VN; i++) { dummy.position.set(0, 0, 0); dummy.scale.setScalar(0); dummy.updateMatrix(); vesMesh.setMatrixAt(i, dummy.matrix); vesMesh.setColorAt(i, new THREE.Color(0xffffff)); }
  const slots = [...Array(VN).keys()], trav = [];
  function go(a, b, dur, color, size, onEnd, bulge = 0.8, curve = null) {
    const s = slots.pop(); if (s === undefined) return;
    let c = null;
    if (!curve) { c = a.clone().add(b).multiplyScalar(0.5); const away = c.clone().sub(NUC); if (away.lengthSq() < 1e-4) away.set(0, 1, 0); c.addScaledVector(away.normalize(), bulge); }
    trav.push({ s, a, b, c, t: 0, dur, size, onEnd, curve }); vesMesh.setColorAt(s, new THREE.Color(color)); vesMesh.instanceColor.needsUpdate = true;
  }
  const memPoint = (dir) => { const d = dir.clone().normalize(); return V3(d.x * 5.75, d.y * 5.75 * YS, d.z * 5.75); };
  ORG.ves.anchor = transFace.clone(); ORG.ves.dist = 4;

  const sparks = new Sparks(1800, 0.1); scene.add(sparks.obj);
  const C_ATP = new THREE.Color(0xffe27a), C_RNA = new THREE.Color(0xf3e4ff), C_EXO = new THREE.Color(0xffd08a);

  // clip everything
  scene.traverse((o) => { const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []; ms.forEach((m) => { m.clippingPlanes = cut; m.clipIntersection = true; }); });

  const st = { t: 0, cut: true, labels: true, rot: true, sel: null, focusT: 0, timers: { er: 0, ex: 0.3, en: 0.8, mt: 0, rna: 0 } };
  const C_SEL = new THREE.Color();
  ORGANELLES.forEach((o) => ORG[o.id].mats.forEach((m) => { if (!m.userData.e0) m.userData.e0 = { c: m.emissive.clone(), i: m.emissiveIntensity }; }));

  function select(id) {
    if (st.sel) ORG[st.sel].mats.forEach((m) => { m.emissive.copy(m.userData.e0.c); m.emissiveIntensity = m.userData.e0.i; });
    st.sel = id === 'all' ? null : id; st.focusT = 1.8;
    st.focus = st.sel ? { target: ORG[st.sel].anchor, dist: ORG[st.sel].dist } : { target: V3(0, 0, 0), dist: 19 };
    accentSet(st.sel ? ORG[st.sel].color : '#9CC8FF');
    refs.setInfo && refs.setInfo(); refs.seg && refs.seg.sync();
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot;
    // cutaway faces the camera
    const dx = camera.position.x - controls.target.x, dz = camera.position.z - controls.target.z, a = Math.atan2(dz, dx);
    cut[0].normal.set(-Math.cos(a + Math.PI / 4), 0, -Math.sin(a + Math.PI / 4)); cut[1].normal.set(-Math.cos(a - Math.PI / 4), 0, -Math.sin(a - Math.PI / 4));
    cut.forEach((p) => (p.constant = st.cut ? 0 : 1000));
    // focus
    if (st.focusT > 0 && st.focus) {
      st.focusT -= dt; const k = 1 - Math.exp(-dt * 3);
      controls.target.lerp(st.focus.target, k);
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.lerp(controls.target.clone().addScaledVector(dir, st.focus.dist), k);
    }
    // selection glow
    if (st.sel) { C_SEL.set(ORG[st.sel].color); const pulse = 0.35 + 0.25 * Math.sin(t * 4); ORG[st.sel].mats.forEach((m) => { m.emissive.copy(C_SEL); m.emissiveIntensity = pulse; }); }
    // organelle motion
    mitos.forEach((m, i) => { m.g.position.set(m.base.x + 0.12 * Math.sin(t * 0.4 + m.ph), m.base.y + 0.1 * Math.sin(t * 0.33 + m.ph * 2), m.base.z + 0.12 * Math.cos(t * 0.37 + m.ph)); m.g.rotateY(dt * 0.15); if (rnd() < dt * 3) sparks.spawn(m.g.position.clone().add(randUnit().multiplyScalar(0.45)), randUnit().multiplyScalar(0.35), C_ATP, 1.0, 0.8, 1.3); });
    lysos.forEach((l) => l.m.position.set(l.base.x + 0.15 * Math.sin(t * 0.5 + l.ph), l.base.y + 0.12 * Math.cos(t * 0.45 + l.ph), l.base.z + 0.15 * Math.sin(t * 0.38 + l.ph * 1.7)));
    memIn.scale.setScalar(0.985 + 0.004 * Math.sin(t * 0.8));
    // cytosol flow
    for (let i = 0; i < DN; i++) { const k = i * 3, x = dust[k], y = dust[k + 1], z = dust[k + 2];
      let nx = x + Math.sin(y * 0.7 + t * 0.3) * 0.08 * dt, ny = y + Math.sin(z * 0.6 + t * 0.25) * 0.06 * dt, nz = z + Math.sin(x * 0.5 + t * 0.35) * 0.08 * dt;
      if (nx * nx + (ny / YS) ** 2 + nz * nz > (CELL_R - 0.15) ** 2) { nx *= 0.9; ny *= 0.9; nz *= 0.9; } dust[k] = nx; dust[k + 1] = ny; dust[k + 2] = nz; }
    dustGeo.attributes.position.needsUpdate = true;
    // traffic
    const T = st.timers;
    if ((T.er -= dt) < 0) { T.er = 0.45; const dir = G.clone().sub(NUC).normalize().add(randUnit().multiplyScalar(0.45)).normalize(); go(NUC.clone().addScaledVector(dir, 3.45), cisFace.clone().add(randUnit().multiplyScalar(0.25)), 2.6, 0x7fd0ee, 0.8, null, 0.3); }
    if ((T.ex -= dt) < 0) { T.ex = 0.6; const dir = G.clone().normalize().add(randUnit().multiplyScalar(0.9)); const end = memPoint(dir);
      go(transFace.clone().add(randUnit().multiplyScalar(0.3)), end, 4, 0xffd08a, 1, (p) => { for (let k = 0; k < 14; k++) sparks.spawn(p, randUnit().multiplyScalar(0.9), C_EXO, 0.6, 2, 1.4); }, 0.6); }
    if ((T.en -= dt) < 0) { T.en = 1.5; const l = lysos[Math.floor(rnd() * lysos.length)]; const start = memPoint(l.base.clone().add(randUnit().multiplyScalar(2)));
      go(start, l.m.position.clone(), 4.5, 0xb894ff, 0.9, null, 0.3); }
    if ((T.mt -= dt) < 0 && mtCurves.length) { T.mt = 0.16; const c = mtCurves[Math.floor(rnd() * mtCurves.length)]; const out = rnd() < 0.65; go(null, null, rand(3, 5), out ? 0xd9fff0 : 0xffb0d0, 0.55, null, 0, { c, out }); }
    if ((T.rna -= dt) < 0) { T.rna = 0.04; const pr = porePts[Math.floor(rnd() * porePts.length)]; sparks.spawn(pr.p.clone(), pr.d.clone().multiplyScalar(rand(0.5, 0.9)), C_RNA, 1.2, 0.6, 1.2); }
    for (let i = trav.length - 1; i >= 0; i--) {
      const v = trav[i]; v.t += dt; const k = clamp(v.t / v.dur, 0, 1), e = smooth(0, 1, k);
      let p;
      if (v.curve) p = v.curve.c.getPointAt(v.curve.out ? e : 1 - e);
      else { const u = 1 - e; p = v.a.clone().multiplyScalar(u * u).addScaledVector(v.c, 2 * u * e).addScaledVector(v.b, e * e); }
      const sc = v.size * Math.min(1, k / 0.08) * Math.min(1, (1 - k) / 0.06 + (v.onEnd ? 0.4 : 0));
      dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(Math.max(sc, 0)); dummy.updateMatrix(); vesMesh.setMatrixAt(v.s, dummy.matrix);
      if (v.t >= v.dur) { if (v.onEnd) v.onEnd(p); dummy.scale.setScalar(0); dummy.updateMatrix(); vesMesh.setMatrixAt(v.s, dummy.matrix); slots.push(v.s); trav.splice(i, 1); }
    }
    vesMesh.instanceMatrix.needsUpdate = true;
    sparks.update(dt);
  }

  /* picking */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (cur !== self || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pickables, false).filter((hh) => !(st.cut && cut.every((p) => p.distanceToPoint(hh.point) < 0)));
    const hit = hits.find((hh) => hh.object.userData.org !== 'membrane') || hits[0];
    if (hit) select(hit.object.userData.org);
  });

  const labels = ORGANELLES.map((o) => ({ text: o.name, pos: ORG[o.id].anchor, color: o.color, show: () => st.labels && (!st.sel || st.sel === o.id || ['membrane', 'nucleus'].includes(o.id)) }));
  const refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    refs.setInfo = () => { info.innerHTML = st.sel ? ORG[st.sel].text : 'Click any organelle or pick it from the list. The cutaway always faces you: rotate the cell to look from the other side.'; };
    refs.seg = seg([{ id: 'all', label: 'Overview' }, ...ORGANELLES.map((o) => ({ id: o.id, label: o.name, color: o.color }))], () => st.sel || 'all', (v) => select(v));
    const cutB = toggle('Cutaway', () => st.cut, (v) => { st.cut = v; });
    const rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    refs.cutB = cutB; refs.rot = rot; refs.lab = lab;
    el.append(
      h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Organelles', h('kbd', {}, 'click the cell')), h('div', { class: 'gctl' }, refs.seg)),
      group('View', 'C · R · N', cutB, rot, lab),
      h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'What it is'), info),
    );
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'c' || k === 'с') { refs.cutB.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.sel ? [['Size', ORG[st.sel].size, '']] : [['Cell', '≈ 20', 'µm'], ['Organelles', ORGANELLES.length, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sel ? ORG[st.sel].color : '#9CC8FF'; },
    kicker: 'Cell · structure', title: 'Living cell',
    lede: 'Nucleus, ER, Golgi, mitochondria and cytoskeleton in cutaway. Vesicles carry proteins to the membrane, cargo travels along microtubules, mitochondria produce ATP.',
    notes: `
      <div><h2>How a cell is built</h2>
        <p>A neuron is a cell like any other, just with very long processes. Everything discussed in the course starts here: receptor proteins and channels are made on the <b>rough ER</b>, finished in the <b>Golgi apparatus</b> and carried to the membrane in vesicles.</p>
        <h3>What moves</h3>
        <p><b>Blue vesicles</b> carry proteins from the ER to the Golgi. <b>Gold ones</b> go from the Golgi to the membrane and fuse with it — this is exocytosis, the same mechanism a synapse uses to release a neurotransmitter. <b>Lilac ones</b> pinch off from the membrane and drift to the lysosomes. Along the <b>microtubules</b> motor proteins carry cargo in both directions. mRNAs exit the <b>nuclear pores</b>, and ATP flashes at the <b>mitochondria</b>.</p>
        <h3>Energy</h3>
        <p>The brain is about 2% of body mass but uses roughly 20% of the energy. Most of the ATP is consumed by the Na⁺/K⁺ pump, which is why neurons have so many mitochondria.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The set of organelles and their arrangement: the ER is continuous with the nuclear envelope, and the Golgi lies next to the centrosome.</li>
        <li>The double nuclear envelope with pores, mitochondrial cristae, 9 microtubule triplets in the centrioles.</li>
        <li>The routes of the vesicles.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Sizes are not to scale: a ribosome is a thousand times smaller than the cell, yet here you can see it.</li><li>A real cell has hundreds of times more organelles and ribosomes.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li>click an organelle: select</li><li><code>C</code> cutaway</li><li><code>R</code> rotate</li><li><code>N</code> labels</li><li><code>Esc</code> overview</li></ul></div>`,
  };
  return self;
}
export { makeCell };
