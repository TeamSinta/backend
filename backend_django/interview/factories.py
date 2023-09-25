import factory
from django.utils import timezone
from user.models import CustomUser

from .models import (
    InterviewRound,
    InterviewRoundQuestion,
    CustomUser,
)
from user.factories import UserFactory
from templates.factories import TemplateQuestion


class InterviewRoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRound

    title = factory.Faker("name")
    candidate = factory.SubFactory(UserFactory, role=CustomUser.RoleChoices.CANDIDATE)
    interviewer = factory.SubFactory(
        UserFactory, role=CustomUser.RoleChoices.INTERVIEWER
    )
    description = factory.Faker("text")


class InterviewRoundQuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRoundQuestion

    interview_round = factory.SubFactory(InterviewRoundFactory)
    question = factory.SubFactory(TemplateQuestion)
