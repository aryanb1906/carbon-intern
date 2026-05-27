from django.contrib import admin
from .models import DataSource, UploadedFile

@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display  = ["name","organization","source_type","sync_status","record_count","error_count","last_sync_at"]
    list_filter   = ["source_type","sync_status"]
    search_fields = ["name","organization__name"]

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display  = ["original_name","organization","source","parse_status","row_count","error_count","uploaded_by","created_at"]
    list_filter   = ["parse_status","source__source_type"]
    search_fields = ["original_name","organization__name"]
    readonly_fields = ["parse_log","row_count","error_count"]
