import { Sparks, THREE, V3, __set_rnd, button, clamp, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, noise3, organMat, rand, range, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, PDB, SPH, bioStage, blobGeo, flowArrow, molFit, molGlow, molMesh, plotAxes, protMat, schemBilayer, smoothIco } from './kit.js';
Object.assign(BIO_PDB, {"hbo":{"title":"Oxyhemoglobin 1GZX, α chain","r":24.1,"chains":[{"id":"A","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCCHHHHHHHHHHHHHHCCCHHHHHHHHHHHHHHHCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHCCCCHHHHCHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHHCCCCC","ca":"cgC5/qX/dADq/mz/fgDK/if/pwDv/vD+ZQD9/tH+TAAg/xH/jABH/xf/hQBf/9D+PAB1/9v+TACb/xr/iADB//z+XQDS/8H+HwDs/+n+SgAOAB7/bgApAOD+MgBTAMn+HwBtAA7/YgCPAAn/XADWACP/GADLAEL/LACWAHX/JgDJAK7/5P/kAJX/zP+bAI3/5v+HANT/wf/GAPL/gP+yAM3/iP9oAOT/jf9/ACsAT/+rACMAJv9wAAUAPv9GAEAAKf93AHgA5P6AAFYA0v43AEIA7v4ZAIUA7v5OALwADv8fAO0AUv8rAMwATP90AOcAXP9YACwBp/9bABkBpv+jAAEBhv/FAD4Bvf/9ADkBr/8KAe4Af/87AcwAVv8MAaIALf9BAYEAL/9BATMAbv9hARgAkv9cAVsA3P9qAU8A6P81AYIAxP8DAVcA6f8YARYAKQAXAT8AHQDOAFUABAC0ABEARgDKAPT/bgCkACcARQBmAB0ASQBuANH/lwB0ANn/mgAzAAIAdAAOAMv/oAArAJX/3AAQALr/vgDJ/8T/sgDI/3f/+wDh/2//EgGl/5b/3QB0/4T/EgE+/4r/JQFS/9D/5QBs//P/9ABR/zkANgF3/zwAHgG0/xQA5QC6/0gAAgGe/4oAAgHk/6YAuQDy/5oAqQCt/7UAzAC///cApgABAPoAYADj/+4AcgCo/xsBjQDI/1oBfwAQAFcBOwAXADIBHADS/0EB5f/U/wsBuf+X/woBxv9t/88AgP9v/7cAif+3/6MAvv+m/24AiP+D/0gAXP/D/0cAkv/y/zAAp/++//r/YP++/+D/W/8LAN7/n/8QALf/gv/d/4T/Qv8GAH//bf9GAHX/mP8nAD7/W/8KAB3/PP9RAB3/eP9vAPz+m/86AM3+X/8bAKz+hv8LAG/+uP/i/5j+jP/L/9D+gP+I/67+bP9F/8/+tP8q/8/+0v9t/+f+m/9v/xz/rf8l/zL/9/8+/zP/7v98/1r/wv9X/43/+P8j/5j/LABc/5//BQCE/9P/+f9D//f/QwA1//f/VgB8/w4AIgB3/0kAQAAz/1oAhwBT/2EAagCM/4sASQBd/70AfwAn/8AAnwBC//8AYQBF/ywBbgAM/14B","o":"vNTFY/QA5l8RAGT38Vzc11sK/mMKBV7ezlPo5VwdC2MA/VvX4F/8EGERJlwI6F3k2l0EEO1h8FI3rwo6udk60gZZpv8rrN8sydZIvf1LovYhvcQswttFrgI5qN8jwsUzzPFUpPYnw7IIYwcOKkE/OAVTYg4QLVQgJxVZYBQS0knO0VYTGGD0rt0tQ/q20sDCYfHt+GITUTfvHKrVUtfYT8P0KajnLrnKVtHpN6/tHLLJOLvSSLzzJKbpG7PGSM7QOK70HK/NMsq8TcbmJqXyJbrDVuTWCdFYxb4vJqcbJUNB8Vcu7ihaEUtABGMQvSVA2/Zc6SJbvBxEueZC2Ppc2QlcqAQvyNJF/hdhyiFNsSsrtP1BPrTr4D65EQWezfCr8VLJFjSu6QefyiKz9TyxDh6i6Aef3EzKBDetACGi0xqr8kC0DRyh7QKe00jKKEvLFqAT1qX6BqrOKqUHnf0QNQxUBepiO+BKNwhTFBhfFudePO5OHCJaDBNiJeRZQv5LGxpdC+9iMe1VPRJNDP1jE9pbM/NVCTtQ3MZJDKUoKTlI8DJVErpF","brk":[]}],"ligs":[{"el":"Fe C C C C N C C C C C C C C O O N C C C C C C C N C C C C C C C N C C C C C C C C O O","xyz":"JQAxAJMASwBjALIAUwAwAGAABAD9/3cA9f84AMIASQBEAIwAUwBaAJoAZwBmAIkAagBYAHMAWABDAHQAfgBdAFwAdgB+AJUAjABzAKgAogCJAKkAnQChAK8AuAB+AKIAKgAbAHIAPgAfAF8AOQANAEgAIwD+/04AGgAHAGgATAAMAC8AFgDq/zwAEADS/0AAAwAeAJwA9v8JAI0A3P8EAJcA2P8VAKsA8P8lAK8Ayv/v/4sAv/8ZAL4Apf8XALcAIQBIALQACwBKAMUADgBfANgAJgBqANIAMgBcALwA+/9oAO4ANACCAOAAJACbANYALwCyAOYANgDGANgAMQCwAP8A","b":"AAAFAAAAEAAAABgAAAAgAAEABgABACQAAgAJAAIAEQADABQAAwAZAAQAHAAEACEABQAGAAUACQAGAAcABwAIAAcACwAIAAkACAAKAAsADAAMAA0ADQAOAA0ADwAQABEAEAAUABEAEgASABMAEgAVABMAFAATABYAFgAXABgAGQAYABwAGQAaABoAGwAaAB0AGwAcABsAHgAeAB8AIAAhACAAJAAhACIAIgAjACIAJQAjACQAIwAmACYAJwAnACgAKAApACgAKgA=","name":"HEM","chain":"A","seq":1142},{"el":"O O","xyz":"FABFAIAAAABMAHQA","b":"AAABAA==","name":"OXY","chain":"A","seq":1143}],"res":[{"el":"N C C O C C N C C N","xyz":"GgDrAE8AHQDOAFUAGQC9ADsAJwCoADcADADIAG4AEQCsAHkAJQCkAIgAAwCVAHQAJQCKAIwAEACBAIEA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS58","chain":"A"},{"el":"N C C O C C N C C N","xyz":"ewDu/+4AYADj/+4AXgDO/wUBSADQ/xABVADY/9IATwDv/74AYwD8/7AAOAD8/7gAWAAQAKIAPgARAKYA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"A"}]}});
Object.assign(BIO_MOL, {"nad":{"name":"NAD⁺","el":"N C O C C C C N C C O C C O P O O O P O O O C C O C N C N C C N N C N C C O C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"+/1a/6gA9P06/xoAg/0u/+r/b/4o/8L/Yv4L/0D/3f77/vD+VP8J/yr/Yf8o/7P/9/43//v/6f81/+b/OgDI/rz/oQCu/hwAJwG9/tj/UAFD/9P/ygFh/zsAvAES/78AWwIw//n/zAEAAGMAFAJgAPb/rAJiABIA/wEwAFn/4AH8AAMAZgELAUQA+QDPAO3/hgC+AD4AFQDFAOf/nv/sAC0Al/84AaEAG/9HAcIAzf4FAWYAPv71AFsA4f0vAbwAEP6wAPf/Zv52AJn/5/6EAKL/Hf/NAAoAOQAsAXr/AwAEAf/+0gAvAXz/DAEEAQP/ggAA/5gAfgCs/gsB9f85/34A7f+9/68Apf1l/9wAUv5m/9kAAv7//hD/1v7j/ob+rf/9/uz++/5O/2UAFACR/77/lgBD/jcAcQF6/gIAGgGb/m//pQERAE//UAF3AVAAZQHgAKgAFgFvAMT/CABkALf/6/9hAdYABf5lAQoBfv0iAbEAPf49AEb/EgCNAZj/4/9RAc3+9QCUAZX/9wCnAPP+xQBT/6kAWQDd/lUBrP/4/q0Anf/I/+QA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgABwAJAAkACgAKAAsACwAMAAwADQANAA4ADgAPAA4AEAAOABEAEQASABIAEwASABQAEgAVABUAFgAWABcAFwAYABgAGQAZABoAGgAbABsAHAAcAB0AHQAeAB4AHwAeACAAIAAhACEAIgAiACMAHQAjABoAIwAZACQAJAAlACQAJgAXACYAJgAnAAsAKAAoACkAKAAqAAkAKgAqACsAAAAsAAAALQAEAC4ABQAvAAYAMAAIADEACQAyAAsAMwAMADQADAA1ABQANgAWADcAFgA4ABcAOQAZADoAGwA7AB8APAAfAD0AIQA+ACQAPwAlAEAAJgBBACcAQgAoAEMAKQBEACoARQArAEYA","o":"121212121111111211121111111121112121211111111111111111111111111111111111111"},"acetylcoa":{"name":"Acetyl-CoA","el":"C C C C O P O O O P O O O C C O C N C N C C N N C N C C O C O P O O O C O C O N C C C O N C C S C C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"rv4JAJ8AGP4CAI8A3P3//xwB2P1yAD8ABv7qAHkAU/4/AQIAhf7BAUQA4f1nAY//zf7rAL//O/9EAWz/pP95Ac//9/7HAR//fv/mAPf+BADHAAr/BgBZAHP/TQDp/zv/xAAjAHL/cgBqAM7/hAClAEYA7gCnAIcAcAGNAKIAoAG8ABgBTgEHAXYBJgKlADwBdQJkAO4ARwIzAHUAzQFCAEsAJgHA/63/9wB+/yAAqwEGAMT/DQKj/6L/ZALg/yb/DgLu/6j+3wJ1/wL/qQJxAEz/9v17/1MAa/1l/1oAJv5u/8T/2v2H/2f/r/5D/6f/5/40/yL/BP+f/gr/hv95/lL/7v9w/hL/h/9f/uH/BAA6/iQA4v/9/awAmf+A/hMBCAAQ/wwB0/+X/94AfQAE/y0B4f4NAD8Ay/5gANoA0f6v/9UAD/5IAFsB6P2b/0YBcv0YABcBa/1sAEsA7/1tANb/j/0+Aa//H/8UAkn/RQAZASP/LACbAKz+qP8+AJv/8QBjACf/KwDXAHUA7gAdAWkBegEmAc0B3QJUAA0BNwFx/2D/NQE4/zkArwFZAHv/IAOr/9P+YwKzAD//KP4t/5AAV/0f/5oA7P4v//f/pv5Y/9T+Rv9q/x3/D/+N/p/+sv5j/jH/Mv9m/hcAOQDx/ej/QgCT/jEAPADY/dsAmv+t/Z8AnP+L/4EAJgDc/88AkP/A/yoB","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAUACAAIAAkACQAKAAkACwAJAAwADAANAA0ADgAOAA8ADwAQABAAEQAOABEAEQASABIAEwATABQAFAAVABUAFgAVABcAFwAYABgAGQAZABoAFAAaABAAGwAbABwAGwAdABoAHQAdAB4AHgAfAB8AIAAfACEAHwAiAAEAIwAjACQAIwAlACUAJgAlACcAJwAoACgAKQApACoAKgArACoALAAsAC0ALQAuAC4ALwAvADAAMAAxADAAMgAAADMAAAA0AAAANQACADYAAgA3AAIAOAADADkAAwA6AAcAOwALADwADQA9AA0APgAOAD8AEABAABIAQQAWAEIAFgBDABgARAAbAEUAHABGAB0ARwAhAEgAIgBJACMASgAkAEsAJwBMACgATQAoAE4AKQBPACkAUAAsAFEALQBSAC0AUwAuAFQALgBVADEAVgAxAFcAMQBYAA==","o":"1111121112111111111212112121111111211111211112111111211111111111111111111111111111111111111"},"bilirubin":{"name":"Bilirubin","el":"C C C C C C C C N C C C N C C C N C O C C C C C C C C C C C O O C C C C O O C C N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"CgM7ALv+jgIxABD/UwLB/z//kQI8/xz/cgK+/jn/2wHr/4//jwGQ/8j/FgGt/xkA1wAiAD4AZwAEAIwACQBqAMcAof+SAGAAOP8/ADcA6/5+ANn/cP5cAIn/Lv7q/47/Uf57/+L/7v0U/8f/6v2o/vr/jf1K/1//Gv30/i7/vvwV/9T+sv3E/z7/b/0gANv+Iv/4AMj/8v5lAWv/lv8EAR4A8P99ASgAof/0AWEAd//WAfAAyv/OAUkB7f7DAQ8BYACB/5kA9/8z/+UAJQAe/3YBmwC8/ncBDAHl/ooBhAAy/mIB0ABI/08A7wC1/kMA0QF6AI3/QQKrAD7/WgIdASb/VgP2/9/+8gIhAFP+MgOgAL7+7QJA/93+tgJx/g7/IQKW/nP/qwEn/7v/7wCAACgA1/9AAB8BQQDCAOcAMf/k/18ASf6pAEP/mv5t/yMAEf2P/lr/uvx0/6H+cPzL/rz+ef34/3b+BP0nAPL+mf2EAN3+Qf+uAVr/nP6ZAZb/1f47AQr/RQBpAWkAFQCYAcX/Sf8GAiMA4f9NAl8Asf7DAcMA5v/S/rYAmP9q/+YAQwB9/6EB0v/0/rABXgAZ/gwBDwGd/t3/lgB5/loAPwGZ/ogAjwG3ALf/","b":"AAABAAEAAgACAAMAAwAEAAIABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEQATABMAFAAUABUAEwAWAA8AFgAWABcADQAYABgAGQAYABoACwAaABoAGwAbABwAHAAdAB0AHgAdAB8ACQAgACAAIQAhACIAIgAjACMAJAAjACUAIAAmAAcAJgAmACcABQAoACgAKQABACkAKQAqAAAAKwAAACwAAAAtAAMALgAEAC8ABAAwAAYAMQAIADIACgAzAAoANAAMADUADgA2ABAANwAUADgAFQA5ABUAOgAXADsAFwA8ABcAPQAZAD4AGQA/ABkAQAAbAEEAGwBCABwAQwAcAEQAHwBFACEARgAhAEcAIgBIACIASQAlAEoAJwBLACcATAAnAE0AKABOAA==","o":"1212121111111121121122112112111212111211211112111111111111111111111111111111111111"},"cholesterol":{"name":"Cholesterol","el":"C C C C C C C C C C C C C C C C C C C C C C C C C O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Sf6hAEP/m/5aAK//Uv5eADMA7/3t/y8AIv6B/44ABv74/lQAb/3l/jwAUf7d/tL/HP+mALL/J/8fAQ4Arv8OAVoA/f+yAP7/kv9LAM7/zP8IAFL/UgDE/3L/tgAZAMD/eABtADIA4ADWAF8AaQGXAHgAiwEfAEkALQHI//T/dwGN/3v/+gFJ/6T/WAKr/+v/FwLo/2gAzwJl/xIA/QBU/0wAeP/m/zwAfP6bAOT+PP4KAV//5/1xADv/qv7y/4//HP6+ADoAlv5YAIcA5P3H/8r/jP0PAFEA7P2L/+0AjP6M/6IAJf6t/p4ATv2L/m8AOf07/2QAXP3c/tL/U/5x/sD/IP4N/37/uP4A/9r/LP/PAEv/Mv95AdD/2f4vAVYAmv/fALoA3f9vAWUAGADsAKT/3f9TAAT/h/+9/y3/gQCn/xL/OwBn/6f/3wBjAHj/ZQAuAIgA6QAiARAAvQAGAbsAsgHOALQANwFE/0r/jgHe/zX/LAIi/0z/4wH2/uj/cwL7/6b/VgI6AI0ADwKb/7UAxAJE/2wAOwFP/6YABgH3/hUAlQBk/2kAKv+h/x0A0f+p/1AAXP8YAJgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEACAAIAAkACQAKAAoACwALAAwACAAMAAwADQANAA4ADgAPAA8AEAALABAAEAARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABYAFwAXABgAEwAYABcAGQAUABoADAAbAAAAHAAAAB0AAAAeAAEAHwACACAAAgAhAAMAIgADACMABAAkAAQAJQAFACYABgAnAAYAKAAGACkABwAqAAcAKwAHACwACAAtAAkALgAJAC8ACgAwAAoAMQALADIADQAzAA0ANAAOADUADgA2AA8ANwAQADgAEQA5ABEAOgASADsAFQA8ABUAPQAWAD4AFgA/ABcAQAAYAEEAGABCABkAQwAaAEQAGgBFABoARgAbAEcAGwBIABsASQA=","o":"11111111111111111111211111111111111111111111111111111111111111111111111111111"},"glucuronic":{"name":"Glucuronic acid","el":"O C O C C O C O C O C O O H H H H H H H H H H","xyz":"Sv/5APn/jP+DACUAFACHAPz/XAAWACoAJACU//D/ZwAl/ysAjf+H/wsAWf8e/7r/Q/8JAOr/wP4DACEA7wAkAAEARwEHAFAAEAFTAH//+v4HAS4Ah/9+AJIAVgASAJcANQCS/4T/ZAAu/4wAfv9u/3QAd/8q/1//Pf8UAH7/f/4EANj/AwGxAG//","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAABAAgACAAJAAMACgAKAAsACgAMAAAADQABAA4AAwAPAAQAEAAFABEABgASAAcAEwAIABQACQAVAAwAFgA=","o":"11111111111211111111111"},"gsh":{"name":"Glutathione","el":"N C C C C O N C C S C O N C C O O C O O H H H H H H H H H H H H H H H H H","xyz":"i/49AD0A5/7f/wIAFf9+/3EArf+E/2oA3v8EAK0A1v8LACgBFwB3AGgAKQCEANn/1P/4AKP/5/+JAQwAvACcALj/6AAGAY//HAEuAMr/8QCs//r/YwFH/+3/egES/4H/tAEn/10Aq/6L/5L/Pf5Y/6D/8/53/xn/vP6BAHUAVf5rAPX/P/8UANz/8f6h/9EA8f4a/1wA1f8v/6IAzv98/wQANADGAKMACQApAKX/a//ZAKL/8v8PAT3/k//qAeP/fgE+ALT/1ACz/2MAnACK/7//kgFF/7MA7P6+/9f+","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAcACAAIAAkABwAKAAoACwAKAAwADAANAA0ADgAOAA8ADgAQAAEAEQARABIAEQATAAAAFAAAABUAAQAWAAIAFwACABgAAwAZAAMAGgAGABsABwAcAAgAHQAIAB4ACQAfAAwAIAANACEADQAiABAAIwATACQA","o":"111121111121112112111111111111111111"},"glu":{"name":"Glutamate","el":"N C C C C O O C O O H H H H H H H H H","xyz":"1gCAAMP/iABIADEAAgCQADwAqv90AMP/Tf///+P/Vf+X/6P/7f4KAEsAegCy/x8AWABr/30AlAB2/6D/7QDhANf/LAFLALj/wQBaAI4Az/9vAJcAFAD8AEQAbv/NAK3/5v9cAGz/Af/Y/5wAdgCo/1P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAYAEQAJABIA","o":"111121121111111111"},"napqi":{"name":"NAPQI","el":"C C O N C C C C O C C H H H H H H H","xyz":"3P5q/wAA7/4BAAAAiP5GAAAAbf9EAAAA5/8jAAAATgCXAAAA0QB+AAAABAHu/wAAfAHX/wAAoAB7/wAAGwCU/wAAc/5S/w0AFv8+/1EA//5B/6H/KQD9AAAAGAHRAAAAwwAU/wAA2P8+/wAA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAQACgAAAAsAAAAMAAAADQAFAA4ABgAPAAkAEAAKABEA","o":"121212121211111111"},"creatine":{"name":"Creatine","el":"C N C C O O C N N H H H H H H H H H","xyz":"rP82/wYAyv/C/yMARgDk/2cArgASAAAAwACJAO3/+ACy/7b/a/8qAP3/7v4HALn/hP+mABcA8//2/jwAR/8e/yUAt/8k/5v/bACM/5sANQA0AK8AHwFq/+r/2f6n/6T/rf5QAJ//Qv/tAPz/","b":"AAABAAEAAgACAAMAAwAEAAMABQABAAYABgAHAAYACAAAAAkAAAAKAAAACwACAAwAAgANAAUADgAHAA8ABwAQAAgAEQA=","o":"11121112111111111"},"lactate":{"name":"Lactate","el":"C C O C O O H H H H H H","xyz":"kwBsAND/SwAHACkAgACG/xIAtv8IAAgAdP9tABcAd/+S/9f/nQDLAAUAWgB8AHT/9gBHALf/WQAiAJEAlwB8/7T/m/9v/4P/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAABAAkAAgAKAAUACwA=","o":"11121111111"},"acetyl":{"name":"Acetyl-CoA","el":"C C O S C H H H H H H","xyz":"p/9y//P/vP8JAPz/X/9SABoAXwBQANn/3wDj/x0ARf9d/8f/9f9G/7X/q/9H/1cAQgENAAcA0wDb/4kA1wCA//D/","b":"AAABAAEAAgABAAMAAwAEAAAABQAAAAYAAAAHAAQACAAEAAkABAAKAA==","o":"1211111111"},"acetate":{"name":"Acetate","el":"C C O O H H H H","xyz":"c/8tAAAABAD6/wAAGgCC/wAAcABWAAAAT/8yAGcANf/p/8b/cP+RANP/qQBUALL/","b":"AAABAAEAAgABAAMAAAAEAAAABQAAAAYAAwAHAA==","o":"1211111"},"urea":{"name":"Urea","el":"N C N O H H H H","xyz":"gv9DAAAAAAD6/wAAfgBDAAAAAACA/wAAgv+oAAAAKv8RAAAAfgCoAAAA1gARAAAA","b":"AAABAAEAAgABAAMAAAAEAAAABQACAAYAAgAHAA==","o":"1121111"},"ethanol":{"name":"Ethanol","el":"C C O H H H H H H","xyz":"hf8aAAAABQDH/wAAdgAeAAAAlv94AMv/Nv/j/87/Z/8vAGcACACJ/1kACACJ/6f/WgB3ABoA","b":"AAABAAEAAgAAAAMAAAAEAAAABQABAAYAAQAHAAIACAA=","o":"11111111"},"acetaldehyde":{"name":"Acetaldehyde","el":"C C O H H H H","xyz":"gv8TAAAADQDT/wAAcQAaAAAAdv9PAFoANv/E//7/d/9SAKj/GABn/wAA","b":"AAABAAEAAgAAAAMAAAAEAAAABQABAAYA","o":"121111"},"o2":{"name":"Oxygen","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"h2o":{"name":"Water","el":"O H H","xyz":"EwAKAB8ACwA/AM7/4v+3/xMA","b":"AAABAAAAAgA=","o":"11"},"phenobarbital":{"name":"Phenobarbital","el":"C C C C C C C C C C O N C O N C O H H H H H H H H H H H H","xyz":"Yv8DAUoA7v/WACwA6v9AAAoAewAPAAEA5ABeAOj/bAEmAOH/gQGj//L/DgFL/w0AkwB+/xQApf/2/34A1P8BAO8AL/+l/2kA9P6W/+X/kP5R/9b/Mf/Z/3L/p/8sAIP/1/9iAB//Q//iAK0AG//cAAEAXf9xAUgALwDlAIIAFwANAdf/3QDKANn/wAFoAM3/5QF5/+z/HgHg/hsAPwA7/ycABP92/7gAB//O/xf/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgAAgAJAAkACgAJAAsACwAMAAwADQAMAA4ADgAPAAIADwAPABAAAAARAAAAEgAAABMAAQAUAAEAFQAEABYABQAXAAYAGAAHABkACAAaAAsAGwAOABwA","o":"111212121121121112111111111111"},"nac":{"name":"Acetylcysteine","el":"C C O N C C S C O O H H H H H H H H H","xyz":"QAH0/xkAqgD1//X/jgDi/4H/TAAMAGIAu/8TAGIAjf+iAEQAwP/QAJ3/d/+u/wgAE//K/8j/q/8q//3/WwFVAEIAeQHg/7//UgGm/2MAeAAaAL4Am//+/8oAIP+oAEwAuv/mAIwALAAfAaP/zv8E/08A","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABAAHAAcACAAHAAkAAAAKAAAACwAAAAwAAwANAAQADgAFAA8ABQAQAAYAEQAJABIA","o":"121111121111111111"},"sulfate":{"name":"Sulfate","el":"O S O O O H H","xyz":"bv+d/wAAAAACAAAAAABiAIUAAABiAHv/kgCd/wAAev96/6b/egBo/7P/","b":"AAABAAEAAgABAAMAAQAEAAAABQAEAAYA","o":"122111"},"phenol":{"name":"Phenol","el":"O C C C C C C H H H H H H","xyz":"Dv8AAAAAnP/+/wAA3f+J/wAAcACH/wAAtQD6/wAAbQB7AAAA5/98AAAA4v6p/wAApv8s/wAApgAo/wAAIgH5/wAApQDYAAAAsv/cAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAAABwACAAgAAwAJAAQACgAFAAsABgAMAA==","o":"1212121111111"},"methanol":{"name":"Methanol","el":"C O H H H H","xyz":"5//5/xwAGwD0/5j/k/8/AB8ANQAbAGAAxf+W/zkAcAAjAJT/","b":"AAABAAAAAgAAAAMAAAAEAAEABQA=","o":"11111"},"benzene":{"name":"Benzene","el":"C C C C C C H H H H H H","xyz":"bACn/wAAhgAqAAAAFwCLAAAAmP9fAAAAfP/P/wAA4f93/wAAvwBf/wAA7QBOAAAALAD2AAAARv+nAAAAFf+r/wAAzf8M/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAAAAUAAAAGAAEABwACAAgAAwAJAAQACgAFAAsA","o":"212121111111"},"choline":{"name":"Choline","el":"C N C C C C O H H H H H H H H H H H H H H","xyz":"f/+S/00Asv8EAAIATf8uAKL/zv9zAFsAIwDc/6//mwDA/wcA9QAuAP7/Gv97/ywAfv+q/7cAv/87/zwAN//c/17/8v5LANf/cv+DAGn/AQBOALUAcf+jAHgADgC8ACkACQCC/3f/OgArAGj/fQC0/28AzwBl/+b/MgEsAEkA","b":"AAABAAEAAgABAAMAAQAEAAQABQAFAAYAAAAHAAAACAAAAAkAAgAKAAIACwACAAwAAwANAAMADgADAA8ABAAQAAQAEQAFABIABQATAAYAFAA=","o":"11111111111111111111"}});


// @scene liver makeLiver | Печень: обезвреживание, алкоголь, парацетамол | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ПЕЧЕНЬ: печёночная долька (зоны, кровоток, желчь; жировая инфильтрация, цирроз),
   микросомальное окисление (НАДФН → ФП → b5 → P450) и конъюгация, обмен этанола (АДГ, АльДГ, МЭОС),
   парацетамол → NAPQI → глутатион, антидот ацетилцистеин
   ========================================================= */
function makeLiver() {
  __set_rnd(mulberry(2701));
  const scene = bioStage({ bg: 0x0a0807, rim: 0xc87a4a });
  const VIEW = { lob: flyTarget(V3(0.6, -2.0, 0), V3(1.0, 2.6, 18.5)), detox: flyTarget(V3(40.4, -2.3, 0), V3(40.9, -0.4, 17)), alc: flyTarget(V3(79.0, -2.4, 0), V3(79.5, -0.7, 17)), para: flyTarget(V3(119.1, -2.4, 0), V3(119.6, -0.7, 17)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.lob.pos);
  const controls = makeControls(camera, VIEW.lob.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);
  const molAt = (parent, m, pos, R, o = {}) => { const s = molFit(m, R); const g = molMesh(m, { scale: s, hideH: true, ...o }); const w = new THREE.Group(); w.add(g); w.position.copy(pos); parent.add(w); return w; };
  const dm = new THREE.Object3D();

  /* ---------- 1. печёночная долька ---------- */
  const G1 = new THREE.Group(); G1.position.set(1.2, 0.3, 0); G1.rotation.x = -0.55; scene.add(G1);
  const R = 3.0, NR = 24, NC = 8;
  const cv = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.9, 32, 1, true), organMat('#4A5AA0', 0.5, { side: THREE.DoubleSide })); cv.rotation.x = Math.PI / 2; G1.add(cv);
  const hexR = (a) => R * Math.cos(Math.PI / 6) / Math.cos(((a % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3) - Math.PI / 6);
  const cells = []; for (let i = 0; i < NR; i++) { const a = (i + 0.5) / NR * Math.PI * 2; const L = hexR(a); for (let j = 0; j < NC; j++) { const r = 0.55 + (L - 0.75) * (j + 0.5) / NC; cells.push({ a, r, i, j, L }); } }
  const cellMesh = new THREE.InstancedMesh((() => { const g = smoothIco(1, 2); g.computeVertexNormals(); return g; })(), new THREE.MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.3, envMapIntensity: 0.4 }), cells.length); G1.add(cellMesh);
  const fatMesh = new THREE.InstancedMesh(SPH, new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F2D06A').multiplyScalar(0.5), roughness: 0.25, clearcoat: 0.8, emissive: 0xf2c14e, emissiveIntensity: 0.08 }), cells.length); G1.add(fatMesh);
  const tri = []; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const p = V3(Math.cos(a) * R, Math.sin(a) * R, 0); const g = new THREE.Group(); g.position.copy(p); G1.add(g);
    [['#8A4AB0', 0.2, V3(0, 0, 0)], ['#E04A4A', 0.1, V3(0.24, 0.16, 0)], ['#5CC48A', 0.09, V3(-0.22, 0.18, 0)]].forEach(([c, r, o]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.95, 20), organMat(c, 0.5, { emissiveIntensity: 0.1 })); m.rotation.x = Math.PI / 2; m.position.copy(o); g.add(m); }); tri.push(p); }
  const septa = new THREE.Group(); G1.add(septa); for (let k = 0; k < 6; k++) { const a = tri[k], b = tri[(k + 1) % 6]; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, a.distanceTo(b), 10), organMat('#D8D0C8', 0.45)); m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize()); septa.add(m); }
  for (let k = 0; k < 3; k++) { const a = tri[k], b = tri[k + 3]; const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, a.distanceTo(b) * 0.82, 8), organMat('#D8D0C8', 0.4)); m.position.set(0, 0, 0.1); m.quaternion.setFromUnitVectors(V3(0, 1, 0), b.clone().sub(a).normalize()); septa.add(m); }
  const NB = 220; const blood = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), NB); G1.add(blood);
  const bp = Array.from({ length: NB }, (_, i) => ({ a: (Math.floor(rnd() * NR)) / NR * Math.PI * 2, u: rnd(), bile: i < 50, z: rand(-0.3, 0.3) }));
  const zoneRing = [1, 2, 3].map((z) => { const m = new THREE.Mesh(new THREE.RingGeometry(0.55 + (z - 1) * 0.83, 0.57 + (z - 1) * 0.83 + 0.02, 6, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, side: THREE.DoubleSide })); m.position.z = 0.5; G1.add(m); return m; });

  /* ---------- 2. обезвреживание: микросомальное окисление ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const er = schemBilayer({ w: 11, d: 3.2, thick: 0.75, step: 0.22, head: '#C8A0E0', tail: '#9A86B0', seed: 5 }); er.position.set(0.6, -1.2, -0.6); G2.add(er);
  const blob = (c, rx, ry, rz, p, seed) => { const m = new THREE.Mesh(blobGeo(rx, ry, rz, seed, 0.12, 4), protMat(c, 0.45)); m.position.copy(p); G2.add(m); return m; };
  const FP = blob('#F2C14E', 0.55, 0.45, 0.45, V3(-2.9, -0.35, 0), 2), B5 = blob('#FF9A5C', 0.32, 0.5, 0.3, V3(-1.35, -0.35, 0), 3), P450 = blob('#E05A6A', 0.85, 0.7, 0.6, V3(0.6, -0.15, 0), 4), UGT = blob('#7FE0A0', 0.7, 0.6, 0.55, V3(3.3, -0.2, 0), 6);
  const hem = PDB('hbo').ligm.find((l) => l.name === 'HEM'); const hS = 0.07; const hemM = molMesh(hem, { scale: hS }); { const c = V3(0, 0, 0); for (let i = 0; i < hem.n; i++) c.add(V3(hem.xyz[i * 3], hem.xyz[i * 3 + 1], hem.xyz[i * 3 + 2])); c.multiplyScalar(-hS / hem.n); hemM.position.copy(c); }
  const hemW = new THREE.Group(); hemW.add(hemM); hemW.position.set(0.6, 0.3, 0.6); hemW.rotation.x = 1.2; G2.add(hemW); P450.material.transparent = true; P450.material.opacity = 0.75;
  const nadph = molAt(G2, MOL('nad'), V3(-3.9, 1.0, 0.2), 0.75, { tint: '#9FB4FF' });
  const eTok = Array.from({ length: 6 }, () => glowNucleus(G2, V3(0, 0, 0), '#7FD6FF', 0.04, 5));
  const ePath = new THREE.CatmullRomCurve3([V3(-4.0, 0.5, 0.3), V3(-2.9, 0.25, 0.5), V3(-1.35, 0.3, 0.45), V3(0.2, 0.35, 0.6)]);
  const sub = { benz: molAt(G2, MOL('benzene'), V3(0, 0, 0), 0.5), phen: molAt(G2, MOL('phenol'), V3(0, 0, 0), 0.55), gluc: molAt(G2, MOL('glucuronic'), V3(0, 0, 0), 0.55, { tint: '#7FE0A0' }) };
  const o2 = molAt(G2, MOL('o2'), V3(0, 0, 0), 0.3), h2o = molAt(G2, MOL('h2o'), V3(0, 0, 0), 0.3, { hideH: false });
  const PATH = new THREE.CatmullRomCurve3([V3(-3.4, 2.9, 0.3), V3(-1.6, 2.0, 0.6), V3(0.6, 1.05, 0.7), V3(1.9, 1.5, 0.7), V3(3.3, 0.95, 0.7), V3(4.8, 2.0, 0.5), V3(6.0, 2.8, 0.3)]);
  const P2 = 4; const cyp = [P450]; for (let i = 0; i < P2; i++) { const m = P450.clone(); m.material = P450.material.clone(); m.scale.setScalar(0.55); m.position.set(-3.8 + i * 2.6 + 1.3, -0.25, -1.2); m.visible = false; G2.add(m); cyp.push(m); }

  /* ---------- 3. алкоголь ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const AX = [V3(-4.6, 0.3, 0), V3(-1.4, 0.3, 0), V3(1.8, 0.3, 0), V3(4.8, 0.3, 0)];
  const am = [molAt(G3, MOL('ethanol'), AX[0], 0.55), molAt(G3, MOL('acetaldehyde'), AX[1], 0.55), molAt(G3, MOL('acetate'), AX[2], 0.55), molAt(G3, MOL('acetylcoa'), AX[3], 1.1)];
  const aArr = [0, 1, 2].map((i) => flowArrow(G3, AX[i].clone().add(V3(0.8, 0, 0)), AX[i + 1].clone().add(V3(i === 2 ? -1.35 : -0.8, 0, 0)), '#F2C14E', { bend: 0.1, r: 0.026 }));
  const meos = flowArrow(G3, AX[0].clone().add(V3(0.4, -0.7, 0)), AX[1].clone().add(V3(-0.4, -0.7, 0)), '#C77DFF', { bend: -0.35, r: 0.018 });
  const nadT = [0, 1].map((i) => { const g = new THREE.Group(); g.position.copy(AX[i].clone().lerp(AX[i + 1], 0.5)).add(V3(0, 1.25, 0)); G3.add(g); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 8, 40), new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.6 })); g.add(ring); const tok = glowNucleus(g, V3(0.32, 0, 0), '#9FB4FF', 0.05, 5); return { g, tok }; });
  const blk = [0, 1].map((i) => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: 0xff3a4a }); [0.8, -0.8].forEach((r) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.07), m); b.rotation.z = r; g.add(b); }); g.position.copy(AX[i].clone().lerp(AX[i + 1], 0.5)).add(V3(0, 0.05, 0.3)); g.visible = false; G3.add(g); return g; });
  const BARS = [['NADH / NAD⁺', '#9FB4FF'], ['lactate', '#FF6A6A'], ['fat synthesis', '#F2D06A'], ['gluconeogenesis', '#7FE0A0']];
  const barM = BARS.map(([, c], i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1, 0.4), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.45), emissive: new THREE.Color(c), emissiveIntensity: 0.05, roughness: 0.35, clearcoat: 0.6 })); m.position.set(-2.4 + i * 1.6, -2.3, 0); G3.add(m); return m; });
  const barBase = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.04, 0.8), new THREE.MeshBasicMaterial({ color: 0x3a3a46 })); barBase.position.set(0, -2.3, 0); G3.add(barBase);

  /* ---------- 4. парацетамол ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const PX = { apap: V3(-1.4, 0.15, 0), glu: V3(-4.2, 1.15, 0), sul: V3(-4.2, -1.1, 0), napqi: V3(1.6, 0.15, 0), safe: V3(4.6, 1.2, 0), tox: V3(4.6, -1.1, 0) };
  const pm = { apap: molAt(G4, MOL('paracetamol'), PX.apap, 0.75), napqi: molAt(G4, MOL('napqi'), PX.napqi, 0.72) };
  { const g = new THREE.Group(); g.position.copy(PX.glu); G4.add(g); molAt(g, MOL('paracetamol'), V3(-0.4, 0, 0), 0.6); molAt(g, MOL('glucuronic'), V3(0.55, -0.15, 0.2), 0.5, { tint: '#7FE0A0' }); pm.glu = g; }
  { const g = new THREE.Group(); g.position.copy(PX.sul); G4.add(g); molAt(g, MOL('paracetamol'), V3(-0.3, 0, 0), 0.6); molAt(g, MOL('sulfate'), V3(0.55, -0.1, 0.2), 0.35); pm.sul = g; }
  { const g = new THREE.Group(); g.position.copy(PX.safe); G4.add(g); molAt(g, MOL('napqi'), V3(-0.45, 0, 0), 0.55); molAt(g, MOL('gsh'), V3(0.5, -0.1, 0.2), 0.75, { tint: '#7FD6FF' }); pm.safe = g; }
  const toxP = new THREE.Mesh(blobGeo(0.7, 0.55, 0.5, 11, 0.14, 4), protMat('#B07A6A', 0.4)); toxP.position.copy(PX.tox); G4.add(toxP); const toxN = molAt(G4, MOL('napqi'), PX.tox.clone().add(V3(-0.5, 0.45, 0.45)), 0.4);
  const pArr = [['apap', 'glu', '#7FE0A0'], ['apap', 'sul', '#F2CC3A'], ['apap', 'napqi', '#FF6A6A'], ['napqi', 'safe', '#7FD6FF'], ['napqi', 'tox', '#FF3A4A']].map(([a, b, c]) => { const pa = PX[a], pb = PX[b]; const d = pb.clone().sub(pa).normalize(); return { a, b, A: flowArrow(G4, pa.clone().addScaledVector(d, 0.85), pb.clone().addScaledVector(d, -0.9), c, { bend: 0.1, r: 0.024 }) }; });
  const gshTube = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.8, 32, 1, true), glassMat(0x7fd6ff, { rim: 0.35, base: 0.01 })); gshTube.position.set(1.6, -1.55, 0); G4.add(gshTube);
  const gshFill = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1, 32), new THREE.MeshPhysicalMaterial({ color: 0x2a6a8a, emissive: 0x7fd6ff, emissiveIntensity: 0.25, transparent: true, opacity: 0.85, roughness: 0.2 })); G4.add(gshFill);
  const nacM = molAt(G4, MOL('nac'), V3(0.2, -1.7, 0.3), 0.5); const nacArr = flowArrow(G4, V3(0.65, -1.7, 0.3), V3(1.15, -1.6, 0.3), '#7FD6FF', { bend: 0.0, r: 0.02 });
  const hep = new THREE.Mesh(blobGeo(6.8, 3.0, 0.6, 13, 0.05, 4), new THREE.MeshPhysicalMaterial({ color: 0x3a2018, roughness: 0.7, transparent: true, opacity: 0.16, depthWrite: false })); hep.position.set(0.1, 0.1, -1.4); G4.add(hep);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'lob', labels: true, rot: false, fly: null, msg: null, lob: 'norm', zones: false, ind: false, inh: false, dc: 0, drinks: 4, ah: 0, play: true, bac: 0, ald: 0, disulf: false, fome: false, dose: 4, ph: 0, gsh: 1, dmg: 0, nac: false, chron: false, hist: [], phist: [] };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['lob', 'detox', 'alc', 'para'][k] === m; }); st.fly = VIEW[m]; st.msg = null; if (m === 'alc') resetAlc(); if (m === 'para') resetPara(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function resetAlc() { st.ah = 0; st.bac = 0; st.ald = 0; st.gut = st.drinks * 14; st.hist = []; }
  function resetPara() { st.ph = 0; st.gsh = st.chron ? 0.6 : 1; st.dmg = 0; st.phist = []; st.pgut = st.dose; }
  const col = new THREE.Color();
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'lob') {
      const fat = st.lob === 'fat', cir = st.lob === 'cir';
      cells.forEach((c, k) => {
        const n = noise3(c.a * 3, c.r * 2, 0.3); const rr = c.r * (cir ? 0.92 + 0.08 * Math.sin(c.a * 6) : 1);
        const w = (c.L - 0.75) / NC * 0.5, s = cir ? 0.6 + 0.4 * (0.5 + 0.5 * n) : 1;
        dm.position.set(Math.cos(c.a) * rr, Math.sin(c.a) * rr, 0); dm.rotation.set(0, 0, c.a); dm.scale.set(w * 0.95 * s, Math.max(0.05, rr * Math.PI * 2 / NR * 0.36) * s, 0.36 * s); dm.updateMatrix(); cellMesh.setMatrixAt(k, dm.matrix);
        const zone = c.j / NC; col.set(st.zones ? (zone < 0.33 ? '#C0603A' : zone < 0.66 ? '#B07A50' : '#8A5A7A') : '#B0603F').multiplyScalar(0.45 + 0.05 * n);
        if (cir) col.lerp(new THREE.Color('#5A4A40'), 0.25 + 0.25 * n); cellMesh.setColorAt(k, col);
        const fs = fat ? (0.3 + 0.7 * (1 - zone * 0.6)) * (0.5 + 0.5 * Math.abs(n * 2)) : 0; dm.scale.setScalar(Math.max(0.0001, fs * w * 0.95)); dm.position.z = 0.24; dm.updateMatrix(); fatMesh.setMatrixAt(k, dm.matrix);
      });
      cellMesh.instanceMatrix.needsUpdate = true; if (cellMesh.instanceColor) cellMesh.instanceColor.needsUpdate = true; fatMesh.instanceMatrix.needsUpdate = true;
      septa.visible = cir;
      bp.forEach((q, i) => { q.u += dt * (cir ? 0.06 : 0.15) * (q.bile ? 0.8 : 1); if (q.u > 1) { q.u = 0; q.a = (Math.floor(rnd() * NR)) / NR * Math.PI * 2; } const L = hexR(q.a); const r = q.bile ? 0.5 + q.u * (L - 0.5) : L - q.u * (L - 0.4); dm.position.set(Math.cos(q.a) * r, Math.sin(q.a) * r, q.z * 0.6 + 0.25); dm.rotation.set(0, 0, 0); dm.scale.setScalar(q.bile ? 0.03 : 0.034); dm.updateMatrix(); blood.setMatrixAt(i, dm.matrix); blood.setColorAt(i, col.set(q.bile ? '#3A9A60' : '#B03030').lerp(new THREE.Color('#5A3A90'), q.bile ? 0 : q.u * 0.8)); });
      blood.instanceMatrix.needsUpdate = true; if (blood.instanceColor) blood.instanceColor.needsUpdate = true;
      zoneRing.forEach((m) => { m.material.opacity = st.zones ? 0.22 : 0; });
    }
    if (st.mode === 'detox') {
      const sp = (st.ind ? 1.8 : 1) * (st.inh ? 0.25 : 1); st.dc = (st.dc + dt * 0.12 * sp) % 1; const u = st.dc;
      const p = PATH.getPoint(u);
      sub.benz.visible = u < 0.36; sub.phen.visible = u >= 0.36; sub.gluc.visible = true;
      [sub.benz, sub.phen].forEach((m) => { m.position.copy(p); m.rotation.y = t; });
      sub.gluc.position.lerp(u < 0.62 ? V3(3.9, 0.45, 0.85) : p.clone().add(V3(0.75, -0.15, 0)), u < 0.62 ? 0.05 : 0.3); sub.gluc.rotation.y = -t * 0.8;
      const near = Math.exp(-(((u - 0.33) / 0.06) ** 2)); molGlow(sub.benz, 0.4 * near);
      o2.position.copy(V3(0.6, 1.0, 0.7).lerp(V3(1.2, 3.0, 0.4), 1 - smooth(0.18, 0.33, u))); o2.visible = u > 0.12 && u < 0.36;
      h2o.position.copy(V3(0.9, 0.9, 0.7).lerp(V3(2.2, 2.9, 0.4), smooth(0.36, 0.55, u))); h2o.visible = u > 0.36 && u < 0.55;
      P450.material.emissiveIntensity = 0.03 + 0.35 * near; UGT.material.emissiveIntensity = 0.03 + 0.3 * Math.exp(-(((u - 0.64) / 0.05) ** 2));
      eTok.forEach((e, i) => { const q = (t * 0.35 * sp + i / eTok.length) % 1; e.spr.position.copy(ePath.getPoint(q)); e.core.position.copy(e.spr.position); });
      nadph.rotation.y = t * 0.3; hemW.rotation.z = t * 0.2;
      cyp.forEach((m, i) => { if (i) m.visible = st.ind; });
    }
    if (st.mode === 'alc') {
      if (st.play) st.ah += dt * 0.6; // 1 с = 0,6 ч
      const h = st.ah; const step = dt * 0.6 * (st.play ? 1 : 0);
      const abs = st.gut * (1 - Math.exp(-step * 2.2)); st.gut -= abs; // всасывание, г этанола
      const Vd = 70 * 0.68; // л (масса 70 кг)
      const adh = st.fome ? 0.15 : 1; const elim = Math.min(st.bac * Vd, (7.5 + (st.bac > 0.8 ? 1.5 : 0)) * adh * step); // ~7–9 г/ч
      st.bac = Math.max(0, st.bac + (abs - elim) / Vd); // г/л ≈ промилле
      st.ald = Math.max(0, st.ald + (elim * 0.4 - st.ald * (st.disulf ? 0.25 : 3.0) * step * 4) * 0.25);
      if (st.play && (st.hist.length === 0 || h - st.hist[st.hist.length - 1][0] > 0.1)) st.hist.push([h, st.bac, st.ald]);
      if (h > 14) resetAlc();
      const act = clamp(st.bac / 0.8, 0, 1) * adh;
      aArr.forEach((A, i) => { A.mat.uniforms.uTime.value = t; A.mat.uniforms.uOn.value = 0.1 + 0.55 * (i === 0 ? act : i === 1 ? (st.disulf ? 0.05 : act) : act * 0.8); });
      meos.mat.uniforms.uTime.value = t; meos.mat.uniforms.uOn.value = st.bac > 0.8 ? 0.6 : 0.05;
      am.forEach((m, i) => { m.rotation.y = t * 0.4 + i; });
      molGlow(am[1], clamp(st.ald * (st.disulf ? 1.5 : 0.6), 0, 0.6)); am[1].scale.setScalar(1 + clamp(st.ald, 0, 1) * 0.3);
      nadT.forEach((n, i) => { n.tok.spr.position.set(Math.cos(t * 3 * act + i) * 0.32, Math.sin(t * 3 * act + i) * 0.32, 0); n.tok.core.position.copy(n.tok.spr.position); });
      blk[0].visible = st.fome; blk[1].visible = st.disulf;
      const r = act; const vals = [0.25 + 0.75 * r, 0.2 + 0.7 * r, 0.25 + 0.6 * r, 0.9 - 0.65 * r];
      barM.forEach((m, i) => { const v = vals[i] * 1.5; m.scale.y += (v - m.scale.y) * Math.min(1, dt * 2); m.position.y = -2.3 + m.scale.y / 2; });
    }
    if (st.mode === 'para') {
      if (st.play) st.ph += dt * 0.8; const step = dt * 0.8 * (st.play ? 1 : 0); const h = st.ph;
      const absb = st.pgut * (1 - Math.exp(-step * 1.5)); st.pgut -= absb; st.pl = (st.pl || 0) + absb - (st.pl || 0) * step * 0.35;
      const conjCap = 1.2; const load = st.pl || 0; const conj = Math.min(load, conjCap) * 0.9; const cypFrac = (st.chron ? 0.14 : 0.07) + (load > conjCap ? 0.12 * (load - conjCap) / load : 0);
      const napqi = load * cypFrac * step * 0.24;
      const useG = Math.min(st.gsh, napqi * 0.9); st.gsh = clamp(st.gsh - useG + step * (st.nac ? 0.3 : 0.012) * (1 - st.gsh), 0, 1);
      const free = napqi - useG + (st.gsh < 0.3 ? napqi * (0.3 - st.gsh) * 3 : 0); st.dmg = clamp(st.dmg + free * 1.3, 0, 1); st.napqiRate = napqi / Math.max(step, 1e-6);
      if (st.play && (st.phist.length === 0 || h - st.phist[st.phist.length - 1][0] > 0.15)) st.phist.push([h, st.gsh, st.dmg, load]);
      if (h > 48) resetPara();
      const on = [conj > 0.01 ? 0.55 : 0.08, conj > 0.01 ? 0.4 : 0.06, clamp(cypFrac * 4 * Math.min(1, load), 0.06, 0.8), st.gsh > 0.3 ? clamp(load, 0.06, 0.6) : 0.08, st.gsh < 0.3 ? 0.7 : 0.03];
      pArr.forEach((A, i) => { A.A.mat.uniforms.uTime.value = t; A.A.mat.uniforms.uOn.value = on[i]; });
      gshFill.scale.y = Math.max(0.01, st.gsh * 1.7); gshFill.position.set(1.6, -1.55 - 0.9 + gshFill.scale.y / 2 + 0.02, 0); gshFill.material.emissiveIntensity = 0.1 + 0.25 * st.gsh;
      molGlow(pm.napqi, clamp(cypFrac * 2, 0, 0.5)); toxN.visible = st.gsh < 0.3 || st.dmg > 0.05; molGlow(toxN, 0.4);
      hep.material.color.set(new THREE.Color('#3a2018').lerp(new THREE.Color('#141010'), st.dmg)); toxP.material.emissiveIntensity = 0.02 + 0.3 * st.dmg;
      nacM.visible = st.nac; nacArr.mesh.visible = st.nac; if (nacArr.cone) nacArr.cone.visible = st.nac; nacArr.mat.uniforms.uTime.value = t;
      Object.values(pm).forEach((m, i) => { m.rotation.y = Math.sin(t * 0.5 + i) * 0.5; });
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, hh) {
    if (st.mode === 'alc') {
      scopeShow(true); const A = plotAxes(ctx, w, hh, { title: 'blood alcohol, ‰ · acetaldehyde', xl: '0–14 h', yl: '' });
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; [0.5, 1, 2].forEach((v) => { ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(v / 2.5)); ctx.lineTo(A.X(1), A.Y(v / 2.5)); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText(v + '‰', A.X(0) + 2, A.Y(v / 2.5) - 2); });
      const H = st.hist; const line = (k, c, sc) => { if (H.length < 2) return; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); H.forEach((p, i) => { const x = A.X(p[0] / 14), y = A.Y(clamp(p[k] / sc, 0, 1)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      line(1, '#F2C14E', 2.5); line(2, '#FF6A6A', 1.2);
    } else if (st.mode === 'para') {
      scopeShow(true); const A = plotAxes(ctx, w, hh, { title: 'liver glutathione · damage', xl: '0–48 h', yl: '' });
      const H = st.phist; const line = (k, c) => { if (H.length < 2) return; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); H.forEach((p, i) => { const x = A.X(p[0] / 48), y = A.Y(clamp(p[k], 0, 1)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); };
      ctx.fillStyle = 'rgba(255,90,90,.1)'; ctx.fillRect(A.X(0), A.Y(0.3), A.X(1) - A.X(0), A.Y(0) - A.Y(0.3));
      line(1, '#7FD6FF'); line(2, '#FF5A5A');
      ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillStyle = '#7FD6FF'; ctx.fillText('GSH', A.X(0.02), A.Y(0.92)); ctx.fillStyle = '#FF5A5A'; ctx.fillText('necrosis', A.X(0.85), A.Y(0.08)); ctx.fillStyle = 'rgba(255,120,120,.6)'; ctx.fillText('GSH < 30%', A.X(0.6), A.Y(0.24));
    } else scopeShow(false);
  }
  const TXT = {
    lob: '<b>The liver lobule</b> is a hexagonal prism ~1 mm across: the central vein runs through the middle, and <b>portal tracts</b> sit at the corners (a branch of the portal vein — purple, of the hepatic artery — red, a bile duct — green). Blood from the intestine and the artery flows through sinusoids between cords of <b>hepatocytes</b> toward the central vein, while bile flows the opposite way, through bile canaliculi to the ducts. Everything absorbed from the intestine passes through the liver first. About 60% of liver cells are hepatocytes — the “prototype” of all cells in terms of their set of enzymes.',
    detox: '<b>Phase I — microsomal oxidation.</b> A short electron transport chain operates in the ER membranes of hepatocytes: <b>NADPH → flavoprotein (FAD) → cytochrome b5 → cytochrome P450</b>. P450 is a heme monooxygenase: it inserts one atom of O₂ into the substrate (RH → R–OH), and the other goes to water. The hydrophobic substance (here benzene) gains a hydroxyl group (phenol). <b>Phase II — conjugation</b>: glucuronic acid (from UDP-glucuronate), sulfate (from PAPS), glutathione, an acetyl or a methyl group is attached to the OH group, producing a water-soluble conjugate that leaves in urine or bile.',
    alc: '<b>Ethanol metabolism.</b> 90–98% of alcohol is oxidized in the liver: <b>alcohol dehydrogenase</b> (cytosol) → acetaldehyde → <b>aldehyde dehydrogenase</b> (mitochondria) → acetate → acetyl-CoA. Both reactions reduce NAD⁺ to NADH. At high doses <b>MEOS</b> joins in — cytochrome P450 2E1, which is induced in drinkers (hence “tolerance” and the liver’s increased sensitivity to poisons). The liver oxidizes only ~7–9 g of ethanol per hour (≈ 0.1–0.15 ‰ per hour), regardless of concentration. The shift in <b>NADH/NAD⁺</b> inhibits gluconeogenesis (hypoglycemia) and increases lactate and fat synthesis (fatty liver).',
    para: '<b>Acetaminophen (paracetamol)</b> at a normal dose is 90% conjugated with glucuronic acid and sulfate. 5–10% is oxidized by cytochrome P450 2E1 to the reactive <b>NAPQI</b>, which is immediately neutralized by <b>glutathione</b> (GSH). In an overdose (more than 7–10 g in an adult) conjugation is saturated, more goes to NAPQI, the glutathione store is depleted, and NAPQI binds to hepatocyte proteins (centrilobular necrosis; after 2–4 days, liver failure). The antidote is <b>N-acetylcysteine</b>, a source of cysteine for glutathione synthesis: it works best within the first 8–10 hours.',
  };
  const LTXT = { norm: null, fat: '<b>Fatty infiltration</b> (steatosis): triacylglycerols accumulate as droplets in hepatocytes when their inflow (lipolysis in diabetes and fasting, excess carbohydrates) exceeds their export in VLDL. Export requires phospholipids — a lack of <b>lipotropic factors</b> (methionine, choline) and of protein, as well as alcohol and poisons, disrupts VLDL synthesis.', cir: '<b>Cirrhosis</b> is the end stage of chronic injury (alcohol, viral hepatitis, steatohepatitis): dying hepatocytes are replaced by connective tissue, and septa divide the lobules into nodules, disrupting blood flow (portal hypertension, ascites) and every liver function: albumin and clotting factors fall, while blood ammonia (encephalopathy) and bilirubin rise.' };
  const labels = [
    { text: 'central vein', get pos() { return G1.localToWorld(V3(0.4, 0.45, 0.6)); }, color: '#7F8AE0', show: () => st.labels && st.mode === 'lob' },
    { text: 'portal vein', get pos() { return G1.localToWorld(tri[0].clone().add(V3(0.3, -0.35, 0.6))); }, color: '#B07AE0', show: () => st.labels && st.mode === 'lob' },
    { text: 'hepatic artery', get pos() { return G1.localToWorld(tri[1].clone().add(V3(0.45, 0.3, 0.6))); }, color: '#FF6A6A', show: () => st.labels && st.mode === 'lob' },
    { text: 'bile duct', get pos() { return G1.localToWorld(tri[2].clone().add(V3(-0.3, 0.4, 0.6))); }, color: '#5CC48A', show: () => st.labels && st.mode === 'lob' },
    { text: 'hepatocytes', get pos() { return G1.localToWorld(V3(1.5, -1.6, 0.5)); }, color: '#E09070', show: () => st.labels && st.mode === 'lob' },
    { text: 'zone 1 · periportal', get pos() { return G1.localToWorld(V3(-2.0, -1.55, 0.6)); }, color: '#E0805A', show: () => st.labels && st.mode === 'lob' && st.zones },
    { text: 'zone 3 · near the central vein', get pos() { return G1.localToWorld(V3(-0.35, -0.8, 0.6)); }, color: '#C08AD0', show: () => st.labels && st.mode === 'lob' && st.zones },
    ...[['NADPH', V3(-3.9, 1.9, 0.3), '#9FB4FF'], ['flavoprotein (FAD)', V3(-2.9, -1.15, 0.6), '#F2C14E'], ['cyt. b5', V3(-1.35, -1.15, 0.6), '#FF9A5C'], ['cytochrome P450 · heme', V3(0.6, -1.2, 0.7), '#FF6A7A'], ['UDP-glucuronosyltransferase', V3(3.3, -1.15, 0.7), '#7FE0A0'], ['ER membrane', V3(-4.6, -2.15, 0.5), '#C8A0E0'], ['benzene (hydrophobic)', V3(-3.4, 3.5, 0.3), '#EFEAE6'], ['into blood → kidneys, into bile', V3(5.6, 3.35, 0.3), '#7FE0A0']].map(([n, p, c]) => ({ text: n, pos: p.clone().add(V3(40, 0, 0)), color: c, show: () => st.labels && st.mode === 'detox' })),
    { text: 'O₂', get pos() { return G2.localToWorld(o2.position.clone().add(V3(0.35, 0.1, 0))); }, color: '#F04848', show: () => st.labels && st.mode === 'detox' && o2.visible },
    { text: 'phenol + glucuronic acid', get pos() { return G2.localToWorld(sub.phen.position.clone().add(V3(0, 0.7, 0))); }, color: '#7FE0A0', show: () => st.labels && st.mode === 'detox' && st.dc > 0.68 && st.dc < 0.95 },
    { text: 'induction: more P450', pos: V3(40 + 0.6, -2.35, -1.0), color: '#FF6A7A', show: () => st.labels && st.mode === 'detox' && st.ind },
    ...[['ethanol', 0], ['acetaldehyde', 1], ['acetate', 2], ['acetyl-CoA', 3]].map(([n, i]) => ({ text: n, pos: AX[i].clone().add(V3(80, i === 3 ? -1.35 : -0.85, 0.3)), color: i === 1 ? '#FF8A6A' : '#EFEAE6', show: () => st.labels && st.mode === 'alc' })),
    { text: 'alcohol dehydrogenase', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, 0.42, 0.3)), color: '#F2C14E', show: () => st.labels && st.mode === 'alc' }, { text: 'aldehyde dehydrogenase', pos: AX[1].clone().lerp(AX[2], 0.5).add(V3(80, 0.42, 0.3)), color: '#F2C14E', show: () => st.labels && st.mode === 'alc' },
    { text: 'NAD⁺ → NADH', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, 1.75, 0)), color: '#9FB4FF', show: () => st.labels && st.mode === 'alc' }, { text: 'NAD⁺ → NADH', pos: AX[1].clone().lerp(AX[2], 0.5).add(V3(80, 1.75, 0)), color: '#9FB4FF', show: () => st.labels && st.mode === 'alc' },
    { text: 'MEOS (P450 2E1)', pos: AX[0].clone().lerp(AX[1], 0.5).add(V3(80, -1.55, 0.3)), color: '#C77DFF', show: () => st.labels && st.mode === 'alc' },
    ...BARS.map(([n, c], i) => ({ text: n, pos: V3(80 - 2.4 + i * 1.6, -2.65, 0.4), color: c, show: () => st.labels && st.mode === 'alc' })),
    ...[['acetaminophen', 'apap', -0.95, '#EFEAE6'], ['glucuronide ~55%', 'glu', -0.9, '#7FE0A0'], ['sulfate ~35%', 'sul', -0.85, '#F2CC3A'], ['NAPQI', 'napqi', 0.95, '#FF6A6A'], ['glutathione conjugate', 'safe', -0.95, '#7FD6FF'], ['NAPQI + cell proteins → necrosis', 'tox', -0.95, '#FF5A5A']].map(([n, k, dy, c]) => ({ text: n, pos: PX[k].clone().add(V3(120, dy, 0.3)), color: c, show: () => st.labels && st.mode === 'para' })),
    { text: 'P450 2E1 · 5–10%', pos: PX.apap.clone().lerp(PX.napqi, 0.5).add(V3(120, 0.4, 0.3)), color: '#FF8A8A', show: () => st.labels && st.mode === 'para' },
    { text: 'glutathione store', pos: V3(120 + 2.6, -2.55, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'para' }, { text: 'acetylcysteine', pos: V3(120 + 0.0, -2.3, 0.4), color: '#7FD6FF', show: () => st.labels && st.mode === 'para' && st.nac },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'lob' && LTXT[st.lob]) || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'lob', label: 'Liver lobule' }, { id: 'detox', label: 'Detoxification' }, { id: 'alc', label: 'Alcohol' }, { id: 'para', label: 'Acetaminophen (paracetamol)' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 560px' });
    const msg = (m) => { st.msg = m; refs.setInfo(); };
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'lob') box.append(h('div', { class: 'glabel' }, 'State'), h('div', { class: 'gctl' },
        seg([{ id: 'norm', label: 'Normal' }, { id: 'fat', label: 'Fatty infiltration' }, { id: 'cir', label: 'Cirrhosis' }], () => st.lob, (v) => { st.lob = v; st.msg = null; refs.setInfo(); }),
        toggle('Lobule zones', () => st.zones, (v) => { st.zones = v; msg(v ? '<b>Lobule zones</b> differ in oxygen and enzymes. <b>Zone 1</b> (near the portal tracts) receives more O₂ — gluconeogenesis, β-oxidation and urea synthesis take place here. <b>Zone 3</b> (near the central vein) is poor in oxygen and rich in cytochrome P450 and in enzymes of glycolysis and lipogenesis — which is why it is the first to suffer in acetaminophen and alcohol poisoning.' : null); })));
      else if (st.mode === 'detox') box.append(h('div', { class: 'glabel' }, 'P450 activity'), h('div', { class: 'gctl' },
        toggle('Inducers (phenobarbital, alcohol)', () => st.ind, (v) => { st.ind = v; if (v) st.inh = false; refs.rebuild(); msg(v ? '<b>Induction.</b> Phenobarbital, rifampin, chronic alcohol use and smoking increase P450 synthesis, and the ER expands. Drugs are broken down faster (a higher dose is needed), and some substances are converted faster into toxic metabolites.' : null); }),
        toggle('Inhibitors (grapefruit juice)', () => st.inh, (v) => { st.inh = v; if (v) st.ind = false; refs.rebuild(); msg(v ? '<b>Inhibition.</b> Grapefruit furanocoumarins, ketoconazole and clarithromycin block P450 3A4 — drugs broken down by it (statins, some calcium channel blockers) accumulate to toxic concentrations.' : null); })));
      else if (st.mode === 'alc') box.append(h('div', { class: 'glabel' }, 'Drinks (14 g of ethanol each) · 1 s = 36 min'), h('div', { class: 'gctl' },
        range('lvD', 1, 12, 1, () => st.drinks, (v) => { st.drinks = v; resetAlc(); }, (v) => `${v} drinks`),
        button('Restart', () => resetAlc(), true),
        toggle('Disulfiram', () => st.disulf, (v) => { st.disulf = v; resetAlc(); msg(v ? '<b>Disulfiram</b> (Antabuse) blocks aldehyde dehydrogenase, so acetaldehyde accumulates: flushing, palpitations, nausea, a drop in blood pressure. People with the inactive ALDH2*2 variant (up to 40% of East Asians) react the same way.' : null); }),
        toggle('Fomepizole', () => st.fome, (v) => { st.fome = v; resetAlc(); msg(v ? '<b>Fomepizole</b> blocks alcohol dehydrogenase. It is used as an antidote in <b>methanol</b> and ethylene glycol poisoning: alcohol dehydrogenase converts them into toxic formaldehyde/formic acid and oxalate. Ethanol itself has the same effect — it competes for the enzyme.' : null); })));
      else box.append(h('div', { class: 'glabel' }, 'Acetaminophen dose · 1 s = 48 min'), h('div', { class: 'gctl' },
        range('lvP', 1, 20, 1, () => st.dose, (v) => { st.dose = v; resetPara(); }, (v) => `${v} g`),
        button('Restart', () => resetPara(), true),
        toggle('Acetylcysteine', () => st.nac, (v) => { st.nac = v; msg(v ? '<b>N-acetylcysteine</b> supplies cysteine, the limiting amino acid for glutathione synthesis (γ-Glu-Cys-Gly), and also binds NAPQI itself. Turn it on before glutathione falls below 30% and there will be no liver damage.' : null); }),
        toggle('Chronic alcoholism', () => st.chron, (v) => { st.chron = v; resetPara(); msg(v ? '<b>Alcohol and acetaminophen</b> are a dangerous combination: P450 2E1 is induced (more NAPQI), and glutathione is low because of poor nutrition and oxidative stress. Even a dose of 4–6 g becomes toxic.' : null); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–4', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['lob', 'detox', 'alc', 'para'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'lob') return [['Liver mass', '~1.5', 'kg'], ['Blood flow', '~1.5', 'L/min']];
    if (st.mode === 'detox') return [['Detoxification rate', st.ind ? '↑ ×2' : st.inh ? '↓ ×4' : 'normal', '']];
    if (st.mode === 'alc') return [['Time', st.ah.toFixed(1), 'ч'], ['Blood alcohol', st.bac.toFixed(2), '‰'], ['Acetaldehyde', st.ald > 0.6 ? 'high' : st.ald > 0.2 ? 'present' : 'low', '']];
    return [['Time', st.ph.toFixed(0), 'ч'], ['Glutathione', Math.round(st.gsh * 100), '%'], ['Damage', Math.round(st.dmg * 100), '%']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E07A4A',
    kicker: 'Biochemistry · liver', title: 'Liver: detoxification',
    lede: 'The body’s main chemical factory: everything absorbed in the intestine passes through it first — drugs, alcohol and poisons alike.',
    notes: `
      <div><h2>Liver functions</h2><ul><li><b>Regulatory and homeostatic</b>: keeps the composition of the blood constant — glucose, proteins, lipoproteins.</li><li><b>Storage</b>: glycogen, fat-soluble vitamins, B₁₂, iron.</li><li><b>Detoxification</b>: oxidation, reduction, methylation, acetylation, conjugation, urea synthesis.</li><li><b>Excretory</b>: bile (cholesterol, bile acids, bilirubin).</li><li><b>Metabolic</b>: synthesis of 50% of the body’s proteins, all albumin and most clotting factors, ketone bodies, creatine, choline, uric acid.</li></ul>
        <h3>Liver function tests</h3><p>ALT, AST (hepatocyte damage), GGT and alkaline phosphatase (cholestasis), bilirubin, albumin and prothrombin time (synthetic function), ammonia.</p></div>
      <div><h2>Simplifications and models</h2><ul><li>The cytochrome P450 heme is shown using real heme coordinates (1GZX); the ER proteins themselves are schematic “blobs”.</li><li>Alcohol kinetics: first-order absorption, zero-order oxidation ~7.5 g/h, volume of distribution 0.68 L/kg for a 70 kg person.</li><li>The acetaminophen model is qualitative: saturation of conjugation, consumption and recovery of glutathione.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('lob'); st.fly = null;
  return self;
}
export { makeLiver };
