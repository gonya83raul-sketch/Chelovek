#!/bin/bash
# снимки сцены neck для рецензии: bash tools/neshots.sh <name> → review/shots/<name>/ (несколько минут; запускать в фоне)
cd ~/work/Chelovek; export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:$PATH
D=review/shots/$1; mkdir -p $D
CL='js:[...document.querySelectorAll("button")].find(b=>b.textContent.trim()=="X").click()'
S='size:1400x860'
python3 tools/snap.py neck $S sleep:9 shot:m_all "${CL/X/Грудино-ключично-сосцевидная}" sleep:4 shot:m_scm "${CL/X/Подподъязычные}" sleep:4 shot:m_infra "${CL/X/Надподъязычные}" sleep:4 shot:m_supra "${CL/X/Лестничные}" sleep:4 shot:m_scal "${CL/X/Ременная и поднимающая лопатку}" sleep:4 shot:m_deep "${CL/X/Подкожная мышца шеи}" sleep:4 shot:m_plat >/dev/null 2>&1
python3 tools/snap.py neck $S key:2 sleep:9 shot:t_all "${CL/X/Сонный}" sleep:4 shot:t_carot "${CL/X/Лопаточно-трапециевидный}" sleep:4 shot:t_occ "${CL/X/Лопаточно-ключичный}" sleep:4 shot:t_omocl >/dev/null 2>&1
python3 tools/snap.py neck $S key:3 sleep:9 shot:v_all "${CL/X/Сонные артерии}" sleep:4 shot:v_car "${CL/X/Подключичная и позвоночная}" sleep:4 shot:v_sub "${CL/X/Вены}" sleep:4 shot:v_vein "${CL/X/Блуждающий нерв}" sleep:4 shot:v_vagus "${CL/X/Диафрагмальный и плечевое сплетение}" sleep:4 shot:v_phren "${CL/X/Добавочный нерв}" sleep:4 shot:v_xi "${CL/X/Подъязычный нерв и шейная петля}" sleep:4 shot:v_xii "${CL/X/Шейное сплетение}" sleep:4 shot:v_cerv >/dev/null 2>&1
python3 tools/snap.py neck $S key:4 sleep:9 shot:s_all "${CL/X/Поверхностная пластинка}" sleep:4 shot:s_inv "${CL/X/Предтрахеальная пластинка}" sleep:4 shot:s_pre "${CL/X/Сонное влагалище}" sleep:4 shot:s_carsh "${CL/X/Предпозвоночная пластинка}" sleep:4 shot:s_prev "${CL/X/Заглоточное пространство}" sleep:4 shot:s_retro >/dev/null 2>&1
python3 tools/snap.py neck size:390x844 sleep:9 shot:p1 key:2 sleep:7 shot:p2 key:3 sleep:7 shot:p3 key:4 sleep:7 shot:p4 >/dev/null 2>&1
python3 tools/snap.py neck $S lang:en sleep:9 shot:e1 key:2 sleep:7 shot:e2 key:3 sleep:7 shot:e3 key:4 sleep:7 shot:e4 >/dev/null 2>&1
python - "$D" <<'PY'
import sys
from PIL import Image
D=sys.argv[1]
for n in 'm_all m_scm m_infra m_supra m_scal m_deep m_plat t_all t_carot t_occ t_omocl v_all v_car v_sub v_vein v_vagus v_phren v_xi v_xii v_cerv s_all s_inv s_pre s_carsh s_prev s_retro e1 e2 e3 e4'.split():
    Image.open(f'lt/{n}.png').save(f'{D}/{n}.png')
ims=[Image.open(f'lt/p{i}.png') for i in (1,2,3,4)]
o=Image.new('RGB',(sum(i.width for i in ims),ims[0].height));x=0
for i in ims: o.paste(i,(x,0)); x+=i.width
o.save(f'{D}/mob.png')
PY
ls $D | wc -l
