# Colonial Collections

## What's inside?

This repo uses [Turborepo](https://turbo.build/) as build system and [npm](https://www.npmjs.com/) as package manager. It includes the following apps and packages:

### Apps

- `dataset-browser`: The Dataset Browser
- `researcher`: The Research App

### Packages

- `eslint-config-custom`: `eslint` configurations
- `iris`: helper functions for working with IRIs
- `tailwind-config`: Tailwind config used by both the apps and the `ui` package
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `ui`: a React component library shared by the apps

## Prerequisites

1. Node.js version 18
1. NPM version 8+

## Without Docker

The following commands will run for all the workspaces. If you want to run a command for one workspace add the -w command.

For example, to add a package to the dataset-browser:

    npm install myPackage --save-exact -w dataset-browser

### Install packages

Install all the packages.

    npm install

### Run development server

    npm run dev

Open:

- the Dataset Browser on [http://localhost:3000](http://localhost:3000)
- the Research app on [http://localhost:3001](http://localhost:3001)

### Create production build (for testing locally)

Create the file `apps/dataset-browser/.env.production.local` and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=

Create the file `apps/researcher/.env.production.local` and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=
    NANOPUB_WRITE_ENDPOINT_URL=
    NANOPUB_WRITE_PROXY_ENDPOINT_URL=
    NANOPUB_SPARQL_ENDPOINT_URL=

Then run:

    npm run build

### Run production server (for testing locally)

    npm run start

## With Docker

### Run container (optional)

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env.local node:18 /bin/bash

### Connect to the MySQL server

Add the environment variable `DATABASE_URL` to `apps/researcher/.env.local`. More information about connecting to the database is in the [database readme](packages/database/README.md).

### Use the Nanopublications infrastructure for storing and retrieving user enrichments

Add the environment variables `NANOPUB_WRITE_ENDPOINT_URL`, `NANOPUB_WRITE_PROXY_ENDPOINT_URL` and `NANOPUB_SPARQL_ENDPOINT_URL` to `apps/researcher/.env.local`.

### Install packages

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm install --no-progress

### Run development server

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 -p 3001:3001 node:18 npm run dev

Open:

- the Dataset Browser on [http://localhost:3000](http://localhost:3000)
- the Research app on [http://localhost:3001](http://localhost:3001)

### Create production build (for testing locally)

Create the file `.env.production.local` in the root and set the endpoint URLs:

    SEARCH_ENDPOINT_URL=
    SPARQL_ENDPOINT_URL=
    NANOPUB_WRITE_ENDPOINT_URL=
    NANOPUB_WRITE_PROXY_ENDPOINT_URL=
    NANOPUB_SPARQL_ENDPOINT_URL=

Then run:

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm run build

### Run production server (for testing locally)

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 -p 3001:3001 node:18 npm run start

## With Docker, using Development Containers within VS Code

See https://code.visualstudio.com/docs/devcontainers/containers

1. Install the [Dev Containers extension](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension)
2. Run the Development Container
