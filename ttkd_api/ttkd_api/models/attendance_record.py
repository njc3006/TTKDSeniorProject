"""
A File that holds the AttendanceRecord Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .program import Program


class AttendanceRecord(models.Model):
    """
    A Django model
    An attendance record indicates when a person attends a class at a given time
    """
    person = models.ForeignKey(Person, on_delete=models.CASCADE)

    program = models.ForeignKey(Program)

    date = models.DateField()

    class Meta:
        unique_together = ("person", "program", "date")
