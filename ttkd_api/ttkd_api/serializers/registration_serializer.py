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
from ..models.waiver import Waiver


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
        email_data = {}

        if 'emails' in person_data:
            email_data = person_data.pop('emails')

        waiver_data = {}
        if 'waivers' in person_data:
            waiver_data = person_data.pop('waivers')

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
            person.belt = belt
            person.save()

        # Because a person can have multiple waivers we have to iterate, however the list from the
        # UI will always be of size 1
        for waiver_dict in waiver_data:

            if 'guardian_signature' in waiver_dict:
                guardian_sig = waiver_dict['guardian_signature']
            else:
                guardian_sig = None

            Waiver.objects.create(person=person,
                                  waiver_signature=waiver_dict['waiver_signature'],
                                  guardian_signature=guardian_sig)

        if 'is_partial' not in validated_data:
            validated_data['is_partial'] = False

        registration = \
            Registration.objects.create(person=person, program=validated_data['program'],
                                        is_partial=validated_data['is_partial'])
        return registration

    def update(self, instance, validated_data):
        """
        Update the registration instance. This will also update the person object in that
        registration
        
        Does not support (it will just ignore you) updating belts, stripes, pictures
        """
        person_data = validated_data.pop('person')
        email_data = person_data.pop('emails')

        waiver_data = {}
        if 'waivers' in person_data:
            waiver_data = person_data.pop('waivers')

        emergency_contact_1_data = None
        emergency_contact_2_data = None

        if 'emergency_contact_1' in person_data:
            emergency_contact_1_data = person_data.pop('emergency_contact_1')

        if 'emergency_contact_2' in person_data:
            emergency_contact_2_data = person_data.pop('emergency_contact_2')

        # Capitalize first and last names
        person_data['first_name'] = capwords(person_data['first_name'])
        person_data['last_name'] = capwords(person_data['last_name'])

        # Update all of the fields of a person
        instance.person.first_name = person_data.get('first_name', instance.person.first_name)
        instance.person.last_name = person_data.get('last_name', instance.person.last_name)
        instance.person.dob = person_data.get('dob', instance.person.dob)
        instance.person.primary_phone = person_data.get('primary_phone', 
                                                        instance.person.primary_phone)
        instance.person.secondary_phone = person_data.get('secondary_phone',
                                                          instance.person.secondary_phone)
        instance.person.street = person_data.get('street', instance.person.street)
        instance.person.city = person_data.get('city', instance.person.city)
        instance.person.zipcode = person_data.get('zipcode', instance.person.zipcode)
        instance.person.state = person_data.get('state', instance.person.state)
        instance.person.misc_notes = person_data.get('misc_notes', instance.person.misc_notes)
        instance.person.active = person_data.get('active', instance.person.active)

        # If the person already has an emergency contact 1, update the values
        if instance.person.emergency_contact_1 is not None:
            instance.person.emergency_contact_1.relation = \
                emergency_contact_1_data.get('relation', 
                                             instance.person.emergency_contact_1.relation)
    
            instance.person.emergency_contact_1.phone_number = \
                emergency_contact_1_data.get('phone_number', 
                                             instance.person.emergency_contact_1.phone_number)
    
            instance.person.emergency_contact_1.full_name = \
                emergency_contact_1_data.get('full_name', 
                                             instance.person.emergency_contact_1.full_name)

            instance.person.emergency_contact_1.save()
            
        else:
            # The person does not have an emergency contact 1, make sure we have data for one before
            # trying to create one
            if emergency_contact_1_data is not None:
                instance.person.emergency_contact_1 = EmergencyContact.objects.create(
                    relation=capwords(emergency_contact_1_data['relation']),
                    phone_number=emergency_contact_1_data['phone_number'],
                    full_name=capwords(emergency_contact_1_data['full_name']))

        # If the person already has an emergency contact 2, update the values
        if instance.person.emergency_contact_2 is not None:
            instance.person.emergency_contact_2.relation = \
                emergency_contact_2_data.get('relation',
                                             instance.person.emergency_contact_2.relation)

            instance.person.emergency_contact_2.phone_number = \
                emergency_contact_2_data.get('phone_number',
                                             instance.person.emergency_contact_2.phone_number)

            instance.person.emergency_contact_2.full_name = \
                emergency_contact_2_data.get('full_name',
                                             instance.person.emergency_contact_2.full_name)

            instance.person.emergency_contact_2.save()

        else:
            # The person does not have an emergency contact 2, make sure we have data for one before
            # trying to create one
            if emergency_contact_2_data is not None:
                instance.person.emergency_contact_2 = EmergencyContact.objects.create(
                    relation=capwords(emergency_contact_2_data['relation']),
                    phone_number=emergency_contact_2_data['phone_number'],
                    full_name=capwords(emergency_contact_2_data['full_name']))

        # Remove all of the persons existing emails, so we can set them to the ones received in
        # the update Have to do this because emails could be deleted from the list, and new ones
        # could be added This is less expensive that trying to query the database to determine if
        # any of the emails were removed or modified
        instance.person.emails.all().delete()

        for an_email_dict in email_data:
            Email.objects.create(person=instance.person, email=an_email_dict['email'])

        # It's not likely that the person would have any waivers before this point, but delete
        # just in case and we will add what is in the put
        instance.person.waivers.all().delete()

        # Because a person can have multiple waivers we have to iterate, however the list from the
        # UI will always be of size 1
        for waiver_dict in waiver_data:

            if 'guardian_signature' in waiver_dict:
                guardian_sig = waiver_dict['guardian_signature']
            else:
                guardian_sig = None

            Waiver.objects.create(person=instance.person,
                                  waiver_signature=waiver_dict['waiver_signature'],
                                  guardian_signature=guardian_sig)

        instance.program = validated_data.get('program', instance.program)

        # If we are updating it, and it is not in the posted data,
        # we will assume this is no longer a partial registration
        instance.is_partial = validated_data.get('is_partial', False)

        instance.person.save()
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
