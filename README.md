# OpsByRazi — Application and CI Foundations

OpsByRazi is a small user-management application built with React, Express, TypeScript, and PostgreSQL. It brings together an API, a browser interface, a Docker-based database environment, and GitHub Actions lint/build automation.

## Implemented features

- Create users through a React form and display newly added entries.
- Retrieve stored users through `GET /users` and create them through `POST /users`.
- Validate that a name is provided and use a parameterized SQL insert.
- Expose `GET /healthz` for a basic application health response.
- Initialize a PostgreSQL database with the included SQL schema and persist it in a Docker volume.
- Run separate frontend and backend lint/build jobs on pushes to `main`.

## Architecture and workflow

```text
React + Vite browser interface
            | HTTP / Axios
Express + TypeScript API
            | node-postgres
PostgreSQL 17 in Docker
```

The frontend sends a name to the API, which inserts a user and returns its generated ID and name. The browser adds that returned entry to its displayed list. The list endpoint reads stored users from PostgreSQL.

| Directory | Responsibility |
| --- | --- |
| [`frontend/`](frontend) | React UI, Axios client, Vite build, and frontend lint configuration. |
| [`backend/`](backend) | Express routes, input handling, and PostgreSQL access. |
| [`infra/`](infra) | PostgreSQL Compose service and initial `users` table. |
| [`.github/workflows/`](.github/workflows) | GitHub Actions CI configuration. |

Docker Compose currently runs **PostgreSQL only**. Frontend and backend development servers run locally.

## Setup and usage

Requirements: Node.js **22.12+**, npm, and Docker with Compose. Run commands from the repository root unless a directory change is shown.

Start PostgreSQL:

```bash
docker compose -f infra/docker-compose.yaml up -d
```

Create an untracked `backend/.env` with the following settings, replacing angle-bracket placeholders with the local values configured in [`infra/docker-compose.yaml`](infra/docker-compose.yaml):

```dotenv
DATABASE_URL=postgresql://<db_user>:<db_password>@localhost:5432/<db_name>
PORT=3000
```

The compose file supplies development database defaults. The SQL initialization script runs when PostgreSQL first initializes an empty data volume.

Start the API in one terminal:

```bash
cd backend
npm ci
npm run dev
```

Create an untracked `frontend/.env` if you want to set the API address explicitly:

```dotenv
VITE_API_URL=http://localhost:3000
```

Then start the frontend in another terminal, beginning at the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. These instructions use the development scripts from the package manifests.

To inspect the API:

```bash
curl http://localhost:3000/healthz
curl http://localhost:3000/users
```

`POST /users` accepts a JSON body such as `{"name":"Example User"}`. The health endpoint confirms that the HTTP application responds; it does not check the database connection.

## Existing checks

Run the following from **each** of `backend/` and `frontend/`:

```bash
npm ci
npm run lint
npm run build
```

The [CI workflow](.github/workflows/ci.yaml) runs these commands in a two-application matrix on Ubuntu using Node.js 20. It triggers on pushes to `main`; the pull-request trigger is currently commented out. It performs linting and compilation/builds, with no automated test or deployment step.

See [GitHub Actions](https://github.com/raziullah7/OpsByRazi/actions) for recorded CI results. The commands here document the configured checks rather than asserting a fresh execution.

## Current status

This project demonstrates application integration, Docker-based local database setup, and continuous integration. Its API currently supports creating and listing users. Automated application tests, update/delete operations, application container images, and deployment automation are outside the current implementation.
