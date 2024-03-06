from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from company.models import Company, Department
from user.models import (  # Adjust the import according to your user model
    CustomUser,
    UserDepartments,
)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "created_at", "updated_at", "deleted_at"]
        read_only_fields = ["id", "created_at", "updated_at", "deleted_at"]

    def validate_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters long.")
        return value


class DepartmentSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)

    class Meta:
        model = Department
        fields = ["id", "title"]


class DepartmentMembersSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField(source="user.id")
    username = serializers.ReadOnlyField(source="user.username")
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    email = serializers.ReadOnlyField(source="user.email")
    role = serializers.ReadOnlyField(source="role.name")
    profile_picture = serializers.ReadOnlyField(source="user.profile_picture")

    class Meta:
        model = UserDepartments
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile_picture",
            "role",
        ]


class AddDepartmentMembersSerializer(serializers.Serializer):
    invitees = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_invitees(self, value):
        """Checks invitee ID to see if they exist in the DB."""
        for user_id in value:
            try:
                CustomUser.objects.get(id=user_id)
            except ObjectDoesNotExist:
                raise serializers.ValidationError(f"User with ID {user_id} does not exist.")

        """ Checks for duplicates in the invitee ID list """
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate user IDs found in invitees.")

        return value


class RemoveDepartmentMembersSerializer(serializers.Serializer):
    members = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_invitees(self, value):
        """Checks invitee ID to see if they exist in the DB."""
        for user_id in value:
            try:
                CustomUser.objects.get(id=user_id)
            except ObjectDoesNotExist:
                raise serializers.ValidationError(f"User with ID {user_id} does not exist.")

        """ Checks for duplicates in the member ID list """
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate user IDs found in invitees.")

        return value
