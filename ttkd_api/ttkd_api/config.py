# ttkd_api/config.py

from django.apps import AppConfig

class TTKDConfig(AppConfig):
    name = __package__

    def ready(self):
        from django.contrib.auth.models import User
        name = 'TTKD'
        verbose_name = "TTKD Student Management"
        default_password = 'admin'

        try:
            adminuser = None
            try:
                adminuser = User.objects.get(username='admin')
                adminuser.set_password(default_password)
            except User.DoesNotExist:
                adminuser = User.objects.create_user('admin', '', default_password)

            adminuser.is_staff = True
            adminuser.save()

        except: # Can't actually print anything here
            pass # or it ends up in the dump.json and you cant import