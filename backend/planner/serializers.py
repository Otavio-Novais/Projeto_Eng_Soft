from rest_framework import serializers
from .models import Trip, Activity, Expense
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    payer_name = serializers.ReadOnlyField(source='payer.username')
    
    class Meta:
        model = Expense
        fields = ['id', 'title', 'amount', 'payer_name']

class TripDashboardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ['id', 'title', 'start_date', 'end_date', 'budget', 'participants', 'activities', 'expenses']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        # campos que o frontend irá receber e enviar
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'budget']
        extra_kwargs = {
            'budget': {'required': False, 'allow_null': True},
            'description': {'required': False}
        }

        def validate(self, data):

            if data['start_date'] > data['end_date']:
                    raise serializers.ValidationError("A data final deve ser posterior à data de início.")
            return data