#!/bin/bash
# снимки сцены nose для рецензии: sh tools/noshots.sh <name> → review/shots/<name>/ (≈ 25 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
R='js:(()=>{const r=document.querySelectorAll("input[type=range]")[0];r.value=V;r.dispatchEvent(new Event("input",{bubbles:true}))})();window.scrollTo(0,0)'
S='size:1400x860'
python3 tools/snap.py nose $S sleep:9 shot:c_all "${CL/X/Наружный нос}" sleep:5 shot:c_ext "${CL/X/Перегородка}" sleep:5 shot:c_sept "${CL/X/Раковины}" sleep:5 shot:c_conch "${CL/X/Ходы и отверстия}" sleep:5 shot:c_meat "${CL/X/Обоняние}" sleep:5 shot:c_olf "${CL/X/Носоглотка}" sleep:5 shot:c_phar >/dev/null 2>&1
python3 tools/snap.py nose $S key:2 sleep:9 shot:s_all "${CL/X/Лобные}" sleep:5 shot:s_fr "${CL/X/Решётчатые}" sleep:5 shot:s_eth "${CL/X/Верхнечелюстные}" sleep:5 shot:s_max "${CL/X/Клиновидная}" sleep:5 shot:s_sph >/dev/null 2>&1
python3 tools/snap.py nose $S key:3 sleep:9 "${R/V/0.05}" sleep:5 shot:a_0 "${R/V/0.35}" sleep:5 shot:a_3 "${R/V/0.53}" sleep:5 shot:a_7 "${R/V/0.7}" sleep:5 shot:a_12 "${R/V/1}" sleep:5 shot:a_25 >/dev/null 2>&1
python3 tools/snap.py nose size:390x844 sleep:9 shot:p1 key:2 sleep:9 "${CL/X/Верхнечелюстные}" sleep:5 shot:p2 key:3 sleep:9 "${R/V/0.6}" sleep:5 shot:p3 >/dev/null 2>&1
python3 tools/snap.py nose $S lang:en sleep:9 shot:e1 key:2 sleep:9 "${CL/X/Maxillary}" sleep:5 shot:e2 key:3 sleep:9 "${R/V/0.5}" sleep:5 shot:e3 >/dev/null 2>&1
python - "$D" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in 'c_all c_ext c_sept c_conch c_meat c_olf c_phar s_all s_fr s_eth s_max s_sph a_0 a_3 a_7 a_12 a_25 e1 e2 e3'.split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
