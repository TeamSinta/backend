from django.urls import path
from . import views

urlpatterns = [

    #Questions
    path('', views.get_all_questions, name='get_all_questions'),
    path('create/', views.create_question, name='create_question'),
    path('update/<int:question_id>/', views.update_question, name='update_question'),


    #Question-banks
    path('question-banks/create/', views.create_question_bank, name='create_question_bank'),
    path('question-banks/', views.get_all_question_banks, name='get_all_question_banks'),
    path('question-banks/<int:question_bank_id>/', views.get_question_bank_questions, name='get_question_bank_questions'),


    #competency
    path('competency/create/', views.create_competency, name='create_competency'),
    path('competency/', views.get_all_competencies, name='get_all_competencies'),


]
