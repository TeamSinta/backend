import json

from channels.generic.websocket import AsyncWebsocketConsumer


class InterviewTranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        interview_round_id = self.scope["url_route"]["kwargs"]["interview_round_id"]
        self.group_name = f"interview_{interview_round_id}"

        # Join the specific interview group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket is closed
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def transcription_generation_completed(self, event):
        # Send SSE notification when transcription generation is completed
        await self.send(text_data=json.dumps({"message": event["message"]}))
