"""UserViewSet"""
from ..serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import permissions, viewsets


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAdminUser,)
    """
    Returns all User objects to the Route
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer