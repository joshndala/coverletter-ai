#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database to be ready..."
python -c "
import sys
import time
import psycopg2
from config.settings import settings

for i in range(30):
    try:
        conn = psycopg2.connect(settings.DATABASE_URL)
        conn.close()
        break
    except psycopg2.OperationalError:
        print(f'Attempt {i+1}/30: Database not ready yet, waiting...')
        time.sleep(2)
else:
    print('Database connection failed after 30 attempts')
    sys.exit(1)
"

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 