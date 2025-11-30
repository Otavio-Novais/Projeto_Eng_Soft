"""
URL configuration for tripsync_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from suggestions.views import TripViewSet, SuggestionViewSet, VoteViewSet

from django.conf import settings
from django.conf.urls.static import static

# O Router cria os links automaticamente
router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'suggestions', SuggestionViewSet)
router.register(r'votes', VoteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    # rotas de autenticação/contas
    path('api/auth/', include('accounts.urls')),
    # rotas do planner (mantidas no root como antes)
    path('planner/', include('planner.urls')),
    # rotas geradas automaticamente pelo router das suggestions
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)