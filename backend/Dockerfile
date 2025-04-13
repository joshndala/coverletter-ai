FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make the startup script executable
RUN chmod +x start.sh

# Create a non-root user
RUN useradd -m appuser
# Ensure the user has permission to execute the script
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Command to run the application with migrations
CMD ["./start.sh"] 