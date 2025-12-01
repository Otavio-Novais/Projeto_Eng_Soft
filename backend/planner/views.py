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

        # Busca participantes com avatares
        participantes_data = []
        for p in v.participantes.all()[:5]:  # Limita a 5 participantes
            avatar_url = None
            if p.avatar:
                avatar_url = request.build_absolute_uri(p.avatar.url)
            participantes_data.append({
                'id': p.id,
                'name': p.full_name or p.email,
                'avatar': avatar_url
            })
        
        data.append({
            'id': v.id,
            'titulo': v.titulo,
            'destino': v.destino if hasattr(v, 'destino') else None,
            'data': v.data_inicio.strftime('%d %b') if hasattr(v, 'data_inicio') and v.data_inicio else "Data a definir",
            'data_inicio': v.data_inicio.isoformat() if v.data_inicio else None,
            'data_fim': v.data_fim.isoformat() if v.data_fim else None,
            'participantes_count': v.participantes.count(),
            'participantes': participantes_data,
            'status': status,          # Usado para filtrar no código (FUTURAS/PASSADAS)
            'status_display': status_display # Usado para escrever na tela
        })
    
    return Response(data)


# ===== VIEWS PARA MEMBROS E CONVITES =====
from .models import TripMember, TripInvite
from .serializers import TripMemberSerializer, TripInviteSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status as http_status
from django.core.mail import send_mail
from django.conf import settings as django_settings


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_membros_e_convites(request, viagem_id):
    """Lista todos os membros e convites pendentes de uma viagem"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    
    # Verifica se o usuário é membro da viagem (TripMember OU participantes)
    is_trip_member = TripMember.objects.filter(viagem=viagem, user=request.user).exists()
    is_participant = viagem.participantes.filter(id=request.user.id).exists()
    
    if not (is_trip_member or is_participant):
        return Response({"error": "Você não tem permissão para acessar esta viagem"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    # Busca membros
    membros = TripMember.objects.filter(viagem=viagem).select_related('user')
    membros_data = TripMemberSerializer(membros, many=True).data
    
    # Busca convites pendentes
    convites = TripInvite.objects.filter(viagem=viagem, status='PENDING').order_by('-created_at')
    convites_data = TripInviteSerializer(convites, many=True).data
    
    # Verifica se o usuário atual é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user).first()
    is_admin = user_member.role == 'ADMIN' if user_member else False
    
    return Response({
        'members': membros_data,
        'invites': convites_data,
        'is_admin': is_admin,
        'trip_info': {
            'id': viagem.id,
            'title': viagem.titulo,
            'date_range': f"{viagem.data_inicio.strftime('%d-%m')} {viagem.data_fim.strftime('%d %b')}" if viagem.data_inicio else ""
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enviar_convites(request, viagem_id):
    """Envia convites por email (separados por vírgula)"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    
    # Verifica se o usuário é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user, role='ADMIN').first()
    if not user_member:
        return Response({"error": "Apenas administradores podem enviar convites"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    emails_string = request.data.get('emails', '')
    emails = [e.strip() for e in emails_string.split(',') if e.strip()]
    
    if not emails:
        return Response({"error": "Nenhum email fornecido"}, status=http_status.HTTP_400_BAD_REQUEST)
    
    convites_criados = []
    erros = []
    
    for email in emails:
        # Verifica se já é membro
        if User.objects.filter(email=email, viagens=viagem).exists():
            erros.append(f"{email} já é membro da viagem")
            continue
        
        # Verifica se já tem convite pendente
        if TripInvite.objects.filter(viagem=viagem, email=email, status='PENDING').exists():
            erros.append(f"{email} já tem um convite pendente")
            continue
        
        # Cria o convite
        convite = TripInvite.objects.create(
            viagem=viagem,
            email=email,
            invited_by=request.user
        )
        
        # Envia email (simplificado - em produção usar templates)
        try:
            link_convite = f"https://tripsync.app/join/{convite.token}"
            send_mail(
                subject=f"Convite para {viagem.titulo}",
                message=f"Você foi convidado para participar da viagem {viagem.titulo}. Acesse: {link_convite}",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            convites_criados.append(email)
        except Exception as e:
            erros.append(f"{email}: Erro ao enviar email - {str(e)}")
    
    return Response({
        'message': f'{len(convites_criados)} convite(s) enviado(s)',
        'convites_criados': convites_criados,
        'erros': erros
    }, status=http_status.HTTP_201_CREATED if convites_criados else http_status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reenviar_convite(request, viagem_id, convite_id):
    """Reenvia um convite"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    convite = get_object_or_404(TripInvite, pk=convite_id, viagem=viagem)
    
    # Verifica se o usuário é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user, role='ADMIN').first()
    if not user_member:
        return Response({"error": "Apenas administradores podem reenviar convites"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    # Atualiza data de expiração
    convite.expires_at = timezone.now() + timedelta(days=7)
    convite.save()
    
    # Reenvia email
    try:
        link_convite = f"https://tripsync.app/join/{convite.token}"
        send_mail(
            subject=f"Lembrete: Convite para {viagem.titulo}",
            message=f"Lembrete: Você foi convidado para {viagem.titulo}. Acesse: {link_convite}",
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[convite.email],
            fail_silently=False,
        )
        return Response({"message": "Convite reenviado com sucesso"})
    except Exception as e:
        return Response({"error": f"Erro ao enviar email: {str(e)}"}, 
                       status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancelar_convite(request, viagem_id, convite_id):
    """Cancela um convite pendente"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    convite = get_object_or_404(TripInvite, pk=convite_id, viagem=viagem)
    
    # Verifica se o usuário é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user, role='ADMIN').first()
    if not user_member:
        return Response({"error": "Apenas administradores podem cancelar convites"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    convite.status = 'CANCELLED'
    convite.save()
    
    return Response({"message": "Convite cancelado"}, status=http_status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def alternar_admin(request, viagem_id, membro_id):
    """Promove ou remove permissão de admin de um membro"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    membro = get_object_or_404(TripMember, pk=membro_id, viagem=viagem)
    
    # Verifica se o usuário é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user, role='ADMIN').first()
    if not user_member:
        return Response({"error": "Apenas administradores podem alterar permissões"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    # Impede que o criador perca o admin
    primeiro_admin = viagem.members.filter(role='ADMIN').order_by('joined_at').first()
    if membro == primeiro_admin and membro.role == 'ADMIN':
        return Response({"error": "O criador da viagem não pode perder permissões de admin"}, 
                       status=http_status.HTTP_400_BAD_REQUEST)
    
    # Alterna o role
    membro.role = 'MEMBER' if membro.role == 'ADMIN' else 'ADMIN'
    membro.save()
    
    return Response({
        "message": f"Usuário {'promovido a admin' if membro.role == 'ADMIN' else 'removido de admin'}",
        "new_role": membro.role
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remover_membro(request, viagem_id, membro_id):
    """Remove um membro da viagem"""
    viagem = get_object_or_404(Viagem, pk=viagem_id)
    membro = get_object_or_404(TripMember, pk=membro_id, viagem=viagem)
    
    # Verifica se o usuário é admin
    user_member = TripMember.objects.filter(viagem=viagem, user=request.user, role='ADMIN').first()
    if not user_member:
        return Response({"error": "Apenas administradores podem remover membros"}, 
                       status=http_status.HTTP_403_FORBIDDEN)
    
    # Impede remover o criador
    primeiro_admin = viagem.members.filter(role='ADMIN').order_by('joined_at').first()
    if membro == primeiro_admin:
        return Response({"error": "O criador da viagem não pode ser removido"}, 
                       status=http_status.HTTP_400_BAD_REQUEST)
    
    # Remove da tabela de membros e da relação ManyToMany
    user_to_remove = membro.user
    membro.delete()
    viagem.participantes.remove(user_to_remove)
    
    return Response({"message": "Membro removido com sucesso"}, status=http_status.HTTP_200_OK)
