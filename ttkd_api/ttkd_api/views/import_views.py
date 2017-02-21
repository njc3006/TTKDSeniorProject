from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *
from django.core.management import call_command
import json


@api_view(['POST', ])
def import_data(request):
    """
    An Url that is used to import a JSON export of the DB
    Only accepts POST with a {"{JSON RESTORE CONTENTS}"}
    NOTE THIS TAKES A FEW SECONDS
    """
    # 'file' in request.data:
    file = request.data

    temp_file_name = "tempImport.json"

    with open(temp_file_name, 'w') as temp_file:
        temp_file.write(json.dumps(file))

    # Flush because loaddata will keep records it has nothing on, this will truly clean the DB
    call_command('flush', interactive=False, load_initial_data=False)
    call_command('loaddata', temp_file_name, app_label='ttkd_api')
    return Response("Restore Successful", status=HTTP_200_OK)
