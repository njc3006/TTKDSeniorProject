"""AttendanceRecordSerializer"""
import datetime
from rest_framework import serializers
from ..models.attendance_record import AttendanceRecord


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """
    AttendanceRecordSerializer Outputs Attendance Model as JSON
    """
    time = serializers.DateTimeField(required=False, default=datetime.datetime.now())

    class Meta:
        model = AttendanceRecord
        fields = ('person', 'program', 'time')
