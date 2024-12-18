import os
import uuid

import workos
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView
from django.http import JsonResponse
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from june import analytics
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from workos import client

from company.models import Company
from user.models import CustomUser, Role, UserCompanies

workos.api_key = os.environ.get("WORKOS_APIKEY")
workos.client_id = os.environ.get("WORKOS_CLIENT")
analytics.write_key = os.environ.get("JUNE_ANALYTICS_WRITE_KEY", "default_key_if_not_set")
DEFAULT_PROFILE_URI = "https://ak.picdn.net/contributors/436585/avatars/thumb.jpg?t=5674227"


def get_or_create_company(org_name, org_id, user, org_member_id):
    print("org_member_id", org_member_id)
    new_company, _ = Company.objects.get_or_create(id=org_id, defaults={"id": org_id, "name": org_name})
    role = os.environ.get("MOCK_ROLE", "member")
    role, _ = Role.objects.get_or_create(name=role)
    UserCompanies.objects.get_or_create(
        user=user,
        company=new_company,
        defaults={"role": role, "id": org_member_id},
    )
    return new_company


def create_user_and_organization(user_and_organization):
    workos_user = user_and_organization.get("user", {})
    workos_org_id = user_and_organization.get("organization_id", None)
    email = workos_user.get("email", "")
    last_name = workos_user.get("last_name", "")
    profile_picture_url = workos_user.get("profile_picture_url", DEFAULT_PROFILE_URI)

    email_split = email.split("@")[0]
    first_name = workos_user.get("first_name", email_split)
    username = workos_user.get("username", email_split)

    # This has to be done because .get(key, default_value) is not working
    if first_name is None:
        first_name = email_split

    if username is None:
        username = email_split

    if profile_picture_url is None:
        profile_picture_url = DEFAULT_PROFILE_URI

    print("workos_user", workos_user)
    print("workos_org_id", workos_org_id)
    print("email", email)
    print("first_name", first_name)
    print("last_name", last_name)
    print("profile_picture_url", profile_picture_url)
    print(workos_user)

    workos_user_id = workos_user.get("id", "")
    get_user = CustomUser.objects.filter(email=email).first()
    print("get_user", get_user)
    if get_user is None:
        default_data = {
            "email": email,
            "is_active": True,
            "first_name": first_name,
            "id": workos_user_id,
            "username": username,
            "profile_picture": profile_picture_url,
        }
        if last_name != "":
            default_data["last_name"] = last_name
        new_user, _ = CustomUser.objects.get_or_create(
            id=workos_user_id,
            defaults=default_data,
        )
        analytics.identify(
            user_id=str(new_user.id),
            traits={"email": new_user.email, "first_name": new_user.first_name, "last_name": new_user.last_name},
        )
        analytics.track(user_id=str(new_user.id), event="user_signed_up")

        if workos_org_id is None:
            DEFAULT_DOMAIN = os.environ.get("DEFAULT_DOMAIN")
            new_org = client.organizations.create_organization(
                {"name": username, "domains": [DEFAULT_DOMAIN or "app.teamsinta.com"]}
            )

            org_id = new_org.get("id", "")
            org_name = new_org.get("name", "")
            organization_membership = client.user_management.create_organization_membership(
                user_id=workos_user_id,
                organization_id=org_id,
            )
            get_or_create_company(org_name, org_id, new_user, organization_membership.get("id"))

        else:
            workos_org = client.organizations.get_organization(organization=workos_org_id)
            print("workos_org", workos_org)
            workos_org_id = workos_org.get("id", "")
            workos_org_name = workos_org.get("name", "")
            organization_membership = client.user_management.list_organization_memberships(
                user_id=workos_user_id,
                organization_id=workos_org_id,
            )
            print("organization_membership", (vars(organization_membership)))
            om_data = organization_membership.data
            if om_data:
                om_data = om_data[0]
                get_or_create_company(workos_org_name, workos_org_id, new_user, om_data.get("id"))
            else:
                organization_membership = client.user_management.create_organization_membership(
                    user_id=workos_user_id,
                    organization_id=workos_org_id,
                )
                get_or_create_company(workos_org_name, workos_org_id, new_user, organization_membership.get("id"))

        new_user.save()
        print("all done new refresh token creating")
        refresh = RefreshToken.for_user(new_user)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}

    else:
        profile_picture_url = workos_user.get("profile_picture_url", None)
        if profile_picture_url is not None and get_user.profile_picture != profile_picture_url:
            CustomUser.objects.filter(id=workos_user_id).update(profile_picture=profile_picture_url)

    analytics.identify(user_id=str(get_user), traits={"email": get_user.email})
    analytics.track(user_id=str(get_user), event="user_logged_in")
    refresh = RefreshToken.for_user(get_user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class GoogleLogin(SocialLoginView):
    authentication_classes = ()
    permission_classes = ()
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get("FRONTEND_CALLBACK_URL")
    client_class = OAuth2Client


class MockGoogleLogin(LoginView):
    """
    Class for handling Mock-login. Does not require any params, and can be
    executed with an empty json.
    """

    @extend_schema(
        examples=[
            OpenApiExample(
                "Mock Login",
                summary="Default Empty Request",
                value={},
                request_only=True,
                response_only=False,
                description="Empty request does not require any values, defaults"
                " to creating or logging in as Mock-user",
            )
        ],
        responses=OpenApiResponse(
            status.HTTP_200_OK,
            description="Login Successful",
            examples=[
                OpenApiExample(
                    "login",
                    summary={"Successful login response"},
                    value={
                        "access": "eyJhbGciOiJIUzI1Ni..CJ9",
                        "refresh": "eyJhbGciOiJIUzI1Ni...v_E",
                    },
                )
            ],
        ),
    )
    def post(self, request, *args, **kwargs):
        # Create a mock user or retrieve an existing one
        user_id = str(uuid.uuid4())
        username = os.environ.get("MOCK_USERNAME", "mockuser")
        email = os.environ.get("MOCK_EMAIL", "mockuser@example.com")
        first_name = os.environ.get("MOCK_FIRST_NAME", "Mock")
        last_name = os.environ.get("MOCK_LAST_NAME", "Mockers")
        company_name = os.environ.get("MOCK_COMPANY_NAME", "Mock Company")
        role = os.environ.get("MOCK_ROLE", "admin")

        user, _ = CustomUser.objects.get_or_create(
            username=username,
            defaults={
                "id": user_id,
                "email": email,
                "is_active": True,
                "first_name": first_name,
                "last_name": last_name,
                "profile_picture": DEFAULT_PROFILE_URI,
            },
        )
        company_unique_id = os.environ.get("MOCK_COMPANY_UNIQUE_ID", "mock-company-1")
        company, created = Company.objects.get_or_create(id=company_unique_id, defaults={"name": company_name})
        role, _ = Role.objects.get_or_create(name=role)
        UserCompanies.objects.get_or_create(user=user, company=company, defaults={"role": role})
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})


