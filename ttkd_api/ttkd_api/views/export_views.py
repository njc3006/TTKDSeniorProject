"""
export_views.py is a file that defines all the endpoints that can be used to export data,
such as system backups (as json files) or csv exports of the system's data.
"""
import xlsxwriter as xlsxwriter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
from django.http import HttpResponse
from ..settings import BACKUP_FILES_DIR, STATIC_URL, STATICFILES_DIR
from ..models import AttendanceRecord, Person, Registration
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
    output += "\n"

    # iterate through each data object
    for row in data:
        for value in row:
            output += str(value) + ", "
        output += '\n'

    # noinspection PyBroadException
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
@api_view(['POST', ])
def export_attendance(request):
    """
    Create a temp CSV file in the static files directory containing
    the attendance records in the system.
    Filters: person__active, program
    Returns: Relative URL to the file
    """
    print("Starting")
    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'attendance.csv')
    url = STATIC_URL + 'tmp/attendance.csv'

    create_tmp_folder()

    headers = ['Date', 'First Name', 'Last Name', 'Program']

    # The ** will expand the dictionary into a parameter=value form
    # ex. program=5, person__active=true
    # The order by -date, will order by date descending because of the -
    records = AttendanceRecord.objects.filter(**request.data).order_by('-date')
    records_list = records.values_list('date', 'person__first_name', 'person__last_name',
                                       'program__name')

    # create the file and respond
    if create_csv(file, headers, records_list):
        return HttpResponse(json.dumps({'url': url}), status=200)
    else:
        return HttpResponse(status=500)


# noinspection PyUnusedLocal
@api_view(['POST', ])
def export_contacts(request):
    """
    Create a temp CSV file in the static files directory containing
    the contact records in the system.
    Filters: person__active, program
    Returns: Relative URL to the file
    """
    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'contacts.csv')
    url = STATIC_URL + 'tmp/contacts.csv'

    create_tmp_folder()

    headers = ['First Name', 'Last Name', 'Primary Phone', 'Secondary Phone', 'Address Street',
               'Address City', 'Address State', 'Address ZIP', 'Active', 'Email 1']
    num_emails = 1

    filters = {}

    contacts = []

    if 'program' in request.data:
        if 'person__active' in request.data:
            filters['person__active'] = request.data['person__active']

        filters['program'] = request.data['program']

        # select related prevents the bellow registration.person from re-querying database
        registrations = Registration.objects.select_related('person').filter(**filters)\
            .order_by('person__last_name')

        for registration in registrations:
            contacts.append(registration.person)
    else:
        if 'person__active' in request.data:
            filters['active'] = request.data['person__active']
        contacts = Person.objects.filter(**filters).order_by('last_name')

    # transform each object
    contacts_list = []
    for i in range(0, len(contacts)):
        contact = [
            contacts[i].first_name if contacts[i].first_name is not None else "",
            contacts[i].last_name if contacts[i].last_name is not None else "",
            contacts[i].primary_phone if contacts[i].primary_phone is not None else "",
            contacts[i].secondary_phone if contacts[i].secondary_phone is not None else "",
            contacts[i].street if contacts[i].street is not None else "",
            contacts[i].city if contacts[i].city is not None else "",
            contacts[i].state if contacts[i].state is not None else "",
            contacts[i].zipcode if contacts[i].zipcode is not None else "",
            contacts[i].active if contacts[i].active is not None else ""
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


# noinspection PyUnusedLocal
@api_view(['GET', ])
def export_to_excel(request):
    """
    Create an excel spreadsheet that represents the system
    """

    file = os.path.join(os.path.join(STATICFILES_DIR, 'tmp'), 'export.xlsx')
    url = STATIC_URL + 'tmp/export.xlsx'

    workbook = xlsxwriter.Workbook(file)
    worksheet = workbook.add_worksheet('Students')

    bold = workbook.add_format({'bold': True})
    phone_format = workbook.add_format({'num_format': '[<=9999999]###-####;(###) ###-####'})

    starting_headers = ['First Name', 'Last Name', 'Primary Phone', 'Secondary Phone',
                        'Address Street', 'Address City', 'Address State', 'Address ZIP', 'Active',
                        'Email 1']

    header_row = 0
    header_column = 0

    for header in starting_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    num_emails = 1

    contacts = Person.objects.all().order_by('last_name')

    row = 1
    column = 0

    for i in range(0, len(contacts)):

        worksheet.write(row, column,
                        contacts[i].first_name if contacts[i].first_name is not None else "")
        column += 1
        worksheet.write(row, column,
                        contacts[i].last_name if contacts[i].last_name is not None else "")
        column += 1

        if contacts[i].primary_phone is not None and contacts[i].primary_phone != "":
            worksheet.write(row, column, int(contacts[i].primary_phone), phone_format)
        column += 1

        if contacts[i].secondary_phone is not None and contacts[i].secondary_phone != "":
            worksheet.write(row, column, int(contacts[i].secondary_phone), phone_format)
        column += 1

        worksheet.write(row, column, contacts[i].street if contacts[i].street is not None else "")
        column += 1
        worksheet.write(row, column, contacts[i].city if contacts[i].city is not None else "")
        column += 1
        worksheet.write(row, column, contacts[i].state if contacts[i].state is not None else "")
        column += 1

        if contacts[i].zipcode is not None and contacts[i].zipcode != "":
            worksheet.write(row, column, int(contacts[i].zipcode))
        column += 1

        worksheet.write(row, column, contacts[i].active if contacts[i].active is not None else "")
        column += 1

        emails = contacts[i].emails.all()
        for j in range(0, emails.count()):
            if (j + 1) > num_emails:
                worksheet.write(header_row, header_column, 'Email ' + str(j + 1), bold)
                header_column += 1
                num_emails += 1
            worksheet.write(row, column, emails[j].email)
            column += 1

        row += 1
        column = 0

    emergency_contact_headers = ['Emergency Contact 1 Full Name',
                                 'Emergency Contact 1 Phone Number', 'Emergency Contact 1 Relation',
                                 'Emergency Contact 2 Full Name',
                                 'Emergency Contact 2 Phone Number', 'Emergency Contact 2 Relation']

    for header in emergency_contact_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    row = 1
    column = len(starting_headers) + num_emails

    for i in range(0, len(contacts)):

        worksheet.write(row, column, contacts[i].emergency_contact_1.full_name)
        column += 1
        emc_phone_1 = contacts[i].emergency_contact_1.phone_number
        if emc_phone_1 is not None and emc_phone_1 != "":
            worksheet.write(row, column, int(emc_phone_1))
        column += 1
        worksheet.write(row, column, contacts[i].emergency_contact_1.relation)
        column += 1

        worksheet.write(row, column, contacts[i].emergency_contact_2.full_name)
        column += 1
        emc_phone_2 = contacts[i].emergency_contact_2.phone_number
        if emc_phone_2 is not None and emc_phone_2 != "":
            worksheet.write(row, column, int(emc_phone_2))
        column += 1
        worksheet.write(row, column, contacts[i].emergency_contact_2.relation)

        row +=1
        column =0

    workbook.close()

    return HttpResponse(json.dumps({'url': url}), status=200)
