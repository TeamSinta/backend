from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Template, TemplateTopic, TemplateQuestion
from user.models import Company, CustomUser
from question.models import Question
import json
from django.urls import reverse


# CRUD for Templates, TemplateTopics, TemplateInterviewers, & TemplateQuestions
# Create a Template
@csrf_exempt
def create_template(request):
    if request.method == "POST":
        data = json.loads(request.body)
        role_title = data.get("role_title")
        location = data.get("location")  # Keep the location field
        user_ids = data.get("interviewer_ids")  # Rename the field
        company_id = data.get("company_id")

        company = Company.objects.get(id=company_id)
        interviewers = CustomUser.objects.filter(id__in=user_ids)  # Rename the field

        template = Template.objects.create(
            role_title=role_title,
            location=location,  # Keep the location field
            company=company,
        )

        template.interviewers.set(interviewers)  # Use set to add interviewers

        response = {
            "id": template.id,
            "role_title": template.role_title,
            "location": template.location,  # Keep the location field
            "interviewer_ids": user_ids,  # Rename the field
            "company_id": company_id,
        }

        return JsonResponse(response, status=201)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Update a Template
@csrf_exempt
def update_template(request, template_id):
    if request.method == "PUT":
        template = get_object_or_404(Template, pk=template_id)
        data = json.loads(request.body)

        role_title = data.get("role_title")
        location = data.get("location")
        company_id = data.get("company_id")
        interviewers_ids = data.get("interviewers")

        if role_title:
            template.role_title = role_title

        if location:
            template.location = location

        if company_id:
            company = get_object_or_404(Company, id=company_id)
            template.company = company

        if interviewers_ids:
            interviewers = CustomUser.objects.filter(id__in=interviewers_ids)
            template.interviewers.set(interviewers)

        template.save()

        response = {
            "id": template.id,
            "role_title": template.role_title,
            "location": template.location,
            "user_id": template.user.id,
            "company_id": template.company.id,
            "interviewers": [
                interviewer.id for interviewer in template.interviewers.all()
            ],
        }

        return JsonResponse(response, status=200)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Read a Template
@csrf_exempt
def read_template(request, template_id):
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
                    "profile_picture": request.build_absolute_uri(
                        interviewer.profile_picture
                    )
                    if interviewer.profile_picture
                    else None
                    # Convert the image URL to an absolute URL
                }
                for interviewer in template.interviewers.all()
            ],
        }

        return JsonResponse(response, status=200)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Get all Templates
@csrf_exempt
def get_all_templates(request):
    if request.method == "GET":
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
                        "profile_picture": request.build_absolute_uri(
                            interviewer.profile_picture
                        )
                        if interviewer.profile_picture
                        else None
                        # Convert the image URL to an absolute URL
                    }
                    for interviewer in template.interviewers.all()
                ],
            }
            template_list.append(template_data)

        return JsonResponse(template_list, safe=False, status=200)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Delete a Template
@csrf_exempt
def delete_template(request, template_id):
    if request.method == "DELETE":
        template = get_object_or_404(Template, pk=template_id)
        template.delete()

        return JsonResponse({"message": "Template deleted successfully"}, status=204)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Create a TemplateTopic
