from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg.openapi import Info
from rest_framework.permissions import AllowAny
from django.views.generic import TemplateView

schema_view = get_schema_view(
    Info(
        title="DocShare API",
        default_version="v1",
        description="Collaborative Document Sharing App",
    ),
    public=True,
    permission_classes=[AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('srs_service.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api-auth/', include('rest_framework.urls')),

    # Swagger JSON
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    
    # Custom Swagger UI template using CDN
    path('swagger/', TemplateView.as_view(template_name='drf_yasg/swagger-ui.html'), name='swagger-ui'),
]
