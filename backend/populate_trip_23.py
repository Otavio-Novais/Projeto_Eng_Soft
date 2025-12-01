import os
import sys
import django
from decimal import Decimal
from datetime import date, timedelta

# Configurar o Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from planner.models import Viagem, Despesa, Rateio, Sugestao, Voto, TripMember

User = get_user_model()

def popular_trip_23():
    try:
        # Buscar a viagem
        viagem = Viagem.objects.get(id=23)
        print(f"✓ Viagem encontrada: {viagem.nome}")
        
        # Buscar ou criar usuários para participantes
        usuarios = []
        emails_participantes = [
            'participante1@example.com',
            'participante2@example.com', 
            'participante3@example.com',
            'participante4@example.com',
        ]
        
        nomes_participantes = [
            'João Silva',
            'Maria Santos',
            'Pedro Oliveira',
            'Ana Costa',
        ]
        
        print("\n--- CRIANDO/BUSCANDO PARTICIPANTES ---")
        for email, nome in zip(emails_participantes, nomes_participantes):
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': nome,
                    'first_name': nome.split()[0],
                    'last_name': ' '.join(nome.split()[1:]) if len(nome.split()) > 1 else '',
                }
            )
            if created:
                user.set_password('senha123')
                user.save()
                print(f"✓ Usuário criado: {nome} ({email})")
            else:
                print(f"✓ Usuário já existe: {nome} ({email})")
            usuarios.append(user)
        
        # Adicionar participantes à viagem
        print("\n--- ADICIONANDO PARTICIPANTES À VIAGEM ---")
        for i, user in enumerate(usuarios):
            viagem.participantes.add(user)
            # Criar TripMember
            trip_member, created = TripMember.objects.get_or_create(
                viagem=viagem,
                user=user,
                defaults={
                    'role': 'ADMIN' if i == 0 else 'MEMBER',
                    'status': 'CONFIRMED'
                }
            )
            if created:
                print(f"✓ {user.first_name} adicionado como participante")
        
        viagem.save()
        print(f"✓ Total de participantes: {viagem.participantes.count()}")
        
        # Criar sugestões
        print("\n--- CRIANDO SUGESTÕES ---")
        sugestoes_data = [
            {
                'titulo': 'Hotel Beira Mar',
                'tipo': 'Hospedagem',
                'descricao': 'Hotel 4 estrelas com vista para o mar, café da manhã incluso e piscina. Excelente localização próxima aos principais pontos turísticos.',
                'autor': usuarios[0],
            },
            {
                'titulo': 'Passeio de Barco',
                'tipo': 'Atividade',
                'descricao': 'Passeio de 4 horas pelas ilhas da região com paradas para mergulho. Inclui equipamento de snorkel e lanche.',
                'autor': usuarios[1],
            },
            {
                'titulo': 'Restaurante Mar Azul',
                'tipo': 'Comida',
                'descricao': 'Restaurante especializado em frutos do mar frescos. Menu executivo com entrada, prato principal e sobremesa.',
                'autor': usuarios[2],
            },
            {
                'titulo': 'Pousada Centro',
                'tipo': 'Hospedagem',
                'descricao': 'Pousada aconchegante no centro histórico, com quartos climatizados e Wi-Fi gratuito. Café da manhã regional.',
                'autor': usuarios[0],
            },
            {
                'titulo': 'Trilha da Cachoeira',
                'tipo': 'Atividade',
                'descricao': 'Trilha guiada de dificuldade média até cachoeira com piscina natural. Duração aproximada de 3 horas ida e volta.',
                'autor': usuarios[3],
            },
            {
                'titulo': 'Pizzaria Italiana',
                'tipo': 'Comida',
                'descricao': 'Pizzaria tradicional com forno a lenha e receitas autênticas. Ambiente familiar e aconchegante.',
                'autor': usuarios[1],
            },
            {
                'titulo': 'City Tour Histórico',
                'tipo': 'Atividade',
                'descricao': 'Tour guiado pelos principais monumentos históricos da cidade. Inclui entrada em museus e transporte.',
                'autor': usuarios[2],
            },
            {
                'titulo': 'Churrascaria Boi na Brasa',
                'tipo': 'Comida',
                'descricao': 'Rodízio de carnes nobres com buffet de saladas e acompanhamentos. Sistema de espeto corrido.',
                'autor': usuarios[3],
            },
        ]
        
        sugestoes_criadas = []
        for sug_data in sugestoes_data:
            sugestao, created = Sugestao.objects.get_or_create(
                viagem=viagem,
                titulo=sug_data['titulo'],
                defaults={
                    'tipo': sug_data['tipo'],
                    'descricao': sug_data['descricao'],
                    'autor': sug_data['autor'],
                    'status': 'Em votação',
                }
            )
            if created:
                print(f"✓ Sugestão criada: {sugestao.titulo}")
                sugestoes_criadas.append(sugestao)
            else:
                print(f"✓ Sugestão já existe: {sugestao.titulo}")
                sugestoes_criadas.append(sugestao)
        
        # Adicionar votos às sugestões
        print("\n--- ADICIONANDO VOTOS ---")
        import random
        for sugestao in sugestoes_criadas:
            # Cada sugestão recebe votos aleatórios de 2 a 4 participantes
            num_votos = random.randint(2, 4)
            votantes = random.sample(usuarios, num_votos)
            
            for user in votantes:
                voto, created = Voto.objects.get_or_create(
                    sugestao=sugestao,
                    usuario=user
                )
                if created:
                    print(f"  • {user.first_name} votou em '{sugestao.titulo}'")
        
        # Criar despesas financeiras
        print("\n--- CRIANDO DESPESAS ---")
        despesas_data = [
            {
                'titulo': 'Reserva Hotel - Primeira Noite',
                'valor_total': Decimal('450.00'),
                'categoria': 'HOSPEDAGEM',
                'pagador': usuarios[0],
                'data': date.today() - timedelta(days=5),
            },
            {
                'titulo': 'Almoço no Restaurante',
                'valor_total': Decimal('180.00'),
                'categoria': 'ALIMENTACAO',
                'pagador': usuarios[1],
                'data': date.today() - timedelta(days=4),
            },
            {
                'titulo': 'Combustível - Ida',
                'valor_total': Decimal('200.00'),
                'categoria': 'TRANSPORTE',
                'pagador': usuarios[2],
                'data': date.today() - timedelta(days=3),
            },
            {
                'titulo': 'Ingressos Parque',
                'valor_total': Decimal('120.00'),
                'categoria': 'LAZER',
                'pagador': usuarios[3],
                'data': date.today() - timedelta(days=2),
            },
            {
                'titulo': 'Jantar Pizzaria',
                'valor_total': Decimal('160.00'),
                'categoria': 'ALIMENTACAO',
                'pagador': usuarios[0],
                'data': date.today() - timedelta(days=1),
            },
            {
                'titulo': 'Taxi Aeroporto',
                'valor_total': Decimal('80.00'),
                'categoria': 'TRANSPORTE',
                'pagador': usuarios[1],
                'data': date.today(),
            },
        ]
        
        for desp_data in despesas_data:
            despesa, created = Despesa.objects.get_or_create(
                viagem=viagem,
                titulo=desp_data['titulo'],
                defaults={
                    'valor_total': desp_data['valor_total'],
                    'categoria': desp_data['categoria'],
                    'pagador': desp_data['pagador'],
                    'data': desp_data['data'],
                    'status': 'CONFIRMADO',
                }
            )
            
            if created:
                print(f"✓ Despesa criada: {despesa.titulo} - R$ {despesa.valor_total}")
                
                # Criar rateios (dividir igualmente entre todos os participantes)
                valor_por_pessoa = despesa.valor_total / len(usuarios)
                for user in usuarios:
                    rateio, _ = Rateio.objects.get_or_create(
                        despesa=despesa,
                        participante=user,
                        defaults={'valor_devido': valor_por_pessoa}
                    )
                print(f"  • Rateio: R$ {valor_por_pessoa:.2f} por pessoa")
            else:
                print(f"✓ Despesa já existe: {despesa.titulo}")
        
        # Resumo final
        print("\n" + "="*50)
        print("RESUMO DA POPULAÇÃO")
        print("="*50)
        print(f"Viagem: {viagem.nome}")
        print(f"Participantes: {viagem.participantes.count()}")
        print(f"Sugestões: {viagem.sugestoes.count()}")
        print(f"Votos totais: {Voto.objects.filter(sugestao__viagem=viagem).count()}")
        print(f"Despesas: {viagem.despesas.count()}")
        print(f"Total gasto: R$ {sum(d.valor_total for d in viagem.despesas.all()):.2f}")
        print("="*50)
        print("✓ População concluída com sucesso!")
        
    except Viagem.DoesNotExist:
        print("✗ ERRO: Viagem com ID 23 não encontrada!")
        print("Por favor, certifique-se de que a viagem existe no banco de dados.")
    except Exception as e:
        print(f"✗ ERRO: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    popular_trip_23()
