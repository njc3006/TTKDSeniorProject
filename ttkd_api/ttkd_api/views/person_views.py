"""PersonViewSet"""
from rest_framework import viewsets, filters
from ..serializers.person_serializer import PersonSerializer, PersonPictureSerializer
from ..models.person import Person

from rest_framework.decorators import detail_route, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST


class PersonViewSet(viewsets.ModelViewSet):
    """
    Returns all Person objects to the Route. Filters: first_name, last_name, belt, active
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('first_name', 'last_name', 'active',)


class PersonPictureViewSet(viewsets.GenericViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonPictureSerializer

    @detail_route(methods=['POST'])
    @parser_classes((FormParser, MultiPartParser,))
    def picture(self, request, *args, **kwargs):
        if 'upload' in request.data:
            person = self.get_object()

            person.picture.delete()

            upload = request.data['upload']

            person.picture.save(upload.name, upload)

            return Response(status=HTTP_201_CREATED, headers={'Location': person.picture.url})
        else:
            return Response(status=HTTP_400_BAD_REQUEST)