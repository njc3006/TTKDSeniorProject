"""PeopleSerializer"""
from rest_framework import serializers
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..models.person import Person
from ..serializers.belt_serializer import BeltSerializer


class PeopleSerializer(serializers.ModelSerializer):
    """
    PeopleSerializer Outputs Person Model as JSON with limited fields
    """
    emails = EmailSerializer(many=True)
    emergency_contact_1 = EmergencyContactSerializer()
    emergency_contact_2 = EmergencyContactSerializer()
    belt = BeltSerializer()

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'primary_phone', 'emails', 'belt', 'emergency_contact_1',
                  'emergency_contact_2', 'picture_url', 'active')

