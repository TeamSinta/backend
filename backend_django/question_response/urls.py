from django.urls import path
from .views import QuestionSummarizedAnswerView

urlpatterns = [
    # General Topics
    path(
        "question_summarized_answers/<int:interview_round_id>/",
        QuestionSummarizedAnswerView.as_view(),
        name="get_summarized_answer_for_questions",
    ),
]
