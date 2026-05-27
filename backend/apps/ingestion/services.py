"""
Ingestion pipeline:
  SAP CSV/XLSX → EmissionRecord
  Utility CSV  → EmissionRecord
  Travel CSV   → EmissionRecord
"""
import csv
import io
import logging
from datetime import datetime
from typing import Iterator

import openpyxl

from apps.emissions.models import EmissionRecord
from apps.emissions.services import NormalizationService, EmissionFactorService, AnomalyDetectionService
from .models import UploadedFile

logger = logging.getLogger("carbontrace")

# ── Column alias maps ──────────────────────────────────────────────────────────
SAP_COLUMN_MAP = {
    "material": "category",
    "matnr": "category",
    "plant": "facility",
    "werks": "facility",
    "quantity": "activity_value",
    "qty": "activity_value",
    "menge": "activity_value",
    "base_unit": "unit",
    "meins": "unit",
    "posting_date": "activity_date",
    "budat": "activity_date",
    "cost_center": "cost_center",
    "kostl": "cost_center",
}

UTILITY_COLUMN_MAP = {
    "meter_id": "facility",
    "facility_code": "facility",
    "kwh": "activity_value",
    "consumption_kwh": "activity_value",
    "billing_period_start": "activity_date",
    "period_start": "activity_date",
}

TRAVEL_COLUMN_MAP = {
    "departure": "origin",
    "destination": "dest",
    "transport_type": "category",
    "mode": "category",
    "travel_date": "activity_date",
    "date": "activity_date",
    "distance_km": "activity_value",
    "nights": "activity_value",
    "traveler_id": "cost_center",
}

SAP_CATEGORY_MAP = {
    "natural gas": "natural_gas", "erdgas": "natural_gas",
    "diesel": "diesel", "petrol": "petrol", "benzin": "petrol",
    "lpg": "lpg", "propane": "lpg",
    "electricity": "electricity", "strom": "electricity",
}


def _normalise_header(headers: list[str], alias_map: dict) -> dict:
    return {h: alias_map.get(h.lower().strip(), h.lower().strip()) for h in headers}


