"""
A File that holds the Belt Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .stripes import Stripe


class PersonStripe(models.Model):
    """
    A Django model
    Persons will have stripes, this is used to store the information about a persons stripes
    """
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='stripes')

    stripe = models.ForeignKey(Stripe, on_delete=models.CASCADE)
