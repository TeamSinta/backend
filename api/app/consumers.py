import json

from channels.generic.websocket import AsyncWebsocketConsumer


class InterviewTranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.interview_round_id = self.scope["url_route"]["kwargs"]["interview_round_id"]
        self.group_name = f"interview_{self.interview_round_id}"
        print("connecting")

        # Join the specific interview group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket is closed
        print("disconneting")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def transcription_update(self, event):
        # Handle transcription update events and send the message to WebSocket
        # This method name matches the 'type': 'transcription.update' in group_send
        await self.send(text_data=json.dumps({"type": "update", "message": event["message"]}))

    async def receive(self, text_data=None, bytes_data=None):
        # Handle incoming messages from WebSocket
        # This can be useful if you want to receive messages from the client
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]

        # Process different types of messages
        if message_type == "update_request":
            await self.send_progress_update("Processing your update request...")

    async def send_progress_update(self, message):
        # Function to send a progress update
        await self.send(text_data=json.dumps({"type": "progress_update", "message": message}))

    async def transcription_error(self, event):
        # Handle transcription error messages
        await self.send(text_data=json.dumps({"type": "transcription_error", "message": event["message"]}))

    async def transcription_generation_completed(self, event):
        # Handle transcription generation completion messages
        await self.send(text_data=json.dumps({"type": "transcription_completed", "message": event["message"]}))
