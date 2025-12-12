FROM python:3.11.11-slim

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies including pkg-config and MySQL dev headers
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        build-essential \
        libpq-dev \
        default-libmysqlclient-dev \
        pkg-config \
        python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry directly via install script
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Copy pyproject.toml and poetry.lock first to install deps early
COPY pyproject.toml poetry.lock ./

# Install Python dependencies (system-wide, no venv)
RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi && \
    rm -rf /root/.cache/pypoetry
RUN pip install matplotlib
# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 8005

# Run Gunicorn + Celery worker + Beat
CMD ["sh", "-c", "celery -A mcq_api worker --loglevel=info & celery -A mcq_api beat --loglevel=info & gunicorn mcq_api.wsgi:application --bind 0.0.0.0:8005 --timeout 300"]

