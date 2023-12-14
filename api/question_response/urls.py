from django.urls import path

from .views import InterviewerFeedbackDetailView, InterviewerFeedbackListCreateView, QuestionSummarizedAnswerView

urlpatterns = [
    # General Topics
    path(
        "question_summarized_answers/<int:interview_round_id>/",
        QuestionSummarizedAnswerView.as_view(),
        name="get_summarized_answer_for_questions",
    ),
    path(
        "interviewer-feedback/",
        InterviewerFeedbackListCreateView.as_view(),
        name="interviewer-feedback-list",
    ),
    path(
        "interviewer-feedback/<int:pk>/",
        InterviewerFeedbackDetailView.as_view(),
        name="interviewer-feedback-detail",
    ),
]
