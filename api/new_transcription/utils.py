import json

import boto3
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings

from interview.models import InterviewRound, InterviewRoundQuestion
from interview_templates.models import TemplateQuestion


def get_transcript_from_s3(interview_round_id):
    """Fetches and returns transcript data from an S3 bucket."""
    interview_round = InterviewRound.objects.get(id=interview_round_id, deleted_at__isnull=True)
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    directory_path = f"teamsinta/{interview_round.meeting_room_id}/"
    bucket_name = "team-sinta"
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=directory_path)

    if "Contents" in response:
        transcript_file = None
        # Loop through the files in the directory to find the transcript JSON file
        for file in response["Contents"]:
            if file["Key"].endswith(".json"):
                transcript_file = file["Key"]
                break
    obj = s3.get_object(Bucket=bucket_name, Key=transcript_file)
    transcript_data = json.loads(obj["Body"].read().decode("utf-8"))
    return transcript_data


def post_questions_to_interview_round(interview_round_id):
    try:
        interview_round = InterviewRound.objects.get(id=interview_round_id)
        template_questions = TemplateQuestion.objects.filter(template_id=interview_round.template_id)

        for template_question in template_questions:
            InterviewRoundQuestion.objects.create(
                interview_round=interview_round,
                question=template_question,  # Here template_question should be a TemplateQuestion instance
            )
        print("Questions posted successfully.")
        return {"status": "success", "message": "Questions posted successfully."}
    except InterviewRound.DoesNotExist:
        return {"status": "error", "message": "Interview round not found."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def send_progress_update(interview_round_id, message):
    """
    Sends a progress update message for a specific interview round.
    """
    channel_layer = get_channel_layer()
    group_name = f"interview_{interview_round_id}"

    # Asynchronously send message to the group
    async_to_sync(channel_layer.group_send)(
        group_name, {"type": "transcription.update", "message": message}  # Custom event type for progress updates
    )
