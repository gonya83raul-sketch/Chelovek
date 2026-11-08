import { LANG, THREE, V3, __set_rnd, envTex, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mulberry, pickOn, range, rnd, seg, toggle } from '../core.js';


// @scene mouth makeMouth | Полость рта и зубы | @body Системы органов
/* =========================================================
   ТЕЛО · ПОЛОСТЬ РТА И ЗУБЫ: открытый рот (нёбо, язык, миндалины, слюнные железы), зубные дуги и смена зубов с возрастом,
   продольный разрез моляра и развитие кариеса. Сверено с атласом Неттера (табл. 65–74).
   Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека. Разрез зуба увеличен.
   ========================================================= */
const MO_PARTS = [
  { id: 'teeth', name: 'Teeth', col: '#F3EEDF', text: '<b>Teeth.</b> An adult has 32 teeth — 8 in each quarter: 2 incisors, a canine, 2 premolars and 3 molars (formula 2-1-2-3). Incisors bite off, canines grip and tear, premolars and molars crush and grind food with a force of up to 500–700 N. The third molars, the “wisdom teeth”, erupt last, and in many people never erupt at all.' },
  { id: 'gum', name: 'Gums', col: '#E58C98', text: '<b>The gum</b> (gingiva) is mucosa firmly attached to the alveolar processes of the jaws and wrapped around the necks of the teeth. Between its edge and the tooth lies a narrow gingival sulcus 1–2 mm deep. If plaque builds up there, the gum becomes inflamed and bleeds (gingivitis); later the ligament and bone around the tooth may break down (periodontitis).' },
  { id: 'hard', name: 'Hard palate', col: '#F0B8B0', text: '<b>The hard palate</b> is the bony roof of the mouth and at the same time the floor of the nasal cavity: its front ⅔ are the palatine processes of the maxillae, the back ⅓ the horizontal plates of the palatine bones. The mucosa forms transverse ridges — the tongue presses and grinds food against them. A raphe runs down the midline, and just behind the incisors sits the incisive papilla.' },
  { id: 'soft', name: 'Soft palate and uvula', col: '#E07A8A', text: '<b>The soft palate</b> is a muscular curtain continuing the hard palate backwards, with the uvula hanging in the middle. When we swallow, its muscles lift and tighten it, closing the way into the nasopharynx so food does not enter the nose. When a person breathes through the nose, the soft palate hangs down and rests on the root of the tongue.' },
  { id: 'tons', name: 'Palatine tonsils', col: '#D46A7A', text: '<b>The palatine tonsils</b> sit in niches between the front palatoglossal and the rear palatopharyngeal arches. They are lymphoid tissue with deep clefts, the crypts: they “sample” everything that enters the mouth and start the immune response. With the lingual, pharyngeal (adenoids) and tubal tonsils they form the lymphoid ring of the pharynx. Their inflammation is tonsillitis.' },
  { id: 'tongue', name: 'Tongue', col: '#E89AA0', text: '<b>The tongue</b> is a muscular organ: its intrinsic muscles change its shape, the extrinsic ones move it as a whole. The V-shaped terminal sulcus divides it into the body (front ⅔) and the root (back ⅓) with the lingual tonsil. In front of the sulcus stand the large vallate papillae; the back carries filiform papillae and fungiform ones (the red dots).' },
  { id: 'glands', name: 'Salivary glands', col: '#E8C46A', text: '<b>The salivary glands</b> produce 0.5–1.5 L of saliva a day. The <b>parotid</b> is the largest; its duct opens on the cheek opposite the upper second molar. The <b>submandibular</b> gland makes most of the saliva at rest; its duct opens on the sublingual caruncle beside the frenulum of the tongue. The <b>sublingual</b> is the smallest. Salivary amylase starts breaking down starch.' },
];
const MO_TYPES = [
  { id: 'inc', name: 'Incisors', col: '#F2D16B', text: '<b>Incisors</b> — the 8 front teeth: a chisel-shaped crown with a cutting edge and one root. They bite food off. The upper central incisors are the widest, the lower ones the narrowest teeth in the mouth.' },
  { id: 'can', name: 'Canines', col: '#F29A5C', text: '<b>Canines</b> — 4 teeth with a single pointed cusp and the longest root (up to 17 mm in the upper canine). They grip and tear food and are the first to take the load when the jaw moves sideways.' },
  { id: 'pm', name: 'Premolars', col: '#7FD39A', text: '<b>Premolars</b> — 8 teeth with two cusps, a cheek-side and a tongue-side one. They begin to crush food. Baby teeth have no premolars: they grow in where the baby molars were.' },
  { id: 'mol', name: 'Molars', col: '#7FB8F0', text: '<b>Molars</b> — 12 teeth with 4–5 cusps; the upper ones usually have three roots, the lower ones two. They grind food. The first permanent molar is the first permanent tooth to erupt — at about 6, behind the baby teeth, which is why it is often mistaken for a baby tooth.' },
];
// места в четверти: ширина коронки (см) вверху/внизу, прорезывание постоянного и молочного зуба (лет)
const MO_SLOT = [
  { t: 'inc', wu: 0.85, wl: 0.52, du: 0.7, dl: 0.6, hu: 1.05, hl: 0.9, eu: 7.5, el: 6.5, mu: 0.8, ml: 0.6 },
  { t: 'inc', wu: 0.66, wl: 0.56, du: 0.6, dl: 0.6, hu: 0.92, hl: 0.92, eu: 8.5, el: 7.5, mu: 0.85, ml: 1.05 },
  { t: 'can', wu: 0.76, wl: 0.68, du: 0.8, dl: 0.75, hu: 1.0, hl: 1.0, eu: 11.5, el: 10, mu: 1.6, ml: 1.6 },
  { t: 'pm', wu: 0.7, wl: 0.7, du: 0.9, dl: 0.8, hu: 0.82, hl: 0.8, eu: 10.5, el: 10.5, mu: 1.3, ml: 1.3 },
  { t: 'pm', wu: 0.66, wl: 0.72, du: 0.9, dl: 0.82, hu: 0.78, hl: 0.78, eu: 11, el: 11.5, mu: 2.3, ml: 2.2 },
  { t: 'mol', wu: 1.0, wl: 1.1, du: 1.1, dl: 1.02, hu: 0.74, hl: 0.75, eu: 6.3, el: 6.0 },
  { t: 'mol', wu: 0.9, wl: 1.04, du: 1.08, dl: 1.0, hu: 0.72, hl: 0.72, eu: 12.5, el: 12 },
  { t: 'mol', wu: 0.85, wl: 1.0, du: 1.02, dl: 0.98, hu: 0.68, hl: 0.7, eu: 19, el: 19 },
];
const MO_AGE = [
  [0.5, '<b>The first months.</b> No teeth are visible yet, but the jaws already hold the buds of all 20 baby teeth, and the crowns of the first permanent molars are starting to calcify.'],
  [2.6, '<b>Baby teeth erupt.</b> The lower central incisors usually come first (at about 6–10 months), the second baby molars last (by 2–3 years). Timing varies by several months between children — this is normal.'],
  [6, '<b>Primary (baby) dentition:</b> 20 teeth, 5 in each quarter — 2 incisors, a canine and 2 molars (formula 2-1-0-2). Baby teeth are smaller and whiter, with thinner enamel, so decay progresses faster in them. They hold space for the permanent teeth: if a baby tooth is removed early, its neighbors drift into the gap.'],
  [12.4, '<b>Mixed dentition.</b> At about age 6 the first permanent molars erupt behind the baby teeth — without replacing anything, into free space. Then the roots of the baby teeth dissolve, the teeth fall out, and permanent ones take their place: incisors, canines and, instead of the baby molars, premolars.'],
  [17, '<b>Permanent dentition.</b> By age 12–13 the second molars erupt, bringing the count to 28. The jaws are still growing, and the roots of the last teeth finish forming by 14–15.'],
  [99, '<b>Wisdom teeth.</b> The third molars erupt at 17–25 or even later. Modern human jaws are shorter than our ancestors’, and there is often not enough room: the tooth stays in the bone (impaction) or grows at an angle and pushes against its neighbor. Some people have no wisdom-tooth buds at all.'],
];
const MO_LAY = [
  { id: 'enamel', name: 'Enamel', col: '#F6F3EA', text: '<b>Enamel</b> is the hardest tissue in the body: 96% hydroxyapatite crystals. It covers the crown in a layer up to 2–2.5 mm thick on the cusps, thinning toward the neck. Enamel has no cells, vessels or nerves: it does not hurt and does not grow back — only at an early stage of damage can it regain minerals from saliva and fluoride.' },
  { id: 'dentin', name: 'Dentin', col: '#E8CC92', text: '<b>Dentin</b> is the bulk of the tooth, softer than enamel (about 70% mineral) and yellowish. It is riddled with tubules holding processes of odontoblast cells: cold, sweet and acid move the fluid in them and irritate the nerves of the pulp — which is why exposed dentin is sensitive. Dentin is laid down throughout life, and the pulp cavity narrows.' },
  { id: 'pulp', name: 'Pulp', col: '#E46A78', text: '<b>Pulp</b> — the “nerve” of the tooth: loose connective tissue with vessels and nerves filling the pulp chamber and root canals. They enter through the apical foramen at the tip of the root. Odontoblasts line the edge of the pulp and build dentin. Inflamed pulp has no room to swell — the hard walls squeeze it, hence the severe pain of pulpitis.' },
  { id: 'cement', name: 'Cementum', col: '#CDB98C', text: '<b>Cementum</b> is a thin, bone-like layer covering the root. Fibers of the periodontal ligament are woven into it and hold the tooth in its socket.' },
  { id: 'pdl', name: 'Periodontal ligament', col: '#C8807A', text: '<b>The periodontal ligament</b> is a gap 0.1–0.3 mm wide between the root and the wall of the socket, filled with bundles of collagen fibers. The tooth is not fused to the bone but slung on these fibers and gives slightly when we chew; receptors in the ligament sense how hard we bite. The drawing shows the gap wider than it really is.' },
  { id: 'gum3', name: 'Gum', col: '#E58C98', text: '<b>The gum</b> wraps the neck of the tooth and attaches to it and to the bone. Between the free edge of the gum and the enamel lies the gingival sulcus, 1–2 mm deep — this is where inflammation starts when brushing is poor.' },
  { id: 'bone', name: 'Bone', col: '#D9CDB6', text: '<b>The alveolar process</b> of the jaw is bone with sockets for the roots. It exists only as long as there are teeth: after a tooth is removed, the bone of its socket gradually shrinks. Below the roots of the lower teeth the mandibular canal runs through the bone with the nerve and vessels of the same name, sending branches to every tooth.' },
];
const MO_CAR = [
  { c: 0, name: 'Healthy tooth', pv: 'no', pain: '', text: '<b>Tooth structure</b> — a lengthwise section of a lower first molar. The crown is covered with enamel and the roots with cementum; beneath them is dentin, and in the center the pulp with its vessels and nerves. The roots sit in the sockets of the jaw on the periodontal ligament. Move the “Decay” slider to watch the damage progress, or pick a layer.' },
  { c: 0.03, name: 'White spot', pv: 'no', pain: '', text: '<b>White spot.</b> Plaque bacteria (above all <i>Streptococcus mutans</i>) ferment sugars into acids. When the pH at the surface drops below ~5.5, enamel loses minerals and a chalky spot appears. The surface is still intact and the process can reverse: fluoride and saliva put the minerals back.' },
  { c: 0.2, name: 'Enamel decay', pv: 'no', pain: '', text: '<b>Enamel decay.</b> The surface has broken down and a cavity has formed. Decay most often starts in fissures — the grooves between the cusps — and on contact surfaces, where plaque is hard to clean off. Enamel has no nerves, so the tooth does not hurt yet. It needs a filling.' },
  { c: 0.4, name: 'Dentin decay', pv: 'yes', pain: 'from sweets and cold', text: '<b>Dentin decay.</b> Dentin is softer than enamel, so decay spreads sideways in it, undermining the enamel: a small hole outside, a large cavity inside. Through the dentinal tubules the irritation reaches the pulp: a brief pain from sweet, cold or sour food that stops as soon as the trigger is removed.' },
  { c: 0.7, name: 'Pulpitis', pv: 'yes', pain: 'severe, at night', text: '<b>Pulpitis.</b> Bacteria have reached the pulp. It becomes inflamed and swells, but cannot expand inside the hard walls — the pressure squeezes the nerves. The pain is severe, comes in attacks and on its own, often at night, and radiates to the ear or temple. Treatment: remove the pulp and fill the canals.' },
  { c: 0.86, name: 'Periodontitis', pv: 'yes', pain: 'on biting', text: '<b>Periodontitis.</b> The pulp has died and the infection has escaped through the apical foramen into the bone. A focus of inflammation forms at the root tip — an abscess or granuloma. The tooth hurts on biting, and a gumboil may appear — swelling of the gum and cheek. Untreated, the bone around the root tip is destroyed.' },
];
function makeMouth() {
  __set_rnd(mulberry(1801));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0xffd8c8);
  { const fl = new THREE.DirectionalLight(0xfff0ea, 1.3); fl.position.set(0, -8, 10); scene.add(fl); }   // подсветка снизу-спереди — видно нёбо
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = {
    mouth: flyTarget(V3(DK ? -1.95 : 0, DK ? -1.45 : -0.6, -1.2), DK ? V3(-1.95, -4.85, 18.6) : V3(0, -3.6, 15.2)),
    palate: flyTarget(V3(DK ? -2.4 : 0, DK ? -1.0 : -0.5, -1.2), DK ? V3(-2.4, -9.4, 20) : V3(0, -7.0, 14.5)),
    tongue: flyTarget(V3(DK ? -2.8 : 0, DK ? -2.4 : -2.6, -1.4), DK ? V3(-2.8, 10, 17.8) : V3(0, 7.5, 14)),
    teeth: flyTarget(V3(DK ? -4.0 : 0, 0, DK ? 0.9 : 0), DK ? V3(-4.0, 20, 6.0) : V3(0, 16.6, 3.4)),
    tooth: flyTarget(V3(DK ? -3.0 : 0, DK ? -1.7 : 0.8, 0), DK ? V3(-0.5, -0.7, 27.5) : V3(2, 1.8, 20)),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.mouth.pos);
  const controls = makeControls(camera, VIEW.mouth.target); controls.minDistance = 3; controls.maxDistance = 34;
  const st = { t: 0, mode: 'mouth', sel: null, ty: null, lay: null, ageV: 1, age: 25, open: 0.5, car: 0, carS: 0, labels: true, rot: false, fly: null };
  const mats = {}, pick = [];
  const mat = (id, col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.82), roughness: o.r ?? 0.5, clearcoat: o.cc ?? 0.35, sheen: 0.3, sheenColor: new THREE.Color(0xffffff), emissive: col, emissiveIntensity: o.em ?? 0.05, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined }); m.userData.op0 = o.op ?? 1; m.userData.em0 = o.em ?? 0.05; if (id) (mats[id] = mats[id] || []).push(m); return m; };
  const add = (geo, m, id, parent = scene) => { const ms = new THREE.Mesh(geo, m); if (id) { ms.userData.pick = id; pick.push(ms); } parent.add(ms); return ms; };
  const surf = (f, nu, nv) => { const pos = [], idx = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = f(i / nu, j / nv); pos.push(p.x, p.y, p.z); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const blob = (r, col, id, parent, sc) => { const m = add(new THREE.SphereGeometry(r, 20, 14), col, id, parent); if (sc) m.scale.set(...sc); return m; };
  const tube = (pts, r, m, id, parent) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, r, 8), m, id, parent);

  // ---------- челюсти: верхняя неподвижна, нижняя открывается вокруг височно-нижнечелюстного сустава ----------
  const HINGE = V3(0, 2.2, -5.2);
  const UJ = new THREE.Group(); scene.add(UJ); const UA = new THREE.Group(); UJ.add(UA);   // UA — дуга (масштаб по возрасту)
  const LJ = new THREE.Group(); LJ.position.copy(HINGE); scene.add(LJ); const LJin = new THREE.Group(); LJin.position.copy(HINGE).negate(); LJ.add(LJin); const LA = new THREE.Group(); LJin.add(LA);
  const SOFT = new THREE.Group(); UJ.add(SOFT); const LSOFT = new THREE.Group(); LJin.add(LSOFT);   // мягкие части — скрыты в режиме «Зубы»
  const AP = [[2.72, -2.4], [2.62, -1.45], [2.46, -0.45], [2.26, 0.45], [2.0, 1.15], [1.56, 1.85], [0.86, 2.36], [0, 2.56]];
  const archPts = (sx, sz, dz) => { const half = AP.map(([x, z]) => V3(x * sx, 0, z * sz + dz)); return [...half, ...half.slice(0, -1).reverse().map((p) => V3(-p.x, 0, p.z))]; };
  const ARC = { u: new THREE.CatmullRomCurve3(archPts(1, 1, 0)), l: new THREE.CatmullRomCurve3(archPts(0.93, 0.96, -0.08)) };
  const frame = (jaw, u) => { const c = ARC[jaw], P = c.getPointAt(cl(u)), T = c.getTangentAt(cl(u)); return { P, T, N: V3(T.z, 0, -T.x).normalize() }; };
  // коронка: «суперэллипсоид» с буграми; Y от 0 (шейка) до ≈h (бугры)
  const crownGeo = (ty, w, d, h) => {
    const g = new THREE.SphereGeometry(1, 22, 16), p = g.attributes.position;
    const cs = ty === 'pm' ? [[0, 0.24, 1], [0, -0.24, 0.8]] : ty === 'mol' ? [[0.25, 0.25, 1], [-0.25, 0.25, 0.95], [0.25, -0.25, 0.9], [-0.25, -0.25, 0.85]] : [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z), R = r > 1e-6 ? Math.pow(r, 0.5) / r : 0, wt = cl((y - 0.05) / 0.75);
      let X = x * R * w / 2, Z = z * R * d / 2, Y = h * (0.5 + 0.5 * y) * 0.8;
      if (ty === 'inc') { Z *= 1 - 0.68 * wt; Y = h * (0.5 + 0.5 * Math.sign(y) * Math.pow(Math.abs(y), 0.6)); }
      else if (ty === 'can') { Z *= 1 - 0.3 * wt; X *= 1 - 0.25 * wt; Y += 0.32 * h * wt * Math.exp(-((X / (0.3 * w)) ** 2)); }
      else { let b = 0; cs.forEach(([cx, cz, a]) => { b += a * Math.exp(-(((X - cx * w) / (0.26 * w)) ** 2) - (((Z - cz * d) / (0.26 * d)) ** 2)); }); Y += 0.24 * h * wt * Math.min(1.1, b); }
      p.setXYZ(i, X, Y, Z);
    }
    g.computeVertexNormals(); return g;
  };
  const TEETH = [], slotDist = { u: [], l: [] }, slotEnd = { u: [], l: [] };
  ['u', 'l'].forEach((jaw) => {
    const L = ARC[jaw].getLength() / 2, ws = MO_SLOT.map((s) => s['w' + jaw]), tot = ws.reduce((a, b) => a + b, 0), k = (L * 0.975) / tot;
    let acc = 0; ws.forEach((w) => { slotDist[jaw].push((acc + w / 2) * k); acc += w; slotEnd[jaw].push(acc * k); });
    [1, -1].forEach((s) => MO_SLOT.forEach((sl, i) => {
      const u = 0.5 - (s * slotDist[jaw][i]) / (2 * L), fr = frame(jaw, u), w = sl['w' + jaw] * k * 0.94;
      const mk = (dec) => {
        const ty = dec && i >= 3 ? 'mol' : sl.t, h = sl['h' + jaw] * (dec ? 0.82 : 1), d = sl['d' + jaw] * (dec ? 0.85 : 1);
        const m = new THREE.MeshPhysicalMaterial({ color: 0xf3eedf, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25, emissive: 0xfff6e0, emissiveIntensity: 0.04, transparent: true, opacity: 1 });
        const ms = add(crownGeo(ty, w, d, h), m, 'teeth', jaw === 'u' ? UA : LA);
        const Y = V3(0, jaw === 'u' ? -1 : 1, 0), X = fr.T.clone(), Z = X.clone().cross(Y);
        ms.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
        const t = { jaw, s, i, dec, ms, h, ty: sl.t, P: fr.P.clone(), N: fr.N.clone(), erupt: dec ? sl['m' + jaw] : sl['e' + jaw], e: 1 };
        if (dec) t.shed = sl['e' + jaw] - 0.35;
        TEETH.push(t); return t;
      };
      mk(false); if (i < 5) mk(true);
    }));
  });
  const placeTooth = (t) => { const sink = (1 - t.e) * (t.h + 0.35), up = t.jaw === 'u' ? 1 : -1; t.ms.position.set(t.P.x, up * (t.h + sink - 0.02), t.P.z); };
  // дёсны: трубка эллиптического сечения вдоль дуги
  const gumM = mat('gum', '#E58C98', { side: THREE.DoubleSide, r: 0.55, k: 0.88 });
  const gumGeo = (jaw, fr0) => { const yc = jaw === 'u' ? 1.12 : -1.12; return surf((a, b) => { const u = 0.5 + (a - 0.5) * fr0, fr = frame(jaw, u), tp = Math.sqrt(cl(Math.min(a, 1 - a) * fr0 / 0.025)), ang = 2 * Math.PI * b;
      return fr.P.clone().addScaledVector(fr.N, 0.64 * Math.cos(ang) * tp).add(V3(0, yc + 0.5 * Math.sin(ang) * tp, 0)); }, 160, 16); };
  const GUM = {}; ['u', 'l'].forEach((jaw) => { GUM[jaw] = add(gumGeo(jaw, 0.992), gumM, 'gum', jaw === 'u' ? UA : LA); GUM[jaw].userData.k = 7; });
  // десна ребёнка короче: заканчивается за последним прорезавшимся (или вот-вот прорежущимся) зубом
  const gumTo = (jaw, kk) => { const g = GUM[jaw]; if (g.userData.k === kk) return; g.userData.k = kk; const L = ARC[jaw].getLength() / 2; g.geometry.dispose(); g.geometry = gumGeo(jaw, kk >= 7 ? 0.992 : Math.min(0.992, (slotEnd[jaw][kk] + 0.55) / L)); };
  // твёрдое нёбо: купол внутри верхней дуги, с поперечными складками и швом
  const hardM = mat('hard', '#F0B8B0', { side: THREE.DoubleSide, r: 0.6, k: 0.9, em: 0.3 });
  const vault = (x, z) => 1.2 + (0.42 + 0.7 * cl((1.8 - z) / 3.6)) * Math.cos(Math.PI / 2 * cl(Math.abs(x) / 2.2)) ** 0.8;
  const PALF = []; PALF.push(add(surf((a, b) => {
    const u = 0.012 + 0.976 * a, fr = frame('u', u), e = fr.P.clone().addScaledVector(fr.N, -0.5), x = e.x * (1 - b), z = e.z;
    const rug = 0.07 * Math.max(0, Math.sin(z * 9 + Math.abs(x) * 2)) * cl((z - 0.5) / 0.6) * cl(1 - Math.abs(x) / 1.4);
    return V3(x, vault(x, z) - rug - 0.035 * Math.exp(-((x / 0.1) ** 2)) * cl((z + 1.5) / 1), z);
  }, 120, 14), hardM, 'hard', UA));
  PALF.push(blob(0.13, hardM, 'hard', UA, [1, 0.6, 1.3])); PALF[1].position.set(0, vault(0, 1.95) - 0.05, 1.95);   // резцовый сосочек
  // мягкое нёбо, язычок
  const softM = mat('soft', '#F094A0', { side: THREE.DoubleSide, r: 0.55, k: 1.0, em: 0.55 });
  const ZH = -2.38;   // задний край твёрдого нёба
  const softP = (a, b) => { const hw = 2.25 - 0.45 * b, x = a * hw, y0 = vault(x, ZH), y1 = 0.95 - 0.55 * a * a; return V3(x, y0 + (y1 - y0) * b - 0.1 * Math.sin(Math.PI * b), ZH - 1.2 * b); };
  add(surf((a, b) => softP(2 * a - 1, b), 30, 10), softM, 'soft', SOFT);
  const uvula = add(new THREE.CapsuleGeometry(0.22, 0.68, 6, 12), softM, 'soft', SOFT); uvula.position.set(0, 0.5, -3.56); uvula.rotation.x = 0.12;
  blob(0.42, softM, 'soft', SOFT, [1, 0.45, 0.8]).position.set(0, 0.92, -3.55);   // основание язычка
  // задняя стенка глотки — тёмный фон за зевом
  const phM = mat(null, '#B04A58', { side: THREE.DoubleSide, r: 0.8, k: 1.0, em: 0.35 });
  { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d'), gr = cx.createRadialGradient(32, 32, 4, 32, 32, 32); gr.addColorStop(0, '#fff'); gr.addColorStop(0.55, '#bbb'); gr.addColorStop(1, '#000'); cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
    phM.alphaMap = new THREE.CanvasTexture(cv); phM.transparent = true; phM.depthWrite = false; phM.userData.op0 = 0.999;
    add(surf((a, b) => { const x = (a - 0.5) * 4.4, y = -3.6 + 5.4 * b; return V3(x, y, -4.5 - 0.8 * (x / 2.2) ** 2); }, 16, 12), phM, null, SOFT); }
  // дужки и миндалины (перестраиваются при открывании рта)
  const archM = mat('tons', '#D9707E', { r: 0.55 }), tonsM = mat('tons', '#C85A6C', { r: 0.75, k: 0.9 });
  const curtM = mat('tons', '#C86474', { side: THREE.DoubleSide, r: 0.6 });
  const ARCHES = [1, -1].map((s) => ({ s, pg: add(new THREE.BufferGeometry(), archM, 'tons', scene), pp: add(new THREE.BufferGeometry(), archM, 'tons', scene), pgc: add(new THREE.BufferGeometry(), curtM, 'tons', scene), ppc: add(new THREE.BufferGeometry(), curtM, 'tons', scene), tons: blob(0.5, tonsM, 'tons', scene, [0.62, 1.0, 0.55]) }));
  const crypts = []; ARCHES.forEach((A) => { for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.CircleGeometry(0.045, 8), new THREE.MeshBasicMaterial({ color: 0x5a1e28 })); A.tons.add(c); const a = (i / 6) * Math.PI * 2 + 0.4, rr = 0.25 + 0.15 * (i % 2); c.position.set(-A.s * 0.98 * 0.5, Math.sin(a) * rr, Math.cos(a) * rr * 0.6); c.rotation.y = -A.s * Math.PI / 2; crypts.push(c); } });
  // ---------- язык и дно рта ----------
  const tongM = mat('tongue', '#E89AA0', { r: 0.78, cc: 0.15, k: 0.86 });
  const TG = new THREE.Group(); LSOFT.add(TG);
  const tGeo = new THREE.SphereGeometry(1, 64, 40); { const p = tGeo.attributes.position; for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i); let Z = (z > 0 ? z * 2.15 : z * 2.95) - 0.35; const tap = 1 - 0.34 * Math.pow(cl(Z / 1.8), 1.6);
    const X = x * 1.82 * tap; let Y = (y > 0 ? y * 0.72 : y * 1.05) - 0.3;
    if (Z < -1.1) Y -= (-1.1 - Z) * (y > 0 ? 0.42 : 0.15);
    if (y > 0) Y -= 0.07 * Math.exp(-((X / 0.18) ** 2)) * cl((Z + 0.6) / 1.2) * y;
    p.setXYZ(i, X, Y, Z); } tGeo.computeVertexNormals(); }
  const tongue = add(tGeo, tongM, 'tongue', TG);
  // точки на спинке языка — лучом сверху
  const ray = new THREE.Raycaster(); tongue.updateMatrixWorld(true);
  const onTop = (x, z, lift = 0.01) => { ray.set(V3(x, 6, z), V3(0, -1, 0)); const hh = ray.intersectObject(tongue, false)[0]; return hh ? hh.point.clone().add(V3(0, lift, 0)) : null; };
  const TT = (x, z) => (onTop(x, z, 0.04) || V3(x, 0, z)), tTop = (x, z) => { const v = TT(x, z); return () => LJin.localToWorld(v.clone()); };
  const papM = mat('tongue', '#F0B6B4', { r: 0.6 }), fungM = mat('tongue', '#E0505E', { r: 0.5 }), lingM = mat('tongue', '#C9707C', { r: 0.8 });
  const VAP = (t) => V3((t - 0.5) * 2 * 1.35, 0, -1.75 + 0.8 * Math.abs(2 * t - 1));   // V-образная пограничная борозда: вершина — слепое отверстие
  for (let i = 0; i < 9; i++) { const t = (i + 0.5) / 9, q = VAP(t), p = onTop(q.x, q.z + 0.28); if (p) { const v = add(new THREE.CylinderGeometry(0.11, 0.12, 0.08, 14), papM, 'tongue', TG); v.position.copy(p); } }
  { const sp = []; for (let i = 0; i <= 24; i++) { const q = VAP(i / 24), p = onTop(q.x, q.z, 0.0); if (p) sp.push(p); } tube(sp, 0.025, lingM, 'tongue', TG); }
  { const p = onTop(0, -1.75, 0.0); const fc = add(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: 0x5a2030 }), null, TG); fc.position.copy(p).add(V3(0, 0.012, 0)); fc.rotation.x = -Math.PI / 2 - 0.4; }
  for (let i = 0; i < 45; i++) { const z = -0.9 + 2.5 * Math.pow(rnd(), 0.7), hw = 1.6 * (1 - 0.34 * Math.pow(cl(z / 1.8), 1.6)), x = (rnd() * 2 - 1) * hw * 0.85, p = onTop(x, z); if (p) { const f = add(new THREE.SphereGeometry(0.028, 8, 6), fungM, 'tongue', TG); f.position.copy(p); } }
  for (let i = 0; i < 16; i++) { const z = -2.0 - rnd() * 1.0, x = (rnd() * 2 - 1) * 1.1, p = onTop(x, z, -0.03); if (p) { const f = add(new THREE.SphereGeometry(0.12 + rnd() * 0.05, 10, 8), lingM, 'tongue', TG); f.position.copy(p); f.scale.y = 0.55; } }   // язычная миндалина
  [1, -1].forEach((s) => { for (let i = 0; i < 4; i++) { const f = add(new THREE.BoxGeometry(0.03, 0.22, 0.05), papM, 'tongue', TG); f.position.set(s * 1.62, -0.42, -1.55 + i * 0.13); } });   // листовидные сосочки
  // дно рта, подъязычные сосочки и складки
  const floorM = mat('gum', '#C97A86', { side: THREE.DoubleSide, r: 0.6, k: 0.8 });
  PALF.push(add(surf((a, b) => { const u = 0.02 + 0.96 * a, fr = frame('l', u), e = fr.P.clone().addScaledVector(fr.N, -0.55); return V3(e.x * (1 - b), -1.3 - 0.2 * b, e.z); }, 80, 8), floorM, null, LA));
  const glM = mat('glands', '#E8C46A', { op: 0.55, r: 0.7, cc: 0.1 }), ductM = mat('glands', '#F5DA8A', { r: 0.4 });
  const PAP = [], GLU = new THREE.Group(), GLL = new THREE.Group(); SOFT.add(GLU); LSOFT.add(GLL);
  [1, -1].forEach((s) => {
    blob(0.075, floorM, 'glands', LSOFT).position.set(s * 0.22, -1.44, 1.55);   // подъязычный сосочек
    tube([V3(s * 0.3, -1.46, 1.35), V3(s * 0.7, -1.47, 0.85), V3(s * 1.15, -1.46, 0.15)], 0.045, floorM, 'glands', LSOFT);   // подъязычная складка
    blob(1, glM, 'glands', GLL, [0.82, 0.62, 1.2]).position.set(s * 2.55, -2.5, -1.45);   // поднижнечелюстная
    tube([V3(s * 1.95, -2.15, -0.9), V3(s * 1.35, -1.85, -0.2), V3(s * 0.65, -1.62, 0.8), V3(s * 0.22, -1.47, 1.5)], 0.045, ductM, 'glands', GLL);
    const sb = blob(1, glM, 'glands', GLL, [0.3, 0.26, 0.85]); sb.position.set(s * 1.0, -1.78, 0.55); sb.rotation.y = s * 0.35;   // подъязычная
    blob(1, glM, 'glands', GLU, [0.6, 1.25, 1.0]).position.set(s * 3.9, 1.4, -3.6);   // околоушная
    const m2 = TEETH.find((t) => t.jaw === 'u' && t.s === s && t.i === 6 && !t.dec), pp = m2.P.clone().addScaledVector(m2.N, 0.72).add(V3(0, 0.55, 0));
    const pd = blob(0.08, ductM, 'glands', GLU); pd.position.copy(pp); PAP.push(pp);
    tube([V3(s * 3.55, 1.35, -2.45), V3(s * 3.55, 1.0, -1.8), V3(s * 3.15, 0.7, -1.55), pp], 0.05, ductM, 'glands', GLU);
  });
  // ---------- разрез моляра (режим «Строение зуба») ----------
  const TS = new THREE.Group(); scene.add(TS); TS.visible = false; const MM = 0.36; TS.scale.setScalar(MM); TS.position.set(0, 3.3 * MM, 0);
  const smooth = (pts, n = 220) => new THREE.CatmullRomCurve3(pts.map(([x, y]) => V3(x, y, 0)), true, 'centripetal').getSpacedPoints(n).slice(0, -1);
  const OUT = smooth([[0, 5.8], [1.4, 6.6], [3.0, 7.45], [4.4, 6.7], [5.3, 4.6], [5.45, 2.5], [4.95, 0.8], [4.6, 0], [4.5, -4], [4.1, -9], [3.6, -13.0], [2.9, -13.7], [2.2, -13.0], [1.8, -9], [1.5, -5.5], [0, -3.3], [-1.5, -5.5], [-1.8, -9], [-2.2, -13.3], [-3.0, -14.0], [-3.7, -13.2], [-4.2, -9], [-4.5, -4], [-4.6, 0], [-4.95, 0.8], [-5.45, 2.5], [-5.3, 4.6], [-4.4, 6.7], [-3.0, 7.55], [-1.4, 6.6]], 300);
  const area = OUT.reduce((a, p, i) => { const q = OUT[(i + 1) % OUT.length]; return a + p.x * q.y - q.x * p.y; }, 0), sgn = area > 0 ? 1 : -1;
  const offset = (pts, f) => pts.map((p, i) => { const a = pts[(i - 1 + pts.length) % pts.length], b = pts[(i + 1) % pts.length], t = b.clone().sub(a).normalize(), n = V3(t.y, -t.x, 0).multiplyScalar(sgn); return p.clone().addScaledVector(n, f(p)); });
  const cut = (pts, keep, yc) => { const i0 = pts.findIndex((p) => !keep(p)); const r = [...pts.slice(i0), ...pts.slice(0, i0)].filter(keep); return [V3(r[0].x, yc, 0), ...r, V3(r[r.length - 1].x, yc, 0)]; };
  const SD = 3.0, EPS = 0.06; let layN = 0;
  const slab = (pts, m, id) => { const sh = new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, p.y))); const i = layN++; const g = new THREE.ExtrudeGeometry(sh, { depth: SD + 2 * i * EPS, bevelEnabled: false, curveSegments: 4 }); const ms = add(g, m, id, TS); ms.position.z = -SD / 2 - i * EPS; return ms; };
  const LM = (id, o) => mat(id, MO_LAY.find((l) => l.id === id).col, Object.assign({ r: 0.55, cc: 0.2, k: 0.9 }, o));
  slab(smooth([[-8.4, -19.4], [0, -19.8], [8.4, -19.4], [9.1, -11], [9, -2.8], [6.2, -2.0], [5.0, -1.7], [-5.0, -1.7], [-6.2, -2.0], [-9, -2.8], [-9.1, -11]], 160), LM('bone', { r: 0.9 }), 'L:bone');
  { const bm = new THREE.MeshBasicMaterial({ color: 0xb8a684 }); for (let i = 0; i < 70; i++) { const x = (rnd() * 2 - 1) * 8.5, y = -3 - rnd() * 16; if (Math.abs(y + 16.9) < 1.1) continue; const c = new THREE.Mesh(new THREE.CircleGeometry(0.15 + rnd() * 0.3, 10), bm); c.scale.y = 0.6 + rnd() * 0.6; c.position.set(x, y, SD / 2 + 0.02); TS.add(c); } }   // губчатая кость
  slab(smooth([[-9, -16.3], [9, -16.3], [9, -17.5], [-9, -17.5]].map(([x, y]) => [x, y]), 80).map((p) => V3(cl(p.x, -8.9, 8.9), p.y, 0)), mat(null, '#A8876A', { r: 0.8 }), 'L:bone');   // нижнечелюстной канал
  const pdlM = LM('pdl'); slab(cut(offset(OUT, () => 0.42), (p) => p.y < -1.5, -1.5), pdlM, 'L:pdl');
  const gum3M = LM('gum3'); [1, -1].forEach((s) => slab(smooth([[-8.8, -3.3], [-9, -0.3], [-7.2, 0.7], [-6.2, 1.5], [-5.7, 1.95], [-5.42, 1.6], [-5.1, 0.6], [-4.78, -0.2], [-4.62, -3.4]].map(([x, y]) => [s * x, y]), 120), gum3M, 'L:gum3'));
  slab(cut(OUT, (p) => p.y < 0.15, 0.15), LM('cement'), 'L:cement');
  slab(cut(OUT, (p) => p.y > -0.05, -0.05), LM('enamel', { r: 0.3, cc: 0.7 }), 'L:enamel');
  slab(offset(OUT, (p) => (p.y > 0 ? -(0.25 + 1.75 * cl(p.y / 6.5)) : -0.32)), LM('dentin'), 'L:dentin');
  const pulpM = LM('pulp', { r: 0.6 });
  slab(smooth([[-2.3, 3.75], [-1.2, 2.9], [0, 2.7], [1.2, 2.9], [2.3, 3.85], [2.6, 1.4], [2.4, -1.8], [3.12, -6], [3.15, -13.1], [2.8, -13.45], [2.72, -6], [1.6, -2.1], [0, -1.6], [-1.6, -2.1], [-2.72, -6], [-2.8, -13.6], [-3.2, -13.35], [-3.18, -6], [-2.4, -1.8], [-2.6, 1.4]], 200), pulpM, 'L:pulp');
  const front = SD / 2 + layN * EPS + 0.02;
  // сосуды и нерв пульпы → нижнечелюстной канал
  const VES = new THREE.Group(); TS.add(VES);
  [['#E0404A', -0.18], ['#5A7AE0', 0.0], ['#F2D45A', 0.18]].forEach(([c, dx]) => {
    const m = new THREE.MeshBasicMaterial({ color: c });
    [[-2.98, -1], [2.93, 1]].forEach(([ax, s]) => { const pts = [V3(s * 0.5 + dx, 2.4, front), V3(ax * 0.88 + dx, -2.5, front), V3(ax + dx, -8, front), V3(ax + dx * 0.6 + s * 0.05, -13.4, front), V3(ax + s * 0.25 + dx, -15.2, front), V3(ax + s * 0.9 + dx, -16.6 - dx * 2, front)]; VES.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.08, 6), m)); });
    VES.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(V3(-9, -16.9 - dx * 2, front), V3(9, -16.9 - dx * 2, front)), 8, 0.1, 6), m));
  });
  // кариес: белое пятно, полость, абсцесс
  const spotM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const spot = new THREE.Mesh(new THREE.CircleGeometry(1, 24), spotM); spot.position.set(-1.35, 6.25, front + 0.01); spot.scale.set(1.1, 0.6, 1); TS.add(spot);
  const cavM = new THREE.MeshStandardMaterial({ color: 0x3a2416, roughness: 0.9 }), cav = new THREE.Mesh(new THREE.BufferGeometry(), cavM); TS.add(cav);
  const absM = new THREE.MeshStandardMaterial({ color: 0xd8c060, roughness: 0.8, transparent: true, opacity: 0.9 }), abs = new THREE.Mesh(new THREE.CircleGeometry(1, 28), absM); abs.position.set(-3.0, -14.6, front + 0.015); TS.add(abs);
  const S0 = V3(-1.35, 6.55, 0), B0 = V3(-2.15, 3.55, 0);
  const cavDepth = (c) => (c < 0.2 ? 0 : c < 0.4 ? 0.42 * (c - 0.2) / 0.2 : c < 0.7 ? 0.42 + 0.46 * (c - 0.4) / 0.3 : Math.min(1.02, 0.88 + 0.14 * (c - 0.7) / 0.12));
  let cavKey = -1;
  function cavity(c) {
    const dd = cavDepth(c); if (Math.abs(dd - cavKey) < 0.004) return; cavKey = dd; cav.visible = dd > 0.01; if (!cav.visible) return;
    const B = S0.clone().lerp(B0, dd), wide = 0.35 + 1.25 * cl((dd - 0.4) / 0.5), mid = S0.clone().lerp(B, 0.72), op = 0.32 + 0.12 * dd;
    const pts = smooth([[S0.x - op, 6.82], [S0.x + op, 6.42], [S0.x + op * 0.8, 5.6 + 0.6 * (1 - dd)], [mid.x + wide, mid.y], [B.x + wide * 0.35, B.y - 0.05], [B.x - wide * 0.4, B.y], [mid.x - wide, mid.y + 0.1], [S0.x - op * 0.8, 5.6 + 0.6 * (1 - dd)]], 80);
    cav.geometry.dispose(); cav.geometry = new THREE.ShapeGeometry(new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x, p.y)))); cav.position.z = front + 0.012;
  }
  const stageOf = (c) => { let k = 0; MO_CAR.forEach((s, i) => { if (c >= s.c) k = i; }); return k; }, carStage = () => stageOf(st.car);

  // ---------- обновление ----------
  const ageWord = (a) => (a < 2 ? 'mo' : a % 10 >= 2 && a % 10 <= 4 && (a < 10 || a > 20) ? 'years' : a % 10 === 1 && a !== 11 ? 'years' : 'years');
  const ageFmt = (v) => { const a = 25 * v * v; return a < 2 ? Math.round(a * 12) + ' ' + ageWord(a) : Math.floor(a) + ' ' + ageWord(Math.floor(a)); };
  const grow = (a) => 0.82 + 0.18 * cl((a - 0.5) / 13.5) ** 0.8;
  const W = V3(0, 0, 0), q = new THREE.Quaternion(), qa = new THREE.Quaternion(), POSE = { u: V3(0, 0, 0), l: V3(0, 0, 0) };
  function rebuildArches() {
    LJ.updateMatrixWorld(true); UJ.updateMatrixWorld(true);
    ARCHES.forEach((A) => {
      const s = A.s, a0 = UJ.localToWorld(softP(s * 0.98, 0.42)), a1 = LJin.localToWorld(V3(s * 1.55, -0.55, -1.75)), c0 = a0.clone().lerp(a1, 0.5).add(V3(-s * 0.1, 0, 0.25));
      const b0 = UJ.localToWorld(softP(s * 0.8, 0.95)), b1 = V3(s * 1.65, -2.9, -4.35), c1 = b0.clone().lerp(b1, 0.5).add(V3(-s * 0.15, 0, 0));
      [[A.pg, A.pgc, [a0, c0, a1], 0.17], [A.pp, A.ppc, [b0, c1, b1], 0.15]].forEach(([m, cm, pts, r]) => { const cv = new THREE.QuadraticBezierCurve3(...pts); m.geometry.dispose(); m.geometry = new THREE.TubeGeometry(cv, 20, r, 8); cm.geometry.dispose(); cm.geometry = surf((a, b) => cv.getPoint(a).add(V3(s * 0.55 * b * Math.sin(Math.PI * Math.min(1, a * 1.15)), 0, -0.25 * b)), 20, 4); });
      A.tons.position.copy(c0).lerp(c1, 0.5).add(V3(s * 0.12, 0, -0.1));
    });
  }
  let openK = -1;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const k = Math.min(1, dt * 3), T2 = st.mode === 'teeth';
    st.age += ((T2 ? 25 * st.ageV * st.ageV : 25) - st.age) * Math.min(1, dt * 5); if (Math.abs(st.age - (T2 ? 25 * st.ageV * st.ageV : 25)) < 0.01) st.age = T2 ? 25 * st.ageV * st.ageV : 25;
    // позы челюстей
    const sep = DK ? 3.45 : 0, sepz = DK ? 0 : 2.95;
    POSE.u.set(T2 ? -sep : 0, 0, T2 ? -sepz : 0); POSE.l.copy(HINGE).add(V3(T2 ? sep : 0, 0, T2 ? sepz + 0.15 : 0));
    UJ.position.lerp(POSE.u, k); LJ.position.lerp(POSE.l, k);
    UJ.rotation.z += ((T2 ? Math.PI : 0) - UJ.rotation.z) * k; st.open += ((T2 ? 0 : 0.52) - st.open) * k; LJ.rotation.x = st.open;
    const g = T2 ? grow(st.age) : 1; UA.scale.setScalar(UA.scale.x + (g - UA.scale.x) * k); LA.scale.copy(UA.scale);
    SOFT.visible = LSOFT.visible = !T2 && st.mode === 'mouth'; UJ.visible = LJ.visible = st.mode !== 'tooth'; TS.visible = st.mode === 'tooth';
    ARCHES.forEach((A) => { A.pg.visible = A.pp.visible = A.pgc.visible = A.ppc.visible = A.tons.visible = SOFT.visible; }); GLU.visible = GLL.visible = st.sel === 'glands'; PALF.forEach((m) => { m.visible = !T2; });
    const kk = !T2 ? 7 : st.age < 2.6 ? 4 : st.age < 11.2 ? 5 : st.age < 16.5 ? 6 : 7; gumTo('u', kk); gumTo('l', kk);
    const ok2 = st.open + UJ.position.length(); if (SOFT.visible && Math.abs(ok2 - openK) > 1e-4) { rebuildArches(); openK = ok2; }
    // зубы: прорезывание и смена
    TEETH.forEach((t) => {
      let e;
      if (!T2) e = t.dec ? 0 : 1;
      else if (t.dec) e = cl((st.age - t.erupt) / 0.15) * (1 - cl((st.age - t.shed) / 0.25));
      else e = cl((st.age - t.erupt) / 0.4);
      t.e = e; t.ms.visible = e > 0.01; placeTooth(t);
      const tc = MO_TYPES.find((x) => x.id === (t.dec && t.i >= 3 ? 'mol' : t.ty));
      const col = T2 ? (t.dec ? new THREE.Color(tc.col).lerp(new THREE.Color(0xffffff), 0.6) : new THREE.Color(tc.col)) : new THREE.Color(0xf3eedf);
      t.ms.material.color.lerp(col, k); t.ms.material.emissive.copy(t.ms.material.color).multiplyScalar(0.25);
      const dim = (T2 && st.ty && st.ty !== (t.dec && t.i >= 3 ? 'mol' : t.ty)) || (!T2 && st.sel && st.sel !== 'teeth');
      t.ms.material.opacity += ((dim ? 0.18 : 1) - t.ms.material.opacity) * k; t.ms.material.depthWrite = t.ms.material.opacity > 0.9;
    });
    // разрез: кариес
    if (TS.visible) {
      st.carS += (st.car - st.carS) * Math.min(1, dt * 4); const c = st.carS; cavity(c);
      spotM.opacity = c < 0.03 ? 0 : 0.75 * cl(c / 0.12) * (1 - cl((c - 0.22) / 0.1)); spot.visible = spotM.opacity > 0.01;
      const pc = new THREE.Color(MO_LAY[2].col); if (c > 0.68) pc.lerp(new THREE.Color(0xff2a3a), cl((c - 0.68) / 0.12)); if (c > 0.84) pc.lerp(new THREE.Color(0x6a4a44), cl((c - 0.84) / 0.12));
      pulpM.color.copy(pc).multiplyScalar(0.9); pulpM.emissive.copy(pc); pulpM.emissiveIntensity = c > 0.68 && c < 0.88 ? 0.2 + 0.15 * Math.sin(st.t * 5) : 0.05;
      const ab = cl((c - 0.86) / 0.12); abs.visible = ab > 0.01; abs.scale.set(1.3 * ab + 0.01, 1.0 * ab + 0.01, 1);
    }
  }
  // ---------- выбор ----------
  function dimAll(on) {
    Object.entries(mats).forEach(([pid, arr]) => arr.forEach((m) => { const o = on(pid); m.transparent = !o || m.userData.op0 < 1; m.opacity = o ? m.userData.op0 : 0.14; m.depthWrite = o && m.userData.op0 >= 1; m.emissiveIntensity = m.userData.em0 + (o && st.sel === pid ? 0.17 : 0); m.needsUpdate = true; }));
  }
  function select(id) {
    st.sel = id === 'all' ? null : id; if (st.mode === 'mouth') st.fly = VIEW[['hard', 'soft', 'tons'].includes(st.sel) ? 'palate' : st.sel === 'tongue' ? 'tongue' : 'mouth'];
    dimAll((pid) => !st.sel || st.sel === pid || (st.sel === 'glands' && pid === 'glands') || !MO_PARTS.find((p) => p.id === pid));
    if (st.sel === 'glands') (mats.glands || []).forEach((m) => { if (m.userData.op0 < 1) { m.opacity = 0.85; m.transparent = true; } });
    refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo();
  }
  function selLay(id) {
    st.lay = id === 'all' ? null : id;
    MO_LAY.forEach((l) => (mats[l.id] || []).forEach((m) => { const o = !st.lay || st.lay === l.id; m.transparent = !o; m.opacity = o ? 1 : 0.25; m.emissiveIntensity = st.lay === l.id ? 0.25 : 0.05; m.needsUpdate = true; }));
    refs.lseg && refs.lseg.sync(); refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; if (m !== 'mouth' && st.sel) select('all'); if (m !== 'teeth') st.ty = null; if (m !== 'tooth' && st.lay) selLay('all');
    st.fly = VIEW[m]; refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  pickOn(() => self, camera, pick, (id) => {
    if (id.startsWith('L:')) { const l = id.slice(2); selLay(st.lay === l ? 'all' : l); return; }
    if (st.mode === 'teeth') return;
    if (st.mode !== 'mouth') setMode('mouth'); select(st.sel === id ? 'all' : id);
  });
  // ---------- подписи ----------
  const P = (id) => MO_PARTS.find((p) => p.id === id);
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const uw = (v) => () => UA.localToWorld(v.clone()), lw = (v) => () => LA.localToWorld(v.clone()), tw = (x, y) => () => TS.localToWorld(V3(x, y, front));
  const M1 = () => st.mode === 'mouth', sel = (id) => M1() && st.sel === id, none = () => M1() && !st.sel;
  const slotW = (jaw, s, i, out = 0.9, dy = 0) => () => { const t = TEETH.find((x) => x.jaw === jaw && x.s === s && x.i === i && !x.dec); return (jaw === 'u' ? UA : LA).localToWorld(t.P.clone().addScaledVector(t.N, out).add(V3(0, dy, 0))); };
  const anyT = (i, dec) => TEETH.some((t) => t.jaw === 'l' && t.i === i && t.dec === dec && t.e > 0.5);
  const T2 = () => st.mode === 'teeth', Ttype = (ty) => T2() && (!st.ty || st.ty === ty);
  const lay = (id) => st.mode === 'tooth' && (!st.lay || st.lay === id);
  const labels = [
    lb('hard palate', uw(V3(0.45, 2.15, -0.7)), P('hard').col, () => none() || sel('hard')),
    lb('transverse ridges', uw(V3(-0.6, 1.62, 1.25)), P('hard').col, () => sel('hard'), true),
    lb('incisive papilla', uw(V3(0, 1.45, 1.95)), P('hard').col, () => sel('hard')),
    lb('palatine raphe', uw(V3(0, 2.0, -0.9)), P('hard').col, () => sel('hard')),
    lb('soft palate', uw(V3(1.0, 1.75, -3.05)), P('soft').col, () => (none() && DK) || sel('soft')),
    lb('uvula', uw(V3(0, 0.35, -3.6)), P('soft').col, () => none() || sel('soft')),
    lb('palatine tonsil', () => ARCHES[1].tons.position.clone().add(V3(-0.35, -0.25, 0.25)), P('tons').col, () => (none() && DK) || sel('tons'), true),
    lb('palatoglossal arch', () => ARCHES[0].pg.geometry.parameters ? ARCHES[0].pg.geometry.parameters.path.getPoint(0.55) : V3(), P('tons').col, () => sel('tons')),
    lb('palatopharyngeal arch', () => ARCHES[1].pp.geometry.parameters ? ARCHES[1].pp.geometry.parameters.path.getPoint(0.3) : V3(), P('tons').col, () => sel('tons'), true),
    lb('tongue', tTop(0.45, 0.3), P('tongue').col, () => none()),
    lb('body of tongue', tTop(0.9, 0.5), P('tongue').col, () => sel('tongue')),
    lb('root of tongue', tTop(-0.9, -2.6), P('tongue').col, () => sel('tongue'), true),
    lb('vallate papillae', tTop(0.75, -1.0), '#FFD8D6', () => sel('tongue')),
    lb('terminal sulcus', tTop(-0.55, -1.42), '#FFD8D6', () => sel('tongue'), true),
    lb('fungiform papillae', tTop(-0.8, 0.8), '#FF8A94', () => sel('tongue'), true),
    lb('lingual tonsil', tTop(0.5, -2.4), '#E8A0AA', () => sel('tongue') && DK),
    lb('gum', lw(V3(1.0, -0.95, 2.05)), P('gum').col, () => sel('gum') || (none() && DK)),
    lb('gum', uw(V3(-1.0, 1.0, 2.25)), P('gum').col, () => sel('gum'), true),
    lb('incisors', slotW('u', 1, 0, 0.6, 0.2), MO_TYPES[0].col, () => sel('teeth')),
    lb('canine', slotW('u', 1, 2, 0.7, 0.2), MO_TYPES[1].col, () => sel('teeth')),
    lb('premolars', slotW('u', 1, 3, 0.7, 0.2), MO_TYPES[2].col, () => sel('teeth')),
    lb('molars', slotW('u', 1, 5, 0.7, 0.2), MO_TYPES[3].col, () => sel('teeth')),
    lb('teeth', slotW('u', -1, 2, 0.7, 0.3), P('teeth').col, () => none() && DK, true),
    lb('parotid gland', uw(V3(3.9, 2.75, -3.6)), P('glands').col, () => sel('glands')),
    lb('parotid duct', uw(V3(3.5, 1.0, -1.85)), '#F5DA8A', () => sel('glands')),
    lb('submandibular gland', lw(V3(2.6, -3.1, -1.4)), P('glands').col, () => sel('glands')),
    lb('sublingual gland', lw(V3(-1.0, -1.95, 0.55)), P('glands').col, () => sel('glands'), true),
    lb('sublingual caruncle', lw(V3(0.22, -1.38, 1.62)), '#F5DA8A', () => sel('glands')),
    // зубы и возраст
    lb('upper teeth', () => UA.localToWorld(V3(0, 0, DK ? -2.75 : -2.5)), '#C8D2E0', () => T2()),
    lb('lower teeth', () => LA.localToWorld(V3(0, 0, DK ? -2.7 : -2.45)), '#C8D2E0', () => T2()),
    lb('incisors', slotW('l', 1, 0, 0.35), MO_TYPES[0].col, () => Ttype('inc') && (anyT(0, false) || anyT(0, true))),
    lb('canine', slotW('l', -1, 2, -0.6), MO_TYPES[1].col, () => Ttype('can') && (anyT(2, false) || anyT(2, true))),
    lb('premolars', slotW('l', -1, 3, -0.7), MO_TYPES[2].col, () => Ttype('pm') && anyT(3, false)),
    lb('baby teeth', slotW('l', -1, 4, -0.7), '#C8E4FF', () => Ttype('mol') && anyT(3, true)),
    lb('molars', slotW('l', -1, 5, -0.75), MO_TYPES[3].col, () => Ttype('mol') && anyT(5, false)),
    lb('wisdom tooth', slotW('l', -1, 7, -0.75), MO_TYPES[3].col, () => Ttype('mol') && anyT(7, false)),
    // разрез зуба
    lb('enamel', tw(-5.0, 4.6), MO_LAY[0].col, () => lay('enamel'), true),
    lb('dentin', tw(3.6, 3.6), MO_LAY[1].col, () => lay('dentin')),
    lb('pulp', tw(1.7, 0.2), '#FF9AA4', () => lay('pulp')),
    lb('root canal', tw(2.95, -9), '#FF9AA4', () => st.mode === 'tooth' && st.lay === 'pulp'),
    lb('nerve and vessels', tw(-2.9, -9.5), '#FFE27A', () => st.mode === 'tooth' && (st.lay === 'pulp' || (!st.lay && DK)), true),
    lb('cementum', tw(-4.5, -5.5), MO_LAY[3].col, () => lay('cement'), true),
    lb('periodontal ligament', tw(4.5, -8), MO_LAY[4].col, () => lay('pdl')),
    lb('gum', tw(-7.2, 0.4), MO_LAY[5].col, () => lay('gum3'), true),
    lb('bone', tw(6.8, -6), MO_LAY[6].col, () => lay('bone')),
    lb('mandibular canal', tw(5.5, -16.9), '#E8D0B0', () => st.mode === 'tooth' && (st.lay === 'bone' || (!st.lay && DK))),
    lb('apical foramen', tw(3.0, -13.9), '#FF9AA4', () => st.mode === 'tooth' && st.lay === 'pulp'),
    lb('white spot', tw(-2.2, 6.4), '#FFFFFF', () => st.mode === 'tooth' && st.carS > 0.06 && st.carS < 0.24, true),
    lb('cavity', tw(-1.6, 6.9), '#F2B880', () => st.mode === 'tooth' && st.carS >= 0.24, true),
    lb('abscess', tw(-3.0, -15.4), '#F2DC80', () => st.mode === 'tooth' && st.carS > 0.9, true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  // ---------- панель ----------
  const INTRO = '<b>The oral cavity</b> is the start of the digestive tract: here food is bitten off, chewed, moistened with saliva and gathered into a bolus for swallowing, while the tongue, lips and palate shape the sounds of speech. Above is the palate, below the tongue and the floor of the mouth, in front the teeth and lips, and at the back the fauces lead into the pharynx. Click a part or pick it below.';
  const ageText = () => MO_AGE.find(([a]) => 25 * st.ageV * st.ageV < a)[1];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => {
      ib.info.innerHTML = st.mode === 'teeth' ? (st.ty ? MO_TYPES.find((t) => t.id === st.ty).text : ageText())
        : st.mode === 'tooth' ? (st.lay ? MO_LAY.find((l) => l.id === st.lay).text : MO_CAR[carStage()].text)
          : st.sel ? P(st.sel).text : INTRO;
    };
    refs.modeSeg = seg([{ id: 'mouth', label: 'Oral cavity' }, { id: 'teeth', label: 'Teeth and age' }, { id: 'tooth', label: 'Tooth structure' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.seg = refs.lseg = null;
      if (st.mode === 'mouth') { refs.seg = seg([{ id: 'all', label: 'All' }, ...MO_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => select(v)); box.append(h('div', { class: 'glabel' }, 'Parts', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg)); }
      else if (st.mode === 'teeth') {
        let last = -1;
        box.append(h('div', { class: 'glabel' }, 'Age'), h('div', { class: 'gctl' }, range('moAge', 0, 1, 0.005, () => st.ageV, (v) => { st.ageV = v; const b = MO_AGE.findIndex(([a]) => 25 * v * v < a); if (b !== last) { last = b; refs.setInfo(); } }, ageFmt)));
        box.append(h('div', { class: 'glabel' }, 'Teeth'), h('div', { class: 'gctl' }, seg([{ id: 'all', label: 'All' }, ...MO_TYPES.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.ty || 'all', (v) => { st.ty = v === 'all' ? null : v; refs.setInfo(); })));
      } else {
        let last = -1;
        box.append(h('div', { class: 'glabel' }, 'Decay'), h('div', { class: 'gctl' }, range('moCar', 0, 1, 0.01, () => st.car, (v) => { st.car = v; if (st.lay) selLay('all'); const s = carStage(); if (s !== last) { last = s; refs.setInfo(); } }, (v) => MO_CAR[stageOf(v)].name)));
        refs.lseg = seg([{ id: 'all', label: 'All' }, ...MO_LAY.map((l) => ({ id: l.id, label: l.name, color: l.col }))], () => st.lay || 'all', (v) => selLay(v));
        box.append(h('div', { class: 'glabel' }, 'Layers', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.lseg));
      }
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, refs.lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mouth', 'teeth', 'tooth'][n - 1]); return true; }
    if (e.key === 'Escape') { select('all'); selLay('all'); st.ty = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'teeth') {
      const a = 25 * st.ageV * st.ageV, dec = TEETH.filter((t) => t.dec && t.e > 0.5).length, per = TEETH.filter((t) => !t.dec && t.e > 0.5).length;
      return [['Age', a < 2 ? Math.round(a * 12) : Math.floor(a), ageWord(a < 2 ? a : Math.floor(a))], ['Baby', dec, 'of 20'], ['Permanent', per, 'of 32']];
    }
    if (st.mode === 'tooth') { const s = MO_CAR[carStage()], dd = cavDepth(st.carS); return [['Depth', dd > 0.01 ? (dd * 3.3).toFixed(1).replace('.', LANG === 'ru' ? ',' : '.') : '0', 'mm'], ['Pain', s.pv, s.pain]]; }
    return [['Teeth', 32, 'in an adult'], ['Saliva', '0.5–1.5', 'L per day']];
  }
  const self = {
    labelBg: true, mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'mouth' && st.sel ? P(st.sel).col : st.mode === 'tooth' ? '#E8CC92' : '#F3EEDF'; },
    kicker: 'Body · organ systems', title: 'Mouth and teeth',
    lede: 'Digestion starts here: 32 teeth cut and grind food, the tongue mixes it with saliva, and the palate and tonsils guard the entrance to the throat. And our teeth are replaced only once in a lifetime — 20 baby teeth give way to 32 permanent ones.',
    notes: `
      <div><h2>Layout</h2>
        <p>The mouth is divided into the vestibule (the slit between the lips and cheeks and the teeth) and the oral cavity proper inside the dental arches. Its roof is the hard and soft palate, its floor is muscle (mainly the mylohyoid) carrying the tongue, and at the back it passes through the fauces into the pharynx. The fauces are bounded by the soft palate, two pairs of arches and the root of the tongue.</p>
        <p>Sensation from the teeth and gums comes through the trigeminal nerve: the upper teeth via branches of the maxillary nerve (V₂), the lower ones via the inferior alveolar nerve from the mandibular nerve (V₃). Front ⅔ of the tongue: general sensation via the lingual nerve (V₃), taste via the chorda tympani of the facial nerve (VII); back ⅓ via the glossopharyngeal nerve (IX). The tongue muscles are moved by the hypoglossal nerve (XII), except the palatoglossus (vagus nerve, X).</p></div>
      <div><h2>Teeth</h2>
        <p>There are 20 baby teeth (in each quarter 2 incisors, a canine, 2 molars) and 32 permanent ones (2 incisors, a canine, 2 premolars, 3 molars). Dentists number them with two digits: the first gives the quarter (1–4 for permanent, 5–8 for baby teeth), the second the position from the midline; for example, 36 is the lower left first molar.</p>
        <p>Lower teeth are numbed with a nerve block: the anesthetic is injected near the mandibular foramen, where the inferior alveolar nerve enters the bone, and half of the lower jaw, lower lip and chin go numb. The bone of the upper jaw is thin and porous, so upper teeth are usually numbed with an injection next to the tooth.</p></div>
      <div><h2>Medicine</h2><ul>
        <li><b>Tooth decay</b> (caries) is the most common disease in humans. Prevention: fewer sugary snacks between meals, brushing twice a day with fluoride toothpaste, fissure sealing in children.</li>
        <li><b>Periodontitis</b> — inflammation of the tissues around the tooth with bone loss; together with decay, the main cause of tooth loss in adults. Smoking and diabetes speed it up.</li>
        <li><b>Mumps</b> — a viral inflammation of the parotid glands; there is a vaccine against it.</li>
        <li><b>Salivary stones</b> most often form in the submandibular gland: its duct runs upwards and its saliva is thicker. The sign is swelling under the jaw during meals.</li>
        <li><b>Tonsillitis</b> (acute) — inflammation of the palatine tonsils; the bacterial (streptococcal) kind is treated with antibiotics to prevent complications in the heart and kidneys.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The shapes are schematic and based on the atlas; the tongue, palate, arches and tonsils are simplified; the lips, cheeks, floor-of-mouth muscles, jaw bones, vessels and nerves are not shown; the mouth is opened wider than usual, and the salivary glands are shown through the tissues.</li><li>In “Teeth and age” the eruption times are averages, the jaws grow in a simplified way (by uniform scaling), and the permanent tooth buds inside the bone are not shown. Baby teeth are tinted with paler shades of the same colors as the permanent ones; the baby molars stand where the premolars will later come in.</li><li>The tooth section is shown in close-up; the periodontal gap and cementum are drawn thicker than in reality. Decay is shown in a single fissure; in reality the stages blend into each other over years.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> clear selection</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('mouth'); st.fly = null; camera.position.copy(VIEW.mouth.pos); controls.target.copy(VIEW.mouth.target);
  return self;
}
export { makeMouth };
