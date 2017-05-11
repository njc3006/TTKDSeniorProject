"""PersonBeltViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_belt_serializer import PersonBeltSerializer, DetailedPersonBeltSerializer
from ..models.person_belt import PersonBelt
from rest_framework import permissions

class DetailedPersonBeltViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns all PersonBelt Objects To The Route, with detailed information on belt Or An Instance If Given A PK.
    Filters: person, belt
    """
    queryset = PersonBelt.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = DetailedPersonBeltSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'belt')

class PersonBeltViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all PersonBelt Objects To The Route, Or An Instance If Given A PK.
    Filters: person, belt
    POST: Create a person Belt record
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = PersonBelt.objects.all()
    serializer_class = PersonBeltSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'belt')
