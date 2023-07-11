from django.core.management.base import BaseCommand
from allauth.socialaccount.models import SocialApp
from allauth.socialaccount import providers
from django.contrib.sites.models import Site
from dotenv import load_dotenv

import os

load_dotenv()


class Command(BaseCommand):
    def handle(self, *args, **options):
        provider_choices = list(providers.registry.as_choices())
        site = Site.objects.get(domain="127.0.0.1", name="127.0.0.1")
        site_id = site.id
        print(f"Site id is: {site_id}")

        print("\nCreating Social Login Apps...")
        google, created = SocialApp.objects.get_or_create(
            provider=provider_choices[0][0],
            name="Google",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        )
        google.sites.add(site)
        if created:
            print("Google login App created successfully. ✅\n")
            google.save()
        else:
            print("App already exists. Moving on... 🆒\n")
