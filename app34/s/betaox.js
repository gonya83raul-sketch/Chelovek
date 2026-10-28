import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flyStep, flyTarget, glassMat, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, scopeShow, seg, smooth, toggle, tube } from '../core.js';
import { BIO_MOL, CYL, MOL, SPH, atomMat, bioStage, blobGeo, flowArrow, molMesh, plotAxes, plotLine, protMat } from './kit.js';
Object.assign(BIO_MOL, {"fad":{"name":"ФАД","el":"C C C C C C C C N C C O C O C O C O P O O O P O O O C C O C N C N C C N N C N C C O C O C N C O N C O C N H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"lf3q/w8B+v0uALIAXv53AOQAw/67AIcAuf6uAAEARv5aAMn/7f0eABsAe/3L/9//Gv/vAKn/F//mABr/h/+WANz+Z/+QAFL+nv8RAB7/GADd/+3+J/+0/wb/Of9g/5b+Ef9r/4n/df8J/5v/Mv91/qP/2P5Z/ij/0f5r/ioAoP/7/af/JgAi/v7/hwBv/qT/cwCT/ScAAQBw/okAeQCO/swAdQAm/9gAmwBr/2IAwwDu/4sAGAErACkA9gCeAOH/UgHAAI//ugFmAJj/LwJcAFz/WgK7APb+ggLw/4D/XgKa/9n/4gGk/xsAlAEDAP7/CwHb/xIB5gBBAGwB1gBS/0UBRAH7/lMBhf8+Aer/3/97Aab/SgDKAeD/nAABApf/VwDZAXEA9f+XAccA+/+gAUABh/9FAYMALf8IAcYAO/0oABcBev2I/+gAwf3e/3IBaP6DAFABN/5LAF//ef3Z/3P/HP3r/woAjP1i//b/H/9OAfP+t/7CAPX+5P/RAOT+FP9hAEb+rf8fAIr/SwC2/zX/z/7y//H+5f43/37+rf4//4v/FP+x/97/d/56/gkAMQBj/V0AdgBi/jEB0gBs/pkAEABF//QAaQAqAJsAmQDTAO7/HwIIAdz+tAKvAMn+oQJI//P/dgHW/wQBIwGMAGUBowBh/6MBaQHl/vwAoQAQApkA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAYABwAEAAgACAAJAAkACgAKAAsACgAMAAwADQAMAA4ADgAPAA4AEAAQABEAEQASABIAEwASABQAEgAVABUAFgAWABcAFgAYABYAGQAZABoAGgAbABsAHAAcAB0AHQAeAB4AHwAfACAAIAAhACEAIgAiACMAIgAkACQAJQAlACYAJgAnACEAJwAeACcAHQAoACgAKQAoACoAGwAqACoAKwAIACwALAAtAC0ALgAuAC8ALgAwADAAMQAxADIAMQAzACwAMwAzADQAAwA0AAAANQAAADYAAAA3AAIAOAAFADkABwA6AAcAOwAHADwACQA9AAkAPgAKAD8ACwBAAAwAQQANAEIADgBDAA8ARAAQAEUAEABGABQARwAYAEgAGgBJABoASgAbAEsAHQBMAB8ATQAjAE4AIwBPACUAUAAoAFEAKQBSACoAUwArAFQAMABVAA==","o":"1212121111111111111211121111111121211212111111112121121121111111111111111111111111111111111"},"nad":{"name":"НАД⁺","el":"N C O C C C C N C C O C C O P O O O P O O O C C O C N C N C C N N C N C C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"+/1a/6gA9P06/xoAg/0u/+r/b/4o/8L/Yv4L/0D/3f77/vD+VP8J/yr/Yf8o/7P/9/43//v/6f81/+b/OgDI/rz/oQCu/hwAJwG9/tj/UAFD/9P/ygFh/zsAvAES/78AWwIw//n/zAEAAGMAFAJgAPb/rAJiABIA/wEwAFn/4AH8AAMAZgELAUQA+QDPAO3/hgC+AD4AFQDFAOf/nv/sAC0Al/84AaEAG/9HAcIAzf4FAWYAPv71AFsA4f0vAbwAEP6wAPf/Zv52AJn/5/6EAKL/Hf/NAAoAOQAsAXr/AwAEAf/+0gAvAXz/DAEEAQP/ggAA/5gAfgCs/gsB9f85/34A7f+9/68Apf1l/9wAUv5m/9kAAv7//hD/1v7j/ob+rf/9/uz++/5O/2UAFACR/77/lgBD/jcAcQF6/gIAGgGb/m//pQERAE//UAF3AVAAZQHgAKgAFgFvAMT/CABkALf/6/9hAdYABf5lAQoBfv0iAbEAPf49AEb/EgCNAZj/4/9RAc3+9QCUAZX/9wCnAPP+xQBT/6kAWQDd/lUBrP/4/q0Anf/I/+QA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgABwAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA4AEAAOABEAEQASABIAEwASABQAEgAVABUAFgAWABcAFwAYABgAGQAZABoAGgAbABsAHAAcAB0AHQAeAB4AHwAeACAAIAAhACEAIgAiACMAHQAjABoAIwAZACQAJAAlACQAJgAXACYAJgAnAAsAKAAoACkAKAAqAAkAKgAqACsAAAAsAAAALQAEAC4ABQAvAAYAMAAIADEACQAyAAsAMwAMADQADAA1ABQANgAWADcAFgA4ABcAOQAZADoAGwA7AB8APAAfAD0AIQA+ACQAPwAlAEAAJgBBACcAQgAoAEMAKQBEACoARQArAEYA","o":"121212121111111211121111111121112121211111111111111111111111111111111111111"},"carnitine":{"name":"Карнитин","el":"C N C C C C O C C O O H H H H H H H H H H H H H H H","xyz":"1P7G/0QATv/h//f/Jv8KAHH/m/9l//L/jv9MAEEAFQBjAAUALQDtAPX/fgAmAGIA1wDV/wUAHwENALT/2ABH/wwA7v6Q/58ApP4kAF4AkP6J/wgATP/C/yj/UP9tAFz/uv4PAGv/4v9q/6D/V/8R/+P/0P9X/1AAUf+nADYAkv80AKsAHwA0AKP/DQALAZ//UgDl/6wAuAB1AJIA","b":"AAABAAEAAgABAAMAAQAEAAQABQAFAAYABQAHAAcACAAIAAkACAAKAAAACwAAAAwAAAANAAIADgACAA8AAgAQAAMAEQADABIAAwATAAQAFAAEABUABQAWAAYAFwAHABgABwAZAA==","o":"1111111121111111111111111"},"citrate":{"name":"Цитрат","el":"O C O C C O C C O O C O O H H H H H H H H","xyz":"lP4AAMD/EP8zAMf/Iv+rAML/eP/H/9T/BgD+/+r/LwBBAHP/ZQCI/wAA8wCy/x0AGQEcAE0ASwFQ/wIABgBYAGgA6P81ANkAKADXAEsAWf5OALf/W/+H/ygAdf+M/3f/HgChAIP/aABL/6X/RABJ/1MAogF3/xoAKAAEAaIA","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABgAHAAcACAAHAAkABAAKAAoACwAKAAwAAAANAAMADgADAA8ABQAQAAYAEQAGABIACQATAAwAFAA=","o":"12111112112111111111"},"adrenaline":{"name":"Адреналин","el":"C N C C O C C C C O C O C H H H H H H H H H H H H H","xyz":"Qf+lAGf/5v5mAMb/7/7V/7b/R/+Y/yMAC/+l/6IA1f/R/yMA9f89AGsAfgBxAGkA3AA0AB8AYQFnAB0AuQC9/9D/HQF9/4L/PACO/9L/LP8RAWT/Mf98AAP/qf+XAIT/iP6EALT/GP+9/1T/i/6q/73/T/8s/w4A+P4CALUAqv9xAKgAmADKAKQAawHDAAMA/QA2/0j/IgA2/5j/","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwAKAAwABQAMAAAADQAAAA4AAAAPAAEAEAACABEAAgASAAMAEwAEABQABgAVAAcAFgAJABcACwAYAAwAGQA=","o":"11111212111211111111111111"},"palmitic":{"name":"Пальмитиновая кислота","el":"C C C C C C C C C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"qvxaAOr/Cf3q/8P/lv0CAPj/9P2Q/9D/gf6d/w0A0P4UANb/XP8iABIAu/+y/+f/SAC//yMAlwA2AOz/IwFDACkAgwHU//3/DwLh/zoAXAJbAAcA7AJgADwARgP6//v/MAO5/5f/uwPu/zwAo/xkAFcARvxHAMT/zPy6AMH/C/3h/1b/4vyL/+v/u/1hANH/k/0LAGYA/P2L/2P/yv0x//L/ef6l/3oAtv5A//f/mf5xAOz/1/4NAGn/Vf8kAH8AhP+DAPP/w/+v/3n/k/9R/wYAQADG/5AAfgBi/w0AngAvAH//YQCTAAMATAGkAAkAHAFGAJYAigHS/5D/WgFz/xwARwKG/yEACALl/6cAXQJcAJn/KQK3ACgA7AJPAKkAFgPDACgA7AOs/wgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQAAABIAAAATAAAAFAABABUAAQAWAAIAFwACABgAAwAZAAMAGgAEABsABAAcAAUAHQAFAB4ABgAfAAYAIAAHACEABwAiAAgAIwAIACQACQAlAAkAJgAKACcACgAoAAsAKQALACoADAArAAwALAANAC0ADQAuAA4ALwAOADAAEQAxAA==","o":"1111111111111112111111111111111111111111111111111"},"bhb":{"name":"β-Гидроксибутират","el":"C C O C C O O H H H H H H H H","xyz":"cv99/ywAdv/+/9z/Xv9tADEA/P8OAJT/cgAKAPX/nABxACgAsACP/xYAnf+O/48Arf8w//n/C/9b/zYAJv/7/5D/Ef9aAGoA/f9uAF//BwC+/0v/fQBU/1EA","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYAAAAHAAAACAAAAAkAAQAKAAIACwADAAwAAwANAAYADgA=","o":"11112111111111"},"malonyl":{"name":"Малонил-КоА","el":"O C O C C O S C H H H H H H","xyz":"a/8MAIcAdv8UAPr/Kv/U/7P/4f9tALr/awBFAO//rACUADIArQCh/8r/UQAk/ycAvf/7/7cAzf/VANT/3v9hAE7/NwBM/4oAjgDL/jMA9f8L//H/","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABgAHAAAACAADAAkAAwAKAAcACwAHAAwABwANAA==","o":"1211211111111"},"acetoacetate":{"name":"Ацетоацетат","el":"C C O C C O O H H H H H H","xyz":"IP+r/y4Ahf8XAAcAbv9hAKn/BwAnAFcAfADy/wQAagCa/7L//gApABYA0P7Y/2kA9v5//9T/Uv9e/2gAAADu/7MAFwCQAG4AOAH5/1QA","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYAAAAHAAAACAAAAAkAAwAKAAMACwAGAAwA","o":"121121111111"},"glycerol":{"name":"Глицерин","el":"O C C O C O H H H H H H H H","xyz":"Y/+l/zMAg//w/8D/AABGANH/AACPAEoAfQDw/8D/nQCl/zMAk/9R/zIALv8yAKf/kv+s/2v/AACQAH7/HQDqADkAbgCs/2v/0gAyAKf/uwDg/3oA","b":"AAABAAEAAgACAAMAAgAEAAQABQAAAAYAAQAHAAEACAACAAkAAwAKAAQACwAEAAwABQANAA==","o":"1111111111111"},"acetyl":{"name":"Ацетил-КоА","el":"C C O S C H H H H H H","xyz":"p/9y//P/vP8JAPz/X/9SABoAXwBQANn/3wDj/x0ARf9d/8f/9f9G/7X/q/9H/1cAQgENAAcA0wDb/4kA1wCA//D/","b":"AAABAAEAAgABAAMAAwAEAAAABQAAAAYAAAAHAAQACAAEAAkABAAKAA==","o":"1211111111"},"acetone":{"name":"Ацетон","el":"C C C O H H H H H H","xyz":"e/9FAAAAAAD4/wAAhQBFAAAAAAB+/wAAj/+wAAkAP/8kAFQARv8xAKP/xgAcALP/cgCuAOz/tQA6AGEA","b":"AAABAAEAAgABAAMAAAAEAAAABQAAAAYAAgAHAAIACAACAAkA","o":"112111111"}});


// @scene betaox makeBetaox | Окисление жиров и кетоновые тела | Липиды
/* =========================================================
   БИОХИМИЯ · ЖИРНЫЕ КИСЛОТЫ: липолиз в адипоците, карнитиновый челнок и спираль β-окисления,
   кетоновые тела (печень → мозг, сердце, мышцы), синтез пальмитата
   ========================================================= */
function makeBetaox() {
  __set_rnd(mulberry(1501));
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { lipo: flyTarget(V3(-1.6, 0.2, 0), V3(-1.0, 2.4, 21.5)), beta: flyTarget(V3(39.9, -1.9, 0), V3(40.5, 0.6, 17.5)), keto: flyTarget(V3(80, -1.0, 0), V3(80.6, 1.2, 18.5)), syn: flyTarget(V3(120, -1.6, 0), V3(120.6, 0.6, 16)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.lipo.pos);
  const controls = makeControls(camera, VIEW.lipo.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const cMat = atomMat('C'), oMat = atomMat('O'), sMat = atomMat('S');
  /* цепь ацила: n атомов углерода зигзагом + C=O–S–КоА */
  function acyl(maxC = 16, scale = 0.32) {
    const g = new THREE.Group(); const atoms = [], bonds = [];
    for (let i = 0; i < maxC; i++) { const m = new THREE.Mesh(SPH, cMat); m.scale.setScalar(0.11 * scale / 0.32); g.add(m); atoms.push(m); }
    for (let i = 0; i < maxC - 1; i++) { const b = new THREE.Mesh(CYL, cMat); g.add(b); bonds.push(b); }
    const O = new THREE.Mesh(SPH, oMat); O.scale.setScalar(0.1 * scale / 0.32); g.add(O);
    const S = new THREE.Mesh(SPH, sMat); S.scale.setScalar(0.13 * scale / 0.32); g.add(S);
    const coa = new THREE.Mesh(blobGeo(0.28, 0.2, 0.2, 9, 0.1, 3), protMat('#7FE0A0', 0.4)); coa.scale.setScalar(scale / 0.32); g.add(coa);
    const pos = (i) => V3(-i * 0.21 * scale / 0.32, (i % 2 ? 0.07 : -0.07) * scale / 0.32, 0);
    g.userData.set = (n) => {
      atoms.forEach((a, i) => { a.visible = i < n; a.position.copy(pos(i)); });
      bonds.forEach((b, i) => { b.visible = i < n - 1; const p0 = pos(i), p1 = pos(i + 1); b.position.copy(p0).lerp(p1, 0.5); const d = p1.clone().sub(p0); b.scale.set(0.035 * scale / 0.32, d.length(), 0.035 * scale / 0.32); b.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); });
      O.position.copy(pos(0)).add(V3(0, 0.2 * scale / 0.32, 0)); S.position.copy(pos(0)).add(V3(0.22 * scale / 0.32, -0.06 * scale / 0.32, 0)); coa.position.copy(S.position).add(V3(0.35 * scale / 0.32, 0, 0));
    };
    g.userData.set(maxC); g.userData.pos = pos; return g;
  }
  /* ---------- 1. липолиз в адипоците ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const cell = new THREE.Mesh(new THREE.SphereGeometry(3.0, 48, 32), glassMat(0xffd080, { rim: 0.6, base: 0.02, keep: true })); cell.position.set(-0.5, 0.7, 0); G1.add(cell);
  const drop = new THREE.Mesh(new THREE.SphereGeometry(2.25, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0x6a4a14, roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.5, emissive: 0x3a2404, emissiveIntensity: 0.12, envMapIntensity: 0.4 })); drop.position.copy(cell.position); G1.add(drop);
  const nuc = new THREE.Mesh(ell3(0.5, 0.17, 0.4), organMat('#9F7BFF', 0.4)); nuc.position.set(-0.5 + 2.62 * Math.cos(-0.5), 0.7 + 2.62 * Math.sin(-0.5), 0); nuc.rotation.z = -0.5 + Math.PI / 2; G1.add(nuc); // ядро сплющено каплей к краю клетки
  const rec = new THREE.Mesh(blobGeo(0.28, 0.4, 0.28, 3, 0.1, 3), protMat('#FF8A5C', 0.4)); rec.position.set(-0.5 + 2.95 * Math.cos(0.5), 0.7 + 2.95 * Math.sin(0.5), 0); G1.add(rec);
  const horm = molMesh(MOL('adrenaline'), { scale: 0.12, hideH: true }); G1.add(horm);
  const HSL = [0, 1, 2, 3, 4].map((k) => { const a = 0.3 + k * 0.55; const m = new THREE.Mesh(blobGeo(0.2, 0.17, 0.18, k + 12, 0.12, 3), protMat('#7FD6FF', 0.35)); m.position.set(-0.5 + Math.cos(a) * 2.35, 0.7 + Math.sin(a) * 2.35, 0.3); G1.add(m); return m; });
  const fas = []; for (let k = 0; k < 10; k++) { const m = molMesh(MOL('palmitic'), { scale: 0.07, hideH: true }); m.visible = false; G1.add(m); fas.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const glys = []; for (let k = 0; k < 4; k++) { const m = molMesh(MOL('glycerol'), { scale: 0.12, hideH: true }); m.visible = false; G1.add(m); glys.push({ m, age: 9, v: V3(0, 0, 0) }); }
  /* ---------- 2. β-окисление ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const mitoOut = new THREE.Mesh(new THREE.CapsuleGeometry(2.6, 6.5, 12, 48), glassMat(0xffb070, { rim: 0.55, base: 0.025, keep: true })); mitoOut.rotation.z = Math.PI / 2; mitoOut.position.set(1.4, -0.2, -0.5); G2.add(mitoOut);
  const mitoIn = new THREE.Mesh(new THREE.CapsuleGeometry(2.3, 6.2, 12, 48), glassMat(0xff8a5c, { rim: 0.75, base: 0.04, keep: true })); mitoIn.rotation.z = Math.PI / 2; mitoIn.position.copy(mitoOut.position); G2.add(mitoIn);
  // кристы — складки внутренней мембраны (сверху и снизу, правее спирали)
  [[3.6, 1], [4.3, -1], [5.0, 1], [5.7, -1]].forEach(([x, s]) => { const dx = Math.max(0, x - 4.5), h = Math.sqrt(2.3 * 2.3 - dx * dx), hh = h * 1.1; const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, hh, 1.6 * h / 2.3), organMat('#FF8A5C', 0.3)); m.position.set(x, -0.2 + s * (h - 0.1 - hh / 2), -0.5); G2.add(m); });
  // карнитиновый челнок поперёк мембран: CPT-I во внешней, транслоказа во внутренней, CPT-II на стороне матрикса
  const SHY = 1.0, SHZ = 0.2;
  const cpt = [[-4.05, '#C77DFF'], [-3.53, '#9FB4FF'], [-3.18, '#C77DFF']].map(([x, c], k) => { const m = new THREE.Mesh(blobGeo(k === 1 ? 0.12 : 0.15, 0.3, 0.22, x * 10, 0.1, 3), protMat(c, 0.45)); m.position.set(x, SHY, SHZ); G2.add(m); return m; });
  const chain = acyl(16, 0.32); G2.add(chain);
  const carn = molMesh(MOL('carnitine'), { scale: 0.1, hideH: true }); G2.add(carn);
  const acs = []; for (let k = 0; k < 8; k++) { const m = molMesh(MOL('acetyl'), { scale: 0.13, hideH: true }); m.visible = false; G2.add(m); acs.push(m); }
  const spiralC = V3(1.4, -0.4, 0.3);
  // спираль: один виток = один оборот β-окисления (4 реакции), 7 витков
  const SPA = (u) => Math.PI + u * Math.PI * 14, SPP = (u) => V3(spiralC.x + Math.cos(SPA(u)) * 1.5, spiralC.y + 1.4 - u * 2.6, spiralC.z + Math.sin(SPA(u)) * 0.6);
  G2.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 281 }, (_, i) => SPP(i / 280))), 560, 0.025, 6), new THREE.MeshBasicMaterial({ color: 0xffb070, transparent: true, opacity: 0.35, depthWrite: false })));
  const BEP = (k) => { const a = Math.PI + k * Math.PI / 2; return V3(spiralC.x + Math.cos(a) * 1.75, spiralC.y + 0.95 - k * 0.62, spiralC.z + Math.sin(a) * 0.85); }; // 4 фермента на четвертях витка
  const BENZ = ['#FFE45A', '#7FD6FF', '#FFD070', '#7FE0A0'].map((c, k) => { const m = new THREE.Mesh(blobGeo(0.22, 0.3, 0.22, 60 + k, 0.1, 3), protMat(c, 0.45)); m.position.copy(BEP(k)); G2.add(m); return m; });
  const toks = [];
  function token(c, p, v) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true })); m.position.copy(p); scene.add(m); toks.push({ m, v, age: 0 }); }
  /* ---------- 3. кетоновые тела ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  bodyShell(G3, { rim: 0.18 });
  const liver = new THREE.Mesh(blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), organMat('#B0523A', 0.5)); liver.position.set(-0.35, 1.55, 0.15); G3.add(liver);
  const brain = new THREE.Mesh(ell3(0.3, 0.25, 0.35, BODY.head), organMat('#E0A0B8', 0.45)); G3.add(brain);
  const HEART = BODY.heart.clone().add(V3(0, 0.25, 0));
  const heart = new THREE.Mesh(ell3(0.22, 0.27, 0.2, HEART), organMat('#C84A50', 0.45)); G3.add(heart);
  const musc = new THREE.Mesh(tube([V3(-0.47, -0.3, 0.05), V3(-0.5, -1.2, 0.08), V3(-0.48, -2.0, 0.06)], 0.22), organMat('#C0504A', 0.4)); G3.add(musc); // мышца бедра
  const fatT = new THREE.Mesh(ell3(0.9, 0.35, 0.35, V3(0, 0.55, 0.35)), organMat('#F2D08A', 0.35, { transparent: true, opacity: 0.6 })); G3.add(fatT);
  const kf = [flowArrow(G3, fatT.position.clone().add(V3(-0.2, 0.3, 0.2)), liver.position.clone().add(V3(0, -0.25, 0.3)), '#F2C14E', { bend: 0.4 }), flowArrow(G3, liver.position.clone().add(V3(0.3, 0.3, 0.3)), BODY.head.clone().add(V3(0, -0.3, 0.2)), '#FF8AB0', { bend: -0.25 }), flowArrow(G3, liver.position.clone().add(V3(0.4, 0.2, 0.3)), HEART.clone().add(V3(0, -0.15, 0.15)), '#FF8AB0', { bend: 0.3 }), flowArrow(G3, liver.position.clone().add(V3(0.2, -0.3, 0.3)), V3(-0.48, -0.75, 0.3), '#FF8AB0', { bend: 0.3 })];
  const ketM = ['acetoacetate', 'bhb', 'acetone'].map((id, k) => { const m = molMesh(MOL(id), { scale: 0.13, hideH: true }); m.position.set(1.7, 2.6 - k * 0.9, 0.3); G3.add(m); return m; });
  const breath = []; for (let k = 0; k < 4; k++) { const m = molMesh(MOL('acetone'), { scale: 0.09, hideH: true }); m.visible = false; G3.add(m); breath.push({ m, age: 9 }); }
  /* ---------- 4. синтез ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const fas2 = new THREE.Group(); fas2.position.set(0.6, 0.6, 0); G4.add(fas2);
  [-1, 1].forEach((s) => { const m = new THREE.Mesh(blobGeo(1.5, 0.9, 0.8, s + 30, 0.1, 4), protMat(s > 0 ? '#7FD6FF' : '#9FB4FF', 0.22)); m.position.set(0, s * 0.55, 0); m.rotation.z = s * 0.15; fas2.add(m); });
  const chain2 = acyl(16, 0.32); chain2.position.set(-0.3, 0.6, 1.25); G4.add(chain2);
  const mal = molMesh(MOL('malonyl'), { scale: 0.13, hideH: true }); G4.add(mal);
  const accb = new THREE.Mesh(blobGeo(0.5, 0.42, 0.45, 77, 0.1, 3), protMat('#F2C14E', 0.35)); accb.position.set(-3.6, 1.8, 0); G4.add(accb);
  const cit = molMesh(MOL('citrate'), { scale: 0.13, hideH: true }); cit.position.set(-5.6, 1.6, 0); G4.add(cit);
  const palm = molMesh(MOL('palmitic'), { scale: 0.11, hideH: true }); palm.visible = false; G4.add(palm);
  const synF = [flowArrow(G4, cit.position.clone().add(V3(0.45, 0.05, 0)), accb.position.clone().add(V3(-0.55, 0, 0)), '#7FD6FF', { bend: 0.15 }), flowArrow(G4, accb.position.clone().add(V3(0.5, -0.2, 0)), V3(-0.8, 0.95, 0.9), '#F2C14E', { bend: -0.2 })];
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'lipo', labels: true, rot: false, fly: null, cyc: 0, ins: false, msg: null, turn: 0, cnt: { fad: 0, nad: 0, ac: 0 }, days: 0, dka: false, sn: 2 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['lipo', 'beta', 'keto', 'syn'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'lipo') {
      const T = 8, c = st.cyc % T; const on = !st.ins && c > 2;
      const hp = V3(4.2, 3.6, 0).lerp(rec.position.clone().add(V3(0.25, 0.25, 0)), ease(c / 2)); horm.position.copy(hp); horm.rotation.y += dt; horm.visible = !st.ins;
      HSL.forEach((m, k) => { m.material.emissiveIntensity = on ? 0.2 + 0.1 * Math.sin(t * 6 + k) : 0.02; });
      if (on && rnd() < 0.08) { const f = fas.find((x) => x.age > 3.2); if (f) { const s = HSL[Math.floor(rnd() * 5)]; f.age = 0; f.m.visible = true; f.m.position.copy(s.position); f.v.copy(s.position.clone().sub(cell.position).normalize().multiplyScalar(1.1)); } }
      if (on && rnd() < 0.025) { const q = glys.find((x) => x.age > 3.2); if (q) { q.age = 0; q.m.visible = true; q.m.position.copy(HSL[2].position); q.v.set(-1.0, -0.6, 0.3); } }
      [...fas, ...glys].forEach((f) => { if (f.age < 3.2) { f.age += dt; f.m.position.addScaledVector(f.v, dt); f.m.rotation.y += dt * 2; } else f.m.visible = false; });
      drop.scale.setScalar(1 - 0.02 * Math.sin(t * 0.5));
    }
    if (st.mode === 'beta') {
      // 0–3 с: вход через карнитиновый челнок; далее 7 оборотов по 2 с
      const c = st.cyc % 20; const turnsDone = Math.max(0, Math.min(7, Math.floor((c - 3) / 2)));
      const n = 16 - 2 * turnsDone; chain.userData.set(n);
      if (c < 3) { const u = ease(c / 3); chain.position.copy(V3(-6.2, SHY, SHZ).lerp(SPP(0), u)); carn.visible = c > 0.8 && c < 2.6; carn.position.copy(chain.position).add(V3(0.5, 0.3, 0)); chain.rotation.z = 0; }
      else { carn.visible = false; const u = Math.min(1, (c - 3) / 14); chain.position.copy(SPP(u)); chain.rotation.z = Math.sin(SPA(u)) * 0.2; }
      if (c > 3 && c < 17) { const k = Math.floor((c - 3) / 2), sub = (c - 3) % 2;
        if (k !== st.turn) { st.turn = k; if (k > 0) { st.cnt.fad++; st.cnt.nad++; st.cnt.ac++; token('#FFE45A', chain.position.clone().add(G2.position), V3(rand(-0.5, 0.5), -1, 0.4)); token('#FFD070', chain.position.clone().add(G2.position), V3(rand(-0.5, 0.5), -1.2, 0.6)); const am = acs[(k - 1) % 8]; am.visible = true; am.position.copy(chain.position).add(V3(0.6, 0, 0)); am.userData.v = V3(rand(0.4, 0.9), rand(-0.6, -0.2), 0.3); } }
        st.betaStep = ['окисление ФАД', 'гидратация', 'окисление НАД⁺', 'тиолиз'][Math.floor(sub * 2)]; st.benz = Math.floor(sub * 2); } else st.benz = -1;
      BENZ.forEach((m, k) => { m.material.emissiveIntensity = st.benz === k ? 0.35 : 0.03; });
      if (c >= 17 && !st.last) { st.last = true; st.cnt.ac++; const am = acs[7]; am.visible = true; am.position.copy(chain.position); am.userData.v = V3(0.6, -0.5, 0.3); }
      if (c < 0.1) { st.last = false; st.cnt = { fad: 0, nad: 0, ac: 0 }; st.turn = 0; acs.forEach((a) => { a.visible = false; }); }
      acs.forEach((a) => { if (a.visible && a.userData.v) { a.position.addScaledVector(a.userData.v, dt * 0.6); a.rotation.y += dt; if (a.position.x > 5) a.visible = false; } });
      cpt.forEach((m, k) => { m.material.emissiveIntensity = c < 3 && Math.abs(chain.position.x - m.position.x) < 0.45 ? 0.35 : 0.03; });
      st.carbons = n;
    }
    if (st.mode === 'keto') {
      st.days = Math.min(st.days + dt * 0.25, 40);
      const lvl = st.dka ? 1 : smooth(0.3, 3.5, st.days) * 0.6 + smooth(10, 40, st.days) * 0.2;
      kf.forEach((f, k) => { f.mat.uniforms.uTime.value = t; f.mat.uniforms.uOn.value = k === 0 ? 0.3 + lvl : 0.1 + lvl; });
      ketM.forEach((m) => { m.rotation.y += dt; });
      breath.forEach((b, k) => { if (b.age > 2.5 && rnd() < lvl * 0.03) { b.age = 0; b.m.visible = true; b.m.position.copy(BODY.head).add(V3(0.05, -0.15, 0.45)); } if (b.age < 2.5) { b.age += dt; b.m.position.z += dt * 0.6; b.m.position.y += dt * 0.1; } else b.m.visible = false; });
      brain.material.emissiveIntensity = 0.04 + 0.4 * lvl; st.ketoLvl = st.dka ? 15 + 3 * Math.sin(t) : lvl * 7 / 0.8;
    }
    if (st.mode === 'syn') {
      const c = st.cyc % 18; const k = Math.min(7, Math.floor(c / 2)); st.sn = 2 + 2 * k; chain2.userData.set(st.sn);
      const sub = (c % 2); mal.visible = c < 14; mal.position.copy(accb.position.clone().lerp(V3(1.4, 0.9, 0.9), ease(sub))); mal.rotation.y += dt;
      cit.rotation.y += dt; palm.visible = c > 15; if (palm.visible) { palm.position.set(2.6 + (c - 15) * 0.8, -0.6, 0.6); palm.rotation.y += dt; }
      chain2.visible = c <= 15;
      if (sub > 0.95 && sub < 1 && rnd() < 0.5) { token('#7FE0A0', V3(120.8, 1.2, 0.8), V3(0, 1.2, 0.3)); token('#7FE0A0', V3(121.1, 1.2, 0.8), V3(0.2, 1.2, 0.3)); }
      fas2.rotation.y = Math.sin(t * 0.4) * 0.2; synF.forEach((f) => { f.mat.uniforms.uTime.value = t; f.mat.uniforms.uOn.value = 1; });
    }
    for (let i = toks.length - 1; i >= 0; i--) { const q = toks[i]; q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.material.opacity = 1 - q.age / 2; if (q.age > 2) { scene.remove(q.m); toks.splice(i, 1); } }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'keto') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'кетоновые тела крови, ммоль/л', xl: 'дни голода →', yl: '' });
      const f = (d) => 0.1 + 2.6 * smooth(0.3, 3.5, d) + 4.5 * smooth(10, 40, d);
      plotLine(ctx, A, (u) => f(u * 40) / 20, '#FF8AB0');
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,106,106,.6)'; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(15 / 20)); ctx.lineTo(A.X(1), A.Y(15 / 20)); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,140,140,.85)'; ctx.fillText('кетоацидоз при диабете 15–25', A.X(0.02), A.Y(15 / 20) - 3);
      ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.days / 40), A.Y((st.dka ? 15 : f(st.days)) / 20), 4.5, 0, Math.PI * 2); ctx.fill();
      return;
    }
    if (st.mode === 'beta') {
      scopeShow(true); ctx.clearRect(0, 0, w, h); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('пальмитат C16: 7 оборотов → 8 ацетил-КоА', 8, 12);
      const rows = [['7 ФАДН₂ × 2', 14, '#FFE45A'], ['7 НАДН × 3', 21, '#FFD070'], ['8 ацетил-КоА × 12', 96, '#7FD6FF'], ['активация (АТФ → АМФ)', -2, '#FF6A6A']];
      rows.forEach(([n, v, c], k) => { const y = 20 + k * 20; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 8, y + 10); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(120, y, (w - 160) * Math.abs(v) / 96, 13); ctx.globalAlpha = 1; ctx.fillStyle = '#EFEAE6'; ctx.fillText(String(v), 124 + (w - 160) * Math.abs(v) / 96, y + 10); });
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillText('итого ≈ 129 АТФ (по совр. данным ≈ 106)', 8, h - 6);
      return;
    }
    scopeShow(false);
  }
  const TXT = {
    lipo: '<b>Липолиз в жировой клетке.</b> Почти весь объём адипоцита — капля триацилглицеринов. При голоде и стрессе <b>адреналин</b> и <b>глюкагон</b> садятся на рецепторы, через цАМФ и протеинкиназу A фосфорилируется и включается <b>гормончувствительная ТАГ-липаза</b> (голубые). Липазы по очереди отщепляют три жирные кислоты; <b>жирные кислоты</b> уходят в кровь вместе с альбумином и служат топливом для мышц, сердца, печени (но не мозга), <b>глицерин</b> идёт в печень на глюконеогенез. Включите «Инсулин» — липолиз остановится.',
    beta: '<b>β-Окисление в митохондрии.</b> Жирная кислота сначала активируется в цитоплазме (ацил-КоА, затрата АТФ). Внутренняя мембрана митохондрии непроницаема для ацил-КоА — его переносит <b>карнитин</b> (челнок: карнитинацилтрансфераза I, транслоказа, карнитинацилтрансфераза II, сиреневые). В матриксе повторяется цикл из 4 реакций: <b>окисление (ФАД) → гидратация → окисление (НАД⁺) → тиолиз</b>. Каждый оборот отрезает от цепи 2 углерода в виде ацетил-КоА и даёт ФАДН₂ и НАДН. Пальмитат (C16) проходит 7 оборотов и даёт 8 ацетил-КоА. Окисление жиров даёт и «эндогенную воду» — так живёт верблюд.',
    keto: '<b>Кетоновые тела</b> — ацетоацетат, β-гидроксибутират и ацетон — делает только <b>печень</b>, когда ацетил-КоА из жиров много, а оксалоацетат ушёл на глюконеогенез (голод, низкоуглеводная диета, диабет). Сама печень их не использует: они идут с кровью в <b>мозг</b> (после 3–4 дней голода покрывают до 2/3 его потребности), сердце и мышцы. Ацетон выдыхается — «фруктовый» запах изо рта. Шкала времени ускорена: смотрите, как растёт уровень за 40 дней голода.',
    syn: '<b>Синтез жирных кислот</b> (липогенез) идёт в цитоплазме печени и жировой ткани после еды, когда углеводов в избытке. Ацетил-КоА выносится из митохондрии в виде <b>цитрата</b>. <b>Ацетил-КоА-карбоксилаза</b> (с биотином, жёлтая) делает <b>малонил-КоА</b> — это ключевая регулируемая стадия (активируют инсулин и цитрат). Мультиферментная <b>синтаза жирных кислот</b> (димер, голубой) за 7 циклов наращивает цепь по 2 углерода, тратя 2 НАДФН (зелёные) на каждый — до пальмитата C16. Малонил-КоА одновременно запрещает вход жирных кислот в митохондрию — синтез и окисление не идут одновременно.',
  };
  const labels = [
    { text: 'липидная капля (ТАГ)', pos: V3(-1.4, 0.6, 2.4), color: '#F2C14E', show: () => st.labels && st.mode === 'lipo' },
    { text: 'адреналин', pos: horm.position, color: '#FF8A5C', show: () => st.labels && st.mode === 'lipo' && !st.ins },
    { text: 'ТАГ-липаза', pos: V3(0.75, 2.75, 0.5), color: '#7FD6FF', show: () => st.labels && st.mode === 'lipo' },
    { text: 'β-адренорецептор', pos: V3(2.45, 1.95, 0.4), color: '#FF8A5C', show: () => st.labels && st.mode === 'lipo' },
    { text: 'жирные кислоты → кровь', pos: V3(2.6, -1.4, 0.4), color: '#F2E6C8', show: () => st.labels && st.mode === 'lipo' && !st.ins },
    { text: 'ядро', pos: V3(1.85, -0.6, 0.5), color: '#9F7BFF', show: () => st.labels && st.mode === 'lipo' },
    { text: 'карнитиновый челнок', pos: V3(40 - 5.0, 1.65, 0.3), color: '#C77DFF', show: () => st.labels && st.mode === 'beta' },
    { text: 'ацил-КоА', pos: V3(40 - 7.2, 1.45, 0.3), color: '#F2E6C8', show: () => st.labels && st.mode === 'beta' && st.cyc % 20 < 2 },
    { text: 'спираль β-окисления (матрикс)', pos: V3(40 + 0.4, 1.45, 0.3), color: '#FFB070', show: () => st.labels && st.mode === 'beta' },
    { text: 'наружная мембрана', pos: V3(40 - 1.0, 2.55, 0.3), color: '#FFB070', show: () => st.labels && st.mode === 'beta' },
    { text: 'кристы', pos: V3(40 + 4.6, 1.6, 0.4), color: '#FF8A5C', show: () => st.labels && st.mode === 'beta' },
    ...['ФАД', 'H₂O', 'НАД⁺', 'КоА'].map((n, k) => ({ text: n, pos: BEP(k).add(V3(40.28, 0, 0)), color: ['#FFE45A', '#7FD6FF', '#FFD070', '#7FE0A0'][k], show: () => st.labels && st.mode === 'beta' })),
    { text: 'ацетил-КоА → цикл Кребса', pos: V3(40 + 3.0, -1.6, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'beta' },
    { text: 'печень', pos: V3(80 - 1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels && st.mode === 'keto' },
    { text: 'мозг', pos: V3(80.4, 4.5, 0), color: '#E0A0B8', show: () => st.labels && st.mode === 'keto' },
    { text: 'жир → жирные кислоты', pos: V3(80 - 1.8, 0.2, 0.4), color: '#F2D08A', show: () => st.labels && st.mode === 'keto' },
    { text: 'сердце', pos: V3(80 + 0.45, 2.3, 0.3), color: '#E07A80', show: () => st.labels && st.mode === 'keto' },
    { text: 'мышцы', pos: V3(80 - 1.25, -1.2, 0.3), color: '#E07A70', show: () => st.labels && st.mode === 'keto' },
    ...['ацетоацетат', 'β-гидроксибутират', 'ацетон'].map((n, k) => ({ text: n, pos: V3(80 + 2.2, 2.6 - k * 0.9, 0.3), color: '#FF8AB0', show: () => st.labels && st.mode === 'keto' })),
    { text: 'цитрат из митохондрии', pos: V3(120 - 6.4, 2.3, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'syn' },
    { text: 'ацетил-КоА-карбоксилаза', pos: V3(120 - 4.4, 2.6, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'syn' },
    { text: 'синтаза жирных кислот', pos: V3(120 + 0.2, 2.2, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'syn' },
    { text: 'НАДФН', pos: V3(121.5, 2.6, 0.8), color: '#7FE0A0', show: () => st.labels && st.mode === 'syn' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'lipo', label: 'Липолиз' }, { id: 'beta', label: 'β-Окисление' }, { id: 'keto', label: 'Кетоновые тела' }, { id: 'syn', label: 'Синтез жирных кислот' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 300px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'lipo') box.append(h('div', { class: 'glabel' }, 'Гормоны'), h('div', { class: 'gctl' }, toggle('Инсулин', () => st.ins, (v) => { st.ins = v; st.msg = v ? '<b>Инсулин</b> (после еды) через фосфодиэстеразу снижает цАМФ и через фосфатазы дефосфорилирует липазу — распад жира останавливается, и, наоборот, включается синтез ТАГ. Поэтому жир «сжигается» только при низком инсулине.' : null; refs.setInfo(); })));
      else if (st.mode === 'keto') box.append(h('div', { class: 'glabel' }, 'Условия'), h('div', { class: 'gctl' }, button('Голод с начала', () => { st.days = 0; st.dka = false; }, true), toggle('Диабет 1 типа без инсулина', () => st.dka, (v) => { st.dka = v; st.msg = v ? '<b>Диабетический кетоацидоз.</b> Без инсулина жир распадается безудержно, печень заваливает кровь кетоновыми телами (15–25 ммоль/л и выше). Это кислоты — pH крови падает, появляется глубокое шумное дыхание (Куссмауля), запах ацетона, рвота, кома. Неотложное состояние: нужны инсулин и жидкость.' : null; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Цикл'), h('div', { class: 'gctl' }, button('Сначала', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['lipo', 'beta', 'keto', 'syn'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'beta') return [['Цепь', `C${st.carbons || 16}`, ''], ['ФАДН₂', st.cnt.fad, ''], ['НАДН', st.cnt.nad, ''], ['Ацетил-КоА', st.cnt.ac, '']];
    if (st.mode === 'keto') return [['Голод', Math.floor(st.days), 'дн.'], ['Кетоновые тела', (st.ketoLvl || 0.1).toFixed(1), 'ммоль/л']];
    if (st.mode === 'syn') return [['Цепь', `C${st.sn}`, ''], ['НАДФН', (st.sn - 2), '']];
    return [['Запас жира', '10–15', 'кг'], ['Хватит на', '≈ 40', 'дней']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · обмен липидов', title: 'Окисление жиров и кетоновые тела',
    lede: 'Как жир из жировой клетки превращается в энергию: липолиз, челнок карнитина, спираль β-окисления — и запасной «бензин» для мозга при голоде.',
    notes: `
      <div><h2>Энергетика</h2>
        <p>Окисление пальмитиновой кислоты: 7 оборотов β-окисления (7 ФАДН₂ и 7 НАДН — по учебнику 7 × 5 = 35 АТФ) и 8 ацетил-КоА (8 × 12 = 96 АТФ), минус 2 АТФ на активацию (АТФ → АМФ) — около 129 АТФ (по современным коэффициентам ≈ 106). Глицерин даёт ещё ~22 АТФ. Жир — вдвое энергоёмче углеводов.</p>
        <h3>Кетоновые тела</h3><p>Синтез: 2 ацетил-КоА → ацетоацетил-КоА → ГМГ-КоА → <b>ацетоацетат</b> → β-гидроксибутират (восстановление) или ацетон (самопроизвольно). Использование в тканях: ацетоацетат + сукцинил-КоА → ацетоацетил-КоА → 2 ацетил-КоА → цикл Кребса. У печени нет нужного фермента (тиофоразы), поэтому она кетоны только отдаёт.</p>
        <h3>Нарушения</h3><p>Дефицит карнитина (у недоношенных, при гемодиализе) — мышечная слабость, гипогликемия. Наследственные дефекты ацил-КоА-дегидрогеназ. Ожирение — избыток липогенеза над липолизом.</p></div>
      <div><h2>Условности и модели</h2><ul><li>Цепь ацила нарисована атомами углерода без водорода; КоА — зелёная капля.</li><li>Молекулы адреналина, жирных кислот, кетоновых тел, малонил-КоА (фрагмент) — по формулам.</li><li>Клетки, органы и ферменты — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('lipo'); st.fly = null;
  return self;
}
export { makeBetaox };
