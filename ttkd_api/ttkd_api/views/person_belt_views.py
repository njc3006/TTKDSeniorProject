"""PersonBeltViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_belt_serializer import PersonBeltSerializer
from ..models.person_belt import PersonBelt


class PersonBeltViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all PersonBelt Objects To The Route, Or An Instance If Given A PK.
    Filters: person, current_belt, belt
    POST: Create a person Belt record
    """
    queryset = PersonBelt.objects.all()
    serializer_class = PersonBeltSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'current_belt', 'belt')
