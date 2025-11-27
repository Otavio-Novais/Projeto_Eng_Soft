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
    options = OptionSerializer(many=True, required=False)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    proposed_by_name = serializers.ReadOnlyField(source='proposed_by.username')
    voted = serializers.SerializerMethodField()
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Suggestion
        fields = [
            'id', 'trip', 'title', 'description', 
            'category', 'category_display', 
            'proposed_by', 'proposed_by_name', 
            'budget', 'options', 'voted', 'votes_count'
        ]

    def get_voted(self, obj):
        # Verifica se o Usuário ID 1 tem um voto "Sim" nesta sugestão
        return obj.vote_set.filter(user_id=1, is_approved=True).exists()

    def get_votes_count(self, obj):
        # Conta quantos votos 'Sim' existem
        return obj.vote_set.filter(is_approved=True).count()

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        suggestion = Suggestion.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(suggestion=suggestion, **option_data)
        return suggestion

# --- ESTA É A PARTE QUE ESTAVA FALTANDO ---
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'