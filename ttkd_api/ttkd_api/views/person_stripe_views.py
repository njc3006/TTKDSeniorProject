"""PersonStripeViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_stripe_serializer import PersonStripeSerializer, DetailedPersonStripeSerializer
from ..models.person_stripe import PersonStripe
from rest_framework import permissions

class DetailedPersonStripeViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all PersonStripe Objects To The Route with detailed stripe info, Or An Instance If Given A PK.
    Filters: person, current_stripe
    """
    queryset = PersonStripe.objects.all()
    serializer_class = DetailedPersonStripeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'current_stripe')


class PersonStripeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    """
    GET: Returns all PersonStripe Objects To The Route, Or An Instance If Given A PK.
    Filters: person
    POST: Create a person stripe record
    """
    queryset = PersonStripe.objects.all()
    serializer_class = PersonStripeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'current_stripe',)
