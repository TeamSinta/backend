import json

from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interview.models import InterviewRound, InterviewRoundQuestion
from new_transcription.tasks import process_transcription_summary
from question_response.models import Answer, InterviewerFeedback

from .serializers import InterviewerFeedbackSerializer


class QuestionSummarizedAnswerView(APIView):
    def post(self, request, interview_round_id):
        process_transcription_summary.delay(interview_round_id)
        return Response({"message": "Processing initiated"}, status=202)

    def get(self, request, interview_round_id):
        interview_round = get_object_or_404(InterviewRound, pk=interview_round_id)
        questions_answers_data = []

        for ir_question in InterviewRoundQuestion.objects.filter(interview_round=interview_round).select_related(
            "question__question"
        ):
            answer = Answer.objects.filter(question=ir_question).first()

            template_question = ir_question.question
            actual_question = template_question.question  # Access the actual Question model

            # Assuming answer_text is stored in a JSON-compatible string format
            answer_text = answer.answer_text if answer else ""
            answer_id = answer.id if answer else None  # Correctly access the id attribute of the answer object

            item = {
                "question": actual_question.question_text if actual_question else "",
                "answer": answer_text,
                "competency": actual_question.competency if actual_question and actual_question.competency else None,
                "score": ir_question.rating if ir_question.rating is not None else None,
                "answer_id": answer_id,
            }
            questions_answers_data.append(item)

        response_data = {"data": questions_answers_data}
        return Response(response_data, status=status.HTTP_200_OK)

    def patch(self, request, answer_id: int) -> Response:
        answer = get_object_or_404(Answer, pk=answer_id)

        # Optional: Check if the user has permission to update this answer
        # if request.user != answer.user:
        #     raise PermissionDenied("You do not have permission to edit this answer.")
        answer_text = request.data.get("answer_text")
        if answer_text is not None:
            json_string = json.dumps(answer_text)
            answer.answer_text = json_string

        # Add any other fields you expect to update
        answer.save()
        return Response({"status": "success", "message": "Answer updated successfully."}, status=status.HTTP_200_OK)


class InterviewerFeedbackListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewerFeedbackSerializer

    def get_queryset(self):
        round_id = self.kwargs.get("pk")
        queryset = InterviewerFeedback.objects.all()
        queryset = queryset.filter(interview_round_id=round_id)
        return queryset
