"""PersonSerializer"""
from rest_framework import serializers
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..serializers.person_belt_serializer import PersonBeltSerializer
from ..models.person import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    emails = EmailSerializer(many=True)
    belts = PersonBeltSerializer(many=True, read_only=True)
    emergency_contact_1 = EmergencyContactSerializer(required=False)
    emergency_contact_2 = EmergencyContactSerializer(required=False)

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone',
<<<<<<< HEAD
                  'street', 'city', 'zipcode', 'state', 'belts', 'emails',
                  'emergency_contact_1', 'emergency_contact_2', 'misc_notes', 'picture_url', 'active')

class PersonPictureSerializer(serializers.HyperlinkedModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
=======
                  'street', 'city', 'zipcode', 'state', 'belts', 'emails', 'emergency_contact_1',
                  'emergency_contact_2', 'misc_notes', 'picture_path', 'active')


class MinimalPersonSerializer(serializers.ModelSerializer):
    """
    MinimumPersonSerializer Outputs Person Model as JSON with very limited fields
>>>>>>> 98944fbac3b09c0c82e57b61e5646fabd606b6e1
    """

    class Meta:
        model = Person
<<<<<<< HEAD
        fields = ('id', 'picture')
        readonly_fields = ('picture')


=======
        fields = ('id', 'first_name', 'last_name', 'picture_path', 'active')
>>>>>>> 98944fbac3b09c0c82e57b61e5646fabd606b6e1
