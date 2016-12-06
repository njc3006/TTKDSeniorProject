"""PersonStripeSerializer"""
from rest_framework import serializers

from ..serializers.stripe_serializer import StripeSerializer
from ..models.person_stripe import PersonStripe


class PersonStripeSerializer(serializers.ModelSerializer):
    """
    PersonStripeSerializer Outputs PersonStripe Model as JSON
    """

    class Meta:
        model = PersonStripe
        # No Fields declaration to use all the fields of the model


class DetailedPersonStripeSerializer(serializers.ModelSerializer):
    """
    DetailedPersonStripeSerializer Outputs PersonStripe Model as JSON with a stripe object
    """
    stripe = StripeSerializer()

    class Meta:
        model = PersonStripe
        # No Fields declaration to use all the fields of the model
