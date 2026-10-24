import { Sparks, THREE, V3, __set_rnd, button, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, randUnit, range, rnd, scopeShow, seg, smooth, taperTube, toggle } from '../core.js';
import { BIO_MOL, MOL, atomMat, bioStage, blobGeo, flowArrow, lipidMol, molFit, molMesh, plotAxes, protMat } from './kit.js';
Object.assign(BIO_MOL, {"folate":{"name":"Folic acid (B9)","el":"N C N C N C C C N C C C C C C C O N C C C C O O C O O N C C O N H H H H H H H H H H H H H H H H H H H","xyz":"wv1O/rz/+v3U/s//5/0P/0AAGf6P/1sABv7I/8wAOf5JAOIAfv6JAIMAtf4VAaAA/f5LAS4Agv8bAQgAv/+6AEwARgCMACQAgwDCALr/PwAtAW//xf9XAZT/DwGUAI3/QAHLACv/WAErANP/3AH6/67/QwIqABMALgLq/5wAhwJv/6gAVQIA/7YAFAN8/6QA2gFi/6D/PgIn/3n/ZQEX/7//k/5KAAcAZf7V//H/eP6P/3L/tf7C/xb/QP4O/2X/z/0e/mT/jv0i/gcAKf56AEMBYf5XAbgA+P4QAfYA0/6VAff/kP+MAKMAcwA9AF8AbgBcARj/lP+mAVv/LQH+/yQA+gEhAEv/pwIRAO7/PAKXAB0ASAIyAOoAxgHN/6kAQAOK//kAEwE2/5b/TP7c/g7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAJAA4ADAAPAA8AEAAPABEAEQASABIAEwATABQAFAAVABUAFgAVABcAEgAYABgAGQAYABoABgAbABsAHAADABwAHAAdAB0AHgAdAB8AAQAfAAAAIAAAACEABQAiAAcAIwAHACQACAAlAAoAJgALACcADQAoAA4AKQARACoAEgArABMALAATAC0AFAAuABQALwAXADAAGgAxAB8AMgA=","o":"12121211121212112111112112112112111111111111111111111"},"tag":{"name":"Triacylglycerol","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"nP5b/XX/qP7k/TT/rv5S/p3/IP5m/tT/FP4c/lgAYv5p/sIAA/69/hUBsP0g/8MADP6N/44AHv7z/wABxf1rAN0ACv65AG4Afv4GAa8AWP6ZAakAb/7LARoAA//rAQYAKv9dAhwAX/+IAdr/hP+HAVL/GQBpAVH/YgDwAUb/zgDmAZ7/xQAHAicAYgA8AlcAPAHoAYIAIwF0AeEA+gD5AJAAYgDqAKMATACcACQBYQAIAAMB4v++/yUBkP+Y/6wAX/8TAGAApP8NANj/Xf+k/4H/4P7j/0b/C/8/ANP+8f7z/1H+Wf+G/zz+OgASAen+vADYAOb+GAEZAbX+1wBOAB//IQH//7P+6ABz/6/+MQEf/xj/2AAW/5T/bACu/nj/pgAi/pH/sgAL/icAJwEG/mYArAEX/hwAGAJC/oAA/wHT/qgAPAIt/zwA0gI6/1MA9gKM/84AuwIYAMMANgIbAA8BzP5c/df/zP4Q/Tf/M/5B/YH/BP/n/fj+U/71/fL+8P40/u//0f6v/nH/2f09/oz/Dv7Q/t//O/63/VEAq/0X/nYAr/6l/pMAlP4g/gQBvv16/ksBPP71/mABZf1O/wQBff3t/nIAbf5m/3AA2/29/zkA/f3H/14Bhv4SAAcBZP1IALsAuv2qADUBMv54ACEAxP0BAUIAh/7mABcB2v7xAHoA7/2mAcQAl/7TAe0AM/4lAgkAUP5+AdP/Tv83AR7/bv/mASP/NQA8AbH/hgD9Ad/+HwBCAl//kwHRAUMAVAFCArwA0wCNAScBfgFdARkBEAEIAScALAGhALUAOAC2AE8ANQBNAa0A6f+xAEoBlwC7AG4BeAD9/5kAtADh/z4B//9g/1kBpP/0/20By/9a/2kAOP9d/8sAe/9uAJUA8/4OAFQADADx/+X/nf9uAKj/ov+D/zP/Qv9O/8D/q/4dAJH/nv6V/x//0P6aANb+dP9WANz+jf7G/1T+9f46AP39vf+w/0r+Sf82/4X+UP9d/9f9FQFVAHj/eAAeADf/jAH//8f+DwEtAFD+fQBy/8P++gBG/0z+kAFO/zP/RQG8/vD+qgB2/6j/EgH3/ur/FwC+/rr/SwC1/hD/XwDY/Wj/AwEW/lz/VgD+/WIAKQH1/dMAogFi/s7/yAG4/e//eQI3/lIAEQIC/tkALALn/gkBlAHm/q0ALAL+/tr/DAKO/zsA/wLX/lsA/gJr//v/YwOV/9QA0wJc/yoBAANgAO8AqgIxAFoA6wFMANIAQwJSAGwBFgK2/yUB","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"palmitic":{"name":"Palmitic acid","el":"C C C C C C C C C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"bgHtAJn/nAHeACkA9wFlADcApAHr/18AYgGx/+L/0QDh/+P/gQCG/0EAXwAC//7/EAAQ/33/mP9t/4j/Kv8k/9X/Lv9I/2gACf/Z/4UAev7y/1MAg/46AM3/r/7LAOb/af4WASgAKf/7AK//jwFOAXP/mQGfAFr/AQHpAJP/RgHTAGsA0wE4AUcAKwJRANn/QgJ5AIQA5QGg/4wAWAEJAKcAlQHU/4n/ZwFF/+b/zABHAAwAqADh/3//vgBy/5oAJwC6/2EAvQDM/ub/KQDB/kQA7f+s/l7/UgA0/y3/sv/L/7X/c/+B/yL/yP49/6v/Of+4/sr/kP80/5MA5v4I/50ATf8fAFUAC//q//EAR/6T/0cARf4wAJsAy/4LAIz/If47AJ3/UP/EAGn/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQAAABIAAAATAAAAFAABABUAAQAWAAIAFwACABgAAwAZAAMAGgAEABsABAAcAAUAHQAFAB4ABgAfAAYAIAAHACEABwAiAAgAIwAIACQACQAlAAkAJgAKACcACgAoAAsAKQALACoADAArAAwALAANAC0ADQAuAA4ALwAOADAAEQAxAA==","o":"1111111111111112111111111111111111111111111111111"},"pi":{"name":"Phosphate","el":"O P O O O H H H","xyz":"NQBt/8z/AAAAAAIAAAAAAJsAZQB4AMz/Zv8bAMz/XgBC/xgATwCDAG7/LP/0/w4A","b":"AAABAAEAAgABAAMAAQAEAAAABQADAAYABAAHAA==","o":"1211111"},"glycerol":{"name":"Glycerol","el":"O C C O C O H H H H H H H H","xyz":"Y/+l/zMAg//w/8D/AABGANH/AACPAEoAfQDw/8D/nQCl/zMAk/9R/zIALv8yAKf/kv+s/2v/AACQAH7/HQDqADkAbgCs/2v/0gAyAKf/uwDg/3oA","b":"AAABAAEAAgACAAMAAgAEAAQABQAAAAYAAQAHAAEACAACAAkAAwAKAAQACwAEAAwABQANAA==","o":"1111111111111"},"acetyl":{"name":"Acetyl-CoA","el":"C C O S C H H H H H H","xyz":"p/9y//P/vP8JAPz/X/9SABoAXwBQANn/3wDj/x0ARf9d/8f/9f9G/7X/q/9H/1cAQgENAAcA0wDb/4kA1wCA//D/","b":"AAABAAEAAgABAAMAAwAEAAAABQAAAAYAAAAHAAQACAAEAAkABAAKAA==","o":"1211111111"},"pa":{"name":"Phosphatidic acid","el":"C C C C C C C C C C C C C C C C O O C C C O P O O O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"GP/k/1MBrP/f/y4Bv/+B/7cArf/x/ukANADH/iUBewBt/sEAmwC0/j4AEQET/1YAkAG+/kQArQG6/q7/9QE7/4T/iAIp/6T/qQJ8/yAA6wL+//H/ggJiAMT/MgKaADkAUwKLAK0AugHjAB8AQQGhAEAA0wC+ANz/9gB/AFT/rwAFAFP/JwAZAPn+0v+Z/wP/UAAwAFr+zf+ZAC3/uwBHAcf/agCKAScAmwDfAW8A1/9mATMAj/+/Acz/Bf/bAQIAr/5eAeb/p/4QAWgAJP46AawAvf3NAI0AkP3VAPv/cP1nALX/df3c//L/Bv6n/+7/KP6G/13/8f34/kT/af6d/jH/t/6I/rL/gv4K/vb//v0l/j0A3P7L//sA/v5IAHUBBP+c/6MB5v+6/4MBz/9DABMBdv+X/2sAJACO/5AAYP/t/jUBlP+w/pUAIQCP/oEBbgAf/zwB2QBJ/u4APQAV/qwAugBo/vX/RQDp/hcADwE7/7oADwFi/wwAfAFZ/mcA4gHp/nsA6QFj/pX/TwG0/nf/6AFJ/xj/ygGQ/7j/nwLB/rj/xAJK/0//TwKV/1gA7gJF/2AAMAPp/57/JwMnAEMAtAK1AJH/PgIzAHz/IgHBAKMAVAE1AEMAdgCQAAAA0wDBAAT/YAFuAEv///8eACj+v//RAOD+xv/9AB0AtP9/AZcAx/8cAsL/jP+MAWz/B//uAW0A2f4wAs7/Tf5+AcT/3v4hAZn/+v4mAaoApP6lAFMAM/5AARgBAv6ZAYUAZv3bAM4A6v1sAKMAiv02Acr/UP1zAE3/Nf2Y/7n/U/3f/1kAC/5P/y0ASf70/xMAlP6G/0//+P3L/xn/tf36/uj+s/3a/pf/rP7I/uX+R/47/gv/If95/pn/rv7d/vP/c/67/av/zP7n/T4A7/3a/YsArP0g/vb/Af6I/msA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAFgAZABMAGgAaABsAGwAcABsAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQApACoAKgArACsALAAsAC0AAAAuAAAALwAAADAAAQAxAAEAMgACADMAAgA0AAMANQADADYABAA3AAQAOAAFADkABQA6AAYAOwAGADwABwA9AAcAPgAIAD8ACABAAAkAQQAJAEIACgBDAAoARAALAEUACwBGAAwARwAMAEgADQBJAA0ASgAOAEsADgBMABIATQASAE4AEwBPABQAUAAUAFEAGABSABkAUwAdAFQAHQBVAB4AVgAeAFcAHwBYAB8AWQAgAFoAIABbACEAXAAhAF0AIgBeACIAXwAjAGAAIwBhACQAYgAlAGMAJgBkACYAZQAnAGYAJwBnACgAaAAoAGkAKQBqACkAawAqAGwAKgBtACsAbgArAG8ALABwACwAcQAtAHIALQBzAC0AdAA=","o":"11111111111111121111112111121111111121111111111111111111111111111111111111111111111111111111111111111111111111111111"},"dag":{"name":"Diacylglycerol","el":"C C C C C C C C C C C C C C C C O O C C C O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"af+PALsBY//7/5cB7P/J/2sBIgAUAPIAz//p/3gAaf9UAFgAsv/QACMAk//fAI//7/+JADr/ZQDdAAn/ygDpAHr/swBvAb7/KwHHAZ//iQHHARcAswE9AUUABQL1ANr/VwIyAZj/8gFqAMX/LwISACEABgKC/w0AOgJQ/4b/pQL5/qX/ewFs/xAAUAHm/iYAZQGx/pIACAGa/rb/nwA7/u7/LwCL/jAA0P+8/sL/b/9M/qH/Bf9D/g8Aiv6Q/uD/nv4m//X/WP6B/7D/8P1Z/0j/mP3P/yP/L/3h/5D/Wv1AAP3/XP3OAMH/7f38AL3/Gv4hAUsA1P2iAXUAcf/LAGEBv/+iAPsBDv+rAPEBGf/o/0oBRf/D//EB5f9e/1MBMwDU/78BigD4/+EAGwB/AAABm/+L/5IAEwDU/yYAJP8uAAwAMP9wALAAjP8nAVkAHADFADYAn/9IAXL/K//EAHv/t/9lAOL+FAAzAHD/QwA9Aeb+lACoALX+LgHiAE7/vwCWAMD/qwBhASoAWACfAZv/BwEuApD/YAGpAUX/4gECAv//VgH6AWoA8QFGAaAAXAEAAV8AFQIyAIcAnAIbABcANAJF/1wA6wEa/1L/XgKj/0n/9QIT/3T/UgFg/n7/2gDi/nL/dQAB/pv/ywD3/TYAVgDf/mcA+P9J/nQAnf8V/+X/CgDV/mn/pP/t/Zv/P/9g/kH/K/9w/msA6/7b/SEAM/5v/hkAd/58/nb/5/5I/z8Aa/7r/8T/I/41/+7+sv0I/3D/Zf25/8T+0/0pABb/0vwHAGL/GP1//7v/vP0oACUAEf0/AE8AM/3KAFz/If0QAf//9v1UAX3/L/6uAJf//v3RAI8Ahv4vAUwAb/2MAZYA0f3nASAADP7QAccA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAEwAWABYAFwAXABgAFwAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQAAACoAAAArAAAALAABAC0AAQAuAAIALwACADAAAwAxAAMAMgAEADMABAA0AAUANQAFADYABgA3AAYAOAAHADkABwA6AAgAOwAIADwACQA9AAkAPgAKAD8ACgBAAAsAQQALAEIADABDAAwARAANAEUADQBGAA4ARwAOAEgAEgBJABIASgATAEsAFABMABQATQAVAE4AGQBPABkAUAAaAFEAGgBSABsAUwAbAFQAHABVABwAVgAdAFcAHQBYAB4AWQAeAFoAHwBbAB8AXAAgAF0AIQBeACIAXwAiAGAAIwBhACMAYgAkAGMAJABkACUAZQAlAGYAJgBnACYAaAAnAGkAJwBqACgAawAoAGwAKQBtACkAbgApAG8A","o":"111111111111111211111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111"},"choline":{"name":"Choline","el":"C N C C C C O H H H H H H H H H H H H H H","xyz":"f/+S/00Asv8EAAIATf8uAKL/zv9zAFsAIwDc/6//mwDA/wcA9QAuAP7/Gv97/ywAfv+q/7cAv/87/zwAN//c/17/8v5LANf/cv+DAGn/AQBOALUAcf+jAHgADgC8ACkACQCC/3f/OgArAGj/fQC0/28AzwBl/+b/MgEsAEkA","b":"AAABAAEAAgABAAMAAQAEAAQABQAFAAYAAAAHAAAACAAAAAkAAgAKAAIACwACAAwAAwANAAMADgADAA8ABAAQAAQAEQAFABIABQATAAYAFAA=","o":"11111111111111111111"},"g3p":{"name":"Glycerol-3-phosphate","el":"O C C O C O P O O O H H H H H H H H H","xyz":"lf4rAPH/FP8OALn/bf/k/zAAov9m/xIAzP9VAE8ALQBpAOz/sAAJAPb/LgFjAOf/sgCd/3f/vwC2/4QAl/6CABsADf+8/3P/Pf9mAIn/Kv/Y/4gAxP86/2IAj/+yAFQA9v9KALMAiABN/5r/BgF2/3UA","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAAAKAAEACwABAAwAAgANAAMADgAEAA8ABAAQAAgAEQAJABIA","o":"111111211111111111"}});


// @scene lipogen makeLipogen | Синтез жиров, фосфолипиды, ожирение | Липиды
/* =========================================================
   БИОХИМИЯ · СИНТЕЗ ТРИАЦИЛГЛИЦЕРОЛОВ И ФОСФОЛИПИДОВ: глицерол-3-фосфат → фосфатидная кислота → ДАГ → ТАГ;
   ДАГ + ЦДФ-холин → фосфатидилхолин, липотропные факторы и жировая печень; жировая ткань и ожирение
   ========================================================= */
function makeLipogen() {
  __set_rnd(mulberry(5301));
  const scene = bioStage({ rim: 0xe8c060 });
  const VIEW = { tag: [V3(0.8, -1.9, 0), V3(1.4, 0.0, 18.5)], pl: [V3(41.2, -1.8, 0), V3(41.8, 0.1, 18.5)], fat: [V3(80.8, -1.7, 0), V3(81.4, 0.6, 17.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.tag[1]);
  const controls = makeControls(camera, VIEW.tag[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.08); scene.add(fx.obj);
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const COL = { acyl: '#E8C060', g3p: '#FF9A30', pa: '#FF8A5C', dag: '#F2C14E', tag: '#E8D27A', pc: '#7FD6FF', pe: '#9FE870', pi: '#C77DFF', ch: '#FF8AB0' };

  /* ---------- 1. сборка ТАГ ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.6, 0, 0); scene.add(G1);
  const ST = [
    { id: 'g3p', x: -3.4, R: 0.55, name: 'glycerol 3-phosphate' }, { id: 'pa', x: -1.0, R: 0.95, name: 'phosphatidic acid' },
    { id: 'dag', x: 1.4, R: 0.95, name: 'diacylglycerol' }, { id: 'tag', x: 3.8, R: 1.05, name: 'triacylglycerol (fat)' },
  ];
  const Y1 = 1.0;
  ST.forEach((s, i) => { s.g = fit(s.id, s.R); s.g.position.set(s.x, Y1, 0); G1.add(s.g); s.glow = glowNucleus(G1, V3(s.x, Y1, -0.3), COL[s.id], 0.1, 14); s.glow.core.visible = false; s.glow.spr.material.opacity = 0.08; });
  const ARR1 = [0, 1, 2].map((i) => flowArrow(G1, V3(ST[i].x + ST[i].R * 0.75, Y1 - 0.15, 0), V3(ST[i + 1].x - ST[i + 1].R * 0.75, Y1 - 0.15, 0), '#E8C060', { bend: 0.12 }));
  const ENZ1 = ['acyltransferases (+2 acyl-CoA)', 'phosphatase (−Pi)', 'acyltransferase (+acyl-CoA)'];
  // ацил-КоА: «хвосты» пальмитата, прилетающие сверху
  const ACYL = []; for (let i = 0; i < 4; i++) { const m = fit('palmitic', 0.75); m.visible = false; G1.add(m); ACYL.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
  const piM = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), atomMat('P')); piM.visible = false; G1.add(piM);
  // источники глицерол-3-фосфата
  const SRC = [{ id: 'glucose', x: -4.4, y: -1.2, name: 'glucose → DHAP' }, { id: 'glycerol', x: -2.3, y: -1.2, name: 'glycerol (liver only)' }];
  SRC.forEach((s) => { s.g = fit(s.id, 0.5); s.g.position.set(s.x, s.y, 0); G1.add(s.g); s.a = flowArrow(G1, V3(s.x, s.y + 0.5, 0), V3(ST[0].x + (s.x < ST[0].x ? -0.25 : 0.25), Y1 - 0.55, 0), COL.g3p, { bend: s.x < ST[0].x ? -0.2 : 0.2 }); });
  // куда идёт жир: ЛПОНП (печень) или капля (жировая ткань)
  const vldl = new THREE.Group(); vldl.position.set(3.8, -1.15, 0); G1.add(vldl);
  vldl.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), protMat(COL.tag, 0.35)));
  { const shell = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), glassMat(0x7fd6ff, { rim: 0.6, base: 0.02, pow: 2 })); vldl.add(shell); const apo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 8, 48), protMat('#FF8AB0', 0.6)); apo.rotation.x = 1.1; vldl.add(apo); }
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 24), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.28), roughness: 0.3, clearcoat: 0.6, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.015, envMapIntensity: 0.4 })); drop.position.set(3.8, -1.15, 0); G1.add(drop);
  const aOut = flowArrow(G1, V3(3.8, Y1 - 1.0, 0), V3(3.8, -0.3, 0), COL.tag, { bend: 0 });

  /* ---------- 2. фосфолипиды и печень ---------- */
  const OX2 = 41.3; const G2 = new THREE.Group(); G2.position.set(OX2, 0, 0); scene.add(G2);
  const P2 = { pa: V3(-4.0, 1.9, 0), dag: V3(-1.9, 1.9, 0), pc: V3(0.4, 2.6, 0), pe: V3(0.4, 0.9, 0), cdpdag: V3(-4.0, -0.2, 0), pi: V3(-1.9, -0.2, 0) };
  const n2 = { pa: fit('pa', 0.8), dag: fit('dag', 0.8), pc: molMesh(lipidMol(2), { scale: 0.065, hideH: true }), pe: molMesh(lipidMol(5), { scale: 0.065, hideH: true, tint: COL.pe }), cdpdag: fit('pa', 0.7, { tint: '#C8A0FF' }), pi: fit('pa', 0.7, { tint: COL.pi }) };
  Object.entries(n2).forEach(([k, g]) => { g.position.copy(P2[k]); G2.add(g); });
  const cho = fit('choline', 0.35); cho.position.set(-1.2, 3.05, 0.2); G2.add(cho);
  const A2 = {
    pd: flowArrow(G2, P2.pa.clone().add(V3(0.75, 0, 0)), P2.dag.clone().add(V3(-0.75, 0, 0)), COL.dag, { bend: 0.15 }),
    pc: flowArrow(G2, P2.dag.clone().add(V3(0.6, 0.3, 0)), P2.pc.clone().add(V3(-0.75, -0.1, 0)), COL.pc, { bend: 0.15 }),
    pe: flowArrow(G2, P2.dag.clone().add(V3(0.6, -0.3, 0)), P2.pe.clone().add(V3(-0.75, 0.1, 0)), COL.pe, { bend: -0.15 }),
    meth: flowArrow(G2, P2.pe.clone().add(V3(0.55, 0.45, 0)), P2.pc.clone().add(V3(0.55, -0.5, 0)), '#FF8AB0', { bend: -0.35 }),
    cdp: flowArrow(G2, P2.pa.clone().add(V3(0, -0.6, 0)), P2.cdpdag.clone().add(V3(0, 0.6, 0)), '#C8A0FF', { bend: 0.15 }),
    pi: flowArrow(G2, P2.cdpdag.clone().add(V3(0.7, 0, 0)), P2.pi.clone().add(V3(-0.7, 0, 0)), COL.pi, { bend: 0.15 }),
    cho: flowArrow(G2, V3(-1.0, 2.8, 0.2), P2.pc.clone().add(V3(-0.6, 0.35, 0)), COL.ch, { bend: 0.25, r: 0.018 }),
  };
  // гепатоцит
  const HEP = V3(3.7, 0.9, 0);
  const hepG = blobGeo(1.7, 1.55, 1.0, 71, 0.05, 4); hepG.computeVertexNormals();
  const hep = new THREE.Mesh(hepG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#B0523A').multiplyScalar(0.3), roughness: 0.5, transparent: true, opacity: 0.45, depthWrite: false })); hep.position.copy(HEP); G2.add(hep);
  { const hg = new THREE.Mesh(hepG, glassMat(0xffb090, { rim: 0.35, base: 0.01, pow: 2 })); hg.position.copy(HEP); G2.add(hg); }
  const hnuc = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 18), protMat('#9F7BFF', 0.35)); hnuc.position.copy(HEP).add(V3(-0.6, 0.55, 0.1)); G2.add(hnuc);
  const DROPS = []; for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.5), roughness: 0.15, clearcoat: 1, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.06 })); const p = HEP.clone().add(V3(rand(-1.0, 1.1), rand(-1.0, 0.9), rand(-0.4, 0.4))); if (p.distanceTo(hnuc.position) < 0.6) p.x += 0.8; m.position.copy(p); G2.add(m); DROPS.push({ m, w: 0.6 + rnd() * 0.6 }); }
  const VL = []; for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.6), emissive: new THREE.Color(COL.pc), emissiveIntensity: 0.25, roughness: 0.3 })); m.visible = false; G2.add(m); VL.push({ m, age: 9 }); }

  /* ---------- 3. жировая ткань и ожирение ---------- */
  const G3 = new THREE.Group(); G3.position.set(80.7, 0, 0); scene.add(G3);
  const ADI = [];
  const adiMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.26), roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.3, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.012, envMapIntensity: 0.35 });
  const cytMat = glassMat(0xffd8a0, { rim: 0.22, base: 0.006, pow: 2.4 });
  function addAdipocyte(p, born = 0) { const g = new THREE.Group(); g.position.copy(p); const d = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), adiMat); const sh = new THREE.Mesh(new THREE.SphereGeometry(1.06, 32, 24), cytMat); const nu = new THREE.Mesh(ell3(0.18, 0.1, 0.14), protMat('#9F7BFF', 0.4)); g.add(d, sh, nu); G3.add(g); const a = { g, d, sh, nu, born, dir: randUnit() }; ADI.push(a); return a; }
  [[-1.6, 0.6], [0.2, 1.0], [1.9, 0.4], [-0.8, -0.9], [1.0, -0.9], [-2.6, -0.6], [2.8, -0.8]].forEach(([x, y]) => addAdipocyte(V3(x, y, rand(-0.3, 0.3))));
  const SPARE = [[-3.4, 1.0], [3.4, 1.2], [0.0, -2.1], [-1.9, -2.0], [2.2, -2.0], [-0.6, 2.3]];
  const CAP3 = new THREE.CatmullRomCurve3([V3(-3.2, 2.1, -1.0), V3(-1, 1.8, -1.3), V3(1.5, 2.0, -1.1), V3(4.4, 1.6, -0.8)]);
  G3.add(new THREE.Mesh(taperTube(CAP3, () => 0.16, 60, 12), organMat('#C0404A', 0.45, { transparent: true, opacity: 0.7 })));
  const MAC = []; for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(blobGeo(0.3, 0.26, 0.26, 80 + i, 0.25, 3), protMat('#C77DFF', 0.45)); m.geometry.computeVertexNormals(); m.visible = false; G3.add(m); MAC.push(m); }

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'tag', labels: true, rot: false, fly: null, msg: null, tissue: 'adipose', cyc: 0, made: 0, lipo: true, alc: false, liverFat: 0.15, vldlOut: 0,
    bal: 0, years: 0, fatKg: 15, run: true, hormone: 'none', hT: -99 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['tag', 'pl', 'fat'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const BASE = 70 - 15; // масса без жира, кг (рост 1,75 м)
  const bmi = () => (BASE + st.fatKg) / (1.75 * 1.75);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'tag') {
      const P = 7; st.cyc += dt; if (st.cyc > P) { st.cyc = 0; st.made++; }
      const c = st.cyc, step = c < 2.2 ? 0 : c < 3.8 ? 1 : c < 5.6 ? 2 : 3;
      ST.forEach((s, i) => { s.g.rotation.y += dt * 0.35; const on = i === step; s.glow.spr.material.opacity = on ? 0.28 : 0.06; s.glow.spr.scale.setScalar((on ? 1.8 : 1.2) * (1 + 0.05 * Math.sin(t * 4))); });
      ARR1.forEach((a, i) => { a.mat.uniforms.uTime.value = t; a.mat.uniforms.uOn.value = i === step - 1 || (i === step && c % 2 > 1.3) ? 1.1 : 0.25; });
      SRC.forEach((s) => { s.a.mat.uniforms.uTime.value = t; s.a.mat.uniforms.uOn.value = s.id === 'glycerol' && st.tissue === 'adipose' ? 0.03 : step === 0 ? 0.9 : 0.25; s.g.rotation.y += dt * 0.4; });
      SRC[1].g.visible = st.tissue === 'liver';
      // ацил-КоА прилетают на шагах 1 (два) и 3 (один)
      const fire = (k, at, x) => { const q = ACYL[k]; if (c >= at && c < at + dt * 1.5) { q.age = 0; q.m.visible = true; q.a.set(x - 0.6, Y1 + 2.4, 0.4); q.b.set(x - 0.2, Y1 + 0.2, 0.2); } };
      fire(0, 1.0, ST[1].x); fire(1, 1.4, ST[1].x); fire(2, 4.4, ST[3].x);
      ACYL.forEach((q) => { if (q.age < 1.2) { q.age += dt; q.m.position.copy(q.a).lerp(q.b, smooth(0, 1.1, q.age)); q.m.rotation.z = -0.6 + q.age; } else q.m.visible = false; });
      const pk = c - 3.0; piM.visible = pk > 0 && pk < 1.4; if (piM.visible) piM.position.set(ST[1].x + 1.2 + pk * 0.4, Y1 - 0.2 - pk * 1.0, 0.3);
      vldl.visible = st.tissue === 'liver'; drop.visible = st.tissue === 'adipose'; aOut.mat.uniforms.uTime.value = t; aOut.mat.uniforms.uOn.value = step === 3 ? 1 : 0.2;
      vldl.rotation.y += dt * 0.5; drop.scale.setScalar(1 + Math.min(0.35, st.made * 0.03));
    }
    if (st.mode === 'pl') {
      const pcRate = st.lipo ? 1 : 0.15, tagIn = st.alc ? 1.6 : 1;
      Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
      A2.pc.mat.uniforms.uOn.value = 0.2 + 0.8 * pcRate; A2.meth.mat.uniforms.uOn.value = st.lipo ? 0.8 : 0.1; A2.cho.mat.uniforms.uOn.value = st.lipo ? 0.9 : 0.05; cho.visible = st.lipo;
      ['pd', 'pe', 'cdp', 'pi'].forEach((k) => { A2[k].mat.uniforms.uOn.value = 0.7; });
      // без фосфатидилхолина ЛПОНП не собираются — жир остаётся в печени
      const out = 0.9 * pcRate; st.vldlOut = out;
      st.liverFat = clamp(st.liverFat + (0.05 * tagIn - 0.07 * out) * dt, 0.1, 1);
      DROPS.forEach((d, i) => { const r = 0.12 + 0.42 * st.liverFat * d.w; d.m.scale.setScalar(r); });
      VL.forEach((v) => { if (v.age > 2.4 && rnd() < out * dt * 1.5) { v.age = 0; v.m.visible = true; } if (v.age < 2.4) { v.age += dt; v.m.position.copy(HEP).add(V3(0.9 + v.age * 1.1, -0.4 + Math.sin(v.age * 3) * 0.1, 0.4)); v.m.material.opacity = 1; } else v.m.visible = false; });
      Object.values(n2).forEach((g, i) => { g.rotation.y += dt * (0.25 + 0.04 * i); });
    }
    if (st.mode === 'fat') {
      if (st.run) { st.years += dt * 0.5; st.fatKg = clamp(st.fatKg + st.bal * 365 / 7700 * dt * 0.5, 4, 75); }
      const k = t - st.hT; const H = k < 6 ? st.hormone : 'none';
      // объём жировой клетки растёт с массой жира; при большом объёме появляются новые клетки
      const need = st.fatKg > 32 ? Math.min(SPARE.length, Math.floor((st.fatKg - 32) / 6) + 1) : 0;
      while (ADI.length - 7 < need) { const p = SPARE[ADI.length - 7]; addAdipocyte(V3(p[0], p[1], 0), t); }
      const R = clamp(0.55 * Math.cbrt(st.fatKg / 15) / Math.cbrt(ADI.length / 7), 0.35, 1.25);
      ADI.forEach((a, i) => { const grow = smooth(0, 2, t - a.born); const r = R * (a.born ? grow : 1) * (1 + 0.03 * Math.sin(t + i)); a.d.scale.setScalar(Math.max(0.01, r)); a.sh.scale.setScalar(Math.max(0.01, r)); a.nu.position.copy(a.dir).multiplyScalar(r * 1.0); a.d.material.emissiveIntensity = H === 'ins' ? 0.05 : 0.012; });
      const b = bmi(); const inflam = clamp((b - 30) / 8, 0, 1);
      MAC.forEach((m, i) => { m.visible = i < Math.round(inflam * MAC.length); if (m.visible) { const a = ADI[i % ADI.length]; m.position.copy(a.g.position).add(V3(Math.cos(i * 2.1 + t * 0.2), Math.sin(i * 1.3), 0.6).multiplyScalar(R * 1.1)); } });
      if (H === 'ins' && rnd() < 0.6) { const u = rnd(); const a = ADI[Math.floor(rnd() * ADI.length)]; const p0 = CAP3.getPoint(u).add(G3.position); fx.spawn(p0, a.g.position.clone().add(G3.position).sub(p0).multiplyScalar(0.9), new THREE.Color(COL.acyl), 1.1, 0, 1.3); }
      if (H === 'adr' && rnd() < 0.6) { const a = ADI[Math.floor(rnd() * ADI.length)]; const p0 = a.g.position.clone().add(G3.position); fx.spawn(p0, CAP3.getPoint(rnd()).add(G3.position).sub(p0).multiplyScalar(0.9), new THREE.Color('#FFB070'), 1.1, 0, 1.3); }
      if (H === 'adr') st.fatKg = Math.max(4, st.fatKg - dt * 0.05); if (H === 'ins') st.fatKg = Math.min(75, st.fatKg + dt * 0.04);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode === 'pl') { scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'liver: fat and VLDL output', x0: 10 });
      [['liver fat', st.liverFat, '#E8D27A'], ['VLDL output', st.vldlOut, '#7FD6FF']].forEach(([n, v, c], i) => { const y = 30 + i * 30; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(110, y, (w - 140) * clamp(v, 0, 1), 12); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 12, y + 10); }); return; }
    if (st.mode !== 'fat') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'body mass index', xl: 'BMI 15 → 45', x0: 10 });
    const zones = [[15, 18.5, 'rgba(127,214,255,.15)'], [18.5, 25, 'rgba(127,224,160,.18)'], [25, 30, 'rgba(242,193,78,.18)'], [30, 45, 'rgba(255,106,90,.18)']];
    zones.forEach(([a, b, c]) => { ctx.fillStyle = c; ctx.fillRect(A.X((a - 15) / 30), A.Y(1), A.X((b - 15) / 30) - A.X((a - 15) / 30), A.Y(0) - A.Y(1)); });
    const x = A.X(clamp((bmi() - 15) / 30, 0, 1)); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, A.Y(0)); ctx.lineTo(x, A.Y(1)); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; [['underweight', 15.5], ['normal', 19.5], ['overweight', 25.5], ['obesity', 33]].forEach(([n, v]) => { ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fillText(n, A.X((v - 15) / 30), A.Y(0.85)); });
  }
  const TXT = {
    tag: '<b>Synthesis of triacylglycerols</b> (fats) takes place in the liver, adipose tissue and the intestinal wall. The backbone is <b>glycerol 3-phosphate</b>: in adipose tissue it is made only from glucose (via dihydroxyacetone phosphate), while in the liver it can also come from glycerol (glycerol kinase). Two fatty acid residues are attached to it in turn as <b>acyl-CoA</b> → <b>phosphatidic acid</b>; a phosphatase removes the phosphate → <b>diacylglycerol</b>; a third acyl-CoA → <b>triacylglycerol</b>. The liver packs the fat into <b>VLDL</b> and sends it into the blood; adipose tissue stores it in a droplet. Synthesis is switched on by <b>insulin</b>.',
    pl: '<b>Phospholipids</b> are built from the same precursors. <b>Diacylglycerol</b> + CDP-choline → <b>phosphatidylcholine</b> (lecithin); + CDP-ethanolamine → <b>phosphatidylethanolamine</b>; in the liver PE can be converted into PC by receiving three methyl groups from S-adenosylmethionine. Phosphatidic acid, via CDP-diacylglycerol, gives rise to <b>phosphatidylinositol</b> (the source of the signaling molecules IP₃ and DAG) and cardiolipin. The liver needs phosphatidylcholine to build the VLDL coat and export fat. That is why choline, methionine, vitamin B12 and folate are called <b>lipotropic factors</b>.',
    fat: '<b>Adipose tissue</b> is the main energy store: 1 kg of fat holds about 7700 kcal. After a meal, <b>insulin</b> switches on capillary lipoprotein lipase (fatty acids from VLDL and chylomicrons enter the cells) and fat synthesis; during fasting and exercise, <b>epinephrine</b> and glucagon trigger lipolysis. If you eat more than you burn for a long time, adipocytes grow (hypertrophy) and then new ones appear (hyperplasia). Overloaded cells become inflamed: macrophages (purple) move into the tissue, inflammatory cytokines are released, and <b>insulin resistance</b> develops. Move the calorie balance.',
  };
  const labels = [
    ...ST.map((s) => ({ text: s.name, pos: V3(s.x + 0.6, Y1 + s.R + 0.15, 0), color: COL[s.id], show: () => st.labels && st.mode === 'tag' })),
    ...ENZ1.map((n, i) => ({ text: n, pos: V3((ST[i].x + ST[i + 1].x) / 2 + (i === 0 ? 0.1 : 0.6), Y1 - (i === 1 ? 1.15 : 0.7), 0.3), color: '#C8C8D0', show: () => st.labels && st.mode === 'tag' })),
    { text: 'acyl-CoA', pos: V3(-0.9 + 0.6, Y1 + 2.0, 0.4), color: COL.acyl, show: () => st.labels && st.mode === 'tag' && st.cyc > 0.8 && st.cyc < 2.4 },
    { text: 'glucose → DHAP', pos: V3(-4.4 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' },
    { text: 'glycerol (liver)', pos: V3(-2.3 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'VLDL → blood', pos: V3(3.8 + 1.4, -0.85, 0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'fat droplet', pos: V3(3.8 + 1.5, -0.85, 0.2), color: COL.tag, show: () => st.labels && st.mode === 'tag' && st.tissue === 'adipose' },
    { text: 'phosphatidic acid', pos: P2.pa.clone().add(V3(OX2 - 0.5, 0.75, 0)), color: COL.pa, show: () => st.labels && st.mode === 'pl' },
    { text: 'DAG', pos: P2.dag.clone().add(V3(OX2 - 0.1, 0.75, 0)), color: COL.dag, show: () => st.labels && st.mode === 'pl' },
    { text: 'phosphatidylcholine', pos: P2.pc.clone().add(V3(OX2 + 0.2, 0.75, 0)), color: COL.pc, show: () => st.labels && st.mode === 'pl' },
    { text: 'phosphatidylethanolamine', pos: P2.pe.clone().add(V3(OX2 + 0.2, -0.8, 0)), color: COL.pe, show: () => st.labels && st.mode === 'pl' },
    { text: 'CDP-DAG', pos: P2.cdpdag.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: '#C8A0FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'phosphatidylinositol', pos: P2.pi.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: COL.pi, show: () => st.labels && st.mode === 'pl' },
    { text: 'choline', pos: V3(OX2 - 1.2 + 0.4, 3.65, 0.2), color: COL.ch, show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: '3 SAM', pos: P2.pe.clone().lerp(P2.pc, 0.5).add(V3(OX2 + 1.15, 0, 0.2)), color: '#FF8AB0', show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: 'hepatocyte', pos: HEP.clone().add(V3(OX2 + 0.2, 1.75, 0)), color: '#E08060', show: () => st.labels && st.mode === 'pl' },
    { text: 'VLDL → blood', pos: HEP.clone().add(V3(OX2 + 1.8, -0.15, 0.4)), color: '#7FD6FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'adipocytes', pos: V3(80 + 0.6, 2.6, 0.5), color: COL.tag, show: () => st.labels && st.mode === 'fat' },
    { text: 'capillary', pos: V3(80.7 + 3.6, 2.2, -0.6), color: '#E06A6A', show: () => st.labels && st.mode === 'fat' },
    { text: 'macrophages', pos: V3(80 + 3.4, -1.9, 0.8), color: '#C77DFF', show: () => st.labels && st.mode === 'fat' && bmi() > 31 },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'tag', label: 'Fat synthesis' }, { id: 'pl', label: 'Phospholipids and the liver' }, { id: 'fat', label: 'Adipose tissue' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'tag') box.append(h('div', { class: 'glabel' }, 'Site of synthesis'), h('div', { class: 'gctl' }, seg([{ id: 'adipose', label: 'Adipose tissue' }, { id: 'liver', label: 'Liver' }], () => st.tissue, (v) => { st.tissue = v; })));
      else if (st.mode === 'pl') box.append(h('div', { class: 'glabel' }, 'Experiment'), h('div', { class: 'gctl' },
        toggle('Choline and methionine', () => st.lipo, (v) => { st.lipo = v; st.msg = v ? null : '<b>Lipotropic factor deficiency.</b> Without choline (and methionine as a methyl-group donor), the liver cannot make enough phosphatidylcholine for the VLDL coats. Fat is still being synthesized but is not exported, and <b>fatty liver</b> develops (the droplets grow). This happens in protein starvation and in animals on a choline-free diet.'; refs.setInfo(); }),
        toggle('Alcohol', () => st.alc, (v) => { st.alc = v; st.msg = v ? '<b>Alcohol</b> overloads the liver with NADH: β-oxidation slows down, while synthesis of glycerol 3-phosphate and fat increases. The liver fills with fat even on a normal diet — the first stage of alcoholic liver disease (reversible if drinking stops).' : null; refs.setInfo(); }),
        button('Reset', () => { st.liverFat = 0.15; })));
      else box.append(h('div', { class: 'glabel' }, 'Daily calorie balance'), h('div', { class: 'gctl' }, range('lgBal', -600, 600, 10, () => st.bal, (v) => { st.bal = v; }, (v) => (v > 0 ? '+' : '') + v + ' kcal'), toggle('Years go by', () => st.run, (v) => { st.run = v; })),
        h('div', { class: 'gctl', style: 'margin-top:6px' }, button('Eat (insulin)', () => { st.hormone = 'ins'; st.hT = st.t; st.msg = '<b>After a meal</b>, insulin switches on lipoprotein lipase on the capillary wall: it breaks down the fats of VLDL and chylomicrons, and the fatty acids (yellow) enter the adipocytes and are reassembled into TAG. At the same time insulin inhibits lipolysis.'; refs.setInfo(); }), button('Fasting, exercise (epinephrine)', () => { st.hormone = 'adr'; st.hT = st.t; st.msg = '<b>Fasting, cold, exercise, stress:</b> epinephrine and glucagon act via cAMP to switch on hormone-sensitive lipase. Fats are broken down into fatty acids (orange) and glycerol, which enter the blood — fuel for the muscles and heart.'; refs.setInfo(); }), button('Reset', () => { st.fatKg = 15; st.years = 0; st.bal = 0; while (ADI.length > 7) { const a = ADI.pop(); G3.remove(a.g); } refs.rebuild(); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['tag', 'pl', 'fat'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'fat') { const b = bmi(); return [['BMI', b.toFixed(1), ''], ['Fat', Math.round(st.fatKg), 'kg'], ['Leptin', Math.round(st.fatKg * 0.6), 'ng/mL'], ['Elapsed', Math.floor(st.years), 'years']]; }
    if (st.mode === 'pl') return [['Liver fat', Math.round(st.liverFat * 30), '%'], ['VLDL output', Math.round(st.vldlOut * 100), '%']];
    return [['Fat molecules assembled', st.made, ''], ['Acyl-CoA per molecule', 3, '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E8C060',
    kicker: 'Biochemistry · lipid metabolism', title: 'Fat synthesis and obesity',
    lede: 'How fat and membrane phospholipids are assembled from glucose and fatty acids, why the liver can become “fatty”, and what happens to adipose tissue when there are too many calories.',
    notes: `
      <div><h2>Lipogenesis</h2>
        <p>The fatty acids in fat come from food or are synthesized from acetyl-CoA (excess carbohydrate) in the liver and adipose tissue. Synthesis is switched on by insulin and excess glucose and inhibited by glucagon and epinephrine.</p>
        <h3>Obesity</h3><p>Body mass index = weight (kg) / height² (m²): 18.5–25 is normal, 25–30 overweight, ≥ 30 obesity. Where the fat is stored also matters: visceral fat (around the organs) is more dangerous than subcutaneous fat. Adipose tissue is an endocrine organ: <b>leptin</b> tells the brain about the energy stores (in obesity there is plenty of it, but the brain becomes insensitive to it), and <b>adiponectin</b> increases insulin sensitivity (in obesity it is low).</p>
        <h3>Fatty liver</h3><p>Non-alcoholic fatty liver disease is the most common liver disease in the world; it is linked to obesity and insulin resistance.</p></div>
      <div><h2>Simplifications</h2><ul><li>Molecules are built from their formulas; phosphatidylcholine is taken from a real bilayer (molecular dynamics), the other phospholipids are shown with symbolic coloring.</li><li>The body-weight model is simplified: 7700 kcal per kg of fat, with no metabolic adaptation.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('tag'); st.fly = null;
  return self;
}
export { makeLipogen };
