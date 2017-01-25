"""AttendanceRecordViewSet"""
from rest_framework import viewsets, filters
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer, \
    AttendanceRecordSerializerUsingPerson, AttendanceRecordSerializerForCSV
from ..models.attendance_record import AttendanceRecord
from rest_framework.settings import api_settings
from rest_framework_csv import renderers as r


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an ID.
    Filters: person, program, time
    POST: Create a Check-In record to the passed program,
    Time Is Not Required System Will Generate If Not Passed
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)


class AttendanceRecordUsingPersonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an object.
    Filters: person, program, time
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializerUsingPerson
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)
