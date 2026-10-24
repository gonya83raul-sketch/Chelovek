import { GLTFLoader, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, dimOthers, displaceGeo, ell3, envTex, fetchModel, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, makeControls, mulberry, organMat, pickOn, randUnit, range, rnd, scopeShow, seg, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · РАЗМНОЖЕНИЕ И РАЗВИТИЕ (учебная схема)
   ========================================================= */
const RP_F = [
  { id: 'ov', name: 'Яичники', color: '#F2B0C8', text: '<b>Яичники</b> (3–4 см) — женские половые железы. В них с рождения заложены сотни тысяч незрелых яйцеклеток в фолликулах; за жизнь созревают и выходят около 400–500. Яичники выделяют эстрогены и прогестерон.' },
  { id: 'tube', name: 'Маточные трубы', color: '#F2C88A', text: '<b>Маточные (фаллопиевы) трубы</b> (10–12 см) подхватывают яйцеклетку бахромками, реснички и сокращения стенки несут её к матке. Оплодотворение обычно происходит в расширенной наружной трети трубы.' },
  { id: 'ut', name: 'Матка', color: '#E88A9A', text: '<b>Матка</b> — полый мышечный орган размером с грушу (7–8 см). Её внутренний слой, эндометрий, каждый месяц утолщается, готовясь принять эмбрион, а если беременность не наступила — отторгается (менструация). Во время беременности матка растягивается в сотни раз по объёму.' },
  { id: 'cerv', name: 'Шейка и влагалище', color: '#D8A0B0', text: '<b>Шейка матки</b> соединяет матку с <b>влагалищем</b> — мышечным каналом, по которому выходит менструальная кровь и рождается ребёнок. Слизь шейки большую часть цикла густая и защищает от микробов.' },
];
const RP_M = [
  { id: 'tes', name: 'Яички', color: '#C8D8F0', text: '<b>Яички</b> — мужские половые железы в мошонке, вне брюшной полости: сперматозоидам нужна температура на 2–3 °C ниже температуры тела. В извитых канальцах непрерывно, с полового созревания и до старости, образуются сперматозоиды (~100 млн в сутки); созревание одного занимает ~74 дня. Клетки Лейдига выделяют тестостерон.' },
  { id: 'epi', name: 'Придаток и семявыносящий проток', color: '#9FD0FF', text: '<b>Придаток яичка</b> — длинный свёрнутый проток, где сперматозоиды дозревают и учатся двигаться. <b>Семявыносящий проток</b> поднимается в брюшную полость, огибает мочевой пузырь и вливается в мочеиспускательный канал.' },
  { id: 'gl', name: 'Семенные пузырьки и простата', color: '#F2D88A', text: '<b>Семенные пузырьки</b> и <b>предстательная железа</b> выделяют жидкость с фруктозой (энергия для сперматозоидов) и веществами, защищающими их. Простата охватывает начало мочеиспускательного канала; с возрастом она часто увеличивается.' },
  { id: 'ure', name: 'Мочеиспускательный канал', color: '#E8B0A0', text: '<b>Мочеиспускательный канал</b> у мужчин длиннее (~20 см) и служит общим путём для мочи и семенной жидкости.' },
];
function makeRepro(initMode) {
  __set_rnd(mulberry(2121));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xf2b0c8);
  const VIEW = { female: flyTarget(V3(0, -0.4, 0), V3(1.5, 0.6, 4.6)), male: flyTarget(V3(0, -0.4, 0.1), V3(2.2, 0.3, 2.6)), cycle: flyTarget(V3(0.15, -0.05, 0), V3(1.0, 0.45, 2.7)), dev: flyTarget(V3(0.1, -0.05, 0), V3(-0.9, 0.5, 2.8)) };
  const V0 = VIEW[initMode || 'female']; const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(V0.pos);
  const controls = makeControls(camera, V0.target); controls.minDistance = 0.8; controls.maxDistance = 14;
  bodyShell(scene, { rim: 0.18, arms: false });
  const PART = Object.fromEntries([...RP_F, ...RP_M].map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const F = new THREE.Group(), M = new THREE.Group(); scene.add(F, M); M.visible = false;
  const add = (id, g, parent, o = {}) => { const m = organMat(PART[id].color, o.k ?? 0.45, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  const ghost = (g, c, parent) => { const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.35), roughness: 0.6, transparent: true, opacity: 0.18, depthWrite: false })); parent.add(m); return m; };
  // таз (кость-призрак)
  const pelvis = new THREE.Mesh((() => { const g = new THREE.TorusGeometry(0.5, 0.06, 10, 48); g.rotateX(Math.PI / 2 - 0.5); g.scale(1, 1, 0.75); g.translate(0, 0.05, -0.05); return g; })(), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.3), roughness: 0.6, transparent: true, opacity: 0.1, depthWrite: false })); scene.add(pelvis);
  /* ---------- женская система ---------- */
  ghost(ell3(0.12, 0.09, 0.09, V3(0, -0.02, 0.24)), '#F2D860', F); ghost(tube([V3(0, 0.4, -0.3), V3(0.02, 0.0, -0.28), V3(0, -0.4, -0.18)], 0.06, 20, 10), '#C8A090', F);
  const utG = displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { let k = v.y < 0 ? 1 - 0.55 * (-v.y) : 1; v.set(v.x * 0.17 * k, v.y * 0.2, v.z * 0.1 * k); }); utG.rotateX(-0.35); utG.translate(0, 0.17, 0.04);
  const ut = add('ut', utG, F, { mat: { transparent: true, opacity: 0.55, depthWrite: false } });
  const endoG = displaceGeo(new THREE.SphereGeometry(1, 40, 30), (v) => { let k = v.y < 0 ? 1 - 0.6 * (-v.y) : 1; v.set(v.x * 0.11 * k, v.y * 0.14, v.z * 0.02 * k + 0.0); }); endoG.rotateX(-0.35); endoG.translate(0, 0.18, 0.04);
  const endoMat = new THREE.MeshPhysicalMaterial({ color: 0x8a1830, emissive: 0x3a0610, emissiveIntensity: 0.5, roughness: 0.4 }); const endo = new THREE.Mesh(endoG, endoMat); F.add(endo);
  const CERV = new THREE.CatmullRomCurve3([V3(0, 0.0, 0.0), V3(0, -0.12, -0.03), V3(0, -0.28, -0.05), V3(0, -0.45, -0.02)]);
  add('cerv', taperTube(CERV, (u) => (u < 0.3 ? 0.06 : 0.05), 30, 12), F, { mat: { transparent: true, opacity: 0.7 } });
  const OVP = [V3(0.36, 0.17, -0.03), V3(-0.36, 0.17, -0.03)];
  const TUBE = [1, -1].map((s) => new THREE.CatmullRomCurve3([V3(0.12 * s, 0.33, 0.02), V3(0.25 * s, 0.36, 0.02), V3(0.4 * s, 0.33, 0.0), V3(0.45 * s, 0.24, 0.0), V3(0.41 * s, 0.19, 0.02)]));
  TUBE.forEach((c) => { add('tube', taperTube(c, (u) => 0.015 + 0.02 * u, 50, 10), F); const end = c.getPointAt(1); for (let k = 0; k < 9; k++) add('tube', tube([end, end.clone().add(randUnit().multiplyScalar(0.05))], 0.006, 4, 4), F); });
  const ovM = OVP.map((p) => add('ov', ell3(0.07, 0.045, 0.04, p), F));
  const foll = new THREE.Mesh(new THREE.SphereGeometry(0.03, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xffe0f0, transparent: true, opacity: 0.6, emissive: 0x5a2040, emissiveIntensity: 0.5 })); foll.position.copy(OVP[0]).add(V3(0.0, 0.02, 0.035)); F.add(foll);
  const cl = glowNucleus(F, OVP[0].clone().add(V3(0.0, 0.02, 0.035)), '#F2C14E', 0.025, 6);
  const egg = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xfff0f8, emissive: 0x806070, emissiveIntensity: 0.8 })); F.add(egg); egg.visible = false;
  // зародыш: группа шаров
  const embryo = new THREE.Group(); F.add(embryo); embryo.visible = false;
  const emCells = []; const emMat = new THREE.MeshPhysicalMaterial({ color: 0xffe8f0, roughness: 0.3, transparent: true, opacity: 0.9, emissive: 0x604050, emissiveIntensity: 0.6, clearcoat: 0.6 });
  for (let i = 0; i < 32; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), emMat); embryo.add(m); emCells.push(m); }
  const blast = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), new THREE.MeshPhysicalMaterial({ color: 0xffd8e8, transparent: true, opacity: 0.35, depthWrite: false, emissive: 0x604050, emissiveIntensity: 0.4 })); embryo.add(blast);
  const PATH = new THREE.CatmullRomCurve3([...TUBE[0].getPoints(8).reverse().slice(1), V3(0.06, 0.3, 0.03), V3(0.03, 0.24, 0.05)]);
  /* ---------- мужская система ---------- */
  ghost(ell3(0.12, 0.1, 0.1, V3(0, 0.06, 0.18)), '#F2D860', M); ghost(tube([V3(0, 0.4, -0.3), V3(0.02, 0.0, -0.28), V3(0, -0.4, -0.18)], 0.06, 20, 10), '#C8A090', M);
  const TES = [1, -1].map((s) => V3(0.07 * s, -0.56, 0.32));
  TES.forEach((p, i) => { add('tes', ell3(0.045, 0.065, 0.045, p), M); add('epi', (() => { const g = ell3(0.018, 0.06, 0.02); g.translate(p.x + (i ? -0.035 : 0.035), p.y + 0.01, p.z - 0.03); return g; })(), M); });
  const VAS = [1, -1].map((s) => new THREE.CatmullRomCurve3([V3(0.1 * s, -0.5, 0.29), V3(0.12 * s, -0.3, 0.3), V3(0.17 * s, -0.05, 0.26), V3(0.2 * s, 0.12, 0.15), V3(0.12 * s, 0.14, 0.03), V3(0.06 * s, 0.0, 0.05), V3(0.02 * s, -0.12, 0.13)]));
  VAS.forEach((c) => add('epi', taperTube(c, () => 0.01, 60, 6), M));
  [1, -1].forEach((s) => { const g = ell3(0.025, 0.06, 0.02); g.rotateZ(0.6 * s); g.translate(0.08 * s, 0.02, 0.05); add('gl', g, M); });
  add('gl', ell3(0.05, 0.04, 0.045, V3(0, -0.12, 0.14)), M);
  const URE = new THREE.CatmullRomCurve3([V3(0, -0.02, 0.17), V3(0, -0.12, 0.14), V3(0, -0.26, 0.22), V3(0, -0.36, 0.33), V3(0, -0.5, 0.44)]);
  add('ure', taperTube(URE, () => 0.012, 40, 8), M, { k: 0.5 });
  ghost(tube([V3(0, -0.3, 0.3), V3(0, -0.38, 0.38), V3(0, -0.52, 0.46)], 0.045, 20, 12), '#E8B0A0', M);
  const fx = new Sparks(2000, 0.035); scene.add(fx.obj);
  /* ---------- реалистичная 3D-модель: Education Resource Fund (Sketchfab, CC BY 4.0) ---------- */
  const RP_R = [
    { id: 'r_ut', name: 'Матка и влагалище', color: '#E88A9A', keys: ['Uterus_and_vagina'], text: '<b>Матка</b> — полый мышечный орган размером с грушу (7–8 см): дно, тело и шейка. Стенка из трёх слоёв: эндометрий (ежемесячно обновляется), мощный миометрий и наружная оболочка. Обычно матка наклонена вперёд, над мочевым пузырём. Шейка открывается во <b>влагалище</b> — эластичный мышечный канал 7–10 см, по которому выходит менструальная кровь и рождается ребёнок.' },
    { id: 'r_tube', name: 'Маточные трубы', color: '#F2C88A', keys: ['Tubes'], text: '<b>Маточные трубы</b> (10–12 см) отходят от углов матки. Их воронки с бахромками охватывают яичник и подхватывают яйцеклетку; реснички и сокращения стенки несут её к матке. Оплодотворение обычно происходит в широкой наружной части трубы (ампуле).' },
    { id: 'r_ov', name: 'Яичники', color: '#F2B0C8', keys: ['Ovaries'], text: '<b>Яичники</b> (3–4 см) лежат по бокам матки у стенки таза. В них хранятся незрелые яйцеклетки в фолликулах; каждый месяц обычно созревает и выходит одна. Яичники выделяют эстрогены и прогестерон.' },
    { id: 'r_lig', name: 'Связки', color: '#C8D8B0', keys: ['Broad_ligament', 'Round_ligament', 'Cardinal_ligament', 'Uterosacral_lig', 'Ovarian_ligament', 'Pubocervical_facia'], text: '<b>Связочный аппарат.</b> <b>Широкая связка</b> — складка брюшины, в которой лежат трубы и сосуды. <b>Круглые связки</b> идут к паховым каналам и держат матку наклонённой вперёд. <b>Кардинальные</b> и <b>крестцово-маточные</b> связки и <b>лобково-шеечная фасция</b> — главная опора шейки матки. <b>Собственная связка яичника</b> соединяет его с маткой. При ослаблении опоры (после родов, с возрастом) органы могут опускаться.' },
    { id: 'r_blad', name: 'Мочевой пузырь', color: '#F2D860', keys: ['Bladder'], text: '<b>Мочевой пузырь</b> лежит спереди от матки, за лобковым симфизом. При наполнении он приподнимает матку, а растущая при беременности матка давит на пузырь — поэтому беременным чаще хочется в туалет.' },
    { id: 'r_int', name: 'Прямая кишка', color: '#C8A090', keys: ['Large_intestine'], text: '<b>Сигмовидная и прямая кишка</b> лежат позади матки. Между ними брюшина образует прямокишечно-маточное углубление — самую низкую точку брюшной полости.' },
    { id: 'r_bone', name: 'Таз и крестец', color: '#E8D8BB', keys: ['Pelvis', 'Sacrum'], text: '<b>Таз</b>: две тазовые кости, крестец и копчик. Женский таз шире, ниже и с более округлым входом, чем мужской, а угол под лобковым симфизом больше — это приспособление к родам.' },
    { id: 'r_ext', name: 'Наружные органы', color: '#D8A0B0', keys: ['Labia_minora'], text: '<b>Наружные половые органы</b> (на модели показаны малые половые губы) окружают преддверие влагалища, куда открываются влагалище и мочеиспускательный канал.' },
  ];
  RP_R.forEach((p) => { PART[p.id] = { ...p, mats: [], c: V3(0, 0, 0), n: 0 }; });
  const REAL = new THREE.Group(); scene.add(REAL); REAL.visible = false;
  function loadReal() {
    if (st.realLoad) return; st.realLoad = 1; refs.setInfo && refs.setInfo();
    fetchModel('repro').then((buf) => {
      new GLTFLoader().parse(buf, '', (gltf) => {
        const root = gltf.scene; root.updateMatrixWorld(true);
        const pel = root.getObjectByName('Pelvis') || root; const box = new THREE.Box3().setFromObject(pel); const size = box.getSize(V3(0, 0, 0)), c = box.getCenter(V3(0, 0, 0));
        const k = REAL_W / size.x; root.scale.setScalar(k); root.position.copy(c).multiplyScalar(-k).add(REAL_AT); REAL.add(root); root.updateMatrixWorld(true);
        root.traverse((o) => { if (!o.isMesh) return; const p = RP_R.find((q) => q.keys.some((kk) => o.name.startsWith(kk + '_'))); if (!p) return;
          o.userData.pick = p.id; pick.push(o); const m = o.material; m.envMapIntensity = 0.3; m.color.multiplyScalar(p.id === 'r_bone' ? 0.5 : 0.78); if (m.clearcoat !== undefined) m.clearcoat = Math.min(m.clearcoat, 0.5); m.side = THREE.DoubleSide; PART[p.id].mats.push(m);
          const bc = new THREE.Box3().setFromObject(o).getCenter(V3(0, 0, 0)); PART[p.id].c.add(bc); PART[p.id].n++; });
        RP_R.forEach((p) => { if (PART[p.id].n) PART[p.id].lab.pos.copy(PART[p.id].c.divideScalar(PART[p.id].n)).add(LAB_OFF[p.id] || V3(0, 0, 0)); });
        st.realLoad = 2; setMode(st.mode);
      }, (e) => { st.realErr = String(e); refs.setInfo && refs.setInfo(); });
    }).catch((e) => { st.realErr = e.message; refs.setInfo && refs.setInfo(); });
  }
  function boneGlass() { if (!(st.mode === 'female' && st.realLoad === 2) || st.sel) return; PART.r_bone.mats.forEach((m) => { m.transparent = true; m.opacity = 0.45; m.depthWrite = false; m.needsUpdate = true; }); }
  const REAL_W = 1.5, REAL_AT = V3(0, -0.05, -0.05);
  const LAB_OFF = { r_ut: V3(0.08, 0.12, 0.12), r_tube: V3(0.35, 0.12, 0.05), r_ov: V3(0.42, -0.02, 0.05), r_lig: V3(-0.55, 0.05, 0.1), r_blad: V3(0.0, 0.0, 0.18), r_int: V3(-0.15, 0.1, -0.15), r_bone: V3(-0.8, 0.3, 0.0), r_ext: V3(0.1, -0.05, 0.1) };
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: initMode || 'female', pause: false, sel: null, labels: true, rot: false, fly: null, day: 1, devT: -99, msg: null, trace: [] };
  const parts = () => (st.mode === 'male' ? RP_M : st.mode === 'female' && st.realLoad === 2 ? RP_R : RP_F);
  const schem = () => st.mode === 'cycle' || st.mode === 'dev' || (st.mode === 'female' && st.realLoad !== 2);
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(parts().map((p) => PART[p.id]), st.sel); if (parts() === RP_F) ut.material.opacity = st.sel && st.sel !== 'ut' ? 0.12 : 0.55; boneGlass(); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; const real = m === 'female' && st.realLoad === 2; F.visible = m !== 'male' && !real; REAL.visible = real; M.visible = m === 'male'; if (m === 'female') loadReal(); if (real) { dimOthers(RP_R.map((p) => PART[p.id]), null); boneGlass(); } st.fly = VIEW[m]; st.sel = null; refs.rebuild && refs.rebuild(); if (m === 'dev') { st.devT = st.t; st.devStage = -1; } refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'female' || st.mode === 'male') select(id); });
  // гормоны цикла (день 1–28)
  const gau = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
  const HORM = (d) => ({ fsh: 0.35 + 0.25 * gau(d, 3, 3) + 0.35 * gau(d, 13.5, 1.2), lh: 0.2 + 0.85 * gau(d, 13.8, 0.9), est: 0.15 + 0.7 * gau(d, 12.5, 2.4) + 0.35 * gau(d, 21, 3.5), prog: 0.05 + 0.85 * gau(d, 21, 3.5) });
  const C_S = new THREE.Color(0x9fd0ff), C_B = new THREE.Color(0xc02030);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    // цикл
    if (st.mode === 'cycle') {
      if (!st.pause) st.day += dt * st.speed; if (st.day >= 29) st.day = 1; const d = st.day;
      const thick = d < 5 ? 0.35 - 0.05 * d : d < 14 ? 0.3 + (d - 5) * 0.06 : 0.85 + (d - 14) * 0.012;
      endo.scale.set(1, 1, Math.max(0.3, thick * 3.2)); endoMat.emissiveIntensity = d < 5 ? 0.9 : 0.4;
      const fg = d < 14 ? 0.3 + (d / 14) * 1.0 : 0.0; foll.scale.setScalar(Math.max(0.001, fg)); foll.visible = d < 14.2;
      const lut = d > 14.5 ? gau(d, 21, 4) : 0; cl.spr.material.opacity = lut; cl.core.visible = lut > 0.05; cl.core.scale.setScalar(0.5 + lut);
      egg.visible = d > 14 && d < 18; if (egg.visible) egg.position.copy(TUBE[0].getPointAt(1 - Math.min(1, (d - 14) / 4)));
      if (d < 5 && rnd() < 0.6) fx.spawn(CERV.getPointAt(rnd()), V3(0, -0.15, 0), C_B, 0.6, 0, 1.2);
      if (d > 13.6 && d < 14.2) for (let j = 0; j < 4; j++) fx.spawn(OVP[0].clone().add(V3(0, 0.02, 0.04)), randUnit().multiplyScalar(0.15), new THREE.Color(0xffe0f0), 0.6, 1, 1);
      const hm = HORM(d); st.trace.push([d, hm.fsh, hm.lh, hm.est, hm.prog]); st.trace = st.trace.filter((r) => r[0] <= d + 0.01 && r[0] > d - 28.5 && r[0] <= d);
      if (Math.floor(d) !== st.lastDay) { st.lastDay = Math.floor(d); refs.setInfo(); }
    } else { endo.scale.set(1, 1, 1); foll.visible = st.mode === 'female'; foll.scale.setScalar(1); cl.spr.material.opacity = 0; cl.core.visible = false; egg.visible = false; }
    // развитие
    embryo.visible = st.mode === 'dev';
    if (st.mode === 'dev') {
      const D = (t - st.devT) / 1.6; st.devDay = D;   // 1,6 с на сутки
      if (D < 0.6) { for (let j = 0; j < 6; j++) { const u = rnd() * Math.min(1, D / 0.6); const c = u < 0.4 ? CERV : null; const p = c ? CERV.getPointAt(1 - u / 0.4) : u < 0.6 ? V3(0, 0.0 + (u - 0.4) * 1.3, 0.04) : TUBE[0].getPointAt((u - 0.6) / 0.4 * 0.7); fx.spawn(p.add(randUnit().multiplyScalar(0.02)), randUnit().multiplyScalar(0.03), C_S, 0.4, 1, 0.8); } }
      const u = clamp(D / 5.5, 0, 1); const pos = D < 6.5 ? PATH.getPointAt(u) : PATH.getPointAt(1).clone().add(V3(0, 0, -0.02 * Math.min(1, (D - 6.5))));
      embryo.position.copy(pos);
      const n = D < 1 ? 1 : D < 1.5 ? 2 : D < 2 ? 4 : D < 3 ? 8 : D < 4 ? 16 : 32; const isBlast = D >= 4.5;
      emCells.forEach((m, i) => { m.visible = i < n; if (!m.visible) return; const r = n === 1 ? 0 : 0.012 * Math.cbrt(n); const dir = n === 1 ? V3(0, 0, 0) : V3(Math.sin(i * 2.4) * Math.cos(i * 1.7), Math.cos(i * 2.4), Math.sin(i * 1.7) * Math.sin(i * 2.4)).normalize(); const sz = 0.016 / Math.cbrt(n) * (n > 1 ? 1.15 : 1);
        if (isBlast) { const inner = i < 8; m.position.copy(inner ? dir.clone().multiplyScalar(0.008).add(V3(0.01, 0.006, 0)) : dir.clone().multiplyScalar(0.022)); m.scale.setScalar(inner ? 0.006 : 0.005); } else { m.position.copy(dir.multiplyScalar(r)); m.scale.setScalar(sz); } });
      blast.visible = isBlast; blast.scale.setScalar(0.025);
      const stage = D < 1 ? 0 : D < 4 ? 1 : D < 6 ? 2 : 3; if (stage !== st.devStage) { st.devStage = stage; st.msg = DEV[stage]; refs.setInfo(); }
      if (D > 11) st.devT = t;
    }
    if (st.mode === 'male' && st.sel !== null && rnd() < 0.5) { const c = VAS[rnd() < 0.5 ? 0 : 1]; fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_S, 0.5, 0, 0.8); }
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode === 'cycle'; scopeShow(on); if (!on) return;
    const x = (d) => 8 + (d - 1) / 27 * (w - 16), Y = (v) => hgt - 10 - v * (hgt - 26);
    const cols = ['#9FD0FF', '#C77DFF', '#FF8AB0', '#F2C14E'], names = ['ФСГ', 'ЛГ', 'эстроген', 'прогест.'];
    ctx.fillStyle = 'rgba(255,80,90,.12)'; ctx.fillRect(x(1), 14, x(5) - x(1), hgt - 24);
    cols.forEach((c, k) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); for (let d = 1; d <= 28; d += 0.25) { const hm = HORM(d), v = [hm.fsh, hm.lh, hm.est, hm.prog][k]; d === 1 ? ctx.moveTo(x(d), Y(v)) : ctx.lineTo(x(d), Y(v)); } ctx.globalAlpha = 0.85; ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = c; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(names[k], 10 + k * 62, 11); });
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x(st.day), 14); ctx.lineTo(x(st.day), hgt - 8); ctx.stroke();
  }
  const DEV = [
    '<b>День 0: оплодотворение.</b> Из ~200 млн сперматозоидов до яйцеклетки в маточной трубе добираются несколько сотен, а проникает внутрь только один. Ядра сливаются — получается <b>зигота</b> с полным набором из 46 хромосом: половина от матери, половина от отца.',
    '<b>Дни 1–4: дробление.</b> Зигота делится на 2, 4, 8, 16 клеток, не увеличиваясь в размере, и медленно движется по трубе к матке. К 4-му дню это <b>морула</b> — «тутовая ягода» из 16–32 клеток.',
    '<b>Дни 5–6: бластоциста.</b> Внутри появляется полость. Наружный слой клеток (трофобласт) станет плацентой, а маленькая внутренняя клеточная масса — самим зародышем.',
    '<b>Дни 6–10: имплантация.</b> Бластоциста внедряется в утолщённый эндометрий. Трофобласт начинает выделять ХГЧ — гормон, который поддерживает жёлтое тело (поэтому менструация не наступает) и который определяют тесты на беременность. Дальше — развитие нервной трубки и мозга (см. вкладку «Развитие мозга»), всего ~38 недель.',
  ];
  const TXT = {
    female: '<b>Женская половая система</b> — реалистичная 3D-модель органов малого таза: матка и влагалище, маточные трубы, яичники, связки, которые их удерживают, а рядом мочевой пузырь, прямая кишка и кости таза. Вращайте модель и нажимайте на органы.',
    male: '<b>Мужская половая система</b> (схема): яички с придатками, семявыносящие протоки, семенные пузырьки, предстательная железа и мочеиспускательный канал. Нажмите на орган.',
    cycle: '',
    dev: '',
  };
  const cycText = () => { const d = Math.floor(st.day); const ph = d <= 5 ? '<b>Менструация (дни 1–5).</b> Уровни эстрогена и прогестерона низкие, функциональный слой эндометрия отторгается. Гипофиз начинает выделять ФСГ — в яичнике растут фолликулы.' : d < 13 ? '<b>Фолликулярная фаза.</b> Под действием ФСГ созревает главный фолликул и выделяет всё больше эстрогена — эндометрий утолщается.' : d <= 15 ? '<b>Овуляция (~14-й день).</b> Пик эстрогена вызывает резкий выброс ЛГ гипофизом — фолликул лопается, яйцеклетка выходит в трубу. Она жизнеспособна около суток.' : '<b>Лютеиновая фаза.</b> На месте фолликула образуется <b>жёлтое тело</b> и выделяет прогестерон — эндометрий становится рыхлым и богатым сосудами. Если оплодотворения нет, через ~12 дней жёлтое тело угасает, гормоны падают, начинается новый цикл.'; return `День ${d} из 28. ` + ph; };
  const labels = [
    { text: 'яичник', pos: V3(0.48, 0.12, 0.05), color: '#F2B0C8', show: () => st.labels && schem() },
    { text: 'маточная труба', pos: V3(0.3, 0.42, 0.05), color: '#F2C88A', show: () => st.labels && schem() },
    { text: 'матка', pos: V3(-0.2, 0.3, 0.08), color: '#E88A9A', show: () => st.labels && schem() },
    { text: 'эндометрий', pos: V3(-0.06, 0.12, 0.12), color: '#ff7a8a', show: () => st.labels && st.mode === 'cycle' },
    { text: 'шейка и влагалище', pos: V3(0.08, -0.3, -0.02), color: '#D8A0B0', show: () => st.labels && schem() },
    { text: 'мочевой пузырь', pos: V3(0.1, -0.02, 0.36), color: '#F2D860', show: () => st.labels && ((st.mode === 'female' && schem()) || st.mode === 'male') },
    { text: 'яичко', pos: V3(0.16, -0.6, 0.36), color: '#C8D8F0', show: () => st.labels && st.mode === 'male' },
    { text: 'семявыносящий проток', pos: V3(0.24, 0.1, 0.2), color: '#9FD0FF', show: () => st.labels && st.mode === 'male' },
    { text: 'семенной пузырёк', pos: V3(-0.2, 0.05, 0.05), color: '#F2D88A', show: () => st.labels && st.mode === 'male' },
    { text: 'простата', pos: V3(0.08, -0.16, 0.2), color: '#F2D88A', show: () => st.labels && st.mode === 'male' },
    { text: 'зародыш', pos: V3(0, 0, 0), color: '#ffe8f0', show: () => st.labels && st.mode === 'dev', dyn: true },
  ];
  RP_R.forEach((p) => { const l = { text: p.name.toLowerCase(), pos: V3(0, -9, 0), color: p.color, show: () => st.labels && st.mode === 'female' && st.realLoad === 2 && (!st.sel || st.sel === p.id) }; PART[p.id].lab = l; labels.unshift(l); });
  const embLabel = labels[labels.length - 1];
  const refs = {};
  loadReal();
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'female' && st.realErr ? 'Не удалось загрузить 3D-модель: ' + st.realErr : st.mode === 'female' && st.realLoad === 1 ? 'Загружаю реалистичную 3D-модель…' : '') || (st.mode === 'cycle' ? cycText() : (st.mode === 'female' || st.mode === 'male') && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'female', label: 'Женская система' }, { id: 'male', label: 'Мужская система' }, { id: 'cycle', label: 'Цикл' }, { id: 'dev', label: 'Первая неделя' }], () => st.mode, (v) => setMode(v));
    const segBox = h('div', { class: 'gctl' });
    refs.rebuild = () => { segBox.innerHTML = ''; const list = parts(); refs.seg = seg([{ id: 'all', label: 'Все' }, ...list.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'cycle' || st.mode === 'dev') setMode('female'); select(v); }); segBox.append(refs.seg); };
    refs.rebuild();
    st.speed = 1.5; const sp = range('rpspeed', 0.5, 4, 0.1, () => st.speed, (v) => { st.speed = v; }, (v) => v.toFixed(1) + ' дн/с');
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 440px' }, h('div', { class: 'glabel' }, 'Органы', h('kbd', {}, 'клик')), segBox), group('Фазы цикла', '', ...[['Менструация', 1.5], ['Фолликулярная', 8], ['Овуляция', 13.7], ['Лютеиновая', 21]].map(([n, d], i) => button(n, () => { if (st.mode !== 'cycle') setMode('cycle'); st.day = d; st.msg = null; refs.setInfo(); }, i === 0)), toggle('Пауза', () => st.pause, (v) => { st.pause = v; })), group('Скорость цикла', '', sp), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  const _upd = update; function update2(dt) { _upd(dt); if (st.mode === 'dev') embLabel.pos.copy(embryo.position).add(V3(0.04, 0.03, 0.03)); }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['female', 'male', 'cycle', 'dev'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'cycle' ? [['День цикла', Math.floor(st.day), 'из 28']] : st.mode === 'dev' ? [['Сутки', Math.max(0, Math.floor(st.devDay || 0)), ''], ['Клеток', (st.devDay || 0) < 1 ? 1 : (st.devDay || 0) < 4.5 ? Math.min(32, 2 ** Math.floor(1 + (st.devDay - 1) * 1.3)) : '≈100', '']] : [['Хромосом в клетке', 46, ''], ['В половой клетке', 23, '']]; }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2B0C8',
    kicker: 'Тело · размножение', title: 'Размножение и развитие',
    lede: 'Как устроены половые системы, как гормоны гипофиза и яичников задают 28-дневный цикл и что происходит с новой жизнью в первую неделю.',
    notes: `
      <div><h2>Половые клетки</h2><p>Яйцеклетка (~0,1 мм) — самая крупная клетка тела, сперматозоид (~0,05 мм с хвостом) — одна из самых маленьких. Обе образуются мейозом и несут по 23 хромосомы. Пол ребёнка определяет сперматозоид: с X-хромосомой — девочка (XX), с Y — мальчик (XY).</p>
        <h3>Гормональная регуляция</h3><p>Гипоталамус (ГнРГ) → гипофиз (ФСГ и ЛГ) → яичники или яички (эстрогены, прогестерон, тестостерон), которые по обратной связи влияют на гипоталамус и гипофиз.</p></div>
      <div><h2>Источник модели</h2><p>Женская половая система: «Adult female reproductive system», автор <a href="https://sketchfab.com/3d-models/adult-female-reproductive-system-94c38b5191324bc1ae1e87974cfdba58" target="_blank" rel="noopener">Education Resource Fund</a>, лицензия CC BY 4.0. Текстуры уменьшены для быстрой загрузки.</p><h2 style="margin-top:22px">Условности</h2><ul><li>Мужская система, цикл и первая неделя показаны схематично, как на учебном рисунке.</li><li>Цикл — усреднённый 28-дневный; в жизни длительность 21–35 дней.</li><li>Зародыш увеличен, время сжато.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li>клик: орган</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  if (initMode === 'cycle') { self.kicker = 'Тело · женское здоровье'; self.title = 'Менструальный цикл'; self.lede = 'Около 28 дней, за которые гипофиз и яичники готовят яйцеклетку и слизистую матки к возможной беременности, — по дням, с гормонами, фолликулом и эндометрием.'; }
  return self;
}
function makeMenses() { return makeRepro('cycle'); }
export { makeMenses, makeRepro };
