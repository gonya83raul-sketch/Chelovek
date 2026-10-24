#!/usr/bin/env python3
"""PDB / BinaryCIF → компактные данные для сцен биохимии (bio/00_data_pdb.js).
Белки: CA-трасса + направление C=O + вторичная структура (записи HELIX/SHEET или упрощённый DSSP).
Нуклеиновые кислоты: P-трасса + направление на основание. Лиганды и выбранные остатки: тяжёлые атомы + связи."""
import base64, gzip, json, math, struct, sys
import numpy as np

AA = dict(ALA='A', ARG='R', ASN='N', ASP='D', CYS='C', GLN='Q', GLU='E', GLY='G', HIS='H', ILE='I', LEU='L', LYS='K', MET='M', PHE='F', PRO='P', SER='S', THR='T', TRP='W', TYR='Y', VAL='V', MSE='M', HSD='H', HSE='H', HSP='H', HIE='H', HID='H', HIP='H', CYX='C', ASH='D', GLH='E', LYN='K', PTR='Y', SEP='S', TPO='T')
NUC = {'DA': 'A', 'DC': 'C', 'DG': 'G', 'DT': 'T', 'A': 'A', 'C': 'C', 'G': 'G', 'U': 'U', 'T': 'T', 'ADE': 'A', 'CYT': 'C', 'GUA': 'G', 'THY': 'T', 'URA': 'U', 'DA5': 'A', 'DA3': 'A', 'DC5': 'C', 'DC3': 'C', 'DG5': 'G', 'DG3': 'G', 'DT5': 'T', 'DT3': 'T', 'RA': 'A', 'RC': 'C', 'RG': 'G', 'RU': 'U'}

# ---------------- msgpack + BinaryCIF ----------------
def unpack(b, i=0):
    t = b[i]
    if t <= 0x7f: return t, i + 1
    if 0x80 <= t <= 0x8f: return _map(b, i + 1, t & 15)
    if 0x90 <= t <= 0x9f: return _arr(b, i + 1, t & 15)
    if 0xa0 <= t <= 0xbf: n = t & 31; return b[i + 1:i + 1 + n].decode(), i + 1 + n
    if t >= 0xe0: return t - 256, i + 1
    if t == 0xc0: return None, i + 1
    if t == 0xc2: return False, i + 1
    if t == 0xc3: return True, i + 1
    if t in (0xc4, 0xc5, 0xc6):
        k = {0xc4: 1, 0xc5: 2, 0xc6: 4}[t]; n = int.from_bytes(b[i + 1:i + 1 + k], 'big'); s = i + 1 + k; return bytes(b[s:s + n]), s + n
    if t == 0xca: return struct.unpack('>f', b[i + 1:i + 5])[0], i + 5
    if t == 0xcb: return struct.unpack('>d', b[i + 1:i + 9])[0], i + 9
    if t in (0xcc, 0xcd, 0xce, 0xcf):
        k = {0xcc: 1, 0xcd: 2, 0xce: 4, 0xcf: 8}[t]; return int.from_bytes(b[i + 1:i + 1 + k], 'big'), i + 1 + k
    if t in (0xd0, 0xd1, 0xd2, 0xd3):
        k = {0xd0: 1, 0xd1: 2, 0xd2: 4, 0xd3: 8}[t]; return int.from_bytes(b[i + 1:i + 1 + k], 'big', signed=True), i + 1 + k
    if t in (0xd9, 0xda, 0xdb):
        k = {0xd9: 1, 0xda: 2, 0xdb: 4}[t]; n = int.from_bytes(b[i + 1:i + 1 + k], 'big'); s = i + 1 + k; return b[s:s + n].decode(), s + n
    if t in (0xdc, 0xdd):
        k = 2 if t == 0xdc else 4; return _arr(b, i + 1 + k, int.from_bytes(b[i + 1:i + 1 + k], 'big'))
    if t in (0xde, 0xdf):
        k = 2 if t == 0xde else 4; return _map(b, i + 1 + k, int.from_bytes(b[i + 1:i + 1 + k], 'big'))
    raise ValueError('msgpack type %x' % t)
