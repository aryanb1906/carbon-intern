from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions, serializers
from .models import Organization


class OrgSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Organization
        fields = ["id","name","slug","industry","country","currency","base_year","is_active","created_at"]
        read_only_fields = ["id","created_at"]


class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class   = OrgSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Organization.objects.all()
        if self.request.user.organization:
            return Organization.objects.filter(pk=self.request.user.organization_id)
        return Organization.objects.none()


router = DefaultRouter()
router.register("", OrganizationViewSet, basename="organization")
urlpatterns = [path("", include(router.urls))]
