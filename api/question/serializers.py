from rest_framework import serializers

from .models import Question, QuestionBank


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class QuestionBankSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionBank
        fields = "__all__"


class QuestionBankUpdateSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(many=True, queryset=Question.objects.all(), required=False)

    class Meta:
        model = QuestionBank
        fields = "__all__"

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", None)
        instance = super(QuestionBankUpdateSerializer, self).update(instance, validated_data)

        if questions_data is not None:
            instance.questions.set(questions_data)

        return instance