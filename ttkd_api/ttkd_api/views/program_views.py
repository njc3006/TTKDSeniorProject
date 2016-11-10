"""ProgramViewSet"""
from rest_framework import viewsets, filters
from ..serializers.program_serializer import ProgramSerializer
from ..serializers.registration_serializer import RegistrationSerializer
from ..models.program import Program
from ..models.registration import Registration
from rest_framework import permissions


class ProgramViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    """
    GET: Returns all Program Objects To The Route, Or An Instance If Given A PK
    POST: Create A Program
    """
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name', 'active',)


class StudentList(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    """
    Get The Student List for a given program, you must specify ?program=<id> to get a student
    list for a given program. Filters: program
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program',)