def _parse_date(raw: str) -> datetime.date:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d.%m.%Y", "%Y%m%d"):
        try:
            return datetime.strptime(raw.strip(), fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Cannot parse date: {raw}")


def _read_csv(file_obj) -> Iterator[dict]:
    text = file_obj.read().decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    yield from reader


def _read_xlsx(file_obj) -> Iterator[dict]:
    wb = openpyxl.load_workbook(file_obj, read_only=True, data_only=True)
    ws = wb.active
    rows = ws.iter_rows(values_only=True)
    headers = [str(c).strip() if c else "" for c in next(rows)]
    for row in rows:
        yield dict(zip(headers, row))


def _read_file(upload: UploadedFile) -> Iterator[dict]:
    upload.file_path.seek(0)
    if upload.mime_type in ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel") \
            or upload.original_name.endswith(".xlsx"):
        yield from _read_xlsx(upload.file_path)
    else:
        yield from _read_csv(upload.file_path)


class IngestionPipeline:
    """
    Parse an UploadedFile and create EmissionRecord instances.
    Returns (created_count, error_count, log_lines).
    """

    def __init__(self, upload: UploadedFile, organization, sigma: float = 3.0):
        self.upload = upload
        self.organization = organization
        self.sigma = sigma
        self.log_lines = []

    def _log(self, level: str, msg: str):
        self.log_lines.append(f"[{level.upper()}] {msg}")
        getattr(logger, level, logger.info)(msg)

    def run(self) -> tuple[int, int]:
        source_type = self.upload.source.source_type if self.upload.source else "custom"
        self._log("info", f"Starting ingestion for {self.upload.original_name} (type={source_type})")

        created, errors = 0, 0
        rows = list(_read_file(self.upload))
        self._log("info", f"Detected {len(rows)} rows")

        for i, row in enumerate(rows, start=2):
            try:
                record = self._process_row(row, source_type)
                if record:
                    created += 1
            except Exception as exc:
                errors += 1
                self._log("error", f"Row {i}: {exc}")

        self._log("info", f"Complete – {created} created, {errors} errors")
        return created, errors

    def _process_row(self, row: dict, source_type: str) -> EmissionRecord:
        if source_type == "sap":
            return self._process_sap(row)
        elif source_type == "utility":
            return self._process_utility(row)
        elif source_type == "travel":
            return self._process_travel(row)
        else:
            return self._process_generic(row)

    # ── SAP ────────────────────────────────────────────────────────────────────
    def _process_sap(self, row: dict) -> EmissionRecord:
        m = _normalise_header(list(row.keys()), SAP_COLUMN_MAP)
        get = lambda k: row.get(next((h for h, v in m.items() if v == k), ""), "")

        raw_cat  = str(get("category") or "").strip().lower()
        category = SAP_CATEGORY_MAP.get(raw_cat, "other")
        facility = str(get("facility") or "").strip()
        raw_val  = get("activity_value")
        raw_unit = str(get("unit") or "kwh").strip().lower()
        raw_date = str(get("activity_date") or "").strip()

        activity_value = float(str(raw_val).replace(",", "."))
        activity_date  = _parse_date(raw_date)
        norm_val, norm_unit = NormalizationService.normalize(activity_value, raw_unit)
        scope = 1 if category in ("natural_gas","diesel","petrol","lpg") else 2

        return self._save(category, scope, activity_date, facility,
                          activity_value, raw_unit, norm_val, norm_unit,
                          get("cost_center"), row, "sap")

    # ── Utility ────────────────────────────────────────────────────────────────
    def _process_utility(self, row: dict) -> EmissionRecord:
        m = _normalise_header(list(row.keys()), UTILITY_COLUMN_MAP)
        get = lambda k: row.get(next((h for h, v in m.items() if v == k), ""), "")

        activity_value = float(str(get("activity_value") or 0).replace(",", "."))
        activity_date  = _parse_date(str(get("activity_date") or "").strip())
        facility = str(get("facility") or "").strip()
        norm_val, norm_unit = NormalizationService.normalize(activity_value, "kwh")

        return self._save("electricity", 2, activity_date, facility,
                          activity_value, "kWh", norm_val, norm_unit,
                          None, row, "utility")

    # ── Travel ─────────────────────────────────────────────────────────────────
    def _process_travel(self, row: dict) -> EmissionRecord:
        m = _normalise_header(list(row.keys()), TRAVEL_COLUMN_MAP)
        get = lambda k: row.get(next((h for h, v in m.items() if v == k), ""), "")

        raw_cat  = str(get("category") or "air_travel").strip().lower()
        category = raw_cat if raw_cat in ("air_travel","rail","hotel","road","sea") else "air_travel"
        activity_value = float(str(get("activity_value") or 0).replace(",", "."))
        activity_date  = _parse_date(str(get("activity_date") or "").strip())
        cost_center = str(get("cost_center") or "").strip()

        unit_map = {"air_travel":"flight","rail":"km","hotel":"night","road":"km","sea":"km"}
        unit = unit_map.get(category, "km")
        norm_val, norm_unit = NormalizationService.normalize(activity_value, unit)

        return self._save(category, 3, activity_date, "Corporate",
                          activity_value, unit, norm_val, norm_unit,
                          cost_center, row, "travel")

    # ── Generic ────────────────────────────────────────────────────────────────
    def _process_generic(self, row: dict) -> EmissionRecord:
        return self._save(
            "other", 1,
            datetime.today().date(), "",
            float(row.get("value", 0) or 0), row.get("unit",""), 
            float(row.get("value", 0) or 0), row.get("unit",""),
            None, row, "custom"
        )

    # ── Shared save ────────────────────────────────────────────────────────────
    def _save(self, category, scope, activity_date, facility,
              activity_value, unit, norm_val, norm_unit,
              cost_center, raw_data, source_type) -> EmissionRecord:

        co2e = EmissionFactorService.compute_co2e(category, norm_val, norm_unit)
        ef   = EmissionFactorService.get_factor(category, norm_unit)

        record = EmissionRecord(
            organization=self.organization,
            uploaded_file=self.upload,
            source_type=source_type,
            category=category,
            scope=scope,
            activity_date=activity_date,
            facility=facility or "",
            cost_center=cost_center or "",
            activity_value=activity_value,
            unit=unit,
            normalized_value=norm_val,
            normalized_unit=norm_unit,
            emission_factor=ef,
            emission_factor_source="IPCC_AR6_2021",
            co2e=co2e,
            raw_data=raw_data,
        )

        # Anomaly scoring (needs pk so we save first)
        record.save()
        score, level, flags = AnomalyDetectionService.score(record, self.sigma)
        record.risk_score    = score
        record.risk_level    = level
        record.anomaly_flags = flags
        if level == "high":
            record.status = EmissionRecord.Status.FLAGGED
        record.save(update_fields=["risk_score","risk_level","anomaly_flags","status"])
        return record
