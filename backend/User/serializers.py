from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
    

class UserDetailsSerialiser(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class LoginSerialiser(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_admin'] = self.user.is_staff
        data['username'] = self.user.username 
        data['is_approved'] = self.user.is_approved
        return data