from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ["email","first_name","last_name","role","organization","is_active","created_at"]
    list_filter   = ["role","is_active","organization"]
    search_fields = ["email","first_name","last_name"]
    ordering      = ["email"]
    fieldsets = (
        (None,           {"fields": ("email","password")}),
        ("Personal",     {"fields": ("first_name","last_name","avatar_url")}),
        ("Organization", {"fields": ("organization","role")}),
        ("Permissions",  {"fields": ("is_active","is_staff","is_superuser","groups","user_permissions")}),
        ("Dates",        {"fields": ("last_login","created_at")}),
    )
    add_fieldsets = ((None, {"classes":("wide",),"fields":("email","password1","password2","first_name","last_name","role","organization")}),)
    readonly_fields = ["created_at"]
