import { ANIM, THREE, V3, __set_rnd, envTex, flyTarget, group, h, infoBox, labLights, loadSkeletonStatic, makeControls, mulberry, pickOn, rnd, seg, toggle } from '../core.js';


// @scene skull makeSkull | Череп | @body Опора и движение
/* =========================================================
   ТЕЛО · ЧЕРЕП: настоящий скан черепа из модели скелета, раскрашенный по 22 костям (14 видов), со швами
   (по Неттеру, табл. 11–16); основание снизу — отверстия и что через них проходит (табл. 17–20);
   череп новорождённого — маленькое лицо и роднички (табл. 21)
   ========================================================= */
const SK_BONES = [
  { id: 'front', name: 'Frontal bone', col: '#6FA8E8', n: 1, cran: 1, text: '<b>Frontal bone</b> — the forehead and upper rims of the orbits; its orbital plates form the orbital roofs. Above the bridge of the nose it contains the frontal sinus. At birth the bone is in two halves; the suture between them (metopic) usually closes within the first months of life and in some people persists for life.' },
  { id: 'par', name: 'Parietal', col: '#7CC86A', n: 2, cran: 1, text: '<b>Parietal bones</b> — paired, they form most of the cranial vault. They meet each other at the sagittal suture, the frontal bone at the coronal, the occipital at the lambdoid and the temporal at the squamous suture.' },
  { id: 'occ', name: 'Occipital bone', col: '#9A7FE0', n: 1, cran: 1, text: '<b>Occipital bone</b> — the back of the vault and of the base. It contains the <b>foramen magnum</b>, where the medulla oblongata becomes the spinal cord. On each side of the foramen the condyles articulate with the first cervical vertebra (atlas) — the nodding joint.' },
  { id: 'temp', name: 'Temporal', col: '#F08AB0', n: 2, cran: 1, text: '<b>Temporal bones</b> — at the sides of the skull. Their petrous parts hide the middle and inner ear; outside are the external acoustic meatus, the mastoid process behind it and, in front, the zygomatic process and the fossa for the mandible.' },
  { id: 'sph', name: 'Sphenoid', col: '#F2C84E', n: 1, cran: 1, text: '<b>Sphenoid bone</b> is shaped like a butterfly and sits in the middle of the base, meeting every bone of the neurocranium. Its body holds the sella turcica with the pituitary and the sphenoid sinus; the greater wings show at the temples and deep in the orbits, the pterygoid processes from below.' },
  { id: 'eth', name: 'Ethmoid', col: '#FF7A5A', n: 1, cran: 1, text: '<b>Ethmoid bone</b> — a light bone between the orbits. Its cribriform plate lets olfactory nerve fibers pass from the nose to the brain, its perpendicular plate forms the upper nasal septum, and its air-cell labyrinth forms orbital walls and the superior and middle nasal conchae.' },
  { id: 'nas', name: 'Nasal', col: '#FFD3A0', n: 2, text: '<b>Nasal bones</b> — two small plates that form the bridge of the nose. They are the most often fractured facial bones.' },
  { id: 'lac', name: 'Lacrimal', col: '#E890E0', n: 2, text: '<b>Lacrimal bones</b> — the smallest facial bones, thin plates at the front of the medial orbital wall. Their fossa holds the lacrimal sac, from which tears drain down the nasolacrimal canal into the nose.' },
  { id: 'zyg', name: 'Zygomatic', col: '#3FC4E8', n: 2, text: '<b>Zygomatic bones</b> form the cheekbones and the lateral rims of the orbits; with the zygomatic process of the temporal bone they make the zygomatic arch, where the masseter muscle begins.' },
  { id: 'max', name: 'Maxilla', col: '#86DCA8', n: 2, text: '<b>Maxilla</b> — a paired bone: floor of the orbit, walls of the nose, the front two thirds of the hard palate and the alveolar process with the upper teeth. Inside is the largest sinus, the maxillary sinus.' },
  { id: 'pal', name: 'Palatine', col: '#8FA0FF', n: 2, text: '<b>Palatine bones</b> — L-shaped plates behind the maxillae: their horizontal plates form the back of the hard palate, their vertical plates part of the nasal wall. Best seen from below.' },
  { id: 'vom', name: 'Vomer', col: '#E04848', n: 1, text: '<b>Vomer</b> — an unpaired plate deep in the nose: the lower and back part of the nasal septum. The ethmoid joins it above, the septal cartilage in front.' },
  { id: 'conch', name: 'Inferior conchae', col: '#B08CFF', n: 2, text: '<b>Inferior nasal conchae</b> — separate scrolls on the side walls of the nose (the superior and middle conchae belong to the ethmoid). Covered with mucosa, they warm and moisten inhaled air.' },
  { id: 'mand', name: 'Mandible', col: '#D8C0A0', n: 1, text: '<b>Mandible</b> — the only movable bone of the skull. Its condyles form the two temporomandibular joints with the temporal bones, which always work together: when the mouth opens wide, the condyle glides forward onto the articular tubercle.' },
];
// отверстия основания черепа (вид снизу): X — от срединной плоскости, z — вперёд (ед. ≈ 10 см)
const SK_FOR = [
  { id: 'magn', name: 'Foramen magnum', X: 0, z: -0.01, y: 15.73, col: '#9A7FE0', text: '<b>Foramen magnum</b> — the largest opening. Here the medulla oblongata becomes the spinal cord; the vertebral arteries and the spinal roots of the accessory nerve (XI) pass alongside. Its rim lies in the occipital bone.' },
  { id: 'hypo', L: 1, name: 'Hypoglossal canal', X: 0.13, z: 0.1, col: '#C0B0FF', text: '<b>Hypoglossal canal</b> — above the occipital condyle. The hypoglossal nerve (XII), the motor nerve of the tongue, leaves through it.' },
  { id: 'jug', name: 'Jugular foramen', X: 0.22, z: 0.1, col: '#5A8CFF', text: '<b>Jugular foramen</b> — between the occipital and temporal bones. The internal jugular vein (draining blood from the brain) leaves through it, with three cranial nerves: glossopharyngeal (IX), vagus (X) and accessory (XI).' },
  { id: 'car', L: 1, name: 'Carotid canal', X: 0.25, z: 0.16, col: '#FF5A5A', text: '<b>Carotid canal</b> — in the petrous temporal bone. The internal carotid artery bends through it into the cranial cavity to supply the brain.' },
  { id: 'stylo', name: 'Stylomastoid', X: 0.38, z: 0.06, col: '#F2D27A', text: '<b>Stylomastoid foramen</b> — between the styloid and mastoid processes. The facial nerve (VII) exits here to the muscles of facial expression; when it is damaged, half of the face droops (Bell’s palsy).' },
  { id: 'ovale', L: 1, name: 'Foramen ovale', X: 0.26, z: 0.3, col: '#F2A040', text: '<b>Foramen ovale</b> — in the greater wing of the sphenoid. The third division of the trigeminal nerve (V₃) passes through it to the chewing muscles, the lower teeth and the skin of the chin.' },
  { id: 'spin', name: 'Foramen spinosum', X: 0.31, z: 0.26, col: '#FF8C8C', text: '<b>Foramen spinosum</b> — small, behind the foramen ovale. The middle meningeal artery enters the skull through it; its tear after a blow to the temple causes a dangerous epidural hematoma.' },
  { id: 'lac', L: 1, name: 'Foramen lacerum', X: 0.12, z: 0.27, col: '#C8C8C8', text: '<b>Foramen lacerum</b> — a gap between the petrous temporal, occipital and sphenoid bones. In life it is closed by cartilage; the internal carotid artery runs across its upper surface.' },
  { id: 'gpal', name: 'Greater palatine', X: 0.13, z: 0.53, col: '#8FA0FF', text: '<b>Greater palatine foramen</b> — at the back corner of the hard palate. The greater palatine nerve and vessels emerge here to the palatal mucosa; dentists inject anesthetic at this spot.' },
  { id: 'inc', name: 'Incisive', X: 0, z: 0.84, col: '#86DCA8', text: '<b>Incisive foramen</b> — behind the upper incisors, in the midline of the palate. The nasopalatine nerve passes through it to the mucosa of the front of the palate.' },
];
// роднички новорождённого
const SK_FONT = [
  { id: 'ant', name: 'Anterior', text: '<b>Anterior (large) fontanelle</b> — a diamond where the frontal and both parietal bones meet, about 2–3 cm across. The largest; it closes by 1–2 years. Doctors use it to judge intracranial pressure and dehydration: it sinks when the baby lacks fluid.' },
  { id: 'post', name: 'Posterior', text: '<b>Posterior (small) fontanelle</b> — a triangle between the parietal and occipital bones. It closes early, by 2–3 months (in many babies it is almost closed at birth).' },
  { id: 'sph', name: 'Sphenoidal', text: '<b>Sphenoidal fontanelle</b> — at the side, where the frontal, parietal, temporal and sphenoid bones meet (in adults this spot is called the pterion). It closes at about 6 months.' },
  { id: 'mast', name: 'Mastoid', text: '<b>Mastoid fontanelle</b> — at the back of the side, where the parietal, occipital and temporal bones meet (the asterion). It closes by 6–18 months.' },
];
function makeSkull() {
  __set_rnd(mulberry(1414));
  const DK = !matchMedia('(max-width:700px)').matches;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const fill = new THREE.DirectionalLight(0xfff2e0, 0.55); fill.position.set(0.3, -1, 0.4); scene.add(fill);   // снизу — чтобы основание не было чёрным
  const under = new THREE.DirectionalLight(0xfff6ea, 0); under.position.set(-0.4, -1, -0.2); scene.add(under);   // включается при взгляде снизу
  const MX = 0.11, SC = V3(MX, 16.1, 0.12);
  const OFF = DK ? 0.62 : 0, OFY = DK ? 0 : 0.2;
  const VIEW = {
    front: flyTarget(SC.clone().add(V3(-OFF, -0.15 + OFY, 0)), SC.clone().add(V3(-OFF, 0.2, 5.55))),
    side: flyTarget(SC.clone().add(V3(0, -0.19 + OFY, OFF)), SC.clone().add(V3(5.1, 0.16, OFF))),
    top: flyTarget(SC.clone().add(V3(OFF, 0, -0.1 + OFY)), SC.clone().add(V3(OFF, 5.75, -0.36 + OFY))),
    bottom: flyTarget(SC.clone().add(V3(-OFF, 0, 0.05 + OFY * 0.4)), SC.clone().add(V3(-OFF, -4.5, 0.2 + OFY * 0.4))),
    babyFront: flyTarget(SC.clone().add(V3(-OFF, 0.25 + OFY, 0)), SC.clone().add(V3(-OFF, 2.7, 4.6))),
    baby: flyTarget(SC.clone().add(V3(-OFF * 0.6, 0.2 + OFY, OFF * 0.55)), SC.clone().add(V3(2.6, 4.1, 3.0))),
    babyAnt: flyTarget(SC.clone().add(V3(-OFF, 0.2, 0.15 - OFY)), SC.clone().add(V3(-OFF + 0.3, 5.8, 1.9 - OFY))),
    babyBack: flyTarget(SC.clone().add(V3(-OFF * 0.6, 0.2 + OFY, -OFF * 0.55)), SC.clone().add(V3(2.6, 3.6, -3.4))),
    babyPost: flyTarget(SC.clone().add(V3(OFF, 0.2, -0.3 + OFY)), SC.clone().add(V3(OFF + 0.3, 5.0, -3.2 + OFY))),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200);
  const controls = makeControls(camera, SC); controls.minDistance = 1.5; controls.maxDistance = 20;
  const G = new THREE.Group(); scene.add(G);
  const st = { t: 0, mode: 'bones', view: 'front', sel: null, fsel: null, nsel: null, labels: true, sut: true, rot: false, fly: null, loaded: false, err: null, baby: 0, babyT: 0 };
  const BN = Object.fromEntries(SK_BONES.map((b) => [b.id, { ...b, meshes: [], mats: [], anchor: V3(0, 0, 0), nrm: V3(0, 0, 1) }])), pick = [];
  // ---------- разметка вершин по костям (система черепа: X от срединной плоскости, y вверх, z вперёд) ----------
  const occl = (z) => 15.535 + 0.05 * Math.min(1, Math.max(0, (0.9 - z) / 0.5));
  const zcor = (y) => 0.3 + 0.376 * (17.05 - y);                       // венечный шов
  const zlam = (y) => -0.22 - 0.437 * (y - 15.98);                     // ламбдовидный
  const sq = (z) => (z > 0.15 ? 16.42 - 1.6 * (z - 0.15) ** 2 : 16.42 - 3.3 * (0.15 - z) ** 2);   // чешуйчатый
  function cls(x, y, z) {
    const X = x - MX, aX = Math.abs(X);
    if (y < 15.0) return null;
    if (z > 0.15 && y < occl(z) && aX < 0.62) return 'mand';
    if (aX > 0.36 && aX < 0.6 && z > 0.13 && z < 0.5 && y < (z < 0.3 ? 15.98 : 15.93)) return 'mand';
    if (aX < 0.115 && y > 15.8 && y < 16.1 && z > 0.4 && z < 0.93) return aX < 0.025 ? 'vom' : y < 15.96 && aX > 0.035 ? 'conch' : 'eth';
    if (z > 0.9 && aX < 0.085 && y > 16.06 && y < 16.3) return 'nas';
    const e = ((aX - 0.29) / 0.165) ** 2 + ((y - 16.25) / 0.17) ** 2;   // глазница изнутри
    if (e < 1 && z > 0.45 && z < 0.86) {
      if (y > 16.33) return 'front';
      if (aX < 0.17) return z > 0.79 ? 'lac' : 'eth';
      if (y < 16.13) return 'max';
      if (aX > 0.36) return z > 0.66 ? 'zyg' : 'sph';
      return z < 0.58 ? 'sph' : aX < 0.2 ? 'eth' : 'max';
    }
    if (y > 15.82 && y < 16.3 && z > 0.6 && aX > 0.34 + (16.08 - y) * 0.35 && (z > 0.74 || y < 16.06)) return 'zyg';
    if (aX > 0.5 && z > 0.42 && z < 0.75 && y > 15.88 && y < 16.08) return 'zyg';
    if (aX > 0.5 && z > 0.1 && z <= 0.42 && y > 15.88 && y < 16.08) return 'temp';
    const palR = aX < 0.17 && z > 0.3 && z < 0.56 && y > 15.66 && y < 15.82;
    if (z > 0.55 && y < 16.12 && !palR) return 'max';
    if (aX < 0.17 && z > 0.8 && y < 16.3) return 'max';
    if (y < 15.82 && aX < 0.42 && z > 0.2) return palR ? 'pal' : z < 0.42 && aX < 0.3 ? 'sph' : 'max';
    if (z > zcor(y) && y > (aX > 0.45 && z < 0.75 ? 16.34 : 16.24)) return 'front';
    if (z < zlam(y) && y > 15.98) return 'occ';
    if (y <= 16.0 && z < Math.min(0.33, Math.max(-0.05 - 0.6 * (aX - 0.25), 0.33 - 1.6 * Math.max(0, aX - 0.12)))) return 'occ';
    if (aX > 0.3 && y < sq(z) && z > -0.3 && z < 0.47 && (y < 16.12 || aX > 0.45)) return 'temp';
    if (y < 16.12 && aX > 0.13 && z < (aX < 0.3 ? 0.28 : 0.28 + (aX - 0.3))) return 'temp';
    if (y < (aX > 0.45 ? 16.34 : 16.26) && z > 0.15 && (aX < 0.3 || z > 0.4)) return 'sph';
    if (y < 16.12) return 'sph';
    return 'par';
  }
  // новорождённый: лицо и челюсть плавно сжимаются к точке под глазницами (у младенца лицо ≈ 1/8 черепа, у взрослого ≈ 1/2)
  const BA = V3(MX, 16.22, 0.42);
  function babyPos(x, y, z, out) {
    const sm = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    {   // зубов у новорождённого нет: полосу зубов у линии смыкания сжимаем в низкие десневые валики
      const dy = y - occl(z), a = Math.abs(dy), sg = Math.sign(dy), wt = sm(0.28, 0.45, z);
      const sh = a < 0.1 ? a * 0.7 : 0.07 * Math.max(0, 1 - (a - 0.1) / 0.15);
      y -= sg * sh * wt;
    }
    const w = sm(16.36, 15.95, y) * sm(0.02, 0.38, z);
    const k = 1 - 0.45 * w;
    out.set(BA.x + (x - BA.x) * k, BA.y + (y - BA.y) * k, BA.z + (z - BA.z) * (1 - 0.5 * w));
    out.y -= 0.0; return out;
  }
  const boneMat = (col) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).lerp(new THREE.Color(0xf0e6d4), 0.18), roughness: 0.62, clearcoat: 0.15, sheen: 0.25, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, side: THREE.FrontSide });
  const sutMat = new THREE.LineBasicMaterial({ color: 0x2a1c12, transparent: true, opacity: 0.85 });
  const fontMat = new THREE.MeshPhysicalMaterial({ color: 0xff4f86, roughness: 0.4, transparent: true, opacity: 0, depthWrite: false, emissive: new THREE.Color(0xff4a80), emissiveIntensity: 0.4, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const FONT = {};   // id → { mesh, pos }
  const sutGroup = new THREE.Group(); G.add(sutGroup);
  const forGroup = new THREE.Group(); G.add(forGroup);
  const FOR = Object.fromEntries(SK_FOR.map((f) => [f.id, { ...f, pos: V3(MX + f.X, f.y || 15.8, f.z), mesh: null }]));
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; });
    const g = head.geometry, P = g.attributes.position, LB = g.attributes.aLabel, IX = g.index.array, N = P.count;
    {   // складка скана на темени (кружок из нескольких слоёв): вырезаем участок целиком — вырез закроет гладкий купол
      const C0 = V3(MX, 16.25, 0.1), cd = V3(MX - 0.09, 17.13, -0.03).sub(C0).normalize(), w = V3(0, 0, 0);
      const inC = (i) => { w.fromBufferAttribute(P, i).sub(C0); return w.y > 0.6 && w.normalize().dot(cd) > 0.9915; };
      for (let t = 0; t < IX.length; t += 3) if (inC(IX[t]) && inC(IX[t + 1]) && inC(IX[t + 2])) { IX[t + 1] = IX[t]; IX[t + 2] = IX[t]; }
    }
    {   // на макушке у скана лишний внутренний слой с вывернутыми треугольниками — убираем его (вырез закроет заплатка)
      const C0 = V3(MX, 16.25, 0.1), a = V3(0, 0, 0), b = V3(0, 0, 0), c = V3(0, 0, 0);
      for (let t = 0; t < IX.length; t += 3) {
        a.fromBufferAttribute(P, IX[t]); b.fromBufferAttribute(P, IX[t + 1]); c.fromBufferAttribute(P, IX[t + 2]);
        const cy = (a.y + b.y + c.y) / 3; if (cy < 16.6) continue;
        const n = b.clone().sub(a).cross(c.clone().sub(a)), m = a.clone().add(b).add(c).multiplyScalar(1 / 3).sub(C0);
        if (n.dot(m) < 0) { IX[t + 1] = IX[t]; IX[t + 2] = IX[t]; }
      }
    }
    const nb = Array.from({ length: N }, () => []);
    for (let t = 0; t < IX.length; t += 3) { const a = IX[t], b = IX[t + 1], c = IX[t + 2]; nb[a].push(b, c); nb[b].push(a, c); nb[c].push(a, b); }
    // шейные позвонки: заливка от нижних позвонков вверх до сустава с черепом
    const vert = new Uint8Array(N), q = [];
    for (let i = 0; i < N; i++) { const aX = Math.abs(P.getX(i) - MX); if (P.getY(i) < 15.45 && aX < 0.3 && P.getZ(i) < 0.2) { vert[i] = 1; q.push(i); } }
    while (q.length) { const i = q.pop(); for (const j of nb[i]) { if (vert[j]) continue; const y = P.getY(j), z = P.getZ(j); if (z < 0.26 && y < (z > -0.15 ? 15.71 : 15.68)) { vert[j] = 1; q.push(j); } } }
    for (let i = 0; i < N; i++) { const aX = Math.abs(P.getX(i) - MX), y = P.getY(i), z = P.getZ(i); if (y < 15.79 && aX < 0.15 && z > -0.15 && z < 0.1) vert[i] = 1; }
    let lab = new Array(N);
    for (let i = 0; i < N; i++) lab[i] = LB.getX(i) < 0.5 && !vert[i] ? cls(P.getX(i), P.getY(i), P.getZ(i)) : null;
    for (let it = 0; it < 5; it++) {   // сглаживание границ: голос большинства соседей
      const nl = lab.slice();
      for (let i = 0; i < N; i++) {
        if (!lab[i]) continue; const cnt = { [lab[i]]: 1 };
        for (const j of nb[i]) if (lab[j]) cnt[lab[j]] = (cnt[lab[j]] || 0) + 1;
        let best = lab[i]; for (const k in cnt) if (cnt[k] > cnt[best]) best = k; nl[i] = best;
      }
      lab = nl;
    }
    const VB = { temp: 1, par: 1, sph: 1, occ: 1, zyg: 1, max: 1 };   // свод и основание: ещё несколько проходов, чтобы границы шли ровнее
    for (let it = 0; it < 4; it++) {
      const nl = lab.slice();
      for (let i = 0; i < N; i++) {
        if (!VB[lab[i]]) continue; const cnt = { [lab[i]]: 1 };
        for (const j of nb[i]) if (VB[lab[j]]) cnt[lab[j]] = (cnt[lab[j]] || 0) + 1;
        let best = lab[i]; for (const k in cnt) if (cnt[k] > cnt[best]) best = k; nl[i] = best;
      }
      lab = nl;
    }
    {   // мелкие островки чужого цвета (в глазницах) отдаём соседней кости: у каждой кости (по сторонам) остаётся только самый большой кусок
      const comp = new Int32Array(N).fill(-1), sizes = [], keyOf = (i) => (lab[i] ? lab[i] + (BN[lab[i]] && BN[lab[i]].n === 2 ? (P.getX(i) > MX ? 'L' : 'R') : '') : null);
      for (let i = 0; i < N; i++) { if (comp[i] >= 0 || !lab[i]) continue; const k = keyOf(i), c = sizes.length, st2 = [i]; comp[i] = c; let n = 0; while (st2.length) { const v = st2.pop(); n++; for (const j of nb[v]) if (comp[j] < 0 && keyOf(j) === k) { comp[j] = c; st2.push(j); } } sizes.push([n, k]); }
      const big = {}; sizes.forEach(([n, k], c) => { if (!big[k] || n > sizes[big[k]][0]) big[k] = c; });
      for (let pass = 0; pass < 10; pass++) for (let i = 0; i < N; i++) {
        const c = comp[i]; if (c < 0 || big[sizes[c][1]] === c || sizes[c][0] > 60) continue;
        const cnt = {}; for (const j of nb[i]) if (lab[j] && comp[j] !== c) cnt[lab[j]] = (cnt[lab[j]] || 0) + 1;
        let best = null; for (const k in cnt) if (!best || cnt[k] > cnt[best]) best = k; if (best) { lab[i] = best; comp[i] = -2; }
      }
    }
    // треугольники делим по костям через середины рёбер: граница и шов идут ровнее, чем по краям крупных треугольников скана
    const nrmA = new Float32Array(N * 3); { const gg = g.clone(); gg.computeVertexNormals(); nrmA.set(gg.attributes.normal.array); }
    const EX = [], EXN = [], exLab = [], emid = new Map();
    const gx = (v) => (v < N ? P.getX(v) : EX[(v - N) * 3]), gy = (v) => (v < N ? P.getY(v) : EX[(v - N) * 3 + 1]), gz = (v) => (v < N ? P.getZ(v) : EX[(v - N) * 3 + 2]);
    const gn = (v, i) => (v < N ? nrmA[v * 3 + i] : EXN[(v - N) * 3 + i]);
    const labOf = (v) => (v < N ? lab[v] : exLab[v - N]);
    const addV = (vs) => {
      const i = N + EX.length / 3, n = [0, 0, 0];
      for (const c of [gx, gy, gz]) EX.push(vs.reduce((s, v) => s + c(v), 0) / vs.length);
      vs.forEach((v) => { for (let k = 0; k < 3; k++) n[k] += gn(v, k); });
      const l = Math.hypot(n[0], n[1], n[2]) || 1; EXN.push(n[0] / l, n[1] / l, n[2] / l); exLab.push(vs.map((v) => labOf(v)).find(Boolean) || null); return i;
    };
    const mid = (a, b) => { const key = a < b ? a + '_' + b : b + '_' + a; let i = emid.get(key); if (i === undefined) { i = addV([a, b]); emid.set(key, i); } return i; };
    const PAIR = (k) => k && BN[k] && (BN[k].n === 2 || k === 'front') && k !== 'conch';
    const vk = lab.map((k, v) => (PAIR(k) ? k + (P.getX(v) > MX ? 'L' : 'R') : k));
    const base = (k) => (k && !BN[k] ? k.slice(0, -1) : k);
    const SKIP = { mand: 1, vom: 1, conch: 1 };
    const tris = {}, allT = [], sut = [], met = [];
    const put = (key, a, b, c) => { const k = base(key); if (!k) return; (tris[k] = tris[k] || []).push(a, b, c); if (k !== 'mand') allT.push(a, b, c); };
    const seg = (k1, k2, a, b) => { const b1 = base(k1), b2 = base(k2); if (!b1 || !b2 || SKIP[b1] || SKIP[b2]) return; (b1 === 'front' && b2 === 'front' ? met : sut).push(a, b); };
    for (let t = 0; t < IX.length; t += 3) {
      let a = IX[t], b = IX[t + 1], c = IX[t + 2], A = vk[a], B = vk[b], C = vk[c];
      if (A === B && B === C) { put(A, a, b, c); continue; }
      if (A !== B && B !== C && A !== C) {
        const gc = addV([a, b, c]), ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
        put(A, a, ab, gc); put(A, a, gc, ca); put(B, b, bc, gc); put(B, b, gc, ab); put(C, c, ca, gc); put(C, c, gc, bc);
        seg(A, B, ab, gc); seg(B, C, bc, gc); seg(C, A, ca, gc); continue;
      }
      if (A === C) { [a, b, c] = [c, a, b]; [A, B, C] = [C, A, B]; } else if (B === C) { [a, b, c] = [b, c, a]; [A, B, C] = [B, C, A]; }
      const ac = mid(a, c), bc = mid(b, c);
      put(A, a, b, bc); put(A, a, bc, ac); put(C, ac, bc, c); seg(A, C, ac, bc);
    }
    // заплатки: где сняты шейные позвонки, в основании остались вырезы — закрываем их «веером» цветом соседней кости
    const dir = new Map(); Object.entries(tris).forEach(([k, arr]) => { if (k === 'mand') return;   // и суставные ямки: там скан сросся с нижней челюстью
      for (let i = 0; i < arr.length; i += 3) for (let e = 0; e < 3; e++) dir.set(arr[i + e] + '_' + arr[i + (e + 1) % 3], k); });
    const nextE = new Map(); dir.forEach((k, key) => { const [u, v] = key.split('_'); if (!dir.has(v + '_' + u)) nextE.set(+u, [+v, k]); });
    const used = new Set(); let fm = null;
    nextE.forEach((_, s0) => {
      if (used.has(s0)) return; const loop = []; let u = s0;
      while (!used.has(u) && nextE.has(u) && loop.length < 5000) { used.add(u); const [v, k] = nextE.get(u); loop.push([u, v, k]); u = v; }
      if (loop.length < 3) return;
      const cv = addV(loop.map((e) => e[0])); if (gz(cv) > 0.3) {   // рот: в скане зубы срослись с нижней челюстью — снизу (без неё) закрываем ровной заплаткой цвета верхней челюсти
        const sm = new Map(), L = loop.length;   // край заплатки — сглаженный по соседям вдоль контура (без зубцов)
        loop.forEach(([u], i) => { let x = 0, y = 0, z = 0; for (let d = -3; d <= 3; d++) { const q = loop[(i + d + L) % L][0]; x += gx(q); y += gy(q); z += gz(q); } sm.set(u, [x / 7, y / 7, z / 7]); });
        const P3 = (v) => sm.get(v) || [gx(v), gy(v), gz(v)];
        const pos = [], bp = [], nrm = [], w = V3(0, 0, 0), add = (v) => { const [x, y, z] = P3(v); pos.push(x, y, z); babyPos(x, y, z, w); bp.push(w.x, w.y, w.z); nrm.push(0, -1, 0); };
        loop.forEach(([u, v]) => { const [ux, , uz] = P3(u), [vx, , vz] = P3(v), cr = (uz - gz(cv)) * (vx - gx(cv)) - (ux - gx(cv)) * (vz - gz(cv)); if (cr > 0) { add(v); add(u); } else { add(u); add(v); } add(cv); });   // все треугольники — лицом вниз
        const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gg.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); gg.morphAttributes.position = [new THREE.Float32BufferAttribute(bp, 3)];
        const mt = boneMat(BN.max.col); const mm = new THREE.Mesh(gg, mt); mm.userData.pick = 'max'; mm.morphTargetInfluences = [0]; mm.visible = false;
        G.add(mm); pick.push(mm); BN.max.mats.push(mt); st.mouth = (st.mouth || []).concat(mm); return;
      }   // рот (место смыкания с нижней челюстью) не закрываем — там нёбо
      if (gy(cv) > 16.8) {   // на своде — гладкий купол из колец по форме черепа, а не плоский веер
        const C0d = V3(MX, 16.25, 0.1), rOf = (v) => Math.hypot(gx(v) - C0d.x, gy(v) - C0d.y, gz(v) - C0d.z);
        const rr = loop.reduce((sm, e) => sm + rOf(e[0]), 0) / loop.length;
        const addP = (x, y, z, rad, k) => { const dx = x - C0d.x, dy = y - C0d.y, dz = z - C0d.z, l = Math.hypot(dx, dy, dz) || 1, i = N + EX.length / 3; EX.push(C0d.x + dx / l * rad, C0d.y + dy / l * rad, C0d.z + dz / l * rad); EXN.push(dx / l, dy / l, dz / l); exLab.push(k); return i; };
        const c = addP(gx(cv), gy(cv), gz(cv), rr, labOf(cv)), ring = [new Map(), new Map()], T = [2 / 3, 1 / 3];
        const rv = (j, u) => { if (!ring[j].has(u)) { const t = T[j]; ring[j].set(u, addP(gx(c) + (gx(u) - gx(c)) * t, gy(c) + (gy(u) - gy(c)) * t, gz(c) + (gz(u) - gz(c)) * t, rr + (rOf(u) - rr) * t, labOf(u))); } return ring[j].get(u); };
        loop.forEach(([u, v, k]) => { const u1 = rv(0, u), v1 = rv(0, v), u2 = rv(1, u), v2 = rv(1, v); put(k, v, u, u1); put(k, v, u1, v1); put(k, v1, u1, u2); put(k, v1, u2, v2); put(k, v2, u2, c); });
        const cross = loop.filter(([u, v]) => (gx(u) > MX) !== (gx(v) > MX)).map(([u]) => u);   // сагиттальный шов — через купол
        if (cross.length === 2) sut.push(cross[0], c, c, cross[1]);
        return;
      }
      loop.forEach(([u2, v2, k]) => put(k, v2, u2, cv));
      if (gy(cv) < 16.2 && Math.abs(gx(cv) - MX) < 0.08 && gz(cv) > -0.2 && gz(cv) < 0.2 && (!fm || loop.length > fm.n)) fm = { n: loop.length, y: Math.min(...loop.map((e) => gy(e[0]))) };
    });
    if (fm) {   // большое затылочное отверстие — ровный тёмный овал на заплатке
      const eg = new THREE.CircleGeometry(1, 40), ec = [], pp = eg.attributes.position;
      for (let i = 0; i < pp.count; i++) { const r = Math.hypot(pp.getX(i), pp.getY(i)); const c = new THREE.Color(0x0e0a08).lerp(new THREE.Color(0x4a3c30), r); ec.push(c.r, c.g, c.b); }
      eg.setAttribute('color', new THREE.Float32BufferAttribute(ec, 3));
      const fmMesh = new THREE.Mesh(eg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
      fmMesh.rotation.x = Math.PI / 2; fmMesh.scale.set(0.135, 0.17, 1); fmMesh.position.set(MX, fm.y - 0.006, 0.0); G.add(fmMesh); st.fmMesh = fmMesh;
      const rim = new THREE.Mesh(new THREE.RingGeometry(1, 1.12, 48), new THREE.MeshBasicMaterial({ color: 0xc9b9d8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
      rim.position.z = -0.001; fmMesh.add(rim);
      // затылочные мыщелки — по бокам передней половины отверстия (суставы с атлантом)
      const conMat = boneMat('#D6CAFA'); conMat.emissive = new THREE.Color(0x3a2e5a);
      [-1, 1].forEach((sg) => { const cm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), conMat); cm.scale.set(0.05, 0.035, 0.085); cm.position.set(MX + sg * 0.165, fm.y - 0.012, 0.07); cm.rotation.y = -sg * 0.35; G.add(cm); BN.occ.mats.push(conMat); st.condyles = (st.condyles || []).concat(cm); });
    }
    const tmp = V3(0, 0, 0);
    function subGeo(arr, colOf) {
      const map = new Map(), pos = [], bp = [], cl = [];
      const idx = arr.map((v) => { if (!map.has(v)) { map.set(v, pos.length / 3); const x = gx(v), y = gy(v), z = gz(v); pos.push(x, y, z); babyPos(x, y, z, tmp); bp.push(tmp.x, tmp.y, tmp.z); if (colOf) { const c = colOf(v); cl.push(c.r, c.g, c.b); } } return map.get(v); });
      const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gg.setIndex(idx); gg.computeVertexNormals();
      if (colOf) gg.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3));
      gg.morphAttributes.position = [new THREE.Float32BufferAttribute(bp, 3)]; return gg;
    }
    Object.entries(tris).forEach(([k, arr]) => {
      const B = BN[k], m = new THREE.Mesh(subGeo(arr), boneMat(B.col)); m.userData.pick = k; m.morphTargetInfluences = [0];
      pick.push(m); B.mats.push(m.material); B.meshes.push(m); G.add(m);
      // точка для подписи: ближайшая к «подсказке» вершина этой кости
      const hint = BONE_HINT[k]; let best = 1e9, bi = -1;
      for (const v of arr) { const d = (gx(v) - MX - hint[0]) ** 2 + (gy(v) - hint[1]) ** 2 + (gz(v) - hint[2]) ** 2; if (d < best) { best = d; bi = v; } }
      B.anchor.set(gx(bi), gy(bi), gz(bi)); B.nrm.set(hint[3], hint[4], hint[5]).normalize();
    });
    // изнанка (видна сквозь глазницы и дыры скана): обычно тёмная, в виде снизу — цветом соседней кости, чуть темнее
    const cream = new THREE.Color(0xf0e6d4), vc = new THREE.Color();
    const deep = new THREE.Color(0x4a4038);   // изнанка свода (видна сквозь большое затылочное отверстие) — приглушённая полость
    const innerCol = (v) => { const k = labOf(v), y = gy(v), t = Math.min(1, Math.max(0, (y - 15.98) / 0.3)) * Math.min(1, Math.max(0, (0.4 - gz(v)) / 0.2)); return vc.set(k && BN[k] ? BN[k].col : '#cfc3b0').lerp(cream, 0.18).multiplyScalar(0.78).lerp(deep, t * t * (3 - 2 * t)); };
    st.innerDark = new THREE.MeshBasicMaterial({ color: 0x2a211b, side: THREE.BackSide });
    st.innerLit = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.BackSide });
    const inner = new THREE.Mesh(subGeo(allT, innerCol), st.innerDark); inner.morphTargetInfluences = [0]; G.add(inner); st.inner = inner;
    // швы — отрезки границ между костями (парные кости — по сторонам), чуть над поверхностью
    const lineMesh = (list, mat) => { const sp = [], sb = []; (list || []).forEach((v) => { const o = 0.004; const x = gx(v) + gn(v, 0) * o, y = gy(v) + gn(v, 1) * o, z = gz(v) + gn(v, 2) * o; sp.push(x, y, z); babyPos(x, y, z, tmp); sb.push(tmp.x, tmp.y, tmp.z); });
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sg.morphAttributes.position = [new THREE.Float32BufferAttribute(sb, 3)];
      const sl = new THREE.LineSegments(sg, mat); sl.morphTargetInfluences = [0]; sutGroup.add(sl); return sl; };
    st.sutLine = lineMesh(sut, sutMat); st.metLine = lineMesh(met, sutMat);   // метопический шов — только у новорождённого
    // роднички: участки поверхности свода вокруг точек схождения швов
    const FPT = { ant: [V3(MX, 17.06, 0.3), 0.2, 0.66], post: [V3(MX, 16.9, -0.62), 0.09, 1], sph: [V3(MX + 0.6, 16.24, 0.52), 0.075, 1], mast: [V3(MX + 0.58, 16.0, -0.22), 0.07, 1] };
    Object.entries(FPT).forEach(([id, [c, r, sx]]) => {
      // ближайшая вершина свода к точке — центр родничка
      let best = 1e9, ci = 0; for (let i = 0; i < N; i++) { if (!lab[i]) continue; const d = (P.getX(i) - c.x) ** 2 + (P.getY(i) - c.y) ** 2 + (P.getZ(i) - c.z) ** 2; if (d < best) { best = d; ci = i; } }
      const C = V3(P.getX(ci), P.getY(ci), P.getZ(ci)), n = V3(nrmA[ci * 3], nrmA[ci * 3 + 1], nrmA[ci * 3 + 2]);
      const arr = [], mir = id === 'sph' || id === 'mast';
      const inF = (v, cc) => { const dx = P.getX(v) - cc.x, dy = P.getY(v) - cc.y, dz = P.getZ(v) - cc.z; if (dx * n.x + dy * n.y + dz * n.z < -0.08) return false; if (id === 'ant') return Math.abs(dx) / r + Math.abs(dz) / (r / sx) < 1 && Math.abs(dy) < 0.12; if (id === 'post') return Math.abs(dx) < r * (1 - Math.max(0, -(dz + dy * 0.8)) / 0.12) && dx * dx + dy * dy + dz * dz < 0.012; return dx * dx + dy * dy + dz * dz < r * r; };
      const centers = mir ? [C, V3(2 * MX - C.x, C.y, C.z)] : [C];
      for (let t = 0; t < IX.length; t += 3) for (const cc of centers) if (inF(IX[t], cc) && inF(IX[t + 1], cc) && inF(IX[t + 2], cc)) { arr.push(IX[t], IX[t + 1], IX[t + 2]); break; }
      if (!arr.length) return;
      const m = new THREE.Mesh(subGeo(arr), fontMat.clone()); m.morphTargetInfluences = [0]; m.renderOrder = 2; G.add(m);
      FONT[id] = { mesh: m, pos: C.clone().add(n.clone().multiplyScalar(0.03)) };
    });
    // отверстия: точка на нижней поверхности (луч снизу вверх), большое затылочное — по краю
    const rc = new THREE.Raycaster(), skullOnly = pick.filter((m) => m.userData.pick !== 'mand');
    const dotGeo = new THREE.SphereGeometry(0.022, 14, 10);
    Object.values(FOR).forEach((f) => {
      const pts = f.X ? [1, -1] : [1];
      f.mesh = []; pts.forEach((s) => {
        const p = V3(MX + s * f.X, f.y || 15.8, f.z);
        if (!f.y) { rc.set(V3(p.x, 15.2, p.z), V3(0, 1, 0)); const hit = rc.intersectObjects(skullOnly, false)[0]; p.y = hit && hit.point.y < 16.0 ? hit.point.y - 0.012 : f.yy || 15.8; f.yy = f.yy || p.y; }
        const m = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: f.col, transparent: true, opacity: 0.95, depthTest: false })); m.position.copy(p); m.renderOrder = 5; m.visible = false; m.userData.main = s === (f.L || f.id === 'stylo' ? -1 : 1); forGroup.add(m); f.mesh.push(m);
        if (s === (f.L || f.id === 'stylo' ? -1 : 1)) f.pos.copy(p);
      });
    });
    st.loaded = true; select(st.sel || 'all'); applyMode(); refs.setInfo && refs.setInfo();
  }).catch((e) => { st.err = e.message; refs.setInfo && refs.setInfo(); });
  // подсказки для подписей костей (X, y, z) и направление «наружу» — подпись видна, когда кость обращена к камере
  const BONE_HINT = {
    front: [0.05, 16.75, 0.95, 0.1, 0.4, 1], par: [0.55, 16.8, -0.05, 1, 0.6, 0], occ: [0.25, 16.3, -0.8, 0.3, 0.1, -1], temp: [0.65, 16.15, -0.05, 1, 0, 0],
    sph: [0.62, 16.12, 0.58, 1, 0, 0.3], eth: [0.14, 16.22, 0.7, 0.2, 0, 1], lac: [0.17, 16.2, 0.84, 0.3, 0, 1], nas: [0.04, 16.2, 1.02, 0.3, 0.2, 1],
    zyg: [0.55, 15.98, 0.82, 0.8, 0, 0.8], max: [0.24, 15.82, 0.92, 0.3, 0, 1], pal: [0.08, 15.74, 0.5, 0, -1, 0], vom: [0.0, 15.98, 0.86, 0, 0, 1],
    conch: [0.08, 15.9, 0.86, 0.2, 0, 1], mand: [0.38, 15.25, 0.72, 0.8, -0.2, 0.7],
  };
  const PH_FOR = { magn: 1, jug: 1, car: 1, ovale: 1, inc: 1 };   // на телефоне при «Все» — только главные подписи
  const MAJOR = { front: 1, par: 1, occ: 1, temp: 1, sph: 1, zyg: 1, max: 1, mand: 1, nas: 1 };
  function select(id) {
    st.sel = id === 'all' ? null : id;
    SK_BONES.forEach((b) => BN[b.id].mats.forEach((m) => { const on = !st.sel || st.sel === b.id; m.transparent = !on; m.opacity = on ? 1 : 0.14; m.depthWrite = on; m.emissive = new THREE.Color(b.col); m.emissiveIntensity = st.sel === b.id ? 0.22 : 0; m.needsUpdate = true; }));
    if (st.inner) st.inner.visible = !st.sel; if (st.fmMesh) st.fmMesh.visible = !st.sel; (st.condyles || []).forEach((m) => { m.visible = !st.sel || st.sel === 'occ'; });
    refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; if (m !== 'bones' && st.sel) select('all');
    st.view = m === 'base' ? 'bottom' : m === 'baby' ? 'front' : st.view === 'bottom' || st.view === 'baby' ? 'front' : st.view;
    st.fly = m === 'baby' ? VIEW.babyFront : VIEW[st.view]; applyMode(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  function applyMode() {
    const base = st.mode === 'base' || st.view === 'bottom';
    BN.mand.meshes.forEach((m) => { m.visible = !base; }); (st.mouth || []).forEach((m) => { m.visible = base; });
    Object.values(FOR).forEach((f) => (f.mesh || []).forEach((m) => { m.visible = st.mode === 'base' && (m.userData.main || st.fsel === f.id); m.scale.setScalar(st.fsel === f.id ? 1.6 : 1); }));
    refs.vs && refs.vs.sync();
  }
  function setView(v) { if (st.mode === 'base' && v !== 'bottom') { st.mode = 'bones'; refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); } st.view = v; st.fly = st.mode === 'baby' && v === 'front' ? VIEW.babyFront : VIEW[v]; applyMode(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'bones') setMode('bones'); select(st.sel === id ? 'all' : id); });
  // перелёт камеры по дуге вокруг черепа (а не по прямой сквозь него): всегда приходит точно, не зависит от частоты кадров
  const qA = new THREE.Quaternion(), qI = new THREE.Quaternion(), dA = V3(0, 0, 0), dB = V3(0, 0, 0);
  function flyArc(dt) {
    const f = st.fly; if (!f) return; if (typeof ANIM !== 'undefined' && ANIM.paused) dt = ANIM.dt;
    if (st._fly !== f) { st._fly = f; f.t = 0; f.p0 = camera.position.clone(); f.t0 = controls.target.clone(); }
    f.t += dt; const u = Math.min(1, f.t / 1.8), e = u * u * (3 - 2 * u);
    dA.copy(f.p0).sub(f.t0); dB.copy(f.pos).sub(f.target); const r = dA.length() + (dB.length() - dA.length()) * e;
    dA.normalize(); dB.normalize(); qA.setFromUnitVectors(dA, dB); qI.identity().slerp(qA, e);
    controls.target.copy(f.t0).lerp(f.target, e); camera.position.copy(controls.target).add(dA.applyQuaternion(qI).multiplyScalar(r));
    if (u >= 1) { st.fly = null; st._fly = null; }
  }
  function update(dt) {
    under.intensity += ((st.view === 'bottom' ? 1.5 : 0) - under.intensity) * Math.min(1, dt * 4); fill.intensity = st.view === 'bottom' ? 0.9 : 0.55;
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyArc(dt);
    st.babyT = st.mode === 'baby' ? 1 : 0; st.baby += (st.babyT - st.baby) * Math.min(1, dt * 2.2);
    if (Math.abs(st.baby - st.babyT) < 0.001) st.baby = st.babyT;
    const b = st.baby;
    pick.forEach((m) => { m.morphTargetInfluences[0] = b; }); if (st.inner) st.inner.morphTargetInfluences[0] = b;
    if (st.sutLine) { st.sutLine.morphTargetInfluences[0] = b; st.sutLine.visible = st.sut && !st.sel; sutMat.color.setHex(b > 0.5 ? 0x5a3018 : 0x2a1c12); sutMat.opacity = 0.85 - 0.45 * b; if (st.inner) st.inner.material = st.view === 'bottom' ? st.innerLit : st.innerDark; st.metLine.morphTargetInfluences[0] = b; st.metLine.visible = st.sut && b > 0.5; }
    const pulse = 0.5 + 0.5 * Math.sin(st.t * 3);
    Object.entries(FONT).forEach(([id, f]) => { f.mesh.morphTargetInfluences[0] = b; f.mesh.material.opacity = b * (st.nsel === id ? 0.75 + 0.2 * pulse : 0.8); f.mesh.material.emissiveIntensity = st.nsel === id ? 0.5 + 0.4 * pulse : 0.35; f.mesh.visible = b > 0.02; });
    Object.values(FOR).forEach((f) => (f.mesh || []).forEach((m) => { m.material.opacity = st.fsel && st.fsel !== f.id ? 0.35 : 0.95; }));
  }
  const camDir = V3(0, 0, 0);
  const faces = (p, n) => { camDir.copy(camera.position).sub(p).normalize(); return camDir.dot(n) > 0.2; };
  const labels = [
    ...SK_BONES.map((b) => ({ text: b.name.toLowerCase(), pos: BN[b.id].anchor, color: b.col, left: false, show: () => st.loaded && st.labels && st.mode === 'bones' && (st.sel ? st.sel === b.id : MAJOR[b.id]) && !(b.id === 'mand' && st.view === 'bottom') && faces(BN[b.id].anchor, BN[b.id].nrm) })),
    ...SK_FOR.map((f) => ({ text: f.name.toLowerCase(), pos: FOR[f.id].pos, color: f.col, left: (!!f.L && f.id !== 'hypo') || f.id === 'stylo', show: () => st.loaded && st.labels && st.mode === 'base' && (st.fsel ? st.fsel === f.id : DK || PH_FOR[f.id]) })),
    ...SK_FONT.map((f) => ({ text: f.name.toLowerCase() + ' fontanelle', pos: () => (FONT[f.id] ? FONT[f.id].pos : SC), color: '#FFB8C8', show: () => st.loaded && st.labels && st.mode === 'baby' && st.baby > 0.8 && !!FONT[f.id] && (!st.nsel || st.nsel === f.id) && !(st.view === 'front' && !st.nsel && (f.id === 'sph' || f.id === 'mast')) && faces(FONT[f.id].pos, FONT[f.id].pos.clone().sub(SC).normalize()) })),
    { text: 'coronal suture', pos: V3(MX + 0.42, 16.78, 0.42), color: '#E8D8C0', show: () => DK && st.loaded && st.labels && st.sut && st.mode === 'bones' && !st.sel && (st.view === 'side' || st.view === 'top') },
    { text: 'lambdoid suture', pos: V3(MX + 0.42, 16.55, -0.6), color: '#E8D8C0', left: true, show: () => DK && st.loaded && st.labels && st.sut && st.mode === 'bones' && !st.sel && st.view === 'side' },
    { text: 'squamous suture', pos: V3(MX + 0.68, 16.36, 0.05), color: '#E8D8C0', show: () => DK && st.loaded && st.labels && st.sut && st.mode === 'bones' && !st.sel && st.view === 'side' },
    { text: 'sagittal suture', pos: V3(MX, 17.12, -0.2), color: '#E8D8C0', show: () => DK && st.loaded && st.labels && st.sut && st.mode === 'bones' && !st.sel && st.view === 'top' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  const INTRO = '<b>Skull</b> — 22 bones (not counting the ear ossicles): 8 form the neurocranium, 14 the face. All except the mandible are joined by immovable sutures. Click a bone on the model or pick it from the list below.';
  const BASE_INTRO = '<b>Skull base from below</b> (mandible removed). The spinal cord, the brain’s blood vessels and the cranial nerves pass through the openings of the base. Pick an opening to see what goes through it.';
  const BABY_INTRO = '<b>Newborn skull</b>: the face is small — about 1/8 of the skull (≈ 1/2 in adults) — and the vault bones have not yet fused. Between them are soft membranes, the <b>fontanelles</b>: during birth the bones can overlap slightly, and later the brain grows fast.';
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => {
      ib.info.innerHTML = st.err ? 'Could not load the model: ' + st.err : !st.loaded ? 'Loading the skull model…'
        : st.mode === 'base' ? (st.fsel ? FOR[st.fsel].text : BASE_INTRO)
          : st.mode === 'baby' ? (st.nsel ? SK_FONT.find((f) => f.id === st.nsel).text : BABY_INTRO)
            : st.sel ? BN[st.sel].text : INTRO;
    };
    refs.modeSeg = seg([{ id: 'bones', label: 'Bones' }, { id: 'base', label: 'Base from below' }, { id: 'baby', label: 'Newborn' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 560px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.seg = null;
      if (st.mode === 'bones') {
        refs.seg = seg([{ id: 'all', label: 'All' }, ...SK_BONES.map((b) => ({ id: b.id, label: b.name, color: b.col }))], () => st.sel || 'all', (v) => select(v));
        box.append(h('div', { class: 'glabel' }, 'Bones', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg));
      } else if (st.mode === 'base') {
        box.append(h('div', { class: 'glabel' }, 'Foramina'), h('div', { class: 'gctl' }, seg([{ id: 'all', label: 'All' }, ...SK_FOR.map((f) => ({ id: f.id, label: f.name, color: f.col }))], () => st.fsel || 'all', (v) => { st.fsel = v === 'all' ? null : v; applyMode(); refs.setInfo(); })));
      } else {
        box.append(h('div', { class: 'glabel' }, 'Fontanelles'), h('div', { class: 'gctl' }, seg([{ id: 'all', label: 'All' }, ...SK_FONT.map((f) => ({ id: f.id, label: f.name, color: '#FFB8C8' }))], () => st.nsel || 'all', (v) => { st.nsel = v === 'all' ? null : v; st.view = st.nsel ? 'baby' : 'front'; st.fly = st.nsel === 'post' ? VIEW.babyPost : st.nsel === 'ant' ? VIEW.babyAnt : st.nsel === 'mast' ? VIEW.babyBack : st.nsel ? VIEW.baby : VIEW.babyFront; refs.vs.sync(); refs.setInfo(); })));
      }
    };
    refs.vs = seg([{ id: 'front', label: 'Front' }, { id: 'side', label: 'Lateral' }, { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Below' }], () => st.view, (v) => setView(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.sut = toggle('Sutures', () => st.sut, (v) => { st.sut = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · S · N', refs.vs, refs.rot, refs.sut, refs.lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['bones', 'base', 'baby'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 's' || k === 'ы') { refs.sut.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { st.fsel = null; st.nsel = null; select('all'); applyMode(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'base') return [['Openings', SK_FOR.length, 'shown']];
    if (st.mode === 'baby') return [['Face : skull', '1 : 8', ''], ['Fontanelles', 6, '']];
    if (st.sel) { const b = BN[st.sel]; return [['Region', b.cran ? 'neurocranium' : 'face', ''], ['Bones', b.n, b.n === 2 ? 'paired' : 'unpaired']]; }
    return [['Bones', 22, ''], ['Neurocranium', 8, ''], ['Facial', 14, '']];
  }
  camera.position.copy(VIEW.front.pos); controls.target.copy(VIEW.front.target); controls.update();
  const self = {
    mobZoom: 0.62, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#6FA8E8',
    kicker: 'Body · support and movement', title: 'Skull',
    lede: 'Twenty-two bones: all but the mandible are joined by sutures into a sturdy case for the brain and a frame for the face. We take them one by one, look at the openings in the skull base and at a newborn’s skull.',
    notes: `
      <div><h2>Structure</h2>
        <p><b>Neurocranium</b> (8 bones): frontal, two parietal, occipital, two temporal, sphenoid, ethmoid. <b>Face</b> (14): two maxillae, the mandible, two zygomatic, two nasal, two lacrimal, two palatine, two inferior nasal conchae, the vomer. The hyoid and the ear ossicles are usually counted separately.</p>
        <h3>Sutures</h3><p>Coronal (frontal–parietals), sagittal (between the parietals), lambdoid (parietals–occipital), squamous (temporal–parietal). The spot where the frontal, parietal, temporal and sphenoid bones meet is the <b>pterion</b>: the bone is thin here and the middle meningeal artery runs beneath it.</p>
        <h3>Base</h3><p>From inside, the base is divided into the anterior, middle and posterior cranial fossae (for the frontal lobes, the temporal lobes, the cerebellum and brainstem). Besides the openings seen from below there are inner ones: the optic canal (nerve II), superior orbital fissure (III, IV, V₁, VI), foramen rotundum (V₂), internal acoustic meatus (VII, VIII).</p>
        <h3>Medicine</h3><p>A basal skull fracture betrays itself by “raccoon eyes” and clear fluid (CSF) leaking from the nose or ear. Premature fusion of sutures in a child (craniosynostosis) deforms the head and is corrected surgically. A blow to the temple is dangerous because it can tear the middle meningeal artery.</p></div>
      <div><h2>Simplifications</h2><ul><li>The bones are colored on a real 3D skeleton model; the borders between them are drawn by landmarks and smoothed, so the sutures are approximate. The model has no ear ossicles and no inner walls of the cranial fossae.</li><li>The openings of the base are marked by dots at their approximate places; not all of them are visible as holes on the model. The ethmoid, vomer and conchae deep in the nose are simplified; in the scan the skull is fused with the neck vertebrae and the mandible: where they were separated, the base is closed with smooth patches and the foramen magnum is drawn as an even oval; the palate has gaps in places. The sphenoid and palatine bones are seen from below only as the scan’s outer shell, so the pterygoid processes and the choanae are hard to make out.</li><li>The newborn skull is made from the adult one: the face and jaws are smoothly shrunk, the teeth are squeezed into low ridges, and the fontanelles are drawn over the vault. In a real baby the teeth are hidden in the jaws, the sutures are straighter than in an adult, there is no mastoid process, and the vault bones are thinner and separated by wide membranes.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> all bones</li><li><code>R</code> rotate · <code>S</code> sutures · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeSkull };
