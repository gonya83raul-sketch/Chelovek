import json, base64, numpy as np, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(R + '/data/pdb.json'))
def dec(s, q=20): return np.frombuffer(base64.b64decode(s), dtype='<i2').astype(float).reshape(-1, 3) / q
def enc(a, q=20): return base64.b64encode(np.round(a * q).astype('<i2').tobytes()).decode()
def deco(s): return np.frombuffer(base64.b64decode(s), dtype='<i1').astype(float).reshape(-1, 3) / 100
def enco(a): return base64.b64encode(np.clip(np.round(a * 100), -127, 127).astype('<i1').tobytes()).decode()
A = dec(d['adko']['chains'][0]['ca']); B = dec(d['adkc']['chains'][0]['ca'])
core = list(range(0, 29)) + list(range(60, 121)) + list(range(160, 214))
pa, pb = A[core].mean(0), B[core].mean(0)
H = (B[core] - pb).T @ (A[core] - pa); U, S, Vt = np.linalg.svd(H); Dm = np.diag([1, 1, np.sign(np.linalg.det(Vt.T @ U.T))]); Rm = Vt.T @ Dm @ U.T
B2 = (B - pb) @ Rm.T + pa
print('rmsd core', np.sqrt(((B2[core] - A[core]) ** 2).sum(1).mean()), 'all', np.sqrt(((B2 - A) ** 2).sum(1).mean()))
d['adkc']['chains'][0]['ca'] = enc(B2)
d['adkc']['chains'][0]['o'] = enco(deco(d['adkc']['chains'][0]['o']) @ Rm.T)
d['adkc']['chains'][0]['ss'] = d['adko']['chains'][0]['ss']
json.dump(d, open(R + '/data/pdb.json', 'w'), separators=(',', ':'))
