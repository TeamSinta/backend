# bot.py adapted for Django
import io
import json
import logging
import os
import queue
import threading
import time
import uuid
import wave
from functools import cache

import boto3
import requests
from daily import CallClient, Daily, EventHandler
from django.conf import settings
from openai import OpenAI

from .utils import post_questions_to_interview_round

LOG = logging.getLogger(__name__)
DAILY_API_KEY = os.environ.get("DAILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")


@cache
def get_openai_client():
    """Cache and return an OpenAI client using the API key from Django settings."""
    return OpenAI(api_key=OPENAI_API_KEY)


class CustomEventHandler(EventHandler):
    """Custom event handler for Daily.co call events."""

    def __init__(self, receiver):
        self._receiver = receiver

    def on_participant_counts_updated(self, counts):
        print(f"Participant counts updated: {counts}")
        if counts["present"] == 0:
            self._receiver.leave()


def create_meeting_token():
    """Create a meeting token for Daily.co using the API key from Django settings."""
    url = "https://api.daily.co/v1/meeting-tokens"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {DAILY_API_KEY}"}
    payload = {"properties": {"permissions": {"hasPresence": False}}}
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print(response.status_code)
    if response.status_code == 200:
        return response.json()["token"]
    else:
        raise Exception(f"Failed to create meeting token: {response.text}")


class TranscriptionBot:
    """A bot for joining a meeting and transcribing audio."""

    def __init__(self, meeting_url, interview_round_id):
        self._id = str(uuid.uuid4())
        self.interview_round_id = interview_round_id
        self.meeting_url = meeting_url
        self.accumulated_buffer = bytearray()
        self._upload_buffer = bytearray()
        self._audio_queue = queue.Queue()

        print("Creating speaker device")
        self.__speaker_device = Daily.create_speaker_device("my-speaker", sample_rate=16000, channels=1)

        print("Selecting speaker device")
        Daily.select_speaker_device("my-speaker")

        self.__client = CallClient(event_handler=CustomEventHandler(self))
        self.__client.update_subscription_profiles({"base": {"camera": "unsubscribed", "microphone": "subscribed"}})

        self.__app_quit = False
        self.__app_error = None
        self.__start_event = threading.Event()

        self.__thread = threading.Thread(target=self.receive_audio)
        self.__transcription_thread = threading.Thread(target=self.transcribe_audio)
        self.__thread.start()
        self.__transcription_thread.start()

    def on_joined(self, data, error):
        if error:
            print(f"Unable to join meeting: {error}")
            self.__app_error = error
        else:
            self.__start_event.set()
            result = post_questions_to_interview_round(self.interview_round_id)
            if result["status"] == "success":
                print(result["message"])
            else:
                print(result["message"])

    def run(self):
        """Join a meeting and start the audio transcription process."""
        try:
            print("Creating meeting token...")
            token = create_meeting_token()
            print(f"Meeting token created successfully: {token}")

            print(f"Attempting to join the meeting at {self.meeting_url}...")
            self.__client.join(self.meeting_url, meeting_token=token, completion=self.on_joined)

            print("Waiting for audio reception thread to join...")
            self.__thread.join()
            print("Audio reception thread joined successfully.")
            print("Waiting for transcription thread to join...")
            self.__transcription_thread.join()
            print("Transcription thread joined successfully.")

            print(f"Attempting to post questions for interview round ID: {self.interview_round_id}...")

        except Exception as e:
            print(f"An exception occurred during the run process: {e}")

    def leave(self):
        """Leave the meeting and stop audio transcription, then upload transcript."""
        self.__app_quit = True
        self.__client.leave()
        self.__thread.join()
        self.__transcription_thread.join()
        print("Leaving Call")
        if self._upload_buffer:
            print("starting s3 upload Call")
            self.upload_transcript_to_s3(self._upload_buffer)
            self._upload_buffer = bytearray()
        if self.__client:
            try:
                self.__client.leave()
                print("Successfully left the meeting.")
            except Exception as e:
                print(f"Error leaving the meeting: {e}")
            try:
                self.__client.release()
                print("Daily.co client resources released.")
            except Exception as e:
                print(f"Error releasing CallClient resources: {e}")
            try:
                Daily.deinit()
                print("SDK resources deallocated.")
            except Exception as e:
                print(f"Error deallocating SDK resources: {e}")

    def upload_transcript_to_s3(self, transcription_json):
        # Extract the meeting ID from the URL
        meeting_id = self.meeting_url.split("/")[-1]
        object_key = f"teamsinta/{meeting_id}/transcription.json"
        bucket_name = "team-sinta"

        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        try:
            s3_client.put_object(Body=transcription_json, Bucket=bucket_name, Key=object_key)
            print(f"Transcription uploaded successfully to S3 at key {object_key}.")
            self.trigger_summarization_task()
        except Exception as e:
            print(f"Failed to upload transcription to S3: {e}")

    def trigger_summarization_task(self):
        # Code to trigger the summarization task using only the interview_round_id
        url = f"http://localhost:8000/api/question_response/question_summarized_answers/{self.interview_round_id}/"
        headers = {"Content-Type": "application/json"}
        payload = {"interview_round_id": self.interview_round_id}

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200 and "Processing initiated" in response.text:
            print("Summarization task initiated successfully.")
        else:
            print(f"Failed to trigger summarization task: {response.text}")

    def receive_audio(self):
        """Receive audio from the meeting and enqueue it for transcription."""
        self.__start_event.wait()
        if self.__app_error:
            return

        while not self.__app_quit:
            buffer = self.__speaker_device.read_frames(1600)
            if buffer:
                self._audio_queue.put(buffer)

    import io


