from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transcription.models import TranscriptChunk
from interview.models import InterviewRound, InterviewRoundQuestion
from pgvector.django import CosineDistance
from app.utils import seconds_to_minutes
from typing import List, Dict
from django.shortcuts import get_object_or_404

from interview.models import InterviewRound
from django.http import HttpRequest
from transcription.jobs.get_transcripts import generate_transcriptions_from_assembly


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
        tc_by_interviewer = tc.filter(speaker=interview_round.interviewer)

        for q in interview_questions:
            q = q.question

            asked_question = tc_by_interviewer.order_by(
                CosineDistance("embedding", q.embedding)
            ).first()
            question_start_times.append((q, asked_question.start_time - 1))

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
        # Retrieve the interview_round_id and video_path_uri from the request body
        print(request.POST)
        interview_round_id = request.POST.get("interview_round_id")
        video_path_uri = request.POST.get("video_path_uri")

        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        interview_round.video_uri = video_path_uri
        interview_round.save()

        generate_transcriptions_from_assembly(interview_round_id, video_path_uri)

        return Response(status=status.HTTP_200_OK)
