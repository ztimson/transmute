# Transmute Server

This is the server & orchestrator for the Transmute stack.

Transmute server is built using Express.js

## Table of Contents

[[_TOC_]]

## Prerequisites

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS 18](https://nodejs.org/en/)
- _[Docker](https://docs.docker.com/install/) (Optional)_

## Setup
The project can either be run using NPM or Docker. NPM is recommended for development.
<details>
<summary>NPM</summary>

1. Install the dependencies: `npm install`
2. Start the Angular server: `npm run start`
</details>

<details>
<summary>Docker</summary>

1. Build the docker image: `docker build -t transmute-server:<TAG> .`
2. Start the new image: `docker run -p 5000:5000 transmute-server:<TAG>`

</details>

The API should now be accessible on [http://localhost:5000](http://localhost:5000)

## Cheatsheet
```bash
# Start Angular server
npm run start

# Build production
npm run build:prod

# Build docker image
docker build -t transmute-server:<TAG>

# Run docker image
docker run -p 5000:5000 transmute-server:<TAG>
```
