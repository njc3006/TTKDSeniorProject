import json, sys, os
from random import randint

MAX_EMAILS = 10
MAX_STUDENTS = 1500
MAX_ATTENDANCE_RECORDS = MAX_STUDENTS * 20
MAX_CLASSES = 100
MAX_ENROLLMENT = 100

class AttendanceRecord:
    """
    AttendanceRecord makes it easy to keep track of attendance records we have already seen
    eq is implemented for comparison, specifically so we can do if x in set
    hash is implemented so we can put these objects in a set
    """
    def __init__(self, per, pro, day):
        self.person = per
        self.program = pro
        self.date = day

    def __eq__(self, other):
        return (self.person == other.person) and (self.program == other.program) and \
               (self.date == other.date)

    def __hash__(self):
        return hash((self.person, self.program, self.date))

try:
    os.remove("../ttkd_api/db.sqlite3")
    print("Removed old database")
except:
    print("Failed to remove old database")

os.system("python ../ttkd_api/manage.py migrate")
os.system("python ../ttkd_api/manage.py dumpdata > stress.json")

dump_import = []
if os.path.exists('stress.json'):
    dump_file = open("stress.json").read()
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

models_changing.append("ttkd_api.belt")
models_changing.append("ttkd_api.stripe")
for i in range(len(dump_import) - 1, -1, -1): # run backwards so we dont get indexing issues as we remove indexs
    if dump_import[i]["model"] in models_changing:
        del dump_import[i]

stress_data = open("stressdata.txt",'r').read().split('\n')

first_names = stress_data[0].split(',')
last_names = stress_data[1].split(',')
relationships = stress_data[2].split(',')
street_names = stress_data[3].split(',')
cities = stress_data[4].split(',')
states = stress_data[5].split(',')
fake_emails = stress_data[6].split(',')
class_adjectives = stress_data[7].split(',')

students = []
emails = []
emergency_contacts = []
belts_and_stripes = []

emergency_pk = 1
email_pk = 1
stripe_pk = 1

for person_pk in range(1, MAX_STUDENTS):

    random_belt = int(randint(1,11))
    tmp_last_name = last_names[randint(0,len(last_names) - 1)]

    students.append({
        "model": "ttkd_api.person",
        "pk": person_pk,
        "fields": {
            "first_name": first_names[randint(0,len(first_names) - 1)],
            "last_name": tmp_last_name,
            "dob": str(int(randint(1960, 2013))) + "-" + str(int(randint(1, 12))) + "-" + str(int(randint(1, 28))),
            "primary_phone": str(randint(1000000000,9999999999)),
            "secondary_phone": str(randint(1000000000,9999999999)),
            "street": str(randint(1,900)) + " " + street_names[randint(0,len(street_names) - 1)] + " st",
            "city": cities[randint(0,len(cities) - 1)],
            "zipcode": str(randint(10000,99999)),
            "state": states[randint(0,len(states) - 1)],
            "misc_notes": "",
            "active": randint(1,50)%50 != 0,
            "emergency_contact_1": emergency_pk,
            "emergency_contact_2": emergency_pk + 1,
            "belt" : random_belt
        }
    })

    for j in range(0, randint(1, MAX_EMAILS)):
        emails.append({
            "model": "ttkd_api.email",
            "pk": email_pk,
            "fields": {
                "person": person_pk,
                "email": fake_emails[randint(0,len(fake_emails) - 1)]
            }
        })
        email_pk += 1

    for i in range(2):
        emergency_contacts.append({
            "model": "ttkd_api.emergencycontact",
            "pk": emergency_pk,
            "fields": {
                "relation": relationships[randint(0,len(relationships) - 1)],
                "phone_number": str(randint(1000000000,9999999999)),
                "full_name": first_names[randint(0,len(first_names) - 1)] + " " + tmp_last_name
            }
        })
        emergency_pk += 1

    belts_and_stripes.append({
        "model": "ttkd_api.personbelt",
        "pk": person_pk,
        "fields": {
            "person": person_pk,
            "belt": random_belt,
            "date_achieved": str(int(randint(2012, 2016))) + "-" + str(int(randint(1, 12))) + "-" + str(int(randint(1, 28))),
        }
    })

    for i in range(0,randint(0,6)):
        belts_and_stripes.append({
            "model": "ttkd_api.personstripe",
            "pk": stripe_pk,
            "fields": {
                "person": person_pk,
                "stripe": int(randint(1,6)),
                "date_achieved": str(int(randint(2012, 2016))) + "-" + str(int(randint(1, 12))) + "-" + str(int(randint(1, 28))),
                "current_stripe": True
            }
        })

        stripe_pk += 1


