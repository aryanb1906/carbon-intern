import uuid
from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    class Action(models.TextChoices):
        CREATED  = "created",  "Created"
        UPDATED  = "updated",  "Updated"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        FLAGGED  = "flagged",  "Flagged"
        DELETED  = "deleted",  "Deleted"
        UPLOADED = "uploaded", "File Uploaded"
        EXPORTED = "exported", "Exported"
        LOGIN    = "login",    "Login"
        LOGOUT   = "logout",   "Logout"

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization  = models.ForeignKey("organizations.Organization", on_delete=models.CASCADE, related_name="audit_logs")
    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name="audit_logs"
    )
    action        = models.CharField(max_length=20, choices=Action.choices)

    # Polymorphic reference to the target object
    content_type  = models.CharField(max_length=100, blank=True)   # e.g. "emission_record"
    object_id     = models.CharField(max_length=100, blank=True)   # UUID or PK as str

    # Change tracking
    field_name    = models.CharField(max_length=100, blank=True)
    old_value     = models.TextField(blank=True, null=True)
    new_value     = models.TextField(blank=True, null=True)

    # Extra context
    ip_address    = models.GenericIPAddressField(null=True, blank=True)
    user_agent    = models.CharField(max_length=500, blank=True)
    metadata      = models.JSONField(default=dict, blank=True)

    timestamp     = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-timestamp"]
        indexes  = [
            models.Index(fields=["organization", "action"]),
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return f"{self.user} {self.action} {self.content_type}:{self.object_id}"


class AuditLogService:
    """Thin service to create audit log entries from anywhere."""

    @staticmethod
    def log(*, organization, user, action, obj=None, field_name="",
            old_value=None, new_value=None, metadata=None, request=None):
        ip = None
        ua = ""
        if request:
            ip = request.META.get("REMOTE_ADDR")
            ua = request.META.get("HTTP_USER_AGENT", "")[:500]

        content_type = type(obj).__name__.lower() if obj else ""
        object_id    = str(getattr(obj, "pk", "")) if obj else ""

        return AuditLog.objects.create(
            organization=organization,
            user=user,
            action=action,
            content_type=content_type,
            object_id=object_id,
            field_name=field_name,
            old_value=str(old_value) if old_value is not None else None,
            new_value=str(new_value) if new_value is not None else None,
            ip_address=ip,
            user_agent=ua,
            metadata=metadata or {},
        )
