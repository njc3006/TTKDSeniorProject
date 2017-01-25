"""ProgramSerializer"""
from rest_framework import serializers
from ..models.attendance_record import Program


class ProgramSerializer(serializers.ModelSerializer):
    """
    ProgramSerializer Outputs Program Model as JSON
    """

    class Meta:
        model = Program
        # No Fields declaration to use all the fields of the model
