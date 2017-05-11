"""StripeViewSet"""
from rest_framework import viewsets, filters
from ..serializers.stripe_serializer import StripeSerializer
from ..models.stripe import Stripe
from ..permissions import custom_permissions


class StripeViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Stripe Objects To The Route, Or An Instance If Given A PK.
    Filters: active
    POST: Create A Stripe
    """
    permission_classes = (custom_permissions.IsAdminOrReadOnly,)
    queryset = Stripe.objects.all()
    serializer_class = StripeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('active',)
