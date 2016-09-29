from django.db import models
from persons import Persons

class pictures(models.Model):
    person_id = models.ForeignKey(
        Persons,
        ondelete = models.CASCADE,
        blank=True,
        null=True,
    )
    filepath = models.CharField(
        max_length=255,
    )
