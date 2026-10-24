import sys
from PIL import Image
# python3 tools/shots.py out.png a.png b.png ... (кадры 2 в ряд)
import os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/lt/'
fs = sys.argv[2:]; W = 720; H = 405
ims = [Image.open(R + f).crop((0, 150, 1440, 960)).resize((W, H)) for f in fs]
rows = (len(ims) + 1) // 2
out = Image.new('RGB', (W * 2 if len(ims) > 1 else W, H * rows))
for k, i in enumerate(ims): out.paste(i, ((k % 2) * W, (k // 2) * H))
out.save(R + sys.argv[1])
