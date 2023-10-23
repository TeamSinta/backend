from rest_framework import serializers
from company.models import Company, Department
from user.serializers import CustomUserSerializer, RoleSerializer


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name"]


class DepartmentSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)

    class Meta:
        model = Department
        fields = ["id", "title"]
