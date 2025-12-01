# Script para popular o banco com TripMembers para viagens existentes
from planner.models import Viagem, TripMember
from django.contrib.auth import get_user_model

User = get_user_model()

# Para cada viagem existente, cria os membros correspondentes
viagens = Viagem.objects.all()

for viagem in viagens:
    print(f"\n=== Processando viagem: {viagem.titulo} ===")
    
    # Pega todos os participantes da viagem
    participantes = viagem.participantes.all()
    
    if not participantes.exists():
        print(f"  [!] Viagem sem participantes")
        continue
    
    # O primeiro participante sera o admin (criador)
    primeiro = participantes.first()
    
    for idx, user in enumerate(participantes):
        # Verifica se ja existe o membro
        membro, created = TripMember.objects.get_or_create(
            viagem=viagem,
            user=user,
            defaults={
                'role': 'ADMIN' if idx == 0 else 'MEMBER',
                'status': 'CONFIRMED'
            }
        )
        
        if created:
            print(f"  [+] Criado: {user.email} como {membro.role}")
        else:
            print(f"  [i] Ja existe: {user.email} como {membro.role}")

print("\n[OK] Processamento concluido!")
