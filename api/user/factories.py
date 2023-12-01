import random

import factory

from company.factories import CompanyFactory

from .models import CustomUser, Role, UserCompanies


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

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
                UserCompanies.objects.create(user=self, company=company, role=role)
        else:
            UserCompanies.objects.create(user=self, company=CompanyFactory(), role=role)

    @classmethod
    def create_member(cls, n=1, **kwargs):
        role_member = Role.objects.get_or_create(name="member")[0]
        for _ in range(n):
            user = cls.create()
            company = CompanyFactory()
            UserCompanies.objects.create(user=user, company=company, role=role_member)


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    name = factory.Iterator(["admin", "manager", "interviewer", "member", "candidate"])
