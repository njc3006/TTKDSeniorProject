from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
from pathlib import Path


@api_view(['POST', ])
def import_data(request):
    """
    An Url that is used to import a JSON export of the DB
    Only accepts POST with a {"file": "somefile.json"}
    NOTE THIS TAKES A FEW SECONDS
    """
    if 'file' in request.data:
        file = request.data['file']
        my_file = Path(file)
        if my_file.is_file():
            # Flush because loaddata will keep records it has nothing on, this will truly clean the DB
            call_command('flush', interactive=False, load_initial_data=False)
            call_command('loaddata', file, app_label='ttkd_api')
            return Response(status=HTTP_200_OK)
        return Response("Bad file path, file not found", status=HTTP_400_BAD_REQUEST)
    return Response("File missing from post data", status=HTTP_400_BAD_REQUEST)
