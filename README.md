# Colonial Collections

This repository contains the frontend applications of Colonial Collections.

## Development

### Develop without Docker

#### Prerequisites

1. Node.js version 18
1. NPM version 8+

The following commands will run for all the workspaces. If you want to run a command for one workspace add the `-w` argument. For example, to add a package to the dataset-browser:

    npm install myPackage --save-exact -w dataset-browser

#### Install packages

    npm install

#### Run development server

    npm run dev

Open:

- the Dataset Browser on [http://localhost:3000](http://localhost:3000)
- the Research app on [http://localhost:3001](http://localhost:3001)

#### Create production build (for testing locally)

Create the file `apps/dataset-browser/.env.production.local` and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=
    SENDGRID_API_KEY=
    TO_EMAIL_ADDRESS=
    FROM_EMAIL_ADDRESS=

Create the file `apps/researcher/.env.production.local` and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=
    NANOPUB_WRITE_ENDPOINT_URL=
    NANOPUB_WRITE_PROXY_ENDPOINT_URL=
    NANOPUB_SPARQL_ENDPOINT_URL=
    DATASET_BROWSER_URL=
    SENDGRID_API_KEY=
    TO_EMAIL_ADDRESS=
    FROM_EMAIL_ADDRESS=
    GEONAMES_USERNAME=

Then run:

    npm run build

#### Run production server (for testing locally)

    npm run start

### Develop with Docker

#### Install packages

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm install --no-progress

#### Run container

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env.local node:18 /bin/bash

#### Connect to the MySQL server

Add the environment variable `DATABASE_URL` to `apps/researcher/.env.local`. More information about connecting to the database is in the [database readme](packages/database/README.md).

#### Use the Nanopublications infrastructure for storing and retrieving user enrichments

Add the environment variables `NANOPUB_WRITE_ENDPOINT_URL`, `NANOPUB_WRITE_PROXY_ENDPOINT_URL` and `NANOPUB_SPARQL_ENDPOINT_URL` to `apps/researcher/.env.local`.

#### Run development server

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 -p 3001:3001 node:18 npm run dev

Open:

- the Dataset Browser on [http://localhost:3000](http://localhost:3000)
- the Research app on [http://localhost:3001](http://localhost:3001)

#### Create production build (for testing locally)

Create the file `.env.production.local` in the root and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=
    NANOPUB_WRITE_ENDPOINT_URL=
    NANOPUB_WRITE_PROXY_ENDPOINT_URL=
    NANOPUB_SPARQL_ENDPOINT_URL=
    DATASET_BROWSER_URL=
    SENDGRID_API_KEY=
    TO_EMAIL_ADDRESS=
    FROM_EMAIL_ADDRESS=
    GEONAMES_USERNAME=

Then run:

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm run build

#### Run production server (for testing locally)

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 -p 3001:3001 node:18 npm run start
