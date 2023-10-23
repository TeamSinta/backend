from django.core.management.base import BaseCommand
from user.models import Role
from user.factories import UserFactory, RoleFactory


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        roles = ["admin", "manager", "interviewer", "member", "candidate"]
        for role_name in roles:
            Role.objects.get_or_create(name=role_name)
        UserFactory.create_batch(5)
        UserFactory.create_member(5)
        self.stdout.write("Done.")
