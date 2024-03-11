from django.urls import path

from .views import start_transcription

urlpatterns = [
    path("start_transcription/", start_transcription, name="start_transcription"),
]
