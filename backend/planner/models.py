from django.db import models

# Create your models here.

from django.conf import settings
import uuid
from datetime import timedelta
from django.utils import timezone


class Viagem(models.Model):
    titulo = models.CharField(max_length=100)
    nome = models.CharField(max_length=200, help_text="O nome ou título da viagem.")
    destino = models.CharField(max_length=200)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    participantes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="viagens"
    )

    def __str__(self):
        return f"{self.nome} - {self.destino}"


class Despesa(models.Model):
    CATEGORIAS = [
        ("ALIMENTACAO", "Alimentação"),
        ("TRANSPORTE", "Transporte"),
        ("HOSPEDAGEM", "Hospedagem"),
        ("LAZER", "Lazer"),
        ("OUTROS", "Outros"),
    ]
    STATUS_CHOICES = [
        ("CONFIRMADO", "Confirmado"),
        ("RASCUNHO", "Rascunho"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="CONFIRMADO"
    )
    viagem = models.ForeignKey(
        Viagem, on_delete=models.CASCADE, related_name="despesas"
    )
    # Correção aqui também
    pagador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="despesas_pagas",
    )
    titulo = models.CharField(max_length=100)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default="OUTROS")
    data = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - R$ {self.valor_total}"


class Rateio(models.Model):
    despesa = models.ForeignKey(
        Despesa, on_delete=models.CASCADE, related_name="rateios"
    )

    participante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    valor_devido = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("despesa", "participante")


class TripMember(models.Model):
    """Modelo para gerenciar membros de uma viagem com roles"""
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    
    STATUS_CHOICES = [
        ('CONFIRMED', 'Confirmed'),
        ('INVITED', 'Invited'),
    ]
    
    viagem = models.ForeignKey(Viagem, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trip_memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='CONFIRMED')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('viagem', 'user')
    
    def __str__(self):
        return f"{self.user.email} - {self.viagem.titulo} ({self.role})"


class TripInvite(models.Model):
    """Modelo para gerenciar convites de viagem"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
    ]
    
    viagem = models.ForeignKey(Viagem, on_delete=models.CASCADE, related_name='invites')
    email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invites')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def __str__(self):
        return f"Invite to {self.email} for {self.viagem.titulo}"
