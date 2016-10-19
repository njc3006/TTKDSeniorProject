"""AttendanceRecordSerializer"""
import datetime
from rest_framework import serializers
from ..models.attendance_record import AttendanceRecord


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """
    AttendanceRecordSerializer Outputs Attendance Model as JSON
    """
    date = serializers.DateField(required=False, default=datetime.datetime.now().date())

    class Meta:
        model = AttendanceRecord
        fields = ('person', 'program', 'date')
