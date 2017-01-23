"""PersonSerializer"""
from string import capwords
from rest_framework import serializers

from ..serializers.person_stripe_serializer import DetailedPersonStripeSerializer
from ..serializers.email_serializer import EmailSerializer
from ..serializers.emergency_contact_serializer import EmergencyContactSerializer
from ..serializers.person_belt_serializer import DetailedPersonBeltSerializer
from ..models.person import Person
from ..models.email import Email
from ..models.emergency_contact import EmergencyContact


class PersonSerializer(serializers.ModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    emails = EmailSerializer(many=True)
    belts = DetailedPersonBeltSerializer(many=True, read_only=True)
    stripes = DetailedPersonStripeSerializer(many=True, read_only=True)
    emergency_contact_1 = EmergencyContactSerializer(required=False)
    emergency_contact_2 = EmergencyContactSerializer(required=False)

    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'dob', 'primary_phone', 'secondary_phone',
                  'street', 'city', 'zipcode', 'state', 'belts', 'stripes', 'emails',
                  'emergency_contact_1', 'emergency_contact_2', 'misc_notes', 'picture_url',
                  'active')

    def update(self, instance, validated_data):
        """
        Update the person instance and its emails and emergency contacts
        DOES NOT SUPPORT PATCH
        """
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.primary_phone = validated_data.get('primary_phone', instance.primary_phone)
        instance.secondary_phone = validated_data.get('secondary_phone', instance.secondary_phone)
        instance.street = validated_data.get('street', instance.street)
        instance.city = validated_data.get('city', instance.city)
        instance.zipcode = validated_data.get('zipcode', instance.zipcode)
        instance.state = validated_data.get('state', instance.state)
        instance.misc_notes = validated_data.get('misc_notes', instance.misc_notes)
        instance.picture_url = validated_data.get('picture_url', instance.picture_url)
        instance.active = validated_data.get('active', instance.active)

        # Remove all of the persons existing emails, so we can set them to the ones received in the update
        # Have to do this because emails could be deleted from the list, and new ones could be added
        # This is less expensive that trying to query the database to determine if any of the emails were removed or
        # modified
        instance.emails.all().delete()

        email_data = validated_data.pop('emails')

        for an_email_dict in email_data:
            Email.objects.create(person=instance, email=an_email_dict['email'])

        if 'emergency_contact_1' in validated_data:
            emergency_contact_1_data = validated_data.pop('emergency_contact_1')

            if instance.emergency_contact_1 is not None:
                instance.emergency_contact_1.relation = capwords(emergency_contact_1_data['relation'])
                # No capwords here in case someone is using this update to fix a name
                instance.emergency_contact_1.full_name = emergency_contact_1_data['full_name']
                instance.emergency_contact_1.phone_number = emergency_contact_1_data['phone_number']
                instance.emergency_contact_1.save()
            else:
                # Safety code in case somehow the above condition does not hold
                instance.emergency_contact_1 = EmergencyContact.objects.create(
                    relation=capwords(emergency_contact_1_data['relation']),
                    phone_number=emergency_contact_1_data['phone_number'],
                    full_name=capwords(emergency_contact_1_data['full_name']))

        if 'emergency_contact_2' in validated_data:
            emergency_contact_2_data = validated_data.pop('emergency_contact_2')

            if instance.emergency_contact_2 is not None:
                instance.emergency_contact_2.relation = capwords(emergency_contact_2_data['relation'])
                # No capwords here in case someone is using this update to fix a name
                instance.emergency_contact_2.full_name = emergency_contact_2_data['full_name']
                instance.emergency_contact_2.phone_number = emergency_contact_2_data['phone_number']
                instance.emergency_contact_2.save()
            else:
                # Safety code in case somehow the above condition does not hold
                instance.emergency_contact_2 = EmergencyContact.objects.create(
                    relation=capwords(emergency_contact_2_data['relation']),
                    phone_number=emergency_contact_2_data['phone_number'],
                    full_name=capwords(emergency_contact_2_data['full_name']))

        instance.save()
        return instance


class PersonPictureSerializer(serializers.HyperlinkedModelSerializer):
    """
    PersonSerializer Outputs Person Model as JSON
    """
    class Meta:
        model = Person
        fields = ('id', 'picture')
        readonly_fields = ('picture')


class MinimalPersonSerializer(serializers.ModelSerializer):
    """
    MinimumPersonSerializer Outputs Person Model as JSON with very limited fields
    """
    class Meta:
        model = Person
        fields = ('id', 'first_name', 'last_name', 'picture_url', 'active')


class CSVPersonSerializer(serializers.ModelSerializer):
    """
    CSVPersonSerializer Outputs person model with just the first name and last name for csv use
    """

    class Meta:
        model = Person
        fields = ('first_name', 'last_name')
