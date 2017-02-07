"""PersonBeltSerializer"""
from rest_framework import serializers

from .belt_serializer import BeltSerializer
from ..models.person_belt import PersonBelt


class PersonBeltSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs PersonBelt Model as JSON
    """

    def update(self, instance, validated_data):
        instance.person = validated_data.get('person', instance.person)
        instance.belt = validated_data.get('belt', instance.belt)
        instance.date_achieved = validated_data.get('date_achieved', instance.date_achieved)
        instance.current_belt = validated_data.get('current_belt', instance.current_belt)

        instance.person.belt = instance.belt

        instance.person.save()

        instance.save()
        return instance

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
