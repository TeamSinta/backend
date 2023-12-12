import os

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from company.models import Company
from user.models import CustomUser, Role, UserCompanies


# API receives a authorization code from FE and then goes on with creating/authenticating the user.
class GoogleLogin(SocialLoginView):
    # authentication_classes = ()
    # permission_classes = ()
    print("auth google login")
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get("FRONTEND_CALLBACK_URL")
    print(callback_url)
    client_class = OAuth2Client


class MockGoogleLogin(LoginView):
    def post(self, request, *args, **kwargs):
        print("test mocklogin")
        # Create a mock user or retrieve an existing one
        user, created = CustomUser.objects.get_or_create(
            username="mockuser",
            defaults={
                "email": "mockuser@example.com",
                "is_active": True,
                "first_name": "Mock",
                "last_name": "Person",
                "profile_picture": "https://ak.picdn.net/contributors/436585/avatars/thumb.jpg?t=5674227",
            },
        )
        company, created = Company.objects.get_or_create(name="Mockkers")
        role, created = Role.objects.get_or_create(name="admin")
        UserCompanies.objects.get_or_create(user=user, company=company, defaults={"role": role})
        user.save()
        refresh = RefreshToken.for_user(user)

        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})
