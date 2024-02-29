from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from wkhtmltopdf.views import PDFTemplateResponse

# from wkhtmltopdf.views import (
#     PDFTemplateView,
# )
from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary

# class ExportToPdf(PDFTemplateView):
#     template_name = "pdf_template.html"
#     filename = "test_pdf.pdf"

#     review_icon_mapping = {
#         1: "https://i.ibb.co/yk0Bprj/1.png",  # Superbad
#         2: "https://i.ibb.co/685X0kB/2.png",  # Thumbs Down
#         3: "https://i.ibb.co/FXvn2NS/3.png",  # Warning
#         4: "https://i.ibb.co/WD4FG7T/4.png",  # Thumbs Up
#         5: "https://i.ibb.co/B6mnJ3R/5.png",  # Star
#     }

#     command_options = {
#         "quiet": True,
#         "enable-local-file-access": True,
#     }

#     def get_context_data(self, **kwargs):
#         request_body = json.loads(self.request.body)
#         interview_round_id = request_body.get("interview_round_id")
#         # dummy_request = {"interviewRound": 9}
#         # interview_round_id = dummy_request["interviewRound"]
#         interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
#         interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
#         template = get_object_or_404(Template, id=interview_round.template_id)
#         candidate = interview_round.candidate
#         interviewer = interview_round.interviewer
#         interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
#         summary = get_object_or_404(Summary, interview_round=interview_round)

#         competency_and_reviews = []
#         questions_and_answers = []

#         for question in interview_questions:
#             review_value = question.question.question.review
#             icon_url = self.review_icon_mapping.get(review_value, "")
#             competency = question.question.question.competency
#             competency_and_reviews.append({"competency": competency, "icon_url": icon_url})
#             answer = get_object_or_404(Answer, question=question)
#             questions_and_answers.append({"question": question, "answer": answer})

#         print(competency_and_reviews)
#         context = super().get_context_data(**kwargs)

#         context = {
#             "interview_round": interview_round,
#             "questions_and_answers": questions_and_answers,
#             "competency_and_reviews": competency_and_reviews,
#             "template": template,
#             "interviewer": interviewer,
#             "interviewer_feedback": interviewer_feedback,
#             "candidate": candidate,
#             "summary": summary,
#         }

#         return context


class ExportToPdf(APIView):
    template_name = "pdf_template.html"
    filename = "test_pdf.pdf"

    review_icon_mapping = {
        1: "https://i.ibb.co/yk0Bprj/1.png",  # Superbad
        2: "https://i.ibb.co/685X0kB/2.png",  # Thumbs Down
        3: "https://i.ibb.co/FXvn2NS/3.png",  # Warning
        4: "https://i.ibb.co/WD4FG7T/4.png",  # Thumbs Up
        5: "https://i.ibb.co/B6mnJ3R/5.png",  # Star
    }

    hire_decision_icon = {
        1: "https://i.postimg.cc/zDxhLshQ/thumbs-up-white.png",
        2: "https://i.postimg.cc/Y0DLJFk7/thumbs-down-white.png",
    }

    def get(self, request, *args, **kwargs):
        print(request.data.get("interview_round_id"))
        interview_round_id = request.data.get("interview_round_id")
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)
        template = get_object_or_404(Template, id=interview_round.template_id)
        candidate = interview_round.candidate
        interviewer = interview_round.interviewer
        interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
        summary = get_object_or_404(Summary, interview_round=interview_round)

        competency_and_reviews = []
        questions_and_answers = []
        interviewer_hire_choice = 2

        for question in interview_questions:
            review_value = question.question.question.review
            icon_url = self.review_icon_mapping.get(review_value, "")
            competency = question.question.question.competency
            competency_and_reviews.append({"competency": competency, "icon_url": icon_url})
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
