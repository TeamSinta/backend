from django.urls import path

from .views import CustomUserDetailsView, DeleteUser, GetUserById, GetUserByUsername, UserDepartmentsView

urlpatterns = [
    path("userdetails/", CustomUserDetailsView.as_view(), name="user-details"),
    path("delete/", DeleteUser.as_view(), name="delete-user"),
    path(
        "usersbyusername/<str:username>/",
        GetUserByUsername.as_view(),
        name="get-user-by-username",
    ),
    path(
        "usersbyid/<str:candidate_id>/",
        GetUserById.as_view(),
        name="get-user-by-id",
    ),
    path(
        "<int:user_id>/company/<int:pk>/departments/",
        UserDepartmentsView.as_view(),
        name="user-departments",
    ),
]
