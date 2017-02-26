"""Import All Models Here"""

from .attendance_record import AttendanceRecord
from .belt import Belt
from .email import Email
from .emergency_contact import EmergencyContact
from .instructor import Instructor
from .person import Person
from .program import Program
from .registration import Registration
from .person_stripe import PersonStripe
from .person_belt import PersonBelt
from .stripe import Stripe
from .waiver import Waiver

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings

# This code is triggered whenever a new user has been created and saved to the database

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
