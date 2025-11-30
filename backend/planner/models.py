from django.db import models

# Create your models here.

from django.conf import settings


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
