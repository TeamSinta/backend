import io

from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from rest_framework.views import APIView
from wkhtmltopdf.views import (
    PDFTemplateView,  # Assuming you're using PDFTemplateResponse
)
from xhtml2pdf import pisa

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary

# TODO Secondary
# - Fix DOC version
# - Fix Style
# - Time
# - Analytics
# - Notes
# - Comments

# TODO Priority
# - Fix Emojis
# - Fix Timestamp


class ExportToPdf(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch your data here

        dummy_request = {"interviewRound": 9}
        interview_round_id = dummy_request["interviewRound"]
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
        summary = get_object_or_404(Summary, interview_round=interview_round)

        # Temp Test
        reaction = interviewer_feedback.reaction
        if reaction == InterviewerFeedback.EmojiChoice.FIRE:
            feedback_reaction_emoji = "🔥"
        elif reaction == InterviewerFeedback.EmojiChoice.THUMBS_UP:
            feedback_reaction_emoji = "👍"
        elif reaction == InterviewerFeedback.EmojiChoice.THUMBS_DOWN:
            feedback_reaction_emoji = "👎"
        elif reaction == InterviewerFeedback.EmojiChoice.HEART:
            feedback_reaction_emoji = "❤️"
        elif reaction == InterviewerFeedback.EmojiChoice.LAUGH:
            feedback_reaction_emoji = "😂"
        else:
            feedback_reaction_emoji = ""

        questions_and_answers = []
        for question in interview_questions:
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})

        context_data = {
            "interview_round": interview_round,
            "questions_and_answers": questions_and_answers,
            "template": template,
            "interviewer": interviewer,
            "interviewer_feedback": interviewer_feedback,
            "interviewer_reaction": feedback_reaction_emoji,
            "candidate": candidate,
            "summary": summary,
        }

        print(context_data)

        # Render the HTML template with context data
        template = get_template("pdf_template.html")
        html = template.render(context_data)

        # Create a PDF buffer
        buffer = io.BytesIO()
        pdf_status = pisa.CreatePDF(html, dest=buffer, encoding="utf-8")

        # Check for errors
        if pdf_status.err:
            return HttpResponse("Error while generating PDF", status=400)

        # Set buffer to the beginning
        buffer.seek(0)

        # Return the response
        return HttpResponse(buffer, content_type="application/pdf")


class ExportToPdfNew(PDFTemplateView):
    template_name = "pdf_template.html"
    filename = "test_pdf.pdf"

    command_options = {
        "quiet": True,
        "enable-local-file-access": True,
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)  # Call the base implementation first
        dummy_request = {"interviewRound": 9}
        interview_round_id = dummy_request["interviewRound"]

        try:
            interview_round = InterviewRound.objects.get(id=interview_round_id)
        except InterviewRound.DoesNotExist:
            raise Http404("InterviewRound does not exist")

        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)

        try:
            template = Template.objects.get(id=interview_round.template_id)
        except Template.DoesNotExist:  # Make sure to catch the correct exception
            raise Http404("Template does not exist")

        try:
            interviewer_feedback = InterviewerFeedback.objects.get(interview_round=interview_round)
        except InterviewerFeedback.DoesNotExist:
            raise Http404("InterviewerFeedback does not exist")

        try:
            summary = Summary.objects.get(interview_round=interview_round)
        except Summary.DoesNotExist:
            raise Http404("Summary does not exist")

        candidate = interview_round.candidate
        interviewer = interview_round.interviewer

        questions_and_answers = self.get_questions_and_answers(interview_questions)

        # Update context with all the information needed for the template
        context.update(
            {
                "interview_round": interview_round,
                "questions_and_answers": questions_and_answers,
                "template": template,
                "interviewer": interviewer,
                "interviewer_feedback": interviewer_feedback,
                "interviewer_reaction": "",
                "candidate": candidate,
                "summary": summary,
            }
        )

        return context

    def get_questions_and_answers(self, interview_questions):
        questions_and_answers = []
        for question in interview_questions:
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})
        return questions_and_answers
