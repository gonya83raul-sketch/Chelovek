import { THREE, V3, __set_rnd, displaceGeo, envTex, flowTubeMat, labLights, mulberry, noise3, organMat, rand, rnd, smooth } from '../core.js';


/* малые молекулы: координаты построены по формулам (SMILES) */
const BIO_MOL = {"t3":{"name":"Трийодтиронин (T3)","el":"N C C C C C I C O C C C C O C I C C I C C O O H H H H H H H H H H H H","xyz":"ov7m/wX/Uf4IAHn/Zf6h/+j/9f6h/xoAGP/t/4MAo//s/7MA2f9kAFgB//+g/3cAhQCg/6YA4QDt/1oA3gBzAGIAPQHDABQAmAGHAMb/9AHVAHv/nAH0/77/KgKV/0T/RQGr/wUA2f9M/wQAaQDV/qX/Wv9N/9j/c/6UAKv/wv7bAG7/N/7FACMAjv6H/+j+BP/t/x3/5/0HAFv/TP4+/8L/Iv64/zsAzv4rALQAlACkAKEAOgEwARoA0AEBASz/SAE+////Pv8P/4P/dP7gAGkA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwADAANAAwADgAOAA8ADgAQAAkAEAAHABEAEQASABEAEwADABMAAQAUABQAFQAUABYAAAAXAAAAGAABABkAAgAaAAIAGwAEABwACgAdAAsAHgANAB8AEAAgABMAIQAWACIA","o":"111211211212111211121121111111111111"},"cn":{"name":"Цианид","el":"C N","xyz":"5v/r/y8AGgAVANH/","b":"AAABAA==","o":"3"}};

