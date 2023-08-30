from django.db import models
from interview.models import InterviewRound


class Summary(models.Model):
    interview_round = models.ForeignKey(
        InterviewRound, on_delete=models.CASCADE, related_name="summary"
    )
    description = models.TextField(blank=True, null=True)
    qa_pairs = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Summary for interview round {self.interview_round.id}"
