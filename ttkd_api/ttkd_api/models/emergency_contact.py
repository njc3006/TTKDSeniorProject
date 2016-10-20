"""
A File that holds the EmergencyContact Class
@author AJ Deck, Nick Coriale
"""
from django.db import models
from .person import Person


class EmergencyContact(models.Model):
    """
    A Django model
    A person will have at least one emergency contact and up to two of them
    """
    person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        # related name is needed for person serializer to know that a person has emergency contacts
        related_name='emergency_contacts',
    )
    relation = models.CharField(
        max_length=30,
    )
    phone_number = models.CharField(
        max_length=10
    )
    full_name = models.CharField(
        max_length=100,
    )
