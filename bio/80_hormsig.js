// @scene hormsig makeHormsig | Как гормоны действуют на клетку | Гормоны
/* =========================================================
   БИОХИМИЯ · МЕХАНИЗМЫ ДЕЙСТВИЯ ГОРМОНОВ: β2-адренорецептор + Gs (реальная структура 3SN6),
   каскад цАМФ с усилением, стероиды и ядерные рецепторы, инсулин и GLUT4, химия гормонов
   ========================================================= */
const HS_MOL = [
  { id: 'adrenaline', g: 'aa', name: 'Адреналин', gland: 'мозговое вещество надпочечников', text: '<b>Адреналин</b> — производное тирозина (катехоламин). Гормон стресса «бей или беги»: через β-рецепторы и цАМФ учащает сердцебиение, расщепляет гликоген и жир; через α-рецепторы сужает сосуды кожи и кишки.' },
  { id: 'thyroxine', g: 'aa', name: 'Тироксин (T4)', gland: 'щитовидная железа', text: '<b>Тироксин</b> — йодированное производное тирозина (4 атома йода — фиолетовые). В клетках превращается в более активный T3, проникает в ядро и повышает обмен веществ, теплопродукцию, необходим для развития мозга. Недостаток — гипотиреоз (у детей кретинизм), избыток — тиреотоксикоз. Для синтеза нужен йод: эндемический зоб в районах, бедных йодом.' },
  { id: 'cortisol', g: 'st', name: 'Кортизол', gland: 'кора надпочечников', text: '<b>Кортизол</b> — глюкокортикоид: усиливает глюконеогенез, распад белков мышц, повышает сахар крови, подавляет воспаление и иммунитет (поэтому его аналоги — преднизолон, дексаметазон — противовоспалительные лекарства). Избыток — синдром Иценко — Кушинга.' },
  { id: 'aldosterone', g: 'st', name: 'Альдостерон', gland: 'кора надпочечников', text: '<b>Альдостерон</b> — минералокортикоид: в почках задерживает натрий и воду, выводит калий, повышает объём крови и давление. Регулируется ренин-ангиотензиновой системой.' },
  { id: 'estradiol', g: 'st', name: 'Эстрадиол', gland: 'яичники', text: '<b>Эстрадиол</b> — главный женский половой гормон; кольцо A ароматическое. Регулирует цикл, развитие половых признаков, сохраняет кости.' },
  { id: 'testosterone', g: 'st', name: 'Тестостерон', gland: 'яички', text: '<b>Тестостерон</b> — главный андроген: мужские половые признаки, сперматогенез, анаболическое действие на мышцы. В тканях превращается в более активный дигидротестостерон или в эстрадиол.' },
  { id: 'calcitriol', g: 'st', name: 'Кальцитриол', gland: 'почки (из витамина D)', text: '<b>Кальцитриол</b> — гормональная форма витамина D. Вместе с паратгормоном и кальцитонином поддерживает кальций крови около 2,5 ммоль/л: усиливает всасывание кальция в кишке.' },
  { id: 'pge2', g: 'eic', name: 'Простагландин E2', gland: 'почти все клетки', text: '<b>Простагландины</b> — местные гормоны (эйкозаноиды) из арахидоновой кислоты мембран через циклооксигеназу. PGE2 вызывает воспаление, жар и боль, защищает слизистую желудка. Аспирин и другие НПВС блокируют циклооксигеназу — отсюда их польза и вред для желудка.' },
];
function makeHormsig() {
  rnd = mulberry(2201);
  const scene = bioStage({ rim: 0xff8a5c });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { camp: DK ? flyTarget(V3(-3.0, 0.0, 0), V3(-2.0, 2.2, 23)) : flyTarget(V3(-0.6, -1.8, 0), V3(0.4, 0.4, 19.5)), ster: flyTarget(V3(40, -1.4, 0), V3(40.6, 0.8, 18)), ins: flyTarget(V3(80, -1.4, 0), V3(80.6, 0.8, 17)), chem: flyTarget(V3(120, -1.6, 0), V3(120, 0.6, 17.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.camp.pos);
  const controls = makeControls(camera, VIEW.camp.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  /* ---------- 1. каскад цАМФ ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const MEM_Y = 1.2;
  const mem = schemBilayer({ w: 17, d: 2.2, thick: 0.95, step: 0.27, head: '#C8A070', tail: '#8A6A4A', seed: 11 }); mem.position.set(0, MEM_Y, -1.5); G1.add(mem);
  const GP = new THREE.Group(); G1.add(GP); const gs = 0.035;
  const recM = proteinMesh('gpcr', { scale: gs, chains: ['R'], colorBy: () => '#FF8A5C' }), gaM = proteinMesh('gpcr', { scale: gs, chains: ['A'], colorBy: () => '#7FD6FF' }), gbgM = proteinMesh('gpcr', { scale: gs, chains: ['B', 'G'], colorBy: (c) => (c.id === 'B' ? '#C77DFF' : '#F2C14E') });
  const ligM = molMesh(PDB('gpcr').ligm[0], { scale: gs }); recM.add(ligM);
  GP.add(recM, gaM, gbgM);
  { const cen = (ch) => { const pts = caPoints('gpcr', gs, ch); return pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length); };
    const rc = cen(['R']), gc = cen(['A', 'B', 'G']); const ax = rc.clone().sub(gc).normalize();
    GP.quaternion.setFromUnitVectors(ax, V3(0, 1, 0)); const recC = rc.clone().applyQuaternion(GP.quaternion); GP.position.set(-2.6 - recC.x, MEM_Y - recC.y + 0.1, -recC.z); }
  const gaHome = gaM.position.clone(); const centerA = (() => { const pts = caPoints('gpcr', gs, ['A']); return pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length); })();
  const ac = new THREE.Mesh(blobGeo(0.6, 0.9, 0.55, 3, 0.1, 4), protMat('#7FE0A0', 0.32)); ac.position.set(0.6, MEM_Y - 0.25, 0); G1.add(ac);
  const pka = new THREE.Group(); pka.position.set(3.3, -1.4, 0); G1.add(pka);
  const pkR = [0, 1].map((k) => { const m = new THREE.Mesh(blobGeo(0.35, 0.3, 0.3, 10 + k, 0.1, 3), protMat('#C77DFF', 0.35)); m.position.set(k ? 0.32 : -0.32, 0.25, 0); pka.add(m); return m; });
  const pkC = [0, 1].map((k) => { const m = new THREE.Mesh(blobGeo(0.32, 0.28, 0.3, 12 + k, 0.1, 3), protMat('#FF8AB0', 0.38)); m.position.set(k ? 0.32 : -0.32, -0.25, 0); pka.add(m); return m; });
  const phos = new THREE.Mesh(blobGeo(0.55, 0.45, 0.45, 15, 0.1, 3), protMat('#F2C14E', 0.3)); phos.position.set(5.9, -1.2, 0); G1.add(phos);
  const glyc = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 2), new THREE.MeshPhysicalMaterial({ color: 0x8a6a20, roughness: 0.4, emissive: 0x5a3a08, emissiveIntensity: 0.2 })); glyc.position.set(7.5, -1.9, 0); G1.add(glyc);
  const adr = molMesh(MOL('adrenaline'), { scale: 0.14, hideH: true }); G1.add(adr);
  const camps = []; for (let k = 0; k < 24; k++) { const m = molMesh(MOL('camp'), { scale: 0.07, hideH: true }); m.visible = false; G1.add(m); camps.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const g1ps = []; for (let k = 0; k < 14; k++) { const m = molMesh(MOL('g1p'), { scale: 0.06, hideH: true }); m.visible = false; G1.add(m); g1ps.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const pde = new THREE.Mesh(blobGeo(0.35, 0.3, 0.3, 19, 0.1, 3), protMat('#9FA8B8', 0.35)); pde.position.set(1.6, -2.2, 0.3); G1.add(pde);
  /* ---------- 2. стероиды ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const cellM = new THREE.Mesh(new THREE.SphereGeometry(4.2, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.62), glassMat(0xffb070, { rim: 0.35, base: 0.006 })); cellM.position.set(0, -2.6, 0); G2.add(cellM);
  const nucl = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), glassMat(0x9f7bff, { rim: 0.45, base: 0.01 })); nucl.position.set(1.6, -1.4, 0); G2.add(nucl);
  const cort = molMesh(MOL('cortisol'), { scale: 0.12, hideH: true }); G2.add(cort);
  const nr = new THREE.Mesh(blobGeo(0.42, 0.34, 0.36, 21, 0.1, 3), protMat('#FF8AB0', 0.38)); G2.add(nr);
  const hsp = new THREE.Mesh(blobGeo(0.36, 0.3, 0.32, 22, 0.1, 3), protMat('#9FA8B8', 0.32)); G2.add(hsp);
  const gal = proteinMesh('gal4', { scale: 0.022, colorBy: (c, ci) => ['#F2E6C8', '#F2E6C8', '#FF8AB0', '#FF8AB0'][ci] || '#FF8AB0', nucColor: '#9FB4D8' }); gal.position.set(1.7, -1.5, 0); G2.add(gal);
  const mr = []; for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.5, 4, 8), organMat('#F2E6C8', 0.6, { emissiveIntensity: 0.2 })); m.visible = false; G2.add(m); mr.push({ m, age: 9 }); }
  /* ---------- 3. инсулин ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const mem3 = schemBilayer({ w: 15, d: 2.2, thick: 0.95, step: 0.27, head: '#C8A070', tail: '#8A6A4A', seed: 12 }); mem3.position.set(0, MEM_Y, -1.5); G3.add(mem3);
  const irA = [-1, 1].map((s) => { const m = new THREE.Mesh(blobGeo(0.45, 0.7, 0.45, 30 + s, 0.1, 3), protMat('#7FD6FF', 0.35)); m.position.set(-3 + s * 0.45, MEM_Y + 1.1, 0); G3.add(m); return m; });
  const irB = [-1, 1].map((s) => { const m = new THREE.Mesh(blobGeo(0.35, 0.8, 0.35, 32 + s, 0.1, 3), protMat('#9F7BFF', 0.35)); m.position.set(-3 + s * 0.4, MEM_Y - 0.9, 0); G3.add(m); return m; });
  const kin = proteinMesh('src', { scale: 0.022, colorBy: () => '#C77DFF' }); kin.position.set(-3, MEM_Y - 2.1, 0); G3.add(kin);
  const insul = new THREE.Mesh(blobGeo(0.3, 0.22, 0.25, 35, 0.12, 3), protMat('#F2C14E', 0.45)); G3.add(insul);
  const vesG = []; for (let k = 0; k < 4; k++) { const g = new THREE.Group(); const v = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), glassMat(0x7fe0a0, { rim: 0.5, base: 0.01 })); g.add(v); for (let q = 0; q < 3; q++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8), protMat('#7FE0A0', 0.5)); t.position.copy(randUnit().multiplyScalar(0.38)); g.add(t); } g.userData.home = V3(0.5 + k * 1.4, -1.9 - (k % 2) * 0.5, 0); g.position.copy(g.userData.home); G3.add(g); vesG.push(g); }
  const glcs = []; for (let k = 0; k < 16; k++) { const m = molMesh(MOL('glucose'), { scale: 0.07, hideH: true }); m.visible = false; G3.add(m); glcs.push({ m, age: 9, x: 0 }); }
  /* ---------- 4. химия гормонов ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const HM = HS_MOL.map((d, k) => { const m = molMesh(MOL(d.id), { scale: 0.15, hideH: true }); const g = new THREE.Group(); g.add(m); g.position.set(-6.3 + (k % 4) * 3.6 + (k >= 4 ? 1.8 : 0), k < 4 ? 0.7 : -1.6, 0); if (k >= 4) g.position.x = -6.3 + (k - 4) * 3.6 + 1.0; G4.add(g); const pk = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), new THREE.MeshBasicMaterial({ visible: false })); pk.userData.pick = d.id; g.add(pk); return { d, g, m }; });
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'camp', labels: true, rot: false, fly: null, cyc: 0, msg: null, chol: false, caff: false, sel: null, amp: [0, 0, 0, 0] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['camp', 'ster', 'ins', 'chem'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => HM.map((x) => x.g.children[1]), (id) => { st.sel = id; refs.setInfo(); });
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'camp') {
      const T = 14, c = st.cyc % T; const recTop = V3(-2.6, MEM_Y + 1.6, 0);
      adr.visible = !st.chol; adr.position.copy(V3(-5.0, MEM_Y + 3.2, 0.5).lerp(recTop, ease(c / 2))); adr.rotation.y += dt;
      const on = st.chol || (c > 2 && c < 11);
      // Gα отъезжает к аденилатциклазе
      const go = st.chol ? 1 : c < 2.5 ? 0 : c < 4 ? ease((c - 2.5) / 1.5) : c < 10 ? 1 : 1 - ease((c - 10) / 2);
      const target = ac.position.clone().add(V3(-0.9, -0.35, 0)); const gaW0 = gaHome.clone();
      gaM.position.copy(gaW0); // в локальных координатах GP
      GP.updateMatrixWorld(); const inv = GP.matrixWorld.clone().invert(); const tgtL = target.clone().applyMatrix4(inv);
      gaM.position.copy(tgtL.clone().sub(centerA).multiplyScalar(go));
      ac.material.emissiveIntensity = on && go > 0.9 ? 0.25 + 0.1 * Math.sin(t * 8) : 0.02;
      const cOn = on && go > 0.9; st.lev = cOn ? 1 : 0;
      if (cOn && rnd() < 0.35) { const q = camps.find((x) => x.age > 2.6); if (q) { q.age = 0; q.m.visible = true; q.m.position.copy(ac.position).add(V3(0.2, -0.7, 0.3)); q.v.copy(pka.position.clone().sub(q.m.position).normalize().multiplyScalar(1.2).add(randUnit().multiplyScalar(0.3))); } }
      camps.forEach((q) => { if (q.age < 2.6) { q.age += dt * (st.caff ? 0.6 : 1); q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
      const pkaOn = cOn && c > 5 || st.chol; pkC.forEach((m, k) => { m.position.lerp(V3((k ? 0.32 : -0.32) + (pkaOn ? (k ? 1.2 : 0.6) : 0), pkaOn ? -0.8 : -0.25, 0), 1 - Math.exp(-dt * 3)); m.material.emissiveIntensity = pkaOn ? 0.2 : 0.02; });
      phos.material.emissiveIntensity = pkaOn && c > 6.5 || st.chol ? 0.25 + 0.1 * Math.sin(t * 6) : 0.02;
      if ((pkaOn && c > 7) || st.chol) { if (rnd() < 0.4) { const q = g1ps.find((x) => x.age > 2.4); if (q) { q.age = 0; q.m.visible = true; q.m.position.copy(glyc.position); q.v.set(rand(-0.8, 0.4), rand(-0.6, 0.6), rand(0.2, 0.8)); } } }
      g1ps.forEach((q) => { if (q.age < 2.4) { q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
      glyc.rotation.y += dt * 0.3; pde.rotation.y += dt;
      st.amp = [1, cOn ? 10 : 0, cOn ? 1000 : 0, pkaOn && c > 7 ? 10_000_000 : 0];
    }
    if (st.mode === 'ster') {
      const T = 14, c = st.cyc % T;
      const cyto = V3(-1.6, -0.6, 0.4);
      cort.position.copy(c < 2 ? V3(-3.2, 3.4, 0.4).lerp(V3(-2.2, 1.4, 0.4), ease(c / 2)) : c < 3.5 ? V3(-2.2, 1.4, 0.4).lerp(cyto, ease((c - 2) / 1.5)) : cyto.clone().lerp(V3(1.3, -1.0, 0.4), ease((c - 5) / 3))); cort.rotation.y += dt;
      nr.position.copy(c < 5 ? cyto.clone().add(V3(0.2, -0.35, 0)) : cyto.clone().add(V3(0.2, -0.35, 0)).lerp(V3(1.4, -1.3, 0.4), ease((c - 5) / 3)));
      hsp.visible = c < 4.5; hsp.position.copy(cyto.clone().add(V3(-0.45, -0.55, 0)).addScaledVector(V3(-1, -0.4, 0), ease((c - 3.5) / 1)));
      gal.rotation.y += dt * 0.3; nucl.material.uniforms.uFlash.value = c > 8 && c < 9 ? 1 : 0;
      if (c > 8.5) mr.forEach((q, k) => { if (q.age > 4 && rnd() < 0.04) { q.age = 0; q.m.visible = true; } });
      mr.forEach((q, k) => { if (q.age < 4) { q.age += dt; q.m.position.copy(V3(1.6, -1.4, 0.3).lerp(V3(-2.6 + k * 0.4, -2.0 + k * 0.2, 0.6), ease(q.age / 3))); q.m.rotation.z = q.age; } else q.m.visible = false; });
      st.stPh = c < 2 ? 'гормон в крови (с белком-переносчиком)' : c < 3.5 ? 'проходит через мембрану' : c < 5 ? 'связывается с рецептором' : c < 8 ? 'комплекс идёт в ядро' : 'включает гены → мРНК';
    }
    if (st.mode === 'ins') {
      const T = 14, c = st.cyc % T; const site = V3(-3, MEM_Y + 1.9, 0);
      insul.position.copy(V3(-6.5, MEM_Y + 3.4, 0).lerp(site, ease(c / 2))); insul.rotation.y += dt;
      const act = c > 2 && c < 12.5; irB.forEach((m) => { m.material.emissiveIntensity = act ? 0.22 + 0.1 * Math.sin(t * 7) : 0.02; }); kin.rotation.y += dt * 0.4;
      vesG.forEach((g, k) => { const u = act ? ease((c - 3.5 - k * 0.6) / 2) : 1 - ease((c - 12.5) / 1.5); const tgt = V3(0.6 + k * 1.4, MEM_Y - 0.55, 0); g.position.copy(g.userData.home).lerp(tgt, clamp(u, 0, 1)); g.scale.setScalar(1 - 0.3 * clamp(u, 0, 1)); });
      const open = act && c > 6;
      glcs.forEach((q, k) => { if (open && q.age > 2.2 && rnd() < 0.05) { q.age = 0; q.m.visible = true; q.x = 0.6 + (k % 4) * 1.4; } if (q.age < 2.2) { q.age += dt; q.m.position.set(q.x, MEM_Y + 1.8 - q.age * 1.6, 0.3); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
      st.inPh = c < 2 ? 'инсулин подходит' : c < 3.5 ? 'рецептор: аутофосфорилирование' : c < 6 ? 'сигнал → пузырьки с GLUT4 к мембране' : c < 12.5 ? 'глюкоза входит в клетку' : 'GLUT4 уходят обратно';
    }
    if (st.mode === 'chem') HM.forEach((x) => { x.m.rotation.y += dt * (st.sel === x.d.id ? 0.9 : 0.35); const s = st.sel === x.d.id ? 1.2 : 1; x.g.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
    fx.update(dt);
  }
  const TXT = {
    camp: '<b>Мембранный рецептор и цАМФ.</b> Адреналин не входит в клетку. Он садится на <b>β2-адренорецептор</b> (оранжевый, семь спиралей в мембране) — это реальная структура комплекса рецептора с <b>G-белком</b> (PDB 3SN6, Нобелевская премия 2012). Рецептор меняет форму, α-субъединица G-белка (Gαs, голубая) обменивает ГДФ на ГТФ, отделяется от βγ и включает <b>аденилатциклазу</b> (зелёная): из АТФ получаются молекулы <b>цАМФ</b> — вторичный посредник. цАМФ отрывает регуляторные субъединицы <b>протеинкиназы A</b>, освобождённые каталитические (розовые) фосфорилируют киназу фосфорилазы → <b>гликогенфосфорилазу</b> → из гликогена сыплется глюкозо-1-фосфат. Каждая ступень <b>усиливает</b> сигнал: одна молекула гормона — миллионы молекул глюкозы. <b>Фосфодиэстераза</b> (серая) разрушает цАМФ и гасит сигнал.',
    ster: '<b>Липофильные гормоны</b> — стероиды, тиреоидные гормоны, кальцитриол — проходят через мембрану сами. В цитоплазме кортизол связывается с <b>рецептором</b> (розовый), от него отходит белок-шаперон HSP90 (серый), комплекс «гормон — рецептор» идёт в <b>ядро</b> и садится на регуляторные участки ДНК (HRE), включая или выключая гены. Получается новая мРНК и новые белки-ферменты. Действие медленное (часы), но долгое. ДНК-связывающий домен показан на примере похожего белка-регулятора GAL4 (PDB 1D66) — у ядерных рецепторов он тоже держится на «цинковых пальцах».',
    ins: '<b>Инсулин</b> действует через <b>рецептор-тирозинкиназу</b>: две α-субъединицы снаружи (голубые) связывают гормон, две β-субъединицы внутри (фиолетовые) фосфорилируют друг друга по тирозинам (пример тирозинкиназного домена — Src, PDB 2SRC). Сигнал через IRS-белки, PI3-киназу и Akt доходит до пузырьков с переносчиком глюкозы <b>GLUT4</b> (зелёные): они встраиваются в мембрану мышечных и жировых клеток — и глюкоза входит внутрь. Ещё инсулин включает синтез гликогена, жиров и белков. При диабете 2 типа эта цепочка работает плохо (инсулинорезистентность).',
    chem: '<b>Гормоны по химическому строению.</b> <b>Белково-пептидные</b> (инсулин, глюкагон, гормоны гипофиза и гипоталамуса) и <b>производные аминокислот</b> (адреналин, тироксин) — в основном гидрофильные, действуют через мембранные рецепторы (кроме тиреоидных). <b>Стероиды</b> (кортикостероиды, половые, кальцитриол) — из холестерина, липофильные, действуют через ядро. <b>Эйкозаноиды</b> — из арахидоновой кислоты, местного действия. Нажмите на молекулу.',
  };
  const labels = [
    { text: 'адреналин', pos: V3(-4.6, MEM_Y + 3.5, 0.5), color: '#FF8A5C', show: () => st.labels && st.mode === 'camp' && !st.chol },
    { text: 'β2-адренорецептор', pos: V3(-2.3, MEM_Y + 1.5, 0.6), color: '#FF8A5C', show: () => st.labels && st.mode === 'camp' },
    { text: 'G-белок (α, β, γ)', pos: V3(-4.6, MEM_Y - 2.4, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'camp' },
    { text: 'аденилатциклаза', pos: V3(0.6, MEM_Y + 0.9, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'camp' },
    { text: 'цАМФ', pos: V3(2.0, -0.4, 0.5), color: '#C8C8D0', show: () => st.labels && st.mode === 'camp' && st.lev > 0 },
    { text: 'протеинкиназа A', pos: V3(2.8, -0.75, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'camp' },
    { text: 'фосфорилаза → гликоген', pos: V3(5.5, -0.4, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'camp' },
    { text: 'фосфодиэстераза', pos: V3(1.1, -2.75, 0.3), color: '#9FA8B8', show: () => st.labels && st.mode === 'camp' },
    { text: 'кортизол', pos: V3(40 - 3.6, 3.6, 0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'ster' },
    { text: 'ядро', pos: V3(40 + 2.8, -0.2, 0), color: '#9F7BFF', show: () => st.labels && st.mode === 'ster' },
    { text: 'рецептор + HSP90', pos: V3(40 - 2.6, -1.3, 0.4), color: '#FF8AB0', show: () => st.labels && st.mode === 'ster' },
    { text: 'мембрана клетки', pos: V3(40 - 4.0, 1.4, 0), color: '#FFB070', show: () => st.labels && st.mode === 'ster' },
    { text: 'инсулин', pos: V3(80 - 6.0, MEM_Y + 3.7, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'ins' },
    { text: 'рецептор α₂β₂', pos: V3(80 - 4.6, MEM_Y + 1.6, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'ins' },
    { text: 'тирозинкиназа', pos: V3(80 - 4.6, MEM_Y - 2.6, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'ins' },
    { text: 'пузырьки с GLUT4', pos: V3(80 + 2.2, -2.9, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'ins' },
    ...HS_MOL.map((d, k) => ({ text: `${d.name}`, pos: () => HM[k].g.position.clone().add(V3(120 - 0.6, -1.0, 0)), color: d.g === 'st' ? '#F2C14E' : d.g === 'aa' ? '#FF8A5C' : '#7FE0A0', show: () => st.labels && st.mode === 'chem' })),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { const d = HS_MOL.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'chem' && d ? d.text + ` <span style="color:var(--mute)">Железа: ${d.gland}.</span>` : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'camp', label: 'Рецептор и цАМФ' }, { id: 'ster', label: 'Стероиды и ядро' }, { id: 'ins', label: 'Инсулин' }, { id: 'chem', label: 'Химия гормонов' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 360px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'camp') box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, toggle('Холерный токсин', () => st.chol, (v) => { st.chol = v; st.msg = v ? '<b>Холерный токсин</b> навсегда «заклинивает» Gαs во включённом состоянии (не даёт ему гидролизовать ГТФ). В клетках кишки непрерывно идёт синтез цАМФ, открываются хлорные каналы, и вода литрами уходит в просвет — смертельная диарея холеры. Коклюшный токсин, наоборот, выключает тормозной Gi.' : null; refs.setInfo(); }), toggle('Кофеин', () => st.caff, (v) => { st.caff = v; st.msg = v ? '<b>Кофеин и теофиллин</b> тормозят фосфодиэстеразу: цАМФ живёт дольше, сигнал адреналина усиливается (плюс кофеин блокирует аденозиновые рецепторы мозга — отсюда бодрость).' : null; refs.setInfo(); })));
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
    if (n >= 1 && n <= 4) { setMode(['camp', 'ster', 'ins', 'chem'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'camp') return [['Гормон', st.amp[0], 'мол.'], ['Gαs', st.amp[1], ''], ['цАМФ', st.amp[2] ? '10³' : 0, ''], ['Глюкоза', st.amp[3] ? '10⁷–10⁸' : 0, '']];
    if (st.mode === 'ster') return [['Этап', st.stPh || '', '']];
    if (st.mode === 'ins') return [['Этап', st.inPh || '', '']];
    return [['Групп гормонов', '4', '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#FF8A5C',
    kicker: 'Биохимия · гормоны', title: 'Как гормоны действуют на клетку',
    lede: 'Гормон — это письмо, а не работник: он лишь передаёт команду. Как клетка читает это письмо через рецептор на мембране или в ядре и многократно усиливает его.',
    notes: `
      <div><h2>Два пути сигнала</h2>
        <p><b>Гидрофильные</b> гормоны (белки, пептиды, катехоламины) действуют через <b>мембранные рецепторы</b>: ионотропные (каналы), метаботропные (через G-белки: Gs включает аденилатциклазу, Gi тормозит её, Gq включает фосфолипазу C → ИФ₃ и Ca²⁺ + ДАГ), рецепторы-ферменты (тирозинкиназы, гуанилатциклаза). Вторичные посредники: цАМФ, цГМФ, Ca²⁺, ИФ₃, ДАГ, NO. Ответ — секунды-минуты, изменение <b>активности</b> ферментов.</p>
        <p><b>Липофильные</b> (стероиды, иодтиронины, кальцитриол) проникают в клетку и действуют через <b>внутриклеточные рецепторы</b> на гены: ответ — часы, изменение <b>количества</b> ферментов.</p>
        <h3>Иерархия</h3><p>Гипоталамус (либерины и статины) → гипофиз (тропные гормоны: АКТГ, ТТГ, ФСГ, ЛГ, СТГ, пролактин) → периферические железы. Отрицательная обратная связь: гормоны желёз тормозят гипоталамус и гипофиз.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Рецептор с G-белком — реальная структура 3SN6 (из неё убраны вспомогательные белки кристаллизации); в кармане рецептора — агонист.</li><li>Аденилатциклаза, протеинкиназа A, фосфорилаза, ядерный рецептор, рецептор инсулина — схематично.</li><li>Молекулы гормонов — по химическим формулам.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li>клик по молекуле в «Химии»</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('camp'); st.fly = null;
  return self;
}
