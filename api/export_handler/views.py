from datetime import datetime

from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, status
from wkhtmltopdf.views import PDFTemplateResponse

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary


class ExportToPdf(APIView):
    permission_classes = [IsAuthenticated]
    template_name = "pdf_template.html"

    review_icon_mapping = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/1_competency_score.png",  # Superbad
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/2_competency_score.png",  # Thumbs Down
        3: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/3_competency_score.png",  # Warning
        4: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/4_competency_score.png",  # Thumbs Up
        5: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/5_competency_score.png",  # Star
    }

    hire_decision_icon = {
        1: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/4_competency_score.png",  # Thumbs up
        2: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/2_competency_score.png",  # Thumbs Down
        3: "https://sinta-media.s3.eu-west-1.amazonaws.com/icons/5_competency_score.png",  # Star
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

    def get_candidate_and_initials(self, interview_round):
        candidate = interview_round.candidate
        candidate_name = interview_round.candidate.name
        candidate_initials = ""
        if " " in candidate_name:
            if candidate_name.count(" ") >= 1:
                candidate_name = candidate_name.split(" ")
                first_initial = candidate_name[0][0].upper()
                last_initial = candidate_name[-1][0].upper()
                candidate_initials = f"{first_initial}{last_initial}"
        else:
            first_initial = candidate_name[0].upper()
            last_initial = candidate_name[1].upper()
            candidate_initials = f"{first_initial}{last_initial}"

        candidate_with_initials = {**candidate.__dict__, "initials": candidate_initials}
        return candidate_with_initials

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

    def get_hiring_decision(self, choice):
        if choice == 1:
            return "Hire", self.get_icon_url(choice, "hire_decision")
        elif choice == 3:
            return "Strong Hire", self.get_icon_url(choice, "hire_decision")
        else:
            return "Don't Hire", self.get_icon_url(choice, "hire_decision")

    def build_context(self, interview_round):
        try:
            questions_and_answers = self.get_questions_and_answers(interview_round)
            competency_and_reviews = self.get_competency_and_review(interview_round)
            template = get_object_or_404(Template, id=interview_round.template_id)
            summary = get_object_or_404(Summary, interview_round=interview_round)
            candidate = self.get_candidate_and_initials(interview_round)
            interviewer_feedback = get_object_or_404(InterviewerFeedback, interview_round=interview_round)
            interviewer_hire_choice = 3
            decision_text, decision_icon = self.get_hiring_decision(interviewer_hire_choice)

        except Http404:
            return Response({"error": "Required interview round data not found"}, status=status.HTTP_404_NOT_FOUND)

        context = {
            "interview_round": interview_round,
            "questions_and_answers": questions_and_answers,
            "competency_and_reviews": competency_and_reviews,
            "template": template,
            "interviewer": interview_round.interviewer,
            "interviewer_feedback": interviewer_feedback,
            "hire_decision": {"text": decision_text, "icon_url": decision_icon},
            "candidate": candidate,
            "summary": summary,
        }

        return context

    def get(self, request, *args, **kwargs):
        interview_round_id = request.data.get("interview_round_id")
        if not interview_round_id:
            return Response({"error": "Valid Interview round ID not provided"}, status=status.HTTP_404_NOT_FOUND)

        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)
        print("Interviewer:", interview_round.interviewer)
        print("Requester", self.request.user)
        if interview_round.interviewer != self.request.user:
            return Response({"error": "You do not have access to this file"}, status=status.HTTP_403_FORBIDDEN)

        try:
            context = self.build_context(interview_round)
            # Check if context has any errors, and stop the request if it does.
            if isinstance(context, Response):
                return context

            unique_filename = self.get_unique_file_name(interview_round.title)
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

        except Http404:
            return Response({"error": "Interview round not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {
                    "error": f"An unexpected error occurred. {e}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return response
