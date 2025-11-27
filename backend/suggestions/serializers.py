from rest_framework import serializers
from .models import Trip, Suggestion, Option, Vote

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name', 'price']

class SuggestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    proposed_by_name = serializers.ReadOnlyField(source='proposed_by.username')
    voted = serializers.SerializerMethodField()
    
    # NOVO: Campo para contar votos
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Suggestion
        fields = [
            'id', 'trip', 'title', 'description', 
            'category', 'category_display', 
            'proposed_by', 'proposed_by_name', 
            'budget', 'options', 'voted', 
            'votes_count'  # <--- NÃO ESQUEÇA DE ADICIONAR AQUI
        ]

    def get_voted(self, obj):
        # (Sua lógica de checar Usuário 1 continua aqui...)
        return obj.vote_set.filter(user_id=1, is_approved=True).exists()

    # NOVO: Método que conta
    def get_votes_count(self, obj):
        return obj.vote_set.filter(is_approved=True).count()

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'