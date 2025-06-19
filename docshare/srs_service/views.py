from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from .models import Document, DocumentShare
from .serializers import (
    DocumentSerializer,
    DocumentCreateUpdateSerializer,
    DocumentShareSerializer,
    UserSummarySerializer,
)

User = get_user_model()


# ✅ Handles document CRUD with owner and shared-user access
class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Prevent errors during schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()

        user = self.request.user

        # Documents owned or shared with the user
        owned_doc_ids = Document.objects.filter(owner=user).values_list("id", flat=True)
        shared_doc_ids = DocumentShare.objects.filter(shared_with=user).values_list("document_id", flat=True)

        # Combined QuerySet of accessible document IDs
        accessible_ids = list(owned_doc_ids) + list(shared_doc_ids)
        return Document.objects.filter(id__in=accessible_ids)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DocumentCreateUpdateSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ✅ Manages sharing (grant/edit/revoke permissions)
class DocumentShareViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return DocumentShare.objects.none()

        return DocumentShare.objects.filter(
            document__owner=self.request.user
        ).select_related("document", "shared_with")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.document.owner != request.user:
            return Response(
                {"error": "Only the owner can unshare this document."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.document.owner != request.user:
            return Response(
                {"error": "Only the owner can update sharing permissions."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)


# ✅ Returns list of all users except the requester (used in share dropdown)
class UserListView(ListAPIView):
    serializer_class = UserSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)
