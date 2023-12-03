from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from company.models import Company, Department
from question.serializers import QuestionSerializer
from user.serializers import UserCompanies

from .models import Template, TemplateQuestion, TemplateTopic


class TemplatesSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        company_id = kwargs.pop("company_id", None)
        super().__init__(*args, **kwargs)

        if company_id:
            self.fields["interviewers"].queryset = UserCompanies.objects.filter(company_id=company_id)

    department = serializers.StringRelatedField(required=False)  # Make it optional
    department_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Department.objects.all(),
        source="department",
        allow_null=True,
    )
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True)
    interviewers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=UserCompanies.objects.all(),  # Adjust to your user model
        write_only=True,
    )

    class Meta:
        model = Template
        fields = "__all__"
        extra_kwargs = {
            "department_id": {"write_only": True},
        }

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        # Check if the user has permission to create a template
        if not user.is_authenticated or not user.can_create_template:  # Replace with your actual permission check
            raise PermissionDenied("You do not have permission to create a template.")

        interviewers_data = validated_data.pop("interviewers", [])
        company_data = validated_data.pop("company", None)
        template = Template.objects.create(**validated_data, company=company_data)
        template.interviewers.set(interviewers_data)
        return template

    def update(self, instance, validated_data):
        request = self.context.get("request")
        user = request.user

        # Check if the user has permission to update a template
        if not user.is_authenticated or not user.can_update_template(
            instance
        ):  # Replace with your actual permission check
            raise PermissionDenied("You do not have permission to update this template.")

        interviewers_data = validated_data.pop("interviewers", None)
        company_data = validated_data.pop("company", None)

        if "image" in validated_data:
            instance.image = validated_data.pop("image")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if interviewers_data is not None:
            instance.interviewers.set(interviewers_data)
        if company_data is not None:
            instance.company = company_data
            instance.save()

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request")

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
