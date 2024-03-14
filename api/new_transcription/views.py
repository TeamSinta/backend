import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .tasks import create_transcription_bot


@csrf_exempt
@require_POST
def start_transcription(request):
    data = json.loads(request.body)
    meeting_url = data.get("meeting_url")
    interview_round_id = data.get("interviewRoundID")  # Get interviewRoundID from the request

    if not meeting_url or not interview_round_id:
        return JsonResponse({"error": "Meeting URL and Interview Round ID are required."}, status=400)

    # Pass both meeting_url and interview_round_id to the Celery task
    create_transcription_bot.delay(meeting_url, interview_round_id)
    return JsonResponse({"message": "Transcription started."})
