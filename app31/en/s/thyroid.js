import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, clamp, ell3, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, makeControls, mulberry, organMat, randUnit, rnd, scopeShow, seg, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, bioStage, blobGeo, flowArrow, molFit, molMesh, plotAxes, protMat, proteinMesh } from './kit.js';
Object.assign(BIO_PDB, {"bna":{"title":"B-DNA 1BNA","r":22.8,"chains":[{"id":"A","k":"n","seq":"CGCGAATTCGCG","p":"aQDqADIBmgDOAP0AzwBdANEAvwDh/7AAcQB0/5QA7/9N/30Ae/91/z4ARf/E/+z/SP8qAJD/j/9/AET/2f+BANj+XABgALH+","bd":"2v/E/wYAx/91/xoAn//J/wUAcP/7/wIAiv9YAOf/3/+IAL3/OwBNAL3/WQAmAMP/ZADr/9T/TwCN/8r/JgCn//P/v/92/9v/","full":{"el":"O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C","xyz":"VAAIAVABWAADATQBaQDqADIBXQDUAEEBbQDfABUBhQDPABUBVQDNABQBWgC+AC4BQwCuADcBRgCVAEQBXQCNAEgBMACIAEsBGACRAEYBAgCCAEwBFACpADkBKgC4ADIBmgDOAP0AsADgAAUBjgDSAOIAogCvAP0AsACkABMBsACHAA0BlQB9ABUBswB/APAAyABrAO0AlwB2AOgAjABqAAIBbgBuAAMBYACEAPwARgCCAAABQwBpAAoBLABbABIBFABjABIBMgBCABwBSgA3AB8BTAAeACkBYABEABcBWwBcAA0BzwBdANEA7ABXANAAxQBtALoAvwBBANIAxQAuAOYAsAAZAOQAlwAlAOkArgAMAMoAvADz/8oAkAAJAMUAgwAUAN4AbgAmANYAVAAgANwATwALAOcAQAAxANYARgBIAMkAMgBaAMQAYABPAMMAdAA9AMoAvwDh/7AA1gDP/7MAvgDy/5gApADP/7EAoAC9/8cAhQCw/8IAcQDD/8EAgwCh/6cAbwCN/6gAeQC4/5UAZADC/6gAXADe/6EAagDy/5QAXAAIAJEARAACAJwALQASAJ8AKQAqAJcAGAAFAKsAGQDr/7QAAgDh/78ALwDc/7IAQwDp/6YAcQB0/5QAgABe/6EAegB9/3oAUgBs/5MAQgBs/6sAJwB2/6MAKgCR/5sAGgBo/4sAAQBc/5IAGQB+/3UAFwCX/4cAIQCv/3kAOwCy/28APwDL/2YAJwDX/2kAHgDy/2QALwAFAFkABQD4/2oA9f/l/3UA+//M/3sAFQDH/3UA7/9N/30A3v85/4wAAABC/2cA2/9j/3EAxv9s/4EAuP+A/3AAzf+S/2cAqv92/1cAjv98/1cAuv+C/0EAxP+c/04A3P+n/0EA9P+a/z0ABwCr/zMA+v/C/zAAAwDc/ygAHQDh/yAA8v/w/ykA2f/s/zEAzv/V/zkA4P/B/zkAe/91/z4AX/90/0YAhv9e/y4Afv+Q/y0AeP+p/zkAff+9/yMAmP+8/x0Ab/+2/wkAV//F/wcAhP+7//T/m//J/wQAtv/C//v/xv/X//P/vf/u//L/4P/R/+3/6v+4/+3/AgC1/+j/2f+j//T/4/+G//T/v/+p//v/Rf/E/+z/Kv/N//P/R/+q/9//U//b/9r/Vf/2/+T/Zv8FAND/ff/2/83/Wv8HALT/Uf8iAK3/cP/7/6L/iP/+/7T/nv/q/6//t//z/6n/vP8LAKf/zP/g/6j/x//G/6v/2/+3/6r/rf+9/6//p/+f/7H/mf/P/7L/SP8qAJD/N/9BAJH/Pv8TAIH/ZP8zAIT/cv9JAJH/jP9NAIH/mv81AID/iP9VAGP/l/9tAF3/kP88AFX/pv8yAGf/rP8VAGT/xv8MAGD/1/8dAF3/zP/y/2H/uP/g/2T/v//G/2X/nv/o/2f/mP8DAGf/j/9/AET/mP+bAEr/cv97AD3/of90ACz/vf93AC3/yf9mABf/xv9LAB//vP9oAPz+0P9mAOf+qv9QAPz+vv89AAj/s/8jABD/mv8bABX/mP8BABv/sv/4/xn/vf/e/x3/sv/J/yT/2P/e/xn/6P/0/xL/AgDw/w//3f8MAA7/w/8MABL/2f+BANj+2v+YAOv+x/+DAMD+9/96AND+CwB7AOX+HgBjAOH+DgBLAOT+LABhAMf+SABbAMr+HABMALj+FwA5AM/+//8oAMv+AgANAM3+GAAEANH+7P/9/8v+1P8IAMf+vv/4/8b+0f8jAMT+5/80AMb+XABgALH+eABkALv+UQB1AKD+XABFAKD+bAAuAKj+ZQAYAJb+SQAUAJn+aAAcAHf+fQANAGz+TAAWAGz+QQAEAIL+IwAFAIL+EwAaAH7++f8UAID++f/5/4X+5P/n/4r+y//s/4r+7f/O/4/+BgDF/4/+CwCr/5P+GwDW/4z+EwDw/4f+","b":"AAABAAEAAgACAAMAAgAEAAMABwAEAAUABAAGAAUAEAAGAAcABwAIAAgACQAIAA8ACQAKAAkACwALAAwADAANAAwADgAOAA8AEAARABAAEgAQABMAEwAUABQAFQAVABYAFQAXABYAGgAXABgAFwAZABgAJgAZABoAGgAbABsAHAAbACUAHAAdAB0AHgAeAB8AHgAlAB8AIAAfACEAIQAiACIAIwAiACQAJAAlACYAJwAmACgAJgApACkAKgAqACsAKwAsACsALQAsADAALQAuAC0ALwAuADkALwAwADAAMQAxADIAMQA4ADIAMwAyADQANAA1ADUANgA1ADcANwA4ADkAOgA5ADsAOQA8ADwAPQA9AD4APgA/AD4AQAA/AEMAQABBAEAAQgBBAE8AQgBDAEMARABEAEUARABOAEUARgBGAEcARwBIAEcATgBIAEkASABKAEoASwBLAEwASwBNAE0ATgBPAFAATwBRAE8AUgBSAFMAUwBUAFQAVQBUAFYAVQBZAFYAVwBWAFgAVwBkAFgAWQBZAFoAWgBbAFoAYwBbAFwAXABdAF0AXgBdAGMAXgBfAF4AYABgAGEAYQBiAGIAYwBkAGUAZABmAGQAZwBnAGgAaABpAGkAagBpAGsAagBuAGsAbABrAG0AbAB5AG0AbgBuAG8AbwBwAG8AeABwAHEAcQByAHIAcwByAHgAcwB0AHMAdQB1AHYAdgB3AHcAeAB5AHoAeQB7AHkAfAB8AH0AfQB+AH4AfwB+AIAAfwCDAIAAgQCAAIIAgQCNAIIAgwCDAIQAhACFAIQAjACFAIYAhQCHAIcAiACIAIkAiACKAIoAiwCKAIwAjQCOAI0AjwCNAJAAkACRAJEAkgCSAJMAkgCUAJMAlwCUAJUAlACWAJUAoQCWAJcAlwCYAJgAmQCYAKAAmQCaAJkAmwCbAJwAnACdAJwAngCeAJ8AngCgAKEAogChAKMAoQCkAKQApQClAKYApgCnAKYAqACnAKsAqACpAKgAqgCpALQAqgCrAKsArACsAK0ArACzAK0ArgCtAK8ArwCwALAAsQCwALIAsgCzALQAtQC0ALYAtAC3ALcAuAC4ALkAuQC6ALkAuwC6AL4AuwC8ALsAvQC8AMoAvQC+AL4AvwC/AMAAvwDJAMAAwQDBAMIAwgDDAMIAyQDDAMQAwwDFAMUAxgDGAMcAxgDIAMgAyQDKAMsAygDMAMoAzQDNAM4AzgDPAM8A0ADPANEA0ADUANEA0gDRANMA0gDdANMA1ADUANUA1QDWANUA3ADWANcA1gDYANgA2QDZANoA2QDbANsA3ADdAN4A3QDfAN0A4ADgAOEA4QDiAOIA4wDiAOQA4wDnAOQA5QDkAOYA5gDnAOcA6ADoAOkA6ADyAOkA6gDqAOsA6wDsAOsA8gDsAO0A7ADuAO4A7wDvAPAA7wDxAPEA8gA=","ri":"AAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICQkJCQkJCQkJCQkJCQkJCQkJCQkJCQoKCgoKCgoKCgoKCgoKCgoKCgoLCwsLCwsLCwsLCwsLCwsLCwsLCwsL","an":"O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4"}},{"id":"B","k":"n","seq":"CGCGAATTCGCG","p":"nP87/5H+wv8b/83+NwAs/wj/hAB//0f/pAAFAGr/ZgB7AIL//v+rAMj/mP+XAB0AXv9NAHwAXP8HAOIAl//R/0oB//+y/5gB","bd":"EQBDAAsASwCFAAoA5f9qABcAqP9uAAcAcP8ZAB0AjP+y/0sA7P+i/0AAKwCn/zsAXwDT/y4AkgADABkAXQAuAP3/SgB/ANT/","full":{"el":"O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C","xyz":"b/9K/5r+f/84/4r+nP87/5H+pf9W/4n+pP84/67+u/8p/7H+p/9V/7f+tP9h/5/+rf9+/53+wf+R/5v+2P+K/53+u/+r/5j+of+y/5X+nP/M/5D+jP+g/5b+k/+F/5r+wv8b/83+w//9/sr+r/8l/+L+3/8m/9T+9P8l/8D+CAA4/8r+/f9S/8j+DwA1/+j+KgAw/+v+BABO//X+BwBi/97+8v93/+H+2P90/+b+yv+K/+b+3P+d/+D+2f+5/93+xP/H/9/+8f/G/9j+CQC6/9X+HwDK/9H+DACg/9j+9f+S/93+NwAs/wj/TwAb/wX/IgAj/xv/QQBK/w//VQBX/wD/VAB0/wn/OQB9/wf/WwB3/yb/dwB5/yr/TACR/y3/OQCU/xb/HQCW/x//EACu/xz/HQDB/xT/9v+w/yL/6P+b/yv/zv+d/zD/9f+C/y7/EACA/yj/hAB//0f/oAB2/0X/cwBz/13/hACf/0j/lQCu/zf/jADK/zv/cADJ/zv/lADY/1X/nQDy/1H/egDV/2b/ZQDY/1D/TADK/1n/SQCy/2T/LwCr/2n/IgDB/2H/BgDG/2H/8/+4/2n/AADf/1j/EgDy/0//CAAKAEj/LADt/07/MgDU/1f/pAAFAGr/ugAYAGT/qAD0/4L/iQAXAGv/ggAlAFT/bAA4AFn/VAApAGD/cQBLAHD/ZABlAGz/ZQA7AIf/TAAwAHr/QwAWAIf/UwABAI7/RADs/5f/KgD1/5X/EQDp/5v/DwDP/6T/+//4/5f//v8QAI7/FAAeAIf/KQAPAIz/ZgB7AIL/ZgCWAHX/fQB2AJT/SgB3AJD/MgB5AIH/GgB4AJP/FwBdAJ3/HACKAKz/AwCZAK//IQB1AML/EQBeALj/HABEAMP/NgA8AMT/OAAjAM3/HwAbANH/FAACANr/IwDs/+D/+f8AANz/6v8VANb/8v8tAM3/DQAuAMv//v+rAMj/7f/CAL//FwCxANf/6v+ZANn/0v+QAM7/xv99AOL/2f9oAOb/wP+JAP3/pP+LAAEAz/93ABAA0v9dAAAA6v9NAAgA5v80ABEA0P8qABQA/f8lABYAFgAvABMAKQAgABgAGQBJAAsANQBVAAgAAwBZAAQAmP+XAB0Aff+hABcAq/+rACgAlv99AC8Ahf9nACUAh/9SADkAov9JADsAf/9aAFUAav9KAF8Amf9XAGUApf8/AFUAw/8+AFgAz/8mAF0Awf8SAGEA6v8lAF0A+v87AFgAEgA4AFkA7f9TAFIA/f9sAEwA0f9UAFIAXv9NAHwAQf9FAHsAY/9oAIYAbv83AIwAbP8bAIQAfP8MAJkAl/8SAJUAdf8VALUAZv8BAMQAkP8dAMEApP8PAK4AvP8gAKoA1P8TAKoA1f/7/68A6v8hAKQA6f87AJ4A//9JAJgA0P9JAJ4Auf86AKQAXP8HAOIARf/0/+cAVv8kAOYAdf////MAfv/k//UAlv/k/wcBq//y//oAk//y/yIBo//m/zUBnf8OABsBtf8FAA0Bwv8cAP4Atv8zAPcAyP9EAOsA3/81AOsA+f88AOIAAQBSANcACwAoAOYABgAQAPEAGwD///QA7v8JAPsA3P8dAPcAl//R/0oBif+7/zwBh//h/14Bsv/G/1gBw/+0/0oB4P+8/08B4//U/0EB5v/C/20B+P+v/3kB8P/f/2wB+P/j/08B9f///0cBCgAMADwBHwAAADoBBwAmADUB8P8zADgB7f9NADAB2v8mAEMB3P8LAEsB//+y/5gBAwCX/6QB6v/D/6YBGgDC/5kBMgC3/44BRgDO/48BPADh/3wBRgDd/6kBVQDQ/70BUwD3/58BRwD6/4MBMQAOAIIBFwALAIsBCAAhAIYBGQAxAHkBFQBLAG4BAABYAG0BLABWAGQBRQBKAGMBWgBYAFkBSQAxAG0BMgAmAHcB","b":"AAABAAEAAgACAAMAAgAEAAMABwAEAAUABAAGAAUAEAAGAAcABwAIAAgACQAIAA8ACQAKAAkACwALAAwADAANAAwADgAOAA8AEAARABAAEgAQABMAEwAUABQAFQAVABYAFQAXABYAGgAXABgAFwAZABgAJgAZABoAGgAbABsAHAAbACUAHAAdAB0AHgAeAB8AHgAlAB8AIAAfACEAIQAiACIAIwAiACQAJAAlACYAJwAmACgAJgApACkAKgAqACsAKwAsACsALQAsADAALQAuAC0ALwAuADkALwAwADAAMQAxADIAMQA4ADIAMwAyADQANAA1ADUANgA1ADcANwA4ADkAOgA5ADsAOQA8ADwAPQA9AD4APgA/AD4AQAA/AEMAQABBAEAAQgBBAE8AQgBDAEMARABEAEUARABOAEUARgBGAEcARwBIAEcATgBIAEkASABKAEoASwBLAEwASwBNAE0ATgBPAFAATwBRAE8AUgBSAFMAUwBUAFQAVQBUAFYAVQBZAFYAVwBWAFgAVwBkAFgAWQBZAFoAWgBbAFoAYwBbAFwAXABdAF0AXgBdAGMAXgBfAF4AYABgAGEAYQBiAGIAYwBkAGUAZABmAGQAZwBnAGgAaABpAGkAagBpAGsAagBuAGsAbABrAG0AbAB5AG0AbgBuAG8AbwBwAG8AeABwAHEAcQByAHIAcwByAHgAcwB0AHMAdQB1AHYAdgB3AHcAeAB5AHoAeQB7AHkAfAB8AH0AfQB+AH4AfwB+AIAAfwCDAIAAgQCAAIIAgQCNAIIAgwCDAIQAhACFAIQAjACFAIYAhQCHAIcAiACIAIkAiACKAIoAiwCKAIwAjQCOAI0AjwCNAJAAkACRAJEAkgCSAJMAkgCUAJMAlwCUAJUAlACWAJUAoQCWAJcAlwCYAJgAmQCYAKAAmQCaAJkAmwCbAJwAnACdAJwAngCeAJ8AngCgAKEAogChAKMAoQCkAKQApQClAKYApgCnAKYAqACnAKsAqACpAKgAqgCpALQAqgCrAKsArACsAK0ArACzAK0ArgCtAK8ArwCwALAAsQCwALIAsgCzALQAtQC0ALYAtAC3ALcAuAC4ALkAuQC6ALkAuwC6AL4AuwC8ALsAvQC8AMoAvQC+AL4AvwC/AMAAvwDJAMAAwQDBAMIAwgDDAMIAyQDDAMQAwwDFAMUAxgDGAMcAxgDIAMgAyQDKAMsAygDMAMoAzQDNAM4AzgDPAM8A0ADPANEA0ADUANEA0gDRANMA0gDdANMA1ADUANUA1QDWANUA3ADWANcA1gDYANgA2QDZANoA2QDbANsA3ADdAN4A3QDfAN0A4ADgAOEA4QDiAOIA4wDiAOQA4wDnAOQA5QDkAOYA5gDnAOcA6ADoAOkA6ADyAOkA6gDqAOsA6wDsAOsA8gDsAO0A7ADuAO4A7wDvAPAA7wDxAPEA8gA=","ri":"AAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICQkJCQkJCQkJCQkJCQkJCQkJCQkJCQoKCgoKCgoKCgoKCgoKCgoKCgoLCwsLCwsLCwsLCwsLCwsLCwsLCwsL","an":"O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4"}}],"ligs":[],"res":[]}});
Object.assign(BIO_MOL, {"cholesterol":{"name":"Cholesterol","el":"C C C C C C C C C C C C C C C C C C C C C C C C C O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Sf6hAEP/m/5aAK//Uv5eADMA7/3t/y8AIv6B/44ABv74/lQAb/3l/jwAUf7d/tL/HP+mALL/J/8fAQ4Arv8OAVoA/f+yAP7/kv9LAM7/zP8IAFL/UgDE/3L/tgAZAMD/eABtADIA4ADWAF8AaQGXAHgAiwEfAEkALQHI//T/dwGN/3v/+gFJ/6T/WAKr/+v/FwLo/2gAzwJl/xIA/QBU/0wAeP/m/zwAfP6bAOT+PP4KAV//5/1xADv/qv7y/4//HP6+ADoAlv5YAIcA5P3H/8r/jP0PAFEA7P2L/+0AjP6M/6IAJf6t/p4ATv2L/m8AOf07/2QAXP3c/tL/U/5x/sD/IP4N/37/uP4A/9r/LP/PAEv/Mv95AdD/2f4vAVYAmv/fALoA3f9vAWUAGADsAKT/3f9TAAT/h/+9/y3/gQCn/xL/OwBn/6f/3wBjAHj/ZQAuAIgA6QAiARAAvQAGAbsAsgHOALQANwFE/0r/jgHe/zX/LAIi/0z/4wH2/uj/cwL7/6b/VgI6AI0ADwKb/7UAxAJE/2wAOwFP/6YABgH3/hUAlQBk/2kAKv+h/x0A0f+p/1AAXP8YAJgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEACAAIAAkACQAKAAoACwALAAwACAAMAAwADQANAA4ADgAPAA8AEAALABAAEAARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABYAFwAXABgAEwAYABcAGQAUABoADAAbAAAAHAAAAB0AAAAeAAEAHwACACAAAgAhAAMAIgADACMABAAkAAQAJQAFACYABgAnAAYAKAAGACkABwAqAAcAKwAHACwACAAtAAkALgAJAC8ACgAwAAoAMQALADIADQAzAA0ANAAOADUADgA2AA8ANwAQADgAEQA5ABEAOgASADsAFQA8ABUAPQAWAD4AFgA/ABcAQAAYAEEAGABCABkAQwAaAEQAGgBFABoARgAbAEcAGwBIABsASQA=","o":"11111111111111111111211111111111111111111111111111111111111111111111111111111"},"thyroxine":{"name":"Thyroxine (T4)","el":"N C C C C C I C O C C C I C O C I C C I C C O O H H H H H H H H H H H","xyz":"Nv4KAAH/aP7n/4T/bv5pANf//f5sAAsAWf+4AM//4/+7AAEAcwAyAaL/BQBxAGwAigB0AJ0A6gArAFEAUQFsABgAtAEhAMr/VQKGAHD/qAGc/7v/CAJU/2//NwFW//n/IwGG/uL/3ACa/0EAoP8dAK4A1f+q/1YBIv8bAIAAEv6E/8//mf2X/9v/S/4Q/wkAQ/69/8D+ZP5cAN3+zv7A/3v/Wv6+AJf/J/5jACgAPv/0AHj/WwHYACQACgJn/xD/iQBl/28A1/7d/7IAg/7a/s7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwACwANAA0ADgANAA8ADwAQAA8AEQAJABEABwASABIAEwASABQAAwAUAAEAFQAVABYAFQAXAAAAGAAAABkAAQAaAAIAGwACABwABAAdAAoAHgAOAB8AEQAgABQAIQAXACIA","o":"111211211211211121112112111111111111"},"trh":{"name":"Thyrotropin-releasing hormone (TRH)","el":"N C O C C C C N C O C C C C N C N N C O C C C C O N H H H H H H H H H H H H H H H H H H H H H H","xyz":"ev5ZAd3/3v4EAR0AQf82AU8Ayf5tACMAm/5FAK8AEv/8/+8Af//5/4QAR/8pAAgAe/8dAIL/OP9PACb//P/Z/1X/4v9G/zP/s//5/qv///+1/v//qv9+/l4AKf+l/j0ALf/u/tP/agDl/7T/rwBkAMf/igDFAIX/IgF0ACkAkwHHAOv/FQKCABUA6gH4/0cANgKe/2AAWwH0/1EAJ/4wAbP/iP69Adn/fv5PANr/Rf4DAKkAg/6eAOkANf8yAEYB9f6X/woBpP+T/3oA0f85AKQAHAAKAPf+mP9B/+P+QAAb/wz/aQCp/vv/xf9F/qsA0P6M/nMAhQCT/+j//gCoAIIAkQEsARIAjAHHAH//RAK6AGUAVwJ5AMD/JQGm/28A","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAMABwAHAAgACAAJAAgACgAKAAsACwAMAAwADQANAA4ADgAPAA8AEAAMABAACgARABEAEgASABMAEgAUABQAFQAVABYAFgAXABcAGAAXABkAFAAZAAAAGgAAABsAAwAcAAQAHQAEAB4ABQAfAAUAIAAGACEABgAiAAoAIwALACQACwAlAA0AJgAOACcADwAoABEAKQAUACoAFQArABUALAAWAC0AFgAuABkALwA=","o":"12111111121112112111211112111111111111111111111111"}});


