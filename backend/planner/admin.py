from django.contrib import admin
from .models import Viagem, Despesa, Rateio


@admin.register(Viagem)
class ViagemAdmin(admin.ModelAdmin):
    list_display = ("titulo", "destino", "data_inicio", "data_fim")
    search_fields = ("titulo", "destino")
    list_filter = ("data_inicio", "data_fim")
    date_hierarchy = "data_inicio"


@admin.register(Despesa)
class DespesaAdmin(admin.ModelAdmin):
    list_display = (
        "titulo",
        "viagem",
        "pagador",
        "valor_total",
        "categoria",
        "data",
        "status",
    )
    list_filter = ("status", "categoria", "data")
    search_fields = ("titulo", "viagem__titulo", "pagador__username")
    date_hierarchy = "data"


@admin.register(Rateio)
class RateioAdmin(admin.ModelAdmin):
    list_display = ("despesa", "participante", "valor_devido")
    list_filter = ("despesa__viagem",)
    search_fields = ("despesa__titulo", "participante__username")
