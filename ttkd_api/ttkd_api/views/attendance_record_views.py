"""AttendanceRecordViewSet"""
from rest_framework import viewsets, filters
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer
from ..models.attendance_record import AttendanceRecord


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins.
    Filters: person, program, time
    POST: Create a Check-In record to the passed program,
    Time Is Not Required System Will Generate If Not Passed
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'time',)
