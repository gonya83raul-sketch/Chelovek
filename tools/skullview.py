"""Рендер скана головы из модели скелета с сеткой в см (система координат сцен nose/face: начало — точка скана (0.11, 16.0, 0.6), 1 ед. скана = 12,5 см; y вверх, z вперёд, x — влево от человека).
Красным — нижняя челюсть (правила cls из body/16_skull.js). Запуск: python tools/skullview.py <папка> → lat.png (справа), front.png, bottom.png."""
import gzip, struct, os
import numpy as np, sys
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = open(os.path.join(ROOT, 'out', 'models', 'skeleton.bin'), 'rb').read()
try:
    buf = gzip.decompress(raw)
except Exception:
    buf = raw
n = struct.unpack_from('<I', buf, 0)[0]; o = 4
for i in range(n):
    nv, ni = struct.unpack_from('<II', buf, o + 4); o += 12
    q = np.frombuffer(buf, '<i2', nv * 3, o).reshape(-1, 3) / 1000; o += nv * 6; o += (4 - (nv * 6) % 4) % 4
    o += nv; o += (4 - nv % 4) % 4
    ix = np.frombuffer(buf, '<u4', ni, o).reshape(-1, 3); o += ni * 4
    if q[:, 1].max() > 17:
        P0, IX = q, ix
out = sys.argv[1] if len(sys.argv) > 1 else '.'
os.makedirs(out, exist_ok=True)
MX = 0.11
P = np.stack([(P0[:, 0] - MX) * 12.5, (P0[:, 1] - 16.0) * 12.5, (P0[:, 2] - 0.6) * 12.5], 1)
x, y, z = P0[:, 0] - MX, P0[:, 1], P0[:, 2]; ax = np.abs(x)
occl = 15.535 + 0.05 * np.clip((0.9 - z) / 0.5, 0, 1)
mand = ((z > 0.15) & (y < occl) & (ax < 0.62)) | ((ax > 0.36) & (ax < 0.6) & (z > 0.13) & (z < 0.5) & (y < np.where(z < 0.3, 15.98, 15.93)))
tri = IX[(P[IX, 1].min(1) > -12)]
def render(name, R, rng_u, rng_v, s=30):
    # R: 3x3 rows = screen u, screen v, depth (toward viewer positive)
    Q = P @ R.T
    (u0, u1), (v0, v1) = rng_u, rng_v
    W = int((u1 - u0) * s); H = int((v1 - v0) * s)
    im = Image.new('RGB', (W, H), 'white'); dr = ImageDraw.Draw(im)
    A, B, C = Q[tri[:, 0]], Q[tri[:, 1]], Q[tri[:, 2]]
    n = np.cross(B - A, C - A); nl = np.linalg.norm(n, axis=1) + 1e-9; n /= nl[:, None]
    dep = (A[:, 2] + B[:, 2] + C[:, 2]) / 3
    order = np.argsort(dep)
    L = np.array([0.3, 0.5, 0.8]); L /= np.linalg.norm(L)
    for i in order:
        if n[i, 2] <= 0: continue
        sh = 0.35 + 0.65 * max(0, n[i] @ L)
        m = mand[tri[i]].all()
        col = (int(255 * sh), int(170 * sh), int(170 * sh)) if m else (int(235 * sh), int(225 * sh), int(205 * sh))
        pts = [((q[0] - u0) * s, H - (q[1] - v0) * s) for q in (A[i], B[i], C[i])]
        dr.polygon(pts, fill=col)
    for g in range(int(np.ceil(u0)), int(u1) + 1):
        px = (g - u0) * s; dr.line([(px, 0), (px, H)], fill=(80, 80, 255) if g % 5 == 0 else (170, 170, 255)); dr.text((px + 1, 1), str(g), fill='blue')
    for g in range(int(np.ceil(v0)), int(v1) + 1):
        py = H - (g - v0) * s; dr.line([(0, py), (W, py)], fill=(80, 80, 255) if g % 5 == 0 else (170, 170, 255)); dr.text((1, py + 1), str(g), fill='blue')
    im.save(out + '/' + name + '.png')
# right lateral: viewer at -X. screen u = Z (face to the right), v = Y, depth = -X
render('lat', np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]]), (-11, 8), (-11, 11))
# front: viewer at +Z; screen u = X (person's left to the right), v = Y, depth = Z
render('front', np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), (-9, 9), (-11, 11))
# bottom: viewer at -Y looking up; u = X, v = Z, depth = -Y
render('bottom', np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]]), (-9, 9), (-11, 8))
print('ok')
