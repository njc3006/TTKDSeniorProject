"""InstructorSerializer"""
from rest_framework import serializers

from ..serializers.program_serializer import MinimalProgramSerializer
from ..serializers.person_serializer import MinimalPersonSerializer
from ..models import Instructor


class MinimalInstructorSerializer(serializers.ModelSerializer):
    """
    InstructorSerializer Outputs Instructor Model as JSON with limited person information
    """
    person = MinimalPersonSerializer()
    program = MinimalProgramSerializer()

    class Meta:
        model = Instructor


class InstructorSerializer(serializers.ModelSerializer):
    """
    InstructorSerializer Outputs Instructor Model as JSON
    """

    class Meta:
        model = Instructor
