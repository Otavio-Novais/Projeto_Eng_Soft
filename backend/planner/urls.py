from django.urls import path
from . import views


urlpatterns = [
    # ... suas outras urls ...
    path('api/viagem/<int:trip_id>/', views.TripDetailView.as_view(), name='trip-detail'),
    path('api/viagem/<int:viagem_id>/financas/', views.dashboard_api, name='api_financas'),
    path('api/viagem/<int:viagem_id>/despesa/nova/', views.criar_despesa_api, name='api_nova_despesa'),
    path('api/viagem/<int:viagem_id>/liquidar/', views.liquidar_divida_api, name='api_liquidar'),
    path('api/viagens/criar/', views.TripCreateView.as_view(), name='trip-create'),
    path('api/viagens/', views.listar_viagens_api, name='api_listar_viagens'),
    
    # Rotas para Sugestões
    path('viagem/<int:tripId>/sugestoes/', views.ListarCriarSugestoesView.as_view(), name='listar-criar-sugestoes'),
    path('viagem/<int:tripId>/sugestoes/<int:sugestaoId>/', views.DetalheEditarDeleteSugestaoView.as_view(), name='detalhe-editar-delete-sugestao'),
    path('viagem/<int:tripId>/sugestoes/<int:sugestaoId>/votar/', views.VotarSugestaoView.as_view(), name='votar-sugestao'),
]