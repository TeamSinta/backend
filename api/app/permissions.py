from django.shortcuts import get_object_or_404
from rest_framework import permissions

from company.models import Department
from user.models import UserCompanies, UserDepartments


# This model returns a True/False on a permission check.
class isAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        company_id = request.GET.get("company", None)
        user = request.user
        try:
            user_company = UserCompanies.objects.get(user=user, company_id=company_id)
            if user_company.role is not None:
                return user_company.role.name == "admin"
            else:
                return False
        except UserCompanies.DoesNotExist:
            return False


class isInterviewerRole(permissions.BasePermission):
    def has_permission(self, request, view):
        company_id = request.GET.get("company", None)
        user = request.user
        try:
            user_company = UserCompanies.objects.get(user=user, company_id=company_id)
            if user_company.role is not None:
                return user_company.role.name == "interviewer"
            else:
                return False
        except UserCompanies.DoesNotExist:
            return False


class isManagerRole(permissions.BasePermission):
    def has_permission(self, request, view):
        company_id = request.GET.get("company", None)
        user = request.user
        try:
            user_company = UserCompanies.objects.get(user=user, company_id=company_id)
            if user_company.role is not None:
                return user_company.role.name == "manager"
            else:
                return False
        except UserCompanies.DoesNotExist:
            return False


class isDepartmentManagerRole(permissions.BasePermission):
    def has_permission(self, request, view):
        department_id = request.GET.get("department", None)
        user = request.user
        try:
            user_department = UserDepartments.objects.get(user=user, department__id=department_id)
            if user_department.role is not None:
                return user_department.role.name == "manager"
            else:
                return False
        except UserDepartments.DoesNotExist:
            return False


class IsMemberOfCompany(permissions.BasePermission):
    """
    Custom permission to only allow members of a specific company or department.
    """

    def has_permission(self, request, view):
        department_id = request.query_params.get("department")

        if not department_id:
            return False

        department = get_object_or_404(Department, id=department_id)
        company_id = department.company.id

        return UserCompanies.objects.filter(user=request.user, company=company_id).exists()


class IsAdminOfCompanyOrDepartment(permissions.BasePermission):
    """
    Allows access only to admin users of a company or department.
    """

    def has_permission(self, request, view):
        # Assuming 'admin' is the name of the admin role
        admin_role_name = "admin"

        department_id = request.query_params.get("department")
        # company_id = request.query_params.get('company')

        if department_id:
            # Check if the user is an admin in the department
            return UserDepartments.objects.filter(
                user=request.user, department_id=department_id, role__name=admin_role_name
            ).exists()

        # if company_id:
        #     # Check if the user is an admin in the company
        #     return UserCompanies.objects.filter(
        #         user=request.user,
        #         company_id=company_id,
        #         role__name=admin_role_name
        #     ).exists()

        return False  # Deny access if no relevant department or company ID is found
