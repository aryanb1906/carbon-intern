# 🌿 CarbonTrace — Enterprise ESG Data Ingestion & Audit Platform

A production-ready, full-stack platform for ingesting, normalizing, and auditing Scope 1, 2, and 3 emissions data. Built with Django + React, designed to feel like Linear or Stripe Dashboard.

---

## ✨ Features

| Module | Description |
|---|---|
| **Multi-tenant auth** | JWT with refresh rotation, per-org data isolation |
| **Data ingestion** | SAP CSV/XLSX, Utility bills, Travel data with fuzzy column mapping |
| **Normalization** | Unit conversion (L→m³, MWh→kWh, miles→km, etc.) |
| **Emission factors** | IPCC AR6 factor library with per-category lookup |
| **Anomaly detection** | Statistical σ-based flagging vs. 90-day facility baseline |
| **Review workflow** | Approve / Reject / Flag with full audit trail |
| **Audit log** | Immutable, who-changed-what history on every record |
| **Dashboard analytics** | Monthly trends, scope distribution, source breakdown |
| **Celery-ready** | Background ingestion tasks, scheduler support |

---

## 🗂 Project Structure

```
carbontrace/
├── backend/                    # Django REST API
│   ├── apps/
│   │   ├── accounts/           # Custom User model, JWT auth
│   │   ├── organizations/      # Multi-tenant Organizations
│   │   ├── ingestion/          # DataSource, UploadedFile, pipeline
│   │   ├── emissions/          # EmissionRecord, services, anomaly detection
│   │   └── audits/             # AuditLog, AuditLogService
│   ├── config/                 # Settings, URLs, WSGI, pagination
│   ├── scripts/
│   │   └── seed.py             # Demo data seeder
│   ├── requirements.txt
│   ├── manage.py
│   └── Dockerfile
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/                # Axios client + typed API modules
│   │   │   ├── client.ts       # Axios instance with token refresh
│   │   │   ├── auth.ts
│   │   │   ├── emissions.ts
│   │   │   ├── ingestion.ts
│   │   │   └── audits.ts
│   │   ├── hooks/              # useAuth, useRecords, useDashboard
│   │   ├── pages/              # Route-level page components
│   │   ├── components/         # Shared UI components
│   │   ├── utils/              # Formatters, constants
│   │   ├── types/              # TypeScript types
│   │   └── App.jsx             # Main app (router, layout)
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Option A — Docker (recommended)

```bash
# 1. Clone and configure
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start all services
docker compose up -d --build

# 3. Run migrations + seed demo data
docker compose exec api python manage.py migrate
docker compose exec api python manage.py shell < scripts/seed.py

# 4. Open the app
open http://localhost:5173
```

### Option B — Local Development

**Backend:**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit DATABASE_URL etc.
python manage.py migrate
python manage.py shell < scripts/seed.py
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Demo Credentials

| Email | Password | Role |
|---|---|---|
| sarah.chen@acme.com | demo1234 | ESG Analyst |
| anna.weber@acme.com | demo1234 | ESG Manager |
| marco.rossi@acme.com | demo1234 | Data Engineer |
| admin@acme.com | admin1234 | Admin |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login/` | Obtain access + refresh tokens |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token |
| POST | `/api/v1/auth/refresh/` | Rotate access token |
| GET  | `/api/v1/auth/me/` | Current user profile |

### Emissions
| Method | Endpoint | Description |
|---|---|---|
| GET  | `/api/v1/emissions/records/` | List records (filterable, paginated) |
| GET  | `/api/v1/emissions/records/{id}/` | Single record |
| POST | `/api/v1/emissions/records/{id}/review/` | Approve / Reject / Flag |
| POST | `/api/v1/emissions/records/bulk-review/` | Bulk action |
| GET  | `/api/v1/emissions/dashboard/` | Dashboard stats + monthly trend |

### Ingestion
| Method | Endpoint | Description |
|---|---|---|
| GET  | `/api/v1/ingestion/sources/` | List data sources |
| POST | `/api/v1/ingestion/sources/{id}/sync/` | Trigger sync |
| POST | `/api/v1/ingestion/files/` | Upload file (multipart) |
| GET  | `/api/v1/ingestion/files/` | Upload history |

### Audit
| Method | Endpoint | Description |
|---|---|---|
| GET  | `/api/v1/audits/logs/` | Immutable audit log (filterable) |

#### Common query parameters
```
?status=pending&scope=2&risk_level=high
&date_from=2024-01-01&date_to=2024-12-31
&facility=Berlin&search=natural+gas
&ordering=-created_at&page=1&page_size=25
```

---

## 🏗 Data Ingestion Pipeline

```
File Upload (CSV / XLSX / PDF)
  │
  ▼
IngestionPipeline.run()
  │
  ├─ Column mapping  (fuzzy alias resolution)
  ├─ Date parsing    (multiple format support)
  ├─ Unit normalization (L→m³, MWh→kWh …)
  ├─ Emission factor lookup (IPCC AR6)
  ├─ CO₂e calculation
  └─ Anomaly scoring (σ vs. 90-day baseline)
       ├─ score < 0.3  → LOW risk, status = pending
       ├─ score < 0.7  → MEDIUM risk, status = pending
       └─ score ≥ 0.7  → HIGH risk,   status = flagged
```

---

## 🧪 Running Tests

```bash
cd backend
python manage.py test apps --verbosity=2
```

---

## 🛠 Tech Stack

### Backend
- **Django 5** + **Django REST Framework**
- **PostgreSQL 16** (via psycopg2)
- **Redis 7** (cache + Celery broker)
- **Celery 5** (async ingestion tasks)
- **SimpleJWT** (JWT with token blacklist)
- **django-filter** (declarative filtering)

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (utility-first styling)
- **Recharts** (data visualization)
- **Axios** (HTTP client with auto-refresh)
- **TanStack Query** (server state)
- **Framer Motion** (animations)
- **Lucide React** (icons)

---

## 🗄 Database Schema

```
organizations ──┬── users
                ├── data_sources ── uploaded_files ── emission_records
                └── audit_logs
```

Key design decisions:
- **UUID primary keys** on all tables
- **ATOMIC_REQUESTS** ensures each request is one transaction
- **Indexes** on `(organization, status)`, `(organization, scope)`, `activity_date`, `risk_level`
- **raw_data JSON** preserves original import row for full traceability
- **AuditLog** is append-only — no updates, no deletes

---

## 🔒 Security

- JWT access tokens expire in 60 minutes (configurable)
- Refresh tokens rotate and are blacklisted on use
- All queryset filtering is organization-scoped (row-level isolation)
- File uploads validated by size and MIME type
- CORS restricted to configured origins
- Passwords hashed with Django's PBKDF2-SHA256

---

## 📦 Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all available configuration options.

---

## 📄 License

MIT — see `LICENSE` for details.
