"""InstructorAttendanceRecordSerializer"""
import datetime
from rest_framework import serializers
from ..models.instructor_attendance_record import InstructorAttendanceRecord
from .program_serializer import ProgramSerializer


class InstructorAttendanceRecordSerializer(serializers.ModelSerializer):
    """
    InstructorAttendanceRecordSerializer Outputs Instructor Attendance Model as JSON with person
    and program as an ID
    """
    date = serializers.DateField(required=False, default=datetime.date.today)

    class Meta:
        model = InstructorAttendanceRecord


class DetailedInstructorAttendanceRecordSerializer(serializers.ModelSerializer):
    """
    DetailedInstructorAttendanceRecordSerializer Outputs Instructor Attendance Model as JSON with
    program as JSON object
    """
    program = ProgramSerializer()

    class Meta:
        model = InstructorAttendanceRecord

