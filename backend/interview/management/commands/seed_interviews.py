from django.core.management.base import BaseCommand
from interview.factories import InterviewRoundFactory, InterviewRoundQuestionFactory


class Command(BaseCommand):
    help = "Seeds questions and calc embeddings."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        InterviewRoundFactory.create_batch(5)
        InterviewRoundQuestionFactory.create_batch(10)
        self.stdout.write("Done.")


## Youre fixing the InterviewRoundQuestionFactory
## You need to make it fetch existing questions.
