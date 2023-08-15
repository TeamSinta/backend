import factory
from django.utils import timezone
from user.models import CustomUser, Company
from question.models import Question
from .models import (
    InterviewRound,
    InterviewRoundInterviewer,
    Topic,
    InterviewRoundTopic,
    InterviewRoundQuestion,
    CustomUser,
)
from user.factories import UserFactory, CompanyFactory
from question.factories import QuestionFactory


class InterviewRoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRound

    title = factory.Faker("name")
    candidate = factory.SubFactory(UserFactory, role=CustomUser.RoleChoices.CANDIDATE)
    interviewer = factory.SubFactory(
        UserFactory, role=CustomUser.RoleChoices.INTERVIEWER
    )
    description = factory.Faker("text")


class InterviewRoundInterviewerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRoundInterviewer

    interviewer = factory.SubFactory(
        UserFactory, role=CustomUser.RoleChoices.INTERVIEWER
    )
    interview_round = factory.SubFactory(InterviewRoundFactory)


class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic

    topics_text = factory.Faker("sentence")
    company_id = factory.SubFactory(CompanyFactory)


class InterviewRoundTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRoundTopic

    topic = factory.SubFactory(TopicFactory)
    interview_round = factory.SubFactory(InterviewRoundFactory)


class InterviewRoundQuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = InterviewRoundQuestion

    interview_round = factory.SubFactory(InterviewRoundFactory)
    question = factory.SubFactory(QuestionFactory)
