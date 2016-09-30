from django.db import models


class Program(models.Model):

    name = models.CharField(max_length=50)

    # TODO if needed
    # gcal_id = models.CharField(max_length=50)
