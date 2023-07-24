
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import (
    InterviewRound,
    Topic,
    InterviewRoundTopic,
    InterviewRoundInterviewer,
    InterviewRoundQuestion,
)
from question.models import Question
from user.models import Company
import json
from datetime import datetime


# InterviewRound
# Create Interview Round
@csrf_exempt
def create_interview_round(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            candidate_id = data.get("candidate_id")
            description = data.get("description")

            if title:
                interview_round = InterviewRound.objects.create(
                    title=title, candidate_id=candidate_id, description=description
                )

                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "candidate_id": interview_round.candidate_id,
                    "description": interview_round.description,
                }
                return JsonResponse(response)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Read Interview Round(:id)
@csrf_exempt
def get_interview_round(request, interview_round_id):
    try:
        interview_round = InterviewRound.objects.get(id=interview_round_id)
        response = {
            "id": interview_round.id,
            "title": interview_round.title,
            "candidate_id": interview_round.candidate_id,
            "description": interview_round.description,
        }
        return JsonResponse(response)
    except InterviewRound.DoesNotExist:
        error_response = {"error": "InterviewRound not found"}
        return JsonResponse(error_response, status=404)


# Read All Interview Rounds
def get_all_interview_rounds(request):
    interview_rounds = InterviewRound.objects.all()
    response = []

    for interview_round in interview_rounds:
        response.append(
            {
                "id": interview_round.id,
                "title": interview_round.title,
                "candidate_id": interview_round.candidate_id,
                "description": interview_round.description,
            }
        )

    return JsonResponse(response, safe=False)


# Update Interview Round


@csrf_exempt
def update_interview_round(request, interview_round_id):
    try:
        interview_round = InterviewRound.objects.get(id=interview_round_id)
    except InterviewRound.DoesNotExist:
        error_response = {"error": "InterviewRound not found"}
        return JsonResponse(error_response, status=404)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            title = data.get("title", interview_round.title)
            candidate_id = data.get("candidate_id", interview_round.candidate_id)
            description = data.get("description", interview_round.description)

            interview_round.title = title
            interview_round.candidate_id = candidate_id
            interview_round.description = description
            interview_round.save()

            response = {
                "id": interview_round.id,
                "title": interview_round.title,
                "candidate_id": interview_round.candidate_id,
                "description": interview_round.description,
            }
            return JsonResponse(response)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Delete Interview Round
@csrf_exempt
def delete_interview_round(request, interview_round_id):
    try:
        interview_round = InterviewRound.objects.get(id=interview_round_id)
        interview_round.delete()
        response = {"message": "InterviewRound deleted successfully"}
        return JsonResponse(response)
    except InterviewRound.DoesNotExist:
        error_response = {"error": "InterviewRound not found"}
        return JsonResponse(error_response, status=404)


# Topics
# Create Topics
@csrf_exempt
def create_topic(request):
    if request.method == "POST":
        # Get the JSON data from the request's body
        data = json.loads(request.body)

        # Access the data sent in the request
        topics_text = data.get("topics_text")
        company_id = data.get("company_id")

        # Retrieve the Company instance
        company = Company.objects.get(id=company_id)

        # Create a Topic instance
        topic = Topic.objects.create(topics_text=topics_text, company_id=company)

        # Create a response dictionary with the created topic data
        response = {
            "id": topic.id,
            "topics_text": topic.topics_text,
            "company_id": company_id,
        }

        # Return the response as JSON
        return JsonResponse(response)
    else:
        # Return an error response for invalid request method
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Read All Topics
def get_all_topics(request):
    if request.method == "GET":
        topics = Topic.objects.all()
        data = [
            {
                "id": topic.id,
                "topics_text": topic.topics_text,
                "company_id": topic.company_id.id,
            }
            for topic in topics
        ]
        return JsonResponse(data, safe=False)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Create Interview Round Topics
