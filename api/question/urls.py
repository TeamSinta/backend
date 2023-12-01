from django.urls import path

from . import views

urlpatterns = [
    # Questions
    path("", views.QuestionList.as_view(), name="get_all_create_questions"),
    path("<int:pk>/", views.QuestionDetail.as_view(), name="RUD"),
    # Question-banks
    path(
        "question-banks/",
        views.QuestionBankList.as_view(),
        name="get_all_create_question_banks",
    ),
    path(
        "question-banks/<int:pk>/",
        views.QuestionBankDetail.as_view(),
        name="get_question_bank_questions",
    ),
    path(
        "question-banks/<int:pk>/update/",
        views.QuestionBankUpdateView.as_view(),
        name="get_question_bank_questions",
    ),
]
