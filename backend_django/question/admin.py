from django.contrib import admin

from .models import Question, Competency, Comment

admin.site.register(Question)
admin.site.register(Competency)
admin.site.register(Comment)