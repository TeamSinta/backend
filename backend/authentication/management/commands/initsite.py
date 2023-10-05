from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Creating default site")
        # Delete the included site, to replace it with our localhost.
        try:
            default_site = Site.objects.get(domain="example.com", name="example.com")
        except Site.DoesNotExist:
            print("Default site already removed.")
        else:
            default_site.delete()
        # Creates our new site.
        site, created = Site.objects.get_or_create(
            pk=1, domain="127.0.0.1", name="127.0.0.1"
        )
