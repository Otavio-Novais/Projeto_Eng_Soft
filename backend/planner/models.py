from django.db import models

# Create your models here.

from django.conf import settings


class Viagem(models.Model):
    titulo = models.CharField(max_length=100)
    participantes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="viagens"
    )
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


class Sugestao(models.Model):
    TIPOS_CHOICES = [
        ('Hospedagem', 'Hospedagem'),
        ('Atividade', 'Atividade'),
        ('Comida', 'Comida'),
    ]
    STATUS_CHOICES = [
        ('Em votação', 'Em votação'),
        ('Em discussão', 'Em discussão'),
        ('Concluída', 'Concluída'),
        ('Reprovada', 'Reprovada'),
    ]

    viagem = models.ForeignKey(
        Viagem, on_delete=models.CASCADE, related_name="sugestoes"
    )
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPOS_CHOICES)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sugestoes_criadas"
    )
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='Em votação'
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titulo} - {self.tipo}"

    class Meta:
        ordering = ['-criado_em']


class Voto(models.Model):
    sugestao = models.ForeignKey(
        Sugestao, on_delete=models.CASCADE, related_name="votos"
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="votos"
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.email} votou em {self.sugestao.titulo}"

    class Meta:
        unique_together = ("sugestao", "usuario")
