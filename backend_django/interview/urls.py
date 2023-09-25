from django.urls import path
from . import views


urlpatterns = [
    # Interview Round
    path("", views.get_all_interview_rounds, name="get_all_interview_rounds"),
    path("create/", views.create_interview_round, name="create_interview_round"),
    path(
        "<int:interview_round_id>/",
        views.get_interview_round,
        name="get_interview_round",
    ),
    path(
        "<int:interview_round_id>/update/",
        views.update_interview_round,
        name="update_interview_round",
    ),
    path(
        "<int:interview_round_id>/delete/",
        views.delete_interview_round,
        name="delete_interview_round",
    ),
]
