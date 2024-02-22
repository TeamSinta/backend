from django.http import HttpResponse
from reportlab.pdfgen import canvas
from rest_framework.views import APIView

from user.models import CustomUser


class ExportToPdf(APIView):
    def get(self, request):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="mydata.pdf"'

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
        p = canvas.Canvas(response)
        row_height = 20
        column_width = 400

        data = [
            ["ID", "Username", "Email"],
        ]

        p.drawString(260, 800, "Sinta Export To Pdf")

        for obj in CustomUser.objects.all():
            data.append([obj.id, obj.username, obj.email])
        # Draw the table
        x = 50
        y = 750
        for row in data:
            for item in row:
                p.drawString(x, y, str(item))
                x += column_width
            x = 50
            y -= row_height

        # Close the PDF object cleanly, and we're done.
        p.showPage()
        p.save()

        return response
