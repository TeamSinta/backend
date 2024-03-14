from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status

# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interview.models import InterviewRound, InterviewRoundQuestion
from openai_helper.utils import summarize_interview

from .models import Summary
from .serializers import SummaryDescriptionSerializer


def get_qa_pairs(interview_round_id):
    questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round_id)
    qa_pairs = []
    for question in questions:
        template_question = question.question  # Assuming 'question' is the ForeignKey to TemplateQuestion
        question_text = template_question.question.question_text
        answers = question.answer.all()  # Access related answers using 'answer' reverse relationship
        for answer in answers:
            qa_pairs.append((question_text, answer.answer_text))
    return qa_pairs


def summarize_qa_pairs(qa_pairs):
    text = " ".join([f"Question: {q}. Answer: {a}" for q, a in qa_pairs])
    summary = summarize_interview(text)
    return summary


@method_decorator(csrf_exempt, name="dispatch")
class GenerateSummaryView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, interview_round_id, *args, **kwargs):
        # Fetch the interview round or return 404 if not found
        interview = get_object_or_404(InterviewRound, id=interview_round_id)

        # Attempt to fetch the latest summary for the interview round. This requires a default
        # ordering on the Summary model, or specifying the field to order by in the latest() call.
        try:
            summary = Summary.objects.filter(interview_round=interview).latest("created_at")
            response_data = {
                "title": "Summary",
                "description": summary.description,
                "interview_round_id": interview_round_id,
                "summary_id": summary.id,
            }
            return Response({"data": response_data}, status=status.HTTP_200_OK)
        except Summary.DoesNotExist:
            # Handle the case where no summary exists for the interview round
            return Response(
                {"error": "No summary found for the specified interview round."}, status=status.HTTP_404_NOT_FOUND
            )


class UpdateSummaryDescriptionView(APIView):
    # permission_classes = [IsAuthenticated]

    def patch(self, request, summary_id):
        summary = get_object_or_404(Summary, pk=summary_id)
        serializer = SummaryDescriptionSerializer(summary, data=request.data, partial=True)  # Assuming partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_BAD_REQUEST)
