#!/bin/bash
mkdir dist
unzip -u "python-dist.zip" -d ./dist/
cp -R ttkd_api/* ./dist/
mkdir ./dist/static
cd ./ttkd_ui
gulp buildstage
cp -R ./dist/* ../dist/static/
cd ..
cp start.bat ./dist/
cp data.json ./dist/
cd dist
python manage.py loaddata data.json
cd ..
zip -r ttkd.zip ./dist