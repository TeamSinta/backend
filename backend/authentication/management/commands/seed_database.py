from django.core.management.base import BaseCommand
from user.factories import UserFactory


class Command(BaseCommand):
    help = "Seeds the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        UserFactory.create_batch(10)
        self.stdout.write("Done.")
