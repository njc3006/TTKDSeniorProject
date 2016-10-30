"""EmailSerializer"""
from rest_framework import serializers
from ..models.email import Email
from ..models.person import Person


class EmailSerializer(serializers.ModelSerializer):
    """
    EmailSerializer Outputs Email Model as JSON
    """
    person = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all(), required=False)

    class Meta:
        model = Email
        # No Fields declaration to use all the fields of the model
