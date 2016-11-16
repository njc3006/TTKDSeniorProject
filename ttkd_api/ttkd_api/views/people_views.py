"""PeopleViewSet"""
from rest_framework import viewsets, filters
from ..serializers.people_serializer import PeopleSerializer
from ..models.person import Person


class PeopleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns all People (limited persons) objects to the Route.
    Filters: first_name, last_name, belt, active
    """
    queryset = Person.objects.all()
    serializer_class = PeopleSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('first_name', 'last_name', 'active',)
