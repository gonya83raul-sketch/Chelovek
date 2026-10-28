// @scene glycogen makeGlycogen | Гликоген и сахар крови | Углеводы
/* =========================================================
   БИОХИМИЯ · ГЛИКОГЕН: гранула (ветвящиеся цепи α-1,4 / α-1,6 на гликогенине),
   синтез (УДФ-глюкоза), распад (фосфорилаза, глюкозо-1-фосфат), регуляция сахара крови
   ========================================================= */
function makeGlycogen() {
  rnd = mulberry(1301);
  const scene = bioStage({ rim: 0xf2c14e });
  const GX = matchMedia("(max-width:700px)").matches ? 0 : -1.6;   // компьютер: гранула правее описания
  const VIEW = { build: flyTarget(V3(GX, -1.2, 0), V3(GX + 1.0, 0.4, 13.5)), break: flyTarget(V3(GX, -1.2, 0), V3(GX + 1.0, 0.4, 13.5)), blood: flyTarget(V3(40, -0.9, 0), V3(40.6, 1.2, 18.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.build.pos);
  const controls = makeControls(camera, VIEW.build.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  /* ---------- гранула ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.9, 0); scene.add(G1);
  const core = new THREE.Mesh(blobGeo(0.28, 0.28, 0.28, 3, 0.12, 4), protMat('#FF8AB0', 0.4)); G1.add(core);
  const RES = []; // {p, q, tier, ta, branch}
  // сетка-хэш: остаток не ставится вплотную к остатку другой цепи — цепи не проходят друг сквозь друга
  const GRID = new Map(), gk = (x, y, z) => `${x},${y},${z}`; let CID = 0;
  const crowded = (p, cid) => { const cx = Math.floor(p.x / 0.1), cy = Math.floor(p.y / 0.1), cz = Math.floor(p.z / 0.1); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) { const L = GRID.get(gk(cx + a, cy + b, cz + c)); if (L && L.some((r) => r.cid !== cid && r.p.distanceTo(p) < 0.09)) return true; } return false; };
  const gridAdd = (r) => { const k = gk(Math.floor(r.p.x / 0.1), Math.floor(r.p.y / 0.1), Math.floor(r.p.z / 0.1)); if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(r); };
  function chain(start, dir, tier, t0) {
    const n = tier === 0 ? 8 : 12 + Math.floor(rnd() * 2); let p = start.clone(); const d = dir.clone().normalize();
    const kids = []; const cid = ++CID;
    for (let i = 0; i < n; i++) {
      const rad = p.lengthSq() > 1e-6 ? p.clone().normalize() : d.clone(); d.add(randUnit().multiplyScalar(0.25)).addScaledVector(rad, 0.4).normalize(); if (p.length() > 2.0) d.addScaledVector(rad, -0.9).normalize(); const tw = V3(-d.y, d.x, 0).normalize().multiplyScalar(0.03 * Math.sin(i * 1.7));
      const np = p.clone().addScaledVector(d, 0.105).add(tw); if (i > 1 && crowded(np, cid)) break; p = np;
      const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d);
      const r = { p: p.clone(), q, tier, ta: t0 + i * 0.09, end: i === n - 1, n: i, len: n, kidAt: false };
      r.cid = cid; RES.push(r); gridAdd(r);
      if (tier < 3 && (i === 4 || (i === 8 && tier > 0))) { r.kidAt = true; const ax = randUnit().cross(d).normalize(); kids.push([p.clone(), d.clone().applyAxisAngle(ax, rand(0.52, 0.7)).normalize(), tier + 1, t0 + i * 0.09 + 0.25]); } // ветвь отходит под 30–40°
    }
    kids.forEach((k) => { if (RES.length < 1700) chain(...k); });
  }
  // цепи от гликогенина расходятся во все стороны (точки Фибоначчи на сфере) — гранула растёт шаром, а не крестом
  for (let k = 0; k < 12; k++) { const y = 1 - 2 * (k + 0.5) / 12, rr = Math.sqrt(1 - y * y), a = k * 2.39996; const d = V3(Math.cos(a) * rr, y, Math.sin(a) * rr); chain(d.clone().multiplyScalar(0.22), d, 0, k * 0.04); }
  const NR = RES.length; const T_ALL = Math.max(...RES.map((r) => r.ta)) + 0.5;
  const HX = new THREE.InstancedMesh(new THREE.SphereGeometry(0.056, 10, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.5 }), NR); G1.add(HX);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  const tierCol = ['#FF8AB0', '#FF9A70', '#FFB060', '#F2C14E', '#E8D27A', '#F2E6C8', '#FFF0D0'];
  RES.forEach((r, i) => { HX.setColorAt(i, r.kidAt ? col.set('#FF6A6A').multiplyScalar(0.8) : col.set(tierCol[r.tier]).multiplyScalar(0.42)); }); // точки ветвления α-1,6 — красные
  const KIDS = RES.filter((r) => r.kidAt && r.tier >= 1);
  const g1p = []; for (let k = 0; k < 10; k++) { const m = molMesh(MOL('g1p'), { scale: 0.1, hideH: true }); molGlow(m, 0.3); m.visible = false; scene.add(m); g1p.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const udp = []; for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7fe0a0 })); m.visible = false; scene.add(m); udp.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
  /* ---------- сахар крови ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.18, legs: true });
  const liver = new THREE.Mesh(blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), organMat('#B0523A', 0.5)); liver.position.set(-0.35, 1.55, 0.15); G2.add(liver);
  const panc = new THREE.Mesh(blobGeo(0.5, 0.12, 0.14, 6, 0.1, 4), organMat('#E8B070', 0.55)); panc.position.set(0.25, 1.2, -0.05); panc.rotation.z = 0.2; G2.add(panc);
  const brain = new THREE.Mesh(ell3(0.3, 0.25, 0.35, BODY.head), organMat('#E0A0B8', 0.45)); G2.add(brain);
  const musL = [1, -1].map((s) => { const m = new THREE.Mesh(tube([V3(0.47 * s, -0.3, 0.05), V3(0.5 * s, -1.2, 0.08), V3(0.48 * s, -2.0, 0.06)], 0.24), organMat('#C0504A', 0.4)); G2.add(m); return m; });
  [1, -1].forEach((s) => { const k = new THREE.Mesh(blobGeo(0.16, 0.24, 0.12, 8 + s, 0.08, 3), organMat('#A04040', 0.5)); k.position.set(0.62 * s, 0.98, -0.2); G2.add(k); }); // почки
  const fat = new THREE.Mesh(ell3(0.8, 0.35, 0.3, V3(0, 0.6, 0.35)), organMat('#F2D08A', 0.35, { transparent: true, opacity: 0.6 })); G2.add(fat);
  const HEART = BODY.heart.clone();
  const fGlu = [flowArrow(G2, liver.position.clone().add(V3(0.3, 0.2, 0.2)), HEART.clone().add(V3(0, -0.1, 0.1)), '#F2C14E', { bend: 0.3 }), flowArrow(G2, HEART.clone().add(V3(0.1, 0.2, 0)), BODY.head.clone().add(V3(0.1, -0.35, 0)), '#F2C14E', { bend: -0.2 }), flowArrow(G2, HEART.clone().add(V3(0.2, -0.3, 0)), V3(0.5, -0.5, 0.1), '#F2C14E', { bend: -0.25 })];
  const fIns = flowArrow(G2, panc.position.clone().add(V3(0.2, 0.1, 0.2)), liver.position.clone().add(V3(0.3, -0.2, 0.3)), '#7FD6FF', { bend: 0.5 });
  const fGlg = flowArrow(G2, panc.position.clone().add(V3(0.1, 0.15, 0.25)), liver.position.clone().add(V3(0.1, -0.1, 0.4)), '#FF8A5C', { bend: -0.6 });
  /* ---------- состояние ---------- */
  const LB = { br: V3(0, 0, 0), udp: V3(0, 0, 0), g1p: V3(0, 0, 0) };
  const st = { t: 0, mode: 'build', labels: true, rot: true, fly: null, g: 0, msg: null, glu: 5.0, ins: 0.3, glg: 0.3, meal: -99, diab: 'none', hist: [], hrs: 0, sim: 8, glycL: 0.7 };
  controls.addEventListener('start', () => { st.userCam = true; });
  function setMode(m) { st.mode = m; st.userCam = false; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m !== 'blood'; G2.visible = m === 'blood'; st.fly = VIEW[m]; st.g = m === 'build' ? 0 : T_ALL; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt);
    if (G1.visible && !st.fly && !st.userCam) { const want = 7.5 + 7.5 * Math.cbrt((st.res || 0) / NR), off = camera.position.clone().sub(controls.target), L = off.length(); const L2 = L + (want - L) * Math.min(1, dt * 1.5); camera.position.copy(controls.target).addScaledVector(off, L2 / L); const dy = 0.9 - 0.9 * L2 / 13.5 - controls.target.y; controls.target.y += dy; camera.position.y += dy; }
    if (G1.visible) {
      if (st.rot) G1.rotation.y += dt * 0.2;
      if (st.mode === 'build') { st.g += dt * 0.55; if (st.g > T_ALL + 2.5) st.g = 0.2; }
      else { st.g -= dt * 0.55; const lim = 0.45; if (st.g < lim) { st.g = lim; st.hold = (st.hold || 0) + dt; if (st.hold > 2.5) { st.hold = 0; st.g = T_ALL; } } }
      let shown = 0;
      RES.forEach((r, i) => {
        const vis = r.ta <= st.g; const fresh = st.mode === 'build' && vis && st.g - r.ta < 0.25;
        dm.position.copy(r.p); dm.quaternion.copy(r.q); dm.scale.setScalar(vis ? (fresh ? 1.6 : 1) : 0.0001); dm.updateMatrix(); HX.setMatrixAt(i, dm.matrix);
        if (vis) shown++;
        if (st.mode === 'break' && !vis && r.ta > st.g && r.ta - st.g < 0.012 * 60 * dt && rnd() < 0.5) { const q = g1p.find((x) => x.age > 2.2); if (q) { q.age = 0; q.m.visible = true; const wp = r.p.clone().applyQuaternion(G1.quaternion).add(G1.position); q.m.position.copy(wp); q.v.copy(wp.clone().sub(G1.position).normalize().multiplyScalar(1.4)); } }
        if (fresh && rnd() < 0.08) { const u = udp.find((x) => x.age > 0.6); if (u) { u.age = 0; u.m.visible = true; const wp = r.p.clone().applyQuaternion(G1.quaternion).add(G1.position); u.b.copy(wp); u.a.copy(wp.clone().sub(G1.position).normalize().multiplyScalar(2.2).add(wp)); } }
      });
      HX.instanceMatrix.needsUpdate = true; st.res = shown;
      g1p.forEach((q) => { if (q.age < 2.2) { q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
      udp.forEach((u) => { if (u.age < 0.6) { u.age += dt; u.m.position.copy(u.a).lerp(u.b, u.age / 0.6); } else u.m.visible = false; });
      core.rotation.y += dt;
      // подписи следуют за объектами: ближайшая к зрителю видимая точка ветвления, последние УДФ-глюкоза и Г1Ф
      let best = null, bz = -1e9; KIDS.forEach((r) => { if (r.ta > st.g) return; const wp = r.p.clone().applyQuaternion(G1.quaternion); if (wp.z > bz) { bz = wp.z; best = wp; } }); if (best) LB.br.copy(best).add(G1.position).add(V3(0.45, 0.35, 0.4)); st.brOn = !!best;
      const lu = udp.filter((u) => u.m.visible).sort((a, b) => b.age - a.age)[0]; st.udpOn = !!lu; if (lu) LB.udp.copy(lu.m.position);
      const lg = g1p.filter((q) => q.m.visible).sort((a, b) => b.age - a.age).find((q) => q.age > 0.3); st.g1pOn = !!lg; if (lg) LB.g1p.copy(lg.m.position);
    }
    if (st.mode === 'blood') {
      // модель: каждая секунда = 15 минут
      const hdt = dt * 0.25 * st.sim / 8; st.hrs += hdt;
      const sinceMeal = st.hrs - st.meal;
      const absorb = sinceMeal > 0 && sinceMeal < 3 ? 3.2 * Math.exp(-sinceMeal / 0.9) * (sinceMeal / 0.25 < 1 ? sinceMeal / 0.25 : 1) : 0;
      const insEff = st.diab === 't1' ? 0.05 : st.diab === 't2' ? 0.35 : 1;
      const insSecr = st.diab === 't1' ? 0.02 : clamp((st.glu - 4.2) / 3, 0, 1.6);
      st.ins += (insSecr - st.ins) * Math.min(1, hdt * 3); st.glg += (clamp((5.0 - st.glu) / 1.5, 0.05, 1.5) * (st.diab === 't1' ? 1.4 : 1) - st.glg) * Math.min(1, hdt * 3);
      const uptake = 0.55 + 1.6 * st.ins * insEff * (st.glu / 5); const hepOut = 0.55 + 0.9 * st.glg - 0.7 * st.ins * insEff;
      const renal = st.glu > 10 ? (st.glu - 10) * 0.5 : 0;
      st.glu = clamp(st.glu + (absorb + hepOut - uptake - renal) * hdt * 1.6, 2.5, 22);
      st.glycL = clamp(st.glycL + (0.6 * st.ins * insEff - 0.25 * st.glg) * hdt * 0.3, 0.05, 1);
      st.hist.push([st.hrs, st.glu]); while (st.hist.length && st.hist[0][0] < st.hrs - 8) st.hist.shift();
      [...fGlu, fIns, fGlg].forEach((f) => { f.mat.uniforms.uTime.value = t; });
      fIns.mat.uniforms.uOn.value = clamp(st.ins, 0.05, 1); fGlg.mat.uniforms.uOn.value = clamp(st.glg, 0.05, 1);
      fGlu.forEach((f) => { f.mat.uniforms.uOn.value = clamp(st.glu / 8, 0.2, 1.2); });
      liver.material.emissiveIntensity = 0.04 + 0.3 * st.glycL; panc.material.emissiveIntensity = 0.04 + 0.4 * st.ins;
      if (renal > 0 && rnd() < 0.3) fx.spawn(V3(40 + 0.62 * (rnd() < 0.5 ? 1 : -1), 0.98, -0.2), randUnit().multiplyScalar(0.2), new THREE.Color(0xf2c14e), 0.6, 1, 1.2);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'blood') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'глюкоза крови, ммоль/л · 8 часов', xl: 'время →', yl: '' });
    const Y = (v) => A.Y(v / 16);
    ctx.fillStyle = 'rgba(127,224,160,.12)'; ctx.fillRect(A.X(0), Y(5.5), A.X(1) - A.X(0), Y(3.9) - Y(5.5));
    ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,106,106,.5)'; ctx.beginPath(); ctx.moveTo(A.X(0), Y(10)); ctx.lineTo(A.X(1), Y(10)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#F2C14E'; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach(([x, v], i) => { const X = A.X((x - (st.hrs - 8)) / 8); i ? ctx.lineTo(X, Y(v)) : ctx.moveTo(X, Y(v)); }); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(127,224,160,.8)'; ctx.fillText('норма 3,9–5,5', A.X(0.02), Y(5.5) - 3); ctx.fillStyle = 'rgba(255,140,140,.8)'; ctx.fillText('почечный порог ~10', A.X(0.55), Y(10) - 3);
  }
  const TXT = {
    build: '<b>Синтез гликогена (гликогенез).</b> После еды глюкоза в печени и мышцах превращается в глюкозо-6-фосфат → глюкозо-1-фосфат → <b>УДФ-глюкозу</b> (активированная форма, зелёные огоньки). <b>Гликогенсинтаза</b> пришивает остатки к концам цепей связью <b>α-1,4</b>, а <b>ветвящий фермент</b> переносит кусочки по 6–7 остатков, создавая точки ветвления <b>α-1,6</b> (примерно каждые 8–12 остатков). Затравка — белок <b>гликогенин</b> в центре (розовый). Ветвление делает гранулу компактной, растворимой и даёт много концов для быстрого распада. Гликогенсинтазу включает инсулин (через дефосфорилирование).',
    break: '<b>Распад гликогена (гликогенолиз).</b> <b>Гликогенфосфорилаза</b> (кофермент — пиридоксальфосфат, витамин B6) отщепляет глюкозу от концов цепей не водой, а фосфатом — сразу получается <b>глюкозо-1-фосфат</b> (летящие молекулы), без затраты АТФ. Фосфорилаза останавливается за 4 остатка до ветвления; дальше работает <b>деветвящий фермент</b>. Включается адреналином (мышцы, печень) и глюкагоном (печень) через цАМФ и протеинкиназу A. <b>В печени</b> глюкозо-6-фосфатаза отдаёт глюкозу в кровь, <b>в мышцах</b> — только на собственный гликолиз.',
    blood: '<b>Сахар крови</b> держится в узком коридоре ~3,9–5,5 ммоль/л натощак (в старых справочниках — 3,3–5,5). После еды глюкоза растёт → <b>инсулин</b> (голубой поток от β-клеток поджелудочной) заставляет печень и мышцы забирать глюкозу и запасать её в гликоген и жир. Натощак сахар падает → <b>глюкагон</b> (оранжевый) заставляет печень расщеплять гликоген и синтезировать глюкозу. Мозг потребляет ~120 г глюкозы в сутки. Нажмите «Поесть» и сравните с диабетом.',
  };
  const labels = [
    { text: 'гликогенин', pos: V3(0.35, 1.25, 0.3), color: '#FF8AB0', show: () => st.labels && G1.visible },
    { text: 'α-1,6 ветвление', pos: LB.br, color: '#FF6A6A', show: () => st.labels && G1.visible && st.brOn },
    { text: 'УДФ-глюкоза', pos: LB.udp, color: '#7FE0A0', show: () => st.labels && st.mode === 'build' && st.udpOn },
    { text: 'глюкозо-1-фосфат', pos: LB.g1p, color: '#FF9A30', show: () => st.labels && st.mode === 'break' && st.g1pOn },
    { text: 'печень', pos: V3(40 - 1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels && st.mode === 'blood' },
    { text: 'поджелудочная', pos: V3(40 + 0.75, 1.0, 0.2), color: '#E8B070', show: () => st.labels && st.mode === 'blood' },
    { text: 'мозг', pos: V3(40.4, 4.4, 0), color: '#E0A0B8', show: () => st.labels && st.mode === 'blood' },
    { text: 'мышцы', pos: V3(40.8, -1.2, 0.2), color: '#C0504A', show: () => st.labels && st.mode === 'blood' },
    { text: 'жировая ткань', pos: V3(40 - 1.0, 0.5, 0.4), color: '#F2D08A', show: () => st.labels && st.mode === 'blood' },
    { text: 'почки (глюкозурия)', pos: V3(40 + 0.82, 0.85, 0.2), color: '#E07070', show: () => st.labels && st.mode === 'blood' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'build', label: 'Синтез' }, { id: 'break', label: 'Распад' }, { id: 'blood', label: 'Сахар крови' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'blood') {
        box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, button('Поесть', () => { st.meal = st.hrs; }, true), seg([{ id: 'none', label: 'Здоров' }, { id: 't1', label: 'Диабет 1 типа', color: '#FF6A6A' }, { id: 't2', label: 'Диабет 2 типа', color: '#FF9A50' }], () => st.diab, (v) => { st.diab = v; st.msg = v === 't1' ? '<b>Сахарный диабет 1 типа</b> — иммунитет разрушил β-клетки, инсулина нет. Глюкоза не входит в мышцы и жир, печень продолжает её выбрасывать (глюкагона много). Сахар выше почечного порога (~10 ммоль/л) уходит с мочой (глюкозурия), жиры распадаются до кетоновых тел (кетоацидоз). Лечение — инсулин.' : v === 't2' ? '<b>Сахарный диабет 2 типа</b> — инсулин есть, но ткани к нему малочувствительны (инсулинорезистентность, чаще при ожирении). Сахар после еды падает медленно. Лечение — питание, движение, метформин и другие препараты.' : null; refs.setInfo(); })));
      } else box.append(h('div', { class: 'glabel' }, 'Гранула'), h('div', { class: 'gctl' }, button('Сначала', () => { st.g = st.mode === 'build' ? 0 : T_ALL; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['build', 'break', 'blood'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'blood' ? [['Глюкоза', st.glu.toFixed(1), 'ммоль/л'], ['Инсулин', Math.round(st.ins * 60), '%'], ['Гликоген печени', Math.round(st.glycL * 100), '%']] : [['Остатков глюкозы', st.res || 0, ''], ['В реальной грануле', '≈ 30 000', '']]; }
  const self = {
    labelBg: true, mobZoom: 0.62, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · обмен углеводов', title: 'Гликоген и сахар крови',
    lede: 'Глюкоза — быстрое топливо, но хранить её в свободном виде нельзя: вода хлынула бы в клетку. Поэтому печень и мышцы запасают её в ветвистых гранулах гликогена.',
    notes: `
      <div><h2>Запасы</h2>
        <p>В печени — около 100–120 г гликогена (до 6% массы), его хватает на 12–24 часа голодания и он служит всему организму. В мышцах — 300–400 г (1–2%), но только «для себя»: в мышцах нет глюкозо-6-фосфатазы.</p>
        <h3>Регуляция</h3>
        <p><b>Инсулин</b> активирует гликогенсинтазу и тормозит фосфорилазу (через фосфатазы). <b>Глюкагон</b> (печень) и <b>адреналин</b> (печень и мышцы) запускают каскад: рецептор → G-белок → аденилатциклаза → цАМФ → протеинкиназа A → киназа фосфорилазы → фосфорилаза. Фосфорилирование включает фосфорилазу и одновременно выключает гликогенсинтазу. В мышцах распад ускоряют также Ca²⁺ сокращения и АМФ.</p>
        <h3>Гликогенозы</h3><p>Наследственные дефекты ферментов распада: болезнь Гирке (глюкозо-6-фосфатаза — гипогликемия, большая печень), Помпе (лизосомная α-глюкозидаза — поражение сердца), Мак-Ардла (мышечная фосфорилаза — судороги при нагрузке). Агликогенозы — дефекты синтеза.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Гранула показана упрощённо: несколько сотен остатков из ~30 000, каждая шестиугольная пластинка — один остаток глюкозы.</li><li>Модель сахара крови качественная: «8 часов» сжаты в полминуты.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('build'); st.fly = null; st.g = T_ALL * 0.55;   // первый кадр — уже заметная гранула, а не редкий «ёжик»
  return self;
}
