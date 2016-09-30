"""
A File that holds the Registration Class
@author Nick Coriale
"""
from django.db import models
from person import Person
from program import Program


class Registration(models.Model):
    """
    A Django model
    A Registration ties a Person to a Program
    """

    person = models.ForeignKey(Person, ondelete=models.CASCADE)

    program = models.ForeignKey(Program)
