"""
A File that holds the Belt Class
@author AJ Deck, Nick Coriale
"""
from django.db import models


class Belt(models.Model):
    """
    A Django model
    The system has a set of belts, and each belt can be removed in the front end which sets its
    active to false
    """
    name = models.CharField(
        max_length=25,
    )

    primary_color = models.CharField(
        max_length=6,
    )

    secondary_color = models.CharField(
        max_length=6,
    )

    active = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.name
