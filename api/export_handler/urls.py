from django.urls import path

from .views import Converter

urlpatterns = [
    path("convert_to_pdf", Converter.as_view(), name="convert_to_pdf"),
]
