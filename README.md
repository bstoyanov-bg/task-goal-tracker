# task-goal-tracker
A web app where users can create goals, break them into tasks, track progress, and manage everything via a clean UI.
## Running PostgreSQL with Docker
docker run --name task-tracker-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=task_tracker_db -p 5432:5432 -d postgres:latest