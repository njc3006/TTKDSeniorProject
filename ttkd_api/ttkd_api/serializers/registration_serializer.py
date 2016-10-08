"""PersonSerializer"""
from rest_framework import serializers

from .person_serializer import PersonSerializer
from ..models.registration import Registration
from ..models.person import Person
from ..models.email import Email


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
        Create a person, their emails, and then register them for a program
        """
        person_data = validated_data.pop('person')
        email_data = person_data.pop('emails')

        person = Person.objects.create(**person_data)

        for an_email_dict in email_data:
            Email.objects.create(person=person, email=an_email_dict['email'])

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
