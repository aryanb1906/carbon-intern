from django.contrib import admin
from .models import EmissionRecord

@admin.register(EmissionRecord)
class EmissionRecordAdmin(admin.ModelAdmin):
    list_display  = ["id","organization","category","scope","activity_date","facility","co2e","status","risk_level","created_at"]
    list_filter   = ["scope","status","risk_level","category","organization"]
    search_fields = ["facility","department","cost_center","id"]
    readonly_fields = ["id","created_at","updated_at","risk_score","risk_level","anomaly_flags","co2e"]
    date_hierarchy = "activity_date"
    ordering = ["-created_at"]
