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
from ..models import AttendanceRecord, Person
import sys
import os
import datetime
import json

def create_tmp_folder():
    """
    A helper function to create a temp folder if it does not exist.
    """
    if not os.path.exists(os.path.join(STATICFILES_DIR, 'tmp')):
        os.makedirs(os.path.join(STATICFILES_DIR, 'tmp'))

def create_csv(file, headers, data):
    """
    This function accepts a full file path, headers, and data, and
    saves them to a CSV file.
    Params:
        - file, string: the full path to the file to write to
        - headers: List<string>: A list of headers to write on the first line
        - data: List<List<Object>>: A list of arrays with data to write. The
                top level list represents an object, while the nested list
                represents its data.
    """
    # build giant string to write to file
    output = ""
    for header in headers:
        output += header + ", "
    output += "\r\n"

    # iterate through each data object
    for row in data:
        for value in row:
            output += str(value) + ", "
        output += '\r\n'

    try:
        f = open(file, 'w')
        f.write(output)
        f.close()
        return True
    except:
        return False


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
@api_view(['GET', ])
def export_attendance(request):
    """
    Create a temp CSV file in the static files directory containing
    the attendance records in the system.
    Returns: Relative URL to the file
    """
    print("Starting")
    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'attendance.csv')
    url = STATIC_URL + 'tmp/attendance.csv'

    create_tmp_folder()

    # noinspection PyBroadException
    headers = ['Date', 'First Name', 'Last Name', 'Program']
    records = AttendanceRecord.objects.all().order_by('date')

    # transform each record
    records_list = records.values_list('date', 'person__first_name', 'person__last_name', 'program__name')

    print("Creating CSV")
    # create the file and respond
    if create_csv(file, headers, records_list):
        return HttpResponse(json.dumps({'url': url}), status=200)
    else:
        return HttpResponse(status=500)

# noinspection PyUnusedLocal
@api_view(['GET', ])
def export_contacts(request):
    """
    Create a temp CSV file in the static files directory containing
    the contact records in the system.
    Returns: Relative URL to the file
    """
    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'contacts.csv')
    url = STATIC_URL + 'tmp/contacts.csv'

    create_tmp_folder()

    # noinspection PyBroadException
    headers = ['First Name', 'Last Name', 'Primary Phone', 'Secondary Phone', 'Address Street', 'Address City', 'Address State', 'Address ZIP', 'Email 1']
    num_emails = 1
    contacts = Person.objects.all().order_by('last_name')

    # transform each object
    contacts_list = []
    for i in range(0, contacts.count()):
        contact = [
            contacts[i].first_name if contacts[i].first_name is not None else "",
            contacts[i].last_name if contacts[i].last_name is not None else "",
            contacts[i].primary_phone if contacts[i].primary_phone is not None else "",
            contacts[i].secondary_phone if contacts[i].secondary_phone is not None else "",
            contacts[i].street if contacts[i].street is not None else "",
            contacts[i].city if contacts[i].city is not None else "",
            contacts[i].state if contacts[i].state is not None else "",
            contacts[i].zipcode if contacts[i].zipcode is not None else ""
        ]

        emails = contacts[i].emails.all()
        for j in range(0, emails.count()):
            if (j+1) > num_emails:
                headers.append('Email ' + str(j+1))
                num_emails += 1
            contact.append(emails[j].email)
        contacts_list.append(contact)

    # create the file and respond
    if create_csv(file, headers, contacts_list):
        return HttpResponse(json.dumps({'url': url}), status=200)
    else:
        return HttpResponse(status=500)
