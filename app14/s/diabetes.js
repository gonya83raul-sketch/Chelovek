import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, MOL, PDB, bioStage, blobGeo, caPoints, flowArrow, molFit, molMesh, plotAxes, protMat, proteinMesh } from './kit.js';
Object.assign(BIO_MOL, {"glucose":{"name":"Глюкоза","el":"O C C O C O C O C O C O H H H H H H H H H H H H","xyz":"2f4oAEkABv8gAMP/n/8WALz/2P+SAOP/XQCPAA8AYACYAJ4ArwAWAOP/zQAgAFj/agCR/wAAnwBa/3gA0/+g/w8AlP8o/+T/eP4kAEsA2v7J/5P/5v55AI3/uv8DAFP/kADqAOn/uQC0ALoADwEYABoAjgBcAC7/fwBM/67/uwD//mgAu/+x/3gAQ/8a/xcA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAAIAAkACAAKAAIACgAKAAsAAAAMAAEADQABAA4AAgAPAAQAEAAFABEABgASAAcAEwAIABQACQAVAAoAFgALABcA","o":"111111111111111111111111"},"met":{"name":"Метионин","el":"N C C C S C C O O H H H H H H H H H H H","xyz":"8f9R/+H/OwDE/6//2/8tAHn/rv+RAOL/T/89AGMA0/7V/xIAmgD4/xoAgwDi/5AADgFBAPX/rP80/53/MQAF//T/eACg/1r/CwBiACf/gv/6/1D/AgDGAA4Abf/bALL/9P5u/xQAxf72/6v/dP7e/0gA/gCVAMb/","b":"AAABAAEAAgACAAMAAwAEAAQABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAMADgADAA8ABQAQAAUAEQAFABIACAATAA==","o":"1111112111111111111"},"glibenclamide":{"name":"Глибенкламид","el":"C O C C C C Cl C C C O N C C C C C C C C S O O N C O N C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"a/3rAF4A7f3vAJcAWv7tADsAhf5pARsA8/5+Ab7/Lf8TAYf/tP8oARX//v6MAKn/mf52AP//cf7l/xsAFv7E/2cAs/5y/93/hv7q/v7/1/6C/rH/bf+V/sv/u/+//mX/TADS/nz/eAC5/vX/KQCN/mUApf97/lAAOgHT/hQAYAGx/rEAkQFo/rj/dgGJ/+r/LAHt/zEA0QDM/34ARwF8ACIAsAGrAMn/NQKxABYAXAJBATkA5AGSAWsAdgGcAQEAiQE1AZH/Jv0kAZ0ASv2DAFkAbv0WAfr/U/6+AUoAFf/jAaX/M/87AHj///57/5z/Hf7h/uP/kv7a/mkAxP6M/kb/uv4e/tH/kP/S/gP/jAD0/iv/UwB5/sgAZf9Z/qEAwAGI/6v/DwG+AFYAuwFmAHX/KwJ4AHMAgwKEANn/qQI/AYYAhAJxAd//BQL2AYYAuwFhAcQAeQEAAtX/FQGMATAA2AFXAU7/LAErAVn/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAACAAgACAAJAAkACgAJAAsACwAMAAwADQANAA4ADgAPAA8AEAAQABEAEQASABIAEwAOABMAEQAUABQAFQAUABYAFAAXABcAGAAYABkAGAAaABoAGwAbABwAHAAdAB0AHgAeAB8AHwAgABsAIAAAACEAAAAiAAAAIwADACQABAAlAAcAJgALACcADAAoAAwAKQANACoADQArAA8ALAAQAC0AEgAuABMALwAXADAAGgAxABsAMgAcADMAHAA0AB0ANQAdADYAHgA3AB4AOAAfADkAHwA6ACAAOwAgADwA","o":"112121121121111212121122112111111111111111111111111111111111111"},"sorbitol":{"name":"Сорбит","el":"O C C O C O C O C O C O H H H H H H H H H H H H H H","xyz":"of7L/7H/EP9+/9v/b//I/zcALv8ZAJcA0P8UAN//nf+IAKH/RgAxADoASACyAG8AxwAcAO3/0QBRAGz/2QCE/+j/RgFn/zwAgf6r/1v/Rv9b/4L/6v4l/xAApP94/24AOv/0/+8A8v/Q/4//QP+XALb/SADr/48AgQC3AL0AGQFGACkALQFjAFX/7wBl/4L/fwBS/wsAlQGY/yAA","b":"AAABAAEAAgACAAMAAgAEAAQABQAEAAYABgAHAAYACAAIAAkACAAKAAoACwAAAAwAAQANAAEADgACAA8AAwAQAAQAEQAFABIABgATAAcAFAAIABUACQAWAAoAFwAKABgACwAZAA==","o":"1111111111111111111111111"}});


// @scene diabetes makeDiabetes | Инсулин и сахарный диабет | Гормоны
/* =========================================================
   БИОХИМИЯ · ИНСУЛИН И ДИАБЕТ: секреция инсулина β-клеткой (GLUT2, глюкокиназа, K-АТФ-канал, Ca²⁺, экзоцитоз,
   сульфонилмочевина, агонист GLP-1), сутки при диабете 1 и 2 типа и действие лекарств,
   осложнения: гликирование гемоглобина (HbA1c) и сорбитоловый путь в хрусталике
   ========================================================= */
function makeDiabetes() {
  __set_rnd(mulberry(8601));
  const scene = bioStage({ rim: 0x5b8cff });
  const VIEW = { beta: [V3(-1.5, -1.5, 0), V3(-1.0, -0.3, 20)], day: [V3(39.3, 0.6, 0), V3(39.7, 1.4, 10.5)], glyc: [V3(78.9, -1.9, 0), V3(79.4, -0.8, 17)] };
  const VIEWM = { beta: [V3(0.3, -1.5, 0), V3(0.8, -0.3, 20)], day: [V3(40, 1.0, 0), V3(40.3, 1.6, 8.5)], glyc: [V3(80.6, -0.4, 0), V3(81, 0.4, 14)] }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.beta[1]);
  const controls = makeControls(camera, VIEW.beta[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ball = (r, col, parent) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true })); s.visible = false; parent.add(s); return s; };
  const GLU = '#F2C14E', INS = '#7FD6FF';

  /* ---------- 1. β-клетка ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const RX = 3.4, RY = 2.3;
  const cell = new THREE.Mesh(blobGeo(RX, RY, 1.5, 5, 0.04), glassMat('#FFC8A8', { rim: 0.8, base: 0.04, keep: true })); G1.add(cell);
  const onMem = (deg, k = 1) => { const a = deg * Math.PI / 180; return V3(Math.cos(a) * RX * k, Math.sin(a) * RY * k, 0.25); };
  const nrm = (deg) => { const a = deg * Math.PI / 180; return V3(Math.cos(a) / RX, Math.sin(a) / RY, 0).normalize(); };
  const nuc1 = new THREE.Mesh(new THREE.SphereGeometry(0.75, 30, 20), glassMat('#9F7BFF', { rim: 0.9, base: 0.05, keep: true })); nuc1.position.set(0.5, -1.05, -0.3); G1.add(nuc1);
  const placeOnMem = (obj, deg) => { obj.position.copy(onMem(deg)); obj.quaternion.setFromUnitVectors(V3(0, 1, 0), nrm(deg)); G1.add(obj); return obj; };
  // GLUT2
  const glut2 = placeOnMem(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.5, 14), protMat('#7FE0A0', 0.55, { emissiveIntensity: 0.12 })), 180);
  // глюкокиназа и митохондрии
  const gk = new THREE.Mesh(blobGeo(0.3, 0.25, 0.25, 41, 0.12, 3), protMat(GLU, 0.5, { emissiveIntensity: 0.1 })); gk.position.set(-2.3, -0.35, 0.3); G1.add(gk);
  const MITO = [V3(-1.35, -0.75, 0.2), V3(-0.55, -0.15, 0.4), V3(-1.6, 0.55, 0.1)].map((p, i) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.5, 6, 12), organMat('#FF8A5C', 0.55, { emissiveIntensity: 0.1 })); m.position.copy(p); m.rotation.z = 0.7 + i; G1.add(m); return m; });
  // K-АТФ-канал: 4 Kir6.2 (пора) + 4 SUR1
  const KD = 120, kch = new THREE.Group(); placeOnMem(kch, KD);
  const KIR = [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 + Math.PI / 4; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 10), protMat('#B090FF', 0.6, { emissiveIntensity: 0.15 })); m.userData.a = a; m.position.set(Math.cos(a) * 0.13, 0, Math.sin(a) * 0.13); kch.add(m); return m; });
  const SUR = [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2; const m = new THREE.Mesh(blobGeo(0.13, 0.24, 0.13, 50 + i, 0.1, 3), protMat('#8A9BFF', 0.5, { emissiveIntensity: 0.08 })); m.position.set(Math.cos(a) * 0.33, -0.02, Math.sin(a) * 0.33); kch.add(m); return m; });
  const sulfo = fit('glibenclamide', 0.5); sulfo.visible = false; G1.add(sulfo);
  // Ca²⁺-канал
  const CD = 18; const cach = placeOnMem(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.52, 14), protMat('#5BC8FF', 0.55, { emissiveIntensity: 0.1 })), CD);
  // рецептор GLP-1
  const GD = 255; const glpr = placeOnMem(new THREE.Mesh(blobGeo(0.2, 0.32, 0.2, 61, 0.1, 3), protMat('#C77DFF', 0.5, { emissiveIntensity: 0.06 })), GD);
  // гранулы инсулина
  const NG = 26, GR = [];
  const granGeo = new THREE.SphereGeometry(0.13, 16, 12), coreGeo = new THREE.IcosahedronGeometry(0.065, 0);
  for (let i = 0; i < NG; i++) {
    const g = new THREE.Group(); const halo = new THREE.Mesh(granGeo, new THREE.MeshPhysicalMaterial({ color: 0x40506a, emissive: 0x7fd6ff, emissiveIntensity: 0.06, transparent: true, opacity: 0.45, depthWrite: false, roughness: 0.3 }));
    const core = new THREE.Mesh(coreGeo, new THREE.MeshPhysicalMaterial({ color: 0x806020, emissive: 0x7fd6ff, emissiveIntensity: 0.35, roughness: 0.35 })); g.add(halo, core);
    let p; do { p = V3(rand(0.2, 2.8), rand(-0.6, 1.7), rand(-0.6, 0.7)); } while ((p.x / (RX - 0.45)) ** 2 + (p.y / (RY - 0.45)) ** 2 > 1 || p.distanceTo(nuc1.position) < 0.95);
    g.position.copy(p); G1.add(g);
    const deg = Math.atan2(p.y / RY, p.x / RX) * 180 / Math.PI; GR.push({ g, home: p.clone(), dock: onMem(deg, 0.94), out: onMem(deg, 1.25), k: 0, st: 0 });
  }
  const golgi = new THREE.Group(); golgi.position.set(1.3, 0.1, -0.2); G1.add(golgi);
  for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.4 - k * 0.04, 0.035, 6, 24, Math.PI * 0.9), organMat('#F2D27A', 0.5, { emissiveIntensity: 0.08 })); m.position.y = k * 0.1; m.rotation.z = Math.PI * 0.55; golgi.add(m); }
  // капилляр
  const capC = new THREE.CatmullRomCurve3([V3(4.3, -2.6, -0.2), V3(4.0, 0.0, 0.0), V3(4.25, 2.6, -0.2)]);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(capC, 40, 0.32, 16, false), organMat('#D84A50', 0.5, { transparent: true, opacity: 0.55, depthWrite: false })));
  const gluM = Array.from({ length: 10 }, () => { const m = fit('glucose', 0.2); m.visible = false; G1.add(m); return { m, on: false, t: 0, path: null }; });
  const pGlu = [0, 1, 2].map((k) => new THREE.CatmullRomCurve3([V3(-4.2, -1.6 + k * 0.5, 0.3), V3(-3.8, -0.6 + k * 0.2, 0.3), onMem(180), V3(-2.9, -0.2, 0.3), gk.position.clone()]));
  const ATP = Array.from({ length: 24 }, () => ({ s: ball(0.05, '#FF9A5C', G1), on: false, t: 0, a: V3(0, 0, 0) }));
  const KI = Array.from({ length: 14 }, () => ({ s: ball(0.05, '#C090FF', G1), on: false, t: 0 }));
  const CAI = Array.from({ length: 18 }, () => ({ s: ball(0.045, '#9CFF8A', G1), on: false, t: 0, b: V3(0, 0, 0) }));
  const INSP = Array.from({ length: 50 }, () => ({ s: ball(0.04, INS, G1), on: false, t: 0, a: V3(0, 0, 0), b: V3(0, 0, 0) }));
  const CAMP = Array.from({ length: 10 }, () => ({ s: ball(0.045, '#FF7FD0', G1), on: false, t: 0, b: V3(0, 0, 0) }));

  /* ---------- 2. сутки: тело, органы и лекарства ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.16, keep: true });
  const brain2 = new THREE.Mesh(ell3(0.34, 0.27, 0.36, V3(0, 4.3, 0.02)), glassMat('#C8B8FF', { rim: 0.7, base: 0.04, keep: true })); G2.add(brain2);
  const LIV = V3(-0.35, 1.62, 0.18), PAN = V3(0.2, 1.38, 0.05), GUT = V3(0, 0.75, 0.15), KID = [V3(0.45, 1.25, -0.22), V3(-0.45, 1.2, -0.22)], MUS = [V3(0.48, -0.9, 0.05), V3(-0.48, -0.9, 0.05)], FAT = V3(0, 0.55, 0.42), BLAD = V3(0, 0.05, 0.25);
  const liv2 = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV), organMat('#9A4A3A', 0.5)); G2.add(liv2);
  const pan2 = new THREE.Mesh(ell3(0.34, 0.07, 0.08, PAN), organMat('#E8B070', 0.55)); pan2.rotation.z = 0.2; G2.add(pan2);
  const gut2 = new THREE.Mesh(blobGeo(0.42, 0.3, 0.2, 71, 0.18, 4), organMat('#E0A0A0', 0.45)); gut2.position.copy(GUT); G2.add(gut2);
  const kid2 = KID.map((p) => { const m = new THREE.Mesh(ell3(0.1, 0.17, 0.08, p), organMat('#C05050', 0.55)); G2.add(m); return m; });
  const mus2 = MUS.map((p) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.7, 6, 14), organMat('#C0504A', 0.4, { transparent: true, opacity: 0.7 })); m.position.copy(p); G2.add(m); return m; });
  const fat2 = new THREE.Mesh(ell3(0.55, 0.3, 0.12, FAT), organMat('#F2D08A', 0.5, { transparent: true, opacity: 0.45, depthWrite: false })); G2.add(fat2);
  const blad2 = new THREE.Mesh(ell3(0.14, 0.11, 0.11, BLAD), organMat('#E8D070', 0.5, { transparent: true, opacity: 0.6 })); G2.add(blad2);
  const A2 = {
    meal: flowArrow(G2, GUT.clone().add(V3(-0.1, 0.12, 0.1)), LIV.clone().add(V3(0.1, -0.12, 0.12)), GLU, { bend: -0.4, r: 0.035 }),
    insL: flowArrow(G2, PAN.clone().add(V3(-0.1, 0.05, 0.1)), LIV.clone().add(V3(0.15, -0.02, 0.12)), INS, { bend: 0.5, r: 0.032 }),
    insM: flowArrow(G2, PAN.clone().add(V3(0.1, -0.05, 0.1)), MUS[0].clone().add(V3(0, 0.4, 0.15)), INS, { bend: -0.15, r: 0.032 }),
    insF: flowArrow(G2, PAN.clone().add(V3(0.0, -0.06, 0.1)), FAT.clone().add(V3(0.2, 0.05, 0.05)), INS, { bend: 0.3, r: 0.032 }),
    egp: flowArrow(G2, LIV.clone().add(V3(-0.1, 0.12, 0.12)), BODY.heart.clone().add(V3(-0.1, 0, 0.1)), '#FF9A5C', { bend: -0.3, r: 0.032 }),
    uri: flowArrow(G2, KID[1].clone().add(V3(0, -0.15, 0.1)), BLAD.clone().add(V3(-0.05, 0.1, 0.05)), GLU, { bend: 0.2, r: 0.032 }),
    uri2: flowArrow(G2, KID[0].clone().add(V3(0, -0.15, 0.1)), BLAD.clone().add(V3(0.05, 0.1, 0.05)), GLU, { bend: -0.2, r: 0.032 }),
    inj: flowArrow(G2, FAT.clone().add(V3(-0.35, 0.0, 0.1)), BODY.heart.clone().add(V3(-0.15, -0.1, 0.12)), '#5BE0FF', { bend: 0.3, r: 0.03 }),
  };
  const DRUG = { met: { p: LIV, col: '#5B8CFF' }, sglt: { p: KID[0].clone(), col: '#7FE0A0' }, glp: { p: PAN, col: '#C77DFF' }, ins: { p: FAT.clone().add(V3(-0.35, 0, 0.12)), col: '#5BE0FF' } };
  Object.values(DRUG).forEach((d) => { d.g = glowNucleus(G2, d.p.clone().add(V3(0, 0, 0.25)), d.col, 0.05, 12); });
  const ketG = glowNucleus(G2, LIV.clone().add(V3(-0.2, 0.15, 0.3)), '#FF5A5A', 0.04, 10);
  const pancG = glowNucleus(G2, PAN.clone().add(V3(0.1, 0, 0.12)), INS, 0.035, 9);

  /* ---------- 3. гликирование гемоглобина и сорбит в хрусталике ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const HSC = 0.042, HB = PDB('hb');
  const hbG = new THREE.Group(); G3.add(hbG);
  const hbM = proteinMesh('hb', { scale: HSC, palette: ['#FF8AB0', '#7FD6FF', '#FF8AB0', '#7FD6FF'], cart: { k: 0.45 } }); hbG.add(hbM);
  HB.ligm.forEach((l) => hbG.add(molMesh(l, { scale: HSC })));
  const hbCen = (() => { const p = caPoints('hb', HSC); return p.reduce((v, q) => v.add(q), V3(0, 0, 0)).multiplyScalar(1 / p.length); })();
  hbG.position.copy(hbCen).negate().add(V3(-0.8, 0.55, 0));
  const caOf = (chId, i) => { const ch = HB.chains.find((c) => c.id === chId); return V3(ch.ca[i * 3], ch.ca[i * 3 + 1], ch.ca[i * 3 + 2]).multiplyScalar(HSC); };
  const lysOf = (chId, n) => { const ch = HB.chains.find((c) => c.id === chId); const out = []; for (let i = 0; i < ch.seq.length && out.length < n; i += 1) if (ch.seq[i] === 'K' && i > 10 && i % 3 === 0) out.push(i); return out; };
  const SITES = [['B', 0], ['D', 0], ...lysOf('B', 2).map((i) => ['B', i]), ...lysOf('A', 1).map((i) => ['A', i]), ...lysOf('D', 1).map((i) => ['D', i])].map(([c, i], k) => {
    const p = caOf(c, i); const dir = p.clone().sub(hbCen).normalize(); const m = fit('glucose', 0.32); m.position.copy(p).addScaledVector(dir, 0.3); m.visible = false; hbG.add(m);
    const mark = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: '#FF9A3C', transparent: true, opacity: 0.9 })); mark.position.copy(p); mark.visible = false; hbG.add(mark);
    return { p, dir, m, mark, st: 0, t: 0, nterm: i === 0 };
  });
  const FREE = Array.from({ length: 12 }, (_, i) => { const m = fit('glucose', 0.3); m.visible = false; G3.add(m); return { m, ph: rand(0, 6.28), r: rand(1.5, 1.9), y: rand(-0.6, 1.5), sp: rand(0.15, 0.3) * (i % 2 ? 1 : -1) }; });
  const flyG = { m: fit('glucose', 0.32), on: false, t: 0, site: null, a: V3(0, 0, 0) }; flyG.m.visible = false; G3.add(flyG.m);
  // 100 молекул гемоглобина: доля гликированных = HbA1c
  const dmy0 = new THREE.Object3D();
  const DOT = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), 100);
  for (let i = 0; i < 100; i++) { dmy0.position.set(-2.6 + (i % 20) * 0.19, -1.55 - Math.floor(i / 20) * 0.19, 0.3); dmy0.updateMatrix(); DOT.setMatrixAt(i, dmy0.matrix); DOT.setColorAt(i, C.set('#C8506A')); }
  G3.add(DOT);
  // хрусталик
  const LENS = V3(3.3, 0.55, 0);
  const lensG = new THREE.Group(); lensG.position.copy(LENS); lensG.rotation.y = -0.75; G3.add(lensG);
  const lensM = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), glassMat('#BFE4FF', { rim: 0.85, base: 0.04, keep: true })); lensM.scale.set(1.25, 1.25, 0.62); lensG.add(lensM);
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 20), new THREE.MeshPhysicalMaterial({ color: 0xe8dcc0, roughness: 0.9, transparent: true, opacity: 0.0, depthWrite: false })); cloud.scale.set(1.15, 1.15, 0.55); lensG.add(cloud);
  const ar = new THREE.Mesh(blobGeo(0.2, 0.17, 0.17, 81, 0.12, 3), protMat('#7FE0A0', 0.5, { emissiveIntensity: 0.15 })); ar.position.set(-0.75, 0.55, 0.35); lensG.add(ar);
  const SORB = Array.from({ length: 16 }, () => { const m = fit('sorbitol', 0.24); m.visible = false; let p; do { p = V3(rand(-1, 1), rand(-1, 1), rand(-0.45, 0.45)); } while (p.x * p.x + p.y * p.y > 0.85); m.position.set(p.x * 1.05, p.y * 1.05, p.z); lensG.add(m); return m; });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'beta', labels: true, rot: false, fly: null, msg: null,
    gsel: 'fast', G: 5, su: false, glp: false, vm: -65, ca: 0, sec: 0, kopen: 0.6, metab: 0.3, vh: [], ph: 0,
    dis: 'norm', drugs: { ins: false, met: false, sglt: false, glp: false }, hr: 6, Gd: 5.2, I: 1, ket: 0.1, day: [], prev: [], urine: 0, urineDay: 0, tir: 100, mean: 5.5, a1cD: 5.3,
    lvl: 'norm', a1c: 5.1, weeks: 0, gh: [], sorb: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['beta', 'day', 'glyc'][k] === m; }); st.fly = flyTarget(VV(m)[0], VV(m)[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  // --- β-клетка
  function betaUpdate(dt, t) {
    const tgt = st.gsel === 'meal' ? 10 : st.gsel === 'hypo' ? 3 : 5;
    st.G += (tgt - st.G) * Math.min(1, dt * 0.8);
    const metab = st.G * st.G / (st.G * st.G + 49); st.metab = metab;
    let kopen = clamp(1.25 - 1.9 * metab, 0.03, 1); if (st.su) kopen *= 0.12; st.kopen += (kopen - st.kopen) * Math.min(1, dt * 2);
    const vm = -70 + 25 * Math.pow(1 - st.kopen, 1.5); st.vm = vm;
    st.ca = clamp((vm + 58) / 12, 0, 1);
    const amp = st.glp ? 1 + 1.5 * smooth(0.3, 0.8, st.ca) : 1;
    st.sec = 0.04 + st.ca * amp;
    // глюкоза входит
    if (rnd() < dt * 3.2 * st.G / 5) { const p = gluM.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.path = pGlu[(rnd() * 3) | 0]; p.m.visible = true; } }
    gluM.forEach((p) => { if (!p.on) return; p.t += dt * 0.35; if (p.t >= 1) { p.on = false; p.m.visible = false; fx.spawn(gk.position.clone(), V3(0.3, 0, 0), C.set(GLU), 0.6, 0.5, 1); return; } p.m.position.copy(p.path.getPoint(p.t)); p.m.rotation.y += dt; });
    gk.material.emissiveIntensity = 0.05 + 0.3 * metab;
    MITO.forEach((m, i) => { m.material.emissiveIntensity = 0.05 + 0.25 * metab * (0.6 + 0.4 * Math.sin(t * 3 + i)); });
    // АТФ к каналу
    if (rnd() < dt * 9 * metab) { const p = ATP.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.a.copy(MITO[(rnd() * 3) | 0].position); p.s.visible = true; } }
    const kpos = kch.position.clone().addScaledVector(nrm(KD), -0.3);
    ATP.forEach((p) => { if (!p.on) return; p.t += dt * 0.6; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.a).lerp(kpos, p.t); });
    // K-АТФ: открытая пора выпускает K⁺
    KIR.forEach((m) => { const r = 0.08 + 0.07 * st.kopen; m.position.set(Math.cos(m.userData.a) * r, 0, Math.sin(m.userData.a) * r); m.material.emissiveIntensity = 0.1 + 0.25 * st.kopen; });
    if (rnd() < dt * 8 * st.kopen) { const p = KI.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.s.visible = true; } }
    KI.forEach((p) => { if (!p.on) return; p.t += dt * 0.8; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(kch.position).addScaledVector(nrm(KD), -0.4 + 1.3 * p.t).add(V3(Math.sin(p.t * 9) * 0.05, 0, 0)); });
    sulfo.visible = st.su; if (st.su) { sulfo.position.copy(kch.position).addScaledVector(nrm(KD), 0.55).add(V3(-0.45, 0, 0.2)); sulfo.rotation.y += dt * 0.5; }
    SUR.forEach((m) => { m.material.emissiveIntensity = st.su ? 0.25 + 0.1 * Math.sin(t * 5) : 0.08; });
    // Ca²⁺
    cach.material.emissiveIntensity = 0.06 + 0.35 * st.ca;
    if (rnd() < dt * 10 * st.ca) { const p = CAI.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.b.set(rand(0.6, 2.4), rand(-0.3, 1.4), rand(-0.3, 0.6)); p.s.visible = true; } }
    CAI.forEach((p) => { if (!p.on) return; p.t += dt * 0.7; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } const a = onMem(CD, 1.2); p.s.position.copy(a).lerp(p.b, p.t); });
    // GLP-1 → цАМФ (только при высокой глюкозе усиливает)
    glpr.material.emissiveIntensity = st.glp ? 0.25 + 0.1 * Math.sin(t * 4) : 0.05;
    if (st.glp && rnd() < dt * 4) { const p = CAMP.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.b.set(rand(0.4, 2.2), rand(-0.3, 1.2), 0.3); p.s.visible = true; } }
    CAMP.forEach((p) => { if (!p.on) return; p.t += dt * 0.5; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(onMem(GD, 0.85)).lerp(p.b, p.t); });
    // экзоцитоз
    if (rnd() < dt * 1.8 * st.sec) { const free = GR.filter((g) => g.st === 0); if (free.length) free[(rnd() * free.length) | 0].st = 1; }
    GR.forEach((g) => {
      if (g.st === 1) { g.k += dt * 0.9; g.g.position.copy(g.home).lerp(g.dock, smooth(0, 1, g.k)); if (g.k >= 1) { g.st = 2; g.k = 0; for (let j = 0; j < 4; j++) { const p = INSP.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.a.copy(g.dock); p.b.copy(capC.getPoint(rand(0.2, 0.8))).add(V3(rand(-0.2, 0.2), rand(-0.3, 0.3), 0.2)); p.s.visible = true; } } fx.spawn(g.dock.clone(), V3(0, 0, 0.3), C.set(INS), 0.6, 0.5, 1.4); } }
      else if (g.st === 2) { g.k += dt * 0.6; g.g.scale.setScalar(Math.max(0.01, 1 - g.k * 1.5)); if (g.k > 1.5) { g.st = 3; g.k = 0; g.g.position.copy(golgi.position); } }
      else if (g.st === 3) { g.k += dt * 0.25; g.g.scale.setScalar(Math.min(1, g.k)); g.g.position.copy(golgi.position).lerp(g.home, smooth(0, 1, g.k)); if (g.k >= 1) { g.st = 0; g.k = 0; g.g.scale.setScalar(1); } }
    });
    INSP.forEach((p) => { if (!p.on) return; p.t += dt * 0.45; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.a).lerp(p.b, p.t); });
    cell.material.uniforms.uColor.value.set(st.vm > -55 ? '#FFB0C8' : '#FFC8A8');
    // мембранный потенциал: вспышки (пачки потенциалов действия)
    st.ph += dt; let v = st.vm; if (st.ca > 0.02) { const burst = (st.ph % 2.2) < 0.6 + 1.2 * st.ca; if (burst) { const fq = 4 + 5 * st.ca, s = (st.ph * fq) % 1; v = st.vm + (s < 0.18 ? 35 * Math.sin(s / 0.18 * Math.PI) : 0); } else v = -62; }
    st.vh.push([st.t, v]); while (st.vh.length && st.vh[0][0] < st.t - 4) st.vh.shift();
  }

  // --- сутки: 1 с = 1 час
  const MEALS = [[7, 4.2], [13, 5.0], [19, 4.6]];
  function dayStep(h, dt) {
    const D = st.dis, d = st.drugs;
    let beta = 1, sens = 1, egpK = 1, thr = 10, glp = false, basal = 0, bolus = 0;
    if (D === 't1') { beta = 0.03; if (d.ins) { basal = 1.15; bolus = 2.2; } }
    if (D === 't2') { beta = 0.5; sens = 0.4; egpK = 1.5; if (d.met) { egpK *= 0.7; sens *= 1.2; } if (d.sglt) thr = 4; if (d.glp) glp = true; if (d.ins) basal = 2.5; }
    const tau = 0.7 * (glp ? 1.5 : 1), amp = glp ? 0.85 : 1;
    let Ra = 0; MEALS.forEach(([tm, M]) => { [0, 24, -24].forEach((dd) => { const x = h - tm + dd; if (x > 0) Ra += amp * M * x / (tau * tau) * Math.exp(-x / tau); }); });
    const base = 0.6 + 0.35 * Math.max(0, st.Gd - 3) ** 1.3 * (glp ? 1.9 : 1);
    const secr = beta > 0.05 ? beta * base : beta;
    let exo = basal; if (bolus) MEALS.forEach(([tm, M]) => { [0, 24, -24].forEach((dd) => { const x = h - tm + dd + 0.25; if (x > 0) exo += bolus * M / 4.5 * x / 0.64 * Math.exp(-x / 0.8); }); });
    st.I += (secr - st.I) * dt / 0.3; st.exo = exo; st.secr = secr;
    const Ie = (st.I + exo) * sens; st.Ie = Ie;
    const EGP = egpK * 2.2 / (1 + 1.2 * Ie), U = (0.03 + 0.1 * Ie) * st.Gd, R = Math.max(0, st.Gd - thr) * 0.12;
    st.Gd = Math.max(1.5, st.Gd + (Ra + EGP - U - R) * dt); st.Ra = Ra; st.R = R; st.EGP = EGP;
    st.ket = clamp(st.ket + (Ie < 0.35 ? 0.6 : -1.5 * st.ket) * dt, 0.05, 8);
    st.urine += R * dt * 15 * 0.18;
  }
  function dayUpdate(dt, t) {
    const dh = dt * 1.0, n = 6; for (let i = 0; i < n; i++) { st.hr += dh / n; if (st.hr >= 24) { st.hr -= 24; st.prev = st.day; st.day = []; st.urineDay = st.urine; st.urine = 0; } dayStep(st.hr, dh / n); }
    if (!st.day.length || st.hr - st.day[st.day.length - 1][0] > 0.1) st.day.push([st.hr, st.Gd]);
    const all = st.prev.filter((r) => r[0] > st.hr).concat(st.day); if (all.length > 10) { const m = all.reduce((s, r) => s + r[1], 0) / all.length; st.mean = m; st.tir = Math.round(100 * all.filter((r) => r[1] >= 3.9 && r[1] <= 10).length / all.length); st.a1cD = (m * 18 + 46.7) / 28.7; }
    const lv = (v) => clamp(v, 0.04, 1.3);
    A2.meal.mat.uniforms.uOn.value = lv(st.Ra / 3); A2.egp.mat.uniforms.uOn.value = lv(st.EGP / 2.5);
    const ins = lv(((st.secr || 0) + (st.exo || 0)) / 2.2); A2.insL.mat.uniforms.uOn.value = ins; A2.insM.mat.uniforms.uOn.value = ins; A2.insF.mat.uniforms.uOn.value = ins;
    A2.uri.mat.uniforms.uOn.value = lv(st.R / 0.6); A2.uri2.mat.uniforms.uOn.value = lv(st.R / 0.6);
    A2.inj.mat.uniforms.uOn.value = st.drugs.ins && st.dis !== 'norm' ? lv((st.exo || 0) / 2) : 0;
    Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    Object.entries(DRUG).forEach(([k, d]) => { const on = st.dis !== 'norm' && st.drugs[k] && (st.dis === 't2' || k === 'ins'); d.g.spr.material.opacity = on ? 0.55 + 0.2 * Math.sin(t * 3) : 0; d.g.core.visible = on; });
    ketG.spr.material.opacity = clamp((st.ket - 0.6) / 3, 0, 0.8); ketG.core.visible = st.ket > 1;
    pancG.spr.material.opacity = clamp(0.15 + (st.secr || 0) / 3, 0, 0.8);
    blad2.material.emissiveIntensity = 0.04 + 0.3 * lv(st.R / 0.6);
    mus2.forEach((m) => { m.material.emissiveIntensity = 0.04 + 0.12 * clamp((st.Ie || 0) / 2, 0, 1); });
  }

  // --- гликирование
  const A1C = { norm: 5.5, ok: 7.5, bad: 12 };
  function glycUpdate(dt, t) {
    const mg = A1C[st.lvl], tgt = (mg * 18 + 46.7) / 28.7;
    st.weeks += dt; st.a1c += (tgt - st.a1c) * dt / 6;   // 1 с ≈ 1 неделя; HbA1c отстаёт на 1–3 месяца
    if (!st.gh.length || st.t - st.gh[st.gh.length - 1][0] > 0.2) { st.gh.push([st.t, mg, st.a1c]); while (st.gh.length && st.gh[0][0] < st.t - 26) st.gh.shift(); }
    hbM.rotation.y = 0; hbG.rotation.y = Math.sin(t * 0.15) * 0.4;
    const nFree = Math.round(mg * 0.9); FREE.forEach((f, i) => { f.m.visible = i < nFree; f.ph += dt * f.sp; f.m.position.set(-0.8 + Math.cos(f.ph) * f.r, f.y + 0.2 * Math.sin(f.ph * 2), Math.sin(f.ph) * f.r * 0.4 - 0.3); f.m.rotation.y += dt * 0.6; });
    const nPerm = clamp(Math.round((st.a1c - 4.2) / 0.9), 0, SITES.length);
    SITES.forEach((s, k) => { if (s.st === 2 && k >= nPerm) s.st = 0; });
    // попытка: глюкоза подлетает к сайту
    if (!flyG.on && rnd() < dt * 0.25 * mg / 5) { const cand = SITES.filter((s) => s.st === 0); if (cand.length) { flyG.site = cand[0].nterm || rnd() < 0.5 ? cand[0] : cand[(rnd() * cand.length) | 0]; flyG.on = true; flyG.t = 0; flyG.a.set(-0.8 + rand(-2.4, 2.4), 2.3, 0.8); flyG.m.visible = true; } }
    if (flyG.on) {
      flyG.t += dt * 0.35; const s = flyG.site; const tp = hbG.localToWorld(s.m.position.clone()); G3.worldToLocal(tp);
      if (flyG.t < 1) flyG.m.position.copy(flyG.a).lerp(tp, smooth(0, 1, flyG.t));
      else if (flyG.t < 1.6) { flyG.m.position.copy(tp); if (!s.flash) { s.flash = 1; fx.spawn(G3.localToWorld(tp.clone()), V3(0, 0.2, 0.2), C.set('#FFE08A'), 0.6, 0.5, 1.2); } }
      else { const k = SITES.indexOf(s); if (k < nPerm) { s.st = 2; flyG.on = false; flyG.m.visible = false; fx.spawn(G3.localToWorld(tp.clone()), V3(0, 0.3, 0.2), C.set('#FF9A3C'), 0.8, 0.5, 1.5); } else { flyG.m.position.copy(tp).lerp(flyG.a, smooth(1.6, 2.6, flyG.t)); if (flyG.t > 2.6) { flyG.on = false; flyG.m.visible = false; } } s.flash = 0; }
    }
    SITES.forEach((s) => { s.m.visible = s.st === 2; s.mark.visible = s.st === 2; s.mark.material.opacity = 0.6 + 0.3 * Math.sin(t * 3); });
    const nG = Math.round(st.a1c); for (let i = 0; i < 100; i++) DOT.setColorAt(i, C.set(i < nG ? '#FF9A3C' : '#C8506A')); DOT.instanceColor.needsUpdate = true;
    // хрусталик: альдозоредуктаза, сорбит копится
    const sT = clamp((mg - 6) / 6, 0, 1); st.sorb += (sT - st.sorb) * dt * 0.15;
    SORB.forEach((m, i) => { m.visible = i < Math.round(st.sorb * SORB.length); m.rotation.y += dt * 0.5; });
    ar.material.emissiveIntensity = 0.05 + 0.3 * sT * (0.6 + 0.4 * Math.sin(t * 4)); cloud.material.opacity = 0.03 + 0.25 * st.sorb;
    lensM.scale.set(1.25 + 0.06 * st.sorb, 1.25 + 0.06 * st.sorb, 0.62 + 0.1 * st.sorb); cloud.scale.set(1.15 + 0.06 * st.sorb, 1.15 + 0.06 * st.sorb, 0.55 + 0.1 * st.sorb);
    if (sT > 0.05 && rnd() < dt * 3 * sT) fx.spawn(lensG.localToWorld(ar.position.clone()), V3(0.2, -0.2, 0.2), C.set('#7FE0A0'), 0.6, 0.5, 1);
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'beta') betaUpdate(dt, t);
    if (st.mode === 'day') dayUpdate(dt, t);
    if (st.mode === 'glyc') glycUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'beta') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'потенциал мембраны β-клетки, мВ', xl: '4 с' });
      const Y = (v) => A.Y(clamp((v + 80) / 85, 0, 1)), X = (tt) => A.X(clamp((tt - (st.t - 4)) / 4, 0, 1));
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(0), Y(-55)); ctx.lineTo(A.X(1), Y(-55)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('порог', A.X(0) + 3, Y(-55) - 3);
      ctx.strokeStyle = '#FF8AB0'; ctx.lineWidth = 1.6; ctx.beginPath(); st.vh.forEach(([tt, v], i) => { i ? ctx.lineTo(X(tt), Y(v)) : ctx.moveTo(X(tt), Y(v)); }); ctx.stroke();
      return;
    }
    if (st.mode === 'day') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'глюкоза; зелёное — цель 3,9–10', xl: 'сутки, 0–24 ч' });
      const X = (hh) => A.X(hh / 24), Y = (g) => A.Y(clamp(g / 30, 0, 1));
      ctx.fillStyle = 'rgba(127,224,160,.10)'; ctx.fillRect(A.X(0), Y(10), A.X(1) - A.X(0), Y(3.9) - Y(10));
      ctx.fillStyle = 'rgba(242,193,78,.6)'; MEALS.forEach(([tm]) => { ctx.beginPath(); ctx.arc(X(tm), A.Y(0) - 4, 3, 0, 7); ctx.fill(); });
      const line = (arr, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); arr.forEach(([hh, g], i) => { i ? ctx.lineTo(X(hh), Y(g)) : ctx.moveTo(X(hh), Y(g)); }); ctx.stroke(); };
      line(st.prev.filter((r) => r[0] > st.hr + 0.3), 'rgba(242,193,78,.25)'); line(st.day, GLU);
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 9px JetBrains Mono, monospace'; [5, 10, 20, 30].forEach((g) => ctx.fillText(String(g), A.X(0) + 3, Y(g) - 2)); [6, 12, 18].forEach((hh) => ctx.fillText(hh + ':00', X(hh) - 10, A.Y(0) - 8));
      return;
    }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'ср. глюкоза (жёлтый), HbA1c (оранжевый)', xl: '26 недель' });
    const X = (tt) => A.X(clamp((tt - (st.t - 26)) / 26, 0, 1)), Yg = (g) => A.Y(clamp(g / 14, 0, 1)), Ya = (a) => A.Y(clamp((a - 4) / 7, 0, 1));
    const line = (fy, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.gh.forEach((r, i) => { i ? ctx.lineTo(X(r[0]), fy(r)) : ctx.moveTo(X(r[0]), fy(r)); }); ctx.stroke(); };
    ctx.strokeStyle = 'rgba(255,154,60,.35)'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(0), Ya(7)); ctx.lineTo(A.X(1), Ya(7)); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(242,193,78,.75)'; [5, 10].forEach((g) => ctx.fillText(g + ' ммоль/л', A.X(0) + 3, Yg(g) - 2)); ctx.fillStyle = 'rgba(255,154,60,.85)'; [5, 7, 9].forEach((a) => ctx.fillText(a + '%', A.X(1) - 22, Ya(a) - 2));
    line((r) => Yg(r[1]), GLU); line((r) => Ya(r[2]), '#FF9A3C');
  }

  const GSEL = { fast: 'Натощак: 5 ммоль/л', meal: 'После еды: 10', hypo: 'Мало: 3' };
  const BTXT = {
    base: '<b>β-клетка</b> островка Лангерганса — датчик сахара. Глюкоза входит через транспортёр <b>GLUT2</b> (у человека — в основном GLUT1), <b>глюкокиназа</b> фосфорилирует её (у неё высокая K<sub>m</sub>, поэтому скорость растёт вместе с глюкозой крови), гликолиз и митохондрии дают <b>АТФ</b>. АТФ закрывает <b>K-АТФ-канал</b> (пора из Kir6.2 и регуляторные SUR1): калий перестаёт выходить, мембрана деполяризуется, открываются <b>Ca²⁺-каналы</b> (ионы кальция — зелёные), и кальций запускает слияние гранул с мембраной — инсулин выходит в кровь вместе с С-пептидом, вырезанным из проинсулина (их поровну — поэтому по С-пептиду судят о собственной секреции). Включите разные уровни глюкозы и следите за потенциалом на графике.',
    fast: 'Натощак (около 5 ммоль/л) АТФ мало, K-АТФ-каналы в основном открыты, мембрана около −65 мВ — клетка молчит, выходит только небольшой базальный инсулин.',
    meal: 'После еды глюкозы 10 ммоль/л: АТФ много, K-АТФ-каналы закрыты, мембрана поднимается выше порога, идут пачки потенциалов действия, кальций входит — гранулы массово выпускают инсулин.',
    hypo: 'Глюкозы 3 ммоль/л — секреция почти выключена, клетка не мешает печени поднимать сахар. Так β-клетка защищает от гипогликемии.',
    su: '<b>Сульфонилмочевина</b> (глибенкламид, молекула у канала) садится на SUR1 и закрывает K-АТФ-канал <b>независимо от глюкозы</b>. Поэтому она выпускает инсулин даже при низком сахаре — главный риск таких таблеток гипогликемия. Включите «Мало: 3» — секреция продолжается. Эти же каналы мутируют при неонатальном диабете, и таких детей лечат таблетками вместо уколов. С агонистами GLP-1 риск гипогликемии ещё выше: раз канал уже закрыт, усиление через цАМФ срабатывает и при низком сахаре — дозу сульфонилмочевины снижают. Включите оба.',
    glp: '<b>GLP-1</b> — гормон-инкретин из кишечника. Через свой рецептор (фиолетовый) и цАМФ он <b>усиливает</b> выброс инсулина, но только когда глюкоза высокая: при «Мало: 3» эффекта нет, поэтому агонисты GLP-1 (лираглутид, семаглутид) сами по себе почти не вызывают гипогликемию. Ещё они замедляют опорожнение желудка, уменьшают аппетит и выброс глюкагона.',
  };
  const DIS = { norm: 'Здоров', t1: 'Диабет 1 типа', t2: 'Диабет 2 типа' };
  const DRUGS = { t1: [['ins', 'Инсулин (базальный + к еде)']], t2: [['met', 'Метформин'], ['sglt', 'Глифлозин'], ['glp', 'Лираглутид'], ['ins', 'Инсулин']] };
  const DLAB = { met: 'метформин', sglt: 'глифлозин', glp: 'лираглутид', ins: 'инсулин' };
  const DTXT = {
    norm: '<b>Сутки здорового человека</b> (1 секунда — 1 час, точки внизу графика — еда). После завтрака, обеда и ужина глюкоза из кишечника поднимает сахар до 7–8 ммоль/л, поджелудочная выбрасывает инсулин (голубые потоки), печень, мышцы и жир забирают глюкозу, и за 2 часа сахар возвращается к 4–6. Ночью печень (оранжевый поток) понемногу выдаёт глюкозу из гликогена, а базальный инсулин не даёт ей выдать лишнее.',
    t1: '<b>Диабет 1 типа</b>: иммунная система разрушила β-клетки — <b>С-пептид</b> почти нулевой, инсулина нет. Сахар поднимается до 20–30 ммоль/л (как именно — см. тему «Гликоген и сахар крови»), глюкоза уходит с мочой и тянет воду. Без инсулина жир распадается без тормоза, печень делает кетоновые тела (красное свечение): кетоны выше 3 ммоль/л и pH крови ниже 7,3 — <b>диабетический кетоацидоз</b>: тошнота и рвота, боль в животе, запах ацетона изо рта, глубокое шумное дыхание (Куссмауля), обезвоживание, спутанность. Это неотложное состояние: лечат инсулином в вену, растворами и калием.',
    t1ins: '<b>Инсулинотерапия</b> заменяет поджелудочную: длинный (базальный) инсулин раз в сутки держит печень в узде, короткий — перед каждой едой (уколы в подкожный жир). Сахар в основном в целевом коридоре; дозу считают по углеводам еды и замерам глюкозы (сегодня — часто с датчиком и помпой). Перебор дозы — гипогликемия, поэтому важно знать её признаки.',
    t2: '<b>Диабет 2 типа</b> — 90% всех случаев. Ткани плохо отвечают на инсулин (<b>инсулинорезистентность</b> — особенно при избытке висцерального жира), печень выдаёт лишнюю глюкозу, а β-клетки постепенно истощаются и не справляются с повышенной нагрузкой. Сахар стоит высоко весь день. Основа лечения — питание, движение и снижение веса; дальше — таблетки и уколы. Попробуйте лекарства по одному и вместе.',
    met: '<b>Метформин</b> — первое лекарство при диабете 2 типа. Главное — тормозит выход глюкозы из печени (глюконеогенез; часть эффекта — через фермент AMPK) и немного повышает чувствительность к инсулину. Сам не вызывает гипогликемию и не прибавляет вес.',
    sglt: '<b>Глифлозины</b> (дапаглифлозин, эмпаглифлозин) блокируют переносчик <b>SGLT2</b> в почечных канальцах — почечный порог глюкозы падает примерно до 5 ммоль/л, и 40–80 г глюкозы в сутки уходит с мочой (жёлтый поток к мочевому пузырю). Сахар снижается независимо от инсулина; доказано защищают сердце и почки.',
    glp: '<b>Лираглутид / семаглутид</b> — агонисты рецептора GLP-1: усиливают выброс инсулина только при высоком сахаре, тормозят глюкагон, замедляют опорожнение желудка (пики после еды ниже) и снижают аппетит — помогают похудеть.',
    ins: '<b>Инсулин</b> при диабете 2 типа добавляют, когда таблеток уже не хватает: чаще начинают с одного укола длинного инсулина в сутки — он снижает сахар натощак.',
  };
  const LVL = { norm: 'Норма (≈ 5,5)', ok: 'Диабет, компенсирован (≈ 7,5)', bad: 'Диабет, высокий сахар (≈ 12)' };
  const GTXT = {
    norm: '<b>Гликирование</b> — глюкоза сама, без фермента, присоединяется к свободным аминогруппам белков. Альдегидная группа глюкозы образует с NH₂ <b>основание Шиффа</b> (обратимо — глюкоза может уйти), которое перестраивается в устойчивый <b>продукт Амадори</b>. Так получается <b>HbA1c</b> — гемоглобин с глюкозой на N-концевом валине β-цепи (оранжевые точки — гликированные места; лизины гликируются тоже). Эритроцит живёт около 120 дней, поэтому HbA1c показывает средний сахар за 2–3 месяца: норма — меньше 6%, цель при диабете — обычно меньше 7%. Внизу — 100 молекул гемоглобина, оранжевые — гликированные.',
    ok: 'Средний сахар около 7,5 ммоль/л — HbA1c около 6,3%. Это хорошая компенсация: риск осложнений невысокий. Обратите внимание на график: HbA1c меняется медленно, через недели после изменения сахара.',
    bad: 'Средний сахар около 12 ммоль/л — HbA1c около 9%. Гликируются белки во всём теле — коллаген, белки хрусталика, стенки сосудов, базальные мембраны почечных клубочков. Со временем из продуктов Амадори образуются необратимые <b>конечные продукты гликирования</b> (AGE): белки сшиваются, ткани теряют эластичность, запускается воспаление. В <b>хрусталике</b> (справа) глюкоза по <b>сорбитоловому пути</b> превращается альдозоредуктазой в сорбит; сорбит плохо выходит из клеток, тянет воду, волокна набухают и мутнеют — диабетическая катаракта. Альдозоредуктаза работает только при высоком сахаре (у неё высокая K<sub>m</sub>) и тратит NADPH — клетке не хватает восстановленного глутатиона, растёт окислительный стресс. Тот же путь вредит нервам и сетчатке. Поэтому диабет поражает мелкие сосуды (глаза, почки, нервы) и крупные (инфаркт, инсульт).',
  };
  const hemeP = (() => { const l = HB.ligm[1]; const i = l.el.indexOf('Fe'); return V3(l.xyz[i * 3], l.xyz[i * 3 + 1], l.xyz[i * 3 + 2]).multiplyScalar(HSC); })();
  const hbL = (ch, out) => { const p = caPoints('hb', HSC, [ch]); const c = p.reduce((v, q) => v.add(q), V3(0, 0, 0)).multiplyScalar(1 / p.length); const d = c.clone().sub(hbCen).normalize(); c.addScaledVector(d, out); return () => hbG.localToWorld(c.clone()); };
  const L1 = () => st.labels && st.mode === 'beta', L2 = () => st.labels && st.mode === 'day', L3 = () => st.labels && st.mode === 'glyc';
  const labels = [
    { text: 'GLUT2', pos: onMem(180, 1.12).add(V3(0, 0.35, 0.2)), color: '#7FE0A0', show: L1 },
    { text: 'глюкокиназа', pos: gk.position.clone().add(V3(-0.3, -0.45, 0.2)), color: GLU, show: L1 },
    { text: 'митохондрии → АТФ', pos: V3(-1.3, -1.25, 0.4), color: '#FF8A5C', show: L1 },
    { text: 'K-АТФ-канал (Kir6.2 + SUR1)', pos: onMem(KD, 1.2).add(V3(-0.1, 0.1, 0.2)), color: '#B090FF', show: L1 },
    { text: 'глибенкламид', pos: onMem(KD, 1.35).add(V3(-1.0, 0.0, 0.2)), color: '#E8E8E8', show: () => L1() && st.su },
    { text: 'Ca²⁺-канал', pos: onMem(CD, 1.12).add(V3(0.15, 0.2, 0.2)), color: '#5BC8FF', show: L1 },
    { text: 'рецептор GLP-1', pos: onMem(GD, 1.15).add(V3(-0.5, -0.1, 0.2)), color: '#C77DFF', show: L1 },
    { text: 'гранулы инсулина', pos: V3(2.0, 1.85, 0.6), color: INS, show: L1 },
    { text: 'ядро', pos: nuc1.position.clone().add(V3(0.0, -0.9, 0.3)), color: '#9F7BFF', show: L1 },
    { text: 'капилляр', pos: V3(4.6, 2.3, 0.3), color: '#D84A50', show: L1 },
    { text: 'глюкоза', pos: V3(-4.3, -1.9, 0.3), color: GLU, show: L1 },
    { text: 'печень', pos: LIV.clone().add(V3(39.4, 0.25, 0.2)), color: '#E07A5A', show: L2 },
    { text: 'поджелудочная', pos: PAN.clone().add(V3(40.45, 0.12, 0.2)), color: '#E8B070', show: L2 },
    { text: 'кишечник', pos: GUT.clone().add(V3(40.5, -0.05, 0.2)), color: '#E0A0A0', show: L2 },
    { text: 'почки', pos: KID[0].clone().add(V3(40.3, 0.15, 0.2)), color: '#E07070', show: L2 },
    { text: 'мышцы', pos: MUS[0].clone().add(V3(40.35, -0.2, 0.2)), color: '#C0504A', show: L2 },
    { text: 'жир', pos: FAT.clone().add(V3(39.25, -0.2, 0.2)), color: '#F2D08A', show: L2 },
    { text: 'метформин', pos: LIV.clone().add(V3(39.15, -0.15, 0.4)), color: '#5B8CFF', show: () => L2() && st.dis === 't2' && st.drugs.met },
    { text: 'глифлозин → SGLT2', pos: KID[0].clone().add(V3(40.25, -0.15, 0.4)), color: '#7FE0A0', show: () => L2() && st.dis === 't2' && st.drugs.sglt },
    { text: 'лираглутид', pos: PAN.clone().add(V3(40.45, -0.2, 0.4)), color: '#C77DFF', show: () => L2() && st.dis === 't2' && st.drugs.glp },
    { text: 'инсулин (укол)', pos: FAT.clone().add(V3(39.0, -0.3, 0.4)), color: '#5BE0FF', show: () => L2() && st.dis !== 'norm' && st.drugs.ins },
    { text: 'кетоновые тела', pos: LIV.clone().add(V3(39.3, 0.55, 0.3)), color: '#FF5A5A', show: () => L2() && st.ket > 1 },
    { text: 'глюкоза с мочой', pos: BLAD.clone().add(V3(40.25, -0.15, 0.2)), color: GLU, show: () => L2() && (st.R || 0) > 0.05 },
    { text: 'β-цепь', pos: hbL('B', 0.9), color: '#7FD6FF', show: L3 },
    { text: 'α-цепь', pos: hbL('A', 0.9), color: '#FF8AB0', show: L3 },
    { text: 'гем', pos: () => hbG.localToWorld(hemeP.clone()), color: '#FF6A5A', show: L3 },
    { text: 'глюкоза', pos: () => FREE[0].m.getWorldPosition(V3(0, 0, 0)).add(V3(0.25, 0.1, 0)), color: GLU, show: L3 },
    { text: 'N-конец β-цепи + глюкоза = HbA1c', pos: () => hbG.localToWorld(SITES[0].m.position.clone()).add(V3(-1.6, -0.3, 0.2)), color: '#FF9A3C', show: () => L3() && SITES[0].st === 2 },
    { text: '100 молекул Hb · оранжевые — HbA1c', pos: V3(80 - 2.6, -1.25, 0.3), color: '#FF9A3C', show: L3 },
    { text: 'хрусталик', pos: LENS.clone().add(V3(80.3, 1.15, 0.3)), color: '#BFE4FF', show: L3 },
    { text: 'альдозоредуктаза', pos: () => lensG.localToWorld(ar.position.clone()).add(V3(-0.2, 0.35, 0)), color: '#7FE0A0', show: L3 },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) {
        if (st.mode === 'beta') s = st.su && st.glp ? BTXT.su + ' ' + BTXT.glp : st.su ? BTXT.su : st.glp ? BTXT.glp : BTXT.base + ' ' + BTXT[st.gsel];
        else if (st.mode === 'day') { const on = Object.keys(st.drugs).filter((k) => st.drugs[k]); s = st.dis === 'norm' ? DTXT.norm : st.dis === 't1' ? (st.drugs.ins ? DTXT.t1ins : DTXT.t1) : on.length ? (on.length > 1 ? '<b>Сейчас:</b> ' + on.map((k) => DLAB[k]).join(' + ') + '. ' : '') + DTXT[on.includes(st.lastDrug) ? st.lastDrug : on[on.length - 1]] : DTXT.t2; }
        else s = st.lvl === 'norm' ? GTXT.norm : GTXT[st.lvl];
      }
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'beta', label: 'β-клетка' }, { id: 'day', label: 'Сутки и лечение' }, { id: 'glyc', label: 'Осложнения' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'beta') box.append(h('div', { class: 'glabel' }, 'Глюкоза крови'), h('div', { class: 'gctl' }, seg(Object.entries(GSEL).map(([id, label]) => ({ id, label })), () => st.gsel, (v) => { st.gsel = v; refs.setInfo(); }), toggle('Глибенкламид', () => st.su, (v) => { st.su = v; refs.setInfo(); }), toggle('Агонист GLP-1', () => st.glp, (v) => { st.glp = v; refs.setInfo(); })));
      else if (st.mode === 'day') {
        const dr = (DRUGS[st.dis] || []).map(([k, label]) => toggle(label, () => st.drugs[k], (v) => { st.drugs[k] = v; if (v) st.lastDrug = k; refs.setInfo(); }));
        box.append(h('div', { class: 'glabel' }, 'Человек'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; Object.keys(st.drugs).forEach((k) => { st.drugs[k] = false; }); st.urine = 0; st.urineDay = 0; st.day = st.day.slice(-1); st.prev = []; refs.rebuild(); refs.setInfo(); }), ...dr));
      } else box.append(h('div', { class: 'glabel' }, 'Средний сахар, ммоль/л'), h('div', { class: 'gctl' }, seg(Object.entries(LVL).map(([id, label]) => ({ id, label })), () => st.lvl, (v) => { st.lvl = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['beta', 'day', 'glyc'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'beta') return [['Глюкоза', f1(st.G), 'ммоль/л'], ['Потенциал', Math.round(st.vm), 'мВ'], ['Секреция инсулина', Math.min(100, Math.round(100 * st.sec / 2.6)), '%']];
    if (st.mode === 'day') { const r = [['Глюкоза', f1(st.Gd), 'ммоль/л'], ['В коридоре', st.day.length + st.prev.length < 100 ? '…' : st.tir, '%'], ['HbA1c, если так 3 мес.', st.day.length + st.prev.length < 100 ? '…' : st.a1cD > 14 ? '> 14' : f1(st.a1cD), '%'], ['Глюкоза с мочой', Math.round(st.urineDay || st.urine), 'г/сут']]; if (st.dis === 't1' && !st.drugs.ins) r.push(['Кетоны', f1(st.ket), 'ммоль/л']); return r; }
    return [['HbA1c', f1(st.a1c), '%'], ['Средний сахар', f1(A1C[st.lvl]), 'ммоль/л'], ['Сорбит в хрусталике', Math.round(st.sorb * 100), '%']];
  }
  const self = {
    mobZoom: 0.75, scene, camera, controls, update: (dt) => { update(dt); G3.updateMatrixWorld(true); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope, accent: '#5B8CFF',
    kicker: 'Биохимия · гормоны', title: 'Инсулин и сахарный диабет',
    lede: 'Одна клетка поджелудочной меряет сахар крови с точностью до долей миллимоля — и полмиллиарда людей живут с диабетом, когда этот датчик ломается.',
    notes: `
      <div><h2>Инсулин</h2>
        <p>Белок из двух цепей (A — 21 и B — 30 аминокислот), связанных двумя дисульфидными мостиками. Синтезируется как препроинсулин; в гранулах из проинсулина вырезается <b>С-пептид</b> — его измеряют, чтобы оценить собственную секрецию на фоне уколов. В гранулах инсулин хранится в виде гексамеров с цинком.</p>
        <h3>Секреция</h3><ul><li>Глюкоза → GLUT2 (у человека в основном GLUT1) → глюкокиназа (датчик) → АТФ/АДФ ↑ → закрытие K-АТФ-каналов → деполяризация → потенциал-зависимые Ca²⁺-каналы → экзоцитоз.</li><li>Усиливают: инкретины GLP-1 и ГИП (цАМФ), аминокислоты, парасимпатические нервы; тормозят: адреналин (α₂), соматостатин.</li><li>Две фазы: быстрая (готовые гранулы у мембраны) и медленная.</li></ul>
        <h3>Действие</h3><p>Рецептор-тирозинкиназа → IRS → PI3K → Akt: GLUT4 в мембрану мышц и жира, синтез гликогена, жиров и белка; торможение глюконеогенеза, гликогенолиза, липолиза и кетогенеза. Глюкагон, адреналин, кортизол и СТГ — контринсулярные гормоны.</p>
        <h3>Диабет</h3><ul><li><b>1 тип</b> — аутоиммунное разрушение β-клеток, абсолютный дефицит инсулина; риск кетоацидоза.</li><li><b>2 тип</b> — инсулинорезистентность + прогрессирующая недостаточность β-клеток; гиперосмолярное состояние у пожилых.</li><li>Гестационный, MODY (моногенный, например мутации глюкокиназы), вторичный.</li><li>Диагноз: глюкоза натощак ≥ 7,0 ммоль/л, через 2 часа после нагрузки ≥ 11,1, HbA1c ≥ 6,5%.</li><li>Осложнения: микроангиопатии (ретинопатия, нефропатия, нейропатия), макроангиопатии, диабетическая стопа.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Клетка, гранулы и каналы — схемы, не в масштабе; молекулы глюкозы, глибенкламида и сорбита — по химическим формулам; гемоглобин — настоящая структура (PDB 4HHB).</li><li>Модель суток — упрощённая, дозы и ответы на лекарства примерные; 1 секунда = 1 час. Пересчёт среднего сахара в HbA1c — по формуле исследования ADAG.</li><li>Число гликированных мест на молекуле показано условно — оно отражает уровень HbA1c, а не реальную долю.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('beta'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  return self;
}
export { makeDiabetes };
