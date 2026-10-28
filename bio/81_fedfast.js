// @scene fedfast makeFedfast | Обмен веществ: сытость и голод | Гормоны
/* =========================================================
   БИОХИМИЯ · ИНТЕГРАЦИЯ ОБМЕНА: потоки глюкозы, жирных кислот, кетоновых тел, аминокислот,
   лактата и глицерина между органами — от еды до 40 дней голода; инсулин/глюкагон
   ========================================================= */
const FF_ST = [
  { t: 0, name: 'После еды', text: '<b>Абсорбтивный период</b> (0–4 ч после еды). Глюкоза и аминокислоты идут из кишки в воротную вену, жиры — в хиломикронах. Высокий <b>инсулин</b>: печень запасает гликоген и превращает избыток глюкозы в жир (ЛПОНП → жировая ткань), мышцы забирают глюкозу (GLUT4) и строят гликоген и белок, жировая ткань запасает ТАГ. Мозг живёт на глюкозе.' },
  { t: 1, name: 'Натощак, 12 ч', text: '<b>Постабсорбтивный период.</b> Инсулин падает, растёт <b>глюкагон</b>. Печень расщепляет гликоген и отдаёт глюкозу — в первую очередь мозгу и эритроцитам. Жировая ткань начинает липолиз: жирные кислоты — топливо для мышц и сердца. Глюконеогенез из лактата (цикл Кори), аланина и глицерина набирает силу.' },
  { t: 2, name: 'Голод 3 дня', text: '<b>Ранний голод.</b> Гликоген печени исчерпан (за ~24 ч). Глюкозу даёт <b>глюконеогенез</b>, в основном из аминокислот мышечного белка (кортизол) и глицерина. Жирные кислоты — главное топливо почти всех тканей; печень превращает их избыток в <b>кетоновые тела</b>, уровень которых быстро растёт.' },
  { t: 3, name: 'Голод 3–6 недель', text: '<b>Длительный голод.</b> Мозг перестраивается и покрывает до 2/3 потребности <b>кетоновыми телами</b> — расход глюкозы, а значит и распад белка, резко падает: организм <b>сберегает белок</b>. Почки тоже делают глюкозу. Жира хватает на 1–2 месяца (у человека с нормальным весом); смерть наступает, когда начинается распад жизненно важных белков.' },
];
function makeFedfast() {
  rnd = mulberry(2301);
  const scene = bioStage({ rim: 0xf2c14e });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(0.1, 1.9, 17.5);
  const controls = makeControls(camera, V3(-0.2, -0.1, 0)); controls.minDistance = 4; controls.maxDistance = 35;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  bodyShell(scene, { rim: 0.3 });
  const O = {};
  const om = (id, geo, col, k = 0.45) => { const m = new THREE.Mesh(geo, organMat(col, k)); m.userData.pick = id; scene.add(m); O[id] = m; return m; };
  om('brain', ell3(0.3, 0.25, 0.35, BODY.head), '#E0A0B8');
  om('liver', blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), '#B0523A', 0.5).position.set(-0.35, 1.55, 0.15);
  om('gut', tube(Array.from({ length: 14 }, (_, i) => V3(Math.sin(i * 1.3) * 0.45, 0.95 - i * 0.05, 0.2 + Math.cos(i * 1.3) * 0.15)), 0.09, 120, 8), '#E8A0A0');
  om('fat', ell3(0.55, 0.3, 0.25, V3(0.95, 0.35, 0.3)), '#F2D08A', 0.38);
  om('mus', tube([V3(-0.47, -0.3, 0.05), V3(-0.5, -1.2, 0.08), V3(-0.48, -2.0, 0.06)], 0.24), '#C0504A', 0.4);
  om('kid', ell3(0.14, 0.24, 0.12, V3(0.55, 1.15, -0.25)), '#A04A3A', 0.45);
  om('heart', ell3(0.22, 0.27, 0.2, BODY.heart), '#C84A50', 0.45);
  const P = { brain: BODY.head.clone().add(V3(0, -0.2, 0.2)), liver: V3(-0.35, 1.55, 0.45), gut: V3(0, 0.75, 0.4), fat: V3(0.95, 0.35, 0.5), mus: V3(-0.5, -0.9, 0.3), kid: V3(0.55, 1.15, 0.1), heart: BODY.heart.clone().add(V3(0, 0, 0.2)) };
  const C = { glu: '#F2C14E', fa: '#FFB070', ket: '#FF8AB0', aa: '#7FE0A0', lac: '#FF6A6A', gly: '#C8C8D0', tag: '#E8C060' };
  // поток: [откуда, куда, вещество, вес(s)] — s от 0 (еда) до 3 (длительный голод)
  const W = (pts) => (s) => { const i = Math.min(2, Math.floor(s)), f = s - i; return pts[i] + (pts[i + 1] - pts[i]) * f; };
  const FL = [
    ['gut', 'liver', 'glu', W([1, 0, 0, 0])], ['gut', 'liver', 'aa', W([0.8, 0, 0, 0])], ['gut', 'fat', 'tag', W([0.8, 0, 0, 0])],
    ['liver', 'brain', 'glu', W([0.7, 0.8, 0.55, 0.3])], ['liver', 'mus', 'glu', W([0.6, 0.25, 0.1, 0.05])], ['liver', 'fat', 'tag', W([0.6, 0.1, 0, 0])],
    ['fat', 'mus', 'fa', W([0, 0.5, 0.9, 0.9])], ['fat', 'liver', 'fa', W([0, 0.4, 0.9, 0.9])], ['fat', 'liver', 'gly', W([0, 0.3, 0.6, 0.6])], ['fat', 'heart', 'fa', W([0.1, 0.5, 0.8, 0.8])],
    ['liver', 'brain', 'ket', W([0, 0.05, 0.6, 1])], ['liver', 'mus', 'ket', W([0, 0.05, 0.6, 0.4])], ['liver', 'heart', 'ket', W([0, 0.05, 0.5, 0.5])],
    ['mus', 'liver', 'aa', W([0, 0.3, 0.9, 0.35])], ['mus', 'liver', 'lac', W([0.2, 0.35, 0.3, 0.2])], ['kid', 'brain', 'glu', W([0, 0, 0.1, 0.35])],
  ];
  const FM = FL.map(([a, b, k, w], i) => { const pa = P[a], pb = P[b]; const mid = pa.clone().lerp(pb, 0.5).add(V3((i % 3 - 1) * 0.35, 0.15 * (i % 2 ? 1 : -1), 0.35 + (i % 4) * 0.08)); const c = new THREE.QuadraticBezierCurve3(pa, mid, pb); const f = flowTubeMat(C[k], 0.4, 2.0); scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.022, 6), f)); return { c, f, k, w }; });
  const PRT = []; for (let i = 0; i < 160; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.visible = false; scene.add(m); PRT.push({ m, f: 0, u: 0 }); }
  const st = { t: 0, s: 0, play: true, labels: true, rot: false, sel: null, msg: null, hist: [] };
  pickOn(() => self, camera, () => Object.values(O), (id) => { st.sel = id; refs.setInfo(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    if (st.play) { st.s += dt * 0.08; if (st.s > 3.6) st.s = 0; refs.sl && (refs.sl.querySelector('input').value = Math.min(3, st.s), refs.sl.querySelector('output').textContent = stateName(Math.min(3, st.s))); }
    const s = Math.min(3, st.s);
    FM.forEach((F) => { F.f.uniforms.uTime.value = t; F.f.uniforms.uOn.value = Math.max(0.03, F.w(s)); });
    PRT.forEach((p) => { if (!p.m.visible || p.u >= 1) { const i = Math.floor(rnd() * FM.length); const F = FM[i]; if (rnd() < F.w(s) * 0.6) { p.f = i; p.u = 0; p.m.visible = true; p.m.material.color.set(C[F.k]); } else { p.m.visible = false; return; } } p.u += dt * 0.35; p.m.position.copy(FM[p.f].c.getPoint(Math.min(1, p.u))); });
    const ins = [1, 0.25, 0.1, 0.08], glg = [0.15, 0.6, 0.9, 0.8]; const W2 = (a) => { const i = Math.min(2, Math.floor(s)), f = s - i; return a[i] + (a[i + 1] - a[i]) * f; };
    st.ins = W2(ins); st.glg = W2(glg); st.glu = W2([7.5, 4.8, 3.8, 3.6]); st.ket = W2([0.05, 0.2, 3.0, 7.0]); st.ffa = W2([0.1, 0.6, 1.2, 1.4]);
    O.liver.material.emissiveIntensity = 0.04 + 0.2 * st.ins; O.fat.material.emissiveIntensity = 0.04 + 0.25 * (1 - st.ins); O.brain.material.emissiveIntensity = 0.06 + 0.06 * Math.sin(t * 3);
    fx.update(dt);
  }
  const stateName = (s) => (s < 0.5 ? 'после еды' : s < 1.5 ? 'натощак 12 ч' : s < 2.5 ? 'голод 3 дня' : 'голод 3–6 нед.');
  function drawScope(ctx, w, h) {
    const A = plotAxes(ctx, w, h, { title: 'кровь: глюкоза · кетоны · инсулин', xl: 'еда → 6 недель', yl: '' });
    const curve = (arr, sc) => (u) => { const s = u * 3; const i = Math.min(2, Math.floor(s)), f = s - i; return (arr[i] + (arr[i + 1] - arr[i]) * f) / sc; };
    plotLine(ctx, A, curve([7.5, 4.8, 3.8, 3.6], 8), '#F2C14E'); plotLine(ctx, A, curve([0.05, 0.2, 3.0, 7.0], 8), '#FF8AB0'); plotLine(ctx, A, curve([1, 0.25, 0.1, 0.08], 1.1), '#7FD6FF', { lw: 1.4, dash: [4, 3] });
    const x = A.X(Math.min(3, st.s) / 3); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(x, A.Y(0)); ctx.lineTo(x, A.Y(1)); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#F2C14E'; ctx.fillText('глюкоза', A.X(0.02), A.Y(0.98)); ctx.fillStyle = '#FF8AB0'; ctx.fillText('кетоны', A.X(0.75), A.Y(0.95)); ctx.fillStyle = '#7FD6FF'; ctx.fillText('инсулин', A.X(0.12), A.Y(0.75));
  }
  const ORG = { brain: '<b>Мозг</b> тратит ~20% энергии покоя, около 120 г глюкозы в сутки, и не может использовать жирные кислоты (они не проходят через гематоэнцефалический барьер). При голоде переходит на кетоновые тела.', liver: '<b>Печень</b> — распределительный центр: запасает и отдаёт глюкозу (гликоген, глюконеогенез), делает ЛПОНП и кетоновые тела, перерабатывает аминокислоты в мочевину. Сама при голоде живёт на жирных кислотах.', gut: '<b>Кишечник</b> всасывает продукты переваривания; его клетки сами питаются в основном глутамином.', fat: '<b>Жировая ткань</b> — главное хранилище энергии (ТАГ). Инсулин: запасает; глюкагон, адреналин: отдаёт жирные кислоты и глицерин. Ещё и эндокринный орган (лептин, адипонектин).', mus: '<b>Мышцы</b> — 40% массы тела. После еды запасают гликоген и строят белок; в покое и при голоде живут на жирных кислотах и кетонах; при длительном голоде их белок — резерв аминокислот для глюконеогенеза.', kid: '<b>Почки</b> при длительном голоде синтезируют до половины глюкозы и выводят аммиак, компенсируя кислотность кетоновых тел.', heart: '<b>Сердце</b> предпочитает жирные кислоты (до 70% энергии), легко использует лактат и кетоновые тела.' };
  const labels = [
    { text: 'мозг', pos: V3(0.4, 4.5, 0), color: '#E0A0B8', show: () => st.labels }, { text: 'печень', pos: V3(-1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels }, { text: 'кишка', pos: V3(0.3, 0.55, 0.6), color: '#E8A0A0', show: () => st.labels },
    { text: 'жировая ткань', pos: V3(1.5, 0.3, 0.3), color: '#F2D08A', show: () => st.labels }, { text: 'мышцы', pos: V3(-1.3, -1.2, 0.2), color: '#C0504A', show: () => st.labels }, { text: 'почки', pos: V3(0.8, 1.2, 0.2), color: '#C07060', show: () => st.labels }, { text: 'сердце', pos: V3(0.55, 2.1, 0.3), color: '#C84A50', show: () => st.labels },
    ...[['глюкоза', 'glu'], ['жирные кислоты', 'fa'], ['кетоновые тела', 'ket'], ['аминокислоты', 'aa'], ['лактат', 'lac'], ['жиры (ТАГ)', 'tag'], ['глицерин', 'gly']].map(([n, k], i) => ({ text: n, pos: V3(3.0, 3.6 - i * 0.42, 0), color: C[k], show: () => st.labels })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { const s = Math.min(3, st.s); const k = Math.min(3, Math.round(s)); ib.info.innerHTML = st.sel ? ORG[st.sel] : FF_ST[k].text; };
    refs.sl = range('ffS', 0, 3, 0.01, () => Math.min(3, st.s), (v) => { st.s = v; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); }, stateName);
    refs.pl = toggle('Идёт время', () => st.play, (v) => { st.play = v; });
    const steps = seg(FF_ST.map((x, i) => ({ id: i, label: x.name })), () => Math.min(3, Math.round(Math.min(3, st.s))), (v) => { st.s = v; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, steps });
    el.append(group('Состояние', 'клик по органу', steps, refs.sl, refs.pl), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  let lastK = -1;
  const _upd = update; function update2(dt) { _upd(dt); const k = Math.min(3, Math.round(Math.min(3, st.s))); if (k !== lastK) { lastK = k; refs.setInfo && !st.sel && refs.setInfo(); refs.steps && refs.steps.sync(); } }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { st.s = n - 1; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); refs.steps.sync(); return true; }
    if (k === ' ') { refs.pl.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Глюкоза', (st.glu || 5).toFixed(1), 'ммоль/л'], ['Кетоны', (st.ket || 0).toFixed(1), 'ммоль/л'], ['Инсулин/глюкагон', st.ins > st.glg ? 'инсулин' : 'глюкагон', '']]; }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · интеграция обмена', title: 'Обмен веществ: сытость и голод',
    lede: 'Органы делят топливо как слаженная команда: после еды — запасают, натощак — делятся, при голоде — перестраиваются так, чтобы мозг не остался без питания.',
    notes: `
      <div><h2>Регуляция</h2>
        <p>Главная пара — <b>инсулин</b> (анаболический гормон сытости) и <b>глюкагон</b> (катаболический гормон голода); их соотношение задаёт направление обмена в печени. Им помогают <b>адреналин</b> (быстрый сигнал стресса и нагрузки), <b>кортизол</b> (глюконеогенез из белка при длительном голоде и стрессе), <b>гормон роста</b> и тиреоидные гормоны.</p>
        <h3>Цифры</h3><ul><li>Запасы взрослого: гликоген ~400–500 г (≈2000 ккал), жир ~10–15 кг (≈100 000 ккал), белок мышц ~6 кг (используется лишь частично).</li><li>Сахар крови натощак ~3,9–5,5 ммоль/л (по старым нормам 3,3–5,5) даже на 40-й день голода держится около 3,5.</li></ul>
        <h3>Сахарный диабет</h3><p>Похож на «голод среди изобилия»: при нехватке инсулина клетки не получают глюкозу, печень продолжает её производить, липолиз и кетогенез включаются, как при голоде, — но сахар крови при этом высокий.</p></div>
      <div><h2>Условности</h2><ul><li>Толщина потоков — качественная оценка, а не точные величины.</li><li>Время сжато: ползунок охватывает от еды до 6 недель голода.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> состояние</li><li><code>пробел</code> пауза</li><li>клик по органу</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
