from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import InterviewRound
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
            interviewer_id = data.get(
                "interviewer_id"
            )  # This is required according to the model, API not working unless this exists.

            if title:
                interview_round = InterviewRound.objects.create(
                    title=title,
                    candidate_id=candidate_id,
                    interviewer_id=interviewer_id,  # This is required according to the model, API not working unless this exists.
                )

                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "candidate_id": interview_round.candidate_id,
                    "interviewer_id": interview_round.interviewer_id,  # This is required according to the model, API not working unless this exists.
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
