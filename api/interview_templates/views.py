import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from company.models import Company
from question.models import Question
from question.serializers import QuestionSerializer
from user.models import CustomUser

from .models import Template, TemplateQuestion, TemplateTopic
from .serializers import TemplateQuestionSerializer, TemplatesSerializer, TemplateTopicSerializer


class TemplateTopicList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateTopicSerializer

    def get_queryset(self):
        queryset = TemplateTopic.objects.all()
        template = self.request.query_params.get("template")
        if template is not None:
            queryset = queryset.filter(template_id=template)
        return queryset


class TemplateTopicDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateTopicSerializer
    queryset = TemplateTopic.objects.all()


class TemplateQuestionsList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateQuestionSerializer

    def get_queryset(self):
        queryset = TemplateQuestion.objects.all()
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
        # Create a new Question object
        print(question_data)
        question_serializer = QuestionSerializer(data=question_data)
        print(question_serializer)
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
        print(template_question_data)
        template_question_serializer = TemplateQuestionSerializer(
            data=template_question_data, context={"request": request}
        )
        if template_question_serializer.is_valid():
            template_question_serializer.save()
            return JsonResponse(template_question_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse(template_question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateQuestionsDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplateQuestionSerializer
    queryset = TemplateQuestion.objects.all()


class TemplatesList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplatesSerializer
    queryset = Template.objects.all()


class TemplateDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TemplatesSerializer
    queryset = Template.objects.all()
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
                "company_id": company_id,
                "department_id": department_id,  # Include department ID in the response
            }

            return JsonResponse(response, status=201)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Update a Template
class UpdateTemplate(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, template_id):
        if request.method == "PUT":
            template = get_object_or_404(Template, pk=template_id)
            data = json.loads(request.body)

            role_title = data.get("role_title")
            location = data.get("location")
            company_id = data.get("company_id")
            interviewers_ids = data.get("interviewers")
            department_id = data.get("department_id")  # Include department field

            if role_title:
                template.role_title = role_title

            if location:
                template.location = location

            if company_id:
                company = get_object_or_404(Company, id=company_id)
                template.company = company

            if department_id is not None:  # Set department if provided
                template.department_id = department_id

            if interviewers_ids:
                interviewers = CustomUser.objects.filter(id__in=interviewers_ids)
                template.interviewers.set(interviewers)

            template.save()

            response = {
                "id": template.id,
                "role_title": template.role_title,
                "location": template.location,
                "company_id": template.company.id if template.company else None,
                "interviewers": [interviewer.id for interviewer in template.interviewers.all()],
                "department_title": template.department.title if template.department else None,
            }

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Read a Template
class ReadTemplate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            template = get_object_or_404(Template, pk=template_id)

            response = {
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

            return JsonResponse(response, status=200)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all Templates
class GetAllTemplates(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        templates = Template.objects.all()
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
            template = get_object_or_404(Template, pk=template_id)
            template.delete()

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
                    company_id=company,
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

    def get(self, request, template_topic_id):
        if request.method == "GET":
            template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)

            # Get the IDs of associated questions
            question_ids = template_topic.questions.values_list("id", flat=True)

            response = {
                "id": template_topic.id,
                "topics_text": template_topic.topics_text,
                "template_id": template_topic.template_id.id,
                "company_id": template_topic.company_id.id,
                "time": template_topic.time,
                "questions": list(question_ids),
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

    def delete(self, request, template_topic_id):
        if request.method == "DELETE":
            template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
            template_topic.delete()

            return JsonResponse({"message": "TemplateTopic deleted successfully"}, status=204)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all TemplateTopics
class GetAllTemplateTopics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            template_topics = TemplateTopic.objects.filter(template_id=template_id)

            template_topic_list = []

            for topic in template_topics:
                # Get the IDs of associated questions for each topic

                template_topic_data = {
                    "id": topic.id,
                    "topics_text": topic.topics_text,
                    "template_id": topic.template_id.id,
                    "company_id": topic.company_id.id,
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


# Read TemplateQuestions for a Template
class ReadTemplateQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            template = get_object_or_404(Template, pk=template_id)
            template_questions = TemplateQuestion.objects.filter(template_id=template_id)

            template_topic_ids = list(template_questions.values_list("template_topic_id__id", flat=True))
            question_id = template_questions.first().question.id

            response = {
                "template_id": template_id,
                "template_topic_ids": template_topic_ids,
                "question_id": question_id,
            }

            return JsonResponse(response, status=200)
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
            template = get_object_or_404(Template, pk=template_id)
            template_questions = TemplateQuestion.objects.filter(template_id=template_id)
            template_questions.delete()

            return JsonResponse({"message": "TemplateQuestions deleted successfully"}, status=204)
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


# Get all TemplateQuestions for a Template
class GetAllTemplateQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            template = get_object_or_404(Template, pk=template_id)
            template_questions = TemplateQuestion.objects.filter(template_id=template_id).select_related(
                "question", "topic"
            )
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
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)


class GetAllQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        if request.method == "GET":
            template = get_object_or_404(Template, pk=template_id)
            template_questions = TemplateQuestion.objects.filter(template_id=template_id)

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
        else:
            error_response = {"error": "Invalid request method"}
            return JsonResponse(error_response, status=405)
