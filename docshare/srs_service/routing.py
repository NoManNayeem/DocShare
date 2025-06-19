from django.urls import re_path
from . import consumers

# Define WebSocket routes for document collaboration
websocket_urlpatterns = [
    re_path(
        r"^ws/doc/(?P<doc_id>[a-zA-Z0-9_-]+)/$",  # supports doc IDs like abc-123_DEF
        consumers.DocumentSyncConsumer.as_asgi()
    ),
]
