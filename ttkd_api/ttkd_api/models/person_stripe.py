"""
A File that holds the PersonStripe Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .stripe import Stripe


class PersonStripe(models.Model):
    """
    A Django model
    Persons will have stripes, this is used to store what persons have what stripes, and the date
    they achieved that stripe
    """
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='stripes')

    stripe = models.ForeignKey(Stripe, on_delete=models.CASCADE)

    date_achieved = models.DateField()

    current_stripe = models.BooleanField(
        default=True,
    )
