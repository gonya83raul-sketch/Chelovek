#!/bin/bash
# снимки сцены mouth для рецензии: bash tools/moshots.sh <name> → review/shots/<name>/ (23 файла, несколько минут; запускать в фоне)
# образец для новых тем: заменить id сцены, кнопки сегментов и значения ползунка
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:$PATH
D=review/shots/$1; mkdir -p $D
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
R='js:(()=>{const r=document.querySelectorAll("input[type=range]")[0];r.value=V;r.dispatchEvent(new Event("input",{bubbles:true}))})();window.scrollTo(0,0)'
S='size:1400x860'
python3 tools/snap.py mouth $S sleep:9 shot:m_all "${CL/X/Язык}" sleep:4 shot:m_tongue "${CL/X/Нёбные миндалины}" sleep:4 shot:m_tons "${CL/X/Твёрдое нёбо}" sleep:4 shot:m_hard "${CL/X/Слюнные железы}" sleep:4 shot:m_gl "${CL/X/Зубы}" sleep:4 shot:m_teeth >/dev/null 2>&1
python3 tools/snap.py mouth $S key:2 sleep:9 "${R/V/0.18}" sleep:5 shot:t_1y "${R/V/0.4}" sleep:5 shot:t_4y "${R/V/0.6}" sleep:5 shot:t_9y "${R/V/0.76}" sleep:5 shot:t_14y "${R/V/1}" sleep:5 shot:t_25y "${CL/X/Моляры}" sleep:4 shot:t_mol >/dev/null 2>&1
python3 tools/snap.py mouth $S key:3 sleep:9 shot:z_0 "${R/V/0.1}" sleep:5 shot:z_spot "${R/V/0.3}" sleep:5 shot:z_en "${R/V/0.55}" sleep:5 shot:z_dent "${R/V/0.78}" sleep:5 shot:z_pulp "${R/V/0.97}" sleep:5 shot:z_per "${CL/X/Пульпа}" sleep:4 shot:z_lpulp >/dev/null 2>&1
python3 tools/snap.py mouth size:390x844 sleep:9 shot:p1 key:2 sleep:9 "${R/V/0.6}" sleep:5 shot:p2 key:3 sleep:9 "${R/V/0.97}" sleep:5 shot:p3 >/dev/null 2>&1
python3 tools/snap.py mouth $S lang:en sleep:9 shot:e1 key:2 sleep:9 "${R/V/0.6}" sleep:5 shot:e2 key:3 sleep:9 "${R/V/0.55}" sleep:5 shot:e3 >/dev/null 2>&1
python - "$D" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in 'm_all m_tongue m_tons m_hard m_gl m_teeth t_1y t_4y t_9y t_14y t_25y t_mol z_0 z_spot z_en z_dent z_pulp z_per z_lpulp e1 e2 e3'.split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
