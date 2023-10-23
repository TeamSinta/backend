from django.db import models
from user.models import CustomUser
from company.models import Company
from question.models import Question
from interview_templates.models import TemplateQuestion
from django.utils import timezone


# Create your models here.
class InterviewRound(models.Model):
    title = models.CharField(max_length=200)
    candidate = models.ForeignKey(
        CustomUser,
        related_name="candidate_interviews",
        on_delete=models.CASCADE,
        null=True,
        default=None,
    )
    interviewer = models.ForeignKey(
        CustomUser,
        related_name="interviewer_rounds",
        on_delete=models.CASCADE,
    )
    video_uri = models.TextField()
    transcription_file_uri = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewRoundQuestion(models.Model):
    interview_round = models.ForeignKey(
        InterviewRound,
        on_delete=models.CASCADE,
        related_name="interview_round_questions",
    )
    question = models.ForeignKey(
        TemplateQuestion,
        on_delete=models.CASCADE,
        related_name="interview_round_questions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id
