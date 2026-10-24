import { Sparks, THREE, V3, __set_rnd, flyStep, flyTarget, glassMat, group, h, infoBox, makeControls, mulberry, rand, randUnit, range, rnd, seg, smooth, tissue, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, PDB, bioStage, flowArrow, molFade, molMesh, proteinMesh } from './kit.js';
Object.assign(BIO_PDB, {"dhfr":{"title":"Дигидрофолатредуктаза + НАДФН 1RX1","r":26.3,"chains":[{"id":"A","k":"p","seq":"MISLIAALAVDRVIGMENAMPWNLPADLAWFKRNTLDKPVIMGRHTWESIGRPLPGRKNIILSSQPGTDDRVTWVKSVDEAIAACGDVPEIMVIGGGRVYEQFLPKAQKLYLTHIDAEVEGDTHFPDYEPDDWESVFSEFHDADAQNSHSYCFEILERR","num":1,"ss":"CEEEECCCCCCCCCCCCCCCCCCCHHHHHHHHHHHCCCEEEEEHHHHHHHCCCCCCCEEEEECCCCCCCCCCEEECCHHHHHHHHCCCCCEEEEECHHHHHHHHHHEEEEEEEEECCCCCCCCCCCCCCCCCEEECCCCCCCCCCCCCCCEEEEEEEEC","ca":"4f7j/9f/If////D/Xv/W//7/oP/p/xsA4f/K/wQAIgDT/yoAYwCw/z0AdgCy/4cAtQCj/6wAvwCY//UAlwDK/x0BaQDb/+IAoQADAMUAjQAVAH4AvQBJAGoA/QBuAHQACwGxAFkA2wCpAB4A+QBlAA0A7AAbABwAMAH//zcALgG1/yUAMQGS/+D/9QBl/9j/5wBS/5L/tAAe/6b/kQBZ/8X/kwCD/4X/cwBK/1//PgBE/5T/LwCO/5P/LACP/0f//v9W/0T/zv9x/3b/zf+4/1r/y/+r/w7/j//J/+v+c//r/yj/df8yAD7/qv9EAHH/pv98AKT/5v+WAMH////SAOf/LAAJAcv/bADvAO3/YACrANH/UwDJAIz/lADuAI3/vQCzAJ7/ngCJAGf/qADCADT/gQCiAPr+OgCJAPb+LgBAAAT/GwAiAML+2v///7X+tv8jAO/+kv9lAPz+w/+MACn/oP+6AF3/zP/oAIb/s/8KAcb/0f9OAdT/tv+PAfD/2/+zAbj/yf+4AW7/5v9/AUb/JwCHASD/JgBQAez+7v9AAbv+/v/4ALf+2f/rAPj+mP8AARr/nv8vAVT/af8yAYz/Z/9XAc3/Pf8uAfv/MP/oAAsA6/7rAPL/Av8JAbL/NP/TAKj/AP+dAK//0P7AAID/B//GAEz/Dv97AEj/x/5zADD/oP4yADr/2v7+/zf/1/6+/17/Fv/O/4j/QP8MAJb/iP8CAK3/pP8zAOH/8P8wANv/EABdAA4ALQCAADEAIACCAHoA9v/AAH4Ay/+jAEYAwv9fAGIAq/97AKUAdv+fAIIAXP9pAFUAXv80AI0AGv8/AKkA/f47AGQAIv/+/08ABv+3/0gAR/+R/zoAkf+U/0cAxv90/yIABQBy/0sASgBa/0IAawBN/4UAtABR/3wA5gA0/64AFQFu/6wAKwGc/+EAMQHk/8kAJwEoAOMA9gBVAL4AzwCTAMoAjQB2ALcAYQBBANAAIwAfALkA5v8wAOEA2f8IACABmf/i/w4Bav+6/zwBef9y/ywBNf9d/0UBFP+C/wsBOf9Z/9YAOf8S/78Adv/z/qEAXv/Q/mIAoP/E/kAA5v+6/loAJACe/jcAaQCg/lgAqwCd/jMA8wCU/kQAJwHC/isASQGt/uz/fwHE/r3/UQH5/qP/LgEN/+P/XQEb/xwAJwEV/1IA8QDn/mIAqwAB/1YAYwDw/lsAKgAG/y4A6/8R/1IApP8k/0AAcv8//3IAKf9P/2oAAf97/5oAzv5T/8IA","o":"NPWr6M5TFkzC7qMhGlzj26UTG2AI/5z7pRUkKFjm82EWz0rSC6nRBvad+A9jMeesR/66AQKc8gljNP2rVPnK60rAL6gAnhD6uAq7pPXboBnysy3UqfnPoALjoh/vsyzSqPPTnxUPxkret8MfnvXwXxXr579IC03BIbM2yEnYPMjHRfi4WfDVQ9DHM9a1RP62TtPVLs62/07BAbdFQNLDpCTyB7pH2qslRkPm7NlaBFLHIcFGzkjQW+oiqQbPtz/o6qHsYPwd91/hXvbgvOFCr9fW2qXt/2DkErdBtyvLXf0k+jlSBNil/Li60Me97eKjE8G08r620eKtFvOfBq/GEvFh0a3j2B5X4uFaMwSq9t5dJEbCGa82Yeb9zCa0nfMGrNsmpgUrnfYBqdERrew0ngYQrc3r1KfwpN0Sv9bB4O9d6qMcEFzc7Z8RLFfo7Z74IFwXFaTf+kZHWNXtqyohYQnoqPsvJPmjBANkw0QoPLbixVDyIwJe9aTbtzYqQ74hwui18azMuMHjwAKzJM5PACek+qIi7bXBElwi8J8RIlni9KnQD1Yw6AWfAZwIGlYrQ0fsDGP2CaQmNwRT0/GoBVksA6Dj+GAc6aMbD1/l36kkBUu+8sBLvt2+9Fsn","brk":[]}],"ligs":[{"el":"P O O O C C O C O C O C N C N C C N N C N C O P O O O C C O C O C O C N C C C O N C C C P O O O","xyz":"LwDKACUAGQC/ADUAOQC+AAsAKADoABwAGAD6AC0AEwAUAR4A/P8PAQ4ACQAsAS8AHwA8ATQA9/88AR0ABwBKAQoA6/8mAQwA0/8fARsA0P8NAS4At/8MATcAqv8gASkAj/8qASoAe/8hAToAif8+ARkAnP9IAQkAtf9AAQcAu/8tARgASADRADgAVQDFAFMAPgDBAGYAbgDUAFoAXwCoAEkAeQCoADoAiQCNAD8AdwB3ADoAowCGAC8AugCBAD0AnQBsAB8AtQBeABoAhgBhACwAcQBOACAAcwAyACYAYgAgABwAaAAFACUAWgDy/xsAewD//zYASwAoAAkATABGAAUAXQBWAA8ACgBpAQsAEgBtAe3/7/9xARUAIgBuARwA","b":"AAABAAAAAgAAAAMAAAAWAAMABAAEAAUABQAGAAUABwAGAAsABwAIAAcACQAJAAoACQALAAoALAALAAwADAANAAwAFQANAA4ADgAPAA8AEAAPABUAEAARABAAEgASABMAEwAUABQAFQAWABcAFwAYABcAGQAXABoAGgAbABsAHAAcAB0AHAAeAB0AIgAeAB8AHgAgACAAIQAgACIAIgAjACMAJAAjACsAJAAlACUAJgAlACkAJgAnACYAKAApACoAKgArACwALQAsAC4ALAAvAA==","name":"NAP","chain":"A","seq":164}],"res":[]}});
Object.assign(BIO_MOL, {"folate":{"name":"Фолиевая кислота (B9)","el":"N C N C N C C C N C C C C C C C O N C C C C O O C O O N C C O N H H H H H H H H H H H H H H H H H H H","xyz":"wv1O/rz/+v3U/s//5/0P/0AAGf6P/1sABv7I/8wAOf5JAOIAfv6JAIMAtf4VAaAA/f5LAS4Agv8bAQgAv/+6AEwARgCMACQAgwDCALr/PwAtAW//xf9XAZT/DwGUAI3/QAHLACv/WAErANP/3AH6/67/QwIqABMALgLq/5wAhwJv/6gAVQIA/7YAFAN8/6QA2gFi/6D/PgIn/3n/ZQEX/7//k/5KAAcAZf7V//H/eP6P/3L/tf7C/xb/QP4O/2X/z/0e/mT/jv0i/gcAKf56AEMBYf5XAbgA+P4QAfYA0/6VAff/kP+MAKMAcwA9AF8AbgBcARj/lP+mAVv/LQH+/yQA+gEhAEv/pwIRAO7/PAKXAB0ASAIyAOoAxgHN/6kAQAOK//kAEwE2/5b/TP7c/g7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAJAA4ADAAPAA8AEAAPABEAEQASABIAEwATABQAFAAVABUAFgAVABcAEgAYABgAGQAYABoABgAbABsAHAADABwAHAAdAB0AHgAdAB8AAQAfAAAAIAAAACEABQAiAAcAIwAHACQACAAlAAoAJgALACcADQAoAA4AKQARACoAEgArABMALAATAC0AFAAuABQALwAXADAAGgAxAB8AMgA=","o":"12121211121212112111112112112112111111111111111111111"},"methotrexate":{"name":"Метотрексат","el":"C N C C C N C N C N N C N C N C C C C C C C O N C C C C O O C O O H H H H H H H H H H H H H H H H H H H H H H","xyz":"1QBE/tr/ygC+/ioAPwHq/nYAgwFd/y0AvwFH/7f//wGw/3P//wEmAKX/PAKSAGb/OwIIAZz/fQJ2AVX//QEiARYAwQHHAFsAggHoANsAvQE+ACcAgwHe/2UATQAJ/ywAQAB5/3UAwf/E/3YAWP+Z/y4AZv8e/9//2v/a/t7/1P7n/zAAyv5NAHMAYP67/+P/4/0DAOT/8P11AH3/of3nALn/8/0tASYAy/0uAZkAbv5rAQUAbf2r/7n/B/2p//v/d/1c/0P/rQBX/nb/PgEo/tL/nQD1/QkAhQGX/oAAIAEL/9kAvwHj/oz/fQLSAX3/qgJkAfz+UwGgABABhQFHAf4AkwCg/7AAvf8eALMAFP/4/qP/4P+A/qL/Zv5m/6v/zf0uAEYAxv1VAB7/Wf6PAHL/RP3BAOX/iP0wAWz/vf5IATAAnf2I//X+","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwALAAwACwANAAYADQANAA4AAwAOAAEADwAPABAAEAARABEAEgASABMAEwAUAA8AFAASABUAFQAWABUAFwAXABgAGAAZABkAGgAaABsAGwAcABsAHQAYAB4AHgAfAB4AIAAAACEAAAAiAAAAIwACACQAAgAlAAQAJgAJACcACQAoAAwAKQAMACoAEAArABEALAATAC0AFAAuABcALwAYADAAGQAxABkAMgAaADMAGgA0AB0ANQAgADYA","o":"111212121121112112121211211111211211111111111111111111111"},"amp":{"name":"АМФ","el":"N C N C N C N C N C C O C C O P O O O C O C O H H H H H H H H H H H H H H","xyz":"Cf7jAOX/Uf5lAN//Gf78/6r/Xf6C/6T/1f50/9P/Ff/g/wwAkf/w/0UAmv90AG4AK/+xAFEA1/5XABQA9/+M/1QAVgCy/7UA2gC4/34AAwFKAIEA/QCHAAQAjwF8ALj/2QECAcj/8AEEAPP/dQFiABb/1QBv//j/+wDo/g0AQQB4/8//FAAD/47/q/3pAL//NP41AQ4ALP4r/3f/7v+iAJ8Ayv8s/3EAHAF//8EAYgFYALQAuQB/AMIA8QG//67/fAECAAv/EgGZ/6r/CwG9/rf/MgDP/5D/yv8Y/1L/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAGAAoACgALAAsADAAMAA0ADQAOAA4ADwAPABAADwARAA8AEgAMABMAEwAUABMAFQAKABUAFQAWAAAAFwAAABgAAwAZAAcAGgAKABsADAAcAA0AHQANAB4AEQAfABIAIAATACEAFAAiABUAIwAWACQA","o":"121211121121111112111111111111111111111"},"urate":{"name":"Мочевая кислота","el":"O C N C O C N C O N C N H H H H","xyz":"wP6AAAAALP9GAAAAMP+6/wAArP94/wAAsf/+/gAAJADK/wAAqACk/wAA9QAZAAAAbAEfAAAAnACEAAAAHABPAAAAo/+RAAAA2v6E/wAAzQBI/wAAtQDkAAAAnf/2AAAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAHAAkACQAKAAUACgAKAAsAAQALAAIADAAGAA0ACQAOAAsADwA=","o":"21121112112111111"},"xanthine":{"name":"Ксантин","el":"O C N C O C N C N C N H H H H","xyz":"2v6R/wAASf/E/wAAVv9QAAAA1v+JAAAA4/8CAQAASAAwAAAA0ABIAAAADgHM/wAAtQBv/wAAOACr/wAAu/9x/wAABP+LAAAA/QCgAAAAeAG8/wAAr/8N/wAA","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAIAAkABQAJAAkACgABAAoAAgALAAYADAAHAA0ACgAOAA==","o":"2112111212111111"},"guanine":{"name":"Гуанин","el":"N C N C N C N C C O N H H H H H","xyz":"wv5lAAAAS/8xAAAArv+FAAAAMABYAAAAqACdAAAADQE9AAAA1wDH/wAATgDW/wAA4/90/wAA+P/8/gAAYP+m/wAAdP4lAAAAsv7JAAAAtQD/AAAAdgFRAAAAEv9n/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAMABwAHAAgACAAJAAgACgABAAoAAAALAAAADAAEAA0ABQAOAAoADwA=","o":"12111212121111111"},"gln":{"name":"Глутамин","el":"N C C C C N O C O O H H H H H H H H H H","xyz":"2/9bAHL/oP/h/6b/BgCC/+L/UwDC/1UA1AD//x4A5QCQABwALQG3//X/NP8EAA0A3v6y/ykANP+DAEwAmP+NADr/LABFADn/bv+u/1L/0v8p/wcATABi/5T/bAB2/58AGAAQAIUAOgG5APj/mwDMAD4ADP+HAKUA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAUAEQAFABIACQATAA==","o":"1111121211111111111"},"asp":{"name":"Аспартат","el":"N C C C O O C O O H H H H H H H","xyz":"2//CAAsAw/9OALb/RwARAIj/mQDc//7/kABo/yEA8gAzAEQAbv/n/wIAUP9+/8z/Q/8CAIYACgClAGAAg//uACMAi/9vAF7/gQBcAFP/MgC+/0T/AgEcAKEAGf9ZAJQA","b":"AAABAAEAAgACAAMAAwAEAAMABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAUADgAIAA8A","o":"111211211111111"},"thymine":{"name":"Тимин","el":"C C C N C O N C O H H H H H H","xyz":"9v6x/wAAjf/N/wAA5P9o/wAAbgCB/wAAoAAEAAAAGAEYAAAARwBwAAAAvf9YAAAAbv+1AAAA5f5N/9j/0P62/2YAw/76/8L/wP8B/wAArwAz/wAAagDPAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgAAAAJAAAACgAAAAsAAgAMAAMADQAGAA4A","o":"121121112111111"},"hypoxanthine":{"name":"Гипоксантин","el":"O C N C N C N C N C H H H H","xyz":"Y/83/wAAjP+p/wAAMf8VAAAAYv+YAAAA4f+yAAAAPgBMAAAAyABSAAAA9gDZ/wAAiwCA/wAAGADL/wAAzv4DAAAAG//sAAAAXQG+/wAAkgAd/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQACAAoAAwALAAcADAAIAA0A","o":"211211211121111"},"allopurinol":{"name":"Аллопуринол","el":"O C N C N C N N C C H H H H","xyz":"kwDPAAAAcQBbAAAA0QD0/wAApgBu/wAAKQBO/wAAx/+v/wAAPv+n/wAACf8kAAAAaf96AAAA5v8yAAAAMwEKAAAA8QAe/wAAB/9U/wAAXP/kAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQACAAoAAwALAAYADAAIAA0A","o":"211211121121111"},"fu":{"name":"5-Фторурацил","el":"F C C N C O N C O H H H","xyz":"CP9RAAAAjP81AAAA5f+ZAAAAbwB9AAAAngD6/wAAFgHk/wAAQwCP/wAAuv+p/wAAaf9O/wAAw/8AAQAAsQDKAAAAZAAw/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgAAgAJAAMACgAGAAsA","o":"121121112111"},"uracil":{"name":"Урацил","el":"O C C C N C O N H H H H","xyz":"Hv+c/wAAh//Y/wAAif9rAAAA/v+tAAAAdwBnAAAAeQDb/wAA5ACg/wAAAQCT/wAAK/+jAAAA/v8aAQAAzgCaAAAAAgAu/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEABwACAAgAAwAJAAQACgAHAAsA","o":"212112111111"},"adenine":{"name":"Аденин","el":"N C N C N C N C N C H H H H H","xyz":"Vv/UAAAAiv9MAAAAOP/n/wAAZ/9j/wAA5v9I/wAAQQCw/wAAywCz/wAA8AA5AAAAhgCDAAAAGAAvAAAAlv8iAQAA8v7kAAAAIP8R/wAACQFm/wAAVQFeAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAAAAoAAAALAAMADAAGAA0ABwAOAA==","o":"1212111211211111"},"cytosine":{"name":"Цитозин","el":"N C C C N C O N H H H H H","xyz":"CP+j/wAAjP/i/wAAl/91AAAAEACvAAAAggBfAAAAdQDT/wAA2QCM/wAA9v+Z/wAAAP8//wAAtf7c/wAAPf+yAAAAGAAbAQAA3gCJAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEABwAAAAgAAAAJAAIACgADAAsABAAMAA==","o":"1121121211111"},"gly":{"name":"Глицин","el":"N C C O O H H H H H","xyz":"vQDw/wsAUABOAPL/yv8FAP7/Y/9FAAkAxv93//v/DQEiAC8A1gDC/7X/WwB4AI7/VACfADwA8/9K/0QA","b":"AAABAAEAAgACAAMAAgAEAAAABQAAAAYAAQAHAAEACAAEAAkA","o":"112111111"},"co2":{"name":"CO₂","el":"O C O","xyz":"hv8AAAAAAAAAAAAAegAAAAAA","b":"AAABAAEAAgA=","o":"22"}});


