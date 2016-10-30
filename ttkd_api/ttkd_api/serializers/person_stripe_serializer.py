"""PersonStripeSerializer"""
from rest_framework import serializers
from ..models.person_stripe import PersonStripe


class PersonStripeSerializer(serializers.ModelSerializer):
    """
    PersonStripeSerializer Outputs PersonStripe Model as JSON
    """
    class Meta:
        model = PersonStripe
        # No Fields declaration to use all the fields of the model
