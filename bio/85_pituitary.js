// @scene pituitary makePituitary | Гипоталамус и гипофиз | Гормоны
/* =========================================================
   БИОХИМИЯ · ГИПОТАЛАМУС И ГИПОФИЗ: либерины и статины, портальная система, гормоны передней доли
   (СТГ, пролактин, АКТГ/ПОМК, ТТГ, ЛГ/ФСГ), задняя доля (вазопрессин, окситоцин);
   вазопрессин и вода (рецептор V2, аквапорин-2, несахарный диабет, СНСАДГ); гормон роста и рост тела
   ========================================================= */
function makePituitary() {
  rnd = mulberry(8501);
  const scene = bioStage({ rim: 0x9f7bff });
  const VIEW = { map: [V3(-0.3, -0.7, 0), V3(0.2, 0.3, 17)], water: [V3(39.4, -0.9, 0), V3(39.9, -0.1, 21)], growth: [V3(79.0, 0.4, 0), V3(79.6, 1.6, 27)] };
  const VIEWM = { map: [V3(0.7, -0.4, 0), V3(1.1, 0.4, 17)], water: [V3(40, -0.5, 0), V3(40.4, 0.3, 25)], growth: [V3(80, 0.4, 0), V3(80.6, 1.6, 27)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.map[1]);
  const controls = makeControls(camera, VIEW.map[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ball = (r, col, parent) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true })); s.visible = false; parent.add(s); return s; };

  /* ---------- 1. гипоталамус и гипофиз (сагиттальный вид; вперёд — вправо) ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const hyp = new THREE.Mesh(blobGeo(1.75, 0.85, 1.05, 4, 0.06), glassMat('#C8B8FF', { rim: 0.75, base: 0.04, keep: true })); hyp.position.set(0, 2.35, 0); G1.add(hyp);
  const SON = V3(0.95, 1.8, 0.35), PVN = V3(-0.25, 2.7, 0.35), ARC = V3(0.25, 1.72, 0.45), ME = V3(0.2, 1.25, 0.05);
  const sonG = glowNucleus(G1, SON, '#7FD6FF', 0.07, 8), pvnG = glowNucleus(G1, PVN, '#7FE0A0', 0.07, 8), arcG = glowNucleus(G1, ARC, '#F2C14E', 0.07, 8);
  const translucent = (col, op) => organMat(col, 0.55, { transparent: true, opacity: op, depthWrite: false, emissiveIntensity: 0.06 });
  const stalkC = new THREE.CatmullRomCurve3([V3(0.18, 1.45, 0), V3(0.12, 0.65, 0), V3(0.0, -0.1, 0)]);
  G1.add(new THREE.Mesh(taperTube(stalkC, (u) => 0.24 - 0.08 * u, 30, 14), translucent('#E8C0D0', 0.28)));
  const P_ANT = V3(0.8, -0.82, 0), P_POST = V3(-0.58, -0.88, 0);
  const ant = new THREE.Mesh(blobGeo(0.98, 0.7, 0.72, 7, 0.07), translucent('#E890A0', 0.32)); ant.position.copy(P_ANT); G1.add(ant);
  const post = new THREE.Mesh(blobGeo(0.6, 0.55, 0.55, 9, 0.07), translucent('#D8C8F0', 0.4)); post.position.copy(P_POST); G1.add(post);
  // турецкое седло — задняя нижняя четверть «чаши»
  const sella = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, Math.PI, Math.PI, Math.PI / 2, Math.PI / 2), organMat('#E8DCC0', 0.45, { side: THREE.DoubleSide, emissiveIntensity: 0.03 }));
  sella.scale.set(1.95, 1.15, 1.25); sella.position.set(0.1, -0.55, 0); G1.add(sella);
  // перекрёст зрительных нервов
  const nerveM = organMat('#E8E0C8', 0.6, { emissiveIntensity: 0.05 });
  [0.55, -0.55].forEach((a) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.7, 12), nerveM); c.rotation.set(Math.PI / 2, 0, a); c.position.set(1.15, 1.32, 0); G1.add(c); });
  // сосуды: первичная сеть в срединном возвышении → портальные вены → вторичная сеть в передней доле → в кровь
  const artM = organMat('#D84A50', 0.6, { emissiveIntensity: 0.1 }), veinM = organMat('#6A70D8', 0.6, { emissiveIntensity: 0.1 });
  for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const pts = []; for (let j = 0; j <= 12; j++) { const u = j / 12 * Math.PI * 2; pts.push(ME.clone().add(V3(Math.cos(a) * 0.18 + Math.cos(u) * 0.1, Math.sin(u) * 0.12, Math.sin(a) * 0.18 + Math.sin(u) * 0.06))); } G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 30, 0.018, 6, true), artM)); }
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(1.6, 1.0, -0.3), V3(0.9, 1.15, -0.1), ME.clone()]), 30, 0.03, 8), artM));
  const PORT = [[0.15, 0.18], [-0.12, 0.05]].map(([dz, dx]) => new THREE.CatmullRomCurve3([ME.clone().add(V3(dx, -0.05, dz)), V3(0.42 + dx, 0.3, dz), V3(0.62 + dx, -0.3, dz * 0.8), V3(0.8 + dx, -0.7, dz * 0.5)]));
  PORT.forEach((c) => G1.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.03, 8), artM)));
  for (let k = 0; k < 4; k++) { const pts = []; for (let j = 0; j <= 10; j++) pts.push(P_ANT.clone().add(V3(-0.55 + j * 0.11, -0.3 + 0.2 * Math.sin(j * 1.3 + k * 2) + k * 0.15, 0.25 * Math.cos(j + k)))); G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.016, 6), artM)); }
  const pAntOut = new THREE.CatmullRomCurve3([P_ANT.clone().add(V3(0.1, -0.1, 0.12)), V3(1.05, -1.45, 0.05), V3(1.7, -2.15, 0), V3(2.45, -2.6, 0)]);
  const pPostOut = new THREE.CatmullRomCurve3([P_POST.clone().add(V3(-0.05, -0.15, 0.08)), V3(-0.75, -1.45, 0.02), V3(-1.35, -2.15, 0), V3(-2.1, -2.6, 0)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(pAntOut, 40, 0.045, 8), veinM), new THREE.Mesh(new THREE.TubeGeometry(pPostOut, 40, 0.045, 8), veinM));
  // аксоны крупноклеточных нейронов (SON, PVN) → задняя доля; мелкоклеточных (ARC) → срединное возвышение
  const axSON = new THREE.CatmullRomCurve3([SON.clone(), V3(0.55, 1.45, 0.2), V3(0.2, 0.9, 0.08), V3(0.06, 0.2, 0.05), V3(-0.3, -0.55, 0.08), P_POST.clone().add(V3(0.05, -0.05, 0.12))]);
  const axPVN = new THREE.CatmullRomCurve3([PVN.clone(), V3(-0.05, 2.1, 0.25), V3(0.15, 1.35, 0.0), V3(0.08, 0.5, -0.05), V3(-0.2, -0.3, -0.05), P_POST.clone().add(V3(-0.1, 0.05, -0.08))]);
  const axARC = new THREE.CatmullRomCurve3([ARC.clone(), V3(0.24, 1.48, 0.25), ME.clone().add(V3(0.02, 0.06, 0.1))]);
  const axMat = (col) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(0.4), emissive: col, emissiveIntensity: 0.25, roughness: 0.4 });
  const axM = [[axSON, '#7FD6FF'], [axPVN, '#7FE0A0'], [axARC, '#F2C14E']].map(([c, col]) => { const m = new THREE.Mesh(new THREE.TubeGeometry(c, 60, 0.022, 6), axMat(col)); G1.add(m); return m; });
  // клетки передней доли: пять типов
  const TYPES = [
    { id: 'gh', col: '#7FE0A0', n: 34 }, { id: 'prl', col: '#FF8AB0', n: 11 }, { id: 'acth', col: '#F2C14E', n: 11 }, { id: 'tsh', col: '#7FD6FF', n: 5 }, { id: 'gn', col: '#C77DFF', n: 8 },
  ];
  const dmy = new THREE.Object3D();
  TYPES.forEach((T) => {
    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(T.col).multiplyScalar(0.45), emissive: T.col, emissiveIntensity: 0.1, roughness: 0.45 });
    const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 1), mat, T.n); T.mat = mat; T.pos = [];
    for (let i = 0; i < T.n; i++) { let p; do { p = V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)); } while (p.length() > 1); p.multiply(V3(0.82, 0.55, 0.58)).add(P_ANT); T.pos.push(p); dmy.position.copy(p); dmy.scale.setScalar(rand(0.8, 1.2)); dmy.updateMatrix(); im.setMatrixAt(i, dmy.matrix); }
    G1.add(im);
  });
  // окончания аксонов в задней доле (тельца Херринга)
  const herr = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x506080, emissive: 0x9fb4ff, emissiveIntensity: 0.2, roughness: 0.4 }), 18);
  for (let i = 0; i < 18; i++) { const p = V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(rand(0.1, 0.42)).add(P_POST); dmy.position.copy(p); dmy.scale.setScalar(1); dmy.updateMatrix(); herr.setMatrixAt(i, dmy.matrix); }
  G1.add(herr);
  // ПОМК → фрагменты
  const pomc = new THREE.Group(); pomc.position.set(2.35, -0.25, 0.2); G1.add(pomc);
  const POMC = [['γ-МСГ', '#9FB4FF', 0.38], ['АКТГ', '#F2C14E', 0.52], ['γ-ЛПГ', '#FF9A5C', 0.32], ['β-эндорфин', '#FF6FA8', 0.4]];
  let px = 0; const pomcSeg = POMC.map(([, col, w]) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, w - 0.15, 4, 10), protMat(col, 0.55, { emissiveIntensity: 0.15 })); m.rotation.z = Math.PI / 2; m.userData.x0 = px + w / 2; px += w; pomc.add(m); return m; });
  pomcSeg.forEach((m) => { m.userData.x0 -= px / 2; m.position.x = m.userData.x0; });
  // молекулы-регуляторы справа
  const MOLS = { tsh: fit('trh', 0.65), prl: fit('dopamine', 0.6), adh: fit('vasopressin', 0.9), oxt: fit('oxytocin', 0.9) };
  Object.values(MOLS).forEach((m) => { m.position.set(2.75, 0.75, 0.2); m.visible = false; G1.add(m); });
  // частицы
  const P1 = Array.from({ length: 70 }, () => ({ s: ball(0.042, '#ffffff', G1), on: false, t: 0, path: null, next: null, col: '#fff', sp: 0.3 }));
  const launch1 = (path, col, sp, next) => { const p = P1.find((x) => !x.on); if (!p) return; Object.assign(p, { on: true, t: 0, path, col, sp, next }); p.s.material.color.set(col); p.s.visible = true; };
  const HORM = {
    gh: { rel: '#7FE0A0', out: '#7FE0A0', nuc: 'arc' }, prl: { rel: '#FF5A5A', out: '#FF8AB0', nuc: 'arc' }, acth: { rel: '#F2C14E', out: '#F2C14E', nuc: 'pvnp' },
    tsh: { rel: '#7FD6FF', out: '#7FD6FF', nuc: 'pvnp' }, gn: { rel: '#C77DFF', out: '#C77DFF', nuc: 'arc' }, adh: { out: '#5B8CFF', nuc: 'son' }, oxt: { out: '#FF9AE0', nuc: 'pvn' },
  };
  const axPVNp = new THREE.CatmullRomCurve3([PVN.clone(), V3(0.0, 1.9, 0.3), ME.clone().add(V3(-0.02, 0.06, 0.1))]);
  const axPm = new THREE.Mesh(new THREE.TubeGeometry(axPVNp, 40, 0.016, 6), axMat('#7FE0A0')); G1.add(axPm);
  const relPath = PORT.map((pc) => new THREE.CatmullRomCurve3([...axARC.getPoints(6), ...pc.getPoints(8).slice(1)]));
  const relPathP = PORT.map((pc) => new THREE.CatmullRomCurve3([...axPVNp.getPoints(6), ...pc.getPoints(8).slice(1)]));

  /* ---------- 2. вазопрессин и вода: клетка собирательной трубки ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const AY = 1.25, BY = -1.25;   // апикальная (к моче) и базолатеральная (к крови) мембраны
  const memA = schemBilayer({ w: 7.2, d: 2.4, thick: 0.34, step: 0.16, head: '#E8C07A', tail: '#B8A27A', seed: 21 }); memA.position.y = AY; G2.add(memA);
  const memB = schemBilayer({ w: 7.2, d: 2.4, thick: 0.34, step: 0.16, head: '#E8C07A', tail: '#B8A27A', seed: 22 }); memB.position.y = BY; G2.add(memB);
  rnd = mulberry(8502);
  const cyto = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.2, 0.02), new THREE.MeshBasicMaterial({ color: 0x3a2018, transparent: true, opacity: 0.35, depthWrite: false })); cyto.position.z = -1.2; G2.add(cyto);
  const lumen = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.3, 2.4), new THREE.MeshPhysicalMaterial({ color: 0x5a4a10, emissive: 0xf2d27a, emissiveIntensity: 0.05, transparent: true, opacity: 0.1, depthWrite: false, roughness: 0.2 })); lumen.position.y = AY + 0.85; G2.add(lumen);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 7.2, 24, 1, true), organMat('#D84A50', 0.5, { transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false })); cap.rotation.z = Math.PI / 2; cap.position.set(0, BY - 1.05, -0.2); G2.add(cap);
  const nuc2 = new THREE.Mesh(new THREE.SphereGeometry(0.62, 30, 20), glassMat('#9F7BFF', { rim: 0.8, base: 0.05, keep: true })); nuc2.position.set(2.6, -0.15, -0.6); nuc2.scale.setScalar(0.8); G2.add(nuc2);
  // рецептор V2 (структура GPCR + Gs; на примере β2-адренорецептора, PDB 3SN6) в базолатеральной мембране
  const gs = 0.022, GP = new THREE.Group(); G2.add(GP);
  const recM = proteinMesh('gpcr', { scale: gs, chains: ['R'], colorBy: () => '#FF8A5C' }), gaM = proteinMesh('gpcr', { scale: gs, chains: ['A', 'B', 'G'], colorBy: () => '#8FB8A8' });
  GP.add(recM, gaM); recM.children.forEach((m) => { if (m.material) m.material.emissive = new THREE.Color('#FF8A5C'); });
  { const cen = (ch) => { const pts = caPoints('gpcr', gs, ch); return pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length); };
    const rc = cen(['R']), gc = cen(['A', 'B', 'G']); GP.quaternion.setFromUnitVectors(rc.clone().sub(gc).normalize(), V3(0, -1, 0));
    const r2 = rc.clone().applyQuaternion(GP.quaternion); GP.position.set(-2.4 - r2.x, BY - r2.y - 0.05, 0.2 - r2.z); }
  const avp = fit('vasopressin', 0.42); G2.add(avp);
  const pka2 = new THREE.Mesh(blobGeo(0.32, 0.26, 0.26, 23, 0.12, 3), protMat('#C77DFF', 0.45)); pka2.position.set(-0.9, -0.05, 0.3); G2.add(pka2);
  // аквапорины: AQP2 (в пузырьках / в апикальной мембране), AQP3/4 — всегда в базолатеральной
  const aqMat = protMat('#7FD6FF', 0.55, { emissiveIntensity: 0.15 }), aq34Mat = protMat('#7FE0A0', 0.5, { emissiveIntensity: 0.1 });
  const aqGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.42, 12);
  const NAQ = 10, AQ = Array.from({ length: NAQ }, (_, i) => {
    const m = new THREE.Mesh(aqGeo, aqMat); const home = V3(-1.7 + (i % 5) * 0.62 + rand(-0.1, 0.1), -0.45 + Math.floor(i / 5) * 0.45 + rand(-0.08, 0.08), rand(-0.6, 0.7));
    const ves = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0x705a40, emissive: 0xffd0a0, emissiveIntensity: 0.06, transparent: true, opacity: 0.35, depthWrite: false })); ves.position.copy(home);
    const slot = V3(-2.2 + i * 0.5, AY, rand(-0.7, 0.7)); m.position.copy(home); G2.add(m, ves); return { m, ves, home, slot, k: 0 };
  });
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(aqGeo, aq34Mat); m.position.set(-1.5 + i * 0.75, BY, rand(-0.7, 0.7)); G2.add(m); }
  const camp2 = Array.from({ length: 14 }, () => ({ s: ball(0.05, '#F2C14E', G2), on: false, t: 0, a: V3(0, 0, 0) }));
  const W = Array.from({ length: 60 }, () => ({ s: ball(0.045, '#5BA8FF', G2), on: false, t: 0, path: null, sp: 0.4 }));
  const U = Array.from({ length: 30 }, () => ({ s: ball(0.04, '#F2D27A', G2), on: false, t: 0, z: 0, y: 0 }));

  /* ---------- 3. гормон роста и рост тела ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const FOOT = -2.4, BODYH = 7.05;   // высота силуэта (≈ 178 см)
  const BG = new THREE.Group(); BG.position.y = FOOT; G3.add(BG);
  const IN = new THREE.Group(); IN.position.y = -FOOT; BG.add(IN);
  bodyShell(IN, { rim: 0.16, keep: true });
  const PIT3 = V3(0, 4.12, 0.12), LIV3 = V3(-0.35, 1.5, 0.18);
  const pitG3 = glowNucleus(IN, PIT3, '#9F7BFF', 0.05, 9);
  const liv3 = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV3), organMat('#9A4A3A', 0.5)); IN.add(liv3);
  const PLATES = [V3(0.48, -1.2, 0.03), V3(-0.48, -1.2, 0.03), V3(1.4, 1.35, 0.0), V3(-1.4, 1.35, 0.0)];
  const plateM = PLATES.map((p) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.035, 20), new THREE.MeshBasicMaterial({ color: '#7FE0A0', transparent: true, opacity: 0.8 })); m.position.copy(p); IN.add(m); return m; });
  const HANDS = [V3(1.47, 0.92, 0.05), V3(-1.47, 0.92, 0.05)].map((p) => { const m = new THREE.Mesh(blobGeo(0.12, 0.19, 0.07, 31, 0.1, 3), organMat('#E2B0A0', 0.5, { emissiveIntensity: 0.06 })); m.position.copy(p); IN.add(m); return m; });
  const jaw = new THREE.Mesh(blobGeo(0.2, 0.09, 0.14, 33, 0.08, 3), organMat('#E2B0A0', 0.5, { emissiveIntensity: 0.06 })); jaw.position.set(0, 3.82, 0.16); IN.add(jaw);
  const A3 = {
    gh: flowArrow(IN, PIT3.clone().add(V3(-0.04, -0.06, 0.05)), LIV3.clone().add(V3(0.08, 0.2, 0.15)), '#9F7BFF', { bend: 0.25, r: 0.022 }),
    k1: flowArrow(IN, LIV3.clone().add(V3(0.1, -0.15, 0.15)), PLATES[0].clone().add(V3(0, 0.1, 0.1)), '#7FE0A0', { bend: -0.15, r: 0.02 }),
    k2: flowArrow(IN, LIV3.clone().add(V3(-0.05, -0.15, 0.15)), PLATES[1].clone().add(V3(0, 0.1, 0.1)), '#7FE0A0', { bend: 0.15, r: 0.02 }),
    h1: flowArrow(IN, LIV3.clone().add(V3(0.2, 0.05, 0.15)), PLATES[2].clone().add(V3(-0.05, 0.05, 0.05)), '#7FE0A0', { bend: 0.15, r: 0.02 }),
    h2: flowArrow(IN, LIV3.clone().add(V3(-0.3, 0.05, 0.15)), PLATES[3].clone().add(V3(0.05, 0.05, 0.05)), '#7FE0A0', { bend: -0.15, r: 0.02 }),
  };
  const tumor = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: '#FF5A5A', transparent: true, opacity: 0.85 })); tumor.position.copy(PIT3).add(V3(0.04, -0.02, 0.06)); IN.add(tumor);
  // линейка
  const CM = BODYH / 178;
  const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.03, 225 * CM, 0.03), new THREE.MeshBasicMaterial({ color: '#8A90A8' })); ruler.position.set(-2.3, FOOT + 112.5 * CM, 0); G3.add(ruler);
  [50, 100, 150, 200].forEach((v) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.03), new THREE.MeshBasicMaterial({ color: '#C8CCE0' })); t.position.set(-2.3, FOOT + v * CM, 0); G3.add(t); });
  const floor = new THREE.Mesh(new THREE.RingGeometry(0.2, 2.2, 48), new THREE.MeshBasicMaterial({ color: '#3A3F58', transparent: true, opacity: 0.35, side: THREE.DoubleSide })); floor.rotation.x = -Math.PI / 2; floor.position.y = FOOT; G3.add(floor);
  // рост по возрасту: медиана (мужчины, см)
  const MED = [[0, 50], [1, 76], [2, 88], [4, 103], [6, 116], [8, 128], [10, 138], [12, 149], [14, 164], [16, 174], [18, 177], [20, 178], [25, 178]];
  const med = (a) => { for (let i = 1; i < MED.length; i++) if (a <= MED[i][0]) { const [a0, h0] = MED[i - 1], [a1, h1] = MED[i]; return h0 + (h1 - h0) * (a - a0) / (a1 - a0); } return 178; };
  const AMAX = 25;

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'map', labels: true, rot: false, fly: null, msg: null, sel: 'all', relT: 0,
    dis: 'norm', treat: false, tbw: 42, adh: 1, posm: 287, urine: 1.4, uosm: 500, intake: 1.5, day: 0, hist: [],
    gdis: 'norm', gtreat: false, age: 0, hold: 0, curve: [], igf: 100, hgt: 50, acro: 1 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['map', 'water', 'growth'][k] === m; }); st.fly = flyTarget(VV(m)[0], VV(m)[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  function mapUpdate(dt, t) {
    const sel = st.sel, all = sel === 'all';
    const on = (k) => all || sel === k;
    TYPES.forEach((T) => { const o = on(T.id); T.mat.emissiveIntensity = o ? 0.25 + 0.2 * Math.sin(t * 4 + T.n) : 0.0; T.mat.color.set(T.col).multiplyScalar(o ? 0.45 : 0.07); });
    axM[0].material.emissiveIntensity = on('adh') || (sel === 'oxt') ? 0.4 : 0.06; axM[1].material.emissiveIntensity = on('oxt') || sel === 'adh' ? 0.4 : 0.06;
    axM[2].material.emissiveIntensity = all || ['gh', 'prl', 'gn'].includes(sel) ? 0.4 : 0.06; axPm.material.emissiveIntensity = all || ['tsh', 'acth'].includes(sel) ? 0.4 : 0.06;
    sonG.spr.material.opacity = on('adh') || sel === 'oxt' ? 0.7 : 0.15; pvnG.spr.material.opacity = on('oxt') || ['adh', 'tsh', 'acth'].includes(sel) ? 0.7 : 0.15; arcG.spr.material.opacity = axM[2].material.emissiveIntensity > 0.1 ? 0.7 : 0.15;
    // выпуск частиц
    const keys = all ? Object.keys(HORM) : [sel];
    keys.forEach((k) => {
      const H = HORM[k], rate = (all ? 0.9 : 2.6) * (k === 'gn' ? (Math.sin(t * 1.4) > 0.6 ? 3 : 0.1) : 1);   // ГнРГ — импульсами
      if (rnd() > dt * rate) return;
      if (H.nuc === 'arc') launch1(relPath[(rnd() * 2) | 0], H.rel, 0.33, k);
      else if (H.nuc === 'pvnp') launch1(relPathP[(rnd() * 2) | 0], H.rel, 0.33, k);
      else { const ax = k === 'adh' ? (rnd() < 0.75 ? axSON : axPVN) : (rnd() < 0.75 ? axPVN : axSON); launch1(ax, H.out, 0.22, 'post'); }
    });
    P1.forEach((p) => {
      if (!p.on) return; p.t += dt * p.sp;
      if (p.t >= 1) {
        p.on = false; p.s.visible = false;
        if (p.next === 'post') launch1(pPostOut, p.col, 0.3, null);
        else if (p.next && HORM[p.next]) { const T = TYPES.find((x) => x.id === p.next); const c = T.pos[(rnd() * T.pos.length) | 0]; fx.spawn(c.clone(), V3(0, 0.2, 0), C.set(T.col), 0.6, 0.5, 1.3); if (p.next !== 'prl' || rnd() < 0.35) launch1(pAntOut, HORM[p.next].out, 0.3, null); }
        return;
      }
      p.s.position.copy(p.path.getPoint(p.t)); p.s.scale.setScalar(p.next === null ? 1.3 : 1);
    });
    pomc.visible = sel === 'acth';
    if (pomc.visible) { const c = (t * 0.35) % 1, gap = smooth(0.3, 0.6, c) * (1 - smooth(0.92, 1, c)); pomcSeg.forEach((m, i) => { m.position.x = m.userData.x0 + (i - 1.5) * gap * 0.22; m.position.y = (i === 1 ? 0.06 : 0) * gap; }); }
    Object.entries(MOLS).forEach(([k, m]) => { m.visible = sel === k; m.rotation.y += dt * 0.4; });
  }

  // модель воды: 1 с = 4 ч
  function waterStep(dtd) {
    const D = st.dis, tr = st.treat;
    st.posm = 287 * 42 / st.tbw;
    let adhS = clamp(0.25 * (st.posm - 283), 0, 12);
    if (D === 'dic') adhS = 0; if (D === 'siadh') adhS = Math.max(adhS, 6);
    st.adh += (adhS - st.adh) * Math.min(1, dtd * 30);
    let a = st.adh * (D === 'din' ? 0.04 : 1); if (D === 'dic' && tr) a += 1.1;
    const E = a / (a + 1.5);
    st.uosm = 50 + 1250 * E; if (D === 'din' && tr) st.uosm *= 2; const Uv = 700 / st.uosm;
    st.urine = Uv; st.E = E;
    const drive = Math.max(0, st.posm - 292) * 3;
    const B = clamp(2.2 + 0.3 * (st.posm - 287), 0.6, 2.6);
    st.intake = D === 'thirst' ? (tr ? B + drive : 0) : D === 'siadh' ? (tr ? (st.posm < 285 ? 1.0 : B + drive) : 2.2) : B + drive;
    st.intake = Math.min(st.intake, 22);
    st.tbw = clamp(st.tbw + (st.intake - Uv - 0.8) * dtd, 33, 47);
  }
  function waterUpdate(dt, t) {
    const dtd = dt / 6; for (let i = 0; i < 4; i++) waterStep(dtd / 4);
    st.day += dtd; if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.25) { st.hist.push([st.t, st.posm, st.urine]); if (st.hist.length > 160) st.hist.shift(); }
    const E = st.E || 0;
    // вазопрессин подходит к рецептору
    const sig = st.dis === 'dic' ? (st.treat ? 0.8 : 0) : clamp(st.adh / 4, 0, 1);
    avp.visible = sig > 0.05; const cyc = (t * 0.4) % 1; avp.position.set(-2.4 + 0.6 * Math.cos(t), BY - 1.15 + 0.55 * smooth(0, 0.6, cyc), 0.5); avp.rotation.y += dt;
    const resp = st.dis === 'din' ? 0.05 : sig;
    recM.children.forEach((m) => { if (m.material) m.material.emissiveIntensity = 0.05 + 0.3 * resp * (0.5 + 0.5 * Math.sin(t * 5)); });
    if (rnd() < dt * 5 * resp) { const p = camp2.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.a.set(-2.3 + rand(-0.3, 0.3), BY + 0.5, rand(-0.3, 0.6)); p.s.visible = true; } }
    camp2.forEach((p) => { if (!p.on) return; p.t += dt * 0.7; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.a).lerp(pka2.position, p.t); });
    pka2.material.emissiveIntensity = 0.04 + 0.35 * resp * (0.5 + 0.5 * Math.sin(t * 4));
    // AQP2 к мембране — доля E
    const nOn = Math.round(E * NAQ * 1.1);
    AQ.forEach((q, i) => { const tgt = i < nOn ? 1 : 0; q.k += (tgt - q.k) * Math.min(1, dt * 1.2); q.m.position.copy(q.home).lerp(q.slot, smooth(0, 1, q.k)); q.ves.position.copy(q.m.position); q.ves.material.opacity = 0.35 * (1 - smooth(0.8, 1, q.k)); q.ves.visible = q.k < 0.98; });
    // вода: из просвета через AQP2 → через клетку → AQP3/4 → в кровь
    if (rnd() < dt * 18 * E) { const q = AQ.filter((x) => x.k > 0.95); const p = W.find((x) => !x.on); if (q.length && p) { const s = q[(rnd() * q.length) | 0].slot; p.on = true; p.t = 0; p.s.visible = true; p.path = new THREE.CatmullRomCurve3([s.clone().add(V3(rand(-0.2, 0.2), 0.9, 0)), s.clone(), V3(s.x + rand(-0.4, 0.4), 0, s.z * 0.5), V3(s.x + rand(-0.5, 0.5), BY, rand(-0.6, 0.6)), V3(s.x + rand(-0.6, 0.6), BY - 1.0, -0.2)]); } }
    W.forEach((p) => { if (!p.on) return; p.t += dt * 0.35; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.path.getPoint(p.t)); });
    // поток мочи в просвете: скорость ~ объём
    const flow = clamp(st.urine / 2, 0.15, 6);
    if (rnd() < dt * (3 + flow * 3)) { const p = U.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.y = AY + rand(0.35, 1.3); p.z = rand(-1, 1); p.s.visible = true; } }
    U.forEach((p) => { if (!p.on) return; p.t += dt * 0.12 * flow; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.set(-3.5 + 7 * p.t, p.y, p.z); });
    const uc = C.set('#F2D27A').lerp(new THREE.Color('#FFF6D8'), clamp(1 - (st.uosm - 100) / 900, 0, 1)); U.forEach((p) => p.s.material.color.copy(uc));
    lumen.material.emissive.copy(uc); lumen.material.emissiveIntensity = 0.03 + 0.08 * clamp((st.uosm - 100) / 1000, 0, 1);
  }

  function growthCurve() {
    const D = st.gdis, tr = st.gtreat, out = []; let hgt = 50, acro = 1;
    for (let a = 0; a <= AMAX + 1e-6; a += 0.05) {
      const v = (med(a + 0.05) - med(a)) / 0.05; let f = 1, igf = 100;
      if (D === 'def') { if (a > 1) { f = 0.58; igf = 15; } if (tr && a >= 4) { f = a < 9 ? 1.35 : 1; igf = 100; } }
      if (D === 'giant' && a >= 8) { const on = !(tr && a >= 11); f = on ? 1.5 : 1; igf = on ? 300 : 110; }
      if (D === 'acro' && a >= 20) { const on = !(tr && a >= 22); igf = on ? 350 : 120; }
      let dh = v * f * 0.05; if (D === 'giant' && a >= 18 && a < 22 && !(tr)) dh += 2.5 * 0.05;
      hgt += dh; if (D === 'acro' && a >= 20 && igf > 200) acro = Math.min(1.45, acro + 0.08 * 0.05); if (D === 'acro' && tr && a >= 22) acro -= (acro - 1.08) * 0.4 * 0.05;
      out.push([a, hgt, igf, acro]);
    }
    st.curve = out;
  }
  function growthUpdate(dt, t) {
    if (!st.curve.length) growthCurve();
    if (st.age < AMAX) st.age = Math.min(AMAX, st.age + dt * 1.8); else { st.hold += dt; if (st.hold > 3) { st.age = 0; st.hold = 0; } }
    const r = st.curve[Math.min(st.curve.length - 1, Math.round(st.age / 0.05))]; st.hgt = r[1]; st.igf = r[2]; st.acro = r[3];
    BG.scale.setScalar(st.hgt / 178);
    HANDS.forEach((m) => m.scale.setScalar(st.acro)); jaw.scale.set(st.acro, 0.9 + 0.35 * (st.acro - 1) + 0.1, st.acro);
    const g = clamp(st.igf / 100, 0.1, 3.5), open = st.age < 18 + (st.gdis === 'giant' && !st.gtreat ? 4 : 0);
    A3.gh.mat.uniforms.uOn.value = clamp(0.25 + 0.3 * g, 0.1, 1.3); ['k1', 'k2', 'h1', 'h2'].forEach((k) => { A3[k].mat.uniforms.uOn.value = clamp(0.2 + 0.28 * g, 0.08, 1.2) * (k[0] === 'h' && st.gdis !== 'acro' ? 0.5 : 1); });
    Object.values(A3).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    plateM.forEach((m, i) => { m.visible = open; m.material.color.set(i >= 2 && !open ? '#FF9A5C' : '#7FE0A0'); m.material.opacity = 0.35 + 0.5 * clamp(g / 2, 0, 1) * (0.7 + 0.3 * Math.sin(t * 5 + i)); });
    pitG3.spr.material.opacity = 0.25 + 0.2 * Math.min(g, 3); const tum = (st.gdis === 'giant' && st.age >= 8 && !(st.gtreat && st.age >= 11)) || (st.gdis === 'acro' && st.age >= 20 && !(st.gtreat && st.age >= 22));
    tumor.visible = tum; tumor.scale.setScalar(1 + 0.15 * Math.sin(t * 4));
    if (rnd() < dt * 6 * g && open) { const p = PLATES[(rnd() * 2) | 0]; fx.spawn(IN.localToWorld(p.clone()), V3(0, 0.3, 0.1), C.set('#7FE0A0'), 0.5, 0.6, 0.9); }
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'map') mapUpdate(dt, t);
    if (st.mode === 'water') waterUpdate(dt, t);
    if (st.mode === 'growth') growthUpdate(dt, t);
    G3.updateMatrixWorld(true);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'water') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'осм. (голубой) · моча, л/сут, лог. (жёлтый)', xl: 'время →' });
      const t1 = st.t, X = (tt) => A.X(clamp((tt - (t1 - 40)) / 40, 0, 1)), Yo = (o) => A.Y(clamp((o - 255) / 60, 0, 1)), Yu = (u) => A.Y(clamp(Math.log10(u / 0.3) / Math.log10(70), 0, 1));
      ctx.fillStyle = 'rgba(127,214,255,.10)'; ctx.fillRect(A.X(0), Yo(295), A.X(1) - A.X(0), Yo(280) - Yo(295));
      const line = (fy, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = fy(r); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      line((r) => Yo(r[1]), '#7FD6FF'); line((r) => Yu(r[2]), '#F2D27A');
      return;
    }
    if (st.mode === 'growth') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'рост, см (серое — норма)', xl: 'возраст, 0–25 лет' });
      const X = (a) => A.X(a / AMAX), Y = (v) => A.Y(clamp((v - 40) / 190, 0, 1));
      ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.beginPath(); for (let a = 0; a <= AMAX; a += 0.5) ctx.lineTo(X(a), Y(med(a) * 1.08)); for (let a = AMAX; a >= 0; a -= 0.5) ctx.lineTo(X(a), Y(med(a) * 0.92)); ctx.fill();
      ctx.strokeStyle = '#7FE0A0'; ctx.lineWidth = 2; ctx.beginPath(); st.curve.forEach(([a, v], i) => { if (a > st.age) return; i ? ctx.lineTo(X(a), Y(v)) : ctx.moveTo(X(a), Y(v)); }); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; [100, 150, 200].forEach((v) => ctx.fillText(String(v), A.X(0) + 3, Y(v) - 2));
      return;
    }
    scopeShow(false);
  }

  const SEL = { all: 'Все', gh: 'СТГ', prl: 'Пролактин', acth: 'АКТГ', tsh: 'ТТГ', gn: 'ЛГ и ФСГ', adh: 'Вазопрессин', oxt: 'Окситоцин' };
  const SELTXT = {
    all: '<b>Гипофиз</b> — железа размером с горошину в костном «турецком седле» под мозгом; им управляет гипоталамус. <b>Передняя доля</b> (аденогипофиз) — настоящая железа: пять типов клеток делают шесть гормонов. Ими управляют <b>либерины</b> (включают) и <b>статины</b> (тормозят) — их выделяют мелкие нейроны аркуатного, паравентрикулярного и других ядер гипоталамуса в <b>срединном возвышении</b>, и по коротким <b>портальным сосудам</b> они попадают прямо к клеткам передней доли. <b>Задняя доля</b> (нейрогипофиз) сама гормонов не делает: вазопрессин и окситоцин синтезируют крупные нейроны супраоптического и паравентрикулярного ядер, гормоны спускаются по их аксонам и ждут сигнала в окончаниях. Выберите гормон.',
    gh: '<b>Соматотропный гормон</b> (СТГ, гормон роста) — белок из 191 аминокислоты; его делают соматотрофы, почти половина клеток передней доли. Включает его <b>соматолиберин</b>, тормозит <b>соматостатин</b>, ещё стимулирует грелин из желудка. Выделяется импульсами, больше всего — в глубоком сне. Сам СТГ поднимает сахар крови и усиливает распад жира (он контринсулярный), а рост костей идёт через посредника — ИФР-1 из печени. Подробнее — режим «Гормон роста».',
    prl: '<b>Пролактин</b> запускает и поддерживает выработку молока. Это единственный гормон передней доли, который гипоталамус в основном <b>тормозит</b>: <b>дофамин</b> (красный поток, молекула справа) держит лактотрофы «на тормозе» — поэтому лактотрофы светятся, но выпускают немного. Если ножку гипофиза пережмёт опухоль или дофамин заблокируют лекарства (антипсихотики, метоклопрамид), пролактин растёт. <b>Пролактинома</b> — самая частая гормонально-активная опухоль гипофиза: у женщин нарушает цикл и даёт выделение молока, у мужчин снижает либидо. Её лечат агонистами дофамина (каберголин), опухоль часто уменьшается без операции.',
    acth: 'Кортикотрофы делают большой белок-предшественник <b>проопиомеланокортин</b> (ПОМК, справа). Ферменты-конвертазы режут его на части: <b>АКТГ</b> (включает кору надпочечников — кортизол), <b>меланоцитстимулирующие гормоны</b> (МСГ, пигментация кожи) и <b>β-эндорфин</b> (собственный опиоид). Включает их <b>кортиколиберин</b> из паравентрикулярного ядра (вместе с вазопрессином при стрессе); кортизол по обратной связи тормозит и гипоталамус, и гипофиз. При болезни Аддисона АКТГ очень высок — и кожа темнеет: начало молекулы АКТГ совпадает с α-МСГ, и избыток АКТГ сам действует на рецепторы МСГ (MC1R) в меланоцитах. Аденома из кортикотрофов — болезнь Иценко — Кушинга. См. тему «Надпочечники: стероиды и стресс».',
    tsh: '<b>Тиреотропный гормон</b> (ТТГ) — гликопротеин из двух субъединиц: α такая же, как у ЛГ, ФСГ и ХГЧ, β — своя. Включает его <b>тиреолиберин</b> (ТРГ — всего три аминокислоты, молекула справа; его делают мелкие нейроны паравентрикулярного ядра), тормозят соматостатин и сами гормоны щитовидной железы. ТТГ — самый чувствительный анализ работы щитовидной железы. См. тему «Гормоны щитовидной железы».',
    gn: 'Гонадотрофы делают <b>лютеинизирующий</b> (ЛГ) и <b>фолликулостимулирующий</b> (ФСГ) гормоны. Их включает <b>гонадолиберин</b> (ГнРГ), но только если он приходит <b>импульсами</b> — примерно раз в 1–2 часа (видно по вспышкам потока). Постоянный ГнРГ через пару недель, наоборот, выключает гонадотрофы — на этом основано лечение рака простаты аналогами ГнРГ. У мужчин ЛГ включает синтез тестостерона, ФСГ — созревание сперматозоидов; у женщин они ведут созревание фолликула и овуляцию. См. тему «Половые гормоны и беременность».',
    adh: '<b>Вазопрессин</b> (антидиуретический гормон, АДГ) — пептид из 9 аминокислот с дисульфидным мостиком (молекула справа). Его делают нейроны супраоптического (больше) и паравентрикулярного ядер, гранулы спускаются по аксонам в заднюю долю. Сигнал к выбросу — рост осмоляльности крови (осморецепторы чувствуют сдвиг на 1–2%) и сильное падение давления или объёма крови. В почке через <b>рецептор V2</b> он встраивает водные каналы — аквапорины, моча становится концентрированной (режим «Вазопрессин и вода»); через рецептор V1 сужает сосуды. Алкоголь тормозит выброс вазопрессина — отсюда частое мочеиспускание.',
    oxt: '<b>Окситоцин</b> — тоже нонапептид; от вазопрессина он отличается двумя аминокислотами (молекула справа). Делается в основном в паравентрикулярном ядре. Выбрасывается рефлекторно: при растяжении шейки матки в родах (схватки усиливают выброс, выброс усиливает схватки — положительная обратная связь) и при сосании груди — молоко выталкивается из альвеол («рефлекс отдачи молока»). Синтетический окситоцин вводят для стимуляции родов и чтобы остановить кровотечение после них. В мозге он участвует в привязанности и доверии.',
  };
  const DIS = { norm: 'Норма', thirst: 'Нет воды', dic: 'Центральный несахарный диабет', din: 'Нефрогенный несахарный диабет', siadh: 'СНСАДГ' };
  const DISTXT = {
    norm: 'Клетка <b>собирательной трубки</b> почки. Сверху — просвет трубочки (будущая моча), снизу — кровь. Вазопрессин садится на <b>рецептор V2</b>, через G-белок растёт цАМФ, <b>протеинкиназа A</b> фосфорилирует <b>аквапорин-2</b> (голубые), и пузырьки с ним встраиваются в мембрану со стороны мочи. Вода по осмотическому градиенту уходит из мочи через клетку в кровь (через всегда открытые аквапорины 3 и 4, зелёные) — моча концентрируется. Без вазопрессина аквапорины уходят обратно внутрь клетки, мембрана становится непроницаемой для воды, и моча разбавленная. Обычно мочи 1–2 л в сутки (1 секунда — 4 часа).',
    thirst: 'Человек <b>без доступа к воде</b>. Вода уходит с дыханием, потом и мочой, кровь становится концентрированнее, осмоляльность растёт — гипоталамус включает <b>жажду</b> и выброс вазопрессина. Все аквапорины в мембране, мочи меньше литра в сутки, она тёмная и концентрированная (до 1200 мОсм/кг — вчетверо концентрированнее крови). Почки могут только экономить воду — восполнить её можно лишь питьём.',
    dic: '<b>Центральный несахарный диабет</b>: вазопрессина нет (травма или опухоль в области гипофиза, операция, иногда аутоиммунное поражение). Аквапорины не встраиваются, и почка выводит до 15–20 литров разбавленной мочи в сутки. Человек постоянно хочет пить: если пить вволю, натрий в крови держится у верхней границы нормы; если доступа к воде нет — быстро обезвоживается.',
    din: '<b>Нефрогенный несахарный диабет</b>: вазопрессина много, но почка его не слышит — мутация рецептора V2 (сцеплена с X-хромосомой) или аквапорина-2, либо побочное действие лекарств (соли лития). Гормон в крови высокий, а аквапоринов в мембране нет. Десмопрессин не помогает.',
    siadh: '<b>Синдром неадекватной секреции АДГ</b> (СНСАДГ): вазопрессин выделяется без нужды — при опухолях (особенно мелкоклеточном раке лёгкого), болезнях лёгких и мозга, от некоторых лекарств. Почка задерживает воду, кровь разбавляется: осмоляльность и натрий падают (<b>гипонатриемия</b>), а моча остаётся концентрированной. Тяжёлая гипонатриемия вызывает отёк мозга: головная боль, спутанность, судороги.',
  };
  const TREAT = { thirst: 'Попить воды', dic: 'Десмопрессин', din: 'Тиазид', siadh: 'Ограничить питьё' };
  const TREATTXT = {
    thirst: 'Человек пьёт — осмоляльность возвращается к норме, вазопрессина становится меньше, часть аквапоринов уходит из мембраны, и почки выводят лишнюю воду.',
    dic: '<b>Десмопрессин</b> — синтетический аналог вазопрессина: действует только на рецептор V2 (почти не сужает сосуды) и живёт дольше. Таблетки или спрей в нос возвращают аквапорины в мембрану — мочи снова около 1–1,5 литра. Пить приходится уже не больше обычного.',
    din: '<b>Тиазидные диуретики</b> парадоксально уменьшают объём мочи: небольшая потеря натрия усиливает всасывание соли и воды в проксимальном канальце, и до собирательных трубок доходит меньше жидкости. Вместе с диетой с малым количеством соли и белка мочи становится примерно вдвое меньше, но до нормы не доходит.',
    siadh: '<b>Лечение СНСАДГ</b>: ограничить питьё до 0,8–1 л в сутки и лечить причину; в тяжёлых случаях — ваптаны (блокаторы рецептора V2) и осторожное введение <b>гипертонического (3%)</b> раствора NaCl (обычный физраствор может даже усилить гипонатриемию). Натрий поднимают не быстрее 8–10 ммоль/л за сутки — иначе возникает осмотическая демиелинизация в мозге.',
  };
  const GDIS = { norm: 'Норма', def: 'Дефицит СТГ', giant: 'Гигантизм', acro: 'Акромегалия' };
  const GTREAT = { def: 'Гормон роста с 4 лет', giant: 'Операция в 11 лет', acro: 'Операция в 22 года' };
  const GTXT = {
    norm: '<b>Гормон роста</b> выделяется импульсами — больше всего ночью, в глубоком сне, и в подростковом возрасте. Сам по себе он поднимает сахар крови и сжигает жир, а расти костям велит в основном через посредника — <b>инсулиноподобный фактор роста 1</b> (ИФР-1), который в ответ на СТГ делает печень (и сами ткани). ИФР-1 заставляет делиться хрящевые клетки в <b>пластинках роста</b> на концах длинных костей (светятся). К 16–18 годам под действием половых гормонов пластинки закрываются — после этого человек в длину уже не растёт. Время идёт само; график роста — в углу.',
    def: '<b>Дефицит гормона роста</b> у ребёнка (врождённый или после опухоли, облучения): до года ребёнок растёт почти нормально, потом скорость роста падает вдвое, пропорции тела сохраняются. Без лечения взрослый рост — около 130–140 см. Интеллект не страдает (в отличие от врождённого гипотиреоза).',
    giant: '<b>Гигантизм</b>: аденома из соматотрофов появилась в детстве (здесь — в 8 лет), пока пластинки роста открыты. ИФР-1 в 3 раза выше нормы, кости растут в длину, рост превышает 2 метра, пластинки закрываются позже обычного. Опухоль может давить на перекрёст зрительных нервов — выпадают боковые поля зрения.',
    acro: '<b>Акромегалия</b>: аденома появилась у взрослого (здесь — в 20 лет), когда пластинки роста уже закрыты. В длину кости не растут, зато утолщаются и разрастаются кисти, стопы, нижняя челюсть, нос, язык и внутренние органы. Болезнь развивается медленно, её часто замечают через 5–10 лет — по тому, что стали малы кольца и обувь. Опасна диабетом, гипертонией и болезнями сердца.',
  };
  const GTREATTXT = {
    def: '<b>Рекомбинантный гормон роста</b> — уколы каждый день до закрытия пластинок роста. Лечение начато в 4 года: ребёнок «догоняет» сверстников и вырастает почти до нормы. Раньше гормон получали из гипофизов умерших — пока не выяснилось, что так передаётся прионная болезнь Крейтцфельдта — Якоба; с 1985 года используют только генно-инженерный.',
    giant: '<b>Лечение</b>: удаление аденомы через нос (транссфеноидальная операция), аналоги соматостатина (октреотид, ланреотид) или блокатор рецептора СТГ пегвисомант. После операции в 11 лет ИФР-1 нормализуется, дальше ребёнок растёт обычным темпом.',
    acro: '<b>Лечение акромегалии</b> — то же, что при гигантизме: операция, октреотид, пегвисомант. После операции в 22 года ИФР-1 нормализуется, рост мягких тканей останавливается и частично обратим, но изменения костей остаются.',
  };

  const L1 = () => st.labels && st.mode === 'map', L2 = () => st.labels && st.mode === 'water', L3 = () => st.labels && st.mode === 'growth';
  const w3 = (p) => () => IN.localToWorld(p.clone());
  const labels = [
    { text: 'гипоталамус', pos: V3(-1.2, 3.25, 0.4), color: '#C8B8FF', show: L1 },
    { text: 'супраоптическое ядро', pos: SON.clone().add(V3(0.75, 0.2, 0.2)), color: '#7FD6FF', show: L1 },
    { text: 'паравентрикулярное ядро', pos: PVN.clone().add(V3(-0.4, 0.28, 0.2)), color: '#7FE0A0', show: L1 },
    { text: 'аркуатное ядро (соматолиберин, дофамин)', pos: ARC.clone().add(V3(-1.3, -0.12, 0.2)), color: '#F2C14E', show: L1 },
    { text: 'портальные сосуды', pos: V3(0.95, 0.35, 0.3), color: '#D84A50', show: L1 },
    { text: 'ножка', pos: V3(-0.42, 0.55, 0.2), color: '#E8C0D0', show: L1 },
    { text: 'передняя доля', pos: P_ANT.clone().add(V3(0.6, -0.72, 0.4)), color: '#E890A0', show: L1 },
    { text: 'задняя доля', pos: P_POST.clone().add(V3(-0.75, 0.3, 0.3)), color: '#C8B8F0', show: L1 },
    { text: 'турецкое седло', pos: V3(-1.55, -1.55, 0.1), color: '#E8DCC0', show: L1 },
    { text: 'перекрёст зрительных нервов', pos: V3(1.75, 1.55, 0.4), color: '#E8E0C8', show: L1 },
    { text: 'в кровь', pos: V3(2.5, -2.35, 0.1), color: '#9FA8FF', show: L1 },
    { text: 'в кровь', pos: V3(-2.15, -2.35, 0.1), color: '#9FA8FF', show: L1 },
    { text: 'ПОМК → γ-МСГ · АКТГ · γ-ЛПГ · β-эндорфин', pos: V3(2.35, 0.05, 0.4), color: '#F2C14E', show: () => L1() && st.sel === 'acth' },
    { text: 'тиреолиберин', pos: V3(2.65, 1.35, 0.3), color: '#7FD6FF', show: () => L1() && st.sel === 'tsh' },
    { text: 'дофамин (тормозит)', pos: V3(2.65, 1.35, 0.3), color: '#FF6A5A', show: () => L1() && st.sel === 'prl' },
    { text: 'вазопрессин', pos: V3(2.65, 1.45, 0.3), color: '#5B8CFF', show: () => L1() && st.sel === 'adh' },
    { text: 'окситоцин', pos: V3(2.65, 1.45, 0.3), color: '#FF9AE0', show: () => L1() && st.sel === 'oxt' },
    { text: 'моча (просвет трубки)', pos: V3(40 - 2.6, AY + 1.25, 0.5), color: '#F2D27A', show: L2 },
    { text: 'кровь', pos: V3(40 - 3.1, BY - 1.5, 0.4), color: '#FF6A5A', show: L2 },
    { text: 'рецептор V2', pos: V3(40 - 3.3, BY - 0.25, 0.8), color: '#FF8A5C', show: L2 },
    { text: 'G-белок', pos: V3(40 - 3.4, BY + 0.8, 0.8), color: '#8FB8A8', show: L2 },
    { text: 'вазопрессин', pos: V3(40 - 1.6, BY - 1.25, 0.8), color: '#5B8CFF', show: () => L2() && avp.visible },
    { text: 'протеинкиназа A', pos: V3(40 - 0.9, 0.4, 0.6), color: '#C77DFF', show: L2 },
    { text: 'аквапорин-2', pos: V3(40 + 0.4, AY + 0.45, 0.9), color: '#7FD6FF', show: L2 },
    { text: 'AQP3/4', pos: V3(40 + 1.6, BY + 0.4, 0.9), color: '#7FE0A0', show: L2 },
    { text: 'ядро', pos: V3(40 + 2.6, 0.55, 0.2), color: '#9F7BFF', show: L2 },
    { text: 'гипофиз (СТГ)', pos: w3(PIT3.clone().add(V3(0.55, 0.15, 0.1))), color: '#9F7BFF', show: L3 },
    { text: 'печень (ИФР-1)', pos: w3(LIV3.clone().add(V3(-0.75, -0.2, 0.2))), color: '#E07A5A', show: L3 },
    { text: 'пластинки роста', pos: w3(PLATES[0].clone().add(V3(0.75, 0.1, 0.1))), color: '#7FE0A0', show: () => L3() && plateM[0].visible },
    { text: 'аденома', pos: w3(PIT3.clone().add(V3(-0.55, 0.15, 0.1))), color: '#FF5A5A', show: () => L3() && tumor.visible },
    { text: 'кисти, челюсть', pos: w3(HANDS[0].position.clone().add(V3(0.3, -0.5, 0.1))), color: '#E2B0A0', show: () => L3() && st.gdis === 'acro' },
    ...[50, 100, 150, 200].map((v) => ({ text: `${v} см`, pos: V3(80 - 2.1, FOOT + v * CM + 0.12, 0), color: '#8A90A8', show: L3 })),
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'map' ? SELTXT[st.sel] : st.mode === 'water' ? (st.treat && st.dis !== 'norm' ? TREATTXT[st.dis] : DISTXT[st.dis]) : (st.gtreat && st.gdis !== 'norm' ? GTREATTXT[st.gdis] : GTXT[st.gdis]);
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'map', label: 'Гипоталамус и гипофиз' }, { id: 'water', label: 'Вазопрессин и вода' }, { id: 'growth', label: 'Гормон роста' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'map') box.append(h('div', { class: 'glabel' }, 'Гормон'), h('div', { class: 'gctl' }, seg(Object.entries(SEL).map(([id, label]) => ({ id, label })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
      else if (st.mode === 'water') { const tb = toggle(TREAT[st.dis] || 'Лечение', () => st.treat, (v) => { st.treat = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; st.treat = false; st.day = 0; refs.rebuild(); refs.setInfo(); }), st.dis !== 'norm' ? tb : null, button('Сначала', () => { st.tbw = 42; st.adh = 1; st.day = 0; st.hist = []; }))); }
      else { const tb = toggle(GTREAT[st.gdis] || 'Лечение', () => st.gtreat, (v) => { st.gtreat = v; growthCurve(); st.age = 0; st.hold = 0; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'Ребёнок'), h('div', { class: 'gctl' }, seg(Object.entries(GDIS).map(([id, label]) => ({ id, label })), () => st.gdis, (v) => { st.gdis = v; st.gtreat = false; growthCurve(); st.age = 0; st.hold = 0; refs.rebuild(); refs.setInfo(); }), st.gdis !== 'norm' ? tb : null, button('Сначала', () => { st.age = 0; st.hold = 0; }))); }
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['map', 'water', 'growth'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'water') return [['Na⁺', Math.round(st.posm / 2 - 5.5), 'ммоль/л'], ['Мочи', f1(st.urine), 'л/сут'], ['Моча', Math.round(st.uosm), 'мОсм/кг'], ['Прошло', Math.floor(st.day), 'сут']];
    if (st.mode === 'growth') return [['Возраст', Math.floor(st.age), 'лет'], ['Рост', Math.round(st.hgt), 'см'], ['ИФР-1', Math.round(st.igf), '% нормы']];
    const SH = { all: ['Типов клеток', 5, ''], gh: ['Клеток передней доли', '≈ 50', '%'], prl: ['Клеток передней доли', '15–20', '%'], acth: ['Клеток передней доли', '15–20', '%'], tsh: ['Клеток передней доли', '≈ 5', '%'], gn: ['Клеток передней доли', '≈ 10', '%'], adh: ['Где делается', 'гипоталамус', ''], oxt: ['Где делается', 'гипоталамус', ''] };
    return [SH[st.sel]];
  }
  const upd0 = update;
  const self = {
    mobZoom: 0.6, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope, accent: '#9F7BFF',
    kicker: 'Биохимия · гормоны', title: 'Гипоталамус и гипофиз',
    lede: 'Участок мозга размером с ноготь и железа с горошину управляют ростом, водой, стрессом, обменом веществ, размножением и молоком.',
    notes: `
      <div><h2>Гипоталамо-гипофизарная система</h2>
        <p>Гипоталамус связывает нервную систему с эндокринной. Его мелкоклеточные нейроны выделяют в портальную систему <b>либерины</b> и <b>статины</b>: тиреолиберин (ТРГ), кортиколиберин (КРГ), гонадолиберин (ГнРГ), соматолиберин (СТГ-РГ), соматостатин и дофамин (пролактин-ингибирующий фактор). Крупноклеточные нейроны супраоптического и паравентрикулярного ядер синтезируют <b>вазопрессин</b> и <b>окситоцин</b> вместе с белками-нейрофизинами; гормоны хранятся в окончаниях аксонов в задней доле.</p>
        <h3>Гормоны передней доли</h3><ul><li><b>Белки и пептиды</b>: СТГ (191 аминокислота), пролактин (199), АКТГ (39) — из проопиомеланокортина вместе с МСГ и β-эндорфином.</li><li><b>Гликопротеины</b> из α- и β-субъединиц: ТТГ, ЛГ, ФСГ (α-субъединица общая и у хорионического гонадотропина).</li><li>Обратная связь: гормоны желёз-мишеней (кортизол, T₄, половые стероиды) и ИФР-1 тормозят гипоталамус и гипофиз.</li></ul>
        <h3>Механизм действия</h3><p>ТТГ, ЛГ, ФСГ, АКТГ, вазопрессин (V2) — рецепторы, связанные с G-белками (цАМФ); вазопрессин (V1) и окситоцин — через фосфолипазу C и Ca²⁺; СТГ и пролактин — рецепторы, связанные с тирозинкиназами JAK.</p>
        <h3>Болезни</h3><ul><li>Аденомы гипофиза: пролактинома, соматотропинома (гигантизм, акромегалия), кортикотропинома (болезнь Иценко — Кушинга); большие опухоли давят на перекрёст зрительных нервов.</li><li>Гипопитуитаризм (например, после родов с большой кровопотерей — синдром Шиена).</li><li>Несахарный диабет (центральный, нефрогенный), синдром неадекватной секреции АДГ.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Гипоталамус, гипофиз и клетка почки — схемы, не в масштабе; число клеток передней доли условное, соотношение типов — примерное.</li><li>Молекулы вазопрессина, окситоцина, тиреолиберина и дофамина — по химическим формулам. Рецептор V2 показан структурой другого рецептора того же семейства (β2-адренорецептор с G-белком, PDB 3SN6).</li><li>Модели воды и роста — упрощённые; время ускорено, кривая роста — медиана для мальчиков.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('map'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
