from django.contrib import admin
from .models import Destination, Trip, Activity, Photo


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "created_at")
    search_fields = ("name", "country")
    list_filter = ("country",)


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "destination", "start_date", "end_date", "status")
    list_filter = ("status", "start_date", "destination")
    search_fields = ("title", "user__username", "destination__name")
    date_hierarchy = "start_date"


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("name", "trip", "date", "time", "cost")
    list_filter = ("date", "trip")
    search_fields = ("name", "trip__title")
    date_hierarchy = "date"


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "caption", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("caption",)
    filter_horizontal = ("trips",)  # UI amigável para ManyToMany
