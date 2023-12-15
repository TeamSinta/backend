from django.urls import path
from .views import Tokens, MeetingRoom

urlpatterns = [
    path(
        "meetingroom/delete-all", MeetingRoom.as_view(), name="delete-all-meetingrooms"
    ),
    path("meetingroom/token", Tokens.as_view(), name="create-meetingroom-token"),
    path("meetingroom/create", MeetingRoom.as_view(), name="create-meetingroom"),
    path(
        "meetingroom/<str:room_name>",
        MeetingRoom.as_view(),
        name="get-meetingroom-info",
    ),
    path(
        "meetingroom/token/<str:token>",
        Tokens.as_view(),
        name="validate-meetingroom-token",
    ),
]
