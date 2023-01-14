# Dataset Browser

## Run container

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env node:18 /bin/bash

## Install packages

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env node:18 npm install --no-progress

## Run development server

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env -p 3000:3000 node:18 npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Create production build

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env node:18 npm run build

## Run production server (for testing locally)

    docker run --rm -it -v "$PWD":/app -w /app --env-file .env -p 3000:3000 node:18 npm run start
