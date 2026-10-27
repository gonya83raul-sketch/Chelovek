import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flyStep, flyTarget, group, h, infoBox, makeControls, mulberry, organMat, rand, randUnit, rnd, scopeShow, seg, toggle, tube } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molGlow, molMesh, plotAxes, protMat } from './kit.js';
Object.assign(BIO_MOL, {"g1p":{"name":"Glucose-1-phosphate","el":"O C C O C O P O O O C O C O C O H H H H H H H H H H H H H","xyz":"+v7wAF0ADP/OANT/Y/9RAMT/5/9sAPP/IQAFAEAAoQAkAGwAHwEeAAYAkwFxAEcAWQGE//X/BQFhAHH/DgB8/wIANwBy/3v/d/9Z/wQAW/8O/3kAH//Y/wMAqP66/7v/ov7SAHoAPf8iAaH/q/69AKb/a/89AFj/5f8DAJ8AgAGB/5z/9AAXADb/QgAx/z4AMwAW/17/YP8d/6z/Qv+0/mAABP/u/2sAlf5c/8P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAGAAkABAAKAAoACwAKAAwADAANAAwADgACAA4ADgAPAAAAEAABABEAAQASAAIAEwAEABQACAAVAAkAFgAKABcACwAYAAwAGQANABoADgAbAA8AHAA=","o":"11111121111111111111111111111"},"adrenaline":{"name":"Epinephrine","el":"C N C C O C C C C O C O C H H H H H H H H H H H H H","xyz":"Qf+lAGf/5v5mAMb/7/7V/7b/R/+Y/yMAC/+l/6IA1f/R/yMA9f89AGsAfgBxAGkA3AA0AB8AYQFnAB0AuQC9/9D/HQF9/4L/PACO/9L/LP8RAWT/Mf98AAP/qf+XAIT/iP6EALT/GP+9/1T/i/6q/73/T/8s/w4A+P4CALUAqv9xAKgAmADKAKQAawHDAAMA/QA2/0j/IgA2/5j/","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwAKAAwABQAMAAAADQAAAA4AAAAPAAEAEAACABEAAgASAAMAEwAEABQABgAVAAcAFgAJABcACwAYAAwAGQA=","o":"11111212111211111111111111"},"glu":{"name":"Glutamate","el":"N C C C C O O C O O H H H H H H H H H","xyz":"1gCAAMP/iABIADEAAgCQADwAqv90AMP/Tf///+P/Vf+X/6P/7f4KAEsAegCy/x8AWABr/30AlAB2/6D/7QDhANf/LAFLALj/wQBaAI4Az/9vAJcAFAD8AEQAbv/NAK3/5v9cAGz/Af/Y/5wAdgCo/1P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAYAEQAJABIA","o":"111121121111111111"},"metformin":{"name":"Metformin","el":"C N C C N N C N N H H H H H H H H H H H","xyz":"NAE5AAAAvQDj/wAAzQBT/wAAOAAkAAAAPAClAAAAwf/S/wAANf/5/wAA0v6M/wAABv9wAAAAMQF6AKj/NAF2AFoAjQH7//3/kgAn/7D/NgE6//H/rAAq/2AA7f/hAAAAz/9s/wAA8v4s/wAAcP6i/wAAov6BAAAA","b":"AAABAAEAAgABAAMAAwAEAAMABQAFAAYABgAHAAYACAAAAAkAAAAKAAAACwACAAwAAgANAAIADgAEAA8ABQAQAAcAEQAHABIACAATAA==","o":"1112111211111111111"}});


// @scene glycogen makeGlycogen | Гликоген и сахар крови | Углеводы
/* =========================================================
   БИОХИМИЯ · ГЛИКОГЕН: гранула (ветвящиеся цепи α-1,4 / α-1,6 на гликогенине),
   синтез (УДФ-глюкоза), распад (фосфорилаза, глюкозо-1-фосфат), регуляция сахара крови
   ========================================================= */
