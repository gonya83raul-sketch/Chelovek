"""Комплексы дыхательной цепи из OPM (мембрана z=±15, −z = матрикс) → data/pdb.json: cI cII cIII cIV cytc.
Поворот вокруг нормали, затем (x,y,z)→(x, z, −y): y сцены = нормаль мембраны. sites — точки кофакторов относительно центра данных."""
import sys, os, json, math, numpy as np
sys.path.insert(0, 'tools'); import pdbprep
D = sys.argv[1]; S = 0.022; WRITE = len(sys.argv) > 2
def rd(f):
    L = open(os.path.join(D, f)).read().splitlines()
    return [l for l in L if l.startswith(('ATOM', 'HETATM')) and l[17:20] != 'DUM']
xyz = lambda l: np.array([float(l[30:38]), float(l[38:46]), float(l[46:54])])
def ca(L, pred=lambda l: True): return np.array([xyz(l) for l in L if l.startswith('ATOM') and l[12:16] == ' CA ' and pred(l)])
def het(L, name, chain=None): 
    G = {}
    for l in L:
        if l.startswith('HETATM') and l[17:20].strip() == name and (chain is None or l[21] in chain): G.setdefault((l[21], l[22:26]), []).append(xyz(l))
    return [np.mean(v, axis=0) for v in G.values()]
def rotz(v, th): c, s = math.cos(th), math.sin(th); return np.array([c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]])
def toS(v, th): r = rotz(v, th); return np.array([r[0], r[2], -r[1]])
def ang_to(vec2, target):  # угол поворота, переводящий горизонтальный вектор в направление target (в координатах сцены x/z)
    # сцена: x = r0, z = −r1 ⇒ хотим (r0, −r1) ∥ target ⇒ (r0, r1) ∥ (tx, −tz)
    a = math.atan2(vec2[1], vec2[0]); b = math.atan2(-target[1], target[0]); return b - a
out = {}
def build(key, f, th, keep=None, ligs=(), sites={}, title=''):
    L = rd(f); tmp = os.path.join(D, key + '_rot.pdb')
    with open(tmp, 'w') as o:
        for l in L:
            if keep and l[21] not in keep: continue
            p = toS(xyz(l), th); o.write(l[:30] + '%8.3f%8.3f%8.3f' % tuple(p) + l[54:] + '\n')
    d = pdbprep.prep(tmp, keep_chains=keep, ligs=ligs, title=title); c0 = d.pop('_center'); d.pop('_atoms', None)
    allp = ca(L, lambda l: (not keep) or l[21] in keep); P = np.array([toS(p, th) for p in allp])
    mid = np.array([P[:, 0].mean(), 0.0, P[:, 2].mean()])
    d['sites'] = {'mid': [round(float(x), 2) for x in mid - c0]}
    for k, v in sites.items():
        pts = v if isinstance(v, list) else [v]
        d['sites'][k] = [[round(float(x), 2) for x in toS(p, th) - c0] for p in pts]
    lo = (P - mid).min(0) * S; hi = (P - mid).max(0) * S
    print(key, 'res', len(allp), 'bbox x %.2f..%.2f y %.2f..%.2f z %.2f..%.2f' % (lo[0], hi[0], lo[1], hi[1], lo[2], hi[2]), 'ligs', len(d['ligs']), 'bytes', len(json.dumps(d, separators=(',', ':'))))
    out[key] = d; return d
# --- I (5LC5): периферическая рука влево (−x)
L = rd('5lc5.pdb'); A = ca(L); per = A[A[:, 2] < -30].mean(0); memb = A[np.abs(A[:, 2]) < 15].mean(0)
th = ang_to((per - memb)[:2], (-1, 0))
fmn = het(L, 'FMN'); cl = het(L, 'SF4') + het(L, 'FES')
cl.sort(key=lambda p: -p[2])  # от мембраны вниз: N2 первый
build('cI', '5lc5.pdb', th, ligs=('FMN', 'SF4', 'FES'), sites={'fmn': fmn, 'fes': cl}, title='Комплекс I быка 5LC5')
# --- II (1ZOY)
L = rd('1zoy.pdb'); A = ca(L); head = A[A[:, 2] < -30].mean(0); memb = A[np.abs(A[:, 2]) < 15].mean(0)
th = ang_to((head - memb)[:2], (0, 1)) if np.linalg.norm((head - memb)[:2]) > 3 else 0
build('cII', '1zoy.pdb', th, ligs=('FAD', 'FS4', 'F3S', 'FES', 'HEM'), sites={'fad': het(L, 'FAD'), 'fes': sorted(het(L, 'FES') + het(L, 'FS4') + het(L, 'F3S'), key=lambda p: p[2]), 'hem': het(L, 'HEM'), 'q': het(L, 'UQ1')}, title='Комплекс II свиньи 1ZOY')
# --- III (1BGY): мономеры рядом по x
L = rd('1bgy.pdb'); m1 = ca(L, lambda l: l[21] in 'ABCDEFGHIJK').mean(0); m2 = ca(L, lambda l: l[21] in 'MNOPQRSTUVW').mean(0)
th = ang_to((m2 - m1)[:2], (1, 0))
build('cIII', '1bgy.pdb', th, ligs=('HEM', 'HEC', 'FES'), sites={'hem': het(L, 'HEM'), 'c1': het(L, 'HEC'), 'fes': het(L, 'FES')}, title='Комплекс III быка 1BGY')
# --- IV (1OCC), мономер A–M: домен CuA влево (к комплексу III)
L = rd('1occ.pdb'); K = 'ABCDEFGHIJKLM'; A = ca(L, lambda l: l[21] in K); cua = [p for p in het(L, 'CU', 'B')]; cub = het(L, 'CU', 'A'); hea = het(L, 'HEA', 'A')
th = ang_to((np.mean(cua, 0) - A.mean(0))[:2], (-1, 0))
build('cIV', '1occ.pdb', th, keep=tuple(K), ligs=('HEA',), sites={'cua': [np.mean(cua, 0)], 'cub': cub, 'hea': hea}, title='Комплекс IV быка 1OCC (мономер)')
# --- цитохром c
L = rd('1hrc.pdb'); build('cytc', '1hrc.pdb', 0, ligs=('HEM',), sites={'hem': het(L, 'HEM')}, title='Цитохром c лошади 1HRC')
if WRITE:
    p = 'data/pdb.json'; o = json.load(open(p)); o.update(out); json.dump(o, open(p, 'w'), separators=(',', ':')); print('written', os.path.getsize(p))
