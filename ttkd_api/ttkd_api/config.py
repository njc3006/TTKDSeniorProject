# ttkd_api/config.py

from django.apps import AppConfig

class TTKDConfig(AppConfig):
    name = __package__

    def ready(self):
        name = 'TTKD'
        verbose_name = "TTKD Student Management"
        from django.contrib.auth.models import User
        print("System Ready")
        print(User.objects.all().exists())

        if(not User.objects.all().exists()):
            print("No users creating new")
            user = User.objects.create_user('admin', '', 'admin')
            user.is_staff = True
            user.save()