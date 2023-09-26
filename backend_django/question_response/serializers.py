from rest_framework import serializers
from .models import InterviewerFeedback, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class InterviewerFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewerFeedback
        fields = "__all__"
