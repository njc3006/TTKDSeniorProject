"""
A File that holds the InstructorAttendanceRecord Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from .program import Program


class InstructorAttendanceRecord(models.Model):
    """
    A Django model
    An instructor attendance record indicates when an instructor attends a class at a given time
    """
    person = models.ForeignKey(Person, on_delete=models.CASCADE)

    program = models.ForeignKey(Program)

    date = models.DateField()
