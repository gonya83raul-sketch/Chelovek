# Продолжение доводки сцен — инструкция для нового сеанса Claude

Состояние на 31.10.2026: на сайте **app59** — второй круг (r6) прошли 59 сцен; без второго круга (оценки r5): skeleton, heart, lungs, digest, ear, brain, develop, skin, repro, chest, sresp, menses, adrenal, enzyme, lipoprot. См. NOTES.md (конец).

## 1. Подготовка (машина та же, домашняя папка сохранилась)
```sh
mkdir -p ~/work && cd ~/work
git clone -b source https://github.com/gonya83raul-sketch/Chelovek.git Chelovek
git clone -b main https://github.com/gonya83raul-sketch/Chelovek.git chelovek-site   # собранный сайт (для публикации)
cd Chelovek
export PATH=~/.local/opt/chelovek-venv/bin:~/.local/bin:$PATH   # python с playwright/pillow, node, gh
sh tools/setup.sh            # модели из ветки main, three.js для тестов (если lt/ пустой)
python3 tools/build.py       # сборка → out/site и lt/; должно быть «строк без перевода 0»
(cd lt && python3 -m http.server 8765 >/dev/null 2>&1 &)          # локальный сервер для снимков
```
Если git push просит вход — `gh auth status` (gh уже настроен в ~/.local/bin).

## 2. Правила пользователя (обязательно)
- **ПОСЛЕ СБРОСА ЛИМИТА — ОБНУЛИТЬ КОНТЕКСТ (просьба пользователя 29.10).** Если ход разбужен CronCreate «Лимит обнулился…» / «Недельный лимит обнулился…» и в разговоре уже есть прошлая работа (длинная история): 1) `CronCreate` one-shot на «сейчас + 5 мин» с промптом «Контекст обнулён. Прочитай CONTINUE.md в ~/work/Chelovek и продолжай»; 2) `mcp__ccd_session_mgmt__clear_session` с session_id "self" (очистка — в конце хода); 3) закончить ход, больше ничего не делая. Если ход начался с «Контекст обнулён…» — контекст уже чистый: работать по п. 5 и снова поставить CronCreate на следующий сброс + 7 мин.
- **После каждого сброса 5-часового лимита — новый чат** (ОГРАНИЧЕНИЕ: из сеанса, разбуженного CronCreate, приложение новый сеанс НЕ запускает — тогда продолжать в том же сеансе и снова ставить CronCreate) (чтобы не копить контекст): перед паузой довести начатое, сохранить всё в source и обновить этот файл; после сброса запустить НОВЫЙ сеанс (start_session, context fresh, cwd ~/work/Chelovek) с промптом из п. 6, а старый сеанс остановить. Если вызвал старый сеанс по CronCreate — он только запускает новый и больше ничего не делает.
- Перед паузой: `ss -ltnp | grep 8765` — убедиться, что сервер свой (иначе 404 в снимках); git user в клонах уже настроен.
- Пишет по-русски — отвечать по-русски, просто и коротко.
- **Публиковать редко**: одной партией из нескольких групп сцен, не после каждой группы. Исключение — найденная ошибка на сайте.
- **Тратить лимит до 100 %**, потом продолжать после сброса. Сразу в начале работы поставить продолжение после сброса лимита: `CronCreate` (one-shot, время сброса + 7 мин; время сброса — `get_usage`), промпт — «Прочитай CONTINUE.md в репозитории Chelovek и продолжай».
- Отчёты о работе — в Telegram (коротко, по-русски): `sh ~/.local/bin/tg.sh "текст"` (скрипт лежит только в домашней папке — в репозиторий его не класть: там номер чата) (токен берётся из ~/.claude/channels/telegram/.env; **никогда не печатать и не показывать токен**). Писать после каждой публикации и перед паузой.
- Рецензенты — не больше **2 агентов одновременно** (subagent general-purpose, model sonnet), машина слабая (4 ядра, без видеокарты — снимки медленные).
- Никогда не удалять «Условности», подписи авторов 3D-моделей, кнопку «Поддержать». Оба языка (RU+EN), 0 непереведённых строк.
- **Безопасность:** пользователь однажды ввёл системный пароль в терминал — никогда не повторять и не искать его.

