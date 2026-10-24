import { Sparks, THREE, V3, __set_rnd, button, clamp, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, rnd, seg, toggle } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molFade, molMesh, protMat } from './kit.js';
Object.assign(BIO_MOL, {"tag":{"name":"Triacylglycerol","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"nP5b/XX/qP7k/TT/rv5S/p3/IP5m/tT/FP4c/lgAYv5p/sIAA/69/hUBsP0g/8MADP6N/44AHv7z/wABxf1rAN0ACv65AG4Afv4GAa8AWP6ZAakAb/7LARoAA//rAQYAKv9dAhwAX/+IAdr/hP+HAVL/GQBpAVH/YgDwAUb/zgDmAZ7/xQAHAicAYgA8AlcAPAHoAYIAIwF0AeEA+gD5AJAAYgDqAKMATACcACQBYQAIAAMB4v++/yUBkP+Y/6wAX/8TAGAApP8NANj/Xf+k/4H/4P7j/0b/C/8/ANP+8f7z/1H+Wf+G/zz+OgASAen+vADYAOb+GAEZAbX+1wBOAB//IQH//7P+6ABz/6/+MQEf/xj/2AAW/5T/bACu/nj/pgAi/pH/sgAL/icAJwEG/mYArAEX/hwAGAJC/oAA/wHT/qgAPAIt/zwA0gI6/1MA9gKM/84AuwIYAMMANgIbAA8BzP5c/df/zP4Q/Tf/M/5B/YH/BP/n/fj+U/71/fL+8P40/u//0f6v/nH/2f09/oz/Dv7Q/t//O/63/VEAq/0X/nYAr/6l/pMAlP4g/gQBvv16/ksBPP71/mABZf1O/wQBff3t/nIAbf5m/3AA2/29/zkA/f3H/14Bhv4SAAcBZP1IALsAuv2qADUBMv54ACEAxP0BAUIAh/7mABcB2v7xAHoA7/2mAcQAl/7TAe0AM/4lAgkAUP5+AdP/Tv83AR7/bv/mASP/NQA8AbH/hgD9Ad/+HwBCAl//kwHRAUMAVAFCArwA0wCNAScBfgFdARkBEAEIAScALAGhALUAOAC2AE8ANQBNAa0A6f+xAEoBlwC7AG4BeAD9/5kAtADh/z4B//9g/1kBpP/0/20By/9a/2kAOP9d/8sAe/9uAJUA8/4OAFQADADx/+X/nf9uAKj/ov+D/zP/Qv9O/8D/q/4dAJH/nv6V/x//0P6aANb+dP9WANz+jf7G/1T+9f46AP39vf+w/0r+Sf82/4X+UP9d/9f9FQFVAHj/eAAeADf/jAH//8f+DwEtAFD+fQBy/8P++gBG/0z+kAFO/zP/RQG8/vD+qgB2/6j/EgH3/ur/FwC+/rr/SwC1/hD/XwDY/Wj/AwEW/lz/VgD+/WIAKQH1/dMAogFi/s7/yAG4/e//eQI3/lIAEQIC/tkALALn/gkBlAHm/q0ALAL+/tr/DAKO/zsA/wLX/lsA/gJr//v/YwOV/9QA0wJc/yoBAANgAO8AqgIxAFoA6wFMANIAQwJSAGwBFgK2/yUB","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"thyroxine":{"name":"Thyroxine (T4)","el":"N C C C C C I C O C C C I C O C I C C I C C O O H H H H H H H H H H H","xyz":"Nv4KAAH/aP7n/4T/bv5pANf//f5sAAsAWf+4AM//4/+7AAEAcwAyAaL/BQBxAGwAigB0AJ0A6gArAFEAUQFsABgAtAEhAMr/VQKGAHD/qAGc/7v/CAJU/2//NwFW//n/IwGG/uL/3ACa/0EAoP8dAK4A1f+q/1YBIv8bAIAAEv6E/8//mf2X/9v/S/4Q/wkAQ/69/8D+ZP5cAN3+zv7A/3v/Wv6+AJf/J/5jACgAPv/0AHj/WwHYACQACgJn/xD/iQBl/28A1/7d/7IAg/7a/s7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwACwANAA0ADgANAA8ADwAQAA8AEQAJABEABwASABIAEwASABQAAwAUAAEAFQAVABYAFQAXAAAAGAAAABkAAQAaAAIAGwACABwABAAdAAoAHgAOAB8AEQAgABQAIQAXACIA","o":"111211211211211121112112111111111111"},"argsucc":{"name":"Argininosuccinate","el":"N C N C C C C N C O O N C C C O O C O O H H H H H H H H H H H H H H H H H H","xyz":"UQBUAdT/OQDHAP3/2P+0AEsAmv9FAIwAAv9SAJEAw/5vAAoA2P7y/7P/tP4cAC3/fP6C/+P/A/6R/+P/tP4I/xEAlQBmAMT/lADX/9z/+QCS/3//iQGw/6b/wgETAHz/zwFZ//3/tAC3/24AiQBR/6EABQEQALoAFQCcAfj/ngBoAZb/tf/m/2AAvf9CAPUA6P6jANcA2f71/7kA8P7FANr/WP6BABYAP//T/7b/rP7L//D++v5bAAj/Dv/0/vL/3gCLAIb/MQCv/8P/5wC0/xn/6AAm/4P/ugFh/1wA7gAYABcB","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAIAAkACAAKAAEACwALAAwADAANAA0ADgAOAA8ADgAQAAwAEQARABIAEQATAAAAFAAAABUAAwAWAAMAFwAEABgABAAZAAUAGgAFABsABgAcAAcAHQAHAB4ACgAfAAsAIAAMACEADQAiAA0AIwAQACQAEwAlAA==","o":"1211111121111121121111111111111111111"},"plp":{"name":"Pyridoxal phosphate","el":"C C N C C C O P O O O C C O C O H H H H H H H H H H","xyz":"WgHDALz/3ACAAPX/gQDIACsADgCMAF8A/P8IAFoAe//P/5UAJf+f/zIA6f4WANL/Rv8sAFn/Vf7n/5f/1v6lACIAZACw/xwARgAa/xsAiwDA/u//0ADt/+z/QAGv/6z/WgEtAdj/sgGTAOb/WgG5AFD/wf/KAI0ATP8ZANYAmP96/9YAY/6N/3X/ev6nAD8A6P/2/kcAXQFb/9P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkABwAKAAQACwALAAwADAANAAsADgABAA4ADgAPAAAAEAAAABEAAAASAAMAEwAFABQABQAVAAkAFgAKABcADAAYAA8AGQA=","o":"12121112111122111111111111"},"tyr":{"name":"Tyrosine","el":"N C C C C C C O C C C O O H H H H H H H H H H H","xyz":"Of+cAGsAHP9NAPT/h/9kAIn/EQA4ALr/YgCQAPb/5wBmACUADwHn/xQAjwG//0EAtgCH/9H/PQCt/6f/E/+5/xgA6v5o/8b/PP+M/5kAOv/+AFMAkv+BAJEAu/5sAMz/iv/OAG//bf8rAC//QQD3AAQAKAGuAFYAyQEGAGMA1wAg/8P//P9l/3b/Yf8y/50A","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAIAAkAAwAJAAEACgAKAAsACgAMAAAADQAAAA4AAQAPAAIAEAACABEABAASAAUAEwAHABQACAAVAAkAFgAMABcA","o":"111212112112111111111111"},"arg":{"name":"Arginine","el":"N C C C C N C N N C O O H H H H H H H H H H H H H H","xyz":"R/8eAFf/Mf8iAOf/K/+Z/yYAlv84//n/HQBc/zgAbQCg/9P/4ADy//j/LQE0AI7/AwECAHIAmf99ACkAof+IAKIA8//HANf/OP96AC//pf8AAEP/zv5TAPb/Lf+h/5MAyP5t/w0An/8z/43/e//T/hwADgCd/44AUAAB/1gAVQCX/3H/EgEoAC3/fQFtAKb/0wDY/78AGAAXAQAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAABAAkACQAKAAkACwAAAAwAAAANAAEADgACAA8AAgAQAAMAEQADABIABAATAAQAFAAFABUABwAWAAcAFwAIABgACwAZAA==","o":"1111111212111111111111111"},"adrenaline":{"name":"Epinephrine","el":"C N C C O C C C C O C O C H H H H H H H H H H H H H","xyz":"Qf+lAGf/5v5mAMb/7/7V/7b/R/+Y/yMAC/+l/6IA1f/R/yMA9f89AGsAfgBxAGkA3AA0AB8AYQFnAB0AuQC9/9D/HQF9/4L/PACO/9L/LP8RAWT/Mf98AAP/qf+XAIT/iP6EALT/GP+9/1T/i/6q/73/T/8s/w4A+P4CALUAqv9xAKgAmADKAKQAawHDAAMA/QA2/0j/IgA2/5j/","b":"AAABAAEAAgACAAMAAwAEAAMABQAFAAYABgAHAAcACAAIAAkACAAKAAoACwAKAAwABQAMAAAADQAAAA4AAAAPAAEAEAACABEAAgASAAMAEwAEABQABgAVAAcAFgAJABcACwAYAAwAGQA=","o":"11111212111211111111111111"},"phe":{"name":"Phenylalanine","el":"N C C C C C C C C C O O H H H H H H H H H H H","xyz":"Y/+1AFAARv9XAOT/uP9VAH//OwAlAL7/jwB8APX/DQFOADIAKwHL/zIAzgBr//b/XACV/77/MP/L/x8AYv+u/4oA4v5s/9j/Ef/tAGMAr//yADQA6v52ALL/x/+6AFj/nv8TACz/dwDnAPX/UgGVAF8AiAGo/18A5gAA//b/FwBO/5H/lv5H/wkA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgAAQAJAAkACgAJAAsAAAAMAAAADQABAA4AAgAPAAIAEAAEABEABQASAAYAEwAHABQACAAVAAsAFgA=","o":"11121212112111111111111"},"noradrenaline":{"name":"Norepinephrine","el":"N C C O C C C C O C O C H H H H H H H H H H H","xyz":"A/+x/5sA3f4nAE4AKf8uAMn/Av/D/3T/wP8rAOD/AgCeAPH/lACcAAcA1gAoAAsAYgEnACAAjQCq//j/0wAu//v/CACr/+T/uv6d/98AWv/C/8sAcv4kADoA9P6BAIgAD/+MAJj/C/9u/6H/zP/9AO//ygD6ABUAjQF9ACgAIgEr/zQA0/9N/9b/","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAkACwAEAAsAAAAMAAAADQABAA4AAQAPAAIAEAADABEABQASAAYAEwAIABQACgAVAAsAFgA=","o":"11112121112111111111111"},"citrulline":{"name":"Citrulline","el":"N C O N C C C C N C O O H H H H H H H H H H H H H","xyz":"VP7Q/00Azf4KABQA6/58ADAAH/+4/7r/mf/n/3v/EACe/7v/LQDh/0EAoABDADQAiQCqAND/IgH4/xYAVgH//6j/XgGp/3wAOv5x/zcAG/4HAIsAAP9Z/6f/pP9SAIP/lv/M/xH/ZgCl/3n/9v81/8r/RwCU/4oA0/8VAGMArQB2AJUAewCAAHX/2ADpAMz/QgG7/9YA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAHAAkACQAKAAkACwAAAAwAAAANAAMADgAEAA8ABAAQAAUAEQAFABIABgATAAYAFAAHABUACAAWAAgAFwALABgA","o":"121111111211111111111111"},"glu":{"name":"Glutamate","el":"N C C C C O O C O O H H H H H H H H H","xyz":"1gCAAMP/iABIADEAAgCQADwAqv90AMP/Tf///+P/Vf+X/6P/7f4KAEsAegCy/x8AWABr/30AlAB2/6D/7QDhANf/LAFLALj/wQBaAI4Az/9vAJcAFAD8AEQAbv/NAK3/5v9cAGz/Af/Y/5wAdgCo/1P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAYAEQAJABIA","o":"111121121111111111"},"asp":{"name":"Aspartate","el":"N C C C O O C O O H H H H H H H","xyz":"2//CAAsAw/9OALb/RwARAIj/mQDc//7/kABo/yEA8gAzAEQAbv/n/wIAUP9+/8z/Q/8CAIYACgClAGAAg//uACMAi/9vAF7/gQBcAFP/MgC+/0T/AgEcAKEAGf9ZAJQA","b":"AAABAAEAAgACAAMAAwAEAAMABQABAAYABgAHAAYACAAAAAkAAAAKAAEACwACAAwAAgANAAUADgAIAA8A","o":"111211211111111"},"serotonin":{"name":"Serotonin","el":"N C C C C N C C C C O C C H H H H H H H H H H H H","xyz":"xf5wAHz//v6lAPf/Df80AF0Aev/V/zEAav9T/xkA4v8Y//P/RQB4//L/xgB0/9X/FAHx/9//2QBjAAQAJQHbAA0ASQBmACMABQD2/xoADf9mADb/fv6vAFn/vP7yACAAYP/QAOL/Jf9fAL4Arv7//2UADf8e/yIA7f+4/tz/9wAY/7f/fgHv/8f/VAH2ALz/GwDEAEEA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAkACwALAAwAAwAMAAYADAAAAA0AAAAOAAEADwABABAAAgARAAIAEgAEABMABQAUAAcAFQAIABYACgAXAAsAGAA=","o":"11121121211211111111111111"},"pep":{"name":"Phosphoenolpyruvate","el":"O C O C C O P O O O H H H H H","xyz":"1P4PAMn/UP8sAAcAbf+fACIAs/+7/ygAlv88/wsALwDb/2YAowAIAPn/HwGx/w0AagD0/1//ywCnABEAi/5LAN3/3//u/iQAOP8h/9v/NABCAE3/fgDPAD0A","b":"AAABAAEAAgABAAMAAwAEAAMABQAFAAYABgAHAAYACAAGAAkAAAAKAAQACwAEAAwACAANAAkADgA=","o":"12121121111111"},"akg":{"name":"α-Ketoglutarate","el":"O C O C C C O C O O H H H H H H","xyz":"ff+o/44ASv/o/xoABf+q/8z/af98AAAA5v+GAKj/YABTAPX/mwCfAEIAkQDE/+X/VwB3/5n/AgGX/y4Aj/9K/4YAe/+vAF8AFf+qAM3/2P9LAE7/9v/vAI3/8wBM/2oA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAcACAAHAAkAAAAKAAMACwADAAwABAANAAQADgAJAA8A","o":"121112121111111"},"ornithine":{"name":"Ornithine","el":"N C C C C N C O O H H H H H H H H H H H H","xyz":"pv4eAPb/Fv/i/z8Aj/8/ADUAzP8rAKv/RQDP/7P/JQBN/+v/tQARAAQA+wDN/08AzgCcAPr/df5eADMAyv5QAKb/LP+A/xQA+v7W/6gAbv+mAEAA1v8mAIMAgf/+/2n/6f+MAIH/awC//03/BwBY/0sA2v8j/7b/0gDNAE0A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAYACAAAAAkAAAAKAAEACwABAAwAAgANAAIADgADAA8AAwAQAAQAEQAFABIABQATAAgAFAA=","o":"11111121111111111111"},"fumarate":{"name":"Fumarate","el":"O C O C C C O O H H H H","xyz":"Gf98/wAAP/8FAAAA5f5ZAAAAz/8zAAAALgDW/wAAvgAEAAAA4QB5AAAAJgGh/wAAJf9M/1MA5P+eAAAAGABr/wAABwFF/wgA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAAACAADAAkABAAKAAcACwA=","o":"12121211111"},"dopamine":{"name":"Dopamine","el":"N C C C C C C O C O C H H H H H H H H H H H","xyz":"yv4LAIsAz/5CAAQAGf/h/6j/rf/d/83/6f9o/+f/dwBk/woAvgDW/xEARwHT/zMAfABXAPX/xgDPAPz/+v9aANX/df4qALkAGf8rAMAABf+hAAYAav5TAN//7v59/7T/Dv8BAEH/sP8L/+H/qAAF/x8AbwF6/z0AxwD8AFIAyf+5AMD/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAAIAAkACAAKAAMACgAAAAsAAAAMAAEADQABAA4AAgAPAAIAEAAEABEABQASAAcAEwAJABQACgAVAA==","o":"1112121112111111111111"},"ala":{"name":"Alanine","el":"N C C C O O H H H H H H H","xyz":"eP9pAD0AuP/n/ycAc/+f/7P/SwD8/wYAoQC6/0AAcgBbAKT/vv+sAFoAMf9gAIUAr/+r/4EAof+9/1X/fP80/8D/Cf+6/7H/cgA7AEj/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAEACAACAAkAAgAKAAIACwAFAAwA","o":"111211111111"},"carbp":{"name":"Carbamoyl phosphate","el":"N C O O P O O O H H H H","xyz":"DP+f//P/b/8EABYAW/95APr/5//e/1kAbgD6//7/TgDh/2r/nwCXABEA5wCU/y0AHf8+/woAt/65/8P/ygCaAGgA3ABD//f/","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABAAHAAAACAAAAAkABgAKAAcACwA=","o":"12112111111"},"acetoacetate":{"name":"Acetoacetate","el":"C C O C C O O H H H H H H","xyz":"IP+r/y4Ahf8XAAcAbv9hAKn/BwAnAFcAfADy/wQAagCa/7L//gApABYA0P7Y/2kA9v5//9T/Uv9e/2gAAADu/7MAFwCQAG4AOAH5/1QA","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYAAAAHAAAACAAAAAkAAwAKAAMACwAGAAwA","o":"121121111111"},"histamine":{"name":"Histamine","el":"N C C C C N C N H H H H H H H H H","xyz":"D/8AAIz/G/8lABgAhP/L/1sADgDu/ygAQwBnACEAwgBYAOz/1QDR/9T/awCR//f/3f5JAFr/3P6p/4T/Ov+NACAAu/4XAEoAbf9j/0UAf//a/8cAFQDDAD8AAwGhANv/LQGk/6z/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAMABwAAAAgAAAAJAAEACgABAAsAAgAMAAIADQAEAA4ABQAPAAYAEAA=","o":"11121121111111111"},"pyruvate":{"name":"Pyruvate","el":"C C O C O O H H H H","xyz":"ngB1AAAASwD1/wAAgwCI/wAAsv/9/wAAcP+W/wAAcv97AAAAZgDFAM//tACSAGcA/ABkAMr/WP+eAKn/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAAFAAkA","o":"121211111"},"gaba":{"name":"GABA","el":"N C C C C O O H H H H H H H H H","xyz":"DP9HABgAX/8CALb/qP+O//r/EQDF/1oAgQAJAAoA1gDF/9L/hgCWAAIAwP52AOn/RP+LAEoAp/9IAIz/H//b/2b/YP9R/zEA2f9R/67/OwBz/5QA4/8NAJ0A1ADBACcA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAAAHAAAACAABAAkAAQAKAAIACwACAAwAAwANAAMADgAGAA8A","o":"111121111111111"},"acetyl":{"name":"Acetyl-CoA","el":"C C O S C H H H H H H","xyz":"p/9y//P/vP8JAPz/X/9SABoAXwBQANn/3wDj/x0ARf9d/8f/9f9G/7X/q/9H/1cAQgENAAcA0wDb/4kA1wCA//D/","b":"AAABAAEAAgABAAMAAwAEAAAABQAAAAYAAAAHAAQACAAEAAkABAAKAA==","o":"1211111111"},"urea":{"name":"Urea","el":"N C N O H H H H","xyz":"gv9DAAAAAAD6/wAAfgBDAAAAAACA/wAAgv+oAAAAKv8RAAAAfgCoAAAA1gARAAAA","b":"AAABAAEAAgABAAMAAAAEAAAABQACAAYAAgAHAA==","o":"1121111"},"co2":{"name":"CO₂","el":"O C O","xyz":"hv8AAAAAAAAAAAAAegAAAAAA","b":"AAABAAEAAgA=","o":"22"},"nh3":{"name":"Ammonia","el":"N H H H","xyz":"GQAEAAMA8/9JAMP/6f8LAFwACwCo/93/","b":"AAABAAAAAgAAAAMA","o":"111"}});


// @scene aminoacid makeAminoacid | Обмен аминокислот и мочевина | Белки и аминокислоты
/* =========================================================
   БИОХИМИЯ · АМИНОКИСЛОТЫ: переваривание белков (эндо- и экзопептидазы), трансаминирование
   и дезаминирование, орнитиновый цикл мочевины, обмен фенилаланина и тирозина (ФКУ, альбинизм)
   ========================================================= */
const AM_PEP = [
  { id: 'pep', name: 'Pepsin', color: '#FF8A5C', where: 'stomach, pH 1.5–2', text: '<b>Pepsin</b> — stomach. It is secreted as pepsinogen and activated by hydrochloric acid. An endopeptidase: it cuts the protein in the middle, next to aromatic amino acids. HCl also denatures food proteins and kills microbes.' },
  { id: 'try', name: 'Trypsin', color: '#7FD6FF', where: 'intestine, pH 7.5–8', text: '<b>Trypsin</b> (formed from trypsinogen by enteropeptidase) cuts after lysine and arginine and activates the other pancreatic proenzymes.' },
  { id: 'chy', name: 'Chymotrypsin', color: '#C77DFF', where: 'intestine', text: '<b>Chymotrypsin</b> cuts after aromatic amino acids (phenylalanine, tyrosine, tryptophan); <b>elastase</b> cuts after small ones (alanine, glycine, serine).' },
  { id: 'exo', name: 'Carboxy- and aminopeptidases', color: '#7FE0A0', where: 'intestine', text: '<b>Exopeptidases</b> nibble amino acids off the ends one at a time: carboxypeptidases (pancreatic, zinc-containing) from the C-terminus, intestinal aminopeptidases and dipeptidases from the N-terminus. Free amino acids are absorbed by Na⁺-dependent transporters.' },
];
const AM_ARO = [
  ['phe', [-6.2, 0.6]], ['tyr', [-3.4, 0.6]], ['dopamine', [-0.4, 2.0]], ['noradrenaline', [2.4, 2.0]], ['adrenaline', [5.2, 2.0]], ['thyroxine', [-0.4, -1.2]],
];
function makeAminoacid() {
  __set_rnd(mulberry(1801));
  const scene = bioStage({ rim: 0x7fe0a0 });
  const VIEW = { dig: flyTarget(V3(0, -1.6, 0), V3(0.5, 0.8, 17)), trans: flyTarget(V3(40, -1.5, 0), V3(40.5, 0.6, 16)), urea: flyTarget(V3(80, -1.6, 0), V3(80.6, 0.6, 18)), aro: flyTarget(V3(120, -1.6, 0), V3(120.5, 0.6, 17.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.dig.pos);
  const controls = makeControls(camera, VIEW.dig.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  /* ---------- 1. переваривание ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const NB = 48; const seqT = Array.from({ length: NB }, () => ['np', 'pol', 'acid', 'base', 'aro'][Math.floor(rnd() * 5)]);
  const typeC = { np: '#F2C14E', pol: '#7FE0A0', acid: '#FF6A6A', base: '#7FA8FF', aro: '#C77DFF' };
  const beadM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, envMapIntensity: 0.5 }), NB); G1.add(beadM);
  seqT.forEach((ty, i) => beadM.setColorAt(i, new THREE.Color(typeC[ty]).multiplyScalar(0.55)));
  const home = Array.from({ length: NB }, (_, i) => V3(-5.0 + i * 0.27, 0.9 + 0.35 * Math.sin(i * 0.55), 0.3 * Math.cos(i * 0.8)));
  const cut = new Array(NB).fill(0); // разрезы после i (время разреза)
  const cutPlan = [[8, 'pep'], [21, 'pep'], [33, 'pep'], [4, 'try'], [14, 'try'], [27, 'try'], [40, 'try'], [11, 'chy'], [18, 'chy'], [30, 'chy'], [37, 'chy'], [44, 'chy']];
  const enzB = AM_PEP.map((p, k) => { const m = new THREE.Mesh(blobGeo(0.32, 0.26, 0.28, k + 5, 0.12, 3), protMat(p.color, 0.4)); m.visible = false; G1.add(m); return m; });
  const stomach = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), glassMat(0xff8a5c, { rim: 0.25, base: 0.004 })); stomach.scale.set(4.5, 1.6, 1.2); stomach.position.set(-3.6, 0.9, 0); G1.add(stomach);
  const gutT = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 7.5, 32, 1, true), glassMat(0x7fd6ff, { rim: 0.25, base: 0.004 })); gutT.rotation.z = Math.PI / 2; gutT.position.set(3.8, 0.9, 0); G1.add(gutT);
  /* ---------- 2. трансаминирование ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const TM = { ala: [-4.2, 1.6], akg: [-4.2, -0.6], pyruvate: [-0.6, 1.6], glu: [-0.6, -0.6], akg2: [3.6, 1.6], nh3: [3.6, -0.6] };
  const tmM = {}; Object.entries(TM).forEach(([id, [x, y]]) => { const m = molMesh(MOL(id === 'akg2' ? 'akg' : id), { scale: id === 'nh3' ? 0.3 : 0.17, hideH: id !== 'nh3' }); m.position.set(x, y, 0); G2.add(m); tmM[id] = m; });
  const plp = molMesh(MOL('plp'), { scale: 0.14, hideH: true }); plp.position.set(-2.4, 0.5, 0.6); G2.add(plp);
  const nTok = glowNucleus(G2, V3(0, 0, 0), '#4F74FF', 0.1, 10);
  const alt = new THREE.Mesh(blobGeo(1.2, 1.7, 0.9, 81, 0.1, 4), glassMat(0x7fe0a0, { rim: 0.25, base: 0.004 })); alt.position.set(-2.4, 0.5, 0); G2.add(alt);
  const gdh = new THREE.Mesh(blobGeo(1.2, 1.7, 0.9, 82, 0.1, 4), glassMat(0xffb070, { rim: 0.25, base: 0.004 })); gdh.position.set(1.5, 0.5, 0); G2.add(gdh);
  const amines = ['histamine', 'serotonin', 'gaba', 'dopamine'].map((id, k) => { const m = molMesh(MOL(id), { scale: 0.13, hideH: true }); m.position.set(-4.2 + k * 2.6, -2.4, 0); G2.add(m); return m; });
  /* ---------- 3. цикл мочевины ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const mito = new THREE.Mesh(new THREE.CapsuleGeometry(1.25, 2.4, 10, 36), glassMat(0xffb070, { rim: 0.3, base: 0.004 })); mito.rotation.z = Math.PI / 2; mito.position.set(-3.6, 0.1, -0.3); G3.add(mito);
  const UC = [['ornithine', 0], ['citrulline', 1], ['argsucc', 2], ['arg', 3]]; const UR = 2.4, UCN = V3(1.4, 0.3, 0);
  const uang = (k) => Math.PI - 0.3 - k * (Math.PI * 2 / 4);
  const ucM = UC.map(([id], k) => { const m = molMesh(MOL(id), { scale: 0.13, hideH: true }); m.position.set(UCN.x + Math.cos(uang(k)) * UR, UCN.y + Math.sin(uang(k)) * UR, 0); G3.add(m); return m; });
  const carbP = molMesh(MOL('carbp'), { scale: 0.16, hideH: true }); carbP.position.set(-3.4, 0.1, 0.4); G3.add(carbP);
  const urea = molMesh(MOL('urea'), { scale: 0.22, hideH: false }); G3.add(urea);
  const extra = { nh3: molMesh(MOL('nh3'), { scale: 0.26 }), co2: molMesh(MOL('co2'), { scale: 0.22 }), asp: molMesh(MOL('asp'), { scale: 0.15, hideH: true }), fum: molMesh(MOL('fumarate'), { scale: 0.15, hideH: true }) };
  Object.values(extra).forEach((m) => G3.add(m)); extra.nh3.position.set(-5.4, 1.1, 0.3); extra.co2.position.set(-5.4, -0.8, 0.3);
  const ucArcs = UC.map((_, k) => { const a0 = uang(k) - 0.25, a1 = uang(k + 1) + 0.25; const pts = []; for (let i = 0; i <= 20; i++) { const a = a0 + (a1 - a0) * i / 20; pts.push(V3(UCN.x + Math.cos(a) * UR, UCN.y + Math.sin(a) * UR, 0)); } const f = flowTubeMat('#7FE0A0', 0.5, 1.2); G3.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.035, 6), f)); return f; });
  const inArrow = flowArrow(G3, V3(-3.0, 0.3, 0.3), ucM[0].position.clone().lerp(ucM[1].position, 0.5).add(V3(-0.2, -0.4, 0)), '#F2C14E', { bend: 0.3 });
  /* ---------- 4. фенилаланин и тирозин ---------- */
  const G4 = new THREE.Group(); G4.position.set(120, 0, 0); scene.add(G4);
  const aroM = {}; AM_ARO.forEach(([id, [x, y]]) => { const m = molMesh(MOL(id), { scale: 0.15, hideH: true }); m.position.set(x, y, 0); G4.add(m); aroM[id] = m; });
  const melanin = new THREE.Mesh(blobGeo(0.5, 0.35, 0.4, 91, 0.25, 3), new THREE.MeshPhysicalMaterial({ color: 0x2a1a10, roughness: 0.7, emissive: 0x3a2010, emissiveIntensity: 0.2 })); melanin.position.set(-0.4, 3.0, 0); G4.add(melanin);
  const ppa = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x5a3a8a, emissive: 0x9f7bff, emissiveIntensity: 0.3 })); ppa.position.set(-6.2, -1.6, 0); G4.add(ppa);
  const fumAce = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0x3a5a3a, emissive: 0x7fe0a0, emissiveIntensity: 0.3 })); fumAce.position.set(-3.4, -2.4, 0); G4.add(fumAce);
  const aroArr = [['phe', 'tyr', 'pah'], ['tyr', 'dopamine', ''], ['dopamine', 'noradrenaline', ''], ['noradrenaline', 'adrenaline', ''], ['tyr', 'thyroxine', '']].map(([a, b, tag]) => ({ tag, f: flowArrow(G4, aroM[a].position.clone().add(V3(0.6, 0, 0)), aroM[b].position.clone().add(V3(-0.7, 0, 0)), '#7FE0A0', { bend: 0.1 }) }));
  const toMel = flowArrow(G4, aroM.tyr.position.clone().add(V3(0.3, 0.5, 0)), melanin.position.clone().add(V3(-0.5, 0, 0)), '#7FE0A0', { bend: -0.2 });
  const toPPA = flowArrow(G4, aroM.phe.position.clone().add(V3(0, -0.6, 0)), ppa.position.clone().add(V3(0, 0.3, 0)), '#9F7BFF', { bend: 0 });
  const toFA = flowArrow(G4, aroM.tyr.position.clone().add(V3(0, -0.6, 0)), fumAce.position.clone().add(V3(0, 0.3, 0)), '#7FE0A0', { bend: 0 });
  const xPAH = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 32), new THREE.MeshBasicMaterial({ color: 0xff5a5a })); xPAH.position.set(-4.8, 0.6, 0.3); G4.add(xPAH);
  const xTYR = xPAH.clone(); xTYR.position.set(-1.9, 2.0, 0.3); G4.add(xTYR);
  const xHGO = xPAH.clone(); xHGO.position.set(-3.4, -1.5, 0.3); G4.add(xHGO);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'dig', labels: true, rot: false, fly: null, cyc: 0, msg: null, sel: null, dis: 'none' };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3, G4].forEach((g, k) => { g.visible = ['dig', 'trans', 'urea', 'aro'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; st.sel = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const dm = new THREE.Object3D(); const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'dig') {
      const c = st.cyc % 16; const ph = c < 4 ? 'pep' : c < 8 ? 'try' : c < 11 ? 'chy' : 'exo';
      st.digPh = AM_PEP.find((p) => p.id === ph);
      // какие разрезы уже сделаны
      const done = new Set(cutPlan.filter(([i, e], k) => { const tt = { pep: 1, try: 4.5, chy: 8.5 }[e] + (k % 4) * 0.6; return c > tt; }).map(([i]) => i));
      // фрагменты разъезжаются; экзопептидазы откусывают по одной с концов после 11 с
      let frag = 0, shift = 0; const exoT = c > 11 ? (c - 11) / 5 : 0;
      for (let i = 0; i < NB; i++) {
        if (i > 0 && done.has(i - 1)) frag++;
        const fragOff = V3((frag - 4) * 0.35 * ease(c / 6), 0.25 * Math.sin(frag * 2.1) * ease(c / 5), 0);
        const free = exoT > 0 && ((i * 7) % 11) / 11 < exoT;
        const p = home[i].clone().add(fragOff); if (c > 4) p.x += 1.2 * ease((c - 4) / 4);
        if (free) p.add(V3(Math.sin(i) * 0.6, -1.4 - (i % 3) * 0.4, Math.cos(i * 1.7) * 0.5).multiplyScalar(ease((exoT - ((i * 7) % 11) / 11) * 4)));
        dm.position.copy(p); dm.scale.setScalar(1); dm.updateMatrix(); beadM.setMatrixAt(i, dm.matrix);
      }
      beadM.instanceMatrix.needsUpdate = true;
      enzB.forEach((m, k) => { const on = AM_PEP[k].id === ph; m.visible = on; if (on) { m.position.set(-5 + ((t * 1.3 + k) % 1) * 9.5, 1.45 + 0.1 * Math.sin(t * 4), 0.25); m.rotation.y += dt * 3; } });
      stomach.visible = c < 4.2; gutT.visible = c >= 3.8;
    }
    if (st.mode === 'trans') {
      const c = st.cyc % 10;
      // 0–3: NH₂ с аланина → ПФ → α-КГ (глутамат); 3–6: глутамат → ГДГ → NH₃
      let p;
      if (c < 1.5) p = tmM.ala.position.clone().lerp(plp.position, ease(c / 1.5));
      else if (c < 3) p = plp.position.clone().lerp(tmM.glu.position, ease((c - 1.5) / 1.5));
      else if (c < 5.5) p = tmM.glu.position.clone().lerp(tmM.nh3.position, ease((c - 3) / 2.5));
      else p = tmM.nh3.position.clone();
      nTok.core.position.copy(p); nTok.spr.position.copy(p); nTok.core.visible = nTok.spr.visible = c < 6;
      molFade(tmM.ala, c < 1.5 ? 1 : 0.25); molFade(tmM.pyruvate, c > 1.2 ? 1 : 0.25); molFade(tmM.akg, c < 3 ? 1 : 0.25); molFade(tmM.glu, c > 2.6 && c < 5 ? 1 : 0.25); molFade(tmM.akg2, c > 5 ? 1 : 0.25); molFade(tmM.nh3, c > 5 ? 1 : 0.25);
      Object.values(tmM).forEach((m) => { m.rotation.y += dt * 0.5; }); plp.rotation.y += dt; amines.forEach((m) => { m.rotation.y += dt * 0.4; });
      st.trPh = c < 3 ? 'transamination (ALT + PLP)' : c < 6 ? 'oxidative deamination (GDH)' : 'NH₃ → to the urea cycle';
    }
    if (st.mode === 'urea') {
      const c = st.cyc % 12; const k = Math.floor(c / 2.4); st.uk = k;
      ucArcs.forEach((f, j) => { f.uniforms.uTime.value = t; f.uniforms.uOn.value = j === (k + 3) % 4 ? 1 : 0.25; });
      inArrow.mat.uniforms.uTime.value = t;
      ucM.forEach((m, j) => { m.rotation.y += dt * 0.5; const s = j === k % 4 ? 1.25 : 1; m.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); });
      carbP.rotation.y += dt; extra.nh3.rotation.y += dt; extra.co2.rotation.y += dt;
      extra.asp.visible = c > 4 && c < 7; extra.asp.position.copy(V3(UCN.x + 3.6, UCN.y - 2.4, 0).lerp(ucM[2].position, ease((c - 4) / 2))); extra.asp.rotation.y += dt;
      extra.fum.visible = c > 7 && c < 9.6; extra.fum.position.copy(ucM[2].position.clone().lerp(V3(UCN.x + 4.6, UCN.y - 0.6, 0), ease((c - 7) / 2.5))); extra.fum.rotation.y += dt;
      urea.visible = c > 9.2; urea.position.copy(ucM[3].position.clone().lerp(V3(UCN.x + 4.4, UCN.y + 2.4, 0), ease((c - 9.2) / 2.5))); urea.rotation.y += dt;
    }
    if (st.mode === 'aro') {
      Object.values(aroM).forEach((m) => { m.rotation.y += dt * 0.4; });
      [...aroArr.map((a) => a.f), toMel, toPPA, toFA].forEach((f) => { f.mat.uniforms.uTime.value = t; });
      aroArr[0].f.mat.uniforms.uOn.value = st.dis === 'pku' ? 0.05 : 1; toPPA.mat.uniforms.uOn.value = st.dis === 'pku' ? 1 : 0.06; toMel.mat.uniforms.uOn.value = st.dis === 'alb' ? 0.05 : 1; toFA.mat.uniforms.uOn.value = st.dis === 'alk' ? 0.25 : 1;
      xPAH.visible = st.dis === 'pku'; xTYR.visible = st.dis === 'alb'; xHGO.visible = st.dis === 'alk';
      aroM.phe.scale.setScalar(st.dis === 'pku' ? 1.35 + 0.1 * Math.sin(t * 3) : 1); melanin.visible = st.dis !== 'alb'; ppa.visible = st.dis === 'pku';
    }
    fx.update(dt);
  }
  const TXT = {
    dig: '<b>Protein digestion</b> is the hydrolysis of peptide bonds. Food proteins (a chain of multicolored amino acids) are first chopped up by <b>endopeptidases</b> — pepsin in the stomach, trypsin, chymotrypsin and elastase in the intestine — each at “its own” amino acids. Then <b>exopeptidases</b> remove amino acids one at a time from the ends. Free amino acids are absorbed into the portal vein blood. All proteases are made as inactive proenzymes — otherwise they would digest the gland itself (which is exactly what happens in pancreatitis).',
    trans: '<b>Transamination</b> is the transfer of an amino group from an amino acid to an α-keto acid. <b>Alanine aminotransferase (ALT)</b> moves NH₂ (blue spark) from alanine to α-ketoglutarate via the coenzyme <b>pyridoxal phosphate</b> (vitamin B6), producing pyruvate and glutamate. In this way the nitrogen of almost all amino acids is collected on glutamate. Then <b>glutamate dehydrogenase</b> releases it as <b>ammonia</b> (oxidative deamination, + NADH) — this is “indirect deamination”. Below are the biogenic amines formed by <b>decarboxylation</b> of amino acids: histamine, serotonin, GABA, dopamine.',
    urea: '<b>The ornithine cycle</b> (Krebs–Henseleit) is the main way to detoxify ammonia; it runs <b>only in the liver</b>. In the mitochondrion, NH₃ + CO₂ + 2 ATP → <b>carbamoyl phosphate</b>; it combines with ornithine → <b>citrulline</b>, which moves out into the cytoplasm. The second nitrogen atom is brought in by <b>aspartate</b> → argininosuccinate → <b>fumarate</b> is split off (it goes to the Krebs cycle) → arginine. <b>Arginase</b> cleaves <b>urea</b> off arginine and regenerates ornithine. Each turn costs 3 ATP (4 high-energy bonds). Urea travels in the blood to the kidneys: 25–35 g a day.',
    aro: '<b>Phenylalanine and tyrosine.</b> Phenylalanine hydroxylase converts the essential amino acid phenylalanine into tyrosine, and tyrosine is used to make the <b>catecholamines</b> (dopamine → norepinephrine → epinephrine), the <b>thyroid hormones</b> and the pigment <b>melanin</b>. The rest is broken down to fumarate and acetoacetate. Inherited blocks in this pathway are classic enzymopathies: choose a disease.',
  };
  const DIS = {
    pku: '<b>Phenylketonuria</b> (1 in ~7000 newborns): phenylalanine hydroxylase is missing. Phenylalanine and its products (phenylpyruvate — the “phenylketones” in the urine, a mousy odor) build up and damage the developing brain. All newborns are screened in the first days of life; the treatment is a phenylalanine-restricted diet from birth, and the child then develops normally.',
    alb: '<b>Albinism</b>: a defect of <b>tyrosinase</b> — no melanin is formed. White skin and hair, a pale iris, photophobia, a high risk of sunburn and skin cancer.',
    alk: '<b>Alkaptonuria</b> was the first disease to be called an “inborn error of metabolism” (A. Garrod, 1902): a defect of homogentisate oxidase. The urine darkens on exposure to air; by middle age the cartilage darkens (ochronosis) and the joints ache.',
  };
  const labels = [
    { text: 'stomach: pepsin + HCl', pos: V3(-6.4, 2.6, 0), color: '#FF8A5C', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 < 4.2 },
    { text: 'small intestine', pos: V3(1.5, 2.4, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 >= 3.8 },
    { text: 'amino acids → blood', pos: V3(2.4, -1.4, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'dig' && st.cyc % 16 > 11 },
    ...Object.entries(TM).map(([id, [x, y]]) => ({ text: MOL(id === 'akg2' ? 'akg' : id).name, pos: V3(40 + x - 0.5, y - 0.85, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'trans' })),
    { text: 'ALT + pyridoxal phosphate (B6)', pos: V3(40 - 3.6, 2.6, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'trans' },
    { text: 'glutamate dehydrogenase', pos: V3(40 + 0.4, 2.6, 0), color: '#FFB070', show: () => st.labels && st.mode === 'trans' },
    ...['histamine', 'serotonin', 'GABA', 'dopamine'].map((n, k) => ({ text: n, pos: V3(40 - 4.6 + k * 2.6, -3.1, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'trans' })),
    { text: 'mitochondrion', pos: V3(80 - 4.6, 1.6, 0), color: '#FFB070', show: () => st.labels && st.mode === 'urea' },
    { text: 'carbamoyl phosphate', pos: V3(80 - 4.0, -0.6, 0.4), color: '#F2C14E', show: () => st.labels && st.mode === 'urea' },
    ...UC.map(([id], k) => ({ text: MOL(id).name, pos: V3(80 + UCN.x + Math.cos(uang(k)) * (UR + 0.9) - 0.5, UCN.y + Math.sin(uang(k)) * (UR + 0.7), 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'urea' })),
    { text: 'urea → kidneys', pos: V3(80 + UCN.x + 4.0, UCN.y + 3.0, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'urea' },
    { text: 'aspartate', pos: V3(80 + UCN.x + 3.4, UCN.y - 2.9, 0), color: '#FF6A6A', show: () => st.labels && st.mode === 'urea' },
    { text: 'fumarate → Krebs cycle', pos: V3(80 + UCN.x + 4.0, UCN.y - 1.1, 0), color: '#7FD6FF', show: () => st.labels && st.mode === 'urea' },
    ...AM_ARO.map(([id, [x, y]]) => ({ text: MOL(id).name, pos: V3(120 + x - 0.5, y - 0.85, 0), color: '#EFEAE6', show: () => st.labels && st.mode === 'aro' })),
    { text: 'melanin', pos: V3(120 + 0.3, 3.0, 0), color: '#C8A080', show: () => st.labels && st.mode === 'aro' && st.dis !== 'alb' },
    { text: 'phenylpyruvate', pos: V3(120 - 5.8, -1.7, 0), color: '#9F7BFF', show: () => st.labels && st.mode === 'aro' && st.dis === 'pku' },
    { text: 'homogentisate → fumarate + acetoacetate', pos: V3(120 - 3.0, -2.5, 0), color: '#7FE0A0', show: () => st.labels && st.mode === 'aro' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = AM_PEP.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'dig' && p ? p.text : st.mode === 'aro' && st.dis !== 'none' ? DIS[st.dis] : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'dig', label: 'Digestion' }, { id: 'trans', label: 'Transamination' }, { id: 'urea', label: 'Urea cycle' }, { id: 'aro', label: 'Phenylalanine and tyrosine' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 420px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'dig') box.append(h('div', { class: 'glabel' }, 'Enzyme'), h('div', { class: 'gctl' }, seg(AM_PEP.map((p) => ({ id: p.id, label: p.name, color: p.color })), () => st.sel, (v) => { st.sel = v; refs.setInfo(); })));
      else if (st.mode === 'aro') box.append(h('div', { class: 'glabel' }, 'Enzymopathy'), h('div', { class: 'gctl' }, seg([{ id: 'none', label: 'Normal' }, { id: 'pku', label: 'Phenylketonuria', color: '#9F7BFF' }, { id: 'alb', label: 'Albinism', color: '#F2E6C8' }, { id: 'alk', label: 'Alkaptonuria', color: '#7FE0A0' }], () => st.dis, (v) => { st.dis = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Cycle'), h('div', { class: 'gctl' }, button('Restart', () => { st.cyc = 0; }, true)));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–4', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['dig', 'trans', 'urea', 'aro'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'dig') return [['Active', st.digPh ? st.digPh.name : '', ''], ['Where', st.digPh ? st.digPh.where : '', '']];
    if (st.mode === 'trans') return [['Stage', st.trPh || '', '']];
    if (st.mode === 'urea') return [['Urea per day', '25–35', 'г'], ['Blood ammonia', '25–40', 'µmol/L']];
    return [['Protein per day', '≈ 1', 'g/kg']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Biochemistry · protein metabolism', title: 'Amino acid metabolism and urea',
    lede: 'Dietary proteins are broken down into amino acids; their nitrogen is removed and turned into toxic ammonia — and the liver packages it into harmless urea.',
    notes: `
      <div><h2>Nitrogen balance</h2>
        <p>The body’s proteins are constantly being renewed (~300 g a day). <b>Nitrogen balance</b> is the difference between the nitrogen taken in with food and the nitrogen excreted: it is positive in growing children and pregnant women, and negative in starvation, burns and severe illness. The protein requirement of an adult is about 1 g per kg of body weight.</p>
        <h3>Ammonia</h3><p>NH₃ is highly toxic to the brain (it ties up α-ketoglutarate and disrupts the Krebs cycle in neurons). It is transported in safe forms: <b>glutamine</b> (glutamine synthetase) and <b>alanine</b> (the glucose–alanine cycle from muscle). In the kidneys, glutaminase releases NH₃, which leaves in the urine as <b>ammonium salts</b> — this is also a way to excrete acid. In cirrhosis, ammonia is not detoxified, leading to hepatic encephalopathy.</p>
        <h3>Fate of the carbon skeleton</h3><p>Glucogenic amino acids yield pyruvate and Krebs cycle intermediates (from which glucose can be made); ketogenic ones (leucine, lysine) yield acetyl-CoA and ketone bodies.</p></div>
      <div><h2>Models</h2><ul><li>Molecules are built from their chemical formulas; enzymes and organs are schematic.</li><li>The “protein” in digestion mode is a conventional chain of 48 amino acids.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> mode</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  setMode('dig'); st.fly = null;
  return self;
}
export { makeAminoacid };
