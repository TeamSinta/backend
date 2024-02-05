import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from company.models import Company

User = get_user_model()


# Creates the default superuser account.
class Command(BaseCommand):
    print("\nCreating default superuser account.")

    def handle(self, *args, **options):
        for user in settings.ADMINS:
            username = user[0].replace(" ", "")
            email = user[1]
            password = os.environ.get("SUPERUSER_PASSWORD")
            company, _ = Company.objects.get_or_create(name="Sinta")
            admin, created = User.objects.get_or_create(
                id=100238,
                username=username,
                email=email,
                is_staff=True,
                is_superuser=True,
            )
            if created:
                admin.companies.add(company)
                admin.set_password(password)
                admin.save()
