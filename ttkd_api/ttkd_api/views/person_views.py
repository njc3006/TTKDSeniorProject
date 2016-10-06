"""PersonViewSet"""
from rest_framework import viewsets
from ..serializers.person_serializer import PersonSerializer
from ..models.person import Person


class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns all Person objects to the Route"""
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
