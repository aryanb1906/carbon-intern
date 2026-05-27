import io
from django.test import TestCase
from apps.organizations.models import Organization, OrganizationSettings
from apps.accounts.models import User
from apps.ingestion.models import DataSource, UploadedFile
from apps.ingestion.services import IngestionPipeline, _parse_date


class ParseDateTests(TestCase):
    def test_iso_format(self):
        from datetime import date
        self.assertEqual(_parse_date("2024-01-15"), date(2024, 1, 15))

    def test_european_format(self):
        from datetime import date
        self.assertEqual(_parse_date("15/01/2024"), date(2024, 1, 15))

    def test_dot_format(self):
        from datetime import date
        self.assertEqual(_parse_date("15.01.2024"), date(2024, 1, 15))

    def test_invalid_raises(self):
        with self.assertRaises(ValueError):
            _parse_date("not-a-date")
