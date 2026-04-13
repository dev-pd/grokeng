# Backend (FastAPI)

FastAPI service for lead CRUD + Grok-powered analysis/message generation.

## Requirements

- Python 3.12+
- MySQL 8+

## Environment

Copy and edit:

```bash
cp .env.example .env
```

Required:

- `GROK_API_KEY`
- `MYSQL_PASSWORD`

## Run locally (without Docker)

```bash
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Run with Docker Compose

From repo root:

```bash
docker compose up --build backend
```

## API

- Health: `GET /health`
- Docs: `GET /docs`

### Leads

- `GET /api/v1/leads/`
- `POST /api/v1/leads/`
- `GET /api/v1/leads/{id}`
- `PUT /api/v1/leads/{id}`
- `DELETE /api/v1/leads/{id}`
- `GET /api/v1/leads/stats/summary`

### Grok

- `POST /api/v1/grok/analyze-lead/{lead_id}`
- `POST /api/v1/grok/generate-message/{lead_id}?message_type=email|linkedin|call|meeting`
- `POST /api/v1/grok/qualify-lead/{lead_id}`
- `GET /api/v1/grok/test-connection`

### Messages

- `GET /api/v1/messages/`
- `POST /api/v1/messages/`
- `GET /api/v1/messages/{message_id}`
- `PUT /api/v1/messages/{message_id}`
- `DELETE /api/v1/messages/{message_id}`
- `GET /api/v1/messages/stats/summary`

