# OpsByRazi

A small learning project connecting **React, Express, TypeScript, and PostgreSQL**.

## Implemented

- A React form creates users and adds returned entries to its displayed list.
- `POST /users` creates a user; `GET /users` lists stored users.
- Basic name validation and a parameterised SQL insert.
- `GET /healthz` checks the HTTP application, not database connectivity.
- Docker Compose runs PostgreSQL; the frontend and API run locally.
- GitHub Actions runs separate frontend/backend lint and build jobs.

## Run locally

Requires Node.js 22.12+, npm, and Docker Compose. Follow the [environment and setup guide](docs/SETUP.md).

```bash
docker compose -f infra/docker-compose.yaml up -d
```

After setting the documented environment variables, run `npm ci` and `npm run dev` separately in `backend/` and `frontend/`.

## Checks and limits

Run `npm run lint` and `npm run build` in each application directory. [CI](.github/workflows/ci.yaml) currently uses Node.js 20 and runs on pushes to `main`; this documentation update did not rerun it.

The current API provides create/list operations. Automated application tests, update/delete operations, application containers, and deployment automation are not implemented.

[Frontend](frontend) · [API](backend) · [Database configuration](infra)

