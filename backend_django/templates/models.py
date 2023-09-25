from django.db import models
from user.models import CustomUser, Company
from question.models import Question
from django.utils import timezone


class Template(models.Model):
    id = models.AutoField(primary_key=True)
    role_title = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    interviewers = models.ManyToManyField(CustomUser)

    def __str__(self):
        return self.role_title


class TemplateTopic(models.Model):
    TIME_CHOICES = [(i, str(i)) for i in range(1, 61)]  # Creates choices from 1 to 60
    topics_text = models.CharField(max_length=200)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    time = models.PositiveSmallIntegerField(
        choices=TIME_CHOICES, default=1  # Set a default value if needed
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)


class TemplateQuestion(models.Model):
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    topic = models.ForeignKey(
        TemplateTopic, on_delete=models.CASCADE, related_name="template_questions"
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="interview_round_questions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