## 3. Цикл работы
1. Снимки группы сцен: `python3 tools/siteshots.py id1 id2 …` → `lt/site/<id>_d.jpg` (1440×900) и `_m.jpg` (390×844). Скопировать в `review/shots/<раунд>/`.
2. Рецензент (sonnet, фоновый): «строгий рецензент, ничего не правь и не запускай; снимки review/shots/<раунд>/, код сцены; прошлые оценки review/score-*.md; формат как review/score-r4b.md; отчёт review/score-<раунд>.md; шкала 0–5 = точность·композиция·3D·подписи·телефон; конкретные „было → стало“ со строками». В задании обязательно напомнить правила камеры и mobZoom (ниже) — рецензенты их путают.
3. Внести высокие и средние пункты, проверить точечными снимками: `python3 tools/snap.py <id> size:1440x900 adv:3 shot:x` → `lt/x.png` (смотреть глазами; для моделей добавить `sleep:6`…`sleep:10`).
4. Проверка сцен: `python3 tools/sweep.py <ids>` (полный — `$(cat tools/ids.txt)`, долго, запускать в фоне). Единственное допустимое предупреждение: `blood … toNonIndexed()`.
5. Публикация (партией): `APP` в tools/build.py +1 → `python3 tools/build.py` → коммит, `git push origin HEAD:source` → в ../chelovek-site: `git pull --rebase && git rm -rq app<N-1> && cp -r ../Chelovek/out/site/. . && git add -A && git commit -m appN && git push` → дождаться appN в `curl -s https://gonya83raul-sketch.github.io/Chelovek/index.html` → `python3 tools/live.py /tmp/x page.html page2.en.html page3.html?rec` (ошибок быть не должно) → запись в NOTES.md → Telegram.

