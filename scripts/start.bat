@echo off
IF EXIST .pid (
  start /b "" stop.bat
)

start "" "%~dp0python-3.5.2-embed-amd64\pythonw.exe" manage.py runserver 0.0.0.0:80