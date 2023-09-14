from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class CustomUserDetailsSerializer(UserDetailsSerializer):
    print("Serializer initialized")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("profile_picture",)
