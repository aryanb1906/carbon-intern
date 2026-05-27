SHELL := /bin/bash

.PHONY: help backend-install backend-migrate backend-seed backend-run backend-test frontend-install frontend-run docker-up docker-down

help:
	@echo "Makefile targets:"
	@echo "  backend-install    - create venv and install backend deps"
	@echo "  backend-migrate    - run Django migrations"
	@echo "  backend-seed       - seed demo data (runs seed.py)"
	@echo "  backend-run        - run Django development server"
	@echo "  backend-test       - run backend tests"
	@echo "  frontend-install   - install frontend packages"
	@echo "  frontend-run       - run frontend dev server"
	@echo "  docker-up          - docker compose up --build"
	@echo "  docker-down        - docker compose down"

backend-install:
	python -m venv .venv
	. .venv/bin/activate && pip install --upgrade pip && pip install -r backend/requirements.txt

backend-migrate:
	cd backend && . ../.venv/bin/activate && python manage.py migrate

backend-seed:
	cd backend && . ../.venv/bin/activate && python manage.py shell < scripts/seed.py

backend-run:
	cd backend && . ../.venv/bin/activate && python manage.py runserver 0.0.0.0:8000

backend-test:
	cd backend && . ../.venv/bin/activate && python manage.py test

frontend-install:
	cd frontend && npm install

frontend-run:
	cd frontend && npm run dev

docker-up:
	docker compose up --build

docker-down:
	docker compose down -v
