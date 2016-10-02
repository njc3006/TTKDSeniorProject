"""PersonSerializer"""
from rest_framework import serializers
from ..models.attendance_record import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """

    class Meta:
        model = Person
        # No Fields declaration to use all the fields of the model
