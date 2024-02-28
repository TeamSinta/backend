from django.shortcuts import get_object_or_404
from wkhtmltopdf.views import (
    PDFTemplateView,  # Assuming you're using PDFTemplateResponse
)

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


class ExportToPdf(PDFTemplateView):
    template_name = "pdf_template.html"
    filename = "test_pdf.pdf"

    command_options = {
        "quiet": True,
        "enable-local-file-access": True,
    }

    def get_context_data(self, **kwargs):
        dummy_request = {"interviewRound": 9}
        interview_round_id = dummy_request["interviewRound"]
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
        summary = get_object_or_404(Summary, interview_round=interview_round)

        questions_and_answers = []
        for question in interview_questions:
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})

        reactions = {
            {"feedback_text": "Soft Skills", "image_url": "https://i.ibb.co/Gx8k2Hc/SVG-to-PNG.png"},
            {"feedback_text": "Design", "image_url": "https://i.ibb.co/Gx8k2Hc/SVG-to-PNG.png"},
            {"feedback_text": "React", "image_url": "https://i.ibb.co/Gx8k2Hc/SVG-to-PNG.png"},
        }
        context = super().get_context_data(**kwargs)

        context = {
            "interview_round": interview_round,
            "questions_and_answers": questions_and_answers,
            "template": template,
            "interviewer": interviewer,
            "interviewer_feedback": interviewer_feedback,
            "candidate": candidate,
            "summary": summary,
        }
        context["reactions"] = reactions
        # Call the base implementation first to get a context
        # Add in a QuerySet of all the books

        return context
