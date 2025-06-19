from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentShareViewSet, UserListView

# DRF Router for ViewSets
router = DefaultRouter()
router.register(r"documents", DocumentViewSet, basename="document")
router.register(r"shares", DocumentShareViewSet, basename="share")

# URL patterns
urlpatterns = [
    path("", include(router.urls)),
    path("users/", UserListView.as_view(), name="user-list"),
]
