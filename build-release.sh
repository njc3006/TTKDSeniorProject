#!/bin/bash
mkdir dist
unzip -u "python-dist.zip" -d ./dist/
cp -R ttkd_api/* ./dist/
mkdir ./dist/static
cd ./ttkd_ui
gulp build
cp -R ./dist/* ../dist/static/
cd ..
cp start.bat ./dist/
