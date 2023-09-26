from django.contrib import admin

from .models import (
    Template,
    TemplateQuestion,
    TemplateTopic,
)

admin.site.register(Template)
admin.site.register(TemplateQuestion)
admin.site.register(TemplateTopic)
