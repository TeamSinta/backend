import factory
from faker import Faker
from .models import CustomUser, Company


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.Faker("company")


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    username = factory.Faker("user_name")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    password = factory.Faker("password")
    company = factory.SubFactory(CompanyFactory)
    role = CustomUser.RoleChoices.INTERVIEWER

    @classmethod
    def create_candidate(cls, n=1, **kwargs):
        for _ in range(n):
            cls.create(role=CustomUser.RoleChoices.CANDIDATE, **kwargs)
