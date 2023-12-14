from django.contrib import admin
from rest_framework.authtoken.models import TokenProxy

from user.models import CustomUser, Role, UserCompanies, UserDepartments

admin.site.unregister(TokenProxy)
admin.site.register(Role)


class UserCompaniesInline(admin.StackedInline):
    model = UserCompanies
    extra = 0


class UserAdmin(admin.ModelAdmin):
    inlines = [UserCompaniesInline]

    def display_companies(self, obj):
        return ", ".join([company.name for company in obj.companies.all()])

    display_companies.short_description = "Companies"

    list_display = ("id", "first_name", "last_name", "email", "display_companies")
    ordering = ("first_name",)
    search_fields = ("first_name", "last_name", "email")


admin.site.register(CustomUser, UserAdmin)


@admin.register(UserDepartments)
class UserDepartments(admin.ModelAdmin):
    list_display = ("id", "user", "department_id", "role")
    ordering = ("id",)


@admin.register(UserCompanies)
class UserCompanies(admin.ModelAdmin):
    list_display = ("id", "user", "company_id", "role")
    ordering = ("company_id",)
