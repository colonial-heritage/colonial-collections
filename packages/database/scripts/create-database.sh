#!/bin/bash

read -p "What is the mysql docker container name? [mysql]: " container_name
container_name=${container_name:-mysql}

read -p "What is the new database name? [datahub_development]: " database_name
database_name=${database_name:-datahub_development}

read -p "What is the mysql username? [root]: " user_name
user_name=${user_name:-root}

read -p "What is the mysql password?: " password

docker exec ${container_name} mysql -u ${user_name} -p${password} -e "CREATE DATABASE ${database_name};" && 
echo "Database created successfully" &&
echo "DATABASE_URL='mysql://${user_name}:${password}@localhost:3306/${database_name}'"