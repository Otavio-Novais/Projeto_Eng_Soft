from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    
    # CORREÇÃO: Removemos 'password_2' daqui.
    # O Django vai reclamar menos e ainda vai permitir criar a senha.
    add_fieldsets = (
        (None, {
           'classes': ('wide',),
            'fields': ('email', 'password'), # Sem password_2
        }),
    )

# Se o erro persistir com o código acima, TROQUE o add_fieldsets por este:
#    add_fieldsets = (
#        (None, {
#            'classes': ('wide',),
#            'fields': ('email', 'password'), # Sem password_2
#        }),
#    )

admin.site.register(CustomUser, CustomUserAdmin)