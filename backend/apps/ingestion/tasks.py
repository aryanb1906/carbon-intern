"""
Celery tasks for async ingestion processing.
Usage: tasks.process_uploaded_file.delay(str(upload_id))
"""
import logging
from celery import shared_task

logger = logging.getLogger("carbontrace")


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def process_uploaded_file(self, upload_id: str):
    """Parse and ingest an UploadedFile record into EmissionRecords."""
    from .models import UploadedFile
    from .services import IngestionPipeline
    try:
        upload = UploadedFile.objects.select_related("organization","source").get(pk=upload_id)
        pipeline = IngestionPipeline(upload, upload.organization)
        created, errors = pipeline.run()
        upload.parse_log   = "\n".join(pipeline.log_lines)
        upload.row_count   = created
        upload.error_count = errors
        upload.parse_status = "done" if errors == 0 else "error"
        upload.save(update_fields=["parse_log","row_count","error_count","parse_status"])
        logger.info("Ingested %s: %d created, %d errors", upload.original_name, created, errors)
        return {"created": created, "errors": errors}
    except UploadedFile.DoesNotExist:
        logger.error("UploadedFile %s not found", upload_id)
        return {"error": "not found"}
    except Exception as exc:
        logger.exception("Ingestion failed for %s", upload_id)
        raise self.retry(exc=exc)


@shared_task
def sync_data_source(source_id: str):
    """Trigger a sync for a DataSource (stub — extend with real connector)."""
    from django.utils import timezone
    from .models import DataSource
    try:
        src = DataSource.objects.get(pk=source_id)
        src.sync_status  = DataSource.SyncStatus.ACTIVE
        src.last_sync_at = timezone.now()
        src.save(update_fields=["sync_status","last_sync_at"])
        logger.info("Synced source: %s", src.name)
    except DataSource.DoesNotExist:
        logger.error("DataSource %s not found", source_id)
