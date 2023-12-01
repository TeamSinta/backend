from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from interview.models import InterviewRound, InterviewRoundQuestion
from openai_helper.utils import summarize_interview

from .models import Summary


def get_qa_pairs(interview_round_id):
    questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round_id)
    qa_pairs = []
    for question in questions:
        # Access the related TemplateQuestion and Question objects
        template_question = question.question  # Assuming 'question' is the ForeignKey to TemplateQuestion
        question_text = template_question.question.question_text
        answers = question.answer.all()  # Access related answers using 'answer' reverse relationship
        for answer in answers:
            qa_pairs.append((question_text, answer.answer_text))
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
            "description": summary.description,
            "faq": summary.qa_pairs,
            "interview_round_id": interview_round_id,
        }

        return Response({"data": response_data}, status=status.HTTP_200_OK)

    def post(self, request, interview_round_id, *args, **kwargs):
        # Get question-answer pairs for the interview
        qa_pairs = get_qa_pairs(interview_round_id)
        # Generate summary text from the QA pairs
        description, qa_pairs = summarize_qa_pairs(qa_pairs)

        # Retrieve the interview
        interview = get_object_or_404(InterviewRound, id=interview_round_id)

        # Create the summary in the database
        summary = Summary.objects.create(interview_round=interview, qa_pairs=qa_pairs, description=description)

        return self._generate_response(interview_round_id, summary)
        # return StreamingHttpResponse(self.stream_sse(response), content_type="text/event-stream")

    # def stream_sse(self, response):
    #     for fragment in response.streaming_content:
    #         yield f"data: {fragment.decode('utf-8')}\n\n"

    def get(self, request, interview_round_id, *args, **kwargs):
        # Retrieve the interview
        interview = get_object_or_404(InterviewRound, id=interview_round_id)
        # Find the summary associated with this interview
        # summary = Summary.objects.get(interview_round=interview)
        summary = Summary.objects.filter(interview_round=interview).latest("id")

        return self._generate_response(interview_round_id, summary)
