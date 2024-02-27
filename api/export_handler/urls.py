from django.urls import path

from .views import ExportToPdf, ExportToPdfNew

urlpatterns = [
    path("export_to_pdf", ExportToPdf.as_view(), name="export_to_pdf"),
    path("export_to_pdf_new", ExportToPdfNew.as_view(), name="pdf"),
]
