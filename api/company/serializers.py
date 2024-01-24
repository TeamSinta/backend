from rest_framework import serializers

from company.models import Company, Department
from user.models import CustomUser  # Adjust the import according to your user model


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
    department_id = serializers.IntegerField()
    invitee_ids = serializers.ListField(child=serializers.IntegerField())

    def validate_department_id(self, value):
        if not Department.objects.filter(id=value).exists():
            raise serializers.ValidationError("Department not found.")
        return value

    def validate_invitee_ids(self, value):
        for user_id in value:
            if not CustomUser.objects.filter(id=user_id).exists():
                raise serializers.ValidationError(f"User with id {user_id} not found.")
        return value
