from django.contrib import admin

# Register your models here.

from .models import Viagem # Importa o nosso modelo Viagem

# Register your models here.
# Registra o modelo Viagem para que ele apareça no site de administração.
admin.site.register(Viagem)
