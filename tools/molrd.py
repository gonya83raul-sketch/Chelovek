#!/usr/bin/env python3
"""Вытянутые конформеры жирных кислот и ацилглицеринов (нужен RDKit: pip install rdkit).
Ацильные цепи — all-trans (C–C–C–C = 180°), цис/транс-двойные связи как в SMILES, аллильные торсионы тоже 180°
(олеиновая — излом ~35°, элаидиновая прямая, арахидоновая — «шпилька»); сложноэфирная связь — Z.
Торсионы головы (глицерин, фосфат) подбираются перебором так, чтобы цепи шли параллельно и не сталкивались,
затем MMFF с закреплёнными торсионами цепей. Выход — как у molgen.embed: el, xyz (Å), bonds [(a, b, порядок)]."""
import sys
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem, rdMolTransforms as T
from rdkit.Chem import rdForceFieldHelpers as FF


def _acyl_paths(m):
    """цепи от карбоксильного/сложноэфирного C (C с двумя O) до концевого CH3"""
    out = []
    for a in m.GetAtoms():
        if a.GetSymbol() != 'C' or sum(1 for n in a.GetNeighbors() if n.GetSymbol() == 'O') != 2: continue
        path, prev = [a.GetIdx()], -1
        while True:
            nx = [n.GetIdx() for n in m.GetAtomWithIdx(path[-1]).GetNeighbors() if n.GetSymbol() == 'C' and n.GetIdx() != prev and n.GetIdx() not in path]
            if not nx: break
            prev = path[-1]; path.append(nx[0])
        if len(path) >= 6: out.append(path)
    return out


def _heavy_nb(m, i, not_=-1):
    return [n.GetIdx() for n in m.GetAtomWithIdx(i).GetNeighbors() if n.GetSymbol() != 'H' and n.GetIdx() != not_]


