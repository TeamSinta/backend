from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from user.models import CustomUser, UserDepartments, Role, UserCompanies


class CustomUserDetailsSerializer(UserDetailsSerializer):
    companies = serializers.SerializerMethodField()

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("profile_picture", "companies")

    def get_companies(self, obj):
        from company.serializers import CompanySerializer

        return CompanySerializer(obj.companies, many=True).data


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile_picture",
        ]


"""
This is worth checking out if refactoring can be made to stay DRY since the above CustomUserDetails
is very similar.
"""


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class UserDepartmentSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="user.id")
    username = serializers.ReadOnlyField(source="user.username")
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    email = serializers.ReadOnlyField(source="user.email")
    role = serializers.ReadOnlyField(source="role.name")
    profile_picture = serializers.ReadOnlyField(source="user.profile_picture")

    class Meta:
        model = UserCompanies
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile_picture",
            "role",
        ]


class UserCompanySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="user.id")
    username = serializers.ReadOnlyField(source="user.username")
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    email = serializers.ReadOnlyField(source="user.email")
    role = serializers.ReadOnlyField(source="role.name")
    profile_picture = serializers.ReadOnlyField(source="user.profile_picture")

    class Meta:
        model = UserCompanies
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile_picture",
            "role",
        ]
