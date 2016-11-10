"""RegistrationViewSet"""
from rest_framework import viewsets, filters
from ..serializers.registration_serializer import RegistrationSerializer, SimpleRegistrationSerializer
from ..models.registration import Registration


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


class SimpleRegistrationViewSet(viewsets.ModelViewSet):
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
    serializer_class = SimpleRegistrationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('program', 'person',)
