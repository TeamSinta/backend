from django.db import models

from company.models import Company
from user.models import CustomUser


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
    guidelines = models.TextField()
    reply_time = models.IntegerField()
    difficulty = models.IntegerField(choices=DifficultyChoices.choices, default=None)
    competency = models.CharField(max_length=200, blank=True, default=None, null=True)
    review = models.IntegerField(choices=ReviewChoices.choices, null=True, blank=True, default=None)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name="question_creator"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return self.question_text


class Competency(models.Model):
    competency_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.competency_text


class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, default=None)
    comment_text = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name="person_commented"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return self.comment_text


class QuestionBank(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    questions = models.ManyToManyField(Question)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="question_bank_creator",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return self.title
