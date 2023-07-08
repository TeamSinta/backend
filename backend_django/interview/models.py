from django.db import models
from user.models import User, Company
from question.models import Question
from django.utils import timezone

class InterviewRound(models.Model):
    title = models.CharField(max_length=200)
    candidate = models.ForeignKey(User, related_name='candidate', on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class InterviewRoundInterviewer(models.Model):
    interviewer = models.ManyToManyField(User)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)


class Topic(models.Model):
    topics_text = models.CharField(max_length=200)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)

class InterviewRoundTopic(models.Model):
    topic =  models.ManyToManyField(Topic)
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewRoundQuestion(models.Model):
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    interview_round_topics = models.ManyToManyField(InterviewRoundTopic)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
