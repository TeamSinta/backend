import factory
from django.core.exceptions import ObjectDoesNotExist

from .models import Comment, DifficultyChoices, Question, QuestionBank, ReviewChoices


class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Question

    question_text = factory.Faker("sentence", nb_words=5)
    embedding = factory.List([factory.Faker("pyfloat", min_value=-1, max_value=1) for _ in range(1536)])
    guidelines = factory.Faker("paragraph")
    competency = factory.Faker("word")
    reply_time = factory.Faker("random_int", min=1, max=60)
    review = factory.Faker("random_element", elements=[e.value for e in ReviewChoices])
    difficulty = factory.Faker("random_element", elements=[e.value for e in DifficultyChoices])
    created_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)
    updated_at = factory.Faker("date_time_this_year", before_now=True, after_now=False)


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    @factory.lazy_attribute
    def question(cls):
        try:
            return Question.objects.order_by("?").first()
        except ObjectDoesNotExist:
            return QuestionFactory()

    comment_text = factory.Faker("sentence", nb_words=5)


class QuestionBankFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = QuestionBank

    title = factory.Faker("catch_phrase")

    @factory.post_generation
    def questions(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for question in extracted:
                self.questions.add(question)
        else:
            # Add default number of questions
            for _ in range(5):  # Adjust the number as needed
                question = QuestionFactory()
                self.questions.add(question)
