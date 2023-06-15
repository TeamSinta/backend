from django.db import models
from user.models import User

class InterviewRound(models.Model):
    name = models.CharField(max_length=200)
    candidate = models.ForeignKey(User, related_name='candidate', on_delete=models.CASCADE)
    interviewer = models.ForeignKey(User, related_name='interviewer', on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class InterviewRoundQuestion(models.Model):
    interview_round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE)
    question = models.ForeignKey('question.Question', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
