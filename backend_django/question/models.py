from django.db import models
from django.utils import timezone
from pgvector.django import VectorField


class ReviewChoices(models.IntegerChoices):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5


class DifficultyChoices(models.IntegerChoices):
    LOW = 1, "Low"
    MEDIUM = 2, "Medium"
    HIGH = 3, "High"


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    embedding = VectorField(dimensions=1536, null=True)
    guidelines = models.TextField()
    reply_time = models.IntegerField()
    difficulty = models.IntegerField(choices=DifficultyChoices.choices, default=None)
    competency = models.CharField(max_length=200)
    review = models.IntegerField(choices=ReviewChoices.choices, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Competency(models.Model):
    competency_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, default=None)
    comment_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class QuestionBank(models.Model):
    title = models.CharField(max_length=255)
    questions = models.ManyToManyField(Question)
