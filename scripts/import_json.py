import json, sys, os, random

students_file = open("students.json").read()
attendances_file = open("attendances.json").read()
classes_file = open("classes.json").read()
programs_file = open("programs.json").read()

args = sys.argv

mask = "mask" in args
nobelts = "nobelt" in args or "nostripe" in args or "nobelts" in args or "nostripes" in args

try:
    os.remove("../ttkd_api/db.sqlite3")
    print("Removed old database")
except:
    print("Failed to remove old database")

os.system("python ../ttkd_api/manage.py migrate")
os.system("python ../ttkd_api/manage.py dumpdata > dump.json")

dump_import = []
if os.path.exists('dump.json'):
    dump_file = open("dump.json").read()
    dump_import = json.loads(dump_file)

# clean out old data so we dont get indexing errors
models_changing = [
    "ttkd_api.person",
    "ttkd_api.email",
    "ttkd_api.emergencycontact",
    "ttkd_api.program",
    "ttkd_api.registration",
    "ttkd_api.attendancerecord",
    "ttkd_api.personbelt",
    "ttkd_api.personstripe"
]
if not nobelts:
    models_changing.append("ttkd_api.belt")
    models_changing.append("ttkd_api.stripe")
for i in range(len(dump_import)-1,-1, -1): # run backwards so we dont get indexing issues as we remove indexs
    if dump_import[i]["model"] in models_changing:
        del dump_import[i]

students_import = {}
attendances_import = {}
classes_import = {}
programs_import = {}

try:
    students_import = json.loads(students_file)
except Exception as e:
    students_file = students_file.split()
    students_temp = '[' + ','.join(students_file) + ']'
    students_import = json.loads(students_temp)

try:
    attendances_import = json.loads(attendances_file)
except Exception as e:
    attendances_file = attendances_file.split()
    attendances_temp = '[' + ','.join(attendances_file) + ']'
    attendances_import = json.loads(attendances_temp)

try:
    classes_import = json.loads(classes_file)
except Exception as e:
    classes_file = classes_file.split()
    classes_temp = '[' + ','.join(classes_file) + ']'
    classes_import = json.loads(classes_temp)

try:
    programs_import = json.loads(programs_file)
except Exception as e:
    programs_file = programs_file.split()
    programs_temp = '[' + ','.join(programs_file) + ']'
    programs_import = json.loads(programs_temp)

students = {}
emails = []
emergency_contacts = []
belts_and_stripes = []

person_pk = 1
emergency_pk = 1
email_pk = 1
stripe_pk = 1
for student in students_import:

    random_belt = None

    if mask:
        random_belt = int(random.randint(1,10))

    students[student['_id']['$oid']] = {
        "model": "ttkd_api.person",
        "pk": person_pk,
        "fields": {
            "first_name": student['firstName'],
            "last_name": student['lastName'] if not mask else "TTKD",
            "dob": student['birthday']['$date'][:10],
            "primary_phone": student['phone']['home'] if not mask else "1234567890",
            "secondary_phone": student['phone']['cell'] if "cell" in student['phone'] and not mask else None,
            "street": student['address']['street'] if not mask else "123 TTKD Lane",
            "city": student['address']['city'] if not mask else "No Where",
            "zipcode": student['address']['zip'] if not mask else "12345",
            "state": student['address']['state'] if not mask else "KS",
            "misc_notes": "",
            "active": True,
            "emergency_contact_1": emergency_pk,
            "emergency_contact_2": emergency_pk + 1,
            "belt" : random_belt
        }
    }

    for email in student['emailAddresses']:
        emails.append({
            "model": "ttkd_api.email",
            "pk": email_pk,
            "fields": {
                "person": person_pk,
                "email": email if not mask else "fakeemail" + str(email_pk) + "@masked.com"
            }
        })
        email_pk += 1

    for contact in student['emergencyContacts']:
        emergency_contacts.append({
            "model": "ttkd_api.emergencycontact",
            "pk": emergency_pk,
            "fields": {
                "relation": contact['relationship'],
                "phone_number": contact['phoneNumber'] if not mask else "0987654321",
                "full_name": contact['name'] if not mask else contact['name'].split(' ')[0]
            }
        })
        emergency_pk += 1

    if (mask):
        belts_and_stripes.append({
            "model": "ttkd_api.personbelt",
            "pk": person_pk,
            "fields": {
                "person": person_pk,
                "belt": random_belt,
                "date_achieved": str(int(random.randint(2012, 2016))) + "-" + str(int(random.randint(1, 12))) + "-" + str(int(random.randint(1, 28))),
            }
        })

        for i in range(0,random.randint(0,6)):
            belts_and_stripes.append({
                "model": "ttkd_api.personstripe",
                "pk": stripe_pk,
                "fields": {
                    "person": person_pk,
                    "stripe": int(random.randint(1,6)),
                    "date_achieved": str(int(random.randint(2012, 2016))) + "-" + str(int(random.randint(1, 12))) + "-" + str(int(random.randint(1, 28))),
                    "current_stripe": True
                }
            })

            stripe_pk += 1

    person_pk += 1

