import json

from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.permissions import isAdminRole, isDepartmentManagerRole, isManagerRole
from user.models import CustomUser, Role, UserCompanies, UserDepartments
from user.serializers import UserCompanySerializer, UserDepartmentSerializer

from .models import Company, Department
from .serializers import CompanySerializer, DepartmentSerializer


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
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer

    def get_queryset(self):
        company_id = self.request.GET.get("company", None)
        user_from_jwt = self.request.user

        check_permissions_and_existence(user_from_jwt, company_id=company_id)

        return Company.objects.filter(id=company_id)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole]
        company_id = self.request.GET.get("company", None)
        user_from_jwt = request.user
        new_company_name = request.data.get("name", None)

        check_role_permission(self, request)
        check_permissions_and_existence(user_from_jwt, company_id=company_id)

        if not new_company_name:
            return Response(
                {"detail": "New company name required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Company.objects.filter(name=new_company_name).exists():
            return Response(
                {"detail": "A company with this name already exists."},
                status=status.HTTP_409_CONFLICT,
            )

        company = get_object_or_404(Company, id=company_id)

        company.name = new_company_name
        company.save()
        return Response({"detail": "Company name updated."}, status=status.HTTP_200_OK)


class CompanyMembers(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCompanySerializer

    def get_queryset(self):
        # This endpoint fetches either company or department members depending on
        # The presence of the 'department' query param.

        company_id = self.request.GET.get("company", None)
        department_id = self.request.GET.get("department", None)
        sort_by = self.request.GET.get("sort_by", None)
        user_from_jwt = self.request.user

        if not check_permissions_and_existence(user_from_jwt, company_id=company_id):
            return Response(
                {"detail": "User is not a member of the requested company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        result = []

        if not department_id:
            result = UserCompanies.objects.filter(company_id=company_id)
        else:
            result = UserDepartments.objects.filter(department_id=department_id)

        if sort_by == "1":
            return result.order_by("user__first_name")
        elif sort_by == "2":
            return result.order_by("-user__first_name")
        elif sort_by == "3":
            return result.order_by("role")
        else:
            return result

    def create(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole | isManagerRole]
        company_id = self.request.GET.get("company", None)
        inviter = self.request.user
        inviteeId = self.request.GET.get("invitee", None)

        # Check Role & Permission
        check_role_permission(self, request)
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
        self.permission_classes = [isAdminRole | isManagerRole]
        company_id = request.GET.get("company", None)
        user = request.user
        memberId = self.request.GET.get("member", None)

        check_role_permission(self, request)
        if not check_permissions_and_existence(user, company_id=company_id):
            return Response(
                {"detail": "User requesting change is not a member of the company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        member = get_object_or_404(CustomUser, id=memberId)
        company = get_object_or_404(Company, id=company_id)

        if company_id and UserCompanies.objects.filter(user=member, company=company).exists():
            user_company = UserCompanies.objects.filter(user=member, company=company)
            perform_destroy(self, user_company)

            return Response({"detail": "User removed from company."}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "User is not a member of this company."},
                status=status.HTTP_404_NOT_FOUND,
            )

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


class CompanyDepartments(viewsets.ModelViewSet):
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
            return Response({"detail": "Department created.", "id": department.id}, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"detail": "Department already exists."},
                status=status.HTTP_409_CONFLICT,
            )

    def has_permission(self, request, company_id):
        user = request.user
        if company_id:
            company = get_object_or_404(Company, id=company_id)

            # Check if the user is a member of the requested company
            user_company = UserCompanies.objects.filter(user=user, company=company).first()
            if user_company:
                # Check if the user's role is either "admin" or "manager"
                role_name = user_company.role.name
                return role_name in ["admin", "manager"]

        return False

    def destroy(self, request, *args, **kwargs):
        # self.permission_classes = [isAdminRole]
        company_id = request.GET.get("company", None)
        print("Company ID: ", company_id)
        department_id = request.GET.get("department", None)
        print("Department ID: ", department_id)
        user_from_jwt = request.user

        # Check Role & Permission
        check_role_permission(self, request)
        if not check_permissions_and_existence(user_from_jwt, company_id=company_id):
            return Response(
                {"detail": "User is not a member of the requested company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Destroy
        if department_id and Department.objects.filter(id=department_id, deleted_at__isnull=True).exists():
            department = Department.objects.filter(id=department_id)
            perform_destroy(self, department)

            return Response({"detail": "Department removed."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Department doesnt exist."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole | isManagerRole | isDepartmentManagerRole]
        company_id = request.GET.get("company", None)
        department_id = request.GET.get("department", None)
        user_from_jwt = request.user
        new_department_name = request.data.get("title", None)

        check_role_permission(self, request)
        if not check_permissions_and_existence(user_from_jwt, company_id=company_id):
            return Response(
                {"detail": "User is not a member of the requested company"},
                status=status.HTTP_403_FORBIDDEN,
            )

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


class CompanyDepartmentMembers(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDepartmentSerializer

    # The fetching of Department Members are included in the CompanyMembers list endpoint.

    def create(self, request, *args, **kwargs):
        """
        Endpoint to add members to a department.
        Permissions not yet implemented.
        # self.permission_classes = [isAdminRole | isManagerRole | isDepartmentManagerRole]
        """
        department_id = self.request.GET.get("department", None)
        data = json.loads(request.body)
        invitee_ids = data.get("invitees", [])

        # Check Role & Permission
        check_role_permission(self, request)

        # Department exists?
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        validated_data["department_id"] = department_id
        validated_data["invitee_ids"] = invitee_ids

        department = get_object_or_404(Department, id=department_id)

        # List of instances to use during the bulk creation
        user_department_instances = []

        for invitee_id in invitee_ids:
            invitee = get_object_or_404(CustomUser, id=invitee_id)
            if not UserDepartments.objects.filter(user=invitee, department=department).exists():
                if check_permissions_and_existence(invitee, company_id=department.company.id):
                    user_department_instances.append(UserDepartments(user=invitee, department=department))

        try:
            UserDepartments.objects.bulk_create(user_department_instances)
        except Exception as e:
            return Response({"detail": f"Failed to add users to department: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Users added to department."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole | isManagerRole | isDepartmentManagerRole]
        company_id = self.request.GET.get("company", None)
        department_id = request.GET.get("department", None)
        user = request.user
        memberId = self.request.GET.get("member", None)

        member = get_object_or_404(CustomUser, id=memberId)
        department = get_object_or_404(Department, id=department_id)

        check_role_permission(self, request)
        if not check_permissions_and_existence(user, company_id=department.company.id):
            return Response(
                {"detail": "User requesting change is not a member of the company"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if (
            department_id
            and UserDepartments.objects.filter(user=member, department=department, deleted_at__isnull=True).exists()
        ):
            user_department = UserDepartments.objects.filter(user=member, department=department)
            perform_destroy(self, user_department)

            return Response({"detail": "User removed from department."}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "User is not a member of this department."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def update(self, request, *args, **kwargs):
        self.permission_classes = [isAdminRole | isManagerRole | isDepartmentManagerRole]
        department_id = request.GET.get("department", None)
        member_id = self.request.GET.get("member", None)
        role_id = request.data.get("role", None)

        member = get_object_or_404(CustomUser, id=member_id)
        department = get_object_or_404(Department, id=department_id)
        role = get_object_or_404(Role, id=role_id)

        check_role_permission(self, request)
        if not check_permissions_and_existence(member, department_id=department_id):
            return Response(
                {"detail": "Requested member is not a member of the department"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not Role.objects.filter(name=role).exists():
            return Response(
                {"detail": "The specified role does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            user_department = UserDepartments.objects.get(user=member, department=department)
            user_department.role = role
            user_department.save()
            return Response({"detail": "User role updated."}, status=status.HTTP_200_OK)
        except UserCompanies.DoesNotExist:
            return Response(
                {"detail": "User is not a member of this department."},
                status=status.HTTP_404_NOT_FOUND,
            )
