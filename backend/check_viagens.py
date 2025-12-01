import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from planner.models import Viagem

User = get_user_model()

user = User.objects.filter(email='otavioaugustonv2@gmail.com').first()

if user:
    print(f'Usuario encontrado: {user.email}')
    viagens = Viagem.objects.filter(participantes=user)
    print(f'\nViagens como participante: {viagens.count()}')
    for v in viagens:
        print(f'  - ID {v.id}: {v.titulo}')
else:
    print('Usuario nao encontrado')