def build(smi, seed=7, samples=6000, verbose=False):
    m = Chem.AddHs(Chem.MolFromSmiles(smi))
    ps = AllChem.ETKDGv3(); ps.randomSeed = seed; ps.useRandomCoords = True; ps.maxIterations = 2000
    if AllChem.EmbedMolecule(m, ps) != 0: raise RuntimeError('embed')
    AllChem.MMFFOptimizeMolecule(m, maxIters=500)
    conf = m.GetConformer()
    paths = _acyl_paths(m)
    fixed = []  # (a, b, c, d, угол)
    chain_bonds = set()
    for p in paths:
        for i in range(len(p) - 3):
            a, b, c, d = p[i:i + 4]
            chain_bonds.add(frozenset((b, c)))
            if m.GetBondBetweenAtoms(b, c).GetBondTypeAsDouble() == 2: continue
            fixed.append((a, b, c, d, 180.0))
        # сложный эфир: Cα–C(=O)–O–C = 180 (Z-эфир)
        c0, ca = p[0], p[1]
        for o in m.GetAtomWithIdx(c0).GetNeighbors():
            if o.GetSymbol() != 'O' or m.GetBondBetweenAtoms(c0, o.GetIdx()).GetBondTypeAsDouble() != 1: continue
            r = _heavy_nb(m, o.GetIdx(), c0)
            if r: fixed.append((ca, c0, o.GetIdx(), r[0], 180.0)); chain_bonds.add(frozenset((c0, o.GetIdx())))
    # прочие вращаемые связи головы
    free = []
    for bd in m.GetBonds():
        if bd.GetBondTypeAsDouble() != 1 or bd.IsInRing(): continue
        b, c = bd.GetBeginAtomIdx(), bd.GetEndAtomIdx()
        if frozenset((b, c)) in chain_bonds: continue
        nb, nc = _heavy_nb(m, b, c), _heavy_nb(m, c, b)
        if not nb or not nc: continue
        free.append((nb[0], b, c, nc[0]))
    for a, b, c, d, v in fixed: T.SetDihedralDeg(conf, a, b, c, d, v)
    heavy = np.array([a.GetSymbol() != 'H' for a in m.GetAtoms()])
    D = Chem.GetDistanceMatrix(m)
    HV = np.where(heavy)[0]
    far = (D[np.ix_(HV, HV)] > 3)

    def score(P):
        Q = P[HV]; dd = np.linalg.norm(Q[:, None] - Q[None], axis=-1)
        clash = (np.clip(3.4 - dd, 0, None) ** 2 * far).sum() / 2
        s = -6 * clash
        if len(paths) > 1:
            V = [P[p[-1]] - P[p[1]] for p in paths]; V = [v / np.linalg.norm(v) for v in V]
            M = [P[p[1:]].mean(0) for p in paths]
            for i in range(len(paths)):
                for j in range(i + 1, len(paths)):
                    s += 4 * np.dot(V[i], V[j])
                    s -= 0.15 * (np.linalg.norm(M[i] - M[j]) - 4.8) ** 2
        return s

    rng = np.random.default_rng(seed)
    base = Chem.Conformer(conf)
    best = (score(np.array(conf.GetPositions())), [T.GetDihedralDeg(conf, *t) for t in free])
    if free and len(paths) > 1:
        vals = [60.0, 180.0, 300.0]
        for it in range(samples):
            cur = list(best[1]) if it > samples // 2 else None
            ang = []
            for k, t in enumerate(free):
                if cur is not None: v = cur[k] + (rng.normal() * 25 if rng.random() < 0.3 else 0)
                else: v = vals[rng.integers(3)] + rng.normal() * 15
                ang.append(v); T.SetDihedralDeg(conf, *t, v)
            s = score(np.array(conf.GetPositions()))
            if s > best[0]: best = (s, ang)
        for t, v in zip(free, best[1]): T.SetDihedralDeg(conf, *t, v)
    # MMFF с закреплёнными цепями
    mp = FF.MMFFGetMoleculeProperties(m)
    ff = FF.MMFFGetMoleculeForceField(m, mp)
    for a, b, c, d, v in fixed: ff.MMFFAddTorsionConstraint(a, b, c, d, False, v - 4, v + 4, 200.0)
    for t in free:  # голову держим мягко — чтобы цепи не разошлись
        v = T.GetDihedralDeg(conf, *t); ff.MMFFAddTorsionConstraint(*t, False, v - 20, v + 20, 20.0)
    ff.Minimize(maxIts=2000)
    P = np.array(conf.GetPositions())
    if verbose and len(paths) > 1:
        V = [P[p[-1]] - P[p[1]] for p in paths]; V = [v / np.linalg.norm(v) for v in V]
        print('  cos', [round(float(np.dot(V[i], V[j])), 2) for i in range(len(V)) for j in range(i + 1, len(V))], file=sys.stderr)
    if verbose: print('score', round(best[0], 2), '→', round(score(P), 2), 'free', len(free), 'chains', len(paths), file=sys.stderr)
    # центр и главная ось по x (как в molgen)
    hv = P[heavy] - P[heavy].mean(0)
    _, _, vt = np.linalg.svd(hv, full_matrices=False)
    if np.linalg.det(vt) < 0: vt[2] *= -1
    P = (P - P[heavy].mean(0)) @ vt.T
    mk = Chem.Mol(m); Chem.Kekulize(mk, clearAromaticFlags=True)
    bonds = [(b.GetBeginAtomIdx(), b.GetEndAtomIdx(), int(b.GetBondTypeAsDouble())) for b in mk.GetBonds()]
    return {'el': [a.GetSymbol() for a in m.GetAtoms()], 'xyz': P, 'bonds': bonds, 'E': float(-score(P))}


if __name__ == '__main__':
    for smi in sys.argv[1:]:
        r = build(smi, verbose=True)
        H = np.array([e != 'H' for e in r['el']]); Q = r['xyz'][H]
        print(smi[:40], 'atoms', len(r['el']), 'span %.1f' % max(np.linalg.norm(a - b) for a in Q for b in Q))
