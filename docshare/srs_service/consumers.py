import json
import random
import jwt

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.conf import settings

User = get_user_model()
user_colors = {}

class DocumentSyncConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.doc_id = self.scope["url_route"]["kwargs"]["doc_id"]
        self.room_group_name = f"doc_{self.doc_id}"

        # Authenticate user from query token
        token = self.get_token_from_query_string(self.scope["query_string"].decode())
        self.scope["user"] = await self.get_user_from_token(token)

        # Assign display name
        self.username = (
            self.scope["user"].username
            if self.scope["user"].is_authenticated
            else f"Guest_{self.channel_name[-5:]}"
        )

        # Assign a color to user
        if self.username not in user_colors:
            user_colors[self.username] = self.assign_color()

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Notify others that a user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user.join",
                "username": self.username,
                "color": user_colors[self.username],
            },
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user.leave",
                "username": self.username,
            },
        )
        user_colors.pop(self.username, None)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("message")
            cursor = data.get("cursor")  # Optional: cursor data

            if message is None and cursor is None:
                raise ValueError("Empty payload.")

            payload = {
                "type": "document.message",
                "username": self.username,
                "color": user_colors.get(self.username),
            }

            if message:
                payload["message"] = message
            if cursor:
                payload["cursor"] = cursor

            await self.channel_layer.group_send(self.room_group_name, payload)

        except (json.JSONDecodeError, ValueError):
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Invalid WebSocket message format."
            }))

    async def document_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event.get("message"),
            "username": event["username"],
            "color": event["color"],
            "cursor": event.get("cursor"),  # Optional: forward cursor
        }))

    async def user_join(self, event):
        await self.send(text_data=json.dumps({
            "type": "join",
            "username": event["username"],
            "color": event["color"],
        }))

    async def user_leave(self, event):
        await self.send(text_data=json.dumps({
            "type": "leave",
            "username": event["username"],
        }))

    def assign_color(self):
        palette = [
            "#f94144", "#f3722c", "#f9c74f", "#90be6d",
            "#43aa8b", "#577590", "#277da1", "#f9844a"
        ]
        assigned = set(user_colors.values())
        for color in palette:
            if color not in assigned:
                return color
        return random.choice(palette)  # fallback

    def get_token_from_query_string(self, query_string):
        parts = query_string.split("&")
        for part in parts:
            if part.startswith("token="):
                return part.split("=", 1)[1]
        return None

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            if not token:
                return AnonymousUser()
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            return User.objects.get(id=user_id)
        except Exception:
            return AnonymousUser()
