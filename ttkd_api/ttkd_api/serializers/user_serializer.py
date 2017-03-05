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
		
		setattr(user, 'is_staff', validated_data['is_staff'])
		
		user.save()

		return user

class UserInfoSerializer(serializers.ModelSerializer):
	"""
	UserSerializer Outputs User Model as JSON
	"""
	class Meta:
		model = User
		fields = ['username', 'is_staff']

	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
				setattr(instance, attr, value)

		instance.save()
		return instance

class UserPasswordSerializer(serializers.ModelSerializer):
	"""
	UserSerializer Outputs User Model as JSON
	"""

	class Meta:
		model = User
		fields = ['password']

		extra_kwargs = {'password': {'write_only': True,}}

	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
			if attr == 'password':
				instance.set_password(value)

		instance.save()
		return instance