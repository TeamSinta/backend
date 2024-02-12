from django.urls import path

from .views import CompanyMembers, CompanyView, DepartmentMembers, DepartmentView

urlpatterns = [
    path("", CompanyView.as_view({"get": "list", "put": "update"}), name="company"),
    path(
        "members",
        CompanyMembers.as_view({"get": "list", "post": "create", "put": "update", "delete": "destroy"}),
        name="company-members",
    ),
    path(
        "departments",
        DepartmentView.as_view({"get": "list", "post": "create", "put": "update", "delete": "destroy"}),
        name="company-departments",
    ),
    path(
        "department/members",
        DepartmentMembers.as_view({"get": "list", "post": "create", "put": "update", "delete": "destroy"}),
        name="company-departments",
    ),
]
