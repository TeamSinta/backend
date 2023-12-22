from rest_framework import serializers

from .models import Answer, InterviewerFeedback


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class InterviewerFeedbackSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()

    class Meta:
        model = InterviewerFeedback
        fields = "__all__"  # You might want to explicitly list out the fields and add 'question_text'

    def get_question_text(self, obj):
        # Check if template_question is not None
        if obj.template_question is not None:
            return obj.template_question.question.question_text
        return None
