import { Sparks, THREE, V3, __set_rnd, displaceGeo, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, range, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, PDB, bioStage, caPoints, cartoon, molMesh, plotAxes, plotLine, surfaceMesh } from './kit.js';
Object.assign(BIO_PDB, {"hbo":{"title":"Оксигемоглобин 1GZX, α-цепь","r":24.1,"chains":[{"id":"A","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCCHHHHHHHHHHHHHHCCCHHHHHHHHHHHHHHHCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHCCCCHHHHCHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHHCCCCC","ca":"cgC5/qX/dADq/mz/fgDK/if/pwDv/vD+ZQD9/tH+TAAg/xH/jABH/xf/hQBf/9D+PAB1/9v+TACb/xr/iADB//z+XQDS/8H+HwDs/+n+SgAOAB7/bgApAOD+MgBTAMn+HwBtAA7/YgCPAAn/XADWACP/GADLAEL/LACWAHX/JgDJAK7/5P/kAJX/zP+bAI3/5v+HANT/wf/GAPL/gP+yAM3/iP9oAOT/jf9/ACsAT/+rACMAJv9wAAUAPv9GAEAAKf93AHgA5P6AAFYA0v43AEIA7v4ZAIUA7v5OALwADv8fAO0AUv8rAMwATP90AOcAXP9YACwBp/9bABkBpv+jAAEBhv/FAD4Bvf/9ADkBr/8KAe4Af/87AcwAVv8MAaIALf9BAYEAL/9BATMAbv9hARgAkv9cAVsA3P9qAU8A6P81AYIAxP8DAVcA6f8YARYAKQAXAT8AHQDOAFUABAC0ABEARgDKAPT/bgCkACcARQBmAB0ASQBuANH/lwB0ANn/mgAzAAIAdAAOAMv/oAArAJX/3AAQALr/vgDJ/8T/sgDI/3f/+wDh/2//EgGl/5b/3QB0/4T/EgE+/4r/JQFS/9D/5QBs//P/9ABR/zkANgF3/zwAHgG0/xQA5QC6/0gAAgGe/4oAAgHk/6YAuQDy/5oAqQCt/7UAzAC///cApgABAPoAYADj/+4AcgCo/xsBjQDI/1oBfwAQAFcBOwAXADIBHADS/0EB5f/U/wsBuf+X/woBxv9t/88AgP9v/7cAif+3/6MAvv+m/24AiP+D/0gAXP/D/0cAkv/y/zAAp/++//r/YP++/+D/W/8LAN7/n/8QALf/gv/d/4T/Qv8GAH//bf9GAHX/mP8nAD7/W/8KAB3/PP9RAB3/eP9vAPz+m/86AM3+X/8bAKz+hv8LAG/+uP/i/5j+jP/L/9D+gP+I/67+bP9F/8/+tP8q/8/+0v9t/+f+m/9v/xz/rf8l/zL/9/8+/zP/7v98/1r/wv9X/43/+P8j/5j/LABc/5//BQCE/9P/+f9D//f/QwA1//f/VgB8/w4AIgB3/0kAQAAz/1oAhwBT/2EAagCM/4sASQBd/70AfwAn/8AAnwBC//8AYQBF/ywBbgAM/14B","o":"vNTFY/QA5l8RAGT38Vzc11sK/mMKBV7ezlPo5VwdC2MA/VvX4F/8EGERJlwI6F3k2l0EEO1h8FI3rwo6udk60gZZpv8rrN8sydZIvf1LovYhvcQswttFrgI5qN8jwsUzzPFUpPYnw7IIYwcOKkE/OAVTYg4QLVQgJxVZYBQS0knO0VYTGGD0rt0tQ/q20sDCYfHt+GITUTfvHKrVUtfYT8P0KajnLrnKVtHpN6/tHLLJOLvSSLzzJKbpG7PGSM7QOK70HK/NMsq8TcbmJqXyJbrDVuTWCdFYxb4vJqcbJUNB8Vcu7ihaEUtABGMQvSVA2/Zc6SJbvBxEueZC2Ppc2QlcqAQvyNJF/hdhyiFNsSsrtP1BPrTr4D65EQWezfCr8VLJFjSu6QefyiKz9TyxDh6i6Aef3EzKBDetACGi0xqr8kC0DRyh7QKe00jKKEvLFqAT1qX6BqrOKqUHnf0QNQxUBepiO+BKNwhTFBhfFudePO5OHCJaDBNiJeRZQv5LGxpdC+9iMe1VPRJNDP1jE9pbM/NVCTtQ3MZJDKUoKTlI8DJVErpF","brk":[]}],"ligs":[{"el":"Fe C C C C N C C C C C C C C O O N C C C C C C C N C C C C C C C N C C C C C C C C O O","xyz":"JQAxAJMASwBjALIAUwAwAGAABAD9/3cA9f84AMIASQBEAIwAUwBaAJoAZwBmAIkAagBYAHMAWABDAHQAfgBdAFwAdgB+AJUAjABzAKgAogCJAKkAnQChAK8AuAB+AKIAKgAbAHIAPgAfAF8AOQANAEgAIwD+/04AGgAHAGgATAAMAC8AFgDq/zwAEADS/0AAAwAeAJwA9v8JAI0A3P8EAJcA2P8VAKsA8P8lAK8Ayv/v/4sAv/8ZAL4Apf8XALcAIQBIALQACwBKAMUADgBfANgAJgBqANIAMgBcALwA+/9oAO4ANACCAOAAJACbANYALwCyAOYANgDGANgAMQCwAP8A","b":"AAAFAAAAEAAAABgAAAAgAAEABgABACQAAgAJAAIAEQADABQAAwAZAAQAHAAEACEABQAGAAUACQAGAAcABwAIAAcACwAIAAkACAAKAAsADAAMAA0ADQAOAA0ADwAQABEAEAAUABEAEgASABMAEgAVABMAFAATABYAFgAXABgAGQAYABwAGQAaABoAGwAaAB0AGwAcABsAHgAeAB8AIAAhACAAJAAhACIAIgAjACIAJQAjACQAIwAmACYAJwAnACgAKAApACgAKgA=","name":"HEM","chain":"A","seq":1142},{"el":"O O","xyz":"FABFAIAAAABMAHQA","b":"AAABAA==","name":"OXY","chain":"A","seq":1143}],"res":[{"el":"N C C O C C N C C N","xyz":"GgDrAE8AHQDOAFUAGQC9ADsAJwCoADcADADIAG4AEQCsAHkAJQCkAIgAAwCVAHQAJQCKAIwAEACBAIEA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS58","chain":"A"},{"el":"N C C O C C N C C N","xyz":"ewDu/+4AYADj/+4AXgDO/wUBSADQ/xABVADY/9IATwDv/74AYwD8/7AAOAD8/7gAWAAQAKIAPgARAKYA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"A"}]}});
Object.assign(BIO_MOL, {"met":{"name":"Метионин","el":"N C C C S C C O O H H H H H H H H H H H","xyz":"8f9R/+H/OwDE/6//2/8tAHn/rv+RAOL/T/89AGMA0/7V/xIAmgD4/xoAgwDi/5AADgFBAPX/rP80/53/MQAF//T/eACg/1r/CwBiACf/gv/6/1D/AgDGAA4Abf/bALL/9P5u/xQAxf72/6v/dP7e/0gA/gCVAMb/","b":"AAABAAEAAgACAAMAAwAEAAQABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAMADgADAA8ABQAQAAUAEQAFABIACAATAA==","o":"1111112111111111111"},"co":{"name":"Угарный газ","el":"C O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"3"},"o2":{"name":"Кислород","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"}});


// @scene hemoglobin makeHemoglobin | Гемоглобин и перенос кислорода | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ГЕМОГЛОБИН: реальная структура 4HHB, кооперативное связывание O₂,
   кривая диссоциации (эффект Бора, 2,3-БФГ, CO, фетальный Hb, миоглобин), гем и железо,
   серповидноклеточная анемия (полимеризация HbS)
   ========================================================= */
function makeHemoglobin() {
  __set_rnd(mulberry(2401));
  const scene = bioStage({ bg: 0x0a0608, rim: 0xff5a5a });
  const VIEW = { o2: flyTarget(V3(-0.4, -1.7, 0), V3(1.0, 0.2, 20.5)), heme: flyTarget(V3(39.0, -1.6, 0), V3(40, 5.2, 12.2)), sick: flyTarget(V3(79.8, -1.9, 0), V3(80.4, -0.2, 17)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.o2.pos);
  const controls = makeControls(camera, VIEW.o2.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  const HB = PDB('hb'); const SC = 0.075;
  /* ---------- 1. гемоглобин и O₂ ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.8, 0.9, 0); scene.add(G1);
  const dimer1 = new THREE.Group(), dimer2 = new THREE.Group(); G1.add(dimer1, dimer2);
  HB.chains.forEach((c, k) => { const m = cartoon(c, { scale: SC, color: k % 2 ? '#FF8AB0' : '#7FD6FF', k: 0.55 }); (k < 2 ? dimer1 : dimer2).add(m); });
  const hemeM = HB.ligm.map((l) => { const m = molMesh(l, { scale: SC }); (l.chain === 'A' || l.chain === 'B' ? dimer1 : dimer2).add(m); return m; });
  const feP = HB.ligm.map((l) => { const i = l.el.indexOf('Fe'); return V3(l.xyz[i * 3], l.xyz[i * 3 + 1], l.xyz[i * 3 + 2]).multiplyScalar(SC); });
  const feGlow = feP.map((p, k) => glowNucleus(HB.ligm[k].chain === 'A' || HB.ligm[k].chain === 'B' ? dimer1 : dimer2, p, '#FF4A4A', 0.05, 8));
  const o2m = feP.map((p, k) => { const m = molMesh(MOL('o2'), { scale: 0.3 }); G1.add(m); return m; });
  const surf = surfaceMesh(caPoints('hb', SC), { radius: 0.5, res: 56, mat: glassMat(0xff7a7a, { rim: 0.13, base: 0.004, pow: 2.8 }) }); G1.add(surf);
  const cenOf = (id) => { const c = V3(0, 0, 0), a = HB.chains.find((q) => q.id === id).ca; for (let i = 0; i < a.length; i += 3) c.add(V3(a[i], a[i + 1], a[i + 2])); return c.multiplyScalar(SC * 3 / a.length).multiplyScalar(1.35); };
  const cenA = cenOf('A'), cenB = cenOf('B');
  const o2out = feP.map((p, k) => V3(Math.cos(k * 1.6) * 5, 2.2 + Math.sin(k) * 1.0, 1.5));
  /* ---------- 2. гем ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0.2, 0); scene.add(G2);
  const HBO = PDB('hbo'); const hm = HBO.ligm.find((l) => l.name === 'HEM'); const oxy = HBO.ligm.find((l) => l.name === 'OXY');
  const hc = (() => { const i = hm.el.indexOf('Fe'); return V3(hm.xyz[i * 3], hm.xyz[i * 3 + 1], hm.xyz[i * 3 + 2]); })();
  const HS = 0.32; const off = hc.clone().multiplyScalar(-HS);
  const hG = new THREE.Group(); G2.add(hG);
  const hemeBig = molMesh(hm, { scale: HS }); hemeBig.position.copy(off); hG.add(hemeBig);
  const his = HBO.resm.find((r) => r.name === 'HIS87'); const hisM = molMesh(his, { scale: HS }); hisM.position.copy(off); hG.add(hisM);
  const his2 = HBO.resm.find((r) => r.name === 'HIS58'); const hisM2 = molMesh(his2, { scale: HS }); hisM2.position.copy(off); hG.add(hisM2);
  // направление на дистальную сторону: от Fe к связанному O₂ (реальные координаты 1GZX)
  const oxC = V3((oxy.xyz[0] + oxy.xyz[3]) / 2, (oxy.xyz[1] + oxy.xyz[4]) / 2, (oxy.xyz[2] + oxy.xyz[5]) / 2);
  const dist = oxC.clone().sub(hc).normalize();
  const o2b = molMesh(oxy, { scale: HS, bondR: 0.16 }); o2b.position.copy(off); hG.add(o2b);
  const coM = MOL('co'); const coAx = V3(coM.xyz[3] - coM.xyz[0], coM.xyz[4] - coM.xyz[1], coM.xyz[5] - coM.xyz[2]).normalize(); if (coM.el[0] !== 'C') coAx.negate();
  const coB = molMesh(coM, { scale: HS }); coB.position.copy(dist).multiplyScalar((1.8 + 0.56) * HS); coB.quaternion.setFromUnitVectors(coAx, dist); hG.add(coB);
  const feBig = glowNucleus(hG, V3(0, 0, 0), '#FF6A3A', 0.06, 5); feBig.core.visible = false;
  { const q = new THREE.Quaternion().setFromUnitVectors(dist, V3(0, 1, 0)); hG.quaternion.copy(q); }
  /* ---------- 3. серповидноклеточная анемия ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const surfGeo = surfaceMesh(caPoints('hb', 0.02), { radius: 0.13, res: 28 }).geometry;
  const NF = 60; const fib = new THREE.InstancedMesh(surfGeo, new THREE.MeshPhysicalMaterial({ color: 0x5a1a20, roughness: 0.45, clearcoat: 0.35, emissive: 0x401014, emissiveIntensity: 0.1 }), NF); G3.add(fib);
  const fibHome = Array.from({ length: NF }, (_, i) => { const k = i % 7, row = Math.floor(i / 7); const a = k / 7 * Math.PI * 2 + row * 0.35; return V3(0.7 + row * 0.62, 0.1 + Math.cos(a) * 0.5, Math.sin(a) * 0.5); });
  const fibFree = Array.from({ length: NF }, () => V3(rand(-0.4, 6.2), rand(-1.4, 1.8), rand(-1.6, 1.6)));
  const rbcGeo = (sickle) => displaceGeo(new THREE.SphereGeometry(1, 64, 48), (v) => { const r2 = v.x * v.x + v.z * v.z; const y = v.y * (0.22 + 0.6 * r2); if (!sickle) { v.y = y; return; } const x = v.x; v.x = x * 1.9; v.z = v.z * 0.42 * (1 - 0.55 * x * x) + 0.95 * x * x - 0.4; v.y = y * 0.85; });
  const rbcN = rbcGeo(false), rbcS = rbcGeo(true);
  const rbc = new THREE.Mesh(rbcN.clone(), organMat('#C83A3A', 0.5, { emissiveIntensity: 0.06 })); rbc.position.set(-2.6, -0.75, 0); rbc.scale.setScalar(1.15); G3.add(rbc);
  const pRN = rbcN.attributes.position.array, pRS = rbcS.attributes.position.array;
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'o2', labels: true, rot: true, fly: null, cyc: 0, msg: null, pO2: 100, ph: 7.4, bpg: false, co: false, fetal: false, mb: false, lig: 'o2', sick: 'deoxy', surf: true };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['o2', 'heme', 'sick'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const P50 = () => { let p = 26.8; p *= Math.pow(10, -0.48 * (st.ph - 7.4)); if (st.bpg) p *= 1.25; if (st.fetal) p = 19; if (st.co) p *= 0.6; return p; };
  const satHb = (pO2) => { const n = 2.8, p50 = P50(); return (st.co ? 0.5 : 1) * Math.pow(pO2, n) / (Math.pow(p50, n) + Math.pow(pO2, n)); };
  const satMb = (pO2) => pO2 / (2.8 + pO2);
  const dm = new THREE.Object3D();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'o2') {
      if (st.rot) G1.rotation.y += dt * 0.15; surf.visible = st.surf;
      const S = satHb(st.pO2); st.S = S; const nb = Math.round(S * 4);
      o2m.forEach((m, k) => { const bound = k < nb; const home = feP[k].clone().applyMatrix4((HB.ligm[k].chain === 'A' || HB.ligm[k].chain === 'B' ? dimer1 : dimer2).matrix); const target = bound ? home.clone().add(home.clone().normalize().multiplyScalar(0.25)) : o2out[k]; m.position.lerp(target, 1 - Math.exp(-dt * 2.5)); m.rotation.y += dt; m.visible = !(st.co && k >= 2); feGlow[k].spr.material.opacity = bound ? 0.9 : 0.25; feGlow[k].spr.material.color.set(bound ? '#FF3A3A' : '#8A3A7A'); });
      // R-состояние: димеры поворачиваются друг относительно друга на ~15°
      const R = smooth(0.25, 0.75, S); dimer2.rotation.y += ((R * 0.26) - dimer2.rotation.y) * Math.min(1, dt * 2);
    }
    if (st.mode === 'heme') {
      G2.rotation.y += st.rot ? dt * 0.3 : 0;
      o2b.visible = st.lig === 'o2'; coB.visible = st.lig === 'co';
      feBig.spr.material.color.set(st.lig === 'met' ? '#7A5A3A' : st.lig === 'co' ? '#FF6A9A' : st.lig === 'none' ? '#8A3A7A' : '#FF4A2A');
    }
    if (st.mode === 'sick') {
      const T = 12, c = st.cyc % T; const poly = st.sick === 'deoxy' ? smooth(1, 6, c) : 0; st.poly = poly;
      for (let i = 0; i < NF; i++) { const p = fibFree[i].clone().lerp(fibHome[i], poly); if (poly < 0.99) p.add(V3(Math.sin(t + i) * 0.05, Math.cos(t * 1.3 + i) * 0.05, 0)); dm.position.copy(p); dm.rotation.set(i * 0.7 + t * (1 - poly) * 0.5, i * 1.3, 0); dm.scale.setScalar(1); dm.updateMatrix(); fib.setMatrixAt(i, dm.matrix); }
      fib.instanceMatrix.needsUpdate = true;
      const P = rbc.geometry.attributes.position.array; for (let i = 0; i < P.length; i++) P[i] = pRN[i] + (pRS[i] - pRN[i]) * poly; rbc.geometry.attributes.position.needsUpdate = true; if (((t * 20) | 0) % 3 === 0) rbc.geometry.computeVertexNormals();
      rbc.rotation.set(1.2, 0, Math.sin(t * 0.3) * 0.25);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'o2') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'насыщение Hb кислородом', xl: 'pO₂ 0–110 мм рт. ст.', yl: '%' });
    const base = { ph: st.ph, bpg: st.bpg, co: st.co, fetal: st.fetal };
    st.ph = 7.4; st.bpg = false; st.co = false; st.fetal = false; plotLine(ctx, A, (u) => satHb(u * 110), 'rgba(255,255,255,.3)', { lw: 1.2, dash: [3, 3] }); Object.assign(st, base);
    if (st.mb) plotLine(ctx, A, (u) => satMb(u * 110), '#C77DFF', { lw: 1.4 });
    plotLine(ctx, A, (u) => satHb(u * 110), '#FF5A5A');
    [[100, 'лёгкие'], [40, 'ткани'], [20, 'мышца']].forEach(([p, n]) => { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(A.X(p / 110), A.Y(0)); ctx.lineTo(A.X(p / 110), A.Y(1)); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText(n, A.X(p / 110) - 12, A.Y(0) - 3); });
    ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.pO2 / 110), A.Y(satHb(st.pO2)), 4.5, 0, Math.PI * 2); ctx.fill();
  }
  const TXT = {
    o2: '<b>Гемоглобин</b> (реальная структура PDB 4HHB): 2 α-цепи (голубые) и 2 β-цепи (розовые), в каждой — <b>гем</b> с ионом Fe²⁺, который обратимо присоединяет O₂. Связывание <b>кооперативно</b>: первая молекула O₂ садится с трудом, но меняет форму белка (переход из напряжённого T- в расслабленное R-состояние — пары цепей поворачиваются на ~15°), и следующие садятся всё легче. Поэтому кривая насыщения S-образная: в лёгких (pO₂ ≈ 100) Hb насыщается почти полностью, а в тканях (≈ 40) и работающих мышцах (≈ 20) отдаёт много кислорода. Двигайте pO₂ и включите факторы.',
    heme: '<b>Гем</b> — плоское порфириновое кольцо с ионом железа в центре (реальные координаты оксигемоглобина 1GZX: видно, что O₂ присоединён под углом). Железо связано с 4 атомами азота кольца, пятой связью — с <b>проксимальным гистидином</b> F8 белка, шестое место — для O₂. Дистальный гистидин E7 (второй) стабилизирует O₂ водородной связью и мешает CO. Железо должно быть <b>двухвалентным</b>: окисленное Fe³⁺ — <b>метгемоглобин</b>, он кислород не переносит (отравление нитритами, некоторыми лекарствами). <b>Угарный газ</b> связывается с гемом в 200–250 раз прочнее кислорода — отравление CO опасно даже при небольших концентрациях.',
    sick: '<b>Серповидноклеточная анемия</b> — классическая «молекулярная болезнь» (Л. Полинг, 1949). Одна замена в гене β-цепи: глутаминовая кислота → валин в 6-й позиции (HbS). Гидрофобный валин на поверхности молекулы в дезокси-форме прилипает к соседнему гемоглобину — молекулы <b>полимеризуются</b> в длинные жёсткие волокна (14-нитчатые тяжи), и эритроцит деформируется в «серп». Такие клетки закупоривают капилляры (боли, инфаркты органов) и быстро разрушаются (анемия). Носители одного гена HbS устойчивее к тропической малярии — поэтому ген частый в Африке.',
  };
  const labels = [
    { text: 'α-цепь', get pos() { return cenA.clone().applyMatrix4(dimer1.matrixWorld); }, color: '#7FD6FF', show: () => st.labels && st.mode === 'o2' },
    { text: 'β-цепь', get pos() { return cenB.clone().applyMatrix4(dimer1.matrixWorld); }, color: '#FF8AB0', show: () => st.labels && st.mode === 'o2' },
    { text: 'гем · Fe²⁺', get pos() { return feP[0].clone().applyMatrix4(dimer1.matrixWorld); }, color: '#FF5A5A', show: () => st.labels && st.mode === 'o2' },
    { text: 'O₂', get pos() { return o2m[3].getWorldPosition(V3(0, 0, 0)); }, color: '#F04848', show: () => st.labels && st.mode === 'o2' && st.S < 0.9 },
    { text: 'порфириновое кольцо', pos: V3(40 - 2.6, 1.8, 0), color: '#9FB4FF', show: () => st.labels && st.mode === 'heme' },
    { text: 'Fe²⁺', get pos() { return hG.localToWorld(V3(0, 0, 0)).add(V3(0.45, -0.3, 0.3)); }, color: '#FF6A3A', show: () => st.labels && st.mode === 'heme' && st.lig !== 'met' },
    { text: 'Fe³⁺', get pos() { return hG.localToWorld(V3(0, 0, 0)).add(V3(0.45, -0.3, 0.3)); }, color: '#C08A5A', show: () => st.labels && st.mode === 'heme' && st.lig === 'met' },
    { text: 'проксимальный гистидин', pos: V3(40 + 0.6, -1.4, 0), color: '#7FA8FF', show: () => st.labels && st.mode === 'heme' },
    { text: 'O₂', get pos() { return hG.localToWorld(dist.clone().multiplyScalar(1.1)).add(V3(0.4, 0.1, 0)); }, color: '#F04848', show: () => st.labels && st.mode === 'heme' && st.lig === 'o2' },
    { text: 'CO', get pos() { return hG.localToWorld(dist.clone().multiplyScalar(1.1)).add(V3(0.4, 0.1, 0)); }, color: '#FF6A9A', show: () => st.labels && st.mode === 'heme' && st.lig === 'co' },
    { text: 'волокно HbS', pos: V3(80 + 3.2, 1.5, 0), color: '#C85A5A', show: () => st.labels && st.mode === 'sick' && st.poly > 0.6 },
    { text: 'эритроцит', pos: V3(80 - 2.6, 0.35, 0), color: '#FF6A6A', show: () => st.labels && st.mode === 'sick' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'o2', label: 'Кислород' }, { id: 'heme', label: 'Гем и железо' }, { id: 'sick', label: 'Серповидноклеточная анемия' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    const msg = (m) => { st.msg = m; refs.setInfo(); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'o2') box.append(h('div', { class: 'glabel' }, 'pO₂ и факторы'), h('div', { class: 'gctl' },
        range('hP', 5, 110, 1, () => st.pO2, (v) => { st.pO2 = v; }, (v) => `${v} мм рт. ст.`),
        toggle('Ацидоз pH 7,2', () => st.ph < 7.3, (v) => { st.ph = v ? 7.2 : 7.4; msg(v ? '<b>Эффект Бора.</b> В работающих тканях много CO₂ и H⁺: протоны присоединяются к гемоглобину и стабилизируют T-состояние — сродство к O₂ падает, кривая сдвигается вправо, и кислород отдаётся именно там, где он нужнее всего. В лёгких — обратный процесс.' : null); }),
        toggle('2,3-БФГ', () => st.bpg, (v) => { st.bpg = v; msg(v ? '<b>2,3-Бисфосфоглицерат</b> (из гликолиза эритроцитов) садится в центральную полость между β-цепями дезоксигемоглобина и снижает сродство к O₂. Его становится больше в горах и при анемии — тканям достаётся больше кислорода.' : null); }),
        toggle('Фетальный HbF', () => st.fetal, (v) => { st.fetal = v; msg(v ? '<b>Фетальный гемоглобин</b> (α₂γ₂) плохо связывает 2,3-БФГ, его кривая левее — плод забирает кислород у крови матери через плаценту.' : null); }),
        toggle('Угарный газ', () => st.co, (v) => { st.co = v; msg(v ? '<b>Отравление CO.</b> Карбоксигемоглобин не переносит O₂ (здесь занята половина гемов), а оставшиеся гемы держат кислород крепче (кривая влево) — двойной удар по доставке кислорода. Лечение — чистый кислород, в тяжёлых случаях барокамера.' : null); }),
        toggle('Миоглобин', () => st.mb, (v) => { st.mb = v; msg(v ? '<b>Миоглобин</b> мышц — одна цепь, один гем, без кооперативности: гиперболическая кривая, сродство очень высокое. Он забирает O₂ у гемоглобина и отдаёт митохондриям только при сильной нагрузке.' : null); }),
        toggle('Поверхность', () => st.surf, (v) => { st.surf = v; })));
      else if (st.mode === 'heme') box.append(h('div', { class: 'glabel' }, 'Шестое место у железа'), h('div', { class: 'gctl' }, seg([{ id: 'o2', label: 'O₂ (оксигемоглобин)' }, { id: 'none', label: 'Пусто (дезокси)' }, { id: 'co', label: 'CO (карбокси)' }, { id: 'met', label: 'Fe³⁺ (мет-Hb)' }], () => st.lig, (v) => { st.lig = v; })));
      else box.append(h('div', { class: 'glabel' }, 'Кислород'), h('div', { class: 'gctl' }, seg([{ id: 'deoxy', label: 'Мало O₂: полимеризация' }, { id: 'oxy', label: 'Много O₂: норма' }], () => st.sick, (v) => { st.sick = v; st.cyc = 0; })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['o2', 'heme', 'sick'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'o2' ? [['Насыщение', Math.round((st.S || 0) * 100), '%'], ['P50', P50().toFixed(0), 'мм рт. ст.'], ['O₂ на гемах', Math.round((st.S || 0) * 4), 'из 4']] : st.mode === 'sick' ? [['Полимеризация', Math.round((st.poly || 0) * 100), '%']] : [['Hb в крови', '120–160', 'г/л']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF5A5A',
    kicker: 'Биохимия · кровь', title: 'Гемоглобин и перенос кислорода',
    lede: 'Около 270 миллионов молекул гемоглобина в каждом эритроците. Как этот белок забирает кислород в лёгких и вовремя отдаёт его тканям.',
    notes: `
      <div><h2>Гемоглобин</h2>
        <p>Хромопротеин: белок глобин + 4 гема. Норма: 130–160 г/л у мужчин, 120–140 г/л у женщин. Формы: HbA (α₂β₂, 97%), HbA₂ (α₂δ₂), фетальный HbF (α₂γ₂). Производные: оксигемоглобин, дезоксигемоглобин, карбгемоглобин (CO₂ на аминогруппах), карбоксигемоглобин (CO), метгемоглобин (Fe³⁺), гликозилированный HbA1c (отражает средний сахар за 2–3 месяца при диабете).</p>
        <h3>Перенос CO₂</h3><p>Около 10% CO₂ кровь везёт в виде карбгемоглобина, остальное — в виде бикарбоната: карбоангидраза эритроцитов превращает CO₂ + H₂O в H₂CO₃ → H⁺ + HCO₃⁻; H⁺ захватывает гемоглобин (буфер).</p>
        <h3>Гемоглобинопатии</h3><p>Качественные (HbS и сотни других мутантных гемоглобинов) и количественные — <b>талассемии</b> (снижен синтез α- или β-цепей).</p></div>
      <div><h2>Модели</h2><ul><li>Гемоглобин — PDB 4HHB (дезоксигемоглобин); гем с O₂ и гистидины крупным планом — 1GZX (оксигемоглобин). Поворот димеров при оксигенации показан условно.</li><li>Кривая насыщения — уравнение Хилла (n ≈ 2,8; P50 ≈ 27 мм рт. ст.).</li><li>Волокно HbS и эритроцит — схематично; молекулы в волокне — поверхность реального гемоглобина.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('o2'); st.fly = null;
  return self;
}
export { makeHemoglobin };
