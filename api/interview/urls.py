from django.urls import path

from . import views
from .views import (
    CreateInterviewRound,
    InterviewRoundByRoomID,
    InterviewRoundGet,
    InterviewRoundListAll,
    InterviewRoundQuestionDetailGet,
    RateInterviewRoundQuestion,
)

urlpatterns = [
    # Interview Round
    path("", InterviewRoundListAll.as_view(), name="get_all_interview_rounds"),
    path("create/", CreateInterviewRound.as_view(), name="create_interview_round"),
    path(
        "interviewroundquestions/",
        views.InterviewRoundQuestionList.as_view(),
        name="get_interview_round",
    ),
    path(
        "<int:interview_round_id>/<int:question_id>",
        InterviewRoundQuestionDetailGet.as_view(),
        name="get_interview_round",
    ),
    path(
        "<int:interview_round_id>",
        InterviewRoundGet.as_view(),
        name="get_interview_round",
    ),
    path(
        "<str:room_id>",
        InterviewRoundByRoomID.as_view(),
        name="get_interview_round",
    ),
    path(
        "rateInterviewRoundQuestion/",
        RateInterviewRoundQuestion.as_view(),
        name="rate_interview_round_question",
    ),
    path(
        "interviewRoundVideo/<int:interview_round_id>/",
        views.GetInterviewRoundVideo.as_view(),
        name="interview_round_video",
    ),
    path(
        "<int:interview_round_id>/update/",
        views.UpdateInterviewRound.as_view(),
        name="update_interview_round",
    ),
    path(
        "candidate/",
        views.CandidateList.as_view(),
        name="update_interview_round",
    ),
    path(
        "GetTranscriptFromS3/<int:interview_round_id>/",
        views.GetTranscriptFromS3.as_view(),
        name="TranscriptFromS3",
    ),
]
