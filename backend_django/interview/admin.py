from django.contrib import admin

from .models import InterviewRound, InterviewRoundQuestion, Topic, InterviewRoundInterviewer

admin.site.register(InterviewRound)
admin.site.register(InterviewRoundQuestion)
admin.site.register(Topic)
admin.site.register(InterviewRoundInterviewer)
