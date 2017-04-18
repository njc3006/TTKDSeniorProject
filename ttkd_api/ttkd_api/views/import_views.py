from django.apps import apps
from django.contrib.admin.views.decorators import staff_member_required
from django.core.management import call_command

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import *

import json


@api_view(['POST', ])
@staff_member_required()
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

    # Delete all the objects in the models of the ttkd_api app
    my_app = apps.get_app_config('ttkd_api')
    my_models = my_app.get_models()
    for model in my_models:
        model.objects.all().delete()

    call_command('loaddata', temp_file_name, app_label='ttkd_api')
    return Response("Restore Successful", status=HTTP_200_OK)
