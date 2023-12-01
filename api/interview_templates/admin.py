from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Template, TemplateQuestion, TemplateTopic


# admin.site.register(Template)
# Id, RoleTitle, Company
@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "role_title", "company_link", "description", "department")

    def company_link(self, obj):
        url = reverse("admin:user_usercompanies_change", args=[obj.company.id])
        return format_html('<a href="{}">{}</a>', url, obj.company)


# admin.site.register(TemplateQuestion)
# admin.site.register(TemplateTopic)
@admin.register(TemplateQuestion)
class TemplateQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "question_link", "topic_link", "template_name")
    ordering = ("-template_id",)

    def template_name(self, obj):
        url = reverse("admin:interview_templates_template_change", args=[obj.template_id.id])
        return format_html('<a href="{}">{}</a>', url, obj.template_id)

    def topic_link(self, obj):
        url = reverse("admin:interview_templates_templatetopic_change", args=[obj.topic.id])
        return format_html('<a href="{}">{}</a>', url, obj.topic)

    def question_link(self, obj):
        url = reverse("admin:question_question_change", args=[obj.question.id])
        return format_html('<a href="{}">{}</a>', url, obj.question)


@admin.register(TemplateTopic)
class TemplateTopicAdmin(admin.ModelAdmin):
    list_display = ("id", "topics_text", "template_link")

    def template_link(self, obj):
        url = reverse("admin:interview_templates_template_change", args=[obj.template_id.id])
        return format_html('<a href="{}">{}</a>', url, obj.template_id)
