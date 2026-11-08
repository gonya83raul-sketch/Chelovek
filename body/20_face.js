// @scene face makeFace | Мимика и жевание | @body Опора и движение
/* =========================================================
   ТЕЛО · МИМИКА И ЖЕВАНИЕ: мимические мышцы на скане черепа и выражения лица, лицевой нерв и околоушная железа;
   жевательные мышцы и движения нижней челюсти; разрез височно-нижнечелюстного сустава при открывании рта.
   Сверено с атласом Неттера (табл. 25, 31, 54–56). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   Начало координат — точка скана черепа (MX, 16.0, 0.6), 1 ед. скана ≈ 12,5 см (как в сцене nose).
   ========================================================= */
const FA_MUS = [
  { id: 'front', name: 'лобное брюшко', text: '<b>Лобное брюшко</b> затылочно-лобной мышцы начинается от сухожильного шлема на своде черепа и вплетается в кожу бровей. Сокращаясь, оно поднимает брови и собирает лоб в поперечные морщины — так выглядят удивление и внимание.' },
  { id: 'oculi', name: 'круговая мышца глаза', text: '<b>Круговая мышца глаза</b> — кольцо вокруг глазной щели. Вековая часть в веках смыкает их при моргании и во сне, глазничная часть по краю глазницы с силой зажмуривает глаза и собирает у их углов «гусиные лапки». Слёзная часть помогает оттоку слёз.' },
  { id: 'corr', name: 'сморщивающая бровь', text: '<b>Мышца, сморщивающая бровь,</b> лежит под лобным брюшком и круговой мышцей глаза: от носовой части лобной кости к коже середины брови. Тянет брови вниз и к середине — над переносицей появляются вертикальные складки хмурости и сосредоточенности.' },
  { id: 'proc', name: 'мышца гордецов', text: '<b>Мышца гордецов</b> — небольшая полоска на спинке носа: от носовых костей к коже между бровями. Опускает кожу межбровья, и на переносице появляются поперечные складки — выражение угрозы, неприязни или напряжения.' },
  { id: 'nasal', name: 'носовая', text: '<b>Носовая мышца.</b> Её поперечная часть идёт от верхней челюсти над клыком через спинку носа к сухожилию на ней и сжимает ноздрю. Крыльная часть оттягивает крыло носа вниз и расширяет ноздрю — так «раздуваются ноздри» при глубоком вдохе и гневе.' },
  { id: 'llab', name: 'поднимающая верхнюю губу', text: '<b>Мышца, поднимающая верхнюю губу,</b> начинается у нижнего края глазницы, над подглазничным отверстием, и вплетается в верхнюю губу. Поднимает и выворачивает губу, углубляя носогубную складку, — при брезгливости, плаче, зажмуривании.' },
  { id: 'zmin', name: 'малая скуловая', text: '<b>Малая скуловая мышца</b> идёт от скуловой кости к верхней губе, медиальнее большой. Приподнимает верхнюю губу и углубляет носогубную складку; работает в улыбке и в печальном выражении лица.' },
  { id: 'zmaj', name: 'большая скуловая', text: '<b>Большая скуловая мышца</b> — главная мышца улыбки: от скуловой кости к углу рта, где вплетается в модиолус — узел, в котором сходятся волокна нескольких мышц. Тянет угол рта вверх и в сторону. Иногда она раздвоена — тогда при улыбке на щеке видна ямочка.' },
  { id: 'ris', name: 'мышца смеха', text: '<b>Мышца смеха</b> — тонкий и непостоянный пучок: от фасции над околоушной железой и жевательной мышцей к углу рта. Тянет угол рта прямо в сторону — широкая улыбка, оскал, гримаса напряжения.' },
  { id: 'oris', name: 'круговая мышца рта', text: '<b>Круговая мышца рта</b> — основа губ. Её волокна не прикрепляются к кости, а переплетаются у углов рта с волокнами других мышц. Смыкает и сжимает губы, вытягивает их «трубочкой»; без неё невозможны речь, свист, питьё и удержание пищи во рту.' },
  { id: 'dao', name: 'опускающая угол рта', text: '<b>Мышца, опускающая угол рта,</b> треугольная: широким основанием начинается от нижней челюсти, верхушкой подходит к углу рта. Тянет угол рта вниз и в сторону — выражение грусти, недовольства, сомнения.' },
  { id: 'dli', name: 'опускающая нижнюю губу', text: '<b>Мышца, опускающая нижнюю губу,</b> идёт от нижней челюсти, глубже треугольной мышцы, к коже нижней губы. Тянет губу вниз и в сторону, обнажая нижние зубы, — при брезгливости, испуге и в речи.' },
  { id: 'ment', name: 'подбородочная', text: '<b>Подбородочная мышца</b> идёт от альвеол нижних резцов вниз, к коже подбородка. Поднимает и морщит кожу подбородка («апельсиновая корка») и выпячивает нижнюю губу — при обиде, сомнении, перед плачем.' },
  { id: 'bucc', name: 'щёчная', text: '<b>Щёчная мышца</b> — основа щеки: от челюстей у коренных зубов и от крыловидно-нижнечелюстного шва к углу рта. Прижимает щёку к зубам, чтобы пища не застревала за ними, и выталкивает воздух, когда задуваешь свечу или играешь на трубе.' },
  { id: 'plat', name: 'платизма', text: '<b>Подкожная мышца шеи</b> (платизма) — тонкий широкий пласт под кожей шеи: от кожи над ключицей и грудью до края нижней челюсти и угла рта. Тянет углы рта вниз и натягивает кожу шеи — при испуге и сильном напряжении.' },
];
const FA_EXP = [
  { id: 'rest', name: 'Покой', act: {} },
  { id: 'smile', name: 'Улыбка', act: { zmaj: 1, zmin: 0.5, ris: 0.45, oculi: 0.35, llab: 0.25 }, text: '<b>Улыбка.</b> Большая скуловая мышца тянет углы рта вверх и в стороны, малая скуловая и поднимающая верхнюю губу приподнимают губу, мышца смеха растягивает рот. В искренней улыбке включается и глазничная часть круговой мышцы глаза — у глаз собираются «гусиные лапки».' },
  { id: 'surp', name: 'Удивление', act: { front: 1, oculi: -0.7 }, text: '<b>Удивление.</b> Лобные брюшка поднимают брови, лоб собирается в поперечные морщины. Глаза широко открываются: верхнее веко поднимает уже не мимическая мышца, а мышца, поднимающая верхнее веко (её иннервирует глазодвигательный нерв). Рот часто приоткрыт.' },
  { id: 'frown', name: 'Хмурость', act: { corr: 1, proc: 1, oculi: 0.3 }, text: '<b>Хмурость.</b> Мышцы, сморщивающие брови, сводят брови к середине и опускают их — появляются вертикальные складки, а мышца гордецов опускает кожу межбровья — на переносице появляются поперечные. Глазничная часть круговой мышцы прищуривает глаза.' },
  { id: 'sad', name: 'Грусть', act: { dao: 1, ment: 0.6, corr: 0.5, front: 0.35, dli: 0.3 }, text: '<b>Грусть.</b> Мышцы, опускающие углы рта, тянут их вниз; подбородочная поднимает кожу подбородка и выпячивает нижнюю губу. Внутренние концы бровей поднимаются (медиальные волокна лобного брюшка) и сдвигаются к середине (мышцы, сморщивающие брови).' },
  { id: 'squeeze', name: 'Зажмуриться', act: { oculi: 1, corr: 0.7, proc: 0.7, nasal: 0.7, llab: 0.5, zmaj: 0.2 }, text: '<b>Зажмуривание.</b> Круговые мышцы глаз сокращаются целиком, вместе с глазничной частью: веки плотно смыкаются, брови опускаются, кожа вокруг глаз собирается в складки. С ними работают мышцы, сморщивающие брови, мышца гордецов, носовая и поднимающая верхнюю губу.' },
  { id: 'pucker', name: '«Трубочка»', act: { oris: 1, ment: 0.4, bucc: 0.5 }, text: '<b>«Трубочка».</b> Круговая мышца рта сжимает губы и вытягивает их вперёд — для свиста, поцелуя, питья через соломинку. Щёчные мышцы прижимают щёки к зубам, подбородочная поднимает кожу подбородка.' },
];
const FA_MAS = [
  { id: 'temp', name: 'Височная мышца', col: '#F0A050', text: '<b>Височная мышца</b> веером начинается в височной ямке и от височной фасции; её сухожилие проходит под скуловой дугой к венечному отростку. Передние волокна поднимают челюсть, задние, почти горизонтальные, оттягивают её назад. Когда стискиваешь зубы, она напрягается на виске.' },
  { id: 'mass', name: 'Жевательная', col: '#E8505E', text: '<b>Жевательная мышца</b> — самая сильная из четырёх: от скуловой дуги к наружной поверхности ветви и угла челюсти. Поверхностная часть идёт косо назад, глубокая — почти вертикально. Мощно поднимает челюсть; её легко нащупать на щеке, стиснув зубы.' },
  { id: 'medp', name: 'Медиальная крыловидная', col: '#B87BE0', text: '<b>Медиальная крыловидная мышца</b> — от ямки между пластинками крыловидного отростка и от бугра верхней челюсти к внутренней поверхности угла челюсти. Поднимает челюсть, помогает выдвигать её и сдвигать в противоположную сторону. С жевательной образует петлю вокруг угла.' },
  { id: 'latp', name: 'Латеральная крыловидная', col: '#45C4B0', text: '<b>Латеральная крыловидная мышца</b> идёт почти горизонтально: верхняя головка — от большого крыла клиновидной кости к суставному диску и капсуле, нижняя — от крыловидного отростка к шейке мыщелка. Выдвигает челюсть, начинает открывание рта; сокращаясь с одной стороны, сдвигает челюсть в противоположную.' },
];
const FA_MOVE = [
  { id: 'close', name: 'Сомкнуть', text: '<b>Смыкание.</b> Челюсть поднимают височные, жевательные и медиальные крыловидные мышцы. Жевательная и медиальная крыловидная охватывают угол челюсти с двух сторон, как петля. Сила смыкания на коренных зубах у взрослого — обычно 40–80 кг.' },
  { id: 'open', name: 'Открыть', text: '<b>Открывание.</b> Нижние головки латеральных крыловидных мышц тянут мыщелки вперёд, на суставные бугорки, а мышцы под подбородком (двубрюшная и другие надподъязычные; здесь не показаны) опускают челюсть. Поднимающие мышцы в это время расслаблены и растягиваются.' },
  { id: 'prot', name: 'Выдвинуть', text: '<b>Выдвижение.</b> Обе латеральные крыловидные мышцы одновременно тянут мыщелки вперёд и вниз по суставным бугоркам, им помогают медиальные крыловидные. Нижние резцы выходят вперёд верхних. Назад челюсть возвращают задние волокна височных мышц.' },
  { id: 'side', name: 'В сторону', text: '<b>Сдвиг в сторону.</b> Челюсть уходит влево: правый мыщелок выезжает вперёд на бугорок (его тянут правые латеральная и медиальная крыловидные), а левый почти на месте поворачивается вокруг вертикальной оси. Так зубы перетирают пищу.' },
  { id: 'chew', name: 'Жевать', text: '<b>Жевание</b> — цикл около секунды: челюсть опускается, уходит в рабочую сторону, с силой поднимается и, скользя зубами по зубам, возвращается к середине. Ритм задаёт генератор в стволе мозга, а силу подстраивают рецепторы в связках зубов.' },
];
const FA_TMJ = [
  [0.03, '<b>Височно-нижнечелюстной сустав</b>, разрез через правый мыщелок. Головка нижней челюсти лежит в суставной ямке височной кости, впереди — суставной бугорок. Между ними — диск из плотной волокнистой ткани; он делит сустав на верхний и нижний этажи. Двигайте ползунок — рот откроется.'],
  [0.4, '<b>Вращение.</b> В начале открывания (примерно до 20–25 мм между резцами) головка поворачивается под диском, как в шарнире, — работает нижний этаж сустава. Мыщелок почти не смещается, а подбородок опускается и немного уходит назад.'],
  [1.01, '<b>Скольжение.</b> Дальше латеральная крыловидная мышца тянет головку вместе с диском вперёд, на суставной бугорок, — работает верхний этаж. Диск поворачивается назад относительно головки, ретродискальная ткань растягивается. Обычно рот открывается на 40–50 мм.'],
];
function makeFace() {
  rnd = mulberry(2003);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const sideL = new THREE.DirectionalLight(0xfff0e6, 0.0); sideL.position.set(-7, 9, 7); scene.add(sideL);   // подсветка сбоку — для режимов 2–3
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = {
    mim: flyTarget(DK ? V3(-12, -3.0, 2) : V3(0, -1.4, 1.5), DK ? V3(-31, 3.1, 55) : V3(-11, 1.8, 47)),
    front: flyTarget(DK ? V3(-9.5, -1.9, 2) : V3(0, -3, 1.5), DK ? V3(-17, 4.1, 67) : V3(-4, 1, 58)),   // анфас — для паралича
    chew: flyTarget(DK ? V3(-5, -0.6, -10.0) : V3(-5, -1.9, -2.0), DK ? V3(-66, 0.6, 2) : V3(-55, 1.6, 12)),
    chewF: flyTarget(DK ? V3(-8, -1.8, 0) : V3(0, -3, 0), DK ? V3(-16, 0.5, 64) : V3(-5, -1, 60)),   // анфас — сдвиг в сторону
    ptg: flyTarget(DK ? V3(-4, -1.1, -12.0) : V3(-4, -4, -2.0), DK ? V3(-61, -8.5, 8.5) : V3(-50, -6, 15)),
    tmj: flyTarget(DK ? V3(0, -2.55, -6.5) : V3(0, -0.5, 0.9), DK ? V3(-48, -1.55, -6.5) : V3(-40, -0.5, 0.9)),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.mim.pos);
  const controls = makeControls(camera, VIEW.mim.target); controls.minDistance = 8; controls.maxDistance = 90;
  const st = { t: 0, mode: 'mim', exp: 'rest', sel: null, msel: null, move: 'close', nerve: false, bell: false, open: 0, labels: true, rot: false, fly: null, loaded: false, act: {}, pose: { o: 0, fR: 0, fL: 0 }, chew: 0, mm: 0 };
  const pick = [];
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const lerpT = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, va] = tab[i - 1], [b, vb] = tab[i]; return va + (vb - va) * (x - a) / (b - a); } return tab[tab.length - 1][1]; };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.85), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.25, sheen: 0.25, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.06, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined }); m.userData.op0 = o.op ?? 1; m.userData.em0 = o.em ?? 0.06; m.userData.col0 = m.color.clone(); return m; };
  const DIMC = new THREE.Color(0x3a2e2e);   // неработающая мышца в выражении — тусклая
  const setOp = (m, op) => { const t = op < 0.999 || m.userData.op0 < 1; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };

  // ---------- скан черепа: неподвижная часть и нижняя челюсть ----------
  const KS = 12.5, MX = 0.11;
  const SKULL = new THREE.Group(); scene.add(SKULL);
  const JAW = new THREE.Group(); JAW.matrixAutoUpdate = false; scene.add(JAW);
  const boneM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8DCC8').lerp(new THREE.Color(0xf0e6d4), 0.18), roughness: 0.62, clearcoat: 0.15, sheen: 0.25, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6 });
  const capM = boneM.clone(); capM.side = THREE.DoubleSide;
  const jawM = boneM.clone(), jawCapM = capM.clone(); jawM.userData.op0 = 1; jawCapM.userData.op0 = 1;
  // ---------- карта поверхности: «высота» лица в цилиндрических координатах вокруг оси x = 0, z = AXZ ----------
  const AXZ = -1.5, NPH = 300, Y0 = -13.5, DYM = 0.2, NY = 140, RM = new Float32Array(NPH * NY).fill(-1);
  const mapAdd = (x, y, z) => { const dz = z - AXZ, r = Math.hypot(x, dz), ph = Math.atan2(x, dz), i = Math.floor((ph + Math.PI) / (2 * Math.PI) * NPH) % NPH, j = Math.floor((y - Y0) / DYM); if (j < 0 || j >= NY) return; const k = j * NPH + i; if (r > RM[k]) RM[k] = r; };
  const mapFix = () => {
    for (let pass = 0; pass < 4; pass++) { const R2 = RM.slice(); for (let j = 1; j < NY - 1; j++) for (let i = 0; i < NPH; i++) { const k = j * NPH + i; if (RM[k] >= 0) continue; let s = 0, n = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const v = RM[(j + dj) * NPH + (i + di + NPH) % NPH]; if (v >= 0) { s += v; n++; } } if (n >= 3) R2[k] = s / n; } RM.set(R2); }
    { const R2 = RM.slice(); for (let j = 1; j < NY - 1; j++) for (let i = 0; i < NPH; i++) { const k = j * NPH + i; let mx = RM[k]; for (let dj = -1; dj <= 1; dj++) for (let di = -2; di <= 2; di++) mx = Math.max(mx, RM[(j + dj) * NPH + (i + di + NPH) % NPH]); R2[k] = mx; } RM.set(R2); }
    for (let pass = 0; pass < 3; pass++) { const R2 = RM.slice(); for (let j = 1; j < NY - 1; j++) for (let i = 0; i < NPH; i++) { const k = j * NPH + i; if (RM[k] < 0) continue; let s = RM[k] * 2, n = 2; for (const [dj, di] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const v = RM[(j + dj) * NPH + (i + di + NPH) % NPH]; if (v >= 0) { s += v; n++; } } R2[k] = s / n; } RM.set(R2); }
  };
  const mapR = (ph, y) => { const fi = (ph + Math.PI) / (2 * Math.PI) * NPH - 0.5, fj = (y - Y0) / DYM - 0.5, i0 = Math.floor(fi), j0 = Math.floor(fj), a = fi - i0, b = fj - j0; if (j0 < 0 || j0 >= NY - 1) return -1; let s = 0, w = 0; [[0, 0, (1 - a) * (1 - b)], [1, 0, a * (1 - b)], [0, 1, (1 - a) * b], [1, 1, a * b]].forEach(([di, dj, ww]) => { const v = RM[(j0 + dj) * NPH + ((i0 + di) % NPH + NPH) % NPH]; if (v >= 0) { s += v * ww; w += ww; } }); return w > 0.3 ? s / w : -1; };
  const snap = (p, off) => { const ph = Math.atan2(p.x, p.z - AXZ), r = mapR(ph, p.y); return r < 0 ? null : V3(Math.sin(ph) * (r + off), p.y, AXZ + Math.cos(ph) * (r + off)); };
  const radial = (p) => V3(p.x, 0, p.z - AXZ).normalize();
  // ---------- глаза и хрящи носа (на них ложатся круговая мышца глаза и носовая) ----------
  const EYES = new THREE.Group(); scene.add(EYES);
  const eyeC = (s) => V3(s * 3.3, 2.4, 2.2), EYR = 1.2;
  { const wm = mphys('#F4F0EA', { r: 0.25, cc: 0.8, em: 0.05, k: 1 }), im = new THREE.MeshPhysicalMaterial({ color: 0x5a7a52, roughness: 0.3, clearcoat: 1 }), pm = new THREE.MeshBasicMaterial({ color: 0x050505 });
    [-1, 1].forEach((s) => { const e = new THREE.Mesh(new THREE.SphereGeometry(EYR, 32, 20), wm); e.position.copy(eyeC(s)); EYES.add(e); const ir = new THREE.Mesh(new THREE.CircleGeometry(0.52, 28), im); ir.position.copy(eyeC(s)).add(V3(0, 0, EYR * 0.965)); EYES.add(ir); const pu = new THREE.Mesh(new THREE.CircleGeometry(0.22, 20), pm); pu.position.copy(ir.position).add(V3(0, 0, 0.01)); EYES.add(pu); }); }
  const surf = (f, nu, nv) => { const pos = [], idx = []; for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const p = f(i / nu, j / nv); pos.push(p.x, p.y, p.z); } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const DOR = new THREE.CatmullRomCurve3([V3(0, 3.55, 4.25), V3(0, 2.75, 5.05), V3(0, 1.5, 6.05), V3(0, 0.1, 6.95), V3(0, -1.25, 7.45), V3(0, -2.05, 7.25), V3(0, -2.6, 6.4)]);
  const noseG = surf((a, b) => { const d = DOR.getPoint(a), f = Math.PI * b, hw = 0.55 + 1.05 * sm(a / 0.8) + 0.3 * sm((a - 0.62) / 0.25), zb = 3.95 + 1.05 * a, sf = Math.sin(f); return V3(-hw * Math.cos(f) * (1 - 0.25 * sf * sm((a - 0.7) / 0.2)), d.y - 0.25 * sm((a - 0.7) / 0.3) * (1 - sf), zb + (d.z - zb) * Math.pow(sf, 0.75)); }, 72, 20);
  const noseM = mphys('#B9CFE4', { side: THREE.DoubleSide, r: 0.45, cc: 0.5, em: 0.08, k: 0.95 });
  const NOSE = new THREE.Mesh(noseG, noseM); scene.add(NOSE);
  { const nm = new THREE.MeshBasicMaterial({ color: 0x2a1418, side: THREE.DoubleSide }); [1, -1].forEach((s) => { const n = new THREE.Mesh(new THREE.CircleGeometry(0.4, 20), nm); n.scale.set(0.6, 1.15, 1); n.rotation.set(Math.PI / 2, 0, s * 0.25); n.position.set(s * 0.55, -2.48, 5.95); NOSE.add(n); }); }

  // ---------- мимические мышцы: ленты по поверхности (координаты правой стороны: x — расстояние от середины) ----------
  const D = (x, y, z) => [x, y, z];
  const MDEF = {
    front: { E: [[D(0.5, 9.2, 3), D(2.2, 9.1, 2.8), D(3.8, 8.7, 2.2), D(5.2, 7.9, 1.4)], [D(0.6, 4.05, 4.3), D(2.0, 4.65, 4.2), D(3.6, 4.85, 3.6), D(5.1, 4.35, 2.6)]], off: [0.22, 0.28], t: 0.16, k: 0.14, nu: 8, nv: 14 },
    oculi: { ring: { c: [3.35, 2.45], zin: 4.2, zout: 3.6, ri: [1.45, 0.42, 0.42], ro: [3.05, 2.6, 2.5], cri: [1.35, 0.03, 0.03], cro: [2.65, 2.2, 2.1], dyc: -0.12 }, off: [0.14, 0.36], t: 0.13, nu: 44, nv: 6 },
    corr: { E: [[D(0.95, 3.75, 4.2), D(1.15, 4.25, 4.2)], [D(2.8, 4.85, 4.0), D(3.1, 4.45, 3.8)]], off: [0.42, 0.42], t: 0.1, k: 0.32, nu: 5, nv: 10 },
    proc: { E: [[D(0.08, 2.05, 5), D(0.62, 2.1, 5)], [D(0.08, 4.45, 5), D(0.72, 4.55, 5)]], off: [0.12, 0.3], t: 0.09, k: 0.18, nu: 5, nv: 10 },
    nasal: { E: [[D(1.95, -1.55, 4), D(2.25, -2.35, 4)], [D(0.12, -0.05, 6), D(0.18, -0.95, 6)]], off: [0.22, 0.1], t: 0.08, k: 0.12, nu: 5, nv: 12 },
    llab: { E: [[D(1.9, 0.75, 4), D(3.6, 0.55, 3.5)], [D(0.95, -4.3, 5), D(1.9, -4.2, 4.7)]], off: [0.36, 0.95], t: 0.12, k: 0.16, nu: 6, nv: 16 },
    zmin: { E: [[D(4.4, -0.1, 3.0), D(4.9, -0.5, 2.6)], [D(2.05, -4.15, 4.6), D(2.35, -4.35, 4.4)]], off: [0.4, 1.0], t: 0.1, k: 0.16, nu: 5, nv: 16 },
    zmaj: { E: [[D(5.4, -0.9, 2.2), D(6.0, -1.4, 1.6)], [D(2.5, -5.05, 4.3), D(2.7, -5.5, 4.1)]], off: [0.42, 1.0], t: 0.15, k: 0.2, nu: 6, nv: 18 },
    ris: { E: [[D(6.9, -5.0, -1.5), D(6.9, -6.4, -1.6)], [D(2.75, -5.35, 4.0), D(2.8, -5.75, 4.0)]], off: [1.2, 0.98], t: 0.07, k: 0.18, nu: 5, nv: 16 },
    oris: { ring: { c: [0, -5.82], zin: 5, zout: 5, ri: [2.35, 0.13, 0.13], ro: [3.35, 1.75, 1.85], cri: [0.95, 0.36, 0.36], cro: [2.35, 1.5, 1.55], whole: true }, off: [0.85, 0.5], offc: [1.7, 0.85], t: 0.15, nu: 56, nv: 6 },
    dao: { E: [[D(2.5, -10.45, 3.8), D(3.6, -10.3, 3.0), D(4.6, -9.8, 2.2)], [D(2.75, -5.95, 4.1), D(2.8, -6.05, 4.1), D(2.85, -6.15, 4.1)]], off: [0.42, 0.98], t: 0.12, k: 0.16, nu: 10, nv: 16 },
    dli: { E: [[D(0.7, -9.4, 4.4), D(2.3, -9.5, 4.0)], [D(0.5, -6.6, 4.8), D(1.8, -6.5, 4.6)]], off: [0.26, 0.9], t: 0.1, k: 0.18, nu: 9, nv: 12 },
    ment: { E: [[D(0.22, -7.4, 5), D(0.9, -7.6, 5)], [D(0.18, -9.9, 5), D(1.15, -10.2, 4.6)]], off: [0.3, 1.0], t: 0.14, k: 0.22, nu: 8, nv: 12 },
    bucc: { E: [[D(4.4, -3.6, 0.2), D(4.6, -5.6, -0.2), D(4.4, -7.4, 0.2)], [D(2.95, -5.05, 3.6), D(3.0, -5.6, 3.7), D(2.95, -6.1, 3.6)]], off: [0.3, 0.62], t: 0.12, k: 0.12, nu: 7, nv: 14 },
    plat: { E: [[D(1.6, -14.2, 3.6), D(4.0, -14.2, 3.0), D(6.4, -14.0, -0.4)], [D(1.6, -10.9, 3.9), D(3.6, -10.6, 2.6), D(5.5, -10.2, -1.8)], [D(1.8, -8.0, 4.4), D(2.9, -6.7, 4.0), D(5.8, -8.2, -0.8)]], off: [0.6, 0.45, 0.62], free: [1, 0, 0], t: 0.06, k: 0.06, nu: 12, nv: 18 },
  };
  const MUS = {};   // id → { meshes, mats, anchor }
  const MCOL = ['#D9564C', '#C9484C', '#E06A5A'];
  // сетка средних точек ленты: строки по v (от начала к прикреплению), столбцы по u (поперёк)
  function musGrid(def, s, c) {
    const nu = def.nu, nv = def.nv, G = [], T = [], W = [], OFF = [];
    if (def.ring) {
      const R = def.ring, ri = c ? R.cri : R.ri, ro = c ? R.cro : R.ro, off = c && def.offc ? def.offc : def.off, cy = R.c[1] + (c ? R.dyc || 0 : 0);
      const cx = R.whole ? 0 : s * R.c[0];
      for (let v = 0; v < nv; v++) { const fv = v / (nv - 1); for (let u = 0; u < nu; u++) { const a = (u / nu) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a); const rIn = [ri[0] * ca, (sa > 0 ? ri[1] : ri[2]) * sa], rOut = [ro[0] * ca, (sa > 0 ? ro[1] : ro[2]) * sa]; const x = cx + rIn[0] + (rOut[0] - rIn[0]) * fv, y = cy + rIn[1] + (rOut[1] - rIn[1]) * fv + (R.whole ? 0 : 0.08 * ca * s * -1 * (1 - fv)), z = R.zin + (R.zout - R.zin) * fv; G.push(V3(x, y, z)); OFF.push(off[0] + (off[1] - off[0]) * fv); W.push(1); T.push(def.t * Math.pow(Math.sin(Math.PI * (0.08 + 0.84 * fv)), 0.7)); } }
      return { G, T, W, OFF, nu, nv, ring: true };
    }
    const E = def.E.map((e) => e.map(([x, y, z]) => V3(s * x, y, z))), m = E.length;
    const rs = (e) => { if (e.length === nu) return e; if (e.length === 2) return Array.from({ length: nu }, (_, i) => e[0].clone().lerp(e[1], i / (nu - 1))); const cv = new THREE.CatmullRomCurve3(e, false, 'centripetal'); return Array.from({ length: nu }, (_, i) => cv.getPoint(i / (nu - 1))); };
    const R = E.map(rs);
    if (c) { const last = R[m - 1]; R[m - 1] = last.map((p, i) => p.clone().lerp(R[0][i], def.k)); if (m > 2) R[m - 2] = R[m - 2].map((p, i) => p.clone().lerp(R[0][i], def.k * 0.4)); }
    const fib = []; for (let u = 0; u < nu; u++) fib.push(m === 2 ? null : new THREE.CatmullRomCurve3(R.map((r) => r[u]), false, 'centripetal'));
    const freeOf = (k) => (def.free && def.free[k] ? 0 : 1);
    for (let v = 0; v < nv; v++) { const fv = v / (nv - 1), kk = fv * (m - 1), k0 = Math.min(m - 2, Math.floor(kk)), a = kk - k0; for (let u = 0; u < nu; u++) {
      G.push(m === 2 ? R[0][u].clone().lerp(R[1][u], fv) : fib[u].getPoint(fv)); OFF.push(def.off[k0] + (def.off[k0 + 1] - def.off[k0]) * a); W.push(freeOf(k0) + (freeOf(k0 + 1) - freeOf(k0)) * sm(a * 1.6 - 0.3));
      const fu = (u + 0.5) / nu; T.push(def.t * (c ? 1.3 : 1) * Math.pow(Math.sin(Math.PI * fu), 0.6) * (0.2 + 0.8 * Math.sin(Math.PI * (0.04 + 0.92 * fv)))); } }
    return { G, T, W, OFF, nu, nv, ring: false };
  }
  // прижать сетку к поверхности, сгладить, построить «линзу» толщиной T
  function gridToSlab(gr) {
    const { G, nu, nv, ring } = gr, idx = (u, v) => v * nu + ((u % nu) + nu) % nu;
    let P = G.map((p, i) => { const sp = snap(p, gr.OFF[i]); return sp ? p.clone().lerp(sp, gr.W[i]) : p.clone(); });
    for (let it = 0; it < 2; it++) { const Q = P.map((p) => p.clone()); for (let v = 1; v < nv - 1; v++) for (let u = ring ? 0 : 1; u < (ring ? nu : nu - 1); u++) { const q = Q[idx(u, v)].multiplyScalar(0.5); [idx(u - 1, v), idx(u + 1, v), idx(u, v - 1), idx(u, v + 1)].forEach((j) => q.addScaledVector(P[j], 0.125)); } P = Q; }
    P = P.map((p, i) => { const sp = snap(p, gr.OFF[i]); if (!sp) return p; const rl = (q) => Math.hypot(q.x, q.z - AXZ), rp = rl(p), rs = rl(sp); return rp < rs ? sp : rp > rs + 0.3 ? snap(p, gr.OFF[i] + 0.3) : p; });   // сглаживание стягивает ленту внутрь — вытолкнуть обратно на поверхность
    return slabPos(P, gr.T, nu, nv, ring);
  }
  function gridNormals(P, nu, nv, ring) {
    const idx = (u, v) => v * nu + ((u % nu) + nu) % nu, N = [];
    for (let v = 0; v < nv; v++) for (let u = 0; u < nu; u++) {
      const du = (ring ? P[idx(u + 1, v)].clone().sub(P[idx(u - 1, v)]) : P[idx(Math.min(nu - 1, u + 1), v)].clone().sub(P[idx(Math.max(0, u - 1), v)]));
      const dv = P[idx(u, Math.min(nv - 1, v + 1))].clone().sub(P[idx(u, Math.max(0, v - 1))]);
      const n = du.cross(dv).normalize(), p = P[idx(u, v)]; if (n.dot(radial(p)) < 0) n.negate(); N.push(n);
    }
    return N;
  }
  // линейная лента: сечение-«линза» поперёк u в каждой строке v; кольцевая — поперёк v в каждом столбце u (столбцы замкнуты)
  function slabPos(P, T, nu, nv, ring, Nin) {
    const N = Nin || gridNormals(P, nu, nv, ring), pos = [];
    const lines = ring ? Array.from({ length: nu }, (_, u) => Array.from({ length: nv }, (_, v) => v * nu + u)) : Array.from({ length: nv }, (_, v) => Array.from({ length: nu }, (_, u) => v * nu + u));
    lines.forEach((ln) => { ln.forEach((i) => { const p = P[i].clone().addScaledVector(N[i], T[i]); pos.push(p.x, p.y, p.z); }); for (let k = ln.length - 1; k >= 0; k--) { const i = ln[k]; const p = P[i].clone().addScaledVector(N[i], -T[i] * 0.35); pos.push(p.x, p.y, p.z); } });
    return { pos, nLines: lines.length, L: (ring ? nv : nu) * 2, wrap: ring, P, N };
  }
  const stripes = (nLines, L, ringU) => { const c = []; for (let l = 0; l < nLines; l++) for (let i = 0; i < L; i++) { const u = i < L / 2 ? i : L - 1 - i, k = ringU ? (l % 2 ? 0.8 : 1) : (u % 2 ? 0.8 : 1); c.push(k, k, k); } return new THREE.Float32BufferAttribute(c, 3); };
  function slabIndex(nLines, L, wrap) {
    const idx = []; for (let l = 0; l < (wrap ? nLines : nLines - 1); l++) { const l2 = (l + 1) % nLines; for (let i = 0; i < L; i++) { const a = l * L + i, b = l * L + (i + 1) % L, c = l2 * L + i, d = l2 * L + (i + 1) % L; idx.push(a, c, b, b, c, d); } } return idx;
  }
  function buildMimic() {
    FA_MUS.forEach((mu, mi) => {
      const def = MDEF[mu.id], sides = def.ring && def.ring.whole ? [1] : [-1, 1], M = { meshes: [], mats: [], anchor: V3(0, 0, 0) };
      sides.forEach((s) => {
        const r0 = gridToSlab(musGrid(def, s, 0)), r1 = gridToSlab(musGrid(def, s, 1));
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(r0.pos, 3)); g.setIndex(slabIndex(r0.nLines, r0.L, r0.wrap)); g.computeVertexNormals(); g.setAttribute('color', stripes(r0.nLines, r0.L, r0.wrap));
        const g1 = new THREE.BufferGeometry(); g1.setAttribute('position', new THREE.Float32BufferAttribute(r1.pos, 3)); g1.setIndex(g.index); g1.computeVertexNormals();
        g.morphAttributes.position = [g1.attributes.position]; g.morphAttributes.normal = [g1.attributes.normal];
        const m = mphys(MCOL[mi % 3], { side: THREE.DoubleSide, r: 0.5, cc: 0.35, em: 0.08, emc: '#FF5A3A', op: mu.id === 'plat' ? 0.6 : undefined }); m.vertexColors = true;
        const ms = new THREE.Mesh(g, m); ms.morphTargetInfluences = [0]; ms.userData.pick = mu.id; ms.userData.side = s; MIM.add(ms); pick.push(ms); M.meshes.push(ms); M.mats.push(m);
        if (s === -1 || sides.length === 1) { const P = r0.P, nu = def.nu, nv = def.nv, c = def.ring ? P[Math.round(nv * 0.55) * nu + Math.round(nu * 0.5)] : P[Math.floor(nv / 2) * nu + Math.floor(nu / 2)]; M.anchor.copy(c).addScaledVector(radial(c), 0.25); }
      });
      MUS[mu.id] = M;
    });
  }
  const MIM = new THREE.Group(); scene.add(MIM);

  // ---------- лицевой нерв и околоушная железа ----------
  const NERVE = new THREE.Group(); scene.add(NERVE);
  const nervM = mphys('#F2D45A', { r: 0.4, em: 0.35, k: 1 }), nervOff = mphys('#8A8478', { r: 0.6, em: 0.02, k: 1 }), parM = mphys('#F2C78A', { r: 0.7, em: 0.12, op: 0.55, side: THREE.DoubleSide }), ductM = mphys('#F5E2B8', { r: 0.4, em: 0.15 });
  const NBR = {
    temp: [D(6.6, -3.4, -4.8), D(7.7, -1.6, -4.3), D(8.5, 0.6, -3.2), D(7.9, 3.0, -0.4), D(6.5, 4.8, 1.8), D(4.6, 6.0, 3.4)],
    zyg: [D(6.6, -3.4, -4.8), D(7.7, -2.1, -2.5), D(7.1, -1.2, 0.5), D(5.7, -0.5, 2.3), D(4.5, 0.5, 3.2)],
    bucc: [D(6.6, -3.4, -4.8), D(7.5, -3.7, -2.4), D(6.7, -4.0, 0.2), D(4.7, -4.3, 2.6), D(3.1, -4.7, 4.2)],
    mand: [D(6.6, -3.4, -4.8), D(7.0, -6.3, -4.3), D(6.2, -9.4, -3.2), D(5.4, -10.4, -0.6), D(3.9, -9.6, 2.6), D(2.6, -8.4, 4.0)],
    cerv: [D(6.6, -3.4, -4.8), D(7.0, -7.0, -4.7), D(6.7, -10.6, -4.2), D(6.2, -13.6, -3.6)],
  };
  const NTR = [D(4.3, -2.6, -6.3), D(5.6, -3.0, -5.6), D(6.6, -3.4, -4.8)];
  const nervMats = [];
  function buildNerve() {
    [-1, 1].forEach((s) => {
      const nm = s < 0 ? nervM : nervM.clone(); nervMats.push(nm);
      const P = (d, off, free) => { const p = V3(s * d[0], d[1], d[2]); const q = free ? null : snap(p, off); return q || p; };
      NERVE.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(NTR.map((d) => V3(s * d[0], d[1], d[2]))), 16, 0.13, 8), nm));
      Object.values(NBR).forEach((arr) => { const pts = arr.map((d, i) => (i === 0 ? V3(s * d[0], d[1], d[2]) : P(d, d[0] > 5.8 && d[1] < -1 ? 1.25 : 0.62, d[1] < -11))); NERVE.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 40, 0.075, 6), nm)); });
      { const g = new THREE.SphereGeometry(1, 30, 22), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.07 * Math.sin(9 * x + 2) * Math.sin(8 * y) + 0.05 * Math.sin(11 * z + y); p.setXYZ(i, x * k, y * k, z * k); } g.computeVertexNormals(); const pg = new THREE.Mesh(g, parM); pg.scale.set(1.15, 3.0, 1.9); pg.position.set(s * 7.0, -4.6, -4.9); NERVE.add(pg); }
      const duct = [D(7.6, -2.7, -3.3), D(7.6, -2.8, -1.4), D(7.1, -2.9, 0.4), D(5.2, -3.2, 2.1)].map((d, i) => P(d, i < 3 ? 1.3 : 0.45));
      NERVE.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(duct), 24, 0.09, 6), ductM));
    });
  }

  // ---------- жевательные мышцы: волокна от черепа к нижней челюсти (вставки — в системе челюсти) ----------
  const MAS = new THREE.Group(); scene.add(MAS);
  const MASDEF = {
    temp: { g: [
      { O: D(6, 3.4, 1.6), M1: D(6, 2.0, 0.5), M2: D(6.15, 0.55, -0.7), I: D(6.15, -4.0, -1.3) },
      { O: D(6, 6.2, 0.1), M1: D(6, 3.4, -0.8), M2: D(6.3, 0.7, -1.5), I: D(6.4, -2.7, -1.75) },
      { O: D(6, 7.3, -2.4), M1: D(6, 4.0, -2.4), M2: D(6.45, 0.85, -2.2), I: D(6.55, -1.6, -2.1) },
      { O: D(6, 6.5, -5.6), M1: D(6, 3.4, -4.4), M2: D(6.55, 1.0, -3.1), I: D(6.65, -1.05, -2.35) },
      { O: D(6, 3.6, -7.9), M1: D(6, 2.15, -6.0), M2: D(6.65, 1.15, -4.2), I: D(6.6, -1.5, -2.65) } ], offO: 0.4, offM: 0.8, t: 0.42, nu: 16, nv: 22 },
    mass: { g: [
      { O: D(6.3, -1.4, 1.4), I: D(5.75, -9.6, -0.4) },
      { O: D(7.3, -1.3, 0.2), I: D(5.95, -10.2, -1.4) },
      { O: D(7.85, -1.15, -1.1), I: D(5.85, -10.5, -2.5) },
      { O: D(8.05, -1.05, -2.3), I: D(5.55, -10.25, -3.5) },
      { O: D(8.1, -0.95, -3.3), I: D(5.75, -8.9, -4.15) } ], t: 0.85, bulge: 0.9, nu: 16, nv: 16 },
    massD: { g: [
      { O: D(7.4, -0.65, -2.2), I: D(6.75, -4.2, -1.9) },
      { O: D(7.65, -0.45, -3.4), I: D(6.95, -3.5, -3.2) },
      { O: D(7.75, -0.35, -4.5), I: D(7.0, -2.7, -4.25) } ], t: 0.35, bulge: 0.25, nu: 10, nv: 10, part: 'mass' },
    medp: { g: [
      { O: D(2.3, -2.4, -3.0), I: D(4.5, -10.0, -3.4) },
      { O: D(2.5, -3.3, -2.6), I: D(4.3, -9.6, -2.4) },
      { O: D(3.0, -4.2, -1.0), I: D(4.1, -8.4, -1.8) } ], t: 0.45, bulge: 0.2, nu: 12, nv: 14 },
    latp: { g: [
      { O: D(3.8, -0.7, -1.8), I: D(5.6, -1.25, -4.35) },
      { O: D(3.0, -1.4, -1.9), I: D(5.5, -1.6, -4.4) },
      { O: D(2.5, -2.3, -2.0), I: D(5.4, -1.95, -4.45) },
      { O: D(2.4, -3.2, -2.2), I: D(5.3, -2.3, -4.5) } ], t: 0.42, bulge: 0.1, nu: 12, nv: 12 },
  };
  const MS = [];   // { id, part, s, guides: [{S:[V3], I:V3}], mesh, mat, nu, nv }
  function buildMast() {
    Object.entries(MASDEF).forEach(([key, def]) => {
      const part = def.part || key, col = FA_MAS.find((m) => m.id === part).col;
      [-1, 1].forEach((s) => {
        const guides = def.g.map((g) => { const S = []; const v3 = (d) => V3(s * d[0], d[1], d[2]);
          if (g.M1) { for (let t = 0; t <= 1.001; t += 0.25) { const q = v3(g.O).lerp(v3(g.M1), t); S.push(snap(q, def.offO + (def.offM - def.offO) * t) || q); } S.push(v3(g.M2)); } else S.push(v3(g.O));
          return { S, I: v3(g.I) }; });
        const m = mphys(col, { side: THREE.DoubleSide, r: 0.5, cc: 0.3, em: 0.08, k: key === 'massD' ? 0.72 : 0.85 }); m.vertexColors = true;
        const L = def.nu * 2, nLines = def.nv, pos = new Float32Array(nLines * L * 3);
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(slabIndex(nLines, L, false)); g.setAttribute('color', stripes(nLines, L, false));
        const mesh = new THREE.Mesh(g, m); mesh.userData.pick = 'M:' + part; mesh.frustumCulled = false; MAS.add(mesh); pick.push(mesh);
        MS.push({ id: key, part, s, def, guides, mesh, mat: m });
      });
    });
  }
  const tmpV = V3(0, 0, 0);
  function updMast(o) {
    const M = JAW.matrix;
    o.guides.forEach((g) => { g.Iw = (g.Iw || V3(0, 0, 0)).copy(g.I).applyMatrix4(M); });
    const { nu, nv } = o.def, rows = [];
    const curves = o.guides.map((g) => { const pts = g.S.concat([g.Iw]); if (pts.length === 2) { const mid = pts[0].clone().lerp(pts[1], 0.5); mid.addScaledVector(V3(o.s, 0, 0), (o.def.bulge || 0) * (o.part === 'medp' || o.part === 'latp' ? -0.3 : 1)); pts.splice(1, 0, mid); } return new THREE.CatmullRomCurve3(pts, false, 'centripetal'); });
    const P = [], T = [], a = st.act[o.part + o.s] || 0;
    for (let v = 0; v < nv; v++) { const fv = v / (nv - 1), across = curves.map((c) => c.getPoint(fv)), ac = across.length > 2 ? new THREE.CatmullRomCurve3(across, false, 'centripetal') : null;
      for (let u = 0; u < nu; u++) { const fu = u / (nu - 1); P.push(ac ? ac.getPoint(fu) : across[0].clone().lerp(across[1], fu)); T.push(o.def.t * (1 + 0.35 * a) * Math.pow(Math.sin(Math.PI * (0.06 + 0.88 * fu)), 0.6) * (0.4 + 0.6 * Math.sin(Math.PI * (0.06 + 0.88 * fv)))); } }
    const N = []; const idx = (u, v) => v * nu + u;
    for (let v = 0; v < nv; v++) for (let u = 0; u < nu; u++) { const du = P[idx(Math.min(nu - 1, u + 1), v)].clone().sub(P[idx(Math.max(0, u - 1), v)]), dv = P[idx(u, Math.min(nv - 1, v + 1))].clone().sub(P[idx(u, Math.max(0, v - 1))]); const n = du.cross(dv).normalize(); if (n.x * o.s < 0) n.negate(); N.push(n); }
    const r = slabPos(P, T, nu, nv, false, N), arr = o.mesh.geometry.attributes.position.array; for (let i = 0; i < r.pos.length; i++) arr[i] = r.pos[i];
    o.mesh.geometry.attributes.position.needsUpdate = true; o.mesh.geometry.computeVertexNormals(); o.mesh.geometry.computeBoundingSphere();
    o.mid = P[idx(Math.floor(nu / 2), Math.floor(nv * 0.45))];
  }

  // ---------- кинематика нижней челюсти ----------
  const CR0 = V3(-6.0, -1.0, -4.95), CL0 = V3(6.0, -1.0, -4.95), MID0 = V3(0, -1.0, -4.95), TH = THREE.MathUtils.degToRad(26);
  const pathV = (f) => V3(0, -0.57 * sm(f), 1.8 * f);
  const mA = new THREE.Matrix4(), mB = new THREE.Matrix4();
  function jawMatrix(o, fR, fL, M) {
    const fo = sm((o - 0.4) / 0.6), cr = CR0.clone().add(pathV(Math.max(fo, fR))), cL = CL0.clone().add(pathV(Math.max(fo, fL)));
    const d = cL.clone().sub(cr), mid = cr.clone().add(cL).multiplyScalar(0.5), psi = Math.atan2(-d.z, d.x), phi = Math.atan2(d.y, Math.hypot(d.x, d.z));
    M.makeTranslation(mid.x, mid.y, mid.z); M.multiply(mA.makeRotationY(psi)); M.multiply(mA.makeRotationZ(phi)); M.multiply(mA.makeRotationX(TH * o)); M.multiply(mB.makeTranslation(-MID0.x, -MID0.y, -MID0.z)); return M;
  }
  const INC = V3(0, -5.75, 4.45), tmM = new THREE.Matrix4();
  const openMM = (o) => Math.round(INC.distanceTo(INC.clone().applyMatrix4(jawMatrix(o, 0, 0, tmM))) * 10);
  const MOVE = { close: { o: 0, fR: 0, fL: 0 }, open: { o: 1, fR: 0, fL: 0 }, prot: { o: 0.08, fR: 0.62, fL: 0.62 }, side: { o: 0.08, fR: 0.62, fL: 0 } };
  const MACT = {   // активность мышц при движениях: часть + сторона (−1 правая, 1 левая)
    close: { temp: [0.7, 0.7], mass: [0.8, 0.8], medp: [0.6, 0.6] }, open: { latp: [0.85, 0.85] }, prot: { latp: [1, 1], medp: [0.55, 0.55] },
    side: { latp: [1, 0.1], medp: [0.75, 0.1], temp: [0.1, 0.55] },
  };
  function chewPose(ph) {   // цикл: опускание с уходом влево → подъём на рабочей стороне → скольжение к середине
    const o = ph < 0.38 ? 0.42 * sm(ph / 0.38) : 0.42 * (1 - sm((ph - 0.38) / 0.36)), s = ph < 0.3 ? sm(ph / 0.3) : ph < 0.72 ? 1 : 1 - sm((ph - 0.72) / 0.28);
    const act = ph < 0.38 ? { latp: [0.75, 0.75] } : ph < 0.74 ? { temp: [0.55, 0.95], mass: [0.6, 0.95], medp: [0.6, 0.85] } : { medp: [0.8, 0.3], latp: [0.55, 0.1], temp: [0.2, 0.7] };
    return { o, fR: 0.45 * s, fL: 0, act };
  }

  // ---------- разрез сустава (режим 3): плоские пластины в плоскости zy, ×3 ----------
  const TJK = 3.5, TJ = new THREE.Group(); scene.add(TJ); TJ.scale.setScalar(TJK);
  const ring2 = (pts, sharp, n = 120) => (sharp ? pts.map(([z, y]) => new THREE.Vector2(z, y)) : new THREE.CatmullRomCurve3(pts.map(([z, y]) => V3(z, y, 0)), true, 'centripetal').getSpacedPoints(n).slice(0, -1).map((p) => new THREE.Vector2(p.x, p.y)));
  const sag = (pts, x0, x1, m, parent, o = {}) => { const sh = new THREE.Shape(ring2(pts, o.sharp, o.n)); (o.holes || []).forEach((hp) => sh.holes.push(new THREE.Path(ring2(hp, false, 60)))); const g = new THREE.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false, curveSegments: 6 }); g.rotateY(-Math.PI / 2); g.translate(x1, 0, 0); const ms = new THREE.Mesh(g, m); parent.add(ms); return ms; };
  const dense = (pts, n) => new THREE.CatmullRomCurve3(pts.map(([z, y]) => V3(z, y, 0)), false, 'centripetal').getSpacedPoints(n).map((p) => [p.x, p.y]);   // гладкий контур + острые углы окна
  const ell = (cx, cy, rx, ry, n = 24) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
  const tBoneM = mphys('#E8DCC8', { r: 0.75, k: 0.92, em: 0.1 }), tJawM = mphys('#EADFC9', { r: 0.7, k: 0.95, em: 0.1 }), discM = mphys('#6FA8E8', { r: 0.4, cc: 0.5, em: 0.2 });
  sag([[-3.3, -2.5], [3.8, -2.5], [3.8, 2.2], [-3.3, 2.2]], 0.3, 0.32, new THREE.MeshBasicMaterial({ color: 0x3a2a30 }), TJ, { sharp: true });   // фон: мягкие ткани
  sag(dense([[3.8, 0.66], [3.6, 0.62], [2.7, 0.48], [2.15, 0.22], [1.7, 0.1], [1.25, 0.22], [0.85, 0.5], [0.45, 0.78], [0.1, 0.88], [-0.3, 0.83], [-0.62, 0.58], [-0.82, 0.15], [-0.93, -0.32], [-1.08, -0.42], [-1.25, -0.28], [-1.45, -0.62], [-2.0, -0.82], [-2.7, -0.8], [-3.3, -0.6]], 140).concat([[-3.3, 2.2], [3.8, 2.2]]), -0.1, 0.1, tBoneM, TJ, { holes: [ell(-2.1, 0.12, 0.5, 0.42)], sharp: true });   // височная кость
  sag(dense([[-1.7, 1.5], [-1.3, 1.08], [-0.6, 1.02], [0.2, 1.06], [0.9, 0.86], [1.6, 0.8], [2.4, 0.98], [3.8, 1.05]], 60).concat([[3.8, 2.2], [-1.7, 2.2]]), -0.13, -0.11, mphys('#8A7C8C', { r: 0.9, k: 0.8, em: 0.05 }), TJ, { sharp: true });   // средняя черепная ямка (мозг)
  const JS = new THREE.Group(); TJ.add(JS);
  sag(dense([[-0.72, -2.9], [-0.6, -2.0], [-0.5, -1.3], [-0.5, -0.7], [-0.5, -0.2], [-0.38, 0.3], [-0.12, 0.53], [0.15, 0.54], [0.38, 0.38], [0.5, 0.05], [0.47, -0.4], [0.45, -0.75], [0.62, -1.1], [1.0, -1.32], [1.45, -1.38], [1.85, -1.18], [2.2, -0.75], [2.45, -0.25], [2.62, 0.05], [2.78, -0.1], [2.82, -0.7], [2.72, -1.6], [2.6, -2.9]], 180).concat([[1.5, -2.95], [0.4, -2.95]]), -0.1, 0.1, tJawM, JS, { sharp: true });   // мыщелок, вырезка и венечный отросток
  tJawM.clippingPlanes = [new THREE.Plane(V3(0, 1, 0), 2.5 * TJK)];   // ветвь обрезана по нижнему краю «окна» разреза
  const ellR = (a) => 1 / Math.sqrt((Math.cos(a) / 0.5) ** 2 + (Math.sin(a) / 0.55) ** 2);
  const DTH = [[8, 0.1], [20, 0.2], [35, 0.17], [55, 0.09], [75, 0.15], [100, 0.3], [125, 0.27], [150, 0.13]];
  const discLoc = (deg, outer) => { const a = deg * Math.PI / 180, r = ellR(a) + 0.03 + (outer ? lerpT(DTH, deg) : 0); return [r * Math.cos(a), r * Math.sin(a)]; };
  const DS = new THREE.Group(); TJ.add(DS);
  { const inner = [], outer = []; for (let d = 150; d >= 8; d -= 4) inner.push(discLoc(d, false)); for (let d = 8; d <= 150; d += 4) outer.push(discLoc(d, true)); sag(inner.concat(outer), -0.13, 0.13, discM, DS, { n: 120 }); }
  // ленты: капсула, латеральная крыловидная, ретродискальная ткань (перестраиваются каждый кадр)
  const ribbon = (m, n = 14) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((n + 1) * 2 * 3), 3)); const idx = []; for (let i = 0; i < n; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } g.setIndex(idx); const ms = new THREE.Mesh(g, m); ms.frustumCulled = false; TJ.add(ms); ms.userData.n = n; return ms; };
  const setRib = (ms, x, A, B, w0, w1, bulge) => { const n = ms.userData.n, arr = ms.geometry.attributes.position.array, dz = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dz, dy) || 1, nz = -dy / l, ny = dz / l;
    for (let i = 0; i <= n; i++) { const t = i / n, b = bulge * Math.sin(Math.PI * t), z = A[0] + dz * t + nz * b, y = A[1] + dy * t + ny * b, w = (w0 + (w1 - w0) * t) / 2; arr.set([x, y + ny * w, z + nz * w, x, y - ny * w, z - nz * w], i * 6); }
    ms.geometry.attributes.position.needsUpdate = true; ms.geometry.computeVertexNormals(); };
  const setFill = (ms, x, A1, B1, A2, B2) => { const n = ms.userData.n, arr = ms.geometry.attributes.position.array; for (let i = 0; i <= n; i++) { const t = i / n, s = Math.sin(Math.PI * t) * 0.08; arr.set([x, A1[1] + (B1[1] - A1[1]) * t + s, A1[0] + (B1[0] - A1[0]) * t, x, A2[1] + (B2[1] - A2[1]) * t - s, A2[0] + (B2[0] - A2[0]) * t], i * 6); } ms.geometry.attributes.position.needsUpdate = true; ms.geometry.computeVertexNormals(); };
  const capsM = mphys('#9FD0F0', { side: THREE.DoubleSide, r: 0.5, em: 0.3, op: 0.85 }), lptM = mphys('#45C4B0', { side: THREE.DoubleSide, r: 0.55, em: 0.15 }), retM = mphys('#E89AA8', { side: THREE.DoubleSide, r: 0.6, em: 0.12, op: 0.92 });
  const RIB = { capP: ribbon(capsM), capA: ribbon(capsM), lpS: ribbon(lptM), lpI: ribbon(lptM), ret: ribbon(retM, 10) };
  const sec = { th: 0, f: 0, dc: [0, 0], beta: 0 };
  { const WIN = [new THREE.Plane(V3(0, 0, -1), 3.8 * TJK), new THREE.Plane(V3(0, 0, 1), 3.3 * TJK), new THREE.Plane(V3(0, 1, 0), 2.5 * TJK)]; const seen = new Set(); TJ.traverse((o) => { if (o.material && !seen.has(o.material)) { seen.add(o.material); o.material.clippingPlanes = WIN; } }); }   // всё в разрезе — только внутри «окна»
  const rotZY = ([z, y], a) => [y * Math.sin(a) + z * Math.cos(a), y * Math.cos(a) - z * Math.sin(a)];   // поворот вокруг оси x на угол a
  const jawPt = (p) => { const [z, y] = rotZY(p, sec.th); return [z + sec.dc[0], y + sec.dc[1]]; };
  const discPt = (deg, outer, k = 0.5) => { const pi = discLoc(deg, false), po = discLoc(deg, true), p = outer === 'mid' ? [pi[0] + (po[0] - pi[0]) * k, pi[1] + (po[1] - pi[1]) * k] : outer ? po : pi; const [z, y] = rotZY(p, sec.beta); return [z + sec.dc[0], y + sec.dc[1]]; };
  function updSection(o) {
    const f = sm((o - 0.4) / 0.6); sec.th = TH * o; sec.f = f; sec.dc = [1.8 * f, -0.57 * sm(f)]; sec.beta = -THREE.MathUtils.degToRad(35) * f;
    JS.position.set(0, sec.dc[1], sec.dc[0]); JS.rotation.x = sec.th; DS.position.set(0, sec.dc[1], sec.dc[0]); DS.rotation.x = sec.beta;
    setRib(RIB.capP, -0.16, [-0.98, -0.32], jawPt([-0.55, -0.95]), 0.06, 0.06, -0.12);
    setRib(RIB.capA, -0.16, [2.45, 0.42], jawPt([0.52, -1.0]), 0.06, 0.06, -0.1);
    setRib(RIB.lpS, -0.15, [3.7, -0.22], discPt(10, 'mid'), 0.32, 0.12, -0.1);
    setRib(RIB.lpI, -0.15, [3.7, -1.02], jawPt([0.5, -0.62]), 0.55, 0.2, -0.05);
    setFill(RIB.ret, -0.05, discPt(146, true), [-0.8, 0.48], discPt(146, false), jawPt([-0.5, -0.3]));
  }

  // ---------- загрузка скана ----------
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, LB = g.attributes.aLabel, IX = g.index.array, N = P.count;
    const occl = (z) => 15.535 + 0.05 * cl((0.9 - z) / 0.5);
    const mand = new Uint8Array(N), vert = new Uint8Array(N), nb = Array.from({ length: N }, () => []);
    for (let i = 0; i < N; i++) { const X = P.getX(i) - MX, aX = Math.abs(X), y = P.getY(i), z = P.getZ(i); if ((z > 0.15 && y < occl(z) && aX < 0.62) || (aX > 0.36 && aX < 0.6 && z > 0.13 && z < 0.5 && y < (z < 0.3 ? 15.98 : 15.93))) mand[i] = 1; }
    for (let t = 0; t < IX.length; t += 3) { const a = IX[t], b = IX[t + 1], c = IX[t + 2]; nb[a].push(b, c); nb[b].push(a, c); nb[c].push(a, b); }
    {   // шейные позвонки — заливка снизу вверх (как в сцене skull)
      const q = []; for (let i = 0; i < N; i++) { const aX = Math.abs(P.getX(i) - MX); if (P.getY(i) < 15.45 && aX < 0.3 && P.getZ(i) < 0.2) { vert[i] = 1; q.push(i); } }
      while (q.length) { const i = q.pop(); for (const j of nb[i]) { if (vert[j]) continue; const y = P.getY(j), z = P.getZ(j); if (z < 0.26 && y < (z > -0.15 ? 15.71 : 15.68)) { vert[j] = 1; q.push(j); } } }
      for (let i = 0; i < N; i++) { const aX = Math.abs(P.getX(i) - MX), y = P.getY(i), z = P.getZ(i); if (y < 15.79 && aX < 0.15 && z > -0.15 && z < 0.1) vert[i] = 1; }
    }
    // нижняя челюсть — самый большой связный кусок среди вершин «mand» (остальное — обломки позвонков)
    const comp = new Int32Array(N).fill(-1); let best = -1, bestN = 0;
    for (let i = 0; i < N; i++) { if (!mand[i] || vert[i] || comp[i] >= 0) continue; const c = i, stk = [i]; comp[i] = c; let n = 0; while (stk.length) { const v = stk.pop(); n++; for (const j of nb[v]) if (mand[j] && !vert[j] && comp[j] < 0) { comp[j] = c; stk.push(j); } } if (n > bestN) { bestN = n; best = c; } }
    const ok = (i) => !vert[i] && LB.getX(i) < 0.5, isJ = (i) => comp[i] === best;
    const TS = [], TJw = [];
    for (let t = 0; t < IX.length; t += 3) { const a = IX[t], b = IX[t + 1], c = IX[t + 2]; if (!ok(a) || !ok(b) || !ok(c)) continue; if (isJ(a) && isJ(b) && isJ(c)) TJw.push(a, b, c); else if (!mand[a] && !mand[b] && !mand[c]) TS.push(a, b, c); }
    const cmX = (i) => (P.getX(i) - MX) * KS, cmY = (i) => (P.getY(i) - 16) * KS, cmZ = (i) => (P.getZ(i) - 0.6) * KS;
    function part(tris, mat, cmat, parent) {
      const map = new Map(), pos = []; const idx = tris.map((v) => { if (!map.has(v)) { map.set(v, pos.length / 3); pos.push(cmX(v), cmY(v), cmZ(v)); } return map.get(v); });
      const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gg.setIndex(idx); gg.computeVertexNormals();
      const ms = new THREE.Mesh(gg, mat); parent.add(ms);
      // заплатки на срезах (зубы и суставы в скане срослись): контур → плоскость → триангуляция
      const dir = new Map(); for (let i = 0; i < tris.length; i += 3) for (let e = 0; e < 3; e++) dir.set(tris[i + e] + '_' + tris[i + (e + 1) % 3], 1);
      const nx = new Map(); dir.forEach((_, k) => { const [u, v] = k.split('_'); if (!dir.has(v + '_' + u)) nx.set(+u, +v); });
      const used = new Set(), cp = [], ci = [];
      nx.forEach((_, s0) => { if (used.has(s0)) return; const loop = []; let u = s0; while (!used.has(u) && nx.has(u) && loop.length < 4000) { used.add(u); loop.push(u); u = nx.get(u); } if (loop.length < 8) return;
        const pts = loop.map((v) => V3(cmX(v), cmY(v), cmZ(v))), n = V3(0, 0, 0); pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; n.x += (p.y - q.y) * (p.z + q.z); n.y += (p.z - q.z) * (p.x + q.x); n.z += (p.x - q.x) * (p.y + q.y); }); if (n.lengthSq() < 1e-8) return; n.normalize();
        const ax = Math.abs(n.x) < 0.9 ? V3(1, 0, 0) : V3(0, 1, 0), e1 = ax.clone().cross(n).normalize(), e2 = n.clone().cross(e1);
        const c2 = pts.map((p) => new THREE.Vector2(p.dot(e1), p.dot(e2))); let tri; try { tri = THREE.ShapeUtils.triangulateShape(c2, []); } catch (e) { return; }
        const b0 = cp.length / 3; pts.forEach((p) => cp.push(p.x, p.y, p.z)); tri.forEach((tt) => ci.push(b0 + tt[0], b0 + tt[1], b0 + tt[2])); });
      if (ci.length) { const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.setIndex(ci); cg.computeVertexNormals(); parent.add(new THREE.Mesh(cg, cmat)); }
      for (let i = 0; i < pos.length; i += 3) mapAdd(pos[i], pos[i + 1], pos[i + 2]);
      return ms;
    }
    part(TS, boneM, capM, SKULL); const jm = part(TJw, jawM, jawCapM, JAW); jm.userData.pick = 'J'; pick.push(jm);
    out.forEach((m) => m.geometry.dispose());
    EYES.children.forEach((e) => { if (e.geometry.type !== 'SphereGeometry') return; const p = e.geometry.attributes.position; for (let i = 0; i < p.count; i++) mapAdd(p.getX(i) + e.position.x, p.getY(i) + e.position.y, p.getZ(i) + e.position.z); });
    { const p = noseG.attributes.position; for (let i = 0; i < p.count; i++) { mapAdd(p.getX(i), p.getY(i), p.getZ(i)); mapAdd(-p.getX(i), p.getY(i), p.getZ(i)); } }
    mapFix();
    buildMimic(); buildNerve(); buildMast();
    st.loaded = true; refreshDim(); refs.setInfo && refs.setInfo();
  }).catch((e) => { st.err = e && e.message; refs.setInfo && refs.setInfo(); });

  // ---------- обновление ----------
  const curExp = () => FA_EXP.find((e) => e.id === st.exp);
  const tgtM = new THREE.Matrix4();
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const M1 = st.mode === 'mim', M2 = st.mode === 'chew', M3 = st.mode === 'tmj', k = 1 - Math.exp(-dt * 5);
    SKULL.visible = JAW.visible = !M3; MIM.visible = EYES.visible = NOSE.visible = M1; NERVE.visible = M1 && st.nerve; MAS.visible = M1 || M2; TJ.visible = M3; sideL.intensity = M1 ? 0 : 0.9;
    // челюсть
    let tg = { o: 0, fR: 0, fL: 0 }, act = {};
    if (M2) {
      if (st.move === 'chew') { st.chew = (st.chew + dt / 1.25) % 1; const c = chewPose(st.chew); tg = c; act = c.act; } else { tg = MOVE[st.move]; act = MACT[st.move] || {}; }
    }
    const P0 = st.pose, kk = M2 && st.move === 'chew' ? 1 - Math.exp(-dt * 14) : 1 - Math.exp(-dt * 3.2);
    P0.o += (tg.o - P0.o) * kk; P0.fR += (tg.fR - P0.fR) * kk; P0.fL += (tg.fL - P0.fL) * kk;
    jawMatrix(P0.o, P0.fR, P0.fL, JAW.matrix); JAW.matrixWorldNeedsUpdate = true; st.mm = openMM(P0.o); { const q = INC.clone().applyMatrix4(JAW.matrix); st.fwd = Math.round(Math.max(0, q.z - INC.z) * 10); st.lat = Math.round(Math.abs(q.x - INC.x) * 10); }
    // активность мышц
    if (M1) {
      const e = curExp();
      FA_MUS.forEach((mu) => { const M = MUS[mu.id]; if (!M) return; M.meshes.forEach((ms, i) => { const s = ms.userData.side, key = mu.id + s, tgt = st.bell && s === 1 && mu.id !== 'oris' ? 0 : (e.act[mu.id] || 0) * (st.bell && mu.id === 'oris' ? 0.6 : 1); const a = st.act[key] = (st.act[key] || 0) + (tgt - (st.act[key] || 0)) * k; ms.morphTargetInfluences[0] = a; const m = M.mats[i]; m.emissiveIntensity = m.userData.em0 + 0.6 * Math.max(0, a); { const on = st.exp === 'rest' ? 1 : Math.min(1, Math.max(0, a) * 1.6); m.color.copy(m.userData.col0).multiplyScalar(1 + 0.35 * Math.max(0, a)).lerp(DIMC, 0.85 * (1 - on)); m.emissiveIntensity *= 0.3 + 0.7 * on; m.sheen = 0.25 * on; m.clearcoat = 0.25 * on; } if (st.bell && s === 1 && mu.id !== 'oris') m.color.lerp(new THREE.Color(0x8a7a78), 0.5); }); });
      MS.forEach((o) => { o.mesh.visible = o.part === 'mass' || o.part === 'temp'; o.mat.color.copy(o.mat.userData.col0).lerp(DIMC, 0.7); o.mat.emissiveIntensity = o.mat.userData.em0; setOp(o.mat, 1); }); if (st.loaded) MS.forEach(updMast);   // жевательные — тусклый фон под мимическими
      nervMats.forEach((m, i) => { const off = st.bell && i === 1; m.color.set(off ? 0x6a665e : 0xf2d45a).multiplyScalar(0.85); m.emissiveIntensity = off ? 0.0 : 0.35; });
    } else if (M2) {
      MS.forEach((o) => { const key = o.part + o.s, sd = o.s < 0 ? 0 : 1, tgt = act[o.part] ? act[o.part][sd] : 0; st.act[key] = (st.act[key] || 0) + (tgt - (st.act[key] || 0)) * (st.move === 'chew' ? 1 - Math.exp(-dt * 12) : k); o.mat.emissiveIntensity = o.mat.userData.em0 + 0.3 * st.act[key]; o.mat.color.copy(o.mat.userData.col0).multiplyScalar(1 + 0.3 * st.act[key]); });
      if (st.loaded) MS.forEach(updMast);
    }
    if (M3) { updSection(st.open); }
  }
  // ---------- выбор и подсветка ----------
  function refreshDim() {
    FA_MUS.forEach((mu) => { const M = MUS[mu.id]; if (!M) return; M.mats.forEach((m) => setOp(m, !st.sel || st.sel === mu.id ? 1 : 0.22)); });
    const pt = st.msel === 'medp' || st.msel === 'latp';
    MS.forEach((o) => { const p2 = o.part === 'medp' || o.part === 'latp'; o.mesh.visible = !pt || p2; setOp(o.mat, st.msel === 'mass' && o.id.startsWith('mass') && !o.id.startsWith('massD') ? 0.5 : !st.msel || st.msel === o.part ? 1 : pt ? 0.5 : 0.12); });   // жевательная: поверхностная часть полупрозрачна — видна глубокая
    setOp(jawM, pt ? 0.5 : 1); setOp(jawCapM, pt ? 0.5 : 1); setOp(boneM, pt ? 0.4 : 1); setOp(capM, pt ? 0.4 : 1);
  }
  function select(id) { st.sel = id === 'all' || st.sel === id ? null : id; refreshDim(); refs.setInfo && refs.setInfo(); }
  function selMas(id) { st.msel = id === 'all' ? null : id; st.fly = st.mode === 'chew' ? (st.msel === 'medp' || st.msel === 'latp' ? VIEW.ptg : VIEW.chew) : st.fly; refreshDim(); refs.mseg && refs.mseg.sync(); refs.setInfo && refs.setInfo(); }
  function setExp(id) { st.exp = id; st.sel = null; refreshDim(); refs.eseg && refs.eseg.sync(); refs.setInfo && refs.setInfo(); }
  function setMove(id) { const pt = st.msel === 'medp' || st.msel === 'latp'; if (st.mode === 'chew' && (id === 'side' || st.move === 'side')) st.fly = id === 'side' ? VIEW.chewF : pt ? VIEW.ptg : VIEW.chew; st.move = id; if (id === 'chew') st.chew = 0; refs.vseg && refs.vseg.sync(); refs.setInfo && refs.setInfo(); }
  function setMode(m) {
    st.mode = m; st.sel = null; if (m !== 'chew') st.msel = null; st.fly = m === 'mim' && st.bell ? VIEW.front : VIEW[m]; refreshDim();
    refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  pickOn(() => self, camera, () => pick, (id) => {
    if (id === 'J') return;
    if (id.startsWith('M:')) { if (st.mode !== 'chew') return; const m = id.slice(2); selMas(st.msel === m ? 'all' : m); return; }
    if (st.mode !== 'mim') return; select(id);
  });
  // ---------- подписи ----------
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && st.loaded && show() });
  const mim = () => st.mode === 'mim', chew = () => st.mode === 'chew', tmj = () => st.mode === 'tmj';
  const musShow = (id) => () => { if (!mim()) return false; if (st.sel) return st.sel === id; if (st.nerve) return false; if (st.exp === 'rest') return DK; return (curExp().act[id] || 0) > 0.15; };
  const jawW = (x, y, z) => () => V3(x, y, z).applyMatrix4(JAW.matrix);
  const msMid = (key, s = -1) => () => { const o = MS.find((q) => q.id === key && q.s === s); return o && o.mid ? o.mid : V3(0, 0, 0); };
  const tw = (z, y) => V3(-0.2 * TJK, y * TJK, z * TJK);
  const LEFTM = { front: 1, oculi: 1, corr: 0, proc: 0, nasal: 0, llab: 0, zmin: 1, zmaj: 1, ris: 1, oris: 0, dao: 1, dli: 0, ment: 0, bucc: 1, plat: 1 };
  const nb0 = (k, i, off = 0.7) => () => { const d = NBR[k][i]; return snap(V3(-d[0], d[1], d[2]), off) || V3(-d[0], d[1], d[2]); };
  const labels = [
    ...FA_MUS.map((mu) => ({ text: mu.name, get pos() { return MUS[mu.id] ? MUS[mu.id].anchor : V3(0, 0, 0); }, color: '#FFB0A0', left: !!LEFTM[mu.id], show: () => st.labels && st.loaded && musShow(mu.id)() })),
    lb('лицевой нерв', V3(-4.6, -2.7, -6.4), '#F2D45A', () => mim() && st.nerve && !st.sel && DK, true),
    lb('околоушная железа', V3(-8.3, -6.2, -4.6), '#F2C78A', () => mim() && st.nerve && !st.sel, true),
    lb('околоушный проток', nb0('bucc', 2, 1.3), '#F5E2B8', () => mim() && st.nerve && !st.sel && DK, false),
    lb('височные ветви', nb0('temp', 3), '#F2D45A', () => mim() && st.nerve && !st.sel, true),
    lb('скуловые ветви', nb0('zyg', 3), '#F2D45A', () => mim() && st.nerve && !st.sel, true),
    lb('щёчные ветви', nb0('bucc', 3, 0.8), '#F2D45A', () => mim() && st.nerve && !st.sel, false),
    lb('краевая ветвь', nb0('mand', 3, 1.0), '#F2D45A', () => mim() && st.nerve && !st.sel, true),
    lb('шейная ветвь', V3(-6.2, -13.6, -3.6), '#F2D45A', () => mim() && st.nerve && !st.sel, true),
    lb('паралич', V3(5.2, -6.5, 3.2), '#E8DCC8', () => mim() && st.bell && !st.sel),
    // режим 2
    lb('височная', () => { const o = MS.find((q) => q.id === 'temp' && q.s === -1); return o ? o.guides[2].S[0] : V3(0, 0, 0); }, '#F0A050', () => chew() && (!st.msel || st.msel === 'temp')),
    lb('жевательная', msMid('mass'), '#FF8A94', () => chew() && (!st.msel || st.msel === 'mass')),
    lb('глубокая часть', msMid('massD'), '#E8707A', () => chew() && st.msel === 'mass', true),
    lb('медиальная крыловидная', msMid('medp'), '#D8A8F0', () => chew() && (st.msel === 'medp' || st.msel === 'latp'), true),
    lb('латеральная крыловидная', msMid('latp'), '#7FE0D0', () => chew() && (st.msel === 'medp' || st.msel === 'latp')),
    lb('скуловая дуга', V3(-8.3, 0.4, -1.6), '#E8DCC8', () => chew() && DK && !st.msel),
    lb('мыщелок', jawW(-6.9, -1.2, -5.1), '#E8DCC8', () => chew() && (DK || st.msel === 'latp'), true),
    lb('венечный отросток', jawW(-6.8, -1.6, -2.3), '#E8DCC8', () => chew() && st.msel === 'temp'),
    lb('угол челюсти', jawW(-5.6, -10.3, -3.6), '#E8DCC8', () => chew() && DK && st.msel === 'medp', true),
    // режим 3
    lb('суставная ямка', tw(0.1, 0.88), '#E8DCC8', () => tmj()),
    lb('суставной бугорок', tw(2.3, 0.45), '#E8DCC8', () => tmj()),
    lb('диск', () => { const p = discPt(118, true); return tw(p[0], p[1]); }, '#9CC8F0', () => tmj(), true),
    lb('головка нижней челюсти', () => { const p = jawPt([0.0, -0.7]); return tw(p[0], p[1]); }, '#F2E8D2', () => tmj(), true),
    lb('капсула', () => { const a = jawPt([0.52, -1.0]); return tw((a[0] + 2.45) / 2 + 0.05, (a[1] + 0.42) / 2); }, '#9FD0F0', () => tmj() && DK),
    lb('латеральная крыловидная', () => { const a = jawPt([0.5, -0.62]); return tw((a[0] + 3.7) / 2 + 0.4, (a[1] - 0.78) / 2 - 0.05); }, '#7FE0D0', () => tmj()),
    lb('ретродискальная ткань', () => { const a = discPt(146, true); return tw((a[0] - 0.8) / 2, (a[1] + 0.48) / 2 - 0.25); }, '#F2B0BC', () => tmj() && DK, true),
    lb('наружный слуховой проход', tw(-2.1, -0.32), '#E8DCC8', () => tmj() && DK, true),
    lb('средняя черепная ямка', tw(0.9, 1.55), '#C8BCD0', () => tmj() && DK),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  // ---------- панель ----------
  const INTRO = '<b>Мимические мышцы</b> — около двадцати пар тонких мышц, которые начинаются на костях лица и вплетаются прямо в кожу. Сокращаясь, они сдвигают кожу, складки, края век и губ — так рождаются выражения. Все их иннервирует лицевой нерв (VII пара). Выберите выражение или нажмите на мышцу.';
  const NERVT = '<b>Лицевой нерв</b> (VII пара) выходит из черепа через шилососцевидное отверстие, входит в околоушную железу и делится в ней на пять групп ветвей: височные, скуловые, щёчные, краевую ветвь нижней челюсти и шейную. Веером расходясь по лицу, они иннервируют все мимические мышцы своей стороны.';
  const BELLT = '<b>Паралич Белла</b> — внезапное поражение лицевого нерва одной стороны, чаще после вирусной инфекции. Половина лица неподвижна: глаз не закрывается, угол рта опущен, лоб не морщится. Большинство выздоравливает за несколько недель или месяцев. При инсульте, в отличие от этого, лоб обычно двигается.';
  const INTRO2 = '<b>Жевательные мышцы</b> — четыре пары: височная, жевательная, медиальная и латеральная крыловидные. Они начинаются на черепе, прикрепляются к нижней челюсти и двигают её в височно-нижнечелюстных суставах. Все их иннервирует нижнечелюстной нерв (V₃). Выберите мышцу или движение.';
  const tmjText = () => FA_TMJ.find(([a]) => st.open < a)[1];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => {
      if (st.err) { ib.info.textContent = 'Не удалось загрузить модель черепа: ' + st.err; return; }
      if (st.mode === 'tmj') { ib.info.innerHTML = tmjText(); return; }
      if (st.mode === 'chew') { ib.info.innerHTML = st.msel ? FA_MAS.find((m) => m.id === st.msel).text : st.move === 'close' ? INTRO2 : FA_MOVE.find((m) => m.id === st.move).text; return; }
      ib.info.innerHTML = st.sel ? FA_MUS.find((m) => m.id === st.sel).text : st.bell ? BELLT : st.nerve ? NERVT : st.exp === 'rest' ? INTRO : curExp().text;
    };
    refs.modeSeg = seg([{ id: 'mim', label: 'Мимика' }, { id: 'chew', label: 'Жевание' }, { id: 'tmj', label: 'Сустав' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.eseg = refs.mseg = refs.vseg = null;
      if (st.mode === 'mim') {
        refs.eseg = seg(FA_EXP.map((e) => ({ id: e.id, label: e.name })), () => st.exp, (v) => setExp(v));
        box.append(h('div', { class: 'glabel' }, 'Выражение', h('kbd', {}, 'клик — мышца')), h('div', { class: 'gctl' }, refs.eseg));
        refs.nervT = toggle('Лицевой нерв', () => st.nerve, (v) => { st.nerve = v; if (!v && st.bell) { st.bell = false; refs.bellT.sync(); } refs.setInfo(); });
        refs.bellT = toggle('Паралич слева', () => st.bell, (v) => { st.bell = v; if (v && !st.nerve) { st.nerve = true; refs.nervT.sync(); } st.sel = null; st.fly = v ? VIEW.front : VIEW.mim; refreshDim(); refs.setInfo(); });
        view.append(refs.nervT, refs.bellT);
      } else if (st.mode === 'chew') {
        refs.vseg = seg(FA_MOVE.map((m) => ({ id: m.id, label: m.name })), () => st.move, (v) => setMove(v));
        refs.mseg = seg([{ id: 'all', label: 'Все' }, ...FA_MAS.map((m) => ({ id: m.id, label: m.name, color: m.col }))], () => st.msel || 'all', (v) => selMas(v));
        box.append(h('div', { class: 'glabel' }, 'Движение'), h('div', { class: 'gctl' }, refs.vseg), h('div', { class: 'glabel' }, 'Мышцы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.mseg));
      } else {
        box.append(h('div', { class: 'glabel' }, 'Открывание рта'), h('div', { class: 'gctl' }, range('faOpen', 0, 1, 0.01, () => st.open, (v) => { const b = FA_TMJ.findIndex(([a]) => st.open < a); st.open = v; if (FA_TMJ.findIndex(([a]) => v < a) !== b) refs.setInfo(); }, (v) => openMM(v) + ' мм')));
      }
      view.append(refs.rot, refs.lab);
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'Вид', h('kbd', {}, 'R · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mim', 'chew', 'tmj'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'mim') { select('all'); setExp('rest'); } else if (st.mode === 'chew') selMas('all'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'f' || k === 'а') && refs.nervT && st.mode === 'mim') { refs.nervT.click(); return true; }
    return false;
  }
  const musWord = (n) => (n % 10 === 1 && n !== 11 ? 'мышца' : n % 10 >= 2 && n % 10 <= 4 && (n < 10 || n > 20) ? 'мышцы' : 'мышц');
  function stats() {
    if (st.mode === 'tmj') { const o = st.open; return [['Открывание', openMM(o), 'мм'], ['Фаза', o < 0.03 ? 'покой' : o < 0.4 ? 'вращение' : 'скольжение', '']]; }
    if (st.mode === 'chew') return [['Открывание', st.mm, 'мм'], st.move === 'prot' ? ['Выдвижение', st.fwd, 'мм'] : st.move === 'side' ? ['Сдвиг вбок', st.lat, 'мм'] : ['Сила смыкания', '40–80', 'кг']];
    if (st.bell) return [['Левая сторона', 'паралич', ''], ['Черепной нерв', 'VII', '']];
    const e = curExp(); if (st.exp === 'rest') return [['Мимических мышц', '≈ 20', 'пар'], ['Черепной нерв', 'VII', '']];
    const n = Object.values(e.act).filter((a) => a > 0.15).length; return [['Работают', n, musWord(n)], ['Черепной нерв', 'VII', '']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'mim' ? '#E0685A' : st.mode === 'chew' ? (st.msel ? FA_MAS.find((m) => m.id === st.msel).col : '#E8505E') : '#6FA8E8'; },
    kicker: 'Тело · опора и движение', title: 'Мимика и жевание',
    lede: 'Около двадцати пар мимических мышц тянут кожу лица — так рождаются улыбка, удивление и хмурость. Четыре пары жевательных мышц двигают нижнюю челюсть, а в её суставах головка и вращается, и скользит вперёд — поэтому рот открывается так широко.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Мимические мышцы развиваются из второй глоточной дуги, поэтому все их иннервирует нерв этой дуги — лицевой. В отличие от скелетных мышц, они лежат прямо под кожей и хотя бы одним концом вплетаются в неё. Вокруг глаз и рта они образуют кольцевые мышцы, а радиальные — раскрывают эти отверстия.</p>
        <p>Жевательные мышцы — производные первой глоточной дуги; их иннервирует нижнечелюстной нерв, третья ветвь тройничного (V₃). Нижняя челюсть — единственная подвижная кость черепа, а два её височно-нижнечелюстных сустава работают только вместе.</p></div>
      <div><h2>Как это работает</h2>
        <p>Мимика нужна не только для чувств: круговая мышца глаза при моргании (15–20 раз в минуту) защищает глаз и разносит слёзы, круговая мышца рта и щёчная удерживают пищу и участвуют в речи. Основные выражения — радость, удивление, отвращение, страх — люди разных культур понимают одинаково.</p>
        <p>При жевании челюсть описывает петлю: опускается, уходит в рабочую сторону и, поднимаясь, перетирает пищу между зубами этой стороны. Язык и щёки всё время подкладывают пищу под зубы, а слюна склеивает её в комок.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Паралич Белла</b> — внезапная слабость всей половины лица из-за поражения лицевого нерва; глаз нужно защищать от высыхания. Обычно проходит за недели или месяцы.</li>
        <li><b>Центральный паралич</b> (при инсульте) затрагивает нижнюю половину лица противоположной стороны, а лоб двигается: верхняя часть лица получает команды от обоих полушарий.</li>
        <li><b>Дисфункция ВНЧС</b>: щелчки при смещении диска, боль, ограничение открывания рта; часто связана с бруксизмом — скрежетом зубами во сне.</li>
        <li><b>Вывих нижней челюсти</b>: при широком зевке головка проскакивает вперёд за суставной бугорок, и рот не закрывается; врач вправляет её, надавливая на коренные зубы вниз и назад.</li>
        <li><b>Тризм</b> — спазм жевательных мышц, рот не открывается: при воспалении у зуба мудрости, при столбняке.</li>
        <li><b>Ботулотоксин</b> на несколько месяцев выключает мимические мышцы — на этом основаны инъекции против морщин.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Мышцы показаны лентами на скане черепа взрослого; кожа, жировая клетчатка и фасции убраны, формы мышц упрощены. Нос — условная хрящевая оболочка, глазные яблоки — шары.</li><li>Сокращение показано укорочением и свечением мышц; кожа лица не деформируется, морщины не показаны. В каждом выражении на деле работает больше мышц.</li><li>Нижняя челюсть отделена от скана по условной границе (зубы и суставы в скане срослись, срезы закрыты заплатками); путь мыщелка и углы открывания — средние. Разрез сустава схематичен и увеличен в 3,5 раза.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>F</code> лицевой нерв · <code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  window.__face = { camera, controls, st, VIEW, scene };   // DEBUG
  setMode('mim'); st.fly = null; camera.position.copy(VIEW.mim.pos); controls.target.copy(VIEW.mim.target);
  updSection(0);
  return self;
}
