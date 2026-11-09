import { LANG, THREE, V3, __set_rnd, button, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, loadSkeletonStatic, makeControls, mulberry, pickOn, rnd, seg, taperTube, toggle } from '../core.js';


// @scene hgang makeHGang | Парасимпатические узлы головы | @brain Устройство
/* =========================================================
   МОЗГ · ПАРАСИМПАТИЧЕСКИЕ УЗЛЫ ГОЛОВЫ: ресничный, крылонёбный, поднижнечелюстной и ушной узлы на скане черепа —
   ядра ствола, первые нейроны в нервах III, VII, IX, вторые — по ветвям тройничного нерва к глазу и железам;
   рефлексы (зрачок на свет, слюна на еду, испуг — симпатика) и три сбоя (сдавление III, «крокодиловы слёзы», синдром Фрея).
   Сверено с атласом Неттера (табл. 142–145). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека (показана правая сторона, x < 0).
   Начало координат — точка скана черепа (0.11, 16.0, 0.6), 1 ед. скана ≈ 12,5 см (как в сценах orbit, face).
   ========================================================= */
const HG_GAN = [
  { id: 'cil', name: 'Ciliary', col: '#6FC8F0', text: '<b>The ciliary ganglion</b> lies in the orbit beside the optic nerve, about 1 cm from the orbital apex. Its fibers come from the accessory nucleus of nerve III and travel in the nerve itself. Short ciliary nerves carry the signal to the muscle that constricts the pupil and to the ciliary muscle, which adjusts the lens for near vision. Sympathetic fibers pass through the ganglion without synapsing.' },
  { id: 'ptp', name: 'Pterygopalatine', col: '#7FE0A0', text: '<b>The pterygopalatine ganglion</b>, the largest (3–5 mm), hangs from nerve V₂ behind the maxilla. Fibers from the superior salivatory nucleus run in the facial nerve (VII), leave at the genu as the greater petrosal nerve, and join the nerve of the pterygoid canal. After the ganglion they reach the lacrimal gland (via the zygomatic and lacrimal nerves) and the nasal and palatine glands.' },
  { id: 'smd', name: 'Submandibular', col: '#E8C860', text: '<b>The submandibular ganglion</b> hangs from the lingual nerve (V₃) above the gland of the same name. Fibers from the superior salivatory nucleus travel in the facial nerve, through the middle ear as the chorda tympani, and then in the lingual nerve. After the ganglion they go to the submandibular and sublingual glands. The chorda also carries taste from the front two-thirds of the tongue.' },
  { id: 'otic', name: 'Otic', col: '#F0909C', text: '<b>The otic ganglion</b> lies below the foramen ovale, on the inner side of the mandibular nerve (V₃). Fibers from the inferior salivatory nucleus travel in nerve IX: the tympanic nerve rises into the middle ear, forms a plexus there, and leaves as the lesser petrosal nerve. After the ganglion the signal reaches the parotid gland via the auriculotemporal nerve.' },
];
const HG_REF = [
  { id: 'light', name: 'Light', col: '#F8E070', text: '<b>Pupillary reflex.</b> Light on the retina → optic nerve → pretectal nuclei of the midbrain → accessory nuclei of III on both sides → ciliary ganglion → the muscle that constricts the pupil. That is why light in one eye constricts both pupils (one side is shown here). In life it takes about 0.2 s. Doctors test the reflex with a penlight: it shows whether the optic nerve, midbrain, and nerve III are intact.' },
  { id: 'food', name: 'Food', col: '#E8C860', text: '<b>Saliva for food.</b> Taste excites the solitary nucleus, smell and the sight of food excite higher centers, and they drive the salivatory nuclei. Saliva flow rises from ≈ 0.3 to 1.5–2 mL/min, and the saliva is watery. At rest the submandibular glands make most of it (≈ 70%), during meals the parotids (≈ 50%). Salivating at the mere sight of food is a conditioned reflex (Pavlov\'s experiments).' },
  { id: 'fear', name: 'Fear', col: '#FF9A48', text: '<b>Fear — the sympathetic division takes over.</b> Its fibers leave the upper thoracic segments of the spinal cord, synapse in the superior cervical ganglion, and rise as a plexus on the internal carotid artery. Through the orbit (passing through the ciliary ganglion) they reach the muscle that dilates the pupil. The parasympathetic division quiets down: saliva is scant and thick — a dry mouth.' },
];
const HG_DIS = [
  { id: 'cn3', name: 'Nerve III compression', col: '#E05060', text: '<b>Compression of nerve III</b> by an aneurysm of the posterior communicating artery or by a brain shifted by swelling. Parasympathetic fibers lie on the surface of the nerve, so the pupil is affected early: it is wide and does not constrict to light. The eyelid droops, and the eye turns down and out. One wide pupil with a severe headache or after head trauma calls for an urgent CT scan.' },
  { id: 'croc', name: 'Crocodile tears', col: '#7FE0A0', text: '<b>“Crocodile tears”</b> (Bogorad syndrome). After damage to the facial nerve above the genu, fibers that went to the salivary glands regrow the wrong way — into the greater petrosal nerve, to the pterygopalatine ganglion and the lacrimal gland. Now the eye on the affected side waters while eating. Botulinum toxin injections into the lacrimal gland help.' },
  { id: 'frey', name: 'Frey syndrome', col: '#F0909C', text: '<b>Frey syndrome</b> (auriculotemporal syndrome). After surgery on the parotid gland, its cut fibers grow into the sweat glands and vessels of the cheek skin. Now the cheek flushes and sweats while eating. This is possible because sweat glands also respond to acetylcholine. Botulinum toxin injections into the skin help.' },
];
function makeHGang() {
  __set_rnd(mulberry(2617));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const keyL = new THREE.DirectionalLight(0xfff2e6, 0.7); keyL.position.set(-14, 10, 12); scene.add(keyL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.15, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.08, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined }); m.userData.em0 = o.em ?? 0.08; m.userData.op0 = o.op ?? 1; return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => (a.isVector3 ? a.clone() : V3(a[0], a[1], a[2]))), false, 'centripetal');
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
  const controls = makeControls(camera, V3(-3, -2.5, -2)); controls.minDistance = 4; controls.maxDistance = 90;
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const st = { mode: 'path', sel: null, ref: 'light', dis: 'cn3', sym: false, rt: 0, labels: true, rot: false, fly: null, t: 0, pup: 0.2, yaw: 0, pitch: 0, sal: 0.15, tear: 0.1 };
  const pick = [];
  const GC = Object.fromEntries(HG_GAN.map((g) => [g.id, g.col]));

  // =================== скан черепа: правая половина без шейных позвонков ===================
  const KS = 12.5, SK = new THREE.Group(); SK.scale.setScalar(KS); SK.position.set(-0.11 * KS, -16 * KS, -0.6 * KS); scene.add(SK);
  const skM = new THREE.MeshPhysicalMaterial({ color: 0xE8DCC8, roughness: 0.65, clearcoat: 0.1, emissive: 0x6a5e4c, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.FrontSide });
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    const ok = (i) => { const x = (P.getX(i) - 0.11) * KS, y = (P.getY(i) - 16) * KS, z = (P.getZ(i) - 0.6) * KS; return x < 0.3 && y > -11.6 && !(y < -3.7 && z < -5.3); };
    for (let t = 0; t < IX.length; t += 3) if (ok(IX[t]) && ok(IX[t + 1]) && ok(IX[t + 2])) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = 5; SK.add(ms);
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
  }).catch(() => {});

  // =================== вспомогательное ===================
  const S = (c, a, b, n = 24) => { const o = []; for (let i = 0; i <= n; i++) o.push(c.getPointAt(a + (b - a) * i / n)); return o; };
  const uOf = (c, p) => { let bu = 0, bd = 1e9; for (let i = 0; i <= 600; i++) { const u = i / 600, d = c.getPointAt(u).distanceToSquared(p); if (d < bd) { bd = d; bu = u; } } return bu; };
  const join = (...arrs) => { const o = []; arrs.flat().forEach((p) => { const q = p.isVector3 ? p.clone() : V3(...p); if (!o.length || o[o.length - 1].distanceTo(q) > 0.06) o.push(q); }); return o; };
  const rev = (a) => a.slice().reverse();

  // =================== ствол мозга и ядра ===================
  const STEMC = cr3([[-0.05, 2.1, -5.15], [-0.05, 1.1, -5.65], [-0.05, -0.3, -6.25], [-0.05, -1.8, -6.85], [-0.05, -3.0, -7.2], [-0.05, -4.3, -7.45]]);
  const stemM = mphys('#C8B4BC', { r: 0.6, em: 0.05, op: 0.26 });
  const STEM = new THREE.Mesh(taperTube(STEMC, (u) => 0.8 + 0.5 * Math.exp(-(((u - 0.36) / 0.13) ** 2)) - 0.15 * sm((u - 0.6) / 0.4), 64, 24), stemM); STEM.renderOrder = 3; scene.add(STEM);
  const NUC = { ew: V3(-0.25, 1.2, -6.05), ssn: V3(-0.5, -1.25, -6.75), isn: V3(-0.5, -2.15, -7.05), nts: V3(-0.6, -1.85, -7.35), pre: V3(-0.3, 1.6, -6.35) };
  const NUCG = {}; [['ew', GC.cil], ['ssn', '#B8E890'], ['isn', GC.otic], ['nts', '#C8A8FF'], ['pre', '#C8A8FF']].forEach(([k, c]) => { NUCG[k] = glowNucleus(scene, NUC[k], c, 0.11, 6); });

  // =================== несущие нервы (нейтральные) ===================
  const carM = mphys('#B8B09E', { r: 0.6, em: 0.05 }), vM = mphys('#A89CC8', { r: 0.6, em: 0.08 });
  const CAR = [];   // { m, rel: [ganglia], kind }
  const carrier = (pts, r, mat, rel, kind = 'n') => { const c = cr3(pts); const m = new THREE.Mesh(new THREE.TubeGeometry(c, Math.max(20, Math.round(c.getLength() * 8)), r, 8), mat.clone()); m.material.userData = { ...mat.userData }; scene.add(m); CAR.push({ m, rel, kind }); return c; };
  // III
  const C3 = carrier([[-0.45, 0.75, -5.0], [-1.05, 1.15, -4.45], [-1.35, 1.65, -3.6], [-1.55, 2.05, -3.0], [-1.85, 2.2, -2.1], [-2.0, 2.2, -1.5]], 0.075, carM, ['cil']);
  carrier([[-2.0, 2.2, -1.5], [-2.2, 2.65, -0.6], [-2.3, 3.1, 0.4]], 0.05, carM, ['cil']);
  carrier([[-2.0, 2.2, -1.5], [-2.15, 1.8, -0.6], [-2.7, 1.45, 0.6]], 0.05, carM, ['cil']);
  // VII (с промежуточным нервом)
  const GEN = V3(-4.3, -0.6, -5.55), CTO = V3(-5.05, -2.1, -6.7);
  const C7 = carrier([[-0.85, -1.6, -6.2], [-2.0, -1.3, -6.2], [-3.2, -1.0, -6.1], [-3.8, -0.75, -5.85], GEN, [-4.85, -0.85, -5.85], [-5.1, -1.35, -6.35], CTO, [-4.85, -2.75, -6.75], [-5.6, -3.15, -6.15], [-6.4, -3.45, -5.4]], 0.075, carM, ['ptp', 'smd']);
  // IX
  const JF = V3(-3.2, -2.75, -6.9), IG = V3(-3.45, -3.4, -6.75);
  const C9 = carrier([[-0.9, -2.45, -6.75], [-2.2, -2.6, -6.9], JF, IG, [-3.5, -4.6, -6.0], [-3.3, -5.8, -4.6], [-2.7, -6.4, -3.4]], 0.07, carM, ['otic']);
  // V: корешок, узел, V1 (слёзный), V2, скуловой, V3, язычный, ушно-височный
  const TG = V3(-2.4, 0.2, -4.5);
  carrier([[-1.15, -0.3, -5.55], [-1.8, -0.05, -5.0], TG], 0.13, vM, ['ptp', 'smd', 'otic', 'cil']);
  const TGm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), vM.clone()); TGm.scale.set(0.42, 0.24, 0.62); TGm.position.copy(TG); TGm.rotation.y = 0.5; scene.add(TGm); CAR.push({ m: TGm, rel: ['ptp', 'smd', 'otic', 'cil'], kind: 'v' });
  const LGP = V3(-4.35, 3.8, 1.4);
  const CLAC = carrier([[-2.2, 0.45, -4.1], [-1.95, 1.0, -3.8], [-1.65, 1.85, -3.2], [-1.75, 2.35, -2.5], [-2.5, 2.95, -1.4], [-3.2, 3.25, -0.4], [-3.9, 3.5, 0.6], [-4.2, 3.68, 1.15]], 0.05, vM, ['ptp'], 'v');
  const Z0 = V3(-2.55, 0.35, -1.7), PPG = V3(-2.35, -0.05, -2.05);
  carrier([TG, [-2.25, 0.2, -3.3], [-2.45, 0.28, -2.3], Z0, [-2.75, 0.65, -0.7], [-2.95, 0.6, 0.7], [-3.0, 0.1, 2.3]], 0.075, vM, ['ptp'], 'v');
  const CZYG = carrier([Z0, [-3.2, 1.0, -0.9], [-4.0, 1.7, -0.1], [-4.35, 2.7, 0.5], [-4.2, 3.4, 0.95]], 0.045, vM, ['ptp'], 'v');
  const V3T = V3(-2.8, -1.3, -4.35), FO = V3(-2.65, -0.45, -4.35);
  carrier([TG, [-2.6, -0.2, -4.4], FO, V3T], 0.1, vM, ['smd', 'otic'], 'v');
  const CLING = carrier([V3T, [-3.3, -2.8, -4.0], [-3.6, -4.6, -3.3], [-3.65, -6.2, -2.4], [-3.3, -7.15, -1.3], [-2.7, -7.45, -0.4], [-2.1, -7.5, 0.8], [-1.5, -7.2, 2.1], [-1.0, -6.8, 3.0]], 0.06, vM, ['smd'], 'v');
  const CAT = carrier([V3T, [-3.7, -1.65, -4.95], [-4.8, -1.9, -5.5], [-5.8, -1.85, -5.55], [-6.45, -0.9, -5.7], [-6.5, 0.8, -5.6], [-6.3, 2.6, -5.2]], 0.05, vM, ['otic'], 'v');
  // зрительный нерв, хиазма и тракт (для рефлекса на свет)
  const E = V3(-3.3, 2.4, 2.2), RE = 1.2, ONL = V3(0.25, 0, -0.97).normalize();
  const ONB = E.clone().addScaledVector(ONL, RE);
  const CON = carrier([ONB, [-2.45, 2.5, -0.2], [-1.55, 2.6, -1.7], [-0.6, 2.0, -2.8], [-0.05, 1.75, -3.15]], 0.17, mphys('#F2E6A0', { r: 0.6, em: 0.06 }), ['cil'], 'o');
  const COT = carrier([[-0.05, 1.75, -3.15], [-0.75, 1.8, -4.0], [-0.85, 1.75, -5.1], [-0.5, 1.65, -5.9], NUC.pre], 0.09, mphys('#F2E6A0', { r: 0.6, em: 0.06 }), ['cil'], 'o');

  // =================== ганглии и железы ===================
  const CG = V3(-2.38, 2.42, -0.9), SMG = V3(-2.75, -7.95, -0.8), OG = V3(-2.4, -1.3, -4.35);
  const GPOS = { cil: CG, ptp: PPG, smd: SMG, otic: OG };
  const GANM = {};
  HG_GAN.forEach((g) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mphys(g.col, { r: 0.4, cc: 0.4, em: 0.45 })); m.scale.setScalar(g.id === 'ptp' ? 0.24 : 0.19); m.position.copy(GPOS[g.id]); m.userData.pick = g.id; scene.add(m); pick.push(m); GANM[g.id] = m; });
  const smallG = (p, s, mat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mat); m.scale.setScalar(s); m.position.copy(p); scene.add(m); return m; };
  const genM = smallG(GEN, 0.15, carM.clone()), igM = smallG(IG, 0.15, carM.clone());
  CAR.push({ m: genM, rel: ['ptp', 'smd'], kind: 'n' }, { m: igM, rel: ['otic'], kind: 'n' });
  const lobe = (seed) => { const g = new THREE.SphereGeometry(1, 30, 22), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.07 * Math.sin(9 * x + seed) * Math.sin(8 * y + seed) + 0.05 * Math.sin(11 * z + y); p.setXYZ(i, x * k, y * k, z * k); } g.computeVertexNormals(); return g; };
  const GLD = {};   // железы: { ms: [meshes], m: material, g: ганглий }
  const gland = (id, g, parts, col = '#E8C49A') => { const m = mphys(col, { r: 0.65, em: 0.1, op: 0.8 }); const ms = parts.map(([p, s, ry = 0], k) => { const o = new THREE.Mesh(lobe(k + id.length), m); o.position.copy(p); o.scale.set(...s); o.rotation.y = ry; o.userData.pick = g; scene.add(o); pick.push(o); return o; }); GLD[id] = { ms, m, g }; return ms; };
  gland('lac', 'ptp', [[LGP, [0.75, 0.32, 0.5], 0.7]]);
  const PARP = V3(-6.9, -4.5, -4.9);
  gland('par', 'otic', [[PARP, [0.78, 1.8, 1.2]]]);
  gland('smd', 'smd', [[V3(-3.2, -9.65, -2.1), [0.85, 0.78, 1.3]], [V3(-2.75, -8.6, -1.25), [0.36, 0.3, 0.72]]]);
  gland('sl', 'smd', [[V3(-1.75, -7.55, 1.45), [0.36, 0.3, 1.0], 0.45]]);
  const ductM = mphys('#F0D8B0', { r: 0.5, em: 0.12 });
  const duct = (pts, r = 0.07) => { const m = new THREE.Mesh(new THREE.TubeGeometry(cr3(pts), 40, r, 6), ductM); scene.add(m); return m; };
  const PAP = V3(-3.95, -4.3, 1.0), CAR0 = V3(-0.35, -7.3, 2.85);
  const DUCTS = [duct([[-7.35, -3.6, -3.4], [-7.35, -3.7, -1.8], [-6.6, -3.8, -0.3], [-5.0, -4.05, 0.75], PAP]), duct([[-2.75, -8.5, -0.8], [-2.4, -8.0, 0.6], [-1.4, -7.6, 2.0], CAR0], 0.06)];
  // железы носа и нёба — гроздья мелких долек
  const nasG = mphys('#E8C49A', { r: 0.6, em: 0.1, op: 0.85 });
  const NASE = [V3(-0.75, 0.4, 0.4), V3(-0.8, -0.85, 0.8), V3(-1.3, -3.2, 1.2)];
  NASE.forEach((p) => { for (let k = 0; k < 7; k++) { const o = smallG(p.clone().add(V3((rnd() - 0.5) * 0.25, (rnd() - 0.5) * 0.35, (rnd() - 0.5) * 0.5)), 0.07 + 0.04 * rnd(), nasG); o.userData.pick = 'ptp'; pick.push(o); } });
  GLD.nas = { ms: [], m: nasG, g: 'ptp' };

  // =================== глаз ===================
  const scl = new THREE.Mesh(new THREE.SphereGeometry(RE, 40, 28), mphys('#F2EEE8', { r: 0.35, cc: 0.5, em: 0.06, k: 1 })); scl.position.copy(E); scene.add(scl);
  const IRG = new THREE.Group(); IRG.position.copy(E); scene.add(IRG);
  const irM = mphys('#5C88B8', { r: 0.4, cc: 0.6, em: 0.12, side: THREE.DoubleSide });
  const IRIS = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.6, 48, 1), irM); IRIS.position.z = 1.07; IRG.add(IRIS);
  const PUPd = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.DoubleSide })); PUPd.position.z = 1.06; IRG.add(PUPd);
  const corM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0, transparent: true, opacity: 0.12, clearcoat: 1, depthWrite: false });
  const COR = new THREE.Mesh(new THREE.SphereGeometry(0.66, 32, 16, 0, Math.PI * 2, 0, 1.1), corM); COR.rotation.x = Math.PI / 2; COR.position.z = 0.62; IRG.add(COR);
  let pupBuilt = -1;
  const buildPupil = () => { const r = Math.round(st.pup * 200) / 200; if (r === pupBuilt) return; pupBuilt = r; IRIS.geometry.dispose(); IRIS.geometry = new THREE.RingGeometry(r, 0.6, 48, 1); lupI.geometry.dispose(); lupI.geometry = new THREE.RingGeometry(Math.min(0.56, r * 1.55), 0.62, 64, 1); };
  // лупа: тот же глаз спереди, увеличенный, всегда лицом к камере (зрачок виден при любом виде)
  const LUP = new THREE.Group(); scene.add(LUP);
  const flat = (geo, col, z, ro, op = 1) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthTest: false, depthWrite: false, side: THREE.DoubleSide })); m.position.z = z; m.renderOrder = ro; return m; };
  LUP.add(flat(new THREE.CircleGeometry(1.14, 64), 0x0c1016, -0.02, 9, 0.9));                  // фон окна
  LUP.add(flat(new THREE.CircleGeometry(1.0, 64), 0xf2ede4, 0, 10));                         // склера
  const LIG = new THREE.Group(); LUP.add(LIG);
  LIG.add(flat(new THREE.CircleGeometry(0.62, 64), 0x050505, 0.01, 11));                     // зрачок (под радужкой)
  const LIRIS = flat(new THREE.RingGeometry(0.2, 0.62, 64, 1), 0x4f86c0, 0.02, 12); LIG.add(LIRIS);
  LIG.add(flat(new THREE.RingGeometry(0.6, 0.64, 64, 1), 0x2a4a70, 0.025, 13));               // кайма радужки
  const LGL = flat(new THREE.CircleGeometry(0.06, 16), 0xffffff, 0.03, 14, 0.85); LGL.position.set(0.14, 0.16, 0.03); LIG.add(LGL);   // блик
  LUP.add(flat(new THREE.RingGeometry(1.0, 1.12, 64, 1), 0x9fb4c8, 0.04, 15, 0.8));          // обод
  const lupI = LIRIS, lupOn = () => (st.mode === 'path' && st.sel === 'cil') || (st.mode === 'ref' && st.ref !== 'food') || (st.mode === 'dis' && st.dis === 'cn3');
  const LUPN = DK ? [-0.5, 0.0, 0.064] : [0.55, 0.5, 0.085];   // место на экране (NDC) и размер (доля расстояния)
  const placeLup = () => { const q = V3(LUPN[0], LUPN[1], 0.5).unproject(camera).sub(camera.position).normalize(); const D0 = 12; LUP.position.copy(camera.position).addScaledVector(q, D0); LUP.lookAt(camera.position); LUP.scale.setScalar(D0 * LUPN[2]); };
  // луч фонарика
  const beamM = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const TPOS = E.clone().add(V3(-2.2, 0.5, 2.6)), BDIR = TPOS.clone().sub(E).normalize(), BLEN = TPOS.distanceTo(E) - RE - 0.5;
  const BEAM = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.42, BLEN, 24, 1, true), beamM); BEAM.quaternion.setFromUnitVectors(V3(0, 1, 0), BDIR); BEAM.position.copy(E).addScaledVector(BDIR, RE + 0.05 + BLEN / 2); scene.add(BEAM);
  const TORCH = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.9, 16), mphys('#8A8F98', { r: 0.4, cc: 0.6, em: 0.05 })); TORCH.quaternion.setFromUnitVectors(V3(0, 1, 0), BDIR); TORCH.position.copy(TPOS).addScaledVector(BDIR, 0.1); scene.add(TORCH);

  // =================== сонная артерия, верхний шейный узел, аневризма ===================
  const icaM = mphys('#D05868', { r: 0.45, em: 0.12, op: 0.45 });
  const CICA = cr3([[-2.9, -11.2, -5.0], [-2.9, -7.0, -5.4], [-3.0, -3.6, -5.8], [-3.0, -2.6, -5.9], [-2.5, -1.95, -5.1], [-1.85, -1.35, -4.5], [-1.4, -0.3, -4.2], [-1.35, 0.5, -4.4], [-1.3, 0.75, -3.6], [-1.25, 1.25, -3.25], [-1.15, 1.75, -3.55]]);
  const ICA = new THREE.Mesh(new THREE.TubeGeometry(CICA, 120, 0.2, 10), icaM); scene.add(ICA);
  const PCOM = new THREE.Mesh(new THREE.TubeGeometry(cr3([[-1.25, 1.25, -3.3], [-1.0, 1.0, -4.1], [-0.65, 0.8, -5.0]]), 20, 0.08, 8), icaM); scene.add(PCOM);
  const ANE = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), mphys('#D03848', { r: 0.35, cc: 0.5, em: 0.3 })); ANE.position.set(-0.78, 0.82, -4.55); scene.add(ANE);
  const SCG = V3(-2.45, -7.6, -6.05);
  const scgM = mphys('#FF9A48', { r: 0.45, em: 0.35 });
  const SCGm = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), scgM); SCGm.scale.set(0.28, 0.95, 0.3); SCGm.position.copy(SCG); scene.add(SCGm);
  // повреждение VII и кожа щеки (сбои)
  const LES = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.045, 8, 24), new THREE.MeshBasicMaterial({ color: 0xff4050 })); LES.position.copy(C7.getPointAt(uOf(C7, V3(-3.55, -0.85, -5.95)))); LES.lookAt(LES.position.clone().add(C7.getTangentAt(uOf(C7, LES.position)))); scene.add(LES);
  const SKIN = V3(-8.3, -3.0, -3.3);
  const skinM = new THREE.MeshBasicMaterial({ color: 0xff8090, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const SKINm = new THREE.Mesh(new THREE.CircleGeometry(0.45, 40), skinM); SKINm.position.copy(SKIN); SKINm.rotation.y = -Math.PI / 2 + 0.25; scene.add(SKINm);

  // =================== пути: первые и вторые нейроны, чувствительные, симпатические ===================
  const PA = [];   // { id, g, k, m, base, flow, len }
  const KCOL = { aff: '#C8A8FF', sym: '#FF9A48' };
  const path = (id, g, k, pts, r) => {
    const c = cr3(pts), len = c.getLength(), seg = Math.max(24, Math.round(len * 10));
    const col = KCOL[k] || (k === 'post' ? new THREE.Color(GC[g]).lerp(new THREE.Color(0xffffff), 0.3).getStyle() : GC[g]);
    let base = null;
    if (k !== 'aff') { base = new THREE.Mesh(new THREE.TubeGeometry(c, seg, r, 8), mphys(col, { r: 0.45, em: 0.3 })); base.userData.pick = g; scene.add(base); pick.push(base); }
    const fm = flowTubeMat(col, 0.5, Math.max(1, len * 0.45)); fm.uniforms.uSpeed.value = 0.5 / Math.max(1, len * 0.2);
    const flow = new THREE.Mesh(new THREE.TubeGeometry(c, seg, r * (k === 'aff' ? 1.6 : 1.35), 8), fm); flow.renderOrder = 6; scene.add(flow);
    const o = { id, g, k, c, base, flow, fm, len, col: new THREE.Color(col) }; PA.push(o); return o;
  };
  const stemTo = (n, ex) => [NUC[n], NUC[n].clone().lerp(ex, 0.5).add(V3(-0.05, 0, 0.05)), ex];
  // ресничный
  const uC3e = uOf(C3, V3(-1.95, 2.2, -1.7));
  path('c_pre', 'cil', 'pre', join(stemTo('ew', V3(-0.45, 0.75, -5.0)), S(C3, 0, uC3e), [V3(-2.1, 2.3, -1.3), CG]), 0.085);
  [[0.24, 0.05], [0.1, 0.22], [-0.08, -0.18], [0.3, -0.16]].forEach(([dx, dy], k) => { const d = ONL.clone().add(V3(dx - 0.12, dy, 0)).normalize(), e = E.clone().addScaledVector(d, RE + 0.02), e2 = E.clone().addScaledVector(d, RE + 0.35); path('c_post' + k, 'cil', 'post', [CG, CG.clone().lerp(e2, 0.5).add(V3(-0.05, 0, 0)), e2, e], 0.04); });
  // крылонёбный
  const uGEN = uOf(C7, GEN), uCTO = uOf(C7, CTO);
  const GPN = [GEN, V3(-3.8, -0.45, -5.0), V3(-2.9, -0.55, -4.5), V3(-2.0, -0.95, -4.1), V3(-2.05, -0.6, -3.2), PPG];
  const PPRE = join(stemTo('ssn', V3(-0.85, -1.6, -6.2)), S(C7, 0, uGEN), GPN);
  path('p_pre', 'ptp', 'pre', PPRE, 0.085);
  const uZe = uOf(CZYG, V3(-4.2, 3.4, 0.95));
  path('p_lac', 'ptp', 'post', join([PPG, V3(-2.48, 0.2, -1.85)], S(CZYG, 0, uZe), [V3(-4.25, 3.6, 1.15), LGP]), 0.06);
  path('p_nas', 'ptp', 'post', [PPG, V3(-1.6, 0.05, -1.85), V3(-0.9, 0.2, -0.9), NASE[0]], 0.05);
  path('p_nas2', 'ptp', 'post', [V3(-1.6, 0.05, -1.85), V3(-0.95, -0.5, -0.6), NASE[1]], 0.045);
  path('p_pal', 'ptp', 'post', [PPG, V3(-2.3, -1.2, -1.8), V3(-2.1, -2.6, -1.2), V3(-1.75, -3.1, 0.0), NASE[2]], 0.05);
  // поднижнечелюстной
  const LJ = CLING.getPointAt(uOf(CLING, V3(-3.3, -2.8, -4.0))), uLJ = uOf(CLING, LJ), uLS = uOf(CLING, V3(-2.75, -7.45, -0.5));
  const CT = [CTO, V3(-5.3, -1.5, -6.2), V3(-5.15, -1.15, -5.7), V3(-4.55, -1.55, -5.0), V3(-3.95, -2.55, -4.4), LJ];
  const SPRE = join(stemTo('ssn', V3(-0.85, -1.6, -6.2)), S(C7, 0, uCTO, 40), CT, S(CLING, uLJ, uLS, 30), [SMG]);
  path('s_pre', 'smd', 'pre', SPRE, 0.085);
  path('s_post', 'smd', 'post', [SMG, V3(-2.75, -8.3, -1.0), V3(-2.75, -8.55, -1.3)], 0.05);
  path('s_post2', 'smd', 'post', join([SMG, V3(-2.5, -7.65, -0.3)], S(CLING, uOf(CLING, V3(-2.3, -7.5, 0.5)), uOf(CLING, V3(-1.9, -7.45, 1.2)), 6), [V3(-1.8, -7.55, 1.25)]), 0.045);
  // ушной
  const TYM = [IG, V3(-4.1, -2.55, -6.55), V3(-4.75, -1.55, -6.15), V3(-4.6, -0.75, -5.75), V3(-4.15, -0.35, -5.3), V3(-3.4, -0.3, -4.85), FO.clone().add(V3(0.15, 0, 0.05)), OG];
  const uJF = uOf(C9, IG);
  path('o_pre', 'otic', 'pre', join(stemTo('isn', V3(-0.9, -2.45, -6.75)), S(C9, 0, uJF), TYM), 0.085);
  const uATp = uOf(CAT, V3(-5.8, -1.85, -5.55));
  path('o_post', 'otic', 'post', join([OG, V3(-2.75, -1.4, -4.45)], S(CAT, uOf(CAT, V3(-3.7, -1.65, -4.95)), uATp, 20), [V3(-6.4, -2.6, -5.2), V3(-6.8, -3.5, -5.0)]), 0.06);
  // чувствительные (рефлексы): свет — по зрительному пути к претектальному ядру; вкус — по струне и IX к ядру одиночного пути
  path('a_light', 'cil', 'aff', join(S(CON, 0, 1, 30), S(COT, 0, 1, 30), [NUC.ew]), 0.17);
  const uLT = uOf(CLING, V3(-1.5, -7.2, 2.1));
  path('a_taste', 'smd', 'aff', join(rev(S(CLING, uLJ, uLT, 30)), rev(CT), rev(S(C7, 0, uCTO, 40)), [V3(-0.6, -1.7, -6.9), NUC.nts]), 0.085);
  path('a_ix', 'otic', 'aff', join(rev(S(C9, 0, 1, 40)), [NUC.nts]), 0.075);
  // симпатические: ствол → верхний шейный узел → сплетение на сонной → глазница (транзитом через ресничный) и глубокий каменистый
  const uCav = uOf(CICA, V3(-1.3, 0.75, -3.6)), uLac = uOf(CICA, V3(-1.85, -1.35, -4.5)), uSc = uOf(CICA, V3(-2.9, -6.4, -5.5));
  path('y_trunk', 'sym', 'sym', [V3(-2.35, -11.4, -6.3), V3(-2.4, -9.5, -6.15), SCG.clone().add(V3(0, -0.9, 0))], 0.07);
  path('y_ica', 'sym', 'sym', join([SCG.clone().add(V3(0, 0.9, 0)), V3(-2.75, -6.3, -5.7)], S(CICA, uSc, uCav, 60)), 0.24);
  path('y_eye', 'sym', 'sym', join([CICA.getPointAt(uCav), V3(-1.5, 1.4, -3.3), V3(-1.75, 2.2, -2.6), V3(-2.1, 2.35, -1.6), CG, V3(-2.6, 2.6, -0.2), E.clone().addScaledVector(V3(-0.35, 0.3, -0.89).normalize(), RE + 0.02)]), 0.045);
  path('y_dp', 'sym', 'sym', [CICA.getPointAt(uLac), V3(-1.95, -1.1, -4.2), V3(-2.0, -0.95, -4.1)], 0.05);
  // сбои: ошибочно проросшие волокна
  path('m_croc', 'smd', 'pre', PPRE.map((p) => p.clone().add(V3(0.01, 0.01, 0))), 0.1);
  path('m_frey', 'otic', 'post', join([OG, V3(-2.75, -1.4, -4.45)], S(CAT, uOf(CAT, V3(-3.7, -1.65, -4.95)), uATp, 20), [V3(-6.9, -2.3, -5.0), V3(-7.8, -2.7, -4.2), SKIN.clone().add(V3(0.05, 0, 0))]), 0.06);
  [[0.3, 0.6], [-0.6, 0.3], [0.1, -0.7]].forEach(([dy, dz], k) => path('m_frey' + k, 'otic', 'post', [V3(-7.8, -2.7, -4.2), V3(-8.05, -2.9 + dy * 0.3, -3.9 + dz * 0.3), SKIN.clone().add(V3(0.05, dy * 0.6, dz * 0.6))], 0.035));
  const P = Object.fromEntries(PA.map((p) => [p.id, p]));

  // =================== частицы: слёзы, слюна, пот ===================
  const NPT = 90, PTM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xa8e4ff, transparent: true, opacity: 0.95 }), NPT); PTM.frustumCulled = false; PTM.renderOrder = 7; scene.add(PTM);
  const onEyeD = (x, y, z, r = RE + 0.05) => E.clone().addScaledVector(V3(x, y, z).normalize(), r);
  const FLW = {
    tear: cr3([onEyeD(-0.6, 0.55, 0.58), onEyeD(-0.3, 0.32, 0.9), onEyeD(0.15, 0.05, 0.99), onEyeD(0.5, -0.22, 0.84), E.clone().add(V3(0.45, -1.05, 1.05)), E.clone().add(V3(0.2, -2.6, 1.4))]),
    sub: cr3([CAR0, CAR0.clone().add(V3(-0.1, 0.45, 0.3)), CAR0.clone().add(V3(-0.5, 0.9, -0.2)), CAR0.clone().add(V3(-0.9, 1.0, -0.9))]),
    par: cr3([PAP, PAP.clone().add(V3(0.6, -0.3, 0.2)), PAP.clone().add(V3(1.3, -0.7, 0.3)), PAP.clone().add(V3(1.7, -1.3, 0.2))]),
    sweat: cr3([SKIN.clone().add(V3(-0.08, 0.45, 0.1)), SKIN.clone().add(V3(-0.1, -0.15, 0.15)), SKIN.clone().add(V3(-0.1, -0.8, 0.2)), SKIN.clone().add(V3(-0.1, -1.6, 0.25))]),
  };
  const trailM = new THREE.MeshBasicMaterial({ color: 0x9fdcff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const TRAIL = new THREE.Mesh(new THREE.TubeGeometry(cr3(S(FLW.tear, 0.55, 1, 12)), 30, 0.14, 6), trailM); scene.add(TRAIL);
  const PRT = Array.from({ length: NPT }, (_, i) => ({ f: ['tear', 'sub', 'par', 'sweat'][i % 4], u: rnd(), live: false, sp: 0.7 + 0.6 * rnd() }));
  const dum = new THREE.Object3D();

  // =================== виды ===================
  const VP = DK ? {
    all: [V3(-3.0, -3.0, -1.8), V3(-1, 0.08, 0.15), 38, 4.5, -0.8],
    cil: [V3(-1.9, 1.9, -1.8), V3(-1, 0.25, 0.2), 22, 3.4, -0.4],
    ptp: [V3(-2.6, 1.0, -1.5), V3(-1, 0.18, 0.18), 24, 3.8, -0.4],
    smd: [V3(-3.0, -4.3, -2.3), V3(-1, 0.1, 0.2), 32, 3.6, -0.8],
    otic: [V3(-4.0, -2.2, -4.6), V3(-1, 0.15, 0.12), 27, 3.6, -0.6],
    eye: [V3(-1.9, 1.8, -1.1), V3(-1, 0.22, 0.5), 22, 3.4, -0.4],
    fear: [V3(-2.5, -3.2, -2.6), V3(-1, 0.12, 0.22), 40, 4.2, -0.8],
    frey: [V3(-5.0, -1.7, -3.7), V3(-1, 0.12, 0.2), 24, 3.4, -0.5],
  } : {
    all: [V3(-3.0, -3.2, -1.8), V3(-1, 0.1, 0.22), 38, 0, 0],
    cil: [V3(-1.9, 1.9, -2.2), V3(-0.8, 0.32, 0.55), 17, 0, 0],
    ptp: [V3(-2.8, 1.0, -2.2), V3(-1, 0.18, 0.18), 22, 0, 0],
    smd: [V3(-3.0, -3.9, -2.2), V3(-1, 0.1, 0.25), 34, 0, 0],
    otic: [V3(-3.8, -2.0, -4.0), V3(-1, 0.15, 0.12), 22, 0, 0],
    eye: [V3(-2.0, 1.2, -2.0), V3(-1, 0.22, 0.5), 27, 0, 0],
    fear: [V3(-2.6, -3.6, -3.2), V3(-1, 0.12, 0.3), 36, 0, 0],
    frey: [V3(-4.6, -3.0, -4.4), V3(-1, 0.12, 0.2), 22, 0, 0],
  };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const curView = () => {
    if (st.mode === 'path') return st.sel || 'all';
    if (st.mode === 'ref') return st.ref === 'light' ? 'eye' : st.ref === 'food' ? 'smd' : 'fear';
    return st.dis === 'cn3' ? 'eye' : st.dis === 'croc' ? 'ptp' : 'frey';
  };
  function applyView() { st.fly = VIEW[curView()]; }
  camera.position.copy(VIEW.all.pos); controls.target.copy(VIEW.all.target);

  // =================== активность путей ===================
  const DIMC = new THREE.Color(0x4a4e58), WHITE = new THREE.Color(0xffffff);
  const win = (t, a, d = 0.6) => sm((t - a) / d);   // включение волны с задержкой a
  // уровень каждого пути: lit — цвет (0 серый … 1 свой), fl — бегущие импульсы
  function level(p) {
    const t = st.rt, M = st.mode;
    if (M === 'path') {
      if (p.k === 'aff' || p.id.startsWith('m_')) return [0, 0, false];
      if (p.k === 'sym') return st.sym ? [1, 1, true] : [0, 0, false];
      const on = !st.sel || p.g === st.sel; return [on ? 1 : 0.15, on ? (st.sel ? 1 : 0.65) : 0, true];
    }
    if (M === 'ref') {
      if (p.id.startsWith('m_')) return [0, 0, false];
      if (st.ref === 'light') {
        const ph = t % 9;   // 0–6 с свет горит, 6–9 темно
        if (p.id === 'a_light') return [1, ph < 6 ? win(ph, 0.4) : 0, true];
        if (p.g === 'cil' && p.k !== 'aff') return [1, ph < 6 ? win(ph, p.k === 'pre' ? 1.6 : 2.6) : 0, true];
        if (p.k === 'aff' || p.k === 'sym') return [0, 0, false];
        return [0.15, 0, true];
      }
      if (st.ref === 'food') {
        if (p.id === 'a_taste' || p.id === 'a_ix') return [1, win(t, 0.3), true];
        if (p.g === 'smd' || p.g === 'otic') return [1, win(t, p.k === 'pre' ? 1.6 : 2.6), true];
        if (p.k === 'aff' || p.k === 'sym') return [0, 0, false];
        return [0.15, 0, true];
      }
      if (p.k === 'sym') return [1, win(t, p.id === 'y_trunk' ? 0.2 : p.id === 'y_ica' ? 1.0 : 2.0), true];
      if (p.k === 'aff') return [0, 0, false];
      return [0.15, 0.04, true];
    }
    // сбои
    if (p.k === 'aff' || p.k === 'sym') return [0, 0, false];
    if (st.dis === 'cn3') { if (p.g === 'cil') return [p.k === 'pre' ? 0.55 : 0.3, 0, true]; return p.id.startsWith('m_') ? [0, 0, false] : [0.15, 0, true]; }
    if (st.dis === 'croc') {
      if (p.id === 'm_croc' || p.id === 'p_lac') return [1, win(t, p.k === 'pre' ? 0.4 : 1.4), true];
      if (p.id === 's_pre') return [0.35, 0, true];
      return p.id.startsWith('m_') ? [0, 0, false] : [0.15, 0, true];
    }
    if (p.id.startsWith('m_frey') || p.id === 'o_pre') return [1, win(t, p.k === 'pre' ? 0.4 : 1.4), true];
    if (p.id === 'o_post') return [0, 0, false];
    return p.id.startsWith('m_') ? [0, 0, false] : [0.15, 0, true];
  }
  // какие ганглии/железы/несущие нервы «в деле»
  const relOn = (rel) => {
    if (st.mode === 'path') return !st.sel || rel.includes(st.sel);
    if (st.mode === 'ref') return st.ref === 'light' ? rel.includes('cil') : st.ref === 'food' ? rel.includes('smd') || rel.includes('otic') : false;
    return st.dis === 'cn3' ? rel.includes('cil') : st.dis === 'croc' ? rel.includes('ptp') || rel.includes('smd') : rel.includes('otic');
  };
  function colorAll() {
    PA.forEach((p) => {
      const [lit, , vis] = level(p);
      if (p.base) { p.base.visible = vis; const m = p.base.material; m.color.copy(p.col).multiplyScalar(0.9).lerp(DIMC, 1 - lit); m.emissive.copy(p.col); m.emissiveIntensity = 0.32 * lit; if (st.mode === 'dis' && st.dis === 'cn3' && p.g === 'cil') { m.color.lerp(new THREE.Color('#E05060'), 0.35); } }
      p.flow.visible = vis;
    });
    CAR.forEach(({ m, rel, kind }) => { const on = relOn(rel) || (kind === 'o' && st.mode === 'ref' && st.ref === 'light'); const mm = m.material; if (!mm.userData.c0) mm.userData.c0 = mm.color.clone(); mm.color.copy(mm.userData.c0); if (!on) mm.color.lerp(DIMC, 0.65); setOp(mm, on ? 1 : 0.45); });
    HG_GAN.forEach((g) => { const on = relOn([g.id]), m = GANM[g.id].material; m.color.copy(new THREE.Color(g.col)).multiplyScalar(0.9); if (!on) m.color.lerp(DIMC, 0.7); m.emissiveIntensity = on ? (st.mode === 'path' && st.sel === g.id ? 0.7 : 0.45) : 0.05; });
    Object.entries(GLD).forEach(([id, G]) => { const on = relOn([G.g]) || (id === 'lac' && st.mode === 'dis' && st.dis === 'croc'); G.m.userData.on = on; setOp(G.m, id === 'par' && st.mode === 'dis' && st.dis === 'frey' ? 0.3 : on ? (id === 'par' ? 0.28 : 0.7) : (id === 'par' ? 0.1 : 0.2)); });
    const symV = (st.mode === 'path' && st.sym) || (st.mode === 'ref' && st.ref === 'fear');
    ICA.visible = symV || (st.mode === 'dis' && st.dis === 'cn3'); SCGm.visible = symV;
    PCOM.visible = ANE.visible = st.mode === 'dis' && st.dis === 'cn3';
    LES.visible = st.mode === 'dis' && st.dis === 'croc';
    SKINm.visible = st.mode === 'dis' && st.dis === 'frey';
    BEAM.visible = TORCH.visible = st.mode === 'ref' && st.ref === 'light';
    Object.values(NUCG).forEach((n) => { n.core.visible = n.spr.visible = true; });
    NUCG.nts.core.visible = NUCG.nts.spr.visible = st.mode === 'ref' && st.ref === 'food';
    NUCG.pre.core.visible = NUCG.pre.spr.visible = st.mode === 'ref' && st.ref === 'light';
    DUCTS.forEach((d) => { d.visible = !(st.mode === 'dis' && st.dis === 'frey') || d !== DUCTS[0]; });
  }

  // =================== анимация ===================
  function targets() {
    let pup = 0.2, yaw = 0, pitch = 0, tear = 0.08, sal = 0.15, sub = 0.15, par = 0.08, sweat = 0;
    const t = st.rt;
    if (st.mode === 'path') { if (st.sel === 'cil') pup = 0.14; if (st.sel === 'ptp') tear = 0.6; if (st.sel === 'smd') sub = 0.7; if (st.sel === 'otic') par = 0.7; }
    else if (st.mode === 'ref') {
      if (st.ref === 'light') { const ph = t % 9; pup = ph < 6 ? 0.2 - 0.085 * win(ph, 3.0, 0.8) : 0.2; }
      else if (st.ref === 'food') { const w = win(t, 3.0, 1.2); sub = 0.15 + 0.75 * w; par = 0.08 + 0.85 * w; sal = 0.15 + 0.85 * w; }
      else { const w = win(t, 2.6, 1.0); pup = 0.2 + 0.14 * w; sub = 0.15 * (1 - w) + 0.02; par = 0.08 * (1 - w); sal = 0.15 - 0.1 * w; }
    } else {
      if (st.dis === 'cn3') { pup = 0.36; yaw = -0.38; pitch = 0.3; }
      if (st.dis === 'croc') { const w = win(t, 2.2, 1.0); tear = 0.08 + 0.92 * w; sub = 0.15; sal = 0.4; }
      if (st.dis === 'frey') { const w = win(t, 2.2, 1.0); sweat = w; par = 0; }
    }
    return { pup, yaw, pitch, tear, sal, sub, par, sweat };
  }
  const rate = { tear: 0, sub: 0, par: 0, sweat: 0 };
  function update(dt) {
    st.t += dt; st.rt += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    PA.forEach((p) => { const [, fl, vis] = level(p); if (!vis) return; p.fm.uniforms.uTime.value = st.t; p.fm.uniforms.uOn.value += (fl - p.fm.uniforms.uOn.value) * Math.min(1, dt * 5); });
    const T = targets(), k = 1 - Math.exp(-dt * 2.6);
    st.pup += (T.pup - st.pup) * k; st.yaw += (T.yaw - st.yaw) * k; st.pitch += (T.pitch - st.pitch) * k; st.sal += (T.sal - st.sal) * k;
    ['tear', 'sub', 'par', 'sweat'].forEach((f) => { rate[f] += (T[f] - rate[f]) * k; });
    buildPupil(); IRG.rotation.set(st.pitch, st.yaw, 0); LIG.position.set(0.5 * Math.sin(st.yaw), -0.5 * Math.sin(st.pitch), 0); LUP.visible = lupOn(); if (LUP.visible) placeLup();
    if (BEAM.visible) { const ph = st.rt % 9; beamM.opacity = ph < 6 ? 0.16 * win(ph, 0.1, 0.3) : 0; }
    trailM.opacity = 0.35 * cl((rate.tear - 0.3) / 0.5);
    if (SKINm.visible) skinM.opacity = 0.14 * rate.sweat;
    // железы светятся в цвет своего узла, когда работают
    const act = { lac: rate.tear, par: rate.par, smd: rate.sub, sl: rate.sub, nas: st.mode === 'path' && st.sel === 'ptp' ? 0.6 : 0.05 };
    Object.entries(GLD).forEach(([id, G]) => { const a = G.m.userData.on ? act[id] : 0; G.m.emissive.copy(new THREE.Color('#E8C49A')).lerp(new THREE.Color(GC[G.g]), cl(a)); G.m.emissiveIntensity = 0.08 + 0.5 * cl(a); });
    // частицы
    let n = 0;
    PRT.forEach((q) => {
      const r = rate[q.f]; if (!q.live && rnd() < r * dt * 2.2) { q.live = true; q.u = 0; }
      if (q.live) { q.u += dt * q.sp * (q.f === 'sweat' ? 0.17 : q.f === 'tear' ? 0.32 : 0.45); if (q.u >= 1) q.live = false; }
      dum.position.copy(FLW[q.f].getPointAt(cl(q.u))); dum.scale.setScalar(q.live ? (q.f === 'tear' ? 1.8 : q.f === 'sweat' ? 1.4 : 1) * (1 - 0.5 * q.u) : 0.0001); dum.updateMatrix(); PTM.setMatrixAt(n++, dum.matrix);
    });
    PTM.instanceMatrix.needsUpdate = true;
  }

  // =================== выбор ===================
  function setMode(m) { st.mode = m; st.sel = null; st.rt = 0; colorAll(); applyView(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setSel(id) { st.sel = id === 'all' || st.sel === id ? null : id; colorAll(); applyView(); refs.gseg && refs.gseg.sync(); refs.setInfo && refs.setInfo(); }
  function setRef(id) { st.ref = id; st.rt = 0; colorAll(); applyView(); refs.rseg && refs.rseg.sync(); refs.setInfo && refs.setInfo(); }
  function setDis(id) { st.dis = id; st.rt = 0; colorAll(); applyView(); refs.dseg && refs.dseg.sync(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => pick.filter((m) => m.visible !== false), (id) => { if (st.mode === 'path' && GPOS[id]) setSel(id); });

  // =================== подписи ===================
  const MOBC = !DK;
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const pM = () => st.mode === 'path', gOn = (g, dk) => () => pM() && (st.sel === g || (!st.sel && (!dk || DK)));
  const rM = (r) => () => st.mode === 'ref' && st.ref === r, dM = (d) => () => st.mode === 'dis' && st.dis === d;
  const at = (c, p) => () => c.getPointAt(uOf(c, p));
  const labels = [
    lb('ciliary ganglion', () => CG.clone().add(V3(0, 0.25, 0)), GC.cil, () => gOn('cil')() || rM('light')() || dM('cn3')(), true),
    lb('pterygopalatine ganglion', () => PPG.clone().add(V3(0, -0.3, 0)), GC.ptp, () => gOn('ptp')() || dM('croc')()),
    lb('submandibular ganglion', () => SMG.clone(), GC.smd, () => gOn('smd')() || rM('food')(), true),
    lb('otic ganglion', () => OG.clone().add(V3(0, -0.2, 0)), GC.otic, () => gOn('otic')() || rM('food')() || dM('frey')(), true),
    lb('accessory nucleus of III', () => NUC.ew.clone().add(V3(0, -0.3, 0)), GC.cil, () => (pM() && st.sel === 'cil') || rM('light')() || dM('cn3')()),
    lb('superior salivatory nucleus', () => NUC.ssn.clone(), '#B8E890', () => (pM() && (st.sel === 'ptp' || st.sel === 'smd')) || dM('croc')(), true),
    lb('inferior salivatory nucleus', () => NUC.isn.clone(), GC.otic, () => (pM() && st.sel === 'otic') || dM('frey')()),
    lb('solitary nucleus', () => NUC.nts.clone(), '#C8A8FF', rM('food')),
    lb('pretectal nucleus', () => NUC.pre.clone().add(V3(0, DK ? 0 : 0.4, 0)), '#C8A8FF', rM('light')),
    lb('brainstem', () => STEMC.getPointAt(0.5).add(V3(0, 0, -1.0)), '#D8C8D0', () => (pM() && !st.sel && DK), true),
    lb('oculomotor nerve (III)', at(C3, V3(-1.35, 1.65, -3.6)), '#E8E0C8', () => (pM() && st.sel === 'cil') || (dM('cn3')() && DK)),
    lb('facial nerve (VII)', at(C7, V3(-1.5, -1.45, -6.2)), '#E8E0C8', () => (pM() && (st.sel === 'ptp' || st.sel === 'smd')) || dM('croc')(), true),
    lb('glossopharyngeal nerve (IX)', at(C9, V3(-3.3, -3.0, -6.85)), '#E8E0C8', () => (pM() && st.sel === 'otic') || rM('food')(), true),
    lb('genu of VII', () => GEN.clone().add(V3(0, 0.2, 0)), '#E8E0C8', () => (pM() && st.sel === 'ptp') || dM('croc')()),
    lb('greater petrosal nerve', () => GPN[2].clone(), GC.ptp, () => (pM() && st.sel === 'ptp') || dM('croc')()),
    lb('nerve of pterygoid canal', () => GPN[4].clone().add(V3(0, 0.5, 0)), GC.ptp, () => pM() && st.sel === 'ptp' && DK, true),
    lb('chorda tympani', () => CT[3].clone(), GC.smd, () => (pM() && st.sel === 'smd') || rM('food')()),
    lb('tympanic nerve', () => TYM[2].clone(), GC.otic, () => pM() && st.sel === 'otic', true),
    lb('lesser petrosal nerve', () => TYM[5].clone(), GC.otic, () => pM() && st.sel === 'otic'),
    lb('trigeminal ganglion', () => TG.clone().add(V3(0, 0.3, 0)), '#C8B8F0', () => pM() && !st.sel && DK),
    lb('zygomatic nerve (V₂)', at(CZYG, V3(-4.0, 1.7, -0.1)), '#C8B8F0', () => pM() && st.sel === 'ptp', true),
    lb('lacrimal nerve (V₁)', at(CLAC, V3(-3.2, 3.25, -0.4)), '#C8B8F0', () => pM() && st.sel === 'ptp' && DK),
    lb('lingual nerve (V₃)', at(CLING, V3(-3.65, -6.2, -2.4)), '#C8B8F0', () => (pM() && st.sel === 'smd') || rM('food')(), true),
    lb('auriculotemporal nerve (V₃)', at(CAT, V3(-6.45, -0.9, -5.7)), '#C8B8F0', () => (pM() && st.sel === 'otic') || dM('frey')()),
    lb('lacrimal gland', () => LGP.clone().add(V3(0, 0.35, 0)), '#F0D8B0', () => gOn('ptp', true)() || dM('croc')()),
    lb('nasal glands', () => NASE[0].clone().add(V3(0, 0.25, 0)), '#F0D8B0', () => pM() && st.sel === 'ptp'),
    lb('palatine glands', () => NASE[2].clone(), '#F0D8B0', () => pM() && st.sel === 'ptp' && DK),
    lb('parotid gland', () => PARP.clone().add(V3(-0.6, -1.0, 0)), '#F0D8B0', () => gOn('otic', true)() || rM('food')()),
    lb('submandibular gland', () => V3(-3.4, -10.2, -2.3), '#F0D8B0', () => gOn('smd', true)() || rM('food')(), true),
    lb('sublingual gland', () => V3(-1.75, -7.75, 1.9), '#F0D8B0', () => (pM() && st.sel === 'smd') || (rM('food')() && DK)),
    lb('pupil', () => LUP.position.clone().add(V3(0, 1, 0).applyQuaternion(camera.quaternion).multiplyScalar(-LUP.scale.x * 1.3)), '#C8E4FF', () => LUP.visible),
    lb('optic nerve', at(CON, V3(-2.45, 2.5, -0.2)), '#F2E6A0', () => rM('light')() && DK, true),
    lb('superior cervical ganglion', () => SCG.clone(), '#FFB070', () => rM('fear')() || (pM() && st.sym), true),
    lb('internal carotid artery', () => CICA.getPointAt(0.18), '#F08A8A', () => rM('fear')() || dM('cn3')(), true),
    lb('aneurysm', () => ANE.position.clone().add(V3(0, -0.35, 0)), '#FF8A8A', dM('cn3'), true),
    lb('lesion', () => LES.position.clone().add(V3(0, -0.45, 0)), '#FF8A8A', dM('croc'), true),
    lb('misrouted fibers', () => GPN[3].clone(), GC.smd, dM('croc'), true),
    lb('cheek skin', () => SKIN.clone().add(V3(0, -0.75, 0.3)), '#FF9AA8', dM('frey')),
    lb('gland remnant', () => PARP.clone().add(V3(-0.2, -0.4, 0)), '#F0D8B0', dM('frey'), true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>Four parasympathetic ganglia</b> of the head — ciliary, pterygopalatine, submandibular, and otic. In them, fibers from brainstem nuclei carried by nerves III, VII, and IX synapse. The first neuron (thick line) runs from the nucleus to the ganglion, the second (thin) from the ganglion to a muscle or gland along branches of the trigeminal nerve (V). Choose a ganglion.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'path') { const g = HG_GAN.find((x) => x.id === st.sel); ib.info.innerHTML = g ? g.text : INTRO; return; }
      if (st.mode === 'ref') { ib.info.innerHTML = HG_REF.find((r) => r.id === st.ref).text; return; }
      ib.info.innerHTML = HG_DIS.find((d) => d.id === st.dis).text;
    };
    refs.modeSeg = seg([{ id: 'path', label: 'Ganglia' }, { id: 'ref', label: 'Reflexes' }, { id: 'dis', label: 'Disorders' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.gseg = refs.rseg = refs.dseg = null;
      if (st.mode === 'path') {
        refs.gseg = seg([{ id: 'all', label: 'All' }, ...HG_GAN.map((g) => ({ id: g.id, label: g.name, color: g.col }))], () => st.sel || 'all', (v) => setSel(v));
        box.append(h('div', { class: 'glabel' }, 'Ganglion', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.gseg));
        view.append(toggle('Sympathetic', () => st.sym, (v) => { st.sym = v; colorAll(); }));
      } else if (st.mode === 'ref') {
        refs.rseg = seg(HG_REF.map((r) => ({ id: r.id, label: r.name, color: r.col })), () => st.ref, (v) => setRef(v));
        box.append(h('div', { class: 'glabel' }, 'Reflex'), h('div', { class: 'gctl' }, refs.rseg, button('Restart', () => { st.rt = 0; })));
      } else {
        refs.dseg = seg(HG_DIS.map((d) => ({ id: d.id, label: d.name, color: d.col })), () => st.dis, (v) => setDis(v));
        box.append(h('div', { class: 'glabel' }, 'Disorder'), h('div', { class: 'gctl' }, refs.dseg));
      }
      view.append(refs.rot, refs.lab);
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'View', h('kbd', {}, 'R · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['path', 'ref', 'dis'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'path') setSel('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    return false;
  }
  const dec = (x) => x.toFixed(1).replace('.', LANG === 'ru' ? ',' : '.');
  const pupMM = () => dec(st.pup * 20);
  function stats() {
    if (st.mode === 'path') {
      if (st.sel === 'cil') return [['Pupil', pupMM(), 'mm'], ['Ganglion size', '≈ 2', 'mm']];
      if (st.sel === 'ptp') return [['Tears', '≈ 1', 'µL/min'], ['Ganglion size', '3–5', 'mm']];
      if (st.sel === 'smd') return [['Share of resting saliva', '≈ 70', '%'], ['Glands', '2', '']];
      if (st.sel === 'otic') return [['Share of saliva with food', '≈ 50', '%'], ['Nerves', 'IX → V₃', '']];
      return [['Ganglia', '4', 'pairs'], ['Nerves', 'III, VII, IX', '']];
    }
    if (st.mode === 'ref') {
      if (st.ref === 'light') return [['Pupil', pupMM(), 'mm'], ['Delay', '≈ 0.2', 's']];
      const sal = st.ref === 'food' ? 0.3 + 1.7 * cl((st.sal - 0.15) / 0.85) : 0.3 * cl(st.sal / 0.15);
      if (st.ref === 'food') return [['Saliva', dec(sal), 'mL/min']];
      return [['Pupil', pupMM(), 'mm'], ['Saliva', dec(sal), 'mL/min']];
    }
    if (st.dis === 'cn3') return [['Pupil', pupMM(), 'mm'], ['To light', 'no constriction', '']];
    if (st.dis === 'croc') return [['Tears', 'with food', '']];
    return [['Cheek sweat', 'with food', '']];
  }
  const self = {
    labelBg: true, mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'path' ? (st.sel ? GC[st.sel] : '#7FE0A0') : st.mode === 'ref' ? HG_REF.find((r) => r.id === st.ref).col : HG_DIS.find((d) => d.id === st.dis).col; },
    kicker: 'Brain · structure', title: 'Parasympathetic Ganglia of the Head',
    lede: 'The pupil narrows in bright light, tears and saliva flow — all without our will. This is run by four small ganglia: fibers from the brainstem synapse in them and reach the eye and glands by borrowing other nerves.',
    notes: `
      <div><h2>Structure</h2>
        <p>In the head, the parasympathetic division has four pairs of ganglia, and their nuclei lie in the brainstem: the accessory oculomotor nucleus → ciliary ganglion; the superior salivatory nucleus (with the lacrimal nucleus) → via nerve VII to the pterygopalatine and submandibular ganglia; the inferior salivatory nucleus → via nerve IX to the otic ganglion. The vagus nerve (X) is parasympathetic too, but its ganglia lie in the walls of the organs of the neck, chest, and abdomen.</p>
        <p>Each ganglion is attached to a branch of the trigeminal nerve. Sensory fibers of V and sympathetic fibers from the superior cervical ganglion also pass through it, but only the parasympathetic fibers synapse there.</p></div>
      <div><h2>How it works</h2>
        <p>In the ganglion the signal is passed on by acetylcholine (nicotinic receptors), and at the muscle or gland also by acetylcholine (muscarinic receptors). The parasympathetic division constricts the pupil and focuses the eye for near vision, triggers tears, abundant watery saliva, and secretion of the nasal glands. The sympathetic division acts on the same organs by its own routes: it dilates the pupil and constricts the vessels of the glands.</p></div>
      <div><h2>Medicine</h2><ul>
        <li><b>Atropine</b> blocks muscarinic receptors: eye drops dilate the pupil for examining the fundus and temporarily abolish accommodation; pills with a similar action often cause a dry mouth.</li>
        <li><b>Pilocarpine</b> does the opposite: it constricts the pupil (a glaucoma treatment) and increases salivation in dry mouth.</li>
        <li><b>Adie's tonic pupil</b> is damage to the ciliary ganglion, often after a viral infection: the pupil is wide, barely reacts to light, and slowly constricts when looking at something near.</li>
        <li><b>Horner syndrome</b> is damage to the sympathetic pathway: a small pupil, a drooping eyelid, and dry skin on half of the face.</li>
        <li><b>Sjögren syndrome</b> is autoimmune damage to the lacrimal and salivary glands: dry eyes and a dry mouth.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The right side of the head is shown. Nerves are drawn thicker than in life, and the ganglia are enlarged (in reality 2–5 mm); the course of nerves in bony canals is simplified. The sensory roots of the ganglia and the sympathetic plexus of the external carotid artery are not shown. Reflexes are slowed down: in life they take fractions of a second. The round “pupil” window shows the same eye from the front, enlarged; it always faces you.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> clear selection</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`
  };
  colorAll();
  return self;
}
export { makeHGang };
