from rest_framework import viewsets
from .models import Trip, Suggestion, Vote
from .serializers import TripSerializer, SuggestionSerializer, VoteSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class SuggestionViewSet(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer

    # Este método permite filtrar sugestões por viagem na URL
    # Ex: /api/suggestions/?trip_id=1
    def get_queryset(self):
        queryset = Suggestion.objects.all()
        trip_id = self.request.query_params.get('trip_id')
        if trip_id:
            queryset = queryset.filter(trip_id=trip_id)
        return queryset

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer