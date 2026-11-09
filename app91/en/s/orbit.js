import { THREE, V3, __set_rnd, envTex, flyStep, flyTarget, group, h, infoBox, labLights, loadSkeletonStatic, makeControls, mulberry, pickOn, rnd, seg, taperTube, toggle } from '../core.js';


// @scene orbit makeOrbit | Глазница и глаз | @body Системы органов
/* =========================================================
   ТЕЛО · ГЛАЗНИЦА И ГЛАЗ: правая глазница на скане черепа — мышцы глаза (взгляд в 9 направлениях),
   нервы глазницы (II, III, IV, VI, V) с параличами, слёзный аппарат (моргание и ток слёз).
   Сверено с атласом Неттера (табл. 94–98). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   Начало координат — точка скана черепа (0.11, 16.0, 0.6), 1 ед. скана ≈ 12,5 см (как в сценах nose, face, pharynx).
   Правый глаз: центр (−3.3, 2.4, 2.2), радиус 1,2; «к носу» = +x.
   ========================================================= */
const OR_MUS = [
  { id: 'lr', name: 'Lateral rectus', lab: 'lateral rectus', col: '#E8505E', nv: 'VI', text: '<b>The lateral rectus</b> runs from the common ring along the lateral wall of the orbit and inserts into the sclera 7 mm from the edge of the cornea. Its only action is to abduct the eye toward the temple. Nerve: the abducens (VI); when it is damaged, the eye cannot turn outward and drifts toward the nose.' },
  { id: 'mr', name: 'Medial rectus', lab: 'medial rectus', col: '#F08A4B', nv: 'III', text: '<b>The medial rectus</b> is the strongest of the rectus muscles. It runs along the medial wall and inserts closest to the cornea (5.5 mm). It adducts the eye toward the nose and, together with the muscle of the other eye, turns both eyes inward for near vision. Nerve: inferior branch of the oculomotor (III).' },
  { id: 'sr', name: 'Superior rectus', lab: 'superior rectus', col: '#E8C04A', nv: 'III', text: '<b>The superior rectus</b> lies under the levator of the eyelid. The axis of the orbit is about 23° off the line of sight, so the muscle not only elevates the eye but also turns its upper pole toward the nose and adducts it. It elevates most purely when the eye is turned toward the temple. Nerve: superior branch of III.' },
  { id: 'ir', name: 'Inferior rectus', lab: 'inferior rectus', col: '#7FD39A', nv: 'III', text: '<b>The inferior rectus</b> lies above the orbital floor. It depresses the eye and, because of its oblique course, also turns its upper pole toward the temple and adducts it. It depresses most purely when the eye is turned toward the temple. Nerve: inferior branch of III.' },
  { id: 'so', name: 'Superior oblique', lab: 'superior oblique', col: '#6FB7F0', nv: 'IV', text: '<b>The superior oblique</b> runs from the apex of the orbit forward to the trochlea, a cartilage loop at the upper inner rim. There its tendon turns back and outward, passes under the superior rectus, and inserts behind the equator. It depresses, intorts, and abducts the eye; it is the key muscle for looking down and in. Nerve: trochlear (IV).' },
  { id: 'io', name: 'Inferior oblique', lab: 'inferior oblique', col: '#C79BF0', nv: 'III', text: '<b>The inferior oblique</b> is the only eye muscle that starts in front: on the orbital floor next to the lacrimal fossa. It runs back and outward under the inferior rectus and inserts on the back outer part of the eye. It elevates, extorts, and abducts the eye; it is the key muscle for looking up and in. Nerve: III.' },
  { id: 'lps', name: 'Levator', lab: 'levator palpebrae', col: '#E890C0', nv: 'III', text: '<b>The levator palpebrae superioris</b> lies above the superior rectus and becomes a broad tendon woven into the upper lid. Nerve: III. Attached to it is Müller\'s smooth muscle with sympathetic supply, which is why in Horner syndrome the lid droops by only 1–2 mm.' },
];
const OR_GAZE = [   // взгляд правого глаза: yaw > 0 — к носу (влево для человека), pitch > 0 — вверх
  { id: 'ul', ar: '↖', name: 'up-left', yaw: 0.42, pitch: 0.36, act: { io: 1 }, text: '<b>Up and left.</b> The right eye is turned toward the nose. In this position the axis of the inferior oblique is closest to the line of sight, and it does almost all the lifting — this is how the inferior oblique is tested.' },
  { id: 'u', ar: '↑', name: 'up', yaw: 0, pitch: 0.4, act: { sr: 1, io: 0.7 }, text: '<b>Looking up</b> uses the superior rectus and the inferior oblique together. One rotates the eye inward, the other outward, so the rotations cancel, and so do their side pulls. The upper lid rises along with the eye.' },
  { id: 'ur', ar: '↗', name: 'up-right', yaw: -0.42, pitch: 0.36, act: { sr: 1 }, text: '<b>Up and right.</b> The right eye is turned toward the temple, and the axis of the superior rectus lines up with the line of sight — it does almost all the lifting. This is how the superior rectus is tested.' },
  { id: 'l', ar: '←', name: 'left', yaw: 0.5, pitch: 0, act: { mr: 1 }, text: '<b>Looking left.</b> The right eye is pulled toward the nose by the medial rectus (III) while the lateral rectus relaxes: antagonist muscles work as a pair. The left eye turns outward at the same time — the eyes move together.' },
  { id: 'c', ar: '•', name: 'straight ahead', yaw: 0, pitch: 0, act: {}, text: '<b>Looking straight ahead.</b> All the muscles are slightly tense and balance each other. In six positions — right, left, and the four diagonals — the eye is moved mainly by a single muscle: by having you trace an “H” with your gaze, a doctor tests each one separately.' },
  { id: 'r', ar: '→', name: 'right', yaw: -0.5, pitch: 0, act: { lr: 1 }, text: '<b>Looking right.</b> The right eye turns toward the temple — the lateral rectus (VI) is working. Meanwhile the left eye turns toward the nose with its medial rectus: a gaze center in the brainstem sends the command to both eyes.' },
  { id: 'dl', ar: '↙', name: 'down-left', yaw: 0.42, pitch: -0.34, act: { so: 1 }, text: '<b>Down and left.</b> In the adducted eye, almost all of the downward pull comes from the superior oblique. This is how we look when reading or walking downstairs — which is why trochlear nerve (IV) palsy makes going down stairs hard.' },
  { id: 'd', ar: '↓', name: 'down', yaw: 0, pitch: -0.38, act: { ir: 1, so: 0.7 }, text: '<b>Looking down</b> uses the inferior rectus and the superior oblique. Their rotations are opposite and cancel out. The upper lid lowers along with the eye, so no white shows above the iris.' },
  { id: 'dr', ar: '↘', name: 'down-right', yaw: -0.42, pitch: -0.34, act: { ir: 1 }, text: '<b>Down and right.</b> In the abducted eye, the axis of the inferior rectus lines up with the line of sight — it does almost all the lowering. This is how the inferior rectus is tested.' },
];
const OR_NERVE = [
  { id: 'II', name: 'II', col: '#F2E6A0', text: '<b>The optic nerve (II)</b> is a bundle of about 1.2 million axons of retinal cells. It leaves the orbit through the optic canal together with the ophthalmic artery. Inside the orbit the nerve is longer than the distance to the canal and lies in an S-curve — slack that lets the eye turn. Its further path is in the “Vision” topic.' },
  { id: 'III', name: 'III', col: '#F0A04B', text: '<b>The oculomotor nerve (III)</b> enters through the superior orbital fissure inside the common ring. Its superior branch goes to the superior rectus and the lid levator, the inferior branch to the medial and inferior recti and the inferior oblique. From the inferior branch, fibers run to the ciliary ganglion to constrict the pupil and focus the lens.', palsy: '<b>Oculomotor (III) palsy.</b> Only the lateral rectus (VI) and superior oblique (IV) still work, so the eye is turned down and out. The lid droops (ptosis), and the pupil is wide and does not constrict to light. If an aneurysm compresses the nerve, the pupil widens first — a reason for emergency care.' },
  { id: 'IV', name: 'IV', col: '#7FD39A', text: '<b>The trochlear nerve (IV)</b> is the thinnest cranial nerve and the only one that leaves the back of the brainstem. It enters the orbit through the superior orbital fissure above the common ring, passes over the lid levator, and enters the superior oblique muscle.', palsy: '<b>Trochlear (IV) palsy.</b> Without the superior oblique, the eye sits slightly higher than the other and its upper pole is tilted toward the temple. Vertical double vision is worse when looking down and in — reading and on stairs. To get rid of it, the person tilts the head toward the healthy shoulder.' },
  { id: 'VI', name: 'VI', col: '#6FB7F0', text: '<b>The abducens nerve (VI)</b> passes through the common ring and enters the inner surface of the lateral rectus. It has the longest course inside the skull, so it is often affected when intracranial pressure rises.', palsy: '<b>Abducens (VI) palsy.</b> The lateral rectus does not work and the medial rectus pulls unopposed — the eye turns toward the nose and cannot move toward the temple. Double vision is horizontal and worse when looking into the distance and toward the affected side.' },
  { id: 'V', name: 'V', col: '#C79BF0', text: '<b>The ophthalmic nerve (V₁)</b> is a sensory branch of the trigeminal. Before the fissure it divides into the lacrimal, frontal, and nasociliary nerves, which carry sensation from the eye, cornea, lids, forehead, and nose. Along the orbital floor runs the infraorbital nerve (V₂) to the cheek. Corneal reflex: touching the cornea (V₁) → a blink (VII).' },
];
const OR_TEAR = [
  { id: 'gland', name: 'Gland', col: '#6FB7F0', text: '<b>The lacrimal gland</b> is about the size of an almond. The tendon of the lid levator divides it into orbital and palpebral parts; 6–12 ducts open into the upper conjunctival fornix. Its secretory fibers are parasympathetic, from the facial nerve via the pterygopalatine ganglion: damage to the nerve near the brainstem leaves the eye dry.' },
  { id: 'canal', name: 'Canaliculi', col: '#7FD39A', text: '<b>Lacrimal puncta and canaliculi.</b> At the inner end of each lid, on a small papilla, is a punctum about 0.3 mm across, facing the eye. From it a canaliculus runs 2 mm vertically, then about 8 mm toward the nose; usually the two join into a common canaliculus. Most tears drain through the lower one.' },
  { id: 'sac', name: 'Sac and duct', col: '#E8C04A', text: '<b>The lacrimal sac</b> (12–15 mm) lies in a fossa on the medial wall of the orbit. With each blink the orbicularis oculi stretches and squeezes it in turn, like a pump. <b>The nasolacrimal duct</b> (12–18 mm) opens into the inferior nasal meatus under the inferior concha — which is why your nose runs when you cry.' },
  { id: 'lids', name: 'Eyelids', col: '#E890C0', text: '<b>Eyelids.</b> Each lid is built on a dense plate (the tarsus). It holds about 30 glands in the upper lid and 20 in the lower: their oil forms the outer layer of the tear film and keeps it from evaporating. The orbicularis oculi (VII) closes the lids; the levator (III) raises the upper one. We blink 15–20 times a minute.' },
];
function makeOrbit() {
  __set_rnd(mulberry(2205));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const sideL = new THREE.DirectionalLight(0xfff0e6, 0.6); sideL.position.set(-9, 6, 8); scene.add(sideL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const E = V3(-3.3, 2.4, 2.2), R = 1.2, EL = V3(3.3, 2.4, 2.2);
  const OC = V3(-2.55, 2.55, 0.7);   // середина глазницы
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const VP = DK ? { obl: [OC, V3(-0.62, 0.55, 0.56), 11.5, 1.9, 0.15], top: [V3(-2.5, 2.6, 0.7), V3(0, 1, -0.22), 17, 1.3, -0.6], side: [V3(-2.9, 2.4, 0.6), V3(-1, 0.18, 0.12), 12, 2.3, -0.2], front: [E, V3(0.05, 0.06, 1), 12.5, 2.0, -0.2], pal: [V3(0, 2.4, 2.2), V3(0, 0.04, 1), 17.5, 3.0, 1.2], tear: [V3(-2.6, 1.9, 2.5), V3(-0.12, 0.08, 1), 15.5, 1.9, -0.1], tcan: [V3(-1.9, 2.35, 2.7), V3(-0.3, 0.1, 1), 10, 2.2, 0],
      nobl: [V3(-2.5, 2.4, 0.3), V3(-0.62, 0.55, 0.56), 14.5, 1.4, 0.9], ntop: [V3(-2.3, 2.6, -1.2), V3(0, 1, -0.22), 19, 1.3, 0.4], nside: [V3(-2.5, 2.2, -0.2), V3(-1, 0.18, 0.12), 14.5, 1.6, 0.7] }
    : { obl: [OC, V3(-0.62, 0.55, 0.56), 11, 0, 0.5], top: [V3(-2.5, 2.6, 0.4), V3(0, 1, -0.22), 13.5, 0, 0.6], side: [V3(-2.9, 2.4, 0.6), V3(-1, 0.18, 0.12), 11.5, 0, 0.5], front: [E, V3(0.05, 0.06, 1), 10.5, 0, 0.5], pal: [V3(0, 2.3, 2.2), V3(0, 0.04, 1), 24, 0, 1.0], tear: [V3(-2.6, 1.9, 2.5), V3(-0.12, 0.08, 1), 12, 0, 0.5], tcan: [V3(-1.9, 2.35, 2.7), V3(-0.3, 0.1, 1), 7, 0, 0.4],
      nobl: [V3(-2.3, 2.4, -0.3), V3(-0.62, 0.55, 0.56), 13, 0, 0.5], ntop: [V3(-2.3, 2.6, 0.0), V3(0, 1, -0.22), 14, 0, 0.6], nside: [V3(-2.5, 2.2, -0.2), V3(-1, 0.18, 0.12), 13, 0, 0.5] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.obl.pos);
  const controls = makeControls(camera, VIEW.obl.target); controls.minDistance = 6; controls.maxDistance = 80;
  const st = { t: 0, mode: 'mus', view: 'obl', msel: null, gaze: 'c', nsel: null, palsy: false, tsel: null, blink: true, flow: true, labels: true, rot: false, fly: null,
    yaw: 0, pitch: 0, pal: 0, bl: 0, bt: 1.2, pup: 0.17 };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.6, clearcoat: o.cc ?? 0.15, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.1, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined, vertexColors: !!o.vc }); m.userData.em0 = o.em ?? 0.1; return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => (a.isVector3 ? a.clone() : V3(a[0], a[1], a[2]))), false, 'centripetal');
  const tubeOf = (pts, r, m, parent, seg = 48) => { const ms = new THREE.Mesh(new THREE.TubeGeometry(cr3(pts), seg, r, 8), m); parent.add(ms); return ms; };

  // =================== глаза ===================
  const EYE = new THREE.Group(); EYE.position.copy(E); scene.add(EYE);
  const EYEL = new THREE.Group(); EYEL.position.copy(EL); scene.add(EYEL);
  const sclM = mphys('#F1ECE4', { r: 0.4, cc: 0.4, em: 0.06 }), irisM = mphys('#7A5232', { r: 0.5, em: 0.08, side: THREE.DoubleSide }), pupM = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const corM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.18, depthWrite: false });
  const LIMB = Math.asin(0.58 / R);
  const PUP = [];
  [EYE, EYEL].forEach((G) => {
    const sg = new THREE.SphereGeometry(R, 48, 32, 0, 2 * Math.PI, LIMB, Math.PI - LIMB); sg.rotateX(Math.PI / 2); G.add(new THREE.Mesh(sg, sclM));
    const cg = new THREE.SphereGeometry(0.78, 40, 12, 0, 2 * Math.PI, 0, Math.asin(0.58 / 0.78)); cg.rotateX(Math.PI / 2); const co = new THREE.Mesh(cg, corM); co.position.z = 1.05 - Math.sqrt(0.78 * 0.78 - 0.58 * 0.58); co.renderOrder = 3; G.add(co);
    const ir = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.585, 48), irisM); ir.position.z = 1.02; G.add(ir);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 48), mphys('#9A7044', { em: 0.12, side: THREE.DoubleSide })); ring.position.z = 1.022; G.add(ring);
    const pu = new THREE.Mesh(new THREE.CircleGeometry(1, 36), pupM); pu.position.z = 1.025; pu.scale.setScalar(0.17); G.add(pu); PUP.push(pu);
  });
  const qEye = new THREE.Quaternion();
  const onEye = (dl, r = R) => dl.clone().normalize().multiplyScalar(r).applyQuaternion(qEye).add(E);   // точка глаза (локальное направление) в мире
  const dirAP = (az, pol) => { const a = az * Math.PI / 180, p = pol * Math.PI / 180; return V3(Math.sin(p) * Math.cos(a), Math.sin(p) * Math.sin(a), Math.cos(p)); };   // az: 0 — к носу, 90 — вверх, 180 — к виску

  // =================== веки (лист вокруг глазной щели) ===================
  const RI = 1.25, RO = 1.38, NA = 72, NRW = 12, UL = -0.93, UM = 0.86;
  const bump = (u) => Math.pow(Math.max(0, Math.sin(Math.PI * (u - UL) / (UM - UL))), 0.75);
  const lidM = mphys('#C98C76', { r: 0.7, k: 0.92, em: 0.08, side: THREE.DoubleSide }), conjM = mphys('#E28C94', { r: 0.5, em: 0.1, side: THREE.DoubleSide }), margM = mphys('#C27A78', { r: 0.6, em: 0.08, side: THREE.DoubleSide });
  const lashM = new THREE.LineBasicMaterial({ color: 0x2a1c16 });
  function makeLids(G, sd) {
    const mk = (n, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3)); const ms = new THREE.Mesh(g, m); ms.frustumCulled = false; G.add(ms); return ms; };
    const nG = NA * (NRW + 1), skin = mk(nG, lidM), conj = mk(nG, conjM), marg = mk(NA * 2, margM);
    const gi = []; for (let i = 0; i < NA; i++) for (let j = 0; j < NRW; j++) { const i2 = (i + 1) % NA, a = i * (NRW + 1) + j, b = i2 * (NRW + 1) + j; gi.push(a, b, a + 1, b, b + 1, a + 1); }
    skin.geometry.setIndex(gi); conj.geometry.setIndex(gi);
    const mi = []; for (let i = 0; i < NA; i++) { const i2 = (i + 1) % NA; mi.push(2 * i, 2 * i2, 2 * i + 1, 2 * i2, 2 * i2 + 1, 2 * i + 1); } marg.geometry.setIndex(mi);
    const lash = new THREE.LineSegments(new THREE.BufferGeometry(), lashM); lash.frustumCulled = false; G.add(lash);
    const L = { skin, conj, marg, lash, sd, U: 0.38, Lo: 0.46, pOut: 0.95, upTop: V3(), key: '' };
    L.vU = (u) => L.U * bump(u); L.vL = (u) => -L.Lo * Math.pow(bump(u), 1.1);
    L.inside = (u, v) => u > UL && u < UM && v < L.vU(u) && v > L.vL(u);
    L.pt = (u, v, r) => { const w = Math.sqrt(Math.max(0, 1 - u * u - v * v)); return V3(sd * u * r, v * r, w * r); };   // локально (без поворота глаза)
    L.build = () => {
      const key = [L.U.toFixed(3), L.Lo.toFixed(3), L.pOut].join(); if (key === L.key) return; L.key = key;
      const uc = (UL + UM) / 2, vc = (L.vU(uc) + L.vL(uc)) / 2, open = L.vU(uc) > L.vL(uc) + 1e-3;
      const PS = skin.geometry.attributes.position, PC = conj.geometry.attributes.position, PM = marg.geometry.attributes.position, LS = [];
      for (let i = 0; i < NA; i++) {
        const a = (i / NA) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a);
        let lo = 0, hi = 1.2;
        if (open) { for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (L.inside(uc + m * ca, vc + m * sa)) lo = m; else hi = m; } } else lo = 0;
        const bu = uc + lo * ca, bv = vc + lo * sa, rr = Math.hypot(bu, bv), rB = Math.min(0.995, rr), pB = Math.asin(rB), sB = rr > 0.995 ? 0.995 / rr : 1;
        const pO = Math.max(L.pOut, pB + 0.3), B3 = V3(sd * bu * sB, bv * sB, Math.sqrt(Math.max(0, 1 - rB * rB))), O3 = V3(sd * Math.sin(pO) * ca, Math.sin(pO) * sa, Math.cos(pO));
        for (let j = 0; j <= NRW; j++) {
          const f = Math.pow(j / NRW, 1.25), q = B3.clone().lerp(O3, f).normalize(), dx = q.x, dy = q.y, dz = q.z, k = i * (NRW + 1) + j;
          PS.setXYZ(k, dx * RO, dy * RO, dz * RO); PC.setXYZ(k, dx * RI, dy * RI, dz * RI);
          if (j === 0) { PM.setXYZ(2 * i, dx * RI, dy * RI, dz * RI); PM.setXYZ(2 * i + 1, dx * RO, dy * RO, dz * RO);
            if (open && Math.abs(bu - uc) < 0.82 && Math.abs(sa) > 0.12) { const up = bv > vc ? 1 : -1, ln = up > 0 ? 0.3 : 0.2, x0 = dx * (RO - 0.02), y0 = dy * (RO - 0.02), z0 = dz * (RO - 0.02); LS.push(x0, y0, z0, x0 + dx * ln * 0.5, y0 + up * ln * 0.75, z0 + ln * 0.45); } }
          if (i === Math.round(NA / 4) && j === 0) L.upTop.set(dx, dy, dz);
        }
      }
      [PS, PC, PM].forEach((P) => { P.needsUpdate = true; }); [skin, conj, marg].forEach((ms) => ms.geometry.computeVertexNormals());
      lash.geometry.setAttribute('position', new THREE.Float32BufferAttribute(LS, 3));
    };
    return L;
  }
  const grpAt = (p) => { const g = new THREE.Group(); g.position.copy(p); scene.add(g); return g; };
  const GLL = grpAt(EL), LID = makeLids(grpAt(E), 1), LIDL = makeLids(GLL, -1);
  LID.build(); LIDL.build();
  const lidW = (L, u, v, r) => L.pt(u, v, r).add(L.sd > 0 ? E : EL);
  const car = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mphys('#E07888', { r: 0.4, cc: 0.4, em: 0.14 })); car.scale.set(0.1, 0.13, 0.08); car.position.copy(lidW(LID, 0.82, -0.03, 1.24)); scene.add(car);

  // =================== мышцы ===================
  const TR = V3(-1.85, 3.95, 2.3);   // блок
  const MUSD = {
    lr: { O: V3(-2.35, 2.35, -1.3), ins: [180, 62], w: [0.24, 0.8, 0.95], th: 0.32, tend: 0.65 },
    mr: { O: V3(-1.45, 2.35, -1.4), ins: [0, 55], w: [0.24, 0.85, 1.0], th: 0.34, tend: 0.45 },
    sr: { O: V3(-1.95, 2.85, -1.35), ins: [84, 66], w: [0.24, 0.8, 1.0], th: 0.3, tend: 0.55 },
    ir: { O: V3(-1.95, 1.95, -1.35), ins: [274, 60], w: [0.24, 0.8, 0.95], th: 0.3, tend: 0.55 },
    so: { O: V3(-1.45, 2.98, -1.3), via: TR, ins: [128, 106], w: [0.2, 0.26, 0.85], th: 0.24, tend: 0 },
    io: { O: V3(-2.0, 1.15, 2.55), ins: [205, 116], w: [0.24, 0.62, 0.9], th: 0.26, tend: 0.15, lift: (s) => 0.34 * sm(s / 0.2) * (1 - sm((s - 0.62) / 0.36)) },
    lps: { O: V3(-1.72, 3.08, -1.38), lid: true, w: [0.26, 0.5, 0.8], th: 0.16, tend: 0.9, lift: (s) => 0.44 * sm(s / 0.3) - 0.3 * sm((s - 0.82) / 0.18) },
  };
  const NS = 46, NK = 10, MM = {}, pick = [];
  const MCOL = {}; OR_MUS.forEach((m) => { MCOL[m.id] = new THREE.Color(m.col); });
  const NCOL = { III: new THREE.Color('#F0A04B'), IV: new THREE.Color('#7FD39A'), VI: new THREE.Color('#6FB7F0') };
  const TCOL = new THREE.Color('#F4EFE4');
  OR_MUS.forEach((m) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NS * NK * 3), 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(NS * NK * 3), 3));
    const idx = []; for (let j = 0; j < NS - 1; j++) for (let k = 0; k < NK; k++) { const k2 = (k + 1) % NK, a = j * NK + k, b = j * NK + k2, c = a + NK, d = b + NK; idx.push(a, c, b, b, c, d); } g.setIndex(idx);
    const mat = mphys('#ffffff', { k: 1, r: 0.5, cc: 0.3, em: 0.06, emc: m.col, vc: true, side: THREE.DoubleSide });
    const ms = new THREE.Mesh(g, mat); ms.frustumCulled = false; ms.userData.pick = m.id; scene.add(ms); pick.push(ms);
    MM[m.id] = { ms, mat, c: [], n: [], mo: [], wv: [], tv: [], tf: [], thk: 1, act: 0 };
  });
  function wrapPts(O, I, Rw) {
    const u = O.clone().sub(E), d = u.length(), ip = I.clone().sub(E);
    let n = u.clone().cross(ip); if (n.lengthSq() < 1e-9) n = V3(0, 1, 0).cross(u); n.normalize();
    const a = u.clone().divideScalar(d), b = n.clone().cross(a), phI = Math.atan2(ip.dot(b), ip.dot(a)), phT = Math.acos(cl(Rw / d, -1, 1));
    const out = [O.clone()];
    if (phI <= phT) { out.push(I.clone()); return { pts: out, n }; }
    const nA = Math.max(3, Math.ceil((phI - phT) / 0.07));
    for (let k = 0; k <= nA; k++) { const ph = phT + (phI - phT) * k / nA; out.push(E.clone().addScaledVector(a, Rw * Math.cos(ph)).addScaledVector(b, Rw * Math.sin(ph))); }
    return { pts: out, n };
  }
  const resample = (P, n) => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + P[i].distanceTo(P[i - 1])); const T = L[L.length - 1], out = []; let k = 1; for (let j = 0; j < n; j++) { const s = T * j / (n - 1); while (k < P.length - 1 && L[k] < s) k++; const f = (s - L[k - 1]) / ((L[k] - L[k - 1]) || 1); out.push(P[k - 1].clone().lerp(P[k], cl(f))); } return { pts: out, len: T }; };
  const lpsEnd = () => { const d = LID.upTop.clone(), p = Math.asin(Math.min(0.99, Math.hypot(d.x, d.y))) + 0.3; return V3(0, Math.sin(p), Math.cos(p)).multiplyScalar(1.33).add(E); };
  function buildMus(id) {
    const D = MUSD[id], M = MM[id], Rw = R + 0.01;
    let P, n, sTr = -1;
    if (D.lid) { const w = wrapPts(D.O, lpsEnd(), Rw); P = w.pts; n = w.n; }
    else if (D.via) { const I = onEye(dirAP(...D.ins), Rw), w = wrapPts(D.via, I, Rw); P = [D.O.clone()].concat(w.pts); n = w.n; sTr = D.O.distanceTo(D.via); }
    else { const w = wrapPts(D.O, onEye(dirAP(...D.ins), Rw), Rw); P = w.pts; n = w.n; }
    const rs = resample(P, NS), C = rs.pts, len = rs.len;
    if (sTr > 0) M.sTr = sTr / len;
    if (D.lift) C.forEach((p, j) => { const s = j / (NS - 1), r = p.clone().sub(E), l = r.length(); p.addScaledVector(r.divideScalar(l), D.lift(s)); });
    const pos = M.ms.geometry.attributes.position, th0 = D.th * M.thk;
    M.c = C; M.n = n; M.mo = [];
    for (let j = 0; j < NS; j++) {
      const s = j / (NS - 1), sl = s * len, p = C[j], t = C[Math.min(NS - 1, j + 1)].clone().sub(C[Math.max(0, j - 1)]).normalize();
      let w, th;
      if (sTr > 0) { const sb = sl / sTr; if (sb < 1) { w = th = (D.w[0] + (D.w[1] - D.w[0]) * Math.sin(Math.PI * Math.min(1, sb * 1.1))) * (sb > 0.75 ? 1 - 0.55 * sm((sb - 0.75) / 0.25) : 1); th *= M.thk; } else { const f = (sl - sTr) / (len - sTr); w = 0.12 + (D.w[2] - 0.12) * sm((f - 0.45) / 0.55); th = 0.07 - 0.03 * f; } }
      else { w = s < 0.5 ? D.w[0] + (D.w[1] - D.w[0]) * sm(s / 0.5) : D.w[1] + (D.w[2] - D.w[1]) * sm((s - 0.5) / 0.5); const te = (len - sl) < D.tend ? 1 : 0; th = te ? 0.05 + 0.08 * cl((len - sl) / D.tend) : 0.12 + (th0 - 0.12) * Math.sin(Math.PI * cl((sl - 0.1) / (len - D.tend - 0.1))); }
      const nn = n.clone().sub(t.clone().multiplyScalar(n.dot(t))).normalize(), out = p.clone().sub(E); let m = t.clone().cross(nn).normalize(); if (m.dot(out) < 0) m.negate();
      M.mo.push(m);
      for (let k = 0; k < NK; k++) { const a = (k / NK) * 2 * Math.PI, q = p.clone().addScaledVector(nn, (w / 2) * Math.cos(a)).addScaledVector(m, (th / 2) * (1 + Math.sin(a)) + 0.004); pos.setXYZ(j * NK + k, q.x, q.y, q.z); }
      M.tv[j] = th;
      const tf = sTr > 0 ? (sl > sTr - 0.6 ? 1 : 0) : (len - sl < D.tend ? 1 : sl < 0.18 ? 0.7 : 0); M.tf[j] = tf;
    }
    pos.needsUpdate = true; M.ms.geometry.computeVertexNormals(); M.ms.geometry.computeBoundingSphere();
  }
  function colorMus() {
    OR_MUS.forEach((m) => { const M = MM[m.id], cA = M.ms.geometry.attributes.color, base = st.mode === 'nrv' ? NCOL[m.nv] : MCOL[m.id], c = new THREE.Color();
      for (let j = 0; j < NS; j++) { c.copy(base).multiplyScalar(j % 2 ? 0.86 : 1).lerp(TCOL, (M.tf[j] || 0) * (m.id === 'lps' ? 0.45 : 0.85)); for (let k = 0; k < NK; k++) cA.setXYZ(j * NK + k, c.r, c.g, c.b); }
      cA.needsUpdate = true; M.mat.emissive.copy(base); });
  }
  const muscPt = (id, s, out = 0.5) => { const M = MM[id], j = Math.round(cl(s) * (NS - 1)); return M.c[j].clone().addScaledVector(M.mo[j], (M.tv[j] || 0.2) * out); };
  // кольцо Цинна и блок
  const tendM = mphys('#F4EFE4', { r: 0.45, em: 0.1 });
  const ringAx = OC.clone().sub(V3(-1.85, 2.4, -1.4)).normalize();
  const RING = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 40), tendM); RING.position.set(-1.9, 2.4, -1.4); RING.quaternion.setFromUnitVectors(V3(0, 0, 1), ringAx); scene.add(RING);
  const TRO = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 8, 24), mphys('#CFE3F0', { r: 0.45, cc: 0.4, em: 0.12 })); TRO.position.copy(TR); scene.add(TRO);
  // зрительный нерв
  const onM = mphys('#F2E6A0', { r: 0.6, em: 0.1 });
  const CAN = V3(-1.55, 2.6, -1.7), ONL = V3(0.25, 0, -0.97);
  const ONm = new THREE.Mesh(new THREE.BufferGeometry(), onM); scene.add(ONm); ONm.userData.pick = 'II';
  tubeOf([CAN, V3(-1.2, 2.55, -2.4), V3(-0.75, 2.45, -3.1)], 0.17, onM, scene, 16);
  let onC = null;
  function buildON() { const a = onEye(ONL, R - 0.05), b = onEye(ONL, R + 0.5), m = CAN.clone().lerp(b, 0.45).add(V3(-0.18, -0.1, 0)); onC = cr3([CAN, m, b, a]); ONm.geometry.dispose(); ONm.geometry = new THREE.TubeGeometry(onC, 40, 0.2, 12); }

  // =================== нервы ===================
  const NRV = new THREE.Group(); scene.add(NRV);
  const NM = {}; OR_NERVE.forEach((n) => { NM[n.id] = mphys(n.col, { r: 0.55, em: 0.22 }); });
  const NG = { II: [ONm], III: [], IV: [], VI: [], V: [] };
  const nerve = (id, pts, r) => { const ms = tubeOf(pts, r, NM[id], NRV); ms.userData.pick = id; NG[id].push(ms); pick.push(ms); return ms; };
  const DYNN = [];   // ресничные нервы: концы на глазу
  const LBP = {};
  function buildNerves() {
    const sr = muscPt('sr', 0.33, 0), lps = muscPt('lps', 0.36, 0), mr = muscPt('mr', 0.34, 0), ir = muscPt('ir', 0.32, 0), io = muscPt('io', 0.42, 0.5), so = muscPt('so', 0.32, 1.05), lr = muscPt('lr', 0.3, 0.2);
    // III
    const B3 = V3(-2.0, 2.25, -1.2), Bi = V3(-2.1, 1.85, -0.55);
    nerve('III', [V3(-1.3, 2.05, -3.4), V3(-1.5, 2.1, -2.8), V3(-1.8, 2.2, -1.9), B3], 0.09);
    nerve('III', [B3, V3(-2.3, 2.7, -0.9), V3(-2.15, 3.0, -0.5), sr], 0.06); nerve('III', [V3(-2.15, 3.0, -0.5), lps], 0.04);
    nerve('III', [B3, V3(-2.1, 1.95, -0.85), Bi], 0.065);
    nerve('III', [Bi, V3(-1.75, 1.95, -0.25), mr], 0.045); nerve('III', [Bi, ir], 0.045);
    nerve('III', [Bi, V3(-2.6, 1.55, 0.2), V3(-2.95, 1.3, 1.0), io], 0.04);
    // ресничный узел
    const CG = onC.getPoint(0.36).add(V3(-0.36, -0.06, 0.05)); LBP.cg = CG;
    const cgm = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), NM.III); cgm.scale.set(0.13, 0.09, 0.15); cgm.position.copy(CG); NRV.add(cgm); NG.III.push(cgm);
    nerve('III', [Bi.clone().lerp(B3, 0.3), CG.clone().add(V3(0, -0.05, -0.1))], 0.025);
    // IV
    nerve('IV', [V3(-1.55, 2.85, -3.4), V3(-1.7, 3.0, -2.7), V3(-1.85, 3.3, -1.5), V3(-1.55, 3.4, -0.9), so], 0.045);
    // VI
    nerve('VI', [V3(-1.25, 1.7, -3.4), V3(-1.6, 1.9, -2.7), V3(-2.1, 2.15, -1.4), V3(-2.55, 2.3, -0.9), lr], 0.065);
    // V: тройничный узел, V1 и его ветви, V2
    const TG = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), NM.V); TG.scale.set(0.75, 0.28, 0.42); TG.position.set(-2.55, 1.0, -3.75); TG.rotation.y = -0.5; NRV.add(TG); NG.V.push(TG);
    const BV = V3(-2.15, 2.55, -1.95);
    nerve('V', [V3(-2.3, 1.15, -3.5), V3(-2.3, 1.7, -3.0), V3(-2.2, 2.3, -2.4), BV], 0.1);
    nerve('V', [BV, V3(-2.5, 2.95, -1.4), V3(-3.2, 3.25, -0.4), V3(-3.9, 3.5, 0.6), V3(-4.25, 3.7, 1.2)], 0.045);   // слёзный
    const BF = V3(-2.65, 4.0, 1.4);
    nerve('V', [BV, V3(-2.05, 3.3, -1.4), V3(-2.3, 3.62, -0.4), V3(-2.6, 3.95, 0.8), BF], 0.07);   // лобный
    nerve('V', [BF, V3(-2.95, 4.32, 2.4), V3(-3.05, 4.55, 3.05)], 0.05); nerve('V', [BF, V3(-2.2, 4.05, 2.2), V3(-2.05, 4.25, 2.9)], 0.04);
    const NC1 = V3(-1.95, 2.92, -0.65), NC2 = V3(-1.5, 3.05, -0.2), NC3 = V3(-1.32, 3.15, 0.6);
    nerve('V', [BV, V3(-2.0, 2.65, -1.4), NC1, NC2, NC3, V3(-1.38, 3.32, 1.6), V3(-1.6, 3.6, 2.55)], 0.05);   // носоресничный → подблоковый
    nerve('V', [NC2, V3(-1.15, 3.15, -0.3)], 0.03); nerve('V', [NC3, V3(-1.05, 3.3, 0.7)], 0.03);
    nerve('V', [V3(-2.05, 2.75, -1.0), CG.clone().add(V3(0.02, 0.06, -0.08))], 0.022);
    nerve('V', [V3(-2.45, 0.8, -3.55), V3(-2.45, 0.55, -2.4), V3(-2.65, 0.55, -0.8), V3(-2.85, 0.58, 0.6), V3(-2.92, 0.42, 1.8), V3(-2.95, 0.02, 2.6), V3(-2.95, -0.38, 3.05)], 0.085);   // подглазничный (V2)
    nerve('V', [V3(-2.4, 0.85, -3.75), V3(-2.5, 0.1, -3.7)], 0.1);   // V3 — обрыв
    LBP.lac = V3(-3.6, 3.4, 0.2); LBP.fr = V3(-2.45, 3.82, 0.3); LBP.nc = NC3.clone(); LBP.v2 = V3(-2.85, 0.58, 0.6); LBP.v1 = V3(-2.28, 1.9, -2.8); LBP.tg = TG.position.clone(); LBP.s3 = V3(-2.3, 2.7, -0.9); LBP.i3 = V3(-2.6, 1.55, 0.2); LBP.t3 = V3(-1.5, 2.1, -2.8); LBP.iv = V3(-1.7, 3.0, -2.7); LBP.vi = V3(-1.15, 1.9, -2.7);
    // ресничные нервы (концы на глазу)
    for (let k = 0; k < 6; k++) { const a = (k / 6) * 2 * Math.PI; DYNN.push({ id: 'III', from: CG, dl: ONL.clone().add(V3(0.2 * Math.cos(a), 0.2 * Math.sin(a), 0)), r: 0.018 }); }
    DYNN.push({ id: 'V', from: NC1, dl: ONL.clone().add(V3(0.26, 0.12, 0)), r: 0.02 }, { id: 'V', from: NC1, dl: ONL.clone().add(V3(0.05, 0.27, 0)), r: 0.02 });
    DYNN.forEach((d) => { d.ms = new THREE.Mesh(new THREE.BufferGeometry(), NM[d.id]); NRV.add(d.ms); NG[d.id].push(d.ms); });
  }
  function buildCiliary() { DYNN.forEach((d) => { const e = onEye(d.dl, R), e2 = onEye(d.dl, R + 0.35); d.ms.geometry.dispose(); d.ms.geometry = new THREE.TubeGeometry(cr3([d.from, d.from.clone().lerp(e2, 0.5), e2, e]), 16, d.r, 5); }); }

  // =================== слёзный аппарат ===================
  const TEAR = new THREE.Group(); scene.add(TEAR);
  const glM = mphys('#7FB8E8', { r: 0.5, cc: 0.3, em: 0.16 }), ductM = mphys('#8ED0F0', { r: 0.4, cc: 0.4, em: 0.2 }), sacM = mphys('#E8C04A', { r: 0.45, cc: 0.3, em: 0.14 });
  const GL1 = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), glM); GL1.scale.set(0.78, 0.32, 0.48); GL1.position.set(-4.35, 3.85, 1.45); GL1.rotation.set(0.15, 0.7, -0.45); scene.add(GL1); GL1.userData.pick = 'gland';
  const GL2 = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), glM); GL2.scale.set(0.5, 0.2, 0.32); GL2.position.set(-4.25, 3.45, 2.3); GL2.rotation.set(0.3, 0.6, -0.6); TEAR.add(GL2); GL2.userData.pick = 'gland';
  const FORN = []; for (let k = 0; k < 6; k++) { const u = -0.78 + 0.08 * k; FORN.push(lidW(LID, u, 0.68 - 0.02 * k, 1.23)); }
  FORN.forEach((f, k) => tubeOf([GL2.position.clone().add(V3(0.1 * k - 0.2, -0.08, 0.1)), f], 0.022, ductM, TEAR, 8));
  const PU = { u: 0.68 }; PU.up = lidW(LID, PU.u, LID.vU(PU.u) + 0.01, 1.3); PU.lo = lidW(LID, PU.u, LID.vL(PU.u) - 0.01, 1.3);
  const SAC0 = V3(-1.55, 2.85, 2.6), SAC1 = V3(-1.55, 1.7, 2.62), DUCT1 = V3(-1.32, -0.15, 2.55);
  const CC = V3(-1.75, 2.38, 2.68);   // общий каналец у мешка
  const CANU = [PU.up, PU.up.clone().add(V3(0, 0.2, -0.04)), V3(-2.0, 2.62, 2.75), CC], CANL = [PU.lo, PU.lo.clone().add(V3(0, -0.2, -0.04)), V3(-2.0, 2.18, 2.75), CC];
  const canU = tubeOf(CANU, 0.055, ductM, TEAR, 24), canL = tubeOf(CANL, 0.055, ductM, TEAR, 24); canU.userData.pick = canL.userData.pick = 'canal';
  [PU.up, PU.lo].forEach((p) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0x1a0c0c })); d.position.copy(p); TEAR.add(d); });
  const sacG = new THREE.CapsuleGeometry(0.24, SAC0.y - SAC1.y, 8, 16); const SAC = new THREE.Mesh(sacG, sacM); SAC.position.copy(SAC0).lerp(SAC1, 0.5); SAC.scale.set(0.85, 1, 1); TEAR.add(SAC); SAC.userData.pick = 'sac';
  const DUCTC = cr3([SAC1, V3(-1.48, 0.9, 2.6), V3(-1.4, 0.3, 2.58), DUCT1]);
  const DUCT = new THREE.Mesh(taperTube(DUCTC, (u) => 0.17 - 0.05 * u + 0.05 * sm((u - 0.85) / 0.15), 30, 12), sacM); TEAR.add(DUCT); DUCT.userData.pick = 'sac';
  const ICON = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI), mphys('#D88A94', { r: 0.5, em: 0.08, op: 0.55, side: THREE.DoubleSide })); ICON.scale.set(0.3, 0.32, 1.1); ICON.rotation.y = -Math.PI / 2; ICON.position.set(-1.05, -0.05, 2.0); TEAR.add(ICON);   // нижняя раковина (передний конец)
  [GL2, SAC, DUCT, canU, canL].forEach((o) => pick.push(o)); pick.push(GL1);
  // ток слёз: частицы
  const surfW = (u, v, r = 1.265) => lidW(LID, u, v, r);
  const FLOW = (lower) => { const vm = (u) => (lower ? LID.vL(u) + 0.05 : LID.vU(u) - 0.05); const S = [FORN[2], surfW(-0.86, 0.12), surfW(-0.7, vm(-0.7)), surfW(-0.3, vm(-0.3)), surfW(0.2, vm(0.2)), surfW(0.55, vm(0.55)), surfW(0.76, -0.02)]; const C = lower ? CANL : CANU; return cr3(S.concat([C[0], C[1], C[2], CC, SAC.position.clone().add(V3(0.05, 0.2, 0.1)), SAC1, V3(-1.48, 0.9, 2.6), V3(-1.4, 0.3, 2.58), DUCT1, V3(-1.25, -0.4, 2.45)])); };
  const FC = [FLOW(true), FLOW(false)], FCL = FC.map((c) => c.getLength());
  const NP = 54, PM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.95, depthTest: true }), NP); PM.frustumCulled = false; PM.renderOrder = 4; scene.add(PM);
  const PRT = Array.from({ length: NP }, (_, i) => ({ c: i % 4 === 0 ? 1 : 0, u: i / NP }));
  const dummy = new THREE.Object3D();

  // =================== скан черепа ===================
  const KS = 12.5, MX = 0.11;
  const SK = new THREE.Group(); SK.scale.setScalar(KS); SK.position.set(-MX * KS, -16 * KS, -0.6 * KS); scene.add(SK);
  const PL = (x, y, z, c) => { const n = V3(x, y, z), l = n.length(); return new THREE.Plane(n.divideScalar(l), c / l); };
  const CUT = {
    obl: [PL(1, -1, 0, 5.7), PL(0, 0, -1, -2.6), PL(0, 0, 1, -3.7), PL(0, 1, 0, -7), PL(1, 0, 0, 0.6)],   // верхненаружная часть стенок
    top: [PL(0, -1, 0, 3.22)],
    side: [PL(1, 0, 0.85, 3.5), PL(0, -1, 0, -0.1), PL(0, 1, 0, -5.3), PL(0, 0, -1, -2.8), PL(0, 0, 1, -3.4)],
    front: [], pal: [], tear: [],
  };
  const skM = new THREE.MeshPhysicalMaterial({ color: 0xE8DCC8, roughness: 0.65, clearcoat: 0.1, emissive: 0x4a4236, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.FrontSide, clipIntersection: true, clippingPlanes: CUT.obl });
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    const ok = (i) => { const y = (P.getY(i) - 16) * KS, z = (P.getZ(i) - 0.6) * KS; return y > -3.6 && z > -5.5; };
    for (let t = 0; t < IX.length; t += 3) if (ok(IX[t]) && ok(IX[t + 1]) && ok(IX[t + 2])) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = 2; SK.add(ms);
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
  }).catch(() => {});

  // =================== состояние и обновление ===================
  let lastKey = '';
  function geomUpdate(force) {
    const key = [st.yaw.toFixed(4), st.pitch.toFixed(4), LID.key, OR_MUS.map((m) => MM[m.id].thk.toFixed(3)).join()].join('|');
    if (!force && key === lastKey) return; lastKey = key;
    qEye.setFromUnitVectors(V3(0, 0, 1), V3(Math.sin(st.yaw) * Math.cos(st.pitch), Math.sin(st.pitch), Math.cos(st.yaw) * Math.cos(st.pitch))); EYE.quaternion.copy(qEye);
    OR_MUS.forEach((m) => buildMus(m.id)); buildON(); if (DYNN.length) buildCiliary();
  }
  const gz = () => OR_GAZE.find((g) => g.id === st.gaze);
  function target() {
    let yaw = 0, pitch = 0, ptos = 0, pup = 0.17;
    if (st.mode === 'mus') { const g = gz(); yaw = g.yaw; pitch = g.pitch; }
    if (st.mode === 'nrv' && st.palsy) { if (st.nsel === 'III') { yaw = -0.36; pitch = -0.2; ptos = 0.5; pup = 0.31; } else if (st.nsel === 'IV') { yaw = 0.05; pitch = 0.3; } else if (st.nsel === 'VI') { yaw = 0.5; } }
    return { yaw, pitch, ptos, pup };
  }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly && st.mode !== 'tear'; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const T = target(), k = 1 - Math.exp(-dt * 3.2);
    st.yaw += (T.yaw - st.yaw) * k; st.pitch += (T.pitch - st.pitch) * k; st.pal += (T.ptos - st.pal) * k; st.pup += (T.pup - st.pup) * k;
    if (Math.abs(T.yaw - st.yaw) < 1e-4) st.yaw = T.yaw; if (Math.abs(T.pitch - st.pitch) < 1e-4) st.pitch = T.pitch;
    // моргание (режим 3)
    const M3 = st.mode === 'tear';
    if (M3 && st.blink) { st.bt -= dt; if (st.bt < 0) { st.bt = 3.6 + 1.4 * rnd(); } }
    st.bl = M3 && st.blink && st.bt > 3.18 ? Math.sin(Math.PI * cl((3.6 - st.bt) / 0.42)) : 0;
    // мышцы: сокращение
    const act = st.mode === 'mus' ? gz().act : {};
    OR_MUS.forEach((m) => { const M = MM[m.id], a = act[m.id] || 0; M.act += (a - M.act) * k; const anta = st.mode === 'mus' && Object.keys(act).length && !a; M.thk += ((a ? 1.18 : anta ? 0.92 : 1) - M.thk) * k; if (Math.abs(M.thk - 1) < 2e-3 && !a && !anta) M.thk = 1; });
    // веки
    const PAL = st.mode === 'nrv' && st.palsy, pOut = M3 || PAL || st.view === 'front' ? 0.95 : 0.72;
    const U0 = 0.38 + 0.75 * st.pitch, L0 = 0.46 - 0.45 * st.pitch;
    LID.U = U0 + (-L0 * 0.92 - U0) * Math.max(st.bl, 0.92 * st.pal); LID.Lo = L0; LID.pOut = pOut; LID.build();
    LIDL.U = 0.38 + (-0.46 * 0.92 - 0.38) * st.bl; LIDL.pOut = pOut; LIDL.build();
    geomUpdate(false);
    PUP[0].scale.setScalar(st.pup);
    // видимость
    const M1 = st.mode === 'mus', M2 = st.mode === 'nrv';
    EYEL.visible = GLL.visible = M3 || st.view === 'front' || (M2 && st.palsy);
    NRV.visible = M2 && !PAL; RING.visible = TRO.visible = !M3 && !PAL; ONm.visible = !PAL; TEAR.visible = M3; PM.visible = M3 && st.flow;
    OR_MUS.forEach((m) => { const M = MM[m.id]; M.ms.visible = !M3 && !PAL;
      let op = 1, em = M.mat.userData.em0;
      if (M1) { op = !st.msel || st.msel === m.id ? 1 : 0.16; em += 0.55 * M.act * (0.75 + 0.25 * Math.sin(st.t * 6)) + (st.msel === m.id ? 0.45 : 0); }
      if (M2) op = !st.nsel ? 0.45 : st.nsel === m.nv ? 0.7 : 0.12;
      setOp(M.mat, op); M.mat.emissiveIntensity = em; });
    setOp(onM, M2 && st.nsel && st.nsel !== 'II' ? 0.2 : 1);
    OR_NERVE.forEach((n) => { if (n.id === 'II') return; setOp(NM[n.id], !st.nsel || st.nsel === n.id ? 1 : 0.12); NM[n.id].emissiveIntensity = st.nsel === n.id ? (st.palsy ? 0.05 : 0.45) : 0.22; });
    GL1.visible = (M2 && !PAL) || M3;
    if (M3) { const on = (id) => !st.tsel || st.tsel === id; setOp(glM, on('gland') ? 1 : 0.25); setOp(ductM, on('canal') || on('gland') ? 1 : 0.25); setOp(sacM, on('sac') ? 1 : 0.25); glM.emissiveIntensity = st.tsel === 'gland' ? 0.4 : 0.16; sacM.emissiveIntensity = st.tsel === 'sac' ? 0.35 : 0.14; ductM.emissiveIntensity = st.tsel === 'canal' ? 0.45 : 0.2; lidM.emissiveIntensity = st.tsel === 'lids' ? 0.25 : 0.08; }
    else { setOp(glM, M2 && st.nsel && st.nsel !== 'V' ? 0.2 : 0.9); lidM.emissiveIntensity = 0.08; }
    // частицы слёз
    if (PM.visible) {
      const pump = st.bl > 0.05 ? 3.2 : 1;
      PRT.forEach((p, i) => { const L = FCL[p.c], f = p.u < 0.42 ? 0.55 : 1.4; p.u += dt * f * pump * 0.42 / L; if (p.u > 1) { p.u -= 1; p.c = rnd() < 0.3 ? 1 : 0; } const q = FC[p.c].getPointAt(cl(p.u)); dummy.position.copy(q); dummy.scale.setScalar(p.u > 0.95 ? (1 - p.u) * 20 : p.u < 0.03 ? p.u * 33 : 1); dummy.updateMatrix(); PM.setMatrixAt(i, dummy.matrix); });
      PM.instanceMatrix.needsUpdate = true;
    }
  }
  function applyView() { const v = st.mode === 'tear' ? 'tear' : st.mode === 'nrv' && st.palsy ? 'pal' : st.view; skM.clippingPlanes = CUT[v] || []; skM.needsUpdate = true; st.fly = VIEW[st.mode === 'tear' && st.tsel === 'canal' ? 'tcan' : st.mode === 'nrv' && VIEW['n' + v] ? 'n' + v : v]; }
  function setMode(m) {
    st.mode = m; if (m === 'mus' && st.view === 'top' && !st.vUser) st.view = 'obl'; if (m === 'nrv' && !st.vUser) st.view = DK ? 'side' : 'top';
    if (m !== 'nrv') st.palsy = false; colorMus(); applyView();
    refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  function setView(v) { st.view = v; st.vUser = true; st.palsy = false; refs.palT && refs.palT.sync(); applyView(); refs.vseg && refs.vseg.sync(); refs.setInfo && refs.setInfo(); }
  function setMus(id) { st.msel = id === 'all' || st.msel === id ? null : id; if (st.msel) st.gaze = 'c'; refs.mseg && refs.mseg.sync(); refs.gseg && refs.gseg.sync(); refs.setInfo && refs.setInfo(); }
  function setGaze(id) { st.gaze = id; st.msel = null; refs.mseg && refs.mseg.sync(); refs.gseg && refs.gseg.sync(); refs.setInfo && refs.setInfo(); }
  function setNerve(id) { st.nsel = id === 'all' || st.nsel === id ? null : id; if (!OR_NERVE.find((n) => n.id === st.nsel && n.palsy)) { if (st.palsy) { st.palsy = false; applyView(); } } refs.nseg && refs.nseg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setTear(id) { st.tsel = id === 'all' || st.tsel === id ? null : id; refs.tseg && refs.tseg.sync(); refs.setInfo && refs.setInfo(); applyView(); }
  pickOn(() => self, camera, () => pick, (id) => {
    if (st.mode === 'mus' && MM[id]) setMus(id);
    else if (st.mode === 'nrv' && NG[id]) setNerve(id);
    else if (st.mode === 'tear' && OR_TEAR.find((t) => t.id === id)) setTear(id);
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const mus = () => st.mode === 'mus', nrv = () => st.mode === 'nrv', tear = () => st.mode === 'tear';
  const mOn = (id) => () => { if (!mus()) return false; if (st.msel) return st.msel === id; if (DK) return true; const a = gz().act; return Object.keys(a).length ? !!a[id] : ['lr', 'sr', 'so', 'io'].includes(id); };
  const MLS = { lr: 0.5, mr: 0.45, sr: 0.42, ir: 0.5, so: 0.3, io: 0.5, lps: 0.3 };
  const nOn = (id, dk) => () => nrv() && !st.palsy && (st.nsel === id || (!st.nsel && (!dk || DK)));
  const tOn = (id, dk) => () => tear() && (st.tsel === id || (!st.tsel && (!dk || DK)));
  const labels = [
    ...OR_MUS.map((m) => lb(m.lab, () => muscPt(m.id, MLS[m.id], 1.2), m.col, () => st.view !== 'front' && mOn(m.id)(), m.id === 'mr' || m.id === 'so')),
    ...OR_MUS.map((m) => lb(m.lab, () => muscPt(m.id, m.id === 'so' || m.id === 'lps' ? MLS[m.id] : 0.86, 1.2), m.col, () => st.view === 'front' && mOn(m.id)(), m.id === 'lr' || m.id === 'ir' || m.id === 'io')),
    lb('trochlea', () => TR.clone().add(V3(0.1, 0.18, 0.1)), '#CFE3F0', () => mus() && (st.msel === 'so' || (!st.msel && DK)), true),
    lb('common tendinous ring', () => RING.position.clone().add(V3(-0.2, -0.55, 0)), '#F4EFE4', () => mus() && !st.msel && DK && st.view !== 'front'),
    lb('optic nerve', () => onC.getPoint(0.3), '#F2E6A0', () => mus() && !st.msel && DK && st.view !== 'front'),
    lb('optic nerve (II)', () => onC.getPoint(0.45), '#F2E6A0', nOn('II')),
    lb('oculomotor (III)', () => LBP.t3, '#F8B878', nOn('III', true)),
    lb('superior branch of III', () => LBP.s3, '#F8B878', () => nrv() && !st.palsy && st.nsel === 'III'),
    lb('inferior branch of III', () => LBP.i3, '#F8B878', () => nrv() && !st.palsy && st.nsel === 'III', true),
    lb('ciliary ganglion', () => LBP.cg, '#F8B878', () => nrv() && !st.palsy && (st.nsel === 'III' || (!st.nsel && DK)), true),
    lb('trochlear (IV)', () => LBP.iv, '#A8E8BC', nOn('IV')),
    lb('abducens (VI)', () => LBP.vi, '#9CD0FF', nOn('VI'), true),
    lb('ophthalmic nerve (V₁)', () => LBP.v1, '#DCC0FF', nOn('V'), true),
    lb('frontal', () => LBP.fr, '#DCC0FF', () => nrv() && st.nsel === 'V'),
    lb('lacrimal', () => LBP.lac, '#DCC0FF', () => nrv() && st.nsel === 'V', true),
    lb('nasociliary', () => LBP.nc, '#DCC0FF', () => nrv() && st.nsel === 'V'),
    lb('infraorbital (V₂)', () => LBP.v2, '#DCC0FF', () => nrv() && st.nsel === 'V', true),
    lb('trigeminal ganglion', () => LBP.tg, '#DCC0FF', () => nrv() && st.nsel === 'V' && DK, true),
    lb('lacrimal gland', () => GL1.position.clone().add(V3(-0.3, 0.35, 0)), '#9CD0FF', () => (nrv() && st.nsel === 'V' && DK) || (tear() && st.tsel !== 'gland' && (!st.tsel || DK)), true),
    lb('orbital part', () => GL1.position.clone().add(V3(-0.3, 0.35, 0)), '#9CD0FF', () => tear() && st.tsel === 'gland', true),
    lb('palpebral part', () => GL2.position.clone().add(V3(-0.35, -0.05, 0.2)), '#9CD0FF', () => tear() && st.tsel === 'gland', true),
    lb('right eye', () => E.clone().add(V3(0, -1.6, 1)), '#F2EEE6', () => nrv() && st.palsy),
    lb('left — normal', () => EL.clone().add(V3(0, -1.6, 1)), '#F2EEE6', () => nrv() && st.palsy),
    lb('lacrimal puncta', () => PU.up.clone().add(V3(0.0, 0.25, 0.15)), '#A8E8BC', tOn('canal', true)),
    lb('lacrimal canaliculi', () => V3(-2.0, 2.62, 2.8), '#A8E8BC', () => tear() && (st.tsel === 'canal' || (!st.tsel && DK))),
    lb('lacrimal lake', () => surfW(0.76, -0.02).add(V3(0, -0.1, 0.1)), '#9FE0FF', () => tear() && st.tsel === 'canal', true),
    lb('lacrimal sac', () => SAC0.clone().add(V3(0.15, -0.2, 0)), '#F0D880', tOn('sac')),
    lb('nasolacrimal duct', () => DUCTC.getPoint(0.55), '#F0D880', tOn('sac')),
    lb('opening into the inferior meatus', () => DUCT1.clone().add(V3(0.1, -0.15, 0)), '#F0D880', () => tear() && st.tsel === 'sac'),
    lb('upper lid', () => lidW(LID, -0.2, 0.62, RO), '#F0B8A0', tOn('lids', true), true),
    lb('lower lid', () => lidW(LID, -0.25, -0.68, RO), '#F0B8A0', tOn('lids', true), true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>The orbit</b> is a bony pyramid 4.5–5 cm deep with its apex pointing back. At the apex, the four rectus muscles arise from the common tendinous ring; the obliques reach the eye from above and below. Pick a muscle or a gaze direction: the arrows show where the person is looking, from their own point of view.';
  const INTRO2 = '<b>Nerves of the orbit.</b> The optic nerve passes through the optic canal; the nerves of the eye muscles (III, IV, VI) and the ophthalmic nerve (V₁) pass through the superior orbital fissure. Muscles are colored by nerve: III orange, IV green, VI blue. Pick a nerve; for III, IV, and VI you can turn on “Palsy.”';
  const INTRO3 = '<b>The lacrimal apparatus.</b> Tears are made by a gland in the upper outer corner of the orbit. Blinking spreads them over the eye and sweeps them to the inner corner, into the lacrimal lake. From there they drain through the puncta and canaliculi into the lacrimal sac, and down the nasolacrimal duct into the nose.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'mus') { ib.info.innerHTML = st.msel ? OR_MUS.find((m) => m.id === st.msel).text : st.gaze !== 'c' ? gz().text : INTRO; return; }
      if (st.mode === 'nrv') { const n = OR_NERVE.find((x) => x.id === st.nsel); ib.info.innerHTML = n ? (st.palsy && n.palsy ? n.palsy : n.text) : INTRO2; return; }
      const t = OR_TEAR.find((x) => x.id === st.tsel); ib.info.innerHTML = t ? t.text : INTRO3;
    };
    refs.modeSeg = seg([{ id: 'mus', label: 'Muscles' }, { id: 'nrv', label: 'Nerves' }, { id: 'tear', label: 'Tears' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.mseg = refs.gseg = refs.nseg = refs.tseg = refs.vseg = refs.palT = null;
      if (st.mode !== 'tear') { refs.vseg = seg([{ id: 'obl', label: 'Oblique' }, { id: 'top', label: 'Top' }, { id: 'side', label: 'Lateral' }, { id: 'front', label: 'Front' }], () => (st.mode === 'nrv' && st.palsy ? '' : st.view), (v) => setView(v)); view.append(refs.vseg); }
      if (st.mode === 'mus') {
        refs.mseg = seg([{ id: 'all', label: 'All' }, ...OR_MUS.map((m) => ({ id: m.id, label: m.name, color: m.col }))], () => st.msel || 'all', (v) => setMus(v));
        refs.gseg = seg(OR_GAZE.map((g) => ({ id: g.id, label: g.ar })), () => st.gaze, (v) => setGaze(v));
        refs.gseg.style.cssText = 'display:grid;grid-template-columns:repeat(3,38px);gap:2px;width:max-content';
        [...refs.gseg.children].forEach((b, i) => { b.style.justifyContent = 'center'; b.style.padding = '4px 0'; b.title = OR_GAZE[i].name; b.setAttribute('aria-label', OR_GAZE[i].name); });
        box.append(h('div', { style: 'display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start' },
          h('div', { style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'Muscles', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.mseg)),
          h('div', {}, h('div', { class: 'glabel' }, 'Gaze'), h('div', { class: 'gctl' }, refs.gseg))));
        view.append(refs.rot);
      } else if (st.mode === 'nrv') {
        refs.nseg = seg([{ id: 'all', label: 'All' }, ...OR_NERVE.map((n) => ({ id: n.id, label: n.name, color: n.col }))], () => st.nsel || 'all', (v) => setNerve(v));
        box.append(h('div', { class: 'glabel' }, 'Nerve', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.nseg));
        if (OR_NERVE.find((n) => n.id === st.nsel && n.palsy)) { refs.palT = toggle('Palsy', () => st.palsy, (v) => { st.palsy = v; refs.vseg && refs.vseg.sync(); applyView(); refs.setInfo(); }); box.lastChild.append(refs.palT); }
        view.append(refs.rot);
      } else {
        refs.tseg = seg([{ id: 'all', label: 'All' }, ...OR_TEAR.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.tsel || 'all', (v) => setTear(v));
        box.append(h('div', { class: 'glabel' }, 'Part', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.tseg));
        view.append(toggle('Blinking', () => st.blink, (v) => { st.blink = v; }), toggle('Tear flow', () => st.flow, (v) => { st.flow = v; }));
      }
      view.append(refs.lab);
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'View', h('kbd', {}, 'N · V')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mus', 'nrv', 'tear'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'mus') { setMus('all'); setGaze('c'); } else if (st.mode === 'nrv') setNerve('all'); else setTear('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'v' || k === 'м') && st.mode !== 'tear') { const L = ['obl', 'top', 'side', 'front']; setView(L[(L.indexOf(st.view) + 1) % 4]); return true; }
    if ((k === 'r' || k === 'к') && st.mode !== 'tear') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'mus') { const g = gz(), a = Object.keys(g.act); if (!a.length) return [['Eye muscles', '6 + 1', ''], ['Depth', '4.5–5', 'cm']]; return [['Gaze', g.name, ''], ['Nerve', [...new Set(a.map((id) => OR_MUS.find((m) => m.id === id).nv))].join(' + '), '']]; }
    if (st.mode === 'nrv') return [['Nerves', 5, 'pairs'], ['Ciliary ganglion', '≈ 2', 'mm']];
    return [['Tears per day', '0.5–1', 'mL'], ['Blinks', '15–20', '/min']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'mus' ? (st.msel ? OR_MUS.find((m) => m.id === st.msel).col : '#E8505E') : st.mode === 'nrv' ? (st.nsel ? OR_NERVE.find((n) => n.id === st.nsel).col : '#F0A04B') : (st.tsel ? OR_TEAR.find((t) => t.id === st.tsel).col : '#6FB7F0'); },
    kicker: 'Body · organ systems', title: 'Orbit and Eye',
    lede: 'Six muscles turn the eye so precisely that both eyes always point at the same spot. Three nerves control them, while tears constantly wash the eye and drain into the nose. See which muscle works for each direction of gaze and what happens when a nerve is paralyzed.',
    notes: `
      <div><h2>Structure</h2>
        <p>The orbit is a four-sided pyramid made of seven bones: frontal, sphenoid, ethmoid, lacrimal, zygomatic, maxilla, and palatine. The medial walls of the two orbits are parallel, while their axes diverge at about 45°. The orbit holds about 30 mL, and the eye fills only a fifth of that; the rest is muscles, the fat body, vessels, and nerves.</p>
        <p>The rectus muscles arise from the common tendinous ring around the optic canal; the obliques reach the eye from the front and below and (via the trochlea) from the front and above, and insert behind the equator. The optics of the eye and the visual pathway are covered in the “Vision” topic.</p></div>
      <div><h2>How it works</h2>
        <p>The eyes move together: a gaze center in the brainstem sends a single command to muscles of both eyes, for example the lateral rectus of the right eye and the medial rectus of the left. The image falls on matching spots of the two retinas, and we see one object, not two.</p>
        <p>The tear film, a few micrometers thick, has three layers: mucus from conjunctival cells, a watery layer from the lacrimal gland, and oil from the lid glands. It nourishes the cornea, washes away dust, and kills microbes with the enzyme lysozyme.</p></div>
      <div><h2>Medicine</h2><ul>
        <li><b>Strabismus</b> — the axes of the eyes do not line up. In children the brain suppresses the image from the deviating eye, and without treatment a “lazy eye” (amblyopia) develops.</li>
        <li><b>Double vision (diplopia)</b> — a common first sign of a III, IV, or VI nerve palsy: in diabetes, a tumor, an aneurysm, or raised intracranial pressure.</li>
        <li><b>Orbital floor fracture</b> from a blow to the eye: the inferior rectus gets trapped in the crack, the eye cannot look up, and the cheek goes numb (infraorbital nerve).</li>
        <li><b>Horner syndrome</b> — damage to the sympathetic pathway: mild ptosis, a small pupil, and dry facial skin on the same side.</li>
        <li><b>Dry eye</b> and <b>dacryocystitis</b> — too few tears, and inflammation of the lacrimal sac when the nasolacrimal duct is blocked (in infants the duct often opens late).</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The skull scan is translucent, and the orbital walls over the muscles are cut away depending on the view; the fat body, fasciae, conjunctiva, vessels, and the contents of the left orbit (except the eye and lids) are not shown.</li><li>Muscles are bands on straight paths that wrap around the eye; insertion sites, thickness, and bulging during contraction are averages. The eye turns without rotating around the line of sight.</li><li>The lids are a shell around the palpebral fissure without layers; the tarsal plates, their glands, and the orbicularis oculi are not shown. Nerves are drawn schematically, the arteries and veins of the orbit are not shown, and tear flow is sped up.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> clear selection</li><li><code>V</code> view · <code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  geomUpdate(true); colorMus(); buildNerves(); buildCiliary();
  setMode('mus'); st.fly = null; camera.position.copy(VIEW.obl.pos); controls.target.copy(VIEW.obl.target);
  return self;
}
export { makeOrbit };
