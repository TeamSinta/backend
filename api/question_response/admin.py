from django.contrib import admin

from .models import Answer, InterviewerFeedback

admin.site.register(InterviewerFeedback)
admin.site.register(Answer)
