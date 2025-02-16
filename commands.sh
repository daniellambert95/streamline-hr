
# Docker Commands

# Run this command to stop the containers and remove the volumes
docker-compose down -v

docker volume prune

# Run this command to build the images and start the containers / {-d} in detached mode
docker-compose up --build
docker-compose up -d --build

# Run this command to list all running containers
docker ps

# Run this command to list all containers
docker ps -a

# Run this command ro remove images
docker rmi -f 

# 
docker system prune -a

# Run this command to connect to the database
docker exec -it postgres_streamline_hr psql -U streamlinehr -d streamline_hr_db


# PostgreSQL Database Commands
SELECT * FROM job_listings WHERE company_id IN (SELECT id FROM companies WHERE user_id = 1 );

# Run this command to connect to the database
docker exec -it postgres_streamline_hr psql -U streamlinehr -d streamline_hr_db

# Run this command to list all users
\du

# Run this command to list all databases
\l

# Run this command to list all tables
\dt

# Run this command to list all schemas
\dn
