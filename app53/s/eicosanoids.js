import { Sparks, THREE, V3, __set_rnd, bodyShell, clamp, ell3, flyStep, flyTarget, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, scopeShow, seg, toggle } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molFit, molMesh, plotAxes, protMat, schemBilayer } from './kit.js';
Object.assign(BIO_MOL, {"cortisol":{"name":"Кортизол","el":"C C C C C O C C C C C C C O C C C C C C C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"AP/D/0n/A//f/+D/vf5u/ywAJv5n/xUA5P3w/yUAbf34/0EAOP5tABAAuv5mAPH/Bf/qAN7/l//lAAgA3v9jAN3/kv/q/xcA3/9p/ycA2f8J/7//dgB4/0wAugDn/wAAwQDL/2r/agBqABgAxQDYAOT/VQGiAPv/RgESADAASwEZAL4AswG1////qAE7/xEAMQLk/7b/gAI1AA0AZv+6/yT/z/4WABb/yv5n/zb/5/4N/xAAzv59/5cA+v0h/1wAE/5C/7D/Cv7QABwA0v43ARgA//4GAXT/zf85Adz/nv/sAHUA4P9eAHH/gP8LAIIAs/82/4EAqf+6/t7/pgAY/zYAeQCI/7gA+QBv/1n/8wAdADX/XQC//0H/YAB2AIUAtgDnAHn/uAA0ARsAhgHfAEUAiQGlAJz/JwFuANsAbAKM/5r/FwIbAFz/RgJgAE4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADAAOAA4ADwAPABAADwARAAoAEQARABIAEgATABMAFAAPABQAFAAVABQAFgAWABcAFgAYABgAGQAAABoAAAAbAAAAHAACAB0AAgAeAAMAHwADACAABgAhAAgAIgAIACMACQAkAAkAJQAKACYACwAnAAwAKAANACkADgAqAA4AKwAQACwAEAAtABAALgARAC8AEgAwABIAMQATADIAEwAzABUANAAYADUAGAA2ABkANwA=","o":"11112121111111111111111111211111111111111111111111111111111"},"pge2":{"name":"Простагландин E2","el":"C C C C C C O C C C C O C C O C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"sv6EABr/o/4aATH/yv4/Ab//T/4jARYAfP7RAIwAg/4/AF0AO/70/70AFP8YAFUALf+X/zcAvv9v/y4A1//y/oIARwAG/9cA9P99/iMA9P+1/pX///91/jH/4v9M/5z/YwCU/3T/1wBl/8r/HAG2/xwA+QBLACcALgGWAK3/xwGQAKj/AQLYACIAWwKkAGIA0AFXAUcAU/5SAC7///5bAFz/z/5yALL+PP43AR7/5P5PAev+5P6pAcX/Hf8CAeL/J/6DATkAA/7xANv/Nv7ZAN8A3/7wAK4AUv40AP3/U/4QABYBZv9eAGUA3P5R/yYA//+//1AAf//c/r0AQgBf//4Apv8y/i0AVQBS/joAkf9s/1v/eQB4/wv/UwD//3f/9QD7/sb/bgGO/1cAjQBWAC0AJgF0AIIADgH+ALL/BQFpAFL/6gHAAE3/5wEnAKn/oAGJAQMA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwAKAAwADAANAA0ADgANAA8ACQAPAA8AEAAQABEAEQASABIAEwATABQAFAAVABUAFgAWABcAFgAYAAAAGQAAABoAAAAbAAEAHAABAB0AAgAeAAIAHwADACAAAwAhAAQAIgAEACMABQAkAAYAJQAHACYACAAnAAkAKAAKACkACwAqAAwAKwAMACwADwAtABAALgAQAC8AEQAwABIAMQATADIAEwAzABQANAAUADUAFQA2ABUANwAYADgA","o":"111111121111121111211112111111111111111111111111111111111"},"arachidonic":{"name":"Арахидоновая кислота","el":"C C C C C C C C C C C C C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"cgFhAvj/1gHuAfz/kAFnAf//9QH0AAMArgFsAAYAEAL6/wsA7wF4/wYAYgFE//v/WgGu/gIA5wBn/gIAXQCj/v3/8f87/vX/bf9W/vf/Mf/g/gUAm/7g/vv/T/5P//3/g/7b/wgAE/5DAP3/Sv7RAAoA3P02Afz/wP11AZf/lP1FAW0AMwFaAp7/pgHBAvb/MQFfAlAAFwL1AaT/FQL6AVUATgFhAVcAUAFcAab/NAL/AFwANgL6AKz/bwFiAK7/bgFnAF8AegITABMAPwIv/woAOAFk/5r/JQFv/0wAtwF2/gUA8AD6/QcATgDf/lgAVgDk/qb/DgDT/en/KP8C/vD/Tv8I/2cAW/8g/7f/aP6A/vP/4/1C//b/tf7n/2kAzf7u/7r/yP0yAEwA3/04AJ3/lP7lALz/fP7gAGoAUP2IAVUA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEgATABMAFAATABUAAAAWAAAAFwAAABgAAQAZAAEAGgACABsAAgAcAAMAHQADAB4ABAAfAAQAIAAFACEABgAiAAcAIwAHACQACAAlAAkAJgAKACcACgAoAAsAKQAMACoADQArAA0ALAAOAC0ADwAuABAALwAQADAAEQAxABEAMgASADMAEgA0ABUANQA=","o":"11111211211211211112111111111111111111111111111111111"},"asp":{"name":"Аспартат","el":"N C C C O O C O O H H H H H H H","xyz":"2//CAAsAw/9OALb/RwARAIj/mQDc//7/kABo/yEA8gAzAEQAbv/n/wIAUP9+/8z/Q/8CAIYACgClAGAAg//uACMAi/9vAF7/gQBcAFP/MgC+/0T/AgEcAKEAGf9ZAJQA","b":"AAABAAEAAgACAAMAAwAEAAMABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAUADgAIAA8A","o":"111211211111111"},"aspirin":{"name":"Аспирин","el":"C C O O C C C C C C C O O H H H H H H H H","xyz":"tgCl/2L/4QC9//P/VwHO/w0AgADA/1oA+P/B/zAAwP9G/y8ANf8z/wcA7f6e/+L/K/8kAOP/q/84AAgA4v/GAAUAmv8lAeL/ZQDvACkAegD6/z//egBK/1z/DgGb/yP//f/x/k4ACP/Q/gcAhf6T/8T/6f51AMT/dgBPAScA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkABAAJAAkACgAKAAsACgAMAAAADQAAAA4AAAAPAAUAEAAGABEABwASAAgAEwAMABQA","o":"121121212112111111111"},"pgi2":{"name":"Простациклин","el":"C C C C C C O C C C C O C C O C C C C C C O O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"RgH//iL/JAGy/qL/7wAY/wcAWQE3/24A2QFx/zQA1AEJAC4A3QE+ALIAXwFBAOL/7gBiACMAggCZAMn/awAwAd//mwBZAV4A0f9HAdr/nP/GAKD/Hv+OALf/Lv8DAJz/z/6v/3z/Pf7b/2//5/2K/9H/6f3R/1gAZv6o/6YAuP78/8cAe/4g/8gAxP/e/6v/+/9dAOj/8QD8/t7+nQHR/vL+XQFm/zv/1wBo/o3/fQGC/sr/ywBw/9L/mADq/joAcgHb/qUAMAF9/7gA8QFJ/9L/LQJV/3cAMQIqAPr/OQJZAMMAYwFOAHb/4QBZAI4AmwCKAGD/mgBoAY//9wB2AVcArv9YAT4Avf+cAZr/tv+/ADb/5v5F/2n/L/5FAIP/G/7G/wn/gf2E/6v/Ef4m/9v/kP21/5EA6v09AEkA1v7//r0Azv+J/+3/7v/L/0n/5P9jAFIA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwAKAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEgATABMAFAAUABUAFAAWAA8AFwAXABgACQAYAA0AGAAAABkAAAAaAAAAGwABABwAAQAdAAIAHgACAB8AAwAgAAMAIQAEACIABAAjAAUAJAAGACUABwAmAAgAJwAJACgACgApAAsAKgAMACsADAAsAA0ALQAQAC4AEQAvABEAMAASADEAEgAyABMAMwATADQAFgA1ABcANgAXADcAGAA4AA==","o":"1111111211111112111121111111111111111111111111111111111111"},"pgh2":{"name":"Простагландин H2","el":"C C C C C C O C C C C C C O O C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"/P1LAMEAi/4cAKQAqv40ABAAXP7O/7z/oP5H/8D/Hv9X/2j/Fv/3/gH/lv9H/8L/7v+s/7z/awCs/w4AYwBO/4oAmwDI/lIAIAEP/yMAQgFQ/50A0wB2/9sA4gBy/7//QwHT/4P/bQFFAN//MAG8AN7/vADZAH//lABsAYv/WQCHARYA1f88ASUAcP9nAfD/z//EAHAA2P2IAG8Au/3z/8wA+/2FAB0BlP6z/70A0P5WAOEAFf8pAP//i/6ZAPT/Vf7z/1X/9/3F/+P/vv4r/yQAYP76/pT/HP+7/zz/9/4g/6/+of/w/gAA2P8AAHj/gQAQADMABwBI/7kAZQCm/v3/sQCD/qAAZQHK/vz/tgA1/27/HAH8/yX/nwGc/2f/wAE1ACYAUgEKASIAZwCaAJj/2wDFABj/SQCEAT//7ACrAXz/RwDyASIAnwBlAWMAk//EAL0A","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAKAA4ADAAPAAkADwAPABAAEAARABEAEgASABMAEwAUABQAFQAVABYAFgAXABYAGAAAABkAAAAaAAAAGwABABwAAQAdAAIAHgACAB8AAwAgAAMAIQAEACIABAAjAAUAJAAGACUABwAmAAgAJwAJACgACgApAAsAKgALACsADAAsAA8ALQAQAC4AEAAvABEAMAASADEAEwAyABMAMwAUADQAFAA1ABUANgAVADcAGAA4AA==","o":"1111111211111111111211112111111111111111111111111111111111"},"txa2":{"name":"Тромбоксан A2","el":"C C C C C C O C C C O C C C O C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"zf1lAZgAQv5FATsAdf63AFkAEP5SACUAIv5HAI7/dP7K/23/Jf5X/4f/+v7I/7D/Kv9b/+7/s/9z/yoAwv8h/58ARgD6/roArwBi/5IAngAk/wgAeQCr/k0AIABV/8H/PADN/2j/cwBCALj/8gBrALH/VwElAFf/1wF5AE//MAJUAMb/BQKlAEEA4QFrAKYACAIzAT4A1v3MAbsAb/1ZAWIAz/0hAe0Ak/6NAUsAIf5KAdP/1v6qACkAgP6sAMUAq/11ADsAIP7y/1YAwf1AAF7/V/6eAGn/hP7M///+J/5B/+X/Of8iALD/+P78/vf/u//b/0oAVwDN/hgBjQDG/5oADwFN/70A9QAa/87/+v8D/4L/fgCu/xf/3f/s/zn/LgB5APr/EQHBAO3/LgEaAPP+bgHC/4D/CwJiAPL+vgHiAFP/mAJrAK7/JwLq/9z/tAFeASgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgALAA4ADQAPAAkADwAPABAAEAARABEAEgASABMAEwAUABQAFQAVABYAFgAXABYAGAAAABkAAAAaAAAAGwABABwAAQAdAAIAHgACAB8AAwAgAAMAIQAEACIABAAjAAUAJAAGACUABwAmAAgAJwAJACgACwApAAwAKgAMACsADQAsAA8ALQAQAC4AEAAvABEAMAASADEAEwAyABMAMwAUADQAFAA1ABUANgAVADcAGAA4AA==","o":"1111111211111111111211112111111111111111111111111111111111"},"ltb4":{"name":"Лейкотриен B4","el":"C C C C C C C C C O C C C C C C C O C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"b/1V/5v/yP3A/1r/l/1MAH7/lv1kABUAKP5tAEUAU/7k/3YAwv6n/04AIv/m/+r/kf82AC8AXP+cAIIA6P/Y/4EAWwCz/0UAswBX/5MAJwEa/4UAogH4/jkAyAEe/8D/cgF5/23/9QA+/07/ZQEMAIj/iQE0ABUAyAHAAAkAWQElAez/HgFaAUkANgFGAWf/Vf0K/1H/pf0m/+3/FP2E/8H/w/20/+3+L/6y/3r/Mv1ZAFf/2P2WAE7/ZP0UAEkAZP3DACoAZf6XAPf/Kv6zAJsAE/6v/74A2f5E/3YA8f4hAJ7/VP+T/7T/zv9lAOL/jv+gANUAzv+1/+QAbgDa/+L/hgA+//kAMgHg/uoA6wGz/mwAKAL6/pj/pgF2/wf/9wDf/mX/qQFAAEH/AQEwAG7/0wH1/0UAMgE9AFUAEwLCALv/9wHZAGgA1wBBAVH/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQAQABIAEgATABMAFAAUABUAFQAWABUAFwAAABgAAAAZAAAAGgABABsAAQAcAAIAHQACAB4AAwAfAAMAIAAEACEABAAiAAUAIwAGACQABwAlAAcAJgAIACcACQAoAAoAKQALACoADAArAA0ALAAOAC0ADwAuABAALwARADAAEgAxABIAMgATADMAEwA0ABQANQAUADYAFwA3AA==","o":"1111121111212121111112111111111111111111111111111111111"},"ibuprofen":{"name":"Ибупрофен","el":"C C C C C C C C C C C C C O O H H H H H H H H H H H H H H H H H H","xyz":"WQGVAGEAfwEyAPT/UQFnAGz/QAGp/xAApwCy/xMAaADI/4gA1v/R/4wAj//D/xsA0/+r/5v/WQCj/5j/9v7M/yAAuf5u/7f/yv5cAAIAY/6HADIAGv+vAK//iwH1AE8A7QCkAGEAeAFvAMIA7AEnAPL/iQHCAFT/ZQEcAB//5wB9AG//ZAGE/3AAXgFj/8H/ogDT/+QAo//i/+oAmv+g/z//jACS/zn/0/6v/4MA+v4X/6v/sf6i/1j/V/5O/9j/cP/JANP/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkABAAJAAcACgAKAAsACgAMAAwADQAMAA4AAAAPAAAAEAAAABEAAQASAAIAEwACABQAAgAVAAMAFgADABcABQAYAAYAGQAIABoACQAbAAoAHAALAB0ACwAeAAsAHwAOACAA","o":"111121212111121111111111111111111"},"celecoxib":{"name":"Целекоксиб","el":"C C C C C C C C C C N N C C C C C C S N O O C F F F H H H H H H H H H H H H H H","xyz":"GP7jAQEAbP5kAQEANP7rAAAAh/5wAAAADv9vAAAAR//2AAEA/v5oAQEAW//x/wAADf+B////Yf8L////1f83////3f/C/wAAZgDl/wEAkwBjAAEAIwGKAAIAegEpAAIAVQGe/wEA0QB+/wEAOgJXAAMAaALnAIP/agKGAJoAlgLS/97/MP99/v7/F/9T/nwAjv8r/sj/v/5z/rX/xP3YAb3/Vf44AuH/8/32AWYAx/3hAAAARP4aAP//r/8OAQIAM//IAQIApP5w////UwC4AAIAPQHzAAMAngFN/wEAxQAS/wAAEQIaAY//rwIRAb7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAQABwAHAAgACAAJAAkACgAKAAsABwALAAsADAAMAA0ADQAOAA4ADwAPABAAEAARAAwAEQAPABIAEgATABIAFAASABUACQAWABYAFwAWABgAFgAZAAAAGgAAABsAAAAcAAIAHQADAB4ABQAfAAYAIAAIACEADQAiAA4AIwAQACQAEQAlABMAJgATACcA","o":"121212112121112121211122111111111111111111"}});


// @scene eicosanoids makeEicosanoids | Эйкозаноиды и обезболивающие | Липиды
/* =========================================================
   БИОХИМИЯ · ЭЙКОЗАНОИДЫ: арахидоновый каскад (фосфолипаза A₂ → ЦОГ / 5-ЛОГ → простагландины, простациклин,
   тромбоксан, лейкотриены) и точки действия лекарств; аспирин и тромбоциты (баланс TXA₂ / PGI₂);
   где действуют эйкозаноиды и чем платят за НПВС (желудок, почки, «аспириновая» астма)
   ========================================================= */
function makeEicosanoids() {
  __set_rnd(mulberry(5401));
  const scene = bioStage({ rim: 0xff8a5c });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { path: DK ? [V3(-0.8, -1.2, 0), V3(-0.2, 0.8, 21)] : [V3(0.4, -1.6, 0), V3(0.9, 0.2, 17)], platelet: DK ? [V3(39.2, 0.0, 0), V3(39.6, 2.0, 14)] : [V3(39.2, -0.6, 0), V3(39.6, 1.4, 12.5)], organs: DK ? [V3(79.5, 0.9, 0), V3(80.0, 2.1, 15.5)] : [V3(79.5, 1.1, 0), V3(80.0, 2.3, 12.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.path[1]);
  const controls = makeControls(camera, VIEW.path[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2200, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };

  /* ---------- 1. арахидоновый каскад ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const mem = schemBilayer({ w: 2.5, d: 2.2, thick: 0.6, step: 0.17, seed: 54 }); mem.rotation.z = Math.PI / 2; mem.rotation.x = 0.5; mem.position.set(-3.6, -0.35, 0); G1.add(mem);   // бислой чуть развёрнут к зрителю: видно головки и хвосты, а не «барабан»
  __set_rnd(mulberry(5402));
  const NODE = {
    aa: { m: 'arachidonic', p: V3(-1.5, 0, 0), col: '#F2C14E' },
    pgh2: { m: 'pgh2', p: V3(1.1, 1.0, 0), col: '#FF9A5C' },
    pge2: { m: 'pge2', p: V3(3.6, 2.25, 0), col: '#FF6A5A' }, pgi2: { m: 'pgi2', p: V3(3.6, 1.0, 0), col: '#7FD6FF' }, txa2: { m: 'txa2', p: V3(3.6, -0.25, 0), col: '#C77DFF' },
    ltb4: { m: 'ltb4', p: V3(1.6, -1.65, 0), col: '#7FE0A0' },
  };
  Object.values(NODE).forEach((n) => { n.g = fit(n.m, n.m === 'arachidonic' ? 0.9 : 0.72); n.g.position.copy(n.p); G1.add(n.g); n.glow = glowNucleus(G1, n.p.clone().add(V3(0, 0, -0.3)), n.col, 0.08, 12); n.glow.core.visible = false; });
  const AR = {
    pla2: flowArrow(G1, V3(-3.1, 0.1, 0), V3(-2.25, 0.05, 0), '#F2C14E', { bend: 0.2, r: 0.025 }),
    cox: flowArrow(G1, V3(-0.8, 0.25, 0), V3(0.55, 0.85, 0), '#FF9A5C', { bend: -0.2, r: 0.025 }),
    pge: flowArrow(G1, V3(1.65, 1.25, 0), V3(3.0, 2.15, 0), '#FF6A5A', { bend: -0.15, r: 0.02 }),
    pgi: flowArrow(G1, V3(1.7, 1.0, 0), V3(3.0, 1.0, 0), '#7FD6FF', { bend: 0.0, r: 0.02 }),
    txa: flowArrow(G1, V3(1.65, 0.75, 0), V3(3.0, -0.15, 0), '#C77DFF', { bend: 0.15, r: 0.02 }),
    lox: flowArrow(G1, V3(-0.9, -0.3, 0), V3(1.0, -1.45, 0), '#7FE0A0', { bend: 0.2, r: 0.025 }),
  };
  const ENZ = { pla2: { p: V3(-2.7, 0.55, 0.2), col: '#F2C14E' }, cox: { p: V3(-0.25, 0.95, 0.3), col: '#FF9A5C' }, lox: { p: V3(0.0, -1.25, 0.3), col: '#7FE0A0' } };
  Object.values(ENZ).forEach((e) => { e.m = new THREE.Mesh(blobGeo(0.3, 0.24, 0.24, 31 + e.p.x, 0.14), protMat(e.col, 0.5)); e.m.position.copy(e.p); G1.add(e.m); });
  const xMat = new THREE.MeshBasicMaterial({ color: '#FF3A3A' }); const mkX = (p) => { const g = new THREE.Group(); [1, -1].forEach((s) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), xMat); c.rotation.z = s * Math.PI / 4; g.add(c); }); g.position.copy(p); g.visible = false; G1.add(g); return g; };
  const XC = { cox: mkX(V3(-0.1, 0.62, 0.3)), pla2: mkX(V3(-2.65, 0.1, 0.3)) };
  const DRUG = { aspirin: { m: 'aspirin', at: 'cox', name: 'Аспирин', col: '#FFFFFF' }, ibu: { m: 'ibuprofen', at: 'cox', name: 'Ибупрофен', col: '#9FE0FF' }, coxib: { m: 'celecoxib', at: 'cox', name: 'Целекоксиб (ЦОГ-2)', col: '#FFB0D0' }, gc: { m: 'cortisol', at: 'pla2', name: 'Глюкокортикоиды', col: '#F2C14E' } };
  Object.values(DRUG).forEach((d) => { d.g = fit(d.m, 0.42); d.g.position.copy(ENZ[d.at].p).add(V3(0.6, 0.5, 0.35)); d.g.visible = false; G1.add(d.g); });

  /* ---------- 2. тромбоциты и эндотелий: аспирин ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const VR = 1.35, VL = 9;
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(VR + 0.06, VR + 0.06, VL, 48, 1, true, Math.PI / 2, Math.PI), organMat('#D86A7A', 0.4, { side: THREE.DoubleSide, emissiveIntensity: 0.04 })); wall.rotation.z = Math.PI / 2; G2.add(wall);   // задняя половина сосуда, открытая к зрителю
  // эндотелиальные клетки — плитки по стенке
  const ENDO = []; for (let i = 0; i < 26; i++) for (let j = 0; j < 7; j++) { const x = -VL / 2 + 0.2 + i * 0.34, a = Math.PI * (0.58 + j * 0.14); const m = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.38), organMat('#E8A0B0', 0.5, { emissiveIntensity: 0.05 })); m.position.set(x, Math.sin(a) * (VR - 0.02), Math.cos(a) * (VR - 0.02)); m.lookAt(x, 0, 0); m.rotateX(Math.PI / 2); G2.add(m); ENDO.push(m); }
  const INJ = V3(0.4, -0.15, -VR + 0.06);   // место повреждения (коллаген) — на задней стенке, лицом к зрителю
  const coll = new THREE.Mesh(new THREE.TorusKnotGeometry(0.22, 0.04, 64, 8, 2, 5), organMat('#F2E6C8', 0.6, { emissiveIntensity: 0.15 })); coll.position.copy(INJ); coll.scale.set(1.6, 1.2, 0.5); G2.add(coll);
  const NPLT = 42, pltGeo = new THREE.SphereGeometry(0.11, 14, 8); pltGeo.scale(1, 0.38, 1);
  const PLT = Array.from({ length: NPLT }, (_, i) => { const m = new THREE.Mesh(pltGeo, organMat('#C8B0FF', 0.55, { emissiveIntensity: 0.1 })); G2.add(m); return { m, x: -VL / 2 + rnd() * VL, r: rnd() * 0.9, a: rnd() * Math.PI * 2, v: 0.6 + rnd() * 0.5, stuck: false, slot: null }; });
  const RBC = Array.from({ length: 22 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.07, 10, 18), organMat('#C83A40', 0.5)); G2.add(m); return { m, x: -VL / 2 + rnd() * VL, r: rnd() * 0.95, a: rnd() * Math.PI * 2, v: 0.8 + rnd() * 0.4 }; });
  const clotG = glowNucleus(G2, INJ.clone().add(V3(0, 0, 0.25)), '#C77DFF', 0.06, 12);

  /* ---------- 3. где действуют и чем платим за НПВС ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  bodyShell(G3, { rim: 0.14, keep: true, legs: false });
  const SITES = {
    brain: { p: V3(0, 4.25, 0.08), col: '#FF6A5A', name: 'гипоталамус: лихорадка' }, stomach: { p: V3(-0.2, 1.75, 0.3), col: '#FF9A5C', name: 'желудок: защита слизистой' },
    kidney: { p: V3(-0.33, 1.15, -0.12), col: '#7FD6FF', name: 'почки: кровоток' }, lung: { p: V3(0.42, 2.4, 0.05), col: '#7FE0A0', name: 'бронхи: лейкотриены (у части больных астмой)' },
    joint: { p: V3(1.42, 1.15, 0.05), col: '#FF6A5A', name: 'запястье: боль, отёк' }, uterus: { p: V3(0, 0.15, 0.2), col: '#FFB0D0', name: 'матка: сокращения' },
  };
  Object.values(SITES).forEach((s) => { s.g = glowNucleus(G3, s.p, s.col, 0.045, 10); });
  const stomM = new THREE.Mesh(ell3(0.32, 0.2, 0.16, SITES.stomach.p), organMat('#E8908A', 0.45)); G3.add(stomM);
  const ulcer = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), new THREE.MeshBasicMaterial({ color: '#FF3A3A' })); ulcer.position.copy(SITES.stomach.p).add(V3(0.02, -0.02, 0.17)); ulcer.visible = false; G3.add(ulcer);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'path', labels: true, rot: false, fly: null, msg: null, drug: 'none', infl: true, asp: 'none', day: 0, txa: 1, pgi: 1, clot: 0, ndrug: 'none', fever: true };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['path', 'platelet', 'organs'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  function pathUpdate(dt, t) {
    const D = st.drug, infl = st.infl ? 1 : 0.35;
    const pla2 = D === 'gc' ? 0.08 : 1;
    const cox1 = D === 'aspirin' || D === 'ibu' ? 0.06 : 1, cox2 = D === 'aspirin' || D === 'ibu' || D === 'coxib' ? 0.06 : 1;
    const coxAll = (cox1 * 0.35 + cox2 * 0.65 * infl) / (0.35 + 0.65 * infl);
    const aaL = pla2 * infl, pghL = aaL * coxAll;
    const lv = { aa: aaL, pgh2: pghL, pge2: pghL * (D === 'coxib' ? 0.25 : 1), pgi2: pghL * (D === 'coxib' ? 0.3 : 1), txa2: D === 'coxib' ? aaL * 0.9 : pghL, ltb4: aaL * (D === 'aspirin' || D === 'ibu' ? 1.35 : 1) };
    st.lv = lv;
    AR.pla2.mat.uniforms.uOn.value = clamp(0.8 * pla2 * infl, 0.04, 1); AR.cox.mat.uniforms.uOn.value = clamp(0.8 * coxAll * aaL, 0.04, 1); AR.lox.mat.uniforms.uOn.value = clamp(0.7 * lv.ltb4, 0.04, 1.1);
    AR.pge.mat.uniforms.uOn.value = clamp(0.8 * lv.pge2, 0.04, 1); AR.pgi.mat.uniforms.uOn.value = clamp(0.8 * lv.pgi2, 0.04, 1); AR.txa.mat.uniforms.uOn.value = clamp(0.8 * lv.txa2, 0.04, 1);
    Object.values(AR).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    Object.entries(NODE).forEach(([k, n]) => { const v = clamp(lv[k], 0, 1.4); n.glow.spr.material.opacity = 0.08 + 0.55 * v; n.glow.spr.scale.setScalar(1 + 0.1 * Math.sin(t * 3)); n.g.rotation.y += dt * (0.15 + 0.4 * v); n.g.scale.setScalar(0.75 + 0.3 * Math.min(v, 1)); });
    Object.entries(DRUG).forEach(([k, d]) => { d.g.visible = k === D; d.g.rotation.y += dt * 0.6; });
    XC.cox.visible = D === 'aspirin' || D === 'ibu' || (D === 'coxib' && st.infl); XC.pla2.visible = D === 'gc';
    ENZ.cox.m.material.emissiveIntensity = 0.03 + 0.25 * coxAll * (0.5 + 0.5 * Math.sin(t * 4)); ENZ.pla2.m.material.emissiveIntensity = 0.03 + 0.25 * pla2 * (0.5 + 0.5 * Math.sin(t * 4 + 1)); ENZ.lox.m.material.emissiveIntensity = 0.03 + 0.25 * (0.5 + 0.5 * Math.sin(t * 4 + 2));
    if (rnd() < dt * 6 * aaL) fx.spawn(V3(-3.0, rand(-0.6, 0.6), rand(-0.6, 0.6)), V3(0.6, 0, 0), C.set('#F2C14E'), 0.6, 0.6, 1);
  }
  function plateletUpdate(dt, t) {
    // аспирин в малой дозе: ЦОГ тромбоцитов выключена до конца их жизни (7–10 сут), эндотелий делает ЦОГ заново за часы
    const A = st.asp; st.day += dt * 0.6;
    const txT = A === 'low' ? 0.08 : A === 'high' ? 0.08 : A === 'stop' ? Math.min(1, 0.08 + st.day / 9) : 1;
    const pgT = A === 'high' ? 0.45 : A === 'low' ? 0.9 : 1;
    st.txa += (txT - st.txa) * Math.min(1, dt * 1.5); st.pgi += (pgT - st.pgi) * Math.min(1, dt * 1.5);
    const drive = clamp(st.txa - 0.55 * st.pgi + 0.3, 0, 1.2);   // сколько тромбоцитов прилипает
    const want = Math.round(10 + 14 * drive);   // пробка всё равно образуется (АДФ, тромбин, коллаген); TXA₂ её усиливает
    const stuck = PLT.filter((p) => p.stuck);
    if (stuck.length < want && rnd() < dt * 6) { const p = PLT.find((q) => !q.stuck && Math.abs(q.x - INJ.x) < 1.2); if (p) { p.stuck = true; const k = stuck.length; p.slot = INJ.clone().add(V3(rand(-0.4, 0.4) * (1 + k * 0.03), rand(-0.3, 0.3), 0.08 + 0.08 * Math.floor(k / 5) + rand(0, 0.04))); } }
    if (stuck.length > want && rnd() < dt * 3) { const p = stuck[(rnd() * stuck.length) | 0]; p.stuck = false; p.r = 0.5; }
    PLT.forEach((p, i) => {
      if (p.stuck) { p.m.position.lerp(p.slot, Math.min(1, dt * 3)); p.m.rotation.set(0, i, 0.3); p.m.material.emissiveIntensity = 0.15 + 0.1 * Math.sin(t * 5 + i); return; }
      p.x += dt * p.v * 1.6; if (p.x > VL / 2) p.x -= VL; p.a += dt * 0.3;
      p.m.position.set(p.x, Math.cos(p.a) * p.r, Math.sin(p.a) * p.r * 0.6 - 0.3); p.m.rotation.set(t + i, i, 0); p.m.material.emissiveIntensity = 0.08;
    });
    RBC.forEach((r, i) => { r.x += dt * r.v * 1.6; if (r.x > VL / 2) r.x -= VL; r.m.position.set(r.x, Math.cos(r.a + t * 0.1) * r.r, Math.sin(r.a + t * 0.1) * r.r * 0.6 - 0.3); r.m.rotation.set(t * 0.5 + i, i * 0.7, 0); });
    st.clot = stuck.length;
    clotG.spr.material.opacity = 0.1 + 0.5 * clamp(stuck.length / 26, 0, 1);
    ENDO.forEach((m, i) => { m.material.emissiveIntensity = 0.03 + 0.12 * st.pgi * (0.5 + 0.5 * Math.sin(t * 2 + i * 0.37)); });
    if (st.txa > 0.5 && stuck.length > 3 && rnd() < dt * 6 * st.txa) fx.spawn(INJ.clone().add(V3(rand(-0.3, 0.3), 0.3, rand(-0.3, 0.3))).add(G2.position), V3(0, 0.4, 0), C.set('#C77DFF'), 0.5, 0.6, 1);
    if (st.pgi > 0.5 && rnd() < dt * 5 * st.pgi) { const e = ENDO[(rnd() * ENDO.length) | 0]; fx.spawn(e.position.clone().add(G2.position), V3(0, 0.25, 0), C.set('#7FD6FF'), 0.5, 0.6, 1); }
  }
  function organsUpdate(dt, t) {
    const N = st.ndrug;
    const cox = N === 'nsaid' || N === 'aspirin' ? 0.1 : N === 'coxib' ? 0.6 : N === 'para' ? 0.55 : 1;
    const peri = N === 'coxib' ? 1 : cox;   // ЦОГ-1 в желудке и почках
    const lvl = { brain: N === 'none' ? 1 : 0.15, stomach: N === 'nsaid' || N === 'aspirin' ? 0.1 : 1, kidney: N === 'nsaid' || N === 'aspirin' ? 0.1 : N === 'coxib' ? 0.6 : 1, lung: N === 'aspirin' || N === 'nsaid' ? 0.6 : 0.35, joint: N === 'none' || N === 'para' ? 1 : 0.2, uterus: cox * 0.8 };
    Object.entries(SITES).forEach(([k, s]) => { const v = lvl[k]; s.g.spr.material.opacity = 0.12 + 0.6 * v; s.g.spr.scale.setScalar((0.6 + 0.6 * v) * (1 + 0.08 * Math.sin(t * 4))); });
    ulcer.visible = (N === 'nsaid' || N === 'aspirin') && Math.sin(t * 2) > -0.7;
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'path') pathUpdate(dt, t);
    if (st.mode === 'platelet') plateletUpdate(dt, t);
    if (st.mode === 'organs') organsUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'platelet') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'тромбоксан A₂ и простациклин', x0: 10 });
    [['TXA₂ (тромбоциты)', st.txa, '#C77DFF'], ['PGI₂ (эндотелий)', st.pgi, '#7FD6FF']].forEach(([n, v, col], i) => { const y = h * (0.42 + i * 0.32); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(A.X(0), y - 5, A.X(1) - A.X(0), 10); ctx.fillStyle = col; ctx.fillRect(A.X(0), y - 3, (A.X(1) - A.X(0)) * clamp(v, 0, 1), 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, A.X(0) + 2, y - 8); });
  }

  const PTXT = {
    none: '<b>Эйкозаноиды</b> — местные гормоны из <b>арахидоновой кислоты</b> (20 атомов углерода, отсюда «эйкоза-»). При повреждении или воспалении <b>фосфолипаза A₂</b> отрезает её от фосфолипида мембраны. Дальше два пути. <b>Циклооксигеназа</b> (ЦОГ-1 работает всегда, ЦОГ-2 включается при воспалении) делает PGH₂, а из него — <b>простагландин E₂</b> (боль, жар, отёк, защита желудка), <b>простациклин</b> (эндотелий: расширяет сосуды, мешает тромбам) и <b>тромбоксан A₂</b> (тромбоциты: склеивает их, сужает сосуды). <b>5-липоксигеназа</b> делает <b>лейкотриены</b>: B₄ зовёт нейтрофилы, C₄ и D₄ сужают бронхи. Живут эйкозаноиды секунды–минуты и действуют рядом с местом рождения.',
    aspirin: '<b>Аспирин</b> ацетилирует серин в канале ЦОГ — <b>необратимо</b>: фермент выключен до конца жизни молекулы. Падают все простагландины и тромбоксан: проходят боль, жар и воспаление, тромбоциты слипаются хуже. Арахидоновая кислота отчасти уходит в путь липоксигеназы — у некоторых людей больше лейкотриенов и приступы астмы.',
    ibu: '<b>Ибупрофен</b> (и диклофенак, напроксен) занимает канал ЦОГ <b>обратимо</b>, конкурируя с арахидоновой кислотой; через несколько часов препарат уходит, и фермент снова работает. Блокирует и ЦОГ-1, и ЦОГ-2 — отсюда побочные эффекты на желудок и почки.',
    coxib: '<b>Целекоксиб</b> избирательно блокирует <b>ЦОГ-2</b> — воспалительную. Желудок (ЦОГ-1) страдает меньше. Но ЦОГ-2 эндотелия делает простациклин, а тромбоциты свой тромбоксан делают ЦОГ-1 — баланс сдвигается к тромбам, растёт риск инфарктов и инсультов (один из коксибов, рофекоксиб, был отозван).',
    gc: '<b>Глюкокортикоиды</b> (преднизолон, дексаметазон) действуют выше: через ядерный рецептор включают синтез аннексина-1, который тормозит <b>фосфолипазу A₂</b>, и подавляют ген ЦОГ-2. Нет арахидоновой кислоты — нет ни простагландинов, ни лейкотриенов. Поэтому они помогают и при астме, где НПВС бессильны.',
  };
  const ATXT = {
    none: '<b>Баланс в сосуде.</b> Тромбоциты делают <b>тромбоксан A₂</b> (ЦОГ-1): он склеивает их на месте повреждения (коллаген стенки) и сужает сосуд. Здоровый <b>эндотелий</b> выделяет <b>простациклин</b>: расширяет сосуд и не даёт тромбоцитам слипаться там, где стенка цела. Пока они в равновесии, тромб растёт только там, где нужно.',
    low: '<b>Малая доза аспирина</b> (75–150 мг в сутки). У тромбоцита нет ядра — он не может сделать новую ЦОГ, и тромбоксана нет до конца его жизни (7–10 дней). Эндотелиальные клетки с ядром синтезируют ЦОГ заново за часы, и простациклин почти сохраняется. Пробка на месте ранения всё равно образуется (АДФ, тромбин), но меньше — и меньше тромбов в бляшках: так предотвращают повторные инфаркты и инсульты. Ибупрофен, принятый до аспирина, занимает канал ЦОГ и мешает аспирину сработать. Цена — кровоточивость и риск язвы.',
    high: '<b>Большая доза аспирина</b> (обезболивающая, граммы в сутки) подавляет ЦОГ и в эндотелии: простациклина тоже меньше, и выигрыш против тромбов не растёт, а риск кровотечений и язв — растёт.',
    stop: '<b>Отмена аспирина.</b> Тромбоксан возвращается постепенно — по мере того, как костный мозг выпускает новые тромбоциты (около 10% в сутки). Поэтому перед плановой операцией его отменяют за 5–7 дней — если риск кровотечения выше риска тромбоза (после стентирования сосудов сердца аспирин обычно не отменяют).',
  };
  const OTXT = {
    none: '<b>Где работают простагландины.</b> В гипоталамусе PGE₂ поднимает «уставку» температуры — <b>лихорадка</b>. В очаге воспаления делает нервные окончания чувствительнее — <b>боль</b>, расширяет сосуды — краснота и отёк. В желудке защищает слизистую (слизь, бикарбонат, кровоток), в почках поддерживает кровоток, в матке вызывает сокращения (менструальные боли, роды). В бронхах лейкотриены вызывают спазм.',
    nsaid: '<b>НПВС</b> (ибупрофен, диклофенак) убирают жар, боль и воспаление, но вместе с ними и полезные простагландины: <b>язвы и кровотечения желудка</b> (красное пятно), ухудшение кровотока в почках (особенно при обезвоживании, вместе с мочегонными и иАПФ), задержка жидкости. Облегчают менструальные боли.',
    aspirin: '<b>Аспирин</b>: то же, что НПВС, плюс необратимое действие на тромбоциты. У части людей с астмой и полипами носа вызывает тяжёлый бронхоспазм — <b>аспириновая астма</b> (больше лейкотриенов). Детям с вирусными инфекциями аспирин не дают из-за синдрома Рея (поражение печени и мозга).',
    coxib: '<b>Коксибы</b> снимают воспаление и боль, щадя желудок (ЦОГ-1 работает), но повышают риск тромбозов; почки тоже могут страдать — ЦОГ-2 там есть.',
    para: '<b>Парацетамол</b> снижает жар и боль, действуя в основном в мозге (там мало перекисей, и он может подавлять ЦОГ), но почти не снимает воспаление и не трогает желудок и тромбоциты. Опасен передозировкой — печень (см. тему «Печень: обезвреживание, алкоголь, парацетамол»).',
  };
  const labels = [
    { text: 'мембрана: фосфолипиды', pos: V3(-4.0, -2.0, 0.3), color: '#E8C07A', show: () => st.labels && st.mode === 'path' },
    ...Object.entries(NODE).map(([k, n]) => ({ text: { aa: 'арахидоновая кислота', pgh2: DK ? 'простагландин H₂' : 'PGH₂', pge2: 'простагландин E₂', pgi2: DK ? 'простациклин (PGI₂)' : 'PGI₂', txa2: 'тромбоксан A₂', ltb4: 'лейкотриен B₄' }[k], pos: n.p.clone().add(V3(-0.45, -0.68, 0.3)), color: n.col, show: () => st.labels && st.mode === 'path' })),
    { text: 'фосфолипаза A₂', pos: ENZ.pla2.p.clone().add(V3(-0.7, 0.5, 0.2)), color: '#F2C14E', show: () => st.labels && st.mode === 'path' },
    { text: 'ЦОГ-1 / ЦОГ-2', pos: ENZ.cox.p.clone().add(V3(-0.9, 0.6, 0.2)), color: '#FF9A5C', show: () => st.labels && st.mode === 'path' },
    { text: '5-липоксигеназа', pos: ENZ.lox.p.clone().add(V3(-1.0, -0.85, 0.2)), color: '#7FE0A0', show: () => st.labels && st.mode === 'path' },
    ...Object.entries(DRUG).map(([k, d]) => ({ text: d.name, pos: d.g.position.clone().add(V3(0.35, 0.3, 0.2)), color: '#FFFFFF', show: () => st.labels && st.mode === 'path' && st.drug === k })),
    { text: 'боль, жар; желудок', pos: NODE.pge2.p.clone().add(V3(0.6, 0.05, 0.2)), color: '#FF6A5A', show: () => DK && st.labels && st.mode === 'path' },
    { text: 'сосуды, против тромбов', pos: NODE.pgi2.p.clone().add(V3(0.6, 0.05, 0.2)), color: '#7FD6FF', show: () => DK && st.labels && st.mode === 'path' },
    { text: 'склеивает тромбоциты', pos: NODE.txa2.p.clone().add(V3(0.6, 0.05, 0.2)), color: '#C77DFF', show: () => DK && st.labels && st.mode === 'path' },
    { text: 'зовёт нейтрофилы; бронхоспазм (C₄, D₄)', pos: NODE.ltb4.p.clone().add(V3(0.6, 0.05, 0.2)), color: '#7FE0A0', show: () => DK && st.labels && st.mode === 'path' },
    { text: 'повреждение: коллаген', pos: INJ.clone().add(V3(40 - 1.3, -0.55, 0.3)), color: '#F2E6C8', show: () => st.labels && st.mode === 'platelet' },
    { text: 'тромбоциты: TXA₂', pos: INJ.clone().add(V3(40 + 0.35, 0.45, 0.5)), color: '#C77DFF', show: () => st.labels && st.mode === 'platelet' },
    { text: 'эндотелий: PGI₂', pos: V3(40 - 3.3, 0.9, -0.95), color: '#7FD6FF', show: () => st.labels && st.mode === 'platelet' },
    { text: 'эритроциты', pos: V3(40 + 2.9, 1.55, 0.3), color: '#FF8A8A', show: () => st.labels && st.mode === 'platelet' },
    ...Object.entries(SITES).map(([k, s]) => ({ text: s.name, pos: s.p.clone().add(V3(80 + (k === 'kidney' ? -1.15 : k === 'joint' ? 0.15 : 0.25), k === 'joint' && !DK ? -0.3 : 0.12, 0.15)), color: s.col, show: () => st.labels && st.mode === 'organs' })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'path' ? PTXT[st.drug] : st.mode === 'platelet' ? ATXT[st.asp] : OTXT[st.ndrug]); };
    refs.modeSeg = seg([{ id: 'path', label: 'Каскад и лекарства' }, { id: 'platelet', label: 'Аспирин и тромбы' }, { id: 'organs', label: 'Действие и побочные' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'path') box.append(h('div', { class: 'glabel' }, 'Лекарство'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Нет' }, ...Object.entries(DRUG).map(([id, d]) => ({ id, label: d.name }))], () => st.drug, (v) => { st.drug = v; refs.setInfo(); }), toggle('Воспаление', () => st.infl, (v) => { st.infl = v; })));
      else if (st.mode === 'platelet') box.append(h('div', { class: 'glabel' }, 'Аспирин'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Нет' }, { id: 'low', label: 'Малая доза' }, { id: 'high', label: 'Большая доза' }, { id: 'stop', label: 'Отмена малой дозы' }], () => st.asp, (v) => { st.asp = v; st.day = 0; if (v === 'stop') st.txa = 0.08; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Препарат'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Нет' }, { id: 'nsaid', label: 'НПВС' }, { id: 'aspirin', label: 'Аспирин' }, { id: 'coxib', label: 'Коксиб' }, { id: 'para', label: 'Парацетамол' }], () => st.ndrug, (v) => { st.ndrug = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['path', 'platelet', 'organs'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'platelet') return [['Тромбоцитов в тромбе', st.clot, ''], ['Сутки', st.asp === 'stop' ? Math.floor(st.day) : '—', '']];
    if (st.mode === 'organs') return [['Жар и боль', st.ndrug === 'none' ? 'есть' : 'меньше', ''], ['Желудок', st.ndrug === 'nsaid' || st.ndrug === 'aspirin' ? 'риск язвы' : 'защищён', '']];
    const L = st.lv || {}; return [['Простагландины', Math.round(100 * clamp(L.pge2 || 0, 0, 1.5)), '%'], ['Лейкотриены', Math.round(100 * clamp(L.ltb4 || 0, 0, 1.5)), '%']];
  }
  const self = {
    labelBg: true, mobZoom: 0.84, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8A5C',
    kicker: 'Биохимия · обмен липидов', title: 'Эйкозаноиды',
    lede: 'Из одной жирной кислоты мембраны клетка за секунды делает сигналы боли, жара, тромба и спазма — а аспирин и ибупрофен выключают один фермент на этом пути.',
    notes: `
      <div><h2>Эйкозаноиды</h2>
        <p>Производные полиненасыщенных C₂₀-кислот (арахидоновая — ω-6, эйкозапентаеновая — ω-3). Простаноиды (простагландины, простациклин, тромбоксаны) — циклооксигеназный путь; лейкотриены и липоксины — липоксигеназный; эпоксиды — цитохромы P450. Действуют через рецепторы, сопряжённые с G-белками (EP1–EP4, IP, TP, BLT, CysLT), местно, распадаются за секунды–минуты.</p>
        <h3>ЦОГ-1 и ЦОГ-2</h3><p>ЦОГ-1 — конститутивная (желудок, почки, тромбоциты), ЦОГ-2 — индуцибельная (воспаление: цитокины, эндотоксин), но есть и в эндотелии, почках, мозге. Фермент двойной: циклооксигеназа (арахидоновая кислота → PGG₂) и пероксидаза (PGG₂ → PGH₂).</p>
        <h3>Лекарства</h3><ul><li>НПВС: аспирин (необратимо), ибупрофен, диклофенак, напроксен (обратимо); коксибы — селективно ЦОГ-2.</li><li>Глюкокортикоиды — фосфолипаза A₂ и ген ЦОГ-2.</li><li>Против лейкотриенов: монтелукаст (рецептор CysLT₁), зилеутон (5-ЛОГ) — при астме.</li><li>Аналоги простагландинов: мизопростол (защита желудка, акушерство), латанопрост (глаукома), алпростадил (сохраняет артериальный проток открытым при протоково-зависимых пороках сердца у новорождённых; закрывают проток, наоборот, НПВС).</li></ul></div>
      <div><h2>Условности</h2><ul><li>Молекулы — по химическим формулам; ферменты — условные капли, мембрана и сосуд — схемы.</li><li>Уровни эйкозаноидов и число тромбоцитов — качественная модель; время отмены аспирина сжато.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('path'); st.fly = null;
  return self;
}
export { makeEicosanoids };
