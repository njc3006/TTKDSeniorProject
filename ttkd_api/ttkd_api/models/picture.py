from django.db import models
from person import Person


class Picture(models.Model):
    person = models.ForeignKey(
        Person,
        ondelete=models.CASCADE,
        blank=True,
        null=True,
    )
    filepath = models.CharField(
        max_length=255,
    )
