from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CompanyMembers, CompanyView, DepartmentMembers, DepartmentView

router = DefaultRouter()
router.register(r"companies", CompanyView)

urlpatterns = [
    path("", include(router.urls)),
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
