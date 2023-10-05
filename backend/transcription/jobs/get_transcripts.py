# TODO: Refactor and turn into a class u function boi
import requests
import json
import time
import os
from dotenv import dotenv_values
from moviepy.editor import VideoFileClip
from interview.models import InterviewRoundQuestion, InterviewRound
from question_response.models import Answer

BASE_URL = "https://api.assemblyai.com/v2"
TRANSCRIPT_ENDPOINT = f"{BASE_URL}/transcript"


def generate_wav_from_video(video_path):
    video_filename = os.path.basename(video_path)
    audio_filename = os.path.splitext(video_filename)[0] + ".wav"
    audio_path = os.path.join(os.path.dirname(video_path), audio_filename)

    print(audio_path)

    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path, codec="pcm_s16le")

    return audio_path


def convert_to_minutes(milliseconds):
    minutes = time.strftime("%M:%S", time.gmtime(milliseconds / 1000))
    return minutes


def _generate_headers():
    # TODO: Get the .env file from cloud storage
    env_values = dotenv_values("/backend/.env")
    headers = {
        "authorization": env_values["ASSEMBLY_AI_KEY"],
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
        interview_round.save()
        return True
    except Exception as e:
        print(e)
        raise RuntimeError(f"Failed to save interview round: {e}")
