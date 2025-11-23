from django.urls import path
from .views import RegisterView, GoogleLoginView # <--- Importe aqui
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('google/', GoogleLoginView.as_view(), name='google_login'), # <--- Nova rota
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]