@csrf_exempt
def create_template_topic(request, template_id):
    if request.method == "POST":
        data = json.loads(request.body)
        topics_text = data.get("topics_text")
        company_id = data.get("company_id")
        time = data.get("time", 1)  # Default to 1 if 'time' is not provided
        question_ids = data.get(
            "questions", []
        )  # Assuming 'questions' is a list of question IDs.

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
            template_topic.questions.set(question_ids)

            response = {
                "id": template_topic.id,
                "topics_text": template_topic.topics_text,
                "template_id": template.id,
                "company_id": company.id,
                "time": template_topic.time,
                "questions": question_ids,
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
@csrf_exempt
def read_template_topic(request, template_topic_id):
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
@csrf_exempt
def update_template_topic(request, template_id, template_topic_id):
    if request.method == "PUT":
        template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
        data = json.loads(request.body)

        topics_text = data.get("topics_text")
        company_id = data.get("company_id")
        time = data.get("time")
        question_ids = data.get(
            "questions", []
        )  # Assuming 'questions' is a list of question IDs.

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
@csrf_exempt
def delete_template_topic(request, template_topic_id):
    if request.method == "DELETE":
        template_topic = get_object_or_404(TemplateTopic, pk=template_topic_id)
        template_topic.delete()

        return JsonResponse(
            {"message": "TemplateTopic deleted successfully"}, status=204
        )
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Get all TemplateTopics
@csrf_exempt
def get_all_template_topics(request, template_id):
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


# # Create a TemplateInterviewers
# @csrf_exempt
# def create_template_interviewers(request, template_id):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         interviewer_ids = data.get("interviewer_ids")

#         template = get_object_or_404(Template, pk=template_id)
#         interviewers = CustomUser.objects.filter(id__in=interviewer_ids)

#         # Create a TemplateInterviewers instance associated with the template
#         template_interviewers = TemplateInterviewers.objects.create(template_id=template)

#         # Add interviewers to the ManyToMany field
#         template_interviewers.interviewer.add(*interviewers)

#         response = {
#             "id": template_interviewers.id,
#             "template_id": template_id,
#             "interviewer_ids": interviewer_ids,
#         }

#         return JsonResponse(response, status=201)
#     else:
#         error_response = {"error": "Invalid request method"}
#         return JsonResponse(error_response, status=405)

# # Read TemplateInterviewers for a Template
# @csrf_exempt
# def read_template_interviewers(request, template_id):
#     if request.method == "GET":
#         template = get_object_or_404(Template, pk=template_id)
#         template_interviewers = TemplateInterviewers.objects.filter(template=template)

#         interviewer_ids = list(template_interviewers.values_list("interviewer__id", flat=True))

#         response = {
#             "template_id": template_id,
#             "interviewer_ids": interviewer_ids,
#         }

#         return JsonResponse(response, status=200)
#     else:
#         error_response = {"error": "Invalid request method"}
#         return JsonResponse(error_response, status=405)

# # Update TemplateInterviewers for a Template
# @csrf_exempt
# def update_template_interviewers(request, template_id):
#     if request.method == "PUT":
#         template = get_object_or_404(Template, pk=template_id)
#         data = json.loads(request.body)

#         interviewer_ids = data.get("interviewer_ids")

#         # Filter TemplateInterviewers based on the template
#         template_interviewers = TemplateInterviewers.objects.filter(template_id=template)

#         if template_interviewers.exists():
#             interviewers = CustomUser.objects.filter(id__in=interviewer_ids)

#             # Update the template and set interviewers
#             template_interviewers.update(template_id=template)
#             template_interviewers.first().interviewer.set(interviewers)

#             response = {
#                 "template_id": template_id,
#                 "interviewer_ids": interviewer_ids,
#             }

#             return JsonResponse(response, status=200)
#         else:
#             error_response = {"error": "TemplateInterviewers not found"}
#             return JsonResponse(error_response, status=404)
#     else:
#         error_response = {"error": "Invalid request method"}
#         return JsonResponse(error_response, status=405)

# # Delete TemplateInterviewers for a Template
# @csrf_exempt
# def delete_template_interviewers(request, template_id):
#     if request.method == "DELETE":
#         template = get_object_or_404(Template, pk=template_id)
#         template_interviewers = TemplateInterviewers.objects.filter(template=template)
#         template_interviewers.delete()

#         return JsonResponse({"message": "TemplateInterviewers deleted successfully"}, status=204)
#     else:
#         error_response = {"error": "Invalid request method"}
#         return JsonResponse(error_response, status=405)


# Get all TemplateInterviewers for a Template
# @csrf_exempt
# def get_all_template_interviewers(request, template_id):
#     if request.method == "GET":
#         template = get_object_or_404(Template, pk=template_id)
#         template_interviewers = TemplateInterviewers.objects.filter(
#             template_id=template
#         )
#         interviewer_ids = list(
#             template_interviewers.values_list("interviewer__id", flat=True)
#         )
#         response = {
#             "template_id": template_id,
#             "interviewer_ids": interviewer_ids,
#         }
#         return JsonResponse(response, status=200)
#     else:
#         error_response = {"error": "Invalid request method"}
#         return JsonResponse(error_response, status=405)


# Create a TemplateQuestion
@csrf_exempt
def create_template_question(request, template_id):
    if request.method == "POST":
        data = json.loads(request.body)
        template_topic_id = data.get("template_topic_id")
        question_id = data.get("question_id")

        template = get_object_or_404(Template, pk=template_id)
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

        return JsonResponse(response, status=201)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Read TemplateQuestions for a Template
@csrf_exempt
def read_template_questions(request, template_id):
    if request.method == "GET":
        template = get_object_or_404(Template, pk=template_id)
        template_questions = TemplateQuestion.objects.filter(template_id=template_id)

        template_topic_ids = list(
            template_questions.values_list("template_topic_id__id", flat=True)
        )
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
@csrf_exempt
def update_template_questions(request, template_id):
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
@csrf_exempt
def delete_template_questions(request, template_id):
    if request.method == "DELETE":
        template = get_object_or_404(Template, pk=template_id)
        template_questions = TemplateQuestion.objects.filter(template_id=template_id)
        template_questions.delete()

        return JsonResponse(
            {"message": "TemplateQuestions deleted successfully"}, status=204
        )
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Get all TemplateQuestions for a Template


@csrf_exempt
def get_all_template_questions(request, template_id):
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
