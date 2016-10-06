"""PersonSerializer"""
from rest_framework import serializers

from .person_serializer import PersonSerializer
from ..models.registration import Registration
from ..models.person import Person


class RegistrationSerializer(serializers.ModelSerializer):
    """
    RegistrationSerializer Outputs Registration Model as JSON
    """
    person = PersonSerializer()

    class Meta:
        model = Registration
        # No Fields declaration to use all the fields of the model

    def create(self, validated_data):
        person_data = validated_data.pop('person')
        person = Person.objects.create(**person_data)
        registration = Registration.objects.create(person=person, program=validated_data['program'])
        return registration