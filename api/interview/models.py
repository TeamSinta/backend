from django.db import models

from company.models import Company
from interview_templates.models import TemplateQuestion
from user.models import CustomUser

HIRE_CHOICES = (
    (1, "Hire"),
    (2, "Dont Hire"),
    (3, "Strong Hire"),
)


class Candidate(models.Model):
    username = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name="candidate_creator"
    )
    email = models.CharField(max_length=200, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)


# Create your models here.
class InterviewRound(models.Model):
    title = models.CharField(max_length=200)
    icon = models.TextField(max_length=10, blank=True, null=True, default=None)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, null=True, blank=True)
    interviewer = models.ForeignKey(
        CustomUser,
        related_name="interviewer_rounds",
        on_delete=models.CASCADE,
    )
    video_uri = models.TextField()
    thumbnail = models.ImageField(blank=True, null=True, default=None, upload_to="interview-thumbnails/")
    transcription_file_uri = models.TextField()
    template_id = models.IntegerField(default=55)
    meeting_room_id = models.CharField(blank=True, null=True)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="interview_round_creator",
    )
    decision_hire = models.IntegerField(choices=HIRE_CHOICES, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)


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
    rating = models.IntegerField(null=True, blank=True, default=None)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="interview_round_questions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return str(self.id)
