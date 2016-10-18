
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

import_file = open('data.json','r').read()[:-1]

for student_key in students.keys():
    import_file += ', {"model": "ttkd_api.person", '
    import_file += '"pk": ' + str(students[student_key]['pk']) + ', '
    import_file += '"fields": {"first_name": "' + students[student_key]['first_name'] + '", '
    import_file += '"last_name": "' + students[student_key]['last_name'] + '", '
    import_file += '"dob": "' + students[student_key]['dob'] + '", '
    import_file += '"primary_phone": "' + students[student_key]['primary_phone'] + '", '
    import_file += '"secondary_phone": "' + students[student_key]['secondary_phone'] + '", '
    import_file += '"street": "' + students[student_key]['steet'] + '", '
    import_file += '"city": "' + students[student_key]['city'] + '", '
    import_file += '"zipcode": "' + students[student_key]['zipcode'] + '", '
    import_file += '"state": "' + students[student_key]['state'] + '", '
    import_file += '"belt": null, '
    import_file += '"stripes": null, '
    import_file += '"extra_strips": null, '
    import_file += '"misc_notes": "", '
    import_file += '"active": true}}'

for class_key in classes.keys():
    import_file += ', {"model": "ttkd_api.program", '
    import_file += '"pk": ' + str(classes[class_key]['pk']) + ', '
    import_file += '"fields": {"name": "' + classes[class_key]['name'] + '", '
    import_file += '"active": true}}'

for registration in registrations:
    import_file += ', {"model": "ttkd_api.registration", '
    import_file += '"pk": ' + str(registration['pk']) + ', '
    import_file += '"fields": {"person": "' + str(registration['person']) + '", '
    import_file += '"program": "' + str(registration['program']) + '", '
    import_file += '"active": true}}'

import_file = import_file.replace('\n','')
import_file = import_file.replace('\\','\\\\')
print(import_file + ']')
#print(students)
#print(classes)
#print(registrations)
#print(attendance)