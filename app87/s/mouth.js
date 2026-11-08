import { LANG, THREE, V3, __set_rnd, envTex, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mulberry, pickOn, range, rnd, seg, toggle } from '../core.js';


// @scene mouth makeMouth | Полость рта и зубы | @body Системы органов
/* =========================================================
   ТЕЛО · ПОЛОСТЬ РТА И ЗУБЫ: открытый рот (нёбо, язык, миндалины, слюнные железы), зубные дуги и смена зубов с возрастом,
   продольный разрез моляра и развитие кариеса. Сверено с атласом Неттера (табл. 65–74).
   Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека. Разрез зуба увеличен.
   ========================================================= */
const MO_PARTS = [
  { id: 'teeth', name: 'Зубы', col: '#F3EEDF', text: '<b>Зубы.</b> У взрослого 32 зуба — по 8 в каждой четверти: 2 резца, клык, 2 премоляра и 3 моляра (формула 2-1-2-3). Резцы откусывают, клыки удерживают и рвут, премоляры и моляры дробят и перетирают пищу с силой до 500–700 Н. Третьи моляры — «зубы мудрости» — прорезаются последними, а у многих не прорезаются вовсе.' },
  { id: 'gum', name: 'Дёсны', col: '#E58C98', text: '<b>Десна</b> — слизистая, плотно приросшая к альвеолярным отросткам челюстей и охватывающая шейки зубов. Между её краем и зубом есть узкая десневая борозда глубиной 1–2 мм. Если в ней копится налёт, десна воспаляется и кровоточит (гингивит), а потом может разрушаться связка и кость вокруг зуба (пародонтит).' },
  { id: 'hard', name: 'Твёрдое нёбо', col: '#F0B8B0', text: '<b>Твёрдое нёбо</b> — костная крыша рта и одновременно дно носовой полости: передние ⅔ — нёбные отростки верхних челюстей, задняя ⅓ — горизонтальные пластинки нёбных костей. Слизистая собрана в поперечные складки — о них язык прижимает и растирает пищу. По середине идёт шов нёба, сразу за резцами — резцовый сосочек.' },
  { id: 'soft', name: 'Мягкое нёбо и язычок', col: '#E07A8A', text: '<b>Мягкое нёбо</b> — мышечная занавеска, продолжающая твёрдое нёбо назад; посередине свисает язычок. При глотании мышцы поднимают и натягивают его, и оно закрывает путь в носоглотку — пища не попадает в нос. Когда человек дышит носом, мягкое нёбо опущено и лежит на корне языка.' },
  { id: 'tons', name: 'Нёбные миндалины', col: '#D46A7A', text: '<b>Нёбные миндалины</b> лежат в нишах между передней нёбно-язычной и задней нёбно-глоточной дужками. Это лимфоидная ткань с глубокими щелями-криптами: она «пробует» всё, что попадает в рот, и запускает иммунный ответ. Вместе с язычной, глоточной (аденоиды) и трубными миндалинами — лимфоидное кольцо глотки. Их воспаление — ангина.' },
  { id: 'tongue', name: 'Язык', col: '#E89AA0', text: '<b>Язык</b> — мышечный орган: собственные мышцы меняют его форму, наружные двигают целиком. V-образная пограничная борозда делит его на тело (передние ⅔) и корень (задняя ⅓) с язычной миндалиной. Перед бороздой — крупные желобовидные сосочки, по спинке — нитевидные и грибовидные (красные точки).' },
  { id: 'glands', name: 'Слюнные железы', col: '#E8C46A', text: '<b>Слюнные железы</b> дают 0,5–1,5 л слюны в сутки. <b>Околоушная</b> — самая крупная; её проток открывается на щеке напротив второго верхнего моляра. <b>Поднижнечелюстная</b> даёт большую часть слюны в покое, её проток открывается на подъязычном сосочке у уздечки языка. <b>Подъязычная</b> — самая маленькая. Амилаза слюны начинает расщеплять крахмал.' },
];
const MO_TYPES = [
  { id: 'inc', name: 'Резцы', col: '#F2D16B', text: '<b>Резцы</b> — 8 передних зубов: коронка в виде долота с режущим краем, один корень. Откусывают пищу. Верхние центральные — самые широкие, нижние — самые узкие зубы во рту.' },
  { id: 'can', name: 'Клыки', col: '#F29A5C', text: '<b>Клыки</b> — 4 зуба с одним острым бугром и самым длинным корнем (у верхнего — до 17 мм). Удерживают и рвут пищу, при боковых движениях челюсти первыми принимают нагрузку.' },
  { id: 'pm', name: 'Премоляры', col: '#7FD39A', text: '<b>Премоляры</b> (малые коренные) — 8 зубов с двумя буграми, щёчным и язычным. Начинают дробить пищу. У молочных зубов премоляров нет: они вырастают на месте молочных моляров.' },
  { id: 'mol', name: 'Моляры', col: '#7FB8F0', text: '<b>Моляры</b> (большие коренные) — 12 зубов с 4–5 буграми; у верхних обычно три корня, у нижних два. Перетирают пищу. Первый постоянный моляр прорезывается первым из постоянных зубов — около 6 лет, позади молочных, поэтому его часто принимают за молочный.' },
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
  [0.5, '<b>Первые месяцы.</b> Зубов во рту ещё нет, но в челюстях уже лежат зачатки всех 20 молочных зубов, а коронки первых постоянных моляров начинают обызвествляться.'],
  [2.6, '<b>Прорезываются молочные зубы.</b> Первыми обычно появляются нижние центральные резцы (около 6–10 месяцев), последними — вторые молочные моляры (к 2–3 годам). Сроки у разных детей сдвигаются на несколько месяцев — это норма.'],
  [6, '<b>Молочный прикус:</b> 20 зубов, по 5 в каждой четверти — 2 резца, клык и 2 моляра (формула 2-1-0-2). Молочные зубы меньше и белее, эмаль у них тоньше — кариес развивается быстрее. Они держат место для постоянных: если молочный зуб рано удалить, соседние сдвигаются.'],
  [12.4, '<b>Сменный прикус.</b> Около 6 лет позади молочных зубов прорезаются первые постоянные моляры — без смены, на свободное место. Потом корни молочных зубов рассасываются, они выпадают, и на их место встают постоянные: резцы, клыки, а вместо молочных моляров — премоляры.'],
  [17, '<b>Постоянный прикус.</b> К 12–13 годам прорезаются вторые моляры, и зубов становится 28. Челюсти ещё растут, а корни последних зубов формируются до 14–15 лет.'],
  [99, '<b>Зубы мудрости.</b> Третьи моляры прорезываются в 17–25 лет, а то и позже. Челюсти у современного человека короче, чем у предков, и места часто не хватает: зуб остаётся в кости (ретенция) или растёт наклонно и упирается в соседний. У части людей зачатков зубов мудрости нет вовсе.'],
];
const MO_LAY = [
  { id: 'enamel', name: 'Эмаль', col: '#F6F3EA', text: '<b>Эмаль</b> — самая твёрдая ткань тела: на 96 % из кристаллов гидроксиапатита. Покрывает коронку слоем до 2–2,5 мм на буграх и истончается к шейке. В эмали нет клеток, сосудов и нервов: она не болит и не отрастает заново — только на ранней стадии повреждения возвращает минералы из слюны и фтора.' },
  { id: 'dentin', name: 'Дентин', col: '#E8CC92', text: '<b>Дентин</b> — основная масса зуба, мягче эмали (около 70 % минералов), желтоватый. Его пронизывают трубочки с отростками клеток-одонтобластов: холод, сладкое и кислое двигают жидкость в них и раздражают нервы пульпы — поэтому открытый дентин чувствителен. Дентин откладывается всю жизнь, и полость зуба сужается.' },
  { id: 'pulp', name: 'Пульпа', col: '#E46A78', text: '<b>Пульпа</b> — «нерв» зуба: рыхлая соединительная ткань с сосудами и нервами в полости коронки и корневых каналах. Они входят через верхушечное отверстие на конце корня. По краю пульпы лежат одонтобласты, которые строят дентин. Воспалённой пульпе некуда отекать — её сжимают твёрдые стенки, отсюда сильная боль при пульпите.' },
  { id: 'cement', name: 'Цемент', col: '#CDB98C', text: '<b>Цемент</b> — тонкий, похожий на кость слой на поверхности корня. В него вплетаются волокна периодонтальной связки, которые держат зуб в лунке.' },
  { id: 'pdl', name: 'Периодонт', col: '#C8807A', text: '<b>Периодонтальная связка</b> (периодонт) — щель шириной 0,1–0,3 мм между корнем и стенкой лунки, заполненная пучками коллагеновых волокон. Зуб не сращён с костью, а подвешен на этих волокнах и слегка пружинит при жевании; рецепторы связки чувствуют силу нажатия. На рисунке щель показана шире, чем на деле.' },
  { id: 'gum3', name: 'Десна', col: '#E58C98', text: '<b>Десна</b> охватывает шейку зуба и прикрепляется к ней и к кости. Между свободным краем десны и эмалью остаётся десневая борозда глубиной 1–2 мм — здесь начинается воспаление при плохой чистке.' },
  { id: 'bone', name: 'Кость', col: '#D9CDB6', text: '<b>Альвеолярный отросток</b> челюсти — кость с лунками для корней. Он существует, пока есть зубы: после удаления зуба кость лунки постепенно убывает. Под корнями нижних зубов в кости проходит нижнечелюстной канал с одноимёнными нервом и сосудами; от них к каждому зубу идут веточки.' },
];
const MO_CAR = [
  { c: 0, name: 'Здоровый зуб', pv: 'нет', pain: '', text: '<b>Строение зуба</b> — продольный разрез нижнего первого моляра. Коронка покрыта эмалью, корни — цементом, под ними — дентин, в центре — пульпа с сосудами и нервами. Корни сидят в лунках челюсти на периодонтальной связке. Двигайте ползунок «Кариес», чтобы увидеть, как развивается разрушение, или выберите слой.' },
  { c: 0.03, name: 'Белое пятно', pv: 'нет', pain: '', text: '<b>Белое пятно.</b> Бактерии зубного налёта (прежде всего <i>Streptococcus mutans</i>) сбраживают сахара в кислоты. Когда pH на поверхности падает ниже ~5,5, эмаль теряет минералы — появляется меловое пятно. Поверхность ещё цела, и процесс обратим: фтор и слюна возвращают минералы.' },
  { c: 0.2, name: 'Кариес эмали', pv: 'нет', pain: '', text: '<b>Кариес эмали.</b> Поверхность разрушилась — образовалась полость. Чаще всего кариес начинается в фиссурах — бороздах между буграми — и на контактных поверхностях, где налёт трудно счистить. В эмали нет нервов, поэтому зуб ещё не болит. Нужна пломба.' },
  { c: 0.4, name: 'Кариес дентина', pv: 'есть', pain: 'от сладкого и холода', text: '<b>Кариес дентина.</b> Дентин мягче эмали, и кариес расползается в нём вширь, подрывая эмаль: снаружи маленькое отверстие, внутри большая полость. Через дентинные трубочки раздражение доходит до пульпы: короткая боль от сладкого, холодного или кислого, которая проходит, как только раздражитель убран.' },
  { c: 0.7, name: 'Пульпит', pv: 'есть', pain: 'сильная, ночью', text: '<b>Пульпит.</b> Бактерии добрались до пульпы. Она воспаляется и отекает, но расшириться внутри твёрдых стенок ей некуда — давление сжимает нервы. Боль сильная, приступами, возникает сама, часто ночью и отдаёт в ухо или висок. Лечение — удалить пульпу и запломбировать каналы.' },
  { c: 0.86, name: 'Периодонтит', pv: 'есть', pain: 'при накусывании', text: '<b>Периодонтит.</b> Пульпа погибла, инфекция вышла через верхушечное отверстие в кость. У верхушки корня возникает очаг воспаления — гнойник или гранулёма. Зуб болит при накусывании, может появиться флюс — отёк десны и щеки. Без лечения кость вокруг верхушки разрушается.' },
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
  const ageWord = (a) => (a < 2 ? 'мес' : a % 10 >= 2 && a % 10 <= 4 && (a < 10 || a > 20) ? 'года' : a % 10 === 1 && a !== 11 ? 'год' : 'лет');
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
    lb('твёрдое нёбо', uw(V3(0.45, 2.15, -0.7)), P('hard').col, () => none() || sel('hard')),
    lb('поперечные складки', uw(V3(-0.6, 1.62, 1.25)), P('hard').col, () => sel('hard'), true),
    lb('резцовый сосочек', uw(V3(0, 1.45, 1.95)), P('hard').col, () => sel('hard')),
    lb('шов нёба', uw(V3(0, 2.0, -0.9)), P('hard').col, () => sel('hard')),
    lb('мягкое нёбо', uw(V3(1.0, 1.75, -3.05)), P('soft').col, () => (none() && DK) || sel('soft')),
    lb('язычок', uw(V3(0, 0.35, -3.6)), P('soft').col, () => none() || sel('soft')),
    lb('нёбная миндалина', () => ARCHES[1].tons.position.clone().add(V3(-0.35, -0.25, 0.25)), P('tons').col, () => (none() && DK) || sel('tons'), true),
    lb('нёбно-язычная дужка', () => ARCHES[0].pg.geometry.parameters ? ARCHES[0].pg.geometry.parameters.path.getPoint(0.55) : V3(), P('tons').col, () => sel('tons')),
    lb('нёбно-глоточная дужка', () => ARCHES[1].pp.geometry.parameters ? ARCHES[1].pp.geometry.parameters.path.getPoint(0.3) : V3(), P('tons').col, () => sel('tons'), true),
    lb('язык', tTop(0.45, 0.3), P('tongue').col, () => none()),
    lb('тело языка', tTop(0.9, 0.5), P('tongue').col, () => sel('tongue')),
    lb('корень языка', tTop(-0.9, -2.6), P('tongue').col, () => sel('tongue'), true),
    lb('желобовидные сосочки', tTop(0.75, -1.0), '#FFD8D6', () => sel('tongue')),
    lb('пограничная борозда', tTop(-0.55, -1.42), '#FFD8D6', () => sel('tongue'), true),
    lb('грибовидные сосочки', tTop(-0.8, 0.8), '#FF8A94', () => sel('tongue'), true),
    lb('язычная миндалина', tTop(0.5, -2.4), '#E8A0AA', () => sel('tongue') && DK),
    lb('десна', lw(V3(1.0, -0.95, 2.05)), P('gum').col, () => sel('gum') || (none() && DK)),
    lb('десна', uw(V3(-1.0, 1.0, 2.25)), P('gum').col, () => sel('gum'), true),
    lb('резцы', slotW('u', 1, 0, 0.6, 0.2), MO_TYPES[0].col, () => sel('teeth')),
    lb('клык', slotW('u', 1, 2, 0.7, 0.2), MO_TYPES[1].col, () => sel('teeth')),
    lb('премоляры', slotW('u', 1, 3, 0.7, 0.2), MO_TYPES[2].col, () => sel('teeth')),
    lb('моляры', slotW('u', 1, 5, 0.7, 0.2), MO_TYPES[3].col, () => sel('teeth')),
    lb('зубы', slotW('u', -1, 2, 0.7, 0.3), P('teeth').col, () => none() && DK, true),
    lb('околоушная железа', uw(V3(3.9, 2.75, -3.6)), P('glands').col, () => sel('glands')),
    lb('проток околоушной железы', uw(V3(3.5, 1.0, -1.85)), '#F5DA8A', () => sel('glands')),
    lb('поднижнечелюстная железа', lw(V3(2.6, -3.1, -1.4)), P('glands').col, () => sel('glands')),
    lb('подъязычная железа', lw(V3(-1.0, -1.95, 0.55)), P('glands').col, () => sel('glands'), true),
    lb('подъязычный сосочек', lw(V3(0.22, -1.38, 1.62)), '#F5DA8A', () => sel('glands')),
    // зубы и возраст
    lb('верхние зубы', () => UA.localToWorld(V3(0, 0, DK ? -2.75 : -2.5)), '#C8D2E0', () => T2()),
    lb('нижние зубы', () => LA.localToWorld(V3(0, 0, DK ? -2.7 : -2.45)), '#C8D2E0', () => T2()),
    lb('резцы', slotW('l', 1, 0, 0.35), MO_TYPES[0].col, () => Ttype('inc') && (anyT(0, false) || anyT(0, true))),
    lb('клык', slotW('l', -1, 2, -0.6), MO_TYPES[1].col, () => Ttype('can') && (anyT(2, false) || anyT(2, true))),
    lb('премоляры', slotW('l', -1, 3, -0.7), MO_TYPES[2].col, () => Ttype('pm') && anyT(3, false)),
    lb('молочные', slotW('l', -1, 4, -0.7), '#C8E4FF', () => Ttype('mol') && anyT(3, true)),
    lb('моляры', slotW('l', -1, 5, -0.75), MO_TYPES[3].col, () => Ttype('mol') && anyT(5, false)),
    lb('зуб мудрости', slotW('l', -1, 7, -0.75), MO_TYPES[3].col, () => Ttype('mol') && anyT(7, false)),
    // разрез зуба
    lb('эмаль', tw(-5.0, 4.6), MO_LAY[0].col, () => lay('enamel'), true),
    lb('дентин', tw(3.6, 3.6), MO_LAY[1].col, () => lay('dentin')),
    lb('пульпа', tw(1.7, 0.2), '#FF9AA4', () => lay('pulp')),
    lb('корневой канал', tw(2.95, -9), '#FF9AA4', () => st.mode === 'tooth' && st.lay === 'pulp'),
    lb('нерв и сосуды', tw(-2.9, -9.5), '#FFE27A', () => st.mode === 'tooth' && (st.lay === 'pulp' || (!st.lay && DK)), true),
    lb('цемент', tw(-4.5, -5.5), MO_LAY[3].col, () => lay('cement'), true),
    lb('периодонт', tw(4.5, -8), MO_LAY[4].col, () => lay('pdl')),
    lb('десна', tw(-7.2, 0.4), MO_LAY[5].col, () => lay('gum3'), true),
    lb('кость', tw(6.8, -6), MO_LAY[6].col, () => lay('bone')),
    lb('нижнечелюстной канал', tw(5.5, -16.9), '#E8D0B0', () => st.mode === 'tooth' && (st.lay === 'bone' || (!st.lay && DK))),
    lb('верхушечное отверстие', tw(3.0, -13.9), '#FF9AA4', () => st.mode === 'tooth' && st.lay === 'pulp'),
    lb('белое пятно', tw(-2.2, 6.4), '#FFFFFF', () => st.mode === 'tooth' && st.carS > 0.06 && st.carS < 0.24, true),
    lb('кариозная полость', tw(-1.6, 6.9), '#F2B880', () => st.mode === 'tooth' && st.carS >= 0.24, true),
    lb('гнойник', tw(-3.0, -15.4), '#F2DC80', () => st.mode === 'tooth' && st.carS > 0.9, true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  // ---------- панель ----------
  const INTRO = '<b>Полость рта</b> — начало пищеварительного тракта: здесь пищу откусывают, разжёвывают, смачивают слюной и собирают в комок для глотания, а язык, губы и нёбо формируют звуки речи. Сверху — нёбо, снизу — язык и дно рта, впереди — зубы и губы, сзади зев ведёт в глотку. Нажмите на часть или выберите её ниже.';
  const ageText = () => MO_AGE.find(([a]) => 25 * st.ageV * st.ageV < a)[1];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => {
      ib.info.innerHTML = st.mode === 'teeth' ? (st.ty ? MO_TYPES.find((t) => t.id === st.ty).text : ageText())
        : st.mode === 'tooth' ? (st.lay ? MO_LAY.find((l) => l.id === st.lay).text : MO_CAR[carStage()].text)
          : st.sel ? P(st.sel).text : INTRO;
    };
    refs.modeSeg = seg([{ id: 'mouth', label: 'Полость рта' }, { id: 'teeth', label: 'Зубы и возраст' }, { id: 'tooth', label: 'Строение зуба' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.seg = refs.lseg = null;
      if (st.mode === 'mouth') { refs.seg = seg([{ id: 'all', label: 'Все' }, ...MO_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => select(v)); box.append(h('div', { class: 'glabel' }, 'Части', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)); }
      else if (st.mode === 'teeth') {
        let last = -1;
        box.append(h('div', { class: 'glabel' }, 'Возраст'), h('div', { class: 'gctl' }, range('moAge', 0, 1, 0.005, () => st.ageV, (v) => { st.ageV = v; const b = MO_AGE.findIndex(([a]) => 25 * v * v < a); if (b !== last) { last = b; refs.setInfo(); } }, ageFmt)));
        box.append(h('div', { class: 'glabel' }, 'Зубы'), h('div', { class: 'gctl' }, seg([{ id: 'all', label: 'Все' }, ...MO_TYPES.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.ty || 'all', (v) => { st.ty = v === 'all' ? null : v; refs.setInfo(); })));
      } else {
        let last = -1;
        box.append(h('div', { class: 'glabel' }, 'Кариес'), h('div', { class: 'gctl' }, range('moCar', 0, 1, 0.01, () => st.car, (v) => { st.car = v; if (st.lay) selLay('all'); const s = carStage(); if (s !== last) { last = s; refs.setInfo(); } }, (v) => MO_CAR[stageOf(v)].name)));
        refs.lseg = seg([{ id: 'all', label: 'Все' }, ...MO_LAY.map((l) => ({ id: l.id, label: l.name, color: l.col }))], () => st.lay || 'all', (v) => selLay(v));
        box.append(h('div', { class: 'glabel' }, 'Слои', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.lseg));
      }
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, refs.lab), ib.el);
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
      return [['Возраст', a < 2 ? Math.round(a * 12) : Math.floor(a), ageWord(a < 2 ? a : Math.floor(a))], ['Молочных', dec, 'из 20'], ['Постоянных', per, 'из 32']];
    }
    if (st.mode === 'tooth') { const s = MO_CAR[carStage()], dd = cavDepth(st.carS); return [['Глубина', dd > 0.01 ? (dd * 3.3).toFixed(1).replace('.', LANG === 'ru' ? ',' : '.') : '0', 'мм'], ['Боль', s.pv, s.pain]]; }
    return [['Зубов', 32, 'у взрослого'], ['Слюна', '0,5–1,5', 'л в сутки']];
  }
  const self = {
    labelBg: true, mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'mouth' && st.sel ? P(st.sel).col : st.mode === 'tooth' ? '#E8CC92' : '#F3EEDF'; },
    kicker: 'Тело · системы органов', title: 'Полость рта и зубы',
    lede: 'Здесь начинается пищеварение: 32 зуба режут и перетирают пищу, язык перемешивает её со слюной, нёбо и миндалины охраняют вход в глотку. А зубы за жизнь меняются один раз — с 20 молочных на 32 постоянных.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Полость рта делится на преддверие (щель между губами, щеками и зубами) и собственно полость рта внутри зубных дуг. Её крыша — твёрдое и мягкое нёбо, дно — мышцы (прежде всего челюстно-подъязычная) с языком, сзади через зев она переходит в глотку. Зев ограничен мягким нёбом, двумя парами дужек и корнем языка.</p>
        <p>Чувствительность зубов и дёсен даёт тройничный нерв: верхние зубы — веточки верхнечелюстного нерва (V₂), нижние — нижний альвеолярный нерв из нижнечелюстного (V₃). Передние ⅔ языка: общая чувствительность — язычный нерв (V₃), вкус — барабанная струна лицевого нерва (VII); задняя ⅓ — языкоглоточный нерв (IX). Мышцы языка двигает подъязычный нерв (XII), кроме нёбно-язычной (блуждающий нерв, X).</p></div>
      <div><h2>Зубы</h2>
        <p>Молочных зубов 20 (в каждой четверти 2 резца, клык, 2 моляра), постоянных 32 (2 резца, клык, 2 премоляра, 3 моляра). Стоматологи нумеруют их двумя цифрами: первая — четверть (1–4 у постоянных, 5–8 у молочных), вторая — место от середины; например, 36 — нижний левый первый моляр.</p>
        <p>Нижние зубы обезболивают «проводниковой» анестезией: лекарство вводят у отверстия нижней челюсти, где в кость входит нижний альвеолярный нерв, — немеет половина нижней челюсти, нижней губы и подбородка. Кость верхней челюсти тонкая и пористая, поэтому верхние зубы обычно обезболивают уколом рядом с зубом.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Кариес</b> — самое частое заболевание человека. Профилактика: меньше частых перекусов сладким, чистка пастой с фтором дважды в день, герметизация фиссур у детей.</li>
        <li><b>Пародонтит</b> — воспаление тканей вокруг зуба с убылью кости; наряду с кариесом главная причина потери зубов у взрослых. Курение и диабет его ускоряют.</li>
        <li><b>Паротит</b> («свинка») — вирусное воспаление околоушных желёз; от него прививают.</li>
        <li><b>Камни слюнных желёз</b> чаще всего образуются в поднижнечелюстной: её проток идёт вверх, а слюна гуще. Признак — припухлость под челюстью во время еды.</li>
        <li><b>Ангина</b> (острый тонзиллит) — воспаление нёбных миндалин; бактериальную (стрептококковую) лечат антибиотиком, чтобы избежать осложнений на сердце и почки.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Формы схематичны и построены по атласу; язык, нёбо, дужки и миндалины упрощены; губы, щёки, мышцы дна рта, кости челюстей, сосуды и нервы не показаны; рот открыт шире обычного, а слюнные железы видны сквозь ткани.</li><li>В режиме «Зубы и возраст» сроки прорезывания средние, челюсти растут упрощённо (равномерным масштабом), а зачатки постоянных зубов в кости не показаны. Молочные зубы окрашены бледными оттенками тех же цветов, что и постоянные; молочные моляры стоят на местах будущих премоляров.</li><li>Разрез зуба показан крупным планом; периодонтальная щель и цемент нарисованы толще, чем на деле. Кариес изображён в одной фиссуре, стадии на деле переходят друг в друга годами.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('mouth'); st.fly = null; camera.position.copy(VIEW.mouth.pos); controls.target.copy(VIEW.mouth.target);
  return self;
}
export { makeMouth };
