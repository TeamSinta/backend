import io

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from rest_framework.views import APIView
from xhtml2pdf import pisa

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from summary.models import Summary

# TODO Priority
# 1. Details
# 2. Summary and Questions

# - TOP: Template (username, name, company, user, email)
# - InterviewRound(title, candidate, interviewer, company)
# - InterviewRoundQuestion(question, rating)
# - Template(department, role_title, location, interviewers)
# - TemplateTopic(topics text, time)
# notes = Interviwer Feedback /question_response model (can be filtered by interview_round AND template_question id)

# TODO Secondary
# - Time
# - Analytics
# - Notes
# - Comments


class ExportToPdf(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch your data here
        dummy_request = {"interviewRound": 3}
        interview_round_id = dummy_request["interviewRound"]
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        summary = get_object_or_404(Summary, interview_round=interview_round)

        context_data = {
            "interview_round": interview_round,
            "interview_questions": interview_questions,
            "template": template,
            "interviewer": interviewer,
            "candidate": candidate,
            "summary": summary,
        }

        # Render the HTML template with context data
        template = get_template("pdf_template.html")
        html = template.render(context_data)

        # Create a PDF buffer
        buffer = io.BytesIO()
        pdf_status = pisa.CreatePDF(html, dest=buffer)

        # Check for errors
        if pdf_status.err:
            return HttpResponse("Error while generating PDF", status=400)

        # Set buffer to the beginning
        buffer.seek(0)

        # Return the response
        return HttpResponse(buffer, content_type="application/pdf")
