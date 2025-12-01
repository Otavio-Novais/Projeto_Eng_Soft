from rest_framework import serializers
from .models import Viagem, Despesa, Rateio, Sugestao, Voto
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']

class ExpenseSerializer(serializers.ModelSerializer):
    payer_name = serializers.ReadOnlyField(source='pagador.full_name')
    amount = serializers.DecimalField(source='valor_total', max_digits=10, decimal_places=2)
    title = serializers.CharField(source='titulo')
    
    class Meta:
        model = Despesa
        fields = ['id', 'title', 'amount', 'payer_name']

class TripDashboardSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    expenses = ExpenseSerializer(source='despesas', many=True, read_only=True)
    title = serializers.CharField(source='titulo')
    start_date = serializers.DateField(source='data_inicio')
    end_date = serializers.DateField(source='data_fim')
    # budget = serializers.DecimalField(max_digits=10, decimal_places=2, required=False) # Not in model yet

    class Meta:
        model = Viagem

        fields = ['id', 'title', 'start_date', 'end_date', 'participants', 'expenses', 'imagem', 'status']

    def get_participants(self, obj):
        """Retorna participantes do TripMember ou fallback para participantes ManyToMany"""
        from .models import TripMember
        
        # Tenta pegar do TripMember primeiro
        members = TripMember.objects.filter(viagem=obj, status='CONFIRMED').select_related('user')
        
        if members.exists():
            return [{
                'id': member.user.id,
                'email': member.user.email,
                'name': member.user.full_name or member.user.email.split('@')[0],
                'avatar': member.user.avatar.url if hasattr(member.user, 'avatar') and member.user.avatar else None,
                'role': member.role
            } for member in members]
        
        # Fallback para participantes ManyToMany antigo
        return [{
            'id': user.id,
            'email': user.email,
            'name': user.full_name or user.email.split('@')[0],
            'avatar': user.avatar.url if hasattr(user, 'avatar') and user.avatar else None,
            'role': 'MEMBER'
        } for user in obj.participantes.all()]


class TripSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='titulo')
    start_date = serializers.DateField(source='data_inicio')
    end_date = serializers.DateField(source='data_fim')
    description = serializers.CharField(required=False, allow_blank=True, source='nome') # Mapping description to nome for now

    class Meta:
        model = Viagem
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'imagem', 'status']

    def validate(self, data):
        start_date = data.get('data_inicio')
        end_date = data.get('data_fim')
        
        # Validação de datas
        if start_date and end_date:
            if start_date > end_date:
                raise serializers.ValidationError({
                    "end_date": "A data final deve ser posterior à data de início."
                })

            # Verificação se a data está no passado
            if start_date < timezone.now().date():
                raise serializers.ValidationError({
                    "start_date": "Não é possível criar uma viagem no passado."
                })

        return data


class VotoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.ReadOnlyField(source='usuario.full_name')
    
    class Meta:
        model = Voto
        fields = ['id', 'usuario', 'usuario_nome', 'criado_em']
        read_only_fields = ['id', 'criado_em']


class SugestaoSerializer(serializers.ModelSerializer):
    autor_nome = serializers.ReadOnlyField(source='autor.full_name')
    autor_email = serializers.ReadOnlyField(source='autor.email')
    autor_avatar = serializers.SerializerMethodField()
    votos_count = serializers.SerializerMethodField()
    usuario_votou = serializers.SerializerMethodField()
    
    class Meta:
        model = Sugestao
        fields = [
            'id', 'titulo', 'tipo', 'autor', 'autor_nome', 'autor_email', 'autor_avatar',
            'descricao', 'status', 'votos_count', 'usuario_votou',
            'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'autor', 'criado_em', 'atualizado_em']
    
    def get_autor_avatar(self, obj):
        if obj.autor.avatar:
            return obj.autor.avatar.url
        return None

    def get_votos_count(self, obj):
        return obj.votos.count()
    
    def get_usuario_votou(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votos.filter(usuario=request.user).exists()
        return False
# Serializers para Members e Invites
from .models import TripMember, TripInvite

class TripMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    is_creator = serializers.SerializerMethodField()
    
    class Meta:
        model = TripMember
        fields = ['id', 'user_id', 'user_name', 'user_email', 'user_avatar', 'role', 'status', 'joined_at', 'is_creator']
    
    def get_user_avatar(self, obj):
        if obj.user.avatar:
            return obj.user.avatar.url
        return None
    
    def get_is_creator(self, obj):
        # Verifica se é o criador da viagem (primeiro admin)
        return obj.role == 'ADMIN' and obj == obj.viagem.members.filter(role='ADMIN').order_by('joined_at').first()


class TripInviteSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
    days_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = TripInvite
        fields = ['id', 'email', 'status', 'invited_by_name', 'created_at', 'expires_at', 'days_ago', 'token']
        read_only_fields = ['token', 'created_at', 'expires_at']
    
    def get_days_ago(self, obj):
        delta = timezone.now() - obj.created_at
        days = delta.days
        if days == 0:
            return "agora"
        elif days == 1:
            return "há 1 dia"
        else:
            return f"há {days} dias"
