from django.db import migrations, models
import django.contrib.auth.models
import uuid

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ("organizations", "0001_initial"),
        ("auth", "0012_alter_user_first_name_max_length"),
    ]
    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("password",        models.CharField(max_length=128)),
                ("last_login",      models.DateTimeField(blank=True, null=True)),
                ("is_superuser",    models.BooleanField(default=False)),
                ("id",              models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)),
                ("organization",    models.ForeignKey("organizations.Organization", blank=True, null=True, on_delete=models.deletion.CASCADE, related_name="users")),
                ("email",           models.EmailField(unique=True)),
                ("first_name",      models.CharField(max_length=100)),
                ("last_name",       models.CharField(max_length=100)),
                ("role",            models.CharField(max_length=20, default="analyst")),
                ("avatar_url",      models.URLField(blank=True, null=True)),
                ("is_active",       models.BooleanField(default=True)),
                ("is_staff",        models.BooleanField(default=False)),
                ("created_at",      models.DateTimeField(auto_now_add=True)),
                ("updated_at",      models.DateTimeField(auto_now=True)),
                ("groups",          models.ManyToManyField(blank=True, related_name="user_set", related_query_name="user", to="auth.group")),
                ("user_permissions",models.ManyToManyField(blank=True, related_name="user_set", related_query_name="user", to="auth.permission")),
            ],
            options={"db_table": "users", "ordering": ["email"]},
            managers=[("objects", django.contrib.auth.models.BaseUserManager())],
        ),
    ]
