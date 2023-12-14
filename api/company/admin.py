from django.contrib import admin

from .models import Company, Department

# Register your models here.
admin.site.register(Department)


@admin.register(Company)
class Company(admin.ModelAdmin):
    list_display = ("id", "name")
    ordering = ("name",)
