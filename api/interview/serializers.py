from rest_framework import serializers

from .models import Candidate, InterviewRound, InterviewRoundQuestion


class InterviewRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewRound
        fields = "__all__"


class InterviewRoundQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewRoundQuestion
        fields = "__all__"


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = "__all__"
