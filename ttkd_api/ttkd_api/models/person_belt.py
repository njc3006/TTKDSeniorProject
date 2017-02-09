"""
A File that holds the PersonBelt Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .belt import Belt


class PersonBelt(models.Model):
    """
    A Django model
    Persons will have Belts, one current and their past belts,
    this is used to store what persons have what Belts, and the date they achieved that belt
    """
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='belts')

    belt = models.ForeignKey(Belt, on_delete=models.CASCADE)

    date_achieved = models.DateField()
