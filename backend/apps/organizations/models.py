import uuid
from django.db import models


class Organization(models.Model):
    class Industry(models.TextChoices):
        MANUFACTURING = "manufacturing", "Manufacturing"
        ENERGY        = "energy",        "Energy"
        TRANSPORT     = "transport",     "Transport & Logistics"
        RETAIL        = "retail",        "Retail"
        FINANCE       = "finance",       "Finance & Insurance"
        TECHNOLOGY    = "technology",    "Technology"
        HEALTHCARE    = "healthcare",    "Healthcare"
        OTHER         = "other",         "Other"

    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name      = models.CharField(max_length=255)
    slug      = models.SlugField(max_length=100, unique=True)
    industry  = models.CharField(max_length=50, choices=Industry.choices, default=Industry.OTHER)
    country   = models.CharField(max_length=2, default="DE")
    currency  = models.CharField(max_length=3, default="EUR")
    base_year = models.PositiveSmallIntegerField(default=2020)
    logo_url  = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "organizations"
        ordering = ["name"]

    def __str__(self):
        return self.name


class OrganizationSettings(models.Model):
    organization          = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name="settings")
    emission_factor_set   = models.CharField(max_length=50, default="IPCC_AR6_2021")
    anomaly_sigma         = models.FloatField(default=3.0)
    auto_approve_low_risk = models.BooleanField(default=False)
    notify_on_flag        = models.BooleanField(default=True)
    notify_email          = models.EmailField(blank=True)
    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "organization_settings"
