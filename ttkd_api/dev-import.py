from random import randint


MONTHS = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
}

STRIPES_BELTS = """,{"model":"ttkd_api.belt","pk":1,"fields":{"name":"White","active":true}},{"model":"ttkd_api.belt","pk":2,"fields":{"name":"Yellow","active":true}},{"model":"ttkd_api.belt","pk":3,"fields":{"name":"Orange","active":true}},{"model":"ttkd_api.belt","pk":4,"fields":{"name":"Green","active":true}},{"model":"ttkd_api.belt","pk":5,"fields":{"name":"Blue","active":true}},{"model":"ttkd_api.belt","pk":6,"fields":{"name":"Purple","active":true}},{"model":"ttkd_api.belt","pk":7,"fields":{"name":"Red","active":true}},{"model":"ttkd_api.belt","pk":8,"fields":{"name":"Brown","active":true}},{"model":"ttkd_api.stripe","pk":1,"fields":{"color":"Black","active":true}},{"model":"ttkd_api.stripe","pk":2,"fields":{"color":"Red","active":true}},{"model":"ttkd_api.stripe","pk":3,"fields":{"color":"Blue","active":true}},{"model":"ttkd_api.stripe","pk":4,"fields":{"color":"Yellow","active":true}},{"model":"ttkd_api.stripe","pk":5,"fields":{"color":"Orange","active":true}},{"model":"ttkd_api.stripe","pk":6,"fields":{"color":"Green","active":true}}"""

students = {}
headerline = True
pk = 1
stripes = []
belts = []
stripe_pk = 1

for line in open('students.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')
    date = data[12].split(' ')
    students[data[0]] = {
        'pk': pk,
        'first_name': data[1],
        'last_name': 'TTKD',
        'emails':
        [
            'fake' + str(pk*10+1) + '@email.com',
            'fake' + str(pk*10+2) + '@email.com',
            'fake' + str(pk*10+3) + '@email.com',
        ],
        'emergency_contacts':
        [
            {'full_name':data[6].split(' ')[0], 'phone_number':'1234567890', 'relation':data[8]},
            {'full_name':data[9].split(' ')[0], 'phone_number':'0987654321', 'relation':data[11]},
        ],
        'dob': date[3] + '-' + MONTHS[date[1]] + '-' + date[2],
        'steet': str(pk) + 'TTKD Lane',
        'city': 'No Where',
        'zipcode': '123456',
        'state': 'NY',
        'primary_phone': '1234567890',
        'secondary_phone': '0987654321',
        'active': 'true'
    }
    for num in range(randint(0,10)):
        stripes.append({
            'pk': stripe_pk,
            'person': pk,
            'stripe': randint(1,6),
            'date_achieved': str(randint(2012,2016)) + '-' + str(randint(1,12)) + '-' + str(randint(1,28)),
            'current_stripe': ('true' if randint(0,1) else 'false'),
        })

        stripe_pk += 1
    belts.append({
        'pk': pk,
        'person': pk,
        'belt': randint(1,8),
        'date_achieved': str(randint(2012,2016)) + '-' + str(randint(1,12)) + '-' + str(randint(1,28)),
        'current_belt': 'true'
    })



    pk += 1

programs = {}
headerline = True
for line in open('programs.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')
    programs[data[0]] = data[1]

classes = {}
registrations = []
headerline = True
pk = 1
regpk = 1
for line in open('classes.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')
    classes[data[0]] = {
        'pk': pk,
        'name': programs[data[2]] + ' ' + data[1],
        'active': 'true'
    }

    enrolled = data[3].split('/')
    for student in enrolled:
        registrations.append(
            {
                'pk': regpk,
                'person': students[student]['pk'],
                'program': pk
            }
        )
        regpk += 1

    pk += 1

classes['dummy'] = {
    'pk': 0,
    'name': 'import',
    'active': 'false'
}


attendance = []

