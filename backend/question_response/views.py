from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from django.shortcuts import get_object_or_404
from interview.models import InterviewRound
from question_response.models import Answer, InterviewerFeedback
from openai_helper.utils import get_embedding, get_answer_notes_for_question
from transcription.models import TranscriptChunk
from django.http import HttpRequest, JsonResponse
from pgvector.django import CosineDistance
from django.db import transaction
import json
from user.models import CustomUser
from typing import List, Dict
from .serializers import InterviewerFeedbackSerializer
from interview.models import Candidate
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class QuestionSummarizedAnswerView(APIView):
    def get(self, request: HttpRequest, interview_round_id: int) -> Response:
        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        return self._serve_question_answers(interview_round)

    def post(self, request: HttpRequest, interview_round_id: int) -> Response:
        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        self._process_transcription(interview_round)
        return self._serve_question_answers(interview_round)

    def _serve_question_answers(self, interview_round: InterviewRound) -> Response:
        question_answers = self._get_question_and_answers(interview_round)

        if len(question_answers) > 0:
            return Response({"data": question_answers}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"status": "error", "message": "No question answers found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _save_answer_notes(self, answer: Answer, question_text: str):
        answer_text = " ".join(
            TranscriptChunk.objects.filter(answer=answer).values_list(
                "chunk_text", flat=True
            )
        )
        response = get_answer_notes_for_question(answer_text, question_text)
        answer.answer_text = response
        answer.embedding = get_embedding(response)
        answer.save()

    def _generate_answers_for_interview_round(self, interview_round: InterviewRound):
        interview_round_questions = interview_round.interview_round_questions.all()
        transcript_chunks = TranscriptChunk.objects.filter(
            interview_round=interview_round
        )

        for interview_round_question in interview_round_questions:
            template_question = interview_round_question.question
            question = template_question.question  # Access the related Question

            if question:
                question_embedding = question.embedding
                relevant_chunks = transcript_chunks.order_by(
                    CosineDistance("embedding", question_embedding)
                )[:5]

                answer = None

                with transaction.atomic():
                    answer = Answer.objects.create(question=interview_round_question)
                    answer.transcript_chunks.set(relevant_chunks)

                print(f"Saved state for answer #{answer.id}")

                # TODO: Move to a different thread
                self._save_answer_notes(
                    answer, template_question.question.question_text
                )

    def _process_transcription(self, interview_round: InterviewRound):
        # TODO: Create up bulk create
        # TODO: Handle user identification
        transcription_file = interview_round.transcription_file_uri

        print(transcription_file)

        with open(transcription_file, "r") as f:
            data = json.load(f)

            interviewer = interview_round.interviewer

            for utterance in data["utterances"]:
                # TODO: We assume that the first speaker is always an interviewer. Fix this.
                # TODO: If this is not the case, we then need to rerun this code after modifying the transcript chunks for the interviewer.
                # TODO: This will also only work for one interviewer and one candidate. We need to support multiple interviewers and candidates.

                user = (
                    interviewer
                    if utterance["speaker"] == "A"
                    else interview_round.candidate
                )
                # user = CustomUser.objects.get(id=utterance["speaker"])
                TranscriptChunk.objects.create(
                    chunk_text=utterance["text"],
                    embedding=get_embedding(utterance["text"]),
                    interview_round=interview_round,
                    speaker=user,
                    start_time=int(utterance["start"]) / 1000,
                    end_time=int(utterance["end"]) / 1000,
                )

        self._generate_answers_for_interview_round(interview_round)

    def _get_question_and_answers(self, interview_round: InterviewRound) -> List[Dict]:
        interview_round_questions = interview_round.interview_round_questions.all()

        question_answers = []

        for interview_round_question in interview_round_questions:
            # TODO: Add speaker image url
            # TODO: Support showing competency and score
            # TODO: Show speaker first name and last name
            # TODO: UPdate competency and score
            template_question = interview_round_question.question
            question = template_question.question

            answer = interview_round_question.answer.all()[0]
            tc = []
            for chunk in answer.transcript_chunks.all():
                tc.append(
                    {
                        "chunk_text": chunk.chunk_text,
                        "start_time": chunk.start_time,
                        "end_time": chunk.end_time,
                        "speaker": chunk.speaker.username,
                    }
                )

            question_answers.append(
                {
                    "question": question.question_text,
                    "answer": answer.answer_text,
                    "transcript_chunks": tc,
                    "competency": "Leadership",
                    "score": 4,
                }
            )

        return question_answers


class InterviewerFeedbackListCreateView(generics.ListCreateAPIView):
    queryset = InterviewerFeedback.objects.all()
    serializer_class = InterviewerFeedbackSerializer

    def post(self, request, *args, **kwargs):
        # Initialize a serializer with the request data.
        serializer = self.get_serializer(data=request.data)

        # Check if the serializer is valid.
        if serializer.is_valid():
            # Save the serializer will create a new instance with the provided data.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If the data is not valid, return a bad request response.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InterviewerFeedbackDetailView(generics.ListCreateAPIView):
    serializer_class = InterviewerFeedbackSerializer

    def get_queryset(self):
        round_id = self.kwargs.get("pk")
        queryset = InterviewerFeedback.objects.all()
        queryset = queryset.filter(interview_round_id=round_id)
        print(round_id)
        print(queryset)
        return queryset
