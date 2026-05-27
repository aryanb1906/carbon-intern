from rest_framework import serializers
from .models import EmissionRecord


class EmissionRecordSerializer(serializers.ModelSerializer):
    scope_label    = serializers.CharField(source="get_scope_display",    read_only=True)
    status_label   = serializers.CharField(source="get_status_display",   read_only=True)
    category_label = serializers.CharField(source="get_category_display", read_only=True)
    risk_label     = serializers.CharField(source="get_risk_level_display", read_only=True)
    reviewer_name  = serializers.CharField(source="reviewer.full_name",   read_only=True)

    class Meta:
        model  = EmissionRecord
        fields = [
            "id", "organization", "source_type", "category", "category_label",
            "scope", "scope_label", "activity_date", "facility", "department",
            "cost_center", "activity_value", "unit", "normalized_value",
            "normalized_unit", "emission_factor", "emission_factor_source",
            "co2e", "status", "status_label", "risk_score", "risk_level",
            "risk_label", "anomaly_flags", "reviewer", "reviewer_name",
            "reviewed_at", "review_note", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "organization", "co2e", "risk_score", "risk_level",
            "anomaly_flags", "created_at", "updated_at",
        ]


class EmissionRecordReviewSerializer(serializers.ModelSerializer):
    """Minimal serializer used for approve/reject actions."""
    class Meta:
        model  = EmissionRecord
        fields = ["status", "review_note"]

    def validate_status(self, value):
        allowed = [EmissionRecord.Status.APPROVED, EmissionRecord.Status.REJECTED, EmissionRecord.Status.FLAGGED]
        if value not in allowed:
            raise serializers.ValidationError("Invalid review status.")
        return value


class DashboardStatsSerializer(serializers.Serializer):
    total_records    = serializers.IntegerField()
    pending_count    = serializers.IntegerField()
    approved_count   = serializers.IntegerField()
    rejected_count   = serializers.IntegerField()
    flagged_count    = serializers.IntegerField()
    total_co2e       = serializers.FloatField()
    scope1_co2e      = serializers.FloatField()
    scope2_co2e      = serializers.FloatField()
    scope3_co2e      = serializers.FloatField()
    monthly_trend    = serializers.ListField()
    source_breakdown = serializers.ListField()
