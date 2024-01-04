from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from pgvector.django import VectorField

from interview.models import InterviewRound
from user.models import CustomUser


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
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="transcript_chunk_creator",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)
