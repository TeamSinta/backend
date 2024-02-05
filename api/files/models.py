from django.db import models

# from company.models import Company
# from user.models import CustomUser


# commenting below code as it is interupting user delete scenerio
class File(models.Model):
    file = models.FileField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, default=None)
    # user = models.ForeignKey(
    #     CustomUser, on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name="file_creator"
    # )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    # deleted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, default=None)
