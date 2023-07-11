from django.urls import path
from . import views


urlpatterns = [
    #General Topics
    path('topics/', views.get_all_topics, name='get_all_topics'),
    path('topics/create/', views.create_topic, name='create_topic'),

    #Interview Round
   path('', views.get_all_interview_rounds, name='get_all_interview_rounds'),
    path('create/', views.create_interview_round, name='create_interview_round'),
    path('<int:interview_round_id>/', views.get_interview_round, name='get_interview_round'),
    path('<int:interview_round_id>/update/', views.update_interview_round, name='update_interview_round'),
    path('<int:interview_round_id>/delete/', views.delete_interview_round, name='delete_interview_round'),

    #Interviewers
    path('<int:interview_round_id>/interviewer-round-interviewers/create', views.create_interview_round_interviewer, name='create_interview_round_interviewer'),
    path('<int:interview_round_id>/interviewer-round-interviewers/<int:interviewer_round_interviewer_id>/', views.delete_interview_round_interviewer, name='delete_interview_round_interviewer'),
    path('<int:interview_round_id>/interviewer-round-interviewers/<int:interviewer_round_interviewer_id>/update/', views.update_interview_round_interviewer, name='update_interview_round_interviewer'),
    path('<int:interview_round_id>/interviewer-round-interviewers/', views.get_all_interview_round_interviewers, name='get_all_interview_round_interviewers'),

    #Interview Topics
    path('<int:interview_round_id>/interview-round-topics/create/', views.create_interview_round_topics, name='create_interview_round_topics'),
    path('<int:interview_round_id>/interview-round-topics/<int:interview_round_topics_id>/update/', views.update_interview_round_topics, name='update_interview_round_topics'),

    #Interview Questions
    path('<int:interview_round_id>/interview-round-questions/create/', views.create_interview_round_question, name='create_interview_round_question'),
    path('<int:interview_round_id>/interview-round-questions/<int:interview_round_question_id>/update/', views.update_interview_round_question, name='update_interview_round_question'),
    path('<int:interview_round_id>/interview-round-questions/', views.get_all_interview_round_questions, name='get_all_interview_round_questions'),
    path('<int:interview_round_id>/interview-round-questions/<int:interview_round_question_id>/delete/', views.delete_interview_round_question, name='delete_interview_round_question'),

]
