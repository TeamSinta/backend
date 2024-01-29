# Initialization Commands

.PHONY: build-dev
build-dev:
	docker compose -f docker-compose-dev.yaml build

# Installation Commands
.PHONY: install
install:
	cd api && poetry install --verbose

.PHONY: install-pre-commit
install-pre-commit:
	cd api && poetry run pre-commit uninstall; poetry run pre-commit install -c ../.pre-commit-config.yaml

# Migrations
.PHONY: migrations
makemigrations: check-backend
	docker compose exec backend python manage.py makemigrations

.PHONY: migrate
migrate: check-backend
	docker compose exec backend python manage.py migrate

# Linting
.PHONY: lint
lint:
	cd api && poetry run pre-commit run --all-files

# Run Commands
.PHONY: run-dev
run-dev:
	docker compose -f docker-compose-dev.yaml up

# Run Commands
.PHONY: run-staging
run-staging:
	docker compose -f docker-compose-staging.yaml up

# Seed Commands
.PHONY: superuser
superuser:
	docker compose -f docker-compose-dev.yaml exec backend python manage.py createsuperuser

.PHONY: seed-users
seed-users:
	@echo "Seeding users to local db...."
	docker compose -f docker-compose-dev.yaml exec backend python manage.py seed_users

.PHONY: seed-questions
seed-questions:
	@echo "Seeding questions to local db...."
	docker compose -f docker-compose-dev.yaml exec backend python manage.py seed_questions

.PHONY: seed-templates
seed-templates:
	@echo "Seeding templates to local db...."
	docker compose -f docker-compose-dev.yaml exec backend python manage.py seed_templates

.PHONY: seed-interviews
seed-interviews:
	@echo "Seeding interviews to local db...."
	docker compose -f docker-compose-dev.yaml exec backend python manage.py seed_interviews

.PHONY: seed-dev
seed-dev:
	@echo "Seeding the backend database..."
	make seed-users seed-questions seed-templates seed-interviews

.PHONY: migrate_db
migrate_db:
	@echo "Migrating old DB to new DB..."
	docker compose -f docker-compose-dev.yaml exec backend python manage.py migrate_db

# Setup Command
.PHONY: setup
setup:
	make install install-pre-commit build-dev run-dev makemigrations migrate
