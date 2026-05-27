# 🚀 CarbonTrace — Hosting & Deployment Guide

---

## Option 1 — Docker Compose (Self-Hosted VPS)

### Providers: DigitalOcean, Hetzner, Linode, AWS EC2

```bash
# 1. Provision Ubuntu 22.04 server (min 2 GB RAM)
# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker

# 3. Clone & configure
git clone https://github.com/your-org/carbontrace.git
cd carbontrace
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# 4. Build and start
docker compose up -d --build

# 5. Migrate + seed
docker compose exec api python manage.py migrate
docker compose exec api python manage.py createsuperuser
docker compose exec api python manage.py shell < scripts/seed.py

# 6. App is live at http://YOUR_SERVER_IP:5173
# 7. Point your domain via Nginx reverse proxy (see below)
```

---

## Option 2 — Render.com (Easiest, Free Tier Available)

### Backend (Django)
1. New → **Web Service** → connect GitHub repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
4. Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables from `.env.example`
6. Add **PostgreSQL** database → copy `DATABASE_URL` to env vars
7. Add **Redis** (Render Redis) → copy URL to `CELERY_BROKER_URL`

### Frontend (React/Vite)
1. New → **Static Site** → connect GitHub repo
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_URL=https://your-api.onrender.com/api/v1`

---

## Option 3 — Railway.app (One-click deploy)

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy backend
cd backend
railway init
railway add --database postgresql
railway add --database redis
railway up

# Deploy frontend
cd ../frontend
railway init
railway up
```

Set env vars in Railway dashboard → Variables tab.

---

## Option 4 — AWS (Production-Grade)

```
Architecture:
  Route 53 → CloudFront → S3 (frontend static)
                        → ALB → ECS Fargate (Django API)
                                           → ElastiCache Redis
                                           → RDS PostgreSQL
```

```bash
# Using AWS Copilot
brew install aws/tap/copilot-cli
copilot app init carbontrace
copilot svc init --name api --svc-type "Load Balanced Web Service" --dockerfile backend/Dockerfile
copilot svc init --name worker --svc-type "Worker Service" --dockerfile backend/Dockerfile
copilot env init --name production
copilot svc deploy --name api --env production
```

---

## Option 5 — Vercel (Frontend) + Fly.io (Backend)

### Frontend → Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
# Set VITE_API_URL=https://carbontrace-api.fly.dev/api/v1
```

### Backend → Fly.io
```bash
cd backend
brew install flyctl
fly auth login
fly launch --name carbontrace-api
fly postgres create --name carbontrace-db
fly redis create --name carbontrace-redis
fly secrets set SECRET_KEY=your-secret DATABASE_URL=postgres://...
fly deploy
fly ssh console -C "python manage.py migrate && python manage.py shell < scripts/seed.py"
```

---

## Nginx Reverse Proxy (Self-Hosted)

```nginx
# /etc/nginx/sites-available/carbontrace
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass         http://localhost:5173;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }

    # API
    location /api/ {
        proxy_pass         http://localhost:8000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 55M;
    }

    # Static / media
    location /static/ { alias /app/staticfiles/; expires 1y; }
    location /media/  { alias /app/media/; }
}
```

```bash
# SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Production Checklist

- [ ] `DEBUG=False` in backend `.env`
- [ ] Strong `SECRET_KEY` (50+ random chars)
- [ ] `ALLOWED_HOSTS` set to your domain
- [ ] `CORS_ALLOWED_ORIGINS` set to frontend URL only
- [ ] PostgreSQL with SSL connection
- [ ] Redis password configured
- [ ] HTTPS/SSL certificate active
- [ ] `python manage.py collectstatic` run
- [ ] Celery worker running
- [ ] Health check endpoint responding at `/api/v1/`
- [ ] Backups configured for PostgreSQL
- [ ] Log aggregation (Sentry, Datadog, or CloudWatch)
- [ ] Rate limiting on auth endpoints

---

## Environment Variables Quick Reference

| Variable | Example | Required |
|---|---|---|
| `SECRET_KEY` | `abc123...` (50+ chars) | ✅ |
| `DEBUG` | `False` | ✅ |
| `DATABASE_URL` | `postgres://user:pass@host/db` | ✅ |
| `REDIS_URL` | `redis://:pass@host:6379/0` | ✅ |
| `CORS_ALLOWED_ORIGINS` | `https://app.yourdomain.com` | ✅ |
| `ALLOWED_HOSTS` | `api.yourdomain.com` | ✅ |
| `CELERY_BROKER_URL` | same as REDIS_URL | ✅ |
| `JWT_ACCESS_MINUTES` | `60` | optional |
| `JWT_REFRESH_DAYS` | `30` | optional |
| `ANOMALY_SIGMA_THRESHOLD` | `3.0` | optional |
