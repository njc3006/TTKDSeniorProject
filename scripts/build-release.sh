#!/bin/bash
echo 'Run this script from the TTKDSeniorProject/scripts directory.'
cd ..
rm -rf ./dist
mkdir dist
unzip -u "./scripts/python-dist.zip" -d ./dist/
cp -R ttkd_api/* ./dist/
mv ./dist/ttkd_api/prod.settings.py ./dist/ttkd_api/settings.py
mkdir ./dist/static
cd ./ttkd_ui
gulp buildstage
cp -R ./dist/* ../dist/static/
cp -R ../waiver.txt ../dist/static
cd ..
cp scripts/*.bat ./dist/
cp data.json ./dist/
cd dist
python manage.py loaddata data.json
cd ..
zip -r ttkd.zip ./dist/*