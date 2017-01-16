"""PersonBeltSerializer"""
from rest_framework import serializers

from .belt_serializer import BeltSerializer
from ..models.person_belt import PersonBelt


class PersonBeltSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs PersonBelt Model as JSON
    """

    class Meta:
        model = PersonBelt
        # No Fields declaration to use all the fields of the model


class DetailedPersonBeltSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs PersonBelt Model as JSON with only FK's for belt
    """
    belt = BeltSerializer()

    class Meta:
        model = PersonBelt
        # No Fields declaration to use all the fields of the model
