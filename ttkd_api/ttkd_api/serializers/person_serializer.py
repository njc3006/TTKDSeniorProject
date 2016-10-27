"""PersonSerializer"""
from rest_framework import serializers
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..serializers.registration_program_serializer import RegistrationProgramSerializer
from ..models.person import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    emails = EmailSerializer(many=True)
    emergency_contacts = EmergencyContactSerializer(many=True)
    classes = RegistrationProgramSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone',
                  'street', 'city', 'zipcode', 'state', 'belt',
                  'misc_notes', 'active', 'emails', 'emergency_contacts', 'classes')

