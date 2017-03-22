mkdir logs
"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py collectstatic --no-input
"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py migrate
"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py loaddata data.json

@echo off

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%AppData%\Microsoft\Windows\Start Menu\Programs\Startup\start.bat.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0/start.bat" >> %SCRIPT%
echo oLink.WindowStyle = 7 >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%