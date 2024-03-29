#!/bin/bash

# This script creates a new database in the MySQL container.
# This is only needed for local development.

read -p "What is the MySQL Docker container name? [mysql]: " container_name
container_name=${container_name:-mysql}

read -p "What is the new database name? [datahub_development]: " database_name
database_name=${database_name:-datahub_development}

read -p "What is the MySQL username? [root]: " user_name
user_name=${user_name:-root}

read -p "What is the MySQL password?: " password

docker exec ${container_name} mysql --user="${user_name}" --password="${password}" -e "CREATE DATABASE ${database_name};" && 
  echo "Database created successfully" &&
  echo "Add the credentials to the DATABASE_URL in the env file using the following format:" &&
  echo "mysql://{user_name}:{password}@localhost:3306/{database_name}"