import io

from django.http import FileResponse
from reportlab.pdfgen import canvas
from rest_framework.views import APIView


class ExportToPdf(APIView):
    def get(self, request):
        buffer = io.BytesIO()
        # TODO:
        # - Title: Conclusion
        # - Time
        # - Candidate Information (username, name, company, user, email)
        # - InterviewRound(title, candidate, interviewer, company)
        # - InterviewRoundQuestion(question, rating)
        # - Template(department, role_title, location, interviewers)
        # - TemplateTopic(topics text, time)
        # - Analytics
        # - Notes
        # - Comments
        # - Questions answered
        # # Create a file-like buffer to receive PDF data.
        # buffer = io.BytesIO)

        # company name: 176d826c-9e8e-4d97-b286-823c29acc3db

        # Create the PDF object, using the buffer as its "file."
        p = canvas.Canvas(buffer)
        row_height = 20
        column_width = 140

        """ DUMMY DATA START"""
        dummy_interviewers = [
            {"first_name": "Pablo", "last_name": "Escabar", "email": "LetsRead50ShadesOfGrey@slimy.now"},
            {"first_name": "Mo", "last_name": "Swag", "email": "IcanTrustThisGuy@letsgo.com"},
            {"first_name": "Henock", "last_name": "Yolo", "email": "IcanTrustThisGuy@letsgo.com"},
        ]
        interviewer_data_list = []

        """ DUMMY DATA END"""
        for interviewer in dummy_interviewers:
            interviewer_data = [interviewer["first_name"], interviewer["last_name"], interviewer["email"]]
            interviewer_data_list.append(interviewer_data)

        start_pos_x = 50
        start_pos_y = 750
        for row in interviewer_data_list:
            for item in row:
                p.drawString(start_pos_x, start_pos_y, str(item))
                start_pos_x += column_width
            start_pos_x = 50
            start_pos_y -= row_height

        interview_information_data = [["position_title", "organization_name"]]
        conclusion_notes_data = [["author", "note"]]
        analytics_data = [["questions_solved", "time_past", "average_rating"]]

        # Document Top Title
        p.drawString(260, 800, "Sinta Export To Pdf")

        # Process dummy interviewers

        # Close the PDF object cleanly, and we're done.
        p.showPage()
        p.save()

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="conclusion.pdf")
