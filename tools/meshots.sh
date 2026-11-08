#!/bin/bash
# снимки сцены midear для рецензии: bash tools/meshots.sh <name> → review/shots/<name>/ (≈ 30 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='c_lat c_ant c_med p_oss p_mus p_nrv p_air w_lat w_med w_roof w_ant w_post s_lo s_hi o_norm o_aom o_ome o_retr o_perf o_quad r_0 r_desc r_sw r_lock r_child e1 e2 e3'
for n in $L p1 p2 p3 p4; do rm -f lt/$n.png; done   # без устаревших снимков
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
RG='js:const r=document.querySelector(".gctl input[type=range]");r.value=X;r.dispatchEvent(new Event("input",{bubbles:true}))'
S='size:1400x860'
python3 tools/snap.py midear $S sleep:9 shot:c_lat "${CL/X/Спереди}" sleep:4 shot:c_ant "${CL/X/Изнутри}" sleep:4 shot:c_med "${CL/X/Снаружи}" sleep:3 "${CL/X/Косточки}" sleep:3 shot:p_oss "${CL/X/Мышцы}" sleep:3 shot:p_mus "${CL/X/Нервы}" sleep:3 shot:p_nrv "${CL/X/Труба и пещера}" sleep:3 shot:p_air "${CL/X/Латеральная}" sleep:3 shot:w_lat "${CL/X/Медиальная}" sleep:3 shot:w_med "${CL/X/Верхняя}" sleep:3 shot:w_roof "${CL/X/Передняя}" sleep:3 shot:w_ant "${CL/X/Задняя}" sleep:3 shot:w_post >/dev/null 2>&1
python3 tools/snap.py midear $S key:2 sleep:9 shot:s_lo "${RG/X/1}" sleep:4 shot:s_hi >/dev/null 2>&1
python3 tools/snap.py midear $S key:3 sleep:9 shot:o_norm "${CL/X/Острый отит}" sleep:3 shot:o_aom "${CL/X/Экссудат}" sleep:3 shot:o_ome "${CL/X/Втяжение}" sleep:3 shot:o_retr "${CL/X/Перфорация}" sleep:3 shot:o_perf "${CL/X/Норма}" "${CL/X/Квадранты}" sleep:3 shot:o_quad >/dev/null 2>&1
python3 tools/snap.py midear $S key:4 sleep:9 shot:r_0 "${RG/X/0.6}" sleep:4 shot:r_desc "${RG/X/1}" sleep:3 "${CL/X/Сглотнуть}" sleep:2 shot:r_lock "${CL/X/Вальсальва}" sleep:3 shot:r_sw "${CL/X/Ребёнок}" sleep:4 shot:r_child >/dev/null 2>&1
python3 tools/snap.py midear size:390x844 sleep:9 shot:p1 key:2 sleep:7 shot:p2 key:3 sleep:7 shot:p3 key:4 sleep:7 shot:p4 >/dev/null 2>&1
python3 tools/snap.py midear $S lang:en sleep:9 "${CL/X/Nerves}" sleep:4 shot:e1 key:3 sleep:7 shot:e2 key:4 sleep:7 "${RG/X/0.6}" sleep:3 shot:e3 >/dev/null 2>&1
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
