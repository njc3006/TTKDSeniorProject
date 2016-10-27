"""
A File that holds the Belt Class
@author AJ Deck, Nick Coriale
"""
from django.db import models


class Belt(models.Model):
    """
    A Django model
    Persons will have belts, this is used to store the information about a persons specific belt
    """
    order = models.PositiveIntegerField(
        unique=True,
    )
    name = models.CharField(
        max_length=25,
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name
