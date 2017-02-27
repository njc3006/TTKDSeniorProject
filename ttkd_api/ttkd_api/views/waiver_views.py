"""WaiverViewSet"""
from rest_framework import viewsets, filters
from rest_framework.decorators import detail_route, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from ..serializers.waiver_serializer import WaiverSerializer, WaiverImageSerializer
from ..models.waiver import Waiver
from ..permissions import custom_permissions


class WaiverViewSet(viewsets.ModelViewSet):
    """
    GET: Returns all Waiver Objects To The Route, Or An Instance If Given A PK. Filters: person
    POST: Create A Waiver (a no auth user should be able to make this during registration so no permission lock)
    """
    queryset = Waiver.objects.all()
    serializer_class = WaiverSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('person',)


class WaiverImageViewSet(viewsets.GenericViewSet):
    """
    POST: Upload a Waiver. Needs {'waiver_image' : ''} (for browsable api to work) or {'file' : ''}

    URL that uses this view set: api/waiver/(?P<pk>[0-9]+)/image
    """
    permission_classes = (custom_permissions.IsAdminOrReadOnly,)
    queryset = Waiver.objects.all()
    serializer_class = WaiverImageSerializer

    @detail_route(methods=['POST'])
    @parser_classes((FormParser, MultiPartParser,))
    def waiver_image(self, request, *args, **kwargs):
        if 'waiver_image' in request.data:
            waiver = self.get_object()

            upload = request.data['waiver_image']

            waiver.waiver_image.save(upload.name, upload)

            return Response(status=HTTP_201_CREATED, headers={'Location': waiver.waiver_image.url})
        elif 'file' in request.data:
            waiver = self.get_object()

            upload = request.data['file']

            waiver.waiver_image.save(upload.name, upload)

            return Response(status=HTTP_201_CREATED, headers={'Location': waiver.waiver_image.url})
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

