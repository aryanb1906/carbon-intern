from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display  = ["action","user","content_type","object_id","field_name","old_value","new_value","timestamp"]
    list_filter   = ["action","content_type"]
    search_fields = ["object_id","user__email","field_name"]
    readonly_fields = [f.name for f in AuditLog._meta.fields]
    date_hierarchy = "timestamp"
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
