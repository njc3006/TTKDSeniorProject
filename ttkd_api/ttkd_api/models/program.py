"""
A File that holds the Program Class
@author Nick Coriale
"""
from django.db import models


class Program(models.Model):
    """
    A Django model
    A Program is a re-accruing class or a workshop
    """

    name = models.CharField(
        unique=True,
        max_length=50)

    active = models.BooleanField(
        default=True,
    )

    # TODO if needed
    # gcal_id = models.CharField(max_length=50)

    def __str__(self):
        return self.name
