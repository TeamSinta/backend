from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from .models import Company, CustomUser


class CustomUserDetailsSerializer(UserDetailsSerializer):
    print("Serializer initialized")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("profile_picture", "company")


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "profile_picture",
        ]


"""

This is worth checking out if refactoring can be made to stay DRY since the above CustomUserDetails
is very similar.

"""
