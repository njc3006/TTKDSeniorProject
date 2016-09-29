from django.db import models
from persons import Persons


class Emails(models.Model):
    person_id = models.ForeignKey(
        Persons,
        ondelete=models.CASCADE,
        blank=True,
        null=True,
    )
    email = models.EmailField(
        max_length=254,
    )
