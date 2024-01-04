import factory

from .models import Company, Department


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.Faker("company")
    created_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)
    updated_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)


class DepartmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Department

    name = factory.Faker("department")
    created_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)
    updated_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)
