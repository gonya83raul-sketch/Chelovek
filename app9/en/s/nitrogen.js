import { Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, scopeShow, seg, toggle } from '../core.js';
import { BIO_MOL, MOL, bioStage, flowArrow, molFit, molMesh, plotAxes } from './kit.js';
Object.assign(BIO_MOL, {"bilirubin":{"name":"Bilirubin","el":"C C C C C C C C N C C C N C C C N C O C C C C C C C C C C C O O C C C C O O C C N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"CgM7ALv+jgIxABD/UwLB/z//kQI8/xz/cgK+/jn/2wHr/4//jwGQ/8j/FgGt/xkA1wAiAD4AZwAEAIwACQBqAMcAof+SAGAAOP8/ADcA6/5+ANn/cP5cAIn/Lv7q/47/Uf57/+L/7v0U/8f/6v2o/vr/jf1K/1//Gv30/i7/vvwV/9T+sv3E/z7/b/0gANv+Iv/4AMj/8v5lAWv/lv8EAR4A8P99ASgAof/0AWEAd//WAfAAyv/OAUkB7f7DAQ8BYACB/5kA9/8z/+UAJQAe/3YBmwC8/ncBDAHl/ooBhAAy/mIB0ABI/08A7wC1/kMA0QF6AI3/QQKrAD7/WgIdASb/VgP2/9/+8gIhAFP+MgOgAL7+7QJA/93+tgJx/g7/IQKW/nP/qwEn/7v/7wCAACgA1/9AAB8BQQDCAOcAMf/k/18ASf6pAEP/mv5t/yMAEf2P/lr/uvx0/6H+cPzL/rz+ef34/3b+BP0nAPL+mf2EAN3+Qf+uAVr/nP6ZAZb/1f47AQr/RQBpAWkAFQCYAcX/Sf8GAiMA4f9NAl8Asf7DAcMA5v/S/rYAmP9q/+YAQwB9/6EB0v/0/rABXgAZ/gwBDwGd/t3/lgB5/loAPwGZ/ogAjwG3ALf/","b":"AAABAAEAAgACAAMAAwAEAAIABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEQATABMAFAAUABUAEwAWAA8AFgAWABcADQAYABgAGQAYABoACwAaABoAGwAbABwAHAAdAB0AHgAdAB8ACQAgACAAIQAhACIAIgAjACMAJAAjACUAIAAmAAcAJgAmACcABQAoACgAKQABACkAKQAqAAAAKwAAACwAAAAtAAMALgAEAC8ABAAwAAYAMQAIADIACgAzAAoANAAMADUADgA2ABAANwAUADgAFQA5ABUAOgAXADsAFwA8ABcAPQAZAD4AGQA/ABkAQAAbAEEAGwBCABwAQwAcAEQAHwBFACEARgAhAEcAIgBIACIASQAlAEoAJwBLACcATAAnAE0AKABOAA==","o":"1212121111111121121122112112111212111211211112111111111111111111111111111111111111"},"urate":{"name":"Uric acid","el":"O C N C O C N C O N C N H H H H","xyz":"wP6AAAAALP9GAAAAMP+6/wAArP94/wAAsf/+/gAAJADK/wAAqACk/wAA9QAZAAAAbAEfAAAAnACEAAAAHABPAAAAo/+RAAAA2v6E/wAAzQBI/wAAtQDkAAAAnf/2AAAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAHAAkACQAKAAUACgAKAAsAAQALAAIADAAGAA0ACQAOAAsADwA=","o":"21121112112111111"},"aspirin":{"name":"Aspirin","el":"C C O O C C C C C C C O O H H H H H H H H","xyz":"tgCl/2L/4QC9//P/VwHO/w0AgADA/1oA+P/B/zAAwP9G/y8ANf8z/wcA7f6e/+L/K/8kAOP/q/84AAgA4v/GAAUAmv8lAeL/ZQDvACkAegD6/z//egBK/1z/DgGb/yP//f/x/k4ACP/Q/gcAhf6T/8T/6f51AMT/dgBPAScA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkABAAJAAkACgAKAAsACgAMAAAADQAAAA4AAAAPAAUAEAAGABEABwASAAgAEwAMABQA","o":"121121212112111111111"},"creatine":{"name":"Creatine","el":"C N C C O O C N N H H H H H H H H H","xyz":"rP82/wYAyv/C/yMARgDk/2cArgASAAAAwACJAO3/+ACy/7b/a/8qAP3/7v4HALn/hP+mABcA8//2/jwAR/8e/yUAt/8k/5v/bACM/5sANQA0AK8AHwFq/+r/2f6n/6T/rf5QAJ//Qv/tAPz/","b":"AAABAAEAAgACAAMAAwAEAAMABQABAAYABgAHAAYACAAAAAkAAAAKAAAACwACAAwAAgANAAUADgAHAA8ABwAQAAgAEQA=","o":"11121112111111111"},"lactate":{"name":"Lactate","el":"C C O C O O H H H H H H","xyz":"kwBsAND/SwAHACkAgACG/xIAtv8IAAgAdP9tABcAd/+S/9f/nQDLAAUAWgB8AHT/9gBHALf/WQAiAJEAlwB8/7T/m/9v/4P/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAABAAkAAgAKAAUACwA=","o":"11121111111"},"creatinine":{"name":"Creatinine","el":"C N C C O N C N H H H H H H H","xyz":"M/+QAAAArf9DAAAAMwB8AAAAkwAFAAAACgELAAAAQwCM/wAAt/+z/wAAVf9i/wAAM//WAFQA3f5NAAkAKv/IAKP/QwC4AKf/QwC4AFkAZQAv/wAAY//+/gAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYAAQAGAAYABwAAAAgAAAAJAAAACgACAAsAAgAMAAUADQAHAA4A","o":"111211121111111"},"gly":{"name":"Glycine","el":"N C C O O H H H H H","xyz":"vQDw/wsAUABOAPL/yv8FAP7/Y/9FAAkAxv93//v/DQEiAC8A1gDC/7X/WwB4AI7/VACfADwA8/9K/0QA","b":"AAABAAEAAgACAAMAAgAEAAAABQAAAAYAAQAHAAEACAAEAAkA","o":"112111111"},"urea":{"name":"Urea","el":"N C N O H H H H","xyz":"gv9DAAAAAAD6/wAAfgBDAAAAAACA/wAAgv+oAAAAKv8RAAAAfgCoAAAA1gARAAAA","b":"AAABAAEAAgABAAMAAAAEAAAABQACAAYAAgAHAA==","o":"1121111"},"co2":{"name":"CO₂","el":"O C O","xyz":"hv8AAAAAAAAAAAAAegAAAAAA","b":"AAABAAEAAgA=","o":"22"},"nh3":{"name":"Ammonia","el":"N H H H","xyz":"GQAEAAMA8/9JAMP/6f8LAFwACwCo/93/","b":"AAABAAAAAgAAAAMA","o":"111"},"h2co3":{"name":"Carbonic acid","el":"O C O O H H","xyz":"hf9CAAAAAAD7/wAAAACB/wAAewBCAAAANf8MAAgAdwCfAB0A","b":"AAABAAEAAgABAAMAAAAEAAMABQA=","o":"12111"},"methanol":{"name":"Methanol","el":"C O H H H H","xyz":"5//5/xwAGwD0/5j/k/8/AB8ANQAbAGAAxf+W/zkAcAAjAJT/","b":"AAABAAAAAgAAAAMAAAAEAAEABQA=","o":"11111"},"hco3":{"name":"Bicarbonate","el":"O C O O H","xyz":"hf9CAAAAAAD7/wAAAACB/wAAewBCAAAAi/+iAPT/","b":"AAABAAEAAgABAAMAAAAEAA==","o":"1211"}});


// @scene nitrogen makeNitrogen | Азот крови, буферы и кислотно-основное состояние | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ОСТАТОЧНЫЙ АЗОТ И КОС: небелковый азот крови (мочевина, креатинин, мочевая кислота, аминокислоты, аммиак)
   при болезнях почек и печени; буферные системы (гидрокарбонатная в открытой и закрытой системе, фосфатная, белковая);
   нарушения кислотно-основного состояния и их компенсация (pH, pCO₂, HCO₃⁻)
   ========================================================= */
function makeNitrogen() {
  __set_rnd(mulberry(9401));
  const scene = bioStage({ rim: 0x9fe0ff });
  const VIEW = { npn: [V3(-1.4, -1.5, 0), V3(-1.0, 0.4, 15.5)], buffer: [V3(38.5, -1.4, 0), V3(38.9, 0.7, 13.5)], abg: [V3(79.5, 1.2, 0), V3(80.0, 2.4, 12.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.npn[1]);
  const controls = makeControls(camera, VIEW.npn[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };

  /* ---------- 1. остаточный азот: кровь → клубочек → моча ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const VES = new THREE.CatmullRomCurve3([V3(-5.2, 0.4, 0), V3(-2.5, 0.6, 0), V3(0.4, 0.3, 0), V3(1.6, 0.9, 0.3), V3(2.5, 1.4, 0), V3(3.2, 0.7, -0.3), V3(2.6, -0.1, 0.2), V3(3.4, -0.6, 0), V3(5.2, -0.7, 0)]);
  const vesM = new THREE.Mesh(new THREE.TubeGeometry(VES, 200, 0.55, 20, false), glassMat('#FF8A8A', { rim: 0.8, base: 0.05, keep: true })); G1.add(vesM);
  const caps = new THREE.Mesh(new THREE.SphereGeometry(1.55, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.62), glassMat('#F2E6C8', { rim: 0.8, base: 0.04, keep: true })); caps.position.set(2.75, 0.45, 0); caps.rotation.z = -0.4; G1.add(caps);
  const tub = new THREE.CatmullRomCurve3([V3(3.6, -0.6, -0.6), V3(4.0, -1.6, -0.4), V3(3.6, -2.6, 0), V3(4.6, -3.2, 0.2)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(tub, 60, 0.28, 14, false), glassMat('#F2D27A', { rim: 0.7, base: 0.05, keep: true })));
  const NP = [
    { id: 'urea', m: 'urea', col: '#7FD6FF', n0: 9, filt: 1, name: 'urea' },
    { id: 'aa', m: 'gly', col: '#7FE0A0', n0: 4, filt: 0.1, name: 'amino acids' },
    { id: 'urate', m: 'urate', col: '#F2C14E', n0: 3, filt: 0.6, name: 'uric acid' },
    { id: 'crea', m: 'creatinine', col: '#C77DFF', n0: 2, filt: 1, name: 'creatinine' },
    { id: 'nh3', m: 'nh3', col: '#FF6A5A', n0: 1, filt: 0.4, name: 'ammonia' },
  ];
  const MOLS = [];
  NP.forEach((k) => { for (let i = 0; i < 26; i++) { const g = fit(k.m, k.id === 'urea' || k.id === 'nh3' ? 0.22 : 0.3); g.visible = false; G1.add(g); MOLS.push({ k, g, t: rnd(), r: rnd() * 0.32, a: rnd() * 6.28, v: 0.04 + rnd() * 0.03, out: false, ot: 0 }); } });

  /* ---------- 2. буферы ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const beaker = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 3.2, 48, 1, true), glassMat('#C8E8FF', { rim: 0.9, base: 0.04, keep: true })); beaker.position.y = -0.2; G2.add(beaker);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 2.6, 48), new THREE.MeshPhysicalMaterial({ color: 0x1a3a5a, transparent: true, opacity: 0.25, roughness: 0.1, depthWrite: false })); water.position.y = -0.5; G2.add(water);
  const HCO = Array.from({ length: 14 }, () => { const g = fit('hco3', 0.3); G2.add(g); return { g, p: V3(rand(-1.5, 1.5), rand(-1.6, 0.5), rand(-1.2, 1.2)), kind: 'b', t: 0 }; });
  const HP = Array.from({ length: 30 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: '#FF5A4A' })); s.visible = false; G2.add(s); return { s, on: false, p: V3(0, 0, 0), v: V3(0, 0, 0) }; });
  const OH = Array.from({ length: 20 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: '#7FD6FF' })); s.visible = false; G2.add(s); return { s, on: false, p: V3(0, 0, 0), v: V3(0, 0, 0) }; });
  const BUB = Array.from({ length: 24 }, () => { const g = fit('co2', 0.18); g.visible = false; G2.add(g); return { g, on: false, p: V3(0, 0, 0) }; });
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(2.08, 2.08, 0.1, 48), new THREE.MeshPhysicalMaterial({ color: 0x8090a0, roughness: 0.4, transparent: true, opacity: 0.85 })); lid.position.y = 1.45; G2.add(lid);
  const h2co3M = fit('h2co3', 0.45); h2co3M.position.set(2.9, 0.8, 0); G2.add(h2co3M); const hco3M = fit('hco3', 0.45); hco3M.position.set(2.9, -0.6, 0); G2.add(hco3M);

  /* ---------- 3. нарушения КОС ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  bodyShell(G3, { rim: 0.14, keep: true, legs: false });
  const LUN = [V3(0.42, 2.35, 0.05), V3(-0.42, 2.35, 0.05)], KID = [V3(0.33, 1.12, -0.12), V3(-0.33, 1.12, -0.12)];
  const lungM = LUN.map((p) => { const m = new THREE.Mesh(ell3(0.32, 0.52, 0.24, V3(0, 0, 0)), organMat('#E890A0', 0.4, { transparent: true, opacity: 0.6 })); m.position.copy(p); G3.add(m); return m; });
  KID.forEach((p) => G3.add(new THREE.Mesh(ell3(0.13, 0.22, 0.1, p), organMat('#9A4A4A', 0.5))));
  const kidG = glowNucleus(G3, KID[0].clone().add(V3(0, 0, 0.12)), '#7FD6FF', 0.035, 10), lunG = glowNucleus(G3, V3(0, 2.75, 0.2), '#F2E6C8', 0.04, 10);
  const co2out = flowArrow(G3, V3(0, 2.75, 0.25), V3(0, 3.75, 0.35), '#C8C8D0', { bend: 0.0, r: 0.016 });
  const hout = flowArrow(G3, KID[1].clone().add(V3(0.05, -0.2, 0.12)), V3(-0.05, -0.2, 0.25), '#FF5A4A', { bend: 0.2, r: 0.014 });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'npn', labels: true, rot: false, fly: null, msg: null, npn: 'norm', open: true, pH: 7.4, HCO3: 24, H2CO3: 1.2, added: 0, dis: 'norm', comp: false, pCO2: 40, bic: 24, vent: 1, hist: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['npn', 'buffer', 'abg'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const NPNS = { norm: { urea: 1, aa: 1, urate: 1, crea: 1, nh3: 1, gfr: 1 }, renal: { urea: 3.2, aa: 1.1, urate: 1.8, crea: 4.5, nh3: 1.2, gfr: 0.2 }, liver: { urea: 0.4, aa: 1.8, urate: 1, crea: 1, nh3: 4, gfr: 1 }, catab: { urea: 1.8, aa: 1.3, urate: 1.2, crea: 1.1, nh3: 1.3, gfr: 1 }, gout: { urea: 1, aa: 1, urate: 2.3, crea: 1, nh3: 1, gfr: 1 } };
  const NORM = { urea: '2.5–8.3 mmol/L', crea: '60–110 µmol/L', urate: '150–420 µmol/L', nh3: '11–35 µmol/L', aa: '2–5 mmol/L' };

  function npnUpdate(dt, t) {
    const S = NPNS[st.npn];
    NP.forEach((k) => { const want = Math.min(26, Math.round(k.n0 * S[k.id] * 1.4)); const list = MOLS.filter((m) => m.k === k); list.forEach((m, i) => { m.on = i < want; }); });
    MOLS.forEach((m, i) => {
      if (!m.on && !m.out) { m.g.visible = false; return; }
      m.g.visible = G1.visible;
      if (m.out) { m.ot += dt * 0.25; if (m.ot >= 1) { m.out = false; m.ot = 0; m.t = 0; return; } m.g.position.copy(tub.getPoint(m.ot)).add(V3(0, 0, 0.05)); m.g.rotation.y += dt; return; }
      m.t += dt * m.v * (0.6 + 0.4 * S.gfr); if (m.t > 1) m.t -= 1;
      // фильтрация в клубочке (участок 0.55–0.75 трубки)
      if (m.t > 0.6 && m.t < 0.62 && rnd() < m.k.filt * S.gfr * 0.5) { m.out = true; m.ot = 0; fx.spawn(VES.getPoint(m.t), V3(0.2, -0.4, 0), C.set(m.k.col), 0.5, 0.6, 1); return; }
      const p = VES.getPoint(m.t), tg = VES.getTangent(m.t); const nrm = V3(0, 0, 1).cross(tg).normalize(); const bn = tg.clone().cross(nrm);
      m.g.position.copy(p).addScaledVector(nrm, Math.cos(m.a + t * 0.5) * m.r).addScaledVector(bn, Math.sin(m.a + t * 0.5) * m.r); m.g.rotation.x += dt * 0.7;
    });
  }
  function bufferUpdate(dt, t) {
    // H⁺ + HCO₃⁻ ⇄ H₂CO₃ ⇄ CO₂ + H₂O; в открытой системе лёгкие удаляют CO₂
    HP.forEach((h) => { if (!h.on) return; h.p.addScaledVector(h.v, dt); h.v.y -= dt * 0.6; h.v.multiplyScalar(1 - dt * 0.8); if (h.p.y < -1.6) h.v.y = Math.abs(h.v.y);
      const b = HCO.find((x) => x.kind === 'b' && x.p.distanceTo(h.p) < 0.45);
      if (b && st.HCO3 > 0.5) { b.kind = 'a'; b.t = 0; h.on = false; h.s.visible = false; st.HCO3 -= 1.2; st.H2CO3 += 1.2; }
      h.s.position.copy(h.p); });
    OH.forEach((o) => { if (!o.on) return; o.p.addScaledVector(o.v, dt); o.v.y -= dt * 0.6; o.v.multiplyScalar(1 - dt * 0.8); o.s.position.copy(o.p); o.t = (o.t || 0) + dt; if (o.t > 1.2 && st.H2CO3 > 0.3) { o.on = false; o.s.visible = false; st.H2CO3 -= 1.2; st.HCO3 += 1.2; const a = HCO.find((x) => x.kind === 'a'); if (a) { a.kind = 'b'; } } });
    HCO.forEach((b, i) => {
      b.t += dt; b.p.x += Math.sin(t * 0.7 + i) * dt * 0.12; b.p.y += Math.cos(t * 0.5 + i * 1.3) * dt * 0.08; b.p.clampScalar(-1.6, 1.6); b.p.y = clamp(b.p.y, -1.7, 0.6);
      b.g.position.copy(b.p); b.g.rotation.y += dt * 0.6;
      // H₂CO₃ разлагается: CO₂ уходит пузырьком (если система открыта) или остаётся
      if (b.kind === 'a' && b.t > 1.5) { const bub = BUB.find((x) => !x.on); if (bub && st.open) { bub.on = true; bub.p.copy(b.p); bub.g.visible = true; st.H2CO3 = Math.max(0.6, st.H2CO3 - 1.0); } b.kind = st.open ? 'gone' : 'a'; }
      b.g.visible = b.kind !== 'gone'; b.g.scale.setScalar(b.kind === 'a' ? 1.25 : 1);
    });
    BUB.forEach((b) => { if (!b.on) return; b.p.y += dt * 1.1; b.p.x += Math.sin(t * 3 + b.p.y) * dt * 0.1; b.g.position.copy(b.p); if (b.p.y > 2.4) { b.on = false; b.g.visible = false; } });
    lid.visible = !st.open;
    if (st.open) st.H2CO3 += (1.2 - st.H2CO3) * Math.min(1, dt * 1.2);   // лёгкие держат pCO₂ постоянным
    // pH по уравнению Гендерсона — Гассельбальха: 6,1 + lg(HCO₃⁻ / H₂CO₃)
    st.pH = 6.1 + Math.log10(Math.max(0.5, st.HCO3) / Math.max(0.05, st.H2CO3));
    water.material.color.set(st.pH < 7.2 ? '#5a2a3a' : st.pH > 7.55 ? '#2a3a6a' : '#1a3a5a');
    h2co3M.rotation.y += dt * 0.4; hco3M.rotation.y += dt * 0.4;
    if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.1) { st.hist.push([st.t, st.pH]); while (st.hist.length && st.t - st.hist[0][0] > 30) st.hist.shift(); }
  }
  const DIS = {
    norm: { name: 'Normal', u: [40, 24], c: [40, 24] },
    macid: { name: 'Metabolic acidosis', u: [40, 12], c: [26, 12] },
    malk: { name: 'Metabolic alkalosis', u: [40, 36], c: [48, 36] },
    racid: { name: 'Respiratory acidosis', u: [70, 26], c: [70, 34.5] },
    ralk: { name: 'Respiratory alkalosis', u: [25, 23], c: [25, 16.5] },
  };
  function abgUpdate(dt, t) {
    const D = DIS[st.dis], tg = st.comp ? D.c : D.u;
    const resp = st.dis === 'racid' || st.dis === 'ralk';
    // дыхательная компенсация быстрая (минуты), почечная — медленная (дни)
    st.pCO2 += (tg[0] - st.pCO2) * Math.min(1, dt * (resp ? 1.5 : 0.8));
    st.bic += (tg[1] - st.bic) * Math.min(1, dt * (resp ? 0.25 : 1.2));
    st.pH = 6.1 + Math.log10(st.bic / (0.0307 * st.pCO2));
    st.vent = 40 / st.pCO2;   // вентиляция обратно пропорциональна pCO₂
    const br = 0.25 + 0.3 * st.vent;
    lungM.forEach((m) => { const s = 1 + 0.07 * st.vent * Math.sin(t * Math.PI * 2 * br); m.scale.setScalar(s); });
    co2out.mat.uniforms.uOn.value = clamp(0.25 * st.vent, 0.06, 1); co2out.mat.uniforms.uTime.value = t;
    const hEx = clamp(0.4 + (24 - st.pH * 0 - (st.pH - 7.4) * 6) * 0 + (7.4 - st.pH) * 3, 0.05, 1.2); hout.mat.uniforms.uOn.value = hEx; hout.mat.uniforms.uTime.value = t;
    kidG.spr.material.opacity = 0.15 + 0.5 * clamp(hEx, 0, 1); lunG.spr.material.opacity = 0.1 + 0.4 * clamp(st.vent / 1.8, 0, 1);
    if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.1) { st.hist.push([st.t, st.pH, st.pCO2, st.bic]); while (st.hist.length > 400) st.hist.shift(); }
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'npn') npnUpdate(dt, t);
    if (st.mode === 'buffer') bufferUpdate(dt, t);
    if (st.mode === 'abg') abgUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'buffer') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'Solution pH · 30 s (normal blood 7.35–7.45)', xl: 'time →' });
      const Y = (v) => A.Y(clamp((v - 6.6) / 1.4, 0, 1)); ctx.fillStyle = 'rgba(127,224,160,.12)'; ctx.fillRect(A.X(0), Y(7.45), A.X(1) - A.X(0), Y(7.35) - Y(7.45));
      ctx.strokeStyle = '#FF8A5C'; ctx.lineWidth = 2; ctx.beginPath(); const t1 = st.t; st.hist.forEach((r, i) => { const x = A.X(clamp((r[0] - (t1 - 30)) / 30, 0, 1)), y = Y(r[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      return;
    }
    if (st.mode === 'abg') {
      // диаграмма Дэвенпорта: pH по горизонтали, HCO₃⁻ по вертикали, изобары pCO₂
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'pH — HCO₃⁻, pCO₂ lines 20…80', x0: 24 });
      const X = (ph) => A.X(clamp((ph - 7.0) / 0.8, 0, 1)), Y = (b) => A.Y(clamp((b - 8) / 34, 0, 1));
      [20, 40, 60, 80].forEach((p) => { ctx.strokeStyle = p === 40 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.14)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const ph = 7.0 + i / 40 * 0.8, b = 0.0307 * p * 10 ** (ph - 6.1); i ? ctx.lineTo(X(ph), Y(b)) : ctx.moveTo(X(ph), Y(b)); } ctx.stroke(); });
      ctx.fillStyle = 'rgba(127,224,160,.15)'; ctx.fillRect(X(7.35), Y(26), X(7.45) - X(7.35), Y(22) - Y(26));
      ctx.strokeStyle = '#FF8A5C'; ctx.lineWidth = 1.5; ctx.beginPath(); st.hist.slice(-200).forEach((r, i) => { const x = X(r[1]), y = Y(r[3]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      ctx.fillStyle = '#FFD98A'; ctx.beginPath(); ctx.arc(X(st.pH), Y(st.bic), 4, 0, Math.PI * 2); ctx.fill();
      return;
    }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'non-protein nitrogen: fraction of normal', x0: 10 });
    const S = NPNS[st.npn]; NP.forEach((k, i) => { const y = 22 + i * (h - 34) / NP.length, v = S[k.id]; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(A.X(0), y, A.X(1) - A.X(0), 6); ctx.fillStyle = k.col; ctx.fillRect(A.X(0), y, (A.X(1) - A.X(0)) * clamp(v / 5, 0, 1), 6); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(A.X(0.2), y - 2, 1, 10); });
  }

  const NPNTXT = {
    norm: '<b>Non-protein (residual) nitrogen</b> is the nitrogen of everything left in the blood after the proteins are precipitated: about 14–28 mmol/L. Half of it is <b>urea</b> (made by the liver from ammonia); the rest is amino acids, <b>uric acid</b> (from purine breakdown), <b>creatinine</b> (from muscle creatine phosphate, produced at an almost constant rate) and a little ammonia. Nearly all of it is filtered in the renal glomerulus and leaves in the urine. Creatinine and urea are the main markers of kidney function.',
    renal: '<b>Renal failure</b> causes retention azotemia: the glomeruli filter too little, and urea and creatinine build up in the blood (creatinine especially; it is used to estimate the glomerular filtration rate, GFR). Uric acid rises too, and potassium, phosphate and acids are retained, causing acidosis. In severe cases this is uremia, and dialysis is needed.',
    liver: '<b>Liver failure</b>: the liver cannot convert ammonia into urea, so urea <b>falls</b> while ammonia and amino acids rise. Ammonia is toxic to the brain, causing hepatic encephalopathy (confusion, “flapping” tremor — asterixis, coma).',
    catab: '<b>Protein breakdown</b> (starvation, severe burns, fever, bleeding into the gut, glucocorticoid therapy) causes production azotemia: more urea is made; the kidneys cope, but its level still rises.',
    gout: '<b>Gout</b>: there is more uric acid than can stay dissolved. Above ~420 µmol/L, monosodium urate crystals deposit in the joints (an attack of pain in the big toe) and form stones in the kidneys.',
  };
  const BTXT = {
    open: '<b>The bicarbonate buffer</b> is the main buffer of the extracellular fluid: H⁺ + HCO₃⁻ ⇄ H₂CO₃ ⇄ CO₂ + H₂O. Add acid: the red H⁺ ions are captured by bicarbonate, forming carbonic acid, which breaks down, and <b>CO₂ is exhaled by the lungs</b> (the bubbles). The system is open — the product leaves, so the pH barely changes. The kidneys then regenerate HCO₃⁻ and excrete H⁺ in the urine. pH = 6.1 + log([HCO₃⁻] / 0.03·pCO₂).',
    closed: '<b>Closed system</b> (lid on): CO₂ cannot escape, carbonic acid accumulates, and the same buffer holds the pH much less well. This is what happens with poor breathing: when ventilation stops, the bicarbonate buffer is almost useless. Its strength lies in its partnership with the lungs.',
  };
  const ABGTXT = {
    norm: '<b>Acid–base balance</b> of the blood: pH 7.35–7.45, pCO₂ 35–45 mmHg (set by breathing), HCO₃⁻ 22–26 mmol/L (set by the kidneys and metabolism). A shift in one component is partly offset by the other — <b>compensation</b>: the lungs change pCO₂ within minutes, the kidneys change HCO₃⁻ over 3–5 days. The diagram on the right shows the path of the (pH, HCO₃⁻) point.',
    macid: '<b>Metabolic acidosis</b>: acids accumulate or HCO₃⁻ is lost — diabetic ketoacidosis, lactate in shock, renal failure, diarrhea, methanol poisoning. HCO₃⁻ falls. Compensation is rapid, deep (Kussmaul) breathing: pCO₂ falls and the pH rises toward normal.',
    malk: '<b>Metabolic alkalosis</b>: loss of acid (vomiting, gastric suction) or excess base (diuretics, too much bicarbonate). HCO₃⁻ rises. Compensation: breathing slows and pCO₂ rises (only to a limited extent, because of the resulting lack of oxygen).',
    racid: '<b>Respiratory acidosis</b>: CO₂ is not removed — COPD, a severe asthma attack, respiratory depression (opioids, anesthesia), respiratory muscle weakness. pCO₂ rises. Compensation: over several days the kidneys retain HCO₃⁻ and excrete more H⁺.',
    ralk: '<b>Respiratory alkalosis</b>: too much CO₂ is exhaled — panic and hyperventilation, high altitude, fever, early aspirin poisoning. pCO₂ falls; tingling and cramps may occur (ionized calcium falls). Compensation: the kidneys excrete HCO₃⁻.',
  };
  const labels = [
    ...NP.map((k, i) => ({ text: k.name, pos: V3(-4.9 + i * 1.05, -0.65 - (i % 2) * 0.35, 0.4), color: k.col, show: () => st.labels && st.mode === 'npn' })),
    { text: 'blood', pos: V3(-3.4, 1.25, 0.4), color: '#FF8A8A', show: () => st.labels && st.mode === 'npn' },
    { text: 'glomerulus', pos: V3(2.6, 2.15, 0.3), color: '#F2E6C8', show: () => st.labels && st.mode === 'npn' },
    { text: 'glomerular filtrate', pos: V3(4.35, -2.0, 0.3), color: '#F2D27A', show: () => st.labels && st.mode === 'npn' },
    { text: 'HCO₃⁻', pos: V3(40 + 3.35, -0.75, 0.3), color: '#9FE0FF', show: () => st.labels && st.mode === 'buffer' },
    { text: 'H₂CO₃', pos: V3(40 + 3.35, 0.65, 0.3), color: '#C8C8D0', show: () => st.labels && st.mode === 'buffer' },
    { text: 'CO₂ → lungs', pos: V3(40 + 0.4, 2.0, 0.3), color: '#C8C8D0', show: () => st.labels && st.mode === 'buffer' && st.open },
    { text: 'H⁺', pos: V3(40 - 1.0, 2.0, 0.3), color: '#FF5A4A', show: () => st.labels && st.mode === 'buffer' },
    { text: 'lungs: CO₂', pos: V3(80 + 0.9, 2.75, 0.2), color: '#E890A0', show: () => st.labels && st.mode === 'abg' },
    { text: 'kidneys: H⁺ and HCO₃⁻', pos: KID[0].clone().add(V3(80.25, -0.1, 0.2)), color: '#7FD6FF', show: () => st.labels && st.mode === 'abg' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'npn' ? NPNTXT[st.npn] : st.mode === 'buffer' ? BTXT[st.open ? 'open' : 'closed'] : ABGTXT[st.dis]); };
    refs.modeSeg = seg([{ id: 'npn', label: 'Non-protein nitrogen' }, { id: 'buffer', label: 'Buffers' }, { id: 'abg', label: 'Acid–base disorders' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    const addAcid = () => { for (let i = 0; i < 4; i++) { const h0 = HP.find((x) => !x.on); if (!h0) break; h0.on = true; h0.s.visible = true; h0.p.set(rand(-1.2, 1.2), 1.9, rand(-0.8, 0.8)); h0.v.set(rand(-0.3, 0.3), -0.8, rand(-0.3, 0.3)); } if (st.HCO3 < 1) { st.H2CO3 += 1; } };
    const addBase = () => { for (let i = 0; i < 4; i++) { const o = OH.find((x) => !x.on); if (!o) break; o.on = true; o.t = 0; o.s.visible = true; o.p.set(rand(-1.2, 1.2), 1.9, rand(-0.8, 0.8)); o.v.set(rand(-0.3, 0.3), -0.8, rand(-0.3, 0.3)); } };
    const reset = () => { st.HCO3 = 24; st.H2CO3 = 1.2; HCO.forEach((b) => { b.kind = 'b'; }); HP.forEach((h0) => { h0.on = false; h0.s.visible = false; }); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'npn') box.append(h('div', { class: 'glabel' }, 'State'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Normal' }, { id: 'renal', label: 'Renal failure' }, { id: 'liver', label: 'Liver failure' }, { id: 'catab', label: 'Protein breakdown' }, { id: 'gout', label: 'Gout' }], () => st.npn, (v) => { st.npn = v; refs.setInfo(); })));
      else if (st.mode === 'buffer') box.append(h('div', { class: 'glabel' }, 'Experiment'), h('div', { class: 'gctl' }, button('Add acid', addAcid, true), button('Add base', addBase), toggle('Open system', () => st.open, (v) => { st.open = v; refs.setInfo(); }), button('Reset', reset)));
      else box.append(h('div', { class: 'glabel' }, 'Disorder'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, d]) => ({ id, label: d.name })), () => st.dis, (v) => { st.dis = v; st.comp = false; refs.rebuild(); refs.setInfo(); }), st.dis !== 'norm' ? toggle('Compensation', () => st.comp, (v) => { st.comp = v; }) : null));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['npn', 'buffer', 'abg'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f2 = (v) => v.toFixed(2).replace('.', ','), f0 = (v) => Math.round(v);
  function stats() {
    if (st.mode === 'buffer') return [['pH', f2(st.pH), ''], ['HCO₃⁻', f0(st.HCO3), 'a.u.'], ['H₂CO₃', f2(st.H2CO3).replace(',00', ''), 'a.u.']];
    if (st.mode === 'abg') return [['pH', f2(st.pH), ''], ['pCO₂', f0(st.pCO2), 'mmHg'], ['HCO₃⁻', f0(st.bic), 'mmol/L']];
    const S = NPNS[st.npn]; return [['Urea', (5.5 * S.urea).toFixed(1).replace('.', ','), 'mmol/L'], ['Creatinine', f0(85 * S.crea), 'µmol/L'], ['Uric acid', f0(300 * S.urate), 'µmol/L']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#9FE0FF',
    kicker: 'Biochemistry · blood', title: 'Blood nitrogen and acid–base',
    lede: 'From a few numbers from a test tube — urea, creatinine, pH and CO₂ — a doctor can see how the kidneys, liver and lungs are working.',
    notes: `
      <div><h2>Non-protein nitrogen and acid–base balance</h2>
        <p>Blood <b>non-protein (residual) nitrogen</b> is 14–28 mmol/L: urea (~50%), amino acids (~25%), uric acid, creatine and creatinine, ammonia, bilirubin, indican. Azotemia can be <b>retention</b> azotemia (the kidneys fail to excrete) or <b>production</b> azotemia (too much is formed).</p>
        <h3>Blood buffer systems</h3><ul><li><b>Bicarbonate</b> (HCO₃⁻/H₂CO₃, pKₐ 6.1): ~55% of the blood’s buffer capacity; works together with the lungs and kidneys.</li><li><b>Hemoglobin</b> (~35%): deoxyhemoglobin binds H⁺ — the Bohr effect.</li><li><b>Protein</b> (plasma proteins) and <b>phosphate</b> (HPO₄²⁻/H₂PO₄⁻, pKₐ 6.8), the main buffer inside cells and in urine.</li></ul>
        <h3>Kidneys</h3><p>They reabsorb all the filtered HCO₃⁻ and generate new HCO₃⁻ by excreting H⁺ as titratable acids (phosphates) and as ammonium ions NH₄⁺ (from glutamine).</p></div>
      <div><h2>Simplifications</h2><ul><li>Molecules follow their chemical formulas; the number of molecules on screen is arbitrary (proportional to concentration).</li><li>The buffer beaker is a qualitative model; acid–base values in the disorders are typical examples, and compensation is shown in accelerated time.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('npn'); st.fly = null;
  return self;
}
export { makeNitrogen };
