from django.contrib import admin

from .models import Question, Comment, QuestionBank

admin.site.register(Question)
admin.site.register(Comment)
admin.site.register(QuestionBank)
# Register your models here.
