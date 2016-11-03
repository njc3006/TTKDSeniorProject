"""PersonStripeViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_stripe_serializer import PersonStripeSerializer
from ..models.person_stripe import PersonStripe


class PersonStripeViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all PersonStripe Objects To The Route, Or An Instance If Given A PK.
    Filters: person
    POST: Create a person stripe record
    """
    queryset = PersonStripe.objects.all()
    serializer_class = PersonStripeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person', 'current_stripe',)



