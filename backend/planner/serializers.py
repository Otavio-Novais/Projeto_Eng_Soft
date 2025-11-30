from rest_framework import serializers
from .models import Viagem, Despesa, Rateio
from django.contrib.auth.models import User
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']

class ExpenseSerializer(serializers.ModelSerializer):
    payer_name = serializers.ReadOnlyField(source='payer.username')
    
    class Meta:
        model = Despesa
        fields = ['id', 'title', 'amount', 'payer_name']

class TripDashboardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Viagem
        fields = ['id', 'title', 'start_date', 'end_date', 'budget', 'participants', 'expenses']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Viagem
        # campos que o frontend irá receber e enviar
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'budget']
        extra_kwargs = {
            'budget': {'required': False, 'allow_null': True},
            'description': {'required': False}
        }

    def validate(self, data):
    
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        # Validação de datas
        if start_date and end_date:
            
            if start_date > end_date:
                raise serializers.ValidationError({
                    "end_date": "A data final deve ser posterior à data de início."
                })

            # Verificação se a data está no passado
            if start_date < timezone.now().date():
                raise serializers.ValidationError({
                    "start_date": "Não é possível criar uma viagem no passado."
                })

        return data