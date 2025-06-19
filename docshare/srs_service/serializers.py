from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Document, DocumentShare

User = get_user_model()


# ✅ Summarized user information (used in owner/shared_with fields)
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


# ✅ Document sharing serializer (for POSTing share relationships)
class DocumentShareSerializer(serializers.ModelSerializer):
    document_id = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(),
        source='document',
        write_only=True
    )
    shared_with = UserSummarySerializer(read_only=True)
    shared_with_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='shared_with',
        write_only=True
    )

    class Meta:
        model = DocumentShare
        fields = [
            'id',
            'document_id',
            'shared_with',
            'shared_with_id',
            'can_edit',
            'shared_at'
        ]
        read_only_fields = ['id', 'shared_with', 'shared_at']


# ✅ Read-only serializer for full document details
class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSummarySerializer(read_only=True)
    shared_with = serializers.SerializerMethodField()
    is_shared = serializers.SerializerMethodField()
    content_html = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "content",
            "content_html",
            "owner",
            "is_shared",
            "shared_with",
            "created_at",
            "updated_at"
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
            "content_html"
        ]

    def get_shared_with(self, obj):
        # ✅ Returns shared users with edit rights (from DocumentShare model)
        return [
            {
                "id": share.shared_with.id,
                "username": share.shared_with.username,
                "can_edit": share.can_edit
            }
            for share in obj.shares.select_related("shared_with")
        ]

    def get_is_shared(self, obj):
        return obj.shares.exists()

    def get_content_html(self, obj):
        """
        Placeholder to convert JSON content to HTML if using TipTap/Quill.
        Replace with actual renderer later.
        """
        return "<div>[Rendered HTML Preview]</div>"


# ✅ For create/update operations only
class DocumentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['title', 'content']
