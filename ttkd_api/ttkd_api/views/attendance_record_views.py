"""AttendanceRecordViewSet"""
from rest_framework import viewsets, filters
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer, \
    AttendanceRecordSerializerUsingPerson
from ..models.attendance_record import AttendanceRecord
from rest_framework import permissions


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an ID.
    Filters: person, program, time
    POST: Create a Check-In record to the passed program,
    Time Is Not Required System Will Generate If Not Passed
    """
    permission_classes = (permissions.IsAuthenticated,)
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)


class AttendanceRecordUsingPersonViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an object.
    Filters: person, program, time
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializerUsingPerson
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)
