from django.db import models
from django.contrib.auth.models import AbstractUser

class Company(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    class RoleChoices(models.TextChoices):
        ADMIN = "admin"
        INTERVIEWER = "interviewer"
        CANDIDATE = "candidate"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    role = models.CharField(max_length=20, choices=RoleChoices.choices)

    def __str__(self):
        return self.username