programs = {}
for program in programs_import:
    programs[program['_id']['$oid']] = program['name']

classes = {}
registrations = []
class_pk = 1
registration_pk = 1
for import_class in classes_import:
    classes[import_class['_id']['$oid']] = {
        "model": "ttkd_api.program",
        "pk": class_pk,
        "fields": {
            "name": programs[import_class['program']['$oid']] + ' ' + import_class['name'],
            "active": len(import_class["students"]) > 0
        }
    }

    for student in import_class["students"]:
        registrations.append({
            "model": "ttkd_api.registration",
            "pk": registration_pk,
            "fields": {
                "person": students[student['$oid']]['pk'],
                "program": class_pk,
            }
        })

        registration_pk += 1

    class_pk += 1

attendances = []
attendance_pk = 1
for attendance in attendances_import:
    attendances.append({
        "model": "ttkd_api.attendancerecord",
        "pk": attendance_pk,
        "fields": {
            "person": students[attendance["student"]["$oid"]]["pk"],
            "program": classes[attendance["classAttended"]["$oid"]]["pk"],
            "date": attendance['checkInTime']['$date'][:10]
        }
    })

    attendance_pk += 1

for student in students:
    dump_import.append(students[student])

for email in emails:
    dump_import.append(email)

for contact in emergency_contacts:
    dump_import.append(contact)

for insert_class in classes:
    dump_import.append(classes[insert_class])

for attendance in attendances:
    dump_import.append(attendance)

for registration in registrations:
    dump_import.append(registration)

if not nobelts:
    for item in json.loads('[{"model":"ttkd_api.belt","pk":1,"fields":{"name":"White","primary_color":"ffffff","secondary_color":"ffffff","active":true}},{"model":"ttkd_api.belt","pk":2,"fields":{"name":"Yellow","primary_color":"ffff00","secondary_color":"ffff00","active":true}},{"model":"ttkd_api.belt","pk":3,"fields":{"name":"Orange","primary_color":"ffa500","secondary_color":"ffa500","active":true}},{"model":"ttkd_api.belt","pk":4,"fields":{"name":"Green","primary_color":"00ff00","secondary_color":"00ff00","active":true}},{"model":"ttkd_api.belt","pk":5,"fields":{"name":"Blue","primary_color":"0000ff","secondary_color":"0000ff","active":true}},{"model":"ttkd_api.belt","pk":6,"fields":{"name":"Purple","primary_color":"551a8b","secondary_color":"551a8b","active":true}},{"model":"ttkd_api.belt","pk":7,"fields":{"name":"Red","primary_color":"ff0000","secondary_color":"ff0000","active":true}},{"model":"ttkd_api.belt","pk":8,"fields":{"name":"Brown","primary_color":"f4a460","secondary_color":"f4a460","active":true}},{"model":"ttkd_api.belt","pk":9,"fields":{"name":"Hi-Brown","primary_color":"000000","secondary_color":"f4a460","active":true}},{"model":"ttkd_api.belt","pk":10,"fields":{"name":"Hi-Provisional","primary_color":"000000","secondary_color":"ff0000","active":true}},{"model":"ttkd_api.stripe","pk":1,"fields":{"name":"Black","color":"000000","active":true}},{"model":"ttkd_api.stripe","pk":2,"fields":{"name":"Red","color":"ff0000","active":true}},{"model":"ttkd_api.stripe","pk":3,"fields":{"name":"Blue","color":"0000ff","active":true}},{"model":"ttkd_api.stripe","pk":4,"fields":{"name":"Yellow","color":"ffff00","active":true}},{"model":"ttkd_api.stripe","pk":5,"fields":{"name":"Orange","color":"ffa500","active":true}},{"model":"ttkd_api.stripe","pk":6,"fields":{"name":"Green","color":"00ff00","active":true}}]'):
        dump_import.append(item)
    for item in belts_and_stripes:
        dump_import.append(item)

open("dump.json",'w').write(json.dumps(dump_import))

os.system("python ../ttkd_api/manage.py loaddata dump.json")
os.remove("dump.json")
