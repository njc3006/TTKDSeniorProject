"""
A File that holds the Picture Class
@author AJ Deck, Nick Coriale
"""
from django.db import models
from person import Person


class Picture(models.Model):
    """
    A Django model
    Persons have at least one picture, but can have any number of pictures
    """
    person = models.ForeignKey(
        Person,
        ondelete=models.CASCADE,
        blank=True,
        null=True,
    )
    filepath = models.CharField(
        max_length=255,
    )
