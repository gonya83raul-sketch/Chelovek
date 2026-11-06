// @scene muscle makeMuscle | Мышца: от органа до саркомера | @body Опора и движение
/* =========================================================
   ТЕЛО · СКЕЛЕТНАЯ МЫШЦА: уровни строения (мышца → пучок → волокно → миофибрилла → саркомер),
   скольжение нитей (актин, миозин, Z-линии; Ca²⁺ и АТФ; трупное окоченение), нервно-мышечный синапс,
   потенциал действия по T-трубочкам, медленные и быстрые волокна (по Неттеру BP 8)
   ========================================================= */
function makeMuscle() {
  rnd = mulberry(1301);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0xffb0a8);
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: объект правее заголовка и описания
  const XL = [0, 30, 60, 90, 120], X3 = 160;   // уровни строения; саркомер (120) — общий для «Сокращения»
  const LV = [
    { id: 'muscle', name: 'Мышца', v: DK ? [V3(-3.6, -0.3, 0), V3(-3.6, 2.6, 19.5)] : [V3(0, -0.6, 0), V3(0, 2.0, 19)] },
    { id: 'fasc', name: 'Пучок', v: DK ? [V3(30 - 2.6, -0.3, 0), V3(30 - 1.0, 2.6, 13.5)] : [V3(30, -0.5, 0), V3(31, 2.6, 13.5)] },
    { id: 'fiber', name: 'Волокно', v: DK ? [V3(60 - 2.6, -0.3, 0), V3(60 - 1.0, 2.6, 13.5)] : [V3(60, -0.5, 0), V3(61, 2.6, 13.5)] },
    { id: 'myofib', name: 'Миофибрилла', v: DK ? [V3(90 - 2.4, -0.3, 0), V3(90 - 1.8, 1.6, 11.5)] : [V3(90, -0.3, 0), V3(90.5, 1.6, 11)] },
    { id: 'sarc', name: 'Саркомер', v: DK ? [V3(120 - 1.5, -0.2, 0), V3(120 - 1.0, 1.4, 6.8)] : [V3(120, -0.2, 0), V3(120.4, 1.3, 6.6)] },
  ];
  const VIEW3 = DK ? [V3(X3 - 3.2, 0.4, 0), V3(X3 - 2.0, 3.4, 14.5)] : [V3(X3, 0.2, 0), V3(X3 + 1, 3.2, 14)];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(LV[0].v[1]);
  const controls = makeControls(camera, LV[0].v[0]); controls.minDistance = 1.5; controls.maxDistance = 40;
  const fx = new Sparks(900, 0.05); scene.add(fx.obj);
  const mat = (col, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.65), roughness: o.r ?? 0.5, clearcoat: o.cc ?? 0.3, emissive: col, emissiveIntensity: o.e ?? 0.06, ...o.m });
  const glassy = (col, op = 0.18) => mat(col, { k: 0.5, e: 0.1, m: { transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide } });
  const RED = '#C2404E', TEND = '#E8E0D0';
  // поперечная исчерченность: текстура «I (светлый) — A (тёмный) — H — M — A — I», Z-линия на краю
  const stripe = (() => { const c = document.createElement('canvas'); c.width = 4; c.height = 128; const g = c.getContext('2d');
    const band = (y0, y1, col) => { g.fillStyle = col; g.fillRect(0, y0, 4, y1 - y0); };
    band(0, 128, '#F0C8C8'); band(26, 102, '#8E2A3A'); band(54, 74, '#B84A5A'); band(63, 65, '#5A1424'); band(0, 2, '#3A1018'); band(126, 128, '#3A1018');
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const striped = (rep, o = {}) => { const t = stripe.clone(); t.needsUpdate = true; t.repeat.set(1, rep); return new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.45, clearcoat: 0.3, emissive: 0x2a0810, emissiveIntensity: 0.25, ...o }); };
  const cylX = (r, len, m, x, y = 0, z = 0, seg = 20) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg, 1, false), m); c.rotation.z = Math.PI / 2; c.position.set(x, y, z); scene.add(c); return c; };
  const hexPts = (n, step) => { const p = [[0, 0]]; for (let ring = 1; p.length < n; ring++) for (let k = 0; k < 6 * ring && p.length < n; k++) { const a = (k / (6 * ring)) * Math.PI * 2; p.push([Math.cos(a) * ring * step, Math.sin(a) * ring * step]); } return p; };

  /* ---------- 1а. мышца (веретено с сухожилиями, эпимизий) ---------- */
  const prof = []; for (let i = 0; i <= 40; i++) { const t = i / 40; prof.push(new THREE.Vector2(Math.max(0.05, 1.35 * Math.pow(Math.sin(Math.PI * t), 0.75)), -4 + 8 * t)); }
  const belly = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), mat(RED, { k: 0.6, e: 0.08 })); belly.rotation.z = Math.PI / 2; belly.position.x = XL[0]; scene.add(belly);
  const epi = new THREE.Mesh(new THREE.LatheGeometry(prof.map((v) => new THREE.Vector2(v.x * 1.04 + 0.02, v.y)), 48), glassy('#F0E8E0', 0.16)); epi.rotation.z = Math.PI / 2; epi.position.x = XL[0]; scene.add(epi);
  [-1, 1].forEach((s) => { const tg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 2.2, 20), mat(TEND, { k: 0.7, e: 0.05 })); tg.rotation.z = -s * Math.PI / 2; tg.position.set(XL[0] + s * 5.0, 0, 0); scene.add(tg); });
  // срез посередине — видны пучки
  const cut = new THREE.Group(); cut.position.set(XL[0] + 0.0, 0, 0); scene.add(cut);
  hexPts(19, 0.5).forEach(([y, z]) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.22, 18), mat('#E06070', { k: 0.7, e: 0.15, m: { side: THREE.DoubleSide } })); d.rotation.y = Math.PI / 2; d.position.set(0.02, y * 1.1, z * 1.1 + 0.0); cut.add(d); });
  cut.visible = false;   // срез — только в подписи «пучки»: модель целая, иначе путает
  /* ---------- 1б. пучок: волокна в перимизии ---------- */
  cylX(1.05, 6.2, glassy('#F0E8E0', 0.14), XL[1]);
  hexPts(19, 0.42).forEach(([y, z], i) => cylX(0.19, 6 - rnd() * 0.3, mat(i % 3 ? RED : '#D05060', { k: 0.62, e: 0.08 }), XL[1], y, z, 16));
  /* ---------- 1в. волокно: сарколемма, миофибриллы, ядра по краю, митохондрии ---------- */
  cylX(1.05, 6.4, glassy('#F0D8E0', 0.2), XL[2]);
  hexPts(19, 0.36).forEach(([y, z]) => { const m = cylX(0.16, 6, striped(14), XL[2], y, z, 14); m.material.map.repeat.set(1, 14); });
  for (let i = 0; i < 6; i++) { const a = i * 1.05 + 0.4, n = new THREE.Mesh(ell3(0.32, 0.09, 0.12), mat('#9F7BFF', { k: 0.6, e: 0.2 })); n.position.set(XL[2] - 2.4 + i * 0.95, Math.cos(a) * 0.96, Math.sin(a) * 0.96); n.rotation.x = a; scene.add(n); }
  const mitoM = mat('#F2A040', { k: 0.6, e: 0.2 });
  for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.22, 4, 8), mitoM); m.rotation.z = Math.PI / 2; m.position.set(XL[2] - 2.6 + rnd() * 5.2, (rnd() - 0.5) * 1.3, 0.62 + rnd() * 0.2); scene.add(m); }
  /* ---------- 1г. миофибрилла: исчерченность, 5 саркомеров ---------- */
  const myof = cylX(0.55, 6, striped(5), XL[3], 0, 0, 32); myof.material.map.repeat.set(1, 5);
  /* ---------- 1д/2. саркомер: Z-линии, актин, миозин с головками ---------- */
  const SX = XL[4], LA = 1.0, LM = 1.6;
  const zMat = mat('#E8E0F0', { k: 0.8, e: 0.25 }), aMat = mat('#7FD6FF', { k: 0.7, e: 0.25 }), mMat = mat('#F2A040', { k: 0.7, e: 0.2 }), hMat = mat('#FFC870', { k: 0.8, e: 0.35 });
  const ROWY = [-0.5, 0, 0.5], ROWZ = [-0.32, 0, 0.32], THINY = [-0.75, -0.25, 0.25, 0.75];
  const sideG = [-1, 1].map((s) => { const g = new THREE.Group(); scene.add(g);
    const z = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.9, 1.0), zMat); g.add(z);
    THINY.forEach((y) => ROWZ.forEach((zz) => { const a = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, LA, 8), aMat); a.rotation.z = Math.PI / 2; a.position.set(-s * LA / 2, y, zz); g.add(a); }));
    return { g, s }; });
  const heads = [], thick = new THREE.Group(); thick.position.x = SX; scene.add(thick);
  ROWY.forEach((y) => ROWZ.forEach((z) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, LM, 10), mMat); t.rotation.z = Math.PI / 2; t.position.set(0, y, z); thick.add(t);
    for (let x = 0.14; x <= LM / 2 - 0.04; x += 0.11) [-1, 1].forEach((s) => [1, -1].forEach((u) => { const hd = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), hMat); hd.position.set(s * x, y + u * 0.12, z); hd.userData = { s, u, y, x, ph: rnd() * 6.28 }; thick.add(hd); heads.push(hd); })); }));
  const caGeo = new THREE.BufferGeometry(), caN = 160, caP = new Float32Array(caN * 3); for (let i = 0; i < caN; i++) caP.set([SX + (rnd() - 0.5) * 2.4, (rnd() - 0.5) * 1.8, (rnd() - 0.5) * 0.9], i * 3);
  caGeo.setAttribute('position', new THREE.BufferAttribute(caP, 3)); const caMat = new THREE.PointsMaterial({ color: 0xffe08a, size: 0.05, transparent: true, opacity: 0, depthWrite: false }); scene.add(new THREE.Points(caGeo, caMat));
  /* ---------- 3. нервно-мышечный синапс, T-трубочки, типы волокон ---------- */
  const fib3 = cylX(1.0, 8, mat(RED, { k: 0.55, e: 0.08, m: { transparent: true, opacity: 0.55, depthWrite: false } }), X3, 0, 0, 40);
  hexPts(7, 0.45).forEach(([y, z]) => { const m = cylX(0.17, 7.8, striped(18), X3, y, z, 12); m.material.map.repeat.set(1, 18); });
  const TT = []; for (let x = -3.6; x <= 3.61; x += 0.6) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.01, 0.025, 6, 48), mat('#7FB4FF', { k: 0.7, e: 0.3 })); r.rotation.y = Math.PI / 2; r.position.set(X3 + x, 0, 0); scene.add(r); TT.push(r); }
  const NMJ = V3(X3 - 1.2, 1.0, 0);
  const nerve = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(X3 - 3.5, 3.6, -0.4), V3(X3 - 2.2, 2.6, -0.2), V3(X3 - 1.4, 1.6, 0), NMJ.clone().add(V3(0, 0.12, 0))]), 40, 0.09, 10), mat('#F2D27A', { k: 0.7, e: 0.15 })); scene.add(nerve);
  const term = new THREE.Mesh(ell3(0.42, 0.12, 0.3), mat('#F2D27A', { k: 0.7, e: 0.2 })); term.position.copy(NMJ).add(V3(0, 0.08, 0)); scene.add(term);
  const wave = [1, -1].map(() => { const w = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.06, 8, 48), new THREE.MeshBasicMaterial({ color: 0xfff2a0, transparent: true, opacity: 0 })); w.rotation.y = Math.PI / 2; scene.add(w); return w; });
  const mito3 = []; for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.24, 4, 8), mitoM); m.rotation.z = Math.PI / 2; const a = rnd() * 6.28; m.position.set(X3 - 3.6 + rnd() * 7.2, Math.cos(a) * (0.55 + rnd() * 0.35), Math.sin(a) * (0.55 + rnd() * 0.35)); scene.add(m); mito3.push(m); }
  const capil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(X3 - 4, -1.25, 0.9), V3(X3, -1.2, 1.1), V3(X3 + 4, -1.3, 0.8)]), 40, 0.12, 8), mat('#D8485A', { k: 0.6, e: 0.15 })); scene.add(capil);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'levels', lv: 0, state: 'rest', ftype: 'slow', lz: 1.25, wave: -1, labels: true, rot: false, fly: null, msg: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = m === 'levels' ? flyTarget(...LV[st.lv].v) : m === 'contract' ? flyTarget(...LV[4].v) : flyTarget(...VIEW3); if (m === 'contract' && st.state === 'rest') setState('contract'); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setLv(i) { st.lv = i; refs.lvSeg && refs.lvSeg.sync(); st.fly = flyTarget(...LV[i].v); refs.setInfo && refs.setInfo(); }
  function setState(s) { st.state = s; refs.stSeg && refs.stSeg.sync(); refs.setInfo && refs.setInfo(); }
  function fire() { st.wave = 0; fx.spawn(NMJ.clone(), V3(0, -0.3, 0), new THREE.Color('#FFE08A'), 0.9, 0.3, 1.2); }
  const LR = (a, b, k) => a + (b - a) * k;
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    const k = 1 - Math.exp(-dt * 2.2), act = st.mode !== 'levels' && st.state !== 'rest';
    st.lz = LR(st.lz, st.mode === 'levels' ? 1.25 : st.state === 'contract' ? 0.98 + 0.03 * Math.sin(t * 6) : st.state === 'rigor' ? 1.02 : 1.25, k);
    sideG.forEach((o) => { o.g.position.set(SX + o.s * st.lz, 0, 0); });
    heads.forEach((hd) => { const d = hd.userData, sw = st.state === 'contract' && st.mode === 'contract' ? Math.sin(t * 9 + d.ph) : st.state === 'rigor' ? 0.8 : -0.4;
      hd.position.set(d.s * d.x + d.s * 0.03 * sw, d.y + d.u * (0.12 + 0.03 * Math.max(0, sw)), hd.position.z); });
    caMat.opacity = LR(caMat.opacity, act && st.state === 'contract' ? 0.9 : st.state === 'rigor' && st.mode === 'contract' ? 0.5 : 0, k);
    if (st.mode === 'nmj') { if (st.wave < 0 && (t % 3.2) < dt) fire(); }
    if (st.wave >= 0) { st.wave += dt * 3.2; wave.forEach((w, i) => { const x = NMJ.x - X3 + (i ? -1 : 1) * st.wave; w.position.set(X3 + x, 0, 0); w.material.opacity = Math.abs(x) < 4 ? 0.85 : 0; }); if (st.wave > 5) { st.wave = -1; wave.forEach((w) => { w.material.opacity = 0; }); } }
    TT.forEach((r) => { const dx = Math.abs(r.position.x - NMJ.x); const hot = st.wave >= 0 && Math.abs(dx - st.wave) < 0.35; r.material.emissiveIntensity = hot ? 1.4 : 0.3; });
    const slow = st.ftype === 'slow'; fib3.material.color.set(slow ? '#8A2030' : '#E0A0A8'); mito3.forEach((m, i) => { m.visible = slow ? true : i % 4 === 0; }); capil.visible = slow;
    fx.update(dt);
  }
  /* ---------- тексты ---------- */
  const LTXT = {
    muscle: '<b>Скелетная мышца</b> — орган из тысяч волокон, одетый в соединительнотканный чехол <b>эпимизий</b>. На концах коллагеновые волокна чехлов сходятся в <b>сухожилия</b>, которые крепятся к костям. В теле ≈ 640 мышц.',
    fasc: '<b>Пучок</b> (фасцикула) — десятки и сотни мышечных волокон в своём чехле <b>перимизии</b>; между волокнами — тонкий <b>эндомизий</b> с капиллярами и нервами. Пучки видны в мясе как «волокна».',
    fiber: '<b>Мышечное волокно</b> — одна огромная клетка до 10–30 см длиной и 10–100 мкм толщиной. Она возникла слиянием многих клеток, поэтому в ней сотни <b>ядер</b>, оттеснённых к оболочке (<b>сарколемме</b>). Внутри — <b>миофибриллы</b> и митохондрии.',
    myofib: '<b>Миофибрилла</b> — тяж из повторяющихся звеньев, <b>саркомеров</b>. Тёмные <b>A-диски</b> (там лежат толстые нити миозина) чередуются со светлыми <b>I-дисками</b> (только тонкие нити актина) — отсюда поперечная исчерченность.',
    sarc: '<b>Саркомер</b> (≈ 2,5 мкм в покое) — от одной <b>Z-линии</b> до другой. К Z-линиям крепятся тонкие нити <b>актина</b>, в центре лежат толстые нити <b>миозина</b> с головками. Светлая середина A-диска — <b>H-зона</b>, где нити не перекрываются.',
  };
  const CTXT = {
    rest: '<b>Покой.</b> Ионов Ca²⁺ в цитоплазме мало: участки связывания на актине закрыты белками <b>тропомиозином</b> и <b>тропонином</b>, головки миозина не могут зацепиться. Саркомер ≈ 2,5 мкм.',
    contract: '<b>Сокращение — скольжение нитей.</b> Ca²⁺ из саркоплазматического ретикулума садится на тропонин, участки на актине открываются. Головки миозина цепляются, гребут к центру (рабочий ход) и отцепляются, расщепив <b>АТФ</b>. Нити не укорачиваются — они скользят: Z-линии сближаются, I-диск и H-зона сужаются, A-диск прежний.',
    rigor: '<b>Нет АТФ — окоченение.</b> Головка отцепляется от актина только после того, как к ней присоединится новая молекула АТФ. Без АТФ мостики замирают — мышца каменеет. Так возникает <b>трупное окоченение</b> через несколько часов после смерти.',
  };
  const NTXT = {
    slow: '<b>Сигнал от нерва.</b> В нервно-мышечном синапсе выделяется <b>ацетилхолин</b>; на сарколемме возникает потенциал действия, он бежит в обе стороны и уходит вглубь по <b>T-трубочкам</b> — там он открывает выход Ca²⁺. <b>Медленные (красные) волокна</b>: много митохондрий, миоглобина и капилляров, работают долго — осанка, марафон.',
    fast: '<b>Быстрые (белые) волокна</b>: мало митохондрий и миоглобина, энергия в основном из гликолиза. Сокращаются сильно и быстро, но скоро устают — спринт, прыжок. Соотношение типов волокон у людей разное и отчасти меняется тренировками.',
  };
  const labels = [
    { text: 'сухожилие', pos: V3(XL[0] + 5.2, 0.45, 0), color: TEND, show: () => st.labels && st.mode === 'levels' && st.lv === 0 },
    { text: 'брюшко мышцы', pos: V3(XL[0] - 0.6, 1.55, 0.3), color: '#FF8A94', show: () => st.labels && st.mode === 'levels' && st.lv === 0 },
    { text: 'эпимизий', pos: V3(XL[0] + 2.4, -1.3, 0.6), color: '#F0E8E0', show: () => st.labels && st.mode === 'levels' && st.lv === 0 },
    { text: 'перимизий', pos: V3(XL[1] + 2.0, 1.15, 0.2), color: '#F0E8E0', show: () => st.labels && st.mode === 'levels' && st.lv === 1 },
    { text: 'мышечные волокна', pos: V3(XL[1] - 3.0, 0.1, 0.4), color: '#FF8A94', left: true, show: () => st.labels && st.mode === 'levels' && st.lv === 1 },
    { text: 'сарколемма', pos: V3(XL[2] + 2.2, 1.15, 0.2), color: '#F0D8E0', show: () => st.labels && st.mode === 'levels' && st.lv === 2 },
    { text: 'ядра (по краю)', pos: V3(XL[2] - 1.5, 1.05, 0.5), color: '#B89BFF', show: () => st.labels && st.mode === 'levels' && st.lv === 2 },
    { text: 'миофибриллы', pos: V3(XL[2] - 3.2, 0.2, 0.3), color: '#E8A0A8', left: true, show: () => st.labels && st.mode === 'levels' && st.lv === 2 },
    { text: 'митохондрия', pos: V3(XL[2] + 1.0, -0.6, 0.95), color: '#F2A040', show: () => st.labels && st.mode === 'levels' && st.lv === 2 },
    { text: 'саркомер', pos: V3(XL[3] - 0.6, 0.75, 0.2), color: '#F2C14E', show: () => st.labels && st.mode === 'levels' && st.lv === 3 },
    { text: 'A-диск (тёмный)', pos: V3(XL[3] + 0.05, -0.75, 0.2), color: '#C8566A', show: () => st.labels && st.mode === 'levels' && st.lv === 3 },
    { text: 'I-диск (светлый)', pos: V3(XL[3] + 1.25, 0.75, 0.2), color: '#F0C8C8', show: () => st.labels && st.mode === 'levels' && st.lv === 3 },
    { text: 'Z-линия', pos: () => V3(SX - st.lz, 1.08, 0), color: '#E8E0F0', show: () => st.labels && (st.mode === 'contract' || (st.mode === 'levels' && st.lv === 4)) },
    { text: 'актин (тонкая нить)', pos: () => V3(SX - st.lz + 0.45, -0.9, 0.3), color: '#7FD6FF', show: () => st.labels && (st.mode === 'contract' || (st.mode === 'levels' && st.lv === 4)) },
    { text: 'миозин (толстая нить)', pos: V3(SX + 0.35, 0.72, 0.3), color: '#F2A040', show: () => st.labels && (st.mode === 'contract' || (st.mode === 'levels' && st.lv === 4)) },
    { text: 'H-зона', pos: V3(SX, -1.12, 0), color: '#C8C0D8', show: () => st.labels && (st.mode === 'contract' || (st.mode === 'levels' && st.lv === 4)) && st.lz > 1.1 },
    { text: 'Ca²⁺', pos: V3(SX + 1.05, 0.95, 0.4), color: '#FFE08A', show: () => st.labels && st.mode === 'contract' && caMat.opacity > 0.4 },
    { text: 'двигательный нерв', pos: V3(X3 - 3.3, 3.55, -0.4), color: '#F2D27A', left: true, show: () => st.labels && st.mode === 'nmj' },
    { text: 'синапс (ацетилхолин)', pos: NMJ.clone().add(V3(0.5, 0.3, 0.2)), color: '#F2D27A', show: () => st.labels && st.mode === 'nmj' },
    { text: 'T-трубочки', pos: V3(X3 + 2.6, 1.15, 0.2), color: '#7FB4FF', show: () => st.labels && st.mode === 'nmj' },
    { text: 'капилляр', pos: V3(X3 + 3.2, -1.55, 0.8), color: '#D8485A', show: () => st.labels && st.mode === 'nmj' && st.ftype === 'slow' },
    { text: 'митохондрии', pos: V3(X3 - 2.4, -0.95, 0.9), color: '#F2A040', left: true, show: () => st.labels && st.mode === 'nmj' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'levels' ? LTXT[LV[st.lv].id] : st.mode === 'contract' ? CTXT[st.state] : NTXT[st.ftype]); };
    refs.modeSeg = seg([{ id: 'levels', label: 'От мышцы к саркомеру' }, { id: 'contract', label: 'Сокращение' }, { id: 'nmj', label: 'Нерв и типы волокон' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.lvSeg = refs.stSeg = null;
      if (st.mode === 'levels') { refs.lvSeg = seg(LV.map((l, i) => ({ id: String(i), label: l.name })), () => String(st.lv), (v) => setLv(+v)); box.append(h('div', { class: 'glabel' }, 'Уровень', h('kbd', {}, '← →')), h('div', { class: 'gctl' }, refs.lvSeg)); }
      else if (st.mode === 'contract') { refs.stSeg = seg([{ id: 'rest', label: 'Покой' }, { id: 'contract', label: 'Сокращение' }, { id: 'rigor', label: 'Нет АТФ' }], () => st.state, (v) => setState(v)); box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, refs.stSeg)); }
      else box.append(h('div', { class: 'glabel' }, 'Волокно'), h('div', { class: 'gctl' }, seg([{ id: 'slow', label: 'Медленное (красное)' }, { id: 'fast', label: 'Быстрое (белое)' }], () => st.ftype, (v) => { st.ftype = v; refs.setInfo(); }), button('Импульс', fire, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['levels', 'contract', 'nmj'][n - 1]); return true; }
    if (st.mode === 'levels' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { setLv((st.lv + (e.key === 'ArrowRight' ? 1 : LV.length - 1)) % LV.length); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const SIZE = ['≈ 10–30 см', '≈ 1 мм', '10–100 мкм', '1–2 мкм', '≈ 2,5 мкм'];
  function stats() {
    if (st.mode === 'levels') return [['Уровень', LV[st.lv].name, ''], ['Размер', SIZE[st.lv], '']];
    if (st.mode === 'contract') return [['Длина саркомера', (2 * st.lz).toFixed(1).replace('.', ','), 'мкм'], ['Ca²⁺', st.state === 'rest' ? 'мало' : 'много', ''], ['АТФ', st.state === 'rigor' ? 'нет' : 'есть', '']];
    return [['Волокно', st.ftype === 'slow' ? 'медленное' : 'быстрое', ''], ['Устаёт', st.ftype === 'slow' ? 'медленно' : 'быстро', '']];
  }
  const self = {
    mobZoom: 0.8, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#FF8A94',
    kicker: 'Тело · опора и движение', title: 'Мышца: от органа до саркомера',
    lede: 'Любое движение — от моргания до спринта — это миллиарды крошечных «вёсел» миозина, которые тянут нити актина. Спускаемся от мышцы до саркомера и смотрим, как он сокращается.',
    notes: `
      <div><h2>Строение</h2>
        <p>Мышца → пучки (перимизий) → мышечные волокна (эндомизий) → миофибриллы → саркомеры. Чехлы соединительной ткани переходят в сухожилия. Волокно — многоядерный симпласт; запас ядер пополняют клетки-сателлиты, они же чинят мышцу после нагрузки.</p>
        <h3>Сокращение</h3><p>Нерв → ацетилхолин → потенциал действия по сарколемме и T-трубочкам → выход Ca²⁺ из саркоплазматического ретикулума → Ca²⁺ на тропонине сдвигает тропомиозин → мостики миозина с актином → рабочий ход за счёт АТФ. Расслабление: Ca²⁺ закачивается обратно насосом (тоже за АТФ).</p>
        <h3>Энергия</h3><p>Запаса АТФ хватает на секунды; дальше — креатинфосфат (≈ 10 с), гликолиз (минуты, см. «Гликолиз») и окислительное фосфорилирование в митохондриях (часы, см. «АТФ»).</p>
        <h3>Медицина</h3><p>Миастения — антитела к рецепторам ацетилхолина; курареподобные миорелаксанты при наркозе; судороги при нехватке кальция и магния (см. «Кальций»); мышечные дистрофии — поломки белка дистрофина.</p></div>
      <div><h2>Условности</h2><ul><li>Уровни показаны рядом, а не вложенными; числа волокон и миофибрилл сильно уменьшены, пропорции условны.</li><li>В саркомере — 9 толстых и 24 тонких нити (в жизни их гексагональная решётка из тысяч); тропомиозин, тропонин, титин и небулин не нарисованы.</li><li>Укорочение саркомера (2,5 → 2,0 мкм) и движение головок миозина ускорены.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>←</code> <code>→</code> уровень</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('levels'); st.fly = null;
  return self;
}
