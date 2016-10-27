"""StripeSerializer"""
from rest_framework import serializers
from ..models.stripe import Stripe


class StripeSerializer(serializers.ModelSerializer):
    """
    StripeSerializer Outputs Stripe Model as JSON
    """
    class Meta:
        model = Stripe
        # No Fields declaration to use all the fields of the model
