from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transcription.models import TranscriptChunk
from interview.models import InterviewRound, Candidate
from pgvector.django import CosineDistance
from app.utils import seconds_to_minutes
from typing import List, Dict
from django.shortcuts import get_object_or_404
from user.models import CustomUser
from interview.models import InterviewRound
from django.http import HttpRequest
from transcription.jobs.get_transcripts import generate_transcriptions_from_assembly
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType


class QuestionTranscriptView(APIView):
    def get(self, request: HttpRequest, interview_round_id: int) -> Response:
        transcripts = self._get_transcripts_for_questions(interview_round_id)
        return Response({"data": transcripts}, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, interview_round_id: int) -> Response:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def _get_transcripts_for_questions(self, interview_round_id: int) -> List[Dict]:
        question_start_times = []  # (question, start_time)
        interview_round_transcription = []
        count = 0

        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        interview_questions = interview_round.interview_round_questions.all()
        tc = interview_round.transcript_chunks.all()

        for q in interview_questions:
            template_question = q.question  # Access the related TemplateQuestion
            question = template_question.question  # Access the related Question
            asked_question = (
                tc.filter(
                    Q(
                        speaker_content_type=ContentType.objects.get_for_model(
                            CustomUser
                        ),
                        speaker_object_id=interview_round.interviewer.id,
                    )
                    | Q(
                        speaker_content_type=ContentType.objects.get_for_model(
                            Candidate
                        ),
                        speaker_object_id=interview_round.candidate.id,
                    )
                )
                .order_by(CosineDistance("embedding", question.embedding))
                .first()
            )
            question_start_times.append((question, asked_question.start_time - 1))

        question_start_times.sort(key=lambda x: x[1])

        for i in range(1, len(question_start_times)):
            question_transcript = []
            duration = None
            count += 1
            question = question_start_times[i - 1][0]

            if tc is not None:
                relevant_question_chunks = tc.filter(
                    start_time__gte=question_start_times[i - 1][1],
                    start_time__lte=question_start_times[i][1],
                )

                if len(relevant_question_chunks) > 0:
                    duration_start = seconds_to_minutes(
                        relevant_question_chunks.first().start_time
                    )
                    duration_end = seconds_to_minutes(
                        relevant_question_chunks.last().end_time
                    )
                    duration = f"{duration_start} - {duration_end}"

                    for chunk in relevant_question_chunks:
                        question_transcript.append(
                            {
                                "name": chunk.speaker.username,
                                "speech": chunk.chunk_text,
                                "timestamp": seconds_to_minutes(chunk.start_time),
                            }
                        )

            question_transcript = sorted(
                question_transcript, key=lambda x: x["timestamp"]
            )

            interview_round_transcription.append(
                {
                    "index": count,
                    "question": question.question_text,
                    "duration": duration,
                    "transcription": question_transcript[:],
                }
            )

        return interview_round_transcription


class GenerateTranscript(APIView):
    def get(self, request: HttpRequest, interview_round_id: int) -> Response:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request: HttpRequest, *args, **kwargs):
        # Retrieve the interview_round_id from the request body
        interview_round_id = request.POST.get("interview_round_id")

        # Get the file from the request
        video_file = request.FILES.get("video_file")

        # Ensure that a file is provided
        if not video_file:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

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
