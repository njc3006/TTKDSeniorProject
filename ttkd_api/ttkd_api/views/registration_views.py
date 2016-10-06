"""RegistrationViewSet"""
from rest_framework import viewsets, mixins
from ..serializers.registration_serializer import RegistrationSerializer
from ..models.registration import Registration


class RegistrationViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns all Registration Objects To The Route, Or An Instance If Given A PK"""
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer


class RegistrationCreateSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Create A Registration Which Includes Creating A New Person and Registering Them To A
    Program"""
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
