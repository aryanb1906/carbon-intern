import logging
from rest_framework import viewsets, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.audits.models import AuditLogService
from .models import DataSource, UploadedFile
from .serializers import DataSourceSerializer, UploadedFileSerializer
from .services import IngestionPipeline

logger = logging.getLogger("carbontrace")


class DataSourceViewSet(viewsets.ModelViewSet):
    serializer_class   = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DataSource.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=["post"], url_path="sync")
    def sync(self, request, pk=None):
        source = self.get_object()
        source.sync_status = DataSource.SyncStatus.SYNCING
        source.save(update_fields=["sync_status"])
        # In production, kick off a Celery task here:
        # tasks.sync_source.delay(str(source.pk))
        return Response({"detail": "Sync queued.", "source_id": str(source.pk)})


class UploadedFileViewSet(viewsets.ModelViewSet):
    serializer_class   = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [parsers.MultiPartParser, parsers.FormParser]
    filter_backends    = [DjangoFilterBackend]
    filterset_fields   = ["parse_status", "source"]

    def get_queryset(self):
        return UploadedFile.objects.filter(organization=self.request.user.organization).select_related("source","uploaded_by")

    def perform_create(self, serializer):
        upload = serializer.save(
            organization=self.request.user.organization,
            uploaded_by=self.request.user,
            original_name=self.request.FILES["file_path"].name,
            file_size=self.request.FILES["file_path"].size,
            mime_type=self.request.FILES["file_path"].content_type,
        )
        AuditLogService.log(
            organization=self.request.user.organization,
            user=self.request.user,
            action="uploaded",
            obj=upload,
            new_value=upload.original_name,
            request=self.request,
        )
        # Trigger ingestion synchronously for demo; use Celery in production
        self._ingest(upload)

    def _ingest(self, upload: UploadedFile):
        upload.parse_status = UploadedFile.ParseStatus.PROCESSING
        upload.save(update_fields=["parse_status"])
        try:
            org_settings = upload.organization.settings
            sigma = org_settings.anomaly_sigma
        except Exception:
            sigma = 3.0
        pipeline = IngestionPipeline(upload, upload.organization, sigma=sigma)
        created, errors = pipeline.run()
        upload.parse_status = UploadedFile.ParseStatus.DONE if errors == 0 else UploadedFile.ParseStatus.ERROR
        upload.row_count   = created
        upload.error_count = errors
        upload.parse_log   = "\n".join(pipeline.log_lines)
        upload.save(update_fields=["parse_status","row_count","error_count","parse_log"])
