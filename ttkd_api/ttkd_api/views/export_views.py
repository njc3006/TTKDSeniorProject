from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
from ..settings import BACKUP_DIR
import sys
import os
import datetime


@api_view(['POST', ])
def export_data(request):
    """
    An Url that is used to create a JSON export of the DB
    Only accepts POST with {} (you must put {} in the browsable api)
    Backup file is created in the BACKUP_DIR as defined in settings.py
    NOTE THIS TAKES A FEW SECONDS
    """

    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)

    backup_file = BACKUP_DIR + 'ttkd_backup_' + \
        datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '.json'

    sysout = sys.stdout
    with open(backup_file, 'w') as f:
        sys.stdout = f
        call_command('dumpdata', 'ttkd_api')
        sys.stdout = sysout

    return Response(status=HTTP_200_OK)