classes = []
class_names = []
registrations = []
registration_pk = 1
for class_pk in range(1,randint(10,MAX_CLASSES)):
    class_name = class_adjectives[randint(0,len(class_adjectives) - 1)] + " "
    while class_name[:-1] in class_names:
        class_name += class_adjectives[randint(0,len(class_adjectives) - 1)] + " "
    class_name = class_name[:-1] # chop off the extra space
    class_names.append(class_name) # So we don't recreate the same class name.

    classes.append({
        "model": "ttkd_api.program",
        "pk": class_pk,
        "fields": {
            "name": class_name,
            "active": randint(1,100) % 100 != 0
        }
    })

    enrolled_students = []

    for j in range(randint(1,MAX_ENROLLMENT)):
        student_pk = randint(1, len(students))
        while student_pk in enrolled_students:
            student_pk = randint(1, len(students))

        registrations.append({
            "model": "ttkd_api.registration",
            "pk": registration_pk,
            "fields": {
                "person": student_pk,
                "program": class_pk,
            }
        })

        registration_pk += 1


attendances = []

# Use a set because it is much faster
attendance_set = set()

# This for loop was modified because our import data has checkins to the same program on the same
# day, which is bad data, and we can clean it up to prevent our unique constraint from failing
for attendance_pk in range(1,MAX_ATTENDANCE_RECORDS):
    person = randint(1, len(students))
    program = randint(1, len(classes))
    date = str(int(randint(2012, 2016))) + "-" + str(int(randint(1, 12))) + "-" + str(int(randint(1, 28)))

    attendance_record = AttendanceRecord(person, program, date)

    # If we have not seen this attendance record before, let's add it, otherwise ignore
    if attendance_record not in attendance_set:
        attendances.append({
            "model": "ttkd_api.attendancerecord",
            "pk": attendance_pk,
            "fields": {
                "person": person,
                "program": program,
                "date": date
            }
        })
        attendance_set.add(attendance_record)

for student in students:
    dump_import.append(student)

for email in emails:
    dump_import.append(email)

for contact in emergency_contacts:
    dump_import.append(contact)

for insert_class in classes:
    dump_import.append(insert_class)

for attendance in attendances:
    dump_import.append(attendance)

for registration in registrations:
    dump_import.append(registration)

for item in json.loads('[{"model":"ttkd_api.belt","pk":1,"fields":{"name":"White","primary_color":"ffffff","secondary_color":"ffffff","active":true}},{"model":"ttkd_api.belt","pk":2,"fields":{"name":"Yellow","primary_color":"ffff00","secondary_color":"ffff00","active":true}},{"model":"ttkd_api.belt","pk":3,"fields":{"name":"Orange","primary_color":"ffa500","secondary_color":"ffa500","active":true}},{"model":"ttkd_api.belt","pk":4,"fields":{"name":"Green","primary_color":"00ff00","secondary_color":"00ff00","active":true}},{"model":"ttkd_api.belt","pk":5,"fields":{"name":"Blue","primary_color":"0000ff","secondary_color":"0000ff","active":true}},{"model":"ttkd_api.belt","pk":6,"fields":{"name":"Purple","primary_color":"551a8b","secondary_color":"551a8b","active":true}},{"model":"ttkd_api.belt","pk":7,"fields":{"name":"Red","primary_color":"ff0000","secondary_color":"ff0000","active":true}},{"model":"ttkd_api.belt","pk":8,"fields":{"name":"Brown","primary_color":"f4a460","secondary_color":"f4a460","active":true}},{"model":"ttkd_api.belt","pk":9,"fields":{"name":"Hi-Brown","primary_color":"000000","secondary_color":"f4a460","active":true}},{"model":"ttkd_api.belt","pk":10,"fields":{"name":"Black","primary_color":"000000","secondary_color":"000000","active":true}},{"model":"ttkd_api.belt","pk":11,"fields":{"name":"Hi-Provisional","primary_color":"000000","secondary_color":"ff0000","active":true}},{"model":"ttkd_api.stripe","pk":1,"fields":{"name":"Black","color":"000000","active":true}},{"model":"ttkd_api.stripe","pk":2,"fields":{"name":"Red","color":"ff0000","active":true}},{"model":"ttkd_api.stripe","pk":3,"fields":{"name":"Blue","color":"0000ff","active":true}},{"model":"ttkd_api.stripe","pk":4,"fields":{"name":"Yellow","color":"ffff00","active":true}},{"model":"ttkd_api.stripe","pk":5,"fields":{"name":"Orange","color":"ffa500","active":true}},{"model":"ttkd_api.stripe","pk":6,"fields":{"name":"Green","color":"00ff00","active":true}}]'):
    dump_import.append(item)
for item in belts_and_stripes:
    dump_import.append(item)

open("stress.json",'w').write(json.dumps(dump_import))

os.system("python ../ttkd_api/manage.py loaddata stress.json")
os.remove("stress.json")