def _arr(b, i, n):
    out = []
    for _ in range(n): v, i = unpack(b, i); out.append(v)
    return out, i
def _map(b, i, n):
    out = {}
    for _ in range(n): k, i = unpack(b, i); v, i = unpack(b, i); out[k] = v
    return out, i

DT = {1: '<i1', 2: '<i2', 3: '<i4', 4: '<u1', 5: '<u2', 6: '<u4', 32: '<f4', 33: '<f8'}
def bdecode(data, encs):
    for e in reversed(encs):
        k = e['kind']
        if k == 'ByteArray': data = np.frombuffer(data, dtype=DT[e['type']])
        elif k == 'FixedPoint': data = np.asarray(data, dtype=float) / e['factor']
        elif k == 'IntervalQuantization': data = e['min'] + (e['max'] - e['min']) / (e['numSteps'] - 1) * np.asarray(data, dtype=float)
        elif k == 'RunLength':
            d = np.asarray(data); data = np.repeat(d[0::2], d[1::2])
        elif k == 'Delta':
            d = np.asarray(data, dtype=np.int64).copy(); d[0] += e['origin']; data = np.cumsum(d)
        elif k == 'IntegerPacking':
            d = np.asarray(data, dtype=np.int64); bc = e['byteCount']; uns = e['isUnsigned']
            hi = (1 << (8 * bc)) - 1 if uns else (1 << (8 * bc - 1)) - 1; lo = 0 if uns else -(1 << (8 * bc - 1))
            out, acc = [], 0
            for v in d:
                if v == hi or (not uns and v == lo): acc += int(v); continue
                out.append(acc + int(v)); acc = 0
            data = np.array(out, dtype=np.int64)
        elif k == 'StringArray':
            offs = bdecode(e['offsets'], e['offsetEncoding']); idx = bdecode(data, e['dataEncoding']); sd = e['stringData']
            strs = [sd[offs[j]:offs[j + 1]] for j in range(len(offs) - 1)]
            data = np.array([strs[j] if j >= 0 else '' for j in idx], dtype=object)
        else: raise ValueError(k)
    return data
def read_bcif(path):
    raw = gzip.open(path).read() if path.endswith('.gz') else open(path, 'rb').read()
    doc, _ = unpack(raw)
    blk = doc['dataBlocks'][0]; cats = {}
    for c in blk['categories']:
        cols = {}
        for col in c['columns']:
            cols[col['name']] = bdecode(col['data']['data'], col['data']['encoding'])
        cats[c['name'].lstrip('_')] = cols
    return cats

# ---------------- атомы ----------------
class Atom:
    __slots__ = ('rec', 'name', 'res', 'chain', 'seq', 'icode', 'x', 'el', 'alt')
def read_structure(path):
    atoms, helix, sheet = [], [], []
    if '.bcif' in path:
        c = read_bcif(path); a = c['atom_site']; n = len(a['Cartn_x'])
        model = a.get('pdbx_PDB_model_num')
        for i in range(n):
            if model is not None and int(model[i]) != int(model[0]): continue
            t = Atom(); t.rec = a['group_PDB'][i]; t.name = a['label_atom_id'][i]; t.res = a['label_comp_id'][i]
            t.chain = a['auth_asym_id'][i]; t.seq = int(a['auth_seq_id'][i]); t.icode = ''
            t.x = np.array([a['Cartn_x'][i], a['Cartn_y'][i], a['Cartn_z'][i]], dtype=float); t.el = a['type_symbol'][i].capitalize()
            alt = a.get('label_alt_id'); t.alt = alt[i] if alt is not None else ''
            atoms.append(t)
        if 'struct_conf' in c:
            s = c['struct_conf']
            for i in range(len(s['beg_auth_seq_id'])): helix.append((s['beg_auth_asym_id'][i], int(s['beg_auth_seq_id'][i]), int(s['end_auth_seq_id'][i])))
        if 'struct_sheet_range' in c:
            s = c['struct_sheet_range']
            for i in range(len(s['beg_auth_seq_id'])): sheet.append((s['beg_auth_asym_id'][i], int(s['beg_auth_seq_id'][i]), int(s['end_auth_seq_id'][i])))
        return atoms, helix, sheet
    op = gzip.open if path.endswith('.gz') else open
    for L in op(path, 'rt', errors='replace'):
        r = L[:6]
        if r in ('ATOM  ', 'HETATM'):
            t = Atom(); t.rec = r.strip(); t.name = L[12:16].strip(); t.alt = L[16].strip(); t.res = L[17:21].strip(); t.chain = L[21].strip() or (L[72:76].strip() or 'A')
            t.seq = int(L[22:26]); t.icode = L[26].strip(); t.x = np.array([float(L[30:38]), float(L[38:46]), float(L[46:54])])
            el = L[76:78].strip()
            if not el: el = ''.join(ch for ch in t.name if ch.isalpha())[:1]
            t.el = el.capitalize(); atoms.append(t)
        elif r == 'HELIX ': helix.append((L[19].strip(), int(L[21:25]), int(L[33:37])))
        elif r == 'SHEET ': sheet.append((L[21].strip(), int(L[22:26]), int(L[33:37])))
        elif r in ('ENDMDL',): break
    return atoms, helix, sheet

