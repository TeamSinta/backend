import json
import os

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from june import analytics
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Company
from question.models import Question
from question.serializers import QuestionSerializer
from user.models import CustomUser, UserCompanies

from .models import Template, TemplateQuestion, TemplateTopic
from .serializers import (
    TemplateQuestionSerializer,
    TemplatesSerializer,
    TemplateTopicSerializer,
)

DELETE_SUCCESS = {"detail": "Successfully deleted"}

analytics.write_key = os.environ.get("JUNE_ANALYTICS_WRITE_KEY", "default_key_if_not_set")


class BaseDeleteInstance(generics.DestroyAPIView):
    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.deleted_by = self.request.user
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(DELETE_SUCCESS, status=status.HTTP_204_NO_CONTENT)


class TemplateTopicList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateTopicSerializer

    def create(self, request, *args, **kwargs):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        request.data["user"] = user_company.user_id
        request.data["company"] = user_company.company_id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = TemplateTopic.objects.filter(company=company_id, deleted_at__isnull=True)

        template = self.request.query_params.get("template")
        if template is not None:
            queryset = queryset.filter(template_id=template)

        return queryset


class TemplateTopicDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateTopicSerializer

    def get_queryset(self):
        topic_id = self.kwargs["pk"]
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = TemplateTopic.objects.filter(company=company_id, deleted_at__isnull=True)
        if topic_id is not None:
            queryset = queryset.filter(id=topic_id)

        return queryset

    def get_object(self):
        obj = super().get_object()

        if obj.deleted_at is not None and obj.deleted_by is not None:
            return ""
        else:
            return obj


