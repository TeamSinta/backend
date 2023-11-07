from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from interview_templates.models import TemplateQuestion
from .models import InterviewRound, InterviewRoundQuestion
import json
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from app.permissions import isAdminRole,isInterviewerRole
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status

class CreateInterviewRound(CreateAPIView):
    # permission_classes = [IsAuthenticated, isAdminRole, isInterviewerRole]
    def create(self, request, *args, **kwargs):
        try:
            interviewer_id = request.user.id
            data = request.data
            title = data.get("title")
            candidate_id = data.get("candidate_id")
            template_id = data.get("template_id")
            if title:
                interview_round = InterviewRound.objects.create(
                    title=title,
                    template_id=template_id,
                    candidate_id=candidate_id,
                    interviewer_id=interviewer_id
                )
                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "candidate_id": interview_round.candidate_id,
                    "template_id": interview_round.template_id,
                    "interviewer_id":interview_round.interviewer_id
                }
                return Response(response, status=status.HTTP_201_CREATED)
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
            ## "video_uri": interview_round.video_uri, ## placehodler, this needs to be updated later.
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


def get_interview_round_question(request, interview_round_id, question_id):
    try:
        interview_round_question = InterviewRoundQuestion.objects.get(
            interview_round_id=interview_round_id, 
            question_id=question_id
        )
        response_data = {
            "id": interview_round_question.id,
            "interview_round_id": interview_round_question.interview_round_id,
            "question_id": interview_round_question.question_id,
            "rating": interview_round_question.rating,
            "created_at": interview_round_question.created_at,
            "updated_at": interview_round_question.updated_at
        }
        return JsonResponse(response_data, status=200)
    except InterviewRoundQuestion.DoesNotExist:
        return JsonResponse({"error": "Interview round question not found"}, status=404)

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

class RateInterviewRoundQuestion(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            interview_round_id = request.data.get("interview_round_id")
            question_id = request.data.get("question_id")
            rating = request.data.get("rating")

            interview_round = InterviewRound.objects.get(pk=interview_round_id)
            template_question = TemplateQuestion.objects.get(pk=question_id)

            interview_round_question, created = InterviewRoundQuestion.objects.get_or_create(
                interview_round=interview_round,
                question=template_question,
                defaults={"rating": rating}
            )

            if not created:
                interview_round_question.rating = rating
                interview_round_question.save()

            response = {
                "message": "Question rated successfully",
                "interview_round_question_id": interview_round_question.id
            }

            return Response(response, status=status.HTTP_201_CREATED)

        except InterviewRound.DoesNotExist:
            return Response({"error": "Interview round not found"}, status=status.HTTP_404_NOT_FOUND)

        except TemplateQuestion.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

 

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
