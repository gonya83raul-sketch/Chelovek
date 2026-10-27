// @scene glycogen makeGlycogen | Гликоген и сахар крови | Углеводы
/* =========================================================
   БИОХИМИЯ · ГЛИКОГЕН: гранула (ветвящиеся цепи α-1,4 / α-1,6 на гликогенине),
   синтез (УДФ-глюкоза), распад (фосфорилаза, глюкозо-1-фосфат), регуляция сахара крови
   ========================================================= */
function makeGlycogen() {
  rnd = mulberry(1301);
  const scene = bioStage({ rim: 0xf2c14e });
  const mqm = window.matchMedia('(max-width:700px)'), MOB = () => mqm.matches;
  // ракурсы: на компьютере гранула слева-в центре, фрагмент справа; на телефоне фрагмент под гранулой
  const VIEW = { build: flyTarget(V3(1.5, -0.1, 0), V3(2.0, 0.6, 9.5)), break: flyTarget(V3(1.5, -0.1, 0), V3(2.0, 0.6, 9.5)), blood: flyTarget(V3(40, -0.9, 0), V3(40.6, 1.2, 18.5)) };
  const VIEWM = { build: flyTarget(V3(0, -1.1, 0), V3(0.4, -0.3, 11)), break: flyTarget(V3(0, -1.1, 0), V3(0.4, -0.3, 11)), blood: flyTarget(V3(40, -0.5, 0), V3(40.4, 1.0, 17)) };
  const VV = (m) => (MOB() && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.build.pos);
  const controls = makeControls(camera, VIEW.build.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  /* ---------- гранула ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.9, 0); scene.add(G1);
  const core = new THREE.Mesh(blobGeo(0.3, 0.3, 0.3, 3, 0.12, 4), protMat('#FF8AB0', 0.55)); G1.add(core);
  const RES = []; // {p, q, tier, ta, kidAt, cut}
  const RMAX = 1.7, STEP = 0.1, CELL = 0.1, QUEUE = [];
  // сетка-хэш: остаток не ставится вплотную к остатку другой цепи — цепи не проходят друг сквозь друга
  const GRID = new Map(), gk = (x, y, z) => `${x},${y},${z}`; let CID = 0;
  const crowded = (p, cid) => { const cx = Math.floor(p.x / CELL), cy = Math.floor(p.y / CELL), cz = Math.floor(p.z / CELL); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) { const L = GRID.get(gk(cx + a, cy + b, cz + c)); if (L && L.some((r) => r.cid !== cid && r.p.distanceTo(p) < 0.085)) return true; } return false; };
  const gridAdd = (r) => { const k = gk(Math.floor(r.p.x / CELL), Math.floor(r.p.y / CELL), Math.floor(r.p.z / CELL)); if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(r); };
  const ZAX = V3(0, 0, 1), qtmp = new THREE.Quaternion();
  // цепь α-1,4: остатки идут от центра; на 2-м и 5-м остатке цепь даёт две боковые ветви α-1,6 (в разные стороны, ~35° от главной цепи)
  function chain(start, dir, tier, t0, az) {
    const n = tier === 0 ? 5 : tier === 1 ? 6 : 7; let p = start.clone(); const d = dir.clone().normalize(); const cid = ++CID; const first = RES.length;
    const perp0 = V3(-d.y, d.x, 0.0001).normalize(), perp1 = d.clone().cross(perp0).normalize();
    for (let i = 0; i < n; i++) {
      d.addScaledVector(p.clone().normalize(), 0.12).normalize();
      const np = p.clone().addScaledVector(d, STEP); if (np.length() > RMAX) break; if (i > 0 && crowded(np, cid)) break; p = np;
      // кольцо глюкозы: нормаль наклонена к цепи и вращается по спирали (≈6 остатков на виток)
      const ang = i * 1.05, ax = perp0.clone().multiplyScalar(Math.cos(ang)).addScaledVector(perp1, Math.sin(ang));
      const nrm = d.clone().applyAxisAngle(ax, 1.1).normalize(); const q = new THREE.Quaternion().setFromUnitVectors(ZAX, nrm);
      const r = { p: p.clone(), q, tier, ta: t0 + i * 0.09, cid, kidAt: false, end: false, cut: false }; RES.push(r); gridAdd(r);
      if (tier < 7 && (i === 1 || i === 4)) { r.kidAt = true; const a2 = az + (i === 1 ? 0 : Math.PI) + tier * 0.9; const pp = V3(-d.y, d.x, 0.0001).normalize(), pq = d.clone().cross(pp).normalize(); const kax = pp.multiplyScalar(Math.cos(a2)).addScaledVector(pq, Math.sin(a2)); QUEUE.push([p.clone(), d.clone().applyAxisAngle(kax, 0.62).normalize(), tier + 1, t0 + i * 0.09 + 0.2, a2]); }
    }
    if (RES.length > first) RES[RES.length - 1].end = true;
  }
  for (let k = 0; k < 8; k++) { const y = 1 - (k + 0.5) * 2 / 8, rr = Math.sqrt(1 - y * y), a = k * 2.399, d = V3(rr * Math.cos(a), y, rr * Math.sin(a)); chain(d.clone().multiplyScalar(0.3), d, 0, 0, k); } // 8 цепей от гликогенина
  while (QUEUE.length && RES.length < 1700) chain(...QUEUE.shift());
  RES.forEach((r) => { r.cut = r.p.x > 0.02 && r.p.y > 0.02 && r.p.z > 0.02; }); // вырезанный сектор: видно гликогенин внутри
  const NR = RES.length; const T_ALL = Math.max(...RES.map((r) => r.ta)) * 1.6 + 0.5; RES.forEach((r) => { r.ta *= 1.6; });
  const HX = new THREE.InstancedMesh(new THREE.TorusGeometry(0.043, 0.018, 6, 6), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.5, emissive: 0x201008 }), NR); G1.add(HX);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  const tierCol = ['#FF8AB0', '#FF9A70', '#FFB060', '#F2C14E', '#E8D27A', '#F2E6C8', '#FFF0D0', '#FFFFFF'];
  RES.forEach((r, i) => { HX.setColorAt(i, r.kidAt ? col.set('#FF5A5A').multiplyScalar(0.95) : col.set(tierCol[r.tier]).multiplyScalar(0.7)); }); // точки ветвления α-1,6 — красные
  const KIDS = RES.filter((r) => r.kidAt && r.tier >= 1 && !r.cut);
  const g1p = []; for (let k = 0; k < 10; k++) { const m = molMesh(MOL('g1p'), { scale: 0.1, hideH: true }); molGlow(m, 0.3); m.visible = false; scene.add(m); g1p.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const udp = []; for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7fe0a0 })); m.visible = false; scene.add(m); udp.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
  /* ---------- увеличенный фрагмент точки ветвления: настоящая молекула панозы (Glc α1→6 Glc α1→4 Glc) ---------- */
  BIO_MOL.panose = {"name":"Паноза","el":"O C C O C O C C O C O C C O C O C O O C C O C O C O C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"bgHqAPQA8gHXAMMA9QF8AEkAwgH8/2kARQHe/ywAGwFe/1UAsgBp/7EAKQBS/3AAEACw/wgAl/+h/8H/L//B/xkA2/4jAN3/Uf4DABkAEP6i/8j/9P17ACcAkP1dAIgAP/75AFIA5f1nAVMAqf4TAfj/Dv+uAP7/gf/dAKb/YP/aABz/hf8U/4n/Bv8F/0z/mP+q/vb/mv8p/rv/HADB/kIAGwBp/rIATgHe/5T/mAFt/2j/kwFeAGH/PwGdAAH/sAHAANL/AwIoAaH/TAGWABYBHAI4AakALwKrABIBXwJvAC0A/QAsAEcAwQAd//8AsADI/+cA3f9i/78AnP/l/2v/0/4UAHH/Yf7X/3wA+/3J/3L/w/2OAMf/n/2SANcAZ/7qALcAzf1+Afj/Mv+tAGYA2f+fALf/m/9EAcH/pP+rAOr+0v8E/zz/7/5W/xz/Rf+w/jwAcv/p/ff/bwCo/gEA6v+T/vsA6QDa/2r/rAF3/wn/8QFCADH/BAHcAC7/UQHsAPP//AF2Adv/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAAwADgAOAA8ADgAQABAAEQAQABIAEgATAAsAEwATABQAFAAVAAkAFgAWABcAFgAYABgAGQAYABoABwAaABoAGwAEABwAHAAdABwAHgAeAB8AHgAgAAIAIAAgACEAAAAiAAEAIwABACQAAgAlAAQAJgAGACcABgAoAAcAKQAJACoACwArAAwALAANAC0ADgAuAA8ALwAQADAAEQAxABMAMgAUADMAFAA0ABUANQAWADYAFwA3ABgAOAAZADkAGgA6ABsAOwAcADwAHQA9AB4APgAfAD8AIABAACEAQQA=","o":"11111111111111111111111111111111111111111111111111111111111111111111"};
  const INS = new THREE.Group(); scene.add(INS);
  const PAN = MOL('panose'), pm = molMesh(PAN, { scale: 0.17, hideH: true });
  { // главная ось молекулы — вдоль x, плоскость — к зрителю
    const n = PAN.n, c = V3(0, 0, 0); for (let i = 0; i < n; i++) c.add(V3(PAN.xyz[i * 3], PAN.xyz[i * 3 + 1], PAN.xyz[i * 3 + 2])); c.multiplyScalar(1 / n);
    const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < n; i++) { const v = [PAN.xyz[i * 3] - c.x, PAN.xyz[i * 3 + 1] - c.y, PAN.xyz[i * 3 + 2] - c.z]; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) C[a][b] += v[a] * v[b]; }
    const pw = (M) => { let v = V3(1, 0.3, 0.2); for (let k = 0; k < 60; k++) { v = V3(M[0][0] * v.x + M[0][1] * v.y + M[0][2] * v.z, M[1][0] * v.x + M[1][1] * v.y + M[1][2] * v.z, M[2][0] * v.x + M[2][1] * v.y + M[2][2] * v.z).normalize(); } return v; };
    const e1 = pw(C), l1 = V3(C[0][0] * e1.x + C[0][1] * e1.y + C[0][2] * e1.z, C[1][0] * e1.x + C[1][1] * e1.y + C[1][2] * e1.z, C[2][0] * e1.x + C[2][1] * e1.y + C[2][2] * e1.z).dot(e1);
    const C2 = C.map((row, a) => row.map((x, b) => x - l1 * [e1.x, e1.y, e1.z][a] * [e1.x, e1.y, e1.z][b])); const e2 = pw(C2), e3 = e1.clone().cross(e2).normalize();
    const M = new THREE.Matrix4().makeBasis(e1, e2, e3); const q = new THREE.Quaternion().setFromRotationMatrix(M.clone().transpose()); pm.quaternion.copy(q); pm.position.copy(c.clone().multiplyScalar(-0.17).applyQuaternion(q));
  }
  INS.add(pm);
  const halo = (i, color) => { const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, depthWrite: false })); h2.position.copy(pm.userData.P(i).applyQuaternion(pm.quaternion).add(pm.position)); INS.add(h2); return h2.position; };
  const P14 = halo(10, 0xf2c14e), P16 = halo(5, 0xff5a5a);
  const insPos = () => (MOB() ? V3(0, -2.55, 0.3) : V3(4.1, -0.2, 0.3));
  const LI14 = V3(0, 0, 0), LI16 = V3(0, 0, 0), LIN = V3(0, 0, 0);

  /* ---------- сахар крови ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.18, legs: true });
  const liver = new THREE.Mesh(blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), organMat('#B0523A', 0.5)); liver.position.set(-0.35, 1.55, 0.15); G2.add(liver);
  const panc = new THREE.Mesh(blobGeo(0.5, 0.12, 0.14, 6, 0.1, 4), organMat('#E8B070', 0.55)); panc.position.set(0.25, 1.2, -0.05); panc.rotation.z = 0.2; G2.add(panc);
  const brain = new THREE.Mesh(ell3(0.3, 0.25, 0.35, BODY.head), organMat('#E0A0B8', 0.45)); G2.add(brain);
  const musL = [1, -1].map((s) => { const m = new THREE.Mesh(tube([V3(0.47 * s, -0.3, 0.05), V3(0.5 * s, -1.2, 0.08), V3(0.48 * s, -2.0, 0.06)], 0.24), organMat('#C0504A', 0.4)); G2.add(m); return m; });
  [1, -1].forEach((s) => { const k = new THREE.Mesh(blobGeo(0.16, 0.24, 0.12, 8 + s, 0.08, 3), organMat('#A04040', 0.5)); k.position.set(0.62 * s, 0.98, -0.2); G2.add(k); }); // почки
  const fat = new THREE.Mesh(ell3(0.8, 0.35, 0.3, V3(0, 0.6, 0.35)), organMat('#F2D08A', 0.35, { transparent: true, opacity: 0.6 })); G2.add(fat);
  const HEART = BODY.heart.clone();
  const fGlu = [flowArrow(G2, liver.position.clone().add(V3(0.3, 0.2, 0.2)), HEART.clone().add(V3(0, -0.1, 0.1)), '#F2C14E', { bend: 0.3 }), flowArrow(G2, HEART.clone().add(V3(0.1, 0.2, 0)), BODY.head.clone().add(V3(0.1, -0.35, 0)), '#F2C14E', { bend: -0.2 }), flowArrow(G2, HEART.clone().add(V3(0.2, -0.3, 0)), V3(0.5, -0.5, 0.1), '#F2C14E', { bend: -0.25 })];
  const fIns = flowArrow(G2, panc.position.clone().add(V3(0.2, 0.1, 0.2)), liver.position.clone().add(V3(0.3, -0.2, 0.3)), '#7FD6FF', { bend: 0.5 });
  const fGlg = flowArrow(G2, panc.position.clone().add(V3(0.1, 0.15, 0.25)), liver.position.clone().add(V3(0.1, -0.1, 0.4)), '#FF8A5C', { bend: -0.6 });
  /* ---------- состояние ---------- */
  const LB = { br: V3(0, 0, 0), udp: V3(0, 0, 0), g1p: V3(0, 0, 0) };
  const st = { t: 0, mode: 'build', labels: true, rot: true, fly: null, g: 0, msg: null, glu: 5.0, ins: 0.3, glg: 0.3, meal: -99, diab: 'none', hist: [], hrs: 0, sim: 8, glycL: 0.7 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m !== 'blood'; G2.visible = m === 'blood'; st.fly = VIEW[m]; st.g = m === 'build' ? 0 : T_ALL; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt);
    if (G1.visible) {
      if (st.rot) G1.rotation.y += dt * 0.2;
      if (st.mode === 'build') { st.g += dt * 0.55; if (st.g > T_ALL + 2.5) st.g = 0.2; }
      else { st.g -= dt * 0.55; const lim = 0.45; if (st.g < lim) { st.g = lim; st.hold = (st.hold || 0) + dt; if (st.hold > 2.5) { st.hold = 0; st.g = T_ALL; } } }
      let shown = 0;
      RES.forEach((r, i) => {
        const vis = r.ta <= st.g; const fresh = st.mode === 'build' && vis && st.g - r.ta < 0.25;
        dm.position.copy(r.p); dm.quaternion.copy(r.q); dm.scale.setScalar(vis ? (fresh ? 1.6 : 1) : 0.0001); dm.updateMatrix(); HX.setMatrixAt(i, dm.matrix);
        if (vis) shown++;
        if (st.mode === 'break' && !vis && r.ta > st.g && r.ta - st.g < 0.012 * 60 * dt && rnd() < 0.5) { const q = g1p.find((x) => x.age > 2.2); if (q) { q.age = 0; q.m.visible = true; const wp = r.p.clone().applyQuaternion(G1.quaternion).add(G1.position); q.m.position.copy(wp); q.v.copy(wp.clone().sub(G1.position).normalize().multiplyScalar(1.4)); } }
        if (fresh && rnd() < 0.08) { const u = udp.find((x) => x.age > 0.6); if (u) { u.age = 0; u.m.visible = true; const wp = r.p.clone().applyQuaternion(G1.quaternion).add(G1.position); u.b.copy(wp); u.a.copy(wp.clone().sub(G1.position).normalize().multiplyScalar(2.2).add(wp)); } }
      });
      HX.instanceMatrix.needsUpdate = true; st.res = shown;
      g1p.forEach((q) => { if (q.age < 2.2) { q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
      udp.forEach((u) => { if (u.age < 0.6) { u.age += dt; u.m.position.copy(u.a).lerp(u.b, u.age / 0.6); } else u.m.visible = false; });
      core.rotation.y += dt;
      // подписи следуют за объектами: ближайшая к зрителю видимая точка ветвления, последние УДФ-глюкоза и Г1Ф
      let best = null, bz = -1e9; KIDS.forEach((r) => { if (r.ta > st.g) return; const wp = r.p.clone().applyQuaternion(G1.quaternion); if (wp.z > bz) { bz = wp.z; best = wp; } }); if (best) LB.br.copy(best).add(G1.position); st.brOn = !!best;
      const lu = udp.filter((u) => u.m.visible).sort((a, b) => b.age - a.age)[0]; st.udpOn = !!lu; if (lu) LB.udp.copy(lu.m.position);
      const lg = g1p.filter((q) => q.m.visible).sort((a, b) => b.age - a.age).find((q) => q.age > 0.3); st.g1pOn = !!lg; if (lg) LB.g1p.copy(lg.m.position);
    }
    if (st.mode === 'blood') {
      // модель: каждая секунда = 15 минут
      const hdt = dt * 0.25 * st.sim / 8; st.hrs += hdt;
      const sinceMeal = st.hrs - st.meal;
      const absorb = sinceMeal > 0 && sinceMeal < 3 ? 3.2 * Math.exp(-sinceMeal / 0.9) * (sinceMeal / 0.25 < 1 ? sinceMeal / 0.25 : 1) : 0;
      const insEff = st.diab === 't1' ? 0.05 : st.diab === 't2' ? 0.35 : 1;
      const insSecr = st.diab === 't1' ? 0.02 : clamp((st.glu - 4.2) / 3, 0, 1.6);
      st.ins += (insSecr - st.ins) * Math.min(1, hdt * 3); st.glg += (clamp((5.0 - st.glu) / 1.5, 0.05, 1.5) * (st.diab === 't1' ? 1.4 : 1) - st.glg) * Math.min(1, hdt * 3);
      const uptake = 0.55 + 1.6 * st.ins * insEff * (st.glu / 5); const hepOut = 0.55 + 0.9 * st.glg - 0.7 * st.ins * insEff;
      const renal = st.glu > 10 ? (st.glu - 10) * 0.5 : 0;
      st.glu = clamp(st.glu + (absorb + hepOut - uptake - renal) * hdt * 1.6, 2.5, 22);
      st.glycL = clamp(st.glycL + (0.6 * st.ins * insEff - 0.25 * st.glg) * hdt * 0.3, 0.05, 1);
      st.hist.push([st.hrs, st.glu]); while (st.hist.length && st.hist[0][0] < st.hrs - 8) st.hist.shift();
      [...fGlu, fIns, fGlg].forEach((f) => { f.mat.uniforms.uTime.value = t; });
      fIns.mat.uniforms.uOn.value = clamp(st.ins, 0.05, 1); fGlg.mat.uniforms.uOn.value = clamp(st.glg, 0.05, 1);
      fGlu.forEach((f) => { f.mat.uniforms.uOn.value = clamp(st.glu / 8, 0.2, 1.2); });
      liver.material.emissiveIntensity = 0.04 + 0.3 * st.glycL; panc.material.emissiveIntensity = 0.04 + 0.4 * st.ins;
      if (renal > 0 && rnd() < 0.3) fx.spawn(V3(40 + 0.62 * (rnd() < 0.5 ? 1 : -1), 0.98, -0.2), randUnit().multiplyScalar(0.2), new THREE.Color(0xf2c14e), 0.6, 1, 1.2);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'blood') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'глюкоза крови, ммоль/л · 8 часов', xl: 'время →', yl: '' });
    const Y = (v) => A.Y(v / 16);
    ctx.fillStyle = 'rgba(127,224,160,.12)'; ctx.fillRect(A.X(0), Y(5.5), A.X(1) - A.X(0), Y(3.3) - Y(5.5));
    ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,106,106,.5)'; ctx.beginPath(); ctx.moveTo(A.X(0), Y(10)); ctx.lineTo(A.X(1), Y(10)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#F2C14E'; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach(([x, v], i) => { const X = A.X((x - (st.hrs - 8)) / 8); i ? ctx.lineTo(X, Y(v)) : ctx.moveTo(X, Y(v)); }); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(127,224,160,.8)'; ctx.fillText('норма 3,3–5,5', A.X(0.02), Y(5.5) - 3); ctx.fillStyle = 'rgba(255,140,140,.8)'; ctx.fillText('почечный порог ~10', A.X(0.55), Y(10) - 3);
  }
  const TXT = {
    build: '<b>Синтез гликогена (гликогенез).</b> После еды глюкоза в печени и мышцах превращается в глюкозо-6-фосфат → глюкозо-1-фосфат → <b>УДФ-глюкозу</b> (активированная форма, зелёные огоньки). <b>Гликогенсинтаза</b> пришивает остатки к концам цепей связью <b>α-1,4</b>, а <b>ветвящий фермент</b> переносит кусочки по 6–7 остатков, создавая точки ветвления <b>α-1,6</b> (примерно каждые 8–12 остатков). Затравка — белок <b>гликогенин</b> в центре (розовый). Ветвление делает гранулу компактной, растворимой и даёт много концов для быстрого распада. Гликогенсинтазу включает инсулин (через дефосфорилирование).',
    break: '<b>Распад гликогена (гликогенолиз).</b> <b>Гликогенфосфорилаза</b> (кофермент — пиридоксальфосфат, витамин B6) отщепляет глюкозу от концов цепей не водой, а фосфатом — сразу получается <b>глюкозо-1-фосфат</b> (летящие молекулы), без затраты АТФ. Фосфорилаза останавливается за 4 остатка до ветвления; дальше работает <b>деветвящий фермент</b>. Включается адреналином (мышцы, печень) и глюкагоном (печень) через цАМФ и протеинкиназу A. <b>В печени</b> глюкозо-6-фосфатаза отдаёт глюкозу в кровь, <b>в мышцах</b> — только на собственный гликолиз.',
    blood: '<b>Сахар крови</b> держится в узком коридоре ~3,9–5,5 ммоль/л натощак (в старых справочниках — 3,3–5,5). После еды глюкоза растёт → <b>инсулин</b> (голубой поток от β-клеток поджелудочной) заставляет печень и мышцы забирать глюкозу и запасать её в гликоген и жир. Натощак сахар падает → <b>глюкагон</b> (оранжевый) заставляет печень расщеплять гликоген и синтезировать глюкозу. Мозг потребляет ~120 г глюкозы в сутки. Нажмите «Поесть» и сравните с диабетом.',
  };
  const labels = [
    { text: 'гликогенин', pos: V3(0.35, 1.25, 0.3), color: '#FF8AB0', show: () => st.labels && G1.visible },
    { text: 'α-1,6 ветвление', pos: LB.br, color: '#FF6A6A', show: () => st.labels && G1.visible && st.brOn },
    { text: 'УДФ-глюкоза', pos: LB.udp, color: '#7FE0A0', show: () => st.labels && st.mode === 'build' && st.udpOn },
    { text: 'глюкозо-1-фосфат', pos: LB.g1p, color: '#FF9A30', show: () => st.labels && st.mode === 'break' && st.g1pOn },
    { text: 'печень', pos: V3(40 - 1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels && st.mode === 'blood' },
    { text: 'поджелудочная', pos: V3(40 + 0.75, 1.0, 0.2), color: '#E8B070', show: () => st.labels && st.mode === 'blood' },
    { text: 'мозг', pos: V3(40.4, 4.4, 0), color: '#E0A0B8', show: () => st.labels && st.mode === 'blood' },
    { text: 'мышцы', pos: V3(40.8, -1.2, 0.2), color: '#C0504A', show: () => st.labels && st.mode === 'blood' },
    { text: 'жировая ткань', pos: V3(40 - 1.0, 0.5, 0.4), color: '#F2D08A', show: () => st.labels && st.mode === 'blood' },
    { text: 'почки (глюкозурия)', pos: V3(40 + 0.82, 0.85, 0.2), color: '#E07070', show: () => st.labels && st.mode === 'blood' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'build', label: 'Синтез' }, { id: 'break', label: 'Распад' }, { id: 'blood', label: 'Сахар крови' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'blood') {
        box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' }, button('Поесть', () => { st.meal = st.hrs; }, true), seg([{ id: 'none', label: 'Здоров' }, { id: 't1', label: 'Диабет 1 типа', color: '#FF6A6A' }, { id: 't2', label: 'Диабет 2 типа', color: '#FF9A50' }], () => st.diab, (v) => { st.diab = v; st.msg = v === 't1' ? '<b>Сахарный диабет 1 типа</b> — иммунитет разрушил β-клетки, инсулина нет. Глюкоза не входит в мышцы и жир, печень продолжает её выбрасывать (глюкагона много). Сахар выше почечного порога (~10 ммоль/л) уходит с мочой (глюкозурия), жиры распадаются до кетоновых тел (кетоацидоз). Лечение — инсулин.' : v === 't2' ? '<b>Сахарный диабет 2 типа</b> — инсулин есть, но ткани к нему малочувствительны (инсулинорезистентность, чаще при ожирении). Сахар после еды падает медленно. Лечение — питание, движение, метформин и другие препараты.' : null; refs.setInfo(); })));
      } else box.append(h('div', { class: 'glabel' }, 'Гранула'), h('div', { class: 'gctl' }, button('Сначала', () => { st.g = st.mode === 'build' ? 0 : T_ALL; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['build', 'break', 'blood'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'blood' ? [['Глюкоза', st.glu.toFixed(1), 'ммоль/л'], ['Инсулин', Math.round(st.ins * 60), '%'], ['Гликоген печени', Math.round(st.glycL * 100), '%']] : [['Остатков глюкозы', st.res || 0, ''], ['В реальной грануле', '≈ 30 000', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · обмен углеводов', title: 'Гликоген и сахар крови',
    lede: 'Глюкоза — быстрое топливо, но хранить её в свободном виде нельзя: вода хлынула бы в клетку. Поэтому печень и мышцы запасают её в ветвистых гранулах гликогена.',
    notes: `
      <div><h2>Запасы</h2>
        <p>В печени — около 100–120 г гликогена (до 6% массы), его хватает на 12–24 часа голодания и он служит всему организму. В мышцах — 300–400 г (1–2%), но только «для себя»: в мышцах нет глюкозо-6-фосфатазы.</p>
        <h3>Регуляция</h3>
        <p><b>Инсулин</b> активирует гликогенсинтазу и тормозит фосфорилазу (через фосфатазы). <b>Глюкагон</b> (печень) и <b>адреналин</b> (печень и мышцы) запускают каскад: рецептор → G-белок → аденилатциклаза → цАМФ → протеинкиназа A → киназа фосфорилазы → фосфорилаза. Фосфорилирование включает фосфорилазу и одновременно выключает гликогенсинтазу. В мышцах распад ускоряют также Ca²⁺ сокращения и АМФ.</p>
        <h3>Гликогенозы</h3><p>Наследственные дефекты ферментов распада: болезнь Гирке (глюкозо-6-фосфатаза — гипогликемия, большая печень), Помпе (лизосомная α-глюкозидаза — поражение сердца), Мак-Ардла (мышечная фосфорилаза — судороги при нагрузке). Агликогенозы — дефекты синтеза.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Гранула показана упрощённо: несколько сотен остатков из ~30 000, каждая шестиугольная пластинка — один остаток глюкозы.</li><li>Модель сахара крови качественная: «8 часов» сжаты в полминуты.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('build'); st.fly = null;
  return self;
}
