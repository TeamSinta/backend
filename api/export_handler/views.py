from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from wkhtmltopdf.views import PDFTemplateResponse

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary


class ExportToPdf(APIView):
    template_name = "pdf_template.html"

    review_icon_mapping = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/1_competency_score.png",  # Superbad
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/2_competency_score.png",  # Thumbs Down
        3: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/3_competency_score.png",  # Warning
        4: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/4_competency_score.png",  # Thumbs Up
        5: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/5_competency_score.png",  # Star
    }

    hire_decision_icon = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/4_competency_score.png",
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/2_competency_score.png",
        3: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/5_competency_score.png",
    }

    def get_icon_url(self, score, mapping_type="competency"):
        if mapping_type == "competency":
            return self.review_icon_mapping.get(score, "")
        else:
            return self.hire_decision_icon.get(score, "")

    def get_unique_file_name(self, interview_round_title):
        timestamp = datetime.now().strftime("%Y%m%d")
        filename = f"{interview_round_title.replace(' ', '_').lower()}_{timestamp}.pdf"
        return filename

    def get_questions_and_answers(self, interview_round):
        questions_and_answers = []
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        for question in interview_questions:
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})
        return questions_and_answers

    def get_competency_and_review(self, interview_round):
        competency_and_reviews = []
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        for question in interview_questions:
            competency = question.question.question.competency
            review_value = question.question.question.review
            icon_url = self.get_icon_url(review_value, "competency")
            competency_and_reviews.append({"text": competency, "icon_url": icon_url})
        return competency_and_reviews

    def get(self, request, *args, **kwargs):
        interview_round_id = request.data.get("interview_round_id")
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
        summary = get_object_or_404(Summary, interview_round=interview_round)

        unique_filename = self.get_unique_file_name(interview_round.title)
        interviewer_hire_choice = 3

        if interviewer_hire_choice == 1:
            decision_text = "Hire"
        elif interviewer_hire_choice == 3:
            decision_text = "Strong Hire"
        else:
            decision_text = "Don't Hire"

        decision_icon = self.hire_decision_icon[interviewer_hire_choice]

        hire_decision = {"text": decision_text, "icon_url": decision_icon}

        context = {
            "interview_round": interview_round,
            "questions_and_answers": self.get_questions_and_answers(interview_round),
            "competency_and_reviews": self.get_competency_and_review(interview_round),
            "template": template,
            "interviewer": interviewer,
            "interviewer_feedback": interviewer_feedback,
            "hire_decision": hire_decision,
            "candidate": candidate,
            "summary": summary,
        }

        response = PDFTemplateResponse(
            request=request,
            template=self.template_name,
            filename=unique_filename,
            context=context,
            cmd_options={
                "quiet": True,
                "enable-local-file-access": True,
            },
        )

        return response
