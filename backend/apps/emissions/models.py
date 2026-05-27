import uuid
from django.db import models
from django.conf import settings


class EmissionRecord(models.Model):
    class Scope(models.IntegerChoices):
        SCOPE_1 = 1, "Scope 1 – Direct"
        SCOPE_2 = 2, "Scope 2 – Electricity"
        SCOPE_3 = 3, "Scope 3 – Value Chain"

    class Status(models.TextChoices):
        PENDING  = "pending",  "Pending Review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        FLAGGED  = "flagged",  "Flagged"

    class RiskLevel(models.TextChoices):
        LOW    = "low",    "Low"
        MEDIUM = "medium", "Medium"
        HIGH   = "high",   "High"

    class Category(models.TextChoices):
        NATURAL_GAS  = "natural_gas",  "Natural Gas"
        DIESEL       = "diesel",       "Diesel"
        PETROL       = "petrol",       "Petrol"
        LPG          = "lpg",          "LPG"
        ELECTRICITY  = "electricity",  "Electricity"
        STEAM        = "steam",        "District Steam"
        AIR_TRAVEL   = "air_travel",   "Air Travel"
        RAIL         = "rail",         "Rail"
        HOTEL        = "hotel",        "Hotel"
        ROAD         = "road",         "Road Transport"
        SEA          = "sea",          "Sea Freight"
        OTHER        = "other",        "Other"

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization     = models.ForeignKey("organizations.Organization", on_delete=models.CASCADE, related_name="emission_records")
    uploaded_file    = models.ForeignKey("ingestion.UploadedFile", on_delete=models.SET_NULL, null=True, related_name="records")
    source_type      = models.CharField(max_length=20, blank=True)

    # Activity data
    category         = models.CharField(max_length=30, choices=Category.choices, default=Category.OTHER)
    scope            = models.IntegerField(choices=Scope.choices)
    activity_date    = models.DateField()
    facility         = models.CharField(max_length=255, blank=True)
    department       = models.CharField(max_length=255, blank=True)
    cost_center      = models.CharField(max_length=100, blank=True)

    # Raw values
    activity_value   = models.FloatField()
    unit             = models.CharField(max_length=50)

    # Normalized / calculated
    normalized_value = models.FloatField(null=True, blank=True)
    normalized_unit  = models.CharField(max_length=50, blank=True)
    emission_factor  = models.FloatField(null=True, blank=True)
    emission_factor_source = models.CharField(max_length=100, blank=True)
    co2e             = models.FloatField(null=True, blank=True)

    # Review state
    status           = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    risk_score       = models.FloatField(default=0.0)
    risk_level       = models.CharField(max_length=10, choices=RiskLevel.choices, default=RiskLevel.LOW)
    anomaly_flags    = models.JSONField(default=list, blank=True)
    reviewer         = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="reviewed_records"
    )
    reviewed_at      = models.DateTimeField(null=True, blank=True)
    review_note      = models.TextField(blank=True)

    # Raw import row for traceability
    raw_data         = models.JSONField(default=dict, blank=True)

    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "emission_records"
        ordering = ["-created_at"]
        indexes  = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "scope"]),
            models.Index(fields=["organization", "activity_date"]),
            models.Index(fields=["risk_level"]),
        ]

    def __str__(self):
        return f"{self.get_category_display()} – {self.activity_date} ({self.get_scope_display()})"
