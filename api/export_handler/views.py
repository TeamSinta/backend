from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from wkhtmltopdf.views import PDFTemplateResponse

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary


class ExportToPdf(APIView):
    template_name = "pdf_template.html"
    filename = "test_pdf.pdf"

    review_icon_mapping = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/1_competency_score.png",  # Superbad
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/2_competency_score.png",  # Thumbs Down
        3: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/3_competency_score.png",  # Warning
        4: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/4_competency_score.png",  # Thumbs Up
        5: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/5_competency_score.png",  # Star
    }

    hire_decision_icon = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/thumbs_up_white96x96.png",
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/thumbs_down_white96x96.png",
    }

    def get(self, request, *args, **kwargs):
        print("Interview Round: ", request.data.get("interview_round_id"))
        interview_round_id = request.data.get("interview_round_id")
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        print(interview_round)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        print(interview_questions)
        template = get_object_or_404(Template, id=interview_round.template_id)
        print(template)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
        print(interviewer_feedback)
        summary = get_object_or_404(Summary, interview_round=interview_round)
        print(summary)

        competency_and_reviews = []
        questions_and_answers = []
        interviewer_hire_choice = 2

        for question in interview_questions:
            review_value = question.question.question.review
            print("Review Value ", review_value)
            icon_url = self.review_icon_mapping.get(review_value, "")
            competency = question.question.question.competency
            print("Icon Url ", icon_url)
            print("Competency: ", competency)
            competency_and_reviews.append({"text": competency, "icon_url": icon_url})
            answer = get_object_or_404(Answer, question=question)
            questions_and_answers.append({"question": question, "answer": answer})

        decision_text = "Hire" if interviewer_hire_choice == 1 else "Don't Hire"
        decision_icon = self.hire_decision_icon[interviewer_hire_choice]

        hire_decision = {"text": decision_text, "icon_url": decision_icon}

        context = {
            "interview_round": interview_round,
            "questions_and_answers": questions_and_answers,
            "competency_and_reviews": competency_and_reviews,
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
            filename=self.filename,
            context=context,
            cmd_options={
                "quiet": True,
                "enable-local-file-access": True,
            },
        )

        return response
