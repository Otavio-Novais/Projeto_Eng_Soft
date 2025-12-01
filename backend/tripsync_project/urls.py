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
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

# Imports do DRF e das suas Views (Suggestions)
from rest_framework.routers import DefaultRouter
from suggestions.views import TripViewSet, SuggestionViewSet, VoteViewSet

# Configuração do Router (Cria links para trips, suggestions e votes)
router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'suggestions', SuggestionViewSet)
router.register(r'votes', VoteViewSet)

# Função API Root (Documentação simples da API)
def api_root(request):
    return JsonResponse({
        'message': 'TripSync API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'planner': '/planner/api/',
            'suggestions': '/api/', # Adicionado para constar na documentação
            'admin': '/admin/',
        },
        'status': 'running'
    })

urlpatterns = [
    # Rota Raiz (Retorna o JSON acima)
    path('', api_root, name='api_root'),
    
    # Rota Admin
    path('admin/', admin.site.urls),

    # Rotas de Sugestões (Gerenciadas pelo Router: /api/trips/, /api/votes/, etc.)
    path('api/', include(router.urls)),

    # Rotas de Autenticação (Accounts)
    path('api/auth/', include('accounts.urls')), 
    
    # Rotas do Planner
    # Nota: No seu código havia duas linhas para planner. 
    # Unifiquei para 'planner/api/' para bater com a descrição do JSON acima.
    path('planner/api/', include('planner.urls')), 
]

# Configuração de arquivos de mídia (apenas em DEBUG)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
