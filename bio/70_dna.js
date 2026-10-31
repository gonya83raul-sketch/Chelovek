// @scene dna makeDna | ДНК: строение, репликация, репарация | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · ДНК: реальный додекамер B-ДНК (1BNA) с водородными связями пар оснований,
   вилка репликации (геликаза, праймаза, ДНК-полимеразы, фрагменты Оказаки, лигаза),
   УФ-повреждение (тиминовый димер) и эксцизионная репарация
   ========================================================= */
function makeDna() {
  rnd = mulberry(1901);
  const scene = bioStage({ rim: 0x7fd6ff });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { struct: DK ? flyTarget(V3(-2.4, -0.7, 0), V3(-1.2, 0.9, 14.5)) : flyTarget(V3(-1.3, -0.7, 0), V3(-0.1, 0.9, 13.5)), rep: DK ? flyTarget(V3(36.9, -1.95, 0), V3(37.5, -0.15, 23)) : flyTarget(V3(40.6, -1.0, 0), V3(41.2, 0.8, 20.5)), repair: DK ? flyTarget(V3(78.1, -1.4, 0), V3(79.4, 0.3, 14)) : flyTarget(V3(80, -1.4, 0), V3(81.2, 0.2, 13)) };
  // цель камеры — в центре модели, место под нижнюю панель — сдвигом кадра: вращение и приближение идут вокруг модели
  const VOFF = 0.16; Object.values(VIEW).forEach((v) => { const d = VOFF * 2 * Math.tan(17 * Math.PI / 180) * v.pos.distanceTo(v.target); v.target.y += d; v.pos.y += d; });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.struct.pos); camera.setViewOffset(1, 1, 0, VOFF, 1, 1);
  const controls = makeControls(camera, VIEW.struct.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  const S = PDB('bna'); const SC = 0.16;
  // ось двойной спирали → горизонталь
  const allP = []; S.chains.forEach((c) => { for (let i = 0; i < c.p.length; i += 3) allP.push(V3(c.p[i], c.p[i + 1], c.p[i + 2]).multiplyScalar(SC)); });
  const AX = pcaAxis(allP); const QX = new THREE.Quaternion().setFromUnitVectors(AX.v, V3(1, 0, 0));
  function dnaModel(parent, perRes) {
    const g = new THREE.Group(); g.quaternion.copy(QX); g.position.copy(AX.c.clone().applyQuaternion(QX).negate()); parent.add(g);
    const parts = {};
    S.chains.forEach((c) => {
      const m = c.fullm; const ri = new Uint8Array(bin64(BIO_PDB.bna.chains.find((x) => x.id === c.id).full.ri));
      if (perRes) { for (let r = 0; r < c.seq.length; r++) { const idx = new Set(); for (let i = 0; i < m.n; i++) if (ri[i] === r) idx.add(i); const mm = molMesh(m, { scale: SC, idx }); g.add(mm); parts[c.id + r] = mm; } }
      else { const mm = molMesh(m, { scale: SC }); g.add(mm); parts[c.id] = mm; }
    });
    // водородные связи между основаниями
    const cA = S.chains[0].fullm, cB = S.chains[1].fullm; const anA = BIO_PDB.bna.chains[0].full.an.split(' '), anB = BIO_PDB.bna.chains[1].full.an.split(' ');
    const isBase = (n) => !n.includes("'") && !/^(P|OP1|OP2|O1P|O2P)$/.test(n) && /^[NO]/.test(n);
    const hb = new THREE.Group(); g.add(hb); const dashMat = new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.85 });
    for (let i = 0; i < cA.n; i++) { if (!isBase(anA[i])) continue; const a = V3(cA.xyz[i * 3], cA.xyz[i * 3 + 1], cA.xyz[i * 3 + 2]); for (let j = 0; j < cB.n; j++) { if (!isBase(anB[j])) continue; const b = V3(cB.xyz[j * 3], cB.xyz[j * 3 + 1], cB.xyz[j * 3 + 2]); const d = a.distanceTo(b); if (d > 2.55 && d < 3.25) { for (let k = 0; k < 3; k++) { const p0 = a.clone().lerp(b, (k * 2 + 0.6) / 6.6).multiplyScalar(SC), p1 = a.clone().lerp(b, (k * 2 + 1.6) / 6.6).multiplyScalar(SC); const m = new THREE.Mesh(CYL, dashMat); m.position.copy(p0).lerp(p1, 0.5); const dd = p1.clone().sub(p0); m.scale.set(0.012, dd.length(), 0.012); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dd.normalize()); hb.add(m); } } } }
    // «Строение»: полупрозрачная трубка остова по фосфатам и свой цвет углерода у каждой цепи — две антипараллельные цепи различимы
    if (!perRes) S.chains.forEach((c, k) => {
      const tr = nucTrace(c, { scale: SC, r: 1.1, steps: false, color: k ? '#FFB070' : '#7FD6FF' });
      tr.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.3; o.material.depthWrite = false; } }); g.add(tr);
      if (k) parts[c.id].traverse((o) => { if (o.material === atomMat('C')) o.material = atomMat('C', { color: new THREE.Color('#B07A48') }); });
    });
    return { g, parts, hb };
  }
  /* ---------- 1. строение ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.7, 0); scene.add(G1);
  const D1 = dnaModel(G1, false);
  G1.rotation.order = 'ZYX'; G1.rotation.y = 0.28; // вращение — вокруг оси спирали (локальная X), лёгкий наклон к зрителю
  // бороздки: угол остова каждой цепи (по фосфатам) — линейная функция x вдоль оси; малая — меньший угловой зазор между цепями
  const GRV = (() => {
    const fit = (c) => {
      const pts = []; for (let i = 0; i < c.p.length; i += 3) pts.push(V3(c.p[i], c.p[i + 1], c.p[i + 2]).multiplyScalar(SC).applyQuaternion(QX).add(D1.g.position));
      pts.sort((a, b) => a.x - b.x); const xs = [], as = []; let prev = null;
      pts.forEach((p) => { let a = Math.atan2(p.z, p.y); if (prev !== null) { while (a - prev > Math.PI) a -= 2 * Math.PI; while (a - prev < -Math.PI) a += 2 * Math.PI; } prev = a; xs.push(p.x); as.push(a); });
      const n = xs.length, mx = xs.reduce((q, v) => q + v, 0) / n, ma = as.reduce((q, v) => q + v, 0) / n; let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (as[i] - ma); sxx += (xs[i] - mx) ** 2; }
      const k = sxy / sxx; return { k, a0: ma - k * mx, r: pts.reduce((q, p) => q + Math.hypot(p.y, p.z), 0) / n, pts };
    };
    const A = fit(S.chains[0]), B = fit(S.chains[1]); const k = (A.k + B.k) / 2;
    const d = (((B.a0 - A.a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const minor = d < Math.PI ? A.a0 + d / 2 : A.a0 + d / 2 + Math.PI;
    return { k, minor, major: minor + Math.PI, r: (A.r + B.r) / 2, P: [...A.pts, ...B.pts] };
  })();
  // точка бороздки, обращённая к камере, ближайшая к x0 (в системе G1)
  const groovePos = (a0, x0) => {
    const cl = G1.worldToLocal(camera.position.clone()); const ph = Math.atan2(cl.z, cl.y); const T = 2 * Math.PI / Math.abs(GRV.k);
    let x = (ph - a0) / GRV.k; x += Math.round((x0 - x) / T) * T;
    GRV.ok = Math.abs(x) < 2.2; // у концов молекулы бороздка не подписывается
    return G1.localToWorld(V3(x, Math.cos(ph) * GRV.r * 0.95, Math.sin(ph) * GRV.r * 0.95));
  };
  // атом P, ближе всех к камере в правой части — для подписи остова
  const backbonePos = () => { const cl = G1.worldToLocal(camera.position.clone()); let best = null, bd = 1e9; GRV.P.forEach((p) => { if (p.x < 1.9 || p.x > 3.2) return; const dd = p.distanceTo(cl); if (dd < bd) { bd = dd; best = p; } }); return G1.localToWorld((best || V3(2, 0, 0)).clone()); };
  const hbMid = (() => { let best = null, bd = 1e9; D1.hb.children.forEach((m) => { const p = m.position.clone().applyQuaternion(QX).add(D1.g.position); const dd = Math.abs(p.x + 2.6); if (dd < bd) { bd = dd; best = p; } }); return best || V3(-2.6, 0, 0); })();
  const seqTxt = S.chains[0].seq;
  /* ---------- 2. вилка репликации ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const RAD = 0.32, PITCH = 1.1;
  function helixPair(len, colA, colB, rungs = true) {
    const g = new THREE.Group(); const N = Math.round(len / PITCH * 24);
    const mk = (ph, col) => { const pts = []; for (let i = 0; i <= N; i++) { const x = i / N * len; const a = x / PITCH * Math.PI * 2 + ph; pts.push(V3(x, Math.cos(a) * RAD, Math.sin(a) * RAD)); } const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, 0.06, 8), organMat(col, 0.55, { emissiveIntensity: 0.06 })); g.add(m); return m; };
    const sA = mk(0, colA), sB = colB ? mk(2.4, colB) : null;
    if (rungs && colB) { const nR = Math.round(len / PITCH * 10); const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), new THREE.MeshPhysicalMaterial({ roughness: 0.4 }), nR); const dm = new THREE.Object3D(); for (let i = 0; i < nR; i++) { const x = (i + 0.5) / nR * len; const a1 = x / PITCH * Math.PI * 2, a2 = a1 + 2.4; const p1 = V3(x, Math.cos(a1) * RAD, Math.sin(a1) * RAD), p2 = V3(x, Math.cos(a2) * RAD, Math.sin(a2) * RAD); dm.position.copy(p1).lerp(p2, 0.5); const d = p2.clone().sub(p1); dm.scale.set(1, d.length(), 1); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, new THREE.Color(Object.values(BASECOL)[Math.floor(rnd() * 4)]).multiplyScalar(0.6)); } g.add(im); }
    return { g, sA, sB };
  }
  const parent = helixPair(5.6, '#8FA8C8', '#8FA8C8'); parent.g.position.set(0.5, 0.6, 0); G2.add(parent.g);
  // порядок ZYX: спираль крутится вокруг своей оси (локальная X), а направление ветви (поворот по z) не меняется
  const lead = helixPair(4.8, '#8FA8C8', '#5CE0C8'); lead.g.position.set(-0.3, 1.1, 0); lead.g.rotation.order = 'ZYX'; lead.g.rotation.z = Math.PI - 0.32; G2.add(lead.g);
  const lagT = helixPair(4.8, '#8FA8C8', null, false); lagT.g.position.set(-0.3, 0.1, 0); lagT.g.rotation.order = 'ZYX'; lagT.g.rotation.z = Math.PI + 0.32; G2.add(lagT.g);
  const lagDir = V3(-Math.cos(0.32), -Math.sin(0.32), 0); const lagO = V3(-0.3, 0.1, 0);
  const frags = []; for (let k = 0; k < 5; k++) { const fr = new THREE.Group(); const dna = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), organMat('#5CE0C8', 0.55, { emissiveIntensity: 0.08 })); dna.rotation.z = Math.PI / 2; fr.add(dna); const pr = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 10), organMat('#FF5A5A', 0.6, { emissiveIntensity: 0.15 })); pr.rotation.z = Math.PI / 2; fr.add(pr); G2.add(fr); frags.push({ g: fr, dna, pr, s0: 0, len: 0, born: -99 }); }
  const enz = {};
  const eb = (id, pos, r, col, seed) => { const m = new THREE.Mesh(blobGeo(r[0], r[1], r[2], seed, 0.12, 3), protMat(col, 0.38)); m.position.copy(pos); G2.add(m); enz[id] = m; return m; };
  const heli = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.17, 16, 36), protMat('#F2C14E', 0.42)); heli.rotation.y = Math.PI / 2; heli.position.set(0.55, 0.6, 0); G2.add(heli); enz.heli = heli;
  eb('topo', V3(4.4, 1.22, 0.1), [0.42, 0.4, 0.42], '#C77DFF', 3); // сидит на ДНК, а не нанизана на неё
  eb('polL', V3(-1.3, 1.7, 0.2), [0.55, 0.45, 0.5], '#7FD6FF', 4);
  eb('polG', V3(-1.2, -0.45, 0.2), [0.55, 0.45, 0.5], '#7FD6FF', 5);
  eb('prim', V3(-0.2, -0.2, 0.5), [0.28, 0.24, 0.26], '#FF6A6A', 6);
  eb('pol1', V3(-3.9, -1.0, 0.3), [0.32, 0.28, 0.3], '#7FE0A0', 7);
  eb('lig', V3(-4.2, -1.45, 0.3), [0.3, 0.26, 0.28], '#FF8AB0', 8);
  const ssb = []; for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), protMat('#E0C8A0', 0.45)); m.position.copy(lagO).addScaledVector(lagDir, 0.4 + k * 0.32).add(V3(0, 0.15, 0)); G2.add(m); ssb.push(m); }
  /* ---------- 3. репарация ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0.7, 0); scene.add(G3);
  const D3 = dnaModel(G3, true);
  const uv = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.2, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xb08aff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); uv.position.set(0, 2.6, 0); G3.add(uv);
  const nuc = new THREE.Mesh(blobGeo(0.6, 0.5, 0.5, 12, 0.12, 3), protMat('#F2C14E', 0.38)); G3.add(nuc);
  const polR = new THREE.Mesh(blobGeo(0.55, 0.45, 0.5, 13, 0.12, 3), protMat('#7FD6FF', 0.38)); G3.add(polR);
  const ligR = new THREE.Mesh(blobGeo(0.4, 0.35, 0.35, 14, 0.12, 3), protMat('#FF8AB0', 0.38)); G3.add(ligR);
  // тиминовый димер: свечение жёлтым вместо цвета атома
  const YEL = new THREE.Color('#FFD84A');
  const dimerTint = (g, on) => { molGlow(g, 0); /* сначала свои копии материалов, общий кэш не трогаем */ g.traverse((o) => { if (o.material && o.material.emissive) { if (!o.userData.em0) o.userData.em0 = o.material.emissive.clone(); o.material.emissive.copy(on ? YEL : o.userData.em0); } }); };
  const resPos = (key) => { const m = D3.parts[key]; const b = new THREE.Box3().setFromObject(m); return b.getCenter(V3(0, 0, 0)).sub(G3.position); };
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'struct', labels: true, rot: true, fly: null, cyc: 0, msg: null, hb: true };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['struct', 'rep', 'repair'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.setInfo && refs.setInfo(); }
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'struct') { if (st.rot) G1.rotation.x += dt * 0.25; D1.hb.visible = st.hb; }
    if (st.mode === 'rep') {
      const w = 1.2; parent.g.rotation.x += dt * w; lead.g.rotation.x -= dt * w * 0.8; lagT.g.rotation.x += dt * w * 0.8;
      heli.rotation.x += dt * 4; enz.topo.rotation.y += dt * 0.8;
      // фрагменты Оказаки: каждые 3 с — новый праймер у вилки, растёт прочь от вилки, затем уезжает
      const v = 0.25;
      frags.forEach((f, k) => {
        const age = (st.cyc - k * 3) % 15; if (age < 0) { f.g.visible = false; return; }
        f.g.visible = true; const grow = Math.min(1, age / 2.6); const s0 = 0.5 + age * v; const len = 0.3 + 1.0 * grow;
        const p = lagO.clone().addScaledVector(lagDir, s0 + len / 2); f.g.position.copy(p).add(V3(0, 0.12, 0)); f.g.rotation.z = Math.atan2(lagDir.y, lagDir.x);
        f.dna.scale.y = len; f.dna.position.x = 0; f.pr.position.x = -len / 2 + 0.15; f.pr.visible = age < 6.5; f.pr.material.emissiveIntensity = 0.15;
        if (s0 > 3.5) f.g.visible = false;
      });
      enz.prim.position.y = -0.2 + 0.05 * Math.sin(t * 5); enz.polG.position.copy(lagO).addScaledVector(lagDir, 0.9 + 0.4 * ((st.cyc % 3) / 3)).add(V3(0, -0.35, 0.25));
      enz.pol1.position.copy(lagO).addScaledVector(lagDir, 0.5 + ((st.cyc % 15) * v + 2.6) % 3.4).add(V3(0, -0.4, 0.3));
      if (rnd() < 0.3) fx.spawn(V3(40 - 1.3, 1.7, 0.2).add(randUnit().multiplyScalar(0.5)), randUnit().multiplyScalar(0.2), new THREE.Color(0x5ce0c8), 0.5, 1, 1.0);
    }
    if (st.mode === 'repair') {
      if (st.rot) G3.rotation.y = Math.sin(t * 0.25) * 0.5;
      const T = 16, c = st.cyc % T;
      const dmg = ['A6', 'A7']; const cutR = ['A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
      uv.visible = c < 2.5; uv.material.opacity = 0.12 * (1 - Math.abs(c - 1.2) / 1.3);
      const dimer = c > 1.5 && c < 7; dmg.forEach((k) => { dimerTint(D3.parts[k], dimer); molGlow(D3.parts[k], dimer ? 0.75 + 0.2 * Math.sin(t * 6) : 0); });
      const gone = c > 6 && c < 9.5 ? ease((c - 6) / 1) : c >= 9.5 && c < 12 ? 1 - ease((c - 9.5) / 2.5) : 0;
      cutR.forEach((k) => { molFade(D3.parts[k], 1 - gone * 0.95); if (c > 9.5 && c < 12.5) molGlow(D3.parts[k], 0.2); else if (!dmg.includes(k)) molGlow(D3.parts[k], 0); });
      const site = resPos('A6').clone().lerp(resPos('A7'), 0.5);
      nuc.visible = c > 4 && c < 7.5; nuc.position.copy(site).add(V3(0, 0.9, 0.6));
      polR.visible = c > 9 && c < 12.5; polR.position.copy(resPos('A' + clamp(4 + Math.floor((c - 9) * 2), 4, 9))).add(V3(0, 0.85, 0.6));
      ligR.visible = c > 12.5 && c < 15; ligR.position.copy(resPos('A9')).add(V3(0.3, 0.8, 0.6));
      if (c > 13.5 && c < 13.6) for (let k = 0; k < 30; k++) fx.spawn(G3.position.clone().add(resPos('A9')), randUnit().multiplyScalar(0.6), new THREE.Color(0xff8ab0), 0.6, 2, 1.3);
      st.repPh = c < 1.5 ? 'УФ-облучение' : c < 4 ? 'тиминовый димер' : c < 7 ? 'узнавание и надрез' : c < 9.5 ? 'вырезание участка' : c < 12.5 ? 'ДНК-полимераза достраивает' : c < 15 ? 'ДНК-лигаза сшивает' : 'ДНК восстановлена';
    }
    fx.update(dt);
  }
  const TXT = {
    struct: '<b>Двойная спираль ДНК</b> (Уотсон и Крик, 1953). Это реальная структура додекамера Дрю — Дикерсона (PDB 1BNA, последовательность CGCGAATTCGCG): каждый шарик — атом. Две антипараллельные цепи (5′→3′ и 3′→5′) из нуклеотидов: сахар дезоксирибоза + фосфат образуют остов (<span style="color:#FF9A30">●</span> фосфор снаружи), азотистые основания смотрят внутрь и соединены <b>водородными связями</b> (голубые пунктиры): <b>A=T — две связи, G≡C — три</b>. Поэтому участки, богатые G-C, прочнее. Правила Чаргаффа: A = T, G = C. Шаг спирали — 10 пар оснований, 3,4 нм; видны большая и малая бороздки, куда садятся регуляторные белки.',
    rep: '<b>Репликация</b> — удвоение ДНК перед делением, <b>полуконсервативно</b>: каждая новая молекула содержит одну старую цепь и одну новую. <b>Топоизомераза</b> (сиреневая) снимает напряжение скручивания впереди, <b>геликаза</b> (жёлтое кольцо) расплетает спираль, <b>SSB-белки</b> держат одиночные цепи. ДНК-полимераза умеет только удлинять готовую цепь и только в направлении 5′→3′, поэтому <b>праймаза</b> (красная) кладёт РНК-затравки. <b>Ведущая цепь</b> синтезируется непрерывно, <b>отстающая</b> — кусками, <b>фрагментами Оказаки</b> (100–200 нуклеотидов у человека). РНК-праймеры вырезаются (у человека — РНКаза H и FEN1), брешь застраивает ДНК-полимераза (зелёная), <b>ДНК-лигаза</b> (розовая) сшивает фрагменты. Скорость — около 50 нуклеотидов в секунду в каждой вилке, ошибка — 1 на миллиард.',
    repair: '<b>Повреждение и репарация.</b> Ультрафиолет сшивает два соседних тимина (жёлтое свечение) в <b>тиминовый димер</b> — спираль изгибается, копирование и чтение гена ломаются. <b>Эксцизионная репарация</b>: белки узнают дефект, нуклеаза надрезает цепь по обе стороны и удаляет участок, ДНК-полимераза достраивает его по второй, целой цепи, лигаза сшивает. Наследственный дефект этой системы — <b>пигментная ксеродерма</b>: тысячекратный риск рака кожи от солнца. В клетке каждый день возникают десятки тысяч повреждений ДНК — и почти все исправляются.',
  };
  const labels = [
    { text: 'сахарофосфатный остов', get pos() { return backbonePos(); }, color: '#FF9A30', show: () => st.labels && st.mode === 'struct' },
    { text: 'пары оснований · H-связи', get pos() { return G1.localToWorld(hbMid.clone()); }, color: '#9FD8FF', show: () => st.labels && st.mode === 'struct' },
    { text: 'малая бороздка', get pos() { return groovePos(GRV.minor, 0); }, color: '#C8D2E6', show: () => st.labels && st.mode === 'struct' && (groovePos(GRV.minor, 0), GRV.ok) },
    { text: 'большая бороздка', get pos() { return groovePos(GRV.major, 0); }, color: '#C8D2E6', show: () => st.labels && st.mode === 'struct' && (groovePos(GRV.major, 0), GRV.ok) },
    { text: `5′-${seqTxt}-3′`, pos: V3(-3.2, -0.9, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'struct' },
    { text: 'топоизомераза', pos: V3(44.4, 1.9, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'rep' },
    { text: 'геликаза', pos: V3(40.6, 1.4, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'rep' },
    { text: 'ведущая цепь', pos: V3(40 - 3.4, 2.75, 0), color: '#5CE0C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'отстающая: фрагменты Оказаки', pos: V3(40 - 2.4, -2.1, 0), color: '#5CE0C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'ДНК-полимераза', pos: V3(40 - 1.6, 2.4, 0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'rep' },
    { text: 'праймаза · РНК-праймер', pos: V3(40 + 0.3, -0.7, 0.5), color: '#FF6A6A', show: () => st.labels && st.mode === 'rep' },
    { text: 'SSB-белки', pos: V3(40 - 0.6, 0.55, 0.3), color: '#E0C8A0', show: () => st.labels && st.mode === 'rep' },
    { text: 'ДНК-полимераза · замена праймеров', pos: V3(40 - 3.4, -0.3, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'rep' },
    { text: 'ДНК-лигаза', pos: V3(40 - 4.4, -1.9, 0.3), color: '#FF8AB0', show: () => st.labels && st.mode === 'rep' },
    { text: 'материнская ДНК', pos: V3(40 + 3.4, -0.4, 0), color: '#8FA8C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'УФ', pos: V3(80, 4.0, 0), color: '#B08AFF', show: () => st.labels && st.mode === 'repair' && st.cyc % 16 < 2.5 },
    { text: 'тиминовый димер', get pos() { return resPos('A6').lerp(resPos('A7'), 0.5).add(G3.position).add(V3(0.6, -1.2, 0.4)); }, color: '#FFD84A', show: () => st.labels && st.mode === 'repair' && st.cyc % 16 > 1.5 && st.cyc % 16 < 6 },
    { text: 'нуклеаза (эксцинуклеаза)', get pos() { return nuc.getWorldPosition(V3(0, 0, 0)).add(V3(0.5, 0.55, 0)); }, color: '#F2C14E', show: () => st.labels && st.mode === 'repair' && nuc.visible },
    { text: 'ДНК-полимераза', get pos() { return polR.getWorldPosition(V3(0, 0, 0)).add(V3(0.5, 0.5, 0)); }, color: '#7FD6FF', show: () => st.labels && st.mode === 'repair' && polR.visible },
    { text: 'ДНК-лигаза', get pos() { return ligR.getWorldPosition(V3(0, 0, 0)).add(V3(0.4, 0.45, 0)); }, color: '#FF8AB0', show: () => st.labels && st.mode === 'repair' && ligR.visible },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'struct', label: 'Строение' }, { id: 'rep', label: 'Репликация' }, { id: 'repair', label: 'Повреждение и репарация' }], () => st.mode, (v) => setMode(v));
    const hbT = toggle('H-связи', () => st.hb, (v) => { st.hb = v; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), group('Вид', 'R · N', hbT, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['struct', 'rep', 'repair'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'repair' ? [['Этап', st.repPh || '', '']] : st.mode === 'rep' ? [['Скорость вилки', '≈ 50', 'нукл./с'], ['ДНК клетки', '6,4 млрд', 'пар']] : [['Пар оснований', '12', ''], ['Атомов', S.chains.reduce((a, c) => a + c.fullm.n, 0), '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#5CE0C8',
    kicker: 'Биохимия · молекулярная генетика', title: 'ДНК: строение, репликация, репарация',
    lede: 'Два метра ДНК в каждой клетке хранят инструкцию для всего организма. Как она устроена, как копируется перед делением и как чинится.',
    notes: `
      <div><h2>Нуклеиновые кислоты</h2>
        <p><b>ДНК</b> — полимер дезоксирибонуклеотидов (A, G, C, T), хранит наследственную информацию в ядре и митохондриях. <b>РНК</b> — рибонуклеотиды (A, G, C, U), обычно одноцепочечная: мРНК, тРНК, рРНК и регуляторные РНК.</p>
        <h3>Ферменты репликации</h3><ul><li>Хеликаза, топоизомеразы (мишень хинолонов и некоторых противоопухолевых средств), SSB.</li><li>Праймаза — РНК-затравки.</li><li>ДНК-полимеразы (у человека α, δ, ε) — синтез и корректура 3′→5′.</li><li>ДНК-лигаза. На концах хромосом — теломераза.</li></ul>
        <h3>Мутации</h3><p>Точечные (замена, вставка, выпадение нуклеотида), со сдвигом рамки считывания, хромосомные. Мутагены: УФ и ионизирующее излучение, химические вещества, вирусы. Системы репарации: прямая, эксцизионная (оснований и нуклеотидов), исправление неспаренных оснований (мисмэтч).</p></div>
      <div><h2>Условности и модели</h2><ul><li>Додекамер ДНК — PDB 1BNA, все тяжёлые атомы; водородные связи найдены по расстоянию между атомами азота и кислорода оснований.</li><li>Цепи различаются цветом трубки остова и углерода (голубая и оранжевая); бороздки подписаны там, где они обращены к зрителю.</li><li>Вилка репликации и ферменты — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('struct'); st.fly = null;
  return self;
}
