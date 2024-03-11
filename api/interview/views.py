import json
import os
from datetime import *

import boto3
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from june import analytics
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Company
from interview_templates.models import Template, TemplateQuestion
from new_transcription.utils import post_questions_to_interview_round
from question_response.models import InterviewerFeedback
from user.models import UserCompanies
from user.serializers import CustomUserSerializer

from .models import Candidate, InterviewRound, InterviewRoundQuestion
from .serializers import (
    CandidateSerializer,
    InterviewRoundQuestionSerializer,
    InterviewRoundSerializer,
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


class InterviewRoundList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRoundSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = InterviewRound.objects.filter(company=company_id)
        return queryset


class InterviewRoundDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRoundSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = InterviewRound.objects.filter(company=company_id)
        return queryset


class CandidateList(BaseDeleteInstance, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()

    def get_queryset(self):
        queryset = Candidate.objects.filter(deleted_at__isnull=True)
        return queryset


class CandidateDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CandidateSerializer

    def get_queryset(self):
        queryset = Candidate.objects.filter(deleted_at__isnull=True)
        return queryset


class InterviewRoundQuestionList(BaseDeleteInstance, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRoundQuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = InterviewRoundQuestion.objects.filter(company_id=company_id, deleted_at__isnull=True)
        interview_round = self.request.query_params.get("interviewRound")  # Correct query parameter
        if interview_round is not None:
            queryset = queryset.filter(interview_round_id=interview_round)
        return queryset


class InterviewRoundVideo(BaseDeleteInstance, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRoundQuestionSerializer

    def get_queryset(self):
        queryset = InterviewRoundQuestion.objects.filter(deleted_at__isnull=True)
        interview_round = self.request.query_params.get("interviewRound")  # Correct query parameter
        if interview_round is not None:
            queryset = queryset.filter(interview_round_id=interview_round)
        return queryset


class InterviewRoundQuestionDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRoundQuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = InterviewRoundQuestion.objects.filter(company_id=company_id, deleted_at__isnull=True)
        return queryset


class CreateInterviewRound(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewRound

    def create(self, request, *args, **kwargs):
        try:
            interviewer_id = request.user.id
            data = request.data
            title = data.get("title")
            candidate_id = data.get("candidate_id")
            template_id = data.get("template_id")
            room_id = data.get("room_id")
            user_id = data.get("user_id")
            company_id = data.get("company_id")

            company = get_object_or_404(Company, id=company_id)

            if title:
                interview_round = InterviewRound.objects.create(
                    title=title,
                    template_id=template_id,
                    interviewer_id=interviewer_id,
                    meeting_room_id=room_id,
                    candidate_id=candidate_id,
                    user_id=user_id,
                    company=company,
                )
                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "template_id": interview_round.template_id,
                    "candidate_id": interview_round.candidate_id,
                    "interviewer_id": interview_round.interviewer_id,
                    "meeting_room_id": interview_round.meeting_room_id,
                }
                user_id = self.request.user.id
                analytics.identify(user_id=str(user_id), traits={"email": self.request.user.email})
                analytics.track(user_id=str(user_id), event="interview_started")
                return Response(response, status=status.HTTP_201_CREATED)
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Read Interview Round(:id)
class InterviewRoundGet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, interview_round_id):
        try:
            interview_round = InterviewRound.objects.get(
                id=interview_round_id,
                deleted_at__isnull=True,
            )
            candidate_name = interview_round.candidate.name if interview_round.candidate else None
            interviewer = CustomUserSerializer(interview_round.interviewer).data
            formatted_date = interview_round.created_at.strftime("%B %d, %Y")

            template = Template.objects.filter(id=interview_round.template_id).first()
            department_name = template.department.title if template and template.department else None
            template_title = template.role_title if template else None

            response = {
                "id": interview_round.id,
                "title": interview_round.title,
                "candidate_id": interview_round.candidate_id,
                "candidate_name": candidate_name,
                "interviewer": interviewer,
                "template_id": interview_round.template_id,
                "template_title": template_title,  # Include template's title
                "department_name": department_name,  # Include department's name
                "thumbnail_uri": interview_round.thumbnail.url if interview_round.thumbnail else None,
                "created_at": formatted_date,
                "decision": interview_round.decision_hire,
                "room_id": interview_round.meeting_room_id,
                "video_uri": interview_round.video_uri,
                "icon": interview_round.icon,
            }
            return JsonResponse(response)
        except InterviewRound.DoesNotExist:
            error_response = {"error": "Interview round not found"}
            return JsonResponse(error_response, status=404)


class InterviewRoundByRoomID(APIView):
    def get(self, request, room_id):
        try:
            # user_company = get_object_or_404(UserCompanies, user=self.request.user)
            # company_id = user_company.company_id
            interview_round = InterviewRound.objects.get(meeting_room_id=room_id, deleted_at__isnull=True)
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
class InterviewRoundListAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        interview_rounds = InterviewRound.objects.filter(company=company_id)
        response = []

        for interview_round in interview_rounds:
            candidate_name = interview_round.candidate.name  # Adjust based on your Candidate model
            # created_at_natural = naturaltime(interview_round.created_at)
            response.append(
                {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "candidate_id": interview_round.candidate_id,
                    "candidate_name": candidate_name,
                    "created_at": interview_round.created_at,
                    "video_uri": interview_round.video_uri,
                    "thumbnail_uri": interview_round.thumbnail.url if interview_round.thumbnail else None,
                    "icon": interview_round.icon,
                }
            )

        return JsonResponse(response, safe=False)


class InterviewRoundQuestionDetailGet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, interview_round_id, question_id):
        try:
            interview_round_question = InterviewRoundQuestion.objects.get(
                interview_round_id=interview_round_id, question_id=question_id, deleted_at__isnull=True
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
class UpdateInterviewRound(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, interview_round_id):
        try:
            return InterviewRound.objects.get(id=interview_round_id, deleted_at__isnull=True)
        except InterviewRound.DoesNotExist:
            return None

    def put(self, request, interview_round_id):
        interview_round = self.get_object(interview_round_id)
        if not interview_round:
            error_response = {"error": "InterviewRound not found"}
            return JsonResponse(error_response, status=404)

        if request.method == "PUT":
            try:
                data = json.loads(request.body)
                for key, value in data.items():
                    if hasattr(interview_round, key):
                        setattr(interview_round, key, value)

                interview_round.save()

                response = {
                    "id": interview_round.id,
                    "title": interview_round.title,
                    "candidate_id": interview_round.candidate_id,
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


class GetInterviewRoundVideo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, interview_round_id):
        try:
            interview_round = InterviewRound.objects.get(id=interview_round_id, deleted_at__isnull=True)
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
            return JsonResponse(error_response, status=status.HTTP_404_NOT_FOUND)


class RateInterviewRoundQuestion(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            interview_round_id = request.data.get("interview_round_id")
            question_id = request.data.get("question_id")
            rating = request.data.get("rating")

            interview_round = InterviewRound.objects.get(pk=interview_round_id, deleted_at__isnull=True)
            template_question = TemplateQuestion.objects.get(question_id=question_id, deleted_at__isnull=True)

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
class DeleteInterviewRound(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, interview_round_id):
        try:
            interview_round = InterviewRound.objects.get(id=interview_round_id, deleted_at__isnull=True)
            interview_round.deleted_at = timezone.now()
            interview_round.deleted_by = request.user
            interview_round.save()
            response = {"message": "InterviewRound deleted successfully"}
            return JsonResponse(response)
        except InterviewRound.DoesNotExist:
            error_response = {"error": "InterviewRound not found"}
            return JsonResponse(error_response, status=404)


class GetTranscriptFromS3(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, interview_round_id):
        try:
            interview_round = InterviewRound.objects.get(id=interview_round_id, deleted_at__isnull=True)
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
                transcript_file = None
                # Loop through the files in the directory to find the transcript JSON file
                for file in response["Contents"]:
                    if file["Key"].endswith(".json"):
                        transcript_file = file["Key"]
                        break

                if transcript_file:
                    # Instead of generating a signed URL, download the file content
                    obj = s3.get_object(Bucket=bucket_name, Key=transcript_file)
                    # Read the file's content and parse it as JSON
                    transcript_content = json.loads(obj["Body"].read())
                    return JsonResponse(transcript_content, status=status.HTTP_200_OK, safe=False)
                else:
                    return JsonResponse({"error": "Transcript file not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return JsonResponse({"error": "No files found in the directory"}, status=status.HTTP_404_NOT_FOUND)
        except InterviewRound.DoesNotExist:
            return JsonResponse({"error": "InterviewRound not found"}, status=status.HTTP_404_NOT_FOUND)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Error decoding the transcript file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CheckInterviewRoundContentView(APIView):
    """
    Check if an interview round has recordings, notes, or ratings, and delete it if empty.
    """

    def get_object(self, pk):
        try:
            return InterviewRound.objects.get(pk=pk)
        except InterviewRound.DoesNotExist:
            error_response = {"error": "InterviewRound not found"}
            return JsonResponse(error_response, status=404)

    def get(self, request, round_id):
        interview_round = self.get_object(round_id)
        has_notes = InterviewerFeedback.objects.filter(interview_round_id=round_id).exists()
        has_ratings = InterviewRoundQuestion.objects.filter(interview_round_id=round_id).exists()

        if not (has_notes or has_ratings):
            interview_round.delete()
            return Response({"message": "Interview round deleted due to lack of content."})

        return Response({"hasContent": True})


def post_questions_to_interview_round_view(request, interview_round_id):
    result = post_questions_to_interview_round(interview_round_id)
    if result["status"] == "success":
        return JsonResponse(result, status=200)
    else:
        error_status = 404 if result["message"] == "Interview round not found." else 500
        return JsonResponse(result, status=error_status)
