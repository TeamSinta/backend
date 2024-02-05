import random
import secrets

import factory

from company.factories import CompanyFactory

from .models import CustomUser, Role, UserCompanies


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    id = factory.Sequence(lambda n: n)
    username = factory.Faker("user_name")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    password = factory.Faker("password")

    @factory.post_generation
    def companies(self, create, extracted, **kwargs):
        if not create:
            return

        role = random.choice(Role.objects.all())

        if extracted:
            for company in extracted:
                pk = secrets.token_hex(10)
                UserCompanies.objects.create(id=pk, user=self, company=company, role=role)
        else:
            pk = secrets.token_hex(10)
            UserCompanies.objects.create(id=pk, user=self, company=CompanyFactory(), role=role)

    @classmethod
    def create_member(cls, n=1, **kwargs):
        role_member = Role.objects.get_or_create(name="member")[0]
        for _ in range(n):
            user = cls.create()
            company = CompanyFactory()
            pk = secrets.token_hex(10)
            UserCompanies.objects.create(id=pk, user=user, company=company, role=role_member)


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    name = factory.Iterator(["admin", "manager", "interviewer", "member", "candidate"])
