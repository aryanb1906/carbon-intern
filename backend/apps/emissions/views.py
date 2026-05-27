import logging
from django.utils import timezone
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.audits.models import AuditLogService
from .models import EmissionRecord
from .serializers import EmissionRecordSerializer, EmissionRecordReviewSerializer, DashboardStatsSerializer
from .services import DashboardService
from .filters import EmissionRecordFilter

logger = logging.getLogger("carbontrace")


class EmissionRecordViewSet(viewsets.ModelViewSet):
    serializer_class   = EmissionRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class    = EmissionRecordFilter
    search_fields      = ["facility", "category", "source_type", "department", "cost_center"]
    ordering_fields    = ["activity_date", "co2e", "risk_score", "created_at"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        return (
            EmissionRecord.objects
            .filter(organization=self.request.user.organization)
            .select_related("reviewer", "uploaded_file")
        )

    def perform_create(self, serializer):
        record = serializer.save(organization=self.request.user.organization)
        AuditLogService.log(
            organization=self.request.user.organization,
            user=self.request.user,
            action="created",
            obj=record,
            request=self.request,
        )

    @action(detail=True, methods=["post"], url_path="review")
    def review(self, request, pk=None):
        record = self.get_object()
        serializer = EmissionRecordReviewSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        old_status = record.status
        record = serializer.save(
            reviewer=request.user,
            reviewed_at=timezone.now(),
        )

        AuditLogService.log(
            organization=request.user.organization,
            user=request.user,
            action=record.status,
            obj=record,
            field_name="status",
            old_value=old_status,
            new_value=record.status,
            request=request,
        )

        return Response(EmissionRecordSerializer(record).data)

    @action(detail=False, methods=["post"], url_path="bulk-review")
    def bulk_review(self, request):
        ids      = request.data.get("ids", [])
        action_v = request.data.get("action")
        note     = request.data.get("note", "")

        if action_v not in ["approved", "rejected", "flagged"]:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        qs = self.get_queryset().filter(pk__in=ids)
        updated = 0
        for record in qs:
            old = record.status
            record.status    = action_v
            record.reviewer  = request.user
            record.reviewed_at = timezone.now()
            record.review_note = note
            record.save(update_fields=["status", "reviewer", "reviewed_at", "review_note"])
            AuditLogService.log(
                organization=request.user.organization,
                user=request.user,
                action=action_v,
                obj=record,
                field_name="status",
                old_value=old,
                new_value=action_v,
                request=request,
            )
            updated += 1

        return Response({"updated": updated})


class DashboardView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        stats = DashboardService.stats(request.user.organization)
        return Response(stats)
