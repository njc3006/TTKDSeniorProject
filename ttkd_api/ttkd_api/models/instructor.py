"""
A File that holds the Instructor Class
@author Nick Coriale
"""
from django.db import models
from person import Person
from program import Program


class Instructor(models.Model):
    """
    A Django model
    Persons can instruct programs, this model stores those relations
    """
    person = models.ForeignKey(Person, ondelete=models.CASCADE)

    program = models.ForeignKey(Program)
