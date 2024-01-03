from typing import Dict, List

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.utils import seconds_to_minutes
from interview.models import InterviewRound
from transcription.jobs.get_transcripts import generate_transcriptions_from_assembly
from user.models import CustomUser


def send_transcription_completed_message(interview_round_id):
    channel_layer = get_channel_layer()
    group_name = f"interview_{interview_round_id}"
    print(group_name)
    # Trigger an event to notify the WebSocket group
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "transcription_generation_completed",
            "message": "Transcription generation completed for round!",
        },
    )


class QuestionTranscriptView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest, interview_round_id: int) -> Response:
        transcripts = self._get_transcripts_for_questions(interview_round_id)
        return Response({"data": transcripts}, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, interview_round_id: int) -> Response:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def _get_transcripts_for_questions(self, interview_round_id: int) -> List[Dict]:
        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        tc = interview_round.transcript_chunks.all().order_by("start_time")

        seen = set()
        transcripts = []
        for chunk in tc:
            # Cross-reference the username with the User model to get the profile_picture URL
            user = CustomUser.objects.filter(username=chunk.speaker.username).first()
            profile_picture = user.profile_picture if user else None

            transcript_entry = (
                chunk.speaker.username,
                chunk.chunk_text,
                seconds_to_minutes(chunk.start_time),
                profile_picture,
            )

            if transcript_entry not in seen:
                seen.add(transcript_entry)
                transcripts.append(
                    {
                        "name": transcript_entry[0],
                        "speech": transcript_entry[1],
                        "timestamp": transcript_entry[2],
                        "picture": transcript_entry[3],  # Use profile_picture from the User model
                    }
                )

        return transcripts


class GenerateTranscript(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest, interview_round_id: int) -> Response:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request: HttpRequest, *args, **kwargs):
        # Retrieve the interview_round_id from the request body
        interview_round_id = request.POST.get("interview_round_id")

        # Get the file from the request
        video_file = request.FILES.get("video_file")

        # Ensure that a file is provided
        if not video_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Save the file to a temporary location
        video_path = "/tmp/interview_video.mp4"  # Change this path as needed
        with open(video_path, "wb") as f:
            for chunk in video_file.chunks():
                f.write(chunk)

        # Set the video_uri in the InterviewRound model
        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        interview_round.video_uri = video_path
        interview_round.save()

        # Generate transcriptions
        generate_transcriptions_from_assembly(interview_round_id, video_path)

        return Response(status=status.HTTP_200_OK)


class AnnounceTranscriptResult(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: HttpRequest, *args, **kwargs):
        # Retrieve the interview_round_id from the request body
        interview_round_id = request.POST.get("interview_round_id")

        send_transcription_completed_message(interview_round_id)

        return Response(status=status.HTTP_200_OK)
