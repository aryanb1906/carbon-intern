from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("sources", views.DataSourceViewSet,    basename="data_source")
router.register("files",   views.UploadedFileViewSet,  basename="uploaded_file")

urlpatterns = [path("", include(router.urls))]
