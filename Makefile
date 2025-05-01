# Define Compose files
DEV_COMPOSE_FILE=docker-compose-dev.yml
DEBUG_COMPOSE_FILE=docker-compose-debug.yml
TEST_COMPOSE_FILE=docker-compose-test.yml

# Compose Up / Down
.PHONY: compose-up
compose-up:
	docker compose -f $(DEV_COMPOSE_FILE) up

.PHONY: compose-up-build
compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

.PHONY: compose-up-debug
compose-up-debug:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) up

.PHONY: compose-up-debug-build
compose-up-debug-build:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) up --build
	
.PHONY: compose-down
compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

# Build only
.PHONY: compose-build
compose-build:
	docker compose -f $(DEV_COMPOSE_FILE) build

# Run backend tests
.PHONY: run-tests
run-tests:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(TEST_COMPOSE_FILE) run --build server
