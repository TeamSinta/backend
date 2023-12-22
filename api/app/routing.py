from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/transcription_consumer/(?P<interview_round_id>\d+)/$", consumers.InterviewTranscriptionConsumer.as_asgi()
    ),
]
