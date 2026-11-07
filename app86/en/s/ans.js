import { Sparks, THREE, V3, __set_rnd, bodyShell, ell3, envTex, flyStep, flyTarget, group, infoBox, labLights, makeControls, mulberry, rnd, seg, toggle } from '../core.js';


// @scene ans makeAns | Вегетативная нервная система | @brain Устройство
/* =========================================================
   МОЗГ · ВЕГЕТАТИВНАЯ НЕРВНАЯ СИСТЕМА: симпатический (грудопоясничный, T1–L2) и парасимпатический
   (черепной III, VII, IX, X и крестцовый S2–S4) отделы на силуэте тела; режимы «бей или беги»
   и «отдыхай и переваривай» с реакцией органов; схема двух нейронов и медиаторов (по Неттеру Pl. 6)
   ========================================================= */
function makeAns() {
  __set_rnd(mulberry(1401));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0xffc070);
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = { body: DK ? [V3(-0.8, 2.0, 0), V3(0.5, 2.45, 11.2)] : [V3(0, 1.55, 0), V3(0.5, 2.0, 11.2)], chem: DK ? [V3(40 - 1.0, 0.1, 0), V3(40 - 1.0, 0.6, 10.2)] : [V3(40, -0.1, 0), V3(40, 0.5, 10.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.body[1]);
  const controls = makeControls(camera, VIEW.body[0]); controls.minDistance = 2; controls.maxDistance = 30;
  const fx = new Sparks(1400, 0.045); scene.add(fx.obj);
  const SY = '#FF9A4A', PA = '#5FD49A';   // симпатика — оранжевая, парасимпатика — зелёная
  const shell = bodyShell(scene, { rim: 0.22, arms: false, legs: false, keep: true });
  const mat = (col, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.55), roughness: 0.45, clearcoat: 0.3, emissive: col, emissiveIntensity: o.e ?? 0.12, transparent: !!o.op, opacity: o.op ?? 1, depthWrite: !o.op });
  const tubeTo = (pts, r, col, op) => { const c = new THREE.CatmullRomCurve3(pts); const m = new THREE.Mesh(new THREE.TubeGeometry(c, Math.max(20, pts.length * 14), r, 7), mat(col, { k: 0.8, e: 0.35, op })); scene.add(m); return { c, m }; };
  /* ---------- ЦНС: ствол мозга и спинной мозг ---------- */
  const STEM = V3(0, 3.95, -0.18), CORD = (y) => V3(0, y, -0.42);
  tubeTo([V3(0, 4.35, -0.05), STEM, CORD(3.6), CORD(2.4), CORD(1.2), CORD(0.85)], 0.045, '#E8E0F0');
  const brain = new THREE.Mesh(ell3(0.33, 0.27, 0.36, V3(0, 4.42, 0.0)), mat('#C8B0E0', { k: 0.5, e: 0.1, op: 0.35 })); scene.add(brain);
  /* ---------- органы ---------- */
  const O = {
    eye: V3(0.15, 4.22, 0.4), saliv: V3(0.27, 3.72, 0.2), heart: V3(0.12, 2.1, 0.22), lungL: V3(-0.5, 2.3, 0.0), lungR: V3(0.52, 2.3, 0.0),
    stom: V3(0.32, 1.45, 0.18), liver: V3(-0.36, 1.55, 0.15), gut: V3(0.0, 0.75, 0.2), adr: V3(0.3, 1.18, -0.22), blad: V3(0, -0.35, 0.22),
  };
  const org = {};
  org.eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), mat('#F0F0F4', { k: 0.85, e: 0.1 })); org.eye.position.copy(O.eye); scene.add(org.eye);
  const iris = new THREE.Mesh(new THREE.CircleGeometry(0.05, 32), mat('#4A8AC0', { k: 0.9, e: 0.2 })); iris.position.copy(O.eye).add(V3(0, 0, 0.072)); scene.add(iris);
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x050505 })); pupil.position.copy(O.eye).add(V3(0, 0, 0.074)); scene.add(pupil);
  org.saliv = new THREE.Mesh(ell3(0.08, 0.06, 0.05, O.saliv), mat('#E8C08A')); scene.add(org.saliv);
  org.heart = new THREE.Mesh(ell3(0.2, 0.24, 0.18), mat('#E0505A', { e: 0.18 })); org.heart.position.copy(O.heart); org.heart.rotation.z = -0.35; scene.add(org.heart);
  org.lungs = [O.lungL, O.lungR].map((p) => { const m = new THREE.Mesh(ell3(0.3, 0.52, 0.28), mat('#E89AA8', { k: 0.5, op: 0.45 })); m.position.copy(p); scene.add(m); return m; });
  const bronch = tubeTo([V3(0, 3.0, 0.05), V3(0, 2.62, 0.05), V3(-0.28, 2.42, 0.02)], 0.03, '#E8DCC8'); const bronchR = tubeTo([V3(0, 2.62, 0.05), V3(0.3, 2.42, 0.02)], 0.03, '#E8DCC8'); [bronch, bronchR].forEach((b) => { b.m.geometry.translate(0, -2.62, -0.05); b.m.position.set(0, 2.62, 0.05); });
  org.stom = new THREE.Mesh(ell3(0.22, 0.16, 0.13), mat('#E8A08A')); org.stom.position.copy(O.stom); org.stom.rotation.z = 0.5; scene.add(org.stom);
  org.liver = new THREE.Mesh(ell3(0.34, 0.17, 0.2), mat('#9A3A3A')); org.liver.position.copy(O.liver); scene.add(org.liver);
  const gutC = new THREE.CatmullRomCurve3(Array.from({ length: 14 }, (_, i) => V3(Math.sin(i * 1.3) * 0.32, 1.05 - i * 0.045, 0.2 + Math.cos(i * 1.3) * 0.06)));
  org.gut = new THREE.Mesh(new THREE.TubeGeometry(gutC, 120, 0.07, 10), mat('#E8B890', { k: 0.6 })); scene.add(org.gut);
  org.adr = new THREE.Mesh(ell3(0.07, 0.06, 0.05, O.adr), mat('#F2D27A', { e: 0.25 })); scene.add(org.adr);
  const kid = new THREE.Mesh(ell3(0.09, 0.15, 0.08, V3(0.3, 1.0, -0.25)), mat('#A85050', { op: 0.6 })); scene.add(kid);
  org.blad = new THREE.Mesh(ell3(0.16, 0.13, 0.13), mat('#F2D860', { k: 0.5, op: 0.75 })); org.blad.position.copy(O.blad); scene.add(org.blad);
  /* ---------- симпатический ствол (цепочка узлов) и предпозвоночные узлы ---------- */
  const CH = (y, s = 1) => V3(0.13 * s, y, -0.33);
  const gMat = mat(SY, { k: 0.8, e: 0.4 });
  for (let y = 3.5; y >= -0.2; y -= 0.16) [1, -1].forEach((s) => { const g = new THREE.Mesh(new THREE.SphereGeometry(y > 3.3 ? 0.04 : 0.025, 10, 8), gMat); g.position.copy(CH(y, s)); scene.add(g); });
  [1, -1].forEach((s) => tubeTo([CH(3.55, s), CH(1.6, s), CH(-0.25, s)], 0.008, SY, 0.7));
  const CEL = V3(0, 1.28, -0.12), IMG = V3(0, 0.6, -0.12);
  [CEL, IMG].forEach((p) => { const g = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), gMat); g.position.copy(p); scene.add(g); });
  /* ---------- пути: [отдел, точки, орган] ---------- */
  const PATHS = [
    // симпатика: из спинного мозга T1–L2 в ствол, из шейного узла к глазу и железам, к сердцу и лёгким, через чревный узел к ЖКТ и печени, к надпочечнику напрямую, к пузырю
    ['s', [CORD(2.9), CH(2.9), CH(3.45), V3(0.14, 3.85, -0.05), O.eye.clone().add(V3(0, 0, -0.06))], 'eye'],
    ['s', [CH(3.45), V3(0.22, 3.62, 0.05), O.saliv], 'saliv'],
    ['s', [CORD(2.65), CH(2.65), CH(2.55), V3(0.18, 2.3, 0.0), O.heart], 'heart'],
    ['s', [CH(2.45, -1), V3(-0.3, 2.35, -0.05), O.lungL], 'lungs'],
    ['s', [CORD(1.85), CH(1.85), CH(1.55), CEL], null],
    ['s', [CEL, V3(0.2, 1.35, 0.05), O.stom], 'stom'], ['s', [CEL, V3(-0.2, 1.42, 0.05), O.liver], 'liver'], ['s', [CEL, V3(0, 1.05, 0.1), V3(0.1, 0.85, 0.2)], 'gut'],
    ['s', [CORD(1.5), CH(1.5), V3(0.25, 1.25, -0.25), O.adr], 'adr'],
    ['s', [CORD(1.15), CH(1.15), CH(0.9), IMG, V3(0, -0.1, 0.05), O.blad], 'blad'],
    // парасимпатика: III к глазу (ресничный узел), VII/IX к слюнным, блуждающий X к сердцу, лёгким, желудку, печени, кишке; крестцовые S2–S4 к пузырю
    ['p', [STEM, V3(0.08, 4.1, 0.15), V3(0.13, 4.18, 0.3), O.eye.clone().add(V3(0, 0, -0.06))], 'eye'],
    ['p', [STEM, V3(0.18, 3.8, 0.05), O.saliv], 'saliv'],
    ['p', [STEM, V3(-0.12, 3.6, -0.05), V3(-0.15, 3.0, 0.0), V3(-0.08, 2.4, 0.1), O.heart], 'heart'],
    ['p', [V3(-0.15, 3.0, 0.0), V3(-0.35, 2.5, 0.0), O.lungL], 'lungs'],
    ['p', [V3(-0.08, 2.4, 0.1), V3(-0.05, 1.8, 0.1), V3(0.2, 1.55, 0.18), O.stom], 'stom'],
    ['p', [V3(-0.05, 1.8, 0.1), V3(-0.25, 1.6, 0.15), O.liver], 'liver'],
    ['p', [V3(-0.05, 1.8, 0.1), V3(-0.05, 1.1, 0.18), V3(-0.1, 0.85, 0.2)], 'gut'],
    ['p', [V3(0, -0.15, -0.4), V3(0, -0.3, -0.1), O.blad], 'blad'],
  ].map(([d, pts, o]) => ({ d, o, ...tubeTo(pts, 0.011, d === 's' ? SY : PA, 0.85) }));
  const sacral = tubeTo([CORD(0.85), V3(0, 0.3, -0.45), V3(0, -0.15, -0.4)], 0.02, PA, 0.85);
  /* ---------- схема «два нейрона» (x = 40) ---------- */
  const G2 = new THREE.Group(); G2.position.x = 40; scene.add(G2);
  const ROW = [{ y: 1.25, d: 's', g: -0.4, med1: 'ACh', med2: 'NE', rec: 'nicotinic → α/β adrenergic' }, { y: 0, d: 'p', g: 1.5, med1: 'ACh', med2: 'ACh', rec: 'nicotinic → muscarinic' }, { y: -1.25, d: 'a', g: 0.5, med1: 'ACh', med2: 'epinephrine', rec: 'adrenal medulla' }];
  const cns2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.4, 0.4), mat('#C8B0E0', { k: 0.45, op: 0.5 })); cns2.position.set(-2.6, 0, 0); G2.add(cns2);
  const chem = ROW.map((r) => { const col = r.d === 's' ? SY : r.d === 'p' ? PA : '#F2D27A';
    const pre = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, r.g + 2.35, 8), mat(col, { k: 0.8, e: 0.35 })); pre.rotation.z = Math.PI / 2; pre.position.set((-2.35 + r.g) / 2, r.y, 0); G2.add(pre);
    const gang = new THREE.Mesh(new THREE.SphereGeometry(r.d === 'a' ? 0.22 : 0.14, 18, 12), mat(r.d === 'a' ? '#F2D27A' : col, { k: 0.8, e: 0.4 })); gang.position.set(r.g, r.y, 0); G2.add(gang);
    let post = null; if (r.d !== 'a') { post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4 - r.g, 8), mat(col, { k: 0.8, e: 0.35, op: 0.9 })); post.rotation.z = Math.PI / 2; post.position.set((r.g + 2.4) / 2, r.y, 0); G2.add(post); }
    const tgt = new THREE.Mesh(r.d === 'a' ? new THREE.TorusGeometry(0.16, 0.05, 8, 24) : ell3(0.22, 0.18, 0.16), mat(r.d === 'a' ? '#E0505A' : '#E89AA8', { k: 0.6 })); tgt.position.set(2.6, r.y, 0); G2.add(tgt);
    return { r, col, gang, x0: -2.35 }; });
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'map', bal: 0, hrPh: 0, gutPh: 0, labels: true, rot: false, fly: null, msg: null, imp: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = flyTarget(...(m === 'chem' ? VIEW.chem : VIEW.body)); st.msg = null; refs.setInfo && refs.setInfo(); }
  const LR = (a, b, k) => a + (b - a) * k, C = new THREE.Color();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    const tb = st.mode === 'fight' ? 1 : st.mode === 'rest' ? -1 : 0; st.bal = LR(st.bal, tb, 1 - Math.exp(-dt * 1.8)); const b = st.bal, sy = Math.max(0, b), pa = Math.max(0, -b);
    const hr = 72 + 50 * sy - 12 * pa; st.hr = hr; st.hrPh += dt * hr / 60 * Math.PI * 2; org.heart.scale.setScalar(1 + 0.08 * Math.max(0, Math.sin(st.hrPh)) ** 3);
    const pr = 0.024 + 0.02 * sy - 0.012 * pa; st.pupil = pr; pupil.scale.setScalar(pr);
    const br = 1 + 0.2 * Math.sin(t * (1.2 + 1.6 * sy)) * (0.6 + 0.4 * sy); org.lungs.forEach((m) => m.scale.set(br, 1 + (br - 1) * 0.6, br)); [bronch, bronchR].forEach((q) => q.m.scale.set(1 + 0.4 * sy - 0.25 * pa, 1, 1 + 0.4 * sy - 0.25 * pa));   /* толщина бронхов; длина прежняя */
    st.gutPh += dt * (1.5 + 3 * pa) * (1 - 0.85 * sy); const gw = (0.06 + 0.1 * pa) * (1 - 0.8 * sy); org.gut.scale.set(1 + gw * Math.sin(st.gutPh), 1, 1 + gw * Math.cos(st.gutPh * 0.7)); org.stom.scale.setScalar(1 + gw * 0.6 * Math.sin(st.gutPh * 0.8));
    org.blad.scale.setScalar(1 + 0.25 * sy - 0.3 * pa); org.adr.material.emissiveIntensity = 0.25 + 1.2 * sy;
    if (sy > 0.6 && rnd() < dt * 18) fx.spawn(O.adr.clone(), V3((rnd() - 0.5) * 0.4, 0.3 + rnd() * 0.3, 0.2), C.set('#F2D27A'), 0.7, 0.1, 1.2);
    if (sy > 0.6 && rnd() < dt * 8) fx.spawn(O.liver.clone().add(V3(0, 0.1, 0.1)), V3((rnd() - 0.5) * 0.3, 0.25, 0.2), C.set('#FFE08A'), 0.5, 0.1, 1.0);
    if (pa > 0.6 && rnd() < dt * 10) fx.spawn(O.saliv.clone(), V3(0, -0.2, 0.15), C.set('#9FD8E8'), 0.5, 0.1, 0.9);
    // импульсы по активному отделу
    PATHS.forEach((p) => { const on = st.mode === 'map' ? 0.35 : p.d === 's' ? sy : pa; p.m.material.emissiveIntensity = 0.15 + 0.9 * on; p.m.material.opacity = 0.35 + 0.6 * Math.max(on, st.mode === 'map' ? 0.6 : 0.1);
      if (on > 0.5 && rnd() < dt * 1.6) st.imp.push({ p, u: 0 }); });
    sacral.m.material.emissiveIntensity = 0.15 + 0.9 * (st.mode === 'map' ? 0.35 : pa);
    st.imp = st.imp.filter((q) => { q.u += dt * 1.1; if (q.u > 1) return false; fx.spawn(q.p.c.getPointAt(q.u), V3(0, 0, 0), C.set(q.p.d === 's' ? '#FFD0A0' : '#B0FFD0'), 0.25, 0, 0.25); return true; });
    if (st.mode === 'chem') chem.forEach((c, i) => { const u = ((t * 0.45 + i * 0.33) % 1), x = c.x0 + u * 4.95; const p = V3(40 + x, c.r.y, 0.05); if (c.r.d === 'a' && x > c.r.g) p.set(40 + c.r.g + (x - c.r.g) * 0.9, c.r.y + Math.sin(u * 20) * 0.08, 0.05); fx.spawn(p, V3(0, 0, 0), C.set(c.col), 0.35, 0, 0.3); });
    fx.update(dt);
  }
  /* ---------- тексты ---------- */
  const TXT = {
    map: 'The <b>autonomic nervous system</b> runs the organs without our awareness. The <b>sympathetic</b> division (orange) leaves spinal segments T1–L2 through the <b>sympathetic trunk</b> — a chain of ganglia along the spine. The <b>parasympathetic</b> (green) leaves the brainstem (nerves III, VII, IX and the <b>vagus X</b>) and segments S2–S4.',
    fight: '<b>“Fight or flight”</b> — sympathetic. Pupils dilate, the heart beats faster and harder, bronchi widen, the liver releases glucose and the adrenals pour <b>adrenaline</b> into the blood. Digestion stalls and the bladder relaxes: anything that does not help survival right now is put off.',
    rest: '<b>“Rest and digest”</b> — parasympathetic, mostly the <b>vagus nerve</b>. The pulse slows, pupils narrow, bronchi narrow a little, saliva and digestive juices flow, the gut churns food and the bladder contracts. Both divisions work all the time; only the balance shifts.',
    chem: '<b>Two neurons and transmitters.</b> The path from brain to organ is two neurons with a ganglion between. In the ganglia of both divisions: <b>acetylcholine</b> (nicotinic receptors). At the organ the sympathetic releases <b>norepinephrine</b>, the parasympathetic acetylcholine (muscarinic). The adrenal is a modified ganglion: it releases epinephrine straight into the blood.',
  };
  const lb = (text, pos, color, show, left) => ({ text, pos, color, show: () => st.labels && show(), left });
  const B = () => st.mode !== 'chem';
  const labels = [
    lb('brainstem', STEM.clone().add(V3(-0.1, 0.05, 0)), '#E8E0F0', B, true),
    lb('spinal cord', CORD(1.9).add(V3(-0.05, 0, 0)), '#E8E0F0', () => B() && st.mode === 'map', true),
    lb('sympathetic trunk', CH(2.2), SY, () => B() && st.mode !== 'rest'),
    lb('vagus nerve (X)', V3(-0.15, 3.0, 0.0), PA, () => B() && st.mode !== 'fight', true),
    lb('sacral outflow S2–S4', V3(0, 0.15, -0.45), PA, () => B() && st.mode !== 'fight', true),
    lb('celiac ganglion', CEL.clone().add(V3(0.05, -0.05, 0)), SY, () => B() && st.mode === 'map'),
    lb('eye: pupil', O.eye.clone().add(V3(0.08, 0.03, 0.05)), '#C8D8F0', B),
    lb('heart', O.heart.clone().add(V3(0.2, 0.05, 0.1)), '#FF7A8A', B),
    lb('bronchi and lungs', O.lungR.clone().add(V3(0.25, 0.25, 0)), '#E89AA8', B),
    lb('liver', O.liver.clone().add(V3(-0.32, -0.02, 0.1)), '#C86A6A', B, true),
    lb('stomach', O.stom.clone().add(V3(0.22, 0.02, 0.05)), '#E8A08A', () => B() && st.mode !== 'fight'),
    lb('intestines', V3(0.35, 0.65, 0.25), '#E8B890', () => B() && st.mode !== 'fight'),
    lb('adrenal: adrenaline', O.adr.clone().add(V3(0.1, 0.0, 0)), '#F2D27A', () => B() && st.mode !== 'rest'),
    lb('urinary bladder', O.blad.clone().add(V3(0.18, 0, 0.05)), '#F2D860', B),
    lb('salivary glands', O.saliv.clone().add(V3(0.08, 0, 0.05)), '#E8C08A', () => B() && st.mode !== 'fight'),
    ...ROW.flatMap((r) => { const col = r.d === 's' ? SY : r.d === 'p' ? PA : '#F2D27A', nm = r.d === 's' ? 'sympathetic' : r.d === 'p' ? 'parasympathetic' : 'adrenal gland';
      return [lb(nm, V3(40 - 2.3, r.y + 0.32, 0), col, () => st.mode === 'chem', true), lb(r.med1, V3(40 + r.g - 0.05, r.y + 0.3, 0), '#E8E0F0', () => st.mode === 'chem'), lb(r.med2, V3(40 + 2.35, r.y + 0.36, 0), '#E8E0F0', () => st.mode === 'chem'), lb(r.rec, V3(40 + 0.3, r.y - 0.36, 0), '#A8A0C0', () => st.mode === 'chem')]; }),
    lb('CNS', V3(40 - 2.6, 1.95, 0), '#C8B0E0', () => st.mode === 'chem'),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'map', label: 'Map' }, { id: 'fight', label: 'Fight or flight', color: SY }, { id: 'rest', label: 'Rest and digest', color: PA }, { id: 'chem', label: 'Two neurons and transmitters' }], () => st.mode, (v) => setMode(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–4', refs.modeSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['map', 'fight', 'rest', 'chem'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'chem') return [['Neurons in chain', 2, ''], ['Neurotransmitters', 3, '']];
    return [['Pulse', Math.round(st.hr || 72), 'bpm'], ['Pupil', ((st.pupil || 0.024) * 165).toFixed(1).replace('.', ','), 'mm'], ['Balance', st.bal > 0.3 ? 'sympathetic' : st.bal < -0.3 ? 'parasympathetic' : 'balanced', '']];
  }
  const self = {
    mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#FF9A4A',
    kicker: 'Brain · structure', title: 'Autonomic nervous system',
    lede: 'Heart, pupils, gut and glands work without our knowing. Two divisions — an “accelerator” and a “brake” — keep pulling the body toward flight or toward rest.',
    notes: `
      <div><h2>Two divisions</h2>
        <p><b>Sympathetic</b>: centers in the lateral horns of spinal segments T1–L2; short preganglionic fibers → ganglia of the sympathetic trunk and prevertebral ganglia (celiac, mesenteric) → long postganglionic fibers to the organs. <b>Parasympathetic</b>: brainstem nuclei (with nerves III, VII, IX, X) and sacral segments S2–S4; long preganglionic fibers → ganglia next to or inside the organ → short postganglionic fibers. The vagus nerve carries about 75 % of parasympathetic fibers.</p>
        <p>A third division is the <b>enteric</b> nervous system in the gut wall (≈ 500 million neurons): it runs peristalsis on its own, and the autonomic divisions only tune it.</p>
        <h3>Transmitters and drugs</h3><ul><li>Acetylcholine in the ganglia (nicotinic receptors) and at parasympathetic targets (muscarinic): atropine blocks them — the pupil dilates and the pulse speeds up.</li><li>Norepinephrine at sympathetic targets: β-blockers slow the heart, β₂-agonists (salbutamol) open the bronchi in asthma.</li><li>Exception: sweat glands receive sympathetic fibers that use acetylcholine.</li></ul></div>
      <div><h2>Conventions</h2><ul><li>The main pathways of one side of the body are shown; in reality the nerves are paired and branch into plexuses.</li><li>Organs are simplified shapes in schematic positions; trunk ganglia are drawn evenly spaced.</li><li>Organ responses are sped up and exaggerated; both divisions are always active, the scheme shows the shift in balance.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> mode</li><li><code>R</code> rotation · <code>N</code> labels</li></ul></div>`,
  };
  setMode('map'); st.fly = null;
  return self;
}
export { makeAns };