def transcribe_audio(self):
    last_transcription_time = time.time()
    transcriptions = []  # List to accumulate transcription texts

    while not self.__app_quit:
        try:
            buffer = self._audio_queue.get(timeout=1)
            self.accumulated_buffer += buffer  # Add to transcription buffer

            if time.time() - last_transcription_time >= 60:
                if self.accumulated_buffer:
                    print("Starting new transcription")
                    # Create a BytesIO object for the WAV format
                    audio_stream = io.BytesIO()
                    with wave.open(audio_stream, "wb") as wf:
                        wf.setnchannels(1)  # Assuming mono audio
                        wf.setsampwidth(2)  # Assuming 16 bits per sample
                        wf.setframerate(16000)  # Assuming a sample rate of 16000 Hz
                        wf.writeframes(self.accumulated_buffer)

                    # Seek to the beginning of the BytesIO object
                    audio_stream.seek(0)

                    # Directly use the stream for transcription
                    transcript_text = get_openai_client().audio.transcriptions.create(
                        model="whisper-1", language="en", file=audio_stream, response_format="text"
                    )
                    print(f"Transcription: {transcript_text}")

                    transcriptions.append(transcript_text)

                    self.accumulated_buffer = bytearray()

                last_transcription_time = time.time()

        except queue.Empty:
            continue

    if transcriptions:
        # Package accumulated transcriptions as JSON for S3 upload
        transcription_json = json.dumps({"transcriptions": transcriptions}).encode("utf-8")
        self.upload_transcript_to_s3(transcription_json)


def start_bot(meeting_url, interview_round_id):
    """Initialize the Daily.co client and start the bot."""
    try:
        print("Initializing Daily.co client...")
        Daily.init()
        print("Daily.co client initialized successfully.")

        print(
            f"Creating TranscriptionBot for meeting_url: {meeting_url} and interview_round_id: {interview_round_id}..."
        )
        bot = TranscriptionBot(meeting_url=meeting_url, interview_round_id=interview_round_id)
        print("TranscriptionBot created successfully.")

        print("Running TranscriptionBot...")
        bot.run()
        print("TranscriptionBot run completed successfully.")
    except Exception as e:
        print(f"Bot run exception: {e}")
        try:
            print("Attempting to leave the call due to exception...")
            bot.leave()
            print("Left the call successfully after exception.")
        except Exception as leave_exception:
            print(f"Exception occurred while leaving the call: {leave_exception}")
    finally:
        print("Finalizing bot operation, ensuring clean exit...")
        time.sleep(1)  # Ensure clean exit
        print("Bot operation finalized.")
        if bot is not None:  # Check if `bot` has been initialized
            bot.leave()
