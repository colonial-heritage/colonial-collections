# Object Lists

This package is the database connector needed to read and write object lists. To connect to the database via the researcher app, ensure the environment variable DATABASE_URL is set in `apps/researcher/.env.local`. If you want to connect to the database outside the app to run scripts, add the DATABASE_URL to `packages/object-lists/.env.local`.

# Option 1: Connecting with PlanetScale 

If you are not planning to alter the database. Connecting to the PlanetScale development database is the easiest option. You can find the needed DATABASE_URL in Vercel.

# Option 2: Connecting with a local MySQL database (docker).

You can create a MySQL database with docker if you prefer using a local database. For example, if you want to test migrations. Use the following command to start your MySQL container. It will create a new Docker volume called MySQL. 

    docker run --name mysql -d \
        -p 3306:3306 \
        -e MYSQL_ROOT_PASSWORD=change-me \
        -v mysql:/var/lib/mysql \
        mysql:8

More commands can be found in the helpful blog [How to Use Docker for Your MySQL Database](https://earthly.dev/blog/docker-mysql/).

Create a new database with:

    docker exec -it mysql mysql -p
    mysql> CREATE DATABASE local_database_name

Set the DATABASE_URL to:

      DATABASE_URL='mysql://root:{password}@localhost:3306/{database_name}'

# Schema updates

Whenever you apply changes to the schema, you need to run `npm run db:generate`, which will generate SQL migration for you.

To push the changes to your local database, run `npm run db:push`.

# Drizzle Studio

With Drizzle Studio, you can explore the SQL database. Depending on the DATABASE_URL, you can explore both local and PlanetScale databases. Open Drizzle Studio with `npm run db:studio -w object-lists`.
