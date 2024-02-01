import os

import workos
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from workos import client

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


class WorkOSAuthenticationView(LoginView):
    def post(self, request, *args, **kwargs):
        try:
            code = request.data.get("code")
            ip_address = request.META.get("REMOTE_ADDR")
            user_agent = request.META.get("HTTP_USER_AGENT")
            workos.api_key = os.environ.get("WORKOS_APIKEY")
            workos.client_id = os.environ.get("WORKOS_CLIENT")
            print("code > ", code)
            print("ip_address > ", ip_address)
            print("user_agent > ", user_agent)
            user_and_organization = client.user_management.authenticate_with_code(
                code=code,
                ip_address=ip_address,
                user_agent=user_agent,
            )
            print("user_and_organization > ", user_and_organization)
            workos_user = user_and_organization.get("user", {})
            email = workos_user.get("email", "")
            first_name = workos_user.get("first_name", "")
            last_name = workos_user.get("last_name", "")
            username = last_name
            user_id = workos_user.get("id", "")
            getUser = CustomUser.objects.filter(email=email).first()
            print("getUSerId  > ", getUser)
            if getUser is None:
                # User is new and yet not created company/organization
                new_org = client.organizations.create_organization(
                    {"name": username, "domains": [os.environ.get("DEFAULT_DOMAIN")]}
                )

                print("new_orga  > ", new_org)
                org_id = new_org.get("id", "")
                org_name = new_org.get("name", "")
                organization_membership = client.user_management.create_organization_membership(
                    user_id=user_id,
                    organization_id=org_id,
                )

                print("organization_membership > ", organization_membership)
                user, _ = CustomUser.objects.get_or_create(
                    username=username,
                    defaults={
                        "email": email,
                        "is_active": True,
                        "first_name": first_name,
                        "last_name": last_name,
                        "id": user_id,
                        "profile_picture": "https://ak.picdn.net/contributors/436585/avatars/thumb.jpg?t=5674227",
                    },
                )

                company, _ = Company.objects.get_or_create(name=org_name, id=org_id)
                role = os.environ.get("MOCK_ROLE", "admin")
                role, _ = Role.objects.get_or_create(name=role)
                UserCompanies.objects.get_or_create(
                    user=user, company=company, defaults={"role": role, "id": organization_membership.get("id")}
                )
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({"access": str(refresh.access_token), "refresh": str(refresh)})
            refresh = RefreshToken.for_user(getUser)
            return Response({"access": str(refresh.access_token), "refresh": str(refresh)})

        except Exception as e:
            print("login error >> ", e)
