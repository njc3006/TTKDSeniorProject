"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py collectstatic --no-input
"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py migrate
"%~dp0python-3.5.2-embed-amd64\python.exe" manage.py loaddata data.json
start "" "%~dp0python-3.5.2-embed-amd64\python.exe" manage.py runserver 0.0.0.0:8001
