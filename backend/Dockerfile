# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies + uv
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir uv

# Copy uv project files
COPY pyproject.toml uv.lock ./

# Install dependencies with uv (much faster and more reliable)
RUN uv sync --frozen --no-cache --no-dev

# Copy the application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the app with uv
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]