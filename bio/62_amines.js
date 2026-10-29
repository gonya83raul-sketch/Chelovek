// @scene amines makeAmines | Биогенные амины, глицин и серин | Белки и аминокислоты
/* =========================================================
   БИОХИМИЯ · ДЕКАРБОКСИЛИРОВАНИЕ АМИНОКИСЛОТ: гистамин, серотонин, мелатонин, дофамин, норадреналин,
   адреналин, ГАМК; где действуют и как разрушаются (МАО, КОМТ); глицин, серин и одноуглеродные фрагменты (фолат, B12)
   ========================================================= */
function makeAmines() {
  rnd = mulberry(6201);
  const scene = bioStage({ rim: 0x9fe870 });
  const VIEW = { decarb: [V3(1.4, -0.35, 0), V3(2.0, 1.6, 19.5)], fate: [V3(41.2, -0.2, 0), V3(41.8, 1.6, 17.5)], onec: [V3(81.0, -1.6, 0), V3(81.6, 0.3, 18.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.decarb[1]);
  const controls = makeControls(camera, VIEW.decarb[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };

  /* ---------- 1. декарбоксилирование ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const XS = [-1.0, 1.45, 3.9, 6.35, 8.8];
  // телефон: выбранный путь столбиком сверху вниз (ряд из пяти молекул по ширине не помещается); остальные пути скрыты
  const MOB = matchMedia('(max-width:700px)').matches;
  const NP = (r, i) => (MOB ? V3(0, 2.8 - i * 1.6, 0) : V3(XS[i], r.y, 0)), MP = (r, i) => NP(r, i).lerp(NP(r, i + 1), 0.5);
  const ROWS = [
    { id: 'his', col: '#FF8AB0', y: 2.25, chain: [['his', 'гистидин'], ['histamine', 'гистамин']], dec: [0], name: 'Гистамин' },
    { id: 'ser', col: '#7FD6FF', y: 0.95, chain: [['trp', 'триптофан'], ['htp', '5-гидрокситриптофан'], ['serotonin', 'серотонин'], ['melatonin', 'мелатонин']], dec: [1], name: 'Серотонин и мелатонин' },
    { id: 'cat', col: '#F2C14E', y: -0.35, chain: [['tyr', 'тирозин'], ['dopa', 'ДОФА'], ['dopamine', 'дофамин'], ['noradrenaline', 'норадреналин'], ['adrenaline', 'адреналин']], dec: [1], name: 'Катехоламины' },
    { id: 'gaba', col: '#7FE0A0', y: -1.65, chain: [['glu', 'глутамат'], ['gaba', 'ГАМК']], dec: [0], name: 'ГАМК' },
  ];
  const STEPN = { his: ['гистидиндекарбоксилаза'], ser: ['гидроксилаза', 'декарбоксилаза', 'в эпифизе, ночью'], cat: ['тирозингидроксилаза', 'декарбоксилаза', 'гидроксилаза (вит. C)', 'метилирование (SAM)'], gaba: ['глутаматдекарбоксилаза'] };
  ROWS.forEach((r) => {
    r.nodes = r.chain.map(([id], i) => { const g = fit(id, MOB ? 0.85 : 0.78); g.position.copy(NP(r, i)); G1.add(g); return g; });
    r.arr = r.chain.slice(1).map((_, i) => flowArrow(G1, NP(r, i).lerp(NP(r, i + 1), 0.3), NP(r, i).lerp(NP(r, i + 1), 0.7), r.col, { bend: 0.12, r: 0.02 }));
    r.b6 = r.dec.map((i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xff9a30).multiplyScalar(0.6), emissive: 0xff9a30, emissiveIntensity: 0.2, roughness: 0.3 })); m.position.copy(MP(r, i)).add(MOB ? V3(0.3, 0, 0.2) : V3(0, 0.3, 0.2)); G1.add(m); return m; });
  });

  /* ---------- 2. где действуют и как разрушаются ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.16 });
  const SITE = {
    brain: { p: V3(0, 4.25, 0.1), col: '#9F7BFF', r: 0.06 }, pineal: { p: V3(0, 4.15, -0.12), col: '#7FD6FF', r: 0.045 }, adrenal: { p: V3(0.42, 1.3, -0.25), col: '#F2C14E', r: 0.06 },
    lungs: { p: V3(-0.45, 2.3, 0.05), col: '#FF8AB0', r: 0.08 }, skin: { p: V3(1.25, 1.6, 0.15), col: '#FF8AB0', r: 0.06 }, gut: { p: V3(0.0, 0.55, 0.3), col: '#7FD6FF', r: 0.08 }, heart: { p: BODY.heart.clone(), col: '#FF6A5A', r: 0.07 },
  };
  Object.values(SITE).forEach((s) => { s.g = glowNucleus(G2, s.p, s.col, s.r, 9); s.g.spr.material.opacity = 0.25; });
  const heartM = new THREE.Mesh(ell3(0.22, 0.27, 0.2, BODY.heart), organMat('#C84A50', 0.45)); G2.add(heartM);
  // распад: МАО и КОМТ
  const OUT = [
    { from: 'dopamine', to: 'hva', y: 3.2, col: '#F2C14E', enz: 'МАО + КОМТ' }, { from: 'serotonin', to: 'hiaa', y: 2.0, col: '#7FD6FF', enz: 'МАО' }, { from: 'adrenaline', to: 'vma', y: 0.8, col: '#F2C14E', enz: 'КОМТ + МАО' },
  ];
  OUT.forEach((o) => { o.a = fit(o.from, 0.36); o.a.position.set(2.4, o.y, 0); G2.add(o.a); o.b = fit(o.to, 0.36); o.b.position.set(4.4, o.y, 0); G2.add(o.b); o.f = flowArrow(G2, V3(2.85, o.y, 0), V3(3.95, o.y, 0), o.col, { bend: 0.2, r: 0.02 }); o.glow = glowNucleus(G2, V3(2.4, o.y, -0.2), '#FF6A5A', 0.08, 10); o.glow.core.visible = false; o.glow.spr.material.opacity = 0; });

  /* ---------- 3. глицин, серин, фолат ---------- */
  const G3 = new THREE.Group(); G3.position.set(80.8, 0, 0); scene.add(G3);
  const RC = V3(0.6, 0.7, 0), RR = 1.6;
  const FN = [['thf', 'ТГФ', 90], ['ch2', 'N⁵,N¹⁰-метилен-ТГФ', 330], ['ch3', 'N⁵-метил-ТГФ', 240], ['cho', 'N¹⁰-формил-ТГФ', 30], ['dhf', 'ДГФ', 165]].map(([id, name, ang]) => { const a = ang * Math.PI / 180; const p = RC.clone().add(V3(Math.cos(a) * RR * 1.35, Math.sin(a) * RR, 0)); const g = fit('folate', 0.55, { tint: id === 'dhf' ? '#C8C8D0' : '#F2C14E' }); g.position.copy(p); G3.add(g); return { id, name, p, g, glow: glowNucleus(G3, p.clone().add(V3(0, 0, -0.3)), '#FF6A5A', 0.08, 12) }; });
  FN.forEach((n) => { n.glow.core.visible = false; n.glow.spr.material.opacity = 0; });
  const F = Object.fromEntries(FN.map((n) => [n.id, n]));
  const FA = {
    shmt: flowArrow(G3, F.thf.p.clone().add(V3(0.45, -0.25, 0)), F.ch2.p.clone().add(V3(0.1, 0.5, 0)), '#7FE0A0', { bend: -0.3, r: 0.018 }),
    mthfr: flowArrow(G3, F.ch2.p.clone().add(V3(-0.4, -0.35, 0)), F.ch3.p.clone().add(V3(0.45, -0.1, 0)), '#C77DFF', { bend: -0.2 }),
    ms: flowArrow(G3, F.ch3.p.clone().add(V3(-0.45, 0.35, 0)), F.thf.p.clone().add(V3(-0.5, -0.3, 0)), '#FF8AB0', { bend: -0.35 }),
    ts: flowArrow(G3, F.ch2.p.clone().add(V3(-0.5, 0.05, 0)), F.dhf.p.clone().add(V3(0.5, 0.0, 0)), '#7FD6FF', { bend: 0.25 }),
    dhfr: flowArrow(G3, F.dhf.p.clone().add(V3(0.15, 0.5, 0)), F.thf.p.clone().add(V3(-0.5, 0.0, 0)), '#F2C14E', { bend: 0.3 }),
    fmt: flowArrow(G3, F.thf.p.clone().add(V3(0.5, 0.1, 0)), F.cho.p.clone().add(V3(-0.2, 0.45, 0)), '#FF9A5C', { bend: -0.3 }),
  };
  const ser = fit('ser', 0.38); ser.position.set(3.9, 2.3, 0); G3.add(ser); const gly = fit('gly', 0.32); gly.position.set(5.0, 1.3, 0); G3.add(gly);
  const fSer = flowArrow(G3, V3(4.2, 2.0, 0), V3(4.85, 1.6, 0), '#7FE0A0', { bend: -0.2, r: 0.02 });
  const OUTS = { dna: { id: 'thymine', p: V3(-3.3, 0.3, 0), name: 'тимидилат → ДНК' }, pur: { id: 'adenine', p: V3(4.6, -0.6, 0), name: 'пурины' }, met: { id: 'met', p: V3(-1.4, -1.8, 0), name: 'метионин → SAM' } };
  Object.values(OUTS).forEach((o) => { o.g = fit(o.id, 0.38); o.g.position.copy(o.p); G3.add(o.g); });
  const hcy = fit('hcy', 0.32); hcy.position.set(-3.2, -1.6, 0); G3.add(hcy);
  const fOut = { dna: flowArrow(G3, F.dhf.p.clone().lerp(F.ch2.p, 0.5).add(V3(-0.5, 0.0, 0)), OUTS.dna.p.clone().add(V3(0.45, 0.1, 0)), '#7FD6FF', { bend: 0.2, r: 0.02 }), pur: flowArrow(G3, F.cho.p.clone().add(V3(0.3, -0.45, 0)), OUTS.pur.p.clone().add(V3(-0.35, 0.35, 0)), '#FF9A5C', { bend: 0.2, r: 0.02 }), met: flowArrow(G3, hcy.position.clone().add(V3(0.45, 0, 0)), OUTS.met.p.clone().add(V3(-0.45, 0, 0)), '#FF8AB0', { bend: 0.25, r: 0.02 }) };
  const mtx = fit('methotrexate', 0.45); mtx.position.copy(F.dhf.p).add(V3(-0.2, 1.25, 0.3)); G3.add(mtx); mtx.visible = false;
  const b12 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xf08ac0, emissive: 0xf08ac0, emissiveIntensity: 0.4 })); b12.position.copy(F.ch3.p.clone().lerp(F.thf.p, 0.5)).add(V3(-0.95, 0.15, 0.2)); G3.add(b12);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'decarb', labels: true, rot: false, fly: null, msg: null, row: 'cat', sit: 'calm', mao: false, b6: true, onec: 'norm', lvl: {} };
  const rowView = () => { const n = ROWS.find((x) => x.id === st.row).chain.length, cy = 2.8 - (n - 1) * 0.8; return flyTarget(V3(0.9, cy, 0), V3(1.0, cy + 0.5, n > 3 ? 9.8 : n > 2 ? 7.8 : 6)); };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['decarb', 'fate', 'onec'][k] === m; }); st.fly = MOB && m === 'decarb' ? rowView() : flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const C = new THREE.Color();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'decarb') {
      ROWS.forEach((r) => {
        const on = r.id === st.row;
        if (MOB) { r.nodes.forEach((g) => { g.visible = on; }); r.arr.forEach((a) => { a.mesh.visible = on; if (a.cone) a.cone.visible = on; }); }
        r.nodes.forEach((g, i) => { g.rotation.y += dt * (on ? 0.6 : 0.15); g.scale.setScalar(on ? 1.1 : 0.85); });
        r.arr.forEach((a, i) => { a.mat.uniforms.uTime.value = t; const isDec = r.dec.includes(i); a.mat.uniforms.uOn.value = on ? (isDec && !st.b6 ? 0.06 : 1.0) : 0.15; if (on && isDec && st.b6 && rnd() < 0.15) fx.spawn(MP(r, i).add(V3(0, 0.1, 0.2)), V3(rand(-0.1, 0.1), 0.7, 0.2), C.set('#C8C8D0'), 0.9, 0.5, 1.1); });
        r.b6.forEach((m) => { m.visible = st.b6 && (on || !MOB); m.material.emissiveIntensity = on ? 0.3 + 0.15 * Math.sin(t * 5) : 0.08; });
      });
    }
    if (st.mode === 'fate') {
      const S = st.sit, mao = st.mao ? 2.2 : 1;
      const tgt = { brain: S === 'mood' ? 1 : S === 'sleep' ? 0.6 : 0.3, pineal: S === 'night' ? 1 : 0.1, adrenal: S === 'stress' ? 1 : 0.15, lungs: S === 'allergy' ? 1 : 0.1, skin: S === 'allergy' ? 1 : 0.1, gut: S === 'calm' ? 0.6 : 0.35, heart: S === 'stress' ? 1 : 0.25 };
      Object.entries(SITE).forEach(([k, s]) => { const v = clamp(tgt[k] * (k === 'brain' ? mao : 1), 0, 1.6); st.lvl[k] = (st.lvl[k] || 0) + (v - (st.lvl[k] || 0)) * dt * 2; const L = st.lvl[k]; s.g.spr.material.opacity = 0.15 + 0.6 * clamp(L, 0, 1); s.g.spr.scale.setScalar(s.r * (6 + 10 * L) * (1 + 0.08 * Math.sin(t * 5))); if (L > 0.6 && rnd() < 0.15 * L) fx.spawn(s.p.clone().add(G2.position), randUnit().multiplyScalar(0.35), C.set(s.col), 0.9, 0.6, 1.2); });
      const hr = S === 'stress' ? 120 : 70; st.hr = hr; heartM.scale.setScalar(1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 2 * hr / 60)) ** 6);
      OUT.forEach((o, i) => { o.f.mat.uniforms.uTime.value = t; o.f.mat.uniforms.uOn.value = st.mao && o.enz.includes('МАО') ? (o.enz.startsWith('МАО') ? 0.05 : 0.35) : 0.9; const acc = st.mao ? 1 : 0; o.glow.spr.material.opacity += ((acc * 0.6) - o.glow.spr.material.opacity) * dt * 2; o.glow.spr.scale.setScalar(0.9 + 0.2 * Math.sin(t * 4 + i)); o.a.rotation.y += dt * 0.5; o.b.rotation.y += dt * 0.4; });
    }
    if (st.mode === 'onec') {
      const fol = st.onec !== 'folate', b12ok = st.onec !== 'b12', mtxOn = st.onec === 'mtx';
      const on = { shmt: fol ? 0.6 : 0.12, mthfr: fol ? 0.5 : 0.1, ms: b12ok && fol ? 0.55 : 0.03, ts: fol ? 0.55 : 0.1, dhfr: mtxOn ? 0.03 : fol ? 0.55 : 0.12, fmt: fol ? 0.5 : 0.1 };
      Object.entries(FA).forEach(([k, a]) => { a.mat.uniforms.uTime.value = t; a.mat.uniforms.uOn.value = on[k] * (k === 'ms' || k === 'mthfr' ? 1 : b12ok ? 1 : 0.35); });
      fSer.mat.uniforms.uTime.value = t; fSer.mat.uniforms.uOn.value = on.shmt;
      const ok = !mtxOn && fol && b12ok;
      fOut.dna.mat.uniforms.uOn.value = ok ? 0.55 : 0.04; fOut.pur.mat.uniforms.uOn.value = ok ? 0.5 : 0.04; fOut.met.mat.uniforms.uOn.value = b12ok && fol ? 0.5 : 0.04; Object.values(fOut).forEach((a) => { a.mat.uniforms.uTime.value = t; });
      const acc = { ch3: st.onec === 'b12' ? 1 : 0, dhf: mtxOn ? 1 : 0 }; FN.forEach((n) => { const v = acc[n.id] || 0; n.glow.spr.material.opacity += (v * 0.6 - n.glow.spr.material.opacity) * dt * 2; n.glow.spr.scale.setScalar(1.1 + 0.15 * Math.sin(t * 4)); n.g.rotation.y += dt * 0.3; });
      mtx.visible = mtxOn; mtx.rotation.y += dt; b12.visible = b12ok; FN.forEach((n) => { n.g.visible = fol || n.id === 'dhf'; });
      [ser, gly, hcy, ...Object.values(OUTS).map((o) => o.g)].forEach((g, i) => { g.rotation.y += dt * (0.3 + 0.05 * i); });
      st.dnaOK = ok;
    }
    fx.update(dt);
  }
  const ROWTXT = {
    his: '<b>Гистамин</b> образуется из гистидина в <b>тучных клетках</b> и базофилах и хранится в гранулах. При аллергии и воспалении выбрасывается: расширяет капилляры и повышает их проницаемость (отёк, покраснение, крапивница), сокращает бронхи (H₁-рецепторы), усиливает выделение соляной кислоты в желудке (H₂). Антигистаминные препараты блокируют H₁-рецепторы, блокаторы H₂ — снижают кислотность.',
    ser: '<b>Серотонин</b>: триптофан → 5-гидрокситриптофан → серотонин. Около 90% серотонина делают энтерохромаффинные клетки кишечника (моторика), остальное — нейроны ствола мозга (настроение, сон, аппетит, боль) и тромбоциты, которые его переносят. В эпифизе ночью серотонин превращается в <b>мелатонин</b> — гормон темноты, задающий суточный ритм. Антидепрессанты СИОЗС задерживают серотонин в синапсах.',
    cat: '<b>Катехоламины</b>: тирозин → ДОФА (тирозингидроксилаза, ключевой фермент) → <b>дофамин</b> → <b>норадреналин</b> (нужен витамин C) → <b>адреналин</b> (метилирование, в мозговом веществе надпочечников). Дофамин — медиатор движений и мотивации (при болезни Паркинсона гибнут дофаминовые нейроны, лечат L-ДОФА — она проходит в мозг, а дофамин нет); норадреналин — медиатор симпатических нервов; адреналин — гормон стресса.',
    gaba: '<b>ГАМК</b> (γ-аминомасляная кислота) образуется из глутамата — главного возбуждающего медиатора — и сама служит главным <b>тормозным</b> медиатором мозга. Снотворные и успокаивающие (бензодиазепины, барбитураты) и алкоголь усиливают действие ГАМК на рецепторы. При дефиците витамина B6 у младенцев возможны судороги — не хватает ГАМК.',
  };
  const TXT = {
    decarb: '<b>Биогенные амины</b> получаются при <b>декарбоксилировании</b> аминокислот — отщеплении CO₂ (серые искры). Ферменты-декарбоксилазы работают с коферментом <b>пиридоксальфосфатом</b> (витамин B6, оранжевые шарики). Амины действуют в очень малых количествах как медиаторы нервной системы и гормоны. Выберите путь.',
    fate: '<b>Где работают амины.</b> Мозг — дофамин, серотонин, ГАМК, норадреналин; эпифиз — мелатонин; надпочечники — адреналин; тучные клетки лёгких и кожи — гистамин; кишечник — серотонин. Действие короткое: амины быстро обратно захватываются нервными окончаниями и разрушаются <b>моноаминоксидазой</b> (МАО, окислительное дезаминирование: + H₂O₂ и NH₃) и <b>катехол-О-метилтрансферазой</b> (КОМТ). Продукты распада выводятся с мочой — по ним судят о выработке аминов (ванилилминдальная кислота повышена при опухоли надпочечника — феохромоцитоме).',
    onec: '<b>Глицин, серин и одноуглеродные фрагменты.</b> Серин отдаёт свой CH₂OH-углерод <b>тетрагидрофолату</b> (ТГФ, активная форма витамина B9) и превращается в глицин. Получившийся метилен-ТГФ нужен для синтеза <b>тимидилата</b> (без него не построить ДНК), формил-ТГФ — для <b>пуринов</b>, метил-ТГФ вместе с витамином <b>B12</b> превращает гомоцистеин в <b>метионин</b>, а из него получается главный донор метильных групп SAM. Глицин сам по себе — тормозный медиатор спинного мозга и строительный блок гема, креатина, глутатиона, коллагена (каждая третья аминокислота). Включайте дефициты.',
  };
  const SIT = { calm: 'Покой', mood: 'Настроение', night: 'Ночь', stress: 'Стресс', allergy: 'Аллергия', sleep: 'Снотворное' };
  const SITTXT = { calm: TXT.fate, mood: '<b>Настроение и мотивация.</b> Дофамин — сигнал «награды» и желания действовать, серотонин — спокойствия и удовлетворения, норадреналин — бодрости и внимания. При депрессии эти системы работают слабее; антидепрессанты увеличивают концентрацию аминов в синапсах.', night: '<b>Ночь.</b> Когда свет перестаёт попадать на сетчатку, эпифиз из серотонина синтезирует <b>мелатонин</b> — его уровень растёт в 10 раз. Мелатонин сообщает организму «сейчас ночь»: снижается температура, хочется спать. Яркий свет экранов вечером тормозит его выработку.', stress: '<b>Стресс.</b> Симпатическая система за секунды выбрасывает <b>норадреналин</b>, мозговое вещество надпочечников — <b>адреналин</b>: учащается пульс, растёт давление, расширяются бронхи и зрачки, печень отдаёт глюкозу — реакция «бей или беги».', allergy: '<b>Аллергия.</b> Антиген связывается с IgE на тучных клетках — они высвобождают <b>гистамин</b>: зуд, крапивница, насморк, спазм бронхов; в тяжёлом случае — анафилактический шок. Помогают антигистаминные препараты, при анафилаксии — адреналин.', sleep: '<b>Снотворные и успокаивающие</b> (бензодиазепины) усиливают действие <b>ГАМК</b> на её рецепторы — хлорный канал открывается чаще, нейроны тормозятся. Алкоголь действует похоже, поэтому их сочетание опасно.' };
  const labels = [
    ...ROWS.flatMap((r) => r.chain.map(([id, n], i) => ({ text: n, pos: MOB ? NP(r, i).add(V3(0.6, 0.05, 0.3)) : V3(XS[i] - 0.25, r.y - 0.62, 0.3), color: r.col, show: () => st.labels && st.mode === 'decarb' && (st.row === r.id || !MOB && i === 0) }))),
    ...ROWS.flatMap((r) => STEPN[r.id].map((n, i) => ({ text: n, pos: MOB ? MP(r, i).add(V3(0.35, 0, 0.3)) : V3((XS[i] + XS[i + 1]) / 2 - 0.55, r.y - 0.3, 0.3), color: '#C8C8D0', show: () => st.labels && st.mode === 'decarb' && st.row === r.id }))),
    { text: 'мозг', pos: V3(40.45, 4.55, 0.1), color: '#9F7BFF', show: () => st.labels && st.mode === 'fate' }, { text: 'эпифиз', pos: V3(40 - 0.95, 4.15, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'fate' },
    { text: 'надпочечник', pos: V3(40 + 0.6, 1.25, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'fate' }, { text: 'бронхи', pos: V3(40 - 1.3, 2.4, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'fate' },
    { text: 'кожа', pos: V3(40 + 1.45, 1.75, 0.2), color: '#FF8AB0', show: () => st.labels && st.mode === 'fate' }, { text: 'кишечник', pos: V3(40 + 0.25, 0.25, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'fate' },
    ...OUT.flatMap((o) => [{ text: MOL(o.from).name.toLowerCase(), pos: V3(40 + 2.05, o.y + 0.45, 0.2), color: o.col, show: () => st.labels && st.mode === 'fate' }, { text: MOL(o.to).name.toLowerCase(), pos: V3(40 + 3.9, o.y - 0.5, 0.2), color: '#C8C8D0', show: () => st.labels && st.mode === 'fate' }, { text: o.enz, pos: V3(40 + 3.0, o.y + 0.32, 0.2), color: '#FF9A5C', show: () => st.labels && st.mode === 'fate' }]),
    ...FN.map((n) => ({ text: n.name, pos: n.p.clone().add(V3(80.8 - 0.4, -0.55, 0.3)), color: n.id === 'dhf' ? '#C8C8D0' : '#F2C14E', show: () => st.labels && st.mode === 'onec' })),
    { text: 'серин → глицин', pos: V3(80.8 + 4.2, 2.8, 0.2), color: '#7FE0A0', show: () => st.labels && st.mode === 'onec' },
    ...Object.values(OUTS).map((o) => ({ text: o.name, pos: o.p.clone().add(V3(80.8 - 0.5, -0.55, 0.3)), color: '#C8C8D0', show: () => st.labels && st.mode === 'onec' })),
    { text: 'гомоцистеин', pos: V3(80.8 - 3.6, -2.15, 0.3), color: '#C8C8D0', show: () => st.labels && st.mode === 'onec' },
    { text: 'метотрексат блокирует ДГФР', pos: F.dhf.p.clone().add(V3(80.8 - 0.2, 1.75, 0.3)), color: '#FF6A5A', show: () => st.labels && st.mode === 'onec' && st.onec === 'mtx' },
    { text: 'тимидилатсинтаза', pos: F.ch2.p.clone().lerp(F.dhf.p, 0.5).add(V3(80.8 - 0.2, -0.65, 0.3)), color: '#7FD6FF', show: () => st.labels && st.mode === 'onec' },
    { text: 'B12 (метионинсинтаза)', pos: F.ch3.p.clone().lerp(F.thf.p, 0.5).add(V3(80.8 - 1.9, 0.45, 0.3)), color: '#F08AC0', show: () => st.labels && st.mode === 'onec' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    const ONEC = { norm: TXT.onec, folate: '<b>Дефицит фолиевой кислоты.</b> Не хватает одноуглеродных фрагментов — клетки не могут быстро синтезировать ДНК. Страдают самые быстро делящиеся клетки: в костном мозге образуются крупные незрелые клетки — <b>мегалобластная анемия</b>. У беременных дефицит фолата повышает риск дефектов нервной трубки у плода, поэтому фолиевую кислоту назначают заранее.', b12: '<b>Дефицит B12</b> (например, при атрофии желудка — нет внутреннего фактора Касла). Метил-ТГФ не может отдать метильную группу — фолат «застревает» в этой форме (<b>ловушка метилфолата</b>), остальные формы ТГФ истощаются → та же мегалобластная анемия; копится гомоцистеин. Кроме того, B12 нужен для миелина — возможны неврологические нарушения.', mtx: '<b>Метотрексат</b> похож на фолат и прочно блокирует <b>дигидрофолатредуктазу</b>: ДГФ не восстанавливается в ТГФ, синтез тимидилата и пуринов останавливается. Быстро делящиеся опухолевые клетки погибают — это противоопухолевый препарат; в малых дозах лечит ревматоидный артрит и псориаз. Похоже действуют триметоприм (на бактериальную ДГФР) и сульфаниламиды (бактерии синтезируют фолат сами).' };
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'decarb' ? ROWTXT[st.row] : st.mode === 'fate' ? (st.mao ? '<b>Ингибиторы МАО</b> (старые антидепрессанты) замедляют распад аминов — их больше в синапсах (красные ореолы). Опасность: тирамин из сыра, вина, копчёностей тоже не разрушается и вызывает резкий выброс норадреналина — гипертонический криз («сырная реакция»).' : SITTXT[st.sit]) : ONEC[st.onec]); };
    refs.modeSeg = seg([{ id: 'decarb', label: 'Синтез аминов' }, { id: 'fate', label: 'Действие и распад' }, { id: 'onec', label: 'Глицин, серин, фолат' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'decarb') box.append(h('div', { class: 'glabel' }, 'Путь'), h('div', { class: 'gctl' }, seg(ROWS.map((r) => ({ id: r.id, label: r.name, color: r.col })), () => st.row, (v) => { st.row = v; st.msg = null; if (MOB) st.fly = rowView(); refs.setInfo(); }), toggle('Витамин B6', () => st.b6, (v) => { st.b6 = v; st.msg = v ? null : '<b>Без витамина B6</b> (пиридоксальфосфата) декарбоксилазы и трансаминазы не работают: падает синтез ГАМК, серотонина, дофамина. Дефицит B6 бывает при лечении туберкулёза изониазидом и у людей, злоупотребляющих алкоголем.'; refs.setInfo(); })));
      else if (st.mode === 'fate') box.append(h('div', { class: 'glabel' }, 'Ситуация'), h('div', { class: 'gctl' }, seg(Object.entries(SIT).map(([id, label]) => ({ id, label })), () => st.sit, (v) => { st.sit = v; st.msg = null; refs.setInfo(); }), toggle('Ингибитор МАО', () => st.mao, (v) => { st.mao = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Норма' }, { id: 'folate', label: 'Нет фолата' }, { id: 'b12', label: 'Нет B12' }, { id: 'mtx', label: 'Метотрексат' }], () => st.onec, (v) => { st.onec = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  if (MOB) { const v = rowView(); camera.position.copy(v.pos); controls.target.copy(v.target); }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['decarb', 'fate', 'onec'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'fate') return [['Пульс', st.hr || 70, 'уд/мин'], ['МАО', st.mao ? 'заблокирована' : 'работает', '']];
    if (st.mode === 'onec') return [['Синтез ДНК', st.dnaOK ? 'идёт' : 'нарушен', ''], ['Гомоцистеин', st.onec === 'b12' || st.onec === 'folate' ? 'повышен' : 'норма', '']];
    const r = ROWS.find((x) => x.id === st.row); return [['Аминокислота', r.chain[0][1], ''], ['Шагов', r.chain.length - 1, '']];
  }
  const self = {
    mobZoom: 1.0, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#9FE870',
    kicker: 'Биохимия · обмен аминокислот', title: 'Биогенные амины',
    lede: 'Отщепив всего одну молекулу CO₂, клетка превращает обычную аминокислоту в мощный сигнал: гистамин, серотонин, дофамин, адреналин, ГАМК.',
    notes: `
      <div><h2>Декарбоксилирование</h2>
        <p>Отщепление карбоксильной группы аминокислоты в виде CO₂. Кофермент — пиридоксальфосфат (витамин B6). Продукты — биогенные амины: медиаторы, гормоны, регуляторы.</p>
        <h3>Обезвреживание аминов</h3><p><b>МАО</b> (на наружной мембране митохондрий) окисляет амины до альдегидов с выделением NH₃ и H₂O₂; альдегиды окисляются в кислоты. <b>КОМТ</b> метилирует катехоламины. Гистамин инактивируется метилированием и диаминоксидазой.</p>
        <h3>Одноуглеродные фрагменты</h3><p>Метильная (−CH₃), метиленовая (−CH₂−), метенильная (−CH=), формильная (−CHO) группы переносит ТГФ. Источники — серин, глицин, гистидин, формиат.</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы — по химическим формулам; все формы ТГФ показаны одной молекулой фолата.</li><li>Уровни аминов в органах — качественная схема.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('decarb'); st.fly = null;
  return self;
}
