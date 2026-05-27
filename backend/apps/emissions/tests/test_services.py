from django.test import TestCase
from apps.emissions.services import NormalizationService, EmissionFactorService, AnomalyDetectionService


class NormalizationTests(TestCase):
    def test_kwh_passthrough(self):
        v, u = NormalizationService.normalize(1000, "kwh")
        self.assertEqual(v, 1000); self.assertEqual(u, "kwh")

    def test_mwh_to_kwh(self):
        v, u = NormalizationService.normalize(1, "mwh")
        self.assertAlmostEqual(v, 1000.0); self.assertEqual(u, "kwh")

    def test_gallon_to_liter(self):
        v, u = NormalizationService.normalize(1, "gal")
        self.assertAlmostEqual(v, 3.785, places=2); self.assertEqual(u, "liter")

    def test_tonne_to_kg(self):
        v, u = NormalizationService.normalize(1, "tonne")
        self.assertEqual(v, 1000.0); self.assertEqual(u, "kg")

    def test_unknown_unit_passthrough(self):
        v, u = NormalizationService.normalize(42, "widgets")
        self.assertEqual(v, 42); self.assertEqual(u, "widgets")


class EmissionFactorTests(TestCase):
    def test_electricity_factor(self):
        ef = EmissionFactorService.get_factor("electricity", "kwh")
        self.assertIsNotNone(ef)
        self.assertGreater(ef, 0)

    def test_diesel_factor(self):
        ef = EmissionFactorService.get_factor("diesel", "liter")
        self.assertIsNotNone(ef)
        self.assertAlmostEqual(ef, 2.640, places=2)

    def test_compute_co2e_electricity(self):
        co2e = EmissionFactorService.compute_co2e("electricity", 1000, "kwh")
        self.assertIsNotNone(co2e)
        self.assertAlmostEqual(co2e, 0.295, places=2)

    def test_unknown_category_returns_none(self):
        ef = EmissionFactorService.get_factor("uranium", "kg")
        self.assertIsNone(ef)
