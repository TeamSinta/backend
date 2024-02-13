import os

from june import analytics
from rest_framework import serializers

from company.models import Company, Department
from company.serializers import CompanySerializer
from question.serializers import QuestionSerializer
from user.serializers import CustomUser, CustomUserSerializer

from .models import Template, TemplateQuestion, TemplateTopic

analytics.write_key = os.environ.get("JUNE_ANALYTICS_WRITE_KEY", "default_key_if_not_set")


class TemplatesSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField()
    department_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Department.objects.all(),
        source="department",
        required=False,
        allow_null=True,
    )

    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True)
    interviewers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=CustomUser.objects.all(),  # Adjust to your user model
        write_only=True,
    )

    class Meta:
        model = Template
        fields = "__all__"
        extra_kwargs = {
            "department_id": {"write_only": True},
        }

    def create(self, validated_data):
        interviewers_data = validated_data.pop("interviewers", [])
        company_data = validated_data.pop("company", None)
        template = Template.objects.create(**validated_data, company=company_data)
        template.interviewers.set(interviewers_data)
        # Add June analytics tracking here
        user_id = self.context["request"].user.id  # Assuming user ID is available in the request context
        analytics.identify(user_id=str(user_id), traits={"email": self.context["request"].user.email})
        analytics.track(user_id=str(user_id), event="template_created")

        return template

    def update(self, instance, validated_data):
        interviewers_data = validated_data.pop("interviewers", None)
        company_data = validated_data.pop("company", None)

        if "image" in validated_data:
            instance.image = validated_data.pop("image")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        user_id = self.context["request"].user.id
        analytics.track(
            user_id=str(user_id),
            event="template_updated",
            properties={
                "template_id": str(instance.id),
                "updates": list(validated_data.keys()),  # Optionally, list the fields that were updated
            },
        )
        if interviewers_data is not None:
            instance.interviewers.set(interviewers_data)
        if company_data is not None:
            instance.company = company_data
            instance.save()

        return instance

    def to_representation(self, instance):
        """Modify the representation for read operations"""
        representation = super().to_representation(instance)
        representation["company"] = CompanySerializer(instance.company).data
        representation["interviewers"] = CustomUserSerializer(instance.interviewers.all(), many=True).data
        return representation


class TemplateTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateTopic
        fields = "__all__"


class TemplateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateQuestion
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Conditionally include the full question details during GET requests
        if self.context["request"].method == "GET":
            question = instance.question  # Get the associated Question object
            question_data = QuestionSerializer(question).data
            data["question"] = question_data

        return data
