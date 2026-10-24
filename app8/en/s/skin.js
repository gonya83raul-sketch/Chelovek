import { Sparks, THREE, V3, __set_rnd, branchTree, displaceGeo, ell3, envTex, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ОРГАНЫ ЧУВСТВ · КОЖА И ОСЯЗАНИЕ
   ========================================================= */
const SK_REC = [
  { id: 'meis', short: 'Meissner', name: 'Meissner corpuscles', color: '#7FD6FF', fast: true, text: '<b>Meissner corpuscles</b> lie in the dermal papillae just beneath the epidermis and are especially numerous in the fingertips and lips. They adapt rapidly: they respond to the beginning and end of a light touch and to sliding — this is how we feel texture.' },
  { id: 'merk', short: 'Merkel', name: 'Merkel discs', color: '#7FE0A0', fast: false, text: '<b>Merkel discs</b> lie at the base of the epidermis. They adapt slowly: as long as pressure lasts, they keep firing. They detect shape, edges and points — they are what let us read Braille.' },
  { id: 'pac', short: 'Pacini', name: 'Pacinian corpuscles', color: '#C77DFF', fast: true, text: '<b>Pacinian corpuscles</b> are large (up to 1–2 mm) layered “onions” deep in the skin. They adapt very rapidly and sense vibration at 50–500 Hz: for example, the trembling of a tool in your hand.' },
  { id: 'ruf', short: 'Ruffini', name: 'Ruffini endings', color: '#F2C14E', fast: false, text: '<b>Ruffini endings</b> are spindle-shaped structures in the dermis; they adapt slowly and sense stretching of the skin — important for sensing the position of the fingers and joints.' },
  { id: 'free', short: 'Pain', name: 'Free nerve endings', color: '#FF6A5A', fast: false, text: '<b>Free nerve endings</b> reach even into the epidermis. They are nociceptors (pain), thermoreceptors (warmth and cold) and itch receptors. Pain is carried by two types of fibers: fast ones (sharp, well-localized pain) and slow ones (dull, aching pain).' },
];
const SK_LAYERS = [
  { id: 'epi', name: 'Epidermis', color: '#E8C8B0', text: '<b>The epidermis</b> (0.05–1.5 mm) is a stratified epithelium without blood vessels. In the basal layer cells divide constantly, move upward, fill with keratin and die; the top layer of dead scales (stratum corneum) flakes off and is completely renewed in ~4 weeks. Melanocytes produce the pigment melanin, which protects against ultraviolet light.' },
  { id: 'der', name: 'Dermis', color: '#D89090', text: '<b>The dermis</b> (1–4 mm) is dense connective tissue made of collagen fibers (strength) and elastin (elasticity). It contains blood vessels, nerves and receptors, hair roots, and sebaceous and sweat glands. The dermal papillae form the ridge patterns of fingerprints.' },
  { id: 'hyp', name: 'Hypodermis', color: '#F2D890', text: '<b>The subcutaneous fat</b> is an energy store, thermal insulation and a shock absorber. Its thickness varies greatly with the part of the body and from person to person.' },
];
function makeSkin() {
  __set_rnd(mulberry(1919));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xffb08a);
  const HOME = flyTarget(V3(0.1, -0.85, 0), V3(4.3, 2.05, 8.4));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 1.5; controls.maxDistance = 16;
  const sk = new THREE.Group(); scene.add(sk);
  const W = 3.4, D = 2.2, Y_TOP = 1.2, Y_EPI = 0.95, Y_DER = -0.45, Y_BOT = -1.5;
  const papH = (x, z) => 0.1 * Math.max(0, Math.sin(x * 7.5) * Math.sin(z * 6.5 + 1)) ** 0.7;
  const LAY = Object.fromEntries(SK_LAYERS.map((l) => [l.id, { ...l, mats: [] }])), REC = Object.fromEntries(SK_REC.map((r) => [r.id, { ...r, mats: [], spikes: [] }])), pick = [];
  const slab = (y0, y1, top, mat, id) => { const g = new THREE.BoxGeometry(W, y1 - y0, D, 120, 1, 80); g.translate(0, (y0 + y1) / 2, 0); if (top) displaceGeo(g, (v) => { if (v.y > (y0 + y1) / 2) v.y += top(v.x, v.z); }); const m = new THREE.Mesh(g, mat); m.userData.pick = id; pick.push(m); sk.add(m); LAY[id].mats.push(mat); return m; };
  const lmat = (c, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.42), roughness: 0.55, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, sheen: 0.3, envMapIntensity: 0.3, ...o });
  const epiM = slab(Y_EPI, Y_TOP, (x, z) => 0.012 * Math.sin(x * 40) * Math.sin(z * 34), lmat('#E8C8B0', { opacity: 0.32, color: new THREE.Color('#E8C8B0').multiplyScalar(0.3) }), 'epi');
  displaceGeo(epiM.geometry, (v) => { if (v.y < (Y_EPI + Y_TOP) / 2) v.y += papH(v.x, v.z); });   // гребни эпидермиса между сосочками дермы
  const corn = new THREE.Mesh(new THREE.BoxGeometry(W, 0.04, D, 120, 1, 80), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2e6d8).multiplyScalar(0.45), roughness: 0.8, transparent: true, opacity: 0.25, depthWrite: false })); corn.position.y = Y_TOP + 0.01; sk.add(corn);
  const derM = slab(Y_DER, Y_EPI, papH, lmat('#D89090', { opacity: 0.32 }), 'der');
  // прогиб под зондом: исходные позиции верхних вершин (эпидермис, роговой слой, верх дермы)
  const DENT = [[epiM.geometry, (Y_EPI + Y_TOP) / 2, 1], [corn.geometry, -1, 1], [derM.geometry, (Y_DER + Y_EPI) / 2, 0.6]].map(([g, yMin, k]) => ({ g, k, yMin, base: g.attributes.position.array.slice() }));
  let dentOn = false;
  function dent(px, pz, depth, w2) {
    if (depth < 1e-4 && !dentOn) return; dentOn = depth >= 1e-4;
    DENT.forEach(({ g, k, yMin, base }) => { const a = g.attributes.position.array; for (let i = 0; i < a.length; i += 3) { if (base[i + 1] < yMin) continue; const d2 = (base[i] - px) ** 2 + (base[i + 2] - pz) ** 2; a[i + 1] = base[i + 1] - k * depth * Math.exp(-d2 / w2); } g.attributes.position.needsUpdate = true; g.computeVertexNormals(); });
  }
  const PAC = [V3(0.3, -0.95, 0.2), V3(-0.4, -1.1, -0.45)];
  slab(Y_BOT, Y_DER, null, lmat('#F2D890', { opacity: 0.18 }), 'hyp');
  // жировые дольки
  // дольки не выходят в дерму и не закрывают Пачини
  { const arr = []; for (let i = 0; i < 90 && arr.length < 64; i++) { const r = 0.11 + rnd() * 0.06, p = V3(rand(-W / 2 + 0.15, W / 2 - 0.15), rand(Y_BOT + 0.15, Y_DER - r - 0.02), rand(-D / 2 + 0.15, D / 2 - 0.15)); if (PAC.some((q) => q.distanceTo(p) < 0.35 + r)) continue; const g = new THREE.SphereGeometry(r, 12, 10); g.translate(p.x, p.y, p.z); arr.push(g); } sk.add(new THREE.Mesh(mergeGeometries(arr), organMat('#F2D890', 0.42, { transparent: true, opacity: 0.6 }))); }
  // коллагеновые волокна
  { const arr = []; for (let i = 0; i < 60; i++) { const p0 = V3(rand(-W / 2 + 0.6, W / 2 - 0.6), rand(Y_DER + 0.1, Y_EPI - 0.15), rand(-D / 2 + 0.6, D / 2 - 0.6)), d = randUnit().setY(rand(-0.2, 0.2)).normalize(); arr.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p0, p0.clone().addScaledVector(d, 0.3).add(randUnit().multiplyScalar(0.05)), p0.clone().addScaledVector(d, 0.6)]), 8, 0.012, 4)); } sk.add(new THREE.Mesh(mergeGeometries(arr), organMat('#f0e0d0', 0.35, { transparent: true, opacity: 0.6 }))); }
  // сосуды с петлями в сосочках
  const VESA = [], VESV = [];
  { const a = [], v = []; const art = new THREE.CatmullRomCurve3([V3(-W / 2, -0.25, 0.4), V3(0, -0.2, 0.35), V3(W / 2, -0.28, 0.4)]), ven = new THREE.CatmullRomCurve3([V3(-W / 2, -0.3, -0.3), V3(0, -0.25, -0.35), V3(W / 2, -0.32, -0.3)]);
    a.push(taperTube(art, () => 0.04, 40, 8)); v.push(taperTube(ven, () => 0.05, 40, 8));
    for (let i = 0; i < 9; i++) { const x = -1.45 + i * 0.36, za = 0.38, zv = -0.32; const top = V3(x, Y_EPI - 0.02 + papH(x, 0.0), 0.02); const ca = new THREE.CatmullRomCurve3([V3(x, -0.22, za), V3(x + rand(-0.08, 0.08), 0.4, za * 0.5 + rand(-0.08, 0.08)), top]), cv = new THREE.CatmullRomCurve3([top, V3(x + 0.04 + rand(-0.08, 0.08), 0.4, zv * 0.5 + rand(-0.08, 0.08)), V3(x, -0.27, zv)]); a.push(new THREE.TubeGeometry(ca, 16, 0.014, 5)); v.push(new THREE.TubeGeometry(cv, 16, 0.014, 5)); VESA.push(ca); VESV.push(cv); }
    var artM = new THREE.MeshPhysicalMaterial({ color: 0xc0404a, emissive: 0x501018, emissiveIntensity: 0.2, roughness: 0.4 }), venM = new THREE.MeshPhysicalMaterial({ color: 0x5068c0, emissive: 0x101840, emissiveIntensity: 0.2, roughness: 0.4 });
    sk.add(new THREE.Mesh(mergeGeometries(a), artM), new THREE.Mesh(mergeGeometries(v), venM)); }
  // волосяной фолликул, сальная железа, мышца
  const FOLL = new THREE.CatmullRomCurve3([V3(-1.0, -0.75, -0.3), V3(-0.85, 0.0, -0.3), V3(-0.7, Y_TOP, -0.3)]);
  sk.add(new THREE.Mesh(taperTube(FOLL, (u) => 0.08 - 0.03 * u, 40, 12), organMat('#E8C0A8', 0.4, { transparent: true, opacity: 0.6 })));
  sk.add(new THREE.Mesh(ell3(0.1, 0.09, 0.1, V3(-1.0, -0.78, -0.3)), organMat('#C89070', 0.45)));
  const hairPiv = new THREE.Group(); hairPiv.position.set(-0.7, Y_TOP, -0.3); sk.add(hairPiv);
  const hairDir = V3(0.15, 1, 0).normalize();
  const hair = new THREE.Mesh(tube([V3(-0.3, -1.95, 0), V3(-0.15, -0.9, 0), V3(0, 0, 0), V3(0.12, 0.6, 0.02), V3(0.3, 0.95, 0.05)], (u) => 0.03 * (1 - 0.6 * u), 50, 8), new THREE.MeshPhysicalMaterial({ color: 0x3a2618, roughness: 0.35, clearcoat: 0.8 })); hairPiv.add(hair);
  { const arr = []; for (let i = 0; i < 6; i++) { const g = new THREE.SphereGeometry(0.07, 12, 10); g.translate(-0.68 + rand(-0.06, 0.06), 0.25 + rand(-0.08, 0.08), -0.18 + rand(-0.04, 0.04)); arr.push(g); } sk.add(new THREE.Mesh(mergeGeometries(arr), organMat('#F2E08A', 0.45))); }
  const ARR = new THREE.CatmullRomCurve3([V3(-0.95, -0.25, -0.3), V3(-0.6, 0.15, -0.3), V3(-0.3, 0.75, -0.3)]);
  const arrM = organMat('#C85050', 0.5); const arrMesh = new THREE.Mesh(taperTube(ARR, () => 0.03, 20, 8), arrM); sk.add(arrMesh);
  // потовая железа: клубок + проток
  const sweatPts = []; for (let i = 0; i < 40; i++) { const a = i * 0.9; sweatPts.push(V3(0.9 + Math.cos(a) * 0.12, -0.35 + Math.sin(i * 0.5) * 0.06 + i * 0.002, 0.5 + Math.sin(a) * 0.12)); }
  for (let i = 0; i <= 20; i++) { const u = i / 20, y = -0.25 + u * (Y_TOP + 0.25), a = u * 18; sweatPts.push(V3(0.9 + (u > 0.8 ? Math.cos(a) * 0.04 : 0.02 * Math.sin(u * 12)), y, 0.5 + (u > 0.8 ? Math.sin(a) * 0.04 : 0))); }
  const SWEAT = new THREE.CatmullRomCurve3(sweatPts); sk.add(new THREE.Mesh(new THREE.TubeGeometry(SWEAT, 300, 0.025, 6), organMat('#9FD8F0', 0.45, { transparent: true, opacity: 0.8 })));
  const PORE = V3(0.9, Y_TOP + 0.02, 0.5);
  /* ---------- рецепторы ---------- */
  const nerveMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf4c542).multiplyScalar(0.5), emissive: 0x403000, emissiveIntensity: 0.15, roughness: 0.4 });
  const NERV = { meis: [], merk: [], pac: [], ruf: [], free: [] };
  const rmat = (id, o = {}) => { const m = organMat(REC[id].color, 0.5, { emissiveIntensity: 0.15, ...o }); REC[id].mats.push(m); return m; };
  const recMesh = (id, g, o) => { const m = new THREE.Mesh(g, rmat(id, o)); m.userData.pick = id; pick.push(m); sk.add(m); return m; };
  const nerveTo = (id, p) => { const c = new THREE.CatmullRomCurve3([V3(p.x - 0.3, Y_DER - 0.2, p.z - 0.2), V3(p.x - 0.15, (p.y + Y_DER) / 2, p.z - 0.1), p]); sk.add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, 0.012, 5), nerveMat)); NERV[id].push(c); return c; };
  [-0.9, 0.0, 0.55, 1.25].forEach((x, i) => { const z = i % 2 ? 0.25 : -0.55; const p = V3(x, Y_EPI - 0.08 + papH(x, z), z); const g = new THREE.CapsuleGeometry(0.035, 0.12, 6, 12); const pos = g.attributes.position; for (let k = 0; k < pos.count; k++) { pos.setX(k, pos.getX(k) * (1 + 0.15 * Math.sin(pos.getY(k) * 60))); } g.computeVertexNormals(); g.translate(p.x, p.y, p.z); recMesh('meis', g); nerveTo('meis', p.clone().add(V3(0, -0.08, 0))); });
  [-0.3, 0.35, 1.0, -1.35].forEach((x, i) => { const z = i % 2 ? -0.2 : 0.55; const p = V3(x, Y_EPI + 0.02, z); const g = new THREE.CylinderGeometry(0.04, 0.04, 0.012, 16); g.translate(p.x, p.y, p.z); recMesh('merk', g); nerveTo('merk', p.clone().add(V3(0, -0.01, 0))); });
  PAC.forEach((p) => { for (let k = 0; k < 5; k++) { const g = ell3(0.08 + k * 0.035, 0.13 + k * 0.05, 0.08 + k * 0.035, p, 20); recMesh('pac', g, { transparent: true, opacity: 0.35 + (4 - k) * 0.04, depthWrite: false }); } nerveTo('pac', p.clone().add(V3(0, -0.15, 0))); });
  [V3(0.15, 0.3, -0.5), V3(1.3, 0.1, -0.2)].forEach((p) => { const g = ell3(0.16, 0.035, 0.035, p, 16); recMesh('ruf', g); const arr = []; for (let k = 0; k < 6; k++) branchTree(arr, p.clone().add(V3(-0.12 + k * 0.05, 0, 0)), randUnit(), 0.06, 0.005, 0, { segs: 4, rad: 3 }); arr.forEach((gg) => sk.add(new THREE.Mesh(gg, nerveMat))); nerveTo('ruf', p); });
  [-0.55, 0.65, 1.5].forEach((x) => { const p = V3(x, Y_EPI - 0.05, 0.05); const arr = []; for (let k = 0; k < 5; k++) branchTree(arr, p, V3(rand(-0.4, 0.4), 1, rand(-0.4, 0.4)), 0.12, 0.008, 1, { segs: 5, rad: 3 }); const m = new THREE.Mesh(mergeGeometries(arr), rmat('free')); m.userData.pick = 'free'; pick.push(m); sk.add(m); nerveTo('free', p); });
  // зонд
  const probe = new THREE.Mesh(tube([V3(0, 0, 0), V3(0, 1.2, 0)], (u) => 0.03 + u * 0.06, 20, 16), new THREE.MeshPhysicalMaterial({ color: 0xd8dce8, roughness: 0.2, metalness: 0.6 })); sk.add(probe); probe.visible = false;
  const needle = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.9, 12).translate(0, 0.45, 0), new THREE.MeshPhysicalMaterial({ color: 0xe8e8f0, roughness: 0.15, metalness: 0.9 })); sk.add(needle); needle.visible = false;
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, sel: null, labels: true, rot: false, fly: null, stim: null, stimT: -99, msg: null, raster: [], temp: 0, sweat: 0 };
  const STIM = {
    touch: { name: 'Light touch', text: '<b>Touch.</b> The probe presses on the skin. Meissner corpuscles give a short burst of impulses at the beginning and end of the touch (rapid adaptation); Merkel discs fire the whole time the pressure lasts (slow adaptation). On the right are the impulses from each type of receptor.' },
    vib: { name: 'Vibration', text: '<b>Vibration.</b> The probe vibrates at ~200 Hz. The layered capsule of the Pacinian corpuscle filters out slow pressure and passes only rapid changes — so these corpuscles respond to every oscillation.' },
    stretch: { name: 'Stretch', text: '<b>Skin stretch.</b> As long as the skin is stretched, Ruffini endings fire continuously — the brain knows how the fingers are bent and what position a joint is in.' },
    pain: { name: 'Prick', text: '<b>Prick.</b> Tissue damage excites free nerve endings — nociceptors. First, sharp pain arrives along fast myelinated fibers, then dull pain along slow ones. The spinal cord triggers the withdrawal reflex even before the pain is consciously felt.' },
    cold: { name: 'Cold', text: '<b>Cold.</b> Thermoreceptors report to the hypothalamus. Skin blood vessels constrict (less heat is lost), and the arrector pili muscles contract — “goose bumps”, which in our furry ancestors fluffed up the fur. Sweating stops.' },
    heat: { name: 'Heat', text: '<b>Heat.</b> Skin blood vessels dilate (the skin reddens and gives off heat), and sweat glands secrete sweat — as it evaporates, it cools the body. In hot weather, several liters of sweat can be lost in a day.' },
  };
  function stim(k) { st.stim = k; st.stimT = st.t; st.msg = STIM[k].text; refs.setInfo(); refs.stSeg && refs.stSeg.sync(); }
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); const all = [...SK_REC.map((r) => REC[r.id]), ...SK_LAYERS.map((l) => LAY[l.id])]; all.forEach((p) => p.mats.forEach((m) => { m.emissiveIntensity = st.sel === p.id ? 0.6 : (REC[p.id] ? 0.15 : 0); })); st.msg = null; refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => select(id));
  const fire = (id, rate, dt) => { const n = rate * dt; if (rnd() < n) { REC[id].spikes.push(st.t); const c = NERV[id][Math.floor(rnd() * NERV[id].length)]; for (let u = 0; u < 1; u += 0.2) fx.spawn(c.getPointAt(1 - u), V3(0, 0, 0), new THREE.Color(REC[id].color), 0.3 + u * 0.4, 0, 1.4); REC[id].flash = 1; } };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    const k = t - st.stimT, on = k > 0 && k < 3, s = st.stim;
    probe.visible = (s === 'touch' || s === 'vib') && k < 4.5; needle.visible = s === 'pain' && k < 3.5;
    const press = on ? smooth(0, 0.3, k) * (1 - smooth(2.7, 3, k)) : 0;
    const vibY = s === 'vib' && on ? 0.02 * Math.sin(t * 60) : 0;
    probe.position.set(0.05, Y_TOP + 0.03 + (1 - press) * 0.6 - 0.12 * press + vibY, 0.1);
    const nk = on ? smooth(0, 0.4, k) : 0; needle.position.set(0.7, Y_TOP + 0.4 - nk * 0.75, 0.1); needle.rotation.z = Math.PI;
    sk.scale.x = s === 'stretch' && on ? 1 + 0.12 * press + 0.12 * smooth(0, 0.4, k) * (1 - smooth(2.6, 3, k)) : 1;
    // кожа прогибается под зондом (укол — узкая ямка вокруг иглы, пока она не прошла роговой слой)
    if ((s === 'touch' || s === 'vib') && probe.visible) dent(0.05, 0.1, 0.12 * press - Math.min(0, vibY), 0.08);
    else if (s === 'pain' && needle.visible) dent(0.7, 0.1, 0.07 * smooth(0, 0.25, k) * (1 - smooth(0.25, 0.45, k)), 0.01);
    else dent(0, 0, 0, 1);
    // ответы рецепторов
    const onset = Math.exp(-(((k - 0.25) / 0.12) ** 2)), offset = Math.exp(-(((k - 2.9) / 0.12) ** 2));
    if (s === 'touch') { fire('meis', 60 * (onset + offset), dt); fire('merk', on ? 25 * press + 5 : 0, dt); }
    if (s === 'vib') { fire('pac', on ? 55 : 0, dt); fire('meis', on ? 10 : 0, dt); }
    if (s === 'stretch') { fire('ruf', on ? 30 : 0, dt); }
    if (s === 'pain') { fire('free', on ? 45 * Math.exp(-k / 2.5) + 10 : 0, dt); }
    SK_REC.forEach((r) => { const R = REC[r.id]; R.flash = Math.max(0, (R.flash || 0) - dt * 4); R.mats.forEach((m) => { m.emissiveIntensity = (st.sel === r.id ? 0.6 : 0.15) + R.flash * 0.6; }); R.spikes = R.spikes.filter((x) => t - x < 6); fire(r.id, 0.6, dt); });
    // температура
    const targetT = s === 'cold' && k < 8 ? -1 : s === 'heat' && k < 8 ? 1 : 0; st.temp += (targetT - st.temp) * Math.min(1, dt * 1.2);
    artM.emissiveIntensity = 0.2 + 0.6 * Math.max(0, st.temp) - 0.15 * Math.max(0, -st.temp); artM.color.setHex(0xc0404a).multiplyScalar(1 - 0.4 * Math.max(0, -st.temp));
    arrMesh.scale.setScalar(1); hairPiv.rotation.z = -0.55 * Math.max(0, -st.temp); arrM.emissiveIntensity = 0.04 + 0.6 * Math.max(0, -st.temp);
    if (st.temp > 0.3) { if (rnd() < st.temp * 0.6) fx.spawn(SWEAT.getPointAt(0.65 + rnd() * 0.35), V3(0, 0.15, 0), new THREE.Color(0x9fd8f0), 0.6, 0, 1.2); if (rnd() < st.temp * 0.4) fx.spawn(PORE.clone(), V3(rand(-0.1, 0.1), 0.35, rand(-0.1, 0.1)), new THREE.Color(0xc8f0ff), 1.2, 0.5, 1.6); }
    if (rnd() < 0.3) { const c = VESA[Math.floor(rnd() * VESA.length)]; fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), new THREE.Color(0xe0605a), 0.4, 0, 0.9 + Math.max(0, st.temp)); }
    if (s === 'pain' && on && k < 0.6) fx.spawn(V3(0.7, Y_TOP - 0.3, 0.1), randUnit().multiplyScalar(0.3), new THREE.Color(0xff3a2a), 0.5, 2, 1.4);
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); scopeShow(true);
    const rows = SK_REC.length, rh = (hgt - 18) / rows, x = (tt) => 8 + (1 - (st.t - tt) / 6) * (w - 16);
    ctx.font = '500 9px JetBrains Mono, monospace';
    SK_REC.forEach((r, i) => { const y = 16 + i * rh; ctx.fillStyle = r.color; ctx.globalAlpha = 0.7; ctx.fillText(r.short, 8, y + rh * 0.6); ctx.globalAlpha = 1; ctx.strokeStyle = r.color; ctx.lineWidth = 1.5; REC[r.id].spikes.forEach((tt) => { const xx = x(tt); if (xx < 70) return; ctx.beginPath(); ctx.moveTo(xx, y + 2); ctx.lineTo(xx, y + rh - 2); ctx.stroke(); }); });
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('receptor impulses', 8, 11);
  }
  const TXT = '<b>The skin</b> is the largest organ: 1.5–2 m² and about 4 kg in an adult. It protects against microbes, ultraviolet light and water loss, regulates temperature, makes vitamin D and serves as a huge sense organ: one cm² of a fingertip holds hundreds of receptors. Click a layer or receptor, and try the experiments.';
  const labels = [
    { text: 'epidermis', pos: V3(-W / 2 - 0.05, (Y_TOP + Y_EPI) / 2, D / 2), color: '#E8C8B0', show: () => st.labels },
    { text: 'dermis', pos: V3(-W / 2 - 0.05, 0.25, D / 2), color: '#D89090', show: () => st.labels },
    { text: 'subcutaneous fat', pos: V3(-W / 2 - 0.05, -1.0, D / 2), color: '#F2D890', show: () => st.labels },
    { text: 'hair', pos: V3(-0.42, Y_TOP + 0.85, -0.3), color: '#c8a080', show: () => st.labels },
    { text: 'sebaceous gland', pos: V3(-0.6, 0.18, -0.05), color: '#F2E08A', show: () => st.labels },
    { text: 'arrector pili muscle', pos: ARR.getPointAt(0.75).add(V3(0.05, 0.05, 0)), color: '#E07070', show: () => st.labels },
    { text: 'sweat gland', pos: V3(1.1, -0.35, 0.6), color: '#9FD8F0', show: () => st.labels },
    { text: 'Meissner', pos: V3(-0.95, Y_EPI - 0.2, -0.55), color: '#7FD6FF', show: () => st.labels },
    { text: 'Merkel', pos: V3(-0.3, Y_EPI + 0.12, 0.62), color: '#7FE0A0', show: () => st.labels },
    { text: 'Pacini', pos: V3(0.5, -0.95, 0.35), color: '#C77DFF', show: () => st.labels },
    { text: 'Ruffini', pos: V3(0.32, 0.32, -0.45), color: '#F2C14E', show: () => st.labels },
    { text: 'free nerve endings', pos: V3(1.55, Y_EPI + 0.05, 0.15), color: '#FF6A5A', show: () => st.labels },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { const all = [...SK_REC, ...SK_LAYERS]; const s = all.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (s ? s.text : TXT); };
    refs.seg = seg([{ id: 'all', label: 'All' }, ...SK_LAYERS.map((l) => ({ id: l.id, label: l.name, color: l.color })), ...SK_REC.map((r) => ({ id: r.id, label: r.name, color: r.color }))], () => st.sel || 'all', (v) => select(v));
    refs.stSeg = seg(Object.entries(STIM).map(([k, s]) => ({ id: k, label: s.name })), () => st.stim, (v) => stim(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Layers and receptors', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg)), group('Experiment', '1–6', refs.stSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 6) { stim(Object.keys(STIM)[n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return [['Skin area', '1.5–2', 'm²'], ['Temperature', st.temp > 0.3 ? 'hot' : st.temp < -0.3 ? 'cold' : 'normal', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FFB08A',
    kicker: 'Senses · touch', title: 'Skin and touch',
    lede: 'A cross-section of skin: three layers, a hair, glands, blood vessels and five kinds of receptors, each responding to its own stimulus — touch, pressure, vibration, stretch or pain.',
    notes: `
      <div><h2>How the skin controls temperature</h2>
        <p>Thermoregulation is controlled by the hypothalamus. In the cold, skin blood vessels constrict, shivering and “goose bumps” appear; in the heat, the vessels dilate and sweating begins (humans have 2–4 million sweat glands).</p>
        <h3>Where the signal goes</h3><p>From the receptors, along sensory nerves to the spinal cord, then via the dorsal columns and the medial lemniscus to the thalamus and the postcentral gyrus (areas 3, 1, 2). Pain and temperature travel along the spinothalamic tract.</p></div>
      <div><h2>Simplifications</h2><ul><li>Layer thickness and receptor sizes are enlarged and evened out for clarity.</li><li>Impulse rates are schematic, not a recording.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>6</code> experiments</li><li>click: layer or receptor</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeSkin };
