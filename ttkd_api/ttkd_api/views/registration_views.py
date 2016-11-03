"""RegistrationViewSet"""
from rest_framework import viewsets, filters
from ..serializers.registration_serializer import RegistrationSerializer
from ..models.registration import Registration
from rest_framework import permissions


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Registration Objects To The Route, Or An Instance If Given A PK Filters:
    program, person
    POST: Create A Registration Which Includes Creating A New Person and Registering Them To A
    Program
    Note: Emails must be of the form [{"email": "email@email.com"}, {"email": "email2@email.com"}]
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person',)

