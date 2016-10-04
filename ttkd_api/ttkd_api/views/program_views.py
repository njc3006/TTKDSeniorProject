"""ProgramViewSet"""
from rest_framework import viewsets, mixins, generics
from ..serializers.program_serializer import ProgramSerializer
from ..serializers.registration_serializer import RegistrationSerializer
from ..models.program import Program
from ..models.registration import Registration


class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns all Program Objects To The Route, Or An Instance If Given A PK"""
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ProgramCreateSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Create A Program"""
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class StudentList(generics.ListAPIView):
    serializer_class = RegistrationSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases for
        the user as determined by the username portion of the URL.
        """
        program_id = self.kwargs['program_id']
        return Registration.objects.filter(program=Program.objects.get(id=program_id))