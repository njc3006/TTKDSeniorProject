"""UserSerializer"""
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    UserSerializer Outputs User Model as JSON
    """
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')
