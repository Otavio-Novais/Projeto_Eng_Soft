from django.urls import path
from .views import TripDetailView

urlpatterns = [
    path('trips/<int:trip_id>/', TripDetailView.as_view(), name='trip-detail'),
]