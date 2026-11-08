#!/bin/bash
# снимки сцены menin для рецензии: bash tools/mnshots.sh <name> → review/shots/<name>/ (≈ 25 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='l_all l_scalp l_bone l_dura l_arach l_pia l_sss b_epi b_sub b_sah s_all s_sss s_iss s_tr s_cav s_pet e1 e2 e3'
for n in $L p1 p2 p3 p4; do rm -f lt/$n.png; done
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python3 tools/snap.py menin $S sleep:9 shot:l_all "${CL/X/Скальп}" sleep:3 shot:l_scalp "${CL/X/Кость}" sleep:3 shot:l_bone "${CL/X/Твёрдая}" sleep:3 shot:l_dura "${CL/X/Паутинная}" sleep:3 shot:l_arach "${CL/X/Мягкая}" sleep:3 shot:l_pia "${CL/X/Синус}" sleep:3 shot:l_sss >/dev/null 2>&1
python3 tools/snap.py menin $S key:2 sleep:9 shot:b_epi "${CL/X/Субдуральная}" sleep:5 shot:b_sub "${CL/X/Субарахноидальная}" sleep:5 shot:b_sah >/dev/null 2>&1
python3 tools/snap.py menin $S key:3 sleep:9 shot:s_all "${CL/X/Верхний сагиттальный}" sleep:3 shot:s_sss "${CL/X/Прямой и нижний}" sleep:3 shot:s_iss "${CL/X/Поперечный и сигмовидный}" sleep:3 shot:s_tr "${CL/X/Пещеристый}" sleep:5 shot:s_cav "${CL/X/Каменистые}" sleep:5 shot:s_pet >/dev/null 2>&1
python3 tools/snap.py menin size:390x844 sleep:9 shot:p1 key:2 sleep:7 shot:p2 key:3 sleep:7 shot:p3 "${CL/X/Пещеристый}" sleep:6 shot:p4 >/dev/null 2>&1
python3 tools/snap.py menin $S lang:en sleep:9 shot:e1 key:2 sleep:7 shot:e2 key:3 sleep:6 "${CL/X/Cavernous}" sleep:5 shot:e3 >/dev/null 2>&1
python - "$D" "$L" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in sys.argv[2].split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3,4)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
