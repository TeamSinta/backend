from django.urls import path
from .views import DeleteUser, CustomUserDetailsView, UserDepartmentsView
from .views import DeleteUser, CustomUserDetailsView, GetUserByUsername

urlpatterns = [
    path("userdetails/", CustomUserDetailsView.as_view(), name="user-details"),
    path("delete/", DeleteUser.as_view(), name="delete-user"),
    path(
        "users/<str:username>/",
        GetUserByUsername.as_view(),
        name="get-user-by-username",
    ),
    path(
        "<int:user_id>/company/<int:pk>/departments/",
        UserDepartmentsView.as_view(),
        name="user-departments",
    ),
]
