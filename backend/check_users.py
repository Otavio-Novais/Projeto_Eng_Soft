import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from planner.models import Viagem, Despesa, Rateio

User = get_user_model()

# Check Ana and Bruno
print("=== Checking Users ===")
ana = User.objects.get(id=4)
bruno = User.objects.get(id=6)
print(f'Ana: id={ana.id}, email={ana.email}, first_name="{ana.first_name}"')
print(f'Bruno: id={bruno.id}, email={bruno.email}, first_name="{bruno.first_name}"')

# Check viagem 10 calculations
print("\n=== Checking Viagem 10 Balances ===")
viagem = Viagem.objects.get(id=10)
participantes = viagem.participantes.all()

for p in participantes:
    pagou = Despesa.objects.filter(viagem=viagem, pagador=p, status='CONFIRMADO').aggregate(valor_total__sum=django.db.models.Sum('valor_total'))['valor_total__sum'] or 0
    consumiu = Rateio.objects.filter(despesa__viagem=viagem, despesa__status='CONFIRMADO', participante=p).aggregate(valor_devido__sum=django.db.models.Sum('valor_devido'))['valor_devido__sum'] or 0
    nome = p.first_name or p.email.split('@')[0]
    saldo = float(pagou - consumiu)
    print(f'{nome} (id={p.id}): pagou={pagou}, consumiu={consumiu}, saldo={saldo}')

# Check Ana's expenses specifically
print("\n=== Ana's Expenses ===")
ana_despesas = Despesa.objects.filter(viagem=viagem, pagador=ana, status='CONFIRMADO')
for d in ana_despesas:
    print(f'  {d.titulo}: R${d.valor_total}')

# Check Bruno's expenses
print("\n=== Bruno's Expenses ===")
bruno_despesas = Despesa.objects.filter(viagem=viagem, pagador=bruno, status='CONFIRMADO')
for d in bruno_despesas:
    print(f'  {d.titulo}: R${d.valor_total}')
