"""
A File that holds the Email Class
@author AJ Deck, Nick Coriale
"""
from django.db import models
from .person import Person


class Email(models.Model):
    """
    A Django model
    A person will have 1 to many emails
    """
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    email = models.EmailField(
        max_length=254,
    )