class TemplateQuestionsList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateQuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        templates = Template.objects.filter(company=company_id, deleted_at__isnull=True)
        template_ids = templates.values_list("id", flat=True)

        queryset = TemplateQuestion.objects.filter(template_id__in=template_ids, deleted_at__isnull=True)

        template = self.request.query_params.get("template")
        template_topic = self.request.query_params.get("topic")
        if template is not None:
            queryset = queryset.filter(template_id=template)
        if template_topic is not None:
            queryset = queryset.filter(topic_id=template_topic)
        return queryset

    def create(self, request, *args, **kwargs):
        # Extract the question data from the request
        print(request)
        question_data = request.data.get("question")
        # Extract the "difficulty" field from question_data and convert it
        difficulty_mapping = {
            "Low": 1,
            "Medium": 2,
            "High": 3,
        }
        difficulty_display = question_data.pop("difficulty", "")  # Remove "difficulty" from question_data
        difficulty = difficulty_mapping.get(difficulty_display, None)
        question_data["difficulty"] = difficulty  # Add the converted "difficulty" back to question_data
        # Add the company of the logged-in user to question_data
        user_company = get_object_or_404(UserCompanies, user=request.user)
        question_data["company"] = user_company.company_id
        question_data["user"] = user_company.user_id
        # Create a new Question object

        question_serializer = QuestionSerializer(data=question_data)

        if question_serializer.is_valid():
            question = question_serializer.save()
        else:
            return JsonResponse(question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question_id = question.id
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return JsonResponse({"error": "Question not found"}, status=status.HTTP_400_BAD_REQUEST)

            # Create the TemplateQuestion object with the associated Question
        template_question_data = {
            "template_id": request.data.get("template_id"),
            "topic": request.data.get("topic"),
            "question": question.id,
        }
        template_question_serializer = TemplateQuestionSerializer(
            data=template_question_data, context={"request": request}
        )
        user_id = self.request.user.id  # Assuming user ID is available in the request context
        analytics.identify(user_id=str(user_id), traits={"email": self.request.user.email})
        analytics.track(user_id=str(user_id), event="question_created")
        if template_question_serializer.is_valid():
            template_question_serializer.save()
            return JsonResponse(template_question_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse(template_question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateQuestionsDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateQuestionSerializer

    def get_queryset(self):
        # Retrieve the company associated with the logged-in user
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        templates = Template.objects.filter(company=company_id, deleted_at__isnull=True)
        template_ids = templates.values_list("id", flat=True)

        queryset = TemplateQuestion.objects.filter(template_id__in=template_ids, deleted_at__isnull=True)
        return queryset


class TemplatesList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplatesSerializer

    def get_queryset(self):
        # Retrieve the company associated with the logged-in user
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        # Filter Template objects by the company ID associated with the logged-in user
        queryset = Template.objects.filter(company=company_id, deleted_at__isnull=True)
        return queryset


class TemplateDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplatesSerializer

    def get_queryset(self):
        template_id = self.kwargs["pk"]
        # Retrieve the company associated with the logged-in user
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        # Filter Template objects by the company ID
        queryset = Template.objects.filter(company=company_id, deleted_at__isnull=True)
        if template_id is not None:
            queryset = queryset.filter(id=template_id)

        return queryset

    parser_classes = (MultiPartParser, FormParser, JSONParser)


# CRUD for Templates, TemplateTopics, TemplateInterviewers, & TemplateQuestions
# Create a Template


class CreateTemplate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.method == "POST":
            data = json.loads(request.body)
            role_title = data.get("role_title")
            user_ids = data.get("interviewer_ids")
            company_id = data.get("company_id")
            department_id = data.get("department_id")  # Include department field

            company = Company.objects.get(id=company_id)
            interviewers = CustomUser.objects.filter(id__in=user_ids)

            template = Template.objects.create(
                role_title=role_title,
                company=company,
                department_id=department_id,  # Set department if provided
            )

            template.interviewers.set(interviewers)

            response = {
                "id": template.id,
                "role_title": template.role_title,
                "location": template.location,
                "interviewer_ids": user_ids,
                "company": company_id,
                "department_id": department_id,  # Include department ID in the response
            }

            return JsonResponse(response, status=201)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Read a Template
class ReadTemplate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            user_company = get_object_or_404(UserCompanies, user=request.user)
            company_id = user_company.company_id

            template = get_object_or_404(Template, pk=template_id, company=company_id)

            response = {
                "id": template.id,
                "role_title": template.role_title,
                "location": template.location,
                "company": template.company.id,
                "interviewers": [
                    {
                        "id": interviewer.id,
                        "first_name": interviewer.first_name,
                        "last_name": interviewer.last_name,
                        "profile_picture": (
                            request.build_absolute_uri(interviewer.profile_picture)
                            if interviewer.profile_picture
                            else None
                        ),
                    }
                    for interviewer in template.interviewers.all()
                ],
                "department_name": template.department.title if template.department else None,
            }

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all Templates
class GetAllTemplates(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_company = get_object_or_404(UserCompanies, user=request.user)
        company_id = user_company.company_id
        templates = Template.objects.filter(company=company_id, deleted_at__isnull=True)
        template_list = []

        for template in templates:
            template_data = {
                "id": template.id,
                "role_title": template.role_title,
                "location": template.location,
                "company_id": template.company.id,
                "interviewers": [
                    {
                        "id": interviewer.id,
                        "first_name": interviewer.first_name,
                        "last_name": interviewer.last_name,
                        "profile_picture": (
                            request.build_absolute_uri(interviewer.profile_picture)
                            if interviewer.profile_picture
                            else None
                        ),
                    }
                    for interviewer in template.interviewers.all()
                ],
                "department_name": template.department.title if template.department else None,
            }
            template_list.append(template_data)

        return JsonResponse(template_list, safe=False, status=200)


# Delete a Template
class DeleteTemplate(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, template_id):
        if request.method == "DELETE":
            user_company = get_object_or_404(UserCompanies, user=request.user)
            company_id = user_company.company_id
            template = get_object_or_404(Template, pk=template_id, company=company_id, deleted_at__isnull=True)
            template.deleted_at = timezone.now()
            template.deleted_by = request.user
            template.save()
            analytics.track(
                user_id=str(request.user.id),
                event="template_deleted",
                properties={
                    "template_id": str(template_id),
                    "company_id": str(company_id),
                    "deleted_by": str(request.user.id),
                    "deleted_at": str(template.deleted_at),
                },
            )

            return JsonResponse({"message": "Template deleted successfully"}, status=204)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Create a TemplateTopic
class CreateTemplateTopic(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, template_id):
        if request.method == "POST":
            data = json.loads(request.body)
            topics_text = data.get("topics_text")
            company_id = data.get("company_id")
            time = data.get("time", 1)  # Default to 1 if 'time' is not provided

            try:
                template = Template.objects.get(id=template_id)
                company = Company.objects.get(id=company_id)

                template_topic = TemplateTopic.objects.create(
                    topics_text=topics_text,
                    template_id=template,
                    company=company,
                    time=time,
                )

                # Add associated questions

                response = {
                    "id": template_topic.id,
                    "topics_text": template_topic.topics_text,
                    "template_id": template.id,
                    "company_id": company.id,
                    "time": template_topic.time,
                }

                return JsonResponse(response, status=201)
            except Template.DoesNotExist:
                error_response = {"error": "Template not found"}
                return JsonResponse(error_response, status=404)
            except Company.DoesNotExist:
                error_response = {"error": "Company not found"}
                return JsonResponse(error_response, status=404)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Read a TemplateTopic
class ReadTemplateTopic(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id, template_topic_id):
        if request.method == "GET":
            user_company = get_object_or_404(UserCompanies, user=request.user)
            company_id = user_company.company_id

            template_topic = get_object_or_404(
                TemplateTopic, pk=template_topic_id, template_id=template_id, company=company_id
            )

            # Get the IDs of associated questions
            questions = template_topic.template_questions.all()

            response = {
                "id": template_topic.id,
                "topics_text": template_topic.topics_text,
                "template_id": template_topic.template_id.id,
                "company_id": template_topic.company_id.id,
                "time": template_topic.time,
                "questions": [{"id": question.id, "question_text": question.question.text} for question in questions],
            }

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Update a TemplateTopic
class UpdateTemplateTopic(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, template_id, template_topic_id):
        if request.method == "PUT":
            template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
            data = json.loads(request.body)

            topics_text = data.get("topics_text")
            company_id = data.get("company_id")
            time = data.get("time")
            question_ids = data.get("questions", [])  # Assuming 'questions' is a list of question IDs.

            if topics_text is not None:
                template_topic.topics_text = topics_text

            try:
                template = Template.objects.get(id=template_id)
                template_topic.template_id = template
            except Template.DoesNotExist:
                error_response = {"error": "Template not found"}
                return JsonResponse(error_response, status=404)

            if company_id is not None:
                try:
                    company = Company.objects.get(id=company_id)
                    template_topic.company_id = company
                except Company.DoesNotExist:
                    error_response = {"error": "Company not found"}
                    return JsonResponse(error_response, status=404)

            if time is not None:
                template_topic.time = time

            # Clear existing questions and add the updated list of questions
            template_topic.questions.set(question_ids)

            template_topic.save()

            response = {
                "id": template_topic.id,
                "topics_text": template_topic.topics_text,
                "template_id": template_topic.template_id.id,
                "company_id": template_topic.company_id.id,
                "time": template_topic.time,
                "questions": question_ids,
            }

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Delete a TemplateTopic
class DeleteTemplateTopic(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, template_id, template_topic_id):
        if request.method == "DELETE":
            template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id, deleted_at__isnull=True)
            template_topic.deleted_at = timezone.now()
            template_topic.deleted_by = request.user
            template_topic.save()

            return JsonResponse({"message": "TemplateTopic deleted successfully"}, status=204)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all TemplateTopics
class GetAllTemplateTopics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        print("get here")
        user_company = get_object_or_404(UserCompanies, user=request.user)
        company_id = user_company.company_id
        if request.method == "GET":
            template_topics = TemplateTopic.objects.filter(
                template_id=template_id, company=company_id, deleted_at__isnull=True
            )

            template_topic_list = []

            for topic in template_topics:
                # Get the IDs of associated questions for each topic

                template_topic_data = {
                    "id": topic.id,
                    "topics_text": topic.topics_text,
                    "template_id": topic.template_id.id,
                    "company_id": topic.company_id,
                    "time": topic.time,
                }

                template_topic_list.append(template_topic_data)

            return JsonResponse(template_topic_list, safe=False, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Create a TemplateQuestion
class CreateTemplateQuestion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, template_id):
        if request.method == "POST":
            data = json.loads(request.body)

            # Check if the request is for a single question or multiple
            if isinstance(data, dict):  # Case for a single question
                questions = [data]
            elif isinstance(data, list):  # Case for multiple questions
                questions = data
            else:
                return JsonResponse({"error": "Invalid payload format"}, status=400)

            template = get_object_or_404(Template, pk=template_id)
            responses = []

            for question_data in questions:
                template_topic_id = question_data.get("template_topic_id")
                question_id = question_data.get("question_id")

                topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
                question = Question.objects.get(id=question_id)

                template_question = TemplateQuestion.objects.create(
                    template_id=template, topic=topic, question=question
                )

                response = {
                    "id": template_question.id,
                    "template_id": template_id,
                    "template_topic_id": template_topic_id,
                    "question_id": question_id,
                }
                responses.append(response)

            if len(responses) == 1:  # If only one question was processed
                return JsonResponse(responses[0], status=201)
            else:  # If multiple questions were processed
                return JsonResponse(responses, safe=False, status=201)

        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Update TemplateQuestions for a Template
class UpdateTemplateQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, template_id):
        if request.method == "PUT":
            data = json.loads(request.body)
            template_topic_id = data.get("template_topic_id")
            question_id = data.get("question_id")

            template = get_object_or_404(Template, pk=template_id)
            template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
            question = get_object_or_404(Question, pk=question_id)

            # Assuming you want to update all TemplateQuestion objects
            template_questions = TemplateQuestion.objects.filter(template_id=template_id)

            # Update the template and question fields for all TemplateQuestion objects
            template_questions.update(template_id=template, question=question)

            # Set the template_topic for all TemplateQuestion objects
            for template_question in template_questions:
                template_question.topic = template_topic
                template_question.save()

            response = {
                "template_id": template_id,
                "template_topic_id": template_topic_id,
                "question_id": question_id,
            }

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Delete TemplateQuestions for a Template
class DeleteTemplateQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, template_id):
        if request.method == "DELETE":
            get_object_or_404(Template, pk=template_id, deleted_at__isnull=True)
            template_questions = TemplateQuestion.objects.filter(template_id=template_id, deleted_at__isnull=True)
            template_questions.deleted_at = timezone.now()
            template_questions.deleted_by = request.user
            template_questions.save()

            return JsonResponse({"message": "TemplateQuestions deleted successfully"}, status=204)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all TemplateQuestions for a Template
class GetAllTemplateQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            try:
                template_questions = TemplateQuestion.objects.filter(
                    template_id=template_id, deleted_at__isnull=True
                ).select_related("question", "topic")
                # Using a dictionary to group by topics
                stages = {}
                for template_question in template_questions:
                    topic_name = template_question.topic.topics_text
                    if topic_name not in stages:
                        stages[topic_name] = {
                            "stage": topic_name,
                            "stageId": template_question.topic.id,
                            "questions": [],
                        }

                    question = template_question.question
                    stages[topic_name]["questions"].append(
                        {
                            "number": str(question.id),
                            "question": question.question_text,
                            "duration": f"{question.reply_time} min",
                            "competency": question.competency,
                            "rating": question.review,
                            "answer": question.guidelines,
                            "id": str(question.id),
                        }
                    )
                # Convert stages dictionary to a list
                stages_list = list(stages.values())

                return JsonResponse({"data": stages_list}, status=200, safe=False)
            except Template.DoesNotExist:
                error_response = {"error": "Template not found"}
                return JsonResponse(error_response, status=404)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


class GetAllQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            try:
                template_questions = TemplateQuestion.objects.filter(template_id=template_id, deleted_at__isnull=True)

                # Create a list of dictionaries containing information about each TemplateQuestion
                template_question_list = []
                for template_question in template_questions:
                    question = template_question.question  # Fetch the question details
                    template_question_list.append(
                        {
                            "template_id": template_id,
                            "template_topic_id": template_question.topic.id,
                            "question_id": question.id,
                            "question_text": question.question_text,
                            "guidelines": question.guidelines,
                            "reply_time": question.reply_time,
                            "competency": question.competency,
                            "difficulty": question.difficulty,
                            "review": question.review,
                            "created_at": question.created_at,
                            "updated_at": question.updated_at,
                        }
                    )

                return JsonResponse(template_question_list, status=200, safe=False)
            except Template.DoesNotExist:
                error_response = {"error": "Template not found"}
                return JsonResponse(error_response, status=404)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)
