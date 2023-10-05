from django.urls import path
from .views import DeleteUser, CustomUserDetailsView, GetCompany, CompanyMembers

urlpatterns = [
    path("userdetails/", CustomUserDetailsView.as_view(), name="user-details"),
    path("delete/", DeleteUser.as_view(), name="delete-user"),
    path("company/<int:pk>/", GetCompany.as_view(), name="company"),
    path("company/<int:pk>/members", CompanyMembers.as_view(), name="company-members"),
]
