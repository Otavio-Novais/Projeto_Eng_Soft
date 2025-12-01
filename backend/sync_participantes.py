import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from planner.models import Viagem, TripMember

print("Sincronizando participantes com TripMembers...\n")

# Para cada TripMember, garantir que o user está em participantes
trip_members = TripMember.objects.select_related('viagem', 'user').all()

for tm in trip_members:
    if not tm.viagem.participantes.filter(id=tm.user.id).exists():
        tm.viagem.participantes.add(tm.user)
        print(f"[+] Adicionado {tm.user.email} como participante de {tm.viagem.titulo}")
    else:
        print(f"[OK] {tm.user.email} ja e participante de {tm.viagem.titulo}")

print("\nSincronizacao concluida!")
