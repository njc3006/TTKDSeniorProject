"""AttendanceRecordViewSet"""
import django_filters
from django_filters import rest_framework as drf_filters
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer, \
    AttendanceRecordSerializerUsingPerson, DetailedAttendanceRecordSerializer
from ..models.attendance_record import AttendanceRecord

class DateRangeFilter(drf_filters.FilterSet):
    class Meta:
        model = AttendanceRecord
        fields = {
            'person': ['exact'],
            'program': ['exact'],
            'date': ['gte', 'lte']
        }

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
    filter_class = DateRangeFilter
    #filter_fields = ('person', 'program', 'date',)

class DetailedAttendanceRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = DetailedAttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = DateRangeFilter
    #filter_fields = ('person', 'program',)

class AttendanceRecordUsingPersonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an object.
    Filters: person, program, time
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializerUsingPerson
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)
