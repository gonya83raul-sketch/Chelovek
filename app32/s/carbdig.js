import { Sparks, THREE, V3, __set_rnd, button, clamp, displaceGeo, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, noise3, organMat, rand, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molGlow, molMesh, plotAxes, protMat } from './kit.js';
Object.assign(BIO_MOL, {"sucrose":{"name":"Сахароза","el":"O C C O C C O O C O C C O C O C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H","xyz":"Qv4B/ycAqP46/9f/1/61/yQAYv/C/w4Agv9NAAEAj/+ZAIUAof9BAPEA8f9lALD/ZQArAOT/kADF/4v/CwGI/63/9wDy/sX/ogDa/jQAUwHI/yQA2QGW/yoAWAFhABcAhAGZAJIAzgCaAPT/2ADkAHr/B/+IALv/DP94AC7/kv4yAPD/T/52AFgAN/6k/hEA+/70/sz/gv5W/3X/w/6o/44A5f/dAH4AN//WAJcAyP9vAD0BVgD+/0YATgGS/1X/zADF/mz/WAHE/tj/ywCY/m8AIAGu/4AA3wFU/28AngF8AMj/tQHqAIAArwDeAEQAlwArAXv/+P7wANT/t/6TAAj/Tv4bAJ7/KP42AJUA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABAAHAAcACAAIAAkACQAKAAoACwALAAwACgANAA0ADgANAA8ADwAQAA8AEQAIABEAEQASAAQAEwATABQAEwAVAAIAFQAVABYAAAAXAAEAGAABABkAAgAaAAUAGwAFABwABgAdAAgAHgAKAB8ACwAgAAsAIQAMACIADQAjAA4AJAAPACUAEAAmABEAJwASACgAEwApABQAKgAVACsAFgAsAA==","o":"1111111111111111111111111111111111111111111111"},"atp":{"name":"АТФ","el":"N C N C N C N C N C C O C C O P O O O P O O O P O O O C O C O H H H H H H H H H H H H H H H H","xyz":"m//TAeX/4P9dARgAwP8sAYwAAQC7AL8AXwB/AHwAhQCuAAEA4gCGAKX/2wDeADn/gAA2AVH/SQAbAc3/PQEXAK3/+ACc/53/FwFA/wMApgDs/joAKgAt/ygA1v/b/rX/rf9R/u7/NQC8/jD/Uf8q/4H///57//b/Q/8DAAwA/P4n/4UAZP6P/8H/Fv4LAAgAfv30//b/Of6bAL7/Mv4YAKoATgGV/3kAsQFN/70AgwEUADYADwIQACMAUv//ARwAtP/5AYr/5f+UACEBFwHaAOH+igEeAGD/aAH//uH/qACI/g8AtgDg/qcABgB2/gD/rP7x/oEA5P3IALT/NP68/8wA+wCt/7sApQHt/rAAZgFrAHAALQJjAPv/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAGAAoACgALAAsADAAMAA0ADQAOAA4ADwAPABAADwARAA8AEgASABMAEwAUABMAFQATABYAFgAXABcAGAAXABkAFwAaAAwAGwAbABwAGwAdAAoAHQAdAB4AAAAfAAAAIAADACEABwAiAAoAIwAMACQADQAlAA0AJgARACcAFQAoABkAKQAaACoAGwArABwALAAdAC0AHgAuAA==","o":"1212111211211111121112111211111111111111111111111"},"g6p":{"name":"Глюкозо-6-фосфат","el":"O C O C C O P O O O C O C O C O H H H H H H H H H H H H H","xyz":"1v4b/yoAGv+G/+r/pf9s/+f/7v/P/6D/ggCp/5j/tACX/xsAOAH2/yoAdwHe/7UAEwGXAB0AqQHO/7j/2/9cANj/CAC6AHb/SP9+APf/Rf/sAFEA/f4IADUAcf4jADEA+v4Q/4QA9P6P/4T/x//Q/zn/uAD5/2X/jABN/2D/7QCwAHMArAEaAHv/FgBoADMAQAD8AKL/F/+aAJr/W/8+ASAAHP/8/54AYv56AAoA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAGAAkAAwAKAAoACwAKAAwADAANAAwADgABAA4ADgAPAAAAEAABABEAAwASAAQAEwAEABQACAAVAAkAFgAKABcACwAYAAwAGQANABoADgAbAA8AHAA=","o":"11111121111111111111111111111"},"g1p":{"name":"Глюкозо-1-фосфат","el":"O C C O C O P O O O C O C O C O H H H H H H H H H H H H H","xyz":"+v7wAF0ADP/OANT/Y/9RAMT/5/9sAPP/IQAFAEAAoQAkAGwAHwEeAAYAkwFxAEcAWQGE//X/BQFhAHH/DgB8/wIANwBy/3v/d/9Z/wQAW/8O/3kAH//Y/wMAqP66/7v/ov7SAHoAPf8iAaH/q/69AKb/a/89AFj/5f8DAJ8AgAGB/5z/9AAXADb/QgAx/z4AMwAW/17/YP8d/6z/Qv+0/mAABP/u/2sAlf5c/8P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAGAAkABAAKAAoACwAKAAwADAANAAwADgACAA4ADgAPAAAAEAABABEAAQASAAIAEwAEABQACAAVAAkAFgAKABcACwAYAAwAGQANABoADgAbAA8AHAA=","o":"11111121111111111111111111111"},"fructose":{"name":"Фруктоза","el":"O C C O O C C O C O C O H H H H H H H H H H H H","xyz":"tP4hAOf/Kf9uAPD/mv8ZACcAfP/r/6oADABvAC8AgAAfACQA4QBoAMb/YQFPAPz/WwCY/+n/cwAw/0cAw/+j/8//sP+7/0X/Zv5bAOD/Q/+YAI//F//CADUAm/+Q/7QArwASAIUAywDTAMj/2QBCAGH/kgGjAAYAjgCE/4z/zwAy/2MAkv9I/+//Uv+y/y7/","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAUACAAIAAkACAAKAAIACgAKAAsAAAAMAAEADQABAA4AAwAPAAUAEAAGABEABgASAAcAEwAIABQACQAVAAoAFgALABcA","o":"111111111111111111111111"},"gap":{"name":"Глицеральдегид-3-фосфат","el":"O C C O C O P O O O H H H H H H H","xyz":"Lv9W/wgAVv+6/87/XP9AABYAbf+pALn/x/88AIIARQBjAFYAlAD2//r/LAEOAAoAdwBa/yYAcQALAFn/dv+y/2b/+v5PAEgAFv/IAJr/p/+CANIAyP/Z/7EAxQA+/1kAhgC2/y//","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAQAKAAIACwADAAwABAANAAQADgAIAA8ACQAQAA==","o":"2111112111111111"},"met":{"name":"Метионин","el":"N C C C S C C O O H H H H H H H H H H H","xyz":"8f9R/+H/OwDE/6//2/8tAHn/rv+RAOL/T/89AGMA0/7V/xIAmgD4/xoAgwDi/5AADgFBAPX/rP80/53/MQAF//T/eACg/1r/CwBiACf/gv/6/1D/AgDGAA4Abf/bALL/9P5u/xQAxf72/6v/dP7e/0gA/gCVAMb/","b":"AAABAAEAAgACAAMAAwAEAAQABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAMADgADAA8ABQAQAAUAEQAFABIACAATAA==","o":"1111112111111111111"},"dhap":{"name":"Дигидроксиацетонфосфат","el":"O C C O C O P O O O H H H H H H H","xyz":"9QCRABIAyAAxALP/hAC9//z/pwCe/20AFABv/7f/rv/E/4r/Z/8WAAUA0/4wAOD/a//C/5MAsf+pABkArgChAFMAHgELAHv/ggBfAG//QAA7/2D/7v8h//r/tP/o/8YA3f+kAG8A","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAAAKAAEACwABAAwABAANAAQADgAIAA8ACQAQAA==","o":"1121112111111111"},"gly":{"name":"Глицин","el":"N C C O O H H H H H","xyz":"vQDw/wsAUABOAPL/yv8FAP7/Y/9FAAkAxv93//v/DQEiAC8A1gDC/7X/WwB4AI7/VACfADwA8/9K/0QA","b":"AAABAAEAAgACAAMAAgAEAAAABQAAAAYAAQAHAAEACAAEAAkA","o":"112111111"},"lactose":{"name":"Лактоза","el":"O C C O C O C C O C O C O O C C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H","xyz":"g/7GAFUAqf7bAM7/+v5mAJb/e/9pAND/pv/w/wwAGQAFAFsAiAACAAMA2gB/ACUAnQDwAOn/awF0APX/uQHYADQApgHq/xYAKQLi/+D/VgGC/9//0wB//xgAhgAI/97/cwAU/1L/O/+6/2sAbP9M/7UAwP6O/xkATf6P/2wAsf7h/5r/KP7y/3j/Sf4OAXMA6P41Acr/Uf7uAJH/Cf99ACr/uf+l/8D/aQAMAJv/2gCNAJIAZAAcASkAbQGDAIn/wQElAfj/qwHf/4IAaQL9/yQA3wBv/4QAJAAC/w8AvQCt/vT/PwDJ/jL/HP8JALAAWP9Y/xMB0v4l//v/Fv5C/1cA3P6j/0j/Hf7l/xn/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAkACwALAAwACwANAA0ADgAGAA4ADgAPAA8AEAAEABEAEQASABEAEwATABQAEwAVAAIAFQAVABYAAAAXAAEAGAABABkAAgAaAAQAGwAGABwABwAdAAgAHgAJAB8ACgAgAAsAIQAMACIADgAjAA8AJAAPACUAEAAmABEAJwASACgAEwApABQAKgAVACsAFgAsAA==","o":"1111111111111111111111111111111111111111111111"},"maltose":{"name":"Мальтоза","el":"O C C O C O C C O C O C O O C C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H","xyz":"dv68AHYAj/7XAO7/8P5yAK//c/+EAN3/nf9KAFYAKAA+AGEAYgD0//b/qQBZAJz/vwAhABv/LgGLANX/GgEKARIAaAEqAD0A9gE3AD4ARgGj/yAAvACL/zcAlwD//gcApgDy/nr/Uf/M/34An/9x/8oAEv+E/wYAw/4Y/zYAuP7k/7j/qP6w/zP/cP4PAacAuv47AeT/Mf7UALf/8v6KAEL/gP+VAKUAFgDA/7z/ZwCxAJD/fQBEAN3+dQGWAIT/LQFQAdL/QQFEAKAAEAJ3AIMArACO/6QALwDq/iEA1wC2/jgAXAC+/lb//v7r/8AAhP90/ycBX/9d/8X//f7O/k8AVf7m/+f/y/5W/zD/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAkACwALAAwACwANAA0ADgAGAA4ADgAPAA8AEAAEABEAEQASABEAEwATABQAEwAVAAIAFQAVABYAAAAXAAEAGAABABkAAgAaAAQAGwAGABwABwAdAAgAHgAJAB8ACgAgAAsAIQAMACIADgAjAA8AJAAPACUAEAAmABEAJwASACgAEwApABQAKgAVACsAFgAsAA==","o":"1111111111111111111111111111111111111111111111"},"gal1p":{"name":"Галактозо-1-фосфат","el":"O C C O C O P O O O C O C O C O H H H H H H H H H H H H H","xyz":"8v4LATsAF//XALz/cv9dAMX/2P9qACYAMAD8/y0AhwACALz/GgErAPf/ewE9AID/FAG7AEkAWAG1/1oA8f9y/zAAUQAM/xgAgP9k/8n/N//t/uL/IP/d/9b/3v7S/1IAOf9DAV0ASv8mAYT/vP68AIX/o/9VAGL/agAHAIoAwwDnACkAtwGy/0UAxv9h/5QALAC2/jAAqf9j/2X/Bv/T/pP/1/7X/4X/+/4WAJAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAGAAkABAAKAAoACwAKAAwADAANAAwADgACAA4ADgAPAAAAEAABABEAAQASAAIAEwAEABQACAAVAAkAFgAKABcACwAYAAwAGQANABoADgAbAA8AHAA=","o":"11111121111111111111111111111"},"f1p":{"name":"Фруктозо-1-фосфат","el":"O C C O P O O O O C C O C O C O H H H H H H H H H H H H H","xyz":"bgC3AJn/IQBbAOf/nf+iAAUANP9kAMT/7f7y/yIAbf4uAGEAv/5y/8L/Tf+6/5wAYwBJAGQAsgDU/2EARQHx/3oAfAFKABsAnQCO/9r/gQAF/+3/HwDU/6L/JwDc/xX/NwDZAFD/pf8KAd//j/+sAHAA0v4j//j/av9i/38AjgCQ/7AAfgGT/3gAUQEdAN4AzAEjAPT/8ACd/5f/TQDj/qP/yv+W/77/ggDs//j+","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABAAHAAEACAAIAAkACQAKAAoACwAJAAwADAANAAwADgABAA4ADgAPAAAAEAACABEAAgASAAYAEwAHABQACQAVAAoAFgAKABcACwAYAAwAGQANABoADgAbAA8AHAA=","o":"11112111111111111111111111111"},"galactose":{"name":"Галактоза","el":"O C C O C O C O C O C O H H H H H H H H H H H H","xyz":"Bf9TAGwAG/9uAOL/pv9FALP/CQCLAP//iwBbAOL/6wC1ABgAoQDQ/yAACgGO/9v/IgB7/xcA5P91/5cAwP+w/67/Sv9g/6//u/6JAIwAzf5AAKb/Ef/bANT/sP9rAEv/mQBVAHb/xAANASAAvQDc/4kA9wCO/3z/PwAV//r/xv8a/6gA8P+c/0z/M/9H/1X/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAAIAAkACAAKAAIACgAKAAsAAAAMAAEADQABAA4AAgAPAAQAEAAFABEABgASAAcAEwAIABQACQAVAAoAFgALABcA","o":"111111111111111111111111"},"udpgal":{"name":"УДФ-галактоза","el":"O C C C N C O C C O P O O O P O O O C O C C O C O C O C O C O C O C O N H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"JP4//ogAM/6r/lIAj/4O/4wAn/6E/08AWf6l/9n/c/4qAKL//v45AIn/M/+nAM//t/92AAsA7f/ZAFsAOgBQAQsAOwBAAXP/6P/gASoA1QBlAUAAIwHXAFgABAGlAOYAxwH5AFMA/gBnAOn/WAH6//v/CAGG//z/UwEO/wMAhwEC/5IAZAF//rwAwQEB/5z/FAKR/rL/FAKA/4X/ewKN/+X/vAH+/4j/dwEIAAz/zv7OADwAyf5ZAU0ASv6TAAsA9/3zAM7/Af5J/6H/wv1f/zv/7v3L/t3/xv73/ucA4/7O/3oAPP4+AEf/Q//7AIz/n/8eAEoA+v9TAL3/GAAGAnUA4wH4ALAAjQH//1kADAG7/vL/8gER/5gAVAFL/9EABAF3/sEAjgHu/jr/QwKT/gYAQgJ6/yL/YwLQ/ycA/gFVAJP/fgGz/93+6/6eAJoA0v6GAff/Fv5hAF0Aov35AP7/rv2J/rP/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwAKAAwACgANAA0ADgAOAA8ADgAQAA4AEQARABIAEgATABMAFAAUABUAFQAWABQAFwAXABgAFwAZABkAGgAZABsAEgAbABsAHAAHAB0AHQAeAB0AHwAFAB8AHwAgAAQAIQAhACIAIQAjAAEAIwACACQAAwAlAAUAJgAHACcACAAoAAgAKQAMACoAEAArABIALAAUAC0AFQAuABUALwAWADAAFwAxABgAMgAZADMAGgA0ABsANQAcADYAHQA3AB4AOAAfADkAIAA6ACMAOwA=","o":"21211111112111211111111111111111111211111111111111111111111111"},"udpglc":{"name":"УДФ-глюкоза","el":"O C C C N C O C C O P O O O P O O O C O C C O C O C O C O C O C O C O N H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"uv2w/m4A+P0Q/0MARv5l/54Aif7O/24AiP7t/+T/1v5iALz/X/9LANv/j/+tADQA3P9lAKMAQQC6AM4AvADOAGEAQAHCALEAswBpAScAugBdAOv/CAGEAGP/rgDgAAz/lQHWAIH/LQEDAAP/RwGM/0j/qwGa/6r/kwF3/y4AGgJP/2wAJwKd/+EAMwEE/0YAFgH4/tAAsAAb//n/YQCk/gAAygA9/2f/UwB0/y7/GP/6AG4AN/+EAXYApv7dAAsAkP5HAbH/QP6e/4z/O/6z/xP/9/0u/7v/SP5P/wkBw/4NALIAzv55AFL/0P/yAP////8EAIAAl/9RAPcAZQCPAVIAmAEcAT7/ewFM//n+bQHP/2UAGALl/oUAagJk/yYAJwL7/8oAYAGn/iIAFQGa/ukAeABs/ykAFQC0/jkA1gDa/jT/WQBv/83+/P7VANAAdP+UAcAAS/7FAEEA4v5dAYP/w/32/nr/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwAKAAwACgANAA0ADgAOAA8ADgAQAA4AEQARABIAEgATABMAFAAUABUAFQAWABQAFwAXABgAFwAZABkAGgAZABsAEgAbABsAHAAHAB0AHQAeAB0AHwAFAB8AHwAgAAQAIQAhACIAIQAjAAEAIwACACQAAwAlAAUAJgAHACcACAAoAAgAKQAMACoAEAArABIALAAUAC0AFQAuABUALwAWADAAFwAxABgAMgAZADMAGgA0ABsANQAcADYAHQA3AB4AOAAfADkAIAA6ACMAOwA=","o":"21211111112111211111111111111111111211111111111111111111111111"},"glyald":{"name":"Глицеральдегид","el":"O C C O C O H H H H H H","xyz":"gwB8ADgAXgA/AL7/CADD/9T/UQBf/xoAiv/n/yMAPf88APn/WADTAD8AJwCHAIH/uAAiAIf/6f+b/3P/SQBu/3kAdP+1/4IA","b":"AAABAAEAAgACAAMAAgAEAAQABQAAAAYAAQAHAAEACAACAAkAAwAKAAQACwA=","o":"11112111111"}});


// @scene carbdig makeCarbdig | Переваривание сахаров, лактоза, фруктоза | Углеводы
/* =========================================================
   БИОХИМИЯ · ПЕРЕВАРИВАНИЕ УГЛЕВОДОВ: амилаза, ферменты щёточной каймы, транспортёры SGLT1/GLUT5/GLUT2,
   лактазная недостаточность; обмен галактозы и фруктозы в печени, галактоземия, непереносимость фруктозы
   ========================================================= */
function makeCarbdig() {
  __set_rnd(mulberry(4201));
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { dig: [V3(1.2, 0.5, 0), V3(1.4, 0.9, 15.5)], met: [V3(39.8, 0.5, 0), V3(40.0, 0.9, 15.6)] };
  const VIEWM = { dig: [V3(1.2, 0.6, 0), V3(1.2, 0.8, 11.5)], met: [V3(41.2, 0.4, 0), V3(41.2, 0.6, 13.5)] };
  const mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VV('dig')[1]);
  const controls = makeControls(camera, VV('dig')[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const SC = { glc: '#F2C14E', fru: '#FF9A5C', gal: '#7FE0A0' };
  const ENZC = { amy: '#7FD6FF', malt: '#F2C14E', suc: '#FF9A5C', lac: '#7FE0A0' };

  /* ---------- 1. переваривание и всасывание ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const YT = 0.55, YB = -1.25, XL = -3.3, XR = 3.3;
  // клетки эпителия (энтероциты): округлые призмы с ядром, лёгким вздутием и щёточной каймой
  const cellGeo = (w, hh, d, r, seed) => {   // скруглённая призма: вершины коробки выталкиваются от внутреннего ядра на радиус r
    const g = new THREE.BoxGeometry(w, hh, d, 14, 14, 8), iw = w / 2 - r, ih = hh / 2 - r, id = d / 2 - r, c = V3(0, 0, 0);
    return displaceGeo(g, (v) => { c.set(clamp(v.x, -iw, iw), clamp(v.y, -ih, ih), clamp(v.z, -id, id)); const dir = v.clone().sub(c); if (dir.lengthSq() > 1e-8) dir.normalize().multiplyScalar(r); v.copy(c).add(dir); v.x *= 1 + 0.035 * Math.sin((v.y / hh + 0.5) * Math.PI); v.z += 0.03 * noise3(v.x * 2, v.y * 2, seed); });
  };
  for (let i = 0; i < 3; i++) {
    const g = cellGeo(2.04, YT - YB, 1.5, 0.3, i); g.translate(XL + 1.1 + i * 2.2, (YT + YB) / 2, 0);
    const cm = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8A0A0').multiplyScalar(0.3), roughness: 0.45, clearcoat: 0.3, transparent: true, opacity: 0.6, depthWrite: false, emissive: new THREE.Color('#E8A0A0'), emissiveIntensity: 0.05 })); cm.renderOrder = 1; G1.add(cm);
    const nuc = new THREE.Mesh(blobGeo(0.34, 0.44, 0.32, 70 + i, 0.1, 4), protMat('#9F7BFF', 0.34)); nuc.position.set(XL + 1.1 + i * 2.2, YB + 0.62, 0); G1.add(nuc);
    const nl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), protMat('#E0C8FF', 0.5)); nl.position.set(XL + 1.1 + i * 2.2 + 0.1, YB + 0.66, 0.2); G1.add(nl);   // ядрышко
    for (let k = 0; k < 3; k++) { const mt = new THREE.Mesh(ell3(0.2, 0.09, 0.09, null, 14), organMat('#F2A25C', 0.5)); mt.position.set(XL + 1.1 + i * 2.2 + (k - 1) * 0.5, YB + 1.12 + 0.12 * (k % 2), 0.28); mt.rotation.z = 0.4 * (k - 1); G1.add(mt); }   // митохондрии
  }
  const MV = []; for (let x = XL + 0.08; x < XR; x += 0.14) for (let z = -0.6; z <= 0.6; z += 0.3) MV.push(V3(x + rand(-0.02, 0.02), YT + 0.17, z + rand(-0.04, 0.04)));
  const mvI = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.04, 0.3, 3, 6), organMat('#F2B0B0', 0.5), MV.length); const dm = new THREE.Object3D();
  MV.forEach((p, i) => { dm.position.copy(p); dm.rotation.set(rand(-0.08, 0.08), 0, rand(-0.08, 0.08)); dm.updateMatrix(); mvI.setMatrixAt(i, dm.matrix); }); G1.add(mvI);
  // капилляр с эритроцитами (двояковогнутые диски плывут по току крови)
  const CAP = new THREE.CatmullRomCurve3([V3(XL - 0.9, YB - 0.62, 0.2), V3(-1, YB - 0.52, 0.25), V3(1, YB - 0.64, 0.2), V3(XR + 0.9, YB - 0.56, 0.2)]);
  G1.add(new THREE.Mesh(taperTube(CAP, () => 0.24, 60, 14), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C0404A').multiplyScalar(0.4), roughness: 0.4, clearcoat: 0.4, transparent: true, opacity: 0.5, depthWrite: false, emissive: new THREE.Color('#C0404A'), emissiveIntensity: 0.05 })));
  const rbcG = new THREE.LatheGeometry([[0.0, 0.05], [0.07, 0.07], [0.14, 0.1], [0.2, 0.08], [0.22, 0.0], [0.2, -0.08], [0.14, -0.1], [0.07, -0.07], [0.0, -0.05]].map(([x, y]) => new THREE.Vector2(x, y)), 14);
  const RBC = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(rbcG, organMat('#D6453F', 0.8)); m.userData.u0 = i / 9; G1.add(m); RBC.push(m); }
  // ферменты щёточной каймы и амилаза
  const BB = [];
  [['malt', -2.6], ['suc', -1.3], ['lac', 0.0], ['malt', 1.2], ['suc', 2.4], ['lac', 2.95]].forEach(([k, x], i) => { const m = new THREE.Mesh(blobGeo(0.2, 0.15, 0.18, 40 + i, 0.15, 3), protMat(ENZC[k], 0.55)); m.geometry.computeVertexNormals(); m.position.set(x, YT + 0.42, 0.45); G1.add(m); BB.push({ k, m, x }); });
  const AMY = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(blobGeo(0.26, 0.22, 0.22, 50 + i, 0.15, 3), protMat(ENZC.amy, 0.5)); m.geometry.computeVertexNormals(); G1.add(m); AMY.push({ m, ph: i * 2.1 }); }
  // транспортёры
  const TR = [];
  // белки-переносчики пронизывают мембрану на переднем срезе клетки (z = 0.76)
  const TRZ = 0.76;
  [[-2.2, 'sglt'], [-1.75, 'glut5'], [0.0, 'sglt'], [0.45, 'glut5'], [2.2, 'sglt'], [2.65, 'glut5']].forEach(([x, k]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 12), protMat(k === 'sglt' ? '#7FD6FF' : '#FF9A5C', 0.6)); m.position.set(x, YT, TRZ); G1.add(m); TR.push({ x, k, m, y: YT }); });
  [-2.0, 0.2, 2.4].forEach((x) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 12), protMat('#C77DFF', 0.6)); m.position.set(x, YB, TRZ); G1.add(m); TR.push({ x, k: 'glut2', m, y: YB }); });
  // сахара: шестиугольники (глюкоза, галактоза) и пятиугольник (фруктоза)
  const hexG = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 6), penG = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 5);
  const POOL = []; const MAXS = 260;
  const GM = Object.fromEntries(Object.entries(SC).map(([k, c]) => [k, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.55), emissive: new THREE.Color(c), emissiveIntensity: 0.25, roughness: 0.35, clearcoat: 0.6 })]));
  const glyph = (k) => { const m = new THREE.Mesh(k === 'fru' ? penG : hexG, GM[k]); m.rotation.x = Math.PI / 2; G1.add(m); return m; };
  // объект пищи: цепочка остатков
  const ITEMS = [];
  function spawn(kind) {
    const units = kind === 'starch' ? Array(6 + Math.floor(rnd() * 4)).fill('glc') : kind === 'sucrose' ? ['glc', 'fru'] : kind === 'lactose' ? ['gal', 'glc'] : kind === 'maltose' ? ['glc', 'glc'] : [kind];
    const p = V3(rand(XL + 0.3, XR - 0.6), 3.0 + rnd() * 0.4, rand(-0.3, 0.6));
    const it = { kind, units, meshes: units.map((u) => glyph(u)), p, v: V3(rand(-0.05, 0.12), -0.35 - rnd() * 0.15, 0), ang: rnd() * 6, spin: rand(-0.5, 0.5), stage: 'lumen', age: 0 };
    ITEMS.push(it); return it;
  }
  function splitItem(it, parts) { // parts: массивы индексов
    const out = parts.map((idx) => { const u = idx.map((i) => it.units[i]); const ms = idx.map((i) => it.meshes[i]); const kind = u.length === 1 ? u[0] : u.length === 2 ? (u.includes('fru') ? 'sucrose' : u.includes('gal') ? 'lactose' : 'maltose') : 'starch'; return { kind, units: u, meshes: ms, p: it.p.clone().add(V3(rand(-0.15, 0.15), rand(-0.1, 0.1), 0)), v: V3(rand(-0.15, 0.15), -0.25, 0), ang: it.ang, spin: rand(-1, 1), stage: 'lumen', age: 0 }; });
    ITEMS.splice(ITEMS.indexOf(it), 1, ...out); return out;
  }
  function killItem(it) { it.meshes.forEach((m) => { G1.remove(m); }); ITEMS.splice(ITEMS.indexOf(it), 1); }
  // просвет тонкой кишки замыкает верхняя стенка и воронка, переходящая в толстую кишку (изгиб с гаустрами)
  const LUM_Y = 2.05, LUM_R = 1.5;
  G1.add(new THREE.Mesh(tube([V3(XL - 0.1, LUM_Y + LUM_R, 0), V3(0, LUM_Y + LUM_R + 0.02, 0), V3(XR, LUM_Y + LUM_R, 0)], 0.07, 40, 8), organMat('#C8A090', 0.55)));
  const colCurve = new THREE.CatmullRomCurve3([V3(XR - 0.05, LUM_Y, 0), V3(XR + 0.9, LUM_Y + 0.05, 0), V3(XR + 1.8, LUM_Y - 0.45, 0), V3(XR + 2.2, LUM_Y - 1.4, 0), V3(XR + 2.2, LUM_Y - 2.4, 0)]);
  const colG = taperTube(colCurve, (u) => (LUM_R - 0.78 * smooth(0, 0.7, u)) * (1 + 0.03 * Math.sin(u * 34)), 90, 18); colG.computeBoundingBox(); const colC = colG.boundingBox.getCenter(V3(0, 0, 0)); colG.translate(-colC.x, -colC.y, -colC.z);
  const colon = new THREE.Mesh(colG, organMat('#C8A090', 0.5, { transparent: true, opacity: 0.55, depthWrite: false })); colon.position.copy(colC); G1.add(colon);

  /* ---------- 2. галактоза и фруктоза в печени ---------- */
  const OX = 41.3; const G2 = new THREE.Group(); G2.position.set(OX, 0, 0); scene.add(G2);
  const NODES = {
    gal: { m: 'galactose', p: V3(-3.8, 1.9, 0) }, gal1p: { m: 'gal1p', p: V3(-1.8, 1.9, 0) }, g1p: { m: 'g1p', p: V3(0.4, 1.9, 0) }, g6p: { m: 'g6p', p: V3(2.4, 1.2, 0) },
    udpglc: { m: 'udpglc', p: V3(-1.1, 3.35, 0) }, udpgal: { m: 'udpgal', p: V3(0.9, 3.35, 0) },
    fru: { m: 'fructose', p: V3(-3.8, -0.4, 0) }, f1p: { m: 'f1p', p: V3(-1.8, -0.4, 0) }, dhap: { m: 'dhap', p: V3(0.4, 0.15, 0) }, gald: { m: 'glyald', p: V3(0.4, -0.95, 0) }, gly: { m: 'gap', p: V3(2.7, -0.4, 0), name: 'ГАФ → гликолиз' },
  };
  Object.values(NODES).forEach((n) => { const mo = MOL(n.m); n.g = molMesh(mo, { scale: n.m.startsWith('udp') ? 0.115 : 0.14, hideH: true }); if (n.m.startsWith('udp')) molGlow(n.g, 0.15); n.g.position.copy(n.p); G2.add(n.g); n.glow = glowNucleus(G2, n.p, '#FF6A5A', 0.1, 9); n.glow.core.visible = false; n.glow.spr.material.opacity = 0; });
  const STEP = [
    ['gal', 'gal1p', 'галактокиназа', '#7FE0A0', 'gk'], ['gal1p', 'g1p', 'ГАЛТ', '#7FE0A0', 'galt'], ['udpglc', 'udpgal', '', '#9FB4FF', 'galt2'], ['udpgal', 'udpglc', 'эпимераза', '#9FB4FF', 'epi'], ['g1p', 'g6p', 'фосфоглюкомутаза', '#F2C14E', 'pgm'],
    ['fru', 'f1p', 'фруктокиназа', '#FF9A5C', 'fk'], ['f1p', 'dhap', 'альдолаза B', '#FF9A5C', 'aldB'], ['f1p', 'gald', '', '#FF9A5C', 'aldB2'], ['dhap', 'gly', '', '#F2C14E', 'g1'], ['gald', 'gly', 'триокиназа', '#F2C14E', 'tri'], ['g6p', 'gly', '', '#F2C14E', 'g3'],
  ];
  const BEND = { galt2: 0.35, epi: 0.35, tri: -0.15 };
  const AR = STEP.map(([a, b, name, col, id]) => ({ id, name, a, b, f: flowArrow(G2, NODES[a].p.clone().add(NODES[b].p.clone().sub(NODES[a].p).normalize().multiplyScalar(0.62)), NODES[b].p.clone().add(NODES[a].p.clone().sub(NODES[b].p).normalize().multiplyScalar(0.62)), col, { bend: BEND[id] ?? 0.12, r: 0.022 }) }));
  const glyc = new THREE.Mesh(blobGeo(0.45, 0.45, 0.45, 61, 0.2, 3), protMat('#F2C14E', 0.35)); glyc.geometry.computeVertexNormals(); glyc.position.set(2.6, 2.75, 0); G2.add(glyc);
  const fG = flowArrow(G2, NODES.g1p.p.clone().add(V3(0.45, 0.35, 0)), V3(2.2, 2.65, 0), '#F2C14E', { bend: -0.2, r: 0.02 });
  // хрусталик глаза (галактитол → катаракта) и «батарейка» АТФ (непереносимость фруктозы)
  const LENS = V3(3.6, -1.75, 0.2), ATPP = V3(2.3, -1.75, 0.2);
  const lens = new THREE.Mesh(ell3(0.45, 0.45, 0.18, LENS, 40), glassMat(0xa8d0ff, { rim: 1.0, base: 0.12, pow: 1.6, keep: true })); G2.add(lens);
  { const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: 0xa8d0ff, transparent: true, opacity: 0.6 })); rimL.position.copy(LENS); G2.add(rimL); } // ободок хрусталика
  const lensFog = new THREE.Mesh(ell3(0.4, 0.4, 0.14, LENS, 32), new THREE.MeshBasicMaterial({ color: 0x8a867c, transparent: true, opacity: 0, depthWrite: false })); G2.add(lensFog);
  const atpBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), new THREE.MeshBasicMaterial({ color: 0x4fa070, transparent: true, opacity: 0.55 })); atpBar.position.copy(ATPP); G2.add(atpBar);
  const atpFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.42, 1.12, 0.42)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })); atpFrame.position.copy(ATPP); G2.add(atpFrame);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'dig', labels: true, rot: false, fly: null, msg: null, food: 'mix', lacDef: false, absorbed: { glc: 0, fru: 0, gal: 0 }, toColon: 0, gas: 0, defect: 'none', acc: { gal1p: 0, f1p: 0 }, atp: 1, lensO: 0, sugar: 1, auto: true, nextT: 0, queue: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); G1.visible = m === 'dig'; G2.visible = m === 'met'; st.fly = flyTarget(VV(m)[0], VV(m)[1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function meal() { const kinds = st.food === 'bread' ? ['starch', 'starch', 'starch'] : st.food === 'sugar' ? ['sucrose', 'sucrose', 'sucrose', 'sucrose'] : st.food === 'milk' ? ['lactose', 'lactose', 'lactose', 'lactose'] : ['starch', 'sucrose', 'lactose', 'sucrose']; kinds.forEach((k, i) => st.queue.push([k, st.t + i * 0.3])); }
  const ENZ_OF = { maltose: 'malt', sucrose: 'suc', lactose: 'lac' };
  const tmpV = V3(0, 0, 0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'dig') {
      RBC.forEach((m, i) => { const u = (m.userData.u0 + t * 0.045) % 1, p = CAP.getPoint(u), q = CAP.getTangent(u); m.position.copy(p); m.rotation.set(0.2 * Math.sin(t + i), 0, Math.atan2(q.y, q.x) + Math.PI / 2 + 0.3 * Math.sin(t * 0.7 + i * 2)); });
      if (st.auto && t > st.nextT) { st.nextT = t + 2.6; meal(); }
      st.queue = st.queue.filter(([k, at]) => { if (t >= at) { if (ITEMS.length < 70) spawn(k); return false; } return true; });
      AMY.forEach((a, i) => { a.m.position.set(Math.sin(t * 0.3 + a.ph) * 2.6, 2.4 + 0.5 * Math.sin(t * 0.5 + a.ph * 1.7), 0.3); a.m.rotation.y += dt; });
      BB.forEach((b) => { if (b.k === 'lac') { b.m.visible = !st.lacDef; } });
      [...ITEMS].forEach((it) => {
        it.age += dt;
        if (it.stage === 'lumen') {
          it.p.addScaledVector(it.v, dt); it.ang += it.spin * dt;
          // крахмал: амилаза режет до мальтозы
          if (it.kind === 'starch' && it.p.y < 3.1) { const a = AMY.find((x) => x.m.position.distanceTo(it.p) < 1.0); if (a || it.p.y < 1.6) { const parts = []; for (let i = 0; i < it.units.length; i += 2) parts.push(i + 1 < it.units.length ? [i, i + 1] : [i]); splitItem(it, parts); a && (a.m.material.emissiveIntensity = 0.6); fx.spawn(it.p.clone(), V3(0, 0, 0), new THREE.Color(ENZC.amy), 0.5, 0, 1.6); return; } }
          if (it.units.length === 2 && it.p.y < YT + 0.55) {
            const ek = ENZ_OF[it.kind]; const ok = !(ek === 'lac' && st.lacDef);
            if (ok) { const b = BB.filter((x) => x.k === ek).sort((p, q) => Math.abs(p.x - it.p.x) - Math.abs(q.x - it.p.x))[0]; b.m.material.emissiveIntensity = 0.8; fx.spawn(it.p.clone(), V3(0, 0, 0), new THREE.Color(ENZC[ek]), 0.5, 0, 1.6); splitItem(it, [[0], [1]]).forEach((o) => { o.v.set(rand(-0.1, 0.1), -0.2, 0); }); return; }
            // лактоза без лактазы — течёт дальше по просвету в толстую кишку
            it.stage = 'colon'; it.v.set(0.9, 0.15, 0);
          }
          if (it.units.length === 1 && it.p.y < YT + 0.35) {
            const k = it.units[0], want = k === 'fru' ? 'glut5' : 'sglt';
            const tr = TR.filter((x) => x.k === want).sort((p, q) => Math.abs(p.x - it.p.x) - Math.abs(q.x - it.p.x))[0];
            it.stage = 'in'; it.tr = tr; it.out = TR.filter((x) => x.k === 'glut2').sort((p, q) => Math.abs(p.x - tr.x) - Math.abs(q.x - tr.x))[0]; it.u = 0;
            if (want === 'sglt') fx.spawn(V3(tr.x + 0.1, YT + 0.3, 0.6), V3(0, -0.6, 0), new THREE.Color('#C8C8FF'), 0.6, 0, 1.2);   // Na⁺ вместе с сахаром
            tr.m.material.emissiveIntensity = 0.6;
          }
          if (it.p.y < YT + 0.3 && it.units.length > 2) it.p.y = YT + 0.3;
        } else if (it.stage === 'in') {
          it.u += dt * 0.55; const a = V3(it.tr.x, YT + 0.25, TRZ), b = V3(it.tr.x, YT - 0.1, TRZ), c = V3(it.out.x, YB + 0.1, TRZ), d = V3(it.out.x, YB - 0.45, 0.4);
          const u = it.u; it.p.copy(u < 0.25 ? a.clone().lerp(b, u / 0.25) : u < 0.85 ? b.clone().lerp(c, (u - 0.25) / 0.6) : c.clone().lerp(d, (u - 0.85) / 0.15));
          if (u > 0.8) it.out.m.material.emissiveIntensity = 0.6;
          if (u >= 1) { it.stage = 'blood'; it.u = CAP.getUtoTmapping ? 0 : 0; it.cu = clamp((it.p.x - XL + 0.6) / (XR - XL + 1.2), 0, 1); st.absorbed[it.units[0]]++; }
        } else if (it.stage === 'blood') {
          it.cu += dt * 0.35; it.p.copy(CAP.getPoint(Math.min(1, it.cu))); if (it.cu >= 1) { killItem(it); return; }
        } else if (it.stage === 'colon') {
          it.p.addScaledVector(it.v, dt); it.v.y += dt * 0.15;
          if (it.p.x > XR + 1.3) { st.toColon++; st.gas += 1; killItem(it); for (let k = 0; k < 6; k++) fx.spawn(V3(XR + 1.9 + rand(-0.3, 0.3), 0.9 + rand(-0.5, 0.5), 0.3), V3(rand(-0.1, 0.1), 0.5 + rnd() * 0.4, 0), new THREE.Color(0xd8f0ff), 1.4, 0.4, 0.9); return; }
        }
        // отрисовка цепочки
        const n = it.meshes.length; const dir = V3(Math.cos(it.ang), Math.sin(it.ang) * 0.35, 0);
        it.meshes.forEach((m, i) => { m.position.copy(it.p).addScaledVector(dir, (i - (n - 1) / 2) * 0.24); m.rotation.z = it.ang + i * 0.3; });
      });
      [...TR, ...BB].forEach((x) => { x.m.material.emissiveIntensity = Math.max(0.03, x.m.material.emissiveIntensity - dt * 1.5); });
      AMY.forEach((a) => { a.m.material.emissiveIntensity = Math.max(0.03, a.m.material.emissiveIntensity - dt); });
      st.gas = Math.max(0, st.gas - dt * 0.25); colon.material.opacity = 0.6 + 0.3 * clamp(st.gas / 8, 0, 1); colon.scale.setScalar(1 + 0.12 * clamp(st.gas / 8, 0, 1) + 0.02 * Math.sin(t * 6) * (st.gas > 2 ? 1 : 0));
    }
    if (st.mode === 'met') {
      const gk = st.defect !== 'gk', galt = st.defect !== 'galt', fk = st.defect !== 'fk', aldB = st.defect !== 'aldB';
      const on = { gk, galt: gk && galt, galt2: gk && galt, epi: gk && galt, pgm: true, fk, aldB: fk && aldB, aldB2: fk && aldB, g1: true, tri: fk && aldB, g3: true };
      AR.forEach((a) => { a.f.mat.uniforms.uTime.value = t; a.f.mat.uniforms.uOn.value = on[a.id] ? 0.9 : 0.04; });
      fG.mat.uniforms.uTime.value = t;
      // накопление промежуточных продуктов при блоке
      st.acc.gal1p += ((st.defect === 'galt' ? 1 : 0) - st.acc.gal1p) * dt * 0.4; st.acc.f1p += ((st.defect === 'aldB' ? 1 : 0) - st.acc.f1p) * dt * 0.4;
      st.acc.gal = ((st.defect === 'gk' || st.defect === 'galt') ? 1 : 0); st.acc.fru = st.defect === 'fk' ? 1 : 0;
      const glow = (n, k) => { n.glow.spr.material.opacity = k * (0.6 + 0.3 * Math.sin(t * 4)); n.glow.spr.scale.setScalar(0.6 + 0.8 * k); };
      glow(NODES.gal1p, st.acc.gal1p); glow(NODES.f1p, st.acc.f1p); glow(NODES.gal, st.acc.gal * 0.6); glow(NODES.fru, st.acc.fru * 0.5);
      st.lensO += (((st.defect === 'galt' || st.defect === 'gk') ? 0.45 : 0) - st.lensO) * dt * 0.25; lensFog.material.opacity = st.lensO;
      st.atp += ((st.defect === 'aldB' ? 0.35 : 1) - st.atp) * dt * 0.4; atpBar.scale.y = Math.max(0.02, st.atp); atpBar.position.y = ATPP.y - 0.5 + st.atp / 2; atpBar.material.color.set(st.atp < 0.6 ? 0xc04a40 : 0x4fa070);
      st.sugar += ((st.defect === 'aldB' || st.defect === 'galt' ? 0.55 : 1) - st.sugar) * dt * 0.3;
      Object.values(NODES).forEach((n, i) => { n.g.rotation.y += dt * (0.3 + 0.05 * i); });
      glyc.rotation.y += dt * 0.2;
      if (rnd() < 0.4) { const a = AR[Math.floor(rnd() * AR.length)]; if (on[a.id]) fx.spawn(a.f.curve.getPoint(rnd()).add(G2.position), V3(0, 0, 0), new THREE.Color(['g1', 'g3', 'pgm', 'tri'].includes(a.id) ? '#F2C14E' : ['gk', 'galt', 'galt2', 'epi'].includes(a.id) ? '#7FE0A0' : '#FF9A5C'), 0.5, 0, 1.2); }
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'dig') { scopeShow(false); return; } scopeShow(true);
    const A = plotAxes(ctx, w, h, { title: 'всосалось в кровь · дошло до толстой кишки', x0: 10 });
    const rows = [['глюкоза', st.absorbed.glc, SC.glc], ['фруктоза', st.absorbed.fru, SC.fru], ['галактоза', st.absorbed.gal, SC.gal], ['лактоза → кишка', st.toColon, '#D8F0FF']];
    const mx = Math.max(10, ...rows.map((r) => r[1]));
    rows.forEach(([n, v, c], i) => { const y = 24 + i * ((h - 34) / 4); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(120, y, (w - 170) * v / mx, 10); ctx.globalAlpha = 1; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(n, 12, y + 9); ctx.fillText(String(v), 126 + (w - 170) * v / mx, y + 9); });
  }
  const TXT = {
    dig: '<b>Переваривание углеводов.</b> Крахмал (цепочки глюкозы) начинает резать <b>амилаза</b> слюны, а главную работу делает <b>амилаза поджелудочной железы</b> (голубые капли) — получаются мальтоза и короткие обрывки. Дисахариды расщепляют ферменты <b>щёточной каймы</b> на микроворсинках: <b>мальтаза</b>, <b>сахараза-изомальтаза</b> (сахароза → глюкоза + фруктоза), <b>лактаза</b> (лактоза → галактоза + глюкоза). Глюкоза и галактоза входят в клетку вместе с Na⁺ через <b>SGLT1</b> (голубые переносчики), фруктоза — через <b>GLUT5</b> (оранжевые), а в кровь все выходят через <b>GLUT2</b> (фиолетовые). Клетчатка (целлюлоза) не переваривается: у человека нет ферментов, расщепляющих β-1,4-связи между остатками глюкозы (целлюлаз).',
    lac: '<b>Лактазная недостаточность.</b> У большинства взрослых людей в мире активность лактазы после отлучения от груди снижается (у народов Северной Европы чаще сохраняется — это мутация, закрепившаяся вместе с молочным животноводством). Нерасщеплённая лактоза идёт в толстую кишку: удерживает воду (осмотическая диарея), а бактерии сбраживают её до газов (H₂, CO₂, метан) и кислот — вздутие и боль. Помогают кисломолочные продукты, безлактозное молоко, таблетки лактазы.',
    met: '<b>Галактоза и фруктоза в печени</b> превращаются в метаболиты глюкозы. <b>Галактоза</b>: галактокиназа → галактозо-1-фосфат → <b>ГАЛТ</b> (галактозо-1-фосфат-уридилтрансфераза) переносит на него УДФ с УДФ-глюкозы: получаются УДФ-галактоза и глюкозо-1-фосфат; <b>эпимераза</b> превращает УДФ-галактозу обратно в УДФ-глюкозу — круг замыкается. <b>Фруктоза</b>: фруктокиназа → фруктозо-1-фосфат → <b>альдолаза B</b> → дигидроксиацетонфосфат и глицеральдегид (его фосфорилирует <b>триокиназа</b>) → гликолиз. Фруктоза обходит главный регуляторный шаг гликолиза (фосфофруктокиназу), поэтому её избыток быстро превращается в жир. Выберите дефект фермента.',
  };
  const DEF = {
    galt: '<b>Галактоземия</b> (дефект ГАЛТ, ~1 : 50 000). После первых кормлений молоком у младенца рвота, желтуха, увеличение печени, гипогликемия. Галактозо-1-фосфат копится и токсичен для печени, почек и мозга; галактоза превращается альдозоредуктазой в <b>галактитол</b>, который накапливается в хрусталике — <b>катаракта</b> (хрусталик мутнеет). Лечение — исключить молоко и лактозу пожизненно; входит в неонатальный скрининг.',
    gk: '<b>Дефект галактокиназы</b> — более мягкая форма: галактоза не фосфорилируется, копится в крови и превращается в галактитол — главное проявление катаракта; печень не страдает.',
    aldB: '<b>Наследственная непереносимость фруктозы</b> (дефект альдолазы B). Фруктозо-1-фосфат копится и «запирает» фосфат — падает АТФ (столбик), тормозятся гликогенолиз и глюконеогенез: после сладкого, фруктов, мёда — тяжёлая <b>гипогликемия</b>, рвота, поражение печени и почек. Дети сами начинают избегать сладкого. Лечение — исключить фруктозу, сахарозу и сорбит.',
    fk: '<b>Эссенциальная фруктозурия</b> (дефект фруктокиназы) — безобидное состояние: фруктоза не фосфорилируется в печени и выводится с мочой, обнаруживается случайно.',
  };
  const labels = [
    { text: 'просвет тонкой кишки', pos: V3(XL + 0.1, LUM_Y + LUM_R + 0.22, 0), color: '#C8B8A8', show: () => st.labels && st.mode === 'dig' && !mqm.matches },
    { text: 'щёточная кайма', pos: V3(XL + 0.05, YT + 1.25, 0.6), color: '#F2B0B0', show: () => st.labels && st.mode === 'dig' },
    { text: 'лактаза', pos: V3(0.25, YT + 0.62, 0.6), color: ENZC.lac, show: () => st.labels && st.mode === 'dig' && !st.lacDef },
    { text: 'сахараза', pos: V3(-1.05, YT + 0.62, 0.6), color: ENZC.suc, show: () => st.labels && st.mode === 'dig' },
    { text: 'мальтаза', pos: V3(-2.4, YT + 0.62, 0.6), color: ENZC.malt, show: () => st.labels && st.mode === 'dig' },
    { text: 'SGLT1 + Na⁺', pos: V3(-2.2, YT - 0.3, 0.6), color: '#7FD6FF', show: () => st.labels && st.mode === 'dig' },
    { text: 'GLUT5', pos: V3(0.6, YT - 0.3, 0.6), color: '#FF9A5C', show: () => st.labels && st.mode === 'dig' },
    { text: 'GLUT2', pos: V3(2.55, YB + 0.25, 0.6), color: '#C77DFF', show: () => st.labels && st.mode === 'dig' },
    { text: 'энтероцит', pos: V3(-1.2, YB + 1.45, 0.8), color: '#E8A0A0', show: () => st.labels && st.mode === 'dig' && !mqm.matches },
    { text: 'капилляр → воротная вена', pos: V3(1.1, YB - 0.95, 0.3), color: '#E06A6A', show: () => st.labels && st.mode === 'dig' },
    { text: 'толстая кишка', pos: V3(XR + 0.45, LUM_Y + 0.35, 0.5), color: '#C8A090', show: () => st.labels && st.mode === 'dig' },
    ...Object.entries(NODES).map(([k, n]) => ({ text: n.name || MOL(n.m).name, pos: n.p.clone().add(k === 'gly' ? V3(OX + 0.35, -0.1, 0.2) : k === 'g6p' ? V3(OX + 0.38, -0.05, 0.2) : k === 'dhap' ? V3(OX - 0.3, 0.5, 0.2) : V3(OX - 0.3, -0.64, 0.2)), color: k === 'gly' || k === 'g6p' || k === 'g1p' ? '#F2C14E' : k.startsWith('udp') ? '#9FB4FF' : ['gal', 'gal1p'].includes(k) ? '#7FE0A0' : '#FF9A5C', show: () => st.labels && st.mode === 'met' })),
    ...AR.filter((a) => a.name).map((a) => ({ text: a.name, pos: NODES[a.a].p.clone().lerp(NODES[a.b].p, 0.5).add(V3(OX - 0.6, a.id === 'epi' ? -0.55 : a.id === 'tri' ? -0.45 : a.id === 'galt' ? -0.42 : 0.5, 0.3)), color: '#C8C8D0', show: () => st.labels && st.mode === 'met' })),
    { text: 'гликоген', pos: V3(OX + 3.1, 3.1, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'met' },
    { text: 'хрусталик (галактитол)', pos: V3(OX + 3.2, -2.35, 0.4), color: '#E8F0FF', show: () => st.labels && st.mode === 'met' },
    { text: 'АТФ печени', pos: V3(OX + 1.7, -2.75, 0.4), color: '#7FE0A0', show: () => st.labels && st.mode === 'met' },
  ].filter((l) => !l.dyn);
  const amyLab = { text: 'амилаза', pos: V3(0, 0, 0), color: ENZC.amy, show: () => st.labels && st.mode === 'dig' }; labels.push(amyLab);
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'met' && st.defect !== 'none' ? DEF[st.defect] : st.mode === 'dig' && st.lacDef ? TXT.lac : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'dig', label: 'Переваривание и всасывание' }, { id: 'met', label: 'Галактоза и фруктоза' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'dig') box.append(h('div', { class: 'glabel' }, 'Еда'), h('div', { class: 'gctl' }, seg([{ id: 'mix', label: 'Всё' }, { id: 'bread', label: 'Хлеб (крахмал)' }, { id: 'sugar', label: 'Сахар' }, { id: 'milk', label: 'Молоко' }], () => st.food, (v) => { st.food = v; meal(); }), button('Поесть', meal, true), toggle('Сам', () => st.auto, (v) => { st.auto = v; })),
        h('div', { class: 'gctl', style: 'margin-top:6px' }, toggle('Лактазная недостаточность', () => st.lacDef, (v) => { st.lacDef = v; if (v) { st.food = 'milk'; meal(); } refs.rebuild(); refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Дефект фермента'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Норма' }, { id: 'galt', label: 'Галактоземия', color: '#7FE0A0' }, { id: 'gk', label: 'Галактокиназа', color: '#7FE0A0' }, { id: 'aldB', label: 'Непереносимость фруктозы', color: '#FF9A5C' }, { id: 'fk', label: 'Фруктозурия', color: '#FF9A5C' }], () => st.defect, (v) => { st.defect = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–2', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  const _upd = update; function update2(dt) { _upd(dt); const a = AMY[0].m.position; amyLab.pos.set(a.x + 0.3, a.y + 0.3, 0.4); }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 2) { setMode(['dig', 'met'][n - 1]); return true; }
    if (k === 'e' || k === 'у') { meal(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'met') return [['АТФ печени', Math.round(st.atp * 100), '%'], ['Сахар крови', (5 * st.sugar).toFixed(1), 'ммоль/л'], ['Хрусталик', st.lensO > 0.3 ? 'мутнеет' : 'прозрачен', '']];
    return [['Всосалось молекул', st.absorbed.glc + st.absorbed.fru + st.absorbed.gal, ''], ['Лактоза в толстую кишку', st.toColon, '']];
  }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2C14E', deskShift: 2, mobZoom: 1,
    kicker: 'Биохимия · обмен углеводов', title: 'Переваривание сахаров',
    lede: 'Хлеб, сахар и молоко превращаются в три простых сахара — глюкозу, фруктозу и галактозу. Как они проходят через стенку кишки и что бывает, когда одного фермента не хватает.',
    notes: `
      <div><h2>Углеводы пищи</h2>
        <p>В сутки человек съедает 300–400 г углеводов: около 60% — крахмал (хлеб, крупы, картофель), около 30% — сахароза, до 10% — лактоза. Всасываются только <b>моносахариды</b>. Глюкоза и галактоза входят в клетку активно, вместе с Na⁺ (SGLT1), — поэтому растворы для лечения обезвоживания содержат и соль, и глюкозу. Фруктоза всасывается медленнее, облегчённой диффузией (GLUT5).</p>
        <h3>Ферменты</h3><ul><li><b>α-Амилаза</b> слюны и поджелудочной — α-1,4-связи крахмала.</li><li><b>Изомальтаза</b> — α-1,6-связи в точках ветвления.</li><li><b>Сахараза</b>, <b>мальтаза</b>, <b>лактаза</b> — на мембране щёточной каймы.</li></ul>
        <h3>После всасывания</h3><p>Все моносахариды по воротной вене попадают в печень. Галактоза и фруктоза почти полностью превращаются в печени в глюкозу, гликоген или жир.</p></div>
      <div><h2>Условности</h2><ul><li>Сахара показаны значками: шестиугольник — глюкоза и галактоза, пятиугольник — фруктоза.</li><li>Цепочка крахмала укорочена до нескольких остатков, время сжато.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>2</code> режим</li><li><code>E</code> поесть</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('dig'); st.fly = null;
  return self;
}
export { makeCarbdig };
