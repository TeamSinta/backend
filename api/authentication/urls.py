import os

from dj_rest_auth.views import LogoutView
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import MockGoogleLogin, WorkOSAuthenticationView

environment = os.environ.get("ENVIRONMENT")
urlpatterns = [
    path("mocklogin/", MockGoogleLogin.as_view(), name="mock_auth_login")
    if environment in ["dev", "staging"]
    else path("", lambda request: None),
    path("login/", WorkOSAuthenticationView.as_view(), name="auth_login"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # potentially move this to another app.
    path("token/verify/", TokenVerifyView.as_view(), name="token/verify"),
]
