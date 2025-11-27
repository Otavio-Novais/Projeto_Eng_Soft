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
    
    # Campo calculado: Diz ao Frontend se o botão deve nascer cinza (votado) ou verde
    voted = serializers.SerializerMethodField()

    class Meta:
        model = Suggestion
        fields = [
            'id', 'trip', 'title', 'description', 
            'category', 'category_display', 
            'proposed_by', 'proposed_by_name', 
            'budget', 'options', 'voted' # <--- Não esqueça de incluir 'voted' aqui
        ]

    def get_voted(self, obj):
        # Verifica se o Usuário ID 1 tem um voto "Sim" nesta sugestão
        # Se tiver, retorna True. Se não, False.
        return obj.vote_set.filter(user_id=1, is_approved=True).exists()

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'