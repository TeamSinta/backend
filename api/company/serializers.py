from rest_framework import serializers

from company.models import Company, Department
from user.models import UserDepartments  # Adjust the import according to your user model


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name"]


class DepartmentSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)

    class Meta:
        model = Department
        fields = ["id", "title"]


class CompanyDepartmentMembersSerializer(serializers.Serializer):
    username = serializers.CharField(source="user.username")
    role = serializers.CharField(source="role.name")

    class Meta:
        model = UserDepartments
        fields = ["username", "role"]
