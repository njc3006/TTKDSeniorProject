"""
A File that holds the Person Class
@author AJ Deck, Nick Coriale
"""
from django.db import models

from .emergency_contact import EmergencyContact


class Person(models.Model):
    """
    A Django model
    A Person is a user of the system that does not have a login. A person is a student who may or
    may not instruct
    programs
    """
    first_name = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )
    last_name = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )
    dob = models.DateField(
        blank=True,
        null=True,
    )
    primary_phone = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
    secondary_phone = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
    street = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )
    city = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )
    zipcode = models.CharField(
        max_length=6,
        blank=True,
        null=True,
    )
    state = models.CharField(
        max_length=2,
        blank=True,
        null=True,
    )
    misc_notes = models.CharField(
        max_length=1000,
        blank=True,
        null=True,
    )
    active = models.BooleanField(
        default=True,
    )

    emergency_contact_1 = models.ForeignKey(EmergencyContact, on_delete=models.CASCADE, blank=True,
                                            null=True, related_name='emergency_contact_1')

    emergency_contact_2 = models.ForeignKey(EmergencyContact, on_delete=models.CASCADE, blank=True,
                                            null=True, related_name='emergency_contact_2')

    def __str__(self):
        return self.first_name + " " + self.last_name
