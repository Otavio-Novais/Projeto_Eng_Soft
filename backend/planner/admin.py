from django.contrib import admin
from .models import Viagem, Despesa, Rateio, Sugestao, Voto


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


@admin.register(Sugestao)
class SugestaoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "tipo", "viagem", "autor", "status", "criado_em")
    list_filter = ("tipo", "status", "viagem", "criado_em")
    search_fields = ("titulo", "descricao", "viagem__titulo", "autor__username")
    date_hierarchy = "criado_em"
    readonly_fields = ("criado_em", "atualizado_em")


@admin.register(Voto)
class VotoAdmin(admin.ModelAdmin):
    list_display = ("sugestao", "usuario", "criado_em")
    list_filter = ("sugestao__viagem", "criado_em")
    search_fields = ("sugestao__titulo", "usuario__username")
    date_hierarchy = "criado_em"
    readonly_fields = ("criado_em",)
