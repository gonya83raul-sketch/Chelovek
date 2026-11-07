// @scene larynx makeLarynx | Гортань и голос | @body Системы органов
/* =========================================================
   ТЕЛО · ГОРТАНЬ И ГОЛОС: хрящи гортани (подъязычная кость, щитовидный, перстневидный, черпаловидные, надгортанник, трахея),
   голосовые складки и мышцы, которые открывают и закрывают голосовую щель; высота голоса — наклон щитовидного хряща.
   Сверено с атласом Неттера (табл. 90–93). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   ========================================================= */
const LX_PARTS = [
  { id: 'hyoid', name: 'Подъязычная кость', col: '#E8DCC0', text: '<b>Подъязычная кость</b> — подкова над гортанью, единственная кость, которая ни с одной другой не соединена суставом: она подвешена на мышцах и связках. Гортань висит на ней на щитоподъязычной мембране, а сверху к ней крепятся мышцы языка и дна рта.' },
  { id: 'thyroid', name: 'Щитовидный хрящ', col: '#7FC8E8', text: '<b>Щитовидный хрящ</b> — самый крупный: две пластины, сросшиеся спереди под углом. У мужчин угол острее (около 90°), выступ заметен на шее — это кадык; у женщин угол около 120°. Он как щит прикрывает голосовые складки, которые крепятся к его внутреннему углу. Сверху в нём хорошо виден вырез — верхняя щитовидная вырезка.' },
  { id: 'cricoid', name: 'Перстневидный хрящ', col: '#8FD8A8', text: '<b>Перстневидный хрящ</b> — единственное полное хрящевое кольцо дыхательных путей. Форма перстня: спереди узкая дуга, сзади высокая пластинка — «печатка». На ней сидят черпаловидные хрящи, а по бокам с ним сочленяется щитовидный.' },
  { id: 'aryt', name: 'Черпаловидные хрящи', col: '#F2C26B', text: '<b>Черпаловидные хрящи</b> — парные пирамидки на пластинке перстневидного (на верхушке — маленькие рожковидные хрящи). Вперёд смотрит голосовой отросток — к нему крепится голосовая складка; вбок — мышечный, за него тянут мышцы. Поворачиваясь и скользя, хрящи открывают и закрывают голосовую щель.' },
  { id: 'epig', name: 'Надгортанник', col: '#F09AB8', text: '<b>Надгортанник</b> — гибкий лепесток из эластического хряща за корнем языка. При глотании гортань поднимается к нему, он наклоняется и прикрывает вход в гортань — пища уходит в пищевод. Если глотать и смеяться одновременно, крошка может проскочить — и тогда кашель.' },
  { id: 'folds', name: 'Голосовые складки', col: '#F4F0EA', text: '<b>Голосовые складки</b> — голосовая связка и голосовая мышца под слизистой, натянутые от угла щитовидного хряща к черпаловидным. Щель между ними — <b>голосовая щель</b>, самое узкое место дыхательных путей у взрослого. Над ними лежат преддверные («ложные») складки.' },
  { id: 'trach', name: 'Трахея', col: '#B8C8D8', text: '<b>Трахея</b> начинается от перстневидного хряща: 16–20 хрящевых полуколец, открытых сзади. Заднюю стенку образует мышца и соединительная ткань — к ней прилегает пищевод, и пищевой комок может её слегка вдавить.' },
];
const LX_GL = [
  { id: 'deep', name: 'Вдох', ph: 0.72, sl: 0.15, vib: 0, mus: ['pca'], text: '<b>Глубокий вдох.</b> Задние перстнечерпаловидные мышцы — единственные, что открывают голосовую щель, — тянут мышечные отростки назад, и черпаловидные хрящи разворачивают голосовые отростки наружу. Щель — широкий треугольник, больше сантиметра у основания.' },
  { id: 'quiet', name: 'Спокойное дыхание', ph: 0.32, sl: 0.06, vib: 0, mus: [], text: '<b>Спокойное дыхание.</b> Мышцы почти не работают: щель приоткрыта узким треугольником, при выдохе чуть сужается.' },
  { id: 'voice', name: 'Голос', ph: 0, sl: 0, vib: 1, mus: ['lca', 'ia', 'ta'], text: '<b>Голос.</b> Латеральные перстнечерпаловидные и поперечная черпаловидная мышцы смыкают складки, голосовая мышца внутри складки придаёт им упругость. Выдыхаемый воздух раздвигает их, упругость и подсос быстрого потока снова смыкают — сотни раз в секунду. Каждое размыкание — толчок давления: это и есть звук (здесь колебания замедлены).' },
  { id: 'whisper', name: 'Шёпот', ph: -0.36, sl: 0.18, vib: 0, mus: ['lca'], text: '<b>Шёпот.</b> Складки сомкнуты спереди, но между черпаловидными хрящами остаётся треугольная щель. Воздух проходит с шумом, складки не колеблются — получается звук без тона.' },
];
const LX_MUS = { ct: ['перстнещитовидная', '#FF7A6A'], pca: ['задняя перстнечерпаловидная', '#FF5A7A'], lca: ['латеральная перстнечерпаловидная', '#FF9A5A'], ia: ['поперечная черпаловидная', '#FFB060'], ta: ['щиточерпаловидная (голосовая)', '#FF8A9A'], ct2: ['перстнещитовидная', '#E85F52'] };
function makeLarynx() {
  rnd = mulberry(1701);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fc8ff);
  const DK = !matchMedia('(max-width:700px)').matches, OFF = DK ? 2.6 : 0;
  const VIEW = {
    struct: flyTarget(V3(-OFF * 1.4, DK ? 0.35 : 1.1, 0), DK ? V3(-OFF * 1.4 + 12, 4.2, 14.4) : V3(7.2, 5.0, 10)),
    glottis: flyTarget(V3(-(DK ? 1.9 : 0), 0.9, 0.1 + (DK ? 0 : -0.5)), V3(-(DK ? 1.9 : 0), 9.8, 1.3 + (DK ? 0 : -0.5))),
    pitch: flyTarget(V3(0, DK ? 0.8 : 1.6, DK ? 3.2 : 0.4), DK ? V3(19, 2.4, 4.0) : V3(15, 3.2, 1.2)),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.struct.pos);
  const controls = makeControls(camera, VIEW.struct.target); controls.minDistance = 3; controls.maxDistance = 30;
  const st = { t: 0, mode: 'struct', sel: null, gl: 'quiet', ph: 0.32, sl: 0.06, vib: 0, pitch: 0.3, tilt: 0, labels: true, rot: false, fly: null };
  const mats = {}, pick = [];
  const mat = (id, col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.8), roughness: 0.5, clearcoat: 0.35, sheen: 0.3, sheenColor: new THREE.Color(0xffffff), emissive: col, emissiveIntensity: 0.05, side: o.side ?? THREE.FrontSide, transparent: !!o.op, opacity: o.op ?? 1, depthWrite: !o.op }); if (id) (mats[id] = mats[id] || []).push(m); return m; };
  const add = (geo, m, id, parent = scene) => { const ms = new THREE.Mesh(geo, m); if (id) { ms.userData.pick = id; pick.push(ms); } parent.add(ms); return ms; };
  // поверхность по сетке u×v: f(u, v) → точка
  const surf = (f, nu, nv) => { const pos = [], idx = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = f(i / nu, j / nv); pos.push(p.x, p.y, p.z); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const ID = new THREE.Group(); scene.add(ID); const UPPER = [];
  // ---------- щитовидный хрящ (вместе с надгортанником и подъязычной костью наклоняется вперёд в режиме «Высота») ----------
  const PIV = V3(0, -0.5, -0.5);   // перстнещитовидный сустав — ось поворота
  const thyG = new THREE.Group(); thyG.position.copy(PIV); ID.add(thyG);
  const inThy = new THREE.Group(); inThy.position.copy(PIV).negate(); thyG.add(inThy);
  const lamina = (s) => surf((u, v) => {
    const x = s * (0.05 + 1.62 * Math.pow(u, 0.9)), z = 1.05 - 1.72 * Math.pow(u, 1.15) + 0.22 * Math.exp(-(((v - 0.78) / 0.25) ** 2)) * Math.exp(-((u / 0.1) ** 2));   // угол ≈ 90°, выступ кадыка
    const top = 2.45 - 0.85 * Math.exp(-((u / 0.14) ** 2)) - 0.25 * Math.sin(Math.PI * Math.min(1, u / 0.85)) * 0.6, bot = 0.15 + 0.35 * u - 0.25 * Math.sin(Math.PI * u);
    return V3(x, bot + (top - bot) * v, z);
  }, 24, 10);
  const thyM = mat('thyroid', '#7FC8E8', { side: THREE.DoubleSide, op: 0.72 }); thyM.userData.op = true;   // полупрозрачный: видно надгортанник и складки за ним
  [1, -1].forEach((s) => {
    add(lamina(s), thyM, 'thyroid', inThy);
    const hu = add(new THREE.CylinderGeometry(0.09, 0.16, 0.85, 10), thyM, 'thyroid', inThy); hu.position.set(s * 1.6, 2.8, -0.6); hu.rotation.x = -0.15;   // верхний рог
    const hl = add(new THREE.CylinderGeometry(0.16, 0.1, 0.75, 10), thyM, 'thyroid', inThy); hl.position.set(s * 1.5, -0.15, -0.55);   // нижний рог — к суставу с перстневидным
  });
  // угол щитовидного хряща у передней спайки — виден в режиме щели, когда сам хрящ скрыт
  const angG = new THREE.Group(); ID.add(angG); angG.visible = false;
  [1, -1].forEach((s) => add(surf((u, v) => { const uu = 0.22 * u, x = s * (0.05 + 1.62 * Math.pow(uu, 0.9)), z = 1.05 - 1.72 * Math.pow(uu, 1.15); return V3(x, 0.5 + 0.75 * v, z); }, 6, 3), thyM, 'thyroid', angG));
  // надгортанник — лепесток, вогнутый назад
  const epiM = mat('epig', '#F09AB8', { side: THREE.DoubleSide });
  UPPER.push(add(surf((u, v) => { const y = 1.2 + 3.0 * v, w = 0.12 + 0.8 * Math.sin(Math.PI * Math.min(1, 0.15 + v * 0.95)) * (v > 0.85 ? 1 - (v - 0.85) * 3 : 1), x = (u - 0.5) * 2 * w; return V3(x, y, 0.72 - 0.75 * v * v + 0.35 * (x * x)); }, 12, 16), epiM, 'epig', inThy));
  // подъязычная кость — подкова
  const hyM = mat('hyoid', '#E8DCC0');
  const hyC = new THREE.CatmullRomCurve3([V3(-1.95, 3.35, -1.55), V3(-1.45, 3.25, -0.2), V3(-0.7, 3.15, 0.95), V3(0, 3.12, 1.2), V3(0.7, 3.15, 0.95), V3(1.45, 3.25, -0.2), V3(1.95, 3.35, -1.55)]);
  UPPER.push(add(new THREE.TubeGeometry(hyC, 60, 0.13, 10), hyM, 'hyoid', ID));
  { const hb = add(new THREE.CapsuleGeometry(0.24, 1.3, 6, 12), hyM, 'hyoid', ID); hb.rotation.z = Math.PI / 2; hb.scale.set(1, 1, 0.75); hb.position.set(0, 3.12, 1.17); UPPER.push(hb);
    [1, -1].forEach((s) => { const e = add(new THREE.SphereGeometry(0.2, 12, 10), hyM, 'hyoid', ID); e.position.set(s * 1.95, 3.35, -1.55); UPPER.push(e); const m2 = add(new THREE.SphereGeometry(0.09, 10, 8), hyM, 'hyoid', ID); m2.position.set(s * 0.72, 3.32, 0.95); UPPER.push(m2); }); }
  // щитоподъязычная мембрана — полупрозрачная
  const memM = mat(null, '#BCD4E6', { op: 0.4, side: THREE.DoubleSide });
  const memF = (u, v) => { const t = hyC.getPoint(0.12 + 0.76 * u); const x = (u - 0.5) * 2 * 1.6, z = 1.0 - 1.72 * Math.pow(Math.abs(x) / 1.62, 1.1); const b = inThy.localToWorld(V3(x, 2.25 - 0.3 * Math.exp(-((x / 0.3) ** 2)), z)); return b.lerp(V3(x, t.y - 0.15, t.z), v); };
  const mem = add(surf(memF, 20, 4), memM, null, ID); UPPER.push(mem);
  const memUpd = () => { const pa = mem.geometry.attributes.position; for (let j = 0; j <= 4; j++) for (let i = 0; i <= 20; i++) { const q = memF(i / 20, j / 4); pa.setXYZ(j * 21 + i, q.x, q.y, q.z); } pa.needsUpdate = true; mem.geometry.computeVertexNormals(); };
  // ---------- перстневидный хрящ ----------
  const crM = mat('cricoid', '#8FD8A8', { side: THREE.DoubleSide });
  const crTop = (a) => -0.45 + 1.55 * Math.pow((1 - Math.cos(a)) / 2, 2.2);   // a = 0 спереди, π сзади
  const ring = (r, fn) => surf((u, v) => { const a = u * Math.PI * 2; return V3(Math.sin(a) * r * 1.12, -0.95 + (fn(a) + 0.95) * v, Math.cos(a) * r - 0.12); }, 48, 3);
  add(ring(1.08, crTop), crM, 'cricoid', ID); add(ring(0.9, crTop), crM, 'cricoid', ID);
  add(surf((u, v) => { const a = u * Math.PI * 2, r = 0.9 + 0.18 * v; return V3(Math.sin(a) * r * 1.12, crTop(a), Math.cos(a) * r - 0.12); }, 48, 1), crM, 'cricoid', ID);
  [1, -1].forEach((s) => { add(new THREE.SphereGeometry(0.14, 12, 10), crM, 'cricoid', ID).position.set(s * 0.32, 0.92, -0.95); add(new THREE.SphereGeometry(0.12, 12, 10), crM, 'cricoid', ID).position.set(s * 1.22, -0.5, -0.52); });   // суставные площадки
  // ---------- трахея: полукольца, открытые сзади ----------
  const trM = mat('trach', '#B8C8D8', { side: THREE.DoubleSide });
  for (let i = 0; i < 4; i++) { const y = -1.1 - i * 0.36; add(new THREE.TorusGeometry(1.0, 0.13, 8, 36, Math.PI * 1.55), trM, 'trach', ID).position.set(0, y, -0.1); }
  ID.children.slice(-4).forEach((m) => { m.rotation.set(Math.PI / 2, 0, -Math.PI * 0.275); m.scale.set(1.05, 1, 0.45); });
  const tw = add(new THREE.CylinderGeometry(1.0, 1.0, 1.75, 24, 1, true, Math.PI * 0.78, Math.PI * 0.44), mat('trach', '#C89A9A', { op: 0.55, side: THREE.DoubleSide }), 'trach', ID); tw.position.set(0, -1.65, -0.1);
  const dark = new THREE.Mesh(new THREE.CircleGeometry(0.95, 32), new THREE.MeshBasicMaterial({ color: 0x0a0505 })); dark.rotation.x = -Math.PI / 2; dark.position.set(0, -0.6, -0.1); ID.add(dark);   // просвет снизу — тёмный
  // ---------- черпаловидные хрящи ----------
  const arM = mat('aryt', '#F2C26B');
  const AR = [1, -1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.3, 0.72, -0.95); ID.add(g);
    const body = add(new THREE.ConeGeometry(0.3, 0.85, 3), arM, 'aryt', g); body.position.y = 0.3; body.rotation.y = Math.PI;
    const voc = add(new THREE.ConeGeometry(0.08, 0.75, 8), arM, 'aryt', g); voc.rotation.x = Math.PI / 2; voc.position.set(-s * 0.17, 0.02, 0.36);
    const musc = add(new THREE.SphereGeometry(0.13, 12, 10), arM, 'aryt', g); musc.position.set(s * 0.3, -0.02, -0.14);
    const corn = add(new THREE.SphereGeometry(0.09, 10, 8), arM, 'aryt', g); corn.position.set(-s * 0.05, 0.78, -0.08);
    return { s, g, tip: V3(-s * 0.27, 0.02, 0.58), mp: V3(s * 0.32, -0.02, -0.14) };
  });
  // ---------- голосовые складки: клин от угла щитовидного хряща до голосового отростка; край колеблется ----------
  const NS = 14, foldM = mat('folds', '#F2D8D0', { side: THREE.DoubleSide }); foldM.vertexColors = true; foldM.color.set(0xeeeeee);
  const FCOL = ['#FFF6F0', '#FCEAE4', '#C88E88', '#E2B8B0', '#F6E2DA'].map((c) => new THREE.Color(c));   // свободный край светлый, нижний скат темнее
  const FOLD = AR.map((a) => {
    const prof = 5, geo = new THREE.BufferGeometry(), pos = new Float32Array((NS + 1) * prof * 3), idx = [];
    for (let i = 0; i < NS; i++) for (let k = 0; k < prof - 1; k++) { const p = i * prof + k, q = p + prof; idx.push(p, q, p + 1, p + 1, q, q + 1); }
    const col = new Float32Array((NS + 1) * prof * 3); for (let i = 0; i <= NS; i++) FCOL.forEach((c, kk) => c.toArray(col, (i * prof + kk) * 3));
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx);
    const m = add(geo, foldM, 'folds', ID);
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((NS + 1) * 6), 3)); const li = []; for (let i = 0; i < NS; i++) li.push(2 * i, 2 * i + 2, 2 * i + 1, 2 * i + 1, 2 * i + 2, 2 * i + 3); lg.setIndex(li);
    const line = new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })); ID.add(line);   // свободный край — светлая полоска
    return { a, m, line };
  });
  const AC = V3(0, 0.98, 1.0);   // передняя спайка — внутренний угол щитовидного хряща
  // ---------- мышцы: веретёна между точками ----------
  const musM = (c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.7), roughness: 0.6, emissive: c, emissiveIntensity: 0.15, transparent: true, opacity: 0.9 });
  const MUS = {};
  Object.entries(LX_MUS).forEach(([id, [, c]]) => { MUS[id] = [1, -1].map(() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1, 10, 1), musM(c)); ID.add(m); return m; }); });
  const span = (m, a, b, r = 0.11) => { const d = b.clone().sub(a), L = d.length(); m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(r / 0.11, L, r / 0.11); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); };
  const rest = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 41 }, (_, i) => { const u = i / 40, sd = u < 0.5 ? -1 : 1, uu = Math.abs(1 - 2 * u); return V3(sd * (0.05 + 1.62 * Math.pow(uu, 0.9)), 2.45 - 0.85 * Math.exp(-((uu / 0.14) ** 2)) - 0.15 * Math.sin(Math.PI * Math.min(1, uu / 0.85)), 1.05 - 1.72 * Math.pow(uu, 1.15)); }).concat([V3(1.67, 0.5, -0.67), V3(1.67, 0.3, -0.67)])), new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0.7 }));
  rest.computeLineDistances(); rest.visible = false; scene.add(rest);
  // дуга-стрелка: щитовидный поворачивается вокруг оси сустава вперёд и вниз
  const ARC = new THREE.Curve(); ARC.getPoint = (t, o = V3(0, 0, 0)) => { const f = 0.3 + 0.45 * t; return o.set(1.95, PIV.y + 3.3 * Math.cos(f), PIV.z + 3.3 * Math.sin(f)); };
  const arcM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  const arc = new THREE.Group(); arc.add(new THREE.Mesh(new THREE.TubeGeometry(ARC, 24, 0.03, 6), arcM)); scene.add(arc);
  { const hd = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 10), arcM), e = ARC.getPoint(1), d = ARC.getPoint(1).sub(ARC.getPoint(0.95)).normalize(); hd.position.copy(e); hd.quaternion.setFromUnitVectors(V3(0, 1, 0), d); arc.add(hd); }
  // ---------- звуковая волна (режим «Высота») ----------
  const WN = 220, wave = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: WN }, () => V3(0, 0, 0))), new THREE.LineBasicMaterial({ color: 0x9fd8ff })); scene.add(wave);
  const W = V3(0, 0, 0), tA = V3(0, 0, 0), tB = V3(0, 0, 0);
  function foldLen() { thyG.updateMatrixWorld(true); const ac = inThy.localToWorld(AC.clone()); const tip = AR[0].g.localToWorld(AR[0].tip.clone()); return ac.distanceTo(tip); }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const G = LX_GL.find((g) => g.id === st.gl), tgt = st.mode === 'glottis' ? G : st.mode === 'pitch' ? { ph: 0, sl: 0, vib: 1 } : { ph: 0.32, sl: 0.06, vib: 0 };
    const k = Math.min(1, dt * 3); st.ph += (tgt.ph - st.ph) * k; st.sl += (tgt.sl - st.sl) * k; st.vib += (tgt.vib - st.vib) * k;
    UPPER.forEach((m) => { m.visible = st.mode !== 'glottis'; }); inThy.visible = st.mode !== 'glottis'; angG.visible = st.mode === 'glottis'; rest.visible = st.mode === 'pitch'; tw.visible = st.mode !== 'pitch'; arc.visible = st.mode === 'pitch' && st.tilt > 0.03;
    const t0 = st.tilt; st.tilt += ((st.mode === 'pitch' ? 0.25 * st.pitch : 0) - st.tilt) * k; thyG.rotation.x = st.tilt; if (Math.abs(st.tilt - t0) > 1e-5 || !mem.userData.ok) { thyG.updateMatrixWorld(true); memUpd(); mem.userData.ok = true; }
    AR.forEach((a) => { a.g.rotation.y = a.s * st.ph; a.g.position.x = a.s * (0.3 + st.sl); a.g.updateMatrixWorld(true); });
    thyG.updateMatrixWorld(true);
    const ac = inThy.localToWorld(AC.clone()), hz = 2.2 + 4 * (st.mode === 'pitch' ? st.pitch : 0.3);   // видимая частота колебаний (замедлено)
    FOLD.forEach(({ a, m, line }) => {
      const tip = a.g.localToWorld(a.tip.clone()), pos = m.geometry.attributes.position, lp = line.geometry.attributes.position;
      const along = tip.clone().sub(ac), L = along.length(); along.normalize();
      const lat = V3(along.z, 0, -along.x).multiplyScalar(a.s); if (lat.x * a.s < 0) lat.negate();   // наружу
      for (let i = 0; i <= NS; i++) {
        const u = i / NS, bell = Math.sin(Math.PI * u), off = st.vib * 0.065 * bell * Math.max(0, Math.sin(st.t * hz * Math.PI * 2 - u * 0.8));
        W.copy(ac).addScaledVector(along, L * u).addScaledVector(lat, off);
        const P = [[0, 0], [0.04, -0.12], [0.3, -0.38], [0.42, 0.02], [0.26, 0.09]];
        P.forEach(([lx, ly], kk) => { tA.copy(W).addScaledVector(lat, lx * (0.8 + 0.2 * bell)).add(V3(0, ly, 0)); pos.setXYZ(i * 5 + kk, tA.x, tA.y, tA.z); });
        lp.setXYZ(2 * i, W.x, W.y + 0.015, W.z); tB.copy(W).addScaledVector(lat, 0.07); lp.setXYZ(2 * i + 1, tB.x, tB.y + 0.04, tB.z);
      }
      pos.needsUpdate = true; lp.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); line.geometry.computeBoundingSphere();
    });
    // мышцы: точки крепления
    const on = (id) => (st.mode === 'glottis' && G.mus.includes(id)) || (st.mode === 'pitch' && (id === 'ct' || id === 'ct2'));
    Object.entries(MUS).forEach(([id, arr]) => arr.forEach((mm, i) => {
      const s = i ? -1 : 1, ar = AR[i]; const mp = ar.g.localToWorld(ar.mp.clone());
      if (id === 'ct') span(mm, V3(s * 0.3, -0.78, 1.18), inThy.localToWorld(V3(s * 0.85, 0.32, 0.78)), 0.14);
      else if (id === 'ct2') span(mm, V3(s * 0.55, -0.82, 1.05), inThy.localToWorld(V3(s * 1.5, 0.05, -0.35)), 0.14);
      else if (id === 'ta') span(mm, inThy.localToWorld(AC.clone()).add(V3(s * 0.34, -0.18, -0.1)), mp, 0.075);
      else if (id === 'pca') span(mm, V3(s * 0.35, -0.55, -1.16), mp, 0.13);
      else if (id === 'lca') span(mm, V3(s * 1.0, -0.42, 0.25), mp, 0.1);
      else { const o = AR[1 - i].g.localToWorld(V3(AR[1 - i].s * 0.05, 0.25, -0.2)); span(mm, ar.g.localToWorld(V3(s * 0.05, 0.25, -0.2)), o, 0.1); }
      const act = on(id), want = st.mode === 'struct' || (st.mode === 'glottis' && (id === 'ct' || id === 'ct2')) ? 0 : act ? 1 : 0.25;
      mm.material.opacity += ((st.mode === 'struct' ? 0 : want) - mm.material.opacity) * k; mm.visible = mm.material.opacity > 0.02;
      mm.material.emissiveIntensity = act ? 0.35 + 0.25 * Math.sin(st.t * 5) : 0.1;
    }));
    // волна
    const wp = wave.geometry.attributes.position; wave.visible = st.mode === 'pitch';
    if (wave.visible) { const f = freq(), cyc = f / 45; for (let i = 0; i < WN; i++) { const u = i / (WN - 1); wp.setXYZ(i, 0, 4.0 + 0.3 * Math.sin((u * cyc - st.t * 1.5) * Math.PI * 2), 3.9 - 5.0 * u); } wp.needsUpdate = true; }
  }
  const freq = () => Math.round(90 + 260 * st.pitch);
  // ---------- выбор частей ----------
  function select(id) {
    st.sel = id === 'all' ? null : id;
    Object.entries(mats).forEach(([pid, arr]) => arr.forEach((m) => { const onp = !st.sel || st.sel === pid; m.transparent = !onp || m.userData.op; m.opacity = onp ? (pid === 'trach' && m.side === THREE.DoubleSide && m.userData.op ? 0.55 : pid === 'thyroid' && !st.sel ? 0.72 : 1) : 0.15; m.depthWrite = onp && !(pid === 'thyroid' && !st.sel); m.emissiveIntensity = st.sel === pid ? 0.25 : 0.05; m.needsUpdate = true; }));
    memM.opacity = st.sel ? 0.05 : 0.4;
    refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo();
  }
  mats.trach[1].userData.op = true;
  function setMode(m) {
    st.mode = m; if (m !== 'struct' && st.sel) select('all');
    st.fly = VIEW[m === 'glottis' ? 'glottis' : m === 'pitch' ? 'pitch' : 'struct'];
    refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'struct') setMode('struct'); select(st.sel === id ? 'all' : id); });
  // ---------- подписи ----------
  const P = (id) => LX_PARTS.find((p) => p.id === id);
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const inT = (v) => () => inThy.localToWorld(v.clone());
  const labels = [
    lb('подъязычная кость', inT(V3(-1.3, 3.3, 0.35)), P('hyoid').col, () => st.mode === 'struct' && (!st.sel || st.sel === 'hyoid')),
    lb('надгортанник', () => inThy.localToWorld(st.mode === 'pitch' ? V3(-0.35, 2.7, 0.15) : V3(0.35, 3.75, 0.0)), P('epig').col, () => st.mode !== 'glottis' && (st.sel === 'epig' || (!st.sel && DK))),
    lb('щитовидный хрящ', inT(V3(-1.2, 1.6, 0.4)), P('thyroid').col, () => st.mode !== 'glottis' && (!st.sel || st.sel === 'thyroid')),
    lb('кадык', inT(V3(0, 2.0, 1.2)), P('thyroid').col, () => st.mode === 'struct' && st.sel === 'thyroid', true),
    lb('перстневидный хрящ', () => st.mode === 'pitch' ? V3(1.0, -0.95, 1.1) : V3(-0.95, -0.7, 0.55), P('cricoid').col, () => st.mode !== 'glottis' && (!st.sel || st.sel === 'cricoid')),
    lb('черпаловидные хрящи', () => AR[1].g.localToWorld(V3(0, 0.75, 0)), P('aryt').col, () => (!st.sel || st.sel === 'aryt') && (st.mode !== 'pitch' || DK)),
    lb('голосовая складка', () => AR[1].g.localToWorld(AR[1].tip.clone()).lerp(inThy.localToWorld(AC.clone()), 0.5).add(V3(-0.2, 0.05, 0)), '#FFE8E0', () => st.mode === 'glottis' || st.sel === 'folds', true),
    lb('голосовая щель', () => inThy.localToWorld(AC.clone()).lerp(V3(0, 0.75, -0.5), 0.6), '#FFFFFF', () => st.mode === 'glottis' && st.gl !== 'voice'),
    lb('трахея', V3(-1.0, -2.3, 0.45), P('trach').col, () => st.mode === 'struct' && (!st.sel || st.sel === 'trach')),
    lb('перстнещитовидный сустав', () => V3(1.7, -0.5, -0.5), '#FFFFFF', () => st.mode === 'pitch' && DK),
    lb('исходное положение', V3(1.67, 2.6, -0.3), '#FFFFFF', () => st.mode === 'pitch' && st.pitch > 0.3),
    lb('угол щитовидного хряща', () => inThy.localToWorld(AC.clone()).add(V3(0, 0, 0.1)), P('thyroid').col, () => st.mode === 'glottis'),
    lb('спереди', V3(0, 0.75, 1.45), '#9AA4B4', () => st.mode === 'glottis'),
    lb('сзади', V3(0, 0.75, -1.45), '#9AA4B4', () => st.mode === 'glottis'),
    lb('межхрящевая щель', V3(0, 0.75, -1.05), '#FFFFFF', () => st.mode === 'glottis' && st.gl === 'whisper'),
    lb('перстнещитовидная мышца', () => MUS.ct[0].position.clone().lerp(MUS.ct2[0].position, 0.5).add(V3(0, 0.35, 0.3)), LX_MUS.ct[1], () => st.mode === 'pitch', true),
    lb('звуковая волна', V3(0, 4.55, 1.4), '#9FD8FF', () => st.mode === 'pitch'),
    ...['pca', 'lca', 'ia', 'ta'].map((id) => lb(LX_MUS[id][0] + ' мышца', () => (id === 'lca' || id === 'ta' ? MUS[id][1] : MUS[id][0]).position.clone().add(V3(0, 0, id === 'ta' ? 0.35 : 0)), LX_MUS[id][1], () => { const m = LX_GL.find((g) => g.id === st.gl).mus; return st.mode === 'glottis' && m.includes(id) && (DK || m.length === 1); }, id === 'lca' || id === 'ta')),   // на телефоне три длинные подписи не помещаются — названия есть в тексте
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  Object.defineProperty(labels.find((l) => l.text === 'перстневидный хрящ'), 'left', { get: () => st.mode === 'pitch' });
  Object.defineProperty(labels.find((l) => l.text === 'надгортанник'), 'left', { get: () => st.mode === 'pitch' });
  // ---------- панель ----------
  const INTRO = '<b>Гортань</b> — хрящевая коробка в начале дыхательных путей: пропускает воздух, при глотании закрывает вход в трахею и делает голос. Каркас — три непарных хряща (щитовидный, перстневидный, надгортанник) и три парных (черпаловидные, рожковидные, клиновидные). Нажмите на хрящ или выберите его ниже.';
  const PITCH = '<b>Высота голоса.</b> Перстнещитовидная мышца наклоняет щитовидный хрящ вперёд и вниз — он поворачивается в перстнещитовидном суставе. Складки удлиняются и натягиваются, колеблются чаще — голос выше. Голосовая мышца внутри складки, наоборот, укорачивает складку и меняет её жёсткость. Громкость задаёт сила выдоха.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.mode === 'glottis' ? LX_GL.find((g) => g.id === st.gl).text : st.mode === 'pitch' ? PITCH : st.sel ? P(st.sel).text : INTRO; };
    refs.modeSeg = seg([{ id: 'struct', label: 'Строение' }, { id: 'glottis', label: 'Голосовая щель' }, { id: 'pitch', label: 'Высота голоса' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.seg = null;
      if (st.mode === 'struct') { refs.seg = seg([{ id: 'all', label: 'Все' }, ...LX_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => select(v)); box.append(h('div', { class: 'glabel' }, 'Части', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)); }
      else if (st.mode === 'glottis') { box.append(h('div', { class: 'glabel' }, 'Положение складок'), h('div', { class: 'gctl' }, seg(LX_GL.map((g) => ({ id: g.id, label: g.name })), () => st.gl, (v) => { st.gl = v; refs.setInfo(); }))); }
      else box.append(h('div', { class: 'glabel' }, 'Натяжение складок'), h('div', { class: 'gctl' }, range('lxPitch', 0, 1, 0.01, () => st.pitch, (v) => { st.pitch = v; }, (v) => Math.round(90 + 260 * v) + ' Гц')));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, refs.lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['struct', 'glottis', 'pitch'][n - 1]); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'glottis') { const w = Math.max(0, 2 * (AR[0].g.localToWorld(AR[0].tip.clone()).x)) * 10; const bk = Math.max(0, 20 * AR[0].g.position.x - 6); return [['Щель спереди', w < 0.6 || st.gl === 'voice' ? '0' : w.toFixed(0), 'мм у голосовых отростков'], ['Щель сзади', bk.toFixed(0), 'мм между хрящами'], ['Колебания', st.gl === 'voice' ? '100–250' : '—', st.gl === 'voice' ? 'раз/с' : '']]; }
    if (st.mode === 'pitch') return [['Частота тона', freq(), 'Гц'], ['Длина складок', Math.round(foldLen() * 10), 'мм']];
    return [['Хрящи', 6, 'видов: 3 непарных + 3 парных'], ['Складки', '12–25', 'мм']];
  }
  const self = {
    labelBg: true, mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sel ? P(st.sel).col : '#7FC8E8'; },
    kicker: 'Тело · системы органов', title: 'Гортань и голос',
    lede: 'Хрящевая коробка размером с грецкий орех: открывает путь воздуху, захлопывается при глотании и превращает выдох в голос — две складки слизистой колеблются сотни раз в секунду.',
    notes: `
      <div><h2>Строение</h2>
        <p>Гортань лежит на уровне IV–VI шейных позвонков, под подъязычной костью и над трахеей. Каркас: щитовидный, перстневидный хрящи и надгортанник (непарные), черпаловидные, рожковидные и клиновидные (парные). Хрящи соединены суставами (перстнещитовидными и перстнечерпаловидными), связками и мембранами.</p>
        <p>Внутри — три этажа: преддверие (над преддверными складками), межжелудочковый отдел с голосовыми складками и подголосовая полость, переходящая в трахею. Иннервация — блуждающий нерв: верхний гортанный (чувствительность и перстнещитовидная мышца) и возвратный гортанный (все остальные мышцы).</p></div>
      <div><h2>Как рождается голос</h2>
        <p>Источник — складки: поток воздуха раздвигает сомкнутые складки, их упругость и подсос быстрого потока смыкают снова, и так 100–130 раз в секунду у мужчин и около 200–220 у женщин. Это гудение без слов. Слова делает «фильтр» — глотка, рот и нос: язык и губы меняют форму полостей, усиливают разные обертоны — получаются гласные.</p>
        <p>У мужчин складки длиннее (17–25 мм против 12–17 мм) — голос ниже. В подростковом возрасте под действием тестостерона гортань мальчиков быстро растёт, складки удлиняются — голос «ломается» и опускается почти на октаву.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Охриплость</b> — частый признак ларингита. Если она держится дольше 2–3 недель, нужен осмотр у ЛОР-врача: так проявляются узелки, полипы и рак гортани (почти всегда у курильщиков).</li>
        <li><b>Узелки голосовых складок</b> — «мозоли» у певцов, учителей и детей, которые много кричат.</li>
        <li><b>Паралич возвратного гортанного нерва</b> — складка на стороне повреждения не двигается, голос сиплый. Нерв идёт рядом со щитовидной железой (риск при операциях), а левый огибает дугу аорты в груди.</li>
        <li><b>Коникотомия</b> — экстренный разрез через перстнещитовидную связку (между щитовидным и перстневидным хрящами), когда дыхательные пути выше перекрыты.</li>
        <li><b>Инородное тело</b> застревает чаще всего у голосовой щели — самого узкого места. Помощь — приём Геймлиха.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Хрящи, связки и мышцы построены схематично по атласу, без слизистой, преддверных складок, сосудов и нервов; клиновидные хрящи не показаны.</li><li>Колебания складок замедлены в десятки раз; частота в режиме «Высота голоса» — иллюстрация: на деле она зависит ещё от массы складок и давления воздуха под ними. Наклон щитовидного хряща увеличен для наглядности.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> все части</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('struct'); st.fly = null; camera.position.copy(VIEW.struct.pos); controls.target.copy(VIEW.struct.target);
  return self;
}
