#!/usr/bin/env python3
"""Мини-генератор 3D-координат малых молекул из SMILES (без RDKit).
Парсер SMILES → кекулизация → неявные H → цели (связи, углы, плоскостность, хиральность, цис/транс)
→ вложение в 4D с последующим сжатием в 3D (градиентный спуск, несколько попыток)."""
import itertools, math, sys
import numpy as np

ORG = {'B', 'C', 'N', 'O', 'P', 'S', 'F', 'Cl', 'Br', 'I'}
AROM = {'b': 'B', 'c': 'C', 'n': 'N', 'o': 'O', 'p': 'P', 's': 'S', 'se': 'Se'}
VAL = {'B': [3], 'C': [4], 'N': [3, 5], 'O': [2], 'P': [3, 5], 'S': [2, 4, 6], 'F': [1], 'Cl': [1], 'Br': [1], 'I': [1]}
COV = dict(H=0.31, C=0.76, N=0.71, O=0.66, S=1.05, P=1.07, Fe=1.32, Mg=1.41, Zn=1.22, Cu=1.32, Ca=1.76, Co=1.26, I=1.39, Cl=1.02, F=0.57, Br=1.2, Se=1.2, Mn=1.39, Na=1.66, K=2.03, B=0.84)
METALS = {'Fe', 'Mg', 'Zn', 'Cu', 'Co', 'Mn', 'Ca', 'Na', 'K'}

class Mol:
    def __init__(self):
        self.el, self.arom, self.chg, self.hx, self.chi, self.br, self.nbr = [], [], [], [], [], [], []
        self.bonds = {}  # (i,j) i<j -> order (1,2,3, 1.5 aromatic)
        self.dirs = []   # (from, to, '/'|'\\')
    def add_atom(self, el, arom=False, chg=0, hx=None, chi=None, br=False):
        self.el.append(el); self.arom.append(arom); self.chg.append(chg); self.hx.append(hx); self.chi.append(chi); self.br.append(br); self.nbr.append([])
        return len(self.el) - 1
    def add_bond(self, i, j, o):
        self.bonds[(min(i, j), max(i, j))] = o
    def order(self, i, j): return self.bonds.get((min(i, j), max(i, j)), 0)
    def adj(self, i): return [j for (a, b) in self.bonds for j in ((b,) if a == i else (a,) if b == i else ())]

def parse(s):
    m = Mol(); i = 0; prev = None; stack = []; ring = {}; pend = None
    while i < len(s):
        c = s[i]
        if c == '(':
            stack.append(prev); i += 1; continue
        if c == ')':
            prev = stack.pop(); i += 1; continue
        if c in '-=#:/\\':
            pend = c; i += 1; continue
        if c == '.':
            prev = None; i += 1; continue
        if c.isdigit() or c == '%':
            if c == '%': n = int(s[i + 1:i + 3]); i += 3
            else: n = int(c); i += 1
            if n in ring:
                j, bs, slot = ring.pop(n)
                sym = pend or bs; o = bond_order(sym, m.arom[j] and m.arom[prev])
                m.add_bond(j, prev, o); m.nbr[j][slot] = prev; m.nbr[prev].append(j)
                if sym and sym in '/\\': m.dirs.append((prev, j, sym))
            else:
                m.nbr[prev].append(None); ring[n] = (prev, pend, len(m.nbr[prev]) - 1)
            pend = None; continue
        # атом
        if c == '[':
            k = s.index(']', i); body = s[i + 1:k]; i = k + 1
            j = 0
            while j < len(body) and body[j].isdigit(): j += 1
            body = body[j:]
            if body[:2] in ('Cl', 'Br', 'Fe', 'Mg', 'Zn', 'Cu', 'Co', 'Mn', 'Ca', 'Na', 'Se', 'se'): el = body[:2]; body = body[2:]
            else: el = body[0]; body = body[1:]
            arom = el.islower(); el = AROM.get(el, el)
            chi = None
            if body.startswith('@@'): chi = '@@'; body = body[2:]
            elif body.startswith('@'): chi = '@'; body = body[1:]
            hx = 0
            if body.startswith('H'):
                body = body[1:]; hx = 1
                if body[:1].isdigit(): hx = int(body[0]); body = body[1:]
            chg = 0
            while body[:1] in ('+', '-'):
                sg = 1 if body[0] == '+' else -1; body = body[1:]
                if body[:1].isdigit(): chg += sg * int(body[0]); body = body[1:]
                else: chg += sg
            a = m.add_atom(el, arom, chg, hx, chi, True)
            if chi and hx:  # неявный H идёт сразу после «предыдущего» соседа
                m.nbr[a].append('H') if prev is None else None
        else:
            if s[i:i + 2] in ('Cl', 'Br'): el = s[i:i + 2]; i += 2
            else: el = s[i]; i += 1
            arom = el.islower(); el = AROM.get(el, el)
            a = m.add_atom(el, arom)
        if prev is not None:
            o = bond_order(pend, m.arom[prev] and m.arom[a]); m.add_bond(prev, a, o)
            m.nbr[prev].append(a); m.nbr[a].insert(0, prev)
            if m.chi[a] and m.hx[a]: m.nbr[a].insert(1, 'H')
            if pend in ('/', '\\'): m.dirs.append((prev, a, pend))
        pend = None; prev = a
    return m

