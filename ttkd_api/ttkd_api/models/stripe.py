"""
A File that holds the Stripe Class
@author Nick Coriale
"""
from django.db import models
from .belt import Belt


class Stripe(models.Model):
    """
    A Django model
    Persons will have stripes, this is used to store the information about stripes
    """
    belt = models.ForeignKey(Belt, on_delete=models.CASCADE)

    color = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )

    def __str__(self):
        return str(self.belt) + " - " + self.color
