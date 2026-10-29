// @scene purine makePurine | Нуклеотиды и подагра | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · НУКЛЕОТИДЫ: основания, нуклеотид, происхождение атомов пурина,
   распад пуринов до мочевой кислоты (ксантиноксидаза, аллопуринол, подагра),
   синтез и противоопухолевые антиметаболиты (метотрексат, 5-фторурацил)
   ========================================================= */
function makePurine() {
  rnd = mulberry(2101);
  const scene = bioStage({ rim: 0xc77dff });
  const VIEW = { build: flyTarget(V3(0, -1.5, 0), V3(0.4, 0.6, 16)), catab: flyTarget(V3(40.3, 1.2, 0), V3(40.73, 3.09, 15)), synth: flyTarget(V3(80, -1.4, 0), V3(80.8, 0.6, 15)) };
  // телефон: «Строение» столбиком — аденин сверху, пурины, пиримидины, АМФ внизу
  const MOB = matchMedia('(max-width:700px)').matches;
  if (MOB) VIEW.build = flyTarget(V3(0.2, -0.3, 0), V3(0.5, 0.9, 12.5));
  else VIEW.synth = flyTarget(V3(78.5, 0.05, 0), V3(79.3, 2.45, 17.9));
  if (MOB) { VIEW.catab = flyTarget(V3(39.65, 1.5, 0), V3(40.15, 3.0, 25)); VIEW.synth = flyTarget(V3(79.7, 0.0, 0), V3(80.2, 1.8, 24)); }   /* телефон: режимы 2–3 в ширину экрана */   /* компьютер: «Синтез» из-под заголовка и описания */
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.build.pos);
  const controls = makeControls(camera, VIEW.build.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1200, 0.08); scene.add(fx.obj);
  /* ---------- 1. строение ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  // аденин: окраска атомов по происхождению
  const A = MOL('adenine'); const SRC = { 0: 'asp', 1: 'co2', 2: 'asp', 3: 'thf', 4: 'gln', 5: 'gly', 6: 'gln', 7: 'thf', 8: 'gly', 9: 'gly' };
  const SRCC = { gly: '#7FE0A0', asp: '#FF6A6A', gln: '#7FA8FF', co2: '#C8C8D0', thf: '#F2C14E' };
  const adG = new THREE.Group(); adG.position.copy(MOB ? V3(0, 2.3, 0) : V3(0.8, 0.5, 0)); G1.add(adG);
  Object.entries(SRCC).forEach(([k, c]) => { const idx = new Set(Object.entries(SRC).filter(([, v]) => v === k).map(([i]) => +i)); adG.add(molMesh(A, { scale: 0.42, idx, tint: c, bondR: 0.11 })); });
  // связи между атомами разного происхождения — общая модель полупрозрачная
  const adAll = molMesh(A, { scale: 0.42, hideH: true }); molFade(adAll, 0.35); adG.add(adAll);
  const bases = ['adenine', 'guanine', 'cytosine', 'thymine', 'uracil'].map((id, k) => { const m = molMesh(MOL(id), { scale: MOB ? 0.2 : 0.26, hideH: true }); m.position.copy(MOB ? (k < 2 ? V3(-0.9 + k * 1.8, 0.3, 0) : V3(-1.5 + (k - 2) * 1.5, -1.5, 0)) : (k < 2 ? V3(3.6 + k * 1.6, 1.1, 0) : V3(3.0 + (k - 2) * 1.5, -0.9, 0))); G1.add(m); return m; });
  const amp = molMesh(MOL('amp'), { scale: 0.17, hideH: true }); amp.position.copy(MOB ? V3(-0.3, -3.2, 0) : V3(-1.9, -2.2, 0)); G1.add(amp);
  /* ---------- 2. распад и подагра ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const PATH = [['amp', -6.6, 1.8], ['hypoxanthine', -3.8, 1.8], ['xanthine', -1.0, 1.8], ['urate', 1.8, 1.8]];
  const pm = PATH.map(([id, x, y]) => { const m = molMesh(MOL(id), { scale: id === 'amp' ? 0.14 : 0.22, hideH: true }); m.position.set(x, y, 0); G2.add(m); return m; });
  const guan = molMesh(MOL('guanine'), { scale: 0.22, hideH: true }); guan.position.set(-3.8, 0.1, 0); G2.add(guan);
  const ar = [flowArrow(G2, V3(-5.9, 1.8, 0), V3(-4.6, 1.8, 0), '#C77DFF', { bend: 0 }), flowArrow(G2, V3(-3.0, 1.8, 0), V3(-1.8, 1.8, 0), '#FF8A5C', { bend: 0 }), flowArrow(G2, V3(-0.2, 1.8, 0), V3(1.0, 1.8, 0), '#FF8A5C', { bend: 0 }), flowArrow(G2, V3(-3.0, 0.3, 0), V3(-1.5, 1.3, 0), '#C77DFF', { bend: 0.1 })];
  const allo = molMesh(MOL('allopurinol'), { scale: 0.22, hideH: true, tint: '#7FE0A0' }); allo.position.set(-2.4, 3.2, 0); G2.add(allo);
  const xoX = [0, 1].map((k) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff5a5a })); m.position.set(-2.4 + k * 2.8, 1.8, 0.3); G2.add(m); return m; });
  // сустав большого пальца стопы с кристаллами урата
  const joint = new THREE.Group(); joint.position.set(4.6, 0.35, 0); joint.scale.setScalar(0.62); G2.add(joint);
  const bone1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.6, 10, 24), tissue(new THREE.Color('#E8DCC8').multiplyScalar(0.22))); bone1.rotation.z = Math.PI / 2 - 0.15; bone1.position.set(-1.25, -0.1, 0); joint.add(bone1);
  const bone2 = bone1.clone(); bone2.rotation.z = Math.PI / 2 + 0.15; bone2.position.set(1.25, -0.1, 0); joint.add(bone2);
  const caps = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), glassMat(0xff8a8a, { rim: 0.35, base: 0.01, keep: true })); caps.scale.set(1.0, 0.9, 0.9); joint.add(caps);
  const NCR = 70; const cry = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 5), new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xe0f0ff, emissiveIntensity: 0.4, roughness: 0.1, transparent: true, opacity: 0.9 }), NCR); joint.add(cry);
  const cryD = Array.from({ length: NCR }, () => ({ p: randUnit().multiplyScalar(rand(0.1, 0.7)), q: new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), randUnit()), L: rand(0.2, 0.5), th: rand(0, 1) }));
  /* ---------- 3. синтез и антиметаболиты ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const DH = PDB('dhfr'); const dS = 0.06;
  const dh = proteinMesh('dhfr', { scale: dS, colorBy: () => '#FF8A5C' }); G3.add(dh);
  DH.ligm.forEach((m) => dh.add(molMesh(m, { scale: dS })));
  const ldc = (() => { const m = DH.ligm[0]; const c = V3(0, 0, 0); for (let i = 0; i < m.n; i++) c.add(V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return c.multiplyScalar(dS / m.n); })();
  const mtx = molMesh(MOL('methotrexate'), { scale: dS * 1.2, hideH: true, tint: '#F2C14E' }); G3.add(mtx);
  const fol = molMesh(MOL('folate'), { scale: dS * 1.2, hideH: true }); G3.add(fol);
  const thy = molMesh(MOL('thymine'), { scale: 0.25, hideH: true }); thy.position.set(3.6, 1.7, 0); G3.add(thy);
  const fu = molMesh(MOL('fu'), { scale: 0.25, hideH: true }); fu.position.set(5.4, 1.7, 0); G3.add(fu);
  dh.position.set(-1.6, 0.4, 0);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'build', labels: true, rot: true, fly: null, cyc: 0, msg: null, allo: false, urate: 0.55, drug: 'mtx' };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['build', 'catab', 'synth'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'build') { if (st.rot) { adG.rotation.y += dt * 0.35; bases.forEach((m, k) => { m.rotation.y = 0.5 * Math.sin(t * 0.5 + k); }); amp.rotation.y = 0.5 * Math.sin(t * 0.4); } }
    if (st.mode === 'catab') {
      ar.forEach((a) => { a.mat.uniforms.uTime.value = t; }); pm.forEach((m) => { m.rotation.y += dt * 0.4; }); guan.rotation.y += dt * 0.4;
      ar[1].mat.uniforms.uOn.value = ar[2].mat.uniforms.uOn.value = st.allo ? 0.1 : 1; xoX.forEach((m) => { m.visible = st.allo; });
      allo.visible = st.allo; allo.rotation.y += dt * 0.6;
      const u = st.allo ? Math.max(0.25, st.urate * 0.5) : st.urate; st.uEff = u;
      const fill = smooth(0.4, 0.75, u);
      cryD.forEach((c, i) => { const vis = c.th < fill; dm.position.copy(c.p); dm.quaternion.copy(c.q); dm.scale.set(1, vis ? c.L * (0.6 + 0.4 * fill) : 0.001, 1); dm.updateMatrix(); cry.setMatrixAt(i, dm.matrix); }); cry.instanceMatrix.needsUpdate = true;
      caps.material.uniforms.uColor.value.set(fill > 0.5 ? '#FF5A5A' : '#FF8A8A'); caps.material.uniforms.uRim.value = 0.35 + fill * 0.5;
      if (fill > 0.4 && rnd() < 0.1 * fill) fx.spawn(joint.position.clone().add(G2.position).add(randUnit().multiplyScalar(0.9)), randUnit().multiplyScalar(0.2), new THREE.Color(0xff5a5a), 0.6, 1, 1.1);
    }
    if (st.mode === 'synth') {
      if (st.rot) dh.rotation.y += dt * 0.2;
      const c = st.cyc % 8; const site = ldc.clone().add(V3(0.5, 0.6, 0.4)).applyEuler(dh.rotation).add(dh.position);
      const comp = st.drug === 'mtx';
      fol.visible = true; mtx.visible = comp;
      const inF = smooth(0, 2, c) * (comp ? 0.35 : 1); fol.position.copy((MOB ? V3(-6.2, 2.4, 0) : V3(-5.6, -0.6, 0)).lerp(site, inF)); fol.rotation.y += dt;
      mtx.position.copy(V3(2.0, 2.6, 0).lerp(site, smooth(0, 1.5, c))); mtx.rotation.y += dt;
      [thy, fu].forEach((m) => { m.rotation.y += dt * 0.5; });
    }
    fx.update(dt);
  }
  const TXT = {
    build: '<b>Нуклеотид</b> = азотистое основание + пентоза + фосфат (слева — <b>АМФ</b>). Основания: <b>пурины</b> (аденин, гуанин — два кольца) и <b>пиримидины</b> (цитозин, тимин, урацил — одно кольцо; справа). В ДНК — дезоксирибоза и тимин, в РНК — рибоза и урацил. В центре — <b>аденин</b>, атомы раскрашены по происхождению при синтезе пуринового кольца: <span style="color:#7FE0A0">глицин</span> (C4, C5, N7), <span style="color:#FF6A6A">аспартат</span> (N1 и аминогруппа), <span style="color:#7FA8FF">глутамин</span> (N3, N9), <span style="color:#C8C8D0">CO₂</span> (C6), <span style="color:#F2C14E">формил-ТГФК</span> — производное фолиевой кислоты (C2, C8). Кольцо собирается прямо на рибозо-5-фосфате (из ФРПФ).',
    catab: '<b>Распад пуринов.</b> АМФ → ИМФ → инозин → <b>гипоксантин</b> → <b>ксантин</b> → <b>мочевая кислота</b>; гуанин тоже даёт ксантин. Последние две реакции выполняет <b>ксантиноксидаза</b> (молибден, ФАД). У человека мочевая кислота — конечный продукт, она плохо растворима. При избытке (наследственность, мясо и пиво, почечная недостаточность) её натриевая соль выпадает игольчатыми <b>кристаллами в суставах</b> — <b>подагра</b>, приступ чаще всего в большом пальце стопы, и камни в почках. Включите <b>аллопуринол</b> — аналог гипоксантина, ингибитор ксантиноксидазы: мочевой кислоты образуется меньше, кристаллы растворяются.',
    synth: '<b>Синтез нуклеотидов и антиметаболиты.</b> Пурины и пиримидины клетка строит из аминокислот, CO₂ и рибозы, а для переноса одноуглеродных групп нужна <b>тетрагидрофолиевая кислота</b> — её восстанавливает дигидрофолатредуктаза (реальная структура с коферментом НАДФН, PDB 1RX1). Быстро делящиеся клетки особенно зависят от этого пути, и на этом построена химиотерапия: <b>метотрексат</b> — аналог фолата, прочно занимает ДГФР; <b>5-фторурацил</b> (справа рядом с тимином) — аналог тимина, блокирует тимидилатсинтазу. Часть оснований клетка не синтезирует заново, а переиспользует — <b>«путь спасения»</b> через фермент ГГФРТ; его наследственный дефект — <b>синдром Леша — Найхана</b> (подагра и самоповреждения у мальчиков).',
  };
  const labels = [
    ...['gly', 'asp', 'gln', 'co2'].map((k, i) => ({ text: MOL(k).name, pos: V3(-0.25, 1.3 - i * 0.42, 0), color: SRCC[k], left: true, show: () => st.labels && st.mode === 'build' && !MOB })), { text: 'фолат', pos: V3(-0.25, 1.3 - 4 * 0.42, 0), color: SRCC.thf, left: true, show: () => st.labels && st.mode === 'build' && !MOB },
    { text: 'аденин: откуда атомы', pos: MOB ? V3(0.7, 3.2, 0) : V3(0.2, 2.2, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'build' },
    { text: 'АМФ (нуклеотид)', pos: MOB ? V3(-0.9, -4.0, 0) : V3(-2.5, -3.1, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'build' },
    ...['аденин', 'гуанин'].map((n, k) => ({ text: n + ' · пурин', pos: MOB ? V3(-1.4 + k * 1.8, -0.45, 0) : V3(3.6 + k * 1.6 - 0.5, 0.3, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'build' })),
    ...['цитозин', 'тимин (ДНК)', 'урацил (РНК)'].map((n, k) => ({ text: n, pos: MOB ? V3(-1.9 + k * 1.5, -2.15 - (k % 2) * 0.28, 0) : V3(3.0 + k * 1.5 - 0.4, -1.65, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'build' })),
    ...PATH.map(([id, x, y]) => ({ text: MOL(id).name, pos: V3(40 + x - 0.6, y - 0.95, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'catab' })),
    { text: 'гуанин', pos: V3(40 - 4.3, -0.7, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'catab' },
    { text: 'ксантиноксидаза', pos: V3(40 - 1.6, 2.5, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'catab' && !st.allo },
    { text: 'аллопуринол блокирует', pos: V3(40 - 1.8, 3.9, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'catab' && st.allo },
    { text: 'сустав: кристаллы урата', pos: V3(40 + 4.1, -0.6, 0), color: '#FF8A8A', show: () => st.labels && st.mode === 'catab' },
    { text: 'ДГФР + НАДФН (PDB 1RX1)', pos: V3(80 - 2.6, -1.8, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'synth' },
    { text: 'метотрексат', pos: V3(80 + 2.0, 3.2, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'synth' && st.drug === 'mtx' },
    { text: 'фолат', pos: MOB ? V3(74, 3, 0) : V3(74.2, 0.1, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'synth' },
    { text: 'тимин', pos: V3(80 + 3.3, 0.9, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'synth' },
    { text: '5-фторурацил', pos: V3(80 + 5.0, 0.9, 0), color: '#9BE07A', show: () => st.labels && st.mode === 'synth' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'build', label: 'Строение' }, { id: 'catab', label: 'Распад и подагра' }, { id: 'synth', label: 'Синтез и антиметаболиты' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 380px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'catab') box.append(h('div', { class: 'glabel' }, 'Мочевая кислота крови и лечение'), h('div', { class: 'gctl' }, range('uA', 0.15, 0.9, 0.01, () => st.urate, (v) => { st.urate = v; }, (v) => `${v.toFixed(2)} ммоль/л`), toggle('Аллопуринол', () => st.allo, (v) => { st.allo = v; })));
      else if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'В активный центр'), h('div', { class: 'gctl' }, seg([{ id: 'fol', label: 'Только фолат' }, { id: 'mtx', label: 'Фолат + метотрексат', color: '#F2C14E' }], () => st.drug, (v) => { st.drug = v; st.cyc = 0; })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['build', 'catab', 'synth'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'catab' ? [['Мочевая кислота', (st.uEff || st.urate).toFixed(2).replace('.', ','), 'ммоль/л'], ['Норма', '< 0,42', 'муж.']] : st.mode === 'synth' ? [['Препарат', st.drug === 'mtx' ? 'Метотрексат' : '—', '']] : [['Оснований', '5', ''], ['Нуклеотидов ДНК', '4', 'вида']]; }
  const self = {
    mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#C77DFF',
    kicker: 'Биохимия · обмен нуклеотидов', title: 'Нуклеотиды и подагра',
    lede: 'Из чего строятся буквы генетического кода, во что они превращаются при распаде и почему избыток мочевой кислоты оборачивается болью в суставах.',
    notes: `
      <div><h2>Обмен нуклеотидов</h2>
        <p>Нуклеопротеины пищи расщепляются: в желудке — на белки и нуклеиновые кислоты, в кишке ДНК-азы и РНК-азы поджелудочной железы и фосфодиэстеразы дают нуклеотиды, нуклеотидазы — нуклеозиды, которые и всасываются. Но для синтеза своих нуклеиновых кислот организм почти полностью делает нуклеотиды сам.</p>
        <h3>Пурины и подагра</h3><p>Пуриновое кольцо собирается de novo прямо на рибозо-5-фосфате (ФРПФ): атомы дают глицин, глутамин, аспартат, CO₂ и формил-ТГФК; первый готовый нуклеотид — ИМФ, из него получаются АМФ и ГМФ. Распад идёт ИМФ → инозин → гипоксантин → ксантин → <b>мочевая кислота</b>; два последних шага катализирует <b>ксантиноксидаза</b>. У человека нет уриказы, поэтому мочевая кислота — конечный продукт, а растворяется она плохо: выше ~420 мкмоль/л (≈7 мг/дл) кристаллы урата натрия выпадают в суставах — это <b>подагра</b>. <b>Аллопуринол</b> (и фебуксостат) тормозит ксантиноксидазу и снижает образование мочевой кислоты; цель лечения — ниже 360 мкмоль/л. При синдроме <b>Леша — Найхана</b> (нет фермента ГГФРТ) пурины не возвращаются в нуклеотиды по пути спасения, ФРПФ накапливается и разгоняет синтез de novo — мочевой кислоты очень много, а у ребёнка тяжёлые неврологические нарушения и самоповреждение. Синтез пуринов и тимидина зависит от фолата — на этом основаны антиметаболиты: метотрексат блокирует ДГФР, 6-меркаптопурин встаёт на место пуринов.</p>
        <h3>Пиримидины</h3><p>Кольцо пиримидинов строится из карбамоилфосфата (цитозольная КФС II) и аспартата, а рибоза присоединяется в конце (через оротовую кислоту). Распадаются они до растворимых β-аланина, CO₂ и NH₃ — поэтому болезней накопления, как подагра, у пиримидинов нет. Наследственная оротацидурия — дефект синтеза УМФ.</p>
        <h3>Дезоксирибонуклеотиды</h3><p>Образуются из рибонуклеотидов рибонуклеотидредуктазой (её ингибитор — противоопухолевый препарат гидроксимочевина); тимидиловый нуклеотид — тимидилатсинтазой с метилен-ТГФК.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Молекулы — по химическим формулам; ДГФР — реальная структура PDB 1RX1, положение метотрексата и фолата условно.</li><li>Кристаллы урата в суставе — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('build'); st.fly = null;
  return self;
}
