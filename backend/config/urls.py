from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/",             admin.site.urls),
    path("api/v1/auth/",       include("apps.accounts.urls")),
    path("api/v1/orgs/",       include("apps.organizations.urls")),
    path("api/v1/ingestion/",  include("apps.ingestion.urls")),
    path("api/v1/emissions/",  include("apps.emissions.urls")),
    path("api/v1/audits/",     include("apps.audits.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
