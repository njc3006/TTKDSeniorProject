from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
import sys


@api_view(['POST', ])
def export_data(request):
    """
    An Url that is used to create a JSON export of the DB
    Only accepts POST with a {"file": "somefile.json"}
    NOTE THIS TAKES A FEW SECONDS
    """
    if 'file' in request.data:
        file = request.data['file']
        sysout = sys.stdout
        sys.stdout = open(file, 'w')
        call_command('dumpdata', 'ttkd_api')
        sys.stdout = sysout
        return Response(status=HTTP_200_OK)
    else:
        return Response("File missing from post data", status=HTTP_400_BAD_REQUEST)




