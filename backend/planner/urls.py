from django.urls import path
from .views import TripDetailView, TripCreateView

urlpatterns = [
    path('trips/<int:trip_id>/', TripDetailView.as_view(), name='trip-detail'),
    
    # URL final será: http://localhost:8000/api/trips/create/
    path('trips/create/', TripCreateView.as_view(), name='trip-create'),
]