@echo off
SET /P PID=<.pid
TASKKILL /F /PID %PID%
del .pid

