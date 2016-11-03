"""EmailViewSet"""
from rest_framework import viewsets, filters
from ..serializers.email_serializer import EmailSerializer
from ..models.email import Email
from rest_framework import permissions


class EmailViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    """
    GET: Returns all Email Objects To The Route, Or An Instance If Given A PK. Filters: person
    POST: Create A Email
    """
    queryset = Email.objects.all()
    serializer_class = EmailSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person',)



