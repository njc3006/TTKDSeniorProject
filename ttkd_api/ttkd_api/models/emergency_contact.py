from django.db import models
from person import Person


class EmergencyContact(models.Model):
    person = models.ForeignKey(
        Person,
        ondelete=models.CASCADE,
        blank=True,
        null=True,
    )
    relation = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )
    phone_number = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
