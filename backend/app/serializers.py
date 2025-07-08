from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class QueryRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=10000)

class QueryResponseSerializer(serializers.Serializer):
    response = serializers.CharField()


class RegistrationSerializer(serializers.ModelSerializer):
    """
    Creates and returns a user object with the user input.
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'country', 'region', 'city', 'postal_code', 'address', 'house_number', 'phone', 'AFM']

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            country=validated_data.get('country'),
            region=validated_data.get('region'),
            city=validated_data.get('city'),
            postal_code=validated_data.get('postal_code'),
            address=validated_data.get('address'),
            house_number=validated_data.get('house_number'),
            phone=validated_data.get('phone'),
            AFM=validated_data.get('AFM'),
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data


# county = models.CharField(max_length=256)
# region = models.CharField(max_length=256)
# city = models.CharField(max_length=256)
# postal_code = models.CharField(max_length=256)
# address = models.CharField(max_length=256)
# house_number = models.IntegerField()
# phone = PhoneNumberField(region='GR')
# afm = models.IntegerField()