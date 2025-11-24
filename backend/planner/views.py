from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import TripDashboardSerializer

@api_view(['GET'])
def home_data(request):
    """
    API endpoint for home page data
    """
    data = {
        'features': [
            {
                'icon': '🗺️',
                'title': 'Collaborative Planning',
                'description': 'Create trips and invite friends to plan together in real-time.'
            },
            {
                'icon': '📅',
                'title': 'Detailed Itineraries',
                'description': 'Organize day-by-day activities and locations for your trip.'
            },
            {
                'icon': '💰',
                'title': 'Expense Tracking',
                'description': 'Track group expenses and see who paid for what.'
            },
            {
                'icon': '🔒',
                'title': 'Secure Authentication',
                'description': 'Safe and secure user registration and login system.'
            }
        ],
        'stats': {
            'trips': '10K+',
            'users': '50K+',
            'countries': '100+',
            'rating': '4.9★'
        }
    }
    return Response(data)

class TripDetailView(APIView):
    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, pk=trip_id)
        serializer = TripDashboardSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)