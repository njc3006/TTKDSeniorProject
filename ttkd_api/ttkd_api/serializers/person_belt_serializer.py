"""PersonBeltSerializer"""
from rest_framework import serializers

from ..serializers.belt_serializer import BeltSerializer
from ..models.person_belt import PersonBelt


class PersonBeltSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs PersonBelt Model as JSON
    """
    belt = BeltSerializer()

    class Meta:
        model = PersonBelt
        # No Fields declaration to use all the fields of the model


class PersonBeltIDSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs PersonBelt Model as JSON with only FK's for belt
    """

    class Meta:
        model = PersonBelt
        # No Fields declaration to use all the fields of the model
