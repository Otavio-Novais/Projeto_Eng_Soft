from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Destination(models.Model):
    """Destino de viagem (ex.: Paris, Rio de Janeiro)."""

    name = models.CharField(max_length=100, unique=True, verbose_name="Nome")
    country = models.CharField(max_length=100, verbose_name="País")
    description = models.TextField(blank=True, verbose_name="Descrição")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Destino"
        verbose_name_plural = "Destinos"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}, {self.country}"


class Trip(models.Model):
    """Viagem planejada ou realizada por um usuário."""

    STATUS_CHOICES = [
        ("planned", "Planejada"),
        ("ongoing", "Em andamento"),
        ("completed", "Concluída"),
        ("cancelled", "Cancelada"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="trips", verbose_name="Usuário"
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.PROTECT,
        related_name="trips",
        verbose_name="Destino",
    )
    title = models.CharField(max_length=200, verbose_name="Título")
    start_date = models.DateField(verbose_name="Data de início")
    end_date = models.DateField(verbose_name="Data de término")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="planned", verbose_name="Status"
    )
    budget = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Orçamento"
    )
    notes = models.TextField(blank=True, verbose_name="Observações")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Viagem"
        verbose_name_plural = "Viagens"
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.title} - {self.destination.name} ({self.start_date})"


class Activity(models.Model):
    """Atividade ou evento dentro de uma viagem."""

    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name="activities", verbose_name="Viagem"
    )
    name = models.CharField(max_length=200, verbose_name="Nome")
    description = models.TextField(blank=True, verbose_name="Descrição")
    date = models.DateField(verbose_name="Data")
    time = models.TimeField(null=True, blank=True, verbose_name="Hora")
    location = models.CharField(max_length=200, blank=True, verbose_name="Local")
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Custo"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Atividade"
        verbose_name_plural = "Atividades"
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.name} - {self.trip.title}"


class Photo(models.Model):
    """Fotos associadas a uma ou mais viagens."""

    trips = models.ManyToManyField(Trip, related_name="photos", verbose_name="Viagens")
    image = models.ImageField(upload_to="trip_photos/%Y/%m/%d/", verbose_name="Imagem")
    caption = models.CharField(max_length=200, blank=True, verbose_name="Legenda")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Foto"
        verbose_name_plural = "Fotos"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"Foto {self.id} - {self.caption or 'Sem legenda'}"
