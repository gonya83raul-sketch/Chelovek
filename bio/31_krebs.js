// @scene krebs makeKrebs | Пируватдегидрогеназа и цикл Кребса | Энергия
/* =========================================================
   БИОХИМИЯ · ЦИКЛ ТРИКАРБОНОВЫХ КИСЛОТ: ПДГ-комплекс, 8 реакций,
   НАДН/ФАДН₂/ГТФ/CO₂, регуляция, малонат
   ========================================================= */
const KR = [
  { id: 'citrate', name: 'Цитрат', c: 6, enz: 'Цитратсинтаза', out: [], text: '<b>1. Цитратсинтаза</b> соединяет ацетил-КоА (C2) с оксалоацетатом (C4) — получается шестиуглеродный <b>цитрат</b>, освобождается HS-КоА. Энергию даёт разрыв тиоэфирной связи. Тормозится АТФ, НАДН, сукцинил-КоА и самим цитратом.' },
  { id: 'isocitrate', name: 'Изоцитрат', c: 6, enz: 'Аконитаза', out: ['h2o'], text: '<b>2. Аконитаза</b> через цис-аконитат (отнимает и снова присоединяет воду) переставляет OH-группу: цитрат → <b>изоцитрат</b>. В ферменте — железо-серный кластер. Её блокирует фторцитрат, который образуется из фторацетата (крысиного яда).' },
  { id: 'akg', name: 'α-Кетоглутарат', c: 5, enz: 'Изоцитратдегидрогеназа', out: ['nadh', 'co2'], text: '<b>3. Изоцитратдегидрогеназа</b> окисляет изоцитрат и отщепляет CO₂: получается пятиуглеродный <b>α-кетоглутарат</b> и первый <b>НАДН</b>. Это главный регуляторный фермент цикла: его активируют АДФ и Ca²⁺, тормозят АТФ и НАДН.' },
  { id: 'succoa', name: 'Сукцинил-КоА', c: 4, enz: 'α-Кетоглутаратдегидрогеназа', out: ['nadh', 'co2'], text: '<b>4. α-Кетоглутаратдегидрогеназный комплекс</b> устроен как пируватдегидрогеназа (те же 5 коферментов: ТПФ, липоевая кислота, КоА, ФАД, НАД⁺). Второе окислительное декарбоксилирование: CO₂, <b>НАДН</b> и макроэрг <b>сукцинил-КоА</b>. Блокируется арсенитом.' },
  { id: 'succinate', name: 'Сукцинат', c: 4, enz: 'Сукцинил-КоА-синтетаза', out: ['gtp'], text: '<b>5. Сукцинил-КоА-синтетаза (сукцинилтиокиназа)</b>: энергия тиоэфирной связи идёт на синтез <b>ГТФ</b> из ГДФ и фосфата — это <b>субстратное фосфорилирование</b>. ГТФ отдаёт фосфат на АДФ → АТФ.' },
  { id: 'fumarate', name: 'Фумарат', c: 4, enz: 'Сукцинатдегидрогеназа', out: ['fadh2'], text: '<b>6. Сукцинатдегидрогеназа</b> снимает два атома водорода и передаёт их на <b>ФАД</b> → ФАДН₂; получается <b>фумарат</b> с двойной связью. Единственный фермент цикла, встроенный во внутреннюю мембрану: это <b>комплекс II</b> дыхательной цепи. Его конкурентный ингибитор — <b>малонат</b> (кнопка ниже).' },
  { id: 'malate', name: 'Малат', c: 4, enz: 'Фумараза', out: ['h2o'], text: '<b>7. Фумараза</b> присоединяет воду по двойной связи: фумарат → <b>L-малат</b>.' },
  { id: 'oaa', name: 'Оксалоацетат', c: 4, enz: 'Малатдегидрогеназа', out: ['nadh'], text: '<b>8. Малатдегидрогеназа</b> окисляет малат до <b>оксалоацетата</b> с третьим <b>НАДН</b>. Круг замкнулся: оксалоацетат готов принять следующий ацетил-КоА.' },
];
const KR_TOK = { nadh: ['НАДН', '#FFD070'], fadh2: ['ФАДН₂', '#FFE45A'], gtp: ['ГТФ', '#7FE0A0'], co2: ['CO₂', '#C8C8D0'], h2o: ['H₂O', '#7FD6FF'] };
function makeKrebs() {
  rnd = mulberry(1001);
  const scene = bioStage({ rim: 0x7fd6ff });
  const KX = matchMedia('(max-width:700px)').matches ? -1.2 : -4.3;   // компьютер: митохондрия правее длинного заголовка
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(KX, 0.5, KX < -2 ? 26.5 : 24);
  const controls = makeControls(camera, V3(KX, -2.2, 0)); controls.minDistance = 4; controls.maxDistance = 35;
  const fx = new Sparks(1800, 0.09); scene.add(fx.obj);
  // митохондрия на фоне: оболочка и кристы
  const mito = new THREE.Mesh(new THREE.CapsuleGeometry(4.2, 9.5, 12, 48), glassMat(0xffb070, { rim: 0.2, base: 0.002, pow: 2.4, keep: true })); mito.rotation.z = Math.PI / 2; mito.scale.set(0.95, 0.85, 0.4); mito.position.set(0.5, -0.2, -5.5); scene.add(mito);
  for (let k = 0; k < 7; k++) { const g = new THREE.Mesh(displaceGeo(new THREE.CylinderGeometry(0.5, 0.5, 3.2 - Math.abs(k - 3) * 0.4, 24, 8, true, 0, Math.PI), (v) => { v.x *= 0.35; v.z *= 1.1; v.x += 0.12 * Math.sin(v.y * 2.2 + k); }), new THREE.MeshPhysicalMaterial({ color: 0x8a5a40, roughness: 0.7, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide })); g.position.set(-6.7 + k * 2.2, -0.3 + (k % 2 ? 0.8 : -0.8), -5.5); scene.add(g); }
  const C = V3(1.0, 0.1, 0), R = 3.0;
  const ang = (k) => Math.PI / 2 - 0.42 - k * (Math.PI * 2 / 8);
  const pos = (k, r = R) => V3(C.x + Math.cos(ang(k)) * r, C.y + Math.sin(ang(k)) * r, 0);
  const NODES = KR.map((d, k) => { const m = molMesh(MOL(d.id), { scale: 0.19, hideH: true }); m.position.copy(pos(k)); scene.add(m); return { d, m, k }; });
  // дуги
  const arcs = KR.map((d, k) => { const a0 = ang(k) - 0.2, a1 = ang(k + 1) + 0.2; const pts = []; for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; pts.push(V3(C.x + Math.cos(a) * R, C.y + Math.sin(a) * R, 0)); } const c = new THREE.CatmullRomCurve3(pts); const f = flowTubeMat('#7FD6FF', 0.5, 1.2); scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.045, 6), f)); return { c, f }; });
  // ПДГ-комплекс
  const PDH = new THREE.Group(); PDH.position.set(-5.3, -0.7, 0); scene.add(PDH);
  PDH.add(new THREE.Mesh(blobGeo(1.25, 1.25, 1.25, 51, 0.06, 4), glassMat(0xf2c14e, { rim: 0.35, base: 0.008, keep: true })));
  for (let k = 0; k < 20; k++) { const d = randUnit(); const b = new THREE.Mesh(blobGeo(0.2, 0.2, 0.2, k, 0.12, 3), protMat(k % 3 === 0 ? '#FF8A5C' : k % 3 === 1 ? '#7FE0A0' : '#7FD6FF', 0.3)); b.position.copy(d.multiplyScalar(0.85)); PDH.add(b); }
  const pdhPick = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); pdhPick.userData.pick = 'pdh'; PDH.add(pdhPick);
  const pyr = molMesh(MOL('pyruvate'), { scale: 0.2, hideH: true }); scene.add(pyr);
  const acetyl = molMesh(MOL('acetyl'), { scale: 0.2, hideH: true }); scene.add(acetyl);
  const pdhA = flowArrow(scene, V3(-4.0, -0.4, 0), pos(0, R + 0.2).add(V3(-0.9, 0.5, 0)), '#F2C14E', { bend: -0.25, r: 0.03 });
  // жетоны продуктов
  const tokMat = {}; Object.entries(KR_TOK).forEach(([k, [, c]]) => { tokMat[k] = new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true }); });
  const toks = []; const tokPos = { nadh: V3(), fadh2: V3(), gtp: V3() }; // подписи следуют за последним жетоном
  function token(kind, p0, dir) { const m = kind === 'co2' ? molMesh(MOL('co2'), { scale: 0.2 }) : kind === 'h2o' ? molMesh(MOL('h2o'), { scale: 0.22 }) : new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), tokMat[kind]); m.position.copy(p0); scene.add(m); toks.push({ m, kind, v: dir, age: 0 }); return m; }
  const ETC = V3(7.4, -1.0, 0);
  const etcBar = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 2.9, 8, 20), new THREE.MeshPhysicalMaterial({ color: 0x8a5a40, emissive: 0xffb070, emissiveIntensity: 0.15, roughness: 0.5, transparent: true, opacity: 0.75 })); etcBar.position.copy(ETC); scene.add(etcBar);
  const piles = []; for (let k = 0; k < 6; k++) { const m = molMesh(MOL('succinate'), { scale: 0.11, hideH: true }); m.visible = false; scene.add(m); piles.push(m); }
  const malon = molMesh(MOL('malonate'), { scale: 0.16, hideH: true, tint: '#FF6A6A' }); malon.visible = false; scene.add(malon);
  const pick = NODES.map((n) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); s.position.copy(n.m.position); s.userData.pick = n.d.id; scene.add(s); return s; }).concat([pdhPick]);
  const st = { t: 0, ph: 0, speed: 1, reg: 'norm', malonate: false, labels: true, rot: false, sel: null, msg: null, nadh: 0, fadh2: 0, gtp: 0, co2: 0, turns: 0, step: -1 };
  pickOn(() => self, camera, () => pick, (id) => { st.sel = id; refs.setInfo(); refs.stepSeg && refs.stepSeg.sync(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    const sp = st.reg === 'atp' ? 0.35 : st.reg === 'ca' ? 1.8 : 1;
    const blocked = st.malonate;
    // фаза: 0..8 (шаги), шаг 4→5 (сукцинат → фумарат) блокируется малонатом
    const prev = Math.floor(st.ph);
    if (!(blocked && st.ph >= 4.55 && st.ph < 5)) st.ph += dt * 0.55 * sp;
    if (st.ph >= 8) { st.ph -= 8; st.turns++; }
    const cur = Math.floor(st.ph), u = st.ph - cur;
    if (cur !== prev) {
      const k = cur; const d = KR[k]; const p = NODES[k].m.position.clone();
      d.out.forEach((kind, j) => {
        const outw = p.clone().sub(C).normalize();
        const dir = kind === 'co2' ? outw.clone().add(V3(0, 0.8, 0.3)).normalize().multiplyScalar(1.4) : kind === 'h2o' ? outw.clone().multiplyScalar(-0.6) : ETC.clone().sub(p).normalize().multiplyScalar(2.2);
        token(kind, p.clone().addScaledVector(outw, 0.6 + j * 0.3), dir); if (kind in st) st[kind]++;
      });
      if (k === 0) { /* новый ацетил-КоА вошёл */ }
    }
    st.step = cur;
    NODES.forEach((n, k) => { const on = k === cur; n.m.rotation.y += dt * (on ? 1.2 : 0.3); const s = on ? 1.35 : 1; n.m.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); molGlow(n.m, on ? 0.18 : 0); });
    arcs.forEach((a, k) => { a.f.uniforms.uTime.value = t; a.f.uniforms.uOn.value = k === cur ? 1 : 0.25; a.f.uniforms.uSpeed.value = 0.5 * sp; });
    pdhA.mat.uniforms.uTime.value = t;
    // пируват → ПДГ → ацетил-КоА (перед шагом 0)
    const pu = (st.ph + 1.5) % 8 / 1.5;
    if (pu < 1) { pyr.visible = true; acetyl.visible = false; pyr.position.copy(V3(-7.8, -2.6, 0).lerp(V3(-5.3, -0.7, 0), smooth(0, 1, pu))); }
    else if (pu < 2) { pyr.visible = false; acetyl.visible = true; acetyl.position.copy(pdhA.curve.getPoint(smooth(0, 1, pu - 1))); if (pu < 1.05 && rnd() < 0.5) { token('co2', V3(-5.3, 0.6, 0), V3(-0.2, 1.2, 0.3)); token('nadh', V3(-4.6, -1.6, 0), ETC.clone().sub(V3(-4.6, -1.6, 0)).normalize().multiplyScalar(3.2)); } }
    else { pyr.visible = acetyl.visible = false; }
    [pyr, acetyl].forEach((m) => { m.rotation.y += dt; });
    PDH.rotation.y += dt * 0.15;
    // жетоны
    for (let i = toks.length - 1; i >= 0; i--) { const q = toks[i]; q.age += dt; q.m.position.addScaledVector(q.v, dt); if (tokPos[q.kind]) tokPos[q.kind].copy(q.m.position).add(V3(0.18, 0.2, 0)); if (q.kind === 'co2' || q.kind === 'h2o') q.m.rotation.y += dt * 2; if (q.kind !== 'co2' && q.kind !== 'h2o' && q.m.position.distanceTo(ETC) < 0.5) { for (let k = 0; k < 10; k++) fx.spawn(q.m.position.clone(), randUnit().multiplyScalar(0.5), new THREE.Color(KR_TOK[q.kind][1]), 0.6, 2, 1.3); q.age = 99; } if (q.age > 3.2) { scene.remove(q.m); toks.splice(i, 1); } }
    // малонат: копится сукцинат
    malon.visible = blocked; if (blocked) { malon.position.copy(pos(4, R - 1.0)); malon.rotation.y += dt; }
    piles.forEach((m, k) => { m.visible = blocked; if (blocked) { const a = ang(4) + (k - 2.5) * 0.12; m.position.set(C.x + Math.cos(a) * (R + 0.9 + (k % 2) * 0.4), C.y + Math.sin(a) * (R + 0.9 + (k % 2) * 0.4), 0.2); m.rotation.y += dt * 0.5; } });
    etcBar.material.emissiveIntensity = 0.1 + 0.08 * Math.sin(t * 3);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    ctx.clearRect(0, 0, w, h); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('выход за 1 оборот (на ацетил-КоА)', 8, 12);
    const rows = [['3 НАДН', 9, 7.5, '#FFD070'], ['1 ФАДН₂', 2, 1.5, '#FFE45A'], ['1 ГТФ', 1, 1, '#7FE0A0']];
    let x0 = 8, y = 22; const W = w - 16;
    rows.forEach(([n, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x0, y, W * a / 12, 18); ctx.globalAlpha = 1; ctx.fillStyle = '#120F0B'; ctx.font = '600 9px JetBrains Mono, monospace'; if (W * a / 12 > 40) ctx.fillText(n, x0 + 4, y + 12); x0 += W * a / 12; });
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('по учебнику (P/O = 3 и 2): 9 + 2 + 1 = 12 АТФ', 8, y + 32);
    x0 = 8; y += 42; rows.forEach(([, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.55; ctx.fillRect(x0, y, W * b / 12, 12); ctx.globalAlpha = 1; x0 += W * b / 12; });
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText('по современным данным (2,5 и 1,5): ≈ 10 АТФ', 8, y + 24);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText(`с начала: ${st.turns} оборотов · ${st.co2} CO₂`, 8, h - 6);
  }
  const TXT = '<b>Цикл трикарбоновых кислот</b> (цикл Кребса, цитратный цикл) в матриксе митохондрий — «котёл», где сгорают остатки всех видов топлива. Ацетил-КоА (C2) соединяется с оксалоацетатом (C4) в цитрат (C6); за оборот уходят <b>2 CO₂</b>, образуются <b>3 НАДН, 1 ФАДН₂ и 1 ГТФ</b>, а оксалоацетат возвращается. Восстановленные коферменты (золотые шарики) летят в дыхательную цепь (справа). Слева — <b>пируватдегидрогеназный комплекс</b>, превращающий пируват в ацетил-КоА. Нажмите на молекулу или комплекс.';
  const PDHT = '<b>Пируватдегидрогеназный комплекс</b> — гигантский ансамбль (больше рибосомы) из трёх ферментов: E1 (декарбоксилаза, кофермент <b>ТПФ</b> — витамин B1), E2 (трансацетилаза, <b>липоевая кислота</b> и <b>КоА</b> — B5), E3 (дегидрогеназа, <b>ФАД</b> — B2 и <b>НАД⁺</b> — PP). Пируват + НАД⁺ + HS-КоА → ацетил-КоА + CO₂ + НАДН. Реакция необратима: из ацетил-КоА глюкозу уже не получить. Тормозится АТФ, ацетил-КоА, НАДН; при дефиците B1 (алкоголизм) пируват и лактат копятся в крови.';
  const labels = [
    ...NODES.map((n) => ({ text: `${n.d.name} · C${n.d.c}`, pos: n.m.position.clone().add(pos(n.k, R + 1.0).sub(n.m.position).multiplyScalar(0.9)).add(V3(-0.4, 0, 0)), color: '#EFEAE6', show: () => st.labels })),
    ...KR.map((d, k) => ({ text: KR[(k + 1) % 8].enz, pos: V3(C.x + Math.cos(ang(k) - 0.39) * (R - 1.15), C.y + Math.sin(ang(k) - 0.39) * (R - 1.15), 0.3).add(V3(-0.55, 0, 0)), color: '#7FD6FF', show: () => st.labels && st.step === k })),
    { text: 'пируватдегидрогеназа', pos: V3(-6.6, -2.2, 0), color: '#F2C14E', show: () => st.labels },
    { text: 'пируват', pos: V3(-8.2, -3.2, 0), color: '#FF8A5C', show: () => st.labels },
    { text: 'в дыхательную цепь', pos: ETC.clone().add(V3(-0.9, 1.95, 0)), color: '#FFB070', show: () => st.labels },
    ...['nadh', 'fadh2', 'gtp'].map((kind) => ({ text: KR_TOK[kind][0], pos: tokPos[kind], color: KR_TOK[kind][1], show: () => st.labels && toks.some((q) => q.kind === kind && q.age < 3) })),
    { text: 'малонат блокирует', pos: pos(4, R - 1.0).add(V3(0.3, -0.4, 0)), color: '#FF6A6A', show: () => st.labels && st.malonate },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const d = KR.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.sel === 'pdh' ? PDHT : d ? d.text : TXT); };
    refs.stepSeg = seg(KR.map((d, k) => ({ id: d.id, label: String(k + 1) })).concat([{ id: 'pdh', label: 'ПДГ' }]), () => st.sel, (v) => { st.sel = st.sel === v ? null : v; refs.stepSeg.sync(); refs.setInfo(); });
    const regSeg = seg([{ id: 'norm', label: 'Норма' }, { id: 'atp', label: 'Много АТФ и НАДН', color: '#FF6A6A' }, { id: 'ca', label: 'Нагрузка: Ca²⁺, АДФ', color: '#7FE0A0' }], () => st.reg, (v) => { st.reg = v; st.msg = v === 'atp' ? '<b>Энергии достаточно.</b> АТФ и НАДН тормозят цитратсинтазу, изоцитратдегидрогеназу и α-кетоглутаратдегидрогеназу — цикл замедляется. Главный регулятор — соотношение НАДН/НАД⁺.' : v === 'ca' ? '<b>Работа мышцы.</b> Ca²⁺ (сигнал сокращения) и АДФ (сигнал траты энергии) активируют изоцитратдегидрогеназу и α-кетоглутаратдегидрогеназу — цикл ускоряется в разы.' : null; refs.setInfo(); });
    const mal = toggle('Малонат', () => st.malonate, (v) => { st.malonate = v; st.msg = v ? '<b>Малонат</b> — HOOC–CH₂–COOH — похож на сукцинат, но короче на один углерод. Он занимает активный центр сукцинатдегидрогеназы, не превращаясь (конкурентное ингибирование). Цикл останавливается, <b>сукцинат накапливается</b> — классическая задача из учебника.' : null; refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, mal });
    el.append(group('Реакция', 'клик', refs.stepSeg), group('Регуляция', 'M', regSeg, mal), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'm' || k === 'ь') { refs.mal.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Реакция', st.step >= 0 ? `${(st.step + 1) % 8 + 1} из 8` : '', ''], ['НАДН', st.nadh, ''], ['ФАДН₂', st.fadh2, ''], ['ГТФ', st.gtp, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Биохимия · общий путь катаболизма', title: 'Пируватдегидрогеназа и цикл Кребса',
    lede: 'Восемь реакций в матриксе митохондрии разбирают «активную уксусную кислоту» на два CO₂ и снимают с неё водород для дыхательной цепи.',
    notes: `
      <div><h2>Итог цикла</h2>
        <p>Ацетил-КоА + 3 НАД⁺ + ФАД + ГДФ + Фн + 2 H₂O → 2 CO₂ + 3 НАДН + ФАДН₂ + ГТФ + HS-КоА.</p>
        <p>Восемь атомов водорода (4 пары) уходят в дыхательную цепь и превращаются в воду, их энергия — в АТФ. Сам цикл кислород не использует, но без кислорода он останавливается: НАД⁺ и ФАД не возвращаются.</p>
        <h3>Цикл — перекрёсток</h3>
        <p>Цикл <b>амфиболический</b>: его вещества уходят на синтез (цитрат → жирные кислоты и холестерин, α-кетоглутарат → глутамат, сукцинил-КоА → гем, оксалоацетат → аспартат и глюкоза). Убыль пополняют <b>анаплеротические</b> реакции, главная — пируваткарбоксилаза (с биотином): пируват + CO₂ → оксалоацетат.</p></div>
      <div><h2>Энергия</h2><p>По учебнику (P/O = 3 для НАДН и 2 для ФАДН₂) окисление 1 ацетил-КоА даёт 12 АТФ, глюкозы — 38 АТФ. Современные измерения дают ≈ 2,5 и 1,5 АТФ — то есть около 10 АТФ на оборот и 30–32 на глюкозу.</p>
        <h2 style="margin-top:18px">Условности и модели</h2><ul><li>Молекулы — по формулам; у сукцинил-КоА и ацетил-КоА вместо коэнзима А показан короткий фрагмент (S-метил).</li><li>ПДГ-комплекс и митохондрия — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>M</code> малонат</li><li>клик по молекуле — реакция</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
