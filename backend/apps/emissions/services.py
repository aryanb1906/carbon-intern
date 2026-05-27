"""
Emissions business logic:
  - Normalization
  - Emission factor lookup
  - Anomaly / risk scoring
  - Dashboard aggregation
"""
import logging
import statistics
from datetime import date, timedelta
from typing import Optional

from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone

from .models import EmissionRecord

logger = logging.getLogger("carbontrace")

# ── Emission factors (kgCO2e per unit) – IPCC AR6 illustrative values ──────────
EMISSION_FACTORS = {
    # Scope 1 – combustion
    "natural_gas":  {"kwh": 0.000182, "m3": 2.020},
    "diesel":       {"liter": 2.640,  "kg": 3.170},
    "petrol":       {"liter": 2.310,  "kg": 2.760},
    "lpg":          {"liter": 1.530,  "kg": 2.983},
    # Scope 2 – electricity (EU mix 2023)
    "electricity":  {"kwh": 0.295},
    "steam":        {"kwh": 0.180},
    # Scope 3 – travel
    "air_travel":   {"km": 0.000255, "flight": 0.930},
    "rail":         {"km": 0.000041, "trip": 0.024},
    "hotel":        {"night": 0.120},
    "road":         {"km": 0.000171},
    "sea":          {"km": 0.000010, "tonne_km": 0.0000108},
}

UNIT_NORMALIZERS = {
    # volume
    "l": ("liter", 1.0), "litres": ("liter", 1.0), "liter": ("liter", 1.0),
    "gal": ("liter", 3.785), "gallon": ("liter", 3.785),
    "m3": ("m3", 1.0), "cubic_meter": ("m3", 1.0),
    # energy
    "kwh": ("kwh", 1.0), "mwh": ("kwh", 1000.0), "gj": ("kwh", 277.78),
    # mass
    "kg": ("kg", 1.0), "t": ("kg", 1000.0), "tonne": ("kg", 1000.0),
    "lb": ("kg", 0.4536),
    # count / distance
    "km": ("km", 1.0), "mile": ("km", 1.609),
    "night": ("night", 1.0), "nights": ("night", 1.0),
    "flight": ("flight", 1.0), "flights": ("flight", 1.0),
    "trip": ("trip", 1.0), "trips": ("trip", 1.0),
}


class NormalizationService:
    """Convert raw activity_value + unit to a normalised pair."""

    @staticmethod
    def normalize(value: float, unit: str):
        key = unit.lower().strip()
        if key not in UNIT_NORMALIZERS:
            return value, unit          # pass-through if unknown
        norm_unit, factor = UNIT_NORMALIZERS[key]
        return round(value * factor, 6), norm_unit


class EmissionFactorService:
    """Look up the right emission factor and compute CO2e."""

    @staticmethod
    def get_factor(category: str, unit: str) -> Optional[float]:
        cat_factors = EMISSION_FACTORS.get(category)
        if not cat_factors:
            return None
        return cat_factors.get(unit)

    @staticmethod
    def compute_co2e(category: str, norm_value: float, norm_unit: str) -> Optional[float]:
        factor = EmissionFactorService.get_factor(category, norm_unit)
        if factor is None:
            return None
        return round(norm_value * factor / 1000, 6)  # kg → tCO2e


class AnomalyDetectionService:
    """
    Flag records whose activity value deviates > sigma from the
    rolling 90-day facility baseline.
    """

    @staticmethod
    def score(record: EmissionRecord, sigma_threshold: float = 3.0) -> tuple:
        """Returns (risk_score 0-1, risk_level, anomaly_flags list)."""
        flags = []
        score = 0.0

        baseline_qs = (
            EmissionRecord.objects
            .filter(
                organization=record.organization,
                category=record.category,
                facility=record.facility,
                activity_date__gte=record.activity_date - timedelta(days=90),
                status=EmissionRecord.Status.APPROVED,
            )
            .exclude(pk=record.pk)
            .values_list("normalized_value", flat=True)
        )

        values = list(baseline_qs)
        if len(values) >= 5:
            mean = statistics.mean(values)
            stdev = statistics.stdev(values) or 1.0
            z = abs((record.normalized_value or 0) - mean) / stdev
            if z > sigma_threshold:
                flags.append(f"Value {z:.1f}σ above facility baseline")
                score = min(z / 10, 1.0)

        # Negative or zero activity value
        if (record.activity_value or 0) <= 0:
            flags.append("Non-positive activity value")
            score = max(score, 0.8)

        # Missing required fields
        if not record.facility:
            flags.append("Missing facility")
            score = max(score, 0.4)

        if not record.emission_factor:
            flags.append("No emission factor matched")
            score = max(score, 0.3)

        if score >= 0.7:
            level = EmissionRecord.RiskLevel.HIGH
        elif score >= 0.3:
            level = EmissionRecord.RiskLevel.MEDIUM
        else:
            level = EmissionRecord.RiskLevel.LOW

        return round(score, 4), level, flags


class DashboardService:
    """Aggregate metrics for the dashboard endpoint."""

    @staticmethod
    def stats(organization):
        qs = EmissionRecord.objects.filter(organization=organization)

        total   = qs.count()
        pending  = qs.filter(status="pending").count()
        approved = qs.filter(status="approved").count()
        rejected = qs.filter(status="rejected").count()
        flagged  = qs.filter(status="flagged").count()

        co2e_agg = qs.filter(status="approved").aggregate(
            total=Sum("co2e"),
            s1=Sum("co2e", filter=Q(scope=1)),
            s2=Sum("co2e", filter=Q(scope=2)),
            s3=Sum("co2e", filter=Q(scope=3)),
        )

        # Monthly trend – last 12 months
        monthly = []
        today = date.today()
        for i in range(11, -1, -1):
            m = (today.replace(day=1) - timedelta(days=i * 30))
            row = qs.filter(
                activity_date__year=m.year,
                activity_date__month=m.month,
                status="approved",
            ).aggregate(
                scope1=Sum("co2e", filter=Q(scope=1)),
                scope2=Sum("co2e", filter=Q(scope=2)),
                scope3=Sum("co2e", filter=Q(scope=3)),
            )
            monthly.append({
                "month": m.strftime("%b"),
                "year":  m.year,
                "scope1": round(row["scope1"] or 0, 2),
                "scope2": round(row["scope2"] or 0, 2),
                "scope3": round(row["scope3"] or 0, 2),
            })

        source_breakdown = (
            qs.filter(status="approved")
            .values("source_type")
            .annotate(co2e=Sum("co2e"), count=Count("id"))
            .order_by("-co2e")
        )

        return {
            "total_records":    total,
            "pending_count":    pending,
            "approved_count":   approved,
            "rejected_count":   rejected,
            "flagged_count":    flagged,
            "total_co2e":       round(co2e_agg["total"] or 0, 2),
            "scope1_co2e":      round(co2e_agg["s1"] or 0, 2),
            "scope2_co2e":      round(co2e_agg["s2"] or 0, 2),
            "scope3_co2e":      round(co2e_agg["s3"] or 0, 2),
            "monthly_trend":    monthly,
            "source_breakdown": list(source_breakdown),
        }
