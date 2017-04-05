"""AttendanceRecordViewSet"""
import django_filters
from django_filters import rest_framework as drf_filters
from django_filters import filters as df_filters
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer, \
    AttendanceRecordSerializerUsingPerson, DetailedAttendanceRecordSerializer
from ..models.attendance_record import AttendanceRecord
from ..permissions import custom_permissions

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *

class AttendanceRecordPagination(PageNumberPagination):
    page_size = 125
    page_size_query_param = 'page_size'
    max_page_size = 500

class NumberInFilter(df_filters.BaseInFilter, df_filters.NumberFilter):
    pass

class DateRangeFilter(drf_filters.FilterSet):
    person = NumberInFilter()

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
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = AttendanceRecord.objects.all().order_by('-date', 'person__last_name', 'person__first_name')
    serializer_class = DetailedAttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = DateRangeFilter
    pagination_class = AttendanceRecordPagination

class AttendanceRecordUsingPersonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns All AttendanceRecord Objects To The Route AKA Check-ins with person as an object.
    Filters: person, program, time
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializerUsingPerson
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'program', 'date',)

@api_view(['GET', ])
def get_grouped_attendance_records(request):
    """
    Query Params:
    person__in
    date__gte
    date__lte
    program
    """
    filtered_records = DateRangeFilter(
        request.GET,
        AttendanceRecord.objects.all()
    )

    grouped_records = {}
    for record in filtered_records:
        if not (record.person.id in grouped_records):
            grouped_records[record.person.id] = {
                'name': record.person.first_name + ' ' + record.person.last_name,
                'programs': {},
            }

            grouped_records[record.person.id]['programs'][record.program.id] = {
                'name': record.program.name,
                'min_date': record.date,
                'max_date': record.date,
                'count': 1
            }
        else:
            student = grouped_records[record.person.id]
            if record.program.id in student['programs']:
                program = student['programs'][record.program.id]
                program['count'] += 1

                if record.date > program['max_date']:
                    program['max_date'] = record.date
                elif record.date < program['min_date']:
                    program['min_date'] = record.date
            else:
                student['programs'][record.program.id] = {
                    'name': record.program.name,
                    'min_date': record.date,
                    'max_date': record.date,
                    'count': 1
                }

    return Response(sorted(grouped_records.items(), key=lambda r: r[1]['name']))
