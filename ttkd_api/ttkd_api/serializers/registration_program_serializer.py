"""RegistrationProgramSerializer"""
from rest_framework import serializers
from ..models.registration import Registration


class RegistrationProgramSerializer(serializers.ModelSerializer):
    """
    RegistrationSerializer Outputs Registration Model Program as JSON, it does not include
    the id of the registration and the person
    """

    class Meta:
        model = Registration
        fields = ('program',)
        depth = 1
