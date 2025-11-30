from rest_framework import serializers
from .models import Viagem, Despesa, Rateio
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name']

class ExpenseSerializer(serializers.ModelSerializer):
    payer_name = serializers.ReadOnlyField(source='pagador.first_name')
    amount = serializers.DecimalField(source='valor_total', max_digits=10, decimal_places=2)
    title = serializers.CharField(source='titulo')
    
    class Meta:
        model = Despesa
        fields = ['id', 'title', 'amount', 'payer_name']

class TripDashboardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(source='participantes', many=True, read_only=True)
    expenses = ExpenseSerializer(source='despesas', many=True, read_only=True)
    title = serializers.CharField(source='titulo')
    start_date = serializers.DateField(source='data_inicio')
    end_date = serializers.DateField(source='data_fim')
    # budget = serializers.DecimalField(max_digits=10, decimal_places=2, required=False) # Not in model yet

    class Meta:
        model = Viagem
        fields = ['id', 'title', 'start_date', 'end_date', 'participants', 'expenses']

class TripSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='titulo')
    start_date = serializers.DateField(source='data_inicio')
    end_date = serializers.DateField(source='data_fim')
    description = serializers.CharField(required=False, allow_blank=True, source='nome') # Mapping description to nome for now

    class Meta:
        model = Viagem
        fields = ['id', 'title', 'description', 'start_date', 'end_date']

    def validate(self, data):
        start_date = data.get('data_inicio')
        end_date = data.get('data_fim')
        
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