// @scene membrane makeMembrane | Липиды и мембраны | Липиды
/* =========================================================
   БИОХИМИЯ · ЛИПИДЫ: реальный бислой POPC (молекулярная динамика), холестерин и белок в мембране,
   жирные кислоты (насыщенные, цис/транс, омега), классы липидов, переваривание жиров
   ========================================================= */
const MB_FA = [
  { id: 'palmitic', n: 'C16:0', text: '<b>Пальмитиновая кислота</b> (C16:0) — самая частая насыщенная кислота: пальмовое масло, сливочное масло, мясо. Организм синтезирует её сам из ацетил-КоА. Прямая цепь — молекулы плотно укладываются, поэтому насыщенные жиры твёрдые при комнатной температуре.' },
  { id: 'stearic', n: 'C18:0', text: '<b>Стеариновая кислота</b> (C18:0) — насыщенная, в говяжьем и бараньем жире, какао-масле.' },
  { id: 'oleic', n: 'C18:1 ω-9, цис', text: '<b>Олеиновая кислота</b> (C18:1, ω-9) — главная кислота оливкового масла. Одна <b>цис</b>-двойная связь даёт излом ~30°: молекулы не упаковываются плотно, масло жидкое, мембрана гибкая.' },
  { id: 'elaidic', n: 'C18:1, транс', text: '<b>Элаидиновая кислота</b> — та же C18:1, но с <b>транс</b>-двойной связью: цепь прямая, как у насыщенной. Транс-жиры образуются при промышленном гидрогенизировании масел (маргарины, фритюр) и повышают риск атеросклероза — их ограничивают законом.' },
  { id: 'linoleic', n: 'C18:2 ω-6', text: '<b>Линолевая кислота</b> (C18:2, ω-6) — <b>незаменимая</b>: у человека нет ферментов, вводящих двойную связь дальше 9-го углерода. Подсолнечное, кукурузное масло. Из неё строится арахидоновая кислота.' },
  { id: 'linolenic', n: 'C18:3 ω-3', text: '<b>α-Линоленовая кислота</b> (C18:3, ω-3) — незаменимая; льняное масло, грецкие орехи. Предшественник ω-3 кислот рыбьего жира (ЭПК, ДГК), важных для мозга и сетчатки.' },
  { id: 'arachidonic', n: 'C20:4 ω-6', text: '<b>Арахидоновая кислота</b> (C20:4, ω-6) хранится в фосфолипидах мембран. Из неё ферменты циклооксигеназа и липоксигеназа делают <b>эйкозаноиды</b> — простагландины, тромбоксаны, лейкотриены (воспаление, боль, свёртывание). Аспирин и ибупрофен блокируют циклооксигеназу.' },
];
const MB_CL = [
  { id: 'tag', name: 'Триацилглицерин', text: '<b>Триацилглицерины (нейтральные жиры)</b> — эфиры глицерина и трёх жирных кислот. Самая компактная форма запаса энергии: 1 г жира даёт 9 ккал против 4 ккал у углеводов и не связывает воду. У взрослого — 10–15 кг жира, запас на месяц голодания.' },
  { id: 'popc', name: 'Фосфолипид', text: '<b>Глицерофосфолипиды</b> — дифильные молекулы: гидрофильная «голова» (фосфат + холин, этаноламин или серин) и два гидрофобных «хвоста». В воде сами собираются в бислой — основу всех мембран. Показан реальный фосфатидилхолин (лецитин) из модели мембраны.' },
  { id: 'cholesterol', name: 'Холестерин', text: '<b>Холестерин</b> — стероид с четырьмя кольцами и OH-группой. Встраивается в мембраны и регулирует их текучесть; из него делаются желчные кислоты, стероидные гормоны и витамин D. Около 80% холестерина синтезирует сам организм (в основном печень).' },
  { id: 'cholic', name: 'Желчная кислота', text: '<b>Желчные кислоты</b> (холевая, хенодезоксихолевая) синтезируются в печени из холестерина. Одна сторона их молекулы гидрофильная (три OH-группы), другая — гидрофобная: они эмульгируют жир, активируют липазу и помогают всасыванию. 90% возвращаются в печень (кишечно-печёночная циркуляция).' },
  { id: 'cortisol', name: 'Стероидный гормон', text: '<b>Стероидные гормоны</b> (кортизол, альдостерон, половые гормоны) — производные холестерина, которые синтезируют надпочечники и половые железы. Они проходят через мембрану и действуют на гены (раздел «Гормоны»).' },
];
function makeMembrane() {
  rnd = mulberry(1401);
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { bilayer: flyTarget(V3(0.4, -1.4, 1.5), V3(5.0, -0.2, 17)), fa: flyTarget(V3(40, -1.2, 0), V3(40, 0.8, 13.5)), classes: flyTarget(V3(80, -1.2, 0), V3(80, 0.9, 14.5)), digest: flyTarget(V3(120, -1.2, 0), V3(120.4, 0.6, 13.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.bilayer.pos);
  const controls = makeControls(camera, VIEW.bilayer.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  /* ---------- 1. бислой ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.7, 0); G1.scale.setScalar(0.72); scene.add(G1);
  const bil = realBilayer({ scale: 0.1, nx: 1, nz: 1 }); G1.add(bil);
  const chol = []; [[-1.6, 1], [1.4, -1], [-0.3, 1], [2.0, 1], [-2.2, -1]].forEach(([x, s], k) => { const m = molMesh(MOL('cholesterol'), { scale: 0.1, hideH: true, tint: '#F2C14E' }); const ax = pcaAxis(Array.from({ length: MOL('cholesterol').n }, (_, i) => V3(MOL('cholesterol').xyz[i * 3], MOL('cholesterol').xyz[i * 3 + 1], MOL('cholesterol').xyz[i * 3 + 2]))); m.quaternion.setFromUnitVectors(ax.v, V3(0, s, 0)); m.position.set(x, s * 0.85, 3.45 + (k % 2) * 0.15); G1.add(m); chol.push(m); });
  const RH = PDB('rho'); const rh = new THREE.Group(); const rc = cartoon(RH.chains[0], { scale: 0.1, k: 0.6, color: (i, n) => new THREE.Color().setHSL(0.55 + 0.3 * i / n, 0.6, 0.6).getStyle() }); rh.add(rc); { const ax = pcaAxis(caPoints('rho', 0.1)); rh.quaternion.setFromUnitVectors(ax.v, V3(0, 1, 0)); rh.position.copy(ax.c.clone().applyQuaternion(rh.quaternion).negate()); }
  const rhG = new THREE.Group(); rhG.add(rh); rhG.position.set(1.4, 0, 4.9); G1.add(rhG);
  const waterTop = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.3, 6.6), new THREE.MeshPhysicalMaterial({ color: 0x3a6a9a, transparent: true, opacity: 0.08, depthWrite: false, roughness: 0.2 })); waterTop.position.y = 2.6; G1.add(waterTop);
  const waterBot = waterTop.clone(); waterBot.position.y = -2.6; G1.add(waterBot);
  /* ---------- 2. жирные кислоты ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const FA = MB_FA.map((f, k) => { const m = molMesh(MOL(f.id), { scale: 0.19, hideH: false }); const ax = pcaAxis(Array.from({ length: MOL(f.id).n }, (_, i) => V3(MOL(f.id).xyz[i * 3], MOL(f.id).xyz[i * 3 + 1], MOL(f.id).xyz[i * 3 + 2]))); m.quaternion.setFromUnitVectors(ax.v, V3(0, 1, 0)); const g = new THREE.Group(); g.add(m); g.position.set((k - 3) * 1.55, 0.4, 0); G2.add(g); const pk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.2, 8), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = f.id; g.add(pk); return { f, g, m, pk }; });
  /* ---------- 3. классы ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const CL = MB_CL.map((c, k) => { const mol = c.id === 'popc' ? lipidMol(3) : MOL(c.id); const m = molMesh(mol, { scale: c.id === 'tag' ? 0.13 : 0.18, hideH: true }); const g = new THREE.Group(); g.add(m); g.position.set((k - 2) * 2.7, 0.4, 0); G3.add(g); const pk = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = c.id; g.add(pk); return { c, g, m, pk }; });
  /* ---------- 4. переваривание ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const oilMat = new THREE.MeshPhysicalMaterial({ color: 0xc89a30, roughness: 0.1, clearcoat: 1, transmission: 0, transparent: true, opacity: 0.85, emissive: 0x6a4a10, emissiveIntensity: 0.15 });
  const drops = []; for (let k = 0; k < 18; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), oilMat); G4.add(m); drops.push({ m, home: V3(rand(-3.8, 3.8), rand(-0.5, 2.4), rand(-1, 1)), r: rand(0.18, 0.32) }); }
  const big = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), oilMat); big.position.set(0, 0.9, 0); G4.add(big);
  const bileMat = new THREE.MeshBasicMaterial({ color: 0x3f8a5a }); const BILE = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.03, 0.09, 4, 6), bileMat, 400); G4.add(BILE);
  const lipases = []; for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(blobGeo(0.22, 0.18, 0.2, k + 40, 0.12, 3), protMat('#FF8AB0', 0.45)); G4.add(m); lipases.push(m); }
  const villi = new THREE.Group(); villi.position.set(0, -2.3, 0); G4.add(villi);
  for (let k = 0; k < 9; k++) { const v = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.6, 6, 14), organMat('#E8A0A0', 0.4)); v.position.set(-4 + k, 0, 0); villi.add(v); }
  const chylo = []; for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0xf2e6c8, emissive: 0xf2e6c8, emissiveIntensity: 0.2 })); m.visible = false; G4.add(m); chylo.push({ m, age: 9 }); }
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'bilayer', labels: true, rot: false, fly: null, sel: null, msg: null, cyc: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['bilayer', 'fa', 'classes', 'digest'][k] === m; }); st.fly = VIEW[m]; st.sel = null; st.msg = null; st.cyc = 0; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => [...FA.map((x) => x.pk), ...CL.map((x) => x.pk)], (id) => { st.sel = id; refs.setInfo(); refs.selSeg && refs.selSeg.sync(); });
  const dm = new THREE.Object3D();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'fa') FA.forEach((x) => { x.g.rotation.y += dt * 0.4; const s = st.sel === x.f.id ? 1.15 : 1; x.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
    if (st.mode === 'classes') CL.forEach((x) => { x.g.rotation.y += dt * 0.35; const s = st.sel === x.c.id ? 1.2 : 1; x.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
    if (st.mode === 'bilayer') { rhG.rotation.y += dt * 0.1; }
    if (st.mode === 'digest') {
      const T = 14, c = st.cyc % T;
      const em = smooth(1.5, 4.5, c); big.scale.setScalar(Math.max(0.001, 1 - em)); big.visible = em < 0.99;
      drops.forEach((d, k) => { const p = V3(0, 0.9, 0).lerp(d.home, em); d.m.position.copy(p); const shrink = 1 - 0.7 * smooth(5, 10, c); d.m.scale.setScalar(Math.max(0.001, d.r * em * shrink)); });
      let k = 0; drops.forEach((d) => { const r = d.m.scale.x; if (r < 0.05) return; for (let q = 0; q < 20 && k < 400; q++) { const n = V3(Math.cos(q * 2.4) * Math.sin(q * 0.31 + 0.3), Math.cos(q * 0.31 + 0.3), Math.sin(q * 2.4) * Math.sin(q * 0.31 + 0.3)).normalize(); dm.position.copy(d.m.position).addScaledVector(n, r + 0.03); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), n); dm.scale.setScalar(em); dm.updateMatrix(); BILE.setMatrixAt(k++, dm.matrix); } }); BILE.count = k; BILE.instanceMatrix.needsUpdate = true;
      lipases.forEach((l, j) => { const d = drops[(j * 3 + Math.floor(c)) % drops.length]; l.visible = c > 4.5 && c < 11; l.position.copy(d.m.position).add(V3(0.25, 0.15, 0.2)); l.rotation.y += dt * 2; if (l.visible && rnd() < 0.1) fx.spawn(l.getWorldPosition(V3(0, 0, 0)), V3(0, -0.6, 0), new THREE.Color(0xf2c14e), 0.9, 0, 1.1); });
      chylo.forEach((q, j) => { if (c > 10 && q.age > 3 && rnd() < 0.02) { q.age = 0; q.m.visible = true; q.m.position.set(-4 + (j * 1.6) % 9, -2.3, 0.3); } if (q.age < 3) { q.age += dt; q.m.position.y -= dt * 0.5; } else q.m.visible = false; });
      st.dphase = c < 1.5 ? 'капля жира' : c < 4.5 ? 'эмульгирование желчью' : c < 10 ? 'липаза расщепляет ТАГ' : 'всасывание, хиломикроны';
    }
    fx.update(dt);
  }
  const TXT = {
    bilayer: '<b>Мембрана</b> — двойной слой фосфолипидов. Это реальный фрагмент из компьютерной модели молекулярной динамики: 128 молекул фосфатидилхолина, каждый атом — шарик (<span style="color:#FF9A30">●</span> фосфор, <span style="color:#4F74FF">●</span> азот холина, <span style="color:#F04848">●</span> кислород; бежевое — углеводородные хвосты). Головы смотрят в воду, хвосты прячутся внутрь — толщина около 4 нм. Между фосфолипидами встроен <b>холестерин</b> (жёлтые), а насквозь проходит интегральный белок — <b>родопсин</b> (PDB 1U19). Мембрана жидкая: липиды за секунду проходят микрометры.',
    fa: '<b>Высшие жирные кислоты</b> — длинные углеводородные цепи с карбоксильной группой (слева на модели — красные атомы кислорода). <b>Насыщенные</b> — без двойных связей, прямые. <b>Ненасыщенные</b> содержат двойные связи, природные — в цис-форме, с изломом. Нажмите на кислоту.',
    classes: '<b>Классы липидов</b>: объединяет их нерастворимость в воде. Нажмите на молекулу.',
    digest: '<b>Переваривание жиров</b> идёт в тонкой кишке. Желчные кислоты (зелёные) из печени дробят большую каплю жира на мелкие — <b>эмульгируют</b>, увеличивая поверхность в тысячи раз. <b>Панкреатическая липаза</b> с колипазой (розовые) отщепляет жирные кислоты, оставляя 2-моноацилглицерин. Вместе с желчными кислотами продукты образуют <b>мицеллы</b> и всасываются клетками ворсинок; там ТАГ собираются заново и упаковываются в <b>хиломикроны</b>, которые уходят в лимфу, а не в кровь. Без желчи (закупорка протока) жир выходит с калом — стеаторея — и теряются жирорастворимые витамины.',
  };
  const labels = [
    { text: 'полярные головы', pos: V3(-2.5, 2.3, 2.4), color: '#FF9A30', show: () => st.labels && st.mode === 'bilayer' },
    { text: 'гидрофобные хвосты', pos: V3(-2.6, 0.75, 2.4), color: '#C9B98A', show: () => st.labels && st.mode === 'bilayer' },
    { text: 'холестерин', pos: V3(-1.2, 1.5, 1.8), color: '#F2C14E', show: () => st.labels && st.mode === 'bilayer' },
    { text: 'белок родопсин', pos: V3(1.2, 3.4, 2.2), color: '#9FD0FF', show: () => st.labels && st.mode === 'bilayer' },
    { text: 'вода', pos: V3(2.0, 2.8, 0), color: '#7FB8E0', show: () => st.labels && st.mode === 'bilayer' },
    ...MB_FA.map((f, k) => ({ text: f.n, pos: V3(40 + (k - 3) * 1.55 - 0.4, -1.7, 0), color: f.id === 'elaidic' ? '#FF8A5C' : /ω/.test(f.n) ? '#7FE0A0' : '#F2E6C8', show: () => st.labels && st.mode === 'fa' })),
    ...MB_CL.map((c, k) => ({ text: c.name, pos: V3(80 + (k - 2) * 2.7 - 0.6, -1.5, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'classes' })),
    { text: 'капли, покрытые желчными кислотами', pos: V3(120 - 1.5, 3.0, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'digest' && st.cyc % 14 > 4 },
    { text: 'липаза', pos: V3(120 + 2.6, 2.6, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'digest' && st.cyc % 14 > 4.5 && st.cyc % 14 < 11 },
    { text: 'ворсинки кишки', pos: V3(120 - 4.6, -2.9, 0.3), color: '#E8A0A0', show: () => st.labels && st.mode === 'digest' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const f = MB_FA.find((x) => x.id === st.sel), c = MB_CL.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'fa' && f ? f.text : st.mode === 'classes' && c ? c.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'bilayer', label: 'Мембрана' }, { id: 'fa', label: 'Жирные кислоты' }, { id: 'classes', label: 'Классы липидов' }, { id: 'digest', label: 'Переваривание' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.selSeg = null;
      if (st.mode === 'fa' || st.mode === 'classes') { const list = st.mode === 'fa' ? MB_FA.map((f) => ({ id: f.id, label: MOL(f.id).name.split(' (')[0].replace(' кислота', '') })) : MB_CL.map((c) => ({ id: c.id, label: c.name })); refs.selSeg = seg(list, () => st.sel, (v) => { st.sel = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Молекула', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.selSeg)); }
      else if (st.mode === 'digest') box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['bilayer', 'fa', 'classes', 'digest'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'bilayer' ? [['Липидов', '128', ''], ['Толщина', '≈ 4', 'нм']] : st.mode === 'digest' ? [['Этап', st.dphase || '', '']] : [['Энергия жира', '9', 'ккал/г']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F2C14E',
    kicker: 'Биохимия · обмен липидов', title: 'Липиды и мембраны',
    lede: 'Жиры — самый плотный запас энергии и основа всех клеточных мембран. Их объединяет одно: они не дружат с водой.',
    notes: `
      <div><h2>Липиды</h2>
        <p>Липиды — разнородные вещества, общее свойство которых — <b>гидрофобность</b>. Главные классы: <b>триацилглицерины</b> (запас энергии), <b>глицерофосфолипиды</b> и сфинголипиды (мембраны), <b>стероиды</b> (холестерин, желчные кислоты, стероидные гормоны, витамин D), жирорастворимые витамины, эйкозаноиды.</p>
        <p><b>Функции:</b> энергетическая (жиры дают до 40% энергии), структурная (мембраны), регуляторная (гормоны, эйкозаноиды), защитная и теплоизолирующая (подкожный жир), растворитель жирорастворимых витаминов.</p>
        <h3>Условия переваривания</h3><p>Эмульгированный жир, активная панкреатическая липаза (pH 7,5–8), белок колипаза, желчные кислоты. В желудке у взрослого жиры почти не перевариваются.</p></div>
      <div><h2>Модели</h2><ul><li>Бислой — реальная модель POPC (128 липидов) из данных молекулярной динамики пакета OpenMM; родопсин — PDB 1U19.</li><li>Холестерин и жирные кислоты — по химическим формулам, с атомами водорода (белые).</li><li>Переваривание — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li>клик по молекуле</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('bilayer'); st.fly = null;
  return self;
}
