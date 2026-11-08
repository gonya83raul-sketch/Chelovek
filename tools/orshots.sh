#!/bin/bash
# снимки сцены orbit для рецензии: bash tools/orshots.sh <name> → review/shots/<name>/ (≈ 30 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='x_obl x_top x_side x_front g_ur g_l g_dl g_d m_so m_io n_all n_III n_IV n_V n_side p_III p_IV p_VI t_all t_gland t_canal t_sac t_lids e1 e2 e3'
for n in $L p1 p2 p3; do rm -f lt/$n.png; done   # без устаревших снимков
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python3 tools/snap.py orbit $S sleep:9 shot:x_obl "${CL/X/Сверху}" sleep:4 shot:x_top "${CL/X/Сбоку}" sleep:4 shot:x_side "${CL/X/Спереди}" sleep:4 shot:x_front "${CL/X/↗}" sleep:3 shot:g_ur "${CL/X/←}" sleep:3 shot:g_l "${CL/X/↙}" sleep:3 shot:g_dl "${CL/X/Косо}" "${CL/X/↓}" sleep:4 shot:g_d "${CL/X/Верхняя косая}" sleep:3 shot:m_so "${CL/X/Нижняя косая}" sleep:3 shot:m_io >/dev/null 2>&1
python3 tools/snap.py orbit $S key:2 sleep:10 shot:n_all "${CL/X/III}" sleep:3 shot:n_III "${CL/X/IV}" sleep:3 shot:n_IV "${CL/X/V}" sleep:3 shot:n_V "${CL/X/Все}" "${CL/X/Сбоку}" sleep:4 shot:n_side "${CL/X/III}" "${CL/X/Паралич}" sleep:5 shot:p_III "${CL/X/IV}" sleep:4 shot:p_IV "${CL/X/VI}" sleep:4 shot:p_VI >/dev/null 2>&1
python3 tools/snap.py orbit $S key:3 sleep:10 shot:t_all "${CL/X/Железа}" sleep:3 shot:t_gland "${CL/X/Канальцы}" sleep:3 shot:t_canal "${CL/X/Мешок и проток}" sleep:3 shot:t_sac "${CL/X/Веки}" sleep:3 shot:t_lids >/dev/null 2>&1
python3 tools/snap.py orbit size:390x844 sleep:9 shot:p1 key:2 sleep:8 shot:p2 key:3 sleep:7 shot:p3 >/dev/null 2>&1
python3 tools/snap.py orbit $S lang:en sleep:9 "${CL/X/↗}" sleep:4 shot:e1 key:2 sleep:8 "${CL/X/III}" "${CL/X/Palsy}" sleep:5 shot:e2 key:3 sleep:8 "${CL/X/Sac and duct}" sleep:3 shot:e3 >/dev/null 2>&1
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
