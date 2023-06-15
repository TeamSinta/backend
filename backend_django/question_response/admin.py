from django.contrib import admin

from .models import InterviewerFeedback, Answer

admin.site.register(InterviewerFeedback)
admin.site.register(Answer)