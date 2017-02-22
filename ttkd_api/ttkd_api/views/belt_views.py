"""BeltViewSet"""
from rest_framework import viewsets, filters
from ..serializers.belt_serializer import BeltSerializer
from ..models.belt import Belt
from ..permissions import custom_permissions


class BeltViewSet(viewsets.ModelViewSet):
    permission_classes = (custom_permissions.IsAdminOrReadOnly,)
    """
    GET: Returns all Belt Objects To The Route, Or An Instance If Given A PK. Filters: belt
    POST: Create A Belt
    """
    queryset = Belt.objects.all()
    serializer_class = BeltSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('active',)
