from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("records",   views.EmissionRecordViewSet, basename="emission_record")
router.register("dashboard", views.DashboardView,         basename="dashboard")

urlpatterns = [path("", include(router.urls))]
