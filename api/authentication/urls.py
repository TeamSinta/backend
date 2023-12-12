from dj_rest_auth.views import LogoutView
from django.conf import settings
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import GoogleLogin, MockGoogleLogin

urlpatterns = [
    path("login/", MockGoogleLogin.as_view() if settings.DEBUG else GoogleLogin.as_view(), name="auth_login"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # potentially move this to another app.
    path("token/verify/", TokenVerifyView.as_view(), name="token/verify"),
]
