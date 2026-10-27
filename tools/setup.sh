#!/bin/sh
# Подготовка свежего клона ветки source к сборке и тестам. Запускать из корня репозитория.
set -e
# 1) 3D-модели лежат только в ветке main (собранный сайт) — кладём туда, где их ждёт build.py
git fetch origin main
mkdir -p out/models lt
# сайт хранит models/<имя>.bin (gzip, сжатые tools/models.py); до app17 там были models/<имя>.txt — их кладём в models-src/ и пересжимаем
mkdir -p models-src
for m in skeleton muscles vision digest repro; do
  git show FETCH_HEAD:models/$m.bin > out/models/$m.bin 2>/dev/null || { rm -f out/models/$m.bin; git show FETCH_HEAD:models/$m.txt > models-src/$m.txt; NEED=1; }
done
[ -z "$NEED" ] || python3 tools/models.py
# 2) инструменты сборки (разбиение на файлы) и three.js для локальных тестов
[ -d /opt/node-tools/node_modules/acorn ] || npm i --no-save acorn acorn-walk eslint-scope three@0.160.0
[ -d node_modules/three ] || npm i --no-save three@0.160.0
rm -rf lt/three && mkdir -p lt/three && cp -r node_modules/three/build node_modules/three/examples lt/three/
# python-playwright той же версии, что и предустановленный node-playwright, иначе он не найдёт браузер
PWV=$(node -e "console.log(require('playwright/package.json').version)" 2>/dev/null || true)
pip install --quiet pillow "playwright${PWV:+==$PWV}" 2>/dev/null || pip install --quiet --break-system-packages pillow "playwright${PWV:+==$PWV}" || true
echo "готово: python3 tools/build.py"
