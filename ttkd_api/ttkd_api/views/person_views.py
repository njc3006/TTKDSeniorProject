"""PersonViewSet"""

import os
from PIL import Image
from ..settings import BASE_DIR
from rest_framework import viewsets, filters, permissions
from ..serializers.person_serializer import PersonSerializer, PersonPictureSerializer, \
    NotesPersonSerializer, PersonMinimalSerializer
from ..models.person import Person
from ..permissions import custom_permissions

from django_filters import rest_framework as drf_filters

from rest_framework.decorators import detail_route, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST


class PersonFilter(drf_filters.FilterSet):
    class Meta:
        model = Person
        fields = {
            'first_name': ['exact', 'contains'],
            'last_name': ['exact', 'contains'],
            'active': ['exact']
        }

class PersonViewSet(viewsets.ModelViewSet):
    permission_classes = (custom_permissions.IsAdminOrAuthReadOnly,)
    """
    Returns all Person objects to the Route.
    GET: Returns all PersonStripe Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific person. DO NOT SEND EMERGENCY CONTACTS AS NULL
    PATCH: NOT SUPPORTED
    POST: NOT SUPPORTED
    Filters: first_name, last_name, active
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PersonFilter
    #filter_fields = ('first_name', 'last_name', 'active',)


class PersonPictureViewSet(viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Person.objects.all()
    serializer_class = PersonPictureSerializer

    @detail_route(methods=['POST'])
    @parser_classes((FormParser, MultiPartParser,))
    def picture(self, request, *args, **kwargs):
        if 'file' in request.data:
            person = self.get_object()

            person.picture.delete()

            upload = request.data['file']
            person.picture.save(upload.name, upload)

            win_path = os.path.join(BASE_DIR, person.picture.url)

            # crop the image to be square
            print(win_path)
            img = Image.open(win_path)

            # get the uploaded width and height
            width, height = img.size

            # if the width is larger crop the image width to be square
            if width > height:
                delta = width - height
                x1 = delta/2
                x2 = width - (delta/2)
                y1 = 0
                y2 = height
            # if the height is larger crop the height to be square
            else:
                delta = height - width
                x1 = 0
                x2 = width
                y1 = delta/2
                y2 = height - (delta/2)
            img = img.crop((x1, y1, x2, y2))
            img.save(win_path)

            return Response(status=HTTP_201_CREATED, headers={'Location': person.picture.url})
        else:
            return Response(status=HTTP_400_BAD_REQUEST)


class PersonNotesViewSet(viewsets.ModelViewSet):
    """
    Returns all Person objects to the Route with id and misc_notes.
    GET: Returns all PersonStripe Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific person's misc_notes.
    POST: NOT SUPPORTED
    """
    permission_classes = (custom_permissions.IsAuthenticatedOrOptions,)
    queryset = Person.objects.all()
    serializer_class = NotesPersonSerializer

class PersonMinimalViewSet(viewsets.ModelViewSet):
    """
    Returns all Person objects to the Route with id, first, and last name.
    GET: Returns all person objexts, Or An Instance If Given A PK.
    PUT: NOT SUPPORTED
    POST: NOT SUPPORTED
    """
    permission_classes = (custom_permissions.ReadOnly,)
    queryset = Person.objects.all()
    serializer_class = PersonMinimalSerializer