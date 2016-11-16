import json

students_file = open("students.json").read()
attendances_file = open("attendances.json").read()
classes_file = open("classes.json").read()
programs_file = open("programs.json").read()
dump_file = open("dump.json").read()
dump_import = json.loads(dump_file)

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

person_pk = 1
emergency_pk = 1
email_pk = 1
for student in students_import:
	students[student['_id']['$oid']] = {
		"model": "ttkd_api.person",
		"pk": person_pk,
		"fields": {
			"first_name": student['firstname'],
			"last_name": student['lastname'],
			"dob": student['birthday']['date'][:10],
			"primary_phone": student['phone']['home'],
			"secondary_phone": student['phone']['cell'],
			"street": student['adrress']['street'],
			"city": student['adrress']['city'],
			"zipcode": student['adrress']['zip'],
			"state": student['adrress']['state'],
			"misc_notes": "",
			"active": true,
			"emergency_contact_1": emergency_pk,
			"emergency_contact_2": emergency_pk + 1,
			"picture_path": ""
	}
	for email in student['emailAddresses']:
		emails.append({
			"model": "ttkd_api.email",
			"pk": email_pk,
			"fields": {
				"person": person_pk,
				"email": email
			}
		})
		email_pk += 1

	for contact in student['emergencyContacts']:
		emergency_contacts.append({
			"model": "ttkd_api.emergencycontact",
			"pk": emergency_pk,
			"fields": {
				"relation": contact['relationship'],
				"phone_number": contact['phoneNumber'],
				"full_name": contact['name']
			}
		})
		emergency_pk += 1

	person_pk += 1

programs = {}
for program in programs_import:
	programs[program['_id']['$oid']] = program['name']

classes = {}
registrations = []
class_pk = 1
registration_pk = 1
for import_class in classes_import:
	