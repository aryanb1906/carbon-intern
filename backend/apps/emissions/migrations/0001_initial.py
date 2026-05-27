from django.db import migrations, models
import django.db.models.deletion, uuid

class Migration(migrations.Migration):
    initial = True
    dependencies = [("organizations","0001_initial"),("accounts","0001_initial"),("ingestion","0001_initial")]
    operations = [
        migrations.CreateModel("EmissionRecord", fields=[
            ("id",                    models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)),
            ("organization",          models.ForeignKey("organizations.Organization",on_delete=django.db.models.deletion.CASCADE,related_name="emission_records")),
            ("uploaded_file",         models.ForeignKey("ingestion.UploadedFile",on_delete=django.db.models.deletion.SET_NULL,null=True,related_name="records")),
            ("source_type",           models.CharField(max_length=20,blank=True)),
            ("category",              models.CharField(max_length=30,default="other")),
            ("scope",                 models.IntegerField()),
            ("activity_date",         models.DateField()),
            ("facility",              models.CharField(max_length=255,blank=True)),
            ("department",            models.CharField(max_length=255,blank=True)),
            ("cost_center",           models.CharField(max_length=100,blank=True)),
            ("activity_value",        models.FloatField()),
            ("unit",                  models.CharField(max_length=50)),
            ("normalized_value",      models.FloatField(null=True,blank=True)),
            ("normalized_unit",       models.CharField(max_length=50,blank=True)),
            ("emission_factor",       models.FloatField(null=True,blank=True)),
            ("emission_factor_source",models.CharField(max_length=100,blank=True)),
            ("co2e",                  models.FloatField(null=True,blank=True)),
            ("status",                models.CharField(max_length=20,default="pending")),
            ("risk_score",            models.FloatField(default=0.0)),
            ("risk_level",            models.CharField(max_length=10,default="low")),
            ("anomaly_flags",         models.JSONField(default=list,blank=True)),
            ("reviewer",              models.ForeignKey("accounts.User",on_delete=django.db.models.deletion.SET_NULL,null=True,blank=True,related_name="reviewed_records")),
            ("reviewed_at",           models.DateTimeField(null=True,blank=True)),
            ("review_note",           models.TextField(blank=True)),
            ("raw_data",              models.JSONField(default=dict,blank=True)),
            ("created_at",            models.DateTimeField(auto_now_add=True)),
            ("updated_at",            models.DateTimeField(auto_now=True)),
        ], options={"db_table":"emission_records","ordering":["-created_at"]}),
        migrations.AddIndex("EmissionRecord","emission_records",models.Index(fields=["organization","status"],name="er_org_status_idx")),
        migrations.AddIndex("EmissionRecord","emission_records",models.Index(fields=["organization","scope"],name="er_org_scope_idx")),
        migrations.AddIndex("EmissionRecord","emission_records",models.Index(fields=["activity_date"],name="er_date_idx")),
    ]
