# Grok SDR System

AI-assisted lead management: lead CRUD + scoring/analysis/message generation via Grok, backed by FastAPI + MySQL, with a React + Vite frontend.

## Quick start (Docker)

### Prereqs

- Docker Desktop
- A Grok / xAI API key

### Setup

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit:

- `./.env`: set `MYSQL_ROOT_PASSWORD`
- `./backend/.env`: set `GROK_API_KEY` + `MYSQL_PASSWORD`
- `./frontend/.env`: set `VITE_API_URL` (backend origin, e.g. `http://localhost:8000`)

### Run

```bash
docker compose up --build
```

Then open:

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8000`
- **API docs**: `http://localhost:8000/docs`

## Services

- **frontend**: Nginx serving Vite build (port `5173`)
- **backend**: FastAPI (port `8000`)
- **mysql**: MySQL 8 (port `3307` mapped to container `3306`)

## Environment variables

### Root (`.env`) for Docker Compose

See `.env.example`.

### Backend (`backend/.env`)

See `backend/.env.example`. The important ones:

- `GROK_API_KEY` (**required**)
- `MYSQL_PASSWORD` (**required**)

### Frontend (`frontend/.env`)

See `frontend/.env.example`.

## Security notes

- **Do not commit secrets**. API keys/passwords must come from environment variables.
- The frontend API client is configured via `VITE_API_URL` and does not hardcode production URLs.

