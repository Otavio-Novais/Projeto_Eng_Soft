from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O Email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser precisa ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser precisa ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, verbose_name="Nome Completo")
    
    # Configurações e Preferências
    email_notifications = models.BooleanField(default=True, verbose_name="Receber Notificações")
    currency = models.CharField(max_length=3, default='BRL', verbose_name="Moeda Padrão")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefone")
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name="Foto de Perfil")
    city = models.CharField(max_length=100, blank=True, verbose_name="Cidade")
    birth_date = models.DateField(null=True, blank=True, verbose_name="Data de Nascimento")
    language = models.CharField(max_length=10, default='pt-br', verbose_name="Idioma")
    
    # Preferências de Viagem
    bio = models.TextField(blank=True, verbose_name="Sobre Mim")
    travel_style = models.CharField(max_length=50, blank=True, verbose_name="Estilo de Viagem")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email