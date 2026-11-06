// @scene sleep makeSleep | Сон и биологические часы | @brain Устройство
/* =========================================================
   МОЗГ · СОН И БИОРИТМЫ: циркадные часы (свет → сетчатка → супрахиазматическое ядро → эпифиз → мелатонин),
   суточные кривые мелатонина, кортизола и температуры; стадии сна (N1–N3, REM) по гипнограмме,
   ЭЭГ-волны, быстрые движения глаз, атония мышц, глимфатическая очистка в глубоком сне
   ========================================================= */
function makeSleep() {
  rnd = mulberry(1501);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const DK = !matchMedia('(max-width:700px)').matches;
  const VIEW = DK ? [V3(-1.0, -0.35, 0), V3(0.3, 0.2, 8.8)] : [V3(0, -0.55, 0), V3(0.6, 0.0, 6.6)];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW[1]);
  const controls = makeControls(camera, VIEW[0]); controls.minDistance = 2; controls.maxDistance = 20;
  const fx = new Sparks(900, 0.04); scene.add(fx.obj);
  const mat = (col, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.55), roughness: 0.45, clearcoat: 0.3, emissive: col, emissiveIntensity: o.e ?? 0.12, transparent: !!o.op, opacity: o.op ?? 1, depthWrite: !o.op, side: o.side ?? THREE.FrontSide });
  /* ---------- голова в профиль (смотрит вправо, +x), мозг, глаз, пути ---------- */
  const head = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { v.set(v.x * 1.05, v.y * 1.2, v.z * 0.9); if (v.x > 0.6 && v.y < -0.1) v.x += 0.12 * (1 + v.y); }), new THREE.MeshPhysicalMaterial({ color: 0xe2c0b0, transparent: true, opacity: 0.06, depthWrite: false, roughness: 0.6 }));
  scene.add(head); const headGl = new THREE.Mesh(head.geometry, glassMat(0xbfd8ff, { rim: 0.5, base: 0.01, keep: true })); scene.add(headGl);
  const brainM = mat('#C8B0E0', { k: 0.5, e: 0.2, op: 0.55 }); const brain = new THREE.Mesh(ell3(0.82, 0.62, 0.68, V3(-0.05, 0.32, 0)), brainM); scene.add(brain);
  const EYE = V3(0.86, 0.02, 0.32), SCN = V3(0.18, -0.2, 0.02), PIN = V3(-0.32, 0.12, 0), SCG = V3(0.02, -1.15, -0.1);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), mat('#F0F0F4', { k: 0.85, e: 0.08 })); eye.position.copy(EYE); scene.add(eye);
  const iris = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), mat('#4A8AC0', { k: 0.9, e: 0.25 })); iris.rotation.y = Math.PI / 2; eye.add(iris); iris.position.set(0.128, 0, 0);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat('#D8B0A0', { k: 0.6, e: 0.05 })); lid.position.copy(EYE); lid.rotation.z = -Math.PI / 2; scene.add(lid);
  const node = (p, col, r = 0.07) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat(col, { k: 0.8, e: 0.5 })); m.position.copy(p); scene.add(m); return m; };
  const scn = node(SCN, '#FFD070', 0.07), pin = node(PIN, '#9FD8E8', 0.065);
  const tube = (pts, col, r = 0.018, op = 0.85) => { const c = new THREE.CatmullRomCurve3(pts); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 60, r, 8), mat(col, { k: 0.8, e: 0.35, op })); scene.add(m); return { c, m }; };
  const retTract = tube([EYE.clone().add(V3(-0.1, 0, -0.05)), V3(0.55, -0.12, 0.15), V3(0.32, -0.2, 0.06), SCN], '#FFD070');
  const sympPath = tube([SCN, V3(0.05, -0.55, -0.05), V3(0.0, -0.95, -0.12), SCG, V3(-0.25, -0.8, -0.15), V3(-0.38, -0.3, -0.05), PIN], '#9FD8E8', 0.012, 0.6);
  const vessel = tube([V3(-0.9, -1.5, -0.2), V3(-0.55, -0.4, -0.1), PIN.clone().add(V3(-0.05, -0.05, 0)), V3(-0.2, 0.6, 0.0), V3(0.4, 0.9, 0.1)], '#D8485A', 0.025, 0.45);
  /* солнце и луна на дуге вокруг головы */
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffe08a })); scene.add(sun);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), new THREE.MeshBasicMaterial({ color: 0xc8d8ff })); scene.add(moon);
  const ray = tube([V3(2.2, 0.6, 0.3), EYE.clone().add(V3(0.12, 0, 0))], '#FFE08A', 0.012, 0.0); ray.m.material.transparent = true;
  /* ---------- гипнограмма: стадии ночи (минуты) ---------- */
  const NIGHT = [['W', 10], ['N1', 5], ['N2', 20], ['N3', 40], ['N2', 10], ['REM', 10], ['N2', 25], ['N3', 30], ['N2', 15], ['REM', 20], ['N2', 40], ['N3', 10], ['N2', 15], ['REM', 30], ['N2', 45], ['REM', 35], ['N1', 5], ['W', 5], ['N2', 30], ['REM', 30], ['N2', 20], ['W', 30]];
  const TOT = NIGHT.reduce((a, [, m]) => a + m, 0), SC = { W: '#F2D27A', REM: '#FF6A8A', N1: '#9FD8E8', N2: '#7FA8FF', N3: '#9F7BFF' }, DEP = { W: 0, REM: 0.3, N1: 0.5, N2: 0.75, N3: 1 };
  const stageAt = (min) => { let a = 0; for (const [s, m] of NIGHT) { if (min < a + m) return s; a += m; } return 'W'; };
  const cycleAt = (min) => { let n = 0, a = 0, prevR = false; for (const [s, m] of NIGHT) { if (min < a) break; if (s === 'REM' && !prevR) n++; prevR = s === 'REM'; a += m; } return Math.min(5, n + 1); };
  /* ---------- суточные кривые (h 0–24) ---------- */
  const mel = (h, scr) => { const s0 = scr ? 23 : 21, L = scr ? 9.5 : 10.5, x = ((h + 24 - s0) % 24); return (x < L ? Math.sin(Math.PI * x / L) ** 1.5 : 0) * (scr ? 0.8 : 1); };   /* экран вечером: подъём мелатонина позже и ниже */
  const cort = (h) => { const x = ((h + 24 - 7.5) % 24); return 0.15 + 0.85 * Math.exp(-x / 4) + (x > 19 ? 0.85 * ((x - 19) / 5) ** 2 : 0); };
  const temp = (h) => 0.5 + 0.42 * Math.cos(Math.PI * 2 * (h - 17) / 24);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'clock', h: 20, min: 0, auto: true, screen: false, labels: true, rot: false, fly: null, msg: null, flow: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = flyTarget(...VIEW); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const C = new THREE.Color();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    let day, eyeOpen, glow, eyeMove = 0, stg = 'W';
    if (st.mode === 'clock') { if (st.auto) st.h = (st.h + dt * 1.0) % 24; const h = st.h; day = Math.max(0, Math.sin(Math.PI * (h - 6) / 12)); eyeOpen = h > 7 && h < 23 ? 1 : 0; glow = 0.15 + 0.2 * day;
      const a = Math.PI * (h - 6) / 12; sun.position.set(Math.cos(a) * -2.4 + 0.4, Math.sin(a) * 2.0, -0.6); moon.position.set(-sun.position.x + 0.8, -sun.position.y, -0.6); sun.visible = sun.position.y > -0.4; moon.visible = moon.position.y > -0.4;
      ray.m.material.opacity = st.screen && (h > 20 || h < 1) ? 0.6 : 0.85 * day; ray.m.material.emissive.set(st.screen && (h > 20 || h < 1) && day < 0.1 ? '#9FC8FF' : '#FFE08A');
      const m = mel(h, st.screen); st.mel = m; pin.material.emissiveIntensity = 0.3 + 1.6 * m; scn.material.emissiveIntensity = 0.4 + 1.2 * Math.max(day, ray.m.material.opacity);
      if (m > 0.25 && rnd() < dt * 14 * m) fx.spawn(PIN.clone(), V3(-0.15 + rnd() * 0.3, 0.2 + rnd() * 0.3, 0.1), C.set('#9FD8E8'), 0.6, 0.05, 1.4);
      if (ray.m.material.opacity > 0.3 && rnd() < dt * 3) st.flow = 0.001; }
    else { if (st.auto) st.min = (st.min + dt * 12) % TOT; stg = stageAt(st.min); st.stg = stg; day = 0; eyeOpen = stg === 'W' ? 1 : 0; glow = 0.1 + 0.35 * (stg === 'REM' || stg === 'W' ? 1 : 1 - DEP[stg]); eyeMove = stg === 'REM' ? 1 : 0;
      sun.visible = false; moon.visible = true; moon.position.set(-1.6, 1.7, -0.6); ray.m.material.opacity = 0; pin.material.emissiveIntensity = 1.2; scn.material.emissiveIntensity = 0.4;
      if (stg === 'N3' && rnd() < dt * 30) { const p = V3(-0.7 + rnd() * 1.4, 0.32 + (rnd() - 0.5) * 1.0, (rnd() - 0.5) * 1.0); if (p.clone().sub(V3(-0.05, 0.32, 0)).divide(V3(0.82, 0.62, 0.68)).length() < 1) fx.spawn(p, V3(0, -0.25, 0), C.set('#7FD6FF'), 0.45, 0.05, 1.2); } }
    brainM.emissive.set(st.mode === 'stages' ? SC[stg] : '#C8B0E0'); brainM.emissiveIntensity = glow + (st.mode === 'stages' ? 0.15 * Math.sin(t * (stg === 'N3' ? 2 : 9)) : 0);
    lid.scale.y = 1; lid.rotation.x = 0; lid.visible = !eyeOpen; iris.rotation.x = eyeMove ? Math.sin(t * 7) * 0.5 : 0; iris.position.z = eyeMove ? Math.sin(t * 7) * 0.05 : 0; if (eyeMove && lid.visible) lid.position.z = EYE.z + Math.sin(t * 7) * 0.012;
    if (st.flow > 0) { st.flow += dt * 0.9; if (st.flow < 1) fx.spawn(retTract.c.getPointAt(Math.min(1, st.flow)), V3(0, 0, 0), C.set('#FFE08A'), 0.35, 0, 0.3); else st.flow = 0; }
    fx.update(dt);
  }
  function drawScope(ctx, w, hh) {
    scopeShow(true);
    if (st.mode === 'clock') {
      const A = plotAxes(ctx, w, hh, { title: 'мелатонин · кортизол · температура', xl: '0 — 24 ч' });
      ctx.fillStyle = 'rgba(80,100,160,.18)'; ctx.fillRect(A.X(0), 14, A.X(6 / 24) - A.X(0), hh - 30); ctx.fillRect(A.X(21 / 24), 14, A.X(1) - A.X(21 / 24), hh - 30);
      plotLine(ctx, A, (u) => 0.05 + 0.9 * mel(u * 24, st.screen), '#9FD8E8'); plotLine(ctx, A, (u) => 0.05 + 0.55 * cort(u * 24) / 1.0, '#F2A040', { lw: 1.5 }); plotLine(ctx, A, (u) => 0.1 + 0.5 * temp(u * 24), '#FF7A8A', { lw: 1.2, dash: [3, 3] });
      const x = A.X(st.h / 24); ctx.strokeStyle = '#EFEAE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, hh - 16); ctx.stroke(); return;
    }
    const A = plotAxes(ctx, w, hh, { title: 'гипнограмма: W · REM · N1 · N2 · N3', xl: '8 ч сна' });
    let a = 0; let py = null; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; NIGHT.forEach(([s, m]) => { const x0 = A.X(a / TOT), x1 = A.X((a + m) / TOT), y = A.Y(1 - DEP[s] * 0.9 - 0.05); if (py !== null) { ctx.beginPath(); ctx.moveTo(x0, py); ctx.lineTo(x0, y); ctx.stroke(); } ctx.fillStyle = SC[s]; ctx.fillRect(x0, y - 2, x1 - x0, 4); py = y; a += m; });
    const x = A.X(st.min / TOT); ctx.strokeStyle = '#EFEAE6'; ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, hh - 16); ctx.stroke();
  }
  /* ---------- тексты ---------- */
  const TXT = {
    clock: '<b>Биологические часы.</b> Главные часы — <b>супрахиазматическое ядро</b> гипоталамуса: ≈ 20 000 нейронов с ритмом около 24 ч. Свет попадает на особые клетки сетчатки (с пигментом меланопсином) и подводит часы. Вечером, в темноте, ядро разрешает <b>эпифизу</b> выделять <b>мелатонин</b> — сигнал «ночь» для всего тела; утром растёт кортизол, к вечеру — температура.',
    screen: '<b>Яркий экран вечером.</b> Синий свет экранов и ламп действует на те же клетки сетчатки, что и дневной: часы думают, что ещё день, и выброс <b>мелатонина</b> подавляется и сдвигается позже. Засыпать труднее, утром тяжелее вставать. Так же сбивают часы ночные смены и перелёты через часовые пояса (<b>джетлаг</b>).',
    W: '<b>Бодрствование.</b> Глаза открыты, на ЭЭГ быстрые низкие волны (бета, при закрытых глазах — альфа). За день в мозге копится <b>аденозин</b> — «давление сна»; кофеин блокирует его рецепторы и поэтому бодрит. Короткие пробуждения ночью — норма, утром их обычно не помнят.',
    N1: '<b>N1 — дремота</b> (несколько минут). Мышцы расслабляются, бывают вздрагивания, глаза медленно плавают. На ЭЭГ альфа-ритм сменяется тета-волнами. Разбудить легко, человек часто уверен, что не спал.',
    N2: '<b>N2 — лёгкий сон</b>, около половины ночи. На ЭЭГ — <b>сонные веретёна</b> и K-комплексы: таламус «отключает» кору от внешних звуков. Веретёна связаны с закреплением навыков, выученных днём. Пульс и температура снижаются.',
    N3: '<b>N3 — глубокий (медленный) сон</b> — в основном в первой половине ночи. Медленные высокие дельта-волны, разбудить трудно. Выделяется гормон роста, а по <b>глимфатической системе</b> ликвор активнее промывает мозг от отходов, в том числе от бета-амилоида.',
    REM: '<b>REM — быстрый сон</b> (сон с быстрыми движениями глаз), всё длиннее к утру. ЭЭГ похожа на бодрствование, глаза быстро двигаются, а мышцы тела парализованы — чтобы мы не «играли» сны. В REM видят самые яркие сновидения; он важен для памяти и эмоций.',
  };
  const lb = (text, pos, color, show, left) => ({ text, pos, color, show: () => st.labels && show(), left });
  const labels = [
    lb('сетчатка', EYE.clone().add(V3(0.1, 0.16, 0)), '#FFE08A', () => st.mode === 'clock'),
    lb('супрахиазматическое ядро — часы', SCN.clone().add(V3(0.05, -0.12, 0.1)), '#FFD070', () => st.mode === 'clock'),
    lb('эпифиз: мелатонин', PIN.clone().add(V3(-0.1, 0.12, 0)), '#9FD8E8', () => true, true),
    lb('верхний шейный узел', SCG.clone().add(V3(0.08, 0, 0)), '#9FD8E8', () => st.mode === 'clock'),
    lb('быстрые движения глаз', EYE.clone().add(V3(0.12, -0.18, 0)), '#FF6A8A', () => st.mode === 'stages' && st.stg === 'REM'),
    lb('глимфатическая очистка', V3(-0.55, 0.85, 0.3), '#7FD6FF', () => st.mode === 'stages' && st.stg === 'N3', true),
    lb('мозг', V3(0.35, 0.85, 0.3), '#C8B0E0', () => st.mode === 'clock'),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'clock' ? (st.screen ? TXT.screen : TXT.clock) : TXT[st.stg || 'W']); };
    refs.modeSeg = seg([{ id: 'clock', label: 'Биологические часы' }, { id: 'stages', label: 'Стадии сна' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'clock') { refs.sl = range('slH', 0, 23.9, 0.1, () => st.h, (v) => { st.h = v; st.auto = false; refs.at && refs.at.sync && refs.at.sync(); }, (v) => String(Math.floor(v)).padStart(2, '0') + ':' + String(Math.floor((v % 1) * 60)).padStart(2, '0')); refs.at = toggle('Идёт время', () => st.auto, (v) => { st.auto = v; }); box.append(h('div', { class: 'glabel' }, 'Время суток'), h('div', { class: 'gctl' }, refs.sl, refs.at, toggle('Экран вечером', () => st.screen, (v) => { st.screen = v; refs.setInfo(); }))); }
      else { refs.sl = null; box.append(h('div', { class: 'glabel' }, 'Стадия'), h('div', { class: 'gctl' }, seg(['W', 'N1', 'N2', 'N3', 'REM'].map((s) => ({ id: s, label: s, color: SC[s] })), () => st.stg || 'W', (v) => { let a = 0; for (const [s, m] of NIGHT) { if (s === v) { st.min = a + m / 2; break; } a += m; } st.auto = false; st.stg = v; refs.setInfo(); }), toggle('Идёт время', () => st.auto, (v) => { st.auto = v; }))); }
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–2', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  let lastStg = null;
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 2) { setMode(['clock', 'stages'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'clock') { const hh = Math.floor(st.h), mm = Math.floor((st.h % 1) * 60); return [['Время', String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'), ''], ['Мелатонин', Math.round(100 * (st.mel || 0)), '% от пика']]; }
    return [['Стадия', st.stg || 'W', ''], ['Цикл', cycleAt(st.min), 'из 5'], ['Сон', (st.min / 60).toFixed(1).replace('.', ','), 'ч']];
  }
  const self = {
    mobZoom: 0.85, scene, camera, controls, update: (dt) => { update(dt); if (st.mode === 'stages' && st.stg !== lastStg) { lastStg = st.stg; refs.setInfo && refs.setInfo(); } if (refs.sl && st.auto && refs.sl.sync) refs.sl.sync(); }, ui, onKey, stats, labels, drawScope, accent: '#9F7BFF',
    kicker: 'Мозг · устройство', title: 'Сон и биологические часы',
    lede: 'Треть жизни мы спим — и это не отдых мозга, а работа: он сортирует память и промывает себя от отходов. А когда спать, решают часы в гипоталамусе, которые подводит свет.',
    notes: `
      <div><h2>Циркадный ритм</h2>
        <p>Почти у каждой клетки есть свои молекулярные часы (гены CLOCK, BMAL1, PER, CRY — петля обратной связи около 24 ч). Супрахиазматическое ядро синхронизирует их по свету: сетчатка → ретиногипоталамический тракт → СХЯ → (через спинной мозг и верхний шейный узел) → эпифиз. Мелатонин растёт с темнотой, пик — около 2–4 ч ночи.</p>
        <h3>Сколько спать</h3><p>Взрослым — 7–9 ч, подросткам — 8–10, новорождённым — 14–17. Подростковые часы естественно сдвинуты позже. Цикл сна ≈ 90 мин; за ночь 4–6 циклов: глубокий сон в начале, быстрый — к утру.</p>
        <h3>Нарушения</h3><ul><li>Бессонница; апноэ сна (остановки дыхания, храп); нарколепсия (нехватка орексина — внезапные засыпания).</li><li>Недосып ухудшает внимание и память, повышает аппетит и риск диабета, ожирения и болезней сердца.</li><li>Помогают постоянный режим, утренний свет, тёмная прохладная спальня, меньше экранов и кофеина вечером.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Голова и мозг упрощены; путь от СХЯ к эпифизу (через спинной мозг и верхний шейный узел) нарисован схематично.</li><li>Кривые мелатонина, кортизола и температуры — типичные формы в условных единицах; гипнограмма — пример одной ночи взрослого.</li><li>Сутки и ночь ускорены; движения глаз и «промывка» мозга показаны наглядно, а не в масштабе.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>2</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('clock'); st.fly = null;
  return self;
}
