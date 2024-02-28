from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django_weasyprint import WeasyTemplateResponseMixin

from interview.models import InterviewRound


class ExportToPdf(WeasyTemplateResponseMixin, TemplateView):
    # Specify your template name for generating PDF
    template_name = "pdf_template.html"

    # If you want to specify PDF filename or other options, you can do so here
    pdf_filename = "interview_round_report.pdf"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        interview_round_id = 9  # Assuming this is passed via URL
        interview_round = get_object_or_404(InterviewRound, id=interview_round_id)

        # Add other necessary context data for your PDF here
        context["interview_round"] = interview_round
        # ... add other context variables as needed

        return context


# class ExportToPdfNew(PDFTemplateView):
#     template_name = "pdf_template.html"
#     filename = "test_pdf.pdf"

#     command_options = {
#         "quiet": True,
#         "enable-local-file-access": True,
#     }

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)  # Call the base implementation first
#         dummy_request = {"interviewRound": 9}
#         interview_round_id = dummy_request["interviewRound"]

#         try:
#             interview_round = InterviewRound.objects.get(id=interview_round_id)
#         except InterviewRound.DoesNotExist:
#             raise Http404("InterviewRound does not exist")

#         interview_questions = InterviewRoundQuestion.objects.filter(interview_round=interview_round)

#         try:
#             template = Template.objects.get(id=interview_round.template_id)
#         except Template.DoesNotExist:  # Make sure to catch the correct exception
#             raise Http404("Template does not exist")

#         try:
#             interviewer_feedback = InterviewerFeedback.objects.get(interview_round=interview_round)
#         except InterviewerFeedback.DoesNotExist:
#             raise Http404("InterviewerFeedback does not exist")

#         try:
#             summary = Summary.objects.get(interview_round=interview_round)
#         except Summary.DoesNotExist:
#             raise Http404("Summary does not exist")

#         candidate = interview_round.candidate
#         interviewer = interview_round.interviewer

#         questions_and_answers = self.get_questions_and_answers(interview_questions)

#         # Update context with all the information needed for the template
#         context.update(
#             {
#                 "interview_round": interview_round,
#                 "questions_and_answers": questions_and_answers,
#                 "template": template,
#                 "interviewer": interviewer,
#                 "interviewer_feedback": interviewer_feedback,
#                 "interviewer_reaction": "",
#                 "candidate": candidate,
#                 "summary": summary,
#             }
#         )

#         return context

#     def get_questions_and_answers(self, interview_questions):
#         questions_and_answers = []
#         for question in interview_questions:
#             answer = get_object_or_404(Answer, question=question)
#             questions_and_answers.append({"question": question, "answer": answer})
#         return questions_and_answers


# class MyModelDetailView(DetailView):
#     # Your regular Django detail view logic here
#     model = MyModel
#     template_name = 'myapp/mymodel_detail.html'

# class ExportToPdf3(WeasyTemplateResponseMixin, MyModelDetailView):
