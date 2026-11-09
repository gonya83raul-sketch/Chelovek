#!/bin/bash
# снимки сцены hgang для рецензии: bash tools/hgshots.sh <name> → review/shots/<name>/
cd ~/work/Chelovek; export PATH=/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='g_all g_cil g_ptp g_smd g_otic g_sym r_light r_light2 r_food r_fear d_cn3 d_croc d_frey e1 e2'
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python tools/snap.py hgang $S sleep:9 shot:g_all "${CL/X/Ресничный}" sleep:4 shot:g_cil "${CL/X/Крылонёбный}" sleep:4 shot:g_ptp "${CL/X/Поднижнечелюстной}" sleep:4 shot:g_smd "${CL/X/Ушной}" sleep:4 shot:g_otic "${CL/X/Все}" "${CL/X/Симпатика}" sleep:4 shot:g_sym >/dev/null 2>&1
python tools/snap.py hgang $S key:2 sleep:6 shot:r_light sleep:3 shot:r_light2 "${CL/X/Еда}" sleep:6 shot:r_food "${CL/X/Испуг}" sleep:6 shot:r_fear >/dev/null 2>&1
python tools/snap.py hgang $S key:3 sleep:7 shot:d_cn3 "${CL/X/Крокодиловы слёзы}" sleep:6 shot:d_croc "${CL/X/Синдром Фрея}" sleep:6 shot:d_frey >/dev/null 2>&1
python tools/snap.py hgang size:390x844 sleep:9 shot:p1 key:2 sleep:6 shot:p2 key:3 sleep:7 shot:p3 >/dev/null 2>&1
python tools/snap.py hgang $S lang:en sleep:9 shot:e1 key:2 sleep:8 shot:e2 >/dev/null 2>&1
python - "$D" "$L" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in sys.argv[2].split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