def residues(atoms):
    out, key = [], None
    for a in atoms:
        if a.alt not in ('', 'A', '1'): continue
        k = (a.chain, a.seq, a.icode, a.res)
        if k != key: out.append({'chain': a.chain, 'seq': a.seq, 'res': a.res, 'rec': a.rec, 'atoms': {}}); key = k
        out[-1]['atoms'].setdefault(a.name, a)
    return out

# ---------------- упрощённый DSSP ----------------
def dssp(chain):
    n = len(chain); ss = ['C'] * n
    N = []; CA = []; C = []; O = []
    for r in chain:
        A = r['atoms']; N.append(A['N'].x if 'N' in A else None); CA.append(A['CA'].x); C.append(A['C'].x if 'C' in A else None); O.append(A['O'].x if 'O' in A else (A['OT1'].x if 'OT1' in A else None))
    H = [None] * n
    for i in range(1, n):
        if N[i] is None or C[i - 1] is None or O[i - 1] is None: continue
        d = C[i - 1] - O[i - 1]; H[i] = N[i] + d / np.linalg.norm(d)
    def hb(i, j):  # CO(i) → NH(j)
        if i < 0 or j < 0 or i >= n or j >= n or abs(i - j) < 3 or H[j] is None or O[i] is None or C[i] is None: return False
        rON = np.linalg.norm(O[i] - N[j]); rCH = np.linalg.norm(C[i] - H[j]); rOH = np.linalg.norm(O[i] - H[j]); rCN = np.linalg.norm(C[i] - N[j])
        if rON > 5.5: return False
        e = 0.084 * 332 * (1 / rON + 1 / rCH - 1 / rOH - 1 / rCN)
        return e < -0.5
    caa = np.array(CA)
    near = [np.where(np.linalg.norm(caa - caa[i], axis=1) < 9)[0] for i in range(n)]
    HB = {}
    for i in range(n):
        for j in near[i]:
            if hb(i, j): HB[(i, j)] = True
    t4 = [HB.get((i, i + 4), False) for i in range(n)]
    for i in range(1, n - 4):
        if t4[i - 1] and t4[i]:
            for k in range(i, i + 4): ss[k] = 'H'
    br = [False] * n
    for i in range(1, n - 1):
        for j in near[i]:
            if abs(i - j) < 3 or j < 1 or j >= n - 1: continue
            par = (HB.get((i - 1, j)) and HB.get((j, i + 1))) or (HB.get((j - 1, i)) and HB.get((i, j + 1)))
            anti = (HB.get((i, j)) and HB.get((j, i))) or (HB.get((i - 1, j + 1)) and HB.get((j - 1, i + 1)))
            if par or anti: br[i] = True
    for i in range(n):
        if br[i] and ss[i] != 'H' and ((i > 0 and br[i - 1]) or (i < n - 1 and br[i + 1])): ss[i] = 'E'
    return ''.join(ss)

