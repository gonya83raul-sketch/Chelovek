// @scene neck makeNeck | Шея | @body Опора и движение
/* =========================================================
   ТЕЛО · ШЕЯ: мышцы, треугольники, сосуды и нервы, фасции на поперечном разрезе.
   Сверено с атласом Неттера (табл. 32–41). Единица ≈ 1 см; y вверх (0 — яремная вырезка грудины), z вперёд, x — влево от человека.
   Поверхностные мышцы и треугольники лежат на упрощённой поверхности шеи sp(θ, y, d): θ = 0 спереди, ±π/2 сбоку, π сзади; d — глубина.
   ========================================================= */
const NK_MUS = [
  { id: 'scm', name: 'Грудино-ключично-сосцевидная', col: '#E8735F', text: '<b>Грудино-ключично-сосцевидная мышца</b> идёт от рукоятки грудины и ключицы к сосцевидному отростку за ухом и делит шею на передний и задний треугольники. Одна поворачивает лицо в противоположную сторону и наклоняет голову к своему плечу, обе вместе сгибают шею. Иннервация — добавочный нерв.' },
  { id: 'trap', name: 'Трапециевидная', col: '#D9667E', text: '<b>Трапециевидная мышца</b> (верхняя часть) — от затылочной кости и выйной связки к наружной трети ключицы, акромиону и ости лопатки. Поднимает плечи, запрокидывает голову. Её передний край — задняя граница заднего треугольника. Иннервация — добавочный нерв.' },
  { id: 'infra', name: 'Подподъязычные', col: '#F2A07A', text: '<b>Подподъязычные мышцы</b> — плоские ленты спереди: грудино-подъязычная, грудино-щитовидная, щитоподъязычная и лопаточно-подъязычная (два брюшка, между ними сухожилие под грудино-ключично-сосцевидной). Опускают подъязычную кость и гортань после глотания. Нервы — шейная петля (C1–C3).' },
  { id: 'supra', name: 'Надподъязычные', col: '#E8B860', text: '<b>Надподъязычные мышцы</b> — двубрюшная (переднее брюшко от подбородка, заднее от сосцевидного отростка, сухожилие у подъязычной кости) и челюстно-подъязычная — дно полости рта. Поднимают подъязычную кость и гортань при глотании, помогают открывать рот.' },
  { id: 'scal', name: 'Лестничные', col: '#D88AB0', text: '<b>Лестничные мышцы</b> — передняя, средняя и задняя: от поперечных отростков шейных позвонков к I и II рёбрам. Поднимают рёбра при глубоком вдохе, наклоняют шею. Между передней и средней проходят плечевое сплетение и подключичная артерия; подключичная вена — перед передней.' },
  { id: 'deep', name: 'Ременная и поднимающая лопатку', col: '#A98AD8', text: '<b>Ременная мышца головы</b> и <b>мышца, поднимающая лопатку</b>, вместе с лестничными образуют дно заднего треугольника. Ременная — от остистых отростков к сосцевидному отростку: разгибает и поворачивает голову. Поднимающая лопатку — от поперечных отростков C1–C4 к верхнему углу лопатки.' },
  { id: 'plat', name: 'Подкожная мышца шеи', col: '#F4C0A8', text: '<b>Подкожная мышца шеи</b> (платизма) — тонкий лист прямо под кожей: от груди ниже ключицы к нижней челюсти и углу рта. Напрягает кожу шеи и опускает углы рта. Это мимическая мышца, её иннервирует лицевой нерв. Здесь показана полупрозрачной поверх остальных.' },
];
const NK_TRI = [
  { id: 'subm', name: 'Подподбородочный', col: '#F2D16B', text: '<b>Подподбородочный треугольник</b> — непарный, между передними брюшками двубрюшных мышц и телом подъязычной кости; дно — челюстно-подъязычные мышцы. В нём подподбородочные лимфоузлы: к ним оттекает лимфа от кончика языка, дна рта и нижней губы.' },
  { id: 'smand', name: 'Поднижнечелюстной', col: '#7FD39A', text: '<b>Поднижнечелюстной треугольник</b> — между нижним краем нижней челюсти и двумя брюшками двубрюшной мышцы. В нём поднижнечелюстная слюнная железа и лимфоузлы, через него идут лицевая артерия, лицевая вена и подъязычный нерв.' },
  { id: 'carot', name: 'Сонный', col: '#6FB4F5', text: '<b>Сонный треугольник</b> — между грудино-ключично-сосцевидной мышцей, задним брюшком двубрюшной и верхним брюшком лопаточно-подъязычной. В нём делится общая сонная артерия, проходят внутренняя яремная вена, блуждающий и подъязычный нервы. Здесь щупают пульс.' },
  { id: 'musc', name: 'Лопаточно-трахеальный', col: '#C69CF0', text: '<b>Лопаточно-трахеальный (мышечный) треугольник</b> — между срединной линией, грудино-ключично-сосцевидной мышцей и верхним брюшком лопаточно-подъязычной. Под подподъязычными мышцами — гортань, трахея и щитовидная железа: путь к ним при операциях.' },
  { id: 'occ', name: 'Лопаточно-трапециевидный', col: '#F29A5C', text: '<b>Лопаточно-трапециевидный треугольник</b> — верхняя, бо́льшая часть заднего: между грудино-ключично-сосцевидной, трапециевидной и нижним брюшком лопаточно-подъязычной. Его косо пересекает добавочный нерв — при биопсии лимфоузлов его легко повредить.' },
  { id: 'omocl', name: 'Лопаточно-ключичный', col: '#4FD8D0', text: '<b>Лопаточно-ключичный треугольник</b> — над средней третью ключицы, под нижним брюшком лопаточно-подъязычной (большая надключичная ямка). В нём подключичная артерия и стволы плечевого сплетения: здесь делают обезболивание руки и прижимают артерию к I ребру.' },
];
const NK_VN = [
  { id: 'car', name: 'Сонные артерии', col: '#FF5A5A', text: '<b>Общая сонная артерия</b> поднимается в сонном влагалище и у верхнего края щитовидного хряща (C4) делится на внутреннюю — к мозгу и глазу, на шее без ветвей, — и наружную: она питает щитовидную железу, язык, лицо и затылок. В начале внутренней — сонный синус, датчик давления.' },
  { id: 'sub', name: 'Подключичная и позвоночная', col: '#FF9466', text: '<b>Подключичная артерия</b> перекидывается через I ребро позади передней лестничной мышцы и уходит к руке. От неё отходят <b>позвоночная артерия</b> — вверх через отверстия поперечных отростков C6–C1 в череп, к стволу мозга и мозжечку, — и нижняя щитовидная.' },
  { id: 'vein', name: 'Вены', col: '#6B8CFF', text: '<b>Внутренняя яремная вена</b> несёт кровь от мозга, лица и шеи. Она лежит в сонном влагалище снаружи от артерии и за грудино-ключичным суставом сливается с подключичной (венозный угол). <b>Наружная яремная</b> идёт поверх грудино-ключично-сосцевидной мышцы и видна при натуживании.' },
  { id: 'vagus', name: 'Блуждающий нерв', col: '#F2D16B', text: '<b>Блуждающий нерв</b> (X пара) спускается в сонном влагалище — позади, между артерией и веной — к сердцу, лёгким и кишечнику. Правый возвратный гортанный нерв огибает подключичную артерию, левый — дугу аорты; оба поднимаются к гортани между трахеей и пищеводом.' },
  { id: 'phren', name: 'Диафрагмальный и плечевое сплетение', col: '#E8E07A', text: '<b>Диафрагмальный нерв</b> (C3–C5) спускается по передней лестничной мышце в грудь, к диафрагме: поражение шеи выше C3 останавливает дыхание. <b>Плечевое сплетение</b> (C5–T1) выходит между передней и средней лестничными мышцами и над ключицей идёт к руке тремя стволами.' },
  { id: 'xi', name: 'Добавочный нерв', col: '#FFC870', text: '<b>Добавочный нерв</b> (XI пара) выходит из черепа через яремное отверстие, иннервирует грудино-ключично-сосцевидную мышцу, потом косо пересекает задний треугольник и уходит под трапециевидную. Лежит поверхностно: при повреждении плечо опускается, руку трудно поднять выше плеча.' },
  { id: 'xii', name: 'Подъязычный нерв и шейная петля', col: '#C8E87A', text: '<b>Подъязычный нерв</b> (XII пара) — двигательный нерв языка: петлёй огибает снаружи внутреннюю и наружную сонные артерии над развилкой и уходит вперёд над подъязычной костью. С ним идут волокна C1: они дают верхний корешок <b>шейной петли</b> к подподъязычным мышцам.' },
  { id: 'cerv', name: 'Шейное сплетение', col: '#F7C9A0', text: '<b>Кожные ветви шейного сплетения</b> (C2–C4) выходят из-под заднего края грудино-ключично-сосцевидной мышцы почти в одной точке — нервной точке, около середины мышцы: большой ушной, малый затылочный, поперечный нерв шеи и надключичные. Сюда вводят анестетик.' },
];
const NK_SEC = [
  { id: 'inv', name: 'Поверхностная пластинка', col: '#F2D16B', text: '<b>Поверхностная пластинка</b> шейной фасции охватывает всю шею под подкожной мышцей и расщепляется вокруг грудино-ключично-сосцевидной и трапециевидной мышц (у нижней челюсти — вокруг поднижнечелюстной и околоушной желёз). Вверху крепится к нижней челюсти и затылку, внизу — к ключицам и грудине.' },
  { id: 'pre', name: 'Предтрахеальная пластинка', col: '#6FB4F5', text: '<b>Предтрахеальная пластинка</b> — мышечный листок вокруг подподъязычных мышц и висцеральный: капсула щитовидной железы и футляр трахеи и пищевода (сзади — щёчно-глоточная фасция). Железа связана с гортанью, поэтому её узлы поднимаются при глотании.' },
  { id: 'carsh', name: 'Сонное влагалище', col: '#5CD6A0', text: '<b>Сонное влагалище</b> — фасциальная трубка по бокам от органов шеи. Внутри общая сонная артерия (ближе к середине), внутренняя яремная вена (снаружи) и блуждающий нерв (позади, между ними). Спереди по влагалищу спускается шейная петля, позади лежит симпатический ствол.' },
  { id: 'prev', name: 'Предпозвоночная пластинка', col: '#F29A5C', text: '<b>Предпозвоночная пластинка</b> охватывает позвоночник с его мышцами: длинные мышцы шеи, лестничные, глубокие мышцы спины. Под ней — диафрагмальный нерв и корни плечевого сплетения, на ней — симпатический ствол. Сплетение и подключичная артерия уносят её к руке как влагалище.' },
  { id: 'retro', name: 'Заглоточное пространство', col: '#C69CF0', text: '<b>Заглоточное пространство</b> — щель позади глотки и пищевода, перед предпозвоночной пластинкой. Крыловидная фасция делит её надвое; задняя часть — «опасное пространство»: от основания черепа до диафрагмы. По нему гной заглоточного абсцесса может спуститься в средостение.' },
];
function makeNeck() {
  rnd = mulberry(1901);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fc8ff);
  { const f = new THREE.DirectionalLight(0xfff0ea, 0.8); f.position.set(-8, 3, 12); scene.add(f); }
  const DK = !matchMedia('(max-width:700px)').matches, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  // вид: цель и камера; shift — сдвиг модели вправо на экране (под панелью слева)
  const vw = (tg, pos, shift = 0) => { const d = tg.clone().sub(pos).normalize(), r = d.clone().cross(V3(0, 1, 0)).normalize().multiplyScalar(-shift); return flyTarget(tg.clone().add(r), pos.clone().add(r)); };
  const vd = (tg, dir, D, shift = 0) => vw(tg, tg.clone().add(dir.clone().normalize().multiplyScalar(D)), shift);
  const VIEW = {
    mus: DK ? vd(V3(-0.5, 5.3, 0), V3(-0.62, 0.2, 0.76), 48.5, 5.8) : vd(V3(-0.5, 7.0, 0), V3(-0.62, 0.2, 0.76), 42, 2.6),
    tri: DK ? vd(V3(-1.2, 6.3, 0.5), V3(-0.72, 0.16, 0.68), 45.5, 5.8) : vd(V3(-1.2, 7.4, 0.5), V3(-0.72, 0.16, 0.68), 38, 2.4),
    vn: DK ? vd(V3(-1.0, 6.3, 0.5), V3(-0.6, 0.18, 0.78), 50.5, 5.8) : vd(V3(-1.0, 7.3, 0.5), V3(-0.6, 0.18, 0.78), 41, 2.6),
    sec: DK ? vd(V3(0, 4.6, 0), V3(0, 0.05, 1), 33, 4.6) : vd(V3(0, 6.0, 0), V3(0, 0.05, 1), 28),
  };




  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 250); camera.position.copy(VIEW.mus.pos);
  const controls = makeControls(camera, VIEW.mus.target); controls.minDistance = 8; controls.maxDistance = 110;
  const st = { t: 0, mode: 'mus', sel: null, labels: true, rot: false, fly: null };
  const MATS = [], MESH = [], PICK = { mus: [], tri: [], vn: [], sec: [] };
  const mat = (pid, col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.8), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xffffff), emissive: col, emissiveIntensity: o.em ?? 0.06, side: o.side ?? THREE.DoubleSide, transparent: true, opacity: 1, polygonOffset: !!o.po, polygonOffsetFactor: o.po || 0, polygonOffsetUnits: o.po || 0 }); m.userData = { pid, em0: o.em ?? 0.06, base: o.op ?? 1 }; MATS.push(m); return m; };
  const add = (geo, m, pick, parent) => { const ms = new THREE.Mesh(geo, m); if (pick) { ms.userData.pick = pick[1]; PICK[pick[0]].push(ms); } parent.add(ms); MESH.push(ms); return ms; };
  const N3 = new THREE.Group(); scene.add(N3);   // объёмная шея
  const VN = new THREE.Group(); N3.add(VN);     // сосуды и нервы
  const TRI = new THREE.Group(); N3.add(TRI);   // треугольники
  const SEC = new THREE.Group(); SEC.position.set(0, 5.6, 0); scene.add(SEC);   // поперечный разрез
  // ---------- поверхность шеи ----------
  const herm = (T) => { const n = T.length, m = (k) => (k === 0 ? (T[1][1] - T[0][1]) / (T[1][0] - T[0][0]) : k === n - 1 ? (T[n - 1][1] - T[n - 2][1]) / (T[n - 1][0] - T[n - 2][0]) : (T[k + 1][1] - T[k - 1][1]) / (T[k + 1][0] - T[k - 1][0]));
    return (y) => { if (y <= T[0][0]) return T[0][1] + m(0) * (y - T[0][0]); if (y >= T[n - 1][0]) return T[n - 1][1] + m(n - 1) * (y - T[n - 1][0]); let i = 1; while (y > T[i][0]) i++;
      const [y0, v0] = T[i - 1], [y1, v1] = T[i], hh = y1 - y0, t = (y - y0) / hh, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * hh * m(i - 1) + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * hh * m(i); }; };
  const clampT = (f, lo, hi) => (y) => f(Math.max(lo, Math.min(hi, y)));
  const ZF = clampT(herm([[-1, 4.0], [0, 4.0], [2, 4.1], [4, 4.3], [6, 4.7], [7.6, 5.3], [8.6, 5.05], [9.7, 4.95], [10.8, 5.9], [11.8, 6.9], [12.5, 7.3], [13.5, 7.5]]), -1, 13.5);
  const ZB = clampT(herm([[-1, -7.0], [1, -7.4], [4, -7.3], [8, -7.0], [11, -6.7], [13.5, -7.0]]), -1, 13.5);
  const AW = clampT(herm([[-1, 10.5], [0, 8.8], [1, 7.2], [2, 6.2], [3, 5.7], [5, 5.35], [8, 5.3], [10.5, 5.5], [13.5, 5.7]]), -1, 13.5);
  const E = 0.77;
  const sp = (th, y, d = 0) => { const zf = ZF(y), zb = ZB(y), cz = (zf + zb) / 2, b = (zf - zb) / 2 - d, a = AW(y) - d, sn = Math.sin(th), cs = Math.cos(th);
    return V3(Math.sign(sn) * a * Math.pow(Math.abs(sn), E), y, cz + Math.sign(cs) * b * Math.pow(Math.abs(cs), E)); };
  // лента на поверхности: края fA(u), fB(u) → [θ, y]; глубина от d0 (верх) до d1 (низ, скруглено поперёк и к концам)
  const slab = (fA, fB, d0, d1, nu = 28, nv = 6) => {
    const pos = [], idx = [], W = nv + 1, G = (nu + 1) * W, dd = (x, u) => (typeof x === 'function' ? x(u) : x);
    for (let side = 0; side < 2; side++) for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const u = i / nu, v = j / nv, a = fA(u), b = fB(u), D0 = dd(d0, u), D1 = dd(d1, u);
      const prof = 0.15 + 0.85 * Math.sin(Math.PI * v), endk = Math.min(1, 0.3 + 4 * Math.min(u, 1 - u));
      const p = sp(a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v, side ? D0 + (D1 - D0) * prof * endk : D0); pos.push(p.x, p.y, p.z);
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * W + j, b = a + W, c = b + 1, d = a + 1; idx.push(a, b, d, b, c, d, G + a, G + d, G + b, G + b, G + d, G + c); }
    for (let i = 0; i < nu; i++) { const a = i * W, b = a + W; idx.push(a, G + a, b, b, G + a, G + b); const c = i * W + nv, e = c + W; idx.push(c, e, G + c, e, G + e, G + c); }
    for (let j = 0; j < nv; j++) { const a = j, b = j + 1; idx.push(a, b, G + a, b, G + b, G + a); const c = nu * W + j, e = c + 1; idx.push(c, G + c, e, e, G + c, G + e); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  };
  const R = 5.5;
  const pc = (pts) => { const c = new THREE.CatmullRomCurve3(pts.map(([t, y]) => V3(t * R, y, 0))); return (u) => { const p = c.getPoint(u); return [p.x / R, p.y]; }; };
  const strip = (F, w, d0, d1, nu = 24) => {
    const off = (u, s) => { const e = 1e-3, p = F(u), q = F(Math.min(1, u + e)), r = F(Math.max(0, u - e)); let tx = (q[0] - r[0]) * R, ty = q[1] - r[1]; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L; const ww = ((typeof w === 'function' ? w(u) : w) / 2) * s; return [p[0] - (ty * ww) / R, p[1] + tx * ww]; };
    return slab((u) => off(u, 1), (u) => off(u, -1), d0, d1, nu, 4);
  };
  const mir = (f, s) => (u) => { const p = f(u); return [s * p[0], p[1]]; };
  // границы в координатах (y → θ)
  const A = herm([[0.2, 0.06], [1.5, 0.16], [4.0, 0.38], [6.8, 0.62], [9.4, 0.95], [11.6, 1.32], [12.9, 1.62]]);   // передний край грудино-ключично-сосцевидной
  const P = herm([[0.6, 0.5], [1.5, 0.64], [4.0, 0.85], [6.8, 1.08], [9.4, 1.38], [11.6, 1.68], [12.9, 1.92]]);    // задний край
  const T = herm([[1.0, 1.38], [3.0, 1.55], [6.0, 1.8], [9.0, 2.1], [11.5, 2.45], [13.0, 2.75]]);                  // передний край трапециевидной
  const DA = herm([[9.9, 0.45], [11.0, 0.27], [12.2, 0.07]]);              // переднее брюшко двубрюшной
  const DP = herm([[9.9, 0.45], [10.9, 1.0], [11.8, 1.45], [12.45, 1.75]]); // заднее брюшко
  const OS = herm([[3.2, 0.75], [5.0, 0.62], [7.5, 0.45], [9.4, 0.3]]);     // верхнее брюшко лопаточно-подъязычной
  const OI = herm([[1.3, 1.5], [1.8, 1.27], [2.3, 1.05], [2.95, 0.8]]);     // нижнее брюшко
  const yM = (th) => 12.35 - 0.75 * Math.pow(Math.min(1, Math.abs(th) / 1.5), 1.5);   // нижний край нижней челюсти
  const cross = (f, g, a, b) => { let fa = f(a) - g(a); for (let k = 0; k < 40; k++) { const m = (a + b) / 2, fm = f(m) - g(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } return (a + b) / 2; };
  const yOA = cross(OS, A, 3.3, 9.3), yDA = cross(DP, A, 10, 12.4), yOP = cross(OI, P, 1.3, 2.95), yOT = cross(OI, T, 1.3, 2.95);
  const yDM = cross((y) => yM(DP(y)), (y) => y, 9.95, 12.45), thDM = DP(yDM);   // заднее брюшко встречает нижний край челюсти
  // ---------- кости ----------
  const BONE = '#E8DCC0', boneM = mat('bone', BONE, { k: 0.78, r: 0.6 }), boneG = mat('boneg', BONE, { k: 0.7, op: 0.5 });
  const discM = mat('bone', '#9FC4D8', { k: 0.7 });
  const tube = (pts, r, m, pick, parent = N3, seg = 40, rad = 10) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, rad, false), m, pick, parent);
  const ttube = (pts, rf, m, pick, parent = N3, seg = 48, rad = 10) => add(taperTube(new THREE.CatmullRomCurve3(pts), rf, seg, rad), m, pick, parent);
  const ball = (p, r, m, parent = N3, sc) => { const b = add(new THREE.SphereGeometry(r, 14, 10), m, null, parent); b.position.copy(p); if (sc) b.scale.set(...sc); return b; };
  const VY = { C1: 12.75, C2: 11.2, C3: 9.6, C4: 8.0, C5: 6.4, C6: 4.8, C7: 3.2, T1: 1.6, T2: 0.0, T3: -1.6 };
  Object.entries(VY).forEach(([nm, y]) => {
    if (nm === 'C1') {   // атлант: кольцо без тела
      const ring = add(new THREE.TorusGeometry(1.6, 0.24, 8, 32), boneM, null, N3); ring.rotation.x = Math.PI / 2; ring.scale.set(1.15, 1.15, 1); ring.position.set(0, y, -3.0);
      [1, -1].forEach((s) => { tube([V3(s * 1.6, y, -2.6), V3(s * 3.1, y - 0.1, -2.5)], 0.22, boneM, null); ball(V3(s * 1.45, y, -2.75), 0.48, boneM, N3, [0.8, 1, 1.1]); });
      return;
    }
    const body = add(new THREE.CylinderGeometry(0.85, 0.9, 0.85, 20), boneM, null, N3); body.scale.set(1.3, 1, 1); body.position.set(0, y, -2.0);
    if (nm === 'C2') { const dn = add(new THREE.CylinderGeometry(0.35, 0.5, 1.4, 12), boneM, null, N3); dn.position.set(0, y + 1.0, -1.95); }
    const sp2 = nm === 'C7' || nm[0] === 'T' ? 1 : 0, zs = nm === 'C7' ? -7.0 : sp2 ? -6.8 : -5.9;
    [1, -1].forEach((s) => {
      tube([V3(s * 0.75, y, -2.6), V3(s * 1.35, y - 0.05, -3.4), V3(s * 0.85, y - 0.15, -4.5), V3(0, y - 0.2, -4.9)], 0.22, boneM, null, N3, 16, 8);
      if (nm[0] === 'C') { tube([V3(s * 1.0, y, -2.1), V3(s * 1.8, y + 0.05, -2.3), V3(s * 2.45, y - 0.1, -2.15)], 0.2, boneM, null, N3, 10, 8); const pl = add(new THREE.CylinderGeometry(0.36, 0.36, 1.1, 10), boneM, null, N3); pl.position.set(s * 1.4, y - 0.1, -3.35); }
      else tube([V3(s * 0.9, y, -3.2), V3(s * 2.4, y + 0.25, -3.9)], 0.24, boneM, null, N3, 8, 8);
    });
    tube([V3(0, y - 0.2, -4.9), V3(0, y - 0.55, -4.9 + (zs + 4.9) * 0.55), V3(0, y - 0.8, zs)], 0.2, boneM, null, N3, 12, 8);
    if (!sp2) [1, -1].forEach((s) => ball(V3(s * 0.25, y - 0.8, zs), 0.2, boneM));
    else ball(V3(0, y - 0.8, zs), 0.32, boneM);
    if (y > VY.T3) { const ds = add(new THREE.CylinderGeometry(0.88, 0.88, 0.5, 20), discM, null, N3); ds.scale.set(1.3, 1, 1); ds.position.set(0, y - 0.8, -2.0); }
  });
  // нижняя челюсть (полупрозрачная): тело — пластинка над нижним краем, ветви — плоские фигуры с мыщелком и венечным отростком
  const jawM = mat('boneg', BONE, { k: 0.75, op: 0.4 });
  const mandG = (() => { const nu = 44, nv = 4, pos = [], idx = [];
    for (let side = 0; side < 2; side++) for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const th = -1.5 + 3 * (i / nu), v = j / nv, p = sp(th, yM(th), -0.1 + side * 0.42), out = V3(p.x, 0, p.z + 1.0).normalize();
      p.y += (1.7 + 0.3 * Math.cos(th)) * v; p.addScaledVector(out, 0.3 * Math.sin(Math.PI * v * 0.7)); pos.push(p.x, p.y, p.z);
    }
    const W = nv + 1, G = (nu + 1) * W; for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * W + j, b = a + W; idx.push(a, b, a + 1, b, b + 1, a + 1, G + a, G + a + 1, G + b, G + b, G + a + 1, G + b + 1); }
    for (let i = 0; i < nu; i++) { const a = i * W, b = a + W; idx.push(a, G + a, b, b, G + a, G + b); const c = a + nv, e = b + nv; idx.push(c, e, G + c, e, G + e, G + c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; })();
  add(mandG, jawM, null, N3);
  tube(Array.from({ length: 31 }, (_, i) => { const th = -1.5 + 3 * (i / 30); return sp(th, yM(th) + 0.1, 0.12); }), 0.36, jawM, null, N3, 60, 10);
  { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(-0.55, 1.6, -0.35, 3.9); sh.lineTo(-0.55, 4.5); sh.quadraticCurveTo(-0.2, 4.95, 0.25, 4.5); sh.quadraticCurveTo(0.9, 3.5, 1.55, 4.75); sh.quadraticCurveTo(1.9, 3.6, 2.4, 2.3); sh.lineTo(2.9, 0.9); sh.quadraticCurveTo(1.4, -0.35, 0, 0);
    const rg = new THREE.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 2, curveSegments: 10 });
    [1, -1].forEach((s) => { const an = sp(s * 1.5, yM(1.5), 0.15), r = add(rg, jawM, null, N3); r.rotation.y = -Math.PI / 2; r.position.set(an.x + s * 0.2, an.y - 0.05, an.z - 0.35); r.scale.set(0.9, 0.62, -s); }); }
  [1, -1].forEach((s) => ball(sp(s * 1.75, 13.1, 0.6), 0.75, boneM, N3, [0.8, 1.3, 1]));   // сосцевидный отросток

  // подъязычная кость
  const HY = 9.75;
  { const pts = []; for (let i = 0; i <= 16; i++) { const th = -0.62 + 1.24 * (i / 16), q = sp(th, HY + 0.5 * Math.pow(Math.abs(th) / 0.62, 2), 1.15 + 1.1 * Math.pow(Math.abs(th) / 0.62, 1.6)); pts.push(q); } tube(pts, 0.17, boneM, null, N3, 40, 8);
    const hb = add(new THREE.CapsuleGeometry(0.26, 1.2, 6, 12), boneM, null, N3); hb.rotation.z = Math.PI / 2; const c = sp(0, HY, 1.1); hb.position.copy(c); hb.scale.set(1, 1, 0.75); }
  // ключицы, рукоятка грудины, I рёбра
  [1, -1].forEach((s) => {
    const clv = [V3(s * 1.6, 0.25, 3.35), V3(s * 3.2, 0.55, 3.2), V3(s * 5.5, 0.8, 2.6), V3(s * 8.5, 1.2, 1.2), V3(s * 11.5, 1.7, -0.6), V3(s * 13.6, 2.1, -2.3)];
    if (s < 0) { tube(clv, 0.55, boneM, null, N3, 50, 12); ball(V3(s * 13.8, 2.15, -2.6), 0.85, boneM, N3, [1, 0.6, 1.3]); } else tube(clv.slice(0, 5), 0.55, boneM, null, N3, 40, 12);   // дальняя ключица — без акромиона   // акромион
    tube([V3(s * 1.25, 1.5, -3.0), V3(s * 3.4, 1.65, -3.2), V3(s * 5.3, 0.9, -1.6), V3(s * 5.0, 0.15, 0.9), V3(s * 3.2, -0.4, 2.7), V3(s * 1.9, -0.65, 3.3)], 0.32, boneM, null, N3, 50, 8);
  });
  { const sh = new THREE.Shape(); sh.moveTo(-2.6, -0.2); sh.quadraticCurveTo(-1.2, 0.25, 0, -0.25); sh.quadraticCurveTo(1.2, 0.25, 2.6, -0.2); sh.lineTo(2.0, -3.4); sh.lineTo(-2.0, -3.4); sh.closePath();
    const mn = add(new THREE.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 2 }), jawM, null, N3); mn.position.set(0, 0, 2.55); }
  // ---------- органы: гортань, трахея, щитовидная железа, глотка и пищевод ----------
  const larM = mat('lar', '#9CC8E2', { k: 0.75 }), thyM = mat('thy', '#C0608E', { k: 0.8, em: 0.08 }), esoM = mat('eso', '#D99098', { k: 0.7 });
  const surfG = (f, nu, nv) => { const pos = [], idx = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = f(i / nu, j / nv); pos.push(p.x, p.y, p.z); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + nu + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  [1, -1].forEach((s) => add(surfG((u, v) => { const x = s * (0.05 + 2.05 * Math.pow(u, 0.9)), z = 4.25 - 2.6 * Math.pow(u, 1.1) + 0.25 * Math.exp(-((u / 0.1) ** 2)) * v; const top = 8.25 - 0.6 * Math.exp(-((u / 0.12) ** 2)), bot = 5.85 + 0.3 * u; return V3(x, bot + (top - bot) * v, z); }, 20, 8), larM, null, N3));
  const crTop = (a) => 5.3 + 1.0 * Math.pow((1 - Math.cos(a)) / 2, 2);
  add(surfG((u, v) => { const a = u * Math.PI * 2; return V3(Math.sin(a) * 1.25, 4.75 + (crTop(a) - 4.75) * v, 1.6 + Math.cos(a) * 1.15); }, 40, 2), larM, null, N3);
  for (let y = 4.3; y > -3.2; y -= 0.55) { const r = add(new THREE.TorusGeometry(1.02, 0.13, 6, 28, Math.PI * 1.5), larM, null, N3); r.rotation.x = Math.PI / 2; r.rotation.z = Math.PI * 0.75 - Math.PI / 2 + Math.PI; r.position.set(0, y, 1.6); r.scale.set(1.08, 1, 1); }
  { const tm = add(new THREE.CylinderGeometry(1.0, 1.0, 7.6, 24, 1, true), mat('lar', '#9CC8E2', { k: 0.5, op: 0.35 }), null, N3); tm.position.set(0, 0.6, 1.6); tm.scale.set(1.08, 1, 1); }
  [1, -1].forEach((s) => { const lo = add(new THREE.SphereGeometry(1, 20, 16), thyM, null, N3); lo.scale.set(0.68, 2.0, 1.0); lo.position.set(s * 1.55, 4.3, 1.95); lo.rotation.z = s * 0.12; });
  { const is = add(new THREE.CapsuleGeometry(0.42, 1.9, 6, 12), thyM, null, N3); is.rotation.z = Math.PI / 2; is.scale.set(1, 1, 0.55); is.position.set(0, 3.35, 2.7); }
  add(surfG((u, v) => { const a = u * Math.PI * 2, y = -3.2 + 16.3 * v, top = cl((y - 4.6) / 8), rx = 0.8 + 1.1 * top, rz = 0.5 + 0.4 * top; return V3(Math.sin(a) * rx + 0.25 * (1 - top), y, -0.05 - 0.3 * top + Math.cos(a) * rz); }, 28, 20), esoM, null, N3);
  // ---------- мышцы ----------
  const MM = Object.fromEntries(NK_MUS.map((p) => [p.id, mat(p.id, p.col, p.id === 'plat' ? { k: 0.72, em: 0.1, cc: 0, r: 0.85 } : { k: 0.72, em: 0.08 })]));
  const omoM = mat('infra', NK_MUS[2].col, { k: 0.72, em: 0.08 }), digM = mat('supra', NK_MUS[3].col, { k: 0.72, em: 0.08 });
  omoM.userData.border = true; digM.userData.border = true;
  const yr = (y0, y1) => (u) => y0 + (y1 - y0) * u;
  [1, -1].forEach((s) => {
    const m = (id) => ['mus', id];
    // грудино-ключично-сосцевидная
    add(slab((u) => { const y = yr(0.2, 12.9)(u); return [s * A(y), y]; }, (u) => { const y = yr(0.6, 12.9)(u); return [s * P(y), y]; }, 0.2, 0.85, 36, 7), MM.scm, m('scm'), N3);
    // трапециевидная: шейная часть и плечевая
    add(slab((u) => { const y = yr(1.0, 13.0)(u); return [s * T(y), y]; }, (u) => { const y = yr(-0.6, 13.0)(u); return [s * Math.PI, y]; }, 0.15, 0.7, 36, 8), MM.trap, m('trap'), N3);
    { const nu = 16, nv = 6, c1 = Array.from({ length: nu + 1 }, (_, i) => { const u = i / nu, th = 1.38 + (Math.PI - 1.38) * u; return sp(s * th, 1.0 - 1.6 * u, 0.2); });
      const c2 = new THREE.CatmullRomCurve3([V3(s * 9.5, 1.75, 0.4), V3(s * 12.6, 2.6, -1.6), V3(s * 12.6, 2.2, -3.8), V3(s * 9.5, 0.9, -6.0), V3(s * 5.0, -1.6, -7.6), V3(s * 0.4, -2.6, -7.9)]);
      const cc1 = new THREE.CatmullRomCurve3(c1);
      add(surfG((u, v) => { const a = cc1.getPoint(u), b = c2.getPoint(u), p = a.clone().lerp(b, v); p.y += 1.3 * Math.sin(Math.PI * v) * (1 - 0.6 * u); return p; }, 24, nv), MM.trap, m('trap'), N3); }
    // подподъязычные
    add(strip(mir(pc([[0.1, -0.2], [0.12, 3], [0.13, 6.5], [0.12, 9.5]]), s), 1.3, 0.72, 1.0), MM.infra, m('infra'), N3);
    add(strip(mir(pc([[0.22, -0.3], [0.24, 3], [0.27, 6.4]]), s), 1.3, 1.02, 1.25), MM.infra, m('infra'), N3);
    add(strip(mir(pc([[0.29, 6.2], [0.3, 8.0], [0.3, 9.6]]), s), 1.2, 0.95, 1.15), MM.infra, m('infra'), N3);
    add(strip(mir(pc([[0.3, 9.5], [0.45, 7.5], [0.62, 5.0], [0.78, 3.0], [0.9, 2.65], [1.05, 2.3], [1.27, 1.8], [1.5, 1.3]]), s), (u) => 0.8 - 0.25 * Math.exp(-(((u - 0.55) / 0.08) ** 2)), (u) => (u < 0.55 ? 0.85 : 0.85 - 0.35 * cl((u - 0.55) / 0.2)), (u) => (u < 0.55 ? 1.08 : 1.08 - 0.33 * cl((u - 0.55) / 0.2)), 40), omoM, m('infra'), N3);
    ttube([sp(s * 1.5, 1.3, 0.6), sp(s * 1.62, 1.0, 1.1), V3(s * 6.6, 0.7, -3.4), V3(s * 7.6, 0.6, -4.6)], (u) => 0.28 - 0.08 * u, omoM, m('infra'));
    // надподъязычные
    add(strip(mir(pc([[0.07, 12.15], [0.27, 11.0], [0.45, 9.95]]), s), 0.9, 0.42, 0.8), digM, m('supra'), N3);
    add(strip(mir(pc([[0.45, 9.95], [1.0, 10.9], [1.45, 11.8], [1.75, 12.45]]), s), 0.85, (u) => 0.45 + 0.6 * u, (u) => 0.85 + 0.6 * u), digM, m('supra'), N3);
    ball(sp(s * 0.45, 9.95, 0.6), 0.28, digM, N3);
    // лестничные
    ttube([V3(s * 2.45, 9.2, -1.6), V3(s * 2.75, 7.0, -1.1), V3(s * 3.3, 4.5, -0.5), V3(s * 4.55, 0.45, 0.75)], (u) => 0.42 + 0.28 * Math.sin(Math.PI * u), MM.scal, m('scal'), N3, 48, 10, 0.35);
    ttube([V3(s * 2.9, 11.3, -2.55), V3(s * 3.4, 8.5, -2.5), V3(s * 4.0, 5.5, -2.2), V3(s * 5.1, 0.9, -1.3)], (u) => 0.46 + 0.38 * Math.sin(Math.PI * u), MM.scal, m('scal'), N3, 48, 10, 0.35);
    ttube([V3(s * 3.15, 8.0, -3.1), V3(s * 4.0, 5.0, -3.3), V3(s * 5.0, 2.2, -3.2), V3(s * 6.0, 0.1, -2.9)], (u) => 0.4 + 0.26 * Math.sin(Math.PI * u), MM.scal, m('scal'), N3, 48, 10, 0.35);
    // ременная головы и поднимающая лопатку
    ttube([V3(s * 3.4, 12.3, -2.6), V3(s * 3.9, 9.0, -3.6), V3(s * 4.4, 5.5, -4.4), V3(s * 5.4, 2.4, -5.4), V3(s * 6.8, 0.2, -6.4)], (u) => 0.5 + 0.32 * Math.sin(Math.PI * u), MM.deep, m('deep'), N3, 48, 10, 0.5);
    ttube([V3(s * 0.5, 1.6, -6.6), V3(s * 1.5, 5.0, -6.1), V3(s * 2.8, 9.0, -5.4), V3(s * 3.9, 12.0, -4.4), V3(s * 4.6, 13.2, -3.0)], (u) => 0.75 + 0.35 * Math.sin(Math.PI * u), MM.deep, m('deep'), N3, 48, 10, 0.4);
  });
  // челюстно-подъязычная — дно рта
  add(slab((u) => { const th = -0.8 + 1.6 * u; return [th, HY + 0.5 * Math.pow(Math.abs(th) / 0.62, 2)]; }, (u) => { const th = (-0.8 + 1.6 * u) * 1.45; return [th, yM(th) - 0.3]; }, 0.95, 1.2, 28, 5), digM, ['mus', 'supra'], N3);
  // подкожная мышца шеи
  const platM = MM.plat;
  [1, -1].forEach((s) => add(slab((u) => [s * (0.42 - 0.38 * u), -1.2 + 13.6 * u], (u) => [s * (1.42 + 0.1 * u), -0.6 + 12.6 * u], -0.12, 0.02, 36, 8), platM, ['mus', 'plat'], N3));
  // ---------- треугольники ----------
  const samp = (f, y0, y1, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const y = y0 + (y1 - y0) * (i / n); return [f(y), y]; });
  const thS = (th0, th1, f, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const th = th0 + (th1 - th0) * (i / n); return [th, f(th)]; });
  const TRP = {
    subm: [...samp((y) => -DA(y), 9.95, 12.15), ...thS(-DA(12.15), DA(12.15), (t) => yM(t) - 0.05, 6), ...samp(DA, 12.15, 9.95), ...thS(0.45, -0.45, () => 9.95, 6)],
    smand: [...samp(DA, 9.95, 12.15), ...thS(DA(12.15), thDM, yM), ...samp(DP, yDM, 9.95)],
    carot: [...samp(OS, yOA, 9.4), [0.42, 9.85], ...samp(DP, 9.95, yDA), ...samp(A, yDA, yOA)],
    musc: [[0, 9.75], [0.25, 9.6], ...samp(OS, 9.4, yOA), ...samp(A, yOA, 0.2), [0, 0.15]],
    occ: [...samp(P, yOP, 12.9), [2.3, 13.0], ...samp(T, 13.0, yOT), ...samp(OI, yOT, yOP, 6)],
    omocl: [...samp(OI, yOP, yOT, 6), ...samp(T, yOT, 1.0, 4), ...thS(1.38, 0.5, (t) => 0.6 + 0.4 * (t - 0.5) / 0.88, 8), ...samp(P, 0.6, yOP, 6)],
  };
  const triGeo = (poly, s) => {   // многоугольник (θ, y) → сетка на поверхности (с подразбиением)
    const pts = poly.map(([t, y]) => new THREE.Vector2(t * R, y)); const tris = THREE.ShapeUtils.triangulateShape(pts, []);
    let T2 = tris.map((t) => t.map((i) => pts[i]));
    for (let k = 0; k < 4; k++) { const nt = []; T2.forEach(([a, b, c]) => { const ab = a.clone().add(b).multiplyScalar(0.5), bc = b.clone().add(c).multiplyScalar(0.5), ca = c.clone().add(a).multiplyScalar(0.5); nt.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]); }); T2 = nt; }
    const pos = []; T2.forEach((t) => t.forEach((v) => { const p = sp((s * v.x) / R, v.y, 0.1); pos.push(p.x, p.y, p.z); }));
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
  };
  const TM = {};
  NK_TRI.forEach((tr) => { const m = mat('tri:' + tr.id, tr.col, { k: 0.9, em: 0.35, r: 0.8, cc: 0 }); m.depthWrite = false; TM[tr.id] = m;
    const em = mat('tri:' + tr.id, tr.col, { k: 1, em: 0.6, r: 0.6, cc: 0 }); em.userData.edge = true;
    (tr.id === 'subm' ? [1] : [1, -1]).forEach((s) => { add(triGeo(TRP[tr.id], s), m, ['tri', tr.id], TRI);
      const pts = TRP[tr.id].map(([t, y]) => sp(s * t, y, 0.02)); add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'centripetal'), pts.length * 8, 0.09, 6, true), em, null, TRI); }); });
  // ---------- сосуды и нервы ----------
  const vm = (id, col, em = 0.12) => mat('vn:' + id, col, { k: 0.85, em, r: 0.35, cc: 0.5 });
  const VM = Object.fromEntries(NK_VN.map((p) => [p.id, vm(p.id, p.col, ['car', 'sub', 'vein'].includes(p.id) ? 0.12 : 0.25)]));
  const vt = (id, pts, r0, r1 = r0, seg = 48) => ttube(pts, (u) => r0 + (r1 - r0) * u, VM[id], ['vn', id], VN, seg, 10);
  const spp = (s, arr, d) => arr.map(([t, y, dd]) => sp(s * t, y, dd ?? d));
  // начало сосудов в груди (несимметрично)
  vt('car', [V3(-0.2, -3.6, 1.2), V3(-0.9, -2.2, 1.5), V3(-1.7, -0.8, 1.6)], 0.5, 0.45);
  vt('car', [V3(0.5, -3.6, 1.1), V3(1.2, -2.0, 1.4), V3(1.75, -0.8, 1.6)], 0.38);
  vt('sub', [V3(1.0, -3.8, 0.0), V3(1.8, -1.6, 0.3), V3(2.5, 0.4, 0.6)], 0.34); vt('sub', [V3(-1.7, -0.8, 1.6), V3(-2.2, -0.3, 1.0), V3(-2.5, 0.4, 0.6)], 0.36);
  [1, -1].forEach((s) => {
    vt('car', [V3(s * 1.7, -0.8, 1.6), V3(s * 2.2, 1.5, 1.5), V3(s * 2.6, 5.0, 1.3), V3(s * 2.7, 8.0, 1.3)], 0.4, 0.38);
    ball(V3(s * 2.86, 8.55, 1.12), 0.5, VM.car, VN, [1, 1.5, 1]).userData.pick = 'car'; PICK.vn.push(VN.children[VN.children.length - 1]);
    vt('car', [V3(s * 2.7, 7.9, 1.3), V3(s * 2.95, 8.9, 1.0), V3(s * 3.05, 11.0, 0.4), V3(s * 3.05, 13.8, -0.3)], 0.4, 0.3);   // внутренняя, у начала — сонный синус
    vt('car', [V3(s * 2.7, 7.9, 1.35), V3(s * 2.55, 9.5, 1.95), V3(s * 2.9, 11.5, 2.1), V3(s * 3.6, 13.8, 1.7)], 0.3, 0.2);
    vt('car', [V3(s * 2.6, 8.4, 1.75), V3(s * 2.25, 7.5, 2.6), V3(s * 1.95, 6.4, 2.7)], 0.13, 0.11);       // верхняя щитовидная
    vt('car', [V3(s * 2.6, 9.6, 2.0), V3(s * 2.2, 10.2, 2.9), V3(s * 1.4, 10.6, 3.7)], 0.13, 0.11);         // язычная
    vt('car', [V3(s * 2.75, 10.2, 2.1), V3(s * 3.5, 11.3, 2.9), V3(s * 4.25, 12.4, 3.7), V3(s * 4.5, 14.2, 4.6)], 0.14, 0.12);   // лицевая
    vt('car', [V3(s * 2.95, 10.4, 1.6), V3(s * 3.4, 11.9, -0.6), V3(s * 3.2, 13.3, -3.2)], 0.13, 0.11);    // затылочная
    vt('sub', [V3(s * 2.5, 0.4, 0.6), V3(s * 3.9, 1.45, -0.35), V3(s * 5.4, 1.05, -0.55), V3(s * 8.6, -0.6, -0.4)], 0.34);
    vt('sub', [V3(s * 2.55, 0.7, 0.4), V3(s * 2.2, 3.0, -1.2), V3(s * 1.85, 4.8, -1.95), V3(s * 1.85, 11.0, -2.1), V3(s * 2.5, 12.4, -2.6), V3(s * 1.5, 13.15, -3.4), V3(s * 0.5, 13.8, -2.3)], 0.17, 0.16, 70);   // позвоночная
    vt('sub', [V3(s * 3.4, 1.3, 0.0), V3(s * 3.3, 4.6, -0.2), V3(s * 2.6, 5.0, 0.9), V3(s * 2.05, 4.4, 1.6)], 0.12, 0.1);   // нижняя щитовидная
    vt('vein', [V3(s * 3.75, 13.8, -0.6), V3(s * 3.6, 11.0, 0.3), V3(s * 3.45, 6.0, 1.15), V3(s * 3.15, 1.5, 1.5), V3(s * 2.55, -0.2, 1.75)], 0.5, 0.62);
    vt('vein', [V3(s * 9.5, -0.3, 0.6), V3(s * 6.0, 0.35, 1.6), V3(s * 4.2, 0.4, 1.95), V3(s * 2.55, -0.2, 1.75)], 0.42, 0.5);   // подключичная вена
    vt('vein', [V3(s * 2.55, -0.2, 1.75), V3(s * 1.6, -1.8, 2.1), V3(s * (s > 0 ? 0.2 : 1.0), -3.6, 2.2)], 0.62, 0.6);       // плечеголовная
    vt('vein', [...spp(s, [[1.55, 11.4], [1.35, 9.0], [1.1, 6.5], [0.8, 3.6], [0.66, 2.0]], -0.1), V3(s * 4.6, 0.7, 2.0)], 0.2, 0.24);   // наружная яремная
    // нервы
    vt('vagus', [V3(s * 3.35, 13.8, -0.9), V3(s * 3.15, 11.0, -0.2), V3(s * 3.05, 6.0, 0.6), V3(s * 2.85, 1.5, 0.9), V3(s * 2.3, -1.0, 0.9), V3(s * 1.7, -3.6, 0.6)], 0.19);
    vt('vagus', [V3(s * 3.1, 10.8, -0.1), V3(s * 2.6, 9.8, 1.3), V3(s * 1.9, 8.9, 2.5)], 0.07);   // верхний гортанный
    if (s < 0) vt('vagus', [V3(-2.45, -0.6, 0.95), V3(-2.9, -0.35, 0.15), V3(-2.4, 0.5, -0.1), V3(-1.25, 2.0, 0.8), V3(-1.05, 4.5, 0.9), V3(-1.1, 5.3, 0.6)], 0.075);
    else vt('vagus', [V3(1.0, -3.6, 0.65), V3(1.05, 2.0, 0.85), V3(1.05, 4.5, 0.9), V3(1.1, 5.3, 0.6)], 0.075);
    vt('phren', [V3(s * 2.9, 8.5, -1.0), V3(s * 3.1, 6.5, -0.45), V3(s * 3.12, 4.5, 0.05), V3(s * 3.3, 2.0, 0.85), V3(s * 2.95, 0.0, 1.05), V3(s * 2.4, -2.6, 1.2)], 0.12);
    { const tr = [[V3(s * 4.2, 4.3, -1.4), V3(s * 5.9, 2.4, -1.05), V3(s * 8.6, -0.2, -1.1)], [V3(s * 4.3, 2.9, -1.35), V3(s * 6.0, 1.7, -1.15), V3(s * 8.6, -0.45, -1.3)], [V3(s * 4.3, 1.8, -1.2), V3(s * 6.0, 1.1, -1.1), V3(s * 8.6, -0.7, -1.0)]];
      tr.forEach((t) => vt('phren', t, 0.16, 0.17));
      [[6.4, 0], [4.8, 0], [3.2, 1], [2.0, 2], [1.1, 2]].forEach(([y, k]) => vt('phren', [V3(s * 2.5, y, -1.8), V3(s * 3.3, (y + tr[k][0].y) / 2 + 0.1, -1.6), tr[k][0]], 0.12, 0.15)); }
    vt('xi', [V3(s * 3.5, 13.6, -1.2), V3(s * 3.95, 12.0, -1.6), sp(s * (P(10.2) - 0.25), 10.2, 1.0), ...spp(s, [[P(9.2) + 0.06, 9.2], [1.62, 7.6], [1.78, 5.8], [T(4.5) - 0.03, 4.5]], 0.62), sp(s * 2.0, 3.0, 0.95)], 0.13, 0.11, 70);
    vt('xii', [V3(s * 2.6, 13.6, -1.6), V3(s * 3.15, 12.2, -0.6), V3(s * 3.45, 10.8, 0.8), V3(s * 3.3, 10.3, 1.95), V3(s * 2.6, 10.45, 2.9), V3(s * 1.5, 10.6, 3.75)], 0.14);
    vt('xii', [V3(s * 3.35, 10.45, 1.75), V3(s * 3.0, 8.0, 2.05), V3(s * 2.9, 5.0, 2.05), V3(s * 3.1, 4.0, 1.95), V3(s * 3.95, 5.4, 1.0), V3(s * 3.8, 8.6, -0.6)], 0.095, 0.095, 60);   // шейная петля
    vt('xii', [V3(s * 2.9, 5.0, 2.05), V3(s * 1.6, 5.4, 3.0)], 0.045); vt('xii', [V3(s * 3.05, 4.05, 1.95), V3(s * 1.3, 3.0, 3.1)], 0.045);
    const ep = (t, y) => sp(s * t, y, -0.05), erb = [P(7.0) + 0.02, 7.0];
    [[[1.25, 9.5], [1.48, 12.4]], [[1.35, 9.3], [1.95, 12.7]], [[0.75, 7.2], [0.2, 7.4]], [[0.85, 4.0], [0.45, 0.9]], [[1.05, 4.0], [0.95, 0.9]], [[1.25, 4.0], [1.35, 1.2]]].forEach(([a, b]) => vt('cerv', [ep(...erb), ep(...a), ep(...b)], 0.1, 0.075));
  });
  // ---------- поперечный разрез на уровне C7 (вид сверху: правая сторона человека — справа, спереди — вверху) ----------
  const SM = {}, secMat = (pid, col, o = {}) => { const m = mat(pid, col, { k: o.k ?? 0.8, em: o.em ?? 0.12, r: 0.8, cc: 0, po: o.po }); return m; };
  const elp = (cx, cy, a, b, rot = 0, n = 48, p = 2) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, c = Math.cos(t), s2 = Math.sin(t), x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / p), y = b * Math.sign(s2) * Math.pow(Math.abs(s2), 2 / p); return new THREE.Vector2(cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)); });
  const fill = (pts, m, z, pick, holes) => { const sh = new THREE.Shape(pts); if (holes) holes.forEach((hp) => sh.holes.push(new THREE.Path(hp))); const ms = add(new THREE.ShapeGeometry(sh, 2), m, pick ? ['sec', pick] : null, SEC); ms.position.z = z; return ms; };
  const loop = (pts, r, m, z, pick, closed = true) => { const c = new THREE.CatmullRomCurve3(pts.map((p) => V3(p.x, p.y, z)), closed, 'centripetal'); return add(new THREE.TubeGeometry(c, Math.max(40, pts.length * 3), r, 6, closed), m, pick ? ['sec', pick] : null, SEC); };
  const both = (f) => [1, -1].forEach(f);
  const C = { skin: '#E8B8A0', fat: '#6A5038', ct: '#4A3438', mus: '#B85A52', bone: BONE, art: '#E8434F', vein: '#4F6FE0', nerve: '#F2D16B', lum: '#120E14' };
  const sk = elp(0, -0.8, 6.35, 6.25, 0, 96, 2.35);
  fill(sk, secMat('s:skin', C.skin, { k: 0.75 }), 0); fill(elp(0, -0.8, 6.1, 6.0, 0, 96, 2.35), secMat('s:fat', C.fat, { k: 0.7, em: 0.05 }), 0.01);
  fill(elp(0, -0.8, 5.75, 5.85, 0, 96, 2.35), secMat('s:ct', C.ct, { k: 0.9, em: 0.05 }), 0.02);
  const sMus = secMat('s:mus', C.mus, { k: 0.75 }), sBone = secMat('s:bone', C.bone, { k: 0.78 }), sArt = secMat('s:art', C.art, { em: 0.2 }), sVein = secMat('s:vein', C.vein, { em: 0.2 }), sNerve = secMat('s:nerve', C.nerve, { em: 0.35 }), sLum = secMat('s:lum', C.lum, { k: 1, em: 0 });
  const sPlat = secMat('s:plat', '#D88070', { k: 0.6 }), sStrap = secMat('s:mus', '#D88A6A', { k: 0.75 }), sScm = sMus, sTrap = sMus, sScal = secMat('s:mus', '#A04E5C', { k: 0.75 }), sDeep = sScal;
  const sThy = secMat('s:thy', '#C0608E'), sEso = secMat('s:eso', '#D99098', { k: 0.75 }), sTra = secMat('s:tra', '#9CC8E2', { k: 0.8 }), sCord = secMat('s:cord', '#F2E8D0', { k: 0.85 });
  // подкожная мышца — серпы спереди и сбоку
  const skX = (t, r) => r * 6.35 * Math.pow(Math.sin(t), 2 / 2.35), skY = (t, r) => -0.8 + r * 6.25 * Math.pow(Math.cos(t), 2 / 2.35);   // t от 0 (спереди) к π/2 (сбоку)
  both((s) => { const o = [], inn = []; for (let i = 0; i <= 16; i++) { const t = 0.3 + 0.75 * (i / 16); o.push(new THREE.Vector2(s * skX(t, 0.965), skY(t, 0.965))); inn.push(new THREE.Vector2(s * skX(t, 0.935), skY(t, 0.935))); } fill([...o, ...inn.reverse()], sPlat, 0.04); });
  both((s) => {
    fill(elp(s * 3.95, 2.35, 1.4, 0.72, -s * 0.55), sScm, 0.05);                 // грудино-ключично-сосцевидная
    fill(elp(s * 3.25, -4.85, 2.55, 0.55, s * 0.62), sTrap, 0.05);              // трапециевидная
    fill(elp(s * 2.15, -4.15, 1.55, 1.05, s * 0.45), sDeep, 0.05);              // глубокие мышцы спины
    fill(elp(s * 4.2, -2.45, 0.72, 0.55, 0.3), sDeep, 0.05);                    // поднимающая лопатку
    fill(elp(s * 2.75, -0.05, 0.62, 0.45, 0.2), sScal, 0.05); fill(elp(s * 3.6, -1.35, 0.85, 0.6, -s * 0.3), sScal, 0.05);   // лестничные
    fill(elp(s * 1.05, -0.08, 0.62, 0.32), sMus, 0.05);                           // длинная мышца шеи
    fill(elp(s * 0.72, 4.62, 0.62, 0.17), sStrap, 0.05); fill(elp(s * 1.45, 4.4, 0.6, 0.2, -s * 0.2), sStrap, 0.05); fill(elp(s * 3.0, 3.38, 0.4, 0.2, -s * 0.3), sStrap, 0.05);
    fill(elp(s * 2.15, -1.35, 0.8, 0.32, s * 0.1), sBone, 0.06);                // поперечный отросток
    fill(elp(s * 1.6, 2.5, 0.7, 1.05, s * 0.35), sThy, 0.06);                   // доля щитовидной железы
    fill(elp(s * 2.55, 1.65, 0.43, 0.43), sArt, 0.08); fill(elp(s * 3.38, 1.95, 0.62, 0.48, 0.3), sVein, 0.08); fill(elp(s * 2.97, 1.05, 0.16, 0.16), sNerve, 0.09);
    fill(elp(s * 0.95, 1.85, 0.11, 0.11), sNerve, 0.09); fill(elp(s * 2.78, 0.62, 0.1, 0.1), sNerve, 0.09); fill(elp(s * 1.9, 0.12, 0.13, 0.13), sNerve, 0.09);
    [-0.45, -0.7, -0.95].forEach((y, i) => fill(elp(s * (3.05 + 0.18 * i), y, 0.13, 0.13), sNerve, 0.09));   // корни плечевого сплетения
    fill(elp(s * 1.92, -0.72, 0.18, 0.18), sArt, 0.09);                          // позвоночная артерия
    fill(elp(s * 5.0, 3.05, 0.2, 0.18), sVein, 0.09);                           // наружная яремная вена
  });
  fill(elp(0, 4.05, 1.2, 0.2), sThy, 0.06);
  fill(elp(0, -1.05, 1.55, 1.0), sBone, 0.06);
  { const arch = [...elp(0, -2.75, 1.3, 1.05, 0, 40)], spn = [new THREE.Vector2(-0.3, -3.6), new THREE.Vector2(0, -5.45), new THREE.Vector2(0.3, -3.6)];
    fill(arch, sBone, 0.06, null, [elp(0, -2.75, 0.75, 0.62, 0, 32).reverse()]); fill(spn, sBone, 0.06); fill(elp(0, -2.75, 0.75, 0.62), sLum, 0.061); fill(elp(0, -2.75, 0.48, 0.4), sCord, 0.07); }
  { const tr = elp(0, 2.85, 1.0, 1.0, 0, 48); fill(tr, sTra, 0.06); fill(elp(0, 2.88, 0.78, 0.76), sLum, 0.07); fill(elp(-0.25, 1.38, 0.88, 0.45), sEso, 0.06); fill(elp(-0.25, 1.38, 0.45, 0.08), sLum, 0.07); }
  // фасции
  const FM = Object.fromEntries(NK_SEC.map((p) => [p.id, mat('sec:' + p.id, p.col, { k: 0.95, em: 0.45, r: 0.6, cc: 0 })]));
  const FZ = 0.2;
  loop(elp(0, -0.8, 5.55, 5.75, 0, 96, 2.35), 0.1, FM.inv, FZ, 'inv');
  both((s) => { loop(elp(s * 3.95, 2.35, 1.6, 0.9, -s * 0.55), 0.08, FM.inv, FZ, 'inv'); loop(elp(s * 3.25, -4.85, 2.75, 0.75, s * 0.62), 0.08, FM.inv, FZ, 'inv'); });
  loop([[-2.1, 4.2], [2.1, 4.2], [2.3, 4.55], [2.0, 4.86], [0, 4.88], [-2.0, 4.86], [-2.3, 4.55]].map(([x, y]) => new THREE.Vector2(x, y)), 0.09, FM.pre, FZ, 'pre');
  loop(elp(-0.05, 2.52, 2.4, 1.8, 0, 64, 2.2), 0.1, FM.pre, FZ, 'pre');
  both((s) => loop(elp(s * 2.95, 1.6, 1.12, 0.95, s * 0.15), 0.09, FM.carsh, FZ, 'carsh'));
  { const half = [[0, 0.36], [1.9, 0.26], [3.35, 0.4], [4.45, -0.9], [4.98, -2.6], [4.1, -3.4], [3.75, -4.4], [2.6, -5.4], [1.0, -5.65], [0, -5.6]];
    const pts = [...half.map(([x, y]) => new THREE.Vector2(x, y)), ...half.slice(1, -1).reverse().map(([x, y]) => new THREE.Vector2(-x, y))]; loop(pts, 0.1, FM.prev, FZ, 'prev'); }
  { const retroM = mat('sec:retro', NK_SEC[4].col, { k: 1, em: 0.5, r: 0.8, cc: 0 }); FM.retroF = retroM;
    const band = (y0, y1, w) => { const o = []; for (let i = 0; i <= 20; i++) { const x = -w + (2 * w * i) / 20; o.push(new THREE.Vector2(x, y1 + 0.03 * Math.cos((x / w) * 1.5))); } for (let i = 20; i >= 0; i--) { const x = -w + (2 * w * i) / 20; o.push(new THREE.Vector2(x, y0)); } return o; };
    fill(band(0.56, 0.7, 1.85), retroM, 0.1, 'retro'); const dz = mat('sec:retro', '#8C6CE0', { k: 1, em: 0.45, r: 0.8, cc: 0 }); fill(band(0.42, 0.54, 1.85), dz, 0.1, 'retro');
    loop([new THREE.Vector2(-2.0, 0.55), new THREE.Vector2(0, 0.55), new THREE.Vector2(2.0, 0.55)], 0.035, mat('sec:retro', '#E0D0FF', { k: 1, em: 0.5 }), FZ, 'retro', false); }
  // ---------- видимость ----------
  const PART = { mus: NK_MUS, tri: NK_TRI, vn: NK_VN, sec: NK_SEC };
  const MUSIDS = new Set(NK_MUS.map((p) => p.id));
  const opFor = (m) => {
    const pid = m.userData.pid, sel = st.sel, mo = st.mode;
    if (mo === 'sec') { if (pid.startsWith('sec:')) { const id = pid.slice(4); return !sel || sel === id ? 1 : 0.15; } return 0; }
    if (pid === 'plat') return mo === 'mus' && sel === 'plat' ? 0.6 : 0;
    if (MUSIDS.has(pid)) {
      if (mo === 'mus') return !sel || sel === pid ? 1 : 0.12;
      if (mo === 'tri') return pid === 'scm' || pid === 'trap' || m.userData.border ? (sel ? 0.5 : 0.9) : 0.14;
      return pid === 'scm' ? 0.13 : pid === 'trap' ? 0.18 : pid === 'scal' ? 0.3 : pid === 'deep' ? 0 : pid === 'supra' ? 0.15 : 0.25;
    }
    if (pid.startsWith('tri:')) { if (mo !== 'tri') return 0; const id = pid.slice(4); if (m.userData.edge) return !sel || sel === id ? 0.95 : 0.15; return !sel ? 0.62 : sel === id ? 0.85 : 0.1; }
    if (pid.startsWith('vn:')) { if (mo !== 'vn') return 0; const id = pid.slice(3); return !sel || sel === id ? 1 : 0.07; }
    if (pid === 'boneg') return mo === 'vn' ? 0.18 : 0.3;
    if (pid === 'lar' && m.userData.base < 1) return 0.35;
    return mo === 'mus' && sel ? 0.4 : mo === 'vn' ? 0.85 : 1;
  };
  function applyVis() {
    MATS.forEach((m) => { m.opacity = m.userData.pid.startsWith('s:') ? (st.mode === 'sec' ? 1 : 0) : opFor(m);
      m.transparent = m.opacity < 0.99; m.depthWrite = m.opacity >= 0.99 && !m.userData.pid.startsWith('tri:');
      const selp = st.sel && (m.userData.pid === st.sel || m.userData.pid.endsWith(':' + st.sel));
      m.emissiveIntensity = m.userData.em0 + (selp ? 0.22 : 0); m.needsUpdate = true; });
    MESH.forEach((ms) => { ms.visible = ms.material.opacity > 0.02; });
    N3.visible = st.mode !== 'sec'; SEC.visible = st.mode === 'sec';
  }
  const zoomTo = (id) => {   // подъезд к правой половине выбранного сосуда или нерва
    const bb = new THREE.Box3(), b1 = new THREE.Box3(); PICK.vn.forEach((ms) => { if (ms.userData.pick !== id) return; ms.geometry.computeBoundingBox(); b1.copy(ms.geometry.boundingBox).applyMatrix4(ms.matrixWorld); if (b1.max.x < 0.5) bb.union(b1); });
    const c = bb.getCenter(V3(0, 0, 0)), sz = bb.getSize(V3(0, 0, 0)), D = Math.min(1, Math.max(0.7, Math.max(sz.y, sz.x * 0.8) / 15)) * (DK ? 50.5 : 41);
    c.y = Math.max(DK ? 7.4 : 7.2, Math.min(8.6, c.y + 2.2)); return vd(c, V3(-0.6, 0.18, 0.78), D, DK ? 5.8 * D / 50.5 : 2.6 * D / 41); };
  function select(id) { st.sel = id === 'all' ? null : id; applyVis(); if (st.mode === 'vn') st.fly = st.sel ? zoomTo(st.sel) : VIEW.vn; refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; st.sel = null; st.fly = VIEW[m]; applyVis(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => PICK[st.mode], (id) => select(st.sel === id ? 'all' : id));
  // ---------- обновление ----------
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    if (st.mode === 'vn') { const ph = (st.t * 1.15) % 1, pulse = Math.exp(-(((ph - 0.12) / 0.07) ** 2)); [VM.car, VM.sub].forEach((m) => { m.emissiveIntensity = m.userData.em0 + 0.35 * pulse + (st.sel && m.userData.pid === 'vn:' + st.sel ? 0.15 : 0); }); }
  }
  // ---------- подписи ----------
  const L = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const M = (id) => NK_MUS.find((p) => p.id === id), TRx = (id) => NK_TRI.find((p) => p.id === id), VNx = (id) => NK_VN.find((p) => p.id === id), SX = (id) => NK_SEC.find((p) => p.id === id);
  const R1 = -1;   // подписи — на правой стороне человека (к камере)
  const inMus = (id, always = true) => () => st.mode === 'mus' && (st.sel ? st.sel === id : always);
  const secP = (x, y) => () => SEC.localToWorld(V3(x, y, 0.3));
  const triC = (id) => { const pts = TRP[id]; let tx = 0, ty = 0; pts.forEach(([t, y]) => { tx += t; ty += y; }); return [tx / pts.length, ty / pts.length]; };
  const labels = [
    L('грудино-ключично-сосцевидная', sp(R1 * 0.95, 6.2, 0), M('scm').col, inMus('scm')),
    L('трапециевидная', sp(R1 * 2.0, 6.8, 0), M('trap').col, inMus('trap')),
    L('подподъязычные', sp(R1 * 0.2, 5.6, 0.6), M('infra').col, inMus('infra')),
    L('лопаточно-подъязычная', sp(R1 * 1.27, 1.8, 0.5), M('infra').col, () => st.mode === 'mus' && st.sel === 'infra'),
    L('двубрюшная', sp(R1 * 1.0, 10.9, 0.4), M('supra').col, () => st.mode === 'mus' && (!st.sel || st.sel === 'supra')),
    L('челюстно-подъязычная', sp(R1 * 0.3, 11.4, 0.9), M('supra').col, () => st.mode === 'mus' && st.sel === 'supra'),
    L('лестничные', V3(-4.2, 4.0, -1.0), M('scal').col, () => st.mode === 'mus' && (!st.sel || st.sel === 'scal')),
    L('поднимающая лопатку', V3(-4.6, 6.0, -4.3), M('deep').col, () => st.mode === 'mus' && st.sel === 'deep'),
    L('ременная головы', V3(-3.2, 10.2, -5.0), M('deep').col, () => st.mode === 'mus' && st.sel === 'deep'),
    L('подкожная мышца шеи', sp(R1 * 1.0, 3.0, -0.12), M('plat').col, () => st.mode === 'mus' && st.sel === 'plat'),
    L('подъязычная кость', sp(R1 * 0.4, HY + 0.1, 1.0), BONE, () => st.mode === 'mus' && !st.sel && DK),
    L('щитовидный хрящ', V3(-0.9, 7.4, 3.9), '#9CC8E2', () => st.mode === 'mus' && !st.sel),
    L('щитовидная железа', V3(-1.7, 3.6, 2.6), '#E890B8', () => st.mode === 'mus' && !st.sel && DK),
    L('ключица', V3(-7.5, 1.1, 1.6), BONE, () => st.mode === 'mus' && !st.sel && DK),
    L('нижняя челюсть', sp(R1 * 0.9, 13.6, -0.3), BONE, () => st.mode === 'mus' && !st.sel),
    L('сосцевидный отросток', sp(R1 * 1.75, 13.6, 0.4), BONE, () => st.mode === 'mus' && st.sel === 'scm'),
    L('VII шейный позвонок', V3(0, 2.4, -7.2), BONE, () => st.mode === 'mus' && st.sel === 'trap'),
    ...NK_TRI.map((tr) => { const [t, y] = triC(tr.id), pos = tr.id === 'subm' ? sp(0, 10.45, 0) : tr.id === 'smand' ? sp(R1 * 0.8, 11.5, 0) : sp(R1 * t, y, 0); return L(tr.name.toLowerCase(), pos, tr.col, () => st.mode === 'tri' && (st.sel ? st.sel === tr.id : DK || tr.id !== 'subm')); }),
    L('общая сонная', V3(-2.4, 4.6, 1.5), VNx('car').col, () => st.mode === 'vn' && (!st.sel || st.sel === 'car')),
    L('внутренняя сонная', V3(-3.05, 11.4, 0.3), VNx('car').col, () => st.mode === 'vn' && st.sel === 'car'),
    L('наружная сонная', V3(-2.8, 11.2, 2.1), VNx('car').col, () => st.mode === 'vn' && st.sel === 'car'),
    L('лицевая артерия', V3(-4.3, 12.6, 3.8), VNx('car').col, () => st.mode === 'vn' && st.sel === 'car' && DK),
    L('верхняя щитовидная артерия', V3(-2.2, 7.3, 2.65), VNx('car').col, () => st.mode === 'vn' && st.sel === 'car', true),
    L('сонный синус', V3(-2.95, 8.9, 1.0), VNx('car').col, () => st.mode === 'vn' && st.sel === 'car', true),
    L('подключичная артерия', V3(-6.2, 0.9, -0.5), VNx('sub').col, () => st.mode === 'vn' && (!st.sel || st.sel === 'sub')),
    L('позвоночная артерия', V3(-1.85, 7.5, -2.05), VNx('sub').col, () => st.mode === 'vn' && st.sel === 'sub', true),
    L('внутренняя яремная вена', V3(-3.5, 7.5, 1.05), VNx('vein').col, () => st.mode === 'vn' && ((!st.sel && DK) || st.sel === 'vein')),
    L('наружная яремная вена', sp(R1 * 0.85, 6.5, -0.1), VNx('vein').col, () => st.mode === 'vn' && st.sel === 'vein'),
    L('подключичная вена', V3(-6.5, 0.3, 1.4), VNx('vein').col, () => st.mode === 'vn' && st.sel === 'vein'),
    L('блуждающий нерв', V3(-3.05, 6.6, 0.55), VNx('vagus').col, () => st.mode === 'vn' && (st.sel === 'vagus' || (!st.sel && DK)), true),
    L('возвратный гортанный нерв', V3(-1.2, 3.2, 0.85), VNx('vagus').col, () => st.mode === 'vn' && st.sel === 'vagus', true),
    L('диафрагмальный нерв', V3(-3.15, 4.6, 0.1), VNx('phren').col, () => st.mode === 'vn' && st.sel === 'phren', true),
    L('плечевое сплетение', V3(-5.9, 2.4, -1.05), VNx('phren').col, () => st.mode === 'vn' && (st.sel === 'phren' || !st.sel)),
    L('добавочный нерв', sp(R1 * 1.75, 6.2, 0.6), VNx('xi').col, () => st.mode === 'vn' && st.sel === 'xi'),
    L('подъязычный нерв', V3(-2.4, 10.5, 2.95), VNx('xii').col, () => st.mode === 'vn' && st.sel === 'xii'),
    L('шейная петля', V3(-3.1, 4.3, 1.95), VNx('xii').col, () => st.mode === 'vn' && st.sel === 'xii'),
    L('нервная точка', sp(R1 * (P(7.0) + 0.02), 7.0, -0.05), VNx('cerv').col, () => st.mode === 'vn' && st.sel === 'cerv'),
    L('большой ушной нерв', sp(R1 * 1.45, 11.6, -0.05), VNx('cerv').col, () => st.mode === 'vn' && st.sel === 'cerv'),
    L('надключичные нервы', sp(R1 * 1.0, 2.2, -0.05), VNx('cerv').col, () => st.mode === 'vn' && st.sel === 'cerv'),
    L('сонное влагалище', secP(-3.0, 2.75), SX('carsh').col, () => st.mode === 'sec' && (!st.sel || st.sel === 'carsh'), true),
    L('поверхностная пластинка', secP(-4.6, 4.0), SX('inv').col, () => st.mode === 'sec' && ((!st.sel && DK) || st.sel === 'inv')),
    L('предтрахеальная пластинка', secP(1.6, 3.85), SX('pre').col, () => st.mode === 'sec' && ((!st.sel && DK) || st.sel === 'pre')),
    L('предпозвоночная пластинка', secP(4.45, -3.2), SX('prev').col, () => st.mode === 'sec' && (!st.sel || st.sel === 'prev')),
    L('заглоточное пространство', secP(1.5, 0.75), SX('retro').col, () => st.mode === 'sec' && ((!st.sel && DK) || st.sel === 'retro')),
    L('опасное пространство', secP(-1.5, 0.55), '#B49CF0', () => st.mode === 'sec' && st.sel === 'retro', true),
    L('трахея', secP(0, 2.9), '#9CC8E2', () => st.mode === 'sec' && st.sel === 'pre'),
    L('пищевод', secP(-0.25, 1.38), '#E8A0A8', () => st.mode === 'sec' && (st.sel === 'pre' || st.sel === 'retro'), true),
    L('щитовидная железа', secP(1.9, 2.0), '#E890B8', () => st.mode === 'sec' && st.sel === 'pre'),
    L('общая сонная артерия', secP(2.55, 1.75), C.art, () => st.mode === 'sec' && st.sel === 'carsh', true),
    L('внутренняя яремная вена', secP(3.6, 2.2), '#8CA4FF', () => st.mode === 'sec' && st.sel === 'carsh'),
    L('блуждающий нерв', secP(2.97, 1.0), C.nerve, () => st.mode === 'sec' && st.sel === 'carsh', true),
    L('VII шейный позвонок', secP(0, -1.05), BONE, () => st.mode === 'sec' && ((!st.sel && DK) || st.sel === 'prev')),
    L('спинной мозг', secP(0, -2.75), '#F2E8D0', () => st.mode === 'sec' && st.sel === 'prev'),
    L('лестничные мышцы', secP(3.6, -1.35), M('scal').col, () => st.mode === 'sec' && st.sel === 'prev'),
    L('симпатический ствол', secP(1.9, 0.12), C.nerve, () => st.mode === 'sec' && (st.sel === 'carsh' || st.sel === 'prev'), true),
    L('диафрагмальный нерв', secP(2.78, 0.62), C.nerve, () => st.mode === 'sec' && st.sel === 'prev'),
    L('грудино-ключично-сосцевидная', secP(3.95, 2.35), M('scm').col, () => st.mode === 'sec' && (st.sel === 'inv' || (!st.sel && DK))),
    L('трапециевидная', secP(-3.25, -4.85), M('trap').col, () => st.mode === 'sec' && (st.sel === 'inv' || (!st.sel && DK)), true),
    L('подподъязычные мышцы', secP(-1.0, 4.6), M('infra').col, () => st.mode === 'sec' && st.sel === 'pre', true),
    L('спереди', secP(0, 5.6), '#9AA4B4', () => st.mode === 'sec' && DK, true),
    L('правая сторона', secP(6.6, -0.8), '#9AA4B4', () => st.mode === 'sec' && DK && !st.sel),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  // ---------- панель ----------
  const INTRO = {
    mus: '<b>Шея</b> соединяет голову с туловищем: в ней проходят дыхательные пути, пищевод, сосуды мозга и нервы к рукам и диафрагме. Каркас — семь шейных позвонков, подъязычная кость и гортань. Мышцы лежат слоями: подкожная, грудино-ключично-сосцевидная и трапециевидная, ленты спереди, лестничные в глубине.',
    tri: '<b>Треугольники шеи</b> — карта для врача. Грудино-ключично-сосцевидная мышца делит каждую сторону на передний треугольник (срединная линия, нижняя челюсть, мышца) и задний (мышца, трапециевидная, ключица). Двубрюшная и лопаточно-подъязычная мышцы делят их на меньшие, у каждого своё содержимое.',
    vn: '<b>Сосуды и нервы шеи.</b> Главный пучок — общая сонная артерия, внутренняя яремная вена и блуждающий нерв в одной фасциальной трубке, сонном влагалище, под грудино-ключично-сосцевидной мышцей (здесь она прозрачная). Глубже, на лестничных мышцах, лежат диафрагмальный нерв и плечевое сплетение.',
    sec: '<b>Разрез шеи на уровне VII шейного позвонка</b>, вид сверху, спереди — вверху. Фасции делят шею на футляры: поверхностная пластинка окружает всё, предтрахеальная — органы, предпозвоночная — позвоночник с мышцами, сонные влагалища — сосудисто-нервные пучки. По щелям между ними распространяются гной и кровь.',
  };
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = st.sel && PART[st.mode].find((q) => q.id === st.sel); ib.info.innerHTML = p ? p.text : INTRO[st.mode]; };
    refs.modeSeg = seg([{ id: 'mus', label: 'Мышцы' }, { id: 'tri', label: 'Треугольники' }, { id: 'vn', label: DK ? 'Сосуды и нервы' : 'Сосуды' }, { id: 'sec', label: 'Фасции' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px;min-height:' + (DK ? '160px' : '0') });
    refs.rebuild = () => {
      box.innerHTML = '';
      refs.seg = seg([{ id: 'all', label: 'Все' }, ...PART[st.mode].map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => select(v));
      box.append(h('div', { class: 'glabel' }, { mus: 'Мышцы', tri: 'Треугольники', vn: 'Сосуды и нервы', sec: 'Фасции и пространства' }[st.mode], h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, refs.lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['mus', 'tri', 'vn', 'sec'][n - 1]); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'tri') return [['Передних', '3 + 1', 'с каждой стороны и непарный'], ['Задних', 2, 'с каждой стороны']];
    if (st.mode === 'vn') return [['Сонная развилка', 'C4', 'верхний край щитовидного хряща'], ['Внутренняя сонная', 0, 'ветвей на шее']];
    if (st.mode === 'sec') return [['Уровень', 'C7', 'разрез'], ['Пластинок фасции', 3, 'и сонное влагалище']];
    return [['Позвонков', 7, 'шейных'], ['Подъязычная кость', 'C3', 'уровень позвонка']];
  }
  const accent = () => { const p = st.sel && PART[st.mode].find((q) => q.id === st.sel); return p ? p.col : '#E8735F'; };
  const self = {
    labelBg: true, mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return accent(); },
    kicker: 'Тело · опора и движение', title: 'Шея',
    lede: 'Узкий мост между головой и туловищем: через него идут воздух, пища, кровь к мозгу и нервы к рукам. Мышцы делят шею на треугольники — по ним врач находит пульс, лимфоузлы и сосуды.',
    notes: `
      <div><h2>Строение</h2>
        <p>Шея тянется от нижнего края нижней челюсти и основания черепа до ключиц, рукоятки грудины и VII шейного позвонка — его остистый отросток выступает сильнее всех и легко прощупывается. Ориентиры спереди: подъязычная кость на уровне C3, щитовидный хрящ — C4–C5, перстневидный — C6; ниже начинаются трахея и пищевод. Щитовидная железа обхватывает трахею под перстневидным хрящом, перешеек лежит на 2–4 кольцах.</p>
        <p>Мышцы удобно делить на слои: подкожная мышца шеи (мимическая, её иннервирует лицевой нерв); грудино-ключично-сосцевидная и трапециевидная — обе от добавочного нерва и обе в поверхностной пластинке фасции; над- и подподъязычные — поднимают и опускают подъязычную кость с гортанью; глубокие — лестничные и предпозвоночные.</p></div>
      <div><h2>Ориентиры</h2>
        <p>Пульс на сонной артерии ищут у переднего края грудино-ключично-сосцевидной мышцы на уровне щитовидного хряща — артерию прижимают к поперечному отростку C6. Наружная яремная вена набухает при натуживании, крике и сердечной недостаточности. Около середины заднего края грудино-ключично-сосцевидной мышцы из-под неё выходят кожные нервы шейного сплетения — нервная точка.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Трахеостомия</b> — разрез ниже перстневидного хряща через 2–4 кольца трахеи; на пути — перешеек щитовидной железы и вены. В экстренной ситуации быстрее коникотомия — через перстнещитовидную связку.</li>
        <li><b>Кривошея</b> — укорочение грудино-ключично-сосцевидной мышцы: голова наклонена к больной стороне, лицо повёрнуто в здоровую.</li>
        <li><b>Сужение внутренней сонной артерии</b> атеросклеротической бляшкой у развилки — частая причина инсульта; её видно на УЗИ, бляшку удаляют или ставят стент.</li>
        <li><b>Глубокие инфекции шеи</b> — заглоточный абсцесс, флегмона дна рта — расходятся по фасциальным щелям, вплоть до средостения.</li>
        <li><b>Увеличенный лимфоузел</b> на шее чаще всего связан с инфекцией горла или зубов; твёрдый безболезненный узел, который не уменьшается 3–4 недели, нужно показать врачу.</li>
        <li><b>Синдром верхней апертуры грудной клетки</b> — сдавление плечевого сплетения и подключичной артерии между лестничными мышцами (например, лишним шейным ребром): онемение и слабость руки.</li></ul></div>
      <div><h2>Условности</h2><ul><li>В объёмных режимах мышцы, сосуды и нервы построены схематично по атласу, без кожи, жира, лимфоузлов и слюнных желёз; голова и плечевой пояс показаны частично. Шилоподъязычная и подбородочно-подъязычная мышцы не показаны, две головки грудино-ключично-сосцевидной слиты.</li><li>Стороны симметричны, кроме начала сосудов в груди и возвратных гортанных нервов. Плечевое сплетение упрощено до пяти корней и трёх стволов; симпатический ствол показан только на разрезе.</li><li>Треугольники нанесены на упрощённую поверхность шеи. Разрез — схема на уровне C7 с кожей и подкожной клетчаткой, вид сверху (правая сторона человека справа); на КТ и в атласе разрезы обычно показывают снизу, зеркально.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим · <code>Esc</code> все части</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('mus'); st.fly = null; camera.position.copy(VIEW.mus.pos); controls.target.copy(VIEW.mus.target);
  return self;
}
