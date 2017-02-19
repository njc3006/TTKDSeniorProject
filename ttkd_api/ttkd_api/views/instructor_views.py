"""InstructorViewSet"""
from rest_framework import viewsets, filters

from ..models import Instructor
from ..serializers.instructor_serializer import MinimalInstructorSerializer, InstructorSerializer


class MinimalInstructorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns all Instructors (with limited persons) objects to the Route.
    Filters: program
    """
    queryset = Instructor.objects.all()
    serializer_class = MinimalInstructorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person')


class InstructorViewSet(viewsets.ModelViewSet):
    """
    Returns all Instructors objects to the Route.
    Filters: program
    """
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person')
