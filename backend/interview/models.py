from django.db import models
from user.models import CustomUser
from company.models import Company
from interview_templates.models import TemplateQuestion
from django.utils import timezone


class Candidate(models.Model):
    username = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# Create your models here.
class InterviewRound(models.Model):
    title = models.CharField(max_length=200)
    candidate = models.ForeignKey(
        Candidate, on_delete=models.CASCADE, null=True, blank=True
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
    template_id = models.IntegerField(default=55)
    meeting_room_id = models.CharField(blank=True, null=True)


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
    rating = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)
