from django.db import models

from company.models import Company
from interview.models import InterviewRound
from user.models import CustomUser


class Summary(models.Model):
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE, related_name="summary")
    description = models.TextField(blank=True, null=True)
    qa_pairs = models.JSONField(blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="summary_creator",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return f"Summary for interview round {self.interview_round.id}"
