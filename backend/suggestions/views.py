from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trip, Suggestion, Vote
from .serializers import TripSerializer, SuggestionSerializer, VoteSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class SuggestionViewSet(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer

    # Ação personalizada para Votar/Remover Voto
    @action(detail=True, methods=['post'])
    def toggle_vote(self, request, pk=None):
        suggestion = self.get_object()
        
        # 1. Pega o usuário ID 1 (Admin) fixo para teste
        try:
            user = User.objects.get(id=1)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário ID 1 não existe. Crie um superusuário!'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Verifica se já existe voto desse usuário nessa sugestão
        vote = Vote.objects.filter(user=user, suggestion=suggestion).first()

        if vote:
            # CENÁRIO A: Já votou -> Remove o voto (Delete)
            vote.delete()
            return Response({'voted': False, 'message': 'Voto removido'})
        else:
            # CENÁRIO B: Não votou -> Cria o voto (Create)
            Vote.objects.create(user=user, suggestion=suggestion, is_approved=True)
            return Response({'voted': True, 'message': 'Voto registrado'})

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer