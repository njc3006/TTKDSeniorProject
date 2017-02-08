"""AttendanceRecordViewSet"""
import django_filters
from django_filters import rest_framework as drf_filters
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer, \
    AttendanceRecordSerializerUsingPerson, DetailedAttendanceRecordSerializer
from ..models.attendance_record import AttendanceRecord

class AttendanceRecordPagination(PageNumberPagination):
    page_size = 125
    page_size_query_param = 'page_size'
    max_page_size = 500

class DateRangeFilter(drf_filters.FilterSet):
    class Meta:
        model = AttendanceRecord
        fields = {
            'person': ['exact', 'in'],
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
    filter_fields = ('person', 'program', 'date',)

class DetailedAttendanceRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person and program as objects.
    This is endpoint is paginated, with  between 125 and 500 elements per page
    Filters: person, program, date__gte, date__lte
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = DetailedAttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = DateRangeFilter
    pagination_class = AttendanceRecordPagination

class AttendanceRecordUsingPersonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an object.
    Filters: person, program, time
    """
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializerUsingPerson
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)