headerline = True
pk = 1
for line in open('attendance.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')

    programid = None
    # still doing this so we know if the student is active
    for registration in registrations:
        if registration['person'] == students[data[1]]['pk']:
            programid = registration['program']
            break

    if programid == None:
        students[data[1]]['active'] = 'false'

    programid = 0 # make all imported attendance marked as being imported
    
    date = data[2].split(' ')
    attendance.append(
        {
            'pk': pk,
            'person': students[data[1]]['pk'],
            'date': date[3] + '-' + MONTHS[date[1]] + '-' + date[2],
            'program': programid
        }
    )


    pk += 1

import_file = open('dump.json','r').read()[:-1]

email_pk = 1
for student_key in students.keys():
    student_info = ''
    student_info += ', {"model": "ttkd_api.person", '
    student_info += '"pk": ' + str(students[student_key]['pk']) + ', '
    student_info += '"fields": {"first_name": "' + students[student_key]['first_name'] + '", '
    student_info += '"last_name": "' + students[student_key]['last_name'] + '", '
    student_info += '"dob": "' + students[student_key]['dob'] + '", '
    student_info += '"primary_phone": "' + students[student_key]['primary_phone'] + '", '
    student_info += '"secondary_phone": "' + students[student_key]['secondary_phone'] + '", '
    student_info += '"street": "' + students[student_key]['steet'] + '", '
    student_info += '"city": "' + students[student_key]['city'] + '", '
    student_info += '"zipcode": "' + students[student_key]['zipcode'] + '", '
    student_info += '"state": "' + students[student_key]['state'] + '", '
    student_info += '"misc_notes": "", '
    student_info += '"active": ' + students[student_key]['active'] + '}}'
    for email in students[student_key]['emails']:
        if email != 'null':
            student_info += ', {"model": "ttkd_api.email", '
            student_info += '"pk": ' + str(email_pk) + ', '
            student_info += '"fields": {"person": ' + str(students[student_key]['pk']) + ', '
            student_info += '"email": "' + email + '"}}'
            email_pk += 1

    import_file += student_info

for class_key in classes.keys():
    import_file += ', {"model": "ttkd_api.program", '
    import_file += '"pk": ' + str(classes[class_key]['pk']) + ', '
    import_file += '"fields": {"name": "' + classes[class_key]['name'] + '", '
    import_file += '"active": ' + classes[class_key]['active'] + '}}'

for registration in registrations:
    import_file += ', {"model": "ttkd_api.registration", '
    import_file += '"pk": ' + str(registration['pk']) + ', '
    import_file += '"fields": {"person": ' + str(registration['person']) + ', '
    import_file += '"program": ' + str(registration['program']) + '}}'

for check_in in attendance:
    import_file += ', {"model": "ttkd_api.attendancerecord", '
    import_file += '"pk": ' + str(check_in['pk']) + ', '
    import_file += '"fields": {"person": ' + str(check_in['person']) + ', '
    import_file += '"date": "' + check_in['date'] + '", '
    import_file += '"program": ' + str(check_in['program']) + '}}'

import_file += STRIPES_BELTS

for stripe in stripes:
    import_file += ', {"model": "ttkd_api.personstripe", '
    import_file += '"pk": ' + str(stripe['pk']) + ', '
    import_file += '"fields": {"person": ' + str(stripe['person']) + ', '
    import_file += '"stripe": "' + str(stripe['stripe']) + '", '
    import_file += '"date_achieved": "' + stripe['date_achieved'] + '", '
    import_file += '"current_stripe": ' + stripe['current_stripe'] + '}}'

for belt in belts:
    import_file += ', {"model": "ttkd_api.personbelt", '
    import_file += '"pk": ' + str(belt['pk']) + ', '
    import_file += '"fields": {"person": ' + str(belt['person']) + ', '
    import_file += '"belt": "' + str(belt['belt']) + '", '
    import_file += '"date_achieved": "' + belt['date_achieved'] + '", '
    import_file += '"current_belt": ' + belt['current_belt'] + '}}'


while ('  ' in import_file):
	import_file = import_file.replace('  ',' ')

import_file = import_file.replace('\n','')
import_file = import_file.replace('\\','\\\\')
open("dev-import.json",'w').write(import_file + ']')