# backend/suggestions/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
# AQUI ESTÁ O "ERRO" PROPOSITAL: Estamos importando coisas que talvez não existam ainda
from .models import Trip, Suggestion 

User = get_user_model()

class TripSuggestionTest(TestCase):
    def setUp(self):
        # Cria um usuário para ser o dono da viagem
        self.user = User.objects.create_user(username='tester', password='123')

    def test_create_trip_and_suggestion(self):
        # 1. Tenta criar uma VIAGEM
        trip = Trip.objects.create(
            name='Despedida de Solteiro',
            start_date='2025-10-10',
            end_date='2025-10-15'
        )
        trip.members.add(self.user)

        # 2. Tenta criar uma SUGESTÃO nessa viagem
        suggestion = Suggestion.objects.create(
            trip=trip,
            title='Aluguel de Lancha',
            description='Passeio de 4 horas',
            category='ACTIVITY',
            proposed_by=self.user,
            budget=1500.00
        )

        # 3. Verifica se tudo foi salvo
        self.assertEqual(Trip.objects.count(), 1)
        self.assertEqual(Suggestion.objects.count(), 1)
        self.assertEqual(suggestion.trip, trip)