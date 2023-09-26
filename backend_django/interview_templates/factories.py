import factory
from django.utils import timezone
from user.models import CustomUser, Company
from question.models import Question
from interview_templates.models import Template, TemplateTopic, TemplateQuestion
from question.factories import QuestionFactory


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.Faker("company")


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    username = factory.Faker("user_name")
    company = factory.SubFactory(CompanyFactory)
    role = CustomUser.RoleChoices.CANDIDATE
    profile_picture = factory.django.ImageField()


class TemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Template

    role_title = factory.Faker("job")
    location = factory.Faker("city")
    company = factory.SubFactory(CompanyFactory)

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
    template_id = factory.SubFactory(TemplateFactory)
    company_id = factory.SelfAttribute("..template_id.company")
    time = factory.Faker("random_int", min=1, max=60)


class TemplateQuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TemplateQuestion

    template_id = factory.SubFactory(TemplateFactory)
    topic = factory.SubFactory(TemplateTopicFactory)
    question = factory.SubFactory(QuestionFactory)
