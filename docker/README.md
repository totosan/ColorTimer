# Docker Development Environment

This directory contains Docker configurations and scripts following best practices for containerizing the ColorTimer PWA.

## 📁 Structure

```
docker/
├── nginx/
│   ├── nginx.conf      # Main nginx configuration
│   └── default.conf    # Virtual host configuration
scripts/docker/
├── build.sh           # Development build script
└── deploy.sh          # Production deployment script
Dockerfile             # Multi-stage production dockerfile
docker-compose.yml     # Local development compose
.dockerignore         # Docker build context exclusions
```

## 🚀 Quick Start

### Local Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or use the enhanced build script
./scripts/docker/build.sh

# Development mode with hot reload
docker-compose --profile dev up
```

### Production Deployment

```bash
# Set your registry
export REGISTRY="your-registry.com"

# Build and deploy
./scripts/docker/deploy.sh
```

## 🛠️ Available Scripts

### `scripts/docker/build.sh`

Enhanced build script with security and best practices:

- **Security**: Runs as non-root user, read-only filesystem
- **Resource limits**: Memory and CPU constraints
- **Health checks**: Built-in monitoring
- **Optimizations**: Multi-stage builds, layer caching

Options:
- `--help` - Show usage
- `--cleanup-only` - Only cleanup, don't build
- `--build-only` - Only build, don't run
- `--no-cache` - Build without cache

Environment variables:
- `IMAGE_NAME` - Docker image name (default: color-timer)
- `IMAGE_TAG` - Image tag (default: latest)
- `CONTAINER_NAME` - Container name (default: color-timer-app)
- `PORT` - Host port (default: 8080)

### `scripts/docker/deploy.sh`

Production deployment script:

- **Multi-registry support**: Docker Hub, AWS ECR, GCR, DigitalOcean
- **Versioning**: Automatic timestamp-based versioning
- **Deployment configs**: Generates K8s, Docker Compose, Cloud Run configs
- **Security**: Best practices for production deployments

Required:
- `REGISTRY` - Container registry URL

Optional:
- `IMAGE_NAME` - Image name
- `VERSION` - Version tag

## 🔧 Configuration

### Dockerfile Features

- **Multi-stage build**: Separate build and runtime environments
- **Security hardened**: Non-root user, read-only filesystem
- **Optimized**: Minimal final image size (~25MB)
- **Health checks**: Built-in health monitoring
- **Labels**: OCI-compliant metadata

### Nginx Configuration

- **Performance**: Gzip compression, static asset caching
- **Security**: Security headers, CSP, rate limiting
- **PWA support**: Proper routing for Single Page Applications
- **Health endpoint**: `/health` for monitoring

### Docker Compose

- **Development**: Hot reload support with `--profile dev`
- **Production**: Resource limits, security options
- **Health checks**: Container health monitoring
- **Volumes**: Proper tmpfs mounts for security

## 🔒 Security Features

- **Non-root execution**: Runs as nginx user (UID 101)
- **Read-only filesystem**: Prevents runtime modifications
- **No new privileges**: Security escalation prevention
- **Tmpfs mounts**: Writable directories in memory
- **Security headers**: XSS, CSRF, clickjacking protection
- **Content Security Policy**: Strict CSP headers

## 📊 Monitoring

### Health Checks

- **Container**: Built-in Docker health checks
- **Application**: `/health` endpoint
- **Kubernetes**: Liveness and readiness probes

### Logging

- **Structured logs**: JSON format for log aggregation
- **Access logs**: nginx request logging
- **Error logs**: Application error tracking

## 🌐 Deployment Targets

### Docker Compose
```bash
cd deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
kubectl apply -f deploy/k8s-deployment.yml
```

### Cloud Run (Google Cloud)
```bash
cd deploy
./deploy-cloud-run.sh
```

### AWS ECS/Fargate
```bash
# Use generated task definition
aws ecs register-task-definition --cli-input-json file://deploy/ecs-task-definition.json
```

## 🔧 Customization

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Container port | `8080` |

### Build Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `BUILD_DATE` | Build timestamp | Current time |
| `VCS_REF` | Git commit hash | `unknown` |
| `VERSION` | Application version | `latest` |

## 📈 Performance

- **Image size**: ~25MB final image
- **Memory usage**: ~64MB runtime
- **CPU usage**: Minimal, optimized for static serving
- **Build time**: ~30 seconds with caching

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Check Docker daemon is running
2. **Health check fails**: Verify port 8080 is accessible
3. **Permission denied**: Ensure scripts are executable
4. **Push fails**: Check registry credentials

### Debug Commands

```bash
# View container logs
docker logs color-timer-app

# Shell into container
docker exec -it color-timer-app sh

# Check health status
curl http://localhost:8080/health

# Inspect container
docker inspect color-timer-app
```

## 🔄 Migration from Old Setup

Old files are deprecated and can be removed:
- `build-docker.sh` → `scripts/docker/build.sh`
- `deploy-production.sh` → `scripts/docker/deploy.sh`
- `nginx.conf` → `docker/nginx/nginx.conf`

The new structure provides:
- Better organization
- Enhanced security
- Production-ready configurations
- Comprehensive monitoring
- Multi-platform support
