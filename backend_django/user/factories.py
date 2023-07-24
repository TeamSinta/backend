import factory
from faker import Faker
from .models import CustomUser, Company

class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.Faker('name')

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    username = factory.Faker('name')
    email = factory.Faker('email')
    password = factory.Faker('password')
    company = factory.SubFactory(CompanyFactory)
    role = CustomUser.RoleChoices.INTERVIEWER
