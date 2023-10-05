from django.core.management.base import BaseCommand
from user.factories import UserFactory


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        UserFactory.create_batch(5)
        UserFactory.create_candidate(5)
        self.stdout.write("Done.")
