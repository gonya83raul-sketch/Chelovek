#!/bin/bash
# снимки сцены face для рецензии: sh tools/fashots.sh <name> → review/shots/<name>/ (≈ 25 файлов, несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:/c/Users/Grisha/work/venv/Scripts:$PATH PYTHONUTF8=1
D=review/shots/$1; mkdir -p $D
for n in m_rest m_smile m_surp m_frown m_sad m_sq m_puck m_nerve m_bell c_all c_temp c_mass c_medp c_latp c_open c_prot c_side c_chew t_0 t_35 t_70 t_100 e1 e2 e3 p1 p2 p3; do rm -f lt/$n.png; done   # без устаревших снимков
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
R='js:(()=>{const r=document.querySelectorAll("input[type=range]")[0];r.value=V;r.dispatchEvent(new Event("input",{bubbles:true}))})();window.scrollTo(0,0)'
S='size:1400x860'
python3 tools/snap.py face $S sleep:10 shot:m_rest "${CL/X/Улыбка}" sleep:4 shot:m_smile "${CL/X/Удивление}" sleep:4 shot:m_surp "${CL/X/Хмурость}" sleep:4 shot:m_frown "${CL/X/Грусть}" sleep:4 shot:m_sad "${CL/X/Зажмуриться}" sleep:4 shot:m_sq "${CL/X/«Трубочка»}" sleep:4 shot:m_puck "${CL/X/Покой}" "${CL/X/Лицевой нерв}" sleep:4 shot:m_nerve "${CL/X/Лицевой нерв}" "${CL/X/Паралич слева}" "${CL/X/Улыбка}" sleep:4 shot:m_bell >/dev/null 2>&1
python3 tools/snap.py face $S key:2 sleep:10 shot:c_all "${CL/X/Височная мышца}" sleep:4 shot:c_temp "${CL/X/Жевательная}" sleep:4 shot:c_mass "${CL/X/Медиальная крыловидная}" sleep:4 shot:c_medp "${CL/X/Латеральная крыловидная}" sleep:4 shot:c_latp "${CL/X/Все}" "${CL/X/Открыть}" sleep:4 shot:c_open "${CL/X/Выдвинуть}" sleep:4 shot:c_prot "${CL/X/В сторону}" sleep:4 shot:c_side "${CL/X/Жевать}" sleep:3 shot:c_chew >/dev/null 2>&1
python3 tools/snap.py face $S key:3 sleep:10 "${R/V/0}" sleep:4 shot:t_0 "${R/V/0.35}" sleep:4 shot:t_35 "${R/V/0.7}" sleep:4 shot:t_70 "${R/V/1}" sleep:4 shot:t_100 >/dev/null 2>&1
python3 tools/snap.py face size:390x844 sleep:10 "${CL/X/Улыбка}" sleep:4 shot:p1 key:2 sleep:9 "${CL/X/Открыть}" sleep:4 shot:p2 key:3 sleep:9 "${R/V/0.7}" sleep:4 shot:p3 >/dev/null 2>&1
python3 tools/snap.py face $S lang:en sleep:10 "${CL/X/Smile}" sleep:4 shot:e1 key:2 sleep:9 "${CL/X/Masseter}" sleep:4 shot:e2 key:3 sleep:9 "${R/V/0.7}" sleep:4 shot:e3 >/dev/null 2>&1
python - "$D" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in 'm_rest m_smile m_surp m_frown m_sad m_sq m_puck m_nerve m_bell c_all c_temp c_mass c_medp c_latp c_open c_prot c_side c_chew t_0 t_35 t_70 t_100 e1 e2 e3'.split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
