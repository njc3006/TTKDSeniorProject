from django.db import models
from person import Person
from program import Program


class Registration(models.Model):

    person = models.ForeignKey(Person, ondelete=models.CASCADE)

    program = models.ForeignKey(Program)
