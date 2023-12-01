from django.core.management.base import BaseCommand

from interview_templates.factories import TemplateFactory, TemplateQuestionFactory, TemplateTopicFactory


class Command(BaseCommand):
    help = "Seeds questions and calc embeddings."

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding DB...")
        TemplateFactory.create_batch(5)
        TemplateTopicFactory.create_batch(4)
        TemplateQuestionFactory.create_batch(13)
        self.stdout.write("Done.")
