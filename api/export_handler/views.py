import io

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from rest_framework.views import APIView

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
    def get(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        page_width, page_height = A4
        margin = 50
        row_height = 20
        column_width = 150

        def next_section_start(current_y, section_height):
            return current_y - section_height - row_height

        # Initial pos
        current_y = page_height - margin

        # Header
        p.drawString(margin, current_y, "CONCLUSION PDF EXPORT")
        current_y = next_section_start(current_y, row_height)  # basically push the y position after each section

        # Data
        dummy_request = {"interviewRound": 3}
        interview_round_id = dummy_request["interviewRound"]
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        summary = get_object_or_404(Summary, interview_round=interview_round)
        # summary = get_object_or_404(Summary, interview_round=)

        # Candidate Section
        p.drawString(margin, current_y, "CANDIDATE DETAILS")
        current_y -= row_height
        p.drawString(margin, current_y, f"Name: {candidate.name}")
        current_y -= row_height
        p.drawString(margin, current_y, "Email: hardcoded_email@example.com")
        current_y = next_section_start(current_y, row_height)

        # Interview Section
        p.drawString(margin, current_y, "INTERVIEW DETAILS")
        current_y -= row_height
        p.drawString(margin, current_y, f"Company: {interview_round.company.name}")
        current_y -= row_height
        p.drawString(margin, current_y, f"Role: {template.role_title}")
        current_y -= row_height
        p.drawString(margin, current_y, f"Interview Title: {interview_round.title}")
        current_y -= row_height
        p.drawString(
            margin,
            current_y,
            f"Interviewer: {interview_round.interviewer.first_name} {interview_round.interviewer.last_name}",
        )
        current_y = next_section_start(current_y, row_height)

        # Summary Section
        p.drawString(margin, current_y, "SUMMARY DETAILS")
        current_y -= row_height
        p.drawString(margin, current_y, f"Description: {summary.description}")
        # Don't have working summary QA Pairs.
        current_y = next_section_start(current_y, row_height)

        """ DUMMY DATA START"""

        """ DUMMY DATA END"""

        # Close the PDF object cleanly, and we're done.
        p.showPage()
        p.save()

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="conclusion.pdf")
