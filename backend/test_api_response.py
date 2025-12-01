import os
import django
from django.test import RequestFactory
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tripsync_project.settings')
django.setup()

from planner.views import dashboard_api

User = get_user_model()

# Pegar seu usuário
user = User.objects.get(email='otavioaugustonv2@gmail.com')

# Criar uma requisição fake
factory = RequestFactory()
request = factory.get('/planner/api/viagem/10/financas/')
request.user = user

# Chamar a view diretamente
response = dashboard_api(request, 10)

# Imprimir o JSON retornado
import json
data = json.loads(response.content)

print('\n=== RESPOSTA DA API ===\n')
print('Resumo de participantes:')
for p in data['resumo']:
    print(f"  {p['nome']}: R$ {p['saldo']}")
