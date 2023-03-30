# Dataset Browser

## Prerequisites

1. Node.js version 18+
1. NPM version 8+

## Without Docker

### Install packages

    npm install --no-progress

### Run development server

    npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Create production build (for testing locally)

Create the file `.env.production.local` in the root and set the endpoint URLs:

    SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL=
    SEARCH_PLATFORM_SPARQL_ENDPOINT_URL=

Then run:

    npm run build

### Run production server (for testing locally)

    npm run start

## With Docker

### Run container (optional)

    docker run --rm -it -v "$PWD":/app -w /app node:18 /bin/bash

### Install packages

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm install --no-progress

### Run development server

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 node:18 npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Create production build (for testing locally)

Create the file `.env.production.local` in the root and set the endpoint URLs:

    SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL=
    SEARCH_PLATFORM_SPARQL_ENDPOINT_URL=

Then run:

    docker run --rm -it -v "$PWD":/app -w /app node:18 npm run build

### Run production server (for testing locally)

    docker run --rm -it -v "$PWD":/app -w /app -p 3000:3000 node:18 npm run start

## With Docker, using Development Containers within VS Code

See https://code.visualstudio.com/docs/devcontainers/containers

1. Install the [Dev Containers extension](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension)
2. Run the Development Container
