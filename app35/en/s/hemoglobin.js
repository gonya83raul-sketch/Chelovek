import { Sparks, THREE, V3, __set_rnd, displaceGeo, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, range, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, CYL, MOL, PDB, bioStage, caPoints, cartoon, molGlow, molMesh, plotAxes, plotLine, surfaceMesh } from './kit.js';
Object.assign(BIO_PDB, {"hbo":{"title":"Oxyhemoglobin 1GZX, α chain","r":24.1,"chains":[{"id":"A","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCCHHHHHHHHHHHHHHCCCHHHHHHHHHHHHHHHCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHCCCCHHHHCHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHHCCCCC","ca":"cgC5/qX/dADq/mz/fgDK/if/pwDv/vD+ZQD9/tH+TAAg/xH/jABH/xf/hQBf/9D+PAB1/9v+TACb/xr/iADB//z+XQDS/8H+HwDs/+n+SgAOAB7/bgApAOD+MgBTAMn+HwBtAA7/YgCPAAn/XADWACP/GADLAEL/LACWAHX/JgDJAK7/5P/kAJX/zP+bAI3/5v+HANT/wf/GAPL/gP+yAM3/iP9oAOT/jf9/ACsAT/+rACMAJv9wAAUAPv9GAEAAKf93AHgA5P6AAFYA0v43AEIA7v4ZAIUA7v5OALwADv8fAO0AUv8rAMwATP90AOcAXP9YACwBp/9bABkBpv+jAAEBhv/FAD4Bvf/9ADkBr/8KAe4Af/87AcwAVv8MAaIALf9BAYEAL/9BATMAbv9hARgAkv9cAVsA3P9qAU8A6P81AYIAxP8DAVcA6f8YARYAKQAXAT8AHQDOAFUABAC0ABEARgDKAPT/bgCkACcARQBmAB0ASQBuANH/lwB0ANn/mgAzAAIAdAAOAMv/oAArAJX/3AAQALr/vgDJ/8T/sgDI/3f/+wDh/2//EgGl/5b/3QB0/4T/EgE+/4r/JQFS/9D/5QBs//P/9ABR/zkANgF3/zwAHgG0/xQA5QC6/0gAAgGe/4oAAgHk/6YAuQDy/5oAqQCt/7UAzAC///cApgABAPoAYADj/+4AcgCo/xsBjQDI/1oBfwAQAFcBOwAXADIBHADS/0EB5f/U/wsBuf+X/woBxv9t/88AgP9v/7cAif+3/6MAvv+m/24AiP+D/0gAXP/D/0cAkv/y/zAAp/++//r/YP++/+D/W/8LAN7/n/8QALf/gv/d/4T/Qv8GAH//bf9GAHX/mP8nAD7/W/8KAB3/PP9RAB3/eP9vAPz+m/86AM3+X/8bAKz+hv8LAG/+uP/i/5j+jP/L/9D+gP+I/67+bP9F/8/+tP8q/8/+0v9t/+f+m/9v/xz/rf8l/zL/9/8+/zP/7v98/1r/wv9X/43/+P8j/5j/LABc/5//BQCE/9P/+f9D//f/QwA1//f/VgB8/w4AIgB3/0kAQAAz/1oAhwBT/2EAagCM/4sASQBd/70AfwAn/8AAnwBC//8AYQBF/ywBbgAM/14B","o":"vNTFY/QA5l8RAGT38Vzc11sK/mMKBV7ezlPo5VwdC2MA/VvX4F/8EGERJlwI6F3k2l0EEO1h8FI3rwo6udk60gZZpv8rrN8sydZIvf1LovYhvcQswttFrgI5qN8jwsUzzPFUpPYnw7IIYwcOKkE/OAVTYg4QLVQgJxVZYBQS0knO0VYTGGD0rt0tQ/q20sDCYfHt+GITUTfvHKrVUtfYT8P0KajnLrnKVtHpN6/tHLLJOLvSSLzzJKbpG7PGSM7QOK70HK/NMsq8TcbmJqXyJbrDVuTWCdFYxb4vJqcbJUNB8Vcu7ihaEUtABGMQvSVA2/Zc6SJbvBxEueZC2Ppc2QlcqAQvyNJF/hdhyiFNsSsrtP1BPrTr4D65EQWezfCr8VLJFjSu6QefyiKz9TyxDh6i6Aef3EzKBDetACGi0xqr8kC0DRyh7QKe00jKKEvLFqAT1qX6BqrOKqUHnf0QNQxUBepiO+BKNwhTFBhfFudePO5OHCJaDBNiJeRZQv5LGxpdC+9iMe1VPRJNDP1jE9pbM/NVCTtQ3MZJDKUoKTlI8DJVErpF","brk":[]}],"ligs":[{"el":"Fe C C C C N C C C C C C C C O O N C C C C C C C N C C C C C C C N C C C C C C C C O O","xyz":"JQAxAJMASwBjALIAUwAwAGAABAD9/3cA9f84AMIASQBEAIwAUwBaAJoAZwBmAIkAagBYAHMAWABDAHQAfgBdAFwAdgB+AJUAjABzAKgAogCJAKkAnQChAK8AuAB+AKIAKgAbAHIAPgAfAF8AOQANAEgAIwD+/04AGgAHAGgATAAMAC8AFgDq/zwAEADS/0AAAwAeAJwA9v8JAI0A3P8EAJcA2P8VAKsA8P8lAK8Ayv/v/4sAv/8ZAL4Apf8XALcAIQBIALQACwBKAMUADgBfANgAJgBqANIAMgBcALwA+/9oAO4ANACCAOAAJACbANYALwCyAOYANgDGANgAMQCwAP8A","b":"AAAFAAAAEAAAABgAAAAgAAEABgABACQAAgAJAAIAEQADABQAAwAZAAQAHAAEACEABQAGAAUACQAGAAcABwAIAAcACwAIAAkACAAKAAsADAAMAA0ADQAOAA0ADwAQABEAEAAUABEAEgASABMAEgAVABMAFAATABYAFgAXABgAGQAYABwAGQAaABoAGwAaAB0AGwAcABsAHgAeAB8AIAAhACAAJAAhACIAIgAjACIAJQAjACQAIwAmACYAJwAnACgAKAApACgAKgA=","name":"HEM","chain":"A","seq":1142},{"el":"O O","xyz":"FABFAIAAAABMAHQA","b":"AAABAA==","name":"OXY","chain":"A","seq":1143}],"res":[{"el":"N C C O C C N C C N","xyz":"GgDrAE8AHQDOAFUAGQC9ADsAJwCoADcADADIAG4AEQCsAHkAJQCkAIgAAwCVAHQAJQCKAIwAEACBAIEA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS58","chain":"A"},{"el":"N C C O C C N C C N","xyz":"ewDu/+4AYADj/+4AXgDO/wUBSADQ/xABVADY/9IATwDv/74AYwD8/7AAOAD8/7gAWAAQAKIAPgARAKYA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"A"}]}});
Object.assign(BIO_MOL, {"met":{"name":"Methionine","el":"N C C C S C C O O H H H H H H H H H H H","xyz":"8f9R/+H/OwDE/6//2/8tAHn/rv+RAOL/T/89AGMA0/7V/xIAmgD4/xoAgwDi/5AADgFBAPX/rP80/53/MQAF//T/eACg/1r/CwBiACf/gv/6/1D/AgDGAA4Abf/bALL/9P5u/xQAxf72/6v/dP7e/0gA/gCVAMb/","b":"AAABAAEAAgACAAMAAwAEAAQABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAMADgADAA8ABQAQAAUAEQAFABIACAATAA==","o":"1111112111111111111"},"co":{"name":"Carbon monoxide","el":"C O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"3"},"o2":{"name":"Oxygen","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"}});


// @scene hemoglobin makeHemoglobin | Гемоглобин и перенос кислорода | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ГЕМОГЛОБИН: реальная структура 4HHB, кооперативное связывание O₂,
   кривая диссоциации (эффект Бора, 2,3-БФГ, CO, фетальный Hb, миоглобин), гем и железо,
   серповидноклеточная анемия (полимеризация HbS)
   ========================================================= */
function makeHemoglobin() {
  __set_rnd(mulberry(2401));
  const scene = bioStage({ bg: 0x0a0608, rim: 0xff5a5a });
  const VIEW = { o2: flyTarget(V3(-0.6, -1.6, 0), V3(0.8, 0.3, 21.2)), heme: flyTarget(V3(39.0, -1.6, 0), V3(40, 5.2, 12.2)), sick: flyTarget(V3(79.8, -1.7, 0), V3(80.4, 0.0, 18.5)) };
  // цель камеры — в центре модели, место под нижнюю панель — сдвигом кадра: вращение и приближение идут вокруг модели
  const VOFF = 0.16; Object.values(VIEW).forEach((v) => { const d = VOFF * 2 * Math.tan(17 * Math.PI / 180) * v.pos.distanceTo(v.target); v.target.y += d; v.pos.y += d; });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.o2.pos); camera.setViewOffset(1, 1, 0, VOFF, 1, 1);
  const controls = makeControls(camera, VIEW.o2.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  const HB = PDB('hb'); const SC = 0.075;
  /* ---------- 1. гемоглобин и O₂ ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.8, 0.9, 0); scene.add(G1);
  // центр тетрамера и ось поворота димеров (T→R): ось через центр, перпендикулярна оси 2-го порядка
  const caCen = (ids) => { const p = caPoints('hb', SC, ids); return p.reduce((v, q) => v.add(q), V3(0, 0, 0)).multiplyScalar(1 / p.length); };
  const hC = caCen(['A', 'B', 'C', 'D']), dC1 = caCen(['A', 'B']), dC2 = caCen(['C', 'D']);
  const dyad = caCen(['A']).sub(caCen(['C'])).cross(caCen(['B']).sub(caCen(['D']))).normalize();
  const twAx = dC2.clone().sub(dC1); twAx.addScaledVector(dyad, -twAx.dot(dyad)).normalize(); // линия между димерами ⟂ оси 2-го порядка
  const piv1 = new THREE.Group(), piv2 = new THREE.Group(); piv1.position.copy(hC); piv2.position.copy(hC); G1.add(piv1, piv2);
  const dimer1 = new THREE.Group(), dimer2 = new THREE.Group(); dimer1.position.copy(hC).negate(); dimer2.position.copy(hC).negate(); piv1.add(dimer1); piv2.add(dimer2);
  HB.chains.forEach((c, k) => { const m = cartoon(c, { scale: SC, color: k % 2 ? '#FF8AB0' : '#7FD6FF', k: 0.55 }); (k < 2 ? dimer1 : dimer2).add(m); });
  const hemeM = HB.ligm.map((l) => { const m = molMesh(l, { scale: SC }); (l.chain === 'A' || l.chain === 'B' ? dimer1 : dimer2).add(m); return m; });
  const feP = HB.ligm.map((l) => { const i = l.el.indexOf('Fe'); return V3(l.xyz[i * 3], l.xyz[i * 3 + 1], l.xyz[i * 3 + 2]).multiplyScalar(SC); });
  const feGlow = feP.map((p, k) => glowNucleus(HB.ligm[k].chain === 'A' || HB.ligm[k].chain === 'B' ? dimer1 : dimer2, p, '#FF4A4A', 0.05, 8));
  // O₂: связанный — над плоскостью гема с дистальной стороны (против проксимального His F8), Fe–O–O под углом ~120°.
  // Молекула O₂ и расстояние Fe–O увеличены в 1,6 раза, чтобы были заметны; остальное — в масштабе белка.
  const O2K = 1.6, O2M = { id: 'o2b', name: 'O₂', el: ['O', 'O'], xyz: new Float32Array([0, 0, 0, 1.048, 0.605, 0]), b: [0, 1], o: [2], n: 2 };
  const hemeN = HB.ligm.map((l) => {
    const at = (i) => V3(l.xyz[i * 3], l.xyz[i * 3 + 1], l.xyz[i * 3 + 2]);
    const fe = at(l.el.indexOf('Fe')); const ns = []; l.el.forEach((e, i) => { if (e === 'N') ns.push(at(i)); });
    let n = ns[1].clone().sub(ns[0]).cross(ns[2].clone().sub(ns[0])).normalize();
    const his = HB.resm.find((r) => r.chain === l.chain && (r.name === 'HIS87' || r.name === 'HIS92'));
    if (his) { let best = null, bd = 1e9; his.el.forEach((e, i) => { if (e !== 'N') return; const q = V3(his.xyz[i * 3], his.xyz[i * 3 + 1], his.xyz[i * 3 + 2]); const d = q.distanceTo(fe); if (d < bd) { bd = d; best = q; } }); if (best && n.dot(best.clone().sub(fe)) > 0) n.negate(); }
    return n;
  });
  const qO2 = hemeN.map((n) => new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), n));
  const o2m = feP.map((p, k) => { const m = molMesh(O2M, { scale: SC * O2K, bondR: 0.16 }); molGlow(m, 0.35); G1.add(m); return m; });
  const surf = surfaceMesh(caPoints('hb', SC), { radius: 0.34, res: 56, mat: glassMat(0xff7a7a, { rim: 0.12, base: 0.003, pow: 3.0, keep: true }) }); G1.add(surf);
  const cenA = caCen(['A']), cenB = caCen(['B']);
  // подпись: от центра тетрамера наружу в плоскости экрана
  const scrOut = (pW, k) => { const c = G1.localToWorld(hC.clone()), v = camera.getWorldDirection(V3(0, 0, 0)); const d = pW.clone().sub(c); d.addScaledVector(v, -d.dot(v)); if (d.length() < 0.2) d.set(0, 1, 0); return pW.add(d.normalize().multiplyScalar(k)); };
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
  // координационные связи Fe–N(ε2) His F8 и Fe–O₂ (molFromSet связывает атомы только внутри набора) + водородная связь O₂···His E7
  const atP = (m, i) => V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2]).sub(hc).multiplyScalar(HS); // в системе hG (Fe — в нуле)
  const nearest = (m, el, p) => { let bi = -1, bd = 1e9; m.el.forEach((e, i) => { if (e !== el) return; const d = atP(m, i).distanceTo(p); if (d < bd) { bd = d; bi = i; } }); return atP(m, bi); };
  const ne2F8 = nearest(his, 'N', V3(0, 0, 0)), o1 = nearest(oxy, 'O', V3(0, 0, 0));
  const o2far = (() => { const a = atP(oxy, 0), b = atP(oxy, 1); return a.length() > b.length() ? a : b; })();
  const ne2E7 = nearest(his2, 'N', o2far);
  const ringC = (m, p0) => { const c = V3(0, 0, 0); let n = 0; m.el.forEach((e, i) => { const q = atP(m, i); if (q.distanceTo(p0) < 2.4 * HS) { c.add(q); n++; } }); return c.multiplyScalar(1 / n); };
  const hisF8C = ringC(his, ne2F8), hisE7C = ringC(his2, ne2E7);
  const bondMat = new THREE.MeshPhysicalMaterial({ color: 0xc8906a, roughness: 0.35, clearcoat: 0.5, emissive: 0xff7a3a, emissiveIntensity: 0.15 });
  const stick = (a, b, r = 0.045, mat = bondMat) => { const m = new THREE.Mesh(CYL, mat); const d = b.clone().sub(a); m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); hG.add(m); return m; };
  stick(V3(0, 0, 0), ne2F8);
  const feO = stick(V3(0, 0, 0), o1);
  const feC = stick(V3(0, 0, 0), dist.clone().multiplyScalar(1.8 * HS));
  const hbDash = new THREE.Group(); hG.add(hbDash); { const dm = new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.85 }); for (let k = 0; k < 4; k++) hbDash.add(stick(o2far.clone().lerp(ne2E7, (k * 2 + 0.5) / 8), o2far.clone().lerp(ne2E7, (k * 2 + 1.5) / 8), 0.018, dm)); }
  // точка подписи кольца: край порфирина со стороны пиррольного азота
  const ringEdge = (() => { const ns = []; hm.el.forEach((e, i) => { if (e === 'N') ns.push(atP(hm, i)); }); return ns[0].clone().multiplyScalar(2.9); })();
  /* ---------- 3. серповидноклеточная анемия ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const surfGeo = surfaceMesh(caPoints('hb', 0.02), { radius: 0.13, res: 28 }).geometry;
  const NF = 60; const fib = new THREE.InstancedMesh(surfGeo, new THREE.MeshPhysicalMaterial({ color: 0x5a1a20, roughness: 0.45, clearcoat: 0.35, emissive: 0x401014, emissiveIntensity: 0.1 }), NF); G3.add(fib);
  const fibHome = Array.from({ length: NF }, (_, i) => { const k = i % 7, row = Math.floor(i / 7); const a = k / 7 * Math.PI * 2 + row * 0.35; return V3(0.7 + row * 0.62, 0.1 + Math.cos(a) * 0.5, Math.sin(a) * 0.5); });
  const fibFree = Array.from({ length: NF }, () => V3(rand(-0.4, 6.2), rand(-1.4, 1.8), rand(-1.6, 1.6)));
  const rbcGeo = (sickle) => displaceGeo(new THREE.SphereGeometry(1, 64, 48), (v) => { const r2 = v.x * v.x + v.z * v.z; const y = v.y * (0.22 + 0.6 * r2); if (!sickle) { v.y = y; return; } const x = v.x; v.x = x * 1.9; v.z = v.z * 0.42 * (1 - 0.55 * x * x) + 0.95 * x * x - 0.4; v.y = y * 0.85; });
  const rbcN = rbcGeo(false), rbcS = rbcGeo(true);
  const rbc = new THREE.Mesh(rbcN.clone(), organMat('#C83A3A', 0.5, { emissiveIntensity: 0.06 })); rbc.position.set(-3.0, -0.6, 0); rbc.scale.setScalar(1.6); G3.add(rbc);
  // волокно — «врезка под лупой»: масштабы клетки (8 мкм) и молекул (6 нм) разные, это показано кругом и линиями-выносками
  const lupa = new THREE.Group(); G3.add(lupa);
  { const lm = new THREE.MeshBasicMaterial({ color: 0xffb0b0, transparent: true, opacity: 0.45 }); const LC = V3(3.2, 0.15, 0), LR = 3.0, sc = V3(-2.75, -0.35, 0.5), sr = 0.16;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LR, 0.02, 8, 120), lm); ring.position.copy(LC); lupa.add(ring);
    const sRing = new THREE.Mesh(new THREE.TorusGeometry(sr, 0.015, 8, 40), lm); sRing.position.copy(sc); lupa.add(sRing);
    const lineM = new THREE.LineBasicMaterial({ color: 0xffb0b0, transparent: true, opacity: 0.4 });
    [1, -1].forEach((k) => { const g = new THREE.BufferGeometry().setFromPoints([sc.clone().add(V3(0, k * sr, 0)), LC.clone().add(V3(-Math.sqrt(1 - 0.36) * LR, k * 0.6 * LR, 0))]); lupa.add(new THREE.Line(g, lineM)); }); }
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
      const qG = G1.getWorldQuaternion(new THREE.Quaternion()).invert();
      o2m.forEach((m, k) => {
        const bound = k < nb; const dm1 = HB.ligm[k].chain === 'A' || HB.ligm[k].chain === 'B' ? dimer1 : dimer2;
        const home = G1.worldToLocal(dm1.localToWorld(feP[k].clone().addScaledVector(hemeN[k], 1.8 * SC * O2K)));
        const target = bound ? home : o2out[k];
        const qT = bound ? qG.clone().multiply(dm1.getWorldQuaternion(new THREE.Quaternion())).multiply(qO2[k]) : new THREE.Quaternion().setFromEuler(new THREE.Euler(t * 0.7 + k, t * 0.5 + k * 2, 0));
        m.position.lerp(target, 1 - Math.exp(-dt * 2.5)); m.quaternion.slerp(qT, 1 - Math.exp(-dt * 3)); m.visible = !(st.co && k >= 2); feGlow[k].spr.material.opacity = bound ? 0.9 : 0.25; feGlow[k].spr.material.color.set(bound ? '#FF3A3A' : '#8A3A7A'); });
      // R-состояние: димеры поворачиваются друг относительно друга на ~15°
      const R = smooth(0.25, 0.75, S); st.tw = (st.tw || 0) + ((R * 0.18) - (st.tw || 0)) * Math.min(1, dt * 2);
      piv1.quaternion.setFromAxisAngle(twAx, -st.tw / 2); piv2.quaternion.setFromAxisAngle(twAx, st.tw / 2);
    }
    if (st.mode === 'heme') {
      G2.rotation.y += st.rot ? dt * 0.3 : 0;
      o2b.visible = feO.visible = hbDash.visible = st.lig === 'o2'; coB.visible = feC.visible = st.lig === 'co';
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
    const A = plotAxes(ctx, w, h, { title: 'Hb O₂ saturation', xl: 'pO₂ 0–110 mmHg', yl: '%' });
    const base = { ph: st.ph, bpg: st.bpg, co: st.co, fetal: st.fetal };
    st.ph = 7.4; st.bpg = false; st.co = false; st.fetal = false; plotLine(ctx, A, (u) => satHb(u * 110), 'rgba(255,255,255,.3)', { lw: 1.2, dash: [3, 3] }); Object.assign(st, base);
    if (st.mb) plotLine(ctx, A, (u) => satMb(u * 110), '#C77DFF', { lw: 1.4 });
    plotLine(ctx, A, (u) => satHb(u * 110), '#FF5A5A');
    [[100, 'lungs'], [40, 'tissues'], [20, 'muscle']].forEach(([p, n]) => { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(A.X(p / 110), A.Y(0)); ctx.lineTo(A.X(p / 110), A.Y(1)); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText(n, A.X(p / 110) - 12, A.Y(0) - 3); });
    ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.pO2 / 110), A.Y(satHb(st.pO2)), 4.5, 0, Math.PI * 2); ctx.fill();
  }
  const TXT = {
    o2: '<b>Hemoglobin</b> (real structure PDB 4HHB): 2 α chains (light blue) and 2 β chains (pink), each with a <b>heme</b> carrying an Fe²⁺ ion that reversibly binds O₂. Binding is <b>cooperative</b>: the first O₂ molecule binds with difficulty but changes the protein’s shape (the transition from the tense T state to the relaxed R state — the chain pairs rotate by ~15°), and each subsequent one binds more easily. That is why the saturation curve is S-shaped: in the lungs (pO₂ ≈ 100) Hb becomes almost fully saturated, while in tissues (≈ 40) and working muscles (≈ 20) it releases a lot of oxygen. Move pO₂ and turn on the factors.',
    heme: '<b>Heme</b> is a flat porphyrin ring with an iron ion in the center (real coordinates of oxyhemoglobin 1GZX: you can see that O₂ is bound at an angle). The iron is bonded to the 4 nitrogen atoms of the ring, its fifth bond goes to the protein’s <b>proximal histidine</b> F8, and the sixth position is for O₂. The distal histidine E7 (the second one) stabilizes O₂ with a hydrogen bond and hinders CO. The iron must be <b>ferrous</b>: oxidized Fe³⁺ gives <b>methemoglobin</b>, which does not carry oxygen (poisoning with nitrites and some drugs). <b>Carbon monoxide</b> binds heme 200–250 times more tightly than oxygen — CO poisoning is dangerous even at low concentrations.',
    sick: '<b>Sickle cell anemia</b> is the classic “molecular disease” (L. Pauling, 1949). A single substitution in the β-chain gene: glutamic acid → valine at position 6 (HbS). In the deoxy form, the hydrophobic valine on the molecule’s surface sticks to a neighboring hemoglobin — the molecules <b>polymerize</b> into long rigid fibers (14-stranded filaments), and the red blood cell deforms into a “sickle”. Such cells block capillaries (pain, organ infarcts) and are rapidly destroyed (anemia). Carriers of a single HbS allele (sickle cell trait) are more resistant to falciparum malaria — which is why the allele is common in Africa.',
  };
  const labels = [
    { text: 'α chain', get pos() { return scrOut(cenA.clone().applyMatrix4(dimer1.matrixWorld), 1.9); }, color: '#7FD6FF', show: () => st.labels && st.mode === 'o2' },
    { text: 'β chain', get pos() { return scrOut(cenB.clone().applyMatrix4(dimer1.matrixWorld), 1.9); }, color: '#FF8AB0', show: () => st.labels && st.mode === 'o2' },
    { text: 'heme · Fe²⁺', get pos() { return scrOut(feP[2].clone().applyMatrix4(dimer2.matrixWorld), 1.6); }, color: '#FF9A9A', show: () => st.labels && st.mode === 'o2' },
    { text: 'O₂', get pos() { return o2m[3].getWorldPosition(V3(0, 0, 0)); }, color: '#F04848', show: () => st.labels && st.mode === 'o2' && st.S < 0.9 },
    { text: 'porphyrin ring', get pos() { return hG.localToWorld(ringEdge.clone()); }, color: '#9FB4FF', show: () => st.labels && st.mode === 'heme' },
    { text: 'Fe²⁺', get pos() { return hG.localToWorld(V3(0, 0, 0)).add(V3(0.45, -0.3, 0.3)); }, color: '#FF6A3A', show: () => st.labels && st.mode === 'heme' && st.lig !== 'met' },
    { text: 'Fe³⁺', get pos() { return hG.localToWorld(V3(0, 0, 0)).add(V3(0.45, -0.3, 0.3)); }, color: '#C08A5A', show: () => st.labels && st.mode === 'heme' && st.lig === 'met' },
    { text: 'proximal histidine F8', get pos() { return hG.localToWorld(hisF8C.clone()).add(V3(0.45, -0.1, 0)); }, color: '#7FA8FF', show: () => st.labels && st.mode === 'heme' },
    { text: 'distal histidine E7', get pos() { return hG.localToWorld(hisE7C.clone()).add(V3(0.45, 0.1, 0)); }, color: '#7FA8FF', show: () => st.labels && st.mode === 'heme' },
    { text: 'O₂', get pos() { return hG.localToWorld(dist.clone().multiplyScalar(1.1)).add(V3(0.4, 0.1, 0)); }, color: '#F04848', show: () => st.labels && st.mode === 'heme' && st.lig === 'o2' },
    { text: 'CO', get pos() { return hG.localToWorld(dist.clone().multiplyScalar(1.1)).add(V3(0.4, 0.1, 0)); }, color: '#FF6A9A', show: () => st.labels && st.mode === 'heme' && st.lig === 'co' },
    { text: 'HbS fiber', pos: V3(80 + 3.4, 1.7, 0.6), color: '#E07A7A', show: () => st.labels && st.mode === 'sick' && st.poly > 0.6 },
    { text: 'Hb molecules · magnified ≈500×', pos: V3(80 - 1.9, 2.75, 0), color: '#FFB0B0', show: () => st.labels && st.mode === 'sick' },
    { text: 'red blood cell (8 µm)', pos: V3(80 - 4.2, 1.15, 0), color: '#FF6A6A', show: () => st.labels && st.mode === 'sick' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'o2', label: 'Oxygen' }, { id: 'heme', label: 'Heme and iron' }, { id: 'sick', label: 'Sickle cell anemia' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    const msg = (m) => { st.msg = m; refs.setInfo(); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'o2') box.append(h('div', { class: 'glabel' }, 'pO₂ and factors'), h('div', { class: 'gctl' },
        range('hP', 5, 110, 1, () => st.pO2, (v) => { st.pO2 = v; }, (v) => `${v} mmHg`),
        toggle('Acidosis pH 7.2', () => st.ph < 7.3, (v) => { st.ph = v ? 7.2 : 7.4; msg(v ? '<b>Bohr effect.</b> Working tissues have a lot of CO₂ and H⁺: protons bind to hemoglobin and stabilize the T state — O₂ affinity falls, the curve shifts to the right, and oxygen is released exactly where it is needed most. In the lungs the reverse happens.' : null); }),
        toggle('2,3-BPG', () => st.bpg, (v) => { st.bpg = v; msg(v ? '<b>2,3-Bisphosphoglycerate</b> (from red cell glycolysis) binds in the central cavity between the β chains of deoxyhemoglobin and lowers O₂ affinity. Its level rises at high altitude and in anemia, so tissues receive more oxygen.' : null); }),
        toggle('Fetal (HbF)', () => st.fetal, (v) => { st.fetal = v; msg(v ? '<b>Fetal hemoglobin</b> (α₂γ₂) binds 2,3-BPG poorly, so its curve lies further left — the fetus takes oxygen from the mother’s blood across the placenta.' : null); }),
        toggle('Carbon monoxide', () => st.co, (v) => { st.co = v; msg(v ? '<b>CO poisoning.</b> Carboxyhemoglobin does not carry O₂ (here half of the hemes are occupied), and the remaining hemes hold oxygen more tightly (the curve shifts left) — a double blow to oxygen delivery. Treatment is pure oxygen, and in severe cases a hyperbaric chamber.' : null); }),
        toggle('Myoglobin', () => st.mb, (v) => { st.mb = v; msg(v ? '<b>Muscle myoglobin</b> has one chain and one heme and no cooperativity: its curve is hyperbolic and its affinity very high. It takes O₂ from hemoglobin and releases it to the mitochondria only during intense exertion.' : null); }),
        toggle('Surface', () => st.surf, (v) => { st.surf = v; })));
      else if (st.mode === 'heme') box.append(h('div', { class: 'glabel' }, 'Sixth position on iron'), h('div', { class: 'gctl' }, seg([{ id: 'o2', label: 'O₂ (oxyhemoglobin)' }, { id: 'none', label: 'Empty (deoxy)' }, { id: 'co', label: 'CO (carboxy)' }, { id: 'met', label: 'Fe³⁺ (met-Hb)' }], () => st.lig, (v) => { st.lig = v; })));
      else box.append(h('div', { class: 'glabel' }, 'Oxygen'), h('div', { class: 'gctl' }, seg([{ id: 'deoxy', label: 'Low O₂: polymerization' }, { id: 'oxy', label: 'High O₂: normal' }], () => st.sick, (v) => { st.sick = v; st.cyc = 0; })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['o2', 'heme', 'sick'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'o2' ? [['Saturation', Math.round((st.S || 0) * 100), '%'], ['P50', P50().toFixed(0), 'mmHg'], ['O₂ on hemes', Math.round((st.S || 0) * 4), 'of 4']] : st.mode === 'sick' ? [['Polymerization', Math.round((st.poly || 0) * 100), '%']] : [['Hb in blood', '120–160', 'g/L']]; }
  const self = {
    mobZoom: 0.6, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF5A5A',
    kicker: 'Biochemistry · blood', title: 'Hemoglobin and oxygen transport',
    lede: 'About 270 million hemoglobin molecules in every red blood cell. How this protein picks up oxygen in the lungs and releases it to the tissues right when they need it.',
    notes: `
      <div><h2>Hemoglobin</h2>
        <p>A chromoprotein: the protein globin + 4 hemes. Normal range: 130–160 g/L in men, 120–140 g/L in women. Forms: HbA (α₂β₂, 97%), HbA₂ (α₂δ₂), fetal HbF (α₂γ₂). Derivatives: oxyhemoglobin, deoxyhemoglobin, carbaminohemoglobin (CO₂ on amino groups), carboxyhemoglobin (CO), methemoglobin (Fe³⁺), glycated HbA1c (reflects average blood sugar over 2–3 months in diabetes).</p>
        <h3>CO₂ transport</h3><p>About 70% of CO₂ is carried in the blood as bicarbonate, 15–20% as carbaminohemoglobin and 5–10% dissolved in plasma. Bicarbonate forms like this: red cell carbonic anhydrase converts CO₂ + H₂O into H₂CO₃ → H⁺ + HCO₃⁻; the H⁺ is taken up by hemoglobin (a buffer).</p>
        <h3>Hemoglobinopathies</h3><p>Qualitative (HbS and hundreds of other mutant hemoglobins) and quantitative — <b>thalassemias</b> (reduced synthesis of α or β chains).</p></div>
      <div><h2>Simplifications and models</h2><ul><li>Hemoglobin is PDB 4HHB (deoxyhemoglobin); the close-up of heme with O₂ and the histidines is 1GZX (oxyhemoglobin). The rotation of the dimers on oxygenation is shown schematically.</li><li>The saturation curve follows the Hill equation (n ≈ 2.8; P50 ≈ 27 mmHg).</li><li>The HbS fiber and the red blood cell are schematic; the molecules in the fiber are the surface of real hemoglobin, shown “under a magnifying glass” (enlarged about 500 times relative to the cell). The O₂ molecule in the first mode is enlarged 1.6 times.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('o2'); st.fly = null;
  return self;
}
export { makeHemoglobin };
