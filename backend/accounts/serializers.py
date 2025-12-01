from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'full_name', 'city', 'birth_date')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            city=validated_data.get('city', ''),
            birth_date=validated_data.get('birth_date')
        )
        return user
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField()
    uidb64 = serializers.CharField()

    def validate_password(self, value):
        validate_password(value)
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'phone', 'city', 'birth_date', 'travel_style', 'bio', 'avatar', 'email_notifications', 'currency', 'language']
        read_only_fields = ['email']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get('full_name'):
            nome_composto = f"{instance.first_name} {instance.last_name}".strip()
            data['full_name'] = nome_composto if nome_composto else ""
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value