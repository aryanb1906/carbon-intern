from django.db import migrations, models
import django.db.models.deletion, uuid

class Migration(migrations.Migration):
    initial = True
    dependencies = [("organizations","0001_initial"),("accounts","0001_initial")]
    operations = [
        migrations.CreateModel("AuditLog", fields=[
            ("id",           models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)),
            ("organization", models.ForeignKey("organizations.Organization",on_delete=django.db.models.deletion.CASCADE,related_name="audit_logs")),
            ("user",         models.ForeignKey("accounts.User",on_delete=django.db.models.deletion.SET_NULL,null=True,related_name="audit_logs")),
            ("action",       models.CharField(max_length=20)),
            ("content_type", models.CharField(max_length=100,blank=True)),
            ("object_id",    models.CharField(max_length=100,blank=True)),
            ("field_name",   models.CharField(max_length=100,blank=True)),
            ("old_value",    models.TextField(blank=True,null=True)),
            ("new_value",    models.TextField(blank=True,null=True)),
            ("ip_address",   models.GenericIPAddressField(null=True,blank=True)),
            ("user_agent",   models.CharField(max_length=500,blank=True)),
            ("metadata",     models.JSONField(default=dict,blank=True)),
            ("timestamp",    models.DateTimeField(auto_now_add=True,db_index=True)),
        ], options={"db_table":"audit_logs","ordering":["-timestamp"]}),
    ]
