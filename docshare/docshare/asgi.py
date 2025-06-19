import os
import django

# ✅ Set the default settings module before importing any Django code
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "docshare.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import srs_service.routing

# ✅ ASGI application instance that supports both HTTP and WebSocket protocols
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            srs_service.routing.websocket_urlpatterns
        )
    ),
})
