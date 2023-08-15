from django.db import models
from user.models import CustomUser, Company
from question.models import Question
from django.utils import timezone


# Create your models here.
class InterviewRound(models.Model):
    title = models.CharField(max_length=200)
    candidate = models.ForeignKey(
        CustomUser,
        related_name=CustomUser.RoleChoices.CANDIDATE,
        on_delete=models.CASCADE,
    )
    interviewer = models.ForeignKey(
        CustomUser,
        related_name=CustomUser.RoleChoices.INTERVIEWER,
        on_delete=models.CASCADE,
    )
    description = models.TextField()
    video_uri = models.TextField()
    transcription_file_uri = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewRoundInterviewer(models.Model):
    interviewer = models.ManyToManyField(CustomUser)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)


class Topic(models.Model):
    topics_text = models.CharField(max_length=200)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)


class InterviewRoundTopic(models.Model):
    topic = models.ManyToManyField(Topic)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewRoundQuestion(models.Model):
    interview_round = models.ForeignKey(
        InterviewRound,
        on_delete=models.CASCADE,
        related_name="interview_round_questions",
    )
    interview_round_topics = models.ManyToManyField(InterviewRoundTopic)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="interview_round_questions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
