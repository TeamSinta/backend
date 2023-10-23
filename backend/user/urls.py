from django.urls import path
from .views import DeleteUser, CustomUserDetailsView, UserDepartmentsView

urlpatterns = [
    path("userdetails/", CustomUserDetailsView.as_view(), name="user-details"),
    path("delete/", DeleteUser.as_view(), name="delete-user"),
    path(
        "<int:user_id>/company/<int:pk>/departments/",
        UserDepartmentsView.as_view(),
        name="user-departments",
    ),
]
