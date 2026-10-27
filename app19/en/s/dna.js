import { Sparks, THREE, V3, __set_rnd, clamp, flyStep, flyTarget, group, infoBox, makeControls, mulberry, organMat, randUnit, rnd, seg, toggle } from '../core.js';
import { BASECOL, BIO_MOL, BIO_PDB, CYL, PDB, atomMat, bin64, bioStage, blobGeo, molFade, molGlow, molMesh, nucTrace, pcaAxis, protMat } from './kit.js';
Object.assign(BIO_PDB, {"bna":{"title":"B-DNA 1BNA","r":22.8,"chains":[{"id":"A","k":"n","seq":"CGCGAATTCGCG","p":"aQDqADIBmgDOAP0AzwBdANEAvwDh/7AAcQB0/5QA7/9N/30Ae/91/z4ARf/E/+z/SP8qAJD/j/9/AET/2f+BANj+XABgALH+","bd":"2v/E/wYAx/91/xoAn//J/wUAcP/7/wIAiv9YAOf/3/+IAL3/OwBNAL3/WQAmAMP/ZADr/9T/TwCN/8r/JgCn//P/v/92/9v/","full":{"el":"O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C","xyz":"VAAIAVABWAADATQBaQDqADIBXQDUAEEBbQDfABUBhQDPABUBVQDNABQBWgC+AC4BQwCuADcBRgCVAEQBXQCNAEgBMACIAEsBGACRAEYBAgCCAEwBFACpADkBKgC4ADIBmgDOAP0AsADgAAUBjgDSAOIAogCvAP0AsACkABMBsACHAA0BlQB9ABUBswB/APAAyABrAO0AlwB2AOgAjABqAAIBbgBuAAMBYACEAPwARgCCAAABQwBpAAoBLABbABIBFABjABIBMgBCABwBSgA3AB8BTAAeACkBYABEABcBWwBcAA0BzwBdANEA7ABXANAAxQBtALoAvwBBANIAxQAuAOYAsAAZAOQAlwAlAOkArgAMAMoAvADz/8oAkAAJAMUAgwAUAN4AbgAmANYAVAAgANwATwALAOcAQAAxANYARgBIAMkAMgBaAMQAYABPAMMAdAA9AMoAvwDh/7AA1gDP/7MAvgDy/5gApADP/7EAoAC9/8cAhQCw/8IAcQDD/8EAgwCh/6cAbwCN/6gAeQC4/5UAZADC/6gAXADe/6EAagDy/5QAXAAIAJEARAACAJwALQASAJ8AKQAqAJcAGAAFAKsAGQDr/7QAAgDh/78ALwDc/7IAQwDp/6YAcQB0/5QAgABe/6EAegB9/3oAUgBs/5MAQgBs/6sAJwB2/6MAKgCR/5sAGgBo/4sAAQBc/5IAGQB+/3UAFwCX/4cAIQCv/3kAOwCy/28APwDL/2YAJwDX/2kAHgDy/2QALwAFAFkABQD4/2oA9f/l/3UA+//M/3sAFQDH/3UA7/9N/30A3v85/4wAAABC/2cA2/9j/3EAxv9s/4EAuP+A/3AAzf+S/2cAqv92/1cAjv98/1cAuv+C/0EAxP+c/04A3P+n/0EA9P+a/z0ABwCr/zMA+v/C/zAAAwDc/ygAHQDh/yAA8v/w/ykA2f/s/zEAzv/V/zkA4P/B/zkAe/91/z4AX/90/0YAhv9e/y4Afv+Q/y0AeP+p/zkAff+9/yMAmP+8/x0Ab/+2/wkAV//F/wcAhP+7//T/m//J/wQAtv/C//v/xv/X//P/vf/u//L/4P/R/+3/6v+4/+3/AgC1/+j/2f+j//T/4/+G//T/v/+p//v/Rf/E/+z/Kv/N//P/R/+q/9//U//b/9r/Vf/2/+T/Zv8FAND/ff/2/83/Wv8HALT/Uf8iAK3/cP/7/6L/iP/+/7T/nv/q/6//t//z/6n/vP8LAKf/zP/g/6j/x//G/6v/2/+3/6r/rf+9/6//p/+f/7H/mf/P/7L/SP8qAJD/N/9BAJH/Pv8TAIH/ZP8zAIT/cv9JAJH/jP9NAIH/mv81AID/iP9VAGP/l/9tAF3/kP88AFX/pv8yAGf/rP8VAGT/xv8MAGD/1/8dAF3/zP/y/2H/uP/g/2T/v//G/2X/nv/o/2f/mP8DAGf/j/9/AET/mP+bAEr/cv97AD3/of90ACz/vf93AC3/yf9mABf/xv9LAB//vP9oAPz+0P9mAOf+qv9QAPz+vv89AAj/s/8jABD/mv8bABX/mP8BABv/sv/4/xn/vf/e/x3/sv/J/yT/2P/e/xn/6P/0/xL/AgDw/w//3f8MAA7/w/8MABL/2f+BANj+2v+YAOv+x/+DAMD+9/96AND+CwB7AOX+HgBjAOH+DgBLAOT+LABhAMf+SABbAMr+HABMALj+FwA5AM/+//8oAMv+AgANAM3+GAAEANH+7P/9/8v+1P8IAMf+vv/4/8b+0f8jAMT+5/80AMb+XABgALH+eABkALv+UQB1AKD+XABFAKD+bAAuAKj+ZQAYAJb+SQAUAJn+aAAcAHf+fQANAGz+TAAWAGz+QQAEAIL+IwAFAIL+EwAaAH7++f8UAID++f/5/4X+5P/n/4r+y//s/4r+7f/O/4/+BgDF/4/+CwCr/5P+GwDW/4z+EwDw/4f+","b":"AAABAAEAAgACAAMAAgAEAAMABwAEAAUABAAGAAUAEAAGAAcABwAIAAgACQAIAA8ACQAKAAkACwALAAwADAANAAwADgAOAA8AEAARABAAEgAQABMAEwAUABQAFQAVABYAFQAXABYAGgAXABgAFwAZABgAJgAZABoAGgAbABsAHAAbACUAHAAdAB0AHgAeAB8AHgAlAB8AIAAfACEAIQAiACIAIwAiACQAJAAlACYAJwAmACgAJgApACkAKgAqACsAKwAsACsALQAsADAALQAuAC0ALwAuADkALwAwADAAMQAxADIAMQA4ADIAMwAyADQANAA1ADUANgA1ADcANwA4ADkAOgA5ADsAOQA8ADwAPQA9AD4APgA/AD4AQAA/AEMAQABBAEAAQgBBAE8AQgBDAEMARABEAEUARABOAEUARgBGAEcARwBIAEcATgBIAEkASABKAEoASwBLAEwASwBNAE0ATgBPAFAATwBRAE8AUgBSAFMAUwBUAFQAVQBUAFYAVQBZAFYAVwBWAFgAVwBkAFgAWQBZAFoAWgBbAFoAYwBbAFwAXABdAF0AXgBdAGMAXgBfAF4AYABgAGEAYQBiAGIAYwBkAGUAZABmAGQAZwBnAGgAaABpAGkAagBpAGsAagBuAGsAbABrAG0AbAB5AG0AbgBuAG8AbwBwAG8AeABwAHEAcQByAHIAcwByAHgAcwB0AHMAdQB1AHYAdgB3AHcAeAB5AHoAeQB7AHkAfAB8AH0AfQB+AH4AfwB+AIAAfwCDAIAAgQCAAIIAgQCNAIIAgwCDAIQAhACFAIQAjACFAIYAhQCHAIcAiACIAIkAiACKAIoAiwCKAIwAjQCOAI0AjwCNAJAAkACRAJEAkgCSAJMAkgCUAJMAlwCUAJUAlACWAJUAoQCWAJcAlwCYAJgAmQCYAKAAmQCaAJkAmwCbAJwAnACdAJwAngCeAJ8AngCgAKEAogChAKMAoQCkAKQApQClAKYApgCnAKYAqACnAKsAqACpAKgAqgCpALQAqgCrAKsArACsAK0ArACzAK0ArgCtAK8ArwCwALAAsQCwALIAsgCzALQAtQC0ALYAtAC3ALcAuAC4ALkAuQC6ALkAuwC6AL4AuwC8ALsAvQC8AMoAvQC+AL4AvwC/AMAAvwDJAMAAwQDBAMIAwgDDAMIAyQDDAMQAwwDFAMUAxgDGAMcAxgDIAMgAyQDKAMsAygDMAMoAzQDNAM4AzgDPAM8A0ADPANEA0ADUANEA0gDRANMA0gDdANMA1ADUANUA1QDWANUA3ADWANcA1gDYANgA2QDZANoA2QDbANsA3ADdAN4A3QDfAN0A4ADgAOEA4QDiAOIA4wDiAOQA4wDnAOQA5QDkAOYA5gDnAOcA6ADoAOkA6ADyAOkA6gDqAOsA6wDsAOsA8gDsAO0A7ADuAO4A7wDvAPAA7wDxAPEA8gA=","ri":"AAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICQkJCQkJCQkJCQkJCQkJCQkJCQkJCQoKCgoKCgoKCgoKCgoKCgoKCgoLCwsLCwsLCwsLCwsLCwsLCwsLCwsL","an":"O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4"}},{"id":"B","k":"n","seq":"CGCGAATTCGCG","p":"nP87/5H+wv8b/83+NwAs/wj/hAB//0f/pAAFAGr/ZgB7AIL//v+rAMj/mP+XAB0AXv9NAHwAXP8HAOIAl//R/0oB//+y/5gB","bd":"EQBDAAsASwCFAAoA5f9qABcAqP9uAAcAcP8ZAB0AjP+y/0sA7P+i/0AAKwCn/zsAXwDT/y4AkgADABkAXQAuAP3/SgB/ANT/","full":{"el":"O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C N C C N N C N C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C O C C C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C P O O O C C O C O C C N C O N C N C C P O O O C C O C O C C N C N C C O N C N N C","xyz":"b/9K/5r+f/84/4r+nP87/5H+pf9W/4n+pP84/67+u/8p/7H+p/9V/7f+tP9h/5/+rf9+/53+wf+R/5v+2P+K/53+u/+r/5j+of+y/5X+nP/M/5D+jP+g/5b+k/+F/5r+wv8b/83+w//9/sr+r/8l/+L+3/8m/9T+9P8l/8D+CAA4/8r+/f9S/8j+DwA1/+j+KgAw/+v+BABO//X+BwBi/97+8v93/+H+2P90/+b+yv+K/+b+3P+d/+D+2f+5/93+xP/H/9/+8f/G/9j+CQC6/9X+HwDK/9H+DACg/9j+9f+S/93+NwAs/wj/TwAb/wX/IgAj/xv/QQBK/w//VQBX/wD/VAB0/wn/OQB9/wf/WwB3/yb/dwB5/yr/TACR/y3/OQCU/xb/HQCW/x//EACu/xz/HQDB/xT/9v+w/yL/6P+b/yv/zv+d/zD/9f+C/y7/EACA/yj/hAB//0f/oAB2/0X/cwBz/13/hACf/0j/lQCu/zf/jADK/zv/cADJ/zv/lADY/1X/nQDy/1H/egDV/2b/ZQDY/1D/TADK/1n/SQCy/2T/LwCr/2n/IgDB/2H/BgDG/2H/8/+4/2n/AADf/1j/EgDy/0//CAAKAEj/LADt/07/MgDU/1f/pAAFAGr/ugAYAGT/qAD0/4L/iQAXAGv/ggAlAFT/bAA4AFn/VAApAGD/cQBLAHD/ZABlAGz/ZQA7AIf/TAAwAHr/QwAWAIf/UwABAI7/RADs/5f/KgD1/5X/EQDp/5v/DwDP/6T/+//4/5f//v8QAI7/FAAeAIf/KQAPAIz/ZgB7AIL/ZgCWAHX/fQB2AJT/SgB3AJD/MgB5AIH/GgB4AJP/FwBdAJ3/HACKAKz/AwCZAK//IQB1AML/EQBeALj/HABEAMP/NgA8AMT/OAAjAM3/HwAbANH/FAACANr/IwDs/+D/+f8AANz/6v8VANb/8v8tAM3/DQAuAMv//v+rAMj/7f/CAL//FwCxANf/6v+ZANn/0v+QAM7/xv99AOL/2f9oAOb/wP+JAP3/pP+LAAEAz/93ABAA0v9dAAAA6v9NAAgA5v80ABEA0P8qABQA/f8lABYAFgAvABMAKQAgABgAGQBJAAsANQBVAAgAAwBZAAQAmP+XAB0Aff+hABcAq/+rACgAlv99AC8Ahf9nACUAh/9SADkAov9JADsAf/9aAFUAav9KAF8Amf9XAGUApf8/AFUAw/8+AFgAz/8mAF0Awf8SAGEA6v8lAF0A+v87AFgAEgA4AFkA7f9TAFIA/f9sAEwA0f9UAFIAXv9NAHwAQf9FAHsAY/9oAIYAbv83AIwAbP8bAIQAfP8MAJkAl/8SAJUAdf8VALUAZv8BAMQAkP8dAMEApP8PAK4AvP8gAKoA1P8TAKoA1f/7/68A6v8hAKQA6f87AJ4A//9JAJgA0P9JAJ4Auf86AKQAXP8HAOIARf/0/+cAVv8kAOYAdf////MAfv/k//UAlv/k/wcBq//y//oAk//y/yIBo//m/zUBnf8OABsBtf8FAA0Bwv8cAP4Atv8zAPcAyP9EAOsA3/81AOsA+f88AOIAAQBSANcACwAoAOYABgAQAPEAGwD///QA7v8JAPsA3P8dAPcAl//R/0oBif+7/zwBh//h/14Bsv/G/1gBw/+0/0oB4P+8/08B4//U/0EB5v/C/20B+P+v/3kB8P/f/2wB+P/j/08B9f///0cBCgAMADwBHwAAADoBBwAmADUB8P8zADgB7f9NADAB2v8mAEMB3P8LAEsB//+y/5gBAwCX/6QB6v/D/6YBGgDC/5kBMgC3/44BRgDO/48BPADh/3wBRgDd/6kBVQDQ/70BUwD3/58BRwD6/4MBMQAOAIIBFwALAIsBCAAhAIYBGQAxAHkBFQBLAG4BAABYAG0BLABWAGQBRQBKAGMBWgBYAFkBSQAxAG0BMgAmAHcB","b":"AAABAAEAAgACAAMAAgAEAAMABwAEAAUABAAGAAUAEAAGAAcABwAIAAgACQAIAA8ACQAKAAkACwALAAwADAANAAwADgAOAA8AEAARABAAEgAQABMAEwAUABQAFQAVABYAFQAXABYAGgAXABgAFwAZABgAJgAZABoAGgAbABsAHAAbACUAHAAdAB0AHgAeAB8AHgAlAB8AIAAfACEAIQAiACIAIwAiACQAJAAlACYAJwAmACgAJgApACkAKgAqACsAKwAsACsALQAsADAALQAuAC0ALwAuADkALwAwADAAMQAxADIAMQA4ADIAMwAyADQANAA1ADUANgA1ADcANwA4ADkAOgA5ADsAOQA8ADwAPQA9AD4APgA/AD4AQAA/AEMAQABBAEAAQgBBAE8AQgBDAEMARABEAEUARABOAEUARgBGAEcARwBIAEcATgBIAEkASABKAEoASwBLAEwASwBNAE0ATgBPAFAATwBRAE8AUgBSAFMAUwBUAFQAVQBUAFYAVQBZAFYAVwBWAFgAVwBkAFgAWQBZAFoAWgBbAFoAYwBbAFwAXABdAF0AXgBdAGMAXgBfAF4AYABgAGEAYQBiAGIAYwBkAGUAZABmAGQAZwBnAGgAaABpAGkAagBpAGsAagBuAGsAbABrAG0AbAB5AG0AbgBuAG8AbwBwAG8AeABwAHEAcQByAHIAcwByAHgAcwB0AHMAdQB1AHYAdgB3AHcAeAB5AHoAeQB7AHkAfAB8AH0AfQB+AH4AfwB+AIAAfwCDAIAAgQCAAIIAgQCNAIIAgwCDAIQAhACFAIQAjACFAIYAhQCHAIcAiACIAIkAiACKAIoAiwCKAIwAjQCOAI0AjwCNAJAAkACRAJEAkgCSAJMAkgCUAJMAlwCUAJUAlACWAJUAoQCWAJcAlwCYAJgAmQCYAKAAmQCaAJkAmwCbAJwAnACdAJwAngCeAJ8AngCgAKEAogChAKMAoQCkAKQApQClAKYApgCnAKYAqACnAKsAqACpAKgAqgCpALQAqgCrAKsArACsAK0ArACzAK0ArgCtAK8ArwCwALAAsQCwALIAsgCzALQAtQC0ALYAtAC3ALcAuAC4ALkAuQC6ALkAuwC6AL4AuwC8ALsAvQC8AMoAvQC+AL4AvwC/AMAAvwDJAMAAwQDBAMIAwgDDAMIAyQDDAMQAwwDFAMUAxgDGAMcAxgDIAMgAyQDKAMsAygDMAMoAzQDNAM4AzgDPAM8A0ADPANEA0ADUANEA0gDRANMA0gDdANMA1ADUANUA1QDWANUA3ADWANcA1gDYANgA2QDZANoA2QDbANsA3ADdAN4A3QDfAN0A4ADgAOEA4QDiAOIA4wDiAOQA4wDnAOQA5QDkAOYA5gDnAOcA6ADoAOkA6ADyAOkA6gDqAOsA6wDsAOsA8gDsAO0A7ADuAO4A7wDvAPAA7wDxAPEA8gA=","ri":"AAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYGBwcHBwcHBwcHBwcHBwcHBwcHBwcICAgICAgICAgICAgICAgICAgICQkJCQkJCQkJCQkJCQkJCQkJCQkJCQoKCgoKCgoKCgoKCgoKCgoKCgoLCwsLCwsLCwsLCwsLCwsLCwsLCwsL","an":"O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 N6 N1 C2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 O4 C5 C7 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N1 C2 O2 N3 C4 N4 C5 C6 P OP1 OP2 O5' C5' C4' O4' C3' O3' C2' C1' N9 C8 N7 C5 C6 O6 N1 C2 N2 N3 C4"}}],"ligs":[],"res":[]}});
Object.assign(BIO_MOL, {"gap":{"name":"Glyceraldehyde-3-phosphate","el":"O C C O C O P O O O H H H H H H H","xyz":"Lv9W/wgAVv+6/87/XP9AABYAbf+pALn/x/88AIIARQBjAFYAlAD2//r/LAEOAAoAdwBa/yYAcQALAFn/dv+y/2b/+v5PAEgAFv/IAJr/p/+CANIAyP/Z/7EAxQA+/1kAhgC2/y//","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAQAKAAIACwADAAwABAANAAQADgAIAA8ACQAQAA==","o":"2111112111111111"},"thymine":{"name":"Thymine","el":"C C C N C O N C O H H H H H H","xyz":"9v6x/wAAjf/N/wAA5P9o/wAAbgCB/wAAoAAEAAAAGAEYAAAARwBwAAAAvf9YAAAAbv+1AAAA5f5N/9j/0P62/2YAw/76/8L/wP8B/wAArwAz/wAAagDPAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgAAAAJAAAACgAAAAsAAgAMAAMADQAGAA4A","o":"121121112111111"}});


