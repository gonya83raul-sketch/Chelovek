// @scene atp makeAtp | АТФ и стадии катаболизма | Энергия
/* =========================================================
   БИОХИМИЯ · АТФ: гидролиз и ресинтез, потребители и источники, макроэрги;
   три стадии катаболизма (воронка: полимеры → мономеры → ацетил-КоА → CO₂, H₂O, АТФ)
   ========================================================= */
const ATP_USE = [
  { id: 'mus', name: 'Сокращение мышц', color: '#FF8A5C', text: '<b>Механическая работа.</b> Головка миозина гидролизует АТФ и «гребёт» по актиновой нити. Мышца при беге тратит весь свой запас АТФ за пару секунд — дальше его восполняют креатинфосфат, гликолиз и митохондрии.' },
  { id: 'pump', name: 'Na⁺/K⁺-насос', color: '#7FD6FF', text: '<b>Осмотическая работа.</b> Na⁺/K⁺-АТФаза на каждый АТФ выкачивает 3 Na⁺ из клетки и закачивает 2 K⁺. На это уходит до четверти всей энергии покоя, а в нейронах — до двух третей.' },
  { id: 'syn', name: 'Синтез веществ', color: '#7FE0A0', text: '<b>Химическая работа.</b> Анаболизм — синтез белков, нуклеиновых кислот, гликогена, жиров — идёт «в гору» (ΔG > 0) и становится возможным только в сопряжении с гидролизом АТФ (или ГТФ, УТФ, ЦТФ).' },
];
const ATP_SRC = [
  { id: 'ox', name: 'Окислительное фосфорилирование', color: '#FFB070', text: '<b>Окислительное фосфорилирование</b> — главный путь (≈90% АТФ): энергия окисления НАДН и ФАДН₂ в дыхательной цепи митохондрий создаёт протонный градиент, который крутит АТФ-синтазу.' },
  { id: 'sub', name: 'Субстратное фосфорилирование', color: '#C77DFF', text: '<b>Субстратное фосфорилирование</b> — фосфат переносится на АДФ прямо с богатой энергией молекулы: 1,3-бисфосфоглицерата и фосфоенолпирувата в гликолизе, сукцинил-КоА в цикле Кребса. Работает и без кислорода.' },
];
const MACRO = [['ФЕП', 61.9, '#FF6A6A'], ['Карбамоил-Ф', 51.4, '#FF8A5C'], ['1,3-БФГ', 49.3, '#FF9A50'], ['Креатин-Ф', 43.1, '#F2C14E'], ['АТФ → АДФ', 30.5, '#7FD6FF'], ['Глюкозо-1-Ф', 20.9, '#9FB4D8'], ['Глюкозо-6-Ф', 13.8, '#8A94A8']];
const CAT_ST = [
  { id: 's1', name: '1 · Пищеварение', color: '#F2C14E', text: '<b>Стадия 1 — распад полимеров до мономеров</b> (в кишечнике и лизосомах): белки → аминокислоты, полисахариды → глюкоза, жиры → глицерин и жирные кислоты. Энергии выделяется мало (<1%), она рассеивается теплом.' },
  { id: 's2', name: '2 · Специфические пути', color: '#FF8A5C', text: '<b>Стадия 2 — свои пути для каждого класса</b> (цитоплазма и митохондрии): гликолиз, β-окисление жирных кислот, дезаминирование аминокислот. Все они сходятся к одному веществу — <b>ацетил-КоА</b>. Выделяется около трети энергии; часть АТФ образуется субстратным фосфорилированием.' },
  { id: 's3', name: '3 · Общий путь', color: '#7FD6FF', text: '<b>Стадия 3 — общий путь катаболизма</b> в митохондриях: цикл трикарбоновых кислот окисляет ацетил-КоА до 2 CO₂, а водород в составе НАДН и ФАДН₂ идёт в <b>дыхательную цепь</b>, где соединяется с кислородом в воду. Здесь выделяется около двух третей всей энергии и образуется большая часть АТФ.' },
];
function makeAtp() {
  rnd = mulberry(901);
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { cycle: flyTarget(V3(0, -1.0, 0), V3(0.5, 1.4, 15.5)), funnel: flyTarget(V3(40, -0.6, 0), V3(40.4, 1.4, 16.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.cycle.pos);
  const controls = makeControls(camera, VIEW.cycle.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.09); scene.add(fx.obj);
  /* ---------- 1. цикл АТФ ↔ АДФ ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const M = MOL('atp'); const SCL = molFit(M, 2.05);
  // найдём γ-фосфат: P, у которого все O, кроме мостикового, концевые
  const adj = Array.from({ length: M.n }, () => []); for (let k = 0; k < M.b.length; k += 2) { adj[M.b[k]].push(M.b[k + 1]); adj[M.b[k + 1]].push(M.b[k]); }
  const Ps = [...Array(M.n).keys()].filter((i) => M.el[i] === 'P');
  const isBridge = (o) => adj[o].filter((j) => M.el[j] === 'P' || M.el[j] === 'C').length >= 2;
  const gP = Ps.find((p) => adj[p].filter((o) => M.el[o] === 'O' && isBridge(o)).length === 1 && adj[adj[p].find((o) => isBridge(o))].some((j) => j !== p && M.el[j] === 'P'));
  const gSet = new Set([gP]); adj[gP].forEach((o) => { if (!isBridge(o)) { gSet.add(o); adj[o].forEach((hh) => { if (M.el[hh] === 'H') gSet.add(hh); }); } });
  const bridgeO = adj[gP].find((o) => isBridge(o));
  const rest = new Set([...Array(M.n).keys()].filter((i) => !gSet.has(i)));
  const atpCore = molMesh(M, { scale: SCL, idx: rest }), pi = molMesh(M, { scale: SCL, idx: gSet });
  const atpG = new THREE.Group(); atpG.position.set(0.2, 0.9, 0); atpG.add(atpCore, pi); G1.add(atpG);
  const PA = (i) => V3(M.xyz[i * 3], M.xyz[i * 3 + 1], M.xyz[i * 3 + 2]).multiplyScalar(SCL);
  const bondM = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 12), new THREE.MeshPhysicalMaterial({ color: 0xffb070, emissive: 0xffb070, emissiveIntensity: 0.6, roughness: 0.3 })); atpG.add(bondM);
  const water = molMesh(MOL('h2o'), { scale: SCL * 1.1 }); atpG.add(water);
  const gC = PA(gP), bC = PA(bridgeO); const piDir = gC.clone().sub(bC).normalize();
  // потребители и источники по кругу
  const stations = [];
  const addSt = (d, pos, kind) => {
    const p = pos.clone(); const g = new THREE.Group(); g.position.copy(p); G1.add(g);
    if (d.id === 'mus') { for (let k = 0; k < 9; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), protMat('#E0C080', 0.3)); s.position.set(-0.9 + k * 0.22, -0.35 + 0.05 * Math.sin(k), 0); g.add(s); } const head = new THREE.Mesh(blobGeo(0.32, 0.22, 0.22, 3, 0.1, 4), protMat(d.color, 0.32)); head.position.set(0, 0.1, 0); g.add(head); g.userData.anim = head; }
    if (d.id === 'pump') { const memb = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 1.0), new THREE.MeshPhysicalMaterial({ color: 0x3a4a60, roughness: 0.6, transparent: true, opacity: 0.55 })); g.add(memb); const b = new THREE.Mesh(blobGeo(0.38, 0.62, 0.38, 7, 0.1, 4), protMat(d.color, 0.3)); g.add(b); g.userData.anim = b; }
    if (d.id === 'syn') { const beads = []; for (let k = 0; k < 7; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), protMat(['#7FE0A0', '#F2C14E', '#FF8AB0', '#7FD6FF'][k % 4], 0.38)); s.position.set(-0.8 + k * 0.25, 0.08 * Math.sin(k * 1.3), 0); g.add(s); beads.push(s); } g.userData.beads = beads; }
    if (d.id === 'ox') { const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.2, 8, 24), glassMat(0xffb070, { rim: 0.45, base: 0.01, keep: true })); cap.rotation.z = Math.PI / 2; g.add(cap); for (let k = 0; k < 5; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.5), new THREE.MeshPhysicalMaterial({ color: 0x8a5a3a, roughness: 0.5 })); c.position.x = -0.6 + k * 0.3; g.add(c); } }
    if (d.id === 'sub') { const m = molMesh(MOL('pep'), { scale: 0.2, hideH: true }); g.add(m); g.userData.anim = m; }
    stations.push({ d, g, p, kind }); return g;
  };
  ATP_USE.forEach((d, k) => addSt(d, [V3(5.9, 2.4, -0.8), V3(5.9, 0.3, -0.8), V3(2.8, 3.3, -1.0)][k], 'use'));
  ATP_SRC.forEach((d, k) => addSt(d, V3(-5.3 + k * 1.2, 0.3 - k * 1.55, -0.8), 'src'));
  const packet = glowNucleus(G1, V3(0, 0, 0), '#FFD070', 0.1, 10);
  /* ---------- 2. воронка катаболизма ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const FY = [2.6, 0.9, -0.7, -2.3];
  const lane = (k) => -3.3 + k * 3.3;
  // полисахарид — цепочка глюкоз по горизонтали (слегка спиральная, как крахмал)
  const s1 = [proteinMesh('lyz', { scale: 0.04, colorBy: () => '#FF8AB0' }), (() => { const g = new THREE.Group(); for (let k = 0; k < 6; k++) { const m = molMesh(MOL('glucose'), { scale: 0.08, hideH: true }); m.position.set((k - 2.5) * 0.46, 0.12 * Math.sin(k * 1.4), 0.12 * Math.cos(k * 1.4)); m.rotation.set(0, 0, k * 0.5); g.add(m); } return g; })(), molMesh(MOL('tag'), { scale: 0.085, hideH: true })];
  const s2 = [molMesh(MOL('ala'), { scale: 0.12, hideH: true }), molMesh(MOL('glucose'), { scale: 0.11, hideH: true }), molMesh(MOL('palmitic'), { scale: 0.065, hideH: true })];
  // ТАГ и жирную кислоту кладём длинной осью по горизонтали (вращение вокруг y её не меняет)
  const flat = (g) => { const M = g.userData.mol; const pts = []; for (let i = 0; i < M.n; i++) if (M.el[i] !== 'H') pts.push(V3(M.xyz[i * 3], M.xyz[i * 3 + 1], M.xyz[i * 3 + 2])); const inner = new THREE.Group(); inner.quaternion.setFromUnitVectors(pcaAxis(pts).v, V3(1, 0, 0)); [...g.children].forEach((c) => inner.add(c)); g.add(inner); };
  flat(s1[2]); flat(s2[2]);
  s1.forEach((m, k) => { m.position.set(lane(k), FY[0], 0); G2.add(m); }); s2.forEach((m, k) => { m.position.set(lane(k) - (k === 2 ? 0.35 : 0), FY[1], 0); G2.add(m); });
  const glyc = molMesh(MOL('glycerol'), { scale: 0.12, hideH: true }); glyc.position.set(lane(2) + 0.95, FY[1], 0); G2.add(glyc); s2.push(glyc);
  const pyr = molMesh(MOL('pyruvate'), { scale: 0.13, hideH: true }); pyr.position.set(-1.1, FY[2] + 0.35, 0); G2.add(pyr);
  const acc = molMesh(MOL('acetyl'), { scale: 0.15, hideH: true }); acc.position.set(0, FY[2] - 0.25, 0); G2.add(acc);
  const accGlow = glowNucleus(G2, V3(0, FY[2] - 0.25, 0), '#F2C14E', 0.08, 12);
  const tca = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 16, 80), new THREE.MeshPhysicalMaterial({ color: 0x3a6a90, emissive: 0x7fd6ff, emissiveIntensity: 0.25, roughness: 0.3, clearcoat: 0.6 })); tca.position.set(-0.9, FY[3], 0); G2.add(tca);
  const etcBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, 0.9), new THREE.MeshPhysicalMaterial({ color: 0x5a3a2a, emissive: 0xffb070, emissiveIntensity: 0.12, roughness: 0.5 })); etcBar.position.set(1.8, FY[3], 0); G2.add(etcBar);
  // NH₃ — от аминокислот (дезаминирование), а не из дыхательной цепи
  const OUTP = [V3(-2.6, FY[3] - 1.2, 0), V3(1.9, FY[3] - 1.2, 0), V3(lane(0) - 0.9, FY[1] - 0.9, 0)];
  const outs = ['co2', 'h2o', 'nh3'].map((id, k) => { const m = molMesh(MOL(id), { scale: 0.22 }); m.position.copy(OUTP[k]); G2.add(m); return m; });
  const atpOut = molMesh(MOL('atp'), { scale: 0.07, hideH: true }); atpOut.position.set(3.4, FY[3] - 0.1, 0); G2.add(atpOut);
  const flows = [];
  const conn = (a, b, c) => flows.push(flowArrow(G2, a, b, c, { bend: 0.08, r: 0.022, speed: 0.6 }));
  [0, 1, 2].forEach((k) => conn(V3(lane(k), FY[0] - 0.55, 0), V3(lane(k), FY[1] + 0.45, 0), '#F2C14E'));
  conn(V3(lane(0), FY[1] - 0.4, 0), V3(-0.4, FY[2] - 0.1, 0), '#FF8A5C'); conn(V3(lane(1), FY[1] - 0.4, 0), V3(-1.1, FY[2] + 0.7, 0), '#FF8A5C'); conn(V3(-1.0, FY[2] + 0.1, 0), V3(-0.3, FY[2] - 0.15, 0), '#FF8A5C'); conn(V3(lane(2), FY[1] - 0.3, 0), V3(0.4, FY[2] - 0.1, 0), '#FF8A5C');
  conn(V3(0, FY[2] - 0.6, 0), V3(-0.6, FY[3] + 0.85, 0), '#7FD6FF'); conn(V3(-0.1, FY[3] + 0.1, 0), V3(0.8, FY[3] + 0.05, 0), '#7FD6FF'); conn(V3(2.9, FY[3], 0), V3(3.2, FY[3] - 0.05, 0), '#FFB070'); conn(V3(lane(0), FY[1] - 0.4, 0), V3(lane(0) - 0.8, FY[1] - 0.75, 0), '#9FD8FF');
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'cycle', labels: true, rot: false, fly: null, cyc: 0, n: 0, sel: null, msg: null, made: 0, used: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'cycle'; G2.visible = m === 'funnel'; st.fly = VIEW[m]; st.cyc = 0; st.sel = null; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'cycle') {
      const T = 8, c = st.cyc % T, turn = Math.floor(st.cyc / T);
      const use = stations.filter((s) => s.kind === 'use')[turn % 3], src = stations.filter((s) => s.kind === 'src')[turn % 2];
      const off = c < 3 ? 0 : c < 5.2 ? ease((c - 3) / 0.8) : 1 - ease((c - 5.2) / 1.6);
      pi.position.copy(piDir).multiplyScalar(off * 1.4);
      bondM.visible = c < 3 || c > 6.7;
      const a = bC.clone(), b = gC.clone().add(pi.position); bondM.position.copy(a).lerp(b, 0.5); const d = b.clone().sub(a); bondM.scale.y = Math.max(0.01, d.length()); bondM.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize());
      bondM.material.emissiveIntensity = c > 2 && c < 3 ? 0.6 + 0.6 * Math.sin(t * 16) : 0.35;
      water.visible = c > 1.6 && c < 3.2; water.position.copy(gC).addScaledVector(piDir, 0.2 + 1.6 * (1 - ease((c - 1.6) / 1.2))).add(V3(0, 0.5, 0.4));
      if (c > 3 && c < 3.08) { for (let k = 0; k < 50; k++) fx.spawn(atpG.position.clone().add(gC), randUnit().multiplyScalar(1.4), new THREE.Color(0xffd070), 0.8, 2, 1.5); st.used++; }
      const pk = packet;
      if (c > 3 && c < 4.6) { const u = ease((c - 3) / 1.6); const p = atpG.position.clone().add(gC).lerp(use.p, u); pk.core.visible = pk.spr.visible = true; pk.core.position.copy(p); pk.spr.position.copy(p); pk.core.material.color.set('#FFD070'); }
      else if (c > 4.8 && c < 6.4) { const u = ease((c - 4.8) / 1.6); const p = src.p.clone().lerp(atpG.position.clone().add(gC), u); pk.core.visible = pk.spr.visible = true; pk.core.position.copy(p); pk.spr.position.copy(p); }
      else { pk.core.visible = pk.spr.visible = false; }
      if (c > 6.4 && c < 6.48) st.made++;
      stations.forEach((s) => {
        const active = (s === use && c > 4.4 && c < 6.4) || (s === src && c > 4.6 && c < 6.4);
        const an = s.g.userData.anim; if (an) { if (s.d.id === 'mus') an.position.x = active ? -0.4 + 0.8 * ((c - 4.4) / 2) : 0; else if (s.d.id === 'pump') an.scale.y = active ? 1 + 0.15 * Math.sin(t * 10) : 1; else an.rotation.y += dt; }
        if (s.d.id === 'syn' && s === use && active) s.g.userData.beads.forEach((bd, k) => { bd.position.y = 0.08 * Math.sin(k * 1.3 + t * 3); });
        if (active && rnd() < 0.3) fx.spawn(s.p.clone().add(randUnit().multiplyScalar(0.6)), randUnit().multiplyScalar(0.2), new THREE.Color(s.d.color), 0.6, 1, 1.0);
      });
      st.phase = c < 1.6 ? 'АТФ' : c < 3 ? 'гидролиз' : c < 4.8 ? `работа: ${use.d.name.toLowerCase()}` : c < 6.7 ? `ресинтез: ${src.d.name.split(' ')[0].toLowerCase()}` : 'АТФ снова';
      atpG.rotation.y = Math.sin(t * 0.3) * 0.4;
    }
    if (st.mode === 'funnel') {
      flows.forEach((f) => { f.mat.uniforms.uTime.value = t; });
      [...s1, ...s2, pyr, acc, atpOut, ...outs].forEach((m, k) => { m.rotation.y += dt * (0.3 + (k % 3) * 0.1); });
      tca.rotation.z -= dt * 1.2; accGlow.spr.material.opacity = 0.5 + 0.3 * Math.sin(t * 3);
      if (rnd() < 0.4) fx.spawn(V3(40 + 2.2, FY[3] + 0.2, 0).add(randUnit().multiplyScalar(0.5)), V3(0, 0.3, 0), new THREE.Color(0xffb070), 0.6, 0.5, 1.1);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'cycle') { scopeShow(false); return; } scopeShow(true);
    ctx.clearRect(0, 0, w, h); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('энергия гидролиза фосфата, −ΔG°, кДж/моль', 8, 12);
    const bh = (h - 22) / MACRO.length;
    MACRO.forEach(([n, v, c], k) => { const y = 18 + k * bh; ctx.fillStyle = c; ctx.globalAlpha = n.startsWith('АТФ') ? 1 : 0.75; ctx.fillRect(84, y + 1, (w - 120) * v / 62, bh - 3); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 6, y + bh - 3); ctx.fillText(v.toFixed(1), 88 + (w - 120) * v / 62, y + bh - 3); });
  }
  const TXT = {
    cycle: '<b>АТФ — энергетическая валюта клетки.</b> Аденин, рибоза и три фосфата; связи между фосфатами — <b>макроэргические</b>: при гидролизе концевого фосфата выделяется 30,5 кДж/моль. Смотрите цикл: вода атакует связь, отрывается фосфат (Фн), энергия уходит на работу — мышечную, транспортную или химическую. Затем АДФ снова «заряжается» за счёт окисления питательных веществ. На графике — АТФ стоит посередине шкалы макроэргов: он может получать фосфат от более богатых молекул (ФЕП, 1,3-БФГ, креатинфосфат) и отдавать его более бедным (глюкоза → глюкозо-6-фосфат).',
    funnel: '<b>Три стадии катаболизма.</b> Сотни разных молекул пищи сходятся в немногие общие пути: белки, углеводы и жиры распадаются до мономеров, мономеры — до <b>ацетил-КоА</b>, а он сгорает в цикле Кребса и дыхательной цепи до CO₂ и воды с образованием АТФ. Азот аминокислот уходит в виде аммиака (затем — мочевины). Нажмите на стадию.',
  };
  const labels = [
    ...stations.map((s) => ({ text: s.d.name, pos: s.p.clone().add(s.kind === 'use' ? V3(-0.6, -0.7, 0) : V3(-0.7, -0.85, 0)), color: s.d.color, show: () => st.labels && st.mode === 'cycle' })),
    
    { text: 'γ-фосфат', pos: gC.clone().add(V3(0, 1.3, 0)), color: '#FF9A30', show: () => st.labels && st.mode === 'cycle' && st.cyc % 8 < 3 },
    { text: 'Фн', pos: gC.clone().add(piDir.clone().multiplyScalar(1.4)).add(V3(0.2, 1.1, 0)), color: '#FF9A30', show: () => st.labels && st.mode === 'cycle' && st.cyc % 8 > 3.6 && st.cyc % 8 < 5.4 },
    { text: 'H₂O', pos: gC.clone().add(V3(0.5, 1.6, 0.4)), color: '#9FD8FF', show: () => st.labels && st.mode === 'cycle' && st.cyc % 8 > 1.8 && st.cyc % 8 < 3 },
    ...['белки', 'полисахариды', 'жиры'].map((n, k) => ({ text: n, pos: V3(40 + lane(k) - 0.4, FY[0] + 0.85, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'funnel' })),
    ...['аминокислоты', 'глюкоза', 'жирные кислоты + глицерин'].map((n, k) => ({ text: n, pos: V3(40 + lane(k) - 0.5, FY[1] + 0.6, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'funnel' })),
    { text: 'пируват', pos: V3(40 - 2.1, FY[2] + 0.55, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'funnel' },
    { text: 'ацетил-КоА', pos: V3(40 + 0.4, FY[2] - 0.2, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'funnel' },
    { text: 'цикл Кребса', pos: V3(40 - 2.4, FY[3] + 0.3, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'funnel' },
    { text: 'дыхательная цепь', pos: V3(40 + 0.9, FY[3] + 0.45, 0), color: '#FFB070', show: () => st.labels && st.mode === 'funnel' },
    { text: 'АТФ', pos: V3(40 + 3.7, FY[3] + 0.3, 0), color: '#FFD070', show: () => st.labels && st.mode === 'funnel' },
    ...['CO₂', 'H₂O', 'NH₃ → мочевина'].map((n, k) => ({ text: n, pos: V3(40 + 0.3, 0, 0).add(OUTP[k]).add(V3(0, -0.05, 0)), color: '#D9D2D8', show: () => st.labels && st.mode === 'funnel' })),
    ...CAT_ST.map((s, k) => ({ text: s.name, pos: V3(40 + 4.6, [FY[0] + 0.1, (FY[1] + FY[2]) / 2, FY[3]][k], 0), color: s.color, show: () => st.labels && st.mode === 'funnel' })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const s = CAT_ST.find((x) => x.id === st.sel) || [...ATP_USE, ...ATP_SRC].find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (s ? s.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'cycle', label: 'Цикл АТФ' }, { id: 'funnel', label: 'Стадии катаболизма' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 460px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      const list = st.mode === 'cycle' ? [...ATP_USE, ...ATP_SRC] : CAT_ST;
      const sg = seg(list.map((x) => ({ id: x.id, label: x.name, color: x.color })), () => st.sel, (v) => { st.sel = st.sel === v ? null : v; sg.sync(); refs.setInfo(); });
      box.append(h('div', { class: 'glabel' }, st.mode === 'cycle' ? 'Потребители и источники' : 'Стадия'), h('div', { class: 'gctl' }, sg));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–2', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 2) { setMode(['cycle', 'funnel'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'cycle' ? [['Этап', st.phase || '', ''], ['Оборот АТФ', '≈ масса тела', 'в сутки']] : [['Энергии в стадии 3', '≈ ⅔', ''], ['Запас АТФ в теле', '≈ 100', 'г']]; }
  const self = {
    mobZoom: 1.0, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FFB070',
    kicker: 'Биохимия · энергия', title: 'АТФ и стадии катаболизма',
    lede: 'Клетка не может напрямую «сжечь» сахар для работы: энергия пищи сначала переводится в универсальную валюту — АТФ. Человек за сутки синтезирует и тратит её примерно столько, сколько весит сам.',
    notes: `
      <div><h2>Энергия в клетке</h2>
        <p><b>Метаболизм</b> = <b>катаболизм</b> (распад, ΔG &lt; 0, экзергонические реакции) + <b>анаболизм</b> (синтез, ΔG &gt; 0, эндергонические). Связывает их <b>сопряжение</b>: энергия распада запасается в макроэргах (АТФ) и восстановленных коферментах (НАДН, НАДФН, ФАДН₂) и тратится на синтез и работу.</p>
        <p>Изменение свободной энергии ΔG = ΔH − TΔS. Если ΔG &lt; 0, реакция идёт самопроизвольно; если ΔG &gt; 0 — только в паре с реакцией, дающей энергию.</p>
        <h3>Как синтезируется АТФ</h3><p><b>Окислительное фосфорилирование</b> (митохондрии, ~90%) и <b>субстратное</b> (гликолиз, цикл Кребса). В мышцах есть быстрый резерв — <b>креатинфосфат</b>: креатинкиназа за доли секунды перебрасывает с него фосфат на АДФ.</p></div>
      <div><h2>Этапы обмена веществ</h2><ol style="padding-left:18px;color:#D2CBD0"><li>Поступление с пищей.</li><li>Переваривание до мономеров.</li><li>Всасывание и транспорт кровью и лимфой.</li><li>Промежуточный обмен в клетках.</li><li>Выделение конечных продуктов: CO₂, H₂O, мочевины.</li></ol>
        <h2 style="margin-top:18px">Условности и модели</h2><ul><li>Молекулы — по химическим формулам; протеин в воронке — лизоцим (PDB 1AKI) как пример белка.</li><li>«Пакет энергии» — условность: энергия передаётся через химическую связь, а не летит по воздуху.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>2</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('cycle'); st.fly = null;
  return self;
}
