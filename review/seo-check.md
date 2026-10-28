# SEO-проверка правок (out/site, 151 HTML)

Проверено скриптом по всем 151 файлу (canonical, hreflang, og:*, twitter:*, JSON-LD, длины, кириллица в EN) и вручную: главные, skeleton(.en), krebs(.en), menses(.en), heart.en, sitemap.xml, llms.txt, 8 картинок из og/. Ничего не правилось.

## Замечания

| Серьёзность | Где | Проблема | Как исправить |
|---|---|---|---|
| средняя | `ogcache/` (7,3 МБ, 152 файла), `tools/ogshots.py` — в git не добавлены (`??`) | Сборка берёт картинки из ogcache; без него на другой машине или в чистом клоне `og_img()` (tools/build.py:252–256) молча вернёт None и все страницы получат `og:image = icons/icon-512.png` и `twitter:card=summary` | Закоммитить ogcache/ и ogshots.py в ветку `source`; в build.py добавить предупреждение, если `OG_USED` пуст или картинок меньше страниц |
| средняя | out/site/menses.html:`<section id="notes">`, menses.en.html | Текст «notes» у menses — 100% копия repro.html (`makeMenses() { return makeRepro('cycle') }`, build.py:283–285): дубль контента, плюс в нём про «мужскую систему» и «первую неделю», к циклу не относится | Дать циклу свой `notes` (фазы, гормоны, 21–35 дней, оговорки) или не выводить общий текст для menses |
| средняя | tools/build.py:399–406 (`lastmod`) | Хеш считается по всему HTML страницы, а в нём блок «Все темы» (оглавление всех 74 тем): добавление или переименование любой темы сдвинет lastmod у всех 148 URL — поиск перестанет доверять lastmod. Сейчас все даты одинаковы (2026-10-28) — это первичное заполнение data/lastmod.json, штатно | Исключать из хеша блок `<details class="alltopics">…</details>` и head-теги `og:image ?v=`, либо хешировать только notes+lede+scene |
| низкая | build.py:244–246 (`PUBLISHER`), все EN-страницы | В JSON-LD английских страниц `publisher.name` = «Кто мы? 3D-атлас человека» (кириллица) | Для EN: «Who are we? 3D human atlas» (как `og:site_name`) |
| низкая | build.py:290–296 (`short`), 26 страниц (kinetics, lipogen, protein, sexhorm, menses.en, skeleton и др.) | Описание ≤160 соблюдено везде, но когда нет границы предложения после 80-го знака, оно обрывается на слове с «…» («…make…», «…в…») — выглядит как огрызок в сниппете | Резать по запятой/тире или переписать длинные lede вручную до ≤160 для этих 26 страниц |
| низкая | out/site/skeleton.html / skeleton.en.html, og/skeleton(.en).jpg | Страницы — полные дубли главных (canonical и hreflang верны, разметки нет, ссылок на них нет), но с `og:type=article`, обрезанным description и собственными картинками skeleton.jpg, используемыми только ими (2 лишних файла) | Либо убрать skeleton.* из публикации (редирект/удаление), либо добавить `noindex,follow`; og-картинку брать от home |
| низкая | llms.txt | Формат валидный (H1, blockquote, H2 со списками `- [..](..): ..`, 149 пунктов, нет дублей, все URL есть в sitemap). Отступления от спеки: H3 внутри `## English`, размер 47 КБ (много для «контекстного» файла), одно описание оборвано «…» | Допустимо. При желании: `/llms-full.txt` отдельно, а в llms.txt оставить только 1 строку на тему без H3 |
| низкая | og/home.jpg, endo(.en).jpg, joints(.en).jpg, cell.jpg | home: чёрный эллипс-«тень» под скелетом, фигура мелкая; endo почти чёрный силуэт; joints — тонкая кость с лишней красной линией; cell: заголовок слегка заходит на край клетки | Смещение/приближение камеры в ogshots.py для этих id (home, endo, joints), сдвинуть сцену правее для cell |
| низкая | JSON-LD LearningResource | `about` — строка; нет `dateModified`; при отсутствии картинки в `og_img` fallback-ветка `OG_COMMON` не пишет `og:locale:alternate` | `about: {"@type":"Thing","name":…}`, `dateModified` из data/lastmod.json; добавить locale:alternate в fallback |

## Что проверено и в порядке

- JSON-LD: на всех страницах валидный JSON; WebApplication (главные) и LearningResource + BreadcrumbList (темы); offers/RUB нет; publisher Organization есть; `image` у LearningResource совпадает с og:image; `url` = canonical; `inLanguage` ru/en верно. `about` EN: Biochemistry 37, Brain 20, Body 15, Cell 1 — «Cell body» нигде нет.
- canonical/hreflang/og:url: у всех 148 страниц canonical один, равен og:url и самоссылочному hreflang; x-default = ru; пары ru↔en симметричны. skeleton(.en): canonical → главная, `og:url` — главная, JSON-LD нет, ссылок на skeleton.html в оглавлениях нет (ведут на `./` и `index.en.html`). 404.html — noindex.
- og/twitter: 148 страниц × (og:image, type, width=1200, height=630, alt, locale, locale:alternate, twitter:card=summary_large_image, twitter:image = og:image) — без пропусков и расхождений; адреса с `?v=hash`.
- Файлы og/: 150 jpg, все существуют, ни один не лишний (кроме skeleton), все ровно 1200×630, вес 33–79 КБ (макс. < 300 КБ).
- Картинки (просмотрено 8: home, krebs, nitrogen.en, menses.en, endo.en, stem, joints.en, cell): пустых и чёрных кадров нет, названия крупные и читаемые, кириллица и латиница отрисованы корректно, обрезанного текста нет.
- Описания: максимум 160 знаков, совпадают с og:description, дублей title и description нет, title ≤60. Хвост RU «— 3D-атлас «Кто мы?»» соблюдён; короткий хвост (8 EN-страниц) — по задумке для длинных заголовков.
- EN-страницы: кириллицы в видимых текстах, aria/alt/title/placeholder нет; оглавление «All topics (74)», раздел «Body».
- menses: `<section id="notes">` заполнен (203 слова RU, 259 EN) — но см. дубль выше.
- sitemap.xml: валидный XML, 148 URL = 74 темы × 2 языка, hreflang-тройки, lastmod ISO; skeleton исключён; robots.txt указывает на sitemap.
- llms.txt: все ссылки есть в sitemap, у каждого пункта есть описание, EN-блок с отдельным blockquote, `## Optional` со sitemap.
