# dev-стек = базовый compose + dev-override (web/api/parsers/admin/db).
# Без override берётся только базовый (prod) compose, где admin собирается
# по prod-Dockerfile и не поднимается — поэтому все dev-цели идут через override.
DEV_COMPOSE = docker compose -f docker-compose.yml -f docker-compose.dev.override.yml

# Полная очистка docker
docker_clear:
	docker compose stop; \
	docker image rm iisdc-backend -f; \
	docker image rm mysql:5.7 -f; \
	docker image rm iisdc-parsers -f; \
	docker compose rm -f; \
	docker builder prune -f; \
	docker volume prune -f;

# запуск контейнеров (dev-стек с override + чистка orphan'ов)
docker_start:
	$(DEV_COMPOSE) up -d --remove-orphans

# зайти в контейнер бекенда
docker_backend_sh:
	$(DEV_COMPOSE) exec backend sh

# остановить контейнеры
docker_stop:
	$(DEV_COMPOSE) stop

# сделать миграцию бд (скрипты живут в apps/api, контейнер стартует в /workspace)
docker_migrate:
	$(DEV_COMPOSE) exec backend sh -c "cd apps/api && npm run prisma:migrate"

docker_apply_migrations:
	$(DEV_COMPOSE) exec backend sh -c "cd apps/api && npm run prisma:migrate:apply"

# заполнить бд тестовыми данными, запускать только если БД пустая
docker_fill:
	$(DEV_COMPOSE) exec backend sh -c "cd apps/api && npm run prisma:seed"

# сделать дамп базы данных
docker_dump:
	$(DEV_COMPOSE) exec postgres pg_dump -U app_user -d opportunity_hub > ./dump.sql

# Прод: образы собираются в CI и пушатся в ghcr.io, сервер только тянет и поднимает.
docker_prod_pull:
	docker compose -f docker-compose.prod.yml pull

docker_prod_up:
	docker compose -f docker-compose.prod.yml up -d

docker_prod_down:
	docker compose -f docker-compose.prod.yml down

# первичная инициализация схемы БД в проде.
# run --rm (а не exec): на первом деплое контейнер api в crash-loop (нет таблиц),
# exec в него не зайдёт. Одноразовый контейнер от того же образа делает db push независимо.
docker_prod_db_push:
	docker compose -f docker-compose.prod.yml run --rm api npm run prisma:migrate:apply

docker_prod_seed:
	docker compose -f docker-compose.prod.yml run --rm api npm run prisma:seed
