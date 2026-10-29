import { Sparks, THREE, V3, __set_rnd, bodyShell, displaceGeo, ell3, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, pickOn, randUnit, rnd, scopeShow, seg, toggle, tube } from '../core.js';
import { BIO_MOL, BIO_PDB, CYL, MOL, PDB, atomMat, bioStage, blobGeo, flowArrow, molFit, molGlow, molMesh } from './kit.js';
Object.assign(BIO_PDB, {"hbo":{"title":"Оксигемоглобин 1GZX, α-цепь","r":24.1,"chains":[{"id":"A","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCCHHHHHHHHHHHHHHCCCHHHHHHHHHHHHHHHCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHCCCCHHHHCHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHCCCCCCHHHHHHHHHHHHHHHHHHCCCCC","ca":"cgC5/qX/dADq/mz/fgDK/if/pwDv/vD+ZQD9/tH+TAAg/xH/jABH/xf/hQBf/9D+PAB1/9v+TACb/xr/iADB//z+XQDS/8H+HwDs/+n+SgAOAB7/bgApAOD+MgBTAMn+HwBtAA7/YgCPAAn/XADWACP/GADLAEL/LACWAHX/JgDJAK7/5P/kAJX/zP+bAI3/5v+HANT/wf/GAPL/gP+yAM3/iP9oAOT/jf9/ACsAT/+rACMAJv9wAAUAPv9GAEAAKf93AHgA5P6AAFYA0v43AEIA7v4ZAIUA7v5OALwADv8fAO0AUv8rAMwATP90AOcAXP9YACwBp/9bABkBpv+jAAEBhv/FAD4Bvf/9ADkBr/8KAe4Af/87AcwAVv8MAaIALf9BAYEAL/9BATMAbv9hARgAkv9cAVsA3P9qAU8A6P81AYIAxP8DAVcA6f8YARYAKQAXAT8AHQDOAFUABAC0ABEARgDKAPT/bgCkACcARQBmAB0ASQBuANH/lwB0ANn/mgAzAAIAdAAOAMv/oAArAJX/3AAQALr/vgDJ/8T/sgDI/3f/+wDh/2//EgGl/5b/3QB0/4T/EgE+/4r/JQFS/9D/5QBs//P/9ABR/zkANgF3/zwAHgG0/xQA5QC6/0gAAgGe/4oAAgHk/6YAuQDy/5oAqQCt/7UAzAC///cApgABAPoAYADj/+4AcgCo/xsBjQDI/1oBfwAQAFcBOwAXADIBHADS/0EB5f/U/wsBuf+X/woBxv9t/88AgP9v/7cAif+3/6MAvv+m/24AiP+D/0gAXP/D/0cAkv/y/zAAp/++//r/YP++/+D/W/8LAN7/n/8QALf/gv/d/4T/Qv8GAH//bf9GAHX/mP8nAD7/W/8KAB3/PP9RAB3/eP9vAPz+m/86AM3+X/8bAKz+hv8LAG/+uP/i/5j+jP/L/9D+gP+I/67+bP9F/8/+tP8q/8/+0v9t/+f+m/9v/xz/rf8l/zL/9/8+/zP/7v98/1r/wv9X/43/+P8j/5j/LABc/5//BQCE/9P/+f9D//f/QwA1//f/VgB8/w4AIgB3/0kAQAAz/1oAhwBT/2EAagCM/4sASQBd/70AfwAn/8AAnwBC//8AYQBF/ywBbgAM/14B","o":"vNTFY/QA5l8RAGT38Vzc11sK/mMKBV7ezlPo5VwdC2MA/VvX4F/8EGERJlwI6F3k2l0EEO1h8FI3rwo6udk60gZZpv8rrN8sydZIvf1LovYhvcQswttFrgI5qN8jwsUzzPFUpPYnw7IIYwcOKkE/OAVTYg4QLVQgJxVZYBQS0knO0VYTGGD0rt0tQ/q20sDCYfHt+GITUTfvHKrVUtfYT8P0KajnLrnKVtHpN6/tHLLJOLvSSLzzJKbpG7PGSM7QOK70HK/NMsq8TcbmJqXyJbrDVuTWCdFYxb4vJqcbJUNB8Vcu7ihaEUtABGMQvSVA2/Zc6SJbvBxEueZC2Ppc2QlcqAQvyNJF/hdhyiFNsSsrtP1BPrTr4D65EQWezfCr8VLJFjSu6QefyiKz9TyxDh6i6Aef3EzKBDetACGi0xqr8kC0DRyh7QKe00jKKEvLFqAT1qX6BqrOKqUHnf0QNQxUBepiO+BKNwhTFBhfFudePO5OHCJaDBNiJeRZQv5LGxpdC+9iMe1VPRJNDP1jE9pbM/NVCTtQ3MZJDKUoKTlI8DJVErpF","brk":[]}],"ligs":[{"el":"Fe C C C C N C C C C C C C C O O N C C C C C C C N C C C C C C C N C C C C C C C C O O","xyz":"JQAxAJMASwBjALIAUwAwAGAABAD9/3cA9f84AMIASQBEAIwAUwBaAJoAZwBmAIkAagBYAHMAWABDAHQAfgBdAFwAdgB+AJUAjABzAKgAogCJAKkAnQChAK8AuAB+AKIAKgAbAHIAPgAfAF8AOQANAEgAIwD+/04AGgAHAGgATAAMAC8AFgDq/zwAEADS/0AAAwAeAJwA9v8JAI0A3P8EAJcA2P8VAKsA8P8lAK8Ayv/v/4sAv/8ZAL4Apf8XALcAIQBIALQACwBKAMUADgBfANgAJgBqANIAMgBcALwA+/9oAO4ANACCAOAAJACbANYALwCyAOYANgDGANgAMQCwAP8A","b":"AAAFAAAAEAAAABgAAAAgAAEABgABACQAAgAJAAIAEQADABQAAwAZAAQAHAAEACEABQAGAAUACQAGAAcABwAIAAcACwAIAAkACAAKAAsADAAMAA0ADQAOAA0ADwAQABEAEAAUABEAEgASABMAEgAVABMAFAATABYAFgAXABgAGQAYABwAGQAaABoAGwAaAB0AGwAcABsAHgAeAB8AIAAhACAAJAAhACIAIgAjACIAJQAjACQAIwAmACYAJwAnACgAKAApACgAKgA=","name":"HEM","chain":"A","seq":1142},{"el":"O O","xyz":"FABFAIAAAABMAHQA","b":"AAABAA==","name":"OXY","chain":"A","seq":1143}],"res":[{"el":"N C C O C C N C C N","xyz":"GgDrAE8AHQDOAFUAGQC9ADsAJwCoADcADADIAG4AEQCsAHkAJQCkAIgAAwCVAHQAJQCKAIwAEACBAIEA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS58","chain":"A"},{"el":"N C C O C C N C C N","xyz":"ewDu/+4AYADj/+4AXgDO/wUBSADQ/xABVADY/9IATwDv/74AYwD8/7AAOAD8/7gAWAAQAKIAPgARAKYA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"A"}]}});
Object.assign(BIO_MOL, {"bilirubin":{"name":"Билирубин","el":"C C C C C C C C N C C C N C C C N C O C C C C C C C C C C C O O C C C C O O C C N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"CgM7ALv+jgIxABD/UwLB/z//kQI8/xz/cgK+/jn/2wHr/4//jwGQ/8j/FgGt/xkA1wAiAD4AZwAEAIwACQBqAMcAof+SAGAAOP8/ADcA6/5+ANn/cP5cAIn/Lv7q/47/Uf57/+L/7v0U/8f/6v2o/vr/jf1K/1//Gv30/i7/vvwV/9T+sv3E/z7/b/0gANv+Iv/4AMj/8v5lAWv/lv8EAR4A8P99ASgAof/0AWEAd//WAfAAyv/OAUkB7f7DAQ8BYACB/5kA9/8z/+UAJQAe/3YBmwC8/ncBDAHl/ooBhAAy/mIB0ABI/08A7wC1/kMA0QF6AI3/QQKrAD7/WgIdASb/VgP2/9/+8gIhAFP+MgOgAL7+7QJA/93+tgJx/g7/IQKW/nP/qwEn/7v/7wCAACgA1/9AAB8BQQDCAOcAMf/k/18ASf6pAEP/mv5t/yMAEf2P/lr/uvx0/6H+cPzL/rz+ef34/3b+BP0nAPL+mf2EAN3+Qf+uAVr/nP6ZAZb/1f47AQr/RQBpAWkAFQCYAcX/Sf8GAiMA4f9NAl8Asf7DAcMA5v/S/rYAmP9q/+YAQwB9/6EB0v/0/rABXgAZ/gwBDwGd/t3/lgB5/loAPwGZ/ogAjwG3ALf/","b":"AAABAAEAAgACAAMAAwAEAAIABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEQATABMAFAAUABUAEwAWAA8AFgAWABcADQAYABgAGQAYABoACwAaABoAGwAbABwAHAAdAB0AHgAdAB8ACQAgACAAIQAhACIAIgAjACMAJAAjACUAIAAmAAcAJgAmACcABQAoACgAKQABACkAKQAqAAAAKwAAACwAAAAtAAMALgAEAC8ABAAwAAYAMQAIADIACgAzAAoANAAMADUADgA2ABAANwAUADgAFQA5ABUAOgAXADsAFwA8ABcAPQAZAD4AGQA/ABkAQAAbAEEAGwBCABwAQwAcAEQAHwBFACEARgAhAEcAIgBIACIASQAlAEoAJwBLACcATAAnAE0AKABOAA==","o":"1212121111111121121122112112111212111211211112111111111111111111111111111111111111"},"glucuronic":{"name":"Глюкуроновая кислота","el":"O C O C C O C O C O C O O H H H H H H H H H H","xyz":"Sv/5APn/jP+DACUAFACHAPz/XAAWACoAJACU//D/ZwAl/ysAjf+H/wsAWf8e/7r/Q/8JAOr/wP4DACEA7wAkAAEARwEHAFAAEAFTAH//+v4HAS4Ah/9+AJIAVgASAJcANQCS/4T/ZAAu/4wAfv9u/3QAd/8q/1//Pf8UAH7/f/4EANj/AwGxAG//","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAABAAgACAAJAAMACgAKAAsACgAMAAAADQABAA4AAwAPAAQAEAAFABEABgASAAcAEwAIABQACQAVAAwAFgA=","o":"11111111111211111111111"},"ala":{"name":"Аланин","el":"N C C C O O H H H H H H H","xyz":"eP9pAD0AuP/n/ycAc/+f/7P/SwD8/wYAoQC6/0AAcgBbAKT/vv+sAFoAMf9gAIUAr/+r/4EAof+9/1X/fP80/8D/Cf+6/7H/cgA7AEj/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAEACAACAAkAAgAKAAIACwAFAAwA","o":"111211111111"},"succoa":{"name":"Сукцинил-КоА","el":"O C O C C C O S C H H H H H H H H","xyz":"P/90/0gAQ//h/+7/J//Q/3j/bP9sAB8A7/9iAG4AYAA5AA8AdwB7AKv/xQCn/zQAYAGw/9j/JP+J/6MAev+vAMr/Hv+UAGAA5f8XALwABgDDAJoAjwFO/9X/pAH3/wkATQHS/3L/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAcACAAAAAkAAwAKAAMACwAEAAwABAANAAgADgAIAA8ACAAQAA==","o":"1211121111111111"},"gly":{"name":"Глицин","el":"N C C O O H H H H H","xyz":"vQDw/wsAUABOAPL/yv8FAP7/Y/9FAAkAxv93//v/DQEiAC8A1gDC/7X/WwB4AI7/VACfADwA8/9K/0QA","b":"AAABAAEAAgACAAMAAgAEAAAABQAAAAYAAQAHAAEACAAEAAkA","o":"112111111"},"co":{"name":"Угарный газ","el":"C O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"3"},"o2":{"name":"Кислород","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"pbg":{"name":"Порфобилиноген","el":"N C C N C C C C C O O C C C O O H H H H H H H H H H H H H H","xyz":"1/5cAKcA6f53ABkAfP+EAPn/zv/tAB4ATgDUAO7/TABgAK3/wQAeAGn/6ACe/7T/HgHC/z4AhQECAEkA1wCZ/7MAxP8sALT/lP+q/3n/X/9O/+f/pP83/0kA3v4U/9v/EP8NAMEA8v6tAN0Atf7UAAAAvP4mAN//sv89AVEAowAUAfr/pwAEAAL/GAFhAGf/NQFp/3v/kABe/77/dwCm/7EARP+9/zH/5v94/0X/lP5S/9H/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACAAKAAUACwACAAsACwAMAAwADQANAA4ADQAPAAAAEAAAABEAAQASAAEAEwADABQABAAVAAYAFgAGABcABwAYAAcAGQAKABoADAAbAAwAHAAPAB0A","o":"111121112112112111111111111111"},"biliverdin":{"name":"Биливердин","el":"C C C C C C C C N C C C N C C C N C O C C C C C C C C C C C O O C C C C O O C C N C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Qvyn//b/2fye//L/Nv37/wcAG/2LACoApvzKADoAvv25//X/KP4CAAUAuP7i//z/Bv9JABMAlP8iAAgA5/+GAB4AegCfACIA5gBKAA4AXgGMABwA8AFpABIAIQLy//f/0QF9/9z/MQIR/8P/FQKg/qn/vQJL/8//NgPy/rr/tgMW/8D/tALL/+3/JgMsAAEAPgEMATkAnQF+AVMArQAXAT4AZQCYAVwATADnAdv/6v+cAYL/FABRASv/Xv+sAZT/kf+R/+X/AwAx/83/IgDg/ksAZgA5/7MAIwB9/wAB9AA+/7oAEP9s/9//5P7f/r//qv0v/9T/G/0Z/9H/5Pyx/rn/IfzR/1YAHvzn/6X/FfxE/+v/b/3SADoARfydADEAq/w1AVQAGv5uAB8Aq//kADUA2QDr//j/OgK5ACQAcQFs/9r/IgOI/qH/AgTI/q7/2QN6/9f/XgMRAFwAawMnAKz/BAOTAAsA6wGBAQYAzQFzAbQAZwHdAVIAowDWAZ4ABgCHAY8AqwD1Aaf/IgBJAvX/Jf90AV3/6P/q/nz/XABj/6j/ZACN/jIAxf+5/nQAGQGC//QANf+Y/rX/pP66/hEAqP7e/mP/6P3l/sL/","b":"AAABAAEAAgACAAMAAwAEAAIABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEQATABMAFAAUABUAEwAWAA8AFgAWABcADQAYABgAGQAYABoACwAaABoAGwAbABwAHAAdAB0AHgAdAB8ACQAgACAAIQAhACIAIgAjACMAJAAjACUAIAAmAAcAJgAmACcABQAoACgAKQABACkAKQAqAAAAKwAAACwAAAAtAAMALgAEAC8ABAAwAAYAMQAKADIADAAzAA4ANAAQADUAFAA2ABUANwAVADgAFwA5ABcAOgAXADsAGQA8ABkAPQAZAD4AGwA/ABsAQAAcAEEAHABCAB8AQwAhAEQAIQBFACIARgAiAEcAJQBIACcASQAnAEoAJwBLACgATAA=","o":"12121212121111211211221121121112111112121111121111111111111111111111111111111111"},"ala5":{"name":"5-Аминолевулиновая кислота","el":"N C C O C C C O O H H H H H H H H H","xyz":"zP6w/wAAU//B/8n/l/83AA0Adf9ZAH0ABgCEAMT/awAgAIv/swDZ//7/jQBr/yMAIwEWADwAl/5z/8T/0v6I/1wAjP9m/9v/TP/T/17/OQDGAAsA2/++AHP/NwDW/07/tABVAE7/JAEVAJ0A","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAAAAkAAAAKAAEACwABAAwABAANAAQADgAFAA8ABQAQAAgAEQA=","o":"11211121111111111"},"urogen3":{"name":"Уропорфириноген III","el":"C C N C C C N C C C N C C C N C C C C O O C C C C O O C C C C O O C C C O O C C C C O O C C C O O C C C C O O C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"qf7m/2oA3v5v/x0AWP8x/zYAZv/J/tz/3f9s/tb/WwC4/vz/lQAd/7D/BgFK//P/YwG3/8T/HQE7AK3/mQBbAMf/gwDeAKP/AwAuAaz/mf/vAAMAXf9zAPD/Af9fAFcAA//KAKYAr/7fACEBBf/SAJ8BGf80AeYBPf9UAMIBZf8nAXAAif+tAakAPv8cAl4AqP4PAncAdf5HAtcAWP7AASAA9QAQAXP/CwGcAUD/JAH8AbX/qAHXAfn/qAGRAV0AIwIHAsX/WQGmAHr/6QGxAE//8gG6ALb+WQLfAIL+ggGWAGf+EwEE/2MAgAET/8oA+gG//qIA1gEr/qgAswHx/UMA3gHl/SMBpACl/mgAiwBC/tcAHAB1/jQBKwDe/nABpf8p/kQB+f7D/o7/8P5Y/iX/e/5h/sT+gP7h/nP+6v4X/1r+B/4c/0P+ov4u/7n/Gv5a/4f/I/7g/z3/jv4KABP/rf0tACr/pf7N/9UAQ/79/0oAmv9M/3sAz/8Y/hsA6f9D/nH/cwA//1n/swHF/w8AlQGX/2f/VQAdAO7/2v89AUb/GgCTAdP/cf8zAKf/gv5DASABX/6VACYBiv9XAP0B9P+/AaAAbv+yARMBYf99AoIAUv8TAvP/Jf55AUoAYQGfAf3+swC/AQn/KgFiApD/0wD0Af3/bQLIAcb/IQJZAHH/FwIKAXr/QAHbAFn+XQHx/iwBngF8/9MATALU/ucAGALa/j0AwgEW/nIBbADi/a0A5gAy/hIBUv9Y/i8B7P72/Vb/Tf9Y/un+HP5W/vn+gv4M/n7+Bv58/z7+7f0R/0X/1/1n/93/qv1jANn+","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8AAAAPAA8AEAAQABEAEQASABIAEwASABQAEAAVAA0AFQAVABYAFgAXABcAGAAYABkAGAAaAAsAGwAbABwAHAAdAB0AHgAeAB8AHgAgABsAIQAJACEAIQAiACIAIwAjACQAIwAlAAcAJgAmACcAJwAoACgAKQApACoAKQArACYALAAFACwALAAtAC0ALgAuAC8ALgAwAAMAMQAxADIAMgAzADMANAA0ADUANAA2ADEANwABADcANwA4ADgAOQA5ADoAOQA7AAAAPAAAAD0AAgA+AAQAPwAEAEAABgBBAAgAQgAIAEMACgBEAAwARQAMAEYADgBHABEASAARAEkAFABKABYASwAWAEwAFwBNABcATgAaAE8AHABQABwAUQAdAFIAHQBTACAAVAAiAFUAIgBWACUAVwAnAFgAJwBZACgAWgAoAFsAKwBcAC0AXQAtAF4AMABfADIAYAAyAGEAMwBiADMAYwA2AGQAOABlADgAZgA7AGcA","o":"111111111111111121121121112121112112112121112112112121112112112111111111111111111111111111111111111111111111"},"hmbilane":{"name":"Гидроксиметилбилан","el":"O C C N C C C N C C C N C C C N C C C C C O O C C C O O C C C C O O C C C O O C C C C O O C C C O O C C C C O O C C C O O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"dP1VAR4AoP0nAZ//4v2gAK3/aP6FAJX/fv7+/6z/A/+3/57/dv8WALn/2f84AF3/MACRAJv/qwDPAFv/KAGLAI7/QgEEAH3/vQHo/7f//wFg/7v/mwH1/uP/cgHb/mUAFgFz/mIABgFN/uT/rADg/a//GQAF/sX/9f/u/VgA0/9L/p4A+/9r/Y4AXAGi/pL/aQGa/vz+/gDw/rj+HgE6/1z+dwDp/uP+7gFYAOv/cAJpADQAZgIxAMIAAQKEABIBJQLsAEYBewFXACEBjQHCAM//nQFSAfn/BQKXAaD/QQL5Acn/HwJlAR7/BwClABcASAD+AH4A+P+AAY4AAQDRAQwAqP/IAbn/cAAmAvT/j/9VACsAPv9OAKoAkf8OABkB5P+5//4AfP81AKABDP7G/9H/9v01//T/0f0m/4cASP5O/98AtP4Z/84AOP6x/0MBpv0vANH/Ff0dAPT/vPxKAH//a/ykAJD/x/wKAAH/wf11AVEA5/1vAXX/Sv0hAVz/rP7HAHn/Df+P/zn/CP9j/+T/4P8XAAD/pADEAO7+rQA6AXH/BwHD/0//UgJh/wMAKQJI/1n/kQEL/7cA5QBJ/rgAvQDR/UT/wQCC/eP/2v/H/YX/CgBu/qz/VABI/Z8AXQEy/tr+zAG8/tz+NADt/p3+wAI1AP//iwLTADoAxwI1APIARALJ/70AUwEvANIAwAFXAWEAPwGIAfL/bgIuART/rgAXAWAATADMAN8AkP9oAaMAIgC6AeAAsgAqAjsAIP+zAMoA4/4TAJoAq/+FAL0BUP77/uD/pf0L/7f/fP1m/58Atv2+/pwAP/4NACUB//y0/wkA+/xYAEwAdPz7/9H+","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQABAAEQARABIAEgATABMAFAAUABUAFAAWABEAFwAOABcAFwAYABgAGQAZABoAGQAbAAwAHAAcAB0AHQAeAB4AHwAfACAAHwAhABwAIgAKACIAIgAjACMAJAAkACUAJAAmAAgAJwAnACgAKAApACkAKgAqACsAKgAsACcALQAGAC0ALQAuAC4ALwAvADAALwAxAAQAMgAyADMAMwA0ADQANQA1ADYANQA3ADIAOAACADgAOAA5ADkAOgA6ADsAOgA8AAAAPQABAD4AAQA/AAMAQAAFAEEABQBCAAcAQwAJAEQACQBFAAsARgANAEcADQBIAA8ASQAQAEoAEgBLABIATAATAE0AEwBOABYATwAYAFAAGABRABsAUgAdAFMAHQBUAB4AVQAeAFYAIQBXACMAWAAjAFkAJgBaACgAWwAoAFwAKQBdACkAXgAsAF8ALgBgAC4AYQAxAGIAMwBjADMAZAA0AGUANABmADcAZwA5AGgAOQBpADwAagA=","o":"11111111111111112111211211212111211211212111211211212111211211211111111111111111111111111111111111111111111111"},"coprogen3":{"name":"Копропорфириноген III","el":"C C N C C C N C C C N C C C N C C C C C C C O O C C C C O O C C C C C C O O C C C C C C O O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"bgDMADoB2wCrANcA+gAsAKcAZQE4AE4ApAHE/wUAOwFf/97/ygB8/5L/gQAG/4P////7/jf/tP9//zv/eP+2/6z/P/8vAIj/8/6KAOb/Pf+bAGkAxv+sAHYA5P+4AP0Ac/+vAEIBZP+3ANgBB/+dAOIAdf6OAAYBW/4FAEUBcf6Y/9wA3f5g/9MAB/50/4QAVf9EAAf/Kf+6ALX+oP6fAHb+Nv6VAOX+Fv4pABH/+v0MARf/of/S/9b+0f+//0j+wQCl/sL/lgAV/sv/YAD3/VgA3/9G/m8A4P+m/rwAaP8i/iwAOQHe/v3/oAGT/k4AhgG4AEYA9AH0APL/uQFUAYr/YgEFASj/jgGiAPD+3QAvAQ3/LQECAZ4AMAGXAbQAeAA0AVsBeACMAJIBzQDY/8EA2AHo/6v/7wGU/0YAsQDV/27/EwDg/s/+wf+s/mP/d/+N/wcAkP5gAPn/5f7sALj/CACuACwAdv9WAAUCrP//AAIC//7YAPIBWP7cAE4BNv6ZAK4A9f0BAGoBoP72/5gBvP1H/60Acf/NAGX+Iv8UAfP+o/5BAD/+hv7wADL+5v1RAdb+tP8UAAr+PgC2/0X+pf9k/x3+RwD//YL/6gDS/bf/SgCM/WAAqgAT/qIAIf9k/i0A9QF4/g8AxAHR/qAAdQE4/ncALQKmAL7/OQItATEAfAGfAbz/CgKEAVP/rQBVAVj/GQGvAR0B5QDJAXUAkgHAAZwA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8AAAAPAA8AEAAQABEAEAASAA0AEgASABMAEwAUABQAFQAVABYAFQAXAAsAGAAYABkAGQAaABoAGwAbABwAGwAdABgAHgAJAB4AHgAfAAcAIAAgACEAIQAiACIAIwAjACQAIwAlACAAJgAFACYAJgAnAAMAKAAoACkAKQAqACoAKwArACwAKwAtACgALgABAC4ALgAvAAAAMAAAADEAAgAyAAQAMwAEADQABgA1AAgANgAIADcACgA4AAwAOQAMADoADgA7ABEAPAARAD0AEQA+ABMAPwATAEAAFABBABQAQgAXAEMAGQBEABkARQAaAEYAGgBHAB0ASAAfAEkAHwBKAB8ASwAhAEwAIQBNACIATgAiAE8AJQBQACcAUQAnAFIAJwBTACkAVAApAFUAKgBWACoAVwAtAFgALwBZAC8AWgAvAFsA","o":"111111111111111121121112121112112121112112121112112111111111111111111111111111111111111111111111"}});


// @scene heme makeHeme | Обмен гема и желтухи | Кровь и печень
/* =========================================================
   БИОХИМИЯ · ОБМЕН ГЕМА: синтез гема (митохондрия ↔ цитоплазма, порфирии, свинец),
   распад гема → биливердин → билирубин → конъюгация в печени → желчь → кишка → стеркобилин / уробилин;
   желтухи (гемолитическая, печёночная, механическая, новорождённых)
   ========================================================= */
function makeHeme() {
  __set_rnd(mulberry(2501));
  const scene = bioStage({ bg: 0x09080a, rim: 0xf2c14e });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { synth: DK ? flyTarget(V3(-2.3, -1.8, 0), V3(-1.5, 0.1, 22.0)) : flyTarget(V3(0.2, -2.1, 0), V3(1.0, -0.3, 17.5)), chem: flyTarget(V3(41.2, -2.2, 0), V3(41.6, -0.6, 19)), body: flyTarget(V3(80.3, -0.75, 0), V3(80.9, 0.5, 11.2)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.synth.pos);
  const controls = makeControls(camera, VIEW.synth.target); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1600, 0.08); scene.add(fx.obj);
  const HBO = PDB('hbo'); const hemL = HBO.ligm.find((l) => l.name === 'HEM');
  const feI = hemL.el.indexOf('Fe'); const noFe = new Set(hemL.el.map((e, i) => i).filter((i) => i !== feI));
  const ctr = (m) => { const c = V3(0, 0, 0); for (let i = 0; i < m.n; i++) c.add(V3(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return c.multiplyScalar(1 / m.n); };
  const hemC = ctr(hemL);
  // молекула, вписанная в радиус R и центрированная
  const molAt = (parent, m, pos, R, o = {}) => { const s = molFit(m, R); const g = molMesh(m, { scale: s, hideH: true, ...o }); const w = new THREE.Group(); w.add(g); w.position.copy(pos); parent.add(w); w.userData.g = g; return w; };
  // нормаль порфиринового кольца (по четырём пиррольным N): гем ставится плоскостью к зрителю с наклоном 0,35 рад
  const hemN = (() => { const ns = []; hemL.el.forEach((e, i) => { if (e === 'N') ns.push(V3(hemL.xyz[i * 3], hemL.xyz[i * 3 + 1], hemL.xyz[i * 3 + 2])); }); return ns[1].clone().sub(ns[0]).cross(ns[2].clone().sub(ns[0])).normalize(); })();
  const hemQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0)).multiply(new THREE.Quaternion().setFromUnitVectors(hemN, V3(0, 0, 1)));
  const hemAt = (parent, pos, R, o = {}) => { const s = R / 7.2; const g = molMesh(hemL, { scale: s, ...o }); g.position.copy(hemC).multiplyScalar(-s); const w = new THREE.Group(); const q = new THREE.Group(); q.quaternion.copy(hemQ); q.add(g); w.add(q); w.position.copy(pos); parent.add(w); return w; };

  /* ---------- 1. синтез гема ---------- */
  const G1 = new THREE.Group(); G1.position.set(1.7, -0.2, 0); scene.add(G1);
  const mito = new THREE.Mesh(blobGeo(2.35, 1.55, 1.15, 7, 0.05, 4), glassMat(0xff9a5c, { rim: 0.55, base: 0.018, pow: 2.2, keep: true })); mito.position.set(-3.1, 0, -0.4); G1.add(mito);
  // кристы — позади молекул
  const crMat = organMat('#B0603A', 0.3, { transparent: true, opacity: 0.25, depthWrite: false });
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(ell3(0.07, 0.6 - Math.abs(i - 2) * 0.11, 0.6), crMat); c.position.set(-4.7 + i * 0.8, (i % 2 ? 0.25 : -0.25), -1.05); G1.add(c); }
  const NODES = [
    { id: 'start', name: 'глицин + сукцинил-КоА', pos: V3(-4.4, -0.55, 0) },
    { id: 'ala', name: '5-аминолевулинат (АЛК)', pos: V3(-2.4, -0.75, 0.1) },
    { id: 'pbg', name: 'порфобилиноген', pos: V3(0.2, -1.65, 0.3) },
    { id: 'hmb', name: 'гидроксиметилбилан', pos: V3(2.7, -1.25, 0.3) },
    { id: 'uro', name: 'уропорфириноген III', pos: V3(3.8, 0.45, 0.2) },
    { id: 'copro', name: 'копропорфириноген III', pos: V3(1.6, 1.55, 0.2) },
    { id: 'proto', name: 'протопорфирин IX', pos: V3(-1.9, 0.8, 0.2) },
    { id: 'heme', name: 'гем', pos: V3(-4.5, 0.8, 0.2) },
  ];
  const ENZ = ['АЛК-синтаза · B₆', 'АЛК-дегидратаза · Zn²⁺', 'ПБГ-дезаминаза', 'уро-III-косинтаза', 'уро-декарбоксилаза', 'оксидазы', 'феррохелатаза · Fe²⁺'];
  const NM = [];
  { const g = new THREE.Group(); g.position.copy(NODES[0].pos); G1.add(g); molAt(g, MOL('gly'), V3(-0.35, 0.05, 0), 0.32); molAt(g, MOL('succoa'), V3(0.35, -0.05, 0), 0.62); NM.push(g); }
  NM.push(molAt(G1, MOL('ala5'), NODES[1].pos, 0.5));
  NM.push(molAt(G1, MOL('pbg'), NODES[2].pos, 0.55));
  NM.push(molAt(G1, MOL('hmbilane'), NODES[3].pos, 0.8, { tint: '#C77DFF' }));
  // порфириногены — неароматическое изогнутое кольцо с CH₂-мостиками (8 и 4 карбоксила)
  NM.push(molAt(G1, MOL('urogen3'), NODES[4].pos, 0.85, { tint: '#9A6AFF' }));
  NM.push(molAt(G1, MOL('coprogen3'), NODES[5].pos, 0.8, { tint: '#FF6AC0' }));
  NM.push(hemAt(G1, NODES[6].pos, 0.72, { idx: noFe, tint: '#E04A6A' }));
  NM.push(hemAt(G1, NODES[7].pos, 0.72));
  const hemeGlow = glowNucleus(G1, NODES[7].pos, '#FF5A3A', 0.05, 7);
  const EDGE = [];
  for (let i = 0; i < 7; i++) { const a = NODES[i].pos.clone(), b = NODES[i + 1].pos.clone(); const d = b.clone().sub(a).normalize(); const fa = flowArrow(G1, a.clone().addScaledVector(d, 0.6), b.clone().addScaledVector(d, -0.65), '#F2C14E', { bend: i === 5 ? -0.18 : 0.12, r: 0.022 }); EDGE.push(fa); }
  // ингибирование гемом АЛК-синтазы (обратная связь)
  const fbArc = flowArrow(G1, NODES[7].pos.clone().add(V3(0, -0.5, 0.2)), NODES[0].pos.clone().lerp(NODES[1].pos, 0.5).add(V3(0, 0.15, 0.3)), '#FF4A6A', { bend: -0.5, r: 0.018, head: false });
  const fbBar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xff4a6a, transparent: true })); fbBar.position.copy(fbArc.curve.getPoint(1)); G1.add(fbBar);
  const blockX = EDGE.map((E) => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: 0xff3a4a, transparent: true }); [0.8, -0.8].forEach((r) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.07), m); b.rotation.z = r; g.add(b); }); g.position.copy(E.curve.getPoint(0.5)).add(V3(0, 0, 0.15)); g.visible = false; G1.add(g); return g; });
  const TOK = Array.from({ length: 70 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: 0xf2c14e })); m.visible = false; G1.add(m); return { m, e: -1, u: 0, wait: 0 }; });

  /* ---------- 2. химия распада ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const CH = [V3(-3.5, -0.85, 0), V3(-0.4, -0.2, 0), V3(2.9, -0.2, 0), V3(5.6, -0.2, 0)];
  const cm = [hemAt(G2, CH[0], 1.05), molAt(G2, MOL('biliverdin'), CH[1], 1.4), molAt(G2, MOL('bilirubin'), CH[2], 1.4)];
  // конъюгат: две глюкуроновые кислоты пришиты сложноэфирной связью к карбоксилам пропионатов билирубина (C1 глюкуроновой — к O пропионата)
  const GLU = [];
  { const g = new THREE.Group(); g.position.copy(CH[3]); G2.add(g); const bw = molAt(g, MOL('bilirubin'), V3(0, 0, 0), 1.25); const bm = MOL('bilirubin'), bs = molFit(bm, 1.25), bP = bw.userData.g.userData.P;
    const nb = (m, i) => { const r = []; for (let k = 0; k < m.b.length; k += 2) { if (m.b[k] === i) r.push([m.b[k + 1], m.o[k / 2]]); else if (m.b[k + 1] === i) r.push([m.b[k], m.o[k / 2]]); } return r; };
    const gm = MOL('glucuronic'); const gC1 = gm.el.findIndex((e, i) => e === 'C' && nb(gm, i).filter(([j, o]) => gm.el[j] === 'O' && o === 1).length === 2 && !nb(gm, i).some(([j, o]) => gm.el[j] === 'O' && o === 2));
    const gCen = (() => { const c = V3(0, 0, 0); for (let i = 0; i < gm.n; i++) c.add(V3(gm.xyz[i * 3], gm.xyz[i * 3 + 1], gm.xyz[i * 3 + 2])); return c.multiplyScalar(bs / gm.n); })();
    bm.el.forEach((e, i) => { if (e !== 'C') return; const os = nb(bm, i).filter(([j]) => bm.el[j] === 'O'); if (os.length !== 2) return; const oh = os.find(([, o]) => o === 1); if (!oh) return;
      const pO = bP(oh[0]), dir = pO.clone().sub(bP(i)).normalize(); const tgt = pO.clone().addScaledVector(dir, 1.43 * bs);
      const gq = new THREE.Group(); const mm = molMesh(gm, { scale: bs, hideH: true, tint: '#7FE0A0' }); gq.add(mm);
      const c1 = mm.userData.P(gC1); gq.quaternion.setFromUnitVectors(gCen.clone().sub(c1).normalize(), dir); gq.position.copy(tgt).sub(c1.clone().applyQuaternion(gq.quaternion)); g.add(gq); GLU.push(gq);
      const bd = new THREE.Mesh(CYL, atomMat('O')); const d = tgt.clone().sub(pO); bd.position.copy(pO).addScaledVector(d, 0.5); bd.scale.set(0.13 * bs, d.length(), 0.13 * bs); bd.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); g.add(bd); });
    cm.push(g); }
  const CHA = []; for (let i = 0; i < 3; i++) CHA.push(flowArrow(G2, CH[i].clone().add(V3(1.2, 0.0, 0)), CH[i + 1].clone().add(V3(-1.25, 0.0, 0)), '#F2C14E', { bend: 0.15, r: 0.03 }));
  const side = [['co', V3(-1.55, 0.75, 0.3)], ['o2', V3(-1.7, -1.7, 0.3)]].map(([id, p]) => molAt(G2, MOL(id), p, 0.28));
  const feOut = glowNucleus(G2, V3(-0.85, 0.8, 0.3), '#E0773A', 0.07, 6);
  const light = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4.4, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0x4a7aff, transparent: true, opacity: 0.09, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); light.position.set(2.9, 2.3, 0); G2.add(light);
  const lamp = glowNucleus(G2, V3(2.9, 4.5, 0), '#5A8AFF', 0.1, 10);

  /* ---------- 3. путь билирубина по телу ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const shell = (() => { const tmp = new THREE.Scene(); const sh = bodyShell(tmp, { rim: 0.2, legs: true }); sh.meshes.forEach((m) => G3.add(m)); return sh; })();
  const O = {};
  const om = (id, geo, col, k = 0.45, pos = null) => { const m = new THREE.Mesh(geo, organMat(col, k)); if (pos) m.position.copy(pos); m.userData.pick = id; G3.add(m); O[id] = m; return m; };
  om('liver', blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), '#B0523A', 0.5, V3(-0.35, 1.55, 0.15));
  om('spleen', ell3(0.16, 0.3, 0.12), '#8A3A5A', 0.5, V3(0.82, 1.62, -0.1));
  om('gb', ell3(0.09, 0.15, 0.09), '#7FB060', 0.55, V3(-0.25, 1.22, 0.55));
  // тонкая кишка — петли-змейка, по краю — рамка толстой кишки (восходящая справа у человека, поперечная, нисходящая, сигма)
  om('gut', tube(Array.from({ length: 48 }, (_, i) => { const u = i / 47; return V3(0.36 * Math.sin(u * Math.PI * 7), 0.88 - u * 0.66, 0.24 + 0.06 * Math.cos(u * Math.PI * 13)); }), 0.065, 260, 8), '#C08A70', 0.42);
  { const colon = new THREE.Mesh(tube([V3(-0.5, 0.2, 0.15), V3(-0.55, 0.6, 0.15), V3(-0.5, 0.98, 0.15), V3(0, 1.02, 0.2), V3(0.5, 0.98, 0.15), V3(0.56, 0.6, 0.15), V3(0.48, 0.18, 0.15), V3(0.25, 0.02, 0.2), V3(0.02, -0.12, 0.15)], 0.085, 160, 10), organMat('#B07A62', 0.42)); colon.userData.pick = 'gut'; G3.add(colon); O.colon = colon; }
  om('kid', ell3(0.13, 0.22, 0.11, V3(0.55, 1.12, -0.25)), '#A04A3A', 0.45); om('kid2', ell3(0.13, 0.22, 0.11, V3(-0.55, 1.08, -0.25)), '#A04A3A', 0.45);
  om('bladder', ell3(0.2, 0.16, 0.15), '#E0C050', 0.4, V3(0, -0.42, 0.3));
  O.kid2.userData.pick = 'kid';
  const BP = { spleen: V3(0.82, 1.62, 0.1), liver: V3(-0.3, 1.6, 0.5), gb: V3(-0.25, 1.22, 0.62), gut: V3(0.05, 0.6, 0.45), out: V3(0.0, -0.95, 0.05), kid: V3(0.5, 1.1, 0.0), bladder: V3(0, -0.4, 0.42) };
  const BC = { ub: '#FF9A3A', cb: '#F2E05A', st: '#9A5A2A', uro: '#F2D070', urine: '#F2D070', rbc: '#FF3A4A' };
  // [откуда, куда, вещество, веса: норма, гемолиз, печёночная, механическая, новорождённые]
  const BF = [
    ['spleen', 'liver', 'ub', [1, 2.2, 1, 1, 1.8]], ['liver', 'gb', 'cb', [1, 1.9, 0.5, 0.12, 0.35]], ['gb', 'gut', 'cb', [1, 1.9, 0.5, 0, 0.35]],
    ['gut', 'out', 'st', [1, 1.9, 0.5, 0, 0.35]], ['gut', 'liver', 'uro', [0.45, 1, 0.4, 0, 0.05]], ['liver', 'kid', 'uro', [0.2, 0.7, 0.55, 0, 0.03]],
    ['liver', 'kid', 'cb', [0, 0, 0.8, 1.4, 0]], ['kid', 'bladder', 'urine', [0.25, 0.7, 1, 1.1, 0.05]],
  ];
  const BFM = BF.map(([a, b, k, w], i) => { const pa = BP[a], pb = BP[b]; const mid = pa.clone().lerp(pb, 0.5).add(V3((i % 2 ? 0.25 : -0.25), 0.1, 0.35)); const c = new THREE.QuadraticBezierCurve3(pa, mid, pb); const f = flowTubeMat(BC[k], 0.45, 2.0); G3.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.024, 6), f)); return { c, f, k, w }; });
  const BPR = Array.from({ length: 120 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.visible = false; G3.add(m); return { m, f: 0, u: 0 }; });
  // эритроцит — двояковогнутый диск без сквозного отверстия (сплюснутая сфера с вдавленным центром)
  const rbcGeo = displaceGeo(new THREE.SphereGeometry(1, 24, 16), (v) => { const r2 = v.x * v.x + v.z * v.z; v.y *= 0.22 + 0.6 * r2; }); rbcGeo.scale(0.075, 0.075, 0.075);
  const rbcs = Array.from({ length: 10 }, (_, i) => { const m = new THREE.Mesh(rbcGeo, organMat('#E03A3A', 0.6, { emissiveIntensity: 0.2 })); G3.add(m); return { m, a: i * 0.63, r: 0.25 + (i % 3) * 0.06 }; });
  const COND = [
    { id: 'norm', name: 'Норма', us: 'светло-жёлтая', ss: 'коричневый', tot: 14, dir: 3.5, urine: 'соломенно-жёлтая (уробилин)', stool: 'коричневый (стеркобилин)', skin: 0 },
    { id: 'hemo', name: 'Гемолитическая', us: 'тёмная', ss: 'тёмный', tot: 55, dir: 6, urine: 'тёмная: много уробилина, билирубина нет', stool: 'тёмный: много стеркобилина', skin: 0.45 },
    { id: 'hep', name: 'Печёночная', us: 'цвета пива', ss: 'светлее', tot: 110, dir: 60, urine: 'тёмная, «цвета пива»: прямой билирубин + уробилин', stool: 'светлее нормы', skin: 0.75 },
    { id: 'obst', name: 'Механическая', us: 'тёмная', ss: 'белёсый', tot: 200, dir: 165, urine: 'тёмная: прямой билирубин, уробилина нет', stool: 'обесцвеченный, глинистый', skin: 1 },
    { id: 'neo', name: 'Новорождённых', us: 'светлая', ss: 'обычный', tot: 150, dir: 6, urine: 'светлая', stool: 'обычный', skin: 0.7 },
  ];
  const skin0 = new THREE.Color(0xe2c0b0), skinY = new THREE.Color(0xe8c030);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'synth', labels: true, rot: false, fly: null, msg: null, block: 'none', fb: false, acc: 0, accN: '', cond: 0, photo: false, play: true, cs: 0, sel: null, skin: 0 };
  const BLOCK = { none: [], lead: [1, 6], aip: [2], pct: [4] };
  const ACC = { none: '', lead: 'АЛК и протопорфирин', aip: 'АЛК и порфобилиноген', pct: 'уропорфириноген' };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['synth', 'chem', 'body'][k] === m; }); st.fly = VIEW[m]; st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => (st.mode === 'body' ? Object.values(O) : []), (id) => { st.sel = id; refs.setInfo(); });
  let spawnT = 0;
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.5; flyStep(st, camera, controls, dt);
    if (st.mode === 'synth') {
      const bl = BLOCK[st.block];
      EDGE.forEach((E, i) => { E.mat.uniforms.uTime.value = t; E.mat.uniforms.uOn.value = bl.includes(i) ? 0.08 : (st.fb ? 0.25 : 0.55); blockX[i].visible = bl.includes(i); blockX[i].rotation.z = Math.sin(t * 3) * 0.05; });
      fbArc.mat.uniforms.uTime.value = t; fbArc.mat.uniforms.uOn.value = st.fb ? 1 : 0.0; fbArc.mesh.visible = fbBar.visible = st.fb;
      spawnT -= dt; if (spawnT <= 0) { spawnT = st.fb ? 2.4 : 0.55; const k = TOK.find((q) => q.e < 0); if (k) { k.e = 0; k.u = 0; k.m.visible = true; k.wait = 0; } }
      let acc = 0;
      TOK.forEach((k, j) => {
        if (k.e < 0) return;
        if (bl.includes(k.e) && k.u >= 0) { // застревает перед блоком
          k.wait += dt; acc++;
          const p = NODES[k.e].pos.clone().add(V3(Math.sin(j * 2.3) * 0.5 * (0.4 + (j % 5) * 0.15), Math.cos(j * 1.7) * 0.35, 0.35 + Math.sin(j) * 0.2));
          k.m.position.lerp(p, 1 - Math.exp(-dt * 2)); k.m.material.color.set(st.block === 'pct' || (st.block === 'lead' && k.e === 6) ? '#FF4AA0' : '#E05AFF');
          if (k.wait > 26) { k.e = -1; k.m.visible = false; }
          return;
        }
        k.u += dt * 0.55; if (k.u >= 1) { k.u = 0; k.e++; if (k.e >= 7) { k.e = -1; k.m.visible = false; fx.spawn(NODES[7].pos.clone().add(G1.position), randUnit().multiplyScalar(0.4), new THREE.Color('#FF6A3A'), 0.8, 2); return; } }
        k.m.position.copy(EDGE[k.e].curve.getPoint(k.u)); k.m.material.color.set(k.e < 1 ? '#F2C14E' : k.e < 3 ? '#FFB070' : '#E06AFF');
      });
      st.acc = acc; NM.forEach((g, i) => { g.rotation.y = Math.sin(t * 0.4 + i) * 0.35; });
      NM[7].scale.setScalar(1 + 0.04 * Math.sin(t * 3)); hemeGlow.spr.material.opacity = 0.6 + 0.3 * Math.sin(t * 3);
      // при порфирии накопленные порфирины светятся (флуоресценция)
      [4, 5, 6].forEach((i) => molGlow(NM[i], (st.block === 'pct' && i === 4) || (st.block === 'lead' && i === 6) ? 0.35 + 0.25 * Math.sin(t * 4) : 0.0));
    }
    if (st.mode === 'chem') {
      if (st.play) st.cs = (st.cs + dt * 0.25) % 4;
      const k = Math.floor(st.cs);
      cm.forEach((g, i) => { g.rotation.y = Math.sin(t * 0.35 + i) * 0.4 + (i === 0 ? 0 : 0); g.scale.setScalar(i === k ? 1.08 : 0.94); });
      CHA.forEach((A, i) => { A.mat.uniforms.uTime.value = t; A.mat.uniforms.uOn.value = i === k ? 0.6 : 0.15; });
      side.forEach((g, i) => { g.position.y = (i ? -1.7 : 0.75) + Math.sin(t + i) * 0.08; });
      light.visible = lamp.spr.visible = st.photo; lamp.core.visible = st.photo; if (st.photo) light.material.opacity = 0.07 + 0.03 * Math.sin(t * 5);
    }
    if (st.mode === 'body') {
      const C = COND[st.cond]; const ci = st.cond;
      BFM.forEach((F) => { F.f.uniforms.uTime.value = t; F.f.uniforms.uOn.value = Math.max(0.02, Math.min(1.2, F.w[ci])); });
      BPR.forEach((p) => { if (!p.m.visible || p.u >= 1) { const i = Math.floor(rnd() * BFM.length); const F = BFM[i]; if (rnd() < F.w[ci] * 0.35) { p.f = i; p.u = 0; p.m.visible = true; p.m.material.color.set(BC[F.k]); } else { p.m.visible = false; return; } } p.u += dt * 0.32; p.m.position.copy(BFM[p.f].c.getPoint(Math.min(1, p.u))); });
      const hem = ci === 1 ? 2.2 : ci === 4 ? 1.6 : 1;
      rbcs.forEach((r, i) => { r.a += dt * 0.6 * hem; r.m.position.copy(BP.spleen).add(V3(Math.cos(r.a) * r.r * 0.6, Math.sin(r.a * 1.3) * r.r, Math.sin(r.a) * r.r * 0.4)); r.m.rotation.set(r.a, r.a * 0.7, 0); });
      O.spleen.material.emissiveIntensity = 0.04 + 0.12 * (hem - 1);
      O.liver.material.emissiveIntensity = ci === 2 ? 0.02 + 0.03 * Math.sin(t * 2) : 0.06;
      O.gut.material.color.set(new THREE.Color(ci === 3 ? '#C8C0B0' : '#C08A70').multiplyScalar(0.42)); O.colon.material.color.set(new THREE.Color(ci === 3 ? '#C0B8A8' : '#B07A62').multiplyScalar(0.42));
      const tgt = C.skin * (st.photo && ci === 4 ? 0.55 : 1); st.skin += (tgt - st.skin) * Math.min(1, dt * 1.5);
      shell.solid.color.copy(skin0).lerp(skinY, st.skin); shell.solid.opacity = 0.025 + 0.1 * st.skin;
      if (st.photo && ci === 4) light.visible = false;
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, hh) {
    if (st.mode !== 'body') { scopeShow(false); return; } scopeShow(true);
    ctx.clearRect(0, 0, w, hh); const C = COND[st.cond], N = COND[0];
    ctx.fillStyle = '#EFEAE6'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('билирубин крови, мкмоль/л', 10, 13);
    const bars = [['непрямой', C.tot - C.dir, N.tot - N.dir, '#FF9A3A'], ['прямой', C.dir, N.dir, '#F2E05A'], ['общий', C.tot, N.tot, '#FFFFFF']];
    const x0 = 66, W = w - x0 - 34, mx = 210;
    bars.forEach(([n, v, nv, col], i) => { const y = 26 + i * 22; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(n, 8, y + 9); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x0, y, W, 11); ctx.fillStyle = col; ctx.globalAlpha = 0.85; ctx.fillRect(x0, y, W * Math.min(1, v / mx), 11); ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(x0 + W * (nv / mx) * 1.45, y - 2); ctx.lineTo(x0 + W * (nv / mx) * 1.45, y + 13); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(String(Math.round(v)), x0 + W + 4, y + 9); });
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.font = '500 8px JetBrains Mono, monospace'; ctx.fillText('| — верхняя граница нормы', x0, 26 + 3 * 22 + 4);
  }
  const TXT = {
    synth: '<b>Синтез гема</b> идёт во всех клетках, больше всего — в костном мозге (для гемоглобина) и печени (для цитохромов P450). Путь начинается и заканчивается в <b>митохондрии</b>: глицин + сукцинил-КоА → 5-аминолевулиновая кислота (фермент <b>АЛК-синтаза</b>, кофермент — витамин B₆; это ключевая, регулируемая стадия). Две молекулы АЛК дают пиррол <b>порфобилиноген</b>, четыре пиррола замыкаются в кольцо — <b>порфириноген</b>; после декарбоксилирований и окисления получается протопорфирин IX, в который <b>феррохелатаза</b> вставляет Fe²⁺. Включите нарушения: блок пути — накопление предшественников.',
    chem: '<b>Распад гема.</b> Эритроцит живёт около 120 дней; за сутки разрушается ~6 г гемоглобина, из которого получается ~250–300 мг билирубина. В макрофагах селезёнки и печени <b>гемоксигеназа</b> разрывает кольцо гема (нужны O₂ и НАДФН) — выделяются <b>CO</b> (единственный эндогенный источник угарного газа) и <b>железо</b>, которое снова используется. Получается зелёный <b>биливердин</b> (цвет «старого» синяка), его <b>биливердинредуктаза</b> восстанавливает в оранжевый <b>билирубин</b> — нерастворимый в воде и токсичный для мозга. В печени <b>УДФ-глюкуронилтрансфераза</b> присоединяет к нему две глюкуроновые кислоты — водорастворимый <b>билирубин-диглюкуронид</b> («прямой») выводится с желчью.',
    body: '<b>Путь билирубина.</b> «Непрямой» (свободный) билирубин из селезёнки везёт по крови <b>альбумин</b>. Печень захватывает его, конъюгирует и выводит с желчью в кишку. Там бактерии превращают его в <b>уробилиноген</b>; большая часть становится <b>стеркобилином</b> — он окрашивает кал в коричневый цвет; немного уробилиногена всасывается, и часть его попадает в мочу (<b>уробилин</b> придаёт ей жёлтый цвет). При нарушении любого звена билирубин копится в крови и окрашивает кожу и склеры — <b>желтуха</b> (заметна при билирубине выше ~35 мкмоль/л). Выберите тип желтухи; щелчок по органу — подробнее.',
  };
  const BTXT = {
    none: null,
    lead: '<b>Отравление свинцом.</b> Свинец блокирует SH-группы <b>АЛК-дегидратазы</b> и <b>феррохелатазы</b>: в крови и моче растёт АЛК, в эритроцитах копится протопорфирин (вместо железа в кольцо встаёт цинк). Гем и гемоглобин не достраиваются — анемия с базофильной зернистостью эритроцитов, а избыток АЛК токсичен для нервной системы.',
    aip: '<b>Острая перемежающаяся порфирия</b> — наследственный дефицит <b>ПБГ-дезаминазы</b>. Порфирины не накапливаются (кожа не страдает), но копятся <b>АЛК и порфобилиноген</b> — нейротоксичны: приступы сильной боли в животе, психические и неврологические нарушения. Моча на свету темнеет. Приступ провоцируют лекарства, индуцирующие P450 (барбитураты), алкоголь, голодание — всё, что усиливает синтез АЛК-синтазы. Лечение — введение гемина и глюкозы (они подавляют АЛК-синтазу).',
    pct: '<b>Поздняя кожная порфирия</b> — самая частая порфирия: снижена активность <b>уропорфириноген-декарбоксилазы</b> (часто из-за алкоголя, гепатита C, избытка железа). Копятся <b>порфирины</b> — они флуоресцируют и поглощают свет, образуя активные формы кислорода: на открытой коже — пузыри, рубцы, ранимость. Моча розово-красная.',
  };
  const BOTXT = { liver: '<b>Печень</b>: захват билирубина (белки-переносчики лигандин), конъюгация с глюкуроновой кислотой (УДФ-глюкуронилтрансфераза в ЭПР), активный выброс в желчь (транспортёр MRP2 — самая медленная стадия). Синдром Жильбера — генетически сниженная конъюгация у ~5% людей: безобидная лёгкая желтуха при голоде и стрессе.', spleen: '<b>Селезёнка</b> — «кладбище» эритроцитов: её макрофаги поглощают старые и повреждённые клетки, расщепляют гемоглобин: глобин — до аминокислот, железо — на ферритин и трансферрин, гем — до билирубина.', gb: '<b>Желчный пузырь</b> копит и концентрирует желчь. Камень или опухоль, перекрывшие желчный проток, — причина механической желтухи.', gut: '<b>Кишечник</b>: бактерии отщепляют глюкуроновую кислоту и восстанавливают билирубин до уробилиногенов, а затем до стеркобилина. У новорождённых кишка ещё стерильна.', kid: '<b>Почки</b> фильтруют только растворимые вещества: свободный билирубин связан с альбумином и в мочу не попадает, а прямой (конъюгированный) — попадает и делает мочу тёмной.', bladder: '<b>Моча</b> окрашена уробилином. Билирубин в моче — всегда признак повышенного прямого билирубина в крови (печёночная или механическая желтуха).' };
  const CTXT = [null,
    '<b>Гемолитическая (надпечёночная) желтуха</b>: эритроциты разрушаются слишком быстро (наследственные анемии, резус-конфликт, малярия, яды). Печень не успевает конъюгировать весь билирубин — растёт <b>непрямой</b>. Желчи с билирубином больше — кал и моча тёмные от избытка стеркобилина и уробилина; в моче билирубина нет.',
    '<b>Печёночная (паренхиматозная) желтуха</b>: гепатит, цирроз, отравления. Повреждённые гепатоциты хуже захватывают и конъюгируют билирубин и «протекают» — в крови растут оба вида, особенно <b>прямой</b>; он проходит в мочу (моча цвета пива), кал светлее. В крови растут АЛТ и АСТ.',
    '<b>Механическая (подпечёночная) желтуха</b>: желчь не выходит в кишку (камень в протоке, опухоль головки поджелудочной). Конъюгированный билирубин возвращается в кровь — резко растёт <b>прямой</b>, моча тёмная, кал обесцвечен, уробилина в моче нет; кожный зуд от желчных кислот.',
    '<b>Физиологическая желтуха новорождённых</b> (2–5-й дни): после рождения разрушается фетальный гемоглобин, а УДФ-глюкуронилтрансфераза печени ещё незрелая — растёт <b>непрямой</b> билирубин. Опасность — ядерная желтуха (непрямой билирубин проникает в мозг). Лечение — <b>фототерапия</b>: синий свет (~460 нм) превращает билирубин в водорастворимые изомеры, которые выводятся без конъюгации.'];
  const labels = [
    ...NODES.map((n, i) => ({ text: n.name, pos: n.pos.clone().add(G1.position).add(V3([-0.5, 0.3, 0, 0, 0, 0, 0, -0.3][i], i <= 1 ? -0.95 : i >= 6 ? 0.85 : i === 4 ? 1.05 : i === 5 ? 0.95 : -0.85, 0.2)), color: i === 7 ? '#FF6A3A' : i >= 4 ? '#D08AFF' : '#F2C14E', show: () => st.labels && st.mode === 'synth' })),
    ...ENZ.map((e, i) => ({ text: e, get pos() { return EDGE[i].curve.getPoint(0.5).add(G1.position).add(V3([0, 0, 0, 0, -0.3, 0, -0.85][i], [0.32, 0.3, -0.3, -0.25, 1.0, 0.3, 0.85][i], 0.4)); }, color: BLOCK[st.block] && BLOCK[st.block].includes(i) ? '#FF4A5A' : 'rgba(239,234,230,.86)', show: () => st.labels && st.mode === 'synth' })),
    { text: 'митохондрия', pos: V3(-5.0, -1.25, 0.4), color: '#FF9A5C', show: () => st.labels && st.mode === 'synth' },
    { text: 'цитоплазма', pos: V3(4.6 + 1.7, -1.6, 0.4), color: '#9FB4FF', show: () => st.labels && st.mode === 'synth' },
    { text: 'гем подавляет АЛК-синтазу', pos: V3(-3.3 + 1.7, 1.6, 0.4), color: '#FF4A6A', show: () => st.labels && st.mode === 'synth' && st.fb },
    ...[['гем', 0, '#FF6A3A'], ['биливердин', 1, '#5CC48A'], ['билирубин (непрямой)', 2, '#FF9A3A'], ['билирубин-диглюкуронид (прямой)', 3, '#F2E05A']].map(([n, i, c]) => ({ text: n, pos: CH[i].clone().add(V3(40, i ? -1.8 : -1.45, 0.3)).add(V3(i === 0 ? -0.35 : i === 3 ? -0.4 : 0, 0, 0)), color: c, show: () => st.labels && st.mode === 'chem' })),
    ...[['гемоксигеназа · O₂, НАДФН', 0], ['биливердинредуктаза · НАДФН', 1], ['УДФ-глюкуронилтрансфераза', 2]].map(([n, i]) => ({ text: n, pos: CH[i].clone().lerp(CH[i + 1], 0.5).add(V3(40, 0.75, 0.3)), color: 'rgba(239,234,230,.86)', show: () => st.labels && st.mode === 'chem' })),
    { text: 'CO', pos: V3(40 - 1.75, 1.25, 0.3), color: '#F2CC3A', show: () => st.labels && st.mode === 'chem' }, { text: 'Fe²⁺', pos: V3(40 - 0.75, 1.25, 0.3), color: '#E0773A', show: () => st.labels && st.mode === 'chem' },
    { text: 'глюкуроновая кислота', get pos() { return (GLU[1] || GLU[0] ? (GLU[1] || GLU[0]).getWorldPosition(V3(0, 0, 0)) : V3(45.6, -1.6, 0)).add(V3(0.5, -0.1, 0.3)); }, color: '#7FE0A0', show: () => st.labels && st.mode === 'chem' && GLU.length > 0 },
    { text: 'O₂', get pos() { return side[1].getWorldPosition(V3(0, 0, 0)).add(V3(0.3, -0.05, 0)); }, color: '#F04848', show: () => st.labels && st.mode === 'chem' },
    { text: 'синий свет 460 нм', pos: V3(40 + 2.9, 4.3, 0), color: '#7FA8FF', show: () => st.labels && st.mode === 'chem' && st.photo },
    ...[['селезёнка', 'spleen', V3(1.25, 1.9, 0)], ['печень', 'liver', V3(-1.25, 1.75, 0.3)], ['желчный пузырь', 'gb', V3(-1.0, 1.05, 0.6)], ['кишечник', 'gut', V3(0.75, 0.35, 0.5)], ['почки', 'kid', V3(1.1, 1.05, 0)], ['моча', 'bladder', V3(0.5, -0.5, 0.4)], ['кал', 'out', V3(-0.45, -1.0, 0.2)]].map(([n, id, p]) => ({ text: n, pos: p.clone().add(V3(80, 0, 0)), color: '#EFEAE6', show: () => st.labels && st.mode === 'body' })),
    ...[['непрямой билирубин + альбумин', 'ub'], ['прямой (конъюгированный)', 'cb'], ['уробилиноген / уробилин', 'uro'], ['стеркобилин', 'st']].map(([n, k], i) => ({ text: n, pos: V3(80 + 2.4, 2.3 - i * 0.36, 0), color: BC[k], show: () => st.labels && st.mode === 'body' })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.sel ? BOTXT[st.sel] : st.msg || (st.mode === 'synth' && BTXT[st.block]) || (st.mode === 'body' && CTXT[st.cond]) || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'synth', label: 'Синтез гема' }, { id: 'chem', label: 'Распад: молекулы' }, { id: 'body', label: 'Путь билирубина и желтухи' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'Нарушения и регуляция'), h('div', { class: 'gctl' },
        seg([{ id: 'none', label: 'Норма' }, { id: 'lead', label: 'Свинец' }, { id: 'aip', label: 'Острая порфирия' }, { id: 'pct', label: 'Кожная порфирия' }], () => st.block, (v) => { st.block = v; st.msg = null; refs.setInfo(); }),
        toggle('Избыток гема', () => st.fb, (v) => { st.fb = v; st.msg = v ? '<b>Обратная связь.</b> Гем (и гемин-препарат) подавляет синтез и работу <b>АЛК-синтазы</b> — поток по пути резко падает. Наоборот, лекарства, требующие много цитохрома P450 (барбитураты, некоторые противосудорожные), усиливают синтез АЛК-синтазы в печени — у больных порфирией это провоцирует приступ.' : null; refs.setInfo(); })));
      else if (st.mode === 'chem') box.append(h('div', { class: 'glabel' }, 'Превращения'), h('div', { class: 'gctl' },
        seg([0, 1, 2, 3].map((i) => ({ id: i, label: ['Гем', 'Биливердин', 'Билирубин', 'Конъюгат'][i] })), () => Math.floor(st.cs), (v) => { st.cs = v + 0.01; st.play = false; refs.pl.sync(); }),
        (refs.pl = toggle('Авто', () => st.play, (v) => { st.play = v; })),
        toggle('Фототерапия', () => st.photo, (v) => { st.photo = v; st.msg = v ? '<b>Фототерапия желтухи новорождённых.</b> Синий свет (~460 нм) поглощается билирубином в коже и превращает его в фотоизомеры (Z,E-изомеры и люмирубин): внутримолекулярные водородные связи разрываются, молекула становится растворимой и выводится с желчью и мочой без конъюгации.' : null; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Тип желтухи', h('kbd', {}, 'клик по органу')), h('div', { class: 'gctl' },
        seg(COND.map((c, i) => ({ id: i, label: c.name })), () => st.cond, (v) => { st.cond = v; st.sel = null; st.msg = null; refs.setInfo(); }),
        toggle('Фототерапия', () => st.photo, (v) => { st.photo = v; })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['synth', 'chem', 'body'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'synth') return [['Поток к гему', st.block !== 'none' ? 'снижен' : st.fb ? 'подавлен' : 'норма', ''], ['Копится', st.acc > 0 ? ACC[st.block] : '—', '']];
    if (st.mode === 'chem') return [['Билирубина в сутки', '250–300', 'мг'], ['Эритроцит живёт', '~120', 'дней']];
    const C = COND[st.cond]; return [['Общий билирубин', C.tot, 'мкмоль/л'], ['Прямой', C.dir, 'мкмоль/л'], ['Моча', C.us, ''], ['Кал', C.ss, '']];
  }
  const self = {
    mobZoom: 0.78, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · кровь и печень', title: 'Обмен гема и желтухи',
    lede: 'Как клетка собирает гем из глицина и сукцинил-КоА — и во что он превращается, когда эритроцит отслужил свои 120 дней.',
    notes: `
      <div><h2>Нормы</h2><ul><li>Общий билирубин сыворотки 8,5–20,5 мкмоль/л; из них непрямой (свободный) ~75%, прямой (конъюгированный) ~25%.</li><li>Желтуха видна при билирубине выше ~30–35 мкмоль/л.</li></ul>
        <h3>Дифференциальная диагностика желтух</h3><ul><li><b>Гемолитическая</b>: ↑ непрямой; в моче — ↑ уробилин, билирубина нет; кал тёмный.</li><li><b>Печёночная</b>: ↑ прямой и непрямой; в моче — билирубин и уробилин; кал светлее; ↑ АЛТ, АСТ.</li><li><b>Механическая</b>: ↑↑ прямой; в моче — билирубин, уробилина нет; кал ахоличный; ↑ щелочная фосфатаза, холестерин, желчные кислоты.</li></ul>
        <h3>Наследственные гипербилирубинемии</h3><p>Жильбера (сниженная конъюгация, лёгкая), Криглера — Найяра (почти нет УДФ-глюкуронилтрансферазы, тяжёлая), Дубина — Джонсона и Ротора (нарушено выведение прямого билирубина).</p></div>
      <div><h2>Условности и модели</h2><ul><li>Гем — реальные координаты из оксигемоглобина (PDB 1GZX); протопорфирин IX — то же кольцо без железа.</li><li>Гидроксиметилбилан, уро- и копропорфириноген III (неароматические кольца с CH₂-мостиками, 8 и 4 карбоксильные группы), биливердин, билирубин, порфобилиноген, АЛК, глюкуроновая кислота построены по химическим формулам.</li><li>Значения билирубина при желтухах — типичные примеры, а не границы.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик по органу</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  setMode('synth'); st.fly = null;
  return self;
}
export { makeHeme };