## 4. Технические подсказки (выстраданные)
- Камера: «опустить объект в кадре» = **поднять y цели**; «сдвинуть объект вправо» = **уменьшить x цели** (для камеры вдоль −z; у коры камера смотрит вдоль +z — наоборот). Цель бывает задана дважды (makeControls и VIEW/HOME) — менять обе.
- **mobZoom (телефон): меньше = крупнее** (доля кадра; био по умолчанию 0,7, тело/мозг 0,8).
- Константа `DK` в файлах bio/*.js — свой ракурс на компьютере, телефон прежний. Для сцен в src_page.html — аналогичные флаги через `matchMedia('(max-width:700px)')`.
- Подписи: `{ text, pos, color, show, left?, fade? }`. Подложка включена у всех сцен (`labelBg: false` — выключить). Оболочка сама переставляет подпись на другую сторону точки или прячет, если мешает текст/цифры/врезка/пульт.
- **Осторожно с заменами внутри строки**: не вставлять `//`-комментарий в середину строки — он съест код после него (так в app35 сломалась матка). Использовать `/* */` или новую строку. Объявления (`const HOME`) — до использования.
- Изменил русскую строку текста — перенеси перевод в data/i18n/en/b36_r3g.json (ключ — новая русская строка).

## 5. Что делать дальше
**СЕЙЧАС (28.10, задание пользователя): сначала SEO-правки, потом 3D-производительность.** Готовое отмечать здесь [x].
SEO — по review/seo.md (код: tools/build.py — head_tags, topic_ld, short, canon, topics_html, sitemap, llms.txt):
- [x] «Body» в оглавлении/JSON-LD, перевод однобуквенных единиц, текст menses (коммит 6fee3ef)
- [x] skeleton: ссылки оглавления → ./ и index.en.html; у страниц skeleton нет своей разметки темы (canonical — главная, noindex не ставили)
- [x] описания: общие (сделано: главные ≤160; short() не менялся) (главные) через short(); short() не обрывать на первом предложении < ~110 знаков
- [x] lastmod в sitemap — только при реальном изменении (хеш страницы без номера appN + файл сцены; хранить в data/lastmod.json)
- [x] хвост title короче (« — 3D-атлас «Кто мы?»» / EN), то же в рантайме (pageTitle в src_page.html)
- [x] llms.txt (ссылку hreflang в подвале не делал: после перехода между темами без перезагрузки она устаревает): «- [Название](url): описание», блок ## English, ссылка на sitemap, без skeleton
- [x] schema.org: publisher Organization, без offers/RUB (image — вместе с превью; dateModified не добавлен)
- [x] картинки превью 1200×630: tools/ogshots.py → ogcache/ (в git), build.py og_img. После правки темы: `python3 tools/ogshots.py` (перерисует только изменённые) до публикации. Слабые кадры: endo (тёмный), joints, home (тень-эллипс).
- [x] рецензент SEO: review/seo-check.md — высоких нет; внесено: EN publisher, lastmod без блока «Все темы». Не сделано: notes menses = дубль repro (нужен свой текст RU+EN), 26 описаний с «…».
- Вручную (пользователь): отправить sitemap в Google Search Console и Яндекс.Вебмастер (robots.txt в подпапке не работает).
3D: в src_page.html внесены (не проверены сборкой/sweep, если ниже не отмечено) Б1 (стекло с нулевым вкладом не рисуется — цикл в frame), Б2 (forceSinglePass у аддитивного стекла), Б3 (antialias:false), Б4 частично (карта теней 1024 на телефоне; autoUpdate не трогал), Б5 (dispose света и InstancedMesh), Б6 (не рисовать под #heartpanel, закрывать её в activate), Б7 (статистика только при изменении), Б8 (DPR телефона 1,25). С2 (на паузе — кадр только при действиях пользователя, иначе 1 к/с). Собрано, sweep 74/74 OK, снимки brain/heart/digest в порядке.
Превью: tools/ogshots.py (+ ogcache/, build.py og_img) — сделан, снимки всех тем; проверить глазами выборку.
**Сделано и опубликовано в app38:** С2–С5, правки рецензии 3d-check. **С1 лёгкий режим — опубликован в app39** (GFX high/mid/low: автоопределение + замер FPS, ?gfx=low|mid|high|auto; рецензия review/gfx-check.md, высокие исправлены; webdriver → high, поэтому sweep/снимки как раньше). Не сделано из С1: переключатель качества в интерфейсе (нужна кнопка «Настройки» всегда + строки RU/EN), brainKit по ступени, applyStain на low. С7–С9 тоже в app39. Партии r5a и r5b опубликованы в app40. r5c и r5d опубликованы в app41. В source после app41: cortex телефон крупнее (не опубликовано). r5e (cell, neuron, synapse, glia, soma, enzyme) оценён, часть правок внесена (NOTES). В source после app41 не опубликованы: cortex, cranial, ventricles, synapse, glia, neuron. **app42 опубликован (29.10):** r5e и r5f внесены (NOTES). r5g и r5h внесены и опубликованы в app43 (NOTES). Рецензенту можно разрешить самому снимать режимы (snap.py, по одному) — тогда нет пунктов «по коду». r5i и r5j опубликованы в app44 (NOTES). r5j доделан (в source). Партия r5k (skeleton, joints, heart, lungs, digest, ear) — рецензия review/score-r5k.md. r5k–r5m опубликованы (app45, app46) — все 74 сцены прошли раунд r5. **Следующий шаг:** (1) ПЕРЕД работой проверить недельный лимит (get_usage): пользователь велел работать до 100 % (29.10, «делай до 100%»); коммитить и пушить после каждой порции, чтобы ничего не потерять при обрыве; после сброса недели (30.10 20:00 UTC) — продолжать; (2) отложенные средние пункты r5f–r5m (списки «Не сделано» в NOTES, отчёты review/score-r5*.md) — develop, repro (app47), chemo, protein, hormsig, purine, sresp, joints, heart-столбики, lungs, digest, ear (app48) сделаны; остались: heart лёгочный ствол, dna «Репликация», lungs светлый блок у гортани, низкие тексты; (3) второй круг: r6a (aminoacid, express, heme, bloodchem, liver, nitrogen) сделан в app49; r6b (purine, hormsig, pituitary, sexhorm) — сделан (app50 + остаток в source); r6c (joints, chemo, betaox, kinetics) — app51; r6d (enzmed, vitamins, membrane, atp, cell, neuron) — app52; r6e (krebs, etc, radicals, carbdig, lipogen, eicosanoids) — app53; r6f (protein, dna, antibiotics, thyroid, diabetes, calcium) — app54; r6g (hemoglobin, glycolysis, glycogen, amines, mutations, fedfast) — app55; биохимия второй круг закончен; r6h (тело) — app56; r6i (types, spinal, stem, synapse) — app57; r6j (dien, cranial, vision, soma) — app58; r6k/r6l (hemis, cortex, hippo, cereb, ventricles, glia) — app59; дальше — второй круг для 15 сцен без r6 (см. «Состояние» вверху), затем — отложенные пункты «Не внесено» из score-r6*.md (старый список: r6i-старое — hemis, cortex, hippo, cereb, dien, cranial, spinal, ventricles; r6j — skeleton, heart, lungs, digest, ear, brain, develop, skin, repro, chest, sresp, menses, synapse, glia, soma, types, vision, stem). Скриптом брать пары только из пунктов без «не внесено»/«не проверял»; после — node --check. Приём: если в отчёте правки даны парами `было` → `стало` по разделам «## <id> —», их можно применить скриптом (re.findall по обратным кавычкам, проверка count == 1). r6c — betaox, kinetics, enzmed, vitamins, membrane, atp. Затем партии тела/мозга, ещё не оценённые в r5 — тело/мозг (skeleton, joints, brain, develop, heart, lungs, digest, ear, skin, repro, chemo, chest, sresp, menses). Публиковать после 2–3 партий. Мелочь: превью kinetics/soma/vitamins — модель на заголовке картинки (tools/ogshots.py, кадр). Старый план шага был: 3D С5 (compileAsync до activate), С3 (сердце: меньше материалов), С4 (мозг: пути в одну геометрию), С1 (лёгкий режим, раздел 6 отчёта) — каждое с sweep и снимками; затем рецензент 3D (sonnet) и публикация партии app38 (всё накопленное: r4e/r4f, SEO, превью, 3D). После публикации — проверить превью в @WebpageBot.
3D — по review/3d-perf.md, раздел 7: быстрые Б1–Б8 → С2 (рендер по требованию) → С1 (лёгкий режим) → С3–С5. Проверка: sweep + снимки; рецензент; затем публикация партии (app38) вместе с накопленным.

### Прежний план доводки сцен (после SEO и 3D)
1. Опубликовать накопленное можно вместе со следующей партией.
2. Рецензенты r4e и r4f отработали (review/score-r4e.md, score-r4f.md), высокие и средние правки внесены. Не сделано из них: крупное 3D (bodyShell вместо манекена в referred, позвоночник/psoas в kidney, печень/сердце в endo, выноски в shealth), неосновные режимы сцен не снимались.
3. Дальше: опубликовать партию (app38), затем переоценить самые слабые (≈3,0): glycogen, glycolysis, krebs, amines, express, adrenal, mutations, fedfast, vision, stem, types — многие правки по ним уже внесены после последней оценки.
4. Не сделано совсем: суставы (черновик бедренной кости wip2/drafts/joints_femur_draft.js), «крупные» пункты из отчётов (PDB-ферменты, новые модели органов).
5. Последние оценки: review/score-r4a.md … score-r4d.md; история — NOTES.md (разделы app20–app37).

## 6. Промпт для запуска нового сеанса
> Открой проект: склонируй https://github.com/gonya83raul-sketch/Chelovek (ветка source), прочитай CONTINUE.md и продолжай доводку сцен по нему без меня; отчёты — в Telegram через ~/.local/bin/tg.sh.
