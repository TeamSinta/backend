import io

from django.http import FileResponse
from reportlab.pdfgen import canvas
from rest_framework.views import APIView

from user.models import CustomUser


class ExportToPdf(APIView):
    def get(self, request):
        buffer = io.BytesIO()
        # TODO:
        # - Title: Conclusion
        # - Time
        # - Name of position
        # - Name of Organization
        # - Name of interviewers
        # - Candidate Information
        # - Analytics
        # - Notes
        # - Comments
        # - Questions answered
        # # Create a file-like buffer to receive PDF data.
        # buffer = io.BytesIO)

        # Create the PDF object, using the buffer as its "file."
        p = canvas.Canvas(buffer)
        row_height = 20
        column_width = 400
        data = [
            ["ID", "Username", "Email"],
        ]

        interview_information_data = [["position_title", "organization_name"]]
        interviewer_data = [["first_name", "last_name", "email"]]
        conclusion_notes_data = [["author", "note"]]
        analytics_data = [["questions_solved", "time_past", "average_rating"]]

        # Document Top Title
        p.drawString(260, 800, "Sinta Export To Pdf")

        for obj in CustomUser.objects.all():
            data.append([obj.id, obj.username, obj.email])
        start_pos_x = 50
        start_pos_y = 750
        for row in data:
            for item in row:
                p.drawString(start_pos_x, start_pos_y, str(item))
                start_pos_x += column_width
            start_pos_x = 50
            start_pos_y -= row_height

        # Close the PDF object cleanly, and we're done.
        p.showPage()
        p.save()

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="conclusion.pdf")
