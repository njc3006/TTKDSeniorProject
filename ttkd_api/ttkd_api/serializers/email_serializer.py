"""EmailSerializer"""
from rest_framework import serializers
from ..models.email import Email


class EmailSerializer(serializers.ModelSerializer):
    """
    EmailSerializer Outputs Program Model as JSON
    """

    class Meta:
        model = Email
        # No Fields declaration to use all the fields of the model
