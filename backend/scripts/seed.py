"""
Seed script – creates demo org, users, data sources and 150 emission records.
Run: python manage.py shell < scripts/seed.py
"""
import os, random
from datetime import date, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django; django.setup()

from apps.organizations.models import Organization, OrganizationSettings
from apps.accounts.models import User
from apps.ingestion.models import DataSource
from apps.emissions.models import EmissionRecord

print("Seeding CarbonTrace demo data...")

org, _ = Organization.objects.get_or_create(
    slug="acme-corp",
    defaults=dict(name="ACME Corporation", industry="manufacturing",
                  country="DE", currency="EUR", base_year=2020),
)
OrganizationSettings.objects.get_or_create(organization=org)

for email, first, last, role, pw in [
    ("sarah.chen@acme.com",  "Sarah",  "Chen",  "analyst",  "demo1234"),
    ("anna.weber@acme.com",  "Anna",   "Weber", "manager",  "demo1234"),
    ("marco.rossi@acme.com", "Marco",  "Rossi", "engineer", "demo1234"),
    ("admin@acme.com",       "Admin",  "User",  "admin",    "admin1234"),
]:
    u, c = User.objects.get_or_create(email=email,
        defaults=dict(first_name=first, last_name=last, role=role, organization=org))
    if c: u.set_password(pw); u.save()

for name, stype in [("SAP ERP","sap"),("Utility Billing","utility"),("Corporate Travel","travel")]:
    DataSource.objects.get_or_create(organization=org, name=name, defaults=dict(source_type=stype))

CATS = [
    ("natural_gas",1,"sap","kWh",8000,18000,0.182),
    ("diesel",1,"sap","liter",500,4000,2.640),
    ("electricity",2,"utility","kWh",20000,70000,0.295),
    ("air_travel",3,"travel","flight",2,12,0.930),
    ("hotel",3,"travel","night",5,30,0.120),
]
FACILITIES = ["Berlin HQ","Munich Plant","Hamburg Depot","Frankfurt Office","Stuttgart Lab"]
today = date.today()
for _ in range(150):
    cat,scope,src,unit,lo,hi,ef = random.choice(CATS)
    v = round(random.uniform(lo,hi),2)
    EmissionRecord.objects.create(
        organization=org, source_type=src, category=cat, scope=scope,
        activity_date=today-timedelta(days=random.randint(1,365)),
        facility=random.choice(FACILITIES), activity_value=v, unit=unit,
        normalized_value=v, normalized_unit=unit, emission_factor=ef,
        emission_factor_source="IPCC_AR6_2021", co2e=round(v*ef/1000,4),
        status=random.choices(["approved","approved","pending","flagged","rejected"],k=1)[0],
        risk_level=random.choices(["low","low","medium","high"],k=1)[0],
    )
print("Done! Login: sarah.chen@acme.com / demo1234")