def bond_order(sym, both_arom):
    if sym == '=': return 2
    if sym == '#': return 3
    if sym == ':': return 1.5
    if sym in ('-', '/', '\\'): return 1
    return 1.5 if both_arom else 1

def kekulize(m):
    n = len(m.el)
    need = []
    for a in range(n):
        if not m.arom[a]: continue
        nb = m.adj(a)
        exo2 = any(m.order(a, b) == 2 for b in nb)
        if exo2: continue
        if m.el[a] == 'C': need.append(a)
        elif m.el[a] == 'N':
            deg = len(nb) + (m.hx[a] or 0)
            if m.chg[a] == 1 and deg == 3: need.append(a)
            elif deg == 2 and not m.hx[a]: need.append(a)
        elif m.el[a] in ('B', 'P'): need.append(a)
    needset = set(need)
    edges = {a: [b for b in m.adj(a) if b in needset and m.order(a, b) == 1.5] for a in need}
    match = {}
    def solve(rem):
        if not rem: return True
        a = min(rem, key=lambda x: len([b for b in edges[x] if b in rem]))
        for b in edges[a]:
            if b in rem:
                match[a] = b; match[b] = a
                if solve(rem - {a, b}): return True
                del match[a]; del match[b]
        return False
    ok = solve(set(need))
    if not ok: print('  ! kekulize failed', file=sys.stderr)
    for (a, b), o in list(m.bonds.items()):
        if o == 1.5: m.bonds[(a, b)] = 2 if match.get(a) == b else 1

def add_h(m):
    n0 = len(m.el)
    for a in range(n0):
        if m.br[a]: h = m.hx[a] or 0
        else:
            s = sum(m.order(a, b) for b in m.adj(a))
            vals = VAL.get(m.el[a], [0]); v = next((x for x in vals if x >= s), vals[-1]); h = max(0, int(round(v - s)))
            if m.arom[a] and m.el[a] == 'N': h = 0 if s >= 3 or len(m.adj(a)) >= 2 else h
        for k in range(h):
            hh = m.add_atom('H'); m.add_bond(a, hh, 1); m.nbr[hh].append(a)
            if 'H' in m.nbr[a]: m.nbr[a][m.nbr[a].index('H')] = hh
            else: m.nbr[a].append(hh)

def hyb(m, a):
    nb = m.adj(a); os_ = [m.order(a, b) for b in nb]
    if m.el[a] in METALS: return 'm'
    if 3 in os_ or os_.count(2) >= 2: return 'sp'
    if 2 in os_ or m.arom[a]: return 'sp2'
    if m.el[a] in ('N', 'O') and len(nb) <= 3:
        for b in nb:
            if m.el[b] in ('C', 'N') and (m.arom[b] or any(m.order(b, c) == 2 for c in m.adj(b))):
                return 'sp2' if m.el[a] == 'N' and len(nb) == 3 else 'sp3c'
    return 'sp3'