// @scene thyroid makeThyroid | Гормоны щитовидной железы | Гормоны
/* =========================================================
   БИОХИМИЯ · ЩИТОВИДНАЯ ЖЕЛЕЗА: синтез T₄/T₃ в фолликуле (NIS, пендрин, ТПО, тиреоглобулин, МИТ/ДИТ),
   ось гипоталамус — гипофиз — щитовидная железа с обратной связью и болезнями, действие T₃ на клетку
   ========================================================= */
function makeThyroid() {
  __set_rnd(mulberry(8201));
  const scene = bioStage({ rim: 0xc77dff });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { synth: DK ? [V3(-2.1, -1.5, 0), V3(-1.7, 0.5, 15.5)] : [V3(-1.2, -1.6, 0), V3(-0.8, 0.4, 14.5)], axis: [V3(39.6, 2.1, 0), V3(40.1, 3.2, 13.5)], cell: [V3(78.3, -1.9, 0), V3(78.7, 0.2, 17.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.synth[1]);
  const controls = makeControls(camera, VIEW.synth[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(2000, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();
  const fit = (id, R, o = {}) => { const m = MOL(id); return molMesh(m, { scale: molFit(m, R), hideH: true, ...o }); };
  const ICOL = '#B07BFF';   // йод

  /* ---------- 1. фолликул: разрез ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const FR = 2.2;   // радиус фолликула
  const colloid = new THREE.Mesh(new THREE.SphereGeometry(FR - 0.32, 48, 32), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8B85A').multiplyScalar(0.35), roughness: 0.25, clearcoat: 0.8, transparent: true, opacity: 0.55, depthWrite: false, emissive: 0xe8b85a, emissiveIntensity: 0.04 }));
  G1.add(colloid);
  // клетки-тироциты по сфере (передняя часть срезана)
  const cellGeo = new THREE.BoxGeometry(0.44, 0.44, 0.5); cellGeo.translate(0, 0, 0);
  const NCELL = 260, cells = [];
  for (let i = 0; i < NCELL; i++) { const y = 1 - (i + 0.5) / NCELL * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; const n = V3(Math.cos(a) * r, y, Math.sin(a) * r); if (n.z > -0.05) continue; cells.push(n); }
  const cellI = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), organMat('#E890B0', 0.5, { emissiveIntensity: 0.05 }), cells.length);
  const nucI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 12, 8), organMat('#7A5CC8', 0.7, { emissiveIntensity: 0.08 }), cells.length);
  const dmy = new THREE.Object3D();
  cells.forEach((n, i) => { dmy.position.copy(n).multiplyScalar(FR - 0.05); dmy.lookAt(0, 0, 0); dmy.scale.set(0.4, 0.4, 0.46); dmy.updateMatrix(); cellI.setMatrixAt(i, dmy.matrix); dmy.position.copy(n).multiplyScalar(FR + 0.08); dmy.scale.setScalar(1); dmy.updateMatrix(); nucI.setMatrixAt(i, dmy.matrix); });
  G1.add(cellI, nucI);
  // капилляры снаружи
  const capM = organMat('#D84A50', 0.55, { emissiveIntensity: 0.08 });
  [[3.35, 1.0], [3.7, -0.6], [4.3, 0.4], [4.7, -1.1]].forEach(([a0, tilt], k) => { const pts = []; for (let j = 0; j <= 24; j++) { const a = a0 + (j / 24) * 1.5; pts.push(V3(Math.cos(a) * (FR + 0.42), Math.sin(a) * 0.9 * tilt + (k - 1.5) * 0.7, Math.sin(a) * (FR + 0.42) - 0.4).normalize().multiplyScalar(FR + 0.42)); } G1.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.07, 8), capM)); });
  // «главная» клетка на срезе справа — крупнее, с транспортёрами
  const FOC = V3(1, 0.12, -0.04).normalize();   // направление на клетку
  const fc = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.66), organMat('#F0A0C0', 0.55, { emissiveIntensity: 0.1, transparent: true, opacity: 0.85 }));
  fc.position.copy(FOC).multiplyScalar(FR - 0.02); fc.lookAt(0, 0, 0); G1.add(fc);
  const BAS = FOC.clone().multiplyScalar(FR + 0.3), API = FOC.clone().multiplyScalar(FR - 0.33);
  const capF = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([BAS.clone().add(V3(0.1, -1.2, -0.3)), BAS.clone().add(V3(0.28, 0, -0.1)), BAS.clone().add(V3(0.1, 1.2, -0.4))]), 30, 0.11, 10), capM); G1.add(capF);
  const marker = (p, col, r = 0.08) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(0.6), emissive: col, emissiveIntensity: 0.35, roughness: 0.3 })); m.position.copy(p); G1.add(m); return m; };
  const nis = marker(BAS.clone().lerp(API, 0.05).add(V3(0, 0.12, 0.3)), '#5B8CFF', 0.14), pend = marker(API.clone().lerp(BAS, 0.05).add(V3(0, 0.24, 0.3)), '#7FE0A0', 0.13), tpo = marker(API.clone().lerp(BAS, 0.05).add(V3(0, -0.2, 0.3)), '#FF9A5C', 0.14);
  const xMat = new THREE.MeshBasicMaterial({ color: '#FF3A3A' }); const cross = new THREE.Group(); [1, -1].forEach((s) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), xMat); c.rotation.z = s * Math.PI / 4; cross.add(c); }); cross.position.copy(tpo.position).add(V3(0, 0, 0.12)); cross.visible = false; G1.add(cross);
  // тиреоглобулин в коллоиде: клубок с тирозинами
  const TGP = []; { let p = V3(0.2, 0.3, 0.2); for (let i = 0; i < 46; i++) { TGP.push(p.clone()); p.add(randUnit().multiplyScalar(0.36)); if (p.length() > 1.3) p.multiplyScalar(0.85); } }
  const tgCurve = new THREE.CatmullRomCurve3(TGP);
  G1.add(new THREE.Mesh(new THREE.TubeGeometry(tgCurve, 200, 0.045, 8), organMat('#F2D27A', 0.55, { emissiveIntensity: 0.08 })));
  const TYR = Array.from({ length: 12 }, (_, i) => { const p = tgCurve.getPoint((i + 0.5) / 12); const m = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), new THREE.MeshPhysicalMaterial({ color: 0x999999, emissive: 0xffffff, emissiveIntensity: 0.05, roughness: 0.3 })); m.position.copy(p); G1.add(m); const io = [0, 1].map((k) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshBasicMaterial({ color: ICOL })); s.position.copy(p).add(V3(k ? 0.08 : -0.08, 0.07, 0.03)); s.visible = false; G1.add(s); return s; }); return { p, m, io, n: 0, hormone: null }; });
  // готовые гормоны справа: настоящие молекулы
  const t4m = fit('thyroxine', 0.62), t3m = fit('t3', 0.58); t4m.position.set(4.1, 0.95, 0); t3m.position.set(4.1, -0.65, 0); G1.add(t4m, t3m);
  // частицы йодида и гормонов
  const iodI = Array.from({ length: 26 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshBasicMaterial({ color: ICOL })); s.visible = false; G1.add(s); return { s, t: 0, on: false, path: null }; });
  const horI = Array.from({ length: 10 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshBasicMaterial({ color: '#F2C14E' })); s.visible = false; G1.add(s); return { s, t: 0, on: false, path: null }; });
  const pIod = new THREE.CatmullRomCurve3([BAS.clone().add(V3(0.28, -0.6, -0.1)), nis.position.clone(), BAS.clone().lerp(API, 0.5).add(V3(0, 0.15, 0.3)), pend.position.clone(), API.clone().multiplyScalar(0.7)]);
  const pHor = new THREE.CatmullRomCurve3([API.clone().multiplyScalar(0.72), API.clone(), BAS.clone().lerp(API, 0.5).add(V3(0, -0.1, 0)), BAS.clone(), BAS.clone().add(V3(0.15, 0.7, -0.2))]);
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E8B85A').multiplyScalar(0.5), emissive: 0xe8b85a, emissiveIntensity: 0.15, transparent: true, opacity: 0.85 })); drop.visible = false; G1.add(drop);

  /* ---------- 2. ось гипоталамус — гипофиз — щитовидная железа ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  bodyShell(G2, { rim: 0.14, keep: true, legs: false });
  const HYP = V3(0, 4.12, 0.08), PIT = V3(0, 3.98, 0.16), THY = V3(0, 3.28, 0.24), HRT = BODY.heart.clone(), LIV = V3(-0.35, 1.5, 0.18);
  const brainM = new THREE.Mesh(ell3(0.34, 0.27, 0.36, V3(0, 4.3, 0.02)), glassMat('#C8B8FF', { rim: 0.7, base: 0.04, keep: true })); G2.add(brainM);
  const hypG = glowNucleus(G2, HYP, '#9F7BFF', 0.05, 9), pitG = glowNucleus(G2, PIT, '#7FD6FF', 0.05, 9);
  const thy = new THREE.Group(); thy.position.copy(THY); G2.add(thy);
  const thyMat = organMat('#D86A8A', 0.55, { emissiveIntensity: 0.08 });
  [-1, 1].forEach((s) => { const l = new THREE.Mesh(blobGeo(0.075, 0.15, 0.06, 2 + s, 0.08), thyMat); l.position.set(s * 0.085, 0.01, 0); l.rotation.z = -s * 0.25; thy.add(l); });
  const isth = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 10), thyMat); isth.rotation.z = Math.PI / 2; isth.position.set(0, -0.06, 0.03); thy.add(isth);
  const thyG = glowNucleus(G2, THY.clone().add(V3(0, 0, 0.05)), '#F2C14E', 0.04, 10);
  const heartM = new THREE.Mesh(ell3(0.22, 0.27, 0.2, HRT), organMat('#C84A50', 0.45)); G2.add(heartM);
  const livM = new THREE.Mesh(ell3(0.42, 0.22, 0.25, LIV), organMat('#9A4A3A', 0.5)); G2.add(livM);
  const A2 = {
    trh: flowArrow(G2, HYP.clone().add(V3(0.04, -0.02, 0.06)), PIT.clone().add(V3(0.04, 0.03, 0.06)), '#9F7BFF', { bend: 1.2, r: 0.008 }),
    tsh: flowArrow(G2, PIT.clone().add(V3(0.06, -0.04, 0.05)), THY.clone().add(V3(0.08, 0.14, 0.05)), '#7FD6FF', { bend: 0.4, r: 0.012 }),
    t4: flowArrow(G2, THY.clone().add(V3(0.1, -0.12, 0.05)), HRT.clone().add(V3(0.12, 0.22, 0.12)), '#F2C14E', { bend: -0.25, r: 0.014 }),
    t4l: flowArrow(G2, THY.clone().add(V3(-0.1, -0.12, 0.05)), LIV.clone().add(V3(0.05, 0.2, 0.15)), '#F2C14E', { bend: 0.2, r: 0.014 }),
    fb1: flowArrow(G2, THY.clone().add(V3(-0.12, 0.08, 0.02)), PIT.clone().add(V3(-0.05, -0.02, 0.02)), '#FF6A5A', { bend: -0.6, r: 0.012 }),
    fb2: flowArrow(G2, THY.clone().add(V3(-0.16, 0.1, 0.0)), HYP.clone().add(V3(-0.07, 0.0, 0.0)), '#FF6A5A', { bend: -0.7, r: 0.011 }),
  };
  // антитела при болезни Грейвса (стимулируют рецептор ТТГ)
  const abG = new THREE.Group(); G2.add(abG);
  const abMat = new THREE.MeshPhysicalMaterial({ color: 0x8060d0, emissive: 0xb090ff, emissiveIntensity: 0.25, roughness: 0.4 });
  const lymG = new THREE.Group(); G2.add(lymG); const LYM = Array.from({ length: 12 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x5b8cff, emissive: 0x7fd6ff, emissiveIntensity: 0.3, roughness: 0.4 })); m.userData.a = i / 12 * Math.PI * 2; lymG.add(m); return m; });
  const AB = Array.from({ length: 9 }, (_, i) => { const y = new THREE.Group(); const st0 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6), abMat); st0.position.y = -0.025; y.add(st0); [-1, 1].forEach((s) => { const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.045, 6), abMat); arm.position.set(s * 0.016, 0.017, 0); arm.rotation.z = -s * 0.6; y.add(arm); }); y.userData.a = i / 9 * Math.PI * 2; abG.add(y); return y; });

  /* ---------- 3. действие T₃ на клетку ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const cellM = new THREE.Mesh(blobGeo(3.3, 2.3, 1.6, 4, 0.06), glassMat('#FFC8A8', { rim: 0.8, base: 0.04, keep: true })); G3.add(cellM);
  const nucM = new THREE.Mesh(new THREE.SphereGeometry(1.05, 40, 28), glassMat('#9F7BFF', { rim: 0.9, base: 0.06, keep: true })); nucM.position.set(-0.9, 0.2, 0); G3.add(nucM);
  const dna = proteinMesh('bna', { scale: 0.05, nucColor: '#F2E6C8' }); dna.position.set(-0.9, 0.1, 0.2); dna.rotation.y = Math.PI / 2; G3.add(dna);
  const tr = new THREE.Mesh(blobGeo(0.26, 0.22, 0.22, 11, 0.12), protMat('#F2C14E', 0.5)); tr.position.set(-0.72, 0.42, 0.35); G3.add(tr);
  const rxr = new THREE.Mesh(blobGeo(0.24, 0.21, 0.21, 13, 0.12), protMat('#7FD6FF', 0.5)); rxr.position.set(-1.18, 0.42, 0.35); G3.add(rxr);
  const mct = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 14), protMat('#7FE0A0', 0.5)); mct.position.set(3.05, 0.6, 0.3); mct.rotation.z = Math.PI / 2 - 0.35; G3.add(mct);
  const d2 = new THREE.Mesh(blobGeo(0.22, 0.18, 0.18, 17, 0.12), protMat('#FF9A5C', 0.5)); d2.position.set(1.85, 0.55, 0.35); G3.add(d2);
  const MITO = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.38, 6, 12), organMat('#FF8A5C', 0.55, { emissiveIntensity: 0.1 })); const a = i / 8 * Math.PI * 2; m.position.set(1.35 + Math.cos(a) * 1.2, Math.sin(a) * 1.2 - 0.1, -0.3 + 0.4 * Math.sin(a * 3)); m.rotation.z = a; G3.add(m); return m; });
  const PUMPS = Array.from({ length: 14 }, (_, i) => { const a = -1.1 + i / 13 * 2.2 + (i % 2 ? Math.PI : 0); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 10), protMat('#5B8CFF', 0.6)); const p = V3(Math.cos(a) * 3.15, Math.sin(a) * 2.15, 0.3); m.position.copy(p); m.lookAt(p.clone().multiplyScalar(2)); m.rotateX(Math.PI / 2); m.visible = false; G3.add(m); return m; });
  const t3p = Array.from({ length: 6 }, () => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: '#F2C14E' })); s.visible = false; G3.add(s); return { s, t: 0, on: false }; });
  const mrna = Array.from({ length: 5 }, () => { const s = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 16, Math.PI * 1.4), new THREE.MeshBasicMaterial({ color: '#FF6FA8' })); s.visible = false; G3.add(s); return { s, t: 0, on: false }; });
  const pT3 = new THREE.CatmullRomCurve3([V3(4.0, 0.95, 0.3), V3(3.05, 0.6, 0.3), V3(1.85, 0.55, 0.35), V3(0.4, 0.5, 0.4), V3(-0.72, 0.5, 0.4)]);
  const pRna = new THREE.CatmullRomCurve3([V3(-0.9, 0.2, 0.4), V3(0.1, -0.3, 0.5), V3(1.0, -0.9, 0.4), V3(1.8, -1.2, 0.3)]);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'synth', labels: true, rot: false, fly: null, msg: null, iod: 'norm', block: false, iodIn: 0, made: 0, tgIod: 0, ph: 0,
    dis: 'norm', treat: false, T4: 15, TSH: 1.8, size: 1, hr: 70, t3lvl: 'norm', pumps: 4, bmr: 100 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['synth', 'axis', 'cell'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  const launch = (pool, path, extra = {}) => { const p = pool.find((x) => !x.on); if (p) { p.on = true; p.t = 0; p.path = path; Object.assign(p, extra); p.s.visible = true; } };

  function synthUpdate(dt, t) {
    const iodK = st.iod === 'norm' ? 1 : 0.25;
    if (rnd() < dt * 6 * iodK) launch(iodI, pIod);
    iodI.forEach((p) => { if (!p.on) return; p.t += dt * 0.32; if (p.t >= 1) { p.on = false; p.s.visible = false; st.iodIn = Math.min(st.iodIn + 1, 3); return; } p.s.position.copy(p.path.getPoint(p.t)); });
    nis.material.emissiveIntensity = 0.25 + 0.2 * Math.sin(t * 6) * iodK;
    tpo.material.emissiveIntensity = st.block ? 0.05 : 0.3 + 0.2 * Math.sin(t * 4); cross.visible = st.block;
    // йодирование тирозинов тиреоглобулина (ТПО) — нужен йод, поступивший в коллоид
    if (!st.block && st.iodIn > 0 && rnd() < dt * 3) { const c = TYR.filter((y) => y.n < 2 && !y.hormone); if (c.length) { const y = c[(rnd() * c.length) | 0]; y.n += 1; st.iodIn -= 1; fx.spawn(y.p.clone(), V3(0, 0.3, 0), C.set(ICOL), 0.5, 0.6, 1); } }
    // конденсация: ДИТ + ДИТ → T₄, МИТ + ДИТ → T₃
    if (!st.block && rnd() < dt * 0.9) { const d = TYR.filter((y) => y.n === 2 && !y.hormone), m = TYR.filter((y) => y.n >= 1 && !y.hormone); if (d.length && m.length > 1) { const a = d[0], b = m.find((y) => y !== a); a.hormone = b.n === 2 ? 'T4' : 'T3'; b.n = 0; fx.spawn(a.p.clone(), V3(0, 0.4, 0), C.set('#F2C14E'), 0.7, 0.6, 1.2); } }
    TYR.forEach((y) => { y.io[0].visible = y.n >= 1 || !!y.hormone; y.io[1].visible = y.n >= 2 || y.hormone === 'T4'; y.m.material.color.set(y.hormone ? '#F2C14E' : y.n ? '#C8A0FF' : '#999999').multiplyScalar(0.6); y.m.material.emissiveIntensity = y.hormone ? 0.4 + 0.15 * Math.sin(t * 5) : 0.05; });
    // эндоцитоз коллоида и выход гормонов
    st.ph += dt * 0.35 * (st.iod === 'norm' ? 1 : 0.45);
    if (st.ph > 1) { st.ph = 0; const h0 = TYR.find((y) => y.hormone); if (h0) { const kind = h0.hormone; h0.hormone = null; h0.n = 0; launch(horI, pHor, { kind }); st.made += 1; st.lastKind = kind; } }
    horI.forEach((p) => { if (!p.on) return; p.t += dt * 0.28; if (p.t >= 1) { p.on = false; p.s.visible = false; return; } p.s.position.copy(p.path.getPoint(p.t)); p.s.material.color.set(p.kind === 'T3' ? '#FFD98A' : '#F2C14E'); p.s.scale.setScalar(p.t < 0.35 ? 2.2 - p.t * 3 : 1); });
    const dp = horI.find((p) => p.on && p.t < 0.35); drop.visible = !!dp; if (dp) drop.position.copy(dp.s.position);
    st.tgIod = TYR.reduce((s, y) => s + (y.hormone ? 2 : y.n), 0) / (TYR.length * 2);
    [t4m, t3m].forEach((g, i) => { g.rotation.y += dt * (0.4 + 0.1 * i); });
  }
  function axisUpdate(dt, t) {
    const D = st.dis, tr = st.treat;
    let cap = D === 'hashi' ? 0.3 : 1, iod = D === 'iod' && !tr ? 0.35 : 1, tsi = D === 'graves' ? 0.9 : 0, block = D === 'graves' && tr ? 0.35 : 1, exo = D === 'hashi' && tr ? 9 : 0;
    if (D === 'hashi') cap = 0.22; else cap *= Math.sqrt(st.size);   // зоб частично компенсирует нехватку йода
    for (let i = 0; i < 8; i++) {
      const h = Math.min(dt, 0.05) / 8 * 2.5;
      const tshT = 40 / (1 + (st.T4 / 9) ** 6); st.TSH += (tshT - st.TSH) * h * 3;
      const E = st.TSH / (st.TSH + 2), P = 31.8 * cap * iod * block * (E + tsi) + exo;
      st.T4 += (P - st.T4) * h;
    }
    const sizeT = D === 'hashi' ? 0.85 : clamp(1 + 0.06 * Math.max(0, st.TSH - 4) + (D === 'graves' && !tr ? 0.45 : 0), 0.8, 2.1);
    st.size += (sizeT - st.size) * Math.min(1, dt * 0.25);
    thy.scale.setScalar(st.size);
    st.hr = Math.round(70 * Math.pow(st.T4 / 15, 0.45));
    heartM.scale.setScalar(1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 2 * st.hr / 60)) ** 6);
    const lv = (v) => clamp(v, 0.04, 1.2);
    A2.trh.mat.uniforms.uOn.value = lv(0.25 + st.TSH / 16); A2.tsh.mat.uniforms.uOn.value = lv(0.15 + st.TSH / 10); A2.t4.mat.uniforms.uOn.value = lv(st.T4 / 22); A2.t4l.mat.uniforms.uOn.value = lv(st.T4 / 26);
    A2.fb1.mat.uniforms.uOn.value = lv(st.T4 / 30); A2.fb2.mat.uniforms.uOn.value = lv(st.T4 / 36);
    Object.values(A2).forEach((a) => { a.mat.uniforms.uTime.value = t; });
    hypG.spr.material.opacity = 0.2 + 0.5 * clamp(st.TSH / 20, 0, 1); pitG.spr.material.opacity = 0.2 + 0.6 * clamp(st.TSH / 20, 0, 1);
    thyG.spr.material.opacity = 0.15 + 0.6 * clamp(st.T4 / 35, 0, 1); thyG.spr.scale.setScalar((0.5 + st.size * 0.35) * (1 + 0.06 * Math.sin(t * 4)));
    abG.visible = D === 'graves'; AB.forEach((y, i) => { const a = y.userData.a + t * 0.4; y.position.copy(THY).add(V3(Math.cos(a) * 0.32, 0.1 * Math.sin(a * 2 + i), 0.12 + Math.sin(a) * 0.12)); y.rotation.z = a; y.scale.setScalar(2.4); });
    lymG.visible = D === 'hashi' && !tr; LYM.forEach((m, i) => { const a = m.userData.a - t * 0.3; m.position.copy(THY).add(V3(Math.cos(a) * 0.2, 0.08 * Math.sin(a * 3 + i), 0.08 + Math.sin(a) * 0.08)); });
  }
  function cellUpdate(dt, t) {
    const L = st.t3lvl === 'low' ? 0.3 : st.t3lvl === 'high' ? 2.2 : 1;
    if (rnd() < dt * 1.2 * L) launch(t3p, pT3);
    t3p.forEach((p) => { if (!p.on) return; const pt = p.t; p.t += dt * 0.3; if (pt < 0.5 && p.t >= 0.5) fx.spawn(d2.position.clone().add(G3.position), V3(0, 0.5, 0.2), C.set(ICOL), 0.6, 0.6, 1); if (p.t >= 1) { p.on = false; p.s.visible = false; launch(mrna, pRna); return; } p.s.position.copy(pT3.getPoint(p.t)); p.s.material.color.set(p.t < 0.5 ? '#E8C060' : '#FFD98A'); });
    mrna.forEach((p) => { if (!p.on) return; p.t += dt * 0.35; if (p.t >= 1) { p.on = false; p.s.visible = false; st.pumps = Math.min(PUMPS.length, st.pumps + 0.1); return; } p.s.position.copy(pRna.getPoint(p.t)); p.s.rotation.z += dt * 3; });
    const tgt = 3 + 5 * L; st.pumps += (tgt - st.pumps) * dt * 0.3; PUMPS.forEach((m, i) => { m.visible = i < Math.round(st.pumps); m.material.emissiveIntensity = 0.05 + 0.1 * Math.sin(t * 6 + i); });
    MITO.forEach((m, i) => { const s = 0.75 + 0.25 * Math.min(L, 2); m.scale.setScalar(s); m.material.emissiveIntensity = 0.06 + 0.08 * L * (0.6 + 0.4 * Math.sin(t * 3 + i)); if (rnd() < dt * 0.4 * L) fx.spawn(m.position.clone().add(G3.position), V3(0, 0.3, 0), C.set('#FF9A5C'), 0.6, 0.5, 1); });
    tr.material.emissiveIntensity = 0.04 + 0.2 * Math.min(L, 2) * (0.5 + 0.5 * Math.sin(t * 4));
    st.bmr = Math.round(100 * (L < 1 ? 0.5 + 0.5 * L : 0.62 + 0.38 * L));
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'synth') synthUpdate(dt, t);
    if (st.mode === 'axis') axisUpdate(dt, t);
    if (st.mode === 'cell') cellUpdate(dt, t);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (st.mode !== 'axis') { scopeShow(false); return; }
    scopeShow(true); const A = plotAxes(ctx, w, h, { title: 'TSH (log), free T₄; gray = normal range', x0: 10 });
    const bar = (y, v, max, lo, hi, col, name) => { const X = (u) => A.X(clamp(u / max, 0, 1)); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(X(lo), y - 7, X(hi) - X(lo), 14); ctx.fillStyle = col; ctx.fillRect(A.X(0), y - 3, X(v) - A.X(0), 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText(name, A.X(0) + 2, y - 9); };
    const L = (v) => (Math.log10(Math.max(v, 0.01)) + 2) / 4 * 25; bar(h * 0.42, L(st.TSH), 25, L(0.4), L(4.0), '#7FD6FF', 'TSH 0.01 … 100');
    bar(h * 0.78, st.T4, 45, 10, 22, '#F2C14E', 'free T₄');
  }

  const TXT = {
    synth: 'A <b>thyroid follicle</b> is a small sac made of a single layer of thyrocytes, filled with colloid containing the protein <b>thyroglobulin</b>. 1) Iodide from the blood is pumped into the cell by the <b>sodium–iodide symporter</b> (NIS, blue) and passes into the colloid through <b>pendrin</b> (green). 2) <b>Thyroid peroxidase</b> (TPO, orange) oxidizes iodine and attaches it to the tyrosines of thyroglobulin, giving <b>MIT</b> (one iodine) and <b>DIT</b> (two). 3) The same TPO couples DIT + DIT → <b>T₄</b> (thyroxine) and MIT + DIT → <b>T₃</b>. 4) On the TSH signal the cell takes up a droplet of colloid, lysosomes break down thyroglobulin, and T₄ (≈90%) and T₃ are released into the blood.',
    axis: '<b>The hypothalamic–pituitary–thyroid axis.</b> The hypothalamus releases <b>thyrotropin-releasing hormone</b> (TRH), which makes the pituitary release <b>thyroid-stimulating hormone</b> (TSH), and TSH makes the thyroid gland produce T₄ and T₃. Thyroid hormones inhibit the hypothalamus and pituitary (red arrows), which keeps their level constant. That is why the key test is TSH: it is the first to sense a shift. In the liver and other tissues T₄ is converted into active T₃. Choose a disease.',
    cell: '<b>How T₃ acts on a cell.</b> T₄ enters through the MCT8 transporter (green), and deiodinase D2 (orange) removes one iodine, giving active <b>T₃</b>. It passes into the nucleus and binds the <b>thyroid hormone receptor</b> (TR, yellow), which sits on DNA paired with RXR (light blue). Genes are switched on: more <b>Na⁺/K⁺-ATPase</b> (blue pumps in the membrane), more mitochondria and oxidative enzymes — the cell uses more energy and gives off more heat. T₃ also enhances the effect of epinephrine on the heart and is needed for brain maturation in the fetus and child.',
  };
  const DIS = { norm: 'Normal', hashi: 'Hypothyroidism (Hashimoto’s)', graves: 'Hyperthyroidism (Graves’)', iod: 'Iodine deficiency' };
  const DISTXT = {
    norm: TXT.axis,
    hashi: '<b>Hashimoto’s autoimmune thyroiditis</b> is the most common cause of hypothyroidism. Lymphocytes destroy the gland, T₄ falls, the feedback weakens, and the pituitary releases more and more TSH — <b>high TSH, low T₄</b>. Metabolism slows down: fatigue, cold intolerance, weight gain, dry skin, swelling, slow pulse, constipation, depression. (Congenital hypothyroidism — most often due to an underdeveloped gland — leads to cretinism if untreated, which is why all newborns are screened for TSH.)',
    graves: '<b>Graves’ disease</b> (diffuse toxic goiter). The immune system makes <b>antibodies to the TSH receptor</b> (purple) that activate it without any TSH. The gland enlarges and works nonstop, and feedback silences the pituitary — <b>TSH near zero, high T₄</b>. Palpitations, sweating, tremor, weight loss despite a good appetite, irritability; unlike other forms of thyrotoxicosis, also bulging eyes (Graves’ ophthalmopathy).',
    iod: '<b>Iodine deficiency</b> is the main cause of goiter worldwide. Without iodine there is nothing to make T₄ from; TSH rises and makes the gland grow: <b>endemic goiter</b>. The enlarged gland partly compensates for the shortage. Deficiency is especially dangerous for pregnant women and children, because brain development suffers. Prevention is iodized salt.',
  };
  const TREAT = { norm: '', hashi: 'Levothyroxine', graves: 'Methimazole', iod: 'Iodized salt' };
  const TREATTXT = {
    hashi: '<b>Treatment of hypothyroidism</b>: daily <b>levothyroxine</b> tablets (synthetic T₄) for life. The dose is adjusted by TSH: when it returns to normal, there is enough hormone.',
    graves: '<b>Methimazole</b> (thiamazole) and propylthiouracil block thyroid peroxidase — iodine is no longer attached to thyroglobulin, and T₄ falls to normal (after long suppression, TSH takes months to recover). Other options are radioactive iodine (the gland takes it up itself and is destroyed) or surgery; the fast pulse is brought down with β-blockers.',
    iod: '<b>Iodized salt</b> gives the gland back its raw material: T₄ rises, TSH falls, and the goiter may shrink over months (a large, long-standing goiter no longer will). An adult needs about 150 µg of iodine a day; a pregnant woman, 250 µg.',
  };
  const labels = [
    { text: 'colloid', pos: V3(-0.6, 1.05, 0.9), color: '#E8B85A', show: () => st.labels && st.mode === 'synth' },
    { text: 'thyroglobulin', pos: TGP[20].clone().add(V3(-0.3, -0.25, 0.3)), color: '#F2D27A', show: () => st.labels && st.mode === 'synth' },
    { text: 'thyrocytes', pos: V3(-1.85, -1.35, 0.1), color: '#E890B0', show: () => st.labels && st.mode === 'synth' },
    { text: 'capillary', pos: BAS.clone().add(V3(0.35, -1.0, 0.45)), color: '#D84A50', show: () => st.labels && st.mode === 'synth' },
    { text: 'NIS (Na⁺/I⁻)', pos: nis.position.clone().add(V3(0.35, 0.05, 0.2)), color: '#5B8CFF', show: () => st.labels && st.mode === 'synth' },
    { text: 'pendrin', pos: pend.position.clone().add(V3(-0.15, 0.35, 0.25)), color: '#7FE0A0', show: () => st.labels && st.mode === 'synth' },
    { text: 'TPO', pos: tpo.position.clone().add(V3(-0.1, -0.38, 0.25)), color: '#FF9A5C', show: () => st.labels && st.mode === 'synth' },
    { text: 'thyroxine T₄', pos: V3(4.1 - 0.55, 0.25, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'synth' },
    { text: 'triiodothyronine T₃', pos: V3(4.1 - 0.75, -1.35, 0.3), color: '#FFD98A', show: () => st.labels && st.mode === 'synth' },
    { text: 'hypothalamus (TRH)', pos: HYP.clone().add(V3(40.25, 0.22, 0.1)), color: '#9F7BFF', show: () => st.labels && st.mode === 'axis' },
    { text: 'pituitary (TSH)', pos: PIT.clone().add(V3(40.3, -0.08, 0.1)), color: '#7FD6FF', show: () => st.labels && st.mode === 'axis' },
    { text: 'thyroid gland', pos: THY.clone().add(V3(40.28, -0.1, 0.1)), color: '#F2C14E', show: () => st.labels && st.mode === 'axis' },
    { text: 'liver: T₄ → T₃', pos: LIV.clone().add(V3(39.5, -0.35, 0.2)), color: '#C8C8D0', show: () => st.labels && st.mode === 'axis' },
    { text: 'heart', pos: HRT.clone().add(V3(40.3, -0.1, 0.2)), color: '#FF6A5A', show: () => st.labels && st.mode === 'axis' },
    { text: 'feedback', pos: V3(40 - 0.62, 3.6, 0.2), color: '#FF6A5A', show: () => st.labels && st.mode === 'axis' },
    { text: 'antibodies to the TSH receptor', pos: THY.clone().add(V3(40 - 1.3, -0.12, 0.2)), color: '#B090FF', show: () => st.labels && st.mode === 'axis' && st.dis === 'graves' },
    { text: 'MCT8', pos: V3(80 + 3.2, 0.95, 0.4), color: '#7FE0A0', show: () => st.labels && st.mode === 'cell' },
    { text: 'D2: T₄ → T₃', pos: V3(80 + 1.6, 0.15, 0.4), color: '#FF9A5C', show: () => st.labels && st.mode === 'cell' },
    { text: 'TR', pos: V3(80 - 0.55, 0.8, 0.5), color: '#F2C14E', show: () => st.labels && st.mode === 'cell' },
    { text: 'RXR', pos: V3(80 - 1.45, 0.8, 0.5), color: '#7FD6FF', show: () => st.labels && st.mode === 'cell' },
    { text: 'DNA', pos: V3(80 - 1.95, -0.25, 0.5), color: '#F2E6C8', show: () => st.labels && st.mode === 'cell' },
    { text: 'nucleus', pos: V3(80 - 1.6, 1.35, 0.4), color: '#9F7BFF', show: () => st.labels && st.mode === 'cell' },
    { text: 'mRNA', pos: V3(80 + 0.6, -0.95, 0.5), color: '#FF6FA8', show: () => st.labels && st.mode === 'cell' },
    { text: 'Na⁺/K⁺-ATPase', pos: V3(80 + 2.6, -1.9, 0.4), color: '#5B8CFF', show: () => st.labels && st.mode === 'cell' },
    { text: 'mitochondria', pos: V3(80 + 2.2, 1.45, 0.2), color: '#FF8A5C', show: () => st.labels && st.mode === 'cell' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => {
      let s = st.msg;
      if (!s) s = st.mode === 'synth' ? (st.block ? '<b>Methimazole / propylthiouracil</b> block thyroid peroxidase: iodine keeps entering the colloid but is not attached to tyrosines, so no new T₄ or T₃ is formed. The hormone stored in the colloid lasts several weeks, which is why treatment does not take effect immediately.' : st.iod === 'low' ? '<b>Too little iodine in the diet</b>: there is little iodide in the blood — NIS (of which there is even more under the influence of TSH) captures less, tyrosines are iodinated more slowly, and the share of MIT and T₃ grows — the gland economizes on iodine. Less hormone is released, and the pituitary responds by raising TSH (“Axis and diseases” mode).' : TXT.synth)
        : st.mode === 'axis' ? (st.treat && st.dis !== 'norm' ? TREATTXT[st.dis] : DISTXT[st.dis])
        : st.t3lvl === 'low' ? '<b>Low T₃</b> (hypothyroidism): genes are barely switched on, there are fewer pumps and mitochondria, and the basal metabolic rate drops by 30–40% — the person feels cold, sluggish and slow.' : st.t3lvl === 'high' ? '<b>High T₃</b> (thyrotoxicosis): cells burn fuel wastefully, a lot of heat is produced, and the metabolic rate rises one and a half to two times; the heart beats faster, partly because T₃ adds β-adrenergic receptors and directly switches on cardiac muscle genes.' : TXT.cell;
      ib.info.innerHTML = s;
    };
    refs.modeSeg = seg([{ id: 'synth', label: 'Synthesis in the follicle' }, { id: 'axis', label: 'Axis and diseases' }, { id: 'cell', label: 'Action on the cell' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'synth') box.append(h('div', { class: 'glabel' }, 'Conditions'), h('div', { class: 'gctl' }, seg([{ id: 'norm', label: 'Enough iodine' }, { id: 'low', label: 'Low iodine' }], () => st.iod, (v) => { st.iod = v; refs.setInfo(); }), toggle('Methimazole', () => st.block, (v) => { st.block = v; refs.setInfo(); })));
      else if (st.mode === 'axis') { const tb = toggle(TREAT[st.dis] || 'Treatment', () => st.treat, (v) => { st.treat = v; refs.setInfo(); }); box.append(h('div', { class: 'glabel' }, 'State'), h('div', { class: 'gctl' }, seg(Object.entries(DIS).map(([id, label]) => ({ id, label })), () => st.dis, (v) => { st.dis = v; st.treat = false; refs.rebuild(); refs.setInfo(); }), st.dis !== 'norm' ? tb : null)); }
      else box.append(h('div', { class: 'glabel' }, 'T₃ level'), h('div', { class: 'gctl' }, seg([{ id: 'low', label: 'Low' }, { id: 'norm', label: 'Normal' }, { id: 'high', label: 'High' }], () => st.t3lvl, (v) => { st.t3lvl = v; refs.setInfo(); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['synth', 'axis', 'cell'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function stats() {
    if (st.mode === 'axis') return [['TSH', st.TSH < 0.1 ? '<0.1' : f1(st.TSH), 'mU/L'], ['free T₄', Math.round(st.T4), 'pmol/L'], ['Pulse', st.hr, 'bpm']];
    if (st.mode === 'cell') return [['Basal metabolic rate', st.bmr, '%'], ['Pumps', Math.round(st.pumps), '']];
    return [['Finished T₄/T₃ in the colloid', TYR.filter((y) => y.hormone).length, ''], ['Hormones released', st.made, '']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#C77DFF',
    kicker: 'Biochemistry · hormones', title: 'Thyroid gland',
    lede: 'Two hormones made from the amino acid tyrosine and iodine set the metabolic rate of every cell in the body — from the heart to the growing brain.',
    notes: `
      <div><h2>Thyroid hormones</h2>
        <p><b>T₄</b> (thyroxine, 3,5,3′,5′-tetraiodothyronine) and <b>T₃</b> (3,5,3′-triiodothyronine) are iodinated derivatives of tyrosine. The gland secretes mostly T₄; about 80% of T₃ is formed in tissues by deiodinases D1 and D2. Deiodinase D3 produces inactive reverse T₃ (rT₃). In the blood more than 99% of the hormones are bound to proteins (thyroxine-binding globulin, transthyretin, albumin); only the free fraction is active.</p>
        <h3>Synthesis</h3><ul><li>Iodide uptake: the sodium–iodide symporter (NIS), secondary active transport.</li><li>Oxidation of iodine and iodination of the tyrosine residues of thyroglobulin — thyroid peroxidase (TPO), which requires H₂O₂.</li><li>Coupling: DIT + DIT → T₄; MIT + DIT → T₃.</li><li>Proteolysis of thyroglobulin in lysosomes releases T₄ and T₃; the iodine from MIT and DIT is recycled.</li></ul>
        <h3>Action</h3><p>The nuclear receptors TRα and TRβ, paired with RXR, bind to DNA sites (TREs) and change gene transcription. Effects: higher basal metabolic rate and heat production, increased lipolysis and gluconeogenesis, lower cholesterol, growth and maturation of bone and brain, and stronger effects of catecholamines on the heart.</p>
        <h3>Tests</h3><p>TSH (normal about 0.4–4.0 mU/L), free T₄ (about 10–22 pmol/L), antibodies to TPO (Hashimoto’s) and to the TSH receptor (Graves’).</p></div>
      <div><h2>Simplifications</h2><ul><li>T₄ and T₃ on the right are molecules built from their chemical formulas; everything else (cells, proteins, transporters) is schematic and not to scale.</li><li>The DNA in the nucleus is a real B-DNA structure (PDB 1BNA); the TR and RXR receptors are schematic blobs.</li><li>The axis is a simple feedback model; the TSH and T₄ values are typical, not diagnostic cutoffs.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('synth'); st.fly = null;
  return self;
}
export { makeThyroid };
