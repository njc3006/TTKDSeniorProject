"""BeltSerializer"""
from rest_framework import serializers
from ..models.belt import Belt
from ..models.person import Person


class BeltSerializer(serializers.ModelSerializer):
    """
    BeltSerializer Outputs Belt Model as JSON
    """
    class Meta:
        model = Belt
        # No Fields declaration to use all the fields of the model
