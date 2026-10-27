#!/usr/bin/env python3
"""3D-модели сайта: исходники models-src/<имя>.glb или <имя>.txt (base64 от gzip, старый формат) → out/models/<имя>.bin (gzip).
Исходники в git не входят (большие): папка models-src/ в .gitignore; их копия — старые models/*.txt в истории ветки main (до app17).
Для GLB: текстуры JPEG/PNG → WebP (EXT_texture_webp), геометрия → Draco (tools/glbdraco.mjs). Имена узлов и мешей не меняются.
Скелет и мышцы — свой двоичный формат, они только перепаковываются без base64.
  python3 tools/models.py [имя ...]      (по умолчанию все пять)
"""
import base64, gzip, io, json, os, struct, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD = os.path.join(ROOT, 'out', 'models'); SRC = os.path.join(ROOT, 'models-src'); os.makedirs(MD, exist_ok=True)
NAMES = sys.argv[1:] or ['skeleton', 'muscles', 'vision', 'digest', 'repro']

def read_glb(d):
    jl = struct.unpack('<I', d[12:16])[0]
    J = json.loads(d[20:20 + jl])
    bo = 20 + jl
    return J, d[bo + 8:bo + 8 + struct.unpack('<I', d[bo:bo + 4])[0]]

def write_glb(J, views):   # views: список bytes по порядку bufferViews
    out, off = bytearray(), 0
    for i, b in enumerate(views):
        pad = (-len(out)) % 4; out += b'\0' * pad
        J['bufferViews'][i]['byteOffset'] = len(out); J['bufferViews'][i]['byteLength'] = len(b); out += b
    out += b'\0' * ((-len(out)) % 4)
    J['buffers'] = [{'byteLength': len(out)}]
    js = json.dumps(J, ensure_ascii=False, separators=(',', ':')).encode('utf8'); js += b' ' * ((-len(js)) % 4)
    total = 12 + 8 + len(js) + 8 + len(out)
    return b'glTF' + struct.pack('<II', 2, total) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(out)) + b'BIN\0' + bytes(out)

def to_webp(J, BIN):
    views = [BIN[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']] for bv in J['bufferViews']]
    conv, b0, b1 = set(), 0, 0
    # карты нормалей и шероховатости — почти без потерь (ошибка в них заметнее, чем в цвете)
    tex_img = {ti: t.get('source') for ti, t in enumerate(J.get('textures', []))}
    data_img = set()
    for m in J.get('materials', []):
        for k in ('normalTexture', 'occlusionTexture'):
            if k in m: data_img.add(tex_img.get(m[k]['index']))
        pbr = m.get('pbrMetallicRoughness', {})
        if 'metallicRoughnessTexture' in pbr: data_img.add(tex_img.get(pbr['metallicRoughnessTexture']['index']))
    for ii, im in enumerate(J.get('images', [])):
        if 'bufferView' not in im: continue
        raw = views[im['bufferView']]; img = Image.open(io.BytesIO(raw)); img.load()
        alpha = img.mode in ('RGBA', 'LA', 'PA') or (img.mode == 'P' and 'transparency' in img.info)
        img = img.convert('RGBA' if alpha else 'RGB')
        o = io.BytesIO(); img.save(o, 'WEBP', quality=95 if ii in data_img else 88 if im.get('mimeType') == 'image/png' else 82, method=6)
        w = o.getvalue(); b0 += len(raw)
        if len(w) < len(raw) * 0.92:
            views[im['bufferView']] = w; im['mimeType'] = 'image/webp'; conv.add(ii); b1 += len(w)
        else: b1 += len(raw)
    for t in J.get('textures', []):
        src = t.get('source')
        if src in conv:
            del t['source']; t.setdefault('extensions', {})['EXT_texture_webp'] = {'source': src}
    if conv:
        for k in ('extensionsUsed', 'extensionsRequired'):
            J.setdefault(k, []); 'EXT_texture_webp' in J[k] or J[k].append('EXT_texture_webp')
    print(f'  текстуры: {b0 / 1048576:.2f} → {b1 / 1048576:.2f} МБ ({len(conv)} в WebP)')
    return write_glb(J, views)

for n in NAMES:
    txt, glbp = os.path.join(SRC, n + '.txt'), os.path.join(SRC, n + '.glb')
    if os.path.exists(glbp): d = open(glbp, 'rb').read()
    elif os.path.exists(txt): d = gzip.decompress(base64.b64decode(open(txt).read().strip()))
    else: print('нет', n); continue
    print(n, f'{len(d) / 1048576:.2f} МБ')
    if d[:4] == b'glTF':
        J, BIN = read_glb(d)
        if 'KHR_draco_mesh_compression' not in J.get('extensionsUsed', []):
            d = to_webp(J, BIN)
            with tempfile.TemporaryDirectory() as td:
                a, b = os.path.join(td, 'a.glb'), os.path.join(td, 'b.glb')
                open(a, 'wb').write(d)
                r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'glbdraco.mjs'), a, b, '14'], capture_output=True, text=True)
                print('  ' + (r.stdout.strip() or r.stderr.strip()[:500]))
                if r.returncode: sys.exit(1)
                d = open(b, 'rb').read()
    g = gzip.compress(d, 9, mtime=0)
    open(os.path.join(MD, n + '.bin'), 'wb').write(g)
    print(f'  → {n}.bin {len(g) / 1048576:.2f} МБ')
