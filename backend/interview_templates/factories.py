import factory
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from user.factories import CompanyFactory
from company.models import Company
from question.models import Question
from interview_templates.models import Template, TemplateTopic, TemplateQuestion
from question.factories import QuestionFactory


class TemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Template

    role_title = factory.Faker("job")
    location = factory.Faker("city")
    description = factory.Faker("sentence")

    @factory.lazy_attribute
    def company(cls):
        try:
            return Company.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return CompanyFactory()

    @factory.post_generation
    def interviewers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            # If 'interviewers' argument is provided, set the interviewers accordingly.
            for interviewer in extracted:
                self.interviewers.add(interviewer)


class TemplateTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TemplateTopic

    topics_text = factory.Faker("word")

    @factory.lazy_attribute
    def template_id(cls):
        try:
            return Template.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return TemplateFactory()

    # company_id = factory.SelfAttribute("..template_id.company")
    @factory.lazy_attribute
    def company_id(self):
        return self.template_id.company

    time = factory.Faker("random_int", min=1, max=60)


class TemplateQuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TemplateQuestion

    @factory.lazy_attribute
    def template_id(self):
        return self.topic.template_id

    @factory.lazy_attribute
    def topic(self):
        try:
            return TemplateTopic.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return TemplateTopicFactory()

    @factory.lazy_attribute
    def question(self):
        try:
            return Question.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return QuestionFactory()

    # template_id = factory.SubFactory(TemplateFactory)
    # topic = factory.SubFactory(TemplateTopicFactory)
    # question = factory.SubFactory(QuestionFactory)
