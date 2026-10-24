#!/usr/bin/env python3
"""Конформеры RDKit (ETKDG + MMFF) для отдельных молекул из tools/mols.py:LIB → data/mols.json (тот же формат, что у mols.py).
  python3 tools/rdconf.py data/mols.json id1 id2 ...        — построить и записать
  python3 tools/rdconf.py --check data/mols.json id1 ...    — проверить, что в данных: размах, цис/транс по SMILES
Выбор конформера: из 60 вложений берутся оптимизированные MMFF в пределах 6 ккал/моль от минимума,
из них — самый вытянутый (наибольший радиус инерции тяжёлых атомов): в вакууме кислоты и цепи
сворачиваются водородными связями, а в сцене нужна узнаваемая, «учебниковая» форма.
Нужен rdkit (pip install rdkit)."""
import base64, json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rdkit import Chem
from rdkit.Chem import AllChem
from mols import LIB

def build(smi, n=60, win=6.0, seed=11):
    m = Chem.AddHs(Chem.MolFromSmiles(smi))
    ps = AllChem.ETKDGv3(); ps.randomSeed = seed; ps.pruneRmsThresh = 0.2
    cids = list(AllChem.EmbedMultipleConfs(m, numConfs=n, params=ps))
    if not cids: ps.useRandomCoords = True; cids = list(AllChem.EmbedMultipleConfs(m, numConfs=n, params=ps))
    res = AllChem.MMFFOptimizeMoleculeConfs(m, maxIters=4000)
    E = np.array([e for c, e in res]); emin = E.min()
    heavy = [a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() > 1]
    best, bscore = None, -1
    for cid, (conv, e) in zip(cids, res):
        if e > emin + win: continue
        P = m.GetConformer(cid).GetPositions()[heavy]
        rg = np.sqrt(((P - P.mean(0)) ** 2).sum(1).mean())
        if rg > bscore: best, bscore = cid, rg
    return m, best, E[cids.index(best)] - emin, bscore

def dihedral(m, cid, ids, deg):
    """задать двугранный угол вручную (H2O2: MMFF даёт ~129°, опыт — 111–120°)"""
    from rdkit.Chem import rdMolTransforms as T
    T.SetDihedralDeg(m.GetConformer(cid), *ids, deg)
FIX = {'h2o2': lambda m, cid: dihedral(m, cid, (2, 0, 1, 3), 112.0)}

def encode(name, m, cid):
    Chem.Kekulize(m, clearAromaticFlags=True)
    P = m.GetConformer(cid).GetPositions(); P = P - P.mean(0)
    el = [a.GetSymbol() for a in m.GetAtoms()]
    B = [(b.GetBeginAtomIdx(), b.GetEndAtomIdx(), int(b.GetBondTypeAsDouble())) for b in m.GetBonds()]
    return {'name': name, 'el': ' '.join(el), 'xyz': base64.b64encode(np.round(P * 100).astype('<i2').tobytes()).decode(),
            'b': base64.b64encode(np.array([[a, b] for a, b, o in B], dtype='<u2').tobytes()).decode(), 'o': ''.join(str(o) for a, b, o in B)}

def decode(d):
    el = d['el'].split(' '); P = np.frombuffer(base64.b64decode(d['xyz']), '<i2').reshape(-1, 3) / 100.0
    b = np.frombuffer(base64.b64decode(d['b']), '<u2').reshape(-1, 2); o = [int(c) for c in d['o']]
    return el, P, b, o

def check(d, smi):
    """размах тяжёлых атомов и совпадение цис/транс двойных связей с SMILES"""
    el, P, b, o = decode(d)
    rw = Chem.RWMol()
    for e in el: rw.AddAtom(Chem.Atom(e))
    for (a, c), k in zip(b, o): rw.AddBond(int(a), int(c), {1: Chem.BondType.SINGLE, 2: Chem.BondType.DOUBLE, 3: Chem.BondType.TRIPLE}[k])
    m = rw.GetMol(); m.UpdatePropertyCache(strict=False)
    conf = Chem.Conformer(len(el))
    for i, p in enumerate(P): conf.SetAtomPosition(i, p.tolist())
    m.AddConformer(conf)
    Chem.AssignStereochemistryFrom3D(m)
    H = P[[i for i, e in enumerate(el) if e != 'H']]
    span = max(np.linalg.norm(H[i] - H[j]) for i in range(len(H)) for j in range(i))
    ref = Chem.MolFromSmiles(smi)
    want = sorted(str(bd.GetStereo()) for bd in ref.GetBonds() if bd.GetStereo() != Chem.BondStereo.STEREONONE)
    got = sorted(str(bd.GetStereo()) for bd in m.GetBonds() if bd.GetStereo() != Chem.BondStereo.STEREONONE)
    # простая проверка: число E и Z должно совпасть
    return span, want, got

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--check':
        data = json.load(open(a[1]))
        for k in a[2:]:
            span, want, got = check(data[k], LIB[k][1])
            ok = [w[-1] for w in want] == [g[-1] for g in got] or not want
            print(f'{k:14s} размах {span:5.1f} Å  стерео SMILES {want}  данные {got}  {"OK" if ok else "НЕ СОВПАДАЕТ"}')
        sys.exit()
    path = a[0]; data = json.load(open(path))
    for k in a[1:]:
        name, smi = LIB[k]
        m, cid, de, rg = build(smi)
        if k in FIX: FIX[k](m, cid)
        data[k] = encode(name, m, cid)
        span, want, got = check(data[k], smi)
        print(f'{k}: n={m.GetNumAtoms()} ΔE={de:.1f} ккал/моль Rg={rg:.2f} размах {span:.1f} Å стерео {got}', flush=True)
        json.dump(data, open(path, 'w'), separators=(',', ':'), ensure_ascii=False)
