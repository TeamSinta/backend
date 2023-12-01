from django.db import models
from user.models import CustomUser
from interview.models import InterviewRoundQuestion, InterviewRound
from interview_templates.models import TemplateQuestion
from transcription.models import TranscriptChunk
from pgvector.django import VectorField
from django.utils import timezone


class Answer(models.Model):
    question = models.ForeignKey(
        InterviewRoundQuestion, on_delete=models.CASCADE, related_name="answer"
    )
    answer_text = models.TextField(null=True)
    embedding = VectorField(dimensions=1536, null=True)
    transcript_chunks = models.ManyToManyField(TranscriptChunk, related_name="answer")


class InterviewerFeedback(models.Model):
    class EmojiChoice(models.IntegerChoices):
        FIRE = 1
        THUMBS_UP = 2
        THUMBS_DOWN = 3
        HEART = 4
        LAUGH = 5

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    note = models.TextField(null=True)
    reaction = models.IntegerField(choices=EmojiChoice.choices, null=True)
    time = models.CharField(blank=True, null=True)
    template_question = models.ForeignKey(
        TemplateQuestion,
        on_delete=models.CASCADE,
        default=None,
        null=True  # You can set your default value here
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
