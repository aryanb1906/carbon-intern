from django.db import migrations, models
import uuid

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Organization",
            fields=[
                ("id",        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ("name",      models.CharField(max_length=255)),
                ("slug",      models.SlugField(max_length=100, unique=True)),
                ("industry",  models.CharField(max_length=50, default="other")),
                ("country",   models.CharField(max_length=2, default="DE")),
                ("currency",  models.CharField(max_length=3, default="EUR")),
                ("base_year", models.PositiveSmallIntegerField(default=2020)),
                ("logo_url",  models.URLField(blank=True, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at",models.DateTimeField(auto_now_add=True)),
                ("updated_at",models.DateTimeField(auto_now=True)),
            ],
            options={"db_table": "organizations", "ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="OrganizationSettings",
            fields=[
                ("id",                    models.BigAutoField(primary_key=True)),
                ("organization",          models.OneToOneField("organizations.Organization", on_delete=models.deletion.CASCADE, related_name="settings")),
                ("emission_factor_set",   models.CharField(max_length=50, default="IPCC_AR6_2021")),
                ("anomaly_sigma",         models.FloatField(default=3.0)),
                ("auto_approve_low_risk", models.BooleanField(default=False)),
                ("notify_on_flag",        models.BooleanField(default=True)),
                ("notify_email",          models.EmailField(blank=True)),
                ("created_at",            models.DateTimeField(auto_now_add=True)),
                ("updated_at",            models.DateTimeField(auto_now=True)),
            ],
            options={"db_table": "organization_settings"},
        ),
    ]
