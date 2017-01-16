"""RegistrationViewSet"""
from rest_framework import viewsets, filters
from ..serializers.registration_serializer import RegistrationSerializer, \
    SimpleRegistrationSerializer, RegistrationWithPeopleSerializer, MinimalRegistrationSerializer
from ..models.registration import Registration
from rest_framework import permissions


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Registration Objects To The Route, Or An Instance If Given A PK Filters:
    program, person
    POST: Create A Registration Which Includes Creating A New Person and Registering Them To A
    Program
    Note: Emails must be of the form [{"email": "email@email.com"}, {"email": "email2@email.com"}]
    Note: If you want emergency_contact_1 or emergency_contact_2 to be null in the db, DO NOT
    include them in a JSON object, if you include them but have them set to null this view will
    break
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person',)


class MinimalRegistrationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns all Registration Objects with minimal persons To The Route,
    Or An Instance If Given A PK
    Filters: program, person, person__active
    """
    queryset = Registration.objects.filter()
    serializer_class = MinimalRegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person', 'person__active')


class SimpleRegistrationViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Registration Objects To The Route with person as a PK,
    Or An Instance If Given A PK
    Filters: program, person
    POST: Create A Registration with an existing person by passing a PK of a person and program
    """
    queryset = Registration.objects.all()
    serializer_class = SimpleRegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person',)


class RegistrationWithPeopleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET: Returns all Registration Objects To The Route with a limited person model,
    Or An Instance If Given A PK
    Filters: program, person
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationWithPeopleSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person',)
