// @scene brainvasc makeBrainVasc | Кровоснабжение мозга | @brain Устройство
/* =========================================================
   МОЗГ · КРОВОСНАБЖЕНИЕ: 1) артериальный (виллизиев) круг на основании мозга — сонные и позвоночно-основная системы,
   соединительные артерии, мозжечковые ветви; 2) бассейны передней, средней и задней мозговых артерий на коре
   (снаружи — левое полушарие, изнутри — правое); 3) инсульт: тромб, ядро инфаркта и полутень, восстановление кровотока,
   обходной путь через круг при закупорке сонной.
   Сверено с атласом Неттера (PDF стр. 202–209: артерии мозга, круг, бассейны). Модель мозга — общая brainKit:
   x — вперёд, y — вверх, z > 0 — правое полушарие; 1 ед. ≈ 5 см.
   ========================================================= */
const BV_ART = [
  { id: 'ica', name: 'Внутренние сонные', col: '#E05555', text: '<b>Внутренние сонные артерии</b> несут около 80 % крови мозга. Каждая входит в череп через сонный канал, изгибается (сифон) в пещеристом синусе, отдаёт глазную артерию и у зрительного перекрёста делится на переднюю и среднюю мозговые. Бляшка там, где на шее от общей сонной отходит внутренняя, — частая причина инсульта.' },
  { id: 'aca', name: 'Передние мозговые', col: '#5E9FEF', text: '<b>Передние мозговые артерии</b> идут вперёд над зрительными нервами, соединяются передней соединительной и поднимаются в продольную щель между полушариями. Там они огибают мозолистое тело и питают внутреннюю поверхность лобной и теменной долей — в том числе кору, которая управляет ногой.' },
  { id: 'mca', name: 'Средние мозговые', col: '#F08A3C', text: '<b>Средние мозговые артерии</b> — самые крупные ветви сонных. Каждая уходит вбок в глубину боковой борозды и веером расходится по наружной поверхности полушария. От её начала вверх отходят тонкие чечевицеобразно-полосатые артерии к базальным ядрам и внутренней капсуле; их закупорка даёт мелкие (лакунарные) инфаркты.' },
  { id: 'acom', name: 'Передняя соединительная', col: '#6FE0C0', text: '<b>Передняя соединительная артерия</b> — перемычка длиной несколько миллиметров между передними мозговыми. Если одна сонная сужена, кровь по ней перетекает из другой. Это самое частое место аневризм: здесь находят около трети всех аневризм артерий мозга.' },
  { id: 'pcom', name: 'Задние соединительные', col: '#6FE0C0', text: '<b>Задние соединительные артерии</b> связывают сонные с задними мозговыми и замыкают круг сзади. В норме кровоток по ним мал, но при закупорке одной из систем они становятся обходным путём. Аневризма у начала задней соединительной может сдавить лежащий рядом глазодвигательный нерв — веко опускается, зрачок расширяется.' },
  { id: 'va', name: 'Позвоночные', col: '#B070E8', text: '<b>Позвоночные артерии</b> отходят от подключичных, поднимаются в отверстиях поперечных отростков шейных позвонков и входят в череп через большое отверстие. Вдоль продолговатого мозга они отдают задние нижние мозжечковые артерии, а у нижнего края моста сливаются в основную. Позвоночно-основная система даёт около 20 % притока крови к мозгу.' },
  { id: 'ba', name: 'Основная', col: '#9C7CF0', text: '<b>Основная (базилярная) артерия</b> лежит в борозде на передней поверхности моста. Мелкие ветви питают мост, крупные — мозжечок, а у верхнего края моста она делится на две задние мозговые. Тромбоз основной артерии — тяжёлый инсульт ствола: возможны кома или «синдром запертого человека», когда сознание и движения глаз сохранены, а тело парализовано.' },
  { id: 'pca', name: 'Задние мозговые', col: '#E8C440', text: '<b>Задние мозговые артерии</b> — конечные ветви основной. Они огибают ножки мозга, питают таламус, нижнюю поверхность височной доли и затылочную долю со зрительной корой. Их закупорка выключает противоположную половину поля зрения обоих глаз (гемианопия).' },
  { id: 'cbl', name: 'Мозжечковые', col: '#E07AB8', text: '<b>Мозжечковые артерии</b> — три пары: верхние отходят от верха основной, передние нижние — от её начала, задние нижние — от позвоночных. Инсульт в бассейне задней нижней мозжечковой задевает и боковую часть продолговатого мозга: головокружение, нарушение глотания, онемение лица с одной стороны и тела — с другой (синдром Валленберга).' },
];
const BV_TER = [
  { id: 'aca', name: 'Передняя', col: '#5E9FEF', text: '<b>Передняя мозговая артерия</b> питает внутреннюю поверхность лобной и теменной долей и полосу шириной около 2 см по верхнему краю полушария. Здесь лежат двигательная и чувствительная кора ноги. Её закупорка даёт слабость и онемение противоположной ноги, иногда — безразличие и недержание мочи.' },
  { id: 'mca', name: 'Средняя', col: '#F08A3C', text: '<b>Средняя мозговая артерия</b> питает большую часть наружной поверхности полушария: двигательную и чувствительную кору лица и руки, а в левом полушарии (у большинства людей оно ведущее по речи) — ещё и речевые зоны Брока и Вернике. Её закупорка — самый частый крупный инсульт: лицо перекошено, рука слабеет, речь нарушена.' },
  { id: 'pca', name: 'Задняя', col: '#E8C440', text: '<b>Задняя мозговая артерия</b> питает затылочную долю со зрительной корой, нижнюю поверхность височной доли и таламус. Её закупорка выключает противоположную половину поля зрения обоих глаз. При поражении слева бывает чистая алексия: человек пишет, но не может прочитать написанное.' },
];
const BV_OCC = [
  { id: 'mca', name: 'Средняя мозговая', text: '<b>Тромб в левой средней мозговой.</b> В центре бассейна кровотока нет, нейроны гибнут за минуты — это ядро инфаркта (тёмное). Вокруг — полутень (оранжевая): кровь подтекает от соседних артерий, клетки молчат, но живы. Растворить тромб (тромболизис) или удалить его катетером (тромбэктомия) — значит спасти полутень.' },
  { id: 'ica_ok', name: 'Сонная, круг замкнут', text: '<b>Закупорка левой внутренней сонной при полном круге.</b> Кровь в левые переднюю и среднюю мозговые приходит в обход: справа — через переднюю соединительную, сзади — через заднюю соединительную (по ней кровь идёт в обратную сторону). Если сонная сужается медленно, её закрытие может пройти незаметно.' },
  { id: 'ica_bad', name: 'Сонная, круг разомкнут', text: '<b>Та же закупорка, но соединительные артерии недоразвиты</b> — так бывает у многих людей. Обходного пути нет, и инфаркт охватывает бассейны левых передней и средней мозговых — почти всё полушарие.' },
  { id: 'ba', name: 'Основная', text: '<b>Тромб в основной артерии.</b> Без крови остаются мост, мозжечок и обе затылочные доли. Это редкий, но самый опасный инсульт: без лечения погибает большинство больных.' },
];
function makeBrainVasc() {
  rnd = mulberry(2512);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070a); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const keyL = new THREE.DirectionalLight(0xfff2e6, 0.6); keyL.position.set(2, -9, -3); keyL.intensity = 0.9; scene.add(keyL);   // снизу: основание мозга
  const DK = !matchMedia('(max-width:700px)').matches;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 3; controls.maxDistance = 18;
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const st = { mode: 'art', sel: null, ter: null, side: 'lat', occ: 'mca', tm: 0, rep: false, repA: 0, labels: true, rot: false, flow: true, fly: null, t: 0 };
  const pick = [];

  // =================== мозг ===================
  const BK = brainKit();
  const BASEC = new THREE.Color('#D8BCB8'), GRAYC = new THREE.Color('#5A5458'), COREC = new THREE.Color('#6A1626'), PENC = new THREE.Color('#F0A040');
  const TCOL = BV_TER.map((t) => new THREE.Color(t.col));
  const brainM = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.25, sheenColor: new THREE.Color(0xffd8e0), envMapIntensity: 0.35 });
  const HM = BK.hemi.map((g0, k) => { const g = g0.clone(); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)); const m = new THREE.Mesh(g, brainM); m.userData.pick = 'h:' + k; scene.add(m); pick.push(m); return m; });
  const hm = (s) => HM[s > 0 ? 0 : 1];
  const stemM = tissue(new THREE.Color('#C49AA4').multiplyScalar(0.85), { roughness: 0.5 }), cereM = tissue(new THREE.Color('#C8A0A0').multiplyScalar(0.85), { roughness: 0.55 });
  stemM.clippingPlanes = [new THREE.Plane(V3(0, 1, 0), 1.78)]; stemM.side = THREE.DoubleSide;   // продолговатый мозг срезан, как на препарате
  const STEM = new THREE.Mesh(BK.stem, stemM), CERE = new THREE.Mesh(BK.cere, cereM); scene.add(STEM, CERE);
  const SH = HM.map((m) => { const s = m.geometry.attributes.sulc, a = new Float32Array(s.count); for (let i = 0; i < s.count; i++) a[i] = 0.7 + 0.3 * smooth(-0.1, 0.03, s.getX(i)); return a; });

  // =================== проекция точек на поверхность ===================
  const RC = new THREE.Raycaster();
  const cast = (mesh, o, d) => { RC.set(o, d.clone().normalize()); const hh = RC.intersectObject(mesh, false)[0]; return hh || null; };
  const off = (hh, d, k) => hh.point.clone().addScaledVector(d.clone().normalize(), -k);
  const pI = (x, z, k = 0.04) => { const d = V3(0, 1, 0), hh = cast(hm(z >= 0 ? 1 : -1), V3(x, -4, z), d); return hh ? off(hh, d, k) : V3(x, -0.6 - k, z); };
  const pL = (x, y, s, k = 0.012) => { const d = V3(0, 0, -s), hh = cast(hm(s), V3(x, y, 4 * s), d); return hh ? off(hh, d, k) : null; };
  const pM = (x, y, s, k = 0.012) => { const d = V3(0, 0, s), hh = cast(hm(s), V3(x, y, 0), d); return hh ? off(hh, d, k) : null; };
  const pT = (x, z, k = 0.012) => { const d = V3(0, -1, 0), hh = cast(hm(z >= 0 ? 1 : -1), V3(x, 4, z), d); return hh ? off(hh, d, k) : null; };
  const stemC = (y) => { let best = null, bd = 9; for (let i = 0; i <= 200; i++) { const p = BK.stemCurve.getPointAt(i / 200); if (Math.abs(p.y - y) < bd) { bd = Math.abs(p.y - y); best = p; } } return best; };
  const pS = (y, ang, s = 1, k = 0.04) => { const c = stemC(y), a = ang * Math.PI / 180, d = V3(-Math.cos(a), 0, -s * Math.sin(a)), o = V3(c.x + 3 * Math.cos(a), y, 3 * s * Math.sin(a)), hh = cast(STEM, o, d); return hh ? off(hh, d, k) : V3(c.x + 0.3 * Math.cos(a), y, 0.3 * s * Math.sin(a)); };
  const pC = (x, z, from, k = 0.03) => { const d = from === 'up' ? V3(0, 1, 0) : from === 'down' ? V3(0, -1, 0) : V3(-1, 0, 0); const o = from === 'up' ? V3(x, -4, z) : from === 'down' ? V3(x, 1, z) : V3(3, x, z); const hh = cast(CERE, o, d); return hh ? off(hh, d, k) : null; };

  // =================== сосуды ===================
  const VES = [];   // { art, s, kind, curve, r, rev }
  const cr3 = (pts) => new THREE.CatmullRomCurve3(pts.filter(Boolean), false, 'centripetal');
  const ves = (art, s, kind, pts, r) => { const c = cr3(pts); VES.push({ art, s, kind, curve: c, r }); return c; };
  const T = {}, A = {}, J = {}, CH = {};
  const chiY = pI(0.47, 0.05, 0.09).y;
  const BT = pS(-0.66, 0), VJ = pS(-1.36, 0);
  [1, -1].forEach((s) => {
    T[s] = pI(0.4, 0.2 * s, 0.05); A[s] = pI(0.6, 0.035 * s, 0.035); J[s] = pS(-0.62, 72, s, 0.05);
    CH.ica = CH.ica || {}; CH.ica[s] = ves('ica', s, 'base', [V3(0.27, -1.5, 0.2 * s), V3(0.32, -1.18, 0.21 * s), V3(0.48, -1.04, 0.2 * s), V3(0.52, -0.92, 0.2 * s), T[s]], 0.048);
    ves('ica', s, 'base', [V3(0.5, -0.97, 0.2 * s), V3(0.76, -0.93, 0.27 * s), V3(1.05, -0.88, 0.36 * s)], 0.016);   // глазная
    CH.aca = CH.aca || {}; CH.aca[s] = ves('aca', s, 'base', [T[s], pI(0.5, 0.12 * s, 0.035), A[s]], 0.028);
    // A2: в продольной щели вокруг мозолистого тела (перикаллёзная) и по поясной борозде (каллёзно-краевая), ветви через верхний край
    ves('aca', s, 'med', [A[s], pM(0.72, -0.32, s), pM(1.0, -0.06, s), pM(0.94, 0.3, s), pM(0.62, 0.45, s), pM(0.0, 0.52, s), pM(-0.6, 0.42, s), pM(-0.86, 0.24, s)], 0.022);
    ves('aca', s, 'med', [pM(1.0, -0.02, s), pM(1.16, 0.18, s), pM(1.02, 0.5, s), pM(0.55, 0.74, s), pM(0.0, 0.84, s), pM(-0.55, 0.74, s)], 0.017);
    [[1.0, 0.5], [0.55, 0.74], [0.0, 0.84], [-0.55, 0.74]].forEach(([x, y]) => ves('aca', s, 'med', [pM(x, y, s), pT(x + 0.03, 0.14 * s), pT(x + 0.06, 0.3 * s)], 0.011));
    // M1 вбок к боковой борозде, ствол в борозде, веер корковых ветвей
    const m1 = ves('mca', s, 'base', [T[s], pI(0.45, 0.38 * s, 0.04), pI(0.52, 0.6 * s, 0.04), pL(0.6, -0.32, s, 0.02)], 0.036); CH.mca = CH.mca || {}; CH.mca[s] = m1;
    const sy = (x) => pL(x, bkLs(x), s, 0.02);
    ves('mca', s, 'lat', [pL(0.6, -0.32, s, 0.02), sy(0.45), sy(0.2), sy(-0.05), sy(-0.32)], 0.026);
    const BR = [[0.45, 0, [0.75, 0.08], [0.98, 0.3]], [0.32, 0, [0.5, 0.38], [0.62, 0.42 * s]], [0.15, 0, [0.24, 0.45], [0.28, 0.42 * s]], [-0.05, 0, [-0.1, 0.48], [-0.18, 0.42 * s]],
      [-0.28, 0, [-0.5, 0.42], [-0.72, 0.42 * s]], [-0.32, 0, [-0.75, 0.15], [-1.08, 0.3]], [-0.2, -0.12, [-0.55, -0.28], [-0.98, -0.25]], [0.18, -0.12, [0.0, -0.42], [-0.32, -0.55]], [0.48, -0.12, [0.52, -0.45], [0.38, -0.66]]];
    BR.forEach(([x0, dy, m, e]) => { const top = Math.abs(e[1]) > 0.4 && Math.abs(Math.abs(e[1]) - 0.42) < 1e-6; ves('mca', s, 'lat', [pL(x0, bkLs(x0) + dy, s, 0.016), pL(m[0], m[1], s, 0.014), top ? pT(e[0], e[1], 0.014) : pL(e[0], e[1], s, 0.014)], 0.013); });
    // задняя соединительная: от конца сонной к задней мозговой
    CH.pcom = CH.pcom || {}; CH.pcom[s] = ves('pcom', s, 'base', [T[s], pI(0.28, 0.23 * s, 0.05), J[s]], 0.014);
    // задняя мозговая: вокруг ножки мозга, по нижней поверхности к шпорной борозде
    ves('pca', s, 'base', [BT, pS(-0.64, 40, s, 0.05), J[s]], 0.03);
    ves('pca', s, 'base', [J[s], pS(-0.6, 115, s, 0.05), pS(-0.57, 150, s, 0.06), pI(-0.62, 0.3 * s, 0.03), pI(-0.95, 0.24 * s, 0.03)], 0.026);
    ves('pca', s, 'med', [pI(-0.95, 0.24 * s, 0.03), pM(-1.22, -0.16, s), pM(-1.48, -0.05, s), pM(-1.68, 0.02, s)], 0.018);   // шпорная
    ves('pca', s, 'med', [pM(-1.12, -0.2, s), pM(-1.12, 0.22, s), pM(-0.98, 0.6, s)], 0.014);   // теменно-затылочная
    ves('pca', s, 'base', [pI(-0.62, 0.3 * s, 0.03), pI(-0.3, 0.6 * s, 0.025), pI(0.15, 0.72 * s, 0.025)], 0.013);   // височные
    // позвоночные, мозжечковые
    ves('va', s, 'base', [pS(-1.95, 70, s), pS(-1.8, 55, s), pS(-1.65, 30, s), VJ], 0.04);
    ves('cbl', s, 'base', [pS(-0.72, 8, s), pS(-0.74, 60, s), pS(-0.76, 110, s, 0.05), pC(-0.85, 0.42 * s, 'down'), pC(-1.15, 0.62 * s, 'down')], 0.016);   // верхняя
    ves('cbl', s, 'base', [pS(-1.22, 6, s), pS(-1.22, 60, s), pS(-1.2, 100, s, 0.05), pC(-1.15, 0.62 * s, 'front')], 0.014);   // передняя нижняя
    ves('cbl', s, 'pica', [pS(-1.8, 45, s), pS(-1.9, 110, s, 0.05), pS(-1.75, 160, s, 0.05), pC(-1.25, 0.25 * s, 'up'), pC(-1.5, 0.42 * s, 'up')], 0.015);   // задняя нижняя
  });
  CH.acom = ves('acom', 0, 'base', [A[1], A[1].clone().lerp(A[-1], 0.5).add(V3(0.012, -0.004, 0)), A[-1]], 0.016);
  CH.ba = ves('ba', 0, 'base', [VJ, pS(-1.15, 0), pS(-0.95, 0), pS(-0.8, 0), BT], 0.042);

  // ориентиры: перекрёст, зрительные нервы и тракты, гипофиз
  const optM = tissue(new THREE.Color('#E8E0D0').multiplyScalar(0.55), { transparent: true, opacity: 0.55, depthWrite: false }), pitM = tissue(new THREE.Color('#E8B090').multiplyScalar(0.5));
  { const a = []; const C0 = V3(0.47, chiY, 0);
    [1, -1].forEach((s) => { a.push(taperTube(cr3([C0.clone().add(V3(0.02, 0, 0.03 * s)), V3(0.72, chiY - 0.04, 0.16 * s), V3(1.1, chiY - 0.12, 0.33 * s)]), () => 0.03, 20, 8));
      a.push(taperTube(cr3([C0.clone().add(V3(-0.02, 0, 0.03 * s)), pI(0.3, 0.2 * s, 0.025), pI(0.12, 0.34 * s, 0.025)]), () => 0.026, 20, 8)); });
    const x = new THREE.BoxGeometry(0.1, 0.035, 0.14); x.translate(C0.x, C0.y, C0.z); a.push(x.toNonIndexed());
    const ML = mergeGeometries(a.map((g) => (g.index ? g.toNonIndexed() : g)));
    scene.add(new THREE.Mesh(ML, optM));
    scene.add(new THREE.Mesh(taperTube(cr3([V3(0.4, chiY - 0.02, 0), V3(0.39, chiY - 0.1, 0), V3(0.38, chiY - 0.18, 0)]), () => 0.022, 10, 8), pitM));   // воронка гипофиза (срезана)
    }

  // мозолистое тело на внутренней поверхности правого полушария (вид «изнутри»)
  const CCM = new THREE.Mesh(taperTube(cr3(BKP.cc.map((p) => V3(p.x, p.y, -0.01))), (u) => 0.055 + 0.05 * smooth(0.75, 1, u) + 0.035 * (1 - smooth(0, 0.18, u)), 48, 12).scale(1, 1, 0.35), tissue(new THREE.Color('#EDE4D8').multiplyScalar(0.6)));
  CCM.visible = false; scene.add(CCM);
  // группы сосудов: одна сетка на артерию, сторону и вид; поверх — светящийся поток
  const GR = {};
  VES.forEach((v) => { const key = `${v.art}|${v.s}|${v.kind}`; (GR[key] ||= { art: v.art, s: v.s, kind: v.kind, list: [] }).list.push(v); });
  const artCol = Object.fromEntries(BV_ART.map((a) => [a.id, new THREE.Color(a.col)]));
  const VG = Object.values(GR).map((g) => {
    const geo = mergeGeometries(g.list.map((v) => taperTube(v.curve, (u) => 1.2 * v.r * (1 - 0.25 * u), Math.max(16, Math.round(v.curve.getLength() * 40)), 10)));
    const fgeo = mergeGeometries(g.list.map((v) => taperTube(v.curve, (u) => v.r * 1.5 * (1 - 0.25 * u), Math.max(16, Math.round(v.curve.getLength() * 40)), 8)));
    const m = tissue(artCol[g.art].clone().multiplyScalar(0.75), { roughness: 0.35, emissive: artCol[g.art].clone(), emissiveIntensity: 0.25 });
    const mesh = new THREE.Mesh(geo, m); mesh.userData.pick = 'a:' + g.art; scene.add(mesh); pick.push(mesh);
    const fm = flowTubeMat(artCol[g.art].clone().lerp(new THREE.Color('#ffffff'), 0.25), 0.5, 2.0); const flow = new THREE.Mesh(fgeo, fm); flow.renderOrder = 3; scene.add(flow);
    return { ...g, mesh, m, flow, fm, c0: m.color.clone(), e0: artCol[g.art].clone() };
  });
  // тромб
  const clotM = tissue(new THREE.Color('#3A0C12'), { roughness: 0.7, emissive: new THREE.Color('#5A0A14'), emissiveIntensity: 0.4 });
  const CLOT = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), clotM); CLOT.visible = false; scene.add(CLOT);
  const clotAt = { mca: () => [CH.mca[-1].getPointAt(0.45), 0.06], ica_ok: () => [CH.ica[-1].getPointAt(0.3), 0.075], ica_bad: () => [CH.ica[-1].getPointAt(0.3), 0.075], ba: () => [CH.ba.getPointAt(0.45), 0.065] };

  // =================== бассейны ===================
  const bkPo = (y) => -1.08 - 0.08 * y;
  const terr = (p, n, s) => {
    const u = p.z * s - 0.55, x = p.x, y = p.y;
    if (u < -0.44) return x < -0.72 - 0.35 * y || (y < -0.22 && x < 0.3) ? 2 : 0;   // внутренняя поверхность: сзади от теменно-затылочной борозды и внизу — задняя
    if (n.y < -0.55) { if (x > 0.55) return u < -0.15 ? 0 : 1; return x < 0.42 ? 2 : 1; }   // нижняя поверхность
    if (x < bkPo(y) - 0.12) return 2;   // затылочный полюс
    if (y > 0.15 && u < -0.18) return 0;   // полоса по верхнему краю
    if (y < bkLs(x) - 0.42 && x < 0.2) return 2;   // нижняя височная извилина
    return 1;
  };
  const TER = HM.map((m, k) => { const g = m.geometry, P = g.attributes.position, N = g.attributes.normal, a = new Uint8Array(P.count), p = V3(0, 0, 0), n = V3(0, 0, 0);
    for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); n.fromBufferAttribute(N, i); a[i] = terr(p, n, k ? -1 : 1); } return a; });
  // центры бассейнов — для роста ядра инфаркта; расстояние нормировано на самый дальний участок бассейна
  const DN = HM.map((m, k) => { const s = k ? -1 : 1, C = [pM(0.4, 0.55, s) || V3(0.4, 0.55, 0), pL(0.12, 0.02, s) || V3(0.1, 0, s), pM(-1.35, -0.05, s) || V3(-1.3, 0, 0)], P = m.geometry.attributes.position, p = V3(0, 0, 0);
    const d = new Float32Array(P.count), mx = [0, 0, 0];
    for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); const t = TER[k][i]; d[i] = p.distanceTo(C[t]); mx[t] = Math.max(mx[t], d[i]); }
    for (let i = 0; i < P.count; i++) d[i] /= mx[TER[k][i]] || 1; return d; });
  const coreF = () => Math.min(1, 0.12 + 0.88 * (1 - Math.exp(-st.tm / 180)));
  const occTer = () => ({ mca: [[1, 1]], ica_ok: [], ica_bad: [[1, 0], [1, 1]], ba: [[0, 2], [1, 2]] }[st.occ]);   // [полушарие, бассейн]
  const tmp = new THREE.Color();
  function colorBrain() {
    const occ = st.mode === 'occ' ? occTer() : [], f = coreF(), pen = st.rep ? 1 - st.repA : 1;
    HM.forEach((m, k) => { const col = m.geometry.attributes.color, a = col.array, Tk = TER[k], D = DN[k], S = SH[k];
      for (let i = 0; i < Tk.length; i++) {
        const t = Tk[i]; tmp.copy(BASEC);
        if (st.mode === 'ter') { if (!st.ter || BV_TER[t].id === st.ter) tmp.lerp(TCOL[t], 0.88); else tmp.lerp(GRAYC, 0.55); }
        else if (st.mode === 'occ' && occ.some(([kk, tt]) => kk === k && tt === t)) { if (D[i] < f) tmp.copy(COREC); else tmp.lerp(PENC, 0.78 * pen); }
        a[i * 3] = tmp.r * S[i]; a[i * 3 + 1] = tmp.g * S[i]; a[i * 3 + 2] = tmp.b * S[i];
      }
      col.needsUpdate = true; });
    const bf = st.mode === 'occ' && st.occ === 'ba' ? f : 0;
    stemM.color.set('#C49AA4').multiplyScalar(0.85).lerp(COREC, bf); cereM.color.set('#C8A0A0').multiplyScalar(0.85).lerp(st.rep ? COREC : PENC, st.mode === 'occ' && st.occ === 'ba' ? (st.rep ? bf * 0.8 : 0.7) : 0);
  }

  // =================== подсветка сосудов и потоки ===================
  const TERART = { aca: ['aca'], mca: ['mca'], pca: ['pca'] };
  function vesState(g) {
    // возвращает [видна, яркая, поток (0/1/−1)]
    if (st.mode === 'art') { const on = !st.sel || st.sel === g.art || (st.sel === 'cbl' && g.art === 'cbl'); return [true, on, st.flow && on ? (g.art === 'acom' || g.art === 'pcom' ? 0 : 1) : 0]; }
    if (st.mode === 'ter') {
      const med = st.side === 'med'; if (med && (g.s < 0 || g.s === 0)) return [false, false, 0];
      if (med && g.kind !== 'med' && !['aca', 'pca'].includes(g.art)) return [false, false, 0];
      const on = st.ter ? TERART[st.ter].includes(g.art) : ['aca', 'mca', 'pca'].includes(g.art); return [true, on, 0];
    }
    // инсульт
    const L = g.s < 0, o = st.occ, rep = st.rep;
    let fl = 1;
    if (g.art === 'acom' || g.art === 'pcom') fl = o === 'ica_ok' && (g.art === 'acom' || L) ? (g.art === 'pcom' ? -1 : 1) : 0;
    if (!rep) {
      if (o === 'mca' && L && g.art === 'mca') fl = 0;
      if ((o === 'ica_ok' || o === 'ica_bad') && L && g.art === 'ica') fl = 0;
      if (o === 'ica_bad' && L && (g.art === 'aca' || g.art === 'mca')) fl = 0;
      if (o === 'ba' && (g.art === 'pca' || g.art === 'ba' || (g.art === 'cbl' && g.kind === 'base'))) fl = 0;   // задние нижние мозжечковые — от позвоночных, кровоток в них есть
    }
    return [true, true, fl];
  }
  function colorVes() {
    VG.forEach((g) => { const [vis, on, fl] = vesState(g); g.mesh.visible = vis; g.flow.visible = vis && fl !== 0; g.fm.uniforms.uSpeed.value = 0.5 * (fl || 1);
      g.m.color.copy(g.c0); g.m.emissive.copy(g.e0); if (!on) { g.m.color.lerp(GRAYC, 0.75); g.m.emissiveIntensity = 0; } else g.m.emissiveIntensity = st.mode === 'art' && st.sel === g.art ? 0.55 : 0.25;
      if (st.mode === 'occ' && fl === 0 && !(g.art === 'acom' || g.art === 'pcom')) { g.m.color.lerp(GRAYC, 0.55); g.m.emissiveIntensity = 0.05; } });
    const c = st.mode === 'occ' && !st.rep ? clotAt[st.occ]() : null; CLOT.visible = !!c; if (c) { CLOT.position.copy(c[0]); CLOT.scale.setScalar(c[1]); }
    const med = st.mode === 'ter' && st.side === 'med'; HM[1].visible = !med; STEM.visible = CERE.visible = !med; CCM.visible = med;
  }

  // =================== виды ===================
  const VP = DK ? { art: [V3(-0.25, -0.75, 0), V3(0, -1, -0.12), 6.0, 1.2, -0.12], lat: [V3(-0.1, 0.05, 0), V3(0.02, 0.06, -1), 10.5, 1.1, -0.2], med: [V3(-0.1, 0.05, 0.1), V3(0.02, 0.06, -1), 10, 1.1, -0.2], occ: [V3(-0.05, -0.35, 0), V3(0.35, -0.5, -1), 10.5, 1.1, -0.3], occb: [V3(-0.6, -0.45, 0), V3(-0.9, -0.4, -0.75), 10.5, 1.1, -0.3] }
    : { art: [V3(-0.2, -0.75, 0), V3(0.12, -1, 0), 6.4, 0, 0], lat: [V3(-0.1, 0.05, 0), V3(0.02, 0.06, -1), 7.6, 0, 0.1], med: [V3(-0.1, 0.05, 0.1), V3(0.02, 0.06, -1), 7.3, 0, 0.1], occ: [V3(-0.05, -0.35, 0), V3(0.35, -0.5, -1), 8.0, 0, 0.1], occb: [V3(-0.6, -0.45, 0), V3(-0.9, -0.4, -0.75), 8.2, 0, 0.1] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const curView = () => (st.mode === 'art' ? 'art' : st.mode === 'ter' ? st.side : st.occ === 'ba' ? 'occb' : 'occ');
  function applyView() { st.fly = VIEW[curView()]; }
  camera.position.copy(VIEW.art.pos); controls.target.copy(VIEW.art.target);

  // =================== анимация ===================
  let lastF = -1;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    VG.forEach((g) => { g.fm.uniforms.uTime.value = st.t; });
    if (st.mode === 'occ') {
      const grow = st.occ !== 'ica_ok' && !st.rep;
      if (grow && st.tm < 360) st.tm = Math.min(360, st.tm + dt * 20);
      if (st.rep && st.repA < 1) st.repA = Math.min(1, st.repA + dt / 1.5);
      const q = Math.round(coreF() * 60) / 60 + (st.rep ? 10 + Math.round(st.repA * 20) : 0);
      if (q !== lastF) { lastF = q; colorBrain(); }
    }
  }

  // =================== выбор ===================
  function refresh() { colorBrain(); colorVes(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; st.sel = null; st.ter = null; if (m === 'occ') { st.tm = 0; st.rep = false; st.repA = 0; } lastF = -1; refresh(); applyView(); refs.modeSeg && refs.modeSeg.sync(); }
  function setSel(id) { st.sel = id === 'all' || st.sel === id ? null : id; colorVes(); refs.aseg && refs.aseg.sync(); refs.setInfo(); }
  function setTer(id) { st.ter = id === 'all' || st.ter === id ? null : id; if (st.ter) { const side = st.ter === 'mca' ? 'lat' : 'med'; if (side !== st.side) { st.side = side; applyView(); refs.vseg && refs.vseg.sync(); } } colorBrain(); colorVes(); refs.tseg && refs.tseg.sync(); refs.setInfo(); }
  function setSide(v) { st.side = v; colorVes(); applyView(); refs.vseg && refs.vseg.sync(); }
  function setOcc(id) { const vb = (st.occ === 'ba') !== (id === 'ba'); st.occ = id; if (vb) applyView(); st.tm = 0; st.rep = false; st.repA = 0; lastF = -1; colorBrain(); colorVes(); refs.oseg && refs.oseg.sync(); refs.setInfo(); }
  function reperfuse() { if (st.occ === 'ica_ok' || st.rep) return; st.rep = true; st.repA = 0; colorVes(); refs.setInfo(); }
  pickOn(() => self, camera, () => pick.filter((m) => m.visible !== false), (id, hit) => {
    if (id.startsWith('a:') && st.mode === 'art') setSel(id.slice(2));
    else if (id.startsWith('h:') && st.mode === 'ter' && hit.face) setTer(BV_TER[TER[+id.slice(2)][hit.face.a]].id);
    else if (id.startsWith('a:') && st.mode === 'ter' && ['aca', 'mca', 'pca'].includes(id.slice(2))) setTer(id.slice(2));
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const at = (c, u) => () => c.getPointAt(u);
  const artOn = (id, dk) => () => st.mode === 'art' && (st.sel === id || (!st.sel && (!dk || DK)));
  const terL = () => st.mode === 'ter' && st.side === 'lat', terM = () => st.mode === 'ter' && st.side === 'med';
  const occ = () => st.mode === 'occ';
  const P = (f) => { let c = null; return () => (c ||= f() || V3(0, 0, 0)); };
  const labels = [
    lb('внутренняя сонная', () => CH.ica[-1].getPointAt(0.55), '#F08A8A', artOn('ica')),
    lb('передняя мозговая', () => CH.aca[1].getPointAt(0.6), '#8FC0FF', artOn('aca'), true),
    lb('средняя мозговая', () => CH.mca[1].getPointAt(0.55), '#FFB070', artOn('mca'), true),
    lb('передняя соединительная', () => CH.acom.getPointAt(0.5), '#8FF0D0', artOn('acom')),
    lb('задняя соединительная', () => CH.pcom[1].getPointAt(0.5), '#8FF0D0', artOn('pcom'), true),
    lb('задняя мозговая', () => J[-1].clone().add(V3(-0.25, 0.02, -0.12)), '#F2D870', artOn('pca')),
    lb('основная', () => CH.ba.getPointAt(0.55), '#B8A0FF', artOn('ba')),
    lb('позвоночная', () => VG.find((g) => g.art === 'va' && g.s === -1).list[0].curve.getPointAt(0.45), '#D0A0FF', artOn('va')),
    lb('верхняя мозжечковая', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'base').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('передняя нижняя мозжечковая', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'base').list[1].curve.getPointAt(0.85), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('задняя нижняя мозжечковая', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'pica').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('мозжечковые', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'pica').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && !st.sel && DK, true),
    lb('глазная', () => VG.find((g) => g.art === 'ica' && g.s === -1).list[1].curve.getPointAt(0.8), '#F08A8A', () => st.mode === 'art' && st.sel === 'ica'),
    lb('зрительный перекрёст', () => V3(0.5, chiY - 0.04, -0.04), '#E8E0D0', () => st.mode === 'art' && (!st.sel ? DK : ['ica', 'aca', 'acom'].includes(st.sel))),
    lb('воронка гипофиза', () => V3(0.38, chiY - 0.18, 0), '#F0C0A0', () => st.mode === 'art' && st.sel === 'ica', true),
    lb('мост', () => pS(-0.9, 35, -1, -0.02), '#E0C8D0', () => st.mode === 'art' && st.sel === 'ba'),
    // бассейны, снаружи (левое полушарие)
    lb('средняя мозговая', P(() => pL(0.0, 0.28, -1)), '#FFC090', () => terL() && !st.ter),
    lb('передняя мозговая', P(() => pT(0.15, -0.2)), '#A8D0FF', () => terL() && !st.ter),
    lb('задняя мозговая', P(() => pL(-1.42, 0.05, -1)), '#F8E090', () => terL() && !st.ter, true),
    lb('лицо и рука', P(() => pL(bkCs(0.35) + 0.08, 0.35, -1)), '#FFD8B8', () => terL() && st.ter === 'mca'),
    lb('зона Брока', P(() => pL(0.78, -0.06, -1)), '#FFD8B8', () => terL() && st.ter === 'mca'),
    lb('зона Вернике', P(() => pL(-0.55, bkLs(-0.55) - 0.12, -1)), '#FFD8B8', () => terL() && st.ter === 'mca', true),
    lb('нога', P(() => pT(bkCs(1.0) + 0.04, -0.12)), '#C8E0FF', () => terL() && st.ter === 'aca'),
    lb('зрительная кора', P(() => pL(-1.5, 0.0, -1)), '#F8E8B0', () => terL() && st.ter === 'pca', true),
    // бассейны, изнутри (правое полушарие)
    lb('передняя мозговая', P(() => pM(0.45, 0.62, 1, -0.02)), '#A8D0FF', () => terM() && !st.ter),
    lb('задняя мозговая', P(() => pM(-1.3, 0.1, 1, -0.02)), '#F8E090', () => terM() && !st.ter, true),
    lb('нога', P(() => pM(bkCs(0.85) + 0.02, 0.85, 1, -0.02)), '#C8E0FF', () => terM() && st.ter === 'aca'),
    lb('зрительная кора', P(() => pM(-1.45, -0.05, 1, -0.02)), '#F8E8B0', () => terM() && st.ter === 'pca', true),
    lb('таламус', P(() => pM(0.05, -0.12, 1, -0.02)), '#F8E8B0', () => terM() && st.ter === 'pca'),
    lb('мозолистое тело', () => BKP.cc[2].clone().add(V3(0, 0, -0.05)), '#EDE4D8', () => terM() && !st.ter),
    // инсульт
    lb('тромб', () => CLOT.position.clone(), '#FF8080', () => occ() && CLOT.visible),
    lb('ядро инфаркта', P(() => pL(0.12, 0.02, -1)), '#E08090', () => occ() && (st.occ === 'mca' || st.occ === 'ica_bad')),
    lb('полутень', P(() => pL(0.55, 0.62, -1)), '#F8C080', () => occ() && (st.occ === 'mca' || st.occ === 'ica_bad') && !st.rep),
    lb('передняя соединительная', () => CH.acom.getPointAt(0.5), '#8FF0D0', () => occ() && st.occ === 'ica_ok', true),
    lb('задняя соединительная', () => CH.pcom[-1].getPointAt(0.5), '#8FF0D0', () => occ() && st.occ === 'ica_ok'),
    lb('мост и мозжечок', () => pS(-1.0, 70, -1, -0.02), '#E08090', () => occ() && st.occ === 'ba'),
    lb('затылочные доли', P(() => pL(-1.45, 0.1, -1)), '#E08090', () => occ() && st.occ === 'ba', true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO1 = '<b>Артериальный (виллизиев) круг</b> — кольцо артерий на основании мозга. Спереди в него впадают внутренние сонные, сзади — основная, в которую слились позвоночные. Соединительные артерии замыкают кольцо, и кровь может перетечь из одной системы в другую. Полный круг есть меньше чем у половины людей. Вид снизу, лоб слева. Выберите артерию.';
  const INTRO2 = '<b>Бассейны</b> — участки мозга, которые питает каждая мозговая артерия; их границы у разных людей немного различаются. На стыках бассейнов кровоснабжение самое скудное: при резком падении давления инфаркты возникают именно здесь. Снаружи показано левое полушарие, изнутри — правое. Выберите артерию или щёлкните по коре.';
  const REPT = '<b>Кровоток восстановлен.</b> Полутень спасена: эти нейроны снова заработают. Погибшая ткань ядра не восстановится — на её месте останется рубец, а часть утраченных функций со временем возьмут на себя соседние участки коры.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'art') { const a = BV_ART.find((x) => x.id === st.sel); ib.info.innerHTML = a ? a.text : INTRO1; return; }
      if (st.mode === 'ter') { const t = BV_TER.find((x) => x.id === st.ter); ib.info.innerHTML = t ? t.text : INTRO2; return; }
      const o = BV_OCC.find((x) => x.id === st.occ);
      ib.info.innerHTML = st.rep ? REPT : o.text;
    };
    refs.modeSeg = seg([{ id: 'art', label: 'Артерии' }, { id: 'ter', label: 'Бассейны' }, { id: 'occ', label: 'Инсульт' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.aseg = refs.tseg = refs.vseg = refs.oseg = null;
      if (st.mode === 'art') {
        refs.aseg = seg([{ id: 'all', label: 'Все' }, ...BV_ART.map((a) => ({ id: a.id, label: a.name, color: a.col }))], () => st.sel || 'all', (v) => setSel(v));
        box.append(h('div', { class: 'glabel' }, 'Артерия', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.aseg));
        view.append(toggle('Кровоток', () => st.flow, (v) => { st.flow = v; colorVes(); }));
      } else if (st.mode === 'ter') {
        refs.tseg = seg([{ id: 'all', label: 'Все' }, ...BV_TER.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.ter || 'all', (v) => setTer(v));
        refs.vseg = seg([{ id: 'lat', label: 'Снаружи' }, { id: 'med', label: 'Изнутри' }], () => st.side, (v) => setSide(v));
        box.append(h('div', { class: 'glabel' }, 'Мозговая артерия', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.tseg), h('div', { class: 'glabel' }, 'Поверхность'), h('div', { class: 'gctl' }, refs.vseg));
      } else {
        refs.oseg = seg(BV_OCC.map((o) => ({ id: o.id, label: o.name })), () => st.occ, (v) => setOcc(v));
        box.append(h('div', { class: 'glabel' }, 'Закупорка'), h('div', { class: 'gctl' }, refs.oseg, button('Восстановить кровоток', reperfuse, true), button('Заново', () => setOcc(st.occ))));
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
    if (n >= 1 && n <= 3) { setMode(['art', 'ter', 'occ'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'art') setSel('all'); else if (st.mode === 'ter') setTer('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'art') return [['От выброса сердца', '≈ 15', '%'], ['Через сонные', '≈ 80', '%']];
    if (st.mode === 'ter') return [['Масса мозга', '≈ 2', '% тела'], ['Потребляет', '≈ 20', '% кислорода']];
    if (st.occ === 'ica_ok') return [['Инфаркт', 'нет', '']];
    const m = Math.round(st.tm), hh = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0');
    return [['С начала', `${hh}:${mm}`, 'ч:мин'], ['Погибло нейронов', `≈ ${Math.round(1.9 * m)}`, 'млн']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'art' ? (st.sel ? BV_ART.find((a) => a.id === st.sel).col : '#E05555') : st.mode === 'ter' ? (st.ter ? BV_TER.find((t) => t.id === st.ter).col : '#F08A3C') : '#E05555'; },
    kicker: 'Мозг · устройство', title: 'Кровоснабжение мозга',
    lede: 'Мозг — 2 % массы тела, но берёт пятую часть кислорода и почти не имеет запасов. Его питают четыре артерии, связанные в кольцо на основании, а каждый участок коры зависит от своей ветви — поэтому инсульт так точно выдаёт, где закрылся сосуд.',
    notes: `
      <div><h2>Устройство</h2>
        <p>К мозгу идут четыре артерии: две внутренние сонные (передняя система) и две позвоночные, которые сливаются в основную (задняя система). На основании мозга их ветви связаны в артериальный (виллизиев) круг. От круга отходят три пары мозговых артерий — передние, средние и задние, — а от позвоночных и основной ещё мозжечковые и ветви к стволу.</p>
        <p>Крупные артерии идут по поверхности мозга в подпаутинном пространстве, а внутрь вещества уходят тонкие ветви. Глубокие отделы — базальные ядра, таламус, внутренняя капсула — питают тонкие прямые ветви, отходящие от круга и начала мозговых артерий.</p></div>
      <div><h2>Как это работает</h2>
        <p>Мозг получает около 15 % крови, которую выбрасывает сердце, — около 50 мл на каждые 100 г в минуту. Запасов глюкозы и кислорода у него почти нет: без кровотока сознание теряется через 10–15 секунд, а через несколько минут нейроны начинают гибнуть.</p>
        <p>Сосуды мозга сами поддерживают ровный кровоток при колебаниях давления (ауторегуляция) и расширяются там, где нейроны работают активнее, — на этом основана функциональная МРТ.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Ишемический инсульт</b> (около 85 % инсультов) — закупорка артерии тромбом или эмболом, часто из сердца при мерцательной аритмии или с бляшки сонной артерии. Признаки — по тесту «Лицо — рука — речь — время»: перекос лица, слабость руки, нарушение речи; при них сразу вызывают скорую.</li>
        <li><b>Время — мозг:</b> при закупорке крупной артерии гибнет около 1,9 млн нейронов в минуту. Тромболизис помогает в первые 4,5 часа, тромбэктомия — обычно до 6 часов, а у части больных и позже.</li>
        <li><b>Транзиторная ишемическая атака</b> — признаки инсульта, которые проходят сами за минуты. Это предупреждение: риск настоящего инсульта в ближайшие дни высок.</li>
        <li><b>Геморрагический инсульт</b> — разрыв сосуда: кровоизлияние в мозг (чаще при высоком давлении) или разрыв аневризмы артерий круга с субарахноидальным кровоизлиянием.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Модель мозга упрощена; артерии показаны толще, а их ход и ветвление — схематично. Глубокие ветви, вены и оболочки не показаны. Границы бассейнов приблизительные. Рост инфаркта ускорен: 20 минут — за секунду; число погибших нейронов — средняя оценка для закупорки крупной артерии.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`
  };
  colorBrain(); colorVes();
  window.__bv = { TER, HM, camera, controls, st, VIEW, vw, V3, setMode, setSel, setTer, setOcc, setSide, reperfuse, applyView };
  return self;
}
