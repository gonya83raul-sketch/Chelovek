// @scene lipoprot makeLipoprot | Холестерин и липопротеины | Липиды
/* =========================================================
   БИОХИМИЯ · ЛИПОПРОТЕИНЫ: ХМ, ЛПОНП, ЛПНП, ЛПВП (реальный диск апоA-I + липиды),
   транспорт жиров и холестерина, атеросклероз, синтез холестерина и статины
   ========================================================= */
const LP = [
  { id: 'cm', name: 'Хиломикрон', R: 1.7, core: '#E8C060', apo: '#FF8AB0', size: '75–1200 нм', text: '<b>Хиломикроны</b> — самые крупные (75–1200 нм, на модели уменьшен в 4 раза) и самые лёгкие частицы: 85–90% — пищевые <b>триацилглицерины</b>. Собираются в клетках кишечника, уходят в лимфу, затем в кровь. Белки: апоB-48, апоC-II, апоE. После жирной еды плазма мутнеет («хилёзная») на несколько часов.' },
  { id: 'vldl', name: 'ЛПОНП', R: 1.25, core: '#F2C14E', apo: '#C77DFF', size: '30–80 нм', text: '<b>ЛПОНП</b> (липопротеины очень низкой плотности, 30–80 нм) делает <b>печень</b>; в них 50–60% эндогенных триацилглицеринов, синтезированных из избытка углеводов. Главный белок — апоB-100. Отдав жир тканям, превращаются в ЛППП и затем в ЛПНП.' },
  { id: 'ldl', name: 'ЛПНП', R: 0.55, core: '#FF9A50', apo: '#C77DFF', size: '18–25 нм', text: '<b>ЛПНП</b> (низкой плотности, 18–25 нм) — главные переносчики <b>холестерина</b> (около 45% массы — его эфиры) от печени к тканям. Один огромный белок <b>апоB-100</b> обвивает частицу и узнаётся ЛПНП-рецепторами клеток. При избытке ЛПНП проникают в стенку артерий — поэтому их называют «плохим холестерином».' },
  { id: 'hdl', name: 'ЛПВП', R: 0.26, core: '#FFB070', apo: '#7FD6FF', size: '5–12 нм', text: '<b>ЛПВП</b> (высокой плотности, 5–12 нм) — наполовину белок (апоA-I). Рождаются в печени и кишке плоскими дисками (справа — <b>реальная модель</b> такого диска: два кольца апоA-I обнимают кусочек бислоя), собирают лишний холестерин с клеток и стенок сосудов, фермент ЛХАТ превращает его в эфиры, и частица становится шаром. Холестерин уходит в печень — <b>обратный транспорт</b>, «хороший холестерин».' },
];
function makeLipoprot() {
  rnd = mulberry(1601);
  const scene = bioStage({ rim: 0xff8ab0 });
  const VIEW = { part: flyTarget(V3(0.6, -1.5, 0), V3(0.6, 0.6, 19)), trans: flyTarget(V3(40, -0.9, 0), V3(40.6, 1.2, 18.5)), athero: flyTarget(V3(80, -1.2, 0), V3(81.5, 1.6, 15)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.part.pos);
  const controls = makeControls(camera, VIEW.part.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);
  const headMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8C07A').multiplyScalar(0.3), roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.35 });
  function particle(d, sc = 1) {
    const g = new THREE.Group(); const R = d.R * sc;
    const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.86, 40, 28), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(d.core).multiplyScalar(0.36), roughness: 0.45, clearcoat: 0.3, envMapIntensity: 0.4, emissive: new THREE.Color(d.core), emissiveIntensity: 0.015 })); g.add(core);
    const n = Math.round(Math.min(1400, 260 * (R / 0.5) ** 2)); const pts = [];
    for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = i * 2.39996; const v = V3(Math.cos(a) * r, y, Math.sin(a) * r); if (v.z < 0.25) pts.push(v); }
    const hm = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), headMat, pts.length); const dm = new THREE.Object3D();
    const hr = Math.max(0.025, 0.06 * Math.sqrt(R / 0.6)); pts.forEach((v, i) => { dm.position.copy(v).multiplyScalar(R); dm.scale.setScalar(hr); dm.updateMatrix(); hm.setMatrixAt(i, dm.matrix); }); g.add(hm);
    // апопротеин — лента-пояс
    const belt = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 2; belt.push(V3(Math.cos(a) * R * 1.02, Math.sin(a * 3) * R * 0.18, Math.sin(a) * R * 1.02)); }
    const apo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(belt, true), 200, Math.max(0.03, R * 0.06), 8, true), protMat(d.apo, 0.45)); apo.rotation.x = 0.5; g.add(apo);
    return g;
  }
  /* ---------- 1. частицы ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const XS = [-4.6, -1.5, 0.75, 1.95];
  const PP = LP.map((d, k) => { const g = particle(d); g.position.set(XS[k], 0.6, 0); G1.add(g); const pk = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.5, d.R), 10, 8), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = d.id; g.add(pk); return { d, g }; });
  // реальный диск ЛПВП
  const disc = new THREE.Group(); disc.position.set(5.2, 0.7, 0); G1.add(disc);
  const AP = PDB('apoa'); const dsc = 0.032;
  AP.chains.forEach((c, k) => disc.add(cartoon(c, { scale: dsc, color: k ? '#7FD6FF' : '#9FE0FF', k: 0.6 })));
  { const d = BIO_PDB.apol; const el = d.el.split(' '); const L = el.length; const xyz = dI16(d.xyz, 20); const byE = {}; const iP = el.indexOf('P'); for (let l = 0; l < d.n; l++) { if (iP >= 0 && Math.hypot(xyz[(l * L + iP) * 3], xyz[(l * L + iP) * 3 + 1]) > 36) continue; for (let i = 0; i < L; i++) { const k = (l * L + i) * 3; (byE[el[i]] = byE[el[i]] || []).push([xyz[k] + d.center[0] - 0, xyz[k + 1] + d.center[1], xyz[k + 2] + d.center[2]]); } } // углы квадратного фрагмента за поясом апоA-I отброшены
    const cen = AP.chains.length ? null : null; const dm = new THREE.Object3D();
    // центр липидов совмещаем с центром белка (оба центрированы в своих системах — у белка свой центр)
    const offs = V3(...d.center).sub(V3(0, 0, 0));
    for (const [e, list] of Object.entries(byE)) { const im = new THREE.InstancedMesh(SPH_LO, e === 'C' ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C9B98A').multiplyScalar(0.45), roughness: 0.6 }) : atomMat(e), list.length); list.forEach(([x, y, z], i) => { dm.position.set(x, y, z).sub(offs).multiplyScalar(dsc); dm.scale.setScalar((RVDW[e] || 1.6) * 0.75 * dsc); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); }); disc.add(im); } }
  disc.rotation.x = 1.1;
  /* ---------- 2. транспорт ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.16 });
  const liver = new THREE.Mesh(blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), organMat('#B0523A', 0.5)); liver.position.set(-0.35, 1.55, 0.15); G2.add(liver);
  const gut = new THREE.Mesh(tube([V3(-0.42, 1.02, 0.25), V3(0.38, 1.02, 0.25), V3(0.44, 0.93, 0.25), V3(-0.36, 0.84, 0.25), V3(-0.42, 0.74, 0.25), V3(0.38, 0.66, 0.25), V3(0.44, 0.56, 0.25), V3(-0.36, 0.48, 0.25)], 0.07, 160, 10), organMat('#E8A0A0', 0.45)); G2.add(gut); // петли тонкой кишки
  const adip = new THREE.Mesh(ell3(0.5, 0.3, 0.25, V3(0.95, 0.4, 0.3)), organMat('#F2D08A', 0.38)); G2.add(adip);
  const mus = new THREE.Mesh(tube([V3(-0.47, -0.3, 0.05), V3(-0.5, -1.2, 0.08), V3(-0.48, -2.0, 0.06)], 0.24), organMat('#C0504A', 0.4)); G2.add(mus);
  const art = new THREE.Mesh(tube([V3(0.5, -0.3, 0.12), V3(0.52, -1.2, 0.14), V3(0.5, -2.0, 0.12)], 0.08), organMat('#FF6A6A', 0.45)); G2.add(art);
  const PATHS = [
    { id: 'cm', c: '#E8C060', pts: [V3(0.1, 0.85, 0.3), V3(-0.6, 2.2, 0.2), V3(0.2, 2.4, 0.2), V3(0.9, 0.6, 0.35), V3(-0.4, -0.6, 0.1), V3(-0.4, 1.4, 0.35)], s0: 1, s1: 0.45 },
    { id: 'vldl', c: '#C77DFF', pts: [V3(-0.1, 1.6, 0.4), V3(0.8, 0.55, 0.4), V3(-0.45, -0.8, 0.15), V3(0.45, -1.0, 0.2)], s0: 0.8, s1: 0.4 },
    { id: 'ldl', c: '#FF9A50', pts: [V3(0.45, -1.0, 0.2), V3(0.5, -1.6, 0.18), V3(0.2, 0.0, 0.3), V3(-0.2, 1.4, 0.35)], s0: 0.4, s1: 0.4 },
    { id: 'hdl', c: '#7FD6FF', pts: [V3(-0.45, 1.3, 0.35), V3(0.55, -1.4, 0.22), V3(-0.5, -1.3, 0.12), V3(-0.3, 1.5, 0.35)], s0: 0.22, s1: 0.32 },
  ];
  PATHS.forEach((p) => { p.lab = V3(0, 0, 0); p.curve = new THREE.CatmullRomCurve3(p.pts); const f = flowTubeMat(p.c, 0.3, 2); f.uniforms.uOn.value = 0.5; G2.add(new THREE.Mesh(new THREE.TubeGeometry(p.curve, 80, 0.03, 6), f)); p.mat = f; p.balls = [0, 1, 2].map((k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(p.c).multiplyScalar(0.6), emissive: new THREE.Color(p.c), emissiveIntensity: 0.3, roughness: 0.3, clearcoat: 0.6 })); G2.add(m); return { m, u: k / 3 }; }); });
  /* ---------- 3. атеросклероз ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const wallG = new THREE.Group(); wallG.position.set(0, 0.4, 0); G3.add(wallG);
  const half = (r, color, op = 1) => { const g = new THREE.CylinderGeometry(r, r, 9, 64, 1, true, 0, Math.PI); g.rotateZ(Math.PI / 2); const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.22), roughness: 0.6, side: THREE.DoubleSide, transparent: op < 1, opacity: op, envMapIntensity: 0.25 })); m.rotation.x = -Math.PI / 2 - 0.35; wallG.add(m); return m; };
  half(2.3, '#C05050'); half(2.0, '#E08080'); half(1.75, '#F0B0B0');
  const plaque = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x8a6a20, roughness: 0.4, clearcoat: 0.5, emissive: 0x5a3a08, emissiveIntensity: 0.15 })); const PN = V3(0, 0.8, 0.6).normalize(), PX = V3(1, 0, 0), PT = PX.clone().cross(PN), PB = wallG.position.clone().addScaledVector(PN, -1.72).add(V3(0.3, 0, 0)); // бляшка на интиме дна жёлоба, купол — по нормали к оси
  plaque.material.transparent = true; plaque.material.opacity = 0.7; plaque.material.depthWrite = false; plaque.position.copy(PB); plaque.quaternion.setFromUnitVectors(V3(0, 1, 0), PN); G3.add(plaque);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1.04, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xd8c8c0, roughness: 0.4, transparent: true, opacity: 0.45, depthWrite: false })); cap.position.copy(plaque.position); cap.quaternion.copy(plaque.quaternion); G3.add(cap);
  const foam = []; for (let k = 0; k < 7; k++) { const g = new THREE.Group(); const b = new THREE.Mesh(blobGeo(0.2, 0.16, 0.18, k + 60, 0.12, 3), protMat('#E0C8A0', 0.4)); g.add(b); for (let q = 0; q < 5; q++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0xc8a030, emissive: 0xc8a030, emissiveIntensity: 0.25 })); s.position.copy(randUnit().multiplyScalar(0.1)); g.add(s); } g.userData.l = V3(rand(-0.6, 0.6), rand(0.15, 0.5), rand(-0.5, 0.5)); G3.add(g); foam.push(g); }
  const LDLB = []; for (let k = 0; k < 16; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0xb06a30, emissive: 0xff9a50, emissiveIntensity: 0.25, roughness: 0.3 })); G3.add(m); LDLB.push({ m, p: V3(rand(-4, 4), rand(-0.6, 1.2), rand(-0.6, 0.8)), v: V3(1, 0, 0), in: false, age: 0 }); }
  const HDLB = []; for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0x3a7aa0, emissive: 0x7fd6ff, emissiveIntensity: 0.35 })); G3.add(m); HDLB.push({ m, p: V3(rand(-4, 4), rand(-0.6, 1.2), rand(-0.6, 0.8)) }); }
  const statin = molMesh(MOL('simvastatin'), { scale: 0.09, hideH: true }); statin.position.set(3.2, 2.3, 0.4); G3.add(statin);
  const chainM = ['acetyl', 'hmgcoa', 'mevalonate', 'cholesterol'].map((id, k) => { const m = molMesh(MOL(id), { scale: id === 'cholesterol' ? 0.075 : 0.11, hideH: true }); m.position.set(-3.6 + k * 1.75, 2.6, 0.3); G3.add(m); return m; });
  const synA = [0, 1, 2].map((k) => flowArrow(G3, chainM[k].position.clone().add(V3(0.5, 0, 0)), chainM[k + 1].position.clone().add(V3(-0.5, 0, 0)), '#D9D2D8', { bend: 0.1, r: 0.02 })); // путь синтеза холестерина
  const block = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff5a5a })); block.position.copy(synA[1].curve.getPoint(0.5)).add(V3(0, 0, 0.1)); G3.add(block);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'part', labels: true, rot: true, fly: null, sel: null, msg: null, ldl: 3.0, stat: false, years: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['part', 'trans', 'athero'][k] === m; }); st.fly = VIEW[m]; st.sel = null; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => PP.map((p) => p.g.children[p.g.children.length - 1]), (id) => { st.sel = id; refs.setInfo(); refs.lpSeg && refs.lpSeg.sync(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt);
    if (st.mode === 'part') { if (st.rot) { PP.forEach((p) => { p.g.rotation.y += dt * 0.25; }); disc.rotation.z += dt * 0.2; } PP.forEach((p) => { const s = st.sel === p.d.id ? 1.12 : 1; p.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); }); }
    if (st.mode === 'trans') PATHS.forEach((p) => { p.mat.uniforms.uTime.value = t; p.balls.forEach((b) => { b.u = (b.u + dt * 0.08) % 1; b.m.position.copy(p.curve.getPointAt(b.u)); b.m.scale.setScalar(p.s0 + (p.s1 - p.s0) * b.u); }); p.lab.copy(p.balls[0].m.position).add(G2.position).add(V3(0.08, 0.06, 0)); /* бегущая подпись потока */ });
    if (st.mode === 'athero') {
      const ldl = st.stat ? st.ldl * 0.55 : st.ldl;
      st.years = Math.min(60, st.years + dt * 2.5);
      const grow = clamp((ldl - 1.8) / 4, 0, 1) * smooth(0, 60, st.years);
      plaque.scale.set(0.4 + 1.6 * grow, 0.08 + 0.9 * grow, 0.5 + 0.6 * grow); cap.scale.copy(plaque.scale).multiplyScalar(1.03);
      foam.forEach((f, k) => { f.visible = (k + 1) / 7 < grow * 1.3; const l = f.userData.l, sc = plaque.scale; f.position.copy(PB).addScaledVector(PX, l.x * sc.x).addScaledVector(PN, l.y * sc.y).addScaledVector(PT, l.z * sc.z); f.scale.setScalar(clamp(sc.y * 1.6, 0.3, 1)); }); // пенистые клетки внутри купола
      LDLB.forEach((b, k) => { b.m.visible = k < Math.round(ldl * 3); b.p.x += dt * 1.2; if (b.p.x > 4.2) { b.p.x = -4.2; b.in = false; } if (!b.in && Math.abs(b.p.x - 0.3) < 0.2 && rnd() < 0.02 * ldl) b.in = true; if (b.in) b.p.lerp(PB.clone().addScaledVector(PN, 0.3).add(V3(rand(-0.6, 0.6), 0, 0)), dt * 0.8); b.m.position.copy(b.p); });
      HDLB.forEach((b) => { b.p.x -= dt * 1.0; if (b.p.x < -4.2) b.p.x = 4.2; b.m.position.copy(b.p); });
      synA.forEach((a, k) => { a.mat.uniforms.uTime.value = t; a.mat.uniforms.uOn.value = st.stat && k >= 1 ? 0.12 : 0.8; });
      statin.visible = st.stat; statin.rotation.y += dt; block.visible = st.stat; chainM.forEach((m, k) => { m.rotation.y += dt * 0.5; molFade(m, st.stat && k >= 2 ? 0.25 : 1); });
      st.sten = Math.round(grow * 70);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'athero') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'сужение артерии по годам', xl: 'годы →', yl: '%' });
    const ldl = st.stat ? st.ldl * 0.55 : st.ldl;
    plotLine(ctx, A, (u) => clamp((ldl - 1.8) / 4, 0, 1) * smooth(0, 1, u) * 0.7, st.stat ? '#7FE0A0' : '#FF8A5C');
    plotLine(ctx, A, (u) => clamp((st.ldl - 1.8) / 4, 0, 1) * smooth(0, 1, u) * 0.7, 'rgba(255,255,255,.3)', { dash: [3, 3], lw: 1.2 });
    ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.years / 60), A.Y((st.sten || 0) / 100), 4.5, 0, Math.PI * 2); ctx.fill();
  }
  const TXT = {
    part: '<b>Липопротеины</b> — «грузовики» для жиров в водной крови. Снаружи — один слой фосфолипидов (головками в воду) и белки-апопротеины (ленты), внутри — нерастворимый груз: триацилглицерины и эфиры холестерина (передняя половина оболочки снята). Чем больше жира и меньше белка, тем крупнее и легче частица. Размеры (кроме хиломикрона) — в одном масштабе. Нажмите на частицу.',
    trans: '<b>Пути транспорта.</b> <span style="color:#E8C060">Хиломикроны</span> везут пищевой жир из кишки (через лимфу) к мышцам и жиру, где <b>липопротеинлипаза</b> стенки капилляров (её включает апоC-II) отщепляет жирные кислоты; остатки забирает печень. Печень отправляет свой жир в <span style="color:#C77DFF">ЛПОНП</span>, которые, худея, превращаются в <span style="color:#FF9A50">ЛПНП</span> — они раздают холестерин тканям через ЛПНП-рецепторы. <span style="color:#7FD6FF">ЛПВП</span> собирают лишний холестерин и возвращают в печень, где он уходит в желчь.',
    athero: '<b>Атеросклероз.</b> При избытке ЛПНП (оранжевые) частицы проникают под эндотелий артерии и окисляются. Макрофаги поглощают их и превращаются в <b>пенистые клетки</b>, набитые каплями холестерина → жировая полоска → <b>бляшка</b> с фиброзной покрышкой, сужающая просвет. Разрыв покрышки вызывает тромб — инфаркт или инсульт. ЛПВП (голубые) уносят холестерин обратно. Двигайте уровень ЛПНП и включите <b>статин</b>: он блокирует ГМГ-КоА-редуктазу — ключевой фермент синтеза холестерина (вверху), клетки печени выставляют больше ЛПНП-рецепторов и забирают ЛПНП из крови.',
  };
  const labels = [
    ...LP.map((d, k) => ({ text: `${d.name} · ${d.size}`, pos: V3(XS[k] - 0.5, 0.6 - Math.max(d.R, 0.3) - 0.45, 0), color: d.apo, show: () => st.labels && st.mode === 'part' })),
    { text: 'ЛПВП крупным планом (реальная модель)', pos: V3(3.8, -1.2, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'part' },
    { text: 'апоA-I', pos: V3(6.6, 1.4, 0.5), color: '#9FE0FF', show: () => st.labels && st.mode === 'part' },
    { text: 'ядро: ТАГ и эфиры холестерина', pos: V3(-6.2, 1.45, 1.5), color: '#E8C060', show: () => st.labels && st.mode === 'part' },
    ...PATHS.map((p) => ({ text: { cm: 'хиломикрон', vldl: 'ЛПОНП', ldl: 'ЛПНП', hdl: 'ЛПВП' }[p.id], pos: p.lab, color: p.c, show: () => st.labels && st.mode === 'trans' })),
    { text: 'кишка', pos: V3(40.6, 0.75, 0.4), color: '#E8A0A0', show: () => st.labels && st.mode === 'trans' },
    { text: 'печень', pos: V3(40 - 1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels && st.mode === 'trans' },
    { text: 'жировая ткань', pos: V3(41.4, 0.3, 0.3), color: '#F2D08A', show: () => st.labels && st.mode === 'trans' },
    { text: 'мышцы', pos: V3(40 - 1.3, -1.3, 0.2), color: '#C0504A', show: () => st.labels && st.mode === 'trans' },
    { text: 'артерия', pos: V3(40.8, -1.8, 0.2), color: '#FF6A6A', show: () => st.labels && st.mode === 'trans' },
    { text: 'просвет артерии', pos: V3(80 - 3.6, 0.8, 0.5), color: '#F0B0B0', show: () => st.labels && st.mode === 'athero' },
    { text: 'бляшка, пенистые клетки', pos: V3(80 + 1.3, -0.5, -0.5), color: '#C8A030', show: () => st.labels && st.mode === 'athero' },
    ...['ацетил-КоА', 'ГМГ-КоА', 'мевалонат', 'холестерин'].map((n, k) => ({ text: n, pos: V3(80 - 3.6 + k * 1.75 - 0.4, 2.0, 0.3), color: '#D9D2D8', show: () => st.labels && st.mode === 'athero' })),
    { text: 'ГМГ-КоА-редуктаза', pos: V3(80 - 1.6, 3.1, 0.3), color: '#FF8A8A', show: () => st.labels && st.mode === 'athero' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const d = LP.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'part' && d ? d.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'part', label: 'Частицы' }, { id: 'trans', label: 'Транспорт' }, { id: 'athero', label: 'Атеросклероз и статины' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'part') { refs.lpSeg = seg(LP.map((d) => ({ id: d.id, label: d.name, color: d.apo })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Частица', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.lpSeg)); }
      if (st.mode === 'athero') box.append(h('div', { class: 'glabel' }, 'ЛПНП-холестерин и лечение'), h('div', { class: 'gctl' }, range('lLDL', 1.5, 7, 0.1, () => st.ldl, (v) => { st.ldl = v; st.years = 0; }, (v) => `${v.toFixed(1)} ммоль/л`), toggle('Статин', () => st.stat, (v) => { st.stat = v; st.years = 0; }), button('Прожить снова', () => { st.years = 0; }, false)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['part', 'trans', 'athero'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'athero' ? [['Возраст бляшки', Math.round(st.years), 'лет'], ['Сужение', st.sten || 0, '%'], ['ЛПНП', (st.stat ? st.ldl * 0.55 : st.ldl).toFixed(1), 'ммоль/л']] : [['Холестерин крови', '< 5,2', 'ммоль/л'], ['ЛПНП', '< 3,0', 'ммоль/л']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8AB0',
    kicker: 'Биохимия · обмен липидов', title: 'Холестерин и липопротеины',
    lede: 'Жир и холестерин не растворяются в крови, поэтому путешествуют в белково-липидных частицах. От их баланса зависит здоровье артерий.',
    notes: `
      <div><h2>Холестерин</h2>
        <p>В организме ~140 г холестерина. С пищей приходит 0,3–0,5 г в сутки, синтезируется до 1 г — в основном в печени, из ацетил-КоА: ацетил-КоА → ГМГ-КоА → <b>мевалонат</b> (фермент <b>ГМГ-КоА-редуктаза</b>, кофермент НАДФН; тормозится холестерином по обратной связи) → изопентенилдифосфат → сквален (C30) → ланостерин → холестерин (C27).</p>
        <p>Уходит холестерин в желчные кислоты (1–1,3 г/сут), с калом, кожным салом; ~40 мг идёт на стероидные гормоны, ~10 мг — на витамин D.</p>
        <h3>Нормы и нарушения</h3><p>Общий холестерин в норме около 5,2 ± 1,3 ммоль/л (рекомендуемый — ниже 5,2), ЛПНП — ниже 3, ЛПВП — выше 1,0 у мужчин и 1,2 у женщин, ТАГ — ниже 1,7. <b>Семейная гиперхолестеринемия</b> — наследственный дефект ЛПНП-рецептора: холестерин в 2–6 раз выше нормы, инфаркты в молодости.</p></div>
      <div><h2>Модели</h2><ul><li>ЛПВП-диск — реальная модель апоA-I с бислоем POPC (бенчмарк ApoA1 пакета OpenMM).</li><li>Остальные частицы и стенка артерии — схематично; ленты апопротеинов условны.</li><li>Модель бляшки качественная: «годы» сжаты.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('part'); st.fly = null;
  return self;
}
