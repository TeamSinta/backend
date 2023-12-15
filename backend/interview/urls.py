from django.urls import path
from . import views
from .views import CreateInterviewRound, RateInterviewRoundQuestion


urlpatterns = [
    # Interview Round
    path("", views.get_all_interview_rounds, name="get_all_interview_rounds"),
    path("create/", CreateInterviewRound.as_view(), name="create_interview_round"),
    path(
        "interviewroundquestions/",
        views.InterviewRoundQuestionList.as_view(),
        name="get_interview_round",
    ),
    path(
        "<int:interview_round_id>/<int:question_id>",
        views.get_interview_round_question,
        name="get_interview_round",
    ),
    path(
        "<int:interview_round_id>",
        views.get_interview_round,
        name="get_interview_round",
    ),
    path(
        "<str:room_id>",
        views.get_interview_round_by_room_id,
        name="get_interview_round",
    ),
    path(
        "rateInterviewRoundQuestion/",
        RateInterviewRoundQuestion.as_view(),
        name="rate_interview_round_question",
    ),
    path(
        "interviewRoundVideo/<int:interview_round_id>/",
        views.get_interview_round_video,
        name="interview_round_video",
    ),
    path(
        "<int:interview_round_id>/update/",
        views.update_interview_round,
        name="update_interview_round",
    ),
    path(
        "candidate/",
        views.CandidateList.as_view(),
        name="update_interview_round",
    ),
]
