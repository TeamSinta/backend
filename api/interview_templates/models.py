from django.db import models
from django.utils import timezone

from company.models import Company, Department
from question.models import Question
from user.models import CustomUser


class Template(models.Model):
    id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    role_title = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    interviewers = models.ManyToManyField(CustomUser, related_name="template_interviewers")
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to="template_images/", null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="template_creator")
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return self.role_title


class TemplateTopic(models.Model):
    TIME_CHOICES = [(i, str(i)) for i in range(1, 61)]
    topics_text = models.CharField(max_length=200)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    time = models.PositiveSmallIntegerField(choices=TIME_CHOICES, default=1)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="template_topic_creator",
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)

    def __str__(self):
        return self.topics_text


class TemplateQuestion(models.Model):
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    topic = models.ForeignKey(TemplateTopic, on_delete=models.CASCADE, related_name="template_questions")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="interview_round_questions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)
