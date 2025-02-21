.PHONY: help setup build up down logs ps clean init db-setup env db-populate populate-db.sh

# Default target when just running 'make'
help:
	@echo "Available commands:"
	@echo "  make setup       - Complete project setup (create dirs, install deps, build containers)"
	@echo "  make build       - Build all Docker containers"
	@echo "  make up          - Start all containers in detached mode"
	@echo "  make down        - Stop and remove all containers"
	@echo "  make logs        - View logs from all containers"
	@echo "  make ps          - List running containers"
	@echo "  make clean       - Remove all containers, volumes, and node_modules"
	@echo "  make init        - Initial project setup (install dependencies)"
	@echo "  make env         - Create .env file with default values"
	@echo "  make db-setup    - Initialize database schema"
	@echo "  make db-populate - Populate database with sample data"
	
# Complete setup
setup: env build up db-setup
	@echo "Setup complete! Next steps:"
	@echo "1. Create an initial admin user through the signup page"
	@echo "2. Run './populate-db.sh' to add sample data"

# Create .env file with default values
env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		echo "POSTGRES_USER=<your_postgres_user>" > .env; \
		echo "POSTGRES_PASSWORD=<your_postgres_password>" >> .env; \
		echo "POSTGRES_DB=<your_database_name>" >> .env; \
		echo "DATABASE_URL=postgres://<user>:<password>@postgres:5432/<database>" >> .env; \
		echo "JWT_SECRET=<your_jwt_secret>" >> .env; \
		echo "NODE_ENV=development" >> .env; \
		echo ".env file created with placeholder values. Please update with your credentials."; \
	else \
		echo ".env file already exists"; \
	fi

# Build all containers
build:
	docker-compose build

# Start all containers in detached mode
up:
	docker-compose up

# Stop and remove containers
down:
	docker-compose down

# Stop and remove containers and volumes
down v:
	docker-compose down -v

# View container logs
logs:
	docker-compose logs -f

# List running containers
ps:
	docker-compose ps

# Clean everything
clean:
	docker-compose down -v
	docker system prune -f
# rm -rf server/node_modules
# rm -rf client/node_modules

# Database setup
db-setup:
	chmod +x setup-db.sh
	./setup-db.sh 

# Populate the database with sample data
populate-db.sh:
	chmod +x populate-db.sh
	./populate-db.sh 