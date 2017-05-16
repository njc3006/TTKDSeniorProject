"""InstructorViewSet"""
from rest_framework import viewsets, filters
from ..models.instructor_attendance_record import InstructorAttendanceRecord
from ..serializers.instructor_attendance_record_serializer import \
    InstructorAttendanceRecordSerializer, DetailedInstructorAttendanceRecordSerializer
from ..models import Instructor
from ..serializers.instructor_serializer import MinimalInstructorSerializer, InstructorSerializer
from ..permissions import custom_permissions


class MinimalInstructorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns all Instructors (with limited persons) objects to the Route.
    Filters: program
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = Instructor.objects.all().order_by('person__first_name')
    serializer_class = MinimalInstructorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person')


class InstructorViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Instructors objects to the Route.
    POST: Create a new instructor
    Filters: program
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person')


class InstructorAttendanceViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Instructor attendance record objects to the Route.
    POST: Create a new instructor attendance record, date not required
    Filters: program
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = InstructorAttendanceRecord.objects.all()
    serializer_class = InstructorAttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person', 'date')


class DetailedInstructorAttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns all instructor attendance records with a full instructor object
    Filters: program
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = InstructorAttendanceRecord.objects.all()
    serializer_class = DetailedInstructorAttendanceRecordSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person')
