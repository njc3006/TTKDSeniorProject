#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":

    # if there is a logs folder than this is a deployed copy so use logs
    if os.path.isdir("logs"):
        sys.stdout = open("logs/application.log", "w")
        sys.stderr = open("logs/error.log", "w")

    # Get the path to this file and put the .pid file in the same folder
    pidFilePath = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.pid')
    # write a file with the python PID so that the stop.bat file can end the process
    pidFile = open(pidFilePath, "w")
    pidFile.write(str(os.getpid()))
    pidFile.close();

    # continue with normal Django stuff.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ttkd_api.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    execute_from_command_line(sys.argv)
