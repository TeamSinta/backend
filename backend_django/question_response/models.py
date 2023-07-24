from django.db import models
from user.models import CustomUser
from interview.models import InterviewRoundQuestion
from transcription.models import TranscriptChunk
from pgvector.django import VectorField

class Answer(models.Model):
    question = models.ForeignKey(InterviewRoundQuestion, on_delete=models.CASCADE, related_name='answer')
    answer_text = models.TextField(null=True)
    embedding = VectorField(dimensions=1536, null=True)
    transcript_chunks = models.ManyToManyField(TranscriptChunk, related_name='answer')

class InterviewerFeedback(models.Model):
    class EmojiChoice(models.IntegerChoices):
        FIRE = 1
        THUMBS_UP = 2
        THUMBS_DOWN = 3
        HEART = 4
        LAUGH = 5

    class ScoreChoice(models.IntegerChoices):
        ONE = 1
        TWO = 2
        THREE = 3
        FOUR = 4
        FIVE = 5

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    note = models.TextField()
    reaction = models.IntegerField(choices=EmojiChoice.choices)
    score = models.IntegerField(choices=ScoreChoice.choices)
