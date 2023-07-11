from django.contrib import admin

from .models import CustomUser, Company

# admin.site.register(CustomUser)
admin.site.register(Company)


# modiy admin panel


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email", "company_id", "role")
    ordering = ("company_id",)
    search_fields = ("first_name", "last_name", "email")