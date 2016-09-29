from django.db import models
from persons import Persons

class emergency_contacts(models.Model):
    person_id = models.ForeignKey(
        Persons,
        ondelete = models.CASCADE,
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
