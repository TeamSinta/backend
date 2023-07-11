from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from user.models import Company
import os
from dotenv import load_dotenv

load_dotenv()
User = get_user_model()


# Creates the default superuser account.
class Command(BaseCommand):
    print("\nCreating default superuser account...")

    def handle(self, *args, **options):
        for user in settings.ADMINS:
            username = user[0].replace(" ", "")
            email = user[1]
            password = os.getenv("SUPERUSER_PASSWORD")
            company, _ = Company.objects.get_or_create(name="Sinta")
            admin, created = User.objects.get_or_create(
                username=username,
                email=email,
                company=company,
                is_staff=True,
                is_superuser=True,
            )
            if created:
                admin.set_password(password)
                admin.save()
                print("Created admin account. 🦸🏽")
            else:
                print(f"Admin account already exists. Moving on...🆒")