/* белки, ДНК и мембраны: атомные структуры из Protein Data Bank */
const BIO_PDB = {"hb":{"title":"Гемоглобин 4HHB","r":35.8,"chains":[{"id":"A","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCHHHHHHHHHHHHHHHHCHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHHHCCC","ca":"xwBYATMADwFOASgAOgF1AVoAdgGSAUIAogFgAV4AdQErATQAjQFSAfn/0wFNAQoAzQEGARUAqgH2ANL/2wEmAar/FAIEAcT//gG8AL//5QHHAHf/IwLrAGb/RQKnAHn/FgKHAEv/NAKzABb/OQKVANL+HQJLAOj+2AFwAO/+vQFHALT+1wEDAML+vAEKAAn/dwEjAOr+dwHm/8P+hwG1//7+UgHX/yj/HgHF//P+NQF9/+7+MgF4/zn/6wCS/zf/1ABh/wH/7gAm/yP/2wA4/2r/lgBX/1n/ewA4/xz/OwBd/xn/ZACa/wD/cQB3/8L+JwCE/67+PADK/5n+dgCs/2r+UgB5/0L+cgCc/wH+uwCR/xv+6QBY/xX+9wBP/1z+MgEc/1b+aAE1/33+lgFj/1z+ZAF5/yb+cgG1/wb+KwHP/xX+OQHG/2D+ewHl/1n+YAEeADb+JwEpAGX+VgEmAKH+fQFfAIX+RAGHAHz+LAF7AMP+bwGOANz+dgHLALj+NgHiANL+TAHWABb/iwH5AAX/YgE2AfD+OAE2ATH/egE0AVz/kQFzATL/UgGTAUL/PwF5AYj/JAG6AZz/7gC8AWL/4gB3AUz/nwCJATn/sAC1AQT/7ACJAfL+wgBGAer+ggBpAc3+iwBHAYn+jwACAab+WQAMAdj+JwAdAZ/+QQDfAHv+NwCwALP+8//TAMf+1//VAIL+8/+fAFv+FgBqAH3+5/9oALv+EAA9AOf+6/8uACj/EABWAF//IAAYAIj/VAACAFf/fgBCAGP/kQAjAKn/pQDk/4v/1gADAFr/7gA0AJH//AD1/77/JwHU/4T/TgESAHf/XwEWAMD/dQHR/77/nwHd/4H/wQEaAKD/zgHy/9//7QG5/7f/HQLo/5L/LgIhAMX/RQL3/wUAbgI3AB8AOAJtABQA+QFFACcA9QFaAG8AtQFcAJgAsQGjAI8AuAGgAEUAhgFjAD8AVQGQAGIAYQHMADUAXwGkAPX/HgGAAAsAAQHGABUAGQHfANT/+gCmAK3/uQCuANH/uAD3ALv/yQDpAHT/jwC0AHb/YADoAJD/cQAcAV3/aQDlACb/IQDSAED/EAAaAUz/5P8oAQ//wP/kABH/e/8BASf/","o":"Gudd5U7IL8u6M9G4SM7QJLHPH8uxRNDJL63jGr26NdyzOMrBL7LXGNCsM/6qObfaLarqnxn62Niuya0KrAE3yLHn26QOx8Q4qdEPwbII0qoXsdctqtARy6wH27Izs88ptr0H26gdxd5J71PL9A6exzK/BVHF/wecvyS9DlTMTMbkGa/LOByy1bQyP03/KhNZGl/wH8K4Qhy6/089E1wj3VwTAlE6JVYiH10U4VofAUxBD1krBGIU3VQqB0xBHFYr614bAUdHGEs+Blwn60o/CUBMIlwSnAEHowQmyUYt5Q6h/d+iztyx8d2kIuqkwbP3qc/6wMHUxq/5t8Icr8X/ybTcz6kBpuUjt9bKwLMA55/5xbMYAVQ2V8/6WxUkUN0wV88BZAQAXP8oVtceYu8LYBITXOkhWtX5YvfvYQMXWtsZYOf3YwsEW+oiSL7rWA/S1TVJyhNS/DRWx00c3KggvyrBpBLerCjawiW7sfPEpA7auzXPxwiuqgvNqijfwzHCvgW1qBTUszfgxym5uve5qB3atinL1+OqnfQLsiI1yQmtx9W6URw0","brk":[]},{"id":"B","k":"p","seq":"VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH","num":1,"ss":"CCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHHHCCC","ca":"bwBj/hgAhQA//tz/yQBJ/rz/7gAe/o//IQHx/Z7/UwEe/n7/MAFe/qb/NwE6/uf/ewEm/tv/kwFr/sn/cgGJ/g0AlAFV/jYA1gFh/hgA3AGr/iMAwAGm/mcA/AF5/nkAJAK0/m8A/AHk/poAFAL5/uMAzQH5/gAB3AEp/zoBAAJf/w4BygFb/9UAlQFb/wsBrwGa/ysBuAG8/+cAcgGt/84AUAHB/w8BdAH//xMBagEUAMoAIAEEANUAHQE2AAkBRwFpAOMAJAFmAJ0A3QBeALoA4ACFAPsAmQB4ABEBrwAvAB0B0QBSAFwBjABRAH4BlgAKAJ4B3AAZALYB4ABWAOEB9gApAB8CNwEiAPYBVQFlAAUCcwGaANQBVAGRAIsBXQHZAHUBkgHQAEMBpwGdAA8B6gGSADQBxQGMAHcBlwFXAFoByQEvADkB9gEsAHUBvwEiAKkBxwHf/80BfgHR/9gBdAHb/48BqAGr/30BkAF1/68BSgF8/5YBZAFy/1ABhAE1/2MBTwEY/4ABHwEn/0QBUQEO/xMBXwHQ/jgBFwG+/jYBFgHN/usAVQGe/uUALwFm/gMB9wBy/tgAIAFn/pkAJAEg/q4A1QAW/qwAywA8/moAlAAA/lQAbQAU/pwAeABj/q8AMwBs/sgAOgA1/voAggBJ/gcBaACS/hcBJACF/jUBMQCT/nkBXQDQ/moBJADq/kAB+//n/noBJwAJ/6YBNAA//3sB6v9O/3ABzP9F/7QBAwBe/+ABMwCE/7kBBACp/40BNACr/1EBDQDB/w8BJwCI/94AOwC//6wAewDC/9QAigB5/8MAiwCN/3kAtADL/4QA5wCf/6oA6ABs/3IA+ACh/z4AMAHB/2kASwF5/3QATgFx/ycAdQG2/yIAowGd/1cAtAFb/zUAwAGB//b/8QGy/xkAEgJ4/zoAGAJI/wAAIQJ7/8b/IQJX/4b/FQIU/6L/zAEr/7P/twEg/2v/cAEw/1D/XQHm/lX/dQHi/pv/UQEj/6z/EwEE/5L/FgHH/r3/IgHv/vv/5wAb/+r/vADg/uj/2QDL/i4A0wAO/00AiQAU/zQAegDM/lEAlgDe/pQAbQAg/5cALgD9/oUAOgDF/rQARgD5/uwACAAb/9gA3f/Y/tEAvf/a/hoBrf8k/xoBYP8x/zIB","o":"5K0v/Ee64qglNT06QQNMWCYbNEktOiBLTA8/TTYiMEI5Qx5ETBY+NUI1DjFWRu5FQUgX9LI962DvyFP/w04O3l4IxUbXuEX60VcP61/nuT/hwU4G0lgK4VfYuEHn2lkZ82L120vJ5rA2BfVjx+ZOD602IfFd2BtY9LA7XhcZUx0wPr0oX/XiqhXRLqnwzQGq2Ti2+bVBA6MjIqws9qs0+aYqGKDvKc1L3bbGCJ7v3KXq5rTE4a7Q6p7+0qrs7bLFBqTa3KTx1K/aDry4/KrN2bHS08DCBLW92arf2NGxA9Sm8KLjnxYLtED1rsoQ/vVjADVV7yFd9fpjKyNT6F0byU8a0Uc0AGAd5l8R01cW8lQ1/GMO5F8Q2DtGC1ksL1j4+mDk7aPgYQ/tTM7XT+7FYQrpUtXbSvm+URTJYf3oUtrWTP2/YAvoX+XwU+7KVAzMYwz4U8/nUfnGYBDpYecIMr/Hq8z7xuK00Knz4Fvo0dtQsQw8rt0uxOFKswZAqAIwsd8z0AhXxh9Ls/4/wOxKyiFNqxAzs+c7xfFQtxdBrgw5w+JJ3i1TrzkQoerq0AlX5sK2Rjkr","brk":[]},{"id":"C","k":"p","seq":"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR","num":1,"ss":"CCHHHHHHHHHHHHHHHHCHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHHHCCC","ca":"qf98AYj/Xv+NAZb/Of+xAVj/B//mAWX/1f6zAVP/8f6DAYb/6f68Ab3/pv7FAaz/lf59AbD/tf51Ae//kv6zARAAV/6cAfn/Wf5VARIAd/5mAVYAQP6eAVkACf5qAU8AMf5EAYwAJP56AbsAF/5uAfoAGv4eAfYAaP4mAekAeP4HASwBSP7PACcBZf7AAOIArP7DAPsAnf6NADEBe/5eAP4Auv5nAM4A5v5PAAgBuv4WABcBuf4DAM8AB/8HAM8AEP/c/w4B4/6l//QA+/6k/60ARv+v/7gAVP+S//oAnv+p//sAif/s/wYBc//a/04Bvv/R/2ABwP8fAGcBhf8fAJwBlP/o/9ABff8cAAUCOv8kAOoB+/75//AB6v7t/6YBo/7M/7YBbP7i/4wBUv4hAKsBkv40ANABlf57AOsB3f56AOEB1P5sAJMBmv6fAJEBxf7RALABAP/FAIMB0/7HAEoBvf4MAVsBAf8kAV8BEv8HARgB1P4lAfwA4/5pARUBKf9pAf0ACv9XAbUA2P6RAb0AE/+8AcsAOf+iAY0A+P6yAWEA+P78AYAAPf/9AWoARf/cATAAef8OAhEAqf8MAk0ApP/FAWkA6P/BAX4A4P/3Aa4Aov/pAcgAs/+fAdcA/v+uAe0A9f+ZATQB0v9YASMBCABLAe8AOgBTASkBEQAoAVMBCwDuACcBVAD1AA8BdgD7AFUBSADeAIQBFACqAGkBQgCTADEBCgBtAAkBIgBNAM4AEABzAIwA7f82AG4Atf8+AKEAof+BAIgAhf9fAEkAXv8vAHIAOv9jAJoAL/+QAFsADP9UADcA4P5JAHcAzv6QAHcAuP6LAC4Akv5OAD4AbP50AHcAXf6yAEoARP6CABMAFv5hAEgA+f2lAGEA+f3QACIAzf2hAOv/xv3nAMb/Bf4OAcv/Nv7UAMD/Of7WAHb/dP6/AE//kv4CAUn/h/4QAZT/qf7MAKT/5/7fAHz/8P4jAZz/5P4HAeL/Gf/QANb/Sv8GAbz/Ov8yAfb/RP/4AC0Ahv/oAAgAoP8wAQ4Aif8wAVkAsf/vAF8A7/8OAT4A7/9LAWsA5v8fAawAIwDzAJYAUAAuAXoAfQA3AbkAiwDsAMUA0ADsAKsA","o":"xc3BK1Ilx+ZNxwtRrtss1MxKxe9PtP9Bs+A318VGwfBMu+dDvtlAz/RW3QddutY6zt9QUtIhHNRWFZ8JJqrdM6oKDZ0JMbTWPbLwJaMGHKHyKrHTNKv+FZ8KEKLhNbTaNa0SGaDzLca8JU8wEhpfSiI6HFA09xhhQw9JC1orpOcf0rw66TxNDKHj7WHu0fao+2T458tR7E86Aj6xAmDkNk7fGDmxC1HGFlzgOzzLFjWuCE/DJFXZJkK//ki7B1XMHkjBDjqw8US4HFXVOSm5Cx2hE2DpX+PzN7XbQzrRJw1b9exhGt9b+fNjz/lXFKYmRrkIHbE2GKMdO68EQrobKq8pFaEYTMPqSNg5Iace9p0NIKL2FUrAnfMDqyzjq/jLn/kVpCYArPbLoOvunQoNqzHqowLcnvUQpSgIqyLZngfvnwsVqy7mpvnVrdQju0QbODXAUwfIGiWnODTA+57tQQpLX/EbXCITSCg5SPlFWfotUywjSBBDU/A2XhIeSTAwR/9GXv0jXxYWRBlEROhGWfYsSio1I+ZaU8n+RSrEPQNPIMZLty3N","brk":[]},{"id":"D","k":"p","seq":"VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH","num":1,"ss":"CCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHCCCCCHHHHHHHHHHHHHHHHHHHHHCCC","ca":"GP+c/jIAAv+c/ngAvf6x/ocAmP6n/ssAUf6O/rkANP7K/tkAZf7y/qEATv69/mkACv7M/nUADf4V/3sAMv4R/zEAAP7g/hMAxv0G/y8A1/1H/xEA7/0u/87/qP0O/8H/j/1X/8L/yf1x/4z/t/2A/0b/9f1o/yX/7P2T/+/+3P3Q/wn/Ev7J/0T/Rv6t/xP/QP7u/+P+Qf4ZAB3/gf74/z3/p/74//z+kv4/AOz+qf5ZAC3/6f43ACf/9v5aAOj+4f6fAAb/A/+cAEj/Rf97ADL/Sv+SAOf+if9wANn+Yf8vANr+Q/9HAJb+iv8xAHf+Zf/s/2z+KP8GAEz+Pv8yABT+Ef8KAN790f4hAAv+wv5hAPT9yP6tAAz+1/6fAF/+6v7pAGH+v/4AAZr+jf7kAM/+Rv7gAKv+av7LAG3+jf6MAJT+S/58ALr+Hv59AIP+Uf5ZAE/+Lf4ZADr+b/7z/zL+f/4DAH3+PP7p/5H+Rf6p/2j+h/6Y/4T+df6r/8f+Pv50/8X+cf5B/6f+oP5L/+X+b/5O/xr/T/4Q//3+j/7q/gT/lv4J/0v/Uf7t/lT/af6s/kX/nf6q/nf/cP62/q7/Vv5q/p7/l/5Y/q//tv53/un/4f5L/gQACf9B/sP/D/+B/qL/VP9x/oT/O/8w/l7//P5Y/kj/If+X/iz/Zf9y/hL/T/92/sn+O/+9/sr+ev/K/vb+pP+y/rr+gP/Y/ov+gv8e/6r+0/8O/7H+5//w/m7+sv8Q/z7+mf9O/2H+1v9m/4b+rf+D/8D+1P+Y/wH/tP9y/zr/s/+x/2D/dP/E/zX/UP+F/1b/Wf+n/5v/QP/r/4P/AP/O/2b/9f6m/6b/9f7n/8z/yv4LAJz/mf7R/53/lP7a/+v/if4kAN7/T/4TAK7/Lv7g/93/Lv4UABUAEP5KAOb/3P0aAMz/x/34/xAA0P0zAEEAzf0gAIoAw/3Z/3sADP7R/2YAI/7T/64AaP7O/8gAZv6F/88AS/54/4sAgv6m/3AAtv59/5MAnP4//3QAmv5d/y4A4v52/zkA/P4w/0YA1/4Y/wcA8f5N/9j/OP9H//P/Lf/6/uj/Gf8E/6L/Uf80/4//g/8F/63/Yf/J/oT/Zv/y/kT/sP8D/1D/xP+7/mD/2P+p/hb/BQDi/g3/UADZ/vj+","o":"sdjSM0UzvLf18TSstiLGqCXj2knHyy65qg3PvzzS4kK7xx60uBvAykDK6R+kt/W9CFbO/ZwBMlb1TTXdUjXpI10JTTwWWDD5TjjiNlQDTzoUVi3nO0rfO04TWygOQz3VMlf/QS48DKfU7+OiKM2z5ajY5eGlKt6s7KDqukTt7VrYp/PTpPQmXuobo94KRP5JPBxL5K7O1qX/tMD12abs46Tm3qgh2+qm+7M/3awqE58RD7xIArRB86YpJasnE7xH6rlDF6UiHbc+78BL5rhAGbQ9HsJI68FLAbRBIMxP3fVd+qUqZPz9Ux0vX+gWF+Ck8xegFgmfBwydvRW5N0DLTTTbPSa7JVDRQEXgSTLRHkO9HVjcNVHmNxewDFTL6GH5H18J/qYsrTgCsOM0vBtEqiwZo/olug5GuC01oRUYpgIstSI5sTUfoQAgrAo2szMnpCUNoAcdthw9rTYRnAQCx+RNRLkTNc1ED6MhQksDLsW9TuPIP77XIsC7O+a0VOHUNbrQL96uSu3ASdnILsi7LumqU+jOPsjJP9LBRPa3SM/PMrvMLQunXw7lUtkpJfGkG9FU3lLR","brk":[]}],"ligs":[{"el":"C C C C C C C C C C C C O O C C C C C C C C C C C C C C C C C C C C C C O O N N N N Fe","xyz":"qQBrAHz+2ACSAMf+qQBZAAT/ggAqALf+uAB7AIn+zgCQAH7+3ACbAJL+0QCOAKz+8gCtAJD+0wCVAGH+xQCoAFn+3gC2ADT+yAClACv+wgDCADL+zwCKAN7+2QCOAPf+ygB8AAn/uQBsAPn+7AClAP3+ygB/ACb/3wB/ADX/mABIAPT+jAAxAP3+gwAhAOn+iQAyAM7+iQAoABn/cgAKAOf+eAD2//j+iQA5AKH+gwAwAIT+jQBDAHX+nQBTAIH+bwAZAHz+jQBBAFb+oQA1AE/+pQAqACb+uQA3ACb+lQAqACH+vwB8AKL+vwBzAN7+lQBHANf+lQBPAJ3+owBoAL3+","b":"AAAEAAAAHwABAAcAAQAOAAIAEQACABUAAwAYAAMAHAAEAAUABAAmAAUABgAFAAkABgAHAAYACAAHACYACQAKAAsADAALAA0ADAANAA4ADwAOACcADwAQAA8AEgAQABEAEAATABEAJwATABQAFQAWABUAKAAWABcAFgAZABcAGAAXABoAGAAoABoAGwAcAB0AHAApAB0AHgAdACAAHgAfAB4AIQAfACkAIQAiACMAJAAjACUAJgAqACcAKgAoACoAKQAqAA==","name":"HEM","chain":"A","seq":142},{"el":"C C C C C C C C C C C C O O C C C C C C C C C C C C C C C C C C C C C C O O N N N N Fe","xyz":"vgBE/6QBzgAR/1MBvABg/xwBqgCT/20BxAAx/5MB0AAX/5kB2AAG/4QBzQAZ/20B4QDs/oIB1QAO/7cBvQAA/8EBuQDw/uQBwAAL/+wBsADm/uIBygAi/zwBzwAZ/x8BygAv/xIBwQBG/yYB1gD//hwBywAz//MA3wAn/+UAtgB1/zABtACQ/yQBrwCi/zwBrgCL/1ABtwCa/wkBqAC9/z4BswDQ/zEBsACD/4MBqwCL/58BrgBy/6sBugBd/5kBpwCo/6cBtAB1/8sB0QB3/9QB1wBv//gB7gB5//kBwQB2/wECxAAy/3YBwgA8/z8BtQBx/0wBtgBp/38BtQBQ/2AB","b":"AAAEAAAAHwABAAcAAQAOAAIAEQACABUAAwAYAAMAHAAEAAUABAAmAAUABgAFAAkABgAHAAYACAAHACYACQAKAAoACwALAAwACwANAA4ADwAOACcADwAQAA8AEgAQABEAEAATABEAJwATABQAFQAWABUAGAAVACgAFgAXABYAGQAXABgAFwAaABgAKAAaABsAHAAdABwAKQAdAB4AHQAgAB4AHwAeACEAHwApACEAIgAiACMAIwAkACMAJQAmACoAJwAqACgAKgApACoA","name":"HEM","chain":"B","seq":148},{"el":"C C C C C C C C C C C C O O C C C C C C C C C C C C C C C C C C C C C C O O N N N N Fe","xyz":"if/bAGgBaf8HARcBgv+2AOcAnP+IADgBf//tAFQBcv8HAV0BaP8UAUkBb/8DATEBW/8uAUQBcf8VAXgBiv8mAX0Bf/85AaUBhv8gAa0Bi/9CAZ0Bbv/3AAEBY//4AOQAbf/iANgAev/QAO0AWf8QAdwAaf/bALkAVf/pAK8Ai/+lAPgAj/+HAPEAl/96AAkBmf+OAB8Bjv98ANYAnP9fAA4Bkf9IAP8AmP+eAEsBoP+YAGoBmf+vAHUBkv/DAGQBqv9+AHMBmv+xAJUBgP+rAJ8Bfv+0AMUBbP+6AMYBi/+jAMwBfP/sADoBef/dAAQBkv+mABQBlP+5AEoBjf/MACUB","b":"AAAEAAAAHwABAAcAAQAOAAIAEQACABUAAwAYAAMAHAAEAAUABAAmAAUABgAFAAkABgAHAAYACAAHACYACQAKAAsADAALAA0ADgAPAA4AJwAPABAADwASABAAEQAQABMAEQAnABMAFAAVABYAFQAoABYAFwAWABkAFwAYABcAGgAYACgAGgAbABwAHQAcACkAHQAeAB0AIAAeAB8AHgAhAB8AKQAhACIAIgAjACMAJAAjACUAJgAqACcAKgAoACoAKQAqAA==","name":"HEM","chain":"C","seq":142},{"el":"C C C C C C C C C C C C O O C C C C C C C C C C C C C C C C C C C C C C O O N N N N Fe","xyz":"Bf9E/4P+5/4m/9j+EP9u/wH/NP+Q/6v+9/40/5b+4f4f/4/+2f4W/6b+6v4o/7v+xf4D/63+2v4V/3D+7f4H/2n+9f77/jz+2/76/kT+/f7Y/kH+8f40/+3+7f4z/wf/+f5G/xP/Bv9V//7+3v4e/xL/+/5O/zL/6v5P/zv/G/99/+/+K/+a//L+Nv+h/9n+Lf+M/8j+K/+q/w3/RP+4/9P+Pv/P/9z+Kv96/5b+K/+A/3z+Hf9o/2/+Df9b/4L+PP+V/27+Gf9o/1D+Bf96/0j+9/5x/yT+CP+L/xz+AP9i/x7++P44/7D+AP9M/+X+Hv95/9X+Fv9m/5z+Ef9V/8H+","b":"AAAEAAAAHwABAAcAAQAOAAIAEQACABUAAwAYAAMAHAAEAAUABAAmAAUABgAFAAkABgAHAAYACAAHACYACQAKAAsADAALAA0ADgAPAA4AJwAPABAADwASABAAEQAQABMAEQAnABMAFAAVABYAFQAoABYAFwAWABkAFwAYABcAGgAYACgAGgAbABwAHQAcACkAHQAeAB0AIAAeAB8AHgAhAB8AKQAhACIAIwAkACMAJQAmACoAJwAqACgAKgApACoA","name":"HEM","chain":"D","seq":148}],"res":[{"el":"N C C O C C N C C N","xyz":"OgEdAFL+JwEpAGX+NwExAIT+LwFHAIv+EQETAGj++AAkAHj+7AA8AHD+7QAbAI7+3QBAAIf+3AAtAJb+","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS58","chain":"A"},{"el":"N C C O C C N C C N","xyz":"PwDKAKb+NwCwALP+FQC0ALz+CgCgAL3+RQCuAND+YACfAMj+dgCxAL/+bACIAMv+iQCgALn+hgCHAML+","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"A"},{"el":"N C C O C C N C C N","xyz":"ZAGD/6QBSgF8/5YBTgFx/3gBQQFb/3IBOAGR/5cBGwGN/5MBDgFz/6EBCwGP/3sB8wBx/5MB8wCA/4AB","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS63","chain":"B"},{"el":"N C C O C C N C C N","xyz":"MQAk/4MBNAA//3sBGABR/3UBFwBp/3gBQQA+/10BYAA+/2ABbAAi/2MBdQBO/1wBiQAq/2YBiwBC/14B","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS92","chain":"B"},{"el":"N C C O C C N C C N","xyz":"DAAJATIBCwDuACcBLADkAB4BMQDNACQB+//pAAwB3f/rABMB0P8BARsByv/VABgBtf/6ACEBs//jAB4B","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkACAAJAA==","name":"HIS87","chain":"C"},{"el":"N C C O C C N C C N","xyz":"gP///qj+gv8e/6r+pf8g/7D+rP82/6f+e/8g/8f+Xf8q/8b+Sf8T/8T+S/8//8b+Mv8j/8T+MP87/8D+","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAgABwAJAAgACQA=","name":"HIS92","chain":"D"}]}};

/* =========================================================
   БИОХИМИЯ · ОБЩИЙ НАБОР
   молекулы (шаростержневые, полусферы), белки (лента по реальным атомам PDB),
   поверхности, мембраны, схемы путей, графики
   ========================================================= */
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
const smoothIco = (r, det) => { const g = new THREE.IcosahedronGeometry(r, det); g.deleteAttribute('normal'); g.deleteAttribute('uv'); return mergeVertices(g); };
const bin64 = (s) => { const b = atob(s); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; };
const dI16 = (s, q) => { const a = new Int16Array(bin64(s)); const f = new Float32Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] / q; return f; };
const dI8 = (s) => { const a = new Int8Array(bin64(s)); const f = new Float32Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] / 100; return f; };
const dU16 = (s) => new Uint16Array(bin64(s));
const CPK = { H: '#C9C9D2', C: '#6C6C78', N: '#4F74FF', O: '#F04848', P: '#FF9A30', S: '#F2CC3A', Fe: '#E0773A', Co: '#F08AC0', Mg: '#8CE04A', I: '#A35BD6', Cl: '#3FD45A', F: '#9BE07A', Br: '#B0503A', Cu: '#D9905A', Zn: '#8C93C8', Ca: '#C8C8C8', Na: '#9F7BFF', K: '#8F40D4', Se: '#E0A040' };
const RBALL = { H: 0.2, C: 0.32, N: 0.31, O: 0.3, P: 0.42, S: 0.42, Fe: 0.52, Co: 0.52, Mg: 0.5, I: 0.5, Cl: 0.4, F: 0.28, Br: 0.45, Cu: 0.5, Zn: 0.5, Ca: 0.55 };
const RVDW = { H: 1.1, C: 1.7, N: 1.55, O: 1.52, P: 1.8, S: 1.8, Fe: 1.4, Co: 1.4, Mg: 1.5, I: 1.98, Cl: 1.75, F: 1.47, Br: 1.85 };
const MOLC = {};
function MOL(id) {
  if (MOLC[id]) return MOLC[id];
  const d = BIO_MOL[id]; if (!d) throw new Error('нет молекулы ' + id);
  const el = d.el.split(' '), xyz = dI16(d.xyz, 100), b = dU16(d.b), o = d.o.split('').map(Number);
  return (MOLC[id] = { id, name: d.name, el, xyz, b, o, n: el.length });
}
/* молекула из атомов лиганда/остатка PDB (координаты в Å, порядок связей = 1) */
function molFromSet(s, name) { const el = s.el.split(' '); const b = dU16(s.b); return { id: name, name, el, xyz: dI16(s.xyz, 20), b, o: new Array(b.length / 2).fill(1), n: el.length }; }
const MATC = {};
function atomMat(el, o = {}) {
  const key = el + JSON.stringify(o);
  if (!MATC[key]) { const c = new THREE.Color(CPK[el] || '#C080C0'); MATC[key] = new THREE.MeshPhysicalMaterial({ color: c.clone().multiplyScalar(0.78), roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.28, envMapIntensity: 0.55, emissive: c, emissiveIntensity: 0.0, ...o }); }
  return MATC[key];
}
const SPH = new THREE.SphereGeometry(1, 20, 14), SPH_LO = new THREE.SphereGeometry(1, 8, 6), CYL = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
/* шаростержневая модель / полусферы. opt: scale, style ('ball'|'space'|'stick'), hideH, tint (цвет поверх), at (Vector3), bondR */
function molMesh(m, opt = {}) {
  const { scale = 0.1, style = 'ball', hideH = false, tint = null, bondR = 0.13, idx = null } = opt;
  const g = new THREE.Group(); const keep = (i) => (!hideH || m.el[i] !== 'H') && (!idx || idx.has(i));
  const P = (i) => V3(m.xyz[i * 3] * scale, m.xyz[i * 3 + 1] * scale, m.xyz[i * 3 + 2] * scale);
  const byEl = {};
  for (let i = 0; i < m.n; i++) if (keep(i)) (byEl[m.el[i]] = byEl[m.el[i]] || []).push(i);
  const dm = new THREE.Object3D(); const mats = [];
  for (const [el, list] of Object.entries(byEl)) {
    const mat = tint ? atomMat(el, { color: new THREE.Color(tint).lerp(new THREE.Color(CPK[el] || '#fff'), el === 'C' ? 0.15 : 0.55) }) : atomMat(el);
    const im = new THREE.InstancedMesh(SPH, mat, list.length); mats.push(mat);
    const r = (style === 'space' ? (RVDW[el] || 1.6) : style === 'stick' ? bondR * 1.05 : (RBALL[el] || 0.4)) * scale;
    list.forEach((i, k) => { dm.position.copy(P(i)); dm.scale.setScalar(r); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix); });
    im.userData.atoms = list; g.add(im);
  }
  if (style !== 'space') {
    const segs = [];
    for (let k = 0; k < m.b.length; k += 2) {
      const a = m.b[k], b = m.b[k + 1]; if (!keep(a) || !keep(b)) continue;
      const pa = P(a), pb = P(b), ord = m.o[k / 2] || 1;
      let off = V3(0, 0, 0);
      if (ord > 1) { // смещение для двойной связи в плоскости соседей
        const nb = []; for (let q = 0; q < m.b.length; q += 2) { if (m.b[q] === a && m.b[q + 1] !== b) nb.push(m.b[q + 1]); else if (m.b[q + 1] === a && m.b[q] !== b) nb.push(m.b[q]); }
        const ax = pb.clone().sub(pa).normalize(); let ref = nb.length ? P(nb[0]).sub(pa) : V3(0, 0, 1);
        off = ref.sub(ax.clone().multiplyScalar(ref.dot(ax))); if (off.lengthSq() < 1e-6) off = V3(0, 1, 0).cross(ax); off.normalize().multiplyScalar(0.11 * scale);
      }
      const mid = pa.clone().lerp(pb, 0.5);
      const add = (o, rr) => { segs.push([pa.clone().add(o), mid.clone().add(o), m.el[a], rr]); segs.push([mid.clone().add(o), pb.clone().add(o), m.el[b], rr]); };
      if (ord === 1) add(off, bondR); else if (ord === 2) { add(off.clone().multiplyScalar(-0.6), bondR * 0.62); add(off.clone().multiplyScalar(0.9), bondR * 0.5); } else { add(V3(0, 0, 0), bondR * 0.5); add(off, bondR * 0.42); add(off.clone().negate(), bondR * 0.42); }
    }
    const byE = {}; segs.forEach((s) => (byE[s[2]] = byE[s[2]] || []).push(s));
    for (const [el, list] of Object.entries(byE)) {
      const mat = tint ? atomMat(el, { color: new THREE.Color(tint).lerp(new THREE.Color(CPK[el] || '#fff'), el === 'C' ? 0.15 : 0.55) }) : atomMat(el);
      const im = new THREE.InstancedMesh(CYL, mat, list.length);
      list.forEach(([p0, p1, , rr], k) => { const d = p1.clone().sub(p0); dm.position.copy(p0).addScaledVector(d, 0.5); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); dm.scale.set(rr * scale, d.length(), rr * scale); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix); });
      g.add(im);
    }
  }
  let rad = 0; for (let i = 0; i < m.n; i++) rad = Math.max(rad, Math.hypot(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2]) * scale);
  g.userData = { mol: m, radius: rad, mats, P };
  return g;
}
/* прозрачность/подсветка группы молекулы */
function molFade(g, op) { g.traverse((o) => { if (o.material) { const m = o.material; if (!o.userData.own) { o.material = m.clone(); o.userData.own = true; } o.material.transparent = op < 1; o.material.opacity = op; o.material.depthWrite = op > 0.6; } }); }
function molGlow(g, k) { g.traverse((o) => { if (o.material && o.material.emissiveIntensity !== undefined) { if (!o.userData.own) { o.material = o.material.clone(); o.userData.own = true; } o.material.emissiveIntensity = k; } }); }

