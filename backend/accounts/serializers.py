from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password # <--- 1. IMPORTANTE
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
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
    
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    
    # Validamos se o campo está preenchido, mas NÃO verificamos se o usuário existe
    # para evitar vazamento de dados (segurança)
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField()
    uidb64 = serializers.CharField()

    def validate_password(self, value):
        # Isso roda todas as regras do settings.py (incluindo sua ComplexPasswordValidator)
        validate_password(value)
        return value