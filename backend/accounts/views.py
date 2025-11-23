from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import requests

from .serializers import UserRegistrationSerializer
from .models import CustomUser

# View de Cadastro (E-mail e Senha)
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  # Permite cadastro sem estar logado

# View de Login com Google
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]  # <--- ADICIONADO: Permite postar o token sem estar logado

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
            # get_or_create retorna uma tupla: (objeto_usuario, booleano_se_foi_criado)
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={'full_name': name}
            )

            if created:
                # Define uma senha inutilizável (já que ele usa login social)
                user.set_unusable_password()
                user.save()

            # 3. Gerar tokens JWT do nosso sistema (Tripsync)
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'email': user.email,
                'full_name': user.full_name
            })

        except Exception as e:
            # Captura erros inesperados de conexão ou lógica
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)