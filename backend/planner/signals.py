from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import Viagem, TripMember


@receiver(m2m_changed, sender=Viagem.participantes.through)
def sync_trip_members(sender, instance, action, pk_set, **kwargs):
    """
    Sincroniza automaticamente TripMembers quando participantes são adicionados/removidos
    """
    if action == "post_add":
        # Quando participantes são adicionados
        for user_id in pk_set:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(pk=user_id)
            
            # Verifica se é o primeiro participante (será admin)
            is_first = not TripMember.objects.filter(viagem=instance).exists()
            
            TripMember.objects.get_or_create(
                viagem=instance,
                user=user,
                defaults={
                    'role': 'ADMIN' if is_first else 'MEMBER',
                    'status': 'CONFIRMED'
                }
            )
    
    elif action == "post_remove":
        # Quando participantes são removidos
        for user_id in pk_set:
            TripMember.objects.filter(viagem=instance, user_id=user_id).delete()


@receiver(post_save, sender=Viagem)
def create_trip_member_for_creator(sender, instance, created, **kwargs):
    """
    Garante que o criador da viagem seja adicionado como ADMIN no TripMember
    """
    if created:
        # Pega o primeiro participante (assumindo que é o criador)
        first_participant = instance.participantes.first()
        if first_participant:
            TripMember.objects.get_or_create(
                viagem=instance,
                user=first_participant,
                defaults={
                    'role': 'ADMIN',
                    'status': 'CONFIRMED'
                }
            )
