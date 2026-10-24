// @scene enzmed makeEnzmed | Регуляция и ферменты в медицине | Ферменты
/* =========================================================
   БИОХИМИЯ · РЕГУЛЯЦИЯ ФЕРМЕНТОВ И МЕДИЦИНА: аллостерия, фосфорилирование (Src 2SRC),
   частичный протеолиз (фактор Xa 1IQJ), изоферменты ЛДГ, лекарства-ингибиторы (реальные комплексы)
   ========================================================= */
const EM_DRUGS = [
  { id: 'hiv', name: 'Ампренавир → протеаза ВИЧ', color: '#7FD6FF', pdb: 'hiv', text: '<b>Протеаза ВИЧ + ампренавир</b> (PDB 1HPV). Вирус режет свой длинный белок-предшественник на рабочие части протеазой из двух одинаковых цепей. Лекарство повторяет форму переходного состояния субстрата и плотно садится в активный центр между двумя аспартатами (Asp25) — это <b>конкурентный</b> ингибитор. Ингибиторы протеазы — основа терапии ВИЧ.' },
  { id: 'pbp', name: 'Пенициллин → транспептидаза', color: '#7FE0A0', pdb: 'pbp', text: '<b>Пенициллин в ферменте бактерии</b> (PDB 1PWC). Транспептидаза сшивает стенку бактерии. Пенициллин похож на её субстрат (D-Ala-D-Ala), но его напряжённое β-лактамное кольцо раскрывается и <b>ковалентно</b> пришивается к серину активного центра — <b>необратимое</b> ингибирование. Стенка не достраивается, бактерия лопается. У человека этого фермента нет.' },
  { id: 'dhfr', name: 'Метотрексат → ДГФР', color: '#FF8A5C', pdb: 'dhfr', text: '<b>Дигидрофолатредуктаза с коферментом НАДФН</b> (PDB 1RX1). Фермент восстанавливает фолиевую кислоту (витамин B9), без которой не синтезируются нуклеотиды ДНК. <b>Метотрексат</b> (жёлтая молекула) — аналог фолата, конкурентный ингибитор с прочностью в тысячи раз выше субстрата: он останавливает деление быстро растущих клеток (химиотерапия опухолей, ревматоидный артрит). Антибиотик триметоприм так же действует на бактериальный фермент.' },
  { id: 'fxa', name: 'Ингибитор фактора Xa', color: '#FF8AB0', pdb: 'fxa', text: '<b>Фактор свёртывания Xa + ингибитор</b> (PDB 1IQJ). Фактор Xa — протеаза, которая запускает превращение протромбина в тромбин. Современные антикоагулянты («ксабаны»: ривароксабан, апиксабан) занимают его активный центр и снижают риск тромбозов и инсультов.' },
];
const EM_LDH = { norm: [0.27, 0.36, 0.22, 0.09, 0.06], mi: [0.42, 0.32, 0.15, 0.07, 0.04], liv: [0.18, 0.24, 0.18, 0.13, 0.27] };
function makeEnzmed() {
  rnd = mulberry(733);
  const scene = bioStage({ rim: 0xc77dff });
  const VIEW = { allo: flyTarget(V3(0, -1.5, 0), V3(1.5, 0.2, 14.5)), phos: flyTarget(V3(40, -1, 0), V3(41, 1.0, 14)), prot: flyTarget(V3(80, -1, 0), V3(81, 1.2, 11)), ldh: flyTarget(V3(120, -0.6, 0), V3(120, 2.4, 13.5)), drug: flyTarget(V3(160, -1.2, 0), V3(160, 3.2, 17)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 500); camera.position.copy(VIEW.allo.pos);
  const controls = makeControls(camera, VIEW.allo.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1500, 0.08); scene.add(fx.obj);
  /* ---------- 1. аллостерический фермент из 4 субъединиц ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const SUB = [0, 1, 2, 3].map((k) => {
    const a = k * Math.PI / 2 + Math.PI / 4, home = V3(Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0);
    const g = new THREE.Group(); g.position.copy(home); G1.add(g);
    const mat = protMat(k % 2 ? '#7FD6FF' : '#9FB4FF', 0.26);
    const body = new THREE.Mesh(blobGeo(0.92, 0.92, 0.85, k + 11, 0.12), mat); g.add(body);
    const cleft = V3(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.55);
    const site = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: 0x7fd6ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })); site.position.copy(cleft); g.add(site);
    const sub = molMesh(MOL('f6p'), { scale: 0.075, hideH: true }); sub.visible = false; g.add(sub); sub.position.copy(cleft).multiplyScalar(1.35);
    return { g, home, a, mat, site, sub, cleft, occ: 0 };
  });
  const effSite = V3(0, 0, 1.05);
  const effA = molMesh(MOL('amp'), { scale: 0.085, hideH: true, tint: '#7FE0A0' }), effI = molMesh(MOL('atp'), { scale: 0.085, hideH: true, tint: '#FF6A6A' }); G1.add(effA, effI);
  const effRing = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 40), new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.6 })); effRing.position.copy(effSite); G1.add(effRing);
  /* ---------- 2. фосфорилирование: Src ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const SR = PDB('src');
  const srcDom = (i) => (i < 62 ? '#C77DFF' : i < 162 ? '#7FE0A0' : i < 437 ? '#7FD6FF' : '#F2C14E');
  const srcM = cartoon(SR.chains[0], { scale: 0.08, color: srcDom }); G2.add(srcM);
  const anp = molMesh(SR.ligm[0], { scale: 0.08 }); G2.add(anp);
  const ptr = SR.resm[0]; const ptrM = molMesh(ptr, { scale: 0.08 }); G2.add(ptrM);
  const pIdx = []; for (let i = 0; i < ptr.n; i++) if (ptr.el[i] === 'P' || (ptr.el[i] === 'O' && i >= ptr.n - 4)) pIdx.push(i);
  const ptrC = V3(0, 0, 0); { let n = 0; for (let i = 0; i < ptr.n; i++) if (ptr.el[i] === 'P') { ptrC.add(V3(ptr.xyz[i * 3], ptr.xyz[i * 3 + 1], ptr.xyz[i * 3 + 2]).multiplyScalar(0.08)); n++; } }
  const ptrGlow = glowNucleus(G2, ptrC, '#FF9A30', 0.06, 8);
  const ldm = (m) => { const c = V3(0, 0, 0); for (let i = 0; i < m.n; i++) c.add(V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return c.multiplyScalar(0.08 / m.n); };
  const anpC = ldm(SR.ligm[0]);
  // справа — цикл «киназа → фермент → фосфатаза» на примере липазы
  const lip = new THREE.Group(); lip.position.set(4.2, -0.4, 0); G2.add(lip);
  const lipMat = protMat('#9FA8B8', 0.25); const lipB = new THREE.Mesh(blobGeo(0.95, 0.8, 0.85, 21, 0.13), lipMat); lip.add(lipB);
  const lipP = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), atomMat('P')); lipP.position.set(-0.55, 0.62, 0.35); lip.add(lipP);
  /* ---------- 3. частичный протеолиз: фактор X → Xa ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const FX = PDB('fxa'); const fxA = FX.chains.find((c) => c.id === 'A'), fxL = FX.chains.find((c) => c.id === 'L');
  const fxM = cartoon(fxA, { scale: 0.1, color: '#FF8AB0' }), fxLM = cartoon(fxL, { scale: 0.1, color: '#C79BD8' }); G3.add(fxM, fxLM);
  const motif = (re, off) => { const m = fxA.seq.search(re); return m >= 0 ? m + off : 0; };
  const iH = motif(/AAHC/, 2), iD = motif(/DIA/, 0), iS = motif(/GDSGGP/, 2);
  const caF = (i) => V3(fxA.ca[i * 3], fxA.ca[i * 3 + 1], fxA.ca[i * 3 + 2]).multiplyScalar(0.1);
  const triad = [iH, iD, iS].map((i, k) => glowNucleus(G3, caF(i), ['#7FD6FF', '#FF6A6A', '#F2C14E'][k], 0.07, 7));
  const nTerm = caF(0);
  // «пропептид» — отрезаемый участок цепи
  const propPts = [nTerm.clone()]; { let p = nTerm.clone(); const d = nTerm.clone().normalize(); for (let k = 0; k < 9; k++) { p = p.clone().addScaledVector(d.clone().add(randUnit().multiplyScalar(0.7)).normalize(), 0.38); propPts.push(p); } }
  const prop = new THREE.Mesh(tube(propPts, 0.032, 80, 8), organMat('#F2E6C8', 0.6)); G3.add(prop);
  const propHome = prop.position.clone();
  const fxInh = molMesh(FX.ligm[0], { scale: 0.1 }); fxInh.visible = false; G3.add(fxInh);
  /* ---------- 4. изоферменты ЛДГ ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const LDH = [0, 1, 2, 3, 4].map((k) => {
    const g = new THREE.Group(); g.position.set((k - 2) * 2.3, 0.2, 0); G4.add(g);
    const nH = 4 - k; const subs = [];
    for (let j = 0; j < 4; j++) { const isH = j < nH; const m = new THREE.Mesh(blobGeo(0.42, 0.5, 0.42, k * 4 + j + 3, 0.1, 4), protMat(isH ? '#5B8CFF' : '#FF6A6A', 0.26)); const a = j * Math.PI / 2 + 0.6; m.position.set(Math.cos(a) * 0.42, (j % 2 ? 0.22 : -0.22), Math.sin(a) * 0.42); g.add(m); subs.push(m); }
    return { g, subs };
  });
  /* ---------- 5. лекарства ---------- */
  const G5 = new THREE.Group(); G5.position.set(160, 0, 0); scene.add(G5);
  const DR = EM_DRUGS.map((d, k) => {
    const g = new THREE.Group(); g.position.set((k - 1.5) * 4.6, 0, 0); G5.add(g);
    const S = PDB(d.pdb); const sc = 0.055;
    const prot = proteinMesh(d.pdb, { scale: sc, colorBy: (c, ci) => ci ? '#9FB4D8' : d.color }); g.add(prot);
    const ligs = S.ligm.map((m) => { const lm = molMesh(m, { scale: sc }); g.add(lm); return lm; });
    if (d.id === 'dhfr') { const mtx = molMesh(MOL('methotrexate'), { scale: sc, hideH: true, tint: '#F2C14E' }); const c = ldm(S.ligm[0]).multiplyScalar(sc / 0.08); mtx.position.copy(c).add(V3(0.25, 0.35, 0.3)); g.add(mtx); ligs.push(mtx); }
    prot.traverse((o) => { if (o.isMesh) o.userData.pick = d.id; });
    return { d, g, prot, ligs };
  });
  const pick5 = []; DR.forEach((x) => x.prot.traverse((o) => { if (o.isMesh) pick5.push(o); }));
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'allo', labels: true, rot: false, fly: null, eff: 'none', S: 0.35, cyc: 0, act: false, ldh: 'norm', drug: null, msg: null, phosOn: true };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4, G5].forEach((g, k) => { g.visible = ['allo', 'phos', 'prot', 'ldh', 'drug'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; st.drug = null; refs.drugSeg && refs.drugSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function selDrug(id) { if (st.mode !== 'drug') setMode('drug'); st.drug = id; const x = DR.find((q) => q.d.id === id); const wp = x.g.position.clone().add(G5.position); st.fly = flyTarget(wp.clone().add(V3(0, -0.5, 0)), wp.clone().add(V3(0.6, 1.0, 6.5))); refs.drugSeg && refs.drugSeg.sync(); refs.setInfo(); }
  pickOn(() => self, camera, () => pick5, (id) => selDrug(id));
  const hill = (S, n, K) => S ** n / (K ** n + S ** n);
  const curve = () => (st.eff === 'act' ? (S) => hill(S, 1.3, 0.18) : st.eff === 'inh' ? (S) => hill(S, 3.2, 0.62) : (S) => hill(S, 2.6, 0.36));
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'allo') {
      const occ = curve()(st.S); st.occ = occ;
      const tight = st.eff === 'inh' ? 1 : st.eff === 'act' ? 0 : 1 - occ;
      SUB.forEach((s, k) => {
        s.g.position.copy(s.home).multiplyScalar(1 + 0.12 * (1 - tight)); s.g.rotation.z = (k % 2 ? 1 : -1) * 0.25 * (1 - tight);
        const on = (k + 0.5) / 4 < occ; s.sub.visible = on; s.sub.rotation.y += dt;
        s.site.material.color.set(on ? '#F2C14E' : tight > 0.6 ? '#5a6a80' : '#7FD6FF'); s.site.scale.setScalar(on ? 1.2 + 0.2 * Math.sin(t * 8 + k) : 1);
        s.mat.emissiveIntensity = on ? 0.12 : 0.02;
      });
      effA.visible = st.eff === 'act'; effI.visible = st.eff === 'inh';
      [effA, effI].forEach((e) => { e.position.copy(effSite).add(V3(0, 0.15 * Math.sin(t * 2), 0)); e.rotation.y += dt * 0.8; });
      effRing.material.color.set(st.eff === 'act' ? '#7FE0A0' : st.eff === 'inh' ? '#FF6A6A' : '#C77DFF');
    }
    if (st.mode === 'phos') {
      const T = 10, c = st.cyc % T; srcM.rotation.y = anp.rotation.y = ptrM.rotation.y = 0;
      ptrGlow.spr.material.opacity = 0.5 + 0.4 * Math.sin(t * 4);
      // липаза: АТФ-фосфат садится (0–3), активна (3–7), фосфатаза снимает (7–9)
      const on = c > 2.2 && c < 7.6; lipP.visible = c > 1.2 && c < 8.2;
      if (c > 1.2 && c < 2.2) lipP.position.lerpVectors(V3(-3.2, 1.2, 0.3), V3(-0.55, 0.62, 0.35), (c - 1.2)); else if (c >= 7.6 && c < 8.2) lipP.position.lerpVectors(V3(-0.55, 0.62, 0.35), V3(-0.4, 2.2, 1), (c - 7.6) / 0.6); else lipP.position.set(-0.55, 0.62, 0.35);
      lipMat.color.set(on ? '#F2C14E' : '#9FA8B8').multiplyScalar(0.25); lipMat.emissive.set(on ? '#F2C14E' : '#9FA8B8'); lipMat.emissiveIntensity = on ? 0.15 + 0.05 * Math.sin(t * 6) : 0.02;
      if (on && rnd() < 0.3) fx.spawn(lip.position.clone().add(G2.position).add(randUnit().multiplyScalar(0.9)), randUnit().multiplyScalar(0.2), new THREE.Color(0xf2c14e), 0.6, 1, 1.2);
      lip.rotation.y += dt * 0.3; st.lipOn = on;
    }
    if (st.mode === 'prot') {
      const T = 10, c = st.cyc % T;
      const cut = c > 3, away = c > 3 ? ease01((c - 3) / 3) : 0;
      prop.position.copy(propHome).addScaledVector(nTerm.clone().normalize(), away * 3); prop.material.opacity = 1 - away; prop.material.transparent = true;
      prop.visible = c < 6.2;
      const act = c > 4.2 && c < 9.4; st.act = act;
      triad.forEach((g, k) => { g.spr.material.opacity = act ? 0.6 + 0.35 * Math.sin(t * 7 + k) : 0.12; g.core.visible = act; });
      fxInh.visible = c > 6.5 && c < 9.4;
      if (c > 2.9 && c < 3.05) for (let k = 0; k < 30; k++) fx.spawn(nTerm.clone().add(G3.position), randUnit().multiplyScalar(0.8), new THREE.Color(0xffd070), 0.6, 2, 1.3);
      st.protPhase = c < 3 ? 'неактивный профермент' : c < 4.2 ? 'отщепление пептида' : c < 6.5 ? 'активный фермент' : 'блок ингибитором';
    }
    if (st.mode === 'ldh') LDH.forEach((l, k) => { l.g.rotation.y += dt * (0.3 + k * 0.05); const amp = EM_LDH[st.ldh][k] / 0.3; l.g.scale.setScalar(0.85 + 0.25 * amp); });
    if (st.mode === 'drug') DR.forEach((x) => { const sel = !st.drug || st.drug === x.d.id; x.g.rotation.y += dt * 0.25; x.ligs.forEach((l) => molGlow(l, sel ? 0.25 + 0.2 * Math.sin(t * 3) : 0)); });
    fx.update(dt);
  }
  const ease01 = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function drawScope(ctx, w, h) {
    if (st.mode === 'allo') {
      const A = plotAxes(ctx, w, h, { title: 'аллостерический фермент: S-кривая', xl: '[S] →', yl: 'v' });
      plotLine(ctx, A, (u) => u / (0.3 + u) * 1.3 * 0.75, 'rgba(255,255,255,.3)', { lw: 1.2, dash: [3, 3] });
      plotLine(ctx, A, (u) => curve()(u), st.eff === 'act' ? '#7FE0A0' : st.eff === 'inh' ? '#FF6A6A' : '#7FD6FF');
      ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.S), A.Y(curve()(st.S)), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('обычный фермент', A.X(0.45), A.Y(0.7));
      scopeShow(true); return;
    }
    if (st.mode === 'ldh') {
      scopeShow(true);
      const A = plotAxes(ctx, w, h, { title: 'электрофорез ЛДГ сыворотки', xl: '← анод   ЛДГ1 … ЛДГ5', yl: '' });
      const pk = EM_LDH[st.ldh], pkN = EM_LDH.norm;
      const f = (arr) => (u) => arr.reduce((a, v, k) => a + v * 2.1 * Math.exp(-(((u - (0.1 + k * 0.2)) / 0.045) ** 2)), 0);
      if (st.ldh !== 'norm') plotLine(ctx, A, f(pkN), 'rgba(255,255,255,.35)', { lw: 1.2, dash: [3, 3], n: 160 });
      plotLine(ctx, A, f(pk), st.ldh === 'mi' ? '#FF6A6A' : st.ldh === 'liv' ? '#F2C14E' : '#7FD6FF', { n: 160 });
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; [0, 1, 2, 3, 4].forEach((k) => ctx.fillText(String(k + 1), A.X(0.1 + k * 0.2) - 3, A.Y(0) - 3));
      return;
    }
    scopeShow(false);
  }
  const TXT = {
    allo: '<b>Аллостерическая регуляция.</b> Регуляторный фермент собран из нескольких субъединиц. Кроме активных центров у него есть <b>аллостерический центр</b> (кольцо в середине) для молекулы-эффектора, непохожей на субстрат. Субъединицы влияют друг на друга: занятие одного центра облегчает занятие следующих (<b>кооперативность</b>) — поэтому график скорости не гипербола, а S-кривая. <b>Активатор</b> (здесь АМФ — сигнал «энергии мало») сдвигает кривую влево, <b>ингибитор</b> (АТФ — «энергии много») — вправо. Так фосфофруктокиназа управляет гликолизом. Двигайте [S] и выбирайте эффектор.',
    phos: '<b>Фосфорилирование</b> — самый частый выключатель ферментов. Протеинкиназа переносит фосфат с АТФ на серин, треонин или тирозин белка, фосфатаза снимает его водой. Слева — реальная <b>тирозинкиназа Src</b> (PDB 2SRC, домены разными цветами). Фосфат на её хвосте (<b>Tyr527</b>, оранжевый огонёк) защёлкивается в «кармане» домена SH2 и держит фермент выключенным; в синем каталитическом домене лежит аналог АТФ. Справа — <b>липаза жировой клетки</b>: фосфат от киназы <b>включает</b> её (адреналин → расщепление жира). У гликогенсинтазы наоборот: активна без фосфата.',
    prot: '<b>Частичный протеолиз.</b> Многие протеазы синтезируются неактивными <b>проферментами (зимогенами)</b>, чтобы не переварить собственную клетку. Отщепление участка цепи (светлый пептид) меняет форму белка: новый N-конец (Ile16) уходит внутрь и «собирает» активный центр — <b>каталитическую триаду</b> His57, Asp102, Ser195 (огоньки). Так включаются трипсиноген → трипсин (энтеропептидазой в кишке), пепсиноген → пепсин (соляной кислотой) и факторы свёртывания. На модели — <b>фактор Xa</b> (PDB 1IQJ) с антикоагулянтом в активном центре.',
    ldh: '<b>Изоферменты</b> — разные формы одного фермента. <b>Лактатдегидрогеназа</b> — тетрамер из субъединиц двух типов: H (сердце, синие) и M (мышцы и печень, красные). Пять сочетаний дают ЛДГ1 (H4) … ЛДГ5 (M4); они по-разному движутся в электрическом поле. В норме ЛДГ2 > ЛДГ1. При <b>инфаркте</b> из сердечной мышцы выходит ЛДГ1 и её пик обгоняет ЛДГ2; при поражении <b>печени</b> растёт ЛДГ5. Такие «индикаторные» ферменты — основа энзимодиагностики.',
    drug: '<b>Лекарства — ингибиторы ферментов.</b> Здесь четыре реальных комплекса из банка белковых структур: в активном центре каждого фермента светится молекула лекарства или кофермента. Нажмите на фермент или кнопку.',
  };
  const labels = [
    { text: 'аллостерический центр', pos: effSite.clone().add(V3(0.45, 0.25, 0)), color: '#C77DFF', show: () => st.labels && st.mode === 'allo' },
    { text: 'активный центр', pos: SUB[0].home.clone().add(SUB[0].cleft).add(V3(0.2, 0.2, 0)), color: '#7FD6FF', show: () => st.labels && st.mode === 'allo' },
    { text: 'pTyr527 · фосфат-«защёлка»', pos: ptrC.clone().add(V3(40.3, 0.2, 0)), color: '#FF9A30', show: () => st.labels && st.mode === 'phos' },
    { text: 'аналог АТФ', pos: anpC.clone().add(V3(40.3, 0.3, 0)), color: '#F2C14E', show: () => st.labels && st.mode === 'phos' },
    { text: 'домен SH2', pos: V3(40, 0, 0).add(caPoints('src', 0.08)[110]).add(V3(0.2, 0.3, 0)), color: '#7FE0A0', show: () => st.labels && st.mode === 'phos' },
    { text: 'липаза (мишень киназы)', pos: V3(44.2, 0.7, 0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'phos' },
    { text: 'отщепляемый пептид', pos: propPts[6].clone().add(V3(80.2, 0.2, 0)), color: '#F2E6C8', show: () => st.labels && st.mode === 'prot' && st.cyc % 10 < 3.5 },
    { text: 'His57', pos: caF(iH).add(V3(80.15, 0.15, 0)), color: '#7FD6FF', show: () => st.labels && st.mode === 'prot' && st.act },
    { text: 'Asp102', pos: caF(iD).add(V3(80.15, -0.15, 0)), color: '#FF6A6A', show: () => st.labels && st.mode === 'prot' && st.act },
    { text: 'Ser195', pos: caF(iS).add(V3(80.15, 0.15, 0)), color: '#F2C14E', show: () => st.labels && st.mode === 'prot' && st.act },
    ...[0, 1, 2, 3, 4].map((k) => ({ text: `ЛДГ${k + 1} · ${'H'.repeat(4 - k)}${'M'.repeat(k)}`, pos: V3(120 + (k - 2) * 2.3 - 0.5, -1.15, 0), color: k < 2 ? '#7FA8FF' : k > 2 ? '#FF8A8A' : '#C8A8D8', show: () => st.labels && st.mode === 'ldh' })),
    ...EM_DRUGS.map((d, k) => ({ text: d.name, pos: V3(160 + (k - 1.5) * 4.6 - 1.2, -2.3, 0), color: d.color, show: () => st.labels && st.mode === 'drug' && (!st.drug || st.drug === d.id) })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 420px');
    refs.setInfo = () => { const d = EM_DRUGS.find((x) => x.id === st.drug); ib.info.innerHTML = st.msg || (st.mode === 'drug' && d ? d.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'allo', label: 'Аллостерия' }, { id: 'phos', label: 'Фосфорилирование' }, { id: 'prot', label: 'Частичный протеолиз' }, { id: 'ldh', label: 'Изоферменты ЛДГ' }, { id: 'drug', label: 'Лекарства' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 360px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'allo') { box.append(h('div', { class: 'glabel' }, 'Субстрат и эффектор'), h('div', { class: 'gctl' }, range('aS', 0.02, 1, 0.01, () => st.S, (v) => { st.S = v; }, (v) => `${Math.round(v * 100)}%`), seg([{ id: 'none', label: 'Без эффектора' }, { id: 'act', label: 'Активатор', color: '#7FE0A0' }, { id: 'inh', label: 'Ингибитор', color: '#FF6A6A' }], () => st.eff, (v) => { st.eff = v; }))); }
      else if (st.mode === 'ldh') box.append(h('div', { class: 'glabel' }, 'Сыворотка крови'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Норма' }, { id: 'mi', label: 'Инфаркт миокарда', color: '#FF6A6A' }, { id: 'liv', label: 'Гепатит', color: '#F2C14E' }], () => st.ldh, (v) => { st.ldh = v; })));
      else if (st.mode === 'drug') { refs.drugSeg = seg(EM_DRUGS.map((d) => ({ id: d.id, label: d.name, color: d.color })), () => st.drug, (v) => selDrug(v)); box.append(h('div', { class: 'glabel' }, 'Комплекс', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.drugSeg)); }
      else box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–5', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 5) { setMode(['allo', 'phos', 'prot', 'ldh', 'drug'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'allo') return [['Активность', Math.round((st.occ || 0) * 100), '%'], ['Эффектор', { none: 'нет', act: 'активатор', inh: 'ингибитор' }[st.eff], '']];
    if (st.mode === 'phos') return [['Липаза', st.lipOn ? 'активна' : 'выключена', ''], ['Src', 'выключена pTyr527', '']];
    if (st.mode === 'prot') return [['Состояние', st.protPhase || '', '']];
    if (st.mode === 'ldh') return [['ЛДГ1 / ЛДГ2', (EM_LDH[st.ldh][0] / EM_LDH[st.ldh][1]).toFixed(2), '']];
    return [['Комплексов', '4', ''], ['Источник', 'PDB', '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#C77DFF',
    kicker: 'Биохимия · ферменты', title: 'Регуляция и ферменты в медицине',
    lede: 'Как клетка включает и выключает ферменты — эффекторами, фосфатом, отрезанием куска цепи — и как врачи используют ферменты для диагностики и лечения.',
    notes: `
      <div><h2>Способы регуляции</h2><ul>
        <li><b>Аллостерическая</b> — эффекторы в особом центре; часто по принципу обратной связи: конечный продукт пути тормозит первый фермент.</li>
        <li><b>Кофакторы</b> — четверти ферментов нужны ионы металлов (Mg²⁺, Zn²⁺, Fe²⁺, Cu²⁺, Mn²⁺ и др.).</li>
        <li><b>Частичный протеолиз</b> — профермент → фермент (необратимо).</li>
        <li><b>Фосфорилирование / дефосфорилирование</b> — протеинкиназы и фосфатазы, быстро и обратимо.</li>
        <li><b>Ассоциация и диссоциация</b> субъединиц.</li>
        <li>Изменение <b>количества</b> фермента — синтез и распад (часы).</li></ul>
        <h3>Ферменты в медицине</h3>
        <p><b>Энзимопатология</b> — наследственные болезни из-за дефектного фермента (фенилкетонурия, галактоземия). <b>Энзимотерапия</b> — ферменты и их ингибиторы как лекарства: ферменты поджелудочной при недостаточности, ингибиторы протеаз при панкреатите. <b>Энзимодиагностика</b> — определение ферментов крови (АЛТ, АСТ, КФК-МВ, амилаза, ЛДГ, щелочная фосфатаза) и использование чистых ферментов как реактивов для анализа глюкозы, холестерина, мочевины.</p></div>
      <div><h2>Модели</h2><ul><li>Src — PDB 2SRC, фактор Xa — 1IQJ, протеаза ВИЧ — 1HPV, транспептидаза с пенициллином — 1PWC, ДГФР — 1RX1.</li><li>Аллостерический фермент, липаза и ЛДГ показаны схематично; метотрексат поставлен рядом с местом связывания условно.</li><li>Отрезаемый пептид фактора X нарисован схематично (в кристалле его уже нет).</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>5</code> режим</li><li>клик по белку в «Лекарствах»</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('allo'); st.fly = null;
  return self;
}
