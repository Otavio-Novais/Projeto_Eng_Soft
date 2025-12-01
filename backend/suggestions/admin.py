from django.contrib import admin
from .models import Trip, Suggestion, Option, Vote

# Registra as classes para que apareçam no painel Admin
admin.site.register(Trip)
admin.site.register(Suggestion)
admin.site.register(Option)
admin.site.register(Vote)