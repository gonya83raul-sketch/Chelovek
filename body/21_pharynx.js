// @scene pharynx makePharynx | Глотка и глотание | @body Системы органов
/* =========================================================
   ТЕЛО · ГЛОТКА И ГЛОТАНИЕ: срединный разрез головы и шеи (носоглотка, ротоглотка, гортаноглотка, перекрёст путей
   воздуха и пищи); мышцы глотки (три констриктора и продольные мышцы) на скане черепа; глотание по фазам.
   Сверено с атласом Неттера (табл. 75–82). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   Начало координат — точка скана черепа (0.11, 16.0, 0.6), 1 ед. скана ≈ 12,5 см (как в сценах nose и face).
   ========================================================= */
const PH_REG = [
  { id: 'naso', name: 'Носоглотка', col: '#6FB7F0', text: '<b>Носоглотка</b> — верхний отдел, позади хоан, над мягким нёбом. Только для воздуха: при глотании мягкое нёбо её закрывает. На своде — глоточная миндалина (аденоиды), на боковых стенках — устья слуховых труб, которые выравнивают давление в среднем ухе.' },
  { id: 'oro', name: 'Ротоглотка', col: '#7FD39A', text: '<b>Ротоглотка</b> — от мягкого нёба до верхнего края надгортанника, позади корня языка. Через неё идут и воздух, и пища — пути здесь перекрещиваются. На боковых стенках между нёбными дужками лежат нёбные миндалины, на корне языка — язычная.' },
  { id: 'laryngo', name: 'Гортаноглотка', col: '#C79BF0', text: '<b>Гортаноглотка</b> — позади гортани, от надгортанника до нижнего края перстневидного хряща (уровень VI шейного позвонка), где глотка переходит в пищевод. Спереди — вход в гортань; по бокам от него — грушевидные карманы, по которым пища стекает в пищевод.' },
];
const PH_MUS = [
  { id: 'sup', name: 'Верхний', col: '#E8505E', text: '<b>Верхний констриктор</b> начинается от крючка крыловидного отростка, крылонижнечелюстного шва и нижней челюсти. Его волокна огибают глотку и сходятся сзади в срединном шве. Сокращаясь, сужает верхнюю часть глотки и подтягивает её стенку к мягкому нёбу.' },
  { id: 'mid', name: 'Средний', col: '#F08A4B', text: '<b>Средний констриктор</b> веером начинается от рогов подъязычной кости: верхние волокна поднимаются, нижние опускаются, а снаружи он прикрывает нижний край верхнего констриктора. Сзади все волокна вплетаются в срединный шов глотки.' },
  { id: 'inf', name: 'Нижний', col: '#E8C04A', text: '<b>Нижний констриктор</b> — самый толстый. Щитоглоточная часть идёт от щитовидного хряща косо вверх к шву. Перстнеглоточная — от перстневидного хряща; её волокна идут почти горизонтально, охватывают глотку кольцом и в покое сомкнуты: это верхний пищеводный сфинктер. Между частями сзади — треугольник Киллиана.' },
  { id: 'long', name: 'Продольные', col: '#45C4B0', text: '<b>Продольные мышцы</b> — шилоглоточная, нёбно-глоточная и трубно-глоточная. Шилоглоточная идёт от шиловидного отростка вниз, входит между верхним и средним констрикторами и вплетается в стенку и щитовидный хрящ. При глотании они укорачивают глотку и поднимают гортань.' },
];
const PH_PHASE = [
  [0.0, 'покой', '<b>Глотание</b> — путь комка от рта до пищевода — занимает около секунды. Ниже оно замедлено примерно в четыре раза. Нажмите «Пуск» или двигайте ползунок: комок пищи пройдёт из рта через глотку в пищевод, а пути к носу и гортани на это время закроются.'],
  [0.06, 'ротовая', '<b>Ротовая фаза</b> — произвольная. Кончик языка упирается в нёбо, и волна сокращения языка спереди назад выдавливает комок к зеву. Как только комок касается корня языка и нёбных дужек, рецепторы запускают рефлекс — дальше глотание идёт само.'],
  [0.38, 'глоточная', '<b>Глоточная фаза</b> — рефлекторная, ≈ 0,5 с. Мягкое нёбо поднимается и закрывает носоглотку; гортань и подъязычная кость идут вверх и вперёд, надгортанник опускается на вход в гортань, голосовые складки смыкаются — дыхание прерывается. Верхний пищеводный сфинктер расслабляется, а констрикторы волной сверху вниз гонят к нему комок.'],
  [0.6, 'пищеводная', '<b>Пищеводная фаза.</b> Комок проходит через раскрытый верхний пищеводный сфинктер, и тот смыкается за ним. Перистальтическая волна несёт комок к желудку за 8–10 с. Нёбо, надгортанник и гортань возвращаются на место — дыхание возобновляется.'],
];
function makePharynx() {
  rnd = mulberry(2104);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const sideL = new THREE.DirectionalLight(0xfff0e6, 0.0); sideL.position.set(9, 6, 4); scene.add(sideL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = {
    sec: flyTarget(DK ? V3(0, -9.6, 3.7) : V3(0, -5.3, -0.2), DK ? V3(48, -9.4, 5.6) : V3(31, -5.2, 0.2)),
    mus: flyTarget(DK ? V3(7.5, -7.6, -9.2) : V3(0, -6.8, -2.5), DK ? V3(-30.5, -2.1, -48.2) : V3(-30, -4.3, -31.6)),
    back: flyTarget(DK ? V3(8.6, -8.9, -2.5) : V3(0, -6.8, -2.5), DK ? V3(8.6, -4.7, -57.5) : V3(0, -4.1, -44)),
  };
  VIEW.sw = VIEW.sec;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.sec.pos);
  const controls = makeControls(camera, VIEW.sec.target); controls.minDistance = 8; controls.maxDistance = 110;
  const st = { t: 0, mode: 'sec', reg: null, paths: false, msel: null, back: false, wave: false, s: 0, play: false, labels: true, rot: false, fly: null, loaded: false };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const win = (s, a, b, c, d) => sm((s - a) / (b - a)) * (1 - sm((s - c) / (d - c)));   // плавно вверх на [a,b], вниз на [c,d]
  const lerpT = (tab, y) => { if (y >= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (y >= tab[i][0]) { const [a, va] = tab[i - 1], [b, vb] = tab[i]; return va + (vb - va) * (y - a) / (b - a); } return tab[tab.length - 1][1]; };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.6, clearcoat: o.cc ?? 0.15, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(col), emissiveIntensity: o.em ?? 0.1, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined, vertexColors: !!o.vc }); m.userData.em0 = o.em ?? 0.1; m.userData.col0 = m.color.clone(); return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };

  // =================== РАЗРЕЗ (режимы 1 и 3): пластины в плоскости (z, y), срез — грань x = 0, вид со стороны +x ===================
  const SEC = new THREE.Group(); scene.add(SEC);
  const LAR = new THREE.Group(); SEC.add(LAR);   // гортань: поднимается при глотании
  const HYO = new THREE.Group(); SEC.add(HYO);
  const ring2 = (pts, n) => (n ? new THREE.CatmullRomCurve3(pts.map(([z, y]) => V3(z, y, 0)), true, 'centripetal').getSpacedPoints(n).slice(0, -1) : pts.map(([z, y]) => V3(z, y, 0))).map((p) => new THREE.Vector2(p.x, p.y));
  const shapeGeo = (pts, x0, x1, o = {}) => { const sh = new THREE.Shape(ring2(pts, o.n)); (o.holes || []).forEach((hp) => sh.holes.push(new THREE.Path(ring2(hp, 40)))); const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false, curveSegments: 4 }); g.rotateY(-Math.PI / 2); g.translate(x1, 0, 0); return g; };
  const plate = (pts, x0, x1, m, parent = SEC, o = {}) => { const ms = new THREE.Mesh(shapeGeo(pts, x0, x1, o), m); parent.add(ms); return ms; };
  const dyn = (fn, x0, x1, m, parent = SEC, o = {}) => { const ms = new THREE.Mesh(new THREE.BufferGeometry(), m); ms.frustumCulled = false; parent.add(ms); const d = { ms, upd: () => { ms.geometry.dispose(); ms.geometry = shapeGeo(fn(), x0, x1, o); } }; DYN.push(d); return d; };
  const DYN = [];
  const ell = (cz, cy, rz, ry, n = 28) => Array.from({ length: n }, (_, i) => [cz + rz * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
  const rrect = (z0, z1, y0, y1, r = 0.25) => [[z0 + r, y0], [z1 - r, y0], [z1, y0 - r], [z1, y1 + r], [z1 - r, y1], [z0 + r, y1], [z0, y1 + r], [z0, y0 - r]];
  const ribPoly = (C, w0, w1) => { const L = [], R = []; C.forEach((p, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dz = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dz, dy) || 1, w = (w0 + (w1 - w0) * i / (C.length - 1)) / 2; L.push([p[0] - dy / l * w, p[1] + dz / l * w]); R.push([p[0] + dy / l * w, p[1] - dz / l * w]); }); return L.concat(R.reverse()); };
  const curvePts = (P, n) => new THREE.CatmullRomCurve3(P.map(([z, y]) => V3(z, y, 0)), false, 'centripetal').getSpacedPoints(n).map((p) => [p.x, p.y]);
  const M = {
    bone: mphys('#E8DCC8', { r: 0.75, k: 0.92, em: 0.08 }), tooth: mphys('#F4F0E6', { r: 0.35, cc: 0.5, em: 0.1 }), cart: mphys('#BFD8E8', { r: 0.45, cc: 0.4, em: 0.12 }), elast: mphys('#E8D890', { r: 0.45, cc: 0.4, em: 0.14 }),
    mus: mphys('#C8505A', { r: 0.55, em: 0.1 }), tongue: mphys('#D0606A', { r: 0.5, cc: 0.3, em: 0.1 }), wall: mphys('#C0404E', { r: 0.55, em: 0.12 }), muc: mphys('#E0909A', { r: 0.45, cc: 0.35, em: 0.12 }),
    soft: mphys('#9C7268', { r: 0.8, k: 0.8, em: 0.06 }), fat: mphys('#C9A87A', { r: 0.8, k: 0.85, em: 0.06 }), lat: mphys('#6A3F48', { r: 0.7, k: 0.75, em: 0.05 }), latF: mphys('#8A5560', { r: 0.6, em: 0.06 }),
    lymph: mphys('#D69AC8', { r: 0.6, em: 0.12 }), disc: mphys('#9FB4C8', { r: 0.6, em: 0.08 }), cord: mphys('#E3D9B6', { r: 0.7, em: 0.08 }), sept: mphys('#C88890', { r: 0.6, em: 0.08 }),
    prev: mphys('#8E4A52', { r: 0.7, em: 0.06 }), memb: mphys('#B06A72', { r: 0.6, em: 0.08 }), vf: mphys('#F2EEE6', { r: 0.4, cc: 0.4, em: 0.12 }), thy: mphys('#B8604A', { r: 0.6, em: 0.08 }),
    bolus: mphys('#E0A458', { r: 0.35, cc: 0.6, em: 0.25 }), ues: mphys('#E07060', { r: 0.5, em: 0.2 }),
  };
  const REGM = {}; PH_REG.forEach((r) => { REGM[r.id] = mphys(r.col, { op: 0.3, em: 0.5, side: THREE.DoubleSide }); });
  // --- задняя стенка глотки (поверхность просвета) в покое
  const PW0 = [[-1.4, -0.15], [-2.4, -0.45], [-3.2, -0.95], [-3.75, -1.7], [-4.0, -2.6], [-4.05, -3.6], [-4.0, -5.0], [-3.95, -6.5], [-3.95, -8.0], [-4.0, -9.5], [-4.05, -11.0], [-4.1, -12.5], [-4.15, -14.0], [-4.1, -14.8], [-3.6, -15.3], [-3.25, -15.9], [-3.2, -17.5], [-3.2, -19.6]];
  const PWc = curvePts(PW0, 90);
  const pwZ = (y) => { for (let i = 1; i < PWc.length; i++) if (PWc[i][1] <= y) { const a = PWc[i - 1], b = PWc[i], f = (y - a[1]) / (b[1] - a[1] || 1); return a[0] + (b[0] - a[0]) * f; } return PWc[PWc.length - 1][0]; };
  // --- состояние глотания
  const SW = { pal: 0, lar: 0, epi: 0, hy: 0, t1: 0, t2: 0, wY: -30, wA: 0, bz: 0, by: 0, bOn: 0, bAng: 0, bLen: 1, bW: 0.3, ues: 0, grv: 0 };
  const BPATH = curvePts([[2.2, -3.95], [1.4, -4.0], [0.0, -3.9], [-1.4, -4.4], [-2.6, -5.2], [-3.35, -6.4], [-3.45, -8.2], [-3.5, -10.2], [-3.5, -12.2], [-3.4, -14.2], [-3.25, -16.2], [-3.2, -18.4], [-3.2, -22]], 200);
  const bAt = (u) => { const i = Math.min(BPATH.length - 2, Math.floor(cl(u) * (BPATH.length - 1))); return [BPATH[i], BPATH[i + 1]]; };
  function swState(s) {
    SW.pal = win(s, 0.28, 0.38, 0.58, 0.7); SW.lar = win(s, 0.3, 0.42, 0.62, 0.78); SW.epi = win(s, 0.35, 0.46, 0.6, 0.74); SW.hy = win(s, 0.28, 0.4, 0.62, 0.78);
    SW.t1 = win(s, 0.08, 0.26, 0.5, 0.7); SW.t2 = win(s, 0.34, 0.46, 0.6, 0.78);
    SW.wA = win(s, 0.38, 0.42, 0.6, 0.64); SW.wY = -2.6 - 12.2 * cl((s - 0.38) / 0.24);
    let u; if (s < 0.14) u = 0; else if (s < 0.38) u = 0.36 * sm((s - 0.14) / 0.24); else if (s < 0.6) u = 0.36 + 0.36 * ((s - 0.38) / 0.22); else u = 0.72 + 0.28 * ((s - 0.6) / 0.38);
    const [p, q] = bAt(u); SW.bz = p[0]; SW.by = p[1]; SW.bAng = Math.atan2(q[1] - p[1], q[0] - p[0]); SW.bOn = s > 0.02 && p[1] > -18.3 ? 1 : 0; SW.bW = 0.3 + 0.25 * sm((u - 0.22) / 0.14); SW.bLen = 1 + 0.7 * cl((u - 0.68) / 0.1);
    SW.ues = win(s, 0.44, 0.5, 0.62, 0.68); SW.grv = win(s, 0.05, 0.12, 0.3, 0.4);
  }
  const bump = (y, c, w) => Math.exp(-((y - c) * (y - c)) / (w * w));
  const larOff = () => [0.8 * SW.lar, 1.6 * SW.lar], hyOff = () => [1.0 * SW.hy, 1.5 * SW.hy];
  const PWnow = () => PWc.map(([z, y]) => { let dz = 0.62 * SW.wA * bump(y, SW.wY + 0.9, 1.3) + 0.32 * SW.pal * bump(y, -2.8, 0.7); if (y < -14.6 && SW.bOn && SW.by < -13.4) dz -= 0.3 * bump(y, SW.by, 1.1); return [z + dz, y]; });

  // --- статичные пластины
  const PROF = [[6.5, 2.6], [7.2, 0.6], [7.95, -1.05], [7.9, -1.65], [7.25, -2.15], [6.4, -2.45], [6.1, -2.6], [6.35, -4.6], [6.1, -5.6], [5.8, -5.9], [6.1, -6.3], [6.25, -6.9], [5.8, -7.7], [6.0, -8.4], [5.6, -9.6], [4.5, -10.4], [2.6, -11.1], [1.6, -12.0], [1.45, -13.0], [1.35, -14.5], [1.5, -16.5], [1.7, -19.6]];   // кожный профиль лица и шеи
  plate([[-8.4, 2.6]].concat(PROF, [[-8.4, -19.6]]), -1.62, -1.5, M.lat);   // боковая стенка — фон в просветах
  plate(PROF.concat([[0.25, -19.6], [0.35, -15.0], [0.65, -12.4], [0.6, -10.5], [2.0, -10.05], [3.6, -9.6], [3.4, -8.6], [4.1, -6.9], [4.7, -6.0], [4.75, -4.3], [5.5, -2.6], [6.0, -1.6], [6.2, 2.6]]), -0.4, -0.12, M.soft);   // мягкие ткани лица и шеи
  const sept = [[6.2, 2.6], [6.0, -1.6], [5.5, -2.6], [4.6, -2.85], [-0.75, -2.9], [-0.75, -0.25], [0.6, 0.15], [1.25, 0.8], [1.3, 2.6]];
  plate(sept, -1.5, -1.42, M.latF);   // боковая стенка полости носа (перегородка убрана)
  const conM = mphys('#D88A94', { r: 0.5, cc: 0.3, em: 0.1 });
  plate([[4.3, -1.55], [3.0, -1.25], [1.0, -1.3], [-0.4, -1.6], [-0.6, -2.0], [-0.2, -2.35], [1.5, -2.3], [3.5, -2.15], [4.4, -1.9]], -1.42, -1.3, conM, SEC, { n: 40 });   // нижняя раковина
  plate([[3.1, 0.05], [1.8, 0.3], [0.6, 0.15], [-0.2, -0.3], [-0.3, -0.75], [0.4, -0.95], [1.8, -0.85], [3.2, -0.55]], -1.42, -1.3, conM, SEC, { n: 40 });   // средняя раковина
  plate([[1.25, 1.6], [0.9, 1.75], [0.65, 1.3], [0.7, 0.9], [1.2, 1.0]], -1.42, -1.3, conM, SEC, { n: 24 });   // верхняя раковина
  plate([[1.4, 2.6], [1.35, 0.8], [0.6, 0.05], [-0.7, -0.15], [-1.5, -0.2], [-2.5, -0.5], [-3.3, -1.0], [-3.9, -1.75], [-4.6, -1.95], [-5.4, -2.05], [-5.1, -1.2], [-3.7, 0.2], [-2.6, 1.5], [-2.3, 2.6]], -0.3, 0, M.bone, SEC, { holes: [ell(-0.2, 1.45, 0.85, 0.7)] });   // клиновидная кость и скат
  plate([[5.5, -2.6], [4.6, -2.9], [-0.75, -2.95], [-0.8, -3.25], [0.4, -3.55], [2.6, -3.6], [4.1, -3.75], [4.75, -4.3], [5.0, -4.55], [5.45, -4.4], [5.6, -3.4]], -0.3, 0, M.bone);   // твёрдое нёбо и альвеола
  plate([[5.05, -4.45], [5.45, -4.35], [5.62, -5.8], [5.4, -5.85], [5.15, -5.2]], -0.28, 0.01, M.tooth);
  plate([[4.95, -6.4], [5.35, -6.55], [5.5, -7.5], [5.5, -8.7], [5.15, -9.5], [4.4, -9.75], [3.7, -9.5], [3.35, -8.7], [3.5, -7.8], [4.1, -7.0]], -0.3, 0, M.bone, SEC, { n: 40 });   // подбородок (нижняя челюсть)
  plate([[5.0, -6.45], [5.32, -6.55], [5.42, -5.6], [5.25, -5.55]], -0.28, 0.01, M.tooth);
  // позади глотки: мягкие ткани, предпозвоночные мышцы, позвонки, спинной мозг
  const POSTd = dyn(() => { const P = PWnow(); return [[-1.4, -0.15], [-2.4, 2.6], [-8.4, 2.6], [-8.4, -19.6]].concat(P.slice().reverse().map(([z, y]) => [z - 0.4, y])).slice(0); }, -0.4, -0.12, M.soft);
  const PREVd = dyn(() => { const P = PWnow().filter(([, y]) => y < -1.9 && y > -19.5); return P.map(([z, y]) => [z - 0.42, y]).concat([[-5.1, -19.5], [-5.0, -9], [-4.9, -3.0], [-4.6, -1.95]]); }, -0.33, -0.05, M.prev);
  plate(ell(-4.95, -3.6, 0.42, 0.6, 24), -0.3, 0.0, M.bone);
  plate([[-5.6, -2.45], [-6.2, -2.3], [-6.55, -2.8], [-6.6, -4.6], [-5.6, -4.6], [-5.5, -3.0]], -0.3, 0, M.bone);
  plate([[-5.45, -4.6], [-6.75, -4.6], [-6.85, -7.3], [-6.6, -7.6], [-5.2, -7.5], [-5.1, -6.0]], -0.3, 0, M.bone);
  const VB = [[-8.0, -9.6, -5.05], [-10.1, -11.7, -5.0], [-12.2, -13.8, -5.0], [-14.3, -15.9, -5.05], [-16.4, -18.0, -5.15], [-18.5, -20.1, -5.25]];
  VB.forEach(([y0, y1, za]) => plate(rrect(za - 1.65, za, y0, Math.max(y1, -19.6), 0.22), -0.3, 0, M.bone));
  [[-7.55, -8.0, -5.1], ...VB.slice(0, -1).map((v, i) => [v[1], VB[i + 1][0], v[2]])].forEach(([y0, y1, za]) => plate(rrect(za - 1.6, za + 0.05, y0 - 0.02, y1 + 0.02, 0.08), -0.29, -0.01, M.disc));
  plate([[-3.0, 2.6], [-4.0, 1.2], [-5.2, -0.6], [-6.3, -2.4], [-7.0, -4.5], [-7.15, -8], [-7.2, -19.6], [-8.0, -19.6], [-8.0, -8], [-7.9, -4.5], [-7.6, -2.0], [-7.0, 0.2], [-6.4, 2.6]], -0.3, -0.02, M.cord);
  // боковая стенка: валик и устье слуховой трубы, нёбная миндалина и дужки
  plate(ell(-1.95, -1.75, 0.5, 0.62), -1.5, -1.38, M.latF, SEC, { holes: [ell(-1.85, -1.85, 0.22, 0.32, 16)] });
  plate(ribPoly(curvePts([[-2.5, -2.3], [-3.1, -3.2], [-3.55, -4.2]], 10), 0.3, 0.12), -1.5, -1.4, M.latF);   // трубно-глоточная складка
  plate(ribPoly(curvePts([[-1.9, -3.9], [-2.3, -5.0], [-2.45, -6.6]], 10), 0.22, 0.16), -1.5, -1.4, M.latF);   // нёбно-язычная дужка
  plate(ribPoly(curvePts([[-2.6, -3.95], [-3.3, -5.3], [-3.55, -7.0]], 10), 0.22, 0.14), -1.5, -1.4, M.latF);   // нёбно-глоточная дужка
  plate(ell(-2.95, -5.35, 0.4, 0.8), -1.48, -1.34, M.lymph);   // нёбная миндалина
  // окраска отделов (видна в просвете)
  const REGP = {
    naso: [[-0.75, -0.25], [-1.4, -0.15], [-2.4, -0.45], [-3.2, -0.95], [-3.75, -1.7], [-4.0, -2.6], [-4.05, -3.3], [-3.0, -3.45], [-2.0, -3.35], [-0.75, -2.95]],
    oro: [[-1.3, -3.6], [-2.6, -3.45], [-4.05, -3.3], [-4.0, -5.0], [-3.95, -6.5], [-3.95, -7.7], [-2.9, -7.7], [-2.55, -6.6], [-2.3, -5.6], [-1.8, -4.75], [-1.3, -4.3]],
    laryngo: [[-3.95, -7.7], [-4.0, -9.5], [-4.05, -11.0], [-4.1, -12.5], [-4.15, -14.0], [-4.0, -14.8], [-2.75, -14.8], [-2.75, -12.4], [-2.5, -11.6], [-2.6, -9.4], [-2.9, -7.7]],
  };
  const REGMS = {}; Object.entries(REGP).forEach(([k, p]) => { REGMS[k] = plate(p, -1.3, -1.26, REGM[k]); });
  // --- подвижные части
  const palC = (e) => { const R = [[-0.75, -3.2], [-1.5, -3.55], [-2.1, -4.05], [-2.55, -4.7], [-2.75, -5.35]], U = [[-0.75, -3.2], [-1.6, -3.05], [-2.4, -2.8], [-3.1, -2.6], [-3.55, -2.75]]; return curvePts(R.map((p, i) => [p[0] + (U[i][0] - p[0]) * e, p[1] + (U[i][1] - p[1]) * e]), 24); };
  const PALd = dyn(() => ribPoly(palC(SW.pal), 0.78, 0.3), -0.3, 0, M.mus);
  const DOR0 = [[4.75, -5.75], [4.3, -5.05], [3.4, -4.35], [2.4, -3.9], [1.2, -3.72], [0.0, -3.78], [-1.0, -4.1], [-1.8, -4.75], [-2.3, -5.6], [-2.55, -6.6], [-2.55, -7.6], [-2.35, -8.3]];
  const DOR1 = [[4.75, -5.75], [4.3, -4.6], [3.6, -3.75], [2.4, -4.2], [1.2, -4.25], [0.0, -4.05], [-1.0, -4.05], [-1.9, -4.6], [-2.5, -5.5], [-2.8, -6.5], [-2.8, -7.6], [-2.4, -8.3]];
  const DOR2 = [[4.75, -5.75], [4.3, -4.6], [3.6, -3.72], [2.4, -3.6], [1.2, -3.58], [0.0, -3.64], [-1.1, -3.92], [-2.1, -4.5], [-3.0, -5.4], [-3.45, -6.5], [-3.3, -7.7], [-2.5, -8.4]];
  const dorsum = () => DOR0.map((p, i) => { const a = [p[0] + (DOR1[i][0] - p[0]) * SW.t1, p[1] + (DOR1[i][1] - p[1]) * SW.t1]; const z = a[0] + (DOR2[i][0] - a[0]) * SW.t2; return [z, a[1] + (DOR2[i][1] - a[1]) * SW.t2 - (i > 0 ? 0.42 * SW.grv * 1.55 * Math.exp(-((z - SW.bz) ** 2) / 1.2) : 0)]; });
  const TONd = dyn(() => { const [hz, hy] = hyOff(); return curvePts(dorsum(), 50).concat([[-1.6, -8.9], [-0.9 + hz, -9.7 + hy], [0.6 + hz, -9.6 + hy], [2.0, -9.3], [3.0, -8.6], [3.6, -7.6], [4.2, -6.8]]); }, -0.3, 0, M.tongue);
  const ggM = mphys('#A8404C', { r: 0.6, em: 0.08 });
  [2, 4, 6, 8, 9, 10].forEach((k) => dyn(() => { const D = dorsum(), [hz, hy] = hyOff(), O = [3.3, -8.75], E = D[k], T = [O[0] + (E[0] - O[0]) * 0.86, O[1] + (E[1] - O[1]) * 0.86]; return ribPoly(curvePts([O, [O[0] + (T[0] - O[0]) * 0.5 - 0.25, O[1] + (T[1] - O[1]) * 0.5], T], 16), 0.1, 0.2); }, -0.29, 0.004, ggM));   // волокна подбородочно-язычной мышцы
  const LINGd = dyn(() => { const D = curvePts(dorsum().slice(7), 20); return ribPoly(D, 0.28, 0.22).map(([z, y]) => [z + 0.08, y]); }, -0.28, 0.005, M.lymph);
  const ADEN = (() => { const P = PWc.filter(([, y]) => y < -0.25 && y > -2.3); const out = P.map(([z, y], i) => [z, y]); const inn = P.map(([z, y], i) => { const k = Math.sin(Math.PI * i / (P.length - 1)); return [z + (0.55 + 0.08 * Math.sin(i * 1.7)) * k + 0.02, y - 0.12 * k]; }); return out.concat(inn.reverse()); })();
  plate(ADEN, -0.28, 0.0, M.lymph);
  const WALLd = dyn(() => { const P = PWnow().filter(([, y]) => y < -0.1); return P.concat(P.slice().reverse().map(([z, y]) => [z - 0.14, y])); }, -0.3, 0.0, M.muc);
  const MUSd = dyn(() => { const P = PWnow().filter(([, y]) => y < -0.1); return P.map(([z, y]) => [z - 0.13, y]).concat(P.slice().reverse().map(([z, y]) => [z - 0.45, y])); }, -0.3, 0.0, M.wall);
  const UESd = dyn(() => { const P = PWnow().filter(([, y]) => y < -14.2 && y > -15.3), th = 0.38 - 0.2 * SW.ues; return P.map(([z, y]) => [z - 0.12, y]).concat(P.slice().reverse().map(([z, y]) => [z - 0.12 - th, y])); }, -0.29, 0.01, M.ues);
  // пищевод: передняя стенка (задняя — продолжение стенки глотки)
  const ESOd = dyn(() => { const [lz, ly] = larOff(); const top = -14.85 + ly, Y = []; for (let y = top; y >= -19.6; y -= 0.25) Y.push(y); const op = (y) => (SW.bOn && SW.by < -13.4 ? 0.75 * bump(y, SW.by, 1.1) : 0); return Y.map((y) => [-3.15 + op(y) + lz * fTr(y), y]).concat(Y.slice().reverse().map((y) => [-2.35 + lz * fTr(y), y])); }, -0.3, 0, M.wall);
  // трахея (неподвижная часть)
  const fTr = (y) => cl((y + 19.6) / (4.75 + larOff()[1]));   // доля смещения гортани: 1 у перстневидного хряща, 0 у нижнего края
  const trW = (z0, z1) => () => { const [lz, ly] = larOff(), Y = []; for (let y = -14.85 + ly; y >= -19.6; y -= 0.3) Y.push(y); Y.push(-19.6); return Y.map((y) => [z0 + lz * fTr(y), y]).concat(Y.slice().reverse().map((y) => [z1 + lz * fTr(y), y])); };
  dyn(trW(-0.05, 0.3), -0.32, -0.02, M.memb); dyn(trW(-2.35, -2.05), -0.3, 0, M.memb);
  const TRR = []; for (let k = 0; k < 6; k++) { const y = -15.3 - 0.75 * k; TRR.push([plate(rrect(-0.1, 0.38, y, y - 0.42, 0.12), -0.3, 0.0, M.cart), y - 0.2]); }
  TRR.push([plate(ell(0.85, -16.5, 0.45, 0.75), -0.3, -0.02, M.thy), -16.5]);   // перешеек щитовидной железы
  DYN.push({ upd: () => { const [lz, ly] = larOff(); TRR.forEach(([ms, y0]) => { const f = fTr(y0); ms.position.set(0, ly * f, lz * f); }); } });
  // гортань (группа LAR)
  plate([[0.15, -10.95], [0.45, -11.5], [0.55, -12.4], [0.35, -13.4], [0.05, -13.55], [-0.15, -13.3], [-0.1, -11.2]], -0.3, 0.02, M.cart, LAR);
  plate([[-0.1, -13.55], [0.05, -13.55], [0.2, -13.95], [-0.2, -14.05]], -0.29, 0.01, M.memb, LAR);
  plate([[0.2, -13.95], [0.3, -14.4], [0.1, -14.75], [-0.25, -14.65], [-0.2, -14.05]], -0.3, 0.02, M.cart, LAR);
  plate([[-2.0, -12.5], [-2.35, -12.3], [-2.7, -12.5], [-2.8, -14.6], [-2.5, -14.85], [-2.05, -14.75], [-1.95, -13.6]], -0.3, 0.02, M.cart, LAR, { n: 30 });
  plate([[-2.05, -12.45], [-2.6, -12.3], [-2.55, -11.65], [-2.35, -11.4], [-2.15, -11.8]], -0.3, 0.02, M.cart, LAR);
  plate([[-2.75, -12.3], [-2.95, -12.5], [-2.95, -14.7], [-2.55, -14.95], [-2.8, -14.6], [-2.7, -12.5]], -0.3, 0.02, M.muc, LAR);   // слизистая на задней поверхности гортани
  plate([[-1.6, -8.9], [-0.9, -9.7], [-0.4, -10.6], [-0.1, -11.2], [-0.6, -11.5], [-1.15, -11.3], [-1.6, -10.4], [-1.95, -9.6]], -0.32, -0.01, M.fat, LAR);   // преднадгортанниковая клетчатка
  plate(ribPoly(curvePts([[-0.1, -12.65], [-1.0, -12.62], [-2.05, -12.55]], 12), 0.24, 0.2), -1.45, -1.3, M.vf, LAR);
  plate(ribPoly(curvePts([[-0.15, -12.1], [-1.1, -12.05], [-2.2, -11.95]], 12), 0.2, 0.16), -1.45, -1.3, M.latF, LAR);
  plate(ribPoly(curvePts([[-2.45, -8.9], [-2.6, -10.2], [-2.5, -11.5]], 12), 0.26, 0.2), -0.9, -0.75, M.muc, LAR);   // черпалонадгортанная складка
  const vfC = mphys('#F2EEE6', { r: 0.4, cc: 0.4, em: 0.14, op: 0 }); const VFC = plate(ribPoly(curvePts([[-0.1, -12.65], [-1.0, -12.62], [-2.05, -12.55]], 12), 0.26, 0.22), -0.3, 0.04, vfC, LAR);   // сомкнутые голосовые складки на срезе
  plate([[-0.75, -10.6], [-0.35, -10.65], [0.15, -10.95], [-0.1, -11.2], [-0.55, -11.0]], -0.29, 0.0, M.memb, HYO);   // щитоподъязычная мембрана (тянется с костью)
  plate(ell(-0.25, -10.28, 0.72, 0.3, 24), -0.3, 0.02, M.bone, HYO);   // тело подъязычной кости
  const GENd = dyn(() => { const [hz, hy] = hyOff(); return [[3.45, -9.05], [3.55, -9.5], [0.45 + hz, -10.5 + hy], [0.5 + hz, -9.95 + hy]]; }, -0.3, -0.01, M.mus);
  // надгортанник: изгибается при глотании
  const EPI0 = [[-0.75, -11.45], [-1.2, -11.0], [-1.65, -10.3], [-2.05, -9.5], [-2.4, -8.6], [-2.7, -7.9], [-2.9, -7.55]];
  let epiP = [-2.4, -8.6];
  const EPId = dyn(() => { const [lz, ly] = larOff(), th = SW.epi * Math.PI * 0.5, pv = EPI0[2]; const C = EPI0.map((p, i) => { const a = th * cl((i - 1.5) / 3); const dz = p[0] - pv[0], dy = p[1] - pv[1]; return i < 2 ? p : [pv[0] + dz * Math.cos(a) - dy * Math.sin(a), pv[1] + dz * Math.sin(a) + dy * Math.cos(a)]; }); epiP = [C[4][0] + lz, C[4][1] + ly]; return ribPoly(curvePts(C, 26).map(([z, y]) => [z + lz, y + ly]), 0.3, 0.14); }, -0.3, 0.03, M.elast);
  // комок пищи
  const BOLd = dyn(() => { const a = SW.bAng, L = (1.05 - 0.15 * cl((SW.bW - 0.3) / 0.25)) * SW.bLen, W = SW.bW / Math.sqrt(SW.bLen); return Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * 2 * Math.PI, u = L * Math.cos(t), v = W * Math.sin(t); return [SW.bz + u * Math.cos(a) - v * Math.sin(a), SW.by + u * Math.sin(a) + v * Math.cos(a)]; }); }, -0.25, 0.06, M.bolus);
  // пути воздуха и пищи
  const PATHS = new THREE.Group(); SEC.add(PATHS);
  const pathMesh = (P, col) => { const c = new THREE.CatmullRomCurve3(P.map(([z, y]) => V3(0.14, y, z)), false, 'centripetal'); const m = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, depthTest: false }); const t = new THREE.Mesh(new THREE.TubeGeometry(c, 120, 0.12, 8), m); t.renderOrder = 5; PATHS.add(t); const e = c.getPointAt(1), d = c.getTangentAt(1); const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 12), m); cone.position.copy(e); cone.quaternion.setFromUnitVectors(V3(0, 1, 0), d); cone.renderOrder = 5; PATHS.add(cone); return c; };
  pathMesh([[6.2, -1.0], [3.5, -0.9], [0.8, -1.2], [-1.4, -1.6], [-2.9, -2.6], [-3.35, -4.6], [-3.3, -6.8], [-2.95, -8.9], [-2.2, -10.8], [-1.2, -12.4], [-1.05, -14.5], [-1.0, -18.6]], 0x7fc4ff);
  pathMesh([[5.7, -5.95], [4.4, -4.6], [2.4, -4.05], [0.0, -4.05], [-1.8, -4.85], [-3.0, -5.8], [-3.55, -7.6], [-3.6, -10.0], [-3.55, -12.6], [-3.35, -15.0], [-3.2, -18.6]], 0xffb050);

  // =================== МЫШЦЫ (режим 2): скан черепа + трубка глотки ===================
  const MUS = new THREE.Group(); scene.add(MUS);
  const KS = 12.5, MX = 0.11;
  const SK = new THREE.Group(); SK.scale.setScalar(KS); SK.position.set(-MX * KS, -16 * KS, -0.6 * KS); MUS.add(SK);
  const skM = new THREE.MeshPhysicalMaterial({ clippingPlanes: [new THREE.Plane(V3(0, -1, 0), 0.8), new THREE.Plane(V3(-1, 0, 0), 6.8), new THREE.Plane(V3(1, 0, 0), 6.8)], color: 0xE8DCC8, roughness: 0.65, clearcoat: 0.1, emissive: 0x4a4236, transparent: true, opacity: 0.4, depthWrite: false, side: THREE.FrontSide });
  const PWO = (y) => pwZ(y) - 0.45;
  const AW = [[0, 1.4], [-1.5, 1.7], [-4, 1.9], [-8, 2.0], [-10, 2.15], [-12, 2.0], [-13.2, 1.78], [-14.2, 1.38], [-15.2, 1.08], [-16, 1.0], [-19.6, 1.0]];
  const BW = [[0, 1.2], [-3, 1.5], [-12, 1.5], [-14.2, 1.3], [-15.2, 1.0], [-16, 0.9], [-19.6, 0.9]];
  const tubeP = (y, th, sd, off) => { const a = lerpT(AW, y), b = lerpT(BW, y), z0 = PWO(y); const nx = sd * Math.sin(th) / a, nz = -Math.cos(th) / b, nl = Math.hypot(nx, nz) || 1; return V3(sd * a * Math.sin(th) + nx / nl * off, y, z0 + b * (1 - Math.cos(th)) + nz / nl * off); };
  const MMAT = {}; PH_MUS.forEach((m) => { MMAT[m.id] = mphys(m.col, { side: THREE.DoubleSide, r: 0.5, cc: 0.3, em: 0.12, vc: true }); });
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => V3(a[0], a[1], a[2])), false, 'centripetal');
  const CDEF = {
    sup: { yR: (v) => -1.1 - 4.9 * v, A: cr3([[1.35, -1.5, -0.9], [1.45, -2.6, -0.7], [2.1, -4.6, -0.45], [2.5, -6.9, -0.6]]), off: 0.0, nv: 26 },
    mid: { yR: (v) => -3.8 - 7.8 * v, A: cr3([[1.3, -9.3, -1.0], [1.7, -9.75, -1.7], [2.0, -9.85, -2.4]]), off: 0.15, nv: 26 },
    inf: { yR: (v) => (v < 0.78 ? -8.8 - 5.4 * v / 0.78 : null), A: cr3([[2.0, -10.9, -0.8], [2.15, -12.4, -0.7], [1.9, -13.5, -0.9], [1.35, -14.3, -1.3], [1.2, -14.85, -1.4], [1.1, -15.35, -1.45]]), off: 0.3, nv: 32, cp: 0.78 },
  };
  const CMS = {};
  function buildCon(id) {
    const d = CDEF[id], NT = 26, NV = d.nv, meshes = [];
    [-1, 1].forEach((sd) => {
      const pos = [], col = [], idx = [];
      for (let j = 0; j <= NV; j++) {
        const v = j / NV, A0 = d.A.getPoint(v), A = V3(sd * A0.x, A0.y, A0.z), yR = d.yR(v) ?? A.y;
        for (let i = 0; i <= NT; i++) {
          const t = i / NT; let p;
          if (t <= 0.8) { const f = t / 0.8, y = yR + (A.y - yR) * sm(f); p = tubeP(y, f * Math.PI / 2, sd, d.off + 0.12 * (1 - f) * 0); }
          else { const S = tubeP(A.y, Math.PI / 2, sd, d.off); p = S.lerp(A, (t - 0.8) / 0.2); }
          pos.push(p.x, p.y, p.z); const k = (j % 2 ? 0.74 : 1) * (d.cp && v > d.cp ? 0.8 : 1); col.push(k, k, k);
        }
      }
      for (let j = 0; j < NV; j++) for (let i = 0; i < NT; i++) { if (d.cp) { const vm = (j + 0.5) / NV, tm = (i + 0.5) / NT; if (vm > 0.58 && vm < d.cp && tm < 0.025 + 0.15 * (vm - 0.58) / (d.cp - 0.58)) continue; } /* треугольник Киллиана */ const a = j * (NT + 1) + i, b = a + NT + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
      const ms = new THREE.Mesh(g, MMAT[id]); ms.userData.pick = id; MUS.add(ms); meshes.push(ms); pick.push(ms);
    });
    CMS[id] = meshes;
  }
  const pick = [];
  ['sup', 'mid', 'inf'].forEach(buildCon);
  // фасция и слизистая под констрикторами (видны в треугольнике Киллиана)
  { const pos = [], idx = [], NU = 40, NW = 30; for (let j = 0; j <= NW; j++) { const y = -0.9 - 14.6 * j / NW; for (let i = 0; i <= NU; i++) { const th = (i / NU * 2 - 1) * Math.PI / 2, p = tubeP(y, Math.abs(th), th < 0 ? -1 : 1, -0.07); pos.push(p.x, p.y, p.z); } }
    for (let j = 0; j < NW; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + NU + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); MUS.add(new THREE.Mesh(g, mphys('#D89098', { r: 0.6, em: 0.08, side: THREE.DoubleSide }))); }
  // продольные: шилоглоточная (снаружи — между верхним и средним констрикторами)
  const tube = (pts, r, m, parent = MUS) => { const ms = new THREE.Mesh(new THREE.TubeGeometry(cr3(pts), 40, r, 10), m); parent.add(ms); return ms; };
  [-1, 1].forEach((sd) => {
    const P = [[3.7, -2.4, -4.6], [3.1, -4.4, -3.9], [2.45, -6.2, -3.25], [2.2, -7.6, -2.85], [2.1, -9.6, -2.35], [2.0, -11.2, -1.95]].map(([x, y, z]) => [sd * x, y, z]);
    const ms = tube(P, 0.25, MMAT.long); ms.userData.pick = 'long'; pick.push(ms);
    tube([[sd * 3.9, -2.0, -4.8], [sd * 3.5, -3.6, -4.3], [sd * 3.05, -5.0, -3.8]], 0.11, mphys('#E8DCC8', { r: 0.7, em: 0.06 }));   // шиловидный отросток
    tube([[sd * 1.45, -2.6, -0.7], [sd * 2.1, -4.6, -0.45], [sd * 2.5, -6.9, -0.6]], 0.05, mphys('#F2EEE6', { em: 0.2 }));   // крылонижнечелюстной шов
  });
  // шов глотки
  { const P = []; for (let y = -1.1; y >= -14.0; y -= 0.5) { const p = tubeP(y, 0, 1, 0.42); P.push([p.x, p.y, p.z]); } tube(P, 0.05, mphys('#F2EEE6', { em: 0.25 })); }
  // подъязычная кость, щитовидный и перстневидный хрящи, трахея, пищевод
  const hyM = mphys('#E8DCC8', { r: 0.7, em: 0.08 }), carM = mphys('#BFD8E8', { r: 0.45, cc: 0.4, em: 0.12, side: THREE.DoubleSide });
  tube([[-2.0, -9.85, -2.4], [-1.7, -9.8, -1.6], [-1.2, -10.1, -0.4], [-0.6, -10.3, 0.2], [0, -10.35, 0.38], [0.6, -10.3, 0.2], [1.2, -10.1, -0.4], [1.7, -9.8, -1.6], [2.0, -9.85, -2.4]], 0.2, hyM);
  const surf = (fn, nu, nv, m) => { const pos = [], idx = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = fn(i / nu, j / nv); pos.push(p.x, p.y, p.z); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + nu + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const ms = new THREE.Mesh(g, m); MUS.add(ms); return ms; };
  [-1, 1].forEach((sd) => surf((u, w) => { const x = sd * 2.05 * u, z = 0.45 - 2.45 * u + 0.35 * Math.sin(Math.PI * u); const yt = -11.1 + 0.25 * u - 0.35 * Math.exp(-u * 12) + (u > 0.85 ? 0.9 * (u - 0.85) / 0.15 : 0), yb = -13.45 + 0.25 * u - (u > 0.85 ? 0.7 * (u - 0.85) / 0.15 : 0); return V3(x, yt + (yb - yt) * w, z); }, 18, 8, carM));
  surf((u, w) => { const ph = (u - 0.5) * 2 * Math.PI, f = (1 - Math.cos(ph)) / 2, yt = -13.95 + 1.5 * f * f, yb = -14.75 - 0.1 * f; return V3(1.15 * Math.sin(ph), yt + (yb - yt) * w, -1.05 + 1.3 * Math.cos(ph)); }, 36, 6, carM);
  surf((u, w) => { const ph = u * 2 * Math.PI; return V3(1.0 * Math.sin(ph), -14.85 - 3.75 * w, -1.0 + 1.0 * Math.cos(ph)); }, 32, 10, mphys('#C8D8E4', { r: 0.5, em: 0.08, side: THREE.DoubleSide, op: 0.85 }));
  for (let k = 0; k < 5; k++) { const tg = new THREE.TorusGeometry(1.03, 0.07, 6, 36, Math.PI * 1.6); tg.rotateZ(-0.3 * Math.PI); const tr = new THREE.Mesh(tg, carM); tr.rotation.x = Math.PI / 2; tr.position.set(0, -15.3 - 0.75 * k, -1.0); MUS.add(tr); }
  const esoM = mphys('#C85A64', { r: 0.55, em: 0.1, side: THREE.DoubleSide });
  surf((u, w) => { const ph = u * 2 * Math.PI, y = -14.4 - 4.2 * w; return V3(0.85 * Math.sin(ph), y, -3.25 - 0.72 * Math.cos(ph)); }, 32, 10, esoM);

  // =================== загрузка скана ===================
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    const isSpine = (i) => { const x = (P.getX(i) - MX) * KS, y = (P.getY(i) - 16) * KS, z = (P.getZ(i) - 0.6) * KS; return y < -1.6 && z < -4.4 && Math.abs(x) < 4.6; };
    const Y = (i) => (P.getY(i) - 16) * KS;
    for (let t = 0; t < IX.length; t += 3) if (!(isSpine(IX[t]) && isSpine(IX[t + 1]) && isSpine(IX[t + 2])) && Math.min(Y(IX[t]), Y(IX[t + 1]), Y(IX[t + 2])) < 3.0) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = 2; SK.add(ms);
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
    st.loaded = true;
  }).catch(() => { st.loaded = true; });

  // =================== обновление ===================
  let lastS = -1;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly && st.mode === 'mus'; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const M1 = st.mode === 'sec', M2 = st.mode === 'mus', M3 = st.mode === 'sw';
    SEC.visible = M1 || M3; MUS.visible = M2; sideL.intensity = M2 ? 0.8 : 0.35; PATHS.visible = M1 && st.paths;
    if (M3 && st.play) { st.s = (st.s + dt / 4.2) % 1; refs.syncS && refs.syncS(); }
    const s = M3 ? st.s : 0;
    if (s !== lastS) { lastS = s; swState(s); DYN.forEach((d) => d.upd()); const [lz, ly] = larOff(), [hz, hy] = hyOff(); LAR.position.set(0, ly, lz); HYO.position.set(0, hy, hz); BOLd.ms.visible = SW.bOn > 0; setOp(vfC, cl((SW.lar - 0.35) / 0.3)); VFC.visible = SW.lar > 0.36; M.ues.emissiveIntensity = 0.2 + 0.5 * SW.ues; const ph = phaseOf(s); if (ph !== st.ph) { st.ph = ph; refs.setInfo && refs.setInfo(); } }
    Object.entries(REGMS).forEach(([k, ms]) => { ms.visible = M1; const on = !st.reg || st.reg === k; setOp(REGM[k], st.reg === k ? 0.62 : on ? 0.3 : 0.08); });
    if (M2) {
      const wv = st.wave ? (st.t / 2.4) % 1 : -1;
      PH_MUS.forEach((m, i) => { const mt = MMAT[m.id], on = !st.msel || st.msel === m.id, a = wv < 0 ? 0 : Math.max(0, 1 - Math.abs(wv - (i === 3 ? 0.2 : i * 0.3 + 0.12)) / 0.16); mt.emissiveIntensity = mt.userData.em0 + 0.7 * a + (st.msel === m.id ? 0.18 : 0); setOp(mt, on ? 1 : 0.18); });
    }
  }
  const phaseOf = (s) => { let k = 0; PH_PHASE.forEach(([a], i) => { if (s >= a) k = i; }); return k; };
  function setMode(m) { st.mode = m; const lim = m === 'mus' ? Infinity : 0.75; controls.minAzimuthAngle = m === 'mus' ? -Infinity : Math.PI / 2 - lim; controls.maxAzimuthAngle = m === 'mus' ? Infinity : Math.PI / 2 + lim; st.fly = m === 'mus' && st.back ? VIEW.back : VIEW[m]; if (m !== 'sw') st.play = false; refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setReg(id) { st.reg = id === 'all' || st.reg === id ? null : id; refs.rseg && refs.rseg.sync(); refs.setInfo && refs.setInfo(); }
  function setMus(id) { st.msel = id === 'all' || st.msel === id ? null : id; refs.mseg && refs.mseg.sync(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => pick, (id) => { if (st.mode === 'mus') setMus(id); });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const sec = () => st.mode === 'sec', sw = () => st.mode === 'sw', mus = () => st.mode === 'mus';
  const sp = (z, y) => V3(0.25, y, z), lp = (z, y) => () => V3(0.25, y + LAR.position.y, z + LAR.position.z);
  const regOn = (k) => () => sec() && (!st.reg || st.reg === k);
  const mOn = (k) => () => mus() && (!st.msel || st.msel === k);
  const labels = [
    lb('носоглотка', sp(-2.75, -1.95), '#9CD0FF', regOn('naso')),
    lb('ротоглотка', sp(-3.3, -5.8), '#A8E8BC', regOn('oro')),
    lb('гортаноглотка', sp(-3.5, -11.2), '#DCC0FF', regOn('laryngo')),
    lb('глоточная миндалина', sp(-2.9, -0.75), '#E8B8DC', () => sec() && (!st.reg || st.reg === 'naso') && DK),
    lb('хоаны', sp(-0.8, -1.0), '#E8DCC8', () => sec() && (!st.reg || st.reg === 'naso') && DK, true),
    lb('клиновидная пазуха', sp(-0.2, 1.45), '#E8DCC8', () => sec() && !st.reg && DK, true),
    lb('спинной мозг', sp(-7.6, -9.0), '#E3D9B6', () => sec() && !st.reg && DK),
    lb('устье слуховой трубы', V3(-1.2, -1.85, -1.85), '#E8C8D0', () => sec() && (!st.reg || st.reg === 'naso'), true),
    lb('мягкое нёбо', sp(-1.4, -3.45), '#F0A0A8', () => (sec() && (!st.reg || st.reg === 'naso' || st.reg === 'oro')) || sw(), true),
    lb('твёрдое нёбо', sp(3.2, -3.2), '#E8DCC8', () => sec() && !st.reg && DK, true),
    lb('нёбная миндалина', V3(-1.2, -5.35, -2.95), '#E8B8DC', () => sec() && ((!st.reg && DK) || st.reg === 'oro'), true),
    lb('носовые раковины', V3(-1.2, -1.85, 2.2), '#F0B8C0', () => sec() && !st.reg && DK, true),
    lb('язык', sp(1.6, -6.9), '#F0A0A8', () => (sec() && !st.reg && DK) || sw(), true),
    lb('надгортанник', () => V3(0.25, epiP[1], epiP[0]), '#F0E4A0', () => sec() || sw()),
    lb('подъязычная кость', () => V3(0.25, -10.3 + HYO.position.y, -0.2 + HYO.position.z), '#E8DCC8', () => sec() && (!st.reg || st.reg === 'laryngo'), true),
    lb('щитовидный хрящ', lp(0.35, -12.4), '#CFE3F0', () => sec() && (!st.reg || st.reg === 'laryngo') && DK, true),
    lb('голосовая складка', lp(-1.0, -12.62), '#F2EEE6', () => sec() && ((!st.reg && DK) || st.reg === 'laryngo')),
    lb('перстневидный хрящ', lp(-2.4, -14.1), '#CFE3F0', () => sec() && (!st.reg || st.reg === 'laryngo') && DK),
    lb('трахея', sp(-1.0, -17.6), '#CFE3F0', () => sec() && !st.reg, true),
    lb('пищевод', sp(-2.75, -18.0), '#F0A0A8', () => (sec() && !st.reg) || (sw() && (st.s < 0.66 || st.s > 0.95))),
    lb('позвонок C2', sp(-6.0, -5.3), '#E8DCC8', () => sec() && !st.reg && DK),
    lb('позвонок C6', sp(-5.9, -15.1), '#E8DCC8', () => sec() && !st.reg && DK),
    lb('верхний пищеводный сфинктер', () => V3(0.25, -14.7, pwZ(-14.7) - 0.3), '#F09080', () => (sw() && DK) || (sec() && st.reg === 'laryngo')),
    lb('комок пищи', () => V3(0.3, SW.by - 0.25, SW.bz), '#FFD08A', () => sw() && SW.bOn > 0 && st.s > 0.2 && st.s < 0.7),
    lb('верхний констриктор', () => tubeP(-3.6, 0.7, -1, 0.1), '#F08890', mOn('sup')),
    lb('средний констриктор', () => tubeP(-8.0, 0.8, -1, 0.25), '#F8B080', mOn('mid')),
    lb('нижний констриктор', () => tubeP(-12.0, 0.75, -1, 0.4), '#F0D880', mOn('inf')),
    lb('перстнеглоточная часть', () => tubeP(-14.65, 0.9, -1, 0.4), '#F0D880', () => mus() && (st.msel === 'inf' || (st.back && !st.msel))),
    lb('шилоглоточная мышца', V3(-2.9, -5.2, -3.6), '#80E0D0', mOn('long')),
    lb('шиловидный отросток', V3(-3.6, -3.4, -4.4), '#E8DCC8', () => mus() && (st.msel === 'long' || !st.msel) && DK),
    lb('шов глотки', () => tubeP(-6.0, 0, 1, 0.45), '#F2EEE6', () => mus() && st.back && !st.msel, true),
    lb('треугольник Киллиана', () => tubeP(-14.05, 0.12, 1, 0.45), '#F2EEE6', () => mus() && st.back && (!st.msel || st.msel === 'inf'), true),
    lb('пищевод', V3(-0.9, -17.8, -3.6), '#F0A0A8', () => mus() && !st.msel),
    lb('крылонижнечелюстной шов', V3(-2.1, -4.6, -0.45), '#F2EEE6', () => mus() && !st.back && st.msel === 'sup', true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>Глотка</b> — мышечная трубка длиной 12–14 см от основания черепа до VI шейного позвонка. Спереди она открыта в полость носа, рта и гортани, поэтому делится на носо-, рото- и гортаноглотку. В ротоглотке пути воздуха и пищи перекрещиваются. Выберите отдел.';
  const PATHT = '<b>Перекрёст путей.</b> Воздух (голубой) идёт из носа через носоглотку и ротоглотку вперёд, в гортань и трахею. Пища (оранжевая) — из рта назад, в гортаноглотку и пищевод, который лежит позади трахеи. Пути пересекаются в ротоглотке, поэтому при глотании дыхание на миг прерывается.';
  const INTRO2 = '<b>Мышцы глотки.</b> Снаружи — три констриктора, вложенные друг в друга, как стопка стаканов: нижний прикрывает средний, средний — верхний. Изнутри — продольные мышцы. Иннервация — IX и X пары через глоточное сплетение (шилоглоточная — только IX). Включите «Волну» или выберите мышцу; вид сзади — без позвоночника.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'sw') { ib.info.innerHTML = PH_PHASE[phaseOf(st.s)][2]; return; }
      if (st.mode === 'mus') { ib.info.innerHTML = st.msel ? PH_MUS.find((m) => m.id === st.msel).text : INTRO2; return; }
      ib.info.innerHTML = st.reg ? PH_REG.find((r) => r.id === st.reg).text : st.paths ? PATHT : INTRO;
    };
    refs.modeSeg = seg([{ id: 'sec', label: 'Отделы' }, { id: 'mus', label: 'Мышцы' }, { id: 'sw', label: 'Глотание' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.rseg = refs.mseg = refs.syncS = null;
      if (st.mode === 'sec') {
        refs.rseg = seg([{ id: 'all', label: 'Все' }, ...PH_REG.map((r) => ({ id: r.id, label: r.name, color: r.col }))], () => st.reg || 'all', (v) => setReg(v));
        box.append(h('div', { class: 'glabel' }, 'Отдел'), h('div', { class: 'gctl' }, refs.rseg));
        view.append(toggle('Пути воздуха и пищи', () => st.paths, (v) => { st.paths = v; refs.setInfo(); }));
      } else if (st.mode === 'mus') {
        refs.mseg = seg([{ id: 'all', label: 'Все' }, ...PH_MUS.map((m) => ({ id: m.id, label: m.name, color: m.col }))], () => st.msel || 'all', (v) => setMus(v));
        box.append(h('div', { class: 'glabel' }, 'Мышцы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.mseg));
        view.append(toggle('Вид сзади', () => st.back, (v) => { st.back = v; st.fly = v ? VIEW.back : VIEW.mus; }), toggle('Волна', () => st.wave, (v) => { st.wave = v; }), refs.rot);
      } else {
        const rg = range('phS', 0, 1, 0.005, () => st.s, (v) => { st.s = v; st.play = false; refs.playT && refs.playT.sync(); }, (v) => PH_PHASE[phaseOf(v)][1]);
        refs.syncS = () => { const r = rg.querySelector ? rg.querySelector('input') : null; if (r) r.value = st.s; const o = rg.querySelector ? rg.querySelector('output, .val, span:last-child') : null; if (o) o.textContent = PH_PHASE[phaseOf(st.s)][1]; };
        box.append(h('div', { class: 'glabel' }, 'Ход глотания'), h('div', { class: 'gctl' }, rg));
        refs.playT = toggle('Пуск', () => st.play, (v) => { st.play = v; }); view.append(refs.playT);
      }
      view.append(refs.lab);
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'Вид', h('kbd', {}, 'N · Space')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['sec', 'mus', 'sw'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'sec') setReg('all'); else if (st.mode === 'mus') setMus('all'); return true; }
    if (e.key === ' ' && st.mode === 'sw' && refs.playT) { refs.playT.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'r' || k === 'к') && st.mode === 'mus') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'sw') return [['Фаза', PH_PHASE[phaseOf(st.s)][1], ''], ['Дыхание', SW.lar > 0.15 ? 'пауза' : 'идёт', '']];
    if (st.mode === 'mus') return [['Констрикторов', 3, 'пары'], ['Нервы', 'IX, X', '']];
    return [['Длина глотки', '12–14', 'см'], ['Отделов', 3, '']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'sec' ? (st.reg ? PH_REG.find((r) => r.id === st.reg).col : '#7FD39A') : st.mode === 'mus' ? (st.msel ? PH_MUS.find((m) => m.id === st.msel).col : '#E8505E') : '#E0A458'; },
    kicker: 'Тело · системы органов', title: 'Глотка и глотание',
    lede: 'Глотка — перекрёсток: через неё идут и воздух, и пища. За секунду глотания мягкое нёбо закрывает нос, надгортанник — гортань, дыхание замирает, а три мышцы-констриктора волной проталкивают комок в пищевод.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Глотка — мышечная трубка позади полостей носа, рта и гортани. Её стенка состоит из слизистой оболочки, фиброзного слоя (глоточно-базилярной фасции) и мышц: снаружи — три констриктора, изнутри — продольные мышцы. Сзади от неё — рыхлое заглоточное пространство и предпозвоночные мышцы.</p>
        <p>Вход в глотку окружает лимфоидное кольцо Пирогова — Вальдейера: глоточная и трубные миндалины вверху, нёбные по бокам, язычная внизу. Они первыми встречают микробы из воздуха и пищи.</p></div>
      <div><h2>Как это работает</h2>
        <p>Мы глотаем 500–1000 раз в сутки, в том числе во сне. Ротовая фаза произвольная, глоточная и пищеводная идут рефлекторно: центр глотания в продолговатом мозге по очереди включает мышцы и на это время выключает вдох.</p>
        <p>Чтобы пища не попала в нос и гортань, работают четыре «затвора»: мягкое нёбо, надгортанник, черпалонадгортанные складки и сомкнутые голосовые складки. Подъём гортани под корень языка добавляет защиты и открывает верхний пищеводный сфинктер.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Дисфагия</b> — нарушение глотания после инсульта, при болезни Паркинсона и миастении; опасна аспирацией — попаданием пищи в дыхательные пути и пневмонией.</li>
        <li><b>Аденоиды</b> — увеличенная глоточная миндалина у детей: затруднённое носовое дыхание, храп, отиты из-за закрытия устьев слуховых труб.</li>
        <li><b>Ангина (тонзиллит)</b> — воспаление нёбных миндалин; паратонзиллярный абсцесс сдвигает язычок в здоровую сторону.</li>
        <li><b>Дивертикул Ценкера</b> — выпячивание слизистой через треугольник Киллиана над перстнеглоточной частью: срыгивание непереваренной пищей, неприятный запах изо рта.</li>
        <li><b>Приём Геймлиха</b> — при закупорке гортани куском пищи толчки в верхнюю часть живота выталкивают его током воздуха из лёгких.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Режимы 1 и 3 — схематичный срединный разрез головы и шеи (правая половина, вид изнутри): ткани упрощены, слизистая не показана целиком; боковая стенка просвета — тёмный фон, миндалина, устье трубы и носовые раковины на ней — без перспективы; перегородка носа убрана. Срез ограничен основанием черепа, профиль лица и шеи условен.</li><li>Режим 2: позвоночник убран, череп полупрозрачный, его свод срезан; подъязычная кость и хрящи гортани упрощены и почти скрыты мышцами; мышцы — тонкие листы на условной трубке глотки, нёбно-глоточная и трубно-глоточная мышцы внутри не показаны.</li><li>Глотание замедлено примерно в 4 раза; движения нёба, языка, гортани и надгортанника — средние, форма и размер комка схематичны, грушевидные карманы (по ним комок обходит вход в гортань) не показаны.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>Space</code> пуск глотания · <code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  { const RR = 4.2, cz = -8.4 + RR, cy = 2.6 - RR, CLP = [new THREE.Plane(V3(0, 1, 0), 19.5)];
    [0.2, 0.45, 0.7, 0.95, 1.2, 1.37].forEach((th) => CLP.push(new THREE.Plane(V3(0, -Math.sin(th), Math.cos(th)), RR - Math.cos(th) * cz + Math.sin(th) * cy)));
    const seen = new Set(); SEC.traverse((o) => { if (o.material && !seen.has(o.material)) { seen.add(o.material); o.material.clippingPlanes = CLP; } }); }
  setMode('sec'); st.fly = null; camera.position.copy(VIEW.sec.pos); controls.target.copy(VIEW.sec.target);
  swState(0); DYN.forEach((d) => d.upd());
  return self;
}
