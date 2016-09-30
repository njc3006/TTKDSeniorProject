from django.db import models
from person import Person


class Email(models.Model):
    person = models.ForeignKey(
        Person,
        ondelete=models.CASCADE,
        blank=True,
        null=True,
    )
    email = models.EmailField(
        max_length=254,
    )
