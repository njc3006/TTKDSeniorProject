"""AttendanceRecordSerializer"""
import datetime
from rest_framework import serializers
from ..models.attendance_record import AttendanceRecord
from .person_serializer import PersonSerializer


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """
    AttendanceRecordSerializer Outputs Attendance Model as JSON with person as an ID
    """
    date = serializers.DateField(required=False, default=datetime.date.today)

    class Meta:
        model = AttendanceRecord


class AttendanceRecordSerializerUsingPerson(serializers.ModelSerializer):
    """
    AttendanceRecordSerializer Outputs Attendance Model as JSON with Person as an Object
    """
    person = PersonSerializer()

    class Meta:
        model = AttendanceRecord
