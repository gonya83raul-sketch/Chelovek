// @scene glycolysis makeGlycolysis | Гликолиз, глюконеогенез, ПФП | Углеводы
/* =========================================================
   БИОХИМИЯ · ГЛИКОЛИЗ: 10 реакций с молекулами, анаэробный и аэробный путь,
   спиртовое брожение, глюконеогенез (4 обходные реакции), пентозофосфатный путь
   ========================================================= */
const GL_N = {
  glucose: [-2.4, 2.7], g6p: [0.2, 2.7], f6p: [2.8, 2.7], f16bp: [5.4, 2.7], dhap: [8.0, 3.6], gap: [8.0, 1.3],
  bpg13: [7.0, -0.4], pg3: [4.4, -0.4], pg2: [1.8, -0.4], pep: [-0.8, -0.4], pyruvate: [-3.4, -0.4],
  lactate: [-6.2, -0.4], acetyl: [-3.4, -2.5], acetaldehyde: [-6.2, -2.5], ethanol: [-8.8, -2.5], oaa: [-5.6, 1.4], ribose5p: [-0.8, 1.15],
};
for (const k in GL_N) GL_N[k][0] = +(GL_N[k][0] * 0.92).toFixed(2); // схема уже кадра: сжатие по x
const GL_E = [
  ['e1', 'glucose', 'g6p', 'Гексокиназа', 1, ['-atp'], '<b>1. Гексокиназа</b> (в печени — глюкокиназа) фосфорилирует глюкозу за счёт АТФ. Глюкозо-6-фосфат заряжен и уже не может выйти из клетки через переносчик — глюкоза «поймана». Реакция необратима.'],
  ['e2', 'g6p', 'f6p', 'Глюкозофосфатизомераза', 2, [], '<b>2. Глюкозофосфатизомераза</b> превращает альдозу в кетозу: глюкозо-6-фосфат ⇄ фруктозо-6-фосфат.'],
  ['e3', 'f6p', 'f16bp', 'Фосфофруктокиназа', 3, ['-atp'], '<b>3. Фосфофруктокиназа</b> — главный регуляторный фермент гликолиза: вторая затрата АТФ. Аллостерически тормозится АТФ и цитратом («энергии достаточно»), активируется АМФ и фруктозо-2,6-бисфосфатом (сигнал инсулина). Необратима.'],
  ['e4', 'f16bp', 'gap', 'Альдолаза', 4, [], '<b>4. Альдолаза</b> разрезает шестиуглеродный фруктозо-1,6-бисфосфат пополам — на две триозы: дигидроксиацетонфосфат и глицеральдегид-3-фосфат (дихотомия).'],
  ['e4b', 'f16bp', 'dhap', 'Альдолаза', 4, [], '<b>4. Альдолаза</b> разрезает шестиуглеродный фруктозо-1,6-бисфосфат пополам — на две триозы: дигидроксиацетонфосфат и глицеральдегид-3-фосфат (дихотомия).'],
  ['e5', 'dhap', 'gap', 'Триозофосфатизомераза', 5, [], '<b>5. Триозофосфатизомераза</b> переводит дигидроксиацетонфосфат в глицеральдегид-3-фосфат, так что дальше идут две одинаковые молекулы — все следующие реакции происходят дважды.'],
  ['e6', 'gap', 'bpg13', 'Глицеральдегидфосфатдегидрогеназа', 6, ['nadh'], '<b>6. Глицеральдегид-3-фосфатдегидрогеназа</b> — гликолитическая оксидоредукция: альдегид окисляется, НАД⁺ восстанавливается в НАДН, и энергия окисления запасается в макроэргической связи <b>1,3-бисфосфоглицерата</b> (с присоединением неорганического фосфата).'],
  ['e7', 'bpg13', 'pg3', 'Фосфоглицераткиназа', 7, ['+atp'], '<b>7. Фосфоглицераткиназа</b> — первое <b>субстратное фосфорилирование</b>: фосфат с 1,3-бисфосфоглицерата переходит на АДФ. На глюкозу — 2 АТФ: затраты окупились.'],
  ['e8', 'pg3', 'pg2', 'Фосфоглицеромутаза', 8, [], '<b>8. Фосфоглицеромутаза</b> переносит фосфат с 3-го углерода на 2-й.'],
  ['e9', 'pg2', 'pep', 'Енолаза', 9, ['h2o'], '<b>9. Енолаза</b> отнимает воду и создаёт макроэрг <b>фосфоенолпируват</b> (−61,9 кДж/моль — самый «богатый» фосфат клетки). Ион <b>фторида</b> блокирует енолазу — поэтому кровь на глюкозу берут в пробирки с фторидом натрия: эритроциты перестают её съедать.'],
  ['e10', 'pep', 'pyruvate', 'Пируваткиназа', 10, ['+atp'], '<b>10. Пируваткиназа</b> — второе субстратное фосфорилирование: ещё 2 АТФ на глюкозу. Необратима, регулируется (активирует фруктозо-1,6-бисфосфат, тормозят АТФ и аланин; в печени выключается фосфорилированием по сигналу глюкагона).'],
  ['e11', 'pyruvate', 'lactate', 'Лактатдегидрогеназа', 11, ['-nadh'], '<b>11. Лактатдегидрогеназа</b> — без кислорода НАДН некуда отдать, и пируват восстанавливается в <b>лактат</b>; НАД⁺ возвращается в реакцию 6, и гликолиз может продолжаться. Так работают эритроциты (у них нет митохондрий), мышцы при спринте, опухоли.'],
  ['e12', 'pyruvate', 'acetyl', 'Пируватдегидрогеназа', 12, ['co2', 'nadh'], '<b>Аэробный путь.</b> С кислородом пируват уходит в митохондрию, пируватдегидрогеназа делает из него ацетил-КоА (+ НАДН, CO₂), а тот сгорает в цикле Кребса. Гликолитический НАДН отдаёт водород в дыхательную цепь через челночные системы.'],
  ['e13', 'pyruvate', 'acetaldehyde', 'Пируватдекарбоксилаза', 12, ['co2'], '<b>Пируватдекарбоксилаза</b> дрожжей (кофермент ТПФ — витамин B1) отщепляет CO₂ — пузырьки в тесте, пиве, шампанском.'],
  ['e14', 'acetaldehyde', 'ethanol', 'Алкогольдегидрогеназа', 13, ['-nadh'], '<b>Алкогольдегидрогеназа</b> восстанавливает ацетальдегид в <b>этанол</b>, возвращая НАД⁺. Итог спиртового брожения: глюкоза → 2 этанол + 2 CO₂ + 2 АТФ.'],
  ['e15', 'g6p', 'ribose5p', 'Глюкозо-6-фосфатдегидрогеназа', 14, ['nadph', 'nadph', 'co2'], '<b>Пентозофосфатный путь</b> (прямое окисление глюкозы). Глюкозо-6-фосфатдегидрогеназа и следующие ферменты дают <b>2 НАДФН</b> и CO₂ и <b>рибозо-5-фосфат</b> — сахар для ДНК, РНК, АТФ. НАДФН нужен для синтеза жиров и холестерина и для защиты от окислителей (восстановление глутатиона). Наследственный дефицит Г6ФДГ (у сотен миллионов людей) вызывает разрушение эритроцитов после конских бобов или некоторых лекарств. Неокислительная ветвь (транскетолаза с ТПФ, трансальдолаза) возвращает лишние пентозы во фруктозо-6-фосфат и глицеральдегид-3-фосфат.'],
  ['b1', 'pyruvate', 'oaa', 'Пируваткарбоксилаза', 21, ['-atp'], '<b>I. Пируваткарбоксилаза</b> (митохондрии, кофермент <b>биотин</b>) присоединяет CO₂: пируват → оксалоацетат, тратит АТФ. Активируется ацетил-КоА.'],
  ['b2', 'oaa', 'pep', 'ФЕП-карбоксикиназа', 22, ['-gtp', 'co2'], '<b>II. ФЕП-карбоксикиназа</b> отщепляет тот же CO₂ и за счёт ГТФ даёт фосфоенолпируват — так обходится необратимая пируваткиназа.'],
  ['b3', 'f16bp', 'f6p', 'Фруктозо-1,6-бисфосфатаза', 23, ['pi'], '<b>III. Фруктозо-1,6-бисфосфатаза</b> гидролизом снимает фосфат — обход фосфофруктокиназы. Тормозится АМФ и фруктозо-2,6-бисфосфатом, поэтому гликолиз и глюконеогенез не крутятся одновременно впустую.'],
  ['b4', 'g6p', 'glucose', 'Глюкозо-6-фосфатаза', 24, ['pi'], '<b>IV. Глюкозо-6-фосфатаза</b> есть только в печени и почках: она освобождает глюкозу в кровь. Мышцы этого не умеют — их гликоген идёт только на себя. Наследственный дефицит — болезнь Гирке (гликогеноз I типа).'],
];
const GL_MODES = {
  anaer: { name: 'Анаэробный', route: ['e1', 'e2', 'e3', 'e4', 'e4b', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11'], text: '<b>Анаэробный гликолиз</b> идёт в цитоплазме без кислорода: глюкоза → 2 лактата. <b>Стадия 1</b> (реакции 1–5) — вложение: 2 АТФ тратятся, чтобы активировать глюкозу и разрезать её на две триозы. <b>Стадия 2</b> (6–10) — отдача: 2 НАДН и 4 АТФ субстратным фосфорилированием. Итог: <b>2 АТФ</b> на глюкозу. НАДН расходуется на восстановление пирувата в лактат. Лактат печень снова превращает в глюкозу — <b>цикл Кори</b>. Нажмите на стрелку-реакцию.' },
  aer: { name: 'Аэробный', route: ['e1', 'e2', 'e3', 'e4', 'e4b', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e12'], text: '<b>Аэробный распад глюкозы.</b> Те же 10 реакций до пирувата, но НАДН отдаёт водород дыхательной цепи (по учебнику +6 АТФ), а пируват окисляется в митохондриях до CO₂ и H₂O (2 × 15 = 30 АТФ). Итого <b>38 АТФ</b> на молекулу глюкозы (по современным данным ≈ 30–32) — в 19 раз больше, чем без кислорода. Поэтому с появлением кислорода расход глюкозы падает и лактат перестаёт копиться (<b>эффект Пастера</b>).' },
  yeast: { name: 'Спиртовое брожение', route: ['e1', 'e2', 'e3', 'e4', 'e4b', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e13', 'e14'], text: '<b>Спиртовое брожение</b> дрожжей: те же 10 реакций, но НАД⁺ возвращается иначе — пируват декарбоксилируется до ацетальдегида, тот восстанавливается в этанол. Глюкоза → 2 этанол + 2 CO₂ + 2 АТФ. У человека этого пути нет; алкоголь печень окисляет обратно в ацетальдегид и ацетат.' },
  gng: { name: 'Глюконеогенез', route: ['b1', 'b2', 'r9', 'r8', 'r7', 'r6', 'r5', 'r4b', 'r4', 'b3', 'r2', 'b4'], text: '<b>Глюконеогенез</b> — синтез глюкозы в печени (и почках) из лактата, пирувата, глицерина и аминокислот при голодании. Семь реакций гликолиза обратимы и идут назад, а три необратимые <b>обходятся</b> четырьмя особыми ферментами (I–IV, красные стрелки). Цена: 4 АТФ + 2 ГТФ + 2 НАДН на молекулу глюкозы. Включается глюкагоном и кортизолом, тормозится инсулином.' },
  ppp: { name: 'Пентозофосфатный путь', route: ['e1', 'e15'], text: '<b>Пентозофосфатный путь</b> — ответвление от глюкозо-6-фосфата. Он не даёт АТФ, но поставляет <b>НАДФН</b> и <b>рибозу</b>. Особенно активен в печени, жировой ткани, надпочечниках, молочной железе и эритроцитах.' },
};
function makeGlycolysis() {
  rnd = mulberry(1201);
  const scene = bioStage({ rim: 0xff8ab0 });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(-1.1, DK ? 1.5 : 0.8, DK ? 25 : 22);
  const controls = makeControls(camera, V3(-1.1, DK ? -1.4 : -2.0, 0)); controls.minDistance = 4; controls.maxDistance = 40;
  controls.minAzimuthAngle = -0.6; controls.maxAzimuthAngle = 0.6; controls.minPolarAngle = 1.1; controls.maxPolarAngle = 2.0; // плоская схема: подписи не уходят к соседям
  const fx = new Sparks(1600, 0.09); scene.add(fx.obj);
  const NP = (id) => V3(GL_N[id][0], GL_N[id][1], 0);
  const NODE = {}; Object.keys(GL_N).forEach((id) => { const m = molMesh(MOL(id), { scale: id === 'acetyl' ? 0.22 : 0.18, hideH: true }); m.position.copy(NP(id)); scene.add(m); NODE[id] = m; });
  const EDGE = {};
  GL_E.forEach(([id, a, b, name, n, tk]) => {
    const pa = NP(a), pb = NP(b), d = pb.clone().sub(pa); const L = d.length(); d.normalize();
    const s = pa.clone().addScaledVector(d, 0.75), e = pb.clone().addScaledVector(d, -0.75);
    const byp = id.startsWith('b');
    const fa = flowArrow(scene, byp ? s.clone().add(V3(0, 0, 0.25)) : s, byp ? e.clone().add(V3(0, 0, 0.25)) : e, byp ? '#FF6A6A' : id === 'e15' ? '#7FE0A0' : '#9FD0FF', { bend: byp ? 0.22 : 0.06, r: 0.03, speed: 0.5 });
    if (fa.cone) { const c2 = fa.cone.clone(); c2.position.copy(fa.curve.getPoint(0.03)); c2.quaternion.setFromUnitVectors(V3(0, 1, 0), fa.curve.getTangent(0.03).negate()); c2.visible = false; scene.add(c2); fa.cone2 = c2; } // наконечник для обратного хода
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, Math.max(0.2, L - 1.5), 8), new THREE.MeshBasicMaterial({ visible: false })); pick.position.copy(pa).lerp(pb, 0.5); pick.quaternion.setFromUnitVectors(V3(0, 1, 0), d); pick.userData.pick = id; scene.add(pick);
    EDGE[id] = { id, a, b, name, n, tk, fa, pick, byp };
  });
  const tok = glowNucleus(scene, V3(0, 0, 0), '#FFD070', 0.12, 10);
  const enol = proteinMesh('eno', { scale: 0.026, colorBy: () => '#7FE0A0' }); enol.position.set(0.4, -2.9, -0.4); scene.add(enol);
  const side = [];
  const TKC = { '-atp': ['−АТФ', '#FF6A6A'], '+atp': ['+АТФ', '#FFD070'], nadh: ['НАДН', '#FFE08A'], '-nadh': ['НАДН → НАД⁺', '#C8A0FF'], co2: ['CO₂', '#C8C8D0'], h2o: ['H₂O', '#7FD6FF'], nadph: ['НАДФН', '#7FE0A0'], '-gtp': ['−ГТФ', '#FF8A5C'], pi: ['Фн', '#FF9A30'] };
  function spawnSide(kind, p) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(TKC[kind][1]), transparent: true })); m.position.copy(p); scene.add(m); side.push({ m, age: 0, v: V3(rand(-0.3, 0.3), kind.startsWith('-') ? -0.6 : 0.8, rand(0.2, 0.6)), kind }); }
  const st = { t: 0, mode: 'anaer', step: 0, u: 0, labels: true, rot: false, sel: null, fluor: false, msg: null, cnt: { spent: 0, made: 0, nadh: 0, nadph: 0 } };
  const INV = { '+atp': '-atp', nadh: '-nadh', h2o: 'h2o' };
  const edgeOf = (r) => { if (r.startsWith('r')) { const e = EDGE['e' + r.slice(1)]; return { ...e, a: e.b, b: e.a, rev: true, tk: e.tk.map((k) => INV[k] || k) }; } return EDGE[r]; };
  function setMode(m) { st.mode = m; st.step = 0; st.u = 0; st.sel = null; st.msg = null; st.cnt = { spent: 0, made: 0, nadh: 0, nadph: 0 }; refs.modeSeg && refs.modeSeg.sync(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => Object.values(EDGE).map((e) => e.pick), (id) => { st.sel = id; st.msg = null; refs.setInfo(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.3;
    const route = GL_MODES[st.mode].route.map(edgeOf);
    const cur = route[st.step];
    const blocked = st.fluor && (cur.id === 'e9');
    if (!(blocked && st.u > 0.45)) st.u += dt / 1.3;
    if (st.u >= 1) {
      cur.tk.forEach((k) => { const p = NP(cur.b).add(V3(0.3, 0.4, 0.4)); const mult = cur.n >= 6 && cur.n <= 11 && !cur.byp ? 2 : 1; for (let q = 0; q < mult; q++) spawnSide(k, p.clone().add(V3(q * 0.3, 0, 0))); if (k === '-atp' || k === '-gtp') st.cnt.spent += mult; if (k === '+atp') st.cnt.made += mult; if (k === 'nadh') st.cnt.nadh += mult; if (k === '-nadh') st.cnt.nadh -= mult; if (k === 'nadph') st.cnt.nadph += 1; });
      st.u = 0; st.step++;
      if (st.step >= route.length) { st.step = 0; st.cnt = { spent: 0, made: 0, nadh: 0, nadph: 0 }; }
    }
    const c2 = route[st.step]; const pa = NP(c2.a), pb = NP(c2.b);
    const p = c2.rev ? edgeOf(c2.id).fa.curve.getPoint(1 - smooth(0, 1, st.u)) : EDGE[c2.id].fa.curve.getPoint(smooth(0, 1, st.u));
    tok.core.position.copy(p); tok.spr.position.copy(p);
    // активные молекулы, стрелки
    const inRoute = new Set(route.map((e) => e.id)); const nodesOn = new Set(route.flatMap((e) => [e.a, e.b])); if (st.mode !== 'gng' && st.mode !== 'ppp') nodesOn.add('dhap');
    Object.values(EDGE).forEach((e) => { e.fa.mat.uniforms.uTime.value = t; e.fa.mat.uniforms.uSpeed.value = route.some((r) => r.id === e.id && r.rev) ? -0.5 : 0.5; e.fa.mat.uniforms.uOn.value = e.id === c2.id ? 1 : inRoute.has(e.id) ? 0.35 : 0.05; if (e.fa.cone) { const r = route.find((q) => q.id === e.id); e.fa.cone.visible = !!r && !r.rev; e.fa.cone2.visible = !!r && !!r.rev; } });
    Object.entries(NODE).forEach(([id, m]) => { const on = nodesOn.has(id); m.visible = true; molFade(m, on ? 1 : 0.15); m.rotation.y += dt * 0.4; const hot = id === c2.b && st.u > 0.7 || id === c2.a && st.u < 0.3; const s = hot ? 1.25 : 1; m.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
    enol.visible = st.mode !== 'ppp'; enol.rotation.y += dt * 0.3;
    if (blocked && rnd() < 0.2) fx.spawn(p.clone(), randUnit().multiplyScalar(0.3), new THREE.Color(0xff6a6a), 0.5, 1, 1.2);
    for (let i = side.length - 1; i >= 0; i--) { const s = side[i]; s.age += dt; s.m.position.addScaledVector(s.v, dt); s.m.material.opacity = 1 - s.age / 2.2; if (s.age > 2.2) { scene.remove(s.m); side.splice(i, 1); } }
    st.cur = c2;
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    ctx.clearRect(0, 0, w, h); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('баланс на 1 глюкозу (по учебнику)', 8, 12);
    const rows = { anaer: [['затрачено АТФ', -2, '#FF6A6A'], ['синтез АТФ', 4, '#FFD070'], ['итог АТФ', 2, '#7FE0A0']], aer: [['гликолиз', 2, '#FFD070'], ['2 НАДН → цепь', 6, '#FFE08A'], ['2 пирувата → CO₂', 30, '#7FD6FF'], ['итог АТФ', 38, '#7FE0A0']], yeast: [['затрачено', -2, '#FF6A6A'], ['синтез', 4, '#FFD070'], ['итог АТФ', 2, '#7FE0A0']], gng: [['АТФ', -4, '#FF6A6A'], ['ГТФ', -2, '#FF8A5C'], ['НАДН', -2, '#C8A0FF']], ppp: [['НАДФН', 2, '#7FE0A0'], ['CO₂', 1, '#C8C8D0'], ['АТФ', 0, '#FFD070']] }[st.mode];
    const mx = Math.max(...rows.map((r) => Math.abs(r[1])), 4);
    rows.forEach(([n, v, c], k) => { const y = 22 + k * 22; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 8, y + 11); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(120, y, (w - 160) * Math.abs(v) / mx, 14); ctx.globalAlpha = 1; ctx.fillStyle = '#EFEAE6'; ctx.fillText((v > 0 ? '+' : '') + v, 124 + (w - 160) * Math.abs(v) / mx, y + 11); });
  }
  const labels = [
    ...Object.keys(GL_N).map((id) => ({ text: MOL(id).name, pos: NP(id).add(id === 'dhap' ? V3(-3.3, 0.2, 0) : id === 'gap' ? V3(-3.4, -0.1, 0) : V3(-MOL(id).name.length * 0.058, ['f6p', 'pg3', 'pep'].includes(id) ? -1.06 : -0.74, 0)), color: '#EFEAE6', show: () => st.labels && (GL_MODES[st.mode].route.map(edgeOf).some((e) => e.a === id || e.b === id) || (id === 'dhap' && st.mode !== 'gng' && st.mode !== 'ppp')) })),
    ...GL_E.map(([id, a, b, name, n]) => ({ text: `${n <= 11 ? n + '. ' : n > 20 ? ['I', 'II', 'III', 'IV'][n - 21] + '. ' : ''}${name}`, pos: NP(a).lerp(NP(b), 0.5).add(id === 'e15' ? V3(-4.25, -0.5, 0.3) : id === 'e4b' ? V3(-1.0, 0.25, 0.3) : V3(-0.5, 0.3, 0.3)), color: id.startsWith('b') ? '#FF8A8A' : '#9FD0FF', show: () => st.labels && st.cur && (st.cur.id === id) })),
    { text: 'енолаза (PDB 3ENL)', pos: V3(1.4, -3.4, 0.4), color: '#7FE0A0', show: () => st.labels && st.mode !== 'ppp' },
    { text: 'фторид блокирует', pos: NP('pg2').lerp(NP('pep'), 0.5).add(V3(-0.4, -0.5, 0.5)), color: '#FF6A6A', show: () => st.labels && st.fluor },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const e = GL_E.find((x) => x[0] === st.sel); ib.info.innerHTML = st.msg || (e ? e[6] : GL_MODES[st.mode].text); };
    refs.modeSeg = seg(Object.entries(GL_MODES).map(([k, v]) => ({ id: k, label: v.name })), () => st.mode, (v) => setMode(v));
    const fl = toggle('Фторид', () => st.fluor, (v) => { st.fluor = v; st.msg = v ? GL_E.find((x) => x[0] === 'e9')[6] : null; refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, fl });
    el.append(group('Путь', '1–5', refs.modeSeg), group('Опыт', 'F', fl), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 5) { setMode(Object.keys(GL_MODES)[n - 1]); return true; }
    if (k === 'f' || k === 'а') { refs.fl.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Шаг', `${st.step + 1} / ${GL_MODES[st.mode].route.length}`, ''], ['АТФ', `−${st.cnt.spent} +${st.cnt.made}`, ''], [st.mode === 'ppp' ? 'НАДФН' : 'НАДН', st.mode === 'ppp' ? st.cnt.nadph * 2 : st.cnt.nadh, '']]; }
  const self = {
    mobZoom: 0.82, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8AB0',
    kicker: 'Биохимия · обмен углеводов', title: 'Гликолиз и глюконеогенез',
    lede: 'Десять реакций цитоплазмы разрезают глюкозу на два пирувата. Дальше — лактат, спирт или митохондрия; а печень умеет пройти этот путь обратно.',
    notes: `
      <div><h2>Пути глюкозы</h2>
        <p><b>Дихотомический путь</b> (гликолиз): глюкоза → 2 пирувата. Без кислорода — 2 лактата и 2 АТФ; с кислородом — CO₂ и H₂O, 38 АТФ (по учебнику). <b>Апотомический путь</b> (пентозофосфатный) — прямое окисление с образованием НАДФН и пентоз.</p>
        <p>Необратимы три реакции: <b>гексокиназная</b> (1), <b>фосфофруктокиназная</b> (3) и <b>пируваткиназная</b> (10). Их ферменты — регуляторные, а в глюконеогенезе они заменены обходными (I–IV).</p>
        <h3>Цикл Кори</h3><p>Мышца при интенсивной работе отдаёт в кровь лактат; печень превращает его снова в глюкозу и возвращает мышце. Энергию на это (6 АТФ) печень берёт от окисления жиров.</p>
        <h3>Другие сахара</h3><p>Фруктоза и галактоза включаются в гликолиз через свои ферменты. Наследственная <b>галактоземия</b> (дефект галактозо-1-фосфатуридилтрансферазы) у младенцев вызывает катаракту, поражение печени и мозга — лечится безмолочной диетой.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Молекулы — по химическим формулам (без атомов водорода); ацетил-КоА — фрагмент без коэнзима.</li><li>Реакции 6–10 на самом деле идут дважды — для каждой из двух триоз.</li><li>Енолаза — реальная структура (PDB 3ENL).</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>5</code> путь</li><li><code>F</code> фторид</li><li>клик по стрелке — реакция</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
