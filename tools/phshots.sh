#!/bin/bash
# снимки сцены pharynx для рецензии: sh tools/phshots.sh <name> → review/shots/<name>/ (≈ 25 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
L='x_all x_naso x_oro x_lar x_paths m_all m_sup m_mid m_inf m_long m_back m_wave w_0 w_15 w_30 w_42 w_50 w_58 w_75 e1 e2 e3'
for n in $L p1 p2 p3; do rm -f lt/$n.png; done   # без устаревших снимков
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
R='js:(()=>{const r=document.querySelectorAll("input[type=range]")[0];r.value=V;r.dispatchEvent(new Event("input",{bubbles:true}))})();window.scrollTo(0,0)'
S='size:1400x860'
python3 tools/snap.py pharynx $S sleep:9 shot:x_all "${CL/X/Носоглотка}" sleep:3 shot:x_naso "${CL/X/Ротоглотка}" sleep:3 shot:x_oro "${CL/X/Гортаноглотка}" sleep:3 shot:x_lar "${CL/X/Все}" "${CL/X/Пути воздуха и пищи}" sleep:3 shot:x_paths >/dev/null 2>&1
python3 tools/snap.py pharynx $S key:2 sleep:10 shot:m_all "${CL/X/Верхний}" sleep:3 shot:m_sup "${CL/X/Средний}" sleep:3 shot:m_mid "${CL/X/Нижний}" sleep:3 shot:m_inf "${CL/X/Продольные}" sleep:3 shot:m_long "${CL/X/Все}" "${CL/X/Вид сзади}" sleep:4 shot:m_back "${CL/X/Волна}" sleep:1.3 shot:m_wave >/dev/null 2>&1
python3 tools/snap.py pharynx $S key:3 sleep:8 "${R/V/0}" sleep:2 shot:w_0 "${R/V/0.15}" sleep:2 shot:w_15 "${R/V/0.3}" sleep:2 shot:w_30 "${R/V/0.42}" sleep:2 shot:w_42 "${R/V/0.5}" sleep:2 shot:w_50 "${R/V/0.58}" sleep:2 shot:w_58 "${R/V/0.75}" sleep:2 shot:w_75 >/dev/null 2>&1
python3 tools/snap.py pharynx size:390x844 sleep:9 shot:p1 key:2 sleep:8 shot:p2 key:3 sleep:5 "${R/V/0.45}" sleep:2 shot:p3 >/dev/null 2>&1
python3 tools/snap.py pharynx $S lang:en sleep:9 "${CL/X/Pathways of air and food}" sleep:3 shot:e1 key:2 sleep:8 "${CL/X/Inferior}" sleep:3 shot:e2 key:3 sleep:5 "${R/V/0.45}" sleep:2 shot:e3 >/dev/null 2>&1
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