/* ---------- структуры PDB ---------- */
const PDBC = {};
function PDB(id) {
  if (PDBC[id]) return PDBC[id];
  const d = BIO_PDB[id];
  const chains = d.chains.map((c) => c.k === 'p' ? { ...c, ca: dI16(c.ca, 20), od: dI8(c.o) } : { ...c, p: dI16(c.p, 20), bdv: dI16(c.bd, 20), fullm: c.full ? molFromSet(c.full, c.id) : null });
  return (PDBC[id] = { ...d, chains, ligm: d.ligs.map((l) => ({ ...molFromSet(l, l.name), chain: l.chain, seq: l.seq })), resm: (d.res || []).map((l) => ({ ...molFromSet(l, l.name), chain: l.chain })) });
}
const CHAINCOL = ['#7FD6FF', '#FF8AB0', '#F2C14E', '#7FE0A0', '#C77DFF', '#FF9A5C', '#9FB4FF', '#E6E08A'];
const SSCOL = { H: '#FF6FA8', E: '#F2C14E', C: '#B8C4D8' };
/* лента белка: цепь → Mesh. opt: scale, color (строка | fn(i,n,ss)), w, sub */
function cartoon(ch, opt = {}) {
  const { scale = 0.1, color = '#7FD6FF', sub = 6, hw = 1.55, sw = 1.75, th = 0.36, cr = 0.32, mat = null, from = 0, to = null, k = 0.5 } = opt;
  const n0 = ch.seq.length, A = from, Bn = to ?? n0;
  const segs = []; let s0 = A;
  const brk = new Set(ch.brk || []);
  for (let i = A + 1; i < Bn; i++) if (brk.has(i)) { segs.push([s0, i]); s0 = i; }
  segs.push([s0, Bn]);
  const pos = [], col = [], idx = []; const cc = new THREE.Color();
  for (const [a, b] of segs) {
    const n = b - a; if (n < 2) continue;
    const P = [], G = [], S = [];
    for (let i = a; i < b; i++) {
      P.push(V3(ch.ca[i * 3], ch.ca[i * 3 + 1], ch.ca[i * 3 + 2])); G.push(V3(ch.od[i * 3], ch.od[i * 3 + 1], ch.od[i * 3 + 2])); S.push(ch.ss[i]);
    }
    // сглаживание тяжей
    const Ps = P.map((p, i) => (S[i] === 'E' && i > 0 && i < n - 1) ? p.clone().multiplyScalar(0.5).addScaledVector(P[i - 1], 0.25).addScaledVector(P[i + 1], 0.25) : p.clone());
    for (let i = 1; i < n; i++) if (G[i].dot(G[i - 1]) < 0) G[i].negate();
    const curve = new THREE.CatmullRomCurve3(Ps, false, 'catmullrom', 0.5);
    const M = (n - 1) * sub + 1, K = 14;
    const base = pos.length / 3;
    let prevN = null;
    for (let j = 0; j < M; j++) {
      const u = j / (M - 1), f = u * (n - 1), i = Math.min(n - 1, Math.round(f)), i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), t = f - i0;
      const p = curve.getPoint(u).multiplyScalar(scale), T = curve.getTangent(u);
      let N = G[i0].clone().lerp(G[i1], t); N.sub(T.clone().multiplyScalar(N.dot(T))); if (N.lengthSq() < 1e-6) N = prevN ? prevN.clone() : V3(0, 1, 0).cross(T); N.normalize();
      if (prevN && N.dot(prevN) < 0) N.negate(); prevN = N;
      const Bv = T.clone().cross(N).normalize();
      // форма сечения по вторичной структуре (плавные переходы)
      const shape = (k) => { const s = S[Math.max(0, Math.min(n - 1, k))]; return s === 'H' ? [hw, th, 2] : s === 'E' ? [sw, th, 5] : [cr * 2, cr * 2, 2]; };
      const sa = shape(i0), sb = shape(i1);
      let w = sa[0] + (sb[0] - sa[0]) * smooth(0.25, 0.75, t), hh = sa[1] + (sb[1] - sa[1]) * smooth(0.25, 0.75, t), pe = sa[2] + (sb[2] - sa[2]) * t;
      // наконечник стрелки в конце тяжа
      if (S[i0] === 'E' && (i0 + 1 >= n || S[i0 + 1] !== 'E')) { w = sw * 1.55 * (1 - t) + 0.001; }
      if (S[i0] === 'E' && i0 + 1 < n && S[i0 + 1] === 'E' && (i0 + 2 >= n || S[i0 + 2] !== 'E')) { w = sw + (sw * 0.55) * smooth(0.6, 1, t); }
      const ci = typeof color === 'function' ? color(a + i, n0, S[i]) : color;
      cc.set(ci).multiplyScalar(k);
      for (let k = 0; k < K; k++) {
        const th2 = (k / K) * Math.PI * 2, c = Math.cos(th2), s = Math.sin(th2);
        const ex = 2 / pe, x = Math.sign(c) * Math.pow(Math.abs(c), ex) * w / 2, y = Math.sign(s) * Math.pow(Math.abs(s), ex) * hh / 2;
        const v = p.clone().addScaledVector(N, x * scale).addScaledVector(Bv, y * scale);
        pos.push(v.x, v.y, v.z); col.push(cc.r, cc.g, cc.b);
      }
      if (j > 0) for (let k = 0; k < K; k++) { const a1 = base + (j - 1) * K + k, b1 = base + (j - 1) * K + (k + 1) % K, c1 = base + j * K + k, d1 = base + j * K + (k + 1) % K; idx.push(a1, c1, b1, b1, c1, d1); }
    }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat || new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.32, envMapIntensity: 0.45, side: THREE.DoubleSide }));
  return m;
}
/* весь белок (все цепи) */
function proteinMesh(id, opt = {}) {
  const S = PDB(id); const g = new THREE.Group(); const { scale = 0.1, colorBy = 'chain', chains = null, palette = CHAINCOL } = opt;
  S.chains.forEach((c, ci) => {
    if (chains && !chains.includes(c.id)) return;
    if (c.k === 'p') {
      const col = colorBy === 'ss' ? (i, n, s) => SSCOL[s] : colorBy === 'rainbow' ? (i, n) => new THREE.Color().setHSL(0.66 * (1 - i / n), 0.75, 0.6).getStyle() : typeof colorBy === 'function' ? colorBy(c, ci) : palette[ci % palette.length];
      const m = cartoon(c, { scale, color: col, ...opt.cart }); m.userData.chain = c.id; g.add(m);
    } else g.add(nucTrace(c, { scale, color: opt.nucColor || '#F2E6C8' }));
  });
  return g;
}
/* нуклеиновая кислота: трубка по фосфатам + «ступеньки» оснований */
const BASECOL = { A: '#FF6A6A', T: '#F2C14E', U: '#F2C14E', G: '#5CC48A', C: '#5B8CFF' };
function nucTrace(c, { scale = 0.1, color = '#F2E6C8', r = 0.9, steps = true } = {}) {
  const g = new THREE.Group(); const n = c.seq.length; const pts = [];
  for (let i = 0; i < n; i++) pts.push(V3(c.p[i * 3], c.p[i * 3 + 1], c.p[i * 3 + 2]).multiplyScalar(scale));
  if (n >= 2) g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 6, r * scale, 8, false), organMat(color, 0.55, { emissiveIntensity: 0.05 })));
  if (steps) {
    const dm = new THREE.Object3D(); const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.5 }), n);
    for (let i = 0; i < n; i++) { const d = V3(c.bdv[i * 3], c.bdv[i * 3 + 1], c.bdv[i * 3 + 2]); const L = d.length() * scale; dm.position.copy(pts[i]).addScaledVector(d.normalize(), L / 2); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d); dm.scale.set(0.55 * scale, L, 0.55 * scale); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, new THREE.Color(BASECOL[c.seq[i]] || '#ccc').multiplyScalar(0.7)); }
    g.add(im);
  }
  return g;
}
/* гладкая «молекулярная поверхность» по точкам (метасферы) */
function surfaceMesh(points, { radius = 0.45, res = 64, mat = null, iso = 80, strength = 1 } = {}) {
  const bb = new THREE.Box3(); points.forEach((p) => bb.expandByPoint(p)); bb.expandByScalar(radius * 2.5);
  const size = bb.getSize(V3(0, 0, 0)), L = Math.max(size.x, size.y, size.z), c = bb.getCenter(V3(0, 0, 0));
  const mc = new MarchingCubes(res, mat || new THREE.MeshStandardMaterial(), false, false, 200000);
  mc.isolation = iso; mc.reset();
  const s = 92 * (radius / L) ** 2 * strength;
  points.forEach((p) => { const q = p.clone().sub(c).divideScalar(L).addScalar(0.5); mc.addBall(q.x, q.y, q.z, s, 12); });
  mc.update();
  const cnt = mc.count; const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(mc.positionArray.slice(0, cnt * 3), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(mc.normalArray.slice(0, cnt * 3), 3));
  geo.scale(L / 2, L / 2, L / 2); geo.translate(c.x, c.y, c.z);
  mc.geometry.dispose();
  return new THREE.Mesh(geo, mat || new THREE.MeshPhysicalMaterial({ color: 0xbfd8ff, roughness: 0.3, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
}
function caPoints(id, scale = 0.1, chains = null) { const S = PDB(id); const out = []; S.chains.forEach((c) => { if (chains && !chains.includes(c.id)) return; const a = c.k === 'p' ? c.ca : c.p; for (let i = 0; i < a.length; i += 3) out.push(V3(a[i], a[i + 1], a[i + 2]).multiplyScalar(scale)); }); return out; }
/* «белок-капля» для комплексов без атомной модели */
function blobGeo(rx, ry, rz, seed = 1, rough = 0.12, det = 5) {
  const o = seed * 3.7;
  return displaceGeo(smoothIco(1, det), (v) => { const n = v.clone().normalize(); const k = 1 + rough * noise3(n.x * 2.2 + o, n.y * 2.2, n.z * 2.2) + rough * 0.5 * noise3(n.x * 6 + o, n.y * 6, n.z * 6) + rough * 0.25 * noise3(n.x * 13, n.y * 13 + o, n.z * 13); v.set(n.x * rx * k, n.y * ry * k, n.z * rz * k); });
}
const protMat = (color, k = 0.4, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(k), roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.45, sheen: 0.25, sheenColor: new THREE.Color(color).multiplyScalar(0.6), envMapIntensity: 0.35, emissive: new THREE.Color(color), emissiveIntensity: 0.02, ...o });
/* схематичный бислой (головки + хвосты) — быстрый, любых размеров; y — нормаль, центр в 0 */
function schemBilayer({ w = 10, d = 6, thick = 0.9, step = 0.16, head = '#E8C07A', tail = '#B8A27A', curve = null, seed = 3 } = {}) {
  const g = new THREE.Group(); __set_rnd(mulberry(seed));
  const pts = []; for (let x = -w / 2; x <= w / 2; x += step) for (let z = -d / 2; z <= d / 2; z += step) pts.push([x + rand(-0.03, 0.03), z + rand(-0.03, 0.03)]);
  const hm = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 9, 6), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(head).multiplyScalar(0.32), roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.35 }), pts.length * 2);
  const tm = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5, 1, true), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(tail).multiplyScalar(0.25), roughness: 0.7, envMapIntensity: 0.2 }), pts.length * 4);
  const dm = new THREE.Object3D(); let hi = 0, ti = 0;
  pts.forEach(([x, z]) => [1, -1].forEach((s) => {
    const y0 = curve ? curve(x, z) : 0;
    dm.position.set(x, y0 + s * thick / 2, z); dm.scale.setScalar(step * 0.52); dm.rotation.set(0, 0, 0); dm.updateMatrix(); hm.setMatrixAt(hi++, dm.matrix);
    [-1, 1].forEach((q) => { const L = thick * 0.42; dm.position.set(x + q * step * 0.14, y0 + s * (thick / 2 - step * 0.3 - L / 2), z); dm.scale.set(step * 0.07, L, step * 0.07); dm.rotation.set(rand(-0.15, 0.15), 0, rand(-0.15, 0.15)); dm.updateMatrix(); tm.setMatrixAt(ti++, dm.matrix); });
  }));
  g.add(hm, tm); return g;
}