# ---------------- упаковка ----------------
Q = 20.0  # 0.05 Å
def b64i16(arr): return base64.b64encode(np.round(np.asarray(arr, dtype=float) * Q).astype('<i2').tobytes()).decode()
def b64i8(arr): return base64.b64encode(np.clip(np.round(np.asarray(arr, dtype=float) * 100), -127, 127).astype('<i1').tobytes()).decode()
def b64u16(arr): return base64.b64encode(np.asarray(arr, dtype='<u2').tobytes()).decode()
COV = dict(H=0.31, C=0.76, N=0.71, O=0.66, S=1.05, P=1.07, Fe=1.32, Mg=1.41, Zn=1.22, Cu=1.32, Ca=1.76, Co=1.26, I=1.39, Cl=1.02, F=0.57, Se=1.2, Mn=1.39, Na=1.66, K=2.03)
def bonds_by_dist(el, xyz, extra=0.45):
    b = []; n = len(el)
    for i in range(n):
        for j in range(i + 1, n):
            d = np.linalg.norm(xyz[i] - xyz[j]); m = COV.get(el[i], 0.8) + COV.get(el[j], 0.8) + extra
            if 0.4 < d < m: b += [i, j]
    return b
def atomset(atomlist, center):
    el = [a.el for a in atomlist]; xyz = np.array([a.x for a in atomlist]) - center
    return {'el': ' '.join(el), 'xyz': b64i16(xyz.ravel()), 'b': b64u16(bonds_by_dist(el, xyz + center))}

def prep(path, keep_chains=None, ligs=(), res_full=(), seq_max=None, nuc_full=False, drop_res=lambda r: False, title=''):
    atoms, helix, sheet = read_structure(path)
    if keep_chains: atoms = [a for a in atoms if a.chain in keep_chains]
    res = [r for r in residues(atoms) if not drop_res(r)]
    allx = np.array([a.x for r in res for a in r['atoms'].values() if (r['res'] in AA or r['res'] in NUC)])
    center = allx.mean(axis=0)
    chains, out_ligs, full = [], [], []
    for cid in dict.fromkeys(r['chain'] for r in res):
        pr = [r for r in res if r['chain'] == cid and r['res'] in AA and 'CA' in r['atoms']]
        nr = [r for r in res if r['chain'] == cid and r['res'] in NUC and 'P' in r['atoms'] or (r['chain'] == cid and r['res'] in NUC and "C4'" in r['atoms'])]
        if len(pr) >= 4:
            if helix or sheet:
                ss = []
                for r in pr:
                    s = 'C'
                    if any(c == cid and a <= r['seq'] <= b for c, a, b in helix): s = 'H'
                    elif any(c == cid and a <= r['seq'] <= b for c, a, b in sheet): s = 'E'
                    ss.append(s)
                ss = ''.join(ss)
            else: ss = dssp(pr)
            ca = np.array([r['atoms']['CA'].x for r in pr]) - center
            od = []
            for r in pr:
                A = r['atoms']; o = A.get('O') or A.get('OT1'); c = A.get('C')
                v = (o.x - c.x) if (o and c) else np.array([0, 0, 1.0]); v = v / (np.linalg.norm(v) or 1); od.append(v)
            # разрывы цепи
            brk = [i for i in range(1, len(pr)) if np.linalg.norm(ca[i] - ca[i - 1]) > 4.3]
            chains.append({'id': cid, 'k': 'p', 'seq': ''.join(AA[r['res']] for r in pr), 'num': pr[0]['seq'], 'ss': ss, 'ca': b64i16(ca.ravel()), 'o': b64i8(np.array(od).ravel()), 'brk': brk})
        if len(nr) >= 2:
            pts, bd = [], []
            for r in nr:
                A = r['atoms']; p = (A.get('P') or A.get("C4'")).x; pts.append(p)
                c1 = A.get("C1'"); b = A.get('N1') if r['res'] in ('DC', 'DT', 'C', 'U', 'T', 'DC5', 'DC3', 'DT5', 'DT3', 'CYT', 'THY', 'URA') else A.get('N3') or A.get('N1')
                v = (b.x - p) if b is not None else np.array([0, 0, 1.0]); bd.append(v)
            entry = {'id': cid, 'k': 'n', 'seq': ''.join(NUC[r['res']] for r in nr), 'p': b64i16((np.array(pts) - center).ravel()), 'bd': b64i16(np.array(bd).ravel())}
            if nuc_full:
                al = [a for r in nr for a in r['atoms'].values() if a.el != 'H']
                entry['full'] = atomset(al, center)
                entry['full']['ri'] = base64.b64encode(np.array([k for k, r in enumerate(nr) for a in r['atoms'].values() if a.el != 'H'], dtype='<u1').tobytes()).decode()
                entry['full']['an'] = ' '.join(a.name for a in al)
            chains.append(entry)
    for r in res:
        if r['res'] in ligs:
            al = [a for a in r['atoms'].values() if a.el != 'H']
            d = atomset(al, center); d['name'] = r['res']; d['chain'] = r['chain']; d['seq'] = r['seq']; out_ligs.append(d)
        if (r['chain'], r['seq']) in res_full or r['seq'] in res_full and isinstance(res_full, set):
            al = [a for a in r['atoms'].values() if a.el != 'H']
            d = atomset(al, center); d['name'] = r['res'] + str(r['seq']); d['chain'] = r['chain']; full.append(d)
    rad = float(np.max(np.linalg.norm(allx - center, axis=1)))
    return {'title': title, 'r': round(rad, 1), 'chains': chains, 'ligs': out_ligs, 'res': full}


