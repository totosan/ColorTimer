# syntax=docker/dockerfile:1
# Multi-stage build for ColorTimer PWA

# Build arguments for metadata
ARG BUILDTIME
ARG VERSION
ARG REVISION

# Build stage
FROM node:18-alpine AS builder

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile || npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build && \
    # Verify build output exists
    ls -la dist/ && \
    # Remove unnecessary files to reduce image size
    rm -rf node_modules src scripts docs .git*

# Production stage
FROM nginx:1.25-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions for nginx user (user already exists in nginx:alpine)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Add labels for metadata
LABEL org.opencontainers.image.title="ColorTimer PWA" \
    org.opencontainers.image.description="A colorful timer PWA with customizable time phases" \
    org.opencontainers.image.version="${VERSION:-1.0.0}" \
    org.opencontainers.image.vendor="ColorTimer" \
    org.opencontainers.image.url="https://github.com/totosan/ColorTimer" \
    org.opencontainers.image.source="https://github.com/totosan/ColorTimer" \
    org.opencontainers.image.revision="${REVISION}" \
    org.opencontainers.image.created="${BUILDTIME}"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
