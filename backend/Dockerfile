FROM python:3.12-slim
WORKDIR /app

# 1. Install system dependencies (needed for Postgres drivers like psycopg2)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 2. Copy everything (This brings in pyproject.toml AND the src folder at the same time)
COPY . .

# 3. Install the project and all dependencies
RUN pip install --no-cache-dir .

# 4. Environment setup
ENV PYTHONPATH=/app/src
EXPOSE 8000


CMD ["python", "main.py"]
