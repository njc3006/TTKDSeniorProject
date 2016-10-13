"""EmergencyContactSerializer"""
from rest_framework import serializers
from ..models.emergency_contact import EmergencyContact
from ..models.person import Person


class EmergencyContactSerializer(serializers.ModelSerializer):
    """
    EmergencyContactSerializer Outputs EmergencyContact Model as JSON
    """

    person = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all(), required=False)

    class Meta:
        model = EmergencyContact
        # No Fields declaration to use all the fields of the model
