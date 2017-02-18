"""WaiverSerializer"""
from rest_framework import serializers

from ..models import Person
from ..models.waiver import Waiver


class WaiverSerializer(serializers.ModelSerializer):
    """
    WaiverSerializer Outputs Waiver Model as JSON
    """
    waiver_url = serializers.CharField(read_only=True)
    person = serializers.PrimaryKeyRelatedField(queryset=Person.objects.all(), required=False)

    class Meta:
        model = Waiver
        fields = ('id', 'person', 'waiver_signature', 'guardian_signature', 'signature_timestamp',
                  'waiver_url')


class WaiverImageSerializer(serializers.HyperlinkedModelSerializer):
    """
    WaiverImageSerializer Outputs Waiver Model as JSON for the image
    """
    class Meta:
        model = Waiver
        fields = ('id', 'waiver_image')
        readonly_fields = ('waiver_image')
