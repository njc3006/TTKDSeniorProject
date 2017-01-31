"""UserViewSet"""
from ..serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import viewsets
from ..permissions import custom_permissions


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (custom_permissions.IsUserOrReadOnly,)
    """
    Returns all User objects to the Route.
    GET: Returns all User Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific User.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer