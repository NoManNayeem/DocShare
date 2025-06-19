from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.JSONField(
        blank=True,
        null=True,
        help_text="Stores rich text content (e.g., Quill.js or Tiptap JSON structure)"
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents",
        help_text="The creator of the document"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-updated_at']  # Optional: show most recently updated docs first


class DocumentShare(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="shares",
        help_text="The document being shared"
    )
    shared_with = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_shares",
        help_text="The user this document is shared with"
    )
    can_edit = models.BooleanField(default=False, help_text="Whether the shared user can edit the document")
    shared_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('document', 'shared_with')
        verbose_name = "Shared Document"
        verbose_name_plural = "Shared Documents"

    def __str__(self):
        return f"{self.shared_with.username} - {self.document.title}"
