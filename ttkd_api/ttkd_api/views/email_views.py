"""EmailViewSet"""
from rest_framework import viewsets, mixins
from ..serializers.email_serializer import EmailSerializer
from ..models.email import Email


class EmailViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns all Email Objects To The Route, Or An Instance If Given A PK"""
    queryset = Email.objects.all()
    serializer_class = EmailSerializer


class EmailCreateSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Create A Email"""
    queryset = Email.objects.all()
    serializer_class = EmailSerializer



