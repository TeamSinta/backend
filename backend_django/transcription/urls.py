from django.urls import path
from . import views
from .views import QuestionTranscriptView, GenerateTranscript

urlpatterns = [
    path("generate_transcript_for_interview_round/", GenerateTranscript.as_view(), name="generate_transcript"),

    path(
        "get_transcripts_for_questions/<int:interview_round_id>/",
        QuestionTranscriptView.as_view(),
        name="get_transcripts_for_questions",
    )
]