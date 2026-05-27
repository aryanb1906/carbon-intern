import uuid
from django.db import models
from django.conf import settings


class DataSource(models.Model):
    class SourceType(models.TextChoices):
        SAP     = "sap",     "SAP ERP"
        UTILITY = "utility", "Utility Bills"
        TRAVEL  = "travel",  "Corporate Travel"
        CUSTOM  = "custom",  "Custom CSV"

    class SyncStatus(models.TextChoices):
        ACTIVE   = "active",   "Active"
        SYNCING  = "syncing",  "Syncing"
        ERROR    = "error",    "Error"
        INACTIVE = "inactive", "Inactive"

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey("organizations.Organization", on_delete=models.CASCADE, related_name="data_sources")
    name         = models.CharField(max_length=255)
    source_type  = models.CharField(max_length=20, choices=SourceType.choices)
    sync_status  = models.CharField(max_length=20, choices=SyncStatus.choices, default=SyncStatus.ACTIVE)
    last_sync_at = models.DateTimeField(null=True, blank=True)
    config       = models.JSONField(default=dict, blank=True)
    error_count  = models.PositiveIntegerField(default=0)
    record_count = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "data_sources"
        unique_together = [("organization", "name")]

    def __str__(self):
        return f"{self.name} ({self.get_source_type_display()})"


class UploadedFile(models.Model):
    class ParseStatus(models.TextChoices):
        PENDING    = "pending",    "Pending"
        PROCESSING = "processing", "Processing"
        DONE       = "done",       "Done"
        ERROR      = "error",      "Error"

    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization   = models.ForeignKey("organizations.Organization", on_delete=models.CASCADE, related_name="uploaded_files")
    source         = models.ForeignKey(DataSource, on_delete=models.SET_NULL, null=True, related_name="files")
    uploaded_by    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="uploads")
    original_name  = models.CharField(max_length=500)
    file_path      = models.FileField(upload_to="uploads/%Y/%m/")
    file_size      = models.PositiveBigIntegerField(default=0)
    mime_type      = models.CharField(max_length=100, blank=True)
    parse_status   = models.CharField(max_length=20, choices=ParseStatus.choices, default=ParseStatus.PENDING)
    parse_log      = models.TextField(blank=True)
    row_count      = models.PositiveIntegerField(default=0)
    error_count    = models.PositiveIntegerField(default=0)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "uploaded_files"
        ordering = ["-created_at"]

    def __str__(self):
        return self.original_name
