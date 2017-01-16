"""
A File that holds the EmergencyContact Class
@author AJ Deck, Nick Coriale
"""
from django.db import models


class EmergencyContact(models.Model):
    """
    A Django model
    A person will have at least one emergency contact and up to two of them
    """
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
    full_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
