"""
export_views.py is a file that defines all the endpoints that can be used to export data,
such as system backups (as json files) or csv exports of the system's data.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
from django.http import HttpResponse
from ..settings import BACKUP_FILES_DIR, STATIC_URL, STATICFILES_DIR
from ..models import AttendanceRecord
import sys
import os
import datetime
import json


# noinspection PyUnusedLocal
@api_view(['POST', ])
def export_data(request):
    """
    An Url that is used to create a JSON export of the DB
    Only accepts POST with {} (you must put {} in the browsable api)
    Backup file is created in the BACKUP_DIR as defined in settings.py
    NOTE THIS TAKES A FEW SECONDS
    """

    if not os.path.exists(BACKUP_FILES_DIR):
        os.makedirs(BACKUP_FILES_DIR)

    backup_file = os.path.join(BACKUP_FILES_DIR, 'ttkd_backup_' +
                               datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '.json')

    sysout = sys.stdout
    with open(backup_file, 'w') as f:
        sys.stdout = f
        call_command('dumpdata', 'ttkd_api')
        sys.stdout = sysout

    return Response({'File': backup_file}, status=HTTP_200_OK)


# noinspection PyUnusedLocal
@api_view(['POST', ])
def export_attendance(request):
    """
    Create a temp CSV file in the static files directory containing
    the attendance records in the system.
    Filters: person__active, program
    Returns: Relative URL to the file
    """
    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'attendance.csv')
    url = STATIC_URL + 'tmp/attendance.csv'

    if not os.path.exists(os.path.join(STATICFILES_DIR, 'tmp')):
        os.makedirs(os.path.join(STATICFILES_DIR, 'tmp'))

    # noinspection PyBroadException
    try:
        f = open(file, 'w')
        # print the headers into the file
        f.write('Date, First Name, Last Name, Program\n')
        # get all attendance records

        # The ** will expand the dictionary into a parameter=value form
        # ex. program=5, person__active=true
        # The order by -date, will order by date descending because of the -
        records = AttendanceRecord.objects.filter(**request.data).order_by('-date')

        # write each record to the file
        for record in records:
            f.write(','.join([record.date.isoformat(), record.person.first_name,
                              record.person.last_name, record.program.name]) + '\n')
        f.close()
        return HttpResponse(json.dumps({'url': url}), status=200)
    except:
        return HttpResponse(status=500)
