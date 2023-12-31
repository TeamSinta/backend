from django.urls import path

from . import views

urlpatterns = [
    # Templates
    path("templates/", views.TemplatesList.as_view()),
    path("templates/<int:pk>/", views.TemplateDetail.as_view()),
    path("topics/<int:pk>/", views.TemplateTopicDetail.as_view()),
    path("topics/", views.TemplateTopicList.as_view()),
    path("template_questions/", views.TemplateQuestionsList.as_view()),
    path("template_questions/<int:pk>/", views.TemplateQuestionsDetail.as_view()),
    path("", views.GetAllTemplates.as_view(), name="get_all_templates"),
    path("add/", views.CreateTemplate.as_view(), name="create_template"),
    path("<int:template_id>/", views.ReadTemplate.as_view(), name="get_template"),
    path("<int:template_id>/edit/", views.UpdateTemplate.as_view(), name="update_template"),
    path("<int:template_id>/remove/", views.DeleteTemplate.as_view(), name="delete_template"),
    # Template Topics
    path(
        "<int:template_id>/topics/",
        views.GetAllTemplateTopics.as_view(),
        name="get_all_template_topics",
    ),
    path(
        "<int:template_id>/topics/add/",
        views.CreateTemplateTopic.as_view(),
        name="create_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/",
        views.ReadTemplateTopic.as_view(),
        name="get_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/edit/",
        views.UpdateTemplateTopic.as_view(),
        name="update_template_topic",
    ),
    path(
        "<int:template_id>/topics/<int:template_topic_id>/remove/",
        views.DeleteTemplateTopic.as_view(),
        name="delete_template_topic",
    ),
    path(
        "<int:template_id>/questions/",
        views.GetAllTemplateQuestions.as_view(),
        name="get_all_template_questions",
    ),
    path(
        "<int:template_id>/templatequestions/",
        views.GetAllQuestions.as_view(),
        name="get_all_questions",
    ),
    path(
        "<int:template_id>/questions/add/",
        views.CreateTemplateQuestion.as_view(),
        name="create_template_question",
    ),
    path(
        "<int:template_id>/questions/edit/",
        views.UpdateTemplateQuestions.as_view(),
        name="update_template_questions",
    ),
    path(
        "<int:template_id>/questions/remove/",
        views.DeleteTemplateQuestions.as_view(),
        name="delete_template_questions",
    ),
]
