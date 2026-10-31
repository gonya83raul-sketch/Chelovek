import { Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, dimOthers, displaceGeo, ell3, envTex, fetchModel, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, parseGLB, pickOn, randUnit, range, rnd, scopeShow, seg, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · РАЗМНОЖЕНИЕ И РАЗВИТИЕ (учебная схема)
   ========================================================= */
const RP_F = [
  { id: 'ov', name: 'Ovaries', color: '#F2B0C8', text: '<b>The ovaries</b> (3–4 cm) are the female gonads. From birth they contain hundreds of thousands of immature eggs in follicles; over a lifetime about 400–500 mature and are released. The ovaries secrete estrogens and progesterone.' },
  { id: 'tube', name: 'Uterine tubes', color: '#F2C88A', text: '<b>The uterine (fallopian) tubes</b> (10–12 cm) catch the egg with their fimbriae; cilia and contractions of the wall carry it to the uterus. Fertilization usually takes place in the widened outer third of the tube.' },
  { id: 'ut', name: 'Uterus', color: '#E88A9A', text: '<b>The uterus</b> is a hollow muscular organ the size of a pear (7–8 cm). Its inner layer, the endometrium, thickens every month to prepare to receive an embryo and, if pregnancy does not occur, is shed (menstruation). During pregnancy the volume of the uterus increases hundreds of times.' },
  { id: 'cerv', name: 'Cervix and vagina', color: '#D8A0B0', text: '<b>The cervix</b> connects the uterus with the <b>vagina</b>, a muscular canal through which menstrual blood leaves and a baby is born. For most of the cycle the cervical mucus is thick and protects against microbes.' },
];
const RP_M = [
  { id: 'tes', name: 'Testes', color: '#C8D8F0', text: '<b>The testes</b> are the male gonads, located in the scrotum outside the abdominal cavity: sperm need a temperature 2–3 °C below body temperature. In the seminiferous tubules sperm are produced continuously from puberty into old age (~100 million per day); the maturation of a single sperm takes ~74 days. Leydig cells secrete testosterone.' },
  { id: 'epi', name: 'Epididymis and vas deferens', color: '#9FD0FF', text: '<b>The epididymis</b> is a long coiled duct where sperm finish maturing and learn to move. <b>The vas deferens</b> rises into the abdominal cavity, loops around the bladder and joins the urethra.' },
  { id: 'gl', name: 'Seminal vesicles and prostate', color: '#F2D88A', text: '<b>The seminal vesicles</b> and the <b>prostate gland</b> secrete fluid containing fructose (energy for the sperm) and protective substances. The prostate surrounds the beginning of the urethra; it often enlarges with age.' },
  { id: 'ure', name: 'Urethra', color: '#E8B0A0', text: '<b>The urethra</b> in men is longer (~20 cm) and serves as a common pathway for urine and semen.' },
];
function makeRepro(initMode) {
  __set_rnd(mulberry(2121));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xf2b0c8);
  const VIEW = { female: matchMedia('(max-width:700px)').matches ? flyTarget(V3(0, -0.3, 0), V3(1.25, 0.5, 3.75)) : flyTarget(V3(-0.25, -0.3, 0), V3(1.0, 0.5, 3.75)), male: flyTarget(V3(0, -0.3, 0.1), V3(2.2, 0.4, 2.6)), cycle: matchMedia('(max-width:700px)').matches ? flyTarget(V3(-0.08, -0.14, 0), initMode === 'cycle' ? V3(0.25, 0.1, 2.7) : V3(0.33, 0.16, 3.35)) : flyTarget(V3(-0.08, -0.04, 0), V3(0.25, 0.2, 2.7)), dev: matchMedia('(max-width:700px)').matches ? flyTarget(V3(0, 0.05, 0), V3(-0.8, 0.45, 2.6)) : flyTarget(V3(-0.2, 0.1, 0), V3(-0.84, 0.42, 2.08)) };
  const V0 = VIEW[initMode || 'female']; const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(V0.pos);
  const controls = makeControls(camera, V0.target); controls.minDistance = 0.8; controls.maxDistance = 14;
  bodyShell(scene, { rim: 0.18, arms: false });
  const PART = Object.fromEntries([...RP_F, ...RP_M].map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const F = new THREE.Group(), M = new THREE.Group(); scene.add(F, M); M.visible = false;
  const add = (id, g, parent, o = {}) => { const m = organMat(PART[id].color, o.k ?? 0.45, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  const ghost = (g, c, parent) => { const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.35), roughness: 0.6, transparent: true, opacity: 0.18, depthWrite: false })); parent.add(m); return m; };
  // таз (кость-призрак): крылья подвздошных костей, крестец и лобковая дуга
  const pelvis = new THREE.Mesh((() => { const a = [];
    [1, -1].forEach((s) => { const g = ell3(0.22, 0.2, 0.035, undefined, 24); g.rotateY(-0.7 * s); g.rotateZ(0.25 * s); g.translate(0.42 * s, 0.24, -0.12); a.push(g); });
    const sac = ell3(0.12, 0.2, 0.05, undefined, 24); sac.rotateX(0.5); sac.translate(0, 0.02, -0.36); a.push(sac);
    a.push(tube([V3(0.4, -0.08, -0.02), V3(0.24, -0.2, 0.24), V3(0, -0.23, 0.33), V3(-0.24, -0.2, 0.24), V3(-0.4, -0.08, -0.02)], 0.035, 40, 8));
    return mergeGeometries(a); })(), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.3), roughness: 0.6, transparent: true, opacity: 0.1, depthWrite: false })); scene.add(pelvis);
  /* ---------- женская система ---------- */
  const fGhosts = [ghost(ell3(0.12, 0.09, 0.09, V3(0, -0.02, 0.24)), '#F2D860', F)]; fGhosts.push(ghost(tube([V3(0, 0.4, -0.3), V3(0.02, 0.0, -0.28), V3(0, -0.4, -0.18)], 0.06, 20, 10), '#C8A090', F));   // пузырь и прямая кишка — ориентиры; в «Цикле» спрятаны, чтобы не заслонять матку
  fGhosts.push(pelvis); fGhosts.forEach((g) => { g.visible = initMode !== 'cycle'; });   // и таз-призрак: в «Цикле» не нужен
  const utG = displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { let k = v.y < 0 ? 1 - 0.68 * (-v.y) : 1 + 0.06 * v.y * (1 - v.y); v.set(v.x * 0.155 * k, v.y * 0.225, v.z * 0.095 * k); }); utG.rotateX(0.35); utG.translate(0, 0.17, 0.04);   /* груша: широкое дно, сужение к шейке */   // антеверсия: дно наклонено вперёд, над мочевым пузырём
  const ut = add('ut', utG, F, { mat: { transparent: true, opacity: 0.55, depthWrite: false } });
  const endoG = displaceGeo(new THREE.SphereGeometry(1, 40, 30), (v) => { let k = v.y < 0 ? 1 - 0.6 * (-v.y) : 1; v.set(v.x * 0.11 * k, v.y * 0.14, v.z * 0.02 * k + 0.0); });
  const endoMat = new THREE.MeshPhysicalMaterial({ color: 0x8a1830, emissive: 0x3a0610, emissiveIntensity: 0.5, roughness: 0.4 }); const endo = new THREE.Mesh(endoG, endoMat); endo.position.set(0, 0.18, 0.04); endo.rotation.x = 0.35; F.add(endo);   // геометрия в нуле: толщина растёт на месте
  const CERV = new THREE.CatmullRomCurve3([V3(0, 0.0, -0.02), V3(0, -0.12, 0.03), V3(0, -0.28, 0.08), V3(0, -0.45, 0.14)]);   // влагалище идёт вниз и вперёд
  add('cerv', taperTube(CERV, (u) => (u < 0.3 ? 0.06 : 0.05), 30, 12), F, { mat: { transparent: true, opacity: 0.7 } });
  const OVP = [V3(0.36, 0.17, -0.03), V3(-0.36, 0.17, -0.03)];
  const TUBE = [1, -1].map((s) => new THREE.CatmullRomCurve3([V3(0.12 * s, 0.33, 0.08), V3(0.25 * s, 0.36, 0.04), V3(0.4 * s, 0.33, 0.0), V3(0.45 * s, 0.24, 0.0), V3(0.41 * s, 0.19, 0.02)]));
  TUBE.forEach((c, i) => { add('tube', taperTube(c, (u) => 0.015 + 0.02 * u, 50, 10), F);
    // бахромки: 6 изогнутых сужающихся отростков веером к яичнику
    const end = c.getPointAt(1), tg = c.getTangentAt(1), toOv = OVP[i].clone().sub(end).normalize(), side = tg.clone().cross(toOv).normalize();
    for (let k = 0; k < 6; k++) { const a = (k / 5 - 0.5) * 2.2, sd = side.clone().multiplyScalar(Math.sin(a)), up = tg.clone().cross(side).multiplyScalar(Math.cos(a) * 0.6);
      const m1 = end.clone().addScaledVector(tg, 0.02).addScaledVector(sd, 0.014).addScaledVector(up, 0.012), tip = m1.clone().addScaledVector(toOv, 0.03).addScaledVector(sd, 0.016).addScaledVector(up, 0.01);
      add('tube', tube([end, m1, tip], (u) => 0.012 - 0.009 * u, 8, 5), F); } });
  const ovM = OVP.map((p) => add('ov', ell3(0.07, 0.045, 0.04, p), F));
  const smallF = [V3(0.03, 0.015, 0.02), V3(-0.035, -0.01, 0.025), V3(0.0, -0.02, -0.03)].map((d) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0xffe0f0, transparent: true, opacity: 0.55, emissive: 0x5a2040, emissiveIntensity: 0.4 })); m.position.copy(OVP[1]).add(d); m.visible = false; F.add(m); return m; });   // мелкие фолликулы второго яичника
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
  const URE = new THREE.CatmullRomCurve3([V3(0, -0.02, 0.17), V3(0, -0.12, 0.14), V3(0, -0.26, 0.22), V3(0, -0.36, 0.34), V3(0, -0.5, 0.45), V3(0, -0.66, 0.51)]);
  add('ure', taperTube(URE, () => 0.012, 40, 8), M, { k: 0.5 });
  ghost(mergeGeometries([tube([V3(0, -0.28, 0.3), V3(0, -0.4, 0.42), V3(0, -0.62, 0.5)], 0.06, 20, 14), ell3(0.065, 0.07, 0.065, V3(0, -0.66, 0.51), 20)]), '#E8B0A0', M);   // половой член с головкой
  const fx = new Sparks(2000, 0.035); scene.add(fx.obj);
  /* ---------- реалистичная 3D-модель: Education Resource Fund (Sketchfab, CC BY 4.0) ---------- */
  const RP_R = [
    { id: 'r_ut', name: 'Uterus and vagina', color: '#E88A9A', keys: ['Uterus_and_vagina'], text: '<b>The uterus</b> is a hollow muscular organ the size of a pear (7–8 cm): fundus, body and cervix. Its wall has three layers: the endometrium (renewed every month), the powerful myometrium and the outer coat. The uterus is usually tilted forward, over the bladder. The cervix opens into the <b>vagina</b>, an elastic muscular canal 7–10 cm long through which menstrual blood leaves and a baby is born.' },
    { id: 'r_tube', name: 'Uterine tubes', color: '#F2C88A', keys: ['Tubes'], text: '<b>The uterine tubes</b> (10–12 cm) arise from the corners of the uterus. Their funnels with fimbriae wrap around the ovary and catch the egg; cilia and contractions of the wall carry it to the uterus. Fertilization usually takes place in the wide outer part of the tube (the ampulla).' },
    { id: 'r_ov', name: 'Ovaries', color: '#F2B0C8', keys: ['Ovaries'], text: '<b>The ovaries</b> (3–4 cm) lie on either side of the uterus against the pelvic wall. They store immature eggs in follicles; usually one matures and is released each month. The ovaries secrete estrogens and progesterone.' },
    { id: 'r_lig', name: 'Ligaments', color: '#C8D8B0', keys: ['Broad_ligament', 'Round_ligament', 'Cardinal_ligament', 'Uterosacral_lig', 'Ovarian_ligament', 'Pubocervical_facia'], text: '<b>The ligaments.</b> The <b>broad ligament</b> is a fold of peritoneum that holds the tubes and blood vessels. The <b>round ligaments</b> run to the inguinal canals and keep the uterus tilted forward. The <b>cardinal</b> and <b>uterosacral</b> ligaments and the <b>pubocervical fascia</b> are the main support of the cervix. The <b>ovarian ligament</b> connects the ovary to the uterus. When this support weakens (after childbirth, with age), the organs may descend (prolapse).' },
    { id: 'r_blad', name: 'Urinary bladder', color: '#F2D860', keys: ['Bladder'], text: '<b>The urinary bladder</b> lies in front of the uterus, behind the pubic symphysis. When it fills, it lifts the uterus, and the growing uterus in pregnancy presses on the bladder — which is why pregnant women need to urinate more often.' },
    { id: 'r_int', name: 'Rectum', color: '#C8A090', keys: ['Large_intestine'], text: '<b>The sigmoid colon and rectum</b> lie behind the uterus. Between them the peritoneum forms the rectouterine pouch — the lowest point of the peritoneal cavity.' },
    { id: 'r_bone', name: 'Pelvis and sacrum', color: '#E8D8BB', keys: ['Pelvis', 'Sacrum'], text: '<b>The pelvis</b>: two hip bones, the sacrum and the coccyx. The female pelvis is wider and shallower than the male one, with a more rounded inlet, and the angle below the pubic symphysis is larger — an adaptation to childbirth.' },
    { id: 'r_ext', name: 'External organs', color: '#D8A0B0', keys: ['Labia_minora'], text: '<b>The external genitalia</b> (the model shows the labia minora) surround the vestibule of the vagina, into which the vagina and urethra open.' },
  ];
  RP_R.forEach((p) => { PART[p.id] = { ...p, mats: [], c: V3(0, 0, 0), n: 0 }; });
  const REAL = new THREE.Group(); scene.add(REAL); REAL.visible = false;
  function loadReal() {
    if (st.realLoad) return; st.realLoad = 1; refs.setInfo && refs.setInfo();
    fetchModel('repro').then((buf) => {
      parseGLB(buf, (gltf) => {
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
  const LAB_OFF = { r_ut: V3(0.15, 0.22, 0.1), r_tube: V3(0.35, 0.12, 0.05), r_ov: V3(0.42, -0.02, 0.05), r_lig: V3(-0.55, 0.05, 0.1), r_blad: V3(0.0, -0.05, 0.25), r_int: V3(-0.3, 0.02, -0.1), r_bone: V3(-0.8, 0.3, 0.0), r_ext: V3(0.1, -0.05, 0.1) };
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: initMode || 'female', pause: false, sel: null, labels: true, rot: false, fly: null, day: 1, devT: -99, msg: null, trace: [] };
  const parts = () => (st.mode === 'male' ? RP_M : st.mode === 'female' && st.realLoad === 2 ? RP_R : RP_F);
  const schem = () => st.mode === 'cycle' || st.mode === 'dev' || (st.mode === 'female' && st.realLoad !== 2);
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(parts().map((p) => PART[p.id]), st.sel); if (parts() === RP_F) ut.material.opacity = st.sel && st.sel !== 'ut' ? 0.12 : 0.55; boneGlass(); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; const real = m === 'female' && st.realLoad === 2; F.visible = m !== 'male' && !real; REAL.visible = real; M.visible = m === 'male'; if (m === 'female') loadReal(); if (real) { dimOthers(RP_R.map((p) => PART[p.id]), null); boneGlass(); } st.fly = VIEW[m]; st.sel = null; fGhosts.forEach((g) => { g.visible = m !== 'cycle'; }); refs.rebuild && refs.rebuild(); if (m === 'dev') { st.devT = st.t; st.devStage = -1; } refs.cycUI && refs.cycUI(); refs.setInfo && refs.setInfo(); }
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
      if (refs.phB) { const ph = d < 6 ? 0 : d < 13 ? 1 : d < 15 ? 2 : 3; if (ph !== refs.phI) { refs.phI = ph; refs.phB.forEach((b, i) => b.setAttribute('aria-pressed', i === ph ? 'true' : 'false')); } }   /* кнопка текущей фазы подсвечена */
      const thick = d < 5 ? 0.35 - 0.05 * d : d < 14 ? 0.3 + (d - 5) * 0.06 : 0.85 + (d - 14) * 0.012;
      endo.scale.set(0.8 + 0.2 * thick, 0.85 + 0.15 * thick, Math.max(0.3, thick * 3.2)); endoMat.emissiveIntensity = d < 5 ? 0.9 : 0.4;
      const fg = d < 14 ? 0.3 + (d / 14) * 1.2 : 0.0; foll.scale.setScalar(Math.max(0.001, fg)); foll.visible = d < 14.2; smallF.forEach((m) => { m.visible = d < 10; m.scale.setScalar(0.6 + 0.04 * d); });   // доминантный к овуляции ~0.045
      const lut = d > 14.5 ? gau(d, 21, 4) : 0; cl.spr.material.opacity = lut; cl.core.visible = lut > 0.05; cl.core.scale.setScalar(0.5 + lut);
      egg.visible = d > 14 && d < 18; if (egg.visible) egg.position.copy(TUBE[0].getPointAt(1 - Math.min(1, (d - 14) / 4)));
      if (d < 5 && rnd() < 0.6) fx.spawn(CERV.getPointAt(rnd()), V3(0, -0.15, 0), C_B, 0.6, 0, 1.2);
      if (d > 13.6 && d < 14.2) for (let j = 0; j < 4; j++) fx.spawn(OVP[0].clone().add(V3(0, 0.02, 0.04)), randUnit().multiplyScalar(0.15), new THREE.Color(0xffe0f0), 0.6, 1, 1);
      const hm = HORM(d); st.trace.push([d, hm.fsh, hm.lh, hm.est, hm.prog]); st.trace = st.trace.filter((r) => r[0] <= d + 0.01 && r[0] > d - 28.5 && r[0] <= d);
      if (Math.floor(d) !== st.lastDay) { st.lastDay = Math.floor(d); refs.setInfo(); }
    } else { endo.scale.set(1, 1, 1); smallF.forEach((m) => { m.visible = false; }); foll.visible = st.mode === 'female'; foll.scale.setScalar(1); cl.spr.material.opacity = 0; cl.core.visible = false; egg.visible = false; }
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
    const cols = ['#9FD0FF', '#C77DFF', '#FF8AB0', '#F2C14E'], names = ['FSH', 'LH', 'estrogen', 'progest.'];
    ctx.fillStyle = 'rgba(255,80,90,.12)'; ctx.fillRect(x(1), 14, x(5) - x(1), hgt - 24);
    cols.forEach((c, k) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); for (let d = 1; d <= 28; d += 0.25) { const hm = HORM(d), v = [hm.fsh, hm.lh, hm.est, hm.prog][k]; d === 1 ? ctx.moveTo(x(d), Y(v)) : ctx.lineTo(x(d), Y(v)); } ctx.globalAlpha = 0.85; ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = c; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(names[k], 10 + k * Math.min(62, (w - 62) / 3), 11); });
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x(st.day), 14); ctx.lineTo(x(st.day), hgt - 8); ctx.stroke();
  }
  const DEV = [
    '<b>Day 0: fertilization.</b> Of ~200 million sperm, a few hundred reach the egg in the uterine tube, and only one gets inside. The nuclei fuse, producing a <b>zygote</b> with a full set of 46 chromosomes: half from the mother, half from the father.',
    '<b>Days 1–4: cleavage.</b> The zygote divides into 2, 4, 8, 16 cells without growing in size and slowly moves along the tube toward the uterus. By day 4 it is a <b>morula</b> — a “mulberry” of 16–32 cells.',
    '<b>Days 5–6: blastocyst.</b> A cavity appears inside. The outer layer of cells (the trophoblast) will become the placenta, and the small inner cell mass will become the embryo itself.',
    '<b>Days 6–10: implantation.</b> The blastocyst burrows into the thickened endometrium. The trophoblast begins to secrete hCG, the hormone that maintains the corpus luteum (so menstruation does not occur) and that pregnancy tests detect. Next comes the development of the neural tube and brain (see the “Brain development” tab) — ~38 weeks in all.',
  ];
  const TXT = {
    female: '<b>The female reproductive system</b> is a realistic 3D model of the pelvic organs: the uterus and vagina, the uterine tubes, the ovaries, the ligaments that hold them in place, and next to them the bladder, the rectum and the pelvic bones. Rotate the model and click the organs.',
    male: '<b>The male reproductive system</b> (diagram): the testes with the epididymides, the vasa deferentia, the seminal vesicles, the prostate gland and the urethra. Click an organ.',
    cycle: '',
    dev: '',
  };
  const cycText = () => { const d = Math.floor(st.day); const ph = d <= 5 ? '<b>Menstruation (days 1–5).</b> Estrogen and progesterone levels are low, and the functional layer of the endometrium is shed. The pituitary begins to secrete FSH — follicles grow in the ovary.' : d < 13 ? '<b>Follicular phase.</b> Under the influence of FSH the dominant follicle matures and secretes more and more estrogen — the endometrium thickens.' : d <= 15 ? '<b>Ovulation (~day 14).</b> The estrogen peak triggers a sharp surge of LH from the pituitary — the follicle ruptures and the egg is released into the tube. It remains viable for about a day.' : '<b>Luteal phase.</b> In place of the follicle the <b>corpus luteum</b> forms and secretes progesterone — the endometrium becomes soft and rich in blood vessels. If there is no fertilization, after ~12 days the corpus luteum regresses, hormone levels fall and a new cycle begins.'; return `Day ${d} of 28. ` + ph; };
  const labels = [
    { text: 'ovary', pos: V3(0.42, 0.17, 0.05), color: '#F2B0C8', show: () => st.labels && schem() },
    { text: 'uterine tube', pos: V3(0.38, 0.36, 0.05), color: '#F2C88A', show: () => st.labels && schem() },
    { text: 'uterus', pos: matchMedia('(max-width:700px)').matches ? V3(-0.05, 0.25, 0.12) : V3(0.0, 0.36, 0.1), color: '#E88A9A', show: () => st.labels && schem() },
    { text: 'endometrium', pos: matchMedia('(max-width:700px)').matches ? V3(-0.06, 0.12, 0.12) : V3(-0.06, 0.25, 0.12), color: '#ff7a8a', show: () => st.labels && st.mode === 'cycle' },
    { text: 'cervix and vagina', pos: V3(0.08, -0.3, -0.02), color: '#D8A0B0', left: true, show: () => st.labels && schem() },
    { text: 'urinary bladder', pos: V3(0.1, -0.02, 0.36), color: '#F2D860', show: () => st.labels && ((st.mode === 'female' && schem()) || st.mode === 'male') },
    { text: 'testis', pos: V3(0.16, -0.6, 0.36), color: '#C8D8F0', show: () => st.labels && st.mode === 'male' },
    { text: 'vas deferens', pos: V3(0.24, 0.25, 0.18), color: '#9FD0FF', show: () => st.labels && st.mode === 'male' },
    { text: 'seminal vesicle', pos: V3(-0.2, 0.05, 0.05), color: '#F2D88A', show: () => st.labels && st.mode === 'male' },
    { text: 'prostate', pos: V3(0.08, -0.16, 0.2), color: '#F2D88A', show: () => st.labels && st.mode === 'male' },
    { text: 'embryo', pos: V3(0, 0, 0), color: '#ffe8f0', show: () => st.labels && st.mode === 'dev', dyn: true },
  ];
  RP_R.forEach((p) => { const l = { text: p.name.toLowerCase(), pos: V3(0, -9, 0), color: p.color, left: p.id === 'r_int', show: () => st.labels && st.mode === 'female' && st.realLoad === 2 && (!st.sel || st.sel === p.id) && (!matchMedia('(max-width:700px)').matches || st.sel || ['r_ut', 'r_ov', 'r_tube', 'r_bone'].includes(p.id)) }; PART[p.id].lab = l; labels.unshift(l); });
  const embLabel = labels[labels.length - 1];
  const refs = {};
  loadReal();
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => { const stat = st.mode === 'female' && st.realErr ? 'Could not load the 3D model: ' + st.realErr : st.mode === 'female' && st.realLoad === 1 ? 'Loading realistic 3D model…' : ''; ib.info.innerHTML = st.msg || ((st.mode === 'cycle' ? cycText() : (st.mode === 'female' || st.mode === 'male') && st.sel ? PART[st.sel].text : TXT[st.mode]) + (stat ? '<br><span style="opacity:.6">' + stat + '</span>' : '')); };
    refs.modeSeg = seg([{ id: 'female', label: 'Female system' }, { id: 'male', label: 'Male system' }, { id: 'cycle', label: 'Cycle' }, { id: 'dev', label: 'First week' }], () => st.mode, (v) => setMode(v));
    const segBox = h('div', { class: 'gctl' });
    refs.rebuild = () => { segBox.innerHTML = ''; const list = parts(); refs.seg = seg([{ id: 'all', label: 'All' }, ...list.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'cycle' || st.mode === 'dev') setMode('female'); select(v); }); segBox.append(refs.seg); };
    refs.rebuild();
    st.speed = 1.5; const sp = range('rpspeed', 0.5, 4, 0.1, () => st.speed, (v) => { st.speed = v; }, (v) => v.toFixed(1) + ' d/s');
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(initMode === 'cycle' ? '' : group('Mode', '1–4', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 440px' }, h('div', { class: 'glabel' }, 'Organs', h('kbd', {}, 'click')), segBox), refs.phG = group('Cycle phases', initMode === 'cycle' ? '1–4' : '', ...(refs.phB = [['Menstruation', 1.5], ['Follicular', 8], ['Ovulation', 13.7], ['Luteal', 21]].map(([n, d], i) => button(n, () => { if (st.mode !== 'cycle') setMode('cycle'); st.day = d; st.msg = null; refs.setInfo(); }, false))), toggle('Pause', () => st.pause, (v) => { st.pause = v; })), refs.spG = group('Cycle speed', '', sp), group('View', 'R · N', refs.rot, lab), ib.el);
    // фазы и скорость цикла нужны только в режиме «Цикл»: в остальных режимах пульт ниже — сцене больше места
    refs.cycUI = () => { const on = st.mode === 'cycle'; refs.phG.style.display = refs.spG.style.display = on ? '' : 'none'; }; refs.cycUI();
    refs.setInfo();
  }
  const _upd = update; function update2(dt) { _upd(dt); if (st.mode === 'dev') embLabel.pos.copy(embryo.position).add(V3(0.04, 0.03, 0.03)); }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { if (initMode === 'cycle') refs.phB[n - 1].click(); else setMode(['female', 'male', 'cycle', 'dev'][n - 1]); return true; }   /* menses: режим один, клавиши — фазы */
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'cycle' ? [['Cycle day', Math.floor(st.day), 'of 28']] : st.mode === 'dev' ? [['Day', Math.max(0, Math.floor(st.devDay || 0)), ''], ['Cells', (st.devDay || 0) < 1 ? 1 : (st.devDay || 0) < 4.5 ? Math.min(32, 2 ** Math.floor(1 + (st.devDay - 1) * 1.3)) : '≈100', '']] : [['Chromosomes per cell', 46, ''], ['In a germ cell', 23, '']]; }
  const self = {
    labelBg: true, mobZoom: initMode === 'cycle' ? 0.72 : 0.58, scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2B0C8',
    kicker: 'Body · reproduction', title: 'Reproduction and development',
    lede: 'How the reproductive systems are built, how pituitary and ovarian hormones set the 28-day cycle, and what happens to a new life in its first week.',
    notes: `
      <div><h2>Germ cells</h2><p>The egg (~0.1 mm) is the largest cell in the body; the sperm (~0.05 mm including the tail) is one of the smallest. Both are formed by meiosis and carry 23 chromosomes each. The sex of the child is determined by the sperm: one with an X chromosome gives a girl (XX), one with a Y gives a boy (XY).</p>
        <h3>Hormonal regulation</h3><p>Hypothalamus (GnRH) → pituitary (FSH and LH) → ovaries or testes (estrogens, progesterone, testosterone), which act back on the hypothalamus and pituitary through feedback.</p>
        <h3>Phases of the cycle</h3><p><b>Menstrual</b> phase (days 1–5): progesterone has fallen, and the functional layer of the endometrium is shed. <b>Follicular</b> phase (until about day 14): under FSH the follicles grow, the dominant one secretes more and more estradiol, and the endometrium thickens again. When estradiol stays high for about two days, the feedback switches to <b>positive</b>: the pituitary releases an <b>LH surge</b>, and about 36 hours later <b>ovulation</b> occurs. The <b>luteal</b> phase is nearly constant (~14 days): the corpus luteum secretes progesterone and estradiol, and the endometrium prepares for implantation; without pregnancy the corpus luteum regresses, hormone levels fall, and a new menstruation begins. That is why cycle length (21–35 days) varies mainly through the follicular phase.</p></div>
      <div><h2>Simplifications</h2><ul><li>The male system, the cycle and the first week are shown schematically, like a textbook drawing.</li><li>The cycle is an average 28-day one; in real life it lasts 21–35 days.</li><li>The embryo is enlarged and time is compressed.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> mode</li><li>click: organ</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  if (initMode === 'cycle') { self.notes = self.notes.replace(/(<code>4<\/code> )[^<]+/, '$1' + 'cycle phase').replace(/<li>[^<]*(\u0441\u0445\u0435\u043c\u0430\u0442\u0438\u0447\u043d\u043e|schematically)[^<]*<\/li>/, '<li>' + 'The organs and the cycle are shown schematically, like a textbook drawing.' + '</li>'); self.kicker = 'Body · women’s health'; self.title = 'Menstrual cycle'; self.lede = 'The roughly 28 days during which the pituitary and ovaries prepare an egg and the uterine lining for a possible pregnancy — day by day, with hormones, the follicle and the endometrium.'; }
  return self;
}
function makeMenses() { return makeRepro('cycle'); }
export { makeMenses, makeRepro };
