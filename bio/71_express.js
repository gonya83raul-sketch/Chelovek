// @scene express makeExpress | Транскрипция и трансляция | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · ОТ ГЕНА К БЕЛКУ: транскрипция (РНК-полимераза, промотор, белок GAL4 на ДНК 1D66),
   созревание мРНК (сплайсинг петлёй-лассо, кэп, поли-A, выход через ядерную пору), трансляция на рибосоме 70S с тремя тРНК (1VY4), антибиотики
   ========================================================= */
const EX_CODE = { UUU: 'F', UUC: 'F', UUA: 'L', UUG: 'L', CUU: 'L', CUC: 'L', CUA: 'L', CUG: 'L', AUU: 'I', AUC: 'I', AUA: 'I', AUG: 'M', GUU: 'V', GUC: 'V', GUA: 'V', GUG: 'V', UCU: 'S', UCC: 'S', UCA: 'S', UCG: 'S', CCU: 'P', CCC: 'P', CCA: 'P', CCG: 'P', ACU: 'T', ACC: 'T', ACA: 'T', ACG: 'T', GCU: 'A', GCC: 'A', GCA: 'A', GCG: 'A', UAU: 'Y', UAC: 'Y', UAA: '*', UAG: '*', CAU: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q', AAU: 'N', AAC: 'N', AAA: 'K', AAG: 'K', GAU: 'D', GAC: 'D', GAA: 'E', GAG: 'E', UGU: 'C', UGC: 'C', UGA: '*', UGG: 'W', CGU: 'R', CGC: 'R', CGA: 'R', CGG: 'R', AGU: 'S', AGC: 'S', AGA: 'R', AGG: 'R', GGU: 'G', GGC: 'G', GGA: 'G', GGG: 'G' };
const EX_AA = { F: 'Фен', L: 'Лей', I: 'Иле', M: 'Мет', V: 'Вал', S: 'Сер', P: 'Про', T: 'Тре', A: 'Ала', Y: 'Тир', H: 'Гис', Q: 'Глн', N: 'Асн', K: 'Лиз', D: 'Асп', E: 'Глу', C: 'Цис', W: 'Три', R: 'Арг', G: 'Гли', '*': 'стоп' };
const EX_AB = [
  { id: 'tet', name: 'Тетрациклин', text: '<b>Тетрациклины</b> садятся на малую (30S) субъединицу и не пускают аминоацил-тРНК в A-участок — цепь перестаёт расти.' },
  { id: 'str', name: 'Стрептомицин', text: '<b>Стрептомицин</b> и другие аминогликозиды искажают малую субъединицу: тРНК с «чужим» антикодоном связывается, в белок встают неправильные аминокислоты (красные) — бактерия собирает брак.' },
  { id: 'chl', name: 'Левомицетин', text: '<b>Левомицетин (хлорамфеникол)</b> блокирует пептидилтрансферазный центр большой субъединицы: тРНК приходит, но пептидная связь не образуется.' },
  { id: 'ery', name: 'Эритромицин', text: '<b>Эритромицин</b> и другие макролиды закупоривают выходной туннель большой субъединицы — цепь застревает после нескольких аминокислот.' },
];
function makeExpress() {
  rnd = mulberry(2001);
  const scene = bioStage({ rim: 0xff9a50 });
  const DK = !matchMedia('(max-width:700px)').matches;   /* телефон: спираль транскрипции целиком */
  const VIEW = { tx: DK ? flyTarget(V3(0, 0.2, 0), V3(0.5, 2.2, 17)) : flyTarget(V3(0, 0.2, 0), V3(0.5, 2.2, 19.5)), splice: DK ? flyTarget(V3(37.5, 0.6, 0), V3(37.8, 2.4, 18)) : flyTarget(V3(36.5, 0.5, 0), V3(36.8, 2.4, 19.5)), tl: DK ? flyTarget(V3(79.3, 0.75, 0), V3(80.8, 2.75, 17.0)) : flyTarget(V3(80.0, 0.8, 0), V3(81.1, 2.3, 13.0)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.tx.pos);
  const controls = makeControls(camera, VIEW.tx.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  const RAD = 0.3, PITCH = 1.05;
  function duplex(len, colA, colB) {
    const g = new THREE.Group(); const N = Math.round(len / PITCH * 22);
    [0, 2.4].forEach((ph, k) => { const pts = []; for (let i = 0; i <= N; i++) { const x = i / N * len; const a = x / PITCH * Math.PI * 2 + ph; pts.push(V3(x, Math.cos(a) * RAD, Math.sin(a) * RAD)); } g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, 0.055, 8), organMat(k ? colB : colA, 0.55, { emissiveIntensity: 0.05 }))); });
    const nR = Math.round(len / PITCH * 10); const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), new THREE.MeshPhysicalMaterial({ roughness: 0.4 }), nR); const dm = new THREE.Object3D();
    for (let i = 0; i < nR; i++) { const x = (i + 0.5) / nR * len; const a1 = x / PITCH * Math.PI * 2, a2 = a1 + 2.4; const p1 = V3(x, Math.cos(a1) * RAD, Math.sin(a1) * RAD), p2 = V3(x, Math.cos(a2) * RAD, Math.sin(a2) * RAD); dm.position.copy(p1).lerp(p2, 0.5); const d = p2.clone().sub(p1); dm.scale.set(1, d.length(), 1); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, new THREE.Color(Object.values(BASECOL)[Math.floor(rnd() * 4)]).multiplyScalar(0.6)); }
    g.add(im); g.userData.rungs = im; g.userData.nR = nR; g.userData.len = len; g.userData.base = im.instanceMatrix.array.slice(); return g;
  }
  /* ---------- 1. транскрипция ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const dna = duplex(14.5, '#8FA8C8', '#8FA8C8'); dna.position.set(-7.3, 0.4, 0); G1.add(dna);
  const tata = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })); tata.rotation.z = Math.PI / 2; tata.position.set(-5.8, 0.4, 0); G1.add(tata);
  const rnap = new THREE.Mesh(blobGeo(1.4, 1.15, 1.15, 31, 0.12, 4), glassMat(0xff9a50, { rim: 0.45, base: 0.012, keep: true })); G1.add(rnap);
  const rnapCore = new THREE.Mesh(blobGeo(0.85, 0.7, 0.7, 32, 0.12, 4), protMat('#FF9A50', 0.25, { transparent: true, opacity: 0.25 })); rnap.add(rnapCore);
  const txCap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), organMat('#C77DFF', 0.6, { emissiveIntensity: 0.25 })); G1.add(txCap);
  const MRN = 140; const mrnaPts = []; const mrnaM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6 }), MRN); mrnaM.count = 0; G1.add(mrnaM);
  const GAL = new THREE.Group(); GAL.position.set(3.4, 2.75, 0.4); G1.add(GAL);   // врезка сверху — белок-регулятор на своём участке ДНК (другой ген)
  const gp = proteinMesh('gal4', { scale: 0.03, colorBy: (c, ci) => ['#F2E6C8', '#F2E6C8', '#C77DFF', '#FF8AB0'][ci] || '#7FD6FF', nucColor: '#9FB4D8' }); GAL.add(gp);
  const galLink = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.6, 6), new THREE.MeshBasicMaterial({ color: 0x9fb4d8, transparent: true, opacity: 0.4 })); galLink.position.set(3.0, 1.45, 0.2); galLink.rotation.z = 0.35; galLink.scale.y = 0.6; G1.add(galLink);
  /* ---------- 2. сплайсинг ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const EXONS = [[0, 1.6, '#FF8A5C'], [3.2, 4.6, '#F2C14E'], [6.6, 8.0, '#7FE0A0'], [9.4, 11.0, '#7FD6FF']];
  const preM = []; const segM = (a, b, col, intron) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1, 12), organMat(col, intron ? 0.35 : 0.6, { emissiveIntensity: intron ? 0.25 : 0.1 })); m.rotation.z = Math.PI / 2; G2.add(m); return { m, a, b, intron }; };
  EXONS.forEach(([a, b, c], k) => { preM.push(segM(a, b, c, false)); if (k < EXONS.length - 1) preM.push(segM(b, EXONS[k + 1][0], '#A8B0C4', true)); });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), organMat('#C77DFF', 0.6, { emissiveIntensity: 0.2 })); G2.add(cap);
  const polyA = new THREE.Group(); for (let k = 0; k < 14; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), organMat('#FF6A6A', 0.6)); s.position.set(k * 0.17, 0.04 * Math.sin(k), 0); polyA.add(s); } G2.add(polyA);
  const spl = new THREE.Group(); G2.add(spl);   /* сплайсосома: оболочка и малые ядерные РНП (U1, U2, U4/U6, U5) */
  spl.add(new THREE.Mesh(blobGeo(0.85, 0.7, 0.7, 44, 0.12, 4), glassMat(0x7fd6ff, { rim: 0.4, base: 0.01, keep: true })));
  [[-0.35, 0.18, 0.2, '#7FD6FF'], [0.3, 0.25, 0.15, '#9FB4FF'], [0.05, -0.2, 0.3, '#5BC0EB'], [-0.1, 0.35, -0.3, '#B8E0FF'], [0.35, -0.15, -0.25, '#7FC8E0']].forEach(([x, y, z, col], k) => { const b = new THREE.Mesh(blobGeo(0.3, 0.26, 0.26, 60 + k, 0.18, 3), protMat(col, 0.45)); b.position.set(x, y, z); spl.add(b); });
  preM.forEach((s) => { if (!s.intron) return; const g = new THREE.Group(); const mat = organMat('#A8B0C4', 0.4, { emissiveIntensity: 0.25, transparent: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 10, 32), mat); ring.position.y = 0.36; g.add(ring);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), mat); tail.rotation.z = Math.PI / 2 - 0.5; tail.position.set(0.22, 0.12, 0); g.add(tail);
    g.visible = false; G2.add(g); s.lar = g; s.larMat = mat; });
  const PORE_X = -7.7, ENV = new THREE.Group(); G2.add(ENV);   /* ядерная оболочка (две мембраны) и пора */
  { const em = organMat('#C9A8E8', 0.35, { emissiveIntensity: 0.08, transparent: true, opacity: 0.4, depthWrite: false });
    [-0.14, 0.14].forEach((dx) => [[1.3, 0.85], [-0.05, 1.0]].forEach(([y, hh]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, hh, 2.6), em); b.position.set(PORE_X + dx, y, 0); ENV.add(b); }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.09, 10, 28), organMat('#C77DFF', 0.5, { emissiveIntensity: 0.15 })); ring.rotation.y = Math.PI / 2; ring.position.set(PORE_X, 0.6, 0); ENV.add(ring);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), protMat('#D8B0FF', 0.5)); n.position.set(PORE_X, 0.6 + Math.cos(a) * 0.46, Math.sin(a) * 0.46); ENV.add(n); } }
  /* ---------- 3. трансляция ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const RB = PDB('ribo70'), RSC = 0.021, RY = 1.2, byId = Object.fromEntries(RB.chains.map((c) => [c.id, c]));
  const chP = (c) => { const q = c.k === 'p' ? c.ca : c.p; const o = []; for (let i = 0; i < q.length; i += 3) o.push(V3(q[i], q[i + 1], q[i + 2])); return o; };
  const cenP = (P) => P.reduce((acc, p) => acc.add(p), V3(0, 0, 0)).multiplyScalar(1 / P.length);
  const c30 = cenP(chP(byId.AA)), c50 = cenP(chP(byId.BA));
  const RQ1 = new THREE.Quaternion().setFromUnitVectors(c50.clone().sub(c30).normalize(), V3(0, 1, 0));   /* 50S сверху */
  const mP = chP(byId.AV), md = mP[mP.length - 1].clone().sub(mP[0]).applyQuaternion(RQ1); md.y = 0; md.normalize();
  const RQ = new THREE.Quaternion().setFromUnitVectors(md, V3(1, 0, 0)).multiply(RQ1), RC = c30.clone().lerp(c50, 0.5);   /* мРНК 5′→3′ слева направо, тРНК к зрителю */
  const toW = (p) => p.clone().sub(RC).applyQuaternion(RQ).multiplyScalar(RSC);
  const RIB = new THREE.Group(); RIB.position.set(0, RY, 0); G3.add(RIB);
  const TRN = ['AY', 'AX', 'AW'];   /* тРНК в E-, P- и A-участках */
  const SUBC = { A: { n: '#E8C772', p: '#D98A4E' }, B: { n: '#9FC0EE', p: '#6E7FC4' } }, rMat = {};
  const rm = (col) => rMat[col] || (rMat[col] = organMat(col, 0.5, { emissiveIntensity: 0.06, transparent: true, opacity: 0.55, depthWrite: false }));
  RB.chains.forEach((c) => { if (c.id === 'AV' || TRN.includes(c.id)) return; const P = chP(c).map(toW); if (P.length < 4) return; const sc = SUBC[c.id[0]]; RIB.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), Math.max(8, P.length * (c.k === 'n' ? 3 : 2)), c.k === 'n' ? 0.034 : 0.024, 6, false), rm(c.k === 'n' ? sc.n : sc.p))); });
  const tRNA = TRN.map((id) => { const P = chP(byId[id]).map(toW); const g = new THREE.Group(); RIB.add(g);
    const mat = organMat('#E8D27A', 0.7, { emissiveIntensity: 0.35, transparent: true, depthTest: false }), acm = organMat('#FF8AB0', 0.7, { emissiveIntensity: 0.4, transparent: true, depthTest: false });
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), P.length * 4, 0.08, 8, false), mat));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P.slice(32, 38)), 16, 0.1, 8, false), acm));   /* антикодоновая петля */
    const aa = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), protMat('#7FE0A0', 0.5, { depthTest: false })); aa.position.copy(P[P.length - 1]); g.add(aa);
    g.traverse((o) => { o.renderOrder = 6; });
    g.userData = { aa, mats: [mat, acm], ac: P[34].clone(), elbow: P[55].clone() }; return g; });
  const AC = { E: tRNA[0].userData.ac, P: tRNA[1].userData.ac, A: tRNA[2].userData.ac };
  const NT = (AC.A.x - AC.P.x) / 3, MRY = (AC.P.y + AC.A.y) / 2 - 0.17, MRZ = (AC.P.z + AC.A.z) / 2 + 0.05;
  const IN = V3(1.6, 1.3, 0.5), OUT = V3(-0.5, 1.7, 0.3);
  const SEQ = 'AUGGCCAAGUUUGGACUGAGCGAAUGGCGCUAA'; const COD = SEQ.match(/.{3}/g);
  const nucs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.065, 10, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, depthTest: false }), SEQ.length); nucs.renderOrder = 5; RIB.add(nucs);
  const PTC = toW(V3(...RB.sites.ptc)), EXIT = toW(V3(...RB.sites.exit));
  const PATH = new THREE.CatmullRomCurve3([PTC, PTC.clone().lerp(EXIT, 0.5).add(V3(0.05, 0, 0.1)), EXIT, EXIT.clone().add(V3(-0.1, 0.8, -0.2)), EXIT.clone().add(V3(-0.45, 1.6, 0.1)), EXIT.clone().add(V3(-1.0, 2.2, 0.4)), EXIT.clone().add(V3(-1.7, 2.6, 0.6))]); const PLEN = PATH.getLength();
  const chain = []; for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), protMat('#7FE0A0', 0.45, { depthTest: false })); m.renderOrder = 6; m.visible = false; RIB.add(m); chain.push(m); }
  const AACOL = (l) => ({ M: '#FFD070', '*': '#FF6A6A' })[l] || ['#7FE0A0', '#7FD6FF', '#FF8AB0', '#C77DFF', '#F2C14E', '#FF9A5C'][l.charCodeAt(0) % 6];
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'tx', labels: true, rot: false, fly: null, cyc: 0, msg: null, ab: null, made: [], cod: 0, wrong: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['tx', 'splice', 'tl'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D(); const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'tx') {
      const T = 18, c = st.cyc % T; const x = -5.2 + Math.max(0, c - 1) * 0.62; const px = Math.min(x, 6.6);
      rnap.position.set(px, 0.4, 0); rnap.rotation.x = Math.sin(t) * 0.05; GAL.rotation.y += dt * 0.3;
      // мРНК: точки от старта до полимеразы, «хвост» выходит вверх
      const n = Math.max(0, Math.min(MRN, Math.floor((px + 5.2) / 0.1))); mrnaM.count = n;
      for (let i = 0; i < n; i++) { const s = (n - i) * 0.1; const p = V3(px - 0.2 - s * 0.55, 0.4 + 0.8 + 0.45 * Math.min(s / 1.5, 1) + 0.12 * Math.sin(s * 3 + t), 0.4 * Math.cos(s * 2)); dm.position.copy(p); dm.scale.setScalar(1); dm.updateMatrix(); mrnaM.setMatrixAt(i, dm.matrix); mrnaM.setColorAt(i, new THREE.Color(Object.values(BASECOL)[(i * 7) % 4]).multiplyScalar(0.7)); }
      mrnaM.instanceMatrix.needsUpdate = true; if (mrnaM.instanceColor) mrnaM.instanceColor.needsUpdate = true;
      tata.material.opacity = c < 2 ? 0.45 : 0.18;
      { const ud = dna.userData, arr = ud.rungs.instanceMatrix.array; for (let i = 0; i < ud.nR; i++) { const xi = (i + 0.5) / ud.nR * ud.len + dna.position.x; const open = c > 0.6 && Math.abs(xi - px) < 0.7; for (let j = 0; j < 16; j++) arr[i * 16 + j] = open ? (j === 15 ? 1 : 0) : ud.base[i * 16 + j]; } ud.rungs.instanceMatrix.needsUpdate = true; }   /* пузырь: ≈ 14 пар расплетены внутри полимеразы */
      txCap.visible = n > 12; if (n > 12) { mrnaM.getMatrixAt(0, dm.matrix); txCap.position.setFromMatrixPosition(dm.matrix); }
      st.txPh = c < 1 ? 'сборка на промоторе' : px < 6.6 ? 'элонгация: синтез РНК' : 'терминация';
    }
    if (st.mode === 'splice') {
      const T = 16, c = st.cyc % T; const cut = ease((c - 3) / 4), gone = ease((c - 7.5) / 2.5), ex = ease((c - 11) / 3.5);
      let shift = 0; const X0 = -5.5 - ex * 3.6;
      preM.forEach((s) => { const L = s.b - s.a; if (s.intron) { const jx = X0 + s.a - shift; s.m.visible = cut < 0.98; s.m.scale.y = Math.max(0.001, L * (1 - cut)); s.m.position.set(jx + L * (1 - cut) / 2, 0.6, 0); s.m.material.opacity = 1 - 0.6 * cut; s.m.material.transparent = true;
        s.lar.visible = cut > 0.02 && gone < 0.98; s.lar.scale.setScalar(0.25 + 0.75 * ease(cut * 1.4)); s.lar.position.set(jx + 0.05, 0.6 + 0.15 * cut + 0.45 * gone, 0.25 * cut + 1.4 * gone); s.lar.rotation.y = gone * 1.5; s.larMat.opacity = 1 - gone; shift += L * cut; }
        else { s.m.scale.y = L; s.m.position.set(X0 + s.a - shift + L / 2, 0.6, 0); } });
      const last = preM[preM.length - 1]; const endX = last.m.position.x + (last.b - last.a) / 2;
      cap.visible = c > 8; cap.position.set(X0 - 0.2, 0.6, 0); polyA.visible = c > 9.5; polyA.position.set(endX + 0.1, 0.6, 0);
      spl.visible = c > 2.5 && c < 7.5; spl.position.set(-5.5 + (EXONS[1][0] + EXONS[2][1]) / 2 - shift * 0.6, 1.25, 0); spl.rotation.y += dt * 0.6; spl.scale.setScalar(ease((c - 2.5) / 0.6) * (1 - ease((c - 6.9) / 0.6)) + 0.001);
      st.spPh = c < 3 ? 'пре-мРНК: экзоны и интроны' : c < 7.5 ? 'сплайсосома вырезает интроны' : c < 9.5 ? 'кэп на 5′-конце' : c < 11 ? 'поли-A-хвост → в цитоплазму' : 'выход через ядерную пору';
    }
    if (st.mode === 'tl') {
      // шаг = 2 с на кодон: тРНК входит в A-участок, пептидная связь, сдвиг на кодон (A→P→E)
      const blockA = st.ab === 'tet', noBond = st.ab === 'chl', tunnel = st.ab === 'ery' && st.cod >= 4;
      const stepT = 2; const cc = st.cyc / stepT; let cod = Math.floor(cc) % (COD.length + 3); const u = cc - Math.floor(cc);
      const stuck = (blockA || tunnel) && cod > 2; if (stuck) cod = Math.min(cod, 3);
      st.cod = Math.min(cod, COD.length - 1); const live = st.cod < COD.length - 1;
      const sh = stuck || !live ? 0 : ease(clamp((u - 0.6) / 0.4, 0, 1));
      for (let i = 0; i < SEQ.length; i++) { const x = AC.P.x + (i - 1 - 3 * st.cod - 3 * sh) * NT; dm.position.set(x, MRY + 0.03 * Math.sin(i * 1.7), MRZ); dm.scale.setScalar(Math.abs(x) < 4.2 ? 1 : 0.001); dm.updateMatrix(); nucs.setMatrixAt(i, dm.matrix); nucs.setColorAt(i, new THREE.Color(BASECOL[SEQ[i]]).multiplyScalar(0.7)); }
      nucs.instanceMatrix.needsUpdate = true; nucs.instanceColor.needsUpdate = true;
      const aaL = (k) => { let l = EX_CODE[COD[k]] || '*'; if (st.ab === 'str' && k % 3 === 2 && k > 0) l = 'W'; return l; };
      const arr = ease(clamp(u * 2.2, 0, 1)), leave = ease(clamp(u * 1.6, 0, 1));
      tRNA.forEach((g, k) => { const ud = g.userData; const off = V3(0, 0, 0); let op = 1;
        if (k === 2) { off.copy(IN).multiplyScalar(1 - arr).addScaledVector(AC.P.clone().sub(AC.A), sh); op = arr; }
        else if (k === 1) off.addScaledVector(AC.E.clone().sub(AC.P), sh);
        else { off.copy(OUT).multiplyScalar(leave); op = 1 - leave; }
        g.position.copy(off); ud.mats.forEach((mm) => { mm.opacity = op; }); ud.aa.material.transparent = op < 1; ud.aa.material.opacity = op;
        g.visible = live && !(k === 2 && blockA && st.cod >= 2) && !(k === 0 && (st.cod === 0 || stuck));
        const l = aaL(Math.min(COD.length - 1, st.cod + (k === 2 ? 1 : k === 0 ? -1 : 0)));
        ud.aa.material.color.set(AACOL(l)).multiplyScalar(0.5); ud.aa.material.emissive.set(AACOL(l)); ud.aa.visible = k === 2 || (k === 1 && (noBond || st.cod === 0)); });
      const made = noBond ? Math.min(1, st.cod) : st.cod; st.made = made;
      chain.forEach((m, k) => { m.visible = k < made && k < 14; if (!m.visible) return; const l = aaL(made - 1 - k); m.material.color.set(AACOL(l)).multiplyScalar(0.45); m.material.emissive.set(AACOL(l)); m.material.emissiveIntensity = 0.05;
        m.position.copy(PATH.getPointAt(Math.min(1, (k + 0.6) * 0.29 / PLEN))).add(V3(0.06 * Math.sin(k * 1.7 + st.t), 0.06 * Math.cos(k * 1.3 + st.t * 0.7), 0.06 * Math.sin(k))); });
      if (st.ab === 'str') chain.forEach((m, k) => { if (m.visible && aaL(made - 1 - k) === 'W' && (made - 1 - k) % 3 === 2) { m.material.color.set('#FF5A5A').multiplyScalar(0.5); m.material.emissive.set('#FF5A5A'); m.material.emissiveIntensity = 0.4; } });
      st.curCod = COD[Math.min(COD.length - 1, st.cod + 1)]; st.curAA = aaL(Math.min(COD.length - 1, st.cod + 1));
      if (cod >= COD.length + 2) st.cyc = 0;
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'tl') { scopeShow(false); return; } scopeShow(true);
    ctx.clearRect(0, 0, w, h); ctx.font = (w < 250 ? '500 8.5px' : '500 10px') + ' JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('генетический код: кодон в A-участке', 8, 12);
    const cod = st.curCod || 'AUG';
    ctx.font = '600 30px JetBrains Mono, monospace'; [...cod].forEach((b, k) => { ctx.fillStyle = BASECOL[b] || '#fff'; ctx.fillText(b, 14 + k * 26, 52); });
    ctx.fillStyle = '#EFEAE6'; ctx.font = '500 22px Golos Text, sans-serif'; ctx.fillText('→ ' + (EX_AA[st.curAA] || ''), 100, 50);
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText('мРНК: ' + COD.slice(0, 8).join(' '), 8, 80); ctx.fillText('белок: ' + COD.slice(0, 8).map((c) => EX_CODE[c]).join('-'), 8, 96);
    if (h > 110) ctx.fillText('64 кодона: 61 смысловой + 3 стоп (UAA, UAG, UGA)', 8, h - 6);
  }
  const TXT = {
    tx: '<b>Транскрипция</b> — переписывание гена с ДНК на РНК в ядре. <b>РНК-полимераза II</b> (оранжевая) с факторами транскрипции садится на <b>промотор</b> (жёлтая зона, ТАТА-бокс), расплетает около 14 пар оснований и движется по матричной цепи 3′→5′, собирая РНК 5′→3′ по принципу комплементарности (U вместо T). Сверху — реальная структура белка-регулятора <b>GAL4</b> дрожжей на своём участке ДНК (PDB 1D66): так активаторы узнают нужные гены по последовательности в большой бороздке. Ещё во время синтеза на 5′-конец РНК ставится <b>кэп</b> (сиреневый). Пройдя сигнал полиаденилирования, полимераза отрезает РНК и сходит с ДНК.',
    splice: '<b>Созревание (процессинг) мРНК</b> у эукариот. Ген разорван: смысловые <b>экзоны</b> (цветные) перемежаются <b>интронами</b> (серые). <b>Сплайсосома</b> (из малых ядерных РНК и белков) вырезает интроны петлёй-«лассо» и сшивает экзоны; из одного гена так можно собрать разные мРНК (альтернативный сплайсинг). На 5′-конец ставится <b>кэп</b> (7-метилгуанозин, сиреневый), на 3′-конец — <b>поли-A-хвост</b> (красный) из 100–250 адениловых остатков. Вырезанные лассо разрушаются, а зрелая мРНК выходит через <b>ядерную пору</b> в цитоплазму.',
    tl: '<b>Трансляция</b> на рибосоме. Модель — настоящая бактериальная рибосома <b>70S</b> с мРНК и тремя тРНК (PDB 1VY4): сверху <b>большая субъединица</b> 50S (рРНК — голубые нити, белки — синие), снизу малая 30S (рРНК — золотистые, белки — оранжевые). мРНК читается кодонами по 3 нуклеотида от <b>AUG</b> (метионин). тРНК (L-образные, антикодоновая петля розовая) приносят аминокислоты: антикодон спаривается с кодоном в <b>A-участке</b>, рибосома (её рРНК — рибозим) переносит растущую цепь из <b>P-участка</b> на новую аминокислоту, сдвигается на кодон, пустая тРНК уходит через <b>E-участок</b>. На стоп-кодоне (UAA) белок освобождается. Включите антибиотик.',
  };
  const labels = [
    { text: 'промотор · ТАТА-бокс', pos: V3(-6.4, -0.3, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'tx' },
    { text: 'РНК-полимераза', pos: () => rnap.position.clone().add(V3(-0.6, -1.1, 0)), color: '#FF9A50', show: () => st.labels && st.mode === 'tx' },
    { text: 'мРНК', pos: V3(-1.0, 2.6, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'tx' && st.cyc % 18 > 6 },
    { text: 'белок GAL4 на ДНК (PDB 1D66)', pos: V3(4.4, 3.0, 0.4), color: '#C77DFF', show: () => st.labels && st.mode === 'tx' },
    { text: 'кэп', pos: () => cap.getWorldPosition(V3(0, 0, 0)).add(V3(0, 0.5, 0)), color: '#C77DFF', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 > 8 },
    { text: 'поли-A', pos: () => polyA.getWorldPosition(V3(0, 0, 0)).add(V3(1.2, 0.5, 0)), color: '#FF6A6A', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 > 9.5 },
    { text: 'интроны', pos: () => preM[3].lar.getWorldPosition(V3(0, 0, 0)).add(V3(0, 0.8, 0)), color: '#9FA8B8', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 > 3 && st.cyc % 16 < 7 },
    { text: 'экзоны', pos: () => preM[0].m.getWorldPosition(V3(0, 0, 0)).add(V3(0, -0.5, 0)), color: '#FF8A5C', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 < 11 },
    { text: 'сплайсосома', pos: () => spl.getWorldPosition(V3(0, 0, 0)).add(V3(0.4, 0.9, 0)), color: '#7FD6FF', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 > 2.5 && st.cyc % 16 < 7.5 },
    { text: 'ядро', pos: V3(40 - 6.9, -0.75, 0.3), color: '#C9A8E8', show: () => st.labels && st.mode === 'splice' },
    { text: 'цитоплазма', pos: V3(40 - 8.6, -0.75, 0.3), color: '#C9A8E8', left: true, show: () => st.labels && st.mode === 'splice' },
    { text: 'ядерная пора', pos: V3(40 - 7.7, 1.95, 0.3), color: '#D8B0FF', show: () => st.labels && st.mode === 'splice' && st.cyc % 16 > 9.5 },
    { text: 'большая субъединица (рРНК + белки)', pos: V3(80 + 1.9, RY + 2.75, 0.3), color: '#9FC0EE', show: () => st.labels && st.mode === 'tl' },
    { text: 'малая субъединица', pos: V3(80 - 0.9, RY - 1.95, 1.2), color: '#E8C772', left: true, show: () => st.labels && st.mode === 'tl' },
    { text: 'E · P · A', pos: V3(80 + AC.P.x - 0.05, RY + MRY - 0.32, MRZ + 0.2), color: '#E8D27A', show: () => st.labels && st.mode === 'tl' },
    { text: 'мРНК 5′→3′', pos: V3(80 - 2.7, RY + MRY - 0.25, MRZ), color: '#D9D2D8', show: () => st.labels && st.mode === 'tl' },
    { text: 'тРНК', pos: () => tRNA[1].localToWorld(tRNA[1].userData.elbow.clone()), color: '#E8D27A', show: () => st.labels && st.mode === 'tl' && tRNA[1].visible },
    { text: 'растущий белок', pos: () => chain[Math.max(0, Math.min(13, (st.made || 1) - 1))].getWorldPosition(V3(0, 0, 0)), color: '#7FE0A0', show: () => st.labels && st.mode === 'tl' && st.cod >= 5 },
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const a = EX_AB.find((x) => x.id === st.ab); ib.info.innerHTML = st.msg || (st.mode === 'tl' && a ? a.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'tx', label: 'Транскрипция' }, { id: 'splice', label: 'Созревание мРНК' }, { id: 'tl', label: 'Трансляция' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'tl') box.append(h('div', { class: 'glabel' }, 'Антибиотик'), h('div', { class: 'gctl' }, seg([{ id: null, label: 'Нет' }, ...EX_AB.map((a) => ({ id: a.id, label: a.name }))], () => st.ab, (v) => { st.ab = v; st.cyc = 0; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['tx', 'splice', 'tl'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'tx' ? [['Этап', st.txPh || '', '']] : st.mode === 'splice' ? [['Этап', st.spPh || '', '']] : [['Кодон', st.curCod || '', ''], ['Аминокислота', EX_AA[st.curAA] || '', ''], ['Скорость', '≈ 5', 'а.к./с']]; }
  const self = {
    mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF9A50',
    kicker: 'Биохимия · молекулярная генетика', title: 'Транскрипция и трансляция',
    lede: 'Центральная догма: ДНК → РНК → белок. Ген переписывается в мРНК, мРНК созревает и уходит к рибосоме, где кодоны превращаются в аминокислоты.',
    notes: `
      <div><h2>Генетический код</h2>
        <p>Код <b>триплетный</b> (кодон — 3 нуклеотида), <b>вырожденный</b> (61 смысловой кодон на 20 аминокислот), <b>однозначный</b>, <b>неперекрывающийся</b>, без запятых и почти <b>универсальный</b> для всего живого. AUG — старт (метионин), UAA, UAG, UGA — стоп.</p>
        <h3>Цена белка</h3><p>Активация аминокислоты на тРНК аминоацил-тРНК-синтетазой — 2 макроэрга (АТФ → АМФ), вхождение тРНК в A-участок и транслокация — по ГТФ: около 4 макроэргических связей на каждую пептидную связь.</p>
        <h3>После трансляции</h3><p>Белки укладываются (часто с шаперонами), режутся (проинсулин → инсулин), фосфорилируются, гликозилируются, получают простетические группы и сигналы доставки. Регуляция экспрессии генов — на уровне транскрипции (оперон у бактерий, факторы транскрипции и энхансеры у эукариот), процессинга, стабильности мРНК и трансляции.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Рибосома 70S Thermus thermophilus с мРНК и тРНК в участках A, P и E — PDB 1VY4: 3 рРНК и около 50 белков. Форма тРНК взята из структуры, движение между участками — схема; нуклеотиды мРНК показаны бусинами.</li><li>GAL4 на ДНК — PDB 1D66.</li><li>РНК-полимераза, сплайсосома и ядерная пора — схематично; лассо-петли интронов показаны кольцами.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('tx'); st.fly = null;
  return self;
}
