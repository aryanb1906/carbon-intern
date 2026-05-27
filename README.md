# 🌿 CarbonTrace — Enterprise ESG Data Ingestion & Audit Platform

CarbonTrace is a full-stack platform for ingesting, normalizing, and auditing Scope 1/2/3 emissions data. This repository contains a Django REST API backend and a React + Vite frontend designed for data teams and sustainability workflows.

**What’s in this repo**
- `backend/` — Django API, ingestion pipeline, Celery tasks, deployment config
- `frontend/` — React + Vite dashboard, reusable UI components
- `docker-compose.yml` — local multi-service environment for quick testing

**Key improvements in this branch**
- `gunicorn` added to `backend/requirements.txt` so production servers can run the Django app
- Root health endpoint added (`/`) so hosting platforms can detect a successful deployment

**Quick Start (Recommended: Docker)**
1. Copy example env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Build and run services:

```bash
docker compose up --build
```

3. Run migrations and seed data (optional):

```bash
docker compose exec api python manage.py migrate
docker compose exec api python manage.py shell < scripts/seed.py
```

Open the frontend at the address printed by Vite (usually `http://localhost:5173`).

**Local Development (without Docker)**
- Backend:

```bash
cd backend
python -m venv .venv
# Activate: source .venv/bin/activate  (macOS / Linux)
#           .venv\Scripts\Activate     (Windows)
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

- Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Production & Deployment Notes**
- The production entrypoint uses `gunicorn` to serve Django. Confirm `gunicorn` exists in `backend/requirements.txt` (it does).
- Default Gunicorn command:

```
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

- Health checks: a lightweight root endpoint (`/`) returns HTTP 200. If your hosting provider probes a different path (e.g., `/`), either point the health check to `/` or change the probed path to `/health/`.

**Environment variables**
- Copy and edit `backend/.env.example` and `frontend/.env.example`.
- Common keys:
  - `DATABASE_URL` — PostgreSQL connection string
  - `SECRET_KEY` — Django secret
  - `DEBUG` — `True` for local dev, `False` in production
  - `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND` — Redis URLs for Celery

**Running tests**

```bash
cd backend
python manage.py test
```

**Troubleshooting**
- `gunicorn: command not found` — add `gunicorn` to `backend/requirements.txt` and redeploy (done in this branch).
- Health-check 404 — ensure your platform probes `/` or change it to `/health/`.

**Where to look**
- Backend code: `backend/`
- Frontend code: `frontend/`
- Backend deps: `backend/requirements.txt`

**Contributing**
- Open PRs against `main`. For large changes, open an issue first describing the approach and migration steps.

---
If you want, I can also add a `Makefile` or `scripts/` helpers to standardize the local commands above. Ready to add that next?
