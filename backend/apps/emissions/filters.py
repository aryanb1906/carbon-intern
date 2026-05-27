import django_filters
from .models import EmissionRecord


class EmissionRecordFilter(django_filters.FilterSet):
    scope       = django_filters.NumberFilter()
    status      = django_filters.ChoiceFilter(choices=EmissionRecord.Status.choices)
    risk_level  = django_filters.ChoiceFilter(choices=EmissionRecord.RiskLevel.choices)
    date_from   = django_filters.DateFilter(field_name="activity_date", lookup_expr="gte")
    date_to     = django_filters.DateFilter(field_name="activity_date", lookup_expr="lte")
    facility    = django_filters.CharFilter(lookup_expr="icontains")
    source_type = django_filters.CharFilter(lookup_expr="iexact")

    class Meta:
        model  = EmissionRecord
        fields = ["scope", "status", "risk_level", "facility", "source_type", "category"]
