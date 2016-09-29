from django.db import models
from belts import Belts

class Persons(models.Model):
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
    belt_id = models.ForeignKey(
        Belts,
        ondelete = models.SET_NULL,
        blank=True,
        null=True,
    )
    stripes = models.PositiveIntegerField(
        blank=True,
        null=True,
    )
    extra_strips = models.PositiveIntegerField(
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
