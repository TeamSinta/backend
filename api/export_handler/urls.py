from django.urls import path

from .views import ExportToPdf

urlpatterns = [
    path("export_to_pdf", ExportToPdf.as_view(), name="export_to_pdf"),
]
