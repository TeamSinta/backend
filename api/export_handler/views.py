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

    review_icon_mapping = {
        1: "https://i.postimg.cc/PNQmdQwp/cross.png",  # Superbad
        2: "https://i.postimg.cc/LJnfBd0L/thumbs-down.png",  # Thumbs Down
        3: "https://i.postimg.cc/Wh9gkpSs/middle.png",  # Warning
        4: "https://i.postimg.cc/182FvWLT/thumbsup.png",  # Thumbs Up
        5: "https://i.postimg.cc/vc85TxrP/star.png",  # Star
    }

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

        competency_and_reviews = []
        questions_and_answers = []

        for question in interview_questions:
            review_value = question.question.question.review
            icon_url = self.review_icon_mapping.get(review_value, "")
            competency = question.question.question.competency
            competency_and_reviews.append({"competency": competency, "icon_url": icon_url})
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})

        print(competency_and_reviews)
        context = super().get_context_data(**kwargs)

        context = {
            "interview_round": interview_round,
            "questions_and_answers": questions_and_answers,
            "competency_and_reviews": competency_and_reviews,
            "template": template,
            "interviewer": interviewer,
            "interviewer_feedback": interviewer_feedback,
            "candidate": candidate,
            "summary": summary,
        }

        # Call the base implementation first to get a context
        # Add in a QuerySet of all the books

        return context
