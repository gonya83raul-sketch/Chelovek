import { THREE, V3, __set_rnd, envTex, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mulberry, pickOn, range, rnd, seg, toggle } from '../core.js';
import { BIO_MOL, loadSkeletonStatic } from './kit.js';
Object.assign(BIO_MOL, {"ala":{"name":"Alanine","el":"N C C C O O H H H H H H H","xyz":"eP9pAD0AuP/n/ycAc/+f/7P/SwD8/wYAoQC6/0AAcgBbAKT/vv+sAFoAMf9gAIUAr/+r/4EAof+9/1X/fP80/8D/Cf+6/7H/cgA7AEj/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAEACAACAAkAAgAKAAIACwAFAAwA","o":"111211111111"}});


// @scene nose makeNose | Нос и околоносовые пазухи | @body Системы органов
/* =========================================================
   ТЕЛО · НОС И ОКОЛОНОСОВЫЕ ПАЗУХИ: правая половина полости носа со стороны перегородки (раковины, ходы, отверстия пазух,
   обонятельная область, носоглотка) и поток воздуха; пазухи внутри скана черепа и пути их оттока; рост пазух с возрастом.
   Сверено с атласом Неттера (табл. 42–52). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   Начало координат — точка скана черепа (MX, 16.0, 0.6), 1 ед. скана ≈ 12,5 см.
   ========================================================= */
