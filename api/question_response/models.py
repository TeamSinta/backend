from django.db import models
from django.utils import timezone
from pgvector.django import VectorField

from company.models import Company
from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import TemplateQuestion
from transcription.models import TranscriptChunk
from user.models import CustomUser


class Answer(models.Model):
    question = models.ForeignKey(InterviewRoundQuestion, on_delete=models.CASCADE, related_name="answer")
    answer_text = models.TextField(null=True)
    embedding = VectorField(dimensions=1536, null=True)
    transcript_chunks = models.ManyToManyField(TranscriptChunk, related_name="answer")
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="answer_creator",
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)


class InterviewerFeedback(models.Model):
    class EmojiChoice(models.IntegerChoices):
        FIRE = 1
        THUMBS_UP = 2
        THUMBS_DOWN = 3
        HEART = 4
        LAUGH = 5

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="interviewer_feedback")
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    note = models.TextField(null=True)
    reaction = models.IntegerField(choices=EmojiChoice.choices, null=True)
    time = models.CharField(blank=True, null=True)
    template_question = models.ForeignKey(
        TemplateQuestion, on_delete=models.CASCADE, default=None, null=True  # You can set your default value here
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)
