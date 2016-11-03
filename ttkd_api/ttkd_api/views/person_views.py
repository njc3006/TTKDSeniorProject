"""PersonViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_serializer import PersonSerializer
from ..models.person import Person
from rest_framework import permissions


class PersonViewSet(viewsets.ModelViewSet):
    """
    Returns all Person objects to the Route. Filters: first_name, last_name, belt, active
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('first_name', 'last_name', 'active',)
