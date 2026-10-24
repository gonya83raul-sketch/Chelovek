// @scene protein makeProtein | Белки: аминокислоты и укладка | Белки и аминокислоты
/* =========================================================
   БИОХИМИЯ · БЕЛКИ: 20 аминокислот, пептидная связь, 4 уровня структуры (гемоглобин 4HHB),
   денатурация и шаперонин GroEL/GroES (1AON)
   ========================================================= */
const PR_AA = [
  ['gly', 'G', 'np', 0], ['ala', 'A', 'np', 0], ['val', 'V', 'np', 1], ['leu', 'L', 'np', 1], ['ile', 'I', 'np', 1], ['pro', 'P', 'np', 0], ['phe', 'F', 'np', 1], ['trp', 'W', 'np', 1], ['met', 'M', 'np', 1],
  ['ser', 'S', 'pol', 0], ['thr', 'T', 'pol', 1], ['cys', 'C', 'pol', 0], ['tyr', 'Y', 'pol', 0], ['asn', 'N', 'pol', 0], ['gln', 'Q', 'pol', 0],
  ['asp', 'D', 'acid', 0], ['glu', 'E', 'acid', 0], ['lys', 'K', 'base', 1], ['arg', 'R', 'base', 0], ['his', 'H', 'base', 2],
];
const PR_GR = { np: ['Неполярные (гидрофобные)', '#F2C14E'], pol: ['Полярные незаряженные', '#7FE0A0'], acid: ['Кислые (−)', '#FF6A6A'], base: ['Основные (+)', '#7FA8FF'] };
const PR_LV = [
  { id: 1, name: 'Первичная', text: '<b>Первичная структура</b> — последовательность аминокислот, соединённых <b>пептидными связями</b> (–CO–NH–). Её записывает ген. От неё зависит всё остальное: замена одной аминокислоты в β-цепи гемоглобина (глутамат → валин в 6-й позиции) вызывает серповидноклеточную анемию. В β-цепи гемоглобина 146 аминокислот — они бегут вдоль ленты от синего N-конца к красному C-концу.' },
  { id: 2, name: 'Вторичная', text: '<b>Вторичная структура</b> — локальная укладка цепи, которую держат <b>водородные связи</b> между C=O и N–H остова. <b>α-Спираль</b>: 3,6 остатка на виток, каждая C=O связана с N–H через 4 остатка (розовые). <b>β-Складчатый слой</b>: вытянутые участки лежат рядом (жёлтые стрелки — показаны на других белках). В гемоглобине — почти одни спирали.' },
  { id: 3, name: 'Третичная', text: '<b>Третичная структура</b> — пространственная форма всей цепи. Гидрофобные остатки прячутся внутрь, полярные смотрят в воду; форму держат гидрофобные взаимодействия, водородные, ионные связи и дисульфидные мостики. Внутри «кармана» — простетическая группа <b>гем</b> с железом (шарики). Одна цепь гемоглобина похожа на миоглобин мышц.' },
  { id: 4, name: 'Четвертичная', text: '<b>Четвертичная структура</b> — объединение нескольких цепей (протомеров) в один белок. <b>Гемоглобин</b> = 2 α-цепи (голубые) + 2 β-цепи (розовые) + 4 гема (PDB 4HHB). Субъединицы влияют друг на друга: присоединив O₂ к одному гему, белок легче берёт следующий (кооперативность).' },
];
function makeProtein() {
  rnd = mulberry(1701);
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { aa: flyTarget(V3(0, -2.0, 0), V3(0, 0.4, 19)), lv: flyTarget(V3(40, -1.2, 0), V3(40.8, 0.8, 14.5)), fold: flyTarget(V3(80, -1.4, 0), V3(81.4, 1.6, 19)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.aa.pos);
  const controls = makeControls(camera, VIEW.aa.target); controls.minDistance = 2; controls.maxDistance = 45;
  const fx = new Sparks(1200, 0.08); scene.add(fx.obj);
  /* ---------- 1. аминокислоты ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const AAM = PR_AA.map(([id, l, gr, ess], k) => { const col = k % 10, row = Math.floor(k / 10); const m = molMesh(MOL(id), { scale: 0.17, hideH: true }); const g = new THREE.Group(); g.add(m); g.position.set(-7.6 + col * 1.74, -0.15 - row * 1.85, 0); G1.add(g); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(PR_GR[gr][1]).multiplyScalar(0.7), transparent: true, opacity: 0.25 })); ring.position.y = -0.1; g.add(ring); const pk = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = id; g.add(pk); return { id, l, gr, ess, g, m, ring }; });
  /* ---------- 2. уровни структуры ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0.4, 0); scene.add(G2);
  const HB = PDB('hb'); const hsc = 0.075;
  const rainbow = (i, n) => new THREE.Color().setHSL(0.66 * (1 - i / n), 0.75, 0.58).getStyle();
  const chainM = HB.chains.map((c, k) => { const m = cartoon(c, { scale: hsc, color: k === 1 ? rainbow : k % 2 ? '#FF8AB0' : '#7FD6FF', k: 0.6 }); G2.add(m); return m; });
  const hemes = HB.ligm.map((l) => { const m = molMesh(l, { scale: hsc }); G2.add(m); return m; });
  // «нить» первичной структуры: трубка через CA β-цепи
  const cB = HB.chains[1]; const caB = []; for (let i = 0; i < cB.ca.length; i += 3) caB.push(V3(cB.ca[i], cB.ca[i + 1], cB.ca[i + 2]).multiplyScalar(hsc));
  const strandPts = caB.map((p, i) => V3(-6 + i * 0.085, -1.0 + 0.2 * Math.sin(i * 0.9), 0.4 * Math.cos(i * 0.7)));
  const beadsGeo = new THREE.SphereGeometry(0.06, 10, 8); const beads = new THREE.InstancedMesh(beadsGeo, new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6 }), caB.length); G2.add(beads);
  for (let i = 0; i < caB.length; i++) beads.setColorAt(i, new THREE.Color(rainbow(i, caB.length)).multiplyScalar(0.7));
  const hbonds = new THREE.Group(); G2.add(hbonds);
  { const c = HB.chains[1]; for (let i = 0; i + 4 < c.seq.length; i++) if (c.ss[i] === 'H' && c.ss[i + 4] === 'H') { const a = caB[i], b = caB[i + 4]; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 5), new THREE.MeshBasicMaterial({ color: 0xff8ab0, transparent: true, opacity: 0.7 })); m.position.copy(a).lerp(b, 0.5); const d = b.clone().sub(a); m.scale.y = d.length(); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); hbonds.add(m); } }
  const pep = new THREE.Group(); pep.position.set(-3.6, 2.2, 0); G2.add(pep);
  const aa1 = molMesh(MOL('ala'), { scale: 0.18, hideH: true }), aa2 = molMesh(MOL('gly'), { scale: 0.18, hideH: true }); pep.add(aa1, aa2); const wat = molMesh(MOL('h2o'), { scale: 0.22 }); pep.add(wat);
  /* ---------- 3. укладка и шаперон ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const GR = new THREE.Group(); GR.position.set(2.4, 0.3, 0); G3.add(GR);
  const gro = proteinMesh('groel', { scale: 0.021, colorBy: (c) => (c.id >= 'O' ? '#F2C14E' : c.id >= 'H' ? '#7FD6FF' : '#9FB4FF') });
  { const ax = pcaAxis(caPoints('groel', 0.021)); gro.quaternion.setFromUnitVectors(ax.v, V3(0, 1, 0)); }
  GR.add(gro);
  // сворачивающийся белок — лизоцим: натив ↔ клубок
  const L = PDB('lyz').chains[0]; const N = L.seq.length;
  const coil = { ...L, ss: 'C'.repeat(N), ca: new Float32Array(N * 3), od: L.od };
  { let p = V3(0, 0, 0); for (let i = 0; i < N; i++) { const d = randUnit(); d.y = Math.abs(d.y) * 0.3; p = p.add(d.multiplyScalar(3.8)); if (p.length() > 26) p.multiplyScalar(0.8); coil.ca[i * 3] = p.x; coil.ca[i * 3 + 1] = p.y * 0.6; coil.ca[i * 3 + 2] = p.z; } }
  const nat = cartoon(L, { scale: 0.045, color: rainbow }).geometry, unf = cartoon(coil, { scale: 0.045, color: rainbow }).geometry;
  const fold = new THREE.Mesh(nat.clone(), new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.5, envMapIntensity: 0.45, side: THREE.DoubleSide })); G3.add(fold);
  const pN = nat.attributes.position.array, pU = unf.attributes.position.array;
  const heat = new THREE.PointLight(0xff6a3a, 0, 8, 1.6); heat.position.set(-3, 1, 2); G3.add(heat);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'aa', labels: true, rot: true, fly: null, sel: null, lv: 4, msg: null, cyc: 0, fmode: 'chap', u: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['aa', 'lv', 'fold'][k] === m; }); st.fly = VIEW[m]; st.sel = null; st.msg = null; st.cyc = 0; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setLv(v) { st.lv = v; refs.lvSeg && refs.lvSeg.sync(); st.cyc = 0; refs.setInfo(); }
  pickOn(() => self, camera, () => AAM.map((a) => a.g.children[a.g.children.length - 1]), (id) => { st.sel = id; refs.setInfo(); });
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'aa') AAM.forEach((a) => { a.m.rotation.y += dt * (st.sel === a.id ? 1 : 0.35); const s = st.sel === a.id ? 1.25 : 1; a.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); a.ring.material.opacity = st.sel === a.id ? 0.8 : 0.22; });
    if (st.mode === 'lv') {
      const lv = st.lv;
      chainM.forEach((m, k) => { m.visible = lv === 4 || (lv >= 2 && k === 1); }); hemes.forEach((m, k) => { m.visible = lv === 4 || (lv === 3 && k === 1); });
      beads.visible = lv === 1; hbonds.visible = lv === 2; pep.visible = lv === 1;
      if (lv === 1) { const u = ease(Math.min(1, st.cyc / 3)); const dm = new THREE.Object3D(); caB.forEach((p, i) => { dm.position.copy(strandPts[i]).lerp(p.clone().add(V3(0, 0, 0)), 0); dm.scale.setScalar(1); dm.updateMatrix(); beads.setMatrixAt(i, dm.matrix); }); beads.instanceMatrix.needsUpdate = true; const c = st.cyc % 5; aa1.position.set(-0.9 + Math.min(1, c / 2) * 0.45, 0, 0); aa2.position.set(0.9 - Math.min(1, c / 2) * 0.45, 0, 0); wat.visible = c > 2 && c < 4.5; wat.position.set(0, 0.4 + (c - 2) * 0.6, 0.3); aa1.rotation.y = aa2.rotation.y = 0.3; }
      if (st.rot && lv > 1) G2.rotation.y += dt * 0.2; else if (lv === 1) G2.rotation.y = 0;
    }
    if (st.mode === 'fold') {
      if (st.rot) GR.rotation.y += dt * 0.1;
      let u = 0, pos = V3(-2.4, 0.4, 0);
      if (st.fmode === 'chap') {
        const c = st.cyc % 14; // клубок подходит (0–3), внутри бочки (3–9, сворачивается), выход (9–12)
        const inside = GR.position.clone().add(V3(0, -0.6, 0));
        if (c < 3) { u = 1; pos = V3(-2.6, 0.6, 0).lerp(inside, ease(c / 3)); } else if (c < 9) { u = 1 - ease((c - 3.5) / 5); pos = inside; } else { u = 0; pos = inside.clone().lerp(V3(-2.6, -0.8, 0), ease((c - 9) / 3)); }
        st.fphase = c < 3 ? 'развёрнутая цепь' : c < 9 ? 'укладка внутри шаперонина' : 'готовый белок';
      } else { const c = st.cyc % 12; u = c < 1 ? 0 : c < 4 ? ease((c - 1) / 3) : c < 8 ? 1 : st.fmode === 'heat' ? 1 - ease((c - 8) / 3) : 1; heat.intensity = c > 1 && c < 8 ? 12 : 0; st.fphase = c < 1 ? 'нативный белок' : c < 4 ? 'нагрев: денатурация' : c < 8 ? 'клубок' : 'ренатурация'; pos = V3(-2.4, 0.4, 0); }
      const P = fold.geometry.attributes.position.array; for (let i = 0; i < P.length; i++) P[i] = pN[i] + (pU[i] - pN[i]) * u; fold.geometry.attributes.position.needsUpdate = true; if (((t * 30) | 0) % 2 === 0) fold.geometry.computeVertexNormals();
      fold.position.copy(pos); fold.rotation.y += dt * 0.4;
      GR.visible = st.fmode === 'chap';
    }
    fx.update(dt);
  }
  const TXT = {
    aa: '<b>20 аминокислот</b> — алфавит белков. У всех одинаковая часть (аминогруппа, карбоксил и атом водорода у α-углерода) и разный <b>радикал</b>. По свойствам радикала их делят на группы (цвет кольца). Все белковые аминокислоты, кроме глицина, — <b>L-изомеры</b>. Восемь <b>незаменимых</b> (валин, лейцин, изолейцин, треонин, метионин, лизин, фенилаланин, триптофан) человек не синтезирует — они должны быть в пище. Нажмите на молекулу.',
    fold: '<b>Укладка и денатурация.</b> Форму белка задаёт его последовательность, но в тесной клетке длинной цепи помогают <b>шапероны</b>. Справа — реальная структура шаперонина <b>GroEL/GroES</b> (PDB 1AON): два кольца по 7 субъединиц (голубые) и «крышка» GroES (жёлтая) — бочка, внутри которой белок спокойно сворачивается, используя энергию АТФ. Слева — белок (лизоцим): режим «Нагрев» показывает <b>денатурацию</b> — разрушение вторичной и третичной структуры без разрыва пептидных связей; при мягком воздействии она обратима (ренатурация), при сильном — нет (сваренный белок яйца). Денатурируют нагрев, кислоты и щёлочи, соли тяжёлых металлов, спирт, мочевина.',
  };
  const labels = [
    ...AAM.map((a) => ({ text: `${MOL(a.id).name} · ${a.l}${a.ess === 1 ? ' ★' : a.ess === 2 ? ' ☆' : ''}`, pos: a.g.position.clone().add(V3(-0.7, -0.92, 0)), color: PR_GR[a.gr][1], show: () => st.labels && st.mode === 'aa' })),
    { text: 'N-конец', pos: V3(40 - 6.2, -0.4, 0), color: '#5B8CFF', show: () => st.labels && st.mode === 'lv' && st.lv === 1 },
    { text: 'C-конец', pos: V3(40 + 6.2, -0.4, 0), color: '#FF6A6A', show: () => st.labels && st.mode === 'lv' && st.lv === 1 },
    { text: 'пептидная связь + H₂O', pos: V3(40 - 3.8, 3.0, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'lv' && st.lv === 1 },
    { text: 'водородные связи α-спирали', pos: V3(41.3, 2.6, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'lv' && st.lv === 2 },
    { text: 'гем', pos: V3(41.5, 0.8, 1.2), color: '#E0773A', show: () => st.labels && st.mode === 'lv' && st.lv >= 3 },
    { text: 'α-цепи', pos: V3(38.2, 2.9, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'lv' && st.lv === 4 },
    { text: 'β-цепи', pos: V3(42.2, -1.6, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'lv' && st.lv === 4 },
    { text: 'шаперонин GroEL/GroES', pos: V3(80 + 4.2, 2.6, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'fold' && st.fmode === 'chap' },
    { text: 'белок (лизоцим)', pos: V3(80 - 3.6, 2.0, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'fold' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => {
      if (st.mode === 'aa') { const a = PR_AA.find((x) => x[0] === st.sel); ib.info.innerHTML = a ? `<b>${MOL(a[0]).name}</b> (${a[1]}) — ${PR_GR[a[2]][0].toLowerCase()}${a[3] === 1 ? ', <b>незаменимая</b>' : a[3] === 2 ? ', незаменима для детей' : ''}. ${AA_NOTE[a[0]] || ''}` : TXT.aa; return; }
      if (st.mode === 'lv') { ib.info.innerHTML = PR_LV[st.lv - 1].text; return; }
      ib.info.innerHTML = st.msg || TXT.fold;
    };
    refs.modeSeg = seg([{ id: 'aa', label: 'Аминокислоты' }, { id: 'lv', label: 'Уровни структуры' }, { id: 'fold', label: 'Укладка и шапероны' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 380px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'lv') { refs.lvSeg = seg(PR_LV.map((l) => ({ id: l.id, label: l.name })), () => st.lv, (v) => setLv(v)); box.append(h('div', { class: 'glabel' }, 'Уровень', h('kbd', {}, '← →')), h('div', { class: 'gctl' }, refs.lvSeg)); }
      else if (st.mode === 'fold') box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, seg([{ id: 'chap', label: 'Шаперонин' }, { id: 'heat', label: 'Нагрев и ренатурация' }, { id: 'boil', label: 'Кипячение (необратимо)' }], () => st.fmode, (v) => { st.fmode = v; st.cyc = 0; })));
      else box.append(h('div', { class: 'glabel' }, 'Группы'), h('div', { class: 'gctl' }, ...Object.values(PR_GR).map(([n, c]) => h('span', { class: 'glabel', style: `color:${c};margin-right:10px` }, '● ' + n)), h('span', { class: 'glabel' }, '★ незаменимая')));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['aa', 'lv', 'fold'][n - 1]); return true; }
    if (st.mode === 'lv' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { setLv(clamp(st.lv + (e.key === 'ArrowRight' ? 1 : -1), 1, 4)); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'aa' ? [['Аминокислот', '20', ''], ['Незаменимых', '8', '']] : st.mode === 'lv' ? [['Гемоглобин', '574', 'аминокислоты'], ['Масса', '64,5', 'кДа']] : [['Состояние', st.fphase || '', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#7FD6FF',
    kicker: 'Биохимия · белки', title: 'Белки: от аминокислоты до формы',
    lede: 'Цепочка из двадцати видов «бусин» сама сворачивается в точную трёхмерную машину. Здесь — аминокислоты, четыре уровня структуры гемоглобина и шаперон, который помогает белкам укладываться.',
    notes: `
      <div><h2>Белки</h2>
        <p>Белки — полимеры из L-α-аминокислот, связанных пептидными связями. Функции: ферменты, транспорт (гемоглобин, альбумин), защита (антитела), движение (актин, миозин), структура (коллаген, кератин), регуляция (гормоны-белки), рецепторы.</p>
        <h3>Свойства</h3><p>Белки — амфотерные полиэлектролиты; в изоэлектрической точке заряд равен нулю и растворимость минимальна. Их осаждают высаливанием (обратимо) и солями тяжёлых металлов (необратимо); разделяют электрофорезом и хроматографией.</p>
        <h3>Болезни укладки</h3><p>Неправильно свёрнутые белки слипаются в амилоид: болезни Альцгеймера, Паркинсона, прионные болезни (Крейтцфельдта — Якоба).</p></div>
      <div><h2>Модели</h2><ul><li>Гемоглобин — PDB 4HHB, шаперонин — 1AON, лизоцим — 1AKI.</li><li>Развёрнутая цепь — случайный клубок с теми же остатками; переход между клубком и нативной формой — плавная интерполяция, а не реальный путь укладки.</li><li>Аминокислоты — по формулам, без атомов водорода.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>←</code> <code>→</code> уровень структуры</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('aa'); st.fly = null;
  return self;
}
const AA_NOTE = {
  gly: 'Самая маленькая: радикал — один атом водорода, поэтому не имеет оптических изомеров. Каждая третья аминокислота коллагена — глицин. Тормозной медиатор спинного мозга.',
  ala: 'Простой метильный радикал. Аланин из мышц — главный переносчик азота и углерода в печень (глюкозо-аланиновый цикл); АЛТ — фермент печени в анализах.',
  val: 'Разветвлённая цепь (BCAA). Замена глутамата на валин в β-цепи гемоглобина — причина серповидноклеточной анемии.',
  leu: 'Разветвлённая цепь, чисто кетогенная. Сигнал для синтеза белка в мышцах (через mTOR).',
  ile: 'Разветвлённая цепь; два хиральных центра.',
  pro: 'Иминокислота: радикал замкнут на аминогруппу, создаёт изгибы цепи; ломает α-спирали. Гидроксипролин коллагена образуется с витамином C.',
  phe: 'Ароматическая. При фенилкетонурии (дефект фенилаланингидроксилазы) накапливается и повреждает мозг — новорождённых проверяют, лечат диетой.',
  trp: 'Самая крупная, индольное кольцо. Предшественник серотонина, мелатонина и (частично) витамина PP.',
  met: 'Содержит серу; стартовая аминокислота каждого белка (кодон AUG). Её производное S-аденозилметионин — главный донор метильных групп.',
  ser: 'Гидроксильная группа — место фосфорилирования и активный центр сериновых протеаз (трипсин, тромбин).',
  thr: 'Гидроксильная группа, ещё одна мишень протеинкиназ.',
  cys: 'SH-группа; две цистеиновые SH образуют дисульфидный мостик, скрепляющий белок (кератин волос, инсулин).',
  tyr: 'Фенольное кольцо. Из тирозина делаются дофамин, норадреналин, адреналин, гормоны щитовидной железы и пигмент меланин.',
  asn: 'Амид аспартата; к нему пришиваются углеводные цепи гликопротеинов.',
  gln: 'Амид глутамата; самая распространённая аминокислота крови, безопасный транспорт аммиака.',
  asp: 'Кислый радикал (−). Отдаёт азот в цикл мочевины; АСТ — фермент сердца и печени.',
  glu: 'Кислый радикал (−). Главный возбуждающий медиатор мозга; центральный узел обмена аминного азота.',
  lys: 'Основной радикал (+). Незаменимая; в злаках её мало.',
  arg: 'Основной гуанидиновый радикал. Источник оксида азота NO (расширяет сосуды) и мочевины.',
  his: 'Имидазольное кольцо с pKa около 7 — идеальный донор и акцептор протона в активных центрах ферментов и буфер гемоглобина. Из него — гистамин.',
};
