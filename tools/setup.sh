#!/bin/sh
# Подготовка свежего клона ветки source к сборке и тестам. Запускать из корня репозитория.
set -e
# 1) 3D-модели лежат только в ветке main (собранный сайт) — кладём туда, где их ждёт build.py
git fetch origin main
mkdir -p out/models lt
for m in skeleton muscles vision digest repro; do git show origin/main:models/$m.txt > out/models/$m.txt; done
# 2) инструменты сборки (разбиение на файлы) и three.js для локальных тестов
[ -d /opt/node-tools/node_modules/acorn ] || npm i --no-save acorn acorn-walk eslint-scope three@0.160.0
[ -d node_modules/three ] || npm i --no-save three@0.160.0
rm -rf lt/three && mkdir -p lt/three && cp -r node_modules/three/build node_modules/three/examples lt/three/
pip install --quiet pillow playwright 2>/dev/null || pip install --quiet --break-system-packages pillow playwright || true
echo "готово: python3 tools/build.py"
