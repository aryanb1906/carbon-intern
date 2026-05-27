from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class   = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["action", "content_type", "user"]
    search_fields      = ["object_id", "field_name", "old_value", "new_value"]
    ordering_fields    = ["timestamp"]
    ordering           = ["-timestamp"]

    def get_queryset(self):
        return (
            AuditLog.objects
            .filter(organization=self.request.user.organization)
            .select_related("user")
        )
