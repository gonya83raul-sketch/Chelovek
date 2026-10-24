import numpy as np
from PIL import Image, ImageFilter
def icon(S, maskable=False):
    y, x = np.mgrid[0:S, 0:S].astype(np.float32) / S - 0.5
    r = np.hypot(x, y)
    k = 0.95 if maskable else 1.0                     # безопасная зона для maskable
    bg = np.array([8, 7, 10], np.float32)
    img = np.zeros((S, S, 3), np.float32) + bg
    # мягкое тёплое сияние
    glow = np.exp(-(r / (0.30 * k)) ** 2)[..., None] * np.array([255, 150, 80]) * 0.55
    img += glow
    # «клетка»: светящееся кольцо-мембрана
    ring = np.exp(-((r - 0.26 * k) / (0.018 * k)) ** 2)[..., None] * np.array([255, 196, 140])
    img += ring * 0.95
    # ядро, смещённое вверх-влево, и ядрышко
    rn = np.hypot(x + 0.05 * k, y + 0.04 * k)
    img += np.exp(-(rn / (0.105 * k)) ** 4)[..., None] * np.array([200, 120, 255]) * 0.75
    rn2 = np.hypot(x + 0.075 * k, y + 0.065 * k)
    img += np.exp(-(rn2 / (0.03 * k)) ** 2)[..., None] * np.array([255, 230, 255]) * 0.9
    # несколько «органелл»
    rng = np.random.default_rng(3)
    for _ in range(9):
        a = rng.uniform(0, 6.283); d = rng.uniform(0.13, 0.21) * k
        cx, cy = np.cos(a) * d, np.sin(a) * d
        rr = np.hypot(x - cx, y - cy)
        col = [np.array([255, 120, 90]), np.array([120, 210, 255]), np.array([140, 230, 160])][_ % 3]
        img += np.exp(-(rr / (0.022 * k)) ** 2)[..., None] * col * 0.7
    img = np.clip(img, 0, 255).astype(np.uint8)
    im = Image.fromarray(img, 'RGB')
    if not maskable:   # обычная иконка: скруглённый квадрат
        m = Image.new('L', (S * 4, S * 4), 0)
        from PIL import ImageDraw
        ImageDraw.Draw(m).rounded_rectangle([0, 0, S * 4 - 1, S * 4 - 1], radius=int(S * 4 * 0.22), fill=255)
        m = m.resize((S, S), Image.LANCZOS)
        im = im.convert('RGBA'); im.putalpha(m)
    return im
icon(512).save('pwa/icons/icon-512.png'); icon(192).save('pwa/icons/icon-192.png')
icon(512, True).save('pwa/icons/maskable-512.png'); icon(192, True).save('pwa/icons/maskable-192.png')
icon(180, True).save('pwa/icons/apple-180.png'); icon(64).resize((32, 32), Image.LANCZOS).save('pwa/icons/favicon-32.png')
print('ok')
