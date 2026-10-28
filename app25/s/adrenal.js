import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, ell3, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, randUnit, rnd, scopeShow, seg, toggle } from '../core.js';
import { BIO_MOL, MOL, PDB, bioStage, cartoon, flowArrow, molFit, molGlow, molMesh, plotAxes, protMat } from './kit.js';
Object.assign(BIO_MOL, {"cholesterol":{"name":"Холестерин","el":"C C C C C C C C C C C C C C C C C C C C C C C C C O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Sf6hAEP/m/5aAK//Uv5eADMA7/3t/y8AIv6B/44ABv74/lQAb/3l/jwAUf7d/tL/HP+mALL/J/8fAQ4Arv8OAVoA/f+yAP7/kv9LAM7/zP8IAFL/UgDE/3L/tgAZAMD/eABtADIA4ADWAF8AaQGXAHgAiwEfAEkALQHI//T/dwGN/3v/+gFJ/6T/WAKr/+v/FwLo/2gAzwJl/xIA/QBU/0wAeP/m/zwAfP6bAOT+PP4KAV//5/1xADv/qv7y/4//HP6+ADoAlv5YAIcA5P3H/8r/jP0PAFEA7P2L/+0AjP6M/6IAJf6t/p4ATv2L/m8AOf07/2QAXP3c/tL/U/5x/sD/IP4N/37/uP4A/9r/LP/PAEv/Mv95AdD/2f4vAVYAmv/fALoA3f9vAWUAGADsAKT/3f9TAAT/h/+9/y3/gQCn/xL/OwBn/6f/3wBjAHj/ZQAuAIgA6QAiARAAvQAGAbsAsgHOALQANwFE/0r/jgHe/zX/LAIi/0z/4wH2/uj/cwL7/6b/VgI6AI0ADwKb/7UAxAJE/2wAOwFP/6YABgH3/hUAlQBk/2kAKv+h/x0A0f+p/1AAXP8YAJgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEACAAIAAkACQAKAAoACwALAAwACAAMAAwADQANAA4ADgAPAA8AEAALABAAEAARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABYAFwAXABgAEwAYABcAGQAUABoADAAbAAAAHAAAAB0AAAAeAAEAHwACACAAAgAhAAMAIgADACMABAAkAAQAJQAFACYABgAnAAYAKAAGACkABwAqAAcAKwAHACwACAAtAAkALgAJAC8ACgAwAAoAMQALADIADQAzAA0ANAAOADUADgA2AA8ANwAQADgAEQA5ABEAOgASADsAFQA8ABUAPQAWAD4AFgA/ABcAQAAYAEEAGABCABkAQwAaAEQAGgBFABoARgAbAEcAGwBIABsASQA=","o":"11111111111111111111211111111111111111111111111111111111111111111111111111111"},"cortisol":{"name":"Кортизол","el":"C C C C C O C C C C C C C O C C C C C C C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"AP/D/0n/A//f/+D/vf5u/ywAJv5n/xUA5P3w/yUAbf34/0EAOP5tABAAuv5mAPH/Bf/qAN7/l//lAAgA3v9jAN3/kv/q/xcA3/9p/ycA2f8J/7//dgB4/0wAugDn/wAAwQDL/2r/agBqABgAxQDYAOT/VQGiAPv/RgESADAASwEZAL4AswG1////qAE7/xEAMQLk/7b/gAI1AA0AZv+6/yT/z/4WABb/yv5n/zb/5/4N/xAAzv59/5cA+v0h/1wAE/5C/7D/Cv7QABwA0v43ARgA//4GAXT/zf85Adz/nv/sAHUA4P9eAHH/gP8LAIIAs/82/4EAqf+6/t7/pgAY/zYAeQCI/7gA+QBv/1n/8wAdADX/XQC//0H/YAB2AIUAtgDnAHn/uAA0ARsAhgHfAEUAiQGlAJz/JwFuANsAbAKM/5r/FwIbAFz/RgJgAE4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADAAOAA4ADwAPABAADwARAAoAEQARABIAEgATABMAFAAPABQAFAAVABQAFgAWABcAFgAYABgAGQAAABoAAAAbAAAAHAACAB0AAgAeAAMAHwADACAABgAhAAgAIgAIACMACQAkAAkAJQAKACYACwAnAAwAKAANACkADgAqAA4AKwAQACwAEAAtABAALgARAC8AEgAwABIAMQATADIAEwAzABUANAAYADUAGAA2ABkANwA=","o":"11112121111111111111111111211111111111111111111111111111111"},"aldosterone":{"name":"Альдостерон","el":"C C C C C O C C C C C C C O C C C O C C C C C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"9P6t/z3/EP/S/8//4/5d/ygATP5L/zIAA/7Q/0sAlP3Q/34AR/5SACMAwf5TAOv//P7cAMb/kv/lAOD/3f9pAKr/pf/q/+v/AgB0/9L/IwBk/0n/igCK/xoAsAAcAC8AjABHAL0AsACxAOwAcQB9AMv/yQB3AE3/TAE0AHn/RwEuABMAoAHC/0wAmAGg/8IACwJ7//j/cALX/9L/Rf/U//7+lv7a/x7/7/5B/zT/DP9r/4wAC/8A//7/Nf4G/4QAJ/4f/9X/FP6xADQAyf4pAQEA6f7uAFz/pP/sAEsAu/89Aa//z/9jAD//qv/9/1kA2f8X//j/GAAG/zD/hQBX/3sA1QBY/9z/UAAEAPsAfADjAPT/3gDcACv/mgA9AP/+oQFwAFr/UAHQ/0//ZgGQADgAOAIs/zQA3gFO/5//UwIxAOf/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADAAOAA4ADwAPABAAEAARAA8AEgAKABIAEgATABMAFAAUABUADwAVABUAFgAWABcAFgAYABgAGQAAABoAAAAbAAAAHAACAB0AAgAeAAMAHwADACAABgAhAAgAIgAIACMACQAkAAkAJQAKACYACwAnAAwAKAANACkADgAqAA4AKwAQACwAEgAtABMALgATAC8AFAAwABQAMQAVADIAGAAzABgANAAZADUA","o":"111121211111111111211111112111111111111111111111111111111"},"tag":{"name":"Триацилглицерин","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Ov+e/EIBFP90/LUANf/e/EsAy//2/DsA5/9Z/cn/fAB2/bv/lwDd/U7/LQH8/UP/TgFl/tj+GgHx/vv+SwFa/5f+FwHk/73+SQFRAF7+EwHaAIn+RgFMATL+CwHSAVr+7gAqAgr+AAHdAeH+zQBbAhH/wQBRAqr/hQDRAuX/+v/YAsP/uP8/A/7/6/+WA0MAJP81A+P/1v4PA2EA7P59AogAn/5ZAgcBuf7KATgBff5fAd0AnP7SABEBZv5nALEAhf7a/+MAVv5x/34Acv7j/rAARf52/k4Al/51/sz/bP4B/nH/vP4B/vD+RQE5At7/SQH3AVUA5wDgAZsA1wHOAXQA4AFdAdsApAHaAKkAugFpAA4BbAHr/+cAiQF4/0cBNwH6/ikBpQAK/0sBOwD9/vsAOgDb/mgA6f8+/xQAJwDK/xEA1v8oALb/FwCyAK3/0P8OAUr/TP9FAYD/Dv+pASD/pv+n/E4BF/9T/IoBDP/+/FwBqP5h/LIARv8W/JwAA/88/WUAC/+9/Ov/9f8e/ZgA/v+Y/CYAsf+3/dz/wP8x/Wv/sgAZ/aT/pACa/RsAXwA4/mT/cwC4/e3+YwGg/Sv/UwEf/qT/JgFF/nf+uwFp/s7+rADx/vv+OwEM/2D/uQFb/5b+KgFA/zL+qQDj/7v+NQH8/yP/KgE7APf9twFTAF/+LwHrAPL+pgDYAIb+KwE5Acr9swFUATn+awBuAuP+FAGpAvX+gAD7AcD/kADQAlIAugApA77/A/+YA7//EP/uApH/8/5RA7QAa/4fA04AzP48AjYAV/9qApkAvP6eAlcBM/5nAvcAjv6/AZ0BJf+6AUIBpf5pAXgAEf5tAdcACf/GABsBcP7FAHQBkf51AE4A+f1zAKcAVP7K/0QB8f7P//MAif6C/x8A6v18/2wAPf7T/g8B3f7X/sYAT/4V/n8A2/2D/jcAAf9r/uT/iv7T/pb/e/6i/aX/Av4K/ln/J//3/QP/nv6t/bH+rP5d/rf+CAKuARgACwInApoArQF8ATgBSgJOAfQA0QG+AEkAOAHmAJcAJQJSABUBmQGKAHIBAQECAOcAhgHN/4EAdwGY/68B9AFe/0EBRgHd/sAAXgGn/mYBkgAi/7QB2P8L/ycBnwDS/j8ACwB4/l4A4/8X/67/g/9E/zoAjgDE/+3/KQD1/3YAcP8wAN3/z//8/1L/fwCmAI3/GwDgABEAEgBiATT/v//aAOz+Bf/0AJL/Xv93AeD/UP/+AQ//+f56Ab/+r/7OAUj/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"progesterone":{"name":"Прогестерон","el":"C C O C C C C C C C C C C O C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"pv0VAMf/J/5OAAUAMf7IAAoAlP71/zwAhf5i/w4AFP8p/wMAb/+a/zEA+/+f//f/SAAh/yQA1QAf/+j/HQGm//H/ogGj/wAA8wEkAAkAbAIhABYAqgGrAAMAGQGdADEAzwAqAOr/vwBOAFb/RQAbACwA9f+dACYAYv+QAFIAIP8bAAsAIP8uAHT/j/21//b/tf0GAFz/VP1aANj/k/72/6kATf4q/1cAWP5d/6z/Hf/T/kUAKP8O/5z/df+Y/54A+v+g/4v/TwAh/5EAEQDJ/gQAzgAC/3//EQHU/hwA1gFD/wQA3QHzAEMArAHPAJz/5gD7ABsAFwGLAJwA+QAJABn/VgBJADn/5AC0AEb/WQAHAJgA9v/HAML/JADmAGkALv/sADoAX/+AAL4Ahf9BAFD/4f6DAFn/+f7V/0P/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAAwADgAOAA8ADwAQAAoAEAAQABEAEAASAAcAEgASABMAEwAUABQAFQADABUABgAVABUAFgAAABcAAAAYAAAAGQADABoABAAbAAQAHAAFAB0ABQAeAAYAHwAHACAACAAhAAgAIgAJACMACQAkAAsAJQAOACYADgAnAA8AKAAPACkAEQAqABEAKwARACwAEgAtABMALgATAC8AFAAwABQAMQAWADIAFgAzABYANAA=","o":"12111111112121111111111111111111111111111111111111111111"},"testosterone":{"name":"Тестостерон","el":"C C C C C C C C C C C O C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"7v5NAG3/7/46AAQAOv+rAEgAzf+tABkAFAAnACUAwv+v//H/BgAs/yEAkQAg/+L/5ACg//D/aAGS/wMAwwELABMAOwL9/yQAhQGXAAwA8gCUADYAoQAqAOn/nQBVAFb/Nv+0/ykA0v5L//r/SP6L/xUAYf4fADcAAf5wAPj/U/9QAEb/vv6tAFT/tv78/z7/DP8LAS8AOP+eALUAz//RALP/AAD3AFkAIgAUAJIAwv+t/4X/DgAv/40AyP/Y/gMAhgAI/3j/xgDO/hMAkgEt/wgAvAHaAE8AjQG9AKb/6wCAAKAAyAD3ACAA/wBDACn/UgAcACD/hgC/AFD/Ov+x/5cA3P7w/jQA3f44/5D/C/6E/7z/Gf5a/2oAXv4sAKMAqP1NAAcA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwAKAAwADAANAA0ADgAEAA4ACAAOAA4ADwAFABAAAQAQABAAEQARABIAEgATAAEAEwATABQAAAAVAAAAFgAAABcAAgAYAAIAGQADABoAAwAbAAQAHAAFAB0ABgAeAAYAHwAHACAABwAhAAkAIgAMACMADAAkAA0AJQANACYADwAnAA8AKAAPACkAEAAqABEAKwARACwAEgAtABIALgATAC8AFAAwAA==","o":"1111111121211111111111111111111111111111111111111111"},"glu":{"name":"Глутамат","el":"N C C C C O O C O O H H H H H H H H H","xyz":"1gCAAMP/iABIADEAAgCQADwAqv90AMP/Tf///+P/Vf+X/6P/7f4KAEsAegCy/x8AWABr/30AlAB2/6D/7QDhANf/LAFLALj/wQBaAI4Az/9vAJcAFAD8AEQAbv/NAK3/5v9cAGz/Af/Y/5wAdgCo/1P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAYAEQAJABIA","o":"111121121111111111"},"pregnenolone":{"name":"Прегненолон","el":"C C O C C C C C C C C C C O C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"3v0xAID/Jf5LAAUAAf6tAEYAkv7y/zwAg/5e/xYAEv8n/wEAbv+X/y8A+f+d//X/SAAg/yAA3wAx/wwAGgGm//T/sgGp/+H/8gEhACgAegItAP//qAGjAAYAFQGcADEAywApAOr/vQBNAFb/QQAbACwA8f+cACUAXv+OAFEAHf8YAAoAHf8sAHP/IP75/z7/xv2RAFH/g/35/5H/kv74/6oAS/5Q/7v/Vf4n/2kAIP/O/j0AIP8S/5f/dP+V/5wA+P+g/4n/NAAN/4oAJQDL/ub/HgHX/hIAyQGu/3f/3QFN/woA7wERAJQAtAIlAEwArQG0AJv/2AH2ADoA5AD6ABgAEAGMAJ0A4wCyAEX/VABJADj/9wAGABr/VAAGAJcA8v/GAMD/IADmAGcAKv/qADcAW/9/AL0Agf9AAE7/9P7U/0L/3v6CAFr/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAAwADgAOAA8ADwAQAAoAEAAQABEAEAASAAcAEgASABMAEwAUABQAFQADABUABgAVABUAFgAAABcAAAAYAAAAGQADABoABAAbAAQAHAAFAB0ABQAeAAYAHwAHACAACAAhAAgAIgAJACMACwAkAAsAJQAMACYADQAnAA4AKAAOACkADwAqAA8AKwARACwAEQAtABEALgASAC8AEwAwABMAMQAUADIAFAAzABYANAAWADUAFgA2AA==","o":"1211111112111111111111111111111111111111111111111111111111"},"dhea":{"name":"ДГЭА","el":"C C C C C C C C C C C O C C C C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"/f6z/6kA8/7F/xIAN/9T/8n/z/9U/+H/EgDc/9H/xv9QABUAAwDXAO7/mgDSANb/4wBiAN3/egFqAMH/yAHw//L/5AH+/30AhgFp/9n/8QBs/7f/pADb/wAArADE/5cANf9LAOf/1P60ABoASf5zAAgAYf7e/+7/Ef6P/8b/nf6Q/9AASf9o/8IAFv8RANkAD//z/uz/Jf9b/13//P8P/5j/4/8q/0QAEwDz/2b/zf9GAIEA0v/7AJT/7/8fAT8AzQAwAbz/iQF1AFX/ogHDAPL/KQLw/73/MAI7AIcAkwEr/zIAuwE3/4b/xgAK/9L/5QB6/0v/0wAfAMYASwCt/8AA8ABy/6wANP9MAHn/5f7KAIMA2v4OAd7/EP6BAGMAF/6hALP/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwAKAAwADAANAA0ADgAEAA4ACAAOAA4ADwAFABAAAQAQABAAEQARABIAEgATAAEAEwATABQAAAAVAAAAFgAAABcAAgAYAAIAGQADABoAAwAbAAQAHAAFAB0ABgAeAAYAHwAHACAACQAhAAkAIgAKACMACwAkAAwAJQAMACYADQAnAA0AKAAPACkADwAqAA8AKwAQACwAEQAtABEALgASAC8AEgAwAA==","o":"1111111211111111111111121111111111111111111111111111"},"mifepristone":{"name":"Мифепристон","el":"C C C C C C C C C C C C C C C O C C C C C C C C C C C N C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"OP7ZAL3+ev7BAEX/nv6aALL/r/7SAFQAI/6gAFYAX/4DAEIA/P4GADoAPP+eAEwAq/99AK4ADwAQAH0A2f+e/ycAHgAq/xkApAAX/18A7QCT/k8ArAAr/vX/4wC//eT/JgBF/rH/5v+5/sL/X//K/nr/B/8q/8z/Uf+v/9//jgBRAEcAqABUAMT/JAGTAJL/egHMAOf/XQHJAHcA7QCPAKUA9QELAbf/FgIQASn/UgJIARYAif/fANr/rP6LAOIA/v2BAKD+hf7sAHL+9v0wAcT+5f2WAK4A2/2rAAcAOf7J/5YAK/7V/+//Gf/P/5kAkv9YABIB5//YAMMALwDf/90AlgAq/8sA6gBk/zoAUgGo/icA+wBn/rMA+f/4/XL/Lv9q/nL/cP/0/hf/qv48/5f/8/7+/i0AYf/b/37/YwAnAHz/NQGTACb/ogH2AL8A2ACNABABfwIoAR3/2QFdAfj+AQKvAPv+gwL5AFAAHAKKAVkAngKBAd//7P8EAfz/Wv8+Abv/mv+gAIT/zv7VABcB","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAMABwAHAAgACAAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA4AEAAQABEACwARABEAEgASABMAEwAUAAYAFAAKABQACQAVABUAFgAWABcAFwAYABgAGQAZABoAFQAaABgAGwAbABwAGwAdAAcAHgADAB8AAAAgAAAAIQAAACIABAAjAAQAJAAFACUABQAmAAYAJwAIACgACAApAAkAKgAMACsADAAsAA0ALQANAC4AEAAvABIAMAASADEAEwAyABMAMwAUADQAFgA1ABcANgAZADcAGgA4ABwAOQAcADoAHAA7AB0APAAdAD0AHQA+AB4APwAeAEAAHgBBAB8AQgA=","o":"13111111111211121211111112121211111111111111111111111111111111111111111"},"corticosterone":{"name":"Кортикостерон","el":"C C C C C O C C C C C C C C C C C C C C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"A////7wAGP8ZACcA3v6hAAIARf6nAAsABf4xAMH/k/06AJf/Vf6w/63/0v6l/9v/If8k/8b/mP8T/yQA7v+R/zoAq/8PAP7//v+NAA0AkQB8AOH/0gD9/xIAdACC//b/zgAN/xkAWwE6/+n/SwHO/7//ywEbANX/NwLi/8j/zgGwAPv/qAH+AIv/9gAAAKUA+//CAJAAXf8SAPUAtP5AAOIA5f6X/8oAB//tAEQA/P66AJv/I/4EAdz/Jv6nAHIAJ/5c/3j/Rf8i/1//3f7P/tT/2P/D/v3/c//y/oYA+P+g/6UAqf/6/4//1P/aAMn/kwB/AHP/yADTAAcAZQCC/4n/0QD8/oQAsQC0/uP/eAH//pT/oAEy/zsALwHQ/1X/NALLABgAiwHCAE4AYgE8AaX/XwHn/7YA5QBkAM4AvAC4/94ACAAiAY0A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADQAOAA4ADwAKAA8ADwAQABAAEQARABIADgASABIAEwATABQAEwAVABUAFgAOABcADAAYAAAAGQAAABoAAAAbAAIAHAACAB0AAwAeAAMAHwAGACAACAAhAAgAIgAJACMACQAkAAoAJQALACYADAAnAA0AKAANACkADwAqABAAKwAQACwAEQAtABEALgASAC8AFQAwABUAMQAWADIAFwAzABcANAAXADUAGAA2AA==","o":"1111212111111111111111121111111111111111111111111111111111"},"deoxycortisol":{"name":"11-Дезоксикортизол","el":"C C C C C O C C C C C C C C C C C C C C O C O O C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"D/9cAKsABf8uABkAv/6dAMr/Lf6wAPT/4v0rAPL/af0oAOL/Mf6p/wQAtv6r/xYA/P4j/ygAh/8h/+j/1/+d/xMAkf8bANz/5P+bAOL/dwCJALb/twATAPz/YwCU/9n/ugAh/wgATAFV//7/QgHo/87/sQE+AAYAqQG5AP7/LgIDAEgAngJWADIASgHo/0D/twAnAJMArf5TANoAV/8fAOEALv/FAK0A8/78ANv/w/6FAF///P32ALD/Kv7ZAFkA/P1J/wMABf8O/5MAvv7W/vr/vP/I/gkAfv8g/3z/2v+f/38AgP8GAHD/5P/FAEYAuP/lAJ3/dwB7AEn/rQDlAM7/WwCQ/2v/pQAH/28ArwDK/sf/eAFP/2AAggEa/7X/HAL6/7QAQgKg/x8AxQJwAIcAQAFDACD/UwA9ALgA3ADO/8YA9gB8AK4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADQAOAA4ADwAKAA8ADwAQABAAEQARABIADgASABIAEwATABQAEwAVABUAFgASABcADgAYAAAAGQAAABoAAAAbAAIAHAACAB0AAwAeAAMAHwAGACAACAAhAAgAIgAJACMACQAkAAoAJQALACYADAAnAAwAKAANACkADQAqAA8AKwAQACwAEAAtABEALgARAC8AFQAwABUAMQAWADIAFwAzABgANAAYADUAGAA2AA==","o":"1111212111111111111111121111111111111111111111111111111111"},"ohprog":{"name":"17α-Гидроксипрогестерон","el":"C C O C C C C C C C C C C C C C C O C C C C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"u/0YAKj/N/5PAO//Qf7JAPj/of71/yoAlP5j//r/JP8q//L/fv+a/yUAL/8bAAAAcP+PAEkABACdACAAVAAbACcACwCf/+//VwAh/x4A5QAf/+X/LQGm//D/sgGj/wIAAwIkAA4AewIgAB4AugGrAAcAJwGcADEA3wAqAOj/0wBQAFT/NP8xAGn/lf70/7gA0P0OAD3/Z/1dALb/of23/9H/av5e/5b/Wv4p/0EAK//S/jIAO/8R/4v/gv+V/5IAbv+AALUAPf/sADEABwDIALz/MgDlAGUAZQAGAJIADQCg/4P/IQDJ/vz/WwAh/4sAHwHT/hoA4AAD/3v/5QFD/wcA6wHyAEkAvgHQAKD/9QD7ABsAIwGKAJ0A+AC1AEb/DgELABj/awBLADX/mv9CAEf/+f6JAE7/C//a/zX/Qv7I/9EA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAMABwAHAAgACAAJAAkACgAKAAsABgALAAsADAAMAA0ADQAOAA4ADwAPABAAEAARABAAEgASABMAEwAUAAoAFAAOABQAFAAVAAcAFgADABcAAAAYAAAAGQAAABoABAAbAAQAHAAFAB0ABQAeAAYAHwAIACAACAAhAAkAIgAJACMACgAkAAsAJQAMACYADAAnAA0AKAANACkADwAqABIAKwASACwAEwAtABMALgAVAC8AFQAwABUAMQAWADIAFgAzABYANAAXADUA","o":"121111111111111121211111111111111111111111111111111111111"},"androstenedione":{"name":"Андростендион","el":"C C C C C C C C C C O C C C C C O C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"+f5GAFz/8P47APT/N/+uADgAzf+uABUAEgAnACQAwv+u//D/NP+2/yMA0f5L//n/Rv6N/wsAX/4kABwAEP51AEEAAwAs/yUAkQAd//D/4wCf//j/ZwGT/w4AwQENABcAOQIBACoAgwGYAAcA7wCXAC4AoAAoAOj/mgBHAFL/YP9TADz/vv6dADz/0P7t/y7/Lf+mAKQADP8NARcA///1AFgA1//UAK//HwAVAJAAxf+r/4P/Nv+6/5EA3v4x/5D/1/70/jgAF/5l/2QACv57/7P/BAAw/5IAxv/X/gUAxADQ/ioAjQD9/oj/kgEv/xkAjQG5AJ//uAHfAEcA5gCKAJoAxAD4ABIA0gD7/xv/MwBIADD/yACpAED/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAYABwAHAAgACAAJAAEACQAJAAoABQALAAsADAAMAA0ADQAOAA4ADwAPABAADwARABEAEgASABMABAATAA0AEwATABQAAAAVAAAAFgAAABcAAgAYAAIAGQADABoAAwAbAAQAHAAFAB0ABgAeAAcAHwAHACAACAAhAAgAIgALACMACwAkAAwAJQAMACYADgAnABEAKAARACkAEgAqABIAKwAUACwAFAAtABQALgA=","o":"11111111111211121211111111111111111111111111111111"},"doc":{"name":"11-Дезоксикортикостерон","el":"C C C C C C C C C C C O C O C C C C C O C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"OP8sAH3/PP8bABQAf/+RAFcAEQCeACgAYQAcAC4AFwCe//3/jP+a/zoAL/8q/xAAoP5h/ygAsf72/0oAQ/5OABMAIv6zAFIA+v0zAI//gP3v/6r/ZQAi/ysA8AAf/+v/OAGm//D/vQGk//z/DgImAAAAiAIjAAsAxQGsAPn/NAGeACsA6QAqAOj/1gBLAFT/+v6CAGP/Df/T/07/nP89AFX/Sv/tAD4Af/+EAMQADwDGAML/QQDoAGgAeAAKAJkAEwCd/5D/lf+a/6cAPv/S/k0AO/8S/6b/Zv5S/87/dP4t/3wAs/7//7cA5f2RAF3/Of70/0//ZP2//1v/bwAk/5cALQDJ/g0A5wAA/4L/LQHV/h8A8QFE/wAAxAHOAJH/+QH1ADYANQGOAJYAAQH8ABQAbABFADr/DgEFABf/+gCxAEH/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAYABwAHAAgACAAJAAEACQAJAAoACgALAAoADAAMAA0ABQAOAA4ADwAPABAAEAARABEAEgASABMAEgAUABQAFQAVABYABAAWABAAFgAWABcAAAAYAAAAGQAAABoAAgAbAAIAHAADAB0AAwAeAAQAHwAFACAABgAhAAcAIgAHACMACAAkAAgAJQAJACYADAAnAAwAKAANACkADgAqAA4AKwAPACwADwAtABEALgAUAC8AFAAwABUAMQAVADIAFwAzABcANAAXADUA","o":"111111111111211111212111111111111111111111111111111111111"}});


// @scene adrenal makeAdrenal | Надпочечники: стероиды и стресс | Гормоны
/* =========================================================
   БИОХИМИЯ · НАДПОЧЕЧНИКИ: синтез стероидов по зонам коры (и врождённая гиперплазия коры при дефиците 21-гидроксилазы),
   стресс — адреналин мозгового вещества и кортизол коры, болезни Кушинга и Аддисона, феохромоцитома;
   как стероид включает ген — настоящий рецептор прогестерона с гормоном (PDB 1A28), агонист и антагонист
   ========================================================= */
function makeAdrenal() {
  __set_rnd(mulberry(8301));
  const scene = bioStage({ rim: 0xf2c14e });
  const VIEW = { steroid: [V3(0.5, -1.3, 0), V3(1.0, 0.4, 17.5)], stress: [V3(39.6, 1.2, 0), V3(40.1, 2.4, 12.5)], receptor: [V3(79.2, -1.7, 0), V3(79.6, 0.1, 15)] };
  // телефон: путь стероидов сверху вниз (холестерин наверху, три ветви зон — колонками), железа скрыта
  const MOB = matchMedia('(max-width:700px)').matches;
  if (MOB) VIEW.steroid = [V3(0.15, -0.9, 0), V3(0.45, 0.2, 10.6)];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.steroid[1]);
  const controls = makeControls(camera, VIEW.steroid[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };

  /* ---------- 1. стероидогенез ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  // срез надпочечника: кольца зон коры и мозговое вещество
  const GL = new THREE.Group(); GL.position.set(-3.2, 0, 0); GL.scale.set(1, 0.72, 1); G1.add(GL);
  const ZONES = [
    { id: 'cap', r0: 1.48, r1: 1.56, col: '#C8B8A8' },
    { id: 'glom', r0: 1.3, r1: 1.48, col: '#7FE0A0', name: 'клубочковая зона' },
    { id: 'fasc', r0: 0.86, r1: 1.3, col: '#F2C14E', name: 'пучковая зона' },
    { id: 'ret', r0: 0.6, r1: 0.86, col: '#FF8AB0', name: 'сетчатая зона' },
    { id: 'med', r0: 0.0, r1: 0.6, col: '#9F7BFF', name: 'мозговое вещество' },
  ];
  ZONES.forEach((z, i) => {
    z.mat = organMat(z.col, 0.5, { emissiveIntensity: 0.08, side: THREE.DoubleSide });
    z.face = new THREE.Mesh(new THREE.RingGeometry(z.r0, z.r1, 72, 1), z.mat); z.face.position.z = 0.002 * i; GL.add(z.face);
    const back = new THREE.Mesh(new THREE.SphereGeometry(z.r1, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), z.mat); back.rotation.x = Math.PI / 2; back.scale.z = 0.55; GL.add(back);
  });
  // узлы пути (молекулы)
  const X0 = -0.6, DX = 1.32, RY = 1.45;
  const NODE = {
    chol: { m: 'cholesterol', p: V3(X0, 0, 0) }, preg: { m: 'pregnenolone', p: V3(X0 + DX, 0, 0) }, prog: { m: 'progesterone', p: V3(X0 + 2 * DX, RY * 0.5, 0) },
    doc: { m: 'doc', p: V3(X0 + 3 * DX, RY, 0), z: 'glom' }, cort_b: { m: 'corticosterone', p: V3(X0 + 4 * DX, RY, 0), z: 'glom' }, aldo: { m: 'aldosterone', p: V3(X0 + 5 * DX, RY, 0), z: 'glom' },
    ohp: { m: 'ohprog', p: V3(X0 + 3 * DX, 0, 0), z: 'fasc' }, dcort: { m: 'deoxycortisol', p: V3(X0 + 4 * DX, 0, 0), z: 'fasc' }, cortisol: { m: 'cortisol', p: V3(X0 + 5 * DX, 0, 0), z: 'fasc' },
    dhea: { m: 'dhea', p: V3(X0 + 3 * DX, -RY, 0), z: 'ret' }, andro: { m: 'androstenedione', p: V3(X0 + 4 * DX, -RY, 0), z: 'ret' }, testo: { m: 'testosterone', p: V3(X0 + 5 * DX, -RY, 0), z: 'ret' },
  };
  if (MOB) Object.values(NODE).forEach((n) => { n.p.set(n.p.y * 1.25, -(n.p.x - X0) * 1.05 + 2.6, 0); });
  Object.values(NODE).forEach((n) => { n.g = fit(n.m, MOB ? 0.62 : 0.56); n.g.position.copy(n.p); G1.add(n.g); n.glow = glowNucleus(G1, n.p.clone().add(V3(0, 0, -0.25)), '#FF6A5A', 0.08, 12); n.glow.core.visible = false; n.glow.spr.material.opacity = 0; });
  const ZC = { glom: '#7FE0A0', fasc: '#F2C14E', ret: '#FF8AB0' };
  const ST = [
    ['chol', 'preg', 'CYP11A1', null, '#C8C8D0'], ['preg', 'prog', '3β-ГСД', null, '#C8C8D0'],
    ['prog', 'doc', '21-гидроксилаза', 'glom', ZC.glom, 'h21'], ['doc', 'cort_b', 'CYP11B2 (11β-)', 'glom', ZC.glom], ['cort_b', 'aldo', 'альдостеронсинтаза', 'glom', ZC.glom],
    ['prog', 'ohp', '17α-гидроксилаза', 'fasc', ZC.fasc], ['ohp', 'dcort', '21-гидроксилаза', 'fasc', ZC.fasc, 'h21'], ['dcort', 'cortisol', '11β-гидроксилаза', 'fasc', ZC.fasc],
    ['preg', 'dhea', '17α-гидроксилаза / 17,20-лиаза', 'ret', ZC.ret], ['dhea', 'andro', '3β-ГСД', 'ret', ZC.ret], ['andro', 'testo', '17β-ГСД', 'ret', ZC.ret], ['ohp', 'andro', '17,20-лиаза', 'ret', ZC.ret, 'shunt'],
  ].map(([a, b, enz, z, col, tag]) => { const A = NODE[a].p, B = NODE[b].p, d = B.clone().sub(A).normalize(); return { a, b, enz, z, tag, col, f: flowArrow(G1, A.clone().addScaledVector(d, 0.5), B.clone().addScaledVector(d, -0.5), col, { bend: a === 'ohp' && b === 'andro' ? 0.15 : 0.08, r: 0.02 }) }; });

  /* ---------- 2. стресс: адреналин и кортизол ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.14, keep: true, legs: false });
  const HYP = V3(0, 4.12, 0.08), PIT = V3(0, 3.98, 0.16), HRT = BODY.heart.clone(), LIV = V3(-0.35, 1.5, 0.18), LUN = V3(0.42, 2.35, 0.05);
  const ADR = [V3(0.33, 1.42, -0.12), V3(-0.33, 1.42, -0.12)];
  const brainM = new THREE.Mesh(ell3(0.34, 0.27, 0.36, V3(0, 4.3, 0.02)), glassMat('#C8B8FF', { rim: 0.7, base: 0.04, keep: true })); G2.add(brainM);
  const kidM = organMat('#9A4A4A', 0.5); ADR.forEach((p, i) => { const k = new THREE.Mesh(ell3(0.16, 0.3, 0.12, p.clone().add(V3(i ? -0.02 : 0.02, -0.36, 0))), kidM); G2.add(k); });
  const adrM = organMat('#F2C14E', 0.55, { emissiveIntensity: 0.1 });
  const adrG = ADR.map((p) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.13, 3), adrM); m.position.copy(p); G2.add(m); return glowNucleus(G2, p.clone().add(V3(0, 0, 0.06)), '#F2C14E', 0.035, 10); });
  const hypG = glowNucleus(G2, HYP, '#9F7BFF', 0.05, 9), pitG = glowNucleus(G2, PIT, '#7FD6FF', 0.05, 9);
  const heartM = new THREE.Mesh(ell3(0.22, 0.27, 0.2, HRT), organMat('#C84A50', 0.45)); G2.add(heartM);
  const livM = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV), organMat('#9A4A3A', 0.5, { transparent: true, opacity: 0.55 })); G2.add(livM);
  const lunM = [LUN, V3(-0.42, 2.35, 0.05)].map((p) => { const m = new THREE.Mesh(ell3(0.3, 0.5, 0.22, p), organMat('#F2C0C8', 0.35, { transparent: true, opacity: 0.22, depthWrite: false })); G2.add(m); return m; });
  // симпатический путь: спинной мозг → мозговое вещество
  const spine = new THREE.CatmullRomCurve3([V3(0, 3.8, -0.25), V3(0, 2.8, -0.42), V3(0, 1.8, -0.38), V3(0.05, 1.45, -0.3), ADR[0].clone().add(V3(-0.05, 0, -0.05))]);
  const symp = new THREE.Mesh(new THREE.TubeGeometry(spine, 60, 0.025, 6), flowTubeMat('#FF9A5C', 0.6, 1.6)); G2.add(symp);
  const A2 = {
    crh: flowArrow(G2, HYP.clone().add(V3(0.04, -0.02, 0.06)), PIT.clone().add(V3(0.04, 0.03, 0.06)), '#9F7BFF', { bend: 1.2, r: 0.008 }),
    acth: flowArrow(G2, PIT.clone().add(V3(0.06, -0.04, 0.08)), ADR[0].clone().add(V3(0.02, 0.1, 0.12)), '#7FD6FF', { bend: -0.12, r: 0.012 }),
    cort: flowArrow(G2, ADR[1].clone().add(V3(-0.02, 0.1, 0.12)), LIV.clone().add(V3(0.0, 0.2, 0.12)), '#F2C14E', { bend: 0.4, r: 0.014 }),
    adr: flowArrow(G2, ADR[0].clone().add(V3(0.02, 0.12, 0.14)), HRT.clone().add(V3(0.1, -0.15, 0.15)), '#FF6A5A', { bend: 0.3, r: 0.016 }),
    fb: flowArrow(G2, ADR[1].clone().add(V3(-0.1, 0.12, 0.0)), PIT.clone().add(V3(-0.06, -0.03, 0.02)), '#C8C8D0', { bend: -0.25, r: 0.007 }),
  };

  /* ---------- 3. рецептор стероида на ДНК: лиганд-связывающий домен ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const PS = 0.075, PRD = PDB('pr'), ch = PRD.chains[0];
  const lc = (() => { const L = PRD.ligm[0]; const v = V3(0, 0, 0); for (let i = 0; i < L.n; i++) v.add(V3(L.xyz[i * 3], L.xyz[i * 3 + 1], L.xyz[i * 3 + 2])); return v.multiplyScalar(PS / L.n); })();
  const prG = new THREE.Group(); prG.position.copy(lc).multiplyScalar(-1); const prWrap = new THREE.Group(); prWrap.add(prG); G3.add(prWrap);
  const H12 = 222;   // спираль 12 — «крышка» кармана
  prG.add(cartoon(ch, { scale: PS, to: H12 + 1, color: (i, n, s) => s === 'H' ? '#7FB4E6' : s === 'E' ? '#F2C14E' : '#A8B4C8' }));
  const piv = V3(ch.ca[H12 * 3], ch.ca[H12 * 3 + 1], ch.ca[H12 * 3 + 2]).multiplyScalar(PS);
  const h12p = new THREE.Group(); h12p.position.copy(piv); prG.add(h12p);
  const h12m = cartoon(ch, { scale: PS, from: H12, color: '#FF6FA8' }); h12m.position.copy(piv).multiplyScalar(-1); h12p.add(h12m);
  const caAt = (i) => V3(ch.ca[i * 3], ch.ca[i * 3 + 1], ch.ca[i * 3 + 2]).multiplyScalar(PS);
  const h12c = (() => { const v = V3(0, 0, 0); let n = 0; for (let i = H12 + 3; i < Math.min(ch.seq.length, H12 + 18); i++) { v.add(caAt(i)); n++; } return v.multiplyScalar(1 / n); })();
  const pc = (() => { const v = V3(0, 0, 0); for (let i = 0; i < ch.seq.length; i++) v.add(caAt(i)); return v.multiplyScalar(1 / ch.seq.length); })();
  const h12ax = h12c.clone().sub(piv).cross(h12c.clone().sub(pc)).normalize();
  const LIG = {
    prog: { m: 'progesterone', ag: true, col: '#7FE0A0', name: 'Прогестерон' }, cortisol: { m: 'cortisol', ag: true, col: '#F2C14E', name: 'Кортизол' },
    aldo: { m: 'aldosterone', ag: true, col: '#7FD6FF', name: 'Альдостерон' }, mife: { m: 'mifepristone', ag: false, col: '#FF6A5A', name: 'Мифепристон' },
  };
  const real = molMesh(PRD.ligm[0], { scale: PS * 1.35, hideH: true }); real.position.copy(lc).multiplyScalar(-0.35); prG.add(real); molGlow(real, 0.5);
  Object.values(LIG).forEach((l) => { l.g = fit(l.m, 0.5); l.g.visible = false; prWrap.add(l.g); molGlow(l.g, 0.45); });
  const coact = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 16), protMat('#C77DFF', 0.6)); G3.add(coact);
  const coBase = piv.clone().sub(lc).add(V3(0.55, 0.2, 0.6));

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'steroid', labels: true, rot: false, fly: null, msg: null, zone: 'all', cah: false, dis: 'norm', adr: 0.1, cortL: 0.35, acth: 0.3, stressT: -99, chronic: false, glu: 5, hr: 70, lig: 'prog', h12: 0, hist: [] };
  function setMode(m) { if (m === 'stress' && st.mode !== 'stress') st.hist = []; st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['steroid', 'stress', 'receptor'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }

  const mqm = window.matchMedia('(max-width:700px)');
  function steroidUpdate(dt, t) {
    const Z = st.zone; GL.visible = !mqm.matches;
    ZONES.forEach((z) => { const on = Z === 'all' || z.id === Z || z.id === 'cap'; z.mat.emissiveIntensity = on ? 0.1 + (z.id === Z ? 0.12 + 0.06 * Math.sin(t * 3) : 0) : 0.02; z.mat.color.set(z.col).multiplyScalar(on ? 0.5 : 0.18); });
    ST.forEach((s) => {
      const zoneOn = Z === 'all' || !s.z || s.z === Z;
      let v = zoneOn ? 0.75 : 0.06;
      if (st.cah && s.tag === 'h21') v = 0.03;
      if (s.tag === 'shunt') v = zoneOn ? (st.cah ? 1.1 : 0.12) : 0.04;
      if (st.cah && s.z === 'ret') v *= 1.4;
      s.f.mat.uniforms.uOn.value = v; s.f.mat.uniforms.uTime.value = t;
    });
    Object.entries(NODE).forEach(([k, n]) => {
      const zoneOn = Z === 'all' || !n.z || n.z === Z;
      n.g.scale.setScalar(zoneOn ? 1 : 0.7); n.g.rotation.y = 0.3 * Math.sin(t * 0.6 + n.p.x);
      const acc = st.cah && k === 'ohp' ? 1 : 0, lack = st.cah && (k === 'aldo' || k === 'cortisol' || k === 'cort_b' || k === 'dcort' || k === 'doc') ? 1 : 0, much = st.cah && n.z === 'ret' ? 1 : 0;
      n.glow.spr.material.color.set(acc || much ? '#FF6A5A' : '#5B8CFF');
      const o = (acc || much) ? 0.55 : lack ? 0.0 : 0; n.glow.spr.material.opacity += (o - n.glow.spr.material.opacity) * dt * 2; n.glow.spr.scale.setScalar(1.2 + 0.15 * Math.sin(t * 4));
      n.g.visible = !(lack && Math.sin(t * 2) < -0.2 && st.cah && (k === 'aldo' || k === 'cortisol'));
    });
  }
  function stressUpdate(dt, t) {
    const D = st.dis, since = st.t - st.stressT;
    const acute = Math.exp(-since * 0.35), acuteC = since < 40 ? Math.exp(-since * 0.09) : 0;
    const pheo = D === 'pheo' ? Math.max(0, Math.sin(t * 0.7)) ** 8 * 1.2 : 0;
    const adrT = (D === 'addison' ? 0.08 : 0.1) + 0.9 * acute + 0.25 * (st.chronic ? 1 : 0) + pheo;
    st.adr += (adrT - st.adr) * Math.min(1, dt * 2.5);
    // ось кортизола (медленная)
    const crh = 0.3 + 0.9 * acuteC + (st.chronic ? 0.9 : 0);
    const acthT = D === 'cushing' ? 0.05 : D === 'addison' ? 1.4 : crh * 1.2 / (1 + 2.2 * st.cortL);
    st.acth += (acthT - st.acth) * Math.min(1, dt * 0.8);
    const cortT = D === 'cushing' ? 1.6 : D === 'addison' ? 0.06 : 0.12 + st.acth * 0.9;
    st.cortL += (cortT - st.cortL) * Math.min(1, dt * 0.1);
    st.hr = Math.round(68 + 55 * clamp(st.adr - 0.1, 0, 1.3) + (D === 'addison' ? 8 : 0));
    st.glu = 4.6 + 3.2 * clamp(st.adr - 0.1, 0, 1.2) + 1.6 * clamp(st.cortL - 0.35, -0.25, 1.4);
    heartM.scale.setScalar(1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 2 * st.hr / 60)) ** 6);
    lunM.forEach((m, i) => m.scale.setScalar(1 + 0.04 * Math.sin(t * (1.6 + st.adr)) + 0.05 * clamp(st.adr - 0.1, 0, 1)));
    const lv = (v) => clamp(v, 0.04, 1.2);
    A2.crh.mat.uniforms.uOn.value = lv(crh * 0.8 * (D === 'cushing' ? 0.2 : 1)); A2.acth.mat.uniforms.uOn.value = lv(st.acth * 0.8); A2.cort.mat.uniforms.uOn.value = lv(st.cortL * 0.75); A2.adr.mat.uniforms.uOn.value = lv(st.adr); A2.fb.mat.uniforms.uOn.value = lv(st.cortL * 0.6);
    Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    symp.material.uniforms.uOn.value = lv(st.adr * 0.9); symp.material.uniforms.uTime.value = t;
    adrG.forEach((g, i) => { g.spr.material.opacity = 0.15 + 0.6 * clamp(i === 0 ? st.adr : st.cortL / 1.2, 0, 1); g.spr.scale.setScalar(0.7 + 0.15 * Math.sin(t * 5 + i)); });
    hypG.spr.material.opacity = 0.2 + 0.5 * clamp(crh, 0, 1); pitG.spr.material.opacity = 0.15 + 0.6 * clamp(st.acth, 0, 1);
    if (st.adr > 0.5 && rnd() < dt * 8 * st.adr) fx.spawn(ADR[0].clone().add(G2.position), randUnit().multiplyScalar(0.3), C.set('#FF6A5A'), 0.6, 0.6, 1);
    if (!st.hist.length || st.t - st.hist[st.hist.length - 1][0] > 0.1) { st.hist.push([st.t, st.adr, st.cortL]); while (st.hist.length && st.t - st.hist[0][0] > 30) st.hist.shift(); }
  }
  function receptorUpdate(dt, t) {
    const L = LIG[st.lig]; const tgt = L.ag ? 0 : 1;
    st.h12 += (tgt - st.h12) * Math.min(1, dt * 1.5);
    h12p.quaternion.setFromAxisAngle(h12ax, 0.85 * st.h12);
    Object.entries(LIG).forEach(([k, l]) => { l.g.visible = k === st.lig && k !== 'prog'; l.g.rotation.y = 0.3 * Math.sin(t * 0.8); });
    real.visible = st.lig === 'prog';
    // коактиватор садится на закрытую «крышку»
    const on = 1 - st.h12; coact.visible = on > 0.03; coact.material.opacity = on; coact.material.transparent = true;
    coact.position.copy(coBase).add(V3(0.9 * st.h12, 1.4 * st.h12, 0.4 * st.h12)); coact.rotation.set(0.4, 0, 0.9 + st.h12);
    coact.material.emissiveIntensity = 0.04 + 0.12 * on * (0.5 + 0.5 * Math.sin(t * 3));
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'steroid') steroidUpdate(dt, t);
    if (st.mode === 'stress') stressUpdate(dt, t);
    if (st.mode === 'receptor') receptorUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'stress') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'адреналин (красный), кортизол (жёлтый)', xl: 'время условно →' });
    const t1 = st.t, X = (tt) => A.X(clamp((tt - (t1 - 30)) / 30, 0, 1));
    const line = (k, col, sc) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const x = X(r[0]), y = A.Y(clamp(r[k] / sc, 0, 1)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
    line(1, '#FF6A5A', 1.4); line(2, '#F2C14E', 1.8);
  }

  const ZTXT = {
    all: '<b>Кора надпочечников</b> делает стероидные гормоны из <b>холестерина</b>. Первый шаг везде один: в митохондриях CYP11A1 отрезает боковую цепь — получается <b>прегненолон</b>. Дальше путь зависит от зоны: <b>клубочковая</b> — минералокортикоид <b>альдостерон</b> (задерживает Na⁺ и воду), <b>пучковая</b> — глюкокортикоид <b>кортизол</b>, <b>сетчатая</b> — андрогены (ДГЭА, андростендион). Каждый фермент добавляет или убирает одну группу, поэтому молекулы так похожи. Выберите зону.',
    glom: '<b>Клубочковая зона</b> — только здесь есть <b>альдостеронсинтаза</b>, и нет 17α-гидроксилазы. Её включают <b>ангиотензин II</b> и рост K⁺ в крови (АКТГ — слабо). Альдостерон заставляет почки задерживать Na⁺ и воду и выводить K⁺ — растёт давление.',
    fasc: '<b>Пучковая зона</b> — самая толстая; под действием <b>АКТГ</b> делает <b>кортизол</b>: путь идёт через 17α-гидроксилирование, затем 21- и 11β-гидроксилазы. Кортизол — гормон долгого стресса: поднимает глюкозу (глюконеогенез), разрушает белки мышц, подавляет воспаление и иммунитет.',
    ret: '<b>Сетчатая зона</b> — <b>17,20-лиаза</b> отрезает боковую цепь целиком, и получаются андрогены: <b>ДГЭА</b> (в основном в виде сульфата, ДГЭА-С) и андростендион. У женщин это главный источник андрогенов; у мужчин основной тестостерон делают яички.',
    med: '',
  };
  const DIS = { norm: 'Норма', cushing: 'Синдром Кушинга', addison: 'Болезнь Аддисона', pheo: 'Феохромоцитома' };
  const DISTXT = {
    norm: '<b>Две системы стресса.</b> Быстрая: симпатический нерв (оранжевый) за секунды заставляет <b>мозговое вещество</b> выбросить <b>адреналин</b> — сердце бьётся чаще, бронхи расширяются, печень отдаёт глюкозу. Медленная: гипоталамус (кортиколиберин) → гипофиз (<b>АКТГ</b>) → кора надпочечников → <b>кортизол</b>; он нарастает минуты и держится часами, а сам тормозит гипофиз (серая стрелка). Нажмите «Стресс» и смотрите на график.',
    cushing: '<b>Синдром Кушинга</b> — избыток кортизола (приём глюкокортикоидов как лекарства, опухоль надпочечника или гипофиза). Здесь показан вариант с опухолью надпочечника — АКТГ подавлен; при болезни Кушинга (опухоль гипофиза) АКТГ, наоборот, высокий. Высокая глюкоза (стероидный диабет), ожирение лица и туловища при худых руках и ногах, растяжки, остеопороз, гипертония, слабый иммунитет.',
    addison: '<b>Болезнь Аддисона</b> — разрушение коры (чаще аутоиммунное). Нет кортизола и альдостерона: слабость, низкое давление, низкая глюкоза, тяга к солёному, потеря Na⁺ и рост K⁺. Гипофиз без обратной связи гонит <b>АКТГ</b>, а его предшественник даёт и меланоцитостимулирующий гормон — кожа темнеет. Опасен аддисонический криз; лечение — заместительные гормоны.',
    pheo: '<b>Феохромоцитома</b> — опухоль мозгового вещества, которая приступами выбрасывает катехоламины: внезапное сердцебиение, головная боль, потливость, скачки давления. Диагностика — метанефрины в крови и моче, лечение — операция после блокады α-адренорецепторов.',
  };
  const LTXT = {
    prog: '<b>Как стероид включает ген.</b> Стероиды жирорастворимы и проходят через мембрану сами. Внутри их ждут <b>ядерные рецепторы</b>; здесь — настоящий лиганд-связывающий домен (без ДНК-связывающего) <b>рецептора прогестерона</b> с прогестероном в кармане (PDB 1A28). Гормон закрывает карман <b>спиралью 12</b> (розовая) — на неё садится <b>коактиватор</b> (фиолетовый), и рецептор вместе с ним включает гены на ДНК. Рецепторы кортизола (GR), альдостерона (MR), андрогенов и эстрогенов устроены так же.',
    cortisol: '<b>Кортизол</b> действует через глюкокортикоидный рецептор (GR) — родственник показанного. Но и рецептор альдостерона (MR) связывает кортизол так же прочно, а кортизола в крови в сотни раз больше! В почке MR защищает фермент <b>11β-ГСД2</b>: он превращает кортизол в неактивный кортизон. Глицирризин <b>лакрицы</b> блокирует фермент — кортизол «включает» MR, задерживается натрий, растёт давление.',
    aldo: '<b>Альдостерон</b> через MR в клетках почечных канальцев включает гены натриевого канала ENaC и Na⁺/K⁺-АТФазы: натрий и вода возвращаются в кровь, калий уходит в мочу. Антагонист MR <b>спиронолактон</b> — мочегонное, сберегающее калий, и лекарство при сердечной недостаточности.',
    mife: '<b>Мифепристон</b> занимает тот же карман, но мешает спирали 12 закрыться (розовая спираль отходит) — коактиватору не на что сесть, ген не включается. Так устроены <b>антагонисты</b> рецепторов: блокатор рецептора прогестерона (и в больших дозах — кортизола), применяется в гинекологии; по тому же принципу работают тамоксифен (эстрогены) и антиандрогены.',
  };
  const SHORT = { doc: 'дезоксикортикостерон', ohp: '17-OH-прогестерон', dcort: '11-дезоксикортизол', cort_b: 'кортикостерон' };
  const labels = [
    // подписи зон — легендой слева от железы (на цветных кольцах бледный текст не читался)
    ...ZONES.filter((z) => z.name && !MOB).map((z) => ({ left: true, text: z.name, pos: V3(-4.75, { glom: 0.55, fasc: 0.18, ret: -0.19, med: -0.56 }[z.id], 0.3), color: z.col, show: () => st.labels && st.mode === 'steroid' && (st.zone === 'all' || st.zone === z.id) })),
    ...Object.entries(NODE).map(([k, n]) => ({ text: SHORT[k] || MOL(n.m).name, pos: n.p.clone().add(V3(-0.35, -0.7, 0.3)), color: n.z ? ZC[n.z] : '#E8E0D8', show: () => st.labels && st.mode === 'steroid' && (st.zone === 'all' || !n.z || n.z === st.zone) })),
    ...ST.filter((s) => s.tag !== 'shunt').map((s) => ({ text: s.enz, pos: NODE[s.a].p.clone().lerp(NODE[s.b].p, s.a === 'preg' && s.b === 'dhea' ? 0.68 : 0.5).add(V3(-0.5, s.a === 'preg' && s.b === 'dhea' ? -0.3 : 0.32, 0.3)), color: st.cah && s.tag === 'h21' ? '#FF6A5A' : '#B8B0C0', show: () => st.labels && st.mode === 'steroid' && st.zone !== 'all' && (s.z === st.zone || (!s.z && st.zone !== 'all')) })),
    ...ST.filter((s) => s.tag === 'h21').map((s) => ({ text: '✕ 21-гидроксилаза', pos: NODE[s.a].p.clone().lerp(NODE[s.b].p, 0.5).add(V3(-0.5, -0.1, 0.45)), color: '#FF6A5A', show: () => st.labels && st.mode === 'steroid' && st.cah })),
    { text: 'гипоталамус', pos: HYP.clone().add(V3(40.25, 0.22, 0.1)), color: '#9F7BFF', show: () => st.labels && st.mode === 'stress' },
    { text: 'гипофиз (АКТГ)', pos: PIT.clone().add(V3(40.3, -0.08, 0.1)), color: '#7FD6FF', show: () => st.labels && st.mode === 'stress' },
    { text: 'надпочечник', pos: ADR[0].clone().add(V3(40.25, 0.12, 0.1)), color: '#F2C14E', show: () => st.labels && st.mode === 'stress' },
    { text: 'симпатический нерв', pos: spine.getPoint(0.4).add(V3(40.15, 0, 0)), color: '#FF9A5C', show: () => st.labels && st.mode === 'stress' },
    { text: 'сердце', pos: HRT.clone().add(V3(40.3, -0.1, 0.2)), color: '#FF6A5A', show: () => st.labels && st.mode === 'stress' },
    { text: 'печень', pos: LIV.clone().add(V3(39.4, -0.3, 0.2)), color: '#C8A090', show: () => st.labels && st.mode === 'stress' },
    { text: 'спираль 12', pos: () => h12p.localToWorld(h12c.clone().sub(piv)).add(V3(0.25, 0.25, 0.3)), color: '#FF6FA8', show: () => st.labels && st.mode === 'receptor' },
    { text: 'коактиватор', pos: () => coact.position.clone().add(V3(80.4, 0.5, 0.2)), color: '#C77DFF', show: () => st.labels && st.mode === 'receptor' && st.h12 < 0.5 },
    { text: 'гормон в кармане', pos: V3(80 + 0.35, 0.35, 0.6), color: '#7FE0A0', show: () => st.labels && st.mode === 'receptor' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'steroid' ? (st.cah ? '<b>Врождённая гиперплазия коры</b> (дефицит 21-гидроксилазы, около 1 на 10–15 тысяч новорождённых). Кортизола мало, а у ~3/4 больных — и альдостерона (сольтеряющая форма); предшественник <b>17-OH-прогестерон</b> копится (по нему и ставят диагноз — скрининг новорождённых) и уходит в обход, в андрогены. Мало кортизола — гипофиз гонит АКТГ, кора разрастается. У девочек — признаки андрогенов уже при рождении, у части детей — потеря соли с угрозой для жизни. Лечение — гидрокортизон и, если нужно, флудрокортизон.' : ZTXT[st.zone] || ZTXT.all)
        : st.mode === 'stress' ? (st.chronic && st.dis === 'norm' ? '<b>Хронический стресс</b>: кортизол постоянно повышен — сахар и давление выше, хуже сон, слабее иммунитет, накапливается жир на животе, страдает память (гиппокамп богат рецепторами кортизола).' : DISTXT[st.dis])
        : LTXT[st.lig];
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'steroid', label: 'Стероиды коры' }, { id: 'stress', label: 'Стресс и болезни' }, { id: 'receptor', label: 'Рецептор стероида' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'steroid') box.append(h('div', { class: 'glabel' }, 'Зона коры'), h('div', { class: 'gctl' }, seg([{ id: 'all', label: 'Все' }, { id: 'glom', label: 'Клубочковая', color: ZC.glom }, { id: 'fasc', label: 'Пучковая', color: ZC.fasc }, { id: 'ret', label: 'Сетчатая', color: ZC.ret }], () => st.zone, (v) => { st.zone = v; refs.setInfo(); }), toggle('Дефицит 21-гидроксилазы', () => st.cah, (v) => { st.cah = v; refs.setInfo(); })));
      else if (st.mode === 'stress') box.append(h('div', { class: 'glabel' }, 'Состояние'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; refs.setInfo(); }), button('Стресс', () => { st.stressT = st.t; }, true), toggle('Хронический стресс', () => st.chronic, (v) => { st.chronic = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Вещество в кармане'), h('div', { class: 'gctl' }, seg(Object.entries(LIG).map(([id, l]) => ({ id, label: l.name, color: l.col })), () => st.lig, (v) => { st.lig = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['steroid', 'stress', 'receptor'][n - 1]); return true; }
    if ((k === ' ' || k === 'e' || k === 'у') && st.mode === 'stress') { st.stressT = st.t; return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'stress') return [['Пульс', st.hr, 'уд/мин'], ['Глюкоза', st.glu.toFixed(1).replace('.', ','), 'ммоль/л'], ['Кортизол', st.cortL > 1.1 ? 'высокий' : st.cortL > 0.6 ? 'повышен' : st.cortL < 0.15 ? 'низкий' : 'норма', ''], ['АКТГ', st.acth > 0.9 ? 'высокий' : st.acth > 0.45 ? 'повышен' : st.acth < 0.12 ? 'подавлен' : 'норма', '']];
    if (st.mode === 'receptor') return [['Спираль 12', st.h12 < 0.3 ? 'закрыта' : 'открыта', ''], ['Ген', st.h12 < 0.3 ? (st.lig === 'prog' ? 'включён' : 'включён (как в GR/MR)') : 'выключен', '']];
    return [['Кортизол', st.cah ? 'мало' : 'норма', ''], ['Андрогены', st.cah ? 'много' : 'норма', '']];
  }
  const upd0 = update;
  const self = {
    mobZoom: 0.9, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · гормоны', title: 'Надпочечники',
    lede: 'Две железы в одной: кора из холестерина делает стероиды — альдостерон, кортизол, андрогены, а мозговое вещество выбрасывает адреналин за секунды.',
    notes: `
      <div><h2>Стероидные гормоны</h2>
        <p>Все стероиды — производные холестерина с четырьмя кольцами (циклопентанпергидрофенантрен). Ферменты стероидогенеза — в основном цитохромы P450 (CYP11A1, CYP17, CYP21, CYP11B1, CYP11B2) в митохондриях и ЭПС. Холестерин в митохондрию переносит белок StAR — это лимитирующий шаг, его ускоряет АКТГ через цАМФ.</p>
        <h3>Регуляция</h3><ul><li>Альдостерон — ренин-ангиотензиновая система и K⁺.</li><li>Кортизол — АКТГ, суточный ритм (максимум утром), стресс; обратная связь на гипоталамус и гипофиз.</li><li>Катехоламины мозгового вещества — симпатические нервы (ацетилхолин); для синтеза адреналина (ФЭНМТ) нужен кортизол — он приходит из коры по портальным сосудам, и в мозговом веществе его концентрация в десятки раз выше, чем в общей крови.</li></ul>
        <h3>Глюкокортикоиды как лекарства</h3><p>Преднизолон, дексаметазон подавляют воспаление и иммунитет (фосфолипаза A₂, цитокины). При долгом приёме — синдром Кушинга и подавление собственной коры, поэтому их отменяют постепенно.</p></div>
      <div><h2>Условности</h2><ul><li>Молекулы — по химическим формулам; срез надпочечника и тело — схемы.</li><li>Рецептор — настоящий лиганд-связывающий домен рецептора прогестерона с прогестероном (PDB 1A28); другие вещества вписаны в карман условно, движение спирали 12 показано схематично.</li><li>Уровни гормонов при стрессе — качественная модель.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>пробел</code> стресс</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('steroid'); st.fly = null;
  return self;
}
export { makeAdrenal };
