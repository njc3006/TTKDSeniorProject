cd "%~dp0"
IF EXIST .pid (
  stop.bat
)

start /wait "" "%~dp0python-3.5.2-embed-amd64\python.exe" "%~dp0manage.py" runserver_plus --cert .\cert
