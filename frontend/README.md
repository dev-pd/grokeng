# Frontend (React + Vite)

UI for the Grok SDR system.

## Environment

Copy and edit:

```bash
cp .env.example .env
```

Required:

- `VITE_API_URL` (backend origin, e.g. `http://localhost:8000`)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- API configuration is centralized in `src/config/apiConfig.ts`.
- The API client uses an in-memory auth token (`setAuthToken`) to avoid defaulting to `localStorage`.

