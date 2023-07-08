from django.db import models
from django.utils import timezone

class Competency(models.Model):
    competency_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Question(models.Model):
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE, null=True)
    question_text = models.CharField(max_length=200)
    guidelines = models.TextField()
    reply_time = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class QuestionBank(models.Model):
    name = models.CharField(max_length=255)
    questions = models.ManyToManyField(Question)
