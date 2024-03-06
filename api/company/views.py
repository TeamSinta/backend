import json
import os
import uuid

from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import OpenApiExample, extend_schema
from june import analytics
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from workos import client

from app.permissions import isAdminRole
from app.serializers import ErrorSerializer
from user.models import CustomUser, Role, UserCompanies, UserDepartments
from user.serializers import UserCompanySerializer

from .models import Company, Department
from .serializers import (
    AddDepartmentMembersSerializer,
    CompanySerializer,
    DepartmentMembersSerializer,
    DepartmentSerializer,
    RemoveDepartmentMembersSerializer,
)

analytics.write_key = os.environ.get("JUNE_ANALYTICS_WRITE_KEY", "default_key_if_not_set")


def perform_destroy(self, queryset):
    for instance in queryset:
        instance.deleted_at = timezone.now()
        instance.deleted_by = self.request.user
        instance.save()


def check_permissions_and_existence(user, **kwargs):
    company_id = kwargs.get("company_id")
    department_id = kwargs.get("department_id")

    if department_id:
        print("Checking department ID", department_id)
        get_object_or_404(Department, id=department_id)
        return UserDepartments.objects.filter(user=user, department_id=department_id).exists()

    elif company_id:
        print("Checking company ID", company_id)
        get_object_or_404(Company, id=company_id)
        return UserCompanies.objects.filter(user=user, company_id=company_id).exists()
    else:
        return False


def check_role_permission(view_instance, request):
    for permission_class in view_instance.permission_classes:
        if not permission_class().has_permission(request, view_instance):
            raise PermissionDenied


