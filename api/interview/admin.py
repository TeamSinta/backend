from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Candidate, InterviewRound, InterviewRoundQuestion


@admin.register(InterviewRound)
class InterviewRoundAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "interviewer_link", "video_uri")

    def interviewer_link(self, obj):
        url = reverse("admin:user_customuser_change", args=[obj.interviewer.id])
        return format_html('<a href="{}">{}</a>', url, obj.interviewer)


@admin.register(InterviewRoundQuestion)
class InterviewRoundQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "question_link", "interview_link")

    def question_link(self, obj):
        url = reverse("admin:interview_templates_templatequestion_change", args=[obj.question.id])
        return format_html('<a href="{}">{}</a>', url, obj.question.question)

    def interview_link(self, obj):
        url = reverse("admin:interview_interviewround_change", args=[obj.interview_round.id])
        return format_html('<a href="{}">{}</a>', url, obj.interview_round.title)


@admin.register(Candidate)
class Candidate(admin.ModelAdmin):
    list_display = ("id", "name")
    ordering = ("name",)
