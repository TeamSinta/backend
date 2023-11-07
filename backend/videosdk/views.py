from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, timedelta, timezone
from interview.models import InterviewRound

from dotenv import load_dotenv, dotenv_values
import requests

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent
KEYS = dotenv_values(BASE_DIR / ".env")
API_KEY = KEYS["DAILY_API_KEY"]

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
}

BASE_URL = "https://api.daily.co/v1/"


def set_expiration_timestamp(**kwargs):
    if "days" in kwargs:
        expiration_time = datetime.now(timezone.utc) + timedelta(days=kwargs["days"])
    elif "weeks" in kwargs:
        expiration_time = datetime.now(timezone.utc) + timedelta(weeks=kwargs["weeks"])
    else:
        raise ValueError("Either 'days' or 'weeks' must be provided")
    return expiration_time.timestamp()


def create_meeting_room():
    ROOMS_URL = f"{BASE_URL}/rooms"
    expiration_date = set_expiration_timestamp(weeks=4)

    data = {
        "privacy": "private",
        "properties": {
            "exp": expiration_date,
            "start_audio_off": True,
            "start_video_off": True,
        },
    }

    response = requests.post(ROOMS_URL, headers=headers, json=data)

    return response.json() if response.status_code == 200 else None


def generate_token(
    room_name,
    is_owner=False,
    user_name="Candidate",
    enable_recording="",
    expiration_timestamp=None,
):
    # Set token expiration depending on who is requesting a token.
    if is_owner:
        expiration_timestamp = set_expiration_timestamp(weeks=4)
    else:
        expiration_timestamp = set_expiration_timestamp(days=1)

    TOKENS_URL = BASE_URL + "meeting-tokens"

    data = {
        "properties": {
            "room_name": room_name,
            "is_owner": is_owner,
            "user_name": user_name,
            "enable_recording": enable_recording,
            "exp": expiration_timestamp,
        },
    }
    response = requests.post(TOKENS_URL, headers=headers, json=data)
    return response.json() if response.status_code == 200 else None


def get_room_info(room_name):
    url = f"{BASE_URL}/rooms/{room_name}"
    response = requests.get(url, headers=headers)
    return response.json() if response.status_code == 200 else None


def get_interview_round(interview_round_id):
    # Update this when implementing error handling.
    return get_object_or_404(InterviewRound, pk=interview_round_id)


class MeetingRoom(APIView):
    def post(self, request):
        interview_round = get_interview_round(request.data.get("interview_round_id"))

        if not interview_round:
            return JsonResponse({"message": "Could not find interview round"})

        room_response = create_meeting_room()
        if not room_response:
            return JsonResponse({"error": "Failed to create room."}, status=500)
        room_name = room_response["name"]

        token_response = generate_token(
            room_name,
            is_owner=True,
            user_name="Interviewer",
            enable_recording="local",
        )
        if not token_response:
            return JsonResponse({"error": "Token could not be generated."}, status=500)

        # ------ Placeholder -----#
        # The below code should be updated to save the video's recording URL into the interview round.
        # When S3 is integrated and usable with our Daily.co storage. This will have to be modifed once we have the actual recording url.
        interview_round.video_uri = f"www.teamsinta.com/{room_name}/epochtime.mp4"
        # ------ Placeholder -----#
        interview_round.save()

        return JsonResponse(
            {"room_data": room_response, "token": token_response["token"]}
        )

    def get(self, request, room_name):
        room_response = get_room_info(room_name)
        if not room_response:
            return JsonResponse(
                {"error": "Invalid room or room has expired."}, status=500
            )
        return JsonResponse(room_response)

    def delete(self, request):
        url = BASE_URL + "rooms"
        room_data_response = requests.get(url, headers=headers)
        rooms = room_data_response.json()
        room_list = []
        for room in rooms["data"]:
            room_list.append(room["name"])

        print(room_list)
        batch_url = BASE_URL + "batch/rooms"
        batch_response = requests.delete(
            batch_url, headers=headers, json={"room_names": room_list}
        )
        if not batch_response:
            return JsonResponse(
                {"error:" "Something went wrong with deleting the rooms."}, status=500
            )
        return JsonResponse(batch_response.json())


class Tokens(APIView):
    def post(self, request):
        room_name = request.data.get("room_name")
        if not room_name:
            return JsonResponse(
                {"error": "Missing correct 'room_name' in request body."}, status=500
            )

        room_exists_response = get_room_info(room_name)
        if not room_exists_response:
            return JsonResponse(
                {"error": "Room expired or does not exist."}, status=500
            )

        token_response = generate_token(room_name)
        if not token_response:
            return JsonResponse({"error": "Token could not be generated."}, status=500)

        return JsonResponse({"token": token_response["token"]})

    def get(self, request, token):
        # validates token and respnds with it's properties.
        url = f"https://api.daily.co/v1/meeting-tokens/{token}"
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return JsonResponse(response.json())
            else:
                return JsonResponse(
                    {"error": "Token invalid or could not be found."}, status=404
                )
        except requests.RequestException as e:
            return JsonResponse({"error: {e}"})
