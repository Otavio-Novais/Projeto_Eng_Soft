import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from planner.models import Viagem, Despesa, Rateio
from django.db import models

User = get_user_model()

# Verificar usuários
ana = User.objects.get(email='ana@teste.com')
bruno = User.objects.get(email='bruno@teste.com')

print(f'\nAna - ID: {ana.id}, first_name: "{ana.first_name}"')
print(f'Bruno - ID: {bruno.id}, first_name: "{bruno.first_name}"')

# Calcular saldos manualmente
viagem = Viagem.objects.get(id=10)
participantes = viagem.participantes.all()

print(f'\n=== CÁLCULO DE SALDOS ===\n')

for p in participantes:
    pagou = Despesa.objects.filter(viagem=viagem, pagador=p, status='CONFIRMADO').aggregate(models.Sum('valor_total'))['valor_total__sum'] or 0
    consumiu = Rateio.objects.filter(despesa__viagem=viagem, despesa__status='CONFIRMADO', participante=p).aggregate(models.Sum('valor_devido'))['valor_devido__sum'] or 0
    saldo = pagou - consumiu
    
    print(f'{p.first_name or p.email}:')
    print(f'  Pagou: R$ {pagou}')
    print(f'  Consumiu: R$ {consumiu}')
    print(f'  Saldo: R$ {saldo}\n')
