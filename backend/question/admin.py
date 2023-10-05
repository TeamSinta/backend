from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html


from .models import Question, Comment, QuestionBank

admin.site.register(QuestionBank)
# Register your models here.


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "question_text", "review")
    ordering = ("id",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "comment_text", "question_link")

    def question_link(self, obj):
        url = reverse("admin:question_question_change", args=[obj.question.id])
        return format_html('<a href="{}">{}</a>', url, obj.question)
