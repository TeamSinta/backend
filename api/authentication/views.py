import os

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from company.models import Company
from user.models import CustomUser, Role, UserCompanies


class GoogleLogin(SocialLoginView):
    authentication_classes = ()
    permission_classes = ()
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get("FRONTEND_CALLBACK_URL")
    client_class = OAuth2Client


class MockGoogleLogin(LoginView):
    def post(self, request, *args, **kwargs):
        # Create a mock user or retrieve an existing one
        username = os.environ.get("MOCK_USERNAME", "mockuser")
        email = os.environ.get("MOCK_EMAIL", "mockuser@example.com")
        first_name = os.environ.get("MOCK_FIRST_NAME", "Mock")
        last_name = os.environ.get("MOCK_LAST_NAME", "Mockers")
        company_name = os.environ.get("MOCK_COMPANY_NAME", "Mock Company")
        role = os.environ.get("MOCK_ROLE", "admin")

        user, created = CustomUser.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_active": True,
                "first_name": first_name,
                "last_name": last_name,
                "profile_picture": "https://ak.picdn.net/contributors/436585/avatars/thumb.jpg?t=5674227",
            },
        )
        company, created = Company.objects.get_or_create(name=company_name)
        role, created = Role.objects.get_or_create(name=role)
        UserCompanies.objects.get_or_create(user=user, company=company, defaults={"role": role})
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})