class WorkOSAuthenticationView(LoginView):
    def post(self, request, *args, **kwargs):
        try:
            code = request.data.get("code")
            user_agent = request.META.get("HTTP_USER_AGENT")
            user_and_organization = client.user_management.authenticate_with_code(
                code=code,
                user_agent=user_agent,
            )
            print("user_and_organization", user_and_organization)
            response = create_user_and_organization(user_and_organization)
            return Response(response)

        except Exception as e:
            print("login error >> ", e)
            if hasattr(e, "message") and e.message is not None:
                return JsonResponse({"message": e.message, "code": e.code}, status=406)
            return JsonResponse({"message": e}, status=406)


class WorkOSAuthKitView(LoginView):
    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get("email")
            code = request.data.get("code")

            if code:
                user_and_organization = client.user_management.authenticate_with_magic_auth(
                    email=email,
                    code=code,
                )
                response = create_user_and_organization(user_and_organization)
                return Response(response)

            client.user_management.send_magic_auth_code(
                email=email,
            )
            return Response(True)

        except Exception as e:
            print("WorkOSAuthKitView code >> ", e)
            if hasattr(e, "code"):
                if e.code == "invalid_one_time_code":
                    return JsonResponse({"message": "Code already used or expired", "code": e.code}, status=406)
                if e.code == "invalid_request_parameters":
                    return JsonResponse({"message": e.errors[0].message, "code": e.code}, status=406)
            if hasattr(e, "message") and e.message is not None:
                return JsonResponse({"message": e.message, "code": "e.code"}, status=406)
            return JsonResponse({"message": e}, status=400)
