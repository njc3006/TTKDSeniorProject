"""RegistrationSerializer"""
from string import capwords
from rest_framework import serializers

from .person_serializer import PersonSerializer
from ..models.registration import Registration
from ..models.person import Person
from ..models.email import Email
from ..models.emergency_contact import EmergencyContact


class RegistrationSerializer(serializers.ModelSerializer):
    """
    RegistrationSerializer Outputs Registration Model as JSON
    """
    person = PersonSerializer()

    class Meta:
        model = Registration
        # No Fields declaration to use all the fields of the model

    def create(self, validated_data):
        """
        Create a person, their emails, their emergency contacts,
        and then register them for a program
        """
        person_data = validated_data.pop('person')
        email_data = person_data.pop('emails')

        emergency_contact_1_data = None
        emergency_contact_2_data = None

        if 'emergency_contact_1' in person_data:
            emergency_contact_1_data = person_data.pop('emergency_contact_1')

        if 'emergency_contact_2' in person_data:
            emergency_contact_2_data = person_data.pop('emergency_contact_2')

        person = Person.objects.create(**person_data)

        for an_email_dict in email_data:
            Email.objects.create(person=person, email=an_email_dict['email'])

        if person.emergency_contact_1 is not None:
            person.emergency_contact_1 = EmergencyContact.objects.create(
                relation=capwords(emergency_contact_1_data['relation']),
                phone_number=emergency_contact_1_data['phone_number'],
                full_name=capwords(emergency_contact_1_data['full_name']))

        if person.emergency_contact_2 is not None:
            person.emergency_contact_2 = EmergencyContact.objects.create(
                relation=capwords(emergency_contact_2_data['relation']),
                phone_number=emergency_contact_2_data['phone_number'],
                full_name=capwords(emergency_contact_2_data['full_name']))

        person.save()

        registration = Registration.objects.create(person=person, program=validated_data['program'])
        return registration

    def update(self, instance, validated_data):
        """
        Update the registration instance. Tho all of the person information has to be passed,
        only the program is updated via this serializer. This is only ever called for an instance
        PUT, for example doing a PUT to /api/registrations/9/

        If you want to update a person instance, PUT to the persons endpoint
        """
        instance.program = validated_data.get('program', instance.program)
        instance.save()
        return instance