BL = {('C', 'C', 1): 1.53, ('C', 'C', 2): 1.34, ('C', 'C', 3): 1.20, ('C', 'N', 1): 1.46, ('C', 'N', 2): 1.29, ('C', 'N', 3): 1.16, ('C', 'O', 1): 1.42, ('C', 'O', 2): 1.22,
      ('C', 'S', 1): 1.81, ('C', 'S', 2): 1.67, ('N', 'N', 1): 1.42, ('N', 'N', 2): 1.25, ('N', 'O', 1): 1.40, ('N', 'O', 2): 1.22, ('O', 'P', 1): 1.60, ('O', 'P', 2): 1.48, ('O', 'S', 2): 1.45, ('O', 'S', 1): 1.58,
      ('S', 'S', 1): 2.05, ('C', 'H', 1): 1.09, ('H', 'N', 1): 1.01, ('H', 'O', 1): 0.97, ('H', 'S', 1): 1.34, ('C', 'Cl', 1): 1.77, ('C', 'I', 1): 2.10, ('C', 'F', 1): 1.35, ('C', 'Br', 1): 1.94, ('N', 'P', 1): 1.68, ('C', 'P', 1): 1.84}
def blen(m, a, b, o):
    key = tuple(sorted((m.el[a], m.el[b]))) + (int(o),)
    if m.el[a] in METALS or m.el[b] in METALS: return 2.0
    if key in BL:
        d = BL[key]
        # сопряжённая одинарная в ароматике/кольце
        if o == 1 and m.arom[a] and m.arom[b]: d -= 0.06
        return d
    return COV.get(m.el[a], 0.8) + COV.get(m.el[b], 0.8) - 0.1 * (o - 1)

def rings(m, maxs=8):
    """кольца до maxs атомов (простые циклы через BFS из каждой связи)."""
    out = set(); n = len(m.el)
    adj = [m.adj(a) for a in range(n)]
    for (a, b) in m.bonds:
        # кратчайший путь b→a без ребра a-b
        prev = {b: None}; q = [b]; found = None
        while q and not found:
            nq = []
            for x in q:
                for y in adj[x]:
                    if (x == b and y == a) or y in prev: continue
                    prev[y] = x
                    if y == a: found = True; break
                    nq.append(y)
                if found: break
            q = nq
        if found:
            path = [a]; x = prev[a]
            while x is not None: path.append(x); x = prev[x]
            if len(path) <= maxs: out.add(tuple(sorted(path)))
    return [set(r) for r in out]

def chi_sign():
    """знак объёма для '@' при соседях n1..n4 (n1 к наблюдателю, остальные против часовой)."""
    h = 0.33
    p = [np.array([0, 0, 1.0]), np.array([1, 0, -h]), np.array([math.cos(2.094), math.sin(2.094), -h]), np.array([math.cos(4.189), math.sin(4.189), -h])]
    return np.sign(np.dot(p[1] - p[0], np.cross(p[2] - p[0], p[3] - p[0])))
CHI_AT = chi_sign()