@csrf_exempt
def create_interview_round_topics(request, interview_round_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            topic_ids = data.get("topic_ids", [])

            # Create an InterviewRoundTopic instance
            interview_round_topics = InterviewRoundTopic.objects.create(
                interview_round_id=interview_round_id
            )

            # Add topics to the interview round
            if topic_ids:
                interview_round_topics.topic.add(*topic_ids)

            # Construct the response data
            response_data = {
                "id": interview_round_topics.id,
                "interview_round_id": interview_round_topics.interview_round_id,
                "topic_ids": list(
                    interview_round_topics.topic.values_list("id", flat=True)
                ),
                "created_at": interview_round_topics.created_at,
                "updated_at": interview_round_topics.updated_at,
            }

            return JsonResponse(response_data, status=201)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Update Interview Round Topics
@csrf_exempt
def update_interview_round_topics(
    request, interview_round_id, interview_round_topics_id
):
    try:
        interview_round_topics = InterviewRoundTopic.objects.get(
            id=interview_round_topics_id
        )
    except InterviewRoundTopic.DoesNotExist:
        error_response = {"error": "InterviewRoundTopic not found"}
        return JsonResponse(error_response, status=404)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            topic_ids = data.get("topic_ids", [])

            # Update topics of the interview round
            interview_round_topics.topic.set(topic_ids)

            # Construct the response data
            response_data = {
                "id": interview_round_topics.id,
                "interview_round_id": interview_round_id,
                "topic_ids": list(
                    interview_round_topics.topic.values_list("id", flat=True)
                ),
                "created_at": interview_round_topics.created_at,
                "updated_at": interview_round_topics.updated_at,
            }

            return JsonResponse(response_data)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Interviewers
# Create Interviewers
@csrf_exempt
def create_interview_round_interviewer(request, interview_round_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            interviewer_id = data.get("interviewer_id")

            # Create an InterviewerRoundInterviewer instance
            interview_round_interviewer = InterviewRoundInterviewer.objects.create(
                interviewer_id=interviewer_id, interview_round_id=interview_round_id
            )

            # Construct the response data
            response_data = {
                "id": interview_round_interviewer.id,
                "interviewer_id": interview_round_interviewer.interviewer_id,
                "interview_round_id": interview_round_interviewer.interview_round_id,
            }

            return JsonResponse(response_data, status=201)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Read Interviewers
def get_all_interview_round_interviewers(request, interview_round_id):
    if request.method == "GET":
        interview_round_interviewers = InterviewRoundInterviewer.objects.filter(
            interview_round_id=interview_round_id
        )
        data = [
            {
                "id": interview_round_interviewer.id,
                "interviewer_id": interview_round_interviewer.interviewer_id,
                "interview_round_id": interview_round_interviewer.interview_round_id,
            }
            for interview_round_interviewer in interview_round_interviewers
        ]
        return JsonResponse(data, safe=False)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Update Interviewers
@csrf_exempt
def update_interview_round_interviewer(request, interview_round_id, interviewer_id):
    try:
        interview_round_interviewer = InterviewRoundInterviewer.objects.get(
            id=interviewer_id
        )
    except InterviewRoundInterviewer.DoesNotExist:
        error_response = {"error": "Interview Round Interviewer not found"}
        return JsonResponse(error_response, status=404)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            interviewer_id = data.get("interviewer_id")

            # Update the InterviewerRoundInterviewer instance
            interview_round_interviewer.interviewer_id = interviewer_id
            interview_round_interviewer.save()

            # Construct the response data
            response_data = {
                "id": interview_round_interviewer.id,
                "interviewer_id": interview_round_interviewer.interviewer_id,
                "interview_round_id": interview_round_interviewer.interview_round_id,
            }

            return JsonResponse(response_data)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Delete Interviewers
@csrf_exempt
def delete_interview_round_interviewer(request, interview_round_interviewer_id):
    try:
        interview_round_interviewer = InterviewRoundInterviewer.objects.get(
            id=interview_round_interviewer_id
        )
    except InterviewRoundInterviewer.DoesNotExist:
        error_response = {"error": "InterviewerRoundInterviewer not found"}
        return JsonResponse(error_response, status=404)

    if request.method == "DELETE":
        interview_round_interviewer.delete()
        return JsonResponse(
            {"message": "InterviewerRoundInterviewer deleted successfully"}
        )
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# InterviewQuestions


# Create Interview Round Questions
@csrf_exempt
def create_interview_round_question(request, interview_round_id):
    if request.method == "POST":
        # Extract data from the request body
        payload = json.loads(request.body)
        interview_round_topic_ids = payload.get("interview_round_topic_ids", [])
        question_id = payload.get("question_id")

        # Retrieve the interview round object
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)

        # Retrieve the interview round topics
        interview_round_topics = InterviewRoundTopic.objects.filter(
            id__in=interview_round_topic_ids
        )

        # Retrieve the question object
        question = get_object_or_404(Question, id=question_id)

        # Create a new InterviewRoundQuestion object
        interview_round_question = InterviewRoundQuestion()
        interview_round_question.interview_round = interview_round
        interview_round_question.question = question
        interview_round_question.created_at = datetime.now()
        interview_round_question.updated_at = datetime.now()

        # Save the interview round question to the database
        interview_round_question.save()

        # Associate interview round topics with the interview round question
        interview_round_question.interview_round_topics.set(interview_round_topics)

        # Return a JSON response
        return JsonResponse(
            {
                "status": "success",
                "message": "Interview round question created successfully",
            }
        )
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


# Read Interview Round Questions
def get_all_interview_round_questions(request, interview_round_id):
    if request.method == "GET":
        # Retrieve all interview round questions for the specified interview round
        interview_round_questions = InterviewRoundQuestion.objects.filter(
            interview_round_id=interview_round_id
        )

        # Prepare the data to be returned
        data = []
        for interview_round_question in interview_round_questions:
            data.append(
                {
                    "id": interview_round_question.id,
                    "interview_round_id": interview_round_question.interview_round_id,
                    "interview_round_topic_ids": [
                        topic.id
                        for topic in interview_round_question.interview_round_topics.all()
                    ],
                    "question_id": interview_round_question.question_id,
                    "created_at": interview_round_question.created_at,
                    "updated_at": interview_round_question.updated_at,
                }
            )

        # Return a JSON response
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


# Update Interview Round Question
@csrf_exempt
def update_interview_round_question(request, interview_round_question_id):
    try:
        interview_round_question = InterviewRoundQuestion.objects.get(
            id=interview_round_question_id
        )
    except InterviewRoundQuestion.DoesNotExist:
        error_response = {"error": "InterviewRoundQuestion not found"}
        return JsonResponse(error_response, status=404)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            interview_round_topics_id = data.get("interview_round_topics_id")

            # Update interview round topics of the question
            if interview_round_topics_id:
                interview_round_topics = InterviewRoundTopic.objects.get(
                    id=interview_round_topics_id
                )
                interview_round_question.interview_round_topics.clear()
                interview_round_question.interview_round_topics.add(
                    interview_round_topics
                )

            # Construct the response data
            response_data = {
                "id": interview_round_question.id,
                "interview_round_id": interview_round_question.interview_round_id,
                "interview_round_topics_id": list(
                    interview_round_question.interview_round_topics.values_list(
                        "id", flat=True
                    )
                ),
                "question_id": interview_round_question.question_id,
                "created_at": interview_round_question.created_at,
                "updated_at": interview_round_question.updated_at,
            }

            return JsonResponse(response_data)
        except json.JSONDecodeError:
            error_response = {"error": "Invalid JSON data."}
            return JsonResponse(error_response, status=400)
        except Exception as e:
            error_response = {"error": str(e)}
            return JsonResponse(error_response, status=400)
    else:
        error_response = {"error": "Invalid request method"}
        return JsonResponse(error_response, status=405)


# Delete Interview Round Questions
@csrf_exempt
def delete_interview_round_question(
    request, interview_round_id, interview_round_topics_id, interview_round_question_id
):
    try:
        interview_round_question = InterviewRoundQuestion.objects.get(
            id=interview_round_question_id
        )
        interview_round_question.delete()

        return JsonResponse({"message": "InterviewRoundQuestion deleted successfully"})
    except InterviewRoundQuestion.DoesNotExist:
        error_response = {"error": "InterviewRoundQuestion not found"}
        return JsonResponse(error_response, status=404)
    except Exception as e:
        error_response = {"error": str(e)}
        return JsonResponse(error_response, status=400)
>>>>>>> f8c84a4ad48cd4118a939b04ee206b8c60ee4e2b
