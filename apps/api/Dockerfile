FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Shell form — expands $PORT env var. Falls back to 8000 for local docker runs.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
