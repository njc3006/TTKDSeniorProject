"""StripeViewSet"""
from rest_framework import viewsets, filters
from ..serializers.stripe_serializer import StripeSerializer
from ..models.stripe import Stripe


class StripeViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Stripe Objects To The Route, Or An Instance If Given A PK. Filters: belt
    POST: Create A Stripe
    """
    queryset = Stripe.objects.all()
    serializer_class = StripeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('belt',)



