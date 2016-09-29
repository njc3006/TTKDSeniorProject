from django.db import models


class Belts(models.Model):
    order = models.PositiveIntegerField(
        unique=True,
    )
    name = models.CharField(
        max_length=25,
        blank=True,
        null=True,
    )
    num_strips = models.PositiveIntegerField()
