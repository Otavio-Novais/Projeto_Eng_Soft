from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

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

