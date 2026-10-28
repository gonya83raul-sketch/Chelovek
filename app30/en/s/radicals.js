import { GLOW, Sparks, THREE, V3, __set_rnd, button, clamp, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, pickOn, rand, randUnit, range, rnd, scopeShow, seg, smooth, toggle, tube } from '../core.js';
import { BIO_MOL, CYL, MOL, SPH, atomMat, bioStage, blobGeo, flowArrow, molMesh, plotAxes, protMat, schemBilayer } from './kit.js';
Object.assign(BIO_MOL, {"bilirubin":{"name":"Bilirubin","el":"C C C C C C C C N C C C N C C C N C O C C C C C C C C C C C O O C C C C O O C C N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"CgM7ALv+jgIxABD/UwLB/z//kQI8/xz/cgK+/jn/2wHr/4//jwGQ/8j/FgGt/xkA1wAiAD4AZwAEAIwACQBqAMcAof+SAGAAOP8/ADcA6/5+ANn/cP5cAIn/Lv7q/47/Uf57/+L/7v0U/8f/6v2o/vr/jf1K/1//Gv30/i7/vvwV/9T+sv3E/z7/b/0gANv+Iv/4AMj/8v5lAWv/lv8EAR4A8P99ASgAof/0AWEAd//WAfAAyv/OAUkB7f7DAQ8BYACB/5kA9/8z/+UAJQAe/3YBmwC8/ncBDAHl/ooBhAAy/mIB0ABI/08A7wC1/kMA0QF6AI3/QQKrAD7/WgIdASb/VgP2/9/+8gIhAFP+MgOgAL7+7QJA/93+tgJx/g7/IQKW/nP/qwEn/7v/7wCAACgA1/9AAB8BQQDCAOcAMf/k/18ASf6pAEP/mv5t/yMAEf2P/lr/uvx0/6H+cPzL/rz+ef34/3b+BP0nAPL+mf2EAN3+Qf+uAVr/nP6ZAZb/1f47AQr/RQBpAWkAFQCYAcX/Sf8GAiMA4f9NAl8Asf7DAcMA5v/S/rYAmP9q/+YAQwB9/6EB0v/0/rABXgAZ/gwBDwGd/t3/lgB5/loAPwGZ/ogAjwG3ALf/","b":"AAABAAEAAgACAAMAAwAEAAIABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEQATABMAFAAUABUAEwAWAA8AFgAWABcADQAYABgAGQAYABoACwAaABoAGwAbABwAHAAdAB0AHgAdAB8ACQAgACAAIQAhACIAIgAjACMAJAAjACUAIAAmAAcAJgAmACcABQAoACgAKQABACkAKQAqAAAAKwAAACwAAAAtAAMALgAEAC8ABAAwAAYAMQAIADIACgAzAAoANAAMADUADgA2ABAANwAUADgAFQA5ABUAOgAXADsAFwA8ABcAPQAZAD4AGQA/ABkAQAAbAEEAGwBCABwAQwAcAEQAHwBFACEARgAhAEcAIgBIACIASQAlAEoAJwBLACcATAAnAE0AKABOAA==","o":"1212121111111121121122112112111212111211211112111111111111111111111111111111111111"},"tocopherol":{"name":"α-Tocopherol (E)","el":"C C C C C O C C C C C C C C C C C C C C C C C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Cv5lAW0AEP7YADMAhv6dABsADP/fADcAif4TAOP/CP/Z/8v/DP9N/9z/6/4k/2sAkf8L/7f/BwBl/8j/FwCG/10AnADK/3UArgBDABsACQFh/3YAWwFc//f/zgG+/wQARQJz/0AASQKJ/9cAwQKk//n/5AIvAC4ANQNwAL//5gLdAHn/wwJNAdz/ZgKpADj/qf4N/3r/HP5E/43/GP7S/8f/l/0TAOH/Ef3O/8T/k/2PABQAE/3JACsApv2CAYoAMP6sASMAS/5pAcYATf+YAGsABf84AXQAPP/5ANj/Q//6/pwAyv56/6YAm/7a/moAnf+u/vH/iv/r/k3/AQDA/43/YQAu/6j/EAAq/5cAxf/I/3wAlwDy/90AVACDACUAtwAoALP/AwF+ADsA2wD+/oYASQFz/80AIAF4/5//fQH2/uX/6QHh/6D/tAESAEMAPAIH/y4ACwI+/wkBJALs//AAsAJ///oAFQNh/w4AsQKm/43/iQJnAEIAHwMmAIkAkAOcAOv/VQMlAHf/JQMIASr/FgNcASAAagIxARQAsAKpAaT/TALqAOT+dQJEABP/FQKrAID/qP6h/or/yf4i/xT/5P0C/9D/6f1F/yz/1vwOAIL/H/1t/5b/2vzC/yIACv0mARQA","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAIAAkACQAKAAoACwALAAwACwANAA0ADgAOAA8ADwAQABAAEQAQABIAEgATABMAFAAUABUAFQAWABUAFwAGABgAGAAZABkAGgAEABoAGgAbABsAHAAbAB0AAQAdAB0AHgAAAB8AAAAgAAAAIQADACIAAwAjAAMAJAAHACUABwAmAAcAJwAIACgACAApAAkAKgAJACsACgAsAAoALQALAC4ADAAvAAwAMAAMADEADQAyAA0AMwAOADQADgA1AA8ANgAPADcAEAA4ABEAOQARADoAEQA7ABIAPAASAD0AEwA+ABMAPwAUAEAAFABBABUAQgAWAEMAFgBEABYARQAXAEYAFwBHABcASAAYAEkAGABKABkASwAZAEwAHABNABwATgAcAE8AHgBQAA==","o":"1211111111111111111111111121121111111111111111111111111111111111111111111111111111"},"gsh":{"name":"Glutathione","el":"N C C C C O N C C S C O N C C O O C O O H H H H H H H H H H H H H H H H H","xyz":"i/49AD0A5/7f/wIAFf9+/3EArf+E/2oA3v8EAK0A1v8LACgBFwB3AGgAKQCEANn/1P/4AKP/5/+JAQwAvACcALj/6AAGAY//HAEuAMr/8QCs//r/YwFH/+3/egES/4H/tAEn/10Aq/6L/5L/Pf5Y/6D/8/53/xn/vP6BAHUAVf5rAPX/P/8UANz/8f6h/9EA8f4a/1wA1f8v/6IAzv98/wQANADGAKMACQApAKX/a//ZAKL/8v8PAT3/k//qAeP/fgE+ALT/1ACz/2MAnACK/7//kgFF/7MA7P6+/9f+","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAcACAAIAAkABwAKAAoACwAKAAwADAANAA0ADgAOAA8ADgAQAAEAEQARABIAEQATAAAAFAAAABUAAQAWAAIAFwACABgAAwAZAAMAGgAGABsABwAcAAgAHQAIAB4ACQAfAAwAIAANACEADQAiABAAIwATACQA","o":"111121111121112112111111111111111111"},"ascorbic":{"name":"Ascorbic acid (C)","el":"O C C O C O C O C O C O H H H H H H H H","xyz":"Mv+8/6IAXv8+AIAAWv9ZAOv/9P4WAKX/3f81AKb/PACXAMz/qgBRAAQADQGEADAAiwC9/wAA4ABX/y4AFACt/8j/1P8z/7L/f/+B/64AHv+HALQAxP9LAKUASv/GAN3/o/4SANr/zv88ADn/DQFl/4IA8P/+/mX/","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAIAAkACAAKAAQACgAKAAsAAAAMAAEADQABAA4AAgAPAAMAEAAEABEACQASAAsAEwA=","o":"11111121121111111111"},"xanthine":{"name":"Xanthine","el":"O C N C O C N C N C N H H H H","xyz":"2v6R/wAASf/E/wAAVv9QAAAA1v+JAAAA4/8CAQAASAAwAAAA0ABIAAAADgHM/wAAtQBv/wAAOACr/wAAu/9x/wAABP+LAAAA/QCgAAAAeAG8/wAAr/8N/wAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAIAAkABQAJAAkACgABAAoAAgALAAYADAAHAA0ACgAOAA==","o":"2112111212111111"},"o2":{"name":"Oxygen","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"h2o":{"name":"Water","el":"O H H","xyz":"EwAKAB8ACwA/AM7/4v+3/xMA","b":"AAABAAAAAgA=","o":"11"},"phenol":{"name":"Phenol","el":"O C C C C C C H H H H H H","xyz":"Dv8AAAAAnP/+/wAA3f+J/wAAcACH/wAAtQD6/wAAbQB7AAAA5/98AAAA4v6p/wAApv8s/wAApgAo/wAAIgH5/wAApQDYAAAAsv/cAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAAABwACAAgAAwAJAAQACgAFAAsABgAMAA==","o":"1212121111111"},"benzene":{"name":"Benzene","el":"C C C C C C H H H H H H","xyz":"bACn/wAAhgAqAAAAFwCLAAAAmP9fAAAAfP/P/wAA4f93/wAAvwBf/wAA7QBOAAAALAD2AAAARv+nAAAAFf+r/wAAzf8M/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAAAAUAAAAGAAEABwACAAgAAwAJAAQACgAFAAsA","o":"212121111111"},"gssg":{"name":"Oxidized glutathione (GSSG)","el":"N C C C C O N C C S S C C N C O C C C N C O O C O N C C O O C O N C C O O C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"XABcAb7/3wAjAdT/MgE+AVb/cgG3ADf/DgFdAPL+6wB8AH/+0gDj/yn/7QCu/6z/cwCP/wEAEwAO/6//pv9p/xz/av8GAF///P7n/8P/J/+l/zsAZP/w/6kAh/+y/w0Bef+GAKMAAf/GAOgA8f5JAZsAyP6tAfsAiv44ASsAFv4gAUYAsv5EAaT/hv6l/3z/Nf70/0n/aP4Y/2r/tP6m/pr/fP55/iIABP55/jUA1f5O/ogAQwEv/53/NwHp/jr/ogEJ/wUAtQFY/30A2AH7/vIASwLz/hkBcgGu/jABKQFfAUoAlwE1AWoA7gDJAZYAYwC6AZr/JwBdARQA1wC3AOH/fgGJAWv/8QBeAQX/xgHIAPL+mgGMAJL/kgCz/+v+KQH2/+X/OADo/xMAlABo/2IAPv9AAAz/uf9AAIv/1f5KAOT/Hf9B/0kAf/+lADoA1f+iANYAF//ZAFABqf6IAN0AUf9nAW8AFv/FATcBfP6LATMBef56AWv/Ev4D/zb/Hf+//qX/qv5U/lP/I/8d/moA2QG1/vj/WgGP/5UABwKf/24AGgHY/jUBCwEiAn4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADgAQABAAEQARABIAEgATABIAFAAUABUAFAAWAAwAFwAXABgAFwAZABkAGgAaABsAGwAcABsAHQAHAB4AHgAfAB4AIAAgACEAIQAiACIAIwAiACQAAQAlACUAJgAlACcAAAAoAAAAKQABACoAAgArAAIALAADAC0AAwAuAAYALwAHADAACAAxAAgAMgALADMACwA0AAwANQANADYAEAA3ABAAOAARADkAEQA6ABIAOwATADwAEwA9ABYAPgAZAD8AGgBAABoAQQAdAEIAIABDACEARAAhAEUAJABGACcARwA=","o":"11112111111111211111211211121121112112111111111111111111111111111111111"},"h2o2":{"name":"Hydrogen peroxide","el":"O O H H","xyz":"vv/Z//P/SwDx/w0At/8PAKL/QAAmAF4A","b":"AAABAAAAAgABAAMA","o":"111"},"mda":{"name":"Malondialdehyde","el":"O C C C O H H H H","xyz":"Rf/C//b/gf8gACYAAgBTAOX/aADh/+H/0QDr/x4AWv9RAIAAKgClACAA7f91AID/UwCH/6b/","b":"AAABAAEAAgACAAMAAwAEAAEABQACAAYAAgAHAAMACAA=","o":"21121111"}});


// @scene radicals makeRadicals | Свободные радикалы и антиоксиданты | Энергия
/* =========================================================
   БИОХИМИЯ · КИСЛОРОД: пути потребления O₂, активные формы кислорода,
   перекисное окисление липидов, антиоксидантная защита, респираторный взрыв фагоцита
   ========================================================= */
function makeRadicals() {
  __set_rnd(mulberry(3301));
  const scene = bioStage({ rim: 0xff8a5c });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { paths: DK ? [V3(-1.0, -1.2, 0), V3(-0.4, 0.6, 17)] : [V3(0.4, -1.2, 0), V3(1.0, 0.6, 17)], ros: [V3(40.4, -1.5, 0), V3(41.0, 2.0, 18.5)], burst: [V3(80.3, -1.3, 0), V3(80.9, 0.6, 15.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.paths[1]);
  const controls = makeControls(camera, VIEW.paths[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2600, 0.09); scene.add(fx.obj);
  const C = { o2: '#7FD6FF', sup: '#FF6A5A', h2o2: '#F2C14E', oh: '#FF3A8A', h2o: '#7FE0A0', e: '#C77DFF', ocl: '#9FE870' };
  // радикал: пара атомов кислорода с ореолом (супероксид / гидроксил)
  function radical(kind) {
    const g = new THREE.Group(); const om = atomMat('O'), hm = atomMat('H');
    // шаростержневые, как O₂ и H₂O₂ рядом: два атома и связь
    const a1 = kind === 'oh' ? V3(-0.12, -0.05, 0) : V3(-0.2, 0, 0), a2 = kind === 'oh' ? V3(0.16, 0.1, 0) : V3(0.2, 0, 0);
    const o = new THREE.Mesh(SPH, om); o.scale.setScalar(0.13); o.position.copy(a1); g.add(o);
    const o2 = new THREE.Mesh(SPH, kind === 'oh' ? hm : om); o2.scale.setScalar(kind === 'oh' ? 0.09 : 0.13); o2.position.copy(a2); g.add(o2);
    const bd = new THREE.Mesh(CYL, om); const d = a2.clone().sub(a1); bd.position.copy(a1).addScaledVector(d, 0.5); bd.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); bd.scale.set(0.04, d.length(), 0.04); g.add(bd);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: kind === 'oh' ? C.oh : C.sup, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.75 })); spr.scale.setScalar(0.9); g.add(spr); g.userData.spr = spr;
    return g;
  }
  const mol = (id, s = 0.09) => molMesh(MOL(id), { scale: s, hideH: false });

  /* ---------- 1. пути потребления кислорода ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.5, 0, 0); scene.add(G1);
  const O2C = V3(0, 0.55, 0);
  const o2big = mol('o2', 0.55); o2big.position.copy(O2C); G1.add(o2big);
  glowNucleus(G1, O2C, C.o2, 0.12, 5).core.visible = false;
  const PATHS = [
    { id: 'ox', name: 'oxidase', share: 0.9, pos: V3(-2.9, 2.2, 0), col: '#7FE0A0', prod: 'h2o', text: '<b>Oxidase pathway (~90% of O₂).</b> Cytochrome oxidase — the last complex of the respiratory chain — transfers <b>4 electrons</b> and 4 protons to oxygen: O₂ + 4e⁻ + 4H⁺ → 2H₂O, holding the intermediate forms of oxygen in its active site — so no radicals escape. The energy goes into ATP synthesis.' },
    { id: 'mono', name: 'monooxygenase', share: 0.05, pos: V3(3.0, 2.2, 0), col: '#7FD6FF', prod: 'phenol', text: '<b>Oxygenase pathway.</b> <b>Monooxygenases</b> (cytochrome P450 of the liver and adrenal glands) insert one oxygen atom into a substrate, while the other goes to water: RH + O₂ + NADPH + H⁺ → ROH + H₂O + NADP⁺. This is how drugs and toxins are detoxified and how steroid hormones, bile acids and active vitamin D are synthesized. <b>Dioxygenases</b> insert both atoms (for example, in tryptophan breakdown and prostaglandin synthesis).' },
    { id: 'perox', name: 'oxidases → H₂O₂', share: 0.03, pos: V3(-2.9, -1.0, 0), col: '#F2C14E', prod: 'h2o2', text: '<b>Peroxide-forming oxidases.</b> Flavin oxidases (amino acid oxidase, xanthine oxidase, monoamine oxidase) transfer <b>2 electrons</b> to O₂, producing <b>H₂O₂</b>. In peroxisomes it is immediately broken down by catalase. H₂O₂ can also be useful: the thyroid gland (with its own NADPH oxidase, DUOX) uses it so that thyroid peroxidase can iodinate thyroglobulin.' },
    { id: 'rad', name: 'radicals', share: 0.02, pos: V3(3.0, -1.0, 0), col: '#FF6A5A', prod: null, text: '<b>Free-radical pathway (1–3% of O₂).</b> If oxygen receives <b>a single</b> electron (leakage from complexes I and III of the respiratory chain, NADPH oxidase), the <b>superoxide anion O₂•⁻</b> forms — a particle with an unpaired electron. From it arise H₂O₂ and the most aggressive of all, the <b>hydroxyl radical •OH</b>. These are what we call reactive oxygen species (ROS).' },
  ];
  const PP = PATHS.map((p, i) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.06, 48), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(p.col).multiplyScalar(0.12), roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false })); plate.rotation.x = Math.PI / 2; plate.position.copy(p.pos).add(V3(0, 0, -0.4)); G1.add(plate);
    let prod; if (p.prod) { prod = mol(p.prod, p.prod === 'phenol' ? 0.2 : 0.45); } else { prod = radical('sup'); prod.scale.setScalar(1.4); }
    prod.position.copy(p.pos); G1.add(prod);
    const a = flowArrow(G1, O2C.clone().add(p.pos.clone().sub(O2C).normalize().multiplyScalar(0.7)), p.pos.clone().add(O2C.clone().sub(p.pos).normalize().multiplyScalar(1.1)), p.col, { bend: i % 2 ? 0.15 : -0.15, r: 0.02 + 0.06 * Math.sqrt(p.share) });
    return { ...p, prod, a, plate };
  });
  // субстрат монооксигеназы: бензол → фенол рядом
  const benz = mol('benzene', 0.13); benz.position.copy(PATHS[1].pos).add(V3(-1.25, 0.5, 0.2)); G1.add(benz);

  /* ---------- 2. АФК и защита ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const N = { o2: V3(-2.6, 2.3, 0), sup: V3(-0.9, 2.3, 0), h2o2: V3(0.9, 2.3, 0), h2o: V3(3.2, 3.0, 0), oh: V3(1.0, 0.7, 0.2) };
  const nO2 = mol('o2', 0.4); nO2.position.copy(N.o2); G2.add(nO2);
  const nSup = radical('sup'); nSup.position.copy(N.sup); nSup.scale.setScalar(1.3); G2.add(nSup);
  const nH2O2 = mol('h2o2', 0.32); nH2O2.position.copy(N.h2o2); G2.add(nH2O2);
  const nH2O = mol('h2o', 0.32); nH2O.position.copy(N.h2o); G2.add(nH2O);
  const nOH = radical('oh'); nOH.position.copy(N.oh); nOH.scale.setScalar(1.3); G2.add(nOH);
  const FE = V3(-0.1, 1.25, 0.2); const fe = glowNucleus(G2, FE, '#E0773A', 0.09, 7);
  // ферменты-защитники
  const ENZ = {
    sod: { name: 'SOD', pos: V3(0.0, 3.25, -0.3), col: '#7FD6FF', metal: '#D9905A' },
    cat: { name: 'catalase', pos: V3(2.05, 3.05, -0.25), col: '#FF8AB0', metal: '#E0773A' },
    gpx: { name: 'glutathione peroxidase', pos: V3(2.4, 1.6, -0.2), col: '#7FE0A0', metal: '#E0A040' },
  };
  Object.values(ENZ).forEach((E, i) => { E.m = new THREE.Mesh(blobGeo(0.45, 0.38, 0.4, 7 + i, 0.14, 4), protMat(E.col, 0.35)); E.m.geometry.computeVertexNormals(); E.m.position.copy(E.pos); G2.add(E.m); E.g = glowNucleus(G2, E.pos.clone().add(V3(0.1, 0.1, 0.38)), E.metal, 0.06, 6); });
  const gsh = mol('gsh', 0.07); gsh.position.set(3.6, 1.15, 0.3); G2.add(gsh);
  const gssg = mol('gssg', 0.06); gssg.position.set(4.3, 1.95, 0.2); G2.add(gssg);
  const A2 = {
    e1: flowArrow(G2, N.o2.clone().add(V3(0.6, 0, 0)), N.sup.clone().add(V3(-0.5, 0, 0)), C.sup, { bend: 0.2 }),
    sod: flowArrow(G2, N.sup.clone().add(V3(0.5, 0, 0)), N.h2o2.clone().add(V3(-0.5, 0, 0)), C.h2o2, { bend: 0.25 }),
    cat: flowArrow(G2, N.h2o2.clone().add(V3(0.45, 0.2, 0)), N.h2o.clone().add(V3(-0.45, -0.1, 0)), C.h2o, { bend: 0.15 }),
    gpx: flowArrow(G2, N.h2o2.clone().add(V3(0.4, -0.25, 0)), N.h2o.clone().add(V3(-0.2, -0.45, 0)), C.h2o, { bend: -0.5 }),
    fen: flowArrow(G2, N.h2o2.clone().add(V3(-0.1, -0.4, 0)), N.oh.clone().add(V3(0, 0.4, 0)), C.oh, { bend: -0.3 }),
  };
  // мембрана с липидами
  const MEMY = -0.75;
  const mem = schemBilayer({ w: 9.0, d: 2.4, thick: 0.75, step: 0.2, seed: 33 }); mem.position.set(0, MEMY, -1.3); G2.add(mem); // «срез»: передний край у z ≈ 0, витамин E виден в толще
  __set_rnd(mulberry(3302));
  const HEADS = []; for (let x = -4.4; x <= 4.4; x += 0.2) for (let z = -1.2; z <= 1.2; z += 0.2) HEADS.push({ p: V3(x, MEMY + 0.38, z - 1.3), d: 0, t: 0 });
  const dmgI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3a5a, transparent: true, opacity: 0.85 }), HEADS.length); dmgI.count = 0; G2.add(dmgI);
  const vitE = []; for (let i = 0; i < 9; i++) { const m = mol('tocopherol', 0.045); m.rotation.z = Math.PI / 2; m.position.set(-3.9 + i * 0.97 + rand(-0.2, 0.2), MEMY + 0.05, rand(-0.1, 0.2)); G2.add(m); vitE.push(m); }
  const vitC = []; for (let i = 0; i < 5; i++) { const m = mol('ascorbic', 0.07); m.position.set(-3.4 + i * 1.7, MEMY - 0.85, 0.6); G2.add(m); vitC.push(m); }
  const mdaM = []; for (let i = 0; i < 6; i++) { const m = mol('mda', 0.09); m.visible = false; G2.add(m); mdaM.push({ m, age: 9, v: V3(0, 0, 0) }); }

  /* ---------- 3. респираторный взрыв ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const cellG = blobGeo(3.1, 2.3, 1.6, 21, 0.06, 5); cellG.computeVertexNormals();
  G3.add(new THREE.Mesh(cellG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe0d0ff).multiplyScalar(0.18), roughness: 0.4, transparent: true, opacity: 0.18, depthWrite: false })), new THREE.Mesh(cellG, glassMat(0xd8c8ff, { rim: 0.3, base: 0.01, pow: 2, keep: true })));
  // сегментированное ядро нейтрофила
  const LOB = [V3(-0.8, 1.1, -0.4), V3(-1.6, 0.6, -0.3), V3(-1.9, -0.3, -0.2), V3(-1.2, -0.9, -0.3)];
  for (let i = 0; i < 3; i++) G3.add(new THREE.Mesh(tube([LOB[i], LOB[i].clone().lerp(LOB[i + 1], 0.5).add(V3(-0.1, 0, 0.1)), LOB[i + 1]], 0.06, 12, 8), protMat('#9F7BFF', 0.3)));
  LOB.forEach((p, i) => { const m = new THREE.Mesh(blobGeo(0.45, 0.35, 0.35, 30 + i, 0.1, 3), protMat('#9F7BFF', 0.35)); m.geometry.computeVertexNormals(); m.position.copy(p); G3.add(m); });
  const PH = V3(0.8, 0.1, 0.2), PHR = 1.05;
  const phago = new THREE.Mesh(new THREE.SphereGeometry(PHR, 40, 30), new THREE.MeshPhysicalMaterial({ color: 0x2a1a20, roughness: 0.3, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide })); phago.position.copy(PH); G3.add(phago);
  const phagoRim = new THREE.Mesh(new THREE.SphereGeometry(PHR, 40, 30), glassMat(0xffb0a0, { rim: 0.6, base: 0.02, pow: 2, keep: true })); phagoRim.position.copy(PH); G3.add(phagoRim);
  const NOX = []; for (let i = 0; i < 14; i++) { const d = randUnit(); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8), protMat('#FF9A5C', 0.6)); m.position.copy(PH).addScaledVector(d, PHR); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d); G3.add(m); NOX.push({ m, d }); }
  const mpo = []; for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), protMat('#9FE870', 0.6)); m.position.copy(PH).addScaledVector(randUnit(), 1.5 + rnd() * 0.6); G3.add(m); mpo.push(m); }
  const bacG = new THREE.CapsuleGeometry(0.16, 0.42, 6, 12), bacMat = new THREE.MeshPhysicalMaterial({ color: 0xc8d040, emissive: 0x4a4a08, emissiveIntensity: 0.17, roughness: 0.4, transparent: true });
  const BACS = [0, 1, 2].map((i) => { const m = new THREE.Mesh(bacG, bacMat.clone()); G3.add(m); return { m, home: V3(4.6 + i * 0.25, 1.2 - i * 0.9, 0.3), inside: PH.clone().add(V3(-0.25 + i * 0.25, 0.2 - i * 0.2, 0.1)), hp: 1 }; });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'paths', labels: true, rot: false, fly: null, msg: null, sel: null,
    stress: 0.25, sod: true, cat: true, ve: true, vc: true, S: 0, P: 0, OH: 0, D: 0, hist: [],
    eatT: Infinity, cgd: false, kill: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'paths'; G2.visible = m === 'ros'; G3.visible = m === 'burst'; st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function eat() { if (st.mode !== 'burst') setMode('burst'); st.eatT = st.t; BACS.forEach((b) => { b.hp = 1; b.m.material.opacity = 1; }); st.kill = 0; st.msg = st.cgd ? TXT.cgd : TXT.eat; refs.setInfo(); }
  pickOn(() => self, camera, PP.map((p) => p.plate), (id) => { const p = PP.find((q) => q.plate.uuid === id); if (p) { st.sel = p.id; refs.setInfo(); } });
  PP.forEach((p) => { p.plate.userData.pick = p.plate.uuid; });
  const cc = new THREE.Color(), m4 = new THREE.Matrix4();
  function update(dt) {
    bacLab.pos.copy(BACS[0].m.position).add(G3.position).add(V3(0.35, 0.35, 0.2));
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'paths') {
      o2big.rotation.y += dt * 0.6;
      PP.forEach((p, i) => { p.a.mat.uniforms.uTime.value = t; p.a.mat.uniforms.uOn.value = 0.25 + 0.75 * Math.sqrt(p.share) + (st.sel === p.id ? 0.5 : 0); p.prod.rotation.y += dt * (0.4 + i * 0.1); if (rnd() < (p.share * 1.4 + 0.02) * 20 * dt) fx.spawn(p.a.curve.getPoint(rnd() * 0.3).add(G1.position), V3(0, 0, 0), cc.set(p.col), 0.6, 0, 1.2); });
      if (PP[3].prod.userData.spr) PP[3].prod.userData.spr.scale.setScalar(0.8 + 0.25 * Math.sin(t * 7));
    }
    if (st.mode === 'ros') {
      // кинетика (качественная): супероксид → H₂O₂ → вода / •OH → повреждение липидов
      const gen = 0.25 + 2.2 * st.stress, kSod = st.sod ? 3.0 : 0.25, kCat = st.cat ? 2.2 : 0.12;
      st.S += (gen - kSod * st.S) * dt; st.P += (kSod * st.S * 0.5 - kCat * st.P - 0.35 * st.P) * dt;
      st.OH = 0.49 * st.P * (1 + 0.8 * st.S); const prop = st.ve ? (st.vc ? 0.06 : 0.25) : 1.0;
      st.D = clamp(st.D + (st.OH * 0.05 * (1 + 6 * prop) - (st.ve ? 0.03 : 0.006)) * dt, 0, 1);
      st.hist.push([t, st.dmgShare || 0, clamp(st.P / 2, 0, 1)]); while (st.hist.length && st.hist[0][0] < t - 30) st.hist.shift();
      Object.entries(A2).forEach(([k, a]) => { a.mat.uniforms.uTime.value = t; });
      A2.e1.mat.uniforms.uOn.value = clamp(gen / 2, 0.15, 1.2); A2.sod.mat.uniforms.uOn.value = st.sod ? clamp(st.S * 1.2, 0.1, 1.2) : 0.04;
      A2.cat.mat.uniforms.uOn.value = st.cat ? clamp(st.P, 0.1, 1.2) : 0.03; A2.gpx.mat.uniforms.uOn.value = st.cat ? clamp(st.P * 0.8, 0.08, 1) : 0.03; A2.fen.mat.uniforms.uOn.value = clamp(st.OH, 0.05, 1.3);
      ENZ.sod.m.visible = ENZ.sod.g.core.visible = ENZ.sod.g.spr.visible = st.sod; [ENZ.cat, ENZ.gpx].forEach((E) => { E.m.visible = E.g.core.visible = E.g.spr.visible = st.cat; }); gsh.visible = gssg.visible = st.cat;
      vitE.forEach((m) => { m.visible = st.ve; }); vitC.forEach((m, i) => { m.visible = st.vc; m.rotation.y += dt * 0.5; m.position.y = MEMY - 0.85 + 0.06 * Math.sin(t * 1.3 + i); });
      nSup.userData.spr.scale.setScalar(0.6 + 0.8 * clamp(st.S, 0, 1.5)); nOH.userData.spr.scale.setScalar(0.4 + 1.2 * clamp(st.OH, 0, 1.5)); fe.spr.scale.setScalar(0.5 + 0.4 * Math.sin(t * 5) ** 2);
      [nO2, nH2O2, nH2O].forEach((m, i) => { m.rotation.y += dt * (0.5 + i * 0.2); });
      // частицы
      if (rnd() < gen * 10 * dt) fx.spawn(A2.e1.curve.getPoint(rnd()).add(G2.position), V3(0, 0, 0), cc.set(C.sup), 0.6, 0, 1.3);
      if (rnd() < st.OH * 18 * dt) { const h = HEADS[Math.floor(rnd() * HEADS.length)]; const p0 = N.oh.clone().add(G2.position); fx.spawn(p0, h.p.clone().add(G2.position).sub(p0).multiplyScalar(1.6), cc.set(C.oh), 0.6, 0, 1.4); if (h.d < 1 && rnd() < 0.5) { h.d = 1; h.t = t; } }
      // цепная реакция перекисного окисления: повреждение передаётся соседям
      const pChain = (st.ve ? (st.vc ? 0.02 : 0.08) : 0.55) * dt;
      let n = 0; HEADS.forEach((h, i) => {
        if (h.d > 0) {
          if (rnd() < pChain) { const j = clamp(i + [1, -1, 13, -13][Math.floor(rnd() * 4)], 0, HEADS.length - 1); if (HEADS[j].d === 0) { HEADS[j].d = 1; HEADS[j].t = t; } }
          if (rnd() < (st.ve ? 0.12 : 0.008) * dt) h.d = 0;   // восстановление (витамин E обрывает цепь, ферменты репарации)
          if (h.p.x > -2 && rnd() < 0.04 * dt) { const q = mdaM.find((x) => x.age > 3); if (q) { q.age = 0; q.m.visible = true; q.m.position.copy(h.p).add(V3(0, 0.2, 0)); q.v.set(rand(-0.2, 0.2), 0.5, rand(-0.1, 0.3)); } }
          const s = 0.7 + 0.3 * Math.sin(t * 6 + i); m4.makeScale(s, s, s).setPosition(h.p); dmgI.setMatrixAt(n++, m4);
        }
      });
      dmgI.count = n; dmgI.instanceMatrix.needsUpdate = true; st.dmgShare = n / HEADS.length;
      mdaM.forEach((q) => { if (q.age < 3) { q.age += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.y += dt * 2; } else q.m.visible = false; });
    }
    if (st.mode === 'burst') {
      const k = t - st.eatT;
      BACS.forEach((b, i) => {
        const u = smooth(0.3 + i * 0.3, 2.2 + i * 0.3, k);
        b.m.position.copy(b.home).lerp(b.inside, u); b.m.rotation.z = 0.8 * i + t * 0.3 * (1 - u) + Math.sin(t * 2 + i) * 0.1;
        if (k > 2.6 && !st.cgd) b.hp = Math.max(0, b.hp - dt * 0.25);
        b.m.material.opacity = 0.15 + 0.85 * b.hp; b.m.material.emissiveIntensity = 0.17 * b.hp; b.m.scale.setScalar(0.6 + 0.4 * b.hp);
      });
      st.kill = 1 - BACS.reduce((a, b) => a + b.hp, 0) / 3;
      const burst = k > 2.4 && k < 14 && !st.cgd;
      NOX.forEach((x, i) => { x.m.material.emissiveIntensity = burst ? 0.6 + 0.4 * Math.sin(t * 8 + i) : 0.05; if (burst && rnd() < 0.25) fx.spawn(x.m.position.clone().add(G3.position), x.d.clone().multiplyScalar(-0.6), cc.set(C.sup), 0.8, 1.5, 1.3); });
      if (burst && rnd() < 0.35) fx.spawn(PH.clone().add(randUnit().multiplyScalar(0.5)).add(G3.position), randUnit().multiplyScalar(0.15), cc.set(rnd() < 0.5 ? C.h2o2 : C.ocl), 1.0, 0.8, 1.3);
      mpo.forEach((m, i) => { const r = PH.clone().addScaledVector(m.position.clone().sub(PH).normalize(), burst ? 1.15 : 1.6 + 0.3 * Math.sin(i)); m.position.lerp(r, dt * 0.8); });
      phagoRim.material.uniforms.uRim.value = burst ? 1.0 : 0.6;
      if (k > 0 && k < 2.6 && rnd() < 0.3) fx.spawn(V3(80 + 3.0, rand(-1, 1.5), 0.3), V3(-0.8, 0, 0), cc.set('#C8D040'), 0.6, 0.5, 1);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'paths') {
      scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'where O₂ goes (√ scale)', x0: 10 });
      PP.forEach((p, i) => { const y = 24 + i * ((h - 34) / 4), L = (w - 150) * Math.sqrt(p.share); ctx.fillStyle = p.col; ctx.globalAlpha = 0.85; ctx.fillRect(110, y, Math.max(3, L), 10); ctx.globalAlpha = 1; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(p.name, 12, y + 9); ctx.fillText(Math.round(p.share * 100) + '%', 116 + Math.max(3, L), y + 9); });
      return;
    }
    if (st.mode !== 'ros') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'membrane damage · H₂O₂ · 30 s', xl: 'time →' });
    const t0 = st.t - 30;
    [[1, '#FF3A5A'], [2, '#F2C14E']].forEach(([k, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = A.X((r[0] - t0) / 30), y = A.Y(r[k]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); });
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#FF3A5A'; ctx.fillText('damage', A.X(0.02), A.Y(0.92)); ctx.fillStyle = '#F2C14E'; ctx.fillText('H₂O₂', A.X(0.3), A.Y(0.92));
  }
  const TXT = {
    paths: '<b>Oxygen is the cell’s main oxidant.</b> Almost all O₂ is turned into water in the mitochondria, but a small part takes other routes: it is inserted into molecules (oxygenases), converted into hydrogen peroxide (oxidases) or — one electron at a time — into <b>free radicals</b>. The thickness of the arrows and the bars show the proportions. Click a pathway.',
    ros: '<b>Reactive oxygen species and the defenses against them.</b> <b>SOD</b> converts superoxide O₂•⁻ into H₂O₂; <b>catalase</b> and <b>glutathione peroxidase</b> (selenium, glutathione) convert H₂O₂ into water. With an Fe²⁺ ion, H₂O₂ gives <b>•OH</b> (the Fenton reaction), which triggers <b>chain lipid peroxidation</b> in the membrane (product: malondialdehyde). <b>Vitamin E</b> breaks the chain, and <b>vitamin C</b> regenerates vitamin E. Switch off defenses and add stress.',
    burst: '<b>Radicals as weapons.</b> Neutrophils and macrophages kill engulfed microbes with an “oxidative burst”: <b>NADPH oxidase</b> in the phagosome membrane (orange) produces superoxide, which gives rise to H₂O₂, and <b>myeloperoxidase</b> (green granules) makes <b>hypochlorous acid HOCl</b> — the active ingredient of chlorine bleach — from H₂O₂ and chloride. Click “Engulf a bacterium”.',
    eat: '<b>Phagocytosis and the respiratory burst.</b> Bacteria are surrounded by membrane and end up in a phagosome. The cell’s oxygen consumption rises 50–100-fold — not for respiration, but to produce ROS. Superoxide, H₂O₂ and HOCl destroy bacterial membranes and proteins.',
    cgd: '<b>Chronic granulomatous disease</b> is an inherited defect of NADPH oxidase. Phagocytes engulf bacteria but cannot kill them: there is no burst, and the microbes survive inside the cells. Patients suffer severe recurrent infections from childhood.',
  };
  const labels = [
    ...PATHS.map((p) => ({ text: p.name, pos: p.pos.clone().add(V3(-0.75, 1.15, 0)).add(V3(0.5, 0, 0)), color: p.col, show: () => st.labels && st.mode === 'paths' })),
    { text: 'O₂', pos: V3(1.15, 0.85, 0.3), color: C.o2, show: () => st.labels && st.mode === 'paths' },
    { text: 'H₂O', pos: V3(-1.9, 1.75, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'paths' },
    { text: 'RH → ROH', pos: V3(4.0, 2.0, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'paths' },
    { text: 'H₂O₂', pos: V3(-1.9, -1.2, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'paths' },
    { text: 'O₂•⁻', pos: V3(4.0, -1.2, 0.3), color: '#FF6A5A', show: () => st.labels && st.mode === 'paths' },
    { text: 'O₂', pos: N.o2.clone().add(V3(40 - 0.2, 0.5, 0)), color: C.o2, show: () => st.labels && st.mode === 'ros' },
    { text: 'superoxide O₂•⁻', pos: N.sup.clone().add(V3(40 - 1.1, 0.55, 0)), color: C.sup, show: () => st.labels && st.mode === 'ros' },
    { text: 'H₂O₂', pos: N.h2o2.clone().add(V3(40 - 0.2, 0.55, 0)), color: C.h2o2, show: () => st.labels && st.mode === 'ros' },
    { text: 'H₂O', pos: N.h2o.clone().add(V3(40 + 0.3, 0.45, 0)), color: C.h2o, show: () => st.labels && st.mode === 'ros' },
    { text: '•OH', pos: N.oh.clone().add(V3(40 + 0.35, -0.1, 0.1)), color: C.oh, show: () => st.labels && st.mode === 'ros' },
    { text: 'Fe²⁺ (Fenton)', pos: FE.clone().add(V3(40 - 1.6, 0, 0)), color: '#E0773A', show: () => st.labels && st.mode === 'ros' },
    { text: 'SOD', pos: V3(40 + 0.0, 3.8, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'ros' && st.sod },
    { text: 'catalase', pos: V3(40 + 2.55, 3.55, 0), color: '#FF8AB0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: 'glutathione peroxidase', pos: V3(40 + 2.9, 1.55, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: '2GSH → GSSG', pos: V3(40 + 3.7, 0.7, 0.3), color: '#C8E8A0', show: () => st.labels && st.mode === 'ros' && st.cat },
    { text: 'membrane: lipid peroxidation', pos: V3(40 + 1.2, MEMY + 0.7, 1.2), color: '#FF6A7A', show: () => st.labels && st.mode === 'ros' },
    { text: 'vitamin E', pos: V3(40 - 3.8, MEMY + 0.15, 1.2), color: '#E8C060', show: () => st.labels && st.mode === 'ros' && st.ve },
    { text: 'vitamin C', pos: V3(40 - 3.0, MEMY - 0.85, 0.8), color: '#F2E08A', show: () => st.labels && st.mode === 'ros' && st.vc },
    { text: 'phagosome', pos: V3(80 + 1.9, 0.9, 0.4), color: '#FFB0A0', show: () => st.labels && st.mode === 'burst' },
    { text: 'NADPH oxidase', pos: V3(80 + 1.4, -1.05, 0.6), color: '#FF9A5C', show: () => st.labels && st.mode === 'burst' },
    { text: 'myeloperoxidase', pos: V3(80 - 0.3, 1.8, 0.5), color: '#9FE870', show: () => st.labels && st.mode === 'burst' },
    { text: 'neutrophil nucleus', pos: V3(80 - 2.2, 1.3, 0.2), color: '#9F7BFF', show: () => st.labels && st.mode === 'burst' },
  ];
  const bacLab = { text: 'bacteria', pos: V3(0, 0, 0), color: '#C8D040', show: () => st.labels && st.mode === 'burst' && st.kill < 0.95 }; labels.push(bacLab);
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = PP.find((q) => q.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'paths' && p ? p.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'paths', label: 'Oxygen pathways' }, { id: 'ros', label: 'ROS and defenses' }, { id: 'burst', label: 'Oxidative burst' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 380px' });
    const MSG = { sod: '<b>Without superoxide dismutase</b> superoxide accumulates. Mice lacking mitochondrial SOD (MnSOD) die soon after birth; mutations in Cu/Zn-SOD are one of the inherited causes of amyotrophic lateral sclerosis (and the harm comes less from lost activity than from the toxicity of the altered protein).', cat: '<b>Without catalase and glutathione peroxidase</b> H₂O₂ builds up and, with iron, turns into •OH. Glutathione peroxidase needs <b>selenium</b>, and glutathione is regenerated with the help of NADPH from the pentose phosphate pathway — which is why in glucose-6-phosphate dehydrogenase deficiency red blood cells are destroyed by oxidative stress (for example, after eating fava beans or taking certain drugs).', ve: '<b>Without vitamin E</b> nothing breaks the chain: one lipid radical takes a hydrogen from its neighbor, that one from the next, and the damage spreads across the membrane.', vc: '<b>Without vitamin C</b> oxidized vitamin E (the tocopheroxyl radical) is not regenerated — the membrane’s defense is quickly exhausted.' };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'ros') {
        box.append(h('div', { class: 'glabel' }, 'Defenses'), h('div', { class: 'gctl' }, ...[['sod', 'SOD'], ['cat', 'Catalase and GPx'], ['ve', 'Vitamin E'], ['vc', 'Vitamin C']].map(([k, n]) => toggle(n, () => st[k], (v) => { st[k] = v; st.msg = v ? null : MSG[k]; refs.setInfo(); }))),
          h('div', { class: 'glabel', style: 'margin-top:6px' }, 'Oxidative stress'), h('div', { class: 'gctl' }, range('roxS', 0, 1, 0.01, () => st.stress, (v) => { st.stress = v; }, (v) => (v < 0.3 ? 'rest' : v < 0.65 ? 'exercise, smoking' : 'radiation, inflammation')), button('Reset', () => { st.D = 0; HEADS.forEach((h) => { h.d = 0; }); st.hist = []; })));
      } else if (st.mode === 'burst') {
        box.append(h('div', { class: 'glabel' }, 'Experiment'), h('div', { class: 'gctl' }, button('Engulf a bacterium', eat, true), toggle('NADPH oxidase defect', () => st.cgd, (v) => { st.cgd = v; eat(); })));
      } else box.append(h('div', { class: 'glabel' }, 'Pathways'), h('div', { class: 'gctl' }, seg(PATHS.map((p) => ({ id: p.id, label: p.name, color: p.col })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['paths', 'ros', 'burst'][n - 1]); return true; }
    if (k === 'e' || k === 'у') { eat(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'ros') return [['Lipids damaged', Math.round((st.dmgShare || 0) * 100), '%'], ['H₂O₂', st.P.toFixed(2), 'a.u.'], ['•OH', st.OH > 0.6 ? 'high' : st.OH > 0.2 ? 'present' : 'low', '']];
    if (st.mode === 'burst') return [['Bacteria killed', Math.round(st.kill * 100), '%'], ['NADPH oxidase', st.cgd ? 'absent' : 'present', '']];
    return [['To water', '≈90', '%'], ['To radicals', '1–3', '%']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8A5C',
    kicker: 'Biochemistry · biological oxidation', title: 'Free radicals and antioxidants',
    lede: 'Oxygen gives the cell energy, but a single unpaired electron turns it into a radical that can destroy membranes, proteins and DNA. The cell has a whole defense system against this.',
    notes: `
      <div><h2>Reactive oxygen species</h2>
        <p>Superoxide O₂•⁻, hydrogen peroxide H₂O₂, the hydroxyl radical •OH, singlet oxygen, as well as nitric oxide NO• and peroxynitrite. •OH lives for nanoseconds and reacts with the first molecule it meets — so there is no dedicated enzyme against it; the only defense is preventing its formation.</p>
        <h3>What they damage</h3><p><b>Lipids</b> — chain peroxidation of unsaturated fatty acids (membranes lose their integrity, malondialdehyde cross-links proteins). <b>Proteins</b> — oxidation of SH groups and amino acid residues. <b>DNA</b> — oxidation of bases (8-oxoguanine), strand breaks.</p>
        <h3>Defenses</h3><ul><li><b>Enzymes:</b> SOD (Cu, Zn, Mn), catalase (Fe), glutathione peroxidase (Se), glutathione reductase (NADPH).</li><li><b>Non-enzymatic antioxidants:</b> vitamins E and C, carotenoids, glutathione, uric acid, bilirubin, ceruloplasmin and transferrin (bind metal ions).</li></ul>
        <h3>Benefits</h3><p>ROS are weapons of phagocytes, signaling molecules (H₂O₂ regulates phosphatases) and participants in thyroid hormone synthesis. Harm arises from imbalance — <b>oxidative stress</b>: inflammation, ischemia and reperfusion, radiation, smoking, diabetes, aging.</p></div>
      <div><h2>Simplifications</h2><ul><li>Kinetics are qualitative; rates and concentrations are arbitrary.</li><li>Enzymes are shown as blobs; molecules are built from their chemical formulas.</li><li>Superoxide and hydroxyl are drawn as atoms with a halo.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>E</code> engulf a bacterium</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('paths'); st.fly = null;
  return self;
}
export { makeRadicals };
