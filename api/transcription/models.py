from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from pgvector.django import VectorField

from interview.models import InterviewRound


class TranscriptChunk(models.Model):
    chunk_text = models.TextField()
    embedding = VectorField(dimensions=1536, null=True)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE, related_name="transcript_chunks")
    start_time = models.IntegerField()
    end_time = models.IntegerField()

    # Content type and object ID fields for the speaker
    speaker_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    speaker_object_id = models.PositiveIntegerField(null=True)
    speaker = GenericForeignKey("speaker_content_type", "speaker_object_id")
