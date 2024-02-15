from django.contrib.auth.models import AbstractUser
from django.db import models

from company.models import Company, Department


class CustomUser(AbstractUser):
    companies = models.ManyToManyField(Company, through="UserCompanies")
    profile_picture = models.URLField(null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    id = models.CharField(max_length=200, primary_key=True, null=False)

    def __str__(self):
        return str(self.username)


class Role(models.Model):
    name = models.CharField(max_length=45, unique=True)

    def __str__(self):
        return str(self.name)


class UserCompanies(models.Model):
    id = models.CharField(max_length=200, primary_key=True, null=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="members")
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = (("user", "company"),)  # This ensures that the combination of user and company is unique

    def __str__(self):
        return f"User ID: {self.user.id}, Company ID: {self.company.id}"


class UserDepartments(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="members")
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = (("user", "department"),)  # This ensures that the combination of user and company is unique

    def __str__(self):
        return f"User ID: {self.user.id}, Department ID: {self.department.id}"