const NO_PARTS = [
  { id: 'ext', name: 'External nose', col: '#E8B49A', text: '<b>External nose.</b> The paired nasal bones support the upper third of the bridge; below is a framework of cartilages: the lateral ones (extensions of the septal cartilage) and the major alar ones, which shape the tip and the nostril rims. The ala is held by dense fibrofatty tissue and small accessory cartilages. Inside the nostril, the vestibule has stiff hairs that trap coarse dust.' },
  { id: 'sept', name: 'Septum', col: '#8FB8F0', text: '<b>The nasal septum</b> divides the cavity into two halves. In front it is cartilage, behind it is bone: the perpendicular plate of the ethmoid above and the vomer below. Almost every adult has at least a slightly deviated septum. Low in front lies Kiesselbach’s area, where branches of four arteries meet; most nosebleeds start here.' },
  { id: 'conch', name: 'Conchae', col: '#E87A8A', text: '<b>The nasal conchae</b> (turbinates) are three bony scrolls on the lateral wall, covered with mucosa. The superior and middle ones are parts of the ethmoid bone; the inferior one is a separate bone. They multiply the mucosal surface several times and swirl the airflow. The mucosa of the inferior concha holds venous plexuses: when they swell, the nasal passage narrows.' },
  { id: 'meat', name: 'Meatuses and openings', col: '#F2C84E', text: '<b>The nasal meatuses</b> are the gaps under the conchae. The frontal and maxillary sinuses and the anterior ethmoidal cells open into the middle meatus through the semilunar hiatus; the posterior cells open into the superior meatus, and the sphenoidal sinus above the superior concha. The nasolacrimal duct opens into the inferior meatus — that is why your nose runs when you cry.' },
  { id: 'olf', name: 'Smell', col: '#F2E07A', text: '<b>The olfactory region</b> is about 2.5 cm² of mucosa on each side under the roof of the nose. It holds several million olfactory neurons; their processes — the olfactory nerves (cranial nerve I) — pass through the cribriform plate to the olfactory bulb. The neurons are replaced every 1–2 months.' },
  { id: 'phar', name: 'Nasopharynx', col: '#C090E0', text: '<b>Nasopharynx.</b> Through the choanae — two rear openings — the nasal cavity leads into the throat. On its side wall is the opening of the auditory (eustachian) tube, which leads to the middle ear; that is why a cold can block your ears. On its roof is the pharyngeal tonsil; in children it often enlarges (adenoids) and makes nose breathing hard.' },
];
const NO_SIN = [
  { id: 'fr', name: 'Frontal', col: '#F2C84E', vol: '≈ 6', out: 'middle', text: '<b>The frontal sinuses</b> lie in the frontal bone above the bridge of the nose, behind the brow ridges. They are usually asymmetric and separated by a septum; a few percent of people lack one or both. They drain through the frontonasal duct into the front end of the middle meatus. Behind, their wall borders the anterior cranial fossa; below, the orbit.' },
  { id: 'eth', name: 'Ethmoidal', col: '#E87AA0', vol: '3–18', out: 'middle and superior', text: '<b>The ethmoidal cells</b> are a “honeycomb” of 3–18 air spaces in the ethmoid bone between the orbits. The anterior and middle cells open into the middle meatus, the posterior ones into the superior meatus. Only a paper-thin plate (lamina papyracea) separates them from the orbit: in children, ethmoid inflammation can spread to the orbital tissues.' },
  { id: 'max', name: 'Maxillary', col: '#5FB8F0', vol: '≈ 15', out: 'middle', text: '<b>The maxillary sinus</b> is the largest, about 15 ml: a pyramid in the body of the maxilla below the orbit. Its opening sits high on the inner wall, so mucus is carried up to it by cilia, not drained by gravity. Its floor is close to the roots of the upper premolars and molars, so a tooth infection can spread into the sinus.' },
  { id: 'sph', name: 'Sphenoid', col: '#8FD88A', vol: '≈ 7', out: 'above the superior concha', text: '<b>The sphenoidal sinus</b> lies in the body of the sphenoid bone, deepest of all, behind the nasal cavity; a septum splits it into two unequal parts. It opens above the superior concha. Above it is the sella turcica with the pituitary gland; at its sides run the optic nerves and internal carotid arteries. Surgeons reach pituitary tumors through the nose by way of this sinus.' },
];
const NO_AGE = [
  [1, '<b>Infant.</b> The sinuses are only just forming: there are a few small ethmoidal cells and tiny maxillary sinuses — narrow slits in the lateral wall of the nose. There are no frontal or sphenoidal sinuses yet. The white wireframe shows the adult size of the sinuses.'],
  [4, '<b>First years.</b> The maxillary sinuses grow with the maxilla and spread sideways beneath the orbits. At around 2–3 years air begins to enter the body of the sphenoid bone, and the sphenoidal sinus starts to form. The number of ethmoidal cells increases.'],
  [8, '<b>Early childhood.</b> The frontal sinus grows upward into the frontal bone from one of the anterior ethmoidal cells; it usually shows on an X-ray by age 7–8. The sphenoidal sinus enlarges and extends back under the sella turcica.'],
  [13, '<b>School years.</b> The teeth are replaced, and the sinus takes over the space freed in the maxilla: by 8–12 years its floor drops to the level of the nasal floor. The ethmoidal labyrinth almost reaches adult size.'],
  [19, '<b>Teenagers.</b> During puberty the frontal sinuses grow especially fast — together with the brow ridges, more in boys. The floor of the maxillary sinus sinks below the nasal floor, toward the tooth roots.'],
  [99, '<b>Adult.</b> The sinuses stop growing by 18–20 years; their size and shape vary greatly from person to person. In old age, after teeth are lost, the maxillary sinus may expand further into the alveolar process.'],
];
function makeNose() {
  __set_rnd(mulberry(1901));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0xffd2c0);
  { const fl = new THREE.DirectionalLight(0xfff0ea, 1.0); fl.position.set(10, 2, 6); scene.add(fl); }   // подсветка со стороны камеры режима 1
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = {
    cav: flyTarget(DK ? V3(0, -0.15, 7.6) : V3(0, 1.4, 0.9), DK ? V3(30.5, 1.15, 9.2) : V3(21.5, 2.0, 2.4)),
    sin: flyTarget(DK ? V3(-8.1, 4.0, 0.5) : V3(0, 1.8, 0.5), DK ? V3(-14.0, 6.7, 46) : V3(-5.5, 3.4, 33)),
    sph: flyTarget(DK ? V3(0, 3.0, 8.0) : V3(0, 0.8, 0.5), DK ? V3(52, 6.0, 14.5) : V3(30, 6, 18)),
    age: flyTarget(DK ? V3(-8.1, 4.0, 0.5) : V3(0, 1.8, 0.5), DK ? V3(-12.0, 6.7, 46.5) : V3(-4.5, 3.0, 33)),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.cav.pos);
  const controls = makeControls(camera, VIEW.cav.target); controls.minDistance = 6; controls.maxDistance = 60;
  const st = { t: 0, mode: 'cav', sel: null, sin: null, ageV: 1, age: 25, labels: true, rot: false, flow: true, skull: true, fly: null };
  const mats = {}, pick = [];
  const mat = (id, col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.85), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.3, sheen: 0.25, sheenColor: new THREE.Color(0xffffff), emissive: col, emissiveIntensity: o.em ?? 0.06, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined }); m.userData.op0 = o.op ?? 1; m.userData.em0 = o.em ?? 0.06; if (id) (mats[id] = mats[id] || []).push(m); return m; };
  const add = (geo, m, id, parent = scene) => { const ms = new THREE.Mesh(geo, m); if (id) { ms.userData.pick = id; pick.push(ms); } parent.add(ms); return ms; };
  const surf = (f, nu, nv) => { const pos = [], idx = [], uv = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = f(i / nu, j / nv); pos.push(p.x, p.y, p.z); uv.push(i / nu, j / nv); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const lerpT = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, va] = tab[i - 1], [b, vb] = tab[i]; return va + (vb - va) * (x - a) / (b - a); } return tab[tab.length - 1][1]; };
  const tube = (pts, r, m, id, parent, n = 32) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, r, 8), m, id, parent);
  const blob = (r, m, id, parent, sc) => { const ms = add(new THREE.SphereGeometry(r, 24, 16), m, id, parent); if (sc) ms.scale.set(...sc); return ms; };
  // сагиттальный «срез»: замкнутый контур (Z, Y) → пластина толщиной от x0 до x1
  const ring = (pts, sharp, n = 120) => (sharp ? pts.map(([z, y]) => new THREE.Vector2(z, y)) : new THREE.CatmullRomCurve3(pts.map(([z, y]) => V3(z, y, 0)), true, 'centripetal').getSpacedPoints(n).slice(0, -1).map((p) => new THREE.Vector2(p.x, p.y)));
  const sag = (pts, x0, x1, m, id, parent, o = {}) => {
    const sh = new THREE.Shape(ring(pts, o.sharp)); (o.holes || []).forEach((hp) => sh.holes.push(new THREE.Path(ring(hp, false, 60))));
    const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false, curveSegments: 6 }); g.rotateY(-Math.PI / 2); g.translate(x1, 0, 0); return add(g, m, id, parent);
  };

  // ---------- полость носа (правая половина, x < 0) ----------
  const W = (y) => 0.32 + 1.33 * sm((2.3 - y) / 2.9);   // полуширина полости: узкая щель под крышей, широкая внизу
  const ZF = [[-2.9, 5.9], [-2.2, 6.2], [-1.2, 5.95], [0.2, 5.2], [1.4, 4.45], [2.3, 3.2]], zf = (y) => lerpT(ZF, y), zb = (y) => -1.3 - 0.06 * cl((y + 0.2) / 2.5);
  const C1 = new THREE.Group(); scene.add(C1);        // только режим 1: стенка, срезы костей, наружный нос
  const SIDE = new THREE.Group(); scene.add(SIDE);    // правая сторона: раковины, отверстия, пазухи (зеркалится влево)
  const wallM = mat('wall', '#E58C96', { side: THREE.DoubleSide, r: 0.62, k: 0.86, em: 0.12 });
  const agger = (y, z) => 0.22 * Math.exp(-(((z - 3.3) / 0.7) ** 2) - (((y - 0.9) / 0.5) ** 2));
  const WALLS = []; WALLS.push(add(surf((a, b) => { const y = -2.95 + 5.3 * b, z0 = zb(y), z1 = zf(y), z = z0 + (z1 - z0) * a; return V3(-W(y) - 0.05 + agger(y, z) + 0.25 * sm((z - 4.0) / 1.5) * sm((y + 2.9) / 1.2), y, z); }, 70, 50), wallM, null, C1));
  // дно полости и крыша — полосы, загибающиеся к перегородке
  WALLS.push(add(surf((a, b) => { const z = -1.3 + 7.3 * a, y = -2.95 + 0.1 * Math.sin(Math.PI * b); return V3(-W(-2.95) * (1 - b) - 0.05 * (1 - b), y + (z > 4.6 ? 0.3 * sm((z - 4.6) / 1.4) : 0), z); }, 50, 6), wallM, null, C1));
  // раковины: «валики», прикреплённые к стенке и свисающие в полость
  const conchM = mat('conch', '#E87A8A', { r: 0.6, k: 0.9, em: 0.1 });
  const CONCH = [
    { n: 'inf', yc: -1.6, hh: 0.56, z0: -0.95, z1: 3.75, ht: 0.55, dz: 0.18 },
    { n: 'mid', yc: -0.1, hh: 0.5, z0: -0.75, z1: 3.05, ht: 0.5, dz: 0.35 },
    { n: 'sup', yc: 1.22, hh: 0.3, z0: -1.05, z1: 1.05, ht: 0.27, dz: 0.1 },
  ];
  CONCH.forEach((c) => {
    const g = new THREE.SphereGeometry(1, 48, 24), p = g.attributes.position, L = (c.z1 - c.z0) / 2, zc = (c.z0 + c.z1) / 2;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), Z = zc + z * L, tap = Math.sqrt(1 - Math.min(0.97, z * z) * 0.75);
      const Y = c.yc + y * c.hh * tap - c.dz * z + (y > 0.55 ? 0.12 * (y - 0.55) : 0), wy = W(c.yc + 0.45 * c.hh);
      const X = -wy + c.ht + (x > 0 ? x * c.ht * tap : x * c.ht * 0.6) + (y < -0.3 ? 0.15 * (y + 0.3) : 0) + (x > 0 ? (c.n === 'inf' ? 0.07 * Math.sin(6 * Z) : 0.05 * Math.sin(5 * Z)) * tap : 0);
      p.setXYZ(i, X, Y, Z);
    }
    g.computeVertexNormals(); c.ms = add(g, conchM, 'conch', SIDE);
  });
  // ходы: полулунная щель, решётчатый пузырь, крючковидный отросток, устья
  const meatM = mat('meat', '#E8949C', { r: 0.55, k: 0.9, em: 0.1 }), slitM = new THREE.MeshBasicMaterial({ color: 0x3a1018 });
  const OPN = new THREE.Group(); SIDE.add(OPN);
  const onWall = (z, y, d = 0.05) => V3(-W(y) - 0.05 + agger(y, z) + d, y, z);
  const hiatC = new THREE.CatmullRomCurve3([onWall(2.95, 0.12), onWall(2.4, -0.15), onWall(1.7, -0.38), onWall(1.05, -0.55)]);
  OPN.add(new THREE.Mesh(new THREE.TubeGeometry(hiatC, 30, 0.07, 6), slitM));
  tube([onWall(3.15, -0.05, 0.12), onWall(2.5, -0.38, 0.12), onWall(1.8, -0.62, 0.12), onWall(1.1, -0.78, 0.1)], 0.09, meatM, 'meat', OPN);   // крючковидный отросток
  blob(1, meatM, 'meat', OPN, [0.28, 0.32, 0.62]).position.copy(onWall(1.75, 0.2, 0.1));   // решётчатый пузырь
  const slitTop = new THREE.MeshBasicMaterial({ color: 0x3a1018, depthTest: false });
  const SINC = Object.fromEntries(NO_SIN.map((s) => [s.id, s.col]));
  const OPEN = [
    { s: 'fr', p: onWall(2.95, 0.14, 0.08), r: 0.24 }, { s: 'eth', p: onWall(2.2, -0.24, 0.08), r: 0.16 }, { s: 'eth', p: onWall(1.75, 0.5, 0.2), r: 0.14 },
    { s: 'max', p: onWall(1.25, -0.5, 0.08), r: 0.26 }, { s: 'eth', p: onWall(0.0, 0.72, 0.06), r: 0.16 },
    { s: 'sph', p: V3(-0.42, 1.8, -1.33), r: 0.24, back: true }, { s: 'nld', p: onWall(2.95, -2.25, 0.06), r: 0.2 },
  ];
  OPEN.forEach((o) => {
    const ms = new THREE.Mesh(new THREE.CircleGeometry(o.r, 18), slitTop); ms.renderOrder = 7; ms.position.copy(o.p); ms.lookAt(o.back ? o.p.clone().add(V3(0, 0, 1)) : o.p.clone().add(V3(1, 0, 0))); OPN.add(ms);
    const rg = new THREE.Mesh(new THREE.RingGeometry(o.r, o.r + 0.09, 24), new THREE.MeshBasicMaterial({ color: o.s === 'nld' ? 0x7fd8e0 : SINC[o.s], side: THREE.DoubleSide, depthTest: false })); rg.renderOrder = 8; rg.position.copy(o.p); rg.quaternion.copy(ms.quaternion); rg.translateZ(0.005); OPN.add(rg); o.ms = rg; o.dk = ms;
  });
  // обонятельная область: пятно на верхней раковине и стенке + нервы через решётчатую пластинку
  const olfM = mat('olf', '#FFD84A', { side: THREE.DoubleSide, r: 0.6, em: 0.95, op: 1, k: 1 }); olfM.transparent = true; olfM.depthWrite = false;
  { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 32; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(32, 16, 2, 32, 16, 30); gr.addColorStop(0, '#fff'); gr.addColorStop(0.7, '#ddd'); gr.addColorStop(1, '#000'); cx.setTransform(1, 0, 0, 0.5, 0, 8); cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64); olfM.alphaMap = new THREE.CanvasTexture(cv); }
  add(surf((a, b) => { const y = 1.15 + 1.12 * b, z = -0.9 + 3.2 * a; return V3(-W(y) - 0.05 + agger(y, z) + 0.06, y, z); }, 30, 10), olfM, 'olf', C1);
  const bulbM = mat('olf', '#F2D45A', { r: 0.5, em: 0.4 }), nervM = mat('olf', '#F5E08A', { r: 0.5, em: 0.25 });
  const OLFG = new THREE.Group(); C1.add(OLFG);
  const bulb = blob(1, bulbM, 'olf', OLFG, [0.3, 0.28, 0.75]); bulb.position.set(-0.45, 2.66, 1.7);
  tube([V3(-0.45, 2.7, 0.9), V3(-0.55, 2.85, 0.0), V3(-0.7, 3.1, -1.1), V3(-0.85, 3.25, -2.0)], 0.12, bulbM, 'olf', OLFG);   // обонятельный тракт
  for (let i = 0; i < 11; i++) { const z = 1.05 + 1.35 * (i / 10), y1 = 1.2 + 0.5 * rnd(); tube([V3(-0.45, 2.5, z), V3(-0.42, 2.25, z + 0.05), V3(-W(y1) * 0.9, y1 + 0.3, z - 0.1), V3(-W(y1) - 0.02, y1, z - 0.15)], 0.025, nervM, 'olf', OLFG, 12); }
  // ---------- срезы костей и мягких тканей по средней линии (контекст, как на табл. 43) ----------
  const boneM = mat(null, '#E8DCC8', { r: 0.8, k: 0.92, em: 0.08 }), softM = mat(null, '#D98A92', { r: 0.7, k: 0.85, em: 0.1 }), skinM = mat('ext', '#E8B49A', { r: 0.7, k: 0.9, em: 0.08 });
  const brainM = mat(null, '#6E6470', { r: 0.95, k: 0.6, em: 0.03 }), hypoM = mat(null, '#E890B8', { r: 0.5, em: 0.2 });
  const SEC = new THREE.Group(); C1.add(SEC); const X0 = -0.04, X1 = 0.04;
  const holeFr = [[3.0, 4.1], [3.65, 4.25], [3.75, 5.2], [3.6, 6.2], [3.25, 6.35], [2.95, 5.4]], holeSph = [[-1.55, -0.85], [-1.55, 1.55], [-2.2, 1.7], [-3.05, 1.4], [-3.25, 0.3], [-2.9, -0.85]];
  sag([[3.55, 3.35], [3.95, 4.3], [4.15, 5.4], [4.05, 6.3], [3.95, 6.3], [2.7, 6.3], [2.75, 6.2], [2.7, 4.6], [2.4, 3.5], [2.6, 2.65], [3.2, 2.55]], X0, X1, boneM, null, SEC, { holes: [holeFr] });   // лобная кость с пазухой
  sag([[3.45, 3.3], [4.55, 2.6], [5.55, 1.62], [5.45, 1.45], [4.4, 2.25], [3.35, 2.8]], X0, X1, boneM, null, SEC, { sharp: true });   // носовая кость
  sag([[3.3, 2.32], [-0.6, 2.32], [-0.6, 2.47], [1.6, 2.5], [2.0, 3.25], [2.35, 2.5], [3.3, 2.5]], X0, X1, boneM, null, SEC, { sharp: true });   // решётчатая пластинка и петушиный гребень
  sag([[-0.55, 2.3], [-1.35, 2.3], [-1.32, -0.25], [-1.55, -0.9], [-2.3, -1.15], [-3.4, -1.35], [-4.5, -1.75], [-5.5, -2.6], [-6.1, -2.4], [-5.2, 0.2], [-4.1, 2.2], [-3.75, 2.95], [-3.45, 2.95], [-3.2, 2.15], [-2.7, 1.9], [-2.3, 2.1], [-2.0, 2.6], [-1.0, 2.6]], X0, X1, boneM, null, SEC, { holes: [holeSph] });   // клиновидная кость и скат
  sag([[4.35, -2.62], [4.05, -3.25], [3.0, -3.5], [-1.0, -3.42], [-1.05, -2.98], [3.6, -2.92]], X0, X1, boneM, null, SEC);   // твёрдое нёбо
  sag([[4.2, -3.3], [4.65, -3.9], [4.7, -4.6], [3.6, -4.65], [3.2, -3.5]], X0, X1, boneM, null, SEC);   // альвеолярный отросток
  { const t = sag([[4.25, -4.4], [4.75, -4.5], [4.95, -5.4], [4.7, -6.1], [4.45, -6.05], [4.2, -5.2]], X0 - 0.02, X1 + 0.02, mat(null, '#F3EEDF', { r: 0.3, cc: 0.7 }), null, SEC); t.renderOrder = 1; }   // верхний резец
  sag([[-1.0, -3.0], [-2.0, -3.3], [-3.1, -4.1], [-3.45, -4.9], [-3.15, -5.0], [-2.6, -4.4], [-1.6, -3.85], [-1.0, -3.42]], X0, X1, softM, 'phar', SEC);   // мягкое нёбо
  sag([[-4.55, -1.85], [-5.55, -2.75], [-5.75, -4.5], [-5.65, -5.1], [-4.7, -5.1], [-4.6, -4.5], [-4.4, -2.6], [-3.6, -1.6]], X0, X1, softM, 'phar', SEC);   // задняя стенка глотки
  sag([[2.6, 2.75], [2.7, 4.5], [2.65, 5.5], [-1.0, 5.6], [-3.3, 5.1], [-3.7, 3.6], [-2.0, 2.75], [-0.6, 2.6]], -1.9, -1.86, brainM, null, SEC);   // лобная доля (фон, позади луковицы)
  const grow = (h, k) => { const c = h.reduce((a, [z, y]) => [a[0] + z / h.length, a[1] + y / h.length], [0, 0]); return h.map(([z, y]) => [c[0] + (z - c[0]) * k, c[1] + (y - c[1]) * k]); };
  sag(grow(holeFr, 1.3), -0.9, -0.86, mat(null, '#8A7A3A', { r: 0.9, k: 0.7, em: 0.05 }), null, SEC); sag(grow(holeSph, 1.3), -1.1, -1.06, mat(null, '#4E7A4A', { r: 0.9, k: 0.7, em: 0.05 }), null, SEC);   // дно пазух в срезе
  const hypo = blob(1, hypoM, null, SEC, [0.32, 0.3, 0.42]); hypo.position.set(0, 2.18, -2.65);
  // кожа и хрящ спинки носа, губа (срез)
  sag([[3.55, 3.5], [4.3, 3.62], [5.05, 2.75], [6.05, 1.5], [6.95, 0.1], [7.45, -1.25], [7.3, -2.05], [6.55, -2.55], [5.45, -2.75], [5.55, -3.5], [5.75, -4.3], [5.55, -4.5], [4.75, -4.4], [4.45, -3.35], [4.5, -2.75], [5.0, -2.5], [6.1, -2.25], [6.85, -1.75], [6.95, -1.05], [6.55, -0.05], [5.65, 1.4], [5.2, 1.95]], X0 - 0.02, X1, skinM, 'ext', SEC, { sharp: true });
  // наружный нос — правая половина оболочки + крыло
  // наружный нос: сечение — полуэллипс от основания на лице через спинку; a — от переносицы к колумелле, φ — от правого края (0) до левого (π)
  const DOR = new THREE.CatmullRomCurve3([V3(0, 3.55, 4.25), V3(0, 2.75, 5.05), V3(0, 1.5, 6.05), V3(0, 0.1, 6.95), V3(0, -1.25, 7.45), V3(0, -2.05, 7.25), V3(0, -2.6, 6.4)]);
  const noseGeo = (phi1) => {
    const g = surf((a, b) => { const d = DOR.getPoint(a), f = Math.PI * phi1 * b, hw = 0.55 + 1.05 * sm(a / 0.8) + 0.3 * sm((a - 0.62) / 0.25), zb = 3.95 + 1.05 * a, sf = Math.sin(f);
      return V3(-hw * Math.cos(f) * (1 - 0.25 * sf * sm((a - 0.7) / 0.2)), d.y - 0.25 * sm((a - 0.7) / 0.3) * (1 - sf), zb + (d.z - zb) * Math.pow(sf, 0.75)); }, 96, Math.round(18 * phi1));
    const cols = [], p = g.attributes.position, bone = new THREE.Color('#E8DCC8'), lat = new THREE.Color('#9CC8E8'), alar = new THREE.Color('#6FA6E8'), fat = new THREE.Color('#E8C8A0');
    for (let n = 0; n < p.count; n++) { const a = (n % 97) / 96, b = Math.floor(n / 97) / Math.round(18 * phi1), sf = Math.sin(Math.PI * phi1 * b); const c = (a < 0.34 ? bone : a < 0.6 ? lat : sf > 0.42 ? alar : fat).clone(); if (Math.abs(a - 0.34) < 0.012 || Math.abs(a - 0.6) < 0.012 || (a > 0.6 && Math.abs(sf - 0.42) < 0.03)) c.multiplyScalar(0.45); cols.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); return g;
  };
  const noseSkin = mat('ext', '#E8B49A', { side: THREE.DoubleSide, r: 0.7, k: 0.9 }), noseCart = mat('ext', '#FFFFFF', { side: THREE.DoubleSide, r: 0.75, cc: 0, k: 0.85, em: 0.04 }); noseCart.vertexColors = true; noseCart.emissive.set(0x000000);
  const nose = add(noseGeo(0.5), noseSkin, 'ext', C1);
  const noseL = add(noseGeo(1), noseCart, 'ext', C1);   // целый нос — только при выборе «Наружный нос»
  { const P = noseL.geometry.attributes.position, bot = []; let yb = 0; for (let n = 96; n < P.count; n += 97) { bot.push(new THREE.Vector2(P.getX(n), P.getZ(n))); yb += P.getY(n); } yb /= bot.length;
    const sg = new THREE.ShapeGeometry(new THREE.Shape(bot), 2); sg.rotateX(Math.PI / 2); sg.translate(0, yb, 0); noseL.add(new THREE.Mesh(sg, mat('ext', '#E8C8A0', { side: THREE.DoubleSide, r: 0.7, k: 0.9 })));   // подошва носа по краю оболочки
    const nosM = new THREE.MeshBasicMaterial({ color: 0x2a0c12, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    [1, -1].forEach((s) => { const nm = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), nosM); nm.scale.set(0.62, 1.2, 1); nm.rotation.set(Math.PI / 2, 0, s * 0.25); nm.position.set(s * 0.55, yb - 0.02, 5.95); noseL.add(nm); }); }   // ноздри
  // порог носа и волоски преддверия
  const VEST = new THREE.Group(); C1.add(VEST);
  tube([V3(-1.45, -2.5, 4.55), V3(-1.25, -1.2, 4.75), V3(-0.95, 0.1, 4.75)], 0.07, meatM, 'ext', VEST);
  { const hm = new THREE.MeshBasicMaterial({ color: 0x5a4030 }); for (let i = 0; i < 18; i++) { const z = 5.0 + rnd() * 1.6, y = -2.7 + rnd() * 0.9, h0 = onWall(Math.min(z, 6.0), y, 0); const hr = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.35, 4), hm); hr.position.copy(h0).add(V3(0.15, 0, 0)); hr.rotation.set(0.3, 0, 1.2 + rnd() * 0.4); VEST.add(hr); } }
  // носоглотка: боковая стенка, трубный валик, устье трубы, глоточная миндалина
  WALLS.push(add(surf((a, b) => { const z = -1.2 - 3.5 * a, y = -4.2 + 3.9 * b; return V3(-1.72 - 0.28 * sm(a) + 0.15 * Math.sin(Math.PI * b), y, z); }, 24, 20), mat('phar', '#E08A96', { side: THREE.DoubleSide, r: 0.62, k: 0.86, em: 0.12 }), null, C1));
  const pharM = mat('phar', '#C9707E', { r: 0.6, em: 0.12 });
  const torus = add(new THREE.TorusGeometry(0.42, 0.17, 10, 28, Math.PI * 1.35), mat('phar', '#E8A8B8', { r: 0.5, em: 0.15 }), 'phar', C1); torus.position.set(-1.42, -1.75, -2.45); torus.rotation.set(0, Math.PI / 2, Math.PI * 0.32);
  const tubeO = new THREE.Mesh(new THREE.CircleGeometry(0.3, 20), slitM); tubeO.position.set(-1.4, -1.8, -2.4); tubeO.rotation.y = Math.PI / 2; tubeO.scale.set(0.8, 1, 1); C1.add(tubeO);
  { const g = new THREE.SphereGeometry(1, 32, 20), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.1 * Math.sin(7 * x + 1) * Math.sin(6 * y) + 0.06 * Math.sin(9 * z + 2 * y); p.setXYZ(i, x * k, y * k, z * k); } g.computeVertexNormals();
    const ad = add(g, pharM, 'phar', C1); ad.scale.set(0.75, 0.95, 0.42); ad.position.set(-0.25, -1.95, -3.6); ad.rotation.x = -0.7; }   // глоточная миндалина на своде и задней стенке
  // перегородка (показывается при выборе): хрящ, перпендикулярная пластинка, сошник, зона Киссельбаха, артерии
  const SEPT = new THREE.Group(); scene.add(SEPT);
  const sCart = mat('sept', '#8FB8F0', { r: 0.4, cc: 0.5 }), sBone = mat('sept', '#F2E8D2', { r: 0.75, k: 0.95 }), sVom = mat('sept', '#C8AE86', { r: 0.75, k: 0.95 });
  sag([[4.55, 2.3], [5.45, 1.5], [4.6, -2.75], [2.6, -2.88], [1.5, -0.55], [3.5, 1.3]], -0.12, 0.12, sCart, 'sept', SEPT, { sharp: true });
  sag([[3.3, 2.32], [-0.6, 2.32], [-1.3, 1.1], [-0.4, 0.1], [1.5, -0.55], [3.5, 1.3], [4.55, 2.3], [3.9, 2.55]], -0.1, 0.1, sBone, 'sept', SEPT, { sharp: true });
  sag([[-1.3, 1.1], [-1.25, -0.2], [-1.05, -2.95], [2.6, -2.88], [1.5, -0.55], [-0.4, 0.1]], -0.1, 0.1, sVom, 'sept', SEPT, { sharp: true });
  const kissM = mat('sept', '#FF5060', { r: 0.4, em: 0.35, op: 0.75 });
  const kiss = blob(1, kissM, 'sept', SEPT, [0.05, 0.62, 0.78]); kiss.position.set(0.12, -1.85, 3.85);
  const artM = new THREE.MeshBasicMaterial({ color: 0xff3a48 });
  [[V3(0.15, 2.2, 2.6), V3(0.15, 0.4, 3.4), V3(0.15, -1.6, 3.85)], [V3(0.15, 0.4, -1.1), V3(0.15, -0.9, 1.2), V3(0.15, -1.9, 3.6)], [V3(0.15, -2.85, 3.3), V3(0.15, -2.45, 3.6), V3(0.15, -2.0, 3.85)], [V3(0.15, -2.75, 5.0), V3(0.15, -2.35, 4.4), V3(0.15, -1.9, 4.0)]].forEach((pts) => SEPT.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.05, 6), artM)));

  // ---------- пазухи (правая сторона; лобная и клиновидная — общие, несимметричные) ----------
  const SINM = Object.fromEntries(NO_SIN.map((s) => [s.id, mat('S:' + s.id, s.col, { r: 0.45, cc: 0.4, em: 0.22, op: 0.86, side: THREE.DoubleSide })]));
  const SIN = {};   // id → { obj, A (точка роста), C (центр) }
  const lump = (sc, f) => { const g = new THREE.SphereGeometry(1, 40, 28), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = f(p.getX(i), p.getY(i), p.getZ(i)); p.setXYZ(i, v.x * sc[0], v.y * sc[1], v.z * sc[2]); } g.computeVertexNormals(); return g; };
  {   // верхнечелюстная: пирамида, основание — внутренняя стенка, верхушка — к скуловой кости; бухты у корней зубов
    const g = lump([1.4, 2.0, 1.75], (x, y, z) => { const lat = cl(-x), med = cl(x); return V3(x * (1 - 0.45 * med), y * (1 - 0.38 * lat) + 0.42 * lat + (y < -0.6 ? 0.09 * Math.sin(z * 7) : 0), z * (1 - 0.3 * lat)); });
    const ms = add(g, SINM.max, 'S:max', SIDE); const C = V3(-3.15, -1.15, 1.2); ms.position.copy(C); SIN.max = { list: [ms], A: V3(-1.95, 0.55, 1.35), C: [C] };
  }
  {   // решётчатые ячейки: «соты» между глазницей и верхней частью полости носа
    const E = new THREE.Group(); SIDE.add(E);
    for (let iz = 0; iz < 7; iz++) for (let iy = 0; iy < 3; iy++) { if ((iz === 0 || iz === 6) && iy === 0) continue; const z = -0.45 + 3.3 * (iz + 0.25 * (iy % 2)) / 6.2 + 0.1 * (rnd() - 0.5), y = 0.15 + 0.85 * iy + 0.15 * rnd(), x = -0.95 - 0.12 * rnd() - 0.18 * (iy === 0); const r = 0.27 + 0.1 * rnd(); const b = blob(r, SINM.eth, 'S:eth', E, [1.2, 1.05, 1.0]); b.position.set(x, y, z); }
    SIN.eth = { list: [E], A: V3(-0.9, 1.5, 1.3), C: [V3(0, 0, 0)] };
  }
  const MID = new THREE.Group(); scene.add(MID);
  {   // лобные: две несимметричные доли с перегородкой левее середины
    const lobe = (s, k) => { const g = lump([0.8 * k, 1.0 * k, 0.4], (x, y, z) => { const up = cl((y + 1) / 2), fan = 0.55 + 0.75 * up; return V3(x * fan + s * 0.35 * up * up, y * (1 - 0.25 * cl(s * x) * up), z * (1 - 0.3 * up)); }); return add(g, SINM.fr, 'S:fr', MID); };
    const L = lobe(1, 1.12), R = lobe(-1, 0.92); const CL = V3(0.95, 5.0, 3.35), CR = V3(-0.8, 4.85, 3.35); L.position.copy(CL); R.position.copy(CR);
    SIN.fr = { list: [L, R], A: V3(0.1, 3.9, 3.05), C: [CL, CR] };
  }
  {   // клиновидная: две неравные камеры под турецким седлом
    const cham = (s, k) => add(lump([0.72 * k, 1.15, 1.0], (x, y, z) => V3(x, y + 0.12 * z * z, z)), SINM.sph, 'S:sph', MID);
    const L = cham(1, 0.85), R = cham(-1, 1.15); const CL = V3(0.68, 0.32, -2.35), CR = V3(-0.75, 0.25, -2.3); L.position.copy(CL); R.position.copy(CR);
    SIN.sph = { list: [L, R], A: V3(0, 1.4, -1.45), C: [CL, CR] };
  }
  // левая сторона — зеркальная копия правой
  const SIDEL = SIDE.clone(); SIDEL.scale.x = -1; scene.add(SIDEL); SIDEL.traverse((o) => { if (o.userData.pick) pick.push(o); });
  const mirrorOf = (o) => { const path = []; let c = o; while (c && c !== SIDE) { path.unshift(c.parent.children.indexOf(c)); c = c.parent; } let m = SIDEL; path.forEach((i) => { m = m.children[i]; }); return m; };
  SIN.max.list.push(mirrorOf(SIN.max.list[0])); SIN.eth.list.push(mirrorOf(SIN.eth.list[0]));
  const OPNL = mirrorOf(OPN); OPEN.forEach((o) => { o.msL = mirrorOf(o.ms); o.dkL = mirrorOf(o.dk); });
  // взрослые контуры для режима «возраст»
  const ghostM = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.07, depthWrite: false });
  const GH = new THREE.Group(); scene.add(GH);
  [SIN.max.list[0], SIN.fr.list[0], SIN.fr.list[1], SIN.sph.list[0], SIN.sph.list[1]].forEach((m) => { const g = new THREE.Mesh(m.geometry, ghostM); g.position.copy(m.position); GH.add(g); const g2 = m === SIN.max.list[0] ? new THREE.Mesh(m.geometry, ghostM) : null; if (g2) { g2.position.copy(m.position).multiply(V3(-1, 1, 1)); g2.scale.x = -1; GH.add(g2); } });
  // пути оттока: правая сторона (x < 0), левая — зеркально
  const DR = {
    fr: [[V3(-0.75, 4.1, 3.2), V3(-0.95, 2.9, 3.1), V3(-1.25, 1.2, 3.05), V3(-1.45, 0.14, 2.95)]],
    eth: [[V3(-1.05, 1.0, 2.1), V3(-1.25, 0.2, 2.15), V3(-1.4, -0.24, 2.2)], [V3(-0.95, 1.9, 0.3), V3(-0.75, 1.1, 0.1), V3(-0.62, 0.72, 0.0)]],
    max: [[V3(-3.1, -2.2, 1.6), V3(-2.3, -1.2, 1.4), V3(-2.0, -0.05, 1.32), V3(-1.4, -0.5, 1.25)]],
    sph: [[V3(-0.75, -0.6, -2.4), V3(-0.65, 0.8, -1.95), V3(-0.45, 1.8, -1.4), V3(-0.4, 1.85, -0.9)]],
  };
  const DOTS = new THREE.Group(); scene.add(DOTS); const dotM = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }), dotG = new THREE.SphereGeometry(0.16, 10, 8);
  const drains = []; Object.entries(DR).forEach(([id, arr]) => arr.forEach((pts) => [1, -1].forEach((sx) => { const c = new THREE.CatmullRomCurve3(pts.map((p) => V3(p.x * sx, p.y, p.z)));const ds = []; for (let i = 0; i < 6; i++) { const d = new THREE.Mesh(dotG, dotM); DOTS.add(d); ds.push(d); } const ln = new THREE.Mesh(new THREE.TubeGeometry(c, 30, id === 'fr' ? 0.05 : 0.075, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(SINC[id]).lerp(new THREE.Color(0xffffff), 0.5), transparent: true, opacity: 0.9, depthTest: false })); ln.renderOrder = 5; DOTS.add(ln); ds.forEach((d) => { d.renderOrder = 6; }); drains.push({ id, c, ds, ln }); })));
  // ---------- скан черепа (полупрозрачный) ----------
  const SK = new THREE.Group(); scene.add(SK); const KS = 12.5; SK.scale.setScalar(KS); SK.position.set(-0.11 * KS, -16.0 * KS, -0.6 * KS);
  const skM = new THREE.MeshPhysicalMaterial({ color: 0xe8dcc8, roughness: 0.7, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.FrontSide, emissive: 0xe8dcc8, emissiveIntensity: 0.05 });
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    for (let t = 0; t < IX.length; t += 3) if (Math.min(P.getY(IX[t]), P.getY(IX[t + 1]), P.getY(IX[t + 2])) > 15.42) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = -1; SK.add(ms);
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
  }).catch(() => {});
  // ---------- поток воздуха ----------
  const FLOW = [
    [V3(-0.6, -2.75, 6.2), V3(-0.65, -1.9, 5.3), V3(-0.4, -1.05, 3.6), V3(-0.35, -0.6, 1.5), V3(-0.4, -1.1, -0.6), V3(-0.6, -1.4, -2.0), V3(-0.6, -2.6, -3.2), V3(-0.6, -5.0, -3.6)],
    [V3(-0.9, -2.8, 6.0), V3(-0.95, -2.2, 5.1), V3(-0.75, -2.45, 3.4), V3(-0.65, -2.0, 1.4), V3(-0.7, -2.5, -0.6), V3(-0.7, -2.1, -2.0), V3(-0.7, -2.9, -3.1), V3(-0.7, -5.0, -3.5)],
    [V3(-0.45, -2.6, 6.3), V3(-0.5, -1.5, 5.4), V3(-0.38, -0.3, 4.0), V3(-0.36, 0.55, 2.6), V3(-0.34, 0.6, 1.0), V3(-0.4, -0.2, -0.6), V3(-0.55, -1.0, -2.1), V3(-0.6, -2.5, -3.3), V3(-0.6, -5.0, -3.6)],
    [V3(-0.4, -2.55, 6.3), V3(-0.42, -1.2, 5.5), V3(-0.3, 0.6, 4.1), V3(-0.25, 1.75, 2.6), V3(-0.25, 1.9, 1.2), V3(-0.3, 1.3, 0.0), V3(-0.45, 0.0, -1.0), V3(-0.55, -1.2, -2.2), V3(-0.6, -2.6, -3.3), V3(-0.6, -5.0, -3.6)],
  ].map((p) => new THREE.CatmullRomCurve3(p));
  const NP = 260, PW = [0.25, 0.28, 0.32, 0.15];
  const airM = new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false, depthTest: false }); const air = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 6), airM, NP); air.renderOrder = 4; air.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(NP * 3), 3); scene.add(air);
  const AP = []; for (let i = 0; i < NP; i++) { let r = rnd(), k = 0; while (k < 3 && r > PW[k]) { r -= PW[k]; k++; } AP.push({ k, u: rnd(), sp: 0.075 + 0.03 * rnd(), j: V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.28) }); }
  const cold = new THREE.Color('#9FE0FF'), warm = new THREE.Color('#FF9A5A'), tmpC = new THREE.Color(), tmpM = new THREE.Matrix4();

  // ---------- обновление ----------
  const ageWord = (a) => (a < 2 ? 'mo' : a % 10 >= 2 && a % 10 <= 4 && (a < 10 || a > 20) ? 'years' : a % 10 === 1 && a !== 11 ? 'years' : 'years');
  const ageFmt = (v) => { const a = 25 * v * v; return a < 2 ? Math.round(a * 12) + ' ' + ageWord(a) : Math.floor(a) + ' ' + ageWord(Math.floor(a)); };
  const GROW = { max: [[0, 0.25], [1, 0.35], [4, 0.55], [7, 0.7], [12, 0.88], [16, 0.97], [20, 1]], eth: [[0, 0.45], [2, 0.6], [6, 0.78], [12, 0.93], [16, 1]], sph: [[0, 0], [2, 0], [3, 0.22], [7, 0.55], [12, 0.85], [16, 1]], fr: [[0, 0], [5, 0], [7, 0.32], [12, 0.62], [16, 0.88], [20, 1]] };
  const growF = (id) => (st.mode === 'age' ? lerpT(GROW[id], st.age) : 1);
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const M1 = st.mode === 'cav';
    const tA = st.mode === 'age' ? 25 * st.ageV * st.ageV : 25; st.age += (tA - st.age) * Math.min(1, dt * 5); if (Math.abs(st.age - tA) < 0.01) st.age = tA;
    C1.visible = M1; SEPT.visible = M1 && st.sel === 'sept'; SIDEL.visible = !M1; MID.visible = !M1; GH.visible = st.mode === 'age' && st.age < 17.5; ghostM.opacity = 0.07 * (1 - sm((st.age - 14) / 4)); SK.visible = !M1 && st.skull;
    const EX = M1 && st.sel === 'ext'; C1.children.forEach((c) => { c.visible = EX ? c === noseL : c !== noseL; }); SIDE.visible = !EX;
    OPN.visible = M1 ? st.sel === 'meat' : st.mode === 'sin' && !!st.sin; OPNL.visible = !M1 && OPN.visible;
    OPEN.forEach((o) => { const sh = M1 || o.s === st.sin; o.ms.visible = o.dk.visible = o.msL.visible = o.dkL.visible = sh; });
    // пазухи: в режиме 1 скрыты; в режимах 2–3 видны и растут с возрастом вокруг точки роста A
    Object.entries(SIN).forEach(([id, S]) => { const f = growF(id); S.list.forEach((o, i) => { o.visible = !M1 && f > 0.02; o.scale.setScalar(Math.max(0.02, f)); o.position.copy(S.A).lerp(S.C[o.parent === MID ? i : 0], f); }); });
    if (st.mode === 'age') { const nE = 6 + 13 * sm(st.age / 12); SIN.eth.list.forEach((E) => E.children.forEach((b, i) => { b.visible = i < nE; })); } else SIN.eth.list.forEach((E) => E.children.forEach((b) => { b.visible = true; }));
    // отток
    DOTS.visible = st.mode === 'sin' && !!st.sin;
    drains.forEach((d) => { const on = DOTS.visible && d.id === st.sin; d.ln.visible = on; d.ds.forEach((m, i) => { m.visible = on; if (on) { m.position.copy(d.c.getPointAt((st.t * 0.22 + i / d.ds.length) % 1)); } }); });
    // поток воздуха
    air.visible = M1 && st.flow && !st.sel;
    if (air.visible) { AP.forEach((p, i) => { p.u += dt * p.sp * (p.k === 3 ? 0.8 : 1); if (p.u > 1) { p.u -= 1; } const pt = FLOW[p.k].getPointAt(p.u).add(p.j); tmpM.makeTranslation(pt.x, pt.y, pt.z); air.setMatrixAt(i, tmpM); tmpC.copy(cold).lerp(warm, sm(p.u / 0.6)); air.setColorAt(i, tmpC); }); air.instanceMatrix.needsUpdate = true; air.instanceColor.needsUpdate = true; }
  }
  // ---------- выбор ----------
  function dimAll(on) {
    Object.entries(mats).forEach(([pid, arr]) => arr.forEach((m) => { const o = on(pid); m.transparent = !o || m.userData.op0 < 1; m.opacity = o ? m.userData.op0 : pid.startsWith('S:') ? 0.12 : pid === 'conch' && st.sel === 'meat' ? 0.3 : 0.14; m.depthWrite = o && m.userData.op0 >= 1; m.emissiveIntensity = m.userData.em0 + (o && (st.sel === pid || 'S:' + st.sin === pid) ? 0.2 : 0); m.needsUpdate = true; }));
  }
  function refreshDim() {
    if (st.mode === 'cav') dimAll((pid) => pid.startsWith('S:') || !st.sel || st.sel === pid || (pid === 'wall' && ['conch', 'meat', 'olf'].includes(st.sel)));
    else dimAll((pid) => (pid.startsWith('S:') ? !st.sin || pid === 'S:' + st.sin : pid === 'conch' ? false : true));
  }
  const VSEL = { ext: [V3(-3.7, -1.8, 6.8), V3(-13.0, -10.6, 18.8)], olf: [V3(0, 0.45, 4.9), V3(33, 2.8, 5.7)], phar: [V3(0, -1.85, 3.5), V3(35, -0.9, 5.1)] };
  function select(id) {
    st.sel = id === 'all' ? null : id;
    if (st.mode === 'cav') { const v = DK && VSEL[st.sel]; st.fly = v ? flyTarget(v[0], v[1]) : VIEW.cav; }
    refreshDim(); refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo();
  }
  function selSin(id) {
    st.sin = id === 'all' ? null : id; st.fly = st.mode === 'sin' ? (st.sin === 'sph' ? VIEW.sph : VIEW.sin) : st.fly;
    refreshDim(); refs.sseg && refs.sseg.sync(); refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; if (m !== 'cav' && st.sel) st.sel = null; if (m !== 'sin') st.sin = null;
    st.fly = VIEW[m === 'cav' ? 'cav' : m]; refreshDim(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  pickOn(() => self, camera, pick, (id) => {
    if (id.startsWith('S:')) { if (st.mode === 'age') return; if (st.mode !== 'sin') setMode('sin'); const s = id.slice(2); selSin(st.sin === s ? 'all' : s); return; }
    if (st.mode !== 'cav') return; select(st.sel === id ? 'all' : id);
  });
  // ---------- подписи ----------
  const P = (id) => NO_PARTS.find((p) => p.id === id), S = (id) => NO_SIN.find((s) => s.id === id);
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const M1 = () => st.mode === 'cav', sel = (id) => M1() && st.sel === id, none = () => M1() && !st.sel;
  const M23 = () => st.mode !== 'cav', sinOn = (id) => M23() && (st.mode === 'age' ? growF(id) > 0.05 : !st.sin || st.sin === id);
  const sinL = (id, i, off) => () => { const o = SIN[id].list[i]; return o.position.clone().addScaledVector(off, o.scale.x); };
  const labels = [
    lb('superior concha', V3(-0.2, 1.3, -0.2), P('conch').col, () => none() || sel('conch')),
    lb('middle concha', V3(-0.3, 0.0, 0.6), P('conch').col, () => none() || sel('conch')),
    lb('inferior concha', V3(-0.35, -1.55, 0.8), P('conch').col, () => none() || sel('conch')),
    lb('superior meatus', V3(-0.3, 0.75, -0.4), '#FFC8CC', () => sel('conch'), true),
    lb('middle meatus', V3(-0.4, -0.75, -0.1), '#FFC8CC', () => sel('conch'), true),
    lb('inferior meatus', V3(-0.4, -2.55, 0.6), '#FFC8CC', () => sel('conch'), true),
    lb('vestibule', V3(-0.4, -2.0, 5.4), P('ext').col, () => none() && DK),
    lb('frontal sinus', V3(0.1, 5.25, 3.35), SINC.fr, () => none()),
    lb('sphenoidal sinus', V3(0.1, 0.35, -2.4), SINC.sph, () => none() && DK),
    lb('pituitary gland', V3(0.1, 2.25, -2.75), '#F2A8C8', () => none() && DK, true),
    lb('hard palate', V3(0.1, -3.2, 1.0), '#E8DCC8', () => none() && DK),
    lb('choana', V3(-0.4, -1.9, -1.35), P('phar').col, () => none() && DK, true),
    lb('soft palate', V3(0.1, -3.9, -2.2), '#E8A0AA', () => none() && DK),
    lb('pharynx', V3(0.1, -4.6, -5.1), '#E8A0AA', () => none() && DK),
    lb('skin', V3(0.1, -0.7, 6.35), '#E8B49A', () => none() && DK),
    lb('nasal bone', V3(-0.3, 2.4, 4.75), '#E8DCC8', () => sel('ext')),
    lb('lateral cartilage', V3(-0.7, 0.8, 5.6), '#9CC8E8', () => sel('ext')),
    lb('major alar cartilage', V3(-0.6, -1.2, 6.9), '#7AB0E8', () => sel('ext')),
    lb('ala of the nose', V3(-1.85, -1.95, 5.5), '#E8C8A0', () => sel('ext'), true),
    lb('nostril', V3(-0.55, -2.72, 5.95), '#FFC8CC', () => sel('ext')),
    lb('septal cartilage', V3(0.2, 0.2, 3.9), '#BFD8FF', () => sel('sept')),
    lb('perpendicular plate', V3(0.2, 1.6, 1.0), '#E8DCC8', () => sel('sept')),
    lb('vomer', V3(0.2, -1.8, 0.4), '#D8C8A8', () => sel('sept')),
    lb('Kiesselbach’s area', V3(0.2, -2.1, 4.1), '#FF8A94', () => sel('sept')),
    lb('sphenopalatine artery', V3(0.2, -0.9, 1.2), '#FF8A94', () => sel('sept'), true),
    lb('anterior ethmoidal artery', V3(0.2, 0.4, 3.4), '#FF8A94', () => sel('sept')),
    lb('semilunar hiatus', () => hiatC.getPoint(0.78), '#FFE27A', () => sel('meat')),
    lb('ethmoidal bulla', onWall(1.7, 0.4, 0.4), '#FFC8CC', () => sel('meat'), true),
    lb('maxillary sinus opening', OPEN[3].p, SINC.max, () => sel('meat'), true),
    lb('frontonasal duct', OPEN[0].p.clone().add(V3(0, 0.45, 0)), SINC.fr, () => sel('meat')),
    lb('posterior ethmoidal cells', OPEN[4].p, SINC.eth, () => sel('meat'), true),
    lb('sphenoidal sinus opening', OPEN[5].p.clone().add(V3(0, 0.35, 0)), SINC.sph, () => sel('meat'), true),
    lb('nasolacrimal duct', OPEN[6].p, '#7FD8E0', () => sel('meat')),
    lb('olfactory bulb', V3(-0.4, 2.95, 1.9), '#F2D45A', () => sel('olf')),
    lb('cribriform plate', V3(0.05, 2.4, 0.0), '#E8DCC8', () => sel('olf'), true),
    lb('olfactory nerves', V3(-0.5, 1.9, 2.0), '#F5E08A', () => sel('olf')),
    lb('olfactory region', V3(-0.5, 1.8, 0.4), '#F2E07A', () => sel('olf'), true),
    lb('choana', V3(-0.4, -1.6, -1.3), P('phar').col, () => sel('phar')),
    lb('auditory tube opening', V3(-1.4, -1.8, -2.4), '#E8C8F0', () => sel('phar'), true),
    lb('pharyngeal tonsil', V3(0.1, -1.9, -3.6), P('phar').col, () => sel('phar')),
    lb('soft palate', V3(0.1, -3.9, -2.2), '#E8A0AA', () => sel('phar')),
    // пазухи
    lb('frontal', sinL('fr', 1, V3(-0.1, 1.75, 0)), SINC.fr, () => sinOn('fr')),
    lb('ethmoidal', sinL('eth', 0, V3(-1.35, 2.4, 1.6)), SINC.eth, () => sinOn('eth'), true),
    lb('maxillary', sinL('max', 0, V3(-0.45, 0.15, 0.7)), SINC.max, () => sinOn('max'), true),
    lb('sphenoidal', sinL('sph', 1, V3(-0.45, 0.05, 0)), SINC.sph, () => sinOn('sph') && (st.mode === 'age' || st.sin === 'sph' || DK), true),
    lb('middle meatus', V3(-1.4, -0.4, 2.0), '#FFFFFF', () => st.mode === 'sin' && ['fr', 'max', 'eth'].includes(st.sin)),
    lb('superior meatus', V3(-0.65, 0.72, 0.0), '#FFFFFF', () => st.mode === 'sin' && st.sin === 'eth', true),
    lb('orbit', V3(-3.4, 3.1, 2.6), '#C8D2E0', () => M23() && DK && !st.sin),
    lb('wireframe = adult sinus size', V3(3.6, -2.7, 1.8), '#E8E8E8', () => st.mode === 'age' && st.age < 17 && DK),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  // ---------- панель ----------
  const INTRO = '<b>The nasal cavity</b> is the start of the airway. More than 10,000 liters of air pass through the nose every day: here it is cleaned, warmed and humidified, and up under the roof it is “tasted” for smell. Shown is the right half, viewed from the side of the removed septum; the dots are the inhaled airflow. Click a part or choose it below.';
  const INTRO2 = '<b>The paranasal sinuses</b> are air spaces in the bones around the nose: frontal, ethmoidal, maxillary and sphenoidal. They are lined with the same mucosa as the nose, and cilia sweep mucus toward narrow openings in the nasal meatuses. The sinuses lighten the skull and probably affect the timbre of the voice. Choose a sinus to see how it drains.';
  const ageText = () => NO_AGE.find(([a]) => 25 * st.ageV * st.ageV < a)[1];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.mode === 'age' ? ageText() : st.mode === 'sin' ? (st.sin ? S(st.sin).text : INTRO2) : st.sel ? P(st.sel).text : INTRO; };
    refs.modeSeg = seg([{ id: 'cav', label: 'Nasal cavity' }, { id: 'sin', label: 'Sinuses' }, { id: 'age', label: 'Sinuses and age' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.seg = refs.sseg = null;
      if (st.mode === 'cav') {
        refs.seg = seg([{ id: 'all', label: 'All' }, ...NO_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => select(v));
        box.append(h('div', { class: 'glabel' }, 'Parts', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg));
        refs.flowT = toggle('Airflow', () => st.flow, (v) => { st.flow = v; }); view.append(refs.flowT);
      } else if (st.mode === 'sin') {
        refs.sseg = seg([{ id: 'all', label: 'All' }, ...NO_SIN.map((s) => ({ id: s.id, label: s.name, color: s.col }))], () => st.sin || 'all', (v) => selSin(v));
        box.append(h('div', { class: 'glabel' }, 'Sinuses', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.sseg));
      } else {
        let last = -1;
        box.append(h('div', { class: 'glabel' }, 'Age'), h('div', { class: 'gctl' }, range('noAge', 0, 1, 0.005, () => st.ageV, (v) => { st.ageV = v; const b = NO_AGE.findIndex(([a]) => 25 * v * v < a); if (b !== last) { last = b; refs.setInfo(); } }, ageFmt)));
      }
      if (st.mode !== 'cav') { refs.skT = toggle('Skull', () => st.skull, (v) => { st.skull = v; }); view.append(refs.skT); }
      view.append(refs.rot, refs.lab);
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'View', h('kbd', {}, 'R · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['cav', 'sin', 'age'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'cav') select('all'); else if (st.mode === 'sin') selSin('all'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'f' || k === 'а') && refs.flowT && st.mode === 'cav') { refs.flowT.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'age') { const a = st.age, f = growF('fr') > 0.02, s = growF('sph') > 0.02; return [['Age', a < 2 ? Math.round(a * 12) : Math.floor(a), ageWord(a < 2 ? a : Math.floor(a))], ['Frontal', f ? 'yes' : 'no', ''], ['Sphenoid', s ? 'yes' : 'no', '']]; }
    if (st.mode === 'sin') { if (!st.sin) return [['Sinuses', 4, 'pairs'], ['Largest', '≈ 15', 'mL']]; const s = S(st.sin); return st.sin === 'eth' ? [['Cells', s.vol, 'per side'], ['Drains to', s.out, '']] : [['Volume', s.vol, 'mL'], ['Drains to', s.out, st.sin === 'sph' || !DK ? '' : 'meatus']]; }
    if (st.flow && !st.sel) return [['At the nostril', '≈ 20', '°C'], ['In nasopharynx', '≈ 34', '°C']];
    return [['Air', '10–12', 'thousand L a day'], ['Mucosal area', '≈ 150', 'cm²']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'cav' ? (st.sel ? P(st.sel).col : '#E87A8A') : st.sin ? S(st.sin).col : '#5FB8F0'; },
    kicker: 'Body · organ systems', title: 'Nose and paranasal sinuses',
    lede: 'The nose is more than an air intake: the conchae swirl the flow, the mucosa warms and humidifies it, cilia carry dust away, and right under the roof live the olfactory neurons. Around it are four pairs of sinuses — hollow “rooms” in the bones of the face.',
    notes: `
      <div><h2>Structure</h2>
        <p>The nasal cavity opens to the outside through the nostrils and backward through the choanae into the nasopharynx. Its floor is the hard palate, its roof the narrow cribriform plate, its inner wall the septum, and its lateral wall carries the conchae and meatuses. The vestibule is lined with hairy skin, the rest of the cavity with ciliated respiratory mucosa, and the roof with olfactory mucosa.</p>
        <p>Smell is carried by the olfactory nerve (I). Pain, touch and temperature travel in branches of the trigeminal nerve: the anterior ethmoidal (V₁) and the nasopalatine and posterior nasal nerves (V₂). Blood comes from the sphenopalatine artery (a branch of the maxillary), the anterior and posterior ethmoidal arteries (from the ophthalmic), the greater palatine artery and branches of the facial artery.</p></div>
      <div><h2>How the nose works</h2>
        <p>Mucus traps dust and microbes, and the cilia, beating 10–15 times a second, sweep it back into the throat at about 5–10 mm a minute — we swallow it without noticing. As air passes through the meatuses, it is warmed almost to body temperature and saturated with moisture. Only a small part of each breath reaches the olfactory cleft — that is why we sniff to pick up a smell.</p>
        <p>The mucosa of the conchae swells and shrinks in turn: every few hours one half of the nose breathes more freely than the other (the “nasal cycle”). We usually don’t notice it.</p></div>
      <div><h2>Medicine</h2><ul>
        <li><b>Runny nose</b> (rhinitis) — swollen mucosa and excess mucus; usually viral, sometimes allergic.</li>
        <li><b>Sinusitis</b> — inflammation of the sinuses, usually when swelling closes the narrow openings in the middle meatus. The maxillary sinus is affected most often.</li>
        <li><b>Nosebleed</b> — most often from Kiesselbach’s area. First aid: sit down, lean your head <i>forward</i> and pinch the soft part of the nose for 10–15 minutes; do not tilt the head back.</li>
        <li><b>A deviated septum</b> and <b>polyps</b> obstruct breathing and sinus drainage; they are corrected surgically.</li>
        <li><b>Loss of smell</b> (anosmia) can follow viral infections or injury to the cribriform plate, and can be an early sign of some brain diseases.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>Shapes are schematic and built after the atlas; the conchae, meatuses and the cut bones and soft tissues are simplified, vessels are shown only on the septum, and the only nerves shown are the olfactory ones.</li><li>The sinuses and drainage paths are drawn as stylized bodies inside a scan of an adult skull; the size and shape of the sinuses vary a lot between people. In “Sinuses and age” mode the sinuses grow inside the same adult skull, and the timing is average.</li><li>The airflow and its warming are shown with dots as an illustration; in reality the flow is turbulent, and part of each breath also passes through the inferior meatus.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> clear selection</li><li><code>F</code> airflow · <code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('cav'); st.fly = null; camera.position.copy(VIEW.cav.pos); controls.target.copy(VIEW.cav.target);
  return self;
}
export { makeNose };
