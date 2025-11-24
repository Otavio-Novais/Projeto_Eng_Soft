from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, GoogleLoginView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]