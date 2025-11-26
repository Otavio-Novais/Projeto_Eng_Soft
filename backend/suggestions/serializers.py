from rest_framework import serializers
from .models import Trip, Suggestion, Option, Vote

# 1. Serializer da Viagem
class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__' # Pega todos os campos (id, name, dates...)

# 2. Serializer das Opções (Opção A, Opção B...)
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'name', 'price']

# 3. Serializer da Sugestão
class SuggestionSerializer(serializers.ModelSerializer):
    # Aqui fazemos uma mágica: Incluímos as opções DENTRO da sugestão
    options = OptionSerializer(many=True, read_only=True)
    
    # Trazemos o nome legível da categoria (ex: "Atividade") em vez do código ("ACTIVITY")
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Suggestion
        fields = [
            'id', 'trip', 'title', 'description', 
            'category', 'category_display', 
            'proposed_by', 'budget', 'options'
        ]

# 4. Serializer do Voto
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'