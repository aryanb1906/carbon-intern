from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({"status": "healthy"}, status=200)

urlpatterns = [
    path("", health_check),
    path("admin/",             admin.site.urls),
    path("api/v1/auth/",       include("apps.accounts.urls")),
    path("api/v1/orgs/",       include("apps.organizations.urls")),
    path("api/v1/ingestion/",  include("apps.ingestion.urls")),
    path("api/v1/emissions/",  include("apps.emissions.urls")),
    path("api/v1/audits/",     include("apps.audits.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
