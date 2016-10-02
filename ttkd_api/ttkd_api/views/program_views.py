"""ProgramViewSet"""
from rest_framework import viewsets, mixins
from ..serializers.program_serializer import ProgramSerializer
from ..models.program import Program


class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns all Program Objects To The Route, Or An Instance If Given A PK"""
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ProgramCreateSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Create A Program"""
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
