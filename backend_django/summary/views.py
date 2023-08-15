from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Summary
from interview.models import InterviewRound
from question_response.models import Answer
from openai_helper.utils import summarize_interview
from interview.models import InterviewRoundQuestion
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


def get_qa_pairs(interview_round_id):
    questions = InterviewRoundQuestion.objects.filter(
        interview_round=interview_round_id
    )
    qa_pairs = []
    for question in questions:
        answers = Answer.objects.filter(question=question)
        for answer in answers:
            qa_pairs.append((question.question.question_text, answer.answer_text))
    return qa_pairs


# Function to perform text summarization
def summarize_qa_pairs(qa_pairs):
    text = " ".join([f"Question: {q}. Answer: {a}" for q, a in qa_pairs])
    summary = summarize_interview(text)
    return summary


@method_decorator(csrf_exempt, name="dispatch")
class GenerateSummaryView(APIView):
    def _generate_response(self, interview_round_id, summary):
        response_data = {
            "title": "Summary",
            "description": summary.text,
            "faq": [
                {
                    "question": "Kristin shared three different designs for action items",
                    "answer": "Answer 1",
                    "competency": "Leadership",
                },
                {
                    "question": "Leslie went over the project brief for product integrations",
                    "answer": "Answer 2",
                    "competency": "Empathy",
                },
                {
                    "question": "Kristin and Leslie walked through their ideas for improved dashboard UX",
                    "answer": "Kristin and Leslie met to discuss the latest designs for action items",
                    "competency": "Empathy",
                },
            ],
            "interview_round_id": interview_round_id,
        }

        return Response({"data": response_data}, status=status.HTTP_200_OK)

    def post(self, request, interview_round_id, *args, **kwargs):
        # Get question-answer pairs for the interview
        qa_pairs = get_qa_pairs(interview_round_id)
        # Generate summary text from the QA pairs
        summary_text = summarize_qa_pairs(qa_pairs)

        # Retrieve the interview
        interview = get_object_or_404(InterviewRound, id=interview_round_id)

        # Create the summary in the database
        summary = Summary.objects.create(interview_round=interview, text=summary_text)

        return self._generate_response(interview_round_id, summary)

    def get(self, request, interview_round_id, *args, **kwargs):
        # Retrieve the interview
        interview = get_object_or_404(InterviewRound, id=interview_round_id)
        # Find the summary associated with this interview
        # summary = Summary.objects.get(interview_round=interview)
        summary = Summary.objects.filter(interview_round=interview).latest("id")

        print("Getting a call")

        return self._generate_response(interview_round_id, summary)
