"""PersonSerializer"""
from rest_framework import serializers
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..models.attendance_record import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    emails = EmailSerializer(many=True)
    emergency_contacts = EmergencyContactSerializer(many=True)

    class Meta:
        model = Person
        fields = ('first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone', 'street',
                  'city', 'zipcode', 'state', 'belt', 'stripes', 'extra_strips', 'misc_notes',
                  'active', 'emails', 'emergency_contacts')
