
MONTHS = {
    'Jan': '1',
    'Feb': '2',
    'Mar': '3',
    'Apr': '4',
    'May': '5',
    'Jun': '6',
    'Jul': '7',
    'Aug': '8',
    'Sep': '9',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
}


students = {}
headerline = True
pk = 0
for line in open('students.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')
    date = data[12].split(' ')
    students[data[0]] = {
        'pk': pk,
        'first_name': data[1],
        'last_name': data[2],
        'emails':
        [
            data[3],
            data[4],
            data[5]
        ],
        'emergency_contacts':
        [
            {'full_name':data[6], 'phone_number':data[7], 'relation':data[8]},
            {'full_name':data[9], 'phone_number':data[10], 'relation':data[11]},
        ],
        'dob': date[3] + '-' + MONTHS[date[1]] + '-' + date[2],
        'steet': data[13],
        'city': data[14],
        'zipcode': data[16],
        'state': data[15],
        'primary_phone': data[17],
        'secondary_phone': data[18],
    }
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
pk = 0
regpk = 0
for line in open('classes.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')
    classes[data[0]] = {
        'pk': pk,
        'name': programs[data[2]] + ' ' + data[1],
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

attendance = []

headerline = True
pk = 0
for line in open('attendance.csv'):
    if headerline:
        headerline = False
        continue

    data = line.split(',')

    programid = None
    for registration in registrations:
        if registration['person'] == students[data[1]]['pk']:
            programid = registration['program']
            break

    if programid == None:
        continue

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

email_pk = 0
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
    student_info += '"belt": null, '
    student_info += '"stripes": null, '
    student_info += '"extra_strips": null, '
    student_info += '"misc_notes": "", '
    student_info += '"active": true}}'
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
    import_file += '"active": true}}'

for registration in registrations:
    import_file += ', {"model": "ttkd_api.registration", '
    import_file += '"pk": ' + str(registration['pk']) + ', '
    import_file += '"fields": {"person": ' + str(registration['person']) + ', '
    import_file += '"program": ' + str(registration['program']) + '}}'

import_file = import_file.replace('\n','')
import_file = import_file.replace('\\','\\\\')
print(import_file + ']')
#print(students)
#print(classes)
#print(registrations)
#print(attendance)