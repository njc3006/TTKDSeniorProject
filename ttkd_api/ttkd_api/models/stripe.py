"""
A File that holds the Stripe Class
@author Nick Coriale
"""
from django.db import models
from .belt import Belt


class Stripe(models.Model):
    """
    A Django model
    The system has a set of stripes, and each stripe can be removed in the front end which sets its active to false
    """
    color = models.CharField(
        max_length=25,
        blank=True,
        null=True,
    )

    active = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.color
