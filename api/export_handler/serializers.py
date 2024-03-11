from rest_framework import serializers

from interview.models import InterviewRound


class ErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(required=True)


class InterviewRoundIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewRound
        fields = ["id"]
