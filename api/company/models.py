from django.db import models


# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=200)
    id = models.CharField(max_length=200, primary_key=True, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)

    def __str__(self):
        return str(self.name)


class Department(models.Model):
    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)

    def __str__(self):
        return str(self.title)