/* ---------- схемы ---------- */
/* стрелка-поток между точками (дуга) */
function flowArrow(parent, a, b, color, { bend = 0.25, r = 0.025, speed = 0.5, up = V3(0, 0, 1), head = true } = {}) {
  const mid = a.clone().lerp(b, 0.5); const d = b.clone().sub(a); const nrm = d.clone().cross(up).normalize().multiplyScalar(d.length() * bend);
  const c = new THREE.QuadraticBezierCurve3(a.clone(), mid.add(nrm), b.clone());
  const f = flowTubeMat(color, speed, 1.6);
  const tubeM = new THREE.Mesh(new THREE.TubeGeometry(c, 40, r, 6), f); parent.add(tubeM);
  let cone = null;
  if (head) { cone = new THREE.Mesh(new THREE.ConeGeometry(r * 3, r * 7, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.2), transparent: true })); cone.position.copy(c.getPoint(0.97)); cone.quaternion.setFromUnitVectors(V3(0, 1, 0), c.getTangent(0.97)); parent.add(cone); }
  return { curve: c, mat: f, mesh: tubeM, cone };
}
/* график в «осциллографе»: оси и подписи */
function plotAxes(ctx, w, h, { x0 = 34, y0 = 16, xl = '', yl = '', title = '' } = {}) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, h - 16); ctx.lineTo(w - 8, h - 16); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace';
  if (xl) ctx.fillText(xl, w - 8 - ctx.measureText(xl).width, h - 4);
  if (yl) { ctx.save(); ctx.translate(10, h - 18); ctx.rotate(-Math.PI / 2); ctx.fillText(yl, 0, 0); ctx.restore(); }
  if (title) { ctx.fillStyle = '#EFEAE6'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText(title, x0 + 4, 11); }
  return { X: (u) => x0 + u * (w - 8 - x0), Y: (v) => h - 16 - v * (h - 16 - y0) };
}
function plotLine(ctx, A, fn, color, { lw = 2, n = 80, dash = null } = {}) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = fn(u); i ? ctx.lineTo(A.X(u), A.Y(v)) : ctx.moveTo(A.X(u), A.Y(v)); }
  ctx.stroke(); ctx.setLineDash([]);
}
/* стандартная сцена биохимии */
function bioStage({ bg = 0x07070b, rim = 0x7fd6ff, fog = 0 } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(bg); scene.environment = envTex; if (fog) scene.fog = new THREE.FogExp2(bg, fog);
  labLights(scene, rim); return scene;
}
/* главная ось облака точек (степенной метод) */
function pcaAxis(pts) {
  const c = pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length);
  let v = V3(0.3, 1, 0.2).normalize();
  for (let it = 0; it < 30; it++) { const nv = V3(0, 0, 0); pts.forEach((p) => { const d = p.clone().sub(c); nv.addScaledVector(d, d.dot(v)); }); v = nv.normalize(); }
  return { c, v };
}
/* масштаб, при котором молекула вписывается в радиус R */
function molFit(m, R) { let r = 0; for (let i = 0; i < m.n; i++) r = Math.max(r, Math.hypot(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return R / Math.max(r, 1); }
export { BASECOL, BIO_MOL, BIO_PDB, CPK, CYL, MOL, PDB, RVDW, SPH, SPH_LO, atomMat, bin64, bioStage, blobGeo, caPoints, cartoon, dI16, dU16, flowArrow, molFade, molFit, molGlow, molMesh, pcaAxis, plotAxes, plotLine, protMat, proteinMesh, schemBilayer, smoothIco, surfaceMesh };
