"""PersonSerializer"""
from rest_framework import serializers

from ..serializers.person_stripe_serializer import PersonStripeSerializer
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..serializers.person_belt_serializer import PersonBeltSerializer
from ..models.person import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    emails = EmailSerializer(many=True)
    belts = PersonBeltSerializer(many=True, read_only=True)
    stripes = PersonStripeSerializer(many=True, read_only=True)
    emergency_contact_1 = EmergencyContactSerializer(required=False)
    emergency_contact_2 = EmergencyContactSerializer(required=False)

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone',
                  'street', 'city', 'zipcode', 'state', 'belts', 'stripes', 'emails',
                  'emergency_contact_1', 'emergency_contact_2', 'misc_notes', 'picture_path',
                  'active')
