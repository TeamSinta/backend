# TODO: Refactor and turn into a class u function boi
import json
import os
import time

import boto3
import ffmpeg
import requests
from botocore.exceptions import NoCredentialsError
from django.conf import settings

from interview.models import InterviewRound

BASE_URL = "https://api.assemblyai.com/v2"
TRANSCRIPT_ENDPOINT = f"{BASE_URL}/transcript"
ASSEMBLY_AI_KEY = os.environ.get("ASSEMBLY_AI_KEY")


# Upload JSON file to S3 bucket
def upload_to_s3(local_file_path, bucket_name, s3_file_name):
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        s3.upload_file(local_file_path, bucket_name, s3_file_name)
        print("File uploaded successfully to S3")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False


def generate_wav_from_video(video_path):
    audio_path = video_path.rsplit(".", 1)[0] + ".wav"

    # Extract audio using ffmpeg with overwrite option
    ffmpeg.input(video_path).output(audio_path, acodec="pcm_s16le", ar="44100", y=None).run()

    return audio_path


def convert_to_minutes(milliseconds):
    minutes = time.strftime("%M:%S", time.gmtime(milliseconds / 1000))
    return minutes


def _generate_headers():
    headers = {
        "authorization": ASSEMBLY_AI_KEY,
        "Content-Type": "application/json",
    }
    return headers


def generate_transcriptions_from_assembly(interview_round_id, video_path):
    # TODO: Clean up video and audio path
    headers = _generate_headers()
    audio_path = generate_wav_from_video(video_path)
    audio_filename = os.path.splitext(os.path.basename(audio_path))[0]
    audio_path_root = os.path.dirname(audio_path)

    transcription_json = f"{audio_path_root}/{audio_filename}_transcription_result.json"

    if os.path.exists(transcription_json):
        os.remove(transcription_json)

    with open(audio_path, "rb") as f:
        response = requests.post(BASE_URL + "/upload", headers=headers, data=f)

        print(response.json())

        upload_url = response.json()["upload_url"]

    # request parameters where Speaker Diarization has been enabled
    # TODO: Modify speakers expected based on interview data
    data = {"audio_url": upload_url, "speaker_labels": True, "speakers_expected": 2}

    response = requests.post(TRANSCRIPT_ENDPOINT, json=data, headers=headers)

    # polling for transcription completion
    polling_endpoint = f"{TRANSCRIPT_ENDPOINT}/{response.json()['id']}"

    while True:
        transcription_result = requests.get(polling_endpoint, headers=headers).json()

        if transcription_result["status"] == "completed":
            with open(transcription_json, "a+") as file:
                file.seek(0)  # Move the file pointer to the beginning
                content = file.read().strip()
                if content:
                    file.write("\n")  # Add a newline if the file is not empty
                json.dump(transcription_result, file, indent=2)
            break
        elif transcription_result["status"] == "error":
            raise RuntimeError(f"Transcription failed: {transcription_result['error']}")
        else:
            time.sleep(3)

    # TODO: CONFIRM WHETHER THE SPEAKER LABELS ARE CORRECT

    interview_round = InterviewRound.objects.get(id=interview_round_id)
    interview_round.video_uri = video_path
    interview_round.transcription_file_uri = transcription_json

    try:
        #  # Upload transcription JSON file to S3 with interview round ID in its name
        # s3_file_name = f"{interview_round_id}_transcription_result.json"
        # success = upload_to_s3(transcription_json, 'sinta-media', s3_file_name)

        # if success:
        #     # Update interview round with S3 bucket information
        #     # interview_round.transcription_file_uri = f"s3://team-sinta/{s3_file_name}"
        #     interview_round.save()
        #     print("Interview round saved with S3 bucket information.")
        # else:
        #     print("Failed to upload JSON file to S3.")
        interview_round.save()
        return True
    except Exception as e:
        print(e)
        raise RuntimeError(f"Failed to save interview round: {e}")