// @scene purine makePurine | Нуклеотиды и подагра | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · НУКЛЕОТИДЫ: основания, нуклеотид, происхождение атомов пурина,
   распад пуринов до мочевой кислоты (ксантиноксидаза, аллопуринол, подагра),
   синтез и противоопухолевые антиметаболиты (метотрексат, 5-фторурацил)
   ========================================================= */
function makePurine() {
  __set_rnd(mulberry(2101));
  const scene = bioStage({ rim: 0xc77dff });
  const VIEW = { build: flyTarget(V3(0, -1.5, 0), V3(0.4, 0.6, 16)), catab: flyTarget(V3(40, -1.4, 0), V3(40.5, 0.8, 16.5)), synth: flyTarget(V3(80, -1.4, 0), V3(80.8, 0.6, 15)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.build.pos);
  const controls = makeControls(camera, VIEW.build.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1200, 0.08); scene.add(fx.obj);
  /* ---------- 1. строение ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  // аденин: окраска атомов по происхождению
  const A = MOL('adenine'); const SRC = { 0: 'asp', 1: 'co2', 2: 'asp', 3: 'thf', 4: 'gln', 5: 'gly', 6: 'gln', 7: 'thf', 8: 'gly', 9: 'gly' };
  const SRCC = { gly: '#7FE0A0', asp: '#FF6A6A', gln: '#7FA8FF', co2: '#C8C8D0', thf: '#F2C14E' };
  const adG = new THREE.Group(); adG.position.set(-1.0, 1.0, 0); G1.add(adG);
  Object.entries(SRCC).forEach(([k, c]) => { const idx = new Set(Object.entries(SRC).filter(([, v]) => v === k).map(([i]) => +i)); adG.add(molMesh(A, { scale: 0.42, idx, tint: c, bondR: 0.11 })); });
  // связи между атомами разного происхождения — общая модель полупрозрачная
  const adAll = molMesh(A, { scale: 0.42, hideH: true }); molFade(adAll, 0.35); adG.add(adAll);
  const bases = ['adenine', 'guanine', 'cytosine', 'thymine', 'uracil'].map((id, k) => { const m = molMesh(MOL(id), { scale: 0.2, hideH: true }); m.position.set(3.2 + (k % 3) * 1.7, k < 2 ? 2.0 : 0.2 - (k > 2 ? 0 : 0), 0); if (k >= 2) m.position.set(3.2 + (k - 2) * 1.7, 0.1, 0); G1.add(m); return m; });
  const amp = molMesh(MOL('amp'), { scale: 0.17, hideH: true }); amp.position.set(-5.6, -0.1, 0); G1.add(amp);
  /* ---------- 2. распад и подагра ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const PATH = [['amp', -6.6, 1.8], ['hypoxanthine', -3.8, 1.8], ['xanthine', -1.0, 1.8], ['urate', 1.8, 1.8]];
  const pm = PATH.map(([id, x, y]) => { const m = molMesh(MOL(id), { scale: id === 'amp' ? 0.14 : 0.22, hideH: true }); m.position.set(x, y, 0); G2.add(m); return m; });
  const guan = molMesh(MOL('guanine'), { scale: 0.22, hideH: true }); guan.position.set(-3.8, 0.1, 0); G2.add(guan);
  const ar = [flowArrow(G2, V3(-5.9, 1.8, 0), V3(-4.6, 1.8, 0), '#C77DFF', { bend: 0 }), flowArrow(G2, V3(-3.0, 1.8, 0), V3(-1.8, 1.8, 0), '#FF8A5C', { bend: 0 }), flowArrow(G2, V3(-0.2, 1.8, 0), V3(1.0, 1.8, 0), '#FF8A5C', { bend: 0 }), flowArrow(G2, V3(-3.0, 0.3, 0), V3(-1.5, 1.3, 0), '#C77DFF', { bend: 0.1 })];
  const allo = molMesh(MOL('allopurinol'), { scale: 0.22, hideH: true, tint: '#7FE0A0' }); allo.position.set(-2.4, 3.2, 0); G2.add(allo);
  const xoX = [0, 1].map((k) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff5a5a })); m.position.set(-2.4 + k * 2.8, 1.8, 0.3); G2.add(m); return m; });
  // сустав большого пальца стопы с кристаллами урата
  const joint = new THREE.Group(); joint.position.set(5.6, 0.4, 0); G2.add(joint);
  const bone1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.6, 10, 24), tissue(new THREE.Color('#E8DCC8').multiplyScalar(0.22))); bone1.rotation.z = Math.PI / 2 - 0.15; bone1.position.set(-1.25, -0.1, 0); joint.add(bone1);
  const bone2 = bone1.clone(); bone2.rotation.z = Math.PI / 2 + 0.15; bone2.position.set(1.25, -0.1, 0); joint.add(bone2);
  const caps = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), glassMat(0xff8a8a, { rim: 0.35, base: 0.01 })); caps.scale.set(1.0, 0.9, 0.9); joint.add(caps);
  const NCR = 70; const cry = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 5), new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xe0f0ff, emissiveIntensity: 0.4, roughness: 0.1, transparent: true, opacity: 0.9 }), NCR); joint.add(cry);
  const cryD = Array.from({ length: NCR }, () => ({ p: randUnit().multiplyScalar(rand(0.1, 0.7)), q: new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), randUnit()), L: rand(0.2, 0.5), th: rand(0, 1) }));
  /* ---------- 3. синтез и антиметаболиты ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const DH = PDB('dhfr'); const dS = 0.06;
  const dh = proteinMesh('dhfr', { scale: dS, colorBy: () => '#FF8A5C' }); G3.add(dh);
  DH.ligm.forEach((m) => dh.add(molMesh(m, { scale: dS })));
  const ldc = (() => { const m = DH.ligm[0]; const c = V3(0, 0, 0); for (let i = 0; i < m.n; i++) c.add(V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return c.multiplyScalar(dS / m.n); })();
  const mtx = molMesh(MOL('methotrexate'), { scale: dS * 1.2, hideH: true, tint: '#F2C14E' }); G3.add(mtx);
  const fol = molMesh(MOL('folate'), { scale: dS * 1.2, hideH: true }); G3.add(fol);
  const thy = molMesh(MOL('thymine'), { scale: 0.25, hideH: true }); thy.position.set(3.6, 1.7, 0); G3.add(thy);
  const fu = molMesh(MOL('fu'), { scale: 0.25, hideH: true }); fu.position.set(5.4, 1.7, 0); G3.add(fu);
  dh.position.set(-1.6, 0.4, 0);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'build', labels: true, rot: true, fly: null, cyc: 0, msg: null, allo: false, urate: 0.55, drug: 'mtx' };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['build', 'catab', 'synth'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'build') { if (st.rot) { adG.rotation.y += dt * 0.35; bases.forEach((m) => { m.rotation.y += dt * 0.4; }); amp.rotation.y += dt * 0.3; } }
    if (st.mode === 'catab') {
      ar.forEach((a) => { a.mat.uniforms.uTime.value = t; }); pm.forEach((m) => { m.rotation.y += dt * 0.4; }); guan.rotation.y += dt * 0.4;
      ar[1].mat.uniforms.uOn.value = ar[2].mat.uniforms.uOn.value = st.allo ? 0.1 : 1; xoX.forEach((m) => { m.visible = st.allo; });
      allo.visible = st.allo; allo.rotation.y += dt * 0.6;
      const u = st.allo ? Math.max(0.25, st.urate * 0.5) : st.urate; st.uEff = u;
      const fill = smooth(0.4, 0.75, u);
      cryD.forEach((c, i) => { const vis = c.th < fill; dm.position.copy(c.p); dm.quaternion.copy(c.q); dm.scale.set(1, vis ? c.L * (0.6 + 0.4 * fill) : 0.001, 1); dm.updateMatrix(); cry.setMatrixAt(i, dm.matrix); }); cry.instanceMatrix.needsUpdate = true;
      caps.material.uniforms.uColor.value.set(fill > 0.5 ? '#FF5A5A' : '#FF8A8A'); caps.material.uniforms.uRim.value = 0.35 + fill * 0.5;
      if (fill > 0.4 && rnd() < 0.1 * fill) fx.spawn(joint.position.clone().add(G2.position).add(randUnit().multiplyScalar(0.9)), randUnit().multiplyScalar(0.2), new THREE.Color(0xff5a5a), 0.6, 1, 1.1);
    }
    if (st.mode === 'synth') {
      if (st.rot) dh.rotation.y += dt * 0.2;
      const c = st.cyc % 8; const site = ldc.clone().add(V3(0.5, 0.6, 0.4)).applyEuler(dh.rotation).add(dh.position);
      const comp = st.drug === 'mtx';
      fol.visible = true; mtx.visible = comp;
      const inF = smooth(0, 2, c) * (comp ? 0.35 : 1); fol.position.copy(V3(-6.2, 2.4, 0).lerp(site, inF)); fol.rotation.y += dt;
      mtx.position.copy(V3(2.0, 2.6, 0).lerp(site, smooth(0, 1.5, c))); mtx.rotation.y += dt;
      [thy, fu].forEach((m) => { m.rotation.y += dt * 0.5; });
    }
    fx.update(dt);
  }
  const TXT = {
    build: '<b>Нуклеотид</b> = азотистое основание + пентоза + фосфат (слева — <b>АМФ</b>). Основания: <b>пурины</b> (аденин, гуанин — два кольца) и <b>пиримидины</b> (цитозин, тимин, урацил — одно кольцо; справа). В ДНК — дезоксирибоза и тимин, в РНК — рибоза и урацил. В центре — <b>аденин</b>, атомы раскрашены по происхождению при синтезе пуринового кольца: <span style="color:#7FE0A0">глицин</span> (C4, C5, N7), <span style="color:#FF6A6A">аспартат</span> (N1 и аминогруппа), <span style="color:#7FA8FF">глутамин</span> (N3, N9), <span style="color:#C8C8D0">CO₂</span> (C6), <span style="color:#F2C14E">формил-ТГФК</span> — производное фолиевой кислоты (C2, C8). Кольцо собирается прямо на рибозо-5-фосфате (из ФРПФ).',
    catab: '<b>Распад пуринов.</b> АМФ → ИМФ → инозин → <b>гипоксантин</b> → <b>ксантин</b> → <b>мочевая кислота</b>; гуанин тоже даёт ксантин. Последние две реакции выполняет <b>ксантиноксидаза</b> (молибден, ФАД). У человека мочевая кислота — конечный продукт, она плохо растворима. При избытке (наследственность, мясо и пиво, почечная недостаточность) её натриевая соль выпадает игольчатыми <b>кристаллами в суставах</b> — <b>подагра</b>, приступ чаще всего в большом пальце стопы, и камни в почках. Включите <b>аллопуринол</b> — аналог гипоксантина, ингибитор ксантиноксидазы: мочевой кислоты образуется меньше, кристаллы растворяются.',
    synth: '<b>Синтез нуклеотидов и антиметаболиты.</b> Пурины и пиримидины клетка строит из аминокислот, CO₂ и рибозы, а для переноса одноуглеродных групп нужна <b>тетрагидрофолиевая кислота</b> — её восстанавливает дигидрофолатредуктаза (реальная структура с коферментом НАДФН, PDB 1RX1). Быстро делящиеся клетки особенно зависят от этого пути, и на этом построена химиотерапия: <b>метотрексат</b> — аналог фолата, прочно занимает ДГФР; <b>5-фторурацил</b> (справа рядом с тимином) — аналог тимина, блокирует тимидилатсинтазу. Часть оснований клетка не синтезирует заново, а переиспользует — <b>«путь спасения»</b> через фермент ГГФРТ; его наследственный дефект — <b>синдром Леша — Найхана</b> (подагра и самоповреждения у мальчиков).',
  };
  const labels = [
    { text: 'аденин: откуда атомы', pos: V3(-1.6, 2.9, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'build' },
    { text: 'АМФ (нуклеотид)', pos: V3(-6.4, -1.2, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'build' },
    ...['аденин', 'гуанин'].map((n, k) => ({ text: n + ' · пурин', pos: V3(3.2 + k * 1.7 - 0.5, 1.2, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'build' })),
    ...['цитозин', 'тимин (ДНК)', 'урацил (РНК)'].map((n, k) => ({ text: n, pos: V3(3.2 + k * 1.7 - 0.5, -0.7, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'build' })),
    ...PATH.map(([id, x, y]) => ({ text: MOL(id).name, pos: V3(40 + x - 0.6, y - 0.95, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'catab' })),
    { text: 'гуанин', pos: V3(40 - 4.3, -0.7, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'catab' },
    { text: 'ксантиноксидаза', pos: V3(40 - 1.6, 2.5, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'catab' && !st.allo },
    { text: 'аллопуринол блокирует', pos: V3(40 - 1.8, 3.9, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'catab' && st.allo },
    { text: 'сустав: кристаллы урата', pos: V3(40 + 4.6, -0.9, 0), color: '#FF8A8A', show: () => st.labels && st.mode === 'catab' },
    { text: 'ДГФР + НАДФН (PDB 1RX1)', pos: V3(80 - 2.6, -1.8, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'synth' },
    { text: 'метотрексат', pos: V3(80 + 2.0, 3.2, 0), color: '#F2C14E', show: () => st.labels && st.mode === 'synth' && st.drug === 'mtx' },
    { text: 'фолат', pos: V3(80 - 6.0, 3.0, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'synth' },
    { text: 'тимин', pos: V3(80 + 3.3, 0.9, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'synth' },
    { text: '5-фторурацил', pos: V3(80 + 5.0, 0.9, 0), color: '#9BE07A', show: () => st.labels && st.mode === 'synth' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'build', label: 'Строение' }, { id: 'catab', label: 'Распад и подагра' }, { id: 'synth', label: 'Синтез и антиметаболиты' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 380px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'catab') box.append(h('div', { class: 'glabel' }, 'Мочевая кислота крови и лечение'), h('div', { class: 'gctl' }, range('uA', 0.15, 0.9, 0.01, () => st.urate, (v) => { st.urate = v; }, (v) => `${v.toFixed(2)} ммоль/л`), toggle('Аллопуринол', () => st.allo, (v) => { st.allo = v; })));
      else if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'В активный центр'), h('div', { class: 'gctl' }, seg([{ id: 'fol', label: 'Только фолат' }, { id: 'mtx', label: 'Фолат + метотрексат', color: '#F2C14E' }], () => st.drug, (v) => { st.drug = v; st.cyc = 0; })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['build', 'catab', 'synth'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'catab' ? [['Мочевая кислота', (st.uEff || st.urate).toFixed(2), 'ммоль/л'], ['Норма', '< 0,42', 'муж.']] : [['Оснований', '5', ''], ['Нуклеотидов ДНК', '4', 'вида']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#C77DFF',
    kicker: 'Биохимия · обмен нуклеотидов', title: 'Нуклеотиды и подагра',
    lede: 'Из чего строятся буквы генетического кода, во что они превращаются при распаде и почему избыток мочевой кислоты оборачивается болью в суставах.',
    notes: `
      <div><h2>Обмен нуклеотидов</h2>
        <p>Нуклеопротеины пищи расщепляются: в желудке — на белки и нуклеиновые кислоты, в кишке ДНК-азы и РНК-азы поджелудочной железы и фосфодиэстеразы дают нуклеотиды, нуклеотидазы — нуклеозиды, которые и всасываются. Но для синтеза своих нуклеиновых кислот организм почти полностью делает нуклеотиды сам.</p>
        <h3>Пиримидины</h3><p>Кольцо пиримидинов строится из карбамоилфосфата (цитозольная КФС II) и аспартата, а рибоза присоединяется в конце (через оротовую кислоту). Распадаются они до растворимых β-аланина, CO₂ и NH₃ — поэтому болезней накопления, как подагра, у пиримидинов нет. Наследственная оротацидурия — дефект синтеза УМФ.</p>
        <h3>Дезоксирибонуклеотиды</h3><p>Образуются из рибонуклеотидов рибонуклеотидредуктазой (её ингибитор — противоопухолевый гидроксимочевина); тимидиловый нуклеотид — тимидилатсинтазой с метилен-ТГФК.</p></div>
      <div><h2>Модели</h2><ul><li>Молекулы — по химическим формулам; ДГФР — реальная структура PDB 1RX1, положение метотрексата и фолата условно.</li><li>Кристаллы урата в суставе — схематично.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('build'); st.fly = null;
  return self;
}
export { makePurine };
