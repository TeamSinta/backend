import factory
from django.core.exceptions import ObjectDoesNotExist

from interview_templates.factories import TemplateQuestion, TemplateQuestionFactory
from user.factories import UserFactory
from user.models import CustomUser, Role

from .models import Candidate, InterviewRound, InterviewRoundQuestion


class CandidateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Candidate

    name = factory.Faker("name")
    username = factory.Faker("name")


class InterviewRoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRound

    title = factory.Faker("job")
    candidate = factory.SubFactory(CandidateFactory)

    @factory.lazy_attribute
    def interviewer(cls):
        interviewer_role, _ = Role.objects.get_or_create(name="interviewer")
        interviewer = CustomUser.objects.filter(usercompanies__role=interviewer_role).order_by("?").first()
        return interviewer or UserFactory()


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
