# Use Ubuntu as base image
FROM ubuntu:22.04

# Update and install required packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy PocketBase binary
COPY pocketbase.exe pocketbase

# Make it executable
RUN chmod +x pocketbase

# Copy database and migrations if they exist
COPY pb_data ./pb_data
COPY pb_migrations ./pb_migrations

# Expose port
EXPOSE 8090

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8090/api/health || exit 1

# Set default port
ENV PORT=8090

# Start PocketBase with dynamic port
CMD sh -c "./pocketbase serve --http=0.0.0.0:${PORT}"