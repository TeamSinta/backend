import factory
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from user.models import CustomUser

from .models import (
    InterviewRound,
    InterviewRoundQuestion,
    CustomUser,
)
from user.factories import UserFactory
from interview_templates.factories import TemplateQuestion, TemplateQuestionFactory


class InterviewRoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRound

    title = factory.Faker("job")
    candidate = factory.SubFactory(UserFactory, role=CustomUser.RoleChoices.CANDIDATE)

    @factory.lazy_attribute
    def interviewer(cls):
        try:
            return (
                CustomUser.objects.filter(role=CustomUser.RoleChoices.INTERVIEWER)
                .order_by("?")
                .first()
            )
        except ObjectDoesNotExist:
            return UserFactory()


class InterviewRoundQuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRoundQuestion

    @factory.lazy_attribute
    def interview_round(cls):
        try:
            return InterviewRound.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return InterviewRoundFactory()

    @factory.lazy_attribute
    def question(cls):
        try:
            return TemplateQuestion.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return TemplateQuestionFactory()