class CompanyView(viewsets.ModelViewSet):
    """
    Manages company CRUD actions.
    Utilizes CompanySerializer for data validation and serialization.
    Requires user authentication
    """

    queryset = Company.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer

    def get_queryset(self):
        return Company.objects.filter(deleted_at__isnull=True)

    """ API Docs for Create"""

    @extend_schema(
        request=CompanySerializer,
        examples=[
            OpenApiExample(
                "Create Company",
                summary="Create a new company",
                value={"name": "Example Company"},
                response_only=True,
                description="Response for successfully creating a company",
            ),
        ],
        responses={status.HTTP_201_CREATED: CompanySerializer, status.HTTP_400_BAD_REQUEST: ErrorSerializer},
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        org_name = serializer.validated_data["name"]

        try:
            # Create organization in WorkOS
            organization = client.organizations.create_organization({"name": org_name, "domains": ["example.com"]})
            # Create company in local db with same id and name
            if not organization["id"]:
                raise ValueError("Organization creation failed in WorkOS")

            # Adds user as Org member
            client.user_management.create_organization_membership(user_id=user.id, organization_id=organization["id"])

            # WorkOS completed, creating company in local db
            company = Company.objects.create(id=organization["id"], name=org_name)
            role = get_object_or_404(Role, id="1")
            user_company_uuid = str(uuid.uuid4())
            UserCompanies.objects.create(id=user_company_uuid, user=user, company=company, role=role)

        except ValueError as ve:
            return Response({"detail": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(CompanySerializer(company).data, status=status.HTTP_201_CREATED)

    """ API Docs for Retrieve"""

    @extend_schema(
        request=CompanySerializer,
        examples=[
            OpenApiExample(
                "Retrieve Company",
                summary="Retrieve a specific company",
                value={
                    "id": "Example_id",
                    "name": "Example Company",
                    "created_at": "2024-01-01T01:12:13.123456Z",
                    "updated_at": "2024-01-01T01:12:13.123456Z",
                    "deleted_at": None,
                },
                response_only=True,
                description="Response for successfully retrieving a company's details.",
            ),
        ],
        responses={status.HTTP_200_OK: CompanySerializer, status.HTTP_404_NOT_FOUND: ErrorSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        company = get_object_or_404(Company, id=kwargs.get("pk"))
        serializer = self.get_serializer(company)
        return Response(serializer.data)

    """ API Docs for Update"""

    @extend_schema(
        request=CompanySerializer,
        examples=[
            OpenApiExample(
                "Update Company",
                summary="Update a company's information",
                value={"name": "Updated Company Name"},
                request_only=True,
                description="Request to update a company's name.",
            )
        ],
        responses={status.HTTP_200_OK: CompanySerializer, status.HTTP_404_NOT_FOUND: ErrorSerializer},
    )
    def update(self, request, *args, **kwargs):
        company = get_object_or_404(Company, id=kwargs.get("pk"))
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Update WorkOS Org
        try:
            org_id = serializer.validated_data.get("id", company.id)
            org_new_name = serializer.validated_data.get("name", company.name)
            client.organizations.update_organization(organization=org_id, name=org_new_name)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Save changes in local DB
        serializer.save()
        return Response(serializer.data)

    """ API Docs for Destroy"""

    @extend_schema(
        request=CompanySerializer,
        examples=[],
        responses={status.HTTP_200_OK: CompanySerializer, status.HTTP_404_NOT_FOUND: ErrorSerializer},
    )
    def destroy(self, request, *args, **kwargs):
        # TODO: We need to figure out what we want to do here. Do we want to
        # Hard-delete it in WorkOS or not?
        company = get_object_or_404(Company, id=kwargs.get("pk"))
        company.deleted_at = timezone.now()

        # WorkOS delete logic - working.
        # try:
        #     client.organizations.delete_organization(organization=company.id)
        # except Exception as e:
        #     return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        company.save()
        return Response({"detail": "Company deleted."}, status=status.HTTP_200_OK)


class CompanyMembers(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCompanySerializer

    def get_queryset(self):
        # This endpoint fetches either company or department members depending on
        # The presence of the 'department' query param.

        company_id = self.request.GET.get("company", None)
        sort_by = self.request.GET.get("sort_by", None)
        user_from_jwt = self.request.user

        # if not check_permissions_and_existence(user_from_jwt, company_id=company_id):
        #     return Response(
        #         {"detail": "User is not a member of the requested company"},
        #         status=status.HTTP_403_FORBIDDEN,
        #     )
        # REMOVE THIS FOR NEW PERMISSON LOGIC

        result = []

        result = UserCompanies.objects.filter(company_id=company_id)

        if sort_by == "1":
            return result.order_by("user__first_name")
        elif sort_by == "2":
            return result.order_by("-user__first_name")
        elif sort_by == "3":
            return result.order_by("role")
        else:
            return result

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        company_id = self.request.GET.get("company", None)
        inviter = self.request.user
        inviteeId = self.request.GET.get("invitee", None)

        if not check_permissions_and_existence(inviter, company_id=company_id):
            return Response(
                {"detail": "Inviter is not a member of the requested company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # User & Company Exists
        invitee = get_object_or_404(CustomUser, id=inviteeId)
        company = get_object_or_404(Company, id=company_id)

        # Check that user is not already a member, and if not, try adding.
        if UserCompanies.objects.filter(user=invitee, company__id=company_id).exists():
            return Response(
                {"detail": "User is already a member of this company"},
                status=status.HTTP_409_CONFLICT,
            )
        else:
            invitee, created = UserCompanies.objects.get_or_create(user=invitee, company=company)
            if not created:
                return Response({"detail": "Failed to add user to company"})
        return Response({"detail": "User added to company."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        company_id = request.GET.get("company", None)
        user = request.user
        member_id = self.request.GET.get("member", None)

        if not check_permissions_and_existence(user, company_id=company_id):
            return Response(
                {"detail": "User requesting change is not a member of the company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user_company_queryset = UserCompanies.objects.filter(user_id=member_id, company_id=company_id)

        if not user_company_queryset.exists():
            return Response(
                {"detail": "User is not a member of this company."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # -- cant use this method for now, as the usercompanies does not have any soft delete yet -- #
        # perform_destroy(self, user_company_queryset)

        try:
            user_company_queryset.delete()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "User removed from the company successfully."}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole]
        company_id = request.GET.get("company", None)
        user = request.user
        member_id = self.request.GET.get("member", None)
        role_id = request.data.get("role", None)

        check_role_permission(self, request)
        if not check_permissions_and_existence(user, company_id=company_id):
            return Response(
                {"detail": "Requester is not a member of the company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        member = get_object_or_404(CustomUser, id=member_id)
        company = get_object_or_404(Company, id=company_id)
        role = get_object_or_404(Role, id=role_id)
        if not Role.objects.filter(name=role).exists():
            return Response(
                {"detail": "The specified role does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            user_company = UserCompanies.objects.get(user=member, company=company)
            user_company.role = role
            user_company.save()
            return Response({"detail": "User role updated."}, status=status.HTTP_200_OK)
        except UserCompanies.DoesNotExist:
            return Response(
                {"detail": "User is not a member of this company."},
                status=status.HTTP_404_NOT_FOUND,
            )


class DepartmentView(viewsets.ModelViewSet):
    """
    Manages company CRUD actions.
    Utilizes CompanySerializer for data validation and serialization.
    Requires user authentication
    """

    permission_classes = [IsAuthenticated]
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        company_id = self.request.GET.get("company", None)
        sort_by = self.request.GET.get("sort_by", None)
        user_from_jwt = self.request.user

        check_permissions_and_existence(user_from_jwt, company_id=company_id)

        result = []

        result = Department.objects.filter(company=company_id, deleted_at__isnull=True)

        if sort_by == "1":
            return result.order_by("title")
        elif sort_by == "2":
            return result.order_by("-title")
        elif sort_by == "3":
            return result.order_by("role")
        else:
            return result

    def create(self, request, *args, **kwargs):
        data = json.loads(request.body)
        company_id = data.get("company_id", None)

        # Check if the user is authorized to create a department
        if not self.has_permission(request, company_id):
            return Response(
                {"detail": "User is not authorized to create a department in the requested company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Data Validation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        validated_data["company_id"] = company_id

        # Creation
        department, created = Department.objects.get_or_create(**validated_data)

        if created:
            user_id = self.request.user.id  # Assuming user ID is available in the request context
            analytics.identify(user_id=str(user_id), traits={"email": self.request.user.email})
            analytics.track(user_id=str(user_id), event="Department_created")
            return Response(
                {"detail": "Department created.", "id": department.id},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"detail": "Department already exists."},
                status=status.HTTP_409_CONFLICT,
            )

    def has_permission(self, request, company_id):
        user = request.user
        print("Checking user permissions for: ", user)
        if company_id:
            company = get_object_or_404(Company, id=company_id)
            # Check if the user is a member of the requested company
            user_company = UserCompanies.objects.filter(user=user, company=company).first()
            if user_company:
                # Check if the user's role is either "admin", "manager" or "member"
                role_name = user_company.role.name
                return role_name in ["admin", "manager", "member"]

        return False

    def destroy(self, request, *args, **kwargs):
        company_id = request.GET.get("company", None)
        department_id = request.GET.get("department", None)
        user_from_jwt = request.user

        # Check Role & Permission
        # check_role_permission(self, request)
        # if not check_permissions_and_existence(user_from_jwt, company_id=company_id):
        #     return Response(
        #         {"detail": "User is not a member of the requested company"},
        #         status=status.HTTP_403_FORBIDDEN,
        #     )

        # Destroy
        if department_id and Department.objects.filter(id=department_id, deleted_at__isnull=True).exists():
            department = Department.objects.filter(id=department_id)
            perform_destroy(self, department)

            return Response({"detail": "Department removed."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Department doesnt exist."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        company_id = request.GET.get("company", None)
        department_id = request.GET.get("department", None)
        user_from_jwt = request.user
        new_department_name = request.data.get("title", None)

        if not department_id:
            return Response(
                {"detail": "Department id required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_department_name:
            return Response(
                {"detail": "New department title required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Department.objects.filter(title=new_department_name, company=company_id).exists():
            return Response(
                {"detail": "A department with this name already exists on this company."},
                status=status.HTTP_409_CONFLICT,
            )

        department = get_object_or_404(Department, id=department_id)
        department.title = new_department_name
        department.save()
        return Response({"detail": "Department name updated."}, status=status.HTTP_200_OK)


class DepartmentMembers(viewsets.ModelViewSet):
    serializer_class = DepartmentMembersSerializer

    # def get_permissions(self):
    #     """
    #     Instantiates and returns the list of permissions that this view requires.
    #     """
    #     if self.action in ["list", "retrieve"]:  # Apply custom permission for these actions
    #         permission_classes = [IsAuthenticated]
    #     elif self.action in ["create"]:
    #         permission_classes = [IsAuthenticated, IsAdminOfCompanyOrDepartment]
    #     else:
    #         permission_classes = [IsAuthenticated]  # Default permission for other actions
    #     return [permission() for permission in permission_classes]

    # The fetching of Department Members are included in the CompanyMembers list endpoint.

    def get_queryset(self):
        user = self.request.user
        department_id = self.request.GET.get("department", None)
        sort_by = self.request.GET.get("sort_by", None)

        result = []

        if department_id:
            department = get_object_or_404(Department, id=department_id)
            result = UserDepartments.objects.filter(department=department).select_related("user", "role")

        if sort_by == "1":
            return result.order_by("user__first_name")
        elif sort_by == "2":
            return result.order_by("-user__first_name")
        elif sort_by == "3":
            return result.order_by("user__role")
        else:
            return result

        return Response({"detail:", "No members found."})

    def create(self, request, *args, **kwargs):
        """
        Endpoint to add members to a department.
        """
        department_id = self.request.GET.get("department", None)
        serializer = AddDepartmentMembersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        department = get_object_or_404(Department, id=department_id)
        invitee_ids = serializer.validated_data.get("invitees")

        member_role = Role.objects.get(name="member")
        # List of instances to use during the bulk creation
        user_department_instances = []
        for invitee_id in invitee_ids:
            invitee = get_object_or_404(CustomUser, id=invitee_id)
            if not UserDepartments.objects.filter(user=invitee, department=department).exists():
                user_department_instances.append(
                    UserDepartments(user=invitee, department=department, role=member_role)
                )

        try:
            UserDepartments.objects.bulk_create(user_department_instances)
            return Response({"detail": "Users added to department."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"Failed to add users to department: {e}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, *args, **kwargs):
        """
        Endpoint to remove members from a department.
        """
        department_id = self.request.GET.get("department", None)
        serializer = RemoveDepartmentMembersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        department = get_object_or_404(Department, id=department_id)
        member_ids = serializer.validated_data.get("members")

        try:
            # Retrieve the UserDepartment instances to be deleted
            user_department_instances = UserDepartments.objects.filter(user_id__in=member_ids, department=department)
            # Delete the instances
            user_department_instances.delete()

            return Response({"detail": "Users removed from department."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"Failed to remove users from department: {e}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        # self.permission_classes = [isAdminRole | isManagerRole | isDepartmentManagerRole]
        department_id = request.GET.get("department", None)
        member_id = self.request.GET.get("member", None)
        role_id = request.data.get("role", None)

        member = get_object_or_404(CustomUser, id=member_id)
        department = get_object_or_404(Department, id=department_id)
        role = get_object_or_404(Role, id=role_id)

        # check_role_permission(self, request)
        # if not check_permissions_and_existence(member, department_id=department_id):
        #     return Response(
        #         {"detail": "Requested member is not a member of the department"},
        #         status=status.HTTP_403_FORBIDDEN,
        #     )

        if not Role.objects.filter(name=role).exists():
            return Response(
                {"detail": "The specified role does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # if not UserDepartments.objects.get(user=member, department=department).exists():
        #     {"detail": "This department does not exist."},
        #     status=status.HTTP_404_NOT_FOUND,

        try:
            user_department = UserDepartments.objects.get(user=member, department=department)
            user_department.role = role
            user_department.save()
            return Response({"detail": "User role updated."}, status=status.HTTP_200_OK)
        except UserDepartments.DoesNotExist:
            return Response(
                {"detail": "User is not a member of this department."},
                status=status.HTTP_404_NOT_FOUND,
            )
