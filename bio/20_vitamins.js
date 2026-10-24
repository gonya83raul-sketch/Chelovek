// @scene vitamins makeVitamins | Витамины и коферменты | Витамины
/* =========================================================
   БИОХИМИЯ · ВИТАМИНЫ: 13 витаминов и их активные (коферментные) формы,
   НАД⁺ в работе (перенос гидрида, тест Варбурга), витамин A в зрении (родопсин 1U19)
   ========================================================= */
const VT = [
  { id: 'b1', g: 'water', name: 'B1 · тиамин', mol: 'thiamine', co: 'tpp', coName: 'тиаминпирофосфат (ТПФ)', color: '#F2C14E', need: '1,2–1,5 мг', text: '<b>Витамин B1 (тиамин).</b> Кофермент — <b>тиаминпирофосфат</b>: он нужен ферментам, которые отщепляют CO₂ от кетокислот (пируватдегидрогеназа, α-кетоглутаратдегидрогеназа) и транскетолазе. Без него нервная ткань, живущая на глюкозе, голодает. <b>Недостаток</b> — болезнь <b>бери-бери</b> (полиневрит, слабость, сердечная недостаточность), у людей с алкоголизмом — синдром Вернике — Корсакова. <b>Источники:</b> оболочки зёрен, дрожжи, свинина, бобовые.' },
  { id: 'b2', g: 'water', name: 'B2 · рибофлавин', mol: 'riboflavin', co: 'fad', coName: 'ФАД (флавинадениндинуклеотид)', color: '#FFD84A', need: '1,5–1,8 мг', text: '<b>Витамин B2 (рибофлавин)</b> — жёлтый пигмент. Его формы <b>ФМН и ФАД</b> — простетические группы флавопротеинов: сукцинатдегидрогеназы цикла Кребса, ацил-КоА-дегидрогеназы β-окисления, комплекса I дыхательной цепи. Флавиновое кольцо принимает сразу два атома водорода. <b>Недостаток:</b> трещины в углах рта (ангулярный стоматит), хейлит, глоссит, воспаление глаз. <b>Источники:</b> молоко, яйца, печень.' },
  { id: 'b3', g: 'water', name: 'B3 (PP) · ниацин', mol: 'niacin', co: 'nad', coName: 'НАД⁺', color: '#FF8A5C', need: '15–20 мг', text: '<b>Витамин PP (B3, ниацин)</b> — никотиновая кислота и никотинамид. Входит в <b>НАД⁺ и НАДФ⁺</b> — переносчики водорода (гидрид-иона) для сотен дегидрогеназ: гликолиз, цикл Кребса, β-окисление, синтез жиров. Немного ниацина синтезируется из триптофана (≈60 мг Trp → 1 мг). <b>Недостаток — пеллагра</b>, болезнь «трёх Д»: дерматит, диарея, деменция. <b>Источники:</b> мясо, рыба, арахис, грибы.' },
  { id: 'b5', g: 'water', name: 'B5 · пантотеновая кислота', mol: 'pantothenic', co: 'coa', coName: 'коэнзим А', color: '#7FE0A0', need: '5 мг', text: '<b>Витамин B5 (пантотеновая кислота</b>, от греч. «пантос» — повсюду) входит в <b>коэнзим А</b>: его SH-группа на конце (жёлтая сера) переносит остатки кислот. <b>Ацетил-КоА</b> — перекрёсток обмена: в него сходятся углеводы, жиры и аминокислоты. Недостаток почти не встречается («жгучие стопы» у военнопленных).' },
  { id: 'b6', g: 'water', name: 'B6 · пиридоксин', mol: 'pyridoxine', co: 'plp', coName: 'пиридоксальфосфат', color: '#5CC4E0', need: '2 мг', text: '<b>Витамин B6.</b> Активная форма — <b>пиридоксальфосфат</b>: его альдегидная группа (C=O) цепляет аминогруппу аминокислоты. Кофермент <b>трансаминаз</b> (АЛТ, АСТ), <b>декарбоксилаз</b> (синтез ГАМК, серотонина, гистамина, дофамина), синтеза гема. <b>Недостаток:</b> судороги у младенцев, дерматит, анемия; бывает при лечении туберкулёза изониазидом. <b>Источники:</b> мясо, рыба, бананы, зерно.' },
  { id: 'b7', g: 'water', name: 'B7 (H) · биотин', mol: 'biotin', co: 'biotin', coName: 'биотин на лизине карбоксилазы', color: '#C8A8FF', need: '30–50 мкг', text: '<b>Биотин (витамин H, B7)</b> пришивается к лизину <b>карбоксилаз</b> и переносит CO₂: пируваткарбоксилаза (глюконеогенез), ацетил-КоА-карбоксилаза (синтез жиров). Его много синтезируют бактерии кишечника. <b>Недостаток</b> — при поедании сырых яиц: белок <b>авидин</b> намертво связывает биотин (дерматит, выпадение волос).' },
  { id: 'b9', g: 'water', name: 'B9 · фолиевая кислота', mol: 'folate', co: 'methotrexate', coName: 'метотрексат — антивитамин', color: '#7FE0A0', need: '400 мкг', text: '<b>Фолиевая кислота</b> (лат. folium — лист). Её восстановленная форма <b>тетрагидрофолат</b> переносит одноуглеродные группы для синтеза пуринов и тимидина — без неё не удваивается ДНК. <b>Недостаток:</b> мегалобластная анемия, а у плода — дефекты нервной трубки, поэтому её назначают при планировании беременности. <b>Метотрексат</b> (кнопка «Активная форма») — её структурный аналог, противоопухолевый препарат. <b>Источники:</b> зелень, печень, бобовые.' },
  { id: 'b12', g: 'water', name: 'B12 · кобаламин', mol: 'b12', co: 'b12', coName: 'кобаламин (ядро с кобальтом)', color: '#F08AC0', need: '2,4 мкг', text: '<b>Витамин B12 (кобаламин)</b> — самый сложный витамин; в центре кольца-коррина — атом <b>кобальта</b> (розовый). Коферменты метилкобаламин и дезоксиаденозилкобаламин нужны для синтеза метионина и превращения метилмалонил-КоА в сукцинил-КоА. Всасывается только вместе с <b>внутренним фактором Касла</b> из желудка. <b>Недостаток:</b> пернициозная анемия и поражение спинного мозга. Есть только в продуктах животного происхождения — веганам нужны добавки. (Показано ядро молекулы без длинного бокового хвоста.)' },
  { id: 'c', g: 'water', name: 'C · аскорбиновая кислота', mol: 'ascorbic', co: 'ascorbic', coName: 'аскорбиновая кислота', color: '#FFB070', need: '90 мг', text: '<b>Витамин C</b> — восстановитель и антиоксидант. Нужен <b>пролил- и лизилгидроксилазам</b>, которые доделывают коллаген: без витамина C коллаген непрочный. Помогает всасыванию железа. <b>Недостаток — цинга:</b> кровоточивость дёсен, выпадение зубов, плохое заживление ран. Человек, в отличие от большинства животных, сам его не синтезирует. <b>Источники:</b> шиповник, чёрная смородина, сладкий перец, цитрусовые.' },
  { id: 'a', g: 'fat', name: 'A · ретинол', mol: 'retinol', co: 'retinol', coName: 'ретиналь — в режиме «Зрение»', color: '#FF8A5C', need: '0,9 мг', text: '<b>Витамин A (ретинол).</b> Его альдегид <b>11-цис-ретиналь</b> — светочувствительная часть родопсина (режим «Зрение»), а ретиноевая кислота управляет генами роста эпителия. <b>Недостаток:</b> «куриная слепота» (плохое сумеречное зрение), сухость глаз и кожи. Провитамин — <b>β-каротин</b> моркови. Избыток токсичен (печень, плод). <b>Источники:</b> печень, рыбий жир, сливочное масло.' },
  { id: 'd', g: 'fat', name: 'D · кальциферол', mol: 'calciol', co: 'calcitriol', coName: 'кальцитриол — гормон', color: '#F2C14E', need: '15–20 мкг', text: '<b>Витамин D3 (холекальциферол)</b> образуется в коже под ультрафиолетом из производного холестерина. Печень добавляет OH в положение 25, почки — в положение 1: получается гормон <b>кальцитриол</b> (кнопка «Активная форма»), который усиливает всасывание кальция и фосфата в кишечнике. <b>Недостаток:</b> <b>рахит</b> у детей, остеомаляция у взрослых. <b>Источники:</b> солнце, жирная рыба, яйца.' },
  { id: 'e', g: 'fat', name: 'E · токоферол', mol: 'tocopherol', co: 'tocopherol', coName: 'α-токоферол', color: '#E0C060', need: '15 мг', text: '<b>Витамин E (токоферол)</b> — главный антиоксидант мембран. Длинный хвост прячется среди жирных кислот, а кольцо с OH-группой отдаёт атом водорода свободному радикалу и обрывает цепную <b>перекисную реакцию</b> липидов. <b>Недостаток:</b> разрушение эритроцитов, мышечная слабость, нейропатия. <b>Источники:</b> растительные масла, орехи, семечки.' },
  { id: 'k', g: 'fat', name: 'K · филлохинон', mol: 'phylloquinone', co: 'warfarin', coName: 'варфарин — антагонист', color: '#7FE0A0', need: '90–120 мкг', text: '<b>Витамин K</b> нужен ферменту, который превращает остатки глутамата в <b>γ-карбоксиглутамат</b> в факторах свёртывания II, VII, IX, X: только так они связывают кальций и работают. <b>Недостаток</b> — кровоточивость; новорождённым вводят витамин K. <b>Варфарин</b> (кнопка «Активная форма») — антагонист витамина K, лекарство против тромбов. <b>Источники:</b> зелёные листья (K1), бактерии кишечника (K2).' },
];
function makeVitamins() {
  rnd = mulberry(820);
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { water: flyTarget(V3(0, -1.3, 0), V3(0.6, 0.9, 14.5)), fat: flyTarget(V3(0, -1.3, 0), V3(0.6, 0.9, 14.5)), nad: flyTarget(V3(40, -1.0, 0), V3(40.5, 0.6, 12.5)), vision: flyTarget(V3(80, -1.4, 0), V3(81.8, 0.0, 14.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.water.pos);
  const controls = makeControls(camera, VIEW.water.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  /* ---------- 1–2. галерея ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const center = new THREE.Group(); center.position.set(0, 0.85, 0); G1.add(center);
  const cache = {};
  const big = (id) => { if (!cache[id]) { const m = MOL(id); cache[id] = molMesh(m, { scale: molFit(m, 2.35), style: 'ball' }); } return cache[id]; };
  const ring = new THREE.Group(); G1.add(ring);
  const RING = VT.map((v, k) => { const m = MOL(v.mol); const g = molMesh(m, { scale: molFit(m, 0.72), hideH: true }); g.traverse((o) => { if (o.isMesh) o.userData.pick = v.id; }); ring.add(g); const pk = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = v.id; g.add(pk); return { v, g, pk }; });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.16 })); halo.rotation.x = Math.PI / 2; halo.position.y = -1.35; G1.add(halo);
  /* ---------- 3. НАД⁺ в работе ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const nadFull = molMesh(MOL('nad'), { scale: molFit(MOL('nad'), 2.0) }); nadFull.position.set(-2.7, 0.2, -0.5); G2.add(nadFull);
  const nicOx = molMesh(MOL('nicox'), { scale: 0.32 }), nicRed = molMesh(MOL('nicred'), { scale: 0.32 }); [nicOx, nicRed].forEach((m) => { m.position.set(1.4, 0.3, 0); G2.add(m); });
  const lac = molMesh(MOL('lactate'), { scale: 0.3 }), pyr = molMesh(MOL('pyruvate'), { scale: 0.3 }); [lac, pyr].forEach((m) => { m.position.set(4.0, 0.3, 0.3); G2.add(m); });
  const hyd = glowNucleus(G2, V3(0, 0, 0), '#FFE08A', 0.06, 5); const hp = glowNucleus(G2, V3(0, 0, 0), '#9FD8FF', 0.06, 7);
  const ldhBlob = new THREE.Mesh(blobGeo(2.6, 1.9, 1.7, 41, 0.12), glassMat(0xffb070, { rim: 0.2, base: 0.004, pow: 2.6, keep: true })); ldhBlob.position.set(2.7, 0.3, 0); G2.add(ldhBlob);
  /* ---------- 4. зрение: родопсин ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const RH = PDB('rho'); const rhoS = 0.07;
  const rhoG = new THREE.Group(); G3.add(rhoG);
  const rhoM = cartoon(RH.chains[0], { scale: rhoS, k: 0.6, color: (i, n) => new THREE.Color().setHSL(0.55 + 0.35 * i / n, 0.65, 0.62).getStyle() }); rhoG.add(rhoM);
  const ret = molMesh(RH.ligm[0], { scale: rhoS, style: 'space', tint: '#FF9A50' }); rhoG.add(ret);
  const rhoAx = pcaAxis(caPoints('rho', rhoS)); rhoG.quaternion.setFromUnitVectors(rhoAx.v, V3(0, 1, 0));
  const rhoCenter = () => rhoG.position.copy(rhoAx.c.clone().applyQuaternion(rhoG.quaternion).negate()); rhoCenter();
  // мембрана диска вокруг белка: «срез» по середине белка (передняя половина видна) и отверстие под родопсин
  const mem = schemBilayer({ w: 9, d: 4.0, thick: 2.3, step: 0.24, head: '#7FA8D8', tail: '#5A6A80', seed: 9 }); mem.position.z = -2.0; G3.add(mem);
  { const dm = new THREE.Matrix4(), p = V3(), q = new THREE.Quaternion(), sc = V3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    mem.children.forEach((im) => { for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, dm); dm.decompose(p, q, sc); if (Math.hypot(p.x, p.z + mem.position.z) < 1.55) im.setMatrixAt(i, zero); } im.instanceMatrix.needsUpdate = true; }); }
  const retC = (() => { const m = RH.ligm[0]; const c = V3(0, 0, 0); for (let i = 0; i < m.n; i++) c.add(V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return c.multiplyScalar(rhoS / m.n); })();
  const retW = () => retC.clone().applyQuaternion(rhoG.quaternion).add(rhoG.position);
  const photon = glowNucleus(G3, V3(0, 6, 3), '#9FF0FF', 0.08, 12);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'water', sel: 'b1', co: false, labels: true, rot: true, fly: null, cyc: 0, msg: null, nadState: 0 };
  let curMesh = null;
  function placeRing() {
    const list = RING.filter((r) => r.v.g === st.mode || (st.mode !== 'water' && st.mode !== 'fat' && false));
    RING.forEach((r) => { r.g.visible = r.v.g === st.mode; });
    list.forEach((r, k) => { const a = Math.PI * (0.12 + 0.76 * (k + 0.5) / list.length); r.home = V3(-Math.cos(a) * 6.4, -1.75 + Math.sin(a) * 0.25, -3.2 - Math.sin(a) * 1.2); });
  }
  function showVit() {
    if (curMesh) center.remove(curMesh);
    const v = VT.find((x) => x.id === st.sel); curMesh = big(st.co ? v.co : v.mol); center.add(curMesh);
    halo.material.color.set(v.color).multiplyScalar(0.6); refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'water' || m === 'fat'; G2.visible = m === 'nad'; G3.visible = m === 'vision'; st.fly = VIEW[m]; st.cyc = 0; st.msg = null;
    if (G1.visible) { if (VT.find((x) => x.id === st.sel).g !== m) st.sel = VT.find((x) => x.g === m).id; st.co = false; placeRing(); showVit(); }
    refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  function selVit(id) { st.sel = id; st.co = false; showVit(); refs.vitSeg && refs.vitSeg.sync(); refs.coBtn && refs.coBtn.sync(); }
  pickOn(() => self, camera, () => RING.filter((r) => r.g.visible).flatMap((r) => [r.pk]), (id) => selVit(id));
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false;
    flyStep(st, camera, controls, dt); st.cyc += dt;
    if (G1.visible) {
      if (st.rot && curMesh) curMesh.rotation.y += dt * 0.35;
      RING.forEach((r, k) => { if (!r.g.visible) return; r.g.position.lerp(r.home, 1 - Math.exp(-dt * 4)); r.g.rotation.y += dt * 0.6; const on = r.v.id === st.sel; const s = on ? 1.6 : 1; r.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); if (r.on !== on) { r.on = on; molGlow(r.g, on ? 0.25 : 0); } r.lab.copy(r.g.position).add(V3(-0.2, -0.75, 0)); });
    }
    if (st.mode === 'nad') {
      const T = 9, c = st.cyc % T;
      // 0–2 лактат подходит, 2–3.5 перенос H⁻ (и H⁺ в раствор), 3.5–6 НАДН + пируват, 6–8 обратно (обнуление)
      const red = c > 3.2 && c < 7.6; st.nadState = red ? 1 : 0;
      nicOx.visible = !red; nicRed.visible = red; lac.visible = c < 3.2 || c > 7.6; pyr.visible = !lac.visible;
      const app = c < 2 ? 1 - smooth(0, 2, c) : c > 6 ? smooth(6, 7.6, c) : 0;
      lac.position.set(3.3 + app * 2.5, 0.3, 0.3); pyr.position.copy(lac.position);
      [nicOx, nicRed, lac, pyr].forEach((m) => { m.rotation.y = Math.sin(t * 0.5) * 0.5; });
      const tr = c > 2 && c < 3.4; hyd.core.visible = hyd.spr.visible = tr; hp.core.visible = hp.spr.visible = c > 2.6 && c < 4.5;
      if (tr) { const u = (c - 2) / 1.4; hyd.core.position.copy(V3(3.3, 0.3, 0.3).lerp(V3(1.55, 0.35, 0.1), u)); hyd.spr.position.copy(hyd.core.position); fx.spawn(hyd.core.position.clone().add(G2.position), randUnit().multiplyScalar(0.05), new THREE.Color(0xffe08a), 0.5, 0, 1.3); }
      if (hp.core.visible) { const u = (c - 2.6) / 1.9; hp.core.position.copy(V3(3.4, 0.6, 0.3).add(V3(0.6, 1.6, 0.6).multiplyScalar(u))); hp.spr.position.copy(hp.core.position); }
      nadFull.rotation.y += dt * 0.25;
    }
    if (st.mode === 'vision') {
      const T = 7, c = st.cyc % T; const rw = retW();
      const fly = c < 1.6; photon.core.visible = photon.spr.visible = fly;
      if (fly) { const u = c / 1.6; const p = V3(-3.5, 5.5, 3).lerp(rw, u); photon.core.position.copy(p); photon.spr.position.copy(p); }
      const hit = c > 1.6 && c < 4.5; molGlow(ret, hit ? 0.25 + 0.6 * Math.exp(-(c - 1.6) * 0.9) : 0.25);
      if (c > 1.6 && c < 1.7) for (let k = 0; k < 50; k++) fx.spawn(rw.clone().add(G3.position), randUnit().multiplyScalar(1.2), new THREE.Color(0xff9a50), 0.8, 2, 1.4);
      st.visPhase = c < 1.6 ? 'фотон летит' : c < 4.5 ? '11-цис → транс, родопсин активен' : 'восстановление';
      if (st.rot) { rhoG.rotateOnWorldAxis(V3(0, 1, 0), dt * 0.15); rhoCenter(); }
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'nad') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'поглощение света (тест Варбурга)', xl: '240 … 400 нм', yl: 'A' });
    const g = (u, c, s) => Math.exp(-(((u - c) / s) ** 2));
    const nadp = (u) => 0.85 * g(u, 0.125, 0.09), nadh = (u) => 0.75 * g(u, 0.125, 0.09) + 0.3 * g(u, 0.625, 0.11);
    plotLine(ctx, A, nadp, 'rgba(255,255,255,.35)', { lw: 1.2, dash: [3, 3] });
    plotLine(ctx, A, st.nadState ? nadh : nadp, st.nadState ? '#FFE08A' : '#7FD6FF');
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('260', A.X(0.125) - 8, A.Y(0) - 3); ctx.fillText('340 нм', A.X(0.625) - 14, A.Y(0) - 3);
  }
  const TXT = {
    nad: '<b>НАД⁺ в работе.</b> Слева — вся молекула НАД⁺: аденозин, два фосфата и <b>никотинамид</b> (витамин PP) — рабочая часть. В активном центре дегидрогеназы (на примере лактатдегидрогеназы) от лактата отрывается <b>гидрид-ион H⁻</b> (два электрона и протон, жёлтый огонёк) и садится на никотинамидное кольцо: <b>НАД⁺ → НАДН</b>, кольцо теряет ароматичность. Второй протон уходит в раствор. Лактат становится пируватом. На графике — почему это удобно измерять: <b>НАДН поглощает свет 340 нм</b>, а НАД⁺ нет (оптический тест Варбурга — так в лаборатории определяют активность ферментов).',
    vision: '<b>Витамин A в зрении.</b> Реальная структура <b>родопсина</b> (PDB 1U19) — белка палочек сетчатки, семь спиралей пронизывают мембрану. В середине пучка лежит <b>11-цис-ретиналь</b> (альдегид витамина A). Фотон выпрямляет его в <b>полностью-транс</b>-форму за 200 фемтосекунд — белок меняет форму и запускает каскад трансдуцин → фосфодиэстераза → закрытие натриевых каналов. Затем ретиналь отделяется и восстанавливается — для этого нужен витамин A; при его нехватке страдает сумеречное зрение («куриная слепота»).',
  };
  RING.forEach((r) => { r.lab = V3(); });
  const labels = [
    ...RING.map((r) => ({ text: r.v.name.split(' · ')[0], pos: r.lab, color: r.v.color, show: () => st.labels && r.g.visible && G1.visible })),
    { text: 'никотинамид (витамин PP)', pos: V3(40 + 1.4, 1.35, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'nad' },
    { text: 'целая молекула НАД⁺', pos: V3(40 - 2.7, 2.4, -0.5), color: '#D9D2D8', show: () => st.labels && st.mode === 'nad' },
    { text: 'лактат → пируват', pos: V3(40 + 4.0, -0.75, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'nad' },
    { text: 'H⁻', pos: V3(40 + 2.5, 0.75, 0.2), color: '#FFE08A', show: () => st.labels && st.mode === 'nad' && st.cyc % 9 > 2 && st.cyc % 9 < 3.4 },
    { text: 'активный центр ЛДГ', pos: V3(40 + 3.6, 2.1, 0), color: '#FFB070', show: () => st.labels && st.mode === 'nad' },
    { text: 'ретиналь (витамин A)', pos: V3(80.4, 0.4, 0.6), color: '#FF9A50', show: () => st.labels && st.mode === 'vision' },
    { text: 'родопсин · 7 спиралей', pos: V3(81.5, 1.1, 0.8), color: '#9FD0FF', show: () => st.labels && st.mode === 'vision' },
    { text: 'мембрана диска палочки', pos: V3(83.4, -1.5, -0.6), color: '#7FA8D8', show: () => st.labels && st.mode === 'vision' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => {
      if (st.mode === 'water' || st.mode === 'fat') { const v = VT.find((x) => x.id === st.sel); ib.info.innerHTML = v.text + `<br><span style="color:var(--mute)">Сейчас показано: ${st.co ? v.coName : MOL(v.mol).name}. ${ATOMLEG(['C', 'H', 'O', 'N', 'P', 'S'].concat(v.id === 'b12' ? ['Co'] : []))}</span>`; }
      else ib.info.innerHTML = TXT[st.mode];
    };
    refs.modeSeg = seg([{ id: 'water', label: 'Водорастворимые' }, { id: 'fat', label: 'Жирорастворимые' }, { id: 'nad', label: 'Кофермент в работе' }, { id: 'vision', label: 'Витамин A и зрение' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'water' || st.mode === 'fat') {
        refs.vitSeg = seg(VT.filter((v) => v.g === st.mode).map((v) => ({ id: v.id, label: v.name.split(' · ')[0], color: v.color })), () => st.sel, (v) => selVit(v));
        refs.coBtn = toggle('Активная форма', () => st.co, (v) => { st.co = v; showVit(); });
        box.append(h('div', { class: 'glabel' }, 'Витамин', h('kbd', {}, 'клик · C')), h('div', { class: 'gctl' }, refs.vitSeg, refs.coBtn));
      } else box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['water', 'fat', 'nad', 'vision'][n - 1]); return true; }
    if ((k === 'c' || k === 'с') && refs.coBtn && G1.visible) { refs.coBtn.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (G1.visible) { const v = VT.find((x) => x.id === st.sel); const m = MOL(st.co ? v.co : v.mol); return [['Витамин', v.name.split(' · ')[0], ''], ['Атомов', m.n, ''], ['Суточная норма', v.need, '']]; }
    if (st.mode === 'nad') return [['Форма', st.nadState ? 'НАДН' : 'НАД⁺', ''], ['Перенос', '2e⁻ + H⁺', '']];
    return [['Этап', st.visPhase || '', '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · витамины', title: 'Витамины и коферменты',
    lede: 'Тринадцать веществ, которые организм не умеет делать сам. Большинство из них — детали ферментов: без витамина фермент не работает.',
    notes: `
      <div><h2>Что такое витамины</h2>
        <p><b>Витамины</b> — низкомолекулярные органические вещества, необходимые в малых количествах (микро- и миллиграммы в сутки). Они не дают энергии и не служат строительным материалом, но многие из них — <b>предшественники коферментов</b>. Человек их не синтезирует или синтезирует недостаточно.</p>
        <p><b>Водорастворимые</b> (группа B и C) не накапливаются (кроме B12), их нужно получать постоянно. <b>Жирорастворимые</b> (A, D, E, K) всасываются вместе с жирами и запасаются в печени и жировой ткани — поэтому возможна передозировка (гипервитаминоз A и D).</p>
        <h3>Нарушения</h3><p><b>Авитаминоз</b> — полное отсутствие, <b>гиповитаминоз</b> — недостаток, <b>гипервитаминоз</b> — избыток. Причины: бедная пища, нарушение всасывания, повышенная потребность (беременность, рост), подавление кишечной флоры антибиотиками, <b>антивитамины</b> — вещества-конкуренты (метотрексат против B9, варфарин против K, авидин против биотина, изониазид против B6).</p></div>
      <div><h2>Модели</h2><ul><li>Молекулы построены по химическим формулам: <span style="color:#7A7A86">●</span> углерод, <span style="color:#EDEDF2">●</span> водород, <span style="color:#F04848">●</span> кислород, <span style="color:#4F74FF">●</span> азот, <span style="color:#FF9A30">●</span> фосфор, <span style="color:#F2CC3A">●</span> сера.</li><li>Двойные связи показаны двумя палочками.</li><li>Родопсин — реальная структура PDB 1U19; мембрана схематична.</li><li>Кобаламин показан без нуклеотидного хвоста и боковых амидов.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>C</code> активная форма</li><li>клик по малой молекуле — выбрать</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('water'); st.fly = null; RING.forEach((r) => { if (r.home) r.g.position.copy(r.home); });
  return self;
}
