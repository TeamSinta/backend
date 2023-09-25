from django.urls import path
from . import views

urlpatterns = [
    # Templates
    path("", views.get_all_templates, name="get_all_templates"),
    path("add/", views.create_template, name="create_template"),
    path("<int:template_id>/", views.read_template, name="get_template"),
    path("<int:template_id>/edit/", views.update_template, name="update_template"),
    path("<int:template_id>/remove/", views.delete_template, name="delete_template"),
    # Template Topics
    path(
        "<int:template_id>/topics/",
        views.get_all_template_topics,
        name="get_all_template_topics",
    ),
    path(
        "<int:template_id>/topics/add/",
        views.create_template_topic,
        name="create_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/",
        views.read_template_topic,
        name="get_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/edit/",
        views.update_template_topic,
        name="update_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/remove/",
        views.delete_template_topic,
        name="delete_template_topic",
    ),
    # # Template Interviewers
    # path("<int:template_id>/interviewers/", views.get_all_template_interviewers, name="get_all_template_interviewers"),
    # path("<int:template_id>/interviewers/add/", views.create_template_interviewers, name="create_template_interviewers"),
    # path("<int:template_id>/interviewers/edit/", views.update_template_interviewers, name="update_template_interviewers"),
    # path("<int:template_id>/interviewers/remove/", views.delete_template_interviewers, name="delete_template_interviewers"),
    # Template Questions
    path(
        "<int:template_id>/questions/",
        views.get_all_template_questions,
        name="get_all_template_questions",
    ),
    path(
        "<int:template_id>/questions/add/",
        views.create_template_question,
        name="create_template_question",
    ),
    path(
        "<int:template_id>/questions/edit/",
        views.update_template_questions,
        name="update_template_questions",
    ),
    path(
        "<int:template_id>/questions/remove/",
        views.delete_template_questions,
        name="delete_template_questions",
    ),
]
