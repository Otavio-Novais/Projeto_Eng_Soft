"""
Script para popular dados de teste no sistema de finanças
"""
import os
import django
from datetime import date, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from planner.models import Viagem, Despesa, Rateio, TripMember

User = get_user_model()

def criar_usuarios_teste():
    """Cria usuários de teste se não existirem"""
    usuarios = []
    
    dados_usuarios = [
        {'email': 'ana@teste.com', 'first_name': 'Ana', 'password': 'senha123'},
        {'email': 'bruno@teste.com', 'first_name': 'Bruno', 'password': 'senha123'},
        {'email': 'carla@teste.com', 'first_name': 'Carla', 'password': 'senha123'},
    ]
    
    for dados in dados_usuarios:
        user, created = User.objects.get_or_create(
            email=dados['email'],
            defaults={'first_name': dados['first_name']}
        )
        if created:
            user.set_password(dados['password'])
            user.save()
            print(f"✓ Criado: {user.email}")
        else:
            print(f"→ Já existe: {user.email}")
        usuarios.append(user)
    
    return usuarios

def adicionar_participantes_viagem(viagem, usuarios):
    """Adiciona participantes à viagem"""
    print(f"\n=== Adicionando participantes à viagem: {viagem.titulo} ===")
    
    for user in usuarios:
        # Adiciona ao ManyToMany (vai acionar o signal automaticamente)
        if user not in viagem.participantes.all():
            viagem.participantes.add(user)
            print(f"✓ Adicionado: {user.first_name}")
        else:
            print(f"→ Já participa: {user.first_name}")

def criar_despesas_teste(viagem, usuarios):
    """Cria despesas de teste variadas"""
    print(f"\n=== Criando despesas para: {viagem.titulo} ===")
    
    hoje = date.today()
    
    despesas_dados = [
        {
            'titulo': 'Reserva Airbnb',
            'valor': 2400.00,
            'pagador': usuarios[0],  # Ana
            'categoria': 'HOSPEDAGEM',
            'divisao': 'igual'  # Divide entre todos
        },
        {
            'titulo': 'Jantar no Restaurante',
            'valor': 450.00,
            'pagador': usuarios[1],  # Bruno
            'categoria': 'ALIMENTACAO',
            'divisao': 'igual'
        },
        {
            'titulo': 'Combustível',
            'valor': 300.00,
            'pagador': usuarios[2],  # Carla
            'categoria': 'TRANSPORTE',
            'divisao': 'igual'
        },
        {
            'titulo': 'Supermercado',
            'valor': 680.00,
            'pagador': usuarios[0],  # Ana
            'categoria': 'ALIMENTACAO',
            'divisao': 'igual'
        },
        {
            'titulo': 'Passeio de Barco',
            'valor': 900.00,
            'pagador': usuarios[1],  # Bruno
            'categoria': 'LAZER',
            'divisao': 'custom',
            'rateio_custom': {usuarios[0].id: 300, usuarios[1].id: 300, usuarios[2].id: 300}
        },
    ]
    
    participantes = viagem.participantes.all()
    num_participantes = participantes.count()
    
    for i, dados in enumerate(despesas_dados):
        despesa, created = Despesa.objects.get_or_create(
            viagem=viagem,
            titulo=dados['titulo'],
            pagador=dados['pagador'],
            defaults={
                'valor_total': dados['valor'],
                'categoria': dados['categoria'],
                'data': hoje - timedelta(days=i),
                'status': 'CONFIRMADO'
            }
        )
        
        if created:
            print(f"\n✓ Despesa criada: {despesa.titulo} - R$ {despesa.valor_total}")
            print(f"  Pago por: {despesa.pagador.first_name}")
            
            # Criar rateios
            if dados['divisao'] == 'igual':
                valor_por_pessoa = despesa.valor_total / num_participantes
                for participante in participantes:
                    Rateio.objects.create(
                        despesa=despesa,
                        participante=participante,
                        valor_devido=valor_por_pessoa
                    )
                print(f"  Dividido igualmente: R$ {valor_por_pessoa:.2f} por pessoa")
            
            elif dados['divisao'] == 'custom':
                for user_id, valor in dados['rateio_custom'].items():
                    participante = User.objects.get(id=user_id)
                    Rateio.objects.create(
                        despesa=despesa,
                        participante=participante,
                        valor_devido=valor
                    )
                print(f"  Divisão customizada aplicada")
        else:
            print(f"→ Já existe: {despesa.titulo}")

def main():
    print("=" * 60)
    print("SCRIPT DE TESTE - SISTEMA DE FINANÇAS")
    print("=" * 60)
    
    # 1. Criar usuários de teste
    print("\n1. CRIANDO USUÁRIOS DE TESTE")
    usuarios = criar_usuarios_teste()
    
    # 2. Buscar a viagem mais recente do usuário logado
    print("\n2. BUSCANDO VIAGEM PARA TESTE")
    
    # Tenta encontrar uma viagem recente
    viagem = Viagem.objects.filter().order_by('-id').first()
    
    if not viagem:
        print("✗ Nenhuma viagem encontrada. Crie uma viagem primeiro!")
        return
    
    print(f"✓ Viagem selecionada: {viagem.titulo} (ID: {viagem.id})")
    
    # 3. Adicionar participantes
    print("\n3. ADICIONANDO PARTICIPANTES")
    adicionar_participantes_viagem(viagem, usuarios)
    
    # 4. Criar despesas
    print("\n4. CRIANDO DESPESAS DE TESTE")
    criar_despesas_teste(viagem, usuarios)
    
    # 5. Resumo final
    print("\n" + "=" * 60)
    print("RESUMO FINAL")
    print("=" * 60)
    print(f"Viagem: {viagem.titulo}")
    print(f"Participantes: {viagem.participantes.count()}")
    print(f"Despesas: {viagem.despesas.filter(status='CONFIRMADO').count()}")
    
    total_despesas = sum(d.valor_total for d in viagem.despesas.filter(status='CONFIRMADO'))
    print(f"Total em despesas: R$ {total_despesas:.2f}")
    
    print("\n✓ Script concluído com sucesso!")
    print(f"\nAcesse: http://localhost:3000/viagem/{viagem.id}/financas")

if __name__ == '__main__':
    main()
