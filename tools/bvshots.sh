#!/bin/bash
# снимки сцены brainvasc для рецензии: bash tools/bvshots.sh <name> → review/shots/<name>/ (запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='a_all a_ica a_mca a_pcom a_ba a_cbl t_lat t_mca t_med t_aca t_pca o_mca o_rep o_icaok o_icabad o_ba e1 e2'
for n in $L p1 p2 p3; do rm -f lt/$n.png; done
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python3 tools/snap.py brainvasc $S sleep:9 shot:a_all "${CL/X/Внутренние сонные}" sleep:3 shot:a_ica "${CL/X/Средние мозговые}" sleep:3 shot:a_mca "${CL/X/Задние соединительные}" sleep:3 shot:a_pcom "${CL/X/Основная}" sleep:3 shot:a_ba "${CL/X/Мозжечковые}" sleep:3 shot:a_cbl >/dev/null 2>&1
python3 tools/snap.py brainvasc $S key:2 sleep:9 shot:t_lat "${CL/X/Средняя}" sleep:3 shot:t_mca "${CL/X/Все}" "${CL/X/Изнутри}" sleep:4 shot:t_med "${CL/X/Передняя}" sleep:3 shot:t_aca "${CL/X/Задняя}" sleep:3 shot:t_pca >/dev/null 2>&1
python3 tools/snap.py brainvasc $S key:3 sleep:12 shot:o_mca "${CL/X/Восстановить кровоток}" sleep:4 shot:o_rep "${CL/X/Сонная, круг замкнут}" sleep:6 shot:o_icaok "${CL/X/Сонная, круг разомкнут}" sleep:10 shot:o_icabad "${CL/X/Основная}" sleep:10 shot:o_ba >/dev/null 2>&1
python3 tools/snap.py brainvasc size:390x844 sleep:9 shot:p1 key:2 sleep:5 shot:p2 key:3 sleep:9 shot:p3 >/dev/null 2>&1
python3 tools/snap.py brainvasc $S lang:en sleep:9 shot:e1 key:3 sleep:10 shot:e2 >/dev/null 2>&1
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
