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
# backend/suggestions/views.py

    # ... dentro de SuggestionViewSet ...

    @action(detail=True, methods=['post'])
    def toggle_vote(self, request, pk=None):
        suggestion = self.get_object()
        
        # Pega usuário 1 (Fixo para teste)
        try:
            user = User.objects.get(id=1)
        except User.DoesNotExist:
            return Response({'error': 'Erro: Sem usuário'}, status=400)

        vote = Vote.objects.filter(user=user, suggestion=suggestion).first()

        voted_status = False

        if vote:
            vote.delete()
            voted_status = False
        else:
            Vote.objects.create(user=user, suggestion=suggestion, is_approved=True)
            voted_status = True
        
        # NOVO: Recalcula o total de votos após a ação
        new_total = suggestion.vote_set.filter(is_approved=True).count()

        return Response({
            'voted': voted_status, 
            'votes_count': new_total,  # <--- Enviamos o novo total pro React
            'message': 'Sucesso'
        })

            

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer