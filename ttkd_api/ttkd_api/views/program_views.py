"""ProgramViewSet"""
from django.db.models.functions import Lower
from rest_framework import viewsets, filters, permissions
from ..serializers.program_serializer import ProgramSerializer
from ..serializers.registration_serializer import RegistrationSerializer
from ..models.program import Program
from ..models.registration import Registration
from ..permissions import custom_permissions


class ProgramViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Program Objects To The Route, Or An Instance If Given A PK
    POST: Create A Program
    """
    permission_classes = (custom_permissions.IsAdminOrReadOnly,)
    queryset = Program.objects.all().order_by(Lower('name'))
    serializer_class = ProgramSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('name', 'active',)


class StudentList(viewsets.ReadOnlyModelViewSet):
    """
    Get The Student List for a given program, you must specify ?program=<id> to get a student
    list for a given program. Filters: program
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program',)