function makeGlycogen() {
  __set_rnd(mulberry(1301));
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { build: flyTarget(V3(0, -1.2, 0), V3(1.0, 0.4, 13.5)), break: flyTarget(V3(0, -1.2, 0), V3(1.0, 0.4, 13.5)), blood: flyTarget(V3(40, -0.9, 0), V3(40.6, 1.2, 18.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.build.pos);
  const controls = makeControls(camera, VIEW.build.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  /* ---------- гранула ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.9, 0); scene.add(G1);
  const core = new THREE.Mesh(blobGeo(0.28, 0.28, 0.28, 3, 0.12, 4), protMat('#FF8AB0', 0.4)); G1.add(core);
  const RES = []; // {p, q, tier, ta, branch}
  // сетка-хэш: остаток не ставится вплотную к остатку другой цепи — цепи не проходят друг сквозь друга
  const GRID = new Map(), gk = (x, y, z) => `${x},${y},${z}`; let CID = 0;
  const crowded = (p, cid) => { const cx = Math.floor(p.x / 0.1), cy = Math.floor(p.y / 0.1), cz = Math.floor(p.z / 0.1); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) { const L = GRID.get(gk(cx + a, cy + b, cz + c)); if (L && L.some((r) => r.cid !== cid && r.p.distanceTo(p) < 0.09)) return true; } return false; };
  const gridAdd = (r) => { const k = gk(Math.floor(r.p.x / 0.1), Math.floor(r.p.y / 0.1), Math.floor(r.p.z / 0.1)); if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(r); };
  function chain(start, dir, tier, t0) {
    const n = tier === 0 ? 6 : 9 + Math.floor(rnd() * 4); let p = start.clone(); const d = dir.clone().normalize();
    const kids = []; const cid = ++CID;
    for (let i = 0; i < n; i++) {
      const rad = p.lengthSq() > 1e-6 ? p.clone().normalize() : d.clone(); d.add(randUnit().multiplyScalar(0.25)).addScaledVector(rad, 0.4).normalize(); if (p.length() > 2.0) d.addScaledVector(rad, -0.9).normalize(); const tw = V3(-d.y, d.x, 0).normalize().multiplyScalar(0.03 * Math.sin(i * 1.7));
      const np = p.clone().addScaledVector(d, 0.105).add(tw); if (i > 1 && crowded(np, cid)) break; p = np;
      const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d);
      const r = { p: p.clone(), q, tier, ta: t0 + i * 0.09, end: i === n - 1, n: i, len: n, kidAt: false };
      r.cid = cid; RES.push(r); gridAdd(r);
      if (tier < 5 && (i === 2 || (i === 6 && tier > 0))) { r.kidAt = true; const ax = randUnit().cross(d).normalize(); kids.push([p.clone(), d.clone().applyAxisAngle(ax, rand(0.52, 0.7)).normalize(), tier + 1, t0 + i * 0.09 + 0.25]); } // ветвь отходит под 30–40°
    }
    kids.forEach((k) => { if (RES.length < 1700) chain(...k); });
  }
  [V3(1, 0, 0), V3(-1, 0, 0), V3(0, 1, 0), V3(0, -1, 0), V3(0, 0, 1), V3(0, 0, -1)].forEach((d) => chain(d.clone().multiplyScalar(0.2), d, 0, 0)); // 6 цепей от гликогенина
  const NR = RES.length; const T_ALL = Math.max(...RES.map((r) => r.ta)) + 0.5;
  const HX = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.035, 6), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.5 }), NR); G1.add(HX);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  const tierCol = ['#FF8AB0', '#FF9A70', '#FFB060', '#F2C14E', '#E8D27A', '#F2E6C8', '#FFF0D0'];
  RES.forEach((r, i) => { HX.setColorAt(i, r.kidAt ? col.set('#FF6A6A').multiplyScalar(0.8) : col.set(tierCol[r.tier]).multiplyScalar(0.42)); }); // точки ветвления α-1,6 — красные
  const KIDS = RES.filter((r) => r.kidAt && r.tier >= 1);
  const g1p = []; for (let k = 0; k < 10; k++) { const m = molMesh(MOL('g1p'), { scale: 0.1, hideH: true }); molGlow(m, 0.3); m.visible = false; scene.add(m); g1p.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const udp = []; for (let k = 0; k < 8; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0x7fe0a0 })); m.visible = false; scene.add(m); udp.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
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
    const A = plotAxes(ctx, w, h, { title: 'blood glucose, mmol/L · 8 hours', xl: 'time →', yl: '' });
    const Y = (v) => A.Y(v / 16);
    ctx.fillStyle = 'rgba(127,224,160,.12)'; ctx.fillRect(A.X(0), Y(5.5), A.X(1) - A.X(0), Y(3.3) - Y(5.5));
    ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,106,106,.5)'; ctx.beginPath(); ctx.moveTo(A.X(0), Y(10)); ctx.lineTo(A.X(1), Y(10)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#F2C14E'; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach(([x, v], i) => { const X = A.X((x - (st.hrs - 8)) / 8); i ? ctx.lineTo(X, Y(v)) : ctx.moveTo(X, Y(v)); }); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(127,224,160,.8)'; ctx.fillText('normal 3.3–5.5', A.X(0.02), Y(5.5) - 3); ctx.fillStyle = 'rgba(255,140,140,.8)'; ctx.fillText('renal threshold ~10', A.X(0.55), Y(10) - 3);
  }
  const TXT = {
    build: '<b>Glycogen synthesis (glycogenesis).</b> After a meal, glucose in the liver and muscles is converted to glucose-6-phosphate → glucose-1-phosphate → <b>UDP-glucose</b> (the activated form, green sparks). <b>Glycogen synthase</b> attaches residues to the ends of chains with <b>α-1,4</b> bonds, and the <b>branching enzyme</b> transfers pieces of 6–7 residues, creating <b>α-1,6</b> branch points (roughly every 8–12 residues). The primer is the protein <b>glycogenin</b> at the center (pink). Branching makes the granule compact and soluble and provides many ends for rapid breakdown. Glycogen synthase is switched on by insulin (via dephosphorylation).',
    break: '<b>Glycogen breakdown (glycogenolysis).</b> <b>Glycogen phosphorylase</b> (coenzyme pyridoxal phosphate, vitamin B6) cleaves glucose from the chain ends using phosphate rather than water, giving <b>glucose-1-phosphate</b> directly (the flying molecules) without spending ATP. Phosphorylase stops 4 residues short of a branch point; from there the <b>debranching enzyme</b> takes over. Breakdown is switched on by epinephrine (adrenaline; muscle, liver) and glucagon (liver) via cAMP and protein kinase A. <b>In the liver</b> glucose-6-phosphatase releases glucose into the blood; <b>in muscle</b> it goes only to the muscle’s own glycolysis.',
    blood: '<b>Blood sugar</b> is kept within a narrow fasting range of ~3.9–5.5 mmol/L (older references give 3.3–5.5). After a meal glucose rises → <b>insulin</b> (light blue stream from the pancreatic β cells) makes the liver and muscles take up glucose and store it as glycogen and fat. During fasting sugar falls → <b>glucagon</b> (orange) makes the liver break down glycogen and synthesize glucose. The brain consumes ~120 g of glucose a day. Click “Eat” and compare with diabetes.',
  };
  const labels = [
    { text: 'glycogenin', pos: V3(0.35, 1.25, 0.3), color: '#FF8AB0', show: () => st.labels && G1.visible },
    { text: 'α-1,6 branch', pos: LB.br, color: '#FF6A6A', show: () => st.labels && G1.visible && st.brOn },
    { text: 'UDP-glucose', pos: LB.udp, color: '#7FE0A0', show: () => st.labels && st.mode === 'build' && st.udpOn },
    { text: 'glucose-1-phosphate', pos: LB.g1p, color: '#FF9A30', show: () => st.labels && st.mode === 'break' && st.g1pOn },
    { text: 'liver', pos: V3(40 - 1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels && st.mode === 'blood' },
    { text: 'pancreas', pos: V3(40 + 0.75, 1.0, 0.2), color: '#E8B070', show: () => st.labels && st.mode === 'blood' },
    { text: 'brain', pos: V3(40.4, 4.4, 0), color: '#E0A0B8', show: () => st.labels && st.mode === 'blood' },
    { text: 'muscles', pos: V3(40.8, -1.2, 0.2), color: '#C0504A', show: () => st.labels && st.mode === 'blood' },
    { text: 'adipose tissue', pos: V3(40 - 1.0, 0.5, 0.4), color: '#F2D08A', show: () => st.labels && st.mode === 'blood' },
    { text: 'kidneys (glucosuria)', pos: V3(40 + 0.82, 0.85, 0.2), color: '#E07070', show: () => st.labels && st.mode === 'blood' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'build', label: 'Synthesis' }, { id: 'break', label: 'Breakdown' }, { id: 'blood', label: 'Blood sugar' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'blood') {
        box.append(h('div', { class: 'glabel' }, 'Experiment'), h('div', { class: 'gctl' }, button('Eat', () => { st.meal = st.hrs; }, true), seg([{ id: 'none', label: 'Healthy' }, { id: 't1', label: 'Type 1 diabetes', color: '#FF6A6A' }, { id: 't2', label: 'Type 2 diabetes', color: '#FF9A50' }], () => st.diab, (v) => { st.diab = v; st.msg = v === 't1' ? '<b>Type 1 diabetes mellitus</b> — the immune system has destroyed the β cells, and there is no insulin. Glucose cannot enter muscle and fat, while the liver keeps releasing it (glucagon is high). Sugar above the renal threshold (~10 mmol/L) spills into the urine (glucosuria), and fats are broken down to ketone bodies (ketoacidosis). Treatment: insulin.' : v === 't2' ? '<b>Type 2 diabetes mellitus</b> — insulin is present, but the tissues respond poorly to it (insulin resistance, more common with obesity). Blood sugar falls slowly after a meal. Treatment: diet, exercise, metformin and other drugs.' : null; refs.setInfo(); })));
      } else box.append(h('div', { class: 'glabel' }, 'Granule'), h('div', { class: 'gctl' }, button('Restart', () => { st.g = st.mode === 'build' ? 0 : T_ALL; }, true)));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['build', 'break', 'blood'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'blood' ? [['Glucose', st.glu.toFixed(1), 'mmol/L'], ['Insulin', Math.round(st.ins * 60), '%'], ['Liver glycogen', Math.round(st.glycL * 100), '%']] : [['Glucose residues', st.res || 0, ''], ['In a real granule', '≈ 30 000', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Biochemistry · carbohydrate metabolism', title: 'Glycogen and blood sugar',
    lede: 'Glucose is a fast fuel, but it cannot be stored in free form: water would rush into the cell. So the liver and muscles store it in branched glycogen granules.',
    notes: `
      <div><h2>Stores</h2>
        <p>The liver holds about 100–120 g of glycogen (up to 6% of its mass); it lasts for 12–24 hours of fasting and serves the whole body. Muscles hold 300–400 g (1–2%), but only “for themselves”: muscle lacks glucose-6-phosphatase.</p>
        <h3>Regulation</h3>
        <p><b>Insulin</b> activates glycogen synthase and inhibits phosphorylase (via phosphatases). <b>Glucagon</b> (liver) and <b>epinephrine</b> (liver and muscle) trigger a cascade: receptor → G protein → adenylate cyclase → cAMP → protein kinase A → phosphorylase kinase → phosphorylase. Phosphorylation switches phosphorylase on and at the same time switches glycogen synthase off. In muscle, breakdown is also accelerated by the Ca²⁺ of contraction and by AMP.</p>
        <h3>Glycogen storage diseases</h3><p>Inherited defects of the breakdown enzymes: von Gierke disease (glucose-6-phosphatase — hypoglycemia, enlarged liver), Pompe disease (lysosomal α-glucosidase — heart involvement), McArdle disease (muscle phosphorylase — cramps during exercise). Aglycogenoses are defects of synthesis.</p></div>
      <div><h2>Simplifications and models</h2><ul><li>The granule is simplified: a few hundred residues out of ~30,000; each hexagonal plate is one glucose residue.</li><li>The blood sugar model is qualitative: “8 hours” are compressed into half a minute.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('build'); st.fly = null;
  return self;
}
export { makeGlycogen };
