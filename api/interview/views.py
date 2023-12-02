import json

import boto3
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from interview_templates.models import TemplateQuestion

from .models import Candidate, InterviewRound, InterviewRoundQuestion
from .serializers import CandidateSerializer, InterviewRoundQuestionSerializer, InterviewRoundSerializer


class InterviewRoundList(generics.ListCreateAPIView):
    serializer_class = InterviewRoundSerializer
    queryset = InterviewRound.objects.all()


class InterviewRoundDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewRoundSerializer
    queryset = InterviewRound.objects.all()


class CandidateList(generics.ListCreateAPIView):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()


class CandidateDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()


class InterviewRoundQuestionList(generics.ListCreateAPIView):
    serializer_class = InterviewRoundQuestionSerializer

    def get_queryset(self):
        queryset = InterviewRoundQuestion.objects.all()
        interviewRound = self.request.query_params.get("interviewRound")  # Correct query parameter
        if interviewRound is not None:
            queryset = queryset.filter(interview_round_id=interviewRound)
        return queryset


class InterviewRoundVideo(generics.ListCreateAPIView):
    serializer_class = InterviewRoundQuestionSerializer

    def get_queryset(self):
        queryset = InterviewRoundQuestion.objects.all()
        interviewRound = self.request.query_params.get("interviewRound")  # Correct query parameter
        if interviewRound is not None:
            queryset = queryset.filter(interview_round_id=interviewRound)
        return queryset


class InterviewRoundQuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterviewRoundQuestionSerializer
    queryset = InterviewRoundQuestion.objects.all()


class CreateInterviewRound(CreateAPIView):
    # permission_classes = [IsAuthenticated, isAdminRole, isInterviewerRole]
    def create(self, request, *args, **kwargs):
        try:
            interviewer_id = request.user.id
            data = request.data
            title = data.get("title")

            template_id = data.get("template_id")
            room_id = data.get("room_id")
            print(room_id, title, template_id)
            if title:
                interview_round = InterviewRound.objects.create(
                    title=title,
                    template_id=template_id,
                    interviewer_id=interviewer_id,
                    meeting_room_id=room_id,
                )
                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "template_id": interview_round.template_id,
                    "interviewer_id": interview_round.interviewer_id,
                    "meeting_room_id": interview_round.meeting_room_id,
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
            "template_id": interview_round.template_id,
            # "description": interview_round.description,
            "room_id": interview_round.meeting_room_id,
            # "video_uri": interview_round.video_uri, ## placehodler, this needs to be updated later.
        }
        return JsonResponse(response)
    except InterviewRound.DoesNotExist:
        error_response = {"error": "InterviewRound not found"}
        return JsonResponse(error_response, status=404)


@csrf_exempt
def get_interview_round_by_room_id(request, room_id):
    try:
        interview_round = InterviewRound.objects.get(meeting_room_id=room_id)
        response = {
            "id": interview_round.id,
            "title": interview_round.title,
            "candidate_id": interview_round.candidate_id,
            # "description": interview_round.description,
            "room_id": interview_round.meeting_room_id,
            # "video_uri": interview_round.video_uri, ## placehodler, this needs to be updated later.
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
                # "description": interview_round.description,
            }
        )

    return JsonResponse(response, safe=False)


def get_interview_round_question(request, interview_round_id, question_id):
    try:
        interview_round_question = InterviewRoundQuestion.objects.get(
            interview_round_id=interview_round_id, question_id=question_id
        )
        response_data = {
            "id": interview_round_question.id,
            "interview_round_id": interview_round_question.interview_round_id,
            "question_id": interview_round_question.question_id,
            "rating": interview_round_question.rating,
            "created_at": interview_round_question.created_at,
            "updated_at": interview_round_question.updated_at,
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


def get_video_duration(file_name, bucket_name):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )

    # Generate a temporary URL for the video file
    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": bucket_name,
            "Key": file_name,
        },
    )

    # Download the video and get its duration
    clip = VideoFileClip(url)  # noqa: F821
    duration = clip.duration
    minutes = int(duration // 60)
    seconds = int(duration % 60)
    duration_string = f"{minutes:02d}:{seconds:02d}"
    return duration_string


def get_interview_round_video(request, interview_round_id):
    try:
        interview_round = InterviewRound.objects.get(id=interview_round_id)
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        directory_path = f"teamsinta/{interview_round.meeting_room_id}/"
        bucket_name = "team-sinta"

        # List objects in the directory
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=directory_path)

        if "Contents" in response:
            # Get the file name (assuming there's only one file in the directory)
            file_name = response["Contents"][0]["Key"]

            # Generate signed URL for the file
            url = s3.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": file_name,
                },
            )

            return JsonResponse({"url": url}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
    except InterviewRound.DoesNotExist:
        error_response = {"error": "InterviewRound not found"}
        return JsonResponse(error_response, status=404)


class RateInterviewRoundQuestion(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            interview_round_id = request.data.get("interview_round_id")
            question_id = request.data.get("question_id")
            rating = request.data.get("rating")

            interview_round = InterviewRound.objects.get(pk=interview_round_id)
            template_question = TemplateQuestion.objects.get(question_id=question_id)

            (
                interview_round_question,
                created,
            ) = InterviewRoundQuestion.objects.get_or_create(
                interview_round=interview_round,
                question=template_question,
                defaults={"rating": rating},
            )

            if not created:
                interview_round_question.rating = rating
                interview_round_question.save()

            response = {
                "message": "Question rated successfully",
                "interview_round_question_id": interview_round_question.id,
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
