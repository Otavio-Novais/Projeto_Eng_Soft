# planner/admin.py


from django.contrib import admin
from .models import Viagem # Importa o nosso modelo Viagem


# Registra o modelo Viagem para que ele apareça no site de administração.
admin.site.register(Viagem)
