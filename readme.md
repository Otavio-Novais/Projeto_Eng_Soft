<p align="center">
  <h1 align="center">TripSync ✈️</h1>
</p>

<p align="center">
  Uma aplicação web inteligente para planejar suas viagens em grupo de forma simples e organizada.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white" alt="Python Version">
  <img src="https://img.shields.io/badge/Django-5.1-green?logo=django&logoColor=white" alt="Django Version">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React Version">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node Version">
  <img src="https://github.com/Otavio-Novais/Projeto_Eng_Soft/actions/workflows/deploy.yml/badge.svg" alt="Deploy Status">
</p>

---

## 📋 Tabela de Conteúdos

* [Visão Geral](#️-visão-geral)
* [✨ Features](#-features)
* [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [🏛️ Arquitetura](#️-arquitetura)
* [📂 Estrutura de Diretórios](#-estrutura-de-diretórios)
* [▶️ Como Executar o Projeto](#️-como-executar-o-projeto)
* [🔐 Autenticação e Segurança](#-autenticação-e-segurança)
* [🌐 Deploy](#-deploy)

---

## 🖼️ Visão Geral

> **TripSync** é uma plataforma completa para planejamento colaborativo de viagens. Organize roteiros, controle despesas compartilhadas, gerencie participantes e receba sugestões de atividades - tudo em um só lugar. Chega de planilhas complicadas e conversas perdidas!

### Principais Diferenciais

* 💰 **Sistema de Divisão de Despesas Inteligente**: Algoritmo otimizado que minimiza o número de transações necessárias para acertar as contas
* 🗳️ **Banco de Sugestões com Votação**: Membros podem sugerir e votar em atividades, hospedagens e restaurantes
* 👥 **Gestão Avançada de Membros**: Sistema de convites por email e controle de permissões (admin/membro)
* 📊 **Dashboard Financeiro Completo**: Acompanhe gastos, saldos e sugestões de acerto em tempo real
* 🎯 **Interface Moderna e Intuitiva**: Design responsivo com componentes reutilizáveis e experiência otimizada

---

## ✨ Features

### 🎒 Planejamento de Viagens
* Criação de viagens com destino, datas e descrição
* Upload de imagem de capa personalizada
* Timeline visual das viagens (recentes, em planejamento, concluídas)
* Filtros e busca para organizar suas viagens

### 👥 Gestão de Participantes
* Convite de membros por email com link único
* Sistema de permissões (criador, admin, membro)
* Avatar personalizado para cada usuário
* Controle de entrada e saída de participantes

### 💸 Controle Financeiro Avançado
* Registro de despesas com categoria, pagador e data
* Sistema de rateio (igualmente, por valor ou percentual)
* Dashboard com saldos individuais em tempo real
* **Algoritmo de otimização de transações** (minimiza acertos necessários)
* Modal de acerto de contas com sugestões inteligentes
* Filtros por tipo de despesa e pagador
* Histórico completo de transações

### 🗳️ Banco de Sugestões
* Criação de sugestões por categoria (Hospedagem, Atividade, Comida)
* Sistema de votação colaborativo
* Barra de progresso visual de aprovação
* Filtros por categoria e texto
* Status da sugestão (Em votação, Aprovada, Reprovada)

### 🔐 Autenticação e Perfil
* Cadastro e login com validação de dados
* Perfil completo do usuário (foto, bio, preferências de viagem)
* Configurações de notificação e moeda
* Alteração de senha segura
* Sistema de recuperação de senha por email

### 📱 Interface e Experiência
* Design responsivo para mobile, tablet e desktop
* Tema consistente com paleta de cores moderna
* Componentes reutilizáveis (modais, cards, formulários)
* Feedback visual em todas as ações
* Sidebar de navegação intuitiva

---

## 🚀 Tecnologias Utilizadas

### Backend
* **Python 3.12** - Linguagem de programação
* **Django 5.1** - Framework web principal
* **Django REST Framework** - API RESTful
* **PostgreSQL** - Banco de dados em produção
* **SQLite** - Banco de dados em desenvolvimento
* **Pillow** - Processamento de imagens
* **Django CORS Headers** - Configuração de CORS

### Frontend
* **React 18.3** - Biblioteca JavaScript para UI
* **React Router 7.1** - Roteamento do cliente
* **Vite 6.0** - Build tool e dev server
* **Lucide React** - Biblioteca de ícones
* **React DatePicker** - Seletor de datas
* **CSS Modules** - Estilização componentizada

### DevOps e Ferramentas
* **Git & GitHub** - Controle de versão
* **GitHub Actions** - CI/CD pipeline
* **Render** - Hospedagem (backend e frontend)
* **WhiteNoise** - Servidor de arquivos estáticos
* **Gunicorn** - Servidor WSGI
* **ESLint** - Linting JavaScript/React

---

## 🏛️ Arquitetura

O projeto utiliza uma arquitetura **cliente-servidor separada**, com backend Django fornecendo uma API RESTful e frontend React consumindo essa API.

### Backend (Django REST API)
```
Backend/
├── accounts/          # Autenticação e perfil de usuário
├── planner/          # Lógica principal das viagens
├── suggestions/      # Sistema de sugestões e votação
├── tripsync_project/ # Configurações do projeto
└── media/           # Uploads (avatares, capas)
```

**Principais Apps:**
- `accounts`: Gerencia usuários, autenticação JWT, perfil e avatares
- `planner`: Viagens, membros, despesas e algoritmo de otimização financeira
- `suggestions`: Sugestões de atividades, hospedagem e comida com votação

### Frontend (React SPA)
```
frontend/tripsync-frontend/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/        # Páginas da aplicação
│   ├── contexts/     # Contexts da API (TripsContext)
│   ├── hooks/        # Custom hooks (useAuthCheck)
│   └── services/     # Comunicação com API
└── public/          # Arquivos estáticos
```

**Padrões Utilizados:**
- Context API para gerenciamento de estado global
- Custom hooks para lógica reutilizável
- Componentes funcionais com React Hooks
- CSS Modules para estilos isolados

---

## 📂 Estrutura de Diretórios

```
Projeto_Eng_Soft/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 🚀 Pipeline de deploy automático
│
├── backend/                    # 🐍 Django REST API
│   ├── accounts/              # Autenticação e perfil
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── planner/               # Viagens e finanças
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── suggestions/           # Sistema de sugestões
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── tripsync_project/      # Configurações do Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── media/                 # Uploads (avatares, imagens)
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
├── frontend/                   # ⚛️ React Application
│   └── tripsync-frontend/
│       ├── public/
│       │   ├── index.html
│       │   └── favicon.svg    # Ícone Lucide Map
│       ├── src/
│       │   ├── components/    # Componentes reutilizáveis
│       │   │   ├── layout/
│       │   │   │   └── Sidebar.jsx
│       │   │   ├── common/
│       │   │   │   ├── CustomDatePicker.jsx
│       │   │   │   └── SearchableSelect.jsx
│       │   │   ├── dashboard/
│       │   │   ├── create_trip/
│       │   │   ├── AddExpenseModal.jsx
│       │   │   └── SettlementModal.jsx
│       │   ├── pages/         # Páginas principais
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Finance/
│       │   │   │   └── FinancePage.jsx
│       │   │   ├── Members/
│       │   │   │   └── MembersPage.jsx
│       │   │   ├── Suggestions/
│       │   │   │   └── SuggestionsPage.jsx
│       │   │   ├── Profile/
│       │   │   │   └── ProfilePage.jsx
│       │   │   ├── Settings/
│       │   │   │   └── SettingsPage.jsx
│       │   │   └── mytrips/
│       │   │       └── MyTripsPage.jsx
│       │   ├── contexts/      # React Context
│       │   │   └── TripsContext.js
│       │   ├── hooks/         # Custom Hooks
│       │   │   └── useAuthCheck.js
│       │   ├── services/      # API Services
│       │   │   ├── api.js
│       │   │   └── suggestionsApi.js
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
└── readme.md                   # 📖 Este arquivo
```

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

* **Python 3.12+**
* **Node.js 20+** e npm
* **Git**
* **PostgreSQL** (para produção) ou SQLite (desenvolvimento)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Otavio-Novais/Projeto_Eng_Soft.git
cd Projeto_Eng_Soft
```

### 2️⃣ Configurar o Backend (Django)

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env com variáveis de ambiente
# SECRET_KEY=sua-chave-secreta
# DEBUG=True
# DATABASE_URL=sqlite:///db.sqlite3

# Executar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Iniciar servidor de desenvolvimento
python manage.py runserver
```

O backend estará rodando em `http://localhost:8000`

### 3️⃣ Configurar o Frontend (React)

```bash
cd frontend/tripsync-frontend

# Instalar dependências
npm install

# Criar arquivo .env (se necessário)
# VITE_API_URL=http://localhost:8000

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 4️⃣ Acessar a Aplicação

Abra seu navegador e acesse `http://localhost:5173`

---

## 🔐 Autenticação e Segurança

* **JWT (JSON Web Tokens)** para autenticação stateless
* **bcrypt** para hash de senhas
* **CORS** configurado para comunicação segura entre frontend e backend
* **Validação de dados** em ambos frontend e backend
* **Proteção contra CSRF** com Django
* **Sistema de permissões** baseado em roles (criador, admin, membro)

---

## 🌐 Deploy

### Backend (Render)
O backend está configurado para deploy no Render com:
- Gunicorn como servidor WSGI
- WhiteNoise para arquivos estáticos
- PostgreSQL como banco de dados
- Variáveis de ambiente gerenciadas pelo Render

### Frontend (Render Static Site)
O frontend é servido como site estático:
- Build otimizado com Vite
- Roteamento client-side com React Router
- Assets minificados e comprimidos

### CI/CD
Pipeline automatizado com GitHub Actions:
- Build e testes em cada push
- Deploy automático para produção na branch main
- Verificação de ESLint e formatação

---

## 👥 Contribuidores

Este projeto foi desenvolvido como trabalho da disciplina de Engenharia de Software.

---

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---