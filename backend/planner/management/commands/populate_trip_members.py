from django.core.management.base import BaseCommand
from planner.models import Viagem, TripMember
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula TripMembers para viagens existentes'

    def handle(self, *args, **options):
        viagens = Viagem.objects.all()
        
        self.stdout.write(self.style.SUCCESS(f'\nEncontradas {viagens.count()} viagens\n'))
        
        for viagem in viagens:
            self.stdout.write(f"\n=== Processando viagem: {viagem.titulo} ===")
            
            participantes = viagem.participantes.all()
            
            if not participantes.exists():
                self.stdout.write(self.style.WARNING("  [!] Viagem sem participantes"))
                continue
            
            for idx, user in enumerate(participantes):
                membro, created = TripMember.objects.get_or_create(
                    viagem=viagem,
                    user=user,
                    defaults={
                        'role': 'ADMIN' if idx == 0 else 'MEMBER',
                        'status': 'CONFIRMED'
                    }
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f"  [+] Criado: {user.email} como {membro.role}"))
                else:
                    self.stdout.write(f"  [i] Ja existe: {user.email} como {membro.role}")
        
        self.stdout.write(self.style.SUCCESS('\n[OK] Processamento concluido!\n'))
