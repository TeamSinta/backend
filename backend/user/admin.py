from django.contrib import admin
from rest_framework.authtoken.models import TokenProxy

from .models import CustomUser, Company, Department

admin.site.unregister(TokenProxy)
admin.site.register(Company)
admin.site.register(Department)


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email", "company_id", "role")
    ordering = ("company_id",)
    search_fields = ("first_name", "last_name", "email")
