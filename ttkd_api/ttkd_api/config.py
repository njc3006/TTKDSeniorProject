# ttkd_api/config.py

from django.apps import AppConfig
from django.conf import settings

class TTKDConfig(AppConfig):
    name = __package__

    def ready(self):
        from django.contrib.auth.models import User
        name = 'TTKD'
        verbose_name = "TTKD Student Management"

        try:
            if(settings.DEBUG):
                default_password = 'admin'

                admin_user = None
                try:
                    admin_user = User.objects.get(username='admin')
                    admin_user.set_password(default_password)
                except User.DoesNotExist:
                    admin_user = User.objects.create_user('admin', '', default_password)

                admin_user.is_staff = True
                admin_user.save()

                instructor_user = None
                try:
                    instructor_user = User.objects.get(username='instruct')
                    instructor_user.set_password(default_password)
                except User.DoesNotExist:
                    instructor_user = User.objects.create_user('instruct', '', default_password)

                instructor_user.is_staff = True
                instructor_user.save()


            else:
                import os
                dir_path = os.path.dirname(os.path.realpath(__file__))
                os.chdir(dir_path)
                if os.path.exists(os.path.exists("defaultaccounts.json")):
                    print(dir_path)
                    from json import load
                    accounts = load(open("defaultaccounts.json"))

                    for account in accounts:
                        new_user = None
                        try:
                            new_user = User.objects.get(username=account["username"])
                            new_user.set_password(account["password"])
                        except User.DoesNotExist:
                            new_user = User.objects.create_user(account["username"], '', account["password"])

                        new_user.is_staff = account["admin"]
                        new_user.save()


        except: # Can't actually print anything here
            pass # or it ends up in the dump.json and you cant import

