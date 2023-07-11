from django.urls import path, include
from dj_rest_auth.views import UserDetailsView
from .views import DeleteUser

urlpatterns = [
    path("userdetails/", UserDetailsView.as_view(), name="user-details"),
    path("delete/", DeleteUser.as_view(), name="delete-user"),
]
