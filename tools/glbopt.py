#!/usr/bin/env python3
"""Ужимает GLB без внешних декодеров: нормали/касательные → int8, UV → uint16 (KHR_mesh_quantization),
индексы → uint16, текстуры JPEG пережимаются. python3 tools/glbopt.py in.glb out.glb [jpegQ] [maxTex]"""
import io, json, struct, sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 82
MAXT = int(sys.argv[4]) if len(sys.argv) > 4 else 4096
d = open(src, 'rb').read()
jl = struct.unpack('<I', d[12:16])[0]
J = json.loads(d[20:20 + jl])
bo = 20 + jl + 8
BIN = d[bo:bo + struct.unpack('<I', d[20 + jl:24 + jl])[0]]
CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}

def read_acc(a):
    bv = J['bufferViews'][a['bufferView']]
    dt = np.dtype(CT[a['componentType']]); n = NC[a['type']]
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride', dt.itemsize * n)
    raw = np.frombuffer(BIN, dtype=np.uint8, count=stride * (a['count'] - 1) + dt.itemsize * n, offset=off)
    out = np.empty((a['count'], n), dt)
    for i in range(n):
        out[:, i] = np.ndarray((a['count'],), dt, raw.data, i * dt.itemsize, (stride,))
    return out

usage = {}
for m in J['meshes']:
    for p in m['primitives']:
        assert 'targets' not in p
        for k, ai in p['attributes'].items(): usage.setdefault(ai, set()).add(k)
        if 'indices' in p: usage.setdefault(p['indices'], set()).add('IDX')
for a in J['accessors']: assert 'sparse' not in a and 'bufferView' in a

out = bytearray(); views = []
def add_view(b, stride=None, target=None):
    while len(out) % 4: out.append(0)
    v = {'buffer': 0, 'byteOffset': len(out), 'byteLength': len(b)}
    if stride: v['byteStride'] = stride
    if target: v['target'] = target
    out.extend(b); views.append(v); return len(views) - 1

stat = {}
for ai, a in enumerate(J['accessors']):
    u = usage.get(ai, set()); arr = read_acc(a); kind = 'keep'
    if a['componentType'] == 5126 and u and u <= {'NORMAL'} and a['type'] == 'VEC3':
        q = np.clip(np.round(arr * 127), -127, 127).astype(np.int8)
        b = np.zeros((a['count'], 4), np.int8); b[:, :3] = q
        a.update(componentType=5120, normalized=True); a.pop('min', None); a.pop('max', None)
        a['bufferView'] = add_view(b.tobytes(), 4, 34962); kind = 'normal'
    elif a['componentType'] == 5126 and u and u <= {'TANGENT'} and a['type'] == 'VEC4':
        q = np.clip(np.round(arr * 127), -127, 127).astype(np.int8)
        a.update(componentType=5120, normalized=True); a.pop('min', None); a.pop('max', None)
        a['bufferView'] = add_view(q.tobytes(), 4, 34962); kind = 'tangent'
    elif a['componentType'] == 5126 and u and all(x.startswith('TEXCOORD') for x in u) and arr.min() >= 0 and arr.max() <= 1:
        q = np.round(arr * 65535).astype(np.uint16)
        a.update(componentType=5123, normalized=True); a.pop('min', None); a.pop('max', None)
        a['bufferView'] = add_view(q.tobytes(), 4, 34962); kind = 'uv'
    elif u == {'IDX'} and a['componentType'] == 5125 and arr.max() < 65535:
        a['componentType'] = 5123; a.pop('min', None); a.pop('max', None)
        a['bufferView'] = add_view(arr.astype(np.uint16).tobytes(), None, 34963); kind = 'idx16'
    else:
        tgt = 34963 if u == {'IDX'} else (34962 if u else None)
        nb = arr.tobytes(); st = arr.dtype.itemsize * arr.shape[1]
        a['bufferView'] = add_view(nb, st if (u and u != {'IDX'} and st % 4 == 0 and a['type'] != 'SCALAR') else None, tgt)
    a.pop('byteOffset', None)
    stat[kind] = stat.get(kind, 0) + 1

for im in J.get('images', []):
    bv = J['bufferViews'][im['bufferView']]; o = bv.get('byteOffset', 0)
    b = BIN[o:o + bv['byteLength']]
    img = Image.open(io.BytesIO(b)); nb = b
    if img.mode in ('RGB', 'L') or (img.mode == 'RGBA' and img.getextrema()[3][0] == 255):
        im2 = img.convert('RGB')
        if max(im2.size) > MAXT: im2 = im2.resize((im2.size[0] * MAXT // max(im2.size), im2.size[1] * MAXT // max(im2.size)), Image.LANCZOS)
        bio = io.BytesIO(); im2.save(bio, 'JPEG', quality=Q, optimize=True, progressive=True)
        if len(bio.getvalue()) < len(b) or max(img.size) > MAXT: nb = bio.getvalue(); im['mimeType'] = 'image/jpeg'
    im['bufferView'] = add_view(nb)

J['bufferViews'] = views
J['buffers'] = [{'byteLength': len(out)}]
for k in ('extensionsUsed', 'extensionsRequired'):
    s = set(J.get(k, [])); s.add('KHR_mesh_quantization'); J[k] = sorted(s)
js = json.dumps(J, separators=(',', ':')).encode()
js += b' ' * ((4 - len(js) % 4) % 4)
while len(out) % 4: out.append(0)
glb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(out)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(out), 0x004E4942) + bytes(out)
open(dst, 'wb').write(glb)
print(src, len(d), '->', len(glb), stat)
