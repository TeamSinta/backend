from django.db import models
from user.models import CustomUser
from interview.models import InterviewRound
from pgvector.django import VectorField


class TranscriptChunk(models.Model):
    chunk_text = models.TextField()
    embedding = VectorField(dimensions=1536, null=True)
    interview_round = models.ForeignKey(
        InterviewRound, on_delete=models.CASCADE, related_name="transcript_chunks"
    )
    start_time = models.IntegerField()
    end_time = models.IntegerField()
    speaker = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