def lipids(path, maxn=None, keep_h=False, title=''):
    atoms, _, _ = read_structure(path)
    res = [r for r in residues(atoms) if 'P' in r['atoms'] and ('C218' in r['atoms'] or 'C216' in r['atoms'] or 'C316' in r['atoms'])]
    if maxn: res = res[:maxn]
    names = [n for n in res[0]['atoms'] if keep_h or res[0]['atoms'][n].el != 'H']
    xyz = np.array([[r['atoms'][n].x for n in names] for r in res])
    center = xyz.reshape(-1, 3).mean(axis=0)
    el = [res[0]['atoms'][n].el for n in names]
    b = bonds_by_dist(el, xyz[0])
    return {'title': title, 'n': len(res), 'names': ' '.join(names), 'el': ' '.join(el), 'b': b64u16(b), 'xyz': b64i16((xyz - center).ravel()), 'center': center.round(2).tolist()}

if __name__ == '__main__':
    import os
    S = sys.argv[1]
    out = {}
    def add(key, *a, **k):
        d = prep(*a, **k); out[key] = d
        info = ', '.join(f"{c['id']}:{c['k']}{len(c['seq'])}" + (f"[H{c['ss'].count('H')} E{c['ss'].count('E')}]" if c['k'] == 'p' else '') for c in d['chains'])
        print(key, 'r=', d['r'], info[:260], 'ligs:', [l['name'] for l in d['ligs']][:10], 'res:', [x['name'] for x in d['res']][:10])
    P = lambda *p: os.path.join(S, *p)
    add('hb', P('3dmol_3Dmol.js/tests/auto/data/4hhb.bcif.gz'), ligs=('HEM',), res_full={('A', 87), ('B', 92), ('C', 87), ('D', 92), ('A', 58), ('B', 63)}, title='Гемоглобин 4HHB')
    add('adko', P('MDAnalysis_mdanalysis/testsuite/MDAnalysisTests/data/adk_open.pdb'), title='Аденилаткиназа, открытая 4AKE')
    add('adkc', P('MDAnalysis_mdanalysis/testsuite/MDAnalysisTests/data/adk_closed.pdb'), title='Аденилаткиназа, закрытая 1AKE')
    add('lyz', P('biotite-dev_biotite/tests/structure/data/pdb/1aki.pdb'), res_full={('A', 35), ('A', 52), ('A', 62), ('A', 63), ('A', 101), ('A', 108)}, title='Лизоцим 1AKI')
    add('hiv', P('schrodinger_pymol-open-source/data/tut/1hpv.pdb'), ligs=('478',), res_full={('A', 25), ('B', 25)}, title='Протеаза ВИЧ + ампренавир 1HPV')
    add('dhfr', P('schrodinger_pymol-open-source/testing/data/1rx1.pdb'), ligs=('NAP',), title='Дигидрофолатредуктаза + НАДФН 1RX1')
    add('pbp', P('prody_ProDy/prody/tests/datafiles/1pwc.pdb'), ligs=('PNM',), title='DD-транспептидаза + пенициллин 1PWC')
    add('src', P('nglviewer_ngl/data/2src.pdb'), ligs=('ANP',), res_full={('A', 527)}, title='Тирозинкиназа Src + АМФ-PNP 2SRC')
    add('gpcr', P('nglviewer_ngl/data/3sn6.pdb'), keep_chains=('A', 'B', 'G', 'R'), ligs=('P0G',), drop_res=lambda r: r['chain'] == 'R' and r['seq'] >= 900, title='β2-адренорецептор + Gs 3SN6')
    add('rho', P('nglviewer_ngl/data/1u19.pdb'), keep_chains=('A',), ligs=('RET',), title='Родопсин + ретиналь 1U19')
    add('groel', P('schrodinger_pymol-open-source/'+[l for l in open(P('../pdbsrc/schrodinger_pymol-open-source.list')).read().split() if l.endswith('1aon.pdb.gz')][0]), ligs=('ADP',), title='Шаперонин GroEL/GroES 1AON')
    add('bna', P('biotite-dev_biotite/tests/structure/data/base_pairs/1bna.pdb'), nuc_full=True, title='B-ДНК 1BNA')
    add('gal4', P('nglviewer_ngl/data/1d66.pdb'), nuc_full=True, title='GAL4 на ДНК 1D66')
    add('ribo', P('nglviewer_ngl/data/1jj2.pdb'), title='Большая субъединица рибосомы 1JJ2')
    add('apoa', P('openmm_openmm/examples/benchmarks/apoa1.pdb'), drop_res=lambda r: 'P' in r['atoms'] and r['res'] not in NUC, title='Аполипопротеин A-I (ЛПВП-диск)')
    add('eno', P('prody_ProDy/prody/tests/datafiles/pdb3enl.pdb'), title='Енолаза 3ENL')
    add('fxa', P('schrodinger_pymol-open-source/'+[l for l in open(P('../pdbsrc/schrodinger_pymol-open-source.list')).read().split() if l.endswith('1iqj.pdb')][0]), ligs=('XMH',), title='Фактор Xa + ингибитор 1IQJ')
    add('fdx', P('nglviewer_ngl/data/1blu.pdb'), ligs=('SF4',), title='Ферредоксин 1BLU')
    add('mtase', P('prody_ProDy/prody/tests/datafiles/pdb3mht.pdb'), ligs=('SAH',), nuc_full=True, title='ДНК-метилтрансфераза HhaI 3MHT')
    add('hbo', P('3dmol_3Dmol.js/tests/test_structs/1gzx.pdb'), keep_chains=('A',), ligs=('HEM', 'OXY'), res_full={('A', 87), ('A', 58)}, title='Оксигемоглобин 1GZX, α-цепь')
    add('igg', P('biotite-dev_biotite/tests/structure/data/pdb/1igy.pdb'), title='Антитело IgG1 1IGY')
    out['popc'] = lipids(P('openmm_openmm/wrappers/python/openmm/app/data/POPC.pdb'), title='Бислой POPC')
    out['apol'] = lipids(P('openmm_openmm/examples/benchmarks/apoa1.pdb'), title='Липиды ЛПВП-диска')
    for k in ('popc', 'apol'): print(k, out[k]['n'], 'lipids', len(out[k]['el'].split()), 'atoms each')
    json.dump(out, open(sys.argv[2], 'w'), separators=(',', ':'))
    for k, v in out.items(): print(k, len(json.dumps(v, separators=(',', ':'))))
    print('bytes', os.path.getsize(sys.argv[2]))