def embed(smiles, seed=0, tries=4, verbose=False, it=(700, 700, 1200)):
    m = parse(smiles); kekulize(m); add_h(m)
    n = len(m.el); heavy = np.array([e != 'H' for e in m.el])
    adj = [m.adj(a) for a in range(n)]
    # топологические расстояния
    D = np.full((n, n), 99, dtype=int)
    for a in range(n):
        D[a, a] = 0; q = [a]
        while q:
            nq = []
            for x in q:
                for y in adj[x]:
                    if D[a, y] == 99: D[a, y] = D[a, x] + 1; nq.append(y)
            q = nq
    D2 = np.full((n, n), 99, dtype=int)
    for a in range(n):
        if m.el[a] in METALS: continue
        D2[a, a] = 0; q = [a]
        while q:
            nq = []
            for x in q:
                for y in adj[x]:
                    if m.el[y] in METALS: continue
                    if D2[a, y] == 99: D2[a, y] = D2[a, x] + 1; nq.append(y)
            q = nq
    R = rings(m); H = [hyb(m, a) for a in range(n)]
    I, J, D0, W, KIND = [], [], [], [], []
    def dist(i, j, d0, w=1.0, kind=0): I.append(i); J.append(j); D0.append(d0); W.append(w); KIND.append(kind)
    BLd = {}
    for (a, b), o in m.bonds.items():
        d = blen(m, a, b, o); BLd[(a, b)] = BLd[(b, a)] = d; dist(a, b, d, 3.0)
    for c in range(n):
        nb = adj[c]
        if m.el[c] in METALS:
            ns = [x for x in nb if m.el[x] != 'H']
            macro = [x for x in ns if m.el[x] == 'N' and sum(1 for y in ns if y != x and m.el[y] == 'N' and D2[x, y] <= 7) >= 2]
            if len(macro) == 4:
                prs = sorted(itertools.combinations(macro, 2), key=lambda p: -D2[p[0], p[1]])
                for k, (x, y) in enumerate(prs): dist(x, y, 4.0 if k < 2 else 2.83, 1.0)
                ax = [x for x in ns if x not in macro]
                for x in ax:
                    for y in macro: dist(x, y, 2.83, 1.0)
                if len(ax) == 2: dist(ax[0], ax[1], 4.0, 1.0)
            continue
        for x, y in itertools.combinations(nb, 2):
            th = {'sp': 180, 'sp2': 120, 'sp3': 109.5, 'sp3c': 116, 'm': 90}[H[c]]
            for r in R:
                if c in r and x in r and y in r:
                    th = {3: 60, 4: 90, 5: 108}.get(len(r), 120 if H[c] == 'sp2' else (112 if len(r) == 6 else th)); break
            a_, b_ = BLd[(c, x)], BLd[(c, y)]
            dist(x, y, math.sqrt(a_ * a_ + b_ * b_ - 2 * a_ * b_ * math.cos(math.radians(th))), 1.0)
    VOL = []  # (a,b,c,d, kind, target): kind 0 — плоскость, 1 — хиральность (знак)
    for c in range(n):
        if H[c] == 'sp2' and len(adj[c]) == 3: VOL.append((c, *adj[c], 0, 0.0))
    for (a, b), o in m.bonds.items():
        if H[a] == 'sp2' and H[b] == 'sp2' and (o >= 2 or any(a in r and b in r for r in R) or m.el[a] == 'N' or m.el[b] == 'N' or True):
            for x in adj[a]:
                if x == b: continue
                for y in adj[b]:
                    if y == a or y == x: continue
                    VOL.append((x, a, b, y, 0, 0.0))
    # цис/транс из / \
    dmap = {}
    for f, t, sym in m.dirs: dmap[(f, t)] = sym; dmap[(t, f)] = '/' if sym == '\\' else '\\'
    for (a, b), o in m.bonds.items():
        if o != 2: continue
        da = [(x, dmap[(x, a)]) for x in adj[a] if (x, a) in dmap and x != b]
        db = [(y, dmap[(b, y)]) for y in adj[b] if (b, y) in dmap and y != a]
        if da and db:
            (x, s1), (y, s2) = da[0], db[0]
            trans = (s1 == s2); dist(x, y, 3.75 if trans else 2.95, 2.0)
    # хиральность
    for c in range(n):
        if m.chi[c]:
            nb = [x for x in m.nbr[c] if isinstance(x, int)]
            if len(nb) == 3: nb = nb  # без H — пропуск
            if len(nb) == 4:
                sg = CHI_AT * (1 if m.chi[c] == '@' else -1)
                VOL.append((nb[0], nb[1], nb[2], nb[3], 1, sg))
    # анти-предпочтение в цепях sp3
    for (a, b), o in m.bonds.items():
        if o == 1 and H[a] == 'sp3' and H[b] == 'sp3' and not any(a in r and b in r for r in R):
            for x in adj[a]:
                for y in adj[b]:
                    if x != b and y != a and heavy[x] and heavy[y] and D[x, y] == 3: dist(x, y, 3.0, 0.15)
    # отталкивание
    for i in range(n):
        for j in range(i + 1, n):
            if D[i, j] >= 3:
                hh = (not heavy[i]) + (not heavy[j])
                dm = [3.2, 2.6, 2.1][hh] if D[i, j] > 3 else [2.7, 2.3, 1.9][hh]
                dist(i, j, dm, 0.6, 1)
    I = np.array(I); J = np.array(J); D0 = np.array(D0); W = np.array(W); KIND = np.array(KIND)
    VA = np.array([v[:4] for v in VOL], dtype=int).reshape(-1, 4); VK = np.array([v[4] for v in VOL]); VT = np.array([v[5] for v in VOL])

    def energy_grad(X, dim, kv, k4):
        g = np.zeros_like(X)
        d = X[I] - X[J]; r = np.sqrt((d * d).sum(1)) + 1e-9
        diff = r - D0
        act = (KIND == 0) | (diff < 0)
        e = (W * diff * diff * act).sum()
        f = (2 * W * diff * act / r)[:, None] * d
        np.add.at(g, I, f); np.add.at(g, J, -f)
        if kv > 0 and len(VA):
            P = X[:, :3]
            u = P[VA[:, 1]] - P[VA[:, 0]]; v = P[VA[:, 2]] - P[VA[:, 0]]; w = P[VA[:, 3]] - P[VA[:, 0]]
            V = (u * np.cross(v, w)).sum(1)
            # плоскость: V→0; хиральность: s*V ≥ 1.2
            res = np.where(VK == 0, V, np.minimum(0, VT * V - 1.2) * VT)
            wv = np.where(VK == 0, 0.6, 2.0) * kv
            e += (wv * res * res).sum()
            c = (2 * wv * res)[:, None]
            du = np.cross(v, w) * c; dv = np.cross(w, u) * c; dw = np.cross(u, v) * c
            G = np.zeros((len(X), 3))
            np.add.at(G, VA[:, 1], du); np.add.at(G, VA[:, 2], dv); np.add.at(G, VA[:, 3], dw); np.add.at(G, VA[:, 0], -(du + dv + dw))
            g[:, :3] += G
        if k4 > 0 and dim == 4:
            e += k4 * (X[:, 3] ** 2).sum(); g[:, 3] += 2 * k4 * X[:, 3]
        return e, g

    def run(X, steps, dim, kv, k4, lr):
        mo = np.zeros_like(X); vv = np.zeros_like(X); b1, b2 = 0.9, 0.999
        for t in range(1, steps + 1):
            e, g = energy_grad(X, dim, kv, k4(t) if callable(k4) else k4)
            mo = b1 * mo + (1 - b1) * g; vv = b2 * vv + (1 - b2) * g * g
            X = X - lr * (mo / (1 - b1 ** t)) / (np.sqrt(vv / (1 - b2 ** t)) + 1e-8)
        return X, e
    rng = np.random.default_rng(seed)
    best = None
    for t in range(tries):
        X = rng.normal(size=(n, 4)) * (1.2 * n ** (1 / 3) + 1)
        X, _ = run(X, it[0], 4, 0.0, 0.0, 0.08)
        X, _ = run(X, it[1], 4, 0.3, lambda s: 0.002 * s, 0.05)
        X = X.copy(); X[:, 3] = 0
        X, _ = run(X, it[2], 4, 1.0, 50.0, 0.02)
        e, _ = energy_grad(X, 4, 1.0, 50.0)
        if verbose: print('  try', t, round(e, 3), file=sys.stderr)
        if best is None or e < best[0]: best = (e, X[:, :3].copy())
    P = best[1] - best[1].mean(0)
    # главная ось молекулы — по x
    if heavy.sum() >= 3:
        hv = P[heavy] - P[heavy].mean(0)
        _, _, vt = np.linalg.svd(hv, full_matrices=False)
        P = (P - P[heavy].mean(0)) @ vt.T
        if np.linalg.det(vt) < 0: P[:, 2] *= -1
    bonds = [(a, b, int(o)) for (a, b), o in m.bonds.items()]
    return {'el': m.el, 'xyz': P, 'bonds': bonds, 'E': best[0], 'chg': m.chg}

def check(res):
    el, P, B = res['el'], res['xyz'], res['bonds']
    dev = [abs(np.linalg.norm(P[a] - P[b]) - 1.0) for a, b, o in B]
    close = 0
    for i in range(len(el)):
        for j in range(i + 1, len(el)):
            if el[i] != 'H' and el[j] != 'H' and np.linalg.norm(P[i] - P[j]) < 2.2 and not any((a, b) in ((i, j), (j, i)) for a, b, o in B): close += 1
    return close

if __name__ == '__main__':
    for smi in sys.argv[1:]:
        r = embed(smi, verbose=True)
        print(smi, 'atoms', len(r['el']), 'E', round(r['E'], 3), 'close', check(r))
