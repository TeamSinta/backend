import factory
from .models import (
    Question,
    Competency,
    Comment,
    QuestionBank,
    ReviewChoices,
    DifficultyChoices,
)


class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Question

    question_text = factory.Faker("sentence", nb_words=5)
    embedding = factory.List(
        [factory.Faker("pyfloat", min_value=-1, max_value=1) for _ in range(1536)]
    )
    guidelines = factory.Faker("paragraph")
    reply_time = factory.Faker("random_int", min=1, max=60)
    review = factory.Faker("random_element", elements=[e.value for e in ReviewChoices])
    difficulty = factory.Faker(
        "random_element", elements=[e.value for e in DifficultyChoices]
    )
    created_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)
    updated_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)


class CompetencyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Competency

    question = factory.SubFactory(QuestionFactory)
    competency_text = factory.Faker("sentence", nb_words=5)


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    question = factory.SubFactory(QuestionFactory)
    comment_text = factory.Faker("sentence", nb_words=5)


class QuestionBankFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = QuestionBank

    title = factory.Faker("catch_phrase")
    questions = factory.RelatedFactory(QuestionFactory, "questionbank")
