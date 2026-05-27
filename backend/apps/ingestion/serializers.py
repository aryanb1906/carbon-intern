from rest_framework import serializers
from .models import DataSource, UploadedFile


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DataSource
        fields = [
            "id","name","source_type","sync_status","last_sync_at",
            "config","error_count","record_count","created_at","updated_at",
        ]
        read_only_fields = ["id","error_count","record_count","created_at","updated_at"]


class UploadedFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.full_name", read_only=True)
    source_name      = serializers.CharField(source="source.name",           read_only=True)

    class Meta:
        model  = UploadedFile
        fields = [
            "id","original_name","file_path","file_size","mime_type",
            "source","source_name","parse_status","parse_log",
            "row_count","error_count","uploaded_by","uploaded_by_name",
            "created_at","updated_at",
        ]
        read_only_fields = [
            "id","original_name","file_size","mime_type","parse_status",
            "parse_log","row_count","error_count","uploaded_by","created_at","updated_at",
        ]
