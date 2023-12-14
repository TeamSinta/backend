import os

from allauth.socialaccount import providers
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Creating Social App. \n")
        provider_choices = list(providers.registry.as_choices())
        site = Site.objects.get(domain="127.0.0.1", name="127.0.0.1")

        google, created = SocialApp.objects.get_or_create(
            provider=provider_choices[0][0],
            name="Google",
            client_id=os.environ.get("GOOGLE_CLIENT_ID"),
            secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
        )
        google.sites.add(site)
        if created:
            google.save()
