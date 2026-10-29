import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flyStep, flyTarget, glowNucleus, group, h, infoBox, makeControls, mulberry, noise3, organMat, rand, randUnit, rnd, scopeShow, seg, taperTube, toggle } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molFit, molMesh, plotAxes } from './kit.js';
Object.assign(BIO_MOL, {"calcitriol":{"name":"Кальцитриол","el":"C C C O C C O C C C C C C C C C C C C C C C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Wv5//8YAG/7B/2YAgf3N/2UAQf2W/9YAWP1hAFsAl/2mAOL/MP3WAIz/8v1IAJH/W/4HAO3/1f4aAL//V//r//r/zf8FAMD/1/9WAD3/agB3AB7/xQD6/xf/pQCV/4P/SAAs/0L/VADY//f/VABw/2UA1AAa/04AEQFH/8z/jgGb/9X/4AF1/1v/5QF4/0sAvwHe/7YALgJCAMYAJwKzAGEAhgIcAZ0AngHzAFMAWwKMAOP/J/5P/xsBxv50/8oAXP2a/wsAbv2y/ycB6/xnAFIAd/2UALYA0v37AAQAGv0yAaT/tP35/2f/HP6BAED/3f5UAGH/XP+x/1YAn/+zAEn/rP8cAOz+kQC5AGv/bwCqAL3+sADK/7X+KwEeABP/EAD2/o3/BQBf//3+hwDm/gr/jQAwABcAWQCe/8cA/v8u/14ADgEh/6kAsQCy/kQAKAHt/pD/dwEFANP/HwIf/3L/nQFb/wj/HgLJ/zz/1QET/24ATwKE/zEAXgEIAKIAtQGm/xUBkAIQAL4AKQJuACsBZQIzAQMB6wL1AJ8AggJ2AWEAqgFgAVAAYAHZAKgAbgHTAPf/KQK3AJz/","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABQAHAAcACAABAAgACAAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA8AEAAPABEACwARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABUAFwAXABgAGAAZABkAGgAaABsAGgAcABoAHQAAAB4AAAAfAAIAIAADACEABAAiAAQAIwAFACQABgAlAAcAJgAHACcACQAoAAoAKQAMACoADAArAA0ALAANAC0ADgAuAA4ALwAQADAAEAAxABAAMgARADMAEgA0ABIANQATADYAEwA3ABQAOAAVADkAFgA6ABYAOwAWADwAFwA9ABcAPgAYAD8AGABAABkAQQAZAEIAGwBDABsARAAbAEUAHABGABwARwAcAEgAHQBJAA==","o":"2111111112121111111111111111111111111111111111111111111111111111111111111111"},"calciol":{"name":"Холекальциферол (D3)","el":"C C C C C O C C C C C C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Vv6z//EAFv7T/4IAf/2p/34AYf1Z////kf2g/3//7v1M/zz/0v0oAJv/Q/4ZAAMAtP5NANj/Nf9PACYApv+FAPb/q//EAGr/NwDeADT/sACVAHD/lAA/AOj/TgC+/7L/KgCIAEIAMQBAAMcAxgAcANcA/gAQAEgAhAFSAEwAgwHpAFoAyAElAMv/WQILAO//dAKK/zoASwIN/+7/WwIY/1f/uwHo/hIAvf7G/wkBHf5+/0ABav1s/9YARP0EAIAA9fxJ//j/k/34/gYAO/2v/z7/zv3x/jz/9v1QAD3/h/1rAMX/tf57AHT/Ov8kAIoAdP8jAW7/d/+CACT/NgDFAMj+SwBKATr/2gBWACD/+wDiAIX/mgB2/5T/DwCW/wAAFADY/1r/TADvAEwA9//l/8cAEwCCABkB+QBqAA0BzwC9/woBDQGj/zkAvgEqAKEAugEXAQcAsgEGAbgAHAEOAVkAwgF2AIL/lwHO/6L/lQIOAJT/fQJfAC0A4QKE/0wARQKM/5wAjAK6/hAABQJK/yv/ZAK0/iz/tgJR/z//tgF7/iAAdwED/8H/ngEX/28A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA4AEAAKABAAEAARABEAEgASABMADgATABMAFAAUABUAFAAWABYAFwAXABgAGAAZABkAGgAZABsAAAAcAAAAHQACAB4AAgAfAAMAIAADACEABAAiAAUAIwAGACQABgAlAAgAJgAJACcACwAoAAsAKQAMACoADAArAA0ALAANAC0ADwAuAA8ALwAPADAAEAAxABEAMgARADMAEgA0ABIANQATADYAFAA3ABUAOAAVADkAFQA6ABYAOwAWADwAFwA9ABcAPgAYAD8AGABAABkAQQAaAEIAGgBDABoARAAbAEUAGwBGABsARwA=","o":"21111111212111111111111111111111111111111111111111111111111111111111111111"},"calcidiol":{"name":"Кальцидиол (25-OH-D3)","el":"C C C C C O C C C C C C C C C C C C C C C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"LP5XAOEA9/0kAHMAYf36/4AATf1q/1AAif1P/8b/7P3o/tL/y/3L/4j/Mf4KAOr/p/4bALH/H/9WAPT/lP9kALX/p/87ACH/NQBdAPH+pgAtAE7/hQA3AOH/SgCt/woAEQCfAPT/EAC7AIoApACwALUA6wBbAEkAZQGrACIATgElAc3/wAFJANz/KAIqAEgAdgKy/yAAIwIy/yEAAAIP/5H/ggLJ/lwArgEy/3AA6/1gADoBkf56AO4AQ/0DAOgAJv0+AEIA4vxU/0wAe/0m/5gAO/0s/4P/yf2h/goAff0VAHT/+P2u/yr/sv79/0f/HP92AF0Alv/P/xn/Xv9wAOT+PQDJAOf+RAAvAI/+uQDD/zb//wBlADT/FACE/7X/mwBq/yQABwC7/18ALAD6AL7/1v9wAL8A7P8eAZ8A0AASAbkAqgB+ABQBDgEAAHwAlAHPAIAAZQETAWT/6QBMAdf/kgF2Ae//8AF2AIX/igHw/8D/bAKCAE8A+QEfAKoAoQK//7v/ywKj/2QASQLJ/mn/AAJp/1P/nQHi/o3/2AK8/hoATQJq/mYApALq/r4AewHg/mAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA4AEAAKABAAEAARABEAEgASABMADgATABMAFAAUABUAFAAWABYAFwAXABgAGAAZABkAGgAZABsAGQAcAAAAHQAAAB4AAgAfAAIAIAADACEAAwAiAAQAIwAFACQABgAlAAYAJgAIACcACQAoAAsAKQALACoADAArAAwALAANAC0ADQAuAA8ALwAPADAADwAxABAAMgARADMAEQA0ABIANQASADYAEwA3ABQAOAAVADkAFQA6ABUAOwAWADwAFgA9ABcAPgAXAD8AGABAABgAQQAaAEIAGgBDABoARAAbAEUAGwBGABsARwAcAEgA","o":"211111112121111111111111111111111111111111111111111111111111111111111111111"},"dhc7":{"name":"7-Дегидрохолестерин","el":"C C C C C C C C C C C C C C C C C C C C C C C C C O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"hf4nAQMAxf6kANb/ZP45ALL/8/0yABoA1P2g/y8AhP12/7L/+fxO/+D/0f0H/2//Kf+HAEIAC/8dAKoAk//Y/8oA+f8sAIAAq/9bAAAA/v/IAL//hwCPAJL/2QBRAAQAfwDx/1cAoQB2/3gAKQE//00AfAGK/wYAYAEaANn/1AF0AAkARQIoAE4AdgKt/wEABAJN/97/uQLV/4v/bQEbAD//lf/k/6X/JP4zAdL/d/4lAW8Axv56Aej///69AHr/kv7X/6r/Nf5PAFD/Ff5eAHcAnP1oAPb/LP5h/zYAlv2R/4cAfv3M/2//s/xT/43/1/yS/y8A+/zo/ggA8/2+/rn/Kf4w/zv/kv3U/iX/Pv/lAHkA5f5JAAYByP7Q/4YAo//b/zUBkP9z/6UADACIALoAy//vAGf/EQAZAQUAwADiAGf/cgBGAET/6QClAEsAXgA3/7IARQHZ/mgAsgHCAE4A/QGmALH/IgIHALEAmQJsAF0AvgJ3/0EAEgLv/hQABAI5/3P/jwIkAGb/zgHz/yL/aQGCABr/HwHf/xP/8v+y/4n/Vf+a/9b/Yv8FAEn/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEACAAIAAkACQAKAAoACwALAAwACAAMAAwADQANAA4ADgAPAA8AEAALABAAEAARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABYAFwAXABgAEwAYABcAGQAUABoADAAbAAAAHAAAAB0AAAAeAAEAHwACACAAAgAhAAMAIgADACMABAAkAAQAJQAFACYABgAnAAYAKAAGACkABwAqAAcAKwAHACwACAAtAAkALgAJAC8ACgAwAAoAMQALADIADQAzAA0ANAAOADUADgA2AA8ANwARADgAEgA5ABUAOgAVADsAFgA8ABYAPQAXAD4AGAA/ABgAQAAZAEEAGgBCABoAQwAaAEQAGwBFABsARgAbAEcA","o":"111111111111111111212111111111111111111111111111111111111111111111111111111"}});


// @scene calcium makeCalcium | Кальций: паратгормон и витамин D | Гормоны
/* =========================================================
   БИОХИМИЯ · ОБМЕН КАЛЬЦИЯ: паратгормон, кальцитриол и кальцитонин — кишечник, почки, кости;
   болезни (гипер- и гипопаратиреоз, дефицит витамина D); активация витамина D (кожа → печень → почки);
   перестройка кости: остеокласты и остеобласты, RANKL, менопауза, бисфосфонаты
   ========================================================= */
function makeCalcium() {
  __set_rnd(mulberry(8401));
  const scene = bioStage({ rim: 0xf2e6c8 });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { reg: DK ? [V3(-1.0, 0.1, 0), V3(-0.5, 1.3, 21.5)] : [V3(-1.0, 0.0, 0), V3(-0.5, 1.0, 15.0)], vitd: [V3(39.9, -0.9, 0), V3(40.4, 0.6, 17)], bone: [V3(79.9, -1.8, 0), V3(79.9, 4.5, 10.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.reg[1]);
  const controls = makeControls(camera, VIEW.reg[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const CA = '#9FE0FF';   // кальций

  /* ---------- 1. регуляция в организме ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  bodyShell(G1, { rim: 0.28, keep: true, legs: true });
  const THY = V3(0, 3.28, 0.24), HRT = BODY.heart.clone(), LIV = V3(-0.35, 1.5, 0.18), KID = [V3(0.33, 1.12, -0.12), V3(-0.33, 1.12, -0.12)], GUT = V3(0.02, 0.45, 0.22), BONE = V3(0.5, -1.0, 0.05), SKIN = V3(1.15, 2.6, 0.15);
  const thyMat = organMat('#D86A8A', 0.45, { emissiveIntensity: 0.05, transparent: true, opacity: 0.6 });
  [-1, 1].forEach((s) => { const l = new THREE.Mesh(blobGeo(0.075, 0.15, 0.06, 2 + s, 0.08), thyMat); l.position.copy(THY).add(V3(s * 0.085, 0.01, 0)); l.rotation.z = -s * 0.25; G1.add(l); });
  const PTG = [V3(0.1, 3.35, 0.17), V3(-0.1, 3.35, 0.17), V3(0.1, 3.2, 0.17), V3(-0.1, 3.2, 0.17)].map((p) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), organMat('#F2C14E', 0.7, { emissiveIntensity: 0.3 })); m.position.copy(p); G1.add(m); return m; });
  const ptgG = glowNucleus(G1, V3(0, 3.28, 0.2), '#F2C14E', 0.03, 10);
  KID.forEach((p) => G1.add(new THREE.Mesh(ell3(0.13, 0.22, 0.1, p), organMat('#9A4A4A', 0.5))));
  const kidG = glowNucleus(G1, KID[0].clone().add(V3(0, 0, 0.12)), '#FF9A5C', 0.03, 10);
  G1.add(new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV), organMat('#9A4A3A', 0.45)));
  const heartM = new THREE.Mesh(ell3(0.2, 0.25, 0.18, HRT), organMat('#C84A50', 0.45)); G1.add(heartM);
  { const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120, a = u * Math.PI * 9; pts.push(GUT.clone().add(V3(Math.cos(a) * 0.36 * (0.5 + 0.5 * Math.sin(u * 7)), (u - 0.5) * 0.7, Math.sin(a) * 0.12))); } G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.04, 8), organMat('#E8A08A', 0.45, { emissiveIntensity: 0.05 }))); }
  const femur = new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(0.47, -0.2, 0.0), V3(0.5, -1.1, 0.02), V3(0.48, -2.0, 0.03)]), (u) => 0.07 + 0.05 * (Math.abs(u - 0.5) * 2) ** 3, 40, 14), organMat('#F2E6C8', 0.55, { emissiveIntensity: 0.06 })); G1.add(femur);
  const boneG = glowNucleus(G1, BONE.clone().add(V3(0, 0, 0.1)), CA, 0.03, 10);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), new THREE.MeshBasicMaterial({ color: '#FFD98A' })); sun.position.set(1.8, 4.0, 0.3); G1.add(sun);
  const A1 = {
    pthB: flowArrow(G1, PTG[2].position.clone().add(V3(0.05, -0.05, 0.05)), BONE.clone().add(V3(-0.02, 0.2, 0.1)), '#F2C14E', { bend: -0.12, r: 0.012 }),
    pthK: flowArrow(G1, PTG[3].position.clone().add(V3(-0.05, -0.05, 0.05)), KID[1].clone().add(V3(0.0, 0.2, 0.12)), '#F2C14E', { bend: 0.15, r: 0.012 }),
    d3: flowArrow(G1, KID[0].clone().add(V3(-0.05, -0.15, 0.15)), GUT.clone().add(V3(0.25, 0.2, 0.15)), '#FF9A5C', { bend: 0.3, r: 0.012 }),
    caG: flowArrow(G1, GUT.clone().add(V3(0.05, 0.3, 0.25)), HRT.clone().add(V3(-0.05, -0.2, 0.15)), CA, { bend: -0.25, r: 0.016 }),
    caB: flowArrow(G1, BONE.clone().add(V3(0.08, 0.3, 0.12)), HRT.clone().add(V3(0.12, -0.15, 0.15)), CA, { bend: 0.15, r: 0.016 }),
    caU: flowArrow(G1, KID[1].clone().add(V3(0.05, -0.2, 0.1)), V3(-0.05, -0.15, 0.25), CA, { bend: 0.2, r: 0.012 }),
    uv: flowArrow(G1, sun.position.clone().add(V3(0.15, -0.12, 0)), SKIN.clone(), '#FFD98A', { bend: 0.05, r: 0.01 }),
  };

  /* ---------- 2. витамин D: кожа → печень → почки ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const VD = [
    { id: 'dhc7', x: -2.6, organ: 'кожа', col: '#FFC8A8', enz: 'УФ-B: кольцо B рвётся' },
    { id: 'calciol', x: -0.25, organ: 'кожа / пища', col: '#FFD98A', enz: '25-гидроксилаза (печень)' },
    { id: 'calcidiol', x: 2.1, organ: 'печень — запас в крови', col: '#F2C14E', enz: '1α-гидроксилаза (почки)' },
    { id: 'calcitriol', x: 4.45, organ: 'почки — гормон', col: '#FF9A5C', enz: '' },
  ];
  VD.forEach((v, i) => { v.g = fit(v.id, 0.95); v.g.position.set(v.x, 0, 0); v.g.rotation.z = Math.PI / 2; G2.add(v.g); v.glow = glowNucleus(G2, V3(v.x, 0, -0.4), v.col, 0.1, 12); v.glow.core.visible = false; if (i < 3) v.arr = flowArrow(G2, V3(v.x + 0.85, 0.05, 0), V3(VD[i + 1] ? VD[i + 1].x - 0.85 : v.x + 1.5, 0.05, 0), v.col, { bend: 0.25, r: 0.025 }); });
  const inact = flowArrow(G2, V3(4.45, -0.7, 0), V3(4.45, -1.8, 0), '#8A8A96', { bend: 0.3, r: 0.02 });
  const sun2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), new THREE.MeshBasicMaterial({ color: '#FFD98A' })); sun2.position.set(-1.3, 2.7, 0); G2.add(sun2);
  const photons = Array.from({ length: 16 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshBasicMaterial({ color: '#D8B8FF' })); s.visible = false; G2.add(s); return { s, t: 0, on: false }; });

  /* ---------- 3. перестройка кости ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const SW = 9, NX = 90;
  const surfGeo = new THREE.PlaneGeometry(SW, 3.2, NX, 24); surfGeo.rotateX(-Math.PI / 2);
  const bonePos = surfGeo.attributes.position, base0 = Float32Array.from(bonePos.array); const bcol = new Float32Array(bonePos.count * 3).fill(1); surfGeo.setAttribute('color', new THREE.BufferAttribute(bcol, 3));
  const surf = new THREE.Mesh(surfGeo, new THREE.MeshPhysicalMaterial({ vertexColors: true, color: new THREE.Color('#E8DCC0').multiplyScalar(0.55), roughness: 0.7, clearcoat: 0.2, emissive: 0xf2e6c8, emissiveIntensity: 0.04, side: THREE.DoubleSide })); surf.position.y = -1.6; G3.add(surf);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(SW, 1.2, 3.2), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C8B898').multiplyScalar(0.45), roughness: 0.85 })); slab.position.y = -3.0; G3.add(slab);
  const prof = new Float32Array(NX + 1).fill(0);   // глубина ямы по x (0 — поверхность, <0 — яма, >0 — новый остеоид)
  const ocl = new THREE.Group(); G3.add(ocl);
  const oclM = new THREE.Mesh(blobGeo(0.95, 0.42, 0.7, 21, 0.18), organMat('#B08AE8', 0.5, { emissiveIntensity: 0.08 })); ocl.add(oclM);
  for (let i = 0; i < 5; i++) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), organMat('#6A4AB8', 0.7)); n.position.set(-0.55 + i * 0.27, 0.12, 0.25 * Math.sin(i * 2.1)); ocl.add(n); }
  const OB = Array.from({ length: 9 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.5), organMat('#7FD6A8', 0.5, { emissiveIntensity: 0.08 })); const n = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), organMat('#3A8A6A', 0.7)); n.position.y = 0.06; m.add(n); G3.add(m); return m; });
  const vessel = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-4.6, -0.7, -1.5), V3(-1, -0.55, -1.6), V3(2, -0.7, -1.45), V3(4.6, -0.55, -1.5)]), 60, 0.15, 12), organMat('#D84A50', 0.45, { emissiveIntensity: 0.06 })); vessel.visible = false; G3.add(vessel);
  const XI = (x) => clamp(Math.round((x + SW / 2) / SW * NX), 0, NX);
  function applyProf() {
    for (let i = 0; i < bonePos.count; i++) { const x = base0[i * 3], z = base0[i * 3 + 2]; const k = XI(x); const edge = Math.exp(-((z / 1.15) ** 4)); bonePos.setY(i, base0[i * 3 + 1] + prof[k] * edge + 0.02 * noise3(x * 1.7, z * 1.7, 0.5)); const d = clamp(-prof[k] * edge / 0.6, 0, 1); bcol[i * 3] = 1 - 0.25 * d; bcol[i * 3 + 1] = 1 - 0.6 * d; bcol[i * 3 + 2] = 1 - 0.45 * d; }
    bonePos.needsUpdate = true; surfGeo.attributes.color.needsUpdate = true; surfGeo.computeVertexNormals();
  }

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'reg', labels: true, rot: false, fly: null, msg: null, dis: 'norm', treat: false, Ca: 2.4, PTH: 3.9, D: 1, boneMass: 100, hist: [], sunS: 'summer', kidOK: true, pthHi: false, lv: [0.5, 0.6, 0.8, 0.6], bstate: 'norm', oclX: -2.6, oclDir: 1, obX: -2.6, bm: 100 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['reg', 'vitd', 'bone'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  function regUpdate(dt, t) {
    const D0 = st.dis, tr = st.treat;
    let diet = D0 === 'lowdiet' && !tr ? 0.5 : 1, vit = D0 === 'vitd' && !tr ? 0.25 : 1, fix = D0 === 'hyper' && !tr ? 14 : 0, cap = D0 === 'hypo' ? 0.8 : 0;
    if (D0 === 'hypo' && tr) { diet = 1.25; vit = 1.6; }
    for (let i = 0; i < 6; i++) {
      const h = Math.min(dt, 0.05) / 6 * 3;
      let pt = 0.8 + 10 / (1 + Math.exp(clamp((st.Ca - 2.36) / 0.05, -50, 50))); if (fix) pt = Math.max(pt, fix); if (cap) pt = Math.min(pt, cap);
      st.PTH += (pt - st.PTH) * h * 3;
      const p = st.PTH / (st.PTH + 4), p0 = 3.9 / 7.9;
      const Dt = vit * (0.3 + 0.7 * p) / (0.3 + 0.7 * p0); st.D += (Dt - st.D) * h * 0.5;
      st.gut = 0.6 * diet * st.D; st.boneNet = 0.45 * (p - p0); st.ren = 0.6 * (st.Ca / 2.4) ** 3 * (1.45 - 0.9 * p);
      st.Ca += 0.8 * (st.gut + st.boneNet - st.ren) * h;
      st.boneMass = clamp(st.boneMass - st.boneNet * h * 2 + (100 - st.boneMass) * h * (st.boneNet <= 0.02 ? 0.02 : 0), 55, 110);
    }
    const lv = (v) => clamp(v, 0.04, 1.2);
    A1.pthB.mat.uniforms.uOn.value = lv(st.PTH / 9); A1.pthK.mat.uniforms.uOn.value = lv(st.PTH / 9); A1.d3.mat.uniforms.uOn.value = lv(st.D * 0.55);
    A1.caG.mat.uniforms.uOn.value = lv(st.gut * 1.2); A1.caB.mat.uniforms.uOn.value = lv(0.2 + st.boneNet * 3); A1.caU.mat.uniforms.uOn.value = lv(st.ren * 1.1); A1.uv.mat.uniforms.uOn.value = D0 === 'vitd' && !tr ? 0.06 : 0.6;
    Object.values(A1).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    ptgG.spr.material.opacity = 0.15 + 0.6 * clamp(st.PTH / 12, 0, 1); ptgG.spr.scale.setScalar(0.5 + 0.4 * clamp(st.PTH / 12, 0, 1.2));
    PTG.forEach((m, i) => { m.scale.setScalar(D0 === 'hyper' && !tr && i === 0 ? 2.2 : D0 === 'hyper' && !tr ? 0.8 : 1); m.material.emissiveIntensity = 0.1 + 0.4 * clamp(st.PTH / 12, 0, 1); });
    kidG.spr.material.opacity = 0.15 + 0.5 * clamp(st.D / 1.6, 0, 1); boneG.spr.material.opacity = 0.1 + 0.6 * clamp(st.boneNet * 4, 0, 1);
    femur.material.color.set('#F2E6C8').multiplyScalar(0.25 + 0.3 * st.boneMass / 100);
    sun.visible = !(D0 === 'vitd' && !tr);
    heartM.scale.setScalar(1 + 0.07 * Math.max(0, Math.sin(t * Math.PI * 2 * 72 / 60)) ** 6);
    if (st.Ca < 2.0 && rnd() < dt * 14) fx.spawn(V3(1.45 + rand(-0.12, 0.12), 1.15 + rand(-0.15, 0.15), 0.1), V3(rand(-0.4, 0.4), rand(-0.3, 0.4), 0.3), C.set('#FF6A5A'), 0.7, 0.8, 1.4);   // судороги рук (тетания)
    if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.1) { st.hist.push([st.t, st.Ca, st.PTH]); while (st.hist.length && st.t - st.hist[0][0] > 30) st.hist.shift(); }
  }
  function vitdUpdate(dt, t) {
    const uv = st.sunS === 'summer' ? 1 : st.sunS === 'winter' ? 0.15 : 0.03;
    const one = st.kidOK ? (st.pthHi ? 1.6 : 1) : 0.08;
    const d25 = 0.25 + 0.75 * (0.15 + 0.85 * uv); const tg = [0.6, 0.15 + 0.85 * uv * 0.9 + 0.1, d25, 0.6 * one * Math.min(1, 0.45 + 0.6 * d25)];   // почки поддерживают кальцитриол, пока 25-OH-D не упал совсем
    st.lv = st.lv.map((v, i) => v + (tg[i] - v) * Math.min(1, dt * (i === 2 ? 0.25 : 0.8)));
    if (rnd() < dt * 14 * uv) { const p = photons.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.s.visible = true; p.from = sun2.position.clone().add(randUnit().multiplyScalar(0.25)); p.to = V3(-2.6 + rand(-0.4, 0.4), rand(-0.3, 0.3), 0.2); } }
    photons.forEach((p) => { if (!p.on) return; p.t += dt * 1.6; if (p.t >= 1) { p.on = false; p.s.visible = false; fx.spawn(p.to.clone().add(G2.position), V3(0, 0.3, 0.2), C.set('#D8B8FF'), 0.5, 0.6, 1); return; } p.s.position.copy(p.from).lerp(p.to, p.t); });
    VD.forEach((v, i) => { v.glow.spr.material.opacity = 0.1 + 0.6 * clamp(st.lv[i], 0, 1.2); v.glow.spr.scale.setScalar(1 + 0.1 * Math.sin(t * 3 + i)); v.g.rotation.x += dt * 0.25; if (v.arr) { v.arr.mat.uniforms.uTime.value = t; v.arr.mat.uniforms.uOn.value = clamp(i === 0 ? uv : i === 1 ? 0.6 : 0.6 * one, 0.04, 1); } });
    inact.mat.uniforms.uTime.value = t; inact.mat.uniforms.uOn.value = st.pthHi ? 0.15 : 0.5;
    sun2.material.color.set('#FFD98A').multiplyScalar(0.3 + 0.7 * uv);
  }
  function boneUpdate(dt, t) {
    const B = st.bstate;
    const res = B === 'pth' ? 1.7 : B === 'meno' ? 1.6 : B === 'ct' ? 0.35 : B === 'bisph' ? 0.15 : 1;
    const form = B === 'meno' ? 0.8 : B === 'pth' ? 1.15 : 1;
    // остеокласт ходит по поверхности и копает яму
    st.oclX += st.oclDir * dt * 0.35 * Math.min(1.4, res);
    if (st.oclX > 3.4) st.oclDir = -1; if (st.oclX < -2.8) st.oclDir = 1;
    const k = XI(st.oclX);
    for (let j = -4; j <= 4; j++) { const i = k + j; if (i < 0 || i > NX) continue; prof[i] = Math.max(-0.75, prof[i] - dt * 0.2 * res * Math.exp(-j * j / 6)); }
    if (rnd() < dt * 10 * res) fx.spawn(V3(st.oclX + rand(-0.5, 0.5), -1.75, rand(-0.4, 0.4)).add(G3.position), V3(rand(-0.1, 0.1), 1.0, rand(-0.6, -0.2)), C.set(CA), 1.0, 0.4, 1);
    // остеобласты заполняют ямы позади остеокласта
    for (let i = 0; i <= NX; i++) { const x = -SW / 2 + i / NX * SW; if (Math.abs(x - st.oclX) > 1.3 && prof[i] < 0) prof[i] = Math.min(0, prof[i] + dt * 0.035 * form); }
    applyProf();
    const yS = -1.6 + prof[k];
    ocl.position.set(st.oclX, yS + 0.35, 0); oclM.rotation.y = 0.2 * Math.sin(t * 0.7); oclM.material.emissiveIntensity = 0.04 + 0.08 * res * (0.5 + 0.5 * Math.sin(t * 5));
    // остеобласты стоят там, где яма заполняется
    const holes = []; for (let i = 0; i <= NX; i += 3) { const x = -SW / 2 + i / NX * SW; if (prof[i] < -0.08 && Math.abs(x - st.oclX) > 1.3) holes.push([x, prof[i]]); }
    OB.forEach((m, i) => { const hh = holes[Math.floor(i * holes.length / OB.length)]; m.visible = !!hh; if (hh) { m.position.set(hh[0], -1.6 + hh[1] + 0.2, -0.6 + (i % 3) * 0.6); m.material.emissiveIntensity = 0.05 + 0.08 * form * (0.5 + 0.5 * Math.sin(t * 3 + i)); } });
    st.bm = clamp(st.bm + dt * 1.6 * (form * 0.95 - res * 0.95), 50, 110);
    ocl.visible = true; ocl.scale.setScalar(B === 'bisph' ? 0.75 : B === 'ct' ? 0.6 : 1);
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'reg') regUpdate(dt, t);
    if (st.mode === 'vitd') vitdUpdate(dt, t);
    if (st.mode === 'bone') boneUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'vitd' && false) {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'уровень форм витамина D', x0: 10 });
      ['D₃', '25-OH-D', '1,25-(OH)₂-D'].forEach((n, i) => { const y = h * (0.3 + i * 0.24), v = st.lv[i + 1]; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(A.X(0), y - 5, A.X(1) - A.X(0), 10); ctx.fillStyle = VD[i + 1].col; ctx.fillRect(A.X(0), y - 3, (A.X(1) - A.X(0)) * clamp(v / 1.3, 0, 1), 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, A.X(0) + 2, y - 7); });
      return;
    }
    if (st.mode !== 'reg') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'Ca²⁺ (голубой, норма 2,2–2,6), ПТГ (жёлтый)', xl: 'время →' });
    const t1 = st.t, X = (tt) => A.X(clamp((tt - (t1 - 30)) / 30, 0, 1)), Yc = (c) => A.Y(clamp((c - 1.4) / 1.8, 0, 1));
    ctx.fillStyle = 'rgba(159,224,255,.10)'; ctx.fillRect(A.X(0), Yc(2.6), A.X(1) - A.X(0), Yc(2.2) - Yc(2.6));
    const line = (fy, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = fy(r); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
    line((r) => Yc(r[1]), CA); line((r) => A.Y(clamp(r[2] / 32, 0, 1)), '#F2C14E');
  }

  const DIS = { norm: 'Норма', lowdiet: 'Мало кальция в пище', vitd: 'Нет витамина D', hyper: 'Гиперпаратиреоз', hypo: 'Гипопаратиреоз' };
  const TREAT = { lowdiet: 'Молочные продукты', vitd: 'Добавки витамина D', hyper: 'Операция', hypo: 'Кальций + кальцитриол' };
  const DISTXT = {
    norm: '<b>Кальций крови</b> держится в узких пределах (2,2–2,6 ммоль/л): от него зависят возбудимость нервов и мышц, свёртывание крови, сокращение сердца. Датчик — <b>кальций-чувствительный рецептор</b> околощитовидных желёз (4 жёлтые точки). Чуть упал кальций — выходит <b>паратгормон</b> (ПТГ): освобождает кальций из костей, удерживает его в почках и заставляет почки делать <b>кальцитриол</b>, а тот усиливает всасывание кальция в кишечнике. Кальцитонин щитовидной железы у человека играет малую роль.',
    lowdiet: '<b>Мало кальция в пище</b>. Кишечник отдаёт меньше — кальций чуть падает, и ПТГ растёт (вторичный гиперпаратиреоз). Кальций крови почти в норме, но платят за это кости: их «счёт» постепенно тает (бледнеет бедренная кость). Так годами развивается остеопороз.',
    vitd: '<b>Дефицит витамина D</b> (мало солнца, тёмная кожа, пожилой возраст, болезни кишечника). Без кальцитриола кишечник всасывает лишь 10–15% кальция. ПТГ высокий, кальций и фосфат низкие, кости плохо минерализуются: у детей — <b>рахит</b> (искривление ног, «чётки» на рёбрах), у взрослых — <b>остеомаляция</b>.',
    hyper: '<b>Первичный гиперпаратиреоз</b> — чаще всего доброкачественная аденома одной околощитовидной железы, которая выделяет ПТГ, не слушая обратную связь. Кальций высокий, фосфат низкий. Классика: «камни, кости, стоны и психические расстройства» — камни в почках, остеопороз, боли в животе, слабость и депрессия. Часто находят случайно по анализу крови.',
    hypo: '<b>Гипопаратиреоз</b> — чаще после операции на щитовидной железе, когда случайно удалены или повреждены околощитовидные железы. Без ПТГ кальций падает — возбудимость нервов растёт: покалывание вокруг рта и в пальцах, судороги кистей («рука акушера», красные искры), в тяжёлых случаях — ларингоспазм. Помогает кальций внутривенно, затем таблетки кальция и кальцитриол.',
  };
  const TREATTXT = { lowdiet: '<b>Молочные продукты</b>, сыр, рыба с костями, кунжут — и ПТГ возвращается к норме, кости перестают терять минерал. Потребность взрослого — около 1000 мг кальция в сутки.', vitd: '<b>Витамин D</b> (холекальциферол) в каплях или таблетках, солнце летом — и кишечник снова всасывает кальций; ПТГ снижается, кости минерализуются.', hyper: '<b>Операция</b> — удаление аденомы. Уровень ПТГ падает в течение минут, кальций нормализуется за дни; кости восстанавливаются годами.', hypo: '<b>Кальций и кальцитриол</b> (активный витамин D — его почки без ПТГ сами почти не делают) поддерживают кальций на нижней границе нормы.' };
  const VTXT = '<b>Витамин D</b> — скорее гормон, чем витамин. В коже <b>7-дегидрохолестерин</b> под ультрафиолетом B разрывает кольцо B — получается превитамин D₃, который от тепла кожи переходит в <b>холекальциферол</b> (D₃; ещё он поступает с рыбой, яйцами, добавками). Печень добавляет OH в положение 25 — получается <b>кальцидиол</b> (25-OH-D), основная форма в крови; по ней судят о запасах (норма — от 30 нг/мл). Почки добавляют OH в положение 1 — это <b>кальцитриол</b>, активный гормон. Его синтез включают ПТГ и низкий фосфат, выключают сам кальцитриол и FGF23; лишнее разрушает 24-гидроксилаза (серая стрелка).';
  const BSTATE = { norm: 'Норма', pth: 'Много ПТГ', ct: 'Кальцитонин', meno: 'Менопауза', bisph: 'Бисфосфонаты' };
  const BTXT = {
    norm: '<b>Кость всё время перестраивается</b>: за год заменяется около 10% скелета. <b>Остеокласт</b> (фиолетовый, многоядерный) прикрепляется к кости, выделяет кислоту и катепсин K — растворяет минерал и коллаген, кальций уходит в кровь (голубые искры). Затем <b>остеобласты</b> (зелёные) выстилают яму, откладывают коллаген (остеоид), и на нём кристаллизуется гидроксиапатит Ca₁₀(PO₄)₆(OH)₂. Пока работа уравновешена, масса кости постоянна.',
    pth: '<b>Постоянно высокий ПТГ</b>: рецепторы ПТГ есть у остеобластов, а не у остеокластов — остеобласты выставляют <b>RANKL</b>, и он будит остеокласты. Резорбция обгоняет формирование — кость теряет массу. Парадокс: короткие ежедневные «уколы» ПТГ (терипаратид) наоборот наращивают кость — так лечат тяжёлый остеопороз.',
    ct: '<b>Кальцитонин</b> из C-клеток щитовидной железы тормозит остеокласты напрямую — они съёживаются и перестают копать. У человека его роль в обычной жизни мала (после удаления щитовидной железы кальций не меняется), но он маркер медуллярного рака щитовидной железы.',
    meno: '<b>Менопауза</b>: эстрогены сдерживали остеокласты (через остеопротегерин — «ловушку» для RANKL). Без них резорбция растёт, формирование не успевает: за первые 5–7 лет теряется до 20% костной массы — <b>постменопаузальный остеопороз</b>, переломы шейки бедра и позвонков.',
    bisph: '<b>Бисфосфонаты</b> (алендронат, золедроновая кислота) похожи на пирофосфат и прочно садятся на гидроксиапатит. Остеокласт, растворяя такую кость, захватывает препарат и теряет активность. Резорбция падает, масса кости растёт — основное лекарство от остеопороза. Ещё есть деносумаб — антитело к RANKL.',
  };
  const labels = [
    { text: 'околощитовидные железы (ПТГ)', pos: THY.clone().add(V3(0.25, 0.2, 0.1)), color: '#F2C14E', show: () => st.labels && st.mode === 'reg' },
    { text: 'почки: кальцитриол', pos: KID[1].clone().add(V3(-0.95, -0.1, 0.2)), color: '#FF9A5C', show: () => st.labels && st.mode === 'reg' },
    { text: 'кишечник', pos: GUT.clone().add(V3(0.45, -0.25, 0.2)), color: '#E8A08A', show: () => st.labels && st.mode === 'reg' },
    { text: 'кость', pos: BONE.clone().add(V3(0.2, -0.3, 0.1)), color: '#F2E6C8', show: () => st.labels && st.mode === 'reg' },
    { text: 'кровь (Ca²⁺)', pos: HRT.clone().add(V3(0.25, 0.05, 0.2)), color: CA, show: () => st.labels && st.mode === 'reg' },
    { text: 'кожа: витамин D₃', pos: SKIN.clone().add(V3(0.1, -0.25, 0.1)), color: '#FFD98A', show: () => st.labels && st.mode === 'reg' },
    { text: 'с мочой', pos: V3(-0.1, -0.35, 0.25), color: CA, show: () => st.labels && st.mode === 'reg' },
    ...VD.map((v) => ({ text: { dhc7: '7-дегидрохолестерин', calciol: 'холекальциферол (D₃)', calcidiol: 'кальцидиол (25-OH-D₃)', calcitriol: 'кальцитриол' }[v.id], pos: V3(40 + v.x - 0.6, -1.25, 0.3), color: v.col, show: () => st.labels && st.mode === 'vitd' })),
    ...VD.map((v) => ({ text: v.organ, pos: V3(40 + v.x - 0.6, 1.3, 0.3), color: '#B8B0C0', show: () => st.labels && st.mode === 'vitd' })),
    ...VD.filter((v) => v.enz).map((v, i) => ({ text: v.enz, pos: V3(40 + v.x + 0.35, i % 2 ? 0.95 : 0.62, 0.3), color: v.col, show: () => st.labels && st.mode === 'vitd' })),
    { text: '24-гидроксилаза: распад', pos: V3(40 + 4.45 - 2.3, -1.7, 0.3), color: '#8A8A96', show: () => st.labels && st.mode === 'vitd' },
    { text: 'остеокласт', pos: () => ocl.position.clone().add(V3(80.6, 0.85, 0.3)), color: '#B08AE8', show: () => st.labels && st.mode === 'bone' },
    { text: 'остеобласты', pos: () => (OB.find((m) => m.visible) || OB[0]).position.clone().add(V3(80.2, 0.35, 0.3)), color: '#7FD6A8', show: () => st.labels && st.mode === 'bone' && OB.some((m) => m.visible) },
    
    { text: 'кость', pos: V3(80 - 4.2, -2.4, 1.6), color: '#E8DCC0', show: () => st.labels && st.mode === 'bone' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'reg' ? (st.treat && st.dis !== 'norm' ? TREATTXT[st.dis] : DISTXT[st.dis])
        : st.mode === 'vitd' ? (!st.kidOK ? '<b>Хроническая болезнь почек</b>: 1α-гидроксилазы мало — кальцитриола нет, хотя D₃ и 25-OH-D в норме. Кальций всасывается плохо, фосфат копится, ПТГ растёт — почечная остеодистрофия. Обычный витамин D не поможет: дают сразу активную форму (кальцитриол, альфакальцидол).' : st.sunS !== 'summer' ? '<b>Мало солнца</b>: зимой на широте Москвы ультрафиолета B почти нет, а дома за стеклом его нет совсем. Запас 25-OH-D тратится неделями и к весне у многих падает ниже нормы. Кальцитриол почки ещё поддерживают (ПТГ растёт), но ценой костей.' : VTXT)
        : BTXT[st.bstate];
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'reg', label: 'Регуляция и болезни' }, { id: 'vitd', label: 'Витамин D' }, { id: 'bone', label: 'Перестройка кости' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'reg') { const tb = st.dis !== 'norm' ? toggle(TREAT[st.dis], () => st.treat, (v) => { st.treat = v; refs.setInfo(); }) : null; box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; st.treat = false; refs.rebuild(); refs.setInfo(); }), tb)); }
      else if (st.mode === 'vitd') box.append(h('div', { class: 'glabel' }, 'Условия'), h('div', { class: 'gctl' }, seg([{ id: 'summer', label: 'Лето' }, { id: 'winter', label: 'Зима' }, { id: 'none', label: 'Без солнца' }], () => st.sunS, (v) => { st.sunS = v; refs.setInfo(); }), toggle('Высокий ПТГ', () => st.pthHi, (v) => { st.pthHi = v; refs.setInfo(); }), toggle('Болезнь почек', () => !st.kidOK, (v) => { st.kidOK = !v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Условия'), h('div', { class: 'gctl' }, seg(Object.entries(BSTATE).map(([id, label]) => ({ id, label })), () => st.bstate, (v) => { st.bstate = v; refs.setInfo(); }), button('Сброс', () => { prof.fill(0); st.bm = 100; })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['reg', 'vitd', 'bone'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f2 = (v) => v.toFixed(2).replace('.', ','), f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'vitd') return [['25-OH-D', Math.round(st.lv[2] * 40), 'нг/мл'], ['Кальцитриол', Math.round(st.lv[3] / 0.6 * 100), '%']];
    if (st.mode === 'bone') return [['Масса кости', Math.round(st.bm), '%']];
    return [['Ca²⁺ крови', f2(st.Ca), 'ммоль/л'], ['ПТГ', f1(st.PTH), 'пмоль/л'], ['Кость', Math.round(st.boneMass), '%']];
  }
  const upd0 = update;
  const self = {
    mobZoom: 0.95, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope, accent: '#9FE0FF',
    kicker: 'Биохимия · гормоны', title: 'Кальций и витамин D',
    lede: 'Килограмм кальция лежит в костях, а в крови — меньше грамма. Паратгормон и витамин D следят, чтобы этот грамм не сдвинулся больше чем на несколько процентов.',
    notes: `
      <div><h2>Обмен кальция и фосфата</h2>
        <p>В организме около 1 кг кальция, 99% — в костях в виде гидроксиапатита. В плазме общий кальций 2,2–2,6 ммоль/л: почти половина связана с альбумином, активен ионизированный (1,1–1,3 ммоль/л). Ацидоз увеличивает долю ионизированного, алкалоз (например, при гипервентиляции) уменьшает — возможны судороги.</p>
        <h3>Гормоны</h3><ul><li><b>Паратгормон</b> (84 аминокислоты): кость — резорбция через RANKL остеобластов; почки — реабсорбция Ca²⁺, выведение фосфата, синтез кальцитриола.</li><li><b>Кальцитриол</b> (1,25-(OH)₂-D₃): ядерный рецептор VDR; в кишечнике включает белки всасывания кальция (TRPV6, кальбиндин), действует на кость и почки, тормозит ПТГ.</li><li><b>Кальцитонин</b> (C-клетки щитовидной железы): тормозит остеокласты.</li><li><b>FGF23</b> из кости выводит фосфат и тормозит синтез кальцитриола.</li></ul>
        <h3>Болезни</h3><p>Гипер- и гипопаратиреоз, рахит и остеомаляция, остеопороз, почечная остеодистрофия, гиперкальциемия при опухолях (ПТГ-родственный пептид, PTHrP).</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы витамина D — по химическим формулам; органы, клетки и поверхность кости — схемы.</li><li>Уровни кальция и ПТГ — простая модель с обратной связью; числа типичные, не диагностические.</li><li>Перестройка кости показана в тысячи раз быстрее: настоящий цикл занимает 3–6 месяцев.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('reg'); st.fly = null;
  return self;
}
export { makeCalcium };
