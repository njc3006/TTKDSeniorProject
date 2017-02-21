"""UserViewSet"""
from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    Returns all User objects to the Route
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
