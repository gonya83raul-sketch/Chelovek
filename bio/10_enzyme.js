// @scene enzyme makeEnzyme | Как работает фермент | Ферменты
/* =========================================================
   БИОХИМИЯ · ФЕРМЕНТ: активный центр (лизоцим 1AKI), индуцированное
   соответствие (аденилаткиназа 4AKE↔1AKE), шесть классов ферментов
   ========================================================= */
const EZ_CLASSES = [
  { id: 'ox', name: 'Оксидоредуктазы', color: '#FF8A5C', pdb: 'dhfr', lig: true, mols: [['lactate', 'pyruvate'], 'НАД⁺ → НАДН'], text: '<b>1. Оксидоредуктазы</b> переносят электроны и атомы водорода: дегидрогеназы, оксидазы, каталаза, цитохромы. Почти всегда работают с коферментом-переносчиком — НАД⁺, НАДФ⁺ или ФАД (это производные витаминов B3 и B2). На модели — дигидрофолатредуктаза с коферментом НАДФН (шарики). Пример реакции: лактатдегидрогеназа превращает лактат в пируват.' },
  { id: 'tr', name: 'Трансферазы', color: '#F2C14E', pdb: 'src', lig: true, mols: [['atp', 'adp'], 'фосфат → белок'], text: '<b>2. Трансферазы</b> переносят группу атомов с одной молекулы на другую: киназы — фосфат с АТФ, аминотрансферазы (АЛТ, АСТ) — аминогруппу, метилтрансферазы — метил. На модели — тирозинкиназа Src с аналогом АТФ в активном центре. Киназы включают и выключают сотни белков клетки.' },
  { id: 'hy', name: 'Гидролазы', color: '#7FD6FF', pdb: 'lyz', lig: false, mols: [['sucrose', 'glucose', 'fructose'], '+ H₂O'], text: '<b>3. Гидролазы</b> разрывают связи с помощью воды. Это все пищеварительные ферменты: амилаза (крахмал), сахараза (сахароза → глюкоза + фруктоза), пепсин и трипсин (белки), липаза (жиры). На модели — лизоцим слёз и слюны: он рассекает стенку бактерий.' },
  { id: 'ly', name: 'Лиазы', color: '#7FE0A0', pdb: 'eno', lig: false, mols: [['pg2', 'pep'], '− H₂O'], text: '<b>4. Лиазы</b> отщепляют или присоединяют группы без участия воды и окисления: декарбоксилазы отщепляют CO₂, альдолаза рассекает сахар пополам, енолаза отнимает воду. На модели — енолаза гликолиза: 2-фосфоглицерат → фосфоенолпируват + H₂O. Её блокирует фторид.' },
  { id: 'is', name: 'Изомеразы', color: '#C77DFF', pdb: null, mols: [['dhap', 'gap'], '⇄'], text: '<b>5. Изомеразы</b> перестраивают молекулу, не меняя её состава: превращают один изомер в другой. Триозофосфатизомераза гликолиза за миллисекунды переводит дигидроксиацетонфосфат в глицеральдегид-3-фосфат — один из самых «совершенных» ферментов: скорость ограничена только диффузией.' },
  { id: 'lg', name: 'Лигазы', color: '#FF8AB0', pdb: null, mols: [['pyruvate', 'co2', 'oaa'], '+ АТФ'], text: '<b>6. Лигазы (синтетазы)</b> соединяют две молекулы новой связью и платят за это энергией АТФ. Пируваткарбоксилаза пришивает CO₂ к пирувату (с витамином биотином), ДНК-лигаза сшивает фрагменты ДНК, аминоацил-тРНК-синтетазы присоединяют аминокислоты к тРНК.' },
];
function makeEnzyme() {
  rnd = mulberry(501);
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { site: flyTarget(V3(0.3, -1.0, 0), V3(1.4, 0.2, 9.8)), fit: flyTarget(V3(40, -1.0, 0), V3(41.8, 0.6, 13.5)), classes: flyTarget(V3(80, -3.4, 0), V3(80, 15.5, 20)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.site.pos);
  const controls = makeControls(camera, VIEW.site.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);

  /* ---------- 1. активный центр лизоцима ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const L = PDB('lyz');
  const lyzCart = cartoon(L.chains[0], { scale: 0.1, color: (i, n, s) => s === 'H' ? '#E46FA8' : s === 'E' ? '#F2C14E' : '#9FB4D8' }); G1.add(lyzCart);
  const lyzSurf = surfaceMesh(caPoints('lyz'), { radius: 0.4, res: 72, mat: glassMat(0x9fd0ff, { rim: 0.18, base: 0.005, pow: 2.6, keep: true }) }); G1.add(lyzSurf);
  const RES = {}; L.resm.forEach((r) => { const g = molMesh(r, { scale: 0.1, style: 'ball' }); G1.add(g); RES[r.name] = g; });
  const cent = (r) => { const v = V3(0, 0, 0); for (let i = 0; i < r.n; i++) v.add(V3(r.xyz[i * 3], r.xyz[i * 3 + 1], r.xyz[i * 3 + 2])); return v.multiplyScalar(0.1 / r.n); };
  const siteP = L.resm.map(cent), siteC = siteP.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / siteP.length);
  // ось щели — главная ось точек активного центра
  let axis = V3(1, 0, 0); { let best = 0; for (let k = 0; k < 200; k++) { const d = randUnit(); const s = siteP.reduce((a, p) => a + p.clone().sub(siteC).dot(d) ** 2, 0); if (s > best) { best = s; axis = d; } } }
  const outw = siteC.clone().normalize();
  const catMid = cent(L.resm[0]).add(cent(L.resm[1])).multiplyScalar(0.5);
  const s0 = catMid.clone().sub(siteC).dot(axis) - 3.5 * 0.5;
  const base = siteC.clone().addScaledVector(outw, 0.22);
  const sugarHome = [0, 1, 2, 3, 4, 5].map((k) => base.clone().addScaledVector(axis, s0 + k * 0.5));
  // все сахара ориентированы одинаково: C1 → O4 вдоль щели (цепь β-1,4), связь O4(k) — C1(k+1)
  const GC1 = 4, GO4 = 11; const GM = MOL('glucose'); const gv = (i) => V3(GM.xyz[i * 3], GM.xyz[i * 3 + 1], GM.xyz[i * 3 + 2]);
  const sugQ = new THREE.Quaternion().setFromUnitVectors(gv(GO4).sub(gv(GC1)).normalize(), axis);
  const sugars = sugarHome.map((p, k) => { const g = molMesh(GM, { scale: 0.1, hideH: true, tint: k < 4 ? '#F2E6C8' : '#FFD6A0' }); g.quaternion.copy(sugQ); G1.add(g); return g; });
  const atomW = (g, i) => { g.updateMatrix(); return g.userData.P(i).applyMatrix4(g.matrix); };
  const linkMat = new THREE.MeshPhysicalMaterial({ color: 0xd9d0c0, roughness: 0.3, clearcoat: 0.6, emissive: 0xffc070, emissiveIntensity: 0 });
  const links = [0, 1, 2, 3, 4].map(() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 10), linkMat.clone()); G1.add(m); return m; });
  const pairA = V3(0, 0, 0), pairB = V3(0, 0, 0);
  /* ---------- 2. индуцированное соответствие: аденилаткиназа ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const AO = PDB('adko').chains[0], AC = PDB('adkc').chains[0];
  const dom = (i) => (i >= 121 && i <= 158 ? '#F2C14E' : i >= 29 && i <= 58 ? '#7FE0A0' : '#7FD6FF');
  const gO = cartoon(AO, { scale: 0.1, color: dom }).geometry, gC = cartoon(AC, { scale: 0.1, color: dom }).geometry;
  const adk = new THREE.Mesh(gO.clone(), new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.3, envMapIntensity: 0.55, side: THREE.DoubleSide })); G2.add(adk);
  const pO = gO.attributes.position.array, pC = gC.attributes.position.array;
  const caAt = (ch, i) => V3(ch.ca[i * 3], ch.ca[i * 3 + 1], ch.ca[i * 3 + 2]).multiplyScalar(0.1);
  const avg = (ch, ids) => ids.reduce((a, i) => a.add(caAt(ch, i)), V3(0, 0, 0)).multiplyScalar(1 / ids.length);
  const atpSite = avg(AC, [8, 9, 10, 11, 12, 13, 122, 132, 156, 199]), ampSite = avg(AC, [30, 31, 35, 36, 56, 63, 84, 88]);
  const adkC = avg(AC, [...Array(214).keys()]);
  const outA = atpSite.clone().sub(adkC).normalize(), outB = ampSite.clone().sub(adkC).normalize();
  const mk = (id, tint) => { const g = molMesh(MOL(id), { scale: 0.1, hideH: true, tint }); G2.add(g); return g; };
  const atp = mk('atp'), amp = mk('amp'), adp1 = mk('adp'), adp2 = mk('adp');
  const lidM = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffc070 })); G2.add(lidM);
  /* ---------- 3. классы ферментов ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const ST = EZ_CLASSES.map((c, k) => {
    const a = -Math.PI / 2 + (k / 6) * Math.PI * 2, p = V3(Math.cos(a) * 6.8, 0, Math.sin(a) * 6.8);
    const g = new THREE.Group(); g.position.copy(p); G3.add(g);
    let prot;
    if (c.pdb) {
      // все белки к одному размеру (радиус 1,35) и по центру станции — иначе Src накрывает соседей
      const pts = caPoints(c.pdb, 1); const cen = pts.reduce((q, v) => q.add(v), V3(0, 0, 0)).multiplyScalar(1 / pts.length);
      const sc = 1.35 / Math.max(...pts.map((v) => v.distanceTo(cen)));
      const inner = proteinMesh(c.pdb, { scale: sc, colorBy: () => c.color }); inner.position.copy(cen).multiplyScalar(-sc);
      if (c.lig) PDB(c.pdb).ligm.forEach((m) => inner.add(molMesh(m, { scale: sc, style: 'ball' })));
      prot = new THREE.Group(); prot.add(inner);
    } else {
      prot = new THREE.Group();
      const b = new THREE.Mesh(blobGeo(1.25, 1.0, 1.15, k + 2, 0.13), protMat(c.color, 0.3)); prot.add(b);
    }
    prot.traverse((o) => { if (o.isMesh) o.userData.pick = c.id; });
    g.add(prot);
    // реакция: молекулы над ферментом
    const ms = c.mols[0].map((id, j) => { const m = molMesh(MOL(id), { scale: 0.095, hideH: true }); m.position.set((j - (c.mols[0].length - 1) / 2) * 1.35, 2.55, 0); g.add(m); return m; });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(c.color), transparent: true, opacity: 0.35 })); ring.rotation.x = Math.PI / 2; ring.position.y = -1.9; g.add(ring);
    return { c, g, prot, ms, ring, p };
  });
  const pick3 = []; ST.forEach((s) => s.prot.traverse((o) => { if (o.isMesh) pick3.push(o); }));

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'site', labels: true, rot: false, fly: null, surf: true, slow: false, cyc: 0, cls: null, msg: null, phase: '' };
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'site'; G2.visible = m === 'fit'; G3.visible = m === 'classes'; st.fly = VIEW[m]; st.cls = null; st.msg = null; st.cyc = 0; refs.clsSeg && refs.clsSeg.sync(); refs.setInfo && refs.setInfo(); scopeShow(m !== 'classes');
  }
  function selCls(id) {
    st.cls = id; if (st.mode !== 'classes') setMode('classes'); st.cls = id;
    const s = ST.find((x) => x.c.id === id); const wp = s.p.clone().add(G3.position);
    st.fly = flyTarget(wp.clone().add(V3(0, 0.1, 0)), wp.clone().add(s.p.clone().normalize().multiplyScalar(5.6)).add(V3(0, 1.6, 0)));
    refs.clsSeg && refs.clsSeg.sync(); refs.setInfo();
  }
  pickOn(() => self, camera, () => pick3, (id) => selCls(id));
  const ease = (x) => x * x * (3 - 2 * x);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    st.cyc += dt * (st.slow ? 0.4 : 1);
    lyzSurf.visible = st.surf;
    if (st.mode === 'site') {
      const T = 11, c = st.cyc % T;
      const appr = c < 3 ? 1 - ease(c / 3) : 0, cut = c > 5.4, leave = c > 6 ? ease(Math.min(1, (c - 6) / 3.4)) : 0, fade = c > 10 ? 1 - (c - 10) : 1;
      st.phase = c < 3 ? 'связывание' : c < 5.4 ? 'катализ' : c < 6 ? 'разрыв связи' : 'уход продуктов';
      sugars.forEach((g, k) => {
        const p = sugarHome[k].clone().addScaledVector(outw, appr * 2.6 + leave * 2.2).addScaledVector(axis, (k < 4 ? -1 : 1) * leave * 1.6);
        g.position.copy(p); g.rotation.y += dt * 0.2 * (appr + leave); molFade(g, Math.max(0.05, fade));
      });
      links.forEach((m, k) => { const a = atomW(sugars[k], GO4), b = atomW(sugars[k + 1], GC1); m.position.copy(a).lerp(b, 0.5); const d = b.clone().sub(a); m.scale.y = Math.max(0.01, d.length()); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); m.visible = !(k === 3 && cut); m.material.emissiveIntensity = k === 3 && c > 3.5 && c < 5.4 ? 0.6 + 0.6 * Math.sin(t * 14) : 0; });
      const act = c > 3 && c < 5.6 ? 1 : 0;
      molGlow(RES.GLU35, act * (0.4 + 0.3 * Math.sin(t * 9))); molGlow(RES.ASP52, act * (0.3 + 0.3 * Math.sin(t * 9 + 1)));
      if (act && rnd() < 0.5) { pairA.copy(cent(L.resm[0])); pairB.copy(sugars[3].position).lerp(sugars[4].position, 0.5); fx.spawn(pairA.clone().lerp(pairB, rnd()), randUnit().multiplyScalar(0.05), new THREE.Color(0xffd070), 0.5, 0, 1.3); }
      if (c > 5.4 && c < 5.5) for (let k = 0; k < 40; k++) fx.spawn(sugars[3].position.clone().lerp(sugars[4].position, 0.5), randUnit().multiplyScalar(0.7), new THREE.Color(0xffc070), 0.7, 2, 1.4);
      st.prog = c < 3 ? c / 3 * 0.25 : c < 5.4 ? 0.25 + (c - 3) / 2.4 * 0.45 : c < 9 ? 0.7 + (c - 5.4) / 3.6 * 0.3 : 1;
    }
    if (st.mode === 'fit') {
      const T = 12, c = st.cyc % T;
      const inS = c < 3 ? ease(c / 3) : 1, close = c < 3 ? 0 : c < 5 ? ease((c - 3) / 2) : c < 7.5 ? 1 : c < 9.5 ? 1 - ease((c - 7.5) / 2) : 0, out = c > 7.5 ? ease(Math.min(1, (c - 7.5) / 3.5)) : 0;
      st.phase = c < 3 ? 'субстраты подходят' : c < 5 ? 'фермент смыкается' : c < 7.5 ? 'перенос фосфата' : 'фермент раскрывается';
      st.close = close;
      LBF.forEach(([l, ids, off]) => { l.pos.copy(avg(AO, ids).lerp(avg(AC, ids), close)).add(off); });
      const P = adk.geometry.attributes.position.array; for (let i = 0; i < P.length; i++) P[i] = pO[i] + (pC[i] - pO[i]) * close;
      adk.geometry.attributes.position.needsUpdate = true; if (((st.t * 30) | 0) % 2 === 0) adk.geometry.computeVertexNormals();
      const done = c > 6.2;
      atp.visible = amp.visible = !done; adp1.visible = adp2.visible = done;
      const pa = atpSite.clone().addScaledVector(outA, (1 - inS) * 2.4 + out * 2.6 + 0.12 * (1 - close)), pb = ampSite.clone().addScaledVector(outB, (1 - inS) * 2.4 + out * 2.6 + 0.12 * (1 - close));
      atp.position.copy(pa); adp1.position.copy(pa); amp.position.copy(pb); adp2.position.copy(pb);
      [atp, amp, adp1, adp2].forEach((g) => { g.rotation.y += dt * 0.3 * (1 - close); });
      lidM.visible = c > 5 && c < 6.4; if (lidM.visible) { const u = (c - 5) / 1.4; lidM.position.copy(pa).lerp(pb, u); fx.spawn(lidM.position.clone(), randUnit().multiplyScalar(0.05), new THREE.Color(0xffa040), 0.5, 0, 1.4); }
      st.prog = c < 3 ? c / 3 * 0.25 : c < 5 ? 0.25 + (c - 3) / 2 * 0.2 : c < 7.5 ? 0.45 + (c - 5) / 2.5 * 0.3 : 0.75 + Math.min(1, (c - 7.5) / 3.5) * 0.25;
    }
    if (st.mode === 'classes') {
      ST.forEach((s, k) => { s.prot.rotation.y += dt * 0.25; s.ms.forEach((m, j) => { m.rotation.y += dt * 0.5; m.position.y = 2.55 + 0.08 * Math.sin(t * 1.3 + j + k); }); s.ring.material.opacity = st.cls === s.c.id ? 0.9 : 0.3; });
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'classes') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'энергия реакции', xl: 'ход реакции →', yl: 'энергия' });
    const prof = (u, Ea, es) => { const s = 0.62, p = 0.22; let v = s + (p - s) * smooth(0.35, 0.75, u); v += Ea * Math.exp(-(((u - 0.55) / 0.12) ** 2)); if (es) v -= es * Math.exp(-(((u - 0.33) / 0.08) ** 2)); return v; };
    plotLine(ctx, A, (u) => prof(u, 0.36, 0), 'rgba(255,106,106,.7)', { dash: [4, 4], lw: 1.5 });
    plotLine(ctx, A, (u) => prof(u, 0.12, 0.06), '#7FD6FF', { lw: 2 });
    const u = clamp(st.prog || 0, 0, 1); ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(u), A.Y(prof(u, 0.12, 0.06)), 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,140,140,.9)'; ctx.fillText('без фермента', A.X(0.6), A.Y(0.98)); ctx.fillStyle = '#9FD8FF'; ctx.fillText('с ферментом', A.X(0.66), A.Y(0.72));
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText('S', A.X(0.04), A.Y(0.66)); ctx.fillText('P', A.X(0.94), A.Y(0.26));
  }
  const TXT = {
    site: '<b>Активный центр</b> — небольшой участок фермента, где идёт реакция. Его аминокислоты разбросаны по цепи, но при сворачивании белка сходятся вместе. Это <b>лизоцим</b> из слёз и слюны (реальная структура 1AKI): в щель ложится цепочка сахаров клеточной стенки бактерии. <b>Glu35</b> отдаёт протон и рвёт связь между 4-м и 5-м сахаром, <b>Asp52</b> удерживает промежуточное состояние; триптофаны 62, 63, 108 и Asp101 — «якорный» участок, который узнаёт и держит субстрат.',
    fit: '<b>Индуцированное соответствие</b> (Д. Кошланд). Фермент не жёсткий «замок» Э. Фишера: субстрат заставляет его перестроиться. <b>Аденилаткиназа</b> (две реальные структуры, 4AKE и 1AKE) хватает АТФ и АМФ, захлопывает «крышку» (жёлтая) и «карман» (зелёный) и перебрасывает фосфат: АТФ + АМФ → 2 АДФ. Закрытый фермент выдавливает воду — иначе она разрушила бы АТФ впустую.',
    classes: '<b>Шесть классов ферментов</b> по типу реакции (международная классификация КФ). Номер класса — первая цифра шифра фермента. Нажмите на класс или на модель.',
  };
  const labels = [
    { text: 'Glu35 · отдаёт протон', pos: cent(L.resm[0]).addScaledVector(outw, 0.5).add(V3(0.25, -0.35, 0)), color: '#FF8A5C', show: () => st.labels && st.mode === 'site' },
    { text: 'Asp52', pos: cent(L.resm[1]).addScaledVector(outw, 0.3).add(V3(0.15, 0.4, 0)), color: '#FF6A6A', show: () => st.labels && st.mode === 'site' },
    { text: 'якорные Trp62 · 63 · 108', pos: cent(L.resm[3]).addScaledVector(outw, 0.4).add(V3(0, 0.3, 0)), color: '#B8A6FF', show: () => st.labels && st.mode === 'site' },
    { text: 'субстрат: цепь сахаров', pos: sugarHome[0].clone().addScaledVector(outw, 0.7), color: '#F2E6C8', show: () => st.labels && st.mode === 'site' },
    { text: 'крышка (LID)', pos: avg(AO, [130, 140, 150]).add(V3(40.3, 0.3, 0)), color: '#F2C14E', show: () => st.labels && st.mode === 'fit' },
    { text: 'карман для АМФ', pos: avg(AO, [35, 45, 55]).add(V3(40.3, 0.2, 0)), color: '#7FE0A0', show: () => st.labels && st.mode === 'fit' },
    { text: 'ядро фермента', pos: avg(AO, [80, 100, 180, 200]).add(V3(40.4, -0.6, 0)), color: '#7FD6FF', show: () => st.labels && st.mode === 'fit' },
    ...ST.map((s) => ({ text: s.c.name, pos: s.p.clone().add(V3(80, -2.35, 0)), color: s.c.color, show: () => st.labels && st.mode === 'classes' })),
    ...ST.map((s) => ({ text: s.c.mols[1], pos: s.p.clone().add(V3(80 - 0.4, 3.35, 0)), color: '#D9D2D8', show: () => st.labels && st.mode === 'classes' && (!st.cls || st.cls === s.c.id) })),
  ];
  const LBF = [[labels[4], [130, 140, 150], V3(40.3, 0.3, 0)], [labels[5], [35, 45, 55], V3(40.3, 0.2, 0)], [labels[6], [80, 100, 180, 200], V3(40.4, -0.6, 0)]];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 420px');
    refs.setInfo = () => { const c = EZ_CLASSES.find((x) => x.id === st.cls); ib.info.innerHTML = st.msg || (st.mode === 'classes' && c ? c.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'site', label: 'Активный центр' }, { id: 'fit', label: 'Индуцированное соответствие' }, { id: 'classes', label: 'Классы ферментов' }], () => st.mode, (v) => setMode(v));
    refs.clsSeg = seg(EZ_CLASSES.map((c) => ({ id: c.id, label: c.name, color: c.color })), () => st.cls, (v) => selCls(v));
    const surf = toggle('Поверхность', () => st.surf, (v) => { st.surf = v; });
    const slow = toggle('Замедлить', () => st.slow, (v) => { st.slow = v; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, slow });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Классы', h('kbd', {}, 'клик')), refs.clsSeg), group('Вид', 'S · R · N', surf, slow, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['site', 'fit', 'classes'][n - 1]); return true; }
    if (k === 's' || k === 'ы') { refs.slow.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'site') return [['Лизоцим', '129', 'аминокислот'], ['Этап', st.phase, '']];
    if (st.mode === 'fit') return [['Крышка закрыта', Math.round((st.close || 0) * 100), '%'], ['Этап', st.phase, '']];
    return [['Классов', '6', ''], ['Ускорение реакций', '10⁶–10¹²', 'раз']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Биохимия · ферменты', title: 'Как работает фермент',
    lede: 'Белок-катализатор узнаёт свою молекулу, обнимает её активным центром и ускоряет реакцию в миллионы раз. Модели построены по реальным атомным структурам.',
    notes: `
      <div><h2>Ферменты</h2>
        <p><b>Ферменты (энзимы)</b> — биологические катализаторы белковой природы. От других катализаторов их отличают три свойства: огромная <b>эффективность</b>, строгая <b>специфичность</b> и способность к <b>регуляции</b>.</p>
        <p><b>Простые</b> ферменты состоят только из белка (пепсин, амилаза, липаза). <b>Сложные</b> — из белковой части (<b>апофермента</b>) и небелкового <b>кофактора</b>: прочно связанного — <b>простетической группы</b> (ионы металлов, гем) или легко отделяемого <b>кофермента</b> (чаще всего производного витамина). Вместе они — <b>холофермент</b>.</p>
        <h3>Как фермент ускоряет реакцию</h3>
        <p>Фермент не меняет энергию исходных веществ и продуктов, но снижает <b>энергию активации</b> — барьер, который нужно преодолеть (график справа). Механизмы: точная <b>ориентация</b> субстрата (связывание минимум в трёх точках), <b>напряжение</b> его связей, <b>кислотно-основный</b> катализ (как Glu35 и Asp52 лизоцима, гистидин многих ферментов) и <b>ковалентный</b> катализ.</p>
        <p>Стадии по Михаэлису — Ментен: E + S ⇄ ES → ES* → EP → E + P.</p></div>
      <div><h2>Специфичность</h2><ul>
        <li><b>Абсолютная</b> — один субстрат (аргиназа → только аргинин).</li>
        <li><b>Относительная</b> — группа похожих (липаза — все жиры, пепсин — белки).</li>
        <li><b>Стереоспецифичность</b> — только один изомер (L- или D-).</li>
        <li><b>Специфичность пути</b>: из гистидина гистидаза делает кетокислоту, а декарбоксилаза — гистамин.</li></ul>
        <h2 style="margin-top:22px">Модели</h2><ul><li>Лизоцим — PDB 1AKI; аденилаткиназа — 4AKE и 1AKE; ДГФР — 1RX1; Src — 2SRC; енолаза — 3ENL. Изомераза и лигаза показаны схематично.</li><li>Субстрат лизоцима показан цепочкой глюкоз (в стенке бактерий — родственные сахара NAG и NAM).</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>S</code> замедлить</li><li>клик по ферменту — класс</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('site'); st.fly = null;
  return self;
}
