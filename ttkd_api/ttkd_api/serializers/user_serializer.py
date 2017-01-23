"""UserSerializer"""
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
	"""
	UserSerializer Outputs User Model as JSON
	"""
	class Meta:
		model = User
		fields = ['username', 'password', 'is_staff']

		extra_kwargs = {'password': {'write_only': True,}}

	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
			if attr == 'password':
				instance.set_password(value)
			else:
				setattr(instance, attr, value)

		instance.save()
		return instance

	def create(self, validated_data):
		user = User.objects.create(
			username=validated_data['username'],
		)

		user.set_password(validated_data['password'])
		user.save()

		return user