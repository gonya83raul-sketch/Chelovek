// @scene aminoacid makeAminoacid | Обмен аминокислот и мочевина | Белки и аминокислоты
/* =========================================================
   БИОХИМИЯ · АМИНОКИСЛОТЫ: переваривание белков (эндо- и экзопептидазы), трансаминирование
   и дезаминирование, орнитиновый цикл мочевины, обмен фенилаланина и тирозина (ФКУ, альбинизм)
   ========================================================= */
const AM_PEP = [
  { id: 'pep', name: 'Пепсин', color: '#FF8A5C', where: 'желудок, pH 1,5–2', text: '<b>Пепсин</b> — желудок. Выделяется пепсиногеном и активируется соляной кислотой. Эндопептидаза: режет белок посередине, рядом с ароматическими аминокислотами. HCl также денатурирует белки пищи и убивает микробы.' },
  { id: 'try', name: 'Трипсин', color: '#7FD6FF', where: 'кишка, pH 7,5–8', text: '<b>Трипсин</b> (из трипсиногена — энтеропептидазой) режет после лизина и аргинина и активирует остальные проферменты поджелудочной.' },
  { id: 'chy', name: 'Химотрипсин', color: '#C77DFF', where: 'кишка', text: '<b>Химотрипсин</b> режет после ароматических аминокислот (фенилаланин, тирозин, триптофан); <b>эластаза</b> — после мелких (аланин, глицин, серин).' },
  { id: 'exo', name: 'Карбокси- и аминопептидазы', color: '#7FE0A0', where: 'кишка', text: '<b>Экзопептидазы</b> откусывают аминокислоты по одной с концов: карбоксипептидазы (поджелудочная, с цинком) — с C-конца, аминопептидазы и дипептидазы кишечника — с N-конца. Свободные аминокислоты всасываются с помощью Na⁺-зависимых переносчиков.' },
];
const AM_ARO = [
  ['phe', [-6.2, 0.6]], ['tyr', [-3.4, 0.6]], ['dopamine', [-0.4, 2.0]], ['noradrenaline', [2.4, 2.0]], ['adrenaline', [5.2, 2.0]], ['thyroxine', [-0.4, -1.2]],
];
function makeAminoacid() {
  rnd = mulberry(1801);
  const scene = bioStage({ rim: 0x7fe0a0 });
  const DK = !matchMedia('(max-width:700px)').matches;   /* компьютер: режимы 2–4 уходят из-под заголовка и описания */
  const VIEW = { dig: flyTarget(V3(0, 0.9, 0), V3(0.5, 3.3, 18)), trans: DK ? flyTarget(V3(35.85, -1.4, 0), V3(36.35, 1.35, 21)) : flyTarget(V3(40, -1.5, 0), V3(40.5, 0.6, 16)), urea: DK ? flyTarget(V3(76.5, -0.95, 0), V3(77.0, 1.85, 23)) : flyTarget(V3(80, -1.6, 0), V3(80.6, 0.6, 18)), aro: DK ? flyTarget(V3(115.9, -0.9, 0), V3(116.4, 2.0, 23)) : flyTarget(V3(120, -1.6, 0), V3(120.5, 0.6, 17.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.dig.pos);
  const controls = makeControls(camera, VIEW.dig.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  /* ---------- 1. переваривание ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const NB = 48; const seqT = Array.from({ length: NB }, () => ['np', 'pol', 'acid', 'base', 'aro'][Math.floor(rnd() * 5)]);
  const typeC = { np: '#F2C14E', pol: '#7FE0A0', acid: '#FF6A6A', base: '#7FA8FF', aro: '#C77DFF' };
  const beadM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.5 }), NB); G1.add(beadM);
  seqT.forEach((ty, i) => beadM.setColorAt(i, new THREE.Color(typeC[ty]).multiplyScalar(0.55)));
  const home = Array.from({ length: NB }, (_, i) => V3(-5.0 + i * 0.27, 0.9 + 0.7 * Math.sin(i * 0.42), 0.3 * Math.cos(i * 0.8)));
  const cut = new Array(NB).fill(0); // разрезы после i (время разреза)
  const cutPlan = [[8, 'pep'], [21, 'pep'], [33, 'pep'], [4, 'try'], [14, 'try'], [27, 'try'], [40, 'try'], [11, 'chy'], [18, 'chy'], [30, 'chy'], [37, 'chy'], [44, 'chy']];
  const enzB = AM_PEP.map((p, k) => { const m = new THREE.Mesh(blobGeo(0.32, 0.26, 0.28, k + 5, 0.12, 3), protMat(p.color, 0.4)); m.visible = false; G1.add(m); return m; });
  const stomach = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), glassMat(0xff8a5c, { rim: 0.55, base: 0.03, keep: true })); stomach.scale.set(4.5, 1.6, 1.2); stomach.position.set(-3.6, 0.9, 0); G1.add(stomach);
  const gutT = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 7.5, 32, 1, true), glassMat(0x7fd6ff, { rim: 0.55, base: 0.03, keep: true })); gutT.rotation.z = Math.PI / 2; gutT.position.set(3.8, 0.9, 0); G1.add(gutT);
  /* ---------- 2. трансаминирование ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const TM = { ala: [-4.2, 1.6], akg: [-4.2, -0.6], pyruvate: [-0.6, 1.6], glu: [-0.6, -0.6], akg2: [3.6, 1.6], nh3: [3.6, -0.6] };
  const tmM = {}; Object.entries(TM).forEach(([id, [x, y]]) => { const m = molMesh(MOL(id === 'akg2' ? 'akg' : id), { scale: id === 'nh3' ? 0.3 : 0.17, hideH: id !== 'nh3' }); m.position.set(x, y, 0); G2.add(m); tmM[id] = m; });
  const plp = molMesh(MOL('plp'), { scale: 0.14, hideH: true }); plp.position.set(-2.4, 0.5, 0.6); G2.add(plp);
  const nTok = glowNucleus(G2, V3(0, 0, 0), '#4F74FF', 0.1, 10);
  const alt = new THREE.Mesh(blobGeo(1.2, 1.7, 0.9, 81, 0.1, 4), glassMat(0x7fe0a0, { rim: 0.25, base: 0.004, keep: true })); alt.position.set(-2.4, 0.5, 0); G2.add(alt);
  const gdh = new THREE.Mesh(blobGeo(1.2, 1.7, 0.9, 82, 0.1, 4), glassMat(0xffb070, { rim: 0.25, base: 0.004, keep: true })); gdh.position.set(1.5, 0.5, 0); G2.add(gdh);
  const amines = ['histamine', 'serotonin', 'gaba', 'dopamine'].map((id, k) => { const m = molMesh(MOL(id), { scale: 0.13, hideH: true }); m.position.set(-4.2 + k * 2.6, -2.4, 0); G2.add(m); return m; });
  /* ---------- 3. цикл мочевины ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const mito = new THREE.Mesh(new THREE.CapsuleGeometry(1.25, 2.4, 10, 36), glassMat(0xffb070, { rim: 0.3, base: 0.004, keep: true })); mito.rotation.z = Math.PI / 2; mito.position.set(-3.6, 0.1, -0.3); G3.add(mito);
  const UC = [['ornithine', 0], ['citrulline', 1], ['argsucc', 2], ['arg', 3]]; const UR = 2.4, UCN = V3(1.4, 0.3, 0);
  const uang = (k) => Math.PI - 0.3 - k * (Math.PI * 2 / 4);
  const ucM = UC.map(([id], k) => { const m = molMesh(MOL(id), { scale: 0.13, hideH: true }); m.position.set(UCN.x + Math.cos(uang(k)) * UR, UCN.y + Math.sin(uang(k)) * UR, 0); G3.add(m); return m; });
  const carbP = molMesh(MOL('carbp'), { scale: 0.16, hideH: true }); carbP.position.set(-3.4, 0.1, 0.4); G3.add(carbP);
  const urea = molMesh(MOL('urea'), { scale: 0.22, hideH: false }); G3.add(urea);
  const extra = { nh3: molMesh(MOL('nh3'), { scale: 0.26 }), co2: molMesh(MOL('co2'), { scale: 0.22 }), asp: molMesh(MOL('asp'), { scale: 0.15, hideH: true }), fum: molMesh(MOL('fumarate'), { scale: 0.15, hideH: true }) };
  Object.values(extra).forEach((m) => G3.add(m)); extra.nh3.position.set(-5.4, 1.1, 0.3); extra.co2.position.set(-5.4, -0.8, 0.3);
  const ucArcs = UC.map((_, k) => { const a0 = uang(k) - 0.25, a1 = uang(k + 1) + 0.25; const pts = []; for (let i = 0; i <= 20; i++) { const a = a0 + (a1 - a0) * i / 20; pts.push(V3(UCN.x + Math.cos(a) * UR, UCN.y + Math.sin(a) * UR, 0)); } const f = flowTubeMat('#7FE0A0', 0.5, 1.2); G3.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.035, 6), f)); return f; });
  const inArrow = flowArrow(G3, V3(-3.0, 0.3, 0.3), ucM[0].position.clone().lerp(ucM[1].position, 0.5).add(V3(-0.2, -0.4, 0)), '#F2C14E', { bend: 0.3 });
  /* ---------- 4. фенилаланин и тирозин ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const aroM = {}; AM_ARO.forEach(([id, [x, y]]) => { const m = molMesh(MOL(id), { scale: 0.15, hideH: true }); m.position.set(x, y, 0); G4.add(m); aroM[id] = m; });
  const melanin = new THREE.Mesh(blobGeo(0.5, 0.35, 0.4, 91, 0.25, 3), new THREE.MeshPhysicalMaterial({ color: 0x2a1a10, roughness: 0.7, emissive: 0x3a2010, emissiveIntensity: 0.2 })); melanin.position.set(-0.4, 3.0, 0); G4.add(melanin);
  const ppa = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x5a3a8a, emissive: 0x9f7bff, emissiveIntensity: 0.3 })); ppa.position.set(-6.2, -1.6, 0); G4.add(ppa);
  const fumAce = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x3a5a3a, emissive: 0x7fe0a0, emissiveIntensity: 0.3 })); fumAce.position.set(-3.4, -2.4, 0); G4.add(fumAce);
  const aroArr = [['phe', 'tyr', 'pah'], ['tyr', 'dopamine', ''], ['dopamine', 'noradrenaline', ''], ['noradrenaline', 'adrenaline', ''], ['tyr', 'thyroxine', '']].map(([a, b, tag]) => ({ tag, f: flowArrow(G4, aroM[a].position.clone().add(V3(0.6, 0, 0)), aroM[b].position.clone().add(V3(-0.7, 0, 0)), '#7FE0A0', { bend: 0.1 }) }));
  const toMel = flowArrow(G4, aroM.tyr.position.clone().add(V3(0.3, 0.5, 0)), melanin.position.clone().add(V3(-0.5, 0, 0)), '#7FE0A0', { bend: -0.2 });
  const toPPA = flowArrow(G4, aroM.phe.position.clone().add(V3(0, -0.6, 0)), ppa.position.clone().add(V3(0, 0.3, 0)), '#9F7BFF', { bend: 0 });
  const toFA = flowArrow(G4, aroM.tyr.position.clone().add(V3(0, -0.6, 0)), fumAce.position.clone().add(V3(0, 0.3, 0)), '#7FE0A0', { bend: 0 });
  const xPAH = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff5a5a })); xPAH.position.set(-4.8, 0.6, 0.3); G4.add(xPAH);
  const xTYR = xPAH.clone(); xTYR.position.set(-1.9, 2.0, 0.3); G4.add(xTYR);
  const xHGO = xPAH.clone(); xHGO.position.set(-3.4, -1.5, 0.3); G4.add(xHGO);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'dig', labels: true, rot: false, fly: null, cyc: 0, msg: null, sel: null, dis: 'none' };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['dig', 'trans', 'urea', 'aro'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D(); const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'dig') {
      const c = st.cyc % 16; const ph = c < 4 ? 'pep' : c < 8 ? 'try' : c < 11 ? 'chy' : 'exo';
      st.digPh = AM_PEP.find((p) => p.id === ph);
      // какие разрезы уже сделаны
      const done = new Set(cutPlan.filter(([i, e], k) => { const tt = { pep: 1, try: 4.5, chy: 8.5 }[e] + (k % 4) * 0.6; return c > tt; }).map(([i]) => i));
      // фрагменты разъезжаются; экзопептидазы откусывают по одной с концов после 11 с
      let frag = 0, shift = 0; const exoT = c > 11 ? (c - 11) / 5 : 0;
      for (let i = 0; i < NB; i++) {
        if (i > 0 && done.has(i - 1)) frag++;
        const fragOff = V3((frag - 4) * 0.35 * ease(c / 6), 0.25 * Math.sin(frag * 2.1) * ease(c / 5), 0);
        const free = exoT > 0 && ((i * 7) % 11) / 11 < exoT;
        const p = home[i].clone().add(fragOff); if (c > 4) p.x += 1.2 * ease((c - 4) / 4);
        if (free) p.add(V3(Math.sin(i) * 0.6, -0.7 - (i % 3) * 0.25, Math.cos(i * 1.7) * 0.5).multiplyScalar(ease((exoT - ((i * 7) % 11) / 11) * 4)));
        dm.position.copy(p); dm.scale.setScalar(1); dm.updateMatrix(); beadM.setMatrixAt(i, dm.matrix);
      }
      beadM.instanceMatrix.needsUpdate = true;
      enzB.forEach((m, k) => { const on = AM_PEP[k].id === ph; m.visible = on; if (on) { m.position.set(-5 + ((t * 1.3 + k) % 1) * 9.5, 1.45 + 0.1 * Math.sin(t * 4), 0.25); m.rotation.y += dt * 3; } });
      stomach.visible = c < 4.2; gutT.visible = c >= 3.8;
    }
    if (st.mode === 'trans') {
      const c = st.cyc % 10;
      // 0–3: NH₂ с аланина → ПФ → α-КГ (глутамат); 3–6: глутамат → ГДГ → NH₃
      let p;
      if (c < 1.5) p = tmM.ala.position.clone().lerp(plp.position, ease(c / 1.5));
      else if (c < 3) p = plp.position.clone().lerp(tmM.glu.position, ease((c - 1.5) / 1.5));
      else if (c < 5.5) p = tmM.glu.position.clone().lerp(tmM.nh3.position, ease((c - 3) / 2.5));
      else p = tmM.nh3.position.clone();
      nTok.core.position.copy(p); nTok.spr.position.copy(p); nTok.core.visible = nTok.spr.visible = c < 6;
      molFade(tmM.ala, c < 1.5 ? 1 : 0.25); molFade(tmM.pyruvate, c > 1.2 ? 1 : 0.25); molFade(tmM.akg, c < 3 ? 1 : 0.25); molFade(tmM.glu, c > 2.6 && c < 5 ? 1 : 0.25); molFade(tmM.akg2, c > 5 ? 1 : 0.25); molFade(tmM.nh3, c > 5 ? 1 : 0.25);
      Object.values(tmM).forEach((m) => { m.rotation.y += dt * 0.5; }); plp.rotation.y += dt; amines.forEach((m) => { m.rotation.y += dt * 0.4; });
      st.trPh = c < 3 ? 'трансаминирование (АЛТ + ПФ)' : c < 6 ? 'окислительное дезаминирование (ГДГ)' : 'NH₃ → в цикл мочевины';
    }
    if (st.mode === 'urea') {
      const c = st.cyc % 12; const k = Math.floor(c / 2.4); st.uk = k;
      ucArcs.forEach((f, j) => { f.uniforms.uTime.value = t; f.uniforms.uOn.value = j === (k + 3) % 4 ? 1 : 0.25; });
      inArrow.mat.uniforms.uTime.value = t;
      ucM.forEach((m, j) => { m.rotation.y += dt * 0.5; const s = j === k % 4 ? 1.25 : 1; m.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
      carbP.rotation.y += dt; extra.nh3.rotation.y += dt; extra.co2.rotation.y += dt;
      extra.asp.visible = c > 4 && c < 7; extra.asp.position.copy(V3(UCN.x + 3.6, UCN.y - 2.4, 0).lerp(ucM[2].position, ease((c - 4) / 2))); extra.asp.rotation.y += dt;
      extra.fum.visible = c > 7 && c < 9.6; extra.fum.position.copy(ucM[2].position.clone().lerp(V3(UCN.x + 4.6, UCN.y - 0.6, 0), ease((c - 7) / 2.5))); extra.fum.rotation.y += dt;
      urea.visible = c > 9.2; urea.position.copy(ucM[3].position.clone().lerp(V3(UCN.x + 4.4, UCN.y + 2.4, 0), ease((c - 9.2) / 2.5))); urea.rotation.y += dt;
    }
    if (st.mode === 'aro') {
      Object.values(aroM).forEach((m) => { m.rotation.y += dt * 0.4; });
      [...aroArr.map((a) => a.f), toMel, toPPA, toFA].forEach((f) => { f.mat.uniforms.uTime.value = t; });
      aroArr[0].f.mat.uniforms.uOn.value = st.dis === 'pku' ? 0.05 : 1; toPPA.mat.uniforms.uOn.value = st.dis === 'pku' ? 1 : 0.06; toMel.mat.uniforms.uOn.value = st.dis === 'alb' ? 0.05 : 1; toFA.mat.uniforms.uOn.value = st.dis === 'alk' ? 0.25 : 1;
      xPAH.visible = st.dis === 'pku'; xTYR.visible = st.dis === 'alb'; xHGO.visible = st.dis === 'alk';
      aroM.phe.scale.setScalar(st.dis === 'pku' ? 1.35 + 0.1 * Math.sin(t * 3) : 1); melanin.visible = st.dis !== 'alb'; ppa.visible = st.dis === 'pku';
    }
    fx.update(dt);
  }
  const TXT = {
    dig: '<b>Переваривание белков</b> — гидролиз пептидных связей. Белки еды (цепь из разноцветных аминокислот) сначала рубят <b>эндопептидазы</b> — пепсин в желудке, трипсин, химотрипсин и эластаза в кишке, каждая у «своих» аминокислот. Затем <b>экзопептидазы</b> отщепляют аминокислоты по одной с концов. Свободные аминокислоты всасываются в кровь воротной вены. Все протеазы вырабатываются неактивными проферментами — иначе переварили бы железу (при панкреатите так и происходит).',
    trans: '<b>Трансаминирование</b> — переброска аминогруппы с аминокислоты на α-кетокислоту. <b>Аланинаминотрансфераза (АЛТ)</b> переносит NH₂ (синий огонёк) с аланина на α-кетоглутарат через кофермент <b>пиридоксальфосфат</b> (витамин B6): получаются пируват и глутамат. Так азот почти всех аминокислот собирается на глутамате. Затем <b>глутаматдегидрогеназа</b> отщепляет его в виде <b>аммиака</b> (окислительное дезаминирование, + НАДН) — это «непрямое дезаминирование». Внизу — биогенные амины из <b>декарбоксилирования</b> аминокислот: гистамин, серотонин, ГАМК, дофамин.',
    urea: '<b>Орнитиновый цикл</b> (Кребс — Хензелайт) — главный способ обезвредить аммиак; идёт <b>только в печени</b>. В митохондрии NH₃ + CO₂ + 2 АТФ → <b>карбамоилфосфат</b>; он присоединяется к орнитину → <b>цитруллин</b>, который выходит в цитоплазму. Второй атом азота приносит <b>аспартат</b> → аргининосукцинат → отщепляется <b>фумарат</b> (уходит в цикл Кребса) → аргинин. <b>Аргиназа</b> отщепляет от аргинина <b>мочевину</b> и возвращает орнитин. За оборот — 3 АТФ (4 макроэргические связи). Мочевина уходит с кровью в почки: 25–35 г в сутки.',
    aro: '<b>Фенилаланин и тирозин.</b> Фенилаланингидроксилаза превращает незаменимый фенилаланин в тирозин, а из тирозина делаются <b>катехоламины</b> (дофамин → норадреналин → адреналин), <b>гормоны щитовидной железы</b> и пигмент <b>меланин</b>. Остаток распадается до фумарата и ацетоацетата. Наследственные блоки этого пути — классические энзимопатии: выберите болезнь.',
  };
  const DIS = {
    pku: '<b>Фенилкетонурия</b> (1 на ~7000 новорождённых): нет фенилаланингидроксилазы. Фенилаланин и его продукты (фенилпируват — «фенилкетоны» в моче, мышиный запах) копятся и повреждают развивающийся мозг. Всех новорождённых проверяют в первые дни; лечение — диета с ограничением фенилаланина с рождения, и ребёнок развивается нормально.',
    alb: '<b>Альбинизм</b>: дефект <b>тирозиназы</b> — меланин не образуется. Белая кожа и волосы, светлая радужка, светобоязнь, высокий риск ожогов и рака кожи.',
    alk: '<b>Алкаптонурия</b> — первая болезнь, названная «врождённой ошибкой метаболизма» (А. Гаррод, 1902): дефект оксидазы гомогентизиновой кислоты. Моча темнеет на воздухе, к зрелым годам темнеют хрящи (охроноз) и болят суставы.',
  };
  const labels = [
    ...AM_PEP.map((p, k) => ({ text: p.name, pos: enzB[k].position, color: p.color, show: () => st.labels && st.mode === 'dig' && enzB[k].visible })),   // фермент подписан там, где он режет цепь
    { text: 'желудок: пепсин + HCl', pos: V3(-6.4, 2.6, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 < 4.2 },
    { text: 'тонкая кишка', pos: V3(1.5, 2.4, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 >= 3.8 },
    { text: 'аминокислоты → в кровь', pos: V3(2.4, -0.7, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 > 11 },
    ...Object.entries(TM).map(([id, [x, y]]) => ({ text: MOL(id === 'akg2' ? 'akg' : id).name, pos: V3(40 + x - 0.5, y - 0.85, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'trans' })),
    { text: 'АЛТ + пиридоксальфосфат (B6)', pos: V3(40 - 3.6, 2.6, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'trans' },
    { text: 'глутаматдегидрогеназа', pos: V3(40 + 0.4, 2.6, 0), color: '#FFB070', show: () => st.labels && st.mode === 'trans' },
    ...['гистамин', 'серотонин', 'ГАМК', 'дофамин'].map((n, k) => ({ text: n, pos: V3(40 - 4.6 + k * 2.6, -3.1, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'trans' })),
    { text: 'митохондрия', pos: V3(80 - 4.6, 1.6, 0), color: '#FFB070', show: () => st.labels && st.mode === 'urea' },
    { text: 'карбамоилфосфат', pos: V3(80 - 4.0, -0.6, 0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'urea' },
    ...UC.map(([id], k) => ({ text: MOL(id).name, pos: V3(80 + UCN.x + Math.cos(uang(k)) * (UR + 0.9) - 0.5, UCN.y + Math.sin(uang(k)) * (UR + 0.7), 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'urea' })),
    { text: 'мочевина → почки', pos: V3(80 + UCN.x + 4.0, UCN.y + 3.0, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'urea' },
    { text: 'аспартат', pos: V3(80 + UCN.x + 3.4, UCN.y - 2.9, 0), color: '#FF6A6A', show: () => st.labels && st.mode === 'urea' },
    { text: 'фумарат → цикл Кребса', pos: V3(80 + UCN.x + 4.0, UCN.y - 1.1, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'urea' },
    ...AM_ARO.map(([id, [x, y]]) => ({ text: MOL(id).name, pos: V3(120 + x - 0.5, y - 0.85, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'aro' })),
    { text: 'меланин', pos: V3(120 + 0.3, 3.0, 0), color: '#C8A080', show: () => st.labels && st.mode === 'aro' && st.dis !== 'alb' },
    { text: 'фенилпируват', pos: V3(120 - 5.8, -1.7, 0), color: '#9F7BFF', show: () => st.labels && st.mode === 'aro' && st.dis === 'pku' },
    { text: 'гомогентизат → фумарат + ацетоацетат', pos: V3(120 - 3.0, -2.5, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'aro' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = AM_PEP.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'dig' && p ? p.text : st.mode === 'aro' && st.dis !== 'none' ? DIS[st.dis] : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'dig', label: 'Переваривание' }, { id: 'trans', label: 'Трансаминирование' }, { id: 'urea', label: 'Цикл мочевины' }, { id: 'aro', label: 'Фенилаланин и тирозин' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'dig') box.append(h('div', { class: 'glabel' }, 'Фермент'), h('div', { class: 'gctl' }, seg(AM_PEP.map((p) => ({ id: p.id, label: p.name, color: p.color })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
      else if (st.mode === 'aro') box.append(h('div', { class: 'glabel' }, 'Энзимопатия'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Норма' }, { id: 'pku', label: 'Фенилкетонурия', color: '#9F7BFF' }, { id: 'alb', label: 'Альбинизм', color: '#F2E6C8' }, { id: 'alk', label: 'Алкаптонурия', color: '#7FE0A0' }], () => st.dis, (v) => { st.dis = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['dig', 'trans', 'urea', 'aro'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'dig') return [['Работает', st.digPh ? st.digPh.name : '', ''], ['Где', st.digPh ? st.digPh.where : '', '']];
    if (st.mode === 'trans') return [['Этап', st.trPh || '', '']];
    if (st.mode === 'urea') return [['Мочевины в сутки', '25–35', 'г'], ['Аммиак крови', '25–40', 'мкмоль/л']];
    return [['Белка в сутки', '≈ 1', 'г/кг']];
  }
  const self = {
    mobZoom: 1.0, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Биохимия · обмен белков', title: 'Обмен аминокислот и мочевина',
    lede: 'Белки пищи разбираются на аминокислоты; их азот снимается, превращается в ядовитый аммиак — и печень упаковывает его в безопасную мочевину.',
    notes: `
      <div><h2>Азотистый баланс</h2>
        <p>Белки в организме постоянно обновляются (~300 г в сутки). <b>Азотистый баланс</b> — разница между азотом пищи и выведенным: положительный у растущих детей и беременных, отрицательный при голоде, ожогах, тяжёлых болезнях. Норма белка для взрослого — около 1 г на кг массы.</p>
        <h3>Аммиак</h3><p>NH₃ очень токсичен для мозга (связывает α-кетоглутарат и нарушает цикл Кребса в нейронах). Он перевозится в безопасных формах: <b>глутамине</b> (глутаминсинтетаза) и <b>аланине</b> (глюкозо-аланиновый цикл из мышц). В почках глутаминаза отщепляет NH₃, и он уходит с мочой в виде <b>аммонийных солей</b> — это ещё и способ вывести кислоты. При циррозе аммиак не обезвреживается — печёночная энцефалопатия.</p>
        <h3>Судьба углеродного скелета</h3><p>Глюкогенные аминокислоты дают пируват и метаболиты цикла Кребса (из них можно синтезировать глюкозу), кетогенные (лейцин, лизин) — ацетил-КоА и кетоновые тела.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Молекулы — по химическим формулам; ферменты и органы — схематично.</li><li>«Белок» в режиме переваривания — условная цепь из 48 аминокислот.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('dig'); st.fly = null;
  return self;
}
