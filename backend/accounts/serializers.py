from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password # <--- 1. IMPORTANTE
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'full_name', 'city', 'birth_date')

    # --- 2. AQUI ESTÁ A MÁGICA QUE FALTAVA ---
    def validate_password(self, value):
        # Isso força o Django a checar o settings.py e rodar seus validadores
        validate_password(value)
        return value
    # -----------------------------------------

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            city=validated_data.get('city', ''),
            birth_date=validated_data.get('birth_date')
        )
        return user