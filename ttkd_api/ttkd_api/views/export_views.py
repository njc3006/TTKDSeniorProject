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
from ..models import AttendanceRecord, Person, Registration, PersonBelt, Belt, Stripe
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

    create_tmp_folder()

    workbook = xlsxwriter.Workbook(file)

    bold = workbook.add_format({'bold': True})
    phone_format = workbook.add_format({'num_format': '[<=9999999]###-####;(###) ###-####'})
    date_format = workbook.add_format({'num_format': 'mm/dd/yyyy'})

    text_wrap_format = workbook.add_format()
    text_wrap_format.set_text_wrap()

    name_column_width = 18

    header_row = 0
    header_column = 0

    ######################################################
    # Student Information Worksheet                      #
    ######################################################

    worksheet = workbook.add_worksheet('Students')
    worksheet.set_column(0, 0, 30)
    worksheet.set_column(1, 2, name_column_width)
    worksheet.set_column(3, 3, 10)
    worksheet.set_column(4, 5, 15)
    worksheet.set_column(6, 7, 20)
    worksheet.set_column(8, 9, 14)
    worksheet.set_column(10, 22, 32)
    worksheet.set_column(23, 23, 50)

    student_starting_headers = ['Classes', 'First Name', 'Last Name', 'DOB', 'Primary Phone',
                                'Secondary Phone', 'Address Street', 'Address City',
                                'Address State', 'Address ZIP', 'Active', 'Email 1']

    for header in student_starting_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    num_emails = 1

    contacts = Person.objects.all().prefetch_related('classes').order_by('last_name')

    row = 1
    column = 0

    for i in range(0, len(contacts)):

        program_list = []

        for program_dict in contacts[i].classes.values('program__name'):
            program_list.append(program_dict['program__name'])

        worksheet.write(row, column, ', '.join(program_list), text_wrap_format)
        column += 1

        worksheet.write(row, column,
                        contacts[i].first_name if contacts[i].first_name is not None else "")
        column += 1
        worksheet.write(row, column,
                        contacts[i].last_name if contacts[i].last_name is not None else "")
        column += 1

        worksheet.write(row, column,
                        contacts[i].dob if contacts[i].dob is not None else "", date_format)
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
                                 'Emergency Contact 2 Phone Number', 'Emergency Contact 2 Relation',
                                 'Misc Notes']

    for header in emergency_contact_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    row = 1
    starting_column = len(student_starting_headers) + (num_emails - 1)

    for contact in contacts:

        column = starting_column

        if contact.emergency_contact_1 is not None:
            worksheet.write(row, column, contact.emergency_contact_1.full_name)
            column += 1
            emc_phone_1 = contact.emergency_contact_1.phone_number
            if emc_phone_1 is not None and emc_phone_1 != "":
                worksheet.write(row, column, int(emc_phone_1), phone_format)
            column += 1
            worksheet.write(row, column, contact.emergency_contact_1.relation)
            column += 1

        else:
            column += 3

        if contact.emergency_contact_2 is not None:
            worksheet.write(row, column, contact.emergency_contact_2.full_name)
            column += 1
            emc_phone_2 = contact.emergency_contact_2.phone_number
            if emc_phone_2 is not None and emc_phone_2 != "":
                worksheet.write(row, column, int(emc_phone_2), phone_format)
            column += 1
            worksheet.write(row, column, contact.emergency_contact_2.relation)
            column += 1

        else:
            column += 3

        worksheet.write(row, column, contact.misc_notes)

        row += 1

    ######################################################
    # Attendance Worksheet                               #
    ######################################################

    header_column = 0
    row = 1
    column = 0

    worksheet = workbook.add_worksheet('Attendance')
    worksheet.set_column(0, 2, name_column_width)
    worksheet.set_column(3, 3, 30)

    attendance_headers = ['Date', 'First Name', 'Last Name', 'Program']

    for header in attendance_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    records = AttendanceRecord.objects.all().order_by('-date')
    records_list = records.values_list('date', 'person__first_name', 'person__last_name',
                                       'program__name')

    for person_belt in records_list:
        column = 0
        for item in person_belt:
            if column == 0:
                worksheet.write(row, column, item, date_format)
            else:
                worksheet.write(row, column, item)
            column += 1
        row += 1

    ######################################################
    # Person Belt Worksheet                              #
    ######################################################

    header_column = 0
    row = 1
    column = 0

    worksheet = workbook.add_worksheet('Achieved Belts')
    worksheet.set_column(0, 2, name_column_width)
    worksheet.set_column(3, 5, 14)

    achieved_belt_headers = ['First Name', 'Last Name', 'Belt', 'Date Achieved', 'Current Belt']

    for header in achieved_belt_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    person_belt_records = PersonBelt.objects.all().order_by('person__last_name')
    person_belt_list = person_belt_records.values_list('person__first_name', 'person__last_name',
                                                       'belt__name', 'date_achieved',
                                                       'current_belt')

    for person_belt in person_belt_list:
        column = 0
        for item in person_belt:
            if column == 3:
                worksheet.write(row, column, item, date_format)
            else:
                worksheet.write(row, column, item)
            column += 1
        row += 1

    ######################################################
    # Belts Worksheet                                    #
    ######################################################

    header_column = 0
    row = 1
    column = 0

    worksheet = workbook.add_worksheet('Belts')
    worksheet.set_column(0, 0, 12)
    worksheet.set_column(1, 2, 20)

    belt_headers = ['Name', 'Primary Color (Hex)', 'Secondary Color (Hex)', 'Active']

    for header in belt_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    belt_records = Belt.objects.all().order_by('name')
    belt_list = belt_records.values_list('name', 'primary_color', 'secondary_color', 'active')

    for belt in belt_list:
        column = 0
        for item in belt:
            worksheet.write(row, column, item)
            column += 1
        row += 1

    ######################################################
    # Stripes Worksheet                                  #
    ######################################################

    header_column = 0
    row = 1
    column = 0

    worksheet = workbook.add_worksheet('Stripes')
    worksheet.set_column(0, 2, 12)

    stripe_headers = ['Name', 'Color (Hex)', 'Active']

    for header in stripe_headers:
        worksheet.write(header_row, header_column, header, bold)
        header_column += 1

    stripe_records = Stripe.objects.all().order_by('name')
    stripe_list = stripe_records.values_list('name', 'color', 'active')

    for stripe in stripe_list:
        column = 0
        for item in stripe:
            worksheet.write(row, column, item)
            column += 1
        row += 1

    workbook.close()

    return HttpResponse(json.dumps({'url': url}), status=200)
