from django.core.management.base import BaseCommand
from question.factories import (
    CommentFactory,
    CompetencyFactory,
    QuestionBankFactory,
    QuestionFactory,
)


class Command(BaseCommand):
    help = "Seeds questions and calc embeddings."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        QuestionFactory.create_batch(15)
        CompetencyFactory.create_batch(3)
        CommentFactory.create_batch(10)
        QuestionBankFactory.create_batch(5)
        self.stdout.write("Done.")
