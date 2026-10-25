import { Sparks, THREE, V3, __set_rnd, button, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, rand, randUnit, range, rnd, scopeShow, seg, smooth, taperTube, toggle } from '../core.js';
import { BIO_MOL, MOL, atomMat, bioStage, blobGeo, flowArrow, lipidMol, molFit, molMesh, pcaAxis, plotAxes, protMat } from './kit.js';
Object.assign(BIO_MOL, {"tag":{"name":"Триацилглицерин","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Ov+e/EIBFP90/LUANf/e/EsAy//2/DsA5/9Z/cn/fAB2/bv/lwDd/U7/LQH8/UP/TgFl/tj+GgHx/vv+SwFa/5f+FwHk/73+SQFRAF7+EwHaAIn+RgFMATL+CwHSAVr+7gAqAgr+AAHdAeH+zQBbAhH/wQBRAqr/hQDRAuX/+v/YAsP/uP8/A/7/6/+WA0MAJP81A+P/1v4PA2EA7P59AogAn/5ZAgcBuf7KATgBff5fAd0AnP7SABEBZv5nALEAhf7a/+MAVv5x/34Acv7j/rAARf52/k4Al/51/sz/bP4B/nH/vP4B/vD+RQE5At7/SQH3AVUA5wDgAZsA1wHOAXQA4AFdAdsApAHaAKkAugFpAA4BbAHr/+cAiQF4/0cBNwH6/ikBpQAK/0sBOwD9/vsAOgDb/mgA6f8+/xQAJwDK/xEA1v8oALb/FwCyAK3/0P8OAUr/TP9FAYD/Dv+pASD/pv+n/E4BF/9T/IoBDP/+/FwBqP5h/LIARv8W/JwAA/88/WUAC/+9/Ov/9f8e/ZgA/v+Y/CYAsf+3/dz/wP8x/Wv/sgAZ/aT/pACa/RsAXwA4/mT/cwC4/e3+YwGg/Sv/UwEf/qT/JgFF/nf+uwFp/s7+rADx/vv+OwEM/2D/uQFb/5b+KgFA/zL+qQDj/7v+NQH8/yP/KgE7APf9twFTAF/+LwHrAPL+pgDYAIb+KwE5Acr9swFUATn+awBuAuP+FAGpAvX+gAD7AcD/kADQAlIAugApA77/A/+YA7//EP/uApH/8/5RA7QAa/4fA04AzP48AjYAV/9qApkAvP6eAlcBM/5nAvcAjv6/AZ0BJf+6AUIBpf5pAXgAEf5tAdcACf/GABsBcP7FAHQBkf51AE4A+f1zAKcAVP7K/0QB8f7P//MAif6C/x8A6v18/2wAPf7T/g8B3f7X/sYAT/4V/n8A2/2D/jcAAf9r/uT/iv7T/pb/e/6i/aX/Av4K/ln/J//3/QP/nv6t/bH+rP5d/rf+CAKuARgACwInApoArQF8ATgBSgJOAfQA0QG+AEkAOAHmAJcAJQJSABUBmQGKAHIBAQECAOcAhgHN/4EAdwGY/68B9AFe/0EBRgHd/sAAXgGn/mYBkgAi/7QB2P8L/ycBnwDS/j8ACwB4/l4A4/8X/67/g/9E/zoAjgDE/+3/KQD1/3YAcP8wAN3/z//8/1L/fwCmAI3/GwDgABEAEgBiATT/v//aAOz+Bf/0AJL/Xv93AeD/UP/+AQ//+f56Ab/+r/7OAUj/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"glucose":{"name":"Глюкоза","el":"O C C O C O C O C O C O H H H H H H H H H H H H","xyz":"2f4oAEkABv8gAMP/n/8WALz/2P+SAOP/XQCPAA8AYACYAJ4ArwAWAOP/zQAgAFj/agCR/wAAnwBa/3gA0/+g/w8AlP8o/+T/eP4kAEsA2v7J/5P/5v55AI3/uv8DAFP/kADqAOn/uQC0ALoADwEYABoAjgBcAC7/fwBM/67/uwD//mgAu/+x/3gAQ/8a/xcA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAAIAAkACAAKAAIACgAKAAsAAAAMAAEADQABAA4AAgAPAAQAEAAFABEABgASAAcAEwAIABQACQAVAAoAFgALABcA","o":"111111111111111111111111"},"palmitic":{"name":"Пальмитиновая кислота","el":"C C C C C C C C C C C C C C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"qvxaAOr/Cf3q/8P/lv0CAPj/9P2Q/9D/gf6d/w0A0P4UANb/XP8iABIAu/+y/+f/SAC//yMAlwA2AOz/IwFDACkAgwHU//3/DwLh/zoAXAJbAAcA7AJgADwARgP6//v/MAO5/5f/uwPu/zwAo/xkAFcARvxHAMT/zPy6AMH/C/3h/1b/4vyL/+v/u/1hANH/k/0LAGYA/P2L/2P/yv0x//L/ef6l/3oAtv5A//f/mf5xAOz/1/4NAGn/Vf8kAH8AhP+DAPP/w/+v/3n/k/9R/wYAQADG/5AAfgBi/w0AngAvAH//YQCTAAMATAGkAAkAHAFGAJYAigHS/5D/WgFz/xwARwKG/yEACALl/6cAXQJcAJn/KQK3ACgA7AJPAKkAFgPDACgA7AOs/wgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQAAABIAAAATAAAAFAABABUAAQAWAAIAFwACABgAAwAZAAMAGgAEABsABAAcAAUAHQAFAB4ABgAfAAYAIAAHACEABwAiAAgAIwAIACQACQAlAAkAJgAKACcACgAoAAsAKQALACoADAArAAwALAANAC0ADQAuAA4ALwAOADAAEQAxAA==","o":"1111111111111112111111111111111111111111111111111"},"pi":{"name":"Фосфат","el":"O P O O O H H H","xyz":"NQBt/8z/AAAAAAIAAAAAAJsAZQB4AMz/Zv8bAMz/XgBC/xgATwCDAG7/LP/0/w4A","b":"AAABAAEAAgABAAMAAQAEAAAABQADAAYABAAHAA==","o":"1211111"},"glycerol":{"name":"Глицерин","el":"O C C O C O H H H H H H H H","xyz":"Y/+l/zMAg//w/8D/AABGANH/AACPAEoAfQDw/8D/nQCl/zMAk/9R/zIALv8yAKf/kv+s/2v/AACQAH7/HQDqADkAbgCs/2v/0gAyAKf/uwDg/3oA","b":"AAABAAEAAgACAAMAAgAEAAQABQAAAAYAAQAHAAEACAACAAkAAwAKAAQACwAEAAwABQANAA==","o":"1111111111111"},"pa":{"name":"Фосфатидная кислота","el":"C C C C C C C C C C C C C C C C O O C C C O P O O O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"RfsBAVv/wPu0AIj/PvwJAYD/ufy6AK7/OP0PAab/sv3AANP/Mv4UAcz/rP7EAPj/K/8ZAfL/pv/IAB0AJQAeARgAoADMAEEAHwEiAUAAmQHPAGgAGQIiAWoAjQLMAJQAvgLMAAQBtAJ+ACwAHQMgAEsAIQO0/97/YwPh/1v/0QM5AGz/XgT7/5f/XAR3/9r/sgT8/w//pARvAOr/mQKJ/8T/hgIL/5f/4AK7/n//9AHy/n7/ngER//n/CQEA/9r/swAo/1IAHgAh/zEAyf9N/6gANP9J/4YA3v52//kAWP5+//cAAv5a/4EAbf1k/6EAF/1C/ycAgvxL/0gALPwu/83/l/s4/+3/Qfsf/3H/rfor/5H/7PrCAGL/T/siAfP+NftZAZr/y/tbAEn/sPuRAO//MvxiAb//TfwsARn/qvyYABUAxPxhAG//R/0yAT//Lf1oAeX/vv1mAJT/pP2dADoAJ/5tAQsAQP43AWX/nf6gAF8At/5rALn/IP9wATIAOv89AYv/l/+iAIIAsv9xANv/GgBzAVwAMwBGAbP/rAB4APv/kQCiAKUALgFNAd3/EwF1AYcAiQGiAMoApAF8ACEALgJPAQgAEAJ1AbEAfANVAFYABQPv/6oAWwNh/wcAggOK/x//GQMWAB3/oQSs/9r++gRSAA0A5wGJ/mL/1gEv/yj/sAF3/xsAuwHO/ksA9ACY/r7/7gA//4T/yQDm/qcAzQCO/3IAAwC7/hQACQBi/9v/5f+z/8YA3f8M//4AGP/j/moAIf+K/zAAEf+T/1UBJf6h/1EBGf6e/y4AGf70/mAAVf3K/8MAVP0g//QAL/2H/9X/L/3d/gUAa/yw/24AafwF/5gAQ/zJ/qf/Rfx1/33/ffvu/jsAgfub/xYAW/tn/yP/Vvu7/kn/cfoZ/zf/j/ri/t3/lfqP/7b/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAFgAZABMAGgAaABsAGwAcABsAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQApACoAKgArACsALAAsAC0AAAAuAAAALwAAADAAAQAxAAEAMgACADMAAgA0AAMANQADADYABAA3AAQAOAAFADkABQA6AAYAOwAGADwABwA9AAcAPgAIAD8ACABAAAkAQQAJAEIACgBDAAoARAALAEUACwBGAAwARwAMAEgADQBJAA0ASgAOAEsADgBMABIATQASAE4AEwBPABQAUAAUAFEAGABSABkAUwAdAFQAHQBVAB4AVgAeAFcAHwBYAB8AWQAgAFoAIABbACEAXAAhAF0AIgBeACIAXwAjAGAAIwBhACQAYgAlAGMAJgBkACYAZQAnAGYAJwBnACgAaAAoAGkAKQBqACkAawAqAGwAKgBtACsAbgArAG8ALABwACwAcQAtAHIALQBzAC0AdAA=","o":"11111111111111121111112111121111111121111111111111111111111111111111111111111111111111111111111111111111111111111111"},"dag":{"name":"Диацилглицерол","el":"C C C C C C C C C C C C C C C C O O C C C O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"r/v2AJ3/OfzYAGT/p/zsAMz/Mf3MAJH/oP3hAPn/Kf7BAL3/mf7aACIAIv+/AOP/lP/fAEQAHADKAAEAkADuAF8AFgHbABkAjAH8AHUAEQLeAC8AigL6AIkADwPVAEsAeAPTAIoABAO2AMj/fAOJAIX/iwPx/5X//AO4/z//NwRF/3v/DAO0/2//8QI7/6b/PgP7/uz/ZwIO/37/CAIr//L/dgEJ/9D/GwEu/0UAiAAY/yUAMABC/5sAm/80/3oARf9c/+8Av/5i/+4AaP5C/3cA1P1c/5UAfP1A/xsA6fxZ/zsAkfxB/8D//ftb/+D/pftG/2X/E/tj/4T/qfteAb//mfu1APL/YvvmAFH/S/waAQ3/O/xxAD//pfxUAe//lPysACIAQ/0MATr/M/1kAG7/nv1JARsAjv2iAFAAOf7/AGT/LP5ZAJ3/lf5CAUUAjP6aAHoAKP9XAMT/Lf/9AIn/jP9GAWcAjP+eAJ0AIgAIAaf/JgBiAOH/jACvALkAhgBWAYAAHwFzAPb/GwEbAcD/iAFlAZMAhQHAANEAGAIcAdT/EwJ2AA4AjQJkAaMAgAK/AOUAbgOiABv/1AO/AKn/nQPc////TQQBADT/2QOc/9v+8AMS/6f/awKj/mb/SAJC/yP/DwKU/w4AJwLx/koAbQGf/rn/WAFB/3f/KwGX/2AANwHy/p0AbABS/8z/dgCu/g0ASQAF//IARQCq/7YAg/9y/yQAhf/M/mAAeP91/0wBjf6A/0oBh/6A/yIAdf7Z/lwAtP0d/+kAxv3F/7UAnP1//8j/iv3Y/vz/3PzA/10AyfwX/40AsfyC/27/nfzZ/p7/8vvB/wUA3fsY/zAAxvuI/xT/r/vf/kH/7vog/9L/1vpU/yr/BfvK/6X/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAEwAWABYAFwAXABgAFwAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQAAACoAAAArAAAALAABAC0AAQAuAAIALwACADAAAwAxAAMAMgAEADMABAA0AAUANQAFADYABgA3AAYAOAAHADkABwA6AAgAOwAIADwACQA9AAkAPgAKAD8ACgBAAAsAQQALAEIADABDAAwARAANAEUADQBGAA4ARwAOAEgAEgBJABIASgATAEsAFABMABQATQAVAE4AGQBPABkAUAAaAFEAGgBSABsAUwAbAFQAHABVABwAVgAdAFcAHQBYAB4AWQAeAFoAHwBbAB8AXAAgAF0AIQBeACIAXwAiAGAAIwBhACMAYgAkAGMAJABkACUAZQAlAGYAJgBnACYAaAAnAGkAJwBqACgAawAoAGwAKQBtACkAbgApAG8A","o":"111111111111111211111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111"},"choline":{"name":"Холин","el":"C N C C C C O H H H H H H H H H H H H H H","xyz":"f/+S/00Asv8EAAIATf8uAKL/zv9zAFsAIwDc/6//mwDA/wcA9QAuAP7/Gv97/ywAfv+q/7cAv/87/zwAN//c/17/8v5LANf/cv+DAGn/AQBOALUAcf+jAHgADgC8ACkACQCC/3f/OgArAGj/fQC0/28AzwBl/+b/MgEsAEkA","b":"AAABAAEAAgABAAMAAQAEAAQABQAFAAYAAAAHAAAACAAAAAkAAgAKAAIACwACAAwAAwANAAMADgADAA8ABAAQAAQAEQAFABIABQATAAYAFAA=","o":"11111111111111111111"},"g3p":{"name":"Глицерол-3-фосфат","el":"O C C O C O P O O O H H H H H H H H H","xyz":"lf4rAPH/FP8OALn/bf/k/zAAov9m/xIAzP9VAE8ALQBpAOz/sAAJAPb/LgFjAOf/sgCd/3f/vwC2/4QAl/6CABsADf+8/3P/Pf9mAIn/Kv/Y/4gAxP86/2IAj/+yAFQA9v9KALMAiABN/5r/BgF2/3UA","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAAAKAAEACwABAAwAAgANAAMADgAEAA8ABAAQAAgAEQAJABIA","o":"111111211111111111"},"ptdins":{"name":"Фосфатидилинозитол","el":"C C C C C C C C C C C C C C C C O O C C C O P O O O C C O C O C O C O C O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"YfocACEA5/otAGcAU/tdAAYA2vtuAEwARvyfAOz/zPywADMAOP3kANT/vf34AB0AKf4uAcD/rf5FAQwAGv98AbD/nf+QAf3/DwC/AaL/kgDIAe//BwHzAZf/hgHxAej/tAFQAiUAvQF0AeT/MgJjATYAXQLPAC8AiQKpAKH/xwIpAKb/ZQMgAIv/jwMoAPz+oQOUAOb/lgOd/9n/OQNR/ycA3gIA/8n/VAIh/+D/7gJo/tn/qQIk/m//gwNE/tP/kwO2/db/0QOD/kcAUQSw/hgAhwP4/okA4wNG/9YA7AF6AE8AzwFqANIAEgKXAC8BUgEXAOYA8AAmAHIAbADb/4gAEQDt/w8AiP+s/yMAMf/C/6f/o/6L/7v/T/6f/0D/zP2A/zf/ef1J/6f/6vwq/3n/k/z7/u3/A/zh/sD/qvu5/jUAGvui/ggAv/p//n4AL/pr/lEAPvp7APj/Fvr4/2gAaPrT/9D/BfvO/5MA3Pp1ALkAXfsWALP/Nfu9ANr/z/u0AJ8A+PsOAHgAUfxYAJn/J/z/AMD/wPz3AIcA6/xRAF4ARf2dAIL/GP1DAan/3v2YAEgAr/09AXEACP6NAZT/Ov7oAG7/zv7mADgAnP6LAV4A+v7bAYT/K/82AV3/uf8yAS0Ajv/ZAU0A9v8gAnb/GgB4AU//qABnAR0AhwAPAkIA+ABYAnD/EgGxAUD/gwKkAREAGQJ9AZ0ArwK8AHUAMgKgAF7/zQLzAHf/AQSeANf//wKZ/2MA8QIa/2D/SwKA/83/wAJE/jYATwJK/m7/rANk/nL/TwOT/Zj/6AM4/pQAfgRh/vX/PgPO/tEANARJ/54AcAGv//IAIgE5AEMB2gCQAGIAHgEBABYAgABw/5gAOwABAOIABABYAPr/QQDB/7b/lP9B/zYAV//Y/3oAK/8tAJD/X/+R/1D/df69/xEAqf4g/9L/gP7I/+j+mv2T/9j+pv3t/s3/df2S//j/6/ze/iv/vfyE/03/vfyf/hgAk/xH/z0A2/s8/5H/AvyS/nT/rPsH/4IA0ftd/mMA9Pr9/tb/F/tS/r3/4/oj/q4AwvrP/skA8PlS/qcAJ/oa/ggAB/rG/iMA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAFgAZABkAGgAaABsAGwAcABsAHQAdAB4AHQAfAB8AIAAfACEAIQAiACEAIwAjACQAEwAlACUAJgAmACcAJgAoACgAKQApACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAAjABoAAAA5AAAAOgAAADsAAQA8AAEAPQACAD4AAgA/AAMAQAADAEEABABCAAQAQwAFAEQABQBFAAYARgAGAEcABwBIAAcASQAIAEoACABLAAkATAAJAE0ACgBOAAoATwALAFAACwBRAAwAUgAMAFMADQBUAA0AVQAOAFYADgBXABIAWAASAFkAEwBaABQAWwAUAFwAGABdABoAXgAbAF8AHABgAB0AYQAeAGIAHwBjACAAZAAhAGUAIgBmACMAZwAkAGgAKABpACgAagApAGsAKQBsACoAbQAqAG4AKwBvACsAcAAsAHEALAByAC0AcwAtAHQALgB1AC4AdgAvAHcAMAB4ADEAeQAxAHoAMgB7ADIAfAAzAH0AMwB+ADQAfwA0AIAANQCBADUAggA2AIMANgCEADcAhQA3AIYAOACHADgAiAA4AIkA","o":"111111111111111211111121111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"cdpdag":{"name":"ЦДФ-диацилглицерол","el":"C C C C C C C C C C C C C C C C O O C C C O P O O O P O O O C C O C N C C C N N C O C O C O O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"N/q6AbH/o/pQAb7/L/uNAcf/mvshAdP/JvxfAd7/kfzzAOz/Hf0wAfn/iP3EAA0AE/4DARsAfv6ZADUACP/ZAEIAc/9xAGUA/v+wAG4AZgBKAJwA8wCGAJwAXAEnANIAvAFKABUBRAGo/6cAnQFD/9wAdwG7/qAAoQG0/gwALQKk/gUAbgJv/nv/EwIk/iH/5gIW/rL/uALv/kX/sQIu/7T+KgI7/3b+HwPe/mD++wK7/8n+rQIiAAT/3gI+AJL/awNaAJj/gAOfABcA3QMNAQEAxANuAaP/EwTaAZf/hAThAfX/2wRKAu//mQSJAVEARQQcAV4AVQTNALsA9QLHAE8AzQJqALUAnAK2ANT/FAKiAPX/6ACr/qYAtgBw/hYB+wBF/nEBHwBt/hcB3P+i/pgARP+l/qUAA//V/iMAa/7i/jIAKv4N/6//lP0i/7//U/1L/z7/0fxs/zD/bfxt/6D/4PuN/23/fPuV/+H/7/q1/67/jPrG/yIAAPrm/+7/n/n8/2IAE/kdADAAOPr9AQgA1fmMAav/Rvr3AVf/j/oTARcAnfoNAWf/QvvKAW7/NPvQAR0AhvvkACwAlvvfAHz/KvyiATUAOvycAYX/jvyxAJT/fPy1AEQAM/1rAaD/Hv11AU8Acf2JAGYAh/2AALf/Ev5LAW0AK/46Ab//Zv5jAJEAfv5QAOT/I/8KAeP/Bv8nAY8AdP8iABkAWf9CAMUA/P8EAbUAGgDZAA0ATQAlAAABYwD0/1gAEAGkADcA9ADfANwAjwFA/0kBBgJd/8YAqwFr/tYAgwEN/9X/bwFe/t3/yAK8/cv/eQPz/oD+vAJ7AMb+QwILAAT/zQLj/83/rgNUAFkAcQNfAV//BQQmAkz/FgVPAkEAtASkAtT/8gIrAXoAbQJ4AMUApAIPAZX/4AGqAKP///+q/m0BAAAG/icB+f9k/kMAAAAI/4IAKP/o/vgAH/9B/r4AGv+P/tP/Lf82/wcAVP4s/4AAQf6C/lIAPv7B/mL/Wf5q/4v/gv1v/wsAZv3F/uL/kv1O/+X+rvyI/83+ivy5/+r/bPwM/9L/4Pvs/zf/wPtA/yb/evs2/xcAnPvj/ycAzfpl/2z/8foRAHL/ivpq/14Ar/oXAGMA3PmT/7D/A/o/AK//mvmj/6EAwvlPAKEA6/jL//P/E/l4APP/z/gtAIQA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAFgAZABkAGgAaABsAGgAcABoAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAlACcAJwAoACgAKQAhACoAKgArACoALAAsAC0AEwAuAC4ALwAvADAALwAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6ADoAOwA7ADwAPAA9AD0APgA+AD8APwBAAEAAQQAsAB8AKAAiAAAAQgAAAEMAAABEAAEARQABAEYAAgBHAAIASAADAEkAAwBKAAQASwAEAEwABQBNAAUATgAGAE8ABgBQAAcAUQAHAFIACABTAAgAVAAJAFUACQBWAAoAVwAKAFgACwBZAAsAWgAMAFsADABcAA0AXQANAF4ADgBfAA4AYAASAGEAEgBiABMAYwAUAGQAFABlABgAZgAcAGcAHgBoAB4AaQAfAGoAIQBrACMAbAAkAG0AJgBuACYAbwAqAHAAKwBxACwAcgAtAHMAMQB0ADEAdQAyAHYAMgB3ADMAeAAzAHkANAB6ADQAewA1AHwANQB9ADYAfgA2AH8ANwCAADcAgQA4AIIAOQCDADoAhAA6AIUAOwCGADsAhwA8AIgAPACJAD0AigA9AIsAPgCMAD4AjQA/AI4APwCPAEAAkABAAJEAQQCSAEEAkwBBAJQA","o":"111111111111111211111121112111111112112121111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"pe":{"name":"Фосфатидилэтаноламин","el":"C C C C C C C C C C C C C C C C O O C C C O P O O O C C N O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"4vqzACMAavtwABYA3PvWABgAZPyRAAoA1vz2AAwAXv2xAP3/0f0WAQEAWf7RAPL/yv43Afb/U//0AOb/xP9bAer/TQAZAdr/vQCBAdv/RgE/Acn/tgGnAcv/PAJnAa//hAKEAVH/WgILAQ8A1ALCAPn/3AJKAFoALgPY/xwAsgMEAAEAKASa/xkAQgR1/6cApQTj/9X/BwQi/7X/YASz/rf/NQRN/k3/tQMN/m3/VQIaAHAAPgLV/+IAlAK6/zUBrAGx//IAXwGm/24AzACG/4cAfgCC/wMA6f9p/xsAmv9s/5j/Bf9T/7H/tf5a/zL/L/5Q/yz/1f08/6L/Qv0r/3j/6PwX//L/VvwG/8j/+vv3/kIAaPvm/hgADPvd/pIAe/rO/mkA0fr5AND/2/rrAIEAk/ppACIAbfs3ALn/dvspAGgAz/sdAcb/2fsPAXUAcfxJAFsAZ/xYAKz/yfw/Abv/1PwuAWsAa/1nAE4AYf16AJ7/zv1NAWAAw/1fAbH/XP6bAJL/Zv6HAEEAx/5tAVYAvP6BAaf/Yf+qADYAVv++AIf/tf+lAZr/wP+SAUkAXADRACsAUADhAHz/rQDKAYv/uwC4AToAVgH2ABkASAEIAWv/vAHaASsApQHzAX7/1QKeAJL/KgMEAQcACANtALgALwOC/2AAAAO1/7//zAQkABMAxQTW/qD/YASG/hoAKwR+/uz+ggT//UT/vAPd/cf/oAPF/Sj/fwH9/zIBpwFR/yYBjQFY/y8AZgEEADcAoADS/8gAwwAl/7oApgAz/8P/iwDh/87/wf+2/18A2/8I/00AqP/N/2f/wf8f/1T/+P7w/t//3/6e//j/6/5o/9X+AP5Y/8n+9P3j/tn/3f2S/+X/If2E/0D/Of3V/jX/8fxt/zUACP2//ioATPyu/oj/Nvxc/43/BPxP/4IAGvyg/n0ASvs6/9n/XvuL/tz/KfuH/tAAF/s3/9AAWvoj/y0AO/rH/sEAbPpz/i4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAFgAZABkAGgAaABsAGwAcABMAHQAdAB4AHgAfAB4AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgAmACcAJwAoACgAKQApACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAAAAxAAAAMgAAADMAAQA0AAEANQACADYAAgA3AAMAOAADADkABAA6AAQAOwAFADwABQA9AAYAPgAGAD8ABwBAAAcAQQAIAEIACABDAAkARAAJAEUACgBGAAoARwALAEgACwBJAAwASgAMAEsADQBMAA0ATQAOAE4ADgBPABIAUAASAFEAEwBSABQAUwAUAFQAGABVABoAVgAaAFcAGwBYABsAWQAcAFoAHABbACAAXAAgAF0AIQBeACEAXwAiAGAAIgBhACMAYgAjAGMAJABkACQAZQAlAGYAJQBnACYAaAAmAGkAJwBqACgAawApAGwAKQBtACoAbgAqAG8AKwBwACsAcQAsAHIALABzAC0AdAAtAHUALgB2AC4AdwAvAHgALwB5ADAAegAwAHsAMAB8AA==","o":"1111111111111112111111211111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111"}});


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
  // липид вертикально: голова (глицерин, фосфат) вверху, ацильные хвосты вниз; группа-обёртка, чтобы вращать вокруг вертикали
  const fitV = (id, R, o = {}) => { const m = typeof id === 'string' ? MOL(id) : id; const sc = o.scale || molFit(m, R); const g = molMesh(m, { scale: sc, hideH: true, ...o }); const X = (i) => V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2]).multiplyScalar(sc);
    const ax = pcaAxis(Array.from({ length: m.n }, (_, i) => X(i))); const hd = m.el.indexOf('P') >= 0 ? m.el.indexOf('P') : m.el.indexOf('O'); if (X(hd).sub(ax.c).dot(ax.v) < 0) ax.v.negate();
    g.quaternion.setFromUnitVectors(ax.v, V3(0, 1, 0)); g.position.copy(ax.c.clone().applyQuaternion(g.quaternion).negate()); const w = new THREE.Group(); w.add(g); return w; };
  const COL = { acyl: '#E8C060', g3p: '#FF9A30', pa: '#FF8A5C', dag: '#F2C14E', tag: '#E8D27A', pc: '#7FD6FF', pe: '#9FE870', pi: '#C77DFF', ch: '#FF8AB0' };

  /* ---------- 1. сборка ТАГ ---------- */
  const G1 = new THREE.Group(); G1.position.set(0.6, 0, 0); scene.add(G1);
  const ST = [
    { id: 'g3p', x: -3.4, R: 0.55, name: 'глицерол-3-фосфат' }, { id: 'pa', x: -1.0, R: 1.25, name: 'фосфатидная кислота' },
    { id: 'dag', x: 1.4, R: 1.2, name: 'диацилглицерол' }, { id: 'tag', x: 3.8, R: 1.25, name: 'триацилглицерол (жир)' },
  ];
  const Y1 = 1.3;
  ST.forEach((s, i) => { s.g = s.id === 'g3p' ? fit(s.id, s.R) : fitV(s.id, s.R); s.g.position.set(s.x, Y1, 0); G1.add(s.g); s.glow = glowNucleus(G1, V3(s.x, Y1, -0.3), COL[s.id], 0.1, 14); s.glow.core.visible = false; s.glow.spr.material.opacity = 0.08; });
  const ARR1 = [0, 1, 2].map((i) => flowArrow(G1, V3(ST[i].x + (i ? 0.45 : ST[i].R * 0.75), Y1 - 0.15, 0), V3(ST[i + 1].x - 0.45, Y1 - 0.15, 0), '#E8C060', { bend: 0.12 }));
  const ENZ1 = ['ацилтрансферазы (+2 ацил-КоА)', 'фосфатаза (−Pi)', 'ацилтрансфераза (+ацил-КоА)'];
  // ацил-КоА: «хвосты» пальмитата, прилетающие сверху
  const ACYL = []; for (let i = 0; i < 4; i++) { const m = fit('palmitic', 0.75); m.visible = false; G1.add(m); ACYL.push({ m, age: 9, a: V3(0, 0, 0), b: V3(0, 0, 0) }); }
  const piM = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), atomMat('P')); piM.visible = false; G1.add(piM);
  // источники глицерол-3-фосфата
  const SRC = [{ id: 'glucose', x: -4.4, y: -1.2, name: 'глюкоза → ДГАФ' }, { id: 'glycerol', x: -2.3, y: -1.2, name: 'глицерол (только печень)' }];
  SRC.forEach((s) => { s.g = fit(s.id, 0.5); s.g.position.set(s.x, s.y, 0); G1.add(s.g); s.a = flowArrow(G1, V3(s.x, s.y + 0.5, 0), V3(ST[0].x + (s.x < ST[0].x ? -0.25 : 0.25), Y1 - 0.55, 0), COL.g3p, { bend: s.x < ST[0].x ? -0.2 : 0.2 }); });
  // куда идёт жир: ЛПОНП (печень) или капля (жировая ткань)
  const vldl = new THREE.Group(); vldl.position.set(3.8, -1.5, 0); G1.add(vldl);
  vldl.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), protMat(COL.tag, 0.35)));
  { const shell = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 24), glassMat(0x7fd6ff, { rim: 0.6, base: 0.02, pow: 2 })); vldl.add(shell); const apo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 8, 48), protMat('#FF8AB0', 0.6)); apo.rotation.x = 1.1; vldl.add(apo); }
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 24), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.28), roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.4, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.015, envMapIntensity: 0.4 })); drop.position.set(3.8, -1.5, 0); G1.add(drop);
  const aOut = flowArrow(G1, V3(3.8, Y1 - 1.35, 0), V3(3.8, -0.7, 0), COL.tag, { bend: 0 });

  /* ---------- 2. фосфолипиды и печень ---------- */
  const OX2 = 41.3; const G2 = new THREE.Group(); G2.position.set(OX2, 0, 0); scene.add(G2);
  const P2 = { pa: V3(-4.0, 1.9, 0), dag: V3(-1.9, 1.9, 0), pc: V3(0.4, 2.8, 0), pe: V3(0.4, 0.6, 0), cdpdag: V3(-4.0, -0.7, 0), pi: V3(-1.9, -0.7, 0) };
  const n2 = { pa: fitV('pa', 0, { scale: 0.058, bondR: 0.2 }), dag: fitV('dag', 0, { scale: 0.058, bondR: 0.2 }), pc: fitV(lipidMol(68), 0, { scale: 0.058, bondR: 0.2 }), pe: fitV('pe', 0, { scale: 0.058, bondR: 0.2 }), cdpdag: fitV('cdpdag', 0, { scale: 0.058, bondR: 0.2 }), pi: fitV('ptdins', 0, { scale: 0.058, bondR: 0.2 }) }; // ФЭ, ЦДФ-ДАГ и ФИ — свои молекулы (этаноламин, цитидин, инозитол)
  Object.entries(n2).forEach(([k, g]) => { g.position.copy(P2[k]); G2.add(g); });
  const cho = fit('choline', 0.35); cho.position.set(-1.2, 3.05, 0.2); G2.add(cho);
  const A2 = {
    pd: flowArrow(G2, P2.pa.clone().add(V3(0.75, 0, 0)), P2.dag.clone().add(V3(-0.75, 0, 0)), COL.dag, { bend: 0.15 }),
    pc: flowArrow(G2, P2.dag.clone().add(V3(0.6, 0.3, 0)), P2.pc.clone().add(V3(-0.75, -0.1, 0)), COL.pc, { bend: 0.15 }),
    pe: flowArrow(G2, P2.dag.clone().add(V3(0.6, -0.3, 0)), P2.pe.clone().add(V3(-0.75, 0.1, 0)), COL.pe, { bend: -0.15 }),
    meth: flowArrow(G2, P2.pe.clone().add(V3(0.55, 0.45, 0)), P2.pc.clone().add(V3(0.55, -0.5, 0)), '#FF8AB0', { bend: -0.35 }),
    cdp: flowArrow(G2, P2.pa.clone().add(V3(0, -0.85, 0)), P2.cdpdag.clone().add(V3(0, 0.95, 0)), '#C8A0FF', { bend: 0.15 }),
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
  const adiMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(COL.tag).multiplyScalar(0.26), roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.45, emissive: new THREE.Color(COL.tag), emissiveIntensity: 0.012, envMapIntensity: 0.35 });
  const cytMat = glassMat(0xffd8a0, { rim: 0.6, base: 0.015, pow: 2.4, keep: true });
  function addAdipocyte(p, born = 0) { const g = new THREE.Group(); g.position.copy(p); const d = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), adiMat); const sh = new THREE.Mesh(new THREE.SphereGeometry(1.06, 32, 24), cytMat); const nu = new THREE.Mesh(ell3(0.18, 0.1, 0.14), protMat('#9F7BFF', 0.4)); g.add(d, sh, nu); G3.add(g); const a = { g, d, sh, nu, born, dir: randUnit() }; ADI.push(a); return a; }
  [[-1.6, 0.6], [0.2, 1.0], [1.9, 0.4], [-0.8, -0.9], [1.0, -0.9], [-2.6, -0.6], [2.8, -0.8]].forEach(([x, y]) => addAdipocyte(V3(x, y, rand(-0.3, 0.3))));
  const SPARE = [[-3.4, 1.0], [3.4, 1.2], [0.0, -2.1], [-1.9, -2.0], [2.2, -2.0], [-0.6, 2.3]];
  const CAP3 = new THREE.CatmullRomCurve3([V3(-3.6, 0.2, 0.75), V3(-1.2, -0.05, 0.95), V3(1.3, 0.0, 0.9), V3(4.2, 0.25, 0.75)]); // капилляр в щели между клетками
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
      SRC[1].g.visible = SRC[1].a.mesh.visible = SRC[1].a.cone.visible = st.tissue === 'liver';
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
      const R = clamp(0.84 * Math.cbrt(st.fatKg / 15) / Math.cbrt(ADI.length / 7), 0.35, 1.25);
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
    if (st.mode === 'pl') { scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'печень: жир и выход ЛПОНП', x0: 10 });
      [['жир в печени', st.liverFat, '#E8D27A'], ['выход ЛПОНП', st.vldlOut, '#7FD6FF']].forEach(([n, v, c], i) => { const y = 30 + i * 30; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(110, y, (w - 140) * clamp(v, 0, 1), 12); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 12, y + 10); }); return; }
    if (st.mode !== 'fat') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'индекс массы тела', xl: 'ИМТ 15 → 45', x0: 10 });
    const zones = [[15, 18.5, 'rgba(127,214,255,.15)'], [18.5, 25, 'rgba(127,224,160,.18)'], [25, 30, 'rgba(242,193,78,.18)'], [30, 45, 'rgba(255,106,90,.18)']];
    zones.forEach(([a, b, c]) => { ctx.fillStyle = c; ctx.fillRect(A.X((a - 15) / 30), A.Y(1), A.X((b - 15) / 30) - A.X((a - 15) / 30), A.Y(0) - A.Y(1)); });
    const x = A.X(clamp((bmi() - 15) / 30, 0, 1)); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, A.Y(0)); ctx.lineTo(x, A.Y(1)); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; [['дефицит', 15.5], ['норма', 19.5], ['избыток', 25.5], ['ожирение', 33]].forEach(([n, v]) => { ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.fillText(n, A.X((v - 15) / 30), A.Y(0.85)); });
  }
  const TXT = {
    tag: '<b>Синтез триацилглицеролов</b> (жиров) идёт в печени, жировой ткани и стенке кишки. Основа — <b>глицерол-3-фосфат</b>: в жировой ткани он получается только из глюкозы (через дигидроксиацетонфосфат), а в печени ещё и из глицерина (глицеролкиназа). К нему по очереди пришиваются два остатка жирных кислот в виде <b>ацил-КоА</b> → <b>фосфатидная кислота</b>; фосфатаза снимает фосфат → <b>диацилглицерол</b>; третий ацил-КоА → <b>триацилглицерол</b>. Печень упаковывает жир в <b>ЛПОНП</b> и отправляет в кровь, жировая ткань хранит его в капле. Синтез включает <b>инсулин</b>.',
    pl: '<b>Фосфолипиды</b> строятся из тех же предшественников. <b>Диацилглицерол</b> + ЦДФ-холин → <b>фосфатидилхолин</b> (лецитин), + ЦДФ-этаноламин → <b>фосфатидилэтаноламин</b>; в печени ФЭ может превратиться в ФХ, получив три метильные группы от S-аденозилметионина. Из фосфатидной кислоты через ЦДФ-диацилглицерол получаются <b>фосфатидилинозитол</b> (источник сигнальных ИФ₃ и ДАГ) и кардиолипин. Фосфатидилхолин нужен печени, чтобы собрать оболочку ЛПОНП и вывести жир. Поэтому холин, метионин, витамины B12 и фолат называют <b>липотропными факторами</b>.',
    fat: '<b>Жировая ткань</b> — главное хранилище энергии: в 1 кг жира около 7700 ккал. После еды <b>инсулин</b> включает липопротеинлипазу капилляров (жирные кислоты из ЛПОНП и хиломикронов уходят в клетки) и синтез жира; при голоде и нагрузке <b>адреналин</b> и глюкагон запускают липолиз. Если долго есть больше, чем тратить, адипоциты растут (гипертрофия), а затем появляются новые (гиперплазия). Перегруженные клетки воспаляются: в ткань приходят макрофаги (фиолетовые), выделяются воспалительные цитокины, развивается <b>инсулинорезистентность</b>. Двигайте баланс калорий.',
  };
  const labels = [
    ...ST.map((s) => ({ text: s.name, pos: V3(s.x + 0.6 - Math.min(1.0, s.name.length * 0.05), Y1 + s.R + 0.2, 0), color: COL[s.id], show: () => st.labels && st.mode === 'tag' })),
    ...ENZ1.map((n, i) => ({ text: n, pos: [V3(-2.35, Y1 - 1.55, 0.3), V3(0.85, Y1 - 1.95, 0.3), V3(4.8, Y1 - 0.6, 0.3)][i], color: '#C8C8D0', show: () => st.labels && st.mode === 'tag' })),
    { text: 'ацил-КоА', pos: V3(-0.9 + 0.6, Y1 + 2.0, 0.4), color: COL.acyl, show: () => st.labels && st.mode === 'tag' && st.cyc > 0.8 && st.cyc < 2.4 },
    { text: 'глюкоза → ДГАФ', pos: V3(-4.4 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' },
    { text: 'глицерол (печень)', pos: V3(-2.3 + 0.6, -1.85, 0.2), color: COL.g3p, show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'ЛПОНП → кровь', pos: V3(3.8 + 1.4, -1.2, 0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'tag' && st.tissue === 'liver' },
    { text: 'жировая капля', pos: V3(3.8 + 1.5, -1.2, 0.2), color: COL.tag, show: () => st.labels && st.mode === 'tag' && st.tissue === 'adipose' },
    { text: 'фосфатидная кислота', pos: P2.pa.clone().add(V3(OX2 - 0.5, 0.75, 0)), color: COL.pa, show: () => st.labels && st.mode === 'pl' },
    { text: 'ДАГ', pos: P2.dag.clone().add(V3(OX2 - 0.1, 0.75, 0)), color: COL.dag, show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилхолин', pos: P2.pc.clone().add(V3(OX2 + 0.2, 0.75, 0)), color: COL.pc, show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилэтаноламин', pos: P2.pe.clone().add(V3(OX2 + 0.2, -0.8, 0)), color: COL.pe, show: () => st.labels && st.mode === 'pl' },
    { text: 'ЦДФ-ДАГ', pos: P2.cdpdag.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: '#C8A0FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'фосфатидилинозитол', pos: P2.pi.clone().add(V3(OX2 - 0.3, -0.75, 0)), color: COL.pi, show: () => st.labels && st.mode === 'pl' },
    { text: 'холин', pos: V3(OX2 - 1.2 + 0.4, 3.65, 0.2), color: COL.ch, show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: '3 SAM', pos: P2.pe.clone().lerp(P2.pc, 0.5).add(V3(OX2 + 1.15, 0, 0.2)), color: '#FF8AB0', show: () => st.labels && st.mode === 'pl' && st.lipo },
    { text: 'гепатоцит', pos: HEP.clone().add(V3(OX2 + 0.2, 1.75, 0)), color: '#E08060', show: () => st.labels && st.mode === 'pl' },
    { text: 'ЛПОНП → кровь', pos: HEP.clone().add(V3(OX2 + 1.8, -0.15, 0.4)), color: '#7FD6FF', show: () => st.labels && st.mode === 'pl' },
    { text: 'адипоциты', pos: V3(80 + 0.6, 2.6, 0.5), color: COL.tag, show: () => st.labels && st.mode === 'fat' },
    { text: 'капилляр', pos: V3(80.7 + 3.3, 0.55, 0.9), color: '#E06A6A', show: () => st.labels && st.mode === 'fat' },
    { text: 'макрофаги', pos: V3(80 + 3.4, -1.9, 0.8), color: '#C77DFF', show: () => st.labels && st.mode === 'fat' && bmi() > 31 },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'tag', label: 'Синтез жира' }, { id: 'pl', label: 'Фосфолипиды и печень' }, { id: 'fat', label: 'Жировая ткань' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'tag') box.append(h('div', { class: 'glabel' }, 'Где идёт синтез'), h('div', { class: 'gctl' }, seg([{ id: 'adipose', label: 'Жировая ткань' }, { id: 'liver', label: 'Печень' }], () => st.tissue, (v) => { st.tissue = v; })));
      else if (st.mode === 'pl') box.append(h('div', { class: 'glabel' }, 'Опыт'), h('div', { class: 'gctl' },
        toggle('Холин и метионин', () => st.lipo, (v) => { st.lipo = v; st.msg = v ? null : '<b>Дефицит липотропных факторов.</b> Без холина (и метионина как донора метильных групп) печень не может сделать достаточно фосфатидилхолина для оболочек ЛПОНП. Жир продолжает синтезироваться, но не выводится — развивается <b>жировая дистрофия печени</b> (капли растут). Так бывает при белковом голодании, у животных на безхолиновой диете.'; refs.setInfo(); }),
        toggle('Алкоголь', () => st.alc, (v) => { st.alc = v; st.msg = v ? '<b>Алкоголь</b> перегружает печень НАДН: тормозится β-окисление и усиливается синтез глицерол-3-фосфата и жира. Печень наполняется жиром даже при нормальном питании — первая стадия алкогольной болезни печени (обратимая при отказе от спиртного).' : null; refs.setInfo(); }),
        button('Сброс', () => { st.liverFat = 0.15; })));
      else box.append(h('div', { class: 'glabel' }, 'Баланс калорий в день'), h('div', { class: 'gctl' }, range('lgBal', -600, 600, 10, () => st.bal, (v) => { st.bal = v; }, (v) => (v > 0 ? '+' : '') + v + ' ккал'), toggle('Идут годы', () => st.run, (v) => { st.run = v; })),
        h('div', { class: 'gctl', style: 'margin-top:6px' }, button('Поесть (инсулин)', () => { st.hormone = 'ins'; st.hT = st.t; st.msg = '<b>После еды</b> инсулин включает липопротеинлипазу на стенке капилляров: она расщепляет жиры ЛПОНП и хиломикронов, жирные кислоты (жёлтые) уходят в адипоциты и снова собираются в ТАГ. Одновременно инсулин тормозит липолиз.'; refs.setInfo(); }), button('Голод, нагрузка (адреналин)', () => { st.hormone = 'adr'; st.hT = st.t; st.msg = '<b>Голод, холод, нагрузка, стресс:</b> адреналин и глюкагон через цАМФ включают гормон-чувствительную липазу. Жиры распадаются до жирных кислот (оранжевые) и глицерина и уходят в кровь — топливо для мышц и сердца.'; refs.setInfo(); }), button('Сброс', () => { st.fatKg = 15; st.years = 0; st.bal = 0; while (ADI.length > 7) { const a = ADI.pop(); G3.remove(a.g); } refs.rebuild(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['tag', 'pl', 'fat'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'fat') { const b = bmi(); return [['ИМТ', b.toFixed(1), ''], ['Жир', Math.round(st.fatKg), 'кг'], ['Лептин', Math.round(st.fatKg * 0.6), 'нг/мл'], ['Прошло', Math.floor(st.years), 'лет']]; }
    if (st.mode === 'pl') return [['Жир в печени', Math.round(st.liverFat * 30), '%'], ['Выход ЛПОНП', Math.round(st.vldlOut * 100), '%']];
    return [['Собрано молекул жира', st.made, ''], ['Ацил-КоА на молекулу', 3, '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E8C060',
    kicker: 'Биохимия · обмен липидов', title: 'Синтез жиров и ожирение',
    lede: 'Как из глюкозы и жирных кислот собирается жир и фосфолипиды мембран, почему печень может «ожиреть» и что происходит с жировой тканью, когда калорий слишком много.',
    notes: `
      <div><h2>Липогенез</h2>
        <p>Жирные кислоты для жира берутся из пищи или синтезируются из ацетил-КоА (избыток углеводов) в печени и жировой ткани. Синтез включают инсулин и избыток глюкозы, тормозят глюкагон и адреналин.</p>
        <h3>Ожирение</h3><p>Индекс массы тела = масса (кг) / рост² (м²): 18,5–25 — норма, 25–30 — избыточная масса, ≥ 30 — ожирение. Важна и локализация жира: висцеральный (вокруг органов) опаснее подкожного. Жировая ткань — эндокринный орган: <b>лептин</b> сообщает мозгу о запасах (при ожирении его много, но мозг становится к нему нечувствителен), <b>адипонектин</b> повышает чувствительность к инсулину (при ожирении его мало).</p>
        <h3>Жировая печень</h3><p>Неалкогольная жировая болезнь печени — самое частое заболевание печени в мире; связана с ожирением и инсулинорезистентностью.</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы — по формулам; фосфатидилхолин — из реального бислоя (молекулярная динамика), остальные фосфолипиды показаны условно окрашенными.</li><li>Модель массы тела упрощена: 7700 ккал на кг жира, без адаптации обмена.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('tag'); st.fly = null;
  return self;
}
export { makeLipogen };
