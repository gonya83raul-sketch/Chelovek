"""контактные листы снимков: python tools/sheet.py <папка> → <папка>/_sheetN.png (по 6 кадров, верх холста 1400×860)"""
import sys, os
from PIL import Image
D = sys.argv[1]; fs = sorted(f for f in os.listdir(D) if f.endswith('.png') and not f.startswith('_') and f != 'mob.png')
for k in range(0, len(fs), 6):
    o = Image.new('RGB', (2 * 700, 3 * 430), (20, 20, 20))
    for i, f in enumerate(fs[k:k + 6]):
        im = Image.open(os.path.join(D, f)).crop((316, 94, 1360, 822)).resize((700, 488))
        o.paste(im.crop((0, 0, 700, 430)), ((i % 2) * 700, (i // 2) * 430))
    o.save(os.path.join(D, f'_sheet{k // 6}.png')); print(k // 6, fs[k:k + 6])
