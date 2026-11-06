import { Sparks, THREE, V3, __set_rnd, button, displaceGeo, flyStep, flyTarget, group, h, infoBox, makeControls, mulberry, rnd, seg, toggle } from '../core.js';
import { bioStage } from './kit.js';


// @scene mendel makeMendel | Наследование: законы Менделя | @cell
/* =========================================================
   КЛЕТКА · НАСЛЕДОВАНИЕ: горох Менделя — моногибридное (3 : 1) и дигибридное (9 : 3 : 3 : 1) скрещивание
   на решётке Пеннета, опыт «100 горошин»; группы крови AB0 (кодоминирование); наследование, сцепленное с полом
   (дальтонизм). Гаметы — итог мейоза (см. «Деление клетки»)
   ========================================================= */
function makeMendel() {
  __set_rnd(mulberry(7601));
  const scene = bioStage({ rim: 0xb0e080 });
  const DK = !matchMedia('(max-width:700px)').matches;
  const GX = { mono: 0, di: 30, abo: 60, sex: 90 };
  const VIEW = { mono: DK ? [V3(-1.7, -0.05, 0), V3(-1.7, 0.4, 11.0)] : [V3(0, -0.15, 0), V3(0, 0.3, 12.6)], di: DK ? [V3(30 - 1.6, -0.1, 0), V3(30 - 1.6, 0.4, 9.6)] : [V3(30, -0.2, 0), V3(30, 0.3, 11.5)], abo: DK ? [V3(60 - 1.6, 0.0, 0), V3(60 - 1.6, 0.45, 10.4)] : [V3(60, 0.0, 0), V3(60, 0.3, 8.6)], sex: DK ? [V3(90 - 1.6, 0.0, 0), V3(90 - 1.6, 0.45, 10.4)] : [V3(90, 0.0, 0), V3(90, 0.3, 8.6)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.mono[1]);
  const controls = makeControls(camera, VIEW.mono[0]); controls.minDistance = 3; controls.maxDistance = 30;
  const fx = new Sparks(600, 0.05); scene.add(fx.obj);
  const YEL = '#F2D23A', GRN = '#7FBF4A';
  const mat = (col, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.7), roughness: 0.4, clearcoat: 0.5, emissive: col, emissiveIntensity: o.e ?? 0.12, transparent: !!o.op, opacity: o.op ?? 1, depthWrite: !o.op });
  const smooth = new THREE.SphereGeometry(1, 32, 24), wrink = displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { const k = 1 + 0.09 * Math.sin(7 * v.x + 3 * v.y) * Math.cos(6 * v.z - 2 * v.y); v.multiplyScalar(k); });
  const seeds = [];
  const seed = (p, col, wr = false, r = 0.22) => { const m = new THREE.Mesh(wr ? wrink : smooth, mat(col)); m.position.copy(p); m.scale.set(r, r * 0.92, r); m.rotation.set(rnd() * 6, rnd() * 6, 0); scene.add(m); seeds.push(m); return m; };
  const tileM = new THREE.MeshBasicMaterial({ color: 0x23202c, transparent: true, opacity: 0.85 }), edgeM = new THREE.LineBasicMaterial({ color: 0x5a5470 });
  const tile = (p, s) => { const g = new THREE.PlaneGeometry(s * 0.96, s * 0.96); const m = new THREE.Mesh(g, tileM); m.position.copy(p).add(V3(0, 0, -0.3)); scene.add(m); const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeM); e.position.copy(m.position); scene.add(e); };
  const L = [];   // подписи: [текст, позиция, цвет, режим, (доп. условие)]
  const lab = (text, p, color, mode, cond, left) => L.push({ text, pos: p, color, left, show: () => st.labels && st.mode === mode && (!cond || cond()) });
  /* ---------- 1. моногибридное: P → F1 → F2 (решётка 2 × 2) ---------- */
  { const X = GX.mono;
    seed(V3(X - 1.3, 2.05, 0), YEL); seed(V3(X + 1.3, 2.05, 0), GRN); seed(V3(X, 1.0, 0), YEL);
    lab('P: AA (жёлтый)', V3(X - 1.3, 2.4, 0), YEL, 'mono'); lab('P: aa (зелёный)', V3(X + 1.3, 2.62, 0), GRN, 'mono'); lab('×', V3(X - 0.1, 2.1, 0), '#E8E0F0', 'mono');
    lab('F1: все Aa — жёлтые', V3(X + 0.3, 1.05, 0), YEL, 'mono');
    const S = 1.0, G = [['A', 'A'], ['A', 'a'], ['a', 'A'], ['a', 'a']];
    [['A', -0.5], ['a', 0.5]].forEach(([g, dx]) => { lab(g, V3(X + dx * S * 1.0 - 0.05, -0.05, 0), '#E8E0F0', 'mono'); lab(g, V3(X - 1.25 - 0.05, -0.55 - (dx + 0.5) * S, 0), '#E8E0F0', 'mono'); });
    G.forEach(([a, b], i) => { const c = V3(X + ((i % 2) - 0.5) * S, -0.55 - Math.floor(i / 2) * S, 0); tile(c, S); const gt = [a, b].sort().join(''); const dom = gt.includes('A'); seed(c.clone().add(V3(0, 0.08, 0)), dom ? YEL : GRN); lab(gt === 'Aa' ? 'Aa' : gt, c.clone().add(V3(-0.15, -0.38, 0.1)), dom ? YEL : GRN, 'mono'); });
    lab('F2: 3 жёлтых : 1 зелёный', V3(X - 0.95, -2.2, 0), '#E8E0F0', 'mono'); }
  /* ---------- 2. дигибридное: решётка 4 × 4 (цвет Y/y, форма R/r) ---------- */
  { const X = GX.di, S = 0.72, GAM = ['YR', 'Yr', 'yR', 'yr'];
    GAM.forEach((g, i) => { lab(g, V3(X + (i - 1.5) * S - 0.12, 1.75, 0), '#E8E0F0', 'di'); lab(g, V3(X - 2.0, 1.25 - i * S, 0), '#E8E0F0', 'di', null, true); });
    GAM.forEach((g1, r) => GAM.forEach((g2, c) => { const p = V3(X + (c - 1.5) * S, 1.25 - r * S, 0); tile(p, S); const Y = (g1 + g2).includes('Y'), R = (g1 + g2).includes('R'); seed(p, Y ? YEL : GRN, !R, 0.17); }));
    lab('F2: 9 : 3 : 3 : 1', V3(X - 0.5, -1.95, 0), '#E8E0F0', 'di');
    lab('P: YYRR × yyrr → F1: YyRr', V3(X - 1.55, 2.25, 0), YEL, 'di'); }
  /* ---------- 3. группы крови AB0 ---------- */
  const ABO = { A: '#E05A6A', B: '#5A8AE0', AB: '#B070D0', '0': '#E8E0D0' };
  const CROSS = [{ id: 'a0b0', p: ['A0', 'B0'], name: 'A (I^A i) × B (I^B i)' }, { id: 'aabb', p: ['AA', 'BB'], name: 'A (I^A I^A) × B (I^B I^B)' }, { id: 'ab00', p: ['AB', '00'], name: 'AB × 0' }, { id: 'a0a0', p: ['A0', 'A0'], name: 'A (I^A i) × A (I^A i)' }];
  const phen = (a, b) => { const s = new Set([a, b]); return s.has('A') && s.has('B') ? 'AB' : s.has('A') ? 'A' : s.has('B') ? 'B' : '0'; };
  const aboSeeds = [];
  { const X = GX.abo, S = 1.0; for (let i = 0; i < 4; i++) { const c = V3(X + ((i % 2) - 0.5) * S, -0.45 - Math.floor(i / 2) * S, 0); tile(c, S); const m = seed(c.clone().add(V3(0, 0.08, 0)), '#E8E0D0'); m.geometry = smooth; aboSeeds.push(m); }
    const pa = seed(V3(X - 1.3, 1.45, 0), '#E8E0D0'), pb = seed(V3(X + 1.3, 1.45, 0), '#E8E0D0'); aboSeeds.push(pa, pb);
    CROSS.forEach((cr) => { const on = () => st.abo === cr.id; const [m, f] = cr.p;
      lab('мать ' + (phen(m[0], m[1]) === '0' ? '0' : phen(m[0], m[1])) + ' (' + m + ')', V3(X - 1.3, 2.35, 0), ABO[phen(m[0], m[1])], 'abo', on, true); lab('отец ' + phen(f[0], f[1]) + ' (' + f + ')', V3(X + 1.3, 2.35, 0), ABO[phen(f[0], f[1])], 'abo', on);
      [0, 1].forEach((j) => { lab(m[j], V3(X - 1.25, -0.45 - j * S, 0), '#E8E0F0', 'abo', on); lab(f[j], V3(X + (j - 0.5) * S - 0.05, 0.05, 0), '#E8E0F0', 'abo', on); });
      for (let i = 0; i < 4; i++) { const a = m[Math.floor(i / 2)], b = f[i % 2], ph = phen(a, b); lab(ph, V3(X + ((i % 2) - 0.5) * S - 0.05, -0.83 - Math.floor(i / 2) * S, 0.1), ABO[ph], 'abo', on); } }); }
  /* ---------- 4. сцеплено с полом: дальтонизм (ген на X) ---------- */
  const sexSeeds = [];
  { const X = GX.sex, S = 1.0; for (let i = 0; i < 4; i++) { const c = V3(X + ((i % 2) - 0.5) * S, -0.45 - Math.floor(i / 2) * S, 0); tile(c, S); sexSeeds.push(seed(c.clone().add(V3(0, 0.08, 0)), '#7FD6FF')); }
    sexSeeds.push(seed(V3(X - 1.3, 1.95, 0), '#7FD6FF'), seed(V3(X + 1.3, 1.95, 0), '#7FD6FF'));
    ['X', 'Xᵈ'].forEach((g, j) => lab(g, V3(X - 1.3, -0.45 - j * S, 0), '#E8E0F0', 'sex'));
    [['X', 'Y'], ['Xᵈ', 'Y']].forEach(([g0, g1], k) => { const on = () => (st.dad === 'cb') === (k === 1); lab(g0, V3(X - 0.55, 0.05, 0), '#E8E0F0', 'sex', on); lab(g1, V3(X + 0.45, 0.05, 0), '#E8E0F0', 'sex', on);
      lab(k ? 'отец XᵈY — дальтоник' : 'отец XY — здоров', V3(X + 1.3, DK ? 2.35 : 1.45, 0), k ? '#F2A040' : '#7FD6FF', 'sex', on); });
    lab('мать XXᵈ — носительница', V3(X - 1.3, 2.35, 0), '#B8E0F0', 'sex', null, true);
    const KIDS = { ok: ['♀ XX', '♂ XY', '♀ XXᵈ — носит.', '♂ XᵈY — дальт.'], cb: ['♀ XXᵈ — носит.', '♂ XY', '♀ XᵈXᵈ — дальт.', '♂ XᵈY — дальт.'] };
    Object.entries(KIDS).forEach(([d, arr]) => arr.forEach((t, i) => lab(t, V3(X + ((i % 2) - 0.5) * S - 0.45, -0.83 - Math.floor(i / 2) * S, 0.1), /дальт/.test(t) ? '#F2A040' : /носит/.test(t) ? '#B8E0F0' : '#7FD6FF', 'sex', () => st.dad === d))); }
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'mono', abo: 'a0b0', dad: 'ok', trial: null, labels: true, rot: false, fly: null, msg: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = flyTarget(...VIEW[m]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function applyAbo() { const cr = CROSS.find((c) => c.id === st.abo), [m, f] = cr.p; for (let i = 0; i < 4; i++) aboSeeds[i].material.color.set(ABO[phen(m[Math.floor(i / 2)], f[i % 2])]).multiplyScalar(0.7), aboSeeds[i].material.emissive.set(ABO[phen(m[Math.floor(i / 2)], f[i % 2])]); aboSeeds[4].material.color.set(ABO[phen(m[0], m[1])]).multiplyScalar(0.7); aboSeeds[5].material.color.set(ABO[phen(f[0], f[1])]).multiplyScalar(0.7); aboSeeds[4].material.emissive.set(ABO[phen(m[0], m[1])]); aboSeeds[5].material.emissive.set(ABO[phen(f[0], f[1])]); }
  function applySex() { const cb = st.dad === 'cb'; sexSeeds[4].material.color.set('#B8E0F0').multiplyScalar(0.7); sexSeeds[4].material.emissive.set('#B8E0F0'); const col = cb ? ['#B8E0F0', '#7FD6FF', '#F2A040', '#F2A040'] : ['#7FD6FF', '#7FD6FF', '#B8E0F0', '#F2A040']; col.forEach((c, i) => { sexSeeds[i].material.color.set(c).multiplyScalar(0.7); sexSeeds[i].material.emissive.set(c); }); sexSeeds[5].material.color.set(cb ? '#F2A040' : '#7FD6FF').multiplyScalar(0.7); sexSeeds[5].material.emissive.set(cb ? '#F2A040' : '#7FD6FF'); sexSeeds[4].material.color.set('#B8E0F0').multiplyScalar(0.7); sexSeeds[4].material.emissive.set('#B8E0F0'); }
  const crop = []; { const g = new THREE.SphereGeometry(0.055, 10, 8); for (let i = 0; i < 100; i++) { const m = new THREE.Mesh(g, mat(YEL)); m.position.set(GX.mono + 1.55 + (i % 10) * 0.13, -0.15 - Math.floor(i / 10) * 0.13, 0); m.visible = false; scene.add(m); crop.push(m); } }
  function grow() { let y = 0; for (let i = 0; i < 100; i++) if (rnd() < 0.75) y++; st.trial = [y, 100 - y]; crop.forEach((m, i) => { m.visible = true; const c = i < y ? YEL : GRN; m.material = mat(c); }); for (let i = 0; i < 14; i++) fx.spawn(V3(GX.mono + (rnd() - 0.5) * 2, -1.1 + (rnd() - 0.5) * 1.6, 0.3), V3(0, 0.4, 0), new THREE.Color(rnd() < 0.75 ? YEL : GRN), 0.6, 0.2, 1.0); st.msg = `<b>Опыт: 100 горошин из F2.</b> Жёлтых — ${y}, зелёных — ${100 - y} (ожидается 75 : 25). Мендель вырастил 8023 горошины и получил 6022 : 2001 = 3,01 : 1. Законы наследования вероятностные — чем больше потомков, тем точнее соотношение.`; refs.setInfo(); }
  function update(dt) { st.t += dt; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); seeds.forEach((m, i) => { m.rotation.y += dt * 0.3 * (i % 2 ? 1 : -1); }); fx.update(dt); }
  /* ---------- тексты ---------- */
  const TXT = {
    mono: '<b>Один признак — цвет горошины.</b> Ген существует в вариантах — <b>аллелях</b>: A (жёлтый) <b>доминантный</b>, a (зелёный) <b>рецессивный</b>. У каждого растения две копии гена, в гамету (после мейоза) попадает одна. Гибриды F1 (Aa) все жёлтые, а во втором поколении зелёный цвет возвращается у четверти: <b>3 : 1</b>.',
    di: '<b>Два признака сразу</b> — цвет (Y/y) и форма (R/r — гладкая или морщинистая). Гены на разных хромосомах расходятся в мейозе <b>независимо</b>, поэтому гибрид YyRr даёт 4 сорта гамет поровну, а во втором поколении — <b>9 : 3 : 3 : 1</b>. Гены, лежащие рядом на одной хромосоме, наследуются сцепленно (если их не разделит кроссинговер).',
    abo: '<b>Группы крови AB0.</b> У гена три аллеля: I^A, I^B и i (группа 0). I^A и I^B <b>кодоминантны</b> — у носителя обоих группа AB, оба антигена на эритроцитах; i рецессивен. Поэтому у родителей A и B могут родиться дети с любой из четырёх групп, а у двух родителей A — ребёнок с группой 0.',
    sex: '<b>Наследование, сцепленное с полом.</b> Ген цветового зрения лежит на <b>X-хромосоме</b>. У женщин X две, и нормальный аллель обычно закрывает дефектный — она лишь <b>носительница</b>. У мужчин X одна (XY), поэтому дальтонизм у них в ≈ 10–15 раз чаще. Сын получает X только от матери.',
  };
  const labels = L;
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'mono', label: 'Один признак' }, { id: 'di', label: 'Два признака' }, { id: 'abo', label: 'Группы крови' }, { id: 'sex', label: 'Сцеплено с полом' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 400px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'mono') box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, button('Вырастить 100 горошин', grow, true)));
      else if (st.mode === 'abo') box.append(h('div', { class: 'glabel' }, 'Родители'), h('div', { class: 'gctl' }, seg(CROSS.map((c) => ({ id: c.id, label: c.name })), () => st.abo, (v) => { st.abo = v; applyAbo(); })));
      else if (st.mode === 'sex') box.append(h('div', { class: 'glabel' }, 'Отец'), h('div', { class: 'gctl' }, seg([{ id: 'ok', label: 'Здоров (XY)' }, { id: 'cb', label: 'Дальтоник (XᵈY)' }], () => st.dad, (v) => { st.dad = v; applySex(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const labT = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { labT });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, labT), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['mono', 'di', 'abo', 'sex'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.labT.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'mono') return st.trial ? [['Жёлтых', st.trial[0], ''], ['Зелёных', st.trial[1], ''], ['Ожидается', '75 : 25', '']] : [['Расщепление F2', '3 : 1', ''], ['По генотипу', '1 : 2 : 1', '']];
    if (st.mode === 'di') return [['Сочетаний', 16, ''], ['Расщепление', '9 : 3 : 3 : 1', '']];
    if (st.mode === 'abo') { const cr = CROSS.find((c) => c.id === st.abo), [m, f] = cr.p, s = new Set(); for (let i = 0; i < 4; i++) s.add(phen(m[Math.floor(i / 2)], f[i % 2])); return [['Групп у детей', s.size, 'из 4']]; }
    return [['Сыновей-дальтоников', '50', '%'], ['Дочерей-дальтоников', st.dad === 'cb' ? '50' : '0', '%']];
  }
  const self = {
    mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#B0E080',
    kicker: 'Клетка · наследование', title: 'Наследование: законы Менделя',
    lede: 'Почему у кареглазых родителей бывает голубоглазый ребёнок, а дальтонизм чаще у мужчин? Монах Грегор Мендель понял это на горохе ещё до открытия ДНК.',
    notes: `
      <div><h2>Законы Менделя (1865)</h2>
        <ul><li><b>Единообразие F1</b>: при скрещивании чистых линий все гибриды первого поколения одинаковы (проявляется доминантный признак).</li><li><b>Расщепление</b>: во втором поколении 3 : 1 по фенотипу и 1 : 2 : 1 по генотипу — потому что аллели расходятся в разные гаметы (мейоз, анафаза I).</li><li><b>Независимое наследование</b> генов на разных хромосомах — 9 : 3 : 3 : 1; исключение — сцепленные гены.</li></ul>
        <h3>У человека</h3><p>Многие признаки (рост, цвет кожи и глаз) зависят от многих генов и среды, поэтому не делятся строго 3 : 1. Менделевски наследуются, например, муковисцидоз и фенилкетонурия (рецессивные), болезнь Гентингтона (доминантная), гемофилия и дальтонизм (сцепленные с X).</p>
        <h3>Обозначения</h3><p>Генотип — набор аллелей (AA, Aa, aa), фенотип — проявление. Гомозигота — два одинаковых аллеля, гетерозигота — разные. Решётка Пеннета перебирает все встречи гамет и даёт вероятности.</p></div>
      <div><h2>Условности</h2><ul><li>Горошины, «капли» групп крови и шары «детей» — символы, а не модели клеток; размеры условны.</li><li>Все гаметы считаются равновероятными, отбор и мутации не учитываются; опыт «100 горошин» — случайная выборка, каждый раз своя.</li><li>Буквенные обозначения аллелей упрощены (I^A, I^B, i записаны как A, B, 0).</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  applyAbo(); applySex(); setMode('mono'); st.fly = null;
  return self;
}
export { makeMendel };
