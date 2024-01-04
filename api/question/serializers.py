from rest_framework import serializers

from .models import DifficultyChoices, Question, QuestionBank


class DifficultyField(serializers.ChoiceField):
    def to_representation(self, obj):
        # Convert the integer value to the string representation
        return self.choices.get(obj, obj)

    def to_internal_value(self, data):
        # If the data is already an integer, return it directly
        if isinstance(data, int) and data in DifficultyChoices.values:
            return data

        # If the data is a string, convert it to the corresponding integer
        if isinstance(data, str):
            for key, value in DifficultyChoices.choices:
                if value.lower() == data.lower():
                    return key

        raise serializers.ValidationError(f'"{data}" is not a valid choice.')


class QuestionSerializer(serializers.ModelSerializer):
    difficulty = DifficultyField(choices=DifficultyChoices.choices)

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
