"""RegistrationSerializer"""
from string import capwords
import datetime
from rest_framework import serializers

from .person_serializer import PersonSerializer, MinimalPersonSerializer
from .people_serializer import PeopleSerializer
from ..models.registration import Registration
from ..models.person import Person
from ..models.email import Email
from ..models.emergency_contact import EmergencyContact
from ..models.belt import Belt
from ..models.person_belt import PersonBelt


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

        person_data['first_name'] = capwords(person_data['first_name'])
        person_data['last_name'] = capwords(person_data['last_name'])

        person = Person.objects.create(**person_data)

        for an_email_dict in email_data:
            Email.objects.create(person=person, email=an_email_dict['email'])

        if emergency_contact_1_data is not None:
            person.emergency_contact_1 = EmergencyContact.objects.create(
                relation=capwords(emergency_contact_1_data['relation']),
                phone_number=emergency_contact_1_data['phone_number'],
                full_name=capwords(emergency_contact_1_data['full_name']))

        if emergency_contact_2_data is not None:
            person.emergency_contact_2 = EmergencyContact.objects.create(
                relation=capwords(emergency_contact_2_data['relation']),
                phone_number=emergency_contact_2_data['phone_number'],
                full_name=capwords(emergency_contact_2_data['full_name']))

        person.save()

        # Try and find an active white belt to assign to this new person
        try:
            belt = Belt.objects.get(name__contains='white', active=True)
        except Belt.DoesNotExist:
            # If an active white belt could not be found, try and get the first belt in the system
            try:
                belt = Belt.objects.first()
            except Belt.DoesNotExist:
                # There was not a belt with an id of 1, likely no belts in the system, should never
                # happen as deletion of belts is not possible
                belt = None

        if belt is not None:
            PersonBelt.objects.create(person=person, belt=belt, date_achieved=datetime.date.today())

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


class MinimalRegistrationSerializer(serializers.ModelSerializer):
    """
    MinimalRegistrationSerializer Outputs Registration Model as JSON with a minimal person
    """
    person = MinimalPersonSerializer()

    class Meta:
        model = Registration
        # No Fields declaration to use all the fields of the model


class SimpleRegistrationSerializer(serializers.ModelSerializer):
    """
    SimpleRegistrationSerializer Outputs Registration Model as JSON with only a PK for person
    """
    class Meta:
        model = Registration
        # No Fields declaration to use all the fields of the model


class RegistrationWithPeopleSerializer(serializers.ModelSerializer):
    """
    RegistrationSerializer Outputs Registration Model as JSON
    """
    person = PeopleSerializer()

    class Meta:
        model = Registration
        # No Fields declaration to use all the fields of the model
