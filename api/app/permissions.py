from rest_framework import permissions

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
