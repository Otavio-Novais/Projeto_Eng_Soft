from django.urls import path
from . import views

urlpatterns = [
    # --- VIAGENS E DETALHES ---
    path('viagem/<int:trip_id>/', views.TripDetailView.as_view(), name='trip-detail'),
    path('viagem/<int:viagem_id>/financas/', views.dashboard_api, name='api_financas'),
    path('viagem/<int:viagem_id>/despesa/nova/', views.criar_despesa_api, name='api_nova_despesa'),
    path('viagem/<int:viagem_id>/liquidar/', views.liquidar_divida_api, name='api_liquidar'),
    
    # Suas rotas corrigidas
    path('viagens/criar/', views.TripCreateView.as_view(), name='trip-create'),
    path('viagens/', views.listar_viagens_api, name='api_listar_viagens'),
    
    # --- SUGESTÕES ---
    path('viagem/<int:tripId>/sugestoes/', views.ListarCriarSugestoesView.as_view(), name='listar-criar-sugestoes'),
    path('viagem/<int:tripId>/sugestoes/<int:sugestaoId>/', views.DetalheEditarDeleteSugestaoView.as_view(), name='detalhe-editar-delete-sugestao'),
    path('viagem/<int:tripId>/sugestoes/<int:sugestaoId>/votar/', views.VotarSugestaoView.as_view(), name='votar-sugestao'),

    # --- MEMBROS E CONVITES ---
    path('viagem/<int:viagem_id>/membros/', views.listar_membros_e_convites, name='api_listar_membros'),
    path('viagem/<int:viagem_id>/convites/enviar/', views.enviar_convites, name='api_enviar_convites'),
    path('viagem/<int:viagem_id>/convites/<int:convite_id>/reenviar/', views.reenviar_convite, name='api_reenviar_convite'),
    path('viagem/<int:viagem_id>/convites/<int:convite_id>/cancelar/', views.cancelar_convite, name='api_cancelar_convite'),
    path('viagem/<int:viagem_id>/membros/<int:membro_id>/toggle-admin/', views.alternar_admin, name='api_alternar_admin'),
    path('viagem/<int:viagem_id>/membros/<int:membro_id>/remover/', views.remover_membro, name='api_remover_membro'),
]