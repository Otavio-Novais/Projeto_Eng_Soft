from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import requests

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings

# --- IMPORTS NOVOS DE SEGURANÇA ---
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
# ----------------------------------

from .serializers import (
    UserRegistrationSerializer, 
    PasswordResetRequestSerializer, 
    SetNewPasswordSerializer 
)
from .models import CustomUser
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

# View de Login com Google
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({'error': 'Token não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Validar o token direto na API do Google
            google_response = requests.get(
                'https://www.googleapis.com/oauth2/v3/tokeninfo', 
                params={'id_token': token}
            )

            if not google_response.ok:
                return Response({'error': 'Token do Google inválido'}, status=status.HTTP_400_BAD_REQUEST)

            google_data = google_response.json()
            email = google_data.get('email')
            name = google_data.get('name', '')

            # 2. Verificar se o usuário existe. Se não, cria.
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={'full_name': name}
            )

            if created:
                user.set_unusable_password()
                user.save()

            # 3. Gerar tokens JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'email': user.email,
                'full_name': user.full_name
            })

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View de Reset de Senha
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            form = PasswordResetForm(data={'email': email})
            
            if form.is_valid():
                opts = {
                    'use_https': False,
                    'from_email': settings.DEFAULT_FROM_EMAIL,
                    'email_template_name': 'registration/password_reset_email.html',
                    'subject_template_name': 'registration/password_reset_subject.txt',
                    'domain_override': 'localhost:3000',
                    'extra_email_context': {
                        'site_name': 'Tripsync',
                        'protocol': 'http', 
                    }
                }
                form.save(**opts)
            
            return Response(
                {"message": "Se o e-mail existir, um link foi enviado."}, 
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            uidb64 = serializer.validated_data['uidb64']
            password = serializer.validated_data['password']

            try:
                # Decodifica o ID do usuário
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = CustomUser.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
                return Response({'error': 'Link inválido ou usuário não encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verifica se o token é válido para este usuário
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({'message': 'Senha redefinida com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Link expirado ou inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)