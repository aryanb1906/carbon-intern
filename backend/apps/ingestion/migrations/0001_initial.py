from django.db import migrations, models
import django.db.models.deletion, uuid

class Migration(migrations.Migration):
    initial = True
    dependencies = [("organizations","0001_initial"),("accounts","0001_initial")]
    operations = [
        migrations.CreateModel("DataSource", fields=[
            ("id",           models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)),
            ("organization", models.ForeignKey("organizations.Organization",on_delete=django.db.models.deletion.CASCADE,related_name="data_sources")),
            ("name",         models.CharField(max_length=255)),
            ("source_type",  models.CharField(max_length=20)),
            ("sync_status",  models.CharField(max_length=20,default="active")),
            ("last_sync_at", models.DateTimeField(null=True,blank=True)),
            ("config",       models.JSONField(default=dict,blank=True)),
            ("error_count",  models.PositiveIntegerField(default=0)),
            ("record_count", models.PositiveIntegerField(default=0)),
            ("created_at",   models.DateTimeField(auto_now_add=True)),
            ("updated_at",   models.DateTimeField(auto_now=True)),
        ], options={"db_table":"data_sources","unique_together":{("organization","name")}}),
        migrations.CreateModel("UploadedFile", fields=[
            ("id",            models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)),
            ("organization",  models.ForeignKey("organizations.Organization",on_delete=django.db.models.deletion.CASCADE,related_name="uploaded_files")),
            ("source",        models.ForeignKey("ingestion.DataSource",on_delete=django.db.models.deletion.SET_NULL,null=True,related_name="files")),
            ("uploaded_by",   models.ForeignKey("accounts.User",on_delete=django.db.models.deletion.SET_NULL,null=True,related_name="uploads")),
            ("original_name", models.CharField(max_length=500)),
            ("file_path",     models.FileField(upload_to="uploads/%Y/%m/")),
            ("file_size",     models.PositiveBigIntegerField(default=0)),
            ("mime_type",     models.CharField(max_length=100,blank=True)),
            ("parse_status",  models.CharField(max_length=20,default="pending")),
            ("parse_log",     models.TextField(blank=True)),
            ("row_count",     models.PositiveIntegerField(default=0)),
            ("error_count",   models.PositiveIntegerField(default=0)),
            ("created_at",    models.DateTimeField(auto_now_add=True)),
            ("updated_at",    models.DateTimeField(auto_now=True)),
        ], options={"db_table":"uploaded_files","ordering":["-created_at"]}),
    ]
