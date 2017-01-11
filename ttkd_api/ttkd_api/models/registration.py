"""
A File that holds the Registration Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .program import Program


class Registration(models.Model):
    """
    A Django model
    A Registration ties a Person to a Program
    """

    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='classes')

    program = models.ForeignKey(Program)

    waiver_signature = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )

    guardian_signature = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )

    signature_timestamp = models.DateTimeField(
        blank=True,
        null=True,
    )
