from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import TripDashboardSerializer
from .serializers import TripSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction, models
from django.db.models import Sum
import json
from .models import Viagem, Despesa, Rateio
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.views.decorators.http import require_http_methods
from django.db import transaction
from datetime import date

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
        trip = get_object_or_404(Viagem, pk=trip_id)
        serializer = TripDashboardSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TripCreateView(APIView):
    def post(self, request):
        serializer = TripSerializer(data = request.data)
        if serializer.is_valid():
            trip = serializer.save()
            trip.participantes.add(request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
User = get_user_model()

@csrf_exempt
@require_http_methods(["GET"])
def dashboard_api(request, viagem_id):
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    user = request.user
    
    # 1. Calcular saldos de TODOS (para o gráfico de usuários)
    participantes = viagem.participantes.all()
    resumo_todos = []
    
    for p in participantes:
        # Pega apenas despesas CONFIRMADAS
        pagou = Despesa.objects.filter(viagem=viagem, pagador=p, status='CONFIRMADO').aggregate(Sum('valor_total'))['valor_total__sum'] or 0
        consumiu = Rateio.objects.filter(despesa__viagem=viagem, despesa__status='CONFIRMADO', participante=p).aggregate(Sum('valor_devido'))['valor_devido__sum'] or 0
        resumo_todos.append({
            'id': p.id,
            'nome': p.first_name or p.email.split('@')[0],
            'saldo': float(pagou - consumiu)
        })

    # 2. Calcular Totais do USUÁRIO LOGADO (Para os cards do topo)
    # Quanto EU tenho a receber (meu saldo positivo) ou pagar (meu saldo negativo)
    meu_saldo_obj = next((item for item in resumo_todos if item['id'] == user.id), None)
    meu_saldo = meu_saldo_obj['saldo'] if meu_saldo_obj else 0

    # Lógica de negócio: 
    # Total a Receber = Soma dos saldos positivos de quem me deve (simplificado pelo saldo geral)
    # Total a Pagar = Meu saldo se for negativo
    
    # 3. Lista de Despesas (Incluindo Rascunhos se for o dono)
    despesas_qs = Despesa.objects.filter(viagem=viagem).order_by('-data', '-id')
    lista_despesas = []
    for d in despesas_qs:
        # Só mostra rascunho se for o dono
        if d.status == 'RASCUNHO' and d.pagador != user:
            continue
            
        lista_despesas.append({
            'id': d.id,
            'titulo': d.titulo,
            'valor': float(d.valor_total),
            'pagador': d.pagador.first_name or d.pagador.email.split('@')[0],
            'pagador_id': d.pagador.id,
            'data': d.data.strftime('%Y-%m-%d'),
            'status': d.status
        })

    return JsonResponse({
        'meta': {
            'titulo': viagem.titulo,
            'data': viagem.data_inicio.strftime('%d %b') if hasattr(viagem, 'data_inicio') and viagem.data_inicio else ""
        },
        # ADICIONE ESTA LINHA:
        'current_user_id': request.user.id, 
        
        'user_stats': {
            'a_receber': meu_saldo if meu_saldo > 0 else 0,
            'a_pagar': abs(meu_saldo) if meu_saldo < 0 else 0,
            'saldo_geral': meu_saldo
        },
        'resumo': resumo_todos,
        'despesas': lista_despesas
    })

@csrf_exempt
@require_http_methods(["POST"])
def criar_despesa_api(request, viagem_id):
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    try:
        data = json.loads(request.body)
        status = data.get('status', 'CONFIRMADO') # Recebe o status (Rascunho ou não)

        with transaction.atomic():
            pagador = get_object_or_404(User, pk=data['pagador_id'])
            nova_despesa = Despesa.objects.create(
                viagem=viagem,
                pagador=pagador,
                titulo=data['titulo'],
                valor_total=data['valor_total'],
                data=data['data'],
                status=status # Salva o status
            )

            # Só cria rateios se não for rascunho ou se tiver dados
            rateios_data = data.get('rateios', [])
            for r in rateios_data:
                participante = get_object_or_404(User, pk=r['user_id'])
                Rateio.objects.create(
                    despesa=nova_despesa,
                    participante=participante,
                    valor_devido=r['valor']
                )

        return JsonResponse({'message': 'Salvo!', 'id': nova_despesa.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@csrf_exempt
@require_http_methods(["POST"])
def liquidar_divida_api(request, viagem_id):
    """
    Registra um pagamento direto (reembolso) entre duas pessoas para quitar dívida.
    """
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    
    try:
        data = json.loads(request.body)
        devedor_id = data.get('devedor_id')  # Quem está pagando (ex: Ana)
        credor_id = data.get('credor_id')    # Quem está recebendo (ex: Bruno)
        valor = float(data.get('valor'))

        with transaction.atomic():
            # Cria uma despesa especial do tipo "ACERTO"
            devedor = get_object_or_404(User, pk=devedor_id)
            credor = get_object_or_404(User, pk=credor_id)

            nova_despesa = Despesa.objects.create(
                viagem=viagem,
                pagador=devedor,
                titulo=f"Acerto: {devedor.first_name} pagou {credor.first_name}",
                valor_total=valor,
                categoria='OUTROS', # Poderia criar uma categoria REEMBOLSO
                data=timezone.now().date()
            )

            # O Credor é o único "beneficiário" dessa despesa, pois ele recebeu o dinheiro
            Rateio.objects.create(
                despesa=nova_despesa,
                participante=credor,
                valor_devido=valor
            )

        return JsonResponse({'message': 'Dívida quitada com sucesso!'}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_viagens_api(request):
    # Filtra apenas as viagens do usuário logado
    viagens = Viagem.objects.filter(participantes=request.user).order_by('-id')
    
    data = []
    hoje = date.today()

    for v in viagens:
        # Lógica simples: Se a data já passou, está concluída. Se é futura ou sem data, é planejamento.
        status = 'PLANEJAMENTO'
        status_display = 'Em Planejamento'
        
        if v.data_inicio and v.data_inicio < hoje:
            status = 'CONCLUIDA'
            status_display = 'Concluída'

        data.append({
            'id': v.id,
            'titulo': v.titulo,
            'data': v.data_inicio.strftime('%d %b') if hasattr(v, 'data_inicio') and v.data_inicio else "Data a definir",
            'participantes_count': v.participantes.count(),
            'status': status,          # Usado para filtrar no código (FUTURAS/PASSADAS)
            'status_display': status_display # Usado para escrever na tela
        })
    
    return Response(data)
