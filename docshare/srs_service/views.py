from itertools import chain
from django.contrib.auth import get_user_model
from django.db import models
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


# ✅ Handles both owned and shared document retrieval
class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Prevent errors during Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()

        user = self.request.user

        # Documents owned by the user
        owned_docs = Document.objects.filter(owner=user)

        # Documents shared with the user
        shared_doc_ids = DocumentShare.objects.filter(
            shared_with=user
        ).values_list("document_id", flat=True)
        shared_docs = Document.objects.filter(id__in=shared_doc_ids)

        # Combine and deduplicate documents
        combined_docs = list({doc.id: doc for doc in chain(owned_docs, shared_docs)}.values())
        return combined_docs

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DocumentCreateUpdateSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        user = request.user
        doc_id = kwargs.get("pk")

        try:
            # Allow access to owned or shared documents
            document = Document.objects.get(
                models.Q(id=doc_id) & (
                    models.Q(owner=user) |
                    models.Q(id__in=DocumentShare.objects.filter(
                        shared_with=user
                    ).values_list("document_id", flat=True))
                )
            )
        except Document.DoesNotExist:
            return Response({"error": "Document not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(document)
        return Response(serializer.data)


# ✅ Handles document sharing: add, edit, remove share permissions
class DocumentShareViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Prevent errors during Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return DocumentShare.objects.none()

        return DocumentShare.objects.filter(
            document__owner=self.request.user
        ).select_related("document", "shared_with")

    def destroy(self, request, *args, **kwargs):
        """Allow only the owner to revoke sharing"""
        instance = self.get_object()
        if instance.document.owner != request.user:
            return Response({"error": "Only the owner can unshare this document."}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Allow only the owner to update 'can_edit' rights"""
        instance = self.get_object()
        if instance.document.owner != request.user:
            return Response({"error": "Only the owner can update sharing permissions."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)


# ✅ Returns a list of all users excluding the current user
class UserListView(ListAPIView):
    serializer_class = UserSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)
