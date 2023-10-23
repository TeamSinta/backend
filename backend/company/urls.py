from django.urls import path
from .views import (
    CompanyView,
    CompanyMembers,
    CompanyDepartments,
    CompanyDepartmentMembers,
)

urlpatterns = [
    path("", CompanyView.as_view({"get": "list", "put": "update"}), name="company"),
    path(
        "members",
        CompanyMembers.as_view(
            {"get": "list", "post": "create", "put": "update", "delete": "destroy"}
        ),
        name="company-members",
    ),
    path(
        "departments",
        CompanyDepartments.as_view(
            {"get": "list", "post": "create", "put": "update", "delete": "destroy"}
        ),
        name="company-departments",
    ),
    path(
        "department/members",
        CompanyDepartmentMembers.as_view(
            {"get": "list", "post": "create", "put": "update", "delete": "destroy"}
        ),
        name="company-departments",
    ),
]
