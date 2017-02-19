"""
A File that holds the Waiver Class
@author Nick Coriale
"""
from django.db import models
from .person import Person
from django.utils.translation import ugettext_lazy as _
from ..settings import STATIC_FOLDER
import time
import os


class Waiver(models.Model):
    """
    A Django model
    A Waiver stores the information saved during registration
    """

    def upload_to(instance, filename):
        """
        Upload a waiver
        Args:
            filename: The name of the file to host

        Returns: The complete path to the hosted file
        """
        extension = "." + filename.split('.')[-1]
        # make a timestamped filename
        filename = time.strftime("%Y-%m-%d_%H-%M-%S") + extension
        # make a folder with the first and last name
        folder = ""
        if instance.waiver_signature:
            folder = instance.waiver_signature + "/"
        partial_url = 'waivers/{}{}'.format(folder, filename)

        # now construct the url it will be served from
        url = 'ui/' + partial_url
        # save the url in the instance
        instance.waiver_url = url
        instance.save()

        return os.path.join(STATIC_FOLDER, partial_url)

    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='waivers')

    waiver_signature = models.CharField(
        max_length=60,
        blank=True,
        null=True,
    )

    guardian_signature = models.CharField(
        max_length=60,
        blank=True,
        null=True,
    )

    signature_timestamp = models.DateTimeField(
        auto_now=True
    )

    waiver_image = models.ImageField(
        _('waiver_image'),
        blank=True,
        null=True,
        upload_to=upload_to
    )

    waiver_url = models.CharField(
        max_length=2083,  # max length of a valid URL
        blank=True,
        null=True
    )
