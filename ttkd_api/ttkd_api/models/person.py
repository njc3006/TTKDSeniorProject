"""
A File that holds the Person Class
@author AJ Deck, Nick Coriale
"""
import time
from django.db import models
from django.utils.translation import ugettext_lazy as _
from ..settings import STATIC_FOLDER
from .emergency_contact import EmergencyContact


class Person(models.Model):
    """
    A Django model
    A Person is a user of the system that does not have a login. A person is a student who may or
    may not instruct
    programs
    """

    def upload_to(instance, filename):
        extension = "." + filename.split('.')[-1]
        # make a timestamped filename
        filename = time.strftime("%Y-%m-%d_%H-%M-%S") + extension
        # make a folder with the first and last name
        folder = ""
        if instance.first_name and instance.last_name:
            folder = instance.first_name + "." + instance.last_name + "/"
        partial_url = 'pictures/{}{}'.format(folder, filename)

        #now construct the url it will be served from
        url = 'ui/' + partial_url
        #save the url in the instance
        instance.picture_url = url
        instance.save()

        return STATIC_FOLDER + partial_url

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

    picture = models.ImageField(
        _('picture'),
        blank=True,
        null=True, 
        upload_to=upload_to
    )
    picture_url = models.CharField(
        max_length=2083, # max length of a valid URL
        blank=True,
        null=True
    )

    def __str__(self):
        return self.first_name + " " + self.last_name