// @scene dna makeDna | ДНК: строение, репликация, репарация | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · ДНК: реальный додекамер B-ДНК (1BNA) с водородными связями пар оснований,
   вилка репликации (геликаза, праймаза, ДНК-полимеразы, фрагменты Оказаки, лигаза),
   УФ-повреждение (тиминовый димер) и эксцизионная репарация
   ========================================================= */
function makeDna() {
  __set_rnd(mulberry(1901));
  const scene = bioStage({ rim: 0x7fd6ff });
  const VIEW = { struct: flyTarget(V3(-1.3, -0.7, 0), V3(-0.1, 0.9, 13.5)), rep: flyTarget(V3(40, -1.0, 0), V3(40.6, 0.8, 18.5)), repair: flyTarget(V3(80, -1.4, 0), V3(81.2, 0.2, 13)) };
  // цель камеры — в центре модели, место под нижнюю панель — сдвигом кадра: вращение и приближение идут вокруг модели
  const VOFF = 0.16; Object.values(VIEW).forEach((v) => { const d = VOFF * 2 * Math.tan(17 * Math.PI / 180) * v.pos.distanceTo(v.target); v.target.y += d; v.pos.y += d; });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.struct.pos); camera.setViewOffset(1, 1, 0, VOFF, 1, 1);
  const controls = makeControls(camera, VIEW.struct.target); controls.minDistance = 2; controls.maxDistance = 40;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  const S = PDB('bna'); const SC = 0.16;
  // ось двойной спирали → горизонталь
  const allP = []; S.chains.forEach((c) => { for (let i = 0; i < c.p.length; i += 3) allP.push(V3(c.p[i], c.p[i + 1], c.p[i + 2]).multiplyScalar(SC)); });
  const AX = pcaAxis(allP); const QX = new THREE.Quaternion().setFromUnitVectors(AX.v, V3(1, 0, 0));
  function dnaModel(parent, perRes) {
    const g = new THREE.Group(); g.quaternion.copy(QX); g.position.copy(AX.c.clone().applyQuaternion(QX).negate()); parent.add(g);
    const parts = {};
    S.chains.forEach((c) => {
      const m = c.fullm; const ri = new Uint8Array(bin64(BIO_PDB.bna.chains.find((x) => x.id === c.id).full.ri));
      if (perRes) { for (let r = 0; r < c.seq.length; r++) { const idx = new Set(); for (let i = 0; i < m.n; i++) if (ri[i] === r) idx.add(i); const mm = molMesh(m, { scale: SC, idx }); g.add(mm); parts[c.id + r] = mm; } }
      else { const mm = molMesh(m, { scale: SC }); g.add(mm); parts[c.id] = mm; }
    });
    // водородные связи между основаниями
    const cA = S.chains[0].fullm, cB = S.chains[1].fullm; const anA = BIO_PDB.bna.chains[0].full.an.split(' '), anB = BIO_PDB.bna.chains[1].full.an.split(' ');
    const isBase = (n) => !n.includes("'") && !/^(P|OP1|OP2|O1P|O2P)$/.test(n) && /^[NO]/.test(n);
    const hb = new THREE.Group(); g.add(hb); const dashMat = new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.85 });
    for (let i = 0; i < cA.n; i++) { if (!isBase(anA[i])) continue; const a = V3(cA.xyz[i * 3], cA.xyz[i * 3 + 1], cA.xyz[i * 3 + 2]); for (let j = 0; j < cB.n; j++) { if (!isBase(anB[j])) continue; const b = V3(cB.xyz[j * 3], cB.xyz[j * 3 + 1], cB.xyz[j * 3 + 2]); const d = a.distanceTo(b); if (d > 2.55 && d < 3.25) { for (let k = 0; k < 3; k++) { const p0 = a.clone().lerp(b, (k * 2 + 0.6) / 6.6).multiplyScalar(SC), p1 = a.clone().lerp(b, (k * 2 + 1.6) / 6.6).multiplyScalar(SC); const m = new THREE.Mesh(CYL, dashMat); m.position.copy(p0).lerp(p1, 0.5); const dd = p1.clone().sub(p0); m.scale.set(0.012, dd.length(), 0.012); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dd.normalize()); hb.add(m); } } } }
    // «Строение»: полупрозрачная трубка остова по фосфатам и свой цвет углерода у каждой цепи — две антипараллельные цепи различимы
    if (!perRes) S.chains.forEach((c, k) => {
      const tr = nucTrace(c, { scale: SC, r: 1.1, steps: false, color: k ? '#FFB070' : '#7FD6FF' });
      tr.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.3; o.material.depthWrite = false; } }); g.add(tr);
      if (k) parts[c.id].traverse((o) => { if (o.material === atomMat('C')) o.material = atomMat('C', { color: new THREE.Color('#B07A48') }); });
    });
    return { g, parts, hb };
  }
  /* ---------- 1. строение ---------- */
  const G1 = new THREE.Group(); G1.position.set(0, 0.7, 0); scene.add(G1);
  const D1 = dnaModel(G1, false);
  G1.rotation.order = 'ZYX'; G1.rotation.y = 0.28; // вращение — вокруг оси спирали (локальная X), лёгкий наклон к зрителю
  // бороздки: угол остова каждой цепи (по фосфатам) — линейная функция x вдоль оси; малая — меньший угловой зазор между цепями
  const GRV = (() => {
    const fit = (c) => {
      const pts = []; for (let i = 0; i < c.p.length; i += 3) pts.push(V3(c.p[i], c.p[i + 1], c.p[i + 2]).multiplyScalar(SC).applyQuaternion(QX).add(D1.g.position));
      pts.sort((a, b) => a.x - b.x); const xs = [], as = []; let prev = null;
      pts.forEach((p) => { let a = Math.atan2(p.z, p.y); if (prev !== null) { while (a - prev > Math.PI) a -= 2 * Math.PI; while (a - prev < -Math.PI) a += 2 * Math.PI; } prev = a; xs.push(p.x); as.push(a); });
      const n = xs.length, mx = xs.reduce((q, v) => q + v, 0) / n, ma = as.reduce((q, v) => q + v, 0) / n; let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (as[i] - ma); sxx += (xs[i] - mx) ** 2; }
      const k = sxy / sxx; return { k, a0: ma - k * mx, r: pts.reduce((q, p) => q + Math.hypot(p.y, p.z), 0) / n, pts };
    };
    const A = fit(S.chains[0]), B = fit(S.chains[1]); const k = (A.k + B.k) / 2;
    const d = (((B.a0 - A.a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const minor = d < Math.PI ? A.a0 + d / 2 : A.a0 + d / 2 + Math.PI;
    return { k, minor, major: minor + Math.PI, r: (A.r + B.r) / 2, P: [...A.pts, ...B.pts] };
  })();
  // точка бороздки, обращённая к камере, ближайшая к x0 (в системе G1)
  const groovePos = (a0, x0) => {
    const cl = G1.worldToLocal(camera.position.clone()); const ph = Math.atan2(cl.z, cl.y); const T = 2 * Math.PI / Math.abs(GRV.k);
    let x = (ph - a0) / GRV.k; x += Math.round((x0 - x) / T) * T;
    GRV.ok = Math.abs(x) < 2.2; // у концов молекулы бороздка не подписывается
    return G1.localToWorld(V3(x, Math.cos(ph) * GRV.r * 0.95, Math.sin(ph) * GRV.r * 0.95));
  };
  // атом P, ближе всех к камере в правой части — для подписи остова
  const backbonePos = () => { const cl = G1.worldToLocal(camera.position.clone()); let best = null, bd = 1e9; GRV.P.forEach((p) => { if (p.x < 1.9 || p.x > 3.2) return; const dd = p.distanceTo(cl); if (dd < bd) { bd = dd; best = p; } }); return G1.localToWorld((best || V3(2, 0, 0)).clone()); };
  const hbMid = (() => { let best = null, bd = 1e9; D1.hb.children.forEach((m) => { const p = m.position.clone().applyQuaternion(QX).add(D1.g.position); const dd = Math.abs(p.x + 2.6); if (dd < bd) { bd = dd; best = p; } }); return best || V3(-2.6, 0, 0); })();
  const seqTxt = S.chains[0].seq;
  /* ---------- 2. вилка репликации ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const RAD = 0.32, PITCH = 1.1;
  function helixPair(len, colA, colB, rungs = true) {
    const g = new THREE.Group(); const N = Math.round(len / PITCH * 24);
    const mk = (ph, col) => { const pts = []; for (let i = 0; i <= N; i++) { const x = i / N * len; const a = x / PITCH * Math.PI * 2 + ph; pts.push(V3(x, Math.cos(a) * RAD, Math.sin(a) * RAD)); } const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, 0.06, 8), organMat(col, 0.55, { emissiveIntensity: 0.06 })); g.add(m); return m; };
    const sA = mk(0, colA), sB = colB ? mk(2.4, colB) : null;
    if (rungs && colB) { const nR = Math.round(len / PITCH * 10); const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), new THREE.MeshPhysicalMaterial({ roughness: 0.4 }), nR); const dm = new THREE.Object3D(); for (let i = 0; i < nR; i++) { const x = (i + 0.5) / nR * len; const a1 = x / PITCH * Math.PI * 2, a2 = a1 + 2.4; const p1 = V3(x, Math.cos(a1) * RAD, Math.sin(a1) * RAD), p2 = V3(x, Math.cos(a2) * RAD, Math.sin(a2) * RAD); dm.position.copy(p1).lerp(p2, 0.5); const d = p2.clone().sub(p1); dm.scale.set(1, d.length(), 1); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, new THREE.Color(Object.values(BASECOL)[Math.floor(rnd() * 4)]).multiplyScalar(0.6)); } g.add(im); }
    return { g, sA, sB };
  }
  const parent = helixPair(8, '#8FA8C8', '#8FA8C8'); parent.g.position.set(0.5, 0.6, 0); G2.add(parent.g);
  // порядок ZYX: спираль крутится вокруг своей оси (локальная X), а направление ветви (поворот по z) не меняется
  const lead = helixPair(7, '#8FA8C8', '#5CE0C8'); lead.g.position.set(-0.3, 1.1, 0); lead.g.rotation.order = 'ZYX'; lead.g.rotation.z = Math.PI - 0.32; G2.add(lead.g);
  const lagT = helixPair(7, '#8FA8C8', null, false); lagT.g.position.set(-0.3, 0.1, 0); lagT.g.rotation.order = 'ZYX'; lagT.g.rotation.z = Math.PI + 0.32; G2.add(lagT.g);
  const lagDir = V3(-Math.cos(0.32), -Math.sin(0.32), 0); const lagO = V3(-0.3, 0.1, 0);
  const frags = []; for (let k = 0; k < 5; k++) { const fr = new THREE.Group(); const dna = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), organMat('#5CE0C8', 0.55, { emissiveIntensity: 0.08 })); dna.rotation.z = Math.PI / 2; fr.add(dna); const pr = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 10), organMat('#FF5A5A', 0.6, { emissiveIntensity: 0.15 })); pr.rotation.z = Math.PI / 2; fr.add(pr); G2.add(fr); frags.push({ g: fr, dna, pr, s0: 0, len: 0, born: -99 }); }
  const enz = {};
  const eb = (id, pos, r, col, seed) => { const m = new THREE.Mesh(blobGeo(r[0], r[1], r[2], seed, 0.12, 3), protMat(col, 0.38)); m.position.copy(pos); G2.add(m); enz[id] = m; return m; };
  const heli = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.17, 16, 36), protMat('#F2C14E', 0.42)); heli.rotation.y = Math.PI / 2; heli.position.set(0.55, 0.6, 0); G2.add(heli); enz.heli = heli;
  eb('topo', V3(4.4, 1.22, 0.1), [0.42, 0.4, 0.42], '#C77DFF', 3); // сидит на ДНК, а не нанизана на неё
  eb('polL', V3(-1.3, 1.7, 0.2), [0.55, 0.45, 0.5], '#7FD6FF', 4);
  eb('polG', V3(-1.2, -0.45, 0.2), [0.55, 0.45, 0.5], '#7FD6FF', 5);
  eb('prim', V3(-0.2, -0.2, 0.5), [0.28, 0.24, 0.26], '#FF6A6A', 6);
  eb('pol1', V3(-3.9, -1.0, 0.3), [0.32, 0.28, 0.3], '#7FE0A0', 7);
  eb('lig', V3(-5.2, -1.5, 0.3), [0.3, 0.26, 0.28], '#FF8AB0', 8);
  const ssb = []; for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), protMat('#E0C8A0', 0.45)); m.position.copy(lagO).addScaledVector(lagDir, 0.4 + k * 0.32).add(V3(0, 0.15, 0)); G2.add(m); ssb.push(m); }
  /* ---------- 3. репарация ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0.7, 0); scene.add(G3);
  const D3 = dnaModel(G3, true);
  const uv = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.2, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xb08aff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); uv.position.set(0, 2.6, 0); G3.add(uv);
  const nuc = new THREE.Mesh(blobGeo(0.6, 0.5, 0.5, 12, 0.12, 3), protMat('#F2C14E', 0.38)); G3.add(nuc);
  const polR = new THREE.Mesh(blobGeo(0.55, 0.45, 0.5, 13, 0.12, 3), protMat('#7FD6FF', 0.38)); G3.add(polR);
  const ligR = new THREE.Mesh(blobGeo(0.4, 0.35, 0.35, 14, 0.12, 3), protMat('#FF8AB0', 0.38)); G3.add(ligR);
  // тиминовый димер: свечение жёлтым вместо цвета атома
  const YEL = new THREE.Color('#FFD84A');
  const dimerTint = (g, on) => { molGlow(g, 0); /* сначала свои копии материалов, общий кэш не трогаем */ g.traverse((o) => { if (o.material && o.material.emissive) { if (!o.userData.em0) o.userData.em0 = o.material.emissive.clone(); o.material.emissive.copy(on ? YEL : o.userData.em0); } }); };
  const resPos = (key) => { const m = D3.parts[key]; const b = new THREE.Box3().setFromObject(m); return b.getCenter(V3(0, 0, 0)).sub(G3.position); };
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'struct', labels: true, rot: true, fly: null, cyc: 0, msg: null, hb: true };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['struct', 'rep', 'repair'][k] === m; }); st.fly = VIEW[m]; st.cyc = 0; st.msg = null; refs.setInfo && refs.setInfo(); }
  const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = false; flyStep(st, camera, controls, dt); st.cyc += dt;
    if (st.mode === 'struct') { if (st.rot) G1.rotation.x += dt * 0.25; D1.hb.visible = st.hb; }
    if (st.mode === 'rep') {
      const w = 1.2; parent.g.rotation.x += dt * w; lead.g.rotation.x -= dt * w * 0.8; lagT.g.rotation.x += dt * w * 0.8;
      heli.rotation.x += dt * 4; enz.topo.rotation.y += dt * 0.8;
      // фрагменты Оказаки: каждые 3 с — новый праймер у вилки, растёт прочь от вилки, затем уезжает
      const v = 0.45;
      frags.forEach((f, k) => {
        const age = (st.cyc - k * 3) % 15; if (age < 0) { f.g.visible = false; return; }
        f.g.visible = true; const grow = Math.min(1, age / 2.6); const s0 = 0.5 + age * v; const len = 0.3 + 1.0 * grow;
        const p = lagO.clone().addScaledVector(lagDir, s0 + len / 2); f.g.position.copy(p).add(V3(0, 0.12, 0)); f.g.rotation.z = Math.atan2(lagDir.y, lagDir.x);
        f.dna.scale.y = len; f.dna.position.x = 0; f.pr.position.x = -len / 2 + 0.15; f.pr.visible = age < 6.5; f.pr.material.emissiveIntensity = 0.15;
        if (s0 > 6.5) f.g.visible = false;
      });
      enz.prim.position.y = -0.2 + 0.05 * Math.sin(t * 5); enz.polG.position.copy(lagO).addScaledVector(lagDir, 0.9 + 0.4 * ((st.cyc % 3) / 3)).add(V3(0, -0.35, 0.25));
      enz.pol1.position.copy(lagO).addScaledVector(lagDir, 0.5 + ((st.cyc % 15) * v + 2.6) % 6).add(V3(0, -0.4, 0.3));
      if (rnd() < 0.3) fx.spawn(V3(40 - 1.3, 1.7, 0.2).add(randUnit().multiplyScalar(0.5)), randUnit().multiplyScalar(0.2), new THREE.Color(0x5ce0c8), 0.5, 1, 1.0);
    }
    if (st.mode === 'repair') {
      if (st.rot) G3.rotation.y = Math.sin(t * 0.25) * 0.5;
      const T = 16, c = st.cyc % T;
      const dmg = ['A6', 'A7']; const cutR = ['A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
      uv.visible = c < 2.5; uv.material.opacity = 0.12 * (1 - Math.abs(c - 1.2) / 1.3);
      const dimer = c > 1.5 && c < 7; dmg.forEach((k) => { dimerTint(D3.parts[k], dimer); molGlow(D3.parts[k], dimer ? 0.75 + 0.2 * Math.sin(t * 6) : 0); });
      const gone = c > 6 && c < 9.5 ? ease((c - 6) / 1) : c >= 9.5 && c < 12 ? 1 - ease((c - 9.5) / 2.5) : 0;
      cutR.forEach((k) => { molFade(D3.parts[k], 1 - gone * 0.95); if (c > 9.5 && c < 12.5) molGlow(D3.parts[k], 0.2); else if (!dmg.includes(k)) molGlow(D3.parts[k], 0); });
      const site = resPos('A6').clone().lerp(resPos('A7'), 0.5);
      nuc.visible = c > 4 && c < 7.5; nuc.position.copy(site).add(V3(0, 0.9, 0.6));
      polR.visible = c > 9 && c < 12.5; polR.position.copy(resPos('A' + clamp(4 + Math.floor((c - 9) * 2), 4, 9))).add(V3(0, 0.85, 0.6));
      ligR.visible = c > 12.5 && c < 15; ligR.position.copy(resPos('A9')).add(V3(0.3, 0.8, 0.6));
      if (c > 13.5 && c < 13.6) for (let k = 0; k < 30; k++) fx.spawn(G3.position.clone().add(resPos('A9')), randUnit().multiplyScalar(0.6), new THREE.Color(0xff8ab0), 0.6, 2, 1.3);
      st.repPh = c < 1.5 ? 'UV irradiation' : c < 4 ? 'thymine dimer' : c < 7 ? 'recognition and incision' : c < 9.5 ? 'excision of the segment' : c < 12.5 ? 'DNA polymerase fills the gap' : c < 15 ? 'DNA ligase seals the strand' : 'DNA restored';
    }
    fx.update(dt);
  }
  const TXT = {
    struct: '<b>The DNA double helix</b> (Watson and Crick, 1953). This is the real structure of the Drew–Dickerson dodecamer (PDB 1BNA, sequence CGCGAATTCGCG): each ball is an atom. Two antiparallel strands (5′→3′ and 3′→5′) are built of nucleotides: the sugar deoxyribose + phosphate form the backbone (<span style="color:#FF9A30">●</span> phosphorus on the outside), while the nitrogenous bases point inward and are joined by <b>hydrogen bonds</b> (light blue dashes): <b>A=T — two bonds, G≡C — three</b>. That is why G-C-rich regions are more stable. Chargaff’s rules: A = T, G = C. One turn of the helix is 10 base pairs, 3.4 nm; you can see the major and minor grooves, where regulatory proteins bind.',
    rep: '<b>Replication</b> is the copying of DNA before cell division, and it is <b>semiconservative</b>: each new molecule contains one old strand and one new one. <b>Topoisomerase</b> (lilac) relieves the twisting strain ahead, <b>helicase</b> (yellow ring) unwinds the helix, and <b>SSB proteins</b> hold the single strands apart. DNA polymerase can only extend an existing strand and only in the 5′→3′ direction, so <b>primase</b> (red) lays down RNA primers. The <b>leading strand</b> is synthesized continuously, the <b>lagging strand</b> in pieces — <b>Okazaki fragments</b> (100–200 nucleotides in humans). DNA polymerase I (green) replaces the RNA primers with DNA, and <b>DNA ligase</b> (pink) joins the fragments. The speed is about 50 nucleotides per second at each fork, with 1 error per billion.',
    repair: '<b>Damage and repair.</b> Ultraviolet light cross-links two adjacent thymines (yellow glow) into a <b>thymine dimer</b> — the helix bends, and copying and reading of the gene fail. <b>Excision repair</b>: proteins recognize the defect, a nuclease nicks the strand on both sides and removes the segment, DNA polymerase fills it in using the second, intact strand as a template, and ligase seals it. An inherited defect of this system causes <b>xeroderma pigmentosum</b>: a thousandfold risk of skin cancer from sunlight. Tens of thousands of DNA lesions arise in every cell each day — and nearly all of them are repaired.',
  };
  const labels = [
    { text: 'sugar–phosphate backbone', get pos() { return backbonePos(); }, color: '#FF9A30', show: () => st.labels && st.mode === 'struct' },
    { text: 'base pairs · H-bonds', get pos() { return G1.localToWorld(hbMid.clone()); }, color: '#9FD8FF', show: () => st.labels && st.mode === 'struct' },
    { text: 'minor groove', get pos() { return groovePos(GRV.minor, 0); }, color: '#C8D2E6', show: () => st.labels && st.mode === 'struct' && (groovePos(GRV.minor, 0), GRV.ok) },
    { text: 'major groove', get pos() { return groovePos(GRV.major, 0); }, color: '#C8D2E6', show: () => st.labels && st.mode === 'struct' && (groovePos(GRV.major, 0), GRV.ok) },
    { text: `5′-${seqTxt}-3′`, pos: V3(-3.2, -0.9, 0), color: '#F2E6C8', show: () => st.labels && st.mode === 'struct' },
    { text: 'topoisomerase', pos: V3(44.4, 1.9, 0), color: '#C77DFF', show: () => st.labels && st.mode === 'rep' },
    { text: 'helicase', pos: V3(40.6, 1.4, 0.3), color: '#F2C14E', show: () => st.labels && st.mode === 'rep' },
    { text: 'leading strand', pos: V3(40 - 4.6, 2.7, 0), color: '#5CE0C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'lagging strand: Okazaki fragments', pos: V3(40 - 6.6, -1.2, 0), color: '#5CE0C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'DNA polymerase III', pos: V3(40 - 1.6, 2.4, 0.2), color: '#7FD6FF', show: () => st.labels && st.mode === 'rep' },
    { text: 'primase · RNA primer', pos: V3(40 + 0.3, -0.7, 0.5), color: '#FF6A6A', show: () => st.labels && st.mode === 'rep' },
    { text: 'SSB proteins', pos: V3(40 - 0.6, 0.55, 0.3), color: '#E0C8A0', show: () => st.labels && st.mode === 'rep' },
    { text: 'DNA polymerase I', pos: V3(40 - 4.4, -0.3, 0.3), color: '#7FE0A0', show: () => st.labels && st.mode === 'rep' },
    { text: 'DNA ligase', pos: V3(40 - 5.6, -2.1, 0.3), color: '#FF8AB0', show: () => st.labels && st.mode === 'rep' },
    { text: 'parent DNA', pos: V3(40 + 6.2, 1.4, 0), color: '#8FA8C8', show: () => st.labels && st.mode === 'rep' },
    { text: 'UV', pos: V3(80, 4.0, 0), color: '#B08AFF', show: () => st.labels && st.mode === 'repair' && st.cyc % 16 < 2.5 },
    { text: 'thymine dimer', get pos() { return resPos('A6').lerp(resPos('A7'), 0.5).add(G3.position).add(V3(0.6, -1.2, 0.4)); }, color: '#FFD84A', show: () => st.labels && st.mode === 'repair' && st.cyc % 16 > 1.5 && st.cyc % 16 < 6 },
    { text: 'nuclease (excinuclease)', get pos() { return nuc.getWorldPosition(V3(0, 0, 0)).add(V3(0.5, 0.55, 0)); }, color: '#F2C14E', show: () => st.labels && st.mode === 'repair' && nuc.visible },
    { text: 'DNA polymerase', get pos() { return polR.getWorldPosition(V3(0, 0, 0)).add(V3(0.5, 0.5, 0)); }, color: '#7FD6FF', show: () => st.labels && st.mode === 'repair' && polR.visible },
    { text: 'DNA ligase', get pos() { return ligR.getWorldPosition(V3(0, 0, 0)).add(V3(0.4, 0.45, 0)); }, color: '#FF8AB0', show: () => st.labels && st.mode === 'repair' && ligR.visible },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'struct', label: 'Structure' }, { id: 'rep', label: 'Replication' }, { id: 'repair', label: 'Damage and repair' }], () => st.mode, (v) => setMode(v));
    const hbT = toggle('H-bonds', () => st.hb, (v) => { st.hb = v; });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), group('View', 'R · N', hbT, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['struct', 'rep', 'repair'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'repair' ? [['Stage', st.repPh || '', '']] : st.mode === 'rep' ? [['Fork speed', '≈ 50', 'nt/s'], ['DNA per cell', '6.4 billion', 'pairs']] : [['Base pairs', '12', ''], ['Atoms', S.chains.reduce((a, c) => a + c.fullm.n, 0), '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#5CE0C8',
    kicker: 'Biochemistry · molecular genetics', title: 'DNA: structure, replication, repair',
    lede: 'Two meters of DNA in every cell hold the instructions for the whole organism. How it is built, how it is copied before division and how it is repaired.',
    notes: `
      <div><h2>Nucleic acids</h2>
        <p><b>DNA</b> is a polymer of deoxyribonucleotides (A, G, C, T) that stores hereditary information in the nucleus and mitochondria. <b>RNA</b> is made of ribonucleotides (A, G, C, U) and is usually single-stranded: mRNA, tRNA, rRNA and regulatory RNAs.</p>
        <h3>Replication enzymes</h3><ul><li>Helicase, topoisomerases (the target of quinolones and some anticancer drugs), SSB.</li><li>Primase — RNA primers.</li><li>DNA polymerases (α, δ, ε in humans) — synthesis and 3′→5′ proofreading.</li><li>DNA ligase. At chromosome ends — telomerase.</li></ul>
        <h3>Mutations</h3><p>Point mutations (substitution, insertion or deletion of a nucleotide), frameshift mutations, chromosomal mutations. Mutagens: UV and ionizing radiation, chemicals, viruses. Repair systems: direct repair, excision repair (base and nucleotide excision) and mismatch repair.</p></div>
      <div><h2>Simplifications and models</h2><ul><li>DNA dodecamer — PDB 1BNA, all heavy atoms; hydrogen bonds are found from the distances between the nitrogen and oxygen atoms of the bases.</li><li>The strands differ in the color of the backbone tube and of the carbon atoms (light blue and orange); the grooves are labeled where they face the viewer.</li><li>The replication fork and the enzymes are schematic.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  setMode('struct'); st.fly = null;
  return self;
}
export { makeDna };
