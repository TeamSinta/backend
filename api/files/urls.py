from django.urls import path

from . import views

urlpatterns = [
    path("", views.FileList.as_view(), name="file-list"),
    path("<int:pk>/", views.FileDetail.as_view(), name="file-detail"),
]
