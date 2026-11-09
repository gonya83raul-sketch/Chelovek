#!/bin/bash
# снимки сцены cranial для рецензии: bash tools/cnshots.sh <name> → review/shots/<name>/ (запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='b_all b_vii f_all f_I f_II f_III f_V f_VI f_VII f_IX f_XI f_XII f_mot e1 e2'
for n in $L p1 p2 p3; do rm -f lt/$n.png; done
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python3 tools/snap.py cranial $S sleep:9 shot:b_all "${CL/X/VII}" sleep:4 shot:b_vii >/dev/null 2>&1
python3 tools/snap.py cranial $S key:2 sleep:9 shot:f_all "${CL/X/I}" sleep:3 shot:f_I "${CL/X/II}" sleep:3 shot:f_II "${CL/X/III}" sleep:3 shot:f_III "${CL/X/V}" sleep:3 shot:f_V "${CL/X/VI}" sleep:3 shot:f_VI "${CL/X/VII}" sleep:3 shot:f_VII "${CL/X/IX}" sleep:3 shot:f_IX "${CL/X/XI}" sleep:3 shot:f_XI "${CL/X/XII}" sleep:3 shot:f_XII "${CL/X/Двигательные}" sleep:3 shot:f_mot >/dev/null 2>&1
python3 tools/snap.py cranial size:390x844 sleep:9 shot:p1 key:2 sleep:7 shot:p2 "${CL/X/V}" sleep:4 shot:p3 >/dev/null 2>&1
python3 tools/snap.py cranial $S lang:en key:2 sleep:9 shot:e1 "${CL/X/V}" sleep:4 shot:e2 >/dev/null 2>&1
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
